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
						<el-form-item label="我方采购员" prop="purchaseUserId">
							<el-select
								v-model="formData.purchaseUserId"
								placeholder="请选择采购员"
							>
								<el-option
									v-for="item in props.dictMap.purchaseUserId"
									:key="item.userId"
									:label="item.name"
									:value="item.userId"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="主计划" prop="planUserId">
							<el-select
								v-model="formData.planUserId"
								placeholder="请选择主计划"
								filterable
								clearable
							>
								<el-option
									v-for="item in props.dictMap.planUserId"
									:key="item.userId"
									:label="item.name"
									:value="item.userId"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="供应商名称" prop="supplierNo">
							<el-select
								v-model="formData.supplierNo"
								placeholder="请选择供应商"
							>
								<el-option
									v-for="item in props.dictMap.spInfoList"
									:key="item.supplierNo"
									:label="item.name"
									:value="item.supplierNo"
								/>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="8">
						<el-form-item label="法人主体" prop="legalPersonId">
							<el-select
								v-model="formData.legalPersonId"
								placeholder="请选择法人主体"
							>
								<el-option
									v-for="item in props.dictMap.entityList"
									:key="item.id"
									:label="item.name"
									:value="item.id"
								/>
							</el-select>
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
								:disabled="false"
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
							<!-- <el-table-column prop="purchaseNum">
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
									<el-input v-model="row.purchaseNum" placeholder="请输入" style="width: 100%" type="number" :disabled="true" />
								</template>
							</el-table-column> -->
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
									<el-input
										v-model="row.unitPriceWithoutTax"
										placeholder="请输入"
										style="width: 100%"
										type="number"
										:disabled="true"
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
									<el-input
										v-model="row.unitPriceIncludingTax"
										placeholder="请输入"
										style="width: 100%"
										type="number"
										:disabled="true"
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
			</el-form>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">{{
					$t('common.cancelButtonText')
				}}</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">{{
					$t('保存')
				}}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMessage } from '/@/hooks/message';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { postOrderSave, postOrderUpdate } from '/@/api/purchase/order';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props = defineProps({
	title: { type: String, default: '添加仓库' },
	currentRow: { type: Object, default: () => ({}) }, // 当前编辑的数据
	visibleType: { type: String, default: '' }, // 弹窗类型
	dictMap: { type: Object, default: () => ({}) }, // 字典数据
});
const emit = defineEmits(['closeDialog', 'save']);

// 加载
const loading = ref(false);

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
// tableRef
const tableRef = ref<any>(null);
//  table hook
const { tableStyle, setTableData } = useTable(state, tableRef);
onMounted(() => {});

// 打开弹窗
const handleOpen = async () => {
	if (props.visibleType === 'edit') {
		// 编辑的时候
	} else if (props.visibleType === 'add') {
		// 初始化表格数据
		setTableData(
			props.currentRow.purchaseOrderSkuList
				? [...props.currentRow.purchaseOrderSkuList]
				: []
		);
		// 设置默认值
		formData.value.purchaseUserId = props.currentRow?.purchaseUserId || '';
		formData.value.legalPersonId = props.currentRow?.legalPersonId || '';
		formData.value.file = props.currentRow?.file || [];
		formData.value.remark = props.currentRow?.remark || '';
		formData.value.supplierNo = props.currentRow?.supplierNo || '';
		// 等待100毫秒，确保UI更新
		await new Promise((resolve) => setTimeout(resolve, 10));
		// 清空所有的校验
		formRef.value.clearValidate();
	}
};

// 关闭弹窗
const handleClose = () => {
	emit('closeDialog');
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
</style>
