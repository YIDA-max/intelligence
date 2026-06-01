import { ElMessage } from 'element-plus';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import type { DebouncedFunc } from 'lodash';
import other, { deepClone } from '/@/utils/other';

// ==================== 类型定义 ====================

/**
 * 分页配置接口
 */
export interface Pagination {
	current?: number; // 当前页码，默认1
	size?: number; // 每页条数，默认10
	total?: number; // 总条数，默认0
	pageSizes?: number[]; // 每页条数选项
	layout?: string; // 分页组件布局
}

/**
 * 工具栏配置接口
 */
export interface ToolBarConfig {
	handleRefresh?: () => void; // 刷新回调
	isShowRefresh?: boolean; // 显示刷新按钮
	handleExport?: () => void; // 导出回调
	isShowExport?: boolean; // 显示导出按钮
	isShowSetting?: boolean; // 显示设置按钮
	settingKey?: string; // 表单唯一标识
}

/** 合计规则接口 */
export interface SummaryRule {
	prop?: string; // 合计字段名
	precision?: number; // 精度
	scale?: number; // 小数位数
	format?: string; // 格式化函数
	currencyFrom?: string; // 货币来源
	currencyTo?: string; // 货币目标
}

/**
 * 分页接口的标准返回数据结构
 * - 由于后端字段可能不是固定的 records/total，这里允许动态 key
 */
export interface IPageData<T = unknown> {
	records: T[];
	total?: number;
	[key: string]: unknown;
}

/** 分页接口返回结构 */
export interface IPageListResponse<T = unknown> {
	data: IPageData<T> | null;
	code: number;
	msg: string;
}

/**
 * 表格组件配置属性
 */
export interface BasicTableProps {
	// ===== 基础配置 =====
	createdIsNeed?: boolean; // 是否在创建时自动加载数据
	isPage?: boolean; // 是否启用分页
	keyField?: Function | string; // 行唯一标识字段
	style?: Record<string, any>; // 表格样式
	isDialog?: boolean; // 是否是弹窗显示，当前主要用于设置表格高度弹窗无法计算标题栏高度

	// ===== 数据配置 =====
	queryForm?: any; // 查询条件表单
	dataList?: any[]; // 表格数据
	columns?: any[]; // 列配置
	pageList?: (params?: any) => Promise<IPageListResponse>; // 数据查询接口

	// ===== 分页配置 =====
	isShowpagination?: boolean; //是否显示分页按钮
	pagination?: Pagination;

	// ===== 排序配置 =====
	descs?: string[]; // 降序字段
	ascs?: string[]; // 升序字段
	// ===== 排序配置 =====
	descsDefault?: string[]; // 降序字段--默认值
	ascsDefault?: string[]; // 升序字段--默认值

	// ===== 选中配置 =====
	dataListSelections?: any[]; // 多选项数组
	selectObjs?: any[]; // 选中结果
	isAutoClearSelection?: boolean; // 是否自动清空选中
	isAutoCollapseExpand?: boolean; // 是否自动收起
	// ===== 加载状态 =====
	loading?: boolean;
	dataListLoading?: boolean;

	// ===== 回调函数 =====\
	handleTableData?: (data: any[]) => any[]; // 数据处理回调
	beforeQueryParamsHandle?: (params: any) => any; // 查询前参数处理

	// ===== 展开配置 =====
	defaultExpandAll?: boolean; // 默认展开所有行

	// ===== 其他配置 =====
	props?: {
		item: string;
		totalCount: string;
	}; // 响应数据字段映射
	actionColumnProps?: any; // 操作列配置
	toolBarConfig?: ToolBarConfig; // 工具栏配置
	/** 自定义表尾合计方法（传入后可覆盖 BaseTable 默认合计逻辑） */
	summaryMethod?: (param: { columns: any[]; data: any[] }) => any;
}

// ==================== 常量定义 ====================

/** 默认配置选项（工厂函数，避免共享引用） */
export const getDefaultOptions = (): BasicTableProps => ({
	dataListLoading: false,
	createdIsNeed: true,
	isPage: true,
	queryForm: {},
	dataList: [],
	//==========基础配置===============
	isDialog: false,

	isShowpagination: true,
	pagination: {
		current: 1,
		size: 10,
		total: 0,
		pageSizes: [1, 10, 20, 50, 100, 200],
		layout: 'total, sizes, prev, pager, next, jumper',
	},
	dataListSelections: [],
	loading: false,
	selectObjs: [],
	descs: [],
	ascs: [],
	descsDefault: [],
	ascsDefault: [],
	props: {
		item: 'records',
		totalCount: 'total',
	},
	handleTableData: (data) => data,
	beforeQueryParamsHandle: (params) => params,
	defaultExpandAll: false,
	isAutoClearSelection: true,
	isAutoCollapseExpand: false,
	style: { textAlign: 'center' },
	keyField: 'id',
});

// ==================== 主函数 ====================

/**
 * 表格 Composition API Hook
 * @param options 表格配置项
 * @param tableRef 表格引用
 */
export function useTable(options: BasicTableProps, tableRef: any) {
	// ===== 初始化状态 =====
	const state = mergeDefaultOptions(getDefaultOptions(), options);

	// 深拷贝保存一份不会被修改的干净列配置数据（非响应式）
	const unmodifiedColumns = deepClone(state.columns || []);

	// ===== 工具函数 =====

	/**
	 * 合并默认配置和自定义配置
	 */
	function mergeDefaultOptions(defaults: any, customs: any): BasicTableProps {
		for (const key in defaults) {
			if (!Object.getOwnPropertyDescriptor(customs, key)) {
				customs[key] = defaults[key];
			}
		}
		// 处理排序字段的默认值逻辑
		// 如果传入了 descsDefault，用它初始化 descs
		if (customs.descsDefault && customs.descsDefault?.length > 0) {
			if (!customs.descs || customs.descs?.length === 0) {
				customs.descs = [...customs.descsDefault];
			}
		}
		// 如果传入了 ascsDefault，用它初始化 ascs
		if (customs.ascsDefault && customs.ascsDefault?.length > 0) {
			if (!customs.ascs || customs.ascs.length === 0) {
				customs.ascs = [...customs.ascsDefault];
			}
		}

		// 如果传入了 descs 有值，将其保存为 descsDefault（如果 descsDefault 未设置）
		if (customs.descs && customs.descs?.length > 0) {
			if (!customs.descsDefault || customs.descsDefault?.length === 0) {
				customs.descsDefault = [...customs.descs];
			}
		}
		// 如果传入了 ascs 有值，将其保存为 ascsDefault（如果 ascsDefault 未设置）
		if (customs.ascs && customs.ascs?.length > 0) {
			if (!customs.ascsDefault || customs.ascsDefault?.length === 0) {
				customs.ascsDefault = [...customs.ascs];
			}
		}

		return customs;
	}

	/**
	 * 处理请求参数，过滤空值
	 */
	function handleRequestParams(params: any) {
		if (params && typeof params === 'object' && !Array.isArray(params)) {
			const processedParams: any = {};
			Object.keys(params).forEach((key) => {
				const value = params[key];
				// 过滤 null、undefined 和空字符串
				if (value !== null && value !== undefined && value !== '') {
					processedParams[key] = value;
				}
			});
			return processedParams;
		}
		return params;
	}

	/**
	 * 获取表格实例
	 */
	function getTableInstance() {
		return tableRef?.value?.tableRef?.xTableRef;
	}

	// 创建响应式的表格实例引用
	const tableInstanceRef = computed(() => getTableInstance());

	/**
	 * 安全调用表格实例方法
	 * @param methodName 方法名
	 * @param args 方法参数
	 */
	function safeCallTableMethod(methodName: string, ...args: any[]) {
		const instance = tableInstanceRef.value;
		if (instance && typeof instance[methodName] === 'function') {
			return instance[methodName](...args);
		}
		return undefined;
	}

	// ===== 核心查询方法 =====

	/**
	 * 查询表格数据
	 * @param options 查询选项
	 */
	async function query(
		options: { clearCheckboxRow?: boolean } = { clearCheckboxRow: true }
	) {
		if (!state.pageList) return;

		try {
			state.loading = true;

			// 处理查询参数
			const queryParams = state.beforeQueryParamsHandle
				? state.beforeQueryParamsHandle(state.queryForm)
				: state.queryForm;
			const cleanParams = handleRequestParams(queryParams);
			const descs = state?.descs?.join(',') || '';
			const ascs = state?.ascs?.join(',') || '';

			// 发起请求
			const res = await state.pageList({
				...cleanParams,
				current: state.pagination?.current,
				size: state.pagination?.size,
				descs,
				ascs,
			});
			// 如果数据为空，则不进行处理
			if (!res.data) return;
			// props 兜底：虽然默认值会补齐，但这里显式处理避免 TS 提示可能为 undefined
			const props = state.props ?? getDefaultOptions().props!;
			// 处理响应数据
			const rawData = state.isPage
				? (res.data[props.item] as unknown as any[])
				: (res.data as unknown as any[]);
			state.dataList = state.handleTableData
				? state.handleTableData(rawData)
				: rawData;

			// 更新分页总数
			state.pagination!.total = state.isPage
				? (res.data[props.totalCount] as number)
				: 0;

			// 清空选中项
			if (options.clearCheckboxRow) {
				safeCallTableMethod('clearCheckboxRow');
			}

			// 默认展开所有行
			if (state.defaultExpandAll) {
				toggleRowExpand();
			}
		} catch (err: any) {
			// eslint-disable-next-line no-console
			console.error('表格数据加载失败', err);
			ElMessage.error('表格数据加载失败');
		} finally {
			state.loading = false;
		}
	}

	/** 防抖查询（适合输入框、筛选等高频场景） */
	const queryDebounced: DebouncedFunc<() => void> = debounce(
		() => {
			void query({ clearCheckboxRow: state.isAutoClearSelection });
		},
		500,
		{ leading: false, trailing: true }
	);

	/** 节流查询（适合按钮、翻页等场景） */
	const queryThrottled: DebouncedFunc<() => void> = throttle(
		() => {
			void query({ clearCheckboxRow: state.isAutoClearSelection });
		},
		800,
		{ leading: true, trailing: true }
	);
	// ===== 行展开/选中操作 =====

	/**
	 * 收起所有展开行
	 */
	function toggleRowCollapse() {
		state.dataList?.forEach((row: any) => {
			safeCallTableMethod('setRowExpand', row, false);
		});
	}

	/**
	 * 展开所有行
	 */
	function toggleRowExpand() {
		state.dataList?.forEach((row: any) => {
			safeCallTableMethod('setRowExpand', row, true);
		});
	}

	/**
	 * 设置表格选中行
	 * @param rows 要选中的行数据
	 */
	function setTableSelection(rows: any[]) {
		safeCallTableMethod('clearCheckboxRow');
		rows.forEach((row: any) => {
			safeCallTableMethod('toggleRowSelection', row, true);
		});
	}

	/**
	 * 获取当前选中行的 ids
	 * @returns 选中行的 id 数组
	 */
	function getSelectedIds(): any[] {
		// 获取选中的行数据
		const selectedRows = safeCallTableMethod('getCheckboxRecords') || [];
		if (selectedRows.length === 0) return [];

		// 获取 keyField，支持函数和字符串两种形式
		const keyField = state.keyField || 'id';

		// 提取 ids
		if (typeof keyField === 'function') {
			return selectedRows.map((row: any) => keyField(row));
		}
		return selectedRows.map((row: any) => row[keyField]);
	}

	// ===== 分页事件处理 =====

	/**
	 * 每页条数改变
	 * @param val 新的每页条数
	 */
	function sizeChangeHandle(val: number) {
		state.pagination!.size = val;
		query({ clearCheckboxRow: false });
	}

	/**
	 * 当前页码改变
	 * @param val 新的页码
	 */
	function currentChangeHandle(val: number) {
		state.pagination!.current = val;
		query({ clearCheckboxRow: false });
	}

	// ===== 排序处理 =====

	/**
	 * 排序改变事件
	 * @param column 列配置
	 */
	function sortChangeHandle(column: any) {
		// 排序字段修改为初始化
		state.descs = [];
		state.ascs = [];

		if (state?.descsDefault && state.descsDefault?.length > 0) {
			state.descs = [...state.descsDefault];
		}
		if (state?.ascsDefault && state.ascsDefault?.length > 0) {
			state.ascs = [...state.ascsDefault];
		}

		// 使用column找到对应的列配置
		const columnConfig = unmodifiedColumns?.find(
			(item: any) => item.field === column.field
		);
		// 找不到就说明数据不对
		if (!columnConfig) {
			return;
		}
		// 如果sortableFn存在，则使用sortableFn返回的值
		const prop = columnConfig?.sortableFn
			? columnConfig?.sortableFn()
			: other.toUnderline(column.field);
		if (column?.order) {
			// ascs 和 descs 去重
			// state.ascs = Array.from(new Set(state.ascs));
			// state.descs = Array.from(new Set(state.descs));
			const ascIndex = state.ascs!.indexOf(prop);
			const descIndex = state.descs!.indexOf(prop);
			if (ascIndex > -1) state.ascs!.splice(ascIndex, 1);
			if (descIndex > -1) state.descs!.splice(descIndex, 1);

			// 再根据 order 添加到对应数组
			if (column.order === 'desc') {
				state.descs?.push(prop);
			} else if (column.order === 'asc') {
				state.ascs?.push(prop);
			}
		}
		queryDebounced();
	}

	// ===== 数据加载方法 =====

	/**
	 * 获取数据列表
	 * @param refresh 是否重置到第一页，默认 true
	 */
	async function getDataList(refresh: boolean = true) {
		// 重置页码
		if (refresh) {
			state.pagination!.current = 1;
		}

		// 清空选中
		if (state.isAutoClearSelection) {
			safeCallTableMethod('clearCheckboxRow');
		}
		if (state.isAutoCollapseExpand) {
			toggleRowCollapse();
		}
		// 发起查询
		queryDebounced();
	}

	/** 防抖加载（适合输入框、筛选等） */
	const getDataListDebounced: DebouncedFunc<(refresh?: boolean) => void> =
		debounce(
			(refresh: boolean = true) => {
				void getDataList(refresh);
			},
			300,
			{ leading: false, trailing: true }
		);

	/** 节流加载（适合按钮、翻页等） */
	const getDataListThrottled: DebouncedFunc<(refresh?: boolean) => void> =
		throttle(
			(refresh: boolean = true) => {
				void getDataList(refresh);
			},
			800,
			{ leading: true, trailing: true }
		);
	// ===== 数据操作方法 =====

	/**
	 * 设置表格数据
	 * @param data 表格数据
	 */
	function setTableData(data: any[]) {
		state.dataList = data;
	}

	/**
	 * 获取表格数据
	 */
	function getTableData() {
		return state.dataList || [];
	}

	/**
	 * 设置表格列配置
	 * @param columns 列配置
	 */
	function setColumns(columns: any[]) {
		state.columns = columns;
		// 更新合计规则列表
		sumList.value = initSummaryList({ ...state, columns });
		// 刷新表格列,保证列配置的响应式更新
		tableInstanceRef.value.refreshColumn();
		if (sumList.value?.length) {
			tableInstanceRef.value.refreshAggregateCalcValues();
		}
	}

	/**
	 * 重置查询条件
	 * @param callBack 回调函数，返回重置后的查询条件
	 */
	function resetTableQuery(
		callBack: () => {
			queryForm: any;
			descs: string[];
			ascs: string[];
		} = () => ({ queryForm: { current: 1, size: 10 }, descs: [], ascs: [] })
	) {
		const { queryForm, descs, ascs } = callBack();
		state.queryForm = queryForm;
		state.descs = descs;
		state.ascs = ascs;

		safeCallTableMethod('clearSort');

		getDataList();
	}

	/**
	 * 清空分页配置
	 */
	function clearPagination() {
		state.pagination = { current: 1, size: 10 };
	}

	/**
	 * 下载文件
	 * @param url 文件地址
	 * @param query 查询参数
	 * @param fileName 文件名
	 */
	function downBlobFile(url: string, query: any, fileName: string) {
		return other.downBlobFile(url, query, fileName);
	}
	/**
	 * 初始化合计配置：筛选出页面显示的有合计的字段及其配置
	 */
	function initSummaryList(customs: BasicTableProps): SummaryRule[] {
		const columns = customs.columns || [];
		const sumList: SummaryRule[] = [];
		columns.forEach((column: any) => {
			// 筛选条件：
			// 1. 有 isSum 标识且为 true
			// 2. 有 field 字段（字段名）
			// 3. 不是 disabled 的列
			// 4. 不是特殊类型的列（如 checkbox、action 等）

			// 支持自定义合计配置项：
			// summaryFormat（优先级最高）> summaryPre/summarySuffix > 默认格式化（直接显示值）
			if (
				column.isSum === true &&
				column.field &&
				!column.disabled &&
				!['checkbox', 'selection', 'action'].includes(column.type)
			) {
				const rule: SummaryRule = {
					...column,
					// 确保 prop 字段存在，使用 field 的值
					prop: column.field,
					// 清除 column 上可能存在的非函数 format，后续按需赋值
					format: undefined,
				};

				// 支持从列配置中读取合计相关配置
				if (column.precision) {
					rule.precision = column.precision;
				}
				if (column.scale !== undefined) {
					rule.scale = column.scale;
				}
				if (column.summaryFormat) {
					if (typeof column.summaryFormat === 'function') {
						(rule as any).format = column.summaryFormat;
					} else {
						const prefix = String(column.summaryFormat);
						(rule as any).format = (value: any) => `${prefix}${value}`;
					}
				} else if (column.summaryPre || column.summarySuffix) {
					const pre = column.summaryPre ? String(column.summaryPre) : '';
					const suffix = column.summarySuffix
						? String(column.summarySuffix)
						: '';
					(rule as any).format = (value: any) => `${pre}${value}${suffix}`;
				}
				if (column.currencyFrom) {
					rule.currencyFrom = column.currencyFrom;
				}
				if (column.currencyTo) {
					rule.currencyTo = column.currencyTo;
				}

				sumList.push(rule);
			}
		});

		return sumList;
	}

	// 初始化合计规则列表（使用 ref 使其响应式）
	let sumList = ref<SummaryRule[]>(initSummaryList(state));

	// ===== 生命周期钩子 =====

	onMounted(() => {
		// 初始加载数据
		if (state.createdIsNeed) {
			queryDebounced();
		}

		// 监听表格进入可视区域
		if (tableInstanceRef.value) {
			useIntersectionObserver(tableInstanceRef.value, ([entry]) => {
				if (entry.isIntersecting) {
					queryDebounced();
				}
			});
		}
	});

	onBeforeUnmount(() => {
		// 清理防抖/节流，避免内存泄漏
		getDataListDebounced.cancel();
		getDataListThrottled.cancel();
		queryDebounced.cancel();
		queryThrottled.cancel();
	});

	// ===== 返回 API =====

	const api = {
		state,
		unmodifiedColumns,
		query,
		safeCallTableMethod,
		getDataList,
		getDataListDebounced,
		getDataListThrottled,
		sizeChangeHandle,
		currentChangeHandle,
		sortChangeHandle,
		setTableData,
		getTableData,
		setColumns,
		resetTableQuery,
		clearPagination,
		toggleRowCollapse,
		toggleRowExpand,
		setTableSelection,
		getSelectedIds,
		downBlobFile,
		sumList: sumList.value,
		// 返回 computed ref 本身，而不是立即求值，确保在组件挂载后能获取到正确的值
		// 使用方式：register.tableRef.value
		tableRef: tableInstanceRef,
	};

	return {
		register: api,
		...api,
	};
}
