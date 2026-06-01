<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form
					:inline="true"
					:model="state.queryForm"
					@keyup.enter="register?.getDataList"
					ref="queryRef"
				>
					<el-form-item>
						<div class="flex item-center">
							<SelectInput
								v-model:queryForm="state.queryForm"
								:settings="{
									selectStyle: {
										width: '130px',
									},
									inputStyle: {
										width: '200px',
									},
								}"
								:searchTypes="[
									{
										label: '订单编号',
										value: 'orderIds1',
									},
									{
										label: '类型',
										value: 'orderIds2',
									},
									{
										label: '市场',
										value: 'orderIds3',
									},
									{
										label: '结算ID',
										value: 'mskuCodes',
									},
								]"
								:getDataList="register?.getDataList"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<div>
							<SelectDate
								v-model:queryForm="state.queryForm"
								:settings="{
									selectStyle: {
										width: '130px',
									},
									dateStyle: {
										width: '130px',
									},
								}"
								:searchTypes="[
									{
										label: '交易过账时间',
										value: 'createTime',
										isAddHMS: true,
										dateStart: 'createTimeStart',
										dateEnd: 'createTimeEnd',
									},
								]"
								:getDataList="register?.getDataList"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<el-button @click="register?.getDataList" type="primary"
							>{{ $t('搜索') }}
						</el-button>
						<el-button @click="resetQuery" type="info" plain
							>{{ $t('common.resetBtn') }}
						</el-button>
					</el-form-item>
				</el-form>
			</el-row>

			<BaseTable :register="register" ref="tableRef">
				<!-- 左侧工具栏 -->
				<template #left-tool>
					<EditOrAdd :type="'add'" @getDataList="register?.getDataList" />
				</template>
				<!-- 操作栏 -->
				<template #actionColumn>
					<EditOrAdd :type="'edit'" @getDataList="register?.getDataList">
						<template #default>
							<el-button type="primary" @click="register?.getDataList">
								编辑
							</el-button>
						</template>
					</EditOrAdd>
				</template>
			</BaseTable>
			<ImportDialog
				ref="importDialogRef"
				title="导入需求计划"
				templateUrl="/files/import-template/导入需求模版.xlsx"
				excelUploadApi="/purchase/demand/import"
				:accept="'.xlsx,.xls'"
				@refreshDataList="register?.getDataList"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { columns } from './config';
import { getCurdPage } from './api';
import { defineAsyncComponent, ref, reactive } from 'vue';

const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);

const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const EditOrAdd = defineAsyncComponent(
	() => import('./components/addOrEdit/index.vue')
);
// 搜索变量
const queryRef = ref();
// 导入弹窗引用
const importDialogRef = ref();
// table的引用
const tableRef = ref();
// 是否显示搜索
const showSearch = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getCurdPage,
	columns,
	toolBarConfig: {
		handleRefresh: () => {
			register?.getDataList();
		},
		// settingKey: 'payTheBill',
		isShowSetting: false,
	},
});

//  table hook
const { register } = useTable(state, tableRef);

// 重置
// 清空搜索条件
const resetQuery = () => {
	register?.resetTableQuery(() => {
		return {
			queryForm: {
				current: 1,
				size: 10,
			},
			ascs: [],
			descs: [],
		};
	});
};
</script>

<style lang="scss" scoped>
.text-blue {
	color: #0089ef;
	word-break: break-all;
	white-space: pre-line;
	cursor: pointer;
	text-align: left;
}
.el-dropdown-link {
	cursor: pointer;
	color: var(--el-color-primary);
	display: flex;
	align-items: center;
}
</style>
