"""Esquemas de validacion de entrada y salida de la API."""

from schemas.platillo import (
    CategoriaSalida,
    DetallePlatillo,
    EtiquetaSalida,
    ListaPlatillos,
    PlatilloSalida,
    RangoPrecios,
)
from schemas.recomendacion import (
    Afinidades,
    PlatilloRecomendado,
    PreajusteSalida,
    PreferenciasEntrada,
    RespuestaRecomendacion,
)

__all__ = [
    "Afinidades",
    "CategoriaSalida",
    "DetallePlatillo",
    "EtiquetaSalida",
    "ListaPlatillos",
    "PlatilloRecomendado",
    "PlatilloSalida",
    "PreajusteSalida",
    "PreferenciasEntrada",
    "RangoPrecios",
    "RespuestaRecomendacion",
]
