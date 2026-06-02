/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-04-24 15:37:23
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-04-27 16:38:14
 * @FilePath: \qianyi-ui\src\views\materialFlow\orderContainer\confige\enums.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/** 订柜单状态枚举 */
export enum OrderContainerStatus {
	/** 待订舱 */
	WAIT_ORDERING = 1,
	/** 已订舱 */
	ALREADY_ORDERING = 2,
	/** 已发送工厂邮件 */
	ALREADY_SEND_MAIL = 3,
	/** 已安排装柜 */
	CONTAINER_LOADING = 4,
	/** 部分提货 */
	PART_PICKED_UP = 5,
	/** 全部提货 */
	PICKED_UP = 6,
	/** 已发货 */
	ALREADY_DELIVERY = 7,
	/** 已出库 */
	ALREADY_OUT_STORAGE = 8,
	/** 已作废 */
	CANCEL = 9,
}
