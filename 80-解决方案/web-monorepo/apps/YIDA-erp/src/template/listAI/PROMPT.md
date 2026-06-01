# ListAI 模板生成提示词规范

## 基础信息收集

在生成代码前，需要收集以下信息：

1. **模块信息**

   - 模块名称（用于生成 moduleKey）
   - 模块路径（view 和 api 的路径）
   - 是否需要多 Tabs（单列表/多 Tabs）

2. **字段信息**

   - 表格显示字段（按需求文档顺序）
   - 字段名称（中文）
   - 接口字段名（英文）
   - 字段宽度

3. **搜索条件**

   - 搜索类型（字典/级联/模糊搜索/时间）
   - 搜索字段名称
   - 接口入参名称
   - 特殊配置（如字典类型的枚举值）

4. **功能需求**
   - 是否需要导出
   - 是否需要新增/编辑
   - 是否需要删除
   - 是否需要其他操作按钮
   - 特殊交互场景（链接、颜色显示等）

## 提示词模板

### 单列表生成提示词

```
请基于 src/template/listAI/listSingle 模板生成一个列表页面：

模块信息：
- 模块名称：[模块名称]
- 模块路径：src/views/[路径]
- API路径：src/api/[路径]

表格字段配置：
1. [字段名称] - [接口字段名] - 宽度[数字]
2. [字段名称] - [接口字段名] - 宽度[数字]
...

搜索条件配置：
1. [搜索类型] - [显示名称] - [接口入参] - [特殊配置]
2. [搜索类型] - [显示名称] - [接口入参] - [特殊配置]
...

功能需求：
- 导出：[是/否]
- 新增：[是/否]
- 编辑：[是/否]
- 删除：[是/否]
- 其他操作：[描述]

特殊交互：
- [描述特殊交互场景]

接口信息：
- 列表查询：[接口路径]
- 导出：[接口路径]
- 删除：[接口路径]
```

### 多 Tabs 生成提示词

```
请基于 src/template/listAI/listTable 模板生成一个多Tabs列表页面：

模块信息：
- 模块名称：[模块名称]
- 模块路径：src/views/[路径]
- API路径：src/api/[路径]

Tabs配置：
1. Tab名称：[名称] - moduleKey：[key] - 是否显示数量：[是/否]
2. Tab名称：[名称] - moduleKey：[key] - 是否显示数量：[是/否]
...

每个Tab的配置参考单列表配置...
```

## 配置项说明

### 搜索类型说明

1. **字典类型（TreeSelectInputApi - dicts）**

   ```
   类型：字典
   显示名称：平台
   接口入参：platforms
   字典枚举：platform_channel
   ```

2. **仓库级联（customCascaderApi - warehouseId）**

   ```
   类型：仓库级联
   显示名称：仓库
   接口入参：warehouseCodes
   ```

3. **店铺/站点级联（customCascaderApi - storeSiteId）**

   ```
   类型：店铺站点级联
   显示名称：店铺/站点
   接口入参：storeSiteIds
   ```

4. **模糊搜索（SelectInput）**

   ```
   类型：模糊搜索
   搜索选项：
   - 订单号 -> orderNos
   - SKU -> skuCodes
   ```

5. **时间选择（SelectDate）**
   ```
   类型：时间选择
   显示名称：创建时间
   开始时间入参：createTimeStart
   结束时间入参：createTimeEnd
   是否添加时分秒：是
   ```

### 特殊交互场景

1. **链接类型**

   ```
   字段：[字段名]
   交互：点击显示弹窗/跳转页面
   ```

2. **颜色显示**

   ```
   字段：差异数量
   规则：
   - 0：灰色
   - 负数：红色
   - 正数：绿色（带+号）
   ```

3. **操作栏**
   ```
   操作按钮：
   - 编辑（EditOrAdd组件）
   - 删除（ActionDropdown下拉菜单）
   - 其他自定义按钮
   ```

## 生成步骤

1. 根据模块类型选择模板（listSingle/listTable）
2. 生成 API 接口文件（包含接口定义和类型）
3. 生成 config 配置文件（columns、searchConfig、moduleKey）
4. 生成主页面文件（index.vue）
5. 如有特殊交互，添加对应的插槽和方法
6. 如有子组件（如编辑弹窗），生成对应组件文件

## 示例

### 完整示例：平台仓库收发差异

```
请基于 src/template/listAI/listSingle 模板生成一个列表页面：

模块信息：
- 模块名称：platformWarehouseDiff
- 模块路径：src/views/materialFlow/freightFlow/platformWarehouseDiff
- API路径：src/api/materialFlow/freightFlow/platformWarehouseDiff

表格字段配置：
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
13. 收货数量 - receiveQuantity - 宽度100（链接类型）
14. 收货时间 - lastReceiveDate - 宽度180
15. 差异数量 - diffQuantity - 宽度100（颜色显示）
16. 已处理差异数量 - handledDiffQuantity - 宽度140
17. 操作 - action - 宽度100

搜索条件配置：
1. 字典 - 平台 - platforms - platform_channel
2. 字典 - 匹配状态 - matchStatus - platform_warehouse_diff_match_status
3. 字典 - 差异处理状态 - handledDiffStatus - platform_warehouse_diff_handled_status
4. 仓库级联 - 目的仓 - destinationWarehouseCodes
5. 模糊搜索 - Shipment ID/调拨单号/发货单号/SKU/MSKU - shipmentIds/transferOrderNos/deliveryNos/skuCodes/mskuCodes
6. 时间选择 - 收货时间 - receiveDateStart/receiveDateEnd - 添加时分秒

功能需求：
- 导出：是
- 新增：否
- 编辑：否
- 删除：否
- 其他操作：更新货件信息按钮、处理收发差异按钮

特殊交互：
- 收货数量：点击显示收货详情弹窗
- 差异数量：根据数值显示不同颜色（0灰色、负数红色、正数绿色带+号）
- 操作栏：处理收发差异按钮（条件显示）

接口信息：
- 列表查询：/kingdee/kingdeeShipmentDiff/page
- 导出：/kingdee/kingdeeShipmentDiff/export
- 收货详情：/kingdee/kingdeeShipmentItem/listByDiffId
- 处理差异：/kingdee/kingdeeShipmentDiff/handle
```

## 注意事项

1. 生成代码时保持模板的结构和风格
2. 确保所有配置项都有注释说明
3. 特殊交互场景需要详细说明触发条件和行为
4. API 接口需要包含完整的类型定义
5. 权限标识格式：`${moduleKey}_操作`
6. 时间选择默认放在搜索条件最后
7. 操作栏固定 field 为 action
8. 字段顺序与需求文档保持一致
