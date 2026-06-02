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
				label-width="120px"
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
								@change="
									() => {
										matchStoreInfo();
										getPlatformWarehouse();
										formData.mskuCode = '';
										formData.platformWarehouseCode = '';
									}
								"
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
								@change="
									(value:string) => {
										handleChangePlatformChannelCode(value);
										matchStoreInfo();
										getPlatformWarehouse();
										formData.mskuCode = '';
										formData.platformWarehouseCode = '';
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
									v-for="group in formData?._options || []"
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
					<el-col :span="12">
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
						<el-form-item label="发货数量">
							{{ props.currentRow.pickupQuantity }}
						</el-form-item>
					</el-col>
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
				</el-row>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="平台店铺" prop="storeId">
							<el-select
								clearable
								filterable
								v-model="formData.storeId"
								placeholder="平台店铺"
							>
								<el-option
									v-for="item in listByCondition"
									:key="item.id"
									:label="`[${item.platformChannelCode}]${item.storeName}:${item.siteCode}`"
									:value="item.id"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="平台仓库" prop="platformWarehouseCode">
							<el-select
								clearable
								filterable
								v-model="formData.platformWarehouseCode"
								placeholder="平台仓库"
							>
								<el-option
									v-for="item in platformList"
									:key="item.warehouseCode"
									:label="`[${item.warehouseCode}]${item.warehouseName}`"
									:value="item.warehouseCode"
								/>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<!-- 用一次 v-for 把相邻两项拼成一行：idx 为偶数就起一行，右侧用 idx+1 -->
				<el-row class="mb18">
					<el-col
						v-for="(field, idx) in keyConfig"
						:key="field.key"
						:span="12"
						:class="
							idx < keyConfig.length - (keyConfig.length % 2 === 0 ? 2 : 1)
								? 'mb18'
								: ''
						"
					>
						<el-form-item :label="field.value.label" :prop="field.key">
							<el-input
								v-model="formData[field.key]"
								:placeholder="`请输入${field.value.label}`"
								clearable
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="货件创建时间" prop="goodsCreateTime">
							<el-date-picker
								v-model="formData.goodsCreateTime"
								type="date"
								placeholder="请选择日期"
								format="YYYY-MM-DD"
								value-format="YYYY-MM-DD"
								:disabled-date="disabledFutureDate"
								:editable="false"
								style="width: 100%"
								clearable
							/>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="箱唛附件" prop="shippingMarkAttachment">
							<upload-file
								:limit="1"
								:fileSize="200"
								@change="() => {}"
								:fileType="[
									'zip',
									'pdf',
									'xlsx',
									'xls',
									'doc',
									'docx',
									'jpg',
									'png',
								]"
								v-model="formData.shippingMarkAttachment"
								:isShowTip="true"
								:uploadFileUrl="'/admin/sys-file/upload'"
								type="simple"
								:data="{}"
								:dir="''"
								:autoUpload="true"
								:disabled="false"
								@error="() => {}"
								@remove="() => {}"
								@preview="() => {}"
								@exceed="() => {}"
								@success="() => {}"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="条码附件" prop="barcodeAttachment">
							<upload-file
								:limit="1"
								:fileSize="200"
								@change="() => {}"
								:fileType="[
									'zip',
									'pdf',
									'xlsx',
									'xls',
									'doc',
									'docx',
									'jpg',
									'png',
								]"
								v-model="formData.barcodeAttachment"
								:isShowTip="true"
								:uploadFileUrl="'/admin/sys-file/upload'"
								type="simple"
								:data="{}"
								:dir="''"
								:autoUpload="true"
								:disabled="false"
								@error="() => {}"
								@remove="() => {}"
								@preview="() => {}"
								@exceed="() => {}"
								@success="() => {}"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18" v-if="formData.platformChannelCode === 'Amazon'">
					<el-col :span="12">
						<el-form-item label="透明计划标签" prop="transparencyAttachment">
							<upload-file
								:limit="1"
								:fileSize="200"
								@change="() => {}"
								:fileType="[
									'zip',
									'pdf',
									'xlsx',
									'xls',
									'doc',
									'docx',
									'jpg',
									'png',
								]"
								v-model="formData.transparencyAttachment"
								:isShowTip="true"
								:uploadFileUrl="'/admin/sys-file/upload'"
								type="simple"
								:data="{}"
								:dir="''"
								:autoUpload="true"
								:disabled="false"
								@error="() => {}"
								@remove="() => {}"
								@preview="() => {}"
								@exceed="() => {}"
								@success="() => {}"
							/>
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
	getConfigByPtChannelCode,
	postPreservePackageInfo,
	getListByCondition,
} from '/@/api/mcp/collectionPlan';
import { useI18n } from 'vue-i18n';
import { getSkuQueryMskuWithBundleFlag } from '/@/api/purchase/demand';
import { getPlatformList } from '/@/api/mcp/collectionPlan/index';
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
const formRef = ref();
const formData = ref<any>({});

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
	goodsCreateTime: [
		{ required: true, message: '请选择货件创建时间', trigger: 'change' },
	],
	transportMethod: [
		{ required: true, message: '请选择运输方式', trigger: 'change' },
	],
	storeId: [{ required: true, message: '请选择平台店铺', trigger: 'change' }],
	platformWarehouseCode: [
		{ required: true, message: '请选择平台仓库', trigger: 'change' },
	],
	shippingMarkAttachment: [
		{ required: true, message: '请上传箱唛附件', trigger: 'change' },
	],
	barcodeAttachment: [
		{ required: true, message: '请上传条码附件', trigger: 'change' },
	],
});

// 货件创建时间最晚只能选择当天（不可选未来日期）
const disabledFutureDate = (date: Date) => {
	return date.getTime() > Date.now();
};

// keyConfig 通过渠道获取的货件配置
const keyConfig = ref<{ [key: string]: any }[]>([]);
// 平台店铺
const listByCondition = ref<any[]>([]);
// 平台仓库
const platformList = ref<any[]>([]);
// 根据渠道+国家 匹配平台仓库信息
const getPlatformWarehouse = async () => {
	try {
		const res = await getPlatformList({
			countryCode: formData.value?.countryCode,
			platformChannelCode: formData.value?.platformChannelCode,
		});
		if (res.code === 0) {
			platformList.value = res.data || [];
		}
	} catch (error: any) {
		useMessage().error(error.msg || '加载失败，请稍后重试');
	}
};
// 根据根据渠道+国家+部门+小组，匹配后台配置店铺信息
const matchStoreInfo = async () => {
	try {
		const res = await getListByCondition({
			platformChannelCode: formData.value?.platformChannelCode,
			siteCode: formData.value?.countryCode,
			// 2026年5月16日17:14:01 先去掉部门小组
			// deptId: props.currentRow?.deptId,
		});
		if (res.code === 0) {
			listByCondition.value = res.data || [];
		}
	} catch (error: any) {
		useMessage().error(error.msg || '加载失败，请稍后重试');
	}
};

onMounted(() => {});

// 打开弹窗
const handleOpen = async () => {
	formData.value.skuCode = props.currentRow?.skuCode || ''; // SKU
	if (props.currentRow?.collectionPlanMessage?.platformChannelCode) {
		// 回显数据
		// 调用接口查询对应的渠道带出来的
		handleChangePlatformChannelCode(
			props.currentRow?.collectionPlanMessage?.platformChannelCode || ''
		); // 触发平台渠道变更，加载 keyConfig
		// 回显：把 channelMessage 的键值一并写回 formData
		formData.value = {
			skuCode: props.currentRow?.skuCode || '', // SKU
			countryCode: props.currentRow?.collectionPlanMessage?.countryCode || '', // 国家
			platformChannelCode:
				props.currentRow?.collectionPlanMessage?.platformChannelCode || '', // 平台渠道
			mskuCode: props.currentRow?.collectionPlanMessage?.mskuCode || '', // MSKU
			pickGoodsDate:
				props.currentRow?.collectionPlanMessage?.pickGoodsDate || '', // 计划发货时间
			transportMethod:
				props.currentRow?.collectionPlanMessage?.transportMethod || '', // 运输方式
			storeId: props.currentRow?.collectionPlanMessage?.storeId || '', // 平台店铺
			platformWarehouseCode:
				props.currentRow?.collectionPlanMessage?.platformWarehouseCode || '', // 平台仓库
			shippingMarkAttachment: props.currentRow?.collectionPlanMessage
				?.shippingMarkAttachment
				? [props.currentRow?.collectionPlanMessage?.shippingMarkAttachment]
				: [], // 箱唛附件
			barcodeAttachment: props.currentRow?.collectionPlanMessage
				?.barcodeAttachment
				? [props.currentRow?.collectionPlanMessage?.barcodeAttachment]
				: [], // 条码附件
			transparencyAttachment: props.currentRow?.collectionPlanMessage
				?.transparencyAttachment
				? [props.currentRow?.collectionPlanMessage?.transparencyAttachment]
				: [], // 透明计划标签
			remark: props.currentRow?.collectionPlanMessage?.remark || '',
			goodsCreateTime:
				props.currentRow?.collectionPlanMessage?.goodsCreateTime || '',
			...(props.currentRow?.collectionPlanMessage?.channelMessage ?? false),
		};
		// 匹配店铺
		await matchStoreInfo();
		// 匹配平台仓库
		await getPlatformWarehouse();
		// 如果有 MSKU，则加载 MSKU 选项
		if (formData.value.mskuCode) {
			await ensureLoaded(formData.value);
		}
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
		const res = await getSkuQueryMskuWithBundleFlag({
			skuCode: row.skuCode,
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
		const api = postPreservePackageInfo;
		// 构建 channelMessage 对象
		const channelMessage: { [key: string]: any } = {};
		keyConfig.value.forEach((item) => {
			if (formData.value[item.key]) {
				channelMessage[item.key] = formData.value[item.key];
			}
		});
		// 提交数据
		const res = await api({
			...formData.value,
			channelMessage,
			collectionPlanId: props.currentRow.id || '',
			shippingMarkAttachment:
				formData.value.shippingMarkAttachment.map((item: string) =>
					typeof item === 'string' && item.includes('fileName=')
						? item.split('fileName=')[1]
						: item
				)[0] || '', // 箱唛附件
			barcodeAttachment:
				formData.value.barcodeAttachment.map((item: string) =>
					typeof item === 'string' && item.includes('fileName=')
						? item.split('fileName=')[1]
						: item
				)[0] || '', // 条码附件
			transparencyAttachment:
				formData.value.transparencyAttachment?.map((item: string) =>
					typeof item === 'string' && item.includes('fileName=')
						? item.split('fileName=')[1]
						: item
				)[0] || '', // 透明计划标签
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
 * @description: 处理平台渠道变更
 * @param {string} value - 选中的平台渠道代码
 */
const handleChangePlatformChannelCode = async (value: string) => {
	if (!value) return;
	// 清空 keyConfig 对应的 formData 字段
	formData.value = {
		// 保持其他字段不变
		skuCode: formData.value.skuCode, // SKU
		countryCode: formData.value.countryCode, // 国家
		platformChannelCode: formData.value.platformChannelCode, // 平台渠道
		mskuCode: formData.value.mskuCode, // MSKU
		pickGoodsDate: formData.value.pickGoodsDate, // 计划发货时间
		transportMethod: formData.value.transportMethod, // 运输方式
		storeId: formData.value.storeId, // 平台店铺
		platformWarehouseCode: formData.value.platformWarehouseCode, // 平台仓库
		shippingMarkAttachment: formData.value.shippingMarkAttachment, // 箱唛附件
		barcodeAttachment: formData.value.barcodeAttachment, // 条码附件
		remark: formData.value.remark, // 备注
	};
	// 清空 keyConfig
	keyConfig.value = [];

	// 根据平台渠道代码获取配置
	const res = await getConfigByPtChannelCode({ platformChannelCode: value });
	if (res.code === 0 && res.data) {
		if (res.data.config) {
			keyConfig.value = Object.entries(res.data.config).map(([key, value]) => ({
				key,
				value,
			}));
		}
		// 根据拿到的 keyConfig 更新 rules
		rules.value = {
			countryCode: [
				{ required: true, message: '请选择国家', trigger: 'change' },
			],
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
			storeId: [
				{ required: true, message: '请选择平台店铺', trigger: 'change' },
			],
			platformWarehouseCode: [
				{ required: true, message: '请选择平台仓库', trigger: 'change' },
			],
			shippingMarkAttachment: [
				{ required: true, message: '请上传箱唛附件', trigger: 'change' },
			],
			barcodeAttachment: [
				{ required: true, message: '请上传条码附件', trigger: 'change' },
			],
			goodsCreateTime: [
				{ required: true, message: '请选择货件创建时间', trigger: 'change' },
			],
		};
		keyConfig.value.forEach((item) => {
			rules.value[item.key] = [
				{
					required: true,
					message: `请输入${item.value.label}`,
					trigger: 'change',
				},
			];
		});
		// 等待10毫秒，确保UI更新
		await new Promise((resolve) => setTimeout(resolve, 10));
		// 清空所有的校验
		formRef.value.clearValidate();
	} else {
		keyConfig.value = [];
		useMessage().warning(res.msg || '暂无数据');
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
</style>
