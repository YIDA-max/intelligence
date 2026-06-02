/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-03-25 14:56:33
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-04-01 12:01:15
 * @FilePath: \qianyi-ui-copy\src\views\warehouse\stockManage\fbaInventoryReport\config\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { Columns } from '/@/types/table';
import {
	getAgeListPage,
	getAgeListExport,
	getQuanityList,
} from '/@/api/warehouse/stockManage/companyAge/index';

export const moduleKey = 'companyAge';

export const listApi = {
	getList: getAgeListPage,
	exportList: getAgeListExport,
	postQuanityList: getQuanityList,
};
export const searchConfig = [
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'country',
			settings: {
				text: '国家',
				code: 'countryCodes',
			},
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'dicts',
			settings: {
				text: '平台渠道',
				code: 'platformChannelCodes',
				getTreeDataParams: 'platform_channel',
				selectTreeProps: {
					label: 'label',
					value: 'value',
				},
				getIdsCode: 'id',
			},
		},
	},

	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'warehouseQianyi',
			settings: {
				text: '仓库',
				code: 'warehouseCodes',
				getTreeDataParams: { warehouseTypes: [0, 1, 2] },
			},
		},
	},
	{
		component: 'customCascaderApi',
		props: {
			componentType: 'department',
			settings: {
				code: 'deptIds',
			},
			text: '部门和小组',
			getDataParams: {
				deptName: '运营中心',
				showRootFlag: 0, // 是否显示根节点 1是展示 0不展示
			},
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{
					label: 'SKU',
					value: 'skuCodes',
				},
			],
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{
					label: 'MSKU',
					value: 'mskuCodes',
				},
			],
		},
	},
];
export const columns: Columns = [
	{ type: 'checkbox', width: 60, align: 'center', fixed: 'left' },
	{ title: '报表日期', field: 'reportDate', width: 180 },
	{ title: '法人主体', field: 'legalPersonName', width: 180 },
	{ title: '仓库', field: 'warehouseName', width: 150 },
	{ title: 'SKU', field: 'skuCode', width: 180 },
	{ title: 'MSKU', field: 'mskuCode', width: 180 },
	{ title: '国家', field: 'countryCode', width: 180 },
	{ title: '平台渠道', field: 'platformChannelCode', width: 180 },
	{ title: '部门', field: 'parentDeptName', width: 180 },
	{ title: '小组', field: 'deptName', width: 180 },
	{ title: '总数量(在途+在库)', field: 'totalQty', width: 300 },
	{ title: '0~30', field: 'invAge0To30Days', width: 180 },
	{ title: '31~60', field: 'invAge31To60Days', width: 180 },
	{ title: '61~90', field: 'invAge61To90Days', width: 180 },
	{ title: '91~180  ', field: 'invAge91To180Days', width: 180 },
	{ title: '181~365', field: 'invAge181To365Days', width: 180 },
	{ title: '365+', field: 'invAge365PlusDays', width: 180 },
];
