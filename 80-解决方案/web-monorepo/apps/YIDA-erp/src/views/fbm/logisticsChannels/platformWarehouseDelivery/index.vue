<template>
	<div class="content-area">
		<el-tabs v-model="activeName" class="platform-tab">
			<el-tab-pane
				v-for="item in tabsArr"
				:key="item.value"
				:label="item.label"
				:name="item.value"
			/>
		</el-tabs>

		<div class="third-warehouse">
			<div class="sp-info">
				<SpInfo ref="spInfoRef" :setSpInfoValue="setSpInfoValue" />
			</div>
			<div class="platform-warehouse-info mt10 ml10">
				<PlatformWarehouseInfo
					ref="platformWarehouseInfoRef"
					:currentSpInfo="spInfoValue"
					:currentType="activeName"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const SpInfo = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/logisticsChannels/platformWarehouseDelivery/sp-info/index.vue'
		)
);
const PlatformWarehouseInfo = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/logisticsChannels/platformWarehouseDelivery/platformInfo/index.vue'
		)
);

// tabs数据
const tabsArr = ref<Array<any>>([{ label: 'FBA多渠道配送', value: 1 }]);
// 平台信息组件的引用
const spInfoRef = ref();
// 平台信息组件的引用
const platformWarehouseInfoRef = ref();

// 当前选中的站点
const spInfoValue = ref({
	label: '美国站(US)',
	value: 'US',
});

// 当前选中的类型
const activeName = ref<number>(1);

// 切换站点
const setSpInfoValue = (e: any) => {
	spInfoValue.value = e;
};
</script>

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
