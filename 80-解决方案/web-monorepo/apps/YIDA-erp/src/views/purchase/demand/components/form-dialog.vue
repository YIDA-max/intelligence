<template>
	<el-dialog
		v-bind="$attrs"
		:close-on-click-modal="false"
		:title="props.title"
		width="80%"
		@close="handleClose"
		@open="handleOpen"
		draggable
	>
		<div class="dialog-container">
			<el-form label-width="120px" ref="formRef">
				<el-row class="mb18">
					<el-col :span="8">
						<el-form-item
							label="部门-运营小组"
							:rules="[
								{
									required: true,
									message: '请选择部门-运营小组',
									trigger: 'change',
								},
							]"
						>
							<el-cascader
								v-model="formData.deptId"
								placeholder="请选择"
								clearable
								:options="props.dictMap.deptTree"
								filterable
								:disabled="props.currentRow?.demandNo"
								:props="{
									label: 'name',
									value: 'id',
									emitPath: false, // ✅ 只返回最后一个 id
									checkStrictly: false, // 默认即可，确保联动
									leafOnly: true, // ✅ 只允许选最后一级
								}"
								@change="(val: any) => {handleChange(val);}"
							>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="创建人">{{
							props.visibleType === 'add'
								? userInfos.value.userName
								: props.currentRow?.createName
						}}</el-form-item>
					</el-col>
					<el-col :span="5" :offset="9">
						<el-text v-show="props.currentRow?.demandNo">
							需求单号:{{ props.currentRow?.demandNo }}
						</el-text>
					</el-col>
				</el-row>
			</el-form>
			<el-row class="mb18">
				<el-col :span="24">
					<el-table
						:data="state.dataList"
						style="width: 100%"
						v-loading="state.loading"
						border
						ref="tableRef"
						row-key="id"
						:cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle"
						native-scrollbar
					>
						<el-table-column prop="skuCode" width="150" show-overflow-tooltip>
							<template #header>
								<span
									:style="{
										color: '#f78c8c',
										marginRight: '3px',
									}"
									>*
								</span>
								{{ $t('SKU') }}
							</template>
							<template #default="{ row }">
								{{ row.skuCode }}
							</template>
						</el-table-column>
						<el-table-column prop="planNum" width="120">
							<template #header>
								<span
									:style="{
										color: '#f78c8c',
										marginRight: '3px',
									}"
									>*
								</span>
								{{ $t('计划数量') }}
							</template>
							<template #default="{ row }">
								<el-input-number
									v-model="row.planNum"
									style="width: 100%"
									:controls="false"
									:min="1"
									:max="999999999"
									:step="1"
									:precision="0"
									placeholder="请输入"
								/>
							</template>
						</el-table-column>
						<el-table-column
							prop="singleCartonQty"
							:label="$t('单箱数量')"
							show-overflow-tooltip
							width="90"
						>
						</el-table-column>
						<el-table-column
							prop="minimumOrder"
							:label="$t('最小起订量')"
							width="100"
							show-overflow-tooltip
						>
						</el-table-column>
						<el-table-column prop="countryCode" width="150">
							<template #header>
								<span
									:style="{
										color: '#f78c8c',
										marginRight: '3px',
									}"
									>*
								</span>
								{{ $t('国家') }}
							</template>
							<template #default="{ row }">
								<el-select
									clearable
									filterable
									v-model="row.countryCode"
									placeholder="国家"
									@change="() => (row.mskuCode = '')"
								>
									<el-option
										v-for="item in props.dictMap.countryList"
										:key="item.abbTwoCode"
										:label="`${item.abbTwoCode}-${item.chineseName}`"
										:value="item.abbTwoCode"
									/>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column prop="platformChannelCode" width="150">
							<template #header>
								<span
									:style="{
										color: '#f78c8c',
										marginRight: '3px',
									}"
									>*
								</span>
								{{ $t('平台渠道') }}
							</template>
							<template #default="{ row }">
								<el-select
									clearable
									filterable
									v-model="row.platformChannelCode"
									placeholder="平台渠道"
									@change="() => (row.mskuCode = '')"
								>
									<el-option
										v-for="item in props.dictMap.platformChannel"
										:key="item.id"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column prop="mskuCode" width="150">
							<template #header>
								{{ $t('MSKU') }}
							</template>
							<template #default="{ row }">
								<el-select
									v-model="row.mskuCode"
									placeholder="请选择"
									style="width: 100%"
									filterable
									clearable
									:loading="row._loading"
									:remote="true"
									@focus="ensureLoaded(row)"
								>
									<el-option-group
										v-for="group in row?._options || []"
										:key="group.label"
										:label="group.label"
									>
										<el-option
											v-for="opt in group.options || []"
											:key="opt.mskuCode"
											:label="opt.label"
											:value="opt.mskuCode"
										/>
									</el-option-group>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column prop="expectedPickupDate" width="150">
							<template #header>
								<span
									:style="{
										color: '#f78c8c',
										marginRight: '3px',
									}"
									>*
								</span>
								{{ $t('期望提货时间') }}
							</template>
							<template #default="{ row }">
								<el-date-picker
									v-model="row.expectedPickupDate"
									type="date"
									placeholder="请选择日期"
									format="YYYY-MM-DD"
									value-format="YYYY-MM-DD"
									style="width: 100%"
									clearable
								/>
							</template>
						</el-table-column>
						<el-table-column prop="shippingMethod" width="140">
							<template #header>
								<span
									:style="{
										color: '#f78c8c',
										marginRight: '3px',
									}"
									>*
								</span>
								{{ $t('发货方式') }}
							</template>
							<template #default="{ row }">
								<el-select
									clearable
									filterable
									v-model="row.shippingMethod"
									placeholder="发货方式"
								>
									<el-option
										v-for="item in props.dictMap.shippingMethod"
										:key="item.id"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column prop="orderType" width="110">
							<template #header>
								<span
									:style="{
										color: '#f78c8c',
										marginRight: '3px',
									}"
									>*
								</span>
								{{ $t('订单类型') }}
							</template>
							<template #default="{ row }">
								<el-select
									clearable
									filterable
									v-model="row.orderType"
									placeholder="订单类型"
								>
									<el-option
										v-for="item in props.dictMap.purchaseDemandOrderType"
										:key="item.id"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column prop="operationId">
							<template #header>
								<span
									:style="{
										color: '#f78c8c',
										marginRight: '3px',
									}"
									>*
								</span>
								{{ $t('运营人') }}
							</template>
							<template #default="{ row }">
								<el-select
									clearable
									filterable
									v-model="row.operationId"
									placeholder="运营人"
									@focus="getProductManageId(row)"
								>
									<el-option
										v-for="item in row.productManageId
											? row.productManageId
											: []"
										:key="item.userId"
										:label="item.name"
										:value="item.userId"
									/>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column prop="remark">
							<template #header>
								{{ $t('备注') }}
							</template>
							<template #default="{ row }">
								<el-input
									v-model="row.remark"
									placeholder="请输入"
									style="width: 100%"
								/>
							</template>
						</el-table-column>
						<el-table-column
							:label="$t('common.action')"
							width="80"
							fixed="right"
						>
							<template #default="{ row, $index: index }">
								<el-button :icon="Minus" @click="handleDelete(row, index)" />
							</template>
						</el-table-column>
					</el-table>
					<el-button
						:icon="Plus"
						@click="handleAdd"
						class="mt10"
						v-show="props.visibleType !== 'edit'"
					/>
				</el-col>
			</el-row>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">{{
					$t('common.cancelButtonText')
				}}</el-button>
				<el-button
					type="primary"
					@click="onSubmit('save')"
					:disabled="loading"
					>{{ $t('保存') }}</el-button
				>
				<el-button
					type="primary"
					@click="onSubmit('submit')"
					:disabled="loading"
					>{{ $t('提交') }}</el-button
				>
			</span>
		</template>
		<!-- 选择产品弹窗 -->
		<SkuDialog
			v-model="skuDialogVisible"
			@closeDialog="skuDialogVisible = false"
			@setRows="setRows"
			:deptId="formData.deptId"
		/>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMessage } from '/@/hooks/message';
import { Minus, Plus } from '@element-plus/icons-vue';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useUserInfo } from '/@/stores/userInfo';
import {
	postDemandSave,
	postDemandUpdate,
	getSkuQueryMskuWithBundleFlag,
	postDemandUpdateAndSubmit,
} from '/@/api/purchase/demand';
import { getUserListByCondition } from '/@/api/admin/user';
const stores = useUserInfo();
const { userInfos } = storeToRefs(stores);
// import { useI18n } from 'vue-i18n';
const SkuDialog = defineAsyncComponent(
	() => import('./sku-module/material-dialog.vue')
);
// const { t } = useI18n();
const props = defineProps({
	title: { type: String, default: '添加仓库' },
	currentRow: { type: Object, default: () => ({}) }, // 当前编辑的数据
	visibleType: { type: String, default: '' }, // 弹窗类型
	dictMap: { type: Object, default: () => ({}) }, // 字典数据
});
const emit = defineEmits(['closeDialog', 'save']);
// 加载
const loading = ref(false);

// form表单
const formRef = ref();
const formData = ref<any>({ deptId: '' }); // 部门-运营小组

// 弹窗是否显示
const skuDialogVisible = ref(false);

// 表格数据
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	// pageList: getMaterialList,
	descs: [''],
	isPage: false,
});
// tableRef
const tableRef = ref<any>(null);
//  table hook
const { tableStyle, setTableData } = useTable(state, tableRef);
onMounted(() => {
	// 初始化表格数据
	// setTableData([{}]);
});

// 打开选择产品弹窗
const handleAdd = () => {
	// 先判断是否选中了business部门
	if (!formData.value.deptId) {
		useMessage().warning('请先选择部门-运营小组');
		return;
	}
	skuDialogVisible.value = true;
};

// 打开弹窗
const handleOpen = async () => {
	if (props.visibleType === 'edit') {
		const currentRow = JSON.parse(JSON.stringify(props.currentRow));
		// 根据部门ID查询人员
		const res = await getUserListByCondition({ deptId: currentRow?.deptId });
		if (res.code === 0) {
			currentRow.productManageId = res.data || [];
		}
		// 编辑时初始化数据
		if (Array.isArray(currentRow)) {
			setTableData(currentRow);
		} else {
			setTableData([{ ...currentRow }]);
		}
		// 当前选中的部门-运营小组
		formData.value.deptId = (state.dataList ?? [])[0]?.deptId;
	} else if (props.visibleType === 'add') {
		setTableData([]);
		// 清空部门-运营小组
		formData.value.deptId = '';
	}
};

// 删除行
const handleDelete = (row: any, index: number) => {
	const dataList = [...(state.dataList ? state.dataList : [])];
	dataList.splice(index, 1);
	setTableData(dataList);
};

// 关闭弹窗
const handleClose = () => {
	emit('closeDialog');
};

// 弹窗设置
const setRows = (rows: any[]) => {
	const dataList = state.dataList ? [...state.dataList] : [];
	rows.forEach((row: any) => {
		// 检查是否已存在相同的辅料
		const existingIndex = dataList.findIndex(
			(item: any) => item.skuCode === row.skuCode
		);
		if (existingIndex !== -1) {
			// 如果存在相同的辅料也添加新的辅料
			dataList.push({
				...row,
			});
		} else {
			// 如果不存在，添加新的辅料
			dataList.push({
				...row,
			});
		}
	});
	// 设置选中的辅料
	setTableData(dataList);
};

// 提交
const onSubmit = async (type: 'save' | 'submit') => {
	loading.value = true;
	try {
		const dataList = state.dataList ? [...state.dataList] : [];
		// 判断是否有数据
		if (dataList.length === 0) {
			useMessage().warning('请添加产品');
			return;
		}
		// 判断计划数量是否大于0
		for (const item of dataList) {
			if (item.planNum <= 0 || !item.planNum) {
				useMessage().warning(`${item.skuCode} 请填写计划数量`);
				return;
			}
		}
		// 判断国家是否选择
		for (const item of dataList) {
			if (!item.countryCode) {
				useMessage().warning(`${item.skuCode} 请选择国家`);
				return;
			}
		}
		// 判断渠道是否选择
		for (const item of dataList) {
			if (!item.platformChannelCode) {
				useMessage().warning(`${item.skuCode} 请选择渠道`);
				return;
			}
		}
		// 判断提货时间
		for (const item of dataList) {
			if (!item.expectedPickupDate) {
				useMessage().warning(`${item.skuCode} 请选择期望提货时间`);
				return;
			}
		}
		// 判断发货方式
		for (const item of dataList) {
			if (!item.shippingMethod) {
				useMessage().warning(`${item.skuCode} 请选择发货方式`);
				return;
			}
		}
		// 判断订单类型
		for (const item of dataList) {
			if (
				item.orderType === undefined ||
				item.orderType === null ||
				item.orderType === ''
			) {
				useMessage().warning(`${item.skuCode} 请选择订单类型`);
				return;
			}
		}
		// 判断运营人
		for (const item of dataList) {
			if (!item.operationId) {
				useMessage().warning(`${item.skuCode} 请选择运营人`);
				return;
			}
		}
		// 给每一个数据添加部门ID
		dataList.forEach((item: any) => {
			item.deptId = formData.value.deptId;
		});
		// 只要是新增添加，调用的接口都是新增接口  props.visibleType === 'add'
		// 编辑时根据保存还是提交调用不同的接口 props.visibleType === 'edit' 模式不一样
		const api =
			props.visibleType === 'add'
				? postDemandSave
				: props.visibleType === 'edit' && type === 'submit'
				? postDemandUpdateAndSubmit
				: props.visibleType === 'edit' && type === 'save'
				? postDemandUpdate
				: () => Promise.resolve({ code: -1, msg: '未知操作类型' });
		const res = await api({
			// 这里做映射，因为mcpId先存在，然后materialControlUserId再存在，所以做了一层映射（应该要统一的）
			// 如果materialControlUserId存在，则使用materialControlUserId，否则使用mcpId 一定要有值
			dtoList: dataList.map((item) => {
				return {
					...item,
					mcpId: item.materialControlUserId
						? item.materialControlUserId
						: item.mcpId || '',
				};
			}),
			submitFlag: type === 'save' ? 0 : type === 'submit' ? 1 : 0,
		});
		if (res.code === 0) {
			useMessage().success('操作成功');
			// 清空表格数据
			setTableData([]);
			handleClose();
		}
	} catch (error: any) {
		useMessage().error(error.msg || '操作失败，请稍后重试');
	} finally {
		loading.value = false;
	}
};

/**
 * 确保MSKU数据已加载
 * 使用 sku + 国家 + 渠道 + 当前选中的部门运营小组 作为查询条件
 * @param row
 */
const ensureLoaded = async (row: any) => {
	try {
		// TODO: 换成你的接口
		const res = await getSkuQueryMskuWithBundleFlag({
			skuCode: row.skuCode,
			countryCode: row.countryCode,
			platformChannelCode: row.platformChannelCode,
			deptId: formData.value.deptId,
		});
		if (res.code === 0) {
			const list = res.data || [];
			row._options = list;
		}
	} finally {
		row._loading = false; // 确保加载状态被清除
	}
};
/**
 * 点击的时候根据不同的部门id查询人员
 * @param val
 */
const getProductManageId = async (row: any) => {
	if (!formData.value.deptId) {
		useMessage().warning('请先选择部门-运营小组');
		return;
	}
	const res = await getUserListByCondition({
		deptId: formData.value.deptId,
	});
	if (res.code === 0) {
		row.productManageId = res.data || [];
	}
};

// 修改部门-运营小组时
const handleChange = async (val: any) => {
	if (val && state.dataList && state.dataList.length > 0) {
		useMessage().warning('修改部门-运营小组会清空当前表格数据');
		setTableData([]); // 清空表格数据
		return;
	}
};
defineExpose({
	handleOpen,
});
</script>

<style lang="scss" scoped>
.dialog-container {
	padding: 0 20px;
	height: 60vh;
	overflow: auto;
}
.section-title {
	font-weight: bold;
	margin: 10px 0 10px 0;
	display: flex;
	align-items: center;
}
.section-bar {
	display: inline-block;
	width: 4px;
	height: 18px;
	background: #2e5cf6;
	border-radius: 2px;
	margin-right: 8px;
}
.mb18 {
	margin-bottom: 18px;
}
</style>
