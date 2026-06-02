<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row v-show="showSearch">
				<el-form
					:model="state.queryForm"
					ref="queryRef"
					:inline="true"
					@keyup.enter="getDataList"
				>
					<el-form-item :label="t('area.pid')" prop="parentCode">
						<china-area
							:type="3"
							:placeholder="t('area.inputPidByTip')"
							v-model="areaPath"
							:plus="true"
						/>
					</el-form-item>
					<el-form-item :label="t('area.name')" prop="name">
						<el-input
							:placeholder="t('area.inputNameByTip')"
							v-model="state.queryForm.name"
						/>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button icon="Refresh" @click="resetQuery">{{
							$t('common.resetBtn')
						}}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button
						icon="folder-add"
						type="primary"
						class="ml10"
						@click="formDialogRef.openDialog()"
						v-auth="'sys_sysArea_add'"
					>
						{{ $t('common.addBtn') }}
					</el-button>
					<el-button
						plain
						:disabled="multiple"
						icon="Delete"
						type="primary"
						v-auth="'sys_sysArea_del'"
						@click="handleDelete(selectObjs)"
					>
						{{ $t('common.delBtn') }}
					</el-button>
					<right-toolbar
						v-model:showSearch="showSearch"
						:export="'sys_sysArea_export'"
						@exportExcel="exportExcel"
						class="ml10 mr20"
						style="float: right"
						@queryTable="getDataList"
					></right-toolbar>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
				@selection-change="selectionChangHandle"
				@sort-change="sortChangeHandle"
				native-scrollbar
			>
				<el-table-column type="selection" width="40" align="center" />
				<el-table-column type="index" label="#" width="40" />
				<el-table-column
					prop="name"
					:label="t('area.name')"
					show-overflow-tooltip
				/>
				<el-table-column prop="code" :label="t('编码')" show-overflow-tooltip />
				<el-table-column
					prop="areaType"
					:label="t('area.areaType')"
					show-overflow-tooltip
				>
					<template #default="scope">
						<dict-tag
							:options="area_type_dict"
							:value="scope.row.areaType"
						></dict-tag>
					</template>
				</el-table-column>
				<!-- <el-table-column prop="hot" :label="t('area.hot')" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="yes_no_type" :value="scope.row.hot"></dict-tag>
          </template>
        </el-table-column> -->
				<el-table-column prop="status" :label="t('状态')" show-overflow-tooltip>
					<template #default="scope">
						<el-switch
							:modelValue="!!scope.row.status"
							size="small"
							@change="
						(e: any) => {
							statusChange(e, scope);
						}
					"
						></el-switch>
						<!-- <dict-tag :options="yes_no_type" :value="scope.row.status"></dict-tag> -->
					</template>
				</el-table-column>
				<el-table-column
					prop="areaSort"
					:label="t('area.areaSort')"
					width="100"
					sortable="custom"
					show-overflow-tooltip
				/>
				<el-table-column :label="$t('common.action')" width="150">
					<template #default="scope">
						<el-button
							icon="edit-pen"
							text
							type="primary"
							v-auth="'sys_sysArea_edit'"
							@click="formDialogRef.openDialog(scope.row.id)"
							>{{ $t('common.editBtn') }}
						</el-button>
						<el-button
							icon="delete"
							text
							type="primary"
							v-auth="'sys_sysArea_del'"
							@click="handleDelete([scope.row.id])"
							>{{ $t('common.delBtn') }}
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination
				@size-change="sizeChangeHandle"
				@current-change="currentChangeHandle"
				v-bind="state.pagination"
			/>
		</div>

		<!-- 编辑、新增  -->
		<form-dialog ref="formDialogRef" @refresh="getDataList(false)" />
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
						确定{{ status ? '启用' : '停用'
						}}<span class="text-blue">{{ currentRow?.name }}</span
						>吗?
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
	</div>
</template>

<script setup lang="ts" name="systemSysArea">
import { BasicTableProps, useTable } from '/@/hooks/table';
import {
	delObjs,
	fetchList,
	enableSysArea,
	disableSysArea,
} from '/@/api/admin/sysArea';
import { useMessage, useMessageBox } from '/@/hooks/message';
// import {useDict} from '/@/hooks/dict';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 省市区查询组件
const ChinaArea = defineAsyncComponent(
	() => import('/@/components/ChinaArea/index.vue')
);
// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
// 定义查询字典
// const {yes_no_type} = useDict('yes_no_type');
const area_type_dict = [
	{ value: '0', label: '国家' },
	{ value: '1', label: '省份' },
	{ value: '2', label: '城市' },
	{ value: '3', label: '县区' },
	{ value: '4', label: '街道' },
];
// 定义变量内容
const formDialogRef = ref();
// 搜索变量
const queryRef = ref();
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);
const pid = ref();
const areaPath = ref([]); // 绑定 cascader 的数组

watch(areaPath, (val) => {
	state.queryForm.parentCode = val && val.length ? val[val.length - 1] : '';
});

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		code: '',
		name: '',
		parentCode: '',
	},
	ascs: ['code'],
	pageList: fetchList,
});

//  table hook
const {
	getDataList,
	currentChangeHandle,
	sizeChangeHandle,
	sortChangeHandle,
	downBlobFile,
	tableStyle,
} = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	// 清空搜索条件
	queryRef.value?.resetFields();
	pid.value = '';
	// 清空多选
	selectObjs.value = [];
	getDataList();
};

// 导出excel
const exportExcel = () => {
	downBlobFile(
		'/admin/sysArea/export',
		Object.assign(state.queryForm, { ids: selectObjs }),
		'sysArea.xlsx'
	);
};

// 多选事件
const selectionChangHandle = (objs: { id: string }[]) => {
	selectObjs.value = objs.map(({ id }) => id);
	multiple.value = !objs.length;
};

// 当前点击的行
const currentRow = ref({
	id: '',
});
// 状态修改 -- 二次确认
const status = ref<Boolean>(false);

// 状态弹窗
const statusVisible = ref(false);
const statusChange = (type: Boolean, row: any) => {
	status.value = type;
	statusVisible.value = true;
	// 设置当前行
	currentRow.value = row.row;
};

// 修改状态
const changeStatus = async () => {
	// 关闭弹窗
	statusVisible.value = false;
	// 调用接口修改状态
	if (status.value) {
		enableSysArea;
		// 启用操作disableSysArea
		await enableSysArea({ id: currentRow.value?.id });
		getDataList();
	} else {
		// 停用操作
		await disableSysArea({ id: currentRow.value?.id });
		getDataList();
	}
};

// 删除操作
const handleDelete = async (ids: string[]) => {
	try {
		await useMessageBox().confirm(t('common.delConfirmText'));
	} catch {
		return;
	}

	try {
		await delObjs(ids);
		getDataList();
		useMessage().success(t('common.delSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
</script>
