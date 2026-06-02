export const setData = (currentRow: any, formDataValue: any) => {
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
	formDataValue.remarks = 'THANK YOU FOR YOUR ORDER!';
};
