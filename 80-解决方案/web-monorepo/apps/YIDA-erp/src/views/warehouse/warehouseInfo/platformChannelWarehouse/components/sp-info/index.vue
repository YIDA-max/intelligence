<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { getDicts } from '/@/api/admin/dict';
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
//   初始化数据
const { dictMap } = useMultipleDicts(
	[
		{
			key: 'platformChannel',
			fetchFn: getDicts,
			params: 'platform_channel',
		}, // 平台 渠道
	],
	{}
);
// 初始化
onMounted(async () => {});
// 当前选中的值
const currentSpInfo = ref<any>({});

// 点击设置平台信息的值
const clickSetSpInfoValue = (value: any) => {
	// 设置当前选中的平台信息
	currentSpInfo.value = value;
	// 调用父组件的方法设置平台信息的值
	props.setSpInfoValue(value);
};
// 父组件设置平台信息的值
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
				v-for="(item, index) in dictMap.platformChannel"
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

		.sp-info-item {
			width: 100%;
			height: 30px;
			padding: 0px 20px;
			margin: 10px 0;
			display: flex;
			align-items: center;
			justify-content: space-between;

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
