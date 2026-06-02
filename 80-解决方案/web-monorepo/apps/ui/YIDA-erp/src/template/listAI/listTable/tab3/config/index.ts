import type { IPageListResponse } from '/@/components/BaseTable/hooks/BaseTable';
import type { Columns } from '/@/types/table';

export const listApi = {
	getList: (_params?: any): Promise<IPageListResponse> =>
		Promise.resolve({ code: 0, msg: '', data: { records: [], total: 0 } }),
	exportList: (_params?: any): Promise<any> => Promise.resolve(),
};

export const moduleKey = 'moduleKey_tab3';

export const searchConfig: Array<{
	component: string;
	props: Record<string, any>;
}> = [
	// 参考 listSingle/config/index.ts 中的配置
];

export const columns: Columns = [
	{
		type: 'checkbox',
		width: 60,
		align: 'center',
		fixed: 'left',
	},
	// 根据业务需求添加字段
];
