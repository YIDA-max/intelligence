<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-24 11:04:57
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-06-01 10:30:23
 * @FilePath: \qianyi-ui\src\views\fbm\selfOrder\components\toolBar\addItem\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { ref, Ref } from 'vue';
import { getBaseStorePage } from '/@/api/base/store/index';
import { Minus } from '@element-plus/icons-vue';
import { getSkuQueryMskuWithBundleFlag } from '/@/api/purchase/demand';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useI18n } from 'vue-i18n';
import { useMessage } from '/@/hooks/message';
import { isNumber } from 'lodash';
import { postAddSelfOrder } from '/@/api/fbm/selfOrder';
import { getCurrencySymbol } from '/@/utils/rateUtils';
const SkuModule = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/toolBar/addItem/components/sku-module.vue'
		)
);
const DataSynchronize = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/toolBar/addItem/components/data-synchronize.vue'
		)
);
const { t } = useI18n();
const props = defineProps({
	// 当前行数据
	type: {
		type: String,
		default: () => '',
	},
});

const getDataList = inject<Function>('getDataList');
// 注入字典数据
const dictMap = inject<Ref<any>>('dictMap');
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
// 获取到商品sku的ref
const skuModule = ref<InstanceType<typeof SkuModule>>();
// 获取到数据同步的ref
const dataSynchronize = ref<InstanceType<typeof DataSynchronize>>();

// 表格数据
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	// pageList: getMaterialList,
	descs: [''],
	isPage: false,
});
// tableRef
const tableRef = ref<any>(null);
//  table hook
const { tableStyle, setTableData } = useTable(state, tableRef);

// 表单校验
const rules = ref({
	platformOrderNo: [
		{ required: true, message: '平台单号不能为空', trigger: 'blur' },
	],
	platformChannelCode: [
		{ required: true, message: '平台渠道不能为空', trigger: 'blur' },
	],
	storeId: [{ required: true, message: '店铺不能为空', trigger: 'blur' }],
	orderTime: [{ required: true, message: '订购时间不能为空', trigger: 'blur' }],
	resendOrder: [
		{ required: true, message: '是否补发订单不能为空', trigger: 'change' },
	],
	recipientName: [
		{ required: true, message: '收件人姓名不能为空', trigger: 'blur' },
	],
	recipientCountry: [
		{ required: true, message: '国家不能为空', trigger: 'blur' },
	],
	// 客户要的邮编不能为空
	recipientPostcode: [
		{ required: true, message: '邮编不能为空', trigger: 'blur' },
	],
	recipientCity: [{ required: true, message: '城市不能为空', trigger: 'blur' }],
	recipientDetailAddress: [
		{ required: true, message: '详细地址不能为空', trigger: 'blur' },
	],
	buyerName: [{ required: true, message: '买家姓名不能为空', trigger: 'blur' }],
});
/**
 * 初始化
 */
const init = async () => {
	props.type;

	// 重置数据
	formData.value = {};
	// 重置表格数据
	setTableData([]);
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
	// 清空所有的MSKU数据
	state.dataList?.forEach((item) => {
		item.mskuCode = '';
		item._options = [];
	});
};
/**
 * 店铺改变事件
 */
const handleChangeStore = (value: number) => {
	// 根据选择的店铺设置站点代码
	const selectedStore = storeList.value.find((store) => store.id === value);
	if (selectedStore) {
		formData.value.siteCode = selectedStore.siteCode;
	} else {
		formData.value.siteCode = '';
	}
	// 清空所有的MSKU数据
	state.dataList?.forEach((item) => {
		item.mskuCode = '';
		item._options = [];
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
		if (!formData.value.storeId) {
			useMessage().warning('请先选择店铺');
			return;
		}
		if (!formData.value.siteCode) {
			useMessage().warning('请先选择国家');
			return;
		}
		if (!row.skuCode) {
			useMessage().warning('SKU缺失');
			return;
		}
		row._loading = true;
		// 加一个判断 如果 countryCode是 GC（全国） 或者 EU（欧盟） 则不加 countryCode 换为 收件人国家
		let countryCode = formData.value.siteCode;
		if (formData.value.siteCode === 'GC' || formData.value.siteCode === 'EU') {
			// 必须选择收件人国家
			if (!formData.value.recipientCountry) {
				useMessage().warning('请先选择收件人国家');
				return;
			}
			countryCode = formData.value.recipientCountry;
		}
		// 发送请求获取MSKU列表
		const res = await getSkuQueryMskuWithBundleFlag({
			skuCode: row.skuCode,
			countryCode,
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
			// 如果获取到MSKU数据，则设置为不创建MSKU
			row.createMsku = false;
		} else {
			row._options = [];
			// 1是成品 2是配件
			if (row?.productType === '2') {
				// 如果没有MSKU数据，则设置为SKU（强制要求的）
				row.mskuCode = row.skuCode;
				// 进行创建msku的标记请求 后台会根据这个字段去创建msku
				row.createMsku = true;
				useMessage().warning(
					'未获取到对应MSKU数据,如果是配件商品的话提交的时候将会尝试自动创建MSKU'
				);
			}
		}
	} finally {
		row._loading = false; // 确保加载状态被清除
	}
};

// /**
//  * 	从选择sku组件设置数据
//  * @param data
//  */
// const handleSetRows = (rows: any[]) => {
// 	const dataList = state.dataList ? [...state.dataList] : [];
// 	rows.forEach((row: any) => {
// 		// 检查是否已存在相同的skuCode
// 		const existingIndex = dataList.findIndex((item: any) => item.skuCode === row.skuCode);
// 		if (existingIndex !== -1) {
// 			// 无需处理
// 		} else {
// 			// 如果不存在，添加到dataList
// 			dataList.push({
// 				...row,
// 			});
// 		}
// 	});
// 	// 设置选中的数据
// 	setTableData(dataList);
// };
/**
 * 	从选择sku组件设置数据
 * @param data
 */
const handleSetRows = (rows: any[]) => {
	const dataList = state.dataList ? [...state.dataList] : [];
	rows.forEach((row: any) => {
		dataList.push({
			...row,
		});
	});
	// 设置选中的数据
	setTableData(dataList);
};
/**
 * 	从数据同步组件设置数据
 */
const handleSetData = async (data: any) => {
	// 重新选中平台渠道和店铺，触发联动
	await handleChangePlatformChannel(data.platformChannelCode);
	// 设置表单数据
	formData.value = {
		platformOrderNo: data.platformOrderNo || '', // 平台单号
		platformChannelCode: data.platformChannelCode || '', // 平台渠道
		storeId: data.storeId || '', // 店铺
		orderTime: data.orderTime || '', // 订购时间
		latestShippingTime: data.latestShippingTime || '', // 发货截止
		csNote: data.csNote || '', // 客服备注
		resendOrder: data.resendOrder ?? null, // 是否补发订单
		currencyCode: data.currencyCode || '', // 币种
		recipientName: data.recipientName || '', // 收件人姓名
		recipientPhone: data.recipientPhone || '', // 电话
		recipientMobile: data.recipientMobile || '', // 手机号
		recipientEmail: data.recipientEmail || '', // 邮箱
		recipientTaxNo: data.recipientTaxNo || '', // 税号
		recipientCountry: data.recipientCountry || '', // 国家
		recipientState: data.recipientState || '', // 省/州
		recipientPostcode: data.recipientPostcode || '', // 邮编
		recipientCity: data.recipientCity || '', // 城市
		recipientDistrict: data.recipientDistrict || '', // 区/县
		recipientStreet: data.recipientStreet || '', // 街道
		recipientHouseNo: data.recipientHouseNo || '', // 门牌号
		recipientDetailAddress: data.recipientDetailAddress || '', // 详细地址
		buyerName: data.buyerName || '', // 买家姓名
		buyerEmail: data.buyerEmail || '', // 买家邮箱
		platformWarehouseId: data.platformWarehouseId || '', // 平台仓库ID
		buyerMessage: data.buyerMessage || '', // 买家留言
	};
	// 选择店铺，触发联动
	handleChangeStore(data.storeId);
	// 取消表单校验
	await formRef.value.clearValidate();
	// orderItemDetails 把所有bundleFlag为1的skuCode都排除掉 避免重复数据同步捆绑sku的数据
	const newDataList = data.orderItemDetails.filter(
		(item: any) => item.bundleFlag !== 1
	);
	// 同步sku列表数据 设置选中的数据
	setTableData(newDataList);
	// // 设置表格数据
	// setTableData(data.skuList || []);
};

/**
 * 	删除行
 * @param row
 * @param index
 */
const handleDelete = (row: any, index: number) => {
	const dataList = [...(state.dataList ? state.dataList : [])];
	// 最少保留一行
	// if (dataList.length <= 1) {
	// 	useMessage().warning('至少保留一行数据');
	// 	return;
	// }
	dataList.splice(index, 1);
	setTableData(dataList);
};

/**
 * 显示包装规格
 */
const showPackSpec = (row: any) => {
	let spec = '';
	if (
		row.packSpecLength &&
		row.packSpecWidth &&
		row.packSpecHeight &&
		isNumber(row.packSpecLength) &&
		isNumber(row.packSpecWidth) &&
		isNumber(row.packSpecHeight)
	) {
		const volume =
			(row.packSpecLength * row.packSpecWidth * row.packSpecHeight) / 1000000; // 转换为立方米
		spec = volume.toFixed(6); // 保留六位小数
	} else {
		spec = '---';
	}
	return spec;
};
/**
 * 显示sku数据的计算集合
 */
const showSkuListData = (skuList: any[]) => {
	/**
	 * 约定：字段「没有任何可用数据参与计算」时返回 '--'，避免 UI 展示为 0 造成误解。
	 * 注意：若真实累计结果为 0（例如折扣为 0），仍应展示 0，因此要区分「无数据」与「结果为0」。
	 */
	const EMPTY = '--';

	// 计算中间态：全部先按 number 累计，最后根据 has.* 决定输出 number 或 '--'
	const sum = {
		totalQuantity: 0,
		estimatedWeight: 0,
		totalUnitPrice: 0,
		totalDiscount: 0,
		totalPoints: 0,
		estimatedVolume: 0,
		totalTax: 0,
		totalCustomerPaidShipping: 0,
		totalOtherFee: 0,
	};
	const has = {
		totalQuantity: false,
		estimatedWeight: false,
		totalUnitPrice: false,
		totalDiscount: false,
		totalPoints: false,
		estimatedVolume: false,
		totalTax: false,
		totalCustomerPaidShipping: false,
		totalOtherFee: false,
	};

	/** 有效数值才累加，同时标记 has[field]=true */
	const addIfFinite = (field: keyof typeof sum, val: unknown) => {
		const n = Number(val);
		if (!Number.isFinite(n)) return;
		has[field] = true;
		sum[field] += n;
	};
	/** 维度合法性：长宽高均为数字（非 0 即可参与计算） */
	const isValidSpec = (item: any) => {
		return (
			item?.packSpecLength &&
			item?.packSpecWidth &&
			item?.packSpecHeight &&
			isNumber(item.packSpecLength) &&
			isNumber(item.packSpecWidth) &&
			isNumber(item.packSpecHeight)
		);
	};

	skuList.forEach((item) => {
		// quantity：其余按“单价 * quantity”的字段都依赖它
		const qty = Number(item?.orderQuantity);
		const hasQty = Number.isFinite(qty);
		if (hasQty) {
			addIfFinite('totalQuantity', qty);
		}

		// 预估重量：itemGrossWeight * quantity
		if (hasQty) {
			const grossWeight = Number(item?.itemGrossWeight);
			if (Number.isFinite(grossWeight)) {
				addIfFinite('estimatedWeight', grossWeight * qty);
			}
		}

		// 商品售价(不含税)：unitPrice * quantity
		if (hasQty) {
			const unitPrice = Number(item?.unitPrice);
			if (Number.isFinite(unitPrice)) {
				addIfFinite('totalUnitPrice', unitPrice * qty);
			}
		}

		// 商品折扣 / 积分 / 税金 / 运费 / 其他费用：接口若返回 0 也应计入，因此只要是有限数字就累加
		addIfFinite('totalDiscount', item?.discount);
		addIfFinite('totalPoints', item?.points);
		addIfFinite('totalTax', item?.tax);
		addIfFinite('totalCustomerPaidShipping', item?.customerPaidShipping);
		addIfFinite('totalOtherFee', item?.otherFee);

		// 预估体积：(L*W*H)/1e6 * quantity（m³）
		if (hasQty && isValidSpec(item)) {
			const volume =
				(item.packSpecLength * item.packSpecWidth * item.packSpecHeight) /
				1000000;
			addIfFinite('estimatedVolume', volume * qty);
		}
	});

	// 输出格式：有数据才保留小数；无数据输出 '--'
	const result: Record<string, number | string> = {
		totalQuantity: has.totalQuantity ? sum.totalQuantity : EMPTY,
		estimatedWeight: has.estimatedWeight
			? Number(sum.estimatedWeight.toFixed(2))
			: EMPTY,
		totalUnitPrice: has.totalUnitPrice
			? Number(sum.totalUnitPrice.toFixed(2))
			: EMPTY,
		totalDiscount: has.totalDiscount ? sum.totalDiscount : EMPTY,
		totalPoints: has.totalPoints ? sum.totalPoints : EMPTY,
		estimatedVolume: has.estimatedVolume
			? Number(sum.estimatedVolume.toFixed(6))
			: EMPTY,
		totalTax: has.totalTax ? sum.totalTax : EMPTY,
		totalCustomerPaidShipping: has.totalCustomerPaidShipping
			? sum.totalCustomerPaidShipping
			: EMPTY,
		totalOtherFee: has.totalOtherFee ? sum.totalOtherFee : EMPTY,
	};

	return result;
};

const onSubmit = async () => {
	// 校验表单
	const valid = await formRef.value.validate();
	if (!valid) {
		return;
	}
	// 校验表格数据
	const dataList = state.dataList || [];
	if (dataList.length === 0) {
		useMessage().warning('请添加商品信息');

		return;
	}
	for (const item of dataList) {
		if (!item.skuCode) {
			useMessage().warning('SKU不能为空');

			return;
		}
		if (!item.mskuCode) {
			useMessage().warning('MSKU不能为空');

			return;
		}
		if (!item.orderQuantity || Number(item.orderQuantity) <= 0) {
			useMessage().warning('订购数量必须大于0');

			return;
		}
		// if (!item.unitPrice || Number(item.unitPrice) < 0) {
		// 	useMessage().warning('商品单价(不含税)不能为空且不能小于0');

		// 	return;
		// }
		// sku+msku重复校验 产品说先不校验
		// const duplicateCount = dataList.filter(
		// 	(d) => d.skuCode === item.skuCode && d.mskuCode === item.mskuCode
		// ).length;
		// if (duplicateCount > 1) {
		// 	useMessage().warning(
		// 		`SKU: ${item.skuCode} 与 MSKU: ${item.mskuCode} 的组合存在重复，请检查`
		// 	);

		// 	return;
		// }
	}
	// 提交数据
	const submitData = {
		...formData.value,
		orderItems: dataList.map((item) => {
			return {
				...item,
				orderQuantity: Number(item.orderQuantity),
				// 商品售价
				productTotalPrice:
					item.unitPrice && item.orderQuantity
						? Number(item.unitPrice) * Number(item.orderQuantity)
						: 0,
				// 商品标题，同步订单返回的商品名称字段是productTitle
				productTitle: item.skuName || item.productTitle,
			};
		}),
	};
	const res = await postAddSelfOrder(submitData);
	if (res && res.code === 0) {
		useMessage().success('新增订单成功');
		getDataList && getDataList();
		hide();
	} else {
		// useMessage().error(res.msg || '新增订单失败');
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
			<span class="title">{{ t('新增订单') }}</span>
			<el-link
				class="ml10"
				type="primary"
				underline="never"
				target="_blank"
				@click="
					() => {
						dataSynchronize?.show();
					}
				"
				>{{ t('从现有订单同步数据') }}</el-link
			>
		</template>
		<div class="dialog-container">
			<el-form
				:model="formData"
				ref="formRef"
				label-width="120px"
				:rules="rules"
			>
				<div class="left">
					<el-row class="mb-2">
						<span class="container-title"> 订单来源信息</span>
					</el-row>
					<el-row class="mb-4">
						<el-col :span="16">
							<el-form-item label="平台单号" prop="platformOrderNo">
								<el-input
									v-model="formData.platformOrderNo"
									placeholder="请输入平台单号"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="平台渠道" prop="platformChannelCode">
								<el-select
									v-model="formData.platformChannelCode"
									placeholder="请选择平台渠道"
									filterable
									@change="handleChangePlatformChannel"
								>
									<el-option
										v-for="item in dictMap.platformChannel"
										:key="item.id"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row class="mb-4">
						<el-col :span="16">
							<el-form-item label="店铺" prop="storeId">
								<el-select
									v-model="formData.storeId"
									placeholder="请选择店铺"
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
						<el-col :span="8">
							<el-form-item label="订单国家/地区" prop="siteCode">
								<el-input
									v-model="formData.siteCode"
									placeholder="请选择店铺"
									disabled
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row class="mb-4">
						<el-col :span="8">
							<el-form-item label="订购时间(北京)" prop="orderTime">
								<el-date-picker
									v-model="formData.orderTime"
									type="datetime"
									placeholder="选择日期时间"
									style="width: 100%"
									value-format="YYYY-MM-DD HH:mm:ss"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="发货截止" prop="latestShippingTime">
								<el-date-picker
									v-model="formData.latestShippingTime"
									type="datetime"
									placeholder="选择日期时间"
									style="width: 100%"
									value-format="YYYY-MM-DD HH:mm:ss"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="平台仓库ID" prop="platformWarehouseId">
								<el-input
									v-model="formData.platformWarehouseId"
									placeholder="请输入平台仓库ID"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row class="mb-4">
						<el-col :span="24">
							<el-form-item label="客服备注" prop="csNote">
								<el-input
									v-model="formData.csNote"
									placeholder="请输入客服备注"
									type="textarea"
									maxlength="1000"
									show-word-limit
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row class="mb-4">
						<el-col :span="8">
							<el-form-item label="是否补发订单" prop="resendOrder">
								<el-select
									v-model="formData.resendOrder"
									placeholder="请选择"
									filterable
								>
									<el-option
										v-for="item in [
											{ id: 1, label: '是', value: 1 },
											{ id: 2, label: '否', value: 0 },
										]"
										:key="item.id"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row class="mb-2">
						<span class="container-title"> 收件人信息</span>
					</el-row>
					<el-row class="mb-4">
						<el-col :span="8">
							<el-form-item label="收件人姓名" prop="recipientName">
								<el-input
									v-model="formData.recipientName"
									placeholder="请输入收件人姓名"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="电话" prop="recipientPhone">
								<el-input
									v-model="formData.recipientPhone"
									placeholder="请输入电话"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="手机号" prop="recipientMobile">
								<el-input
									v-model="formData.recipientMobile"
									placeholder="请输入手机号"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row class="mb-4">
						<el-col :span="8">
							<el-form-item label="邮箱" prop="recipientEmail">
								<el-input
									v-model="formData.recipientEmail"
									placeholder="请输入邮箱"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="税号" prop="recipientTaxNo">
								<el-input
									v-model="formData.recipientTaxNo"
									placeholder="请输入税号"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="国家" prop="recipientCountry">
								<el-select
									v-model="formData.recipientCountry"
									placeholder="请选择国家"
									filterable
								>
									<el-option
										v-for="item in dictMap.countryList"
										:key="item.abbTwoCode"
										:label="`${item.abbTwoCode}-${item.chineseName}`"
										:value="item.abbTwoCode"
									/>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row class="mb-4">
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
						<el-col :span="8">
							<el-form-item label="城市" prop="recipientCity">
								<el-input
									v-model="formData.recipientCity"
									placeholder="请输入城市"
							/></el-form-item>
						</el-col>
					</el-row>
					<el-row class="mb-4">
						<el-col :span="8">
							<el-form-item label="区/县" prop="recipientDistrict">
								<el-input
									v-model="formData.recipientDistrict"
									placeholder="请输入区/县"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="街道" prop="recipientStreet">
								<el-input
									v-model="formData.recipientStreet"
									placeholder="请输入街道"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="门牌号" prop="recipientHouseNo">
								<el-input
									v-model="formData.recipientHouseNo"
									placeholder="请输入门牌号"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row class="mb-4">
						<el-col :span="24">
							<el-form-item label="详细地址" prop="recipientDetailAddress">
								<el-input
									v-model="formData.recipientDetailAddress"
									placeholder="请输入详细地址"
								/>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
				<div class="right">
					<el-row class="mb-2">
						<span class="mr-2 container-title"> 商品信息</span>
						<el-button
							type="primary"
							size="small"
							class="mr-2"
							@click="skuModule?.show()"
							>{{ t('添加商品') }}</el-button
						>
						<span> (已经添加{{ state.dataList?.length }}种产品) </span>
						<span
							:style="{
								color: '#f78c8c',
								margin: '0px 5px 0px 10px',
							}"
							>*
						</span>
						<el-select
							:style="{
								marginLeft: '0px !important',
								width: '200px',
							}"
							v-model="formData.currencyCode"
							placeholder="请选择币种"
							filterable
							size="small"
						>
							<el-option
								v-for="item in dictMap.baseCurrency"
								:key="item.currencyCode"
								:label="`${item.currencyCode}-${item.currencyName}`"
								:value="item.currencyCode"
							/>
						</el-select>
					</el-row>
					<el-row class="table mb-2">
						<el-table
							:data="state.dataList"
							style="width: 700px"
							height="280"
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
									<MrTextEllipsis :text="row.skuCode" :max-length="50" />
								</template>
							</el-table-column>
							<el-table-column
								prop="mskuCode"
								min-width="150"
								show-overflow-tooltip
							>
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
									<el-select
										v-model="row.mskuCode"
										placeholder="请选择"
										style="width: 100%"
										filterable
										clearable
										:loading="row._loading"
										:remote="true"
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
							<el-table-column label="商品毛重" min-width="150">
								<template #default="{ row }">
									{{ row.itemGrossWeight ? row.itemGrossWeight : '---' }}
								</template>
							</el-table-column>
							<el-table-column label="商品体积" min-width="150">
								<template #default="{ row }">
									{{ showPackSpec(row) }} m³
								</template>
							</el-table-column>
							<el-table-column
								label="订购数量"
								min-width="150"
								prop="orderQuantity"
							>
								<template #header>
									<span
										:style="{
											color: '#f78c8c',
											marginRight: '3px',
										}"
										>*
									</span>
									{{ $t('订购数量') }}
								</template>
								<template #default="{ row }">
									<el-input
										v-model="row.orderQuantity"
										placeholder="请输入数量"
										type="number"
										style="width: 100%"
									/>
								</template>
							</el-table-column>
							<el-table-column
								label="商品单价(不含税)"
								min-width="150"
								prop="unitPrice"
							>
								<template #header>
									<span
										:style="{
											color: '#f78c8c',
											marginRight: '3px',
										}"
										>*
									</span>
									{{ $t('商品单价(不含税)') }}
								</template>
								<template #default="{ row }">
									<el-input
										v-model="row.unitPrice"
										placeholder="请输入数量"
										type="number"
										style="width: 100%"
									/>
								</template>
							</el-table-column>
							<el-table-column label="商品折扣" min-width="150" prop="discount">
								<template #default="{ row }">
									<el-input
										v-model="row.discount"
										placeholder="请输入数量"
										type="number"
										style="width: 100%"
									/>
								</template>
							</el-table-column>
							<el-table-column label="商品积分" min-width="150" prop="points">
								<template #default="{ row }">
									<el-input
										v-model="row.points"
										placeholder="请输入数量"
										type="number"
										style="width: 100%"
									/>
								</template>
							</el-table-column>
							<el-table-column label="商品税金" min-width="150" prop="tax">
								<template #default="{ row }">
									<el-input
										v-model="row.tax"
										placeholder="请输入数量"
										type="number"
										style="width: 100%"
									/>
								</template>
							</el-table-column>
							<el-table-column
								label="商品买家支付运费"
								min-width="150"
								prop="customerPaidShipping"
							>
								<template #default="{ row }">
									<el-input
										v-model="row.customerPaidShipping"
										placeholder="请输入数量"
										type="number"
										style="width: 100%"
									/>
								</template>
							</el-table-column>
							<el-table-column
								label="商品其他费用"
								min-width="150"
								prop="otherFee"
							>
								<template #default="{ row }">
									<el-input
										v-model="row.otherFee"
										placeholder="请输入数量"
										type="number"
										style="width: 100%"
									/>
								</template>
							</el-table-column>
							<el-table-column
								label="商品备注"
								min-width="150"
								prop="itemRemark"
							>
								<template #default="{ row }">
									<el-input
										v-model="row.itemRemark"
										placeholder="请输入备注"
										style="width: 100%"
									/>
								</template>
							</el-table-column>
							<el-table-column
								:label="$t('common.action')"
								width="150"
								fixed="right"
							>
								<template #default="{ row, $index: index }">
									<el-button :icon="Minus" @click="handleDelete(row, index)" />
								</template>
							</el-table-column>
						</el-table>
						<el-descriptions :column="3" border>
							<el-descriptions-item width="100">
								<template #label>{{ t('总计数量') }}</template>
								<template #default>
									<div class="w-full truncate">
										{{ showSkuListData(state.dataList || []).totalQuantity }}
									</div>
								</template>
							</el-descriptions-item>
							<el-descriptions-item width="100">
								<template #label>{{ t('预估重量') }}</template>
								<template #default>
									<div class="w-full truncate">
										{{ showSkuListData(state.dataList || []).estimatedWeight }}
										KG
									</div>
								</template>
							</el-descriptions-item>
							<el-descriptions-item width="100">
								<template #label>{{ t('商品售价(不含税)') }}</template>
								<template #default>
									<div class="w-full truncate">
										{{ showSkuListData(state.dataList || []).totalUnitPrice }}
										{{ getCurrencySymbol(formData.currencyCode) }}
									</div>
								</template>
							</el-descriptions-item>
							<el-descriptions-item width="100">
								<template #label>{{ t('商品折扣') }}</template>
								<template #default>
									<div class="w-full truncate">
										{{ showSkuListData(state.dataList || []).totalDiscount }}
										{{ getCurrencySymbol(formData.currencyCode) }}
									</div>
								</template>
							</el-descriptions-item>
							<el-descriptions-item width="100">
								<template #label>{{ t('商品积分') }}</template>
								<template #default>
									<div class="w-full truncate">
										{{ showSkuListData(state.dataList || []).totalPoints }}
									</div>
								</template>
							</el-descriptions-item>
							<el-descriptions-item width="100">
								<template #label>{{ t('预估体积') }}</template>
								<template #default>
									<div class="w-full truncate">
										{{ showSkuListData(state.dataList || []).estimatedVolume }}
										m³
									</div>
								</template>
							</el-descriptions-item>
							<el-descriptions-item width="100">
								<template #label>{{ t('商品税金') }}</template>
								<template #default>
									<div class="w-full truncate">
										{{ showSkuListData(state.dataList || []).totalTax }}
										{{ getCurrencySymbol(formData.currencyCode) }}
									</div>
								</template>
							</el-descriptions-item>
							<el-descriptions-item width="100">
								<template #label>{{ t('商品买家支付运费') }}</template>
								<template #default>
									<div class="w-full truncate">
										{{
											showSkuListData(state.dataList || [])
												.totalCustomerPaidShipping
										}}
										{{ getCurrencySymbol(formData.currencyCode) }}
									</div>
								</template>
							</el-descriptions-item>
							<el-descriptions-item width="100">
								<template #label>{{ t('商品其他费用') }}</template>
								<template #default>
									<div class="w-full truncate">
										{{ showSkuListData(state.dataList || []).totalOtherFee }}
										{{ getCurrencySymbol(formData.currencyCode) }}
									</div>
								</template>
							</el-descriptions-item>
						</el-descriptions>
					</el-row>
					<el-row class="mb-2">
						<span class="mr-2 container-title"> 买家信息</span>
					</el-row>
					<el-row class="mb-4">
						<el-col :span="8">
							<el-form-item label="买家姓名" prop="buyerName">
								<el-input
									v-model="formData.buyerName"
									placeholder="请输入买家姓名"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="买家邮箱" prop="buyerEmail">
								<el-input
									v-model="formData.buyerEmail"
									placeholder="请输入买家邮箱"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="买家留言" prop="buyerMessage">
								<el-input
									v-model="formData.buyerMessage"
									placeholder="请输入买家留言"
								/>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
			</el-form>
			<SkuModule
				ref="skuModule"
				@setRows="
					(e) => {
						handleSetRows(e);
					}
				"
				:skuList="state.dataList"
			/>
			<DataSynchronize
				ref="dataSynchronize"
				@setData="
					(e) => {
						handleSetData(e);
					}
				"
			/>
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
			height: 310px;
			overflow: auto;
		}
	}
}
</style>
