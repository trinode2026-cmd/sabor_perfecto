"""Crea las tablas y llena la base de datos con el catalogo y los parametros del motor."""

from sqlalchemy import delete, inspect, select, text
from sqlalchemy.orm import Session

from core.base_datos import SesionLocal, crear_tablas, motor
from models import Categoria, ConjuntoDifuso, Etiqueta, Platillo, Regla
from services.datos_iniciales import (
    CATEGORIAS,
    CONJUNTOS_DIFUSOS,
    ETIQUETAS,
    MATRICES_REGLAS,
    PLATILLOS,
    POSTRES_Y_BEBIDAS,
)
from services.motor_difuso import PESOS_BLOQUE

# Las reglas que castigan pasarse del presupuesto pesan un poco mas
REFUERZO_PRESUPUESTO = 1.3

# Prefijo del codigo de regla segun el bloque al que pertenece
PREFIJOS_BLOQUE = {"saciedad": "SAC", "picor": "PIC", "dulzor": "DUL", "precio": "PRE"}

# Margen al comparar pesos, porque la base guarda los flotantes con menos precision
MARGEN_PESO = 1e-5

# Columnas que se agregan a una tabla de platillos creada antes de la carta dulce
COLUMNAS_NUEVAS = {
    "dulzor": "INTEGER NOT NULL DEFAULT 0",
    "tipo": "VARCHAR(20) NOT NULL DEFAULT 'comida'",
}


def asegurar_columnas() -> list[str]:
    """Agrega a la tabla de platillos las columnas que falten de versiones anteriores."""
    revisor = inspect(motor)
    if "platillos" not in revisor.get_table_names():
        return []
    actuales = {columna["name"] for columna in revisor.get_columns("platillos")}
    agregadas = []
    with motor.begin() as conexion:
        for nombre, definicion in COLUMNAS_NUEVAS.items():
            if nombre in actuales:
                continue
            conexion.execute(text(f"ALTER TABLE platillos ADD COLUMN {nombre} {definicion}"))
            agregadas.append(nombre)
    return agregadas


def sembrar_categorias(sesion: Session) -> dict[str, Categoria]:
    """Inserta las categorias que falten y devuelve todas por nombre."""
    existentes = {fila.nombre: fila for fila in sesion.scalars(select(Categoria)).all()}
    for nombre, descripcion, icono, orden in CATEGORIAS:
        if nombre not in existentes:
            categoria = Categoria(nombre=nombre, descripcion=descripcion, icono=icono, orden=orden)
            sesion.add(categoria)
            existentes[nombre] = categoria
    sesion.flush()
    return existentes


def sembrar_etiquetas(sesion: Session) -> dict[str, Etiqueta]:
    """Inserta las etiquetas que falten y devuelve todas por nombre."""
    existentes = {fila.nombre: fila for fila in sesion.scalars(select(Etiqueta)).all()}
    for nombre, color in ETIQUETAS:
        if nombre not in existentes:
            etiqueta = Etiqueta(nombre=nombre, color=color)
            sesion.add(etiqueta)
            existentes[nombre] = etiqueta
    sesion.flush()
    return existentes


def sembrar_platillos(sesion: Session) -> int:
    """Inserta la comida y la carta dulce que aun no existan en el menu."""
    categorias = sembrar_categorias(sesion)
    etiquetas = sembrar_etiquetas(sesion)
    nombres_existentes = set(sesion.scalars(select(Platillo.nombre)).all())

    # La comida no tiene dulzor relevante; los postres y bebidas no pican
    filas = [(*datos, 0, "comida") for datos in PLATILLOS]
    filas += [
        (nombre, descripcion, categoria, saciedad, 0, precio, minutos, marcas, dulzor, tipo)
        for nombre, descripcion, categoria, saciedad, dulzor, precio, minutos, marcas, tipo in POSTRES_Y_BEBIDAS
    ]

    insertados = 0
    for nombre, descripcion, categoria, saciedad, picor, precio, minutos, marcas, dulzor, tipo in filas:
        if nombre in nombres_existentes:
            continue
        platillo = Platillo(
            nombre=nombre,
            descripcion=descripcion,
            categoria_id=categorias[categoria].id,
            saciedad=saciedad,
            picor=picor,
            dulzor=dulzor,
            precio=float(precio),
            minutos_preparacion=minutos,
            url_imagen="",
            tipo=tipo,
            activo=True,
        )
        platillo.etiquetas = [etiquetas[marca] for marca in marcas if marca in etiquetas]
        sesion.add(platillo)
        insertados += 1
    sesion.flush()
    return insertados


def sembrar_conjuntos(sesion: Session) -> int:
    """Inserta, actualiza y limpia los parametros de los conjuntos que usa el motor."""
    existentes = {
        (fila.variable, fila.etiqueta): fila for fila in sesion.scalars(select(ConjuntoDifuso)).all()
    }
    esperados = {(fila[0], fila[1]) for fila in CONJUNTOS_DIFUSOS}
    cambios = 0

    # Quita conjuntos de versiones anteriores que ya nadie consulta
    sobrantes = [clave for clave in existentes if clave not in esperados]
    for variable, etiqueta in sobrantes:
        sesion.delete(existentes[(variable, etiqueta)])
        cambios += 1
    for variable, etiqueta, tipo, punto_a, punto_b, punto_c, punto_d in CONJUNTOS_DIFUSOS:
        conjunto = existentes.get((variable, etiqueta))
        if conjunto is None:
            conjunto = ConjuntoDifuso(variable=variable, etiqueta=etiqueta)
            sesion.add(conjunto)
            cambios += 1
        elif conjunto.tipo == tipo and all(
            abs(actual - esperado) < MARGEN_PESO
            for actual, esperado in (
                (conjunto.punto_a, punto_a),
                (conjunto.punto_b, punto_b),
                (conjunto.punto_c, punto_c),
            )
        ):
            continue
        else:
            cambios += 1
        conjunto.tipo = tipo
        conjunto.punto_a = float(punto_a)
        conjunto.punto_b = float(punto_b)
        conjunto.punto_c = float(punto_c)
        conjunto.punto_d = float(punto_d)
    sesion.flush()
    return cambios


def sembrar_reglas(sesion: Session) -> int:
    """Inserta o actualiza las reglas a partir de las matrices de consecuentes."""
    existentes = {fila.codigo: fila for fila in sesion.scalars(select(Regla)).all()}
    cambios = 0
    codigos_validos = set()
    for bloque, matriz in MATRICES_REGLAS.items():
        prefijo = PREFIJOS_BLOQUE[bloque]
        numero = 0
        for conjunto_usuario, destinos in matriz.items():
            for conjunto_platillo, consecuente in destinos.items():
                numero += 1
                codigo = f"{prefijo}{numero:02d}"
                codigos_validos.add(codigo)
                peso = PESOS_BLOQUE[bloque]
                if bloque == "precio" and consecuente == "muy_baja":
                    peso = min(1.0, peso * REFUERZO_PRESUPUESTO)
                regla = existentes.get(codigo)
                if regla is None:
                    regla = Regla(codigo=codigo, variable=bloque)
                    sesion.add(regla)
                    cambios += 1
                elif (
                    regla.conjunto_usuario == conjunto_usuario
                    and regla.conjunto_platillo == conjunto_platillo
                    and regla.consecuente == consecuente
                    and abs(regla.peso - peso) < MARGEN_PESO
                ):
                    continue
                else:
                    cambios += 1
                regla.variable = bloque
                regla.conjunto_usuario = conjunto_usuario
                regla.conjunto_platillo = conjunto_platillo
                regla.consecuente = consecuente
                regla.peso = peso
                regla.activa = True

    # Quita reglas de versiones anteriores que ya no forman parte del sistema
    sobrantes = [codigo for codigo in existentes if codigo not in codigos_validos]
    if sobrantes:
        sesion.execute(delete(Regla).where(Regla.codigo.in_(sobrantes)))
        cambios += len(sobrantes)

    sesion.flush()
    return cambios


def sembrar_todo() -> dict[str, int]:
    """Crea las tablas y siembra todo el contenido inicial sin duplicar nada."""
    columnas = asegurar_columnas()
    crear_tablas()
    with SesionLocal() as sesion:
        resumen = {
            "columnas_agregadas": len(columnas),
            "platillos": sembrar_platillos(sesion),
            "conjuntos": sembrar_conjuntos(sesion),
            "reglas": sembrar_reglas(sesion),
        }
        sesion.commit()
        resumen["total_platillos"] = len(sesion.scalars(select(Platillo.id)).all())
    return resumen


# Permite ejecutar la siembra con: python -m services.sembrar_datos
if __name__ == "__main__":
    reporte = sembrar_todo()
    print("Siembra terminada:")
    for clave, valor in reporte.items():
        print(f"  {clave}: {valor}")
