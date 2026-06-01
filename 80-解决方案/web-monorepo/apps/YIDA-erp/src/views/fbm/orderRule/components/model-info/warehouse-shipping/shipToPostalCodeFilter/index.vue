<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 16:51:25
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-29 16:41:40
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\components\model-info\warehouse-shipping\shipToPostalCodeFilter\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// 表单数据
const formData = ref<Record<string, any>>({
	emptyFlag: 1, // 是否为空
	beginCheckFlag: [], // 邮编开头（复选框） 0-没有勾选 1-有勾选
	beginList: [], // 邮编开头列表
	includeCheckFlag: [], // 邮编包含（复选框） 0-没有勾选 1-有勾选
	includeList: [], // 邮编包含列表
	beginAndIncludeCheckFlag: [], // 以上两项满足其中一项（复选框） 0-没有勾选 1-有勾选
	specifyCheckFlag: [], // 指定邮编（复选框） 0-没有勾选 1-有勾选
	specifyType: 1, // 指定邮编匹配类型 1：精准匹配 2：前缀匹配
	specifyList: [], // 指定邮编列表
	excludeCheckFlag: [], // 排除邮编（复选框） 0-没有勾选 1-有勾选
	excludeType: 1, // 排除邮编匹配类型 1：精准匹配 2：前缀匹配
	excludeList: [], // 排除邮编列表
});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	emptyFlag: [{ required: true, message: '请选择是否为空', trigger: 'blur' }],
});
const init = () => {
	// 重置数据
	formData.value = {
		emptyFlag: 1, // 是否为空
		beginCheckFlag: [], // 邮编开头（复选框） 0-没有勾选 1-有勾选
		beginList: [], // 邮编开头列表
		includeCheckFlag: [], // 邮编包含（复选框） 0-没有勾选 1-有勾选
		includeList: [], // 邮编包含列表
		beginAndIncludeCheckFlag: [], // 以上两项满足其中一项（复选框） 0-没有勾选 1-有勾选
		specifyCheckFlag: [], // 指定邮编（复选框） 0-没有勾选 1-有勾选
		specifyType: 1, // 指定邮编匹配类型 1：精准匹配 2：前缀匹配
		specifyList: [], // 指定邮编列表
		excludeCheckFlag: [], // 排除邮编（复选框） 0-没有勾选 1-有勾选
		excludeType: 1, // 排除邮编匹配类型 1：精准匹配 2：前缀匹配
		excludeList: [], // 排除邮编列表
	};
};

// 处理输入框失去焦点事件
const handleBlur = async (value: string) => {
	// 等待渲染完成
	await nextTick();
	// 如果有逗号分隔的项，进行拆分并去重
	const valuesArr = Array.from(formData.value[value]) as string[];
	if (valuesArr && valuesArr.length > 0) {
		const newValues = valuesArr
			.map((item: string) => item.split(',')) // 按逗号拆分
			.flat() // 展平数组
			.map((item: string) => item.trim()) // 去除前后空格
			.filter((item: string) => item !== ''); // 过滤空字符串
		// 去重
		formData.value[value] = Array.from(new Set(newValues));
	} else {
		formData.value[value] = [];
	}
};

// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	// 如果选中了邮编开头就必须要有邮编开头列表
	if (
		formData.value.beginCheckFlag.length &&
		!formData.value.beginList.length
	) {
		return Promise.reject('请填写邮编开头列表');
	}
	// 如果填写了邮编开头列表就必须要选中邮编开头
	if (
		formData.value.beginList.length &&
		!formData.value.beginCheckFlag.length
	) {
		return Promise.reject('请选中邮编开头');
	}
	// 如果选中了邮编包含就必须要有邮编包含列表
	if (
		formData.value.includeCheckFlag.length &&
		!formData.value.includeList.length
	) {
		return Promise.reject('请填写邮编包含列表');
	}
	// 如果填写了邮编包含列表就必须要选中邮编包含
	if (
		formData.value.includeList.length &&
		!formData.value.includeCheckFlag.length
	) {
		return Promise.reject('请选中邮编包含');
	}
	// 如果选中了指定邮编就必须要有指定邮编列表
	if (
		formData.value.specifyCheckFlag.length &&
		!formData.value.specifyList.length
	) {
		return Promise.reject('请填写指定邮编列表');
	}
	// 如果选中了排除邮编就必须要有排除邮编列表
	if (
		formData.value.excludeCheckFlag.length &&
		!formData.value.excludeList.length
	) {
		return Promise.reject('请填写排除邮编列表');
	}
	// // 指定邮编列表和排除邮编列表不能有重复值
	// const specifySet = new Set(formData.value.specifyList);
	// const excludeSet = new Set(formData.value.excludeList);
	// const intersection = new Set([...specifySet].filter((x) => excludeSet.has(x)));
	// if (intersection.size > 0) {
	// 	return Promise.reject('指定邮编列表和排除邮编列表不能有重复值');
	// }
	// 构建返回的数据格式
	const getFormData = {
		emptyFlag: formData.value.emptyFlag, // 是否为空 1-不为空 2-为空
		beginCheckFlag: formData.value.beginCheckFlag.length ? 1 : 0, // 邮编开头（复选框） 0-没有勾选 1-有勾选
		beginList: formData.value.beginList, // 邮编开头列表
		includeCheckFlag: formData.value.includeCheckFlag.length ? 1 : 0, // 邮编包含（复选框） 0-没有勾选 1-有勾选
		includeList: formData.value.includeList, // 邮编包含列表
		beginAndIncludeCheckFlag: formData.value.beginAndIncludeCheckFlag.length
			? 1
			: 0, // 以上两项满足其中一项（复选框） 0-没有勾选 1-有勾选
		specifyCheckFlag: formData.value.specifyCheckFlag.length ? 1 : 0, // 指定邮编（复选框） 0-没有勾选 1-有勾选
		specifyType: formData.value.specifyType, // 指定邮编匹配类型 1：精准匹配 2：前缀匹配
		specifyList: formData.value.specifyList, // 指定邮编列表
		excludeCheckFlag: formData.value.excludeCheckFlag.length ? 1 : 0, // 排除邮编（复选框） 0-没有勾选 1-有勾选
		excludeType: formData.value.excludeType, // 排除邮编匹配类型 1：精准匹配 2：前缀匹配
		excludeList: formData.value.excludeList, // 排除邮编列表
	};
	return {
		recipientPostcode: JSON.stringify(getFormData),
	};
};
// 设置回显值
const setFormData = (data: Record<string, any>) => {
	if (!data || !data.recipientPostcode) {
		return '错误：无效的数据格式';
	}
	const recipientPostcode = JSON.parse(data.recipientPostcode || '{}');
	formData.value = {
		...formData.value,
		emptyFlag: recipientPostcode?.emptyFlag || 1, // 是否为空
		beginCheckFlag: recipientPostcode?.beginCheckFlag === 1 ? [1] : [], // 邮编开头（复选框） 0-没有勾选 1-有勾选
		beginList: recipientPostcode?.beginList || [], // 邮编开头列表
		includeCheckFlag: recipientPostcode?.includeCheckFlag === 1 ? [1] : [], // 邮编包含（复选框） 0-没有勾选 1-有勾选
		includeList: recipientPostcode?.includeList || [], // 邮编包含列表
		beginAndIncludeCheckFlag:
			recipientPostcode?.beginAndIncludeCheckFlag === 1 ? [1] : [], // 以上两项满足其中一项（复选框） 0-没有勾选 1-有勾选
		specifyCheckFlag: recipientPostcode?.specifyCheckFlag === 1 ? [1] : [], // 指定邮编（复选框） 0-没有勾选 1-有勾选
		specifyType: recipientPostcode?.specifyType || 1, // 指定邮编匹配类型 1：精准匹配 2：前缀匹配
		specifyList: recipientPostcode?.specifyList || [], // 指定邮编列表
		excludeCheckFlag: recipientPostcode?.excludeCheckFlag === 1 ? [1] : [], // 排除邮编（复选框） 0-没有勾选 1-有勾选
		excludeType: recipientPostcode?.excludeType || 1, // 排除邮编匹配类型 1：精准匹配 2：前缀匹配
		excludeList: recipientPostcode?.excludeList || [], // 排除邮编列表
	};
	return null;
};
// 完善的数据设置函数

// 暴露方法给父组件
defineExpose({
	init,
	validateForm,
	setFormData,
});
</script>
<template>
	<div class="box">
		<el-form :model="formData" ref="formRef" label-width="150px" :rules="rules">
			<el-row class="base-info" :gutter="20">
				<el-col :span="24">
					<el-form-item :label="t('收货邮编')" prop="emptyFlag">
						<el-row style="width: 100%">
							<el-col :span="3">
								<el-select
									v-model="formData.emptyFlag"
									filterable
									placeholder="是否为空"
									style="width: 100%"
								>
									<el-option
										v-for="item in [
											{
												id: '1',
												label: '为空',
												value: 1,
											},
											{
												id: '2',
												label: '不为空',
												value: 2,
											},
										]"
										:key="item.id"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-col>
							<el-col :span="20" class="ml-1">
								支持数字,字母,中划线-和空格
								,支持批量复制不同分项按逗号分隔,按回车(Enter)或者点击鼠标完成输入.
								<br />
								输入建议在仅有[收货邮编]条件时,所有邮编配置项建议不超过2000个,纯范围邮编不超过100个
								超过上述数量拆分成多个条件,酌情减少[收货邮编]输入数量</el-col
							>
						</el-row>
						<el-card
							style="width: 100%"
							class="mt-2"
							shadow="never"
							v-show="formData.emptyFlag !== 1"
						>
							<el-row style="width: 100%">
								<el-col :span="24">
									<el-checkbox-group v-model="formData.beginCheckFlag">
										<el-checkbox
											label="邮编开头(例如美国纽约邮编开头为10,则输入10即可)"
											:value="1"
										/>
										<el-input-tag
											v-model="formData.beginList"
											trigger="Enter"
											@blur="handleBlur('beginList')"
										/>
									</el-checkbox-group>
								</el-col>
							</el-row>
							<el-row style="width: 100%">
								<el-col :span="24">
									<el-checkbox-group v-model="formData.includeCheckFlag">
										<el-checkbox label="邮编包含" :value="1" />
									</el-checkbox-group>
									<el-input-tag
										v-model="formData.includeList"
										trigger="Enter"
										@blur="handleBlur('includeList')"
									/>
								</el-col>
							</el-row>
							<el-row
								style="width: 100%"
								class="mb-2"
								:style="{
									borderBottom: '1px solid #e4e7ed',
									padding: '10px 0px',
								}"
							>
								<el-col :span="24">
									<el-checkbox-group
										v-model="formData.beginAndIncludeCheckFlag"
									>
										<el-checkbox
											label="以上两项满足其中一项"
											:value="1"
											:disabled="
												!formData.beginCheckFlag.length ||
												!formData.includeCheckFlag.length
											"
										/>
									</el-checkbox-group>
								</el-col>
							</el-row>
							<el-row style="width: 100%" class="mt-2">
								<el-col :span="24">
									<el-checkbox-group v-model="formData.specifyCheckFlag">
										<el-checkbox
											label="指定邮编(支持设置单个邮编和邮编范围,使用~连接范围,范围邮编仅支持纯数字格式,0开头的邮编无法进行范围匹配)"
											:value="1"
										/>
									</el-checkbox-group>
									<br />
									<el-radio-group v-model="formData.specifyType">
										<el-radio :value="1" size="large"
											>精准匹配:(如:410000~419900,427700)</el-radio
										>
										<el-radio :value="2" size="large"
											>前缀匹配:(如:设置前缀范围10001~10126,则10001到10126都能匹配)
										</el-radio>
									</el-radio-group>
									<el-input-tag
										v-model="formData.specifyList"
										trigger="Enter"
										@blur="handleBlur('specifyList')"
									/>
								</el-col>
							</el-row>
							<el-row style="width: 100%" class="mt-2">
								<el-col :span="24">
									<el-checkbox-group v-model="formData.excludeCheckFlag">
										<el-checkbox
											label="排除邮编(支持设置单个邮编和邮编范围,使用~连接范围,范围邮编仅支持纯数字格式,0开头的邮编无法进行范围匹配)"
											:value="1"
										/>
									</el-checkbox-group>
									<br />
									<el-radio-group v-model="formData.excludeType">
										<el-radio :value="1" size="large"
											>精准匹配:(如:410000~419900,427700)</el-radio
										>
										<el-radio :value="2" size="large"
											>前缀匹配:(如:设置前缀范围10001~10126,则10001到10126都能匹配)
										</el-radio>
									</el-radio-group>
									<el-input-tag
										v-model="formData.excludeList"
										trigger="Enter"
										@blur="handleBlur('excludeList')"
									/>
								</el-col>
							</el-row>
						</el-card>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>

<style scoped lang="scss">
.box {
	padding: 10px;
	border-radius: 5px;
}
:deep(.el-radio__input.is-checked + .el-radio__label) {
	color: #606266;
}
:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
	color: #606266;
}
</style>
