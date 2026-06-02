<template>
	<el-dialog
		v-bind="$attrs"
		width="80%"
		:close-on-click-modal="false"
		draggable
		@open="init"
		:title="props.title"
	>
		<div
			:style="{
				height: '70vh',
			}"
		>
			<el-row>
				<el-col :span="4">
					<div class="left-con">
						<div class="img-upload">
							<ImageUpload
								v-model:imageUrl="avatar"
								height="180px"
								width="180px"
								:disabled="true"
							></ImageUpload>
						</div>
						<div class="tab-list">
							<el-tabs
								tab-position="right"
								style="height: 200px"
								class="demo-tabs"
								v-model="tabsValue"
							>
								<el-tab-pane label="基本信息" :name="0"></el-tab-pane>
								<el-tab-pane label="关联SKU" :name="1"></el-tab-pane>
								<el-tab-pane label="图片信息" :name="2"></el-tab-pane>
								<el-tab-pane
									label="操作日志"
									:name="3"
									v-if="props.visibleType === 'view'"
								></el-tab-pane>
							</el-tabs>
						</div>
					</div>
				</el-col>
				<el-col :span="20">
					<BaseInfo
						ref="baseInfoRef"
						v-show="tabsValue === 0"
						:dictMap="dictMap"
						:visibleType="props.visibleType"
						:currentRow="props.currentRow"
					></BaseInfo>
					<AssociateSku
						ref="associateSkuRef"
						v-show="tabsValue === 1"
						:dictMap="dictMap"
						:visibleType="props.visibleType"
						:currentRow="props.currentRow"
					></AssociateSku>
					<ImgsInfo
						ref="imgsInfoRef"
						v-show="tabsValue === 2"
						:dictMap="dictMap"
						:setImgUrl="setImgUrl"
						:visibleType="props.visibleType"
					></ImgsInfo>
					<LogInfo
						ref="logInfoRef"
						v-show="tabsValue === 3"
						:dictMap="dictMap"
						:visibleType="props.visibleType"
						:currentRow="props.currentRow"
					></LogInfo>
				</el-col>
			</el-row>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="closeDialog">{{
					$t('common.cancelButtonText')
				}}</el-button>
				<template v-if="props.visibleType === 'add'">
					<el-button type="primary" @click="onSubmit" :disabled="loading">{{
						$t('添加')
					}}</el-button>
				</template>
				<template v-if="props.visibleType === 'copy'">
					<el-button type="primary" @click="onSubmit" :disabled="loading">{{
						$t('复制')
					}}</el-button>
				</template>
				<template v-if="props.visibleType === 'edit'">
					<el-button type="primary" @click="onSubmit" :disabled="loading">
						{{ $t('保存') }}
					</el-button>
				</template>
				<template v-if="props.visibleType === 'view'">
					<el-button @click="changeCopy" :disabled="loading">{{
						$t('复制')
					}}</el-button>
					<el-button type="primary" @click="changeEdit" :disabled="loading">
						{{ $t('编辑') }}
					</el-button>
				</template>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { useMessage } from '/@/hooks/message';
import { getDicts } from '/@/api/admin/dict';
import { defineAsyncComponent, ref, onMounted } from 'vue';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { getCategoryTree } from '/@/api/product/category';
import { getBrandAllList } from '/@/api/product/brand';
import { addSpuSave, editSpuUpdate } from '/@/api/product/spu';
import { getUserListByCondition } from '/@/api/admin/user';
import { addInit, editInit, copyInit } from './utils/sku-form-dialog';
const ImageUpload = defineAsyncComponent(
	() => import('/@/components/Upload/Image.vue')
);
const BaseInfo = defineAsyncComponent(
	() => import('./components/base-info.vue')
);
const AssociateSku = defineAsyncComponent(
	() => import('./components/associate-sku.vue')
);
const ImgsInfo = defineAsyncComponent(
	() => import('./components/imgs-info.vue')
);
const LogInfo = defineAsyncComponent(() => import('./components/log-info.vue'));
const emit = defineEmits([
	'refresh',
	'closeDialog',
	'changeCopy',
	'changeEdit',
]);
const props = defineProps({
	currentRow: {
		type: Object,
		default: () => ({}),
	},
	visibleType: {
		type: String,
		default: '',
	},
	title: {
		type: String,
		default: '',
	},
});
//   初始化数据
const { dictMap } = useMultipleDicts(
	[
		{
			key: 'categoryCode',
			fetchFn: getCategoryTree,
			params: {
				status: 1,
			},
		}, // 类目
		{
			key: 'brandCode',
			fetchFn: getBrandAllList,
			params: '',
		}, // 品牌

		{
			key: 'productType',
			fetchFn: getDicts,
			params: 'product_type',
		}, // 产品类型
		{
			key: 'productManageId',
			fetchFn: getUserListByCondition,
			params: {
				lockFlag: 0,
			},
		}, // 负责人
	],
	{
		isAuto: true,
		tableRef: null,
	}
);
// onMounted
onMounted(async () => {});

const loading = ref(false);
const tabsValue = ref(0);
const avatar = ref(''); // 默认头像
const baseInfoRef = ref();
const associateSkuRef = ref();
const imgsInfoRef = ref();
const logInfoRef = ref();
// 提交
const onSubmit = async () => {
	// 开启加载状态
	loading.value = true;
	// // 验证基本信息
	try {
		await baseInfoRef.value.dataFormRef.validate();
	} catch (error) {
		tabsValue.value = 0;
	} finally {
		loading.value = false;
	}
	// 验证关联SKU
	try {
		const associateSkuList = await associateSkuRef.value.getDataList();
		if (associateSkuList.length === 0) {
			useMessage().error('请关联SKU');
			tabsValue.value = 1;
			return;
		}
	} catch (error) {
		tabsValue.value = 1;
	} finally {
		loading.value = false;
	}
	// 验证图片信息
	// try {
	// 	if (imgsInfoRef.value.avatar.length === 0) {
	// 		useMessage().error('请上传图片');
	// 		tabsValue.value = 2;
	// 		return;
	// 	}
	// } catch (error) {
	// 	tabsValue.value = 2;
	// } finally {
	// 	loading.value = false;
	// }
	// 基本信息
	const baseInfoParams = {
		// spuCode
		spuCode: baseInfoRef.value.localFormData.spuCode,
		// 产品名称
		spuName: baseInfoRef.value.localFormData.spuName,
		// 类目
		categoryCode: baseInfoRef.value.localFormData.categoryCode,
		// 品牌
		brandCode: baseInfoRef.value.localFormData.brandCode,
		// 产品类型
		productType: baseInfoRef.value.localFormData.productType,
		// 产品负责人
		productManageId: baseInfoRef.value.localFormData.productManageId
			? baseInfoRef.value.localFormData.productManageId
			: 1,
		// 产品描述
		productDesc: baseInfoRef.value.localFormData.productDesc,
		// 附件文件名
		attachmentFileName: baseInfoRef.value.localFormData.attachmentFileName?.map(
			(item: string) =>
				typeof item === 'string' && item.includes('fileName=')
					? item.split('fileName=')[1]
					: item
		),
	};
	// 关联sku
	const associateMaterialDataList = associateSkuRef.value.getDataList();
	const associateMaterialParams = {
		spuSkuList: associateMaterialDataList.map((item: any) => {
			if (props.visibleType === 'edit') {
				return {
					spuCode: baseInfoRef.value.localFormData.spuCode, // spu编码
					skuCode: item.skuCode, // sku编码
					id: item.id, // 传入ID
				};
			} else {
				return {
					spuCode: baseInfoRef.value.localFormData.spuCode, // spu编码
					skuCode: item.skuCode, // sku编码
				};
			}
		}), // 关联的SKU编码
	};
	// 图片列表
	const imgsInfoParams = {
		spuImgs: imgsInfoRef.value.avatarList.map(
			(item: { url: string; fileName: string }, index: number) => {
				return {
					spuCode: baseInfoRef.value.localFormData.spuCode,
					imgFileName: item.fileName,
					mainFlag: index === 0 ? 1 : 0, // 第一张图片为主图
				};
			}
		),
	};
	try {
		// 区分新增和编辑
		if (props.visibleType === 'add') {
			// 新增SKU
			const res = await addSpuSave({
				...baseInfoParams,

				...associateMaterialParams,

				...imgsInfoParams,
			});
			if (res.code === 0) {
				useMessage().success('添加成功');

				emit('closeDialog'); // 关闭对话框
			}
		} else if (props.visibleType === 'edit') {
			// 编辑SKU
			const res = await editSpuUpdate({
				id: props.currentRow.id, // 传入ID
				...baseInfoParams,
				...associateMaterialParams,
				...imgsInfoParams,
			});
			if (res.code === 0) {
				useMessage().success('编辑成功');
				emit('closeDialog'); // 关闭对话框
			}
		} else if (props.visibleType === 'copy') {
			// 复制SKU
			const res = await addSpuSave({
				...baseInfoParams,
				...associateMaterialParams,
				...imgsInfoParams,
			});
			if (res.code === 0) {
				useMessage().success('复制成功');
				emit('closeDialog'); // 关闭对话框
			}
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};

const closeDialog = () => {
	emit('closeDialog');
};

/**
 * 初始化
 */
const init = async () => {
	try {
		loading.value = true;
		tabsValue.value = 0; // 默认选中第一个tab
		avatar.value = ''; // 清空头像
		// 如果是新增，就需要清空数据
		if (props.visibleType === 'add') {
			addInit(baseInfoRef, associateSkuRef, imgsInfoRef, avatar, tabsValue);
		} else if (props.visibleType === 'edit') {
			// 如果是编辑，就需要加载数据
			await editInit(baseInfoRef, associateSkuRef, imgsInfoRef, props);
		} else if (props.visibleType === 'view') {
			// 如果是查看，就需要加载数据
			await editInit(baseInfoRef, associateSkuRef, imgsInfoRef, props);
		} else if (props.visibleType === 'skuView') {
			// 如果是查看，就需要加载数据
			await editInit(baseInfoRef, associateSkuRef, imgsInfoRef, props);
		} else if (props.visibleType === 'copy') {
			// 如果是复制，就需要加载数据
			await copyInit(baseInfoRef, associateSkuRef, imgsInfoRef, props);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
/**
 * 设置主图
 * @param url
 */
const setImgUrl = (obj: { url: string }) => {
	avatar.value = obj.url;
};

// 切换到复制模式
const changeCopy = () => {
	emit('changeCopy', {
		id: props.currentRow.id,
	});
};
// 切换到编辑模式
const changeEdit = () => {
	emit('changeEdit', {
		id: props.currentRow.id,
	});
};
</script>
<style scoped lang="scss">
.left-con {
	border-right: 1px solid #ededed;
}
.img-upload {
	padding: 20px;
	border-bottom: 1px solid #ededed;
}
.tab-list {
	width: 120px;
	padding: 20px 0;
}
:deep(.el-overlay .el-overlay-dialog .el-dialog .el-dialog__body) {
	padding: 0 !important;
}
:deep(.el-tabs__item) {
	height: 20px !important;
}
</style>
