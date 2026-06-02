# TreeSelectInputApi — componentType 映射表

> 配置文件位置：`src/componentsApi/shared/confige/`
> 新增 componentType 时，在此文档同步补充一行。

---

## TreeSelectInputApi 类型

| componentType          | 配置文件                  | 对应接口                             | 默认 text    | 默认 code            | 说明                                            |
| ---------------------- | ------------------------- | ------------------------------------ | ------------ | -------------------- | ----------------------------------------------- |
| `basePort`             | `basePort.ts`             | `getBasePortListByCondition`         | 港口         | portCodes            | 港口，带编号前缀展示                            |
| `brand`                | `brand.ts`                | `getBrandAllList`                    | 品牌         | operationGroups      | 品牌，带编号前缀展示                            |
| `country`              | `country.ts`              | `sysCountryList`                     | 国家         | countryCodes         | 国家，带缩写前缀展示                            |
| `currency`             | `currency.ts`             | `getListByCondition`                 | 币种         | currencyList         | 币种                                            |
| `currencyOption`       | `currencyOption.ts`       | `getCurrencyOption`                  | 仟易币种     | currencyCodes        | 仟易币种，带编号前缀展示                        |
| `deptLast`             | `deptLast.ts`             | `getDeptLastDeptByCondition`         | 运营组       | operationGroups      | 末级部门/运营组                                 |
| `deptName`             | `deptName.ts`             | `deptTree`                           | 部门和小组   | deptIds              | 部门树                                          |
| `dicts`                | `dicts.ts`                | `getDicts`                           | 请选择       | values               | 字典通用，需传 `getTreeDataParams` 指定字典类型 |
| `feeTypeList`          | `feeTypeList.ts`          | `feeConfig`                          | 费用类型名称 | feeType              | 费用类型                                        |
| `feeWarehouse`         | `feeWarehouse.ts`         | `getFeeWarehouseBaseList`            | 费用系统仓库 | feeWarehouseId       | 费用系统仓库                                    |
| `freightForwarder`     | `freightForwarder.ts`     | `getFreightForwarderListByCondition` | 货代         | portCodes            | 货代                                            |
| `kingdeeCustomer`      | `kingdeeCustomer.ts`      | `getKingdeeCustomerList`             | （空）       | internalCustomerCode | 金蝶内部客户，带编号前缀展示                    |
| `kingdeeFeeItem`       | `kingdeeFeeItem.ts`       | `getKingdeeFeeItemList`              | 金蝶费用项目 | kingdeeExpenseCodes  | 金蝶费用项目，带编号前缀展示                    |
| `kingdeeOrg`           | `kingdeeOrg.ts`           | `getKingdeeOrgList`                  | 金蝶库存组织 | createNames          | 金蝶组织机构，带编号前缀展示                    |
| `kingdeeSupplier`      | `kingdeeSupplier.ts`      | `getKingdeeSupplierList`             | 金蝶供应商   | kingdeeSupplierCode  | 金蝶供应商，带编号前缀展示                      |
| `legalEntity`          | `legalEntity.ts`          | `getLegalEntitySelect`               | （空）       | legalPersonId        | 法人主体                                        |
| `logisticsChannel`     | `logisticsChannel.ts`     | `getLogisticsChannelList`            | 物流渠道     | logisticsCodes       | 物流渠道                                        |
| `materialControl`      | `materialControl.ts`      | `getUsersByDepartment`               | 物控负责人   | mcpIds               | 物控人员                                        |
| `orderTag`             | `orderTag.ts`             | `getTagAllList`                      | 订单标签     | tags                 | 订单标签                                        |
| `payableObject`        | `payableObject.ts`        | `getPayableObjectList`               | 应付对象     | payableObject        | 应付对象，接口返回 code/name 字段               |
| `productCategory`      | `productCategory.ts`      | `getCategoryTree`                    | 类目         | categoryCodes        | 产品类目                                        |
| `qianyiSupplier`       | `qianyiSupplier.ts`       | `getSupplierInfoList`                | （空）       | supplierCode         | 千易供应商，带编号前缀展示                      |
| `qianyiSupplierMerge`  | `qianyiSupplierMerge.ts`  | `getSupplierMergeList`               | （空）       | supplierCode         | 千易供应商（合并表），带编号前缀展示            |
| `spInfo`               | `spInfo.ts`               | `getSpInfoList`                      | 服务商       | spId                 | 服务商                                          |
| `storeCode`            | `storeCode.ts`            | `getListByCondition`                 | 店铺/站点    | storeId              | 店铺/站点，带编号前缀展示                       |
| `temuShop`             | `temuShop.ts`             | `getTemuFinanceShopOptions`          | 店铺         | shopList             | Temu 店铺                                       |
| `userList`             | `userList.ts`             | `getUserListByCondition`             | 创建人       | createNames          | 用户列表，可传 `getTreeDataParams` 过滤岗位等   |
| `warehouseInfo`        | `warehouseInfo.ts`        | `getWarehouseInfoStoreList`          | 虚拟仓       | createNames          | 金蝶虚拟仓                                      |
| `warehouseInfoKingdee` | `warehouseInfoKingdee.ts` | `getKingdeeWarehouseList`            | 金蝶仓库     | kingdeeWareCode      | 金蝶仓库（通用），带编号前缀展示                |
| `warehouseQianyi`      | `warehouseQianyi.ts`      | `getWarehouseListByCondition`        | （空）       | warehouseIds         | 仟易仓库，带编号前缀展示                        |
| `yesNo`                | `yesNo.ts`                | 静态数据（无接口）                   | 是否         | value                | 是/否选项                                       |

---

## customCascaderApi 类型

| componentType      | 配置文件                                        | 默认 text  | 默认 code         | 说明                                                                               |
| ------------------ | ----------------------------------------------- | ---------- | ----------------- | ---------------------------------------------------------------------------------- |
| `warehouseId`      | `customCascaderApi/confige/warehouseId.ts`      | 平台仓     | destWarehouseIds  | 仓库级联。无特殊说明时统一使用此类型，包括仟易仓库、店铺虚拟仓等名称含"仓库"的场景 |
| `siteStoreId`      | `customCascaderApi/confige/siteStoreId.ts`      | 站点/店铺  | storeIds          | 按站点分组的店铺级联，接口 `getGroupStoreByPlatform`                               |
| `department`       | `customCascaderApi/confige/department.ts`       | 部门和小组 | deptIds           | 部门树级联，接口 `deptTree`                                                        |
| `thirdWarehouseId` | `customCascaderApi/confige/thirdWarehouseId.ts` | 三方仓     | thirdWarehouseIds | 服务商-三方仓两级结构，接口 `searchThirdWarehouse`                                 |

---

## 新增 componentType 操作步骤

1. 在 `src/componentsApi/shared/confige/` 下新建 `{name}.ts`，参考 `spInfo.ts` 结构
2. 在本文档表格中补充一行
3. 在 `docAI/listAI-skill.md` 的映射表章节同步更新（或直接引用本文档）

---

## 配置文件结构参考

```typescript
// src/componentsApi/shared/confige/example.ts
import type { TreeSelectInputSettings } from '../../TreeSelectInputApi/types';
import { getSomeList } from '/@/api/some/module/index';

export const defaultConfigData: Partial<TreeSelectInputSettings> = {
	getTreeData: getSomeList,
	text: '显示名称',
	code: 'fieldCode', // 接口入参字段名
	width: '280px',
	selectTreeProps: {
		value: 'id', // 接口返回的 value 字段
		label: 'name', // 接口返回的 label 字段
	},
	getIdsCode: 'id',
};

export function preConfigDefault(
	configData: Partial<TreeSelectInputSettings>,
	_props: Record<string, any>
) {
	return configData;
}
```
