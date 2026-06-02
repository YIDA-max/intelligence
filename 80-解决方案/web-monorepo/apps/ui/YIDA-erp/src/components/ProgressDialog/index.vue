<template>
	<el-dialog
		:title="title"
		v-model="visibleInternal"
		:close-on-click-modal="false"
		draggable
		width="420px"
		@close="handleClose"
	>
		<div style="padding: 18px">
			<el-progress :percentage="percentage" :text-inside="false" />
		</div>
		<template #footer>
			<el-button @click="handleClose">关闭</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue';

const props = defineProps({
	// 控制显示
	modelValue: { type: Boolean, default: false },
	// 初始展示标题
	title: { type: String, default: '导入进度' },
	// 假进度最大值（到达后等待后端完成）
	maxFake: { type: Number, default: 99 },
	// 假进度更新时间(ms)
	intervalMs: { type: Number, default: 1000 },
});
const emit = defineEmits(['update:modelValue', 'close']);
// 可见性内部状态（与 v-model 双向）
const visibleInternal = ref<boolean>(props.modelValue);

watch(
	() => props.modelValue,
	(v) => (visibleInternal.value = v)
);

// 自动在可见时启动假进度，隐藏时停止
watch(visibleInternal, (v) => {
	emit('update:modelValue', v);
	// 延迟一点避免同步开两个动画冲突
	startFakeProgress(0);
	if (!v) {
		emit('close');
		stopFakeProgress();
	}
});

// 进度与定时器
const percentage = ref<number>(0);
let timer: ReturnType<typeof setInterval> | null = null;

function clearTimer() {
	if (timer) {
		clearInterval(timer);
		timer = null;
	}
}

// 开始假进度：缓慢增长直到 maxFake（先快后慢）
const startFakeProgress = (startFrom = 0) => {
	clearTimer();
	if (percentage.value >= props.maxFake) return;
	percentage.value = Math.max(0, Math.min(100, startFrom));
	if (!visibleInternal.value) visibleInternal.value = true;
	if (percentage.value >= 100) return;

	timer = setInterval(() => {
		// 根据当前进度计算增量：进度越高，增量越小（非线性减速）
		const currentPercent = percentage.value;
		// 定义一个"缓慢开始点" 在这个点之前用一个比例，之后用另一个比例
		const slowStartPoint = 90; // 90% 开始变慢

		let progressRatio: number;

		if (currentPercent < slowStartPoint) {
			// 0% ~ 90%：使用二次方减速
			progressRatio = currentPercent / slowStartPoint;
			const maxInc = 10; // 初始最大增量
			const minInc = 0.1; // 最小增量
			const inc = (
				maxInc -
				(maxInc - minInc) * (progressRatio * progressRatio)
			).toFixed(2);

			percentage.value = Number(
				Math.min(props.maxFake, percentage.value + Number(inc)).toFixed(2)
			);
		} else {
			// 90% ~ 99%：使用四次方实现极其缓慢的增长
			// 将 90-99 范围映射到 0-1
			progressRatio =
				(currentPercent - slowStartPoint) / (props.maxFake - slowStartPoint);
			const maxInc = 0.2; // 这个范围的初始增量
			const minInc = 0.01; // 这个范围的最小增量
			const inc = (maxInc - (maxInc - minInc) * progressRatio ** 4) // 四次方，极其缓慢
				.toFixed(3);

			if (currentPercent < props.maxFake) {
				percentage.value = Number(
					Math.min(props.maxFake, percentage.value + Number(inc)).toFixed(2)
				);
			} else {
				clearTimer();
			}
		}
	}, props.intervalMs);
};

// 外部可调用，直接设置当前进度（例如后端上报真实 percent）
const setPercent = (p: number) => {
	if (typeof p !== 'number' || isNaN(p)) return;
	const clamped = Math.max(0, Math.min(99, Math.floor(p)));
	percentage.value = clamped;
	// 如果接收到接近 100 的服务端进度，不直接关闭，由 complete 控制最终 100
};

// 完成：进度跳到 100 并自动关闭弹窗（可配置延时）
const complete = async (delay = 300) => {
	clearTimer();
	percentage.value = 100;
	// 可让用户看到 100% 再关闭
	await new Promise((r) => setTimeout(r, delay));
	visibleInternal.value = false;
	// 重置进度（关闭动画完成后）
	await new Promise((r) => setTimeout(r, 150));
	percentage.value = 0;
};
// 取消/停止（外部可调用）

const stopFakeProgress = () => {
	clearTimer();
	visibleInternal.value = false;
};

onBeforeUnmount(() => {
	clearTimer();
});

const handleClose = () => {
	stopFakeProgress();
};

defineExpose({
	open: () => (visibleInternal.value = true),
	close: () => (visibleInternal.value = false),
	startFakeProgress,
	stopFakeProgress,
	complete,
	setPercent,
	getPercent: () => percentage.value,
});
</script>

<style scoped>
/* 可按需样式调整 */
</style>
