// Función para colocar el valor de cada lectura en un arreglo
function valoresEnArreglo(lecturas) {
  let arregloValores = [];
  lecturas.forEach((lectura) => {
    arregloValores.push(lectura.lectura_valor);
  });
  return arregloValores;
}

// Función para colocar la hora de cada lectura en un arreglo
function tiemposEnArreglo(lecturas) {
  let arregloTiempos = [];
  lecturas.forEach((lectura) => {
    arregloTiempos.push(lectura.createdAt.hora);
  });
  return arregloTiempos;
}

// Función para obtener el promedio de los valores de las lecturas
// y colocarlo en un arreglo
function promedioValores(lecturas) {
  let promedio = 0;
  let promedioArreglo = [];
  let valores = valoresEnArreglo(lecturas);
  for (let i = 0; i < valores.length; i++) {
    promedio += valores[i];
  }
  promedio = promedio / valores.length;
  for (let i = 0; i < valores.length; i++) {
    promedioArreglo.push(promedio);
  }

  return promedioArreglo;
}

export {
  valoresEnArreglo,
  tiemposEnArreglo,
  promedioValores
}