// Cliente unico para hablar con el backend de Sabor Perfecto
import axios from 'axios'

// La direccion del backend se configura en el archivo .env
const URL_API = import.meta.env.VITE_URL_API || 'http://127.0.0.1:8000/api'

const cliente = axios.create({
  baseURL: URL_API,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Traduce cualquier fallo de red o del servidor a un mensaje entendible
function mensaje_de_error(error) {
  if (error.code === 'ECONNABORTED') return 'La consulta tardo demasiado. Intenta de nuevo.'
  if (!error.response) return 'No pudimos conectar con el servidor. Revisa tu conexion.'
  if (error.response.status === 404) return 'No encontramos lo que buscabas.'
  if (error.response.status >= 500) return 'El servidor tuvo un problema. Intenta en un momento.'
  return error.response.data?.detail || 'Ocurrio un problema al consultar la informacion.'
}

cliente.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => Promise.reject(new Error(mensaje_de_error(error))),
)

// Pide la recomendacion principal y las demas opciones
export async function pedir_recomendaciones(preferencias, modo, limite) {
  const { data } = await cliente.post('/recomendaciones', { ...preferencias, modo, limite })
  return data
}

// Pide los perfiles rapidos de preferencias
export async function pedir_preajustes() {
  const { data } = await cliente.get('/preajustes')
  return data
}

// Pide una pagina del menu aplicando filtros
export async function pedir_platillos(filtros = {}) {
  const { data } = await cliente.get('/platillos', { params: filtros })
  return data
}

// Pide el detalle de un platillo junto con sus similares
export async function pedir_platillo(id) {
  const { data } = await cliente.get(`/platillos/${id}`)
  return data
}

// Pide los platillos mas recomendados
export async function pedir_populares(limite = 6) {
  const { data } = await cliente.get('/platillos/populares', { params: { limite } })
  return data
}

// Pide el precio mas bajo y mas alto de lo que se muestra en ese modo
export async function pedir_rango_precios(modo = 'salado') {
  const { data } = await cliente.get('/platillos/rango-precios', { params: { modo } })
  return data
}

// Pide las categorias del menu
export async function pedir_categorias() {
  const { data } = await cliente.get('/categorias')
  return data
}

// Pide las etiquetas con las que se puede filtrar
export async function pedir_etiquetas() {
  const { data } = await cliente.get('/etiquetas')
  return data
}

export default cliente
