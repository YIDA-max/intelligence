<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-23 17:39:58
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-11-27 15:13:33
 * @FilePath: \qianyi-ui\src\views\warehouse\warehouseInfo\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script lang="ts" setup>
import { ref } from 'vue';
import { auth } from '/@/utils/authFunction';
// 动态引入组件
// 自营仓
const Warehouse = defineAsyncComponent(
	() => import('/@/views/warehouse/warehouseInfo/warehouse/index.vue')
);
// 三方仓
const ThirdWarehouse = defineAsyncComponent(
	() => import('/@/views/warehouse/warehouseInfo/thirdWarehouse/index.vue')
);
// 平台仓
const PlatformChannelWarehouse = defineAsyncComponent(
	() =>
		import(
			'/@/views/warehouse/warehouseInfo/platformChannelWarehouse/index.vue'
		)
);
// 店铺虚拟仓
const StoreVirtualWarehouse = defineAsyncComponent(
	() =>
		import('/@/views/warehouse/warehouseInfo/storeVirtualWarehouse/index.vue')
);

const activeName = ref(
	auth('thirdWarehouse_show')
		? 'thirdWarehouse'
		: auth('warehouse_show')
		? 'warehouse'
		: 'platformChannelWarehouse'
);
</script>
<template>
	<div class="layout-padding">
		<el-tabs v-model="activeName" type="border-card">
			<el-tab-pane
				:label="$t('自营仓')"
				name="warehouse"
				:style="{ height: '100%' }"
				v-if="auth('warehouse_show')"
			>
				<Warehouse v-if="activeName === 'warehouse'" />
			</el-tab-pane>
			<el-tab-pane
				:label="$t('三方仓')"
				name="thirdWarehouse"
				:style="{ height: '100%' }"
				v-if="auth('thirdWarehouse_show')"
			>
				<ThirdWarehouse v-if="activeName === 'thirdWarehouse'" />
			</el-tab-pane>
			<el-tab-pane
				:label="$t('平台仓')"
				name="platformChannelWarehouse"
				:style="{ height: '100%' }"
				v-if="auth('platformChannelWarehouse_show')"
			>
				<PlatformChannelWarehouse
					v-if="activeName === 'platformChannelWarehouse'"
				/>
			</el-tab-pane>
			<el-tab-pane
				:label="$t('店铺虚拟仓')"
				name="storeVirtualWarehouse"
				:style="{ height: '100%' }"
				v-if="auth('storeVirtualWarehouse_show')"
			>
				<StoreVirtualWarehouse v-if="activeName === 'storeVirtualWarehouse'" />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<style scoped lang="scss">
:deep(.el-tabs) {
	height: 100%;
}
</style>
