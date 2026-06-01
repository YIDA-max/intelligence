<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 17:43:46
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-20 16:32:26
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\orderSplitRule\components\rule-model\model-info\set-action\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const SkuModule = defineAsyncComponent(
	() => import('./sku-module/material-dialog.vue')
);
// 表单数据
const formData = ref<Record<string, any>>({
	operateType: 1, // 执行动作 1:按产品拆分
	spiltMethod: 1, // 拆分方式 1:形同产品拆为一单 2:每行产品拆为一单 3:买件产品拆为一单 4:所选产品拆为一单 5:所选产品按件拆为一单
});
// 表单引用
const formRef = ref<any>(null);
const skuList = ref<any[]>([]);
const skuModuleRef = ref<any>(null);
// 根据id来获取数据
const handleSetRows = async (rows: any[]) => {
	// 进行合并和去重
	const combinedList = [...skuList.value, ...rows];
	// 根据skuCode去重
	const uniqueList = combinedList.filter(
		(item, index, self) =>
			index === self.findIndex((t) => t.skuCode === item.skuCode)
	);
	// 更新skuList
	skuList.value = uniqueList;
};
// 表单校验
const rules = ref({
	operateType: [
		{ required: true, message: '请选择发货确认方式', trigger: 'blur' },
	],
});

const init = () => {
	formData.value = {
		operateType: 1, // 执行动作 1:按产品拆分
		spiltMethod: 1,
	};
	skuList.value = [];
};
// 导出给父组件的方法
// 获取表单数据
const validateForm = async () => {
	await formRef.value.validate();
	// 如果是所选产品拆为一单或者所选产品按件拆为一单 则需要选择产品
	if (formData.value.spiltMethod === 4 || formData.value.spiltMethod === 5) {
		if (skuList.value.length === 0) {
			return Promise.reject('错误：请至少选择一个产品');
		}
	}
	// 如果所选产品按件拆为一单 每一个sku的数量不能为空
	if (formData.value.spiltMethod === 5) {
		const isPositiveInteger = (val: unknown) => {
			// 允许 number / string，统一转成字符串判断，避免 1.0 / 1e2 / 01 等边界带来歧义
			const raw = String(val ?? '').trim();
			if (!/^[1-9]\d*$/.test(raw)) return false;
			const num = Number(raw);
			return Number.isSafeInteger(num) && num > 0;
		};
		for (const item of skuList.value) {
			if (
				item.quantity === undefined ||
				item.quantity === null ||
				item.quantity === ''
			) {
				return Promise.reject(`错误：${item.skuCode} 的数量不能为空`);
			}
			// 数量必须是正整数（>0 且不能有小数/负数/0）
			if (!isPositiveInteger(item.quantity)) {
				return Promise.reject(
					`错误：${item.skuCode} 的数量只能输入正整数（当前：${item.quantity}）`
				);
			}
		}
	}

	const getFormData = {
		...formData.value,
		operateType: 1, // 执行动作 1:按产品拆分
		// spiltMethod: 1, // 拆分方式 1:形同产品拆为一单 2:每行产品拆为一单 3:买件产品拆为一单 4:所选产品拆为一单 5:所选产品按件拆为一单
		// 选择的产品
		spiltSku: JSON.stringify(
			skuList.value?.map((item) => {
				return {
					// 只传应该传的，不要全部传
					skuCode: item.skuCode,
					quantity: item.quantity,
					imgUrl: item.imgUrl,
					skuName: item.skuName,
				};
			}) || []
		),
	};
	return getFormData;
};
// 设置表单数据
const setFormData = (data: Record<string, any>) => {
	formData.value = {
		...formData.value,
		operateType: 1,
		...data,
	};
	skuList.value = JSON.parse(data.spiltSku || '[]') || [];
}; // 暴露给父组件的方法
defineExpose({
	validateForm,
	init,
	setFormData,
});
</script>
<template>
	<div class="box">
		<el-form :model="formData" ref="formRef" label-width="150px" :rules="rules">
			<el-row class="title">
				<el-col :span="24"> {{ t('设定动作') }} </el-col>
			</el-row>
			<el-row class="base-info" :gutter="20">
				<el-col :span="24">
					<el-form-item label="执行动作" prop="auto">
						<template #label>
							<span
								:style="{
									color: '#f78c8c',
									marginRight: '3px',
								}"
								>*
							</span>
							<span>{{ t('执行动作') }}</span>
						</template>
						<el-row style="width: 100%">
							<el-col :span="4">
								<el-radio-group v-model="formData.operateType">
									<el-radio :value="1" size="small">按产品拆分</el-radio>
								</el-radio-group>
							</el-col>
							<el-col
								:span="19"
								class="ml-4"
								v-if="formData.spiltMethod === 4 || formData.spiltMethod === 5"
							>
								<el-link
									underline="never"
									@click="
										() => {
											skuModuleRef.show();
										}
									"
									type="primary"
								>
									添加产品
								</el-link>
							</el-col>
						</el-row>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row style="width: 100%">
				<el-form-item label="拆分方式" prop="auto" style="width: 80%">
					<template #label>
						<span
							:style="{
								color: '#f78c8c',
								marginRight: '3px',
							}"
							>*
						</span>
						<span>{{ t('拆分方式') }}</span>
					</template>
					<el-select
						v-model="formData.spiltMethod"
						filterable
						placeholder="动作"
						style="width: 100%"
						@change="
							() => {
								if (formData.spiltMethod !== 4 && formData.spiltMethod !== 5) {
									skuList = [];
								}
							}
						"
					>
						<el-option
							v-for="item in [
								{
									label: '相同产品拆为一单',
									value: 1,
								},
								{
									label: '每行产品拆为一单',
									value: 2,
								},
								{
									label: '每件产品拆为一单',
									value: 3,
								},
								{
									label: '所选产品拆为一单',
									value: 4,
								},
								{
									label: '所选产品按件拆为一单',
									value: 5,
								},
							]"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/> </el-select
				></el-form-item>
			</el-row>
			<el-row style="width: 100%">
				<el-col
					:span="8"
					v-for="(item, index) in skuList"
					:key="index"
					class="mt-2"
				>
					<el-tag
						closable
						@close="skuList.splice(index, 1)"
						effect="plain"
						:style="{
							width: '400px',
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
								width: '350px',
							}"
						>
							<el-col :span="4">
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
							<el-col :span="15" class="flex flex-col justify-center pl-2">
								<div
									style="
										display: flex;
										flex-direction: column;
										justify-content: center;
										align-items: flex-start;
										width: 100%;
									"
								>
									<div style="" class="w-full mb-2 text-left truncate">
										sku:{{ item.skuCode }}
									</div>
									<div style="" class="w-full mb-1 text-left truncate">
										名称:{{ item.skuName }}
									</div>
								</div>
							</el-col>
							<el-col :span="5" class="flex items-center justify-center">
								<span
									v-if="formData.spiltMethod === 5"
									:style="{
										color: '#f78c8c',
										marginRight: '3px',
									}"
									>*</span
								>
								<el-input
									type="number"
									v-model="item.quantity"
									:min="1"
									v-if="formData.spiltMethod === 5"
								/>
							</el-col>
						</el-row>
					</el-tag>
				</el-col>
			</el-row>
		</el-form>
		<SkuModule
			ref="skuModuleRef"
			@set-rows="handleSetRows"
			:skuList="skuList"
		/>
	</div>
</template>

<style scoped lang="scss">
.box {
	border-radius: 5px;
	.title {
		font-size: 16px;
		font-weight: 500;
	}
}
</style>
