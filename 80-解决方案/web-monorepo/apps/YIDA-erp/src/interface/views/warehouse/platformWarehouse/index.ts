export interface IplatformWarehouseMappingPage {
	countId?: string;
	/**
	 * 创建人
	 */
	createId?: number;
	/**
	 * 创建时间 结束
	 */
	createTimeEnd?: string;
	/**
	 * 创建时间 开始
	 */
	createTimeStart?: string;
	current?: number;
	maxLimit?: number;
	optimizeCountSql?: boolean;
	optimizeJoinOfCountSql?: boolean;
	'orders[0].asc'?: boolean;
	'orders[0].column'?: string;
	/**
	 * 平台渠道
	 */
	platformChannelCode?: string;
	/**
	 * 平台仓库代码
	 */
	platformWarehouseCode?: string;
	/**
	 * 平台仓库名称
	 */
	platformWarehouseName?: string;
	/**
	 * 平台服务商
	 */
	platformWarehouseSpName?: string;
	'records[0]'?: string[];
	searchCount?: boolean;
	size?: number;
	/**
	 * 服务商
	 */
	spId?: number;
	total?: number;
	/**
	 * 三方仓编码
	 */
	warehouseCode?: string;
	/**
	 * 三方仓名称
	 */
	warehouseName?: string;
	[property: string]: any;
}

/**
 * PagePlatformWarehouseMappingVO
 */
export interface IpagePlatformWarehouseMappingVO {
	countId?: string;
	current?: number;
	maxLimit?: number;
	optimizeCountSql?: boolean;
	optimizeJoinOfCountSql?: boolean;

	records?: PlatformWarehouseMappingVO[];
	searchCount?: boolean;
	size?: number;
	total?: number;
	[property: string]: any;
}

/**
 * 平台仓库配对VO
 *
 * PlatformWarehouseMappingVO
 */
export interface PlatformWarehouseMappingVO {
	/**
	 * 创建人
	 */
	createName?: string;
	/**
	 * 创建时间
	 */
	createTime?: string;
	/**
	 * id
	 */
	id?: number;
	/**
	 * 平台渠道
	 */
	platformChannelCode?: string;
	/**
	 * 平台仓库代码
	 */
	platformWarehouseCode?: string;
	/**
	 * 平台仓库名称
	 */
	platformWarehouseName?: string;
	/**
	 * 平台服务商
	 */
	platformWarehouseSpName?: string;
	/**
	 * 服务商
	 */
	spName?: string;
	/**
	 * 三方仓编码
	 */
	warehouseCode?: string;
	/**
	 * 三方仓名称
	 */
	warehouseName?: string;
	[property: string]: any;
}
