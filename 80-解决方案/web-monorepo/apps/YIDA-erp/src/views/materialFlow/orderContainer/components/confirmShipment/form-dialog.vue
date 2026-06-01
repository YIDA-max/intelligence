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
			<div v-show="activeName === 'baseInfo'">
				<BaseInfo
					ref="baseInfoRef"
					:dictMap="props.dictMap"
					:currentRow="currentRow"
					:visiableType="visiableType"
				/>
			</div>
			<div v-show="activeName === 'shippingList'">
				<ShippingList
					ref="shippingListRef"
					:dictMap="props.dictMap"
					:visiableType="visiableType"
				/>
			</div>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose" v-if="activeName === 'baseInfo'">{{
					$t('common.cancelButtonText')
				}}</el-button>
				<el-button @click="next">{{
					activeName === 'baseInfo' ? $t('下一步') : $t('上一步')
				}}</el-button>
				<el-button
					v-if="activeName === 'shippingList'"
					type="primary"
					@click="onSubmit"
					:disabled="loading"
					>{{ $t('确认发货') }}</el-button
				>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { confirmDelivery } from '/@/api/materialFlow/orderContainer/index';
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

// 修复：使用字符串来标识当前显示的组件，默认为第一个组件
const activeName = ref('baseInfo');

const next = () => {
	activeName.value =
		activeName.value === 'baseInfo' ? 'shippingList' : 'baseInfo';
};

const handleOpen = () => {
	visiable.value = true;
	activeName.value = 'baseInfo'; // 确保打开时显示第一个组件
	editInit(baseInfoRef, shippingListRef, props);
};
const handleClose = () => {
	visiable.value = false;
};

// 验证目的仓一致性
const validateWarehouseConsistency = () => {
	const shippingList = shippingListRef.value.getDataList();
	if (!shippingList || shippingList.length === 0) {
		return { isValid: true };
	}

	// 获取所有目的仓代码
	const warehouseCodes = shippingList.map(
		(item: any) => item.destWarehouseCode
	);

	if (warehouseCodes.length === 0) {
		return { isValid: true };
	}

	// 检查是否所有目的仓都一致
	const uniqueWarehouses = [...new Set(warehouseCodes)];
	const isConsistent = uniqueWarehouses.length === 1;
	return {
		isValid: true,
		isConsistent,
		warehouseCode: uniqueWarehouses[0],
	};
};
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
		activeName.value = 'baseInfo';
		return;
	} finally {
		loading.value = false;
	}
	try {
		if (!shippingListRef.value.actualLoadingTime) {
			useMessage().error(`实际装柜时间不能为空`);
			activeName.value = 'shippingList';
			return; // 只要一个不合法就退出
		}
		const shippingList = shippingListRef.value.getDataList();
		for (const row of shippingList) {
			if (row.shippingMethod === 'dropshipping' && !row.destWarehouseCode) {
				useMessage().error(`产品 ${row.deliveryNo} 的目的仓不能为空`);
				activeName.value = 'shippingList';
				return; // 只要一个不合法就退出
			}
			// 尝试将 deliveryCartonQuantity 转换为数字，并检查是否为有效数字
			// const deliveryQty = Number(row.deliveryCartonQuantity);
			// if (!Number.isFinite(deliveryQty) || deliveryQty <= 0) {
			// 	useMessage().error(`${row.deliveryNo} 的发货箱数必须大于0`);
			// 	activeName.value = 'shippingList';
			// 	return;
			// }
			// // 将转换后的值赋值给 row.deliveryCartonQuantity
			// row.deliveryCartonQuantity = deliveryQty;
		}
		// 验证目的仓一致性
		const warehouseValidation = validateWarehouseConsistency();
		if (warehouseValidation.isConsistent) {
			// 目的仓一致时，中转拆柜不能为是
			// if (baseInfoRef.value.formData.transshipmentFlag === 1) {
			// 	useMessage().error('目的仓一致时，中转拆柜不能为是');
			// 	activeName.value = 'baseInfo';
			// 	return;
			// }
		} else {
			// 目的仓不一致时，中转拆柜不能为否
			if (baseInfoRef.value.formData.transshipmentFlag === 0) {
				useMessage().error('目的仓不一致时，中转拆柜不能为否');
				activeName.value = 'baseInfo';
				return;
			}
		}

		// 收集装柜顺序并做去重校验
		const factoryOrders = shippingListRef.value.getLoadContainerSort() || [];
		if (!factoryOrders.length) {
			useMessage().error('装柜顺序不可为空');
			activeName.value = 'shippingList';
			return;
		}
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
			activeName.value = 'shippingList';
			return;
		}
		const deliveryConfirmDTOS = shippingList.map((item: any) => {
			return {
				id: item.id,
				destWarehouseCode: item.destWarehouseCode,
				deliveryCartonQuantity: item.deliveryCartonQuantity,
				singleCartonQuantity: item.singleCartonQuantity,
				outCartonLength: item.outCartonLength,
				outCartonWidth: item.outCartonWidth,
				outCartonHeight: item.outCartonHeight,
				productNetWeight: item.productNetWeight,
				outCartonGrossWeight: item.outCartonGrossWeight,
			};
		});
		// 这里将 factoryOrders 合并到待提交的数据中（示例）
		const payload = {
			...baseInfoRef.value.formData,
			deliveryConfirmDTOS,
			loadingSort: factoryOrders,
			actualLoadingTime: shippingListRef.value.actualLoadingTime,

			// 其他需要的字段...
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
		const res = await confirmDelivery(payload);
		if (res.code === 0) {
			useMessage().success('更新成功');
			handleClose();
			emit('closeDialog');
		}
	} catch (error) {
		activeName.value = 'shippingList';
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
	min-height: 70vh;
}
</style>
