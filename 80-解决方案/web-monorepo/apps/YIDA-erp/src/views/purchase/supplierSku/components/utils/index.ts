/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-25 15:12:39
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-12-16 16:17:13
 * @FilePath: \qianyi-ui\src\views\purchase\supplierSku\components\utils\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { useMessage } from '/@/hooks/message';
import {
	postSupplierSkuSave,
	postSupplierSkuUpdate,
} from '/@/api/purchase/supplierSku/index';
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
		planUserId: '', // 主计划ID
		skuCode: '', // sku编码
		supplierProductRemark: '', // 供应商产品备注
		wrapperFlag: '', // 是否含包材
		purchaseDeliveryDays: '', // 采购交期
		minimumOrder: '', // 最小起订量
		currency: '', // 货币
		effectiveTaxRate: '', // 实际税率
		invoiceType: '', // 发票类型
		couponRate: '', // 票面税率
		taxRefundRate: '', // 退税率
		ladderFlag: 0, // 是否梯度报价
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
	// 手动删除最后的梯度列表的最大值999999999
	if (currentRow.ladderList && currentRow.ladderList.length > 0) {
		const lastIndex = currentRow.ladderList.length - 1;
		if (currentRow.ladderList[lastIndex].maxNum === 999999999) {
			currentRow.ladderList[lastIndex].maxNum = null; // 或者设置为 ''，根据你的需求
		}
	}
	// 回显数据
	formData.value = {
		supplierNo: currentRow.supplierNo, // 供应商编号
		purchaseUserId: currentRow.purchaseUserId, // 采购人ID
		planUserId: currentRow.planUserId, // 主计划ID
		skuCode: currentRow.skuCode, // sku编码
		supplierProductRemark: currentRow.supplierProductRemark, // 供应商产品备注
		purchaseDeliveryDays: currentRow.purchaseDeliveryDays, // 采购交期
		minimumOrder: currentRow.minimumOrder, // 最小起订量
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
export const addFormInit = async (
	formData: any,
	visibleType: any,
	currentRow: any,
	handleClose: Function
) => {
	const api =
		visibleType === 'add' ? postSupplierSkuSave : postSupplierSkuUpdate;
	const ladderList = JSON.parse(
		JSON.stringify(formData.value?.ladderList || [])
	);
	// 最后的梯度列表的最大值如果不是空，就提示错误
	// 处理梯度列表最后一个报价的结束数量（maxNum）
	if (ladderList?.length > 0) {
		const lastIndex = ladderList.length - 1;
		const lastLadder = ladderList[lastIndex];
		// 定义「空值」的判断条件（覆盖所有用户可能输入的空场景）
		const isMaxNumEmpty =
			lastLadder.maxNum === undefined ||
			lastLadder.maxNum === null ||
			lastLadder.maxNum === '' ||
			(typeof lastLadder.maxNum === 'string' &&
				lastLadder.maxNum.trim() === ''); // 处理空格字符串

		if (isMaxNumEmpty) {
			// 强制补全为 999999999（数字类型），确保后续逻辑使用数字
			ladderList[lastIndex] = {
				...lastLadder, // 保留原数据的其他字段（如 minNum、单价等）
				maxNum: 999999999, // 显式设置为数字类型（非字符串）
			};

			// 可选：如果需要强制覆盖用户输入的空值（如用户输入了空格或其他无效值）
			// 可在此处添加额外逻辑（如清空历史记录或标记为系统默认值）
		} else {
			// 如果最后一个元素的maxNum不是空值，提示用户必须为空
			// useMessage().warning('梯度列表的最后的阶梯报价必须是到正无穷');
			// return;
		}

		// 后续逻辑（如继续处理梯度列表...）
	}

	//  梯度列表的下一个元素的最小数量要等于上一个元素的最大数量
	if (ladderList && ladderList.length > 1) {
		for (let i = 0; i < ladderList.length - 1; i++) {
			if (
				Number(ladderList[i + 1].minNum) !==
				Number(ladderList[i].maxNum) + 1
			) {
				useMessage().error(
					`梯度列表的第${i + 2}个元素的最小数量必须等于第${
						i + 1
					}个元素的最大数量+1`
				);
				return;
			}
		}
	}
	//  梯度列表的下一个元素的最大数量不能小于上一个
	const params = {
		id: visibleType === 'add' ? '' : currentRow.id, // 供应商ID
		supplierNo: formData.value.supplierNo, // 供应商编号
		purchaseUserId: formData.value.purchaseUserId, // 采购人ID
		planUserId: formData.value.planUserId, // 主计划ID
		skuCode: formData.value.skuCode, // sku编码
		supplierProductRemark: formData.value.supplierProductRemark, // 供应商产品备注
		wrapperFlag: formData.value.wrapperFlag, // 是否含包材
		purchaseDeliveryDays: formData.value.purchaseDeliveryDays, // 采购交期
		minimumOrder: formData.value.minimumOrder, // 最小起订量
		currency: formData.value.currency, // 货币
		effectiveTaxRate: formData.value.effectiveTaxRate, // 实际税率
		invoiceType: formData.value.invoiceType, // 发票类型
		couponRate: formData.value.couponRate, // 票面税率
		taxRefundRate: formData.value.taxRefundRate, // 退税率
		ladderFlag: formData.value.ladderFlag, // 是否梯度报价
		ladderList: ladderList, // 梯度列表
		unitPriceWithoutTax: formData.value.unitPriceWithoutTax, // 不含税单价
		tax: formData.value.tax, // 税额
		unitPriceIncludingTax: formData.value.unitPriceIncludingTax, // 含税单价
		returnUnitPriceTax: formData.value.returnUnitPriceTax, // 单品可退税额
		quoteRemark: formData.value.quoteRemark, // 报价备注
		file:
			formData.value.file?.map((item: string) =>
				typeof item === 'string' && item.includes('fileName=')
					? item.split('fileName=')[1]
					: item
			) || [], // 附件
	};
	const res = await api(params);
	if (res.code === 0) {
		useMessage().success(res.msg || '操作成功');
		handleClose();
	}
};
