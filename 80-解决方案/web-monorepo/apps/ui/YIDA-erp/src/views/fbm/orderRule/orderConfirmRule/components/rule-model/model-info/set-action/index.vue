<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 17:43:46
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-13 17:12:14
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\orderConfirmRule\components\rule-model\model-info\set-action\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
// 编辑标签组件
const EditTag = defineAsyncComponent(() => import('/@/components/EditTag/index.vue'));
// 表单数据
const formData = ref<Record<string, any>>({
	tag: [],
	autoFlag: 1, // 发货确认方式 1-自动确认 2-人工确认
});
// 表单引用
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	autoFlag: [{ required: true, message: '请选择发货确认方式', trigger: 'blur' }],
});
// 编辑标签
const handleEditTag = async (tag: any) => {
	formData.value.tag = tag;
};
const init = () => {
	formData.value = {
		tag: [],
		autoFlag: 1, // 发货确认方式 1-自动确认 2-人工确认
	};
};
// 导出给父组件的方法
// 获取表单数据
const validateForm = async () => {
	await formRef.value.validate();
	const getFormData = {
		autoFlag: formData.value.autoFlag,
		tagIds: formData.value.tag?.map((item: { id: string }) => item.id),
	};
	return getFormData;
};
// 设置表单数据
const setFormData = (data: Record<string, any>) => {
	formData.value = {
		...formData.value,
		autoFlag: data.autoFlag || 0,
		tag: data.tagInfoVOS || [],
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
			<el-row class="base-info" :gutter="20">
				<el-col :span="24">
					<el-form-item label="发货确认" prop="auto">
						<template #label>
							<span
								:style="{
									color: '#f78c8c',
									marginRight: '3px',
								}"
								>*
							</span>
							<span>{{ t('发货确认') }}</span>
						</template>
						<el-row style="width: 100%">
							<el-col :span="24">
								<el-radio-group v-model="formData.autoFlag">
									<el-radio :value="1" size="small">自动确认接单</el-radio>
									<el-radio :value="2" size="small">人工确认接单</el-radio>
								</el-radio-group>
							</el-col>
						</el-row>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="base-info" :gutter="20">
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
									:value="formData.tag?.map((item: { id: string; }) => item.id)"
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
</style>
