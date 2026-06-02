<!--
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-03-30 15:55:45
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-03-31 11:55:41
 * @FilePath: \qianyi-ui\src\views\materialFlow\freightFlow\platformWarehouseDiff\components\ReceiveDetailDialog.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<el-dialog
		v-model="visible"
		title="收货详情"
		width="870"
		height="60%"
		:close-on-click-modal="false"
		@close="handleClose"
	>
		<BaseTable
			ref="receiveDetailTableRef"
			:register="receiveDetailRegister"
			:rowConfig="{ keyField: 'id' }"
		/>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive, nextTick } from 'vue';
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { receiveDetailColumns } from '../config/index';
import { listApi } from '../config/index';

interface Props {
	modelValue: boolean;
	rowData?: any;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const receiveDetailTableRef = ref();
const visible = ref(false);

const receiveDetailState: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: listApi.getReceiveDetail,
	columns: receiveDetailColumns,
	isShowpagination: false,
	isDialog: true,
	toolBarConfig: {
		isShowExport: false,
		isShowRefresh: false,
	},
	createdIsNeed: false,
});

const { register: receiveDetailRegister } = useTable(
	receiveDetailState,
	receiveDetailTableRef
);

watch(
	() => props.modelValue,
	async (val) => {
		visible.value = val;
		if (val && props.rowData) {
			receiveDetailRegister.state.queryForm = { id: props.rowData.id };
			await nextTick();
			receiveDetailRegister?.getDataList();
		}
	},
	{ immediate: true }
);

watch(visible, (val) => {
	emit('update:modelValue', val);
});

const handleClose = () => {
	visible.value = false;
};
</script>
