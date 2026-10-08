// Barra superior con el logo, la navegacion y el cambio de tema
import { useState } from 'react'
import { Link as EnlaceRuta, useLocation } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'
import MenuIcon from '@mui/icons-material/Menu'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'

import Logo from './logo'
import { NOMBRE_APP, RUTAS } from '../../utiles/constantes'

// Secciones que aparecen en la navegacion
const SECCIONES = [
  { ruta: RUTAS.inicio, texto: 'Encuentra tu plato' },
  { ruta: RUTAS.menu, texto: 'Menu completo' },
  { ruta: RUTAS.comoFunciona, texto: 'Como funciona' },
]

// Barra superior con el logo, los enlaces a las tres secciones y el boton de tema.
// El modo actual y la funcion para alternarlo llegan desde App; en telefono los
// enlaces se mueven a un cajon lateral
export function BarraNavegacion({ modo, al_cambiar_tema }) {
  const [cajon_abierto, establecer_cajon] = useState(false)
  const ubicacion = useLocation()

  return (
    <AppBar
      position="sticky"
      color="transparent"
      sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}
    >
      <Toolbar sx={{ gap: 2, minHeight: { xs: 60, md: 72 } }}>
        <Box
          component={EnlaceRuta}
          to={RUTAS.inicio}
          sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'text.primary' }}
        >
          <Logo tamano={40} />
          <Box>
            <Typography variant="h5" sx={{ lineHeight: 1 }}>
              {NOMBRE_APP}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tu platillo ideal de hoy
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {SECCIONES.map((seccion) => (
            <Button
              key={seccion.ruta}
              component={EnlaceRuta}
              to={seccion.ruta}
              color={ubicacion.pathname === seccion.ruta ? 'primary' : 'inherit'}
              sx={{ fontWeight: ubicacion.pathname === seccion.ruta ? 700 : 500 }}
            >
              {seccion.texto}
            </Button>
          ))}
        </Box>

        <Tooltip title={modo === 'claro' ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro'}>
          <IconButton onClick={al_cambiar_tema} aria-label="Cambiar tema">
            {modo === 'claro' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Tooltip>

        <IconButton
          sx={{ display: { xs: 'inline-flex', md: 'none' } }}
          onClick={() => establecer_cajon(true)}
          aria-label="Abrir navegacion"
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <Drawer anchor="right" open={cajon_abierto} onClose={() => establecer_cajon(false)}>
        <Box sx={{ width: 250, pt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, pb: 1 }}>
            <Logo tamano={30} />
            <Typography variant="h6">{NOMBRE_APP}</Typography>
          </Box>
          <List>
            {SECCIONES.map((seccion) => (
              <ListItemButton
                key={seccion.ruta}
                component={EnlaceRuta}
                to={seccion.ruta}
                selected={ubicacion.pathname === seccion.ruta}
                onClick={() => establecer_cajon(false)}
              >
                <ListItemText primary={seccion.texto} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  )
}

export default BarraNavegacion
