<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-24 11:04:57
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-04-28 21:18:49
 * @FilePath: \qianyi-ui\src\views\fbm\selfOrder\components\tableColumnExpand\expand-order-action\shipToFBA\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { ref } from 'vue';
import { getBaseStorePage } from '/@/api/base/store/index';
import { getSkuQueryMskuWithBundleFlag } from '/@/api/purchase/demand';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useI18n } from 'vue-i18n';
import { useMessage } from '/@/hooks/message';
import { setData } from './utils';
import { postfulfillmentByAmazon } from '/@/api/fbm/selfOrder/index';
import { getAmazonStorage } from '/@/api/warehouse/stock/index';
const SkuModule = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/tableColumnExpand/expand-order-action/shipToFBA/components/sku-module.vue'
		)
);
const { t } = useI18n();
const props = defineProps({
	// 当前行数据
	currentRow: {
		type: Object,
		default: () => ({}),
	},
});
//父组件刷新数据方法
const getDataList = inject<() => void>('getDataList');
// 弹窗与表单引用
const dialogRef = ref<any | null>(null);
// 表单引用
const formRef = ref<any | null>(null);
// 弹窗显示与否
const dialogVisible = ref(false);
// 表单数据
const formData = ref<Record<string, any>>({});
// 对应渠道的店铺信息
const storeList = ref<Array<any>>([]);
//  skumodeule引用
const skuModuleRef = ref<any | null>(null);
// 表格数据
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	// pageList: getMaterialList,
	descs: [''],
	isPage: false,
});
// 赠品表格数据
const giftState: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	// pageList: getMaterialList,
	descs: [''],
	isPage: false,
});
// tableRef
const tableRef = ref<any>(null);
// giftTableRef
const giftTableRef = ref<any>(null);
//  table hook
const { tableStyle, setTableData } = useTable(state, tableRef);
const { tableStyle: giftTableStyle, setTableData: setGiftTableData } = useTable(
	giftState,
	giftTableRef
);

// 表单校验
const rules = ref({
	platformOrderNo: [
		{ required: true, message: '平台单号不能为空', trigger: 'blur' },
		{
			validator: (
				rule: any,
				value: string,
				callback: (arg0?: Error | undefined) => void
			) => {
				// 基础非空校验（如果字段为空，此规则不处理非空错误，由之前的required规则处理）
				if (!value) {
					// 如果值为空，直接调用callback()，让之前的required规则去提示“不能为空”
					return callback();
				}
				// 校验是否包含非ISO 8859-1字符
				// ISO 8859-1（Latin-1）字符集的范围是 \x00-\xFF（即0-255）
				// 这个正则表达式匹配任何不在此范围内的字符
				if (!/[\u0020-\u007E]/.test(value)) {
					return callback(new Error('平台单号不能包含中文或特殊字符'));
				}
				// 如果校验通过，必须调用callback()，否则表单验证会一直处于pending状态[3](@ref)
				callback();
			},
			trigger: 'blur',
		},
	], // 加入自定义校验],
	platformChannelCode: [
		{ required: true, message: '平台渠道不能为空', trigger: 'blur' },
	],
	storeId: [{ required: true, message: '店铺不能为空', trigger: 'blur' }],
	orderTime: [{ required: true, message: '订购时间不能为空', trigger: 'blur' }],
	recipientName: [
		{ required: true, message: '收件人姓名不能为空', trigger: 'blur' },
	],
	recipientCountry: [
		{ required: true, message: '国家不能为空', trigger: 'blur' },
	],
	recipientCity: [{ required: true, message: '城市不能为空', trigger: 'blur' }],
	recipientDetailAddress: [
		{ required: true, message: '详细地址不能为空', trigger: 'blur' },
	],
	buyerName: [{ required: true, message: '买家姓名不能为空', trigger: 'blur' }],
	deliverySpeed: [
		{ required: true, message: '配送速度不能为空', trigger: 'blur' },
	],
});
/**
 * 初始化
 */
const init = async () => {
	setData(props.currentRow, formData.value);
	// 设置默认值(应该默认是亚马逊的)
	handleChangePlatformChannel('Amazon');
	// 处理合并的订单数据，提取商品信息，合并相同SKU的数量
	const skuList: Array<any> = [];
	props.currentRow.orderItemVOList?.forEach((item: any) => {
		// 查找是否已经存在该SKU
		const existingSku = skuList.find((sku) => sku.skuCode === item.skuCode);
		// 计算未发数量
		const unshippedQuantity =
			(item.orderQuantity ? Number(item.orderQuantity) : 0) -
			(item.nullifyQuantity ? Number(item.nullifyQuantity) : 0) -
			(item.shippedQuantity ? Number(item.shippedQuantity) : 0);
		if (existingSku) {
			// 如果存在，累加未发数量
			existingSku.unshippedQuantity += unshippedQuantity;
		} else {
			// 如果不存在，添加新的SKU对象
			skuList.push({
				...item,
				mskuCode: '',
				unshippedQuantity: unshippedQuantity,
			});
		}
	});
	// 设置表格数据
	setTableData(skuList);
};

/**
 * 平台渠道改变事件
 */
const handleChangePlatformChannel = async (value: string) => {
	// 根据平台渠道获取店铺列表
	const res = await getBaseStorePage({
		// 这个要转为数组 不然会报错 后台需要数组
		platformChannelCodes: [value],
		current: 1,
		size: 10000,
	});
	if (res && res.data && res.data.records && res.code === 0) {
		storeList.value = res.data.records;
	} else {
		storeList.value = [];
	}
	// 清空店铺选择
	formData.value.storeId = '';
	// 清空站点代码
	formData.value.siteCode = '';
};
/**
 * 店铺改变事件
 */
const handleChangeStore = (value: string) => {
	// 根据选择的店铺设置站点代码
	const selectedStore = storeList.value.find((store) => store.id === value);
	if (selectedStore) {
		formData.value.siteCode = selectedStore.siteCode;
	} else {
		formData.value.siteCode = '';
	}
	// 清空全部的sku里面的masku
	state.dataList?.forEach((item) => {
		item.mskuCode = '';
	});
};
/**
 *	使用国家+平台渠道+SKU获取MSKU列表
 */
const ensureLoaded = async (row: any) => {
	try {
		if (!formData.value.platformChannelCode) {
			useMessage().warning('请先选择平台渠道');
			return;
		}
		if (!formData.value.siteCode) {
			useMessage().warning('请先选择店铺/站点');
			return;
		}
		if (!formData.value.storeId) {
			useMessage().warning('请先选择店铺');
			return;
		}
		if (!row.skuCode) {
			useMessage().warning('SKU缺失');
			return;
		}
		row._loading = true;
		// TODO: 换成你的接口
		const res = await getSkuQueryMskuWithBundleFlag({
			skuCode: row.skuCode,
			countryCode: formData.value.siteCode,
			storeId: formData.value.storeId,
			platformChannelCode: formData.value.platformChannelCode,
		});
		if (
			res.code === 0 &&
			res.data &&
			Array.isArray(res.data) &&
			res.data.length > 0
		) {
			const list = res.data || [];
			row._options = list;
		} else {
			row._options = [];
			// useMessage().warning('未获取到对应MSKU数据');
		}
	} catch (error) {
		// 错误处理
		row._options = [];
		useMessage().error('获取MSKU数据失败');
	} finally {
		row._loading = false; // 确保加载状态被清除
	}
};

/**
 * MSKU改变事件
 */
const handleChangeMSKU = async (row: any) => {
	if (!row.mskuCode || !formData.value.storeId || !row.skuCode) {
		useMessage().warning('请确保已选择SKU和MSKU以及店铺');
		return;
	}
	row.asin =
		row._options
			?.flatMap((g: any) => g.options || [])
			.find((opt: any) => opt.mskuCode === row.mskuCode)?.asin ?? '';
	// 获取对应的可用库存
	const res = await getAmazonStorage({
		platformChannelCode: 'Amazon', // 亚马逊平台固定
		storeId: formData.value.storeId, // 店铺ID
		skuCode: row.skuCode, // SKU
		mskuCode: row.mskuCode, // MSKU
	});
	if (res && res.code === 0 && res.data) {
		row.fulfillableQuantity = res.data.fulfillableQuantity;
	} else {
		row.fulfillableQuantity = 0;
	}
};

/**
 * 处理添加赠品回调
 */
const handleSetRows = (rows: Array<any>) => {
	// 将新增的赠品添加到giftState的数据中
	const newData = rows.map((row) => ({
		...row,
	}));
	setGiftTableData(newData);
};
/**
 * 删除赠品
 */
const handeDelGiftList = (index: number) => {
	const currentData = giftState.dataList || [];
	currentData.splice(index, 1);
	setGiftTableData(currentData);
};
/**
 * 提交表单
 */
const onSubmit = async () => {
	await formRef.value.validate();
	// sku校验 必须要有msku
	for (const item of state.dataList || []) {
		if (!item.mskuCode) {
			useMessage().warning(`SKU: ${item.skuCode} 未选择MSKU`);
			return;
		}
	}
	//  构造参数
	const params = {
		...formData.value,
		orderItems: state.dataList?.map((item) => ({
			skuCode: item.skuCode,
			mskuCode: item.mskuCode,
			...item,
		})),
	};

	const res = await postfulfillmentByAmazon(params);
	if (res && res.code === 0) {
		useMessage().success('操作成功');
		getDataList?.();
		hide();
	}
};
/**
 * 打开弹窗方法
 * 供父组件调用
 */
const show = async () => {
	dialogVisible.value = true;
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
		width="80%"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:append-to-body="true"
		@open="init"
		@close="hide"
	>
		<template #header>
			<span class="mr-2 title">{{ t('转FBA发货') }}</span>
			<span> 订购时间(北京)： {{ props.currentRow?.orderTime }} </span>
		</template>
		<div class="dialog-container">
			<el-form
				:model="formData"
				ref="formRef"
				label-width="120px"
				:rules="rules"
			>
				<div class="left">
					<el-row class="mb-4">
						<el-col :span="24">
							<el-form-item label="卖家订单编号" prop="platformOrderNo">
								<el-input
									v-model="formData.platformOrderNo"
									placeholder="请输入平台单号"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row class="mb-4">
						<el-col :span="12">
							<el-form-item label="收件人姓名" prop="recipientName">
								<el-input
									v-model="formData.recipientName"
									placeholder="请输入收件人姓名"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="收件人电话" prop="recipientPhone">
								<el-input
									v-model="formData.recipientPhone"
									placeholder="请输入收件人电话"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row class="mb-4">
						<el-col :span="24">
							<el-form-item label="收件人邮箱" prop="recipientEmail">
								<el-input
									v-model="formData.recipientEmail"
									placeholder="请输入收件人邮箱"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row class="mb-4">
						<el-col :span="12">
							<el-form-item label="城市" prop="recipientCity">
								<el-input
									v-model="formData.recipientCity"
									placeholder="请输入城市"
							/></el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="区/县" prop="recipientDistrict">
								<el-input
									v-model="formData.recipientDistrict"
									placeholder="请输入区/县"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row class="mb-4">
						<el-col :span="8">
							<el-form-item label="国家" prop="recipientCountry">
								<el-input
									v-model="formData.recipientCountry"
									placeholder="请输入国家"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="省/州" prop="recipientState">
								<el-input
									v-model="formData.recipientState"
									placeholder="请输入省/州"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="邮编" prop="recipientPostcode">
								<el-input
									v-model="formData.recipientPostcode"
									placeholder="请输入邮编"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row class="mb-4">
						<el-col :span="24">
							<el-form-item label="详细地址1" prop="recipientDetailAddress">
								<el-input
									v-model="formData.recipientDetailAddress"
									placeholder="请输入详细地址"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row class="mb-4">
						<el-col :span="24">
							<el-form-item label="详细地址2" prop="recipientDetailAddress1">
								<el-input
									v-model="formData.recipientDetailAddress1"
									placeholder="请用收件国家/地区当地语种输入"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row class="mb-4">
						<el-col :span="24">
							<el-form-item label="详细地址3" prop="recipientDetailAddress2">
								<el-input
									v-model="formData.recipientDetailAddress2"
									placeholder="请用收件国家/地区当地语种输入"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row class="mb-4">
						<el-col :span="24">
							<el-form-item label="备注" prop="orderRemark">
								<el-input
									v-model="formData.orderRemark"
									placeholder="请输入备注"
								/>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
				<div class="right">
					<el-row class="mb-2">
						<el-col :span="24">
							<el-form-item label="店铺/站点" prop="storeId">
								<el-select
									v-model="formData.storeId"
									placeholder="请选择店铺/站点"
									filterable
									@change="handleChangeStore"
								>
									<el-option
										v-for="item in storeList"
										:key="item.id"
										:label="`${item.storeName}/${item.siteCode}`"
										:value="item.id"
									/>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row class="mb-2">
						<span class="mr-2 container-title"> 商品信息</span>
						<span> ({{ state.dataList?.length }}种产品) </span>
					</el-row>
					<el-row class="table mb-2">
						<el-table
							:data="state.dataList"
							:style="{
								width: '750px',
							}"
							:scrollbar-always-on="true"
							height="180"
							v-loading="state.loading"
							border
							ref="tableRef"
							row-key="id"
							:cell-style="tableStyle.cellStyle"
							:header-cell-style="tableStyle.headerCellStyle"
							native-scrollbar
						>
							<el-table-column prop="skuCode" min-width="150">
								<template #header>
									<span
										:style="{
											color: '#f78c8c',
											marginRight: '3px',
										}"
										>*
									</span>
									{{ $t('SKU') }}
								</template>
								<template #default="{ row }">
									{{ row.skuCode }}
								</template>
							</el-table-column>
							<el-table-column
								prop="skuName"
								min-width="150"
								show-overflow-tooltip
								label="商品名称"
							>
								<template #default="{ row }">
									{{ row.skuName }}
								</template>
							</el-table-column>
							<el-table-column prop="mskuCode" min-width="150">
								<template #header>
									<span
										:style="{
											color: '#f78c8c',
											marginRight: '3px',
										}"
										>*
									</span>
									{{ $t('MSKU') }}
								</template>
								<template #default="{ row }">
									<!-- {{ row?._options[0] }} -->
									<el-select
										v-model="row.mskuCode"
										placeholder="请选择"
										style="width: 100%"
										filterable
										:loading="row._loading"
										:remote="true"
										@change="
											() => {
												handleChangeMSKU(row);
											}
										"
										@focus="ensureLoaded(row)"
									>
										<el-option-group
											v-for="group in row?._options || []"
											:key="group.label"
											:label="group.label"
										>
											<el-option
												v-for="opt in group.options || []"
												:key="opt.mskuCode"
												:label="opt.label"
												:value="opt.mskuCode"
											/>
										</el-option-group>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column label="ASIN" min-width="150" prop="asin">
								<template #default="{ row }">
									<!-- 先找到SKU的选项，再找到对应的ASIN -->
									{{ row?.asin || '---' }}
								</template>
							</el-table-column>
							<el-table-column label="可用库存" min-width="150" prop="otherFee">
								<template #default="{ row }">
									{{
										row.fulfillableQuantity ? row.fulfillableQuantity : '---'
									}}
								</template>
							</el-table-column>
							<el-table-column label="未发数量" min-width="150" prop="otherFee">
								<template #default="{ row }">
									{{
										row.unshippedQuantity
											? row.unshippedQuantity
											: (Number(row.orderQuantity ? row.orderQuantity : 0) -
													Number(
														row.nullifyQuantity ? row.nullifyQuantity : 0
													) || 0) -
											  (Number(
													row.shippedQuantity ? row.shippedQuantity : 0
											  ) || 0)
									}}
								</template>
							</el-table-column>
						</el-table>
					</el-row>
					<el-row class="mb-2">
						<el-col :span="24">
							<el-form-item label="配送速度" prop="deliverySpeed">
								<el-radio-group v-model="formData.deliverySpeed">
									<el-radio value="1">Standard</el-radio>
									<el-radio value="2">Expedited</el-radio>
									<el-radio value="3">Priority</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row class="mb-2">
						<el-col :span="24">
							<el-form-item label="" prop="unbrandedPackageOnly">
								<span class="mr-2">
									<el-switch v-model="formData.unbrandedPackageOnly" />
								</span>
								<span class="mr-2"> 仅使用无品牌包装箱配送 </span>
								<el-popover placement="top" width="400" trigger="hover">
									<template #default>
										<div class="">
											选择此功能后，仅允许对符合无品牌包装条件的商品进行下单
										</div>
									</template>
									<template #reference>
										<div class="mr-2">
											<el-icon><QuestionFilled /></el-icon>
										</div>
									</template>
								</el-popover>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row class="mb-2">
						<el-col :span="24">
							<el-form-item label="" prop="blockAmazonLogistics">
								<span class="mr-2">
									<el-switch v-model="formData.blockAmazonLogistics" />
								</span>
								<span class="mr-2"> 阻止亚马逊物流 </span>
								<el-popover placement="top" width="400" trigger="hover">
									<template #default>
										<div class="">
											禁止对MCF订单使用亚马逊物流(AMZL)将导致MCF订单收取附加费，如果没有其他承运人可用，则会增加部分订单无法配送或预计延迟送达的风险。您在此处指定的订单级别偏好设置将覆盖您在此处的设置字段。
										</div>
									</template>
									<template #reference>
										<div class="mr-2">
											<el-icon><QuestionFilled /></el-icon>
										</div>
									</template>
								</el-popover>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row class="mb-2" v-show="false">
						<span class="mr-2 container-title"> 赠品信息</span>
						<span class="mr-2"> ({{ giftState.dataList?.length }}种产品) </span>
						<span>
							<el-link
								type="primary"
								@click="
									() => {
										skuModuleRef?.show();
									}
								"
								underline="never"
								>添加赠品</el-link
							>
						</span>
					</el-row>
					<el-row
						class="table mb-2"
						v-if="giftState.dataList && giftState.dataList.length > 0"
					>
						<el-table
							:data="giftState.dataList"
							style="width: 750px"
							height="180"
							v-loading="giftState.loading"
							border
							ref="giftTableRef"
							row-key="id"
							:cell-style="giftTableStyle.cellStyle"
							:header-cell-style="giftTableStyle.headerCellStyle"
							native-scrollbar
						>
							<el-table-column prop="skuCode" min-width="150">
								<template #header>
									<span
										:style="{
											color: '#f78c8c',
											marginRight: '3px',
										}"
										>*
									</span>
									{{ $t('SKU') }}
								</template>
								<template #default="{ row }">
									{{ row.skuCode }}
								</template>
							</el-table-column>
							<el-table-column
								prop="skuName"
								min-width="150"
								show-overflow-tooltip
								label="商品名称"
							>
								<template #default="{ row }">
									{{ row.skuName }}
								</template>
							</el-table-column>
							<el-table-column prop="mskuCode" min-width="150">
								<template #header>
									<span
										:style="{
											color: '#f78c8c',
											marginRight: '3px',
										}"
										>*
									</span>
									{{ $t('MSKU') }}
								</template>
								<template #default="{ row }">
									{{ row.mskuCode }}
								</template>
							</el-table-column>
							<el-table-column label="发货量" min-width="150" prop="otherFee">
								<template #default="{ row }">
									<el-inputNumber
										v-model="row.shipQuantity"
										placeholder="请输入发货量"
										:max="row.fulfillableQuantity"
									/>
								</template>
							</el-table-column>
							<el-table-column
								:label="$t('common.action')"
								width="150"
								fixed="right"
							>
								<template #default="{ $index: index }">
									<div class="flex items-center">
										<el-link
											type="primary"
											underline="never"
											class="mr-5"
											@click="
												() => {
													handeDelGiftList(index);
												}
											"
											>{{ $t('删除') }}
										</el-link>
									</div>
								</template>
							</el-table-column>
						</el-table>
					</el-row>
				</div>
			</el-form>
			<SkuModule ref="skuModuleRef" @setRows="handleSetRows" />
		</div>

		<template #footer>
			<div style="text-align: right">
				<el-button @click="hide">{{ t('取消') }}</el-button>
				<el-button type="primary" @click="onSubmit">{{ t('确定') }}</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<style lang="scss" scoped>
.title {
	font-size: 18px;
	font-weight: bold;
}
.dialog-container {
	padding: 0 20px;
	height: 60vh;
	overflow: auto;
	.container-title {
		font-size: 16px;
		font-weight: bold;
		margin-bottom: 12px;
		color: #000;
	}
	.left {
		float: left;
		width: 50%;
		height: 100%;
		padding: 0 10px;
	}
	.right {
		float: right;
		width: 50%;
		height: 100%;
		padding: 0 10px;
		.table {
			overflow: auto;
		}
	}
}
</style>
