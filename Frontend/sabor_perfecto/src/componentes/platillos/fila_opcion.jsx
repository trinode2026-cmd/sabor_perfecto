// Fila compacta de las demas opciones compatibles, ordenadas por coincidencia
import { Link as EnlaceRuta } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'

import ImagenPlatillo from '../comunes/imagen_platillo'
import { formatear_precio, recortar_texto } from '../../utiles/formato'
import { color_coincidencia, texto_porcion, texto_sabor } from '../../utiles/etiquetas_texto'
import { RUTAS } from '../../utiles/constantes'

// Fila compacta de una de las opciones que devolvio el backend: muestra su posicion en
// el orden, su porcentaje de coincidencia, la porcion, el sabor y el precio
export function FilaOpcion({ platillo, posicion, modo = 'salado' }) {
  const color = color_coincidencia(platillo.coincidencia)

  return (
    <Card>
      <CardActionArea component={EnlaceRuta} to={`${RUTAS.platillo}/${platillo.id}`}>
        <Box sx={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
          <Box sx={{ width: { xs: 92, sm: 128 }, minHeight: 104, flexShrink: 0 }}>
            <ImagenPlatillo platillo={platillo} altura="100%" mostrar_nombre={false} />
          </Box>

          <Box sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2 }, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                #{posicion}
              </Typography>
              <Typography variant="h6" sx={{ lineHeight: 1.2, minWidth: 0 }} noWrap>
                {platillo.nombre}
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              {recortar_texto(platillo.descripcion, 70)}
            </Typography>

            <Box
              sx={{
                mt: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flexWrap: 'wrap',
              }}
            >
              <Chip label={formatear_precio(platillo.precio)} size="small" color="secondary" />
              <Typography variant="caption" color="text.secondary">
                {texto_porcion(platillo.saciedad)} - {texto_sabor(platillo, modo)}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              width: { xs: 86, sm: 120 },
              flexShrink: 0,
              p: { xs: 1.5, sm: 2 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-end',
              gap: 0.5,
            }}
          >
            <Typography variant="h5" color={`${color}.main`}>
              {platillo.coincidencia}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              para ti
            </Typography>
            <LinearProgress
              variant="determinate"
              value={platillo.coincidencia}
              color={color}
              sx={{ width: '100%', height: 6 }}
            />
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  )
}

export default FilaOpcion
