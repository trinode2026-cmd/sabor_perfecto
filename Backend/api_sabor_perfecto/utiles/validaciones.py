"""Validaciones reutilizables de las entradas que llegan desde la web."""

# Limites de las tres variables que ajusta el usuario
LIMITE_HAMBRE = (0.0, 100.0)
LIMITE_PICANTE = (0.0, 100.0)
LIMITE_PRESUPUESTO = (30.0, 400.0)


def recortar(valor: float, minimo: float, maximo: float) -> float:
    """Deja un numero siempre dentro del rango indicado."""
    return max(minimo, min(maximo, float(valor)))


def recortar_grado(valor: float) -> float:
    """Deja un grado de pertenencia dentro del intervalo cerrado [0, 1]."""
    return recortar(valor, 0.0, 1.0)


def validar_hambre(valor: float) -> float:
    """Asegura que el nivel de hambre quede entre 0 y 100."""
    return recortar(valor, *LIMITE_HAMBRE)


def validar_picante(valor: float) -> float:
    """Asegura que el nivel de picante quede entre 0 y 100."""
    return recortar(valor, *LIMITE_PICANTE)


def validar_presupuesto(valor: float) -> float:
    """Asegura que el presupuesto quede dentro del rango de precios del menu."""
    return recortar(valor, *LIMITE_PRESUPUESTO)


def normalizar_texto(texto: str | None) -> str:
    """Limpia un texto de busqueda: sin espacios sobrantes y en minusculas."""
    if not texto:
        return ""
    return " ".join(texto.strip().lower().split())


def validar_entero_positivo(valor: int | None, por_defecto: int, maximo: int) -> int:
    """Devuelve un entero positivo acotado, util para limites y paginacion."""
    if valor is None or valor < 1:
        return por_defecto
    return min(int(valor), maximo)
