/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2026-03-30 09:54:12
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-20 19:44:32
 * @FilePath: \qianyi-ui\src\componentsApi\TreeSelectInputApi\types.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import type { ApiSelectBaseSettings } from '../shared/apiSelect';

export interface TreeSelectInputSettings extends ApiSelectBaseSettings {}

export interface TreeSelectInputApiProps {
	queryForm: {
		[key: string]: any;
	};
	getTreeData?: (params: any) => Promise<any>;
	componentType?: string;
	settings?: Partial<TreeSelectInputSettings>;
	width?: number | string;
	// 以下参数既可以在 prop 一级使用，也可以在 settings 中使用
	// prop 一级的优先级更高
	text?: string;
	code?: string;
	searchFn?: (data: any) => Promise<void>;
	disabled?: boolean;
	showInputSearch?: boolean;
	sortFn?: (a: any, b: any) => number;
}
