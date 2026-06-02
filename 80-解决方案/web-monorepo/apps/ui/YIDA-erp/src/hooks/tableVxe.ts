import { ElMessage } from 'element-plus';
import other from '/@/utils/other';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import type { DebouncedFunc } from 'lodash';
import { onBeforeUnmount, onMounted } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';

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

export function useTableVxe(options: BasicTableProps, tableRef: any) {
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
		// 分页组件属性配置，如当前页码、每页展示数据条数等
		pagination: {
			current: 1,
			size: 10,
			total: 0,
			pageSizes: [1, 10, 20, 50, 100, 200],
			layout: 'total, sizes, prev, pager, next, jumper',
		} as Pagination,
		// 当前选中的数据项，默认为空数组
		dataListSelections: [],
		// 是否正在从服务器加载数据，默认为false
		loading: false,
		// 表格数据项的选择数据，默认为空数组
		selectObjs: [],
		// 排序时使用的字段名数组
		descs: [],
		// 排序方向数组
		ascs: [],
		// props属性配置对象，用于自定义数据属性
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
		if (params && typeof params === 'object' && !Array.isArray(params)) {
			const processedParams: any = {};
			Object.keys(params).forEach((key) => {
				const value = params[key];
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
		if (state.pageList) {
			try {
				state.loading = true;
				const beforeParams = handleRequestParams(
					state.beforeQueryParamsHandle
						? state.beforeQueryParamsHandle(state.queryForm)
						: state.queryForm
				);

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

				// vxe-table 使用 clearCheckboxRow 清空复选框选中
				if (tableRef?.value && options?.clearSelection === true) {
					tableRef?.value?.clearCheckboxRow();
				}

				// vxe-table 使用 setAllTreeExpand 展开所有树节点
				if (tableRef?.value && state.defaultExpandAll) {
					toggleRowExpand();
				}
			} catch (err: any) {
				ElMessage.error(err.msg || err.data.msg);
			} finally {
				state.loading = false;
			}
		}
	};

	/** 防抖：适合输入/筛选等高频触发场景 */
	const queryDebounced: DebouncedFunc<() => void> = debounce(
		() => {
			void query({
				clearSelection: state.isAutoClearSelection,
			});
		},
		500,
		{ leading: false, trailing: true }
	);

	/** 节流：适合按钮/翻页/滚动等场景 */
	const queryThrottled: DebouncedFunc<() => void> = throttle(
		() => {
			void query({
				clearSelection: state.isAutoClearSelection,
			});
		},
		800,
		{ leading: true, trailing: true }
	);

	/**
	 * 将全部的展开收起
	 * vxe-table 使用 setAllTreeExpand(false) 或 clearRowExpandLoaded() + setAllRowExpand(false)
	 */
	const toggleRowCollapse = () => {
		if (tableRef?.value) {
			// 如果是树形表格，使用 setAllTreeExpand
			if (tableRef?.value.setAllTreeExpand) {
				tableRef?.value.setAllTreeExpand(false);
			}
			// 如果是展开行，使用 setAllRowExpand
			else if (tableRef?.value.setAllRowExpand) {
				tableRef?.value.setAllRowExpand(false);
			}
		}
	};

	/**
	 * 将表格全部展开
	 * vxe-table 使用 setAllTreeExpand(true) 或 setAllRowExpand(true)
	 */
	const toggleRowExpand = () => {
		if (tableRef?.value) {
			// 如果是树形表格，使用 setAllTreeExpand
			if (tableRef?.value.setAllTreeExpand) {
				tableRef?.value.setAllTreeExpand(true);
			}
			// 如果是展开行，使用 setAllRowExpand
			else if (tableRef?.value.setAllRowExpand) {
				tableRef?.value.setAllRowExpand(true);
			}
		}
	};

	/**
	 * 设置table组件的选中
	 * vxe-table 使用 setCheckboxRow 设置复选框选中
	 */
	const setTableSelection = (rows: any[]) => {
		if (tableRef?.value) {
			tableRef?.value.clearCheckboxRow();
			tableRef?.value.setCheckboxRow(rows, true);
		}
	};

	// 组件挂载时执行
	onMounted(() => {
		if (state.createdIsNeed) {
			queryDebounced();
		}
		if (tableRef?.value) {
			// 监听表格是否进入可视区域，进入则触发加载数据
			useIntersectionObserver(
				tableRef?.value ? tableRef?.value.$el : null,
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
	 */
	const sizeChangeHandle = (val: number) => {
		state.pagination!.size = val;
		query({ clearSelection: false });
	};

	/**
	 * 当前页码改变事件处理函数
	 */
	const currentChangeHandle = (val: number) => {
		state.pagination!.current = val;
		query({ clearSelection: false });
	};

	/**
	 * 排序触发事件
	 * vxe-table 的排序事件参数结构：{ column, property, order, sortList, $event }
	 * order 值为：'asc' | 'desc' | null
	 */
	const sortChangeHandle = (params: any) => {
		// 清空原有排序字段
		state.ascs = [];
		state.descs = [];

		const { property, order } = params;
		const prop = other.toUnderline(property);

		if (order === 'desc') {
			state.descs?.push(prop);
		} else if (order === 'asc') {
			state.ascs?.push(prop);
		}

		queryDebounced();
	};

	/**
	 * 获取数据列表，并可选择是否刷新当前页码
	 */
	const getDataList = async (refresh?: any) => {
		if (refresh !== false) {
			state.pagination!.current = 1;
		}

		// vxe-table 使用 clearCheckboxRow 清空选中
		if (tableRef?.value && state.isAutoClearSelection) {
			tableRef?.value?.clearCheckboxRow();
		}

		queryDebounced();
	};

	/** 防抖：适合输入/筛选等高频触发场景 */
	const getDataListDebounced: DebouncedFunc<(refresh?: boolean) => void> =
		debounce(
			(refresh: boolean = true) => {
				void getDataList(refresh);
			},
			300,
			{ leading: false, trailing: true }
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

	// 组件卸载时清理
	onBeforeUnmount(() => {
		getDataListDebounced.cancel();
		getDataListThrottled.cancel();
		queryDebounced.cancel();
		queryThrottled.cancel();
	});

	/**
	 * 下载文件
	 */
	const downBlobFile = (url: string, query: any, fileName: string) => {
		return other.downBlobFile(url, query, fileName);
	};

	/**
	 * 手动设置表格的数据
	 */
	const setTableData = (data: any[]) => {
		state.dataList = data;
	};

	/**
	 * 获取表格数据
	 */
	const getTableData = () => {
		return state.dataList || [];
	};

	/**
	 * 重置表格查询条件，并重新获取数据
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
		// vxe-table 使用 clearSort 清空排序
		if (tableRef?.value) tableRef?.value?.clearSort();
		getDataList();
	};

	/**
	 * 清空分页数据
	 */
	const clearPagination = () => {
		state.pagination = { current: 1, size: 10 };
	};

	/**
	 * 获取选中的行数据
	 * vxe-table 使用 getCheckboxRecords 获取复选框选中的行
	 */
	const getSelectionRows = () => {
		if (tableRef?.value) {
			return tableRef?.value.getCheckboxRecords() || [];
		}
		return [];
	};

	/**
	 * 获取选中的行数据（包含半选状态）
	 * vxe-table 特有方法
	 */
	const getCheckboxReserveRecords = () => {
		if (tableRef?.value) {
			return tableRef?.value.getCheckboxReserveRecords() || [];
		}
		return [];
	};

	return {
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
		getSelectionRows,
		getCheckboxReserveRecords,
	};
}
