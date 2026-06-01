# ActionDropdown 操作下拉菜单组件

通用的操作下拉菜单组件，支持多种菜单项类型。

## 功能特性

- 支持删除操作（带二次确认）
- 支持日志按钮组件
- 支持自定义插槽
- 支持普通点击事件
- 通过 v-bind 透传参数

## 使用示例

### 基础用法

```vue
<template>
	<ActionDropdown
		:row="row"
		:menu-list="actionMenuList"
		@delete="handleDelete"
		@click="handleClick"
	/>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const ActionDropdown = defineAsyncComponent(
	() => import('/@/components/ActionDropdown/index.vue')
);

const actionMenuList = [
	{
		key: 'delete',
		label: '删除',
		type: 'del',
	},
	{
		key: 'log',
		type: 'log',
		itemArgs: {
			'biz-type': ['INVENTORY_ORG_RELATION'],
		},
	},
];

const handleDelete = (item, row) => {
	// 处理删除逻辑
	console.log('删除', row);
};

const handleClick = (item, row) => {
	// 处理其他点击事件
	console.log('点击', item.key, row);
};
</script>
```

### 使用插槽

```vue
<template>
	<ActionDropdown :row="row" :menu-list="actionMenuList">
		<template #custom="{ item }">
			<el-dropdown-item @click="handleCustom(item)">
				自定义操作
			</el-dropdown-item>
		</template>
	</ActionDropdown>
</template>

<script setup lang="ts">
const actionMenuList = [
	{
		key: 'custom',
		type: 'slot',
	},
];
</script>
```

## Props

| 参数        | 说明           | 类型       | 默认值           |
| ----------- | -------------- | ---------- | ---------------- |
| menuList    | 菜单项配置列表 | MenuItem[] | -                |
| row         | 当前行数据     | any        | -                |
| confirmText | 删除确认文本   | string     | '确定要删除吗？' |

## MenuItem 配置

| 参数     | 说明                              | 类型                | 可选值                             |
| -------- | --------------------------------- | ------------------- | ---------------------------------- |
| key      | 菜单项唯一标识                    | string              | -                                  |
| label    | 菜单项显示文本                    | string              | -                                  |
| type     | 菜单项类型                        | string              | 'del' / 'log' / 'slot' / 'default' |
| itemArgs | 透传给组件的参数（用于 log 类型） | Record<string, any> | -                                  |
| onClick  | 点击回调函数                      | (row: any) => void  | -                                  |

## Events

| 事件名 | 说明                       | 参数                       |
| ------ | -------------------------- | -------------------------- |
| delete | 删除操作（已通过二次确认） | (item: MenuItem, row: any) |
| click  | 普通点击事件               | (item: MenuItem, row: any) |

## 菜单项类型说明

### del - 删除类型

- 自动显示为 el-dropdown-item
- 点击时会弹出二次确认对话框
- 确认后触发 delete 事件

### log - 日志类型

- 使用 LogBtn 组件
- 通过 itemArgs 透传参数（如 biz-type）

### slot - 插槽类型

- 使用具名插槽自定义内容
- 插槽名为 item.key

### default - 默认类型

- 普通的 el-dropdown-item
- 点击触发 click 事件
