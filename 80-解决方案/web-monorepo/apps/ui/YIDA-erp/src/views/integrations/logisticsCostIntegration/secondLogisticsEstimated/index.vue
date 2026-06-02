<template>
	<div>
		<el-tabs v-model="activeName" type="border-card">
			<el-tab-pane
				label="未生成"
				name="notGeneratedOrder"
				v-if="
					auth(
						'logisticsCostIntegrationSecondLogisticsEstimated_notGeneratedOrder_view'
					)
				"
			>
				<NotGeneratedOrder
					v-if="activeName === 'notGeneratedOrder'"
					@refresh-failed-count="getFailedOrderCount"
				/>
			</el-tab-pane>
			<el-tab-pane
				label="已生成"
				name="generatedOrder"
				v-if="
					auth(
						'logisticsCostIntegrationSecondLogisticsEstimated_generatedOrder_view'
					)
				"
			>
				<GeneratedOrder v-if="activeName === 'generatedOrder'" />
			</el-tab-pane>
			<el-tab-pane
				name="generatedFailedOrder"
				v-if="
					auth(
						'logisticsCostIntegrationSecondLogisticsEstimated_generatedFailedOrder_view'
					)
				"
			>
				<template #label>
					生成失败
					<span class="text-red-500">（{{ failedOrderCount }}）</span>
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
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { auth } from '/@/utils/authFunction';
import { getSecondLogisticsEstimatedPage } from '/@/api/integrations/logisticsCostIntegration/secondLogisticsEstimated/index';

const NotGeneratedOrder = defineAsyncComponent(
	() => import('./notGeneratedOrder/index.vue')
);
const GeneratedOrder = defineAsyncComponent(
	() => import('./generatedOrder/index.vue')
);
const GeneratedFailedOrder = defineAsyncComponent(
	() => import('./generatedFailedOrder/index.vue')
);

const activeName = ref('notGeneratedOrder');
const failedOrderCount = ref(0);

function getFailedOrderCount() {
	getSecondLogisticsEstimatedPage({
		current: 1,
		size: 10000,
		status: 2,
	}).then((res: any) => {
		failedOrderCount.value = res?.data?.total || 0;
	});
}

onMounted(() => {
	getFailedOrderCount();
});
</script>

<style scoped lang="scss"></style>
