<script setup lang="ts">
import { useMessage } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import {
	postSpInfoSave,
	postSpInfoUpdate,
} from '/@/api/warehouse/spInfo/index';
import { ref } from 'vue';

const emit = defineEmits(['closeDialog']);

const props = defineProps({
	title: {
		type: String,
		default: '',
	},
	visibleType: {
		type: String,
		default: 'add',
	},
	currentSpInfo: {
		type: Object,
		default: () => ({}),
	},
});
const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const loading = ref(false);

// 提交表单数据
const form = ref({
	spName: '',
	id: '',
});

// 定义校验规则
const dataRules = ref({
	spName: [
		{ max: 30, message: '长度在 30 个字符', trigger: 'blur' },
		{
			required: true,
			message: '服务商名称不能为空',
			trigger: 'blur',
		},
	],
});

// 弹窗初始化
const initDialog = () => {
	if (props.visibleType === 'add') {
		form.value = {
			spName: '',
			id: '',
		};
	} else if (props.visibleType === 'edit') {
		form.value = {
			spName: props.currentSpInfo.spName,
			id: props.currentSpInfo.id,
		};
	}
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		loading.value = true;
		const res =
			props.visibleType === 'add'
				? await postSpInfoSave({
						spName: form.value.spName,
				  })
				: props.visibleType === 'edit'
				? await postSpInfoUpdate({
						id: form.value.id,
						spName: form.value.spName,
				  })
				: {
						code: 1,
						msg: '',
				  };
		if (res.code === 0) {
			useMessage().success(
				t(form.value.id ? 'common.editSuccessText' : 'common.addSuccessText')
			);
		} else {
			return;
		}
		// 关闭弹窗
		closeDialog();
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

const closeDialog = () => {
	emit('closeDialog');
};
</script>
<template>
	<el-dialog
		width="30%"
		:close-on-click-modal="false"
		draggable
		@open="initDialog"
		@close="closeDialog"
		:title="
			props.title ||
			(props.visibleType === 'add' ? $t('添加服务商') : $t('编辑服务商'))
		"
	>
		<el-form
			ref="dataFormRef"
			:model="form"
			:rules="dataRules"
			label-width="100px"
			v-loading="loading"
		>
			<el-form-item :label="t('服务商名称')" prop="spName">
				<el-input
					v-model="form.spName"
					:placeholder="t('请输入')"
					maxlength="30"
					show-word-limit
				/>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="closeDialog">{{
					$t('common.cancelButtonText')
				}}</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">{{
					props.visibleType === 'view'
						? $t('common.viewButtonText')
						: props.visibleType === 'edit'
						? $t('保存')
						: props.visibleType === 'add'
						? $t('添加')
						: ''
				}}</el-button>
			</span>
		</template>
	</el-dialog>
</template>
