// Anillo que resalta el porcentaje de coincidencia del platillo
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

import { limpiar_porcentaje } from '../../utiles/formato'
import { color_coincidencia } from '../../utiles/etiquetas_texto'

// Dibuja como anillo el porcentaje de coincidencia que calculo el backend,
// pintado del color que le corresponde segun que tan alto sea ese porcentaje
export function AnilloCoincidencia({ valor, tamano = 108, etiqueta = 'para ti' }) {
  const porcentaje = limpiar_porcentaje(valor)
  const color = color_coincidencia(porcentaje)

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={100}
        size={tamano}
        thickness={4}
        sx={{ color: 'divider', position: 'absolute' }}
      />
      <CircularProgress
        variant="determinate"
        value={porcentaje}
        size={tamano}
        thickness={4}
        color={color}
        sx={{ transition: 'all 400ms ease' }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h4" sx={{ lineHeight: 1 }}>
          {porcentaje}%
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {etiqueta}
        </Typography>
      </Box>
    </Box>
  )
}

export default AnilloCoincidencia
