// Esqueletos que ocupan el lugar de las tarjetas mientras llega la informacion
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'

export function CargandoPlatillos({ cantidad = 6, columnas = { xs: 12, sm: 6, lg: 4 } }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: cantidad }).map((_, indice) => (
        <Grid key={indice} size={columnas}>
          <Card>
            <Skeleton variant="rectangular" height={180} />
            <CardContent>
              <Skeleton width="70%" height={28} />
              <Skeleton width="45%" />
              <Skeleton width="90%" sx={{ mt: 1.5 }} />
              <Skeleton width="60%" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default CargandoPlatillos
