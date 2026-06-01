# 仓间调拨金蝶单据 API 文档

## 模块说明

根据 Apifox 导出的接口文档，仓间调拨金蝶单据分为两个模块：

1. **仓间调拨发货** - 对应 Apifox 中的"仓间调拨（收货）金蝶单据"

   - 路径：`src/api/integrations/shippingIntegration/warehouseTransfer/index.ts`
   - 接口前缀：`/transferReceiptSecondKingdee`

2. **仓间调拨收货** - 对应 Apifox 中的"仓间调拨（发货）金蝶单据"
   - 路径：`src/api/integrations/receivingIntegration/warehouseTransfer/index.ts`
   - 接口前缀：`/transferShipSecondKingdee`

---

## 一、仓间调拨发货模块

### 1.1 分页查询

**接口地址：** `GET /transferReceiptSecondKingdee/page`

**请求参数：** `WarehouseTransferShipPageQuery`

| 参数名                  | 类型     | 必填 | 说明                                 |
| ----------------------- | -------- | ---- | ------------------------------------ |
| billNo                  | string   | 否   | 集成单据编号                         |
| transferNo              | string   | 否   | 调拨单号                             |
| generateKingdeeDocNo    | string   | 否   | 金蝶单据编号                         |
| status                  | number   | 否   | 状态：0-未生成，1-已生成，2-生成失败 |
| actualReceiptDateStart  | string   | 否   | 实际收货日期-开始                    |
| actualReceiptDateEnd    | string   | 否   | 实际收货日期-结束                    |
| takeOutWarehouse        | string   | 否   | 调出仓编码                           |
| takeInWarehouse         | string   | 否   | 调入仓编码                           |
| kingdeeOutWarehouseCode | string   | 否   | 金蝶调出仓库编码                     |
| kingdeeInWarehouseCode  | string   | 否   | 金蝶调入仓库编码                     |
| transactionType         | number   | 否   | 交易类型：1-组织内，2-组织间         |
| skuCode                 | string   | 否   | SKU 代码                             |
| ids                     | number[] | 否   | 勾选的 ID 列表（导出时使用）         |
| current                 | number   | 否   | 当前页码                             |
| size                    | number   | 否   | 每页条数                             |

**响应数据：** `WarehouseTransferShipPageResponse`

```typescript
{
  code: number;
  msg: string;
  data: {
    records: WarehouseTransferShipVO[];  // 数据列表
    total: number;                        // 总条数
    current: number;                      // 当前页
    size: number;                         // 每页条数
  }
}
```

**数据项字段：** `WarehouseTransferShipVO`

| 字段名                     | 类型   | 说明                                 |
| -------------------------- | ------ | ------------------------------------ |
| id                         | number | 主键 ID                              |
| mainId                     | number | 主表 ID                              |
| billNo                     | string | 集成单据编号                         |
| transferNo                 | string | 调拨单号                             |
| generateKingdeeDocName     | string | 金蝶单据名称                         |
| generateKingdeeDocNo       | string | 金蝶单据编号                         |
| status                     | number | 状态：0-未生成，1-已生成，2-生成失败 |
| statusName                 | string | 状态名称                             |
| actualReceiptDate          | string | 实际收货日期                         |
| takeOutWarehouse           | string | 调出仓编码                           |
| takeInWarehouse            | string | 调入仓编码                           |
| kingdeeOutWarehouseCode    | string | 金蝶调出仓库编码                     |
| kingdeeInWarehouseCode     | string | 金蝶调入仓库编码                     |
| kingdeeOutInventoryOrgCode | string | 金蝶调出库存组织编码                 |
| kingdeeInInventoryOrgCode  | string | 金蝶调入库存组织编码                 |
| transactionType            | number | 交易类型：1-组织内，2-组织间         |
| transactionTypeName        | string | 交易类型名称                         |
| transferOrderCreateTime    | string | 调拨单创建时间                       |
| generateKingdeeDocTime     | string | 生成金蝶单据时间                     |
| kingdeeDocCreateId         | number | 金蝶单据创建人 ID                    |
| kingdeeDocCreateName       | string | 金蝶单据创建人名称                   |
| pushErrorReason            | string | 推送失败原因                         |
| skuCode                    | string | SKU 代码                             |
| receiptQuantity            | number | 收货数量                             |
| receiptCartonQuantity      | number | 收货箱数                             |

**使用示例：**

```typescript
import { getWarehouseTransferShipPage } from '/@/api/integrations/shippingIntegration/warehouseTransfer';

// 查询列表
const response = await getWarehouseTransferShipPage({
	current: 1,
	size: 20,
	status: 1,
	transferNo: 'DB202401001',
});
```

### 1.2 导出

**接口地址：** `POST /transferReceiptSecondKingdee/export`

**请求参数：** `WarehouseTransferShipPageQuery`（同分页查询参数）

**响应数据：** Blob（Excel 文件）

**使用示例：**

```typescript
import { postExportWarehouseTransferShip } from '/@/api/integrations/shippingIntegration/warehouseTransfer';

// 导出数据
const blob = await postExportWarehouseTransferShip({
	status: 1,
	ids: [1, 2, 3],
});
```

### 1.3 生成金蝶单据

**接口地址：** `GET /transferReceiptSecondKingdee/generate`

**请求参数：** `GenerateKingdeeDocParams`

| 参数名 | 类型     | 必填 | 说明           |
| ------ | -------- | ---- | -------------- |
| ids    | number[] | 否   | 勾选的 ID 列表 |

**响应数据：** `GenerateKingdeeDocResponse`

```typescript
{
	code: number;
	msg: string;
	data: any;
}
```

**使用示例：**

```typescript
import { getGenerateWarehouseTransferShipKingdeeDoc } from '/@/api/integrations/shippingIntegration/warehouseTransfer';

// 生成金蝶单据
const response = await getGenerateWarehouseTransferShipKingdeeDoc({
	ids: [1, 2, 3],
});
```

### 1.4 更新集成数据

**接口地址：** `GET /transferReceiptSecondKingdee/update`

**请求参数：** `GenerateKingdeeDocParams`（同生成金蝶单据参数）

| 参数名 | 类型     | 必填 | 说明           |
| ------ | -------- | ---- | -------------- |
| ids    | number[] | 否   | 勾选的 ID 列表 |

**响应数据：** `GenerateKingdeeDocResponse`

```typescript
{
	code: number;
	msg: string;
	data: any;
}
```

**使用示例：**

```typescript
import { getUpdateWarehouseTransferShipIntegratedData } from '/@/api/integrations/shippingIntegration/warehouseTransfer';

// 更新集成数据
const response = await getUpdateWarehouseTransferShipIntegratedData({
	ids: [1, 2, 3],
});
```

---

## 二、仓间调拨收货模块

### 2.1 分页查询

**接口地址：** `GET /transferShipSecondKingdee/page`

**请求参数：** `WarehouseTransferReceiptPageQuery`

| 参数名                  | 类型     | 必填 | 说明                                 |
| ----------------------- | -------- | ---- | ------------------------------------ |
| billNo                  | string   | 否   | 集成单据编号                         |
| transferNo              | string   | 否   | 调拨单号                             |
| generateKingdeeDocNo    | string   | 否   | 金蝶单据编号                         |
| status                  | number   | 否   | 状态：0-未生成，1-已生成，2-生成失败 |
| actualDeliveryDateStart | string   | 否   | 实际发货日期-开始                    |
| actualDeliveryDateEnd   | string   | 否   | 实际发货日期-结束                    |
| takeOutWarehouse        | string   | 否   | 调出仓编码                           |
| takeInWarehouse         | string   | 否   | 调入仓编码                           |
| kingdeeOutWarehouseCode | string   | 否   | 金蝶调出仓库编码                     |
| kingdeeInWarehouseCode  | string   | 否   | 金蝶调入仓库编码                     |
| transactionType         | number   | 否   | 交易类型：1-组织内，2-组织间         |
| skuCode                 | string   | 否   | SKU 代码                             |
| ids                     | number[] | 否   | 勾选的 ID 列表（导出时使用）         |
| current                 | number   | 否   | 当前页码                             |
| size                    | number   | 否   | 每页条数                             |

**响应数据：** `WarehouseTransferReceiptPageResponse`

```typescript
{
  code: number;
  msg: string;
  data: {
    records: WarehouseTransferReceiptVO[];  // 数据列表
    total: number;                           // 总条数
    current: number;                         // 当前页
    size: number;                            // 每页条数
  }
}
```

**数据项字段：** `WarehouseTransferReceiptVO`

| 字段名                     | 类型   | 说明                                 |
| -------------------------- | ------ | ------------------------------------ |
| id                         | number | 主键 ID                              |
| mainId                     | number | 主表 ID                              |
| billNo                     | string | 集成单据编号                         |
| transferNo                 | string | 调拨单号                             |
| generateKingdeeDocName     | string | 金蝶单据名称                         |
| generateKingdeeDocNo       | string | 金蝶单据编号                         |
| status                     | number | 状态：0-未生成，1-已生成，2-生成失败 |
| statusName                 | string | 状态名称                             |
| actualDeliveryDate         | string | 实际发货日期                         |
| takeOutWarehouse           | string | 调出仓编码                           |
| takeInWarehouse            | string | 调入仓编码                           |
| kingdeeOutWarehouseCode    | string | 金蝶调出仓库编码                     |
| kingdeeInWarehouseCode     | string | 金蝶调入仓库编码                     |
| kingdeeOutInventoryOrgCode | string | 金蝶调出库存组织编码                 |
| kingdeeInInventoryOrgCode  | string | 金蝶调入库存组织编码                 |
| transactionType            | number | 交易类型：1-组织内，2-组织间         |
| transactionTypeName        | string | 交易类型名称                         |
| transferOrderCreateTime    | string | 调拨单创建时间                       |
| generateKingdeeDocTime     | string | 生成金蝶单据时间                     |
| kingdeeDocCreateId         | number | 金蝶单据创建人 ID                    |
| kingdeeDocCreateName       | string | 金蝶单据创建人名称                   |
| pushErrorReason            | string | 推送失败原因                         |
| skuCode                    | string | SKU 代码                             |
| shipmentQuantity           | number | 发货数量                             |
| deliveryCartonQuantity     | number | 发货箱数                             |

**使用示例：**

```typescript
import { getWarehouseTransferReceiptPage } from '/@/api/integrations/receivingIntegration/warehouseTransfer';

// 查询列表
const response = await getWarehouseTransferReceiptPage({
	current: 1,
	size: 20,
	status: 1,
	transferNo: 'DB202401001',
});
```

### 2.2 导出

**接口地址：** `POST /transferShipSecondKingdee/export`

**请求参数：** `WarehouseTransferReceiptPageQuery`（同分页查询参数）

**响应数据：** Blob（Excel 文件）

**使用示例：**

```typescript
import { postExportWarehouseTransferReceipt } from '/@/api/integrations/receivingIntegration/warehouseTransfer';

// 导出数据
const blob = await postExportWarehouseTransferReceipt({
	status: 1,
	ids: [1, 2, 3],
});
```

### 2.3 生成金蝶单据

**接口地址：** `GET /transferShipSecondKingdee/generate`

**请求参数：** `GenerateKingdeeDocParams`

| 参数名 | 类型     | 必填 | 说明           |
| ------ | -------- | ---- | -------------- |
| ids    | number[] | 否   | 勾选的 ID 列表 |

**响应数据：** `GenerateKingdeeDocResponse`

```typescript
{
	code: number;
	msg: string;
	data: any;
}
```

**使用示例：**

```typescript
import { getGenerateWarehouseTransferReceiptKingdeeDoc } from '/@/api/integrations/receivingIntegration/warehouseTransfer';

// 生成金蝶单据
const response = await getGenerateWarehouseTransferReceiptKingdeeDoc({
	ids: [1, 2, 3],
});
```

### 2.4 更新集成数据

**接口地址：** `GET /transferShipSecondKingdee/update`

**请求参数：** `GenerateKingdeeDocParams`（同生成金蝶单据参数）

| 参数名 | 类型     | 必填 | 说明           |
| ------ | -------- | ---- | -------------- |
| ids    | number[] | 否   | 勾选的 ID 列表 |

**响应数据：** `GenerateKingdeeDocResponse`

```typescript
{
	code: number;
	msg: string;
	data: any;
}
```

**使用示例：**

```typescript
import { getUpdateWarehouseTransferReceiptIntegratedData } from '/@/api/integrations/receivingIntegration/warehouseTransfer';

// 更新集成数据
const response = await getUpdateWarehouseTransferReceiptIntegratedData({
	ids: [1, 2, 3],
});
```

---

## 三、类型定义总览

### 仓间调拨发货类型

```typescript
// 查询参数
WarehouseTransferShipPageQuery;

// 列表数据项
WarehouseTransferShipVO;

// 分页响应
WarehouseTransferShipPageResponse;

// 导出数据项
WarehouseTransferShipExcelVO;

// 生成金蝶单据/更新数据参数
GenerateKingdeeDocParams;

// 生成金蝶单据/更新数据响应
GenerateKingdeeDocResponse;
```

### 仓间调拨收货类型

```typescript
// 查询参数
WarehouseTransferReceiptPageQuery;

// 列表数据项
WarehouseTransferReceiptVO;

// 分页响应
WarehouseTransferReceiptPageResponse;

// 导出数据项
WarehouseTransferReceiptExcelVO;

// 生成金蝶单据/更新数据参数
GenerateKingdeeDocParams;

// 生成金蝶单据/更新数据响应
GenerateKingdeeDocResponse;
```

---

## 四、接口列表总览

### 仓间调拨发货模块

| 接口名称     | 方法 | 路径                                   | 函数名                                       |
| ------------ | ---- | -------------------------------------- | -------------------------------------------- |
| 分页查询     | GET  | /transferReceiptSecondKingdee/page     | getWarehouseTransferShipPage                 |
| 导出         | POST | /transferReceiptSecondKingdee/export   | postExportWarehouseTransferShip              |
| 生成金蝶单据 | GET  | /transferReceiptSecondKingdee/generate | getGenerateWarehouseTransferShipKingdeeDoc   |
| 更新集成数据 | GET  | /transferReceiptSecondKingdee/update   | getUpdateWarehouseTransferShipIntegratedData |

### 仓间调拨收货模块

| 接口名称     | 方法 | 路径                                | 函数名                                          |
| ------------ | ---- | ----------------------------------- | ----------------------------------------------- |
| 分页查询     | GET  | /transferShipSecondKingdee/page     | getWarehouseTransferReceiptPage                 |
| 导出         | POST | /transferShipSecondKingdee/export   | postExportWarehouseTransferReceipt              |
| 生成金蝶单据 | GET  | /transferShipSecondKingdee/generate | getGenerateWarehouseTransferReceiptKingdeeDoc   |
| 更新集成数据 | GET  | /transferShipSecondKingdee/update   | getUpdateWarehouseTransferReceiptIntegratedData |

---

## 五、注意事项

1. **接口映射关系**：

   - Apifox 中的"仓间调拨（收货）金蝶单据" → 项目中的"仓间调拨发货"
   - Apifox 中的"仓间调拨（发货）金蝶单据" → 项目中的"仓间调拨收货"

2. **状态枚举**：

   - 0：未生成
   - 1：已生成
   - 2：生成失败

3. **交易类型枚举**：

   - 1：组织内
   - 2：组织间

4. **导出接口**：

   - 使用 POST 方法
   - 返回类型为 Blob
   - 需要设置 `responseType: 'blob'`

5. **生成金蝶单据和更新数据接口**：

   - 使用 GET 方法
   - 入参和返回格式一致
   - 都接收 ids 参数（勾选的 ID 列表）

6. **分页参数**：
   - current：当前页码
   - size：每页条数
   - total：总条数（响应返回）
