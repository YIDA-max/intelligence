<template>
	<el-dialog
		v-model="visible"
		:title="title || '自定义导出工单'"
		width="800px"
		:close-on-click-modal="false"
		append-to-body
		draggable
	>
		<div class="export-dialog-body">
			<div v-for="(module, index) in modules" :key="index" class="module-item">
				<div class="module-header">
					<span class="module-title">{{ module.title }}</span>
					<el-link type="primary" @click="toggleSelectAll(index)">
						{{ isModuleAllSelected(index) ? '取消全选' : '全选' }}
					</el-link>
				</div>
				<div class="module-content">
					<el-checkbox-group v-model="selectedFields">
						<el-row :gutter="20">
							<el-col
								:span="6"
								v-for="option in module.options"
								:key="option.value"
							>
								<el-checkbox :label="option.value" :value="option.value">
									{{ option.label }}
								</el-checkbox>
							</el-col>
						</el-row>
					</el-checkbox-group>
				</div>
			</div>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleCancel">取 消</el-button>
				<el-button type="primary" @click="handleConfirm">导 出</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

defineOptions({ name: 'ExportFieldsDialog' });

interface Option {
	label: string;
	value: string;
}

interface ModuleConfig {
	title: string;
	key?: string;
	options: Option[];
}

const props = defineProps<{
	modelValue: boolean;
	title?: string;
	modules: ModuleConfig[];
	defaultsSelected?: ModuleConfig[];
}>();

const emit = defineEmits(['update:modelValue', 'confirm']);

const visible = computed({
	get: () => props.modelValue,
	set: (val) => emit('update:modelValue', val),
});

const selectedFields = ref<string[]>([]);

// 初始化选中状态：默认全选
watch(
	() => props.modelValue,
	(val) => {
		if (val) {
			const allFields: string[] = [];
			props.defaultsSelected?.forEach((mod) => {
				mod.options.forEach((opt) => {
					allFields.push(opt.value);
				});
			});
			selectedFields.value = allFields;
		}
	}
);

// 是否模块内全部选中
const isModuleAllSelected = (moduleIndex: number) => {
	const module = props.modules[moduleIndex];
	const moduleValues = module.options.map((opt) => opt.value);
	const selectedInModule = selectedFields.value.filter((val) =>
		moduleValues.includes(val)
	);
	return selectedInModule.length === moduleValues.length;
};

// 全选/取消全选
const toggleSelectAll = (moduleIndex: number) => {
	const module = props.modules[moduleIndex];
	const moduleValues = module.options.map((opt) => opt.value);
	const isAll = isModuleAllSelected(moduleIndex);

	if (isAll) {
		// 取消全选
		selectedFields.value = selectedFields.value.filter(
			(val) => !moduleValues.includes(val)
		);
	} else {
		// 全选
		const toAdd = moduleValues.filter(
			(val) => !selectedFields.value.includes(val)
		);
		selectedFields.value = [...selectedFields.value, ...toAdd];
	}
};

const handleOpen = () => {
	visible.value = true;
};

const handleCancel = () => {
	visible.value = false;
};

const handleConfirm = () => {
	emit('confirm', selectedFields.value);
	visible.value = false;
};

defineExpose({
	handleOpen,
	handleCancel,
	handleConfirm,
});
</script>

<style scoped lang="scss">
.export-dialog-body {
	max-height: 60vh;
	overflow-y: auto;
	padding: 0 20px;
}

.module-item {
	margin-bottom: 24px;

	&:last-child {
		margin-bottom: 0;
	}
}

.module-header {
	display: flex;
	align-items: center;
	margin-bottom: 12px;

	.module-title {
		font-size: 16px;
		font-weight: 500;
		color: #303133;
		margin-right: 12px;
	}
}

.module-content {
	padding-left: 0;
}

.mb-2 {
	margin-bottom: 8px;
}
</style>
