const crypto = require("./crypto").crypto;

const base64Key = process.env.base64Key;
const key = Buffer.from(base64Key, 'base64');

async function encryptChat(choice) {
    if (key.length !== 32) {
        throw new Error('Key must be 32 bytes');
    }

    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    // data-г encrypt хийх
    let encryptedData = cipher.update(JSON.stringify(choice), 'utf-8', 'hex');
    encryptedData += cipher.final('hex');

    const encryptedMessage = iv.toString('hex') + ':' + encryptedData;

    return encryptedMessage;
}


module.exports = encryptChat;