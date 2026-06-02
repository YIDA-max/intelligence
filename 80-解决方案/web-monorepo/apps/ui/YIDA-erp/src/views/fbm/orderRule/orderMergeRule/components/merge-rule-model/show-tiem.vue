<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-14 20:08:07
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-22 14:52:28
 * @FilePath: \qianyi-ui\src\views\fbm\orderRule\orderMergeRule\components\merge-rule-model\show-tiem.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->

<script setup lang="ts">
import { useMessage } from '/@/hooks/message';
import { ref } from 'vue';
const props = defineProps({
	releaseTime: {
		type: String,
		default: () => '[]',
	},
});
const emit = defineEmits(['onSubmit']);
const loading = ref(false);
const dialogVisible = ref(false);
const setTimeData = ref([
	{
		time: '',
	},
]);
// 添加时间
const addTime = () => {
	setTimeData.value.push({ time: '' });
};

// 删除时间
const delTime = (index: number) => {
	if (setTimeData.value.length > 1) {
		setTimeData.value.splice(index, 1);
	} else {
		useMessage().warning('至少保留一个时间');
	}
};
// 检查时间是否重复
const checkTime = (index: number) => {
	const currentTime = setTimeData.value[index].time;
	// 检查当前时间是否与其他时间重复
	const isDuplicate = setTimeData.value.some((item, idx) => item.time === currentTime && idx !== index);
	if (isDuplicate) {
		useMessage().error('时间不能重复');
		setTimeData.value[index].time = ''; // 清空重复的时间
	}
};

const show = () => {
	dialogVisible.value = true;
};
const hide = () => {
	dialogVisible.value = false;
};

const handleOpen = () => {
	if (props.releaseTime) {
		setTimeData.value = JSON.parse(props.releaseTime)?.map((time: string) => ({
			time,
		}));
		// 判断一下如果解析出来的数据为空数组，则添加一个默认时间对象
		if (setTimeData.value.length === 0) {
			setTimeData.value.push({ time: '' });
		}
	}
};

// 提交
const onSubmit = async () => {
	loading.value = true;
	try {
		const times = setTimeData.value.map((item) => item.time).filter((time) => time); // 过滤掉空时间
		emit('onSubmit', JSON.stringify(times));
		// 关闭弹窗
		hide();
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('提交失败:', error);
	} finally {
		loading.value = false;
	}
};
defineExpose({
	show,
	hide,
});
</script>
<template>
	<el-dialog
		v-model="dialogVisible"
		width="30%"
		:close-on-click-modal="false"
		draggable
		@open="handleOpen"
		:append-to-body="true"
		title="放单时间设置"
	>
		<div>
			<div v-for="(item, index) in setTimeData" :key="index" class="mb-4">
				<el-row>
					<el-col :span="20">
						<el-time-picker v-model="item.time" placeholder="请选择时间" value-format="HH:mm:ss" @change="checkTime(index)" />
					</el-col>
					<el-col :span="2" class="flex items-center justify-center">
						<el-icon><Plus @click="addTime" /></el-icon>
					</el-col>
					<el-col :span="2" class="flex items-center justify-center">
						<el-icon><Minus @click="delTime(index)" /></el-icon>
					</el-col>
				</el-row>
			</div>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="hide">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">{{ $t('确定') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<style lang="less" scoped></style>
