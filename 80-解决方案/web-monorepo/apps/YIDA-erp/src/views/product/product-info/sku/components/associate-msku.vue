<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-16 09:58:38
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-05-26 18:32:16
 * @FilePath: \qianyi-ui\src\views\product\product-info\sku\components\associate-msku.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template>
	<el-dialog
		v-bind="$attrs"
		width="60%"
		:close-on-click-modal="false"
		draggable
		append-to-body
		@open="init"
		:title="'关联MSKU'"
	>
		<div class="py-[15px] px-[30px]">
			<el-radio-group
				v-model="tabsValue"
				size="large"
				@change="handRadioChange"
				class="mb-4"
			>
				<el-radio-button
					:value="item.value"
					:label="item.label"
					:name="item.value"
					:key="index"
					v-for="(item, index) in tabsAndTable"
					class="m-1 radio-button"
				/>
			</el-radio-group>
			<el-tabs v-model="tabsValue" class="mb20" type="card ">
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
						height="300"
						v-loading="state.loading"
						border
						row-key="index"
						:cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle"
						native-scrollbar
					>
						<el-table-column :label="$t('MSKU')" type="mskuCode" width="400">
							<template #header
								><span
									:style="{
										color: '#f78c8c',
										marginRight: '3px',
									}"
									>*
								</span>
								{{ $t('MSKU编码') }}</template
							>
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
									placeholder="请选择"
									:disabled="!auth('sku_edit_msku')"
									clearable
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
										:disabled="!auth('sku_edit_msku')"
									>
										<template #append>
											<el-select
												v-model="row.currency"
												:style="{ width: '75px' }"
												:disabled="!auth('sku_edit_msku')"
												class="el-select-background"
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
									:disabled="!auth('sku_edit_msku')"
									clearable
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
									:disabled="!auth('sku_edit_msku')"
									clearable
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
						<!-- <el-table-column :label="$t('备注')" prop="remark" show-overflow-tooltip width="400">
							<template #default="{ row }">
								<el-input v-model="row.remark" placeholder="请输入备注" maxlength="50" show-word-limit />
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
									:disabled="!auth('sku_edit_msku')"
								/>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>

			<el-button :icon="Plus" @click="handleAdd" />
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="closeDialog">{{ $t('取消') }}</el-button>
				<el-button
					type="primary"
					@click="onSubmit"
					:disabled="!auth('sku_edit_msku')"
				>
					{{ $t('确定') }}
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { useMessage } from '/@/hooks/message';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { ref, reactive, watch, computed } from 'vue';
import { relatedMsku } from '/@/api/product/sku';
import { Minus, Plus } from '@element-plus/icons-vue';
import { getListByCondition } from '/@/api/product/sku';
import { getUserWithDeptByCondition } from '/@/api/login/index';
import { auth } from '/@/utils/authFunction';
import { useUserInfo } from '/@/stores/userInfo';
import { getAllOperatorInfo } from '/@/api/admin/user';
const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);
const emit = defineEmits(['closeDialog']);
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

/** SelectInputApi 无 exclude 专用 prop，用 optionDisabledFormatter 禁用聚合站点 */
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

const props = defineProps({
	dictMap: {
		type: Object,
		default: () => ({}),
	},
	currentRow: {
		type: Object,
		default: () => ({}),
	},
});
// 当前展示的数据
const tabsAndTable = ref<
	Array<{ label: string; value: string; tableData: any[] }>
>([]);
// 当前选中的tab
const tabsValue = ref('');
// 当前使用的店铺下拉
const currentShopOption = ref<Array<any>>([]);
// 接口获取的最新运营人员信息
const currentOperatorInfo = ref<Array<any>>([]);

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
			storeId: '',
			countryCode: [],
			saleUrl: '',
			competitorUrl: '',
			salePrice: '',
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

const init = async () => {
	// 初始化逻辑
	// 关联MSKU回显
	const setMSKU: Array<{ label: string; value: string; tableData: any[] }> = [];
	props.dictMap.platform?.forEach((item: any) => {
		const mskus = props.currentRow.mskus.filter(
			(msku: any) => msku.platformChannelCode === item.value
		);
		setMSKU.push({
			label: item.label,
			value: item.value,
			tableData: mskus.map((item: any) => {
				return {
					...item,
					countryCode: filterForbiddenCountryCodes(
						item.countryCode?.split(',') || []
					),
					currency: item.currency || 'EUR',
				};
			}),
		});
	});
	tabsAndTable.value = setMSKU;
	// 默认选中第一个tab
	if (tabsAndTable.value.length > 0) {
		tabsValue.value = tabsAndTable.value[0].value;
	} else {
		tabsValue.value = '';
	}
	// 获取店铺下拉
	const res = await getListByCondition({
		platformChannelCode: tabsValue.value,
		status: 1, // 启用
	});
	if (res.code === 0) {
		currentShopOption.value = res.data || [];
	}

	const opRes = await getAllOperatorInfo();
	if (opRes.code === 0) {
		currentOperatorInfo.value = opRes.data || [];
	}
};

// 切换tab
const handRadioChange = async (value: string) => {
	// 切换tab逻辑
	// 获取店铺下拉
	const res = await getListByCondition({ platformChannelCode: value });
	if (res.code === 0) {
		currentShopOption.value = res.data || [];
	}
	// 每次切换时拉最新数据
	const opRes = await getAllOperatorInfo();
	if (opRes.code === 0) {
		currentOperatorInfo.value = opRes.data || [];
	}
};

// 提交表单
const onSubmit = async () => {
	// 提交逻辑
	//  验证MSKU 及 欧盟/英国站点下的必填
	for (let i = 0; i < tabsAndTable.value.length; i++) {
		const group = tabsAndTable.value[i];
		const items = group.tableData || [];
		for (let j = 0; j < items.length; j++) {
			const row = items[j];
			if (!row.mskuCode || row.mskuCode.trim() === '') {
				useMessage().error(`${group.label}的第 ${j + 1} 项缺少 MSKU`);
				return false;
			}

			// 判断是否是亚马逊，亚马逊的asin字段必填
			if (
				group.label === 'Amazon' &&
				(!row.asin || String(row.asin).trim() === '')
			) {
				useMessage().error(`${group.label}的第 ${j + 1} 项ASIN必填`);
				return false;
			}

			// 运营必填
			if (!row.operationUserId || String(row.operationUserId).trim() === '') {
				useMessage().error(`${group.label}的第 ${j + 1} 项运营必填`);
				return false;
			}

			// 店铺/站点必填
			if (!row.storeId) {
				useMessage().error(`${group.label}的第 ${j + 1} 项店铺/站点不能为空`);
				return false;
			}
			// 国家二字码必填 只有当前选中的国家才校验必填
			if (
				tabsValue.value === group.value &&
				(!row.countryCode || row.countryCode.length === 0)
			) {
				useMessage().error(`${group.label}的第 ${j + 1} 项国家二字码不能为空`);
				return false;
			}
			// 国家不能是eu或gc（硬编码，不用在意，防止历史回显或粘贴带入）
			if (row.countryCode.includes('EU') || row.countryCode.includes('GC')) {
				useMessage().error(`${group.label}的第 ${j + 1} 项国家不能是EU或GC`);
				return false;
			}

			const isValidPositiveNumber = (val: any) => {
				const n = Number(val);
				return Number.isFinite(n) && n > 0;
			};
			// 当平台=amazon,店铺是欧洲店铺时,销售价、销售链接、竞品链接、定价截图这四个必填先去掉 以后可能会加回来 ！！！
			// 通过 storeId 映射到站点二字码
			// const shop = (props.dictMap?.shopOption || []).find(
			// 	(s: any) => s.id === row.storeId
			// );
			// const code = String(shop?.siteCode || '').toUpperCase();
			// 公共：销售价校验函数（> 0 的数字）
			// if (group.label === 'Amazon' && EU_2C.has(code)) {
			// 	if (
			// 		!row.salePrice ||
			// 		String(row.salePrice).trim() === '' ||
			// 		!isValidPositiveNumber(row.salePrice)
			// 	) {
			// 		useMessage().error(
			// 			`${group.label}的第 ${j + 1} 项销售价必填且需为大于0的数字`
			// 		);
			// 		return false;
			// 	}
			// 	if (!row.saleUrl || String(row.saleUrl).trim() === '') {
			// 		useMessage().error(`${group.label}的第 ${j + 1} 项销售链接必填`);
			// 		return false;
			// 	}
			// 	if (!row.competitorUrl || String(row.competitorUrl).trim() === '') {
			// 		useMessage().error(`${group.label}的第 ${j + 1} 项竞品链接必填`);
			// 		return false;
			// 	}
			// 	if (!row.imgUrl || String(row.imgUrl).trim() === '') {
			// 		useMessage().error(`${group.label}的第 ${j + 1} 项定价截图必填`);
			// 		return false;
			// 	}
			// } else {
			// 	// 非欧盟/英国站点：若填写了销售价，也需满足>0数字
			// 	if (
			// 		String(row.salePrice || '').trim() !== '' &&
			// 		!isValidPositiveNumber(row.salePrice)
			// 	) {
			// 		useMessage().error(
			// 			`${group.label}的第 ${j + 1} 项销售价需为大于0的数字`
			// 		);
			// 		return false;
			// 	}
			// }
			// 非欧盟/英国站点：若填写了销售价，也需满足>0数字
			if (
				String(row.salePrice || '').trim() !== '' &&
				!isValidPositiveNumber(row.salePrice)
			) {
				useMessage().error(
					`${group.label}的第 ${j + 1} 项销售价需为大于0的数字`
				);
				return false;
			}
		}
	}
	// 关联MSKU
	const mskusParams: {
		mskus: Array<{
			skuCode: string;
			mskuCode: string;
			countryCode: string;
			platformChannelCode: string;
			storeId: string;
			saleUrl: string;
			competitorUrl: string;
			imgFileName: string;
			salePrice: string;
			currency: string;
			// remark: string;
			asin: string;
			operationUserId: number;
			deptName: string;
			deptId: string;
		}>;
	} = {
		mskus: [],
	};

	for (const platformGroup of tabsAndTable.value) {
		// 遍历每个平台组
		const platform = platformGroup.value;
		const table = platformGroup.tableData || [];
		for (const row of table) {
			// 忽略空行时可以加校验，如 mskuCode 存在才推入
			mskusParams.mskus.push({
				skuCode: row.sku || '',
				mskuCode: row.mskuCode || '',
				countryCode: Array.isArray(row.countryCode)
					? row.countryCode.join(',')
					: row.countryCode || '',
				platformChannelCode: platform || '',
				storeId: row.storeId || '',
				saleUrl: row.saleUrl || '',
				competitorUrl: row.competitorUrl || '',
				imgFileName: row.imgUrl?.includes('fileName=')
					? row.imgUrl.split('fileName=')[1]
					: row.imgUrl || '',
				salePrice: row.salePrice,
				currency: row.salePrice ? row.currency : null, // 若无销售价则币种传null
				// remark: row.remark || '',
				asin: row.asin,
				operationUserId: row.operationUserId,
				deptName: row.deptName,
				deptId: row.deptId,
			});
		}
	}
	// 调用接口
	try {
		const res = await relatedMsku({
			skuCode: props.currentRow.skuCode,
			mskus: mskusParams.mskus,
			// 管理msku的时候把当前平台给过去，只校验当前平台，其他的平台不做校验。（后期考虑重构）
			operatePlatform: tabsValue.value,
		});
		if (res.code === 0) {
			useMessage().success('分配成功');
			await new Promise((resolve) => setTimeout(resolve, 300));
			// 关闭弹窗
			emit('closeDialog');
			// 关闭弹窗逻辑
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
const closeDialog = () => {
	emit('closeDialog');
	// 关闭弹窗逻辑
};
const isDisable = (row: any) => {
	if (auth('sku_edit_msku')) {
		if (row && row.id) {
			return true;
		}
	} else {
		return true;
	}
	return false;
};
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
