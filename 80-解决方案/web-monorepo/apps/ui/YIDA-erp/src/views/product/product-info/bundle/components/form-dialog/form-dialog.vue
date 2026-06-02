<!-- eslint-disable no-unused-vars -->
<template>
	<el-dialog
		v-bind="$attrs"
		width="80%"
		:close-on-click-modal="false"
		draggable
		@open="init"
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
								:ishowRequired="false"
							></ImageUpload>
						</div>
						<div class="tab-list">
							<el-tabs
								tab-position="right"
								style="height: 200px"
								class="demo-tabs"
								v-model="tabsValue"
							>
								<el-tab-pane label="基本信息" :name="0"></el-tab-pane>
								<el-tab-pane label="箱规信息" :name="1"></el-tab-pane>
								<el-tab-pane label="关联sku" :name="2"></el-tab-pane>
								<el-tab-pane label="关联MSKU" :name="3"></el-tab-pane>
								<el-tab-pane label="图片信息" :name="4"></el-tab-pane>
								<el-tab-pane
									label="操作日志"
									:name="5"
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
					></BaseInfo>
					<SingleCartonInfo
						ref="singleCartonInfoRef"
						v-show="tabsValue === 1"
						:dictMap="dictMap"
						:visibleType="props.visibleType"
						:bundleCode="baseInfoRef?.localFormData?.bundleCode || ''"
					></SingleCartonInfo>
					<AssociateSku
						ref="associateSkuRef"
						v-show="tabsValue === 2"
						:dictMap="dictMap"
						:visibleType="props.visibleType"
					></AssociateSku>
					<AssociateMsku
						ref="associateMskuRef"
						v-show="tabsValue === 3"
						:dictMap="dictMap"
						:visibleType="props.visibleType"
					></AssociateMsku>
					<ImgsInfo
						ref="imgsInfoRef"
						v-show="tabsValue === 4"
						:dictMap="dictMap"
						:setImgUrl="setImgUrl"
						:visibleType="props.visibleType"
					></ImgsInfo>
					<LogInfo
						ref="logInfoRef"
						v-show="tabsValue === 5"
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
						$t('复制')
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
import { getDicts } from '/@/api/admin/dict';
import { defineAsyncComponent, ref, onMounted } from 'vue';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { postBundleSave, postBundleUpdate } from '/@/api/product/bundle';
import { addInit, editInit, copyInit } from './utils/sku-form-dialog';
import { sysCountryList } from '/@/api/materialFlow/track';
import { getUserListByCondition } from '/@/api/admin/user';
import { getDeptLastDeptByCondition } from '/@/api/admin/dept';
const ImageUpload = defineAsyncComponent(
	() => import('/@/components/Upload/Image.vue')
);
const BaseInfo = defineAsyncComponent(
	() => import('./components/base-info.vue')
);
const SingleCartonInfo = defineAsyncComponent(
	() => import('./components/single-carton-info.vue')
);
const AssociateSku = defineAsyncComponent(
	() => import('./components/associate-sku.vue')
);
const AssociateMsku = defineAsyncComponent(
	() => import('./components/associate-msku.vue')
);
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
});
//   初始化数据
const { dictMap } = useMultipleDicts(
	[
		{
			key: 'saleArea',
			fetchFn: getDicts,
			params: 'sale_area',
		}, // 销售地区
		{
			key: 'countryList',
			fetchFn: sysCountryList,
		}, // 国家列表
		{
			key: 'bundleType',
			fetchFn: getDicts,
			params: 'bundle_type',
		}, // 捆绑类型
		{
			key: 'platform',
			fetchFn: getDicts,
			params: 'platform_channel',
		}, // 平台

		{
			key: 'itemSpecUnit',
			fetchFn: getDicts,
			params: 'item_spec_unit',
		}, // 单品规格单位
		{
			key: 'itemNetWeightUnit',
			fetchFn: getDicts,
			params: 'item_net_weight_unit',
		}, // 单品净重单位
		{
			key: 'productManageId',
			fetchFn: getUserListByCondition,
			params: {
				lockFlag: 0,
			},
		}, // 负责人
		{
			key: 'skuDepts',
			fetchFn: getDeptLastDeptByCondition,
			params: {
				deptName: '运营中心',
			},
		}, // 运营部门
	],
	{
		isAuto: true,
		tableRef: null,
	}
);
// onMounted
onMounted(async () => {});

const loading = ref(false);
const tabsValue = ref(0);
const avatar = ref(''); // 默认头像
const baseInfoRef = ref();
const singleCartonInfoRef = ref();
const associateSkuRef = ref();
const associateMskuRef = ref();
const imgsInfoRef = ref();
const logInfoRef = ref();
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
	// 验证单箱信息
	try {
		const isValid = await singleCartonInfoRef.value.validateAll();
		if (!isValid) {
			tabsValue.value = 1;
			return;
		}
	} catch (error) {
		tabsValue.value = 1;
	} finally {
		loading.value = false;
	}
	// 验证关联SKU
	try {
		const associateSkuList = await associateSkuRef.value.getDataList();
		if (associateSkuList.length === 0) {
			useMessage().error('请关联SKU');
			tabsValue.value = 2;
			return;
		}
		//    首先如果sku的table有值，那么他的数量就是必填
		for (const row of associateSkuList) {
			if (
				row.skuQty === null ||
				row.skuQty === undefined ||
				row.skuQty === ''
			) {
				useMessage().error(
					`SKU ${row.skuCode} - ${row.skuName} 的数量不能为空`
				);
				tabsValue.value = 2;
				return; // 只要一个不合法就退出
			}
		}
	} catch (error) {
		tabsValue.value = 2;
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
				if (!items[j].mskuCode || items[j].mskuCode.trim() === '') {
					useMessage().error(`${group.label}的第 ${j + 1} 项缺少 MSKU`);
					tabsValue.value = 3;
					return false;
				}
			}
		}
	} catch (error) {
		tabsValue.value = 3;
	} finally {
		loading.value = false;
	}

	// 验证图片信息
	// try {
	// 	if (imgsInfoRef.value.avatar.length === 0) {
	// 		useMessage().error('请上传图片');
	// 		tabsValue.value = 4;
	// 		return;
	// 	}
	// } catch (error) {
	// 	tabsValue.value = 4;
	// } finally {
	// 	loading.value = false;
	// }
	// 基本信息
	const baseInfoParams = {
		// 捆绑代码
		bundleCode: baseInfoRef.value.localFormData.bundleCode,
		// 捆绑品名
		bundleName: baseInfoRef.value.localFormData.bundleName,
		// 捆绑类型
		bundleType: baseInfoRef.value.localFormData.bundleType,
		// 销售地区
		// saleArea: baseInfoRef.value.localFormData.saleArea,
		// 销售国家
		productBundleCountryList: baseInfoRef.value.localFormData
			.productBundleCountryList.length
			? baseInfoRef.value.localFormData.productBundleCountryList.map(
					(item: any) => {
						return {
							countryCode: item,
						};
					}
			  )
			: [],
		// 平台,需要转换
		platforms: baseInfoRef.value.localFormData.platform,
		// 产品负责人
		productManageId: baseInfoRef.value.localFormData.productManageId
			? baseInfoRef.value.localFormData.productManageId
			: 1,
		// 运营组,需要转换
		deptIds: baseInfoRef.value.localFormData.deptIds,
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

	// 单箱信息
	// const singleCartonInfoParams = {
	// 	// 单箱数量
	// 	singleCartonQty: singleCartonInfoRef.value.localFormData.singleCartonQty,
	// 	// 外箱规格 长宽高
	// 	outCartonSpecLength: singleCartonInfoRef.value.localFormData.outCartonSpecLength,
	// 	outCartonSpecWidth: singleCartonInfoRef.value.localFormData.outCartonSpecWidth,
	// 	outCartonSpecHeight: singleCartonInfoRef.value.localFormData.outCartonSpecHeight,
	// 	// 外箱规格单位
	// 	outCartonSpecUnit: singleCartonInfoRef.value.localFormData.outCartonSpecUnit,
	// 	// 单箱重量
	// 	singleCartonWeight: singleCartonInfoRef.value.localFormData.singleCartonWeight,
	// 	// 单箱重量单位
	// 	singleCartonWeightUnit: singleCartonInfoRef.value.localFormData.singleCartonWeightUnit,
	// 	// 单柜装箱数
	// 	containerCartonQty: singleCartonInfoRef.value.localFormData.containerCartonQty,
	// };
	// 箱规信息 - 使用新的数据结构
	const singleCartonFormData = singleCartonInfoRef.value.getFormData();
	const singleCartonInfoParams = {
		cartonUnitType: singleCartonFormData.cartonUnitType, // 添加单位类型
		productBundleCartons: singleCartonFormData.productBundleCartons.map(
			(item: any) => ({
				bundleCartonCode: item.bundleCartonCode,
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
			})
		),
	};
	// 关联sku
	const associateMaterialDataList: any = associateSkuRef.value.getDataList();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
	const associateMaterialParams = {
		productBundleSkus: associateMaterialDataList.map(
			// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
			({ id, ...rest }: any) => ({
				...rest,
				bundleCode: baseInfoRef.value.localFormData.bundleCode,
			})
		), // 关联的SKU编码
	};
	// 关联MSKU
	const mskusParams: {
		productBundleMskus: Array<{
			bundleCode: string;
			mskuCode: string;
			platform: string;
			shop: string;
			remark: string;
			operationUserId: string;
			deptId: string;
			countryCode: string;
		}>;
	} = {
		productBundleMskus: [],
	};
	for (const platformGroup of associateMskuRef.value.tabsAndTable) {
		// 遍历每个平台组
		const platform = platformGroup.value;
		const table = platformGroup.tableData || [];
		for (const row of table) {
			// 忽略空行时可以加校验，如 mskuCode 存在才推入
			mskusParams.productBundleMskus.push({
				bundleCode: baseInfoRef.value.localFormData.bundleCode || '',
				mskuCode: row.mskuCode || '',
				platform: platform || '',
				shop: row.storeId || '',
				remark: row.remark || '',
				operationUserId: row.operationUserId || '',
				deptId: row.deptId || '',
				countryCode: Array.isArray(row.countryCode)
					? row.countryCode.join(',')
					: row.countryCode || '',
			});
			// 运营人员id必填
			if (!row.operationUserId) {
				useMessage().error('请选择运营人员');
				throw new Error('请选择运营人员');
			}
		}
	}
	// 图片列表
	const imgsInfoParams = {
		bundleImgs: imgsInfoRef.value.avatarList.map(
			(item: { url: string; fileName: string }, index: number) => {
				return {
					bundleCode: baseInfoRef.value.localFormData.bundleCode,
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
			const res = await postBundleSave({
				...baseInfoParams,
				...singleCartonInfoParams,
				...associateMaterialParams,
				...mskusParams,
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
			const res = await postBundleUpdate({
				id: props.currentRow.id, // 传入ID
				...baseInfoParams,
				...singleCartonInfoParams,
				...associateMaterialParams,
				...mskusParams,
				...imgsInfoParams,
				// 管理msku的时候把当前平台给过去，只校验当前平台，其他的平台不做校验。（后期考虑重构）
				operatePlatform: associateMskuRef.value.tabsValue,
			});
			if (res.code === 0) {
				useMessage().success('编辑成功');
				emit('closeDialog'); // 关闭对话框
			}
		}
	} catch (error: any) {
		useMessage().error(error.msg);
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
			addInit(
				baseInfoRef,
				singleCartonInfoRef,
				associateSkuRef,
				associateMskuRef,
				imgsInfoRef,
				dictMap,
				avatar,
				tabsValue
			);
		} else if (props.visibleType === 'edit') {
			// 如果是编辑，就需要加载数据
			await editInit(
				baseInfoRef,
				singleCartonInfoRef,
				associateSkuRef,
				associateMskuRef,
				imgsInfoRef,
				dictMap,
				props
			);
		} else if (props.visibleType === 'view') {
			// 如果是查看，就需要加载数据
			await editInit(
				baseInfoRef,
				singleCartonInfoRef,
				associateSkuRef,
				associateMskuRef,
				imgsInfoRef,
				dictMap,
				props
			);
		} else if (props.visibleType === 'copy') {
			// 如果是复制，就需要加载数据
			await copyInit(
				baseInfoRef,
				singleCartonInfoRef,
				associateSkuRef,
				associateMskuRef,
				imgsInfoRef,
				dictMap,
				props
			);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
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
