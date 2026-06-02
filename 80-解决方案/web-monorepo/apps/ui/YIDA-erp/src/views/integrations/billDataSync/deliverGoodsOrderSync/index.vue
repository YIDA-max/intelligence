<!--
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-02-11 15:13:18
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-02-25 17:30:05
 * @FilePath: \qianyi-ui\src\views\integrations\billDataSync\deliverGoodsOrderSync\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<div class="layout-padding">
		<el-tabs v-model="activeName" type="border-card">
			<el-tab-pane
				:label="$t('未生成')"
				name="notGeneratedOrder"
				:style="{ height: '100%' }"
				v-if="auth('deliverGoodsOrderSync_notGeneratedOrder_view')"
			>
				<NotGeneratedOrder
					v-if="activeName === 'notGeneratedOrder'"
					@refresh-failed-count="getFailedOrderCount"
				/>
			</el-tab-pane>
			<el-tab-pane
				:label="$t('已生成')"
				name="generatedOrder"
				:style="{ height: '100%' }"
				v-if="auth('deliverGoodsOrderSync_generatedOrder_view')"
			>
				<GeneratedOrder v-if="activeName === 'generatedOrder'" />
			</el-tab-pane>
			<el-tab-pane
				name="generatedFailedOrder"
				:style="{ height: '100%' }"
				v-if="auth('deliverGoodsOrderSync_generatedFailedOrder_view')"
			>
				<template #label>
					生成失败 <span class="text-red-500">（{{ failedOrderCount }}）</span>
				</template>
				<GeneratedFailedOrder
					v-if="activeName === 'generatedFailedOrder'"
					@refresh-failed-count="getFailedOrderCount"
				/>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';

import { auth } from '/@/utils/authFunction';
import { getPlatformOrderKingdeeDocPage } from '/@/api/integrations/billDataSync/deliverGoodsOrderSync/index';
// 导入组件
const GeneratedOrder = defineAsyncComponent(
	() => import('./generatedOrder/index.vue')
);
const NotGeneratedOrder = defineAsyncComponent(
	() => import('./notGeneratedOrder/index.vue')
);
const GeneratedFailedOrder = defineAsyncComponent(
	() => import('./generatedFailedOrder/index.vue')
);
const activeName = ref('notGeneratedOrder');
const failedOrderCount = ref(0);
function getFailedOrderCount() {
	//todo 待对接接口
	getPlatformOrderKingdeeDocPage({
		current: 1,
		size: 10000,
		generateKingdeeDocStatuses: [2],
	}).then((res: any) => {
		failedOrderCount.value = res?.data.total || 0;
	});
}
onMounted(() => {
	//todo 待对接接口
	getFailedOrderCount();
});
</script>

<style lang="scss" scoped></style>
