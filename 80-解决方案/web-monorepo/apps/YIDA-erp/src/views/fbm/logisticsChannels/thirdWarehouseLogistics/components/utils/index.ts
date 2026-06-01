/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-16 17:50:04
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-03-12 14:39:49
 * @FilePath: \qianyi-ui\src\views\fbm\logisticsChannels\thirdWarehouseLogistics\components\utils\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { useMessage } from '/@/hooks/message';
import {
	saveLogisticsChannel,
	updateLogisticsChannel,
} from '/@/api/fbm/logisticsChannel/thirdWarehouseLogistics/index';

// 重置表单
export function addInit(formData: any, formRef: any) {
	formRef.value?.resetFields();
	formData.value = {
		warehouseCodes: '',
		logisticsChannelName: '',
		logisticsChannelCode: '',
		feeLogisticsChannelId: '',
		status: '',
		selfPickupFlag: '',
		selfPickupConfig: [],
		remark: '',
	};
}
/**
 * 编辑SKU的init
 */
export const editInit = async (formData: any, currentRow: any) => {
	// 回显数据
	formData.value = {
		warehouseCodes: currentRow.warehouseCode,
		logisticsChannelName: currentRow.logisticsChannelName,
		logisticsChannelCode: currentRow.logisticsChannelCode,
		feeLogisticsChannelIds: currentRow.feeLogisticsChannelIds,
		feeLogisticsChannelId: currentRow.feeLogisticsChannelId,
		status: currentRow.status,
		selfPickupFlag: currentRow.selfPickupFlag,
		selfPickupConfig: currentRow.selfPickupConfig,
		remark: currentRow.remark,
	};
};

/**
 * 添加表单的init
 */
export const addFormInit = async (
	formData: any,
	postData: any,
	visibleType: any,
	currentRow: any,
	handleClose: Function
) => {
	const api =
		visibleType === 'add' ? saveLogisticsChannel : updateLogisticsChannel;
	const params = {
		id: visibleType === 'add' ? '' : currentRow.id,
		warehouseCode: formData.warehouseCodes,
		logisticsChannelName: formData.logisticsChannelName,
		logisticsChannelCode: formData.logisticsChannelCode,
		feeLogisticsChannelId: formData.feeLogisticsChannelIds?.join(','),
		logisticsProductName: formData.logisticsProductName,
		status: formData.status,
		selfPickupFlag: formData.selfPickupFlag,
		selfPickupConfig: formData.selfPickupConfig,
		remark: formData.remark,
		mappings: postData.mappingSaveList,
	};
	const res = await api(params);
	if (res.code === 0) {
		useMessage().success(res.msg || '操作成功');
		handleClose();
	}
};
