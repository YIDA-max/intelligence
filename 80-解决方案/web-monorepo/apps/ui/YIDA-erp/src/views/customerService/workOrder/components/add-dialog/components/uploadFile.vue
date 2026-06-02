<!--文件上传组件-->
<template>
	<div class="w-full upload-file">
		<!-- 当禁用时只显示文件列表，不使用el-upload组件 -->
		<div v-if="props.disabled">
			<div
				v-if="fileList.length === 0"
				class="flex items-center justify-center px-4 text-gray-400 rounded-md bg-gray-50 p"
			>
				<el-icon class="mr-2 text-lg"><Document /></el-icon>
				<span class="text-sm">{{ $t('excel.noFiles') }}</span>
			</div>
			<div v-else>
				<div
					v-for="(file, index) in fileList"
					:key="index"
					class="flex items-center px-4 py-3 mb-1 transition-colors duration-200 rounded cursor-pointer group hover:bg-blue-50"
					@click="handlePreview(file)"
				>
					<el-icon class="mr-3 text-blue-500"><Document /></el-icon>
					<span
						class="flex-1 text-gray-700 truncate transition-colors duration-200 group-hover:text-blue-600"
					>
						{{ getFileName(file) }}
					</span>
					<el-icon
						class="text-gray-400 transition-colors duration-200 group-hover:text-blue-500"
						><Download
					/></el-icon>
				</div>
			</div>
		</div>

		<div v-else-if="props.type === 'drag' && !props.disabled" class="w-full">
			<el-upload
				v-if="!props.disabled"
				ref="fileUpload"
				:action="baseUrl + other.adaptationUrl(props.uploadFileUrl)"
				:before-upload="handleBeforeUpload"
				:file-list="fileList"
				:headers="headers"
				:limit="limit"
				:on-error="handleUploadError"
				:on-remove="handleRemove"
				:on-preview="handlePreview"
				:on-exceed="handleExceed"
				:data="formData"
				:auto-upload="autoUpload"
				:on-success="handleUploadSuccess"
				:on-change="handleFileChange"
				class="upload-file-uploader upload-file-image-dragger"
				drag
				multiple
				:show-file-list="false"
			>
				<el-icon class="text-[28px] text-[#409eff]"><UploadFilled /></el-icon>
				<div class="el-upload__text">拖拽文件到此处，或<em>点击上传</em></div>
				<template #tip>
					<div class="el-upload__tip" v-if="props.isShowTip">
						支持
						<b style="color: #f56c6c">{{ props.fileType.join('/') }}</b>
						格式，单个文件不超过
						<b style="color: #f56c6c">{{ props.fileSize }}MB</b>
					</div>
				</template>
			</el-upload>

			<div
				v-if="fileDisplayList.length === 0"
				class="mt-2 text-sm text-gray-400"
			>
				{{ $t('excel.noFiles') }}
			</div>
			<div v-else class="mt-3 space-y-2">
				<div
					v-for="(file, index) in fileDisplayList"
					:key="file.uid ?? index"
					class="flex items-center gap-2 p-2 rounded border border-[#ebe5df] bg-[#faf8f6]"
				>
					<el-image
						v-if="isImage(file)"
						:src="getPreviewSource(file)"
						fit="cover"
						class="w-10 h-10 rounded border border-[#ebe5df] flex-shrink-0"
					>
						<template #error>
							<div
								class="w-full h-full flex items-center justify-center text-xs text-[#999] bg-[#f5f5f5]"
							>
								图片
							</div>
						</template>
					</el-image>
					<video
						v-else-if="isVideo(file)"
						:src="getPreviewSource(file) + '#t=0.1'"
						class="w-10 h-10 rounded border border-[#ebe5df] object-cover flex-shrink-0 bg-black"
						preload="metadata"
						muted
						playsinline
					></video>
					<div
						v-else
						class="w-10 h-10 rounded border border-[#ebe5df] flex-shrink-0 flex items-center justify-center bg-[#f5f5f5]"
					>
						<el-icon class="text-xl text-gray-400">
							<Document />
						</el-icon>
					</div>
					<div class="flex-1 min-w-0">
						<div
							class="text-sm text-[#333] truncate cursor-pointer hover:text-[#409eff]"
							@click="handlePreview(file)"
						>
							{{ getFileName(file) }}
						</div>
					</div>
					<div>
						<el-button
							v-if="props.enablePreview"
							text
							type="primary"
							class="p-1"
							@click="handlePreview(file)"
						>
							<el-icon><ZoomIn /></el-icon>
						</el-button>
						<el-button
							class="p-1"
							text
							type="primary"
							@click="handleDownload(file)"
						>
							<el-icon><Download /></el-icon>
						</el-button>
						<el-button
							v-if="!props.disabled"
							text
							type="danger"
							@click="removeImageItem(file)"
							class="p-1"
						>
							<el-icon><Close /></el-icon>
						</el-button>
					</div>
				</div>
			</div>
		</div>
		<!-- 默认上传组件 -->
		<el-upload
			ref="fileUpload"
			v-else-if="props.type === 'default' && !props.disabled"
			:action="baseUrl + other.adaptationUrl(props.uploadFileUrl)"
			:before-upload="handleBeforeUpload"
			:file-list="fileList"
			:headers="headers"
			:limit="limit"
			:on-error="handleUploadError"
			:on-remove="handleRemove"
			:on-preview="handlePreview"
			:on-exceed="handleExceed"
			:data="formData"
			:auto-upload="autoUpload"
			:on-success="handleUploadSuccess"
			:on-change="handleFileChange"
			class="upload-file-uploader"
			drag
			multiple
		>
			<i class="el-icon-upload"></i>
			<div class="el-upload__text">
				{{ $t('excel.operationNotice') }}
				<em>{{ $t('excel.clickUpload') }}</em>
			</div>
			<template #tip>
				<div class="el-upload__tip" v-if="props.isShowTip">
					{{ $t('excel.pleaseUpload') }}
					<template v-if="props.fileSize">
						{{ $t('excel.size') }}
						<b style="color: #f56c6c">{{ props.fileSize }}MB</b></template
					>
					<template v-if="props.fileType">
						{{ $t('excel.format') }}
						<b style="color: #f56c6c">{{ props.fileType.join('/') }}</b>
					</template>
					{{ $t('excel.file') }}
				</div>
			</template>
		</el-upload>
		<!-- 简单上传组件 -->
		<el-upload
			ref="fileUpload"
			v-else-if="props.type === 'simple' && !props.disabled"
			:action="baseUrl + other.adaptationUrl(props.uploadFileUrl)"
			:before-upload="handleBeforeUpload"
			:file-list="fileList"
			:headers="headers"
			:limit="limit"
			:auto-upload="autoUpload"
			:on-error="handleUploadError"
			:on-remove="handleRemove"
			:on-preview="handlePreview"
			:on-exceed="handleExceed"
			:data="formData"
			:on-success="handleUploadSuccess"
			:on-change="handleFileChange"
			class="upload-file-uploader"
			multiple
		>
			<el-button type="primary" link>{{ $t('excel.clickUpload') }}</el-button>
			<template #tip>
				<div class="el-upload__tip" v-if="props.isShowTip">
					{{ $t('excel.pleaseUpload') }}
					<template v-if="props.fileSize">
						{{ $t('excel.size') }}
						<b style="color: #f56c6c">{{ props.fileSize }}MB</b></template
					>
					<template v-if="props.fileType">
						{{ $t('excel.format') }}
						<b style="color: #f56c6c">{{ props.fileType.join('/') }}</b>
					</template>
					{{ $t('excel.file') }}
				</div>
			</template>
		</el-upload>

		<el-dialog
			v-model="previewVisible"
			:title="previewTitle"
			append-to-body
			width="60%"
		>
			<div class="flex justify-center items-center overflow-hidden">
				<el-image
					v-if="previewType === 'image'"
					:src="previewFileUrl"
					fit="contain"
					class=""
				/>
				<video
					v-else-if="previewType === 'video'"
					:src="previewFileUrl"
					controls
					class="max-w-full"
				></video>
				<div v-else class="text-center py-20 text-gray-500">
					该文件类型暂不支持直接预览，请<el-button
						type="primary"
						link
						@click="downloadCurrentFile"
						>下载</el-button
					>后查看
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="upload-file">
import { useMessage } from '/@/hooks/message';
import { Session } from '/@/utils/storage';
import other from '/@/utils/other';
import { useI18n } from 'vue-i18n';
import { ref, computed, watch } from 'vue';
import { getFullFileUrl } from '/@/utils/fileUrl';
import {
	Document,
	Download,
	ZoomIn,
	Close,
	UploadFilled,
} from '@element-plus/icons-vue';
// 定义基础URL
const baseUrl = import.meta.env.VITE_API_URL || '';

// 获取文件名
const getFileName = (file: any): string => {
	if (file.name) return file.name;
	if (file.url && file.url.includes('fileName=')) {
		return file.url.split('fileName=')[1];
	}
	return file.url ? file.url.split('/').pop() : 'File';
};

interface FileItem {
	name?: string;
	url?: string;
	uid?: number;
	fileUrl?: string;
	fileSize?: number;
	fileName?: string;
}

interface UploadFileItem {
	name: string;
	url: string;
	fileUrl: string;
	fileSize: number;
	fileName: string;
	fileType: string;
}

const props = defineProps({
	modelValue: [String, Array],
	// 数量限制
	limit: {
		type: Number,
		default: 5,
	},
	// 大小限制(MB)
	fileSize: {
		type: Number,
		default: 5,
	},
	fileType: {
		type: Array,
		default: () => [
			'png',
			'jpg',
			'jpeg',
			'doc',
			'xls',
			'ppt',
			'txt',
			'pdf',
			'docx',
			'xlsx',
			'pptx',
		],
	},
	// 是否显示提示
	isShowTip: {
		type: Boolean,
		default: true,
	},
	uploadFileUrl: {
		type: String,
		default: '/admin/sys-file/upload',
	},
	type: {
		type: String,
		default: 'default',
		validator: (value: string) => {
			return ['default', 'simple', 'drag'].includes(value);
		},
	},
	data: {
		type: Object,
		default: () => ({}),
	},
	dir: {
		type: String,
		default: '',
	},
	autoUpload: {
		type: Boolean,
		default: true,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	enablePreview: {
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits([
	'update:modelValue',
	'change',
	'getFile',
	'success',
	'getFileCurrent',
]);

const number = ref(0);
const fileList = ref<FileItem[]>([]);
const uploadList = ref<UploadFileItem[]>([]);
const fileUpload = ref();
const previewVisible = ref(false);
const previewTitle = ref('文件预览');
const previewType = ref('image');
const previewFileUrl = ref('');
const currentPreviewFile = ref<any>(null);

const downloadCurrentFile = () => {
	if (currentPreviewFile.value) {
		other.downBlobFile(
			getPreviewSource(currentPreviewFile.value),
			{},
			currentPreviewFile.value.original || getFileName(currentPreviewFile.value)
		);
	}
};

const handleDownload = (file: any) => {
	const sourceUrl = getPreviewSource(file);
	if (sourceUrl) {
		other.downBlobFile(sourceUrl, {}, file.original || getFileName(file));
	}
};
// 有着完整数据对象的文件备份
const allDataFileList = ref<FileItem[]>([]);
const { t } = useI18n();

const getFileExt = (file: any) => {
	const name = getFileName(file);
	const parts = name.split('.');
	return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};

const isImage = (file: any) => {
	const ext = getFileExt(file);
	return ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'].includes(ext);
};

const isVideo = (file: any) => {
	const ext = getFileExt(file);
	return ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'].includes(ext);
};

const fileDisplayList = computed(() => {
	return fileList.value.map((file) => ({
		...file,
		url: getPreviewSource(file),
		fileUrl: getPreviewSource(file),
	}));
});

// 请求头处理
const headers = computed(() => {
	return {
		Authorization: 'Bearer ' + Session.get('token'),
		'TENANT-ID': Session.getTenant(),
	};
});

// 请求参数处理
const formData = computed(() => {
	return Object.assign(props.data, { dir: props.dir });
});

// 上传前校检格式和大小
const handleBeforeUpload = (file: File) => {
	// 校检文件类型
	if (props.fileType.length) {
		const fileName = file.name.split('.');
		const fileExt = fileName[fileName.length - 1];
		const isTypeOk = props.fileType.indexOf(fileExt) >= 0;
		if (!isTypeOk) {
			useMessage().error(
				`${t('excel.typeErrorText')} ${props.fileType.join('/')}!`
			);
			return false;
		}
	}
	// 校检文件大小
	if (props.fileSize) {
		const isLt = file.size / 1024 / 1024 < props.fileSize;
		if (!isLt) {
			useMessage().error(`${t('excel.sizeErrorText')} ${props.fileSize} MB!`);
			return false;
		}
	}

	// 只有在自动上传时才增加计数
	if (props.autoUpload) {
		number.value++;
	}
	return true;
};

// 文件选择变化事件处理
const handleFileChange = (file: any, uploadFileList: any[]) => {
	// 当autoUpload为false时，文件选择后立即更新v-model
	if (!props.autoUpload) {
		// 过滤出有效的文件（已上传成功的文件）
		const validFiles = uploadFileList.filter(
			(f) => f.status === 'success' || f.raw
		);

		// 更新fileList，只保留必要的属性
		fileList.value = validFiles.map((f) => ({
			name: f.name,
			url: f.url || '',
			uid: f.uid,
			fileUrl: f.url || '',
			fileSize: f.size,
			fileName: f.name,
			raw: f.raw, // 保存原始文件对象，用于后续手动上传
			status: f.status,
		}));

		// 触发文件选择事件，传递文件对象
		emit('getFile', fileList.value);

		// 更新v-model值
		emit('change', listMapFileName(fileList.value));
		emit('update:modelValue', listMapFileName(fileList.value));
	}
};

// 上传成功回调
function handleUploadSuccess(res: any, file: any) {
	if (res.code === 0) {
		uploadList.value.push({
			name: file.name,
			url: res.data.url,
			fileUrl: res.data.url,
			fileSize: file.size,
			fileName: res.data.fileName,
			fileType: file.raw.type,
		});
		// 触发上传成功事件，传递响应数据和文件对象
		emit('success', res, file);
		uploadedSuccessfully();
		// 保存完整数据对象
		allDataFileList.value.push({
			...res.data,
			name: res.data.originalFilename,
			code: res.data.fileUrl,
		});
	} else {
		number.value--;
		fileUpload.value.handleRemove(file);
		uploadedSuccessfully();
	}
}

// 上传结束处理
const uploadedSuccessfully = () => {
	if (number.value > 0 && uploadList.value.length === number.value) {
		fileList.value = fileList.value
			.filter((f) => f.fileUrl !== undefined)
			.concat(uploadList.value);
		uploadList.value = [];
		number.value = 0;
		emit('change', listMapFileName(fileList.value));
		emit('update:modelValue', listMapFileName(fileList.value));
		emit('getFileCurrent', fileList.value);
	}
};

const handleRemove = (file: { name: string }) => {
	fileList.value = fileList.value.filter((f) => f.name !== file.name);
	emit('change', listMapFileName(fileList.value));
	emit('update:modelValue', listMapFileName(fileList.value));
};

const getPreviewSource = (file: any) => {
	const source = file.fileUrl || file.url || file.fileName || file.code || '';
	if (!source) return '';
	if (/^(https?:\/\/|blob:|data:)/i.test(source)) return source;
	return getFullFileUrl(source);
};

const handlePreview = (file: any) => {
	const previewUrl = getPreviewSource(file);
	if (!previewUrl) return;

	if (!props.enablePreview) {
		other.downBlobFile(previewUrl, {}, file.original || getFileName(file));
		return;
	}

	previewFileUrl.value = previewUrl;

	currentPreviewFile.value = file;
	if (isImage(file)) {
		previewType.value = 'image';
		previewTitle.value = '图片预览';
	} else if (isVideo(file)) {
		previewType.value = 'video';
		previewTitle.value = '视频预览';
	} else {
		previewType.value = 'other';
		previewTitle.value = '文件预览';
	}
	previewVisible.value = true;
};

const removeImageItem = (file: any) => {
	handleRemove(file);
	if (fileUpload.value?.handleRemove) {
		fileUpload.value.handleRemove(file);
	}
};

// 添加 handleExceed 函数
const handleExceed = () => {
	useMessage().warning(
		`${t('excel.uploadLimit')} ${props.limit} ${t('excel.files')}`
	);
};

/**
 * 将对象数组map出fileName
 * @param list 待转换的对象数组。
 * @returns {Array<string>} 返回转换后的字符串数组。
 */
const listMapFileName = (list: FileItem[]): Array<string | any> => {
	// 是不是数组

	if (!Array.isArray(list)) {
		return [];
	}
	// 如果是数组就开始循环构建，有两种可能性，一种是对象一种是字符串
	const arr = list.map((item) => {
		// 如果item是对象且有fileName属性，则返回fileName
		if (typeof item === 'object' && item !== null && 'fileName' in item) {
			return { ...item };
		}
		// 如果item是字符串，则直接返回
		if (typeof item === 'string') {
			return item;
		}
		// 其他情况返回空字符串
		return '';
	});

	return arr;
};

const handleUploadError = () => {
	useMessage().error('上传文件失败');
};

/**
 * 监听 props 中的 modelValue 值变化，更新 fileList。
 */
watch(
	() => props.modelValue,
	(val) => {
		if (val) {
			let temp = 1;
			let uidSeed = Date.now();
			// 首先将值转为数组
			const list = Array.isArray(val)
				? val
				: (props.modelValue as string).split(',');
			// 然后将数组转为对象数组
			fileList.value = list.map((item: any) => {
				if (
					typeof item === 'object' &&
					'originalFileName' in item &&
					'fileUrl' in item
				) {
					// 只有当不在 allDataFileList 中时才添加
					if (
						!allDataFileList.value.find(
							(f: any) => f.code === item.encryptedFileName
						)
					) {
						allDataFileList.value.push({
							...item,
							name: item.originalFileName,
							code: item.encryptedFileName,
						});
					}
					return {
						uid: uidSeed++,
						name: item.originalFileName,
						fileName: item.encryptedFileName,
						url: item.encryptedFileName,
						fileUrl: item.encryptedFileName,
						rawItem: item,
					} as FileItem;
				} else if (typeof item === 'string') {
					item = item.includes('fileName=')
						? {
								name: item.split('fileName=')[1],
								url: item,
								fileUrl: item,
								fileName: item.split('fileName=')[1],
						  }
						: {
								name:
									allDataFileList.value?.find((f: any) => f.code === item)
										?.name ?? item,
								url: item,
								fileUrl: item,
								fileName: item,
						  };
				} else if (typeof item === 'object') {
					item = { ...item };
					const code = item?.url ?? item?.name;
					// 只有当不在 allDataFileList 中时才添加
					if (!allDataFileList.value.find((f: any) => f.code === code)) {
						allDataFileList.value.push({
							...item,
							code: code,
							name: item?.name ?? item?.url ?? item?.name,
						});
					}
				}
				item.uid = item.uid || uidSeed++ || new Date().getTime() + temp++;
				item.fileUrl = item.url;
				return item as FileItem;
			});
		} else {
			fileList.value = [];
		}
	},
	{ deep: true, immediate: true }
);

const submit = () => {
	// 手动上传所有文件
	if (fileUpload.value) {
		fileUpload.value.submit();
	}
};

// 获取当前选中的文件列表（用于手动上传）
const getSelectedFiles = () => {
	return fileList.value
		.filter((f: any) => f.raw && f.status !== 'success')
		.map((f: any) => f.raw);
};

// 获取文件对象列表（包含原始文件对象）
const getFileList = () => {
	return fileList.value.map((f: any) => {
		if (typeof f === 'object') {
			return (
				allDataFileList.value?.find((item: any) => item.code === f.fileUrl) ?? {
					name: f.fileName,
					code: f.fileUrl,
				}
			);
		} else if (typeof f === 'string') {
			return (
				allDataFileList.value?.find((item: any) => item.code === f) ?? {
					name: f,
					code: f,
				}
			);
		} else {
			return {
				name: '未知文件',
				code: '未知文件',
			};
		}
	});
};

defineExpose({
	submit,
	getSelectedFiles,
	getFileList,
	fileList,
});
</script>
