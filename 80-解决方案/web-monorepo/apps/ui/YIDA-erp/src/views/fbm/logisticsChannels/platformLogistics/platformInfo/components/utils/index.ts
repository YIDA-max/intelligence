/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-25 15:12:39
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-09-19 15:44:11
 * @FilePath: \qianyi-ui\src\views\warehouse\warehouseInfo\platformChannelWarehouse\components\platform-channel-warehouse-info\components\utils\index.ts
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
export function addInit(formRef: any, formData: any, spWhCodeList: any, currentSpInfo: any) {
	formRef.value?.resetFields();
	formData.value = {
		id: '', // 仓库ID
		warehouseCode: '', // 仓库代码
		warehouseName: '', // 仓库名称
		warehouseType: '2', // 仓库类型
		companyName: '', // 公司名称
		warehousePortCode: '', // 就近港口
		platformChannelCode: '', // 平台渠道
		contact: '', // 联系人
		phone: '', // 联系电话
		countryCode: '100000', // 国家
		provinceCode: '', // 省/州
		cityCode: '', // 市/府
		districtCode: '', // 区/县
		postCode: '', // 邮编
		address1: '', // 地址1
		address2: '', // 地址2
	};
	spWhCodeList.value = []; // 清空对接仓库代码列表
	currentSpInfo.value = {}; // 清空当前服务商信息
}
/**
 * 编辑SKU的init
 */
export const editInit = async (formData: any, currentData: any) => {
	formData.value = {
		id: currentData.id, // 仓库ID
		warehouseCode: currentData.warehouseCode, // 仓库代码
		warehouseName: currentData.warehouseName, // 仓库名称
		warehouseType: currentData.warehouseType, // 仓库类型
		companyName: currentData.companyName, // 公司名称
		warehousePortCode: currentData.warehousePortCode, // 就近港口
		platformChannelCode: currentData.platformChannelCode, // 平台渠道
		contact: currentData.contact, // 联系人
		phone: currentData.phone, // 联系电话
		countryCode: currentData.countryCode, // 国家
		provinceCode: currentData.provinceCode, // 省/州
		cityCode: currentData.cityCode, // 市/府
		districtCode: currentData.districtCode, // 区/县
		postCode: currentData.postCode, // 邮编
		address1: currentData.address1, // 地址1
		address2: currentData.address2, // 地址2
	};
};
