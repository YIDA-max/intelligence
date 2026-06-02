/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-13 10:25:00
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-17 10:46:01
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\orderInterceptRule\components\rule-model\utils\index.ts
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
		trackingNumberRef: any; // 跟踪号ref
		shipToActualCarrierFilterRef: any; // 实际承运商ref
		platformWarehouseIdFilterRef: any; // 平台仓库ref
		phoneMobileFilterRef: any; // 手机号码ref
		orderMSKUFilterRef: any; // 订单MSKUref
		orderProductFilterRef: any; // 订单商品ref
		productCategoryFilterRef: any; // 商品类目ref
		productBrandFilterRef: any; // 商品品牌ref
		specialAttributesFilterRef: any; // 特殊属性ref
		setAction: any; // 设置操作ref
		// shippingToWarehouseFilterRef: any; // 收件人仓库ref
		// shippingToLogisticsChannelFilterRef: any; // 物流渠道ref
		shipToThreeWarehouseAndLogisticsChannelRef: any; // 物流渠道ref
		totalLogisticsRef: any; //物流总价ref
	}
) => {
	const isReady = await useWaitForRefsReady(Object.values(refs));
	if (!isReady) {
		useMessage().error('组件未加载完成，请稍后再试');
	}
	const init = () => {
		Object.values(refs).forEach((refObj: any) => {
			refObj?.value?.init && refObj.value.init();
		});
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
				props.currentRow.ruleConditionCutOff?.platformChannel || '',
		});
		// 设置 店铺站点ref
		refs.orderCountryRegionFilterRef.value.setFormData({
			site: props.currentRow.ruleConditionCutOff?.site || '',
		});
		// 设置 订单店铺ref
		refs.orderStoreFilterRef.value.setFormData({
			store: props.currentRow.ruleConditionCutOff?.store || '',
		});
		// 设置 订单访问方式ref
		refs.orderAccessMethodFilterRef.value.setFormData({
			orderFrom: props.currentRow.ruleConditionCutOff?.orderFrom || '',
		});
		// 设置 订单售价(不含税)ref
		refs.orderPriceExTaxFilterRef.value.setFormData({
			sellingPrice: props.currentRow.ruleConditionCutOff?.sellingPrice || '',
		});
		// 设置 订单总数量ref
		refs.orderTotalQuantityFilterRef.value.setFormData({
			totalNumber: props.currentRow.ruleConditionCutOff?.totalNumber || '',
		});
		// 设置 仓库总数量ref
		// refs.shippingToWarehouseFilterRef.value.setFormData({
		// 	warehouseCode: props.currentRow.ruleConditionCutOff?.warehouseCode || '',
		// });
		// 设置 物流渠道数量ref
		// refs.shippingToLogisticsChannelFilterRef.value.setFormData({
		// 	warehouseCode: props.currentRow.ruleConditionCutOff?.logisticsChannel || '',
		// });
		// 设置 订单总重量ref
		refs.orderTotalWeightFilterRef.value.setFormData({
			weight: props.currentRow.ruleConditionCutOff?.weight || '',
		});
		// 设置 是否有买家备注ref
		refs.hasBuyerNoteFilterRef.value.setFormData({
			buyerNote: props.currentRow.ruleConditionCutOff?.buyerNote || '',
		});
		// 设置 是否定制订单ref
		refs.isCustomizedOrderFilterRef.value.setFormData({
			madeToOrder: props.currentRow.ruleConditionCutOff?.madeToOrder || '',
		});
		// 设置 订单体积重量ref
		refs.orderVolumetricWeightFilterRef.value.setFormData({
			volumetricWeight:
				props.currentRow.ruleConditionCutOff?.volumetricWeight || '',
			volumetricWeightParam:
				props.currentRow.ruleConditionCutOff?.volumetricWeightParam || '',
		});
		// 设置 商品尺寸ref
		refs.productSizeFilterRef.value.setFormData({
			productSize: props.currentRow.ruleConditionCutOff?.productSize || '',
			productSizeHtml:
				props.currentRow.ruleConditionCutOff?.productSizeHtml || '',
		});
		// 设置 收件人国家/地区ref
		refs.shipToCountryRegionFilterRef.value.setFormData({
			recipientCountry:
				props.currentRow.ruleConditionCutOff?.recipientCountry || '',
		});
		// 设置 收件人州/省ref
		refs.shipToStateProvinceFilterRef.value.setFormData({
			recipientState:
				props.currentRow.ruleConditionCutOff?.recipientState || '',
		});
		// 设置 收件人城市ref
		refs.shipToCityFilterRef.value.setFormData({
			recipientCity: props.currentRow.ruleConditionCutOff?.recipientCity || '',
		});
		// 设置 收件人邮编ref
		refs.shipToPostalCodeFilterRef.value.setFormData({
			recipientPostcode:
				props.currentRow.ruleConditionCutOff?.recipientPostcode || '',
		});
		// 设置 仓库物流ref
		refs.shipToThreeWarehouseAndLogisticsChannelRef.value.setFormData({
			warehouseCode: props.currentRow.ruleConditionCutOff?.warehouseCode || '',
			logisticsChannel:
				props.currentRow.ruleConditionCutOff?.logisticsChannel || '',
		});
		// 设置 发运级别ref
		refs.shippingServiceLevelFilterRef.value.setFormData({
			shipmentPriority:
				props.currentRow.ruleConditionCutOff?.shipmentPriority || '',
		});
		// 设置 跟踪号ref
		refs.trackingNumberRef.value.setFormData({
			logisticsTrackingNo:
				props.currentRow.ruleConditionCutOff?.logisticsTrackingNo || '',
		});
		// 设置 实际承运ref
		refs.shipToActualCarrierFilterRef.value.setFormData({
			carrierName: props.currentRow.ruleConditionCutOff?.carrierName || '',
		});
		// 设置 平台仓库ref
		refs.platformWarehouseIdFilterRef.value.setFormData({
			platformWareId:
				props.currentRow.ruleConditionCutOff?.platformWareId || '',
		});
		// 设置 电话号/手机号ref
		refs.phoneMobileFilterRef.value.setFormData({
			phone: props.currentRow.ruleConditionCutOff?.phone || '',
		});
		// 设置 订单MSKUref
		refs.orderMSKUFilterRef.value.setFormData({
			mskuCode: props.currentRow.ruleConditionCutOff?.mskuCode || '',
		});
		// 设置 订单商品ref
		refs.orderProductFilterRef.value.setFormData({
			skuCode: props.currentRow.ruleConditionCutOff?.skuCode || '',
		});
		// 设置 产品品类ref
		refs.productCategoryFilterRef.value.setFormData({
			category: props.currentRow.ruleConditionCutOff?.category || '',
		});
		// 设置 产品品牌ref
		refs.productBrandFilterRef.value.setFormData({
			brand: props.currentRow.ruleConditionCutOff?.brand || '',
		});
		// 设置 特殊属性ref
		refs.specialAttributesFilterRef.value.setFormData({
			specialAttribute:
				props.currentRow.ruleConditionCutOff?.specialAttribute || '',
		});
		// 设置 物流总价ref
		refs.totalLogisticsRef.value.setFormData({
			totalFee: props.currentRow.ruleConditionCutOff?.totalFee || '',
		});

		// 设置 底部操作ref
		refs.setAction.value.setFormData({
			autoFlag: props.currentRow.ruleActionCutOff.autoFlag || 0, // 是否自动
			tagInfoVOS: props.currentRow.ruleActionCutOff.tagInfoVOS || [], // 标签信息
			cutOffReason: props.currentRow.ruleActionCutOff.cutOffReason || '', // 截单原因信息
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
				props.currentRow.ruleConditionCutOff?.platformChannel || '',
		});
		// 设置 店铺站点ref
		refs.orderCountryRegionFilterRef.value.setFormData({
			site: props.currentRow.ruleConditionCutOff?.site || '',
		});
		// 设置 订单店铺ref
		refs.orderStoreFilterRef.value.setFormData({
			store: props.currentRow.ruleConditionCutOff?.store || '',
		});
		// 设置 订单访问方式ref
		refs.orderAccessMethodFilterRef.value.setFormData({
			orderFrom: props.currentRow.ruleConditionCutOff?.orderFrom || '',
		});
		// 设置 订单售价(不含税)ref
		refs.orderPriceExTaxFilterRef.value.setFormData({
			sellingPrice: props.currentRow.ruleConditionCutOff?.sellingPrice || '',
		});
		// 设置 订单总数量ref
		refs.orderTotalQuantityFilterRef.value.setFormData({
			totalNumber: props.currentRow.ruleConditionCutOff?.totalNumber || '',
		});
		// 设置 订单总重量ref
		refs.orderTotalWeightFilterRef.value.setFormData({
			weight: props.currentRow.ruleConditionCutOff?.weight || '',
		});
		// 设置 是否有买家备注ref
		refs.hasBuyerNoteFilterRef.value.setFormData({
			buyerNote: props.currentRow.ruleConditionCutOff?.buyerNote || '',
		});
		// 设置 是否定制订单ref
		refs.isCustomizedOrderFilterRef.value.setFormData({
			madeToOrder: props.currentRow.ruleConditionCutOff?.madeToOrder || '',
		});
		// 设置 订单体积重量ref
		refs.orderVolumetricWeightFilterRef.value.setFormData({
			volumetricWeight:
				props.currentRow.ruleConditionCutOff?.volumetricWeight || '',
			volumetricWeightParam:
				props.currentRow.ruleConditionCutOff?.volumetricWeightParam || '',
		});
		// 设置 商品尺寸ref
		refs.productSizeFilterRef.value.setFormData({
			productSize: props.currentRow.ruleConditionCutOff?.productSize || '',
			productSizeHtml:
				props.currentRow.ruleConditionCutOff?.productSizeHtml || '',
		});
		// 设置 收件人国家/地区ref
		refs.shipToCountryRegionFilterRef.value.setFormData({
			recipientCountry:
				props.currentRow.ruleConditionCutOff?.recipientCountry || '',
		});
		// 设置 收件人州/省ref
		refs.shipToStateProvinceFilterRef.value.setFormData({
			recipientState:
				props.currentRow.ruleConditionCutOff?.recipientState || '',
		});
		// 设置 收件人城市ref
		refs.shipToCityFilterRef.value.setFormData({
			recipientCity: props.currentRow.ruleConditionCutOff?.recipientCity || '',
		});
		// 设置 收件人邮编ref
		refs.shipToPostalCodeFilterRef.value.setFormData({
			recipientPostcode:
				props.currentRow.ruleConditionCutOff?.recipientPostcode || '',
		});
		// 设置 仓库物流ref
		refs.shipToThreeWarehouseAndLogisticsChannelRef.value.setFormData({
			warehouseCode:
				props.currentRow.ruleConditionRecipient?.warehouseCode || '',
			logisticsChannel:
				props.currentRow.ruleConditionRecipient?.logisticsChannel || '',
		});
		// 设置 发运级别ref
		refs.shippingServiceLevelFilterRef.value.setFormData({
			shipmentPriority:
				props.currentRow.ruleConditionCutOff?.shipmentPriority || '',
		});
		// 设置 跟踪号ref
		refs.trackingNumberRef.value.setFormData({
			logisticsTrackingNo:
				props.currentRow.ruleConditionCutOff?.logisticsTrackingNo || '',
		});
		// 设置 实际承运ref
		refs.shipToActualCarrierFilterRef.value.setFormData({
			carrierName: props.currentRow.ruleConditionCutOff?.carrierName || '',
		});
		// 设置 平台仓库ref
		refs.platformWarehouseIdFilterRef.value.setFormData({
			platformWareId:
				props.currentRow.ruleConditionCutOff?.platformWareId || '',
		});
		// 设置 电话号/手机号ref
		refs.phoneMobileFilterRef.value.setFormData({
			phone: props.currentRow.ruleConditionCutOff?.phone || '',
		});
		// 设置 订单MSKUref
		refs.orderMSKUFilterRef.value.setFormData({
			mskuCode: props.currentRow.ruleConditionCutOff?.mskuCode || '',
		});
		// 设置 订单商品ref
		refs.orderProductFilterRef.value.setFormData({
			skuCode: props.currentRow.ruleConditionCutOff?.skuCode || '',
		});
		// 设置 产品品类ref
		refs.productCategoryFilterRef.value.setFormData({
			category: props.currentRow.ruleConditionCutOff?.category || '',
		});
		// 设置 产品品牌ref
		refs.productBrandFilterRef.value.setFormData({
			brand: props.currentRow.ruleConditionCutOff?.brand || '',
		});
		// 设置 特殊属性ref
		refs.specialAttributesFilterRef.value.setFormData({
			specialAttribute:
				props.currentRow.ruleConditionCutOff?.specialAttribute || '',
		});
		// 设置 物流总价ref
		refs.totalLogisticsRef.value.setFormData({
			totalFee: props.currentRow.ruleConditionCutOff?.totalFee || '',
		});
		//设置 发货仓库
		// refs.shippingToWarehouseFilterRef.value.setFormData({
		// 	warehouseCode: props.currentRow.ruleConditionCutOff?.warehouseCode || '',
		// });
		// 设置 物流渠道数量ref
		// refs.shippingToLogisticsChannelFilterRef.value.setFormData({
		// 	logisticsChannel: props.currentRow.ruleConditionCutOff?.logisticsChannel || '',
		// });
		// 设置 底部操作ref
		refs.setAction.value.setFormData({
			autoFlag: props.currentRow.ruleActionCutOff.autoFlag || 0, // 是否自动
			tagInfoVOS: props.currentRow.ruleActionCutOff.tagInfoVOS || [], // 标签信息
			cutOffReason: props.currentRow.ruleActionCutOff.cutOffReason || '', // 截单原因信息
		});
	}
	return;
};
const getCheckList = (props: { currentRow: any }) => {
	const checkList: string[] = [];
	// 订单平台
	if (props.currentRow?.ruleConditionCutOff?.platformChannel) {
		checkList.push('platformChannel');
	}
	// 店铺站点
	if (props.currentRow?.ruleConditionCutOff?.site) {
		checkList.push('site');
	}
	// 订单店铺
	if (props.currentRow?.ruleConditionCutOff?.store) {
		checkList.push('store');
	}
	// 订单访问方式
	if (props.currentRow?.ruleConditionCutOff?.orderFrom) {
		checkList.push('orderFrom');
	}
	// 订单售价(不含税)
	if (props.currentRow?.ruleConditionCutOff?.sellingPrice) {
		checkList.push('sellingPrice');
	}
	// 订单总数量
	if (props.currentRow?.ruleConditionCutOff?.totalNumber) {
		checkList.push('totalNumber');
	}
	// 订单总重量
	if (props.currentRow?.ruleConditionCutOff?.weight) {
		checkList.push('weight');
	}
	// 是否有买家备注
	if (props.currentRow?.ruleConditionCutOff?.buyerNote) {
		checkList.push('buyerNote');
	}
	// 是否定制订单
	if (props.currentRow?.ruleConditionCutOff?.madeToOrder) {
		checkList.push('madeToOrder');
	}
	// 订单体积重量
	if (
		props.currentRow?.ruleConditionCutOff?.volumetricWeight &&
		props.currentRow?.ruleConditionCutOff?.volumetricWeightParam
	) {
		checkList.push('volumetricWeight');
	}
	// 商品尺寸
	if (
		props.currentRow?.ruleConditionCutOff?.productSize &&
		props.currentRow?.ruleConditionCutOff?.productSizeHtml
	) {
		checkList.push('productSize');
	}
	// 收件人国家/地区
	if (props.currentRow?.ruleConditionCutOff?.recipientCountry) {
		checkList.push('recipientCountry');
	}
	// 收件人州/省
	if (props.currentRow?.ruleConditionCutOff?.recipientState) {
		checkList.push('recipientState');
	}
	// 收件人城市
	if (props.currentRow?.ruleConditionCutOff?.recipientCity) {
		checkList.push('recipientCity');
	}
	// 实际承运人
	if (props.currentRow?.ruleConditionCutOff?.carrierName) {
		checkList.push('carrierName');
	}
	// 收件人邮编
	if (
		props.currentRow?.ruleConditionCutOff?.recipientPostcode &&
		props.currentRow?.ruleConditionCutOff?.recipientPostcode !== '{}'
	) {
		checkList.push('recipientPostcode');
	}
	// 仓库物流
	if (
		props.currentRow?.ruleConditionCutOff?.warehouseCode ||
		props.currentRow?.ruleConditionCutOff?.logisticsChannel
	) {
		checkList.push('warehouseAndLogisticsChannel');
	}
	// 发运级别
	if (props.currentRow?.ruleConditionCutOff?.shipmentPriority) {
		checkList.push('shipmentPriority');
	}
	// 跟踪号
	if (props.currentRow?.ruleConditionCutOff?.logisticsTrackingNo) {
		checkList.push('logisticsTrackingNo');
	}
	// 平台仓库ID
	if (props.currentRow?.ruleConditionCutOff?.platformWareId) {
		checkList.push('platformWareId');
	}
	// 电话号/手机号ref
	if (props.currentRow?.ruleConditionCutOff?.platformWareId) {
		checkList.push('platformWareId');
	}
	// 电话号/手机号ref
	if (props.currentRow?.ruleConditionCutOff?.phone) {
		checkList.push('phone');
	}
	// 订单MSKUref
	if (props.currentRow?.ruleConditionCutOff?.mskuCode) {
		checkList.push('mskuCode');
	}
	// 订单商品ref
	if (props.currentRow?.ruleConditionCutOff?.skuCode) {
		checkList.push('skuCode');
	}
	// 产品品类ref
	if (props.currentRow?.ruleConditionCutOff?.category) {
		checkList.push('category');
	}
	// 产品品牌ref
	if (props.currentRow?.ruleConditionCutOff?.brand) {
		checkList.push('brand');
	}
	// 特殊属性ref
	if (props.currentRow?.ruleConditionCutOff?.specialAttribute) {
		checkList.push('specialAttribute');
	}
	// 产品仓库ref
	// if (props.currentRow?.ruleConditionCutOff?.warehouseCode) {
	// 	checkList.push('warehouseCode');
	// }
	//物流总价ref
	if (props.currentRow?.ruleConditionCutOff?.totalFee) {
		checkList.push('totalFee');
	}
	return checkList;
};
