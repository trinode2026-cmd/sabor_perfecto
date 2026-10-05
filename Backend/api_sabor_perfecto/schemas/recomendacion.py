"""Esquemas de entrada y salida del recomendador."""

from typing import Literal

from pydantic import BaseModel, Field

from schemas.platillo import PlatilloSalida


class PreferenciasEntrada(BaseModel):
    """Las tres preferencias que el usuario ajusta con las barras."""

    hambre: float = Field(default=50, ge=0, le=100, description="Que tanta hambre trae el usuario")
    sabor: float = Field(
        default=50,
        ge=0,
        le=100,
        description="Gusto por el picante en modo salado, o por lo dulce en modo dulce",
    )
    presupuesto: float = Field(
        default=180, ge=30, le=400, description="Cuanto quiere gastar en pesos"
    )
    modo: Literal["salado", "dulce"] = Field(
        default="salado", description="salado busca comida; dulce busca postres y bebidas"
    )
    limite: int | None = Field(default=None, ge=1, le=50, description="Cuantas opciones devolver")


class Afinidades(BaseModel):
    """Medidas sencillas que la interfaz muestra como barras."""

    porcion: int
    sabor: int
    precio: int


class PlatilloRecomendado(PlatilloSalida):
    """Platillo con su coincidencia y la razon por la que se sugiere."""

    coincidencia: int
    motivo: str
    afinidades: Afinidades
    traza: dict | None = Field(
        default=None,
        description="Detalle tecnico del sistema de inferencia; la interfaz no lo necesita",
    )


class RespuestaRecomendacion(BaseModel):
    """Resultado completo de una consulta al recomendador."""

    entrada: dict
    recomendado: PlatilloRecomendado | None
    opciones: list[PlatilloRecomendado] = Field(default_factory=list)
    total_evaluados: int = 0
    traza_usuario: dict | None = Field(
        default=None, description="Grados y metodo de inferencia aplicados a la consulta"
    )


class PreajusteSalida(BaseModel):
    """Perfil rapido que el usuario puede aplicar con un toque."""

    clave: str
    nombre: str
    descripcion: str
    icono: str
    hambre: int
    picante: int
    presupuesto: int
