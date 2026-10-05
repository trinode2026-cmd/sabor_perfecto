// Tarjeta grande del platillo que mejor le queda al usuario
import { Link as EnlaceRuta } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import FavoriteIcon from '@mui/icons-material/Favorite'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import VerifiedIcon from '@mui/icons-material/Verified'

import ImagenPlatillo from '../comunes/imagen_platillo'
import AnilloCoincidencia from '../comunes/anillo_coincidencia'
import MedidorAfinidad from '../comunes/medidor_afinidad'
import { formatear_minutos, formatear_precio } from '../../utiles/formato'
import {
  nombres_afinidad,
  texto_coincidencia,
  texto_porcion,
  texto_sabor,
} from '../../utiles/etiquetas_texto'
import { RUTAS } from '../../utiles/constantes'

export function TarjetaRecomendado({ platillo, modo = 'salado' }) {
  if (!platillo) return null

  const nombres = nombres_afinidad(modo)
  const es_dulce = modo === 'dulce'

  return (
    <Card sx={{ overflow: 'hidden' }}>
      <Grid container>
        <Grid size={{ xs: 12, md: 5 }} sx={{ position: 'relative', minHeight: { md: 380 } }}>
          <ImagenPlatillo platillo={platillo} altura={{ xs: 210, sm: 260, md: '100%' }} />
          <Chip
            icon={<VerifiedIcon />}
            label={es_dulce ? "Nuestro antojo dulce" : "Nuestra recomendacion"}
            color="primary"
            sx={{ position: 'absolute', top: 16, left: 16 }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <Box sx={{ flexGrow: 1, minWidth: 220 }}>
                <Typography variant="overline" color="primary">
                  {platillo.categoria}
                </Typography>
                <Typography variant="h3" sx={{ mt: 0.5 }}>
                  {platillo.nombre}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {platillo.descripcion}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <AnilloCoincidencia valor={platillo.coincidencia} />
                <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                  {texto_coincidencia(platillo.coincidencia)}
                </Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
              <Chip label={formatear_precio(platillo.precio)} color="secondary" />
              <Chip
                icon={<AccessTimeIcon />}
                label={`Listo en ${formatear_minutos(platillo.minutos_preparacion)}`}
                variant="outlined"
              />
              {platillo.etiquetas?.slice(0, 3).map((etiqueta) => (
                <Chip key={etiqueta} label={etiqueta} size="small" variant="outlined" />
              ))}
            </Stack>

            <Divider sx={{ my: 2.5 }} />

            <Stack spacing={1.75}>
              <MedidorAfinidad
                titulo={nombres.porcion}
                valor={platillo.afinidades?.porcion}
                detalle={texto_porcion(platillo.saciedad)}
              />
              <MedidorAfinidad
                titulo={nombres.sabor}
                valor={platillo.afinidades?.sabor}
                detalle={texto_sabor(platillo, modo)}
                color={es_dulce ? 'warning' : 'error'}
              />
              <MedidorAfinidad
                titulo={nombres.precio}
                valor={platillo.afinidades?.precio}
                color="secondary"
              />
            </Stack>

            <Box sx={{ mt: 2.5, p: 2, borderRadius: 3, bgcolor: 'action.hover' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <FavoriteIcon fontSize="small" color="primary" />
                <Typography variant="h6">Por que te va a encantar</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {platillo.motivo}
              </Typography>
            </Box>

            <Button
              component={EnlaceRuta}
              to={`${RUTAS.platillo}/${platillo.id}`}
              variant="contained"
              size="large"
              fullWidth
              sx={{ mt: 2.5 }}
            >
              {es_dulce ? 'Ver este antojo' : 'Ver este platillo'}
            </Button>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

export default TarjetaRecomendado
