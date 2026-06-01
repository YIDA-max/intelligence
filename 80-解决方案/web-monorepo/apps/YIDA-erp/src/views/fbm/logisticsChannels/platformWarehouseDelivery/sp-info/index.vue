<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps({
	setSpInfoValue: {
		type: Function,
		default: () => {},
	},
	refreshData: {
		type: Function,
		default: () => {},
	},
});

const platformArr = ref<Array<any>>([
	{
		label: '美国站(US)',
		value: 'US',
	},
	{
		label: '墨西哥站(MX)',
		value: 'MX',
	},
	{
		label: '加拿大站(CA)',
		value: 'CA',
	},
	{
		label: '英国站(UK)',
		value: 'UK',
	},
	{
		label: '法国站(FR)',
		value: 'FR',
	},
	{
		label: '意大利站(IT)',
		value: 'IT',
	},
	{
		label: '德国站(DE)',
		value: 'DE',
	},
	{
		label: '西班牙站(ES)',
		value: 'ES',
	},
	{
		label: '日本站(JP)',
		value: 'JP',
	},
	{
		label: '澳大利亚站(AU)',
		value: 'AU',
	},
]);
// 初始化
onMounted(async () => {});
// 当前选中的站点
const currentSpInfo = ref<any>({
	label: '美国站(US)',
	value: 'US',
});

// 点击设置平台信息的值
const clickSetSpInfoValue = (value: any) => {
	// 设置当前选中的站点信息
	currentSpInfo.value = value;
	// 调用父组件的方法设置站点信息的值
	props.setSpInfoValue(value);
};
// 父组件设置站点信息的值
const tosSetSpInfoValue = (value: any) => {
	currentSpInfo.value = value;
};

defineExpose({
	tosSetSpInfoValue,
});
</script>
<template>
	<div class="sp-info">
		<div class="sp-info-title">
			{{ $t('平台信息') }}
		</div>
		<div class="sp-info-content">
			<div
				class="sp-info-item"
				v-for="(item, index) in platformArr"
				:key="index"
				:class="{ currentSpInfo: currentSpInfo.value === item.value }"
			>
				<div class="sp-info-item-name" @click="clickSetSpInfoValue(item)">
					<span
						:style="{
							marginRight: '10px',
						}"
						>{{ item.label }}</span
					>
				</div>
			</div>
		</div>
	</div>
</template>
<style scoped lang="scss">
.sp-info {
	width: 350px;
	height: 100%;
	background: #fff;

	&-title {
		font-size: 16px;
		font-weight: bold;
		height: 60px;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20px;
		border-bottom: 1px solid #e4e7ed;
	}
	&-content {
		.sp-info-item {
			width: 100%;
			height: 30px;
			padding: 0px 20px;
			margin: 10px 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			cursor: pointer;
			&-name {
				width: 50%;
			}
			&-info {
				width: 50%;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				opacity: 0;
				transition: opacity 0.2s;
				&-edit,
				&-auth,
				&-disable {
					width: 30%;
					text-align: center;
				}
			}
			&:hover {
				background: darken(#f5f7fa, 5%);
				.sp-info-item-info {
					opacity: 1;
				}
			}
		}
	}
}
.currentSpInfo {
	background: darken(#f5f7fa, 5%);
	.sp-info-item-info {
		opacity: 1;
	}
}
</style>
