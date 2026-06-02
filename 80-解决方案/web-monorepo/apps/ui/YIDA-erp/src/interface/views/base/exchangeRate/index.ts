/**
 * BaseCurrencyVO
 */
export interface BaseCurrencyVO {
	/**
	 * 创建人id
	 */
	createId?: number;
	/**
	 * 创建人名称
	 */
	createName?: string;
	/**
	 * 创建时间
	 */
	createTime?: string;
	/**
	 * 币别编码
	 */
	currencyCode?: string;
	/**
	 * 币别名称
	 */
	currencyName?: string;
	/**
	 * id
	 */
	id?: number;
	/**
	 * 汇率
	 */
	rate?: number;
	/**
	 * 是否是标准货币：0-是 1-否
	 */
	standardCurrency?: number;
	/**
	 * 修改人id
	 */
	updateId?: number;
	/**
	 * 修改人名称
	 */
	updateName?: string;
	/**
	 * 修改时间
	 */
	updateTime?: string;
	/**
	 * 汇率版本
	 */
	versionDate?: string;
	[property: string]: any;
}
