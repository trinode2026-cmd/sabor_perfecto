// Perfiles de un toque para no tener que mover las barras una por una
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'

export function PreajustesRapidos({ preajustes, preferencias, al_elegir }) {
  // Marca el preajuste si las tres preferencias coinciden con el
  const esta_activo = (preajuste) =>
    preferencias.hambre === preajuste.hambre &&
    preferencias.sabor === preajuste.picante &&
    preferencias.presupuesto === preajuste.presupuesto

  return (
    <Box sx={{ mt: 2.5 }}>
      <Typography variant="overline" color="text.secondary">
        Elige rapido
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
        {preajustes.map((preajuste) => (
          <Tooltip key={preajuste.clave} title={preajuste.descripcion}>
            <Chip
              label={preajuste.nombre}
              color={esta_activo(preajuste) ? 'primary' : 'default'}
              variant={esta_activo(preajuste) ? 'filled' : 'outlined'}
              onClick={() =>
                al_elegir({
                  hambre: preajuste.hambre,
                  sabor: preajuste.picante,
                  presupuesto: preajuste.presupuesto,
                })
              }
            />
          </Tooltip>
        ))}
      </Box>
    </Box>
  )
}

export default PreajustesRapidos
