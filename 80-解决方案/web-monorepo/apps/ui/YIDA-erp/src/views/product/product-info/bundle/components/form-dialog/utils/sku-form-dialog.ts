/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-15 19:55:17
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-02-07 17:25:14
 * @FilePath: \qianyi-ui\src\views\product\product-info\bundle\components\form-dialog\utils\sku-form-dialog.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { useWaitForRefsReady } from '/@/hooks/nextTick';
import { useMessage } from '/@/hooks/message';
import { Ref } from 'vue';
import { useUserInfo } from '/@/stores/userInfo';
/**
 * 新增SKU的init
 */
export const addInit = async (
	baseInfoRef: Ref<any>,
	singleCartonInfoRef: Ref<any>,
	associateSkuRef: Ref<any>,
	associateMskuRef: Ref<any>,
	imgsInfoRef: Ref<any>,
	dictMap: Ref<Record<string, any[]>>,
	avatar: Ref<string>,
	tabsValue: Ref<number>
) => {
	// 定义变量内容
	const stores = useUserInfo();
	const { userInfos } = storeToRefs(stores);
	const isReady = await useWaitForRefsReady([
		baseInfoRef,
		singleCartonInfoRef,
		associateSkuRef,
		associateMskuRef,
		imgsInfoRef,
	]);
	if (isReady) {
		baseInfoRef.value.setData({
			bundleCode: '',
			bundleName: '',
			bundleType: '',
			productBundleCountryList: [],
			platform: [],
			productManageId: userInfos.value.user.userId,
			deptIds: [],
			productDesc: '',
			attachmentFileName: [],
		});
		singleCartonInfoRef.value.setData([]);
		// 关联sku
		associateSkuRef.value.setData([]);
		associateMskuRef.value.setData(
			dictMap.value.platform?.map((item: any) => {
				return {
					label: item.label,
					value: item.value,
					tableData: [],
				};
			})
		);

		imgsInfoRef.value.setData([]);
		avatar.value = '';
		tabsValue.value = 0; // 默认选中基本信息
		// 清空子组件的表单校验;
		await baseInfoRef.value.dataFormRef.clearValidate();
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
	singleCartonInfoRef: Ref<any>,
	associateSkuRef: Ref<any>,
	associateMskuRef: Ref<any>,
	imgsInfoRef: Ref<any>,
	dictMap: Ref<Record<string, any[]>>,
	props: any
) => {
	const isReady = await useWaitForRefsReady([
		baseInfoRef,
		singleCartonInfoRef,
		associateSkuRef,
		associateMskuRef,
		imgsInfoRef,
	]);
	if (isReady) {
		//   赋值baseInfo
		baseInfoRef.value.setData({
			bundleCode: props.currentRow.bundleCode,
			bundleName: props.currentRow.bundleName,
			bundleType: props.currentRow.bundleType,
			productBundleCountryList: props.currentRow.productBundleCountryList?.map(
				(item: any) => item.countryCode
			),
			countryCodeText: props.currentRow.countryCodeText,
			platform: props.currentRow.productBundlePlatforms
				? props.currentRow.productBundlePlatforms.map(
						(item: any) => item.platform
				  )
				: [],
			productManageId: props.currentRow.productManageId,
			deptIds: props.currentRow.deptIds,
			productDesc: props.currentRow.productDesc,
			attachmentFileName: props.currentRow.attachmentUrls,
		});
		// 赋值箱规信息
		{
			const unitType = String(props.currentRow.cartonUnitType || '1');
			const unitSpec = unitType === '1' ? 'cm' : 'inch';
			const unitWeight = unitType === '1' ? 'kg' : 'lbs';
			const normalized = {
				productBundleCartons: (props.currentRow.bundleCartons || []).map(
					(item: any) => ({
						id: item.id || '', // 保留id以便编辑时识别
						bundleCartonCode: item.bundleCartonCode || '',
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
					})
				),
			};
			singleCartonInfoRef.value.setData(normalized);
		}
		// 关联sku
		associateSkuRef.value.setData(props.currentRow.skus || []);
		// 关联MSKU
		const setMSKU: Array<{ label: string; value: string; tableData: any[] }> =
			[];
		dictMap.value.platform?.forEach((item: any) => {
			const mskus = props.currentRow?.mskus.filter(
				(msku: any) => msku.platform === item.value
			);
			setMSKU.push({
				label: item.label,
				value: item.value,
				tableData: mskus.map((item: any) => {
					return {
						...item,
						countryCode: item.countryCode?.split(',') || [],
					};
				}),
			});
		});
		associateMskuRef.value.setData(setMSKU);
		// 图片信息
		imgsInfoRef.value.setData(
			props.currentRow.bundleImgs
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
	singleCartonInfoRef: Ref<any>,
	associateSkuRef: Ref<any>,
	associateMskuRef: Ref<any>,
	imgsInfoRef: Ref<any>,
	dictMap: Ref<Record<string, any[]>>,
	props: any
) => {
	const isReady = await useWaitForRefsReady([
		baseInfoRef,
		singleCartonInfoRef,
		associateSkuRef,
		associateMskuRef,
		imgsInfoRef,
	]);
	if (isReady) {
		//   赋值baseInfo
		baseInfoRef.value.setData({
			bundleCode: '',
			bundleName: '',
			bundleType: props.currentRow.bundleType,
			productBundleCountryList: props.currentRow.productBundleCountryList?.map(
				(item: any) => item.countryCode
			),
			countryCodeText: props.currentRow.countryCodeText,
			platform: props.currentRow.platforms
				? props.currentRow.platforms.map((item: any) => item.platform)
				: [],
			productManageId: props.currentRow.productManageId,
			skuDepts: props.currentRow.skuDepts,
			productDesc: props.currentRow.productDesc,
			attachmentFileName: props.currentRow.attachmentUrls,
		});
		// 赋值箱规信息
		{
			const unitType = String(props.currentRow.cartonUnitType || '1');
			const unitSpec = unitType === '1' ? 'cm' : 'inch';
			const unitWeight = unitType === '1' ? 'kg' : 'lbs';
			const normalized = {
				cartonUnitType: unitType,
				productBundleCartons: (props.currentRow.bundleCartons || []).map(
					(item: any) => ({
						bundleCartonCode: item.bundleCartonCode || '',
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
					})
				),
			};
			singleCartonInfoRef.value.setData(normalized);
		}
		// 关联sku
		associateSkuRef.value.setData(props.currentRow.skus || []);
		// 关联MSKU
		const setMSKU: Array<{
			label: string;
			value: string;
			tableData: any[];
			operationUserId: string;
			deptId: string;
		}> = [];

		dictMap.value.platform?.forEach((item: any) => {
			const mskus = props.currentRow?.mskus.filter(
				(msku: any) => msku.platform === item.value
			);
			setMSKU.push({
				label: item.label,
				value: item.value,
				tableData: mskus,
				// 运营人员id和部门id
				operationUserId: mskus.operationUserId || '',
				deptId: mskus.deptId || '',
			});
		});
		associateMskuRef.value.setData(setMSKU);
		// 图片信息
		imgsInfoRef.value.setData(
			props.currentRow.bundleImgs
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
