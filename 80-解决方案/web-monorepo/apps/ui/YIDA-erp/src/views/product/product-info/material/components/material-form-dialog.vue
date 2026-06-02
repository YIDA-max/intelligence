<template>
	<el-dialog v-bind="$attrs" width="80%" :close-on-click-modal="false" draggable @open="init" :title="props.title">
		<div
			:style="{
				height: '60vh',
			}"
		>
			<el-row>
				<el-col :span="4">
					<div class="left-con">
						<div class="img-upload">
							<ImageUpload v-model:imageUrl="avatar" height="150px" width="150px" :disabled="true"></ImageUpload>
						</div>
						<div class="tab-list">
							<el-tabs v-model="tabsValue" tab-position="right" class="demo-tabs" style="height: 200px">
								<el-tab-pane :name="0" label="基本信息"></el-tab-pane>
								<el-tab-pane :name="1" label="采购信息"></el-tab-pane>
								<el-tab-pane :name="2" label="箱规信息"></el-tab-pane>
								<el-tab-pane :name="3" label="图片信息"></el-tab-pane>
								<el-tab-pane label="操作日志" :name="4" v-if="props.visibleType === 'view'"></el-tab-pane>
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
					<PurchasInfo ref="purchaseInfoRef" v-show="tabsValue === 1" :dictMap="dictMap" :visibleType="visibleType"></PurchasInfo>
					<SingleCartonInfo ref="singleCartonInfoRef" v-show="tabsValue === 2" :dictMap="dictMap" :visibleType="visibleType"></SingleCartonInfo>
					<ImgsInfo ref="imgsInfoRef" v-show="tabsValue === 3" :dictMap="dictMap" :setImgUrl="setImgUrl" :visibleType="props.visibleType"></ImgsInfo>
					<LogInfo
						ref="logInfoRef"
						v-show="tabsValue === 4"
						:dictMap="dictMap"
						:visibleType="props.visibleType"
						:currentRow="props.currentRow"
					></LogInfo>
				</el-col>
			</el-row>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="closeDialog">{{ $t('common.cancelButtonText') }}</el-button>
				<template v-if="props.visibleType === 'add'">
					<el-button type="primary" @click="onSubmit" :disabled="loading">{{ $t('添加') }}</el-button>
				</template>
				<template v-if="props.visibleType === 'copy'">
					<el-button type="primary" @click="onSubmit" :disabled="loading">{{ $t('复制') }}</el-button>
				</template>
				<template v-if="props.visibleType === 'edit'">
					<el-button type="primary" @click="onSubmit" :disabled="loading">
						{{ $t('保存') }}
					</el-button>
				</template>
				<template v-if="props.visibleType === 'view'">
					<el-button @click="changeCopy" :disabled="loading">{{ $t('复制') }}</el-button>
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
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { getDicts } from '/@/api/admin/dict';
import { saveMaterial, editMaterial } from '/@/api/product/material';
import { addInit, editInit, copyInit } from './utils/config';
import { getUserListByCondition } from '/@/api/admin/user';
const LogInfo = defineAsyncComponent(() => import('./log-info.vue'));
const ImageUpload = defineAsyncComponent(() => import('/@/components/Upload/Image.vue'));
const BaseInfo = defineAsyncComponent(() => import('./base-info.vue'));
const PurchasInfo = defineAsyncComponent(() => import('./purchas-info.vue'));
// const BoxInfo = defineAsyncComponent(() => import('./box-info.vue'));
const ImgsInfo = defineAsyncComponent(() => import('./imgs-info.vue'));
const SingleCartonInfo = defineAsyncComponent(() => import('./single-carton-info.vue'));

const emit = defineEmits(['refresh', 'closeDialog', 'changeCopy', 'changeEdit']);

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
const { dictMap } = useMultipleDicts([
	{
		key: 'materialType',
		fetchFn: getDicts,
		params: 'material_type',
	}, // 辅料类型
	{
		key: 'productManageId',
		fetchFn: getUserListByCondition,
		params: {
			lockFlag: 0,
		},
	}, // 产品负责人
	{
		key: 'purchaseLeadTimeUnit',
		fetchFn: getDicts,
		params: 'purchase_lead_time_unit',
	}, // 采购交期单位
	{
		key: 'referenceCostUnit',
		fetchFn: getDicts,
		params: 'reference_cost_unit',
	}, // 参考成本单位
	{
		key: 'itemSpecUnit',
		fetchFn: getDicts,
		params: 'item_spec_unit',
	}, // 单品规格单位
	{
		key: 'itemNetWeightUnit',
		fetchFn: getDicts,
		params: 'item_net_weight_unit',
	}, // 单品净重单位
]);

const loading = ref(false);

const avatar = ref(''); // 默认头像
// 辅料信息
const baseInfoRef = ref();
// 采购信息
const purchaseInfoRef = ref();
// 箱规信息
const singleCartonInfoRef = ref();
// 图片信息
const imgsInfoRef = ref();

const logInfoRef = ref();
/**
 * 设置主图
 * @param url
 */
const setImgUrl = (obj: { url: string }) => {
	avatar.value = obj.url;
};
// 提交
const onSubmit = async () => {
	loading.value = true;
	// // 验证基本信息
	try {
		await baseInfoRef.value.dataFormRef.validate();
	} catch (error) {
		tabsValue.value = 0;
	} finally {
		loading.value = false;
	}
	// 验证采购信息
	try {
		await purchaseInfoRef.value.dataFormRef.validate();
	} catch (error) {
		tabsValue.value = 1;
	} finally {
		loading.value = false;
	}
	// 验证单箱信息
	try {
		await singleCartonInfoRef.value.dataFormRef.validate();
	} catch (error) {
		tabsValue.value = 2;
	} finally {
		loading.value = false;
	}

	// 验证图片信息
	try {
		if (imgsInfoRef.value.avatar.length === 0) {
			useMessage().error('请上传图片');
			tabsValue.value = 6;
			return;
		}
	} catch (error) {
		tabsValue.value = 3;
	} finally {
		loading.value = false;
	}
	// 基本信息
	const baseInfoParams = {
		materialCode: baseInfoRef.value.localFormData.materialCode,
		materialName: baseInfoRef.value.localFormData.materialName,
		materialType: baseInfoRef.value.localFormData.materialType,
		materialDesc: baseInfoRef.value.localFormData.materialDesc,
		productManageId: baseInfoRef.value.localFormData.productManageId,
		attachmentFileName: baseInfoRef.value.localFormData.attachmentFileName?.map((item: string) =>
			typeof item === 'string' && item.includes('fileName=') ? item.split('fileName=')[1] : item
		),
	};
	const purchaseInfoParams = {
		// 采购负责人
		purchaseManageId: purchaseInfoRef.value.localFormData.purchaseManageId ? purchaseInfoRef.value.localFormData.purchaseManageId : '1',
		// 采购交期
		purchaseLeadTime: purchaseInfoRef.value.localFormData.purchaseLeadTime,
		// 采购交期单位
		purchaseLeadTimeUnit: purchaseInfoRef.value.localFormData.purchaseLeadTimeUnit,
		// 参考成本
		referenceCost: purchaseInfoRef.value.localFormData.referenceCost,
		// 参考成本单位
		referenceCostUnit: purchaseInfoRef.value.localFormData.referenceCostUnit,
		// 单品规格 长宽高
		itemSpecLength: purchaseInfoRef.value.localFormData.itemSpecLength,
		itemSpecWidth: purchaseInfoRef.value.localFormData.itemSpecWidth,
		itemSpecHeight: purchaseInfoRef.value.localFormData.itemSpecHeight,
		// 单品规格单位
		itemSpecUnit: purchaseInfoRef.value.localFormData.itemSpecUnit,
		// 包装规格
		packSpecLength: purchaseInfoRef.value.localFormData.packSpecLength,
		packSpecWidth: purchaseInfoRef.value.localFormData.packSpecWidth,
		packSpecHeight: purchaseInfoRef.value.localFormData.packSpecHeight,
		// 包装规格单位
		packSpecUnit: purchaseInfoRef.value.localFormData.packSpecUnit,
		// 单品净重
		itemNetWeight: purchaseInfoRef.value.localFormData.itemNetWeight,
		// 单品净重单位
		itemNetWeightUnit: purchaseInfoRef.value.localFormData.itemNetWeightUnit,
		// 包装毛重
		itemGrossWeight: purchaseInfoRef.value.localFormData.itemGrossWeight,
		// 包装毛重单位
		itemGrossWeightUnit: purchaseInfoRef.value.localFormData.itemGrossWeightUnit,
		// 采购备注
		purchaseRemark: purchaseInfoRef.value.localFormData.purchaseRemark,
	};

	// 单箱信息
	const singleCartonInfoParams = {
		// 单箱数量
		singleCartonQty: singleCartonInfoRef.value.localFormData.singleCartonQty,
		// 外箱规格 长宽高
		outCartonSpecLength: singleCartonInfoRef.value.localFormData.outCartonSpecLength,
		outCartonSpecWidth: singleCartonInfoRef.value.localFormData.outCartonSpecWidth,
		outCartonSpecHeight: singleCartonInfoRef.value.localFormData.outCartonSpecHeight,
		// 外箱规格单位
		outCartonSpecUnit: singleCartonInfoRef.value.localFormData.outCartonSpecUnit,
		// 单箱重量
		singleCartonWeight: singleCartonInfoRef.value.localFormData.singleCartonWeight,
		// 单箱重量单位
		singleCartonWeightUnit: singleCartonInfoRef.value.localFormData.singleCartonWeightUnit,
		// 单柜装箱数
		containerCartonQty: singleCartonInfoRef.value.localFormData.containerCartonQty,
	};
	// 图片列表
	const imgsInfoParams = {
		materialImgs: imgsInfoRef.value.avatarList.map((item: { url: string; fileName: string }, index: number) => {
			return {
				materialCode: baseInfoRef.value.localFormData.materialCode,
				imgFileName: item.fileName,
				mainFlag: index === 0 ? 1 : 0, // 第一张图片为主图
			};
		}),
	};
	try {
		// 区分新增和编辑
		if (props.visibleType === 'add') {
			// 新增SKU
			const res = await saveMaterial({
				...baseInfoParams,
				...purchaseInfoParams,
				...singleCartonInfoParams,
				...imgsInfoParams,
			});
			if (res.code === 0) {
				useMessage().success('添加成功');
				emit('closeDialog'); // 关闭对话框
			}
		} else if (props.visibleType === 'edit') {
			// 编辑SKU
			const res = await editMaterial({
				id: props.currentRow.id, // 传入ID
				...baseInfoParams,
				...purchaseInfoParams,
				...singleCartonInfoParams,
				...imgsInfoParams,
			});
			if (res.code === 0) {
				useMessage().success('编辑成功');
				emit('closeDialog'); // 关闭对话框
			}
		} else if (props.visibleType === 'copy') {
			// 复制SKU
			const res = await saveMaterial({
				...baseInfoParams,
				...purchaseInfoParams,
				...singleCartonInfoParams,
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
			addInit(baseInfoRef, purchaseInfoRef, singleCartonInfoRef, imgsInfoRef, avatar, tabsValue);
		} else if (props.visibleType === 'edit') {
			// 如果是编辑，就需要加载数据
			await editInit(baseInfoRef, purchaseInfoRef, singleCartonInfoRef, imgsInfoRef, props);
		} else if (props.visibleType === 'view') {
			// 如果是查看，就需要加载数据
			await editInit(baseInfoRef, purchaseInfoRef, singleCartonInfoRef, imgsInfoRef, props);
		} else if (props.visibleType === 'copy') {
			// 如果是复制，就需要加载数据
			await copyInit(baseInfoRef, purchaseInfoRef, singleCartonInfoRef, imgsInfoRef, props);
		}
	} catch (err: any) {
		// useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

// const model = defineModel();
const closeDialog = () => {
	//   model.value = false;
	emit('closeDialog');
};

// 切换到复制模式
const changeCopy = () => {
	emit('changeCopy');
};
// 切换到编辑模式
const changeEdit = () => {
	emit('changeEdit');
};

const tabsValue = ref(0);
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
