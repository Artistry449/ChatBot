const CryptoJS = require("./crypto").CryptoJS;

const client_key = CryptoJS.enc.Base64.parse(process.env.base64Key);

function decryptMessage(encryptedMessage) {
    const parts = encryptedMessage.split(':');
    const ivHex = parts[0];
    const encryptedDataHex = parts[1];

    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const encryptedData = CryptoJS.enc.Hex.parse(encryptedDataHex);

    const decrypted = CryptoJS.AES.decrypt(
        {
            ciphertext: encryptedData
        },
        client_key,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
    );

    const decryptedMessage = decrypted.toString(CryptoJS.enc.Utf8);
    // console.log("-------------");
    // console.log(decryptedMessage);
    return decryptedMessage;
}
module.exports = decryptMessage