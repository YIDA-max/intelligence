/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-11-28 18:29:54
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-12-01 10:19:07
 * @FilePath: \qianyi-ui\src\interface\views\fbm\selfOrder\dataTransferObject.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
/**
 * R
 *
 * RPageSelfOrderVO
 */
export interface Response {
	code?: number;
	data?: PageSelfOrderVO;
	msg?: string;
	[property: string]: any;
}

/**
 * PageSelfOrderVO
 */
export interface PageSelfOrderVO {
	countId?: string;
	current?: number;
	maxLimit?: number;
	optimizeCountSql?: boolean;
	optimizeJoinOfCountSql?: boolean;
	orders?: OrderItem[];
	records?: SelfOrderVO[];
	searchCount?: boolean;
	size?: number;
	total?: number;
	[property: string]: any;
}

/**
 * com.baomidou.mybatisplus.core.metadata.OrderItem
 *
 * OrderItem
 */
export interface OrderItem {
	asc?: boolean;
	column?: string;
	[property: string]: any;
}

/**
 * com.merach.qianyi.fbm.api.vo.orderVo.SelfOrderVO
 *
 * SelfOrderVO
 */
export interface SelfOrderVO {
	/**
	 * 买家实付金额
	 */
	buyerActualPayment?: number;
	/**
	 * 买家信息
	 */
	buyerInfoVO?: SelfBuyerInfoVO;
	/**
	 * 买家物流
	 */
	buyerLogistics?: string;
	/**
	 * 买家运费
	 */
	buyerShippingFee?: number;
	/**
	 * 国家代码
	 */
	countryCode?: string;
	/**
	 * 国家
	 */
	countryName?: string;
	/**
	 * 创建时间
	 */
	createTime?: string;
	/**
	 * 币种
	 */
	currencyCode?: string;
	/**
	 * 送达时间（北京）
	 */
	deliveryTime?: string;
	/**
	 * 部门id
	 */
	deptId?: number;
	/**
	 * 指定仓库发货
	 */
	designatedWarehouse?: string;
	/**
	 * 优惠金额
	 */
	discountAmount?: number;
	/**
	 * 已出运时间
	 */
	dispatchTime?: string;
	/**
	 * 最早送达时间（北京）
	 */
	earliestDeliveryTime?: string;
	/**
	 * 最早发货时间（北京）
	 */
	earliestShippingTime?: string;
	/**
	 * 错误信息
	 */
	errorInfo?: string;
	/**
	 * 礼品信息
	 */
	giftInfo?: string;
	/**
	 * ID
	 */
	id?: number;
	/**
	 * 商品行取消方
	 */
	itemCancelParty?: string;
	/**
	 * 商品行取消原因
	 */
	itemCancelReason?: string;
	/**
	 * 商品行取消时间
	 */
	itemCancelTime?: string;
	/**
	 * 最晚送达时间（北京）
	 */
	latestDeliveryTime?: string;
	/**
	 * 最晚发货时间（北京）
	 */
	latestShippingTime?: string;
	/**
	 * 物流渠道代码
	 */
	logisticsCode?: string;
	/**
	 * 物流渠道名称
	 */
	logisticsName?: string;
	/**
	 * 物流状态
	 */
	logisticsStatus?: string;
	/**
	 * 物流跟踪号
	 */
	logisticsTrackingNo?: string;
	/**
	 * 标发状态
	 */
	markStatus?: number;
	/**
	 * 标发状态
	 */
	markStatusText?: string;
	/**
	 * 是否进入合单池
	 */
	mergeFlag?: boolean;
	/**
	 * 合单订单号列表
	 */
	mergeSelfOrderNos?: string[];
	/**
	 * 提示信息
	 */
	message?: string;
	/**
	 * 订单取消方
	 */
	orderCancelParty?: string;
	/**
	 * 订单取消原因
	 */
	orderCancelReason?: string;
	/**
	 * 订单取消时间
	 */
	orderCancelTime?: string;
	/**
	 * 额外信息
	 */
	orderExtensionVO?: SelfOrderExtensionVO;
	/**
	 * 订单产品
	 */
	orderItemVOList?: SelfOrderItemVO[];
	/**
	 * 订单其他费用
	 */
	orderOtherFee?: number;
	/**
	 * 积分
	 */
	orderPoints?: number;
	/**
	 * 订单备注
	 */
	orderRemark?: string;
	/**
	 * 订单状态
	 */
	orderStatus?: number;
	/**
	 * 订单状态
	 */
	orderStatusText?: string;
	/**
	 * 订单标签
	 */
	orderTag?: TagInfoVO[];
	/**
	 * 订单税费
	 */
	orderTaxFee?: number;
	/**
	 * 订购时间（北京）
	 */
	orderTime?: string;
	/**
	 * 订单总金额
	 */
	orderTotalAmount?: number;
	/**
	 * 付款方式
	 */
	paymentMethod?: string;
	/**
	 * 付款时间（北京）
	 */
	paymentTime?: string;
	/**
	 * 平台渠道代码
	 */
	platformChannelCode?: string;
	/**
	 * 平台渠道名称
	 */
	platformChannelText?: string;
	/**
	 * 平台订单号
	 */
	platformOrderNo?: string;
	/**
	 * 商品售价（不含税）
	 */
	productPriceExcludingTax?: number;
	/**
	 * 推送三方仓时间
	 */
	pushWareTime?: string;
	/**
	 * 审核时间
	 */
	reviewTime?: string;
	/**
	 * 销售订单号
	 */
	saleOrderNo?: string;
	/**
	 * 自发货订单号
	 */
	selfOrderNo?: string;
	/**
	 * 卖家订单编号
	 */
	sellerOrderNo?: string;
	/**
	 * 卖家备注
	 */
	sellerRemark?: string;
	/**
	 * 物流下单时间
	 */
	shipOrderTime?: string;
	/**
	 * 发货时间（北京）
	 */
	shippingTime?: string;
	/**
	 * 站点代码
	 */
	siteCode?: string;
	/**
	 * 分单时间（北京）
	 */
	splitTime?: string;
	/**
	 * 店铺ID
	 */
	storeId?: number;
	/**
	 * 店铺
	 */
	storeName?: string;
	/**
	 * 子状态
	 */
	subOrderStatus?: number;
	/**
	 * 订单总金额
	 */
	totalFee?: string;
	/**
	 * 预估体积(m³)
	 */
	volume?: number;
	/**
	 * 三方仓订单号
	 */
	warehouseOrderNo?: string;
	/**
	 * 运单号
	 */
	waybillNo?: string;
	/**
	 * 预估重量(kg)
	 */
	weight?: number;
	[property: string]: any;
}

/**
 * 买家信息
 *
 * SelfBuyerInfoVO
 */
export interface SelfBuyerInfoVO {
	/**
	 * 买家邮箱
	 */
	buyerEmail?: string;
	/**
	 * 买家ID
	 */
	buyerId?: number;
	/**
	 * 买家留言
	 */
	buyerMessage?: string;
	/**
	 * 买家姓名
	 */
	buyerName?: string;
	/**
	 * 买家税号
	 */
	buyerTaxNo?: string;
	/**
	 * 主键ID
	 */
	id?: number;
	/**
	 * 平台订单号
	 */
	platformOrderNo?: string;
	/**
	 * 收件人（城市）
	 */
	recipientCity?: string;
	/**
	 * 收件人国家
	 */
	recipientCountry?: string;
	/**
	 * 收件详细地址
	 */
	recipientDetailAddress?: string;
	/**
	 * 收件人（区）
	 */
	recipientDistrict?: string;
	/**
	 * 收件人邮箱
	 */
	recipientEmail?: string;
	/**
	 * 收件人（门牌号）
	 */
	recipientHouseNo?: string;
	/**
	 * 收件手机号
	 */
	recipientMobile?: string;
	/**
	 * 收件人姓名
	 */
	recipientName?: string;
	/**
	 * 收件电话
	 */
	recipientPhone?: string;
	/**
	 * 收件人邮编
	 */
	recipientPostcode?: string;
	/**
	 * 收件人（省/州）
	 */
	recipientState?: string;
	/**
	 * 收件人（街道）
	 */
	recipientStreet?: string;
	/**
	 * 收件人税号
	 */
	recipientTaxNo?: string;
	/**
	 * 自发货订单号
	 */
	selfOrderNo?: string;
	[property: string]: any;
}

/**
 * 额外信息
 *
 * SelfOrderExtensionVO
 */
export interface SelfOrderExtensionVO {
	/**
	 * BOL提单（JSON）
	 */
	bolFile?: string;
	/**
	 * 客服备注
	 */
	csNote?: string;
	/**
	 * 倍率
	 */
	exchangeRate?: number;
	/**
	 * FBA Label（JSON）
	 */
	fbaLabel?: string;
	/**
	 * 主键ID
	 */
	id?: number;
	/**
	 * 其他文件（JSON）
	 */
	otherFile?: string;
	/**
	 * packingList（JSON）
	 */
	packingListFile?: string;
	/**
	 * 平台佣金
	 */
	platformCommission?: number;
	/**
	 * 自发货订单号
	 */
	selfOrderNo?: string;
	/**
	 * 物品地
	 */
	shipFromAddress?: string;
	/**
	 * 面单（JSON）
	 */
	shippingLabel?: string;
	/**
	 * 寄往地
	 */
	shipToAddress?: string;
	/**
	 * 交易手续费
	 */
	transactionFee?: number;
	[property: string]: any;
}

/**
 * 自发货订单商品明细表
 *
 * SelfOrderItemVO
 */
export interface SelfOrderItemVO {
	/**
	 * 商品买家支付运费
	 */
	customerPaidShipping?: number;
	/**
	 * 部门
	 */
	deptId?: number;
	/**
	 * 部门
	 */
	deptName?: string;
	/**
	 * 商品折扣
	 */
	discount?: number;
	/**
	 * 履约方式
	 */
	fulfillmentMethod?: string;
	/**
	 * 是否赠品(0-否,1-是)
	 */
	giftFlag?: number;
	/**
	 * 主键ID
	 */
	id?: number;
	/**
	 * 商品主图
	 */
	imgUrl?: string;
	/**
	 * 单品毛重
	 */
	itemGrossWeight?: number;
	/**
	 * 单品毛重单位
	 */
	itemGrossWeightUnit?: string;
	/**
	 * 商品ID
	 */
	itemId?: string;
	/**
	 * 备注
	 */
	itemRemark?: string;
	/**
	 * 单品规格高
	 */
	itemSpecHeight?: number;
	/**
	 * 单品规格长
	 */
	itemSpecLength?: number;
	/**
	 * 单品规格单位
	 */
	itemSpecUnit?: string;
	/**
	 * 单品规格宽
	 */
	itemSpecWidth?: number;
	/**
	 * MSKU代码
	 */
	mskuCode?: string;
	/**
	 * 已作废数量
	 */
	nullifyQuantity?: number;
	/**
	 * 运营(销售负责人)
	 */
	operationUser?: string;
	/**
	 * 运营(销售负责人)ID
	 */
	operationUserId?: number;
	/**
	 * 订购数量
	 */
	orderQuantity?: number;
	/**
	 * 商品其他费用
	 */
	otherFee?: number;
	/**
	 * 包装规格
	 */
	packageSpec?: string;
	/**
	 * 父级部门
	 */
	parentDeptName?: string;
	/**
	 * 平台订单号
	 */
	platformOrderNo?: string;
	/**
	 * 积分
	 */
	points?: number;
	/**
	 * 属性
	 */
	productAttributes?: string;
	/**
	 * 产品负责人
	 */
	productManageId?: number;
	/**
	 * 产品负责人
	 */
	productManageName?: string;
	/**
	 * 商品标题
	 */
	productTitle?: string;
	/**
	 * 商品总价
	 */
	productTotalPrice?: number;
	/**
	 * 利润
	 */
	profit?: number;
	/**
	 * 自发货订单号
	 */
	selfOrderNo?: string;
	/**
	 * 商品售价(不含税)
	 */
	sellingPrice?: number;
	/**
	 * 发货数量
	 */
	shippedQuantity?: number;
	/**
	 * SKU代码
	 */
	skuCode?: string;
	/**
	 * SKU名称
	 */
	skuName?: string;
	/**
	 * 特殊属性
	 */
	specialAttribute?: string;
	/**
	 * 商品税金
	 */
	tax?: number;
	/**
	 * 单价(不含税)
	 */
	unitPrice?: number;
	/**
	 * 三方仓代码
	 */
	warehouseSkuCode?: string;
	[property: string]: any;
}

/**
 * 标签表
 *
 * TagInfoVO
 */
export interface TagInfoVO {
	/**
	 * 颜色
	 */
	color?: string;
	/**
	 * ID
	 */
	id?: number;
	/**
	 * 名称
	 */
	name?: string;
	[property: string]: any;
}
export interface Request {
	/**
	 * 订单业务状态 2:待接单 3:待审核  4:待发货 5:已发货 6:不发货 7:异常订单  8：订单标发
	 */
	bizOrderStatus?: number;
	/**
	 * 异常订单标识 1-是，0-否
	 */
	abnormalOrderFlag?: number;
	/**
	 * 禁止处理标识 1-是，0-否
	 */
	stopHandlerFlag?: number;
	countId?: string;
	/**
	 * 收件人国家
	 */
	countryCodeList?: string[];
	/**
	 * 创建时间结束
	 */
	createTimeEnd?: string;
	/**
	 * 创建时间开始
	 */
	createTimeStart?: string;
	current?: number;
	/**
	 * 部门/小组
	 */
	deptIdList?: number[];
	/**
	 * 发货仓库
	 */
	designatedWarehouses?: string[];
	/**
	 * 勾选的id列表  导出时使用
	 */
	ids?: number[];
	/**
	 * 物流渠道代码
	 */
	logisticsCodes?: string[];
	maxLimit?: number;
	/**
	 * msku
	 */
	mskuList?: string[];
	optimizeCountSql?: boolean;
	optimizeJoinOfCountSql?: boolean;
	'orders[0].asc'?: boolean;
	'orders[0].column'?: string;
	/**
	 * 订单状态
	 */
	orderStatusList?: string[];
	/**
	 * 平台渠道
	 */
	platformChannelCodes?: string[];
	/**
	 * 平台订单号
	 */
	platformOrderNos?: string[];
	/**
	 * 产品负责人id
	 */
	productManageIds?: number[];
	'records[0]'?: string[];
	searchCount?: boolean;
	/**
	 * 系统订单号
	 */
	selfOrderNos?: string[];
	/**
	 * 物流跟踪号（列表页「发货信息」跟踪号，多值与平台/系统订单号查询一致）
	 */
	logisticsTrackingNos?: string[];
	/**
	 * 运单号
	 */
	waybillNos?: string[];
	/**
	 * 仓库单号
	 */
	warehouseOrderNos?: string[];
	/**
	 * 站点
	 */
	siteCodes?: string[];
	size?: number;
	/**
	 * sku
	 */
	skuList?: string[];
	/**
	 * 店铺
	 */
	storeIds?: string[];
	/**
	 * 订单子状态
	 */
	subOrderStatus?: number;
	/**
	 * 标签
	 */
	tags?: string[];
	/**
	 * 平台订单标签（如 Shopify 同步标签），多选为标签名字符串列表；与系统「订单标签」区分
	 */
	platformOrderTagNames?: string[];
	/**
	 * 标签(不包含传0  包含传1)
	 */
	tagType?: number;
	total?: number;
	[property: string]: any;
}
