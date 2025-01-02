export async function encryptAES(plainText: string, aesKeyBase64: string) {
  // Base64 디코딩된 AES 키를 Uint8Array로 변환
  const aesKey = Uint8Array.from(atob(aesKeyBase64), (c) => c.charCodeAt(0));

  // AES 키를 Web Crypto API에 가져오기
  const key = await crypto.subtle.importKey(
    "raw",
    aesKey,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  // IV(Initialization Vector) 생성 (12바이트)
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // 암호화
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    new TextEncoder().encode(plainText)
  );

  // IV와 암호화된 데이터를 결합하여 Base64로 인코딩
  const encryptedData = new Uint8Array(encrypted);
  const combinedData = new Uint8Array(iv.length + encryptedData.length);
  combinedData.set(iv);
  combinedData.set(encryptedData, iv.length);

  return btoa(String.fromCharCode.apply(null, Array.from(combinedData)));
}

export async function decryptAES(cipherText: string, aesKeyBase64: string) {
  // Base64 디코딩된 AES 키를 Uint8Array로 변환
  const aesKey = Uint8Array.from(atob(aesKeyBase64), (c) => c.charCodeAt(0));

  // Base64 디코딩된 암호화 데이터
  const decodedData = Uint8Array.from(atob(cipherText), (c) => c.charCodeAt(0));

  // IV 추출 (AES-GCM에서 권장되는 12바이트)
  const iv = decodedData.slice(0, 12);

  // 암호화된 데이터 추출
  const encryptedData = decodedData.slice(12);

  // AES 키를 Web Crypto API에 가져오기
  const key = await crypto.subtle.importKey(
    "raw",
    aesKey,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  try {
    // 복호화
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      encryptedData
    );

    // 복호화된 데이터 반환
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error("Decryption failed:", error);
    throw error;
  }
}
