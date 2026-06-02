<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form
					:inline="true"
					:model="state.queryForm"
					@keyup.enter="getDataList"
					ref="queryRef"
				>
					<el-form-item>
						<el-select
							v-model="state.queryForm.status"
							placeholder="产品状态"
							clearable
							style="width: 150px"
							@change="getDataList"
						>
							<el-option
								v-for="item in [
									{
										value: 1,
										label: '启用',
									},
									{
										value: 0,
										label: '停用',
									},
								]"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-select
							v-model="state.queryForm.materialType"
							placeholder="辅料类型"
							clearable
							style="width: 150px"
							@change="getDataList"
						>
							<el-option
								v-for="item in materialTypeOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
					<el-form-item>
						<div class="flex items-center">
							<el-select
								v-model="createdIsUpdate"
								placeholder="请选择"
								style="width: 100px"
								@change="
									() => {
										changeCreatedIsUpdate();
									}
								"
							>
								<el-option
									v-for="item in [
										{
											label: '创建时间',
											value: 'createTime',
										},
										{
											label: '更新时间',
											value: 'updateTime',
										},
									]"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
							<el-date-picker
								v-model="timeRange[0]"
								type="date"
								:style="{ width: '180px' }"
								:placeholder="`请选择${
									createdIsUpdate === 'createTime'
										? '创建开始时间'
										: '更新开始时间'
								}`"
								value-format="YYYY-MM-DD"
								@change="
									() => {
										blurTimeRange();
									}
								"
							></el-date-picker>
							<el-date-picker
								v-model="timeRange[1]"
								type="date"
								:style="{ width: '180px' }"
								:placeholder="`请选择${
									createdIsUpdate === 'createTime'
										? '创建结束时间'
										: '更新结束时间'
								}`"
								value-format="YYYY-MM-DD"
								@change="
									() => {
										blurTimeRange();
									}
								"
							></el-date-picker>
						</div>
					</el-form-item>
					<el-form-item>
						<div class="flex items-center">
							<SelectInput
								v-model:queryForm="state.queryForm"
								:searchTypes="[
									{
										label: '辅料代码',
										value: 'materialCodes',
									},
									{
										label: '辅料名称',
										value: 'materialNames',
									},
									{
										label: 'SKU',
										value: 'skuCodes',
									},
									{
										label: '产品名称',
										value: 'skuNames',
									},
								]"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" type="primary"
							>{{ $t('搜索') }}
						</el-button>
						<el-button @click="resetQuery" type="info" plain
							>{{ $t('common.resetBtn') }}
						</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<ToolBar @handleRefresh="getDataList" @handleExport="handleExport">
					<template #left-tool>
						<el-button class="ml10" type="primary" @click="openDialog('add')">
							{{ $t('添加辅料') }}
						</el-button>
						<el-button class="ml10" @click="importDialogRef.show()">
							{{ $t('导入') }}
						</el-button>
					</template>
				</ToolBar>
			</el-row>
			<el-table
				:data="state.dataList"
				@selection-change="handleSelectionChange"
				@sort-change="sortChangeHandle"
				style="width: 100%"
				v-loading="state.loading"
				border
				ref="tableRef"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column align="center" type="selection" width="40" />
				<el-table-column :label="t('图片')" type="img" width="100">
					<template #default="{ row }">
						<MrImg :src="row.imgUrl" />
					</template>
				</el-table-column>
				<el-table-column
					prop="materialCode"
					:label="t('辅料代码')"
					show-overflow-tooltip
					sortable="custom"
				/>
				<el-table-column
					prop="materialName"
					:label="t('辅料名称')"
					show-overflow-tooltip
					sortable="custom"
				/>
				<el-table-column
					prop="materialType"
					:label="t('辅料类型')"
					show-overflow-tooltip
				/>
				<el-table-column
					prop="skus"
					:label="t('关联SKU')"
					show-overflow-tooltip
					width="160"
				>
					<template #default="{ row }">
						<div v-if="row.skus.length > 2">
							<div
								v-for="(sku, index) in row.skus.slice(0, 2)"
								:key="sku.id"
								class="relative flex items-center h-8 mb-2"
							>
								<div
									class="flex-1 pr-8 overflow-hidden whitespace-nowrap text-ellipsis"
								>
									{{ sku.skuName }} * {{ sku.skuQty }}
								</div>
								<div
									class="absolute right-0 transform -translate-y-1/2 top-1/2"
									v-if="index === 1"
								>
									<SkuPopover :tableData="row.skus" />
								</div>
							</div>
						</div>
						<!-- 当小于等于两条时，正常渲染，不加 Tooltip -->
						<div v-else>
							<div
								v-for="(sku, index) in row.skus"
								:key="sku.id"
								class="relative flex items-center h-8 mb-2"
							>
								<div class="whitespace-pre-wrap break-all max-w-[300px]">
									{{ sku.skuName }}
								</div>
								<div
									class="absolute right-0 transform -translate-y-1/2 top-1/2"
									v-if="index === row.skus.length - 1"
								>
									<SkuPopover :tableData="row.skus" />
								</div>
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column :label="t('状态')" show-overflow-tooltip>
					<template #default="{ row }">
						<el-switch
							:modelValue="!!row.status"
							size="small"
							@change="
							(e: any) => {
								statusChange(e, row);
							}
						"
						></el-switch>
					</template>
				</el-table-column>
				<el-table-column
					prop="productManageName"
					:label="t('产品负责人')"
					show-overflow-tooltip
				/>
				<el-table-column
					prop="createName"
					:label="t('创建人')"
					show-overflow-tooltip
				/>
				<el-table-column
					prop="createTime"
					:label="t('创建时间')"
					show-overflow-tooltip
					sortable="custom"
					width="180"
				/>
				<el-table-column
					prop="updateTime"
					:label="t('更新时间')"
					show-overflow-tooltip
					sortable="custom"
					width="180"
				/>
				<el-table-column :label="$t('common.action')" width="150" fixed="right">
					<template #default="{ row }">
						<div class="flex items-center">
							<el-button
								text
								type="primary"
								class="mr20"
								@click="openDialog('view', row)"
								>{{ $t('详情') }}
							</el-button>
							<el-dropdown @command="(type: any) => handleCommand(type, row)">
								<span class="el-dropdown-link">
									操作
									<el-icon class="el-icon--right">
										<arrow-down />
									</el-icon>
								</span>
								<template #dropdown>
									<el-dropdown-menu>
										<el-dropdown-item command="edit">编辑</el-dropdown-item>
										<!-- <el-dropdown-item command="copy">复制</el-dropdown-item> -->
									</el-dropdown-menu>
								</template>
							</el-dropdown>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<pagination
				@current-change="currentChangeHandle"
				@size-change="sizeChangeHandle"
				v-bind="state.pagination"
			/>
		</div>

		<el-dialog
			v-model="statusVisible"
			:show-close="false"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			width="25%"
			class="status-header"
		>
			<div>
				<div class="flex items-center mb10">
					<el-icon size="22px" :color="status ? '#2E5CF6' : '#f56c6c'">
						<Warning />
					</el-icon>
					<span class="text-lg ml8">
						{{ status ? '启用' : '停用' }}
					</span>
				</div>
				<div class="text-lg ml30">
					<div>
						确定{{ status ? '启用' : '停用' }}{{ currentRow?.materialCode }}吗?
					</div>
				</div>
			</div>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="statusVisible = false">取消</el-button>
					<el-button v-if="status" type="primary" @click="changeStatus">
						启用
					</el-button>
					<el-button v-else type="danger" plain @click="changeStatus"
						>停用</el-button
					>
				</div>
			</template>
		</el-dialog>

		<!-- 编辑、新增  -->
		<MaterialFormDialog
			v-model="visible"
			:title="title"
			:currentRow="currentRow"
			:visibleType="visibleType"
			@closeDialog="closeDialog"
			@changeCopy="changeCopy"
			@changeEdit="changeEdit"
		></MaterialFormDialog>
		<ImportDialog
			ref="importDialogRef"
			title="导入辅料"
			templateUrl="/files/import-template/导入辅料模版.xlsx"
			@refreshDataList="getDataList"
			downLoadTemplateName="导入辅料模版"
		/>
		<!-- 展示图片 -->
		<Preview v-model="showPreview" :url="currentRow?.imgUrl" type="image" />
	</div>
</template>

<script lang="ts" name="systemDatasourceConf" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import {
	getMaterialList,
	enableMaterial,
	disableMaterial,
} from '/@/api/product/material';

import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive } from 'vue';
import { onMounted } from 'vue';
import { useMessage } from '/@/hooks/message';
import { getDicts } from '/@/api/admin/dict';
import { materialDetail, getExportMaterial } from '/@/api/product/material';
// 引入组件
const MaterialFormDialog = defineAsyncComponent(
	() => import('./components/material-form-dialog.vue')
);
const ToolBar = defineAsyncComponent(
	() => import('/@/components/ToolBar/tool-bar.vue')
);
// const MaterialPopover = defineAsyncComponent(() => import('./components/material-popover.vue'));
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const SkuPopover = defineAsyncComponent(
	() => import('./components/Sku-popover.vue')
);
const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);
const Preview = defineAsyncComponent(
	() => import('/@/components/Material/preview.vue')
);
const { t } = useI18n();

// 定义变量内容
const importDialogRef = ref();
// const formDialogRef = ref();
// 搜索变量
const queryRef = ref();
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);
// 时间存储
const timeRange = ref([null, null]);
// 当前查询的是创建时间还是更新时间
const createdIsUpdate = ref('createTime');

// 是否显示预览
const showPreview = ref(false);
// 当前点击的行
const currentRow = ref<any>({
	id: '',
});
// 弹窗是否显示
const visible = ref(false);
// 弹窗类型
const visibleType = ref('');
// 弹窗标题
const title = ref('');
// 表格引用
const tableRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		status: 1, // 默认启用
	},
	pageList: getMaterialList,
	// 默认排序
	descs: ['create_time'],
	ascs: [''],
});

const materialTypeOptions = ref<any[]>([]);
//  table hook
const {
	getDataList,
	currentChangeHandle,
	sizeChangeHandle,
	sortChangeHandle,
	tableStyle,
} = useTable(state, tableRef);

onMounted(async () => {
	try {
		// 获取辅料类型
		const res = await getDicts('material_type');
		if (res.code === 0) {
			materialTypeOptions.value = res.data.map((item: any) => ({
				value: item.value,
				label: item.label,
			}));
		}
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('获取辅料类型失败:', error);
	}
	// 初始化数据,默认产品状态选择启用
	// state.queryForm.status = 1;
	// getDataList();
});

/*
 * 切换创建时间或更新时间
 * 当切换创建时间或更新时间时，重置时间范围
 */
const changeCreatedIsUpdate = () => {
	// 当切换创建时间或更新时间时，重置时间范围
	timeRange.value = [null, null];
};
/*
 * 失焦的时候查询时间
 */
const blurTimeRange = () => {
	// 不需要时间范围都填写
	if (createdIsUpdate.value === 'createTime') {
		// 查询创建时间
		state.queryForm.createTimeStart = timeRange.value[0];
		state.queryForm.createTimeEnd = timeRange.value[1];
	} else if (createdIsUpdate.value === 'updateTime') {
		// 查询更新时间
		state.queryForm.updateTimeStart = timeRange.value[0];
		state.queryForm.updateTimeEnd = timeRange.value[1];
	}
	getDataList();
};

// 清空搜索条件
const resetQuery = () => {
	state.queryForm = {
		current: 1,
		size: 10,
		status: 1, // 默认启用
	};
	// 重置时间范围
	timeRange.value = [null, null];
	getDataList();
};

// 多选事件
const handleSelectionChange = (objs: { id: string }[]) => {
	selectObjs.value = objs.map(({ id }) => id);
	multiple.value = !objs.length;
};

const handleExport = async () => {
	try {
		const ids = tableRef.value.getSelectionRows()?.map((item: any) => item.id);
		// 显示加载状态
		state.loading = true;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await getExportMaterial({
			...state.queryForm,
			ascs: state?.ascs,
			descs: state?.descs,
			ids,
			current: 1,
			size: 10000,
		});
	} catch (error) {
		useMessage().error(t(error as string));
	} finally {
		// 隐藏加载状态
		state.loading = false;
	}
};

// 打开类别弹窗
const openDialog = async (type: string, row?: any) => {
	if (type === 'add') {
		// 添加操作
		title.value = '添加辅料';
	} else if (type === 'edit' && row) {
		// 编辑操作
		// 查看操作
		const res = await materialDetail({
			id: row.id,
		});
		if (res.code === 0) {
			currentRow.value = res.data;
		}
		title.value = '编辑辅料';
	} else if (type === 'view' && row) {
		// 查看操作
		const res = await materialDetail({
			id: row.id,
		});
		if (res.code === 0) {
			currentRow.value = res.data;
		}
		title.value = '查看辅料';
	} else if (type === 'copy' && row) {
		// 复制操作
		const res = await materialDetail({
			id: row.id,
		});
		if (res.code === 0) {
			currentRow.value = res.data;
		}
		title.value = '复制辅料';
	}
	visible.value = true;
	// 设置弹窗类型
	visibleType.value = type;
};

// 辅料状态修改 -- 二次确认
const status = ref<Boolean>(false);
const statusVisible = ref(false);

const statusChange = (type: Boolean, row: any) => {
	status.value = type;
	statusVisible.value = true;
	// 设置当前行
	currentRow.value = row;
};

// 修改辅料状态
const changeStatus = async () => {
	// 关闭弹窗
	statusVisible.value = false;
	// 调用接口修改状态
	if (status.value) {
		// 启用操作
		await enableMaterial({ id: currentRow.value?.id });
		getDataList();
	} else {
		// 停用操作
		await disableMaterial({ id: currentRow.value?.id });
		getDataList();
	}
};

const closeDialog = () => {
	visible.value = false;
	// 刷新数据列表
	getDataList();
};

// 操作
const handleCommand = (type: any, row: any) => {
	switch (type) {
		case 'edit':
			openDialog('edit', row);
			break;
		case 'copy':
			openDialog('copy', row);
			break;
	}
};

// 复制操作
const changeCopy = async () => {
	visible.value = false;
	await new Promise((resolve) => setTimeout(resolve, 100)); // 确保关闭后再打开
	openDialog('copy');
};
// 切换到编辑模式
const changeEdit = async () => {
	visible.value = false;
	await new Promise((resolve) => setTimeout(resolve, 100)); // 确保关闭后再打开
	openDialog('edit');
};
</script>
<style lang="scss" scoped>
.el-dropdown-link {
	cursor: pointer;
	color: var(--el-color-primary);
	display: flex;
	align-items: center;
}
</style>
