# shared 配置说明

`src/componentsApi/shared/` 是 **SelectInputApi** 和 **TreeSelectInputApi** 的共享配置层，两个组件通过同一套 `confige/` 配置文件和 `apiSelect.ts` 工具函数驱动。

```
src/componentsApi/shared/
├── apiSelect.ts          # 共享工具函数（loadApiSelectConfig / mergeApiSelectSettings / normalizeApiList）
└── confige/              # 配置文件目录，每个文件对应一个 componentType
```

## 适用组件

| 组件                 | 说明                 | 支持字段                                 |
| -------------------- | -------------------- | ---------------------------------------- |
| `SelectInputApi`     | 下拉选择（平铺列表） | 所有基础字段 +`optionLabelFormatter` 等  |
| `TreeSelectInputApi` | 树形下拉选择         | 所有基础字段 +`selectTreeProps.children` |

同一份配置文件可以同时被两个组件使用，差异由各组件自身处理。

---

> 配置文件位置：`src/componentsApi/shared/confige/`
> 类型定义来源：`../../TreeSelectInputApi/types` 或 `../../SelectInputApi/types`

## 适用场景

SelectInputApi ：新增数据时单选

TreeSelectInputApi：筛选条件多选

## 📋 当前配置

| componentType          | 说明                 | API                                  | 字段映射 (value/label)                      | code                   | 备注                                  |
| ---------------------- | -------------------- | ------------------------------------ | ------------------------------------------- | ---------------------- | ------------------------------------- |
| `basePort`             | 港口                 | `getBasePortListByCondition`         | `portCode/portName`                         | `portCodes`            | 带 `portCode-` 前缀展示               |
| `brand`                | 品牌                 | `getBrandAllList`                    | `brandCode/brandName`                       | `operationGroups`      | 带 `brandCode-` 前缀展示              |
| `currency`             | 币种                 | `getListByCondition`                 | `currencyCode/currencyCode`                 | `currencyList`         |                                       |
| `currencyOption`       | 仟易币种             | `getCurrencyOption`                  | `currencyCode/currencyName`                 | `currencyCodes`        | 带 `currencyCode-` 前缀展示           |
| `deptLast`             | 运营组（末级部门）   | `getDeptLastDeptByCondition`         | `deptId/name`                               | `operationGroups`      |                                       |
| `deptName`             | 部门和小组           | `deptTree`                           | `id/name`                                   | `deptIds`              |                                       |
| `dicts`                | 字典（通用）         | `getDicts`                           | `value/label`                               | `values`               | 需传 `getTreeDataParams` 指定字典类型 |
| `feeTypeList`          | 费用类型             | `feeConfig`                          | `id/feeItem`                                | `feeType`              |                                       |
| `feeWarehouse`         | 费用系统仓库         | `getFeeWarehouseBaseList`            | `warehouseId/warehouseName`                 | `feeWarehouseId`       |                                       |
| `freightForwarder`     | 货代                 | `getFreightForwarderListByCondition` | `forwarderName/forwarderName`               | `portCodes`            |                                       |
| `kingdeeCustomer`      | 金蝶内部客户         | `getKingdeeCustomerList`             | `kingdeeCustomerCode/kingdeeCustomerName`   | `internalCustomerCode` | 带编号前缀展示                        |
| `kingdeeFeeItem`       | 金蝶费用项目         | `getKingdeeFeeItemList`              | `kingdeeFeeCode/kingdeeFeeName`             | `kingdeeExpenseCodes`  | 带 `kingdeeFeeCode-` 前缀展示         |
| `kingdeeOrg`           | 金蝶库存组织         | `getKingdeeOrgList`                  | `kingdeeOrgCode/kingdeeOrgName`             | `createNames`          | 带编号前缀展示                        |
| `kingdeeSupplier`      | 金蝶供应商           | `getKingdeeSupplierList`             | `supplierCode/supplierName`                 | `kingdeeSupplierCode`  | 带编号前缀展示                        |
| `legalEntity`          | 法人主体             | `getLegalEntitySelect`               | `id/name`                                   | `legalPersonId`        |                                       |
| `logisticsChannel`     | 物流渠道             | `getLogisticsChannelList`            | `logisticsChannelCode/logisticsChannelName` | `logisticsCodes`       |                                       |
| `materialControl`      | 物控负责人           | `getUsersByDepartment`               | `userId/name`                               | `mcpIds`               |                                       |
| `orderTag`             | 订单标签             | `getTagAllList`                      | `id/name`                                   | `tags`                 |                                       |
| `productCategory`      | 产品类目             | `getCategoryTree`                    | `id/name`                                   | `categoryCodes`        |                                       |
| `qianyiSupplier`       | 仟易供应商           | `getSupplierInfoList`                | `supplierNo/name`                           | `supplierCode`         | 带 `supplierNo-` 前缀展示             |
| `qianyiSupplierMerge`  | 仟易供应商（合并表） | `getSupplierMergeList`               | `logisticsCode/logisticsName`               | `supplierCode`         | 带 `logisticsCode-` 前缀展示          |
| `spInfo`               | 服务商               | `getSpInfoList`                      | `id/spName`                                 | `spId`                 |                                       |
| `storeCode`            | 店铺/站点            | `getListByCondition`                 | `id/siteCode`                               | `storeId`              | 带 `storeName/` 前缀展示              |
| `temuShop`             | Temu 店铺            | `getTemuFinanceShopOptions`          | `value/label`                               | `shopList`             | 数据经 `renderData` 转换              |
| `userList`             | 用户列表             | `getUserListByCondition`             | `userId/name`                               | `createNames`          | 可传 `getTreeDataParams` 过滤岗位     |
| `warehouseInfo`        | 金蝶虚拟仓           | `getWarehouseInfoStoreList`          | `warehouseCode/warehouseName`               | `createNames`          |                                       |
| `warehouseInfoKingdee` | 金蝶仓库（通用）     | `getKingdeeWarehouseList`            | `kingdeeWareCode/kingdeeWareName`           | `kingdeeWareCode`      | 带编号前缀展示                        |
| `warehouseQianyi`      | 仟易仓库             | `getWarehouseListByCondition`        | `warehouseCode/warehouseName`               | `warehouseIds`         | 带编号前缀展示                        |
| `yesNo`                | 是否枚举             | 静态数据（无接口）                   | `value/label`                               | `value`                | 0 否/1 是，适用于布尔类筛选条件       |

### dicts - 字典选择器（通用）

需要通过 `dictType` prop 传入字典类型：

```vue
<TreeSelectInputApi
	componentType="dicts"
	dictType="bill_status"
	text="单据状态"
	code="billStatuses"
/>
```

### warehouseQianyi - 仟易仓库

支持 `prefixKey` 前缀显示（`warehouseCode-warehouseName`）：

```vue
<TreeSelectInputApi
	componentType="warehouseQianyi"
	text="仓库"
	code="warehouseIds"
/>
```

### country / kingdeeOrg / kingdeeCustomer / kingdeeSupplier / qianyiSupplier

这几个配置使用了 `prefixKey` + `separator` 实现 `编码-名称` 的显示格式。

---

## 🔧 添加新配置

### 步骤 1: 创建配置文件

在 `src/componentsApi/shared/confige/` 下新建文件，文件名即为 `componentType` 的值，例如 `myConfig.ts`：

```typescript
import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';
import { getMyList } from '/@/api/xxx';

export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: getMyList,
	text: '显示文本',
	code: 'myIds', // queryForm 中的字段名
	width: '220px',
	selectTreeProps: {
		value: 'id', // 节点值字段
		label: 'name', // 节点显示字段
		children: 'children', // 仅 TreeSelectInputApi 需要
	},
	getIdsCode: 'id', // 选中回显字段
};

export function preConfigDefault(
	configData: Partial<TreeSelectInputSettings>,
	props: Record<string, any>
) {
	// 可根据 props 动态调整配置（如根据 dictType 修改请求参数）
	return configData;
}
```

> `preConfigDefault` 是可选的，如果不需要动态调整配置，直接 `return configData` 即可。

### 步骤 2: 在组件中使用

配置文件创建后，两个组件均可直接通过 `componentType` 引用，无需额外注册：

```vue
<!-- 树形下拉 -->
<TreeSelectInputApi
	v-model:queryForm="queryForm"
	componentType="myConfig"
	:searchFn="handleSearch"
/>

<!-- 平铺下拉（同一份配置） -->
<SelectInputApi v-model="value" componentType="myConfig" />
```

---

## 📝 配置字段说明

### 必填

- `getTreeData` - API 函数
- `text` - 显示文本
- `code` - queryForm 中的字段名
- `selectTreeProps` - 字段映射（value/label/children）
- `getIdsCode` - 选中回显字段

### 可选

- `getTreeDataParams` - API 默认参数
- `width` - 组件宽度（默认 `220px`）
- `renderData` - 数据转换函数
- `prefixKey` - 标签前缀字段（配合 `separator` 使用）
- `separator` - 前缀与标签的分隔符（如 `-`）

---

**最后更新**: 2026-04-23
