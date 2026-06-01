/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-25 15:12:39
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-08-15 09:54:30
 * @FilePath: \qianyi-ui\src\views\purchase\entity\components\utils\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
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
		name: '', //法人主体名称
		shortName: '', //法人主体简称
		contact: '', //联系人
		email: '', //邮箱
		phone: '', //联系电话
		address: '', //地址
		taxIdNumber: '', //税号
		bank: '', //开户行
		bankAccountNumber: '', //银行账号
		officialSealUrl: '', //公章url
	};
}
/**
 * 编辑SKU的init
 */
export const editInit = async (formData: any, currentRow: any) => {
	formData.value = {
		id: currentRow.id, //法人主体ID
		name: currentRow.name, //法人主体名称
		shortName: currentRow.shortName, //法人主体简称
		contact: currentRow.contact, //联系人
		email: currentRow.email, //邮箱
		phone: currentRow.phone, //联系电话
		address: currentRow.address, //地址
		taxIdNumber: currentRow.taxIdNumber, //税号
		bank: currentRow.bank, //开户行
		bankAccountNumber: currentRow.bankAccountNumber, //银行账号
		officialSealUrl: currentRow.officialSealUrl, //公章url
	};
};
