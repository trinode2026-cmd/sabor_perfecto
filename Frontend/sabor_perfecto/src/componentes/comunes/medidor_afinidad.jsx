// Barra con etiqueta que muestra una caracteristica del platillo
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'

import { limpiar_porcentaje } from '../../utiles/formato'

export function MedidorAfinidad({ titulo, valor, detalle, color = 'primary' }) {
  const porcentaje = limpiar_porcentaje(valor)
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {titulo}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {detalle ?? `${porcentaje}%`}
        </Typography>
      </Box>
      <LinearProgress variant="determinate" value={porcentaje} color={color} />
    </Box>
  )
}

export default MedidorAfinidad
