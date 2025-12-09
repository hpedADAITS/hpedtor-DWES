const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-32-chars-minimum!!!';

function encryptToken(token) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
        'aes-256-cbc',
        Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)),
        iv
    );
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

function decryptToken(encryptedToken) {
    const parts = encryptedToken.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)),
        iv
    );
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

function authMiddleware(req, res, next) {
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminToken = process.env.ADMIN_TOKEN || 'secret-token';

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'falta encabezado de autorización' });
    }

    const [scheme, credentials] = authHeader.split(' ');

    if (scheme !== 'Bearer') {
        return res.status(401).json({ error: 'autorizacion invalida' });
    }

    if (!credentials) {
        return res.status(401).json({ error: 'credenciales faltantes' });
    }

    try {
        const decrypted = decryptToken(credentials);
        const [username, token] = decrypted.split(':');

        if (username === adminUsername && token === adminToken) {
            req.user = { username };
            return next();
        }

        return res.status(403).json({ error: 'credenciales inválidas' });
    } catch (error) {
        return res.status(401).json({ error: 'token inválido' });
    }
}

module.exports = {
    authMiddleware,
    encryptToken,
    decryptToken,
};
