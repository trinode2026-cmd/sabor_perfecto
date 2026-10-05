"""Reune todos los enrutadores de la API en uno solo."""

from fastapi import APIRouter

from api.routes import rutas_categorias, rutas_platillos, rutas_recomendaciones

enrutador_principal = APIRouter()
enrutador_principal.include_router(rutas_recomendaciones.enrutador)
enrutador_principal.include_router(rutas_platillos.enrutador)
enrutador_principal.include_router(rutas_categorias.enrutador)

__all__ = ["enrutador_principal"]
