# 平台货件单收发差异表 API 文档

## 模块说明

平台货件单收发差异表模块，用于管理和查询平台货件单的收发差异数据，包括货件单信息、收发数量、差异处理状态等。

## 接口列表

| 接口名称 | 方法 | 路径                               | 函数名                            |
| -------- | ---- | ---------------------------------- | --------------------------------- |
| 分页查询 | GET  | /kingdeeShipmentDiff/page          | getKingdeeShipmentDiffPage        |
| 导出     | POST | /kingdeeShipmentDiff/export        | postKingdeeShipmentDiffExport     |
| 收货详情 | GET  | /kingdeeShipmentDiff/receiveDetail | getPlatformWarehouseReceiveDetail |

## 请求参数

### 分页查询参数 (KingdeeShipmentDiffPageQuery)

| 参数名                    | 类型     | 必填 | 说明                                         |
| ------------------------- | -------- | ---- | -------------------------------------------- |
| platforms                 | string[] | 否   | 平台列表                                     |
| destinationWarehouseCodes | string[] | 否   | 目的仓 code 列表                             |
| matchStatus               | number   | 否   | 匹配状态(0 未匹配/1 已匹配)                  |
| handledDiffStatus         | number   | 否   | 差异处理状态(0 未处理/1 部分处理/2 处理完成) |
| receiveDateStart          | string   | 否   | 收货日期-开始                                |
| receiveDateEnd            | string   | 否   | 收货日期-结束                                |
| shipmentIds               | string[] | 否   | 货件号列表(单个模糊查询,多个精确查询)        |
| transferOrderNos          | string[] | 否   | 调拨单号列表(单个模糊查询,多个精确查询)      |
| deliveryNos               | string[] | 否   | 发货单号列表(单个模糊查询,多个精确查询)      |
| skuCodes                  | string[] | 否   | SKU 列表(单个模糊查询,多个精确查询)          |
| mskuCodes                 | string[] | 否   | MSKU 列表(单个模糊查询,多个精确查询)         |
| current                   | number   | 否   | 当前页码                                     |
| size                      | number   | 否   | 每页数量                                     |

## 返回数据

### 数据项字段 (KingdeeShipmentDiffVO)

| 字段名                   | 类型   | 说明                        |
| ------------------------ | ------ | --------------------------- |
| id                       | number | ID                          |
| platform                 | string | 平台                        |
| storeSiteName            | string | 店铺站点                    |
| shipmentId               | string | 货件单号                    |
| shipmentStatus           | string | 货件单状态                  |
| destinationWarehouseCode | string | 目的仓代码                  |
| destinationWarehouseName | string | 目的仓名称                  |
| transferOrderNo          | string | 调拨单号                    |
| deliveryNo               | string | 发货单号                    |
| matchStatus              | number | 匹配状态(0 未匹配/1 已匹配) |
| handledDiffStatusCode    | number | 差异处理状态 code           |
| handledDiffStatusValue   | string | 差异处理状态描述            |
| mskuCode                 | string | 平台 MSKU                   |
| skuCode                  | string | 仟易 SKU 编码               |
| productName              | string | 产品名称                    |
| shipQuantity             | number | 发货数量                    |
| receiveQuantity          | number | 收货数量(累加汇总)          |
| lastReceiveDate          | string | 最后一次收货日期            |
| diffQuantity             | number | 差异数量(收货数量-发货数量) |
| handledDiffQuantity      | number | 已处理差异数量              |
| createTime               | string | 创建时间                    |

### 导出数据项字段 (KingdeeShipmentDiffExcelVO)

| 字段名                   | 类型   | 说明             |
| ------------------------ | ------ | ---------------- |
| platform                 | string | 平台             |
| storeSiteName            | string | 店铺站点         |
| storeName                | string | 店铺名称         |
| siteCode                 | string | 站点代码         |
| shipmentId               | string | 货件单号         |
| shipmentStatus           | string | 货件单状态       |
| destinationWarehouseName | string | 目的仓名称       |
| transferOrderNo          | string | 调拨单号         |
| deliveryNo               | string | 发货单号         |
| matchStatusValue         | string | 匹配状态描述     |
| handledDiffStatusValue   | string | 差异处理状态描述 |
| mskuCode                 | string | 平台 MSKU        |
| skuCode                  | string | 仟易 SKU 编码    |
| productName              | string | 产品名称         |
| shipQuantity             | number | 发货数量         |
| receiveQuantity          | number | 收货数量         |
| lastReceiveDate          | string | 最后一次收货日期 |
| diffQuantity             | number | 差异数量         |
| handledDiffQuantity      | number | 已处理差异数量   |
| createTime               | string | 创建时间         |

## 使用示例

### 分页查询

```typescript
import { getKingdeeShipmentDiffPage } from '/@/api/materialFlow/freightFlow/platformWarehouseDiff';

const response = await getKingdeeShipmentDiffPage({
	platforms: ['Amazon'],
	matchStatus: 0,
	current: 1,
	size: 20,
});
```

### 导出数据

```typescript
import { postKingdeeShipmentDiffExport } from '/@/api/materialFlow/freightFlow/platformWarehouseDiff';

await postKingdeeShipmentDiffExport({
	platforms: ['Amazon'],
	receiveDateStart: '2026-01-01',
	receiveDateEnd: '2026-03-20',
});
```

### 获取收货详情

```typescript
import { getPlatformWarehouseReceiveDetail } from '/@/api/materialFlow/freightFlow/platformWarehouseDiff';

const response = await getPlatformWarehouseReceiveDetail({
	shipmentId: 'FBA123456',
	mskuCode: 'MSKU-001',
});
```

## 注意事项

1. **查询参数数组处理**：

   - shipmentIds、transferOrderNos、deliveryNos、skuCodes、mskuCodes 支持单个模糊查询和多个精确查询
   - 单个值时进行模糊匹配，多个值时进行精确匹配

2. **匹配状态枚举**：

   - 0: 未匹配
   - 1: 已匹配

3. **差异处理状态枚举**：

   - 0: 未处理
   - 1: 部分处理
   - 2: 处理完成

4. **差异数量计算**：

   - 差异数量 = 收货数量 - 发货数量
   - 正数表示多收，负数表示少收

5. **导出功能**：

   - 使用 POST 方法
   - responseType 设置为 'blob'
   - 支持与分页查询相同的筛选条件

6. **收货详情**：
   - 点击收货数量字段可查看详细的收货记录
   - 包含每次收货的时间、数量、仓库等信息
