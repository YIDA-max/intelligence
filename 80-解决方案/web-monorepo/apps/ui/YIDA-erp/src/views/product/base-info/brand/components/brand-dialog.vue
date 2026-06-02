<template>
	<el-dialog width="30%" :close-on-click-modal="false" draggable @open="initDialog" :title="props.title">
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" label-width="100px" v-loading="loading">
			<el-form-item :label="t('品牌编码')" prop="brandCode">
				<el-input
					v-model="form.brandCode"
					:placeholder="t('请输入品牌编码')"
					maxlength="10"
					show-word-limit
					:disabled="props.visibleType === 'view' || props.visibleType === 'edit'"
				/>
			</el-form-item>
			<el-form-item :label="t('品牌名称')" prop="brandName">
				<el-input v-model="form.brandName" :placeholder="t('请输入品牌名称')" maxlength="25" show-word-limit />
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="closeDialog">{{ $t('common.cancelButtonText') }}</el-button>
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

<script setup lang="ts">
import { useMessage } from '/@/hooks/message';
import { postBrandSave, postBrandUpdate } from '/@/api/product/brand';
import { useI18n } from 'vue-i18n';
import { rule } from '/@/utils/validate';

const emit = defineEmits(['closeDialog']);
interface Brand {
	brandCode: string;
	brandName: string;
	id: string;
}
const props = defineProps({
	title: {
		type: String,
		default: '',
	},
	visibleType: {
		type: String,
		default: 'add',
	},
	currentRow: {
		type: Object as () => Brand,
		default: () => ({}),
	},
});
const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const loading = ref(false);

// 提交表单数据
const form = ref({
	brandCode: '',
	brandName: '',
	id: '',
});

// 定义校验规则
const dataRules = ref({
	brandCode: [
		{ required: true, message: '品牌编码不能为空', trigger: 'blur' },
		{ max: 10, message: '长度在 10 个字符', trigger: 'blur' },
		{ validator: rule.validatorCode, trigger: 'blur' },
	],
	brandName: [
		{ max: 25, message: '长度在 25 个字符', trigger: 'blur' },
		{
			required: true,
			message: '品牌名称不能为空',
			trigger: 'blur',
		},
	],
});

// 弹窗初始化
const initDialog = () => {
	if (props.visibleType === 'add') {
		form.value = {
			brandCode: '',
			brandName: '',
			id: '',
		};
	} else if (props.visibleType === 'edit') {
		form.value = {
			brandCode: props.currentRow.brandCode,
			brandName: props.currentRow.brandName,
			id: props.currentRow.id,
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
				? await postBrandSave({
						brandCode: form.value.brandCode,
						brandName: form.value.brandName,
				  })
				: props.visibleType === 'edit'
				? await postBrandUpdate({
						id: form.value.id,
						brandCode: form.value.brandCode,
						brandName: form.value.brandName,
				  })
				: {
						code: 1,
						msg: '',
				  };
		if (res.code === 0) {
			useMessage().success(t(form.value.id ? 'common.editSuccessText' : 'common.addSuccessText'));
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
