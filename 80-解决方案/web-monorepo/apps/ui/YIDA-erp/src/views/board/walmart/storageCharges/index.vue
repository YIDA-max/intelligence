<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form
					:inline="true"
					:model="state.queryForm"
					@keyup.enter="register?.getDataList"
					ref="queryRef"
				>
					<!-- 店铺筛选 -->
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
							@change="register.getDataList"
						/>
					</el-form-item>
					<el-form-item>
						<div class="flex item-center">
							<SelectInput
								v-model:queryForm="state.queryForm"
								:searchTypes="[
									{
										label: '全球贸易项目代码',
										value: 'gtins',
									},
									{
										label: 'Msku',
										value: 'mSkus',
									},
									{
										label: '商品ID',
										value: 'productIds',
									},
								]"
								:settings="{
									selectStyle: {
										width: '130px',
									},
									inputStyle: {
										width: '250px',
									},
								}"
								:getDataList="register?.getDataList"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<el-button @click="register?.getDataList" type="primary"
							>{{ $t('搜索') }}
						</el-button>
						<el-button @click="resetQuery" type="info" plain
							>{{ $t('common.resetBtn') }}
						</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<BaseTable
				:register="register"
				height="600"
				ref="tableRef"
				:columns="columns"
			>
				<template #left-tool>
					<el-button
						@click="importDialogRef.show()"
						v-auth="`storage_import`"
						type="primary"
						class="ml10"
						>{{ $t('导入') }}
					</el-button>
				</template>
				<template #storeInfo="{ row }">
					{{
						row.storeName && row.siteCode
							? `${row.storeName}:${row.siteCode}`
							: row.storeName || row.siteCode || '---'
					}}
				</template>
				<template #skuName="{ row }">
					<SkuTableColumn :row="row" />
				</template>
			</BaseTable>
			<ImportDialog
				ref="importDialogRef"
				title="导入沃尔玛仓储费"
				templateUrl="/files/import-template/沃尔玛仓储费导入模板.xlsx"
				excelUploadApi="/finance/storage-fee/walmart/import"
				:accept="'.xlsx,.xls'"
				@refreshDataList="register?.getDataList"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { columns } from './config';
import { defineAsyncComponent, ref, reactive } from 'vue';
import {
	getExportStorageCharges,
	getStorageChargesPage,
} from '/@/api/board/walmart/storageCharges';
import { getGroupStoreByPlatform } from '/@/api/base/store/index';
// import { getListByCondition as getListByConditionStore } from '/@/api/mcp/collectionPlan/index';
import { useMessage } from '/@/hooks/message';
import { auth } from '/@/utils/authFunction';
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const importDialogRef = ref();

// 搜索变量
const queryRef = ref();
// table的引用
const tableRef = ref();
// 是否显示搜索
const showSearch = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getStorageChargesPage,
	columns,
	toolBarConfig: {
		handleRefresh: () => {
			register?.getDataList();
		},
		handleExport: () => {
			handleExport();
		},
		isShowExport: auth('storage_export'),
		settingKey: 'storageCharges-index',
	},
});

//  table hook
const { register } = useTable(state, tableRef);

// 重置
// 清空搜索条件
const resetQuery = () => {
	register?.resetTableQuery(() => {
		return {
			queryForm: {
				current: 1,
				size: 10,
			},
			ascs: [],
			descs: [],
		};
	});
};

// 导出
const handleExport = async () => {
	try {
		// 显示加载状态
		state.loading = true;
		const ids = register?.getSelectedIds();
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await getExportStorageCharges({
			ids,
			...state.queryForm,
			ascs: state?.ascs,
			descs: state?.descs,
			current: 1,
			size: 10000,
		});
	} catch (error) {
		useMessage().error(`导出失败: ${error}`);
	} finally {
		// 隐藏加载状态
		state.loading = false;
	}
};
onMounted(() => {
	// 初始加载仓库数据
	loadStoreData();
});

// 仓库数据
const storeData = ref<Array<any>>([]);
// 仓库选择相关
const loadStoreData = async () => {
	try {
		const res = await getGroupStoreByPlatform({
			platformChannelCode: 'Walmart',
		});

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
</script>

<style lang="scss" scoped>
.text-blue {
	color: #0089ef;
	word-break: break-all;
	white-space: pre-line;
	cursor: pointer;
	text-align: left;
}

.el-dropdown-link {
	cursor: pointer;
	color: var(--el-color-primary);
	display: flex;
	align-items: center;
}
</style>
