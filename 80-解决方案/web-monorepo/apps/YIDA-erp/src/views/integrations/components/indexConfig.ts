/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-03-05 10:27:47
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-03-05 10:41:55
 * @FilePath: \qianyi-ui-copy\src\views\integrations\components\indexConfig.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ElMessageBox } from 'element-plus';

export const confirmGenerateKdBill = (
	selectedIds: any[],
	onCancel?: () => void
) => {
	const message =
		selectedIds.length > 0
			? `确认要为选中的${selectedIds.length}条记录生成金蝶单据吗？`
			: '确认要为当前筛选条件下所有记录生成金蝶单据吗？';
	return ElMessageBox.confirm(message, '生成金蝶单据', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	}).catch(() => {
		onCancel?.();
		throw new Error('cancelled');
	});
};
