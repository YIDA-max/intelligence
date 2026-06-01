<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-03-09 09:46:01
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-03-09 09:56:37
 * @FilePath: \qianyi-ui\src\common\MrRequired\index.vue
 * @Description: 必填标记组件 - 显示红色星号
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
-->
<template>
	<span v-if="props.required" class="mr-required" :class="customClass">
		<slot>
			<span class="mr-required-star">*</span>
		</slot>
	</span>
</template>

<script setup lang="ts">
/**
 * MrRequired 组件
 * 用于展示必填标记的简洁组件
 *
 * 功能特点：
 * 1. 显示红色星号（*）标记必填字段
 * 2. 支持自定义样式类
 * 3. 支持插槽自定义内容
 * 4. 简洁轻量，易于使用
 *
 * 使用场景：
 * - 表单标签前显示必填标记
 * - 表格表头显示必填标记
 * - 任何需要标记必填的地方
 *
 * @example
 * <!-- 基础用法 -->
 * <label>
 *   <MrRequired :required="true" />
 *   用户名
 * </label>
 *
 * <!-- 自定义样式 -->
 * <MrRequired :required="true" custom-class="my-custom-class" />
 *
 * <!-- 自定义内容 -->
 * <MrRequired :required="true">
 *   <span class="custom-star">★</span>
 * </MrRequired>
 */

interface Props {
	/** 是否必填（控制是否显示标记） */
	required?: boolean;
	/** 自定义样式类名 */
	customClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
	required: true,
	customClass: '',
});
</script>

<style scoped lang="scss">
.mr-required {
	display: flex;
	align-items: center;
	justify-content: center;
	color: #f56c6c;
	vertical-align: middle;
	line-height: 1;
	height: 100%;
	width: 10px;
	.mr-required-star {
		font-size: 14px;
		font-weight: normal;
	}
}
</style>
