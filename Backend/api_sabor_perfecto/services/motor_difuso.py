"""Motor de inferencia Mamdani que calcula la compatibilidad entre el usuario y cada platillo."""

from dataclasses import dataclass

from utiles.formato import redondear
from utiles.validaciones import recortar_grado

# Cada bloque de reglas compara una preferencia del usuario con un atributo del platillo
BLOQUES = {
    "saciedad": ("hambre", "saciedad"),
    "picor": ("picante", "picor"),
    "dulzor": ("dulce", "dulzor"),
    "precio": ("presupuesto", "precio"),
}

# Importancia relativa de cada bloque dentro de la decision final
PESOS_BLOQUE = {"saciedad": 1.0, "picor": 0.9, "dulzor": 0.9, "precio": 0.75}

# Que bloque de sabor se usa en cada modo de busqueda
BLOQUE_SABOR = {"salado": "picor", "dulce": "dulzor"}

# Que variable del usuario describe el sabor en cada modo
VARIABLE_SABOR = {"salado": "picante", "dulce": "dulce"}

# Que atributo del producto describe el sabor en cada modo
ATRIBUTO_SABOR = {"salado": "picor", "dulce": "dulzor"}

# Hasta donde se tolera pasarse del presupuesto, en porcentaje
TOLERANCIA_PRESUPUESTO = (15.0, 80.0)

# Lo minimo que conserva un producto que se pasa por completo del presupuesto
PISO_PRESUPUESTO = 0.30

# Conjuntos de salida: compatibilidad sobre un universo de 0 a 100
CONJUNTOS_SALIDA = {
    "muy_baja": ("triangular", -25.0, 0.0, 25.0),
    "baja": ("triangular", 0.0, 25.0, 50.0),
    "media": ("triangular", 25.0, 50.0, 75.0),
    "alta": ("triangular", 50.0, 75.0, 100.0),
    "muy_alta": ("triangular", 75.0, 100.0, 125.0),
}

# Universo discreto que se recorre al defuzzificar por centroide
PASO_UNIVERSO = 1.0
UNIVERSO_SALIDA = [indice * PASO_UNIVERSO for indice in range(0, 101)]

# Centro de cada conjunto de salida, usado por la defuzzificacion de alturas
CENTROS_SALIDA = {"muy_baja": 0.0, "baja": 25.0, "media": 50.0, "alta": 75.0, "muy_alta": 100.0}


@dataclass
class Resultado:
    """Compatibilidad calculada de un platillo junto con su traza tecnica."""

    compatibilidad: float
    compatibilidad_sin_ajuste: float
    compatibilidad_centroide: float
    factor_presupuesto: float
    sobreprecio: float
    grados_platillo: dict[str, dict[str, float]]
    activaciones: list[dict]
    regla_dominante: dict | None


def pertenencia_bajo(valor: float, a: float, b: float) -> float:
    """Trapecio abierto a la izquierda: vale 1 antes de 'a' y cae a 0 en 'b'."""
    if valor <= a:
        return 1.0
    if valor >= b:
        return 0.0
    return (b - valor) / (b - a)


def pertenencia_medio(valor: float, a: float, b: float, c: float) -> float:
    """Triangulo con pico en 'b' que nace en 'a' y muere en 'c'."""
    if valor <= a or valor >= c:
        return 0.0
    if valor == b:
        return 1.0
    if valor < b:
        return (valor - a) / (b - a)
    return (c - valor) / (c - b)


def pertenencia_alto(valor: float, a: float, b: float) -> float:
    """Trapecio abierto a la derecha: vale 0 antes de 'a' y llega a 1 en 'b'."""
    if valor <= a:
        return 0.0
    if valor >= b:
        return 1.0
    return (valor - a) / (b - a)


def evaluar_conjunto(tipo: str, puntos: tuple, valor: float) -> float:
    """Calcula el grado de pertenencia segun el tipo de conjunto."""
    if tipo == "bajo":
        return recortar_grado(pertenencia_bajo(valor, puntos[0], puntos[1]))
    if tipo == "alto":
        return recortar_grado(pertenencia_alto(valor, puntos[0], puntos[1]))
    return recortar_grado(pertenencia_medio(valor, puntos[0], puntos[1], puntos[2]))


def fuzzificar(variable: str, valor: float, conjuntos: dict) -> dict[str, float]:
    """Traduce un numero a sus grados de pertenencia bajo, medio y alto."""
    definiciones = conjuntos.get(variable, {})
    return {
        etiqueta: evaluar_conjunto(definicion["tipo"], definicion["puntos"], valor)
        for etiqueta, definicion in definiciones.items()
    }


def evaluar_reglas(
    grados_usuario: dict[str, dict[str, float]],
    grados_platillo: dict[str, dict[str, float]],
    reglas: list[dict],
) -> list[dict]:
    """Dispara cada regla usando el minimo como conjuncion y la pondera por su peso."""
    activaciones = []
    for regla in reglas:
        variable_usuario, variable_platillo = BLOQUES[regla["variable"]]
        grado_usuario = grados_usuario[variable_usuario].get(regla["conjunto_usuario"], 0.0)
        grado_platillo = grados_platillo[variable_platillo].get(regla["conjunto_platillo"], 0.0)
        activacion = min(grado_usuario, grado_platillo) * regla["peso"]
        if activacion > 0.001:
            activaciones.append(
                {
                    "codigo": regla["codigo"],
                    "variable": regla["variable"],
                    "conjunto_usuario": regla["conjunto_usuario"],
                    "conjunto_platillo": regla["conjunto_platillo"],
                    "consecuente": regla["consecuente"],
                    "activacion": recortar_grado(activacion),
                }
            )
    return activaciones


def agregar_consecuentes(activaciones: list[dict]) -> list[float]:
    """Recorta cada conjunto de salida por su activacion y los une con el maximo."""
    agregado = [0.0] * len(UNIVERSO_SALIDA)
    for activacion in activaciones:
        tipo, a, b, c = CONJUNTOS_SALIDA[activacion["consecuente"]]
        for indice, punto in enumerate(UNIVERSO_SALIDA):
            grado = min(pertenencia_medio(punto, a, b, c), activacion["activacion"])
            if grado > agregado[indice]:
                agregado[indice] = grado
    return agregado


def defuzzificar_centroide(agregado: list[float]) -> float:
    """Obtiene el valor concreto de compatibilidad como centro de area del agregado."""
    numerador = sum(punto * grado for punto, grado in zip(UNIVERSO_SALIDA, agregado))
    denominador = sum(agregado)
    if denominador == 0:
        return 0.0
    return numerador / denominador


def defuzzificar_alturas(activaciones: list[dict]) -> float:
    """Promedia los centros de los conjuntos de salida ponderados por su activacion."""
    numerador = sum(dato["activacion"] * CENTROS_SALIDA[dato["consecuente"]] for dato in activaciones)
    denominador = sum(dato["activacion"] for dato in activaciones)
    if denominador == 0:
        return 0.0
    return numerador / denominador


def calcular_sobreprecio(precio: float, presupuesto: float) -> float:
    """Mide en porcentaje cuanto se pasa el precio del presupuesto indicado."""
    if precio <= presupuesto:
        return 0.0
    return (precio - presupuesto) / max(presupuesto, 1.0) * 100


def factor_presupuesto(sobreprecio: float) -> float:
    """Que tanto respeta el precio el presupuesto pedido, de 0.3 a 1."""
    tolera = pertenencia_bajo(sobreprecio, *TOLERANCIA_PRESUPUESTO)
    return PISO_PRESUPUESTO + (1.0 - PISO_PRESUPUESTO) * recortar_grado(tolera)


def calcular_compatibilidad(
    grados_usuario: dict[str, dict[str, float]],
    platillo: dict,
    conjuntos: dict,
    reglas: list[dict],
    presupuesto: float,
    modo: str = "salado",
) -> Resultado:
    """Ejecuta el ciclo completo de inferencia para un solo producto del menu."""
    atributo = ATRIBUTO_SABOR[modo]
    sobreprecio = calcular_sobreprecio(platillo["precio"], presupuesto)
    grados_platillo = {
        "saciedad": fuzzificar("saciedad", platillo["saciedad"], conjuntos),
        atributo: fuzzificar(atributo, platillo[atributo], conjuntos),
        "precio": fuzzificar("precio", platillo["precio"], conjuntos),
    }
    activaciones = evaluar_reglas(grados_usuario, grados_platillo, reglas)
    agregado = agregar_consecuentes(activaciones)
    dominante = max(activaciones, key=lambda dato: dato["activacion"], default=None)

    # El presupuesto entra como conjuncion final con t-norma producto
    sin_ajuste = defuzzificar_alturas(activaciones)
    ajuste = factor_presupuesto(sobreprecio)
    return Resultado(
        compatibilidad=sin_ajuste * ajuste,
        compatibilidad_sin_ajuste=sin_ajuste,
        factor_presupuesto=ajuste,
        sobreprecio=sobreprecio,
        compatibilidad_centroide=defuzzificar_centroide(agregado),
        grados_platillo={
            variable: {etiqueta: redondear(grado) for etiqueta, grado in grados.items()}
            for variable, grados in grados_platillo.items()
        },
        activaciones=activaciones,
        regla_dominante=dominante,
    )


def fuzzificar_usuario(
    hambre: float, sabor: float, presupuesto: float, conjuntos: dict, modo: str = "salado"
) -> dict[str, dict[str, float]]:
    """Traduce las tres barras del usuario a grados de pertenencia segun el modo."""
    variable = VARIABLE_SABOR[modo]
    return {
        "hambre": fuzzificar("hambre", hambre, conjuntos),
        variable: fuzzificar(variable, sabor, conjuntos),
        "presupuesto": fuzzificar("presupuesto", presupuesto, conjuntos),
    }


def etiqueta_dominante(grados: dict[str, float]) -> str:
    """Devuelve la etiqueta con mayor grado de pertenencia."""
    if not grados:
        return "medio"
    return max(grados.items(), key=lambda dato: dato[1])[0]
