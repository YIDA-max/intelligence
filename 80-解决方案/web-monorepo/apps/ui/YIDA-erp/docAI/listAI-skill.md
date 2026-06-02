# ListAI 列表页面生成 Skill

## 概述

基于 `src/template/listAI` 模板，通过 AI 快速生成标准化列表页面代码。支持以下三种模式：

- **单列表**：标准单表格页面
- **多 Tabs 列表**：自定义多标签页
- **金蝶推送多列表**：固定三个 Tab（未生成 / 已生成 / 生成失败）的金蝶推送集成场景

---

## 一、使用前准备

收集以下信息（可从需求文档/接口文档获取）：

| 信息类型 | 内容                                               | 是否必填 | 默认值                         |
| -------- | -------------------------------------------------- | -------- | ------------------------------ |
| 模块类型 | 单列表 / 多 Tabs / 金蝶推送多列表                  | 可选     | 不填默认**单列表**             |
| 模块名称 | 如`platformWarehouseDiff`                          | 必填     | -                              |
| 模块路径 | 如`materialFlow/freightFlow/platformWarehouseDiff` | 必填     | -                              |
| 表格字段 | 字段名称、接口字段名、宽度                         | 必填     | 宽度可不填，按默认宽度规则推导 |
| 搜索条件 | 搜索类型、显示名称、接口入参                       | 可选     | 不填默认无搜索条件             |
| 功能需求 | 导出/新增/编辑/删除                                | 可选     | 不填默认只有**查看 + 导出**    |
| 接口路径 | 列表/导出/删除等接口                               | 可选     | 不填表示接口未完成，按语义占位 |
| 特殊交互 | 链接/颜色/自定义操作                               | 可选     | 不填默认**无特殊交互**         |

---

## 二、提示词模板

### 单列表

```
请基于 src/template/listAI/listSingle 模板生成列表页面：

模块信息：
- 模块名称：[模块名称]
- 模块路径：src/views/[路径]
- API路径：src/api/[路径]

表格字段：
1. [字段名称] - [接口字段名] - 宽度[数字]
2. [字段名称] - [接口字段名] - 宽度[数字]

搜索条件：
1. [搜索类型] - [显示名称] - [接口入参] - [特殊配置]

功能需求：
- 导出：[是/否]
- 导入：[是/否]
- 新增：[是/否]
- 编辑：[是/否]
- 删除：[是/否]
- 其他操作：[描述]

特殊交互：
- [描述]

接口信息：
- 列表查询：[接口路径]
- 导出：[接口路径]
- 删除：[接口路径]
```

### 多 Tabs 列表

```
请基于 src/template/listAI/listTable 模板生成多Tabs列表页面：

模块信息：
- 模块名称：[模块名称]
- 模块路径：src/views/[路径]
- API路径：src/api/[路径]

Tabs配置：
1. Tab名称：[名称] - moduleKey：[key] - 显示数量：[是/否]
2. Tab名称：[名称] - moduleKey：[key] - 显示数量：[是/否]

每个Tab的字段/搜索/功能配置参考单列表格式...
```

### 金蝶推送多列表

固定三个 Tab 的金蝶推送集成场景，Tab 结构和权限规则固定，只需提供业务字段和搜索条件。

**固定 Tab 结构：**

| Tab 名称 | name（路由 key）     | 目录名                | queryForm 状态值 |
| -------- | -------------------- | --------------------- | ---------------- |
| 未生成   | notGeneratedOrder    | notGeneratedOrder/    | `{ status: 0 }`  |
| 已生成   | generatedOrder       | generatedOrder/       | `{ status: 1 }`  |
| 生成失败 | generatedFailedOrder | generatedFailedOrder/ | `{ status: 2 }`  |

**moduleKey 规则：** `{父模块驼峰路径}_{tabName}`，例如：

```
purchaseInboundJingciPurchaseInbound_notGeneratedOrder
purchaseInboundJingciPurchaseInbound_generatedOrder
purchaseInboundJingciPurchaseInbound_generatedFailedOrder
```

**权限按钮规则（每个 Tab 独立）：**

| Tab      | 权限按钮                                                                         |
| -------- | -------------------------------------------------------------------------------- |
| 未生成   | `{moduleKey}_view`、`{moduleKey}_export`、`{moduleKey}_generate`（生成金蝶数据） |
| 已生成   | `{moduleKey}_view`、`{moduleKey}_export`                                         |
| 生成失败 | `{moduleKey}_view`、`{moduleKey}_export`、`{moduleKey}_generate`（重新生成）     |

**生成失败 Tab 特殊处理：**

- label 显示数量角标：`生成失败 <span class="text-red-500">（{{ failedOrderCount }}）</span>`
- 父容器 `index.vue` 需在 `onMounted` 时查询失败数量，并在未生成/生成失败操作后通过 `emit('refresh-failed-count')` 刷新

**文件结构：**

```
src/views/[模块路径]/
├── notGeneratedOrder/
│   ├── config/index.ts
│   └── index.vue
├── generatedOrder/
│   ├── config/index.ts
│   └── index.vue
├── generatedFailedOrder/
│   ├── config/index.ts
│   └── index.vue
├── index.vue          ← Tabs 容器，含 failedOrderCount 逻辑
└── [模块名称].md      ← 空文件，模块标识，方便查询
```

**提示词模板：**

```
请基于金蝶推送多列表模式生成页面：

模块信息：
- 模块名称：[模块名称]
- 模块路径：src/views/[路径]
- API路径：src/api/[路径]

表格字段（三个Tab共用，如有差异请分别说明）：
1. [字段名称] - [接口字段名]
2. [字段名称] - [接口字段名]

搜索条件（三个Tab共用，如有差异请分别说明）：
1. [搜索类型] - [显示名称] - [接口入参]

接口信息：
- 列表查询：[接口路径]（三个Tab共用同一接口，通过 status 区分）
- 导出：[接口路径]
- 生成金蝶数据：[接口路径]
```

**参考实现：** `src/views/integrations/purchaseInbound/jingciPurchaseInbound/`

---

## 三、搜索条件类型速查

### 字典（TreeSelectInputApi - dicts）

```typescript
{
  component: 'TreeSelectInputApi',
  props: {
    componentType: 'dicts',
    settings: {
      code: 'platforms',              // 接口入参，多选带 s
      text: '平台',
      getTreeDataParams: 'platform_channel', // 字典枚举值，必传
    },
  },
}
```

### 仓库级联（customCascaderApi - warehouseId）

> 默认规则：无特殊说明时，"仓库"搜索条件统一使用 `warehouseId` 类型。"仟易仓库"也属于仓库，同样使用 `warehouseId` 类型，不要因为名称带"仟易"就改用其他类型。
>
> ⚠️ 即使需求描述中出现"店铺虚拟仓"、"Amazon 虚拟仓"等字样，只要搜索项名称是**仓库**，就用 `warehouseId`，不要改成 `storeSiteId`。

```typescript
{
  component: 'customCascaderApi',
  props: {
    componentType: 'warehouseId',
    settings: { code: 'warehouseCodes', text: '仓库' },
  },
}
```

### 店铺/站点级联（customCascaderApi - storeSiteId）

> 仅在需求明确说明"店铺/站点"时使用 `storeSiteId` 类型，不可与仓库混用。

```typescript
{
  component: 'customCascaderApi',
  props: {
    componentType: 'storeSiteId',
    settings: { code: 'storeSiteIds', text: '店铺/站点' },
  },
}
```

### 模糊搜索（SelectInput）

```typescript
{
  component: 'SelectInput',
  props: {
    searchTypes: [
      { label: '订单号', value: 'orderNos' },
      { label: 'SKU',   value: 'skuCodes' },
    ],
  },
}
```

**常用字段默认值（未提供接口文档时使用）**:

| label    | value     | 说明                          |
| -------- | --------- | ----------------------------- |
| SKU      | skuCodes  | SKU 编码，批量精确，单个模糊  |
| MSKU     | mskuCodes | MSKU 编码，批量精确，单个模糊 |
| 商品 ID  | goodsIds  | 商品 ID，批量精确，单个模糊   |
| 产品名称 | skuNames  | 产品名称，批量精确，单个模糊  |
| 订单号   | orderNos  | 订单号，批量精确，单个模糊    |

**注意**:

- 复数形式（带 s）表示支持批量查询
- 对接接口时，以实际接口文档为准
- 如果接口字段不同，需在对接文档中标注

### 时间选择（SelectDate）— 默认放最后

`isAddHMS` 默认为 `true`（自动补全时分秒），无需特别说明时直接加上。

`dateType` 默认不传（日期选择），需求明确要求**只选月份**时传 `dateType: 'month'`。

```typescript
// 普通日期（默认）
{
  component: 'SelectDate',
  props: {
    searchTypes: [
      {
        label: '创建时间',
        value: 'createTime',
        isAddHMS: true,
        dateStart: 'createTimeStart',
        dateEnd: 'createTimeEnd',
      },
    ],
  },
}

// 月份选择
{
  component: 'SelectDate',
  props: {
    dateType: 'month',
    searchTypes: [
      {
        label: '日期',
        value: 'date',
        isAddHMS: true,
        dateStart: 'dateStart',
        dateEnd: 'dateEnd',
      },
    ],
  },
}
```

---

三、已有 componentType 映射表

> 完整映射表已迁移至：`src/componentsApi/shared/componentType-map.md`
>
> 使用前请读取该文件获取最新的 componentType 列表，新增类型时也在该文件同步更新。

**快速参考（常用类型）：**

| componentType    | 默认 text    | 默认 code     | 说明                               |
| ---------------- | ------------ | ------------- | ---------------------------------- |
| `dicts`          | 请选择       | values        | 字典通用，需传 `getTreeDataParams` |
| `currencyOption` | 仟易币种     | currencyCodes | 币种                               |
| `feeTypeList`    | 费用类型名称 | feeType       | 费用类型                           |
| `userList`       | 创建人       | createNames   | 用户列表                           |
| `payableObject`  | 应付对象     | payableObject | 应付对象，接口返回 code/name       |
| `spInfo`         | 服务商       | spId          | 服务商                             |

完整列表见 👉 `src/componentsApi/shared/componentType-map.md`

## 四、特殊交互场景

### 字段拼接显示（prefixObj）

当需要将两个字段拼接显示时，使用 `prefixObj` 配置：

```typescript
{
  title: '店铺站点',
  field: 'siteCode',           // 主字段
  width: 180,
  prefixObj: { field: 'storeName' }  // 前缀字段
}
```

**说明**:

- `field`: 主字段，显示在后面
- `prefixObj.field`: 前缀字段，显示在前面
- 最终显示效果: `{storeName}-{siteCode}`，如 "美国店铺-US"

**常见使用场景**:

- 店铺站点: `storeName` + `siteCode`
- 仓库区域: `warehouseName` + `areaCode`
- 完整地址: `province` + `city` + `address`

**注意**:

- 如果后端直接返回拼接好的字段，则不需要使用 `prefixObj`
- 拼接格式固定为 `{prefix}-{field}`，中间用短横线连接

### 链接类型（点击弹窗/跳转）

```vue
<template #receiveQuantity="{ row }">
	<span
		class="text-blue-500 cursor-pointer hover:underline"
		@click="handleReceiveDetail(row)"
	>
		{{ row.receiveQuantity }}
	</span>
</template>
```

### 颜色显示（差异数量）

```vue
<template #diffQuantity="{ row }">
	<span
		:class="{
			'text-gray-500': row.diffQuantity === 0,
			'text-red-500': row.diffQuantity < 0,
			'text-green-500': row.diffQuantity > 0,
		}"
	>
		{{ row.diffQuantity > 0 ? `+${row.diffQuantity}` : row.diffQuantity }}
	</span>
</template>
```

### 操作栏

```vue
<template #action="{ row }">
	<div class="flex justify-center">
		<!-- 编辑 -->
		<EditOrAdd
			:type="'edit'"
			:row="row"
			v-auth="`${moduleKey}-edit`"
			@getDataList="register?.getDataList"
		/>
		<!-- 下拉菜单（含删除等） -->
		<ActionDropdown
			:row="row"
			:menu-list="actionMenuList"
			@delete="handleDelete"
		/>
	</div>
</template>
```

### 导入功能

使用 `ImportDialog` 组件（`/@/components/fileUpload/importDialog.vue`），通过 `ref` 调用 `show()` 打开弹窗。

**提示词关键词**：用户说"导入"时生成此功能。

**index.vue 模板部分**：

```vue
<!-- BaseTable 使用 left-tool 插槽放导入按钮 -->
<BaseTable ref="baseTableRef" :register="register">
	<template #left-tool>
		<el-button
			class="ml10"
			v-auth="`${moduleKey}_import`"
			@click="importDialogRef?.show()"
		>
			{{ $t('导入') }}
		</el-button>
	</template>
</BaseTable>

<!-- 导入弹窗，放在 BaseTable 外面、父容器内 -->
<ImportDialog
	ref="importDialogRef"
	title="导入[模块名称]"
	:templateUrl="[模块名称大写]_IMPORT_TEMPLATE_URL"
	:excelUploadApi="[模块名称大写]_IMPORT_URL"
	:accept="'.xlsx,.xls'"
	@refreshDataList="register?.getDataList"
/>
```

> `templateUrl` 为下载模板的地址，后端未提供时可省略该 prop。

**script 部分**：

```typescript
// 引入组件
const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);

// ref
const importDialogRef = ref();
```

**API 文件**：接口未提供时用常量占位，提供后直接更新常量值即可。

```typescript
/** 导入接口路径（接口待后端提供） */
export const [模块名称大写]_IMPORT_URL = '/[接口路径]/import';

/** 导入模板下载地址，固定格式为 /files/import-template/[模板文件名].xlsx（模板待后端提供） */
export const [模块名称大写]_IMPORT_TEMPLATE_URL =
	'/files/import-template/[模块名称]导入模板.xlsx';
```

**权限标识**：`${moduleKey}_import`

---

## 五、生成文件结构

### 单列表

```
src/views/[模块路径]/
├── config/
│   └── index.ts     ← moduleKey、columns、searchConfig、listApi
├── index.vue        ← 主页面
└── [模块名称].md    ← 空文件，模块标识，方便查询

src/api/[模块路径]/
└── index.ts         ← 接口类型定义 + API 方法
```

### 多 Tabs 列表

```
src/views/[模块路径]/
├── tab1/
│   ├── config/index.ts
│   └── index.vue
├── tab2/
│   ├── config/index.ts
│   └── index.vue
├── index.vue        ← Tabs 容器
└── [模块名称].md    ← 空文件，模块标识，方便查询

src/api/[模块路径]/
└── index.ts
```

---

## 六、生成规则

### 默认行为约定

| 信息项        | 未提供时的默认处理                                                             |
| ------------- | ------------------------------------------------------------------------------ |
| 模块类型      | 默认使用**单列表**模板                                                         |
| 功能需求      | 默认生成**查看 + 导出**，不生成新增/编辑/删除                                  |
| 特殊交互      | 默认无，不生成任何自定义插槽                                                   |
| 接口路径      | 未提供表示接口尚未完成，API 函数按语义命名占位，URL 路径按模块路径语义推导填写 |
| 表格字段宽度  | 未指定时按下方默认宽度规则推导                                                 |
| 接口字段名    | 未提供 apifox 接口文档时，按字段含义语义推导（驼峰命名），接口完成后再对齐调整 |
| 菜单权限 xlsx | **默认自动生成**，包含查看和导出权限，输出到 docAI/output_menu.xlsx            |
| 模块 .md 文件 | **默认自动创建**，在模块目录下新建与模块名同名的空 `.md` 文件，方便后续查询    |

### 对接接口场景的特殊规则

**重要**：当用户明确说明是在**对接接口**或**调整接口字段**时，表示前端代码已经生成完成，只是在进行接口字段的对齐调整。此时：

- **不需要**重新生成菜单权限 xlsx
- **不需要**执行其他默认生成操作
- **只需要**根据实际接口文档调整字段名称、接口路径等
- 用户关注点在于字段对齐，而非完整的模块生成流程

**识别关键词**：

- "对接接口"
- "调整接口字段"
- "接口字段对齐"
- "根据接口文档修改"
- "后端接口已完成"

**示例场景**：

```
用户："对接接口，把 skuCode 改成 sku，warehouseName 改成 warehouse"
AI 行为：只修改字段名，不生成菜单权限 xlsx
```

### 对接完成后的字段差异报告

**重要**：对接接口完成后，必须主动检查并告知用户以下情况：

**需要报告的字段差异类型：**

| 差异类型               | 说明                                                       | 示例                                              |
| ---------------------- | ---------------------------------------------------------- | ------------------------------------------------- |
| 前端有、接口文档无     | 前端代码中使用了某字段，但接口文档的响应结构中不存在该字段 | 前端用`warehouseName`，接口只返回 `warehouseCode` |
| 接口文档有、前端未使用 | 接口返回了某字段，但前端 columns 中未展示                  | 接口返回`syncFlag`、`createTime` 等未在列表中展示 |
| 字段名拼写不一致       | 字段名大小写或命名风格不匹配                               | 前端`shopSite` vs 接口 `siteCode`                 |

**报告格式**：

```
⚠️ 字段对接差异提示：

以下字段在前端代码中使用，但接口文档响应中未找到，请与后端确认：
- `warehouseName`（前端列：仓库）→ 接口文档只有 `warehouseCode`，建议后端补充或前端改用 `warehouseCode`
```

**处理原则**：

- 只报告，不擅自修改有歧义的字段（如 `warehouseName` 可能后端实际有返回但文档未写全）
- 明确的字段名错误（如拼写错误）可直接修正并说明
- 建议用户跑一次接口确认实际返回结构

### 表格字段默认宽度规则

| 字段类型                                              | 默认宽度 |
| ----------------------------------------------------- | -------- |
| SKU / skuCode                                         | 180      |
| MSKU / mskuCode                                       | 180      |
| 产品名称 / productName / skuName                      | 200      |
| 商品 ID / goodsId                                     | 180      |
| 仓库名称 / warehouseName                              | 150      |
| 店铺站点 / storeSite                                  | 180      |
| 平台 / platform                                       | 100      |
| 各类状态（xxStatus / xxValue）                        | 120      |
| 各类单号（xxNo / xxId / xxCode）                      | 180      |
| 各类数量 / 库存（xxQuantity / xxInventory / xxCount） | 120      |
| 日期 / 时间（xxDate / xxTime）                        | 180      |
| 操作栏 action                                         | 100      |
| 其他普通文本字段                                      | 150      |

### 常用字段默认值（未提供接口文档时）

#### 搜索条件字段

| 搜索项   | 前端字段       | 说明                                               |
| -------- | -------------- | -------------------------------------------------- |
| 仓库     | warehouseCodes | 仓库级联选择，使用 customCascaderApi - warehouseId |
| SKU      | skuCodes       | 模糊搜索，批量精确，单个模糊                       |
| MSKU     | mskuCodes      | 模糊搜索，批量精确，单个模糊                       |
| 商品 ID  | goodsIds       | 模糊搜索，批量精确，单个模糊                       |
| 产品名称 | skuNames       | 模糊搜索，批量精确，单个模糊                       |

**完整配置示例**:

```typescript
export const searchConfig = [
	{
		component: 'customCascaderApi',
		props: {
			componentType: 'warehouseId',
			settings: { code: 'warehouseCodes', text: '仓库' },
		},
	},
	{
		component: 'SelectInput',
		props: {
			searchTypes: [
				{ label: 'SKU', value: 'skuCodes' },
				{ label: 'MSKU', value: 'mskuCodes' },
				{ label: '商品ID', value: 'goodsIds' },
				{ label: '产品名称', value: 'skuNames' },
			],
		},
	},
];
```

#### 列表字段

| 列名     | field         | 宽度 | 特殊配置                          |
| -------- | ------------- | ---- | --------------------------------- |
| 仓库     | warehouseName | 150  | -                                 |
| 店铺站点 | siteCode      | 180  | prefixObj: { field: 'storeName' } |
| MSKU     | mskuCode      | 180  | -                                 |
| 商品 ID  | goodsId       | 180  | -                                 |
| SKU      | skuCode       | 180  | -                                 |
| 产品名称 | skuName       | 200  | -                                 |

**完整配置示例**:

```typescript
export const columns: Columns = [
	{ type: 'checkbox', width: 60, align: 'center', fixed: 'left' },
	{ title: '仓库', field: 'warehouseName', width: 150 },
	{
		title: '店铺站点',
		field: 'siteCode',
		width: 180,
		prefixObj: { field: 'storeName' },
	},
	{ title: 'MSKU', field: 'mskuCode', width: 180 },
	{ title: '商品ID', field: 'goodsId', width: 180 },
	{ title: 'SKU', field: 'skuCode', width: 180 },
	{ title: '产品名称', field: 'skuName', width: 200 },
	// ... 其他业务字段
];
```

**注意事项**:

- 以上为未提供接口文档时的默认值
- 对接接口时，必须以实际接口文档的字段名为准
- 如果接口字段名不同，需在对接文档中标注差异
- `title` (列名) 始终以需求文档为准，不可修改
- `field` 需要根据接口文档调整以匹配后端返回的字段名

### moduleKey

```typescript
// 单列表：使用文件夹名
export const moduleKey = 'platformWarehouseDiff';

// 多Tabs：父模块_tab名
export const moduleKey = 'selfOrderSync_notGeneratedOrder';
```

### columns 固定结构

```typescript
export const columns: Columns = [
	{ type: 'checkbox', width: 60, align: 'center', fixed: 'left' }, // 固定，不可省略
	{ title: '字段名称', field: 'fieldName', width: 150 },
	// ...按需求文档顺序排列
	{ title: '操作', field: 'action', width: 150, fixed: 'right' }, // 有操作时添加
];
```

### listApi 映射

```typescript
export const listApi = {
	getList: getListPage, // 必须
	exportList: postListExport, // 有导出时
	deleteItem: deleteListItem, // 有删除时
};
```

### 权限标识格式

```
${moduleKey}_view      查看
${moduleKey}_export    导出
${moduleKey}_add       新增
${moduleKey}_edit      编辑
${moduleKey}_delete    删除
${moduleKey}_log    日志
${moduleKey}_[自定义]  其他操作
```

---

## 七、完整示例

### 平台仓库收发差异（单列表）

```
请基于 src/template/listAI/listSingle 模板生成列表页面：

模块信息：
- 模块名称：platformWarehouseDiff
- 模块路径：src/views/materialFlow/freightFlow/platformWarehouseDiff
- API路径：src/api/materialFlow/freightFlow/platformWarehouseDiff

表格字段：
1. Shipment ID - shipmentId - 宽度150
2. 货件单状态 - shipmentStatus - 宽度120
3. 平台 - platform - 宽度100
4. 目的仓 - destinationWarehouseName - 宽度150
5. 调货单号 - transferOrderNo - 宽度180
6. 发货单号 - deliveryNo - 宽度180
7. 匹配状态 - matchStatus - 宽度100
8. 差异处理状态 - handledDiffStatusValue - 宽度130
9. MSKU - mskuCode - 宽度180
10. SKU - skuCode - 宽度180
11. 产品名称 - productName - 宽度200
12. 发货数量 - shipQuantity - 宽度100
13. 收货数量 - receiveQuantity - 宽度100（链接类型，点击显示收货详情弹窗）
14. 收货时间 - lastReceiveDate - 宽度180
15. 差异数量 - diffQuantity - 宽度100（颜色显示：0灰色、负数红色、正数绿色带+号）
16. 已处理差异数量 - handledDiffQuantity - 宽度140
17. 操作 - action - 宽度100

搜索条件：
1. 字典 - 平台 - platforms - platform_channel
2. 字典 - 匹配状态 - matchStatus - platform_warehouse_diff_match_status
3. 字典 - 差异处理状态 - handledDiffStatus - platform_warehouse_diff_handled_status
4. 仓库级联 - 目的仓 - destinationWarehouseCodes
5. 模糊搜索 - Shipment ID/调拨单号/发货单号/SKU/MSKU - shipmentIds/transferOrderNos/deliveryNos/skuCodes/mskuCodes
6. 时间选择 - 收货时间 - receiveDateStart/receiveDateEnd - 添加时分秒

功能需求：
- 导出：是
- 左侧工具栏：更新货件信息按钮
- 操作栏：处理收发差异按钮（条件显示）

接口信息：
- 列表查询：/kingdee/kingdeeShipmentDiff/page
- 导出：/kingdee/kingdeeShipmentDiff/export
- 收货详情：/kingdee/kingdeeShipmentItem/listByDiffId
- 处理差异：/kingdee/kingdeeShipmentDiff/handle
```

---

## 八、注意事项

1. 字段顺序严格按需求文档/截图排列
2. 时间选择默认放在搜索条件最后
3. 操作栏 `field` 固定为 `action`
4. API 路径层级与 view 路径保持一致（view → api）
5. 多 Tabs 的 API 文件统一放在父模块目录下
6. `type: 'checkbox'` 是固定首列，不可省略

---

## 八-A、接口调用与消息提示规范

### 接口响应处理

接口请求成功后需用变量接收返回值，通过 `res?.code === 0` 判断业务是否成功：

```typescript
const res = await listApi.someAction(payload);
if (res?.code === 0) {
	message.success('操作成功');
	// 刷新列表等后续操作
}
// 其他 code 值会被网络请求层统一捕获并提示，当前页无需手动处理
```

### message 使用规范

| 场景                                   | 方法                   | 说明                               |
| -------------------------------------- | ---------------------- | ---------------------------------- |
| 前端校验不通过（未选数据、状态不符等） | `message.warning(...)` | 用户操作引起的提示，属于警告级别   |
| 操作成功                               | `message.success(...)` | 接口返回 `code === 0` 时           |
| 接口异常（catch 到的非 cancel 错误）   | `message.error(...)`   | 网络层未捕获的异常才需要手动 error |

```typescript
// ✅ 正确
if (selectRows.length === 0) {
	message.warning('请至少选择一条数据'); // 前端校验 → warning
	return;
}
const res = await listApi.discard(payload);
if (res?.code === 0) {
	message.success('作废成功'); // 成功 → success
}

// ❌ 错误
if (selectRows.length === 0) {
	message.error('请至少选择一条数据'); // 前端校验不应用 error
}
```

### 弹窗内部处理接口的规范

涉及弹窗提交的操作，接口调用应放在**弹窗组件内部**处理，而不是通过 emit 把数据抛给父页面再调接口。流程如下：

1. 弹窗内部校验表单 → 调接口 → 成功后关闭弹窗并 `emit('success')`
2. 父页面只监听 `@success` 事件，执行刷新列表

```typescript
// ✅ 弹窗内部（RequestDialog.vue）
const handleSubmit = async () => {
	const valid = await formRef.value.validate().catch(() => false);
	if (!valid) return;
	try {
		loading.value = true;
		const res = await someApi(payload);
		if (res?.code === 0) {
			message.success('操作成功');
			close();
			emit('success'); // 只抛成功信号
		}
	} finally {
		loading.value = false;
	}
};

// ✅ 父页面（index.vue）
// <SomeDialog ref="dialogRef" @success="register?.getDataList" />
```

---

## 九、相关文档

- 模板文件：`src/template/listAI/listSingle/` 和 `src/template/listAI/listTable/`
- 使用说明：`src/template/listAI/README.md`
- 提示词规范：`src/template/listAI/PROMPT.md`
- 完整指南：`src/template/listAI/TEMPLATE_GUIDE.md`

---

## 十、菜单权限 xlsx 生成

使用 `docAI/gen_menu.py` 脚本生成可直接导入系统的菜单权限 xlsx 文件。

**重要：在生成新模块时，即使用户未明确要求，也应默认自动生成菜单权限 xlsx 文件。**

### 使用方式

编辑 `docAI/gen_menu.py` 中的 `CONFIG` 配置区：

```python
CONFIG = {
    # 菜单层级路径，至少需要三级（一级-二级-三级）
    "menu_path": "仓库-库存-WFS进销存报表",

    # 路由：src/views 下的路径 + /index
    "route": "/warehouse/stockManage/wfsInventoryReport/index",

    # 菜单排序（不填默认 10）
    "menu_sort": 10,

    # 图标
    "icon": "iconfont icon-tenant",

    # 当菜单名称与路由段不一致时，手动指定中间层级路由
    "mid_routes": {
        "库存": "/warehouse/stockManage/index",
    },

    # moduleKey（与代码中保持一致）
    "module_key": "wfsInventoryReport",

    # 按钮权限：(名称, 权限后缀, 排序)，排序从 10 开始间隔 10
    "buttons": [
        ("查看", "view", 10),
        ("导出", "export", 20),
        # ("日志", "log", 30),
        # ("删除", "delete", 40),
        # ("推送", "generate", 50),
    ],

    # 是否跳过二级菜单（默认 True，即默认不生成二级菜单）
    # 如果需要生成二级菜单，设置为 False
    "skip_second_level": True,

    # 输出路径
    "output": "docAI/output_menu.xlsx",
}
```

然后运行：

```bash
python docAI/gen_menu.py
```

### 生成规则

- `menu_path` 至少需要三级（一级-二级-三级），如"仓库-库存-WFS 进销存报表"
- **二级菜单默认不生成**：`skip_second_level` 默认为 `True`，表示系统已存在二级菜单（如"仓库"、"物流"、"集成"等），只生成三级及以下菜单
- 如果需要生成二级菜单，在 CONFIG 中设置 `"skip_second_level": False`
- 中间层级菜单的路由从最终路由自动推导：如最终路由为 `/warehouse/stockManage/wfsInventoryReport/index`，则中间层级 `库存` 的路由为 `/warehouse/stockManage/index`
- 当菜单名称与路由段名称不一致时（如菜单叫"库存"但路由段是 `stockManage`），需在 CONFIG 中加 `mid_routes` 手动指定：
  ```python
  "mid_routes": {
      "库存": "/warehouse/stockManage/index",
  }
  ```
- 最后一级菜单使用配置中的完整路由
- 按钮权限的上级菜单固定为最后一级菜单名
- 权限标识格式：`{moduleKey}_{suffix}`，常用后缀：`view` / `export` / `log` / `updata` / `delete` / `generate`
- 输出文件与模板格式完全一致，可直接导入系统
- **默认权限按钮**：每个新模块默认生成"查看"和"导出"两个按钮权限，除非用户明确说明其他需求

### 生成示例（仓库-库存-WFS 进销存报表）

**说明**：此示例中"仓库"是一级菜单，"库存"是二级菜单（系统已存在），只生成"WFS 进销存报表"（三级）菜单和按钮权限。

| 类型 | 上级菜单       | 名称           | 排序 | 权限标识                  | 路由                                            |
| ---- | -------------- | -------------- | ---- | ------------------------- | ----------------------------------------------- |
| 菜单 | 库存           | WFS 进销存报表 | 10   | -                         | /warehouse/stockManage/wfsInventoryReport/index |
| 按钮 | WFS 进销存报表 | 查看           | 10   | wfsInventoryReport_view   | -                                               |
| 按钮 | WFS 进销存报表 | 导出           | 20   | wfsInventoryReport_export | -                                               |

### 金蝶推送多列表的菜单权限生成

金蝶推送多列表使用 `button_groups` 字段，一次生成三个 Tab 的所有按钮权限，无需多次运行。

```python
CONFIG = {
    "menu_path": "集成-平台仓盘点",
    "route": "/integrations/platformWarehouseInventory/index",
    "menu_sort": 10,
    "icon": "iconfont icon-tenant",
    "button_groups": [
        {
            "module_key": "integrationsPlatformWarehouseInventory_notGeneratedOrder",
            "buttons": [
                ("未生成_查看",  "view",     10),
                ("未生成_导出",  "export",   20),
                ("生成金蝶数据", "generate", 30),
            ],
        },
        {
            "module_key": "integrationsPlatformWarehouseInventory_generatedOrder",
            "buttons": [
                ("已生成_查看", "view",   40),
                ("已生成_导出", "export", 50),
            ],
        },
        {
            "module_key": "integrationsPlatformWarehouseInventory_generatedFailedOrder",
            "buttons": [
                ("生成失败_查看", "view",   60),
                ("生成失败_导出", "export", 70),
            ],
        },
    ],
    "output": "docAI/output_menu.xlsx",
}
```

> `button_groups` 和 `buttons`+`module_key` 两种格式均支持，单列表继续用原来的格式即可。
