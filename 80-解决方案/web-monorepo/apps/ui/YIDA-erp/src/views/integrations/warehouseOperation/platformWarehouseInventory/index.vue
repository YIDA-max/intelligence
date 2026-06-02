<template>
	<div class="layout-padding">
		<el-tabs v-model="activeName" type="border-card">
			<!-- 未生成 -->
			<el-tab-pane
				:label="$t('未生成')"
				name="notGeneratedOrder"
				:style="{ height: '100%' }"
				v-if="auth('platformWarehouseInventory_notGeneratedOrder_view')"
			>
				<NotGeneratedOrder
					v-if="activeName === 'notGeneratedOrder'"
					@refresh-failed-count="refreshFailedCount"
				/>
			</el-tab-pane>

			<!-- 已生成 -->
			<el-tab-pane
				:label="$t('已生成')"
				name="generatedOrder"
				:style="{ height: '100%' }"
				v-if="auth('platformWarehouseInventory_generatedOrder_view')"
			>
				<GeneratedOrder v-if="activeName === 'generatedOrder'" />
			</el-tab-pane>

			<!-- 生成失败 - 带数量显示 -->
			<el-tab-pane
				name="generatedFailedOrder"
				:style="{ height: '100%' }"
				v-if="auth('platformWarehouseInventory_generatedFailedOrder_view')"
			>
				<template #label>
					{{ $t('生成失败') }}
					<span class="text-red-500">（{{ failedCount }}）</span>
				</template>
				<FailedGeneratedOrder
					v-if="activeName === 'generatedFailedOrder'"
					@refresh-failed-count="refreshFailedCount"
				/>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref } from 'vue';
import { auth } from '/@/utils/authFunction';
import { getPlatformWarehouseInventoryKingdeePage } from '/@/api/integrations/warehouseOperation/platformWarehouseInventory/index';

// 导入Tab组件
const NotGeneratedOrder = defineAsyncComponent(
	() => import('./notGeneratedOrder/index.vue')
);
const GeneratedOrder = defineAsyncComponent(
	() => import('./generatedOrder/index.vue')
);
const FailedGeneratedOrder = defineAsyncComponent(
	() => import('./generatedFailedOrder/index.vue')
);

const activeName = ref('notGeneratedOrder');
const failedCount = ref(0);

// 刷新生成失败数量
function refreshFailedCount() {
	getPlatformWarehouseInventoryKingdeePage({
		current: 1,
		size: 1,
		status: 2,
	})
		.then((res: any) => {
			failedCount.value = res?.data?.total || 0;
		})
		.catch(() => {
			failedCount.value = 0;
		});
}

onMounted(() => {
	refreshFailedCount();
});
</script>

<style lang="scss" scoped></style>
