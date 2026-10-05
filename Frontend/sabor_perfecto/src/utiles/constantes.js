// Valores fijos que usan varias pantallas de la aplicacion

// Nombre y moneda vienen del archivo .env
export const NOMBRE_APP = import.meta.env.VITE_NOMBRE_APP || 'SaborPerfecto'
export const MONEDA = import.meta.env.VITE_MONEDA || 'MXN'

// Los dos modos de busqueda: comida salada o carta dulce
export const MODOS = { salado: 'salado', dulce: 'dulce' }

// Limites de las barras de preferencias
export const LIMITES = {
  hambre: { minimo: 0, maximo: 100, paso: 1 },
  sabor: { minimo: 0, maximo: 100, paso: 1 },
  presupuesto: { minimo: 30, maximo: 400, paso: 5 },
}

// Todas las barras arrancan en su nivel normal
export const PREFERENCIAS_INICIALES = { hambre: 50, sabor: 50, presupuesto: null }

// Marcas que comparten las barras de hambre, picante y dulzor
export const MARCAS_NIVEL = [
  { value: 0, label: 'Poco' },
  { value: 50, label: 'Normal' },
  { value: 100, label: 'Mucho' },
]

// Rutas de navegacion de la aplicacion
export const RUTAS = {
  inicio: '/',
  menu: '/menu',
  platillo: '/platillo',
  comoFunciona: '/como-funciona',
}

// Nombre de cada tipo de producto para los filtros del menu
export const TIPOS_PRODUCTO = [
  { valor: '', texto: 'Todo el menu' },
  { valor: 'comida', texto: 'Comida' },
  { valor: 'postre', texto: 'Postres' },
  { valor: 'bebida', texto: 'Bebidas' },
]

// Opciones con las que se puede ordenar el menu
export const ORDENES_MENU = [
  { valor: 'nombre', texto: 'Nombre' },
  { valor: 'precio_menor', texto: 'Precio: menor a mayor' },
  { valor: 'precio_mayor', texto: 'Precio: mayor a menor' },
  { valor: 'mas_llenador', texto: 'Los mas llenadores' },
  { valor: 'mas_picoso', texto: 'Los mas picosos' },
  { valor: 'mas_dulce', texto: 'Los mas dulces' },
]

// Cuanto esperar antes de pedir nuevas recomendaciones al mover una barra
export const ESPERA_CONSULTA = 350

// Cuantos platillos se muestran por pagina en el menu
export const PLATILLOS_POR_PAGINA = 12
