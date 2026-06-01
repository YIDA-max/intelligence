/**
 * 批量编辑产品参数
 *
 * BatchUpdateSkuDTO
 */
export interface BatchUpdateSkuDTO {
	/**
	 * 特殊属性说明
	 */
	attributeDesc?: string;
	/**
	 * 品牌代码
	 */
	brandCode?: string;
	/**
	 * 基础信息
	 * 类目代码
	 */
	categoryCode?: string;
	/**
	 * 颜色
	 */
	color?: string;
	/**
	 * 销售国家
	 */
	countryCodes?: string[];
	/**
	 * 编辑的字段名称
	 */
	fieldNames?: string[];
	/**
	 * 产品等级
	 */
	grade?: string;
	/**
	 * 单品毛重
	 */
	itemGrossWeight?: number;
	/**
	 * 单品毛重单位
	 */
	itemGrossWeightUnit?: string;
	/**
	 * 单品净重
	 */
	itemNetWeight?: number;
	/**
	 * 单品净重单位
	 */
	itemNetWeightUnit?: string;
	/**
	 * 单品规格高
	 */
	itemSpecHeight?: number;
	/**
	 * 单品规格长
	 */
	itemSpecLength?: number;
	/**
	 * 单品规格单位
	 */
	itemSpecUnit?: string;
	/**
	 * 单品规格宽
	 */
	itemSpecWidth?: number;
	/**
	 * 关联产品
	 */
	materials?: ProductSkuMaterialDTO[];
	/**
	 * 运营组
	 */
	operationGroups?: number[];
	/**
	 * 包装规格高
	 */
	packSpecHeight?: number;
	/**
	 * 包装规格长
	 */
	packSpecLength?: number;
	/**
	 * 包装规格单位
	 */
	packSpecUnit?: string;
	/**
	 * 包装规格宽
	 */
	packSpecWidth?: number;
	/**
	 * 销售渠道
	 */
	platformChannelCodes?: string[];
	productDesc?: string;
	/**
	 * 产品负责人
	 */
	productManageId?: number;
	/**
	 * 产品类型
	 */
	productType?: string;
	/**
	 * 采购交期
	 */
	purchaseLeadTime?: number;
	/**
	 * 采购交期单位
	 */
	purchaseLeadTimeUnit?: string;
	/**
	 * 采购信息
	 * 采购负责人ID
	 */
	purchaseManageId?: number;
	/**
	 * 采购备注
	 */
	purchaseRemark?: string;
	/**
	 * 质检
	 */
	qcs?: ProductSkuQcDTO[];
	/**
	 * 参考成本
	 */
	referenceCost?: number;
	/**
	 * 参考成本单位
	 */
	referenceCostUnit?: string;
	/**
	 * 请求参数映射
	 */
	requestMap?: MapObject;
	/**
	 * 箱规
	 */
	skuCartons?: ProductSkuCarton[];
	/**
	 * SKU列表
	 */
	skuCodes?: string[];
	/**
	 * 特殊属性
	 */
	specialAttribute?: string;
	/**
	 * SPU代码
	 */
	spuCode?: string;
}

/**
 * com.merach.qianyi.product.api.dto.ProductSkuMaterialDTO
 *
 * ProductSkuMaterialDTO
 */
export interface ProductSkuMaterialDTO {
	/**
	 * 关联产品
	 */
	materialCode?: string;
	/**
	 * 辅料数量
	 */
	materialQty?: number;
	/**
	 * 备注
	 */
	remark?: string;
	/**
	 * SKU代码
	 */
	skuCode?: string;
	[property: string]: any;
}

/**
 * com.merach.qianyi.product.api.dto.ProductSkuQcDTO
 *
 * ProductSkuQcDTO
 */
export interface ProductSkuQcDTO {
	/**
	 * 质检内容
	 */
	qcContent?: string;
	/**
	 * 质检项
	 */
	qcItem?: string;
	/**
	 * SKU代码
	 */
	skuCode?: string;
	[property: string]: any;
}

/**
 * MapObject
 */
export interface MapObject {
	key?: { [key: string]: any };
	[property: string]: any;
}

/**
 * SKU箱规信息
 *
 * ProductSkuCarton
 */
export interface ProductSkuCarton {
	/**
	 * 单箱毛重
	 */
	cartonGrossWeight?: number;
	/**
	 * 单箱毛重单位
	 */
	cartonGrossWeightUnit?: string;
	/**
	 * 单箱净重
	 */
	cartonNetWeight?: number;
	/**
	 * 单箱净重单位
	 */
	cartonNetWeightUnit?: string;
	/**
	 * 单箱数量
	 */
	cartonQty?: number;
	/**
	 * 单柜装箱数
	 */
	containerCartonQty?: number;
	createId?: number;
	createName?: string;
	createTime?: string;
	delFlag?: number;
	/**
	 * SKU箱规 ID
	 */
	id?: number;
	/**
	 * 外箱规格高
	 */
	outCartonSpecHeight?: number;
	/**
	 * 外箱规格长
	 */
	outCartonSpecLength?: number;
	/**
	 * 外箱规格单位
	 */
	outCartonSpecUnit?: string;
	/**
	 * 外箱规格宽
	 */
	outCartonSpecWidth?: number;
	/**
	 * 箱规编码
	 */
	skuCartonCode?: string;
	/**
	 * SKU代码
	 */
	skuCode?: string;
	updateId?: number;
	updateName?: string;
	updateTime?: string;
	[property: string]: any;
}
