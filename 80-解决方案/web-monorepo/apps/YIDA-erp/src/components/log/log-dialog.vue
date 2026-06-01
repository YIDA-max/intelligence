<template>
	<el-dialog
		width="70%"
		:close-on-click-modal="false"
		draggable
		v-bind="$attrs"
		@open="
			() => {
				state.queryForm.bizId = props.id;
				setTableData([]);
				getDataList();
			}
		"
		:append-to-body="true"
		:title="$t('日志')"
	>
		<div class="ml10">
			<el-row class="mt-4 ml10" v-if="props.showSearchForm">
				<el-form
					:inline="true"
					@submit.prevent
					:model="state.queryForm"
					@keyup.enter="getDataList"
					ref="queryRef"
				>
					<el-form-item :label="$t('syslog.logType')" prop="opsTypes">
						<el-select
							:placeholder="$t('syslog.inputLogTypeTip')"
							clearable
							v-model="state.queryForm.opsTypes"
							@change="getDataList"
						>
							<el-option
								:key="item.value"
								:label="item.label"
								:value="item.value"
								v-for="item in [
									{
										value: '1',
										label: '新增',
									},
									{
										value: '2',
										label: '编辑',
									},
									{
										value: '3',
										label: '删除',
									},
									{
										value: '4',
										label: '启用',
									},
									{
										value: '5',
										label: '停用',
									},
								]"
							/>
						</el-select>
					</el-form-item>
					<el-form-item>
						<div class="flex items-center">
							<el-date-picker
								v-model="timeRange[0]"
								type="date"
								:style="{ width: '220px' }"
								:placeholder="`开始时间`"
								value-format="YYYY-MM-DD"
								@blur="
									() => {
										blurTimeRange();
									}
								"
							></el-date-picker>
							<el-date-picker
								v-model="timeRange[1]"
								type="date"
								:style="{ width: '220px' }"
								:placeholder="`结束时间`"
								value-format="YYYY-MM-DD"
								@blur="
									() => {
										blurTimeRange();
									}
								"
							></el-date-picker>
						</div>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row v-if="props.showToolBar">
				<ToolBar
					@handleRefresh="resetQuery"
					:isShowExport="false"
					:isShowRefresh="true"
				>
				</ToolBar>
			</el-row>
			<el-table
				ref="tableRef"
				:data="state.dataList"
				@sort-change="sortChangeHandle"
				v-loading="state.loading"
				border
				height="400"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<!-- <el-table-column :label="$t('日志类型')" prop="logType" show-overflow-tooltip></el-table-column> -->
				<el-table-column
					:label="$t('操作时间')"
					prop="createTime"
					show-overflow-tooltip
				></el-table-column>
				<el-table-column
					:label="$t('操作类型')"
					prop="opsType"
					show-overflow-tooltip
				></el-table-column>
				<el-table-column :label="$t('日志内容')" prop="logContent">
					<template #default="{ row }">
						<MrTextEllipsis :text="showLogContent(row)" />
					</template>
				</el-table-column>
				<el-table-column
					:label="$t('操作人')"
					prop="createName"
					show-overflow-tooltip
				></el-table-column>
			</el-table>

			<pagination
				@current-change="currentChangeHandle"
				@size-change="sizeChangeHandle"
				v-bind="state.pagination"
			></pagination>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="closeDialog">{{
					$t('common.cancelButtonText')
				}}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getLogList } from '/@/api/product/ops';
import { useI18n } from 'vue-i18n';
import { ref, defineAsyncComponent, reactive } from 'vue';
import { useUserInfo } from '/@/stores/userInfo';
const emit = defineEmits(['closeDialog']);
const ToolBar = defineAsyncComponent(
	() => import('/@/components/ToolBar/tool-bar.vue')
);
// 定义变量内容
const stores = useUserInfo();
const { userInfos } = storeToRefs(stores);
const props = defineProps({
	id: {
		type: [String, Number],
		default: '',
	},
	bizType: {
		type: Array<string>,
		default: [''], // 业务类型，1:辅料, 2:品牌, 3:类目, 4:sku, 5:SPU 6:捆绑产品
	},
	// 搜索栏
	showSearchForm: {
		type: Boolean,
		default: true,
	},
	// 刷新
	showToolBar: {
		type: Boolean,
		default: true,
	},
	// 岗位加密
	postCodeList: {
		type: Array<string>,
		default: [],
	},
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const { t } = useI18n();
// 时间存储
const timeRange = ref([null, null]);
// 定义变量内容
const queryRef = ref();

let tableRef = ref<any>(null);

const state: BasicTableProps = reactive<BasicTableProps>(<BasicTableProps>{
	queryForm: {
		logType: '',
		createTime: '',
		bizTypes: props.bizType, // 业务类型，1:辅料, 2:品牌, 3:类目, 4:sku, 5:SPU 6:捆绑产品
		bizId: props.id, // 业务ID，SKU编码
		// opsTypes: ['1', '2', '3', '4', '5'], // 操作类型 1:新增, 2:编辑, 3:删除, 4:启用, 5:停用
	},
	selectObjs: [],
	pageList: getLogList,
	descs: ['create_time'],
	createdIsNeed: false,
});
//  table hook
const {
	getDataList,
	currentChangeHandle,
	sortChangeHandle,
	sizeChangeHandle,
	setTableData,
	tableStyle,
} = useTable(state, tableRef);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value?.resetFields();
	getDataList();
};
/*
 * 失焦的时候查询时间
 */
const blurTimeRange = () => {
	// 查询创建时间
	state.queryForm.createTimeStart = timeRange.value[0];
	state.queryForm.createTimeEnd = timeRange.value[1];
	getDataList();
};

/**
 * 显示日志内容 是否需要加密
 * @param row 日志行数据
 * @returns 日志内容
 * */
const showLogContent = (row: any) => {
	if (props.postCodeList && props.postCodeList?.length > 0) {
		// 需要加密
		if (
			props.postCodeList.some((code) =>
				userInfos.value.postCodeList.includes(code)
			)
		) {
			return row.logContent;
		} else {
			return '加密信息';
		}
	} else {
		// 不需要加密
		return row.logContent;
	}
};

// 当 props.id 变化时，重新获取数据
// watch(
// 	() => props.id,
// 	() => {
// 		state.queryForm.bizId = props.id;
// 		getDataList();
// 	},
// 	{ deep: true, immediate: true }
// );
const closeDialog = () => {
	emit('closeDialog');
};
</script>

<style lang="scss" scoped></style>
