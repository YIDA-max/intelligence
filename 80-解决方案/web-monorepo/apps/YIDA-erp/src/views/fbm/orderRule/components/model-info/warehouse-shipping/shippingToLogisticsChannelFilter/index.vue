<script lang="ts" setup>
import { getWareHouseList } from '/@/api/materialFlow/track';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const CustomCascader = defineAsyncComponent(
	() => import('/@/components/TreeSelectInput/custom-cascader.vue')
);
const formData = ref<Record<string, any>>({
	logisticsChannel: [], // 仓库
});

const formRef = ref<any>(null);
const cascaderRef = ref<any>(null);

const init = () => {
	// 重置数据
	formData.value = {
		logisticsChannel: [], // 仓库
	};
};

// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	if (formData.value.logisticsChannel.length === 0) {
		return false;
	}
	const getFormData = {
		[`logisticsChannel`]: `logisticsChannel in [${formData.value.logisticsChannel}]`,
	};
	return getFormData;
};

// 设置回显值
const setFormData = async (data: Record<string, any>) => {
	// 设置数据
	const regexInclude = new RegExp(`${`logisticsChannel`} in \\[([^\\]]+)\\]`);
	const match = data[`logisticsChannel`].match(regexInclude);
	if (match) {
		formData.value.isBelong = '1';
		formData.value[`logisticsChannel`] = match[1]
			.split(',') // 切割字符串
			.map((item: string) => item.trim().replace(/'/g, '')) // 去除空格和引号
			.map((item: string) => (isNaN(Number(item)) ? item : Number(item))); // 转换为数字（如果可能）
		// 设置级联组件选中回显
		return '成功设置数据：包含指定平台';
	}
};

const onCascaderMounted = () => {
	cascaderRef.value?.setSelectedOptions(formData.value.logisticsChannel);
};
// 校验规则
const rules = {
	logisticsChannel: [
		{
			required: true,
			message: t('请选择仓库'),
			trigger: 'change',
		},
	],
};

// 处理仓库搜索
const handleWarehouseSearch = async (keyword: string) => {
	await loadlogisticsChannelData(keyword);
};

// 仓库选择相关
const loadlogisticsChannelData = async (searchKeyword = '') => {
	try {
		const res = await getWareHouseList({
			warehouseName: searchKeyword, // 添加搜索参数
		});
		logisticsChannelData.value = res.data.map((item: any) => ({
			id: item.warehouseType,
			name: item.warehouseTypeText,
			children: item.warehouses.map((warehouse: any) => ({
				id: warehouse.id,
				name: warehouse.warehouseName,
			})),
		}));
	} catch (error) {
		logisticsChannelData.value = [];
	}
};
onMounted(() => {
	loadlogisticsChannelData();
});
const handleWarehouseChange = (values: string[] | number[]) => {
	formData.value.logisticsChannel = values;
};
// 仓库数据
const logisticsChannelData = ref<any[]>([]);
defineExpose({
	init,
	validateForm,
	setFormData,
});
</script>
<template>
	<div class="box">
		<el-form :model="formData" ref="formRef" label-width="150px" :rules="rules">
			<el-form-item prop="logisticsChannel">
				<custom-cascader
					ref="cascaderRef"
					v-model="formData.logisticsChannel"
					:data="logisticsChannelData"
					:settings="{
						code: 'warehouseId',
						text: '发货仓',
						width: '300px',
						props: {
							value: 'id',
							label: 'name',
							children: 'children',
						},
						onSearch: handleWarehouseSearch,
						checkStrictly: false,
						showSelectAll: false,
					}"
					@mounted="onCascaderMounted"
					@change="handleWarehouseChange"
				/>
			</el-form-item>
		</el-form>
	</div>
</template>
