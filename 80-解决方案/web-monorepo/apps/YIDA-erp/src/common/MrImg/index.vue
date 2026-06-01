<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-01-07 18:08:55
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-01-09 17:02:17
 * @FilePath: \qianyi-ui\src\common\MrImg\index.vue
 * @Description: 
 * 
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved. 
-->

<script setup lang="ts">
// 定义组件 name
defineOptions({
	name: 'MrImg',
});
const props = defineProps({
	src: {
		type: String,
		default: '',
		required: true,
	},
	width: {
		type: [String, Number],
		default: 70,
	},
	height: {
		type: [String, Number],
		default: 70,
	},
	borderRadius: {
		type: [String, Number],
		default: 0,
	},
});
// 获取所有未被 props 声明的 attribute（包括事件、class、style 等）
const attrs = useAttrs();
</script>

<template>
	<!-- attrs //👈 关键：透传所有其他属性  -->
	<el-image
		v-bind="attrs"
		:src="src"
		v-if="src"
		:style="{
			width: typeof props.width === 'number' ? props.width + 'px' : props.width,
			height:
				typeof props.height === 'number' ? props.height + 'px' : props.height,
			borderRadius:
				typeof props.borderRadius === 'number'
					? props.borderRadius + 'px'
					: props.borderRadius,
		}"
		:preview-src-list="[src]"
		fit="contain"
		:preview-teleported="true"
		lazy
	>
		<!-- 透传所有插槽（包括 #error） -->
		<template v-for="(_, name) in $slots" #[name]="slotData">
			<slot :name="name" v-bind="slotData" />
		</template>
	</el-image>
	<span v-else class="text-gray-400">无图片</span>
</template>

<style scoped></style>
