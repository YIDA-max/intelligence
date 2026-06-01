<template>
	<el-dialog
		v-model="visible"
		:close-on-click-modal="false"
		:title="props.title"
		width="70%"
		class="min-h-[80%] custom-dialog"
		@close="handleClose"
		:append-to-body="true"
	>
		<!-- 自定义标题 -->
		<template #header>
			<div class="flex border-b pb-3 border-gray-200">
				<div class="header-title font-semibold flex gap-4">
					{{ props.title }}
					<div class="font-normal text-gray-500">
						平台订单号:
						{{ props.currentRow.platformOrderNo }}
					</div>
					<div class="font-normal text-gray-500">
						系统订单号:
						{{ props.currentRow.selfOrderNo }}
					</div>
				</div>
			</div>
		</template>

		<!-- 内容区域 -->
		<div class="flex flex-col min-h-[580px]">
			<div class="w-auto pb-4">
				<el-popover placement="top" width="200" trigger="hover">
					<div class="p-2">
						<div>站点: {{ props.currentRow?.siteCode || '未知状态' }}</div>
						<div>店铺: {{ props.currentRow?.storeName || '未知状态' }}</div>
					</div>
					<template #reference>
						<span class="flex w-full truncate">
							<span class="mr-1">
								<span class="font-color">平台:</span>
								{{ props.currentRow?.platformChannelText }}
							</span>
							<span
								>{{ props.currentRow?.siteCode || '未知状态' }}:
								{{ props.currentRow?.storeName || '未知状态' }}</span
							>
						</span>
					</template>
				</el-popover>
			</div>

			<div
				class="flex flex-col flex-1 justify-between overflow-y-auto pb-4 relative"
			>
				<div class="flex flex-col flex-auto">
					<div class="rwo-header flex pb-2">
						<span class="flex-[3_0_0%]">订单产品</span>
						<div class="flex flex-[2_0_0%]">
							<span class="grow-[3]">换货产品</span>
							<span class="grow-[2] text-red-500">* 订购数量</span>
						</div>
					</div>
					<div class="overflow-auto max-h-[480px] gap-6 flex flex-col">
						<div
							class="product-row mb-6"
							style="flex: auto"
							v-for="(item, index) in props.currentRow.orderItemVOList"
							:key="item.id"
						>
							<changeProductRow
								:ref="(el) => setProductRowRef(el, index)"
								:order="props.currentRow"
								:productOrder="item"
								@change-data-update="handleChangeDataUpdate"
							/>
						</div>
					</div>
				</div>

				<div class="remark flex gap-4">
					<div class="flex whitespace-nowrap">产品备注</div>
					<el-input
						class="w-2/3"
						v-model="productRemark"
						:rows="3"
						type="textarea"
						placeholder="Please input"
					/>
				</div>
			</div>
		</div>
		<template #footer>
			<!-- 底部操作按钮（固定） -->
			<div class="flex justify-end border-t border-gray-200 pt-3">
				<el-button @click="handleClose">{{ t('取消') }}</el-button>
				<el-button type="primary" @click="onSubmit" class="ml-2">
					{{ t('确定换货') }}
				</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import { postExchangeGoods } from '/@/api/fbm/selfOrder';
import { useMessage } from '/@/hooks/message';

const { t } = useI18n();
const changeProductRow = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/tableColumnExpand/expand-order-action/changeProductRow/index.vue'
		)
);

//父组件刷新数据方法
const reflashDataList = inject<() => void>('getDataList');

// 产品备注
const productRemark = ref('');
// 子组件 ref 数组
const productRowRefs = ref<any[]>([]);

// 设置子组件 ref
const setProductRowRef = (el: any, index: any) => {
	if (el) {
		productRowRefs.value[index] = el;
	}
};

//弹窗可见控制
const visible = ref(false);

// 定义换货数据的类型
interface ChangeProduct {
	id: number;
	imgUrl: string;
	count: number;
	skuCode: string;
	skuName: string;
	mskuCode: string;
	// 其他需要的字段...
}

interface ChangeOrderData {
	originalProductId: number; // 原始产品ID
	changeProducts: ChangeProduct[]; // 换货产品列表
}

// 存储所有换货订单数据
const allChangeOrders = reactive<Map<number, ChangeOrderData>>(new Map());

// 处理子组件数据更新
const handleChangeDataUpdate = (data: {
	originalProductId: number;
	changeProducts: ChangeProduct[];
}) => {
	const { originalProductId, changeProducts } = data;
	if (changeProducts.length === 0) {
		// 如果没有换货产品，移除该记录
		allChangeOrders.delete(originalProductId);
	} else {
		// 更新或添加换货数据
		allChangeOrders.set(originalProductId, {
			originalProductId,
			changeProducts: [...changeProducts], // 创建新数组避免引用问题
		});
	}
};

const props = defineProps({
	// 当前行数据
	currentRow: {
		type: Object,
		default: () => ({}),
	},
	title: { type: String, default: '换货' },
});

//提交换货表单
const onSubmit = async () => {
	const { selfOrderNo, orderItemVOList } = props.currentRow;

	if (!selfOrderNo || !orderItemVOList?.length) {
		ElMessage.error('订单信息不完整');
		return;
	}

	const finalChangeOrders = Array.from(allChangeOrders.values());

	if (finalChangeOrders.length === 0) {
		ElMessage.error('请选择换货产品');
		return;
	}
	// 组装 exchangeItems
	const exchangeItems = orderItemVOList
		.map((order: any) => {
			const changeData = allChangeOrders.get(order.id);
			if (!changeData || !changeData.changeProducts.length) return null;

			return {
				originalMskuCode: order.mskuCode,
				originalSkuCode: order.skuCode,
				originalOrderSkuId: order.id,
				newSkus: changeData.changeProducts.map((p) => ({
					skuCode: p.skuCode,
					mskuCode: p.mskuCode,
					orderQuantity: p.count,
				})),
			};
		})
		.filter(Boolean); // 去掉没有换货的项

	if (!exchangeItems.length) {
		ElMessage.error('请至少选择一个换货产品');
		return;
	}

	// ✅ 最终结构
	const changeOrderData = {
		selfOrderNo,
		exchangeItems,
		itemRemark: productRemark.value,
	};
	// TODO: 发请求
	try {
		const res = await postExchangeGoods(changeOrderData);
		if (res.code == 0) {
			ElMessage.success('换货成功');
			reflashDataList?.();
			handleClose();
		} else {
			useMessage().error(res.msg ?? t('操作失败'));
		}
	} catch (error: any) {
		useMessage().error(error?.msg || error?.message || t('网络错误'));
	}
};

//关闭弹窗时重置数据
const resetData = () => {
	allChangeOrders.clear();

	// 调用所有子组件的清空方法
	if (productRowRefs.value && productRowRefs.value.length > 0) {
		productRowRefs.value.forEach((child) => {
			if (child && typeof child.clearSelectedProducts === 'function') {
				child.clearSelectedProducts();
				child.handleCancel();
			}
		});
	}
};

const handleClose = () => {
	visible.value = false;
	resetData();
};

const handleOpen = async () => {
	visible.value = true;
};

defineExpose({
	handleOpen,
	handleClose,
});
</script>
