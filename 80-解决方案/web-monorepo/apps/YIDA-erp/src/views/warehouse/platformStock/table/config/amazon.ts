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
			field: 'storeId',
			width: 150,
			fixed: 'left',
			sortable: true,
		},
		{
			title: t('ASIN/MSKU'),
			field: 'asin',
			width: 220,
			fixed: 'left',
		},
		{
			title: t('SKU/产品名称'),
			field: 'skuCode',
			width: 300,
			fixed: 'left',
		},
		{
			title: t('FNSKU'),
			field: 'fnsku',
			width: 120,
		},
		{
			title: t('配送方式'),
			field: 'deliveryMethodText',
			width: 120,
		},
		{
			title: t('总库存'),
			field: 'totalQuantity',
			width: 120,
			showHeaderTooltip: true,
			headerTooltip: t('=在库库存+货件待发货+货件已发货+到货处理中'),
			isSum: true,
		},
		{
			title: t('在库库存'),
			field: 'inStockQuantity',
			width: 120,
			showHeaderTooltip: true,
			headerTooltip: t('=可售库存+不可售可存+预留库存+冻结库存'),
			isSum: true,
		},
		{
			title: t('可售库存'),
			field: 'fulfillableQuantity',
			width: 120,
			showHeaderTooltip: true,
			headerTooltip: t(
				'来源《亚马逊物流库存报告:存档》的字段afn-fulfillable-quantity字段'
			),
			isSum: true,
		},
		{
			title: t('不可售库存'),
			field: 'unsellableQuantity',
			width: 120,
			showHeaderTooltip: true,
			headerTooltip: t(
				'来源《亚马逊物流库存报告:存档》的字段afn-unsellable-quantity字段'
			),
			isSum: true,
		},
		{
			title: t('预留库存'),
			field: 'reservedQuantity',
			width: 120,
			showHeaderTooltip: true,
			headerTooltip: t(
				'来源《亚马逊物流库存报告:存档》的字段afn-reserved-quantity字段'
			),
			isSum: true,
		},
		{
			title: t('冻结库存'),
			field: 'researchingQuantity',
			width: 120,
			showHeaderTooltip: true,
			headerTooltip: t(
				'来源《亚马逊物流库存报告:存档》的字段afn-researching-quantity字段'
			),
			isSum: true,
		},
		{
			title: t('货件待发货'),
			field: 'inboundWorkingQuantity',
			width: 120,
			showHeaderTooltip: true,
			headerTooltip: t(
				'来源《亚马逊物流库存报告:存档》的字段afn-inbound-working-quantity字段'
			),
			isSum: true,
		},
		{
			title: t('货件已发货'),
			field: 'inboundShippedQuantity',
			width: 120,
			showHeaderTooltip: true,
			headerTooltip: t(
				'来源《亚马逊物流库存报告:存档》的字段afn-inbound-shipped-quantity字段'
			),
			isSum: true,
		},
		{
			title: t('到货处理中'),
			field: 'inboundReceivingQuantity',
			width: 120,
			showHeaderTooltip: true,
			headerTooltip: t(
				'来源《亚马逊物流库存报告:存档》的字段afn-inbound-receiving-quantity字段'
			),
			isSum: true,
		},
		{
			title: t('0~30'),
			field: 'invAge0To30Days',
			width: 120,
			isSum: true,
		},
		{
			title: t('31~60'),
			field: 'invAge31To60Days',
			width: 120,
			isSum: true,
		},
		{
			title: t('61~90'),
			field: 'invAge61To90Days',
			width: 120,
			isSum: true,
		},
		{
			title: t('91~180'),
			field: 'invAge91To180Days',
			width: 120,
			isSum: true,
		},
		{
			title: t('181~365'),
			field: 'invAge181To365Days',
			width: 120,
			isSum: true,
		},
		{
			title: t('365+'),
			field: 'invAge365PlusDays',
			width: 120,
			isSum: true,
		},
		{
			title: t('创建时间'),
			field: 'createTime',
			width: 180,
			sortable: true,
		},
		{
			title: t('更新时间'),
			field: 'updateTime',
			width: 180,
			sortable: true,
		},
	];
};
