// Gancho que recuerda si el usuario prefiere el tema claro u oscuro
import { useCallback, useEffect, useState } from 'react'

const CLAVE = 'sabor_perfecto_tema'

// Lee la preferencia guardada sin romperse si el navegador la bloquea
function leer_modo_guardado() {
  try {
    const guardado = window.localStorage.getItem(CLAVE)
    if (guardado === 'claro' || guardado === 'oscuro') return guardado
  } catch {
    return 'claro'
  }
  return 'claro'
}

export function useModoTema() {
  const [modo, establecer_modo] = useState(leer_modo_guardado)

  // Guarda la eleccion para la siguiente visita
  useEffect(() => {
    try {
      window.localStorage.setItem(CLAVE, modo)
    } catch {
      // Si no se puede guardar, el tema sigue funcionando en esta sesion
    }
  }, [modo])

  const alternar_modo = useCallback(() => {
    establecer_modo((actual) => (actual === 'claro' ? 'oscuro' : 'claro'))
  }, [])

  return { modo, alternar_modo }
}

export default useModoTema
