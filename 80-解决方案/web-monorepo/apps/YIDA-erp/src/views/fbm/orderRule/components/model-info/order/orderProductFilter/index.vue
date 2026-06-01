<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 16:51:25
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-29 11:15:29
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\components\model-info\order\orderProductFilter\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { postGetBySkuCode } from '/@/api/product/sku';
const { t } = useI18n();
const SkuModule = defineAsyncComponent(() => import('./sku-module/material-dialog.vue'));
const skuModuleRef = ref<any>(null);
// 表单数据
const formData = ref<Record<string, any>>({
	skuCode: [], // 订单产品
	isBelong: '1', // 是否属于
});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({});
const skuList = ref<any[]>([]);
const init = () => {
	// 重置数据
	formData.value = {
		isBelong: '1', // 是否属于
	};
	skuList.value = [];
};
// 根据id来获取数据
// 更完整的带去重版本
const getSkuList = async (skuCodes: any) => {
	try {
		const response = await postGetBySkuCode(skuCodes);
		if (response && response.data) {
			const list = response.data;
			// 合并新数据和已有数据，并去重
			const combinedList = [...skuList.value, ...list];
			// 根据skuCode去重
			const uniqueList = combinedList.filter((item, index, self) => index === self.findIndex((t) => t.skuCode === item.skuCode));
			// 更新skuList
			skuList.value = uniqueList;
		}
	} catch (error) {
		// console.error('获取SKU数据失败:', error);
	}
};
const handleSetRows = async (rows: any[]) => {
	// 根据sku获取数据
	await getSkuList(rows.map((item) => item.skuCode));
};

// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	if (skuList.value.length === 0) {
		return new Promise((resolve, reject) => {
			reject('请添加订单产品');
		});
	}
	if (formData.value.isBelong === '1') {
		const getFormData = {
			skuCode: `skuCode in [${skuList.value.map((item) => item.skuCode).map((item) => `'${item}'`)}]`,
		};
		return getFormData;
	} else if (formData.value.isBelong === '2') {
		const getFormData = {
			skuCode: `!(skuCode in [${skuList.value.map((item) => item.skuCode).map((item) => `'${item}'`)}])`,
		};
		return getFormData;
	}
};
// 设置回显值
const setFormData = (data: Record<string, any>) => {
	if (!data || !data.skuCode) {
		return '错误：数据为空';
	}
	// 用于匹配是否排除的正则表达式(需要优先匹配 排除)
	const excludeMatch = data.skuCode.match(/!\(skuCode in \[([^\]]+)\]\)/);
	if (excludeMatch) {
		formData.value.isBelong = '2';
		const skuCodes = excludeMatch[1]
			.split(',') // 切割字符串
			.map((item: string) => item.trim().replace(/'/g, '')) // 去除空格和引号
			.map((item: string) => (isNaN(Number(item)) ? item : Number(item))); // 转换为数字（如果可能）
		// 根据sku获取数据
		getSkuList(skuCodes);
		return '成功设置数据';
	}
	// 用于匹配是否包含指定的正则表达式
	const match = data.skuCode.match(/skuCode in \[([^\]]+)\]/);
	if (match) {
		formData.value.isBelong = '1';
		const skuCodes = match[1]
			.split(',') // 切割字符串
			.map((item: string) => item.trim().replace(/'/g, '')) // 去除空格和引号
			.map((item: string) => (isNaN(Number(item)) ? item : Number(item))); // 转换为数字（如果可能）
		// 根据sku获取数据
		getSkuList(skuCodes);
		return '成功设置数据';
	}
	return '错误：无法解析数据格式';
};
// 完善的数据设置函数

// 暴露方法给父组件
defineExpose({
	init,
	validateForm,
	setFormData,
});
</script>
<template>
	<div class="box">
		<el-form :model="formData" ref="formRef" label-width="150px" :rules="rules">
			<el-row class="base-info" :gutter="20">
				<el-col :span="24">
					<el-form-item :label="t('订单产品')" prop="platformChannelCode">
						<template #label>
							<span
								:style="{
									color: '#f78c8c',
									marginRight: '3px',
								}"
								>*
							</span>
							<span>{{ t('订单产品') }}</span>
						</template>
						<el-row style="width: 100%">
							<el-col :span="4">
								<el-select v-model="formData.isBelong" placeholder="是否属于" style="width: 100%">
									<el-option
										v-for="item in [
											{
												id: '1',
												label: '属于',
												value: '1',
											},
											{
												id: '2',
												label: '不属于',
												value: '2',
											},
										]"
										:key="item.id"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-col>
							<el-col :span="19" class="ml-4">
								<el-link
									underline="never"
									@click="
										() => {
											skuModuleRef.show();
										}
									"
									type="primary"
									>添加产品</el-link
								>
							</el-col>
						</el-row>
						<el-row style="width: 100%">
							<el-col :span="6" v-for="(item, index) in skuList" :key="index" class="mt-2">
								<el-tag
									closable
									@close="skuList.splice(index, 1)"
									effect="plain"
									:style="{
										width: '250px',
										height: '60px',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										padding: '5px',
										textAlign: 'center',
										overflow: 'hidden',
										whiteSpace: 'nowrap',
										textOverflow: 'ellipsis',
									}"
									type="info"
								>
									<el-row
										:style="{
											width: '210px',
											color: '#606266',
										}"
									>
										<el-col :span="6">
											<div class="flex items-start justify-start">
												<el-image
													v-if="item.imgUrl"
													:preview-src-list="[item.imgUrl]"
													:preview-teleported="true"
													:src="item.imgUrl"
													alt="图片"
													class="object-cover w-12 h-12 rounded-md"
												/>
												<span v-else class="text-gray-400">无图片</span>
											</div>
										</el-col>
										<el-col :span="18" class="flex flex-col justify-center pl-2">
											<div class="flex flex-col items-start justify-center w-full truncate">
												<div style="" class="w-full mb-1 text-left">sku:{{ item.skuCode }}</div>
												<div style="" class="w-full mb-1 text-left">名称:{{ item.skuName }}</div>
											</div>
										</el-col>
									</el-row>
								</el-tag>
							</el-col>
						</el-row>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<SkuModule ref="skuModuleRef" @set-rows="handleSetRows" :skuList="skuList" />
	</div>
</template>

<style scoped lang="scss">
.box {
	padding: 10px;
	border-radius: 5px;
}
</style>
