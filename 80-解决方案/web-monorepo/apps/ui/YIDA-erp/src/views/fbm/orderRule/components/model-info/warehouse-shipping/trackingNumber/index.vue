<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 16:51:25
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-29 16:41:40
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\components\model-info\warehouse-shipping\shipToPostalCodeFilter\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// 表单数据
const formData = ref<Record<string, any>>({
	headerBegin: [], // 跟踪号开头位数
	beginCheckFlag: [], // 跟踪号开头（复选框） 0-没有勾选 1-有勾选
	beginList: [], // 跟踪号开头列表
	includeCheckFlag: [], // 跟踪号包含（复选框） 0-没有勾选 1-有勾选
	includeList: [], // 跟踪号包含列表
	beginAndIncludeCheckFlag: [], // 以上两项满足其中一项（复选框） 0-没有勾选 1-有勾选
});
const formRef = ref<any>(null);

/** 「以上两项满足其中一项」：仅当「跟踪号」「跟踪号包含」均已勾选时可勾选，否则置灰 */
const thirdCheckboxDisabled = computed(
	() =>
		!(
			formData.value.beginCheckFlag?.length &&
			formData.value.includeCheckFlag?.length
		)
);

watch(thirdCheckboxDisabled, (disabled) => {
	if (disabled) {
		formData.value.beginAndIncludeCheckFlag = [];
	}
});
// 表单校验

const init = () => {
	// 重置数据
	formData.value = {
		headerBegin: [], // 跟踪号开头位数
		beginCheckFlag: [], // 跟踪号开头（复选框） 0-没有勾选 1-有勾选
		beginList: [], // 跟踪号开头列表
		includeCheckFlag: [], // 跟踪号包含（复选框） 0-没有勾选 1-有勾选
		includeList: [], // 跟踪号包含列表
		beginAndIncludeCheckFlag: [], // 以上两项满足其中一项（复选框） 0-没有勾选 1-有勾选
	};
};

// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	// 如果选中了邮编开头就必须要有邮编开头列表
	if (
		formData.value.beginCheckFlag.length &&
		!formData.value.beginList.length
	) {
		return Promise.reject('请填写邮编开头列表');
	}
	// 如果选中了邮编包含就必须要有邮编包含列表
	if (
		formData.value.includeCheckFlag.length &&
		!formData.value.includeList.length
	) {
		return Promise.reject('请填写邮编包含列表');
	}

	// // 指定邮编列表和排除邮编列表不能有重复值
	// const intersection = new Set([...specifySet].filter((x) => excludeSet.has(x)));
	// if (intersection.size > 0) {
	// 	return Promise.reject('指定邮编列表和排除邮编列表不能有重复值');
	// }
	// 构建返回的数据格式
	const getFormData = {
		headerBegin: formData.value.headerBegin, // 跟踪号开头位数
		beginCheckFlag: formData.value.beginCheckFlag.length ? 1 : 0, // 邮编开头（复选框） 0-没有勾选 1-有勾选
		beginList: formData.value.beginList, // 邮编开头列表
		includeCheckFlag: formData.value.includeCheckFlag.length ? 1 : 0, // 邮编包含（复选框） 0-没有勾选 1-有勾选
		includeList: formData.value.includeList, // 邮编包含列表
		beginAndIncludeCheckFlag: formData.value.beginAndIncludeCheckFlag.length
			? 1
			: 0, // 以上两项满足其中一项（复选框） 0-没有勾选 1-有勾选
	};
	return {
		logisticsTrackingNo: JSON.stringify(getFormData),
	};
};
// 设置回显值
const setFormData = (data: Record<string, any>) => {
	if (!data || !data.logisticsTrackingNo) {
		return '错误：无效的数据格式';
	}
	const logisticsTrackingNo = JSON.parse(data.logisticsTrackingNo || '{}');
	formData.value = {
		...formData.value,
		headerBegin: logisticsTrackingNo?.headerBegin || [], // 跟踪号开头位数
		beginCheckFlag: logisticsTrackingNo?.beginCheckFlag === 1 ? [1] : [], // 邮编开头（复选框） 0-没有勾选 1-有勾选
		beginList: logisticsTrackingNo?.beginList || [], // 邮编开头列表
		includeCheckFlag: logisticsTrackingNo?.includeCheckFlag === 1 ? [1] : [], // 邮编包含（复选框） 0-没有勾选 1-有勾选
		includeList: logisticsTrackingNo?.includeList || [], // 邮编包含列表
		beginAndIncludeCheckFlag:
			logisticsTrackingNo?.beginAndIncludeCheckFlag === 1 ? [1] : [], // 以上两项满足其中一项（复选框） 0-没有勾选 1-有勾选
	};
	return null;
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
		<el-form :model="formData" ref="formRef" label-width="150px">
			<el-row class="base-info" :gutter="20">
				<el-col :span="24">
					<el-form-item :label="t('跟踪号')" prop="emptyFlag">
						<el-card style="width: 100%" class="mt-2" shadow="never">
							<el-row style="width: 100%">
								<el-col :span="24">
									<div class="flex items-center mb-4 gap-2">
										<el-checkbox-group v-model="formData.beginCheckFlag">
											<el-checkbox label="跟踪号" :value="1" />
										</el-checkbox-group>
										<el-input-number
											style="width: 120px"
											v-model="formData.headerBegin"
											:min="1"
											:max="10"
											controls-position="right"
										/>
										<div style="flex-shrink: 0">位开头为</div>
									</div>

									<el-input-tag v-model="formData.beginList" trigger="Enter" />
								</el-col>
							</el-row>
							<el-row style="width: 100%">
								<el-col :span="24">
									<el-checkbox-group v-model="formData.includeCheckFlag">
										<el-checkbox label="跟踪号包含" :value="1" />
									</el-checkbox-group>
									<el-input-tag
										v-model="formData.includeList"
										trigger="Enter"
									/>
								</el-col>
							</el-row>
							<el-row
								style="width: 100%"
								class="mb-2"
								:style="{
									borderBottom: '1px solid #e4e7ed',
									padding: '10px 0px',
								}"
							>
								<el-col :span="24">
									<el-checkbox-group
										v-model="formData.beginAndIncludeCheckFlag"
										:disabled="thirdCheckboxDisabled"
									>
										<el-checkbox label="以上两项满足其中一项" :value="1" />
									</el-checkbox-group>
								</el-col>
							</el-row>
						</el-card>
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
:deep(.el-radio__input.is-checked + .el-radio__label) {
	color: #606266;
}
:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
	color: #606266;
}
</style>
