<template>
	<div class="single-carton-info">
		<!-- 公英制切换tab -->
		<el-tabs v-model="cartonUnitType" class="mb-4" @tab-click="handleClick">
			<el-tab-pane label="公制" name="1"></el-tab-pane>
			<el-tab-pane label="英制" name="2"></el-tab-pane>
		</el-tabs>

		<!-- 编辑模式 -->
		<el-form
			ref="dataFormRef"
			:model="localFormData"
			:rules="purchaseInfoRule"
			v-if="props.visibleType !== 'view'"
		>
			<el-table
				:data="tableData"
				border
				style="width: 100%"
				class="custom-table"
				native-scrollbar
			>
				<el-table-column label="箱规编码" width="150" align="center">
					<template #default="{ $index }">
						<span>{{ getCartonCode($index) }}</span>
					</template>
				</el-table-column>

				<el-table-column width="380" align="center">
					<template #header>
						<span
							:style="{
								color: '#f78c8c',
								marginRight: '3px',
							}"
							>*
						</span>
						{{ $t('外箱规格') }}
					</template>
					<template #default="{ row, $index }">
						<div class="spec-input-group">
							<el-form-item
								:prop="`tableData.${$index}.outCartonSpecLength`"
								class="spec-item"
							>
								<el-input
									v-model="row.outCartonSpecLength"
									:disabled="!auth('bundle_edit_singlecarton')"
									:placeholder="$t('长')"
									size="default"
									@blur="validateRowField($index, 'outCartonSpecLength')"
									:class="{
										'is-error': fieldErrors[`${$index}-outCartonSpecLength`],
									}"
								/>
								<div
									v-if="fieldErrors[`${$index}-outCartonSpecLength`]"
									class="error-message"
								>
									{{ fieldErrors[`${$index}-outCartonSpecLength`] }}
								</div>
							</el-form-item>
							<el-form-item
								:prop="`tableData.${$index}.outCartonSpecWidth`"
								class="spec-item"
							>
								<el-input
									v-model="row.outCartonSpecWidth"
									:placeholder="$t('宽')"
									:disabled="!auth('bundle_edit_singlecarton')"
									size="default"
									@blur="validateRowField($index, 'outCartonSpecWidth')"
									:class="{
										'is-error': fieldErrors[`${$index}-outCartonSpecWidth`],
									}"
								/>
								<div
									v-if="fieldErrors[`${$index}-outCartonSpecWidth`]"
									class="error-message"
								>
									{{ fieldErrors[`${$index}-outCartonSpecWidth`] }}
								</div>
							</el-form-item>
							<el-form-item
								:prop="`tableData.${$index}.outCartonSpecHeight`"
								class="spec-item"
							>
								<el-input
									v-model="row.outCartonSpecHeight"
									:placeholder="$t('高')"
									:disabled="!auth('bundle_edit_singlecarton')"
									size="default"
									@blur="validateRowField($index, 'outCartonSpecHeight')"
									:class="{
										'is-error': fieldErrors[`${$index}-outCartonSpecHeight`],
									}"
								/>
								<div
									v-if="fieldErrors[`${$index}-outCartonSpecHeight`]"
									class="error-message"
								>
									{{ fieldErrors[`${$index}-outCartonSpecHeight`] }}
								</div>
							</el-form-item>
							<el-form-item
								:prop="`tableData.${$index}.outCartonSpecUnit`"
								class="unit-item"
							>
								<el-select
									v-model="row.outCartonSpecUnit"
									:disabled="!auth('bundle_edit_singlecarton')"
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
						<span
							:style="{
								color: '#f78c8c',
								marginRight: '3px',
							}"
							>*
						</span>
						{{ $t('单箱数量') }}
					</template>
					<template #default="{ row, $index }">
						<div class="quantity-input-group">
							<el-form-item
								:prop="`tableData.${$index}.cartonQty`"
								class="quantity-item"
							>
								<el-input
									v-model="row.cartonQty"
									:disabled="!auth('bundle_edit_singlecarton')"
									:placeholder="$t('请输入')"
									size="default"
									@blur="validateRowField($index, 'cartonQty')"
									:class="{ 'is-error': fieldErrors[`${$index}-cartonQty`] }"
								/>
								<div
									v-if="fieldErrors[`${$index}-cartonQty`]"
									class="error-message"
								>
									{{ fieldErrors[`${$index}-cartonQty`] }}
								</div>
							</el-form-item>
							<el-form-item
								:prop="`tableData.${$index}.cartonQtyUnit`"
								class="unit-item"
							>
								<el-select
									v-model="row.cartonQtyUnit"
									:disabled="!auth('bundle_edit_singlecarton')"
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

				<el-table-column width="200" align="center">
					<template #header>
						<span
							:style="{
								color: '#f78c8c',
								marginRight: '3px',
							}"
							>*
						</span>
						{{ $t('单箱毛重') }}
					</template>
					<template #default="{ row, $index }">
						<div class="weight-input-group">
							<el-form-item
								:prop="`tableData.${$index}.cartonGrossWeight`"
								class="weight-item"
							>
								<el-input
									v-model="row.cartonGrossWeight"
									:disabled="!auth('bundle_edit_singlecarton')"
									:placeholder="$t('请输入')"
									size="default"
									@blur="validateRowField($index, 'cartonGrossWeight')"
									:class="{
										'is-error': fieldErrors[`${$index}-cartonGrossWeight`],
									}"
								/>
								<div
									v-if="fieldErrors[`${$index}-cartonGrossWeight`]"
									class="error-message"
								>
									{{ fieldErrors[`${$index}-cartonGrossWeight`] }}
								</div>
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
						<span
							:style="{
								color: '#f78c8c',
								marginRight: '3px',
							}"
							>*
						</span>
						{{ $t('单箱净重') }}
					</template>
					<template #default="{ row, $index }">
						<div class="weight-input-group">
							<el-form-item
								:prop="`tableData.${$index}.cartonNetWeight`"
								class="weight-item"
							>
								<el-input
									v-model="row.cartonNetWeight"
									:disabled="!auth('bundle_edit_singlecarton')"
									:placeholder="$t('请输入')"
									size="default"
									@blur="validateRowField($index, 'cartonNetWeight')"
									:class="{
										'is-error': fieldErrors[`${$index}-cartonNetWeight`],
									}"
								/>
								<div
									v-if="fieldErrors[`${$index}-cartonNetWeight`]"
									class="error-message"
								>
									{{ fieldErrors[`${$index}-cartonNetWeight`] }}
								</div>
							</el-form-item>
							<el-form-item
								:prop="`tableData.${$index}.cartonNetWeightUnit`"
								class="unit-item"
							>
								<el-select
									v-model="row.cartonNetWeightUnit"
									:disabled="!auth('bundle_edit_singlecarton')"
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
						<span
							:style="{
								color: '#f78c8c',
								marginRight: '3px',
							}"
							>*
						</span>
						{{ $t('单柜装箱数量') }}
					</template>
					<template #default="{ row, $index }">
						<div class="container-input-group">
							<el-form-item
								:prop="`tableData.${$index}.containerCartonQty`"
								class="container-item"
							>
								<el-input
									v-model="row.containerCartonQty"
									:disabled="!auth('bundle_edit_singlecarton')"
									:placeholder="$t('请输入')"
									size="default"
									@blur="validateRowField($index, 'containerCartonQty')"
									:class="{
										'is-error': fieldErrors[`${$index}-containerCartonQty`],
									}"
								/>
								<div
									v-if="fieldErrors[`${$index}-containerCartonQty`]"
									class="error-message"
								>
									{{ fieldErrors[`${$index}-containerCartonQty`] }}
								</div>
							</el-form-item>
							<el-form-item
								:prop="`tableData.${$index}.containerCartonQtyUnit`"
								class="unit-item"
							>
								<el-select
									v-model="row.containerCartonQtyUnit"
									:disabled="!auth('bundle_edit_singlecarton')"
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

				<el-table-column label="操作" width="100" align="center">
					<template #default="{ row, $index }">
						<el-button
							type="danger"
							size="small"
							@click="removeRow($index)"
							:disabled="!!row.id || !auth('bundle_edit_singlecarton')"
						>
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>

			<!-- 添加按钮 -->
			<div class="mt-4">
				<el-button
					type="primary"
					@click="addRow"
					:icon="Plus"
					:disabled="!auth('bundle_edit_singlecarton')"
				></el-button>
			</div>
		</el-form>

		<!-- 查看模式 -->
		<el-form ref="dataFormRef" :model="localFormData" v-else>
			<el-table :data="viewTableData" border style="width: 100%">
				<el-table-column label="箱规编码" width="183" align="center">
					<template #default="{ row }">
						<span>{{ row.bundleCartonCode }}</span>
					</template>
				</el-table-column>

				<el-table-column label="外箱规格" width="380" align="center">
					<template #default="{ row }">
						<span class="font-bold">
							{{ row.outCartonSpecLength }} × {{ row.outCartonSpecWidth }} ×
							{{ row.outCartonSpecHeight }}
							{{ getUnitLabel(row.outCartonSpecUnit, currentSpecUnits) }}
						</span>
					</template>
				</el-table-column>

				<el-table-column label="单箱数量" width="150" align="center">
					<template #default="{ row }">
						<span class="font-bold"
							>{{ row.cartonQty }}
							{{
								getUnitLabel(row.cartonQtyUnit, [
									{ label: 'pcs', value: 'pcs' },
								])
							}}</span
						>
					</template>
				</el-table-column>

				<el-table-column label="单箱毛重" width="150" align="center">
					<template #default="{ row }">
						<span class="font-bold">
							{{ row.cartonGrossWeight }}
							{{ getUnitLabel(row.cartonGrossWeightUnit, currentWeightUnits) }}
						</span>
					</template>
				</el-table-column>

				<el-table-column label="单箱净重" width="150" align="center">
					<template #default="{ row }">
						<span class="font-bold">
							{{ row.cartonNetWeight }}
							{{ getUnitLabel(row.cartonNetWeightUnit, currentWeightUnits) }}
						</span>
					</template>
				</el-table-column>

				<el-table-column label="单柜装箱数量" width="150" align="center">
					<template #default="{ row }">
						<span class="font-bold">
							{{ row.containerCartonQty }}
							{{
								getUnitLabel(row.containerCartonQtyUnit, [
									{ label: '箱', value: 'carton' },
								])
							}}
						</span>
					</template>
				</el-table-column>

				<el-table-column label="操作" width="100" align="center">
					<template #default="{ row }">
						<span class="font-bold">
							{{ row.updateTime }}
						</span>
					</template>
				</el-table-column>
			</el-table>
		</el-form>
	</div>
</template>

<script setup lang="ts">
import { ref, defineExpose, onMounted, computed } from 'vue';
import { Rule } from '@form-create/element-ui';
import { rule } from '/@/utils/validate';
import { Plus } from '@element-plus/icons-vue';
import { cartonUnitConvert } from '/@/api/product/sku';
import { useMessage } from '/@/hooks/message';
import { auth } from '/@/utils/authFunction';
const props = defineProps({
	dictMap: {
		type: Object,
		default: () => ({}),
	},
	visibleType: {
		type: String,
		default: '', // edit, view, copy
	},
	bundleCode: {
		type: String,
		default: '',
	},
});

// 公英制切换
const cartonUnitType = ref('1');

//  当前form的ref
const dataFormRef = ref();

// 错误信息存储
const fieldErrors = ref<Record<string, string>>({});

// 当前验证的行索引
// let currentValidatingRowIndex = -1;

// 获取当前验证的行索引
// const getCurrentRowIndex = () => {
// 	return currentValidatingRowIndex;
// };

// 当前form的数据
const localFormData = ref({
	// 箱规信息列表
	productBundleCartons: [] as any[],
});

// 公制和英制单位定义
const metricUnits = {
	spec: [{ label: 'cm', value: 'cm' }],
	weight: [{ label: 'kg', value: 'kg' }],
};

const imperialUnits = {
	spec: [{ label: 'inch', value: 'inch' }],
	weight: [{ label: 'lbs', value: 'lbs' }],
};

// 当前单位选项
const currentSpecUnits = computed(() => {
	return cartonUnitType.value === '1' ? metricUnits.spec : imperialUnits.spec;
});

const currentWeightUnits = computed(() => {
	return cartonUnitType.value === '1'
		? metricUnits.weight
		: imperialUnits.weight;
});

// 表格数据（编辑模式）
const tableData = computed({
	get: () => localFormData.value.productBundleCartons || [],
	set: (value) => {
		localFormData.value.productBundleCartons = value;
	},
});

// 表格数据（查看模式）
const viewTableData = computed(
	() => localFormData.value.productBundleCartons || []
);

// 获取单位标签
const getUnitLabel = (value: string, units: any[]) => {
	const unit = units.find((item) => item.value === value);
	return unit?.label || value;
};

const handleClick = async (tab: any) => {
	// 需要转换的字段
	const valueFields = [
		'outCartonSpecLength',
		'outCartonSpecWidth',
		'outCartonSpecHeight',
		'cartonNetWeight',
		'cartonGrossWeight',
	];

	// 记录切换前的单位类型（用于失败回退）
	const prevUnitType = cartonUnitType.value;

	// 收集需要转换的行索引和数据
	const rowsToConvert = tableData.value
		.map((row, idx) => ({
			idx,
			data: valueFields.some(
				(f) => row[f] !== '' && row[f] !== null && row[f] !== undefined
			)
				? {
						outCartonSpecLength:
							row.outCartonSpecLength === ''
								? null
								: Number(row.outCartonSpecLength),
						outCartonSpecWidth:
							row.outCartonSpecWidth === ''
								? null
								: Number(row.outCartonSpecWidth),
						outCartonSpecHeight:
							row.outCartonSpecHeight === ''
								? null
								: Number(row.outCartonSpecHeight),
						cartonNetWeight:
							row.cartonNetWeight === '' ? null : Number(row.cartonNetWeight),
						cartonGrossWeight:
							row.cartonGrossWeight === ''
								? null
								: Number(row.cartonGrossWeight),
				  }
				: null,
		}))
		.filter((item) => item.data);

	// 没有需要转换的行，仅切单位
	if (rowsToConvert.length === 0) {
		updateUnitsOnly();
		return;
	}

	try {
		const res = await cartonUnitConvert({
			fromCartonUnitType: cartonUnitType.value,
			cartonSpecs: rowsToConvert.map((item) => item.data),
			toCartonUnitType: tab.paneName,
		});
		const convertedList = Array.isArray(res?.data?.cartonSpecs)
			? res.data.cartonSpecs
			: [];

		// 如果接口未返回数据，回退到原tab
		if (convertedList.length === 0) {
			useMessage().error('单位转换失败：无返回数据');
			cartonUnitType.value = prevUnitType;
			return;
		}

		// 回显转换后的数据
		rowsToConvert.forEach((item, i) => {
			const row = tableData.value[item.idx];
			const v = convertedList[i] || {};
			row.outCartonSpecLength = v.outCartonSpecLength ?? '';
			row.outCartonSpecWidth = v.outCartonSpecWidth ?? '';
			row.outCartonSpecHeight = v.outCartonSpecHeight ?? '';
			row.cartonNetWeight = v.cartonNetWeight ?? '';
			row.cartonGrossWeight = v.cartonGrossWeight ?? '';
			updateRowUnits(row);
		});
	} catch (e) {
		// 调用失败，回退到原tab
		useMessage().error('单位转换失败');
		cartonUnitType.value = prevUnitType;
		return;
	}
};

// 只更新单位选项（不调用接口）
const updateUnitsOnly = () => {
	tableData.value.forEach((row) => {
		updateRowUnits(row);
	});
};

// 更新单行的单位
const updateRowUnits = async (row: any) => {
	await new Promise((resolve) => setTimeout(resolve));
	if (cartonUnitType.value === '1') {
		// 切换到公制
		row.outCartonSpecUnit = metricUnits.spec[0]?.value || 'cm';
		row.cartonGrossWeightUnit = metricUnits.weight[0]?.value || 'kg';
		row.cartonNetWeightUnit = metricUnits.weight[0]?.value || 'kg';
	} else {
		// 切换到英制
		row.outCartonSpecUnit = imperialUnits.spec[0]?.value || 'inch';
		row.cartonGrossWeightUnit = imperialUnits.weight[0]?.value || 'lbs';
		row.cartonNetWeightUnit = imperialUnits.weight[0]?.value || 'lbs';
	}
};

const getCartonCode = (index: number) => {
	// 新增模式或新增行的编码生成逻辑
	if (!props.bundleCode) {
		return '';
	}

	// 第一行直接使用skuCode，后续行使用skuCode-序号
	if (index === 0) {
		return props.bundleCode;
	} else {
		// 从01开始递增（两位补零）
		const suffix = String(index).padStart(2, '0');
		return `${props.bundleCode}-${suffix}`;
	}
};

// 添加行
const addRow = () => {
	const newRow = {
		bundleCartonCode: '', // 编码留空，由getCartonCode生成
		outCartonSpecLength: '',
		outCartonSpecWidth: '',
		outCartonSpecHeight: '',
		outCartonSpecUnit: cartonUnitType.value === '1' ? 'cm' : 'inch',
		cartonQty: '',
		cartonQtyUnit: 'pcs',
		cartonGrossWeight: '',
		cartonGrossWeightUnit: cartonUnitType.value === '1' ? 'kg' : 'lbs',
		cartonNetWeight: '',
		cartonNetWeightUnit: cartonUnitType.value === '1' ? 'kg' : 'lbs',
		containerCartonQty: '',
		containerCartonQtyUnit: 'carton',
	};
	tableData.value.push(newRow);
};

// 删除行
const removeRow = (index: number) => {
	tableData.value.splice(index, 1);
	// 清除该行的验证错误
	Object.keys(fieldErrors.value).forEach((key) => {
		if (key.startsWith(`${index}-`)) {
			delete fieldErrors.value[key];
		}
	});
};

// 手动验证字段
const validateRowField = async (rowIndex: number, fieldName: string) => {
	const fieldKey = `${rowIndex}-${fieldName}`;
	const value = tableData.value[rowIndex][fieldName];

	try {
		// 设置当前验证的行索引
		// currentValidatingRowIndex = rowIndex;

		// 根据字段名获取验证规则
		const rules = getFieldRules(fieldName);

		for (const rule of rules) {
			if (rule.required && (!value || value === '')) {
				fieldErrors.value[fieldKey] = rule.message || '此字段为必填项';
				return;
			}

			if (rule.validator && value) {
				await new Promise((resolve, reject) => {
					rule.validator(rule, value, (error?: Error) => {
						if (error) {
							reject(error);
						} else {
							resolve(undefined);
						}
					});
				});
			}
		}

		// 如果没有错误，清除错误信息
		delete fieldErrors.value[fieldKey];
	} catch (error: any) {
		fieldErrors.value[fieldKey] = error.message || '验证失败';
	} finally {
		// 重置当前验证的行索引
		// currentValidatingRowIndex = -1;
	}
};

// 获取字段验证规则
const getFieldRules = (fieldName: string) => {
	const rulesMap: Record<string, any[]> = {
		outCartonSpecLength: [
			{ required: true, message: '请输入长度', trigger: 'blur' },
			{ validator: maxTwoDecimalPlaces, trigger: 'blur' },
		],
		outCartonSpecWidth: [
			{ required: true, message: '请输入宽度', trigger: 'blur' },
			{ validator: maxTwoDecimalPlaces, trigger: 'blur' },
			// {
			// 	// 宽不能大于长度的验证规则
			// 	validator: (rule: Rule, value: string, callback: Function) => {
			// 		const rowIndex = getCurrentRowIndex();
			// 		if (rowIndex === -1) return callback();

			// 		const outCartonSpecLength = Number(tableData.value[rowIndex].outCartonSpecLength); // 使用当前长度的值进行比较
			// 		const outCartonSpecWidth = Number(value); // 使用当前宽度的值进行比较
			// 		if (!outCartonSpecLength) {
			// 			return callback(); // 如果长度未填写，则不进行校验
			// 		}
			// 		if (value && outCartonSpecWidth > outCartonSpecLength) {
			// 			callback(new Error('不能大于长'));
			// 		} else {
			// 			callback();
			// 		}
			// 	},
			// 	trigger: 'blur',
			// },
		],
		outCartonSpecHeight: [
			{ required: true, message: '请输入高度', trigger: 'blur' },
			{ validator: maxTwoDecimalPlaces, trigger: 'blur' },
			// {
			// 	// 高度不能大于宽度的验证规则
			// 	validator: (rule: Rule, value: string, callback: Function) => {
			// 		const rowIndex = getCurrentRowIndex();
			// 		if (rowIndex === -1) return callback();

			// 		const outCartonSpecHeight = Number(value); // 使用当前高度的值进行比较
			// 		const outCartonSpecWidth = Number(tableData.value[rowIndex].outCartonSpecWidth);
			// 		if (!outCartonSpecWidth) {
			// 			return callback(); // 如果宽度未填写，则不进行校验
			// 		}
			// 		if (value && outCartonSpecHeight > outCartonSpecWidth) {
			// 			callback(new Error('不能大于宽'));
			// 		} else {
			// 			callback();
			// 		}
			// 	},
			// 	trigger: 'blur',
			// },
		],
		cartonQty: [
			{ required: true, message: '请输入单箱数量', trigger: 'blur' },
			{ validator: rule.number },
			{
				// 只允许整数
				validator(rule: any, value: string | null, callback: Function) {
					if (value == null || value === '') {
						return callback(); // 交给 required 去校验
					}
					if (!Number.isInteger(Number(value))) {
						return callback(new Error('只能输入整数'));
					}
					// 直接添加正整数
					if (Number(value) <= 0) {
						return callback(new Error('只能输入正整数'));
					}
					callback();
				},
				trigger: 'blur',
			},
		],
		cartonGrossWeight: [
			{ required: true, message: '请输入单箱毛重', trigger: 'blur' },
			{ validator: rule.number },
			{ validator: maxFourDecimalPlaces, trigger: 'blur' },
		],
		cartonNetWeight: [
			{ required: true, message: '请输入单箱净重', trigger: 'blur' },
			{ validator: rule.number },
			{ validator: maxFourDecimalPlaces, trigger: 'blur' },
		],
		containerCartonQty: [
			{ required: true, message: '请输入单柜装箱数', trigger: 'blur' },
			{ validator: rule.number },
			{
				// 只允许整数
				validator(rule: any, value: string | null, callback: Function) {
					if (value == null || value === '') {
						return callback(); // 交给 required 去校验
					}
					if (!Number.isInteger(Number(value))) {
						return callback(new Error('只能输入整数'));
					}
					// 直接添加正整数
					if (Number(value) <= 0) {
						return callback(new Error('只能输入正整数'));
					}
					callback();
				},
				trigger: 'blur',
			},
		],
	};

	return rulesMap[fieldName] || [];
};

/**
 * 校验数字最多允许2位小数的验证规则
 */
const maxTwoDecimalPlaces = (rule: Rule, value: string, callback: Function) => {
	if (value && !/^\d+(\.\d{1,2})?$/.test(value)) {
		callback(new Error('最多允许2位小数'));
	} else {
		callback();
	}
};

/**
 * 校验数字最多允许4位小数的验证规则
 */
const maxFourDecimalPlaces = (
	rule: Rule,
	value: string,
	callback: Function
) => {
	if (value && !/^\d+(\.\d{1,4})?$/.test(value)) {
		callback(new Error('最多允许4位小数'));
	} else {
		callback();
	}
};

const purchaseInfoRule = {};

// 重置所有状态
const resetAllState = async () => {
	// 重置表单数据
	localFormData.value = {
		productBundleCartons: [],
	};

	// 重置公英制切换
	cartonUnitType.value = '1';
	// 清除验证错误
	fieldErrors.value = {};

	// 清除表单验证状态
	if (dataFormRef.value) {
		dataFormRef.value.clearValidate();
	}
};

onMounted(() => {});

// 设置数据方法，用于新增、编辑、复制时的数据回显
const setData = async (data: any) => {
	resetAllState();

	// 父层已标准化数据：仅做直接赋值，减少重复映射
	if (data && typeof data.cartonUnitType !== 'undefined') {
		cartonUnitType.value = String(data.cartonUnitType);
	}
	// 兼容两种入参：数组 或 { productBundleCartons: [...] }
	if (Array.isArray(data)) {
		localFormData.value.productBundleCartons = data as any[];
	} else if (Array.isArray(data?.productBundleCartons)) {
		localFormData.value.productBundleCartons =
			data.productBundleCartons as any[];
	}
};

// 获取表单数据的方法，供父组件提交时调用
const getFormData = () => {
	return {
		cartonUnitType: cartonUnitType.value, // 添加单位类型
		productBundleCartons: localFormData.value.productBundleCartons.map(
			(item) => ({
				...item,
				bundleCartonCode: getCartonCode(tableData.value.indexOf(item)),
				// 确保数字字段为数字类型
				cartonQty: item.cartonQty ? Number(item.cartonQty) : null,
				outCartonSpecLength: item.outCartonSpecLength
					? Number(item.outCartonSpecLength)
					: null,
				outCartonSpecWidth: item.outCartonSpecWidth
					? Number(item.outCartonSpecWidth)
					: null,
				outCartonSpecHeight: item.outCartonSpecHeight
					? Number(item.outCartonSpecHeight)
					: null,
				cartonGrossWeight: item.cartonGrossWeight
					? Number(item.cartonGrossWeight)
					: null,
				cartonNetWeight: item.cartonNetWeight
					? Number(item.cartonNetWeight)
					: null,
				containerCartonQty: item.containerCartonQty
					? Number(item.containerCartonQty)
					: null,
			})
		),
	};
};

// 验证整个表单
const validateAll = async () => {
	let hasError = false;

	for (let i = 0; i < tableData.value.length; i++) {
		const row = tableData.value[i];
		const requiredFields = [
			'outCartonSpecLength',
			'outCartonSpecWidth',
			'outCartonSpecHeight',
			'cartonQty',
			'cartonGrossWeight',
			'cartonNetWeight',
			'containerCartonQty',
		];

		for (const field of requiredFields) {
			if (!row[field] || row[field] === '') {
				const fieldKey = `${i}-${field}`;
				fieldErrors.value[fieldKey] = '此字段为必填项';
				hasError = true;
			} else {
				await validateRowField(i, field);
				if (fieldErrors.value[`${i}-${field}`]) {
					hasError = true;
				}
			}
		}
	}

	return !hasError;
};

defineExpose({
	dataFormRef,
	localFormData,
	setData,
	resetAllState,
	getFormData,
	validateAll,
});
</script>

<style lang="scss" scoped>
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
</style>
