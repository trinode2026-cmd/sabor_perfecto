// Tarjeta de un platillo para las rejillas del menu y de las opciones
import { Link as EnlaceRuta } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'

import ImagenPlatillo from '../comunes/imagen_platillo'
import { formatear_precio, recortar_texto } from '../../utiles/formato'
import { color_coincidencia, texto_porcion, texto_sabor } from '../../utiles/etiquetas_texto'
import { RUTAS } from '../../utiles/constantes'

// Tarjeta del menu con la imagen, la categoria, el nombre, la descripcion recortada,
// la porcion, el sabor y el precio. Con mostrar_coincidencia tambien pinta el
// porcentaje que calculo el backend sobre la imagen
export function TarjetaPlatillo({ platillo, mostrar_coincidencia = false, modo = 'salado' }) {
  const es_dulce = modo === 'dulce' || platillo.tipo === 'postre' || platillo.tipo === 'bebida'
  return (
    <Card sx={{ height: '100%', '&:hover': { transform: 'translateY(-3px)' } }}>
      <CardActionArea
        component={EnlaceRuta}
        to={`${RUTAS.platillo}/${platillo.id}`}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <Box sx={{ position: 'relative' }}>
          <ImagenPlatillo platillo={platillo} altura={170} />
          {mostrar_coincidencia && platillo.coincidencia !== undefined && (
            <Chip
              label={`${platillo.coincidencia}% para ti`}
              color={color_coincidencia(platillo.coincidencia)}
              size="small"
              sx={{ position: 'absolute', top: 12, right: 12 }}
            />
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              {platillo.categoria}
            </Typography>
            <Typography variant="h5" sx={{ lineHeight: 1.25 }}>
              {platillo.nombre}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
            {recortar_texto(platillo.descripcion, 95)}
          </Typography>

          <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', gap: 0.75 }}>
            <Chip label={texto_porcion(platillo.saciedad)} size="small" variant="outlined" />
            <Chip
              label={texto_sabor(platillo, modo)}
              size="small"
              variant="outlined"
              color={es_dulce ? 'warning' : 'error'}
            />
          </Stack>

          <Typography variant="h6" color="primary" sx={{ mt: 0.5 }}>
            {formatear_precio(platillo.precio)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default TarjetaPlatillo
