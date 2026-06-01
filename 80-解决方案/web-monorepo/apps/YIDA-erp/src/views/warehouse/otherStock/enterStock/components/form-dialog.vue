<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Minus, Plus } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import { BasicTableProps, useTable } from '/@/hooks/table';
import {
	postOtherInboundAdd,
	postOtherInboundUpdate,
} from '/@/api/warehouse/otherStock/enterStock/index';
import { useMessage } from '/@/hooks/message';

const SkuModule = defineAsyncComponent(
	() => import('./sku-module/sku-module.vue')
);
const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);
const emits = defineEmits(['getDataList']);
const props = defineProps({
	dictMap: { type: Object, default: () => ({}) }, // 字典数据
});
const { t } = useI18n();
const dialogVisible = ref(false);
// 加载
const loading = ref(false);
const title = ref('需求单编辑');
const visibleType = ref<'add' | 'edit'>('add');
const currentRow = ref<any>({});
// form表单
const formRef = ref();
const formData = ref<any>({});
const rules = ref<any>({
	warehouseCode: [
		{ required: true, message: t('请选择仓库'), trigger: 'blur' },
	],
	inboundType: [
		{ required: true, message: t('请选择入库类型'), trigger: 'blur' },
	],
	inboundTime: [
		{ required: true, message: t('请选择入库时间'), trigger: 'blur' },
	],
	stockStartTime: [
		{ required: true, message: t('请选择公司库龄入库时间'), trigger: 'blur' },
	],
});
// sku模块ref
const skuModuleRef = ref<any>(null);
// 表格数据
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	descs: [''],
	isPage: false,
});

const tableRef = ref<any>(null);
const { tableStyle, setTableData } = useTable(state, tableRef);
onMounted(() => {});

// 打开弹窗初始化
const handleOpen = async () => {
	loading.value = false;
	if (visibleType.value === 'add') {
		// 新增
		formData.value = {
			warehouseCode: '',
			warehouseType: '',
			inboundType: '',
			inboundTime: '',
			remark: '',
			stockStartTime: '',
		};
		state.dataList = [];
	} else if (visibleType.value === 'edit') {
		// 编辑
		formData.value = {
			...currentRow.value,
		};
		state.dataList = currentRow.value.details || [];
	}
};

const changeWarehouseCode = (value: any) => {
	// 从 warehouseListByType 中找到选中仓库所属的 warehouseType
	const warehouseList = props.dictMap.warehouseListByType || [];
	let matchedType: string | null = null;
	for (const typeGroup of warehouseList) {
		const found = (typeGroup.warehouses || []).find(
			(w: any) => w.warehouseCode === value
		);
		if (found) {
			matchedType = typeGroup.warehouseType;
			break;
		}
	}
	formData.value.warehouseType = matchedType;
	// 清空sku明细
	state.dataList = [];
};

/**
 * 打开sku选择模块（仓库必填）
 */
const showSkuModule = () => {
	if (!formData.value.warehouseCode) {
		useMessage().warning(t('请选择仓库'));
		return;
	}
	skuModuleRef.value.show();
};

/**
 * 设置sku模块选中行
 */
const setRows = (rows: any[]) => {
	const currentData = state.dataList || [];
	const newData = [...currentData];
	rows.forEach((row) => {
		// 防止重复添加
		const isExist = currentData.some((item: any) => {
			return (
				item.skuCode === row.skuCode &&
				item.mskuCode === row.mskuCode &&
				item.countryCode === row.countryCode &&
				item.platformChannel === row.platformChannel &&
				item.skuCartonCode === row.skuCartonCode &&
				item.deptId === row.deptId
			);
		});
		if (!isExist) {
			newData.push({ ...row });
		}
	});
	setTableData(newData);
};
/**
 * 删除行
 */
const removeRow = (index: number) => {
	const currentData = state.dataList || [];
	currentData.splice(index, 1);
	setTableData([...currentData]);
};
/**
 * 提交表单
 */
const onSubmit = async () => {
	try {
		loading.value = true;
		const validate = await formRef.value.validate();
		if (!validate) {
			loading.value = false;
			return;
		}
		// sku明细不能为空
		if (!state.dataList || state.dataList.length === 0) {
			useMessage().warning(t('请添加sku明细'));
			loading.value = false;
			return;
		}
		// 提交逻辑
		const params = {
			...formData.value,
			details: state.dataList,
			// 法人主体ID
			legalPersonId: currentRow.value.legalPersonId
				? currentRow.value.legalPersonId
				: state.dataList[0]?.legalPersonId || null,
		};
		const api =
			visibleType.value === 'add'
				? postOtherInboundAdd
				: postOtherInboundUpdate;
		const res = await api(params);
		if (res && res.code === 0) {
			// 调用父组件方法，刷新列表
			emits('getDataList');
			loading.value = false;
			// 提交成功
			dialogVisible.value = false;
		} else {
			loading.value = false;
		}
	} catch (error) {
		//
	} finally {
		loading.value = false;
	}
};
/**
 * 打开弹窗方法
 * 供父组件调用
 */
const show = (e: {
	title: string;
	visibleType: 'add' | 'edit';
	currentRow: any;
}) => {
	dialogVisible.value = true;
	// 初始化值
	title.value = e.title;
	visibleType.value = e.visibleType;
	currentRow.value = e.currentRow;
};

/**
 * 关闭弹窗方法
 * 供父组件调用
 */
const hide = () => {
	dialogVisible.value = false;
};
defineExpose({
	handleOpen,
	show,
	hide,
});
</script>
<template>
	<el-dialog
		v-model="dialogVisible"
		:close-on-click-modal="false"
		:title="title"
		width="1200px"
		@close="hide"
		@open="handleOpen"
		draggable
	>
		<div class="dialog-container">
			<el-form
				label-width="120px"
				ref="formRef"
				:model="formData"
				:rules="rules"
			>
				<el-row class="mb-2">
					<el-col :span="12">
						<el-form-item prop="warehouseCode" label="仓库" inline-message>
							<el-cascader
								v-model="formData.warehouseCode"
								placeholder="请选择"
								clearable
								@change="changeWarehouseCode"
								:options="props.dictMap.warehouseListByType?.map((item: any) => {
												return {
													...item,
													warehouseName: item.warehouseTypeText,
													warehouseCode: item.warehouseType,
												};
											}) || []"
								filterable
								:props="{
									label: 'warehouseName',
									value: 'warehouseCode',
									children: 'warehouses',
									emitPath: false, // ✅ 只返回最后一个 id
									checkStrictly: false, // 默认即可，确保联动
									leafOnly: true, // ✅ 只允许选最后一级
								}"
								style="width: 100%"
							>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item
							prop="inboundType"
							label="入库类型"
							label-width="140px"
							inline-message
						>
							<SelectInputApi
								v-model="formData.inboundType"
								componentType="dicts"
								placeholder="入库类型"
								:settings="{
									getTreeDataParams: 'other_in_type',
								}"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb-2">
					<el-col :span="12">
						<el-form-item prop="inboundTime" label="入库时间" inline-message>
							<el-date-picker
								v-model="formData.inboundTime"
								type="date"
								placeholder="选择入库时间"
								style="width: 100%"
								value-format="YYYY-MM-DD"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item
							prop="stockStartTime"
							label="公司库龄入库时间"
							label-width="140px"
							inline-message
						>
							<el-date-picker
								v-model="formData.stockStartTime"
								type="date"
								placeholder="选择公司库龄入库时间"
								style="width: 100%"
								value-format="YYYY-MM-DD"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb-2">
					<el-col :span="24">
						<el-form-item prop="remark" label="备注">
							<el-input
								v-model="formData.remark"
								type="textarea"
								placeholder="请输入备注"
								maxlength="500"
								:autosize="{ minRows: 2, maxRows: 4 }"
							/>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<el-row class="mb-2">
				<el-col :span="6" :offset="1">
					<el-Button @click="showSkuModule" :icon="Plus"></el-Button>
				</el-col>
			</el-row>
			<el-row class="mb-2">
				<el-table
					:data="state.dataList"
					style="width: 100%"
					v-loading="state.loading"
					border
					row-key="skuCode"
					ref="tableRef"
					height="320"
					:cell-style="tableStyle.cellStyle"
					:header-cell-style="tableStyle.headerCellStyle"
					native-scrollbar
				>
					<el-table-column
						prop="skuCode"
						:label="$t('SKU/产品名称')"
						show-overflow-tooltip
						min-width="100"
					>
						<template #default="{ row }">
							<div class="flex flex-col items-start justify-center w-full">
								<div
									class="max-w-full overflow-hidden whitespace-nowrap text-ellipsis"
								>
									{{ row.skuCode }}
								</div>
								<div
									class="max-w-full overflow-hidden whitespace-nowrap text-ellipsis"
								>
									{{ row.skuName }}
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column
						:label="t('国家')"
						min-width="80"
						show-overflow-tooltip
					>
						<template #default="{ row }">
							{{ row.countryCode || '---' }}
						</template>
					</el-table-column>
					<el-table-column
						:label="t('平台渠道')"
						min-width="80"
						show-overflow-tooltip
					>
						<template #default="{ row }">
							{{ row.platformChannel || '---' }}
						</template>
					</el-table-column>
					<el-table-column
						label="箱规编码"
						min-width="80"
						show-overflow-tooltip
					>
						<template #default="{ row }">
							{{ row.skuCartonCode || '--' }}
						</template>
					</el-table-column>
					<el-table-column
						:label="t('MSKU')"
						min-width="80"
						show-overflow-tooltip
					>
						<template #default="{ row }">
							{{ row.mskuCode || '---' }}
						</template>
					</el-table-column>
					<el-table-column
						:label="t('部门&小组')"
						min-width="80"
						show-overflow-tooltip
					>
						<template #default="{ row }">
							{{ row.deptName || '---' }}
						</template>
					</el-table-column>
					<el-table-column
						:label="t('入库数量')"
						min-width="120"
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
							{{ $t('入库数量') }}
						</template>
						<template #default="{ row }">
							<el-inputNumber
								v-model="row.quantity"
								min="1"
								placeholder="请输入入库数量"
							/>
						</template>
					</el-table-column>
					<el-table-column
						:label="t('备注')"
						min-width="100"
						maxlength="50"
						show-overflow-tooltip
					>
						<template #default="{ row }">
							<el-input
								v-model="row.remark"
								type="text"
								placeholder="请输入备注"
							/>
						</template>
					</el-table-column>
					<el-table-column :label="$t('common.action')" width="80">
						<template #default="{ $index }">
							<el-button :icon="Minus" @click="removeRow($index)"> </el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-row>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="hide">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">{{
					$t('确认提交')
				}}</el-button>
			</span>
		</template>
		<SkuModule
			ref="skuModuleRef"
			:skuList="[...state.dataList]"
			@setRows="setRows"
			:warehouseCode="formData.warehouseCode"
			:warehouseType="formData.warehouseType"
		/>
	</el-dialog>
</template>

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
</style>
