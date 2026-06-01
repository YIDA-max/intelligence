<template>
	<confirm-dialog
		ref="dialogRef"
		title="二程调拨附件上传"
		:show-icon="true"
		icon-type="info"
		cancel-button-text="取消"
		confirm-button-text="确认提交"
		confirm-button-type="primary"
		width="90%"
		@cancel="handleCancel"
		@confirm="handleConfirm"
		@closed="handleClosed"
		@opened="handleOpened"
	>
		<div v-loading="loading">
			<!-- 基本信息 -->
			<el-form
				ref="formRef"
				:model="formData"
				:rules="formRules"
				label-width="120px"
				:inline="false"
			>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="调拨单号">
							<span>{{ props.currentRow?.secondMileNo || '---' }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="中转仓">
							<span>{{ basicInfo.takeOutWarehouse || '---' }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="调入仓" prop="takeInWarehouse">
							<SelectInputApi
								v-model="formData.takeInWarehouse"
								componentType="warehouseInfo"
								placeholder="请选择调入仓"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item
							label="货代方式"
							prop="freightForwarderListByCondition"
						>
							<SelectInputApi
								v-model="formData.freightForwarderListByCondition"
								componentType="dicts"
								:settings="{ getTreeDataParams: 'forwarder_type' }"
								placeholder="请选择货代方式"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="运输方式" prop="transportMethod">
							<SelectInputApi
								v-model="formData.transportMethod"
								componentType="dicts"
								:settings="{ getTreeDataParams: 'transport_method' }"
								placeholder="请选择运输方式"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="预计发货日期" prop="planShipmentDate">
							<el-date-picker
								v-model="formData.planShipmentDate"
								type="date"
								placeholder="请选择日期"
								value-format="YYYY-MM-DD"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="调拨备注">
							<el-input
								v-model="formData.remark"
								type="textarea"
								:rows="2"
								placeholder="请输入"
							/>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>

			<!-- 明细表格 -->
			<el-table
				class="mt-4"
				:data="detailList"
				border
				max-height="320"
				native-scrollbar
			>
				<el-table-column label="平台店铺" width="220" show-overflow-tooltip>
					<template #default="{ row }">
						<el-select-v2
							v-model="row.storeId"
							:options="storeList"
							placeholder="请选择店铺"
							clearable
							filterable
							style="width: 100%"
						/>
					</template>
				</el-table-column>
				<el-table-column
					label="平台入库单"
					prop="shipmentId"
					width="180"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						<el-input v-model="row.shipmentId" placeholder="请输入" clearable />
					</template>
				</el-table-column>
				<el-table-column
					label="条码"
					prop="barcode"
					width="180"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						<el-input
							v-model="row.editBarcode"
							placeholder="请输入"
							clearable
						/>
					</template>
				</el-table-column>
				<el-table-column
					label="送仓码/关联单号"
					prop="referenceId"
					width="180"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						<el-input
							v-model="row.referenceId"
							placeholder="请输入"
							clearable
						/>
					</template>
				</el-table-column>
				<el-table-column
					label="附件"
					width="300"
					:show-overflow-tooltip="false"
				>
					<template #default="{ row }">
						<div v-if="row.shippingMarkAttachments?.length">
							{{
								row.shippingMarkAttachments?.length
									? '箱唛:' + row.shippingMarkAttachments + ' '
									: ''
							}}
						</div>
						<div v-if="row.barcodeAttachments?.length">
							{{
								row.barcodeAttachments?.length
									? '条码:' + row.barcodeAttachments + ' '
									: ''
							}}
						</div>
						<div v-if="row.transparencyAttachments?.length">
							{{
								row.transparencyAttachments?.length
									? '透明码:' + row.transparencyAttachments + ' '
									: ''
							}}
						</div>
						<div v-if="row.otherAttachments?.length">
							{{
								row.otherAttachments?.length
									? '其他:' + row.otherAttachments + ' '
									: ''
							}}
						</div>
						<el-link type="primary" @click="openUpFile(row)">上传标签</el-link>
					</template>
				</el-table-column>
				<el-table-column label="部门&小组" width="160" show-overflow-tooltip>
					<template #default="{ row }">
						{{ row.departmentName || '---' }} & {{ row.deptName || '---' }}
					</template>
				</el-table-column>
			</el-table>
		</div>

		<!-- 附件上传弹窗 -->
		<UpFile
			ref="upFileRef"
			:show-icon="true"
			icon-type="info"
			:currentInType="currentInType"
			:currentRow="uploadTargetRow"
			cancel-button-text="取消"
			confirm-button-text="确认"
			confirm-button-type="primary"
			width="500px"
			@confirm="confirmUpFile"
			@cancel="upFileRef?.hide()"
		/>
	</confirm-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, defineAsyncComponent, onMounted } from 'vue';
import ConfirmDialog from '/@/components/ConfirmDialog/index.vue';
import { useMessage } from '/@/hooks/message';
import {
	getSecondMileDetail,
	postSecondMileUpdate,
} from '/@/api/materialFlow/secondMileLogistics/index';
import { getListByCondition as getListByConditionStore } from '/@/api/mcp/collectionPlan/index';

const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);

const UpFile = defineAsyncComponent(
	() =>
		import(
			'/@/views/materialFlow/firstMileLogistics/components/components/upFile.vue'
		)
);

const props = defineProps({
	currentRow: {
		type: Object,
		default: () => ({}),
	},
});

const emit = defineEmits(['confirm', 'cancel', 'closed', 'refresh']);

const dialogRef = ref<InstanceType<typeof ConfirmDialog> | null>(null);
const upFileRef = ref<any>(null);
const formRef = ref<any>(null);
const loading = ref(false);

const basicInfo = reactive<any>({});
const detailList = ref<any[]>([]);
const storeList = ref<any[]>([]);

const loadStoreList = async () => {
	try {
		const res = await getListByConditionStore();
		storeList.value = (res.data || []).map((item: any) => ({
			...item,
			label: `[${item.platformChannelCode}]${item.storeName}:${item.siteCode}`,
			value: item.id,
		}));
	} catch {
		storeList.value = [];
	}
};

onMounted(loadStoreList);
const formData = reactive<any>({
	takeInWarehouse: '',
	freightForwarderListByCondition: '',
	transportMethod: '',
	planShipmentDate: '',
	remark: '',
});

const formRules = {
	takeInWarehouse: [
		{ required: true, message: '请选择调入仓', trigger: 'change' },
	],
	freightForwarderListByCondition: [
		{ required: true, message: '请选择货代方式', trigger: 'change' },
	],
	transportMethod: [
		{ required: true, message: '请选择运输方式', trigger: 'change' },
	],
	planShipmentDate: [
		{ required: true, message: '请选择预计发货日期', trigger: 'change' },
	],
};

// 当前正在上传的行
const uploadTargetRow = ref<any>(null);

const openUpFile = (row: any) => {
	uploadTargetRow.value = row;
	upFileRef.value?.show();
};
// 当前选择上传附件的行的数据
const currentInType = ref<'dropshipping' | 'enter_platform_warehouse'>(
	'enter_platform_warehouse'
);
const confirmUpFile = (e: any) => {
	if (!uploadTargetRow.value) return;
	uploadTargetRow.value.shippingMarkAttachments =
		e.shippingMarkAttachments || [];
	uploadTargetRow.value.barcodeAttachments = e.barcodeAttachments || [];
	uploadTargetRow.value.transparencyAttachments =
		e.transparencyAttachments || [];
	uploadTargetRow.value.otherAttachments = e.otherAttachments || [];
	upFileRef.value?.hide();
	uploadTargetRow.value = null;
};

const handleOpened = async () => {
	await nextTick();
	await fetchDetail();
};

const fetchDetail = async () => {
	if (!props.currentRow?.secondMileNo) return;
	loading.value = true;
	try {
		const res = await getSecondMileDetail(props.currentRow.secondMileNo);
		if (res.code === 0 && res.data) {
			Object.assign(basicInfo, res.data.basicInfo || {});
			// 初始化每行的可编辑字段
			detailList.value = (res.data.detailList || []).map((item: any) => ({
				...item,
				storeId: item.storeId ?? null,
				shipmentId: item.shipmentId ?? '',
				editBarcode: item.barcode ?? '',
				referenceId: item.referenceId ?? '',
				shippingMarkAttachments: item.shippingMarkAttachments || [],
				barcodeAttachments: item.barcodeAttachments || [],
				transparencyAttachments: item.transparencyAttachments || [],
				otherAttachments: item.otherAttachments || [],
			}));
			// 预填表单
			formData.takeInWarehouse = basicInfo.takeInWarehouse || '';
			formData.inWarehouseType = basicInfo.inWarehouseType || '';
			formData.freightForwarderListByCondition =
				basicInfo.freightForwarderListByCondition || '';
			formData.transportMethod = basicInfo.transportMethod || '';
			formData.planShipmentDate = basicInfo.planShipmentDate || '';
			formData.remark = basicInfo.remark || '';
			if (formData.inWarehouseType) {
				if (formData.inWarehouseType === '0') {
					// 自营仓，默认平台仓
					currentInType.value = 'enter_platform_warehouse';
				} else if (formData.inWarehouseType === '1') {
					// 一件代发仓,也就三方仓
					currentInType.value = 'dropshipping';
				} else if (formData.inWarehouseType === '2') {
					// 平台仓
					currentInType.value = 'enter_platform_warehouse';
				}
			}
		}
	} catch (e: any) {
		useMessage().error(e?.msg || '获取详情失败');
	} finally {
		loading.value = false;
	}
};

const handleConfirm = () => {
	formRef.value?.validate(async (valid: boolean) => {
		if (!valid) return;
		loading.value = true;
		try {
			const params = {
				...formData,
				id: props.currentRow?.id,
				secondMileNo: props.currentRow?.secondMileNo,
				detailList: detailList.value.map((row: any) => ({
					id: row.id,
					storeId: row.storeId,
					shipmentId: row.shipmentId,
					barcode: row.editBarcode,
					referenceId: row.referenceId,
					shippingMarkAttachments: row.shippingMarkAttachments,
					barcodeAttachments: row.barcodeAttachments,
					transparencyAttachments: row.transparencyAttachments,
					otherAttachments: row.otherAttachments,
				})),
			};
			const res = await postSecondMileUpdate(params);
			if (res.code === 0) {
				useMessage().success('提交成功');
				dialogRef.value?.hide();
				emit('confirm');
			}
		} finally {
			loading.value = false;
		}
	});
};

const handleCancel = () => {
	dialogRef.value?.hide();
	emit('cancel');
};

const handleClosed = () => {
	formRef.value?.resetFields();
	emit('closed');
};

const show = () => {
	dialogRef.value?.show();
};
const hide = () => {
	dialogRef.value?.hide();
};

defineExpose({ show, hide });
</script>

<style scoped>
.attachment-link {
	max-width: 100px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	display: inline-block;
	vertical-align: bottom;
}
.el-row {
	padding-bottom: 16px;
}
</style>
