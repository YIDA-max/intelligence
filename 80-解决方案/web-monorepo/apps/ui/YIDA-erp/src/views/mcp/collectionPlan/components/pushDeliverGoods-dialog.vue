<template>
	<el-dialog
		v-bind="$attrs"
		:close-on-click-modal="false"
		:title="props.title"
		width="80%"
		@close="handleClose"
		@open="handleOpen"
		draggable
	>
		<div class="dialog-container">
			<el-form
				label-width="140px"
				ref="formRef"
				:model="formData"
				:rules="rules"
				class="mb18"
				:validate-on-rule-change="false"
			>
				<div class="section-title">
					<span class="section-bar"></span>基本信息
				</div>
				<el-row class="mb18">
					<el-col :span="6">
						<el-form-item label="提货单号" prop="pickupOrderNo">
							{{ props.currentRow.pickupOrderNo || '无' }}
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="需求单号" prop="demandOrderNo">
							{{ props.currentRow.demandOrderNo || '无' }}
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="SKU" prop="skuCode">
							<MrTextEllipsis :text="props?.currentRow?.skuCode" />
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="发货方式" prop="shippingMethod">
							{{ props.currentRow.shippingMethodText || '无' }}
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="6">
						<el-form-item label="订单类型" prop="orderTypeText">
							{{ props.currentRow.orderTypeText }}
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="部门&运营小组" prop="departmentText">
							{{ props.currentRow.departmentText || '无'
							}}{{ props.currentRow.deptText || '无' }}
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="运营人" prop="operator">
							{{ props.currentRow.operationText || '无' }}
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="工厂回复交期" prop="factoryDeliveryDate">
							{{ props.currentRow.factoryDeliveryDate || '无' }}
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="6">
						<el-form-item label="可发数量" prop="firstOrderFlag">
							{{
								(props.currentRow.pickupQuantity
									? props.currentRow.pickupQuantity
									: 0) -
								(props.currentRow.pushedShippingQuantity
									? props.currentRow.pushedShippingQuantity
									: 0)
							}}
						</el-form-item>
					</el-col>
				</el-row>
				<div class="section-title">
					<span class="section-bar"></span>货件信息
				</div>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="国家" prop="countryCode">
							<SelectInputApi
								componentType="country"
								v-model="formData.countryCode"
								:disabled="true"
								@change="(value :string) => {
									handleChangeCountry(value)
									formData.mskuCode = ''
								}"
								:settings="{
									text: '国家',
									width: '220px',
								}"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="平台渠道" prop="platformChannelCode">
							<SelectInputApi
								componentType="dicts"
								v-model="formData.platformChannelCode"
								:disabled="true"
								@change="
									() => {
										formData.mskuCode = '';
									}
								"
								:settings="{
									text: '平台渠道',
									width: '220px',
									getTreeDataParams: 'platform_channel',
								}"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="MSKU" prop="mskuCode">
							<el-select
								v-model="formData.mskuCode"
								placeholder="请选择"
								style="width: 100%"
								filterable
								clearable
								:loading="formData._loading"
								:remote="true"
								@focus="ensureLoaded(formData)"
							>
								<el-option-group
									v-for="group in formData._options || []"
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
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="partitionArray?.length === 0">
						<el-form-item label="计划发货时间" prop="pickGoodsDate">
							<el-date-picker
								v-model="formData.pickGoodsDate"
								type="date"
								placeholder="请选择日期"
								format="YYYY-MM-DD"
								value-format="YYYY-MM-DD"
								style="width: 100%"
								clearable
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="运输方式" prop="transportMethod">
							<SelectInputApi
								componentType="dicts"
								v-model="formData.transportMethod"
								:settings="{
									text: '运输方式',
									width: '220px',
									getTreeDataParams: 'transport_method',
								}"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="partitionArray?.length === 0">
						<el-form-item label="发货数量" prop="shipmentQuantity">
							<el-input-number
								v-model="formData.shipmentQuantity"
								placeholder="请输入发货数量"
								style="width: 100%"
								:min="0"
								:max="
									(props.currentRow.pickupQuantity
										? props.currentRow.pickupQuantity
										: 0) -
										(props.currentRow.pushedShippingQuantity
											? props.currentRow.pushedShippingQuantity
											: 0) || 0
								"
								:step="1"
								controls-position="right"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18" v-if="partitionArray?.length > 0">
					<el-col :span="24">
						<el-form-item prop="">
							<template #label>
								<MrRequired /> <span>区域&数量&时间</span>
							</template>
							<el-row
								class="mb18 partitionArray"
								v-if="partitionArray?.length > 0"
							>
								<el-col
									:span="24"
									v-for="item in partitionArray"
									:key="item.id"
								>
									<div class="partitionArray_item" :style="{ width: '80px' }">
										<el-checkbox
											v-model="item.checked"
											:label="item.portCode"
										/>
									</div>
									<div class="partitionArray_item" :style="{ width: '220px' }">
										<el-input-number
											v-model.number="item.qty"
											placeholder="数量"
											:disabled="!item.checked"
											class="w120"
											clearable
											:min="1"
											:step="1"
											step-strictly
											:controls="false"
											@change="handleChangeQty(item.id)"
										/>
									</div>
									<div class="partitionArray_item" :style="{ width: '220px' }">
										<el-date-picker
											v-model="item.date"
											:disabled="!item.checked"
											type="date"
											value-format="YYYY-MM-DD"
											format="YYYY-MM-DD"
											placeholder="选择日期"
										/>
									</div>
								</el-col>
							</el-row>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item label="备注" prop="remark">
							<el-input
								v-model="formData.remark"
								maxlength="1024"
								show-word-limit
								placeholder="请输入备注"
								type="textarea"
								:autosize="{ minRows: 2, maxRows: 2 }"
							/>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">{{
					t('common.cancelButtonText')
				}}</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">{{
					t('保存')
				}}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMessage, useMessageBox } from '/@/hooks/message';
import {
	postPushDeliverGoods,
	getCollectionPlanCountryPortListByCondition,
} from '/@/api/mcp/collectionPlan';
import { getSkuQueryMskuWithBundleFlag } from '/@/api/purchase/demand';

import { useI18n } from 'vue-i18n';
import { ElForm } from 'element-plus';
const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);
const { t } = useI18n();
const props = defineProps({
	title: { type: String, default: '维护货件信息' },
	currentRow: { type: Object, default: () => ({}) }, // 当前编辑的数据
	visibleType: { type: String, default: '' }, // 弹窗类型
});
const emit = defineEmits(['closeDialog', 'save']);

// 加载
const loading = ref(false);

// form表单
const formRef = ref<InstanceType<typeof ElForm> | any>();
const formData = ref<any>({});

// 分区的数据
const partitionArray = ref<Array<any>>([]);

const rules = ref<
	Record<string, Array<{ required: boolean; message: string; trigger: string }>>
>({
	countryCode: [{ required: true, message: '请选择国家', trigger: 'change' }],
	platformChannelCode: [
		{ required: true, message: '请选择平台渠道', trigger: 'change' },
	],
	mskuCode: [{ required: true, message: '请选择MSKU', trigger: 'change' }],
	pickGoodsDate: [
		{ required: true, message: '请选择计划发货时间', trigger: 'change' },
	],
	transportMethod: [
		{ required: true, message: '请选择运输方式', trigger: 'change' },
	],
	shipmentQuantity: [
		{ required: true, message: '请输入发货数量', trigger: 'change' },
	],
});

onMounted(() => {});

// 打开弹窗
const handleOpen = async () => {
	// 重置表单
	formRef.value?.resetFields();
	// 重置分区数据
	partitionArray.value = [];
	if (props.currentRow?.collectionPlanMessage?.countryCode) {
		// 如果有国家代码,就默认有值
		// 初始化表单数据
		formData.value = {
			countryCode: props.currentRow.countryCode || '',
			platformChannelCode: props.currentRow.platformChannelCode || '',
			mskuCode: props.currentRow.mskuCode || '',
			transportMethod:
				props.currentRow.transportMethod ||
				props.currentRow?.collectionPlanMessage?.transportMethod ||
				'',
		};
		handleChangeCountry(props.currentRow?.collectionPlanMessage?.countryCode);
	}
};

// 关闭弹窗
const handleClose = () => {
	emit('closeDialog');
};

/**
 * 确保加载 MSKU 选项
 * 使用sku + 国家 + 平台渠道 +部门id 去加载对应的 MSKU 列表
 * */
const ensureLoaded = async (row: any) => {
	try {
		// TODO: 换成你的接口
		row._loading = true;
		const res = await getSkuQueryMskuWithBundleFlag({
			skuCode: props.currentRow.skuCode,
			countryCode: row.countryCode,
			platformChannelCode: row.platformChannelCode,
			deptId: props.currentRow?.deptId,
		});
		if (res.code === 0) {
			const list = res.data || [];
			row._options = list;
		}
	} catch (error: any) {
		useMessage().error(error.msg || '加载失败，请稍后重试');
	} finally {
		row._loading = false; // 确保加载状态被清除
	}
};

// 提交
const onSubmit = async () => {
	const valid = await formRef.value.validate();
	if (!valid) {
		useMessage().warning('请填写必填项');
		return;
	}
	loading.value = true;
	try {
		const api = postPushDeliverGoods;
		// 判断是否有数据填写
		for (const item of partitionArray.value) {
			if (item.checked && (!item.qty || !item.date)) {
				useMessage().warning('请填写所有选中分区的数量和日期');
				return;
			}
		}
		// 构建 deliveryInfoDTOList 对象
		const deliveryInfoDTOList: Array<any> = [];
		if (partitionArray.value.length > 0) {
			partitionArray.value.forEach((item: any) => {
				if (item.checked && item.qty && item.date) {
					deliveryInfoDTOList.push({
						region: item.portCode,
						shipmentQuantity: item.qty,
						planShipmentDate: item.date,
					});
				}
			});
		} else {
			deliveryInfoDTOList.push({
				region: '',
				shipmentQuantity: formData.value.shipmentQuantity,
				planShipmentDate: formData.value.pickGoodsDate,
			});
		}

		// 提交数据
		const res = await api({
			...formData.value,
			deliveryInfoDTOList,
			collectionPlanId: props.currentRow.id || '',
		});
		if (res.code === 0) {
			useMessage().success('操作成功');
			handleClose();
		} else {
			useMessageBox().error(res.msg || '操作失败，请稍后重试');
		}
	} catch (error: any) {
		useMessage().error(error.msg || '操作失败，请稍后重试');
	} finally {
		loading.value = false;
	}
};

/**
 * 处理国家变更
 * @param value 选择的国家代码
 * @return void
 */
const handleChangeCountry = async (value: string) => {
	if (!value) return;
	const res = await getCollectionPlanCountryPortListByCondition({
		countryCode: value,
	});
	if (res.code === 0) {
		if (res.data.length === 0) {
			// 清空分区数据
			partitionArray.value = [];
			// 设置计划发货时间和发货数量为必填
			rules.value.pickGoodsDate = [
				{ required: true, message: '请选择计划发货时间', trigger: 'change' },
			];
			rules.value.shipmentQuantity = [
				{ required: true, message: '请输入发货数量', trigger: 'change' },
			];
			// 清空计划发货时间和发货数量
			formData.value.pickGoodsDate = null;
			formData.value.shipmentQuantity = null;
		} else if (res.data.length > 0) {
			// 更新分区数据
			partitionArray.value = res.data.map((item: any, index: number) => ({
				id: index + 1,
				portCode: item.portCode,
				qty: null,
				date: null,
				checked: false,
			}));
			// 清空计划发货时间和发货数量
			formData.value.pickGoodsDate = null;
			formData.value.shipmentQuantity = null;
			// 让其不是必填
			rules.value.pickGoodsDate = [];
			rules.value.shipmentQuantity = [];
		}
	}
};
/**
 * 处理数量变更
 * @param id 分区ID
 * @return void
 */
const handleChangeQty = (id: number) => {
	// 全部加起来不能超过可发数量
	let totalQty = 0;
	if (partitionArray.value.length > 0) {
		partitionArray.value.forEach((item: any) => {
			if (item.checked && item.qty) {
				totalQty += item.qty;
			}
		});
	}
	if (
		totalQty >
		(props.currentRow.pickupQuantity ? props.currentRow.pickupQuantity : 0) -
			(props.currentRow.pushedShippingQuantity
				? props.currentRow.pushedShippingQuantity
				: 0)
	) {
		// 如果超过了可发数量，提示用户
		useMessage().warning('分区数量总和不能超过可发数量');
		// 将当前分区的数量清空
		const currentPartition = partitionArray.value.find(
			(item: any) => item.id === id
		);
		if (currentPartition) {
			currentPartition.qty = null;
		}
		// 重新计算总数量
		return;
	}
};
defineExpose({
	handleOpen,
});
</script>

<style lang="scss" scoped>
.dialog-container {
	padding: 0 20px;
	height: 60vh;
	overflow: auto;
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
.mb18 {
	margin-bottom: 18px;
}
.partitionArray {
	display: flex;
	flex-wrap: wrap;
	.partitionArray_item {
		display: inline-block;
		margin-right: 10px;
		margin-bottom: 10px;
	}
}

/* el-input-number 默认居中，这里保持输入/placeholder 左对齐 */
:deep(.w120 .el-input__inner) {
	text-align: left;
}
</style>
