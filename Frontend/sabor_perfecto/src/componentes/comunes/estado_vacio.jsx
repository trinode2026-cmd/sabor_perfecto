// Mensaje que se muestra cuando una busqueda no devuelve platillos
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import SearchOffIcon from '@mui/icons-material/SearchOff'

// Avisa que la busqueda no devolvio ningun platillo y, si se le pasa la funcion
// al_limpiar, ofrece el boton para quitar los filtros aplicados
export function EstadoVacio({ titulo = 'No encontramos platillos', descripcion, al_limpiar }) {
  return (
    <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
      <SearchOffIcon sx={{ fontSize: 56, color: 'text.secondary', opacity: 0.6 }} />
      <Typography variant="h4" sx={{ mt: 2 }}>
        {titulo}
      </Typography>
      {descripcion && (
        <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 420, mx: 'auto' }}>
          {descripcion}
        </Typography>
      )}
      {al_limpiar && (
        <Button variant="outlined" color="secondary" sx={{ mt: 3 }} onClick={al_limpiar}>
          Quitar los filtros
        </Button>
      )}
    </Box>
  )
}

export default EstadoVacio
