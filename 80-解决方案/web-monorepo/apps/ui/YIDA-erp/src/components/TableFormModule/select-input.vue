<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-10 11:00:33
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-05-29 15:54:04
 * @FilePath: \qianyi-ui\src\components\TableFormModule\select-input.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template>
	<div class="flex items-center">
		<el-select
			v-model="searchType"
			placeholder="请选择"
			:style="{
				width: props?.settings?.selectStyle?.width || '100px',
			}"
			@change="
				() => {
					changeSearchType();
				}
			"
		>
			<el-option
				v-for="item in props.searchTypes"
				:key="item.value"
				:label="item.label"
				:value="item.value"
			/>
		</el-select>
		<el-input
			v-model="localQueryForm[searchType]"
			:placeholder="`请输入${
				props.searchTypes.find((item) => item.value === searchType)?.label || ''
			}`"
			clearable
			@input="handleBlur"
			@keyup.enter="handleBlur"
			:style="{ width: props?.settings?.inputStyle?.width || '240px' }"
		>
			<template #append v-if="props.showExpand">
				<div :style="{}">
					<el-popover
						placement="bottom-end"
						trigger="click"
						:width="230"
						:visible="popoverVisible"
					>
						<div :style="{}">
							<el-input
								v-model="inputTextarea"
								:rows="10"
								type="textarea"
								placeholder="精确搜索，一行一个，回车换行，最多支持5000行"
							/>
							<div
								:style="{
									width: '100%',
									display: 'flex',
									justifyContent: 'space-between',
									marginTop: '10px',
								}"
							>
								<el-button
									@click="
										() => {
											inputTextarea = '';
											localQueryForm[searchType] = [];
											props?.getDataList();
										}
									"
									>清空</el-button
								>
								<el-button @click="popoverVisible = false">取消</el-button>
								<el-button type="primary" @click="searchTextarea"
									>搜索</el-button
								>
							</div>
						</div>
						<template #reference>
							<el-button
								type="primary"
								:icon="Expand"
								circle
								@click="popoverVisible = !popoverVisible"
						/></template>
					</el-popover>
				</div>
			</template>
		</el-input>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ref, onMounted } from 'vue';
import { Expand } from '@element-plus/icons-vue';
import { useMessage } from '/@/hooks/message';
const props = defineProps({
	settings: {
		type: Object as () => {
			selectStyle: {
				width: string; // 选择器的宽度
			}; // 选择器样式
			inputStyle?: {
				width: string; // 输入框的宽度
			}; // 输入框的宽度
			[key: string]: any;
		},
		default: () => ({
			selectStyle: {
				width: '100px',
			},
			inputStyle: {
				width: '240px',
			},
		}),
		required: false,
	},

	searchTypes: {
		type: Array as () => {
			label: string;
			value: string;
		}[],
		default: () => [],
		required: true,
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
	searchFn: {
		type: Function,
		default: () => () => {},
	},
	selectStyle: {
		type: Object as () => {
			[key: string]: any;
		},
		default: () => {
			return {
				width: '100px',
			};
		},
	},
	/**
	 * 是否输入框改变时触发搜索
	 */
	isInputCangeSearch: {
		type: Boolean,
		default: false,
	},
	/**
	 * 是否显示精确搜索
	 */
	showExpand: {
		type: Boolean,
		default: true,
	},
	/**
	 * 用于分隔精确的字符
	 */
	splitChar: {
		type: String,
		default: ',', // 默认使用逗号分隔
	},
});
// 当前选中的值
const searchType = ref(props.searchTypes[0]?.value);
// 多行文本域的内容
const inputTextarea = ref('');
// 是否显示更多搜索条件
const popoverVisible = ref(false);
/**
 * 处理多行文本域的内容（通用，自动截断以避免GET 414）
 */
const searchTextarea = () => {
	if (inputTextarea.value) {
		// 1) 文本域按照换行拆分，去除首尾空格，过滤空行，并使用 Set 去重
		const lines = [
			...new Set(
				inputTextarea.value
					.split('\n')
					.map((line) => line.trim())
					.filter((line) => line)
			),
		];
		// 2) 业务上限校验：最多支持5000行
		if (lines.length > 5000) {
			// 超过500行，提示用户
			useMessage().error('最多支持5000行');
			return;
		}
		// 3) 计算并截断，保证GET可用（避免 414 URI Too Long）
		// 现在为post请求，不再需要计算URL长度
		const MAX_GET_REQUEST_LENGTH = 1500000000000; // 保守阈值
		// 根据当前 query 参数粗略估算 URL 长度（基础URL+参数名+参数值）
		const calculateUrlLength = (params: any) => {
			let baseLen = 200; // 预留路径/域名等基准长度
			Object.keys(params).forEach((k) => {
				const v = params[k];
				if (v !== undefined && v !== null && v !== '') {
					const vs = Array.isArray(v) ? v.join(props.splitChar) : String(v);
					baseLen += k.length + 1 + vs.length + 1; // key= + value + &
				}
			});
			return baseLen;
		};
		// 使用二分查找，找到在不超长前提下最多可提交的项数
		const truncate = (list: string[], baseParams: any, key: string) => {
			let l = 0,
				r = list.length,
				ans = 0;
			while (l <= r) {
				const mid = Math.floor((l + r) / 2);
				const testParams = { ...baseParams, [key]: list.slice(0, mid) };
				if (calculateUrlLength(testParams) <= MAX_GET_REQUEST_LENGTH) {
					ans = mid; // 当前数量可行，尝试更多
					l = mid + 1;
				} else {
					r = mid - 1; // 超限，缩小范围
				}
			}
			return list.slice(0, ans);
		};
		// 4) 以当前表单为“基准参数”，去掉本次批量字段，避免重复计入
		const base = { ...localQueryForm.value };
		delete base[searchType.value];
		// 5) 执行截断，得到可提交的搜索集合
		const truncated = truncate(lines, base, searchType.value as string);
		// 6) 截断提示与赋值
		if (truncated.length < lines.length) {
			useMessage().warning(
				`搜索数据过多，只搜索前 ${truncated.length} 条（共 ${lines.length} 条）`
			);
		}
		localQueryForm.value[searchType.value] = truncated;
	} else {
		// 无输入时清空该字段
		localQueryForm.value[searchType.value] = [];
	}
	// 通知父组件刷新数据
	const innerFn = props?.getDataList?.();
	// 检查 innerFn 是否存在，且不能是空函数 () => {}
	const isEmptyFn =
		typeof innerFn === 'function' &&
		innerFn.toString().replace(/\s+/g, '') === '()=>{}';
	// 关闭弹窗
	popoverVisible.value = false;
	// 进行搜索
	if (innerFn && !isEmptyFn) {
		innerFn();
	} else {
		props?.searchFn?.();
	}
};
const emits = defineEmits(['update:queryForm']);
const localQueryForm = computed({
	get: () => {
		return props.queryForm;
	},
	set: (val) => {
		// 更新 localQueryForm 的值
		emits('update:queryForm', val);
	},
});
// 处理输入框失去焦点事件 无论是什么时候都保证是数组类型，(后台的需求) -> 除非 showExpand 为 false 时保持字符串
const handleBlur = () => {
	const currentValue = localQueryForm.value[searchType.value];
	if (typeof currentValue === 'string' && props.showExpand) {
		const splitChar = props.splitChar || ',';
		// 如果是字符串并且开启精确搜索，则转换为数组
		localQueryForm.value[searchType.value] = currentValue ? [currentValue] : [];
		// 命中分隔符时进行分割
		if (currentValue.includes(splitChar) && currentValue.length > 2) {
			localQueryForm.value[searchType.value] = currentValue
				.split(splitChar)
				.map((item) => item.trim())
				.filter((item) => item);
		}
	}
	// 清空多行文本域内容
	inputTextarea.value = '';
	if (props.isInputCangeSearch) {
		props?.getDataList();
	}
};
// 组件挂载时的逻辑
onMounted(async () => {});
/*
 * 重置查询条件
 * 当搜索类型变化时，重置查询条件
 */
const changeSearchType = () => {
	// 每次查询类型变化时，不清空所有搜索类型的值
	// localQueryForm.value = {
	// 	...localQueryForm.value,
	// 	[searchType.value]: '',
	// };

	// 每次查询类型变化时，清空所有搜索类型的值
	props.searchTypes.forEach((type) => {
		localQueryForm.value[type.value] = props.showExpand ? [] : undefined;
	});

	// 创建一个新的查询表单对象
	// const newQueryForm = { ...localQueryForm.value };
	// // 清除所有搜索类型的值
	// props.searchTypes.forEach((type) => {
	// 	newQueryForm[type.value] = '';
	// });

	// localQueryForm.value = newQueryForm;
};
</script>

<style lang="scss" scoped></style>
