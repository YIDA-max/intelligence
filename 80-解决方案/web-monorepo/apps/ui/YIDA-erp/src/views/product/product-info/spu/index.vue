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
							placeholder="SPU状态"
							clearable
							style="width: 220px"
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
						<div
							class="flex items-center"
							:style="{
								width: '220px',
							}"
						>
							<TreeSelectInput
								v-model:queryForm="state.queryForm"
								:style="{ width: '220px' }"
								:settings="{
									getTreeData: getCategoryTree,
									text: '类目',
									width: '220px',
									searchFn: getDataList,
									code: 'categoryCodes',
									selectTreeProps: {
										value: 'id',
										label: 'name',
										children: 'children',
									},
									getIdsCode: 'id',
								}"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="brand"
							:settings="{
								text: '品牌',
								code: 'brandCodes',
								searchFn: getDataList,
							}"
						/>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="userList"
							:settings="{
								text: '产品负责人',
								code: 'productManageIds',
								searchFn: getDataList,
								getTreeDataParams: {
									lockFlag: 0,
								},
							}"
						/>
					</el-form-item>
					<el-form-item>
						<el-select
							v-model="state.queryForm.productType"
							placeholder="产品类型"
							clearable
							style="width: 150px"
							@change="getDataList"
						>
							<el-option
								v-for="item in productTypeOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
					<el-form-item>
						<div
							class="flex items-center"
							:style="{
								width: '220px',
							}"
						>
							<el-select
								v-model="state.queryForm.grade"
								placeholder="产品等级"
								clearable
								style="width: 220px"
								@change="getDataList"
							>
								<el-option
									v-for="item in dictMap.productGrade"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</div>
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
								:style="{ width: '220px' }"
								:placeholder="`请选择${
									createdIsUpdate === 'createTime'
										? '创建开始时间'
										: '更新开始时间'
								}`"
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
								:placeholder="`请选择${
									createdIsUpdate === 'createTime'
										? '创建结束时间'
										: '更新结束时间'
								}`"
								value-format="YYYY-MM-DD"
								@blur="
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
										label: 'SPU',
										value: 'spuCodes',
									},
									{
										label: '父产品名称',
										value: 'spuNames',
									},
									{
										label: 'SKU',
										value: 'skuCodes',
									},
									{
										label: '产品名称',
										value: 'skuNames ',
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
			<BaseTable
				ref="baseTableRef"
				:register="register"
				:rowConfig="{ keyField: 'id', height: 100 }"
			>
				<template #left-tool>
					<el-button
						class="ml10"
						type="primary"
						@click="openDialog('add')"
						v-auth="'spu_add'"
					>
						{{ $t('添加SPU') }}
					</el-button>
					<el-button
						class="ml10"
						@click="importDialogRef.show()"
						v-auth="'spu_import'"
					>
						{{ $t('导入') }}
					</el-button>
				</template>

				<template #expand="{ row: tableRow }">
					<el-table
						:data="tableRow.productSkus"
						class="no-header"
						native-scrollbar
					>
						<el-table-column align="center" width="60" />
						<el-table-column
							align="center"
							type="selection"
							width="40"
							:reserve-selection="true"
						/>
						<el-table-column :label="t('图片')" type="imgUrl" width="100">
							<template #default="{ row: skuRow }">
								<div class="flex justify-center">
									<img
										v-if="skuRow.imgUrl"
										:src="skuRow.imgUrl"
										alt="图片"
										class="object-cover w-10 h-10 rounded-md"
										@click="
											() => {
												showPreview = true;
												currentRow = skuRow;
											}
										"
									/>
									<span v-else class="text-gray-400">无图片</span>
								</div>
							</template>
						</el-table-column>
						<el-table-column
							:label="t('SPU/父产品名称')"
							width="160"
							show-overflow-tooltip
						>
							<template #default>
								<div
									style="
										display: flex;
										flex-direction: column;
										justify-content: center;
										align-items: flex-start;
										width: 100%;
									"
								>
									<el-row class="ellipsis-text">
										<el-col :span="24" class="flex">
											<span>{{ tableRow.spuCode }}</span>
											<el-link
												class="block ml-2 copy-icon"
												:icon="DocumentCopy"
												@click="copyText(tableRow.spuCode)"
												underline="never"
												v-if="tableRow.spuCode"
											></el-link>
										</el-col>
									</el-row>
									<div
										style="
											max-width: 100%;
											overflow: hidden;
											white-space: nowrap;
											text-overflow: ellipsis;
										"
									>
										<el-row class="ellipsis-text">
											<el-col :span="24" class="flex">
												<span class="font-color ellipsis-text">
													{{ tableRow.spuName }}</span
												>
												<el-link
													class="block ml-2 copy-icon"
													:icon="DocumentCopy"
													@click="copyText(tableRow.spuName)"
													underline="never"
													v-if="tableRow.spuName"
												></el-link>
											</el-col>
										</el-row>
									</div>
								</div>
							</template>
						</el-table-column>
						<el-table-column
							prop="productSkus"
							:label="t('SKU/产品名称')"
							width="160"
						>
							<template #default="{ row }">
								<div
									:style="{
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'center',
										alignItems: 'flex-start',
										width: '100%',
									}"
								>
									<el-row class="ellipsis-text">
										<el-col :span="24" class="flex">
											<el-link
												type="primary"
												@click="openDialog('skuView', row)"
												>{{ row?.skuCode }}</el-link
											>
											<el-link
												class="block ml-2 copy-icon"
												:icon="DocumentCopy"
												@click="copyText(row.skuCode)"
												underline="never"
												v-if="row.skuCode"
											></el-link>
										</el-col>
									</el-row>

									<el-row class="ellipsis-text">
										<el-col :span="24" class="flex">
											<span class="font-color ellipsis-text">
												{{ row.skuName }}</span
											>
											<el-link
												class="block ml-2 copy-icon"
												:icon="DocumentCopy"
												@click="copyText(row.skuName)"
												underline="never"
												v-if="row.skuName"
											></el-link>
										</el-col>
									</el-row>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="categoryCode" :label="t('类目')">
							<template #default="{ row }">
								<div>{{ row.categoryName ? row.categoryName : '---' }}</div>
							</template>
						</el-table-column>
						<el-table-column prop="brandCode" :label="t('品牌')">
							<template #default="{ row }">
								<div>{{ row.brandName ? row.brandName : '---' }}</div>
							</template>
						</el-table-column>
						<el-table-column
							prop="productTypeText"
							:label="t('产品类型')"
							width="100"
						/>
						<el-table-column
							prop="gradeText"
							:label="t('产品等级')"
							width="100"
						>
						</el-table-column>
						<el-table-column
							prop="productManageName"
							:label="t('产品负责人')"
							width="120"
						/>
						<el-table-column :label="t('状态')">
							<template #default> --- </template>
						</el-table-column>
						<el-table-column prop="createName" :label="t('创建人')" />
						<el-table-column
							prop="createTime"
							:label="t('创建时间')"
							width="180"
						/>
						<el-table-column
							prop="updateTime"
							:label="t('更新时间')"
							width="180"
						/>
						<el-table-column
							:label="$t('common.action')"
							width="150"
							fixed="right"
						>
							<template #default> --- </template>
						</el-table-column>
					</el-table>
				</template>

				<template #imgUrl="{ row }">
					<MrImg :src="row.imgUrl" />
				</template>

				<template #spuCode="{ row }">
					<div
						style="
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: flex-start;
							width: 100%;
						"
					>
						<el-row class="ellipsis-text">
							<el-col :span="24" class="flex">
								<span>{{ row.spuCode }}</span>
								<el-link
									class="block ml-2 copy-icon"
									:icon="DocumentCopy"
									@click="copyText(row.spuCode)"
									underline="never"
									v-if="row.spuCode"
								></el-link>
							</el-col>
						</el-row>
						<div
							style="
								max-width: 100%;
								overflow: hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
							"
						>
							<el-row class="ellipsis-text">
								<el-col :span="24" class="flex">
									<span class="font-color ellipsis-text">
										{{ row.spuName }}</span
									>
									<el-link
										class="block ml-2 copy-icon"
										:icon="DocumentCopy"
										@click="copyText(row.spuName)"
										underline="never"
										v-if="row.spuName"
									></el-link>
								</el-col>
							</el-row>
						</div>
					</div>
				</template>

				<template #skuCode="{ row }">
					<div
						:style="{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'flex-start',
							width: '100%',
						}"
					>
						<el-row class="ellipsis-text">
							<el-col :span="24" class="flex">
								<el-link type="primary" @click="openDialog('skuView', row)">{{
									row?.skuCode
								}}</el-link>
								<el-link
									class="block ml-2 copy-icon"
									:icon="DocumentCopy"
									@click="copyText(row.skuCode)"
									underline="never"
									v-if="row.skuCode"
								></el-link>
							</el-col>
						</el-row>

						<el-row class="ellipsis-text">
							<el-col :span="24" class="flex">
								<span class="font-color ellipsis-text"> {{ row.skuName }}</span>
								<el-link
									class="block ml-2 copy-icon"
									:icon="DocumentCopy"
									@click="copyText(row.skuName)"
									underline="never"
									v-if="row.skuName"
								></el-link>
							</el-col>
						</el-row>
					</div>
				</template>

				<template #categoryCode="{ row }">
					<div>{{ row.categoryName ? row.categoryName : '---' }}</div>
				</template>

				<template #brandCode="{ row }">
					<div>{{ row.brandName ? row.brandName : '---' }}</div>
				</template>

				<template #productTypeText>
					<div>{{ '---' }}</div>
				</template>

				<template #gradeText>
					<div>---</div>
				</template>

				<template #status="{ row }">
					<el-switch
						:modelValue="!!row.status"
						size="small"
						v-if="!row.isNoSwicth"
						@change="
							(e: any) => {
								statusChange(e, row);
							}
						"
						:disabled="
							row.status === 1 || row.status === '1'
								? !auth('spu_stop')
								: !auth('spu_start')
						"
					></el-switch>
				</template>

				<template #action="{ row }">
					<div class="flex items-center">
						<el-button
							text
							type="primary"
							class="mr20"
							@click="openDialog('view', row)"
							>{{ $t('详情') }}
						</el-button>
						<el-dropdown @command="(type:any) => handleCommand(type, row)">
							<span class="el-dropdown-link">
								操作
								<el-icon class="el-icon--right">
									<arrow-down />
								</el-icon>
							</span>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item command="edit">编辑</el-dropdown-item>
									<el-dropdown-item command="copy">复制</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</div>
				</template>
			</BaseTable>
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
					<div>
						确定{{ status ? '启用' : '停用' }}{{ currentRow?.spuCode }}[{{
							currentRow?.spuName
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
		<FormDialog
			v-model="visible"
			:currentRow="currentRow"
			:visibleType="visibleType"
			:title="title"
			@closeDialog="closeDialog"
			@changeCopy="changeCopy"
			@changeEdit="changeEdit"
		></FormDialog>
		<FormDialogSku
			v-model="visibleSku"
			:currentRow="currentRow"
			:dictMap="dictMap"
			:visibleType="'spuView'"
			:title="'查看SKU'"
			@closeDialog="
				() => {
					visibleSku = false;
				}
			"
		/>
		<ImportDialog
			ref="importDialogRef"
			title="导入SPU"
			templateUrl="/files/import-template/导入SPU模版.xlsx"
			excelUploadApi="/product/spu/importSpu"
			@refreshDataList="getDataList"
		/>
		<Preview v-model="showPreview" :url="currentRow?.imgUrl" type="image" />
	</div>
</template>

<script lang="ts" setup>
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { columns } from './config';
import { DocumentCopy } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import {
	getSpuList,
	enableSpu,
	disableSpu,
	getSpuDetailsById,
	getExportSpu,
} from '/@/api/product/spu';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { defineAsyncComponent, ref, reactive } from 'vue';
import { onMounted } from 'vue';
import { useMessage } from '/@/hooks/message';
import { getDicts } from '/@/api/admin/dict';
import { getCategoryTree } from '/@/api/product/category';
import { getSkuDetailInfo } from '/@/api/product/sku';
import { auth } from '/@/utils/authFunction';
import commonFunction from '/@/utils/commonFunction';

const FormDialog = defineAsyncComponent(
	() => import('./components/form-dialog/form-dialog.vue')
);
const FormDialogSku = defineAsyncComponent(
	() => import('../sku/components/form-dialog/form-dialog.vue')
);
const TreeSelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/tree-select-input.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);
const Preview = defineAsyncComponent(
	() => import('/@/components/Material/preview.vue')
);

const { t } = useI18n();
const queryRef = ref();
const showSearch = ref(true);
const selectObjs = ref<any[]>([]);
const baseTableRef = ref();
const importDialogRef = ref();
const timeRange = ref([null, null]);
const createdIsUpdate = ref('createTime');
const currentRow = ref<any>({
	id: '',
});
const visible = ref(false);
const visibleSku = ref(false);
const showPreview = ref(false);
const visibleType = ref('');
const title = ref('添加SKU');

const { dictMap } = useMultipleDicts(
	[
		{
			key: 'productGrade',
			fetchFn: getDicts,
			params: 'product_grade',
		},
	],
	{
		isAuto: true,
		tableRef: baseTableRef,
	}
);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		status: 1,
		categoryCodes: [],
	},
	pageList: getSpuList,
	columns,
	descs: ['create_time'],
	ascs: [],
	toolBarConfig: {
		handleRefresh: () => getDataList(),
		handleExport: () => exportPartFn(),
		isShowExport: auth('spu_export'),
		// settingKey: 'spu_index',
	},
});

const { register, getDataList, resetTableQuery } = useTable(
	state,
	baseTableRef
);

const productTypeOptions = ref<Array<any>>([]);

onMounted(async () => {
	try {
		const res = await getDicts('product_type');
		if (res.code === 0) {
			productTypeOptions.value = res.data.map((item: any) => ({
				value: item.value,
				label: item.label,
			}));
		}
	} catch (error) {
		// console.error('获取产品类型失败:', error);
	}
});

const { copyText } = commonFunction();

const changeCreatedIsUpdate = () => {
	timeRange.value = [null, null];
};

const blurTimeRange = () => {
	if (createdIsUpdate.value === 'createTime') {
		state.queryForm.createTimeStart = timeRange.value[0];
		state.queryForm.createTimeEnd = timeRange.value[1];
	} else if (createdIsUpdate.value === 'updateTime') {
		state.queryForm.updateTimeStart = timeRange.value[0];
		state.queryForm.updateTimeEnd = timeRange.value[1];
	}
	getDataList();
};

const resetQuery = () => {
	resetTableQuery(() => {
		timeRange.value = [null, null];
		return {
			queryForm: {
				current: 1,
				size: 10,
				status: 1,
			},
			descs: ['create_time'],
			ascs: [],
		};
	});
};

const syncSelectedRows = () => {
	const rows = register.safeCallTableMethod('getCheckboxRecords') || [];
	selectObjs.value = rows.map(({ id }: { id: string }) => id);
};

const exportPartFn = async () => {
	try {
		syncSelectedRows();
		state.loading = true;
		await getExportSpu({
			...state.queryForm,
			ascs: state?.ascs,
			descs: state?.descs,
			ids: selectObjs.value || [],
			current: 1,
			size: 10000,
		});
	} catch (error) {
		useMessage().error(t(error as string));
	} finally {
		state.loading = false;
	}
};

const openDialog = async (type: string, row?: any) => {
	if (type === 'add') {
		title.value = '添加SPU';
		currentRow.value = {
			id: '',
		};
	} else if (type === 'edit' && row) {
		const res = await getSpuDetailsById({
			id: row.id,
		});
		if (res.code === 0) {
			currentRow.value = res.data;
		}
		title.value = '编辑SPU';
	} else if (type === 'view' && row) {
		const res = await getSpuDetailsById({
			id: row.id,
		});
		if (res.code === 0) {
			currentRow.value = res.data;
		}
		title.value = 'SPU详情';
	} else if (type === 'copy' && row) {
		const res = await getSpuDetailsById({
			id: row.id,
		});
		if (res.code === 0) {
			currentRow.value = res.data;
		}
		title.value = '复制SPU';
	} else if (type === 'skuView' && row) {
		const res = await getSkuDetailInfo({
			id: row.id,
		});
		if (res.code === 0) {
			currentRow.value = res.data;
		}
		visibleSku.value = true;
		return;
	}
	visible.value = true;
	visibleType.value = type;
};

const closeDialog = () => {
	visible.value = false;
	getDataList();
};

const status = ref<Boolean>(false);
const statusVisible = ref(false);

const statusChange = (type: Boolean, row: any) => {
	status.value = type;
	statusVisible.value = true;
	currentRow.value = row;
};

const changeStatus = async () => {
	statusVisible.value = false;
	if (status.value) {
		await enableSpu({ id: currentRow.value?.id });
		getDataList();
	} else {
		await disableSpu({ id: currentRow.value?.id });
		getDataList();
	}
};

const handleCommand = (type: any, row: any) => {
	switch (type) {
		case 'edit':
			openDialog('edit', row);
			break;
		case 'copy':
			openDialog('copy', row);
			break;
		default:
			break;
	}
};

const changeCopy = async (row: { id: string }) => {
	visible.value = false;
	await new Promise((resolve) => setTimeout(resolve, 100));
	openDialog('copy', row);
};

const changeEdit = async (row: { id: string }) => {
	visible.value = false;
	await new Promise((resolve) => setTimeout(resolve, 100));
	openDialog('edit', row);
};
</script>
<style lang="scss" scoped>
.el-dropdown-link {
	cursor: pointer;
	color: var(--el-color-primary);
	display: flex;
	align-items: center;
}
.no-header :deep(thead) {
	display: none;
}
.ellipsis-text {
	max-width: 100%;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.copy-icon {
	display: none;
}
.hover-row {
	.copy-icon {
		display: block;
	}
}
</style>
