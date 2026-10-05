"""Frases en lenguaje cotidiano para explicarle al usuario por que le va un producto del menu."""

# Como se le llama a cada nivel de las preferencias del usuario
NIVELES_HAMBRE = {"bajo": "poca hambre", "medio": "hambre normal", "alto": "mucha hambre"}
NIVELES_PICANTE = {"bajo": "sabores suaves", "medio": "un picor moderado", "alto": "la comida picosa"}
NIVELES_DULCE = {"bajo": "lo poco dulce", "medio": "un dulzor moderado", "alto": "lo bien dulce"}

# Como se describe el producto en cada nivel
PORCION_PLATILLO = {"bajo": "es una porcion ligera", "medio": "tiene una porcion justa", "alto": "es de los bien servidos"}
PICOR_PLATILLO = {"bajo": "casi no pica", "medio": "pica tantito", "alto": "es bien picoso"}
DULZOR_PLATILLO = {"bajo": "es poco dulce", "medio": "tiene un dulzor parejo", "alto": "es bien dulce"}

# Frases de cierre segun que tan alta sea la coincidencia
CIERRES = [
    (90, "Es la mejor opcion que tenemos para ti ahora."),
    (75, "Encaja muy bien con lo que buscas."),
    (55, "Es una buena alternativa si quieres variar."),
    (35, "Aparece mas abajo porque se aleja de lo que pediste."),
    (0, "Se sale bastante de lo que pediste, sobre todo del precio."),
]


def frase_porcion(nivel_usuario: str, nivel_platillo: str) -> str:
    """Arma la frase que compara el hambre con el tamano de la porcion."""
    hambre = NIVELES_HAMBRE.get(nivel_usuario, "hambre normal")
    porcion = PORCION_PLATILLO.get(nivel_platillo, "tiene una porcion justa")
    if nivel_usuario == nivel_platillo:
        return f"Traes {hambre} y esto {porcion}"
    return f"Traes {hambre} aunque esto {porcion}"


def frase_sabor(nivel_usuario: str, nivel_platillo: str, modo: str = "salado") -> str:
    """Arma la frase que compara el gusto del usuario con el sabor del producto."""
    if modo == "dulce":
        gusto = NIVELES_DULCE.get(nivel_usuario, "un dulzor moderado")
        sabor = DULZOR_PLATILLO.get(nivel_platillo, "tiene un dulzor parejo")
    else:
        gusto = NIVELES_PICANTE.get(nivel_usuario, "un picor moderado")
        sabor = PICOR_PLATILLO.get(nivel_platillo, "pica tantito")
    if nivel_usuario == nivel_platillo:
        return f"te gusta {gusto} y {sabor}"
    return f"te gusta {gusto} pero {sabor}"


def frase_precio(precio: float, presupuesto: float) -> str:
    """Arma la frase sobre el precio comparado con el presupuesto indicado."""
    if precio <= presupuesto:
        return "se queda dentro de lo que quieres gastar"
    diferencia = precio - presupuesto
    if diferencia <= presupuesto * 0.15:
        return "se pasa solo un poco de tu presupuesto"
    return "se pasa bastante de lo que querias gastar"


def frase_cierre(compatibilidad: float) -> str:
    """Elige el cierre segun el porcentaje de coincidencia."""
    for minimo, texto in CIERRES:
        if compatibilidad >= minimo:
            return texto
    return CIERRES[-1][1]


def redactar_motivo(
    niveles_usuario: dict[str, str],
    niveles_platillo: dict[str, str],
    precio: float,
    presupuesto: float,
    compatibilidad: float,
    modo: str = "salado",
) -> str:
    """Junta las frases en una explicacion corta y entendible para el usuario."""
    clave_usuario = "dulce" if modo == "dulce" else "picante"
    clave_platillo = "dulzor" if modo == "dulce" else "picor"
    partes = [
        frase_porcion(niveles_usuario.get("hambre", "medio"), niveles_platillo.get("saciedad", "medio")),
        frase_sabor(
            niveles_usuario.get(clave_usuario, "medio"),
            niveles_platillo.get(clave_platillo, "medio"),
            modo,
        ),
        frase_precio(precio, presupuesto),
    ]
    primera = f"{partes[0]}, {partes[1]} y {partes[2]}."
    return f"{primera[0].upper()}{primera[1:]} {frase_cierre(compatibilidad)}"
