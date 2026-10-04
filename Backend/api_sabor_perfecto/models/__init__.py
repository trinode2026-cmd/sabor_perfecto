"""Registra todos los modelos del ORM en un solo lugar."""

from models.categoria import Categoria
from models.conjunto_difuso import ConjuntoDifuso
from models.consulta import Consulta
from models.etiqueta import Etiqueta, platillos_etiquetas
from models.platillo import Platillo
from models.regla import Regla

__all__ = [
    "Categoria",
    "ConjuntoDifuso",
    "Consulta",
    "Etiqueta",
    "Platillo",
    "Regla",
    "platillos_etiquetas",
]
