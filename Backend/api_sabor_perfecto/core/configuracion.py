"""Lectura centralizada de la configuracion del backend desde el archivo .env."""

from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

# Ruta al archivo .env que vive junto a main.py
RUTA_ENV = Path(__file__).resolve().parent.parent / ".env"


class Configuracion(BaseSettings):
    """Variables de entorno que necesita la API para funcionar."""

    # Datos de conexion a la base de datos
    bd_motor: str = "mariadb"
    bd_host: str = "localhost"
    bd_puerto: int = 3306
    bd_usuario: str = ""
    bd_contrasena: str = ""
    bd_nombre: str = "sabor_perfecto"

    # Donde escucha la API; se puede cambiar sin tocar el codigo
    api_host: str = "127.0.0.1"
    api_puerto: int = Field(default=8000, ge=1, le=65535)
    recarga_automatica: bool = True

    # Ajustes generales de la aplicacion
    nombre_app: str = "Sabor Perfecto API"
    entorno: str = "desarrollo"
    prefijo_api: str = "/api"
    origenes_permitidos: str = "http://localhost:5173"
    limite_opciones: int = 8
    moneda: str = "MXN"

    model_config = SettingsConfigDict(env_file=RUTA_ENV, env_file_encoding="utf-8", extra="ignore")

    @property
    def url_base_datos(self) -> str:
        """Arma la cadena de conexion de SQLAlchemy con el driver PyMySQL."""
        from urllib.parse import quote_plus

        contrasena = quote_plus(self.bd_contrasena)
        return (
            f"mysql+pymysql://{self.bd_usuario}:{contrasena}"
            f"@{self.bd_host}:{self.bd_puerto}/{self.bd_nombre}?charset=utf8mb4"
        )

    @property
    def lista_origenes(self) -> list[str]:
        """Convierte los origenes permitidos separados por coma en una lista."""
        return [origen.strip() for origen in self.origenes_permitidos.split(",") if origen.strip()]


@lru_cache
def obtener_configuracion() -> Configuracion:
    """Devuelve la configuracion en cache para no releer el .env en cada peticion."""
    return Configuracion()


configuracion = obtener_configuracion()
