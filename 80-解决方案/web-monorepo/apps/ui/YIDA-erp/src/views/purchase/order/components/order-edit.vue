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
			>
				<div class="section-title">
					<span class="section-bar"></span>基本信息
				</div>
				<el-row class="mb18">
					<el-col :span="8">
						<el-form-item label="采购单号" prop="purchaseUserId">
							<el-input v-model="formData.purchaseNo" disabled />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="供应商名称" prop="supplierNo">
							<SelectInputApi
								componentType="qianyiSupplier"
								v-model="formData.supplierNo"
								:settings="{
									getTreeData: getSupplierBySkuCode,
									getTreeDataParams: skuCodeArray,
								}"
								placeholder="请选择"
								style="width: 100%"
								prefixKey=""
								:disabled="props.visibleType === 'view'"
							/>
							<!-- <el-select
								v-model="formData.supplierNo"
								filterable
								placeholder="请选择供应商"
								
							>
								<el-option
									v-for="item in props.dictMap.spInfoList"
									:key="item.supplierNo"
									:label="item.name"
									:value="item.supplierNo"
								/>
							</el-select> -->
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="法人主体" prop="legalPersonId">
							<SelectInputApi
								componentType="legalEntity"
								v-model="formData.legalPersonId"
								placeholder="请选择"
								style="width: 100%"
								:disabled="props.visibleType === 'view'"
							/>
							<!-- <el-select
								v-model="formData.legalPersonId"
								placeholder="请选择法人主体"
								:disabled="props.visibleType === 'view'"
							>
								<el-option
									v-for="item in props.dictMap.entityList"
									:key="item.id"
									:label="item.name"
									:value="item.id"
								/>
							</el-select> -->
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="8">
						<el-form-item label="我方采购员" prop="purchaseUserId">
							<SelectInputApi
								componentType="userList"
								v-model="formData.purchaseUserId"
								placeholder="请选择"
								:disabled="props.visibleType === 'view'"
								style="width: 100%"
								:settings="{
									getTreeDataParams: {
										postCodeList: [
											'PURCHASING_DIRECTOR',
											'PURCHASING_MANAGER',
											'PROCUREMENT_MANAGER',
											'PURCHASING_OFFICER',
										],
									},
								}"
							/>
							<!-- <el-select
								v-model="formData.purchaseUserId"
								placeholder="请选择采购员"
								:disabled="props.visibleType === 'view'"
							>
								<el-option
									v-for="item in props.dictMap.purchaseUserId"
									:key="item.userId"
									:label="item.name"
									:value="item.userId"
								/>
							</el-select> -->
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="主计划" prop="planUserId">
							<SelectInputApi
								componentType="userList"
								v-model="formData.planUserId"
								placeholder="请选择"
								style="width: 100%"
								:settings="{
									getTreeDataParams: {
										postCodeList: ['PURCHASING_PLAN'],
									},
								}"
								:disabled="props.visibleType === 'view'"
							/>
							<!-- <el-select
								v-model="formData.planUserId"
								placeholder="请选择主计划"
								:disabled="props.visibleType === 'view'"
								filterable
								clearable
							>
								<el-option
									v-for="item in props.dictMap.planUserId"
									:key="item.userId"
									:label="item.name"
									:value="item.userId"
								/>
							</el-select> -->
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item label="备注" prop="remark">
							<el-input
								v-model="formData.remark"
								maxlength="1000"
								show-word-limit
								placeholder="请输入备注"
								type="textarea"
								:autosize="{ minRows: 2, maxRows: 2 }"
								:disabled="props.visibleType === 'view'"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item label="附件" prop="file">
							<upload-file
								:limit="10"
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
								v-model="formData.file"
								:isShowTip="true"
								:uploadFileUrl="'/admin/sys-file/upload'"
								type="simple"
								:data="{}"
								:dir="''"
								:autoUpload="true"
								:disabled="props.visibleType === 'view'"
								@error="() => {}"
								@remove="() => {}"
								@preview="() => {}"
								@exceed="() => {}"
								@success="() => {}"
							/> </el-form-item></el-col
				></el-row>
				<div class="section-title">
					<span class="section-bar"></span>产品明细
					<span :style="{ marginLeft: '8px', color: '#dc3075' }"
						>币种:{{ props?.currentRow?.currencyText }}</span
					>
				</div>
				<el-row class="mb18">
					<el-col :span="24">
						<el-table
							:data="state.dataList"
							style="width: 100%"
							v-loading="state.loading"
							border
							ref="tableRef"
							row-key="id"
							:cell-style="tableStyle.cellStyle"
							:header-cell-style="tableStyle.headerCellStyle"
							native-scrollbar
						>
							<el-table-column
								:label="t('需求单号')"
								prop="demandNo"
								width="150"
							>
								<template #default="{ row }">
									{{ row.demandNo ? row.demandNo : '---' }}
								</template>
							</el-table-column>
							<el-table-column
								prop="skuCode"
								:label="t('SKU/产品名称')"
								show-overflow-tooltip
								width="200"
							>
								<template #default="{ row }">
									<div
										style="
											display: flex;
											flex-direction: column;
											justify-content: center;
											align-items: flex-start;
											width: 100%;
										"
									>
										<div
											style="
												max-width: 100%;
												overflow: hidden;
												white-space: nowrap;
												text-overflow: ellipsis;
											"
										>
											{{ row.skuCode }}
										</div>
										<div
											style="
												max-width: 100%;
												overflow: hidden;
												white-space: nowrap;
												text-overflow: ellipsis;
											"
										>
											{{ row.skuName }}
										</div>
									</div>
								</template>
							</el-table-column>
							<el-table-column
								prop="planNum"
								:label="t('计划数量')"
								show-overflow-tooltip
								width="100"
							>
								<template #default="{ row }">
									{{ row.planNum || '---' }}
								</template>
							</el-table-column>
							<el-table-column
								prop="expectedPickupDate"
								:label="t('期望提货时间')"
								show-overflow-tooltip
								width="150"
							>
								<template #default="{ row }">
									{{ row.expectedPickupDate || '---' }}
								</template>
							</el-table-column>
							<el-table-column
								v-if="props.visibleType !== 'edit'"
								prop="purchaseNum"
							>
								<template #header>
									<span
										:style="{
											color: '#f78c8c',
											marginRight: '3px',
										}"
										>*
									</span>
									{{ $t('采购量') }}
								</template>
								<template #default="{ row }">
									<el-input
										v-model="row.purchaseNum"
										placeholder="请输入"
										style="width: 100%"
										type="number"
										:disabled="true"
									/>
								</template>
							</el-table-column>
							<el-table-column prop="unitPriceWithoutTax">
								<template #header>
									<span
										:style="{
											color: '#f78c8c',
											marginRight: '3px',
										}"
										>*
									</span>
									{{ $t('不含税单价') }}
								</template>
								<template #default="{ row }">
									<!-- 含税单价=不含税单价*（1+实际税率） -->
									<el-input
										v-model="row.unitPriceWithoutTax"
										placeholder="请输入"
										style="width: 100%"
										type="number"
										@change="
											() => {
												if (Number(row.unitPriceWithoutTax) < 0) {
													row.unitPriceWithoutTax = 0;
												}
												row.unitPriceIncludingTax = Number(
													(
														Number(row.unitPriceWithoutTax) *
														(1 + Number(row.effectiveTaxRate) / 100)
													).toFixed(2)
												);
												row.priceWithoutTax = Number(
													(
														Number(row.unitPriceWithoutTax) *
														Number(row.planNum)
													).toFixed(2)
												);
												row.priceIncludingTax = Number(
													(
														Number(row.unitPriceIncludingTax) *
														Number(row.planNum)
													).toFixed(2)
												);
											}
										"
										:disabled="props.visibleType === 'view'"
									/>
								</template>
							</el-table-column>
							<el-table-column prop="priceWithoutTax">
								<template #header>
									<span
										:style="{
											color: '#f78c8c',
											marginRight: '3px',
										}"
										>*
									</span>
									{{ $t('不含税货值') }}
								</template>
								<template #default="{ row }">
									<el-input
										v-model="row.priceWithoutTax"
										placeholder="请输入"
										style="width: 100%"
										type="number"
										:disabled="true"
									/>
								</template>
							</el-table-column>
							<el-table-column prop="effectiveTaxRate">
								<template #header>
									<span
										:style="{
											color: '#f78c8c',
											marginRight: '3px',
										}"
										>*
									</span>
									{{ $t('实际税率') }}
								</template>
								<template #default="{ row }">
									<el-input
										v-model="row.effectiveTaxRate"
										placeholder="请输入"
										style="width: 100%"
										type="number"
										:disabled="true"
									>
										<template #suffix>%</template></el-input
									>
								</template>
							</el-table-column>
							<el-table-column prop="unitPriceIncludingTax">
								<template #header>
									<span
										:style="{
											color: '#f78c8c',
											marginRight: '3px',
										}"
										>*
									</span>
									{{ $t('含税单价') }}
								</template>
								<template #default="{ row }">
									<!-- 自动计算不含税单价 -->
									<!-- 不含税单价=含税单价/（1+实际税率） -->
									<el-input
										v-model="row.unitPriceIncludingTax"
										placeholder="请输入"
										style="width: 100%"
										type="number"
										@change="
											() => {
												if (Number(row.unitPriceIncludingTax) < 0) {
													row.unitPriceIncludingTax = 0;
												}
												row.unitPriceWithoutTax = Number(
													(
														Number(row.unitPriceIncludingTax) /
														(1 + Number(row.effectiveTaxRate) / 100)
													).toFixed(2)
												);
												row.priceWithoutTax = Number(
													(
														Number(row.unitPriceWithoutTax) *
														Number(row.planNum)
													).toFixed(2)
												);
												row.priceIncludingTax = Number(
													(
														Number(row.unitPriceIncludingTax) *
														Number(row.planNum)
													).toFixed(2)
												);
											}
										"
										:disabled="props.visibleType === 'view'"
									/>
								</template>
							</el-table-column>
							<el-table-column prop="priceIncludingTax">
								<template #header>
									<span
										:style="{
											color: '#f78c8c',
											marginRight: '3px',
										}"
										>*
									</span>
									{{ $t('含税货值') }}
								</template>
								<template #default="{ row }">
									<el-input
										v-model="row.priceIncludingTax"
										placeholder="请输入"
										style="width: 100%"
										type="number"
										:disabled="true"
									/>
								</template>
							</el-table-column>
						</el-table>
					</el-col>
				</el-row>
				<!-- todo -->
				<el-row class="mb18">
					<el-col :span="6">
						<el-form-item label="调整金额" prop="priceAdjustAmount">
							<el-input
								v-model.number="formData.priceAdjustAmount"
								:min="0"
								type="number"
								@change="
									() => {
										if (formData.priceAdjustAmount < 0) {
											formData.priceAdjustAmount = 0;
										}
									}
								"
								:disabled="props.visibleType === 'view'"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="备注" prop="adjustRemark">
							<el-input
								v-model="formData.adjustRemark"
								:disabled="props.visibleType === 'view'"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="6">
						<el-form-item label="返利折扣" prop="rebateAmount">
							<el-input
								v-model.number="formData.rebateAmount"
								:min="0"
								type="number"
								@change="
									() => {
										if (formData.rebateAmount < 0) {
											formData.rebateAmount = 0;
										}
									}
								"
								:disabled="props.visibleType === 'view'"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="备注" prop="rebateRemark">
							<el-input
								v-model="formData.rebateRemark"
								:disabled="props.visibleType === 'view'"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-form-item label="订单总金额" prop="">
						<div class="flex-span">
							<div>{{ orderTotalNumber || '--' }}</div>
							<div class="red">
								订单总金额=需求单含税货值汇总-调整金额-返利折扣
							</div>
						</div>
					</el-form-item>
				</el-row>
			</el-form>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">{{
					$t('common.cancelButtonText')
				}}</el-button>
				<el-button
					type="primary"
					@click="onSubmit"
					:disabled="loading"
					v-if="props.visibleType === 'edit'"
					>{{ $t('保存') }}</el-button
				>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useI18n } from 'vue-i18n';
import { postOrderSave, postOrderUpdate } from '/@/api/purchase/order';
import { useMessage } from '/@/hooks/message';
import { getSupplierBySkuCode } from '/@/api/purchase/supplierSku';

const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);

const { t } = useI18n();
const props = defineProps({
	title: { type: String, default: '添加仓库' },
	currentRow: { type: Object, default: () => ({}) }, // 当前编辑的数据
	visibleType: { type: String, default: '' }, // 弹窗类型
	dictMap: { type: Object, default: () => ({}) }, // 字典数据
});
const emit = defineEmits(['closeDialog', 'save']);

// form表单
const formRef = ref();
const formData = ref<any>({});

const rules = {
	purchaseUserId: [
		{ required: true, message: '请选择采购员', trigger: 'change' },
	],
	supplierNo: [{ required: true, message: '请选择供应商', trigger: 'change' }],
	legalPersonId: [
		{ required: true, message: '请选择法人主体', trigger: 'change' },
	],
};

// 表格数据
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	// pageList: getMaterialList,
	descs: [''],
	isPage: false,
});

const orderTotalNumber = computed(() => {
	let total = 0;
	state.dataList?.forEach((item) => {
		total += Number(item.priceIncludingTax || 0);
	});
	total -= Number(formData.value.priceAdjustAmount || 0);
	total -= Number(formData.value.rebateAmount || 0);
	return total.toFixed(2);
});

const skuCodeArray = computed(() => {
	return state.dataList?.map((item) => item.skuCode) ?? [];
});
//  table hook
const tableRef = ref<any>(null);
const { tableStyle, setTableData } = useTable(state, tableRef);
onMounted(() => {});
// tableRef

// 打开弹窗
const handleOpen = async () => {
	if (props.visibleType === 'edit' || props.visibleType === 'view') {
		formData.value = {
			purchaseNo: props.currentRow.purchaseNo || '',
			purchaseUserId: props.currentRow.purchaseUserId || '',
			supplierNo: props.currentRow.supplierNo || '',
			legalPersonId: props.currentRow.legalPersonId || '',
			planUserId: props.currentRow.planUserId || '',
			remark: props.currentRow.remark || '',
			file: props.currentRow.file || [],
			priceAdjustAmount: props.currentRow.priceAdjustAmount || null,
			adjustRemark: props.currentRow.adjustRemark || '',
			rebateAmount: props.currentRow.rebateAmount || null,
			rebateRemark: props.currentRow.rebateRemark || '',
		};
		// 编辑的时候
	} else if (props.visibleType === 'add') {
		// 初始化表格数据
		formData.value.supplierNo = props.currentRow?.supplierNo || '';
	}
	setTableData(
		props.currentRow.purchaseOrderSkuList
			? [...props.currentRow.purchaseOrderSkuList]
			: []
	);
};

// 关闭弹窗
const handleClose = () => {
	emit('closeDialog');
};

const loading = ref(false);
// 提交 不可编辑
const onSubmit = async () => {
	const valid = await formRef.value.validate();
	if (!valid) {
		useMessage().warning('请填写必填项');
		return;
	}
	loading.value = true;
	try {
		const api = props.visibleType === 'edit' ? postOrderUpdate : postOrderSave;
		const res = await api({
			...formData.value,
			purchaseOrderSkuList: state.dataList,
			currency: props.currentRow.currency,
			id: props.visibleType === 'edit' ? props.currentRow.id : '',
		});
		if (res.code === 0) {
			useMessage().success('操作成功');
			// 清空表格数据
			setTableData([]);
			handleClose();
		}
	} catch (error: any) {
		useMessage().error(error.msg || '操作失败，请稍后重试');
	} finally {
		loading.value = false;
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
.flex-span {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
}
.red {
	color: red;
}
</style>
