/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-15 19:55:17
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-09-05 18:26:29
 * @FilePath: \qianyi-ui\src\views\product\product-info\spu\components\form-dialog\utils\sku-form-dialog.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { useWaitForRefsReady } from '/@/hooks/nextTick';
import { useMessage } from '/@/hooks/message';
import { Ref } from 'vue';
import { useUserInfo } from '/@/stores/userInfo';
/**
 * 新增SPU的init
 */
export const addInit = async (
	baseInfoRef: Ref<any>,
	associateSkuRef: Ref<any>,
	imgsInfoRef: Ref<any>,
	avatar: Ref<string>,
	tabsValue: Ref<number>
) => {
	// 定义变量内容
	const stores = useUserInfo();
	const { userInfos } = storeToRefs(stores);
	const isReady = await useWaitForRefsReady([baseInfoRef, associateSkuRef, imgsInfoRef]);
	if (isReady) {
		baseInfoRef.value.setData({
			spuCode: '',
			spuName: '',
			categoryCode: '',
			brandCode: '',
			productType: '',
			productManageId: userInfos.value.user.userId,
			productDesc: '',
			productSkus: [],
			attachmentFileName: [],
		});
		associateSkuRef.value.setData([]);
		imgsInfoRef.value.setData([]);
		avatar.value = '';
		tabsValue.value = 0; // 默认选中基本信息
		// 清空子组件的表单校验;
		await baseInfoRef.value.dataFormRef.clearValidate();

		return;
	} else {
		useMessage().error('组件未准备好，请稍后再试');
		return;
	}
};
/**
 * 编辑SPU的init
 */
export const editInit = async (baseInfoRef: Ref<any>, associateSkuRef: Ref<any>, imgsInfoRef: Ref<any>, props: any) => {
	const isReady = await useWaitForRefsReady([baseInfoRef, associateSkuRef, imgsInfoRef]);
	if (isReady) {
		//   赋值baseInfo
		baseInfoRef.value.setData({
			spuCode: props.currentRow.spuCode,
			spuName: props.currentRow.spuName,
			categoryCode: props.currentRow.categoryCode,
			brandCode: props.currentRow.brandCode,
			productType: props.currentRow.productType,
			productManageId: props.currentRow.productManageId,
			productDesc: props.currentRow.productDesc,
			attachmentFileName: props.currentRow.attachmentUrls,
		});
		// 关联sku
		associateSkuRef.value.setData(props.currentRow.productSkus || []);
		// 图片信息
		imgsInfoRef.value.setData(
			props.currentRow.spuImgs
				.slice()
				.sort((a: { mainFlag: number }, b: { mainFlag: number }) => b.mainFlag - a.mainFlag)
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
 * 复制SPU的init
 */
export const copyInit = async (baseInfoRef: Ref<any>, associateSkuRef: Ref<any>, imgsInfoRef: Ref<any>, props: any) => {
	const isReady = await useWaitForRefsReady([baseInfoRef, associateSkuRef, imgsInfoRef]);
	if (isReady) {
		//   赋值baseInfo
		baseInfoRef.value.setData({
			spuCode: '',
			spuName: '',
			categoryCode: props.currentRow.categoryCode,
			brandCode: props.currentRow.brandCode,
			productType: props.currentRow.productType,
			productManageId: props.currentRow.productManageId,
			productDesc: props.currentRow.productDesc,
			attachmentFileName: props.currentRow.attachmentFileName,
		});
		// 关联sku
		associateSkuRef.value.setData([]);
		// 图片信息
		imgsInfoRef.value.setData(
			props.currentRow.spuImgs
				.slice()
				.sort((a: { mainFlag: number }, b: { mainFlag: number }) => b.mainFlag - a.mainFlag)
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
