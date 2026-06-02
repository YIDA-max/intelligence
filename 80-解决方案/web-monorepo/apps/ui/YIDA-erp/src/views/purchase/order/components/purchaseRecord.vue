<template>
	<el-dialog
		v-model="dialogVisible"
		:title="title"
		:width="props.width"
		:close-on-click-modal="false"
		@closed="handleClosed"
		@opened="handleOpened"
	>
		<el-row class="mb18">
			<el-col :span="24">
				<el-table
					ref="tableRef"
					:data="state.dataList"
					border
					height="400"
					:cell-style="tableStyle.cellStyle"
					:header-cell-style="tableStyle.headerCellStyle"
					style="width: 100%"
					native-scrollbar
				>
					<el-table-column prop="skuCode" label="SKU/产品名称" min-width="220">
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
					<el-table-column label="本次采购数量" width="230">
						<template #default="{ row, $index }">
							<span v-if="editingIndex !== $index">{{
								row.currentPurchaseQuantity ?? '--'
							}}</span>
							<div class="currentNum" v-else>
								<el-input
									v-model.number="row.editCurrentPurchaseQuantity"
									type="number"
									:min="0"
									@change="
										() => {
											if (row.editCurrentPurchaseQuantity < 0) {
												row.editCurrentPurchaseQuantity = 0;
											}
										}
									"
								/>
								<span class="red mt5"
									>可调整范围：{{ row.minPurchaseNum || 0 }}~{{
										row.maxPurchaseNum || 0
									}}</span
								>
							</div>
						</template>
					</el-table-column>
					<el-table-column
						prop="factoryReplyDeliveryDate"
						:label="t('工厂回复交期')"
						show-overflow-tooltip
						width="200"
					>
						<template #default="{ row, $index }">
							<span v-if="editingIndex !== $index">{{
								row.factoryReplyDeliveryDate || '-'
							}}</span>
							<div class="currentNum" v-else>
								<el-date-picker
									v-model="row.editFactoryReplyDeliveryDate"
									clearable
									type="date"
									value-format="YYYY-MM-DD"
									placeholder="年/月/日"
								/>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="备注" min-width="200" show-overflow-tooltip>
						<template #default="{ row, $index }">
							<span v-if="editingIndex !== $index">{{
								row.remark || '-'
							}}</span>
							<div class="currentNum" v-else>
								<el-input
									v-model="row.editRemark"
									placeholder="请输入备注"
									style="width: 100%"
									type="textarea"
									:rows="2"
									size="small"
								/>
							</div>
						</template>
					</el-table-column>
					<el-table-column
						prop="createName"
						:label="t('操作人')"
						show-overflow-tooltip
						width="180"
					/>
					<el-table-column
						prop="createTime"
						:label="t('操作时间')"
						show-overflow-tooltip
						width="180"
					/>

					<el-table-column label="操作" width="150" fixed="right">
						<template #default="{ row, $index }">
							<div class="flex items-center gap-2 mt5">
								<div v-if="editingIndex !== $index">
									<el-button
										text
										type="primary"
										v-if="
											row.builtTakeGoodsNum + row.returnNum !==
												row.currentPurchaseQuantity &&
											auth('order_confirmPurchase')
										"
										size="small"
										@click="startEdit(row, $index)"
										>编辑</el-button
									>
								</div>
								<div v-else class="flex items-center gap-2 mt5">
									<el-button
										text
										type="success"
										size="small"
										@click="confirmEdit(row)"
										:loading="saving"
										>保存</el-button
									>
									<el-button
										text
										type="danger"
										size="small"
										@click="cancelEdit"
										:disabled="saving"
										>取消</el-button
									>
								</div>
							</div>
						</template>
					</el-table-column>
				</el-table>
				<pagination
					@current-change="currentChangeHandle"
					@size-change="sizeChangeHandle"
					v-bind="state.pagination"
				/>
			</el-col>
		</el-row>
		<template #footer>
			<el-button @click="handleCancel">关闭</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMessage } from '/@/hooks/message';
import {
	updateDeliveryInfo,
	getPurchaseRecordByCode,
} from '/@/api/purchase/order/index';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { auth } from '/@/utils/authFunction';

const { t } = useI18n();
const props = defineProps({
	width: {
		type: String,
		default: '80%',
	},
	// 当前行数据
	currentRow: {
		type: Object,
		default: () => ({}),
	},
});

// 表格数据
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	descs: ['create_time'],
	pageList: getPurchaseRecordByCode,
	createdIsNeed: false,
});

const tableRef = ref<any>(null);

const { getDataList, tableStyle, currentChangeHandle, sizeChangeHandle } =
	useTable(state, tableRef);

const emit = defineEmits(['cancel', 'confirm', 'closed', 'refresh']);
const title = ref('采购记录');
const dialogVisible = ref(false);
const confirmLoading = ref(false);

// 编辑状态管理
const editingIndex = ref<number>(-1);
const originalRowData = ref<any>(null);
const saving = ref(false);

// 开始编辑
const startEdit = (row: any, index: number) => {
	editingIndex.value = index;
	// 备份当前行的原始数据
	originalRowData.value = JSON.parse(JSON.stringify(row));
	// 初始化编辑数据
	row.editCurrentPurchaseQuantity = row.currentPurchaseQuantity;
	row.editFactoryReplyDeliveryDate = row.factoryReplyDeliveryDate;
	row.editRemark = row.remark;
};

// 确认编辑并保存当前行
const confirmEdit = async (row: any) => {
	try {
		const currentQuantity = Number(row.editCurrentPurchaseQuantity) || 0;
		const minQuantity = row.minPurchaseNum || 0;
		const maxQuantity = row.maxPurchaseNum || 0;

		if (currentQuantity < minQuantity) {
			useMessage().error(
				`更新后的采购数量${currentQuantity}，不能小于已处理数量${minQuantity}！`
			);
			row.editCurrentPurchaseQuantity = minQuantity;
			return false;
		}

		if (currentQuantity > maxQuantity) {
			useMessage().error(
				`更新后的采购数量${currentQuantity}，不能大于计划数量${maxQuantity}！`
			);
			row.editCurrentPurchaseQuantity = maxQuantity;
			return false;
		}
		row.currentPurchaseQuantity = row.editCurrentPurchaseQuantity;
		row.remark = row.editRemark;

		saving.value = true;

		// 调用API保存当前行数据
		const res = await updateDeliveryInfo(row);
		if (res.code === 0) {
			// 更新原始数据
			row.currentPurchaseQuantity = row.editCurrentPurchaseQuantity || 0;
			row.factoryReplyDeliveryDate = row.editFactoryReplyDeliveryDate || 0;
			// 清除编辑字段
			delete row.editCurrentPurchaseQuantity;
			delete row.editFactoryReplyDeliveryDate;
			delete row.editRemark;

			editingIndex.value = -1;
			originalRowData.value = null;
			useMessage().success('保存成功');

			// 通知父组件刷新数据
			emit('refresh');
			getDataList();
		}
	} catch (error: any) {
		useMessage().error(error?.msg || '保存失败');
	} finally {
		saving.value = false;
	}
};

// 取消编辑
const cancelEdit = () => {
	if (editingIndex.value === -1 || !originalRowData.value) {
		return;
	}

	// state.dataList 才是表格实际渲染的数据
	const list = state.dataList || [];
	if (list[editingIndex.value]) {
		// 恢复原始数据
		Object.assign(list[editingIndex.value], originalRowData.value);
	}

	editingIndex.value = -1;
	originalRowData.value = null;
};

// 初始化表单数据
const initFormData = () => {
	// 重置编辑状态
	editingIndex.value = -1;
	originalRowData.value = null;
};

/**
 * 弹窗打开时的处理函数
 * 确保数据被正确初始化
 */
const handleOpened = () => {
	// 弹窗完全打开后，确保数据初始化
	nextTick(() => {
		initFormData();
	});
};
/**
 * 取消操作处理函数
 */
const handleCancel = () => {
	dialogVisible.value = false;
};

/**
 * 弹窗关闭后的回调
 */
const handleClosed = () => {
	// 重置编辑状态
	editingIndex.value = -1;
	originalRowData.value = null;
	confirmLoading.value = false;
	emit('closed');
};

/**
 * 打开弹窗方法
 * 供父组件调用
 */
const show = (row: any) => {
	state.dataList = [];
	state.queryForm.purchaseNo = row?.purchaseNo || '';
	getDataList();
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
	initFormData,
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
.edit-mode .el-table .el-input {
	margin: 0;
}
.edit-mode .el-table .el-textarea {
	margin: 0;
}
.edit-mode .el-table .el-date-editor {
	margin: 0;
}
.currentNum {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
}
.red {
	color: red;
	margin-top: 10px;
}
:deep(.el-table .el-table__cell) {
	// vertical-align: top;
}
</style>
