const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const creds = { user: process.argv[2], pass: process.argv[3] };
const encrypt = process.argv[4];

if (!creds.user || !creds.pass || !encrypt) {
    console.error('error: falta username, token o clave');
    process.exit(1);
}

if (encrypt.length < 32) {
    console.error('error: minimo 32 caracteres');
    process.exit(1);
}

function encryptToken(token, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
        'aes-256-cbc',
        Buffer.from(key.padEnd(32, '0').slice(0, 32)),
        iv
    );
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

const credentials = `${creds.user}:${creds.pass}`;
const token = encryptToken(credentials, encrypt);

const envstuff = path.join(__dirname, '../.env');
let envdata = '';

if (fs.existsSync(envstuff)) {
    envdata = fs.readFileSync(envstuff, 'utf-8');
}

const envlines = envdata.split('\n').filter(line => 
    !line.startsWith('ADMIN_USERNAME') && 
    !line.startsWith('ADMIN_TOKEN') && 
    !line.startsWith('ENCRYPTION_KEY')
);

// Dios mio
const updated = envlines.filter(l => l.trim()).concat([`ADMIN_USERNAME=${creds.user}`, `ADMIN_TOKEN=${creds.pass}`, `ENCRYPTION_KEY=${encrypt}`]).join('\n') + '\n';

fs.writeFileSync(envstuff, updated);

console.log("Generacion de token para el ejercicio")
console.log('usuario: ' + creds.user);
console.log('token: ' + creds.pass);
console.log('cifrado: ' + token);
console.log('guardado en .env');
console.log('usa: Bearer ' + token);
