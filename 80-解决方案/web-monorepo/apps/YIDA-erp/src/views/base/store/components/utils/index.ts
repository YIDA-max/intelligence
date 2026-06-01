/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-25 15:12:39
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-02-27 17:45:48
 * @FilePath: \qianyi-ui\src\views\purchase\supplierSku\components\utils\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { useMessage } from '/@/hooks/message';
import { saveStoreInfo, updateStoreInfo } from '/@/api/base/store/index';

// 重置表单
export function addInit(formData: any, formRef: any) {
	formRef.value?.resetFields();
	formData.value = {
		storeName: '',
		legalPersonId: '',
		storeAlias: '',
		platformChannelCode: '',
		siteCode: '',
		managerId: '',
		deptId: '',
		accountingLegalPersonId: '',
	};
}
/**
 * 编辑SKU的init
 */
export const editInit = async (formData: any, currentRow: any) => {
	// 回显数据
	formData.value = {
		storeName: currentRow.storeName,
		accountingLegalPersonId: currentRow.accountingLegalPersonId,
		legalPersonId: currentRow.legalPersonId,
		storeAlias: currentRow.storeAlias,
		platformChannelCode: currentRow.platformChannelCode,
		siteCode: currentRow.siteCode,
		managerId: currentRow.managerId,
		deptId: currentRow.deptId,
	};
};

/**
 * 添加表单的init
 */
export const addFormInit = async (
	formData: any,
	visibleType: any,
	currentRow: any,
	handleClose: Function
) => {
	const api = visibleType === 'add' ? saveStoreInfo : updateStoreInfo;
	const params = {
		id: visibleType === 'add' ? '' : currentRow.id,
		storeName: formData.storeName,
		accountingLegalPersonId: formData.accountingLegalPersonId,
		legalPersonId: formData.legalPersonId,
		storeAlias: formData.storeAlias,
		platformChannelCode: formData.platformChannelCode,
		siteCode: formData.siteCode,
		managerId: formData.managerId,
		deptId: formData.deptId,
	};
	const res = await api(params);
	if (res.code === 0) {
		useMessage().success(res.msg || '操作成功');
		handleClose();
	}
};
