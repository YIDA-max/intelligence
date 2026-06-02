<template>
	<el-dialog
		v-bind="$attrs"
		v-model="visible"
		:title="props.addDialogTitle"
		:close-on-click-modal="false"
		width="1000px"
		height="500px"
		@close="handleClose"
	>
		<div v-loading="submitLoading" element-loading-text="保存中...">
			<el-form ref="dataFormRef" :model="form" label-width="100px" label-position="right" :rules="formRule">
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item label="选择月份:" prop="month">
							<el-date-picker v-model="form.month" type="month" placeholder="选择月份" value-format="YYYY-MM" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item prop="version" label="版本号:">
							<el-select v-model="form.version">
								<el-option v-for="item in source" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item prop="url" label="下载链接:">
							<el-input v-model="form.url" placeholder="请输入下载链接" type="textarea" maxlength="200" show-word-limit />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<template #footer>
			<el-button @click="handleClose" :disabled="submitLoading">取消</el-button>
			<el-button type="primary" @click="submit" :disabled="submitLoading">确认</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
const props = defineProps({
	addDialogTitle: {
		type: String,
		default: '',
	},
});
const dataFormRef = ref();
const emit = defineEmits(['submit']);
const visible = ref(false);
const submitLoading = ref(false);

const form = ref({
	version: null,
	url: null,
	month: '',
});

const source = [
	{ label: 'V1', value: 'V1' },
	{ label: 'V2', value: 'V2' },
];

const formRule = {
	version: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
	url: [{ required: true, message: '请输入下载链接', trigger: 'blur' }],
	month: [{ required: true, message: '请选择月份', trigger: 'blur' }],
};

const handleOpen = () => {
	visible.value = true;
	submitLoading.value = false;
};
const handleClose = () => {
	dataFormRef.value?.resetFields();
	visible.value = false;
	submitLoading.value = false;
};

const submit = async () => {
	const valid = await dataFormRef.value.validate();
	if (!valid) {
		return;
	}
	submitLoading.value = true;
	emit('submit', form.value);
};

defineExpose({
	handleOpen,
	handleClose,
	submitLoading,
});
</script>
