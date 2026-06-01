<template>
	<el-dialog
		v-bind="$attrs"
		:close-on-click-modal="false"
		:title="props.title"
		width="40%"
		@open="handleOpen"
		draggable
	>
		<div class="dialog-container">
			<el-form
				:model="formData"
				:rules="rules"
				ref="formRef"
				label-width="110px"
			>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="店铺名称" prop="storeName">
							<el-input
								v-model="formData.storeName"
								maxlength="100"
								show-word-limit
								placeholder="请输入店铺名称"
								:disabled="props.visibleType === 'edit'"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="法人主体" prop="legalPersonId">
							<SelectInputApi
								componentType="legalEntity"
								v-model="formData.legalPersonId"
								placeholder="请选择"
								:settings="{
									getTreeDataOptions: { enable: false, delay: 0 },
								}"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="店铺别名" prop="storeAlias">
							<el-input
								v-model="formData.storeAlias"
								maxlength="30"
								show-word-limit
								placeholder="请输入店铺别名"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="平台渠道" prop="platformChannelCode">
							<SelectInputApi
								componentType="dicts"
								v-model="formData.platformChannelCode"
								placeholder="请选择"
								:disabled="props.visibleType === 'edit'"
								:settings="{
									getTreeDataParams: 'platform_channel',
								}"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="站点" prop="siteCode">
							<SelectInputApi
								componentType="country"
								v-model="formData.siteCode"
								placeholder="请选择"
								:disabled="props.visibleType === 'edit'"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="店铺负责人" prop="managerId">
							<SelectInputApi
								componentType="userList"
								v-model="formData.managerId"
								placeholder="请选择"
								:settings="{
									getTreeDataParams: { lockFlag: 0 },
								}"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="部门&运营小组" prop="deptId">
							<el-cascader
								class="cascader-eq"
								v-model="formData.deptId"
								placeholder="层级选择部门&运营小组"
								style="width: 100%"
								clearable
								:options="props.dictMap.deptTree"
								collapse-tags
								filterable
								:props="{
									label: 'name',
									value: 'id',
									emitPath: false,
									checkStrictly: false,
									leafOnly: true,
								}"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="核算主体" prop="accountingLegalPersonId">
							<SelectInputApi
								componentType="legalEntity"
								v-model="formData.accountingLegalPersonId"
								placeholder="请选择"
								:settings="{
									getTreeDataOptions: { enable: true, delay: 300 },
								}"
							/>
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
				<el-button type="primary" @click="onSubmit" :disabled="loading">{{
					$t('保存')
				}}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';
import { useMessage } from '/@/hooks/message';
import { addInit, editInit, addFormInit } from './utils';

const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);

const props = defineProps({
	title: { type: String, default: '新增店铺' },
	currentRow: { type: Object, default: () => ({}) }, // 当前编辑的数据
	visibleType: { type: String, default: '' }, // 弹窗类型
	dictMap: { type: Object, default: () => ({}) }, // 字典数据
});
const emit = defineEmits(['closeDialog', 'save']);

// 加载
const loading = ref(false);

// form表单
const formRef = ref();
const formData = ref<any>({});

// 校验规则
const rules = ref({
	storeName: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
	legalPersonId: [
		{ required: true, message: '请选择法人主体', trigger: 'change' },
	],
	platformChannelCode: [
		{ required: true, message: '请选择平台渠道', trigger: 'change' },
	],
	siteCode: [{ required: true, message: '请选择站点', trigger: 'change' }],
	managerId: [
		{ required: true, message: '请选择店铺负责人', trigger: 'change' },
	],
	deptId: [{ required: true, message: '请选择部门&运营小组', trigger: 'blur' }],
	accountingLegalPersonId: [
		{ required: true, message: '请选择核算主体', trigger: 'change' },
	],
});
// 打开弹窗
const handleOpen = async () => {
	if (props.visibleType === 'edit') {
		editInit(formData, props.currentRow);
	} else if (props.visibleType === 'add') {
		// 重置表单
		addInit(formData, formRef);
	}
};

// 关闭弹窗
const handleClose = () => {
	emit('closeDialog');
};

// 提交
const onSubmit = async () => {
	loading.value = true;
	try {
		if (!formRef.value) return;
		// 校验表单
		const valid = await formRef.value.validate();
		if (!valid) return;
		await addFormInit(
			formData.value,
			props.visibleType,
			props.currentRow,
			handleClose
		);
	} catch (error: any) {
		loading.value = false;
		useMessage().error(error.msg || '操作失败，请稍后重试');
		return;
	} finally {
		loading.value = false;
	}
};

defineExpose({
	handleOpen,
});
</script>

<style lang="scss" scoped>
.dialog-container {
	padding: 0 20px;
	height: 40vh;
	overflow: auto;
}
.mb18 {
	margin-bottom: 18px;
}
/* 目标：与其它表单项一致，默认 32px；*/
:deep(.cascader-eq .el-input__wrapper) {
	min-height: 32px;
	height: 32px;
	padding-top: 2px; /* 让内容垂直居中 */
	padding-bottom: 2px;
}

/* multiple 模式的标签容器，避免把输入框“压矮” */
:deep(.cascader-eq .el-cascader__tags) {
	display: flex;
	align-items: center;
	margin-top: 15px; /* 去掉多余顶边距 */
	line-height: 20px;
}

/* 标签本身稍微压缩，防止撑高 */
:deep(.cascader-eq .el-tag) {
	height: 20px;
	line-height: 20px;
	padding: 0 6px;
	font-size: 12px;
}

/* 输入文字的行高 */
:deep(.cascader-eq .el-input__inner) {
	line-height: 28px;
}
</style>
