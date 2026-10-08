// Gancho general para cualquier consulta al backend que solo necesita cargar datos
import { useCallback, useEffect, useState } from 'react'

// Ejecuta cualquier consulta al backend y devuelve los datos recibidos, si todavia esta
// cargando, el mensaje de error y la funcion para volver a pedirlos. La consulta se
// repite sola cuando cambia alguna de las dependencias indicadas
export function usePeticion(consulta, dependencias = [], valor_inicial = null) {
  const [datos, establecer_datos] = useState(valor_inicial)
  const [cargando, establecer_cargando] = useState(true)
  const [error, establecer_error] = useState('')

  const ejecutar = useCallback(async () => {
    establecer_cargando(true)
    establecer_error('')
    try {
      establecer_datos(await consulta())
    } catch (fallo) {
      establecer_error(fallo.message)
    } finally {
      establecer_cargando(false)
    }
    // La consulta se vuelve a crear cuando cambian las dependencias indicadas
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencias)

  useEffect(() => {
    ejecutar()
  }, [ejecutar])

  return { datos, cargando, error, recargar: ejecutar }
}

export default usePeticion
