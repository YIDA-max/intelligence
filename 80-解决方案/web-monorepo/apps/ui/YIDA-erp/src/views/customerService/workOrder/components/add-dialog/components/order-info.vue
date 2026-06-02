<script setup lang="ts">
import { ref } from 'vue';
import type { FormInstance } from 'element-plus';
import { Delete } from '@element-plus/icons-vue';
// 引用现有的 SKU 选择组件
import SkuSelect from './SkuSelectDialog.vue';
import {
	getPlatformOrderNo,
	orderList,
} from '/@/api/customerService/workOrder';
import { getGroupStoreByPlatform } from '/@/api/base/store/index';

const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);

/**
 * 接收父组件传递的属性
 * @property {object} dictMap - 字典映射表
 * @property {string} dialogType - 弹窗类型：add | edit | copy | detail
 */
const props = defineProps({
	dictMap: {
		type: Object,
		default: () => ({}),
	},
	dialogType: {
		type: String,
		default: 'add',
	},
});

const formRef = ref<FormInstance>();
const skuSelectRef = ref();

// 动态生成字段
const formData = ref<any>({
	relatedOrderNo: '', // 关联的平台订单号
	country: '', // 国家
	platformChannelCode: '', // 平台渠道
	storeId: '', // 店铺id
	purchaseDate: '', // 购买日期
	buyerName: '', // 买家姓名
	buyerPhone: '', // 买家电话
	buyerEmail: '', // 买家邮箱
	skuList: [], // SKU列表
});

// 站点数据
const storeData = ref<Array<any>>([]);
// 站点选择相关
const loadStoreData = async () => {
	try {
		const res = await getGroupStoreByPlatform({
			platformChannelCode: formData.value.platformChannelCode,
		});
		storeData.value = res.data.map((item: any) => ({
			id: item.siteCode,
			name: item.siteCode,
			children: item.stores.map((val: any) => ({
				id: val.id,
				name: val.storeName,
			})),
		}));
	} catch (error) {
		storeData.value = [];
	}
};

watch(() => formData.value.platformChannelCode, loadStoreData);

/**
 * 设置表单数据
 * @param {object} data - 包含订单信息的数据对象
 */
const setData = (data: any) => {
	formData.value = data;
};

/**
 * 获取表单数据并进行验证
 * @returns {Promise<object>} 返回验证通过后的表单数据对象
 */
const getData = async (orderType?: number) => {
	if (!formRef.value) return Promise.reject('Form not initialized');
	await formRef.value.validate();
	// 1: 售前, 不校验 SKU
	if (orderType !== 1 && formData.value.skuList.length === 0) {
		return Promise.reject('请添加 SKU');
	}
	return JSON.parse(JSON.stringify(formData.value));
};
/**
 * 清空订单相关信息
 */
const clearOrderInfo = () => {
	formData.value.country = '';
	formData.value.platformChannelCode = '';
	formData.value.storeId = '';
	formData.value.purchaseDate = '';
	formData.value.buyerName = '';
	formData.value.buyerPhone = '';
	formData.value.buyerEmail = '';
	formData.value.skuList = [];
};

/**
 * 订单号模糊查询
 * @param {string} queryString - 查询字符串
 * @param {Function} cb - 回调函数
 */
const querySearchAsync = async (queryString: string, cb: Function) => {
	// 只要输入变化，就清空相关信息
	clearOrderInfo();

	if (!queryString) return;
	await orderList({ relatedOrderNo: queryString });
	const res = await getPlatformOrderNo({ platformOrderNo: queryString });
	if (res.data && res.data.length > 0) {
		// 构造符合 el-autocomplete 要求的数组
		const results = res.data.map((item: any) => ({
			value: item.platformOrderNo, // 显示的值
			...item,
		}));
		cb(results);
	} else {
		cb([]);
	}
};

/**
 * 处理订单号选择
 * @param {object} item - 选中的订单项
 */
const handleSelect = (item: any) => {
	formData.value.relatedOrderNo = item.value;

	// 回显订单相关信息 (先清空再赋值，避免残留旧数据)
	// clearOrderInfo() 已在 querySearchAsync 中调用，此处直接赋值即可
	formData.value.country = item.buyerCountry || ''; // 映射 siteCode 到 country
	formData.value.platformChannelCode = item.platformCode || ''; // 映射 platformCode
	formData.value.storeId = item.storeId || '';
	formData.value.purchaseDate = item.buyDate || ''; // 映射 buyDate
	formData.value.buyerName = item.buyerName || '';
	formData.value.buyerPhone = item.buyerPhone || '';
	formData.value.buyerEmail = item.buyerEmail || '';
	// 回显 SKU 列表（如果接口返回了 skuList）
	if (item.skuCodes && item.skuCodes.length > 0) {
		formData.value.skuList = item.skuCodes.map((item: any) => ({
			skuCode: item.skuCode,
			brand: item.brandName, // 映射到 DTO brand
			category: item.categoryName, // 映射到 DTO category
			asin: item.asin || '',
			sn: '',
			productName: item.productName || item.name || '', // 尝试获取产品名称
			...item,
		}));
	}

	// useMessageBox().confirm('该订单当前已有工单记录');
};

/**
 * 打开 SKU 选择弹窗
 */
const handleAddSku = async () => {
	// 提取出当前已有的 skuCode 数组
	const skuCodes = formData.value.skuList.map((item: any) => item.skuCode);

	if (formData.value.relatedOrderNo) {
		try {
			const res = await getPlatformOrderNo({
				platformOrderNo: formData.value.relatedOrderNo,
			});
			if (res.data && res.data.length > 0) {
				// 找到精确匹配的订单
				const matchOrder = res.data;
				if (
					matchOrder &&
					matchOrder.skuCodes &&
					matchOrder.skuCodes.length > 0
				) {
					// 如果接口有返回 SKU 列表，直接使用返回的数据
					skuSelectRef.value.show({
						type: 'static',
						data: matchOrder.skuCodes,
						skuCodes: skuCodes,
					});
					return;
				}
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error);
		}
	}
	// 如果没有订单号，或者接口没有返回 SKU 列表，则作为 API 查询打开
	skuSelectRef.value.show({
		type: 'api',
		skuCodes: skuCodes,
	});
};

/**
 * 处理 SKU 选择回调
 * @param {any[]} rows - 选中的 SKU 行数据
 */
const handleSetRows = (rows: any[]) => {
	if (!formData.value.skuList) {
		formData.value.skuList = [];
	}
	rows.forEach((row) => {
		// 避免重复添加
		const exists = formData.value.skuList.some(
			(item: any) => item.skuCode === row.skuCode
		);
		if (!exists) {
			formData.value.skuList.push({
				skuCode: row.skuCode,
				brand: row.brandName, // 映射到 DTO brand
				category: row.categoryName, // 映射到 DTO category
				asin: row.asin || '',
				sn: '',
				productName: row.productName || row.name || '', // 尝试获取产品名称
				...row,
			});
		}
	});
};

/**
 * 删除已选 SKU
 * @param {number} index - SKU 在列表中的索引
 */
const handleDeleteSku = (index: number) => {
	formData.value.skuList.splice(index, 1);
};

defineExpose({
	setData,
	getData,
});
</script>

<template>
	<div class="mb-4">
		<div class="border-l-4 border-blue-500 pl-2 font-bold mb-4 text-base">
			订单信息
		</div>
		<el-form ref="formRef" :model="formData" label-width="100px">
			<el-row class="mb10" :gutter="20">
				<el-col :span="6">
					<el-form-item label="订单号" prop="relatedOrderNo">
						<el-autocomplete
							v-model="formData.relatedOrderNo"
							:fetch-suggestions="querySearchAsync"
							:trigger-on-focus="false"
							placeholder="请输入"
							@select="handleSelect"
							:disabled="props.dialogType === 'detail'"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="国家" prop="country">
						<SelectInputApi
							componentType="country"
							v-model="formData.country"
							placeholder="请选择"
							:disabled="props.dialogType === 'detail'"
							style="width: 100%"
							:settings="{
								text: '请选择',
							}"
						/>
						<!-- <el-select
							v-model="formData.country"
							filterable
							clearable
							placeholder="请选择国家"
							:disabled="props.dialogType === 'detail'"
						>
							<el-option
								v-for="value in props.dictMap.countryList"
								:key="value.abbTwoCode"
								:label="`${value.abbTwoCode}-${value.chineseName}`"
								:value="value.abbTwoCode"
							/>
						</el-select> -->
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="平台渠道" prop="platformChannelCode">
						<SelectInputApi
							componentType="dicts"
							v-model="formData.platformChannelCode"
							placeholder="请选择"
							:disabled="props.dialogType === 'detail'"
							style="width: 100%"
							@change="loadStoreData"
							:settings="{
								text: '请选择',
								getTreeDataParams: 'platform_channel',
							}"
						/>
						<!-- <el-select
							v-model="formData.platformChannelCode"
							filterable
							clearable
							placeholder="请选择平台"
							:disabled="props.dialogType === 'detail'"
							@change="loadStoreData"
						>
							<el-option
								v-for="value in props.dictMap.platform"
								:key="value.value"
								:label="value.label"
								:value="value.value"
							/>
						</el-select> -->
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="店铺/站点" prop="storeId">
						<el-cascader
							v-model="formData.storeId"
							:disabled="props.dialogType === 'detail'"
							placeholder="店铺/站点"
							style="width: 300px"
							clearable
							:options="storeData"
							collapse-tags
							:max-collapse-tags="1"
							filterable
							:props="{
								label: 'name',
								value: 'id',
								emitPath: false, // ✅ 只返回最后一个 id
								checkStrictly: false, // 默认即可，确保联动
								leafOnly: true, // ✅ 只允许选最后一级
								multiple: false,
							}"
						>
						</el-cascader>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb10" :gutter="20">
				<el-col :span="6">
					<el-form-item label="购买日期" prop="purchaseDate">
						<el-date-picker
							v-model="formData.purchaseDate"
							type="datetime"
							value-format="YYYY-MM-DD HH:mm:ss"
							placeholder="请选择"
							class="w-full"
							:disabled="props.dialogType === 'detail'"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="买家姓名" prop="buyerName">
						<el-input
							v-model="formData.buyerName"
							placeholder="请输入"
							:disabled="props.dialogType === 'detail'"
						/>
					</el-form-item>
				</el-col>

				<el-col :span="6">
					<el-form-item label="电话" prop="buyerPhone">
						<el-input
							v-model="formData.buyerPhone"
							placeholder="请输入"
							:disabled="props.dialogType === 'detail'"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="邮箱" prop="buyerEmail">
						<el-input
							v-model="formData.buyerEmail"
							placeholder="请输入"
							:disabled="props.dialogType === 'detail'"
						/>
					</el-form-item>
				</el-col>
			</el-row>

			<!-- SKU List -->
			<div class="flex flex-start items-center mb-2">
				<div class="font-bold text-base">SKU</div>
				<el-link
					class="ml-2 text-blue-500"
					v-if="props.dialogType !== 'detail'"
					@click="handleAddSku"
				>
					添加 SKU
				</el-link>
			</div>
			<el-table :data="formData.skuList" border style="width: 100%">
				<el-table-column prop="skuCode" label="SKU" width="260">
					<template #header>
						<span class="text-red-500">*</span>
						<span class="">SKU</span>
					</template>
					<template #default="{ row }">
						<el-input v-model="row.skuCode" placeholder="请输入" disabled />
					</template>
				</el-table-column>
				<el-table-column prop="brand" label="品牌" width="260">
					<template #header>
						<span class="text-red-500">*</span>
						<span class="">品牌</span>
					</template>
					<template #default="{ row }">
						<el-input v-model="row.brand" placeholder="请输入" disabled />
					</template>
				</el-table-column>
				<el-table-column prop="category" label="类目" width="260">
					<template #header>
						<span class="text-red-500">*</span>
						<span class="">类目</span>
					</template>
					<template #default="{ row }">
						<el-input v-model="row.category" placeholder="请输入" disabled />
					</template>
				</el-table-column>
				<el-table-column label="ASIN">
					<template #default="{ row }">
						<el-input
							v-model="row.asin"
							placeholder="请输入"
							:disabled="props.dialogType === 'detail'"
						/>
					</template>
				</el-table-column>
				<el-table-column label="SN">
					<template #default="{ row }">
						<el-input
							v-model="row.sn"
							placeholder="请输入"
							:disabled="props.dialogType === 'detail'"
						/>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="120" align="center">
					<template #default="{ $index }">
						<el-button
							v-if="props.dialogType !== 'detail'"
							type="danger"
							link
							:icon="Delete"
							@click="handleDeleteSku($index)"
						/>
					</template>
				</el-table-column>
			</el-table>
		</el-form>

		<SkuSelect ref="skuSelectRef" @setRows="handleSetRows" />
	</div>
</template>

<style scoped>
:deep(.custom-cascader .cascader-dropdown) {
	z-index: 9999 !important;
	left: auto !important;
	right: 0 !important;
}
</style>
