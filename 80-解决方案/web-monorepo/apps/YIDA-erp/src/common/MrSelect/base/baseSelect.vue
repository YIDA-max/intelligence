<!--
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2026-04-12 14:40:20
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-12 14:44:11
 * @FilePath: \qianyi-ui\src\common\MrSelect\base\index.vue
 * @Description: 
 * 
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved. 
-->
<!--
 * MrSelect Base — 纯 Element Plus el-select 封装，作为 MrSelect 系列基座。
 *
 * 用法与 el-select 一致：
 * - v-model：绑定值
 * - 其余属性（placeholder、clearable、multiple、filterable、disabled、style、class 等）
 *   写在 MrSelectBase 标签上，经 v-bind="$attrs" 传给内部 el-select
 * - 事件：@change、@visible-change 等同样写在标签上，会透传到 el-select
 * - 默认插槽：放 el-option
 -->
<template>
	<el-select ref="selectRef" v-model="model" v-bind="$attrs">
		<slot />
		<template v-if="$slots.prefix" #prefix>
			<slot name="prefix" />
		</template>
		<template v-if="$slots.header" #header>
			<slot name="header" />
		</template>
		<template v-if="$slots.empty" #empty>
			<slot name="empty" />
		</template>
		<template v-if="$slots.loading" #loading>
			<slot name="loading" />
		</template>
		<template v-if="$slots.tag" #tag="scope">
			<slot name="tag" v-bind="scope ?? {}" />
		</template>
	</el-select>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineOptions({
	name: 'MrSelectBase',
	/** 关闭自动透传，避免与 v-bind="$attrs" 重复；由模板显式绑定到 el-select */
	inheritAttrs: false,
});

const model = defineModel<any>();

const selectRef = ref<InstanceType<
	typeof import('element-plus')['ElSelect']
> | null>(null);

defineExpose({
	selectRef,
	focus: () => {
		selectRef.value?.focus();
	},
	blur: () => {
		selectRef.value?.blur();
	},
});
</script>
