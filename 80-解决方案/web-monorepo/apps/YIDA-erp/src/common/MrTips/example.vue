<template>
	<div class="mr-tips-example">
		<h2>MrTips 组件使用示例</h2>

		<!-- 示例1：基础用法 -->
		<section class="example-section">
			<h3>示例1：基础用法</h3>
			<div class="tips-row">
				<mr-tips label="普通标签" tips="这是一个普通的提示信息" />
			</div>
			<div class="tips-row">
				<mr-tips label="必填标签" tips="这是一个必填字段的提示" required />
			</div>
			<div class="tips-row">
				<mr-tips label="数字标签" :label="123" tips="标签可以是数字类型" />
			</div>
		</section>

		<!-- 示例2：不同的 Tooltip 位置 -->
		<section class="example-section">
			<h3>示例2：不同的 Tooltip 位置</h3>
			<div class="placement-grid">
				<mr-tips label="上方" tips="顶部显示提示" placement="top" />
				<mr-tips label="上方开始" tips="顶部开始位置显示" placement="top-start" />
				<mr-tips label="上方结束" tips="顶部结束位置显示" placement="top-end" />
				<mr-tips label="下方" tips="底部显示提示" placement="bottom" />
				<mr-tips label="左侧" tips="左侧显示提示" placement="left" />
				<mr-tips label="右侧" tips="右侧显示提示" placement="right" />
			</div>
		</section>

		<!-- 示例3：自定义图标样式 -->
		<section class="example-section">
			<h3>示例3：自定义图标样式</h3>
			<div class="tips-row">
				<mr-tips label="小图标" tips="图标大小：12" :icon-size="12" />
			</div>
			<div class="tips-row">
				<mr-tips label="默认图标" tips="图标大小：14（默认）" />
			</div>
			<div class="tips-row">
				<mr-tips label="大图标" tips="图标大小：18" :icon-size="18" />
			</div>
			<div class="tips-row">
				<mr-tips label="蓝色图标" tips="自定义图标颜色" icon-color="#409eff" />
			</div>
			<div class="tips-row">
				<mr-tips label="绿色图标" tips="自定义图标颜色" icon-color="#67c23a" />
			</div>
		</section>

		<!-- 示例4：在表单中使用 -->
		<section class="example-section">
			<h3>示例4：在表单中使用</h3>
			<el-form :model="form" label-width="140px">
				<el-form-item>
					<template #label>
						<mr-tips label="邮箱地址" tips="用于接收系统通知和找回密码" required />
					</template>
					<el-input v-model="form.email" placeholder="请输入邮箱" />
				</el-form-item>

				<el-form-item>
					<template #label>
						<mr-tips label="联系电话" tips="请填写真实的手机号码，方便联系" />
					</template>
					<el-input v-model="form.phone" placeholder="请输入手机号" />
				</el-form-item>

				<el-form-item>
					<template #label>
						<mr-tips label="所在城市" tips="选择您当前所在的城市<br/>用于推荐附近的服务网点" placement="right" />
					</template>
					<el-input v-model="form.city" placeholder="请输入城市" />
				</el-form-item>
			</el-form>
		</section>

		<!-- 示例5：在表格中使用 -->
		<section class="example-section">
			<h3>示例5：在表格中使用</h3>
			<el-table :data="tableData" border>
				<el-table-column width="180">
					<template #header>
						<mr-tips label="SKU编码" tips="商品唯一标识码，用于库存管理" required />
					</template>
					<template #default="{ row }">
						{{ row.skuCode }}
					</template>
				</el-table-column>

				<el-table-column width="200">
					<template #header>
						<mr-tips label="SKU名称" tips="商品的中文名称描述" />
					</template>
					<template #default="{ row }">
						{{ row.skuName }}
					</template>
				</el-table-column>

				<el-table-column width="120">
					<template #header>
						<mr-tips label="发货数量" tips="实际发货的商品数量<br/>不能超过库存数量" required placement="top-start" />
					</template>
					<template #default="{ row }">
						<el-input-number v-model="row.quantity" :min="0" size="small" />
					</template>
				</el-table-column>

				<el-table-column width="120">
					<template #header>
						<mr-tips label="单箱数量" tips="每个包装箱内的商品数量<br/>用于计算总箱数" :icon-size="16" />
					</template>
					<template #default="{ row }">
						{{ row.cartonQty }}
					</template>
				</el-table-column>

				<el-table-column width="150">
					<template #header>
						<mr-tips
							label="可提数量"
							tips="可提数量 = 发货数量 - 在途占用<br/>这是可以进行转换的最大数量"
							icon-color="#409eff"
						/>
					</template>
					<template #default="{ row }">
						{{ row.availableQty }}
					</template>
				</el-table-column>
			</el-table>
		</section>

		<!-- 示例6：自定义插槽 -->
		<section class="example-section">
			<h3>示例6：自定义插槽</h3>
			<div class="tips-row">
				<mr-tips tips="使用插槽自定义标签内容" required>
					<el-icon><User /></el-icon>
					<span style="margin-left: 4px; font-weight: bold">用户信息</span>
				</mr-tips>
			</div>
			<div class="tips-row">
				<mr-tips tips="带颜色的自定义标签">
					<span style="color: #409eff; font-weight: bold">蓝色标签</span>
				</mr-tips>
			</div>
			<div class="tips-row">
				<mr-tips tips="带多个图标的标签">
					<el-icon><Star /></el-icon>
					<span style="margin: 0 4px">重要字段</span>
					<el-icon><Lock /></el-icon>
				</mr-tips>
			</div>
		</section>

		<!-- 示例7：不同的 Tooltip 效果 -->
		<section class="example-section">
			<h3>示例7：不同的 Tooltip 效果</h3>
			<div class="tips-row">
				<mr-tips label="深色主题" tips="这是深色主题的提示框" effect="dark" />
			</div>
			<div class="tips-row">
				<mr-tips label="浅色主题" tips="这是浅色主题的提示框" effect="light" />
			</div>
		</section>

		<!-- 示例8：配合 MrTable 使用 -->
		<section class="example-section">
			<h3>示例8：配合 MrTable 使用</h3>
			<mr-table :data="tableData" border>
				<mr-table-column width="180">
					<template #header>
						<mr-tips label="商品编码" tips="系统自动生成的商品编码<br/>全局唯一" required />
					</template>
					<template #default="{ row }">
						{{ row.skuCode }}
					</template>
				</mr-table-column>

				<mr-table-column width="200">
					<template #header>
						<mr-tips label="商品名称" tips="商品的完整名称" />
					</template>
					<template #default="{ row }">
						{{ row.skuName }}
					</template>
				</mr-table-column>

				<mr-table-column width="120">
					<template #header>
						<mr-tips label="库存数量" tips="当前可用库存数量" icon-color="#67c23a" />
					</template>
					<template #default="{ row }">
						<el-tag :type="row.availableQty > 50 ? 'success' : 'warning'">
							{{ row.availableQty }}
						</el-tag>
					</template>
				</mr-table-column>
			</mr-table>
		</section>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { User, Star, Lock } from '@element-plus/icons-vue';
import MrTips from './index.vue';
import { MrTable, MrTableColumn } from '/@/common/MrTable';

// 表单数据
const form = ref({
	email: '',
	phone: '',
	city: '',
});

// 表格数据
const tableData = ref([
	{
		skuCode: 'SKU-001',
		skuName: '蓝色T恤 - L码',
		quantity: 10,
		cartonQty: 20,
		availableQty: 100,
	},
	{
		skuCode: 'SKU-002',
		skuName: '白色衬衫 - M码',
		quantity: 15,
		cartonQty: 24,
		availableQty: 80,
	},
	{
		skuCode: 'SKU-003',
		skuName: '黑色牛仔裤 - 32',
		quantity: 8,
		cartonQty: 12,
		availableQty: 45,
	},
]);
</script>

<style scoped lang="scss">
.mr-tips-example {
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

	.tips-row {
		margin-bottom: 12px;
		padding: 8px 12px;
		background-color: #f5f7fa;
		border-radius: 4px;
		display: inline-block;
		margin-right: 16px;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.placement-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;

		> * {
			padding: 12px;
			background-color: #f5f7fa;
			border-radius: 4px;
			text-align: center;
		}
	}

	:deep(.el-form) {
		max-width: 600px;
	}

	:deep(.el-table) {
		margin-top: 16px;
	}
}
</style>

