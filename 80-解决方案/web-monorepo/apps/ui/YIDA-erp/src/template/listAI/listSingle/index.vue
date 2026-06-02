<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row v-show="showSearch" class="ml10">
				<el-form
					ref="queryRef"
					:inline="true"
					:model="register.state.queryForm"
					@keyup.enter="register?.getDataList"
				>
					<AdvancedSearchStyle
						ref="AdvancedSearchStyleRef"
						showRightBtn
						@reset="resetQuery"
						@search="register?.getDataList"
					>
						<template #default>
							<el-form-item v-for="(item, index) in searchConfig" :key="index">
								<component
									:is="componentMap[item.component]"
									v-model:queryForm="register.state.queryForm"
									v-bind="item.props"
									:searchFn="register?.getDataList"
									:getDataList="register?.getDataList"
								/>
							</el-form-item>
						</template>
					</AdvancedSearchStyle>
				</el-form>
			</el-row>

			<BaseTable ref="baseTableRef" :register="register">
				<!-- 左侧工具栏 -->
				<template #left-tool>
					<!-- 根据业务需求添加按钮，例如：新增、导入、批量操作等 -->
				</template>

				<!-- 自定义插槽示例 - 根据业务需求添加 -->
				<!-- 链接类型示例 -->
				<!-- <template #fieldName="{ row }">
					<span
						class="text-blue-500 cursor-pointer hover:underline"
						@click="handleClick(row)"
					>
						{{ row.fieldName }}
					</span>
				</template> -->

				<!-- 差异数量颜色显示示例 -->
				<!-- <template #diffQuantity="{ row }">
					<span
						:class="{
							'text-gray-500': row.diffQuantity === 0,
							'text-red-500': row.diffQuantity < 0,
							'text-green-500': row.diffQuantity > 0,
						}"
					>
						{{
							row.diffQuantity === 0
								? row.diffQuantity
								: row.diffQuantity > 0
								? `+${row.diffQuantity}`
								: row.diffQuantity
						}}
					</span>
				</template> -->

				<!-- 操作栏 -->
				<template #action>
					<div class="flex justify-center">
						<!-- 编辑按钮示例 -->
						<!-- <EditOrAdd
							:type="'edit'"
							:row="row"
							v-auth="`${moduleKey}-edit`"
							@getDataList="register?.getDataList"
						/> -->
						<!-- 下拉菜单示例 -->
						<!-- <ActionDropdown
							:row="row"
							:menu-list="actionMenuList"
							@delete="handleDelete"
						/> -->
					</div>
				</template>
			</BaseTable>
		</div>
	</div>
</template>

<script setup lang="ts">
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { defineAsyncComponent, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMessage } from '/@/hooks/message';
import { auth } from '/@/utils/authFunction';

import { columns, listApi, moduleKey, searchConfig } from './config/index';

const { t } = useI18n();
const message = useMessage();

// 动态组件
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const AdvancedSearchStyle = defineAsyncComponent(
	() => import('/@/components/TableFormModule/advanced-search-style.vue')
);
const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const customCascaderApi = defineAsyncComponent(
	() => import('/@/componentsApi/customCascaderApi/index.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
// const EditOrAdd = defineAsyncComponent(
// 	() => import('./components/addOrEdit/index.vue')
// );
// const ActionDropdown = defineAsyncComponent(
// 	() => import('/@/components/ActionDropdown/index.vue')
// );

const baseTableRef = ref();
const queryRef = ref();
const AdvancedSearchStyleRef = ref();
const showSearch = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: listApi.getList,
	columns,
	toolBarConfig: {
		handleRefresh: () => register?.getDataList(),
		handleExport: () => handleExport(),
		isShowExport: auth(`${moduleKey}_export`),
		settingKey: `${moduleKey}_index`,
	},
});

const { register } = useTable(state, baseTableRef);

const componentMap: any = {
	customCascaderApi,
	TreeSelectInputApi,
	SelectInput,
	SelectDate,
};

// 重置查询
const resetQuery = () => {
	register.state.queryForm = {};
	register?.getDataList();
};

// 导出
const handleExport = async () => {
	try {
		const selectedIds = register?.getSelectedIds() || [];
		register.state.loading = true;
		await listApi.exportList({
			...register.state.queryForm,
			ascs: register.state?.ascs,
			descs: register.state?.descs,
			ids: selectedIds || [],
			current: 1,
			size: 10000,
		});
	} catch (error) {
		message.error(t(error as string));
	} finally {
		register.state.loading = false;
	}
};

// 删除示例
// const handleDelete = async (_item: any, row: any) => {
// 	await listApi.deleteItem({ id: row.id });
// 	message.success(t('common.delSuccessText'));
// 	register?.getDataList();
// };
</script>

<style lang="scss" scoped>
.text-blue {
	color: #0089ef;
	word-break: break-all;
	white-space: pre-line;
	cursor: pointer;
	text-align: left;
}
</style>
