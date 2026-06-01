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
			field: 'storeName',
			width: 150,
			fixed: 'left',
		},
		{
			title: t('图片'),
			field: 'imgUrl',
			width: 100,
			fixed: 'left',
		},
		{
			title: t('FBT ID'),
			field: 'goodsId',
			width: 150,
			fixed: 'left',
			showHeaderTooltip: true,
			headerTooltip: t('类似FNSKU'),
		},
		{
			title: t('MSKU'),
			field: 'referenceCode',
			width: 150,
			fixed: 'left',
			showHeaderTooltip: true,
			headerTooltip: t('取自:reference_code,作为ERP的MSKU'),
		},
		{
			title: t('仓库ID'),
			field: 'fbtWarehouseId',
			width: 140,
			fixed: 'left',
			showHeaderTooltip: true,
			headerTooltip: t('取自：fbtWarehouseId'),
		},
		{
			title: t('SKU/产品名称'),
			field: 'skuCode',
			width: 300,
		},
		{
			title: t('在库量'),
			field: 'totalQuantity',
			width: 120,
			showHeaderTooltip: true,
			headerTooltip: t('仓库实际在库量，取自：total_quantity'),
			sortable: true,
			isSum: true,
		},
		{
			title: t('在途量'),
			field: 'inTransitQuantity',
			width: 120,
			sortable: true,
			isSum: true,
		},
		{
			title: t('可用量'),
			field: 'availableQuantity',
			width: 120,
			sortable: true,
			isSum: true,
		},
		{
			title: t('预占量'),
			field: 'reservedQuantity',
			width: 120,
			sortable: true,
			isSum: true,
		},
		{
			title: t('不可售'),
			field: 'unfulfillableQuantity',
			width: 120,
			sortable: true,
			isSum: true,
		},
		{
			title: t('更新时间'),
			field: 'updateTime',
			width: 200,
			sortable: true,
		},
	];
};
