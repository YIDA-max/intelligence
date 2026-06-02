<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
	getPlatformLogisticsProviderList,
	postPlatformLogisticsUpdateStatusByProvider,
	PlatformLogisticsProviderVO,
} from '/@/api/fbm/logisticsChannel/platformLogistics/index';
import { ElMessageBox } from 'element-plus';

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
const search = ref<string>('');
const platformArr = ref<Array<PlatformLogisticsProviderVO> | any>([]);
watch(
	() => platformArr.value,
	() => {
		if (platformArr.value.length > 0) {
			// 设置默认选中的站点信息
			currentSpInfo.value = platformArr.value[0];
			// 调用父组件的方法设置站点信息的值
			props.setSpInfoValue(platformArr.value[0]);
		}
	}
);
// 初始化
onMounted(async () => {
	queryPlatformLogisticsList();
});
/**
 * 查询平台物流商列表
 */
const queryPlatformLogisticsList = async () => {
	const res = await getPlatformLogisticsProviderList({
		name: search.value,
	});
	if (res && res.code === 0) {
		platformArr.value = res.data || [];
	}
};

// 当前选中的站点
const currentSpInfo = ref<any>({});

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
/**
 * 处理禁止/启用点击事件
 */
const handleClick = async (
	e: { stopPropagation: () => void },
	item: { status: number; id: any }
) => {
	await ElMessageBox.confirm(
		`确定要${item.status === 1 ? '停用' : '启用'}该渠道吗？`,
		'提示',
		{
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		}
	);
	e.stopPropagation();
	const newStatus = item.status === 1 ? 0 : 1;
	const res = await postPlatformLogisticsUpdateStatusByProvider({
		id: item.id,
		status: newStatus,
	});
	if (res && res.code === 0) {
		// 刷新列表数据
		queryPlatformLogisticsList();
		// 调用父组件的方法刷新数据
		props.refreshData();
	}
};

defineExpose({
	tosSetSpInfoValue,
});
</script>
<template>
	<div class="sp-info">
		<div class="sp-info-title">
			{{ $t('物流商') }}
		</div>
		<div class="p-2">
			<el-input
				v-model="search"
				placeholder="搜索物流商"
				@blur="queryPlatformLogisticsList"
			/>
		</div>
		<div class="sp-info-content">
			<div class="sp-info-item">
				<div class="sp-info-item-name">
					<span
						:style="{
							marginRight: '10px',
						}"
						class="font-bold"
						>物流商名字</span
					>
				</div>
				<div>
					<span class="font-bold">{{ $t('操作') }}</span>
				</div>
			</div>
			<div
				class="sp-info-item"
				v-for="(item, index) in platformArr"
				:key="index"
				:class="{ currentSpInfo: currentSpInfo.id === item.id }"
				@click="clickSetSpInfoValue(item)"
			>
				<div class="sp-info-item-name">
					<span
						:style="{
							marginRight: '10px',
						}"
						>{{ item.name }}</span
					>
				</div>
				<div class="sp-info-item-info">
					<el-link
						underline="never"
						type="primary"
						v-if="item.status === 0"
						@click.stop="handleClick($event, item)"
						>{{ $t(`${item.status === 0 ? '启用' : '停用'}`) }}</el-link
					>
					<el-link
						underline="never"
						type="primary"
						v-else
						@click.stop="handleClick($event, item)"
						>{{ $t(`${item.status === 0 ? '启用' : '停用'}`) }}</el-link
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
				// opacity: 0;
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
