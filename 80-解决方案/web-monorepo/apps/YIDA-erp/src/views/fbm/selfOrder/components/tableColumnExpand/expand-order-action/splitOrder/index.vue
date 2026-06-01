<template>
	<el-dialog
		v-model="visible"
		:close-on-click-modal="false"
		width="60%"
		class="min-h-[800px] custom-dialog"
		@close="handleClose"
		:append-to-body="true"
	>
		<!-- 自定义标题 -->
		<template #header>
			<div class="flex pb-3 border-b border-gray-200">
				<div class="font-semibold header-title">手动拆单</div>
			</div>
		</template>

		<!-- 内容区域 -->
		<div class="flex flex-col min-h-[600px]">
			<div class="p-2 mb-5 rounded-sm bg-cyan-200">
				注意：拆单时订单未选择发货仓+物流渠道，拆单后将执行仓库规则自动分配仓库物流：选择了发货仓+物流集道，则会执行审核规则
			</div>

			<div
				class="pl-2 mb-5 font-semibold text-black border-l-2 border-blue-400"
			>
				商品信息
			</div>

			<el-table
				:data="productList"
				v-loading="false"
				ref="productTableRef"
				row-key="id"
				class="w-full split-table"
				:header-cell-style="{ color: 'black', fontWeight: '600' }"
			>
				<el-table-column prop="id" width="300" label="订单产品">
					<template #default="{ row }">
						<div class="flex gap-4 info">
							<div class="flex justify-center img-box">
								<MrImg :src="row.imgUrl" />
							</div>
							<div
								style="
									display: flex;
									flex-direction: column;
									justify-content: center;
									align-items: flex-start;
									width: 100%;
								"
							>
								<div
									style="
										max-width: 100%;
										overflow: hidden;
										white-space: nowrap;
										text-overflow: ellipsis;
									"
								>
									{{ row.skuCode }}
								</div>
								<el-tooltip
									effect="dark"
									placement="top"
									:content="row.skuName"
								>
									<div class="ellipsis">
										{{
											row.skuName.length > 10
												? row.skuName.slice(0, 10) + '...'
												: row.skuName
										}}
									</div>
								</el-tooltip>
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="unitPrice" label="单价">
					<template #default="{ row }">
						$ {{ row.unitPrice || '---' }}
					</template>
				</el-table-column>
				<el-table-column prop="unitWeight" label="单个产品毛重">
					<template #default="{ row }">
						{{ row.itemGrossWeight || '---' }}
						{{ row.itemNetWeightUnit || 'kg' }}
					</template>
				</el-table-column>
				<el-table-column prop="unitSize" label="单个产品尺寸">
					<template #default="{ row }">
						{{ row.itemSpecLength }} * {{ row.itemSpecWidth }} *
						{{ row.itemSpecHeight }} {{ row.itemSpecUnit }}
					</template>
				</el-table-column>
				<el-table-column prop="orderQuantity" label="可拆分数量">
					<template #default="{ row }">
						{{ row.orderQuantity || 1 }}
					</template>
				</el-table-column>
				<el-table-column prop="splitNum" label="拆分数量">
					<template #default="{ row }">
						<el-input-number
							@change="computedLeft(row)"
							style="width: 120px"
							controls-position="right"
							v-model="row.splitNum"
							:min="0"
							:max="row.orderQuantity"
						/>
						<div v-if="row.errorMsg" class="text-red-500 text-xs mt-1 absolute">
							{{ row.errorMsg }}
						</div>
					</template>
				</el-table-column>
			</el-table>

			<!-- footer -->
		</div>
		<template #footer>
			<div class="flex justify-between pt-3 border-t border-gray-200">
				<div class="p-2 mb-5 rounded-sm">
					注意:输入拆分数量生成一个订单，剩余数量生成一个订单
				</div>
				<div>
					<el-button @click="handleClose">{{ t('取消') }}</el-button>
					<el-button type="primary" @click="onSubmit" class="ml-2">
						{{ t('确认') }}
					</el-button>
				</div>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import { postSplitOrder } from '/@/api/fbm/selfOrder/index';
import { useMessage } from '/@/hooks/message';

const { t } = useI18n();

const visible = ref(false);

interface OrderItem {
	id: number;
	orderQuantity: number;
	[key: string]: any; // 允许其他动态字段存在
}

// const props = defineProps({
// 	// 当前行数据
// 	currentRow: {
// 		type: Object,
// 		default: () => ({}),
// 	},
// 	selfOrderNo: {
// 		type: Number,
// 		required: true,
// 	},
// });

//父组件刷新数据方法
const getDataList = inject<() => void>('getDataList');

// 表单ref
const productTableRef = ref([]);

// 拆分列表
const productList = ref<OrderItem[]>([]);

//订单列表
const orderItemVOList = ref([]);

const selfOrderNo = ref();

//总可拆分数量

const totalEnableSplitNum = ref(0);

//初始化拆分数量
const handleOpen = (row: any) => {
	visible.value = true;
	orderItemVOList.value = row.orderItemVOList;
	selfOrderNo.value = row.selfOrderNo;
	// 封装productList，并给每个对象加上临时字段 splitNum
	productList.value = orderItemVOList.value.map((item: any) => ({
		...item,
		splitNum: 0, // 默认拆分数量为0，即不拆分
	}));

	totalEnableSplitNum.value = productList.value.reduce(
		(total: number, item: any) => {
			return total + (item.orderQuantity || 0);
		},
		0
	);
};

const computedLeft = function (rwo: any) {
	rwo.errorMsg = '';
	//计算目前总拆分数量
	const splitNumber = productList.value.reduce((total: number, item: any) => {
		return total + (item.splitNum || 0);
	}, 0);
	if (splitNumber >= totalEnableSplitNum.value) {
		rwo.splitNum = rwo.orderQuantity - 1;
	}
};

const handleClose = () => {
	visible.value = false;
};

const onSubmit = async () => {
	if (productList.value.filter((item: any) => item.splitNum > 0).length === 0) {
		ElMessage.error('拆分数量为必填项');
		return;
	}

	// 整合参数
	const splitParams = {
		selfOrderNo: selfOrderNo.value,
		splitOrderItemList: [
			productList.value
				.filter((item: any) => item.splitNum > 0) // 只保留 splitNum > 0 的项
				.map((item: any) => ({
					skuCode: item.skuCode,
					splitNum: item.splitNum,
					detailId: item.id,
				})),
		],
		handlerType: 'MANUAL_SPLIT_ORDER',
	};

	// 掉接口
	try {
		const res = await postSplitOrder(splitParams);
		if (res.code == 0) {
			ElMessage.success('拆分成功');
			getDataList?.();
		} else {
			useMessage().error(res.msg ?? t('操作失败'));
		}
	} catch (error: any) {
		useMessage().error(error?.msg || error?.message || t('网络错误'));
	} finally {
		handleClose();
	}
};

defineExpose({
	handleOpen,
	handleClose,
});
</script>

<style scoped>
.split-table {
	border: 1px solid rgba(0, 0, 0, 0.1);
	border-bottom: 0;
}
</style>
