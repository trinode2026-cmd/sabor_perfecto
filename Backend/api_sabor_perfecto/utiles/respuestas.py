"""Errores HTTP uniformes para todas las rutas de la API."""

from fastapi import HTTPException, status


def error_no_encontrado(recurso: str = "El recurso") -> HTTPException:
    """Error 404 cuando un platillo o categoria no existe."""
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{recurso} no existe.")
