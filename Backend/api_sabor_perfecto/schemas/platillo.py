"""Esquemas de salida de los platillos, categorias y etiquetas."""

from pydantic import BaseModel, Field


class EtiquetaSalida(BaseModel):
    """Etiqueta disponible para filtrar el menu."""

    id: int
    nombre: str
    color: str


class CategoriaSalida(BaseModel):
    """Categoria del menu con su conteo de platillos."""

    id: int
    nombre: str
    descripcion: str = ""
    icono: str = "restaurant"
    total_platillos: int = 0


class PlatilloSalida(BaseModel):
    """Datos de un platillo tal como los consume la interfaz."""

    id: int
    nombre: str
    descripcion: str = ""
    categoria: str = ""
    icono_categoria: str = "restaurant"
    saciedad: int
    picor: int
    dulzor: int = 0
    tipo: str = "comida"
    precio: float
    minutos_preparacion: int = 15
    url_imagen: str = ""
    etiquetas: list[str] = Field(default_factory=list)
    veces_recomendado: int | None = None


class ListaPlatillos(BaseModel):
    """Pagina de resultados del menu."""

    platillos: list[PlatilloSalida]
    total: int
    pagina: int
    por_pagina: int
    paginas: int


class DetallePlatillo(BaseModel):
    """Platillo con sus sugerencias parecidas."""

    platillo: PlatilloSalida
    similares: list[PlatilloSalida] = Field(default_factory=list)


class RangoPrecios(BaseModel):
    """Precio mas bajo y mas alto del menu, para acotar las barras de la interfaz."""

    minimo: float
    maximo: float
