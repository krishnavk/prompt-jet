import CryptoJS from "crypto-js";

export function encryptApiKey(apiKey: string, passphrase: string): string {
  return CryptoJS.AES.encrypt(apiKey, passphrase).toString();
}

export function decryptApiKey(encrypted: string, passphrase: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, passphrase);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return "";
  }
}
