// Pantalla principal: ajusta tus preferencias y mira lo que te toca hoy
import { useCallback, useMemo, useState } from 'react'
import { Link as EnlaceRuta } from 'react-router-dom'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import Fade from '@mui/material/Fade'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import ContenedorPagina from '../componentes/diseno/contenedor_pagina'
import PanelPreferencias from '../componentes/preferencias/panel_preferencias'
import CajonPreferencias, { BotonAjustar } from '../componentes/preferencias/cajon_preferencias'
import TarjetaRecomendado from '../componentes/platillos/tarjeta_recomendado'
import FilaOpcion from '../componentes/platillos/fila_opcion'
import MensajeError from '../componentes/comunes/mensaje_error'
import useRecomendaciones from '../ganchos/useRecomendaciones'
import usePeticion from '../ganchos/usePeticion'
import { pedir_preajustes, pedir_rango_precios } from '../servicios/cliente_api'
import { MODOS, PREFERENCIAS_INICIALES, RUTAS } from '../utiles/constantes'
import { punto_medio_precio } from '../utiles/validaciones'

// Pantalla principal: guarda las preferencias y el modo de busqueda del usuario, los
// manda al backend y muestra el platillo recomendado junto con las demas opciones.
// En escritorio el panel de barras va al lado y en telefono dentro de un cajon
export function Inicio() {
  const tema = useTheme()
  const es_escritorio = useMediaQuery(tema.breakpoints.up('lg'))
  const [modo, establecer_modo] = useState(MODOS.salado)
  const [preferencias, establecer_preferencias] = useState(PREFERENCIAS_INICIALES)
  // Que tan arriba quedo la barra de precio, para conservarla al cambiar de carta
  const [proporcion_precio, establecer_proporcion] = useState(null)
  const [cajon_abierto, establecer_cajon] = useState(false)

  const consultar_rango = useCallback(() => pedir_rango_precios(modo), [modo])
  const { datos: rango_precios } = usePeticion(consultar_rango, [consultar_rango], null)
  const { datos: preajustes } = usePeticion(pedir_preajustes, [], [])

  // Cada carta tiene sus propios perfiles rapidos
  const preajustes_del_modo = useMemo(
    () => preajustes.filter((preajuste) => preajuste.modo === modo),
    [preajustes, modo],
  )

  // El presupuesto se calcula sobre los precios de la carta que se este viendo
  const preferencias_usadas = useMemo(() => {
    if (preferencias.presupuesto !== null) return preferencias
    if (!rango_precios) return preferencias
    const { minimo, maximo } = rango_precios
    const presupuesto =
      proporcion_precio === null
        ? punto_medio_precio(minimo, maximo)
        : Math.round((minimo + proporcion_precio * (maximo - minimo)) / 5) * 5
    return { ...preferencias, presupuesto }
  }, [preferencias, rango_precios, proporcion_precio])

  const { resultado, cargando, error, reintentar } = useRecomendaciones(preferencias_usadas, modo, 8)

  // Al mover el precio se recuerda su posicion relativa, no el numero suelto
  const cambiar_preferencias = useCallback(
    (nuevas) => {
      establecer_preferencias(nuevas)
      if (nuevas.presupuesto != null && rango_precios) {
        const ancho = rango_precios.maximo - rango_precios.minimo
        establecer_proporcion(ancho > 0 ? (nuevas.presupuesto - rango_precios.minimo) / ancho : null)
      }
    },
    [rango_precios],
  )

  // Al cambiar de carta se conservan el hambre y el sabor; solo el precio se traslada
  const cambiar_modo = useCallback((nuevo) => {
    establecer_modo(nuevo)
    establecer_preferencias((actual) => ({ ...actual, presupuesto: null }))
  }, [])

  const opciones = useMemo(() => resultado?.opciones ?? [], [resultado])
  const recomendado = resultado?.recomendado
  const es_dulce = modo === MODOS.dulce

  const panel = (
    <PanelPreferencias
      preferencias={preferencias_usadas}
      al_cambiar={cambiar_preferencias}
      al_cambiar_modo={cambiar_modo}
      modo={modo}
      preajustes={preajustes_del_modo}
      rango_precios={rango_precios}
    />
  )

  return (
    <>
      <ContenedorPagina>
        <Box sx={{ mb: { xs: 3, md: 4 }, maxWidth: 760 }}>
          <Typography variant="overline" color="primary">
            Recomendaciones al instante
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '2.75rem' }, mt: 0.5 }}>
            {es_dulce ? 'Encuentra tu postre o bebida ideal' : 'Encuentra tu platillo ideal de hoy'}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5, fontSize: { xs: '1rem', md: '1.1rem' } }}>
            {es_dulce
              ? 'Dinos que tan pesado lo quieres, que tan dulce te gusta y cuanto quieres gastar. Revisamos toda la carta dulce por ti.'
              : 'Dinos cuanta hambre traes, que tan picoso te gusta y cuanto quieres gastar. Nosotros revisamos todo el menu y te decimos que pedir.'}
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2.5, md: 3.5 }}>
          {es_escritorio && <Grid size={{ lg: 4 }}>{panel}</Grid>}

          <Grid size={{ xs: 12, lg: 8 }}>
            <Stack spacing={3}>
              {error && <MensajeError mensaje={error} al_reintentar={reintentar} />}

              {cargando && !recomendado ? (
                <Card>
                  <Skeleton variant="rectangular" height={260} />
                  <CardContent>
                    <Skeleton width="60%" height={36} />
                    <Skeleton width="90%" />
                    <Skeleton width="40%" sx={{ mt: 2 }} />
                  </CardContent>
                </Card>
              ) : (
                <Fade in key={recomendado?.id} timeout={400}>
                  <Box sx={{ opacity: cargando ? 0.65 : 1, transition: 'opacity 200ms ease' }}>
                    <TarjetaRecomendado platillo={recomendado} modo={modo} />
                  </Box>
                </Fade>
              )}

              {opciones.length > 0 && (
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      gap: 2,
                      mb: 1.5,
                    }}
                  >
                    <Box>
                      <Typography variant="h3" sx={{ fontSize: { xs: '1.35rem', md: '1.5rem' } }}>
                        Otras opciones que te quedan
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ordenadas de la que mas coincide a la que menos.
                      </Typography>
                    </Box>
                    <Button
                      component={EnlaceRuta}
                      to={RUTAS.menu}
                      endIcon={<ArrowForwardIcon />}
                      sx={{ display: { xs: 'none', sm: 'inline-flex' }, flexShrink: 0 }}
                    >
                      Ver el menu
                    </Button>
                  </Box>

                  <Stack spacing={1.5} sx={{ opacity: cargando ? 0.65 : 1, transition: 'opacity 200ms ease' }}>
                    {opciones.map((producto, indice) => (
                      <FilaOpcion
                        key={producto.id}
                        platillo={producto}
                        posicion={indice + 2}
                        modo={modo}
                      />
                    ))}
                  </Stack>

                  <Button
                    component={EnlaceRuta}
                    to={RUTAS.menu}
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ mt: 2 }}
                  >
                    Ver el menu completo
                  </Button>
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>

        {!es_escritorio && <BotonAjustar al_abrir={() => establecer_cajon(true)} />}
      </ContenedorPagina>

      {!es_escritorio && (
        <CajonPreferencias
          abierto={cajon_abierto}
          al_abrir={() => establecer_cajon(true)}
          al_cerrar={() => establecer_cajon(false)}
          preferencias={preferencias_usadas}
          al_cambiar={cambiar_preferencias}
          al_cambiar_modo={cambiar_modo}
          modo={modo}
          preajustes={preajustes_del_modo}
          rango_precios={rango_precios}
        />
      )}
    </>
  )
}

export default Inicio
