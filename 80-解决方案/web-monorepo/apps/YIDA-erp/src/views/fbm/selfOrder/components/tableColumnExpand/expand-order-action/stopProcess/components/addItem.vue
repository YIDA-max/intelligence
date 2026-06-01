<script setup lang="ts">
import { addItemObj } from '/@/api/admin/dict';
import { useMessage } from '/@/hooks/message';

const props = defineProps({
	dictId: {
		type: [String, Number],
		default: '',
	},
});
const name = ref('');
const popoverRef = ref<null | any>(null);
const visible = ref(false);
const emit = defineEmits(['submit']);
/**
 * 初始化
 */
const init = () => {
	visible.value = true;
	name.value = '';
};
/**
 * 提交新增
 */
const submit = async () => {
	if (!name.value) {
		useMessage().warning('请填写完整信息');
		return;
	}
	const res = await addItemObj({
		dictId: props.dictId,
		label: name.value,
		value: name.value,
		description: name.value,
		dictType: 'self_order_stop',
	});
	if (res.code === 0) {
		// 提交成功
		useMessage().success('创建成功');
		// 这里可以添加提交逻辑
		emit('submit');
		close();
	}
};

const close = () => {
	visible.value = false;
};

defineExpose({
	close,
});
</script>
<template>
	<div>
		<el-popover
			placement="top"
			trigger="click"
			:visible="visible"
			width="20%"
			ref="popoverRef"
		>
			<template #default>
				<el-row class="mb-2">
					<el-col :span="12" class="flex">
						<span
							:style="{
								color: '#f78c8c',
								marginRight: '3px',
							}"
						>
							*
						</span>
						禁止处理原因名称
					</el-col>
				</el-row>
				<el-row class="mb-2">
					<el-col :span="24" class="flex">
						<el-input
							placeholder="请输入"
							v-model="name"
							maxlength="50"
						></el-input>
					</el-col>
				</el-row>
				<el-row class="flex" style="justify-content: flex-end; gap: 8px">
					<el-button
						@click="
							() => {
								visible = false;
							}
						"
						>取消</el-button
					>
					<el-button
						type="primary"
						@click="
							() => {
								submit();
							}
						"
					>
						创建原因
					</el-button>
				</el-row>
			</template>
			<template #reference>
				<el-link underline="never" type="primary" @click="init"> 创建</el-link>
			</template>
		</el-popover>
	</div>
</template>

<style scoped></style>
