# MrTips 组件

基于表格表头的问号提示组件，用于在文本旁显示辅助说明信息。

## 功能特点

- ✅ 支持显示标签文本
- ✅ 支持必填标记（红色*号）
- ✅ 支持 Tooltip 提示信息
- ✅ 使用 Element Plus 的问号图标
- ✅ 支持自定义插槽
- ✅ 完整的 TypeScript 类型支持

## 使用场景

- 表格表头提示说明
- 表单标签附加说明
- 任何需要额外提示信息的文本标签

## 基础用法

### 导入组件

```typescript
import MrTips from '/@/common/MrTips';
// 或
import { MrTips } from '/@/common/MrTips';
```

### 基础示例

```vue
<template>
  <!-- 基础用法 -->
  <mr-tips label="用户名" tips="请输入真实姓名" />
  
  <!-- 必填标记 -->
  <mr-tips label="邮箱" tips="请输入有效的邮箱地址" required />
  
  <!-- 自定义图标样式 -->
  <mr-tips 
    label="手机号" 
    tips="仅支持中国大陆手机号" 
    icon-size="16"
    icon-color="#409eff"
  />
</template>
```

## 在表格中使用

### 作为表头标签

```vue
<template>
  <el-table :data="tableData">
    <el-table-column width="180">
      <template #header>
        <mr-tips 
          label="SKU编码" 
          tips="商品唯一标识码，用于库存管理" 
          required 
        />
      </template>
      <template #default="{ row }">
        {{ row.skuCode }}
      </template>
    </el-table-column>
    
    <el-table-column width="200">
      <template #header>
        <mr-tips 
          label="发货数量" 
          tips="实际发货的商品数量，不能超过库存数量" 
        />
      </template>
      <template #default="{ row }">
        {{ row.quantity }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MrTips from '/@/common/MrTips';

const tableData = ref([
  { skuCode: 'SKU-001', quantity: 100 },
  { skuCode: 'SKU-002', quantity: 200 },
]);
</script>
```

### 配合 MrTable 使用

```vue
<template>
  <mr-table :data="tableData">
    <mr-table-column width="180">
      <template #header>
        <mr-tips 
          label="国家代码" 
          tips="ISO 3166-1 alpha-2 标准国家代码" 
          required 
        />
      </template>
      <template #default="{ row }">
        {{ row.countryCode }}
      </template>
    </mr-table-column>
  </mr-table>
</template>
```

## Props

| 参数 | 说明 | 类型 | 默认值 | 必填 |
|------|------|------|--------|------|
| label | 显示的标签文本 | `string \| number` | `''` | 否 |
| tips | 提示信息内容 | `string` | `''` | 否 |
| iconSize | 图标大小 | `string \| number` | `14` | 否 |
| iconColor | 图标颜色 | `string` | `'#909399'` | 否 |
| required | 是否显示必填标记 | `boolean` | `false` | 否 |
| effect | Tooltip 效果类型 | `'dark' \| 'light'` | `'dark'` | 否 |
| placement | Tooltip 出现位置 | `TooltipPlacement` | `'top'` | 否 |

### Placement 可选值

- `top` / `top-start` / `top-end`
- `bottom` / `bottom-start` / `bottom-end`
- `left` / `left-start` / `left-end`
- `right` / `right-start` / `right-end`

## Slots

### 默认插槽

自定义标签内容，会覆盖 `label` prop。

```vue
<template>
  <mr-tips tips="自定义标签内容">
    <span style="color: #409eff; font-weight: bold;">
      自定义标签
    </span>
  </mr-tips>
</template>
```

### 插槽作用域

默认插槽支持必填标记的自动处理：

```vue
<template>
  <!-- 使用插槽但保留必填标记 -->
  <mr-tips tips="提示信息" required>
    <span class="custom-label">自定义标签</span>
  </mr-tips>
  
  <!-- 完全自定义，包括必填标记 -->
  <mr-tips tips="提示信息">
    <span class="my-required">**</span>
    <span>完全自定义</span>
  </mr-tips>
</template>
```

## 样式定制

### 基础样式覆盖

```vue
<template>
  <mr-tips 
    label="自定义样式" 
    tips="提示信息"
    class="custom-tips"
  />
</template>

<style scoped>
.custom-tips {
  font-size: 16px;
  font-weight: bold;
}

.custom-tips :deep(.text-red) {
  color: #ff4d4f;
  font-size: 18px;
}
</style>
```

### 图标样式定制

```vue
<template>
  <mr-tips 
    label="提示" 
    tips="信息"
    icon-size="18"
    icon-color="#52c41a"
  />
</template>
```

## 使用示例

### 示例1：表单标签提示

```vue
<template>
  <el-form :model="form" label-width="120px">
    <el-form-item>
      <template #label>
        <mr-tips 
          label="邮箱地址" 
          tips="用于接收系统通知和找回密码" 
          required 
        />
      </template>
      <el-input v-model="form.email" />
    </el-form-item>
    
    <el-form-item>
      <template #label>
        <mr-tips 
          label="联系电话" 
          tips="请填写真实的手机号码，方便联系" 
        />
      </template>
      <el-input v-model="form.phone" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import MrTips from '/@/common/MrTips';

const form = reactive({
  email: '',
  phone: '',
});
</script>
```

### 示例2：复杂表格表头

```vue
<template>
  <mr-table :data="tableData" border>
    <mr-table-column width="150">
      <template #header>
        <mr-tips 
          label="转换数量" 
          tips="可转换数量 = 发货数量 - 在途占用数量<br/>请确保转换数量不超过可转换数量" 
          required
          placement="top-start"
        />
      </template>
      <template #default="{ row }">
        <el-input-number v-model="row.quantity" :min="0" />
      </template>
    </mr-table-column>
    
    <mr-table-column width="120">
      <template #header>
        <mr-tips 
          label="单箱数量" 
          tips="每个包装箱内的商品数量<br/>用于计算总箱数" 
          icon-size="16"
        />
      </template>
      <template #default="{ row }">
        {{ row.cartonQty }}
      </template>
    </mr-table-column>
  </mr-table>
</template>
```

### 示例3：不同位置的提示

```vue
<template>
  <div class="tips-demo">
    <mr-tips label="顶部提示" tips="这是顶部提示信息" placement="top" />
    <mr-tips label="右侧提示" tips="这是右侧提示信息" placement="right" />
    <mr-tips label="底部提示" tips="这是底部提示信息" placement="bottom" />
    <mr-tips label="左侧提示" tips="这是左侧提示信息" placement="left" />
  </div>
</template>
```

### 示例4：自定义插槽

```vue
<template>
  <mr-tips tips="这是一个带图标的自定义标签" required>
    <el-icon><User /></el-icon>
    <span style="margin-left: 4px;">用户信息</span>
  </mr-tips>
</template>

<script setup lang="ts">
import { User } from '@element-plus/icons-vue';
import MrTips from '/@/common/MrTips';
</script>
```

## 注意事项

1. **HTML 内容**：`tips` 内容支持换行符 `<br/>`，但不支持复杂 HTML
2. **必填标记**：使用 `required` prop 会自动显示红色星号
3. **图标大小**：建议图标大小在 12-18 之间，过大或过小都会影响美观
4. **颜色选择**：默认图标颜色为 `#909399`（Element Plus 的次要文本色）

## 与 zbw-table-tips 的区别

| 特性 | MrTips | zbw-table-tips |
|------|--------|----------------|
| 技术栈 | Vue 3 + Composition API | Vue 2 + Options API |
| 图标 | Element Plus QuestionFilled | 自定义 zbw-icon |
| Props 命名 | `label` | `lable` (typo) |
| HTML 支持 | 通过 content 属性 | 通过 v-html |
| TypeScript | 完整类型支持 | 无 |
| 样式 | SCSS | Stylus |

## 最佳实践

1. **在表格中使用**：将组件放在 `<template #header>` 插槽中
2. **提示信息要简洁**：避免过长的提示文本，可使用换行符分段
3. **合理使用必填标记**：仅在真正必填的字段上使用 `required`
4. **统一图标样式**：在同一个表格或表单中保持图标大小和颜色一致

## TypeScript 类型

```typescript
import type { MrTipsProps, TooltipPlacement, TooltipEffect } from '/@/common/MrTips';

// 使用类型
const tipsConfig: MrTipsProps = {
  label: '字段名',
  tips: '提示信息',
  required: true,
  placement: 'top',
};
```

