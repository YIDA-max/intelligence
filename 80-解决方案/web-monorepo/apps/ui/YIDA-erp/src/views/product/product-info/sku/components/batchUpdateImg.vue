<template>
	<el-dialog
		v-model="visible"
		:close-on-click-modal="false"
		:title="'批量更新图片'"
		width="50%"
		@close="handleClose"
		draggable
	>
		<ImageUpload :isMultiple="false" :setImgUrl="setImageUploadUrl">
			<div class="upload-placeholder" v-show="!avatarList.length">
				<span>+</span>
				<span>上传图片</span>
			</div>
		</ImageUpload>

		<div v-if="avatarList.length > 0" class="image-container">
			<div v-for="(item, index) in avatarList" :key="index" class="image-item">
				<el-image
					:src="item?.url.includes('http') ? item?.url : baseURL + item?.url"
					fit="cover"
					class="uploaded-image"
				/>
				<div class="image-actions">
					<el-icon @click="deleteImageUploadUrl(index)" class="action-icon">
						<Delete />
					</el-icon>
				</div>
			</div>
		</div>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">{{ $t('取消') }}</el-button>
				<el-button type="primary" @click="onSubmit">
					{{ $t('确定') }}
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { Delete } from '@element-plus/icons-vue';
import { batchUpdateSkuImg } from '/@/api/product/sku';

const ImageUpload = defineAsyncComponent(
	() => import('./form-dialog/components/imgs-info/Image.vue')
);

const emit = defineEmits(['closeDialog']);
const props = defineProps({
	selectedRows: {
		type: Array,
		default: () => [],
	},
});
const baseURL = import.meta.env.VITE_API_URL as any;
const visible = ref(false);
const avatarList = ref<{ url: string; fileName: string }[]>([]);
// 打开弹窗
const handleOpen = async () => {
	visible.value = true;
	avatarList.value = [];
};

// 关闭弹窗
const handleClose = () => {
	visible.value = false;
	emit('closeDialog');
};
// 提交
const onSubmit = async () => {
	if (avatarList.value.length === 0) {
		ElMessage.warning('请先上传图片');
		return;
	}
	try {
		const res = await batchUpdateSkuImg({
			skuCodes: props.selectedRows.map((item: any) => item.skuCode),
			skuImgs: avatarList.value.map((item: any) => {
				return {
					imgFileName: item.fileName,
				};
			}),
		});
		if (res.code === 0) {
			ElMessage.success('操作成功');
			await new Promise((resolve) => setTimeout(resolve, 300));
			handleClose();
		}
	} catch (error: any) {
		ElMessage.error(error.msg || '操作失败，请重试');
	}
};

defineExpose({
	handleOpen,
	handleClose,
});

/* 图片上传相关方法 */
/**
 * 设置图片上传地址数组
 * @param obj
 */
const setImageUploadUrl = (obj: { url: string; fileName: string }) => {
	avatarList.value.push(obj);
};

/**
 * 删除图片
 * @param index
 */
const deleteImageUploadUrl = (index: number) => {
	avatarList.value.splice(index, 1);
	ElMessage.success('删除成功');
};
</script>

<style scoped lang="scss">
.image-container {
	margin-top: 10px;
}

.image-item {
	position: relative;
	display: inline-block;
	width: 160px;
	height: 160px;
	margin-right: 10px;
	border-radius: 8px;
	overflow: hidden;

	.uploaded-image {
		width: 100%;
		height: 100%;
	}

	.image-actions {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.5);
		opacity: 0;
		transition: opacity 0.3s;

		.action-icon {
			color: white;
			font-size: 24px;
			cursor: pointer;
		}
	}

	&:hover .image-actions {
		opacity: 1;
	}
}
.upload-placeholder {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 160px;
	height: 160px;
	border: 2px dashed #d9d9d9;
	border-radius: 8px;
	color: #999;
	cursor: pointer;
}
</style>
