/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-11-14 09:45:08
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-11-27 19:30:20
 * @FilePath: \qianyi-ui\src\views\fbm\selfOrder\components\tableColumnExpand\expand-order-action\shipToFBA\utils\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
export const setData = (currentRow: any, formDataValue: any) => {
	//  把currentRow的数据设置到formDataValue中
	Object.keys(currentRow).forEach((key) => {
		formDataValue[key] = currentRow[key];
	});
	// 设置平台渠道编码(应该是默认是亚马逊的)
	formDataValue.platformChannelCode = 'Amazon';
	// 平台订单号也就是卖家订单号
	formDataValue.platformOrderNo = currentRow.platformOrderNo;
	// 收件人姓名
	formDataValue.recipientName = currentRow?.buyerInfoVO?.recipientName;
	// 收件人电话
	formDataValue.recipientPhone = currentRow?.buyerInfoVO?.recipientPhone;
	// 收件人邮箱
	formDataValue.recipientEmail = currentRow?.buyerInfoVO?.recipientEmail;
	// 国家/地区
	formDataValue.recipientCountry = currentRow?.buyerInfoVO?.recipientCountry;
	// 省/州
	formDataValue.recipientState = currentRow?.buyerInfoVO?.recipientState;
	// 邮编
	formDataValue.recipientPostcode = currentRow?.buyerInfoVO?.recipientPostcode;
	// 城市
	formDataValue.recipientCity = currentRow?.buyerInfoVO?.recipientCity;
	// 区/县
	formDataValue.recipientDistrict = currentRow?.buyerInfoVO?.recipientDistrict;
	// 详细地址1
	formDataValue.recipientDetailAddress =
		currentRow?.buyerInfoVO?.recipientDetailAddress || '';
	// 备注
	formDataValue.orderRemark = 'THANK YOU FOR YOUR ORDER!';
	// 配送速度 默认标准配送
	formDataValue.deliverySpeed = '1';
	// 是否无品牌包装
	formDataValue.unbrandedPackagingOnly = false;
	// 是否亚马逊物流配送
	formDataValue.blockAmazonLogistics = false;
};
