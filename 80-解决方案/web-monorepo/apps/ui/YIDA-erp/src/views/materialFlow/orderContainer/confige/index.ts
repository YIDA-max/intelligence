/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-04-24 15:52:12
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-05-06 11:59:27
 * @FilePath: \qianyi-ui\src\views\materialFlow\orderContainer\confige\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { Columns } from '/@/types/table';
import { OrderContainerStatus } from './enums';

export interface ActionMenuItem {
	/** 显示名称（i18n key） */
	label: string;
	/** 权限标识 */
	permission: string;
	/** 触发事件名称，upload 为特殊处理 */
	event: string;
	/**
	 * 允许显示的状态列表，空数组表示不限制状态（仅校验权限）
	 * 多个状态之间是 OR 关系
	 */
	statusList: number[];
}

export const columns: Columns = [
	{ type: 'checkbox', width: 40, align: 'center', fixed: 'left' },
	{ title: '订柜号', field: 'orderContainerNo', width: 180 },
	{ title: '状态', field: 'statusText', width: 180 },
	{ title: '目的仓', field: 'destWarehouse', width: 220 },
	{ title: '柜型', field: 'containerTypeText', width: 180 },
	{ title: 'SO', field: 'soNo', width: 180 },
	{ title: '柜号', field: 'containerNo', width: 180 },
	{ title: '出库附件上传', field: 'outboundAttachFlag', width: 180 },
	// { title: '预计装柜时间', field: 'estimatedLoadingTime', width: 180 },
	{ title: '实际装柜时间', field: 'actualLoadingTime', width: 180 },
	{ title: '截单时间', field: 'docCutoffTime', width: 180 },
	{ title: '截关时间', field: 'customsCutoffTime', width: 180 },
	{ title: '订柜备注', field: 'remark', width: 180 },
	{ title: '是否中转拆柜', field: 'transshipmentFlagText', width: 180 },
	{ title: '中转仓', field: 'transWarehouseName', width: 180 },
	{ title: '运输方式', field: 'transportMethodText', width: 180 },
	{
		title: '起运国',
		field: 'startCountryText',
		width: 180,
		prefixObj: { field: 'startCountryCode', connectStr: '-' },
	},
	{
		title: '起始港',
		field: 'startPortText',
		width: 180,
		prefixObj: { field: 'startPortCode', connectStr: '-' },
	},
	{
		title: '目的国',
		field: 'destCountryText',
		width: 180,
		prefixObj: { field: 'destCountryCode', connectStr: '-' },
	},
	{
		title: '目的港',
		field: 'destPortText',
		width: 180,
		prefixObj: { field: 'destPortCode', connectStr: '-' },
	},
	{ title: '附件', field: 'attachmentUrlList1', width: 180 },
	{ title: '总数量', field: 'containerTotalQuantity', width: 180 },
	{ title: '总箱数', field: 'containerTotalCartonQuantity', width: 180 },
	{ title: '总体积(m³)', field: 'containerTotalVolume', width: 180 },
	{ title: '总净重(KG)', field: 'containerTotalNetWeight', width: 180 },
	{ title: '总毛重(KG)', field: 'containerTotalGrossWeight', width: 180 },
	{ title: '创建人', field: 'createName', width: 180 },
	{ title: '创建时间', field: 'createTime', width: 180, sortable: true },
	{ title: '操作', field: 'action', width: 120, fixed: 'right' },
];

export const actionMenuList: ActionMenuItem[] = [
	{
		label: '出库附件上传',
		permission: 'orderContainer_upload',
		event: 'upload',
		statusList: [], // 不限制状态
	},
	{
		label: '编辑',
		permission: 'orderContainer_edit',
		event: 'edit',
		statusList: [
			OrderContainerStatus.WAIT_ORDERING,
			OrderContainerStatus.ALREADY_ORDERING,
			OrderContainerStatus.ALREADY_SEND_MAIL,
			OrderContainerStatus.CONTAINER_LOADING,
			OrderContainerStatus.PART_PICKED_UP,
			OrderContainerStatus.PICKED_UP,
			OrderContainerStatus.ALREADY_DELIVERY,
		],
	},
	{
		label: '确认订舱',
		permission: 'orderContainer_confirmBooking',
		event: 'confirmBooking',
		statusList: [OrderContainerStatus.WAIT_ORDERING],
	},
	{
		label: '确认发货',
		permission: 'orderContainer_confirmShipment',
		event: 'confirmShipment',
		statusList: [OrderContainerStatus.PICKED_UP],
	},
	{
		label: '作废',
		permission: 'orderContainer_cancel',
		event: 'cancel',
		statusList: [
			OrderContainerStatus.WAIT_ORDERING,
			OrderContainerStatus.ALREADY_ORDERING,
			OrderContainerStatus.ALREADY_SEND_MAIL,
		],
	},
	{
		label: '发送工厂装柜邮件',
		permission: 'orderContainer_postEmail',
		event: 'postEmail',
		statusList: [
			OrderContainerStatus.ALREADY_ORDERING,
			OrderContainerStatus.ALREADY_SEND_MAIL,
		],
	},
	{
		label: '导出装箱清单',
		permission: 'orderContainer_exportDeliver',
		event: 'exportDeliverGoods',
		statusList: [], // 不限制状态
	},
	{
		label: '导出截单资料',
		permission: 'orderContainer_exportCutoffData',
		event: 'exportCutoffData',
		statusList: [
			OrderContainerStatus.ALREADY_ORDERING,
			OrderContainerStatus.ALREADY_SEND_MAIL,
			OrderContainerStatus.ALREADY_OUT_STORAGE,
		],
	},
	{
		label: '安排装柜',
		permission: 'orderContainer_arrangeLoading',
		event: 'arrangeLoading',
		statusList: [OrderContainerStatus.ALREADY_SEND_MAIL],
	},
	{
		label: '确认提货',
		permission: 'orderContainer_confirmPickup',
		event: 'confirmPickup',
		statusList: [
			OrderContainerStatus.CONTAINER_LOADING,
			OrderContainerStatus.PART_PICKED_UP,
		],
	},
	{
		label: '头程调拨',
		permission: 'orderContainer_firstLegTransfer',
		event: 'firstLegTransfer',
		statusList: [OrderContainerStatus.ALREADY_DELIVERY],
	},
	{
		label: '日志',
		permission: 'orderContainer_log',
		event: 'log',
		statusList: [], // 不限制状态
	},
];
