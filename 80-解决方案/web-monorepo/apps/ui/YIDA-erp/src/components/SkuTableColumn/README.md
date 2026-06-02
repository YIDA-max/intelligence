# SkuTableColumn 组件

SKU信息展示组件，用于在表格中以两行形式显示SKU编码和名称。

## 功能特点

- 支持自定义字段名
- 默认显示 `skuCode` 和 `skuName` 字段
- 自动换行和文本溢出处理
- 样式统一，可复用

## 基础用法

```vue
<template>
  <el-table :data="tableData">
    <el-table-column label="SKU信息">
      <template #default="{ row }">
        <sku-table-column :row="row" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import SkuTableColumn from '/@/components/SkuTableColumn/index.vue';

const tableData = [
  {
    skuCode: 'SKU-001',
    skuName: '产品名称示例',
  },
];
</script>
```

## 自定义字段名

当数据对象中的字段名不是默认的 `skuCode` 和 `skuName` 时，可以通过 props 自定义：

```vue
<template>
  <sku-table-column 
    :row="row" 
    code-key="productCode" 
    name-key="productName" 
  />
</template>

<script setup lang="ts">
import SkuTableColumn from '/@/components/SkuTableColumn/index.vue';

const row = {
  productCode: 'PROD-001',
  productName: '自定义产品名称',
};
</script>
```

## Props

| 参数     | 说明             | 类型                  | 默认值      | 必填 |
| -------- | ---------------- | --------------------- | ----------- | ---- |
| row      | 数据行对象       | `Record<string, any>` | -           | 是   |
| codeKey  | SKU编码字段名    | `string`              | `'skuCode'` | 否   |
| nameKey  | SKU名称字段名    | `string`              | `'skuName'` | 否   |

## 样式说明

组件默认样式：
- 第一行（编码）：粗体，主色调
- 第二行（名称）：较小字号，灰色
- 自动换行：长文本自动折行显示

如需自定义样式，可以在使用时覆盖 `.sku-info` 类的样式。

## 应用场景

- 仓库管理系统的库存表格
- 订单管理的商品列表
- 物流管理的发货明细
- 任何需要同时展示编码和名称的场景

