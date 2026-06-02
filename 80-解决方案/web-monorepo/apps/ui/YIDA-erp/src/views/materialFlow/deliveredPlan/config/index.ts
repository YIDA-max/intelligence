/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2026-05-12 17:46:46
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-05-12 17:52:32
 * @FilePath: \qianyi-ui\src\views\materialFlow\deliveredPlan\config\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
const columns = [
	{
		type: 'checkbox',
		width: 50,
		fixed: 'left',
		align: 'center',
		disabled: true,
	},
	// ================= 基础标识字段 =================
	{ title: '发货单号', field: 'deliveryNo', width: 180, fixed: 'left' },
	{ title: '状态', field: 'statusText', width: 140, fixed: 'left' },
	{ title: '订柜号', field: 'orderContainerNo', width: 180, fixed: 'left' },
	{ title: '柜号', field: 'containerNo', width: 160 },
	{ title: '封条号', field: 'sealNo', width: 160 },
	{ title: 'SO号', field: 'soNo', width: 160 },

	// ================= 发货计划字段 =================
	{ title: '提货单号', field: 'pickupNo', width: 160 },
	{ title: '采购单号', field: 'purchaseNo', width: 160 },
	{ title: '需求单号', field: 'demandNo', width: 160 },
	{ title: 'SKU', field: 'skuCode', width: 200 },
	{ title: '产品名称', field: 'skuName', width: 200 },
	{ title: '产品特殊属性', field: 'specialAttributeTextList', width: 180 },
	{ title: '货型', field: 'cargoTypeText', width: 120 },
	{ title: 'MSKU', field: 'mskuCode', width: 180 },
	{ title: '工厂名称', field: 'factoryName', width: 180 },
	{ title: '工厂回复交期', field: 'factoryDeliveryDate', width: 180 },
	{ title: '货件创建时间', field: 'goodsCreateDate', width: 180 },
	{ title: '国家', field: 'countryCode', width: 160 },
	{ title: '起始港', field: 'startPortName', width: 160 },
	{ title: '目的港', field: 'destPortName', width: 160 },
	{ title: '销售渠道', field: 'platformChannelCodeText', width: 160 },
	{ title: '平台店铺', field: 'storeName', width: 180 },
	{ title: '平台仓库', field: 'platformWarehouseCode', width: 180 },
	{ title: '发货方式', field: 'shippingMethodText', width: 160 },
	{ title: '航线', field: 'shippingRoute', width: 180 },
	{ title: '船公司', field: 'shippingLine', width: 160 },
	{ title: '平台入库单', field: 'shipmentId', width: 180 },
	{ title: '条码', field: 'barcode', width: 180 },
	{ title: '送仓码/关联单号', field: 'referenceId', width: 180 },
	{ title: '订单类型', field: 'orderTypeText', width: 140 },
	{ title: '计划发货时间', field: 'planShipmentDate', width: 180 },
	{ title: '发货数量', field: 'shipmentQuantity', width: 120 },
	{ title: '目的仓', field: 'destWarehouseNameList', width: 220 },

	// ================= 货代信息字段 =================
	{ title: '国内拖车报关', field: 'domesticForwarderName', width: 180 },
	{ title: '国内拖车编号', field: 'domesticForwarderNo', width: 200 },
	{ title: '海运/空运/铁路', field: 'mainForwarderName', width: 180 },
	{ title: '海运/空运/铁路编码', field: 'mainForwarderNo', width: 220 },
	{ title: '清关', field: 'customsForwarderName', width: 160 },
	{ title: '清关货代编号', field: 'customsForwarderNo', width: 180 },
	{ title: '国外拖车', field: 'deliveryForwarderName', width: 160 },
	{ title: '国外拖车货代编号', field: 'deliveryForwarderNo', width: 180 },

	// ================= 订柜管理字段（图中标红） =================
	{ title: '运输方式', field: 'transportMethodText', width: 160 },
	{ title: '船名', field: 'vessel', width: 160 },
	{ title: '船次', field: 'voyage', width: 160 },

	// ================= 头程追踪字段（图中标黄） =================
	{ title: '实际提货时间', field: 'actualPickupTime', width: 180 },
	{ title: '初始预计装柜时间', field: 'estimatedLoadingTime', width: 180 },
	{
		title: '变更后预计装柜时间',
		field: 'changedEstimatedLoadingTime',
		width: 180,
	},
	{ title: '实际装柜时间', field: 'actualLoadingTime', width: 180 },
	{ title: '预计开船时间', field: 'estimatedDepartureTime', width: 180 },
	{ title: '实际开船时间', field: 'actualDepartureTime', width: 180 },
	{ title: '预计到港时间', field: 'estimatedArrivalTime', width: 180 },
	{ title: '实际到港时间', field: 'actualArrivalTime', width: 180 },
	{ title: '卸船时间', field: 'dischargingTime', width: 180 },
	{ title: '提柜时间', field: 'containerPickupTime', width: 180 },
	{ title: '到仓时间', field: 'arrivalWarehouseTime', width: 180 },

	// ================= 包装与重量体积字段 =================
	{ title: '外箱长(CM)', field: 'outCartonLength', width: 140 },
	{ title: '外箱宽(CM)', field: 'outCartonWidth', width: 140 },
	{ title: '外箱高(CM)', field: 'outCartonHeight', width: 140 },
	{ title: '产品净重(KG)', field: 'productNetWeight', width: 160 },
	{ title: '外箱毛重(KG)', field: 'outCartonGrossWeight', width: 160 },
	{ title: '单箱数量', field: 'singleCartonQuantity', width: 140 },
	{ title: '总箱数', field: 'cartons', width: 120 },
	{ title: '空柜重(KG)', field: 'emptyContainerWeight', width: 150 },
	{ title: '总体积(m³)', field: 'totalVolume', width: 140 },
	{ title: '总净重(KG)', field: 'totalNetWeight', width: 140 },
	{ title: '总毛重(KG)', field: 'totalGrossWeight', width: 140 },

	// ================= 人员与备注字段 =================
	{ title: '运营', field: 'operationUserName', width: 120 },
	{ title: '采购员', field: 'purchaseUserName', width: 120 },
	{ title: '物流人员', field: 'logisticsUserName', width: 120 },
	{ title: '运营/物控备注', field: 'remark', width: 180 },
	{ title: '物流备注', field: 'logisticsRemark', width: 180 },
	{
		title: '部门&小组',
		field: 'deptName',
		width: 180,
	},
	{ title: '创建人', field: 'createName', width: 120 },
	{ title: '创建时间', field: 'createTime', width: 180 },
	{
		title: '操作',
		field: 'action',
		width: 120,
		fixed: 'right',
		disabled: true,
	},
];

export { columns };
