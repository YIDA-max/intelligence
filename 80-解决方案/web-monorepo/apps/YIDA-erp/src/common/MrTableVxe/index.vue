<template>
	<div>
		<vxe-table ref="xTableRef" v-bind="mergedProps">
			<!-- 透传所有插槽 -->
			<template v-for="(_, name) in $slots" #[name]="slotData">
				<slot :name="name" v-bind="slotData || {}" />
			</template>
		</vxe-table>
		<slot name="pagination" />
	</div>
</template>

<script setup lang="ts">
import { ref, useAttrs, computed, onMounted, getCurrentInstance } from 'vue';
import type { VxeTableInstance } from 'vxe-table';

/**
 * MrTableVxe 组件
 * 基于 vxe-table 组件的封装
 *
 * 功能特点：
 * 1. 完全兼容 vxe-table 的所有 props、events 和 slots
 * 2. 提供系统默认配置
 * 3. 保留所有原生插槽和事件
 * 4. 统一的表格样式和行为
 *
 * 默认配置：
 * - border: true (显示边框)
 * - stripe: false (不显示斑马纹)
 * - align: 'center' (内容居中)
 *
 * 使用方式：
 * <mr-table-vxe :data="tableData" @checkbox-change="handleCheckboxChange">
 *   <mr-table-column-vxe field="name" title="名称" />
 * </mr-table-vxe>
 */

// 禁用属性继承，手动控制属性传递
defineOptions({
	name: 'MrTableVxe',
	inheritAttrs: false,
});

interface Props {
	data?: any[];
	emptyRender?: any;
}

const props = withDefaults(defineProps<Props>(), {
	data: () => [],
	emptyRender: undefined,
});

// 表格实例引用
const xTableRef = ref<VxeTableInstance>();

// 使用 useAttrs 获取响应式的 attrs
const attrs = useAttrs();

// 默认配置
const tableDefault = {
	border: true,
	stripe: false,
	align: 'center' as const,
};

// 合并默认配置和用户传入的配置
const mergedProps = computed(() => {
	return {
		// 默认配置
		...tableDefault,
		// props
		data: props.data,
		emptyRender: props.emptyRender || {
			name: 'empty',
		},
		// 用户传入的配置会覆盖默认配置
		...attrs,
	};
});

// 动态复制所有方法到当前实例
const instance = getCurrentInstance();
onMounted(() => {
	if (xTableRef.value && instance) {
		const table = xTableRef.value;
		const exposed: Record<string, any> = {};

		// 遍历 vxe-table 实例的所有属性和方法
		Object.keys(table).forEach((key) => {
			const value = table[key as keyof VxeTableInstance];
			if (typeof value === 'function') {
				// 如果是方法，绑定正确的 this 并暴露
				try {
					exposed[key] = value.bind(table);
				} catch (error) {
					// console.log(error);
				}
			} else {
				// 如果是属性，使用 getter 动态获取
				Object.defineProperty(exposed, key, {
					get() {
						return table[key as keyof VxeTableInstance];
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

// 初始暴露一个 vxeTableRef 方法作为后备
defineExpose({
	vxeTableRef: () => xTableRef.value,
	xTableRef: xTableRef,
});
</script>
