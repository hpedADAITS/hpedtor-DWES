import fs from 'fs';
import { promises as fsp } from 'fs';
const dataSync = fs.readFileSync('archivo.txt', 'utf-8');
console.log('Lectura síncrona:', dataSync);
const dataAsync = await fsp.readFile('archivo.txt', 'utf-8');
console.log('Lectura asíncrona:', dataAsync);
