/**
 * [R]
 *
 * RListPurchaseOrderSkuDetailVO
 */
export interface Response {
	/**
	 * 返回标记：成功标记=0，失败标记=1
	 */
	code?: number;
	/**
	 * 数据
	 */
	data?: PurchaseOrderSkuDetailVO[];
	/**
	 * 返回信息
	 */
	msg?: string;
	[property: string]: any;
}

/**
 * 保存采购单DTO
 *
 * PurchaseOrderSkuDetailVO
 */
export interface PurchaseOrderSkuDetailVO {
	/**
	 * 已建发货计划数量 !!!
	 */
	builtDeliveryGoodsNum?: number;
	/**
	 * 已建发货计划数量（已拼待提）
	 */
	builtDeliveryGoodsNumConfirmed?: number;
	/**
	 * 已建发货计划数量（已拼已提）
	 */
	builtDeliveryGoodsNumDelivered?: number;
	/**
	 * 已建发货计划数量（待拼柜）
	 */
	builtDeliveryGoodsNumPending?: number;
	/**
	 * 已建提货计划数量
	 */
	builtTakeGoodsNum?: number;
	/**
	 * PMC确认剩余采购数量 !!!
	 */
	confirmedRemainingPurchaseNum?: number;
	/**
	 * 创建人 !!!
	 */
	createName?: string;
	/**
	 * 创建时间 !!!
	 */
	createTime?: string;
	/**
	 * 需求单号
	 */
	demandNo?: string;
	/**
	 * 实际税率
	 */
	effectiveTaxRate?: number;
	/**
	 * 期望提货时间
	 */
	expectedPickupDate?: string;
	/**
	 * 工厂回复交期 !!!
	 */
	factoryDeliveryDate?: string;
	/**
	 * 工厂标准交期  采购单生成时间+供应商产品的采购交期
	 */
	factoryStandardDeliveryDate?: string;
	/**
	 * ID
	 */
	id?: number;
	/**
	 * 图片
	 */
	imgUrl?: string;
	/**
	 * 是否可以点击
	 */
	isClick?: boolean;
	/**
	 * 物控备注 !!!
	 */
	materialRemark?: string;
	/**
	 * 物控人员 !!!
	 */
	mcpCreateId?: number;
	/**
	 * 物控人员名称 !!!
	 */
	mcpCreateName?: string;
	/**
	 * MSKU代码
	 */
	mskuCode?: string;
	/**
	 * 待采购数量  计划数量-采购数量   !!!
	 */
	pendingPurchaseQuantity?: number;
	/**
	 * 计划数量
	 */
	planNum?: number;
	/**
	 * 含税货值
	 */
	priceIncludingTax?: string;
	/**
	 * 不含税货值
	 */
	priceWithoutTax?: string;
	/**
	 * 采购单号
	 */
	purchaseNo?: string;
	/**
	 * 采购量
	 */
	purchaseNum?: number;
	/**
	 * PMC !!!
	 */
	purchaseUser?: string;
	/**
	 * 采购人员ID !!
	 */
	purchaseUserId?: number;
	/**
	 * PMC备注 !!!
	 */
	remark?: string;
	/**
	 * 退货数量
	 */
	returnNum?: number;
	/**
	 * 退货数量 !!!
	 */
	returnNumConfirmed?: number;
	/**
	 * 退货中数量 !!!
	 */
	returnNumPending?: number;
	/**
	 * SKU代码
	 */
	skuCode?: string;
	/**
	 * 产品名称
	 */
	skuName?: string;
	/**
	 * 供应商 !!!
	 */
	supplierName?: string;
	/**
	 * 含税单价
	 */
	unitPriceIncludingTax?: string;
	/**
	 * 不含税单价
	 */
	unitPriceWithoutTax?: string;
	[property: string]: any;
}
