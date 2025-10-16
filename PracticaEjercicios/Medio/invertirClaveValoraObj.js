function invertirClaveValor(obj) {
  const nuevoObj = {};
  for (const key in obj) {
    nuevoObj[obj[key]] = key;
  }
  return nuevoObj;
}

