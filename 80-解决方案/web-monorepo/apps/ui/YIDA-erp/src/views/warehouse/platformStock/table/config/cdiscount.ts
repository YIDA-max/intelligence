import { useI18n } from 'vue-i18n';

export const getColumns = () => {
	const { t } = useI18n();
	return [
		{
			type: 'checkbox',
			width: 60,
			fixed: 'left',
		},
		{
			title: t('店铺/站点'),
			field: 'storeSite',
			width: 160,
			fixed: 'left',
		},
		{
			title: t('图片'),
			field: 'imgUrl',
			width: 100,
			fixed: 'left',
		},
		{
			title: t('SKU / 产品名称'),
			field: 'skuName',
			width: 300,
			fixed: 'left',
		},
		{
			title: t('产品ID'),
			field: 'productId',
			width: 160,
			fixed: 'left',
			showHeaderTooltip: true,
			headerTooltip: t('类似于ASIN'),
		},
		{
			title: t('产品状态'),
			field: 'productState',
			width: 140,
		},
		{
			title: t('产品情况'),
			field: 'productCondition',
			width: 160,
		},
		{
			title: t('卖家ID'),
			field: 'sellerId',
			width: 160,
		},
		{
			title: t('系统MSKU'),
			field: 'mskuCode',
			width: 220,
		},
		{
			title: t('可用库存'),
			field: 'availableQuantity',
			width: 150,
			sortable: true,
			isSum: true,
		},
		{
			title: t('已分配库存'),
			field: 'allocatedQuantity',
			width: 150,
			sortable: true,
			isSum: true,
		},
		{
			title: t('锁定库存'),
			field: 'blockedQuantity',
			width: 150,
			sortable: true,
			isSum: true,
		},
		{
			title: t('争议中的库存'),
			field: 'litigationQuantity',
			width: 150,
			sortable: true,
			isSum: true,
		},
		{
			title: t('待移除库存'),
			field: 'removalQuantity',
			width: 150,
			sortable: true,
			isSum: true,
		},
		{
			title: t('待退回库存'),
			field: 'returnQuantity',
			width: 150,
			sortable: true,
			isSum: true,
		},
		{
			title: t('物流中的库存'),
			field: 'logisticOperationsQuantity',
			width: 200,
			sortable: true,
			isSum: true,
		},
		{
			title: t('创建时间'),
			field: 'createdAt',
			width: 180,
			sortable: true,
		},
		{
			title: t('更新时间'),
			field: 'updatedAt',
			width: 180,
			sortable: true,
		},
	];
};
