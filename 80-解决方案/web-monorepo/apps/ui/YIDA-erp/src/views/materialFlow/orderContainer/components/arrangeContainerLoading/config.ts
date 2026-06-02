/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-04-29 14:24:40
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-04-30 14:32:04
 * @FilePath: \qianyi-ui\src\views\materialFlow\orderContainer\components\arrangeContainerLoading\config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { Columns } from '/@/types/table';

export const tableColumns: Columns = [
	{ title: '发货单号', field: 'deliveryNo', width: 180, fixed: 'left' },
	{ title: '发货方式', field: 'shippingMethodText', width: 180, fixed: 'left' },
	{
		title: '变更后预计装柜时间',
		field: 'changedEstimatedLoadingTime',
		width: 250,
		fixed: 'left',
	},
	{
		title: 'SKU/产品名称',
		field: 'skuCode',
		width: 160,
	},
	{ title: '发货数量', field: 'shipmentQuantity', width: 180 },
	{ title: '发货箱数', field: 'deliveryCartonQuantity', width: 180 },
	{ title: '总体积(m³)', field: 'totalVolume', width: 180 },
	{ title: '总净重(KG)', field: 'totalNetWeight', width: 180 },
	{ title: '总毛重(KG)', field: 'totalGrossWeight', width: 180 },
	{
		title: '国家',
		field: 'countryCode',
		width: 180,
	},
	{
		title: '起始港',
		field: 'startPortCode',
		width: 180,
	},
	{
		title: '目的港',
		field: 'destPortCode',
		width: 180,
	},
	{ title: 'MSKU', field: 'mskuCode', width: 180 },
	{ title: '订单类型', field: 'orderTypeText', width: 180 },
	{ title: '渠道', field: 'platformChannelCodeText', width: 180 },
	{
		title: '平台店铺',
		field: 'storeName',
		width: 180,
	},
	{ title: '平台入库单', field: 'shipmentId', width: 180 },
	{ title: '条码', field: 'barcode', width: 180 },
	{ title: '送仓码', field: 'referenceId', width: 180 },
	{ title: '运营/物控备注', field: 'remark', width: 180 },
	{
		title: '外箱长宽高',
		field: 'outCartonLength',
		width: 180,
		slots: { default: 'cartonSize' },
	},
	{ title: '箱规编码', field: 'skuCartonCode', width: 180 },
	{ title: '产品净重(KG)', field: 'productNetWeight', width: 180 },
	{ title: '外箱毛重(KG)', field: 'outCartonGrossWeight', width: 180 },
	{ title: '单箱数量', field: 'singleCartonQuantity', width: 180 },
	{ title: '工厂名称', field: 'factoryName', width: 180 },
	{ title: '采购员', field: 'purchaseUserName', width: 180 },
	{ title: '工厂回复交期', field: 'factoryDeliveryDate', width: 180 },
	{ title: '计划发货时间', field: 'planShipmentDate', width: 180 },
	{ title: '采购单号', field: 'purchaseNo', width: 180 },
	{ title: '部门&小组', field: 'deptName', width: 180 },
	{ title: '运营', field: 'operationUserName', width: 180 },
	{ title: '物控', field: 'createName', width: 180 },
];
