const columns = [
	{
		type: 'checkbox',
		width: 40,
		fixed: 'left',
		reserveSelection: true,
	},
	{
		title: '店铺/站点',
		field: 'storeName',
		width: 150,
	},
	{
		title: '库龄计算日期',
		field: 'snapshotDate',
		width: 150,
		sortable: true,
		sortableFn: () => {
			return 'snapshot_date';
		},
	},
	{
		title: 'MSKU',
		field: 'mskuCode',
		width: 150,
	},
	{
		title: 'sku/产品名称',
		field: 'skuCode',
		width: 300,
		// slot: 'skuProductName', // 需要自定义插槽，从msku+店铺+站点+平台取本地数据库的值，分行展示
	},
	{
		title: 'FNSKU',
		field: 'fnsku',
		width: 150,
	},
	{
		title: 'ASIN',
		field: 'asin',
		width: 150,
	},
	{
		title: '产品名称',
		field: 'productName',
		width: 280,
	},
	{
		title: '商品状况',
		field: 'condition',
		width: 170,
	},
	{
		title: '可用库存',
		field: 'available',
		width: 180,
		sortable: true,
	},
	{
		title: '建议移除数量',
		field: 'pendingRemovalQuantity',
		width: 150,
		sortable: true,
	},
	{
		title: '库存龄0至90天',
		field: 'invAge0To90Days',
		width: 190,
		sortable: true,
	},
	{
		title: '库存龄91至180天',
		field: 'invAge91To180Days',
		width: 150,
		sortable: true,
	},
	{
		title: '库存期限181至270天',
		field: 'invAge181To270Days',
		width: 300,
		sortable: true,
	},
	{
		title: '库存龄271至365天',
		field: 'invAge271To365Days',
		width: 300,
		sortable: true,
	},
	{
		title: '库存龄超过365天',
		field: 'invAge365PlusDays',
		width: 150,
		sortable: true,
	},
	{
		title: '库存龄0至30天',
		field: 'invAge0To30Days',
		width: 190,
		sortable: true,
	},
	{
		title: '库存龄31至60天',
		field: 'invAge31To60Days',
		width: 190,
		sortable: true,
	},
	{
		title: '库存周转天数61至90天',
		field: 'invAge61To90Days',
		width: 300,
		sortable: true,
	},
	{
		title: '库存龄181至330天',
		field: 'invAge181To330Days',
		width: 200,
		sortable: true,
	},
	{
		title: '库存龄331至365天',
		field: 'invAge331To365Days',
		width: 200,
		sortable: true,
	},
	{
		title: '币种',
		field: 'currency',
		width: 180,
		sortable: true,
	},
	{
		title: '售出商品数量（过去7天）',
		field: 'unitsShippedT7',
		width: 281,
		sortable: true,
		sortableFn: () => {
			return 'units_shipped_t7';
		},
	},
	{
		title: '售出商品数量（过去30天）',
		field: 'unitsShippedT30',
		width: 280,
		sortable: true,
		sortableFn: () => {
			return 'units_shipped_t30';
		},
	},
	{
		title: '售出商品数量（过去60天）',
		field: 'unitsShippedT60',
		width: 280,
		sortable: true,
		sortableFn: () => {
			return 'units_shipped_t60';
		},
	},
	{
		title: '售出商品数量（过去90天）',
		field: 'unitsShippedT90',
		width: 280,
		sortable: true,
		sortableFn: () => {
			return 'units_shipped_t90';
		},
	},
	{
		title: '预警等级',
		field: 'alert',
		width: 170,
		filterable: true,
	},
	{
		title: '发布价格',
		field: 'yourPrice',
		width: 170,
		sortable: true,
	},
	{
		title: '促销价格',
		field: 'salesPrice',
		width: 170,
		sortable: true,
	},
	{
		title: '新品最低价格',
		field: 'lowestPriceNewPlusShipping',
		width: 150,
		sortable: true,
	},
	{
		title: '二手商品最低价格',
		field: 'lowestPriceUsed',
		width: 150,
		sortable: true,
	},
	{
		title: '建议措施',
		field: 'recommendedAction',
		width: 150,
		filterable: true,
	},
	{
		title: '建议零售价',
		field: 'recommendedSalesPrice',
		width: 190,
		sortable: true,
	},
	{
		title: '推荐销售时长（天）',
		field: 'recommendedSaleDurationDays',
		width: 240,
		sortable: true,
	},
	{
		title: '建议移除量',
		field: 'recommendedRemovalQuantity',
		width: 180,
		sortable: true,
	},
	{
		title: '预估节省成本',
		field: 'estimatedCostSavingsOfRecommendedActions',
		width: 150,
		sortable: true,
	},
	{
		title: '售罄率',
		field: 'sellThrough',
		width: 150,
		sortable: true,
	},
	{
		title: '商品体积',
		field: 'itemVolume',
		width: 170,
		sortable: true,
	},
	{
		title: '体积的计量单位',
		field: 'volumeUnitMeasurement',
		width: 150,
	},
	{
		title: '仓库类型',
		field: 'storageType',
		width: 170,
		filterable: true,
	},
	{
		title: '仓储容量',
		field: 'storageVolume',
		width: 170,
		sortable: true,
	},
	{
		title: '市场',
		field: 'marketplace',
		width: 170,
	},
	{
		title: '商品类别',
		field: 'productGroup',
		width: 170,
	},
	{
		title: '销售排名',
		field: 'salesRank',
		width: 150,
		sortable: true,
	},
	{
		title: '供应天数',
		field: 'daysOfSupply',
		width: 170,
		sortable: true,
	},
	{
		title: '估计超额数量',
		field: 'estimatedExcessQuantity',
		width: 190,
		sortable: true,
	},
	{
		title: '覆盖周期-30',
		field: 'weeksOfCoverT30',
		width: 190,
		sortable: true,
		sortableFn: () => {
			return 'weeks_of_cover_t30';
		},
	},
	{
		title: '覆盖周期-90',
		field: 'weeksOfCoverT90',
		width: 190,
		sortable: true,
		sortableFn: () => {
			return 'weeks_of_cover_t90';
		},
	},
	{
		title: '特色优惠价格',
		field: 'featuredofferPrice',
		width: 150,
		sortable: true,
	},
	{
		title: '最近7天售出的商品数量',
		field: 'salesShippedLast7Days',
		width: 280,
		sortable: true,
		sortableFn: () => {
			return 'sales_shipped_last_7_days';
		},
	},
	{
		title: '最近30天售出的商品数量',
		field: 'salesShippedLast30Days',
		width: 280,
		sortable: true,
		sortableFn: () => {
			return 'sales_shipped_last_30_days';
		},
	},
	{
		title: '最近60天售出的商品数量',
		field: 'salesShippedLast60Days',
		width: 280,
		sortable: true,
		sortableFn: () => {
			return 'sales_shipped_last_60_days';
		},
	},
	{
		title: '最近90天售出的商品数量',
		field: 'salesShippedLast90Days',
		width: 280,
		sortable: true,
		sortableFn: () => {
			return 'sales_shipped_last_90_days';
		},
	},
	{
		title: '未来 30 天预计仓储成本',
		field: 'estimatedStorageCostNextMonth',
		width: 280,
		sortable: true,
	},
	{
		title: '入库数量',
		field: 'inboundQuantity',
		width: 170,
		sortable: true,
	},
	{
		title: '入库—处理中',
		field: 'inboundWorking',
		width: 180,
		sortable: true,
	},
	{
		title: '入库-已接收',
		field: 'inboundShipped',
		width: 180,
		sortable: true,
	},
	{
		title: '入库-已发出',
		field: 'inboundReceived',
		width: 180,
		sortable: true,
	},
	{
		title: '总预留数量',
		field: 'totalReservedQuantity',
		width: 180,
		sortable: true,
	},
	{
		title: '不可售数量',
		field: 'unfulfillableQuantity',
		width: 180,
		sortable: true,
	},
	{
		title: '最近6个月无销售',
		field: 'noSaleLast6Months',
		width: 240,
		sortable: true,
		// 只有美国站点有
	},
	{
		title: 'AIS超期库存量(181-210天)',
		field: 'quantityToBeChargedAis181210Days',
		width: 280,
		sortable: true,
		sortableFn: () => {
			return 'quantity_to_be_charged_ais_181_210_days';
		},
	},
	{
		title: '预估仓储费(181-210天)',
		field: 'estimatedAis181210Days',
		width: 280,
		sortable: true,
		sortableFn: () => {
			return 'estimated_ais_181_210_days';
		},
	},
	{
		title: 'AIS超期库存量(211-240天)',
		field: 'quantityToBeChargedAis211240Days',
		width: 280,
		sortable: true,
		sortableFn: () => {
			return 'quantity_to_be_charged_ais_211_240_days';
		},
	},
	{
		title: '预估仓储费(211-240天)',
		field: 'estimatedAis211240Days',
		width: 280,
		sortable: true,
		sortableFn: () => {
			return 'estimated_ais_211_240_days';
		},
	},
	{
		title: 'AIS超期库存量(241-270天)',
		field: 'quantityToBeChargedAis241270Days',
		width: 280,
		sortable: true,
		sortableFn: () => {
			return 'quantity_to_be_charged_ais_241_270_days';
		},
	},
	{
		title: '预估仓储费(241-270天)',
		field: 'estimatedAis241270Days',
		width: 280,
		sortable: true,
		sortableFn: () => {
			return 'estimated_ais_241_270_days';
		},
	},
	{
		title: 'AIS超期库存量(271-300天)',
		field: 'quantityToBeChargedAis271300Days',
		width: 280,
		sortable: true,
		sortableFn: () => {
			return 'quantity_to_be_charged_ais_271_300_days';
		},
	},
	{
		title: '预估仓储费(271-300天)',
		field: 'estimatedAis271300Days',
		width: 280,
		sortable: true,
		sortableFn: () => {
			return 'estimated_ais_271_300_days';
		},
	},
	{
		title: 'AIS超期库存量(301-330天)',
		field: 'quantityToBeChargedAis301330Days',
		width: 280,
		sortable: true,
		sortableFn: () => {
			return 'quantity_to_be_charged_ais_301_330_days';
		},
	},
	{
		title: '预估仓储费(301-330天)',
		field: 'estimatedAis301330Days',
		width: 280,
		sortable: true,
		sortableFn: () => {
			return 'estimated_ais_301_330_days';
		},
	},
	{
		title: 'AIS超期库存量(331-365天)',
		field: 'quantityToBeChargedAis331365Days',
		width: 280,
		sortable: true,
		sortableFn: () => {
			return 'quantity_to_be_charged_ais_331_365_days';
		},
	},
	{
		title: '预估仓储费(331-365天)',
		field: 'estimatedAis331365Days',
		width: 280,
		sortable: true,
		sortableFn: () => {
			return 'estimated_ais_331_365_days';
		},
	},
	{
		title: 'AIS超期库存量(365+天)',
		field: 'quantityToBeChargedAis365PlusDays',
		width: 280,
		sortable: true,
		sortableFn: () => {
			return 'quantity_to_be_charged_ais_365_plus_days';
		},
	},
	{
		title: '预估仓储费(365+天)',
		field: 'estimatedAis365PlusDays',
		width: 200,
		sortable: true,
		sortableFn: () => {
			return 'estimated_ais_365_plus_days';
		},
	},
	{
		title: '历史供应日',
		field: 'historicalDaysOfSupply',
		width: 190,
		sortable: true,
	},
	{
		title: '建议补货量',
		field: 'recommendedShipInQuantity',
		width: 180,
		sortable: true,
	},
	{
		title: '建议补货日期',
		field: 'recommendedShipInDate',
		width: 180,
		sortable: true,
		sortableFn: () => {
			return 'recommended_ship_in_date';
		},
	},
	{
		title: '历史供应天数的最后更新日期',
		field: 'lastUpdatedDateForHistoricalDaysOfSupply',
		width: 300,
		sortable: true,
		sortableFn: () => {
			return 'last_updated_date_for_historical_days_of_supply';
		},
	},
	{
		title: '是否获得低库存水平费豁免',
		field: 'exemptedFromLowInventoryLevelFee',
		width: 300,
		filterable: true,
	},
	{
		title: '本周是否收取低库存水平费',
		field: 'lowInventoryLevelFeeAppliedInCurrentWeek',
		width: 320,
		filterable: true,
	},
	{
		title: '短期历史供应天数',
		field: 'shortTermHistoricalDaysOfSupply',
		width: 240,
		sortable: true,
	},
	{
		title: '长期历史供应天数',
		field: 'longTermHistoricalDaysOfSupply',
		width: 240,
		sortable: true,
	},
	{
		title: '库存账龄快照日期',
		field: 'inventoryAgeSnapshotDate',
		width: 280,
		sortable: true,
		sortableFn: () => {
			return 'inventory_age_snapshot_date';
		},
	},
	{
		title: 'FBA可售库存',
		field: 'inventorySupplyAtFba',
		width: 150,
		sortable: true,
	},
	{
		title: '预留—调仓中转',
		field: 'reservedFcTransfer',
		width: 150,
		sortable: true,
	},
	{
		title: '预留—仓库处理中',
		field: 'reservedFcProcessing',
		width: 150,
		sortable: true,
	},
	{
		title: '预留客户订单',
		field: 'reservedCustomerOrder',
		width: 180,
		sortable: true,
	},
	{
		title: '总供应天数（含在途）',
		field: 'totalDaysOfSupply',
		width: 250,
		sortable: true,
	},
	{
		title: '供应商',
		field: 'supplier',
		width: 170,
		// 只有美国和日本站点有
	},
	{
		title: 'fba最低库存水平',
		field: 'fbaMinimumInventoryLevel',
		width: 240,
		sortable: true,
		// 只有美国站点有
	},
	{
		title: 'fba库存水平健康状况',
		field: 'fbaInventoryLevelHealthStatus',
		width: 280,
		filterable: true,
		// 只有美国站点有
	},
];
export { columns };
