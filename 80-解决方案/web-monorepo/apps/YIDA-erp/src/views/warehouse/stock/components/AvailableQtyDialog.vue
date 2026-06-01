<template>
	<el-popover
		v-model:visible="visible"
		width="800"
		placement="left"
		trigger="click"
	>
		<template #default>
			<el-table
				v-if="visible"
				:data="dataList"
				border
				width="800"
				:style="{
					height: '400px',
				}"
				native-scrollbar
			>
				<el-table-column prop="qty" :label="t('数量')" show-overflow-tooltip />
				<el-table-column
					prop="skuCartonCode"
					:label="t('箱规编码')"
					show-overflow-tooltip
					width="100"
				/>
				<el-table-column prop="type" :label="t('类型')" width="100">
					<template #default="{ row }">
						{{ row.type === 1 ? '整箱' : row.type === 2 ? '散货' : '' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="warehouseSku"
					:label="t('三方仓sku')"
					show-overflow-tooltip
					width="200"
				/>
				<el-table-column
					prop="singleCartonQuantity"
					:label="t('单箱数量')"
					show-overflow-tooltip
					width="100"
				/>
				<el-table-column
					prop="totalQty"
					:label="t('箱数')"
					show-overflow-tooltip
					width="100"
				/>
				<el-table-column
					prop="availableQty"
					:label="t('可用箱数')"
					show-overflow-tooltip
					width="100"
				/>
				<el-table-column
					prop="lockQty"
					:label="t('占用箱数')"
					show-overflow-tooltip
					width="100"
				/>
				<el-table-column
					prop="outCartonSpecLength"
					:label="t('外箱长宽高(CM)')"
					show-overflow-tooltip
					width="200"
				>
					<template #default="{ row }">
						{{ row.outCartonSpecLength }}*{{ row.outCartonSpecWidth }}*{{
							row.outCartonSpecHeight
						}}
					</template>
				</el-table-column>
				<el-table-column
					prop="cartonNetWeight"
					:label="t('产品净重(KG)')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">
						{{ row.cartonNetWeight?.toFixed(2) ?? '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="cartonGrossWeight"
					:label="t('外箱毛重(KG)')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">
						{{ row.cartonGrossWeight?.toFixed(2) ?? '---' }}
					</template>
				</el-table-column>
			</el-table>
		</template>
		<template #reference>
			<div @mousemove="handleMouseMove">
				<el-link class="text-blue" :underline="'hover'" @click="handleClick">{{
					displayValue ?? 0
				}}</el-link>
			</div>
		</template>
	</el-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface Props {
	displayValue?: number | string;
	dataList?: Array<any>;
}

withDefaults(defineProps<Props>(), {
	displayValue: 0,
	dataList: () => [],
});

const emit = defineEmits<{
	(e: 'click'): void;
}>();

const visible = ref(false);
const activeTab = ref('1');

const handleMouseMove = () => {
	activeTab.value = '1';
};

const handleClick = () => {
	emit('click');
};
</script>

<style lang="scss" scoped>
.text-blue {
	color: #0089ef;
}
</style>
