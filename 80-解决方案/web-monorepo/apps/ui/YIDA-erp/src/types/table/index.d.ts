// Re-export everything from table.d.ts
export * from './table';

import type { TableColumn } from './table';
import type { VxeGridPropTypes } from 'vxe-table';

// Merge VxeGridPropTypes.Column with TableColumn
export type Column = VxeGridPropTypes.Column & TableColumn;
export type Columns = Column[];
