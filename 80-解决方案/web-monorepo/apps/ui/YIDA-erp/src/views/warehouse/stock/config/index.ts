export const getColumns = () => {
	return [
		{
			type: 'checkbox',
			width: 60,
			fixed: 'left',
		},
		{
			title: '图片',
			field: 'imgUrl',
			width: 150,
			fixed: 'left',
		},
		{
			title: '法人主体',
			field: 'legalPersonId',
			width: 120,
			fixed: 'left',
		},
		{
			title: 'SKU/产品名称',
			field: 'skuCode',
			width: 200,
			fixed: 'left',
		},
		{
			title: '仓库',
			field: 'warehouseCode',
			width: 180,
			fixed: 'left',
		},
		{
			title: '国家',
			field: 'countryCode',
			width: 180,
		},
		{
			title: '平台渠道',
			field: 'platformChannelCode',
			width: 180,
		},
		{
			title: 'MSKU',
			field: 'mskuCode',
			width: 180,
		},
		{
			title: '在途库存',
			field: 'onwayQty',
			width: 180,
			isSum: true,
		},
		{
			title: '在途库存占用',
			field: 'onwayLockQty',
			width: 180,
			isSum: true,
		},
		{
			title: '实际库存(占用+可用)',
			field: 'totalQty',
			width: 180,
			isSum: true,
		},
		{
			title: '占用库存',
			field: 'lockQty',
			width: 180,
			isSum: true,
		},
		{
			title: '可用库存',
			field: 'availableQty',
			width: 180,
			isSum: true,
		},
		{
			title: '部门',
			field: 'parentDeptName',
			width: 150,
		},
		{
			title: '运营小组',
			field: 'deptName',
			width: 150,
		},
		{
			title: '操作',
			field: 'action',
			width: 100,
			fixed: 'right',
		},
	];
};
