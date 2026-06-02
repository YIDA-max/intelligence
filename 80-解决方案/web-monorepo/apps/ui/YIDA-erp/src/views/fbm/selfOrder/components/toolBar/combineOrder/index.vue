<template>
	<el-dialog
		v-model="visible"
		:close-on-click-modal="false"
		width="60%"
		class="custom-dialog"
		@close="handleClose"
		:append-to-body="true"
	>
		<!-- 自定义标题 -->
		<template #header>
			<div class="flex pb-3 border-b border-gray-200">
				<div class="font-semibold header-title">合单</div>
			</div>
		</template>

		<div class="flex flex-col h-full">
			<!-- 顶部提示信息（固定） -->
			<div class="p-2 mb-5 rounded-sm bg-cyan-200" v-if="headerType === 0">
				注意：订单平台、订单接入方式、订单店铺、收件人信息（姓名、电话、邮箱）、收件地址信息（国家、省/州、城市、区/县、详细地址）全部一样，才支持订单合并。
				<div class="font-semibold text-red-500" v-if="enableCombine">
					当前选择的订单中存在信息不一致，请确认
				</div>
			</div>
			<div class="p-2 mb-5 rounded-sm bg-cyan-200" v-if="headerType === 1">
				确认和单
			</div>

			<div
				class="pl-2 mb-5 font-semibold text-black border-l-2 border-blue-400"
			>
				商品信息
			</div>

			<!-- 中间表格（flex-1，内部滚动） -->
			<el-table
				:data="productList"
				v-loading="false"
				ref="productTableRef"
				row-key="id"
				class="w-full split-table flex-1"
				:header-cell-style="{ color: 'black', fontWeight: '600' }"
				native-scrollbar
			>
				<el-table-column v-if="false" prop="id" label="订单id">
					<template #default="{ row }">
						<div class="flex gap-4 info">
							{{ row.id || '---' }}
						</div>
					</template>
				</el-table-column>
				<el-table-column label="平台单号">
					<template #default="{ row }">
						<div style="white-space: nowrap">
							<MrTextEllipsis :text="row.platformOrderNo" :max-length="20" />
						</div>
					</template>
				</el-table-column>
				<el-table-column label="订单接入方式" show-overflow-tooltip>
					<template #default="{ row }">
						<div
							:class="{
								'text-red-500': !checkCombine(
									row.orderIntegrationMethod,
									firstData?.orderIntegrationMethod
								),
							}"
						>
							{{ row.orderIntegrationMethod || '---' }}
						</div>
					</template>
				</el-table-column>
				<el-table-column label="平台" show-overflow-tooltip>
					<template #default="{ row }">
						<div
							:class="{
								'text-red-500': !checkCombine(
									row.platformChannelText,
									firstData?.platformChannelText
								),
							}"
						>
							{{ row.platformChannelText || '---' }}
						</div>
					</template>
				</el-table-column>
				<el-table-column label="店铺">
					<template #default="{ row }">
						<div
							:class="{
								'text-red-500': !checkCombine(
									row.storeName,
									firstData?.storeName
								),
							}"
						>
							{{ row.storeName || '---' }}
						</div>
					</template>
				</el-table-column>
				<el-table-column width="200" prop="buyerInfoVO" label="收件人信息">
					<template #default="{ row }">
						<div
							:class="{
								'text-red-500': !checkCombine(
									row.buyerInfoVO.recipientName,
									firstData?.buyerInfoVO?.recipientName
								),
							}"
						>
							姓名：
							<MrTextEllipsis
								:text="row.buyerInfoVO.recipientName"
								:max-length="20"
								emptyText="---"
							/>
						</div>
						<div
							:class="{
								'text-red-500': !checkCombine(
									row.buyerInfoVO.recipientPhone,
									firstData?.buyerInfoVO?.recipientPhone
								),
							}"
						>
							电话：
							<MrTextEllipsis
								:text="row.buyerInfoVO.recipientPhone"
								:max-length="20"
								emptyText="---"
							/>
						</div>
						<div
							:class="{
								'text-red-500': !checkCombine(
									row.buyerInfoVO.recipientEmail,
									firstData?.buyerInfoVO?.recipientEmail
								),
							}"
						>
							邮箱：
							<MrTextEllipsis
								:text="row.buyerInfoVO.recipientEmail"
								:max-length="20"
								emptyText="---"
							/>
						</div>
					</template>
				</el-table-column>
				<el-table-column
					width="250"
					prop="addressInfoVO"
					label="收件人地址信息"
				>
					<template #default="{ row }">
						<div
							class="flex"
							:class="{
								'text-red-500': !checkCombine(
									row.buyerInfoVO.recipientDetailAddress,
									firstData?.buyerInfoVO?.recipientDetailAddress
								),
							}"
						>
							详细地址：
							<MrTextEllipsis
								:text="row.buyerInfoVO.recipientDetailAddress"
								:max-length="18"
								emptyText="---"
							/>
						</div>
						<div
							:class="{
								'text-red-500': !checkCombine(
									row.buyerInfoVO.recipientCity,
									firstData?.buyerInfoVO?.recipientCity
								),
							}"
						>
							城市：
							<MrTextEllipsis
								:text="row.buyerInfoVO.recipientCity"
								:max-length="18"
								emptyText="---"
							/>
						</div>
						<div
							:class="{
								'text-red-500': !checkCombine(
									row.buyerInfoVO.recipientState,
									firstData?.buyerInfoVO?.recipientState
								),
							}"
						>
							省/州：
							<MrTextEllipsis
								:text="row.buyerInfoVO.recipientState"
								:max-length="18"
								emptyText="---"
							/>
						</div>
						<div
							:class="{
								'text-red-500': !checkCombine(
									row.buyerInfoVO.recipientPostcode,
									firstData?.buyerInfoVO?.recipientPostcode
								),
							}"
						>
							邮编：
							<MrTextEllipsis
								:text="row.buyerInfoVO.recipientPostcode"
								:max-length="18"
								emptyText="---"
							/>
						</div>
						<div
							:class="{
								'text-red-500': !checkCombine(
									row.buyerInfoVO.recipientCountry,
									firstData?.buyerInfoVO?.recipientCountry
								),
							}"
						>
							国家：
							<MrTextEllipsis
								:text="row.buyerInfoVO.recipientCountry"
								:max-length="18"
								emptyText="---"
							/>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<template #footer>
			<!-- 底部操作按钮（固定） -->
			<div class="flex justify-end pt-3 border-t border-gray-200">
				<el-button @click="handleClose">{{ t('取消') }}</el-button>
				<el-button
					type="primary"
					:disabled="enableCombine"
					@click="onSubmit"
					class="ml-2"
				>
					{{ t('确认') }}
				</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { postMergeOrder } from '/@/api/fbm/selfOrder/index';
import { useMessage } from '/@/hooks/message';

const { t } = useI18n();
const enableCombine = ref(false);

//第一条数据作为对比
const firstData = ref<any>(null);

// 判断是否可以合单
const checkCombine = (date: string, compareDate: string) => {
	if (date === compareDate) {
		return true;
	}
	return false;
};
// 弹窗引用
const visible = ref(false);

//title类型
const headerType = ref(0);

const productList = ref<any[]>([]);

const handleClose = () => {
	visible.value = false;
	// resetData();
};

//父组件刷新数据方法
const getDataList = inject<() => void>('getDataList');

//接收父组件传递的表格ref
const tableRef = inject('tableRef', ref(null));

// 初始化产品
const initSelectedProducts = (rows: any[], type: number) => {
	productList.value = rows.map((item) => ({
		id: item.id, //订单号
		platformOrderNo: item.platformOrderNo, //平台订单号
		orderIntegrationMethod: item.orderIntegrationMethod, //订单接入方式
		platformChannelText: item.platformChannelText, //平台
		storeName: item.storeName, //店铺
		buyerInfoVO: item.buyerInfoVO, //收件人信息
		// addressInfoVO: item.addressInfoVO//收件地址信息
	}));
	//存储第一条数据
	firstData.value = productList.value[0];
	//判断是否可以合单
	enableCombine.value = productList.value.some(
		(item) =>
			item.orderIntegrationMethod !== firstData.value.orderIntegrationMethod ||
			item.platformChannelText !== firstData.value.platformChannelText ||
			item.storeName !== firstData.value.storeName ||
			item.buyerInfoVO.recipientName !==
				firstData.value.buyerInfoVO.recipientName ||
			item.buyerInfoVO.recipientPhone !==
				firstData.value.buyerInfoVO.recipientPhone ||
			item.buyerInfoVO.recipientEmail !==
				firstData.value.buyerInfoVO.recipientEmail ||
			item.buyerInfoVO.address !== firstData.value.buyerInfoVO.address ||
			item.buyerInfoVO.city !== firstData.value.buyerInfoVO.city ||
			item.buyerInfoVO.province !== firstData.value.buyerInfoVO.province ||
			item.buyerInfoVO.country !== firstData.value.buyerInfoVO.country
	);

	headerType.value = type;
};

//提交
const onSubmit = async () => {
	//过滤数据，只要每一项的selfOrderNo，订单号列表
	const ids = productList.value.map((item) => item.id);
	try {
		const res = await postMergeOrder({ ids });
		if (res.code === 0) {
			getDataList?.();
			(tableRef as any)?.value?.clearCheckboxRow();
			useMessage().success('合单成功');
		} else {
			useMessage().error(res.msg ?? t('操作失败'));
		}
	} catch (error: any) {
		useMessage().error(error?.msg || error?.message || t('网络错误'));
	} finally {
		//关闭弹窗
		handleClose();
	}
};

const handleOpen = async (rows: any, type: number = 0) => {
	initSelectedProducts(rows, type);
	visible.value = true;
};
defineExpose({
	handleOpen,
});
</script>

<style scoped>
.split-table {
	border: 1px solid rgba(0, 0, 0, 0.1);
	border-bottom: 0;
}
:deep(.el-dialog) {
	max-height: 80vh;
	display: flex;
	flex-direction: column;
}
:deep(.el-dialog__body) {
	flex: 1;
	overflow: hidden;
	padding-bottom: 0;
	display: flex;
	flex-direction: column;
}
</style>
