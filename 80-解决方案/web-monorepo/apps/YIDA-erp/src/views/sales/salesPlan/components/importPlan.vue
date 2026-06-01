<template>
	<el-dialog
		v-bind="$attrs"
		v-model="visible"
		:title="title"
		width="600px"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		@close="handleClose"
	>
		<el-form ref="formRef" :rules="rulesForm" :model="formData" label-position="top" label-width="100px">
			<el-row class="mb18" v-if="props.isShowMonth">
				<el-col :span="24">
					<el-form-item label="选择月份" prop="month">
						<el-date-picker
							v-model="formData.month"
							type="monthrange"
							range-separator="To"
							start-placeholder="开始月份"
							end-placeholder="结束月份"
							placeholder="选择月份"
							value-format="YYYY-MM-DD"
							@change="changeMonth"
						/>
					</el-form-item>
				</el-col>
			</el-row>
			<span class="downloadText" v-if="props.isShowMonth" @click="downTemplate">下载导入模板</span>
			<el-row class="mb18">
				<el-col :span="24">
					<el-form-item label="上传文件" prop="file">
						<Upload
							ref="fileUpload"
							:limit="1"
							:file-size="20"
							@getFile="changeFile"
							:file-type="['xlsx', 'xls']"
							v-model="formData.file"
							:is-show-tip="true"
							:upload-file-url="''"
							type="default"
							:data="{}"
							:dir="''"
							:auto-upload="false"
							:disabled="false"
						/>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">取消</el-button>
				<el-button type="primary" @click="handleConfirm"> 确定 </el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Upload from '/@/components/Upload/index.vue';
import { useMessage } from '/@/hooks/message';
import { salesPlanTemp } from '/@/api/sales/index';

const props = defineProps({
	isShowMonth: {
		type: Boolean,
		default: true,
	},
	title: {
		type: String,
		default: '导入计划',
	},
});
const { t } = useI18n();
const emit = defineEmits(['confirm']);
const fileUpload = ref();
// 弹窗显示
const visible = ref(false);
const selectedFileList = ref<any[]>([]);
const formRef = ref();
const formData = ref<{
	month: string[];
	file: any[];
	startTime: string;
	endTime: string;
}>({
	month: [],
	file: [],
	startTime: '',
	endTime: '',
});
const rulesForm = {
	month: [{ required: true, message: '请选择月份', trigger: 'change' }],
	file: [{ required: true, message: '请上传文件', trigger: 'change' }],
};

// 打开弹窗
const handleOpen = (type: string, row?: any) => {
	if (type === 'edit' && row) {
		// 编辑模式，初始化月份区间
		const start = row.startTime ? `${row.startTime}-01` : '';
		const end = row.endTime ? `${row.endTime}-01` : '';
		formData.value = {
			file: [],
			month: start && end ? [start, end] : [],
			startTime: row.startTime || '',
			endTime: row.endTime || '',
		};
	} else {
		// 新增模式
		formData.value = {
			file: [],
			month: [],
			startTime: '',
			endTime: '',
		};
	}
	selectedFileList.value = [];
	visible.value = true;
};

const changeMonth = (val: any) => {
	formData.value.startTime = val[0].slice(0, 7);
	formData.value.endTime = val[1].slice(0, 7);
};

// 关闭弹窗
const handleClose = () => {
	visible.value = false;
};
const downTemplate = async () => {
	if (props.isShowMonth) {
		if (!formData.value.month || formData.value.month.length === 0) {
			useMessage().error('请先选择月份');
			return;
		}
	}
	try {
		await salesPlanTemp({
			startTime: formData.value.startTime,
			endTime: formData.value.endTime,
		});
	} catch (error) {
		useMessage().error(t(error as string));
	}
};

// 确认
const handleConfirm = () => {
	if (formRef.value) {
		formRef.value.validate((valid: boolean) => {
			if (valid) {
				// 检查是否有选中的文件
				if (selectedFileList.value.length === 0) {
					useMessage().error('请先选择要上传的文件');
					return;
				}

				// 获取第一个文件的原始文件对象
				const file = selectedFileList.value[0];
				if (!file.raw) {
					useMessage().error('文件对象无效');
					return;
				}
				// 传递文件对象和月份信息给父组件
				emit('confirm', {
					file: file.raw,
					fileName: file.name,
					startTime: formData.value.startTime,
					endTime: formData.value.endTime,
				});
			}
		});
	}
};

const changeFile = (fileList: any[]) => {
	selectedFileList.value = fileList;
};

defineExpose({
	handleOpen,
	handleClose,
});
</script>

<style lang="scss" scoped>
.downloadText {
	color: #409eff;
	cursor: pointer;
}
</style>
