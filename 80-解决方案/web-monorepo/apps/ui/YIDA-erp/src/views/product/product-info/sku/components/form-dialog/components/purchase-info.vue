<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-09 15:18:34
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-20 16:07:28
 * @FilePath: \qianyi-ui\src\views\product\product-info\sku\components\form-dialog\components\purchase-info.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template>
	<div class="perchase-info" style="margin: 0 15px">
		<el-tabs v-model="puchaseUnitType" class="mb-4">
			<el-tab-pane label="公制" name="1"></el-tab-pane>
			<el-tab-pane label="英制" name="2"></el-tab-pane>
		</el-tabs>
		<el-form
			ref="dataFormRef"
			:model="localFormData"
			label-width="100px"
			:rules="purchaseInfoRule"
			v-if="props.visibleType !== 'view' && props.visibleType !== 'spuView'"
		>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item :label="$t('采购负责人')" prop="purchaseManageId">
						<el-select
							v-model="localFormData.purchaseManageId"
							filterable
							placeholder="请选择"
							:disabled="!auth('sku_edit_purchase')"
						>
							<el-option
								v-for="item in props.dictMap.productManageId"
								:key="item.userId"
								:label="item.name"
								:value="item.userId"
							/>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item :label="$t('采购交期')" prop="purchaseLeadTime">
						<el-input
							v-model="localFormData.purchaseLeadTime"
							:placeholder="$t('请输入')"
							:disabled="!auth('sku_edit_purchase')"
						>
							<template #append>
								<el-form-item prop="purchaseLeadTimeUnit">
									<el-select
										v-model="localFormData.purchaseLeadTimeUnit"
										:disabled="!auth('sku_edit_purchase')"
										filterable
										placeholder="请选择"
										:style="{
											width: '75px',
										}"
										class="el-select-background"
									>
										<el-option
											v-for="item in props.dictMap.purchaseLeadTimeUnit"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										/>
									</el-select>
								</el-form-item>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item :label="$t('参考成本')" prop="referenceCost">
						<el-input
							v-model="localFormData.referenceCost"
							:placeholder="$t('请输入')"
							:disabled="!auth('sku_edit_purchase')"
						>
							<template #append>
								<el-form-item prop="referenceCostUnit">
									<el-select
										v-model="localFormData.referenceCostUnit"
										:disabled="!auth('sku_edit_purchase')"
										filterable
										placeholder="请选择"
										:style="{
											width: '75px',
										}"
										class="el-select-background"
									>
										<el-option
											v-for="item in props.dictMap.referenceCostUnit"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										/>
									</el-select>
								</el-form-item> </template
						></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item>
						<template #label>
							<span
								:style="{
									color: '#f78c8c',
									marginRight: '3px',
								}"
								>*
							</span>
							{{ $t('单品规格') }}
						</template>
						<el-row>
							<el-col :span="6">
								<el-form-item prop="itemSpecLength">
									<el-input
										v-model="localFormData.itemSpecLength"
										:placeholder="$t('长')"
										:disabled="!auth('sku_edit_purchase')"
										@blur="
											handleBlurClearCache(
												puchaseUnitType,
												localFormData.itemSpecLength,
												'itemSpecLength'
											)
										"
									></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item prop="itemSpecWidth">
									<el-input
										v-model="localFormData.itemSpecWidth"
										:placeholder="$t('宽')"
										:disabled="!auth('sku_edit_purchase')"
										@blur="
											handleBlurClearCache(
												puchaseUnitType,
												localFormData.itemSpecWidth,
												'itemSpecWidth'
											)
										"
									></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item prop="itemSpecHeight">
									<el-input
										v-model="localFormData.itemSpecHeight"
										:placeholder="$t('高')"
										:disabled="!auth('sku_edit_purchase')"
										@blur="
											handleBlurClearCache(
												puchaseUnitType,
												localFormData.itemSpecHeight,
												'itemSpecHeight'
											)
										"
									></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item prop="itemSpecUnit">
									<el-select
										v-model="localFormData.itemSpecUnit"
										:disabled="!auth('sku_edit_purchase')"
										filterable
										placeholder="请选择"
										:style="{
											width: '75px',
										}"
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
							</el-col>
						</el-row>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item>
						<template #label>
							<span
								:style="{
									color: '#f78c8c',
									marginRight: '3px',
								}"
								>*
							</span>
							{{ $t('包装规格') }}
						</template>
						<el-row>
							<el-col :span="6">
								<el-form-item prop="packSpecLength">
									<el-input
										v-model="localFormData.packSpecLength"
										:placeholder="$t('长')"
										:disabled="!auth('sku_edit_purchase')"
										@blur="
											handleBlurClearCache(
												puchaseUnitType,
												localFormData.packSpecLength,
												'packSpecLength'
											)
										"
									></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item prop="packSpecWidth">
									<el-input
										v-model="localFormData.packSpecWidth"
										:placeholder="$t('宽')"
										:disabled="!auth('sku_edit_purchase')"
										@blur="
											handleBlurClearCache(
												puchaseUnitType,
												localFormData.packSpecWidth,
												'packSpecWidth'
											)
										"
									></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item prop="packSpecHeight">
									<el-input
										v-model="localFormData.packSpecHeight"
										:placeholder="$t('高')"
										:disabled="!auth('sku_edit_purchase')"
										@blur="
											handleBlurClearCache(
												puchaseUnitType,
												localFormData.packSpecHeight,
												'packSpecHeight'
											)
										"
									></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item prop="packSpecUnit">
									<el-select
										v-model="localFormData.packSpecUnit"
										:disabled="!auth('sku_edit_purchase')"
										filterable
										placeholder="请选择"
										:style="{
											width: '75px',
										}"
										class="el-select-background"
									>
										<el-option
											v-for="item in props.dictMap.itemSpecUnit"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										/>
									</el-select> </el-form-item
							></el-col>
						</el-row>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item :label="$t('单品净重')" prop="itemNetWeight">
						<el-input
							v-model="localFormData.itemNetWeight"
							:placeholder="$t('请输入')"
							:disabled="!auth('sku_edit_purchase')"
							@blur="
								handleBlurClearCache(
									puchaseUnitType,
									localFormData.itemNetWeight,
									'itemNetWeight'
								)
							"
						>
							<template #append>
								<el-form-item prop="itemNetWeightUnit">
									<el-select
										v-model="localFormData.itemNetWeightUnit"
										:disabled="!auth('sku_edit_purchase')"
										filterable
										placeholder="请选择"
										:style="{
											width: '75px',
										}"
										class="el-select-background"
									>
										<el-option
											v-for="item in currentWeightUnits"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										/>
									</el-select>
								</el-form-item> </template
						></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item :label="$t('单品毛重')" prop="itemGrossWeight">
						<el-input
							v-model="localFormData.itemGrossWeight"
							:placeholder="$t('请输入')"
							:disabled="!auth('sku_edit_purchase')"
							@blur="
								handleBlurClearCache(
									puchaseUnitType,
									localFormData.itemGrossWeight,
									'itemGrossWeight'
								)
							"
						>
							<template #append>
								<el-form-item prop="itemGrossWeightUnit">
									<el-select
										v-model="localFormData.itemGrossWeightUnit"
										:disabled="!auth('sku_edit_purchase')"
										filterable
										placeholder="请选择"
										:style="{
											width: '75px',
										}"
										class="el-select-background"
									>
										<el-option
											v-for="item in currentWeightUnits"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										/>
									</el-select>
								</el-form-item> </template
						></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="24">
					<el-form-item :label="$t('采购备注')" prop="purchaseRemark">
						<el-input
							v-model="localFormData.purchaseRemark"
							:disabled="!auth('sku_edit_purchase')"
							:rows="3"
							maxlength="500"
							show-word-limit
							type="textarea"
							placeholder="采购备注"
						/> </el-form-item></el-col
			></el-row>
		</el-form>
		<el-form
			ref="dataFormRef"
			:model="localFormData"
			label-width="100px"
			v-else
		>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item :label="$t('采购负责人')" prop="purchaseManageId">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">
							{{
								findNode(
									props.dictMap.productManageId,
									'userId',
									localFormData.purchaseManageId
								)?.name
							}}</el-text
						>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item :label="$t('采购交期')" prop="purchaseLeadTime">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }"
							>{{ localFormData.purchaseLeadTime
							}}{{
								props.dictMap.purchaseLeadTimeUnit.find(
									(item: any) =>
										item.value === localFormData.purchaseLeadTimeUnit
								)?.label
							}}</el-text
						>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item :label="$t('参考成本')" prop="referenceCost">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }"
							>{{ localFormData.referenceCost
							}}{{
								props.dictMap.referenceCostUnit.find(
									(item: any) => item.value === localFormData.referenceCostUnit
								)?.label
							}}</el-text
						>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item :label="$t('单品规格')">
						<el-row>
							<el-col :span="7">
								<el-form-item prop="itemSpecLength">
									<el-text
										class=""
										:style="{ fontWeight: 'bold', width: '50px' }"
									>
										{{ `${localFormData.itemSpecLength} *` }}
									</el-text>
								</el-form-item>
							</el-col>
							<el-col :span="7">
								<el-form-item prop="itemSpecWidth">
									<el-text
										class=""
										:style="{ fontWeight: 'bold', width: '50px' }"
									>
										{{ `${localFormData.itemSpecWidth} *` }}
									</el-text>
								</el-form-item>
							</el-col>
							<el-col :span="7">
								<el-form-item prop="itemSpecHeight">
									<el-text class="" :style="{ fontWeight: 'bold' }">
										{{ localFormData.itemSpecHeight }}
									</el-text>
								</el-form-item>
							</el-col>
							<el-col :span="3">
								<el-form-item prop="itemSpecUnit">
									<el-text class="mx-1" :style="{ fontWeight: 'bold' }">
										{{
											currentSpecUnits.find(
												(item: any) => item.value === localFormData.itemSpecUnit
											)?.label
										}}
									</el-text>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item :label="$t('包装规格')">
						<el-row>
							<el-col :span="7">
								<el-form-item prop="packSpecLength">
									<el-text
										class=""
										:style="{ fontWeight: 'bold', width: '50px' }"
									>
										{{ localFormData.packSpecLength }} *
									</el-text>
								</el-form-item>
							</el-col>
							<el-col :span="7">
								<el-form-item prop="packSpecWidth">
									<el-text
										class=""
										:style="{ fontWeight: 'bold', width: '50px' }"
									>
										{{ localFormData.packSpecWidth }} *
									</el-text>
								</el-form-item>
							</el-col>
							<el-col :span="7">
								<el-form-item prop="packSpecHeight">
									<el-text class="mx-1" :style="{ fontWeight: 'bold' }">
										{{ localFormData.packSpecHeight }}
									</el-text>
								</el-form-item>
							</el-col>
							<el-col :span="3">
								<el-form-item prop="packSpecUnit">
									<el-text class="mx-1" :style="{ fontWeight: 'bold' }">
										{{
											currentSpecUnits.find(
												(item: any) => item.value === localFormData.packSpecUnit
											)?.label
										}}
									</el-text>
								</el-form-item></el-col
							>
						</el-row>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item :label="$t('单品净重')" prop="itemNetWeight">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">
							{{ localFormData.itemNetWeight }}
							{{
								currentWeightUnits.find(
									(item: any) => item.value === localFormData.itemNetWeightUnit
								)?.label
							}}
						</el-text>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item :label="$t('单品毛重')" prop="itemGrossWeight">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">
							{{ localFormData.itemGrossWeight }}
							{{
								currentWeightUnits.find(
									(item: any) =>
										item.value === localFormData.itemGrossWeightUnit
								)?.label
							}}
						</el-text>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="24">
					<el-form-item :label="$t('采购备注')" prop="purchaseRemark">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">
							{{ localFormData.purchaseRemark }}
						</el-text>
					</el-form-item></el-col
				></el-row
			>
		</el-form>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Rule } from '@form-create/element-ui';
import { rule } from '/@/utils/validate';
import { findNode } from '/@/utils/arrayTree';
import { auth } from '/@/utils/authFunction';
import { useUnitConverter } from '/@/views/product/product-info/sku/components/form-dialog/utils/purchase-info';

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

const { autoConvertUnitFields, handleBlurClearCache } = useUnitConverter();
//  当前form的ref
const dataFormRef = ref();
// 当前form的数据
const localFormData = ref({
	// 采购负责人
	purchaseManageId: '',
	// 采购交期
	purchaseLeadTime: '',
	// 采购交期单位
	purchaseLeadTimeUnit: '',
	// 参考成本
	referenceCost: '',
	// 参考成本单位
	referenceCostUnit: '',
	// 单品规格的长宽高 长>宽>高
	itemSpecLength: '',
	itemSpecWidth: '',
	itemSpecHeight: '',
	// 单品规格的单位
	itemSpecUnit: '',
	// 包装规格的长宽高 长>宽>高
	packSpecLength: '',
	packSpecWidth: '',
	packSpecHeight: '',
	// 包装规格的单位
	packSpecUnit: '',
	// 单品净重
	itemNetWeight: '',
	// 单品净重单位
	itemNetWeightUnit: '',
	// 单品毛重
	itemGrossWeight: '',
	// 单品毛重单位
	itemGrossWeightUnit: '',
	// 采购交期单位
	purchaseRemark: '',
});

const puchaseUnitType = ref('1');

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
	return puchaseUnitType.value === '1' ? metricUnits.spec : imperialUnits.spec;
});

const currentWeightUnits = computed(() => {
	return puchaseUnitType.value === '1'
		? metricUnits.weight
		: imperialUnits.weight;
});

// const handleClick = async (tab: any) => {
// 	debugger;
// 	// 切换单位时，重置相关单位 click事件 puchaseUnitType.value值未改变
// 	const isMetric = tab.paneName === '1';
// 	localFormData.value.itemSpecUnit = isMetric
// 		? metricUnits.spec[0].value
// 		: imperialUnits.spec[0].value;
// 	localFormData.value.packSpecUnit = isMetric
// 		? metricUnits.spec[0].value
// 		: imperialUnits.spec[0].value;
// 	localFormData.value.itemNetWeightUnit = isMetric
// 		? metricUnits.weight[0].value
// 		: imperialUnits.weight[0].value;
// 	localFormData.value.itemGrossWeightUnit = isMetric
// 		? metricUnits.weight[0].value
// 		: imperialUnits.weight[0].value;
// 	const res = await purchaseUnitConvert({
// 		...localFormData.value,
// 		puchaseUnitType: puchaseUnitType.value,
// 		itemSpecUnit: localFormData.value.itemSpecUnit,
// 		packSpecUnit: localFormData.value.packSpecUnit,
// 		itemNetWeightUnit: localFormData.value.itemNetWeightUnit,
// 		itemGrossWeightUnit: localFormData.value.itemGrossWeightUnit,
// 		fromPuchaseUnitType: puchaseUnitType.value,
// 		toPuchaseUnitType: tab.paneName,
// 	});
// 	if (res.code === 0) {
// 		localFormData.value = {
// 			...localFormData.value,
// 			...res.data,
// 		};
// 	}
// };
watch(
	() => puchaseUnitType.value,
	async (newVal) => {
		await autoConvertUnitFields(
			newVal,
			[
				'itemSpecLength',
				'itemSpecWidth',
				'itemSpecHeight',
				'packSpecLength',
				'packSpecWidth',
				'packSpecHeight',
				'itemNetWeight',
				'itemGrossWeight',
			],
			localFormData
		);
	}
	// async (newVal, oldVal) => {
	// 	debugger;
	// 	// 切换单位时，重置相关单位
	// 	const isMetric = newVal === '1';
	// 	localFormData.value.itemSpecUnit = isMetric
	// 		? metricUnits.spec[0].value
	// 		: imperialUnits.spec[0].value;
	// 	localFormData.value.packSpecUnit = isMetric
	// 		? metricUnits.spec[0].value
	// 		: imperialUnits.spec[0].value;
	// 	localFormData.value.itemNetWeightUnit = isMetric
	// 		? metricUnits.weight[0].value
	// 		: imperialUnits.weight[0].value;
	// 	localFormData.value.itemGrossWeightUnit = isMetric
	// 		? metricUnits.weight[0].value
	// 		: imperialUnits.weight[0].value;
	// 	const res = await purchaseUnitConvert({
	// 		...localFormData.value,
	// 		puchaseUnitType: oldVal,
	// 		itemSpecUnit: localFormData.value.itemSpecUnit,
	// 		packSpecUnit: localFormData.value.packSpecUnit,
	// 		itemNetWeightUnit: localFormData.value.itemNetWeightUnit,
	// 		itemGrossWeightUnit: localFormData.value.itemGrossWeightUnit,
	// 		fromPuchaseUnitType: oldVal,
	// 		toPuchaseUnitType: newVal,
	// 	});
	// 	if (res.code === 0) {
	// 		localFormData.value = {
	// 			...localFormData.value,
	// 			...res.data,
	// 		};
	// 	}
	// }
);

/**
 * 校验数字最多允许2位小数的验证规则
 * @param rule
 * @param value
 * @param callback
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

const purchaseInfoRule = {
	// 采购负责人
	purchaseManageId: [
		// {
		// 	required: true,
		// 	message: '请选择采购负责人',
		// 	trigger: 'blur',
		// },
	],
	// 采购交期
	purchaseLeadTime: [
		{
			validator: rule.number,
		},
		{
			// 只允许整数
			validator(rule: any, value: string | null, callback: Function) {
				if (value == null || value === '') {
					return callback(); // 交给 required 去校验
				}
				if (!Number.isInteger(Number(value))) {
					return callback(new Error('只能输入整数'));
				}
				callback();
			},
			trigger: 'blur',
		},
	],
	// 参考成本
	referenceCost: [
		{
			validator: rule.number,
		},
		{
			// 允许4位小数的验证规则
			validator: maxFourDecimalPlaces,
			trigger: 'blur',
		},
	],
	// 单品规格的长宽高 长>宽>高
	itemSpecLength: [
		{ required: true, message: '请输入长度', trigger: 'blur' },
		{
			// 允许2位小数的验证规则
			validator: maxTwoDecimalPlaces,
			trigger: 'blur',
		},
	],
	itemSpecWidth: [
		{ required: true, message: '请输入宽度', trigger: 'blur' },
		{
			// 允许2位小数的验证规则
			validator: maxTwoDecimalPlaces,
			trigger: 'blur',
		},
		// {
		// 	// 宽不能大于长度的验证规则
		// 	validator: (rule: Rule, value: string, callback: Function) => {
		// 		const itemSpecLength = Number(localFormData.value.itemSpecLength);
		// 		const itemSpecWidth = Number(value);
		// 		// 如果未填写长度，则跳过此规则
		// 		if (!itemSpecLength) {
		// 			return callback();
		// 		}
		// 		// 如果宽大于等于长，提示错误
		// 		if (!isNaN(itemSpecWidth) && itemSpecWidth > itemSpecLength) {
		// 			return callback(new Error('不能大于长'));
		// 		}
		// 		callback();
		// 	},
		// 	trigger: 'blur',
		// },
	],
	itemSpecHeight: [
		{ required: true, message: '请输入高度', trigger: 'blur' },
		{
			// 允许2位小数的验证规则
			validator: maxTwoDecimalPlaces,
			trigger: 'blur',
		},
		// {
		// 	// 高度不能大于宽度的验证规则
		// 	validator: (rule: Rule, value: string, callback: Function) => {
		// 		const itemSpecHeight = Number(value); // 使用当前高度的值进行比较
		// 		// 获取宽度的值
		// 		const itemSpecWidth = Number(localFormData.value.itemSpecWidth);
		// 		if (!itemSpecWidth) {
		// 			return callback(); // 如果宽度未填写，则不进行校验
		// 		}
		// 		if (value && itemSpecHeight > itemSpecWidth) {
		// 			callback(new Error('不能大于宽'));
		// 		} else {
		// 			callback();
		// 		}
		// 	},
		// },
	],
	// 包装规格的长宽高 长>宽>高
	packSpecLength: [
		{ required: true, message: '请输入包装长度', trigger: 'blur' },
		{
			// 允许2位小数的验证规则
			validator: maxTwoDecimalPlaces,
			trigger: 'blur',
		},
	],
	// 包装规格的长宽高 长>宽>高
	packSpecWidth: [
		{ required: true, message: '请输入包装宽度', trigger: 'blur' },
		{
			// 允许2位小数的验证规则
			validator: maxTwoDecimalPlaces,
			trigger: 'blur',
		},
		// {
		// 	// 宽不能大于长度的验证规则
		// 	validator: (rule: Rule, value: string, callback: Function) => {
		// 		const packSpecLength = Number(localFormData.value.packSpecLength); // 使用当前长度的值进行比较
		// 		const packSpecWidth = Number(value); // 使用当前宽度的值进行比较
		// 		if (!packSpecLength) {
		// 			return callback(); // 如果长度未填写，则不进行校验
		// 		}
		// 		if (value && packSpecWidth > packSpecLength) {
		// 			callback(new Error('不能大于长'));
		// 		} else {
		// 			callback();
		// 		}
		// 	},
		// },
	],
	packSpecHeight: [
		{ required: true, message: '请输入包装高度', trigger: 'blur' },
		{
			// 允许2位小数的验证规则
			validator: maxTwoDecimalPlaces,
			trigger: 'blur',
		},
		// {
		// 	// 高度不能大于宽度的验证规则
		// 	validator: (rule: Rule, value: string, callback: Function) => {
		// 		const packSpecHeight = Number(value); // 使用当前高度的值进行比较
		// 		// 获取宽度的值
		// 		const packSpecWidth = Number(localFormData.value.packSpecWidth);
		// 		if (!packSpecWidth) {
		// 			return callback(); // 如果宽度未填写，则不进行校验
		// 		}
		// 		if (value && packSpecHeight > packSpecWidth) {
		// 			callback(new Error('不能大于宽'));
		// 		} else {
		// 			callback();
		// 		}
		// 	},
		// },
	],
	// 单品净重
	itemNetWeight: [
		{ required: true, message: '请输入单品净重', trigger: 'blur' },
		// {
		// 	validator: rule.number,
		// },
		{
			// 允许4位小数的验证规则
			validator: maxFourDecimalPlaces,
			trigger: 'blur',
		},
	],
	// 单品毛重
	itemGrossWeight: [
		{ required: true, message: '请输入单品毛重', trigger: 'blur' },
		// {
		// 	validator: rule.number,
		// },
		{
			// 允许4位小数的验证规则
			validator: maxFourDecimalPlaces,
			trigger: 'blur',
		},
	],
	// 采购备注
	purchaseRemark: [{ message: '请输入采购备注', trigger: 'blur' }],
};

onMounted(() => {
	// 手动的把单位的下拉框都设置为第一个
	localFormData.value.purchaseLeadTimeUnit =
		props.dictMap.purchaseLeadTimeUnit[0]?.value || '';
	localFormData.value.referenceCostUnit =
		props.dictMap.referenceCostUnit[0]?.value || '';
	localFormData.value.itemSpecUnit = props.dictMap.itemSpecUnit[0]?.value || '';
	localFormData.value.packSpecUnit = props.dictMap.itemSpecUnit[0]?.value || '';
	localFormData.value.itemNetWeightUnit =
		props.dictMap.itemNetWeightUnit[0]?.value || '';
	localFormData.value.itemGrossWeightUnit =
		props.dictMap.itemNetWeightUnit[0]?.value || '';
});
const setData = (data: any) => {
	puchaseUnitType.value = '1';
	localFormData.value = {
		...localFormData.value,
		...data,
	};
};
defineExpose({
	dataFormRef,
	puchaseUnitType,
	localFormData,
	setData,
});
</script>

<style lang="sass" scoped>
/* 使用 v-deep 修改背景颜色 */
.el-select-background
    :deep(.el-select__wrapper)
      background-color: #f0f0f0 !important  /* 修改背景颜色 */

    :deep(.el-input__inner):hover
      background-color: #e0e0e0 !important  /* 修改 hover 背景颜色 */
</style>
