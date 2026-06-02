<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-09 11:09:20
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-02 17:58:12
 * @FilePath: \qianyi-ui\src\views\product\product-info\sku\components\all-edit-sku\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { ref } from 'vue';

import { useI18n } from 'vue-i18n';
import { initFn, submitFn } from './utils/index';
const { t } = useI18n();
const emit = defineEmits(['getDataList']);
const ModelList = defineAsyncComponent(
	() =>
		import(
			'/@/views/product/product-info/sku/components/all-edit-sku/components/model-list/index.vue'
		)
);
//// 基础信息
// 类目
const CategoryCode = defineAsyncComponent(
	() =>
		import(
			'/@/views/product/product-info/sku/components/all-edit-sku/components/model-info/base-info/categoryCode.vue'
		)
);
// 品牌
const BrandCode = defineAsyncComponent(
	() =>
		import(
			'/@/views/product/product-info/sku/components/all-edit-sku/components/model-info/base-info/brandCode.vue'
		)
);
// 产品类型
const ProductType = defineAsyncComponent(
	() =>
		import(
			'/@/views/product/product-info/sku/components/all-edit-sku/components/model-info/base-info/productType.vue'
		)
);
// 产品等级
const Grade = defineAsyncComponent(
	() =>
		import(
			'/@/views/product/product-info/sku/components/all-edit-sku/components/model-info/base-info/grade.vue'
		)
);
// 颜色
const Color = defineAsyncComponent(
	() =>
		import(
			'/@/views/product/product-info/sku/components/all-edit-sku/components/model-info/base-info/color.vue'
		)
);
// SPU
const Spu = defineAsyncComponent(
	() =>
		import(
			'/@/views/product/product-info/sku/components/all-edit-sku/components/model-info/base-info/spu.vue'
		)
);
// 销售国家
const CountryCodes = defineAsyncComponent(
	() =>
		import(
			'/@/views/product/product-info/sku/components/all-edit-sku/components/model-info/base-info/countryCodes.vue'
		)
);
// 销售渠道
const PlatformChannelCodes = defineAsyncComponent(
	() =>
		import(
			'/@/views/product/product-info/sku/components/all-edit-sku/components/model-info/base-info/platformChannelCodes.vue'
		)
);
// 产品负责人
const ProductManageId = defineAsyncComponent(
	() =>
		import(
			'/@/views/product/product-info/sku/components/all-edit-sku/components/model-info/base-info/productManageId.vue'
		)
);
// 运营组
const OperationGroups = defineAsyncComponent(
	() =>
		import(
			'/@/views/product/product-info/sku/components/all-edit-sku/components/model-info/base-info/operationGroups.vue'
		)
);
// 特殊属性
const SpecialAttribute = defineAsyncComponent(
	() =>
		import(
			'/@/views/product/product-info/sku/components/all-edit-sku/components/model-info/base-info/specialAttribute.vue'
		)
);
// 产品描述
const ProductDesc = defineAsyncComponent(
	() =>
		import(
			'/@/views/product/product-info/sku/components/all-edit-sku/components/model-info/base-info/productDesc.vue'
		)
);
//// 采购信息
// 采购负责人
const PurchaseManageId = defineAsyncComponent(
	() =>
		import(
			'/@/views/product/product-info/sku/components/all-edit-sku/components/model-info/purchase-info/productManageId.vue'
		)
);
// 采购交期
const PurchaseLeadTimeUnit = defineAsyncComponent(
	() =>
		import(
			'/@/views/product/product-info/sku/components/all-edit-sku/components/model-info/purchase-info/purchaseLeadTimeUnit.vue'
		)
);
// 参考成本
const ReferenceCost = defineAsyncComponent(
	() =>
		import(
			'/@/views/product/product-info/sku/components/all-edit-sku/components/model-info/purchase-info/referenceCost.vue'
		)
);
// 单品规格
const ItemSpec = defineAsyncComponent(
	() =>
		import(
			'/@/views/product/product-info/sku/components/all-edit-sku/components/model-info/purchase-info/itemSpec.vue'
		)
);
// 包装规格
const PackSpec = defineAsyncComponent(
	() =>
		import(
			'/@/views/product/product-info/sku/components/all-edit-sku/components/model-info/purchase-info/packSpec.vue'
		)
);
// 单品净重
const ItemNet = defineAsyncComponent(
	() =>
		import(
			'/@/views/product/product-info/sku/components/all-edit-sku/components/model-info/purchase-info/itemNet.vue'
		)
);
// 单品毛重
const ItemGross = defineAsyncComponent(
	() =>
		import(
			'/@/views/product/product-info/sku/components/all-edit-sku/components/model-info/purchase-info/itemGross.vue'
		)
);
// 采购备注
const PurchaseRemark = defineAsyncComponent(
	() =>
		import(
			'/@/views/product/product-info/sku/components/all-edit-sku/components/model-info/purchase-info/purchaseRemark.vue'
		)
);
//// 箱规信息
// 箱规信息
const CartonInfo = defineAsyncComponent(
	() =>
		import(
			'/@/views/product/product-info/sku/components/all-edit-sku/components/model-info/carton-info/cartonInfo.vue'
		)
);
//// 质检信息
// 质检信息
const QcInfo = defineAsyncComponent(
	() =>
		import(
			'/@/views/product/product-info/sku/components/all-edit-sku/components/model-info/qc-info/qcInfo.vue'
		)
);
//// 关联产品
// 关联产品
const MaterialInfo = defineAsyncComponent(
	() =>
		import(
			'/@/views/product/product-info/sku/components/all-edit-sku/components/model-info/material-info/materialInfo.vue'
		)
);

//// 基础信息
// 类目
const categoryCodeRef = ref<any>();
// 品牌
const brandCodeRef = ref<any>();
// 产品类型
const productTypeRef = ref<any>();
// 产品等级
const gradeRef = ref<any>();
// 颜色
const colorRef = ref<any>();
// SPU
const spuRef = ref<any>();
// 销售国家
const countryCodesRef = ref<any>();
// 销售渠道
const platformChannelCodesRef = ref<any>();
// 产品负责人
const productManageIdRef = ref<any>();
// 运营组
const operationGroupsRef = ref<any>();
// 特殊属性
const specialAttributeRef = ref<any>();
// 产品描述
const productDescRef = ref<any>();

//// 采购信息
// 采购信息
const purchaseManageIdRef = ref<any>();
// 采购交期
const purchaseLeadTimeUnitRef = ref<any>();
// 参考成本
const referenceCostRef = ref<any>();
// 单品规格
const itemSpecRef = ref<any>();
// 包装规格
const packSpecRef = ref<any>();
// 单品净重
const itemNetRef = ref<any>();
// 单品毛重
const itemGrossRef = ref<any>();
// 采购备注
const purchaseRemarkRef = ref<any>();

//// 箱规信息
// 箱规信息
const cartonInfoRef = ref<any>();
//  list 组件ref
const modelListRef = ref<any>(null);

//// 质检信息
// 质检信息
const qcInfoRef = ref<any>();

//// 关联产品
// 关联产品
const materialInfoRef = ref<any>();

//// 基础信息

// 弹窗ref
const dialogRef = ref<any | null>(null);
// 弹窗显示与否
const dialogVisible = ref(false);
// 当前选中的多选框
const currentCheckList = ref<string[]>([]);
// 筛选项分组
const optionsGroups = ref([
	{
		title: '基础信息',
		options: [
			{
				label: '类目',
				value: 'categoryCode',
				isShow: true, // 是否显示
			},
			{
				label: '品牌',
				value: 'brandCode',
				isShow: true, // 是否显示
			},
			{
				label: '产品类型',
				value: 'productType',
				isShow: true, // 是否显示
			},
			{
				label: '产品等级',
				value: 'grade',
				isShow: true, // 是否显示
			},
			{
				label: '颜色',
				value: 'color',
				isShow: true, // 是否显示
			},
			{
				label: 'spu',
				value: 'spuCode',
				isShow: true, // 是否显示
			},
			{
				label: '销售国家',
				value: 'countryCodes',
				isShow: true, // 是否显示
			},
			{
				label: '销售渠道',
				value: 'platformChannelCodes',
				isShow: true, // 是否显示
			},
			{
				label: '产品负责人',
				value: 'productManageId',
				isShow: true, // 是否显示
			},
			{
				label: '运营组',
				value: 'operationGroups',
				isShow: true, // 是否显示
			},
			{
				label: '特殊属性',
				value: 'specialAttribute',
				isShow: true, // 是否显示
			},
			{
				label: '产品描述',
				value: 'productDesc',
				isShow: true, // 是否显示
			},
		],
	},
	{
		title: '采购信息',
		options: [
			{
				label: '采购负责人',
				value: 'purchaseManageId',
				isShow: true, // 是否显示
			},
			{
				label: '采购交期',
				value: 'purchaseLeadTimeUnit',
				isShow: true, // 是否显示
			},
			{
				label: '参考成本',
				value: 'referenceCost',
				isShow: true, // 是否显示
			},
			{
				label: '单品规格',
				value: 'itemSpec',
				isShow: true, // 是否显示
			},
			{
				label: '包装规格',
				value: 'packSpec',
				isShow: true, // 是否显示
			},
			{
				label: '单品净重',
				value: 'itemNet',
				isShow: true, // 是否显示
			},
			{
				label: '单品毛重',
				value: 'itemGross',
				isShow: true, // 是否显示
			},
			{
				label: '采购备注',
				value: 'purchaseRemark',
				isShow: true, // 是否显示
			},
		],
	},
	{
		title: '箱规信息',
		options: [
			{
				label: '箱规信息',
				value: 'cartonInfo',
				isShow: true, // 是否显示
			},
		],
	},
	{
		title: '质检信息',
		options: [
			{
				label: '质检信息',
				value: 'qcInfo',
				isShow: true, // 是否显示
			},
		],
	},
	{
		title: '关联产品/配件',
		options: [
			{
				label: '关联产品/配件',
				value: 'materialInfo',
				isShow: true, // 是否显示
			},
		],
	},
]);

// 采购系统的单位系统 1是公制 2是英制
const purchaseInfoUnitSystem = ref('1');
// 箱规系统的单位系统
const cartonInfoUnitSystem = ref('1');
// 要修改的sku列表的数据
const skuList = ref<any[]>([]);

/**
 * 初始化
 */
const init = () => {
	// 初始化modelListRef数据
	initFn(
		{ skuList: skuList.value },
		{
			modelListRef, // list 组件ref
			categoryCodeRef, // 类目ref
			brandCodeRef, // 品牌ref
			productTypeRef, // 产品类型ref
			gradeRef, // 产品等级ref
			colorRef, // 颜色ref
			spuRef, // SPUref
			countryCodesRef, // 销售国家ref
			platformChannelCodesRef, // 销售渠道ref
			productManageIdRef, // 产品负责人ref
			operationGroupsRef, // 运营组ref
			specialAttributeRef, // 特殊属性ref
			productDescRef, // 产品描述ref
			purchaseManageIdRef, // 采购负责人ref
			purchaseLeadTimeUnitRef, // 采购交期ref
			referenceCostRef, // 参考成本ref
			itemSpecRef, // 单品规格ref
			packSpecRef, // 包装规格ref
			itemNetRef, // 单品净重ref
			itemGrossRef, // 单品毛重ref
			purchaseRemarkRef, // 采购备注ref
			cartonInfoRef, // 箱规信息ref
			qcInfoRef, // 质检信息ref
			materialInfoRef, // 关联产品ref
		},
		optionsGroups
	);
	// 重置单位系统
	purchaseInfoUnitSystem.value = '1';
	cartonInfoUnitSystem.value = '1';
};

// 设置选中值
const setCheckList = (val: string[]) => {
	currentCheckList.value = val;
};

/**
 * 确定
 */
const onSubmit = async () => {
	await submitFn(
		{
			modelListRef, // list 组件ref
			categoryCodeRef, // 类目ref
			brandCodeRef, // 品牌ref
			productTypeRef, // 产品类型ref
			gradeRef, // 产品等级ref
			colorRef, // 颜色ref
			spuRef, // SPUref
			countryCodesRef, // 销售国家ref
			platformChannelCodesRef, // 销售渠道ref
			productManageIdRef, // 产品负责人ref
			operationGroupsRef, // 运营组ref
			specialAttributeRef, // 特殊属性ref
			productDescRef, // 产品描述ref
			purchaseManageIdRef, // 采购负责人ref
			purchaseLeadTimeUnitRef, // 采购交期ref
			referenceCostRef, // 参考成本ref
			itemSpecRef, // 单品规格ref
			packSpecRef, // 包装规格ref
			itemNetRef, // 单品净重ref
			itemGrossRef, // 单品毛重ref
			purchaseRemarkRef, // 采购备注ref
			cartonInfoRef, // 箱规信息ref
			qcInfoRef, // 质检信息ref
			materialInfoRef, // 关联产品ref
		},
		hide,
		currentCheckList.value,
		skuList.value,
		{
			purchaseInfoUnitSystem: purchaseInfoUnitSystem.value,
			cartonInfoUnitSystem: cartonInfoUnitSystem.value,
		}
	);
	// 刷新父组件数据
	emit('getDataList');
};
/**
 * 打开弹窗方法
 * 供父组件调用
 */
const show = (data: any[]) => {
	dialogVisible.value = true;
	skuList.value = data;
};

/**
 * 关闭弹窗方法
 * 供父组件调用
 */
const hide = () => {
	dialogVisible.value = false;
};

// 暴露方法给父组件
defineExpose({
	show,
	hide,
});
</script>

<template>
	<el-dialog
		draggable
		ref="dialogRef"
		v-model="dialogVisible"
		:width="'90%'"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:append-to-body="true"
		@open="init"
		@close="hide"
	>
		<template #title>
			<div class="rule-title">
				<span>{{ t('批量编辑产品信息') }}</span>
			</div>
		</template>
		<div class="rule-model">
			<el-row class="rule-content" :gutter="20">
				<el-col :span="5" class="rule-list">
					<ModelList
						ref="modelListRef"
						@setCheckList="setCheckList"
						:option-groups="optionsGroups"
						:skuList="skuList"
					/>
				</el-col>
				<el-col :span="19" class="rule-info">
					<div class="section-title">
						<span class="section-bar"></span>
						<span class="mr-2"> 基础信息</span>
					</div>
					<el-row v-show="currentCheckList?.includes('categoryCode')">
						<el-col :span="24">
							<!-- 类目 -->
							<CategoryCode ref="categoryCodeRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('brandCode')">
						<el-col :span="24">
							<!-- 品牌 -->
							<BrandCode ref="brandCodeRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('productType')">
						<el-col :span="24">
							<!-- 产品类型 -->
							<ProductType ref="productTypeRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('grade')">
						<el-col :span="24">
							<!-- 产品等级 -->
							<Grade ref="gradeRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('color')">
						<el-col :span="24">
							<!-- 颜色 -->
							<Color ref="colorRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('spuCode')">
						<el-col :span="24">
							<!-- SPU -->
							<Spu ref="spuRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('countryCodes')">
						<el-col :span="24">
							<!-- 销售国家 -->
							<CountryCodes ref="countryCodesRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('platformChannelCodes')">
						<el-col :span="24">
							<!-- 销售渠道 -->
							<PlatformChannelCodes ref="platformChannelCodesRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('productManageId')">
						<el-col :span="24">
							<!-- 产品负责人 -->
							<ProductManageId ref="productManageIdRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('operationGroups')">
						<el-col :span="24">
							<!-- 运营组 -->
							<OperationGroups ref="operationGroupsRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('specialAttribute')">
						<el-col :span="24">
							<!-- 特殊属性 -->
							<SpecialAttribute ref="specialAttributeRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('productDesc')">
						<el-col :span="24">
							<!-- 产品描述 -->
							<ProductDesc ref="productDescRef" />
						</el-col>
					</el-row>
					<div class="section-title">
						<span class="section-bar"></span>
						<span class="mr-2"> 采购信息</span>
						<el-radio-group
							v-model="purchaseInfoUnitSystem"
							v-show="
								currentCheckList?.includes('itemSpec') ||
								currentCheckList?.includes('packSpec') ||
								currentCheckList?.includes('itemNet') ||
								currentCheckList?.includes('itemGross')
							"
						>
							<el-radio-button value="1" size="small" border
								>公制</el-radio-button
							>
							<el-radio-button value="2" size="small" border
								>英制</el-radio-button
							>
						</el-radio-group>
					</div>
					<el-row v-show="currentCheckList?.includes('purchaseManageId')">
						<el-col :span="24">
							<!-- 采购负责人 -->
							<PurchaseManageId ref="purchaseManageIdRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('purchaseLeadTimeUnit')">
						<el-col :span="24">
							<!-- 采购交期 -->
							<PurchaseLeadTimeUnit ref="purchaseLeadTimeUnitRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('referenceCost')">
						<el-col :span="24">
							<!-- 参考成本 -->
							<ReferenceCost ref="referenceCostRef" />
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('itemSpec')">
						<el-col :span="24">
							<!-- 单品规格 -->
							<ItemSpec
								ref="itemSpecRef"
								:purchaseInfoUnitSystem="purchaseInfoUnitSystem"
							/>
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('packSpec')">
						<el-col :span="24">
							<!-- 包装规格 -->
							<PackSpec
								ref="packSpecRef"
								:purchaseInfoUnitSystem="purchaseInfoUnitSystem"
							/>
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('itemNet')">
						<el-col :span="24">
							<!-- 单品净重 -->
							<ItemNet
								ref="itemNetRef"
								:purchaseInfoUnitSystem="purchaseInfoUnitSystem"
							/>
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('itemGross')">
						<el-col :span="24">
							<!-- 单品毛重 -->
							<ItemGross
								ref="itemGrossRef"
								:purchaseInfoUnitSystem="purchaseInfoUnitSystem"
							/>
						</el-col>
					</el-row>
					<el-row v-show="currentCheckList?.includes('purchaseRemark')">
						<el-col :span="24">
							<!-- 采购备注 -->
							<PurchaseRemark ref="purchaseRemarkRef" />
						</el-col>
					</el-row>
					<div class="section-title">
						<span class="section-bar"></span>
						<span class="mr-2"> 箱规信息</span>
						<el-radio-group
							v-model="cartonInfoUnitSystem"
							v-show="currentCheckList?.includes('cartonInfo')"
						>
							<el-radio-button value="1" size="small" border
								>公制</el-radio-button
							>
							<el-radio-button value="2" size="small" border
								>英制</el-radio-button
							>
						</el-radio-group>
					</div>
					<el-row v-show="currentCheckList?.includes('cartonInfo')">
						<el-col :span="24">
							<!-- 箱规信息 -->
							<CartonInfo
								ref="cartonInfoRef"
								:cartonInfoUnitSystem="cartonInfoUnitSystem"
							/>
						</el-col>
					</el-row>
					<div class="section-title">
						<span class="section-bar"></span>
						<span class="mr-2"> 质检信息 </span>
					</div>
					<el-row v-show="currentCheckList?.includes('qcInfo')">
						<el-col :span="24">
							<!-- 质检信息 -->
							<QcInfo ref="qcInfoRef" />
						</el-col>
					</el-row>
					<div class="section-title">
						<span class="section-bar"></span>
						<span class="mr-2"> 关联产品/配件</span>
					</div>
					<el-row v-show="currentCheckList?.includes('materialInfo')">
						<el-col :span="24">
							<!-- 关联产品/配件 -->
							<MaterialInfo
								ref="materialInfoRef"
								:optionsGroups="optionsGroups"
							/>
						</el-col>
					</el-row>
				</el-col>
			</el-row>
		</div>

		<template #footer>
			<div style="text-align: right">
				<el-button @click="hide">{{ t('取消') }}</el-button>
				<el-button type="primary" @click="onSubmit">{{ t('确定') }}</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<style scoped lang="scss">
.rule-model {
	height: 100%;
	.rule-title {
		margin-bottom: 20px;
		border-bottom: 1px solid #f0f0f0;
	}
	.rule-content {
		height: 100%;
		.rule-list {
			height: 100%;
			padding-right: 10px;
		}
		.rule-info {
			padding-left: 10px;
			height: 600px;
			overflow: auto;
		}
	}
	.section-title {
		font-weight: bold;
		margin: 10px 0 10px 0;
		display: flex;
		align-items: center;
	}
	.section-bar {
		display: inline-block;
		width: 4px;
		height: 18px;
		background: #2e5cf6;
		border-radius: 2px;
		margin-right: 8px;
	}
}
</style>
