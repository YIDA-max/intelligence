<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<h2>MrTableColumnVxe 组件使用示例</h2>

			<!-- 示例1: 基础列配置 -->
			<h3>示例1: 基础列配置</h3>
			<mr-table-vxe :data="basicData">
				<mr-table-column-vxe field="name" title="姓名" width="120" />
				<mr-table-column-vxe field="age" title="年龄" width="100" />
				<mr-table-column-vxe field="address" title="地址" />
			</mr-table-vxe>

			<!-- 示例2: 使用插槽自定义内容 -->
			<h3>示例2: 使用插槽自定义内容</h3>
			<mr-table-vxe :data="basicData">
				<mr-table-column-vxe field="name" title="姓名" width="120">
					<template #default="{ row }">
						<el-tag type="primary">{{ row.name }}</el-tag>
					</template>
				</mr-table-column-vxe>

				<mr-table-column-vxe field="age" title="年龄" width="100">
					<template #default="{ row }">
						<span :style="{ color: row.age > 30 ? 'red' : 'green' }">
							{{ row.age }} 岁
						</span>
					</template>
				</mr-table-column-vxe>

				<mr-table-column-vxe field="status" title="状态" width="100">
					<template #default="{ row }">
						<el-tag :type="row.status === 1 ? 'success' : 'danger'">
							{{ row.status === 1 ? '在职' : '离职' }}
						</el-tag>
					</template>
				</mr-table-column-vxe>

				<mr-table-column-vxe field="address" title="地址" />
			</mr-table-vxe>

			<!-- 示例3: 特殊列类型 -->
			<h3>示例3: 特殊列类型（复选框、序号、操作列）</h3>
			<mr-table-vxe :data="basicData">
				<!-- 复选框列 -->
				<mr-table-column-vxe type="checkbox" width="60" />

				<!-- 序号列 -->
				<mr-table-column-vxe type="seq" title="序号" width="80" />

				<mr-table-column-vxe field="name" title="姓名" width="120" />
				<mr-table-column-vxe field="age" title="年龄" width="100" />
				<mr-table-column-vxe field="address" title="地址" />

				<!-- 操作列 -->
				<mr-table-column-vxe title="操作" width="200" fixed="right">
					<template #default>
						<el-button link type="primary" size="small">编辑</el-button>
						<el-button link type="danger" size="small">删除</el-button>
					</template>
				</mr-table-column-vxe>
			</mr-table-vxe>

			<!-- 示例4: 排序和对齐方式 -->
			<h3>示例4: 排序和对齐方式</h3>
			<mr-table-vxe :data="basicData">
				<!-- 左对齐 -->
				<mr-table-column-vxe
					field="name"
					title="姓名（左对齐）"
					width="150"
					align="left"
				/>

				<!-- 居中对齐（默认） -->
				<mr-table-column-vxe
					field="age"
					title="年龄（居中）"
					width="120"
					sortable
				/>

				<!-- 右对齐 -->
				<mr-table-column-vxe
					field="salary"
					title="薪资（右对齐）"
					width="150"
					align="right"
					sortable
				>
					<template #default="{ row }">
						¥{{ row.salary.toLocaleString() }}
					</template>
				</mr-table-column-vxe>

				<mr-table-column-vxe field="address" title="地址" />
			</mr-table-vxe>

			<!-- 示例5: 固定列 -->
			<h3>示例5: 固定列</h3>
			<mr-table-vxe :data="basicData" style="width: 800px">
				<!-- 左侧固定 -->
				<mr-table-column-vxe
					field="name"
					title="姓名"
					width="120"
					fixed="left"
				/>

				<mr-table-column-vxe field="age" title="年龄" width="100" />
				<mr-table-column-vxe field="address" title="地址" width="300" />
				<mr-table-column-vxe field="email" title="邮箱" width="200" />
				<mr-table-column-vxe field="phone" title="电话" width="150" />

				<!-- 右侧固定 -->
				<mr-table-column-vxe title="操作" width="150" fixed="right">
					<template #default>
						<el-button link type="primary" size="small">编辑</el-button>
					</template>
				</mr-table-column-vxe>
			</mr-table-vxe>

			<!-- 示例6: 动态列配置（v-for） -->
			<h3>示例6: 动态列配置（v-for）</h3>
			<mr-table-vxe :data="basicData">
				<mr-table-column-vxe
					v-for="item in dynamicColumns"
					:key="item.field"
					v-bind="item"
				>
					<template #default="{ row }" v-if="item.formatter">
						{{ item.formatter(row) }}
					</template>
				</mr-table-column-vxe>
			</mr-table-vxe>

			<!-- 示例7: 自定义表头 -->
			<h3>示例7: 自定义表头</h3>
			<mr-table-vxe :data="basicData">
				<mr-table-column-vxe field="name" title="姓名" width="120">
					<template #header>
						<div style="display: flex; align-items: center; gap: 4px">
							<span>姓名</span>
							<el-icon><InfoFilled /></el-icon>
						</div>
					</template>
				</mr-table-column-vxe>

				<mr-table-column-vxe field="age" title="年龄" width="100" />
				<mr-table-column-vxe field="address" title="地址" />
			</mr-table-vxe>
		</div>
	</div>
</template>

<script setup lang="ts">
/* eslint-disable no-console */

import { ref } from 'vue';
import { InfoFilled } from '@element-plus/icons-vue';

// 基础数据
const basicData = ref([
	{
		id: 1,
		name: '张三',
		age: 28,
		address: '北京市朝阳区',
		status: 1,
		salary: 15000,
		email: 'zhangsan@example.com',
		phone: '13800138000',
	},
	{
		id: 2,
		name: '李四',
		age: 32,
		address: '上海市浦东新区',
		status: 1,
		salary: 18000,
		email: 'lisi@example.com',
		phone: '13800138001',
	},
	{
		id: 3,
		name: '王五',
		age: 25,
		address: '广州市天河区',
		status: 0,
		salary: 12000,
		email: 'wangwu@example.com',
		phone: '13800138002',
	},
	{
		id: 4,
		name: '赵六',
		age: 35,
		address: '深圳市南山区',
		status: 1,
		salary: 20000,
		email: 'zhaoliu@example.com',
		phone: '13800138003',
	},
]);

// 动态列配置
const dynamicColumns = ref([
	{
		field: 'name',
		title: '姓名',
		width: 120,
	},
	{
		field: 'age',
		title: '年龄',
		width: 100,
		sortable: true,
	},
	{
		field: 'salary',
		title: '薪资',
		width: 150,
		align: 'right',
		formatter: (row: any) => `¥${row.salary.toLocaleString()}`,
	},
	{
		field: 'address',
		title: '地址',
	},
]);
</script>

<style scoped lang="scss">
.layout-padding {
	padding: 15px;
}

.layout-padding-auto {
	padding: 15px;
	background: #fff;
	border-radius: 4px;
}

h2 {
	margin-bottom: 20px;
	color: #333;
}

h3 {
	margin: 30px 0 15px;
	color: #666;
	font-size: 16px;
	border-left: 4px solid #409eff;
	padding-left: 10px;
}

.mr-table-vxe {
	margin-bottom: 30px;
}
</style>
