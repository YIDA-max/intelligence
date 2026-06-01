import Sortable from 'sortablejs';

const columns = [
	{
		type: 'checkbox',
		width: 50,
		fixed: 'left',
		align: 'center',
		disabled: true,
	},
	{
		title: '发货单号',
		field: 'deliveryNo',
		width: 180,
		fixed: 'left',
	},
	{
		title: '状态',
		field: 'status',
		width: 150,
		fixed: 'left',
	},
	{
		title: '订柜号',
		field: 'orderContainerNo',
		width: 180,
		fixed: 'left',
	},
	{
		title: '异常风险标签',
		field: 'anomalyRiskLabel',
		width: 180,
	},
	{
		title: '初始预计装柜时间',
		field: 'estimatedLoadingTime',
		width: 150,
	},
	{
		title: '变更后预计装柜时间',
		field: 'changedEstimatedLoadingTime',
		width: 150,
	},
	{
		title: '实际装柜时间',
		field: 'actualLoadingTime',
		width: 120,
	},
	{
		title: '工厂名称',
		field: 'factoryName',
		width: 180,
	},
	{
		title: '货件创建时间',
		field: 'goodsCreateDate',
		width: 180,
	},
	{
		title: '采购员',
		field: 'purchaseUserName',
		width: 100,
	},
	{
		title: '工厂回复交期',
		field: 'factoryDeliveryDate',
		width: 120,
	},
	{
		title: '计划发货时间',
		field: 'planShipmentDate',
		width: 120,
	},
	{
		title: '发货数量',
		field: 'shipmentQuantity',
		width: 100,
	},
	{
		title: '运输方式',
		field: 'transportMethodText',
		width: 120,
	},
	{
		title: '提货单号',
		field: 'pickupNo',
		width: 150,
	},
	{
		title: '采购单号',
		field: 'purchaseNo',
		width: 150,
	},
	{
		title: '需求单号',
		field: 'demandNo',
		width: 150,
	},
	{
		title: 'SKU',
		field: 'skuCode',
		width: 200,
	},
	{
		title: '产品名称',
		field: 'skuName',
		width: 200,
	},
	{
		title: '产品特殊属性',
		field: 'specialAttributeTextList',
		width: 180,
	},
	{
		title: '货型',
		field: 'cargoTypeText',
		width: 120,
	},
	{
		title: '国家',
		field: 'countryCode',
		width: 180,
	},
	{
		title: '起始港',
		field: 'startPortName',
		width: 180,
	},
	{
		title: '目的港',
		field: 'destPortName',
		width: 180,
	},
	{
		title: '平台渠道',
		field: 'platformChannelCodeText',
		width: 180,
	},
	{
		title: 'MSKU',
		field: 'mskuCode',
		width: 180,
	},
	{
		title: '发货方式',
		field: 'shippingMethodText',
		width: 180,
	},
	{
		title: '订单类型',
		field: 'orderTypeText',
		width: 100,
	},
	{
		title: '平台店铺',
		field: 'storeName',
		width: 180,
	},
	{
		title: '平台仓库',
		field: 'platformWarehouseCode',
		width: 180,
	},
	{
		title: '平台入库单',
		field: 'platformShipmentId',
		width: 150,
	},
	{
		title: '条码',
		field: 'barcode',
		width: 180,
	},
	{
		title: '送仓码/关联单号',
		field: 'referenceId',
		width: 180,
	},
	{
		title: '箱唛附件',
		field: 'shippingMarkAttachmentUrl',
		width: 180,
	},
	{
		title: '条码附件',
		field: 'barcodeAttachmentUrl',
		width: 180,
	},
	{
		title: '透明计划标签',
		field: 'transparencyAttachmentUrl',
		width: 180,
	},
	{
		title: '运营/物控备注',
		field: 'remark',
		width: 200,
	},
	{
		title: '箱规编码',
		field: 'skuCartonCode',
		width: 200,
	},
	{
		title: '外箱长(CM)',
		field: 'outCartonLength',
		width: 120,
		valueType: 'number',
	},
	{
		title: '外箱宽(CM)',
		field: 'outCartonWidth',
		width: 120,
		valueType: 'number',
	},
	{
		title: '外箱高(CM)',
		field: 'outCartonHeight',
		width: 120,
		valueType: 'number',
	},
	{
		title: '产品净重(KG)',
		field: 'productNetWeight',
		width: 180,
		valueType: 'number',
	},
	{
		title: '外箱毛重(KG)',
		field: 'outCartonGrossWeight',
		width: 180,
		valueType: 'number',
	},
	{
		title: '单箱数量',
		field: 'singleCartonQuantity',
		width: 180,
	},
	{
		title: '总箱数',
		field: 'cartons',
		width: 180,
	},
	{
		title: '总体积(m³)',
		field: 'totalVolume',
		width: 180,
		valueType: 'number',
		scale: 2,
		precision: 'decimal',
	},
	{
		title: '总净重(KG)',
		field: 'totalNetWeight',
		width: 180,
		valueType: 'number',
		scale: 2,
		precision: 'decimal',
	},
	{
		title: '总毛重(KG)',
		field: 'totalGrossWeight',
		width: 180,
		valueType: 'number',
		scale: 2,
		precision: 'decimal',
	},
	{
		title: '部门&小组',
		field: 'deptName',
		width: 180,
	},
	{
		title: '运营人',
		field: 'operationUserName',
		width: 180,
	},
	{
		title: '物流人员',
		field: 'logisticsUserName',
		width: 180,
	},
	{
		title: '创建人',
		field: 'createName',
		width: 180,
	},

	{
		title: '实际提货时间',
		field: 'actualPickupTime',
		width: 180,
	},
	{
		title: '创建时间',
		field: 'createTime',
		width: 180,
	},
	{
		title: '更新时间',
		field: 'updateTime',
		width: 180,
	},
	{
		title: '物流备注',
		field: 'logisticsRemark',
		width: 180,
	},
	{
		title: '操作',
		field: 'action',
		width: 180,
		fixed: 'right',
		disabled: true,
	},
];

export { columns };
