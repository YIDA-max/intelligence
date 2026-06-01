<!--
 * MrSelect Base Option — 纯 Element Plus el-option 封装，与 baseSelect 配套作为基座。
 *
 * 用法与 el-option 一致：
 * - label、value、disabled 等写在组件标签上，经 v-bind="$attrs" 传给内部 el-option
 * - 默认插槽：自定义选项展示内容（与 el-option 一致，有插槽时可省略 label 或配合使用）
 *
 * @example
 * <MrSelectBase v-model="id">
 *   <MrSelectBaseOption label="A" :value="1" />
 *   <MrSelectBaseOption :value="2">自定义内容</MrSelectBaseOption>
 * </MrSelectBase>
 -->
<template>
	<el-option ref="optionRef" v-bind="$attrs">
		<slot />
	</el-option>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineOptions({
	name: 'MrSelectBaseOption',
	inheritAttrs: false,
});

const optionRef = ref<InstanceType<
	typeof import('element-plus')['ElOption']
> | null>(null);

defineExpose({
	optionRef,
});
</script>
