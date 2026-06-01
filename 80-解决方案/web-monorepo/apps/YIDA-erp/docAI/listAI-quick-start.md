# ListAI 快速开始指南

## 5 分钟快速上手

### 第一步：选择模板类型

根据你的需求选择：

- **单列表模板** (`listSingle`): 适用于普通的单个表格列表
- **多 Tabs 模板** (`listTable`): 适用于需要多个 Tab 页签的列表

### 第二步：准备信息

准备以下信息（可以从需求文档中获取）：

#### 基础信息

- [ ] 模块名称（如：`platformWarehouseDiff`）
- [ ] 模块路径（如：`materialFlow/freightFlow/platformWarehouseDiff`）

#### 表格字段

- [ ] 字段名称（中文）
- [ ] 接口字段名（英文）
- [ ] 字段宽度

#### 搜索条件

- [ ] 需要哪些搜索条件
- [ ] 搜索类型（字典/级联/模糊搜索/时间）

#### 功能需求

- [ ] 是否需要导出
- [ ] 是否需要新增/编辑/删除
- [ ] 其他特殊功能

### 第三步：使用 AI 生成

#### 方式一：使用 Skill（推荐）

直接对 AI 说：

```
生成单列表页面：
- 模块名称：userManagement
- 路径：system/userManagement
- 字段：用户名(username,150)、邮箱(email,200)、状态(status,100)
- 搜索：用户名模糊搜索、状态字典(user_status)
- 功能：导出、编辑、删除
```

AI 会自动生成所有需要的文件。

#### 方式二：手动复制模板

1. 复制模板到目标目录

   ```bash
   # 单列表
   cp -r src/template/listAI/listSingle src/views/[你的路径]

   # 多Tabs
   cp -r src/template/listAI/listTable src/views/[你的路径]
   ```

2. 修改配置文件

   - 修改 `moduleKey`
   - 配置 `columns`
   - 配置 `searchConfig`
   - 配置 `listApi`

3. 创建 API 文件

   - 在 `src/api/[你的路径]` 创建 `index.ts`
   - 定义接口类型和方法

### 第四步：调整细节

根据实际需求调整：

1. **添加特殊交互**

   - 链接类型
   - 颜色显示
   - 自定义操作

2. **配置权限**

   - 在后台配置对应权限
   - 确保权限标识正确

3. **测试功能**

   - 测试搜索功能
   - 测试列表展示
   - 测试导出功能
   - 测试操作功能

## 常用配置速查

### 搜索条件配置

#### 字典选择

```typescript
{
	component: 'TreeSelectInputApi',
	props: {
		componentType: 'dicts',
		settings: {
			code: 'platforms',
			text: '平台',
			getTreeDataParams: 'platform_channel',
		},
	},
}
```

#### 仓库选择

```typescript
{
	component: 'customCascaderApi',
	props: {
		componentType: 'warehouseId',
		settings: {
			code: 'warehouseCodes',
			text: '仓库',
		},
	},
}
```

#### 模糊搜索

```typescript
{
	component: 'SelectInput',
	props: {
		searchTypes: [
			{ label: '订单号', value: 'orderNos' },
			{ label: 'SKU', value: 'skuCodes' },
		],
	},
}
```

#### 时间选择

```typescript
{
	component: 'SelectDate',
	props: {
		searchTypes: [
			{
				label: '创建时间',
				value: 'createTime',
				isAddHMS: true,
				dateStart: 'createTimeStart',
				dateEnd: 'createTimeEnd',
			},
		],
	},
}
```

### 特殊交互配置

#### 链接类型

```vue
<template #fieldName="{ row }">
	<span
		class="text-blue-500 cursor-pointer hover:underline"
		@click="handleClick(row)"
	>
		{{ row.fieldName }}
	</span>
</template>
```

#### 颜色显示

```vue
<template #diffQuantity="{ row }">
	<span
		:class="{
			'text-gray-500': row.diffQuantity === 0,
			'text-red-500': row.diffQuantity < 0,
			'text-green-500': row.diffQuantity > 0,
		}"
	>
		{{ row.diffQuantity > 0 ? `+${row.diffQuantity}` : row.diffQuantity }}
	</span>
</template>
```

#### 操作按钮

```vue
<template #action="{ row }">
	<div class="flex justify-center">
		<EditOrAdd
			:type="'edit'"
			:row="row"
			v-auth="`${moduleKey}-edit`"
			@getDataList="register?.getDataList"
		/>
		<ActionDropdown
			:row="row"
			:menu-list="actionMenuList"
			@delete="handleDelete"
		/>
	</div>
</template>
```

## 完整示例

### 示例：用户管理列表

#### 1. 需求分析

- 模块名称：userManagement
- 路径：system/userManagement
- 字段：用户名、邮箱、手机号、状态、创建时间
- 搜索：用户名模糊搜索、状态字典
- 功能：导出、编辑、删除

#### 2. 对 AI 说

```
生成单列表页面：

模块信息：
- 名称：userManagement
- 路径：system/userManagement

表格字段：
1. 用户名 - username - 150
2. 邮箱 - email - 200
3. 手机号 - phone - 150
4. 状态 - status - 100
5. 创建时间 - createTime - 180
6. 操作 - action - 150

搜索条件：
1. 模糊搜索 - 用户名/邮箱/手机号 - usernames/emails/phones
2. 字典 - 状态 - status - user_status
3. 时间选择 - 创建时间 - createTimeStart/createTimeEnd

功能需求：
- 导出：是
- 编辑：是
- 删除：是

接口信息：
- 列表：/system/user/page
- 导出：/system/user/export
- 删除：/system/user/delete
```

#### 3. AI 生成文件

```
src/views/system/userManagement/
├── config/
│   └── index.ts
└── index.vue

src/api/system/userManagement/
└── index.ts
```

#### 4. 完成

直接使用生成的代码，根据需要微调。

## 常见问题

### Q1: 如何添加新的搜索条件？

在 `config/index.ts` 的 `searchConfig` 中添加：

```typescript
export const searchConfig = [
	// 现有配置...
	{
		component: 'TreeSelectInputApi',
		props: {
			componentType: 'dicts',
			settings: {
				code: 'newField',
				text: '新字段',
				getTreeDataParams: 'dict_type',
			},
		},
	},
];
```

### Q2: 如何修改表格列？

在 `config/index.ts` 的 `columns` 中修改：

```typescript
export const columns: Columns = [
	{ type: 'checkbox', width: 60, align: 'center', fixed: 'left' },
	{ title: '新字段', field: 'newField', width: 150 },
	// 其他字段...
];
```

### Q3: 如何添加自定义按钮？

在 `index.vue` 的 `left-tool` 插槽中添加：

```vue
<template #left-tool>
	<el-button type="primary" @click="handleCustomAction"> 自定义操作 </el-button>
</template>
```

### Q4: 如何修改接口路径？

在 `api/index.ts` 中修改：

```typescript
export function getListPage(params?: ListPageQuery) {
	return httpService.get<ListPageResponse>('/your/new/path', {
		params,
	});
}
```

### Q5: 如何添加权限控制？

使用 `v-auth` 指令：

```vue
<el-button v-auth="`${moduleKey}_customAction`">
	自定义操作
</el-button>
```

## 下一步

- 查看完整文档：`src/template/listAI/TEMPLATE_GUIDE.md`
- 了解提示词规范：`src/template/listAI/PROMPT.md`
- 查看 Skill 文档：`doc/listAI-skill.md`

## 获取帮助

如果遇到问题：

1. 查看模板文件中的注释
2. 参考现有页面的实现
3. 查看完整文档
4. 联系开发团队

## 小贴士

1. **使用 AI 生成**：让 AI 帮你生成代码，节省时间
2. **保持一致性**：遵循模板的代码风格和结构
3. **添加注释**：为复杂逻辑添加注释
4. **测试充分**：生成后充分测试各项功能
5. **及时更新**：如果模板有更新，及时同步

## 快速检查清单

生成代码后，检查以下项目：

- [ ] moduleKey 是否正确
- [ ] 文件路径是否正确
- [ ] 导入路径是否正确
- [ ] 字段配置是否完整
- [ ] 搜索条件是否正确
- [ ] API 接口是否正确
- [ ] 权限标识是否正确
- [ ] 特殊交互是否实现
- [ ] 代码是否有语法错误
- [ ] 功能是否正常运行

完成以上检查后，你的列表页面就可以投入使用了！
