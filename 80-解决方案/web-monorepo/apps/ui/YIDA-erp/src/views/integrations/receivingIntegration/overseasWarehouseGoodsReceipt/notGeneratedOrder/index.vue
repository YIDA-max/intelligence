<template>
	<div>
		<el-row class="ml10" v-show="showSearch">
			<el-form
				:inline="true"
				:model="register.state.queryForm"
				@keyup.enter="getDataList"
				ref="queryRef"
			>
				<AdvancedSearchStyle
					ref="AdvancedSearchStyleRef"
					showRightBtn
					@reset="resetQuery"
					@search="getDataList"
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
		<BaseTable
			:register="register"
			ref="baseTableRef"
			:cell-config="{
				height: 75,
			}"
		>
			<template #left-tool>
				<el-button
					type="primary"
					class="ml10"
					v-auth="`${moduleKey}_generate`"
					@click="generateKdBill"
					>{{ $t('生成金蝶单据') }}
				</el-button>
				<el-button
					type="primary"
					class="ml10"
					v-auth="`${moduleKey}_update`"
					@click="updateIntegratedData"
					>{{ $t('更新集成数据') }}
				</el-button>
			</template>
		</BaseTable>
	</div>
</template>

<script setup lang="ts">
import { auth } from '/@/utils/authFunction';
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive, onMounted } from 'vue';
import { useMessage } from '/@/hooks/message';

import { columns, moduleKey, searchConfig, listApi } from './config/index';
import { ElMessageBox } from 'element-plus';
import { useResultDialog } from '/@/hooks/useResultDialog';
import { confirmGenerateKdBill } from '/@/views/integrations/components/indexConfig';

const { open } = useResultDialog();
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
// table的引用
const baseTableRef = ref();
const { t } = useI18n();
//刷新事件
const emit = defineEmits(['refresh-failed-count']);
// 搜索变量
const queryRef = ref();
// 是否显示搜索
const showSearch = ref(true);
// 高级搜索布局的引用
const AdvancedSearchStyleRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	// 0: 未生成，1: 已生成
	queryForm: { status: 0 },
	pageList: listApi.getList,
	columns,
	toolBarConfig: {
		handleRefresh: () => {
			register?.getDataList();
		},
		handleExport: () => {
			handleExport();
		},
		isShowExport: auth(`${moduleKey}_export`),
		settingKey: `${moduleKey}_index`,
	},
	ascs: [],
	descsDefault: ['integration_data_create_time'],
	// descs: ['create_time'],
});
//  table hook
const { register, getDataList } = useTable(state, baseTableRef);

const componentMap: any = {
	customCascaderApi,
	TreeSelectInputApi,
	SelectInput,
	SelectDate,
};

// 重置
const resetQuery = () => {
	register.state.queryForm = {
		status: 0,
	};
	getDataList();
};

/***
 * 导出
 */
const handleExport = async () => {
	try {
		// 获取选中的行数据
		const selectedIds = register?.getSelectedIds() || [];
		// 显示加载状态
		register.state.loading = true;
		const api = listApi.exportList;
		await api({
			...register.state.queryForm,
			ascs: register.state?.ascs,
			descs: register.state?.descs,
			ids: selectedIds || [],
			current: 1,
			size: 10000,
		});
	} catch (error) {
		useMessage().error(t(error as string));
	} finally {
		// 隐藏加载状态
		register.state.loading = false;
	}
};

onMounted(() => {
	// 初始加载仓库数据
});

const generateKdBill = async () => {
	try {
		let selectedIds = register?.getSelectedIds() || [];

		await confirmGenerateKdBill(selectedIds);

		register.state.loading = true;

		const res: any = await listApi.generateList({
			...register.state.queryForm,
			ascs: register.state?.ascs,
			descs: register.state?.descs,
			ids: selectedIds || [],
			current: 1,
			size: 10000,
		});

		if (res.code === 0) {
			if (res.data?.failCount > 0) {
				open({
					title: t('生成金蝶单据失败'),
					data: res.data,
				});
			} else {
				useMessage().success('操作成功');
			}

			register?.getDataList();
		}
	} catch (error: any) {
		if (error.message !== 'cancelled') {
			useMessage().error(error?.msg || t('错误'));
		}
	} finally {
		emit('refresh-failed-count');
		register.state.loading = false;
	}
};
const updateIntegratedData = async () => {
	try {
		ElMessageBox.confirm(`确认要更新集成数据吗？`, '更新集成数据', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		}).then(async () => {
			const res = await listApi.updateList({});
			if (res.code === 0) {
				if (res.data?.failCount > 0) {
					// 展示错误提示
					open({
						title: t('更新集成数据失败'),
						data: res.data,
					});
				} else if (res.data?.failCount === 0) {
					useMessage().success('操作成功');
				}
				register?.getDataList();
			}
		});
	} catch (error: any) {
		// useMessage().error(error?.msg || t('错误'));
	}
};
</script>

<style lang="scss" scoped>
@import '/@/views/integrations/billDataSync/components/indexList.scss';
</style>
