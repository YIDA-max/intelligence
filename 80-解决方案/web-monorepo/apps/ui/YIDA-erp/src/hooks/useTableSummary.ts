import { computed } from 'vue';
import Decimal from 'decimal.js';

/**
 * 合计规则
 */
export type SummaryRule<T = any> = {
	/** 对应 el-table-column 的 prop */
	prop: string;

	/** 精度策略 */
	precision?: 'number' | 'bigint' | 'decimal';

	/** decimal 保留小数位 */
	scale?: number;

	/**
	 * 最终合计值格式化
	 * value 为「已完成精度计算」后的值
	 */
	format?: (
		value: number | bigint | InstanceType<typeof Decimal>,
		context: {
			prop: string;
			rule: SummaryRule;
			data: any[];
		}
	) => T;

	currencyFrom?: string; // 货币类型From
	currencyTo?: string; // 货币类型To
};

/** 数值判断 */
const isNumeric = (value: any): boolean => {
	return (
		typeof value === 'number' ||
		(typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value)))
	);
};

/** number 求和 */
const sumByNumber = (data: any[], prop: string): number =>
	data.reduce(
		(sum, item) => sum + (isNumeric(item?.[prop]) ? Number(item[prop]) : 0),
		0
	);

/** bigint 求和 */
const sumByBigInt = (data: any[], prop: string): bigint =>
	data.reduce((sum, item) => {
		const val = item?.[prop];
		try {
			return sum + BigInt(val ?? 0);
		} catch {
			return sum;
		}
	}, BigInt(0));

/** decimal 求和 */
const sumByDecimal = (
	data: any[],
	prop: string
): InstanceType<typeof Decimal> =>
	data.reduce((sum, item) => {
		const val = item?.[prop];
		return isNumeric(val) ? sum.plus(val) : sum;
	}, new Decimal(0));

/** 根据精度策略计算合计值 */
const calcTotal = (
	data: any[],
	prop: string,
	rule: SummaryRule
): number | bigint | InstanceType<typeof Decimal> => {
	switch (rule.precision) {
		case 'bigint':
			return sumByBigInt(data, prop);
		case 'decimal':
			return sumByDecimal(data, prop);
		case 'number':
		default:
			return sumByNumber(data, prop);
	}
};

//货币汇率转换,可能每一行的货币汇率不一样，中间的数值处理，也可以抽成参数
// const currencyRate = (data:number,currencyFrom: string, currencyTo: string): number => {
//   return api({...})
// }

export const useTableSummary = (rules: SummaryRule[]) => {
	//单独拿出来规则map，方便后续使用
	const ruleMap = computed(
		() => new Map(rules.map((rule) => [rule.prop, rule]))
	);

	/**
	 * el-table 合计方法，接收表格的列数据
	 */
	const getSummaries = ({ columns, data }: { columns: any[]; data: any[] }) => {
		const sums: (string | number)[] = [];

		columns.forEach((column, index) => {
			// 第一列固定
			if (index === 0) {
				sums[index] = '合计';
				return;
			}

			const prop = column.property;
			const rule = prop ? ruleMap.value.get(prop) : undefined;

			if (!rule) {
				sums[index] = '';
				return;
			}

			// 计算合计
			const total = calcTotal(data, prop, rule);

			// 业务格式化
			if (rule.format) {
				sums[index] = rule.format(total, {
					prop,
					rule,
					data,
				});
				return;
			}

			// 默认兜底展示
			if (total instanceof Decimal) {
				sums[index] =
					rule.scale != null ? total.toFixed(rule.scale) : total.toString();
			} else {
				sums[index] = total.toString();
			}
		});

		return sums;
	};
	/**
	 * vxe-table 合计方法，接收表格的列数据
	 */
	const getSummariesVxe = ({
		columns,
		data,
		sumList,
	}: {
		columns: any[];
		data: any[];
		sumList: any[];
	}) => {
		const sums: (string | number)[] = [];

		// 构建 sumList 对象，兼容 field 和 prop 字段
		const sumObj = sumList.reduce((acc: any, item: any) => {
			// 优先使用 field，如果没有则使用 prop
			const key = item.field || item.prop;
			if (key) {
				acc[key] = item;
			}
			return acc;
		}, {});

		columns.forEach((column, index) => {
			// 第一列固定
			if (index === 0) {
				sums[index] = '合计';
				return;
			}

			// 获取列的字段名，兼容 field 和 property
			const field = column.field || column.property;
			if (!field) {
				sums[index] = '';
				return;
			}

			// 查找对应的合计规则
			const rule = sumObj[field];

			if (!rule) {
				sums[index] = '';
				return;
			}

			// 计算合计时使用的字段名，确保与数据中的字段名匹配
			// 优先使用 rule.field，如果没有则使用 rule.prop，最后使用 column 的 field
			const dataField = rule.field || rule.prop || field;

			// 计算合计
			const total = calcTotal(data, dataField, rule);

			// 业务格式化
			if (rule.format) {
				sums[index] = rule.format(total, {
					prop: dataField,
					rule,
					data,
				});
				return;
			}

			// 默认兜底展示
			if (total instanceof Decimal) {
				sums[index] =
					rule.scale != null ? total.toFixed(rule.scale) : total.toString();
			} else {
				sums[index] = total.toString();
			}
		});

		return sums;
	};
	return {
		getSummaries,
		getSummariesVxe,
	};
};
