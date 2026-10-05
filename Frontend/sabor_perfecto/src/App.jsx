// Estructura general de la aplicacion: tema, barra, rutas y pie de pagina
import { Suspense, lazy, useMemo } from 'react'
import { Route, Routes } from 'react-router-dom'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import LinearProgress from '@mui/material/LinearProgress'
import { ThemeProvider } from '@mui/material/styles'

import BarraNavegacion from './componentes/diseno/barra_navegacion'
import PiePagina from './componentes/diseno/pie_pagina'
import RegresarArriba from './componentes/diseno/regresar_arriba'
import useModoTema from './ganchos/useModoTema'
import { crear_tema } from './tema/tema'
import { RUTAS } from './utiles/constantes'

// Cada pantalla se descarga solo cuando el usuario entra a ella
const Inicio = lazy(() => import('./paginas/inicio'))
const Menu = lazy(() => import('./paginas/menu'))
const DetallePlatillo = lazy(() => import('./paginas/detalle_platillo'))
const ComoFunciona = lazy(() => import('./paginas/como_funciona'))
const NoEncontrada = lazy(() => import('./paginas/no_encontrada'))

function App() {
  const { modo, alternar_modo } = useModoTema()
  const tema = useMemo(() => crear_tema(modo), [modo])

  return (
    <ThemeProvider theme={tema}>
      <CssBaseline />
      <RegresarArriba />
      <Box
        sx={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
        }}
      >
        <BarraNavegacion modo={modo} al_cambiar_tema={alternar_modo} />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Suspense
            fallback={
              <Box sx={{ minHeight: '100vh' }}>
                <LinearProgress />
              </Box>
            }
          >
            <Routes>
              <Route path={RUTAS.inicio} element={<Inicio />} />
              <Route path={RUTAS.menu} element={<Menu />} />
              <Route path={`${RUTAS.platillo}/:id`} element={<DetallePlatillo />} />
              <Route path={RUTAS.comoFunciona} element={<ComoFunciona />} />
              <Route path="*" element={<NoEncontrada />} />
            </Routes>
          </Suspense>
        </Box>
        <PiePagina />
      </Box>
    </ThemeProvider>
  )
}

export default App
