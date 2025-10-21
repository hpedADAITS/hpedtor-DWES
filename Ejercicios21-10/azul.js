import chalk from 'chalk';
const args = process.argv.slice(2);
switch (args[0]) {
case 'azul':
    console.log(chalk.blue(args[1]));
    break;
case 'rojo':
    console.log(chalk.red(args[1]));
    break;
case 'verde':
    console.log(chalk.green(args[1]));
    break;
default:
    console.log('Uso: node azul.js <color> <texto>');
    return 1;
}