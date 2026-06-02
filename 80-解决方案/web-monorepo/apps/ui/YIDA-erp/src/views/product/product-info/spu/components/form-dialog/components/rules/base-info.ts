/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-11 09:42:25
 * @LastEditors: 朱寒松 3136271519@qq.com
 * @LastEditTime: 2025-07-22 21:03:22
 * @FilePath: \qianyi-ui\src\views\product\product-info\spu\components\form-dialog\components\rules\base-info.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { rule } from '/@/utils/validate';
export const baseInfoRule = {
	// SPU编码
	spuCode: [
		{
			required: true,
			message: '请输入SPU编码',
			trigger: 'blur',
		},
		{ validator: rule.validatorCode, trigger: 'blur' },
	],
	// 产品名称
	spuName: [
		{
			required: true,
			message: '请输入产品名称',
			trigger: 'blur',
		},
		{
			validator: rule.validateLength,
			trigger: 'blur',
		},
	],
	// 产品类型
	productType: [
		{
			required: true,
			message: '请选择产品类型',
			trigger: 'blur',
		},
	],
	// 产品等级
	grade: [
		{
			required: true,
			message: '请选择产品等级',
			trigger: 'blur',
		},
	],
	// 颜色
	color: [
		{
			required: true,
			message: '请选择颜色',
			trigger: 'blur',
		},
	],
	// 型号
	model: [
		{
			required: true,
			message: '请输入型号',
			trigger: 'blur',
		},
	],
	// 销售地区
	saleArea: [
		{
			required: true,
			message: '请选择销售地区',
			trigger: 'blur',
		},
	],
	// 平台
	platform: [
		{
			required: true,
			message: '请选择平台',
			trigger: 'blur',
		},
	],
	// 产品负责人
	productManageId: [
		{
			required: true,
			message: '请选择产品负责人',
			trigger: 'blur',
		},
	],
};
