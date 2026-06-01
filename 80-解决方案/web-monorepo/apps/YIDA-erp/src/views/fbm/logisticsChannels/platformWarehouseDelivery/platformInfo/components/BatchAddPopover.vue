<template>
	<el-popover
		placement="bottom"
		:width="600"
		trigger="click"
		:hide-on-click="false"
		v-model:visible="visible"
	>
		<template #reference>
			<el-button type="primary" size="small"> 批量添加 </el-button>
		</template>
		<div class="batch-add-container">
			<div class="batch-add-item">
				<div class="batch-add-label">
					<span class="batch-add-title">平台仓实际承运商</span>
					<span class="batch-add-count"
						>已选 {{ formData.carriers?.length || 0 }} 个</span
					>
				</div>
				<el-select
					v-model="formData.carriers"
					multiple
					clearable
					filterable
					placeholder="请选择"
					style="width: 100%"
					collapse-tags
					collapse-tags-tooltip
					:teleported="false"
				>
					<el-option
						v-for="item in props.dictMap.carrieList['Amazon']"
						:key="item.name"
						:label="item.name"
						:value="item.name"
					/>
				</el-select>
			</div>
			<div class="batch-add-item">
				<div class="batch-add-label">
					<span class="batch-add-title">对应平台</span>
					<span class="batch-add-count"
						>已选 {{ formData.platforms?.length || 0 }} 个</span
					>
				</div>
				<el-select
					v-model="formData.platforms"
					multiple
					clearable
					filterable
					placeholder="请选择"
					style="width: 100%"
					collapse-tags
					collapse-tags-tooltip
					:teleported="false"
				>
					<el-option
						v-for="item in props.dictMap.platform"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
			</div>
			<div class="batch-add-tip">
				将批量新增平台仓实际承运商和对应平台的映射关系数量共：
				<span class="batch-add-count-result">
					{{
						(formData.carriers?.length || 0) * (formData.platforms?.length || 0)
					}}
					条
				</span>
				<span
					v-if="formData.carriers?.length && formData.platforms?.length"
					class="batch-add-formula"
				>
					（= {{ formData.carriers?.length }} ×
					{{ formData.platforms?.length }}）
				</span>
			</div>
			<div class="batch-add-actions">
				<el-button size="small" @click="handleCancel">取消</el-button>
				<el-button type="primary" size="small" @click="handleConfirm"
					>确认</el-button
				>
			</div>
		</div>
	</el-popover>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

// Props
const props = defineProps({
	dictMap: { type: Object, default: () => ({}) }, // 字典数据
});

// Emits
const emit = defineEmits(['confirm', 'cancel']);

// 弹窗显示状态
const visible = ref(false);

// 表单数据
const formData = reactive<{
	carriers: string[];
	platforms: string[];
}>({
	carriers: [],
	platforms: [],
});

// 取消
const handleCancel = () => {
	visible.value = false;
	formData.carriers = [];
	formData.platforms = [];
	emit('cancel');
};

// 确认
const handleConfirm = () => {
	emit('confirm', {
		carriers: [...formData.carriers],
		platforms: [...formData.platforms],
	});
};

// 关闭弹窗
const close = () => {
	visible.value = false;
};

// 重置表单
const reset = () => {
	formData.carriers = [];
	formData.platforms = [];
};

// 获取当前选择的数据
const getFormData = () => {
	return {
		carriers: [...formData.carriers],
		platforms: [...formData.platforms],
	};
};

// 暴露给父组件的方法和数据
defineExpose({
	close,
	reset,
	getFormData,
	formData,
});
</script>

<style lang="scss" scoped>
.batch-add-container {
	padding: 10px;
}
.batch-add-item {
	margin-bottom: 20px;
}
.batch-add-label {
	font-weight: 500;
	margin-bottom: 8px;
	color: #303133;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}
.batch-add-title {
	color: #333;
	font-weight: 600;
}
.batch-add-count {
	margin-top: 5px;
	color: #909399;
}
.batch-add-tip {
	margin: 20px 0;
	color: #333;
	font-weight: 600;
}
.batch-add-count-result {
	font-weight: bold;
}
.batch-add-formula {
	color: #909399;
	margin-left: 5px;
}
.batch-add-actions {
	display: flex;
	justify-content: flex-end;
	gap: 10px;
	margin-top: 20px;
}
</style>
