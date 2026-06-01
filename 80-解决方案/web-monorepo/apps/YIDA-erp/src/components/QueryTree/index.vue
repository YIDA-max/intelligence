<template>
	<div class="head-container">
		<div class="head-container-header">
			<div class="head-container-header-input">
				<el-input
					v-model="searchName"
					suffix-icon="search"
					:placeholder="placeholder"
					clearable
					@change="getdeptTree"
					@click:suffix="getdeptTree"
				/>
			</div>
			<div class="head-container-header-dropdown" v-if="showExpand">
				<el-dropdown :hide-on-click="false">
					<el-icon style="transform: rotate(90deg)">
						<MoreFilled />
					</el-icon>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item>
								<el-button
									:class="buttonClass"
									link
									type="primary"
									:icon="isExpand ? 'expand' : 'fold'"
									@click="toggleRowExpansionAll(isExpand ? false : true)"
								>
									{{ isExpand ? '折叠' : '展开' }}
								</el-button>
							</el-dropdown-item>
							<el-dropdown-item>
								<el-button
									:class="buttonClass"
									link
									type="primary"
									icon="close"
									@click="clearCurrentNode"
								>
									{{ '清空选中' }}
								</el-button>
							</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</div>
		</div>
		<el-tree
			class="mt20"
			:data="state.List"
			:props="props.props"
			:expand-on-click-node="false"
			ref="deptTreeRef"
			:loading="state.localLoading"
			node-key="id"
			highlight-current
			default-expand-all
			@node-click="handleNodeClick"
		>
			<template #default="{ node, data }" v-if="$slots.default">
				<slot :node="node" :data="data"></slot>
			</template>
		</el-tree>
	</div>
</template>

<script setup lang="ts" name="query-tree">
import { useMessage } from '/@/hooks/message';
const emit = defineEmits(['search', 'nodeClick']);

const props = defineProps({
	/**
	 * 树结构属性配置。
	 *
	 * @default { label: 'name', children: 'children', value: 'id' }
	 */
	props: {
		type: Object,
		default: () => {
			return {
				label: 'name',
				children: 'children',
				value: 'id',
			};
		},
	},

	/**
	 * 输入框占位符。
	 *
	 * @default ''
	 */
	placeholder: {
		type: String,
		default: '',
	},

	/**
	 * 是否显示加载中状态。
	 *
	 * @default false
	 */
	loading: {
		type: Boolean,
		default: false,
	},

	/**
	 * 查询函数，必须返回 Promise 类型数据。
	 */
	query: {
		type: Function,
		required: true,
	},

	/**
	 * 是否显示折叠控制
	 */
	showExpand: {
		type: Boolean,
		default: false,
	},
});

const state = reactive({
	List: [], // 树形结构列表数据
	localLoading: props.loading, // 是否加载中
});

const deptTreeRef = ref(); // 部门树形结构组件实例引用
const searchName = ref(); // 查询关键字
const isExpand = ref(true); // 是否展开所有节点

const buttonClass = computed(() => {
	return [
		'!h-[20px]',
		'reset-margin',
		'!text-gray-500',
		'dark:!text-white',
		'dark:hover:!text-primary',
	];
});

/**
 * 点击树形结构节点触发的事件。
 *
 * @param item 被点击的节点数据。
 */
const handleNodeClick = (item: any) => {
	emit('nodeClick', item);
};

/**
 * 获取部门树形结构数据。
 */
const getdeptTree = async () => {
	if (typeof props.query === 'function') {
		state.localLoading = true;
		try {
			// 直接 await 查询函数的返回值
			const r: any = await props.query(unref(searchName));
			// 取 r.data，如果不存在则置空数组
			state.List = r.data ?? [];
		} catch (err: any) {
			// 统一使用错误消息
			useMessage().error(err.msg || err.message || '获取部门数据失败');
		} finally {
			state.localLoading = false;
		}
	}
};

/**
 * 切换所有节点的展开/收起状态。
 *
 * @param status 目标状态，true 为展开，false 为收起。
 */
const toggleRowExpansionAll = (status: boolean) => {
	isExpand.value = status;
	const nodes = deptTreeRef.value.store._getAllNodes();
	for (let i = 0; i < nodes.length; i++) {
		nodes[i].expanded = status;
	}
};
/**
 * 清空当前选中的节点
 * @returns {void}
 */
const clearCurrentNode = () => {
	if (deptTreeRef.value) {
		deptTreeRef.value.setCurrentKey(null); // 使用官方方法
		// 设置当前选中节点为 null
		emit('nodeClick', {
			id: null,
		});
	}
};
/**
 * 设置选中的节点
 * @param {string} key - 需要选中的节点的 key
 */
const setCurrentNode = (key: string) => {
	if (deptTreeRef.value) {
		deptTreeRef.value.setCurrentKey(key); // 使用官方方法
	}
};
onMounted(() => {
	getdeptTree();
});
// 返回当前树形结构数据
const getTreeData = () => {
	return state.List;
};
// 设置当前选中的节点key
const setCurrentNodeKey = (key: string) => {
	if (deptTreeRef.value && key) {
		deptTreeRef.value.setCurrentKey(key);
	}
};
// 方便父组件调用刷新树方法
defineExpose({
	getdeptTree,
	clearCurrentNode,
	setCurrentNode,
	getTreeData,
	setCurrentNodeKey,
});
</script>
<style lang="scss" scoped>
.head-container {
	&-header {
		display: flex;
		align-items: center;
		&-input {
			width: 90%;
		}
		&-dropdown {
			flex: 1;
			margin-left: 5%;
		}
	}
}
</style>
