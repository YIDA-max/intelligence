/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-25 15:12:39
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-09-09 15:49:33
 * @FilePath: \qianyi-ui\src\views\purchase\supplierSku\components\utils\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { useMessage } from '/@/hooks/message';
import { saveSupplierInfo, updateSupplierInfo } from '/@/api/base/supplier/index';

// 重置表单
export function addInit(formData: any, formRef: any) {
	formRef.value?.resetFields();
	formData.value = {
		supplierNo: '', // 供应商编号
		name: '', // 供应商名称
		status: '', // 状态
		purchaseUserId: '', // 我方采购员ID
		fax: '', // 供应商传真
		email: '', // 邮箱
		qq: '', // QQ
		developerId: '', // 开发员
		remark: '', // 备注
		file: [], // 附件
	};
}
/**
 * 编辑SKU的init
 */
export const editInit = async (formData: any, currentRow: any) => {
	// 回显数据
	formData.value = {
		supplierNo: currentRow.supplierNo, // 供应商编号
		name: currentRow.name, // 供应商名称
		status: currentRow.status, // 状态
		purchaseUserId: currentRow.purchaseUserId, // 我方采购员ID
		fax: currentRow.fax, // 供应商传真
		email: currentRow.email, // 邮箱
		qq: currentRow.qq, // QQ
		developerId: currentRow.developerId, // 开发员
		remark: currentRow.remark, // 备注
		file: currentRow.file || [], // 附件
	};
};

/**
 * 添加表单的init
 */
export const addFormInit = async (formData: any, visibleType: any, currentRow: any, handleClose: Function) => {
	const api = visibleType === 'add' ? saveSupplierInfo : updateSupplierInfo;
	const params = {
		id: visibleType === 'add' ? '' : currentRow.id, // 供应商ID
		supplierNo: formData.supplierNo, // 供应商编号
		name: formData.name, // 供应商名称
		status: formData.status, // 状态
		purchaseUserId: formData.purchaseUserId, // 我方采购员ID
		fax: formData.fax, // 供应商传真
		email: formData.email, // 邮箱
		qq: formData.qq, // QQ
		developerId: formData.developerId, // 开发员
		remark: formData.remark, // 备注
		file: formData.file?.map((item: string) => (typeof item === 'string' && item.includes('fileName=') ? item.split('fileName=')[1] : item)) || [], // 附件
		addressList: formData.addressList,
	};
	const res = await api(params);
	if (res.code === 0) {
		useMessage().success(res.msg || '操作成功');
		handleClose();
	}
};
