"""Modelo ORM de la base de conocimiento del recomendador."""

from sqlalchemy import Boolean, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from core.base_datos import Base


class Regla(Base):
    """Una regla que relaciona la preferencia del usuario con el atributo del platillo."""

    __tablename__ = "reglas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    codigo: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    variable: Mapped[str] = mapped_column(String(40), nullable=False)
    conjunto_usuario: Mapped[str] = mapped_column(String(20), nullable=False)
    conjunto_platillo: Mapped[str] = mapped_column(String(20), nullable=False)
    consecuente: Mapped[str] = mapped_column(String(20), nullable=False)
    peso: Mapped[float] = mapped_column(Float, default=1.0)
    activa: Mapped[bool] = mapped_column(Boolean, default=True)
