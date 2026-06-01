<script setup lang="ts">
import { CURVE_NAMES } from '/@/utils/curveLoader';
import MrCurveLoader from './index.vue';
</script>

<template>
	<div class="mr-curve-loader-demo">
		<p class="mr-curve-loader-demo__hint">
			21 条内置曲线预览（源自 Paidax01/math-curve-loaders）
		</p>
		<div class="mr-curve-loader-demo__grid">
			<div
				v-for="curveName in CURVE_NAMES"
				:key="curveName"
				class="mr-curve-loader-demo__card"
			>
				<MrCurveLoader :name="curveName" :size="112" color="#409eff" />
				<span class="mr-curve-loader-demo__label">{{ curveName }}</span>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.mr-curve-loader-demo {
	padding: 24px;
}

.mr-curve-loader-demo__hint {
	margin: 0 0 16px;
	font-size: 14px;
	color: var(--el-text-color-secondary);
}

.mr-curve-loader-demo__grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
	gap: 16px;
}

.mr-curve-loader-demo__card {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	padding: 12px;
	border: 1px solid var(--el-border-color-lighter);
	border-radius: 8px;
	background: var(--el-fill-color-blank);
}

.mr-curve-loader-demo__label {
	font-size: 12px;
	text-align: center;
	color: var(--el-text-color-regular);
	line-height: 1.35;
}
</style>
