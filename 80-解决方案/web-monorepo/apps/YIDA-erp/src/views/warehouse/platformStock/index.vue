<template>
	<div class="layout-padding platform-stock">
		<div class="sp-info">
			<SpInfo
				ref="spInfoRef"
				:setSpInfoValue="setSpInfoValue"
				:spInfoArr="spInfoArr"
			/>
		</div>
		<div class="platform-stock-info">
			<PlatformStockInfo
				ref="platformStockInfo"
				:platformAuthList="platformAuthList"
				:currentSpInfo="spInfoValue"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { auth } from '/@/utils/authFunction';

const SpInfo = defineAsyncComponent(
	() => import('./components/sp-info/index.vue')
);
const PlatformStockInfo = defineAsyncComponent(
	() => import('./components/platform-stock-info/index.vue')
);

// 服务商信息组件的引用
const spInfoRef = ref();
// 第三方仓库信息组件的引用
const platformStockInfo = ref();

// 当前选中的平台仓
const spInfoValue = ref({});

// 设置平台仓信息的方法
const setSpInfoValue = (newSpInfo: any) => {
	// 使用Object.assign确保响应式更新
	Object.assign(spInfoValue.value, newSpInfo);
};

const platformAuthList = computed(() => {
	return spInfoArr.value.filter((item: any) => auth(item.auth));
});

//平台仓列表
const spInfoArr = ref([
	{
		id: 'Amazon',
		spName: 'Amazon',
		auth: 'amazon_view',
	},
	{
		id: 'Tiktok自运营',
		spName: 'Tiktok自运营',
		auth: 'tiktok_view',
	},
	{
		id: 'Walmart',
		spName: 'Walmart',
		auth: 'walmart_view',
	},
	{
		id: 'Cdiscount',
		spName: 'Cdiscount',
		auth: 'cdiscount_view',
	},
]);
</script>

<style scoped lang="scss">
.platform-stock {
	height: 100%;
	display: flex;
	flex-direction: row;
	background-color: #f5f5f5;

	.sp-info {
		width: 200px;
	}
	.platform-stock-info {
		padding: 10px;
		width: calc(100% - 200px);
		height: 100%;
	}
}
</style>
