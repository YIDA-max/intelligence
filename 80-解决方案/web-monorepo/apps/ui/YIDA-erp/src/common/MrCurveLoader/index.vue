<script setup lang="ts">
import {
	computed,
	onBeforeUnmount,
	onMounted,
	reactive,
	ref,
	watch,
} from 'vue';
import {
	buildPath,
	getDetailScale,
	getParticle,
	getRotation,
	mergeCurveConfig,
} from '/@/utils/curveLoader';
import type { CurveName, ICurveConfig } from '/@/utils/curveLoader';

/** 与 CONTROL_DEFS 中 particleCount.max 一致 */
const MAX_PARTICLE_SLOTS = 140;

interface Props {
	/** 内置曲线名称，默认 Original Thinking */
	name?: CurveName;
	/** 覆盖默认参数（particleCount、durationMs 等） */
	config?: Partial<ICurveConfig>;
	/** 渲染宽高（像素或带单位字符串），默认 120 */
	size?: number | string;
	/** 描边与粒子颜色，默认 currentColor */
	color?: string;
	/** 是否运行动画，默认 true */
	running?: boolean;
	/** 背景路径采样步数，默认 480 */
	steps?: number;
	/** 是否绘制底层轨迹 path，默认 true */
	showPath?: boolean;
	/** 底层 path 不透明度，默认 0.1 */
	pathOpacity?: number;
}

const props = withDefaults(defineProps<Props>(), {
	name: 'Original Thinking',
	config: undefined,
	size: 120,
	color: 'currentColor',
	running: true,
	steps: 480,
	showPath: true,
	pathOpacity: 0.1,
});

const mergedConfig = computed(() => mergeCurveConfig(props.name, props.config));

const sizeStyle = computed(() => {
	const s = props.size;
	const v = typeof s === 'number' ? `${s}px` : s;
	return { width: v, height: v };
});

const pathD = ref('');
const rotationDeg = ref(0);

const dots = reactive(
	Array.from({ length: MAX_PARTICLE_SLOTS }, () => ({
		cx: 50,
		cy: 50,
		r: 0,
		opacity: 0,
	}))
);

const startTime = ref(0);
const phaseOffset = ref(0);
/** 内部播放状态（可与 props.running 同步） */
const playing = ref(props.running);
let rafId = 0;

watch(
	() => props.running,
	(v) => {
		playing.value = v;
	}
);

watch(playing, (v) => {
	if (v) {
		startLoop();
	} else if (rafId) {
		cancelAnimationFrame(rafId);
		rafId = 0;
	}
});

watch(
	() => [props.name, props.config] as const,
	() => {
		startTime.value = performance.now();
	},
	{ deep: true }
);

function tick(now: number) {
	if (!playing.value) {
		rafId = 0;
		return;
	}
	const cfg = mergedConfig.value;
	const elapsed = now - startTime.value;
	const ph = phaseOffset.value;
	const progress =
		((elapsed + ph * cfg.durationMs) % cfg.durationMs) / cfg.durationMs;
	const detailScale = getDetailScale(elapsed, cfg, ph);
	rotationDeg.value = getRotation(elapsed, cfg, ph);
	pathD.value = buildPath(cfg, detailScale, props.steps);
	const n = Math.min(cfg.particleCount, MAX_PARTICLE_SLOTS);
	for (let i = 0; i < MAX_PARTICLE_SLOTS; i++) {
		if (i >= n) {
			dots[i].opacity = 0;
			continue;
		}
		const p = getParticle(cfg, i, progress, detailScale);
		dots[i].cx = p.x;
		dots[i].cy = p.y;
		dots[i].r = p.radius;
		dots[i].opacity = p.opacity;
	}
	rafId = requestAnimationFrame(tick);
}

function startLoop() {
	if (rafId) {
		return;
	}
	rafId = requestAnimationFrame(tick);
}

function start() {
	playing.value = true;
}

function stop() {
	playing.value = false;
}

function restart() {
	startTime.value = performance.now();
	playing.value = true;
}

onMounted(() => {
	phaseOffset.value = Math.random();
	startTime.value = performance.now();
	if (playing.value) {
		startLoop();
	}
});

onBeforeUnmount(() => {
	if (rafId) {
		cancelAnimationFrame(rafId);
		rafId = 0;
	}
});

defineExpose({ start, stop, restart });
</script>

<template>
	<svg
		class="mr-curve-loader"
		viewBox="0 0 100 100"
		:style="sizeStyle"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g :transform="`rotate(${rotationDeg} 50 50)`">
			<path
				v-if="showPath"
				:d="pathD"
				:stroke="color"
				:stroke-width="mergedConfig.strokeWidth"
				stroke-linecap="round"
				stroke-linejoin="round"
				:opacity="pathOpacity"
			/>
			<circle
				v-for="(d, idx) in dots"
				:key="idx"
				:cx="d.cx.toFixed(2)"
				:cy="d.cy.toFixed(2)"
				:r="d.r.toFixed(2)"
				:opacity="d.opacity.toFixed(3)"
				:fill="color"
			/>
		</g>
	</svg>
</template>

<style scoped lang="scss">
.mr-curve-loader {
	display: block;
	overflow: visible;
	flex-shrink: 0;
}
</style>
