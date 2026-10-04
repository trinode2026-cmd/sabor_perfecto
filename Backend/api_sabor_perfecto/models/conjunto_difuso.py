"""Modelo ORM de los conjuntos del sistema de inferencia."""

from sqlalchemy import Float, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from core.base_datos import Base


class ConjuntoDifuso(Base):
    """Guarda los puntos de cada conjunto para poder calibrarlo sin tocar codigo."""

    __tablename__ = "conjuntos_difusos"
    __table_args__ = (UniqueConstraint("variable", "etiqueta", name="unico_conjunto"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    variable: Mapped[str] = mapped_column(String(40), nullable=False)
    etiqueta: Mapped[str] = mapped_column(String(40), nullable=False)
    tipo: Mapped[str] = mapped_column(String(20), nullable=False)
    punto_a: Mapped[float] = mapped_column(Float, nullable=False)
    punto_b: Mapped[float] = mapped_column(Float, nullable=False)
    punto_c: Mapped[float] = mapped_column(Float, default=0.0)
    punto_d: Mapped[float] = mapped_column(Float, default=0.0)
