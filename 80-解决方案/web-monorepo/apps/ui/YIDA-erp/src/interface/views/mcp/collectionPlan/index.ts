/**
 * 发货计划
 *
 * RListCollectionPlanVo
 */
export interface ApifoxModel {
	/**
	 * 返回标记：成功标记=0，失败标记=1
	 */
	code?: number;
	/**
	 * 数据
	 */
	data?: CollectionPlanVo[];
	/**
	 * 返回信息
	 */
	msg?: string;
	[property: string]: any;
}

/**
 * com.merach.qianyi.plan.vo.CollectionPlanVo
 *
 * CollectionPlanVo
 */
export interface CollectionPlanVo {
	/**
	 * 可提数量 - 可提数量=采购数量-退货数量（含未处理的）-已提数量
	 */
	availableQuantity?: number;
	/**
	 * 单箱数量
	 */
	cartonQty?: number;
	/**
	 * 货件信息
	 */
	collectionPlanMessage?: CollectionPlanMessage;
	/**
	 * 订柜发货数量
	 */
	containerDeliveryQuantity?: number;
	/**
	 * 国家编码
	 */
	countryCode?: string;
	/**
	 * 创建人ID
	 */
	createId?: number;
	/**
	 * 创建人
	 */
	createName?: string;
	/**
	 * 创建时间
	 */
	createTime?: string;
	/**
	 * 删除标记
	 */
	delFlag?: number;
	/**
	 * 确认交期备注
	 */
	deliveryDateRemark?: string;
	/**
	 * 需求单号
	 */
	demandOrderNo?: string;
	/**
	 * 部门名称
	 */
	departmentText?: string;
	/**
	 * 运营小组id
	 */
	deptId?: number;
	/**
	 * 运营小组名称
	 */
	deptText?: string;
	/**
	 * 40HQ预估装柜数量
	 */
	estimatedContainerQuantity?: number;
	/**
	 * 期望提货时间
	 */
	expectedPickupDate?: string;
	/**
	 * 工厂回复交期
	 */
	factoryDeliveryDate?: string;
	/**
	 * 工厂id
	 */
	factoryId?: number;
	/**
	 * 是否首单：0-否，1-是
	 */
	firstOrderFlag?: number;
	/**
	 * 主键ID
	 */
	id?: number;
	/**
	 * MSKU编码
	 */
	mskuCode?: string;
	/**
	 * 运营人员id
	 */
	operationId?: number;
	/**
	 * 运营人员名称
	 */
	operationText?: string;
	/**
	 * 提货单号
	 */
	pickupOrderNo?: string;
	/**
	 * 本次提货数量
	 */
	pickupQuantity?: number;
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
	 * 采购员id
	 */
	purchaseUserId?: number;
	/**
	 * 采购员
	 */
	purchaseUserName?: string;
	/**
	 * 已推送发货数量
	 */
	pushedShippingQuantity?: number;
	/**
	 * 备注
	 */
	remark?: string;
	/**
	 * 发货方式
	 */
	shippingMethod?: string;
	/**
	 * 发货方式
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
	status?: string;
	/**
	 * 状态中文
	 */
	statusText?: string;
	/**
	 * 运输方式编码
	 */
	transportMethod?: string;
	/**
	 * 运输方式文案
	 */
	transportMethodText?: string;
	/**
	 * 修改人ID
	 */
	updateId?: number;
	/**
	 * 修改人
	 */
	updateName?: string;
	/**
	 * 修改时间
	 */
	updateTime?: string;
	/**
	 * 货件维护国家配置是否命中（后端根据单据国家与后台配置表计算，列表/详情随单返回）。
	 * - `true`：命中「配置国家」分支（入平台仓等场景下需维护货件信息与标签后方可推送发货）。
	 * - `false`：未命中「未配置国家」分支（推送发货前以运输方式、预计发货时间、备注等校验为主）。
	 * 提货计划列表行、发货计划列表行与后端 JSON 均约定字段名为 `shipmentCountryConfigFlag`（boolean）；若后端最终命名不同，前后端需对齐后全局替换引用。
	 */
	shipmentCountryConfigFlag?: boolean;
	[property: string]: any;
}

/**
 * 货件信息
 *
 * CollectionPlanMessage，提货计划消息表
 */
export interface CollectionPlanMessage {
	/**
	 * 条码附件
	 */
	barcodeAttachment?: string;
	/**
	 * 物流凭证信息
	 */
	channelMessage?: MapString;
	/**
	 * 国家编码
	 */
	countryCode?: string;
	/**
	 * 创建人ID
	 */
	createId?: number;
	/**
	 * 创建人
	 */
	createName?: string;
	/**
	 * 创建时间
	 */
	createTime?: string;
	/**
	 * 删除标记
	 */
	delFlag?: number;
	/**
	 * 主键ID
	 */
	id?: number;
	/**
	 * MSKU编码
	 */
	mskuCode?: string;
	/**
	 * 计划发货时间
	 */
	pickGoodsDate?: string;
	/**
	 * 提货单号
	 */
	pickupOrderNo?: string;
	/**
	 * 渠道编码
	 */
	platformChannelCode?: string;
	/**
	 * 平台仓库Code
	 */
	platformWarehouseCode?: string;
	/**
	 * 备注
	 */
	remark?: string;
	/**
	 * 箱唛附件
	 */
	shippingMarkAttachment?: string;
	/**
	 * 店铺id
	 */
	storeId?: number;
	/**
	 * 透明计划标签附件
	 */
	transparencyAttachment?: string;
	/**
	 * 运输方式:1 海运-OA船，2 海运-普船，3 海运-美森快船，4 空运，5 铁路
	 */
	transportMethod?: string;
	/**
	 * 运输方式文案
	 */
	transportMethodText?: string;
	/**
	 * 修改人ID
	 */
	updateId?: number;
	/**
	 * 修改人
	 */
	updateName?: string;
	/**
	 * 修改时间
	 */
	updateTime?: string;
	[property: string]: any;
}

/**
 * 物流凭证信息
 *
 * MapString
 */
export interface MapString {
	key?: string;
	[property: string]: any;
}
