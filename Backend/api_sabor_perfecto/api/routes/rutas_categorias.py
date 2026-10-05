"""Rutas de categorias y etiquetas del menu."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.base_datos import obtener_sesion
from schemas import CategoriaSalida, EtiquetaSalida
from services import servicio_platillos

enrutador = APIRouter(tags=["Categorias"])


@enrutador.get("/categorias", response_model=list[CategoriaSalida], summary="Lista las categorias")
def listar_categorias(sesion: Session = Depends(obtener_sesion)):
    """Devuelve las categorias del menu con su conteo de platillos."""
    return servicio_platillos.listar_categorias(sesion)


@enrutador.get("/etiquetas", response_model=list[EtiquetaSalida], summary="Lista las etiquetas")
def listar_etiquetas(sesion: Session = Depends(obtener_sesion)):
    """Devuelve las etiquetas con las que se puede filtrar el menu."""
    return servicio_platillos.listar_etiquetas(sesion)
