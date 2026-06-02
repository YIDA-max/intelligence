<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-07 16:49:25
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-05-26 17:30:06
 * @FilePath: \qianyi-ui\src\views\product\product-info\sku\components\form-dialog\components\associate-msku.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template>
	<div class="py-[15px] px-[30px]">
		<el-tabs v-model="tabsValue" class="mb20" type="card">
			<el-radio-group v-model="tabsValue" size="large">
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
					<el-table-column type="mskuCode" width="400">
						<template #header>
							<span
								:style="{
									color: '#f78c8c',
									marginRight: '3px',
								}"
								>*
							</span>
							{{ $t('MSKU编码') }}
						</template>
						<template #default="{ row }">
							<el-input
								v-model="row.mskuCode"
								placeholder="请输入MSKU编码"
								maxlength="50"
								show-word-limit
								:disabled="isDisable(row)"
								clearable
							/>
						</template>
					</el-table-column>
					<!-- 只有选中的是Amazon标签时才显示 -->
					<el-table-column
						:label="$t('ASIN')"
						width="400"
						v-if="tabsValue === 'Amazon'"
					>
						<template #header>
							<span
								:style="{
									color: '#f78c8c',
									marginRight: '3px',
								}"
								>*</span
							>
							{{ $t('ASIN') }}
						</template>
						<template #default="{ row }">
							<el-input
								v-model="row.asin"
								placeholder="请输入ASIN"
								maxlength="20"
								show-word-limit
								clearable
								:disabled="
									props.visibleType === 'view' ||
									props.visibleType === 'spuView' ||
									!auth('sku_edit_msku')
								"
							/>
						</template>
					</el-table-column>

					<el-table-column
						:label="$t('店铺/站点')"
						prop="storeId"
						width="200"
						show-overflow-tooltip
					>
						<template #header>
							<span
								:style="{
									color: '#f78c8c',
									marginRight: '3px',
								}"
								>*
							</span>
							{{ $t('店铺/站点') }}
						</template>
						<template #default="{ row }">
							<el-select
								v-model="row.storeId"
								filterable
								clearable
								placeholder="请选择"
								:disabled="
									props.visibleType === 'view' ||
									props.visibleType === 'spuView' ||
									!auth('sku_edit_msku')
								"
								@change="() => handleStoreChange(row, true)"
							>
								<el-option
									v-for="item in currentShopOption"
									:key="item.id"
									:label="`${item.storeName}/${item.siteCode}`"
									:value="item.id"
								/>
							</el-select>
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
								*
							</span>
							{{ $t('国家') }}
						</template>
						<template #default="{ row }">
							<SelectInputApi
								v-model="row.countryCode"
								componentType="country"
								:multiple="true"
								:settings="countrySelectSettings"
								@change="(val) => handleCountryCodeChange(row, val)"
							/>
						</template>
					</el-table-column>

					<el-table-column
						:label="$t('销售价')"
						prop="salePrice"
						width="200"
						show-overflow-tooltip
					>
						<template #header>
							<!-- 当平台=amazon,店铺是欧洲店铺时,销售价、销售链接、竞品链接、定价截图这四个必填先去掉 以后可能会加回来 ！！！ -->
							<span
								:style="{
									color: '#f78c8c',
									marginRight: '3px',
								}"
								v-if="tabsValue === 'Amazon' && hasEUSiteInTable"
								v-show="false"
								>*
							</span>
							{{ $t('销售价') }}
						</template>
						<template #default="{ row }">
							<div class="flex items-center">
								<el-input
									v-model="row.salePrice"
									placeholder="请输入"
									:disabled="
										props.visibleType === 'view' ||
										props.visibleType === 'spuView' ||
										!auth('sku_edit_msku')
									"
								>
									<template #append>
										<el-select
											v-model="row.currency"
											:style="{ width: '75px' }"
											class="el-select-background"
											:disabled="
												props.visibleType === 'view' ||
												props.visibleType === 'spuView' ||
												!auth('sku_edit_msku')
											"
										>
											<el-option
												v-for="c in props.dictMap.currencyOption"
												:key="c.currencyCode"
												:label="c.currencyCode"
												:value="c.currencyCode"
											/>
										</el-select>
									</template>
								</el-input>
							</div>
						</template>
					</el-table-column>
					<el-table-column :label="$t('销售链接')" type="saleUrl" width="400">
						<template #header>
							<span
								:style="{
									color: '#f78c8c',
									marginRight: '3px',
								}"
								v-if="tabsValue === 'Amazon' && hasEUSiteInTable"
								v-show="false"
								>*
							</span>
							{{ $t('销售链接') }}
						</template>
						<template #default="{ row }">
							<el-input
								v-model="row.saleUrl"
								placeholder="请输入销售链接"
								clearable
								:disabled="
									props.visibleType === 'view' ||
									props.visibleType === 'spuView' ||
									!auth('sku_edit_msku')
								"
							/>
						</template>
					</el-table-column>
					<el-table-column
						:label="$t('竞品链接')"
						type="competitorUrl"
						width="400"
					>
						<template #header>
							<span
								:style="{
									color: '#f78c8c',
									marginRight: '3px',
								}"
								v-if="tabsValue === 'Amazon' && hasEUSiteInTable"
								v-show="false"
								>*
							</span>
							{{ $t('竞品链接') }}
						</template>
						<template #default="{ row }">
							<el-input
								v-model="row.competitorUrl"
								placeholder="请输入竞品链接"
								clearable
								:disabled="
									props.visibleType === 'view' ||
									props.visibleType === 'spuView' ||
									!auth('sku_edit_msku')
								"
							/>
						</template>
					</el-table-column>
					<el-table-column
						:label="$t('定价截图')"
						type="image"
						width="400"
						align="center"
					>
						<template #header>
							<span
								:style="{
									color: '#f78c8c',
									marginRight: '3px',
								}"
								v-if="tabsValue === 'Amazon' && hasEUSiteInTable"
								v-show="false"
								>*
							</span>
							{{ $t('定价截图') }}
						</template>
						<template #default="{ row }">
							<upload-img
								v-model:image-url="row.imgUrl"
								width="80px"
								height="80px"
								:disabled="
									props.visibleType === 'view' ||
									props.visibleType === 'spuView' ||
									!auth('sku_edit_msku')
								"
							/>
						</template>
					</el-table-column>

					<el-table-column :label="$t('运营')" width="250">
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
								style="width: 200px"
								:disabled="
									props.visibleType === 'view' ||
									props.visibleType === 'spuView' ||
									!auth('sku_edit_msku')
								"
								@change="() => handleOperationUser(row)"
							>
								<el-option
									v-for="item in dictMap.productManageId"
									:key="item.userId"
									:label="item.name"
									:value="item.userId"
								/>
							</el-select>
						</template>
					</el-table-column>

					<el-table-column :label="$t('部门/运营组')" width="250">
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
							<!-- <div class="flex items-center justify-center">
								<span>{{ row.deptName }}</span>
							</div> -->
							<el-select
								clearable
								filterable
								v-model="row.deptId"
								placeholder="部门/运营组"
								style="width: 200px"
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
					<!-- <el-table-column :label="$t('备注')" prop="remark" show-overflow-tooltip width="400">
						<template #default="{ row }">
							<el-input v-model="row.remark" placeholder="请输入备注" maxlength="50" show-word-limit :disabled="props.visibleType === 'view'" />
						</template>
					</el-table-column> -->
					<el-table-column
						:label="$t('common.action')"
						width="120"
						fixed="right"
					>
						<template #default="{ row, $index: rowIndex }">
							<el-button
								:icon="Minus"
								@click="handleDelete(row, rowIndex)"
								v-show="
									props.visibleType !== 'view' &&
									props.visibleType !== 'spuView'
								"
								:disabled="!auth('sku_edit_msku')"
							/>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
		</el-tabs>

		<el-button
			:icon="Plus"
			@click="handleAdd"
			v-show="props.visibleType !== 'view' && props.visibleType !== 'spuView'"
			:disabled="!auth('sku_edit_msku')"
		/>
	</div>
</template>

<script setup lang="ts">
import { getAllOperatorInfo } from '/@/api/admin/user';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { Minus, Plus } from '@element-plus/icons-vue';
import { auth } from '/@/utils/authFunction';
import { useUserInfo } from '/@/stores/userInfo';

import { getUserWithDeptByCondition } from '/@/api/login/index';
import { getListByCondition } from '/@/api/product/sku';
import { useMessage } from '/@/hooks/message';
/** 国家下拉禁止选择的二字码（聚合站点，需选具体国家） */
const FORBIDDEN_COUNTRY_CODES = new Set(['GC', 'EU']);

const filterForbiddenCountryCodes = (
	codes?: string[] | string | null
): string[] => {
	if (!codes) return [];
	const list = Array.isArray(codes) ? codes : String(codes).split(',');
	return list.filter(
		(code) =>
			code && !FORBIDDEN_COUNTRY_CODES.has(String(code).trim().toUpperCase())
	);
};

/** SelectInputApi 无 exclude 专用 prop，用 settings.renderData 过滤下拉项 */
const countrySelectSettings = {
	text: '国家',
	width: '100%',
	optionDisabledFormatter: (item: any) =>
		FORBIDDEN_COUNTRY_CODES.has(String(item?.abbTwoCode || '').toUpperCase()),
};
// 欧盟与英国两字码（含 GB、UK）
const EU_2C = new Set([
	'AT',
	'BE',
	'BG',
	'HR',
	'CY',
	'CZ',
	'DK',
	'EE',
	'FI',
	'FR',
	'DE',
	'GR',
	'HU',
	'IE',
	'IT',
	'LV',
	'LT',
	'LU',
	'MT',
	'NL',
	'PL',
	'PT',
	'RO',
	'SK',
	'SI',
	'ES',
	'SE',
	'GB',
	'UK',
]);
const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);
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

// 当前展示的数据
const tabsAndTable = ref<
	Array<{ label: string; value: string; tableData: any[] }>
>([]);
// 当前选中的tab
const tabsValue = ref('');

const currentOperatorInfo = ref<Array<any>>([]);
// 当前使用的店铺下拉
const currentShopOption = ref<Array<any>>([]);
// 计算当前表格中是否有欧盟/英国站点
const hasEUSiteInTable = computed(() => {
	const currentTab = tabsAndTable.value.find(
		(tab) => tab.value === tabsValue.value
	);
	if (!currentTab || !currentTab.tableData) return false;
	return currentTab.tableData.some((row: any) => {
		// 检查该行是否有选中的 storeId，且该 storeId 对应的站点属于欧盟/英国
		if (!row.storeId) return false;
		const shop = (props.dictMap?.shopOption || []).find(
			(s: any) => s.id === row.storeId
		);
		return shop ? EU_2C.has(String(shop.siteCode || '').toUpperCase()) : false;
	});
});
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
		}
	},
	{ immediate: true }
);
// 监听tab变化，清空表格数据
watch(
	() => tabsValue.value,
	async () => {
		// 获取店铺下拉
		const res = await getListByCondition({
			platformChannelCode: tabsValue.value,
			// status: 1, // 启用
		});
		if (res.code === 0) {
			currentShopOption.value = res.data || [];
		}
		const opRes = await getAllOperatorInfo();
		if (opRes.code === 0) {
			currentOperatorInfo.value = opRes.data || [];
		}
	},
	{
		immediate: true,
	}
);

// TODO: 接口未调试
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	// pageList: fetchList,
	descs: [''],
});

//  table hook getDataList,
const { tableStyle } = useTable(state, null);
const { userInfos } = storeToRefs(useUserInfo());
let userInfoDept: any = {};
// 添加
const handleAdd = async () => {
	// 添加逻辑
	const currentTab = tabsAndTable.value.find(
		(tab) => tab.value === tabsValue.value
	);
	if (!userInfoDept.deptId) {
		userInfoDept = await getUserDept(userInfos.value.user.userId);
	}
	if (currentTab) {
		currentTab.tableData.push({
			sku: '',
			shop: '',
			remark: '',
			salePrice: '',
			countryCode: [],
			currency: 'EUR',
			operationUserId: userInfos.value.user.userId,
			deptId: userInfoDept.deptId || '',
			deptName: userInfoDept.deptName || '',
			asin: '',
		});
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
/** 国家变更：兜底剔除 GC / EU（防止历史回显或粘贴带入） */
const handleCountryCodeChange = (row: any, value: string[] | string) => {
	row.countryCode = filterForbiddenCountryCodes(value);
};
// 店铺/站点改变事件
const handleStoreChange = (row: any, isUserAction = false) => {
	if (isUserAction) {
		const shop = currentShopOption.value.find(
			(item: any) => item.id === row.storeId
		);
		if (
			shop &&
			shop.siteCode &&
			shop.siteCode !== 'EU' &&
			shop.siteCode !== 'GC'
		) {
			row.countryCode = [shop.siteCode];
		} else if (!row.storeId) {
			row.countryCode = [];
		}
	}
};

const setData = (data: []) => {
	tabsAndTable.value = data;
};
const isDisable = (row: any) => {
	if (auth('sku_edit_msku')) {
		if (props.visibleType === 'view' || props.visibleType === 'spuView') {
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
