/*
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-02-27 20:47:16
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-04-09 15:13:18
 * @FilePath: \qianyi-ui-copy\src\views\integrations\components\tableRouteConfig\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// table公共配置
/**
 * 场景：数据为空时显示跳转链接
 */

/**
 * 销售组织关联配置
 * 模块可配置内容：金蝶销售组织、金蝶客户
 */
export const salesOrgRelation = {
	toPath: '/integrations/baseAssociationConfig/salesOrgRelation/index',
	infoTips: '请前往销售组织中维护>>',
};
/**
 * 库存组织关联配置
 * 模块可配置内容： 金蝶发货仓库、金蝶库存组织、金蝶部门
 */
export const stockOrgRelation = {
	toPath: '/integrations/baseAssociationConfig/inventoryOrgRelation/index',
	infoTips: '请前往库存组织中维护>>',
};

/**
 * 订单推送关系关联配置
 * 模块可配置内容： 生成金蝶单据名称
 */
export const orderProgressOrgRelation = {
	toPath: '/integrations/baseAssociationConfig/orderPromotion/index',
	infoTips: '请前往订单推送关系中维护>>',
};

/**
 * 产品关联配置
 * 模块可配置内容： 产品sku
 */
export const productInfoOrgRelation = {
	toPath: '/integrations/baseAssociationConfig/productSkuRelation/index',
	infoTips: '请前往产品SKU关系中维护>>',
};

/**
 * 产品档案配置
 * 特殊：不是金蝶关联配置为空是迁易的产品档案为空
 */
export const productInfoSku = {
	toPath: '/product/product-info/sku/index',
	infoTips: 'SKU信息没有维护,请前往SKU管理中维护>>',
};

/** 虚拟店铺仓库 */
export const virtualShopStock = {
	toPath: '/warehouse/warehouseInfo/index',
	infoTips: '请前往虚拟店铺仓库中维护>>',
};

/*供应商关系
  模块可配置内容： 金蝶供应商编码  金蝶供应商名称
 */
export const supplierCodeRelation = {
	toPath: '/integrations/baseAssociationConfig/supplierRelationTable/index',
	infoTips: '请前往供应商关系表中维护>>',
};

/*  采购组织关系
    模块可配置内容： 金蝶结算组织编码  金蝶结算组织名称
 */
export const purchaseOrgRelation = {
	toPath: '/integrations/baseAssociationConfig/purchaseOrgRelation/index',
	infoTips: '请前往采购组织关系中维护>>',
};

/* 
 费用项目关系配置
 模块可配置内容： 金蝶费用类型编码  金蝶费用类型名称
 */
export const costTypeRelation = {
	toPath: '/integrations/baseAssociationConfig/expenseItemRelation/index',
	infoTips: '请前往费用项目关系中维护>>',
};

/* 
 仓库维护法人主体（梦圆要求）
 */
export const warehouseRelation = {
	toPath: '/warehouse/warehouseInfo/index',
	infoTips: '请先维护法人主体>>',
};
