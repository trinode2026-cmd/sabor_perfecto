// Pantalla del menu completo con buscador, filtros y paginacion
import { useCallback, useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import Pagination from '@mui/material/Pagination'
import Slider from '@mui/material/Slider'
import SearchIcon from '@mui/icons-material/Search'

import ContenedorPagina from '../componentes/diseno/contenedor_pagina'
import TarjetaPlatillo from '../componentes/platillos/tarjeta_platillo'
import CargandoPlatillos from '../componentes/comunes/cargando_platillos'
import EstadoVacio from '../componentes/comunes/estado_vacio'
import MensajeError from '../componentes/comunes/mensaje_error'
import usePeticion from '../ganchos/usePeticion'
import {
  pedir_categorias,
  pedir_etiquetas,
  pedir_platillos,
  pedir_rango_precios,
} from '../servicios/cliente_api'
import {
  ESPERA_CONSULTA,
  LIMITES,
  ORDENES_MENU,
  PLATILLOS_POR_PAGINA,
  TIPOS_PRODUCTO,
} from '../utiles/constantes'
import { formatear_precio } from '../utiles/formato'
import { limpiar_busqueda, limpiar_filtros } from '../utiles/validaciones'

// Filtros con los que arranca la pantalla
const FILTROS_INICIALES = {
  buscar: '',
  categoria_id: '',
  etiqueta: '',
  tipo: '',
  precio_maximo: LIMITES.presupuesto.maximo,
  orden: 'nombre',
}

export function Menu() {
  const [filtros, establecer_filtros] = useState(FILTROS_INICIALES)
  const [filtros_aplicados, establecer_aplicados] = useState(FILTROS_INICIALES)
  const [pagina, establecer_pagina] = useState(1)

  const { datos: categorias } = usePeticion(pedir_categorias, [], [])
  const { datos: etiquetas } = usePeticion(pedir_etiquetas, [], [])
  const { datos: rango_precios } = usePeticion(pedir_rango_precios, [], null)

  // El tope del filtro de precio es el platillo mas caro del menu
  const precio_minimo = rango_precios?.minimo ?? LIMITES.presupuesto.minimo
  const precio_tope = rango_precios?.maximo ?? LIMITES.presupuesto.maximo

  // Espera un momento despues de escribir antes de consultar al backend
  useEffect(() => {
    const temporizador = setTimeout(() => {
      establecer_aplicados(filtros)
      establecer_pagina(1)
    }, ESPERA_CONSULTA)
    return () => clearTimeout(temporizador)
  }, [filtros])

  const consulta = useCallback(
    () =>
      pedir_platillos(
        limpiar_filtros({
          ...filtros_aplicados,
          buscar: limpiar_busqueda(filtros_aplicados.buscar),
          precio_maximo:
            filtros_aplicados.precio_maximo >= precio_tope ? '' : filtros_aplicados.precio_maximo,
          pagina,
          por_pagina: PLATILLOS_POR_PAGINA,
        }),
      ),
    [filtros_aplicados, pagina, precio_tope],
  )

  const { datos, cargando, error, recargar } = usePeticion(consulta, [consulta], null)

  const cambiar = (campo) => (valor) => establecer_filtros((actual) => ({ ...actual, [campo]: valor }))
  const hay_filtros = useMemo(
    () => JSON.stringify(filtros) !== JSON.stringify(FILTROS_INICIALES),
    [filtros],
  )

  return (
    <ContenedorPagina
      titulo="Nuestro menu completo"
      descripcion="Comida, postres y bebidas. Busca por nombre, filtra por categoria o ajusta el precio para ver todo lo que preparamos hoy."
    >
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Buscar en el menu"
                value={filtros.buscar}
                onChange={(evento) => cambiar('buscar')(evento.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 6, md: 2 }}>
              <TextField
                select
                fullWidth
                label="Que buscas"
                value={filtros.tipo}
                onChange={(evento) => cambiar('tipo')(evento.target.value)}
              >
                {TIPOS_PRODUCTO.map((opcion) => (
                  <MenuItem key={opcion.valor || 'todo'} value={opcion.valor}>
                    {opcion.texto}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 6, md: 2 }}>
              <TextField
                select
                fullWidth
                label="Categoria"
                value={filtros.categoria_id}
                onChange={(evento) => cambiar('categoria_id')(evento.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                {categorias.map((categoria) => (
                  <MenuItem key={categoria.id} value={categoria.id}>
                    {categoria.nombre} ({categoria.total_platillos})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <TextField
                select
                fullWidth
                label="Ordenar por"
                value={filtros.orden}
                onChange={(evento) => cambiar('orden')(evento.target.value)}
              >
                {ORDENES_MENU.map((opcion) => (
                  <MenuItem key={opcion.valor} value={opcion.valor}>
                    {opcion.texto}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Precio hasta {formatear_precio(Math.min(filtros.precio_maximo, precio_tope))}
              </Typography>
              <Slider
                value={Math.min(filtros.precio_maximo, precio_tope)}
                min={precio_minimo}
                max={precio_tope}
                step={10}
                color="secondary"
                onChange={(_evento, valor) => cambiar('precio_maximo')(valor)}
                aria-label="Precio maximo"
              />
            </Grid>
          </Grid>

          <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', gap: 1 }}>
            <Chip
              label="Todas las etiquetas"
              size="small"
              color={filtros.etiqueta === '' ? 'primary' : 'default'}
              variant={filtros.etiqueta === '' ? 'filled' : 'outlined'}
              onClick={() => cambiar('etiqueta')('')}
            />
            {etiquetas.map((etiqueta) => (
              <Chip
                key={etiqueta.id}
                label={etiqueta.nombre}
                size="small"
                color={filtros.etiqueta === etiqueta.nombre ? 'primary' : 'default'}
                variant={filtros.etiqueta === etiqueta.nombre ? 'filled' : 'outlined'}
                onClick={() =>
                  cambiar('etiqueta')(filtros.etiqueta === etiqueta.nombre ? '' : etiqueta.nombre)
                }
              />
            ))}
          </Stack>
        </CardContent>
      </Card>

      {error && <MensajeError mensaje={error} al_reintentar={recargar} />}

      {cargando && <CargandoPlatillos cantidad={6} />}

      {!cargando && datos && datos.platillos.length === 0 && (
        <EstadoVacio
          descripcion="Prueba con otro nombre, sube el precio maximo o quita los filtros."
          al_limpiar={hay_filtros ? () => establecer_filtros(FILTROS_INICIALES) : undefined}
        />
      )}

      {!cargando && datos && datos.platillos.length > 0 && (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {datos.total} opciones disponibles
          </Typography>

          <Grid container spacing={3}>
            {datos.platillos.map((platillo) => (
              <Grid key={platillo.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <TarjetaPlatillo platillo={platillo} />
              </Grid>
            ))}
          </Grid>

          {datos.paginas > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={datos.paginas}
                page={pagina}
                onChange={(_evento, nueva) => establecer_pagina(nueva)}
                color="primary"
                siblingCount={0}
              />
            </Box>
          )}
        </>
      )}
    </ContenedorPagina>
  )
}

export default Menu
