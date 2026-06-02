<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
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
			<BaseTable
				:register="register"
				ref="baseTableRef"
				:rowConfig="{
					keyField: 'id',
				}"
			>
				<template #left-tool>
					<el-button
						type="primary"
						class="ml10"
						v-auth="`${moduleKey}_updata`"
						@click="generateKdBill"
						>{{ $t('更新数据') }}
					</el-button>
				</template>
				<template #expand-expand="{ row }">
					<div
						class="goods-list"
						v-for="value in row.items"
						:key="value.skuCode"
					>
						<el-row :gutter="20">
							<el-col
								v-for="item in goodsListColumnsLeft"
								:key="item.field"
								:span="4"
							>
								<span>{{ item.title }} ：</span>
								<span :class="getDifferenceClass(item, value)">{{
									formatData(item, value)
								}}</span>
							</el-col>
						</el-row>
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
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive, onMounted } from 'vue';
import { useMessage } from '/@/hooks/message';
import { useFormatter } from '/@/hooks/useFormatter';

import {
	columns,
	moduleKey,
	searchConfig,
	listApi,
	goodsListColumnsLeft,
} from './config/index';
import BaseTable from '/@/components/BaseTable/index.vue';
import { ElMessageBox } from 'element-plus';

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

const baseTableRef = ref();
const { t } = useI18n();
const { formatData } = useFormatter();
const queryRef = ref();
const AdvancedSearchStyleRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: { type: 0 },
	pageList: listApi.getList,
	columns,
	toolBarConfig: {
		handleRefresh: () => {
			register?.getDataList();
		},
		handleExport: () => {
			handleExport();
		},
		isShowExport: true,
		settingKey: `${moduleKey}_index`,
	},
	ascs: [],
});
const { register, getDataList } = useTable(state, baseTableRef);

const componentMap: any = {
	customCascaderApi,
	TreeSelectInputApi,
	SelectInput,
	SelectDate,
};

const resetQuery = () => {
	register.state.queryForm = {
		type: 0,
	};
	getDataList();
};

const handleExport = async () => {
	try {
		const selectedIds = register?.getSelectedIds() || [];
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
		register.state.loading = false;
	}
};

onMounted(() => {});

const generateKdBill = async () => {
	try {
		ElMessageBox.confirm('确认要更新货件单数据吗？', '更新数据', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		})
			.then(async () => {
				register.state.loading = true;
				const res = await listApi.updateShipment({
					...register.state.queryForm,
				});
				if (res.code === 0) {
					useMessage().success('更新成功');
					register?.getDataList();
				} else {
					useMessage().error(res.msg || '更新失败');
				}
			})
			.catch(() => {
				// 用户取消操作
			})
			.finally(() => {
				register.state.loading = false;
			});
	} catch (error: any) {
		useMessage().error(error?.msg || t('错误'));
		register.state.loading = false;
	}
};

// 根据差异数量返回对应的样式类
const getDifferenceClass = (item: any, value: any) => {
	// 只对差异数量字段应用样式
	if (item.field === 'differenceQuantityTest') {
		const quantity = value[item.field];
		if (quantity === 0 || quantity === '0') {
			return 'difference-zero'; // 黑色
		} else if (quantity < 0) {
			return 'difference-negative'; // 红色
		} else if (quantity > 0) {
			return 'difference-positive'; // 绿色
		}
	}
	return '';
};
</script>

<style lang="scss" scoped>
@import '/@/views/integrations/components/indexList.scss';

// 差异数量样式
.difference-zero {
	color: #000000; // 黑色
}

.difference-negative {
	color: #f56c6c; // 红色
	font-weight: 500;
}

.difference-positive {
	color: #67c23a; // 绿色
	font-weight: 500;
}
</style>
