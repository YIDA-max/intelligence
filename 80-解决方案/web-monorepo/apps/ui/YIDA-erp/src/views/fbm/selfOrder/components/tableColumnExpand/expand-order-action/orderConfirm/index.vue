<script setup lang="ts">
import { ref, defineProps } from 'vue';
import { postOrderConfirm } from '/@/api/fbm/selfOrder/index';
import { useI18n } from 'vue-i18n';
import { useMessage } from '/@/hooks/message';
import { useResultDialog } from '/@/hooks/useResultDialog';
const { open } = useResultDialog();
const { t } = useI18n();
const props = defineProps({
	// 当前行数据
	currentRow: {
		type: Object,
		default: () => ({}),
	},
});
const getDataList = inject<any>('getDataList');
const dialogRef = ref<any | null>(null);
// 弹窗显示与否
const dialogVisible = ref(false);

/**
 * 初始化
 */
const init = () => {
	// 重置数据
};
/**
 * 确定
 */
const onSubmit = async () => {
	const params = {
		ids: [props.currentRow.id],
	};
	const res = await postOrderConfirm(params);
	if (res.code === 0) {
		// 判断是否有失败的记录
		if (res.data?.failCount > 0) {
			// 展示错误提示
			open({
				title: t('订单确认失败'),
				data: res.data,
			});
		} else if (res.data?.failCount === 0) {
			useMessage().success('操作成功');
			getDataList();
		}
		dialogVisible.value = false;
	}
};
/**
 * 打开弹窗方法
 * 供父组件调用
 */
const show = () => {
	dialogVisible.value = true;
};

/**
 * 关闭弹窗方法
 * 供父组件调用
 */
const hide = () => {
	dialogVisible.value = false;
};

// 暴露方法给父组件
defineExpose({
	show,
	hide,
});
</script>

<template>
	<el-dialog
		draggable
		ref="dialogRef"
		v-model="dialogVisible"
		:width="600"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:append-to-body="true"
		@open="init"
		@close="hide"
		:title="t('确定接单')"
		:style="{
			height: '200px',
		}"
	>
		<div
			:style="{
				height: '30px',
				overflow: 'auto',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'flex-start',
				justifyContent: 'center',
			}"
		>
			<span> 确认可接单? 订单可流转至后续环境 </span>
		</div>

		<template #footer>
			<div style="text-align: right">
				<el-button @click="hide">{{ t('取消') }}</el-button>

				<el-button type="primary" @click="onSubmit">{{ t('确定') }}</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<style lang="scss" scoped>
.dialog-container {
	padding: 0 20px;
	height: 60vh;
	overflow: auto;
}
.section-title {
	font-weight: bold;
	margin: 10px 0 10px 0;
	display: flex;
	align-items: center;
}
.section-bar {
	display: inline-block;
	width: 4px;
	height: 18px;
	background: #2e5cf6;
	border-radius: 2px;
	margin-right: 8px;
}
.mb18 {
	margin-bottom: 18px;
}
</style>
