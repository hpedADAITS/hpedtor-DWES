import chalk from 'chalk';
function mostrarFechaVerde() {
  const now = new Date();
  const dia = String(now.getDate()).padStart(2, '0');
  const mes = String(now.getMonth() + 1).padStart(2, '0');
  const ano = now.getFullYear();
  const horas = String(now.getHours()).padStart(2, '0');
  const minutos = String(now.getMinutes()).padStart(2, '0');
  const segundos = String(now.getSeconds()).padStart(2, '0');
  const horaFormat = (now.getSeconds() % 10 === 0)
    ? chalk.green(`${horas}:${minutos}:${segundos}`)
    : `${horas}:${minutos}:${segundos}`;
  console.clear();
  console.log(`${dia}-${mes}-${ano} ${horaFormat}`);
}
setInterval(mostrarFechaVerde, 1000);
