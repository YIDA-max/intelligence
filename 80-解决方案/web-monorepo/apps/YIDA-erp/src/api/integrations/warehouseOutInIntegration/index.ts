/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-03-03 18:48:13
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-11 16:46:14
 * @FilePath: \qianyi-ui\src\api\integrations\warehouseOutInIntegration\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { httpService } from '/@/utils/request';

/**
 * 列表分页查询
 */
export function getInOutInventoryKingdeePage(data?: any) {
	return httpService.post('/kingdee/inOutInventoryKingdee/page', data);
}

/**
 * 导出平台发货订单金蝶单据
 */
export function getInOutInventoryKingdeeExport(data?: any) {
	return httpService.post('/kingdee/inOutInventoryKingdee/export', data, {
		responseType: 'blob',
	});
}

/**
 * 生成金蝶单据
 */
export function postInOutInventoryKingdeePushKingdee(params?: {
	[key: string]: any;
}) {
	return httpService.post('/kingdee/inOutInventoryKingdee/pushKingdee', params);
}

/**
 * 更新
 */
export function postInOutInventoryKingdeeUpdata(params?: {
	[key: string]: any;
}) {
	return httpService.post(
		'/kingdee/inOutInventoryKingdee/updateInOutInventoryKingdeeBatch',
		params
	);
}
