<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-01-29 16:43:15
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-04-15 19:25:12
 * @FilePath: \qianyi-ui\src\views\template\curd\components\addOrEdit\index.vue
 * @Description: 添加/编辑结算账单组件
 * 
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { computed } from 'vue';
import type { FormRules } from 'element-plus';
import { addCurd, updateCurd, getCurdDetail } from '../../api/index';
import { useFormDialog } from './hooks/index';

interface Props {
	type?: 'add' | 'edit';
	row?: { id: string };
}

const props = withDefaults(defineProps<Props>(), {
	type: 'add',
	row: () => ({ id: '' }),
});

const emit = defineEmits<{
	(e: 'getDataList'): void;
}>();

// 使用表单管理 Hook
const {
	visible,
	loading,
	formRef,
	formData,
	rules,
	handleOpen: openDialog,
	handleClose,
	onSubmit: submitForm,
	getTitle,
} = useFormDialog({
	// 初始表单数据
	initialFormData: () => ({
		field1: '',
		field2: '',
		field3: '',
	}),
	// 表单验证规则
	formRules: {
		field1: [{ required: true, message: '请输入字段1', trigger: 'blur' }],
		field2: [{ required: true, message: '请输入字段2', trigger: 'blur' }],
		field3: [{ required: true, message: '请选择字段3', trigger: 'blur' }],
	} as FormRules,
	// API 接口
	addApi: addCurd,
	updateApi: updateCurd,
	getDetailApi: getCurdDetail,
	// 成功回调
	onSuccess: () => {
		emit('getDataList');
	},
});

// 打开弹窗（适配组件使用方式）
const handleOpen = () => {
	openDialog(props.type, props.row);
};

// 提交表单（适配组件使用方式）
const onSubmit = () => {
	submitForm(props.type, props.row);
};

// 计算弹窗标题
const title = computed(() => getTitle(props.type));

// 暴露方法供外部调用
defineExpose({
	handleOpen,
	handleClose,
});
</script>
<template>
	<div>
		<!-- 具名插槽：如果传入了插槽内容，使用传入的内容，否则使用默认按钮 -->
		<slot name="trigger" :openDialog="handleOpen">
			<!-- 默认按钮：添加模式 -->
			<el-button
				v-if="type === 'add'"
				type="primary"
				@click="handleOpen"
				class="mr10"
			>
				{{ $t('common.addBtn') }}
			</el-button>
			<!-- 默认按钮：编辑模式 -->
			<el-link
				v-else
				type="primary"
				underline="never"
				@click="handleOpen"
				class="mr10"
			>
				{{ $t('common.editBtn') }}
			</el-link>
		</slot>

		<!-- 弹窗 -->
		<el-dialog
			v-model="visible"
			:close-on-click-modal="false"
			:title="title"
			width="80%"
			@close="handleClose"
			:append-to-body="true"
		>
			<div class="dialog-container" v-loading="loading">
				<el-form
					label-width="120px"
					ref="formRef"
					:model="formData"
					:rules="rules"
				>
					<el-row class="mb-2">
						<el-col :span="8">
							<el-form-item prop="field1" label="字段1">
								<el-date-picker
									v-model="formData.field1"
									type="text"
									placeholder="请输入字段1"
									style="width: 100%"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="field2" label="字段2">
								<el-input
									v-model="formData.field2"
									placeholder="请输入字段2"
									style="width: 100%"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="field3" label="字段3">
								<el-select
									v-model="formData.field3"
									placeholder="请选择字段3"
									style="width: 100%"
									clearable
									filterable
								>
									<el-option
										v-for="item in [
											{ value: '1', label: '选项1' },
											{ value: '2', label: '选项2' },
											{ value: '3', label: '选项3' },
										]"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="handleClose">{{
						$t('common.cancelButtonText')
					}}</el-button>
					<el-button type="primary" @click="onSubmit">{{
						$t('确认提交')
					}}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
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
