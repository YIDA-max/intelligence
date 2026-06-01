<script setup lang="ts">
import { ref, defineAsyncComponent, nextTick, computed } from 'vue';
import { ElMessageBox } from 'element-plus';
import { addInit, editInit, copyInit } from './utils/index';
import { useWaitForRefsReady } from '/@/hooks/nextTick';
import { useMessage } from '/@/hooks/message';
import {
	postOrderSave,
	postOrderUpdate,
} from '/@/api/customerService/workOrder';
// 基本信息
const BaseInfo = defineAsyncComponent(
	() => import('./components/base-info.vue')
);
// 订单信息
const OrderInfo = defineAsyncComponent(
	() => import('./components/order-info.vue')
);
// 原因描述
const DescriptionInfo = defineAsyncComponent(
	() => import('./components/description-info.vue')
);
// 附件/备注
const FileRemark = defineAsyncComponent(
	() => import('./components/file-remark.vue')
);
// 动态模块;
const DynamicModules = defineAsyncComponent(
	() => import('./components/dynamic-modules.vue')
);

// 状态选项配置
const statusOptions = [
	{ label: '处理中', value: 2 },
	{ label: '处理异常', value: 3 },
	{ label: '已解决', value: 4 },
];
// 待提交
const currentStatus = ref(2);

// 获取当前状态的文案
const currentStatusLabel = computed(() => {
	const option = statusOptions.find((opt) => opt.value === currentStatus.value);
	return option ? option.label : '';
});

/**
 * 切换提交状态
 * @param {number} command - 状态值
 */
const handleCommand = (command: number) => {
	currentStatus.value = command;
};
/**
 * 接收父组件传递的属性
 * @property {string} dialogType - 弹窗类型：add | edit | copy | detail
 * @property {string} title - 弹窗标题
 */

const props = defineProps({
	dictMap: {
		type: Object,
		default: () => ({}),
	},
	dialogType: {
		type: String,
		default: 'add',
	},
	title: {
		type: String,
		default: '',
	},
	currentRow: {
		type: Object,
		default: () => ({}),
	},
	storeData: {
		type: Object,
		default: () => ({}),
	},
});

/**
 * 定义事件
 * @event success - 操作成功时触发，传递提交的数据
 */
const emit = defineEmits(['success']);
const visible = ref(false);

// 模块组件 refs
const baseInfoRef = ref();
const orderInfoRef = ref();
const descInfoRef = ref();
const modulesRef = ref();

const fileRemarkRef = ref();

const loading = ref(false);

/**
 * 打开弹窗并初始化数据
 */
const handleOpen = async () => {
	loading.value = true;
	try {
		if (props.dialogType === 'add') {
			await nextTick();
			await addInit(
				baseInfoRef as any,
				orderInfoRef as any,
				descInfoRef as any,
				fileRemarkRef as any,
				modulesRef as any
			);
			visible.value = true;
		} else if (props.dialogType === 'edit' || props.dialogType === 'detail') {
			visible.value = true;

			// 等待所有子组件挂载完成
			await useWaitForRefsReady([
				baseInfoRef as any,
				orderInfoRef as any,
				descInfoRef as any,
				fileRemarkRef as any,
				modulesRef as any,
			]);

			await editInit(
				baseInfoRef as any,
				orderInfoRef as any,
				descInfoRef as any,
				fileRemarkRef as any,
				modulesRef as any,
				props.currentRow
			);
		} else if (props.dialogType === 'copy') {
			visible.value = true;
			await useWaitForRefsReady([
				baseInfoRef as any,
				orderInfoRef as any,
				descInfoRef as any,
				fileRemarkRef as any,
				modulesRef as any,
			]);
			await copyInit(
				baseInfoRef as any,
				orderInfoRef as any,
				descInfoRef as any,
				fileRemarkRef as any,
				modulesRef as any,
				props.currentRow
			);
		} else {
			visible.value = true;
		}
	} finally {
		loading.value = false;
	}
};

/**
 * 关闭弹窗
 */
const handleClose = () => {
	visible.value = false;
};

/**
 * 提交表单
 */
const handleSubmit = async () => {
	try {
		// 1. 获取基本信息，以提取工单类型 (orderType: 1售前，2售后)
		const baseData = await baseInfoRef.value.getData();
		// 取消售前 (orderType === 1) 的 SKU 必填校验，需要在触发其他组件校验时传参
		const [orderData, descData, fileRemarkData, actionInfo] = await Promise.all(
			[
				orderInfoRef.value.getData(baseData.orderType),
				descInfoRef.value.getData(),
				fileRemarkRef.value.getData(),
				modulesRef.value.getData(),
			]
		);

		// 确认提交
		try {
			if (currentStatus.value === 4) {
				await ElMessageBox.confirm(
					`确定要提交并发起状态变更为【${currentStatusLabel.value}】吗？`,
					'提示',
					{
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					}
				);
			}
		} catch {
			return;
		}

		loading.value = true;

		// 2. 组装最终数据 (Request DTO)
		const finalData = {
			...baseData, // orderType
			...orderData, // relatedOrderNo, country, platformChannelCode, storeId, purchaseDate, buyerName, buyerPhone, buyerEmail, skuList
			...descData, // descriptions, tagIds
			...fileRemarkData, // baseAttachments, remark
			...actionInfo, // Flatten dynamic module data: refundAction, returnAction, etc.
			processStatus: currentStatus.value, // 使用下拉选择的状态
		};
		let api;
		if (props.dialogType === 'edit' || props.dialogType === 'detail') {
			finalData.id = props.currentRow.id;
			finalData.orderNo = props.currentRow.orderNo;
			api = postOrderUpdate;
		} else {
			api = postOrderSave;
		}
		const res = await api(finalData);

		// TODO: Call API (e.g., createOrder(finalData))
		if (res.code === 0) {
			emit('success', finalData);
			visible.value = false;
			useMessage().success('操作成功');
		}
	} catch (error: any) {
		useMessage().error(error);
	} finally {
		loading.value = false;
	}
};

defineExpose({
	handleOpen,
	handleClose,
});
</script>

<template>
	<el-dialog
		v-model="visible"
		:title="props.title"
		width="95%"
		:close-on-click-modal="false"
		@close="handleClose"
		destroy-on-close
	>
		<div class="p-4" v-loading="loading">
			<!-- 1. 基本信息 -->
			<BaseInfo
				ref="baseInfoRef"
				:dialogType="dialogType"
				:dictMap="props.dictMap"
			/>

			<!-- 2. 订单信息 -->
			<OrderInfo
				ref="orderInfoRef"
				:dialogType="dialogType"
				:dictMap="props.dictMap"
			/>

			<!-- 3. 原因/描述 -->
			<DescriptionInfo
				ref="descInfoRef"
				:dialogType="dialogType"
				:dictMap="props.dictMap"
			/>

			<!-- 4. 附件/备注 -->
			<FileRemark
				ref="fileRemarkRef"
				:dialogType="dialogType"
				:dictMap="props.dictMap"
			/>

			<!-- 5. 动态模块 -->
			<DynamicModules
				ref="modulesRef"
				:dialogType="dialogType"
				:dictMap="props.dictMap"
			/>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">取消</el-button>
				<el-dropdown class="ml10" @command="handleCommand">
					<el-button type="primary" @click="handleSubmit" :loading="loading">
						提交为{{ currentStatusLabel }}
						<el-icon class="el-icon--right">
							<arrow-down />
						</el-icon>
					</el-button>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item
								v-for="item in statusOptions"
								:key="item.value"
								:command="item.value"
								:disabled="currentStatus === item.value"
							>
								{{ item.label }}
							</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</span>
		</template>
	</el-dialog>
</template>

<style scoped>
:deep(.el-form-item) {
	margin-bottom: 18px;
}
</style>
