// Tema de Material UI con la paleta y las tipografias del diseno de SaborPerfecto
import { createTheme } from '@mui/material/styles'

// Colores base tomados del documento de diseno
const COLORES = {
  claro: {
    primario: '#a53604',
    primarioClaro: '#c74e1e',
    secundario: '#41674c',
    terciario: '#7b5500',
    fondo: '#fbf9f6',
    superficie: '#ffffff',
    superficieSuave: '#f3eeea',
    texto: '#1f1b19',
    textoSuave: '#58423a',
    borde: '#e6dcd6',
  },
  oscuro: {
    primario: '#ffb59c',
    primarioClaro: '#ffd0bd',
    secundario: '#a7d1b0',
    terciario: '#fabc4d',
    fondo: '#17120f',
    superficie: '#231c19',
    superficieSuave: '#2d2521',
    texto: '#f3eae6',
    textoSuave: '#d5c2b9',
    borde: '#3a2f2a',
  },
}

// Sombras suaves y calidas en lugar de bordes duros
const SOMBRA_TARJETA = '0 4px 20px -2px rgba(33, 37, 41, 0.07), 0 2px 6px -1px rgba(33, 37, 41, 0.04)'
const SOMBRA_ELEVADA = '0 12px 28px -4px rgba(165, 54, 4, 0.18), 0 4px 10px -2px rgba(33, 37, 41, 0.06)'

// Crea el tema completo para el modo claro u oscuro
export function crear_tema(modo = 'claro') {
  const color = COLORES[modo] ?? COLORES.claro
  const esOscuro = modo === 'oscuro'

  return createTheme({
    palette: {
      mode: esOscuro ? 'dark' : 'light',
      primary: { main: color.primario, light: color.primarioClaro, contrastText: esOscuro ? '#45150a' : '#ffffff' },
      secondary: { main: color.secundario, contrastText: esOscuro ? '#0b2316' : '#ffffff' },
      warning: { main: color.terciario },
      error: { main: esOscuro ? '#ffb4ab' : '#ba1a1a' },
      success: { main: color.secundario },
      info: { main: esOscuro ? '#9fc6ff' : '#3a5a8c' },
      background: { default: color.fondo, paper: color.superficie },
      text: { primary: color.texto, secondary: color.textoSuave },
      divider: color.borde,
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: '"DM Sans", system-ui, -apple-system, sans-serif',
      h1: { fontFamily: '"Epilogue", sans-serif', fontWeight: 700, fontSize: '2.75rem', lineHeight: 1.15, letterSpacing: '-0.02em' },
      h2: { fontFamily: '"Epilogue", sans-serif', fontWeight: 700, fontSize: '2rem', lineHeight: 1.2, letterSpacing: '-0.01em' },
      h3: { fontFamily: '"Epilogue", sans-serif', fontWeight: 600, fontSize: '1.5rem', lineHeight: 1.25 },
      h4: { fontFamily: '"Epilogue", sans-serif', fontWeight: 600, fontSize: '1.25rem', lineHeight: 1.3 },
      h5: { fontFamily: '"Epilogue", sans-serif', fontWeight: 600, fontSize: '1.1rem' },
      h6: { fontFamily: '"Epilogue", sans-serif', fontWeight: 600, fontSize: '1rem' },
      subtitle1: { fontSize: '1.05rem', lineHeight: 1.6 },
      body1: { fontSize: '1rem', lineHeight: 1.6 },
      body2: { fontSize: '0.9rem', lineHeight: 1.5 },
      button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em' },
      overline: { fontWeight: 600, letterSpacing: '0.08em' },
    },
    components: {
      // Botones redondeados con un leve levantamiento al pasar el cursor
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 10, paddingInline: 18, paddingBlock: 9 },
          containedPrimary: {
            boxShadow: 'none',
            '&:hover': { boxShadow: SOMBRA_ELEVADA, transform: 'translateY(-1px)' },
            transition: 'transform 160ms ease, box-shadow 160ms ease',
          },
        },
      },
      // Tarjetas sin borde duro y con sombra calida
      MuiPaper: {
        styleOverrides: {
          rounded: { borderRadius: 16 },
          elevation1: { boxShadow: SOMBRA_TARJETA },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 1 },
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: SOMBRA_TARJETA,
            transition: 'transform 180ms ease, box-shadow 180ms ease',
          },
        },
      },
      // Barras de preferencia con un pulgar grande y facil de arrastrar
      MuiSlider: {
        styleOverrides: {
          root: { height: 8 },
          thumb: {
            width: 24,
            height: 24,
            '&:hover, &.Mui-focusVisible': { boxShadow: '0 0 0 10px rgba(165, 54, 4, 0.14)' },
          },
          track: { border: 'none' },
          rail: { opacity: 0.25 },
          valueLabel: { borderRadius: 8, fontWeight: 600 },
          markLabel: { fontSize: '0.75rem' },
        },
      },
      MuiChip: { styleOverrides: { root: { fontWeight: 600, borderRadius: 999 } } },
      MuiLinearProgress: { styleOverrides: { root: { height: 8, borderRadius: 999 } } },
      MuiAppBar: { styleOverrides: { root: { boxShadow: 'none', backdropFilter: 'blur(8px)' } } },
      MuiTooltip: { styleOverrides: { tooltip: { fontSize: '0.8rem', borderRadius: 8 } } },
    },
  })
}

export default crear_tema
