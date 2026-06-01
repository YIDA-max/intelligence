/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-01-07 18:15:31
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-01-08 10:02:22
 * @FilePath: \qianyi-ui\src\common\MrImg\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
// src/common/MrImg/index.ts
import { App, Component } from 'vue';
// 直接导入SFC组件（本身已是合法的Vue组件类型）
import MrImg from './index.vue';

// 定义组件名称（与模板中使用的标签名一致）
const COMPONENT_NAME = 'MrImg';

// 声明Vue插件类型（符合Vue官方插件规范）
const MrImgPlugin = {
	install: (app: App) => {
		// 全局注册组件：第一个参数是组件名，第二个是组件本身
		app.component(COMPONENT_NAME, MrImg as Component);
	},
};

// 导出插件（供main.ts全局注册）
export default MrImgPlugin;

// 同时导出组件本身（支持按需导入场景）
export { MrImg };
/***
 * 我觉得可以理解为一个工具，他自己有配置表，或者自己约定式的配置。
 * 然后他就做一件事情，你告诉我名字，我去配置里面找这个组件，如果找到了，那我就返回，如果找不到，那就不对
 * 接下来这个组件用来做什么，就不关我的这个工具的事情了
 */
