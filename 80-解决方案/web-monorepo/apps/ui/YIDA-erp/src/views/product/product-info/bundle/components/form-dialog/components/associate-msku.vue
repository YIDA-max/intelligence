<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-07 16:49:25
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-05-26 18:43:07
 * @FilePath: \qianyi-ui\src\views\product\product-info\bundle\components\form-dialog\components\associate-msku.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template>
	<div class="py-[15px] px-[30px]">
		<el-tabs v-model="tabsValue" class="mb20">
			<el-radio-group
				v-model="tabsValue"
				size="large"
				@change="handRadioChange"
			>
				<el-radio-button
					:value="item.value"
					:label="item.label"
					:name="item.value"
					:key="index"
					v-for="(item, index) in tabsAndTable"
					class="m-1 mb-4 radio-button"
				/>
			</el-radio-group>
			<el-tab-pane
				:label="item.label"
				:name="item.value"
				v-for="(item, index) in tabsAndTable"
				:key="index"
			>
				<el-table
					:data="item.tableData"
					:style="{
						width: '100%',
					}"
					v-loading="state.loading"
					border
					row-key="index"
					:cell-style="tableStyle.cellStyle"
					:header-cell-style="tableStyle.headerCellStyle"
					native-scrollbar
				>
					<el-table-column :label="$t('MSKU')" type="mskuCode" width="250">
						<template #default="{ row }">
							<el-input
								v-model="row.mskuCode"
								placeholder="请输入MSKU编码"
								maxlength="50"
								show-word-limit
								:disabled="isDisable(row)"
							/>
						</template>
					</el-table-column>

					<el-table-column
						:label="$t('店铺/站点')"
						prop="storeId"
						show-overflow-tooltip
						min-width="250"
					>
						<template #default="{ row }">
							<!-- <el-select
								v-model="row.storeId"
								filterable
								clearable
								placeholder="请选择"
								:disabled="
									props.visibleType === 'view' || !auth('bundle_edit_msku')
								"
								@change="handleStoreChange(row)"
								class="el-select-background"
							>
								<el-option
									v-for="item in props.dictMap.shopOption"
									:key="item.id"
									:label="`${item.storeName}/${item.siteCode}`"
									:value="item.id"
								/>
							</el-select> -->

							<SelectInputApi
								componentType="storeCode"
								v-model="row.storeId"
								placeholder="请选择"
								:disabled="
									props.visibleType === 'view' || !auth('bundle_edit_msku')
								"
								:settings="{
									separator: ':',
									getTreeDataParams: {
										platformChannelCode: tabsValue,
									},
								}"
								@change="handleStoreChange(row, true)"
							/>
						</template>
					</el-table-column>
					<el-table-column
						:label="$t('国家')"
						prop="countryCode"
						width="200"
						show-overflow-tooltip
					>
						<template #header>
							<span
								:style="{
									color: '#f78c8c',
									marginRight: '3px',
								}"
							>
							</span>
							{{ $t('国家') }}
						</template>
						<template #default="{ row }">
							<SelectInputApi
								v-model="row.countryCode"
								componentType="country"
								:multiple="true"
								:settings="{
									text: '国家',
									width: '100%',
								}"
							/>
						</template>
					</el-table-column>

					<el-table-column :label="$t('运营')" width="200">
						<template #header>
							<span
								:style="{
									color: '#f78c8c',
									marginRight: '3px',
								}"
								>*
							</span>
							{{ $t('运营') }}
						</template>
						<template #default="{ row }">
							<el-select
								collapse-tags
								:max-collapse-tags="1"
								clearable
								filterable
								v-model="row.operationUserId"
								placeholder="运营人员"
								style="width: 150px"
								:disabled="props.visibleType === 'view'"
								@change="handleOperationUser(row)"
							>
								<el-option
									v-for="item in dictMap.productManageId"
									:key="item.userId"
									:label="item.name"
									:value="item.userId"
								/>
							</el-select>
							<!-- <SelectInputApi
								v-model="row.operationUserId"
								componentType="userList"
								placeholder="运营人员"
								:disabled="props.visibleType === 'view'"
								:settings="{
									getTreeDataParams: {
										lockFlag: 0,
									},
								}"
							/> -->
						</template>
					</el-table-column>
					<el-table-column :label="$t('部门/运营组')" min-width="250">
						<template #header>
							<span
								:style="{
									color: '#f78c8c',
									marginRight: '3px',
								}"
							>
							</span>
							{{ $t('部门/运营组') }}
						</template>
						<template #default="{ row }">
							<el-select
								clearable
								filterable
								v-model="row.deptId"
								placeholder="部门/运营组"
								style="width: 200px"
								:disabled="!auth('sku_edit_msku')"
							>
								<el-option
									v-for="item in dictMap.skuDepts"
									:key="item.deptId"
									:label="item.name"
									:value="item.deptId"
								/>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column
						:label="$t('备注')"
						prop="remark"
						show-overflow-tooltip
						width="400"
					>
						<template #default="{ row }">
							<el-input
								v-model="row.remark"
								placeholder="请输入备注"
								maxlength="50"
								show-word-limit
								:disabled="props.visibleType === 'view'"
							/>
						</template>
					</el-table-column>
					<el-table-column
						:label="$t('common.action')"
						width="120"
						fixed="right"
					>
						<template #default="{ row, $index: rowIndex }">
							<el-button
								:icon="Minus"
								@click="handleDelete(row, rowIndex)"
								v-show="props.visibleType !== 'view'"
								:disabled="!auth('bundle_edit_msku')"
							/>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
		</el-tabs>

		<el-button
			:icon="Plus"
			@click="handleAdd"
			v-show="props.visibleType !== 'view'"
			:disabled="!auth('bundle_edit_msku')"
		/>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { Minus, Plus } from '@element-plus/icons-vue';
import { auth } from '/@/utils/authFunction';
import { getListByCondition } from '/@/api/product/sku';
import { getAllOperatorInfo } from '/@/api/admin/user';
import { getUserWithDeptByCondition } from '/@/api/login/index';
import { useMessage } from '/@/hooks/message';
const props = defineProps({
	dictMap: {
		type: Object,
		default: () => ({}),
	},
	visibleType: {
		type: String,
		default: '', // edit, view
	},
});
const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);
// 当前展示的数据
const tabsAndTable = ref<
	Array<{ label: string; value: string; tableData: any[] }>
>([]);
// 当前选中的tab
const tabsValue = ref('');
// 接口获取的最新运营人员信息
const currentOperatorInfo = ref<Array<any>>([]);

// 接口获取的店铺站点信息
const currentStoreInfo = ref<Array<any>>([]);

// 切换tab
const handRadioChange = async () => {
	const opRes = await getAllOperatorInfo();
	if (opRes.code === 0) {
		currentOperatorInfo.value = opRes.data || [];
	}
	const storeRes = await getListByCondition();
	if (storeRes.code === 0) {
		currentStoreInfo.value = storeRes.data || [];
	}
};
async function getUserDept(userId: any) {
	if (!userId) return {};
	const res = await getUserWithDeptByCondition({ lockFlag: 0, userId: userId });
	if (res.code === 0) {
		return res.data?.[0] || {};
	} else {
		return {};
	}
}
// 监听props进行数据整合
watch(
	() => props.dictMap,
	(newVal) => {
		if (newVal.platform) {
			tabsAndTable.value = newVal.platform.map((item: any) => {
				return {
					label: item.label,
					value: item.value,
					tableData: [],
				};
			});
			// 默认选中第一个tab
			tabsValue.value = tabsAndTable.value[0].value;
			handRadioChange();
		}
	},
	{ immediate: true }
);

// TODO: 接口未调试
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	// pageList: fetchList,
	descs: [''],
});

//  table hook getDataList,
const { tableStyle } = useTable(state, null);
// 店铺/站点改变事件
const handleStoreChange = (row: any, isUserAction = false) => {
	const store = currentStoreInfo.value.find(
		(item: any) => item.id === row.storeId
	);
	// 不要跟着店铺的部门走，而是跟着运营人员的部门走
	// row.deptId = store?.deptId;
	// row.deptName = currentOperatorInfo.value.find(
	// 	(operatorInfo: any) => operatorInfo.deptId === row.deptId
	// )?.fullDeptName;

	if (isUserAction) {
		if (
			store &&
			store.siteCode &&
			store.siteCode !== 'EU' &&
			store.siteCode !== 'GC'
		) {
			row.countryCode = [store.siteCode];
		} else if (!row.storeId) {
			row.countryCode = [];
		}
	}
};
//运营人员改变事件
const handleOperationUser = async (row: any) => {
	// 如果运营人员为空，则不进行判断
	if (!row.operationUserId) {
		row.deptName = '';
		row.deptId = '';
		return;
	}
	const userInfo = await getUserDept(row.operationUserId);
	// 先判断该人员是否在 运营部门中存在，不存在则提示
	const isExist = props.dictMap.skuDepts.some(
		(item: any) => item.deptId === userInfo?.deptId
	);
	if (!isExist) {
		row.deptName = '';
		row.deptId = '';
		useMessage().warning('该人员不在运营部门中');
		return;
	}
	row.deptName = userInfo?.deptName || '';
	row.deptId = userInfo?.deptId || '';
};
watch(
	() => tabsAndTable.value,
	() => {
		tabsAndTable.value?.forEach((item) => {
			item?.tableData?.forEach((row) => {
				handleStoreChange(row);
			});
		});
	},
	{ immediate: true }
);

// 添加
const handleAdd = () => {
	// 添加逻辑
	const currentTab = tabsAndTable.value.find(
		(tab) => tab.value === tabsValue.value
	);
	if (currentTab) {
		currentTab.tableData.push({
			mskuCode: '',
			storeId: '',
			remark: '',
			countryCode: [],
		});
	}
};
// 移除
const handleDelete = (row: any, index: number) => {
	// 移除逻辑,找到当前选中的tab，并过滤掉sku为空的项
	const currentTab = tabsAndTable.value.find(
		(tab) => tab.value === tabsValue.value
	);
	if (currentTab) {
		currentTab.tableData.splice(index, 1);
	}
};
const setData = (data: any[]) => {
	tabsAndTable.value = data;
};

const isDisable = (row: any) => {
	if (auth('bundle_edit_msku')) {
		if (props.visibleType === 'view') {
			return true;
		} else if (props.visibleType === 'edit') {
			if (row && row.id) {
				return true;
			}
		}
	} else {
		return true;
	}
	return false;
};

defineExpose({
	setData,
	tabsAndTable: tabsAndTable,
	tabsValue: tabsValue,
});
</script>

<style scoped lang="scss">
.radio-button {
	border: 1px solid rgba(220, 220, 220, 0.6) !important;
	background: rgba(248, 249, 250, 0.7) !important;
	backdrop-filter: blur(10px) !important;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1),
		inset 0 1px 0 rgba(255, 255, 255, 0.5) !important;
	border-radius: 8px !important;
	// padding: 10px 15px !important;
}
:deep(.el-tabs__header) {
	// 隐藏
	display: none;
}
</style>
