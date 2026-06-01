<!--
 * 展开行视口懒渲染：进入视口（含 rootMargin）后再挂载槽内容，减轻虚拟滚动下列表仍卡顿的问题。
-->
<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';

const props = withDefaults(
	defineProps<{
		/** 行唯一键；变化时重置懒加载状态（虚拟列表复用行时必传） */
		rowKey: string | number;
		/** 略微提前挂载正文，减少滚动时空白闪烁 */
		rootMargin?: string;
	}>(),
	{
		rootMargin: '120px 0px 160px 0px',
	}
);

const rootRef = ref<HTMLElement | null>(null);
/** 已进入过视口则保持为 true，避免快速滚动时反复挂载/卸载 */
const visible = ref(false);

let observer: IntersectionObserver | null = null;

const setupObserver = () => {
	observer?.disconnect();
	observer = null;
	const el = rootRef.value;
	if (!el) return;

	observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					visible.value = true;
					observer?.disconnect();
					observer = null;
					return;
				}
			}
		},
		{
			root: null,
			rootMargin: props.rootMargin,
			threshold: 0,
		}
	);
	observer.observe(el);
};

watch(
	() => props.rowKey,
	() => {
		visible.value = false;
		nextTick(() => setupObserver());
	}
);

onMounted(() => {
	nextTick(() => setupObserver());
});

onBeforeUnmount(() => {
	observer?.disconnect();
	observer = null;
});
</script>

<template>
	<div ref="rootRef" class="expand-lazy">
		<div v-if="!visible" class="expand-lazy-placeholder" aria-hidden="true" />
		<div v-show="visible" class="expand-lazy-slot">
			<slot />
		</div>
	</div>
</template>

<style scoped lang="scss">
.expand-lazy {
	width: 100%;
	min-width: 0;
}

.expand-lazy-placeholder {
	min-height: 220px;
	border-radius: 4px;
	background-color: #f5f7fa;
	border: 1px dashed #e4e7ed;
	box-sizing: border-box;
}

.expand-lazy-slot {
	width: 100%;
	min-width: 0;
}
</style>
