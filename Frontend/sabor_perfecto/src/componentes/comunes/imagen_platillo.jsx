// Muestra la foto del platillo o un fondo decorativo cuando todavia no tiene imagen
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import SetMealIcon from '@mui/icons-material/SetMeal'
import RamenDiningIcon from '@mui/icons-material/RamenDining'
import LunchDiningIcon from '@mui/icons-material/LunchDining'
import DinnerDiningIcon from '@mui/icons-material/DinnerDining'
import BakeryDiningIcon from '@mui/icons-material/BakeryDining'
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf'
import GroupsIcon from '@mui/icons-material/Groups'
import CakeIcon from '@mui/icons-material/Cake'
import LocalCafeIcon from '@mui/icons-material/LocalCafe'

// Icono que acompana a cada categoria del menu
const ICONOS = {
  lunch_dining: LunchDiningIcon,
  ramen_dining: RamenDiningIcon,
  dinner_dining: DinnerDiningIcon,
  set_meal: SetMealIcon,
  bakery_dining: BakeryDiningIcon,
  eco: EnergySavingsLeafIcon,
  groups: GroupsIcon,
  local_fire_department: LocalFireDepartmentIcon,
  restaurant: RestaurantIcon,
  cake: CakeIcon,
  local_cafe: LocalCafeIcon,
}

// Degradados calidos que se reparten entre las categorias
const FONDOS = [
  'linear-gradient(135deg, #c74e1e 0%, #a53604 100%)',
  'linear-gradient(135deg, #41674c 0%, #294e36 100%)',
  'linear-gradient(135deg, #9b6b00 0%, #7b5500 100%)',
  'linear-gradient(135deg, #b4472c 0%, #7b2b12 100%)',
  'linear-gradient(135deg, #5f7f5a 0%, #3b5a3c 100%)',
  'linear-gradient(135deg, #a8763a 0%, #7a4f1d 100%)',
  'linear-gradient(135deg, #8c3f52 0%, #5e2436 100%)',
]

// Elige siempre el mismo fondo para la misma categoria
function fondo_de(texto) {
  const suma = String(texto || '')
    .split('')
    .reduce((total, letra) => total + letra.charCodeAt(0), 0)
  return FONDOS[suma % FONDOS.length]
}

// Muestra la foto del platillo cuando el backend manda url_imagen; si viene vacia,
// pinta un degradado fijo por categoria con el icono que indica icono_categoria
export function ImagenPlatillo({ platillo, altura = 180, mostrar_nombre = true }) {
  const Icono = ICONOS[platillo?.icono_categoria] || RestaurantIcon
  // Cuando la altura llega en numero se usa tambien como tamano minimo del fondo
  const altura_minima = typeof altura === 'number' ? altura : undefined

  if (platillo?.url_imagen) {
    return (
      <Box
        component="img"
        src={platillo.url_imagen}
        alt={platillo.nombre}
        loading="lazy"
        sx={{ width: '100%', height: altura, minHeight: altura_minima, objectFit: 'cover', display: 'block' }}
      />
    )
  }

  return (
    <Box
      aria-label={platillo?.nombre}
      sx={{
        height: altura,
        minHeight: altura_minima,
        background: fondo_de(platillo?.categoria),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        px: 2,
        color: 'common.white',
        textAlign: 'center',
      }}
    >
      <Icono sx={{ fontSize: altura_minima && altura_minima < 150 ? 32 : 46, opacity: 0.9 }} />
      {mostrar_nombre && (
        <Typography variant="overline" sx={{ opacity: 0.85, lineHeight: 1.2 }}>
          {platillo?.categoria}
        </Typography>
      )}
    </Box>
  )
}

export default ImagenPlatillo
