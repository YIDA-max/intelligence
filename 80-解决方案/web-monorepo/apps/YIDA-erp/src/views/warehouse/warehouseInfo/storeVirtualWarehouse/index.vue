<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-23 14:47:59
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-31 10:08:33
 * @FilePath: \qianyi-ui\src\views\warehouse\warehouseInfo\storeVirtualWarehouse\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
// import { defineAsyncComponent, ref } from 'vue';
const SpInfo = defineAsyncComponent(
	() =>
		import(
			'/@/views/warehouse/warehouseInfo/storeVirtualWarehouse/components/sp-info/index.vue'
		)
);
const StoreVirtualWarehouseInfo = defineAsyncComponent(
	() =>
		import(
			'/@/views/warehouse/warehouseInfo/storeVirtualWarehouse/components/store-virtual-warehouse-info/index.vue'
		)
);
// 平台信息组件的引用
const spInfoRef = ref();
// 第三方仓库信息组件的引用
const storeVirtualWarehouseInfoRef = ref();
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
	storeVirtualWarehouseInfoRef.value?.resetData();
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
		<div class="store-virtual-warehouse-info">
			<StoreVirtualWarehouseInfo
				ref="storeVirtualWarehouseInfoRef"
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
	.store-virtual-warehouse-info {
		padding: 10px;
		width: calc(100% - 350px);
		height: 100%;
	}
}
</style>
