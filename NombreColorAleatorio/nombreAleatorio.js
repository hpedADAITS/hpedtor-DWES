import { faker } from '@faker-js/faker';
import chalk from 'chalk';
const nombre = faker.person.fullName();
const color = faker.color.rgb(); 
console.log(chalk.hex(color)(`Nombre aleatorio: ${nombre}`));
