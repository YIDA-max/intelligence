# TreeSelectInput → TreeSelectInputApi 迁移指南

> 适用项目：千易 UI（PIGCLOUD 微服务开发平台前端）
> TreeSelectInputApi 通过 `componentType` 映射预置配置文件，无需在页面内传入 `getTreeData`、`selectTreeProps` 等底层配置，大幅简化使用方式。

---

## 一、核心差异

| 对比项                | TreeSelectInput（旧）                                        | TreeSelectInputApi（新）                                   |
| --------------------- | ------------------------------------------------------------ | ---------------------------------------------------------- |
| 数据来源              | 在 `settings.getTreeData` 直接传函数                         | 通过 `componentType` 映射预置配置                          |
| 字段映射              | 在 `settings.selectTreeProps` 手动配置                       | 预置配置中已定义，无需重复写                               |
| 接口入参              | 通过 `getDictMapValueByKey` 从 `useMultipleDicts` 取缓存数据 | 通过 `settings.getTreeDataParams` 直接传参，组件内部调接口 |
| 依赖 useMultipleDicts | 需要在 `useMultipleDicts` 中预先注册 key                     | 不需要，组件自己管理数据请求                               |
| 外层包裹 div          | 通常需要 `<div class="flex items-center">` 包裹              | 不需要，直接使用                                           |

---

## 二、整体步骤

1. 确认要替换的 `TreeSelectInput` 对应哪个 `componentType`（查阅下方映射表）
2. 如果没有对应的 `componentType`，新建 `src/componentsApi/shared/confige/xxx.ts`
3. 替换组件标签，保留 `code`、`text`、`searchFn`，将接口入参改为 `getTreeDataParams`
4. 删除 `useMultipleDicts` 中对应的 key（如果该 key 只用于这个筛选器）
5. 删除 `TreeSelectInput` 的 `defineAsyncComponent` 引入（如果页面不再使用）

---

## 三、已有 componentType 映射表

| componentType          | 对应接口                             | 默认 text    | 默认 code            | 说明                                            |
| ---------------------- | ------------------------------------ | ------------ | -------------------- | ----------------------------------------------- |
| `basePort`             | `getBasePortListByCondition`         | 港口         | portCodes            | 港口，带编号前缀展示                            |
| `brand`                | `getBrandAllList`                    | 品牌         | operationGroups      | 品牌，带编号前缀展示                            |
| `country`              | `sysCountryList`                     | 国家         | countryCodes         | 国家，带缩写前缀展示                            |
| `currency`             | `getListByCondition`                 | 币种         | currencyList         | 币种                                            |
| `currencyOption`       | `getCurrencyOption`                  | 仟易币种     | currencyCodes        | 仟易币种，带编号前缀展示                        |
| `deptLast`             | `getDeptLastDeptByCondition`         | 运营组       | operationGroups      | 末级部门/运营组                                 |
| `deptName`             | `deptTree`                           | 部门和小组   | deptIds              | 部门树                                          |
| `dicts`                | `getDicts`                           | 请选择       | values               | 字典通用，需传 `getTreeDataParams` 指定字典类型 |
| `feeTypeList`          | `feeConfig`                          | 费用类型名称 | feeType              | 费用类型                                        |
| `feeWarehouse`         | `getFeeWarehouseBaseList`            | 费用系统仓库 | feeWarehouseId       | 费用系统仓库                                    |
| `freightForwarder`     | `getFreightForwarderListByCondition` | 货代         | portCodes            | 货代                                            |
| `kingdeeCustomer`      | `getKingdeeCustomerList`             | （空）       | internalCustomerCode | 金蝶内部客户，带编号前缀展示                    |
| `kingdeeFeeItem`       | `getKingdeeFeeItemList`              | 金蝶费用项目 | kingdeeExpenseCodes  | 金蝶费用项目，带编号前缀展示                    |
| `kingdeeOrg`           | `getKingdeeOrgList`                  | 金蝶库存组织 | createNames          | 金蝶组织机构，带编号前缀展示                    |
| `kingdeeSupplier`      | `getKingdeeSupplierList`             | 金蝶供应商   | kingdeeSupplierCode  | 金蝶供应商，带编号前缀展示                      |
| `legalEntity`          | `getLegalEntitySelect`               | （空）       | legalPersonId        | 法人主体                                        |
| `logisticsChannel`     | `getLogisticsChannelList`            | 物流渠道     | logisticsCodes       | 物流渠道                                        |
| `materialControl`      | `getUsersByDepartment`               | 物控负责人   | mcpIds               | 物控人员                                        |
| `orderTag`             | `getTagAllList`                      | 订单标签     | tags                 | 订单标签                                        |
| `productCategory`      | `getCategoryTree`                    | 类目         | categoryCodes        | 产品类目                                        |
| `qianyiSupplier`       | `getSupplierInfoList`                | （空）       | supplierCode         | 千易供应商，带编号前缀展示                      |
| `qianyiSupplierMerge`  | `getSupplierMergeList`               | （空）       | supplierCode         | 千易供应商（合并表），带编号前缀展示            |
| `spInfo`               | `getSpInfoList`                      | 服务商       | spId                 | 服务商                                          |
| `storeCode`            | `getListByCondition`                 | 店铺/站点    | storeId              | 店铺/站点，带编号前缀展示                       |
| `temuShop`             | `getTemuFinanceShopOptions`          | 店铺         | shopList             | Temu 店铺                                       |
| `userList`             | `getUserListByCondition`             | 创建人       | createNames          | 用户列表，可传 `getTreeDataParams` 过滤岗位等   |
| `warehouseInfo`        | `getWarehouseInfoStoreList`          | 虚拟仓       | createNames          | 金蝶虚拟仓                                      |
| `warehouseInfoKingdee` | `getKingdeeWarehouseList`            | 金蝶仓库     | kingdeeWareCode      | 金蝶仓库（通用），带编号前缀展示                |
| `warehouseQianyi`      | `getWarehouseListByCondition`        | （空）       | warehouseIds         | 仟易仓库，带编号前缀展示                        |
| `yesNo`                | 静态数据（无接口）                   | 是否         | value                | 是否枚举，0 否/1 是，适用于布尔类筛选条件       |

---

## 四、template 改造

### 4.1 基础替换

**改造前：**

```html
<el-form-item>
	<div class="flex items-center" :style="{ width: '200px' }">
		<TreeSelectInput
			v-model:queryForm="state.queryForm"
			:style="{ width: '200px' }"
			:settings="{
        getTreeData: async () => ({
          code: 0,
          data: (await getDictMapValueByKey('purchaseUserId')) || [],
        }),
        text: '采购员',
        width: '200px',
        searchFn: getDataList,
        code: 'purchaseUserIds',
        selectTreeProps: {
          value: 'userId',
          label: 'name',
          children: 'children',
        },
        getIdsCode: 'userId',
      }"
		/>
	</div>
</el-form-item>
```

**改造后：**

```html
<el-form-item>
	<TreeSelectInputApi
		v-model:queryForm="state.queryForm"
		componentType="userList"
		:settings="{
      text: '采购员',
      code: 'purchaseUserIds',
      searchFn: getDataList,
    }"
	/>
</el-form-item>
```

关键变化：

- 删除外层 `<div>` 包裹
- 删除 `getTreeData`、`selectTreeProps`、`getIdsCode`、`:style`
- 保留 `text`、`code`、`searchFn`

### 4.2 字典类型（componentType="dicts"）

字典类型需要通过 `getTreeDataParams` 传入字典 key，对应旧版 `useMultipleDicts` 中的 `params`：

**改造前：**

```html
<TreeSelectInput
	v-model:queryForm="state.queryForm"
	:settings="{
    getTreeData: getDicts,
    getTreeDataParams: 'platform_channel',
    text: '平台',
    code: 'platforms',
    searchFn: getDataList,
    selectTreeProps: { value: 'value', label: 'label', children: 'children' },
    getIdsCode: 'value',
  }"
/>
```

**改造后：**

```html
<TreeSelectInputApi
	v-model:queryForm="state.queryForm"
	componentType="dicts"
	:settings="{
    text: '平台',
    code: 'platforms',
    searchFn: getDataList,
    getTreeDataParams: 'platform_channel',
  }"
/>
```

### 4.3 带接口入参的用户列表

旧版通过 `useMultipleDicts` 的 `params` 传入过滤条件，新版直接在 `getTreeDataParams` 传：

**改造前（useMultipleDicts 中）：**

```ts
{
  key: 'purchaseUserId',
  fetchFn: getUserListByCondition,
  params: {
    postCodeList: ['PURCHASING_DIRECTOR', 'PURCHASING_MANAGER'],
  },
}
```

```html
<TreeSelectInput
	:settings="{
    getTreeData: async () => ({
      code: 0,
      data: (await getDictMapValueByKey('purchaseUserId')) || [],
    }),
    code: 'purchaseUserIds',
    ...
  }"
/>
```

**改造后：**

```html
<TreeSelectInputApi
	v-model:queryForm="state.queryForm"
	componentType="userList"
	:settings="{
    text: '采购员',
    code: 'purchaseUserIds',
    searchFn: getDataList,
    getTreeDataParams: {
      postCodeList: ['PURCHASING_DIRECTOR', 'PURCHASING_MANAGER'],
    },
  }"
/>
```

### 4.4 供应商（带前缀展示）

`qianyiSupplier` 预置了 `prefixKey: 'supplierNo'`，展示格式为 `supplierNo-name`，只需覆盖 `code`：

```html
<TreeSelectInputApi
	v-model:queryForm="state.queryForm"
	componentType="qianyiSupplier"
	:settings="{
    text: '供应商',
    code: 'supplierNos',
    searchFn: getDataList,
  }"
/>
```

---

## 五、script 改造

### 5.1 替换组件引入

```ts
// ❌ 删除
const TreeSelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/tree-select-input.vue')
);

// ✅ 改为（如果页面还没有引入的话）
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
```

### 5.2 清理 useMultipleDicts

将只用于筛选器数据的 key 从 `useMultipleDicts` 中删除。

**注意**：如果某个 key 同时被表单弹窗、其他地方使用，则保留。

```ts
// 改造前
const { dictMap, getDictMapValueByKey } = useMultipleDicts([
  { key: 'spInfoList', fetchFn: getSupplierInfoList },       // ❌ 仅用于供应商筛选器，删除
  { key: 'purchaseUserId', fetchFn: getUserListByCondition, params: {...} }, // ❌ 仅用于采购员筛选器，删除
  { key: 'productManageId', fetchFn: getUserListByCondition, params: {...} }, // ❌ 仅用于创建人筛选器，删除
  { key: 'currency', fetchFn: getListByCondition },          // ❌ 仅用于币种筛选器，删除
  { key: 'invoiceType', fetchFn: getDicts, params: 'invoice_type' }, // ✅ 表单弹窗也用，保留
], { isAuto: true, tableRef: baseTableRef });

// 改造后（只保留表单弹窗等其他地方还在用的 key）
const { dictMap } = useMultipleDicts([
  { key: 'invoiceType', fetchFn: getDicts, params: 'invoice_type' },
], { isAuto: true, tableRef: baseTableRef });
```

如果 `useMultipleDicts` 中的 key 全部删完，整个 `useMultipleDicts` 调用也可以删除。

同时清理不再使用的 import：

```ts
// 如果 getDictMapValueByKey 不再使用，从解构中删除
// 如果 getSupplierInfoList 等接口不再使用，从 import 中删除
```

---

## 六、新建 componentType 配置文件

如果现有映射表中没有对应的 `componentType`，在 `src/componentsApi/shared/confige/` 下新建文件：

```ts
// src/componentsApi/shared/confige/xxx.ts
import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';
import { yourApi } from '/@/api/xxx';

export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: yourApi, // 数据接口
	text: '默认标题', // 默认 placeholder 文字
	code: 'defaultCode', // 默认绑定的 queryForm 字段名
	width: '220px',
	selectTreeProps: {
		value: 'id', // 选中值对应的字段
		label: 'name', // 展示文字对应的字段
		children: 'children',
	},
	getIdsCode: 'id', // 选中后写入 queryForm 的字段
	// prefixKey: 'code',       // 可选：展示前缀字段（如 code-name 格式）
	// separator: '-',          // 可选：前缀连接符，默认 ' - '
};

export function preConfigDefault(
	configData: Partial<TreeSelectInputSettings>,
	props: Record<string, any>
) {
	if (!props) return configData;
	return configData;
}
```

文件名即为 `componentType` 的值，例如文件名 `myConfig.ts` 对应 `componentType="myConfig"`。

---

## 七、完整改造 checklist

- [ ] 确认每个 `TreeSelectInput` 对应的 `componentType`（查映射表）
- [ ] 没有对应 `componentType` 的，新建 `confige/xxx.ts`
- [ ] 替换组件标签，删除外层 `<div>` 包裹
- [ ] `settings` 中只保留 `text`、`code`、`searchFn`
- [ ] 字典类型加 `getTreeDataParams: '字典key'`
- [ ] 有接口入参的加 `getTreeDataParams: { ...params }`（对应旧版 `useMultipleDicts` 的 `params`）
- [ ] 删除 `TreeSelectInput` 的 `defineAsyncComponent` 引入
- [ ] 添加 `TreeSelectInputApi` 的 `defineAsyncComponent` 引入（如果还没有）
- [ ] 清理 `useMultipleDicts` 中仅用于筛选器的 key
- [ ] 清理不再使用的 `getDictMapValueByKey` 解构和相关 import

---

## 八、注意事项

1. **settings 优先级**：`settings` 中的配置会覆盖 `confige` 文件中的默认值，所以只需要传需要覆盖的字段

2. **code 字段必须覆盖**：`confige` 文件中的默认 `code` 通常是通用名称，实际使用时几乎都需要在 `settings` 中覆盖为页面实际的 queryForm 字段名

3. **text 字段建议覆盖**：默认 `text` 是通用标题，建议根据页面语境覆盖为更准确的描述

4. **getTreeDataParams 类型**：字典类型传字符串，接口入参传对象，与旧版 `useMultipleDicts` 的 `params` 保持一致

5. **useMultipleDicts 清理时机**：确认某个 key 在页面中只有筛选器在用（通过 `getDictMapValueByKey` 取值）才能删除，如果表单弹窗的 `dictMap` 也依赖该 key，则保留

---

## 九、常见问题排查

### 1. 筛选器不显示数据

- **检查 componentType**：确认映射表中有对应的类型
- **检查接口是否正常**：在浏览器 Network 面板查看接口请求是否成功
- **检查 selectTreeProps**：确认 `value` 和 `label` 字段与接口返回的数据结构匹配

### 2. 选中的值没有写入 queryForm

- **检查 code 字段**：确保 `settings.code` 与 queryForm 的属性名完全匹配
- **检查 getIdsCode**：如果数据结构特殊，可能需要覆盖 `getIdsCode` 指定写入的字段

### 3. 搜索后数据没刷新

- **检查 searchFn**：确保传入的是表格刷新函数（如 `register?.getDataList`）
- **检查函数绑定**：确认函数没有丢失 this 上下文，建议使用 `register?.getDataList` 或箭头函数

### 4. 多选时值格式不对

- **检查 value 类型**：确认 `selectTreeProps.value` 指定的字段类型与预期一致
- **检查 queryForm 字段类型**：确保 queryForm 中对应字段是数组类型

### 5. 弹窗选择器与筛选器行为不一致

- **检查 componentType**：确保筛选器和表单弹窗使用相同的 componentType
- **检查 settings 覆盖**：确保表单弹窗的 settings 配置与筛选器一致
