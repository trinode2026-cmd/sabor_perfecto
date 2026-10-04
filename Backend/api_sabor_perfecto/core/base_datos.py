"""Conexion a MariaDB y utilidades del ORM SQLAlchemy."""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from core.configuracion import configuracion

# Motor de conexion con reciclado de conexiones para servidores remotos
motor = create_engine(
    configuracion.url_base_datos,
    pool_pre_ping=True,
    pool_recycle=1800,
    echo=False,
)

# Fabrica de sesiones que usan las rutas y los servicios
SesionLocal = sessionmaker(bind=motor, autoflush=False, autocommit=False, expire_on_commit=False)


class Base(DeclarativeBase):
    """Clase base de la que heredan todos los modelos del ORM."""


def obtener_sesion() -> Generator[Session, None, None]:
    """Dependencia de FastAPI que abre y cierra una sesion por peticion."""
    sesion = SesionLocal()
    try:
        yield sesion
    finally:
        sesion.close()


def crear_tablas() -> None:
    """Crea en la base de datos todas las tablas declaradas en los modelos."""
    import models  # noqa: F401  (registra los modelos antes de crear las tablas)

    Base.metadata.create_all(bind=motor)


def probar_conexion() -> bool:
    """Verifica que la base de datos responda."""
    from sqlalchemy import text

    try:
        with motor.connect() as conexion:
            conexion.execute(text("SELECT 1"))
        return True
    except Exception:
        return False
