<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';

/**
 * 接收父组件传递的属性
 * @property {string} dialogType - 弹窗类型：add | edit | copy | detail
 */
const props = defineProps({
	dialogType: {
		type: String,
		default: 'add',
	},
	dictMap: {
		type: Object,
		default: () => ({}),
	},
});

const ModuleSelector = defineAsyncComponent(
	() => import('./module-selector.vue')
);
const RefundInfo = defineAsyncComponent(
	() => import('./modules/refund-info.vue')
);
const ReturnInfo = defineAsyncComponent(
	() => import('./modules/return-info.vue')
);
const NewMachineInfo = defineAsyncComponent(
	() => import('./modules/new-machine-info.vue')
);
const AccessoryInfo = defineAsyncComponent(
	() => import('./modules/accessory-info.vue')
);

const moduleOptions = [
	{ label: '退款', value: 'refundAction' },
	{ label: '退货', value: 'returnAction' },
	{ label: '补发新机', value: 'reshipNewActions' },
	{ label: '补发配件', value: 'reshipPartActions' },
	{ label: '延保一年', value: 'extendWarranty' },
	{ label: '赠送APP会员', value: 'giftAppMember' },
];

const selectedModules = ref<string[]>([]);
const componentRefs = ref<any>({});
const modulesData = ref<any>({});

/**
 * 设置组件引用
 * @param {string} key - 组件 key
 * @param {any} el - 组件实例
 */
const setRef = (key: string, el: any) => {
	if (el) {
		componentRefs.value[key] = el;
	}
};

/**
 * 设置组件数据
 * @param {object} data - 数据对象
 */
const setData = async (data: any) => {
	if (data.modulesData) {
		modulesData.value = data.modulesData;
	}
	if (data.selectedModules) {
		selectedModules.value = data.selectedModules;
	}
};

/**
 * 获取组件数据
 * @returns {Promise<object>} 返回验证通过后的数据对象
 */
const getData = async () => {
	const actionInfo: any = {};

	// 布尔值字段
	if (selectedModules.value.includes('extendWarranty')) {
		actionInfo.extendWarranty = true;
	}
	if (selectedModules.value.includes('giftAppMember')) {
		actionInfo.giftAppMember = true;
	}

	// 复杂对象字段
	const validationPromises: Promise<any>[] = [];

	if (
		selectedModules.value.includes('refundAction') &&
		componentRefs.value.refundAction
	) {
		validationPromises.push(
			componentRefs.value.refundAction.getData().then((data: any) => {
				actionInfo.refundAction = data;
			})
		);
	}

	if (
		selectedModules.value.includes('returnAction') &&
		componentRefs.value.returnAction
	) {
		validationPromises.push(
			componentRefs.value.returnAction.getData().then((data: any) => {
				actionInfo.returnAction = data;
			})
		);
	}

	if (
		selectedModules.value.includes('reshipNewActions') &&
		componentRefs.value.reshipNewActions
	) {
		validationPromises.push(
			componentRefs.value.reshipNewActions.getData().then((data: any) => {
				actionInfo.reshipNewActions = data;
			})
		);
	}

	if (
		selectedModules.value.includes('reshipPartActions') &&
		componentRefs.value.reshipPartActions
	) {
		validationPromises.push(
			componentRefs.value.reshipPartActions.getData().then((data: any) => {
				actionInfo.reshipPartActions = data;
			})
		);
	}

	await Promise.all(validationPromises);
	return actionInfo;
};

defineExpose({ setData, getData });
</script>

<template>
	<div class="mb-4">
		<ModuleSelector
			v-model="selectedModules"
			:dialogType="props.dialogType"
			:options="moduleOptions"
		/>

		<div class="mt-4">
			<RefundInfo
				v-if="selectedModules.includes('refundAction')"
				:dialogType="props.dialogType"
				:dictMap="props.dictMap"
				:ref="(el) => setRef('refundAction', el)"
				:data="modulesData.refundAction"
			/>
			<ReturnInfo
				v-if="selectedModules.includes('returnAction')"
				:dialogType="props.dialogType"
				:dictMap="props.dictMap"
				:ref="(el) => setRef('returnAction', el)"
				:data="modulesData.returnAction"
			/>
			<NewMachineInfo
				v-if="selectedModules.includes('reshipNewActions')"
				:dialogType="props.dialogType"
				:dictMap="props.dictMap"
				:ref="(el) => setRef('reshipNewActions', el)"
				:data="modulesData.reshipNewActions"
			/>
			<AccessoryInfo
				v-if="selectedModules.includes('reshipPartActions')"
				:dialogType="props.dialogType"
				:dictMap="props.dictMap"
				:ref="(el) => setRef('reshipPartActions', el)"
				:data="modulesData.reshipPartActions"
			/>
		</div>
	</div>
</template>
