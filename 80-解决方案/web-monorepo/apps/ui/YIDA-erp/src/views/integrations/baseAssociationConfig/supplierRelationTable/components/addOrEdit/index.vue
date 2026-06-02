<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import type { FormRules } from 'element-plus';
import {
	addSupplierRelationTable,
	updateSupplierRelationTable,
	getSupplierRelationTableDetail,
} from '/@/api/integrations/baseAssociationConfig/supplierRelationTable/index';
import { useFormDialog } from './hooks/index';
import SelectInputApi from '/@/componentsApi/SelectInputApi/index.vue';

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
		supplierCode: '',
		source: '',
		qianyiName: '',
		kingdeeSupplierCode: '',
	}),
	// 表单验证规则
	formRules: {
		supplierCode: [
			{ required: true, message: '请选择仟易供应商', trigger: 'change' },
		],
		kingdeeSupplierCode: [
			{ required: true, message: '请输入金蝶内部供应商', trigger: 'blur' },
		],
		kingdeeOrgCode: [
			{ required: false, message: '请输入金蝶使用组织', trigger: 'blur' },
		],
	} as FormRules,
	// API 接口
	addApi: addSupplierRelationTable,
	updateApi: updateSupplierRelationTable,
	getDetailApi: getSupplierRelationTableDetail,
	// 成功回调
	onSuccess: () => {
		emit('getDataList');
	},
});

// 打开弹窗（适配组件使用方式）
const handleOpen = () => {
	nextTick(() => {
		openDialog(props.type, props.row);
	});
};

// 提交表单（适配组件使用方式）
const onSubmit = () => {
	submitForm(props.type, props.row);
};

// 计算弹窗标题
const title = computed(() => getTitle(props.type));

// 供应商选择器 ref，用于获取 rawData
const supplierRef = ref();

const changeSupplier = (val: any) => {
	// 从 rawData 中找到选中项，valueKey 为 logisticsCode
	const selected = supplierRef.value?.rawData?.find(
		(item: any) => item.logisticsCode === val
	);
	if (selected) {
		formData.value.source = selected.source;
	}
};

// 暴露方法供外部调用
defineExpose({
	handleOpen,
	handleClose,
});
</script>

<template>
	<div>
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
			width="800px"
			@close="handleClose"
			:append-to-body="true"
			draggable
		>
			<div class="dialog-container" v-loading="loading">
				<el-form
					label-width="160px"
					ref="formRef"
					:model="formData"
					:rules="rules"
				>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item prop="supplierCode" label="仟易供应商">
								<SelectInputApi
									v-model="formData.supplierCode"
									componentType="qianyiSupplierMerge"
									:disabled="type === 'edit'"
									@change="changeSupplier"
									ref="supplierRef"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item prop="kingdeeSupplierCode" label="金蝶内部供应商">
								<SelectInputApi
									v-model="formData.kingdeeSupplierCode"
									componentType="kingdeeSupplier"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20" class="mb-3">
						<el-col :span="24">
							<el-form-item prop="kingdeeOrgCode" label="金蝶使用组织">
								<SelectInputApi
									v-model="formData.kingdeeOrgCode"
									componentType="kingdeeOrg"
									placeholder="金蝶使用组织"
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
					<el-button type="primary" @click="onSubmit">{{
						$t('common.confirmButtonText')
					}}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<style lang="scss" scoped>
.dialog-container {
	padding: 0 20px;
	max-height: 60vh;
	overflow: auto;
}
</style>
