<!--
 * @Description: 分类型下拉多选组件
 * 左侧选择分类（接口返回），右侧根据左侧选中值动态获取选项（接口返回）
 * 最终绑定值为右侧选中的值
 * 参照 select-date 和 select-input 的设计模式
-->
<template>
	<div class="flex items-center">
		<!-- 左侧：分类选择 -->
		<el-select
			v-model="selectedCategory"
			:placeholder="`请选择${props.placeholder}`"
			:style="{
				width: props.settings.categoryStyle?.width || '150px',
			}"
			@change="handleCategoryChange"
		>
			<el-option
				v-for="item in props.categoryList"
				:key="item.value"
				:label="item.label"
				:value="item.value"
			/>
		</el-select>

		<!-- 右侧：根据分类显示的多选下拉框 -->
		<el-select
			v-model="selectedOptions"
			multiple
			collapse-tags
			filterable
			collapse-tags-tooltip
			:max-collapse-tags="maxCollapseTags"
			placeholder="请选择"
			clearable
			:style="{
				width: props.settings.optionStyle?.width || '300px',
			}"
			@change="handleValueChange"
		>
			<el-option
				v-for="item in props.optionList"
				:key="item.value"
				:label="item.label"
				:value="item.value"
			/>
		</el-select>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
// 定义组件 name
defineOptions({
	name: 'SelectCategory',
});
type CategoryItem = {
	label: string;
	value: string | number;
	[key: string]: any;
};

type OptionItem = {
	label: string;
	value: string | number;
	[key: string]: any;
};

const props = defineProps({
	settings: {
		type: Object as () => {
			categoryStyle?: {
				width: string;
			};
			optionStyle?: {
				width: string;
			};
			[key: string]: any;
		},
		default: () => ({
			categoryStyle: {
				width: '150px',
			},
			optionStyle: {
				width: '300px',
			},
		}),
		required: false,
	},
	// 左侧分类列表（由父组件传入，来自接口）
	categoryList: {
		type: Array as () => CategoryItem[],
		default: () => [],
		required: true,
	},
	// 右侧选项列表（由父组件根据左侧选中值动态传入，来自接口）
	optionList: {
		type: Array as () => OptionItem[],
		default: () => [],
		required: true,
	},
	// 分类字段名（用于在 queryForm 中存储分类值）
	categoryFieldName: {
		type: String,
		default: '',
		required: false,
	},
	// 多选显示数量
	maxCollapseTags: {
		type: Number,
		default: 1,
		required: false,
	},
	// 选项字段名（用于在 queryForm 中存储选中的值）
	optionFieldName: {
		type: String,
		default: '',
		required: false,
	},
	placeholder: {
		type: String,
		default: '',
		required: false,
	},
	queryForm: {
		type: Object as () => {
			[key: string]: any;
		},
		default: () => ({}),
	},
	getDataList: {
		type: Function,
		default: () => () => {},
	},
});

const emits = defineEmits([
	'update:queryForm',
	'categoryChange',
	'categoryChangeItem',
]);

// 当前选中的分类
const selectedCategory = ref<string | number>();
// 右侧选中的值（内部维护，避免 watch 里修改 localQueryForm 触发死循环）
const selectedOptions = ref<(string | number)[]>([]);

// 计算属性：双向绑定 queryForm
const localQueryForm = computed({
	get: () => {
		return props.queryForm;
	},
	set: (val) => {
		emits('update:queryForm', val);
	},
});

// 监听 queryForm 的变化，只同步内部状态，不反向修改 queryForm
watch(
	() => props.queryForm,
	(newVal) => {
		// 同步分类值到内部状态
		if (newVal[props.categoryFieldName] !== selectedCategory.value) {
			selectedCategory.value = newVal[props.categoryFieldName] || undefined;
		}
		// 外层清空了选项值，同步清空内部状态
		if (
			!newVal[props.optionFieldName] ||
			(Array.isArray(newVal[props.optionFieldName]) &&
				newVal[props.optionFieldName].length === 0)
		) {
			selectedOptions.value = [];
		}
	},
	{ deep: true }
);

/**
 * 处理左侧分类切换
 * 1. 更新 queryForm 中的分类值
 * 2. 清空右侧选中的值
 * 3. 通知父组件分类已切换，需要获取新的右侧选项数据
 * 4. 传递完整的选项对象，方便父组件使用其他属性（如 prop）
 */
const handleCategoryChange = () => {
	// 更新 queryForm 中的分类值
	localQueryForm.value[props.categoryFieldName] = selectedCategory.value;

	// 清空右侧选中的值
	selectedOptions.value = [];
	localQueryForm.value[props.optionFieldName] = [];

	// 查找完整的选项对象
	const selectedOption = props.categoryList.find(
		(item) => item.value === selectedCategory.value
	);

	// 通知父组件分类已切换，需要获取新的右侧选项数据（包含 value、label、prop 等所有属性）
	emits('categoryChange', selectedCategory.value);
	emits('categoryChangeItem', selectedOption);
};

/**
 * 处理右侧多选框值变化
 * 1. 更新 queryForm 中的选项值
 * 2. 触发数据查询
 */
const handleValueChange = () => {
	// 同步到 queryForm
	localQueryForm.value[props.optionFieldName] = selectedOptions.value;
	// 触发数据查询
	props.getDataList();
};
</script>

<style lang="scss" scoped>
:deep(.el-select__tags-text) {
	max-width: 100px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
