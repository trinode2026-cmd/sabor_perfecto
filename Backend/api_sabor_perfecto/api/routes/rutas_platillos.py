"""Rutas del menu: listado, detalle, similares y populares."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from core.base_datos import obtener_sesion
from schemas import DetallePlatillo, ListaPlatillos, PlatilloSalida, RangoPrecios
from services import servicio_platillos
from utiles.respuestas import error_no_encontrado

enrutador = APIRouter(prefix="/platillos", tags=["Platillos"])


@enrutador.get("", response_model=ListaPlatillos, summary="Lista el menu con filtros")
def listar(
    buscar: str | None = Query(default=None, description="Texto a buscar en nombre o descripcion"),
    categoria_id: int | None = Query(default=None, description="Filtra por categoria"),
    etiqueta: str | None = Query(default=None, description="Filtra por etiqueta"),
    tipo: str | None = Query(default=None, description="comida, postre o bebida"),
    precio_maximo: float | None = Query(default=None, ge=0, description="Precio maximo en pesos"),
    orden: str = Query(
        default="nombre",
        description="nombre, precio_menor, precio_mayor, mas_llenador, mas_picoso, mas_dulce",
    ),
    pagina: int = Query(default=1, ge=1),
    por_pagina: int = Query(default=12, ge=1, le=50),
    sesion: Session = Depends(obtener_sesion),
):
    """Devuelve la pagina del menu que cumple los filtros recibidos."""
    return servicio_platillos.listar_platillos(
        sesion,
        buscar=buscar,
        categoria_id=categoria_id,
        etiqueta=etiqueta,
        tipo=tipo,
        precio_maximo=precio_maximo,
        orden=orden,
        pagina=pagina,
        por_pagina=por_pagina,
    )


@enrutador.get("/populares", response_model=list[PlatilloSalida], summary="Platillos mas recomendados")
def populares(
    limite: int = Query(default=6, ge=1, le=20),
    sesion: Session = Depends(obtener_sesion),
):
    """Devuelve los platillos que el sistema ha sugerido con mas frecuencia."""
    return servicio_platillos.platillos_populares(sesion, limite=limite)


@enrutador.get("/rango-precios", response_model=RangoPrecios, summary="Precios del menu")
def rango_de_precios(
    modo: str = Query(default="salado", description="salado o dulce"),
    sesion: Session = Depends(obtener_sesion),
):
    """Devuelve el precio mas bajo y el mas alto de lo que se muestra en ese modo."""
    return servicio_platillos.rango_precios(sesion, modo=modo)


@enrutador.get("/{platillo_id}", response_model=DetallePlatillo, summary="Detalle de un platillo")
def detalle(platillo_id: int, sesion: Session = Depends(obtener_sesion)):
    """Devuelve un platillo con sus opciones parecidas."""
    platillo = servicio_platillos.obtener_platillo(sesion, platillo_id)
    if platillo is None:
        raise error_no_encontrado("El platillo")
    similares = servicio_platillos.platillos_similares(sesion, platillo_id)
    return {"platillo": platillo, "similares": similares}
