import { Injectable } from '@angular/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as CryptoJS from 'crypto-js';
import { ENVIRONMENT } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class EncryptionService {
    private secretKey = ENVIRONMENT.ENCRYPTION_KEY;

    encrypt(data: any): string {
        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
        return encryptedData;
    }

    decrypt(encryptedData: string): any {
        const decryptedData = CryptoJS.AES.decrypt(encryptedData, this.secretKey).toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedData);
    }
}
