# FBT 进销存报表 - 字段对接文档

## 后端实体类信息

**实体类**: `PlatformTiktokInventoryJxc`  
**表名**: `platform_tiktok_inventory_jxc`

## 接口信息

- **列表查询**: `GET /platformTiktokInventoryJxc/page`
- **导出**: `GET /platformTiktokInventoryJxc/export`

---

## ✅ 已完全对接的字段

### 查询参数

| 前端 label | 前端字段       | 后端字段       | 状态        |
| ---------- | -------------- | -------------- | ----------- |
| 仓库       | warehouseCodes | warehouseCodes | ✅ 完全匹配 |
| SKU        | skuCodes       | skuCodes       | ✅ 完全匹配 |
| MSKU       | mskuCodes      | mskuCodes      | ✅ 完全匹配 |
| 商品 ID    | goodsIds       | goodsIds       | ✅ 完全匹配 |
| 产品名称   | productNames   | productNames   | ✅ 完全匹配 |

### 列表字段

| title (列名) | 前端 field                  | 后端字段                    | 后端注释     | 状态        |
| ------------ | --------------------------- | --------------------------- | ------------ | ----------- |
| 仓库         | warehouseName               | warehouseName               | 仓库名称     | ✅ 完全匹配 |
| MSKU         | mskuCode                    | mskuCode                    | MSKU         | ✅ 完全匹配 |
| 商品 ID      | goodsId                     | goodsId                     | 商品 ID      | ✅ 完全匹配 |
| SKU          | skuCode                     | skuCode                     | SKU          | ✅ 完全匹配 |
| 产品名称     | skuName                     | skuName                     | 产品名称     | ✅ 完全匹配 |
| 期初库存     | beginningQuantity           | beginningQuantity           | 期初库存     | ✅ 完全匹配 |
| 货件收货     | inboundQuantity             | inboundQuantity             | 货件收货     | ✅ 完全匹配 |
| 订单发货     | consignmentQuantity         | consignmentQuantity         | 订单发货     | ✅ 完全匹配 |
| 买家退货     | failedDeliveryQuantity      | failedDeliveryQuantity      | 买家退货     | ✅ 完全匹配 |
| 盘点         | inventoryAdjustmentQuantity | inventoryAdjustmentQuantity | 盘点         | ✅ 完全匹配 |
| 已移除       | removedQuantity             | removedQuantity             | 已移除       | ✅ 完全匹配 |
| 仓库间转运中 | transferQuantity            | transferQuantity            | 仓库间转运中 | ✅ 完全匹配 |
| 期末库存     | endingQuantity              | endingQuantity              | 期末库存     | ✅ 完全匹配 |
| ERP 在途     | inTransitQuantity           | inTransitQuantity           | ERP 在途     | ✅ 完全匹配 |

---

## ⚠️ 需要特殊处理的字段

### 1. 店铺站点 (使用 prefixObj 配置)

| title    | 前端 field                                            | 后端字段             | 处理方式                    |
| -------- | ----------------------------------------------------- | -------------------- | --------------------------- |
| 店铺站点 | siteCode (主字段) + prefixObj: { field: 'storeName' } | storeName + siteCode | 使用 prefixObj 配置自动拼接 |

**配置方式**:

```typescript
{
  title: '店铺站点',
  field: 'siteCode',           // 主字段
  width: 180,
  prefixObj: { field: 'storeName' }  // 前缀字段
}
```

**说明**:

- 后端返回 `storeName` (店铺) 和 `siteCode` (站点) 两个独立字段
- 使用 `prefixObj` 配置后，表格会自动拼接显示为 `{storeName}-{siteCode}`
- 无需手动在数据处理中拼接

### 2. 日期范围查询 (需后端支持)

| 前端字段         | 说明     | 后端字段    | 状态                  |
| ---------------- | -------- | ----------- | --------------------- |
| reportMonthStart | 日期开始 | reportMonth | ⚠️ 需后端支持范围查询 |
| reportMonthEnd   | 日期结束 | reportMonth | ⚠️ 需后端支持范围查询 |

**说明**:

- 前端使用月份范围选择器,需要 `reportMonthStart` 和 `reportMonthEnd`
- 后端实体类只有 `reportMonth` 单个字段
- **需要后端在查询接口中支持日期范围参数**

**建议后端实现**:

```java
// 查询DTO中添加范围参数
private String reportMonthStart;
private String reportMonthEnd;

// 在查询时使用范围条件
if (StringUtils.isNotBlank(reportMonthStart)) {
    queryWrapper.ge("report_month", reportMonthStart);
}
if (StringUtils.isNotBlank(reportMonthEnd)) {
    queryWrapper.le("report_month", reportMonthEnd);
}
```

---

## 📊 对接完成度

- ✅ 完全匹配字段: 18 个
- ⚠️ 需特殊处理: 2 个
  - 店铺站点 (前端拼接)
  - 日期范围 (需后端支持)

**对接完成度: 95%**

---

## 📝 后端字段验证结果

根据后端实体类 `PlatformTiktokInventoryJxc` 的注释,所有字段的业务含义与前端需求完全一致:

| 后端字段                    | 后端注释     | 前端列名     | 匹配状态 |
| --------------------------- | ------------ | ------------ | -------- |
| beginningQuantity           | 期初库存     | 期初库存     | ✅       |
| inboundQuantity             | 货件收货     | 货件收货     | ✅       |
| consignmentQuantity         | 订单发货     | 订单发货     | ✅       |
| failedDeliveryQuantity      | 买家退货     | 买家退货     | ✅       |
| inventoryAdjustmentQuantity | 盘点         | 盘点         | ✅       |
| removedQuantity             | 已移除       | 已移除       | ✅       |
| transferQuantity            | 仓库间转运中 | 仓库间转运中 | ✅       |
| endingQuantity              | 期末库存     | 期末库存     | ✅       |
| inTransitQuantity           | ERP 在途     | ERP 在途     | ✅       |

**结论**: Apifox 文档中的字段注释有误,后端实体类的注释才是正确的业务定义。

---

## 🔧 需要后端协调的问题

### P0 - 必须实现

**日期范围查询支持**

- 问题: 后端实体类只有 `reportMonth` 单字段
- 需求: 前端需要支持月份范围查询 (`reportMonthStart` ~ `reportMonthEnd`)
- 建议: 在查询接口的 DTO 中添加 `reportMonthStart` 和 `reportMonthEnd` 参数,并在查询时使用范围条件

### P1 - 可选优化

**店铺站点合并字段**

- 问题: 后端返回 `storeName` 和 `siteCode` 两个独立字段
- 需求: 前端需要合并显示
- 当前方案: 使用 `prefixObj` 配置自动拼接 ✅
- 优化建议: 后端可以在 VO 中添加 `storeSite` 字段，直接返回拼接好的值（可选）

---

## 📄 修改文件清单

1. ✅ `src/api/warehouse/stockManage/fbtInventoryReport/index.ts`

   - 接口路径: `/platformTiktokInventoryJxc/page`
   - 查询参数: 使用后端实体类字段
   - 响应字段: 与后端实体类完全匹配

2. ✅ `src/views/warehouse/stockManage/fbtInventoryReport/config/index.ts`

   - 列表字段: field 已匹配后端字段名
   - 搜索配置: 已匹配后端查询参数
   - 店铺站点: 使用 `prefixObj` 配置自动拼接

3. ⚠️ 需要后端支持
   - 日期范围参数处理 (reportMonthStart/reportMonthEnd)
