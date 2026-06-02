<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-14 10:54:34
 * @LastEditors: 朱寒松 3136271519@qq.com
 * @LastEditTime: 2025-08-04 19:29:15
 * @FilePath: \qianyi-ui\src\views\product\product-info\sku\components\form-dialog\components\imgs-info.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';
import { getCurrentInstance, watch } from 'vue';
import { useMessage } from '/@/hooks/message';
import { auth } from '/@/utils/authFunction';
const { appContext } = getCurrentInstance()!;
const baseURL = appContext.config.globalProperties.baseURL;
const ImageUpload = defineAsyncComponent(() => import('./imgs-info/Image.vue'));
const Preview = defineAsyncComponent(() => import('./imgs-info/preview.vue'));

const props = defineProps({
	setImgUrl: {
		type: Function,
		default: () => {},
	},
	visibleType: {
		type: String,
		default: '', // edit, view
	},
});
const avatarList = ref<{ url: string; fileName: string }[]>([]); // 用于存储上传的图片地址
// 图片预览
const showPreview = ref(false);
const type = ref('image'); // 预览类型
const fileName = ref(''); // 预览文件名
// 预览图片地址
const previewUrl = ref<string>(); // 用于存储预览的图片地址

// 监听avatar，只要他变了，就把第一张图片设置为主图
watch(
	() => avatarList.value,
	(newVal) => {
		if (newVal.length > 0) {
			props.setImgUrl(newVal[0]);
		} else {
			props.setImgUrl({ url: '', fileName: '' }); // 如果没有图片，则清空
		}
	},
	{ deep: true }
);

/* 图片上传相关方法 */
/**
 * 设置图片上传地址数组
 * @param obj
 */
const setImageUploadUrl = (obj: { url: string; fileName: string }) => {
	// 如果数组长度超过30张，则不再添加
	if (avatarList.value.length >= 30) {
		useMessage().error('最多支持30张图片');
		return;
	}
	avatarList.value.push(obj);
};
/**
 * 修改图片上传地址
 * @param url
 * @param index
 */
const editImageUploadUrl = (obj: { url: string; fileName: string }, index: number) => {
	avatarList.value[index] = obj; // 更新指定索引的图片地址
};
/**
 * 删除图片
 * @param index
 */
const deleteImageUploadUrl = (index: number) => {
	avatarList.value.splice(index, 1);
};
/**
 * 设为主图
 * @param index
 */
const setAsMainImage = (index: number) => {
	if (index <= 0 || index >= avatarList.value.length) return;
	const selected = avatarList.value[index];
	avatarList.value.splice(index, 1); // 删除原位置
	avatarList.value.unshift(selected); // 插入到第一位
};
/**
 * 查看图片
 * @param index
 */
const viewImage = (index: number) => {
	showPreview.value = true;
	previewUrl.value = avatarList.value[index].url.includes('http') ? avatarList.value[index].url : baseURL + avatarList.value[index].url;
	type.value = 'image';
	fileName.value = '图片预览';
};

/**
 * 设置数据
 */
const setData = (data: { url: string; fileName: string }[]) => {
	avatarList.value = data;
};

defineExpose({
	avatarList,
	setData,
});
</script>
<template>
	<div class="imgs-info">
		<!-- 头部提示 -->
		<div class="upload-tip-box">
			<p>• 支持 JPG、PNG、GIF 格式</p>
			<p>• 每张图片大小不可超过 5M，不能超过 30 张</p>
		</div>
		<!-- 图片上传 -->
		<div class="upload-box">
			<ImageUpload :setImgUrl="setImageUploadUrl" :isMultiple="true">
				<el-button type="primary" :disabled="props.visibleType === 'view' || props.visibleType === 'skuView' || !auth('spu_edit_imgs')"
					>上传文件</el-button
				></ImageUpload
			>
		</div>
		<!-- 图片展示 -->
		<div class="image-preview">
			<div v-for="(item, index) in avatarList" :key="index" class="image-item">
				<el-image
					:src="item?.url.includes('http') ? item?.url : baseURL + item?.url"
					fit="cover"
					:style="{ width: '160px', height: '160px', marginRight: '10px', borderRadius: '8px' }"
					@click="() => {}"
				>
				</el-image>
				<div class="preview-handle" @click.stop v-show="props.visibleType !== 'view'">
					<div class="handle-top">
						<span v-if="index === 0">{{ $t('主图') }}</span>
					</div>
					<div class="handle-bottom">
						<div
							class="handle-icon"
							@click="
								() => {
									viewImage(index);
								}
							"
						>
							<el-icon><ZoomIn /></el-icon>
						</div>
						<div
							class="handle-icon"
							@click="
								() => {
									setAsMainImage(index);
								}
							"
							v-if="index !== 0"
						>
							<el-icon><Star /></el-icon>
						</div>
						<div
							class="handle-icon"
							@click="
								() => {
									deleteImageUploadUrl(index);
								}
							"
						>
							<el-icon><Delete /></el-icon>
						</div>
						<div class="handle-icon">
							<ImageUpload
								:setImgUrl="
									(url:string) => {
										editImageUploadUrl(url, index);
									}
								"
								:isMultiple="false"
							>
								<el-icon><Edit /> </el-icon
							></ImageUpload>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 图片预览 -->
		<Preview v-model="showPreview" :url="previewUrl" :type="type" :fileName="fileName" />
	</div>
</template>

<style scoped lang="scss">
.imgs-info {
	padding: 15px 30px;
	.upload-tip-box {
		background-color: #e8f3ff; /* 浅蓝背景 */
		color: #606266; /* 字体颜色与 el 默认保持一致 */
		font-size: 14px;
		border-radius: 6px;
		margin-bottom: 15px;
		padding: 5px;
		display: flex;
		flex-direction: column;
		p {
			height: 30px;
			line-height: 30px;
		}
	}
	.upload-box {
		margin-bottom: 15px;
	}
	.image-preview {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		.image-item {
			position: relative;
			margin: 0px 10px 10px 0;
			.preview-handle {
				position: absolute;
				width: 160px;
				height: 160px;
				top: 0;
				left: 0;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.handle-top {
					display: flex;
					justify-content: flex-end;
					span {
						color: #65c064;
						background-color: #ebfbe2;
						padding: 2px 5px;
					}
				}
				.handle-bottom {
					background: #c9c9c9;
					display: flex;
					justify-content: space-around;
					color: #fff;
					background-color: #c9c9c9;
					border-radius: 0 0 6px 6px;
					height: 25px;
					.handle-icon {
						flex: 1;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						cursor: pointer;
						/* 初始背景和颜色 */
						background-color: transparent;
						color: #fff;
						/* 动画属性 */
						transition: background-color 0.3s ease, color 0.3s ease;
						&:hover {
							background-color: #9e9e9e; /* 鼠标移入时背景变色 */
							border-radius: 0 0 6px 6px;
						}
					}
				}
			}
			/* 初始隐藏 .handle-bottom */
			.preview-handle {
				.handle-bottom {
					opacity: 0;
					visibility: hidden;
					transition: opacity 0.3s ease, visibility 0.3s ease;
				}
			}

			/* 鼠标移入 .preview-handle 时显示 .handle-bottom */
			.preview-handle:hover {
				.handle-bottom {
					opacity: 1;
					visibility: visible;
				}
			}
		}
	}
}
</style>
