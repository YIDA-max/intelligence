/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-07 10:17:26
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-01-26 14:14:12
 * @FilePath: \qianyi-ui\src\components\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
// 分页组件，用于数据表格的分页功能
import Pagination from '/@/components/Pagination/index.vue';

// 右侧工具栏组件，一般用于表格右上角的搜索、刷新、新增等按钮操作
import RightToolbar from '/@/components/RightToolbar/index.vue';

// 字典标签组件，根据字典值渲染对应的中文标签（如状态、性别等）
import DictTag from '/@/components/DictTag/index.vue';

// 字典下拉框组件，基于字典值生成 `<el-select>` 下拉选项
import DictSelect from '/@/components/DictTag/Select.vue';

// Excel 上传组件，通常用于导入 Excel 文件进行批量数据处理
import UploadExcel from '/@/components/Upload/Excel.vue';

// 文件上传组件，通用上传任意类型文件（如 PDF、DOCX 等）
import UploadFile from '/@/components/Upload/index.vue';

// 图片上传组件，支持选择图片、预览和上传
import UploadImg from '/@/components/Upload/Image.vue';

// 删除包装组件，封装了带确认弹窗的删除操作逻辑
import DelWrap from '/@/components/DelWrap/index.vue';

// 富文本编辑器组件，通常封装如 Quill 或 WangEditor 等
import Editor from '/@/components/Editor/index.vue';

// 提示组件，用于显示页面中的说明信息或注意事项
import Tip from '/@/components/Tip/index.vue';

// 标签列表组件，展示多个标签（如文章标签、关键词等）
import TagList from '/@/components/TagList/index.vue';

// SVG 图标组件，统一使用项目中的 svg 图标资源
import SvgIcon from '/@/components/SvgIcon/index.vue';

// 手写签名组件，用户可进行电子签字操作
import Sign from '/@/components/Sign/index.vue';

// 中国省市区三级联动选择组件
import ChinaArea from '/@/components/ChinaArea/index.vue';

// 组织机构选择器组件，用于选择部门或组织单位等结构化组织数据
import OrgSelector from '/@/components/OrgSelector/index.vue';

// 第三方组件
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import 'element-plus/dist/index.css';
import { Pane, Splitpanes } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
// 日历组件
import { setupCalendar } from 'v-calendar';

// 部门树组件
import vue3TreeOrg from 'vue3-tree-org';
import 'vue3-tree-org/lib/vue3-tree-org.css';

// 导入 FcDesigner
import FcDesigner from 'form-create-designer';
// 导入 vxe-ui
import VxeUI from 'vxe-pc-ui';

// 导入 vxe-table
import VxeTable from 'vxe-table';

import 'vxe-table/lib/style.css';

// 导入声明
import { App } from 'vue';

export default {
	install(app: App) {
		app.component('DictTag', DictTag);
		app.component('DictSelect', DictSelect);
		app.component('Pagination', Pagination);
		app.component('RightToolbar', RightToolbar);
		app.component('uploadExcel', UploadExcel);
		app.component('UploadFile', UploadFile);
		app.component('UploadImg', UploadImg);
		app.component('Editor', Editor);
		app.component('Tip', Tip);
		app.component('DelWrap', DelWrap);
		app.component('TagList', TagList);
		app.component('SvgIcon', SvgIcon);
		app.component('ChinaArea', ChinaArea);
		app.component('OrgSelector', OrgSelector);
		app.component('Sign', Sign);

		// 导入全部的elmenet-plus的图标
		for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
			app.component(key, component);
			// 兼容性
			app.component(`ele-${key}`, component);
		}
		// 导入布局插件
		app.component('Splitpanes', Splitpanes);
		app.component('Pane', Pane);
		app.use(ElementPlus); // ELEMENT 组件
		app.use(setupCalendar, {}); // 日历组件
		app.use(vue3TreeOrg); // 组织架构组件
		app.use(FcDesigner);
		app.use(FcDesigner.formCreate);
		app.use(VxeUI); // vxe-ui 组件
		app.use(VxeTable); // vxe-table 表格组件
	},
};
