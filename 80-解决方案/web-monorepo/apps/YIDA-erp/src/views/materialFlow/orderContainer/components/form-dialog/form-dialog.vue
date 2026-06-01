<template>
	<el-dialog
		v-model="visiable"
		width="80%"
		:close-on-click-modal="false"
		draggable
		:destroy-on-close="false"
		:title="props.title"
	>
		<div class="dialog-container">
			<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
				<el-tab-pane label="货柜信息" name="1">
					<BaseInfo
						ref="baseInfoRef"
						:dictMap="props.dictMap"
						:currentRow="currentRow"
						:visiableType="visiableType"
					/>
				</el-tab-pane>
				<el-tab-pane label="发货清单" name="2"
					><ShippingList
						ref="shippingListRef"
						:dictMap="props.dictMap"
						:visiableType="visiableType"
						:status="currentRow?.status"
				/></el-tab-pane>
			</el-tabs>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">{{
					$t('common.cancelButtonText')
				}}</el-button>
				<el-button
					v-if="props.visiableType === 'edit'"
					type="primary"
					@click="onSubmit"
					:disabled="loading"
					>{{ $t('保存') }}</el-button
				>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { updateOrderContainer } from '/@/api/materialFlow/orderContainer/index';
import { editInit } from './utils/form-dialog';
import { useMessage } from '/@/hooks/message';

const BaseInfo = defineAsyncComponent(
	() => import('./components/base-info.vue')
);
const ShippingList = defineAsyncComponent(
	() => import('./components/shippingList.vue')
);
const props = defineProps({
	title: {
		type: String,
		default: '编辑',
	},
	currentRow: {
		type: Object,
		default: () => ({}),
	},
	visiableType: {
		type: String,
		default: 'edit',
	},
	dictMap: { type: Object, default: () => ({}) }, // 字典数据
});

const emit = defineEmits(['closeDialog']);

const baseInfoRef = ref(); // 基本信息
const shippingListRef = ref(); // 发货清单
const visiable = ref(false);
const loading = ref(false);

const activeName = ref('1');

const handleOpen = () => {
	visiable.value = true;
	activeName.value = '1';
	editInit(baseInfoRef, shippingListRef, props);
};
const handleClose = () => {
	visiable.value = false;
};

const handleClick = () => {};
const mapMiddle = function (
	arr?: { encryptedFileName?: string }[] | string[]
): string[] {
	if (!Array.isArray(arr)) return [];

	// 如果 arr 是字符串数组，直接返回
	if (arr.every((item) => typeof item === 'string')) {
		return arr as string[]; // 类型断言
	}

	// 如果 arr 是对象数组，按照原来的方式处理
	return arr
		.map((item) => item.encryptedFileName)
		.filter((v): v is string => !!v);
};

const onSubmit = async () => {
	// 开启加载状态
	loading.value = true;
	try {
		await baseInfoRef.value.formRef.validate();
	} catch (error) {
		activeName.value = '1';
		return;
	} finally {
		loading.value = false;
	}
	try {
		const shippingList = shippingListRef.value.getDataList();
		for (const row of shippingList) {
			if (row.shippingMethod === 'dropshipping' && !row.destWarehouseCode) {
				useMessage().error(`产品 ${row.deliveryNo} 的目的仓不能为空`);
				activeName.value = '2';
				return; // 只要一个不合法就退出
			}
		}
		// 收集装柜顺序并做去重校验
		const factoryOrders = shippingListRef.value.getLoadContainerSort() || [];
		// 判断如果有装柜顺序是否选择工厂
		const isValid = factoryOrders.some((element: any) => !element);
		if (isValid) {
			useMessage().error(`请选择工厂`);
			return;
		}
		const ids = factoryOrders
			.map((i: any) => i.factoryId ?? i.factoryName)
			.filter(Boolean);
		const unique = new Set(ids);
		if (ids.length !== unique.size) {
			useMessage().error('装柜顺序不可包含重复工厂');
			activeName.value = '2';
			return;
		}
		const deliveryUpdateDTOS = shippingList.map((item: any) => {
			return {
				id: item.id,
				destWarehouseCode: item.destWarehouseCode,
			};
		});
		// 这里将 factoryOrders 合并到待提交的数据中（示例）
		const payload = {
			...baseInfoRef.value.formData,
			deliveryUpdateDTOS,
			loadContainerSort: factoryOrders,

			// 其他需要的字段...
			// attachment: baseInfoRef.value.formData.attachment,
			attachment: mapMiddle(baseInfoRef.value.formData.attachment),
			loadingPhotoFileUrl: mapMiddle(
				baseInfoRef.value.formData.loadingPhotoFileUrl
			),
			factoryDeliveryOrderFileUrl: mapMiddle(
				baseInfoRef.value.formData.factoryDeliveryOrderFileUrl
			),
			labelingPhotoFileUrl: mapMiddle(
				baseInfoRef.value.formData.labelingPhotoFileUrl
			),
		};
		const res = await updateOrderContainer(payload);
		if (res.code === 0) {
			useMessage().success('更新成功');
			handleClose();
			emit('closeDialog');
		}
	} catch (error) {
		activeName.value = '2';
		return;
	} finally {
		loading.value = false;
	}
};

defineExpose({
	handleOpen,
	handleClose,
});
</script>

<style lang="scss" scoped>
:deep(.el-dialog-body) {
	padding: 0 20px !important;
}
.dialog-container {
	overflow: auto;
	height: 70vh;
}
</style>
