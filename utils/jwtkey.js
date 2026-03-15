const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const keysDir = path.join(__dirname, '..', 'keys');
const privateKeyPath = path.join(__dirname, '..', 'keys', 'private.pem');
const publicKeyPath = path.join(__dirname, '..', 'keys', 'public.pem');

if (!fs.existsSync(keysDir)) {
    fs.mkdirSync(keysDir, { recursive: true });
}

if (!fs.existsSync(privateKeyPath)) {
    const generated = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        },
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        }
    });
    fs.writeFileSync(privateKeyPath, generated.privateKey);
    fs.writeFileSync(publicKeyPath, generated.publicKey);
}

if (!fs.existsSync(publicKeyPath)) {
    const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
    const generatedPublicKey = crypto
        .createPublicKey(privateKey)
        .export({ type: 'spki', format: 'pem' });
    fs.writeFileSync(publicKeyPath, generatedPublicKey);
}

module.exports = {
    privateKey: fs.readFileSync(privateKeyPath, 'utf8'),
    publicKey: fs.readFileSync(publicKeyPath, 'utf8')
};
