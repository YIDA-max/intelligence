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
		<BaseTable
			:register="register"
			ref="baseTableRef"
			:cell-config="{
				height: 75,
			}"
		>
			<template #left-tool>
				<el-button
					class="ml10"
					type="primary"
					@click="openDialog('import')"
					v-auth="`${moduleKey}_import`"
				>
					{{ $t('导入订单') }}</el-button
				>
			</template>
			<template #productTitleAsinMsku="{ row }">
				<div class="flex flex-col gap-2 items-start">
					<!-- productName -->
					<template v-if="row.productName">
						<el-tooltip
							v-if="row.productName.length > 30"
							:content="row.productName"
							placement="top"
						>
							<span>{{ row.productName.slice(0, 30) }}...</span>
						</el-tooltip>

						<span v-else>
							{{ row.productName }}
						</span>
					</template>

					<span v-else>---</span>

					<!-- asin + msku -->
					<div class="flex gap-2">
						<span>{{ row.asin || '---' }}</span>

						<template v-if="row.msku">
							<el-tooltip
								v-if="row.msku.length > 10"
								:content="row.msku"
								placement="top"
							>
								<span>{{ row.msku.slice(0, 10) }}...</span>
							</el-tooltip>

							<span v-else>
								{{ row.msku }}
							</span>
						</template>

						<span v-else>---</span>
					</div>
				</div>
			</template>

			<template #skuNameCode="{ row }">
				<div class="flex flex-col items-start w-full">
					<template v-if="row.sku || row.skuName">
						<!-- SKU -->
						<el-row class="ellipsis-text w-full" v-if="row.sku">
							<el-col :span="24" class="flex items-center">
								<span class="mr-1 font-color ellipsis-text">
									{{ row.sku }}
								</span>

								<el-link
									class="ml-2 copy-icon"
									:icon="DocumentCopy"
									@click="copyText(row.sku)"
									underline="never"
								/>
							</el-col>
						</el-row>

						<!-- SKU Name -->
						<el-row class="ellipsis-text w-full" v-if="row.skuName">
							<el-col :span="24" class="flex items-center">
								<span class="mr-1 font-color ellipsis-text">
									{{ row.skuName }}
								</span>

								<el-link
									class="ml-2 copy-icon"
									:icon="DocumentCopy"
									@click="copyText(row.skuName)"
									underline="never"
								/>
							</el-col>
						</el-row>
					</template>

					<template v-else>
						<span
							@click="
								() => {
									router.push('/product/product-info/sku/index');
								}
							"
							class="text-blue"
						>
							SKU信息没有维护关联的MSKU,请前往SKU列表维护>>
						</span>
					</template>
				</div>
			</template>
		</BaseTable>
		<ImportDialog
			ref="importDialogRef"
			title="导入退货订单"
			templateUrl="/files/import-template/导入FBM退货.xlsx"
			excelUploadApi="/fbm/amazonReturnOrderView/import?bizType=SLF"
			:accept="'.xlsx,.xls'"
			@refreshDataList="getDataList"
			:uploadTips="uploadTips"
		/>
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

import { columns, moduleKey, searchConfig, listApi } from './config/index';
import commonFunction from '/@/utils/commonFunction';
import { DocumentCopy } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const { copyText } = commonFunction();
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
// 搜索变量
const queryRef = ref();
// 是否显示搜索
const showSearch = ref(true);
// 高级搜索布局的引用
const AdvancedSearchStyleRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: { bizType: 'SLF' },
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
	// descsDefault: ['create_time'],
	// descs: ['create_time'],
});
//  table hook
const { register, getDataList } = useTable(state, baseTableRef);
const uploadTips = [
	'建议每次导入都使用最新的导入模板，避免出现不必要的错误',
	'仅支持xls/xlsx格式',
	'行数不超过5000条，文件大小不超过5M',
	'同一个平台订单存在多条记录时，以第一条为准',
];
// 导入弹窗
const importDialogRef = ref();
const componentMap: any = {
	customCascaderApi,
	TreeSelectInputApi,
	SelectInput,
	SelectDate,
};

// 重置
const resetQuery = () => {
	register.state.queryForm = {
		bizType: 'SLF',
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
const openDialog = async (type: string) => {
	try {
		if (type === 'import') {
			importDialogRef.value.show();
		}
	} catch (error: any) {
		useMessage().error(error?.msg || t('错误'));
	}
};
</script>
<style scoped lang="scss">
.text-blue {
	color: #0089ef;
	word-break: break-all;
	white-space: pre-line;
	cursor: pointer;
	text-align: left;
}
</style>

<style lang="scss" scoped>
@import '/@/views/integrations/components/indexList.scss';
</style>
