// 定义数据项的接口（根据你的业务调整）
interface DataItem {
	abbTwoCode?: string;
	createTime?: string | number | Date;
	name?: string;
	sortOrder?: number;
	[key: string]: any;
}

const mapSort: Record<string, (a: DataItem, b: DataItem) => number> = {
	// 1. 按照国家代码字母排序 (忽略大小写)
	country: (a, b) => {
		const aa = String(a?.abbTwoCode || '');
		const bb = String(b?.abbTwoCode || '');
		return aa.localeCompare(bb, 'en', { numeric: true, sensitivity: 'base' });
	},

	// 2. 按照时间倒序 (新的在前)
	dateDesc: (a, b) => {
		const timeA = new Date(a.createTime || 0).getTime();
		const timeB = new Date(b.createTime || 0).getTime();
		return timeB - timeA;
	},

	// 3. 自定义权重排序 (例如按 sortOrder 字段从小到大)
	custom: (a, b) => {
		return (a.sortOrder || 0) - (b.sortOrder || 0);
	},

	// 4. 基础字符串排序 (例如按名称)
	name: (a, b) => {
		return (a.name || '').localeCompare(b.name || '', 'zh-CN');
	},
};

/**
 * 获取排序函数
 * @param key 对应 mapSort 的键
 */
export const getMapSort = (key: keyof typeof mapSort) => {
	return mapSort[key] || (() => 0); // 如果没匹配到，返回不排序的默认函数
};
