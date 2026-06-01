<!--
 * 文件上传组件
 * 
 * 功能说明：
 * 1. 双层状态模型：fullFileList（内部数据源） + displayFileList（展示列表）
 * 2. 虚拟滚动：当文件数量超过 20 个时自动启用
 * 3. 分批上传：通过 batchUploadConcurrency prop 配置并发数
 -->
<template>
	<div
		ref="uploadRootRef"
		v-loading="translatingMetaLoading"
		element-loading-text="文件信息加载中..."
		class="w-full upload-file"
	>
		<div v-if="uploadStatus === 'success'" class="tips-success">上传成功</div>
		<div v-if="uploadStatus === 'fail'" class="tips-fail">上传失败</div>
		<!-- 当禁用时只显示文件列表，不使用el-upload组件 -->
		<div v-if="props.disabled">
			<div
				v-if="displayFileList.length === 0"
				class="flex items-center justify-center px-4 text-gray-400 rounded-md bg-gray-50 p"
			>
				<el-icon class="mr-2 text-lg"><Document /></el-icon>
				<span class="text-sm">{{ $t('excel.noFiles') }}</span>
			</div>
			<div v-else>
				<div
					v-if="useVirtualScroll && getRowVirtualizer()"
					ref="fileListContainerRef"
					class="file-list-container"
				>
					<div
						:style="{
							height: `${getRowVirtualizer()?.getTotalSize()}px`,
							position: 'relative',
						}"
					>
						<div
							v-for="virtualRow in getRowVirtualizer()?.getVirtualItems()"
							:key="String(virtualRow.key)"
							class="virtual-file-item"
							:style="{
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: `${virtualRow.size}px`,
								transform: `translateY(${virtualRow.start}px)`,
							}"
							@click="handlePreview(displayFileList[virtualRow.index])"
						>
							<el-icon class="mr-3 text-blue-500"><Document /></el-icon>
							<span
								class="flex-1 text-gray-700 truncate transition-colors duration-200 group-hover:text-blue-600"
							>
								{{ getFileName(displayFileList[virtualRow.index]) }}
							</span>
							<el-icon
								class="text-gray-400 transition-colors duration-200 group-hover:text-blue-500"
								><Download
							/></el-icon>
						</div>
					</div>
				</div>
				<div v-else class="file-list-container">
					<div
						v-for="(file, index) in displayFileList"
						:key="file.uid ?? index"
						class="file-list-item"
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
		</div>
		<!-- 默认上传组件 -->
		<el-upload
			ref="fileUpload"
			v-if="props.type === 'default' && !props.disabled"
			:action="baseUrl + other.adaptationUrl(props.uploadFileUrl)"
			:before-upload="handleBeforeUpload"
			:file-list="displayFileList"
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
			:show-file-list="showFileList"
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
			v-if="props.type === 'simple' && !props.disabled"
			:action="baseUrl + other.adaptationUrl(props.uploadFileUrl)"
			:before-upload="handleBeforeUpload"
			:file-list="displayFileList"
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
			:show-file-list="showFileList"
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
	</div>
</template>

<script setup lang="ts" name="upload-file">
import { ElLoading } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import { Session } from '/@/utils/storage';
import other from '/@/utils/other';
import { useI18n } from 'vue-i18n';
import { ref, computed, watch, onBeforeUnmount, nextTick } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';
import { useVirtualizer, type Virtualizer } from '@tanstack/vue-virtual';
import { getSysFileList } from '/@/api/fileOss';
import { Document, Download } from '@element-plus/icons-vue';
import { usePreviewDialog } from '/@/components/FilePreviewDialog/usePreviewDialog/index';

const { open: openPreviewDialog } = usePreviewDialog();

const baseUrl = import.meta.env.VITE_API_URL || '';

interface UploadDisplayItem {
	uid: string | number;
	name: string;
	url: string;
	fileUrl: string;
	fileName: string;
	fileSize?: number;
	fileType?: string;
	status?: string;
	raw?: File;
	original?: string;
	[key: string]: unknown;
}

interface UploadFullItem {
	uid: string | number;
	name: string;
	url: string;
	fileUrl: string;
	fileName: string;
	code: string;
	fileSize?: number;
	fileType?: string;
	status?: string;
	raw?: File;
	originalFileName?: string;
	[key: string]: unknown;
}

interface IProps {
	modelValue?: string | unknown[] | Record<string, unknown>;
	limit?: number;
	fileSize?: number;
	fileType?: string[];
	isShowTip?: boolean;
	uploadFileUrl?: string;
	type?: string;
	data?: Record<string, unknown>;
	dir?: string;
	autoUpload?: boolean;
	disabled?: boolean;
	validationType?: string;
	archiveFileSize?: number;
	batchUploadConcurrency?: number;
	showFileList?: boolean;
	showProgressDialog?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
	modelValue: () => [],
	limit: 5,
	fileSize: 5,
	fileType: () => [
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
	isShowTip: true,
	uploadFileUrl: '/admin/sys-file/upload',
	type: 'default',
	data: () => ({}),
	dir: '',
	autoUpload: true,
	disabled: false,
	validationType: 'default',
	archiveFileSize: 100,
	batchUploadConcurrency: 3,
	showFileList: true,
	showProgressDialog: false,
});

const emit = defineEmits([
	'update:modelValue',
	'change',
	'getFile',
	'success',
	'getFileCurrent',
	'error',
	'remove',
	'preview',
	'exceed',
]);

const fileUpload = ref();
const uploadRootRef = ref<HTMLElement | null>(null);
const displayFileList = ref<UploadDisplayItem[]>([]);
const fullFileList = ref<UploadFullItem[]>([]);
const syncingFromInner = ref(false);
const translatingMetaLoading = ref(false);
const isComponentVisible = ref(false);
const isUploading = ref(false);
const uploadingCount = ref(0);
const uploadStatus = ref<'uploading' | 'success' | 'fail'>('uploading');
let globalLoadingInstance: { close: () => void } | null = null;

const { t } = useI18n();
let uidSeed = 0;
let translateRequestSeed = 0;
let translateTaskSeed = 0;

const pendingTranslateTask = ref<{
	value: unknown;
	baseList: UploadFullItem[];
	taskId: number;
} | null>(null);

const fileListContainerRef = ref<HTMLElement | null>(null);
const useVirtualScroll = computed(() => displayFileList.value.length > 20);

const rowVirtualizerInstance = ref<Virtualizer<HTMLElement, Element> | null>(
	null
);

const getRowVirtualizer = () => {
	if (!fileListContainerRef.value) return null;
	if (!rowVirtualizerInstance.value) {
		const virtualizer = useVirtualizer({
			get count() {
				return displayFileList.value.length;
			},
			getScrollElement: () => fileListContainerRef.value,
			estimateSize: () => 50,
			overscan: 5,
		});
		rowVirtualizerInstance.value = virtualizer.value;
	}
	return rowVirtualizerInstance.value;
};

const createUid = () => `${Date.now()}_${uidSeed++}`;

const getFileName = (file: Partial<UploadDisplayItem>): string => {
	if (file.name) return file.name;
	if (file.url && file.url.includes('fileName=')) {
		return file.url.split('fileName=')[1];
	}
	return file.url ? file.url.split('/').pop() || 'File' : 'File';
};

const getFileQueryName = (value: string) => {
	if (!value || !value.includes('fileName=')) return '';
	const [, search = ''] = value.split('fileName=');
	return decodeURIComponent(search.split('&')[0]);
};

const getPreviewUrl = (file: Partial<UploadDisplayItem>) => {
	return file.fileUrl || file.url || file.fileName || '';
};

const headers = computed(() => {
	return {
		Authorization: 'Bearer ' + Session.get('token'),
		'TENANT-ID': Session.getTenant(),
	};
});

const formData = computed(() => {
	return Object.assign(props.data, { dir: props.dir });
});

const toModelValue = (list: UploadFullItem[]): string[] => {
	return list
		.map((item) => item.code || item.fileName)
		.filter((name): name is string => !!name);
};

const syncDisplayFileList = () => {
	displayFileList.value = fullFileList.value.map((item) => ({
		...item,
		uid: item.uid,
		name: item.name,
		url: item.url || item.fileUrl || item.fileName,
		fileUrl: item.fileUrl || item.url || item.fileName,
		fileName: item.fileName || item.code,
		original: item.name,
	}));
};

const emitModelValueChange = () => {
	const modelValue = toModelValue(fullFileList.value);
	syncingFromInner.value = true;
	emit('change', modelValue);
	emit('update:modelValue', modelValue);
};

const normalizeFileFromString = (value: string): UploadFullItem => {
	const code = getFileQueryName(value) || value;
	const fileUrl = value;
	const name = getFileQueryName(value) || value.split('/').pop() || code;
	return {
		uid: createUid(),
		name,
		url: fileUrl,
		fileUrl,
		fileName: code,
		code,
		status: 'success',
		originalFileName: name,
	};
};

const normalizeFileFromObject = (
	item: Record<string, unknown>
): UploadFullItem => {
	const code =
		(item.encryptedFileName as string) ??
		(item.fileName as string) ??
		(item.code as string) ??
		getFileQueryName(String(item.fileUrl || item.url || '')) ??
		(item.fileUrl as string) ??
		(item.url as string) ??
		'';
	const fallbackUrl = code
		? `/admin/sys-file/oss/file?fileName=${encodeURIComponent(code)}`
		: '';
	const name =
		(item.originalFileName as string) ??
		(item.originalFilename as string) ??
		(item.original as string) ??
		(item.name as string) ??
		(getFileQueryName(String(item.fileUrl || item.url || '')) ||
			code ||
			'File');
	const fileUrl = (item.fileUrl ?? item.url ?? fallbackUrl) as string;
	return {
		...item,
		uid: (item.uid ?? createUid()) as string | number,
		name: name as string,
		url: fileUrl,
		fileUrl,
		fileName: code as string,
		code: code as string,
		fileSize: (item.fileSize ?? item.size) as number | undefined,
		fileType: item.fileType as string | undefined,
		status: (item.status ?? (code || fileUrl ? 'success' : 'ready')) as string,
		originalFileName: (item.originalFileName ??
			item.originalFilename ??
			item.original ??
			name) as string | undefined,
	};
};

const normalizeModelValueToFiles = (
	value: unknown,
	currentList: UploadFullItem[] = []
): UploadFullItem[] => {
	if (value === null || value === undefined || value === '') {
		return [];
	}

	let sourceList: unknown[] = [];
	if (typeof value === 'string') {
		sourceList = value.includes(',')
			? value.split(',').filter(Boolean)
			: [value];
	} else if (Array.isArray(value)) {
		sourceList = value;
	} else if (typeof value === 'object') {
		sourceList = [value];
	}

	return sourceList
		.map((item) => {
			if (typeof item === 'string') {
				const code = getFileQueryName(item) || item;
				return (
					currentList.find(
						(file) => file.code === code || file.fileName === code
					) || normalizeFileFromString(item)
				);
			}
			if (item && typeof item === 'object') {
				const normalized = normalizeFileFromObject(
					item as Record<string, unknown>
				);
				const matched = currentList.find(
					(file) =>
						file.code === normalized.code ||
						file.fileName === normalized.fileName ||
						file.uid === normalized.uid
				);
				return matched
					? { ...matched, ...normalized, name: normalized.name || matched.name }
					: normalized;
			}
			return null;
		})
		.filter((item): item is UploadFullItem => !!item);
};

const isProbablyEncryptedName = (value: string) => {
	if (!value) return false;
	if (value.includes('/') || value.includes('?')) return false;
	return true;
};

const extractSysFileList = (payload: unknown): unknown[] => {
	if (Array.isArray(payload)) return payload;
	if (Array.isArray((payload as Record<string, unknown>)?.records))
		return (payload as Record<string, unknown>).records as unknown[];
	if (Array.isArray((payload as Record<string, unknown>)?.list))
		return (payload as Record<string, unknown>).list as unknown[];
	if (Array.isArray((payload as Record<string, unknown>)?.data))
		return (payload as Record<string, unknown>).data as unknown[];
	return [];
};

const shouldTranslateModelValue = (value: unknown) => {
	return (
		Array.isArray(value) &&
		value.length > 0 &&
		value.every((item) => typeof item === 'string')
	);
};

const translateEncryptedModelValue = async (
	value: unknown,
	baseList: UploadFullItem[]
) => {
	if (
		!Array.isArray(value) ||
		value.length === 0 ||
		!value.every((item) => typeof item === 'string')
	) {
		return baseList;
	}

	const encryptedNames = Array.from(
		new Set(
			(value as string[])
				.map((item) => getFileQueryName(item) || item)
				.filter((item) => isProbablyEncryptedName(item))
		)
	);
	if (encryptedNames.length === 0) return baseList;

	const requestId = ++translateRequestSeed;
	try {
		const res = await getSysFileList(encryptedNames);
		if (requestId !== translateRequestSeed) return baseList;
		if (res?.code !== 0) return baseList;

		const sourceList = extractSysFileList(res?.data);
		if (!sourceList.length) return baseList;

		const translatedMap = new Map<string, UploadFullItem>();
		sourceList.forEach((item: unknown) => {
			const normalized = normalizeFileFromObject(
				item as Record<string, unknown>
			);
			if (normalized.code) translatedMap.set(normalized.code, normalized);
			if (normalized.fileName)
				translatedMap.set(normalized.fileName, normalized);
		});

		if (!translatedMap.size) return baseList;

		return baseList.map((file) => {
			const translated =
				translatedMap.get(file.code) || translatedMap.get(file.fileName);
			if (!translated) return file;
			return {
				...file,
				...translated,
				uid: file.uid,
				code: file.code || translated.code || translated.fileName,
				fileName: file.fileName || translated.fileName || translated.code,
				name: translated.name || file.name,
				url: translated.url || file.url,
				fileUrl: translated.fileUrl || file.fileUrl,
				status: 'success',
			};
		});
	} catch {
		return baseList;
	}
};

const runTranslateTask = async (task: {
	value: unknown;
	baseList: UploadFullItem[];
	taskId: number;
}) => {
	translatingMetaLoading.value = true;
	try {
		const translatedList = await translateEncryptedModelValue(
			task.value,
			task.baseList
		);
		if (task.taskId !== translateTaskSeed) return;
		fullFileList.value = translatedList;
		syncDisplayFileList();
	} finally {
		if (task.taskId === translateTaskSeed) {
			translatingMetaLoading.value = false;
		}
	}
};

const flushPendingTranslateTask = async () => {
	if (!pendingTranslateTask.value || !isComponentVisible.value) return;
	const task = pendingTranslateTask.value;
	pendingTranslateTask.value = null;
	await runTranslateTask(task);
};

const normalizeUploadChangeFile = (
	file: Record<string, unknown>,
	currentList: UploadFullItem[]
): UploadFullItem => {
	const matched = currentList.find(
		(item) =>
			item.uid === file.uid ||
			(item.raw && file.raw && item.raw === file.raw) ||
			(item.fileName && item.fileName === file.fileName)
	);
	const response = file.response as Record<string, unknown> | undefined;
	if (response?.code === 0) {
		return normalizeFileFromUploadSuccess(
			(response.data ?? {}) as Record<string, unknown>,
			file,
			matched
		);
	}
	return {
		...(matched || {}),
		uid: (file.uid ?? matched?.uid ?? createUid()) as string | number,
		name: (matched?.name ?? file.name ?? 'File') as string,
		url: (matched?.url ?? file.url ?? '') as string,
		fileUrl: (matched?.fileUrl ?? file.url ?? '') as string,
		fileName: (matched?.fileName ?? '') as string,
		code: (matched?.code ?? '') as string,
		fileSize: (file.size ?? matched?.fileSize) as number | undefined,
		fileType: ((file.raw as File | undefined)?.type ?? matched?.fileType) as
			| string
			| undefined,
		raw: (file.raw ?? matched?.raw) as File | undefined,
		status: file.status as string,
	};
};

const normalizeFileFromUploadSuccess = (
	data: Record<string, unknown>,
	file: Record<string, unknown>,
	existed?: UploadFullItem
): UploadFullItem => {
	const code = (data.fileName ??
		existed?.code ??
		existed?.fileName ??
		'') as string;
	const name = (data.originalFilename ??
		existed?.name ??
		(file.name || code || 'File')) as string;
	const fileUrl = (data.url ??
		existed?.fileUrl ??
		existed?.url ??
		code) as string;
	return {
		...(existed || {}),
		...data,
		uid: (file.uid ?? existed?.uid ?? createUid()) as string | number,
		name,
		url: fileUrl,
		fileUrl,
		fileName: code,
		code,
		fileSize: (file.size ?? data.fileSize ?? existed?.fileSize) as number,
		fileType: ((file.raw as File)?.type ?? existed?.fileType) as string,
		raw: (file.raw ?? existed?.raw) as File,
		status: 'success',
		originalFileName: (data.originalFilename ??
			existed?.originalFileName ??
			name) as string | undefined,
	};
};

const rebuildFromUploadList = (uploadFileList: unknown[]) => {
	fullFileList.value = (uploadFileList as Record<string, unknown>[]).map(
		(item) => normalizeUploadChangeFile(item, fullFileList.value)
	);
	syncDisplayFileList();
};

let uploadChangeFlushScheduled = false;
let pendingUploadChangeList: unknown[] | undefined;

const flushCoalescedUploadChange = () => {
	uploadChangeFlushScheduled = false;
	const list = pendingUploadChangeList;
	pendingUploadChangeList = undefined;
	if (list === undefined) return;
	rebuildFromUploadList(list);
	emit('getFile', displayFileList.value);
	if (!props.autoUpload) return;
	emitModelValueChange();
};

onBeforeUnmount(() => {
	if (uploadChangeFlushScheduled) {
		flushCoalescedUploadChange();
	}
});

const removeByUploadFile = (file: Partial<UploadDisplayItem>) => {
	fullFileList.value = fullFileList.value.filter(
		(item) =>
			item.uid !== file.uid &&
			item.fileName !== file.fileName &&
			item.name !== file.name
	);
	syncDisplayFileList();
};

const archiveExtensions = new Set([
	'zip',
	'rar',
	'7z',
	'tar',
	'gz',
	'bz2',
	'xz',
]);

const isArchiveFile = (file: File): boolean => {
	const fileName = file.name.split('.');
	const fileExt = fileName[fileName.length - 1]?.toLowerCase();
	return archiveExtensions.has(fileExt);
};

const handleBeforeUpload = (file: File) => {
	if (props.fileType && props.fileType.length) {
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

	if (props.validationType === 'replaceByZip') {
		const currentIsArchive = isArchiveFile(file);
		if (
			currentIsArchive &&
			props.archiveFileSize &&
			props.archiveFileSize > 0
		) {
			const isLt = file.size / 1024 / 1024 < props.archiveFileSize;
			if (!isLt) {
				useMessage().error(`压缩包大小不能超过 ${props.archiveFileSize} MB!`);
				return false;
			}
		}
	}

	if (props.fileSize) {
		const isLt = file.size / 1024 / 1024 < props.fileSize;
		if (!isLt) {
			useMessage().error(`${t('excel.sizeErrorText')} ${props.fileSize} MB!`);
			return false;
		}
	}
	return true;
};

const handleFileChange = (
	_file: Record<string, unknown>,
	uploadFileList: unknown[]
) => {
	const pendingFiles = (uploadFileList as Record<string, unknown>[]).filter(
		(f) => f.status !== 'success'
	);
	if (pendingFiles.length > 0) {
		uploadingCount.value = pendingFiles.length;
		isUploading.value = true;
		if (props.showProgressDialog && !globalLoadingInstance) {
			uploadStatus.value = 'uploading';
			globalLoadingInstance = ElLoading.service({
				lock: true,
				text: '文件加载中,加载过程中请不要关闭或操作页面..',
				background: 'rgba(0, 0, 0, 0.7)',
			});
		}
	}

	if (props.validationType === 'replaceByZip') {
		const allFiles = (uploadFileList as Record<string, unknown>[])
			.map((item) => item.raw as File | undefined)
			.filter((raw): raw is File => !!raw);

		if (allFiles.length > 0) {
			const hasArchive = allFiles.some(isArchiveFile);
			const hasNonArchive = allFiles.some((f) => !isArchiveFile(f));

			if (hasArchive && hasNonArchive) {
				useMessage().warning('不能同时上传压缩包和普通文件，请分开上传');
				if (fileUpload.value?.clearFiles) {
					fileUpload.value.clearFiles();
				}
				nextTick(() => {
					rebuildFromUploadList(
						fullFileList.value.map((item) => ({
							uid: item.uid,
							name: item.name,
							url: item.url,
							status: item.status,
							raw: item.raw,
						}))
					);
				});
				return;
			}
		}
	}

	pendingUploadChangeList = uploadFileList;
	if (!uploadChangeFlushScheduled) {
		uploadChangeFlushScheduled = true;
		queueMicrotask(flushCoalescedUploadChange);
	}
};

function handleUploadSuccess(
	res: Record<string, unknown>,
	file: Record<string, unknown>
) {
	uploadingCount.value = Math.max(0, uploadingCount.value - 1);
	const resData = res as Record<string, unknown>;
	if (resData.code === 0) {
		const existed = fullFileList.value.find((item) => item.uid === file.uid);
		const nextFile = normalizeFileFromUploadSuccess(
			(resData.data ?? {}) as Record<string, unknown>,
			file,
			existed
		);
		if (existed) {
			fullFileList.value = fullFileList.value.map((item) =>
				item.uid === file.uid ? nextFile : item
			);
		} else {
			fullFileList.value.push(nextFile);
		}
		syncDisplayFileList();
		emit('success', resData, file);
		emitModelValueChange();
		emit('getFileCurrent', displayFileList.value);
	} else {
		removeByUploadFile(file as Partial<UploadDisplayItem>);
		fileUpload.value?.handleRemove?.(file);
	}
	if (uploadingCount.value === 0) {
		isUploading.value = false;
		if (props.showProgressDialog && globalLoadingInstance) {
			globalLoadingInstance.close();
			globalLoadingInstance = null;
			uploadStatus.value = 'success';
		}
	}
}

const handleRemove = (file: UploadDisplayItem) => {
	const previousModelValue = toModelValue(fullFileList.value);
	removeByUploadFile(file);
	emit('getFile', displayFileList.value);
	emit('remove', file, displayFileList.value);
	if (
		props.autoUpload ||
		previousModelValue.length > 0 ||
		toModelValue(fullFileList.value).length > 0
	) {
		emitModelValueChange();
	}
};

const handlePreview = (file: UploadDisplayItem) => {
	emit('preview', file);
	const previewUrl = getPreviewUrl(file);
	if (!previewUrl) return;
	openPreviewDialog(previewUrl);
};

const handleExceed = (files: unknown[], uploadFileList: unknown[]) => {
	emit('exceed', files, uploadFileList);

	if (props.validationType === 'replaceByZip') {
		useMessage().warning(
			`文件数量超过 ${props.limit} 个，请打包成压缩包后上传`
		);
	} else {
		useMessage().warning(
			`${t('excel.uploadLimit')} ${props.limit} ${t('excel.files')}`
		);
	}
};

const handleUploadError = (
	error: unknown,
	file: unknown,
	uploadFileList: unknown[]
) => {
	uploadingCount.value = Math.max(0, uploadingCount.value - 1);
	if (uploadingCount.value === 0) {
		isUploading.value = false;
		if (props.showProgressDialog && globalLoadingInstance) {
			globalLoadingInstance.close();
			globalLoadingInstance = null;
			uploadStatus.value = 'fail';
		}
	}
	emit('error', error, file, uploadFileList);
	useMessage().error('上传文件失败');
};

watch(
	() => props.modelValue,
	async (val) => {
		const normalizedCurrentValue = toModelValue(fullFileList.value);
		const normalizedIncomingValue = Array.isArray(val)
			? (val as unknown[]).filter(Boolean)
			: typeof val === 'string'
			? val.split(',').filter(Boolean)
			: [];
		if (
			syncingFromInner.value &&
			JSON.stringify(normalizedIncomingValue) ===
				JSON.stringify(normalizedCurrentValue)
		) {
			syncingFromInner.value = false;
			return;
		}
		syncingFromInner.value = false;
		const normalizedList = normalizeModelValueToFiles(val, fullFileList.value);
		fullFileList.value = normalizedList;
		syncDisplayFileList();

		const taskId = ++translateTaskSeed;
		if (!shouldTranslateModelValue(val)) {
			pendingTranslateTask.value = null;
			translatingMetaLoading.value = false;
			return;
		}
		const nextTask = { value: val, baseList: normalizedList, taskId };
		if (!isComponentVisible.value) {
			pendingTranslateTask.value = nextTask;
			return;
		}
		await runTranslateTask(nextTask);
	},
	{ deep: true, immediate: true }
);
const initLoading = () => {
	uploadStatus.value = 'uploading';
};
useIntersectionObserver(
	uploadRootRef,
	async (entries) => {
		const visible = entries.some((entry) => entry.isIntersecting);
		isComponentVisible.value = visible;
		if (visible) {
			await flushPendingTranslateTask();
		}
	},
	{ threshold: 0 }
);

const submit = () => {
	if (fileUpload.value) {
		fileUpload.value.submit();
	}
};

const getSelectedFiles = () => {
	return fullFileList.value
		.filter((file) => file.raw && file.status !== 'success')
		.map((file) => file.raw as File);
};

const getFileList = () => {
	return fullFileList.value.map((item) => ({
		...item,
		code: item.code || item.fileName,
		fileName: item.fileName || item.code,
		name: item.name || item.originalFileName || item.fileName,
	}));
};

defineExpose({
	submit,
	getSelectedFiles,
	getFileList,
	initLoading,
	fileList: displayFileList,
});
</script>

<style scoped>
.file-list-container {
	max-height: 300px;
	overflow-y: auto;
}

.file-list-item {
	display: flex;
	align-items: center;
	padding: 0 16px;
	height: 50px;
	margin-bottom: 4px;
	transition: background-color 0.2s, color 0.2s;
	border-radius: 4px;
	cursor: pointer;
}

.file-list-item:hover {
	background-color: #f0f9ff;
}

.file-list-item:hover .text-gray-700 {
	color: #2563eb;
}

.virtual-file-item {
	display: flex;
	align-items: center;
	padding: 0 16px;
	transition: background-color 0.2s, color 0.2s;
	cursor: pointer;
}

.virtual-file-item:hover {
	background-color: #f0f9ff;
}

.virtual-file-item:hover .text-gray-700 {
	color: #2563eb;
}
.tips-success {
	color: #2563eb;
	font-size: 16px;
	padding: 8px 0;
	width: 100%;
	text-align: center;
	background-color: #e6f7ff;
}
.tips-fail {
	color: #f56c6c;
	font-size: 16px;
	padding: 8px 0;
	width: 100%;
	text-align: center;
	background-color: #fef0f0;
}
</style>
