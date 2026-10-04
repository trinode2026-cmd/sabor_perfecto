"""Modelo ORM de los platillos del menu."""

from sqlalchemy import Boolean, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.base_datos import Base
from models.etiqueta import platillos_etiquetas


class Platillo(Base):
    """Un platillo con los tres atributos que compara el recomendador."""

    __tablename__ = "platillos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(140), unique=True, nullable=False)
    descripcion: Mapped[str] = mapped_column(Text, default="")
    categoria_id: Mapped[int] = mapped_column(ForeignKey("categorias.id"), nullable=False)

    # Atributos que alimentan al motor de recomendacion
    saciedad: Mapped[int] = mapped_column(Integer, nullable=False)
    picor: Mapped[int] = mapped_column(Integer, nullable=False)
    dulzor: Mapped[int] = mapped_column(Integer, default=0, server_default="0", nullable=False)
    precio: Mapped[float] = mapped_column(Float, nullable=False)

    # Separa la comida de la carta dulce: comida, postre o bebida
    tipo: Mapped[str] = mapped_column(
        String(20), default="comida", server_default="comida", nullable=False, index=True
    )

    url_imagen: Mapped[str] = mapped_column(String(400), default="")
    minutos_preparacion: Mapped[int] = mapped_column(Integer, default=15)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)

    categoria: Mapped["Categoria"] = relationship(back_populates="platillos")  # noqa: F821
    etiquetas: Mapped[list["Etiqueta"]] = relationship(  # noqa: F821
        secondary=platillos_etiquetas, back_populates="platillos", lazy="selectin"
    )
