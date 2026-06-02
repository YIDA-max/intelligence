/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-11 09:42:25
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-11-20 14:04:04
 * @FilePath: \qianyi-ui\src\views\product\product-info\bundle\components\form-dialog\components\rules\base-info.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { rule } from '/@/utils/validate';
export const baseInfoRule = {
	// 捆绑编码
	bundleCode: [
		{
			required: true,
			message: '请输入捆绑编码',
			trigger: 'blur',
		},
	],
	// 捆绑品名
	bundleName: [
		{
			required: true,
			message: '请输入捆绑品名',
			trigger: 'blur',
		},
		{
			validator: rule.validateLength,
			trigger: 'blur',
		},
	],
	// 捆绑类型
	bundleType: [
		{
			required: true,
			message: '请选择捆绑类型',
			trigger: 'blur',
		},
	],
	// 品牌
	brandCode: [
		{
			required: true,
			message: '请选择品牌',
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
	// saleArea: [
	// 	{
	// 		required: true,
	// 		message: '请选择销售地区',
	// 		trigger: 'blur',
	// 	},
	// ],
	// 销售国家
	productBundleCountryList: [
		{
			required: true,
			message: '请选择销售国家',
			trigger: 'blur',
		},
	],
	// 平台
	platform: [
		{
			required: true,
			message: '请选择销售渠道',
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
