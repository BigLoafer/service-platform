import CryptoJS from 'crypto-js';
import { DES } from '../env';
const tripledes = CryptoJS.TripleDES;
const IV = CryptoJS.enc.Utf8.parse(DES.Iv);
const KEY = CryptoJS.enc.Utf8.parse(DES.Key);

const Des = new class CryptoDES {
  encrypt(message: any) {
    const result: any = tripledes.encrypt(message || '', KEY, {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encodeURIComponent(result);
  }

  decrypt(message: any) {
    const encryptedMessage: any = {
      ciphertext: CryptoJS.enc.Base64.parse(decodeURIComponent(message || ''))
    };
    const result = tripledes.decrypt(
      encryptedMessage,
      KEY,
      {
        iv: IV, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7
      }
    );
    return result.toString(CryptoJS.enc.Utf8);
  }
};

// admin
// UDuNlDebtWg=
export const passwordEncode = (p: any) => decodeURIComponent(Des.encrypt(p));

export default Des;
