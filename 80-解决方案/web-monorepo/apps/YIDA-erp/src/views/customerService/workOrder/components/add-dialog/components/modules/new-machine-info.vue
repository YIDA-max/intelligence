<script setup lang="ts">
import { ref, watch } from 'vue';
import type { FormInstance } from 'element-plus';
import { Plus, Close } from '@element-plus/icons-vue';

/**
 * 接收父组件传递的属性
 * @property {string} dialogType - 弹窗类型：add | edit | copy | detail
 * @property {Array} data - 初始化数据
 */
const props = defineProps({
	dialogType: {
		type: String,
		default: 'add',
	},
	data: {
		type: Array,
		default: () => [],
	},
});
const formRef = ref<FormInstance>();
const formData = ref({
	list: [{ date: '', orderNo: '' }] as any[],
});

const rules = {
	date: [
		{
			required: true,
			message: '请选择补发新机日期',
			trigger: ['blur', 'change'],
		},
	],
};

/**
 * 设置表单数据
 * @param {Array} data - 包含补发新机信息的数组
 */
const setData = (data: any) => {
	// data is already mapped
	formData.value.list = data;
};

// 监听 props.data 变化，自动设置数据
watch(
	() => props.data,
	(val) => {
		if (val && val.length > 0) {
			setData(val);
		}
	},
	{ immediate: true, deep: true }
);

/**
 * 获取表单数据并进行验证
 * @returns {Promise<Array>} 返回验证通过后的补发新机数据数组
 */
const getData = async () => {
	if (!formRef.value) return Promise.reject('Form not initialized');
	await formRef.value.validate();
	return formData.value.list.map((item) => ({
		reshipNewDate: item.date,
		reshipNewTrackingNo: item.orderNo,
		reshipNewAttachments: [], // 目前 UI 无上传
	}));
};

/**
 * 添加一条补发记录
 */
const add = () => {
	formData.value.list.push({ date: '', orderNo: '' });
};

/**
 * 删除一条补发记录
 * @param {number} index - 要删除的记录索引
 */
const remove = (index: number) => {
	formData.value.list.splice(index, 1);
};

defineExpose({ setData, getData });
</script>

<template>
	<div class="mb-4">
		<div class="border-l-4 border-blue-500 pl-2 font-bold mb-4 text-base">
			补发新机记录
		</div>
		<el-form ref="formRef" :model="formData" label-width="120px">
			<div
				v-for="(item, index) in formData.list"
				:key="index"
				class="flex items-start mb-4"
			>
				<div class="flex-1">
					<el-row :gutter="20">
						<el-col :span="8">
							<el-form-item
								label="补发新机日期"
								:prop="`list.${index}.date`"
								:rules="rules.date"
							>
								<el-date-picker
									v-model="item.date"
									type="datetime"
									value-format="YYYY-MM-DD HH:mm:ss"
									placeholder="请选择日期"
									:disabled="props.dialogType === 'detail'"
									class="w-full"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item
								label="补发新机单号"
								:prop="`list.${index}.orderNo`"
							>
								<el-input
									v-model="item.orderNo"
									maxlength="50"
									show-word-limit
									placeholder="请输入"
									:disabled="props.dialogType === 'detail'"
								/>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
				<div class="ml-2 mt-1 w-[80px]">
					<el-icon
						v-if="index === 0 && props.dialogType !== 'detail'"
						@click="add"
						><Plus
					/></el-icon>
					<el-icon
						v-else-if="index !== 0 && props.dialogType !== 'detail'"
						@click="remove(index)"
						><Close
					/></el-icon>
				</div>
			</div>
		</el-form>
	</div>
</template>
