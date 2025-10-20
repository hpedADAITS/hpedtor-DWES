function mostrarFechaActual() {
  const now = new Date();
  const dia = String(now.getDate()).padStart(2, '0');
  const mes = String(now.getMonth() + 1).padStart(2, '0');
  const ano = now.getFullYear();
  const horas = String(now.getHours()).padStart(2, '0');
  const minutos = String(now.getMinutes()).padStart(2, '0');
  const segundos = String(now.getSeconds()).padStart(2, '0');
  console.clear(); 
  console.log(`${dia}-${mes}-${ano} ${horas}:${minutos}:${segundos}`);
}
setInterval(mostrarFechaActual, 1000);
