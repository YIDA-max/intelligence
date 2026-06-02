<template>
	<el-popover
		v-model:visible="visible"
		width="800"
		placement="left"
		trigger="click"
		@show="handleShow"
	>
		<template #default>
			<el-table
				v-if="visible"
				:data="tableData"
				border
				width="800"
				:style="{
					height: '400px',
				}"
				native-scrollbar
				v-loading="loading"
			>
				<el-table-column
					prop="billNo"
					:label="t('关联单号')"
					show-overflow-tooltip
					width="155"
				/>
				<el-table-column
					prop="stockTypeText"
					:label="t('库存类型')"
					show-overflow-tooltip
					width="155"
				/>
				<el-table-column
					prop="inboundTime"
					:label="t('入库时间')"
					show-overflow-tooltip
					width="155"
				/>
				<el-table-column
					prop="qty"
					:label="t('可用数量')"
					show-overflow-tooltip
					width="155"
				/>
				<el-table-column
					prop="stockAge"
					:label="t('库龄(天)')"
					show-overflow-tooltip
					width="155"
				/>
			</el-table>
		</template>
		<template #reference>
			<div @mousemove="handleMouseMove">
				<el-link class="text-blue" :underline="'hover'">{{
					displayValue ?? 0
				}}</el-link>
			</div>
		</template>
	</el-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import * as listApi from '/@/api/warehouse/stockManage/stockAge/index';

const { t } = useI18n();

interface Props {
	displayValue?: number | string;
	rowId?: string | number;
	quanityType?: Array<number>;
}

const props = withDefaults(defineProps<Props>(), {
	displayValue: 0,
});

const visible = ref(false);
const activeTab = ref('1');
const loading = ref(false);
const tableData = ref<any[]>([]);

const handleMouseMove = () => {
	activeTab.value = '1';
};

const handleShow = async () => {
	if (!props.rowId || !props.quanityType) return;
	loading.value = true;
	try {
		const res = await listApi.getQuanityList({
			ids: [props.rowId],
			types: props.quanityType,
		});
		if (res.code === 0) {
			tableData.value = res.data || [];
		}
	} finally {
		loading.value = false;
	}
};
</script>

<style lang="scss" scoped>
.text-blue {
	color: #0089ef;
}
</style>
