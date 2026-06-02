/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-25 15:12:39
 * @LastEditors: 朱寒松 3136271519@qq.com
 * @LastEditTime: 2025-08-05 17:08:44
 * @FilePath: \qianyi-ui\src\views\purchase\supplierSku\components\utils\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { useMessage } from '/@/hooks/message';
import { postSupplierSkuSave, postSupplierSkuUpdate } from '/@/api/purchase/supplierSku/index';
export const spWhSyncTimeArr = [
	{ value: 0, label: '00:00' },
	{ value: 1, label: '01:00' },
	{ value: 2, label: '02:00' },
	{ value: 3, label: '03:00' },
	{ value: 4, label: '04:00' },
	{ value: 5, label: '05:00' },
	{ value: 6, label: '06:00' },
	{ value: 7, label: '07:00' },
	{ value: 8, label: '08:00' },
	{ value: 9, label: '09:00' },
	{ value: 10, label: '10:00' },
	{ value: 11, label: '11:00' },
	{ value: 12, label: '12:00' },
	{ value: 13, label: '13:00' },
	{ value: 14, label: '14:00' },
	{ value: 15, label: '15:00' },
	{ value: 16, label: '16:00' },
	{ value: 17, label: '17:00' },
	{ value: 18, label: '18:00' },
	{ value: 19, label: '19:00' },
	{ value: 20, label: '20:00' },
	{ value: 21, label: '21:00' },
	{ value: 22, label: '22:00' },
	{ value: 23, label: '23:00' },
];

// 重置表单
export function addInit(formData: any, formRef: any) {
	formRef.value?.resetFields();
	formData.value = {
		supplierNo: '', // 供应商编号
		purchaseUserId: '', // 采购人ID
		skuCode: '', // sku编码
		supplierProductRemark: '', // 供应商产品备注
		wrapperFlag: '', // 是否含包材
		currency: '', // 货币
		effectiveTaxRate: '', // 实际税率
		invoiceType: '', // 发票类型
		couponRate: '', // 票面税率
		taxRefundRate: '', // 退税率
		ladderFlag: '', // 是否梯度报价
		ladderList: [], // 梯度列表
		unitPriceWithoutTax: '', // 不含税单价
		tax: '', // 税额
		unitPriceIncludingTax: '', // 含税单价
		returnUnitPriceTax: '', // 单品可退税额
		quoteRemark: '', // 报价备注
		file: [], // 附件
	};
}
/**
 * 编辑SKU的init
 */
export const editInit = async (formData: any, currentRow: any) => {
	formData.value = {
		supplierNo: currentRow.supplierNo, // 供应商编号
		purchaseUserId: currentRow.purchaseUserId, // 采购人ID
		skuCode: currentRow.skuCode, // sku编码
		supplierProductRemark: currentRow.supplierProductRemark, // 供应商产品备注
		wrapperFlag: currentRow.wrapperFlag, // 是否含包材
		currency: currentRow.currency, // 货币
		effectiveTaxRate: currentRow.effectiveTaxRate, // 实际税率
		invoiceType: currentRow.invoiceType, // 发票类型
		couponRate: currentRow.couponRate, // 票面税率
		taxRefundRate: currentRow.taxRefundRate, // 退税率
		ladderFlag: currentRow.ladderFlag, // 是否梯度报价
		ladderList: currentRow.ladderList || [], // 梯度列表
		unitPriceWithoutTax: currentRow.unitPriceWithoutTax, // 不含税单价
		tax: currentRow.tax, // 税额
		unitPriceIncludingTax: currentRow.unitPriceIncludingTax, // 含税单价
		returnUnitPriceTax: currentRow.returnUnitPriceTax, // 单品可退税额
		quoteRemark: currentRow.quoteRemark, // 报价备注
		file: currentRow.file || [], // 附件
	};
};

/**
 * 添加表单的init
 */
export const addFormInit = async (formData: any, visibleType: any, currentRow: any, handleClose: Function) => {
	const api = visibleType === 'add' ? postSupplierSkuSave : postSupplierSkuUpdate;
	// 手动把梯度列表的第一个元素的最大数量设置为默认最大
	if (formData.value?.ladderList && formData.value.ladderList.length > 0) {
		formData.value.ladderList[formData.value.ladderList.length - 1].maxNum = 99999999;
	}
	// 手动把梯度列表的第一个元素的最小数量设置为0
	if (formData.value?.ladderList && formData.value.ladderList.length > 0) {
		formData.value.ladderList[0].minNum = 0;
	}
	const params = {
		id: visibleType === 'add' ? '' : currentRow.id, // 供应商ID
		supplierNo: formData.value.supplierNo, // 供应商编号
		purchaseUserId: formData.value.purchaseUserId, // 采购人ID
		skuCode: formData.value.skuCode, // sku编码
		supplierProductRemark: formData.value.supplierProductRemark, // 供应商产品备注
		wrapperFlag: formData.value.wrapperFlag, // 是否含包材
		currency: formData.value.currency, // 货币
		effectiveTaxRate: formData.value.effectiveTaxRate, // 实际税率
		invoiceType: formData.value.invoiceType, // 发票类型
		couponRate: formData.value.couponRate, // 票面税率
		taxRefundRate: formData.value.taxRefundRate, // 退税率
		ladderFlag: formData.value.ladderFlag, // 是否梯度报价
		ladderList: formData.value.ladderList, // 梯度列表
		unitPriceWithoutTax: formData.value.unitPriceWithoutTax, // 不含税单价
		tax: formData.value.tax, // 税额
		unitPriceIncludingTax: formData.value.unitPriceIncludingTax, // 含税单价
		returnUnitPriceTax: formData.value.returnUnitPriceTax, // 单品可退税额
		quoteRemark: formData.value.quoteRemark, // 报价备注
		file:
			formData.value.file?.map((item: string) => (typeof item === 'string' && item.includes('fileName=') ? item.split('fileName=')[1] : item)) || [], // 附件
	};
	const res = await api(params);
	if (res.code === 0) {
		useMessage().success(res.msg || '操作成功');
		handleClose();
	}
};
