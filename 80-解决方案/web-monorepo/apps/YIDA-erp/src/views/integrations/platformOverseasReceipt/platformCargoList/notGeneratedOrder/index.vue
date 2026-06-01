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
							/>
						</el-form-item>
					</template>
				</AdvancedSearchStyle>
			</el-form>
		</el-row>
		<BaseTable :register="register" ref="baseTableRef">
			<template #left-tool>
				<el-button
					type="primary"
					class="ml10"
					v-auth="`${moduleKey}_generate`"
					@click="generateKdBill"
					>{{ $t('生成金蝶单据') }}
				</el-button>
				<!-- <el-button
					type="primary"
					class="ml10"
					v-auth="`${moduleKey}_cancelGenerate`"
					@click="cancelGenerateKdBill"
					>{{ $t('中止生成中的金蝶单据') }}
				</el-button> -->
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
import { getGroupStoreByPlatform } from '/@/api/base/store/index';
import { useResultDialog } from '/@/hooks/useResultDialog';
import { getWareHouseList } from '/@/api/materialFlow/track/index';

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

import { confirmGenerateKdBill } from '/@/views/integrations/components/indexConfig';

// table的引用
const baseTableRef = ref();
const { t } = useI18n();
const emit = defineEmits(['refresh-failed-count']);

// 搜索变量
const queryRef = ref();
// 是否显示搜索
const showSearch = ref(true);
// 高级搜索布局的引用
const AdvancedSearchStyleRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: { billStatus: 0 },
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
	descsDefault: ['create_time'],
	descs: ['create_time'],
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
		billStatus: 0,
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
	loadStoreData();
	loadWarehouseData();
});

// 站点数据
const storeData = ref<Array<any>>([]);
// 站点选择相关
const loadStoreData = async () => {
	try {
		const res = await getGroupStoreByPlatform({});
		storeData.value = res.data.map((item: any) => ({
			id: item.siteCode,
			name: item.siteCode,
			children: item.stores.map((val: any) => ({
				id: val.id,
				name: val.storeName,
			})),
		}));
	} catch (error) {
		storeData.value = [];
	}
};
// 仓库数据
const warehouseData = ref<Array<any>>([]);
// 仓库选择相关
const loadWarehouseData = async () => {
	try {
		const res = await getWareHouseList({
			warehouseTypes: [2],
		});
		warehouseData.value = res.data.map((item: any) => ({
			id: item.warehouseType,
			name: item.warehouseTypeText,
			children: item.warehouses.map((val: any) => ({
				id: val.id,
				name: val.warehouseName,
			})),
		}));
	} catch (error) {
		warehouseData.value = [];
	}
};

const generateKdBill = async () => {
	try {
		let selectedIds = register?.getSelectedIds() || [];

		await confirmGenerateKdBill(selectedIds);

		register.state.loading = true;

		const res = await listApi.generateList({
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

// 暂时不做
// const cancelGenerateKdBill = async () => {
// 	try {
// 		const selectedIds = register?.getSelectedIds() || [];
// 		if (selectedIds.length === 0) {
// 			useMessage().warning('请选择要中止生成金蝶单据的订单');
// 			return;
// 		}
// 		ElMessageBox.confirm(
// 			`确认要为选中的${selectedIds.length}条记录中止生成金蝶单据吗？`,
// 			'中止生成金蝶单据',
// 			{
// 				confirmButtonText: '确定',
// 				cancelButtonText: '取消',
// 				type: 'warning',
// 			}
// 		).then(async () => {
// 			const res = await cancelGenerateKingdeeBill({
// 				ids: selectedIds,
// 			});
// 			if (res.code === 0) {
// 				if (res.data?.failCount > 0) {
// 					// 展示错误提示
// 					open({
// 						title: t('中止生成金蝶单据'),
// 						data: res.data,
// 					});
// 				} else if (res.data?.failCount === 0) {
// 					useMessage().success('操作成功');
// 				}
// 				register?.getDataList();
// 			} else {
// 				useMessage().error(res.msg || '');
// 				return;
// 			}
// 		});
// 	} catch (error: any) {
// 		useMessage().error(error?.msg || t('错误'));
// 	}
// };
</script>

<style lang="scss" scoped></style>
