<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-23 14:47:59
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-09-18 15:34:33
 * @FilePath: \qianyi-ui\src\views\warehouse\warehouseInfo\platformChannelWarehouse\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
// import { defineAsyncComponent, ref } from 'vue';
const SpInfo = defineAsyncComponent(() => import('/@/views/warehouse/warehouseInfo/platformChannelWarehouse/components/sp-info/index.vue'));
const PlatformChannelWarehouseInfo = defineAsyncComponent(
	() => import('/@/views/warehouse/warehouseInfo/platformChannelWarehouse/components/platform-channel-warehouse-info/index.vue')
);
// 平台信息组件的引用
const spInfoRef = ref();
// 第三方仓库信息组件的引用
const platformChannelWarehouseInfoRef = ref();
// 当前选中的平台
const spInfoValue = ref({});

// 清空平台信息
const clearSpInfo = () => {
	// 清空当前选中的平台信息
	spInfoValue.value = {};
	// 调用平台信息组件的方法清空平台信息
	spInfoRef.value.tosSetSpInfoValue({});
};

// 平台列表刷新数据
const refreshData = () => {
	platformChannelWarehouseInfoRef.value?.resetData();
};
</script>

<template>
	<div class="third-warehouse">
		<div class="sp-info">
			<SpInfo
				ref="spInfoRef"
				:setSpInfoValue="(e:any) => { spInfoValue = e; }"
				:refreshData="
					() => {
						refreshData();
					}
				"
			/>
		</div>
		<div class="platform-channel-warehouse-info">
			<PlatformChannelWarehouseInfo
				ref="platformChannelWarehouseInfoRef"
				:setRadioValue="
					(e:string) => {
						
					}
				"
				:clearSpInfo="clearSpInfo"
				:currentSpInfo="spInfoValue"
				:setSpInfo="
					(e:any) => {
						spInfoValue = e;
						spInfoRef.tosSetSpInfoValue(e);
					}"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
.third-warehouse {
	height: 100%;
	display: flex;
	background-color: #f5f5f5;
	.sp-info {
		width: 350px;
		height: 100%;
	}
	.platform-channel-warehouse-info {
		padding: 10px;
		width: calc(100% - 350px);
		height: 100%;
	}
}
</style>
