/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-25 15:12:39
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-08-25 19:46:46
 * @FilePath: \qianyi-ui\src\views\tiktok\cooperation\components\utils\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */

// 重置表单
export function addInit(formData: any, formRef: any) {
	formRef.value?.resetFields();
	formData.value = {
		influencerName: '', // 达人名称
		spu: '', // SPU
		cooperationDate: '', // 合作日期
		cooperationFee: '', // 合作费用
		commissionRate: '', // 佣金比例
		approver: '', // 跟进人
		progress: '', // 进度
		store: '', // 店铺
		remark: '', // 备注
	};
}
/**
 * 编辑SKU的init
 */
export const editInit = async (formData: any, currentRow: any) => {
	formData.value = {
		influencerName: currentRow.influencerName, // 达人名称
		spu: currentRow.spu, // SPU
		cooperationDate: currentRow.cooperationDate, // 合作日期
		cooperationFee: currentRow.cooperationFee, // 合作费用
		commissionRate: currentRow.commissionRate, // 佣金比例
		approver: currentRow.approver, // 跟进人
		progress: currentRow.progress, // 进度
		store: currentRow.store, // 店铺
		remark: currentRow.remark, // 备注
	};
};
