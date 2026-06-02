/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-13 10:25:00
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-02 17:57:40
 * @FilePath: \qianyi-ui\src\views\product\product-info\sku\components\all-edit-sku\utils\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { useWaitForRefsReady } from '/@/hooks/nextTick';
import { useMessage } from '/@/hooks/message';
import { postBatchUpdateSkus } from '/@/api/product/sku';
import type { Ref } from 'vue';
export const initFn = async (
	props: { skuList: any[] },
	refs: {
		modelListRef: any; // model列表ref
		categoryCodeRef: any; // 类目ref
		brandCodeRef: any; // 品牌ref
		productTypeRef: any; // 产品类型ref
		gradeRef: any; // 产品等级ref
		colorRef: any; // 颜色ref
		spuRef: any; // SPUref
		countryCodesRef: any; // 销售国家ref
		platformChannelCodesRef: any; // 销售渠道ref
		productManageIdRef: any; // 产品负责人ref
		operationGroupsRef: any; // 运营组ref
		specialAttributeRef: any; // 特殊属性ref
		productDescRef: any; // 产品描述ref
		purchaseManageIdRef: any; // 采购负责人ref
		purchaseLeadTimeUnitRef: any; // 采购交期ref
		referenceCostRef: any; // 参考成本ref
		itemSpecRef: any; // 单品规格ref
		packSpecRef: any; // 包装规格ref
		itemNetRef: any; // 单品净重ref
		itemGrossRef: any; // 单品毛重ref
		purchaseRemarkRef: any; // 采购备注ref
		cartonInfoRef: any; // 箱规信息ref
		qcInfoRef: any; // 质检信息ref
		materialInfoRef: any; // 关联产品ref
	},
	optionsGroups: Ref<
		Array<{
			title: string;
			options: Array<{ label: string; value: string; isShow?: boolean }>;
		}>
	>
) => {
	// 等待组件加载完成
	const isReady = await useWaitForRefsReady([
		refs.modelListRef,
		refs.categoryCodeRef,
		refs.brandCodeRef,
		refs.productTypeRef,
		refs.gradeRef,
		refs.colorRef,
		refs.spuRef,
		refs.countryCodesRef,
		refs.platformChannelCodesRef,
		refs.productManageIdRef,
		refs.operationGroupsRef,
		refs.specialAttributeRef,
		refs.productDescRef,
		refs.purchaseManageIdRef,
		refs.purchaseLeadTimeUnitRef,
		refs.referenceCostRef,
		refs.itemSpecRef,
		refs.packSpecRef,
		refs.itemNetRef,
		refs.itemGrossRef,
		refs.purchaseRemarkRef,
		refs.cartonInfoRef,
		refs.qcInfoRef,
		refs.materialInfoRef,
	]);
	if (!isReady) {
		useMessage().error('组件未加载完成，请稍后再试');
	}
	const init = () => {
		// 初始化
		// 设置  list 组件ref
		refs.modelListRef.value.init();
		// 设置 类目 组件ref
		refs.categoryCodeRef.value.init();
		// 设置 品牌 组件ref
		refs.brandCodeRef.value.init();
		// 设置 产品类型 组件ref
		refs.productTypeRef.value.init();
		// 设置 产品等级 组件ref
		refs.gradeRef.value.init();
		// 设置 颜色 组件ref
		refs.colorRef.value.init();
		// 设置 SPU 组件ref
		refs.spuRef.value.init();
		// 设置 销售国家 组件ref
		refs.countryCodesRef.value.init();
		// 设置 销售渠道 组件ref
		refs.platformChannelCodesRef.value.init();
		// 设置 产品负责人 组件ref
		refs.productManageIdRef.value.init();
		// 设置 运营组 组件ref
		refs.operationGroupsRef.value.init();
		// 设置 特殊属性 组件ref
		refs.specialAttributeRef.value.init();
		// 设置 产品描述 组件ref
		refs.productDescRef.value.init();
		// 设置 采购负责人 组件ref
		refs.purchaseManageIdRef.value.init();
		// 设置 采购交期单位 组件ref
		refs.purchaseLeadTimeUnitRef.value.init();
		// 设置 参考成本 组件ref
		refs.referenceCostRef.value.init();
		// 设置 单品规格 组件ref
		refs.itemSpecRef.value.init();
		// 设置 包装规格 组件ref
		refs.packSpecRef.value.init();
		// 设置 单品净重 组件ref
		refs.itemNetRef.value.init();
		// 设置 单品毛重 组件ref
		refs.itemGrossRef.value.init();
		// 设置 采购备注 组件ref
		refs.purchaseRemarkRef.value.init();
		// 设置 箱规信息 组件ref
		refs.cartonInfoRef.value.init();
		// 设置 质检信息 组件ref
		refs.qcInfoRef.value.init();
		// 设置 关联产品 组件ref
		refs.materialInfoRef.value.init();
		return;
	};
	init();
	// 如果存在箱规编码就设置箱规编码
	// 查询所有箱规编码的list
	const cartonList = props.skuList
		.filter((item) => item.skuCartons)
		.map((item) => item.skuCartons)
		.flat();
	// 设置箱规编码
	if (cartonList.length) {
		refs.cartonInfoRef.value.setCartonList(cartonList);
	}

	// 若同时存在“成品(1)”和“配件(2)”，则不展示关联配件模块（关联产品/配件模块）
	// 说明：不同接口/列表字段可能不一致，这里做多字段兼容提取产品类型
	const productTypes = new Set<string>(
		(props.skuList || [])
			.map((item: any) => {
				const val =
					item?.productType ??
					item?.productTypeCode ??
					item?.productTypeValue ??
					item?.productTypeId ??
					item?.productTypeEnum;
				return val === undefined || val === null ? '' : String(val);
			})
			.filter(Boolean)
	);
	// 只要存在配件(2)，就隐藏关联产品/配件模块
	const shouldHideMaterialInfo = productTypes.has('2');
	// 隐藏关联产品/配件模块
	if (shouldHideMaterialInfo) {
		const group = optionsGroups.value?.find(
			(item: { title: string }) => item.title === '关联产品/配件'
		);
		const option = group?.options?.find(
			(opt: { value: string; isShow?: boolean }) => opt.value === 'materialInfo'
		);
		if (option) option.isShow = false;
	} else {
		// 打开关联产品/配件模块
		const group = optionsGroups.value?.find(
			(item: { title: string }) => item.title === '关联产品/配件'
		);
		const option = group?.options?.find(
			(opt: { value: string; isShow?: boolean }) => opt.value === 'materialInfo'
		);
		if (option) option.isShow = true;
	}
	return;
};
/**
 * 提交方法
 * @param props
 * @param refs
 */
export const submitFn = async (
	refs: {
		modelListRef: any; // model列表ref
		categoryCodeRef: any; // 类目ref
		brandCodeRef: any; // 品牌ref
		productTypeRef: any; // 产品类型ref
		gradeRef: any; // 产品等级ref
		colorRef: any; // 颜色ref
		spuRef: any; // SPUref
		countryCodesRef: any; // 销售国家ref
		platformChannelCodesRef: any; // 销售渠道ref
		productManageIdRef: any; // 产品负责人ref
		operationGroupsRef: any; // 运营组ref
		specialAttributeRef: any; // 特殊属性ref
		productDescRef: any; // 产品描述ref
		purchaseManageIdRef: any; // 采购负责人ref
		purchaseLeadTimeUnitRef: any; // 采购交期ref
		referenceCostRef: any; // 参考成本ref
		itemSpecRef: any; // 单品规格ref
		packSpecRef: any; // 包装规格ref
		itemNetRef: any; // 单品净重ref
		itemGrossRef: any; // 单品毛重ref
		purchaseRemarkRef: any; // 采购备注ref
		cartonInfoRef: any; // 箱规信息ref
		qcInfoRef: any; // 质检信息ref
		materialInfoRef: any; // 关联产品ref
	},
	hide: () => void,
	// 当前选中的sku列表
	currentCheckList: string[],
	// 当前选中的sku列表
	skuList: any[],
	// 单位体系
	unitSystems: {
		purchaseInfoUnitSystem: string;
		cartonInfoUnitSystem: string;
	}
) => {
	// 等待组件加载完成
	const isReady = await useWaitForRefsReady([
		refs.modelListRef,
		refs.categoryCodeRef,
		refs.brandCodeRef,
		refs.productTypeRef,
		refs.gradeRef,
		refs.colorRef,
		refs.spuRef,
		refs.countryCodesRef,
		refs.platformChannelCodesRef,
		refs.productManageIdRef,
		refs.operationGroupsRef,
		refs.specialAttributeRef,
		refs.productDescRef,
		refs.purchaseManageIdRef,
		refs.purchaseLeadTimeUnitRef,
		refs.referenceCostRef,
		refs.itemSpecRef,
		refs.packSpecRef,
		refs.itemNetRef,
		refs.itemGrossRef,
		refs.purchaseRemarkRef,
		refs.cartonInfoRef,
		refs.qcInfoRef,
		refs.materialInfoRef,
	]);
	if (!isReady) {
		useMessage().error('组件未加载完成，请稍后再试');
		return false;
	}
	// 获取到类目的数据
	const categoryCodeData = currentCheckList.includes('categoryCode')
		? await refs.categoryCodeRef.value.validateForm()
		: {};

	// 获取到品牌的数据
	const brandCodeData = currentCheckList.includes('brandCode')
		? await refs.brandCodeRef.value.validateForm()
		: {};

	// 获取到产品类型的数据
	const productTypeData = currentCheckList.includes('productType')
		? await refs.productTypeRef.value.validateForm()
		: {};

	// 获取到产品等级的数据
	const gradeData = currentCheckList.includes('grade')
		? await refs.gradeRef.value.validateForm()
		: {};

	// 获取颜色数据
	const colorData = currentCheckList.includes('color')
		? await refs.colorRef.value.validateForm()
		: {};

	// 获取SPU数据
	const spuData = currentCheckList.includes('spuCode')
		? await refs.spuRef.value.validateForm()
		: {};

	// 获取销售国家数据
	const countryCodesData = currentCheckList.includes('countryCodes')
		? await refs.countryCodesRef.value.validateForm()
		: {};

	// 获取销售渠道数据
	const platformChannelCodesData = currentCheckList.includes(
		'platformChannelCodes'
	)
		? await refs.platformChannelCodesRef.value.validateForm()
		: {};

	// 获取产品负责人数据
	const productManageIdData = currentCheckList.includes('productManageId')
		? await refs.productManageIdRef.value.validateForm()
		: {};

	// 获取运营组数据
	const operationGroupsData = currentCheckList.includes('operationGroups')
		? await refs.operationGroupsRef.value.validateForm()
		: {};

	// 获取特殊属性数据
	const specialAttributeData = currentCheckList.includes('specialAttribute')
		? await refs.specialAttributeRef.value.validateForm()
		: {};

	// 获取产品描述数据
	const productDescData = currentCheckList.includes('productDesc')
		? await refs.productDescRef.value.validateForm()
		: {};

	// 获取采购负责人数据
	const purchaseManageIdData = currentCheckList.includes('purchaseManageId')
		? await refs.purchaseManageIdRef.value.validateForm()
		: {};

	// 获取采购交期数据
	const purchaseLeadTimeUnitData = currentCheckList.includes(
		'purchaseLeadTimeUnit'
	)
		? await refs.purchaseLeadTimeUnitRef.value.validateForm()
		: {};

	// 获取参考成本数据
	const referenceCostData = currentCheckList.includes('referenceCost')
		? await refs.referenceCostRef.value.validateForm()
		: {};

	// 获取单品规格数据
	const itemSpecData = currentCheckList.includes('itemSpec')
		? await refs.itemSpecRef.value.validateForm()
		: {};

	// 获取包装规格数据
	const packSpecData = currentCheckList.includes('packSpec')
		? await refs.packSpecRef.value.validateForm()
		: {};

	// 获取单品净重数据
	const itemNetData = currentCheckList.includes('itemNet')
		? await refs.itemNetRef.value.validateForm()
		: {};

	// 获取单品毛重数据
	const itemGrossData = currentCheckList.includes('itemGross')
		? await refs.itemGrossRef.value.validateForm()
		: {};

	// 获取采购备注数据
	const purchaseRemarkData = currentCheckList.includes('purchaseRemark')
		? await refs.purchaseRemarkRef.value.validateForm()
		: {};

	// 获取箱规信息数据
	const cartonInfoData = currentCheckList.includes('cartonInfo')
		? await refs.cartonInfoRef.value.validateForm()
		: {};

	// 获取质检信息数据
	const qcInfoData = currentCheckList.includes('qcInfo')
		? await refs.qcInfoRef.value.validateForm()
		: {};

	// 获取关联产品数据
	const materialInfoData = currentCheckList.includes('materialInfo')
		? await refs.materialInfoRef.value.validateForm()
		: {};

	// 合并所有数据
	const params = {
		...categoryCodeData,
		...brandCodeData,
		...productTypeData,
		...gradeData,
		...colorData,
		...spuData,
		...countryCodesData,
		...platformChannelCodesData,
		...productManageIdData,
		...operationGroupsData,
		...specialAttributeData,
		...productDescData,
		...purchaseManageIdData,
		...purchaseLeadTimeUnitData,
		...referenceCostData,
		...itemSpecData,
		...packSpecData,
		...itemNetData,
		...itemGrossData,
		...purchaseRemarkData,
		...cartonInfoData,
		...qcInfoData,
		...materialInfoData,
		skuCodes: skuList.map((item) => item.skuCode),
		purchaseUnitType: unitSystems.purchaseInfoUnitSystem,
		cartonUnitType: unitSystems.cartonInfoUnitSystem,
	};

	const res = await postBatchUpdateSkus({
		requestMap: {
			...params,
		},
		...params,
	});
	if (res?.code !== 0) {
		return false;
	}
	useMessage().success('批量修改成功');
	hide();
};
