/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-11 09:42:25
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-20 15:57:06
 * @FilePath: \qianyi-ui\src\views\product\product-info\bundle\components\form-dialog\components\rules\purchase-info.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { Rule } from '@form-create/element-ui';
import { rule } from '/@/utils/validate';
export const purchaseInfoRule = {
	// 采购负责人
	purchaseManageId: [
		// {
		// 	required: true,
		// 	message: '请选择采购负责人',
		// 	trigger: 'blur',
		// },
	],
	// 采购交期
	purchaseLeadTime: [
		{ message: '请输入采购交期', trigger: 'blur' },
		{
			validator: rule.number,
		},
	],
	// 参考成本
	referenceCost: [
		{
			message: '请输入参考成本',
			trigger: 'blur',
		},
		{
			validator: rule.number,
		},
		{
			// 允许4位小数的验证规则
			validator: (rule: Rule, value: string, callback: Function) => {
				if (value && !/^\d+(\.\d{1,4})?$/.test(value)) {
					callback(new Error('参考成本最多允许4位小数'));
				} else {
					callback();
				}
			},
			trigger: 'blur',
		},
	],
	// 单品规格的长宽高 长>宽>高
	itemSpecLength: [
		{ required: true, message: '请输入长度', trigger: 'blur' },
		{
			// 允许2位小数的验证规则
			validator: (rule: Rule, value: string, callback: Function) => {
				if (value && !/^\d+(\.\d{1,2})?$/.test(value)) {
					callback(new Error('最多允许2位小数'));
				} else {
					callback();
				}
			},
			trigger: 'blur',
		},
	],
	itemSpecWidth: [
		{ required: true, message: '请输入宽度', trigger: 'blur' },
		{
			// 允许2位小数的验证规则
			validator: (rule: Rule, value: string, callback: Function) => {
				if (value && !/^\d+(\.\d{1,2})?$/.test(value)) {
					callback(new Error('参考成本最多允许2位小数'));
				} else {
					callback();
				}
			},
			trigger: 'blur',
		},
		// {
		// 	// 宽不能大于长度的验证规则
		// 	validator: (rule: Rule, value: string, callback: Function) => {
		// 		if (value && itemSpecLength > itemSpecWidth) {
		// 			callback(new Error('宽度不能大于长度'));
		// 		} else {
		// 			callback();
		// 		}
		// 	},
		// },
	],
	itemSpecHeight: [
		{ required: true, message: '请输入高度', trigger: 'blur' },
		{
			// 允许2位小数的验证规则
			validator: (rule: Rule, value: string, callback: Function) => {
				if (value && !/^\d+(\.\d{1,2})?$/.test(value)) {
					callback(new Error('参考成本最多允许2位小数'));
				} else {
					callback();
				}
			},
			trigger: 'blur',
		},
		// {
		// 	// 高度不能大于宽度的验证规则
		// 	validator: (rule: Rule, value: string, callback: Function, formModel: any) => {
		// 		const itemSpecHeight = formModel.itemSpecHeight;
		// 		const itemSpecWidth = formModel.itemSpecWidth;
		// 		if (!itemSpecWidth) {
		// 			return callback(); // 如果宽度未填写，则不进行校验
		// 		}
		// 		if (value && itemSpecHeight > itemSpecWidth) {
		// 			callback(new Error('高度不能大于宽度'));
		// 		} else {
		// 			callback();
		// 		}
		// 	},
		// },
	],
};
