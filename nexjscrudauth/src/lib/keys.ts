import { generateKeyPairSync } from "crypto";

// Bạn có thể dùng file thực tế, nhưng đây demo tạo luôn
const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
});

export { publicKey, privateKey };
