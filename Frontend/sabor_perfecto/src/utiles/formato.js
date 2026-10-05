// Formatos de texto que se repiten en varias pantallas
import { MONEDA } from './constantes'

// Da formato de precio en pesos sin decimales
export function formatear_precio(precio) {
  const numero = Number(precio) || 0
  return `$${numero.toLocaleString('es-MX', { maximumFractionDigits: 0 })} ${MONEDA}`
}

// Convierte minutos en un texto corto de tiempo de preparacion
export function formatear_minutos(minutos) {
  const valor = Number(minutos) || 0
  if (valor < 60) return `${valor} min`
  const horas = Math.floor(valor / 60)
  const resto = valor % 60
  return resto ? `${horas} h ${resto} min` : `${horas} h`
}

// Recorta un texto largo para que no rompa el diseno de las tarjetas
export function recortar_texto(texto, maximo = 110) {
  const limpio = String(texto || '')
  if (limpio.length <= maximo) return limpio
  return `${limpio.slice(0, maximo).trimEnd()}...`
}

// Asegura que un porcentaje quede entre 0 y 100
export function limpiar_porcentaje(valor) {
  const numero = Number(valor) || 0
  return Math.max(0, Math.min(100, Math.round(numero)))
}
