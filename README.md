# SaborPerfecto

Aplicacion web que recomienda que comer segun tres cosas que el usuario decide en el momento:
**cuanta hambre trae**, **que tan picoso le gusta** y **cuanto quiere gastar**. Con un interruptor
cambia a la **carta dulce**: la barra del picante se vuelve de dulzor y el recomendador busca entre
los postres y las bebidas en lugar de la comida.

Quien decide no es una lista de condiciones: es un **sistema de logica difusa (modelo Mamdani)** que
vive completo en el backend. La interfaz nunca muestra formulas, reglas ni vocabulario tecnico; el
usuario solo ve el platillo, su porcentaje de coincidencia y una explicacion en lenguaje de comida.

Este repositorio contiene las **dos aplicaciones**: la API y la interfaz.

---

## Estructura

```
SaborPerfecto/
├─ Backend/                              API en FastAPI + el motor difuso
│  ├─ venv/                              Entorno virtual de Python (no se sube)
│  ├─ requirements.txt                   Dependencias del backend
│  └─ api_sabor_perfecto/
│     ├─ main.py                         Arranque, CORS y registro de rutas
│     ├─ .env / .env.ejemplo             Configuracion (el .env no se sube)
│     ├─ core/                           Configuracion y conexion a la base de datos
│     ├─ models/                         Modelos del ORM (las tablas)
│     ├─ schemas/                        Validacion de entradas y salidas
│     ├─ services/                       Motor difuso, recomendador, menu y siembra
│     ├─ utiles/                         Validaciones, formatos y textos compartidos
│     ├─ api/routes/                     Endpoints
│     └─ README.md                       Como funciona el sistema difuso a detalle
│
├─ Frontend/sabor_perfecto/              Interfaz en React + Vite + Material UI
│  ├─ .env / .env.production             URL de la API (ver mas abajo)
│  ├─ public/                            Logo e iconos
│  ├─ src/
│  │  ├─ paginas/                        Inicio, menu, detalle, como funciona, 404
│  │  ├─ componentes/                    Piezas de interfaz agrupadas por tema
│  │  ├─ ganchos/                        Hooks de consulta y de tema
│  │  ├─ servicios/                      Cliente del API
│  │  ├─ utiles/                         Formatos, validaciones y textos compartidos
│  │  └─ tema/                           Paleta y tipografias
│  └─ README.md                          Scripts, variables y estructura del frontend
│
├─ Documentacion/                        Notas internas (no se sube)
└─ stitch_saborperfecto_fuzzy_recommender/   Diseno de referencia (no se sube)
```

---

## Stack

| Capa | Tecnologia |
|---|---|
| API | FastAPI + Uvicorn (Python 3.14) |
| ORM | SQLAlchemy 2 (el equivalente de Sequelize) + PyMySQL |
| Base de datos | MariaDB |
| Motor difuso | Modulo propio en Python puro, sin dependencias externas |
| Interfaz | React 19 + Vite + Material UI 9 |
| Consultas | Axios + React Router |

---

## Como correrlo

### Backend

```bash
cd Backend
venv\Scripts\activate              # en Windows
pip install -r requirements.txt

cd api_sabor_perfecto
python -m services.sembrar_datos    # crea las tablas y siembra los 80 productos
python main.py
```

`python main.py` levanta la API en el host y el puerto del archivo `.env` (`API_HOST` y
`API_PUERTO`). Con los valores por defecto queda en `http://127.0.0.1:8000`, con su documentacion
en `/docs`. La ruta `GET /salud` dice si la API y la base de datos responden, e informa en que
puerto esta.

El script de siembra se puede volver a correr sin miedo: no duplica productos y actualiza los
parametros del motor si cambiaron.

### Frontend

```bash
cd Frontend/sabor_perfecto
npm install
npm run dev
```

Queda en `http://localhost:5173`. Para la version de produccion, `npm run build`.

---

## Variables de entorno

Nada sensible vive en el codigo. Cada lado tiene su `.env` (que **no se sube**) y un `.env.ejemplo`
con las mismas llaves vacias para que cualquiera reproduzca la configuracion.

**Backend** (`Backend/api_sabor_perfecto/.env`)

| Variable | Para que sirve |
|---|---|
| `BD_HOST`, `BD_PUERTO`, `BD_USUARIO`, `BD_CONTRASENA`, `BD_NOMBRE` | Conexion a MariaDB |
| `BD_MOTOR` | Motor de base de datos |
| `API_HOST` | Direccion donde escucha la API |
| `API_PUERTO` | Puerto de la API, entre 1 y 65535 |
| `RECARGA_AUTOMATICA` | Si la API se reinicia sola al cambiar el codigo |
| `ENTORNO` | `desarrollo` o `produccion` |
| `PREFIJO_API` | Prefijo de las rutas, por defecto `/api` |
| `ORIGENES_PERMITIDOS` | Dominios del frontend autorizados, separados por coma |
| `LIMITE_OPCIONES` | Cuantas opciones devuelve el recomendador |
| `MONEDA` | Moneda que se muestra en los precios |

**Frontend** (`Frontend/sabor_perfecto/.env`)

| Variable | Para que sirve |
|---|---|
| `VITE_URL_API` | Direccion del backend, **terminando en `/api`** |
| `VITE_NOMBRE_APP` | Nombre que aparece en la interfaz |
| `VITE_MONEDA` | Moneda de los precios |

Vite incrusta estas variables **al compilar**, no las lee al ejecutarse: editar el `.env` en el
servidor despues del build no hace nada, hay que recompilar. Por eso conviene dejar el `.env`
apuntando a local y crear un `.env.production` con la URL publica; `npm run build` lo toma solo.

---

## Endpoints

| Metodo | Ruta | Que hace |
|---|---|---|
| `GET` | `/salud` | Estado de la API y de la base de datos |
| `POST` | `/api/recomendaciones` | Calcula la mejor opcion y las demas; acepta `modo` salado o dulce |
| `GET` | `/api/preajustes` | Perfiles rapidos de preferencias |
| `GET` | `/api/platillos` | Menu con busqueda, filtros por categoria, etiqueta y tipo, orden y paginacion |
| `GET` | `/api/platillos/populares` | Los productos mas recomendados |
| `GET` | `/api/platillos/rango-precios` | Precio mas bajo y mas alto, por `modo` |
| `GET` | `/api/platillos/{id}` | Detalle de un producto y sus similares |
| `GET` | `/api/categorias` | Categorias con su conteo |
| `GET` | `/api/etiquetas` | Etiquetas para filtrar el menu |

La respuesta de `/api/recomendaciones` incluye un campo `traza` con el detalle completo de la
inferencia. Esta ahi como evidencia tecnica; la interfaz lo ignora por completo.

---

## El sistema difuso en resumen

Las tres preferencias del usuario y los tres atributos de cada producto se convierten en grados de
pertenencia (`bajo`, `medio`, `alto`). 27 reglas comparan unos con otros y proponen un nivel de
compatibilidad; el resultado se ajusta por que tan bien cabe el precio en el presupuesto, y al final
queda un solo numero de 0 a 100 que es el porcentaje que ve el usuario. Hay 36 reglas guardadas
porque el bloque de sabor cambia segun la carta.

La explicacion completa, funcion por funcion, esta en
[Backend/api_sabor_perfecto/README.md](Backend/api_sabor_perfecto/README.md).

---

## Que NO se sube al repositorio

El `.gitignore` de la raiz cubre las dos aplicaciones:

- **Secretos**: todos los `.env`, llaves y certificados. Si se suben `.env.ejemplo` (plantilla sin
  datos) y `.env.production` del frontend, que solo trae la URL publica de la API y que el servidor
  necesita para compilar.
- **Dependencias y compilados**: `venv/`, `node_modules/`, `dist/`, `__pycache__/`.
- **Material de trabajo**: la carpeta `Documentacion/` con las notas internas y
  `stitch_saborperfecto_fuzzy_recommender/` con las maquetas del diseno. No forman parte del
  producto.
- **Registros y archivos del editor o del sistema operativo.**

---

## Convenciones del codigo

- Carpetas, archivos, funciones y variables en espanol, con formato `palabra1_palabra2`.
- Un comentario corto de una linea antes de cada funcion o bloque importante.
- Toda la logica que se repite (validaciones, formatos, textos) vive en `utiles/`, en ambos lados.
- Unica excepcion al espanol: los hooks de React deben empezar con `use` por exigencia del
  framework, por eso se llaman `useRecomendaciones`, `usePeticion` y `useModoTema`.
- Las fotos de los productos se cargan desde la columna `url_imagen` de la base de datos. Mientras
  esta vacia, la interfaz dibuja un fondo de color por categoria, asi que nunca se ven imagenes
  rotas; basta llenar esa columna para que aparezcan las fotos reales.

---
## Creditos

Proyecto academico desarrollado por el **Equipo 1** para la materia de Inteligencia Artificial,
rama **Sistemas difusos (logica difusa)**, de la Universidad Tecnologica de Tehuacan.

| Integrante |
|---|
| Barcenas Arcos Bruno Emmanuel |
| Orduña Pacheco Luis Angel |
| Leyva Martinez Ryan |
| Perez Rojas Yahir |

### Datos y fuentes

- **No se uso ningun dataset externo.** El catalogo de 80 productos (50 platillos, 15 postres y
  15 bebidas) es ficticio y fue escrito para este proyecto; vive en
  `Backend/api_sabor_perfecto/services/datos_iniciales.py`. Los valores de saciedad, picor, dulzor
  y precio se asignaron a mano para cubrir todo el espacio de decision del motor.
- Los nombres de los platillos corresponden a **recetas mexicanas tradicionales de dominio
  publico**. No se copiaron descripciones ni fotografias de ningun restaurante o sitio web.
- **No se incluyen imagenes de terceros.** Mientras la columna `url_imagen` este vacia, la interfaz
  dibuja un fondo de color por categoria, de modo que el proyecto no depende de material con
  derechos de autor.
- El **modelo Mamdani** de inferencia difusa es un metodo academico publicado por E. H. Mamdani en
  1975, de dominio publico. No se uso ninguna libreria de logica difusa: el motor se escribio desde
  cero en Python puro.
- El **diseño visual** (paleta, tipografias y logo) parte de una maqueta generada con Google Stitch,
  incluida en `stitch_saborperfecto_fuzzy_recommender/`, adaptada despues a Material UI.
- Las **tipografias** Epilogue y DM Sans provienen de Google Fonts; los iconos, de Material Symbols.

### Que genero la IA y que hizo el equipo

El proyecto se desarrollo con asistencia de **Claude Code (modelo Opus 5)**. La bitacora completa de
los 15 prompts esta en `Documentacion/06_Bitacora_de_prompts_y_reflexion.docx`. El reparto fue:

**Generado por la IA (la parte tecnica pesada):**

| Componente | Detalle |
|---|---|
| Motor de inferencia difusa | `services/motor_difuso.py` completo: funciones de pertenencia, evaluacion de reglas, agregacion, las dos defuzzificaciones y el ajuste de presupuesto por t-norma producto |
| Modelos del ORM y base de datos | Las 7 tablas, sus relaciones y el script de siembra idempotente |
| Endpoints de la API | Las 9 rutas, esquemas de validacion y manejo de errores |
| Componentes de la interfaz | Las 5 pantallas, los 14 componentes de React y el tema de Material UI |
| Catalogo de productos | Redaccion de los 80 nombres, descripciones y valores numericos |
| Documentacion | Los tres README y `Documentacion/sistema_difuso_flujo.md` |

**Decidido, corregido y verificado por el equipo (lo que guio el proyecto):**

| Aporte | Detalle |
|---|---|
| Definicion del problema y del alcance | Que resuelve la aplicacion, que rama de IA usar y que debe ver el usuario final |
| Reglas de trabajo | Nombres en espanol, un comentario por funcion, nada sensible fuera del `.env`, logica repetida en `utiles/`, componentes de Material UI |
| Decision clave de producto | Que **la interfaz no muestre matematicas ni vocabulario difuso**: el usuario solo ve el platillo, su porcentaje y el porque en lenguaje de comida |
| Eleccion entre alternativas | Base de datos, estrategia del presupuesto, comportamiento del modo dulce y separacion de las cartas |
| Correcciones al diseño de la IA | Volver la escala a tres niveles (la IA propuso cuatro y confundian), que el "nada" solo aplique a picante y dulzor, el boton Aceptar del cajon movil, el desplazamiento independiente del panel y el puerto configurable desde el `.env` |
| Deteccion de fallas | El logo de React que seguia apareciendo y el alcance incorrecto de las rutas del `.gitignore`, que llevo a corregirlas |
| Idea del modo dulce | Agregar postres y bebidas con un interruptor, pidiendo expresamente que se avisara si rompia el modelo difuso |
| Pruebas y despliegue | Revision visual en computadora y telefono, y publicacion de la API y la interfaz en el servidor VPS |

En resumen: **la IA escribio el codigo, el equipo definio el problema, tomo las decisiones de diseño,
corrigio los errores del resultado y lo llevo a produccion.**

---

## Licencia

Este proyecto se publica bajo la **Licencia MIT**. En resumen: cualquiera puede usar, copiar,
modificar y distribuir el codigo, siempre que conserve el aviso de copyright y esta nota. El
software se entrega sin garantia.

```
Copyright (c) 2026 Equipo 1 — Barcenas Arcos Bruno Emmanuel, Orduña Pacheco Luis Angel,
Leyva Martinez Ryan, Perez Rojas Yahir.

Se concede permiso, sin costo, a cualquier persona que obtenga una copia de este software y de los
archivos de documentacion asociados, para usar el software sin restriccion, incluyendo sin
limitacion los derechos de usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar
y vender copias del software, sujeto a las siguientes condiciones:

El aviso de copyright anterior y este aviso de permiso deben incluirse en todas las copias o partes
sustanciales del software.

EL SOFTWARE SE PROPORCIONA "TAL CUAL", SIN GARANTIA DE NINGUN TIPO.
```

### Licencias de las librerias usadas

Todas son de codigo abierto y permiten el uso academico y comercial sin costo:

| Componente | Licencia |
|---|---|
| FastAPI, Starlette, Pydantic, pydantic-settings | MIT |
| SQLAlchemy, PyMySQL | MIT |
| python-dotenv, Uvicorn | BSD 3-Clause |
| cryptography | Apache 2.0 / BSD 3-Clause |
| React, React DOM, React Router | MIT |
| Vite, Material UI, Emotion, Axios, oxlint | MIT |
| Iconos Material Symbols | Apache 2.0 |
| Tipografias Epilogue y DM Sans (Google Fonts) | SIL Open Font License 1.1 |
| MariaDB (servidor, usado como servicio externo) | GPL v2 |

MariaDB es GPL v2, pero el proyecto **no la distribuye**: solo se conecta a ella como servicio, por
lo que no afecta la licencia de este codigo.
