"""Modelo ORM del historial de consultas al recomendador."""

from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, func
from sqlalchemy.orm import Mapped, mapped_column

from core.base_datos import Base


class Consulta(Base):
    """Registra cada busqueda para saber que platillos se recomiendan mas."""

    __tablename__ = "consultas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    hambre: Mapped[float] = mapped_column(Float, nullable=False)
    picante: Mapped[float] = mapped_column(Float, nullable=False)
    presupuesto: Mapped[float] = mapped_column(Float, nullable=False)
    platillo_id: Mapped[int | None] = mapped_column(ForeignKey("platillos.id"), nullable=True)
    compatibilidad: Mapped[float] = mapped_column(Float, default=0.0)
    creado_en: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
