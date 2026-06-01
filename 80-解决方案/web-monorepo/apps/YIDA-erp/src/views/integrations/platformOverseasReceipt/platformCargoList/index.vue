<!--
 * @Description: 
-->
<!--
 * @Description: 
-->
<!--
 * @Description: 
-->
<template>
	<div class="layout-padding">
		<el-tabs v-model="activeName" type="border-card">
			<el-tab-pane
				:label="$t('未生成')"
				name="notGeneratedOrder"
				:style="{ height: '100%' }"
				v-if="auth('platformCargoList_notGeneratedOrder_view')"
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
				v-if="auth('platformCargoList_generatedOrder_view')"
			>
				<GeneratedOrder v-if="activeName === 'generatedOrder'" />
			</el-tab-pane>
			<el-tab-pane
				:label="$t('生成失败金蝶单据')"
				name="generatedFailedOrder"
				:style="{ height: '100%' }"
				v-if="auth('platformCargoList_generatedFailedOrder_view')"
			>
				<GeneratedFailedOrder
					v-if="activeName === 'generatedFailedOrder'"
					@refresh-failed-count="getFailedOrderCount"
				/>
				<template #label>
					生成失败 <span class="text-red-500">（{{ failedOrderCount }}）</span>
				</template>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';

import { auth } from '/@/utils/authFunction';
import { getGeneratedKingdeeBillPage } from '/@/api/integrations/platformOverseasReceipt/platformCargoList/notGeneratedOrder';
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
const failedOrderCount = ref(0);
function getFailedOrderCount() {
	//todo 待对接接口
	getGeneratedKingdeeBillPage({
		current: 1,
		size: 10000,
		billStatus: 2,
	}).then((res: any) => {
		failedOrderCount.value = res?.data.total || 0;
	});
}
onMounted(() => {
	//todo 待对接接口
	getFailedOrderCount();
});

const activeName = ref('notGeneratedOrder');
</script>

<style lang="scss" scoped></style>
