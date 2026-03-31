import CryptoJS from "crypto-js";
import Config from "react-native-config";

const DEFAULT_BASE_KEY = "qyQLonCFB4Yi1kNf0l71pfj6GEmKn1X5fVT3ZUhbC3c=";
const DEFAULT_IV_VALUE = "qFBGdfsFx4MQcVr0ci1IQQ==";

class AESEncryption {
	constructor(baseKey = Config?.AES_BASE_KEY || DEFAULT_BASE_KEY, ivValue = Config?.AES_IV_VALUE || DEFAULT_IV_VALUE) {
		this.aesKey = CryptoJS.enc.Base64.parse(baseKey);
		this.aesIv = CryptoJS.enc.Base64.parse(ivValue);
	}

	aesEncrypt(plainText, key = this.aesKey, iv = this.aesIv) {
		if (!plainText) return "";

		const encrypted = CryptoJS.AES.encrypt(plainText, key, {
			iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7,
		});

		return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
	}

	encryptPassword(plainText) {
		return this.aesEncrypt(plainText, this.aesKey, this.aesIv);
	}

	encryptAnswer(plainText) {
		return this.aesEncrypt(plainText, this.aesKey, this.aesIv);
	}

	decryptAnswer(cipherText) {
		if (!cipherText) return "";

		const cipherParams = CryptoJS.lib.CipherParams.create({
			ciphertext: CryptoJS.enc.Base64.parse(cipherText),
		});

		const decrypted = CryptoJS.AES.decrypt(cipherParams, this.aesKey, {
			iv: this.aesIv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7,
		});

		return decrypted.toString(CryptoJS.enc.Utf8);
	}
}

const aesEncryption = new AESEncryption();

export { AESEncryption };
export default aesEncryption;
