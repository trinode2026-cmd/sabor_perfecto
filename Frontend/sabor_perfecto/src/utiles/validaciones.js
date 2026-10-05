// Validaciones compartidas de las preferencias y de los filtros del menu
import { LIMITES, PREFERENCIAS_INICIALES } from './constantes'

// Deja un numero dentro de un rango
export function recortar(valor, minimo, maximo) {
  const numero = Number(valor)
  if (Number.isNaN(numero)) return minimo
  return Math.max(minimo, Math.min(maximo, numero))
}

// Ajusta una sola preferencia a sus limites permitidos
export function validar_preferencia(nombre, valor) {
  const limite = LIMITES[nombre]
  if (!limite) return valor
  return recortar(valor, limite.minimo, limite.maximo)
}

// Ajusta las tres preferencias de una sola vez
export function validar_preferencias(preferencias = {}) {
  return {
    hambre: validar_preferencia('hambre', preferencias.hambre ?? PREFERENCIAS_INICIALES.hambre),
    sabor: validar_preferencia('sabor', preferencias.sabor ?? PREFERENCIAS_INICIALES.sabor),
    presupuesto: validar_preferencia('presupuesto', preferencias.presupuesto),
  }
}

// Punto medio de un rango de precios, redondeado a multiplos de cinco
export function punto_medio_precio(minimo, maximo) {
  const medio = (Number(minimo) + Number(maximo)) / 2
  return Math.round(medio / 5) * 5
}

// Quita del objeto de filtros los valores vacios antes de llamar al backend
export function limpiar_filtros(filtros = {}) {
  const limpios = {}
  Object.entries(filtros).forEach(([clave, valor]) => {
    if (valor === '' || valor === null || valor === undefined) return
    limpios[clave] = valor
  })
  return limpios
}

// Normaliza el texto de busqueda que escribe el usuario
export function limpiar_busqueda(texto) {
  return String(texto || '').trim().replace(/\s+/g, ' ')
}
