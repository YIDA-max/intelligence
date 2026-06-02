/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2026-04-15 16:26:39
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-16 10:02:27
 * @FilePath: \qianyi-ui\src\views\warehouse\stockRecord\config\index.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
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
			title: t('图片'),
			field: 'imgUrl',
			width: 100,
			fixed: 'left',
		},
		{
			title: t('法人主体'),
			field: 'legalPersonName',
			width: 140,
			fixed: 'left',
		},
		{
			title: t('SKU/产品名称'),
			field: 'skuCode',
			width: 200,
			fixed: 'left',
		},
		{
			title: t('仓库名称'),
			field: 'warehouseCode',
			width: 160,
			fixed: 'left',
		},
		{
			title: t('国家'),
			field: 'countryCode',
			width: 140,
		},
		{
			title: t('渠道'),
			field: 'platformChannelCode',
			width: 120,
		},
		{
			title: t('MSKU代码'),
			field: 'mskuCode',
			width: 140,
		},
		{
			title: t('关联单号'),
			field: 'relateOrderNo',
			width: 160,
		},
		{
			title: t('操作类型'),
			field: 'recordTypeName',
			width: 140,
		},
		{
			title: t('操作数量'),
			field: 'operateQty',
			width: 120,
			isSum: true,
		},
		{
			title: t('部门'),
			field: 'parentDeptName',
			width: 120,
		},
		{
			title: t('运营小组'),
			field: 'deptName',
			width: 120,
		},
		{
			title: t('创建人'),
			field: 'createName',
			width: 140,
		},
		{
			title: t('创建时间'),
			field: 'createTime',
			width: 180,
			sortable: 'custom',
			sortableFn: () => 'r.create_time',
		},
	];
};
