<!--
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2025-12-26 16:30:18
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-03-30 11:25:57
 * @FilePath: \qianyi-ui\src\common\MrTableColumn\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<el-table-column v-bind="mergedProps">
		<!-- 透传所有插槽 -->
		<template v-for="(_, name) in $slots" #[name]="slotData">
			<slot :name="name" v-bind="slotData || {}" />
		</template>
	</el-table-column>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';

/**
 * MrTableColumn 组件
 * 基于 Element Plus TableColumn 组件的封装
 *
 * 功能特点：
 * 1. 完全兼容 Element Plus TableColumn 的所有 props 和 slots
 * 2. 提供系统默认配置（show-overflow-tooltip、header-align 等）
 * 3. 用户传入的配置会覆盖默认配置
 * 4. 保留所有原生插槽（default、header 等）
 *
 * 默认配置：
 * - show-overflow-tooltip: true（内容超出显示省略号和 tooltip）
 * - header-align: center（表头居中对齐）
 *
 * 使用方式：
 * <mr-table-column prop="name" label="名称" width="120">
 *   <template #default="{ row }">
 *     {{ row.name }}
 *   </template>
 * </mr-table-column>
 */

// 禁用属性继承，手动控制属性传递
defineOptions({
	name: 'MrTableColumn',
	inheritAttrs: false,
});

//列默认配置
const columnDefault = {
	headerAlign: 'center',
	showOverflowTooltip: false, // 作为基础组件，不要默认给样式
};
//列默认配置--来自列设置
const propsRowSetDefault = {
	align: 'center' as const, //对齐方式
	width: 280, //列宽
};
// 使用 useAttrs 获取响应式的 attrs
const attrs = useAttrs();

// 合并默认配置和用户传入的配置
const mergedProps = computed(() => {
	return {
		// 默认配置
		...columnDefault,
		...propsRowSetDefault,
		// 用户传入的配置会覆盖默认配置
		...attrs,
	};
});
</script>

<style scoped lang="scss">
// 未来可以在这里添加全局的列样式
</style>
