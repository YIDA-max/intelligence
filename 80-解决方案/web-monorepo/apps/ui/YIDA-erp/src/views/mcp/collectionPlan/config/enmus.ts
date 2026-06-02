/** 提货计划状态枚举 */
export enum OrderStatus {
	/** 待运营确认发货 */
	WAIT_OPERATION_CONFIRM = '1',
	/** 待采购确认交期 */
	WAIT_PURCHASE_CONFIRM = '2',
	/** 待运营维护货件 */
	WAIT_OPERATION_MAINTAINANCE = '3',
	/** 待上传货件标签 */
	WAIT_UPLOAD_LABEL = '4',
	/** 待推送发货 */
	WAIT_PUSH_SHIP = '5',
	/** 已完成推送 */
	FINISH = '6',
}
