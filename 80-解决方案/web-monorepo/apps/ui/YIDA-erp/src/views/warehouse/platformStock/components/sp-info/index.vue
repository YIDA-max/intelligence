<template>
	<div class="sp-info">
		<div class="sp-info-content">
			<div
				class="sp-info-item"
				v-auth="item.auth"
				v-for="(item, index) in props.spInfoArr"
				:key="index"
				:class="{ currentSpInfo: currentSpInfo.id === item.id }"
			>
				<div class="sp-info-item-name" @click="clickSetSpInfoValue(item)">
					<span
						:style="{
							marginRight: '10px',
						}"
						>{{ item.spName }}</span
					>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, PropType } from 'vue';
interface SpInfo {
	id: string;
	spName: string;
	auth: string;
}
const props = defineProps({
	setSpInfoValue: {
		type: Function,
		default: () => {},
	},
	refreshData: {
		type: Function,
		default: () => {},
	},
	spInfoArr: {
		type: Array as PropType<SpInfo[]>,
		default: () => [
			{
				id: 'Tiktok自运营',
				spName: 'Tiktok自运营',
				auth: 'tiktok_view',
			},
		],
	},
});

// 当前选中的值
const currentSpInfo = ref<any>({
	id: 'Amazon',
	spName: 'Amazon',
});

const clickSetSpInfoValue = (value: any) => {
	currentSpInfo.value = value;
	props.setSpInfoValue(value);
};
// 父组件设置服务商信息的值
const tosSetSpInfoValue = (value: any) => {
	currentSpInfo.value = value;
};
defineExpose({
	tosSetSpInfoValue,
});
</script>

<style scoped lang="scss">
.sp-info {
	width: 350px;
	height: 100%;
	background: #fff;

	&-title {
		font-size: 16px;
		font-weight: bold;
		height: 50px;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20px;
		border-bottom: 1px solid #e4e7ed;
	}
	&-content {
		height: 72vh;
		overflow-y: auto;
		margin-top: 10px;
		.sp-info-item {
			width: 100%;
			height: 30px;
			padding: 0px 20px;
			margin: 10px 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			white-space: nowrap;
			&-name {
				width: 100%;
				cursor: pointer;
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
