<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 11:09:20
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-05-28 15:07:32
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\orderInterceptRule\components\rule-model\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { ref } from 'vue';

import { useI18n } from 'vue-i18n';
import {
	postRuleConditionAcceptSave,
	postRuleConditionAcceptUpdate,
} from '/@/api/fbm/orderRule/orderInterceptRule/index';
import { useMessage } from '/@/hooks/message';
import { initFn } from './utils/index';
import { isString } from 'lodash';
const props = defineProps({
	// 规则类型 add-新增 edit-编辑
	visibleType: {
		type: String,
		default: 'add',
	},
	// 当前行数据
	currentRow: {
		type: Object,
		default: () => ({}),
	},
});
const emit = defineEmits(['getDataList']);
const { t } = useI18n();

const ModelTitle = defineAsyncComponent(
	() => import('/@/views/fbm/orderRule/components/model-title/index.vue')
);
const ModelList = defineAsyncComponent(
	() => import('/@/views/fbm/orderRule/components/model-list/index.vue')
);

//// 基础信息
// 订单平台
const OrderPlatformFilter = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/orderRule/components/model-info/base-info/orderPlatformFilter/index.vue'
		)
);
// 店铺站点
const OrderCountryRegionFilter = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/orderRule/components/model-info/base-info/orderCountryRegionFilter/index.vue'
		)
);
// 订单店铺
const OrderStoreFilter = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/orderRule/components/model-info/base-info/orderStoreFilter/index.vue'
		)
);
// 订单接入方式
const OrderAccessMethodFilter = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/orderRule/components/model-info/base-info/orderAccessMethodFilter/index.vue'
		)
);
// 订单售价(不含税)
const OrderPriceExTaxFilter = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/orderRule/components/model-info/base-info/orderPriceExTaxFilter/index.vue'
		)
);
// 订单总数量
const OrderTotalQuantityFilter = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/orderRule/components/model-info/base-info/orderTotalQuantityFilter/index.vue'
		)
);
// 订单总重量
const OrderTotalWeightFilter = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/orderRule/components/model-info/base-info/orderTotalWeightFilter/index.vue'
		)
);
//  是否有买家备注
const HasBuyerNoteFilter = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/orderRule/components/model-info/base-info/hasBuyerNoteFilter/index.vue'
		)
);
//  是否定制化订单
const IsCustomizedOrderFilter = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/orderRule/components/model-info/base-info/isCustomizedOrderFilter/index.vue'
		)
);
// 订单体积重
const OrderVolumetricWeightFilter = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/orderRule/components/model-info/base-info/orderVolumetricWeightFilter/index.vue'
		)
);
// 产品尺寸
const ProductSizeFilter = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/orderRule/components/model-info/base-info/productSizeFilter/index.vue'
		)
);

//// 仓库物流

//物流渠道
// const shippingToLogisticsChannelFilter = defineAsyncComponent(
// 	() => import('/@/views/fbm/orderRule/components/model-info/warehouse-shipping/shippingToLogisticsChannelFilter/index.vue')
// );
// //发货仓库
// const shippingToWarehouseFilter = defineAsyncComponent(
// 	() => import('/@/views/fbm/orderRule/components/model-info/warehouse-shipping/shippingToWarehouseFilter/index.vue')
// );
// 收货国家/地区
const ShipToCountryRegionFilter = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/orderRule/components/model-info/warehouse-shipping/shipToCountryRegionFilter/index.vue'
		)
);
// 收货省/州
const ShipToStateProvinceFilter = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/orderRule/components/model-info/warehouse-shipping/shipToStateProvinceFilter/index.vue'
		)
);
// 收货城市
const ShipToCityFilter = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/orderRule/components/model-info/warehouse-shipping/shipToCityFilter/index.vue'
		)
);
// 收货邮编
const ShipToPostalCodeFilter = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/orderRule/components/model-info/warehouse-shipping/shipToPostalCodeFilter/index.vue'
		)
);
// 仓库物流
const ShipToThreeWarehouseAndLogisticsChannel = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/orderRule/components/model-info/warehouse-shipping/shipToThreeWarehouseAndLogisticsChannel/index.vue'
		)
);
// 发运级别
const ShippingServiceLevelFilter = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/orderRule/components/model-info/warehouse-shipping/shippingServiceLevelFilter/index.vue'
		)
);
//跟踪号
const TrackingNumber = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/orderRule/components/model-info/warehouse-shipping/trackingNumber/index.vue'
		)
);
// 实际承运人
const ShipToActualCarrierFilter = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/orderRule/components/model-info/warehouse-shipping/shipToActualCarrierFilter/index.vue'
		)
);
// 平台仓库ID
const PlatformWarehouseIdFilter = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/orderRule/components/model-info/warehouse-shipping/platformWarehouseIdFilter/index.vue'
		)
);
//物流总价
const TotalLogistics = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/orderRule/components/model-info/warehouse-shipping/totalLogistics/index.vue'
		)
);
// 电话号/手机号
const PhoneMobileFilter = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/orderRule/components/model-info/warehouse-shipping/phoneMobileFilter/index.vue'
		)
);

//// 订单
// 订单MSKU
const OrderMSKUFilter = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/orderRule/components/model-info/order/orderMSKUFilter/index.vue'
		)
);
// 订单产品
const OrderProductFilter = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/orderRule/components/model-info/order/orderProductFilter/index.vue'
		)
);
// 产品品类
const ProductCategoryFilter = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/orderRule/components/model-info/order/productCategoryFilter/index.vue'
		)
);
// 产品品牌
const ProductBrandFilter = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/orderRule/components/model-info/order/productBrandFilter/index.vue'
		)
);
// 特殊属性
const SpecialAttributesFilter = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/orderRule/components/model-info/order/specialAttributesFilter/index.vue'
		)
);

//// 设定动作
const SetAction = defineAsyncComponent(
	() => import('./model-info/set-action/index.vue')
);

// title 和 list 组件ref
const modelTitleRef = ref<any>(null);
const modelListRef = ref<any>(null);

//// 基础信息
// 订单平台ref
const orderPlatformFilterRef = ref<any>(null);
// 店铺站点ref
const orderCountryRegionFilterRef = ref<any>(null);
// 订单店铺ref
const orderStoreFilterRef = ref<any>(null);
// 订单接入方式ref
const orderAccessMethodFilterRef = ref<any>(null);
// 订单售价(不含税)ref
const orderPriceExTaxFilterRef = ref<any>(null);
// 订单总数量ref
const orderTotalQuantityFilterRef = ref<any>(null);
// 订单总重量ref
const orderTotalWeightFilterRef = ref<any>(null);
// 是否有买家备注ref
const hasBuyerNoteFilterRef = ref<any>(null);
// 是否定制化订单ref
const isCustomizedOrderFilterRef = ref<any>(null);
// 订单体积重ref
const orderVolumetricWeightFilterRef = ref<any>(null);
// 产品尺寸ref
const productSizeFilterRef = ref<any>(null);

//// 仓库物流
// 发货仓库ref
const shippingToLogisticsChannelFilterRef = ref<any>(null);
// 发货仓库ref
const shippingToWarehouseFilterRef = ref<any>(null);
// 收货国家/地区ref
const shipToCountryRegionFilterRef = ref<any>(null);
// 收货省/州ref
const shipToStateProvinceFilterRef = ref<any>(null);
// 收货城市ref
const shipToCityFilterRef = ref<any>(null);
// 收货邮编ref
const shipToPostalCodeFilterRef = ref<any>(null);
// 仓库物流ref
const shipToThreeWarehouseAndLogisticsChannelRef = ref<any>(null);
// 发运级别ref
const shippingServiceLevelFilterRef = ref<any>(null);
//跟踪号ref
const trackingNumberRef = ref<any>(null);
// 物流总价ref
const totalLogisticsRef = ref<any>(null);
// 实际承运人ref
const shipToActualCarrierFilterRef = ref<any>(null);
// 平台仓库IDref
const platformWarehouseIdFilterRef = ref<any>(null);
// 电话号/手机号ref
const phoneMobileFilterRef = ref<any>(null);

//// 订单
// 订单MSKUref
const orderMSKUFilterRef = ref<any>(null);
// 订单产品ref
const orderProductFilterRef = ref<any>(null);
// 订单产品品类ref
const productCategoryFilterRef = ref<any>(null);
// 订单产品品牌ref
const productBrandFilterRef = ref<any>(null);
// 订单特殊属性ref
const specialAttributesFilterRef = ref<any>(null);

//// 设定动作ref
const setAction = ref<any>(null);
// 弹窗ref
const dialogRef = ref<any | null>(null);
// 弹窗显示与否
const dialogVisible = ref(false);
// 当前选中的多选框
const currentCheckList = ref<string[]>([]);

// 筛选项分组
const optionsGroups = ref([
	{
		title: '基础信息',
		options: [
			{ label: '订单平台', value: 'platformChannel' },
			{ label: '店铺站点', value: 'site' },
			{ label: '订单店铺', value: 'store' },
			{ label: '订单售价(不含税)', value: 'sellingPrice' },
			// { label: '订单接入方式', value: 'orderFrom' },
			{ label: '订单数量', value: 'totalNumber' },
			{ label: '订单总重量', value: 'weight' },
			{ label: '是否有买家备注', value: 'buyerNote' },
			// { label: '是否定制化订单', value: 'madeToOrder' },
			{ label: '订单体积重', value: 'volumetricWeight' },
			{ label: '产品尺寸', value: 'productSize' },
		],
	},
	{
		title: '仓库物流',
		options: [
			// { label: '物流渠道', value: 'logisticsChannel' },
			// { label: '发货仓库', value: 'warehouseCode' },
			{ label: '收货国家/地区', value: 'recipientCountry' },
			{ label: '收货省/州', value: 'recipientState' },
			{ label: '收货城市', value: 'recipientCity' },
			{ label: '收货邮编', value: 'recipientPostcode' },
			{ label: '仓库物流', value: 'warehouseAndLogisticsChannel' },
			{ label: '发运级别', value: 'shipmentPriority' },
			{ label: '物流总价', value: 'totalFee' },
			{ label: '跟踪号', value: 'logisticsTrackingNo' },
			{ label: '实际承运人', value: 'carrierName' },
			// { label: '平台仓库ID', value: 'platformWareId' },
			// { label: '电话号/手机号', value: 'phone' },
		],
	},
	{
		title: '订单',
		options: [
			{ label: '订单MSKU', value: 'mskuCode' },
			{ label: '订单产品', value: 'skuCode' },
			{ label: '产品品类', value: 'category' },
			{ label: '产品品牌', value: 'brand' },
			{ label: '特殊属性', value: 'specialAttribute' },
		],
	},
]);

/**
 * 初始化
 */
const init = () => {
	// 初始化数据
	initFn(props, {
		modelTitleRef, // title 组件ref
		modelListRef, // list 组件ref
		orderPlatformFilterRef, // 订单平台ref
		orderCountryRegionFilterRef, // 店铺站点ref
		orderStoreFilterRef, // 订单店铺ref
		orderAccessMethodFilterRef, // 订单接入方式ref
		orderPriceExTaxFilterRef, // 订单售价(不含税)ref
		orderTotalQuantityFilterRef, // 订单总数量ref
		orderTotalWeightFilterRef, // 订单总重量ref
		hasBuyerNoteFilterRef, // 是否有买家备注ref
		isCustomizedOrderFilterRef, // 是否定制化订单ref
		orderVolumetricWeightFilterRef, // 订单体积重ref
		productSizeFilterRef, // 产品尺寸ref
		// shippingToLogisticsChannelFilterRef, //渠道ref
		// shippingToWarehouseFilterRef, // 发货仓库ref
		shipToCountryRegionFilterRef, // 收货国家/地区ref
		shipToStateProvinceFilterRef, // 收货省/州ref
		shipToCityFilterRef, // 收货城市ref
		shipToPostalCodeFilterRef, // 收货邮编ref
		shippingServiceLevelFilterRef, // 发运级别ref
		totalLogisticsRef, // 物流总价ref
		trackingNumberRef, // 跟踪号
		shipToActualCarrierFilterRef, // 实际承运人ref
		shipToThreeWarehouseAndLogisticsChannelRef, // 仓库物流ref
		platformWarehouseIdFilterRef, // 平台仓库IDref
		phoneMobileFilterRef, // 电话号/手机号ref
		orderMSKUFilterRef, // 订单MSKUref
		orderProductFilterRef, // 订单产品ref
		productCategoryFilterRef, // 订单产品品类ref
		productBrandFilterRef, // 订单产品品牌ref
		specialAttributesFilterRef, // 订单特殊属性ref
		setAction, // 设定动作ref
	});
};

// 设置选中值
const setCheckList = (val: string[]) => {
	currentCheckList.value = val;
};

/**
 * 确定
 */
const onSubmit = async () => {
	try {
		// 获取到头部的数据
		const titleData = (await modelTitleRef.value?.validateForm()) || {};
		// 获取到订单平台的数据
		const orderPlatformFilterData = currentCheckList.value.includes(
			'platformChannel'
		)
			? (await orderPlatformFilterRef.value?.validateForm()) || {}
			: {
					platformChannel: '', // 订单平台
			  };
		// 获取店铺站点数据
		const orderCountryRegionFilterData = currentCheckList.value.includes('site')
			? (await orderCountryRegionFilterRef.value?.validateForm()) || {}
			: {
					site: '', // 店铺站点
			  };
		// 获取订单店铺数据
		const orderStoreFilterData = currentCheckList.value.includes('store')
			? (await orderStoreFilterRef.value?.validateForm()) || {}
			: {
					store: '', // 订单店铺
			  };
		// 获取订单访问方式数据
		const orderAccessMethodFilterData = currentCheckList.value.includes(
			'orderFrom'
		)
			? (await orderAccessMethodFilterRef.value?.validateForm()) || {}
			: {
					orderFrom: '', // 订单接入方式
			  };
		// 获取订单售价(不含税)数据
		const orderPriceExTaxFilterData = currentCheckList.value.includes(
			'sellingPrice'
		)
			? (await orderPriceExTaxFilterRef.value?.validateForm()) || {}
			: {
					sellingPrice: '', // 订单售价(不含税)
			  };
		// 获取订单总数量数据
		const orderTotalQuantityFilterData = currentCheckList.value.includes(
			'totalNumber'
		)
			? (await orderTotalQuantityFilterRef.value?.validateForm()) || {}
			: {
					totalNumber: '', // 订单总数量
			  };
		//   获取订单总重量数据
		const orderTotalWeightFilterData = currentCheckList.value.includes('weight')
			? (await orderTotalWeightFilterRef.value?.validateForm()) || {}
			: {
					weight: '', // 订单总重量
			  };
		//   获取是否有买家备注数据
		const hasBuyerNoteFilterData = currentCheckList.value.includes('buyerNote')
			? (await hasBuyerNoteFilterRef.value?.validateForm()) || {}
			: {
					buyerNote: '', // 是否有买家备注
			  };
		//   获取是否定制化订单数据
		const isCustomizedOrderFilterData = currentCheckList.value.includes(
			'madeToOrder'
		)
			? (await isCustomizedOrderFilterRef.value?.validateForm()) || {}
			: {
					madeToOrder: '', // 是否定制化订单
			  };
		//   获取订单体积重量数据
		const orderVolumetricWeightFilterData = currentCheckList.value.includes(
			'volumetricWeight'
		)
			? (await orderVolumetricWeightFilterRef.value?.validateForm()) || {}
			: {
					volumetricWeight: '', // 订单体积重量
					volumetricWeightParam: '', // 材积参数
			  };
		//   获取产品尺寸数据
		const productSizeFilterData = currentCheckList.value.includes('productSize')
			? (await productSizeFilterRef.value?.validateForm()) || {}
			: {
					productSize: '', // 产品尺寸
					productSizeHtml: '', // 产品尺寸公式html
			  };

		//  获取渠道数据
		const shippingToLogisticsChannelFilterData =
			currentCheckList.value.includes('logisticsChannel')
				? (await shippingToLogisticsChannelFilterRef.value?.validateForm()) ||
				  {}
				: {
						logisticsChannel: '', // 渠道数据
				  };

		//  获取发货仓数据
		const shippingToWarehouseFilterData = currentCheckList.value.includes(
			'warehouseCode'
		)
			? (await shippingToWarehouseFilterRef.value?.validateForm()) || {}
			: {
					warehouseCode: '', // 发货仓数据
			  };

		//   获取收货国家/地区数据
		const shipToCountryRegionFilterData = currentCheckList.value.includes(
			'recipientCountry'
		)
			? (await shipToCountryRegionFilterRef.value?.validateForm()) || {}
			: {
					recipientCountry: '', // 收货国家/地区
			  };
		//   获取收货省/州数据
		const shipToStateProvinceFilterData = currentCheckList.value.includes(
			'recipientState'
		)
			? (await shipToStateProvinceFilterRef.value?.validateForm()) || {}
			: {
					recipientState: '', // 收货省/州
			  };
		//   获取收货城市数据
		const shipToCityFilterData = currentCheckList.value.includes(
			'recipientCity'
		)
			? (await shipToCityFilterRef.value?.validateForm()) || {}
			: {
					recipientCity: '', // 收货城市
			  };
		//   获取收货邮编数据
		const shipToPostalCodeFilterData = currentCheckList.value.includes(
			'recipientPostcode'
		)
			? (await shipToPostalCodeFilterRef.value?.validateForm()) || {}
			: {
					recipientPostcode: '{}', // 收货邮编
			  };
		//   获取仓库物流数据
		const warehouseAndLogisticsChannelFilterData =
			currentCheckList.value.includes('warehouseAndLogisticsChannel')
				? (await shipToThreeWarehouseAndLogisticsChannelRef.value?.validateForm()) ||
				  {}
				: {
						warehouseCode: '', // 三方仓仓库
						logisticsChannel: '', // 物流渠道
				  };
		//   获取发运级别数据
		const shippingServiceLevelFilterData = currentCheckList.value.includes(
			'shipmentPriority'
		)
			? (await shippingServiceLevelFilterRef.value?.validateForm()) || {}
			: {
					shipmentPriority: '', // 发运级别
			  };
		//   获取跟踪号数据
		const trackingNumberData = currentCheckList.value.includes(
			'logisticsTrackingNo'
		)
			? (await trackingNumberRef.value?.validateForm()) || {}
			: {
					logisticsTrackingNo: '', // 跟踪号
			  };
		//   获取实际承运人数据
		const shipToActualCarrierFilterData = currentCheckList.value.includes(
			'carrierName'
		)
			? (await shipToActualCarrierFilterRef.value?.validateForm()) || {}
			: {
					carrierName: '', // 实际承运人
			  };
		//   获取实际承运人数据
		const totalLogisticsData = currentCheckList.value.includes('totalFee')
			? (await totalLogisticsRef.value?.validateForm()) || {}
			: {
					totalFee: '', // 实际承运人
			  };
		//   获取平台仓库ID数据
		const platformWarehouseIdFilterData = currentCheckList.value.includes(
			'platformWareId'
		)
			? (await platformWarehouseIdFilterRef.value?.validateForm()) || {}
			: {
					platformWareId: '', // 平台仓库ID
			  };
		//   获取电话号/手机号数据
		const phoneMobileFilterData = currentCheckList.value.includes('phone')
			? (await phoneMobileFilterRef.value?.validateForm()) || {}
			: {
					phone: '', // 电话号/手机号
			  };
		//   获取订单MSKU数据
		const orderMSKUFilterData = currentCheckList.value.includes('mskuCode')
			? (await orderMSKUFilterRef.value?.validateForm()) || {}
			: {
					mskuCode: '', // 订单MSKU
			  };
		//   获取订单产品数据
		const orderProductFilterData = currentCheckList.value.includes('skuCode')
			? (await orderProductFilterRef.value?.validateForm()) || {}
			: {
					skuCode: '', // 订单产品
			  };
		//   获取产品品类数据
		const productCategoryFilterData = currentCheckList.value.includes(
			'category'
		)
			? (await productCategoryFilterRef.value?.validateForm()) || {}
			: {
					category: '', // 产品品类
			  };
		//   获取产品品牌数据
		const productBrandFilterData = currentCheckList.value.includes('brand')
			? (await productBrandFilterRef.value?.validateForm()) || {}
			: {
					brand: '', // 产品品牌
			  };
		//   获取特殊属性数据
		const specialAttributesFilterData = currentCheckList.value.includes(
			'specialAttribute'
		)
			? (await specialAttributesFilterRef.value?.validateForm()) || {}
			: {
					specialAttribute: '', // 特殊属性
			  };
		// console.log(' ', currentCheckList.value.includes('volumetricWeight'));
		// debugger;
		// 设定动作数据
		const actionData = (await setAction.value?.validateForm()) || {};
		const params = {
			...titleData, // 头部数据
			// 规则条件对象 (执行条件)
			ruleConditionCutOff: {
				...orderPlatformFilterData, // 订单平台数据
				...orderCountryRegionFilterData, // 店铺站点数据
				...orderStoreFilterData, // 订单店铺数据
				...orderAccessMethodFilterData, // 订单访问方式数据
				...orderPriceExTaxFilterData, // 订单售价(不含税)数据
				...orderTotalQuantityFilterData, // 订单总数量数据
				...orderTotalWeightFilterData, // 订单总重量数据
				...hasBuyerNoteFilterData, // 是否有买家备注数据
				...isCustomizedOrderFilterData, // 是否定制化订单数据
				...orderVolumetricWeightFilterData, // 订单体积重量数据
				...productSizeFilterData, // 产品尺寸数据
				...shippingToLogisticsChannelFilterData, // 渠道数据
				...shippingToWarehouseFilterData, // 发货仓数据
				...shipToCountryRegionFilterData, // 收货国家/地区数据
				...shipToStateProvinceFilterData, // 收货省/州数据
				...shipToCityFilterData, // 收货城市数据
				...shipToPostalCodeFilterData, // 收货邮编数据
				...warehouseAndLogisticsChannelFilterData, // 仓库物流数据
				...shippingServiceLevelFilterData, // 发运级别数据
				...totalLogisticsData, // 总物流费用数据
				...trackingNumberData, // 跟踪号数据
				...shipToActualCarrierFilterData, // 实际承运人数据
				...platformWarehouseIdFilterData, // 平台仓库ID数据
				...phoneMobileFilterData, // 电话号/手机号数据
				...orderMSKUFilterData, // 订单MSKU数据
				...orderProductFilterData, // 订单产品数据
				...productCategoryFilterData, // 产品品类数据
				...productBrandFilterData, // 产品品牌数据
				...specialAttributesFilterData, // 特殊属性数据
				id:
					props.visibleType === 'edit'
						? props.currentRow?.ruleConditionCutOff.id
						: undefined, // 规则条件id
				ruleId:
					props.visibleType === 'edit'
						? props.currentRow?.ruleConditionCutOff.ruleId
						: undefined, // 规则id
			},
			// 规则执行对象 (设定动作)
			ruleActionCutOff: {
				...actionData, // 设定动作数据
				id:
					props.visibleType === 'edit'
						? props.currentRow?.ruleConditionCutOff.id
						: undefined, // 规则条件id
				ruleId:
					props.visibleType === 'edit'
						? props.currentRow?.ruleConditionCutOff.ruleId
						: undefined, // 规则id
			},
			type: 'cutOff', // 确定是哪个规则单
			id: props.visibleType === 'edit' ? props.currentRow?.id : undefined, // 规则id
		};
		// 如果一个执行条件都没有（排除 id、ruleId，并忽略空值字段）
		const isEmptyConditionValue = (val: unknown): boolean => {
			if (val === null || val === undefined) return true;
			if (typeof val === 'string') {
				const v = val.trim();
				return v === '' || v === '{}' || v === '[]';
			}
			if (Array.isArray(val)) return val.length === 0;
			if (typeof val === 'object') {
				const obj = val as Record<string, unknown>;
				const keys = Object.keys(obj);
				if (keys.length === 0) return true;
				// 递归判断对象内部是否也全为空
				return keys.every((k) => isEmptyConditionValue(obj[k]));
			}
			return false;
		};
		const hasAnyCondition = Object.entries(params.ruleConditionCutOff).some(
			([key, val]) =>
				!['id', 'ruleId'].includes(key) && !isEmptyConditionValue(val)
		);
		if (!hasAnyCondition) {
			useMessage().error('请选择执行条件');
			return;
		}

		const api =
			props.visibleType === 'add'
				? postRuleConditionAcceptSave
				: props.visibleType === 'copy'
				? postRuleConditionAcceptSave
				: props.visibleType === 'edit'
				? postRuleConditionAcceptUpdate
				: () => {
						throw new Error('未知的操作');
				  };

		const res = await api({
			...params,
		});
		if (res.code === 0) {
			useMessage().success(t('操作成功'));
			// 刷新列表
			emit('getDataList');
			// 关闭对话框
			dialogVisible.value = false;
		}
	} catch (error: any) {
		// eslint-disable-next-line no-console
		console.log(error, '----');
		if (isString(error)) {
			useMessage().error(error);
		} else {
			useMessage().error(t('请检查'));
		}
	}
};
/**
 * 打开弹窗方法
 * 供父组件调用
 */
const show = () => {
	dialogVisible.value = true;
};

/**
 * 关闭弹窗方法
 * 供父组件调用
 */
const hide = () => {
	dialogVisible.value = false;
};

// 暴露方法给父组件
defineExpose({
	show,
	hide,
});
</script>

<template>
	<el-dialog
		draggable
		ref="dialogRef"
		v-model="dialogVisible"
		:width="'90%'"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:append-to-body="true"
		@open="init"
		@close="hide"
		:title="
			t(
				`${
					props.visibleType == 'add'
						? '新增'
						: props.visibleType === 'edit'
						? '编辑'
						: props.visibleType === 'copy'
						? '复制'
						: ''
				}规则-截单规则`
			)
		"
	>
		<div class="rule-model">
			<el-row class="rule-title">
				<el-col :span="24">
					<ModelTitle ref="modelTitleRef" :modelTitle="t('截单规则')" />
				</el-col>
			</el-row>
			<el-row class="rule-content" :gutter="20">
				<el-col :span="5" class="rule-list">
					<ModelList
						ref="modelListRef"
						@setCheckList="setCheckList"
						:option-groups="optionsGroups"
					/>
				</el-col>
				<el-col :span="19" class="rule-info">
					<el-row
						class="title"
						v-show="
							currentCheckList?.includes('platformChannel') ||
							currentCheckList?.includes('site') ||
							currentCheckList?.includes('store') ||
							currentCheckList?.includes('orderFrom') ||
							currentCheckList?.includes('sellingPrice') ||
							currentCheckList?.includes('totalNumber') ||
							currentCheckList?.includes('weight') ||
							currentCheckList?.includes('buyerNote') ||
							currentCheckList?.includes('madeToOrder') ||
							currentCheckList?.includes('volumetricWeight') ||
							currentCheckList?.includes('productSize')
						"
					>
						<el-col :span="24"> {{ t('基础信息') }} </el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('platformChannel')">
						<el-col :span="24">
							<!-- 订单平台 -->
							<OrderPlatformFilter ref="orderPlatformFilterRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('site')">
						<el-col :span="24">
							<!-- 店铺站点 -->
							<OrderCountryRegionFilter ref="orderCountryRegionFilterRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('store')">
						<el-col :span="24">
							<!-- 订单店铺 -->
							<OrderStoreFilter ref="orderStoreFilterRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('orderFrom')">
						<el-col :span="24">
							<!-- 订单接入方式 -->
							<OrderAccessMethodFilter ref="orderAccessMethodFilterRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('sellingPrice')">
						<el-col :span="24">
							<!-- 订单售价(不含税) -->
							<OrderPriceExTaxFilter ref="orderPriceExTaxFilterRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('totalNumber')">
						<el-col :span="24">
							<!-- 订单总数量 -->
							<OrderTotalQuantityFilter ref="orderTotalQuantityFilterRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('weight')">
						<el-col :span="24">
							<!-- 订单总重量 -->
							<OrderTotalWeightFilter ref="orderTotalWeightFilterRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('buyerNote')">
						<el-col :span="24">
							<!-- 是否有买家备注 -->
							<HasBuyerNoteFilter ref="hasBuyerNoteFilterRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('madeToOrder')">
						<el-col :span="24">
							<!-- 是否定制化订单 -->
							<IsCustomizedOrderFilter ref="isCustomizedOrderFilterRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('volumetricWeight')">
						<el-col :span="24">
							<!-- 订单体积重ref -->
							<OrderVolumetricWeightFilter
								ref="orderVolumetricWeightFilterRef"
							/>
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('productSize')">
						<el-col :span="24">
							<!-- 产品尺寸 -->
							<ProductSizeFilter ref="productSizeFilterRef" />
						</el-col>
					</el-row>
					<el-row
						class="title"
						v-show="
							currentCheckList?.includes('logisticsChannel') ||
							currentCheckList?.includes('warehouseCode') ||
							currentCheckList?.includes('recipientCountry') ||
							currentCheckList?.includes('recipientState') ||
							currentCheckList?.includes('recipientCity') ||
							currentCheckList?.includes('recipientPostcode') ||
							currentCheckList?.includes('warehouseAndLogisticsChannel') ||
							currentCheckList?.includes('shipmentPriority') ||
							currentCheckList?.includes('logisticsTrackingNo') ||
							currentCheckList?.includes('totalFee') ||
							currentCheckList?.includes('carrierName') ||
							currentCheckList?.includes('platformWareId') ||
							currentCheckList?.includes('phone')
						"
					>
						<el-col :span="24"> {{ t('仓库物流') }} </el-col>
					</el-row>

					<el-row v-show="currentCheckList?.includes('logisticsChannel')">
						<el-col :span="24">
							<!-- 物流渠道 -->
							<!-- <shippingToLogisticsChannelFilter ref="shippingToLogisticsChannelFilterRef" /> -->
						</el-col>
					</el-row>

					<!-- <el-row v-show="currentCheckList?.includes('warehouseCode')"> -->
					<!-- <el-col :span="24"> -->
					<!-- 发货仓库 -->
					<!-- <shippingToWarehouseFilter ref="shippingToWarehouseFilterRef" /> -->
					<!-- </el-col> -->
					<!-- </el-row> -->

					<el-row v-show="currentCheckList?.includes('recipientCountry')">
						<el-col :span="24">
							<!-- 收货国家/地区 -->
							<ShipToCountryRegionFilter ref="shipToCountryRegionFilterRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('recipientState')">
						<el-col :span="24">
							<!-- 收货省/州 -->
							<ShipToStateProvinceFilter ref="shipToStateProvinceFilterRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('recipientCity')">
						<el-col :span="24">
							<!-- 收货城市 -->
							<ShipToCityFilter ref="shipToCityFilterRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('recipientPostcode')">
						<el-col :span="24">
							<!-- 收货邮编 -->
							<ShipToPostalCodeFilter ref="shipToPostalCodeFilterRef" />
						</el-col>
					</el-row>
					<el-row
						v-show="currentCheckList?.includes('warehouseAndLogisticsChannel')"
					>
						<el-col :span="24">
							<!-- 仓库物流 -->
							<ShipToThreeWarehouseAndLogisticsChannel
								ref="shipToThreeWarehouseAndLogisticsChannelRef"
							/>
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('shipmentPriority')">
						<el-col :span="24">
							<!-- 发运级别 -->
							<ShippingServiceLevelFilter ref="shippingServiceLevelFilterRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('logisticsTrackingNo')">
						<el-col :span="24">
							<!-- 跟踪号 -->
							<trackingNumber ref="trackingNumberRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('totalFee')">
						<el-col :span="24">
							<!-- 物流总价 -->
							<TotalLogistics ref="totalLogisticsRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('carrierName')">
						<el-col :span="24">
							<!-- 实际承运人 -->
							<ShipToActualCarrierFilter ref="shipToActualCarrierFilterRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('platformWareId')">
						<el-col :span="24">
							<!-- 平台仓库ID -->
							<PlatformWarehouseIdFilter ref="platformWarehouseIdFilterRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('phone')">
						<el-col :span="24">
							<!-- 电话号/手机号 -->
							<PhoneMobileFilter ref="phoneMobileFilterRef" />
						</el-col>
					</el-row>
					<el-row
						class="title"
						v-show="
							currentCheckList?.includes('mskuCode') ||
							currentCheckList?.includes('skuCode') ||
							currentCheckList?.includes('category') ||
							currentCheckList?.includes('brand') ||
							currentCheckList?.includes('specialAttribute') ||
							currentCheckList?.includes('orderFrom')
						"
					>
						<el-col :span="24"> {{ t('订单') }} </el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('mskuCode')">
						<el-col :span="24">
							<!-- 订单MSKU -->
							<OrderMSKUFilter ref="orderMSKUFilterRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('skuCode')">
						<el-col :span="24">
							<!-- 订单产品 -->
							<OrderProductFilter ref="orderProductFilterRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('category')">
						<el-col :span="24">
							<!-- 订单产品品类 -->
							<ProductCategoryFilter ref="productCategoryFilterRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('brand')">
						<el-col :span="24">
							<!-- 订单产品品牌 -->
							<ProductBrandFilter ref="productBrandFilterRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('specialAttribute')">
						<el-col :span="24">
							<!-- 订单特殊属性 -->
							<SpecialAttributesFilter ref="specialAttributesFilterRef" />
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<!-- 设定动作 -->
							<SetAction ref="setAction" />
						</el-col>
					</el-row>
				</el-col>
			</el-row>
		</div>

		<template #footer>
			<div style="text-align: right">
				<el-button @click="hide">{{ t('取消') }}</el-button>
				<el-button type="primary" @click="onSubmit">{{ t('确定') }}</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<style scoped lang="scss">
.rule-model {
	height: 100%;
	.rule-title {
		margin-bottom: 20px;
		border-bottom: 1px solid #f0f0f0;
	}
	.rule-content {
		height: 100%;
		.rule-list {
			height: 100%;
			padding-right: 10px;
		}
		.rule-info {
			padding-left: 10px;
			height: 600px;
			overflow: auto;
			.title {
				font-size: 16px;
				font-weight: 500;
			}
		}
	}
}
</style>
