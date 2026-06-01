<template>
	<div class="layout-padding" v-show="renderComponent">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<ToolBar
					@handleRefresh="
						resetTableQuery(() => {
							return {
								queryForm: {
									statusBoole: '',
									status: 1,
									current: 1,
									size: 10,
								},
								descs: ['create_time'],
								ascs: [],
							};
						})
					"
					@handleExport="exportPartFn"
					:is-show-export="auth('product_brand_export')"
					:is-show-refresh="true"
				>
					<template #left-tool>
						<el-button
							@click="openDialog('add')"
							class="ml10"
							type="primary"
							v-auth="'product_brand_add'"
						>
							{{ $t('productBrand.addBrand') }}
						</el-button>
					</template>
					<template #right-tool>
						<el-select
							v-model="state.queryForm.status"
							placeholder="产品状态"
							clearable
							style="width: 150px"
							@change="
								() => {
									getDataList();
								}
							"
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
							/> </el-select
					></template> </ToolBar
			></el-row>

			<el-table
				ref="tableRef"
				:data="state.dataList"
				style="width: 100%"
				v-loading="state.loading"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
				@sort-change="sortChangeHandle"
				native-scrollbar
			>
				<el-table-column
					:label="$t('productBrand.brandCode')"
					prop="brandCode"
					sortable
					show-overflow-tooltip
				/>
				<el-table-column
					:label="$t('productBrand.brandName')"
					prop="brandName"
					sortable
					show-overflow-tooltip
				/>
				<el-table-column :label="$t('productBrand.state')">
					<template #default="{ row }">
						<el-switch
							:modelValue="!!row.status"
							:disabled="
								row.status === 1 || row.status === '1'
									? !auth('product_brand_stop')
									: !auth('product_brand_start')
							"
							size="small"
							@change="(e: boolean) => {statusChange(e, row);}"
						></el-switch>
					</template>
				</el-table-column>
				<el-table-column
					:label="$t('productBrand.creator')"
					prop="createName"
					show-overflow-tooltip
				/>
				<el-table-column
					:label="$t('datasourceconf.createTime')"
					prop="createTime"
					sortable="custom"
					show-overflow-tooltip
				/>
				<el-table-column
					:label="$t('datasourceconf.updateTime')"
					prop="updateTime"
					sortable="custom"
					show-overflow-tooltip
				/>
				<el-table-column :label="$t('common.action')" width="250">
					<template #default="scope">
						<el-button
							text
							type="primary"
							@click="openDialog('edit', scope.row)"
							v-auth="'product_brand_edit'"
							>{{ $t('common.editBtn') }}
						</el-button>
						<el-button text type="primary" @click="openDialog('log', scope.row)"
							>{{ $t('日志') }}
						</el-button>
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
					<el-icon size="22px" :color="status ? '#2E5CF6' : '#f56c6c'"
						><Warning
					/></el-icon>
					<span class="text-lg ml8">
						{{ status ? '启用' : '停用' }}
					</span>
				</div>
				<div class="text-lg ml30">
					<div>{{ status ? '' : '停用后不再允许被SKU/SPU引用' }}</div>
					<div>
						确定{{ status ? '启用' : '停用' }}{{ currentRow?.brandName }}[{{
							currentRow?.brandCode
						}}]吗?
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
		<BrandDialog
			v-model="visible"
			:title="title"
			@close-dialog="closeDialog"
			:visibleType="visibleType"
			:currentRow="currentRow"
		></BrandDialog>
		<!-- 日志 -->
		<LogDialog
			v-model="logVisible"
			:id="currentRow.id"
			:bizType="['PRODUCT_BRAND']"
			@close-dialog="logVisible = false"
		/>
	</div>
</template>

<script lang="ts" name="productBrand" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import {
	getBrandList,
	getBrandExportPart,
	postBrandDisable,
	postBrandEnable,
} from '/@/api/product/brand';
import { useMessage } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { Warning } from '@element-plus/icons-vue';
import { auth } from '/@/utils/authFunction';
// 引入组件
const BrandDialog = defineAsyncComponent(
	() => import('./components/brand-dialog.vue')
);
const ToolBar = defineAsyncComponent(
	() => import('/@/components/ToolBar/tool-bar.vue')
);
const LogDialog = defineAsyncComponent(
	() => import('/@/components/log/log-dialog.vue')
);
const { t } = useI18n();

// table hook
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		statusBoole: '', // 是否展示停用品牌
		status: 1, // 默认只展示启用品牌
	},
	pageList: getBrandList,
	descs: ['create_time'],
	ascs: [],
});

// 强制重新渲染组件的状态
const renderComponent = ref(true);
const tableRef = ref(null);
//  table hook
const {
	getDataList,
	currentChangeHandle,
	sortChangeHandle,
	sizeChangeHandle,
	resetTableQuery,
	tableStyle,
} = useTable(state, tableRef);
// 弹窗
const visible = ref(false);
const title = ref('添加品牌');
const visibleType = ref('');
// 二次确认弹窗
const status = ref<Boolean>(false);
const statusVisible = ref(false);
// 日志弹窗
const logVisible = ref(false);
// 当前点击的行
const currentRow = ref<any>({
	id: '',
	brandCode: '',
	brandName: '',
});

// 强制重新渲染方法
const forceRerender = async () => {
	renderComponent.value = false;
	await new Promise((resolve) => setTimeout(resolve, 100));
	renderComponent.value = true;
};

// 页面从缓存恢复时，强制重新渲染
onActivated(() => {
	forceRerender();
});

// 页面创建时初始化
onMounted(() => {
	getDataList();
});

// 打开品牌弹窗
const openDialog = (type: string, row?: any) => {
	if (type === 'add') {
		// 添加操作
		title.value = '添加品牌';
	} else if (type === 'edit' && row) {
		// 编辑操作
		currentRow.value = row;
		title.value = '编辑品牌';
	} else if (type === 'view' && row) {
		// 查看操作
		currentRow.value = row;
		title.value = '查看品牌';
	} else if (type === 'log' && row) {
		// 查看日志
		currentRow.value = row;
		logVisible.value = true;
		title.value = '品牌日志';
		return;
	}
	visible.value = true;
	// 设置弹窗类型
	visibleType.value = type;
};

// 关闭品牌弹窗
const closeDialog = () => {
	visible.value = false;
	getDataList();
};

// 品牌状态修改,二次确认弹窗
const statusChange = (type: Boolean, row: any) => {
	// 设置当前行
	currentRow.value = row;
	status.value = type;
	statusVisible.value = true;
};
// 修改品牌状态
const changeStatus = async () => {
	// 关闭弹窗
	statusVisible.value = false;
	try {
		// 调用接口修改状态
		if (status.value) {
			// 启用操作
			await postBrandEnable({ id: currentRow.value?.id });
		} else {
			// 停用操作
			await postBrandDisable({ id: currentRow.value?.id });
		}
		getDataList();
	} catch (error) {
		useMessage().error('修改状态失败，请稍后再试');
	}
};
// 获取品牌导出部分
// 导出类目
const exportPartFn = async () => {
	try {
		// 显示加载状态
		state.loading = true;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await getBrandExportPart({
			...state.queryForm,
			ascs: state?.ascs,
			descs: state?.descs,
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
</script>

<style scoped lang="scss">
:deep(.el-overlay .el-overlay-dialog .el-dialog) {
	&.status-header {
		.el-dialog__header {
			padding: 0px;
		}
	}
}

/* 添加简单过渡效果 */
.layout-padding {
	transition: opacity 0.2s ease;
}

/* 表格加载过渡 */
:deep(.el-table) {
	transition: all 0.3s ease-in-out;
}
</style>
