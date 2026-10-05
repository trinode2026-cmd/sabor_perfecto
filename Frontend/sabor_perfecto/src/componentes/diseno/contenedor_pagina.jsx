// Envoltura que da el mismo ancho y margen a todas las pantallas
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export function ContenedorPagina({ titulo, descripcion, children, ancho = 'lg' }) {
  return (
    <Container maxWidth={ancho} sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, sm: 3 } }}>
      {titulo && (
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Typography variant="h2" sx={{ fontSize: { xs: '1.75rem', md: '2rem' } }}>
            {titulo}
          </Typography>
          {descripcion && (
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 680 }}>
              {descripcion}
            </Typography>
          )}
        </Box>
      )}
      {children}
    </Container>
  )
}

export default ContenedorPagina
