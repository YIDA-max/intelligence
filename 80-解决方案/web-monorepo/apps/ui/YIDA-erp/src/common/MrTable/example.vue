<template>
	<div class="mr-table-example">
		<h2>MrTable 组件使用示例</h2>

		<!-- 示例1：基础表格 -->
		<section class="example-section">
			<h3>示例1：基础表格</h3>
			<mr-table :data="tableData" border stripe>
				<mr-table-column prop="date" label="日期" width="180" />
				<mr-table-column prop="name" label="姓名" width="180" />
				<mr-table-column prop="address" label="地址" />
			</mr-table>
		</section>

		<!-- 示例2：带选择和自定义列的表格 -->
		<section class="example-section">
			<h3>示例2：带选择和自定义列的表格</h3>
			<mr-table ref="tableRef" :data="tableData" border @selection-change="handleSelectionChange">
				<mr-table-column type="selection" width="55" />
				<mr-table-column type="index" label="序号" width="60" />
				<mr-table-column prop="date" label="日期" width="180" />
				<mr-table-column prop="name" label="姓名" width="180" />
				<mr-table-column label="状态" width="100">
					<template #default="{ row }">
						<el-tag :type="row.status === 1 ? 'success' : 'danger'">
							{{ row.status === 1 ? '启用' : '禁用' }}
						</el-tag>
					</template>
				</mr-table-column>
				<mr-table-column label="操作" width="200" fixed="right">
					<template #default="{ row }">
						<el-button size="small" @click="handleEdit(row)">编辑</el-button>
						<el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
					</template>
				</mr-table-column>
			</mr-table>
		</section>

		<!-- 示例3：固定表头和列的表格 -->
		<section class="example-section">
			<h3>示例3：固定表头和列的表格</h3>
			<mr-table :data="longTableData" border height="300">
				<mr-table-column fixed prop="id" label="ID" width="80" />
				<mr-table-column prop="date" label="日期" width="150" />
				<mr-table-column prop="name" label="姓名" width="150" />
				<mr-table-column prop="province" label="省份" width="150" />
				<mr-table-column prop="city" label="市区" width="150" />
				<mr-table-column prop="address" label="地址" min-width="300" />
				<mr-table-column fixed="right" label="操作" width="120">
					<template #default="{ row }">
						<el-button size="small" @click="handleView(row)">查看</el-button>
					</template>
				</mr-table-column>
			</mr-table>
		</section>

		<!-- 示例4：带自定义表头的表格 -->
		<section class="example-section">
			<h3>示例4：带自定义表头的表格</h3>
			<mr-table :data="tableData" border>
				<mr-table-column prop="date" label="日期" width="180" />
				<mr-table-column prop="name" width="180">
					<template #header>
						<span style="color: #409eff">姓名 (自定义表头)</span>
					</template>
					<template #default="{ row }">
						<span style="font-weight: bold">{{ row.name }}</span>
					</template>
				</mr-table-column>
				<mr-table-column prop="address" label="地址" />
			</mr-table>
		</section>

		<!-- 示例5：空数据状态 -->
		<section class="example-section">
			<h3>示例5：空数据状态</h3>
			<mr-table :data="[]" border>
				<mr-table-column prop="date" label="日期" width="180" />
				<mr-table-column prop="name" label="姓名" width="180" />
				<mr-table-column prop="address" label="地址" />
				<template #empty>
					<div style="padding: 40px; color: #909399">
						<el-icon :size="60"><DocumentDelete /></el-icon>
						<p>暂无数据</p>
					</div>
				</template>
			</mr-table>
		</section>

		<!-- 示例6：加载状态 -->
		<section class="example-section">
			<h3>示例6：加载状态</h3>
			<el-button @click="toggleLoading" style="margin-bottom: 16px">
				{{ loading ? '停止加载' : '开始加载' }}
			</el-button>
			<mr-table :data="tableData" border v-loading="loading">
				<mr-table-column prop="date" label="日期" width="180" />
				<mr-table-column prop="name" label="姓名" width="180" />
				<mr-table-column prop="address" label="地址" />
			</mr-table>
		</section>

		<!-- 示例7：使用 SkuTableColumn 组件 -->
		<section class="example-section">
			<h3>示例7：使用 SkuTableColumn 组件</h3>
			<mr-table :data="skuTableData" border>
				<mr-table-column label="SKU信息" width="200">
					<template #default="{ row }">
						<sku-table-column :row="row" />
					</template>
				</mr-table-column>
				<mr-table-column prop="stock" label="库存" width="100" />
				<mr-table-column prop="price" label="价格" width="100" />
			</mr-table>
		</section>
	</div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';
import { DocumentDelete } from '@element-plus/icons-vue';
import { useMessage } from '/@/hooks/message';
import { MrTable, MrTableColumn } from './index';

const SkuTableColumn = defineAsyncComponent(() => import('/@/components/SkuTableColumn/index.vue'));

// 表格引用
const tableRef = ref();

// 基础表格数据
const tableData = ref([
	{
		id: 1,
		date: '2024-01-01',
		name: '张三',
		address: '北京市朝阳区某某街道',
		status: 1,
	},
	{
		id: 2,
		date: '2024-01-02',
		name: '李四',
		address: '上海市浦东新区某某路',
		status: 0,
	},
	{
		id: 3,
		date: '2024-01-03',
		name: '王五',
		address: '广州市天河区某某大道',
		status: 1,
	},
]);

// 长表格数据（用于演示固定列和表头）
const longTableData = ref(
	Array.from({ length: 20 }, (_, i) => ({
		id: i + 1,
		date: `2024-01-${String(i + 1).padStart(2, '0')}`,
		name: `用户${i + 1}`,
		province: ['北京', '上海', '广东', '浙江', '江苏'][i % 5],
		city: ['朝阳区', '浦东新区', '天河区', '西湖区', '鼓楼区'][i % 5],
		address: `某某街道某某路${i + 1}号`,
	}))
);

// SKU 表格数据
const skuTableData = ref([
	{
		skuCode: 'SKU-001',
		skuName: '蓝色T恤 - L码',
		stock: 100,
		price: '¥99.00',
	},
	{
		skuCode: 'SKU-002',
		skuName: '白色衬衫 - M码',
		stock: 50,
		price: '¥159.00',
	},
]);

// 加载状态
const loading = ref(false);

// 选择改变事件
const handleSelectionChange = (selection: any[]) => {
	useMessage().success(`选中了 ${selection.length} 条数据`);
	console.log('选中的数据:', selection);
};

// 编辑操作
const handleEdit = (row: any) => {
	useMessage().info(`编辑: ${row.name}`);
	console.log('编辑行:', row);
};

// 删除操作
const handleDelete = (row: any) => {
	useMessage().warning(`删除: ${row.name}`);
	console.log('删除行:', row);
};

// 查看操作
const handleView = (row: any) => {
	useMessage().info(`查看: ${row.name}`);
	console.log('查看行:', row);
};

// 切换加载状态
const toggleLoading = () => {
	loading.value = !loading.value;
};

// 演示调用表格方法
const clearSelection = () => {
	tableRef.value?.clearSelection();
	useMessage().success('已清空选择');
};
</script>

<style scoped lang="scss">
.mr-table-example {
	padding: 20px;

	h2 {
		margin-bottom: 30px;
		font-size: 24px;
		color: #303133;
	}

	.example-section {
		margin-bottom: 40px;
		padding: 20px;
		border: 1px solid #dcdfe6;
		border-radius: 4px;
		background-color: #fff;

		h3 {
			margin-bottom: 20px;
			font-size: 18px;
			color: #606266;
			border-bottom: 1px solid #ebeef5;
			padding-bottom: 10px;
		}
	}
}
</style>

