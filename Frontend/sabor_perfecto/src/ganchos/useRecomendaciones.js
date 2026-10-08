// Gancho que consulta las recomendaciones cada vez que cambian las preferencias
import { useCallback, useEffect, useRef, useState } from 'react'

import { pedir_recomendaciones } from '../servicios/cliente_api'
import { ESPERA_CONSULTA } from '../utiles/constantes'
import { validar_preferencias } from '../utiles/validaciones'

// Pide las recomendaciones al backend cada vez que cambian las preferencias del usuario.
// Valida los valores antes de enviarlos y espera un momento entre un cambio y la consulta
// para no llamar a la API en cada movimiento de la barra
export function useRecomendaciones(preferencias, modo = 'salado', limite = 8) {
  const [resultado, establecer_resultado] = useState(null)
  const [cargando, establecer_cargando] = useState(true)
  const [error, establecer_error] = useState('')
  const primera_carga = useRef(true)

  const consultar = useCallback(async (valores) => {
    try {
      establecer_error('')
      const datos = await pedir_recomendaciones(validar_preferencias(valores), modo, limite)
      establecer_resultado(datos)
    } catch (fallo) {
      establecer_error(fallo.message)
    } finally {
      establecer_cargando(false)
      primera_carga.current = false
    }
  }, [modo, limite])

  // Espera un momento antes de consultar para no saturar el backend al arrastrar
  useEffect(() => {
    if (preferencias.presupuesto === null || preferencias.presupuesto === undefined) return undefined
    if (primera_carga.current) {
      consultar(preferencias)
      return undefined
    }
    establecer_cargando(true)
    const temporizador = setTimeout(() => consultar(preferencias), ESPERA_CONSULTA)
    return () => clearTimeout(temporizador)
  }, [preferencias, consultar])

  return { resultado, cargando, error, reintentar: () => consultar(preferencias) }
}

export default useRecomendaciones
