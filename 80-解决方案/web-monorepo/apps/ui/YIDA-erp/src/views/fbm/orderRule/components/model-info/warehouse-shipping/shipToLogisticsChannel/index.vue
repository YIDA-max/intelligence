<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 15:21:52
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-13 10:02:39
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\orderConfirmRule\components\rule-model\model-info\base-info\orderPlatformFilter\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { inject, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { isInToValidateForm, isInToSetFormData } from '/@/views/fbm/orderRule/components/utils/index';
const { t } = useI18n();
const dictMap = inject<Ref<any>>('dictMap');

// 表单数据
const formData = ref<Record<string, any>>({
	isBelong: '1', // 是否属于
	logisticsChannel: [], // 物流渠道
});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	logisticsChannel: [{ required: true, message: '请选择物流渠道', trigger: 'blur' }],
});
const init = () => {
	// 重置数据
	formData.value = {
		logisticsChannel: [], // 物流渠道
		isBelong: '1',
	};
};
// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	return isInToValidateForm(formData.value.isBelong, 'logisticsChannel', formData.value.logisticsChannel);
};
// 设置回显值
const setFormData = (data: Record<string, any>) => {
	// 设置数据
	return isInToSetFormData(data, 'logisticsChannel', formData);
};
// 完善的数据设置函数

// 暴露给父组件的方法
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
					<el-form-item :label="t('物流渠道')" prop="logisticsChannel">
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
							<el-col :span="20">
								<el-select
									collapse-tags
									:max-collapse-tags="5"
									v-model="formData.logisticsChannel"
									clearable
									filterable
									multiple
									placeholder="物流渠道"
									style="width: 100%"
								>
									<el-option
										v-for="item in (dictMap?.logisticsChannelList as any as { records: any[] })?.records"
										:key="item.logisticsChannelCode"
										:label="item.logisticsChannelName"
										:value="item.logisticsChannelCode"
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
