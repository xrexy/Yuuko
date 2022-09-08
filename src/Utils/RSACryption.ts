import path = require('path');
import fs = require('fs');
import NodeRSA = require('node-rsa');

export function RSAcryption(item: string, type: Boolean): string {
    if (type === true) {
        let itemContent = path.join(__dirname, '../RSA/id_rsa');

        if (!fs.existsSync(itemContent)) {
            throw new Error('Missing Private RSA key.')
        }

        const decryptitem = new NodeRSA(fs.readFileSync(itemContent).toString());
        return decryptitem.decrypt(item, 'utf8');

    } else {
        let itemContent = path.join(__dirname, '../RSA/id_rsa.pub');

        if (!fs.existsSync(itemContent)) {
            throw new Error('Missing public RSA key.')
        };

        const encryptitem = new NodeRSA(fs.readFileSync(itemContent).toString());
        return encryptitem.encrypt(item, 'base64');
    };
};