---
title: Tab配置文件模式
type: pattern
tags: [qianyi, config, columns, searchConfig]
---

# Tab 配置文件 `config/index.ts` 模式

每个 Tab 的配置文件，导出 `listApi`、`moduleKey`、`searchConfig`、`columns`。

## 完整示例（未生成 Tab）

```typescript
import {
	stockOrgRelation,
	productInfoOrgRelation,
} from '/@/views/integrations/components/tableRouteConfig';
import type { Columns } from '/@/types/table';
import {
	getXxxNotGeneratedPage,
	getXxxNotGeneratedExport,
	postXxxPushKingdee,
} from '/@/api/integrations/xxx/moduleName';

export const listApi = {
	getList: getXxxNotGeneratedPage,
	exportList: getXxxNotGeneratedExport,
	generateList: postXxxPushKingdee, // 有生成按钮时才需要
};

export const moduleKey = 'xxxModule_notGeneratedOrder';

export const searchConfig: Array<{
	component: string;
	props: Record<string, any>;
}> = [
	{
		component: 'customCascaderApi',
		props: {
			componentType: 'warehouseId',
			settings: { code: 'warehouseCodes', text: '仟易仓库' },
			blacklist: ['2'],
		},
	},
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'kingdeeOrg',
			settings: { code: 'inventoryOrgCodes', text: '金蝶库存组织' },
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [{ label: 'SKU', value: 'skuCodes' }],
		},
	},
	{
		component: 'SelectDate',
		props: {
			searchTypes: [
				{
					label: '集成数据创建时间',
					value: 'createTime',
					isAddHMS: true,
					dateStart: 'createTimeStart',
					dateEnd: 'createTimeEnd',
				},
			],
		},
	},
];

export const columns: Columns = [
	{
		type: 'checkbox',
		width: 60,
		align: 'center',
		fixed: 'left',
	},
	{ field: 'integrationCode', title: '集成数据编码', width: 180 },
	{ field: 'platform', title: '平台', width: 120 },
	{ field: 'shopSite', title: '店铺站点', width: 150 },
	{ field: 'warehouseCode', title: '仓库', width: 150 },
	{ field: 'inventoryTime', title: '盘点时间', width: 160 },
	{ field: 'msku', title: 'MSKU', width: 150 },
	{ title: 'SKU', field: 'skuCode', width: 180 },
	{
		field: 'inventoryQuantity',
		title: '盘点数量',
		width: 120,
		align: 'center',
	},
	{
		title: '金蝶物料编码',
		field: 'kingdeeMaterialCode',
		width: 150,
		slotName: 'RowValueLink',
		slotAttrs: productInfoOrgRelation,
	},
	{
		title: '金蝶仓库编码',
		field: 'kingdeeWarehouseCode',
		width: 150,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶仓库名称',
		field: 'kingdeeWarehouseName',
		width: 150,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶库存组织编码',
		field: 'inventoryOrgCode',
		width: 160,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶库存组织名称',
		field: 'inventoryOrgName',
		width: 160,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶部门编码',
		field: 'kingdeeDeptCode',
		width: 160,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '金蝶部门名称',
		field: 'kingdeeDeptName',
		width: 160,
		slotName: 'RowValueLink',
		slotAttrs: stockOrgRelation,
	},
	{
		title: '集成数据创建时间',
		field: 'createTime',
		width: 180,
		sortable: true,
	},
];
```

## 已生成 Tab 额外字段

在基础字段后追加：

```typescript
{ title: '金蝶单据名称', field: 'generateKingdeeDocName', width: 150 },
{ title: '金蝶单据编号', field: 'generateKingdeeDocNo', width: 180 },
{ title: '金蝶单据生成时间', field: 'generateKingdeeDocTime', width: 180 },
{ title: '金蝶单据创建人', field: 'kingdeeDocCreateName', width: 150 },
```

已生成 Tab 的 `searchConfig` 额外增加：

```typescript
// 用户列表（金蝶单据创建人）
{
  component: 'TreeSelectInputApi',
  props: {
    componentType: 'userList',
    settings: { text: '金蝶单据创建人', code: 'docCreateIds' },
  },
},
// SelectInput 增加金蝶单据号搜索类型
{ label: '金蝶单据号', value: 'generateKingdeeDocNos' },
// SelectDate 增加金蝶单据生成时间
{
  label: '金蝶单据生成时间',
  value: 'generateKingdeeDocTime',
  isAddHMS: true,
  dateStart: 'generateKingdeeDocTimeStart',
  dateEnd: 'generateKingdeeDocTimeEnd',
},
```

## 生成失败 Tab 额外字段

在基础字段后追加：

```typescript
{ title: '失败原因', field: 'pushErrorReason', width: 250 },
```

## 注意事项

- `moduleKey` 每个 Tab 必须唯一，格式：`模块名_tabName`
- `slotName: 'RowValueLink'` 配合 `slotAttrs` 实现关联跳转
  - 产品关系用 `productInfoOrgRelation`
  - 库存组织/仓库/部门关系用 `stockOrgRelation`
- `sortable: true` 只加在需要排序的字段（通常是时间字段）
- `align: 'center'` 通常用于数量、状态等数值字段
