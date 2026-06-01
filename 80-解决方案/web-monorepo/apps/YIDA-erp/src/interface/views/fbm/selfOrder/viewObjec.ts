/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-11-28 18:30:20
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-11-28 18:31:42
 * @FilePath: \qianyi-ui\src\interface\views\fbm\selfOrder\viewObjec.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
// 我是视图对象的定义文件
export interface SelfOrderViewObject {
	orderId: string;
	customerName: string;
	orderDate: string;
	items: Array<{
		productId: string;
		quantity: number;
		price: number;
	}>;
	totalAmount: number;
	status: 'pending' | 'completed' | 'canceled';
}
