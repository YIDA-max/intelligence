<script setup lang="ts">
const props = defineProps({
	deptData: {
		type: Array<{
			id: number;
			name: string;
			children?: any[];
			parentId?: number;
		}>,
		default: () => [],
	},
});
const deptIds = ref<number[]>([]);

/**
 * 从树形结构中提取所有“父节点-直接子节点ID列表”的映射关系。
 *
 * 说明：
 * - 仅处理**有子节点**的节点；
 * - `childIds` 仅包含**直接子节点**（不包含孙节点等后代）；
 * - 适用于后续的“全选合并”或“父节点展开”逻辑（如 Tree 组件的 checkStrictly=false 模式）。
 *
 * @param treeData 树形节点数组，每个节点需包含 id (number)、name (string)、children? (子节点数组)
 * @returns 映射关系数组，每项包含 { id: 父节点ID, childIds: 直接子节点ID数组, name: 父节点名称 }
 */
const buildParentChildIdMap = (
	treeData: {
		id: number;
		name: string;
		children?: Array<{ id: number; name: string; children?: any[] }>;
	}[]
): { id: number; childIds: number[]; name: string }[] => {
	// 初始化结果数组，用于存储所有父子关系
	const result: { id: number; childIds: number[]; name: string }[] = [];
	/**
	 * 递归遍历树节点的辅助函数
	 * @param nodes 当前层级的节点数组
	 */
	const traverse = (
		nodes: Array<{ id: number; name: string; children?: any[] }>
	) => {
		// 遍历当前层级的每一个节点
		for (const node of nodes) {
			// 只处理存在且非空的 children 数组（避免 null/undefined 或空数组）
			if (Array.isArray(node.children) && node.children.length > 0) {
				// 提取当前节点的所有**直接子节点**的 ID
				// 注意：这里只取 children 的第一层，不递归获取后代
				const childIds = node.children.map((child) => {
					// 安全校验：确保 child.id 是 number 类型（开发阶段提示）
					if (typeof child.id !== 'number') {
						// eslint-disable-next-line no-console
						console.warn(
							`[buildParentChildIdMap] 节点 ID 应为 number，但收到:`,
							child.id,
							'（请确保数据中 id 为数字类型）'
						);
					}
					// 使用类型断言，假设数据合法（生产环境应保证输入规范）
					return child.id as number;
				});
				// 将当前父节点与其直接子节点 ID 列表存入结果
				result.push({
					id: node.id, // 父节点 ID
					childIds, // 直接子节点 ID 数组
					name: node.name, // 父节点名称（可用于调试或展示）
				});
				// 递归处理子节点，继续向下遍历整棵树
				traverse(node.children);
			}
			// 如果节点没有子节点（叶子节点），则跳过，不加入映射关系
		}
	};
	// 从根节点开始遍历整棵树
	traverse(treeData);
	// 返回构建好的父子关系映射数组
	return result;
};
// 设置选中的数据
const setData = (ids: number[]) => {
	// 建立“父节点-子节点ID列表”映射关系
	const idAndChildrenToNode: {
		id: number;
		childIds: number[];
		name: string;
	}[] = buildParentChildIdMap(props.deptData);
	/**
	 * 将包含父节点 ID 的选中列表递归展开为最底层的子节点 ID 列表。
	 *
	 * 适用场景：
	 * - 当用户选中了一个父节点（代表其所有子节点被选中），
	 *   需要将其“打散”为实际的所有叶子节点或直接子节点 ID。
	 * - 通常用于与 Tree 组件配合，在非严格模式（checkStrictly=false）下还原完整选中状态。
	 *
	 * @param initialIds 初始选中的 ID 数组（可能包含父节点）
	 * @returns 展开后的 ID 数组（仅包含无法再展开的节点，即没有子节点关系的节点）
	 */
	const fn = (initialIds: number[]): number[] => {
		// 如果初始选中列表为空，直接返回空数组
		if (initialIds.length === 0) return [];
		// 使用 Set 存储当前选中 ID，提升查找、删除、去重的性能（O(1)）
		let currentSet = new Set(initialIds);
		// 标记本轮循环是否发生了“展开”操作
		let changed = true;
		// 只要上一轮有展开操作，就继续检查，直到无法再展开为止
		while (changed) {
			changed = false;
			// 创建新的 Set 用于存储本轮处理后的结果（避免在遍历时修改原集合）
			const nextSet = new Set(currentSet);
			// 遍历所有已知的父子关系映射（idAndChildrenToNode 应包含每个有子节点的父节点及其直接子节点 ID 列表）
			for (const relation of idAndChildrenToNode) {
				// 检查当前父节点是否在选中列表中
				if (currentSet.has(relation.id)) {
					// 移除父节点 ID（因为它将被其子节点替代）
					nextSet.delete(relation.id);
					// 将该父节点的所有直接子节点 ID 加入选中列表
					relation.childIds.forEach((childId) => {
						nextSet.add(childId); // Set 自动去重，无需手动判断
					});
					// 标记本轮发生了变更，需要继续下一轮检查（因为新加入的子节点可能也是父节点）
					changed = true;
				}
			}
			// 更新当前选中集合，进入下一轮迭代
			currentSet = nextSet;
		}

		// 最终将 Set 转换为数组返回
		return Array.from(currentSet);
	};
	// 递归展开后的 ID 列表
	const expandedIds = fn(ids);
	deptIds.value = Array.from(expandedIds).map((id) => Number(id));
};
/**
 * 获取选中的数据
 * 规则：若子节点全选，只取父节点 ID；否则取选中的子节点 ID
 */
const getData = (): number[] => {
	// 如果没有选中任何节点，直接返回空数组
	if (!deptIds.value || deptIds.value.length === 0) return [];

	// 建立“父节点-子节点ID列表”映射关系
	const idAndChildrenToNode: {
		id: number;
		childIds: number[];
		name: string;
	}[] = buildParentChildIdMap(props.deptData);

	/**
	 * 将选中的子节点 ID 列表递归“压缩”为最顶层的父节点 ID。
	 *
	 * 适用场景：
	 * - 用户在树形选择器中勾选了多个子节点，
	 *   若某个父节点下的**所有直接子节点**均被选中，则用该父节点 ID 替代这些子节点，
	 *   从而减少存储/传输的数据量，并符合 Tree 组件的半选/全选语义。
	 *
	 * 注意：
	 * - 仅当**所有直接子节点**都被选中时才合并（不涉及后代孙节点）。
	 * - 合并后会继续检查新加入的父节点是否也能被其父级合并（逐层向上冒泡）。
	 *
	 * @param initialDeptIds 初始选中的部门 ID 数组（通常为叶子节点或部分中间节点）
	 * @returns 合并后的最简 ID 数组（尽可能用高层父节点代表子树）
	 */
	const fn = (initialDeptIds: number[]): number[] => {
		// 边界情况：无选中项，直接返回空数组
		if (initialDeptIds.length === 0) return [];
		// 使用 Set 存储当前选中 ID，支持 O(1) 查找、删除和自动去重
		let currentSet = new Set(initialDeptIds);
		// 标记本轮循环是否发生了“合并”操作（用于控制迭代终止）
		let changed = true;
		// 只要上一轮有合并发生，就继续检查，直到无法再合并为止
		while (changed) {
			changed = false;
			// 创建新 Set 存储本轮处理结果（避免在遍历中修改原集合）
			const nextSet = new Set(currentSet);

			// 遍历所有已知的父子关系（idAndChildrenToNode 应包含每个有子节点的父节点及其直接子节点 ID 列表）
			for (const relation of idAndChildrenToNode) {
				// 检查：当前父节点的所有直接子节点是否都被选中？
				const allChildrenSelected = relation.childIds.every((id) =>
					currentSet.has(id)
				);

				// 如果子节点全选，且父节点尚未被选中（避免重复添加）
				if (allChildrenSelected && !currentSet.has(relation.id)) {
					// 移除所有直接子节点（它们将被父节点代表）
					relation.childIds.forEach((id) => {
						nextSet.delete(id);
					});
					// 添加父节点 ID
					nextSet.add(relation.id);
					// 标记本轮有变更，需继续下一轮检查（新父节点可能触发更高层合并）
					changed = true;
				}
			}
			// 更新当前选中集，进入下一轮迭代
			currentSet = nextSet;
		}
		// 返回最终合并后的 ID 数组
		return Array.from(currentSet);
	};
	// 递归合并后的 ID 列表
	const ids = fn(deptIds.value.map((id) => Number(id)));
	return Array.from(ids).map((id) => id);
};
defineExpose({
	setData,
	getData,
	deptIds,
});
</script>
<template>
	<div class="w-full">
		<el-tree-select
			:data="props.deptData"
			:props="{ value: 'id', label: 'name', children: 'children' }"
			show-checkbox
			fit-input-width
			clearable
			multiple
			collapse-tags
			:max-collapse-tags="1"
			node-key="id"
			placeholder="请选择所属部门"
			v-model="deptIds"
		>
		</el-tree-select>
	</div>
</template>

<style scoped></style>
