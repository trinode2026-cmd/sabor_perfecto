// Panel con las barras que el usuario ajusta para pedir su recomendacion
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import CakeIcon from '@mui/icons-material/Cake'
import PaymentsIcon from '@mui/icons-material/Payments'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates'

import BarraPreferencia from './barra_preferencia'
import PreajustesRapidos from './preajustes_rapidos'
import { LIMITES, MARCAS_NIVEL, MODOS } from '../../utiles/constantes'
import { formatear_precio } from '../../utiles/formato'
import { punto_medio_precio } from '../../utiles/validaciones'
import {
  texto_dulce,
  texto_hambre,
  texto_picante,
  texto_presupuesto,
} from '../../utiles/etiquetas_texto'

// Arma las marcas del presupuesto con los precios reales de lo que se muestra
function marcas_de_precio(minimo, maximo) {
  return [
    { value: minimo, label: formatear_precio(minimo) },
    { value: punto_medio_precio(minimo, maximo), label: 'Normal' },
    { value: maximo, label: formatear_precio(maximo) },
  ]
}

export function PanelPreferencias({
  preferencias,
  al_cambiar,
  al_cambiar_modo,
  modo = MODOS.salado,
  preajustes = [],
  rango_precios,
  compacto = false,
}) {
  const es_dulce = modo === MODOS.dulce

  // Cambia una sola preferencia y deja las demas igual
  const cambiar = (nombre) => (valor) => al_cambiar({ ...preferencias, [nombre]: valor })

  // El presupuesto nunca baja del producto mas barato ni sube del mas caro
  const precio_minimo = rango_precios?.minimo ?? LIMITES.presupuesto.minimo
  const precio_maximo = rango_precios?.maximo ?? LIMITES.presupuesto.maximo
  const presupuesto = preferencias.presupuesto ?? punto_medio_precio(precio_minimo, precio_maximo)

  // Vuelve a dejar las tres barras en su nivel normal
  const reiniciar = () =>
    al_cambiar({ hambre: 50, sabor: 50, presupuesto: punto_medio_precio(precio_minimo, precio_maximo) })

  const contenido = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
        <Box>
          <Typography variant="h4">
            {es_dulce ? 'Que se te antoja de dulce' : 'Que se te antoja hoy'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Mueve las barras y te decimos cual te queda mejor.
          </Typography>
        </Box>
        <Button size="small" color="inherit" startIcon={<RestartAltIcon />} onClick={reiniciar}>
          Reiniciar
        </Button>
      </Box>

      {preajustes.length > 0 && (
        <PreajustesRapidos
          preajustes={preajustes}
          preferencias={preferencias}
          al_elegir={al_cambiar}
        />
      )}

      <Divider sx={{ my: 2.5 }} />

      <BarraPreferencia
        titulo="Que tanta hambre traes"
        ayuda={es_dulce ? 'Para elegir algo ligero o algo pesado' : 'Para elegir el tamano de la porcion'}
        icono={<RestaurantIcon fontSize="small" />}
        valor={preferencias.hambre}
        minimo={LIMITES.hambre.minimo}
        maximo={LIMITES.hambre.maximo}
        paso={LIMITES.hambre.paso}
        color="primary"
        marcas={MARCAS_NIVEL}
        valor_visible={preferencias.hambre}
        texto_nivel={texto_hambre(preferencias.hambre)}
        al_cambiar={cambiar('hambre')}
      />

      <Box
        sx={{
          p: 1.5,
          mb: 2,
          borderRadius: 3,
          bgcolor: es_dulce ? 'warning.main' : 'action.hover',
          color: es_dulce ? 'common.white' : 'inherit',
          transition: 'background-color 240ms ease',
        }}
      >
        <FormControlLabel
          sx={{ m: 0, width: '100%', justifyContent: 'space-between' }}
          labelPlacement="start"
          control={
            <Switch
              checked={es_dulce}
              color={es_dulce ? 'default' : 'warning'}
              onChange={(evento) =>
                al_cambiar_modo(evento.target.checked ? MODOS.dulce : MODOS.salado)
              }
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CakeIcon fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Cambiar por algo dulce (postres o bebidas)
              </Typography>
            </Box>
          }
        />
      </Box>

      {es_dulce ? (
        <BarraPreferencia
          titulo="Que tan dulce te gusta"
          ayuda="Para elegir entre algo neutro y algo bien dulce"
          icono={<CakeIcon fontSize="small" />}
          valor={preferencias.sabor}
          minimo={LIMITES.sabor.minimo}
          maximo={LIMITES.sabor.maximo}
          paso={LIMITES.sabor.paso}
          color="warning"
          marcas={MARCAS_NIVEL}
          valor_visible={preferencias.sabor}
          texto_nivel={texto_dulce(preferencias.sabor)}
          al_cambiar={cambiar('sabor')}
        />
      ) : (
        <BarraPreferencia
          titulo="Que tan picoso te gusta"
          ayuda="Para ajustar el nivel de chile"
          icono={<LocalFireDepartmentIcon fontSize="small" />}
          valor={preferencias.sabor}
          minimo={LIMITES.sabor.minimo}
          maximo={LIMITES.sabor.maximo}
          paso={LIMITES.sabor.paso}
          color="error"
          marcas={MARCAS_NIVEL}
          valor_visible={preferencias.sabor}
          texto_nivel={texto_picante(preferencias.sabor)}
          al_cambiar={cambiar('sabor')}
        />
      )}

      <BarraPreferencia
        titulo="Cuanto quieres gastar"
        ayuda={`Desde ${formatear_precio(precio_minimo)}, lo mas barato de esta carta`}
        icono={<PaymentsIcon fontSize="small" />}
        valor={presupuesto}
        minimo={precio_minimo}
        maximo={precio_maximo}
        paso={LIMITES.presupuesto.paso}
        color="secondary"
        marcas={marcas_de_precio(precio_minimo, precio_maximo)}
        valor_visible={formatear_precio(presupuesto)}
        texto_nivel={texto_presupuesto(presupuesto)}
        al_cambiar={cambiar('presupuesto')}
      />

      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          p: 2,
          borderRadius: 3,
          bgcolor: 'action.hover',
          alignItems: 'flex-start',
        }}
      >
        <TipsAndUpdatesIcon color="warning" fontSize="small" />
        <Typography variant="body2" color="text.secondary">
          {es_dulce
            ? 'Estas viendo solo postres y bebidas. Apaga el interruptor para volver a la comida.'
            : 'Puedes mover las barras cuando quieras: las sugerencias se actualizan solas.'}
        </Typography>
      </Box>
    </>
  )

  if (compacto) return <Box sx={{ p: 2.5 }}>{contenido}</Box>

  return (
    <Card
      sx={{
        // En escritorio el panel se queda fijo y hace su propio desplazamiento
        position: { lg: 'sticky' },
        top: { lg: 88 },
        maxHeight: { lg: 'calc(100dvh - 104px)' },
        overflowY: { lg: 'auto' },
        // Evita que al terminar el panel se arrastre el resto de la pagina
        overscrollBehavior: 'contain',
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': { width: 8 },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'divider',
          borderRadius: 999,
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>{contenido}</CardContent>
    </Card>
  )
}

export default PanelPreferencias
