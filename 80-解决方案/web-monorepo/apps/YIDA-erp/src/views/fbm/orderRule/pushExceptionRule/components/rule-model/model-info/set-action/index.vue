<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 17:43:46
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-03-31 10:40:29
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\pushExceptionRule\components\rule-model\model-info\set-action\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// 编辑标签组件
const EditTag = defineAsyncComponent(
	() => import('/@/components/EditTag/index.vue')
);
// 表单数据
const formData = ref<Record<string, any>>({
	tag: [],
	actionParam1: '',
	actionParam4: '',
});
// 表单引用
const formRef = ref<any>(null);

// const tagValue = computed(() => {
// 	return formData.value.tag?.map((item: { id: string }) => item.id) || [];
// });
// 编辑标签
const handleEditTag = async (tag: any) => {
	formData.value.tag = tag;
};
const init = () => {
	formData.value = {
		tag: [],
		actionList: [],
		actionParam1: '',
		actionParam4: '',
	};
};
// 导出给父组件的方法
// 获取表单数据
const validateForm = async () => {
	await formRef.value.validate();
	if (!formData.value.actionList.length) {
		return Promise.reject(t('请选择动作'));
	}
	// 手动校验 actionParam
	if (formData.value.actionList.includes(1)) {
		if (!formData.value.actionParam1) {
			return Promise.reject(t('请输入缩减详细地址长度的最大字符数'));
		}
		if (!/^[1-9]\d*$/.test(formData.value.actionParam1)) {
			return Promise.reject(t('缩减详细地址长度的最大字符数必须为正整数'));
		}
	}
	if (formData.value.actionList.includes(4)) {
		if (!formData.value.actionParam4) {
			return Promise.reject(t('请输入电话增加前缀'));
		}
	}
	// const ruleActionList = formData.value.actionList;
	const ruleActionList = formData.value.actionList.map((type: number) => {
		let param = undefined;
		if (type === 1) param = formData.value.actionParam1;
		if (type === 4) param = formData.value.actionParam4;
		return {
			actionType: type,
			actionParam: param,
		};
	});
	const getFormData = {
		tagIds: formData.value.tag?.map((item: { id: string }) => item.id),
		actions: ruleActionList,
	};
	return getFormData;
};
// 设置表单数据
const setFormData = (data: Record<string, any>) => {
	const actions = data.actions || [];
	const action1 = actions.find(
		(a: { actionType: number }) => a.actionType === 1
	);
	const action4 = actions.find(
		(a: { actionType: number }) => a.actionType === 4
	);
	formData.value = {
		...formData.value,
		tag: data.tagInfoVOS || [],
		actionList: actions.map((a: { actionType: number }) => a.actionType),
		actionParam1: action1 ? action1.actionParam : '',
		actionParam4: action4 ? action4.actionParam : '',
	};
}; // 暴露给父组件的方法

const tagValue = computed(() => {
	return formData.value.tag?.map((item: { id: string }) => item.id) || [];
});
defineExpose({
	validateForm,
	init,
	setFormData,
});
</script>
<template>
	<div class="box">
		<el-form :model="formData" ref="formRef" label-width="150px">
			<el-row class="title">
				<el-col :span="24">
					{{ t('设定动作') }}
				</el-col>
			</el-row>
			<el-row class="base-info" :gutter="20">
				<el-col :span="24">
					<el-form-item prop="actionList">
						<el-row style="width: 100%">
							<el-col :span="24">
								<el-checkbox-group v-model="formData.actionList">
									<div class="action-item">
										<el-checkbox :value="1">{{
											t('缩减详细地址长度，最大字符')
										}}</el-checkbox>
										<el-form-item class="inline-form-item">
											<el-input
												v-model="formData.actionParam1"
												style="width: 100px; margin-left: 10px"
												size="small"
											/>
										</el-form-item>
									</div>
									<div class="action-item">
										<el-checkbox :value="2">{{
											t('收件人名由小语种变更为英文')
										}}</el-checkbox>
									</div>
									<div class="action-item">
										<el-checkbox :value="3">{{
											t(
												'重新确认城市 (城市名称填错，或更名前名称，调整为最新名称)'
											)
										}}</el-checkbox>
									</div>
									<div class="action-item">
										<el-checkbox :value="4">{{
											t('电话增加前缀')
										}}</el-checkbox>
										<el-form-item class="inline-form-item">
											<el-input
												v-model="formData.actionParam4"
												style="width: 100px; margin-left: 10px"
												size="small"
											/>
										</el-form-item>
									</div>
								</el-checkbox-group>
							</el-col>
						</el-row>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="base-info mt-5" :gutter="20">
				<el-col :span="24">
					<el-form-item label="关联订单标签" prop="tag">
						<el-row style="width: 100%">
							<el-col :span="24" class="flex">
								<el-tag
									:style="{
										marginLeft: '8px',
										color: '#fff',
									}"
									v-for="item in formData.tag"
									:key="item.id"
									:color="item.color"
									>{{ item.name }}</el-tag
								>
								<EditTag
									@submit="handleEditTag"
									:value="tagValue"
									type="text"
									:style="{
										marginLeft: '8px',
									}"
								/>
							</el-col>
						</el-row>
					</el-form-item>
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
}
.inline-form-item {
	display: inline-block;
	margin-bottom: 0;
	vertical-align: middle;
}
.action-item {
	display: flex;
	align-items: center;
	margin-bottom: 5px;
}
</style>
