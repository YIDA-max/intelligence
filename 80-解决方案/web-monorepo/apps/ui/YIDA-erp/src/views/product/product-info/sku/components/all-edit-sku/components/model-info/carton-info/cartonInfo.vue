<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 17:58:38
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-02-05 10:36:10
 * @FilePath: \qianyi-ui\src\views\product\product-info\sku\components\all-edit-sku\components\model-info\carton-info\cartonInfo.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useUnitConverter } from '/@/views/product/product-info/sku/components/all-edit-sku/components/model-info/carton-info/utils/cartonInfo';
import { useMessage } from '/@/hooks/message';
import MessageComponent from '/@/views/product/product-info/sku/components/all-edit-sku/components/message/index.vue';
const { t } = useI18n();
const { autoConvertUnitFields, handleBlurClearCache, clearConversionCache } =
	useUnitConverter();
const props = defineProps({
	cartonInfoUnitSystem: {
		type: String,
		default: '1', // 1 公制，2 英制
	},
});

// 表格ref
const tableRef = ref();
const currentSpecUnits = computed(() => {
	// 根据单位制选择规格单位
	if (props.cartonInfoUnitSystem === '1') {
		// 公制
		return [{ label: 'cm', value: 'cm' }];
	} else {
		// 英制
		return [{ label: 'inch', value: 'inch' }];
	}
});
const currentWeightUnits = computed(() => {
	// 根据单位制选择重量单位
	if (props.cartonInfoUnitSystem === '1') {
		// 公制
		return [{ label: 'kg', value: 'kg' }];
	} else {
		// 英制
		return [{ label: 'lbs', value: 'lbs' }];
	}
});
// 表单校验
const state: BasicTableProps = reactive<BasicTableProps>({});
//  table hook
const { setTableData, getTableData } = useTable(state, tableRef);

// 监听单位制变化，更新规格单位
watch(
	() => props.cartonInfoUnitSystem,
	async (newVal) => {
		// 转换单位
		await autoConvertUnitFields(newVal, getTableData, setTableData);
	}
);

const init = () => {
	// 重置数据
	//
};

// 获取提交值
const validateForm = async () => {
	const getData = getTableData();
	// 判断是的每一个字段是否填写完整
	for (let i = 0; i < getData.length; i++) {
		const item = getData[i];
		if (
			!item.outCartonSpecLength ||
			!item.outCartonSpecWidth ||
			!item.outCartonSpecHeight ||
			!item.outCartonSpecUnit ||
			!item.cartonQty ||
			!item.cartonQtyUnit ||
			!item.cartonGrossWeight ||
			!item.cartonGrossWeightUnit ||
			!item.cartonNetWeight ||
			!item.cartonNetWeightUnit ||
			!item.containerCartonQty ||
			!item.containerCartonQtyUnit
		) {
			useMessage().error(t('请填写完整第') + (i + 1) + t('行的箱规信息'));
			throw new Error('请填写完整第' + (i + 1) + '行的箱规信息'); // 主动抛出异常
		}
	}
	// 判断单箱毛重必须大于等于单箱净重
	for (let i = 0; i < getData.length; i++) {
		const item = getData[i];
		if (Number(item.cartonGrossWeight) < Number(item.cartonNetWeight)) {
			useMessage().error(
				`箱规编码：${item.skuCartonCode}的单箱毛重必须大于等于单箱净重`
			);
			// 主动抛出异常
			throw new Error();
		}
	}
	// 返回数据
	return {
		skuCartons: getData,
	};
};

// 设定回显值
const setCartonList = (data: Array<any>) => {
	// 手动设置单箱数量和单柜装箱数量的单位为pcs和carton
	const setData = Array.from(data).map((item) => ({
		...item,
		cartonQtyUnit: 'pcs',
		containerCartonQtyUnit: 'carton',
	}));
	setTableData(setData);
};

// 外箱规格批量填写的数据
const batchSpecData = ref({
	outCartonSpecLength: '',
	outCartonSpecWidth: '',
	outCartonSpecHeight: '',
	outCartonSpecUnit: props.cartonInfoUnitSystem === '1' ? 'cm' : 'inch',
});

// 单箱数量批量填写的数据
const batchQtyData = ref({
	cartonQty: '',
	cartonQtyUnit: 'pcs',
});

// 单箱毛重批量填写的数据
const batchGrossWeightData = ref({
	cartonGrossWeight: '',
	cartonGrossWeightUnit: props.cartonInfoUnitSystem === '1' ? 'kg' : 'lbs',
});

// 单箱净重批量填写的数据
const batchNetWeightData = ref({
	cartonNetWeight: '',
	cartonNetWeightUnit: props.cartonInfoUnitSystem === '1' ? 'kg' : 'lbs',
});

// 单柜装箱数量批量填写的数据
const batchContainerQtyData = ref({
	containerCartonQty: '',
	containerCartonQtyUnit: 'carton',
});

// 批量填写外箱规格
const handleBatchSpecSubmit = () => {
	const tableData = getTableData();
	if (!tableData || tableData.length === 0) {
		useMessage().error(t('请先添加数据'));
		return;
	}

	const specData = batchSpecData.value;
	// 更新所有行的外箱规格数据
	const updatedData = tableData.map((item) => ({
		...item,
		outCartonSpecLength:
			specData.outCartonSpecLength || item.outCartonSpecLength,
		outCartonSpecWidth: specData.outCartonSpecWidth || item.outCartonSpecWidth,
		outCartonSpecHeight:
			specData.outCartonSpecHeight || item.outCartonSpecHeight,
		outCartonSpecUnit: specData.outCartonSpecUnit || item.outCartonSpecUnit,
	}));

	setTableData(updatedData);
	// 批量填写后清除缓存，避免缓存的旧值覆盖新填写的数据
	clearConversionCache();
	// 重置批量填写数据
	batchSpecData.value = {
		outCartonSpecLength: '',
		outCartonSpecWidth: '',
		outCartonSpecHeight: '',
		outCartonSpecUnit: props.cartonInfoUnitSystem === '1' ? 'cm' : 'inch',
	};
};

// 批量填写单箱数量
const handleBatchQtySubmit = () => {
	const tableData = getTableData();
	if (!tableData || tableData.length === 0) {
		useMessage().error(t('请先添加数据'));
		return;
	}

	const qtyData = batchQtyData.value;
	const updatedData = tableData.map((item) => ({
		...item,
		cartonQty: qtyData.cartonQty || item.cartonQty,
		cartonQtyUnit: qtyData.cartonQtyUnit || item.cartonQtyUnit,
	}));

	setTableData(updatedData);
	// 批量填写后清除缓存，避免缓存的旧值覆盖新填写的数据
	clearConversionCache();
	batchQtyData.value = {
		cartonQty: '',
		cartonQtyUnit: 'pcs',
	};
};

// 批量填写单箱毛重
const handleBatchGrossWeightSubmit = () => {
	const tableData = getTableData();
	if (!tableData || tableData.length === 0) {
		useMessage().error(t('请先添加数据'));
		return;
	}

	const weightData = batchGrossWeightData.value;
	const updatedData = tableData.map((item) => ({
		...item,
		cartonGrossWeight: weightData.cartonGrossWeight || item.cartonGrossWeight,
		cartonGrossWeightUnit:
			weightData.cartonGrossWeightUnit || item.cartonGrossWeightUnit,
	}));

	setTableData(updatedData);
	// 批量填写后清除缓存，避免缓存的旧值覆盖新填写的数据
	clearConversionCache();
	batchGrossWeightData.value = {
		cartonGrossWeight: '',
		cartonGrossWeightUnit: props.cartonInfoUnitSystem === '1' ? 'kg' : 'lbs',
	};
};

// 批量填写单箱净重
const handleBatchNetWeightSubmit = () => {
	const tableData = getTableData();
	if (!tableData || tableData.length === 0) {
		useMessage().error(t('请先添加数据'));
		return;
	}

	const weightData = batchNetWeightData.value;
	const updatedData = tableData.map((item) => ({
		...item,
		cartonNetWeight: weightData.cartonNetWeight || item.cartonNetWeight,
		cartonNetWeightUnit:
			weightData.cartonNetWeightUnit || item.cartonNetWeightUnit,
	}));

	setTableData(updatedData);
	// 批量填写后清除缓存，避免缓存的旧值覆盖新填写的数据
	clearConversionCache();
	batchNetWeightData.value = {
		cartonNetWeight: '',
		cartonNetWeightUnit: props.cartonInfoUnitSystem === '1' ? 'kg' : 'lbs',
	};
};

// 批量填写单柜装箱数量
const handleBatchContainerQtySubmit = () => {
	const tableData = getTableData();
	if (!tableData || tableData.length === 0) {
		useMessage().error(t('请先添加数据'));
		return;
	}

	const containerData = batchContainerQtyData.value;
	const updatedData = tableData.map((item) => ({
		...item,
		containerCartonQty:
			containerData.containerCartonQty || item.containerCartonQty,
		containerCartonQtyUnit:
			containerData.containerCartonQtyUnit || item.containerCartonQtyUnit,
	}));

	setTableData(updatedData);
	// 批量填写后清除缓存，避免缓存的旧值覆盖新填写的数据
	clearConversionCache();
	batchContainerQtyData.value = {
		containerCartonQty: '',
		containerCartonQtyUnit: 'carton',
	};
};

// 监听单位制变化，更新批量填写默认单位
watch(
	() => props.cartonInfoUnitSystem,
	(newVal) => {
		batchSpecData.value.outCartonSpecUnit = newVal === '1' ? 'cm' : 'inch';
		batchGrossWeightData.value.cartonGrossWeightUnit =
			newVal === '1' ? 'kg' : 'lbs';
		batchNetWeightData.value.cartonNetWeightUnit =
			newVal === '1' ? 'kg' : 'lbs';
	}
);

// 暴露方法给父组件
defineExpose({
	init,
	validateForm,
	setCartonList,
});
</script>
<template>
	<div class="box">
		<el-table
			:data="state.dataList"
			border
			ref="tableRef"
			style="width: 100%"
			class="custom-table"
			native-scrollbar
		>
			<el-table-column label="SKU" width="150" align="center">
				<template #default="{ row }">
					<span>{{ row.skuCode ? row.skuCode : '---' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="箱规编码" width="150" align="center">
				<template #default="{ row }">
					<span>{{ row.skuCartonCode ? row.skuCartonCode : '---' }}</span>
				</template>
			</el-table-column>
			<el-table-column width="200" align="center">
				<template #header>
					<div
						style="
							display: flex;
							align-items: center;
							justify-content: center;
							gap: 8px;
						"
					>
						<span
							:style="{
								color: '#f78c8c',
								marginRight: '3px',
							}"
							>*
						</span>
						<span>{{ $t('单箱数量') }}</span>
						<MessageComponent
							:title="$t('批量填写单箱数量')"
							@submit="handleBatchQtySubmit"
							@init="
								() => {
									batchQtyData = {
										cartonQty: '',
										cartonQtyUnit: 'pcs',
									};
								}
							"
						>
							<template #input>
								<div class="batch-input-group">
									<el-input
										v-model="batchQtyData.cartonQty"
										:placeholder="$t('请输入')"
										size="default"
										style="width: 260px"
									/>
								</div>
							</template>
						</MessageComponent>
					</div>
				</template>
				<template #default="{ row, $index }">
					<div class="quantity-input-group">
						<el-form-item
							:prop="`tableData.${$index}.cartonQty`"
							class="quantity-item"
						>
							<el-input
								v-model="row.cartonQty"
								:placeholder="$t('请输入')"
								size="default"
							/>
						</el-form-item>
						<el-form-item
							:prop="`tableData.${$index}.cartonQtyUnit`"
							class="unit-item"
						>
							<el-select
								v-model="row.cartonQtyUnit"
								filterable
								placeholder="请选择"
								size="default"
								class="el-select-background"
							>
								<el-option
									v-for="item in [{ label: 'pcs', value: 'pcs' }]"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</div>
				</template>
			</el-table-column>
			<el-table-column width="430" align="center">
				<template #header>
					<div
						style="
							display: flex;
							align-items: center;
							justify-content: center;
							gap: 8px;
						"
					>
						<span
							:style="{
								color: '#f78c8c',
								marginRight: '3px',
							}"
							>*
						</span>
						<span>{{ $t('外箱规格') }}</span>
						<MessageComponent
							:title="$t('批量填写外箱规格')"
							@submit="handleBatchSpecSubmit"
							@init="
								() => {
									batchSpecData = {
										outCartonSpecLength: '',
										outCartonSpecWidth: '',
										outCartonSpecHeight: '',
										outCartonSpecUnit:
											props.cartonInfoUnitSystem === '1' ? 'cm' : 'inch',
									};
								}
							"
						>
							<template #input>
								<div class="batch-spec-input">
									<div class="batch-spec-row">
										<el-input
											v-model="batchSpecData.outCartonSpecLength"
											:placeholder="t('长')"
											size="default"
											style="width: 110px"
										/>
										<el-input
											v-model="batchSpecData.outCartonSpecWidth"
											:placeholder="t('宽')"
											size="default"
											style="width: 110px"
										/>
										<el-input
											v-model="batchSpecData.outCartonSpecHeight"
											:placeholder="t('高')"
											size="default"
											style="width: 110px"
										/>
									</div>
								</div>
							</template>
						</MessageComponent>
					</div>
				</template>
				<template #default="{ row, $index }">
					<div class="spec-input-group">
						<el-form-item
							:prop="`tableData.${$index}.outCartonSpecLength`"
							class="spec-item"
						>
							<el-input
								v-model="row.outCartonSpecLength"
								:placeholder="t('长')"
								@blur="
									handleBlurClearCache(
										props.cartonInfoUnitSystem,
										row.outCartonSpecLength,
										'outCartonSpecLength',
										$index
									)
								"
								size="default"
								:style="{ width: '120px' }"
							/>
						</el-form-item>
						<el-form-item
							:prop="`tableData.${$index}.outCartonSpecWidth`"
							class="spec-item"
						>
							<el-input
								v-model="row.outCartonSpecWidth"
								:placeholder="$t('宽')"
								@blur="
									handleBlurClearCache(
										props.cartonInfoUnitSystem,
										row.outCartonSpecWidth,
										'outCartonSpecWidth',
										$index
									)
								"
								size="default"
							/>
						</el-form-item>
						<el-form-item
							:prop="`tableData.${$index}.outCartonSpecHeight`"
							class="spec-item"
						>
							<el-input
								v-model="row.outCartonSpecHeight"
								:placeholder="$t('高')"
								@blur="
									handleBlurClearCache(
										props.cartonInfoUnitSystem,
										row.outCartonSpecHeight,
										'outCartonSpecHeight',
										$index
									)
								"
								size="default"
							/>
						</el-form-item>
						<el-form-item
							:prop="`tableData.${$index}.outCartonSpecUnit`"
							class="unit-item"
						>
							<el-select
								v-model="row.outCartonSpecUnit"
								filterable
								placeholder="请选择"
								size="default"
								class="el-select-background"
							>
								<el-option
									v-for="item in currentSpecUnits"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</div>
				</template>
			</el-table-column>

			<el-table-column width="200" align="center">
				<template #header>
					<div
						style="
							display: flex;
							align-items: center;
							justify-content: center;
							gap: 8px;
						"
					>
						<span
							:style="{
								color: '#f78c8c',
								marginRight: '3px',
							}"
							>*
						</span>
						<span>{{ $t('单箱毛重') }}</span>
						<MessageComponent
							:title="$t('批量填写单箱毛重')"
							@submit="handleBatchGrossWeightSubmit"
							@init="
								() => {
									batchGrossWeightData = {
										cartonGrossWeight: '',
										cartonGrossWeightUnit:
											props.cartonInfoUnitSystem === '1' ? 'kg' : 'lbs',
									};
								}
							"
						>
							<template #input>
								<div class="batch-input-group">
									<el-input
										v-model="batchGrossWeightData.cartonGrossWeight"
										:placeholder="$t('请输入')"
										size="default"
										style="width: 260px"
									/>
								</div>
							</template>
						</MessageComponent>
					</div>
				</template>
				<template #default="{ row, $index }">
					<div class="weight-input-group">
						<el-form-item
							:prop="`tableData.${$index}.cartonGrossWeight`"
							class="weight-item"
						>
							<el-input
								v-model="row.cartonGrossWeight"
								:placeholder="t('请输入')"
								@blur="
									handleBlurClearCache(
										props.cartonInfoUnitSystem,
										row.cartonGrossWeight,
										'cartonGrossWeight',
										$index
									)
								"
								size="default"
							/>
						</el-form-item>
						<el-form-item
							:prop="`tableData.${$index}.cartonGrossWeightUnit`"
							class="unit-item"
						>
							<el-select
								v-model="row.cartonGrossWeightUnit"
								filterable
								placeholder="请选择"
								size="default"
								class="el-select-background"
							>
								<el-option
									v-for="item in currentWeightUnits"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</div>
				</template>
			</el-table-column>

			<el-table-column width="200" align="center">
				<template #header>
					<div
						style="
							display: flex;
							align-items: center;
							justify-content: center;
							gap: 8px;
						"
					>
						<span
							:style="{
								color: '#f78c8c',
								marginRight: '3px',
							}"
							>*
						</span>
						<span>{{ $t('单箱净重') }}</span>
						<MessageComponent
							:title="$t('批量填写单箱净重')"
							@submit="handleBatchNetWeightSubmit"
							@init="
								() => {
									batchNetWeightData = {
										cartonNetWeight: '',
										cartonNetWeightUnit:
											props.cartonInfoUnitSystem === '1' ? 'kg' : 'lbs',
									};
								}
							"
						>
							<template #input>
								<div class="batch-input-group">
									<el-input
										v-model="batchNetWeightData.cartonNetWeight"
										:placeholder="$t('请输入')"
										size="default"
										style="width: 260px"
									/>
								</div>
							</template>
						</MessageComponent>
					</div>
				</template>
				<template #default="{ row, $index }">
					<div class="weight-input-group">
						<el-form-item
							:prop="`tableData.${$index}.cartonNetWeight`"
							class="weight-item"
						>
							<el-input
								v-model="row.cartonNetWeight"
								:placeholder="$t('请输入')"
								@blur="
									handleBlurClearCache(
										props.cartonInfoUnitSystem,
										row.cartonNetWeight,
										'cartonNetWeight',
										$index
									)
								"
								size="default"
							/>
						</el-form-item>
						<el-form-item
							:prop="`tableData.${$index}.cartonNetWeightUnit`"
							class="unit-item"
						>
							<el-select
								v-model="row.cartonNetWeightUnit"
								filterable
								placeholder="请选择"
								size="default"
								class="el-select-background"
							>
								<el-option
									v-for="item in currentWeightUnits"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</div>
				</template>
			</el-table-column>

			<el-table-column width="200" align="center">
				<template #header>
					<div
						style="
							display: flex;
							align-items: center;
							justify-content: center;
							gap: 8px;
						"
					>
						<span
							:style="{
								color: '#f78c8c',
								marginRight: '3px',
							}"
							>*
						</span>
						<span>{{ $t('单柜装箱数量') }}</span>
						<MessageComponent
							:title="$t('批量填写单柜装箱数量')"
							@submit="handleBatchContainerQtySubmit"
							@init="
								() => {
									batchContainerQtyData = {
										containerCartonQty: '',
										containerCartonQtyUnit: 'carton',
									};
								}
							"
						>
							<template #input>
								<div class="batch-input-group">
									<el-input
										v-model="batchContainerQtyData.containerCartonQty"
										:placeholder="$t('请输入')"
										size="default"
										style="width: 260px"
									/>
								</div>
							</template>
						</MessageComponent>
					</div>
				</template>
				<template #default="{ row, $index }">
					<div class="container-input-group">
						<el-form-item
							:prop="`tableData.${$index}.containerCartonQty`"
							class="container-item"
						>
							<el-input
								v-model="row.containerCartonQty"
								:placeholder="$t('请输入')"
								size="default"
							/>
						</el-form-item>
						<el-form-item
							:prop="`tableData.${$index}.containerCartonQtyUnit`"
							class="unit-item"
						>
							<el-select
								v-model="row.containerCartonQtyUnit"
								filterable
								placeholder="请选择"
								size="default"
								class="el-select-background"
							>
								<el-option
									v-for="item in [{ label: '箱', value: 'carton' }]"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</div>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<style scoped lang="scss">
.box {
	padding: 10px;
	border-radius: 5px;
	.span {
		margin: 0 8px;
	}
}
.single-carton-info {
	margin: 0 15px;
}
/* 保持原有的下拉框样式 */
.el-select-background {
	:deep(.el-select__wrapper) {
		background-color: #f0f0f0 !important;
	}

	:deep(.el-input__inner:hover) {
		background-color: #e0e0e0 !important;
	}
}

/* 自定义表格样式 - 确保行对齐 */
.custom-table {
	:deep(.el-table__row) {
		height: 100px; /* 增大行高以容纳错误信息 */
	}

	:deep(.el-table__cell) {
		padding: 8px 4px; /* 适中的内边距 */
		vertical-align: middle; /* 垂直居中对齐 */
	}

	:deep(.cell) {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 80px;
	}
}

/* 输入组件样式 */
.spec-input-group,
.quantity-input-group,
.weight-input-group,
.container-input-group {
	display: flex;
	align-items: flex-start;
	justify-content: center;
	width: 100%;
}

.spec-item {
	width: 120px;
	margin-bottom: 0;
}

.quantity-item,
.weight-item,
.container-item {
	width: 120px;
	margin-bottom: 0;
}

.unit-item {
	width: 80px;
	margin-bottom: 0;
}

.spec-separator {
	display: flex;
	align-items: center;
	height: 32px;
	font-size: 14px;
	color: #666;
	padding: 0 2px;
}

/* 错误样式 */
.is-error {
	:deep(.el-input__wrapper) {
		border-color: #f56c6c !important;
		box-shadow: 0 0 0 1px #f56c6c inset !important;
	}
}

.error-message {
	color: #f56c6c;
	font-size: 12px;
	line-height: 1;
	padding-top: 2px;
	position: absolute;
	top: 100%;
	left: 0;
	width: 100%;
	z-index: 1;
}

/* 表单项样式 */
.el-form-item {
	margin-bottom: 0;
	position: relative;
}

:deep(.el-form-item__content) {
	display: flex;
	align-items: flex-start;
	justify-content: center;
}

:deep(.el-input.is-default .el-input__wrapper) {
	height: 32px;
	font-size: 14px;
}

:deep(.el-select.is-default .el-input__wrapper) {
	height: 32px;
	font-size: 14px;
}

.font-bold {
	font-weight: bold;
}

.mb-0 {
	margin-bottom: 0 !important;
}

.mt-4 {
	margin-top: 16px;
}

.mb-4 {
	margin-bottom: 16px;
}

/* 批量填写外箱规格样式 */
.batch-spec-input {
	width: 100%;
}

.batch-spec-row {
	display: flex;
	align-items: center;
	gap: 8px;
	justify-content: center;
}

/* 批量填写通用样式 */
.batch-input-group {
	display: flex;
	align-items: center;
	gap: 8px;
	justify-content: center;
	width: 100%;
}
</style>
