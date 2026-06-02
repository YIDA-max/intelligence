/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-12-01 15:22:24
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-12-02 11:29:46
 * @FilePath: \qianyi-ui\src\interface\views\fbm\logisticsChannel\platformLogistics\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
/**
 * 供应商列表
 *
 * QueryPlatformLogisticsProviderVO
 */
export interface QueryPlatformLogisticsProviderVO {
	/**
	 * 供应商名称（模糊查询）
	 */
	name?: string;
	/**
	 * 状态：0-禁用，1-启用
	 */
	status?: number;
}

/**
 * 平台物流供应商视图对象
 *
 * PlatformLogisticsProviderVO
 */
export interface PlatformLogisticsProviderVO {
	/**
	 * 主键ID
	 */
	id: number;
	/**
	 * 平台物流供应商名称
	 */
	name?: string;
	/**
	 * 状态：0-禁用，1-启用
	 */
	status: number;
	/**
	 * 状态名称
	 */
	statusText?: string;
}

/**
 * 平台物流视图对象
 *
 * PlatformLogisticsVO
 */
export interface PlatformLogisticsVO {
	/**
	 * 主键ID
	 */
	id: number;
	/**
	 * 物流渠道代码
	 */
	logisticsChannelCode?: string;
	/**
	 * 物流渠道名称
	 */
	logisticsChannelName?: string;
	/**
	 * 平台物流服务商ID
	 */
	logisticsProviderId?: number;
	/**
	 * 平台物流服务商名称
	 */
	logisticsProviderName?: string;
	/**
	 * 状态：0-禁用，1-启用
	 */
	status?: number;
	/**
	 * 状态：0-禁用，1-启用
	 */
	statusText?: string;
	/**
	 * 更新人姓名
	 */
	updateName?: string;
	/**
	 * 更新时间
	 */
	updateTime?: string;
	[property: string]: any;
}

/**
 * 平台物流查询对象
 * QueryPlatformLogisticsVO
 */
export interface QueryPlatformLogisticsVO {
	countId?: string;
	current?: number;
	/**
	 * 渠道名称
	 */
	logisticsChannelNames?: Array<string>;
	/**
	 * 平台物流服务商ID
	 */
	logisticsProviderId?: number;
	maxLimit?: number;
	optimizeCountSql?: boolean;
	optimizeJoinOfCountSql?: boolean;
	'orders[0].asc'?: boolean;
	'orders[0].column'?: string;
	'records[0]'?: string[];
	searchCount?: boolean;
	size?: number;
	/**
	 * 状态：0-禁用，1-启用
	 */
	status?: number;
	total?: number;
	/**
	 * 更新人id
	 */
	updateId?: number;
	/**
	 * 更新时间结束
	 */
	updateTimeEnd?: string;
	/**
	 * 更新时间开始
	 */
	updateTimeStart?: string;
	[property: string]: any;
}

/**
 * 保存采购单对象
 *
 * PlatformLogisticsSaveDTO
 */
export interface PlatformLogisticsSaveDTO {
	/**
	 * 主键ID
	 */
	id?: number;
	/**
	 * 物流渠道代码
	 */
	logisticsChannelCode?: string;
	/**
	 * 物流渠道名称
	 */
	logisticsChannelName?: string;
	/**
	 * 标发设置
	 */
	mappingSaveDTOList?: PlatformLogisticsMappingSaveDTO[];
	/**
	 * 物流商id，对应platform_logistics_provider的id
	 */
	providerId?: number;
	/**
	 * 状态：0-禁用，1-启用
	 */
	status?: number;
	[property: string]: any;
}

/**
 * 平台物流查询DTO
 *
 * PlatformLogisticsMappingSaveDTO
 */
export interface PlatformLogisticsMappingSaveDTO {
	/**
	 * 实际承运商
	 */
	actualCarrie?: string;
	/**
	 * 平台
	 */
	correspondingPlatform?: string;
	/**
	 * 主键ID
	 */
	id?: number;
	/**
	 * 物流渠道代码
	 */
	logisticsChannelCode?: string;
	/**
	 * 平台标发承运商
	 */
	standardShippingCarrier?: string;
	/**
	 * 跟踪号上传方式  1:跟踪号 2:运单号
	 */
	trackingNoUploadMethod?: number;
	[property: string]: any;
}
/**
 * PlatformLogisticsDetailVO
 */
export interface PlatformLogisticsDetailVO {
	/**
	 * 主键ID
	 */
	id?: number;
	/**
	 * 物流渠道代码
	 */
	logisticsChannelCode?: string;
	/**
	 * 物流渠道名称
	 */
	logisticsChannelName?: string;
	/**
	 * 标发设置
	 */
	mappingSaveVOList?: PlatformLogisticsMappingDetailVO[];
	/**
	 * 物流商id，对应platform_logistics_provider的id
	 */
	providerId?: number;
	/**
	 * 状态：0-禁用，1-启用
	 */
	status?: number;
	[property: string]: any;
}

/**
 * 平台物流查询DTO
 *
 * PlatformLogisticsMappingDetailVO
 */
export interface PlatformLogisticsMappingDetailVO {
	/**
	 * 实际承运商
	 */
	actualCarrie?: string;
	/**
	 * 平台
	 */
	correspondingPlatform?: string;
	/**
	 * 主键ID
	 */
	id?: number;
	/**
	 * 物流渠道代码
	 */
	logisticsChannelCode?: string;
	/**
	 * 平台标发承运商
	 */
	standardShippingCarrier?: string;
	/**
	 * 跟踪号上传方式  1:跟踪号 2:运单号
	 */
	trackingNoUploadMethod?: string;
	[property: string]: any;
}
/**
 * 保存采购单对象
 *
 * PlatformLogisticsUpdateDTO
 */
export interface PlatformLogisticsUpdateDTO {
	/**
	 * 主键ID
	 */
	id?: number;
	/**
	 * 物流渠道代码
	 */
	logisticsChannelCode?: string;
	/**
	 * 物流渠道名称
	 */
	logisticsChannelName?: string;
	/**
	 * 标发设置
	 */
	mappingSaveList?: PlatformLogisticsMappingSaveDTO[];
	/**
	 * 物流商id，对应platform_logistics_provider的id
	 */
	providerId?: number;
	/**
	 * 状态：0-禁用，1-启用
	 */
	status?: number;
	[property: string]: any;
}
/**
 * 平台物流响应数据根结构
 */
export interface PlatformLogisticsResponse {
	data: PlatformItem[];
}

/**
 * 平台项（外层）
 */
interface PlatformItem {
	id: number;
	name: string;
	status: number;
	statusText: string;
	platformLogisticsList: LogisticsChannelItem[];
}

/**
 * 物流渠道项（内层）
 */
interface LogisticsChannelItem {
	id: number;
	logisticsChannelCode: string;
	logisticsChannelName: string;
	status: number;
	statusText: string;
	logisticsProviderId: number;
	logisticsProviderName: string;
	updateName: string;
	updateTime: string; // 通常为 ISO 8601 格式，如 "2025-12-01T10:00:00"
}
