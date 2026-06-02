<template>
	<div class="file-uploader">
		<el-upload
			ref="uploadRef"
			:accept="accept"
			:limit="1"
			:headers="headers"
			:http-request="handleHttpRequest"
			:disabled="isUploading"
			:on-progress="handleProgress"
			:on-success="handleSuccess"
			:on-error="handleError"
			:on-remove="handleRemove"
			:before-upload="handleBeforeUpload"
			:auto-upload="autoUpload"
			:list-type="displayType"
			:drag="drag"
			:multiple="false"
			:file-list="fileList"
			:data="props.extraData"
			:on-change="handleChange"
		>
			<!-- 拖拽上传区域 -->
			<template v-if="drag">
				<el-icon><Upload /></el-icon>
				<div class="el-upload__text">
					{{ uploadText || $t('拖拽或点击上传文件') }}
				</div>
			</template>

			<!-- 普通上传按钮 -->
			<template v-else>
				<el-button :type="buttonType">{{ uploadText || '选择文件' }}</el-button>
			</template>

			<!-- 提示信息区域 -->
			<template #tip>
				<div class="el-upload__tip" v-if="showTip">
					<div class="bg-[#dee8fc] py-[20px] px-[10px] rounded-lg">
						<div
							class="flex items-center"
							v-for="(tip, index) of props.uploadTips"
							:key="index"
						>
							<div class="circle"></div>
							<div>{{ tip }}</div>
						</div>
					</div>
					<div class="flex items-center mt10">
						<el-link
							type="primary"
							underline="never"
							style="font-size: 12px; vertical-align: baseline"
							@click="downloadTemplate"
						>
							<el-icon color="#2E5CF6" size="18"><Download /></el-icon>
							{{ $t('excel.downloadTemplate') }}
						</el-link>
						<div class="ml10" v-if="showExpandTip" style="color: #eb4d65">
							{{ props.showExpandTip }}
						</div>
					</div>
				</div>
			</template>
		</el-upload>

		<!-- 导入错误数据弹窗（仅在指定返回情况下展示） -->
		<el-dialog
			:title="$t('excel.validationFailureData')"
			v-model="errorVisible"
			destroy-on-close
			:append-to-body="true"
			style="height: 600px"
		>
			<div class="errorTotal">
				<div class="items-total">
					<div class="fail-circle"></div>
					总数{{ totalCount }}
				</div>
				<div class="items-total">
					<div class="fail-circle green"></div>
					成功{{ successCount }}
				</div>
				<div class="items-total">
					<div class="fail-circle red"></div>
					失败{{ failCount }}
				</div>
			</div>
			<div class="error-reason">
				<el-icon class="error-icon" style="color: #eb4d65; margin-right: 4px"
					><Warning
				/></el-icon>
				<div>{{ $t('失败原因') }}</div>
			</div>
			<el-table :data="errorData" height="350">
				<el-table-column prop="info" show-overflow-tooltip></el-table-column>
			</el-table>
			<div class="text-primary" @click="downloadErrorFile">错误文件下载</div>
		</el-dialog>

		<!-- 使用公共进度组件 -->
		<UploadProgressDialog
			v-model="progressDialogVisible"
			title="导入进度"
			ref="progressDialogRef"
		/>
	</div>
</template>

<script setup lang="ts">
defineOptions({
	name: 'FileUploader',
});
import {
	ref,
	computed,
	watch,
	onBeforeUnmount,
	defineAsyncComponent,
} from 'vue';
import { useMessage } from '/@/hooks/message';
import other from '/@/utils/other';
import { Session } from '/@/utils/storage';
import { Download, Warning, Upload } from '@element-plus/icons-vue';
// import downService from '/@/utils/downRequest';

const UploadProgressDialog = defineAsyncComponent(
	() => import('/@/components/ProgressDialog/index.vue')
);

const baseURL = import.meta.env.VITE_API_URL || '';

const FILE_TYPES = {
	EXCEL: 'excel',
	IMAGE: 'image',
	ARCHIVE: 'archive',
	OTHER: 'other',
};

/// =====================================
/// Props 定义
/// =====================================
const props = defineProps({
	// v-model绑定值 - 可以是字符串(URL)、对象或数组
	modelValue: {
		type: [String, Array, Object],
		default: null,
	},

	// 上传配置
	accept: { type: String, default: '' }, // 接受的文件类型
	autoUpload: { type: Boolean, default: false }, // 是否自动上传
	drag: { type: Boolean, default: false }, // 是否允许拖拽上传
	listType: { type: String, default: '' }, // 列表类型，不传会自动判断
	buttonType: { type: String, default: 'primary' }, // 按钮类型
	uploadText: { type: String, default: '' }, // 上传按钮文字
	showTip: { type: Boolean, default: true }, // 是否显示提示

	// 模板配置
	templateUrl: { type: String, default: '' }, // 模板下载URL
	downLoadTemplateName: { type: String, default: 'template' }, // 模板下载名称

	// API配置 - 根据文件类型自动选择
	excelUploadApi: { type: String, default: '/product/sku/import' }, // Excel上传API
	imageUploadApi: { type: String, default: '' }, // 图片上传API
	archiveUploadApi: { type: String, default: '' }, // 压缩包上传API

	// 提示信息的配置
	uploadTips: {
		type: Array,
		default: () => [
			'建议每次导入都使用最新的导入模板，避免出现不必要的错误',
			'仅支持xls/xlsx格式',
			'行数不超过5000条，文件大小不超过5M',
			'同一个记录代码存在多条记录时，以第一条为准',
		],
	},
	// 下载模板旁提示信息
	showExpandTip: { type: String, default: '' },
	// 额外随文件一起上传的数据
	extraData: { type: Object, default: () => ({}) },

	// 是否启用内部进度弹窗（组件提供 openProgressDialog/closeProgressDialog）
	useProgressDialog: { type: Boolean, default: false },
	// 上传超时时间（毫秒），默认10分钟
	uploadTimeout: { type: Number, default: 600000 },
});

const emit = defineEmits([
	'progress',
	'success',
	'error',
	'refreshDataList',
	'update:modelValue',
	'change',
	'downloadTemplate',
]);

// 状态
const uploadRef = ref<any>(null); // 上传组件引用
const isUploading = ref(false); // 是否正在上传
const fileType = ref<string>(''); // 当前文件类型
const uploadUrl = ref<string>(''); // 当前上传URL
const fileResult = ref<any>(null); // 上传结果

// 错误弹窗
const errorVisible = ref(false);
const errorData = ref([]);
const errorUrl = ref('');

const totalCount = ref<number>(0);
const successCount = ref<number>(0);
const failCount = ref<number>(0);

// 进度对话框引用与可见性（进度由 ProgressDialog 管理）
const progressDialogVisible = ref(false);
const progressDialogRef = ref<any>(null);

// 显示类型 - 根据文件类型自动判断
const displayType = computed(() => {
	// 如果props指定了类型，优先使用
	if (props.listType) return props.listType;

	// 根据文件类型自动判断
	if (fileType.value === FILE_TYPES.IMAGE) {
		return 'picture-card';
	}

	// 默认为文本类型
	return 'text';
});

// 请求头 - 包含认证信息
const headers = computed(() => ({
	Authorization: 'Bearer ' + Session.getToken(),
	'TENANT-ID': Session.getTenant(),
}));

// 文件列表 - 用于展示
const fileList = computed({
	get: () => {
		if (!props.modelValue) return [];

		// 字符串类型 - 通常是图片URL
		if (typeof props.modelValue === 'string') {
			return props.modelValue
				? [
						{
							name: props.modelValue.split('/').pop(),
							url: props.modelValue,
						},
				  ]
				: [];
		}

		// 数组类型
		if (Array.isArray(props.modelValue)) {
			if (props.modelValue.length === 0) return [];

			return props.modelValue.map((item) => {
				if (typeof item === 'string') {
					return { name: item.split('/').pop(), url: item };
				}
				return item;
			});
		}

		// 对象类型
		if (typeof props.modelValue === 'object') {
			return [props.modelValue];
		}

		return [];
	},
	set(newValue: any) {
		if (Array.isArray(newValue) && newValue.length > 0) {
			emit('update:modelValue', newValue[0]);
		} else {
			emit('update:modelValue', null);
		}
	},
});

/**
 * 判断文件类型并返回上传信息
 * @param {string} fileName 文件名
 * @returns {Object} 包含URL和类型的对象
 */
const getFileTypeInfo = (fileName: string) => {
	if (!fileName) {
		return {
			url: props.excelUploadApi,
			type: FILE_TYPES.OTHER,
		};
	}

	const extension = '.' + fileName.split('.').pop()?.toLowerCase();

	// Excel文件
	if (['.xlsx', '.xls'].includes(extension)) {
		return {
			url: props.excelUploadApi || props.excelUploadApi,
			type: FILE_TYPES.EXCEL,
		};
	}

	// 图片文件
	if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'].includes(extension)) {
		return {
			url: props.imageUploadApi || props.excelUploadApi,
			type: FILE_TYPES.IMAGE,
		};
	}

	// 压缩包
	if (['.zip', '.rar'].includes(extension)) {
		return {
			url: props.archiveUploadApi || props.excelUploadApi,
			type: FILE_TYPES.ARCHIVE,
		};
	}

	// 其他文件类型
	return {
		url: props.excelUploadApi,
		type: FILE_TYPES.OTHER,
	};
};

/**
 * 处理上传响应数据
 * @param {Object} response 服务器响应
 * @returns {*} 处理后的数据
 */
const processResponse = (response: any) => {
	if (response.code !== 0 || !response.data) return null;

	// 图片处理
	if (fileType.value === FILE_TYPES.IMAGE) {
		return response.data.url || response.data;
	}

	// 其他文件
	return response.data;
};

/**
 * 下载模板文件
 */
const downloadTemplate = async () => {
	if (!props.templateUrl) {
		// 不传url可能模板获取方式不同，抛出事件自行处理
		emit('downloadTemplate');
		return;
	}
	try {
		// 生成带时间戳的 URL 以防缓存
		const date = Date.now().toString();
		const templateUrl = `${props.templateUrl}?t=${date}`;
		// 在新窗口打开（浏览器会自动下载文件）
		window.open(templateUrl, '_blank');
		return;
	} catch (error) {
		useMessage().error('模板下载失败，请先维护模板文件');
	}
};

const downloadErrorFile = () => {
	window.open(errorUrl.value, '_blank');
};

/**
 * 文件选择变更
 */
const handleChange = (file: { name?: string } | any) => {
	if (!file || !file.name) return;
	const { url, type } = getFileTypeInfo(file.name);
	fileType.value = type;
	uploadUrl.value = baseURL + other.adaptationUrl(url);
	emit('change', file);
	emit('update:modelValue', file);
};
/**
 * 上传前验证
 */
const handleBeforeUpload = (file: { name?: string } | any) => {
	// 确定文件类型和上传URL
	const { url, type } = getFileTypeInfo(file.name);
	fileType.value = type;
	uploadUrl.value = baseURL + other.adaptationUrl(url);
	return true;
};

/**
 * 自定义上传请求 - 支持超时配置
 */
const handleHttpRequest = (options: {
	file: File;
	action: string;
	headers: Record<string, string>;
	onProgress: (event: { percent: number }) => void;
	onSuccess: (response: any) => void;
	onError: (error: Error) => void;
}) => {
	const { file, headers, onProgress, onSuccess, onError } = options;
	const xhr = new XMLHttpRequest();
	const actionUrl = uploadUrl.value || options.action;

	// 上传超时
	xhr.timeout = props.uploadTimeout;
	// 监听上传进度
	xhr.upload.onprogress = (event) => {
		if (event.lengthComputable) {
			onProgress({ percent: Math.round((event.loaded / event.total) * 100) });
		}
	};

	// 监听加载完成
	xhr.onload = () => {
		if (xhr.status >= 200 && xhr.status < 300) {
			try {
				const response = JSON.parse(xhr.response);
				onSuccess(response);
			} catch {
				onSuccess(xhr.response);
			}
		} else {
			onError(new Error(`上传失败，状态码: ${xhr.status}`));
		}
	};

	// 监听错误
	xhr.onerror = () => {
		onError(new Error('网络错误，上传失败'));
	};

	// 监听超时
	xhr.ontimeout = () => {
		onError(new Error(`上传超时（${props.uploadTimeout / 1000}秒）`));
		useMessage().error(
			`上传超时（${
				props.uploadTimeout / 1000
			}秒，请重试/减少文件内容/检查网络）`
		);
	};

	// 构建 FormData
	const formData = new FormData();
	formData.append('file', file);

	// 发送请求
	xhr.open('POST', actionUrl, true);
	Object.entries(headers).forEach(([key, value]) => {
		xhr.setRequestHeader(key, value);
	});
	xhr.send(formData);

	// 返回 abort 函数
	return {
		abort: () => {
			xhr.abort();
		},
	};
};

// 进度事件：将后端上报的 percent 透传给进度组件（可选）
const handleProgress = (event: { percent?: number } | any, file?: any) => {
	isUploading.value = true;
	emit('progress', event, file);
};

// 成功/失败处理：只负责通知进度组件完成并按原逻辑处理业务返回
const handleSuccess = async (response: any, file: any) => {
	isUploading.value = false;
	// 通知进度组件完成（它会把进度置为100并自动关闭）
	if (props.useProgressDialog && progressDialogRef.value?.complete) {
		try {
			await progressDialogRef.value.complete();
		} catch (e) {
			useMessage().error('操作异常,请联系管理员');
		}
	}
	// 处理错误情况
	if (
		response &&
		(response.code === 8008 ||
			(response.code === 0 && response.data?.failCount > 0))
	) {
		// 格式化错误数据
		if (response.data && response.data.failInfos) {
			errorData.value = response.data.failInfos.map((item: any) => ({
				info: item,
			}));
			errorUrl.value = response.data.failFileUrl;
			totalCount.value = response.data.totalCount ?? 0;
			successCount.value = response.data.successCount ?? 0;
			failCount.value = response.data.failCount ?? 0;
		} else {
			errorData.value = [];
		}
		// 打开错误窗（等进度窗关闭，避免遮挡）
		setTimeout(() => {
			errorVisible.value = true;
			useMessage().error('导入失败，以下数据不合法');
		}, 120);
		// 清空文件列表
		uploadRef.value?.clearFiles?.();
		fileResult.value = null;
		fileType.value = '';
		// 通知父组件
		emit('error', response, file);
		emit('update:modelValue', null);
		emit('refreshDataList');
		return;
	} else if (response && response.code === 0) {
		useMessage().success(response.msg || '上传成功');
	} else {
		useMessage().error(response.msg || '上传失败，请检查文件格式或网络连接！');
		// 清空文件列表
		uploadRef.value?.clearFiles?.();
		fileResult.value = null;
		fileType.value = '';

		emit('error', response, file);
		emit('update:modelValue', null);
		emit('refreshDataList');
		return;
	}

	const resultData = processResponse(response);
	let result: any;
	// 根据文件类型返回不同结构
	if (fileType.value === FILE_TYPES.IMAGE) {
		// 图片返回URL
		result = resultData;
		fileResult.value = {
			name: file?.name ?? '',
			url: resultData,
			response,
			type: FILE_TYPES.IMAGE,
		};
	} else {
		// 其他文件返回对象
		result = {
			name: file?.name ?? '',
			url: resultData,
			response,
			type: fileType.value,
		};
		fileResult.value = result;
	}
	// 更新v-model并通知父组件
	emit('update:modelValue', result);
	emit('success', response, file, fileType.value);
	emit('refreshDataList');
};

/**
 * 上传失败处理
 */
const handleError = async (error: any, file?: any) => {
	isUploading.value = false;
	// 通知进度组件完成（或至少关闭）
	if (props.useProgressDialog && progressDialogRef.value?.complete) {
		try {
			await progressDialogRef.value.complete();
		} catch (e) {
			useMessage().error('操作异常,请联系管理员');
		}
	}
	const status = error?.status ?? error?.response?.status;
	if (status === 413) {
		useMessage().error('文件过大，请压缩后重试或联系管理员调整上传限制');
	} else {
		useMessage().error('接口异常,请联系管理员');
	}
	emit('error', error, file);
	// 清空上传组件的文件列表，但不自动关闭错误弹窗
	uploadRef.value?.clearFiles?.();
	fileResult.value = null;
	fileType.value = '';
	emit('update:modelValue', null);
};

/**
 * 文件移除处理
 */
const handleRemove = () => {
	fileResult.value = null;
	fileType.value = '';

	emit('update:modelValue', null);
	emit('change', null);
};

/**
 * 提交上传
 */
const submitUpload = () => uploadRef.value?.submit?.();
/**
 * 清除文件
 */
const clearFiles = () => {
	uploadRef.value?.clearFiles?.();
	fileResult.value = null;
	fileType.value = '';

	emit('update:modelValue', null);
	emit('change', null);
};
/**
 * 关闭错误弹窗
 */
const closeErrorDialog = () => {
	errorVisible.value = false;
	// 清空文件列表，确保用户可以重新选择文件
	clearFiles();
};

/**
 * 打开错误弹窗
 */
const openErrorDialog = () => {
	errorVisible.value = true;
};

// 进度窗接口：由进度组件管理增长；这里只调用组件的 startFakeProgress/stop/complete
const openProgressDialog = () => {
	// 打开对话框并启动组件内部假进度
	if (props.useProgressDialog && progressDialogRef.value?.startFakeProgress) {
		progressDialogRef.value.startFakeProgress(0);
	} else if (props.useProgressDialog) {
		// 兜底：直接打开 v-model
		progressDialogVisible.value = true;
	}
};
const closeProgressDialog = () => {
	if (progressDialogRef.value?.stopFakeProgress)
		progressDialogRef.value.stopFakeProgress();
	progressDialogVisible.value = false;
};

// 清理
onBeforeUnmount(() => {
	if (progressDialogRef.value?.stopFakeProgress)
		progressDialogRef.value.stopFakeProgress();
});

// 监听 modelValue
watch(
	() => props.modelValue,
	(newVal) => {
		if (!newVal) {
			fileResult.value = null;
			return;
		}

		// 处理字符串类型 (URL)
		if (typeof newVal === 'string') {
			const fileExt = newVal.split('.').pop()?.toLowerCase() ?? '';
			if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(fileExt))
				fileType.value = FILE_TYPES.IMAGE;
			fileResult.value = { name: newVal.split('/').pop(), url: newVal };
			return;
		}
		// 处理数组
		if (Array.isArray(newVal) && newVal.length > 0) {
			const item = newVal[0];
			if (typeof item === 'string')
				fileResult.value = { name: item.split('/').pop(), url: item };
			else {
				fileResult.value = item;
				if ((item as any).type) fileType.value = (item as any).type;
			}
			return;
		}
		// 处理对象
		if (typeof newVal === 'object') {
			fileResult.value = newVal;
			if ((newVal as any).type) fileType.value = (newVal as any).type;
		}
	},
	{ immediate: true, deep: true }
);

// 暴露方法
defineExpose({
	submitUpload,
	clearFiles,
	uploadRef,
	getCurrentFileType: () => fileType.value,
	getFileData: () => fileResult.value,
	closeErrorDialog,
	openErrorDialog,
	openProgressDialog,
	closeProgressDialog,
	getProgressPercent: () =>
		progressDialogRef.value?.getPercent
			? progressDialogRef.value.getPercent()
			: 0,
});
</script>

<style lang="scss" scoped>
.file-uploader {
	width: 100%;
}
.text-primary {
	cursor: pointer;
	margin-top: 10px;
}
.errorTotal {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin: 20px 5px;
	font-size: 16px;
	border-top: 1px solid #f0f0f0;
	border-bottom: 1px solid #f0f0f0;
	padding: 10px;
}
.fail-circle {
	width: 5px;
	height: 5px;
	border-radius: 50%;
	background-color: #000;
	margin-right: 10px;
}
.items-total {
	display: flex;
	flex-direction: row;
	align-items: center;
}
.green {
	background-color: #94d394;
}
.red {
	background-color: #eb4d65;
}
.error-reason {
	display: flex;
	flex-direction: row;
	align-items: center;
}
:deep(.cell) {
	text-align: left;
}
</style>
