import { useWaitForRefsReady } from '/@/hooks/nextTick';
import { useMessage } from '/@/hooks/message';
import { Ref } from 'vue';
import { useUserInfo } from '/@/stores/userInfo';
/**
 * 新增辅料的init
 */
export const addInit = async (
	baseInfoRef: Ref<any>,
	purchaseInfoRef: Ref<any>,
	singleCartonInfoRef: Ref<any>,
	imgsInfoRef: Ref<any>,
	avatar: Ref<string>,
	tabsValue: Ref<number>
) => {
	const stores = useUserInfo();
	const { userInfos } = storeToRefs(stores);
	const isReady = await useWaitForRefsReady([baseInfoRef, purchaseInfoRef, singleCartonInfoRef, imgsInfoRef]);
	if (isReady) {
		baseInfoRef.value.setData({
			materialCode: '',
			materialName: '',
			materialType: '',
			productManageId: userInfos.value.user.userId,
			materialDesc: '',
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
		singleCartonInfoRef.value.setData({
			// 单箱数量
			singleCartonQty: '',
			// 外箱规格
			outCartonSpecLength: '',
			outCartonSpecWidth: '',
			outCartonSpecHeight: '',
			// 单箱重量
			singleCartonWeight: '',
			// 单柜装箱数
			containerCartonQty: '',
		});
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
 * 编辑辅料的init
 */
export const editInit = async (
	baseInfoRef: Ref<any>,
	purchaseInfoRef: Ref<any>,
	singleCartonInfoRef: Ref<any>,
	imgsInfoRef: Ref<any>,
	props: any
) => {
	const isReady = await useWaitForRefsReady([baseInfoRef, purchaseInfoRef, singleCartonInfoRef, imgsInfoRef]);
	if (isReady) {
		//   赋值baseInfo
		baseInfoRef.value.setData({
			status: props.currentRow.status,
			materialCode: props.currentRow.materialCode,
			materialName: props.currentRow.materialName,
			materialType: props.currentRow.materialType,
			productManageId: props.currentRow.productManageId,
			materialDesc: props.currentRow.materialDesc,
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
		// 赋值箱规信息
		singleCartonInfoRef.value.setData({
			// 单箱数量
			singleCartonQty: props.currentRow.singleCartonQty,
			// 外箱规格
			outCartonSpecLength: props.currentRow.outCartonSpecLength,
			outCartonSpecWidth: props.currentRow.outCartonSpecWidth,
			outCartonSpecHeight: props.currentRow.outCartonSpecHeight,
			// 单箱重量
			singleCartonWeight: props.currentRow.singleCartonWeight,
			// 单柜装箱数
			containerCartonQty: props.currentRow.containerCartonQty,
		});
		// 图片信息
		imgsInfoRef.value.setData(
			props.currentRow.materialImgs
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
 * 复制辅料的init
 */
export const copyInit = async (
	baseInfoRef: Ref<any>,
	purchaseInfoRef: Ref<any>,
	singleCartonInfoRef: Ref<any>,
	imgsInfoRef: Ref<any>,
	props: any
) => {
	const isReady = await useWaitForRefsReady([baseInfoRef, purchaseInfoRef, singleCartonInfoRef, imgsInfoRef]);
	if (isReady) {
		//   赋值baseInfo
		baseInfoRef.value.setData({
			materialCode: '',
			materialName: '',
			materialType: props.currentRow.materialType,
			productManageId: props.currentRow.productManageId,
			materialDesc: props.currentRow.materialDesc,
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
		// 赋值箱规信息
		singleCartonInfoRef.value.setData({
			// 单箱数量
			singleCartonQty: props.currentRow.singleCartonQty,
			// 外箱规格
			outCartonSpecLength: props.currentRow.outCartonSpecLength,
			outCartonSpecWidth: props.currentRow.outCartonSpecWidth,
			outCartonSpecHeight: props.currentRow.outCartonSpecHeight,
			// 单箱重量
			singleCartonWeight: props.currentRow.singleCartonWeight,
			// 单柜装箱数
			containerCartonQty: props.currentRow.containerCartonQty,
		});
		// 图片信息
		imgsInfoRef.value.setData(
			props.currentRow.materialImgs
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
