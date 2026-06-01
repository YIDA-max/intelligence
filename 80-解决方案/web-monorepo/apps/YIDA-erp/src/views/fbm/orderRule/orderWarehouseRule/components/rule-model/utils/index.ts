/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-13 10:25:00
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-13 16:53:20
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\orderConfirmRule\components\rule-model\utils\index.ts
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
				props.currentRow.ruleConditionWarehouseVO?.platformChannel || '',
		});
		// 设置 店铺站点ref
		refs.orderCountryRegionFilterRef.value.setFormData({
			site: props.currentRow.ruleConditionWarehouseVO?.site || '',
		});
		// 设置 订单店铺ref
		refs.orderStoreFilterRef.value.setFormData({
			store: props.currentRow.ruleConditionWarehouseVO?.store || '',
		});
		// 设置 订单访问方式ref
		refs.orderAccessMethodFilterRef.value.setFormData({
			orderFrom: props.currentRow.ruleConditionWarehouseVO?.orderFrom || '',
		});
		// 设置 订单售价(不含税)ref
		refs.orderPriceExTaxFilterRef.value.setFormData({
			sellingPrice:
				props.currentRow.ruleConditionWarehouseVO?.sellingPrice || '',
		});
		// 设置 订单总数量ref
		refs.orderTotalQuantityFilterRef.value.setFormData({
			totalNumber: props.currentRow.ruleConditionWarehouseVO?.totalNumber || '',
		});
		// 设置 订单总重量ref
		refs.orderTotalWeightFilterRef.value.setFormData({
			weight: props.currentRow.ruleConditionWarehouseVO?.weight || '',
		});
		// 设置 是否有买家备注ref
		refs.hasBuyerNoteFilterRef.value.setFormData({
			buyerNote: props.currentRow.ruleConditionWarehouseVO?.buyerNote || '',
		});
		// 设置 是否定制订单ref
		refs.isCustomizedOrderFilterRef.value.setFormData({
			madeToOrder: props.currentRow.ruleConditionWarehouseVO?.madeToOrder || '',
		});
		// 设置 订单体积重量ref
		refs.orderVolumetricWeightFilterRef.value.setFormData({
			volumetricWeight:
				props.currentRow.ruleConditionWarehouseVO?.volumetricWeight || '',
			volumetricWeightParam:
				props.currentRow.ruleConditionWarehouseVO?.volumetricWeightParam || '',
		});
		// 设置 商品尺寸ref
		refs.productSizeFilterRef.value.setFormData({
			productSize: props.currentRow.ruleConditionWarehouseVO?.productSize || '',
			productSizeHtml:
				props.currentRow.ruleConditionWarehouseVO?.productSizeHtml || '',
		});
		// 设置 收件人国家/地区ref
		refs.shipToCountryRegionFilterRef.value.setFormData({
			recipientCountry:
				props.currentRow.ruleConditionWarehouseVO?.recipientCountry || '',
		});
		// 设置 收件人州/省ref
		refs.shipToStateProvinceFilterRef.value.setFormData({
			recipientState:
				props.currentRow.ruleConditionWarehouseVO?.recipientState || '',
		});
		// 设置 收件人城市ref
		refs.shipToCityFilterRef.value.setFormData({
			recipientCity:
				props.currentRow.ruleConditionWarehouseVO?.recipientCity || '',
		});
		// 设置 收件人邮编ref
		refs.shipToPostalCodeFilterRef.value.setFormData({
			recipientPostcode:
				props.currentRow.ruleConditionWarehouseVO?.recipientPostcode || '',
		});
		// 设置 发运级别ref
		refs.shippingServiceLevelFilterRef.value.setFormData({
			shipmentPriority:
				props.currentRow.ruleConditionWarehouseVO?.shipmentPriority || '',
		});
		// 设置 平台仓库ref
		refs.platformWarehouseIdFilterRef.value.setFormData({
			platformWareId:
				props.currentRow.ruleConditionWarehouseVO?.platformWareId || '',
		});
		// 设置 电话号/手机号ref
		refs.phoneMobileFilterRef.value.setFormData({
			phone: props.currentRow.ruleConditionWarehouseVO?.phone || '',
		});
		// 设置 订单MSKUref
		refs.orderMSKUFilterRef.value.setFormData({
			mskuCode: props.currentRow.ruleConditionWarehouseVO?.mskuCode || '',
		});
		// 设置 订单商品ref
		refs.orderProductFilterRef.value.setFormData({
			skuCode: props.currentRow.ruleConditionWarehouseVO?.skuCode || '',
		});
		// 设置 产品品类ref
		refs.productCategoryFilterRef.value.setFormData({
			category: props.currentRow.ruleConditionWarehouseVO?.category || '',
		});
		// 设置 产品品牌ref
		refs.productBrandFilterRef.value.setFormData({
			brand: props.currentRow.ruleConditionWarehouseVO?.brand || '',
		});
		// 设置 特殊属性ref
		refs.specialAttributesFilterRef.value.setFormData({
			specialAttribute:
				props.currentRow.ruleConditionWarehouseVO?.specialAttribute || '',
		});
		// 设置 底部操作ref
		refs.setAction.value.setFormData(props.currentRow.ruleActionWarehouseVO);
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
				props.currentRow.ruleConditionWarehouseVO?.platformChannel || '',
		});
		// 设置 店铺站点ref
		refs.orderCountryRegionFilterRef.value.setFormData({
			site: props.currentRow.ruleConditionWarehouseVO?.site || '',
		});
		// 设置 订单店铺ref
		refs.orderStoreFilterRef.value.setFormData({
			store: props.currentRow.ruleConditionWarehouseVO?.store || '',
		});
		// 设置 订单访问方式ref
		refs.orderAccessMethodFilterRef.value.setFormData({
			orderFrom: props.currentRow.ruleConditionWarehouseVO?.orderFrom || '',
		});
		// 设置 订单售价(不含税)ref
		refs.orderPriceExTaxFilterRef.value.setFormData({
			sellingPrice:
				props.currentRow.ruleConditionWarehouseVO?.sellingPrice || '',
		});
		// 设置 订单总数量ref
		refs.orderTotalQuantityFilterRef.value.setFormData({
			totalNumber: props.currentRow.ruleConditionWarehouseVO?.totalNumber || '',
		});
		// 设置 订单总重量ref
		refs.orderTotalWeightFilterRef.value.setFormData({
			weight: props.currentRow.ruleConditionWarehouseVO?.weight || '',
		});
		// 设置 是否有买家备注ref
		refs.hasBuyerNoteFilterRef.value.setFormData({
			buyerNote: props.currentRow.ruleConditionWarehouseVO?.buyerNote || '',
		});
		// 设置 是否定制订单ref
		refs.isCustomizedOrderFilterRef.value.setFormData({
			madeToOrder: props.currentRow.ruleConditionWarehouseVO?.madeToOrder || '',
		});
		// 设置 订单体积重量ref
		refs.orderVolumetricWeightFilterRef.value.setFormData({
			volumetricWeight:
				props.currentRow.ruleConditionWarehouseVO?.volumetricWeight || '',
			volumetricWeightParam:
				props.currentRow.ruleConditionWarehouseVO?.volumetricWeightParam || '',
		});
		// 设置 商品尺寸ref
		refs.productSizeFilterRef.value.setFormData({
			productSize: props.currentRow.ruleConditionWarehouseVO?.productSize || '',
			productSizeHtml:
				props.currentRow.ruleConditionWarehouseVO?.productSizeHtml || '',
		});
		// 设置 收件人国家/地区ref
		refs.shipToCountryRegionFilterRef.value.setFormData({
			recipientCountry:
				props.currentRow.ruleConditionWarehouseVO?.recipientCountry || '',
		});
		// 设置 收件人州/省ref
		refs.shipToStateProvinceFilterRef.value.setFormData({
			recipientState:
				props.currentRow.ruleConditionWarehouseVO?.recipientState || '',
		});
		// 设置 收件人城市ref
		refs.shipToCityFilterRef.value.setFormData({
			recipientCity:
				props.currentRow.ruleConditionWarehouseVO?.recipientCity || '',
		});
		// 设置 收件人邮编ref
		refs.shipToPostalCodeFilterRef.value.setFormData({
			recipientPostcode:
				props.currentRow.ruleConditionWarehouseVO?.recipientPostcode || '',
		});
		// 设置 发运级别ref
		refs.shippingServiceLevelFilterRef.value.setFormData({
			shipmentPriority:
				props.currentRow.ruleConditionWarehouseVO?.shipmentPriority || '',
		});
		// 设置 平台仓库ref
		refs.platformWarehouseIdFilterRef.value.setFormData({
			platformWareId:
				props.currentRow.ruleConditionWarehouseVO?.platformWareId || '',
		});
		// 设置 电话号/手机号ref
		refs.phoneMobileFilterRef.value.setFormData({
			phone: props.currentRow.ruleConditionWarehouseVO?.phone || '',
		});
		// 设置 订单MSKUref
		refs.orderMSKUFilterRef.value.setFormData({
			mskuCode: props.currentRow.ruleConditionWarehouseVO?.mskuCode || '',
		});
		// 设置 订单商品ref
		refs.orderProductFilterRef.value.setFormData({
			skuCode: props.currentRow.ruleConditionWarehouseVO?.skuCode || '',
		});
		// 设置 产品品类ref
		refs.productCategoryFilterRef.value.setFormData({
			category: props.currentRow.ruleConditionWarehouseVO?.category || '',
		});
		// 设置 产品品牌ref
		refs.productBrandFilterRef.value.setFormData({
			brand: props.currentRow.ruleConditionWarehouseVO?.brand || '',
		});
		// 设置 特殊属性ref
		refs.specialAttributesFilterRef.value.setFormData({
			specialAttribute:
				props.currentRow.ruleConditionWarehouseVO?.specialAttribute || '',
		});
		// 设置 底部操作ref
		refs.setAction.value.setFormData(props.currentRow.ruleActionWarehouseVO);
	}
	return;
};
const getCheckList = (props: { currentRow: any }) => {
	const checkList: string[] = [];
	// 订单平台
	if (props.currentRow?.ruleConditionWarehouseVO?.platformChannel) {
		checkList.push('platformChannel');
	}
	// 店铺站点
	if (props.currentRow?.ruleConditionWarehouseVO?.site) {
		checkList.push('site');
	}
	// 订单店铺
	if (props.currentRow?.ruleConditionWarehouseVO?.store) {
		checkList.push('store');
	}
	// 订单访问方式
	if (props.currentRow?.ruleConditionWarehouseVO?.orderFrom) {
		checkList.push('orderFrom');
	}
	// 订单售价(不含税)
	if (props.currentRow?.ruleConditionWarehouseVO?.sellingPrice) {
		checkList.push('sellingPrice');
	}
	// 订单总数量
	if (props.currentRow?.ruleConditionWarehouseVO?.totalNumber) {
		checkList.push('totalNumber');
	}
	// 订单总重量
	if (props.currentRow?.ruleConditionWarehouseVO?.weight) {
		checkList.push('weight');
	}
	// 是否有买家备注
	if (props.currentRow?.ruleConditionWarehouseVO?.buyerNote) {
		checkList.push('buyerNote');
	}
	// 是否定制订单
	if (props.currentRow?.ruleConditionWarehouseVO?.madeToOrder) {
		checkList.push('madeToOrder');
	}
	// 订单体积重量
	if (
		props.currentRow?.ruleConditionWarehouseVO?.volumetricWeight &&
		props.currentRow?.ruleConditionWarehouseVO?.volumetricWeightParam
	) {
		checkList.push('volumetricWeight');
	}
	// 商品尺寸
	if (
		props.currentRow?.ruleConditionWarehouseVO?.productSize &&
		props.currentRow?.ruleConditionWarehouseVO?.productSizeHtml
	) {
		checkList.push('productSize');
	}
	// 收件人国家/地区
	if (props.currentRow?.ruleConditionWarehouseVO?.recipientCountry) {
		checkList.push('recipientCountry');
	}
	// 收件人州/省
	if (props.currentRow?.ruleConditionWarehouseVO?.recipientState) {
		checkList.push('recipientState');
	}
	// 收件人城市
	if (props.currentRow?.ruleConditionWarehouseVO?.recipientCity) {
		checkList.push('recipientCity');
	}
	// 收件人邮编
	if (
		props.currentRow?.ruleConditionWarehouseVO?.recipientPostcode &&
		props.currentRow?.ruleConditionWarehouseVO?.recipientPostcode !== '{}'
	) {
		checkList.push('recipientPostcode');
	}
	// 发运级别
	if (props.currentRow?.ruleConditionWarehouseVO?.shipmentPriority) {
		checkList.push('shipmentPriority');
	}
	// 平台仓库ID
	if (props.currentRow?.ruleConditionWarehouseVO?.platformWareId) {
		checkList.push('platformWareId');
	}
	// 电话号/手机号ref
	if (props.currentRow?.ruleConditionWarehouseVO?.platformWareId) {
		checkList.push('platformWareId');
	}
	// 电话号/手机号ref
	if (props.currentRow?.ruleConditionWarehouseVO?.phone) {
		checkList.push('phone');
	}
	// 订单MSKUref
	if (props.currentRow?.ruleConditionWarehouseVO?.mskuCode) {
		checkList.push('mskuCode');
	}
	// 订单商品ref
	if (props.currentRow?.ruleConditionWarehouseVO?.skuCode) {
		checkList.push('skuCode');
	}
	// 产品品类ref
	if (props.currentRow?.ruleConditionWarehouseVO?.category) {
		checkList.push('category');
	}
	// 产品品牌ref
	if (props.currentRow?.ruleConditionWarehouseVO?.brand) {
		checkList.push('brand');
	}
	// 特殊属性ref
	if (props.currentRow?.ruleConditionWarehouseVO?.specialAttribute) {
		checkList.push('specialAttribute');
	}
	return checkList;
};
