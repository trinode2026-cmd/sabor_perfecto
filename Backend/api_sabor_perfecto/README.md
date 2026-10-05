# API Sabor Perfecto

Backend del recomendador de platillos. Entrega el menu y, sobre todo, calcula que platillo le queda
mejor a cada persona con un **sistema de logica difusa (modelo Mamdani)**.

---

## Estructura de carpetas

- `main.py` — arranque de la aplicacion, CORS tomado del `.env` y registro de las rutas.
  Ejecutado directamente, levanta la API en el host y el puerto configurados.
- `core/`
  - `configuracion.py` — lee el `.env`, valida el puerto y arma la cadena de conexion.
  - `base_datos.py` — motor de SQLAlchemy, sesiones, `Base` de los modelos y creacion de tablas.
- `models/` — modelos del ORM: `categorias`, `platillos`, `etiquetas`, `platillos_etiquetas`,
  `conjuntos_difusos`, `reglas` y `consultas`. La tabla `platillos` guarda `tipo`
  (comida, postre o bebida), `picor` y `dulzor`.
- `schemas/` — esquemas de Pydantic que validan lo que entra y lo que sale.
- `services/`
  - `motor_difuso.py` — el sistema de inferencia completo, en Python puro.
  - `servicio_recomendacion.py` — junta la base de datos con el motor y arma la respuesta.
  - `servicio_platillos.py` — menu con filtros, detalle, similares y populares.
  - `datos_iniciales.py` — catalogo de 50 platillos y 30 postres y bebidas, conjuntos,
    matrices de reglas y preajustes.
  - `sembrar_datos.py` — crea las tablas y siembra todo sin duplicar nada.
- `utiles/` — lo que se repite en varios lugares: `validaciones.py`, `formato.py`, `respuestas.py`
  y `texto.py`.
- `api/routes/` — endpoints agrupados por tema.

---

## Como correrlo

```bash
cd ..                               # carpeta Backend
venv\Scripts\activate
pip install -r requirements.txt

cd api_sabor_perfecto
python -m services.sembrar_datos    # tablas + 80 productos + 27 conjuntos + 36 reglas
python main.py
```

`python main.py` lee el host y el puerto del archivo `.env`, asi que para moverlos basta cambiar
`API_HOST` y `API_PUERTO` y volver a levantar la API. El puerto debe estar entre 1 y 65535; si
pones otro, la aplicacion avisa al arrancar en lugar de fallar a medias.

Tambien puedes usar el comando de uvicorn de siempre, que manda sobre el `.env`:

```bash
uvicorn main:app --reload --port 8100
```

Documentacion interactiva en `/docs` del puerto que hayas elegido. Cuando cambies el puerto,
acuerdate de actualizar `VITE_URL_API` en el `.env` del frontend.

---

## El sistema difuso en detalle

### 1. Variables

El recomendador trabaja en dos modos y en cada consulta solo usa uno:

| Modo | Que busca | Variable de sabor |
|---|---|---|
| `salado` | los 50 platillos de comida | `picante` del usuario contra `picor` del platillo |
| `dulce` | los 15 postres y 15 bebidas | `dulce` del usuario contra `dulzor` del producto |

| Lado | Variable | Rango |
|---|---|---|
| Usuario | `hambre` | 0 a 100 |
| Usuario | `picante` o `dulce` | 0 a 100 |
| Usuario | `presupuesto` | 30 a 400 pesos |
| Producto | `saciedad` | 0 a 100 |
| Producto | `picor` o `dulzor` | 0 a 100 |
| Producto | `precio` | 35 a 400 pesos |
| Derivada | `sobreprecio` | por ciento en que el precio pasa el presupuesto |

### 2. Conjuntos (fuzzificacion)

Cada variable se parte en tres conjuntos: `bajo` (trapecio abierto a la izquierda), `medio`
(triangulo) y `alto` (trapecio abierto a la derecha). Los puntos de cada uno viven en la tabla
`conjuntos_difusos`, asi que se pueden calibrar cambiando filas, sin tocar codigo:

| Variable | bajo | medio | alto |
|---|---|---|---|
| `hambre` y `saciedad` | trapecio(25, 55) | triangulo(25, 50, 75) | trapecio(50, 80) |
| `picante` y `picor` | trapecio(20, 50) | triangulo(25, 50, 75) | trapecio(50, 80) |
| `dulce` y `dulzor` | trapecio(20, 50) | triangulo(25, 50, 75) | trapecio(50, 80) |
| `presupuesto` y `precio` | trapecio(90, 150) | triangulo(100, 170, 250) | trapecio(200, 300) |

### 3. Base de reglas

Hay **36 reglas** guardadas, repartidas en cuatro bloques de 9: saciedad, picor, dulzor y precio.
Cada bloque es la matriz 3x3 que cruza el conjunto del usuario con el del producto, y todas comparten
un mismo consecuente: `compatibilidad`, con los conjuntos `muy_baja`, `baja`, `media`, `alta` y
`muy_alta`.

**En cada consulta se usan 27**: siempre entran saciedad, precio y el bloque de sabor del modo
activo. El bloque de picor queda fuera cuando se buscan postres, y el de dulzor queda fuera cuando se
busca comida.

Ninguna regla menciona un platillo concreto, por eso agregar platillos a la base de datos no obliga
a cambiar nada del motor. Ejemplos reales de la tabla `reglas`:

```
SAC01  SI hambre es ALTO        Y saciedad es ALTA  ENTONCES compatibilidad es MUY_ALTA
SAC03  SI hambre es ALTO        Y saciedad es BAJA  ENTONCES compatibilidad es MUY_BAJA
PIC07  SI picante es BAJO       Y picor es ALTO     ENTONCES compatibilidad es MUY_BAJA
PRE07  SI presupuesto es BAJO   Y precio es ALTO    ENTONCES compatibilidad es MUY_BAJA
DUL01  SI dulce es ALTO          Y dulzor es ALTO   ENTONCES compatibilidad es MUY_ALTA
DUL07  SI dulce es BAJO          Y dulzor es ALTO   ENTONCES compatibilidad es MUY_BAJA
```

Cada bloque tiene un peso que refleja su importancia: saciedad `1.0`, picor y dulzor `0.9`, y
precio `0.75`. Las reglas que castigan pasarse del presupuesto llevan un refuerzo extra.

### 4. Inferencia y defuzzificacion

1. **Fuzzificacion** — las tres preferencias y los tres atributos se vuelven grados de pertenencia.
2. **Evaluacion** — cada regla dispara con el **minimo** de sus dos antecedentes (operador "Y"),
   multiplicado por su peso. Eso es su grado de activacion.
3. **Agregacion** — los conjuntos de salida se recortan a la altura de su activacion y se unen con
   el **maximo**.
4. **Defuzzificacion** — se obtiene un solo numero de 0 a 100:
   - **Promedio de alturas** (el que se usa): promedia los centros de los conjuntos de salida
     ponderados por su activacion. Da una escala bien repartida, util para mostrar porcentajes.
   - **Centroide del agregado** (se reporta como referencia): el centro de area clasico de Mamdani.
5. **Ajuste al presupuesto** — el resultado se multiplica por un factor difuso que mide que tan bien
   cabe el precio en el presupuesto. Es una conjuncion difusa con **t-norma producto** entre "que tan
   bien encaja el producto" y "que tan bien cabe en lo que quiero gastar".

El factor vale `1.0` mientras el precio no pase el presupuesto en mas del 15 por ciento, baja de
forma gradual hasta el 80 por ciento de exceso, y nunca cae por debajo de `0.30` para que la opcion
siga apareciendo al final de la lista. Sin este paso el promedio de alturas no alcanza a castigar el
precio: dos productos de 45 y 95 pesos caen los dos en el conjunto "precio bajo" y el sistema los ve
igual de accesibles, aunque el segundo duplique el presupuesto de quien pregunta.

Todas las cifras intermedias viajan en el campo `traza` de la respuesta:
`compatibilidad_sin_ajuste`, `factor_presupuesto`, `sobreprecio_porcentaje`,
`compatibilidad_final` y `compatibilidad_centroide`.

### 5. Explicacion en lenguaje natural

`utiles/texto.py` toma los conjuntos dominantes de la consulta y del platillo y arma una frase
entendible, por ejemplo:

> "Traes mucha hambre y este plato es de los bien servidos, te gusta la comida picosa y es bien
> picoso y se pasa solo un poco de tu presupuesto. Es la mejor opcion que tenemos para ti ahora."

Nunca aparecen palabras como regla, pertenencia, centroide ni grado: eso se queda en la `traza`.

---

## Catalogo sembrado

80 productos mexicanos repartidos en 9 categorias, pensados para cubrir todo el espacio de decision
del motor (desde un cafe de $35 o un taco de $45 hasta un molcajete de $400):

| Categoria | Tipo | Productos |
|---|---|---|
| Antojitos y Tacos | comida | 10 |
| Caldos y Sopas | comida | 7 |
| Guisados Fuertes | comida | 10 |
| Mariscos | comida | 7 |
| Enchiladas y Gratinados | comida | 6 |
| Ligero y Fresco | comida | 6 |
| Para Compartir | comida | 4 |
| Postres | postre | 15 |
| Bebidas | bebida | 15 |

---

## Como calibrar el recomendador

- **Mover los limites de los conjuntos**: editar filas de `conjuntos_difusos`, o cambiar
  `CONJUNTOS_DIFUSOS` en `services/datos_iniciales.py` y volver a correr la siembra.
- **Cambiar el comportamiento de las reglas**: editar `MATRICES_REGLAS` en el mismo archivo y
  sembrar de nuevo; la siembra actualiza las reglas que cambiaron.
- **Cambiar la importancia de cada bloque**: ajustar `PESOS_BLOQUE` en `services/motor_difuso.py`.
- **Ajustar la tolerancia al sobreprecio**: cambiar `TOLERANCIA_PRESUPUESTO` y `PISO_PRESUPUESTO`
  en `services/motor_difuso.py`.
- **Agregar productos**: anadirlos a `PLATILLOS` (comida) o a `POSTRES_Y_BEBIDAS` en
  `services/datos_iniciales.py` y sembrar de nuevo. La siembra no duplica nada.

---
## Creditos

Backend desarrollado por el **Equipo 1** para la materia de Inteligencia Artificial, rama
**Sistemas difusos (logica difusa)**, de la Universidad Tecnologica de Tehuacan.

| Integrante |
|---|
| Barcenas Arcos Bruno Emmanuel |
| Orduña Pacheco Luis Angel |
| Leyva Martinez Ryan |
| Perez Rojas Yahir |

### Datos y fuentes

- **No se uso ningun dataset externo.** Los 80 productos de `services/datos_iniciales.py` son
  ficticios y fueron escritos para este proyecto. Los valores de saciedad, picor, dulzor y precio se
  asignaron a mano para que el catalogo cubriera todo el espacio de decision del motor.
- Los platillos corresponden a **recetas mexicanas tradicionales de dominio publico**. No se
  copiaron descripciones de ningun restaurante ni sitio web.
- El **modelo Mamdani** es un metodo academico publicado por E. H. Mamdani en 1975 (*An experiment in
  linguistic synthesis with a fuzzy logic controller*), de dominio publico. Los conceptos usados
  —conjuntos trapezoidales y triangulares, conjuncion por minimo, agregacion por maximo,
  defuzzificacion por centroide y por promedio de alturas, y t-normas— son teoria estandar de logica
  difusa.
- **No se uso ninguna libreria de logica difusa** (ni scikit-fuzzy ni similares). El motor completo
  esta escrito desde cero en Python puro, sin dependencias.

### Que genero la IA y que hizo el equipo

Desarrollado con asistencia de **Claude Code (modelo Opus 5)**; la bitacora de prompts esta en
`Documentacion/06_Bitacora_de_prompts_y_reflexion.docx`.

**Generado por la IA:**

| Archivo o componente | Detalle |
|---|---|
| `services/motor_difuso.py` | El motor completo: las tres funciones de pertenencia, la fuzzificacion, la evaluacion de reglas con minimo y pesos, la agregacion por maximo, las dos defuzzificaciones y el factor de presupuesto por t-norma producto |
| `services/datos_iniciales.py` | Las matrices de reglas 3x3, los parametros de los 24 conjuntos y la redaccion de los 80 productos |
| `services/sembrar_datos.py` | La siembra idempotente, que inserta, actualiza y limpia sin duplicar |
| `models/` y `core/` | Las 7 tablas del ORM con sus relaciones, la conexion y la configuracion |
| `api/routes/` y `schemas/` | Los 9 endpoints y la validacion de entradas y salidas |
| `utiles/` | Validaciones, formatos y la redaccion de los motivos en lenguaje natural |

**Decidido y corregido por el equipo:**

| Aporte | Detalle |
|---|---|
| Eleccion del ORM | Pedir un equivalente de Sequelize, que llevo a SQLAlchemy |
| Eleccion del motor | Descartar una libreria externa y usar implementacion propia |
| Diseño del catalogo | Exigir 50 platillos mexicanos variados y despues 15 postres y 15 bebidas |
| Idea del modo dulce | El bloque de dulzor nacio de pedir un interruptor de carta dulce, avisando antes si rompia el modelo |
| Deteccion del problema del presupuesto | Notar que recomendaba platillos mucho mas caros de lo pedido, lo que llevo al ajuste por t-norma |
| Puerto configurable | Exigir que `API_HOST` y `API_PUERTO` salieran del `.env` y no del comando |
| Limpieza | Pedir que se eliminara el codigo sin uso, lo que destapo 7 funciones muertas y 3 filas huerfanas |
| Despliegue y pruebas | Publicacion en el servidor VPS y verificacion del funcionamiento real |

---

## Licencia

Codigo publicado bajo la **Licencia MIT**, igual que el resto del proyecto. El texto completo esta
en el [README de la raiz](../../README.md).

### Licencias de las dependencias

| Paquete | Licencia |
|---|---|
| FastAPI, Starlette | MIT |
| Pydantic, pydantic-settings | MIT |
| SQLAlchemy | MIT |
| PyMySQL | MIT |
| python-dotenv | BSD 3-Clause |
| Uvicorn | BSD 3-Clause |
| cryptography | Apache 2.0 / BSD 3-Clause |
| MariaDB (servidor, usado como servicio externo) | GPL v2 |

Todas permiten el uso academico y comercial sin costo. MariaDB es GPL v2, pero el proyecto no la
distribuye: solo se conecta a ella como servicio.
