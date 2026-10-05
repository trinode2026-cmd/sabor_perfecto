// Al cambiar de pantalla sube la pagina hasta arriba con un deslizamiento suave
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

// Cuanto tarda el deslizamiento de regreso, en milisegundos
const DURACION = 520

// Curva que arranca rapido y frena al llegar arriba
function suavizar(avance) {
  return 1 - (1 - avance) ** 3
}

export function RegresarArriba() {
  const { pathname } = useLocation()
  const animacion = useRef(0)

  useEffect(() => {
    const inicio = window.scrollY
    if (inicio <= 1) return undefined

    // Si el visitante pidio menos movimiento, el salto es inmediato
    const menos_movimiento = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (menos_movimiento) {
      window.scrollTo(0, 0)
      return undefined
    }

    const momento_inicial = performance.now()
    const avanzar = (ahora) => {
      const avance = Math.min(1, (ahora - momento_inicial) / DURACION)
      window.scrollTo(0, inicio * (1 - suavizar(avance)))
      if (avance < 1) animacion.current = requestAnimationFrame(avanzar)
    }
    animacion.current = requestAnimationFrame(avanzar)

    return () => cancelAnimationFrame(animacion.current)
  }, [pathname])

  return null
}

export default RegresarArriba
