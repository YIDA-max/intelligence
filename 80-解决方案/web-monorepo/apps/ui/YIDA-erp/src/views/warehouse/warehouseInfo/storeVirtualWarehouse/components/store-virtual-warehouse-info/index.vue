<template>
	<div class="layout-padding-auto layout-padding-view">
		<el-row class="ml10" v-show="showSearch">
			<el-form
				:inline="true"
				:model="state.queryForm"
				@keyup.enter="getDataList"
				ref="queryRef"
			>
				<el-form-item>
					<SelectInputApi
						v-model="state.queryForm.platformChannelCode"
						componentType="dicts"
						placeholder="平台"
						@change="changeSpId()"
						:settings="{
							getTreeDataParams: 'platform_channel',
						}"
						:getDataList="getDataList"
					/>
				</el-form-item>
				<el-form-item>
					<custom-cascader
						v-model:queryForm="state.queryForm"
						:data="storeData"
						:settings="{
							code: 'storeIds',
							text: '站点/店铺',
							width: '190px',
							props: {
								value: 'id',
								label: 'name',
								children: 'children',
							},
							checkStrictly: false,
							showSelectAll: false,
						}"
						@change="getDataList"
					/>
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
			<ToolBar @handleRefresh="resetQuery" :is-show-export="false">
				<template #left-tool> </template>
			</ToolBar>
		</el-row>
		<el-table
			:data="state.dataList"
			@sort-change="sortChangeHandle"
			style="width: 100%"
			v-loading="state.loading"
			border
			ref="tableRef"
			:cell-style="tableStyle.cellStyle"
			:header-cell-style="tableStyle.headerCellStyle"
			native-scrollbar
		>
			<el-table-column align="center" type="selection" width="40" />
			<el-table-column
				prop="platformChannelCode"
				:label="t('平台渠道')"
				show-overflow-tooltip
				min-width="150"
			>
			</el-table-column>
			<el-table-column
				prop="warehouseName"
				:label="t('仓库名称')"
				show-overflow-tooltip
				min-width="120"
			/>
			<el-table-column
				prop="storeName"
				:label="t('店铺/站点')"
				show-overflow-tooltip
				min-width="120"
			>
				<template #default="{ row }">
					{{ row.storeName }}:{{ row.siteCode }}
				</template>
			</el-table-column>
			<el-table-column
				prop="accountingLegalPersonName"
				:label="t('核算主体')"
				show-overflow-tooltip
				min-width="120"
			/>
			<el-table-column
				prop="createTime"
				:label="t('创建时间')"
				show-overflow-tooltip
				min-width="180"
			/>
			<el-table-column
				prop="createName"
				:label="t('创建人')"
				show-overflow-tooltip
				min-width="180"
			/>
		</el-table>
		<pagination
			@current-change="currentChangeHandle"
			@size-change="sizeChangeHandle"
			v-bind="state.pagination"
		/>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive, watch } from 'vue';
import { getDicts } from '/@/api/admin/dict';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { getWarehouseInfoStoreList } from '/@/api/warehouse/storeVirtualWarehouse/index';
import { getGroupStoreByPlatform } from '/@/api/base/store/index';

const CustomCascader = defineAsyncComponent(
	() => import('/@/components/TreeSelectInput/custom-cascader.vue')
);
const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);
const ToolBar = defineAsyncComponent(
	() => import('/@/components/ToolBar/tool-bar.vue')
);

const props = defineProps({
	// 设置单选框的值
	setRadioValue: {
		type: Function,
		required: true,
		default: () => {},
	},
	// 清空服务商信息
	clearSpInfo: {
		type: Function,
		required: true,
		default: () => {},
	},
	// 当前选中的服务商信息
	currentSpInfo: {
		type: Object,
		required: true,
		default: () => {},
	},
	// 设置服务商信息
	setSpInfo: {
		type: Function,
		required: true,
		default: () => {},
	},
});
const { t } = useI18n();
// 搜索变量
const queryRef = ref();
// table的引用
const tableRef = ref();
// 是否显示搜索
const showSearch = ref(true);

//   初始化数据
const { dictMap, reload } = useMultipleDicts(
	[
		{
			key: 'platformChannel',
			fetchFn: getDicts,
			params: 'platform_channel',
		}, // 平台 渠道
	],
	{
		isAuto: true,
		tableRef,
	}
);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		status: 1,
	},
	pageList: getWarehouseInfoStoreList,
	loading: false,
	dataList: [],
	descs: ['create_time'],
});

//  table hook
const {
	getDataList,
	currentChangeHandle,
	sizeChangeHandle,
	sortChangeHandle,
	resetTableQuery,
	tableStyle,
} = useTable(state, tableRef);
onMounted(() => {
	// 初始加载仓库数据
	loadStoreData();
});
// 仓库数据
const storeData = ref<Array<any>>([]);
// 仓库选择相关
const loadStoreData = async (platformChannelCode?: string) => {
	try {
		// 平台有值时：只查该平台下站点/店铺
		// 平台无值时：查全部
		const res = await getGroupStoreByPlatform(
			platformChannelCode ? { platformChannelCode } : {}
		);
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
// 监听当前选中的服务商信息
watch(
	() => props.currentSpInfo,
	async (newVal) => {
		// 等待加载完成
		await new Promise((resolve) => setTimeout(resolve, 100));
		if (newVal) {
			if (newVal?.dockCode || newVal?.value) {
				state.queryForm.platformChannelCode = newVal.value;
				// 平台联动站点/店铺下拉
				await loadStoreData(state.queryForm.platformChannelCode);
				// 刷新
				getDataList();
			}
		}
	},
	{ immediate: true }
);

// 服务器切换查询
const changeSpId = async () => {
	if (state.queryForm.platformChannelCode) {
		// 平台联动站点/店铺下拉
		await loadStoreData(state.queryForm.platformChannelCode);
		// 刷新数据
		getDataList();
		// 设置父组件的服务商信息
		props.setSpInfo(
			state.queryForm.platformChannelCode
				? dictMap.value.platformChannel.find(
						(item) => item.value === state.queryForm.platformChannelCode
				  )
				: {}
		);
	} else {
		// 清空服务商信息
		props.clearSpInfo();
		// 平台清空时展示全部站点/店铺
		await loadStoreData();
		// 清空查询条件
		getDataList();
	}
};

// 重置
// 清空搜索条件
const resetQuery = () => {
	resetTableQuery(() => {
		return {
			queryForm: {
				current: 1,
				size: 10,
				status: 1, // 默认启用
			},
			descs: ['create_time'],
			ascs: [],
		};
	});
};

// 查询所有的数据
const resetData = () => {
	// 查询获取所有的服务商信息
	reload();
	// 重新获取数据
	getDataList();
};
// 暴露给父组件的方法
defineExpose({
	resetData,
});
</script>

<style lang="scss" scoped>
.text-blue {
	color: #0089ef;
}
.el-dropdown-link {
	cursor: pointer;
	color: var(--el-color-primary);
	display: flex;
	align-items: center;
}
</style>
