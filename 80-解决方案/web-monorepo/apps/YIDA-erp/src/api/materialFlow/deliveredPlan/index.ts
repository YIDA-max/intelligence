/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2026-05-12 11:29:53
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-05-12 11:38:24
 * @FilePath: \qianyi-ui\src\api\materialFlow\deliveredPlan\index.ts
 * @Description: 已发货计划接口与类型定义
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';

/**
 * 分页数据
 *
 * RIPageDeliveredPlanListVO
 */
export interface IResponse {
	code?: number;
	data?: IPageDeliveredPlanListVO;
	msg?: string;
	ok?: boolean;
	trackId?: string;
	[property: string]: any;
}

/**
 * IPageDeliveredPlanListVO
 */
export interface IPageDeliveredPlanListVO {
	/** mybatis-plus 统计查询标识 */
	countId?: string;
	/** 当前页码 */
	current?: number;
	/** 每页大小 */
	maxLimit?: number;
	optimizeCountSql?: boolean;
	optimizeJoinOfCountSql?: boolean;
	orders?: OrderItem[];
	pages?: number;
	/** 列表记录 */
	records?: DeliveredPlanListVO[];
	searchCount?: boolean;
	size?: number;
	total?: number;
	[property: string]: any;
}

/**
 * com.baomidou.mybatisplus.core.metadata.OrderItem
 *
 * OrderItem
 */
export interface OrderItem {
	asc?: boolean;
	column?: string;
	[property: string]: any;
}

/**
 * 已发货计划列表视图对象
 *
 * DeliveredPlanListVO
 */
export interface DeliveredPlanListVO {
	/** ============ 头程追踪时间字段 ============ */
	actualArrivalTime?: string;
	actualDepartureTime?: string;
	actualLoadingTime?: string;
	actualPickupTime?: string;
	arrivalWarehouseTime?: string;
	barcode?: string;
	cargoType?: string;
	cargoTypeText?: string;
	cartons?: number;
	changedEstimatedLoadingTime?: string;
	containerNo?: string;
	containerPickupTime?: string;
	countryCode?: string;
	countryName?: string;
	createId?: number;
	createName?: string;
	createTime?: string;
	customsForwarderName?: string;
	customsForwarderNo?: string;
	deliveryForwarderName?: string;
	deliveryForwarderNo?: string;
	deliveryNo?: string;
	demandNo?: string;
	deptId?: number;
	deptName?: string;
	destPortCode?: string;
	destPortName?: string;
	destWarehouseNameList?: string[];
	dischargingTime?: string;
	/** ============ 货代字段 ============ */
	domesticForwarderName?: string;
	domesticForwarderNo?: string;
	emptyContainerWeight?: number;
	estimatedArrivalTime?: string;
	estimatedDepartureTime?: string;
	estimatedLoadingTime?: string;
	factoryDeliveryDate?: string;
	factoryId?: number;
	factoryName?: string;
	goodsCreateDate?: string;
	/** ============ 发货计划基础字段 ============ */
	id?: number;
	logisticsRemark?: string;
	logisticsUserId?: number;
	logisticsUserName?: string;
	mainForwarderName?: string;
	mainForwarderNo?: string;
	mskuCode?: string;
	operationUserId?: number;
	operationUserName?: string;
	orderContainerNo?: string;
	orderType?: string;
	orderTypeText?: string;
	outCartonGrossWeight?: number;
	outCartonHeight?: number;
	outCartonLength?: number;
	outCartonWidth?: number;
	pickupNo?: string;
	planShipmentDate?: string;
	platformChannelCode?: string;
	platformChannelCodeText?: string;
	platformWarehouseCode?: string;
	productNetWeight?: number;
	purchaseNo?: string;
	purchaseUserId?: number;
	purchaseUserName?: string;
	referenceId?: string;
	remark?: string;
	sealNo?: string;
	shipmentId?: string;
	shipmentQuantity?: number;
	shippingLine?: string;
	shippingMethod?: string;
	shippingMethodText?: string;
	shippingRoute?: string;
	singleCartonQuantity?: number;
	skuCode?: string;
	skuName?: string;
	soNo?: string;
	specialAttributes?: string[];
	specialAttributeTextList?: string[];
	startPortCode?: string;
	startPortName?: string;
	status?: number;
	statusText?: string;
	storeId?: number;
	storeName?: string;
	teamName?: string;
	totalGrossWeight?: number;
	totalNetWeight?: number;
	totalVolume?: number;
	/** ============ 订柜管理字段 ============ */
	transportMethod?: string;
	transportMethodText?: string;
	vessel?: string;
	voyage?: string;
	[property: string]: any;
}

/**
 * 已发货计划分页查询
 */
export function getDeliveredPlanPage(data?: object) {
	return request({
		url: '/mcp/deliveredPlan/page',
		method: 'post',
		data,
	});
}

/**
 * 导出已发货计划
 */
export function exportDeliveredPlan(data?: object) {
	return request({
		url: '/mcp/deliveredPlan/export',
		method: 'post',
		data,
		responseType: 'blob',
	});
}
