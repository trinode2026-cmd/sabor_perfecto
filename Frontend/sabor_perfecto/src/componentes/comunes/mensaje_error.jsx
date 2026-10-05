// Aviso amable cuando algo falla, con la opcion de volver a intentar
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'

export function MensajeError({ mensaje, al_reintentar }) {
  if (!mensaje) return null
  return (
    <Alert
      severity="warning"
      sx={{ borderRadius: 3 }}
      action={
        al_reintentar ? (
          <Button color="inherit" size="small" onClick={al_reintentar}>
            Reintentar
          </Button>
        ) : null
      }
    >
      <AlertTitle>Algo no salio bien</AlertTitle>
      {mensaje}
    </Alert>
  )
}

export default MensajeError
