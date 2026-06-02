<!--
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-02-27 13:53:24
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-03-03 17:22:46
 * @FilePath: \qianyi-ui\src\views\integrations\shippingIntegration\shippingLoss\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<div>
		<el-tabs v-model="activeName" type="border-card">
			<el-tab-pane
				:label="$t('未生成')"
				name="notGeneratedOrder"
				:style="{ height: '100%' }"
				v-if="auth('deliveryReturnPlatformReturn_notGeneratedOrder_view')"
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
				v-if="auth('deliveryReturnPlatformReturn_generatedOrder_view')"
			>
				<GeneratedOrder v-if="activeName === 'generatedOrder'" />
			</el-tab-pane>
			<el-tab-pane
				name="generatedFailedOrder"
				:style="{ height: '100%' }"
				v-if="auth('deliveryReturnPlatformReturn_generatedFailedOrder_view')"
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
import { ref, onMounted } from 'vue';
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
import { getPlatformReturnPage } from '/@/api/integrations/deliveryReturn/platformReturn/index';
import { auth } from '/@/utils/authFunction';

const activeName = ref('notGeneratedOrder');
const failedOrderCount = ref(0);

function getFailedOrderCount() {
	getPlatformReturnPage({
		current: 1,
		size: 1,
		status: 2,
	}).then((res: any) => {
		failedOrderCount.value = res?.data.total || 0;
	});
}

onMounted(() => {
	getFailedOrderCount();
});
</script>

<style scoped lang="scss"></style>
