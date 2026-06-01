---
name: qianyi-list-table
description: 千易UI多Tab列表页面生成指南。用于生成基于 listTable 模板的多Tab页面，包含 index.vue 入口、各Tab子组件及 config/index.ts 配置。当用户要求生成集成模块列表页、多Tab表格页面时使用此skill。
---

# 千易 UI 多 Tab 列表页面生成指南

基于 `src/template/listAI/listTable` 模板，生成符合项目规范的多 Tab 列表页面。

## 项目约定速查

- 路径别名：`/@/` → `src/`
- 组件懒加载：`defineAsyncComponent(() => import(...))`
- 权限控制：`auth('moduleKey_action')` / `v-auth="'moduleKey_action'"`
- 表格 Hook：`useTable(state, baseTableRef)`
- 搜索组件：`SelectInput` / `SelectDate` / `customCascaderApi` / `TreeSelectInputApi`
- 关联跳转列：`slotName: 'RowValueLink'` + `slotAttrs: stockOrgRelation | productInfoOrgRelation`

---

## 第一步：确认需求信息

生成前必须明确以下信息：

```
模块名称：xxx（中文，用于注释）
模块路径：src/views/xxx/xxx/moduleName
API路径：src/api/xxx/xxx/moduleName

Tabs配置（每个Tab）：
  - Tab名称：中文显示名
  - Tab目录名：英文camelCase（如 notGeneratedOrder）
  - moduleKey：权限标识（如 platformWarehouseInventory_notGeneratedOrder）
  - 是否显示数量：是/否（显示数量的Tab需要 @refresh-count emit）
  - 是否有"生成金蝶单据"按钮：是/否

表格字段（每个Tab的 columns）
搜索条件（每个Tab的 searchConfig）
```

---

## 第二步：文件结构

```
src/
├── api/xxx/xxx/moduleName/
│   └── index.ts                    # API定义
└── views/xxx/xxx/moduleName/
    ├── index.vue                   # 主入口（Tabs容器）
    ├── notGeneratedOrder/          # Tab1目录（英文camelCase）
    │   ├── index.vue
    │   └── config/index.ts
    ├── generatedOrder/             # Tab2目录
    │   ├── index.vue
    │   └── config/index.ts
    └── generatedFailedOrder/       # Tab3目录（带数量显示）
        ├── index.vue
        └── config/index.ts
```

---

## 第三步：生成各文件

### 3.1 API 文件（`src/api/.../index.ts`）

参考 [api-pattern](references/api-pattern.md)

### 3.2 主入口（`index.vue`）

参考 [index-vue-pattern](references/index-vue-pattern.md)

### 3.3 Tab 子组件（`tabName/index.vue`）

参考 [tab-index-vue-pattern](references/tab-index-vue-pattern.md)

### 3.4 Tab 配置（`tabName/config/index.ts`）

参考 [tab-config-pattern](references/tab-config-pattern.md)

---

## 第四步：关键细节检查

### columns 字段规范

```typescript
// 普通字段
{ field: 'fieldName', title: '字段名', width: 150 }

// 带关联跳转（金蝶相关字段）
{
  title: '金蝶物料编码',
  field: 'kingdeeMaterialCode',
  width: 150,
  slotName: 'RowValueLink',
  slotAttrs: productInfoOrgRelation,  // 产品关系
}
{
  title: '金蝶仓库编码',
  field: 'kingdeeWarehouseCode',
  width: 150,
  slotName: 'RowValueLink',
  slotAttrs: stockOrgRelation,        // 库存组织关系
}

// 可排序字段
{ title: '创建时间', field: 'createTime', width: 180, sortable: true }
```

### searchConfig 组件类型

```typescript
// 文本/多类型搜索
{
  component: 'SelectInput',
  props: {
    searchTypes: [
      { label: 'SKU', value: 'skuCodes' },
      { label: '金蝶单据号', value: 'generateKingdeeDocNos' },
    ],
  },
}

// 日期范围搜索
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
}

// 仟易仓库级联
{
  component: 'customCascaderApi',
  props: {
    componentType: 'warehouseId',
    settings: { code: 'warehouseCodes', text: '仟易仓库' },
    blacklist: ['2'],
  },
}

// 金蝶库存组织树选择
{
  component: 'TreeSelectInputApi',
  props: {
    componentType: 'kingdeeOrg',
    settings: { code: 'inventoryOrgCodes', text: '金蝶库存组织' },
  },
}

// 用户列表树选择
{
  component: 'TreeSelectInputApi',
  props: {
    componentType: 'userList',
    settings: { text: '金蝶单据创建人', code: 'docCreateIds' },
  },
}
```

### 生成金蝶单据按钮（未生成 Tab 专用）

```vue
<template #left-tool>
	<el-button
		type="primary"
		class="ml10"
		v-auth="`${moduleKey}_generate`"
		@click="generateKdBill"
		>{{ $t('生成金蝶单据') }}</el-button
	>
</template>
```

对应 script 逻辑参考 [generate-kd-bill-pattern](references/generate-kd-bill-pattern.md)

### 带数量 Tab（生成失败 Tab）

- `index.vue` 需要 `defineEmits(['refresh-count'])` 并在 `onMounted` 中触发
- 主入口 `index.vue` 需要 `getFailedCountApi` 获取数量并绑定到 Tab label

---

## 常见模块字段对照

### 通用基础字段（所有 Tab 共有）

| 字段名               | title            | width               |
| -------------------- | ---------------- | ------------------- |
| integrationCode      | 集成数据编码     | 180                 |
| platform             | 平台             | 120                 |
| shopSite             | 店铺站点         | 150                 |
| warehouseCode        | 仓库             | 150                 |
| inventoryTime        | 盘点时间         | 160                 |
| msku                 | MSKU             | 150                 |
| skuCode              | SKU              | 180                 |
| inventoryQuantity    | 盘点数量         | 120                 |
| kingdeeMaterialCode  | 金蝶物料编码     | 150（RowValueLink） |
| kingdeeWarehouseCode | 金蝶仓库编码     | 150（RowValueLink） |
| kingdeeWarehouseName | 金蝶仓库名称     | 150（RowValueLink） |
| inventoryOrgCode     | 金蝶库存组织编码 | 160（RowValueLink） |
| inventoryOrgName     | 金蝶库存组织名称 | 160（RowValueLink） |
| kingdeeDeptCode      | 金蝶部门编码     | 160（RowValueLink） |
| kingdeeDeptName      | 金蝶部门名称     | 160（RowValueLink） |
| createTime           | 集成数据创建时间 | 180（sortable）     |

### 已生成 Tab 额外字段

| 字段名                 | title            | width |
| ---------------------- | ---------------- | ----- |
| generateKingdeeDocName | 金蝶单据名称     | 150   |
| generateKingdeeDocNo   | 金蝶单据编号     | 180   |
| generateKingdeeDocTime | 金蝶单据生成时间 | 180   |
| kingdeeDocCreateName   | 金蝶单据创建人   | 150   |

### 生成失败 Tab 额外字段

| 字段名          | title    | width |
| --------------- | -------- | ----- |
| pushErrorReason | 失败原因 | 250   |
