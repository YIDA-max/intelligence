<script lang="ts" setup>
import { getWareHouseList } from '/@/api/materialFlow/track';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const CustomCascader = defineAsyncComponent(
	() => import('/@/components/TreeSelectInput/custom-cascader.vue')
);
const formData = ref<Record<string, any>>({
	warehouseCode: [], // 仓库
});

const formRef = ref<any>(null);
const cascaderRef = ref<any>(null);

const init = () => {
	// 重置数据
	formData.value = {
		warehouseCode: [], // 仓库
	};
};

// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	if (formData.value.warehouseCode.length === 0) {
		return false;
	}
	const getFormData = {
		[`warehouseCode`]: `warehouseCode in [${formData.value.warehouseCode.map(
			(item: any) => `'${item}'`
		)}]`,
	};
	return getFormData;
};

// 设置回显值
const setFormData = async (data: Record<string, any>) => {
	// 设置数据
	const regexInclude = new RegExp(`${`warehouseCode`} in \\[([^\\]]+)\\]`);
	const match = data[`warehouseCode`].match(regexInclude);
	if (match) {
		formData.value.isBelong = '1';
		formData.value[`warehouseCode`] = match[1]
			.split(',') // 切割字符串
			.map((item: string) => item.trim().replace(/'/g, '')) // 去除空格和引号
			.map((item: string) => (isNaN(Number(item)) ? item : Number(item))); // 转换为数字（如果可能）
		// 设置级联组件选中回显
		return '成功设置数据：包含指定平台';
	}
};

const onCascaderMounted = () => {
	cascaderRef.value?.setSelectedOptions(formData.value.warehouseCode);
};
// 校验规则
const rules = {
	warehouseCode: [
		{
			required: true,
			message: t('请选择仓库'),
			trigger: 'change',
		},
	],
};

// 处理仓库搜索
const handleWarehouseSearch = async (keyword: string) => {
	await loadWarehouseData(keyword);
};

// 仓库选择相关
const loadWarehouseData = async (searchKeyword = '') => {
	try {
		const res = await getWareHouseList({
			warehouseName: searchKeyword, // 添加搜索参数
		});
		warehouseData.value = res.data.map((item: any) => ({
			id: item.warehouseType,
			name: item.warehouseTypeText,
			children: item.warehouses.map((warehouse: any) => ({
				id: warehouse.id,
				name: warehouse.warehouseName,
			})),
		}));
	} catch (error) {
		warehouseData.value = [];
	}
};
onMounted(() => {
	loadWarehouseData();
});
const handleWarehouseChange = (values: string[] | number[]) => {
	formData.value.warehouseCode = values;
};
// 仓库数据
const warehouseData = ref<any[]>([]);
defineExpose({
	init,
	validateForm,
	setFormData,
});
</script>
<template>
	<div class="box mt-4 mb-4">
		<el-form :model="formData" ref="formRef" label-width="150px" :rules="rules">
			<el-form-item prop="warehouseCode" label="发货仓库">
				<custom-cascader
					ref="cascaderRef"
					v-model="formData.warehouseCode"
					:data="warehouseData"
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
