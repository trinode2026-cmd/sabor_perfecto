// Una barra deslizante con su titulo, su icono y el texto de lo que significa
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

export function BarraPreferencia({
  titulo,
  ayuda,
  icono,
  valor,
  minimo,
  maximo,
  paso = 1,
  color = 'primary',
  texto_nivel,
  valor_visible,
  marcas = [],
  al_cambiar,
}) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, mb: 0.5 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            bgcolor: `${color}.main`,
            color: `${color}.contrastText`,
            flexShrink: 0,
          }}
        >
          {icono}
        </Box>
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
            {titulo}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {ayuda}
          </Typography>
        </Box>
        <Chip label={valor_visible} color={color} size="small" sx={{ mt: 0.5, flexShrink: 0 }} />
      </Box>

      {/* El margen lateral evita que se corten las etiquetas de los extremos */}
      <Box sx={{ px: 2.5, mt: 1 }}>
        <Slider
          value={valor}
          min={minimo}
          max={maximo}
          step={paso}
          color={color}
          marks={marcas}
          valueLabelDisplay="auto"
          valueLabelFormat={() => valor_visible}
          onChange={(_evento, nuevo) => al_cambiar(nuevo)}
          aria-label={titulo}
          sx={{
            '& .MuiSlider-markLabel': { whiteSpace: 'nowrap' },
            '& .MuiSlider-markLabel[data-index="0"]': { transform: 'translateX(-30%)' },
          }}
        />
      </Box>

      <Typography variant="body2" sx={{ fontWeight: 600, color: `${color}.main` }}>
        {texto_nivel}
      </Typography>
    </Box>
  )
}

export default BarraPreferencia
