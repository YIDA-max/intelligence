/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-07-07 10:17:26
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-12-09 18:36:35
 * @FilePath: \qianyi-ui\src\types\mitt.d.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
/**
 * mitt 事件类型定义
 *
 * @method openSetingsDrawer 打开布局设置弹窗
 * @method restoreDefault 分栏布局，鼠标移入、移出数据显示
 * @method setSendColumnsChildren 分栏布局，鼠标移入、移出菜单数据传入到 navMenu 下的菜单中
 * @method setSendClassicChildren 经典布局，开启切割菜单时，菜单数据传入到 navMenu 下的菜单中
 * @method getBreadcrumbIndexSetFilterRoutes 布局设置弹窗，开启切割菜单时，菜单数据传入到 navMenu 下的菜单中
 * @method layoutMobileResize 浏览器窗口改变时，用于适配移动端界面显示
 * @method openOrCloseSortable 布局设置弹窗，开启 TagsView 拖拽
 * @method openShareTagsView 布局设置弹窗，开启 TagsView 共用
 * @method onTagsViewRefreshRouterView tagsview 刷新界面
 * @method onCurrentContextmenuClick tagsview 右键菜单每项点击时
 * @method productTypeChange 商品类型改变时
 */
declare type MittType<T = any> = {
	openSetingsDrawer?: string;
	restoreDefault?: string;
	setSendColumnsChildren: T;
	setSendClassicChildren: T;
	getBreadcrumbIndexSetFilterRoutes?: string;
	layoutMobileResize: T;
	openOrCloseSortable?: string;
	openShareTagsView?: string;
	onTagsViewRefreshRouterView?: T;
	onCurrentContextmenuClick?: T;
	productTypeChange?: T;
};

// mitt 参数类型定义
declare type LayoutMobileResize = {
	layout: string;
	clientWidth: number;
};

// mitt 参数菜单类型
declare type MittMenu = {
	children: RouteRecordRaw[];
	item?: RouteItem;
};
