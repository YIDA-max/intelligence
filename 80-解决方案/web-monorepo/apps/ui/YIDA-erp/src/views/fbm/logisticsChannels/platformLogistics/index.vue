<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-11-17 10:18:35
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-12-01 16:09:59
 * @FilePath: \qianyi-ui\src\views\fbm\logisticsChannels\platformLogistics\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script lang="ts" setup>
import { ref } from 'vue';
import type { PlatformLogisticsProviderVO } from '/@/interface/views/fbm/logisticsChannel/platformLogistics/index';
const SpInfo = defineAsyncComponent(
	() =>
		import('/@/views/fbm/logisticsChannels/platformLogistics/sp-info/index.vue')
);
const PlatformWarehouseInfo = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/logisticsChannels/platformLogistics/platformInfo/index.vue'
		)
);
// 平台信息组件的引用
const spInfoRef = ref();
// 平台信息组件的引用
const platformWarehouseInfoRef = ref();

// 当前选中的站点
const spInfoValue = ref<PlatformLogisticsProviderVO>({});

// 切换站点
const setSpInfoValue = (e: any) => {
	spInfoValue.value = e;
};
</script>
<template>
	<div class="content-area">
		<div class="third-warehouse">
			<div class="sp-info">
				<SpInfo ref="spInfoRef" :setSpInfoValue="setSpInfoValue" />
			</div>
			<div class="platform-warehouse-info mt10 ml10">
				<PlatformWarehouseInfo
					ref="platformWarehouseInfoRef"
					:currentSpInfo="spInfoValue"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.content-area {
	display: flex;
	height: 100%;
	flex-direction: column;
}
.platform-tab {
	height: 50px;
}
.third-warehouse {
	display: flex;
	flex-direction: row;
	background-color: #f5f5f5;
	height: calc(100% - 50px);
	.sp-info {
		width: 350px;
		overflow-y: auto;
	}
	.platform-warehouse-info {
		width: calc(100% - 370px);
	}
}
</style>
