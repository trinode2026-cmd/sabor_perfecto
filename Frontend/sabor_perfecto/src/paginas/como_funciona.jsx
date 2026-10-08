// Pantalla que explica en tres pasos sencillos como se elige el platillo
import { Link as EnlaceRuta } from 'react-router-dom'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import TuneIcon from '@mui/icons-material/Tune'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import CelebrationIcon from '@mui/icons-material/Celebration'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import ContenedorPagina from '../componentes/diseno/contenedor_pagina'
import TarjetaPlatillo from '../componentes/platillos/tarjeta_platillo'
import CargandoPlatillos from '../componentes/comunes/cargando_platillos'
import usePeticion from '../ganchos/usePeticion'
import { pedir_platillos, pedir_populares } from '../servicios/cliente_api'
import { RUTAS } from '../utiles/constantes'

// Los tres pasos tal como los ve el usuario
const PASOS = [
  {
    icono: <TuneIcon />,
    titulo: 'Dinos tu antojo',
    texto:
      'Mueve las tres barras: cuanta hambre traes, que tan picoso te gusta y cuanto quieres gastar hoy.',
    nota: 'Toma menos de un minuto',
  },
  {
    icono: <MenuBookIcon />,
    titulo: 'Revisamos el menu',
    texto:
      'Comparamos tu antojo con la porcion, el sabor y el precio de todo lo que preparamos, sea comida, postre o bebida.',
    // La cifra se completa con el total real del menu
    nota: null,
  },
  {
    icono: <CelebrationIcon />,
    titulo: 'Pide y disfruta',
    texto:
      'Te mostramos el platillo que mas te queda y otras opciones parecidas para que elijas con calma.',
    nota: 'Buen provecho',
  },
]

// Pantalla que explica el proceso en tres pasos y muestra los platillos mas recomendados
// que devuelve el backend; el total real del menu se usa para completar el segundo paso
export function ComoFunciona() {
  const { datos: populares, cargando } = usePeticion(() => pedir_populares(4), [], [])
  const { datos: menu } = usePeticion(() => pedir_platillos({ por_pagina: 1 }), [], null)

  // El segundo paso dice cuantos productos hay de verdad, no un numero escrito a mano
  const nota_del_menu = menu ? `Revisamos los ${menu.total} productos` : 'Revisamos toda la carta'

  return (
    <ContenedorPagina
      titulo="Como personalizamos tu plato"
      descripcion="No tienes que leer todo el menu: con tres respuestas rapidas te decimos que pedir hoy."
    >
      <Grid container spacing={3}>
        {PASOS.map((paso, indice) => (
          <Grid key={paso.titulo} size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: 3,
                      display: 'grid',
                      placeItems: 'center',
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                    }}
                  >
                    {paso.icono}
                  </Box>
                  <Typography variant="h2" color="text.disabled" sx={{ fontSize: '2rem' }}>
                    {indice + 1}
                  </Typography>
                </Box>
                <Typography variant="h4">{paso.titulo}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {paso.texto}
                </Typography>
                <Chip
                  label={paso.nota ?? nota_del_menu}
                  size="small"
                  color="secondary"
                  variant="outlined"
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mt: 4, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between' }}
          >
            <Box>
              <Typography variant="h3" sx={{ fontSize: { xs: '1.4rem', md: '1.6rem' } }}>
                Listo para pedir algo rico
              </Typography>
              <Typography sx={{ opacity: 0.9, mt: 0.5 }}>
                Ajusta tus preferencias y mira que te recomendamos ahora mismo.
              </Typography>
            </Box>
            <Button
              component={EnlaceRuta}
              to={RUTAS.inicio}
              variant="contained"
              color="inherit"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{ color: 'primary.main', bgcolor: 'common.white', flexShrink: 0 }}
            >
              Encontrar mi platillo
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ mt: 7 }}>
        <Typography variant="h3" sx={{ fontSize: { xs: '1.4rem', md: '1.6rem' } }}>
          Los favoritos de nuestros clientes
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2.5, mt: 0.5 }}>
          Los platillos que mas hemos recomendado.
        </Typography>
        {cargando ? (
          <CargandoPlatillos cantidad={4} columnas={{ xs: 12, sm: 6, lg: 3 }} />
        ) : (
          <Grid container spacing={3}>
            {populares.map((platillo) => (
              <Grid key={platillo.id} size={{ xs: 12, sm: 6, lg: 3 }}>
                <TarjetaPlatillo platillo={platillo} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </ContenedorPagina>
  )
}

export default ComoFunciona
