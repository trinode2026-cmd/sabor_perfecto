// Marca de SaborPerfecto: campana de servicio con el arco de la sugerencia
import Box from '@mui/material/Box'

export function Logo({ tamano = 38, con_teja = true }) {
  // Sin teja el dibujo toma el color del texto que lo rodea
  const color_fondo = con_teja ? '#d85a2a' : 'transparent'
  const color_campana = con_teja ? '#ffffff' : 'currentColor'
  const color_acento = con_teja ? '#ffdbcf' : 'currentColor'

  return (
    <Box
      component="svg"
      viewBox="0 0 512 512"
      role="img"
      aria-label="SaborPerfecto"
      sx={{
        width: tamano,
        height: tamano,
        display: 'block',
        flexShrink: 0,
        opacity: con_teja ? 1 : 0.9,
      }}
    >
      <rect width="512" height="512" rx="116" fill={color_fondo} />
      <path
        d="M198 150q58-56 116 0"
        fill="none"
        stroke={color_acento}
        strokeWidth="24"
        strokeLinecap="round"
      />
      <circle cx="256" cy="188" r="31" fill={color_acento} />
      <path d="M152 356a104 136 0 0 1 208 0z" fill={color_campana} />
      <rect x="116" y="356" width="280" height="32" rx="16" fill={color_campana} />
    </Box>
  )
}

export default Logo
