import other from './other';

// 从环境变量获取加密密钥
const ENCRYPTION_KEY = import.meta.env.VITE_PWD_ENC_KEY;

/**
 * 使用指定密钥加密数据
 * @param data - 需要加密的数据
 * @returns 加密后的数据，如果加密未启用则返回原始数据
 */
export function encrypt(data: any): string {
	if (!data) return '';

	// 如果不是 number 或者 string 类型的数据，转为 JSON 字符串
	if (typeof data !== 'string' && typeof data !== 'number') {
		data = JSON.stringify(data);
	}

	return other.encryption(data, ENCRYPTION_KEY);
}

/**
 * 使用指定密钥解密数据
 * @param encryptedData - 需要解密的数据
 * @returns 解密后的数据，如果加密未启用则返回原始数据
 */
export function decrypt(encryptedData: string): any {
	if (!encryptedData) return null;

	const decrypted = other.decryption(encryptedData, ENCRYPTION_KEY);
	try {
		return JSON.parse(decrypted);
	} catch {
		return decrypted;
	}
}
