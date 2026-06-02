<!--
	发货计划 — 维护货件信息弹窗（与提货计划 preservePackageInfo-dialog 命名一致）。
	入口与显隐逻辑见 deliveryPlan/index.vue：仅列表行 shipmentCountryConfigFlag !== true 时展示按钮（与后端约定一致，勿前端推断配置表）。
-->
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
				<!-- 只读：发货计划维度基础信息 -->
				<div class="section-title">
					<span class="section-bar"></span>基本信息
				</div>
				<el-row class="mb18">
					<el-col :span="6">
						<el-form-item label="发货单号" prop="deliveryNo">
							{{ props.currentRow.deliveryNo || '无' }}
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="提货单号" prop="pickupNo">
							{{ props.currentRow.pickupNo || '无' }}
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
				<!-- 只读：国家/渠道/MSKU/计划发货时间/数量/运输方式（与列表行一致，不可改） -->
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
							<el-input
								v-model="formData.mskuCode"
								disabled
								placeholder="MSKU"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="计划发货时间" prop="pickGoodsDate">
							<el-date-picker
								v-model="formData.pickGoodsDate"
								type="date"
								disabled
								placeholder="请选择日期"
								format="YYYY-MM-DD"
								value-format="YYYY-MM-DD"
								style="width: 100%"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="发货数量" prop="shipmentQuantity">
							{{ props.currentRow.shipmentQuantity ?? '---' }}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="运输方式" prop="transportMethod">
							<SelectInputApi
								componentType="dicts"
								v-model="formData.transportMethod"
								:disabled="true"
								:settings="{
									text: '运输方式',
									width: '220px',
									getTreeDataParams: 'transport_method',
								}"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<!-- 可编辑：店铺、仓库 -->
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
									:label="item.warehouseName"
									:value="item.warehouseCode"
								/>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<!-- 可编辑：渠道动态字段（GTIN/ShipmentID 等）+ 货件创建时间 -->
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

				<!-- 可编辑：箱唛、条码附件 -->
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="箱唛附件" prop="shippingMarkAttachment">
							<upload-file
								:limit="1"
								:fileSize="20"
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
								:fileSize="20"
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
				<!-- Amazon 渠道：透明计划标签 -->
				<el-row class="mb18" v-if="formData.platformChannelCode === 'Amazon'">
					<el-col :span="12">
						<el-form-item label="透明计划标签" prop="transparencyAttachment">
							<upload-file
								:limit="1"
								:fileSize="20"
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
				<!-- 可编辑：备注 -->
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
/**
 * 发货计划维护货件信息：表单校验、渠道动态字段、店铺/仓库与附件提交。
 * 接口：postPreservePackageInfo（deliveryPlan）；店铺/仓库/渠道配置接口与提货计划复用 collectionPlan API。
 */
import { ref, defineAsyncComponent } from 'vue';
import { useMessage, useMessageBox } from '/@/hooks/message';
import MrTextEllipsis from '/@/common/MrTextEllipsis/index.vue';
import {
	getConfigByPtChannelCode,
	getListByCondition,
	getPlatformList,
} from '/@/api/mcp/collectionPlan/index';
import { postPreservePackageInfo } from '/@/api/materialFlow/deliveryPlan/index';
import { useI18n } from 'vue-i18n';

const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);

const { t } = useI18n();

const props = defineProps({
	/** 弹窗标题，默认「维护货件信息」 */
	title: { type: String, default: '维护货件信息' },
	/** 当前发货计划列表行；`shipmentCountryConfigFlag` 由后端返回，与 `CollectionPlanVo` 约定一致 */
	currentRow: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['closeDialog']);

const loading = ref(false);
const formRef = ref();
/** 表单模型：字段名与提货侧 preserve 接口对齐（如 pickGoodsDate 对应计划发货时间） */
const formData = ref<any>({});

/** 校验规则：默认按配置国家全量；打开后由 `handleChangePlatformChannelCode` / `handleOpen` 按 `shipmentCountryConfigFlag` 覆盖为宽松规则 */
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

/** 货件创建时间不可选未来日期 */
const disabledFutureDate = (date: Date) => {
	return date.getTime() > Date.now();
};

/** 当前平台渠道下的动态表单项（标签、字段 key 来自 getConfigByPtChannelCode） */
const keyConfig = ref<{ key: string; value: { label: string } }[]>([]);
/** 平台店铺下拉数据 */
const listByCondition = ref<Record<string, unknown>[]>([]);
/** 平台仓库下拉数据 */
const platformList = ref<Record<string, unknown>[]>([]);

/** 按国家 + 平台渠道拉取平台仓库 */
const getPlatformWarehouse = async () => {
	try {
		const res = await getPlatformList({
			countryCode: formData.value?.countryCode,
			platformChannelCode: formData.value?.platformChannelCode,
		});
		if (res.code === 0) {
			platformList.value = (res.data as Record<string, unknown>[]) || [];
		}
	} catch (error: unknown) {
		const err = error as { msg?: string };
		useMessage().error(err.msg || '加载失败，请稍后重试');
	}
};

/** 按渠道、站点（国家）、部门匹配可选平台店铺 */
const matchStoreInfo = async () => {
	try {
		const res = await getListByCondition({
			platformChannelCode: formData.value?.platformChannelCode,
			siteCode: formData.value?.countryCode,
			// 2026年5月16日17:14:01 先去掉部门小组
			// deptId: (props.currentRow as { deptId?: string })?.deptId,
		});
		if (res.code === 0) {
			listByCondition.value = (res.data as Record<string, unknown>[]) || [];
		}
	} catch (error: unknown) {
		const err = error as { msg?: string };
		useMessage().error(err.msg || '加载失败，请稍后重试');
	}
};

/** 通知父级关闭弹窗（父级负责 v-model 与刷新列表） */
const handleClose = () => {
	emit('closeDialog');
};

/**
 * 按平台渠道拉取渠道货件配置，生成 keyConfig；校验规则随 `shipmentCountryConfigFlag` 在「全量」与「宽松三字段」间切换（与提货计划 preservePackageInfo-dialog 一致）。
 * 不在此重置 `formData`，避免与 `handleOpen` 回填顺序冲突。
 */
const handleChangePlatformChannelCode = async (value: string) => {
	if (!value) {
		return;
	}
	keyConfig.value = [];
	const res = await getConfigByPtChannelCode({ platformChannelCode: value });
	if (res.code === 0 && res.data) {
		const cfg = (res.data as { config?: Record<string, { label: string }> })
			.config;
		if (cfg) {
			keyConfig.value = Object.entries(cfg).map(([k, v]) => ({
				key: k,
				value: v,
			}));
		} else {
			keyConfig.value = [];
		}
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
		await new Promise((resolve) => setTimeout(resolve, 10));
		formRef.value?.clearValidate();
	} else {
		keyConfig.value = [];
		useMessage().warning((res as { msg?: string }).msg || '暂无数据');
	}
};

/**
 * 弹窗打开：先按渠道拉配置与规则，再用当前行回填表单并拉店铺/仓库下拉。
 */
const handleOpen = async () => {
	formData.value.skuCode = props.currentRow?.skuCode || ''; // SKU
	// 调用接口查询对应的渠道带出来的
	handleChangePlatformChannelCode(props.currentRow?.platformChannelCode || ''); // 触发平台渠道变更，加载 keyConfig
	// 回显数据;
	formData.value = {
		...props.currentRow,
		skuCode: props.currentRow?.skuCode || '', // SKU
		countryCode: props.currentRow?.countryCode || '', // 国家
		platformChannelCode: props.currentRow?.platformChannelCode || '', // 平台渠道
		mskuCode: props.currentRow?.mskuCode || '', // MSKU
		pickGoodsDate: props.currentRow?.planShipmentDate || '', // 计划发货时间
		transportMethod:
			props.currentRow?.transportMethod ||
			props.currentRow?.transportMethod ||
			'', // 运输方式
		storeId: props.currentRow?.storeId || '', // 平台店铺
		platformWarehouseCode: props.currentRow?.platformWarehouseCode || '', // 平台仓库
		shippingMarkAttachment: props.currentRow?.shippingMarkAttachment
			? [props.currentRow?.shippingMarkAttachment]
			: [], // 箱唛附件
		barcodeAttachment: props.currentRow?.barcodeAttachment
			? [props.currentRow?.barcodeAttachment]
			: [], // 条码附件
		transparencyAttachment: props.currentRow?.transparencyAttachment
			? [props.currentRow?.transparencyAttachment]
			: [], // 透明计划标签
		remark: props.currentRow?.remark || '',
		goodsCreateTime: props.currentRow?.goodsCreateTime || '',
	};
	// 匹配店铺
	await matchStoreInfo();
	// 匹配平台仓库
	await getPlatformWarehouse();
};

/** 校验通过后提交 preservePackageInfo */
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
		const rowId = Number(
			(props.currentRow as { id?: string | number }).id || 0
		);
		const payload: any = {
			...formData.value,
			// 物流凭证信息
			channelMessage,
			// 国家代码
			countryCode: String(formData.value.countryCode || ''),
			// 货件创建时间
			goodsCreateTime: String(formData.value.goodsCreateTime || ''),
			// 发货计划ID
			id: rowId,
			// 平台仓库编码
			platformWarehouseCode: String(formData.value.platformWarehouseCode || ''),
			// 备注（非必填）
			remark: String(formData.value.remark || ''),
			// 箱唛附件（upload-file 返回数组，这里取首个文件名）
			shippingMarkAttachment:
				(formData.value.shippingMarkAttachment || []).map((item: string) =>
					typeof item === 'string' && item?.includes?.('fileName=')
						? item.split('fileName=')[1]
						: item
				)[0] || '', // 箱唛附件
			barcodeAttachment:
				(formData.value.barcodeAttachment || []).map((item: string) =>
					typeof item === 'string' && item?.includes?.('fileName=')
						? item.split('fileName=')[1]
						: item
				)[0] || '', // 条码附件
			transparencyAttachment:
				formData.value.transparencyAttachment?.map((item: string) =>
					typeof item === 'string' && item?.includes?.('fileName=')
						? item.split('fileName=')[1]
						: item
				)[0] || '', // 透明计划标签
			// 平台店铺ID
			storeId: Number(formData.value.storeId || 0),
		};
		const res = await api(payload);
		if (res.code === 0) {
			useMessage().success('操作成功');
			handleClose();
		} else {
			useMessageBox().error(
				(res as { msg?: string }).msg || '操作失败，请稍后重试'
			);
		}
	} catch (error: unknown) {
		const err = error as { msg?: string };
		useMessage().error(err.msg || '操作失败，请稍后重试');
	} finally {
		loading.value = false;
	}
};
</script>

<style lang="scss" scoped>
/* 弹窗内容区滚动，避免小屏遮挡底部按钮 */
.dialog-container {
	padding: 0 20px;
	height: 60vh;
	overflow: auto;
}
/* 分区标题条样式，与提货计划维护货件弹窗一致 */
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
