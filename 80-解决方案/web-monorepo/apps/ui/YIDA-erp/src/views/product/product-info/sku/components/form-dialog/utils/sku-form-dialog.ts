/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-15 19:55:17
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-02-12 15:52:57
 * @FilePath: \qianyi-ui\src\views\product\product-info\sku\components\form-dialog\utils\sku-form-dialog.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { useWaitForRefsReady } from '/@/hooks/nextTick';
import { useMessage } from '/@/hooks/message';
import { Ref } from 'vue';
import { useUserInfo } from '/@/stores/userInfo';
import { storeToRefs } from 'pinia';

/**
 * 新增SKU的init
 */
export const addInit = async (
	baseInfoRef: Ref<any>,
	purchaseInfoRef: Ref<any>,
	singleCartonInfoRef: Ref<any>,
	associateProductRef: Ref<any>,
	associateMskuRef: Ref<any>,
	qcsInfoRef: Ref<any>,
	imgsInfoRef: Ref<any>,
	dictMap: { [key: string]: any[] },
	avatar: Ref<string>,
	tabsValue: Ref<number>
) => {
	// 定义变量内容
	const stores = useUserInfo();
	const { userInfos } = storeToRefs(stores);
	const isReady = await useWaitForRefsReady([
		baseInfoRef,
		purchaseInfoRef,
		singleCartonInfoRef,
		associateProductRef,
		associateMskuRef,
		qcsInfoRef,
		imgsInfoRef,
	]);
	if (isReady) {
		baseInfoRef.value.setData({
			skuCode: '',
			skuName: '',
			spuCode: '',
			spuName: '',
			categoryCode: '',
			brandCode: '',
			productType: '',
			grade: '',
			color: '',
			model: '',
			productSkuCountryList: [],
			platform: '',
			productManageId: userInfos.value.user.userId,
			skuDepts: [],
			specialAttribute: [],
			attributeDesc: '',
			productDesc: '',
			attachmentFileName: [],
		});

		purchaseInfoRef.value.setData({
			// 采购负责人
			purchaseManageId: '',
			// 采购交期
			purchaseLeadTime: '',
			// 参考成本
			referenceCost: '',
			// 单品规格的长宽高 长>宽>高
			itemSpecLength: '',
			itemSpecWidth: '',
			itemSpecHeight: '',
			// 包装规格的长宽高 长>宽>高
			packSpecLength: '',
			packSpecWidth: '',
			packSpecHeight: '',
			// 单品净重
			itemNetWeight: '',
			// 单品毛重
			itemGrossWeight: '',
			// 采购交期单位
			purchaseRemark: '',
		});

		// 箱规信息 - 使用新的数据结构
		singleCartonInfoRef.value.setData({
			skuCartons: [
				{
					skuCartonCode: '',
					outCartonSpecLength: '',
					outCartonSpecWidth: '',
					outCartonSpecHeight: '',
					outCartonSpecUnit: 'cm',
					cartonQty: '',
					cartonQtyUnit: 'pcs',
					cartonGrossWeight: '',
					cartonGrossWeightUnit: 'kg',
					cartonNetWeight: '',
					cartonNetWeightUnit: 'kg',
					containerCartonQty: '',
					containerCartonQtyUnit: 'carton',
				},
			],
		});

		associateProductRef.value.setData([]);
		associateMskuRef.value.setData(
			dictMap.platform?.map((item: any) => {
				return {
					label: item.label,
					value: item.value,
					tableData: [],
				};
			})
		);
		qcsInfoRef.value.setData([]);
		imgsInfoRef.value.setData([]);
		avatar.value = '';
		tabsValue.value = 0; // 默认选中基本信息
		// 清空子组件的表单校验;
		await baseInfoRef.value.dataFormRef.clearValidate();
		await purchaseInfoRef.value.dataFormRef.clearValidate();
		await singleCartonInfoRef.value.dataFormRef.clearValidate();
		return;
	} else {
		useMessage().error('组件未准备好，请稍后再试');
		return;
	}
};

/**
 * 编辑SKU的init
 */
export const editInit = async (
	baseInfoRef: Ref<any>,
	purchaseInfoRef: Ref<any>,
	singleCartonInfoRef: Ref<any>,
	associateProductRef: Ref<any>,
	associateMskuRef: Ref<any>,
	qcsInfoRef: Ref<any>,
	imgsInfoRef: Ref<any>,
	dictMap: { [key: string]: any[] },
	props: any
) => {
	const isReady = await useWaitForRefsReady([
		baseInfoRef,
		purchaseInfoRef,
		singleCartonInfoRef,
		associateProductRef,
		associateMskuRef,
		qcsInfoRef,
		imgsInfoRef,
	]);
	if (isReady) {
		//   赋值baseInfo
		baseInfoRef.value.setData({
			skuCode: props.currentRow.skuCode,
			skuName: props.currentRow.skuName,
			spuCode: props.currentRow.spuCode,
			spuName: props.currentRow.spuName,
			categoryCode: props.currentRow.categoryCode,
			brandCode: props.currentRow.brandCode,
			productType: props.currentRow.productType,
			grade: props.currentRow.grade,
			color: props.currentRow.color,
			model: props.currentRow.model,
			productSkuCountryList: props.currentRow.productSkuCountryList?.map(
				(item: any) => item.countryCode
			),
			countryCodeText: props.currentRow.countryCodeText,
			platform: props.currentRow.platforms
				? props.currentRow.platforms.map((item: any) => item.platform)
				: [],
			productManageId: props.currentRow.productManageId,
			skuDeptsText: props.currentRow.skuDepts,
			skuDepts: props.currentRow.skuDepts?.map((item: any) => {
				return item.deptId;
			}),
			specialAttribute: props.currentRow.specialAttribute?.split(','),
			attributeDesc: props.currentRow.attributeDesc,
			productDesc: props.currentRow.productDesc,
			attachmentFileName: props.currentRow.attachmentUrls,
		});
		// 赋值purchaseInfo
		purchaseInfoRef.value.setData({
			// 采购负责人
			purchaseManageId: props.currentRow.purchaseManageId,
			// 采购交期
			purchaseLeadTime: props.currentRow.purchaseLeadTime,
			// 参考成本
			referenceCost: props.currentRow.referenceCost,
			// 单品规格的长宽高 长>宽>高
			itemSpecLength: props.currentRow.itemSpecLength,
			itemSpecWidth: props.currentRow.itemSpecWidth,
			itemSpecHeight: props.currentRow.itemSpecHeight,
			// 包装规格的长宽高 长>宽>高
			packSpecLength: props.currentRow.packSpecLength,
			packSpecWidth: props.currentRow.packSpecWidth,
			packSpecHeight: props.currentRow.packSpecHeight,
			// 单品净重
			itemNetWeight: props.currentRow.itemNetWeight,
			// 单品毛重
			itemGrossWeight: props.currentRow.itemGrossWeight,
			// 采购交期单位
			purchaseRemark: props.currentRow.purchaseRemark,
		});

		// 赋值箱规信息 - 直接传递原始数据
		{
			const unitType = String(props.currentRow.cartonUnitType || '1');
			const unitSpec = unitType === '1' ? 'cm' : 'inch';
			const unitWeight = unitType === '1' ? 'kg' : 'lbs';
			const normalized = {
				// cartonUnitType: '1',
				skuCartons: (props.currentRow.skuCartons || []).map((item: any) => ({
					id: item.id || '', // 保留id以便编辑时识别
					skuCartonCode: item.skuCartonCode || '',
					outCartonSpecLength: item.outCartonSpecLength || '',
					outCartonSpecWidth: item.outCartonSpecWidth || '',
					outCartonSpecHeight: item.outCartonSpecHeight || '',
					outCartonSpecUnit: item.outCartonSpecUnit || unitSpec,
					cartonQty: item.cartonQty || '',
					cartonQtyUnit: item.cartonQtyUnit || 'pcs',
					cartonGrossWeight: item.cartonGrossWeight || '',
					cartonGrossWeightUnit: item.cartonGrossWeightUnit || unitWeight,
					cartonNetWeight: item.cartonNetWeight || '',
					cartonNetWeightUnit: item.cartonNetWeightUnit || unitWeight,
					containerCartonQty: item.containerCartonQty || '',
					containerCartonQtyUnit: item.containerCartonQtyUnit || 'carton',
				})),
			};
			singleCartonInfoRef.value.setData(normalized);
		}

		// 关联辅料
		associateProductRef.value.setData(props.currentRow.materials || []);
		// 关联MSKU
		const setMSKU: Array<{ label: string; value: string; tableData: any[] }> =
			[];

		dictMap.platform?.forEach((item: any) => {
			const mskus = props.currentRow.mskus.filter(
				(msku: any) => msku.platformChannelCode === item.value
			);
			setMSKU.push({
				label: item.label,
				value: item.value,
				tableData: mskus.map((item: any) => {
					return {
						...item,
						countryCode: item.countryCode?.split(',') || [],
						currency: item.currency || 'EUR',
					};
				}),
			});
		});
		associateMskuRef.value.setData(setMSKU);
		// 质检信息
		qcsInfoRef.value.setData(props.currentRow.qcs || []);
		// 图片信息
		imgsInfoRef.value.setData(
			props.currentRow.skuImgs
				.slice()
				.sort(
					(a: { mainFlag: number }, b: { mainFlag: number }) =>
						b.mainFlag - a.mainFlag
				)
				.map((item: { imgUrl: string; imgFileName: string }) => {
					return {
						...item,
						url: item.imgUrl, // 确保图片地址正确
						fileName: item.imgFileName, // 确保图片文件名正确
					};
				})
		);
	} else {
		useMessage().error('组件未准备好，请稍后再试');
		return;
	}
};
/**
 * 复制SKU的init
 */
export const copyInit = async (
	baseInfoRef: Ref<any>,
	purchaseInfoRef: Ref<any>,
	singleCartonInfoRef: Ref<any>,
	associateProductRef: Ref<any>,
	associateMskuRef: Ref<any>,
	qcsInfoRef: Ref<any>,
	imgsInfoRef: Ref<any>,
	dictMap: { [key: string]: any[] },
	props: any
) => {
	const isReady = await useWaitForRefsReady([
		baseInfoRef,
		purchaseInfoRef,
		singleCartonInfoRef,
		associateProductRef,
		associateMskuRef,
		qcsInfoRef,
		imgsInfoRef,
	]);
	if (isReady) {
		//   赋值baseInfo
		baseInfoRef.value.setData({
			skuCode: '',
			skuName: props.currentRow.skuName,
			spuCode: props.currentRow.spuCode,
			spuName: props.currentRow.spuName,
			categoryCode: props.currentRow.categoryCode,
			brandCode: props.currentRow.brandCode,
			productType: props.currentRow.productType,
			grade: props.currentRow.grade,
			color: props.currentRow.color,
			model: props.currentRow.model,
			productSkuCountryList: props.currentRow.productSkuCountryList?.map(
				(item: any) => item.countryCode
			),
			countryCodeText: props.currentRow.countryCodeText,
			platform: props.currentRow.platforms
				? props.currentRow.platforms.map((item: any) => item.platform)
				: [],
			productManageId: props.currentRow.productManageId,
			skuDeptsText: props.currentRow.skuDepts,
			skuDepts: props.currentRow.skuDepts?.map((item: any) => {
				return item.deptId;
			}),
			specialAttribute: props.currentRow.specialAttribute?.split(','),
			attributeDesc: props.currentRow.attributeDesc,
			productDesc: props.currentRow.productDesc,
			attachmentFileName: props.currentRow.attachmentUrls,
		});
		// 赋值purchaseInfo
		purchaseInfoRef.value.setData({
			// 采购负责人
			purchaseManageId: props.currentRow.purchaseManageId,
			// 采购交期
			purchaseLeadTime: props.currentRow.purchaseLeadTime,
			// 参考成本
			referenceCost: props.currentRow.referenceCost,
			// 单品规格的长宽高 长>宽>高
			itemSpecLength: props.currentRow.itemSpecLength,
			itemSpecWidth: props.currentRow.itemSpecWidth,
			itemSpecHeight: props.currentRow.itemSpecHeight,
			// 包装规格的长宽高 长>宽>高
			packSpecLength: props.currentRow.packSpecLength,
			packSpecWidth: props.currentRow.packSpecWidth,
			packSpecHeight: props.currentRow.packSpecHeight,
			// 单品净重
			itemNetWeight: props.currentRow.itemNetWeight,
			// 单品毛重
			itemGrossWeight: props.currentRow.itemGrossWeight,
			// 采购交期单位
			purchaseRemark: props.currentRow.purchaseRemark,
		});

		// 赋值箱规信息 - 复制模式保持原有箱规信息（不清空编码），改为传递标准化对象
		{
			const unitType = String(props.currentRow.cartonUnitType || '1');
			const unitSpec = unitType === '1' ? 'cm' : 'inch';
			const unitWeight = unitType === '1' ? 'kg' : 'lbs';
			const normalized = {
				cartonUnitType: unitType,
				skuCartons: (props.currentRow.skuCartons || []).map((item: any) => ({
					skuCartonCode: item.skuCartonCode || '',
					outCartonSpecLength: item.outCartonSpecLength || '',
					outCartonSpecWidth: item.outCartonSpecWidth || '',
					outCartonSpecHeight: item.outCartonSpecHeight || '',
					outCartonSpecUnit: item.outCartonSpecUnit || unitSpec,
					cartonQty: item.cartonQty || '',
					cartonQtyUnit: item.cartonQtyUnit || 'pcs',
					cartonGrossWeight: item.cartonGrossWeight || '',
					cartonGrossWeightUnit: item.cartonGrossWeightUnit || unitWeight,
					cartonNetWeight: item.cartonNetWeight || '',
					cartonNetWeightUnit: item.cartonNetWeightUnit || unitWeight,
					containerCartonQty: item.containerCartonQty || '',
					containerCartonQtyUnit: item.containerCartonQtyUnit || 'carton',
				})),
			};
			singleCartonInfoRef.value.setData(normalized);
		}

		// 关联辅料
		associateProductRef.value.setData(props.currentRow.materials || []);
		// 关联MSKU
		const setMSKU: Array<{ label: string; value: string; tableData: any[] }> =
			[];

		dictMap.platform?.forEach((item: any) => {
			setMSKU.push({
				label: item.label,
				value: item.value,
				tableData: [],
			});
		});
		associateMskuRef.value.setData(setMSKU);
		// 质检信息
		qcsInfoRef.value.setData(props.currentRow.qcs || []);
		// 图片信息
		imgsInfoRef.value.setData(
			props.currentRow.skuImgs
				.slice()
				.sort(
					(a: { mainFlag: number }, b: { mainFlag: number }) =>
						b.mainFlag - a.mainFlag
				)
				.map((item: { imgUrl: string; imgFileName: string }) => {
					return {
						...item,
						url: item.imgUrl, // 确保图片地址正确
						fileName: item.imgFileName, // 确保图片文件名正确
					};
				})
		);
	} else {
		useMessage().error('组件未准备好，请稍后再试');
		return;
	}
};
