"""Rutas del recomendador de platillos."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.base_datos import obtener_sesion
from schemas import PreajusteSalida, PreferenciasEntrada, RespuestaRecomendacion
from services import servicio_recomendacion
from services.datos_iniciales import PREAJUSTES

enrutador = APIRouter(tags=["Recomendaciones"])


@enrutador.post(
    "/recomendaciones",
    response_model=RespuestaRecomendacion,
    summary="Recomienda platillos segun las preferencias",
)
def recomendar(preferencias: PreferenciasEntrada, sesion: Session = Depends(obtener_sesion)):
    """Calcula el platillo ideal y las demas opciones ordenadas por coincidencia."""
    return servicio_recomendacion.recomendar(
        sesion,
        hambre=preferencias.hambre,
        sabor=preferencias.sabor,
        presupuesto=preferencias.presupuesto,
        modo=preferencias.modo,
        limite=preferencias.limite,
    )


@enrutador.get("/preajustes", response_model=list[PreajusteSalida], summary="Perfiles rapidos")
def listar_preajustes():
    """Devuelve los perfiles que el usuario puede aplicar con un solo toque."""
    return PREAJUSTES
