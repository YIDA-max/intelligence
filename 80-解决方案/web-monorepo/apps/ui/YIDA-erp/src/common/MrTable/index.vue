<!--
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2025-12-26 16:30:18
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-01-09 17:33:11
 * @FilePath: \qianyi-ui\src\common\MrTable\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<el-table ref="tableRef" v-bind="mergedProps">
		<!-- 透传所有插槽 -->
		<template v-for="(_, name) in $slots" #[name]="slotData">
			<slot :name="name" v-bind="slotData || {}" />
		</template>
	</el-table>
</template>

<script setup lang="ts">
import { ref, useAttrs, computed, onMounted, getCurrentInstance } from 'vue';
import type { TableInstance } from 'element-plus';

/**
 * MrTable 组件
 * 基于 Element Plus Table 组件的封装
 *
 * 功能特点：
 * 1. 完全兼容 Element Plus Table 的所有 props、events 和 slots
 * 2. 使用 useTable hook 提供的默认样式配置
 * 3. 保留所有原生插槽和事件
 * 4. 统一的表格样式和行为
 *
 * 默认配置：
 * - border: true (显示边框)
 * - stripe: false (不显示斑马纹)
 * - size: 'default' (默认尺寸)
 * - highlight-current-row: true (高亮当前行)
 * - header-cell-style: 来自 useTable hook 的默认表头样式
 * - cell-style: 来自 useTable hook 的默认单元格样式
 *
 * 使用方式：
 * <mr-table :data="tableData" @selection-change="handleSelectionChange">
 *   <mr-table-column prop="name" label="名称" />
 * </mr-table>
 */

// 禁用属性继承，手动控制属性传递
defineOptions({
	name: 'MrTable',
	inheritAttrs: false,
});

// 表格实例引用
const tableRef = ref<TableInstance>();

// 使用 useAttrs 获取响应式的 attrs
const attrs = useAttrs();

// 合并默认配置和用户传入的配置
const mergedProps = computed(() => {
	return {
		// 默认配置
		border: true,
		stripe: false,
		size: 'default',
		highlightCurrentRow: true,
		nativeScrollbar: true,
		'header-row-class-name': 'table-header-name',
		// 用户传入的配置会覆盖默认配置
		...attrs,
	};
});

// 动态复制所有方法到当前实例（最灵活，自动适配 el-table 更新）
const instance = getCurrentInstance();
onMounted(() => {
	if (tableRef.value && instance) {
		// 获取 el-table 实例的所有属性和方法
		const table = tableRef.value;
		const exposed: Record<string, any> = {};

		// 遍历 table 实例的所有属性
		Object.keys(table).forEach((key) => {
			const value = table[key as keyof TableInstance];
			if (typeof value === 'function') {
				// 如果是方法，绑定正确的 this 并暴露
				exposed[key] = value.bind(table);
			} else {
				// 如果是属性，使用 getter 动态获取
				Object.defineProperty(exposed, key, {
					get() {
						return table[key as keyof TableInstance];
					},
					enumerable: true,
				});
			}
		});

		// 动态更新 expose
		if (instance.exposed) {
			Object.assign(instance.exposed, exposed);
		}
	}
});

// 初始暴露一个 elTableRef 方法作为后备 所有原始表格的ref
defineExpose({
	elTableRef: () => tableRef.value,
});
</script>

<style scoped lang="scss">
.el-table {
	--el-table-header-bg-color: var(--el-table-row-hover-bg-color);
	--el-table-header-text-color: var(--el-text-color-primary);
}
</style>
