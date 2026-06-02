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
	// ===== 排序配置 =====
	descsDefault?: string[]; // 降序字段--默认值
	ascsDefault?: string[]; // 升序字段--默认值
	// props属性对象，类型为any
	props?: any;
	// 处理表格数据的回调
	handleTableData?: (data: any[]) => any[];
	// 查询数据之前的搜索参数处理函数
	beforeQueryParamsHandle?: (params: any) => any;
	// 当有expand行的时候,是否默认展开全部行
	defaultExpandAll?: boolean;
	// 是否自动收起展开行，默认为false
	isAutoCollapseExpand?: boolean;
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
	// 每页显示条数--默认值
	sizeDefault?: number;
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
		descsDefault: [],
		ascsDefault: [],
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
		// 是否自动收起展开行，默认为false
		isAutoCollapseExpand: false,
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

		// 处理排序字段的默认值逻辑
		// 如果传入了 descsDefault，用它初始化 descs
		if (props.descsDefault && props.descsDefault?.length > 0) {
			if (!props.descs || props.descs?.length === 0) {
				props.descs = [...props.descsDefault];
			}
		}
		// 如果传入了 ascsDefault，用它初始化 ascs
		if (props.ascsDefault && props.ascsDefault?.length > 0) {
			if (!props.ascs || props.ascs.length === 0) {
				props.ascs = [...props.ascsDefault];
			}
		}

		// 如果传入了 descs 有值，将其保存为 descsDefault（如果 descsDefault 未设置）
		if (props.descs && props.descs?.length > 0) {
			if (!props.descsDefault || props.descsDefault?.length === 0) {
				props.descsDefault = [...props.descs];
			}
		}
		// 如果传入了 ascs 有值，将其保存为 ascsDefault（如果 ascsDefault 未设置）
		if (props.ascs && props.ascs?.length > 0) {
			if (!props.ascsDefault || props.ascsDefault?.length === 0) {
				props.ascsDefault = [...props.ascs];
			}
		}

		// 处理分页 size 的默认值逻辑
		if (props.pagination) {
			// 如果传入了 sizeDefault，用它初始化 size
			if (props.pagination.sizeDefault) {
				if (!props.pagination.size) {
					props.pagination.size = props.pagination.sizeDefault;
				}
			}
			// 如果传入了 size 有值，将其保存为 sizeDefault（如果 sizeDefault 未设置）
			if (props.pagination.size) {
				if (!props.pagination.sizeDefault) {
					props.pagination.sizeDefault = props.pagination.size;
				}
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
				const descs = state?.descs?.join(',') || '';
				const ascs = state?.ascs?.join(',') || '';

				// 调用state.pageList方法发起分页查询
				const res = await state.pageList({
					...beforeParams,
					current: state.pagination?.current,
					size: state.pagination?.size,
					descs: descs,
					ascs: ascs,
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
				// 如果配置了清空选中数据，则调用表格组件的clearSelection方法
				if (tableRef?.value && options?.clearSelection === true) {
					tableRef?.value?.clearSelection();
				}
				// 如果有展开行，并且配置了默认展开全部行，则调用toggleRowExpansion方法展开所有行
				if (tableRef?.value && state.defaultExpandAll) {
					toggleRowExpand();
				}
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
	 * 将全部的展开收起
	 * */
	const toggleRowCollapse = () => {
		// 拿到当前全部的row
		state.dataList?.forEach((row: any) => {
			if (tableRef?.value) {
				tableRef?.value.toggleRowExpansion(row, false);
			}
		});
	};
	/**
	 * 将表格全部展开
	 * */
	const toggleRowExpand = () => {
		// 拿到当前全部的row
		state.dataList?.forEach((row: any) => {
			if (tableRef?.value) {
				tableRef?.value.toggleRowExpansion(row, true);
			}
		});
	};
	/**
	 * 设置table组件的选中
	 */
	const setTableSelection = (rows: any[]) => {
		if (tableRef?.value) {
			tableRef?.value.clearSelection();
			rows.forEach((row: any) => {
				tableRef?.value.toggleRowSelection(row, true);
			});
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
		// 排序字段修改为初始化
		state.descs = [];
		state.ascs = [];
		if (state.descsDefault && state.descsDefault.length > 0) {
			state.descs = [...state.descsDefault];
		}
		if (state.ascsDefault && state.ascsDefault.length > 0) {
			state.ascs = [...state.ascsDefault];
		}
		if (column.order) {
			// ascs 和 descs 去重
			// state.ascs = Array.from(new Set(state.ascs));
			// state.descs = Array.from(new Set(state.descs));
			const prop = other.toUnderline(column.prop);
			const ascIndex = state.ascs!.indexOf(prop);
			const descIndex = state.descs!.indexOf(prop);
			if (ascIndex > -1) state.ascs!.splice(ascIndex, 1);
			if (descIndex > -1) state.descs!.splice(descIndex, 1);

			// 再根据 order 添加到对应数组
			if (column.order === 'descending') {
				state.descs?.push(prop);
			} else if (column.order === 'ascending') {
				state.ascs?.push(prop);
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
			tableRef?.value?.clearSelection();
		}
		// 如果需要自动收起展开内容
		if (state.isAutoCollapseExpand) {
			toggleRowCollapse();
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
		} = () => ({
			queryForm: {
				current: 1,
				size: state.pagination?.sizeDefault || 10,
			},
			descs: state.descsDefault || [],
			ascs: state.ascsDefault || [],
		})
	) => {
		const { queryForm, descs, ascs } = callBack();
		state.queryForm = queryForm;
		state.descs = descs;
		state.ascs = ascs;
		// 重置分页的 size 为默认值
		if (state.pagination) {
			state.pagination.current = 1;
			state.pagination.size = state.pagination.sizeDefault || 10;
		}
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
