// src/store/encryptTransform.ts
import { createTransform } from "redux-persist";
import CryptoJS from "crypto-js";

const secretKey = process.env.NEXT_PUBLIC_STORAGE_KEY || "default-secret";

export const encryptTransform = createTransform<any, any>(
  // Encrypt inbound state
  (inboundState, key) => {
    try {
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(inboundState),
        secretKey
      ).toString();
      return encrypted;
    } catch (e) {
      console.error("Encryption error", e);
      return inboundState;
    }
  },
  // Decrypt outbound state
  (outboundState, key) => {
    try {
      const bytes = CryptoJS.AES.decrypt(outboundState, secretKey);
      const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decrypted;
    } catch (e) {
      console.error("Decryption error", e);
      return outboundState;
    }
  }
);
