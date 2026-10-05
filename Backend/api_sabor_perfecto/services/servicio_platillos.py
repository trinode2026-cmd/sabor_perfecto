"""Consultas del menu: listado con filtros, detalle, similares y populares."""

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, selectinload

from models import Categoria, Consulta, Etiqueta, Platillo
from services.servicio_recomendacion import TIPOS_POR_MODO, armar_platillo
from utiles.validaciones import LIMITE_PRESUPUESTO, normalizar_texto, validar_entero_positivo

# Formas en que se puede ordenar el menu
ORDENES = {
    "nombre": Platillo.nombre.asc(),
    "precio_menor": Platillo.precio.asc(),
    "precio_mayor": Platillo.precio.desc(),
    "mas_llenador": Platillo.saciedad.desc(),
    "mas_picoso": Platillo.picor.desc(),
    "mas_dulce": Platillo.dulzor.desc(),
}


def consulta_base():
    """Devuelve la consulta de platillos activos con sus relaciones cargadas."""
    return (
        select(Platillo)
        .where(Platillo.activo.is_(True))
        .options(selectinload(Platillo.categoria), selectinload(Platillo.etiquetas))
    )


def listar_categorias(sesion: Session) -> list[dict]:
    """Lista las categorias del menu con cuantos platillos tiene cada una."""
    conteos = dict(
        sesion.execute(
            select(Platillo.categoria_id, func.count(Platillo.id))
            .where(Platillo.activo.is_(True))
            .group_by(Platillo.categoria_id)
        ).all()
    )
    categorias = sesion.scalars(select(Categoria).order_by(Categoria.orden)).all()
    return [
        {
            "id": categoria.id,
            "nombre": categoria.nombre,
            "descripcion": categoria.descripcion,
            "icono": categoria.icono,
            "total_platillos": conteos.get(categoria.id, 0),
        }
        for categoria in categorias
    ]


def rango_precios(sesion: Session, modo: str = "salado") -> dict:
    """Devuelve el precio mas bajo y el mas alto de lo que se muestra en ese modo."""
    tipos = TIPOS_POR_MODO.get(modo, TIPOS_POR_MODO["salado"])
    fila = sesion.execute(
        select(func.min(Platillo.precio), func.max(Platillo.precio)).where(
            Platillo.activo.is_(True), Platillo.tipo.in_(tipos)
        )
    ).first()
    minimo, maximo = (fila or (None, None))
    return {
        "minimo": float(minimo) if minimo is not None else LIMITE_PRESUPUESTO[0],
        "maximo": float(maximo) if maximo is not None else LIMITE_PRESUPUESTO[1],
    }


def listar_etiquetas(sesion: Session) -> list[dict]:
    """Lista las etiquetas disponibles para filtrar el menu."""
    etiquetas = sesion.scalars(select(Etiqueta).order_by(Etiqueta.nombre)).all()
    return [{"id": e.id, "nombre": e.nombre, "color": e.color} for e in etiquetas]


def listar_platillos(
    sesion: Session,
    buscar: str | None = None,
    categoria_id: int | None = None,
    etiqueta: str | None = None,
    tipo: str | None = None,
    precio_maximo: float | None = None,
    orden: str = "nombre",
    pagina: int = 1,
    por_pagina: int = 12,
) -> dict:
    """Devuelve los platillos que cumplen los filtros, paginados."""
    consulta = consulta_base()

    texto = normalizar_texto(buscar)
    if texto:
        patron = f"%{texto}%"
        consulta = consulta.where(
            or_(Platillo.nombre.ilike(patron), Platillo.descripcion.ilike(patron))
        )
    if categoria_id:
        consulta = consulta.where(Platillo.categoria_id == categoria_id)
    if tipo:
        consulta = consulta.where(Platillo.tipo == tipo)
    if etiqueta:
        consulta = consulta.where(Platillo.etiquetas.any(Etiqueta.nombre == etiqueta))
    if precio_maximo:
        consulta = consulta.where(Platillo.precio <= precio_maximo)

    total = sesion.scalar(select(func.count()).select_from(consulta.subquery())) or 0
    pagina = validar_entero_positivo(pagina, 1, 500)
    por_pagina = validar_entero_positivo(por_pagina, 12, 50)

    consulta = consulta.order_by(ORDENES.get(orden, ORDENES["nombre"]))
    consulta = consulta.limit(por_pagina).offset((pagina - 1) * por_pagina)
    platillos = sesion.scalars(consulta).all()

    return {
        "platillos": [armar_platillo(platillo) for platillo in platillos],
        "total": total,
        "pagina": pagina,
        "por_pagina": por_pagina,
        "paginas": max(1, -(-total // por_pagina)),
    }


def obtener_platillo(sesion: Session, platillo_id: int) -> dict | None:
    """Busca un platillo por su identificador."""
    platillo = sesion.scalars(consulta_base().where(Platillo.id == platillo_id)).first()
    return armar_platillo(platillo) if platillo else None


def platillos_similares(sesion: Session, platillo_id: int, limite: int = 4) -> list[dict]:
    """Sugiere platillos parecidos usando la distancia de saciedad, picor y precio."""
    actual = sesion.get(Platillo, platillo_id)
    if actual is None:
        return []
    distancia = (
        func.abs(Platillo.saciedad - actual.saciedad)
        + func.abs(Platillo.picor - actual.picor)
        + func.abs(Platillo.precio - actual.precio) / 5
    )
    consulta = (
        consulta_base()
        .where(Platillo.id != platillo_id, Platillo.tipo == actual.tipo)
        .order_by(distancia)
        .limit(limite)
    )
    return [armar_platillo(platillo) for platillo in sesion.scalars(consulta).all()]


def platillos_populares(sesion: Session, limite: int = 6) -> list[dict]:
    """Lista los platillos que mas veces ha recomendado el sistema."""
    conteos = sesion.execute(
        select(Consulta.platillo_id, func.count(Consulta.id).label("veces"))
        .where(Consulta.platillo_id.is_not(None))
        .group_by(Consulta.platillo_id)
        .order_by(func.count(Consulta.id).desc())
        .limit(limite)
    ).all()

    # Si todavia no hay historial se muestran los marcados como populares
    if not conteos:
        consulta = (
            consulta_base()
            .where(Platillo.tipo == "comida", Platillo.etiquetas.any(Etiqueta.nombre == "Popular"))
            .order_by(Platillo.saciedad.desc())
            .limit(limite)
        )
        return [armar_platillo(platillo) for platillo in sesion.scalars(consulta).all()]

    identificadores = [fila[0] for fila in conteos]
    veces_por_id = {fila[0]: fila[1] for fila in conteos}
    platillos = sesion.scalars(consulta_base().where(Platillo.id.in_(identificadores))).all()
    resultado = []
    for platillo in platillos:
        datos = armar_platillo(platillo)
        datos["veces_recomendado"] = veces_por_id.get(platillo.id, 0)
        resultado.append(datos)
    resultado.sort(key=lambda dato: -dato["veces_recomendado"])
    return resultado
