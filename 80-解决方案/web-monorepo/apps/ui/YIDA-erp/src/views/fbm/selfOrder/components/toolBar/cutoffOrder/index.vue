<template>
	<el-dialog
		v-model="visible"
		:close-on-click-modal="false"
		width="50%"
		class="min-h-[500px] custom-dialog"
		@close="handleClose"
		:append-to-body="true"
	>
		<!-- 自定义标题 -->
		<template #header>
			<div class="flex pb-3 border-b border-gray-200">
				<div class="font-semibold header-title">截单</div>
			</div>
		</template>

		<!-- 内容区域 -->
		<div class="flex flex-col min-h-[400px]">
			<div
				style="background: #e8f3ff"
				class="flex flex-col gap-4 p-10 mb-8 rounded-sm"
			>
				<div>
					1.操作拦截后,将自动取消仓库订单(如已对接WMS,未对接的仓库请人工处理)
				</div>
				<div>
					2.订单操作截单成功后如要继续进行后续仓库作业请到【待发货审核-截单订单】重新操作
				</div>
			</div>

			<div class="flex gap-4">
				<div class="flex justify-end">
					<span class="text-red-500">* </span>截单原因 :
				</div>
				<el-radio-group
					v-model="selectReason"
					class="flex gap-4 mb-4 my-radio-group"
					size="large"
					fill="#6cf"
				>
					<el-radio-button
						v-for="item in reasonList"
						:key="item.code"
						:value="item.code"
						:label="item.text"
					/>
				</el-radio-group>
			</div>

			<div class="flex gap-4 mt-4 remark">
				<div
					style="text-align: right; min-width: 69px"
					class="whitespace-nowrap"
				>
					备注:
				</div>
				<el-input
					class="my-textarea-height"
					v-model="productRemark"
					:rows="6"
					:autosize="{ minRows: 2, maxRows: 10 }"
					type="textarea"
					placeholder="Please input"
				/>
			</div>
			<!-- footer -->
		</div>
		<div class="flex justify-end pt-3">
			<el-button @click="handleClose">{{ t('取消') }}</el-button>
			<el-button
				type="primary"
				:disabled="!enableSubmit"
				@click="onSubmit"
				class="ml-2"
			>
				{{ t('截单后转发货审核') }}
			</el-button>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { postOrderCutOff } from '/@/api/fbm/selfOrder/index';
import { useMessage } from '/@/hooks/message';
import { useResultDialog } from '/@/hooks/useResultDialog';
const { open } = useResultDialog();

//父组件刷新数据方法
const getDataList = inject<() => void>('getDataList');

//接收父组件传递的表格ref
const tableRef = inject('tableRef', ref(null));

const { t } = useI18n();

// 弹窗显示控制
const visible = ref(false);
// 截单ids列表
const ids = ref<number[]>([]);

// 原因列表
interface ReasonItem {
	code: number;
	text: string;
}
const reasonList = ref<ReasonItem[]>([]);

// 商品备注
const productRemark = ref('');

// 截单原因
const selectReason = ref('');

// 假数据（也可以作为默认数据，数据源应该是字典吧，现在先写个死的）
const fakeReasonList = [
	{
		code: 1,
		text: '取消订单',
	},
	{
		code: 2,
		text: '换地址',
	},
	{
		code: 3,
		text: '换货',
	},
	{
		code: 4,
		text: '需要拆单',
	},
	{
		code: 5,
		text: 'SKU未找到',
	},
	{
		code: 6,
		text: '其他',
	},
];

//是否可提交
const enableSubmit = computed(() => {
	return ids.value.length > 0 && selectReason.value !== '';
});

function handleOpen(
	selectedIds: number[],
	reasons: ReasonItem[] = fakeReasonList
) {
	ids.value = selectedIds;
	reasonList.value = reasons;
	visible.value = true;
	selectReason.value = '';
	productRemark.value = '';
}
const handleClose = () => {
	visible.value = false;
};
//提交
const onSubmit = async () => {
	// 组装请求参数
	const data = {
		ids: ids.value, // “ids 列表”
		code: selectReason.value, // 截单原因
		remark: productRemark.value, // 备注内容
	};

	try {
		const res = await postOrderCutOff(data);

		if (res.code === 0) {
			const failCount = res.data?.failCount ?? 0;

			if (failCount > 0) {
				//失败记录大于0时打开错误弹窗
				open({
					title: t('截单失败'),
					data: res.data,
				});
			} else {
				// 全部成功
				useMessage().success(t('操作成功'));
			}

			// 刷新列表数据
			getDataList?.();

			// 清除表格选中
			(tableRef as any)?.value?.clearCheckboxRow();
		} else {
			// res.code !== 0，异常
			useMessage().error(res.msg ?? t('操作失败'));
		}
	} catch (error: any) {
		// 接口调用异常
		useMessage().error(error?.msg || error?.message || t('网络错误'));
	} finally {
		//关闭弹窗
		visible.value = false;
	}
};

defineExpose({
	handleOpen,
});
</script>
<style scoped>
.my-textarea-height :deep(.el-textarea__inner) {
	min-height: 120px; /* 或你希望的高度 */
}
.my-radio-group :deep(.el-radio-button__inner) {
	border: 1px solid rgba(0, 0, 0, 0.1); /* 较淡灰色边框 */
	border-radius: 4px;
}
</style>
