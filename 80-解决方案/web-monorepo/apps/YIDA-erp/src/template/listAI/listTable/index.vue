<template>
	<div class="layout-padding">
		<el-tabs v-model="activeName" type="border-card">
			<!-- Tab页示例1 -->
			<el-tab-pane
				:label="$t('Tab页1')"
				name="tab1"
				:style="{ height: '100%' }"
				v-if="auth('moduleKey_tab1_view')"
			>
				<Tab1Component
					v-if="activeName === 'tab1'"
					@refresh-count="refreshCount"
				/>
			</el-tab-pane>

			<!-- Tab页示例2 -->
			<el-tab-pane
				:label="$t('Tab页2')"
				name="tab2"
				:style="{ height: '100%' }"
				v-if="auth('moduleKey_tab2_view')"
			>
				<Tab2Component v-if="activeName === 'tab2'" />
			</el-tab-pane>

			<!-- Tab页示例3 - 带数量显示 -->
			<el-tab-pane
				name="tab3"
				:style="{ height: '100%' }"
				v-if="auth('moduleKey_tab3_view')"
			>
				<template #label>
					Tab页3 <span class="text-red-500">（{{ count }}）</span>
				</template>
				<Tab3Component
					v-if="activeName === 'tab3'"
					@refresh-count="refreshCount"
				/>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref } from 'vue';
import { auth } from '/@/utils/authFunction';
// 导入API
// import { getCountApi } from '/@/api/xxx/xxx/xxx/index';

// 导入Tab组件
const Tab1Component = defineAsyncComponent(() => import('./tab1/index.vue'));
const Tab2Component = defineAsyncComponent(() => import('./tab2/index.vue'));
const Tab3Component = defineAsyncComponent(() => import('./tab3/index.vue'));

const activeName = ref('tab1');
const count = ref(0);

// 刷新数量
function refreshCount() {
	// 调用接口获取数量
	// getCountApi({
	// 	current: 1,
	// 	size: 10000,
	// 	// 其他查询参数
	// }).then((res: any) => {
	// 	count.value = res?.data.total || 0;
	// });
}

onMounted(() => {
	refreshCount();
});
</script>

<style lang="scss" scoped></style>
