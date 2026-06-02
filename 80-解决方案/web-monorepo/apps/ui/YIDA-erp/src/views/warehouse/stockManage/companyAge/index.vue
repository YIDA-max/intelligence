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
									:ref="
										item.component === 'SelectDate'
											? setSelectDateRef
											: undefined
									"
									v-model:queryForm="register.state.queryForm"
									v-bind="item.props"
									:searchFn="register?.getDataList"
									:getDataList="register?.getDataList"
								/>
							</el-form-item>

							<el-form-item>
								<el-select
									collapse-tags
									:max-collapse-tags="1"
									clearable
									filterable
									multiple
									@change="register?.getDataList"
									v-model="state.queryForm.types"
									placeholder="库龄段"
									style="width: 200px"
								>
									<el-option
										v-for="item in [
											{ id: 1, label: '0-30天', value: '1' },
											{ id: 2, label: '31-60天', value: '2' },
											{ id: 3, label: '61-90天', value: '3' },
											{ id: 4, label: '91-180天', value: '4' },
											{ id: 5, label: '181-365天', value: '5' },
											{ id: 6, label: '365+天', value: '6' },
										]"
										:key="item.id"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
							<el-form-item>
								<div class="flex items-center">
									<el-date-picker
										v-model="state.queryForm.reportDate"
										type="date"
										:style="{ width: '220px' }"
										:placeholder="`请选择报表日期`"
										value-format="YYYY-MM-DD"
										@change="
											() => {
												register?.getDataList();
											}
										"
									></el-date-picker>
								</div>
							</el-form-item>
						</template>
					</AdvancedSearchStyle>
				</el-form>
			</el-row>

			<BaseTable
				ref="baseTableRef"
				:register="register"
				:tableAttrs="tableAttrs"
			>
				<template #invAge0To30Days="{ row }">
					<AvailableQtyDialog
						:display-value="row.invAge0To30Days"
						:row-id="row.id"
						:quanity-type="[1]"
					/>
				</template>
				<template #invAge31To60Days="{ row }">
					<AvailableQtyDialog
						:display-value="row.invAge31To60Days"
						:row-id="row.id"
						:quanity-type="[2]"
					/>
				</template>
				<template #invAge61To90Days="{ row }">
					<AvailableQtyDialog
						:display-value="row.invAge61To90Days"
						:row-id="row.id"
						:quanity-type="[3]"
					/>
				</template>
				<template #invAge91To180Days="{ row }">
					<AvailableQtyDialog
						:display-value="row.invAge91To180Days"
						:row-id="row.id"
						:quanity-type="[4]"
					/>
				</template>
				<template #invAge181To365Days="{ row }">
					<AvailableQtyDialog
						:display-value="row.invAge181To365Days"
						:row-id="row.id"
						:quanity-type="[5]"
					/>
				</template>
				<template #invAge365PlusDays="{ row }">
					<AvailableQtyDialog
						:display-value="row.invAge365PlusDays"
						:row-id="row.id"
						:quanity-type="[6]"
					/>
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
import { defineAsyncComponent, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMessage } from '/@/hooks/message';
import { auth } from '/@/utils/authFunction';

import { columns, listApi, moduleKey, searchConfig } from './config/index';
const { t } = useI18n();
const message = useMessage();

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
const AvailableQtyDialog = defineAsyncComponent(
	() => import('./components/AvailableQtyDialog.vue')
);

const baseTableRef = ref();
const queryRef = ref();
const AdvancedSearchStyleRef = ref();
const showSearch = ref(true);

// SelectDate 组件实例
const selectDateRef = ref<any>(null);

// 设置 SelectDate 组件 ref
const setSelectDateRef = (el: any) => {
	if (el) {
		selectDateRef.value = el;
	}
};

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		// 默认当天日期
		reportDate: new Date().toISOString().slice(0, 10),
	}, // SelectDate 组件会在 setup 阶段自动初始化
	pageList: listApi.getList,
	columns: [...columns],
	toolBarConfig: {
		handleRefresh: () => register?.getDataList(),
		handleExport: () => handleExport(),
		isShowExport: auth(`${moduleKey}_export`),
	},
});
const tableAttrs = {
	rowConfig: { keyField: 'id', isHover: true },
	cellConfig: { height: 78 },
	checkboxConfig: {
		reserve: true,
		highlight: true,
		trigger: 'checkbox',
	},
	scrollY: {
		enabled: true,
		gt: 20,
		oSize: 6,
	},
};
const { register } = useTable(state, baseTableRef);

const isInitialized = ref(false);

watch(
	() => state.queryForm.types,
	(newVal: any) => {
		nextTick(() => {
			if (!state.columns) return;

			// 👉 第一次只标记，不处理
			if (!isInitialized.value) {
				isInitialized.value = true;
				return;
			}

			const dynamicFieldsMap: Record<string, string> = {
				'1': 'invAge0To30Days',
				'2': 'invAge31To60Days',
				'3': 'invAge61To90Days',
				'4': 'invAge91To180Days',
				'5': 'invAge181To365Days',
				'6': 'invAge365PlusDays',
			};

			let targetFields: string[] = [];
			if (newVal && (!Array.isArray(newVal) || newVal.length > 0)) {
				const selectedValues = Array.isArray(newVal) ? newVal : [newVal];
				targetFields = selectedValues.map(
					(val) => dynamicFieldsMap[String(val)]
				);
			}

			state.columns.forEach((col: any) => {
				const colField = col.field as string;
				const isDynamicField =
					Object.values(dynamicFieldsMap).includes(colField);

				col.visible =
					!isDynamicField || targetFields.length === 0
						? true
						: targetFields.includes(colField);
			});

			register?.tableRef?.value?.refreshColumn?.();
		});
	},
	{ immediate: true }
);
const componentMap: any = {
	customCascaderApi,
	TreeSelectInputApi,
	SelectInput,
	SelectDate,
};

const resetQuery = () => {
	// 清空所有查询条件（保持对象引用，只删除属性）
	Object.keys(register.state.queryForm).forEach((key) => {
		delete register.state.queryForm[key];
	});

	// 调用 SelectDate 组件的重置方法（恢复默认日期）
	selectDateRef.value?.resetToDefault?.();

	register?.getDataList();
};

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
</script>
