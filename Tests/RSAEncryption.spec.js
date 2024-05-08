const { generateKeyPair, encryptText, decryptText } = require('../Backend/Validation/RSAEncryption');
const crypto = require('crypto');

test('generateKeyPair should return an object with publicKey and privateKey', () => {
    const keyPair = generateKeyPair();
    expect(keyPair).toHaveProperty('publicKey');
    expect(keyPair).toHaveProperty('privateKey');
});

test('encryptText should encrypt the text using the public key', () => {
    const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });
    const publicKey = keyPair.publicKey;
    const text = 'Hello, World!';
    const encryptedText = encryptText(text, publicKey);
    expect(encryptedText).not.toBe(text);
});

test('decryptText should decrypt the encrypted text using the private key', () => {
    const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });
    const privateKey = keyPair.privateKey;
    const publicKey = keyPair.publicKey;
    const text = 'Hello, World!';
    const encryptedText = encryptText(text, publicKey);
    const decryptedText = decryptText(encryptedText, privateKey);
    expect(decryptedText).toBe(text);
});