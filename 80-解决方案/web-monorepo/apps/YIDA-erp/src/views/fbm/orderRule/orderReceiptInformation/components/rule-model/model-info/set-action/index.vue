<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 17:43:46
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-22 18:08:46
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\orderReceiptInformation\components\rule-model\model-info\set-action\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Plus, Minus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
const { t } = useI18n();
const activeNames = ref(['1']); // 手风琴默认展开项
// 表单数据
const formData = ref<Record<string, any>>({
	// 门牌号处理配置
	houseNumberFlag: 0, // 门牌号解析复选框（0:未选中 1:选中，默认关闭）
	houseNumberType: 1, // 门牌号解析类型（1:识别地址数字作为门牌号，默认类型1）
	houseNumberValue: {
		action: 1,
		length: 1,
		position: 1,
	}, // 门牌号解析动作（1:保留 2:删除，原接口为string类型）
	// 电话号码处理配置
	phoneFlag: 0, // 电话号码简化复选框（0:未选中 1:选中，默认关闭）
	phoneExtensionFlag: 0, // 分机号处理复选框（0:未选中 1:选中，默认关闭）
	phoneExtensionValue: 1, // 分机号处理方式（1:替换ext.为- 2:去掉分机号，默认方式1）
	phoneFilterSpecialCharFlag: 0, // 电话过滤特殊字符复选框（0:未选中 1:选中，默认关闭）
	phoneFilterSpecialCharValue: [], // 电话过滤特殊字符内容（默认空）
	phoneFilterLeadingZerosFlag: 0, // 电话过滤头部0复选框（0:未选中 1:选中，默认关闭）
	phoneSubstringFlag: 0, // 电话截取复选框（0:未选中 1:选中，默认关闭）
	phoneSubstringValue: 1, // 电话截取起始位置（默认从第1位开始，integer类型）
	phoneFilledFlag: 0, // 电话为空填充复选框（0:未选中 1:选中，默认关闭）
	phoneFilledValue: '', // 电话为空填充值（默认空）
	phoneReplaceFlag: 0, // 电话指定替换复选框（0:未选中 1:选中，默认关闭）
	phoneReplaceOld: '', // 电话被替换值（默认空）
	phoneReplaceNew: '', // 电话替换值（默认空）

	// 收货邮编处理配置
	postcodeFlag: 0, // 邮编处理复选框（0:未选中 1:选中，默认关闭）
	postcodeFilterSpecialCharFlag: 0, // 邮编过滤特殊字符复选框（0:未选中 1:选中，默认关闭）
	postcodeFilterSpecialCharValue: [], // 邮编过滤特殊字符内容（默认空）
	postcodeFilterExpandFlag: 0, // 邮编去除扩展（仅美国，默认关闭）
	postcodeFilledFlag: 0, // 邮编为空填充复选框（0:未选中 1:选中，默认关闭）
	postcodeFilledValue: '', // 邮编为空填充值（默认空）

	// 收货姓名处理配置
	nameFlag: 0, // 姓名处理复选框（0:未选中 1:选中，默认关闭）
	nameFilterSpecialCharFlag: 0, // 姓名过滤特殊字符复选框（0:未选中 1:选中，默认关闭）
	nameFilterSpecialCharValue: '', // 姓名过滤特殊字符内容（默认空）
	nameReplaceFlag: 0, // 姓名指定替换复选框（0:未选中 1:选中，默认关闭）
	nameReplaceValue: [{}], // 姓名替换值（默认空）
	nameReplaceFromBuyerFlag: 0, // 姓名用买家姓名替换复选框（0:未选中 1:选中，默认关闭）
	nameSubstringFlag: 0, // 姓名截取复选框（0:未选中 1:选中，默认关闭）
	nameSubstringValue: 1, // 姓名截取起始位置（默认从第1位开始，integer类型）
	// 收货邮箱处理配置
	emailFlag: 0, // 邮箱处理复选框（0:未选中 1:选中，默认关闭）
	emailFilledFlag: 0, // 邮箱为空填充复选框（0:未选中 1:选中，默认关闭）
	emailFilledValue: '', // 邮箱为空填充值（默认空）
});
// 表单引用
const formRef = ref<any>(null);
// 表单校验
const rules = ref({});

const init = () => {
	formData.value = {
		// 门牌号处理配置
		houseNumberFlag: 0, // 门牌号解析复选框（0:未选中 1:选中，默认关闭）
		houseNumberType: 1, // 门牌号解析类型（1:识别地址数字作为门牌号，默认类型1）
		houseNumberValue: {
			action: 'keep',
			length: 1,
			position: 'head',
		}, // 门牌号解析动作（1:保留 2:删除，原接口为string类型）
		// 电话号码处理配置
		phoneFlag: 0, // 电话号码简化复选框（0:未选中 1:选中，默认关闭）
		phoneExtensionFlag: 0, // 分机号处理复选框（0:未选中 1:选中，默认关闭）
		phoneExtensionValue: 1, // 分机号处理方式（1:替换ext.为- 2:去掉分机号，默认方式1）
		phoneFilterSpecialCharFlag: 0, // 电话过滤特殊字符复选框（0:未选中 1:选中，默认关闭）
		phoneFilterSpecialCharValue: [], // 电话过滤特殊字符内容（默认空）
		phoneFilterLeadingZerosFlag: 0, // 电话过滤头部0复选框（0:未选中 1:选中，默认关闭）
		phoneSubstringFlag: 0, // 电话截取复选框（0:未选中 1:选中，默认关闭）
		phoneSubstringValue: 1, // 电话截取起始位置（默认从第1位开始，integer类型）
		phoneChangeFlag: 0, // 电话指定替换复选框（0:未选中 1:选中，默认关闭）
		phoneChangeValue: '', // 电话替换值（默认空）
		phoneFilledFlag: 0, // 电话为空填充复选框（0:未选中 1:选中，默认关闭）
		phoneFilledValue: '', // 电话为空填充值（默认空）
		phoneReplaceFlag: 0, // 电话指定替换复选框（0:未选中 1:选中，默认关闭）
		phoneReplaceOld: '', // 电话被替换值（默认空）
		phoneReplaceNew: '', // 电话替换值（默认空）

		// 收货邮编处理配置
		postcodeFlag: 0, // 邮编处理复选框（0:未选中 1:选中，默认关闭）
		postcodeFilterSpecialCharFlag: 0, // 邮编过滤特殊字符复选框（0:未选中 1:选中，默认关闭）
		postcodeFilterSpecialCharValue: [], // 邮编过滤特殊字符内容（默认空）
		postcodeFilterExpandFlag: 0, // 邮编去除扩展（仅美国，默认关闭）
		postcodeFilledFlag: 0, // 邮编为空填充复选框（0:未选中 1:选中，默认关闭）
		postcodeFilledValue: '', // 邮编为空填充值（默认空）

		// 收货姓名处理配置
		nameFlag: 0, // 姓名处理复选框（0:未选中 1:选中，默认关闭）
		nameFilterSpecialCharFlag: 0, // 姓名过滤特殊字符复选框（0:未选中 1:选中，默认关闭）
		nameFilterSpecialCharValue: [], // 姓名过滤特殊字符内容（默认空）
		nameReplaceFlag: 0, // 姓名指定替换复选框（0:未选中 1:选中，默认关闭）
		nameReplaceValue: [{}], // 姓名替换值（默认空）
		nameReplaceFromBuyerFlag: 0, // 姓名用买家姓名替换复选框（0:未选中 1:选中，默认关闭）
		nameSubstringFlag: 0, // 姓名截取复选框（0:未选中 1:选中，默认关闭）
		nameSubstringValue: 1, // 姓名截取起始位置（默认从第1位开始，integer类型）
		// 收货邮箱处理配置
		emailFlag: 0, // 邮箱处理复选框（0:未选中 1:选中，默认关闭）
		emailFilledFlag: 0, // 邮箱为空填充复选框（0:未选中 1:选中，默认关闭）
		emailFilledValue: '', // 邮箱为空填充值（默认空）
	};
};
// 添加姓名替换规则
const addReplacement = () => {
	formData.value.nameReplaceValue.push({});
};
// 删除姓名替换规则
const removeReplacement = (index: number) => {
	if (formData.value.nameReplaceValue.length > 1) {
		formData.value.nameReplaceValue.splice(index, 1);
	} else {
		ElMessage.warning('至少保留一行替换规则');
	}
};

// 导出给父组件的方法
// 获取表单数据
const validateForm = async () => {
	await formRef.value.validate();
	// 根据是否存在勾选，去除不必要的字段
	// 如果未勾选门牌号解析，则重置门牌号相关字段
	if (formData.value.houseNumberFlag === 0) {
		// 门牌号解析
		formData.value.houseNumberType = 1;
		formData.value.houseNumberValue = {
			action: 'keep',
			length: 1,
			position: 'head',
		};
	}
	// 如果houseNumberType = 1 就去除剩下的两个字段
	if (formData.value.houseNumberType === 1) {
		delete formData.value.houseNumberValue.length;
		delete formData.value.houseNumberValue.position;
		if (!formData.value.houseNumberValue.action) {
			return Promise.reject('请设置门牌号解析动作');
		}
	}
	// if houseNumberType = 2 就去除length字段
	if (formData.value.houseNumberType === 2) {
		delete formData.value.houseNumberValue.length;
		if (!formData.value.houseNumberValue.position || !formData.value.houseNumberValue.action) {
			return Promise.reject('请设置门牌号解析位置和动作');
		}
	}
	// if houseNumberType = 3 不去除字段
	if (formData.value.houseNumberType === 3) {
		if (!formData.value.houseNumberValue.position || !formData.value.houseNumberValue.length || !formData.value.houseNumberValue.action) {
			return Promise.reject('请设置门牌号解析位置或字符数');
		}
	}

	// 如果未勾选电话号码简化，则重置电话号码相关字段
	if (formData.value.phoneFlag === 0) {
		// 电话号码简化
		formData.value.phoneExtensionFlag = 0;
		formData.value.phoneExtensionValue = 1;
		formData.value.phoneFilterSpecialCharFlag = 0;
		formData.value.phoneFilterSpecialCharValue = [];
		formData.value.phoneFilterLeadingZerosFlag = 0;
		formData.value.phoneSubstringFlag = 0;
		formData.value.phoneSubstringValue = 1;
		formData.value.phoneChangeFlag = 0;
		formData.value.phoneChangeValue = '';
		formData.value.phoneFilledFlag = 0;
		formData.value.phoneFilledValue = '';
		formData.value.phoneReplaceFlag = 0;
		formData.value.phoneReplaceOld = '';
		formData.value.phoneReplaceNew = '';
	}
	// 如果未勾选邮编处理，则重置邮编相关字段
	if (formData.value.postcodeFlag === 0) {
		// 邮编处理
		formData.value.postcodeFilterSpecialCharFlag = 0;
		formData.value.postcodeFilterSpecialCharValue = [];
		formData.value.postcodeFilterExpandFlag = 0;
		formData.value.postcodeFilledFlag = 0;
		formData.value.postcodeFilledValue = '';
	}
	// 如果未勾选姓名处理，则重置姓名相关字段
	if (formData.value.nameFlag === 0) {
		// 姓名处理
		formData.value.nameFilterSpecialCharFlag = 0;
		formData.value.nameFilterSpecialCharValue = [];
		formData.value.nameReplaceFlag = 0;
		formData.value.nameReplaceValue = [{}];
		formData.value.nameReplaceFromBuyerFlag = 0;
		formData.value.nameSubstringFlag = 0;
		formData.value.nameSubstringValue = 1;
	}
	// 如果未勾选邮箱处理，则重置邮箱相关字段
	if (formData.value.emailFlag === 0) {
		// 邮箱处理
		formData.value.emailFilledFlag = 0;
		formData.value.emailFilledValue = '';
	}
	const getFormData = {
		...formData.value,
		// 门牌号解析动作 需要转换为json
		houseNumberValue: JSON.stringify(formData.value.houseNumberValue),
		// 电话过滤特殊字符内容 需要转换为json
		phoneFilterSpecialCharValue: JSON.stringify(formData.value.phoneFilterSpecialCharValue),
		// 邮编过滤特殊字符内容 需要转换为json
		postcodeFilterSpecialCharValue: JSON.stringify(formData.value.postcodeFilterSpecialCharValue),
		// 姓名过滤特殊字符内容 需要转换为json
		nameFilterSpecialCharValue: JSON.stringify(formData.value.nameFilterSpecialCharValue),
		// 姓名替换值 需要转换为json
		nameReplaceValue: JSON.stringify(formData.value.nameReplaceValue),
	};
	return getFormData;
};
// 设置表单数据
const setFormData = (data: Record<string, any>) => {
	formData.value = {
		...formData.value,
		...data,
		// 需要将json字符串转换为对象
		// 门牌号解析动作
		houseNumberValue: data.houseNumberValue ? JSON.parse(data.houseNumberValue) : formData.value.houseNumberValue,
		// 电话号码过滤特殊字符内容
		phoneFilterSpecialCharValue: data.phoneFilterSpecialCharValue
			? JSON.parse(data.phoneFilterSpecialCharValue)
			: formData.value.phoneFilterSpecialCharValue,
		// 邮编过滤特殊字符内容
		postcodeFilterSpecialCharValue: data.postcodeFilterSpecialCharValue
			? JSON.parse(data.postcodeFilterSpecialCharValue)
			: formData.value.postcodeFilterSpecialCharValue,
		// 姓名过滤特殊字符内容
		nameFilterSpecialCharValue: data.nameFilterSpecialCharValue
			? JSON.parse(data.nameFilterSpecialCharValue)
			: formData.value.nameFilterSpecialCharValue,
		// 姓名替换值
		nameReplaceValue: data.nameReplaceValue ? JSON.parse(data.nameReplaceValue) : formData.value.nameReplaceValue,
	};
}; // 暴露给父组件的方法
defineExpose({
	validateForm,
	init,
	setFormData,
});
</script>
<template>
	<div class="box">
		<el-form :model="formData" ref="formRef" label-width="150px" :rules="rules">
			<el-row class="title">
				<el-col :span="24">
					{{ t('设定动作') }}
				</el-col>
			</el-row>
			<el-row class="" :gutter="20">
				<el-col :span="24">
					<el-row style="width: 100%" class="mb-4">
						<el-col :span="24">
							<el-collapse v-model="activeNames" class="p-2 mt-2 border rounded-xl">
								<el-collapse-item title="规则执行说明" name="1">
									<template #title>
										<div>
											<el-icon>
												<info-filled />
											</el-icon>
											规则执行说明
										</div>
									</template>
									<ul class="pl-4 list-disc">
										<li class="ml-4">
											仓配综合规则-&gt;比价：在订单进行运费试算前，会先执行收件信息规则，将收件地址信息优化后再推送物流服务商进行试算
										</li>
										<li class="ml-4">自营仓/三方仓发货，且使用API物流或平台物流下单：会先执行收件信息规则，将收件地址信息优化后再向服务商下单</li>
										<li class="ml-4">自营仓/三方仓发货，使用三方仓渠道：会先执行收件信息规则，将收件地址信息优化后再推送给自营仓/三方仓</li>
										<li class="ml-4">平台仓发货：会先执行收件信息规则，将收件地址信息优化后再推送给平台仓</li>
									</ul>
								</el-collapse-item>
							</el-collapse>
						</el-col>
					</el-row>
					<el-row style="width: 100%" class="mb-4">
						<el-col :span="24">
							<el-checkbox v-model="formData.houseNumberFlag" :true-value="1" :false-value="0">
								门牌号解析
								<span class="text-gray">
									（门牌号如果不为空，执行规则将会导致原门牌号被覆盖，建议选择【门牌号】为空条件，再配置门牌号解析规则）
								</span>
							</el-checkbox>
						</el-col>
						<el-col :span="24" class="card" v-if="formData.houseNumberFlag === 1">
							<el-row style="width: 100%" class="flex items-center mb-2">
								<el-radio-group v-model="formData.houseNumberType">
									<el-radio :value="1"> </el-radio>
								</el-radio-group>
								识别订单地址中的【数字】作为门牌号后推送 ，识别后
								<el-select
									v-model="formData.houseNumberValue.action"
									placeholder="请选择"
									style="width: 100px"
									class="ml-1 mr-1"
									:disabled="formData.houseNumberType !== 1"
								>
									<el-option
										v-for="item in [
											{
												label: '保留',
												value: 'keep',
											},
											{
												label: '删除',
												value: 'delete',
											},
										]"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
								原地址门牌号
							</el-row>
							<el-row style="width: 100%" class="flex items-center mb-2">
								<el-radio-group v-model="formData.houseNumberType">
									<el-radio :value="2"> </el-radio>
								</el-radio-group>
								识别订单地址中的数字以
								<el-select
									v-model="formData.houseNumberValue.position"
									placeholder="请选择"
									style="width: 100px"
									class="ml-1 mr-1"
									:disabled="formData.houseNumberType !== 2"
								>
									<el-option
										v-for="item in [
											{
												label: '首部',
												value: 'head',
											},
											{
												label: '尾部',
												value: 'tail',
											},
										]"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
								数字作为门牌号推送 ，识别后
								<el-select
									v-model="formData.houseNumberValue.action"
									placeholder="请选择"
									:disabled="formData.houseNumberType !== 2"
									style="width: 100px"
									class="ml-1 mr-1"
								>
									<el-option
										v-for="item in [
											{
												label: '保留',
												value: 'keep',
											},
											{
												label: '删除',
												value: 'delete',
											},
										]"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
								原地址门牌号
							</el-row>
							<el-row style="width: 100%" class="flex items-center mb-2">
								<el-radio-group v-model="formData.houseNumberType">
									<el-radio :value="3"> </el-radio>
								</el-radio-group>
								识别订单地址中的
								<el-select
									v-model="formData.houseNumberValue.position"
									:disabled="formData.houseNumberType !== 3"
									placeholder="请选择"
									style="width: 100px"
									class="ml-1 mr-1"
								>
									<el-option
										v-for="item in [
											{
												label: '首部',
												value: 'head',
											},
											{
												label: '尾部',
												value: 'tail',
											},
										]"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
								<el-input
									v-model="formData.houseNumberValue.length"
									:disabled="formData.houseNumberType !== 3"
									placeholder="请输入"
									style="width: 100px"
									type="number"
									class="mr-1"
								/>
								位字符（含空格）作为门牌号推送 ，识别后
								<el-select
									v-model="formData.houseNumberValue.action"
									:disabled="formData.houseNumberType !== 3"
									placeholder="请选择"
									style="width: 100px"
									class="ml-1 mr-1"
								>
									<el-option
										v-for="item in [
											{
												label: '保留',
												value: 'keep',
											},
											{
												label: '删除',
												value: 'delete',
											},
										]"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
								原地址门牌号
							</el-row>
						</el-col>
					</el-row>
					<el-row style="width: 100%" class="mb-4">
						<el-col :span="24">
							<el-checkbox v-model="formData.phoneFlag" :true-value="1" :false-value="0">
								电话号码简化 <span class="text-gray"> （收件人电话/手机号） </span>
							</el-checkbox>
						</el-col>
						<el-col :span="24" class="card" v-if="formData.phoneFlag === 1">
							<el-row style="width: 100%" class="flex items-center mb-2">
								<div class="mr-2">
									<el-checkbox v-model="formData.phoneExtensionFlag" :true-value="1" :false-value="0"> </el-checkbox>
								</div>
								<div class="mr-2">分机号处理</div>
								<el-popover content="Top Center prompts info" placement="top" width="400" trigger="hover">
									<template #default>
										<div class="">
											<div>说明：将“空格+ext.+空格”替换为“-”</div>
											<div>电话号码：+1600-600-6000 ext. 00000</div>
											<div>替换后：+1600-600-6000-00000</div>
											<br />
											<div>说明：从“ext.”前的空格开始去除后面的字符</div>
											<div>电话号码：+1600-600-6000 ext. 000000</div>
											<div>说明：从“ext.”前的空格开始去除后面的字符</div>
											<div>替换后：+1600-600-6000</div>
										</div>
									</template>
									<template #reference>
										<div class="mr-2">
											<el-icon><QuestionFilled /></el-icon>
										</div>
									</template>
								</el-popover>
								<el-select
									v-model="formData.phoneExtensionValue"
									placeholder="请选择"
									style="width: 300px"
									class="mr-1"
									:disabled="formData.phoneExtensionFlag !== 1"
								>
									<el-option
										v-for="item in [
											{ label: `将“ext.”（包括前后的空格）替换为“-”`, value: 1 },
											{ label: `去掉分机号（仅支持ext.格式）`, value: 2 },
										]"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-row>
							<el-row style="width: 100%" class="flex items-center mb-2">
								<div class="mr-2">
									<el-checkbox v-model="formData.phoneFilterSpecialCharFlag" :true-value="1" :false-value="0"> </el-checkbox>
								</div>
								<div class="mr-2">过滤特殊字符</div>
								<el-popover content="Top Center prompts info" placement="top" width="400" trigger="hover">
									<template #default>
										<div class="">
											<div>过滤选中的特殊字符</div>
											<div>选中【+】【(】【)】</div>
											<div>电话号码：(+1)8765432100</div>
											<div>过滤后：18765432100</div>
										</div>
									</template>
									<template #reference>
										<div class="mr-2">
											<el-icon><QuestionFilled /></el-icon>
										</div>
									</template>
								</el-popover>
								<el-select
									v-model="formData.phoneFilterSpecialCharValue"
									multiple
									placeholder="请选择"
									style="width: 550px"
									class="mr-1"
									:disabled="formData.phoneFilterSpecialCharFlag !== 1"
								>
									<el-option
										v-for="item in [
											{ label: `空格`, value: ' ' },
											{ label: `-`, value: `-` },
											{ label: `+`, value: `+` },
											{ label: `(`, value: `(` },
											{ label: `)`, value: `)` },
											{ label: `@`, value: `@` },
											{ label: `/`, value: `/` },
											{ label: `#`, value: `#` },
											{ label: `*`, value: `*` },
											{ label: `&`, value: `&` },
										]"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-row>
							<el-row style="width: 100%" class="flex items-center mb-2">
								<div class="mr-2">
									<el-checkbox v-model="formData.phoneFilterLeadingZerosFlag" :true-value="1" :false-value="0"> </el-checkbox>
								</div>
								<div class="mr-2">过滤头部为0的数字</div>
								<el-popover content="Top Center prompts info" placement="top" width="400" trigger="hover">
									<template #default>
										<div class="">
											<div>说明：从第一个字符0开始过滤掉连续的0</div>
											<div>电话号码：0018765432100</div>
											<div>过滤后：18765432100</div>
										</div>
									</template>
									<template #reference>
										<div class="mr-2">
											<el-icon><QuestionFilled /></el-icon>
										</div>
									</template>
								</el-popover>
							</el-row>
							<el-row style="width: 100%" class="flex items-center mb-2">
								<el-checkbox v-model="formData.phoneSubstringFlag" :true-value="1" :false-value="0"> </el-checkbox>
								<div class="ml-2 mr-2">从第</div>
								<el-input-number
									v-model="formData.phoneSubstringValue"
									placeholder="1~99"
									controls-position="right"
									:max="99"
									:min="1"
									style="width: 100px"
									:disabled="formData.phoneSubstringFlag !== 1"
								/>
								<div class="mr-2">个字符开始截取</div>
								<el-popover content="Top Center prompts info" placement="top" width="400" trigger="hover">
									<template #default>
										<div class="">
											<div>说明：一般用于去除国家/城市区号</div>
											<div>填写：4</div>
											<div>电话号码：(+1)8765432100</div>
											<div>截取后：8765432100</div>
										</div>
									</template>
									<template #reference>
										<div class="mr-2">
											<el-icon><QuestionFilled /></el-icon>
										</div>
									</template>
								</el-popover>
							</el-row>
							<el-row style="width: 100%" class="flex items-center mb-2">
								<div class="mr-2">
									<el-checkbox v-model="formData.phoneChangeFlag" :true-value="1" :false-value="0"> </el-checkbox>
								</div>
								<div class="mr-2">电话号码替换为</div>
								<el-popover content="Top Center prompts info" placement="top" width="400" trigger="hover">
									<template #default>
										<div class="">
											<div>说明：将订单中的电话/手机号替换为填写号码</div>
											<div>填写：600-600-6000-00000</div>
											<div>电话号码：18765432100</div>
											<div>替换后：600-600-6000-00000</div>
										</div>
									</template>
									<template #reference>
										<div class="mr-2">
											<el-icon><QuestionFilled /></el-icon>
										</div>
									</template>
								</el-popover>
								<div class="mr-2">
									<el-input
										v-model="formData.phoneChangeValue"
										placeholder="请输入"
										style="width: 240px"
										:disabled="formData.phoneChangeFlag !== 1"
									/>
								</div>
							</el-row>
							<el-row style="width: 100%" class="flex items-center mb-2">
								<div class="mr-2">
									<el-checkbox v-model="formData.phoneFilledFlag" :true-value="1" :false-value="0"> </el-checkbox>
								</div>
								<div class="mr-2">电话号码为空填充为</div>
								<el-popover content="Top Center prompts info" placement="top" width="400" trigger="hover">
									<template #default>
										<div class="">
											<div>说明：订单中的电话/手机号为空，填充为填写号码</div>
											<div>填写：600-600-6000-00000</div>
											<div>电话号码：--</div>
											<div>填充后：600-600-6000-00000</div>
										</div>
									</template>
									<template #reference>
										<div class="mr-2">
											<el-icon><QuestionFilled /></el-icon>
										</div>
									</template>
								</el-popover>
								<div class="mr-2">
									<el-input
										v-model="formData.phoneFilledValue"
										placeholder="请输入"
										style="width: 240px"
										:disabled="formData.phoneFilledFlag !== 1"
									/>
								</div>
							</el-row>
							<el-row style="width: 100%" class="flex items-center mb-2">
								<div class="mr-2">
									<el-checkbox v-model="formData.phoneReplaceFlag" :true-value="1" :false-value="0"> </el-checkbox>
								</div>
								<div class="mr-2">指定</div>
								<el-popover content="Top Center prompts info" placement="top" width="400" trigger="hover">
									<template #default>
										<div class="">
											<div>说明：指定字符替换为需要的字符，确保电话有效</div>
											<div>指定填写：ext.</div>
											<div>替换填写：-</div>
											<div>电话号码：+1600-600-6000ext.00000</div>
											<div>替换后：+1600-600-6000-00000</div>
										</div>
									</template>
									<template #reference>
										<div class="mr-2">
											<el-icon><QuestionFilled /></el-icon>
										</div>
									</template>
								</el-popover>
								<div class="mr-2">
									<el-input
										v-model="formData.phoneReplaceOld"
										placeholder="请输入"
										style="width: 240px"
										:disabled="formData.phoneReplaceFlag !== 1"
									/>
								</div>
								<div class="mr-2">替换为</div>
								<div class="mr-2">
									<el-input
										v-model="formData.phoneReplaceNew"
										placeholder="请输入"
										style="width: 240px"
										:disabled="formData.phoneReplaceFlag !== 1"
									/>
								</div>
							</el-row>
						</el-col>
					</el-row>
					<el-row style="width: 100%" class="mb-4">
						<el-col :span="24">
							<el-checkbox v-model="formData.postcodeFlag" :true-value="1" :false-value="0"> 收货邮编处理 </el-checkbox>
						</el-col>
						<el-col :span="24" class="card" v-if="formData.postcodeFlag === 1">
							<el-row style="width: 100%" class="flex items-center mb-2">
								<div class="mr-2">
									<el-checkbox v-model="formData.postcodeFilterSpecialCharFlag" :true-value="1" :false-value="0"> </el-checkbox>
								</div>
								<div class="mr-2">过滤特殊字符</div>
								<el-popover content="Top Center prompts info" placement="top" width="400" trigger="hover">
									<template #default>
										<div class="">
											<div>说明：过滤选中的特殊字符</div>
											<div>选中：【空格】</div>
											<div>英国邮编：BT34 3YE</div>
											<div>过滤后：BT343YE</div>
										</div>
									</template>
									<template #reference>
										<div class="mr-2">
											<el-icon><QuestionFilled /></el-icon>
										</div>
									</template>
								</el-popover>
								<el-select
									v-model="formData.postcodeFilterSpecialCharValue"
									multiple
									placeholder="请选择"
									style="width: 550px"
									class="mr-1"
									:disabled="formData.postcodeFilterSpecialCharFlag !== 1"
								>
									<el-option
										v-for="item in [
											{ label: `空格`, value: ' ' },
											{ label: `-`, value: `-` },
											{ label: `+`, value: `+` },
											{ label: `@`, value: `@` },
											{ label: `/`, value: `/` },
											{ label: `#`, value: `#` },
											{ label: `*`, value: `*` },
											{ label: `&`, value: `&` },
										]"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-row>
							<el-row style="width: 100%" class="flex items-center mb-2">
								<div class="mr-2">
									<el-checkbox v-model="formData.postcodeFilterExpandFlag" :true-value="1" :false-value="0"> </el-checkbox>
								</div>
								<div class="mr-2">去除扩展邮编（仅美国）</div>
								<el-popover content="Top Center prompts info" placement="top" width="400" trigger="hover">
									<template #default>
										<div class="">
											<div>说明：美国邮编保留前5位</div>
											<div>邮编：90210-6789</div>
											<div>去除后：90210</div>
										</div>
									</template>
									<template #reference>
										<div class="mr-2">
											<el-icon><QuestionFilled /></el-icon>
										</div>
									</template>
								</el-popover>
							</el-row>
							<el-row style="width: 100%" class="flex items-center mb-2">
								<div class="mr-2">
									<el-checkbox v-model="formData.postcodeFilledFlag" :true-value="1" :false-value="0"> </el-checkbox>
								</div>
								<div class="mr-2">邮编为空填充为</div>
								<el-popover content="Top Center prompts info" placement="top" width="400" trigger="hover">
									<template #default>
										<div class="">
											<div>说明：订单中的邮编为空，填充为填写邮编</div>
											<div>填写：123450</div>
											<div>邮编：--</div>
											<div>填充后：123450</div>
										</div>
									</template>
									<template #reference>
										<div class="mr-2">
											<el-icon><QuestionFilled /></el-icon>
										</div>
									</template>
								</el-popover>
								<div class="mr-2">
									<el-input
										v-model="formData.postcodeFilledValue"
										placeholder="请输入"
										style="width: 240px"
										:disabled="formData.postcodeFilledFlag !== 1"
									/>
								</div>
							</el-row>
						</el-col>
					</el-row>
					<el-row style="width: 100%" class="mb-4">
						<el-col :span="24">
							<el-checkbox v-model="formData.nameFlag" :true-value="1" :false-value="0"> 收货姓名处理 </el-checkbox>
						</el-col>
						<el-col :span="24" class="card" v-if="formData.nameFlag === 1">
							<el-row style="width: 100%" class="flex items-center mb-2">
								<div class="mr-2">
									<el-checkbox v-model="formData.nameFilterSpecialCharFlag" :true-value="1" :false-value="0"> </el-checkbox>
								</div>
								<div class="mr-2">过滤特殊字符</div>
								<el-popover content="Top Center prompts info" placement="top" width="400" trigger="hover">
									<template #default>
										<div class="">
											<div>说明：过滤选中的特殊字符</div>
											<div>选中：【'】</div>
											<div>姓名：O'Connor</div>
											<div>过滤后：OConnor</div>
										</div>
									</template>
									<template #reference>
										<div class="mr-2">
											<el-icon><QuestionFilled /></el-icon>
										</div>
									</template>
								</el-popover>
								<el-select
									v-model="formData.nameFilterSpecialCharValue"
									multiple
									placeholder="请选择"
									style="width: 550px"
									class="mr-1"
									:disabled="formData.nameFilterSpecialCharFlag !== 1"
								>
									<el-option
										v-for="item in [
											{ label: `'`, value: `'` },
											{ label: `&`, value: `&` },
										]"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-row>
							<el-row style="width: 100%" class="flex items-center mb-2">
								<div class="mr-2">
									<el-checkbox v-model="formData.nameReplaceFlag" :true-value="1" :false-value="0"> </el-checkbox>
								</div>
								<div class="mr-2">指定{X}替换为{Y}</div>
								<el-popover content="Top Center prompts info" placement="top" width="400" trigger="hover">
									<template #default>
										<div class="">
											<div>说明：指定字符替换为需要的字符，确保姓名有效</div>
											<div>指定填写：ö</div>
											<div>替换填写：oe</div>
											<div>姓名：Dörte</div>
											<div>替换后：Doerte</div>
										</div>
									</template>
									<template #reference>
										<div class="mr-2">
											<el-icon><QuestionFilled /></el-icon>
										</div>
									</template>
								</el-popover>
							</el-row>
							<el-row v-for="(item, index) in formData.nameReplaceValue" :key="index" class="mb-2" style="width: 100%">
								<div class="pl-8">
									<span class="mr-4">指定</span>
									<el-input
										v-model="item.oldValue"
										placeholder="请输入"
										style="width: 240px"
										class="mr-4"
										:disabled="formData.nameReplaceFlag !== 1"
									/>
									<span class="mr-4">替换为</span>
									<el-input
										v-model="item.newValue"
										placeholder="请输入"
										style="width: 240px"
										class="mr-4"
										:disabled="formData.nameReplaceFlag !== 1"
									/>
									<el-button :icon="Plus" :disabled="formData.nameReplaceFlag !== 1" @click="addReplacement"></el-button>
									<el-button :icon="Minus" :disabled="formData.nameReplaceFlag !== 1" @click="removeReplacement(index)"></el-button>
								</div>
							</el-row>

							<el-row style="width: 100%" class="flex items-center mb-2">
								<div class="mr-2">
									<el-checkbox v-model="formData.nameReplaceFromBuyerFlag" :true-value="1" :false-value="0"> </el-checkbox>
								</div>
								<div class="mr-2">用买家姓名替换收货姓名</div>
								<el-popover content="Top Center prompts info" placement="top" width="400" trigger="hover">
									<template #default>
										<div class="">
											<div>说明：一般用于简化收货姓名，确保长度符合仓库要求，买家姓名为空不替换</div>
											<div>收货姓名：Kameron Roach, Miltimore Wallis ATACPOP11111111</div>
											<div>买家姓名：Kameron Roach</div>
											<div>替换后：收货姓名：Kameron Roach</div>
										</div>
									</template>
									<template #reference>
										<div class="mr-2">
											<el-icon><QuestionFilled /></el-icon>
										</div>
									</template>
								</el-popover>
							</el-row>
							<el-row style="width: 100%" class="flex items-center mb-2">
								<div class="mr-2">
									<el-checkbox v-model="formData.nameSubstringFlag" :true-value="1" :false-value="0"> </el-checkbox>
								</div>
								<div class="mr-2">从第</div>
								<div class="mr-2">
									<el-input-number
										v-model="formData.nameSubstringValue"
										placeholder="1~99"
										controls-position="right"
										:max="99"
										:min="1"
										style="width: 100px"
										:disabled="formData.nameSubstringFlag !== 1"
									/>
								</div>
								<div class="mr-2">个字符结束截取</div>
								<el-popover content="Top Center prompts info" placement="top" width="400" trigger="hover">
									<template #default>
										<div class="">
											<div>说明：一般用于简化收货姓名，确保长度符合仓库要求</div>
											<div>填写：32</div>
											<div>收货姓名：Kameron Roach, Miltimore Wallis ATACPOP11111111</div>
											<div>截取后：Kameron Roach, Miltimore Wallis</div>
										</div>
									</template>
									<template #reference>
										<div class="mr-2">
											<el-icon><QuestionFilled /></el-icon>
										</div>
									</template>
								</el-popover>
							</el-row>
						</el-col>
					</el-row>
					<el-row style="width: 100%" class="mb-4">
						<el-col :span="24">
							<el-checkbox v-model="formData.emailFlag" :true-value="1" :false-value="0"> 收货邮箱处理 </el-checkbox>
						</el-col>
						<el-col :span="24" class="card" v-if="formData.emailFlag === 1">
							<el-row style="width: 100%" class="flex items-center mb-2">
								<div class="mr-2">
									<el-checkbox v-model="formData.emailFilledFlag" :true-value="1" :false-value="0"> </el-checkbox>
								</div>
								<div class="mr-2">邮箱为空填充为</div>
								<el-popover content="Top Center prompts info" placement="top" width="400" trigger="hover">
									<template #default>
										<div class="">
											<div>说明：订单中的邮箱为空，填充为填写邮箱</div>
											<div>填写：123@163.com</div>
											<div>邮编：--</div>
											<div>填充后：123@163.com</div>
										</div>
									</template>
									<template #reference>
										<div class="mr-2">
											<el-icon><QuestionFilled /></el-icon>
										</div>
									</template>
								</el-popover>
								<div class="mr-2">
									<el-input
										v-model="formData.emailFilledValue"
										:disabled="formData.emailFilledFlag !== 1"
										placeholder="请输入"
										style="width: 240px"
									/>
								</div>
							</el-row>
						</el-col>
					</el-row>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>
<style scoped lang="scss">
.box {
	border-radius: 5px;
	.title {
		font-size: 16px;
		font-weight: 500;
	}
	.card {
		border: 1px solid #e4e7ed;
		border-radius: 5px;
		padding: 10px;
		background-color: #f7f8fa;
	}
	.text-gray {
		color: #909399;
		font-weight: normal;
	}
}
:deep(.el-collapse-item__wrap) {
	border-bottom: none;
}
:deep(.el-collapse-item__header) {
	border-bottom: none;
}
</style>
