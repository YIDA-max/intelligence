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
					>{{ $t('提交') }}</el-button
				>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { postFirstLegTransfer } from '/@/api/materialFlow/orderContainer/index';
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

const onSubmit = async () => {
	// 开启加载状态
	loading.value = true;
	try {
		const res = await postFirstLegTransfer({
			id: props.currentRow.id,
		});
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
