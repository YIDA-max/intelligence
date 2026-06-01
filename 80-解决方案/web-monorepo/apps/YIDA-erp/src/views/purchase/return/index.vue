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
						<div class="flex item-center">
							<SelectInput
								v-model:queryForm="state.queryForm"
								:searchTypes="[
									{
										label: 'SKU',
										value: 'skuCodes',
									},
								]"
								:getDataList="getDataList"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<div class="flex item-center">
							<SelectInput
								v-model:queryForm="state.queryForm"
								:searchTypes="[
									{
										label: '采购订单',
										value: 'purchaseNos',
									},
								]"
								:getDataList="getDataList"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<el-select
							v-model="state.queryForm.statusList"
							placeholder="状态"
							multiple
							collapse-tags
							:max-collapse-tags="1"
							clearable
							style="width: 150px"
							@change="getDataList"
						>
							<el-option
								v-for="item in [
									{
										value: 1,
										label: '待处理',
									},
									{
										value: 2,
										label: '已处理',
									},
									{
										value: 3,
										label: '已作废',
									},
								]"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							:settings="{
								getTreeData: getSupplierInfoList,
								text: '供应商',
								searchFn: getDataList,
								code: 'supplierNos',
								selectTreeProps: {
									value: 'supplierNo',
									label: 'name',
								},
								getIdsCode: 'supplierNo',
							}"
						/>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							componentType="legalEntity"
							v-model:queryForm="state.queryForm"
							:settings="{
								text: '法人主体',
								searchFn: getDataList,
								code: 'legalPersonIds',
							}"
						/>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							componentType="userList"
							v-model:queryForm="state.queryForm"
							:settings="{
								text: '采购员',
								searchFn: getDataList,
								code: 'purchaseUserIds',
								getTreeDataParams: {
									postCodeList: [
										'PURCHASING_DIRECTOR',
										'PURCHASING_MANAGER',
										'PROCUREMENT_MANAGER',
										'PURCHASING_OFFICER',
									],
								},
							}"
						/>
					</el-form-item>
					<el-form-item>
						<div class="flex item-center">
							<div class="flex item-center">
								<SelectInput
									v-model:queryForm="state.queryForm"
									:searchTypes="[
										{
											label: '需求单号',
											value: 'demandNos',
										},
									]"
									:getDataList="getDataList"
								/>
							</div>
						</div>
					</el-form-item>
					<el-form-item>
						<div>
							<SelectDate
								v-model:queryForm="state.queryForm"
								:settings="{
									selectStyle: {
										width: '130px',
									},
									dateStyle: {
										width: '130px',
									},
								}"
								:searchTypes="[
									{
										label: '创建时间',
										value: 'createdTime',
										isAddHMS: true,
										dateStart: 'createTimeStart',
										dateEnd: 'createTimeEnd',
									},
								]"
								:getDataList="getDataList"
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
			<el-row>
				<ToolBar @handleRefresh="getDataList" @handleExport="handleExport">
					<template #left-tool>
						<el-button class="ml10" @click="dealOrder" v-auth="'return_deal'">
							{{ $t('处理') }}</el-button
						>
					</template>
				</ToolBar>
			</el-row>
			<el-table
				:data="state.dataList"
				@selection-change="handleSelectionChange"
				@sort-change="sortChangeHandle"
				style="width: 100%"
				v-loading="state.loading"
				border
				row-key="id"
				ref="tableRef"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
				native-scrollbar
			>
				<el-table-column width="60" type="expand">
					<template #default="{ row }">
						<el-table :data="row.purchaseReturnSkuList" class="inner-table">
							<el-table-column align="center" width="60" />
							<el-table-column label="图片" width="100">
								<template #default="{ row: purchaseReturnSkuList }">
									<div class="flex justify-center">
										<img
											v-if="purchaseReturnSkuList.imgUrl"
											:src="purchaseReturnSkuList.imgUrl"
											alt="图片"
											class="object-cover w-10 h-10 rounded-md cursor-pointer"
											@click="() => handlePreview(purchaseReturnSkuList)"
										/>
										<span v-else class="text-gray-400">无图片</span>
									</div>
								</template>
							</el-table-column>
							<el-table-column
								label="产品名称/SKU"
								width="220"
								show-overflow-tooltip
							>
								<template #default="{ row: purchaseReturnSkuList }">
									<div class="flex flex-col">
										<span>{{ purchaseReturnSkuList.skuName }}</span>
										<span class="text-gray-500">{{
											purchaseReturnSkuList.skuCode
										}}</span>
									</div>
								</template>
							</el-table-column>
							<el-table-column
								prop="returnNum"
								label="本次退货数量"
								width="150"
								align="right"
							/>
							<el-table-column
								prop="unitPriceIncludingTax"
								label="含税单价"
								width="150"
								align="right"
							>
								<template #default="{ row: purchaseReturnSkuList }">
									{{ getCurrencySymbol(row.currency) }}
									{{ purchaseReturnSkuList.unitPriceIncludingTax?.toFixed(2) }}
								</template>
							</el-table-column>
							<el-table-column
								prop="priceIncludingTax"
								label="本次退货货值"
								width="150"
								align="right"
							>
								<template #default="{ row: purchaseReturnSkuList }">
									{{ getCurrencySymbol(row.currency) }}
									{{ purchaseReturnSkuList.priceIncludingTax?.toFixed(2) }}
								</template>
							</el-table-column>
							<el-table-column
								prop="demandNo"
								label="需求单号"
								width="200"
								show-overflow-tooltip
							/>
						</el-table>
					</template>
				</el-table-column>
				<el-table-column
					align="center"
					type="selection"
					width="40"
					reserve-selection
				/>
				<el-table-column :label="t('采购退货单')" prop="returnNo" width="100">
				</el-table-column>
				<el-table-column
					prop="status"
					:label="t('状态')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }">
						{{
							row.status === 1
								? '待处理'
								: row.status === 2
								? '已处理'
								: '已作废'
						}}
					</template>
				</el-table-column>
				<el-table-column
					:label="t('采购订单')"
					prop="purchaseNo"
					width="100"
				></el-table-column>
				<el-table-column
					prop="supplierName"
					:label="t('供应商名称')"
					show-overflow-tooltip
					width="200"
				/>
				<el-table-column
					prop="purchaseUserName"
					:label="t('采购员')"
					show-overflow-tooltip
					width="150"
				/>
				<el-table-column
					prop="legalPersonName"
					:label="t('法人主体')"
					width="150"
					show-overflow-tooltip
				/>
				<el-table-column
					prop="returnNum"
					:label="t('退货总数量')"
					show-overflow-tooltip
					width="150"
				/>
				<el-table-column
					prop="returnAmount"
					:label="t('退货总金额')"
					show-overflow-tooltip
					width="250"
				>
					<template #default="{ row }">
						{{ getCurrencySymbol(row.currency) }}
						{{ row.returnAmount?.toFixed(2) || '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="createName"
					:label="t('创建人')"
					show-overflow-tooltip
					width="150"
				/>
				<el-table-column
					prop="createTime"
					:label="t('创建时间')"
					show-overflow-tooltip
					sortable="custom"
					width="150"
				/>
				<el-table-column :label="$t('common.action')" width="100" fixed="right">
					<template #default="{ row }">
						<div class="flex items-center">
							<el-button
								text
								type="primary"
								class="mr20"
								@click="openLogDialog(row.id)"
								v-auth="'return_log'"
								>{{ $t('日志') }}
							</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<pagination
				@current-change="currentChangeHandle"
				@size-change="sizeChangeHandle"
				v-bind="state.pagination"
			/>
		</div>
		<!-- 处理退货单弹窗 -->
		<!-- 删除弹窗 -->
		<InputDialog
			ref="dealReturnRef"
			title="处理退货单"
			message=""
			:show-icon="true"
			icon-type="info"
			input-prop="processRemark"
			confirm-button-text="同意"
			confirm-button-type="primary"
			cancelButtonText="作废"
			input-placeholder="处理备注，作废必填"
			inputType="textarea"
			@cancel="(e:any) => {
				handleProcess(false, e)
			}"
			@confirm="(e:any) => {
				handleProcess(true, e)
			}"
		/>
		<!-- 预览组件 -->
		<Preview v-model="showPreview" :url="previewUrl" type="image" />
		<!-- 日志 -->
		<LogDialog
			v-model="logDialogVisible"
			:id="currentRow.id"
			:biz-type="['PURCHASE_RETURN']"
			:showSearchForm="false"
			:showToolBar="false"
			@closeDialog="closeLogDialog"
		/>
		<ShowResultDialog ref="showResultDialog" />
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive } from 'vue';
import { useMessage } from '/@/hooks/message';
import { getSupplierInfoList } from '/@/api/purchase/supplierSku/index';
import {
	getReturnPage,
	processReturn,
	invalidReturn,
	exportReturnPage,
} from '/@/api/purchase/return/index';
import { useUserInfo } from '/@/stores/userInfo';
import { getCurrencySymbol } from '/@/utils/rateUtils';
import { useRoute } from 'vue-router';

const ToolBar = defineAsyncComponent(
	() => import('/@/components/ToolBar/tool-bar.vue')
);
const Preview = defineAsyncComponent(
	() => import('/@/components/Material/preview.vue')
);
const LogDialog = defineAsyncComponent(
	() => import('/@/components/log/log-dialog.vue')
);
const ShowResultDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/showResult.vue')
);
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const InputDialog = defineAsyncComponent(
	() => import('/@/components/ConfirmDialog/InputDialog.vue')
);
const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
const route = useRoute();

// 添加预览相关变量
const showPreview = ref(false);
const previewUrl = ref('');

// 添加预览方法
const handlePreview = (row: any) => {
	if (row.imgUrl) {
		previewUrl.value = row.imgUrl;
		showPreview.value = true;
	}
};

const { userInfos } = storeToRefs(useUserInfo());

// 显示结果对话框
const showResultDialog = ref();
const { t } = useI18n();
// table的引用
const tableRef = ref();
// 搜索变量
const queryRef = ref();
// 是否显示搜索
const showSearch = ref(true);

// 当前点击的行
const currentRow = ref({
	id: '',
});

// 处理弹窗
const dealReturnRef = ref();

// 添加选中行数据变量
const selectedRows = ref<any[]>([]);

// 修改选中事件处理
const handleSelectionChange = (selection: any[]) => {
	selectedRows.value = selection;
};

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		// status: 1,
		// skuStatus: 1,
	},
	pageList: getReturnPage,
	loading: false,
	dataList: [],
	ascs: [],
	descs: ['create_time'],
});

//  table hook
const {
	getDataList,
	currentChangeHandle,
	sizeChangeHandle,
	sortChangeHandle,
	tableStyle,
} = useTable(state, tableRef);

// 重置
const resetQuery = async () => {
	state.queryForm = {
		current: 1,
		size: 10,
	};
	// 重置时间范围
	getDataList();
};

// // 判断采购主管或采购总监身份
// const isManager = computed(() => {
// 	return userInfos.value.postCodeList?.some((role: string) =>
// 		['TEAM_LEADER', 'PURCHASING_MANAGER'].includes(role)
// 	);
// });

// 判断当前登录用户是否含物控角色
const isMcp = computed(() => {
	return userInfos.value.roleNames?.some((name: string) =>
		name.includes('物控')
	);
});

// 判断当前登录用户是否含采购角色
const isPurchasing = computed(() => {
	return userInfos.value.roleNames?.some((name: string) =>
		name.includes('采购')
	);
});

// 打开处理弹窗
const dealOrder = async () => {
	if (selectedRows.value.length === 0) {
		useMessage().warning('请选择要处理的采购退货单');
		return;
	}

	// 物控角色：只能选择创建人角色含"采购"的退货单
	if (isMcp.value) {
		const invalid = selectedRows.value.find(
			(row: any) =>
				!row.createRoleNames?.some((name: string) => name.includes('采购'))
		);
		if (invalid) {
			useMessage().warning('只能选择创建人配置的角色含采购的退货单');
			return;
		}
	}

	// 采购角色：只能选择创建人角色含"物控"的退货单
	if (isPurchasing.value) {
		const invalid = selectedRows.value.find(
			(row: any) =>
				!row.createRoleNames?.some((name: string) => name.includes('物控'))
		);
		if (invalid) {
			useMessage().warning('只能选择创建人配置的角色含物控的退货单');
			return;
		}
	}

	// 既不是物控也不是采购角色，无权操作
	if (!isMcp.value && !isPurchasing.value) {
		useMessage().warning('只有含物控/采购角色才能操作');
		return;
	}

	dealReturnRef.value.show();
};

// 处理退货单
const handleProcess = async (isApprove: boolean, e: any) => {
	try {
		const api = isApprove ? processReturn : invalidReturn;
		const status = isApprove ? 2 : 3;
		if (!e.processRemark && !isApprove) {
			useMessage().warning('作废时，处理备注必填');
			return;
		}
		const res = await api({
			ids: selectedRows.value.map((item: any) => item.id),
			status,
			remark: e.processRemark,
		});
		if (res.code === 0) {
			getDataList();
			if (res?.data?.failCount > 0) {
				// 显示结果对话框
				showResultDialog.value.setData({
					data: res.data,
					title: '处理退货单失败',
				});
				showResultDialog.value.show();
			} else {
				useMessage().success('处理成功');
			}
		}
		dealReturnRef.value.hide();
		// 清空选中行
		tableRef.value.clearSelection();
	} catch (error: any) {
		useMessage().error(error?.msg || '处理失败');
	}
};

// 导出
const handleExport = async () => {
	try {
		// 显示加载状态
		state.loading = true;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await exportReturnPage({
			ids: selectedRows.value.map((item: any) => item.id),
			...state.queryForm,
			ascs: state?.ascs,
			descs: state?.descs,
			current: 1,
			size: 10000,
		});
	} catch (error) {
		useMessage().error(t(error as string));
	} finally {
		// 隐藏加载状态
		state.loading = false;
	}
};

// 页面初始化时处理URL参数
onMounted(() => {
	const purchaseNos = route.query.purchaseNos as string;
	if (purchaseNos) {
		if (purchaseNos.includes(',')) {
			// 逗号分隔的字符串，转换为数组
			state.queryForm.purchaseNos = purchaseNos
				.split(',')
				.map((item) => item.trim())
				.filter((item) => item);
		} else {
			// 单个值，包装成数组
			state.queryForm.purchaseNos = [purchaseNos];
		}
		getDataList();
	}
});

const logDialogVisible = ref(false);
// 打开日志弹窗
const openLogDialog = (id: string) => {
	currentRow.value.id = id;
	logDialogVisible.value = true;
};
// 关闭日志弹窗
const closeLogDialog = () => {
	logDialogVisible.value = false;
};
</script>

<style lang="scss" scoped>
.text-blue {
	color: #0089ef;
}

:deep(.el-dialog) {
	.error-icon {
		text-align: center;
		margin-bottom: 16px;
	}

	.error-message {
		text-align: center;
		margin-bottom: 16px;
		color: #333;
		font-size: 14px;
	}

	.error-list {
		background-color: #f2f2f2;
		padding: 12px 16px;
		margin: 0 16px;
		border-radius: 4px;
		max-height: 300px;
		overflow-y: auto;
	}

	.error-item {
		line-height: 24px;
		color: #666;
		font-size: 14px;
	}
}
</style>
