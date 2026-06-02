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
				<el-table-column
					prop="relateOrderNo"
					:label="t('占用单号')"
					show-overflow-tooltip
				>
				</el-table-column>
				<el-table-column prop="qty" :label="t('数量')" show-overflow-tooltip />
				<el-table-column
					prop="createName"
					:label="t('操作人')"
					show-overflow-tooltip
				/>
				<el-table-column
					prop="createTime"
					:label="t('操作时间')"
					show-overflow-tooltip
				/>
			</el-table>
		</template>
		<template #reference>
			<div>
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

const handleClick = () => {
	emit('click');
};
</script>

<style lang="scss" scoped>
.text-blue {
	color: #0089ef;
}
</style>
