// Textos que traducen los numeros a lenguaje cotidiano para el usuario

// Como se describe el nivel de hambre elegido
export function texto_hambre(valor) {
  if (valor < 30) return 'Solo quiero picar algo'
  if (valor < 55) return 'Hambre normal'
  if (valor < 80) return 'Traigo buen apetito'
  return 'Muero de hambre'
}

// Como se describe el gusto por el picante
export function texto_picante(valor) {
  if (valor <= 0) return 'Nada de picante, por favor'
  if (valor < 35) return 'Solo un poquito de chile'
  if (valor < 65) return 'Que pique normal'
  return 'Lo mas picoso que haya'
}

// Como se describe el gusto por lo dulce
export function texto_dulce(valor) {
  if (valor <= 0) return 'Nada dulce, algo neutro'
  if (valor < 35) return 'Apenas dulcecito'
  if (valor < 65) return 'Dulce normal'
  return 'Lo mas dulce que tengan'
}

// Como se describe el presupuesto elegido
export function texto_presupuesto(valor) {
  if (valor < 60) return 'Lo mas barato que haya'
  if (valor < 120) return 'Quiero gastar poco'
  if (valor < 220) return 'Un gasto normal'
  if (valor < 320) return 'Me doy un gusto'
  return 'Sin fijarme en el precio'
}

// Como se describe que tan llenador es un producto
export function texto_porcion(valor) {
  if (valor < 20) return 'Muy ligero'
  if (valor < 40) return 'Porcion ligera'
  if (valor < 65) return 'Porcion justa'
  if (valor < 90) return 'Bien servido'
  return 'Porcion muy grande'
}

// Como se describe el picor de un platillo
export function texto_picor(valor) {
  if (valor < 20) return 'No pica'
  if (valor < 45) return 'Pica poquito'
  if (valor < 70) return 'Pica rico'
  return 'Muy picoso'
}

// Como se describe el dulzor de un postre o una bebida
export function texto_dulzor(valor) {
  if (valor < 20) return 'Sin azucar'
  if (valor < 45) return 'Poco dulce'
  if (valor < 70) return 'Dulce parejo'
  return 'Bien dulce'
}

// Describe el sabor del producto segun el modo en que se busca
export function texto_sabor(producto, modo = 'salado') {
  if (modo === 'dulce' || producto?.tipo === 'postre' || producto?.tipo === 'bebida') {
    return texto_dulzor(producto?.dulzor ?? 0)
  }
  return texto_picor(producto?.picor ?? 0)
}

// Color del indicador segun que tanto coincide el producto
export function color_coincidencia(valor) {
  if (valor >= 85) return 'primary'
  if (valor >= 65) return 'warning'
  return 'secondary'
}

// Frase corta que acompana el porcentaje de coincidencia
export function texto_coincidencia(valor) {
  if (valor >= 90) return 'Hecho para ti'
  if (valor >= 75) return 'Muy buena opcion'
  if (valor >= 60) return 'Buena opcion'
  return 'Otra alternativa'
}

// Nombre de las tres barras de afinidad, segun el modo
export function nombres_afinidad(modo = 'salado') {
  return {
    porcion: modo === 'dulce' ? 'Que tan pesado es' : 'Que tan llenador',
    sabor: modo === 'dulce' ? 'Que tan dulce es' : 'Que tanto pica',
    precio: 'Cabe en tu presupuesto',
  }
}
