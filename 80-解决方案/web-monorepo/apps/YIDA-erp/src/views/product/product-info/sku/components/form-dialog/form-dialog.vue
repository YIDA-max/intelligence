<template>
	<el-dialog
		v-bind="$attrs"
		width="80%"
		:close-on-click-modal="false"
		draggable
		@open="init"
		:destroy-on-close="false"
		:title="props.title"
	>
		<div
			:style="{
				height: '70vh',
			}"
		>
			<el-row>
				<el-col :span="4">
					<div class="left-con">
						<div class="img-upload">
							<ImageUpload
								v-model:imageUrl="avatar"
								height="180px"
								width="180px"
								:disabled="true"
								:ishowRequired="true"
							></ImageUpload>
						</div>
						<div class="tab-list">
							<el-tabs
								tab-position="right"
								v-model="tabsValue"
								style="height: 200px"
							>
								<el-tab-pane label="基本信息" :name="0"></el-tab-pane>
								<el-tab-pane label="采购信息" :name="1"></el-tab-pane>
								<el-tab-pane label="箱规信息" :name="2"></el-tab-pane>
								<el-tab-pane label="关联产品/配件" :name="3"></el-tab-pane>
								<el-tab-pane label="关联MSKU" :name="4"></el-tab-pane>
								<el-tab-pane label="质检信息" :name="5"></el-tab-pane>
								<el-tab-pane label="图片信息" :name="6"></el-tab-pane>
								<el-tab-pane
									label="操作日志"
									:name="7"
									v-if="props.visibleType === 'view'"
								></el-tab-pane>
							</el-tabs>
						</div>
					</div>
				</el-col>
				<el-col :span="20">
					<BaseInfo
						ref="baseInfoRef"
						v-show="tabsValue === 0"
						:dictMap="dictMap"
						:visibleType="props.visibleType"
						:currentRow="props.currentRow"
						:changeProductType="changeProductType"
					></BaseInfo>
					<PurchaseInfo
						ref="purchaseInfoRef"
						v-show="tabsValue === 1"
						:dictMap="dictMap"
						:visibleType="props.visibleType"
					></PurchaseInfo>
					<SingleCartonInfo
						ref="singleCartonInfoRef"
						v-show="tabsValue === 2"
						:dictMap="dictMap"
						:visibleType="props.visibleType"
						:skuCode="baseInfoRef?.localFormData?.skuCode || ''"
						:purchaseRef="purchaseInfoRef"
					></SingleCartonInfo>
					<AssociateProduct
						ref="associateProductRef"
						v-show="tabsValue === 3"
						:dictMap="dictMap"
						:visibleType="props.visibleType"
						:baseInfoRef="baseInfoRef"
						:tabsValue="tabsValue"
					></AssociateProduct>
					<AssociateMsku
						ref="associateMskuRef"
						v-show="tabsValue === 4"
						:dictMap="dictMap"
						:visibleType="props.visibleType"
					></AssociateMsku>
					<QcsInfo
						ref="qcsInfoRef"
						v-show="tabsValue === 5"
						:dictMap="dictMap"
						:visibleType="props.visibleType"
					></QcsInfo>
					<ImgsInfo
						ref="imgsInfoRef"
						v-show="tabsValue === 6"
						:dictMap="dictMap"
						:setImgUrl="setImgUrl"
						:visibleType="props.visibleType"
					></ImgsInfo>
					<LogInfo
						ref="logInfoRef"
						v-show="tabsValue === 7"
						:dictMap="dictMap"
						:visibleType="props.visibleType"
						:currentRow="props.currentRow"
					></LogInfo>
				</el-col>
			</el-row>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="closeDialog">{{
					$t('common.cancelButtonText')
				}}</el-button>
				<template v-if="props.visibleType === 'add'">
					<el-button type="primary" @click="onSubmit" :disabled="loading">{{
						$t('添加')
					}}</el-button>
				</template>
				<template v-if="props.visibleType === 'copy'">
					<el-button type="primary" @click="onSubmit" :disabled="loading">{{
						$t('保存')
					}}</el-button>
				</template>
				<template v-if="props.visibleType === 'edit'">
					<el-button type="primary" @click="onSubmit" :disabled="loading">
						{{ $t('保存') }}
					</el-button>
				</template>
				<template v-if="props.visibleType === 'view'">
					<el-button @click="changeCopy" :disabled="loading">{{
						$t('复制')
					}}</el-button>
					<el-button type="primary" @click="changeEdit" :disabled="loading">
						{{ $t('编辑') }}
					</el-button>
				</template>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { useMessage } from '/@/hooks/message';
import { defineAsyncComponent, ref, onMounted } from 'vue';
import { addSkuSave, editSkuUpdate } from '/@/api/product/sku';
import { addInit, editInit, copyInit } from './utils/sku-form-dialog';

const ImageUpload = defineAsyncComponent(
	() => import('/@/components/Upload/Image.vue')
);
const BaseInfo = defineAsyncComponent(
	() => import('./components/base-info.vue')
);
const PurchaseInfo = defineAsyncComponent(
	() => import('./components/purchase-info.vue')
);
const SingleCartonInfo = defineAsyncComponent(
	() => import('./components/single-carton-info.vue')
);
const AssociateProduct = defineAsyncComponent(
	() => import('./components/associate-product.vue')
);
const AssociateMsku = defineAsyncComponent(
	() => import('./components/associate-msku.vue')
);
const QcsInfo = defineAsyncComponent(() => import('./components/qcs-info.vue'));
const ImgsInfo = defineAsyncComponent(
	() => import('./components/imgs-info.vue')
);
const LogInfo = defineAsyncComponent(() => import('./components/log-info.vue'));

const emit = defineEmits([
	'refresh',
	'closeDialog',
	'changeCopy',
	'changeEdit',
]);
const props = defineProps({
	currentRow: {
		type: Object,
		default: () => ({}),
	},
	visibleType: {
		type: String,
		default: '',
	},
	title: {
		type: String,
		default: '',
	},
	dictMap: {
		type: Object,
		default: () => ({}),
	},
});

// onMounted
onMounted(async () => {});

const loading = ref(false);
const tabsValue = ref(0);
const avatar = ref(''); // 默认头像
const baseInfoRef = ref();
const purchaseInfoRef = ref();
const singleCartonInfoRef = ref();
const associateProductRef = ref();
const associateMskuRef = ref();
const qcsInfoRef = ref();
const imgsInfoRef = ref();
const logInfoRef = ref();

// 切换产品类型
const changeProductType = () => {
	// 直接清空选择产品的数据
	associateProductRef.value.setData([]); // 清空选择产品数据
};

// 欧盟与英国两字码（含 GB、UK）
// const EU_2C = new Set([
// 	'AT',
// 	'BE',
// 	'BG',
// 	'HR',
// 	'CY',
// 	'CZ',
// 	'DK',
// 	'EE',
// 	'FI',
// 	'FR',
// 	'DE',
// 	'GR',
// 	'HU',
// 	'IE',
// 	'IT',
// 	'LV',
// 	'LT',
// 	'LU',
// 	'MT',
// 	'NL',
// 	'PL',
// 	'PT',
// 	'RO',
// 	'SK',
// 	'SI',
// 	'ES',
// 	'SE',
// 	'GB',
// 	'UK',
// ]);

// 提交
const onSubmit = async () => {
	// 开启加载状态
	loading.value = true;
	// // 验证基本信息
	try {
		await baseInfoRef.value.dataFormRef.validate();
	} catch (error) {
		tabsValue.value = 0;
		return;
	} finally {
		loading.value = false;
	}
	// 验证采购信息
	try {
		await purchaseInfoRef.value.dataFormRef.validate();
	} catch (error) {
		tabsValue.value = 1;
		return;
	} finally {
		loading.value = false;
	}
	// 验证单箱信息
	try {
		const isValid = await singleCartonInfoRef.value.validateAll();
		if (!isValid) {
			tabsValue.value = 2;
			return;
		}
	} catch (error) {
		tabsValue.value = 2;
		return;
	} finally {
		loading.value = false;
	}
	//  验证关联产品
	try {
		const associateProductDataList = associateProductRef.value.getDataList();
		//    首先如果辅料的table有值，那么他的数量就是必填
		for (const row of associateProductDataList) {
			if (
				row.materialQty === null ||
				row.materialQty === undefined ||
				row.materialQty === ''
			) {
				if (row.materialCode)
					useMessage().error(
						`产品 ${row.materialCode} - ${row.materialName} 的数量不能为空`
					);
				if (row.skuCode)
					useMessage().error(
						`产品 ${row.skuCode} - ${row.skuName} 的数量不能为空`
					);
				tabsValue.value = 3;
				return; // 只要一个不合法就退出
			}
		}
	} catch (error) {
		tabsValue.value = 3;
		return;
	} finally {
		loading.value = false;
	}
	//  验证MSKU
	try {
		const tabsAndTable = associateMskuRef.value.tabsAndTable;
		for (let i = 0; i < tabsAndTable.length; i++) {
			const group = tabsAndTable[i];
			const items = group.tableData || [];
			for (let j = 0; j < items.length; j++) {
				const row = items[j];
				if (!row.mskuCode || row.mskuCode.trim() === '') {
					useMessage().error(`${group.label}的第 ${j + 1} 项缺少 MSKU`);
					tabsValue.value = 4;
					return false;
				}

				// 判断是否是亚马逊，亚马逊的asin字段必填
				if (
					group.label === 'Amazon' &&
					(!row.asin || String(row.asin).trim() === '')
				) {
					useMessage().error(`${group.label}的第 ${j + 1} 项ASIN必填`);
					return false;
				}

				// 运营必填
				if (!row.operationUserId || String(row.operationUserId).trim() === '') {
					useMessage().error(`${group.label}的第 ${j + 1} 项运营必填`);
					return false;
				}

				// 店铺/站点必填
				if (!row.storeId) {
					useMessage().error(`${group.label}的第 ${j + 1} 项店铺/站点不能为空`);
					tabsValue.value = 4;
					return false;
				}
				// 国家二字码必填 只有当前选中的国家才校验必填
				if (
					associateMskuRef.value.tabsValue === group.value &&
					(!row.countryCode || row.countryCode.length === 0)
				) {
					useMessage().error(
						`${group.label}的第 ${j + 1} 项国家二字码不能为空`
					);
					return false;
				}

				// 国家不能是eu或gc （硬编码，不用在意，防止历史回显或粘贴带入）
				if (row.countryCode.includes('EU') || row.countryCode.includes('GC')) {
					useMessage().error(`${group.label}的第 ${j + 1} 项国家不能是EU或GC`);
					return false;
				}

				const isValidPositiveNumber = (val: any) => {
					const n = Number(val);
					return Number.isFinite(n) && n > 0;
				};
				// 当平台=amazon,店铺是欧洲店铺时,销售价、销售链接、竞品链接、定价截图这四个必填先去掉 以后可能会加回来 ！！！
				// 通过 storeId 映射到站点二字码
				// const shop = (props.dictMap?.shopOption || []).find(
				// 	(s: any) => s.id === row.storeId
				// );
				// const code = String(shop?.siteCode || '').toUpperCase();
				// 公共：销售价校验函数（> 0 的数字）
				// if (group.label === 'Amazon' && EU_2C.has(code)) {
				// 	if (
				// 		!row.salePrice ||
				// 		String(row.salePrice).trim() === '' ||
				// 		!isValidPositiveNumber(row.salePrice)
				// 	) {
				// 		useMessage().error(
				// 			`${group.label}的第 ${j + 1} 项销售价必填且需为大于0的数字`
				// 		);
				// 		return false;
				// 	}
				// 	if (!row.saleUrl || String(row.saleUrl).trim() === '') {
				// 		useMessage().error(`${group.label}的第 ${j + 1} 项销售链接必填`);
				// 		return false;
				// 	}
				// 	if (!row.competitorUrl || String(row.competitorUrl).trim() === '') {
				// 		useMessage().error(`${group.label}的第 ${j + 1} 项竞品链接必填`);
				// 		return false;
				// 	}
				// 	if (!row.imgUrl || String(row.imgUrl).trim() === '') {
				// 		useMessage().error(`${group.label}的第 ${j + 1} 项定价截图必填`);
				// 		return false;
				// 	}
				// } else {
				// 	// 非欧盟/英国站点：若填写了销售价，也需满足>0数字
				// 	if (
				// 		String(row.salePrice || '').trim() !== '' &&
				// 		!isValidPositiveNumber(row.salePrice)
				// 	) {
				// 		useMessage().error(
				// 			`${group.label}的第 ${j + 1} 项销售价需为大于0的数字`
				// 		);
				// 		return false;
				// 	}
				// }
				// 非欧盟/英国站点：若填写了销售价，也需满足>0数字
				if (
					String(row.salePrice || '').trim() !== '' &&
					!isValidPositiveNumber(row.salePrice)
				) {
					useMessage().error(
						`${group.label}的第 ${j + 1} 项销售价需为大于0的数字`
					);
					return false;
				}
			}
		}
	} catch (error) {
		tabsValue.value = 4;
		return;
	} finally {
		loading.value = false;
	}

	// 验证图片信息
	try {
		if (imgsInfoRef.value.avatarList.length === 0) {
			useMessage().error('请上传图片');
			tabsValue.value = 6;
			return;
		}
	} catch (error) {
		tabsValue.value = 6;
	} finally {
		loading.value = false;
	}
	// 基本信息
	const baseInfoParams = {
		// sky
		skuCode: baseInfoRef.value.localFormData.skuCode,
		// 产品名称
		skuName: baseInfoRef.value.localFormData.skuName,
		// 类目
		categoryCode: baseInfoRef.value.localFormData.categoryCode,
		// 品牌
		brandCode: baseInfoRef.value.localFormData.brandCode,
		// 产品类型
		productType: baseInfoRef.value.localFormData.productType,
		// 产品等级
		grade: baseInfoRef.value.localFormData.grade,
		// 颜色
		color: baseInfoRef.value.localFormData.color,
		// 型号
		model: baseInfoRef.value.localFormData.model,
		// 销售地区
		// saleArea: baseInfoRef.value.localFormData.saleArea,
		// 销售国家
		productSkuCountryList: baseInfoRef.value.localFormData.productSkuCountryList
			.length
			? baseInfoRef.value.localFormData.productSkuCountryList.map(
					(item: any) => {
						return {
							countryCode: item,
						};
					}
			  )
			: [],

		// 产品sku-spu关联
		productSpuSkuDTO: {
			spuCode: baseInfoRef.value.localFormData.spuCode,
			skuCode: baseInfoRef.value.localFormData.skuCode,
		},

		// 平台,需要转换
		platforms: baseInfoRef.value.localFormData.platform.length
			? baseInfoRef.value.localFormData?.platform?.map((item: any) => {
					return {
						skuCode: +baseInfoRef.value.localFormData.skuCode,
						platform: item,
					};
			  })
			: [],
		// 产品负责人
		productManageId: baseInfoRef.value.localFormData.productManageId
			? baseInfoRef.value.localFormData.productManageId
			: 1,
		// 运营组,需要转换
		skuDepts: baseInfoRef.value.localFormData.skuDepts.map((item: any) => {
			return {
				skuCode: baseInfoRef.value.localFormData.skuCode,
				deptId: item,
			};
		}),
		// 特殊属性,用逗号关联
		specialAttribute:
			baseInfoRef.value.localFormData?.specialAttribute?.join(','),
		// 特殊说明
		attributeDesc: baseInfoRef.value.localFormData.attributeDesc,
		// 产品描述
		productDesc: baseInfoRef.value.localFormData.productDesc,
		// 附件文件名
		attachmentFileName: baseInfoRef.value.localFormData.attachmentFileName?.map(
			(item: string) =>
				typeof item === 'string' && item.includes('fileName=')
					? item.split('fileName=')[1]
					: item
		),
	};
	// 采购信息
	const purchaseInfoParams = {
		// 采购信息公英制
		puchaseUnitType: purchaseInfoRef.value.puchaseUnitType,
		// 采购负责人
		purchaseManageId: purchaseInfoRef.value.localFormData.purchaseManageId,
		// 采购交期
		purchaseLeadTime: purchaseInfoRef.value.localFormData.purchaseLeadTime,
		// 采购交期单位
		purchaseLeadTimeUnit:
			purchaseInfoRef.value.localFormData.purchaseLeadTimeUnit,
		// 参考成本
		referenceCost: purchaseInfoRef.value.localFormData.referenceCost,
		// 参考成本单位
		referenceCostUnit: purchaseInfoRef.value.localFormData.referenceCostUnit,
		// 单品规格 长宽高
		itemSpecLength: purchaseInfoRef.value.localFormData.itemSpecLength,
		itemSpecWidth: purchaseInfoRef.value.localFormData.itemSpecWidth,
		itemSpecHeight: purchaseInfoRef.value.localFormData.itemSpecHeight,
		// 单品规格单位
		itemSpecUnit: purchaseInfoRef.value.localFormData.itemSpecUnit,
		// 包装规格
		packSpecLength: purchaseInfoRef.value.localFormData.packSpecLength,
		packSpecWidth: purchaseInfoRef.value.localFormData.packSpecWidth,
		packSpecHeight: purchaseInfoRef.value.localFormData.packSpecHeight,
		// 包装规格单位
		packSpecUnit: purchaseInfoRef.value.localFormData.packSpecUnit,
		// 单品净重
		itemNetWeight: purchaseInfoRef.value.localFormData.itemNetWeight,
		// 单品净重单位
		itemNetWeightUnit: purchaseInfoRef.value.localFormData.itemNetWeightUnit,
		// 包装毛重
		itemGrossWeight: purchaseInfoRef.value.localFormData.itemGrossWeight,
		// 包装毛重单位
		itemGrossWeightUnit:
			purchaseInfoRef.value.localFormData.itemGrossWeightUnit,
		// 采购备注
		purchaseRemark: purchaseInfoRef.value.localFormData.purchaseRemark,
	};
	// 箱规信息 - 使用新的数据结构
	const singleCartonFormData = singleCartonInfoRef.value.getFormData();
	const singleCartonInfoParams = {
		cartonUnitType: singleCartonFormData.cartonUnitType, // 添加单位类型
		skuCartons: singleCartonFormData.skuCartons.map((item: any) => ({
			skuCartonCode: item.skuCartonCode,
			outCartonSpecLength: item.outCartonSpecLength,
			outCartonSpecWidth: item.outCartonSpecWidth,
			outCartonSpecHeight: item.outCartonSpecHeight,
			outCartonSpecUnit: item.outCartonSpecUnit,
			cartonQty: item.cartonQty,
			// cartonQtyUnit: item.cartonQtyUnit,
			cartonGrossWeight: item.cartonGrossWeight,
			cartonGrossWeightUnit: item.cartonGrossWeightUnit,
			cartonNetWeight: item.cartonNetWeight,
			cartonNetWeightUnit: item.cartonNetWeightUnit,
			containerCartonQty: item.containerCartonQty,
			// containerCartonQtyUnit: item.containerCartonQtyUnit,
		})),
	};
	// 关联产品
	const associateProductDataList = associateProductRef.value.getDataList();
	const associateProductParams = {
		materials: associateProductDataList.map((item: any) => {
			return {
				skuCode: baseInfoRef.value.localFormData.skuCode,
				materialCode: item.materialCode,
				materialQty: item.materialQty,
				remark: item.remark,
			};
		}),
	};
	// 关联MSKU
	const mskusParams: {
		mskus: Array<{
			skuCode: string;
			mskuCode: string;
			platformChannelCode: string;
			storeId: string;
			saleUrl: string;
			countryCode: string;
			competitorUrl: string;
			imgFileName: string;
			salePrice: string;
			currency: string;
			asin: string;
			operationUserId: number;
			deptName: string;
			deptId: string;
		}>;
	} = {
		mskus: [],
	};
	for (const platformGroup of associateMskuRef.value.tabsAndTable) {
		// 遍历每个平台组
		const platform = platformGroup.value;
		const table = platformGroup.tableData || [];
		for (const row of table) {
			// 忽略空行时可以加校验，如 mskuCode 存在才推入
			mskusParams.mskus.push({
				skuCode: row.sku || '',
				mskuCode: row.mskuCode || '',
				platformChannelCode: platform || '',
				storeId: row.storeId || '',
				countryCode: row.countryCode.join(',') || '',
				saleUrl: row.saleUrl || '',
				competitorUrl: row.competitorUrl || '',
				imgFileName: row.imgUrl?.includes('fileName=')
					? row.imgUrl.split('fileName=')[1]
					: row.imgUrl || '',
				salePrice: row.salePrice,
				currency: row.salePrice ? row.currency : null, // 若无销售价则币种传null
				asin: row.asin,
				operationUserId: row.operationUserId,
				deptName: row.deptName,
				deptId: row.deptId,
			});
		}
	}
	// 质检信息
	const qcsInfoParams = {
		qcs: qcsInfoRef.value.tableData.map((item: any) => {
			return {
				skuCode: baseInfoRef.value.localFormData.skuCode,
				qcItem: item.qcItem,
				qcContent: item.qcContent,
			};
		}),
	};
	// 图片列表
	const imgsInfoParams = {
		skuImgs: imgsInfoRef.value.avatarList.map(
			(item: { url: string; fileName: string }, index: number) => {
				return {
					skuCode: baseInfoRef.value.localFormData.skuCode,
					imgFileName: item.fileName,
					mainFlag: index === 0 ? 1 : 0, // 第一张图片为主图
				};
			}
		),
	};
	try {
		// 区分新增和编辑
		if (props.visibleType === 'add') {
			// 新增SKU
			const res = await addSkuSave({
				...baseInfoParams,
				...purchaseInfoParams,
				...singleCartonInfoParams,
				...associateProductParams,
				...mskusParams,
				...qcsInfoParams,
				...imgsInfoParams,
				// 管理msku的时候把当前平台给过去，只校验当前平台，其他的平台不做校验。（后期考虑重构）
				operatePlatform: associateMskuRef.value.tabsValue,
			});
			if (res.code === 0) {
				useMessage().success('添加成功');

				emit('closeDialog'); // 关闭对话框
			}
		} else if (props.visibleType === 'edit') {
			// 编辑SKU
			const res = await editSkuUpdate({
				id: props.currentRow.id, // 传入ID
				...baseInfoParams,
				...purchaseInfoParams,
				...singleCartonInfoParams,
				...associateProductParams,
				...mskusParams,
				...qcsInfoParams,
				...imgsInfoParams,
				// 管理msku的时候把当前平台给过去，只校验当前平台，其他的平台不做校验。（后期考虑重构）
				operatePlatform: associateMskuRef.value.tabsValue,
			});
			if (res.code === 0) {
				useMessage().success('编辑成功');
				emit('closeDialog'); // 关闭对话框
			}
		} else if (props.visibleType === 'copy') {
			// 复制SKU
			const res = await addSkuSave({
				...baseInfoParams,
				...purchaseInfoParams,
				...singleCartonInfoParams,
				...associateProductParams,
				...mskusParams,
				...qcsInfoParams,
				...imgsInfoParams,
				// 管理msku的时候把当前平台给过去，只校验当前平台，其他的平台不做校验。（后期考虑重构）
				operatePlatform: associateMskuRef.value.tabsValue,
			});
			if (res.code === 0) {
				useMessage().success('复制成功');
				emit('closeDialog'); // 关闭对话框
			}
		}
	} catch (error: any) {
		useMessage().error(error ? error : '接口错误');
	}
};

const closeDialog = () => {
	emit('closeDialog');
};

/**
 * 初始化
 */
const init = async () => {
	try {
		loading.value = true;
		tabsValue.value = 0; // 默认选中第一个tab
		avatar.value = ''; // 清空头像
		// 如果是新增，就需要清空数据
		if (props.visibleType === 'add') {
			await addInit(
				baseInfoRef,
				purchaseInfoRef,
				singleCartonInfoRef,
				associateProductRef,
				associateMskuRef,
				qcsInfoRef,
				imgsInfoRef,
				props.dictMap,
				avatar,
				tabsValue
			);
		} else if (props.visibleType === 'edit') {
			// 如果是编辑，就需要加载数据
			await editInit(
				baseInfoRef,
				purchaseInfoRef,
				singleCartonInfoRef,
				associateProductRef,
				associateMskuRef,
				qcsInfoRef,
				imgsInfoRef,
				props.dictMap,
				props
			);
		} else if (props.visibleType === 'view') {
			// 如果是查看，就需要加载数据
			await editInit(
				baseInfoRef,
				purchaseInfoRef,
				singleCartonInfoRef,
				associateProductRef,
				associateMskuRef,
				qcsInfoRef,
				imgsInfoRef,
				props.dictMap,
				props
			);
		} else if (props.visibleType === 'spuView') {
			// 如果是查看，就需要加载数据
			await editInit(
				baseInfoRef,
				purchaseInfoRef,
				singleCartonInfoRef,
				associateProductRef,
				associateMskuRef,
				qcsInfoRef,
				imgsInfoRef,
				props.dictMap,
				props
			);
		} else if (props.visibleType === 'copy') {
			// 如果是复制，就需要加载数据
			await copyInit(
				baseInfoRef,
				purchaseInfoRef,
				singleCartonInfoRef,
				associateProductRef,
				associateMskuRef,
				qcsInfoRef,
				imgsInfoRef,
				props.dictMap,
				props
			);
		}
		// 初始化产品类型是否必填
		baseInfoRef.value?.initHandleProductType(
			props.visibleType === 'add'
				? null
				: baseInfoRef.value.localFormData.productType
		);
	} catch (err: any) {
		useMessage().error(err ? err : '接口错误');
	} finally {
		loading.value = false;
	}
};
/**
 * 设置主图
 * @param url
 */
const setImgUrl = (obj: { url: string }) => {
	avatar.value = obj.url;
};

// 切换到复制模式
const changeCopy = () => {
	emit('changeCopy', {
		id: props.currentRow.id,
	});
};
// 切换到编辑模式
const changeEdit = () => {
	emit('changeEdit', {
		id: props.currentRow.id,
	});
};
</script>
<style scoped lang="scss">
.left-con {
	border-right: 1px solid #ededed;
}
.img-upload {
	padding: 20px;
	border-bottom: 1px solid #ededed;
}
.tab-list {
	width: 120px;
	padding: 20px 0;
}
:deep(.el-overlay .el-overlay-dialog .el-dialog .el-dialog__body) {
	padding: 0 !important;
}
:deep(.el-tabs__item) {
	height: 20px !important;
}
</style>
