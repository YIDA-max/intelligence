/*
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-30 11:14:09
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-21 16:43:34
 * @FilePath: \qianyi-ui\src\api\purchase\demand\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import request from '/@/utils/request';
import type { IPageListResponse } from '/@/components/BaseTable/hooks/BaseTable';

// 分页查询
export function getDemandPage(data?: object): Promise<IPageListResponse> {
	return request({
		url: '/purchase/demand/page',
		method: 'post',
		data,
	}) as Promise<IPageListResponse>;
}

// 通过部门查询sku
export function getSkuByDeptId(params?: object) {
	return request({
		url: '/product/sku/pageByDeptId',
		method: 'get',
		params,
	});
}

// 新增需求
export function postDemandSave(data: Object) {
	return request({
		url: '/purchase/demand/save',
		method: 'post',
		data,
	});
}

// 修改需求
export function postDemandUpdate(data: Object) {
	return request({
		url: '/purchase/demand/update',
		method: 'post',
		data,
	});
}

//修改并提交需求
export function postDemandUpdateAndSubmit(data: Object) {
	return request({
		url: '/purchase/demand/updateAndSubmit',
		method: 'post',
		data,
	});
}
// 删除需求
export function postDemandDelete(data: Object) {
	return request({
		url: '/purchase/demand/delete',
		method: 'post',
		data,
	});
}

// 获取需求详情
export function getDemandDetailInfo(params: object) {
	return request({
		url: `/purchase/demand/detailInfo`,
		method: 'get',
		params,
	});
}

// 获取需求详情
export function getDetailInfoDemandNo(params: object) {
	return request({
		url: `/purchase/demand/detailInfo/demandNo`,
		method: 'get',
		params,
	});
}
/**
 * 运营主管审核
 */
export function postOperationSupervisorReview(data: Object) {
	return request({
		url: '/purchase/demand/operationSupervisorReview',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
			text: '审核中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}
// 运营总监审核
export function postDirectorReview(data: Object) {
	return request({
		url: '/purchase/demand/directorReview',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
			text: '审核中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}

// 物料审核
export function postMaterialReview(data: Object) {
	return request({
		url: '/purchase/demand/materialReview',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
			text: '审核中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}
/**
 * 物控主管审核
 */
export function postCollectionSupervisorReview(data: Object) {
	return request({
		url: '/purchase/demand/collectionSupervisorReview',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
			text: '审核中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}
/**
 * 物控负责人审核
 */
export function postReviewedMaterialsSupervisorReview(data: Object) {
	return request({
		url: '/purchase/demand/reviewedMaterialsSupervisorReview',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
			text: '审核中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}
// 财务审核
export function postFinancialReview(data: Object) {
	return request({
		url: '/purchase/demand/financialReview',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
			text: '审核中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}

// 已审核驳回
export function postDemandRejected(data: Object) {
	return request({
		url: '/purchase/demand/rejected',
		method: 'post',
		data,
		loadingConfig: {
			loading: true,
			text: '审核中...',
			background: 'rgba(255, 255, 255, 0.7)',
		},
	});
}

// 获取导出
export function getExportDemand(data: object) {
	return request({
		url: '/purchase/demand/export',
		method: 'post',
		data,
		responseType: 'blob', // 设置响应类型为 blob
	});
}

// 审核获取单据详情
export function postDemandReviewDetail(data: Object) {
	return request({
		url: '/purchase/demand/reviewDetail',
		method: 'post',
		data,
	});
}

// 通过sku+国家+渠道查询msku信息
export function getSkuQueryMsku(params: object) {
	return request({
		url: '/product/sku/queryMsku',
		method: 'get',
		params,
	});
}
// 通过sku+国家+渠道查询msku信息带是否是捆绑的sku 查询MSKU信息（包含捆绑Msku）
export async function getSkuQueryMskuWithBundleFlag(params: object) {
	const res: any = await request({
		url: '/product/sku/queryAllMsku',
		method: 'get',
		params,
	});
	// 如果请求成功且有数据，进行数据处理
	if (
		res.code === 0 &&
		res.data &&
		Array.isArray(res.data) &&
		res.data.length > 0
	) {
		// 按 mskuType 分类：0-普通SKU，1-捆绑商品
		const skuList: any[] = []; // mskuType === 0 或 !== 1
		const bundleList: any[] = []; // mskuType === 1

		res.data.forEach((item: any) => {
			// 创建新对象，避免修改原数据
			const processedItem = { ...item };
			// 根据 mskuType 添加 label 前缀
			if (item.mskuType === 2) {
				// mskuType 为 2，是捆绑商品
				processedItem.label = item.label
					? `${item.label}`
					: item.mskuCode
					? `${item.mskuCode}`
					: `${item.value || ''}`;
				bundleList.push(processedItem);
			} else {
				// mskuType 为 0 或其他，是普通 SKU
				processedItem.label = item.label
					? `${item.label}`
					: item.mskuCode
					? `${item.mskuCode}`
					: `${item.value || ''}`;
				skuList.push(processedItem);
			}
		});

		// 构建分组格式的数据结构，用于 el-option-group
		// 重要：无论数据多少，都保持分组嵌套格式，确保前端 el-option-group 正常工作
		// 兼容情况：
		// 1. 只有普通 SKU（即使只有1个值）：返回 [{ label: 'SKU', options: [单个值] }]
		// 2. 只有捆绑商品（即使只有1个值）：返回 [{ label: '捆绑', options: [单个值] }]
		// 3. 两者都有：返回 [{ label: 'SKU', options: [...] }, { label: '捆绑', options: [...] }]
		const groupedData: any[] = [];

		// 如果有普通 SKU（即使只有1个，也做分组嵌套）
		if (skuList.length > 0) {
			groupedData.push({
				label: 'MSKU',
				options: skuList, // 即使只有一个值，也放在 options 数组中
			});
		}

		// 如果有捆绑商品（即使只有1个，也做分组嵌套）
		if (bundleList.length > 0) {
			groupedData.push({
				label: '捆绑MSKU',
				options: bundleList, // 即使只有一个值，也放在 options 数组中
			});
		}

		// 返回分组格式的数据
		// 确保：即使只有一个分组且该分组只有一个值，也保持分组嵌套格式
		// 例如：只有一个 SKU 时，返回 [{ label: 'SKU', options: [单个SKU对象] }]
		res.data = groupedData.length > 0 ? groupedData : [];
	} else if (res.code === 0) {
		// 如果没有数据，返回空数组（保持分组格式）
		res.data = [];
	}
	return res;
}
// 勾选生成采购单获取详情
export function postDemandToCreateOrder(data: Object) {
	return request({
		url: '/purchase/demand/toCreateOrder',
		method: 'post',
		data,
	});
}
// 批量提交
export function postDemandSubmit(data: { ids: number[] }) {
	return request({
		url: '/purchase/demand/submit',
		method: 'post',
		data,
	});
}
// 根据skuCode批量获取供应商产品信息
export function postSupplierSkuGetBySkuCode(data: any) {
	return request({
		url: '/purchase/supplierSku/getBySkuCode',
		method: 'post',
		data,
	});
}
