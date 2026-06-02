<!--
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-01-30 17:04:27
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-02-04 14:25:59
 * @FilePath: \qianyi-ui\src\common\MrTableColumnVxe\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Description: 
-->
<template>
	<vxe-column v-bind="mergedProps">
		<!-- 透传所有插槽 -->
		<template v-for="(_, name) in $slots" #[name]="slotData">
			<slot :name="name" v-bind="slotData || {}" />
		</template>
	</vxe-column>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';

/**
 * MrTableColumnVxe 组件
 * 基于 vxe-table column 组件的封装
 *
 * 功能特点：
 * 1. 完全兼容 vxe-table column 的所有 props 和 slots
 * 2. 提供系统默认配置（align、header-align 等）
 * 3. 用户传入的配置会覆盖默认配置
 * 4. 保留所有原生插槽（default、header、child 等）
 *
 * 默认配置：
 * - align: center（内容居中对齐）
 * - header-align: center（表头居中对齐）
 *
 * 使用方式：
 * <mr-table-column-vxe field="name" title="名称" :width="120">
 *   <template #default="{ row }">
 *     {{ row.name }}
 *   </template>
 * </mr-table-column-vxe>
 */

// 禁用属性继承，手动控制属性传递
defineOptions({
	name: 'MrTableColumnVxe',
	inheritAttrs: false,
});

// 列默认配置
const columnDefault = {
	align: 'center' as const,
	headerAlign: 'center' as const,
	showOverflow: 'title' as const,
};

// 使用 useAttrs 获取响应式的 attrs
const attrs = useAttrs();

// 合并默认配置和用户传入的配置
const mergedProps = computed(() => {
	return {
		// 默认配置
		...columnDefault,
		// 用户传入的配置会覆盖默认配置
		...attrs,
	};
});
</script>
