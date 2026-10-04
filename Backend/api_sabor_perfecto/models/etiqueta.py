"""Modelo ORM de las etiquetas y su relacion con los platillos."""

from sqlalchemy import Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.base_datos import Base

# Tabla intermedia que une platillos con etiquetas
platillos_etiquetas = Table(
    "platillos_etiquetas",
    Base.metadata,
    Column("platillo_id", ForeignKey("platillos.id", ondelete="CASCADE"), primary_key=True),
    Column("etiqueta_id", ForeignKey("etiquetas.id", ondelete="CASCADE"), primary_key=True),
)


class Etiqueta(Base):
    """Marca caracteristicas del platillo para filtrar el menu."""

    __tablename__ = "etiquetas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(60), unique=True, nullable=False)
    color: Mapped[str] = mapped_column(String(20), default="default")

    platillos: Mapped[list["Platillo"]] = relationship(  # noqa: F821
        secondary=platillos_etiquetas, back_populates="etiquetas"
    )
