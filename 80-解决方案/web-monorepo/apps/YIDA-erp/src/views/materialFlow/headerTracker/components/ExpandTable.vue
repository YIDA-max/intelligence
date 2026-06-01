<template>
	<el-table
		:data="products"
		:header-cell-style="{
			textAlign: 'center',
			background: 'white',
			color: 'black',
			padding: '15px 0',
		}"
		:cell-style="{
			textAlign: 'center',
			padding: '20px 0',
		}"
		class="expand-table"
		native-scrollbar
	>
		<el-table-column align="center" width="60" />
		<!-- <el-table-column type="selection" width="40" align="center" /> -->
		<el-table-column label="SKU" width="220" show-overflow-tooltip>
			<template #default="{ row: skuRow }">
				<span>{{ skuRow.sku || '---' }}</span>
			</template>
		</el-table-column>
		<el-table-column
			prop="productName"
			label="产品名称"
			width="220"
			align="left"
			show-overflow-tooltip
		>
			<template #default="{ row: skuRow }">
				<span>{{ skuRow.productName || '---' }}</span>
			</template>
		</el-table-column>
		<el-table-column prop="platform" label="平台" width="150" align="left">
			<template #default="{ row: skuRow }">
				<span>{{ getUniquePlatforms(skuRow.platform) }}</span>
			</template>
		</el-table-column>
		<el-table-column
			prop="msku"
			label="MSKU"
			width="150"
			align="left"
			:show-overflow-tooltip="true"
		>
			<template #default="{ row: skuRow }">
				<span>{{ skuRow.msku || '---' }}</span>
			</template>
		</el-table-column>
		<el-table-column
			prop="fnskuEanGtin"
			label="FNSKU/EAN/GTIN"
			width="150"
			align="left"
		>
			<template #default="{ row: skuRow }">
				{{ skuRow.fnskuEanGtin || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="shipmentId"
			label="Shipment ID"
			width="150"
			align="left"
		>
			<template #default="{ row: skuRow }">
				{{ skuRow.shipmentId || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="referenceId"
			label="Reference ID"
			width="150"
			align="left"
		>
			<template #default="{ row: skuRow }">
				{{ skuRow.referenceId || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="cargoReadyTime"
			label="货好时间"
			width="200"
			align="left"
		>
			<template #default="{ row: skuRow }">
				{{ skuRow.cargoReadyTime || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="actualQty"
			label="实际发货数量"
			width="150"
			align="left"
		>
			<template #default="{ row: skuRow }">
				{{ skuRow.actualQty || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="actualCases"
			label="实际发货箱数"
			width="150"
			align="left"
		>
			<template #default="{ row: skuRow }">
				{{ skuRow.actualCases || '---' }}
			</template>
		</el-table-column>
		<el-table-column prop="totalVolume" label="总体积" width="150" align="left">
			<template #default="{ row: skuRow }">
				{{ skuRow.totalVolume || '---' }}(m³)
			</template>
		</el-table-column>
		<el-table-column
			prop="totalGrossWeight"
			label="总毛重"
			width="150"
			align="left"
		>
			<template #default="{ row: skuRow }">
				{{ skuRow.totalGrossWeight || '---' }}(kg)
			</template>
		</el-table-column>
		<el-table-column
			prop="totalNetWeight"
			label="总净重"
			width="150"
			align="left"
		>
			<template #default="{ row: skuRow }">
				{{ skuRow.totalNetWeight || '---' }}(kg)
			</template>
		</el-table-column>
		<el-table-column prop="factoryPickup" label="工厂提货" min-width="180">
			<template #default="{ row: skuRow }">{{
				skuRow?.factoryPickup ?? '---'
			}}</template>
		</el-table-column>
		<el-table-column
			prop="deliveryMethod"
			label="发货方式-末端"
			min-width="180"
		>
			<template #default="{ row: skuRow }">{{
				skuRow.deliveryMethod || '---'
			}}</template>
		</el-table-column>
		<el-table-column
			prop="createTime"
			label="创建时间"
			width="300"
			align="left"
		>
			<template #default="{ row: skuRow }">
				{{ skuRow.createTime || '---' }}
			</template>
		</el-table-column>
		<el-table-column
			prop="updateTime"
			label="修改时间"
			width="300"
			align="left"
		>
			<template #default="{ row: skuRow }">
				{{ skuRow.updateTime || '---' }}
			</template>
		</el-table-column>
	</el-table>
</template>

<script setup lang="ts">
defineProps<{
	products: any[];
}>();

const getUniquePlatforms = (platform: string) => {
	if (!platform) return '---';
	const platforms = platform.split(';').filter((item) => item.trim() !== '');
	const uniquePlatforms = [...new Set(platforms)];
	return uniquePlatforms.join(';') || '---';
};
</script>

<style scoped lang="scss">
.expand-table {
	::v-deep(.el-table__header-wrapper) {
		th {
			background-color: white !important;
		}
	}
}
</style>
