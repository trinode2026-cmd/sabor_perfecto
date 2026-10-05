// Pie de pagina con la informacion basica del restaurante
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { Link as EnlaceRuta } from 'react-router-dom'

import Logo from './logo'
import { NOMBRE_APP, RUTAS } from '../../utiles/constantes'

export function PiePagina() {
  return (
    <Box
      component="footer"
      sx={{ mt: 8, py: 4, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Logo tamano={28} />
              <Typography variant="h6">{NOMBRE_APP}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Te ayudamos a decidir que comer hoy.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link component={EnlaceRuta} to={RUTAS.menu} underline="hover" color="text.secondary">
              Menu
            </Link>
            <Link component={EnlaceRuta} to={RUTAS.comoFunciona} underline="hover" color="text.secondary">
              Como funciona
            </Link>
          </Box>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3 }}>
          Precios en pesos mexicanos. Los platillos se preparan al momento.
        </Typography>
      </Container>
    </Box>
  )
}

export default PiePagina
