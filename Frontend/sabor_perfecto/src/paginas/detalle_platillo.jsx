// Pantalla con todo el detalle de un platillo y sus opciones parecidas
import { useCallback } from 'react'
import { Link as EnlaceRuta, useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'

import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import ContenedorPagina from '../componentes/diseno/contenedor_pagina'
import ImagenPlatillo from '../componentes/comunes/imagen_platillo'
import MedidorAfinidad from '../componentes/comunes/medidor_afinidad'
import TarjetaPlatillo from '../componentes/platillos/tarjeta_platillo'
import MensajeError from '../componentes/comunes/mensaje_error'
import usePeticion from '../ganchos/usePeticion'
import { pedir_platillo } from '../servicios/cliente_api'
import { formatear_minutos, formatear_precio } from '../utiles/formato'
import { texto_porcion, texto_sabor } from '../utiles/etiquetas_texto'
import { RUTAS } from '../utiles/constantes'

// Pantalla que toma el id de la direccion, le pide al backend ese platillo con sus
// similares, y muestra su imagen, sus caracteristicas y las opciones parecidas
export function DetallePlatillo() {
  const { id } = useParams()
  const consulta = useCallback(() => pedir_platillo(id), [id])
  const { datos, cargando, error, recargar } = usePeticion(consulta, [consulta], null)

  if (cargando) {
    return (
      <ContenedorPagina>
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 4 }} />
        <Skeleton width="50%" height={44} sx={{ mt: 3 }} />
        <Skeleton width="80%" />
      </ContenedorPagina>
    )
  }

  if (error) {
    return (
      <ContenedorPagina>
        <MensajeError mensaje={error} al_reintentar={recargar} />
        <Button component={EnlaceRuta} to={RUTAS.menu} startIcon={<ArrowBackIcon />} sx={{ mt: 3 }}>
          Volver al menu
        </Button>
      </ContenedorPagina>
    )
  }

  const platillo = datos?.platillo
  const similares = datos?.similares ?? []
  const es_dulce = platillo?.tipo === 'postre' || platillo?.tipo === 'bebida'

  return (
    <ContenedorPagina>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={EnlaceRuta} to={RUTAS.inicio} underline="hover" color="text.secondary">
          Inicio
        </Link>
        <Link component={EnlaceRuta} to={RUTAS.menu} underline="hover" color="text.secondary">
          Menu
        </Link>
        <Typography color="text.primary">{platillo.nombre}</Typography>
      </Breadcrumbs>

      <Grid container spacing={{ xs: 2.5, md: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ overflow: 'hidden' }}>
            <ImagenPlatillo platillo={platillo} altura={340} />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="overline" color="primary">
            {platillo.categoria}
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: '1.9rem', md: '2.25rem' }, mt: 0.5 }}>
            {platillo.nombre}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5, fontSize: '1.05rem' }}>
            {platillo.descripcion}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 2.5, flexWrap: 'wrap', gap: 1 }}>
            <Chip label={formatear_precio(platillo.precio)} color="primary" />
            <Chip
              icon={<AccessTimeIcon />}
              label={`Listo en ${formatear_minutos(platillo.minutos_preparacion)}`}
              variant="outlined"
            />
            {platillo.etiquetas?.map((etiqueta) => (
              <Chip key={etiqueta} label={etiqueta} variant="outlined" size="small" />
            ))}
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h4" sx={{ mb: 2 }}>
            {es_dulce ? 'Como es este antojo' : 'Como es este platillo'}
          </Typography>
          <Stack spacing={2}>
            <MedidorAfinidad
              titulo={es_dulce ? 'Que tan pesado es' : 'Que tan llenador'}
              valor={platillo.saciedad}
              detalle={texto_porcion(platillo.saciedad)}
            />
            <MedidorAfinidad
              titulo={es_dulce ? 'Que tan dulce es' : 'Que tanto pica'}
              valor={es_dulce ? platillo.dulzor : platillo.picor}
              detalle={texto_sabor(platillo)}
              color={es_dulce ? 'warning' : 'error'}
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3.5 }}>
            <Button variant="contained" size="large" fullWidth>
              {es_dulce ? 'Pedir este antojo' : 'Pedir este platillo'}
            </Button>
            <Button
              component={EnlaceRuta}
              to={RUTAS.inicio}
              variant="outlined"
              color="secondary"
              size="large"
              fullWidth
            >
              Buscar otra opcion
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {similares.length > 0 && (
        <Box sx={{ mt: 7 }}>
          <Typography variant="h3" sx={{ fontSize: { xs: '1.4rem', md: '1.6rem' } }}>
            Si te gusto este, prueba estos
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2.5, mt: 0.5 }}>
            Opciones con porcion, sabor y precio parecidos.
          </Typography>
          <Grid container spacing={3}>
            {similares.map((similar) => (
              <Grid key={similar.id} size={{ xs: 12, sm: 6, lg: 3 }}>
                <TarjetaPlatillo platillo={similar} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </ContenedorPagina>
  )
}

export default DetallePlatillo
