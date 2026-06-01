/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-10 13:49:48
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-12-29 16:48:22
 * @FilePath: \qianyi-ui\src\utils\arrayTree.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */

/**
 * 格式化树形数据
 * @param items 需要格式化的树形数据数组
 * @param options 格式化选项
 * @param options.formatItem 自定义节点格式化函数
 * @param options.childrenKey 子节点的键名，默认为 'children'
 * @returns 格式化后的树形数据
 */
export function formatTreeData<T, R extends { children?: R[] }>(
	items: T[],
	options: {
		formatItem?: (item: T) => R;
		childrenKey?: keyof T;
	} = {}
): R[] {
	const {
		formatItem = (item: any) =>
			({
				label: item.categoryName,
				value: item.id,
				children: item.children || [],
			} as unknown as R),
		childrenKey = 'children' as keyof T,
	} = options;

	return items.map((item) => {
		const formattedItem = formatItem(item);

		// 获取子节点数据
		const children = item[childrenKey] as unknown as T[] | undefined;

		// 递归处理子节点
		if (children && Array.isArray(children) && children.length > 0) {
			formattedItem.children = formatTreeData(children, options);
		} else {
			formattedItem.children = [];
		}
		return formattedItem;
	});
}

/**
 * 递归收集所有节点指定字段的值
 * @param nodes 树形数据数组
 * @param idKey 节点唯一标识字段名，默认 'id'
 * @param childrenKey 子节点字段名，默认 'children'
 * @returns 所有节点的指定字段值组成的数组
 */
export function collectAllNodeIds<T>(
	nodes: T[],
	idKey: keyof T = 'id' as keyof T,
	childrenKey: keyof T = 'children' as keyof T
): T[keyof T][] {
	return nodes.flatMap((node) => {
		const id = node[idKey];
		const children = node[childrenKey];
		return [
			id,
			...(Array.isArray(children)
				? collectAllNodeIds(children, idKey, childrenKey)
				: []),
		];
	});
}

type TreeNode = Record<string, any>;

/**
 * 过滤树结构数据，支持保留匹配路径和完整子树。
 *
 * 功能说明：
 * - 若节点本身匹配搜索关键字，则保留整个子树；
 * - 若子节点中有匹配项，则保留当前节点及匹配的子节点路径；
 * - 其余节点将被剔除；
 * - 支持自定义字段映射，如 label 字段名或 children 字段名。
 *
 * @param nodes 原始树形结构数据数组
 * @param keyword 搜索关键词（大小写不敏感）
 * @param map 字段映射配置对象
 *  - map.label：用于匹配关键词的字段名（默认 "label"）
 *  - map.children：子节点字段名（默认 "children"）
 * @returns 过滤后的树结构数据数组
 */
export function filterTreeWithFullSubtreeOnParentMatch(
	nodes: TreeNode[],
	keyword: string,
	map: {
		children?: string; // 子节点字段名，如 'children'、'nodes' 等
		label?: string; // 匹配用的字段名，如 'label'、'name' 等
	}
): TreeNode[] {
	// 设置默认字段名
	const childrenKey = map.children || 'children';
	const labelKey = map.label || 'label';
	const lowerKeyword = keyword.toLowerCase(); // 关键词转小写用于不区分大小写匹配
	// 使用 reduce 遍历并构建新树
	return nodes.reduce<TreeNode[]>((acc, node) => {
		// 获取当前节点的 label 值（支持自定义字段），并转换为小写
		const nodeLabel = (node[labelKey] ?? '').toString().toLowerCase();
		const labelMatch = nodeLabel.includes(lowerKeyword); // 是否匹配关键字
		const children = node[childrenKey]; // 获取当前节点的子节点数组
		if (labelMatch) {
			// 当前节点匹配，保留整棵子树
			acc.push({ ...node });
		} else if (Array.isArray(children)) {
			// 当前节点不匹配，但如果有子节点，递归过滤子节点
			const filteredChildren = filterTreeWithFullSubtreeOnParentMatch(
				children,
				keyword,
				map
			);
			if (filteredChildren.length > 0) {
				// 子节点中有匹配项，保留当前节点及匹配的子节点路径
				acc.push({
					...node,
					[childrenKey]: filteredChildren, // 替换为过滤后的子节点数组
				});
			}
		}
		// 如果当前节点及其子节点都不匹配，则不保留
		return acc; // 返回累积结果
	}, []);
}
/**
 * 递归查找树中第一个匹配指定字段值的节点
 *
 * @param tree 树结构数组
 * @param key 要匹配的字段名，如 'id'
 * @param value 要查找的值
 * @param childrenKey 子节点键名，默认是 'children'
 * @returns 匹配的节点或 null
 */
type findTreeNode = {
	[key: string]: any;
	children?: findTreeNode[];
};

export function findNode<T extends findTreeNode>(
	tree: T[],
	key: keyof T,
	value: any,
	childrenKey: keyof T = 'children'
): T | any {
	for (const node of tree) {
		if (node[key] === value) {
			return node;
		}

		const children = node[childrenKey];
		if (Array.isArray(children)) {
			const result = findNode(children as T[], key, value, childrenKey);
			if (result) return result;
		}
	}
	return null;
}
/**
 * 根据 ID 获取节点及其所有子孙节点（扁平化）
 * @param tree 树形数据数组
 * @param id 要查找的节点 ID
 * @param idKey 节点 ID 字段名，默认 'id'
 * @param childrenKey 子节点字段名，默认 'children'
 * @returns 包含目标节点及其所有子孙节点的扁平数组
 */
export function getNodeAndDescendants<T extends Record<string, any>>(
	tree: T[],
	id: any,
	idKey: keyof T = 'id' as keyof T,
	childrenKey: keyof T = 'children' as keyof T
): T[] {
	if (id === null || id === undefined) return [];
	// 第一步：找到目标节点
	const targetNode = findNode(tree, idKey, id, childrenKey);
	if (!targetNode) return [];

	// 第二步：递归收集自身 + 所有子孙
	const result: T[] = [];
	function collect(node: T) {
		result.push(node);
		const children = node[childrenKey];
		if (Array.isArray(children)) {
			children.forEach(collect);
		}
	}

	collect(targetNode);
	return result;
}
