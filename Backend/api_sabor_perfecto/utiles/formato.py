"""Formatos de salida compartidos por los servicios y las rutas."""

from utiles.validaciones import recortar


def a_porcentaje(valor: float) -> int:
    """Pasa un valor de 0 a 100 a un porcentaje entero acotado."""
    return int(round(recortar(valor, 0.0, 100.0)))


def ajuste_presupuesto(precio: float, presupuesto: float) -> int:
    """Mide de 0 a 100 que tan bien cabe el precio en el presupuesto indicado."""
    if precio <= presupuesto:
        return 100
    exceso = (precio - presupuesto) / max(presupuesto, 1.0)
    return a_porcentaje(100 - exceso * 200)


def redondear(valor: float, decimales: int = 3) -> float:
    """Redondea un numero para que la traza tecnica sea legible."""
    return round(float(valor), decimales)
