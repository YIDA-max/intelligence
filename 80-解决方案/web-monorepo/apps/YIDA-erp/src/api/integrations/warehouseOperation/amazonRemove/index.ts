/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-03-05 20:40:25
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-03-06 15:27:12
 * @FilePath: \qianyi-ui-copy\src\api\integrations\purchaseInbound\jingciPurchaseInbound\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { httpService } from '/@/utils/request';

/**
 * 列表分页查询
 */
export function getAmazonRemovePage(data: any) {
	return httpService.post(
		'/kingdee/platformRemovalOrderIntegration/page',
		data
	);
}

/**
 * 导出京赐采购入库
 */
export function getAmazonRemoveExport(data?: any) {
	return httpService.post(
		'/kingdee/platformRemovalOrderIntegration/export',
		data,
		{
			responseType: 'blob',
		}
	);
}

/**
 * 生成金蝶单据
 */
export function postGenerateAmazonRemoveBill(params?: { [key: string]: any }) {
	return httpService.post(
		'/kingdee/platformRemovalOrderIntegration/pushKingdeeIntegration',
		params
	);
}
