/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-13 10:25:00
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-12-12 18:39:03
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\orderAuditRule\components\rule-model\utils\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { useWaitForRefsReady } from '/@/hooks/nextTick';
import { useMessage } from '/@/hooks/message';
export const initFn = async (
	props: { currentRow: any; visibleType: string },
	refs: {
		modelTitleRef: any; // model标题ref
		modelListRef: any; // model列表ref
		orderPlatformFilterRef: any; // 订单平台ref
		orderCountryRegionFilterRef: any; // 店铺站点ref
		orderStoreFilterRef: any; // 订单店铺ref
		orderAccessMethodFilterRef: any; // 订单访问方式ref
		orderPriceExTaxFilterRef: any; // 订单售价(不含税)ref
		orderTotalQuantityFilterRef: any; // 订单总数量ref
		orderTotalWeightFilterRef: any; // 订单总重量ref
		hasBuyerNoteFilterRef: any; // 是否有买家留言ref
		isCustomizedOrderFilterRef: any; // 是否定制订单ref
		orderVolumetricWeightFilterRef: any; // 订单体积重量ref
		productSizeFilterRef: any; // 商品尺寸ref
		shipToCountryRegionFilterRef: any; // 收件人国家/地区ref
		shipToStateProvinceFilterRef: any; // 收件人州/省ref
		shipToCityFilterRef: any; // 收件人城市ref
		shipToPostalCodeFilterRef: any; // 收件人邮编ref
		shippingServiceLevelFilterRef: any; // 运输服务等级ref
		platformWarehouseIdFilterRef: any; // 平台仓库ref
		phoneMobileFilterRef: any; // 手机号码ref
		shipToTotalFeeRef: any; // 比价结果ref
		shippingCostToPriceRef: any; // 运费售价比上限ref
		shipToThreeWarehouseAndLogisticsChannelRef: any; // 三方仓物流渠道ref
		orderMSKUFilterRef: any; // 订单MSKUref
		orderProductFilterRef: any; // 订单商品ref
		productCategoryFilterRef: any; // 商品类目ref
		productBrandFilterRef: any; // 商品品牌ref
		specialAttributesFilterRef: any; // 特殊属性ref
		setAction: any; // 设置操作ref
	}
) => {
	const isReady = await useWaitForRefsReady([
		refs.modelTitleRef,
		refs.modelListRef,
		refs.orderPlatformFilterRef,
		refs.orderCountryRegionFilterRef,
		refs.orderStoreFilterRef,
		refs.orderAccessMethodFilterRef,
		refs.orderPriceExTaxFilterRef,
		refs.orderTotalQuantityFilterRef,
		refs.orderTotalWeightFilterRef,
		refs.hasBuyerNoteFilterRef,
		refs.isCustomizedOrderFilterRef,
		refs.orderVolumetricWeightFilterRef,
		refs.productSizeFilterRef,
		refs.shipToCountryRegionFilterRef,
		refs.shipToStateProvinceFilterRef,
		refs.shipToCityFilterRef,
		refs.shipToPostalCodeFilterRef,
		refs.shippingServiceLevelFilterRef,
		refs.platformWarehouseIdFilterRef,
		refs.phoneMobileFilterRef,
		refs.shipToTotalFeeRef,
		refs.shippingCostToPriceRef,
		refs.shipToThreeWarehouseAndLogisticsChannelRef,
		refs.orderMSKUFilterRef,
		refs.orderProductFilterRef,
		refs.productCategoryFilterRef,
		refs.productBrandFilterRef,
		refs.specialAttributesFilterRef,
		refs.setAction,
	]);
	if (!isReady) {
		useMessage().error('组件未加载完成，请稍后再试');
	}
	const init = () => {
		// 初始化 清除数据
		// 设置  title 组件ref
		refs.modelTitleRef.value.init();
		// 设置  list 组件ref
		refs.modelListRef.value.init();
		// 设置 订单平台ref
		refs.orderPlatformFilterRef.value.init();
		// 设置 店铺站点ref
		refs.orderCountryRegionFilterRef.value.init();
		// 设置 订单店铺ref
		refs.orderStoreFilterRef.value.init();
		// 设置 订单访问方式ref
		refs.orderAccessMethodFilterRef.value.init();
		// 设置 订单售价(不含税)ref
		refs.orderPriceExTaxFilterRef.value.init();
		// 设置 订单总数量ref
		refs.orderTotalQuantityFilterRef.value.init();
		// 设置 订单总重量ref
		refs.orderTotalWeightFilterRef.value.init();
		// 设置 是否有买家备注ref
		refs.hasBuyerNoteFilterRef.value.init();
		// 设置 是否定制订单ref
		refs.isCustomizedOrderFilterRef.value.init();
		// 设置 订单体积重量ref
		refs.orderVolumetricWeightFilterRef.value.init();
		// 设置 商品尺寸ref
		refs.productSizeFilterRef.value.init();
		// 设置 收件人国家/地区ref
		refs.shipToCountryRegionFilterRef.value.init();
		// 设置 收件人州/省ref
		refs.shipToStateProvinceFilterRef.value.init();
		// 设置 收件人城市ref
		refs.shipToCityFilterRef.value.init();
		// 设置 收件人邮编ref
		refs.shipToPostalCodeFilterRef.value.init();
		// 设置 发运级别ref
		refs.shippingServiceLevelFilterRef.value.init();
		// 设置 平台仓库ref
		refs.platformWarehouseIdFilterRef.value.init();
		// 设置 电话号/手机号ref
		refs.phoneMobileFilterRef.value.init();
		// 设置 比价结果ref
		refs.shipToTotalFeeRef.value.init();
		// 设置 运费售价比上限ref
		refs.shippingCostToPriceRef.value.init();
		// 设置 仓库物流ref
		refs.shipToThreeWarehouseAndLogisticsChannelRef.value.init();
		// 设置 订单MSKUref
		refs.orderMSKUFilterRef.value.init();
		// 设置 订单商品ref
		refs.orderProductFilterRef.value.init();
		// 设置 产品品类ref
		refs.productCategoryFilterRef.value.init();
		// 设置 产品品牌ref
		refs.productBrandFilterRef.value.init();
		// 设置 特殊属性ref
		refs.specialAttributesFilterRef.value.init();
		// 设置 底部操作ref
		refs.setAction.value.init();
		return;
	};
	if (props.visibleType === 'add') {
		init();
	} else if (props.visibleType === 'edit') {
		init();
		// 编辑 回显数据
		// 设置  title 组件ref
		refs.modelTitleRef.value.setFormData({
			name: props.currentRow.name || '', // 规则名称
			status: props.currentRow.status || '0', // 规则状态
			effectiveTime: props.currentRow.effectiveTime || '', // 规则生效时间
			description: props.currentRow.description || '', // 规则描述
		});
		// 设置  list 组件ref
		refs.modelListRef.value.setCheckList(getCheckList(props));
		// 设置  订单平台ref
		refs.orderPlatformFilterRef.value.setFormData({
			platformChannel:
				props.currentRow.ruleConditionReview?.platformChannel || '',
		});
		// 设置 店铺站点ref
		refs.orderCountryRegionFilterRef.value.setFormData({
			site: props.currentRow.ruleConditionReview?.site || '',
		});
		// 设置 订单店铺ref
		refs.orderStoreFilterRef.value.setFormData({
			store: props.currentRow.ruleConditionReview?.store || '',
		});
		// 设置 订单访问方式ref
		refs.orderAccessMethodFilterRef.value.setFormData({
			orderFrom: props.currentRow.ruleConditionReview?.orderFrom || '',
		});
		// 设置 订单售价(不含税)ref
		refs.orderPriceExTaxFilterRef.value.setFormData({
			sellingPrice: props.currentRow.ruleConditionReview?.sellingPrice || '',
		});
		// 设置 订单总数量ref
		refs.orderTotalQuantityFilterRef.value.setFormData({
			totalNumber: props.currentRow.ruleConditionReview?.totalNumber || '',
		});
		// 设置 订单总重量ref
		refs.orderTotalWeightFilterRef.value.setFormData({
			weight: props.currentRow.ruleConditionReview?.weight || '',
		});
		// 设置 是否有买家备注ref
		refs.hasBuyerNoteFilterRef.value.setFormData({
			buyerNote: props.currentRow.ruleConditionReview?.buyerNote || '',
		});
		// 设置 是否定制订单ref
		refs.isCustomizedOrderFilterRef.value.setFormData({
			madeToOrder: props.currentRow.ruleConditionReview?.madeToOrder || '',
		});
		// 设置 订单体积重量ref
		refs.orderVolumetricWeightFilterRef.value.setFormData({
			volumetricWeight:
				props.currentRow.ruleConditionReview?.volumetricWeight || '',
			volumetricWeightParam:
				props.currentRow.ruleConditionReview?.volumetricWeightParam || '',
		});
		// 设置 商品尺寸ref
		refs.productSizeFilterRef.value.setFormData({
			productSize: props.currentRow.ruleConditionReview?.productSize || '',
			productSizeHtml:
				props.currentRow.ruleConditionReview?.productSizeHtml || '',
		});
		// 设置 收件人国家/地区ref
		refs.shipToCountryRegionFilterRef.value.setFormData({
			recipientCountry:
				props.currentRow.ruleConditionReview?.recipientCountry || '',
		});
		// 设置 收件人州/省ref
		refs.shipToStateProvinceFilterRef.value.setFormData({
			recipientState:
				props.currentRow.ruleConditionReview?.recipientState || '',
		});
		// 设置 收件人城市ref
		refs.shipToCityFilterRef.value.setFormData({
			recipientCity: props.currentRow.ruleConditionReview?.recipientCity || '',
		});
		// 设置 收件人邮编ref
		refs.shipToPostalCodeFilterRef.value.setFormData({
			recipientPostcode:
				props.currentRow.ruleConditionReview?.recipientPostcode || '',
		});
		// 设置 发运级别ref
		refs.shippingServiceLevelFilterRef.value.setFormData({
			shipmentPriority:
				props.currentRow.ruleConditionReview?.shipmentPriority || '',
		});
		// 设置 平台仓库ref
		refs.platformWarehouseIdFilterRef.value.setFormData({
			platformWareId:
				props.currentRow.ruleConditionReview?.platformWareId || '',
		});
		// 设置 电话号/手机号ref
		refs.phoneMobileFilterRef.value.setFormData({
			phone: props.currentRow.ruleConditionReview?.phone || '',
		});
		// 设置 比价结果ref
		refs.shipToTotalFeeRef.value.setFormData({
			calFee: props.currentRow.ruleConditionReview?.calFee || '',
		});
		// 设置 运费售价比上限ref
		refs.shippingCostToPriceRef.value.setFormData({
			shippingCostToPrice:
				props.currentRow.ruleConditionReview?.shippingCostToPrice || '',
		});
		// 设置 仓库物流ref
		refs.shipToThreeWarehouseAndLogisticsChannelRef.value.setFormData({
			warehouseCode: props.currentRow.ruleConditionReview?.warehouseCode || '',
			logisticsChannel:
				props.currentRow.ruleConditionReview?.logisticsChannel || '',
		});
		// 设置 订单MSKUref
		refs.orderMSKUFilterRef.value.setFormData({
			mskuCode: props.currentRow.ruleConditionReview?.mskuCode || '',
		});
		// 设置 订单商品ref
		refs.orderProductFilterRef.value.setFormData({
			skuCode: props.currentRow.ruleConditionReview?.skuCode || '',
		});
		// 设置 产品品类ref
		refs.productCategoryFilterRef.value.setFormData({
			category: props.currentRow.ruleConditionReview?.category || '',
		});
		// 设置 产品品牌ref
		refs.productBrandFilterRef.value.setFormData({
			brand: props.currentRow.ruleConditionReview?.brand || '',
		});
		// 设置 特殊属性ref
		refs.specialAttributesFilterRef.value.setFormData({
			specialAttribute:
				props.currentRow.ruleConditionReview?.specialAttribute || '',
		});
		// 设置 底部操作ref
		refs.setAction.value.setFormData({
			autoFlag: props.currentRow.ruleActionReview.autoFlag || 0, // 是否自动
			tagInfoVOS: props.currentRow.ruleActionReview.tagInfoVOS || [], // 标签信息
		});
	} else if (props.visibleType === 'copy') {
		init();
		// 编辑 回显数据
		// 设置  title 组件ref
		refs.modelTitleRef.value.setFormData({
			name: props.currentRow.name ? `${props.currentRow.name}-副本` : '', // 规则名称
			status: props.currentRow.status || 0, // 规则状态
			effectiveTime: props.currentRow.effectiveTime || '', // 规则生效时间
			description: props.currentRow.description || '', // 规则描述
		});
		// 设置  list 组件ref
		refs.modelListRef.value.setCheckList(getCheckList(props));
		// 设置  订单平台ref
		refs.orderPlatformFilterRef.value.setFormData({
			platformChannel:
				props.currentRow.ruleConditionReview?.platformChannel || '',
		});
		// 设置 店铺站点ref
		refs.orderCountryRegionFilterRef.value.setFormData({
			site: props.currentRow.ruleConditionReview?.site || '',
		});
		// 设置 订单店铺ref
		refs.orderStoreFilterRef.value.setFormData({
			store: props.currentRow.ruleConditionReview?.store || '',
		});
		// 设置 订单访问方式ref
		refs.orderAccessMethodFilterRef.value.setFormData({
			orderFrom: props.currentRow.ruleConditionReview?.orderFrom || '',
		});
		// 设置 订单售价(不含税)ref
		refs.orderPriceExTaxFilterRef.value.setFormData({
			sellingPrice: props.currentRow.ruleConditionReview?.sellingPrice || '',
		});
		// 设置 订单总数量ref
		refs.orderTotalQuantityFilterRef.value.setFormData({
			totalNumber: props.currentRow.ruleConditionReview?.totalNumber || '',
		});
		// 设置 订单总重量ref
		refs.orderTotalWeightFilterRef.value.setFormData({
			weight: props.currentRow.ruleConditionReview?.weight || '',
		});
		// 设置 是否有买家备注ref
		refs.hasBuyerNoteFilterRef.value.setFormData({
			buyerNote: props.currentRow.ruleConditionReview?.buyerNote || '',
		});
		// 设置 是否定制订单ref
		refs.isCustomizedOrderFilterRef.value.setFormData({
			madeToOrder: props.currentRow.ruleConditionReview?.madeToOrder || '',
		});
		// 设置 订单体积重量ref
		refs.orderVolumetricWeightFilterRef.value.setFormData({
			volumetricWeight:
				props.currentRow.ruleConditionReview?.volumetricWeight || '',
			volumetricWeightParam:
				props.currentRow.ruleConditionReview?.volumetricWeightParam || '',
		});
		// 设置 商品尺寸ref
		refs.productSizeFilterRef.value.setFormData({
			productSize: props.currentRow.ruleConditionReview?.productSize || '',
			productSizeHtml:
				props.currentRow.ruleConditionReview?.productSizeHtml || '',
		});
		// 设置 收件人国家/地区ref
		refs.shipToCountryRegionFilterRef.value.setFormData({
			recipientCountry:
				props.currentRow.ruleConditionReview?.recipientCountry || '',
		});
		// 设置 收件人州/省ref
		refs.shipToStateProvinceFilterRef.value.setFormData({
			recipientState:
				props.currentRow.ruleConditionReview?.recipientState || '',
		});
		// 设置 收件人城市ref
		refs.shipToCityFilterRef.value.setFormData({
			recipientCity: props.currentRow.ruleConditionReview?.recipientCity || '',
		});
		// 设置 收件人邮编ref
		refs.shipToPostalCodeFilterRef.value.setFormData({
			recipientPostcode:
				props.currentRow.ruleConditionReview?.recipientPostcode || '',
		});
		// 设置 发运级别ref
		refs.shippingServiceLevelFilterRef.value.setFormData({
			shipmentPriority:
				props.currentRow.ruleConditionReview?.shipmentPriority || '',
		});
		// 设置 平台仓库ref
		refs.platformWarehouseIdFilterRef.value.setFormData({
			platformWareId:
				props.currentRow.ruleConditionReview?.platformWareId || '',
		});
		// 设置 电话号/手机号ref
		refs.phoneMobileFilterRef.value.setFormData({
			phone: props.currentRow.ruleConditionReview?.phone || '',
		});
		// 设置 比价结果ref
		refs.shipToTotalFeeRef.value.setFormData({
			calFee: props.currentRow.ruleConditionReview?.calFee || '',
		});
		// 设置 运费售价比上限ref
		refs.shippingCostToPriceRef.value.setFormData({
			shippingCostToPrice:
				props.currentRow.ruleConditionReview?.shippingCostToPrice || '',
		});
		// 设置 仓库物流ref
		refs.shipToThreeWarehouseAndLogisticsChannelRef.value.setFormData({
			warehouseCode: props.currentRow.ruleConditionReview?.warehouseCode || '',
			logisticsChannel:
				props.currentRow.ruleConditionReview?.logisticsChannel || '',
		});
		// 设置 订单MSKUref
		refs.orderMSKUFilterRef.value.setFormData({
			mskuCode: props.currentRow.ruleConditionReview?.mskuCode || '',
		});
		// 设置 订单商品ref
		refs.orderProductFilterRef.value.setFormData({
			skuCode: props.currentRow.ruleConditionReview?.skuCode || '',
		});
		// 设置 产品品类ref
		refs.productCategoryFilterRef.value.setFormData({
			category: props.currentRow.ruleConditionReview?.category || '',
		});
		// 设置 产品品牌ref
		refs.productBrandFilterRef.value.setFormData({
			brand: props.currentRow.ruleConditionReview?.brand || '',
		});
		// 设置 特殊属性ref
		refs.specialAttributesFilterRef.value.setFormData({
			specialAttribute:
				props.currentRow.ruleConditionReview?.specialAttribute || '',
		});
		// 设置 底部操作ref
		refs.setAction.value.setFormData({
			autoFlag: props.currentRow.ruleActionReview.autoFlag || 0, // 是否自动
			tagInfoVOS: props.currentRow.ruleActionReview.tagInfoVOS || [], // 标签信息
		});
	}
	return;
};
const getCheckList = (props: { currentRow: any }) => {
	const checkList: string[] = [];
	// 订单平台
	if (props.currentRow?.ruleConditionReview?.platformChannel) {
		checkList.push('platformChannel');
	}
	// 店铺站点
	if (props.currentRow?.ruleConditionReview?.site) {
		checkList.push('site');
	}
	// 订单店铺
	if (props.currentRow?.ruleConditionReview?.store) {
		checkList.push('store');
	}
	// 订单访问方式
	if (props.currentRow?.ruleConditionReview?.orderFrom) {
		checkList.push('orderFrom');
	}
	// 订单售价(不含税)
	if (props.currentRow?.ruleConditionReview?.sellingPrice) {
		checkList.push('sellingPrice');
	}
	// 订单总数量
	if (props.currentRow?.ruleConditionReview?.totalNumber) {
		checkList.push('totalNumber');
	}
	// 订单总重量
	if (props.currentRow?.ruleConditionReview?.weight) {
		checkList.push('weight');
	}
	// 是否有买家备注
	if (props.currentRow?.ruleConditionReview?.buyerNote) {
		checkList.push('buyerNote');
	}
	// 是否定制订单
	if (props.currentRow?.ruleConditionReview?.madeToOrder) {
		checkList.push('madeToOrder');
	}
	// 订单体积重量
	if (
		props.currentRow?.ruleConditionReview?.volumetricWeight &&
		props.currentRow?.ruleConditionReview?.volumetricWeightParam
	) {
		checkList.push('volumetricWeight');
	}
	// 商品尺寸
	if (
		props.currentRow?.ruleConditionReview?.productSize &&
		props.currentRow?.ruleConditionReview?.productSizeHtml
	) {
		checkList.push('productSize');
	}
	// 收件人国家/地区
	if (props.currentRow?.ruleConditionReview?.recipientCountry) {
		checkList.push('recipientCountry');
	}
	// 收件人州/省
	if (props.currentRow?.ruleConditionReview?.recipientState) {
		checkList.push('recipientState');
	}
	// 收件人城市
	if (props.currentRow?.ruleConditionReview?.recipientCity) {
		checkList.push('recipientCity');
	}
	// 收件人邮编
	if (
		props.currentRow?.ruleConditionReview?.recipientPostcode &&
		props.currentRow?.ruleConditionReview?.recipientPostcode !== '{}'
	) {
		checkList.push('recipientPostcode');
	}
	// 发运级别
	if (props.currentRow?.ruleConditionReview?.shipmentPriority) {
		checkList.push('shipmentPriority');
	}
	// 平台仓库ID
	if (props.currentRow?.ruleConditionReview?.platformWareId) {
		checkList.push('platformWareId');
	}
	// 电话号/手机号ref
	if (props.currentRow?.ruleConditionReview?.platformWareId) {
		checkList.push('platformWareId');
	}
	// 电话号/手机号ref
	if (props.currentRow?.ruleConditionReview?.phone) {
		checkList.push('phone');
	}
	// 比价结果ref
	if (props.currentRow?.ruleConditionReview?.calFee) {
		checkList.push('totalFee');
	}
	// 运费售价比上限ref
	if (props.currentRow?.ruleConditionReview?.shippingCostToPrice) {
		checkList.push('shippingCostToPrice');
	}
	// 仓库物流ref
	if (
		props.currentRow?.ruleConditionReview?.warehouseCode ||
		props.currentRow?.ruleConditionReview?.logisticsChannel
	) {
		checkList.push('warehouseAndLogisticsChannel');
	}
	// 订单MSKUref
	if (props.currentRow?.ruleConditionReview?.mskuCode) {
		checkList.push('mskuCode');
	}
	// 订单商品ref
	if (props.currentRow?.ruleConditionReview?.skuCode) {
		checkList.push('skuCode');
	}
	// 产品品类ref
	if (props.currentRow?.ruleConditionReview?.category) {
		checkList.push('category');
	}
	// 产品品牌ref
	if (props.currentRow?.ruleConditionReview?.brand) {
		checkList.push('brand');
	}
	// 特殊属性ref
	if (props.currentRow?.ruleConditionReview?.specialAttribute) {
		checkList.push('specialAttribute');
	}
	return checkList;
};
