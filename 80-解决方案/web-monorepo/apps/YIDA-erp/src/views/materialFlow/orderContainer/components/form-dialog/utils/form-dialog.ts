/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-16 14:20:21
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-04-28 14:42:46
 * @FilePath: \qianyi-ui\src\views\materialFlow\orderContainer\components\form-dialog\utils\form-dialog.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { useWaitForRefsReady } from '/@/hooks/nextTick';
import { Ref } from 'vue';
// import { getPlanFactoryList } from '/@/api/materialFlow/orderContainer';
import { useMessage } from '/@/hooks/message';
import { getFactoryList } from '/@/api/mcp/collectionPlan';
/**
 * 编辑的init
 */
export const editInit = async (
	baseInfo: Ref<any>,
	shippingList: Ref<any>,
	props: any
) => {
	const isReady = await useWaitForRefsReady([baseInfo, shippingList]);
	if (isReady) {
		baseInfo.value.setData({
			id: props.currentRow.id,
			startCountryCode: props.currentRow.startCountryCode,
			destCountryCode: props.currentRow.destCountryCode,
			startPortCode: props.currentRow.startPortCode,
			destPortCode: props.currentRow.destPortCode,
			transportMethod: props.currentRow.transportMethod,
			domesticForwarderNo: props.currentRow.domesticForwarderNo,
			mainForwarderNo: props.currentRow.mainForwarderNo,
			customsForwarderNo: props.currentRow.customsForwarderNo,
			deliveryForwarderNo: props.currentRow.deliveryForwarderNo,
			transshipmentFlag: props.currentRow.transshipmentFlag,
			transshipmentWarehouseCode: props.currentRow.transshipmentWarehouseCode,
			containerType: props.currentRow.containerType,
			soNo: props.currentRow.soNo,
			containerNo: props.currentRow.containerNo,
			sealNo: props.currentRow.sealNo,
			ladingNo: props.currentRow.ladingNo,
			shippingLine: props.currentRow.shippingLine,
			vessel: props.currentRow.vessel,
			voyage: props.currentRow.voyage,
			docCutoffTime: props.currentRow.docCutoffTime,
			customsCutoffTime: props.currentRow.customsCutoffTime,
			estimatedLoadingTime: props.currentRow.estimatedLoadingTime,
			siCutoffTime: props.currentRow.siCutoffTime,
			departureDate: props.currentRow.departureDate,
			estimatedArrivalDate: props.currentRow.estimatedArrivalDate,
			remark: props.currentRow.remark,
			trailerArrangeTime: props.currentRow.trailerArrangeTime,
			licensePlate: props.currentRow.licensePlate,
			driverName: props.currentRow.driverName,
			driverPhone: props.currentRow.driverPhone,
			attachment: props.currentRow.attachmentTriple ?? [],
			loadingPhotoFileUrl: props.currentRow.loadingPhotoFileTriple ?? [],
			factoryDeliveryOrderFileUrl:
				props.currentRow.factoryDeliveryOrderFileTriple ?? [],
			labelingPhotoFileUrl: props.currentRow.labelingPhotoFileTriple ?? [],
			emptyContainerWeight: props.currentRow.emptyContainerWeight,
		});
		baseInfo.value.initData();
		shippingList.value.setData(props.currentRow?.deliveryVOList || []);
		// 设置装柜顺序回显 + 工厂下拉选项
		try {
			// 1) 计算表格中过滤出的不同工厂ID集合
			const tableFactoryIds: any[] = Array.from(
				new Set(
					(props.currentRow?.deliveryVOList || [])
						.map((r: any) => r.factoryId)
						.filter((v: any) => v !== undefined && v !== null && v !== '')
				)
			);
			const res = await getFactoryList({ factoryIds: tableFactoryIds });
			const options = res?.data || [];
			shippingList.value.setFactoryOptions(options);
			// 回显装柜顺序
			if (
				Array.isArray(props.currentRow.loadContainerSort) &&
				props.currentRow.loadContainerSort.length > 0
			) {
				const idToOption = new Map<any, any>();
				options.forEach((o: any) => idToOption.set(o.id ?? o.factoryId, o));
				const orderList = props.currentRow.loadContainerSort.map((id: any) => {
					const o = idToOption.get(id) || {};
					return {
						id,
						factoryId: o.factoryId ?? id,
						factoryName: o.factoryName ?? '',
						factoryAddress: o.factoryAddress ?? '',
						...o,
					};
				});
				shippingList.value.setLoadContainerSort(orderList);
			} else {
				shippingList.value.setLoadContainerSort([]);
			}
		} catch (e) {
			useMessage().error('组件未准备好，请稍后再试');
		}
	}
};
