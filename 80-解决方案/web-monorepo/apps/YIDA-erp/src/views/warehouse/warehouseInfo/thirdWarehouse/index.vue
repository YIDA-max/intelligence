<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-23 14:47:59
 * @LastEditors: 朱寒松 3136271519@qq.com
 * @LastEditTime: 2025-07-31 15:36:00
 * @FilePath: \qianyi-ui\src\views\warehouse\warehouseInfo\thirdWarehouse\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
// import { defineAsyncComponent, ref } from 'vue';
const SpInfo = defineAsyncComponent(() => import('./components/sp-info/index.vue'));
const ThirdWarehouseInfo = defineAsyncComponent(() => import('./components/third-warehouse-info/index.vue'));
const SpSku = defineAsyncComponent(() => import('./components/sp-sku/index.vue'));
// 服务商信息组件的引用
const spInfoRef = ref();
// 第三方仓库信息组件的引用
const thirdWarehouseInfoRef = ref();
// SKU配对组件的引用
const spSkuRef = ref();
// 当前选中的服务商
const spInfoValue = ref({});
// 当前是第三方仓库还是SKU配对
const radioValue = ref('thirdWarehouseInfo');

// 清空服务商信息
const clearSpInfo = () => {
	// 清空当前选中的服务商信息
	spInfoValue.value = {};
	// 调用服务商信息组件的方法清空服务商信息
	spInfoRef.value.tosSetSpInfoValue({});
};

// 服务商列表刷新数据
const refreshData = () => {
	// 刷新服务商信息列表
	spSkuRef.value?.resetData();
	thirdWarehouseInfoRef.value?.resetData();
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
		<div class="third-warehouse-info" v-if="radioValue === 'thirdWarehouseInfo'">
			<ThirdWarehouseInfo
				ref="thirdWarehouseInfoRef"
				:setRadioValue="
					(e:string) => {
						radioValue = e;
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
		<div class="third-warehouse-info" v-else-if="radioValue === 'spSku'">
			<SpSku
				ref="spSkuRef"
				:setRadioValue="
					(e:string) => {
						radioValue = e;
						spInfoRef.tosSetSpInfoValue(e);
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
	.third-warehouse-info {
		padding: 10px;
		width: calc(100% - 350px);
		height: 100%;
	}
}
</style>
