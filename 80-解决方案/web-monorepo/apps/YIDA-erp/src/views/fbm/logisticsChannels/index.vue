<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-11-06 17:39:46
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-12-23 16:18:25
 * @FilePath: \qianyi-ui\src\views\fbm\logisticsChannels\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script lang="ts" setup>
import { ref } from 'vue';
import { auth } from '/@/utils/authFunction';
// 动态引入组件
// 三方仓物流
const ThirdWarehouseLogistics = defineAsyncComponent(
	() =>
		import('/@/views/fbm/logisticsChannels/thirdWarehouseLogistics/index.vue')
);
// 平台仓配送
const PlatformWarehouseDelivery = defineAsyncComponent(
	() =>
		import('/@/views/fbm/logisticsChannels/platformWarehouseDelivery/index.vue')
);
// 平台物流
const PlatformLogistics = defineAsyncComponent(
	() => import('/@/views/fbm/logisticsChannels/platformLogistics/index.vue')
);

const activeName = ref(
	auth('logisticsChannels_view')
		? 'thirdWarehouseLogistics'
		: 'platformWarehouseDelivery'
);
</script>
<template>
	<div class="layout-padding">
		<el-tabs v-model="activeName" type="border-card">
			<el-tab-pane
				:label="$t('三方仓物流')"
				name="thirdWarehouseLogistics"
				:style="{ height: '100%' }"
				v-if="auth('warehouse_show')"
			>
				<ThirdWarehouseLogistics
					v-if="activeName === 'thirdWarehouseLogistics'"
				/>
			</el-tab-pane>
			<el-tab-pane
				:label="$t('平台仓配送')"
				name="platformWarehouseDelivery"
				:style="{ height: '100%' }"
				v-if="auth('thirdWarehouse_show')"
			>
				<PlatformWarehouseDelivery
					v-if="activeName === 'platformWarehouseDelivery'"
				/>
			</el-tab-pane>
			<el-tab-pane
				:label="$t('平台物流')"
				name="platformLogistics"
				:style="{ height: '100%' }"
				v-if="auth('warehouse_show')"
			>
				<PlatformLogistics v-if="activeName === 'platformLogistics'" />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<style scoped lang="scss">
:deep(.el-tabs) {
	height: 100%;
}
</style>
