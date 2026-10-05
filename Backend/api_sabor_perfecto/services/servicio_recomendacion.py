"""Une el catalogo de la base de datos con el motor de inferencia y arma la respuesta."""

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from core.configuracion import configuracion
from models import ConjuntoDifuso, Consulta, Platillo, Regla
from services import motor_difuso
from utiles.formato import a_porcentaje, ajuste_presupuesto, redondear
from utiles.texto import redactar_motivo
from utiles.validaciones import (
    validar_entero_positivo,
    validar_hambre,
    validar_picante,
    validar_presupuesto,
)

# Que tipos de producto se evaluan en cada modo de busqueda
TIPOS_POR_MODO = {"salado": ("comida",), "dulce": ("postre", "bebida")}


def cargar_conjuntos(sesion: Session) -> dict:
    """Lee de la base de datos los parametros de todos los conjuntos."""
    conjuntos: dict[str, dict[str, dict]] = {}
    for fila in sesion.scalars(select(ConjuntoDifuso)).all():
        conjuntos.setdefault(fila.variable, {})[fila.etiqueta] = {
            "tipo": fila.tipo,
            "puntos": (fila.punto_a, fila.punto_b, fila.punto_c, fila.punto_d),
        }
    return conjuntos


def cargar_reglas(sesion: Session, modo: str = "salado") -> list[dict]:
    """Lee las reglas activas, dejando fuera el bloque de sabor que no aplica al modo."""
    sabor_descartado = motor_difuso.BLOQUE_SABOR["dulce" if modo == "salado" else "salado"]
    consulta = select(Regla).where(
        Regla.activa.is_(True), Regla.variable != sabor_descartado
    )
    return [
        {
            "codigo": fila.codigo,
            "variable": fila.variable,
            "conjunto_usuario": fila.conjunto_usuario,
            "conjunto_platillo": fila.conjunto_platillo,
            "consecuente": fila.consecuente,
            "peso": fila.peso,
        }
        for fila in sesion.scalars(consulta).all()
    ]


def cargar_platillos(sesion: Session, modo: str = "salado") -> list[Platillo]:
    """Lee los productos activos que corresponden al modo de busqueda."""
    tipos = TIPOS_POR_MODO[modo]
    consulta = (
        select(Platillo)
        .where(Platillo.activo.is_(True), Platillo.tipo.in_(tipos))
        .options(selectinload(Platillo.categoria), selectinload(Platillo.etiquetas))
    )
    return list(sesion.scalars(consulta).all())


def armar_platillo(platillo: Platillo) -> dict:
    """Convierte un platillo del ORM en el diccionario que viaja al frontend."""
    return {
        "id": platillo.id,
        "nombre": platillo.nombre,
        "descripcion": platillo.descripcion,
        "categoria": platillo.categoria.nombre if platillo.categoria else "",
        "icono_categoria": platillo.categoria.icono if platillo.categoria else "restaurant",
        "saciedad": platillo.saciedad,
        "picor": platillo.picor,
        "dulzor": platillo.dulzor,
        "tipo": platillo.tipo,
        "precio": platillo.precio,
        "minutos_preparacion": platillo.minutos_preparacion,
        "url_imagen": platillo.url_imagen,
        "etiquetas": [etiqueta.nombre for etiqueta in platillo.etiquetas],
    }


def calcular_afinidades(platillo: dict, presupuesto: float, modo: str = "salado") -> dict[str, int]:
    """Traduce el producto a tres medidas sencillas que la interfaz muestra como barras."""
    return {
        "porcion": a_porcentaje(platillo["saciedad"]),
        "sabor": a_porcentaje(platillo["dulzor" if modo == "dulce" else "picor"]),
        "precio": ajuste_presupuesto(platillo["precio"], presupuesto),
    }


def niveles_dominantes(grados: dict[str, dict[str, float]]) -> dict[str, str]:
    """Obtiene la etiqueta mas fuerte de cada variable."""
    return {variable: motor_difuso.etiqueta_dominante(valores) for variable, valores in grados.items()}


def registrar_consulta(
    sesion: Session, hambre: float, picante: float, presupuesto: float, mejor: dict | None
) -> None:
    """Guarda la consulta en el historial para calcular los platillos populares."""
    sesion.add(
        Consulta(
            hambre=hambre,
            picante=picante,
            presupuesto=presupuesto,
            platillo_id=mejor["id"] if mejor else None,
            compatibilidad=mejor["coincidencia"] if mejor else 0.0,
        )
    )
    sesion.commit()


def recomendar(
    sesion: Session,
    hambre: float,
    sabor: float,
    presupuesto: float,
    modo: str = "salado",
    limite: int | None = None,
    guardar_historial: bool = True,
) -> dict:
    """Calcula la recomendacion principal y las demas opciones ordenadas."""
    modo = modo if modo in TIPOS_POR_MODO else "salado"
    hambre = validar_hambre(hambre)
    sabor = validar_picante(sabor)
    presupuesto = validar_presupuesto(presupuesto)
    limite = validar_entero_positivo(limite, configuracion.limite_opciones, 50)

    conjuntos = cargar_conjuntos(sesion)
    reglas = cargar_reglas(sesion, modo)
    grados_usuario = motor_difuso.fuzzificar_usuario(hambre, sabor, presupuesto, conjuntos, modo)
    niveles_usuario = niveles_dominantes(grados_usuario)

    evaluados = []
    for platillo in cargar_platillos(sesion, modo):
        datos = armar_platillo(platillo)
        resultado = motor_difuso.calcular_compatibilidad(
            grados_usuario, datos, conjuntos, reglas, presupuesto, modo
        )
        niveles_platillo = niveles_dominantes(resultado.grados_platillo)
        datos["coincidencia"] = a_porcentaje(resultado.compatibilidad)
        datos["afinidades"] = calcular_afinidades(datos, presupuesto, modo)
        datos["motivo"] = redactar_motivo(
            niveles_usuario,
            niveles_platillo,
            datos["precio"],
            presupuesto,
            datos["coincidencia"],
            modo,
        )
        datos["traza"] = {
            "modo": modo,
            "grados_platillo": resultado.grados_platillo,
            "reglas_activadas": [
                {**activacion, "activacion": redondear(activacion["activacion"])}
                for activacion in resultado.activaciones
            ],
            "regla_dominante": resultado.regla_dominante["codigo"] if resultado.regla_dominante else None,
            "compatibilidad_sin_ajuste": redondear(resultado.compatibilidad_sin_ajuste, 2),
            "factor_presupuesto": redondear(resultado.factor_presupuesto),
            "sobreprecio_porcentaje": redondear(resultado.sobreprecio, 1),
            "compatibilidad_final": redondear(resultado.compatibilidad, 2),
            "compatibilidad_centroide": redondear(resultado.compatibilidad_centroide, 2),
        }
        evaluados.append(datos)

    # Orden por coincidencia y, en empate, por el precio mas accesible
    evaluados.sort(key=lambda dato: (-dato["coincidencia"], dato["precio"]))
    mejor = evaluados[0] if evaluados else None

    if guardar_historial and mejor:
        registrar_consulta(sesion, hambre, sabor, presupuesto, mejor)

    return {
        "entrada": {"hambre": hambre, "sabor": sabor, "presupuesto": presupuesto, "modo": modo},
        "recomendado": mejor,
        "opciones": evaluados[1:limite],
        "total_evaluados": len(evaluados),
        "traza_usuario": {
            "grados": {
                variable: {etiqueta: redondear(grado) for etiqueta, grado in grados.items()}
                for variable, grados in grados_usuario.items()
            },
            "niveles": niveles_usuario,
            "metodo": (
                "Mamdani: conjuncion por minimo, agregacion por maximo, defuzzificacion por "
                "promedio de alturas y conjuncion final con el ajuste al presupuesto "
                "mediante t-norma producto (el centroide se reporta como referencia)"
            ),
        },
    }
