export const columns = [
	{
		type: 'checkbox',
		width: 50,
		align: 'center',
		fixed: 'left',
	},

	{
		field: 'orderContainerNo',
		title: '订柜号',
		width: 120,
		fixed: 'left',
		showOverflow: 'tooltip',
	},

	{
		field: 'containerNo',
		title: '柜号',
		width: 150,
		fixed: 'left',
		showOverflow: 'tooltip',
	},

	{
		field: 'soNo',
		title: 'SO',
		width: 120,
		fixed: 'left',
		showOverflow: 'tooltip',
	},

	{
		field: 'startPortCode',
		title: '起始港',
		width: 100,
		showOverflow: 'tooltip',
	},

	{
		field: 'destPortCode',
		title: '目的港',
		width: 100,
		showOverflow: 'tooltip',
	},

	{
		field: 'destCountryCode',
		title: '目的国',
		width: 100,
		showOverflow: 'tooltip',
	},

	{
		field: 'transportMethod',
		title: '运输方式',
		width: 100,
		showOverflow: 'tooltip',
	},

	{
		field: 'actualLoadingTime',
		title: '实际装柜时间',
		width: 140,
		showOverflow: 'tooltip',
	},

	{
		field: 'vesselVoyage',
		title: '航名航次号',
		width: 120,
		showOverflow: 'tooltip',
	},

	{
		field: 'customsForwarderName',
		title: '清关服务商',
		width: 120,
		showOverflow: 'tooltip',
	},

	{
		field: 'deliveryForwarderName',
		title: '提货派送服务商',
		width: 140,
		showOverflow: 'tooltip',
	},

	{
		field: 'containerTotalQuantity',
		title: '总数量',
		width: 100,
		showOverflow: 'tooltip',
	},

	{
		field: 'containerTotalCartonQuantity',
		title: '总箱数',
		width: 100,
		showOverflow: 'tooltip',
	},

	{
		field: 'containerTotalNetWeight',
		title: '总净重(kg)',
		width: 120,
		showOverflow: 'tooltip',
	},

	{
		field: 'containerTotalGrossWeight',
		title: '总毛重(kg)',
		width: 120,
		showOverflow: 'tooltip',
		scale: 2,
		precision: 'decimal',
	},

	{
		field: 'containerTotalVolume',
		title: '总体积(m³)',
		width: 120,
		showOverflow: 'tooltip',
		scale: 2,
		precision: 'decimal',
	},

	{
		field: 'estimatedDepartureTime',
		title: '预计开船时间',
		width: 140,
		showOverflow: 'tooltip',
	},

	{
		field: 'actualDepartureTime',
		title: '实际开船时间',
		width: 140,
		showOverflow: 'tooltip',
	},

	{
		field: 'estimatedArrivalTime',
		title: '预计到港时间',
		width: 140,
		showOverflow: 'tooltip',
	},

	{
		field: 'actualArrivalTime',
		title: '实际到港时间',
		width: 140,
		showOverflow: 'tooltip',
	},

	{
		field: 'customsStatus',
		title: '海关放行状态',
		width: 140,
		showOverflow: 'tooltip',
		scale: 2,
		precision: 'decimal',
	},

	{
		field: 'processStatus',
		title: '处理状态',
		width: 100,
		showOverflow: 'tooltip',
	},

	{
		field: 'createTime',
		title: '创建时间',
		width: 140,
		showOverflow: 'tooltip',
	},

	{
		field: 'action',
		title: '操作',
		width: 180,
		fixed: 'right',
	},
];
