/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-08-25 20:17:30
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-03-31 10:38:23
 * @FilePath: \qianyi-ui\src\utils\rateUtils.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
/**
 * 根据币种单位返回对应的币种符号
 * @param currency 币种单位（如 'CNY', 'USD', 'EUR', 'JPY' 等）
 * @returns 币种符号（如 '¥', '$', '€', '¥' 等），未匹配返回人民币符号 '¥'
 */
export function getCurrencySymbol(currency: string): string {
	const map: Record<string, string> = {
		CNY: '¥',
		RMB: '¥',
		USD: '$',
		EUR: '€',
		JPY: '¥',
		GBP: '£',
		KRW: '₩',
		AUD: 'A$',
		CAD: 'C$',
		HKD: 'HK$',
		SGD: 'S$',
		INR: '₹',
		RUB: '₽',
		THB: '฿',
		VND: '₫',
		TWD: 'NT$',
		MYR: 'RM',
		IDR: 'Rp',
		PHP: '₱',
		BRL: 'R$',
		CHF: 'Fr.',
		NZD: 'NZ$',
		DRL: 'R$', // 巴西里尔（与BRL符号一致）
		EGP: '£E', // 埃及镑
		GHS: 'GH₵', // 加纳塞地（JSON中“加纳”对应货币为加纳塞地）
		MXN: 'Mex$', // 墨西哥元
		PLN: 'zł', // 波兰兹罗提
		UAH: '₴', // 乌克兰格里夫纳
		// 其他货币符号映射
	};
	// console.log(currency);

	return map[currency?.toUpperCase?.()] || '¥';
}
/**
 * 根据币种代码和数值，返回带有币种符号的字符串
 * @param currencyCode 币种代码
 * @param value 数值
 * @returns
 */
export const postSymbol = (currencyCode: string, value: string) => {
	return value ? `${currencyCode}${value}` : '---';
};
