<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 15:21:52
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-11-13 11:03:35
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\components\model-info\warehouse-shipping\shipToThreeWarehouseAndLogisticsChannel\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { inject, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { getWarehouseLogisticsChannelTree } from '/@/api/fbm/logisticsChannel/platformLogistics/index';
const { t } = useI18n();
const dictMap = inject<Ref<any>>('dictMap');
/**
 * 关于使用in的获取到validateForm的值
 * @param value
 */
const isInToValidateForm = (
	isBelong: string,
	code: string,
	formRefValue: Array<string>
) => {
	// 属于
	if (isBelong === '1') {
		const getFormData = {
			[`${code}`]: `${code} in [${formRefValue.map((item) => `'${item}'`)}]`,
		};
		return getFormData;
	} else if (isBelong === '2') {
		// 不属于
		const getFormData = {
			[`${code}`]: `!(${code} in [${formRefValue.map((item) => `'${item}'`)}])`,
		};
		return getFormData;
	}
};

/**
 * 关于使用in的设置回显值
 * @param value
 */
const isInToSetFormData = (
	data: Record<string, any>,
	code: string,
	formData: Record<string, any>
) => {
	// 设置数据
	if (!data || !data[code]) {
		return '错误：无效的数据格式';
	}
	// 用于匹配是否排除指定平台的正则表达式(需要优先匹配 排除平台)
	const regex = new RegExp(`!\\(${code} in \\[([^\\]]+)\\]\\)`);
	const excludeMatch = data[code].match(regex);
	if (excludeMatch) {
		formData.value.isBelong = '2';
		formData.value[code] = excludeMatch[1]
			.split(',') // 切割字符串
			.map((item: string) => item.trim().replace(/'/g, '')) // 去除空格和引号
			.map((item: string) => (isNaN(Number(item)) ? item : Number(item))); // 转换为数字（如果可能）
		return '成功设置数据：排除指定平台';
	}
	// 用于匹配是否包含指定平台的正则表达式
	const regexInclude = new RegExp(`${code} in \\[([^\\]]+)\\]`);
	const match = data[code].match(regexInclude);
	if (match) {
		formData.value.isBelong = '1';
		formData.value[code] = match[1]
			.split(',') // 切割字符串
			.map((item: string) => item.trim().replace(/'/g, '')) // 去除空格和引号
			.map((item: string) => (isNaN(Number(item)) ? item : Number(item))); // 转换为数字（如果可能）
		return '成功设置数据：包含指定平台';
	}
	return '错误：无法解析数据格式';
};

// 表单数据
const formData = ref<Record<string, any>>({
	isWarehouseCodeBelong: '1', // 是否属于 三方仓仓库
	isLogisticsChannel: '1', // 是否属于 物流渠道
	warehouseCode: [], // 三方仓仓库
	logisticsChannel: [], // 物流渠道
});
const formRef = ref<any>(null);
// 表单校验
const rules = ref({
	warehouseCode: [
		{ required: true, message: '请选择三方仓仓库', trigger: 'blur' },
	],
});
// 物流渠道的数据
const logisticsChanneloptions = ref<
	Array<{ logisticsChannelCode: string; logisticsChannelName: string }>
>([]);

// 初始化函数
const init = () => {
	// 重置数据
	formData.value = {
		isWarehouseCodeBelong: '1', // 是否属于 三方仓仓库
		isLogisticsChannel: '1', // 是否属于 物流渠道
		warehouseCode: [], // 三方仓仓库
		logisticsChannel: [], // 物流渠道
	};
};
// 根据仓库代码获取渠道数据的辅助方法
const getChannelDataByWarehouseCodes = async () => {
	let channelData = [];
	const res = await getWarehouseLogisticsChannelTree({
		warehouseCodes: formData.value.warehouseCode,
		status: 1,
	});

	if (res.code === 0) {
		channelData = res.data;
	}

	return channelData;
};

/**
 * 获取物流渠道选项
 */
const handleGetLogisticsChannelOptions = async () => {
	if (formData.value.warehouseCode && formData.value.warehouseCode.length > 0) {
		// 获取物流渠道数据
		logisticsChanneloptions.value = await getChannelDataByWarehouseCodes();
	}
	// 清空已选择的物流渠道
	formData.value.logisticsChannel = [];
};

// 获取提交值
const validateForm = async () => {
	await formRef.value.validate();
	return {
		...isInToValidateForm(
			formData.value.isWarehouseCodeBelong,
			'warehouseCode',
			formData.value.warehouseCode
		),
		...isInToValidateForm(
			formData.value.isLogisticsChannel,
			'logisticsChannel',
			formData.value.logisticsChannel
		),
	};
};
// 设置回显值
const setFormData = async (data: Record<string, any>) => {
	// 根据返回值确定isWarehouseCodeBelong  和 isLogisticsChannel 查找是否存在!
	if (data?.warehouseCode.includes('!')) {
		formData.value.isWarehouseCodeBelong = '2';
	} else {
		formData.value.isWarehouseCodeBelong = '1';
	}
	if (data?.logisticsChannel.includes('!')) {
		formData.value.isLogisticsChannel = '2';
	} else {
		formData.value.isLogisticsChannel = '1';
	}
	// 设置数据
	isInToSetFormData(data, 'warehouseCode', formData);
	// 获取物流渠道选项
	await handleGetLogisticsChannelOptions();
	isInToSetFormData(data, 'logisticsChannel', formData);
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
					<el-form-item :label="t('仓库')" prop="warehouseCode">
						<el-row style="width: 100%" class="mb-2">
							<el-col :span="4">
								<el-select
									v-model="formData.isWarehouseCodeBelong"
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
									v-model="formData.warehouseCode"
									clearable
									filterable
									multiple
									placeholder="三方仓仓库"
									style="width: 100%"
									@change="handleGetLogisticsChannelOptions"
								>
									<el-option
										v-for="item in dictMap.warehouseList"
										:key="item.warehouseCode"
										:label="item.warehouseName"
										:value="
											isNaN(item.warehouseCode)
												? item.warehouseCode.toString()
												: Number(item.warehouseCode)
										"
									/>
								</el-select>
							</el-col>
						</el-row>
					</el-form-item>
					<el-form-item :label="t('物流')" prop="logisticsChannel">
						<el-row style="width: 100%">
							<el-col :span="4">
								<el-select
									v-model="formData.isLogisticsChannel"
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
								<el-cascader
									class="cascader-eq"
									v-model="formData.logisticsChannel"
									clearable
									collapse-tags
									:options="logisticsChanneloptions"
									filterable
									:props="{
										multiple: true,
										label: 'name',
										value: 'id',
										children: 'children',
										emitPath: false, // ✅ 只返回最后一个 id
										checkStrictly: false, // 默认即可，确保联动
										leafOnly: true, // ✅ 只允许选最后一级
									}"
									style="width: 100%"
								>
								</el-cascader>
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
.dialog-container {
	padding: 0 20px;
	height: 40vh;
	overflow: auto;
}
.mb18 {
	margin-bottom: 18px;
}
/* 目标：与其它表单项一致，默认 32px；*/
:deep(.cascader-eq .el-input__wrapper) {
	min-height: 32px;
	height: 32px;
	padding-top: 2px; /* 让内容垂直居中 */
	padding-bottom: 2px;
}
/* 目标：与其它表单项一致，默认 32px；*/
:deep(.cascader-eq .el-input__inner) {
	min-height: 32px;
	height: 32px;
	padding-top: 2px; /* 让内容垂直居中 */
	padding-bottom: 2px;
}

/* multiple 模式的标签容器，避免把输入框“压矮” */
:deep(.cascader-eq .el-cascader__tags) {
	display: flex;
	align-items: center;
	// margin-top: 15px; /* 去掉多余顶边距 */
	line-height: 20px;
}

/* 标签本身稍微压缩，防止撑高 */
:deep(.cascader-eq .el-tag) {
	height: 20px;
	line-height: 20px;
	padding: 0 6px;
	font-size: 12px;
}

/* 输入文字的行高 */
:deep(.cascader-eq .el-input__inner) {
	line-height: 28px;
}
</style>
