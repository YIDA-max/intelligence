<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 17:58:38
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-03-02 11:50:03
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\components\model-info\base-info\orderStoreFilter\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { inject, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
	isInToValidateForm,
	isInToSetFormData,
} from '/@/views/fbm/orderRule/components/utils/index';
const { t } = useI18n();
const dictMap = inject<Ref<any>>('dictMap');

// 表单数据
const formData = ref<Record<string, any>>({
	store: [], // 订单店铺
	isBelong: '1',
});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	store: [{ required: true, message: '请选择订单店铺', trigger: 'blur' }],
});
const init = () => {
	// 重置数据
	formData.value = {
		store: [], // 订单店铺
		isBelong: '1',
	};
};

// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	return isInToValidateForm(
		formData.value.isBelong,
		'store',
		formData.value.store
	);
};
// 设置回显值
const setFormData = (data: Record<string, any>) => {
	// 设置数据
	return isInToSetFormData(data, 'store', formData);
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
					<el-form-item :label="t('订单店铺')" prop="store">
						<el-row style="width: 100%">
							<el-col :span="4">
								<el-select
									v-model="formData.isBelong"
									placeholder="是否属于"
									style="width: 100%"
								>
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
							<el-col :span="20">
								<el-select
									collapse-tags
									:max-collapse-tags="5"
									v-model="formData.store"
									clearable
									filterable
									multiple
									placeholder="订单店铺"
									style="width: 100%"
								>
									<el-option
										v-for="item in dictMap.baseStore"
										:key="item.id"
										:label="`[${item.platformChannelCode}]${item.storeName}:${item.siteCode}`"
										:value="item.id"
									/>
								</el-select>
							</el-col>
						</el-row>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>

<style scoped lang="scss">
.box {
	padding: 10px;
	border-radius: 5px;
}
</style>
