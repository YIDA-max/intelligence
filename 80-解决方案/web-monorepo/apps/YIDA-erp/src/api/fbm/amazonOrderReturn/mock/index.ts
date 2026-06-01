/**
 * 平台发货订单金蝶单据分页查询 Mock 数据
 */
export const returnOrderPageMock = {
	records: [
		{
			storeName: 'US Store',
			siteName: 'Amazon.com',

			amazonOrderId: '112-1234567-1234567',
			sellerOrderId: 'SO-10001',
			orderTime: '2026-02-20 10:00:00',
			returnTime: '2026-03-20 10:00:00',
			orderAmount: 59.99,
			orderQuantity: 1,

			itemInfo: 'Bluetooth Headphones / B0ABC12345 / MSKU-001',
			productInfo: 'Headphones Pro / SKU-001',

			returnRequestTime: '2026-02-22 09:00:00',
			returnDeliveryTime: '2026-02-25 14:30:00',

			cancelStatus: '未取消',
			isPolicyCompliant: '是',
			returnReason: '质量问题',
			returnType: '买家主动退货',
			refundAmount: 59.99,
			returnQuantity: 1,

			returnCarrier: 'UPS',
			trackingNumber: '1Z999AA10123456784',

			labelType: 'Amazon Label',
			labelCost: 5.5,
			labelPayer: 'Seller',

			amazonRmaId: 'RMA-AMZ-001',
			sellerRmaId: 'RMA-SELLER-001',

			aToZClaim: '否',
			isPrimeOrder: '是',

			resolution: '已退款',
			invoiceNumber: 'INV-20260220-001',

			safeTActionReason: 'Item damaged',
			safeTClaimId: 'SAFE-12345',
			safeTClaimState: 'Approved',
			safeTClaimCreateTime: '2026-02-26 11:00:00',
			safeTReimbursementAmount: 30.0,
			fnSku: 'ddddd',
			fulfillmentCenter: '你猜',
			inventoryDisposition: 'good',
			returnStatus: 'pending',
			buyerComment: 'kk',
			lpn: 'dddawqe',
			mskus: [
				{
					createId: 1,
					createName: '管理员',
					updateId: 54,
					updateName: '岁岁',
					createTime: '2026-02-27 20:04:05',
					updateTime: '2026-03-02 09:48:08',
					delFlag: '0',
					id: 7508,
					mskuCode: 'YIDA-sku-001-Amazon',
					platformChannelCode: 'Amazon',
					storeId: 3,
					saleUrl: '',
					competitorUrl: '',
					imgFileName: '',
					salePrice: 12,
					currency: 'EUR',
					operationUserId: 1,
					deptId: 36,
					asin: 'YIDA-sku-001-Amazon',
					skuCode: 'YIDA-sku-001',
					imgUrl: null,
					platformText: 'Amazon',
					storeAndSiteText: '北美-德克:US',
					operationUserName: '管理员',
					deptName: '运营一部-亚马逊A组',
				},
				{
					createId: 2,
					createName: '管理员',
					updateId: 54,
					updateName: 'kk',
					createTime: '2026-02-27 20:04:05',
					updateTime: '2026-03-02 09:48:08',
					delFlag: '0',
					id: 7508,
					mskuCode: 'KK-sku-001-Amazon',
					platformChannelCode: 'Amazon',
					storeId: 3,
					saleUrl: '',
					competitorUrl: '',
					imgFileName: '',
					salePrice: 12,
					currency: 'EUR',
					operationUserId: 1,
					deptId: 36,
					asin: 'KK-sku-001-Amazon',
					skuCode: 'YIDA-sku-001',
					imgUrl: null,
					platformText: 'Amazon',
					storeAndSiteText: '北美a-德克:US',
					operationUserName: '管理员',
					deptName: '运营一部-亚马逊A组',
				},
			],
		},
		{
			storeName: 'UK Store',
			siteName: 'Amazon.co.uk',

			amazonOrderId: '205-9876543-7654321',
			sellerOrderId: 'SO-10002',
			orderTime: '2026-02-18 14:30:00',
			orderAmount: 39.98,
			orderQuantity: 2,

			itemInfo: 'Wireless Mouse / B0XYZ67890 / MSKU-002',
			productInfo: 'Mouse Basic / SKU-002',

			returnRequestTime: '2026-02-19 16:00:00',
			returnDeliveryTime: '2026-02-23 10:00:00',

			cancelStatus: '取消申请中',
			isPolicyCompliant: '否',
			returnReason: '不再需要',
			returnType: '平台退货',
			refundAmount: 39.98,
			returnQuantity: 2,

			returnCarrier: 'Royal Mail',
			trackingNumber: 'RM123456789GB',

			labelType: 'Seller Label',
			labelCost: 3.0,
			labelPayer: 'Buyer',

			amazonRmaId: 'RMA-AMZ-002',
			sellerRmaId: 'RMA-SELLER-002',

			aToZClaim: '是',
			isPrimeOrder: '否',

			resolution: '退款处理中',
			invoiceNumber: 'INV-20260218-002',

			safeTActionReason: '',
			safeTClaimId: '',
			safeTClaimState: '',
			safeTClaimCreateTime: '',
			safeTReimbursementAmount: 0,
			fnSku: 'ddddd111dd',
		},
		{
			storeName: 'DE Store',
			siteName: 'Amazon.de',

			amazonOrderId: '304-8888888-9999999',
			sellerOrderId: 'SO-10005',
			orderTime: '2026-02-12 13:10:00',
			orderAmount: 89.97,
			orderQuantity: 3,

			itemInfo: 'USB-C Charger / B0CHARGER1 / MSKU-005',
			productInfo: 'Fast Charger / SKU-005',

			returnRequestTime: '2026-02-13 15:00:00',
			returnDeliveryTime: '2026-02-17 09:30:00',

			cancelStatus: '已取消',
			isPolicyCompliant: '是',
			returnReason: '过热',
			returnType: 'FBA退货',
			refundAmount: 0,
			returnQuantity: 3,

			returnCarrier: 'DHL',
			trackingNumber: 'DHL987654321DE',

			labelType: 'Amazon Label',
			labelCost: 7.8,
			labelPayer: 'Amazon',

			amazonRmaId: 'RMA-AMZ-003',
			sellerRmaId: 'RMA-SELLER-003',

			aToZClaim: '否',
			isPrimeOrder: '是',

			resolution: '拒绝退款',
			invoiceNumber: 'INV-20260212-003',

			safeTActionReason: 'Customer misuse',
			safeTClaimId: 'SAFE-56789',
			safeTClaimState: 'Rejected',
			safeTClaimCreateTime: '2026-02-18 16:00:00',
			safeTReimbursementAmount: 0,
			fnSku: 'dddddaaa',
		},
	],
	total: 3,
};
