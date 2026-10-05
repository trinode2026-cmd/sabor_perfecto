// Pantalla para las direcciones que no existen
import { Link as EnlaceRuta } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import ContenedorPagina from '../componentes/diseno/contenedor_pagina'
import Logo from '../componentes/diseno/logo'
import { RUTAS } from '../utiles/constantes'

export function NoEncontrada() {
  return (
    <ContenedorPagina>
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Logo tamano={72} />
        </Box>
        <Typography variant="h1" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, mt: 2 }}>
          Esta pagina no existe
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 440, mx: 'auto' }}>
          Puede que el platillo ya no este disponible o que la direccion este mal escrita.
        </Typography>
        <Button component={EnlaceRuta} to={RUTAS.inicio} variant="contained" size="large" sx={{ mt: 4 }}>
          Volver al inicio
        </Button>
      </Box>
    </ContenedorPagina>
  )
}

export default NoEncontrada
