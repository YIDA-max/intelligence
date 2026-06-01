<template>
	<el-dialog
		v-model="visible"
		title="退货申请"
		width="80%"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		@close="handleClose"
	>
		<el-form
			ref="formRef"
			:model="formData"
			:rules="formRules"
			label-position="left"
			label-width="100px"
			v-loading="loading"
		>
			<!-- 基础信息 -->
			<div class="mb-6">
				<h3 class="mb-4 text-lg text-gray-800">基础信息</h3>
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="采购订单：" prop="purchaseNo">
							<el-text class="mx-1">{{ formData.purchaseNo }}</el-text>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="供应商：" prop="supplierName">
							<el-text class="mx-1">{{ formData.supplierName }}</el-text>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="法人主体：" prop="legalPersonName">
							<el-text class="mx-1">{{ formData.legalPersonName }}</el-text>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="采购员：" prop="purchaseUserName">
							<el-text class="mx-1">{{ formData.purchaseUserName }}</el-text>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="备注：" prop="remark">
							<el-input
								v-model="formData.remark"
								type="textarea"
								:rows="3"
								placeholder="请输入备注"
								maxlength="1000"
							/>
						</el-form-item>
					</el-col>
				</el-row>
			</div>

			<!-- 退货明细 -->
			<div class="mb-6">
				<div class="flex items-center mb-4">
					<h3 class="text-lg text-gray-800">退货明细</h3>
					<el-button
						class="text-blue-600"
						size="small"
						@click="addReturnItem"
						:icon="Plus"
					>
					</el-button>
				</div>

				<el-table
					:data="formData.returnItems"
					border
					style="width: 100%"
					class="mb-2"
					native-scrollbar
				>
					<el-table-column
						label="SKU/产品名称"
						width="200"
						show-overflow-tooltip
					>
						<template #default="{ row }">
							<div class="flex flex-col">
								<span class="text-blue-600">
									{{ row.skuCode || '-' }}
								</span>
								<span class="text-sm text-gray-500">{{
									row.skuName || ''
								}}</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="采购数量" width="140" align="center">
						<template #default="{ row }">
							{{ row.purchaseNum }}
						</template>
					</el-table-column>
					<el-table-column label="可退货数量" width="140" align="center">
						<template #default="{ row }">
							{{ row.returnableQuantity }}
						</template>
					</el-table-column>
					<el-table-column width="220" align="center">
						<template #header>
							<span
								:style="{
									color: '#f78c8c',
									marginRight: '3px',
								}"
								>*
							</span>
							{{ $t('本次退货数量') }}
						</template>
						<template #default="{ row }">
							<el-input-number
								v-model="row.returnNum"
								:min="0"
								:max="row.returnableQuantity"
								:precision="0"
								controls-position="right"
								style="width: 100%"
								placeholder="请输入"
							/>
						</template>
					</el-table-column>
					<el-table-column label="备注" width="220">
						<template #default="{ row }">
							<el-input
								v-model="row.remark"
								placeholder="请输入"
								maxlength="1000"
							/>
						</template>
					</el-table-column>
					<el-table-column label="含税单价" width="140" align="center">
						<template #default="{ row }">
							¥{{ row.unitPriceIncludingTax?.toFixed(2) }}
						</template>
					</el-table-column>
					<el-table-column
						label="本次退货货值"
						prop="priceIncludingTax"
						width="140"
						align="center"
					>
						<template #default="{ row }">
							¥{{ getCurrentPrice(row) }}
						</template>
					</el-table-column>
					<el-table-column label="需求单号" width="170" show-overflow-tooltip>
						<template #default="{ row }">
							{{ row.demandNo || '---' }}
						</template>
					</el-table-column>

					<el-table-column :label="$t('common.action')" fixed="right">
						<template #default="{ $index: index }">
							<el-button
								:icon="Minus"
								@click="removeReturnItem(index)"
								:disabled="formData.returnItems.length <= 1"
							/>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</el-form>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">取消</el-button>
				<el-button type="primary" @click="handleSubmit" :loading="submitting">
					保存
				</el-button>
			</span>
		</template>

		<!-- SKU选择弹窗 -->
		<SkuSelectDialog
			ref="skuSelectDialogRef"
			:selected-order="props.selectedOrder"
			@confirm="handleSkuSelected"
			@close="handleSkuDialogClose"
		/>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useMessage } from '/@/hooks/message';
import { Plus, Minus } from '@element-plus/icons-vue';
import { saveReturn } from '/@/api/purchase/return/index';
import SkuSelectDialog from './SkuSelectDialog.vue';

// 定义组件属性
const props = defineProps<{
	selectedOrder: any | null;
}>();

// 定义组件事件
const emit = defineEmits<{
	submit: [data: any];
	close: [];
}>();

const visible = ref(false);
const loading = ref(false);
const submitting = ref(false);
const showPreview = ref(false);
const currentEditingRow = ref<any>(null);

// 组件引用
const formRef = ref();
const skuSelectDialogRef = ref();

// 表单数据
const formData = reactive({
	purchaseNo: '',
	supplierName: '',
	purchaseUserName: '',
	legalPersonName: '',
	remark: '',
	returnItems: [] as any[],
});

// 表单验证规则
const formRules = {
	remark: [{ required: false, message: '请输入备注', trigger: 'blur' }],
};

// 计算本次退货货值
const getCurrentPrice = (row: any) => {
	return ((row.returnNum || 0) * (row.unitPriceIncludingTax || 0)).toFixed(2);
};

// 监听弹窗显示状态
watch(
	() => visible.value,
	(newVal) => {
		if (newVal) {
			initFormData();
		}
	}
);

// 初始化表单数据
const initFormData = async () => {
	if (!props.selectedOrder) return;

	formData.returnItems = [];
	// 获取基础信息
	formData.purchaseNo = props.selectedOrder.purchaseNo || '';
	formData.supplierName = props.selectedOrder.supplierName || '';
	formData.purchaseUserName = props.selectedOrder.purchaseUserName || '';
	formData.legalPersonName = props.selectedOrder.legalPersonName || '';
	formData.remark = props.selectedOrder.remark || '';
};

// 添加退货明细行
const addReturnItem = () => {
	// 直接打开SKU选择弹窗，让用户选择SKU
	skuSelectDialogRef.value?.show();
};

// 删除退货明细行
const removeReturnItem = (index: number) => {
	if (formData.returnItems.length <= 1) {
		useMessage().warning('至少需要保留一条退货明细');
		return;
	}
	formData.returnItems.splice(index, 1);
};

// 处理SKU选择确认
const handleSkuSelected = (selectedSkus: any[]) => {
	if (!selectedSkus || selectedSkus.length === 0) return;
	// 新增模式：遍历选中的SKU，添加到退货明细列表
	selectedSkus.forEach((selectedSku) => {
		// 检查是否已包含该SKU，避免重复添加
		const isDuplicate = formData.returnItems.some(
			(item) => item.demandNo === selectedSku.demandNo
		);
		if (!isDuplicate) {
			// 新增SKU到退货明细列表
			const newItem = {
				skuCode: selectedSku.skuCode,
				skuName: selectedSku.skuName,
				imgUrl: selectedSku.imgUrl,
				purchaseNum: selectedSku.purchaseNum,
				returnableNum: selectedSku.returnableNum,
				returnNum: selectedSku.returnableNum > 0 ? 1 : 0,
				unitPriceIncludingTax: selectedSku.unitPriceIncludingTax,
				demandNo: selectedSku.demandNo,
				itemRemark: '',
				returnableQuantity: selectedSku.returnableQuantity,
			};
			formData.returnItems.push(newItem);
		}
	});

	currentEditingRow.value = null;
};

// 处理SKU弹窗关闭
const handleSkuDialogClose = () => {
	currentEditingRow.value = null;
};
// 关闭弹窗
const handleClose = () => {
	emit('close');
	hide();
};

// 显示弹窗
const show = () => {
	visible.value = true;
};

// 隐藏弹窗
const hide = () => {
	visible.value = false;
	// 重置表单
	formRef.value?.resetFields();
	formData.returnItems = [];
	// 重置其他数据
	currentEditingRow.value = null;
	showPreview.value = false;

	// 重置表单数据
	formData.purchaseNo = '';
	formData.supplierName = '';
	formData.purchaseUserName = '';
	formData.purchaseEntityName = '';
	formData.remark = '';
};

// 提交表单
const handleSubmit = async () => {
	try {
		// 表单验证
		const valid = await formRef.value?.validate().catch(() => false);
		if (!valid) return;

		// 验证退货明细
		if (formData.returnItems.length === 0) {
			useMessage().error('至少需要一条退货明细');
			return;
		}

		// 验证每条退货明细
		for (let i = 0; i < formData.returnItems.length; i++) {
			const item = formData.returnItems[i];
			// 验证可退货数量
			if (item.returnableQuantity <= 0) {
				useMessage().error(`第${i + 1}行：该SKU无可退货数量`);
				return;
			}

			// 验证退货数量
			if (!item.returnNum || item.returnNum <= 0) {
				useMessage().error(`第${i + 1}行：请输入有效的退货数量`);
				return;
			}

			if (item.returnNum > item.returnableNum) {
				useMessage().error(`第${i + 1}行：退货数量不能超过可退货数量`);
				return;
			}
		}

		submitting.value = true;

		// 构建提交数据
		const submitData = {
			currency: props.selectedOrder.currency,
			purchaseNo: formData.purchaseNo,
			supplierNo: props.selectedOrder.supplierNo,
			legalPersonId: props.selectedOrder.legalPersonId,
			purchaseUserId: props.selectedOrder.purchaseUserId,
			remark: formData.remark,
			purchasereturnSkuList: formData.returnItems.map((item) => {
				return {
					...item,
					priceIncludingTax: (
						(item.returnNum || 0) * (item.unitPriceIncludingTax || 0)
					).toFixed(2),
				};
			}),
		};
		const res = await saveReturn(submitData);
		if (res.code === 0) {
			useMessage().success('退货申请提交成功');
		} else {
			return;
		}
		// 触发提交事件
		emit('submit', submitData);
		// 提交成功后关闭弹窗
		hide();
	} catch (error: any) {
		useMessage().error(error?.msg || '提交失败');
	} finally {
		submitting.value = false;
	}
};

// 暴露方法
defineExpose({
	show,
	hide,
});
</script>

<style lang="scss" scoped>
.dialog-footer {
	display: flex;
	justify-content: flex-end;
	gap: 12px;
}

:deep(.el-form-item__label) {
	font-weight: 500;
}

:deep(.el-table .el-table__row) {
	&:hover {
		background-color: #f5f7fa;
	}
}
:deep(.el-button--small) {
	padding: 5px;
	margin-left: 5px;
	border: 1px solid rgb(37 99 235 / var(--tw-text-opacity, 1));
}
</style>
