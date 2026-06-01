/**
 * 分页结果
 *
 * RIPageCollectionPlanCancelVO
 */
export interface ApifoxModel {
	code?: number;
	data?: IPageCollectionPlanCancelVO;
	msg?: string;
	ok?: boolean;
	[property: string]: any;
}

/**
 * IPageCollectionPlanCancelVO
 */
export interface IPageCollectionPlanCancelVO {
	countId?: string;
	current?: number;
	maxLimit?: number;
	optimizeCountSql?: boolean;
	optimizeJoinOfCountSql?: boolean;
	orders?: OrderItem[];
	pages?: number;
	records?: CollectionPlanCancelVO[];
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
	/**
	 * 是否正序排列，默认 true
	 */
	asc?: boolean;
	/**
	 * 需要进行排序的字段
	 */
	column?: string;
	[property: string]: any;
}

/**
 * 取消提货计划VO
 *
 * CollectionPlanCancelVO
 */
export interface CollectionPlanCancelVO {
	/**
	 * 取消单号
	 */
	cancelNo?: string;
	/**
	 * 国家编码
	 */
	countryCode?: string;
	/**
	 * 创建人名称
	 */
	createName?: string;
	/**
	 * 创建时间
	 */
	createTime?: string;
	/**
	 * 需求单号
	 */
	demandOrderNo?: string;
	/**
	 * 运营小组ID
	 */
	deptId?: number;
	/**
	 * 运营小组名称
	 */
	deptText?: string;
	/**
	 * 期望提货时间
	 */
	expectedPickupDate?: string;
	/**
	 * 工厂回复交期
	 */
	factoryDeliveryDate?: string;
	/**
	 * 工厂ID
	 */
	factoryId?: number;
	/**
	 * 是否首单：0-否，1-是
	 */
	firstOrderFlag?: number;
	/**
	 * 取消记录ID
	 */
	id?: number;
	/**
	 * MSKU编码
	 */
	mskuCode?: string;
	/**
	 * 取消数量
	 */
	num?: number;
	/**
	 * 运营人员ID
	 */
	operationId?: number;
	/**
	 * 运营人员名称
	 */
	operationName?: string;
	/**
	 * 部门名称
	 */
	parentDeptText?: string;
	/**
	 * 物控（提货计划创建人）
	 */
	pickupOrderCreateName?: string;
	/**
	 * 提货单号
	 */
	pickupOrderNo?: string;
	/**
	 * 状态
	 */
	pickupOrderStatus?: number;
	/**
	 * 状态
	 */
	pickupOrderStatusText?: string;
	/**
	 * 计划提货日期
	 */
	plannedPickupDate?: string;
	/**
	 * 渠道编码
	 */
	platformChannelCode?: string;
	/**
	 * 渠道名称
	 */
	platformChannelCodeText?: string;
	/**
	 * 采购数量
	 */
	purchaseNum?: number;
	/**
	 * 采购订单
	 */
	purchaseOrderNo?: string;
	/**
	 * 采购员ID
	 */
	purchaseUserId?: number;
	/**
	 * 采购员名称
	 */
	purchaseUserName?: string;
	/**
	 * 备注
	 */
	remark?: string;
	/**
	 * 发货方式
	 */
	shippingMethod?: string;
	/**
	 * 发货方式文本
	 */
	shippingMethodText?: string;
	/**
	 * SKU编码
	 */
	skuCode?: string;
	/**
	 * 产品名称
	 */
	skuName?: string;
	/**
	 * 状态
	 */
	status?: number;
	/**
	 * 状态
	 */
	statusText?: string;
	[property: string]: any;
}
