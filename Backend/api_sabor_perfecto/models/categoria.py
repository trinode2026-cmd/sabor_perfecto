"""Modelo ORM de las categorias del menu."""

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.base_datos import Base


class Categoria(Base):
    """Agrupa los platillos por tipo de cocina o momento de consumo."""

    __tablename__ = "categorias"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    descripcion: Mapped[str] = mapped_column(String(255), default="")
    icono: Mapped[str] = mapped_column(String(60), default="restaurant")
    orden: Mapped[int] = mapped_column(Integer, default=0)

    platillos: Mapped[list["Platillo"]] = relationship(back_populates="categoria")  # noqa: F821
