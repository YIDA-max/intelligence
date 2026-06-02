import { getDicts } from '/@/api/admin/dict';
import { getListByCondition } from '/@/api/mcp/collectionPlan';
import { getWarehouseInfoStoreList } from '/@/api/warehouse/storeVirtualWarehouse';
/**
 * 平台 -> 退货原因字典參數映射
 * - platformCode: getDicts('platform_channel') 返回的 value
 * - returnReasonDictType: 平台对应的退货原因字典参数，dictType
 */
const platformReturnReasonDictMap: Array<{
	platformCode: string;
	returnReasonDictType: string;
}> = [
	{ platformCode: 'Amazon', returnReasonDictType: 'Amazon_fba_return_status' },
	{ platformCode: 'Walmart', returnReasonDictType: 'Walmart_return_status' },
	{
		platformCode: 'Tiktok自运营',
		returnReasonDictType: 'TK_return_status',
	},
];
// 平台-退货原因
export const getPlatformReturntree = async () => {
	const platformRes: any = await getDicts('platform_channel');
	const platformList = Array.isArray(platformRes?.data) ? platformRes.data : [];

	// 只保留在映射表中的平台
	const supportedPlatforms = platformList
		.map((p: any) => {
			const platformCode = p?.value;
			const mapping = platformReturnReasonDictMap.find(
				(m) => m.platformCode === platformCode
			);
			return {
				platformCode,
				platformName: p?.label,
				returnReasonDictType: mapping?.returnReasonDictType,
			};
		})
		.filter((p: any) => p.platformCode && p.returnReasonDictType);

	// 批次拉取各平台的退貨原因字典
	const reasonEntries = await Promise.all(
		supportedPlatforms.map(async (p: any) => {
			const res: any = await getDicts(p.returnReasonDictType);
			const list = Array.isArray(res?.data) ? res.data : [];
			return [
				p.platformCode,
				list.map((item: any) => ({
					id: item.value,
					name: item.label,
				})),
			] as const;
		})
	);

	const reasonMap = Object.fromEntries(reasonEntries) as Record<string, any[]>;

	// 組裝成 cascader 樹
	return supportedPlatforms
		.filter((platform: any) => reasonMap[platform.platformCode]?.length)
		.map((platform: any) => ({
			id: platform.platformCode,
			name: platform.platformName,
			children: reasonMap[platform.platformCode] || [],
		}));
};

// 平台-店铺站点
export const getPlatformTree = async () => {
	const [platformRes, siteRes]: any = await Promise.all([
		getDicts('platform_channel'),
		getListByCondition({}),
	]);

	const platformList = Array.isArray(platformRes?.data) ? platformRes.data : [];
	const siteList = Array.isArray(siteRes?.data) ? siteRes.data : [];

	// 先按平台分组站点
	const siteMap: Record<string, any[]> = {};

	siteList.forEach((site: any) => {
		const key = site.platformChannelCode;

		if (!siteMap[key]) {
			siteMap[key] = [];
		}

		siteMap[key].push({
			id: site.id,
			name: `${site.storeName}：${site.siteCode}`,
		});
	});

	// 生成树
	return platformList
		.filter((platform: any) => siteMap[platform.value]?.length)
		.map((platform: any) => ({
			id: platform.value,
			name: platform.label,
			children: siteMap[platform.value],
		}));
};

// 平台-仓库
export const getStockformTree = async () => {
	const [platformRes, stockRes]: any = await Promise.all([
		getDicts('platform_channel'),
		getWarehouseInfoStoreList({
			current: 1,
			size: 999,
		}),
	]);

	const platformList = Array.isArray(platformRes?.data) ? platformRes.data : [];
	const stockList = Array.isArray(stockRes?.data.records)
		? stockRes.data.records
		: [];

	// 先按平台分组站点
	const stockMap: Record<string, any[]> = {};

	stockList.forEach((stock: any) => {
		const key = stock.platformChannelCode;

		if (!stockMap[key]) {
			stockMap[key] = [];
		}

		stockMap[key].push({
			id: stock.warehouseCode,
			name: `${stock.warehouseName}`,
		});
	});
	// 生成树
	return platformList
		.filter((platform: any) => stockMap[platform.value]?.length)
		.map((platform: any) => ({
			id: platform.value,
			name: platform.label,
			children: stockMap[platform.value] || [],
		}));
};
