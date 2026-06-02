<template>
	<div>
		<el-form
			ref="dataFormRef"
			:model="localFormData"
			label-width="100px"
			:rules="purchaseInfoRule"
			v-if="props.visibleType !== 'view'"
		>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item :label="$t('单箱数量')" prop="singleCartonQty">
						<el-input
							v-model="localFormData.singleCartonQty"
							:placeholder="$t('请输入')"
						>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item :label="$t('外箱规格')">
						<el-row>
							<el-col :span="6">
								<el-form-item prop="outCartonSpecLength">
									<el-input
										v-model="localFormData.outCartonSpecLength"
										:placeholder="$t('长')"
									></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item prop="outCartonSpecWidth">
									<el-input
										v-model="localFormData.outCartonSpecWidth"
										:placeholder="$t('宽')"
									></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item prop="outCartonSpecHeight">
									<el-input
										v-model="localFormData.outCartonSpecHeight"
										:placeholder="$t('高')"
									></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item prop="outCartonSpecUnit">
									<el-select
										v-model="localFormData.outCartonSpecUnit"
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
				<el-col :span="8">
					<el-form-item :label="$t('单箱重量')" prop="singleCartonWeight">
						<el-input
							v-model="localFormData.singleCartonWeight"
							:placeholder="$t('请输入')"
						>
							<template #append>
								<el-form-item prop="singleCartonWeightUnit">
									<el-select
										v-model="localFormData.singleCartonWeightUnit"
										filterable
										placeholder="请选择"
										:style="{
											width: '75px',
										}"
										class="el-select-background"
									>
										<el-option
											v-for="item in props.dictMap.itemNetWeightUnit"
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
					<el-form-item :label="$t('单柜装箱数')" prop="containerCartonQty">
						<el-input
							v-model="localFormData.containerCartonQty"
							:placeholder="$t('请输入')"
						>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<el-form
			ref="dataFormRef"
			:model="localFormData"
			label-width="100px"
			:rules="purchaseInfoRule"
			v-else
		>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item :label="$t('单箱数量')" prop="singleCartonQty">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">{{
							localFormData.singleCartonQty
						}}</el-text>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item :label="$t('外箱规格')">
						<el-row>
							<el-col :span="6">
								<el-form-item prop="outCartonSpecLength">
									<el-text class="mx-1" :style="{ fontWeight: 'bold' }">{{
										localFormData.outCartonSpecLength
									}}</el-text>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item prop="outCartonSpecWidth">
									<el-text class="mx-1" :style="{ fontWeight: 'bold' }">{{
										localFormData.outCartonSpecWidth
									}}</el-text>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item prop="outCartonSpecHeight">
									<el-text class="mx-1" :style="{ fontWeight: 'bold' }">{{
										localFormData.outCartonSpecHeight
									}}</el-text>
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item prop="outCartonSpecUnit">
									<el-text class="mx-1" :style="{ fontWeight: 'bold' }">
										{{
											props.dictMap.itemSpecUnit.find(
												(item: any) =>
													item.value === localFormData.outCartonSpecUnit
											)?.label
										}}
									</el-text>
								</el-form-item></el-col
							>
						</el-row>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item :label="$t('单箱重量')" prop="singleCartonWeight">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">
							{{ localFormData.singleCartonWeight }}
							{{
								props.dictMap.itemNetWeightUnit.find(
									(item: any) =>
										item.value === localFormData.singleCartonWeightUnit
								)?.label
							}}
						</el-text>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item :label="$t('单柜装箱数')" prop="containerCartonQty">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">{{
							localFormData.containerCartonQty
						}}</el-text>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>

<script setup lang="ts">
import { ref, defineExpose, onMounted } from 'vue';
import { Rule } from '@form-create/element-ui';
import { rule } from '/@/utils/validate';
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

//  当前form的ref
const dataFormRef = ref();
// 当前form的数据
const localFormData = ref({
	// 单箱数量
	singleCartonQty: '',
	// 外箱规格
	outCartonSpecLength: '',
	outCartonSpecWidth: '',
	outCartonSpecHeight: '',
	outCartonSpecUnit: '',
	// 单箱重量
	singleCartonWeight: '',
	singleCartonWeightUnit: '',
	// 单柜装箱数
	containerCartonQty: '',
});

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
	// 单箱数量
	singleCartonQty: [
		{ required: true, message: '请输入单箱数量', trigger: 'blur' },
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
	// 外箱规格的长宽高 长>宽>高
	outCartonSpecLength: [
		{ required: true, message: '请输入长度', trigger: 'blur' },
		{
			// 允许2位小数的验证规则
			validator: maxTwoDecimalPlaces,
			trigger: 'blur',
		},
	],
	outCartonSpecWidth: [
		{ required: true, message: '请输入宽度', trigger: 'blur' },
		{
			// 允许2位小数的验证规则
			validator: maxTwoDecimalPlaces,
			trigger: 'blur',
		},
		// {
		// 	// 宽不能大于长度的验证规则
		// 	validator: (rule: Rule, value: string, callback: Function) => {
		// 		const outCartonSpecLength = Number(localFormData.value.outCartonSpecLength); // 使用当前长度的值进行比较
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
		// },
	],
	outCartonSpecHeight: [
		{ required: true, message: '请输入高度', trigger: 'blur' },
		{
			// 允许2位小数的验证规则
			validator: maxTwoDecimalPlaces,
			trigger: 'blur',
		},
		// {
		// 	// 高度不能大于宽度的验证规则
		// 	validator: (rule: Rule, value: string, callback: Function) => {
		// 		const outCartonSpecHeight = Number(value); // 使用当前高度的值进行比较
		// 		// 获取宽度的值
		// 		const outCartonSpecWidth = Number(localFormData.value.outCartonSpecWidth);
		// 		if (!outCartonSpecWidth) {
		// 			return callback(); // 如果宽度未填写，则不进行校验
		// 		}
		// 		if (value && outCartonSpecHeight > outCartonSpecWidth) {
		// 			callback(new Error('不能大于宽'));
		// 		} else {
		// 			callback();
		// 		}
		// 	},
		// },
	],

	// 单箱重量
	singleCartonWeight: [
		{ required: true, message: '请输入单箱重量', trigger: 'blur' },
		{
			validator: rule.number,
		},
		{
			// 允许4位小数的验证规则
			validator: maxFourDecimalPlaces,
			trigger: 'blur',
		},
	],
	// 单柜装箱数
	containerCartonQty: [
		{ required: true, message: '请输入单柜装箱数', trigger: 'blur' },
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
};

onMounted(() => {
	// 手动的把单位的下拉框都设置为第一个
	localFormData.value.outCartonSpecUnit =
		props.dictMap.itemSpecUnit[0]?.value || '';
	localFormData.value.singleCartonWeightUnit =
		props.dictMap.itemNetWeightUnit[0]?.value || '';
});
const setData = (data: any) => {
	localFormData.value = {
		...localFormData.value,
		...data,
	};
};
defineExpose({
	dataFormRef,
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
