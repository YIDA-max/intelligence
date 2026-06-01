<template>
	<el-popover
		v-model:visible="visible"
		width="800"
		placement="left"
		trigger="click"
		:style="{
			height: '400px',
		}"
	>
		<template #default>
			<el-tabs v-if="visible" v-model="activeTab" class="demo-tabs" width="800">
				<el-tab-pane label="在途" name="1">
					<el-table
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
							:label="t('单据编号')"
							show-overflow-tooltip
						>
						</el-table-column>
						<el-table-column
							prop="qty"
							:label="t('数量')"
							show-overflow-tooltip
						/>
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
				</el-tab-pane>
			</el-tabs>
		</template>
		<template #reference>
			<div @mousemove="handleMouseMove">
				<el-link class="text-blue" :underline="'hover'" @click="handleClick">{{
					displayValue ?? '---'
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
