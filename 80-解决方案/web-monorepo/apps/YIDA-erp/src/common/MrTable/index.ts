/**
 * MrTable 组件导出文件
 * 
 * 提供统一的导入接口，方便在项目中使用
 * 
 * 使用方式：
 * import { MrTable, MrTableColumn } from '/@/common/MrTable';
 * 
 * 或者全局注册：
 * import MrTable from '/@/common/MrTable';
 * app.component('MrTable', MrTable.MrTable);
 * app.component('MrTableColumn', MrTable.MrTableColumn);
 */

import MrTable from './index.vue';
import MrTableColumn from './MrTableColumn.vue';

// 导出类型
export * from './types';

// 默认导出
export default {
	MrTable,
	MrTableColumn,
};

// 命名导出
export { MrTable, MrTableColumn };

