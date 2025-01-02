import CryptoJS from "crypto-js";

// 암호화 함수
export function encryptAES(plainText: string): string {
  // 키와 IV 생성
  const key = process.env.NEXT_PUBLIC_MESSAGE_KEY!;
  const keyHex = CryptoJS.enc.Utf8.parse(key);
  const iv = CryptoJS.enc.Utf8.parse(key.substring(0, 16)); // 키의 앞 16자리를 IV로 사용

  // 암호화
  const encrypted = CryptoJS.AES.encrypt(plainText, keyHex, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
}

// 복호화 함수
export function decryptAES(cipherText: string): string {
  // 키와 IV 생성
  const key = process.env.NEXT_PUBLIC_MESSAGE_KEY!;
  const keyHex = CryptoJS.enc.Utf8.parse(key);
  const iv = CryptoJS.enc.Utf8.parse(key.substring(0, 16));

  // 복호화
  const decrypted = CryptoJS.AES.decrypt(cipherText, keyHex, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}
