# SaborPerfecto — Interfaz

Interfaz web del recomendador de platillos, hecha con **React 19 + Vite + Material UI**.

Su regla principal: **no muestra nada tecnico**. El usuario mueve tres barras y recibe un platillo
con su porcentaje de coincidencia y una explicacion en lenguaje de comida. Todo el calculo pasa en
el backend.

---

## Como correrlo

```bash
npm install
npm run dev        # desarrollo en http://localhost:5173
npm run build      # version para publicar, queda en dist/
npm run preview    # revisa la version compilada
npm run lint       # revision del codigo
```

El backend debe estar levantado en la direccion que indique `VITE_URL_API`.

---

## Variables de entorno

Viven en `.env` (ignorado por git). El archivo `.env.ejemplo` tiene las mismas llaves para copiar.

| Variable | Para que sirve |
|---|---|
| `VITE_URL_API` | Direccion del backend, por ejemplo `http://127.0.0.1:8000/api`. Si cambias `API_PUERTO` en el backend, cambia tambien este |
| `VITE_NOMBRE_APP` | Nombre que se muestra en la barra y el pie |
| `VITE_MONEDA` | Moneda de los precios |

---

## Estructura de `src/`

- `main.jsx` — monta la aplicacion y habilita las rutas.
- `App.jsx` — tema, barra, pie de pagina y rutas (cada pantalla se carga solo cuando se visita).
- `paginas/`
  - `inicio.jsx` — las tres barras, el interruptor de la carta dulce, el producto recomendado
    y el resto de las opciones.
  - `menu.jsx` — menu completo (comida, postres y bebidas) con buscador, filtros por tipo,
    categoria y etiqueta, orden y paginacion.
  - `detalle_platillo.jsx` — ficha del platillo y sugerencias parecidas.
  - `como_funciona.jsx` — los tres pasos y los favoritos de los clientes.
  - `no_encontrada.jsx` — pantalla para direcciones que no existen.
- `componentes/`
  - `diseno/` — barra de navegacion, pie de pagina y contenedor de pagina.
  - `preferencias/` — las barras, los preajustes rapidos y el cajon inferior de telefono.
  - `platillos/` — tarjeta del recomendado, tarjeta de menu y fila de opcion.
  - `comunes/` — imagen, anillo de coincidencia, medidores, esqueletos, errores y estado vacio.
- `ganchos/` — `useRecomendaciones` (consulta con espera al mover las barras), `usePeticion`
  (consultas sencillas) y `useModoTema` (tema claro u oscuro recordado).
- `servicios/cliente_api.js` — unica puerta hacia el backend, con mensajes de error entendibles.
- `utiles/` — `constantes.js`, `formato.js`, `validaciones.js` y `etiquetas_texto.js`. Toda la
  logica que se repite vive aqui.
- `tema/tema.js` — paleta, tipografias (Epilogue y DM Sans) y estilos de los componentes.

---

## Como se adapta a cada pantalla

| Tamano | Comportamiento |
|---|---|
| Telefono (menos de 900 px) | Una sola columna. Las barras se abren en un cajon inferior con el boton "Ajustar mi antojo", asi el resultado nunca se pierde de vista. |
| Tableta | Una columna mas holgada, tarjetas en dos filas y navegacion en el menu lateral. |
| Escritorio (1200 px o mas) | Panel de preferencias fijo a la izquierda y resultados a la derecha, como en el diseno original. |

---

## Notas

- Los nombres estan en espanol. La unica excepcion son los hooks: React exige que empiecen con
  `use`, por eso se llaman `useRecomendaciones`, `usePeticion` y `useModoTema`.
- Mientras la columna `url_imagen` de un platillo este vacia, la tarjeta dibuja un fondo de color
  segun su categoria con su icono. En cuanto se llene con una direccion de imagen, aparece la foto
  real sin cambiar nada del codigo.
- El tema claro u oscuro se guarda en el navegador de cada visitante.
- Las tres barras arrancan siempre en su nivel normal. El presupuesto se coloca en el punto medio
  de los precios reales de la carta que se este viendo, asi que cambia al prender el dulce.
- Las tres barras comparten la misma escala: Poco, Normal y Mucho. Un cero se entiende solo
  (nada de hambre, nada de picante), asi que no hace falta una cuarta marca.

---
## Creditos

Interfaz desarrollada por el **Equipo 1** para la materia de Inteligencia Artificial, rama
**Sistemas difusos (logica difusa)**, de la Universidad Tecnologica de Tehuacan.

| Integrante |
|---|
| Barcenas Arcos Bruno Emmanuel |
| Orduña Pacheco Luis Angel |
| Leyva Martinez Ryan |
| Perez Rojas Yahir |

### Recursos y fuentes

- El **diseño visual** parte de una maqueta generada con **Google Stitch**, incluida en
  `stitch_saborperfecto_fuzzy_recommender/`. De ahi salieron la paleta terracota, las tipografias y
  la idea del logo; todo se reconstruyo despues con componentes de Material UI.
- El **logo** de `public/logo-saborperfecto.svg` se redibujo a mano en SVG a partir de esa maqueta.
  No se uso ningun archivo de imagen externo.
- **No se incluyen fotografias.** Mientras la columna `url_imagen` de un producto este vacia, la
  tarjeta dibuja un fondo de color segun su categoria, de modo que el proyecto no depende de
  imagenes con derechos de terceros.
- Las **tipografias** Epilogue y DM Sans se cargan desde Google Fonts; los **iconos** provienen de
  Material Symbols.
- Los textos de la interfaz son propios, escritos para que ningun termino tecnico del sistema difuso
  llegue al usuario final.

### Que genero la IA y que hizo el equipo

Desarrollado con asistencia de **Claude Code (modelo Opus 5)**; la bitacora de prompts esta en
`Documentacion/06_Bitacora_de_prompts_y_reflexion.docx`.

**Generado por la IA:**

| Archivo o componente | Detalle |
|---|---|
| `tema/tema.js` | Traduccion de la paleta y las tipografias de la maqueta a un tema de Material UI, con modo claro y oscuro |
| `paginas/` | Las 5 pantallas: inicio, menu, detalle, como funciona y 404 |
| `componentes/` | Los 14 componentes, incluidos el panel de preferencias, el anillo de coincidencia, las tarjetas y el cajon de telefono |
| `ganchos/` y `servicios/` | Las consultas al backend con espera al arrastrar y el cliente de axios |
| `utiles/` | Formatos, validaciones y la traduccion de numeros a frases como "Bien servido" o "Pica rico" |
| `public/logo-saborperfecto.svg` | El trazado del logo en SVG |

**Decidido y corregido por el equipo:**

| Aporte | Detalle |
|---|---|
| Regla principal de la interfaz | Que **no aparezca nada tecnico**: ni formulas, ni reglas, ni vocabulario difuso |
| Uso de Material UI | Exigir componentes de la libreria en lugar de estilos propios |
| Escala de las barras | Corregir los cuatro niveles que propuso la IA y dejar Poco, Normal y Mucho en las tres |
| Comportamiento del cero | Definir que el "nada" solo tiene sentido en picante y dulzor, no en hambre |
| Interruptor de carta dulce | La idea de cambiar la barra de picante por una de dulzor |
| Correcciones de uso real | El boton Aceptar del cajon en telefono, el desplazamiento independiente del panel y el regreso suave al cambiar de pantalla |
| Deteccion de fallas | Notar que seguia apareciendo el logo de React, lo que destapo un problema de cache |
| Pruebas | Revision visual en computadora y telefono, y despliegue de la version publicada |

---

## Licencia

Codigo publicado bajo la **Licencia MIT**, igual que el resto del proyecto. El texto completo esta
en el [README de la raiz](../../README.md).

### Licencias de las dependencias

| Paquete | Licencia |
|---|---|
| React, React DOM | MIT |
| React Router | MIT |
| Material UI y Material Icons | MIT |
| Emotion (react y styled) | MIT |
| Axios | MIT |
| Vite y @vitejs/plugin-react | MIT |
| oxlint | MIT |
| Iconos Material Symbols | Apache 2.0 |
| Tipografias Epilogue y DM Sans (Google Fonts) | SIL Open Font License 1.1 |

Todas permiten el uso academico y comercial sin costo.
