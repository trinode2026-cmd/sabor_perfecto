// En telefono las barras viven en un cajon inferior que se abre con un boton
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import Fab from '@mui/material/Fab'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TuneIcon from '@mui/icons-material/Tune'
import CheckIcon from '@mui/icons-material/Check'

import PanelPreferencias from './panel_preferencias'

// Boton que abre el cajon: acompana al scroll y se estaciona al final del contenido
export function BotonAjustar({ al_abrir }) {
  return (
    <Box
      sx={{
        display: { xs: 'flex', lg: 'none' },
        justifyContent: 'center',
        // Flota mientras hay contenido abajo y se queda quieto al llegar al final
        position: 'sticky',
        bottom: 'calc(16px + env(safe-area-inset-bottom))',
        zIndex: (tema) => tema.zIndex.drawer - 1,
        pt: 3,
        pb: 1,
        // La franja no debe estorbar los toques sobre lo que hay detras
        pointerEvents: 'none',
      }}
    >
      <Fab
        color="primary"
        variant="extended"
        onClick={al_abrir}
        sx={{ pointerEvents: 'auto' }}
      >
        <TuneIcon sx={{ mr: 1 }} />
        Ajustar mi antojo
      </Fab>
    </Box>
  )
}

export function CajonPreferencias({
  abierto,
  al_abrir,
  al_cerrar,
  preferencias,
  al_cambiar,
  al_cambiar_modo,
  modo,
  preajustes,
  rango_precios,
}) {
  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={abierto}
        onOpen={al_abrir}
        onClose={al_cerrar}
        disableSwipeToOpen={false}
        swipeAreaWidth={24}
        slotProps={{
          paper: {
            sx: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: '88dvh',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        <Box sx={{ pt: 1.5, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <Box sx={{ width: 42, height: 5, borderRadius: 999, bgcolor: 'divider' }} />
        </Box>

        {/* Solo las preferencias se desplazan; el boton se queda abajo */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', overscrollBehavior: 'contain' }}>
          <PanelPreferencias
            preferencias={preferencias}
            al_cambiar={al_cambiar}
            al_cambiar_modo={al_cambiar_modo}
            modo={modo}
            preajustes={preajustes}
            rango_precios={rango_precios}
            compacto
          />
        </Box>

        <Box
          sx={{
            flexShrink: 0,
            px: 2.5,
            pt: 1.5,
            // El espacio extra evita la barra de gestos del telefono
            pb: 'calc(16px + env(safe-area-inset-bottom))',
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={<CheckIcon />}
            onClick={al_cerrar}
          >
            Aceptar y ver resultados
          </Button>
        </Box>
      </SwipeableDrawer>
    </>
  )
}

export default CajonPreferencias
