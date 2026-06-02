import { ElMessage } from 'element-plus';
import other from '/@/utils/other';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import type { DebouncedFunc } from 'lodash';
import { onBeforeUnmount } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';
import type { VxeTablePropTypes } from 'vxe-table';
/**
 * 表格组件基础配置属性
 */
export interface BasicTableProps {
	// 是否在创建页面时即调用数据列表接口，默认为true
	createdIsNeed?: boolean;
	// 是否需要分页，默认为true
	isPage?: boolean;
	// 查询条件表单对象，类型为any
	queryForm?: any;
	// 数据列表数组
	dataList?: any[];
	// 分页属性对象
	pagination?: Pagination;
	// 数据列表，loading状态标志，默认为false
	dataListLoading?: boolean;
	// 数据列表多选项数组
	dataListSelections?: any[];
	// 数据列表查询接口api方法，接收任意数量参数，返回Promise
	pageList?: (...arg: any) => Promise<any>;
	// loading标志，默认为false
	loading?: boolean;
	// 多选结果数组
	selectObjs?: any[];
	// 排序字段数组
	descs?: string[];
	// 排序方式数组
	ascs?: string[];
	// props属性对象，类型为any
	props?: any;
	// 处理表格数据的回调
	handleTableData?: (data: any[]) => any[];
	// 查询数据之前的搜索参数处理函数
	beforeQueryParamsHandle?: (params: any) => any;
	// 当有expand行的时候,是否默认展开全部行
	defaultExpandAll?: boolean;
	// 是否自动清空选中项，默认为true
	isAutoClearSelection?: boolean;
	// 属性样式
	style?: { [key: string]: any };
}

/**
 * 表格样式。
 */
export interface TableStyle {
	cellStyle: VxeTablePropTypes.CellStyle;
	headerCellStyle: VxeTablePropTypes.HeaderCellStyle;
}

/**
 * 分页属性配置接口
 */
export interface Pagination {
	// 当前页码，默认为1
	current?: number;
	// 每页显示条数，默认为10
	size?: number;
	// 总条数，默认为0
	total?: number;
	// 每页显示条数选择器的选项数组，默认为[10,20,30,40]
	pageSizes?: any[];
	// 分页组件布局方式，可选值有 total,sizes,prev,jump,next，默认为'total,sizes,prev,jump,next'
	layout?: string;
}

export function useTable(options: BasicTableProps, tableRef: any) {
	const defaultOptions: BasicTableProps = {
		// 列表数据是否正在加载中，默认为false
		dataListLoading: false,
		// 是否需要自动请求创建接口来获取表格数据，默认为true
		createdIsNeed: true,
		// 是否展示分页组件，默认为true
		isPage: true,
		// 查询表单对象，用于提交条件查询时的参数传递，默认为空对象
		queryForm: {},
		// 表格展示的数据数组，默认为空数组
		dataList: [],
		// 分页组件属性配置，如当前页码、每页展示数据条数等，默认值为 {current:1, size:10,total:0,pageSizes:[1, 10, 20, 50, 100, 200],layout:'total, sizes, prev, pager, next, jumper'}
		pagination: {
			current: 1,
			size: 10,
			total: 0,
			pageSizes: [1, 10, 20, 50, 100],
			layout: 'total, sizes, prev, pager, next, jumper',
		} as Pagination,
		// 当前选中的数据项，默认为空数组
		dataListSelections: [],
		// 是否正在从服务器加载数据，默认为false
		loading: false,
		// 表格数据项的选择数据，默认为空数组
		selectObjs: [],
		// 排序时使用的字段名数组，如 ['id','name']，默认为空数组
		descs: [],
		// 排序方向数组，如 ['asc', 'desc']，默认为空数组
		ascs: [],
		// props属性配置对象，用于自定义数据属性，默认值为 {item:'records',totalCount:'total'}
		props: {
			item: 'records',
			totalCount: 'total',
		},
		// 处理表格数据的回调
		handleTableData: (data) => {
			return data;
		},
		// 查询数据之前的搜索参数处理函数
		beforeQueryParamsHandle: (params) => {
			return params;
		},
		// 当有expand行的时候,是否默认展开全部行
		defaultExpandAll: false,
		// 是否自动清空选中项，默认为true
		isAutoClearSelection: true,
		// 表格组件的样式配置
		style: {
			textAlign: 'center',
		},
	};
	/**
	 * 合并默认属性配置和自定义属性配置
	 * @param options 默认属性配置对象
	 * @param props 自定义属性配置对象
	 * @returns 合并后的属性配置对象
	 */
	const mergeDefaultOptions = (options: any, props: any): BasicTableProps => {
		for (const key in options) {
			if (!Object.getOwnPropertyDescriptor(props, key)) {
				props[key] = options[key];
			}
		}
		return props;
	};

	// 覆盖默认值
	const state = mergeDefaultOptions(defaultOptions, options);
	// 处理请求参数的方法
	const handleRequestParams = (params: any) => {
		// 确定是对象
		if (params && typeof params === 'object' && !Array.isArray(params)) {
			const processedParams: any = {};
			Object.keys(params).forEach((key) => {
				const value = params[key];
				// 过滤掉 null、undefined 和 空字符串
				if (value !== null && value !== undefined && value !== '') {
					processedParams[key] = value;
				}
			});
			return processedParams;
		}
		return params;
	};
	/**
	 * 发起分页查询，并设置表格数据和分页信息
	 */
	const query = async (
		options: { clearSelection?: boolean } = { clearSelection: true }
	) => {
		// 判断是否存在state.pageList属性
		if (state.pageList) {
			try {
				// 开始加载数据，设置state.loading为true
				state.loading = true;
				const beforeParams = handleRequestParams(
					state.beforeQueryParamsHandle
						? state.beforeQueryParamsHandle(state.queryForm)
						: state.queryForm
				);
				// 调用state.pageList方法发起分页查询
				const res = await state.pageList({
					...beforeParams,
					current: state.pagination?.current,
					size: state.pagination?.size,
					descs: state.descs?.join(','),
					ascs: state.ascs?.join(','),
				});

				// 设置表格展示的数据数组
				if (state?.handleTableData)
					state.dataList = state?.handleTableData(
						state.isPage ? res.data[state.props.item] : res.data
					);
				// 设置分页信息中的总数据条数
				state.pagination!.total = state.isPage
					? res.data[state.props.totalCount]
					: 0;
				// 如果配置了清空选中数据，则调用表格组件的clearCheckboxRow方法 (vxe-table)
				if (tableRef?.value && options?.clearSelection === true) {
					clearTableSelection();
				}
				// 展开行由外部 watch 监听 dataList 变化后处理，确保 DOM 更新后再展开
			} catch (err: any) {
				// 捕获异常并显示错误提示
				ElMessage.error(err.msg || err.data.msg);
			} finally {
				// 结束加载数据，设置state.loading为false
				state.loading = false;
			}
		}
	};
	/** 防抖：适合输入/筛选等高频触发场景 */
	const queryDebounced: DebouncedFunc<() => void> = debounce(
		() => {
			void query({
				clearSelection: state.isAutoClearSelection,
			}); // lodash 包装后不返回 Promise，这里用 void 吞掉
		},
		500,
		{ leading: false, trailing: true } // 最常用配置：只在停止触发后执行一次
	);
	/** 节流：适合按钮/翻页/滚动等场景 */
	const queryThrottled: DebouncedFunc<() => void> = throttle(
		() => {
			void query({
				clearSelection: state.isAutoClearSelection,
			});
		},
		800,
		{ leading: true, trailing: true } // 立即执行，然后在时间区间结束时再执行一次
	);
	/**
	 * 清除表格选中 (vxe-table)
	 */
	const clearTableSelection = () => {
		if (!tableRef?.value?.clearCheckboxRow) return;
		tableRef.value.clearCheckboxRow();
	};

	/**
	 * 设置所有行展开状态 (vxe-table)
	 */
	const setAllRowExpandState = (expanded: boolean) => {
		if (!tableRef?.value?.setAllRowExpand) return;
		tableRef.value.setAllRowExpand(expanded);
	};

	/**
	 * 设置行选中状态 (vxe-table)
	 */
	const setRowCheckboxState = (row: any, checked: boolean) => {
		if (!tableRef?.value?.setCheckboxRow) return;
		tableRef.value.setCheckboxRow(row, checked);
	};

	/**
	 * 将全部的展开收起
	 * */
	const toggleRowCollapse = () => {
		setAllRowExpandState(false);
	};

	/**
	 * 将表格全部展开
	 * */
	const toggleRowExpand = () => {
		setAllRowExpandState(true);
	};

	/**
	 * 设置table组件的选中
	 */
	const setTableSelection = (rows: any[]) => {
		if (!tableRef?.value) return;
		// 清除所有选中
		clearTableSelection();
		// 设置指定行为选中状态
		rows.forEach((row: any) => {
			setRowCheckboxState(row, true);
		});
	};

	// 组件挂载时执行
	onMounted(() => {
		if (state.createdIsNeed) {
			queryDebounced();
		}
		if (tableRef?.value) {
			// 监听表格是否进入可视区域，进入则触发加载数据
			useIntersectionObserver(
				tableRef?.value ? tableRef?.value : null,
				([entry]) => {
					if (entry.isIntersecting) {
						queryDebounced();
					}
				}
			);
		}
	});

	/**
	 * 分页大小改变事件处理函数
	 * @param val 新的分页大小
	 */
	const sizeChangeHandle = (val: number) => {
		// 修改state.pagination中的size属性
		state.pagination!.size = val;
		// 再次发起查询操作，但不清空选中数据
		query({ clearSelection: false });
	};

	/**
	 * 当前页码改变事件处理函数
	 * @param val 新的页码
	 */
	const currentChangeHandle = (val: number) => {
		// 修改state.pagination中的current属性
		state.pagination!.current = val;
		// 再次发起查询操作，但不清空选中数据
		query({ clearSelection: false });
	};

	// 排序触发事件
	const sortChangeHandle = (column: any) => {
		// // // 清空原有排序字段
		state.ascs = [];
		state.descs = [];
		// ascs 和 descs 去重
		// state.ascs = Array.from(new Set(state.ascs));
		// state.descs = Array.from(new Set(state.descs));
		const prop = other.toUnderline(column.prop);
		if (column.order === 'descending') {
			state.descs?.push(prop);
			if (state.ascs!.includes(prop)) {
				state.ascs?.splice(state.ascs.indexOf(prop), 1);
			}
		} else if (column.order === 'ascending') {
			state.ascs?.push(prop);
			if (state.descs!.includes(prop)) {
				state.descs?.splice(state.descs.indexOf(prop), 1);
			}
		} else {
			if (state.ascs!.includes(prop)) {
				state.ascs?.splice(state.ascs.indexOf(prop), 1);
			}
			if (state.descs!.includes(prop)) {
				state.descs?.splice(state.descs.indexOf(prop), 1);
			}
		}
		queryDebounced();
	};

	/**
	 * 获取数据列表，并可选择是否刷新当前页码
	 * 刷新后不跳转第一页，则入参 getDataList(false)
	 * @param refresh 是否刷新当前页码
	 */
	const getDataList = async (refresh?: any) => {
		// 如果需要刷新，则将state.pagination.current重置为1
		if (refresh !== false) {
			state.pagination!.current = 1;
		}
		// 如果有选中的数据，则清空选中数据
		if (tableRef?.value && state.isAutoClearSelection) {
			clearTableSelection();
		}
		// 发起查询操作
		queryDebounced();
	};
	/** 防抖：适合输入/筛选等高频触发场景 */
	const getDataListDebounced: DebouncedFunc<(refresh?: boolean) => void> =
		debounce(
			(refresh: boolean = true) => {
				void getDataList(refresh); // lodash 包装后不返回 Promise，这里用 void 吞掉
			},
			300,
			{ leading: false, trailing: true } // 最常用配置：只在停止触发后执行一次
		);

	/** 节流：适合按钮/翻页/滚动等场景 */
	const getDataListThrottled: DebouncedFunc<(refresh?: boolean) => void> =
		throttle(
			(refresh: boolean = true) => {
				void getDataList(refresh);
			},
			800,
			{ leading: true, trailing: true }
		);

	// 组件里使用时，别忘了卸载清理，避免内存泄漏或“延迟调用”落在已卸载组件上
	onBeforeUnmount(() => {
		getDataListDebounced.cancel();
		getDataListThrottled.cancel();
		queryDebounced.cancel();
		queryThrottled.cancel();
	});
	/**
	 * 下载文件
	 * @param url 文件下载地址
	 * @param query 请求参数（可能包含token）
	 * @param fileName 文件名
	 * @returns 返回一个Promise对象，用于异步处理结果
	 */
	const downBlobFile = (url: string, query: any, fileName: string) => {
		return other.downBlobFile(url, query, fileName);
	};

	/**
	 * 定义表格通用样式
	 * @returns  css
	 */
	const tableStyle: TableStyle = {
		cellStyle: {
			textAlign: state.style?.textAlign || 'center',
		},
		headerCellStyle: {
			textAlign: state.style?.textAlign || 'center',
			background: 'var(--el-table-row-hover-bg-color)',
			color: 'var(--el-text-color-primary)',
		},
	};
	/**
	 * 手动设置表格的数据
	 * @param data 新的数据
	 */
	const setTableData = (data: any[]) => {
		state.dataList = data;
	};

	const getTableData = () => {
		return state.dataList || [];
	};
	/**
	 * 重置表格查询条件，并重新获取数据
	 * @param callBack 回调函数，返回包含 queryForm、descs 和 ascs 的对象
	 */
	const resetTableQuery = (
		callBack: () => {
			queryForm: any;
			descs: string[];
			ascs: string[];
		} = () => ({ queryForm: { current: 1, size: 10 }, descs: [], ascs: [] })
	) => {
		const { queryForm, descs, ascs } = callBack();
		state.queryForm = queryForm;
		state.descs = descs;
		state.ascs = ascs;
		if (tableRef?.value) tableRef?.value?.clearSort();
		getDataList();
	};
	// 清空分页数据
	const clearPagination = () => {
		state.pagination = { current: 1, size: 10 };
	};
	return {
		tableStyle,
		getDataListDebounced,
		getDataListThrottled,
		query,
		getDataList,
		resetTableQuery,
		sizeChangeHandle,
		currentChangeHandle,
		sortChangeHandle,
		downBlobFile,
		setTableData,
		getTableData,
		toggleRowCollapse,
		toggleRowExpand,
		setTableSelection,
		clearPagination,
	};
}
