/** 订柜单状态枚举 */
export enum OrderStatus {
	/** 待拼柜 */
	WAIT_LCL = 1,
	/** 已拼柜 */
	ALREADY_LCL = 2,
	/** 已订舱 */
	ALREADY_BOOKING = 3,
	/** 已发送工厂邮件 */
	ALREADY_SEND_MAIL = 4,
	/** 已安排装柜 */
	ALREADY_ARRANGE_LOADING = 5,
	/** 已提货 */
	ALREADY_PICKUP = 6,
	/** 已发货 */
	ALREADY_SHIPPED = 7,
	/** 已出库 */
	ALREADY_OUT_STORAGE = 8,
}
