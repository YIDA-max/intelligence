<!-- excel 导入组件 -->
<template>
	<el-dialog
		:title="prop.title"
		v-model="state.upload.open"
		:close-on-click-modal="false"
		draggable
	>
		<el-upload
			ref="uploadRef"
			:limit="1"
			accept=".xlsx, .xls ,.zip, .rar"
			:headers="headers"
			:action="baseURL + other.adaptationUrl(url)"
			:disabled="state.upload.isUploading"
			:on-progress="handleFileUploadProgress"
			:on-success="handleFileSuccess"
			:on-error="handleFileError"
			:auto-upload="false"
			drag
		>
			<el-icon color="#2E5CF6" size="18"><Upload /></el-icon>
			<div class="el-upload__text">
				{{ $t('拖拽或选择文件上传') }}
			</div>
			<template #tip>
				<div class="el-upload__tip">
					<div class="bg-[#dee8fc] py-[20px] px-[10px] rounded-lg">
						<div
							class="flex items-center"
							v-for="(tip, index) of uploadTips"
							:key="index"
						>
							<div class="circle"></div>
							<div>{{ tip }}</div>
						</div>
					</div>
					<div class="flex items-center mt10">
						<el-link
							v-if="tempUrl"
							type="primary"
							underline="never"
							style="font-size: 12px; vertical-align: baseline"
							@click="downExcelTemp"
						>
							<el-icon color="#2E5CF6" size="18"><Upload /></el-icon>
							{{ $t('excel.downloadTemplate') }}
						</el-link>
						<span class="ml15 text-[#cecece]">2025.6.10更新</span>
					</div>
					<!-- <span>{{ $t('excel.fileFormat') }}</span>
          <el-link type="primary" underline="never" style="font-size: 12px; vertical-align: baseline"
                   @click="downExcelTemp" v-if="tempUrl"
          >{{ $t('excel.downloadTemplate') }}
          </el-link> -->
				</div>
			</template>
		</el-upload>
		<template #footer>
			<el-button @click="state.upload.open = false">{{
				$t('common.cancelButtonText')
			}}</el-button>
			<el-button type="primary" @click="submitFileForm">{{
				$t('导入')
			}}</el-button>
		</template>
	</el-dialog>

	<!--校验失败错误数据-->
	<el-dialog
		:title="$t('excel.validationFailureData')"
		v-model="state.errorVisible"
	>
		<el-table :data="state.errorData" native-scrollbar>
			<el-table-column
				property="lineNum"
				:label="$t('excel.lineNumbers')"
				width="100"
			></el-table-column>
			<el-table-column
				property="errors"
				:label="$t('excel.misDescription')"
				show-overflow-tooltip
			>
				<template v-slot="scope">
					<el-tag
						type="danger"
						v-for="error in scope.row.errors"
						:key="error"
						>{{ error }}</el-tag
					>
				</template>
			</el-table-column>
		</el-table>
	</el-dialog>
</template>

<script setup lang="ts">
import { useMessage } from '/@/hooks/message';
import other from '/@/utils/other';
import { Session } from '/@/utils/storage';

const emit = defineEmits(['sizeChange', 'refreshDataList']);
const prop = defineProps({
	url: {
		type: String,
	},
	title: {
		type: String,
	},
	tempUrl: {
		type: String,
	},
});

const uploadRef = ref();

const state = reactive({
	errorVisible: false,
	errorData: [],
	dialog: {
		title: '',
		isShowDialog: false,
	},
	upload: {
		open: false,
		isUploading: false,
	},
});

/**
 * 下载模板文件
 */
const downExcelTemp = async () => {
	try {
		await other.downBlobFile(
			other.adaptationUrl(prop.tempUrl),
			{},
			'temp.xlsx'
		);
	} catch (error) {
		useMessage().error('模板下载失败，请先维护模板文件');
	}
};

/**
 * 上传进度条变化事件
 */
const handleFileUploadProgress = () => {
	state.upload.isUploading = true;
};

/**
 * 上传失败事件处理
 */
const handleFileError = () => {
	useMessage().error('上传失败,数据格式不合法!');
	state.upload.open = false;
};

/**
 * 上传成功事件处理
 * @param {any} response - 上传成功的响应结果
 */
const handleFileSuccess = (response: any) => {
	state.upload.isUploading = false;
	state.upload.open = false;
	uploadRef.value.clearFiles();

	// 校验失败
	if (response.code === 1) {
		useMessage().error('导入失败，以下数据不合法');
		state.errorVisible = true;
		state.errorData = response.data;
		uploadRef.value.clearFiles();
		// 刷新表格
		emit?.('refreshDataList');
	} else {
		useMessage().success(response.msg ? response.msg : '导入成功');
		// 刷新表格
		emit?.('refreshDataList');
	}
};

/**
 * 提交表单，触发上传
 */
const submitFileForm = () => {
	uploadRef.value.submit();
};

/**
 * 显示上传文件对话框，并清除上传信息
 */
const show = () => {
	state.upload.isUploading = false;
	state.upload.open = true;
};

/**
 * 计算请求头部信息
 */
const headers = computed(() => {
	return {
		Authorization: 'Bearer ' + Session.getToken(),
		'TENANT-ID': Session.getTenant(),
	};
});

const uploadTips = ref([
	'建议每次导入都使用最新的导入模板，避免出现不必要的错误',
	'仅支持xls/xlsx格式',
	'行数不超过5000条，文件大小不超过5M',
	'同一个类目代码存在多条记录时，以第一条为准',
]);

// 暴露变量
defineExpose({
	show,
});
</script>

<style scoped lang="scss">
.circle {
	width: 4px;
	height: 4px;
	background-color: #6b6e74;
	border-radius: 50%;
	margin-right: 4px;
}
</style>
