<template>
	<el-dialog
		v-model="visible"
		:close-on-click-modal="false"
		width="50%"
		class="min-h-[800px] custom-dialog"
		@close="handleClose"
		:append-to-body="true"
	>
		<!-- 自定义标题 -->
		<template #header>
			<div class="flex pb-3 border-b border-gray-200">
				<div class="font-semibold header-title">添加增品</div>
			</div>
		</template>

		<!-- 内容区域 -->
		<div class="flex flex-col h-[580px]">
			<div class="flex flex-col flex-1 gap-4 overflow-y-auto pr-2">
				<!-- 添加赠品按钮 -->

				<div class="flex mt-4">
					<div class="relative flex gap-4 log-container">
						<div class="log-title text-red-500">
							<span style="color: red">*</span>
							订单增品 :
						</div>
						<div class="relative">
							<el-button
								type="primary"
								@click.stop="openAddGiftsDialog"
								size="small"
								text
							>
								添加
							</el-button>
							<el-dialog
								v-model="popVisible"
								append-to-body
								width="40%"
								destroy-on-close
								:close-on-click-modal="false"
								title="添加赠品"
								@closed="handleGiftDialogClosed"
							>
								<div class="flex flex-col justify-between gap-2">
									<div>
										<el-form
											:inline="true"
											@submit.prevent
											:model="state.queryForm"
											@keyup.enter="getDataList"
											ref="queryRef"
										>
											<el-form-item prop="keyword" class="w-full">
												<el-input
													v-model="state.queryForm.keyword"
													placeholder="搜索SKU/产品名称"
													:prefix-icon="Search"
													@blur="handleBlur"
												/>
											</el-form-item>
										</el-form>
										<el-table
											:data="state.dataList"
											v-loading="state.loading"
											ref="tableRef"
											row-key="id"
											:cell-style="tableStyle.cellStyle"
											:header-cell-style="tableStyle.headerCellStyle"
											class="w-full pop-table"
											style="
												min-height: 350px;
												max-height: 350px;
												overflow: auto;
											"
											native-scrollbar
										>
											<el-table-column
												prop="id"
												label="ID"
												width="80"
												v-if="false"
											/>
											<el-table-column width="80" label="图片">
												<template #default="{ row }">
													<MrImg :src="row.imgUrl" />
												</template>
											</el-table-column>
											<el-table-column
												prop="skuCode"
												align="left"
												header-align="left"
												label="产品名称/SKU"
												show-overflow-tooltip
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
												prop="mskuCode"
												align="left"
												header-align="left"
												label="MSKU"
												show-overflow-tooltip
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
															{{ row.mskuCode }}
														</div>
													</div>
												</template>
											</el-table-column>
											<el-table-column
												prop="deptName"
												align="left"
												header-align="left"
												label="部门&小组"
												show-overflow-tooltip
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
															{{ row.deptName }}
														</div>
													</div>
												</template>
											</el-table-column>
											<el-table-column width="80" label="操作">
												<template #default="{ row }">
													<el-button
														text
														@click.stop="handleConfirm(row)"
														size="small"
														v-if="checkSelected(row.mskuCode)"
														type="primary"
													>
														添加
													</el-button>
												</template>
											</el-table-column>
										</el-table>
										<pagination
											@current-change="currentChangeHandle"
											@size-change="sizeChangeHandle"
											v-bind="state.pagination"
										/>
									</div>
								</div>
								<template #footer>
									<div class="flex justify-end gap-2">
										<el-button size="small" @click="handleGiftDialogCancel">
											取消
										</el-button>
									</div>
								</template>
							</el-dialog>
						</div>
					</div>
				</div>

				<!-- 赠品列表 -->
				<div class="gift-list">
					<div
						class="flex mb-4 selected-item"
						v-for="item in selectedProductList"
						:key="item.id"
					>
						<div class="info-item flex flex-[5_0_0%]">
							<img :src="item.imgUrl" alt="" class="w-[50px] h-[50px] mr10" />
							<div class="info-content flex flex-col flex-[4_0_0%]">
								<div class="text-[#333] font-semibold flex items-center">
									<span
										style="
											display: flex;
											align-items: center;
											height: 19px;
											color: #ff0000;
											border: 1px solid red;
											margin-right: 4px;
											padding: 2px;
											border-radius: 2px;
										"
										>赠</span
									>
									<el-tooltip
										effect="dark"
										placement="top"
										:content="item.skuName"
									>
										<div class="ellipsis">
											{{
												item.skuName.length > 25
													? item.skuName.slice(0, 25) + '...'
													: item.skuName
											}}
										</div>
									</el-tooltip>
								</div>
								<span class="text-[#999]">SKU: {{ item.skuCode }}</span>
							</div>

							<div
								class="info-content flex flex-col ml-10 flex-[4_0_0%] justify-center"
							>
								<span class="text-[#999]">MSKU: {{ item.mskuCode }}</span>
								<span class="text-[#999]">部门&小组: {{ item.deptName }}</span>
							</div>
						</div>
						<div class="item-control flex-[2_0_0%] flex items-center">
							<div class="text-red-500">*发货量 ：</div>
							<el-input-number
								style="width: 120px"
								controls-position="right"
								v-model="item.orderQuantity"
								:min="1"
							/>
						</div>
						<div class="ml-2 flex-[1_0_0%] flex items-center">
							<el-button
								type="danger"
								size="small"
								@click="removeChangeProduct(item.id)"
								text
							>
								删除
							</el-button>
						</div>
					</div>
				</div>
			</div>

			<div class="flex gap-4 remark mt-4 pb-2">
				<div class="flex whitespace-nowrap">产品备注</div>
				<el-input
					v-model="productRemark"
					:autosize="{ minRows: 2, maxRows: 4 }"
					type="textarea"
					placeholder="Please input"
				/>
			</div>
		</div>

		<template #footer>
			<!-- footer -->
			<div class="flex justify-end pt-3 border-t border-gray-200">
				<el-button @click="handleClose">{{ t('取消') }}</el-button>
				<el-button type="primary" @click="onSubmit" class="ml-2">
					{{ t('确定') }}
				</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { inject, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getSelectMskuPage } from '/@/api/fbm/selfOrder';
import { postAddGift } from '/@/api/fbm/selfOrder';
import { Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useMessage } from '/@/hooks/message';

//父组件刷新数据方法
const reflashDataList = inject<() => void>('getDataList');

const { t } = useI18n();

const handleBlur = () => {
	if (!state.queryForm.keyword || state.queryForm.keyword.trim() === '') return;
	getDataList();
};

//重置数据
const resetData = () => {
	popVisible.value = false;
	setTableData([]);
	state.queryForm = {};
};

const props = defineProps({
	currentRow: {
		type: Object,
		default: () => ({}),
	},
});

// 产品备注
const productRemark = ref('');

//检查是否已选择
const checkSelected = (mskuCode: number) => {
	return !selectedProductList.some((item) => item.mskuCode === mskuCode);
};

//已选产品列表
const selectedProductList = reactive<any[]>([]);

//模块弹窗显示
const visible = ref(false);

//table
const state: BasicTableProps = reactive<BasicTableProps>({
	pagination: {
		layout: 'prev, pager, next,jumper',
		size: 10,
	},
	queryForm: { status: 1 },
	pageList: getSelectMskuPage,
	createdIsNeed: false,
});
const tableRef = ref();
const {
	getDataList,
	tableStyle,
	setTableData,
	sizeChangeHandle,
	currentChangeHandle,
} = useTable(state, tableRef);

const handleGiftDialogCancel = () => {
	popVisible.value = false;
};

const handleGiftDialogClosed = () => {
	resetData();
};

//弹窗显示按钮
const popVisible = ref(false);

//打开添加赠品弹窗
const openAddGiftsDialog = () => {
	popVisible.value = true;
	state.queryForm.platformChannel = props.currentRow.platformChannelCode;
	state.queryForm.deptId = props.currentRow.deptId;
	state.queryForm.siteCode = props.currentRow.siteCode;
	state.queryForm.storeId = props.currentRow.storeId;
	// 获取数据不要了
	// getDataList();
};

const handleClose = () => {
	visible.value = false;
	clearSelectedProducts();
};

const handleOpen = async () => {
	visible.value = true;
};

// 添加赠品
const handleConfirm = async (row: any) => {
	try {
		// 弹窗所选行数据
		const { id, skuCode, skuName, imgUrl, deptName, mskuCode } = row;
		selectedProductList.push({
			id,
			skuCode,
			skuName,
			imgUrl,
			deptName,
			mskuCode,
			orderQuantity: 1,
		});
		popVisible.value = false;
	} catch {
		ElMessage.error('提交失败');
	}
};

// 清空已选赠品
const clearSelectedProducts = () => {
	selectedProductList.length = 0;
};

// 删除换货产品
const removeChangeProduct = (id: number) => {
	const index = selectedProductList.findIndex((item) => item.id === id);
	if (index !== -1) {
		selectedProductList.splice(index, 1);
	}
};

// 提交按钮
const onSubmit = async () => {
	if (selectedProductList.length === 0) {
		ElMessage.error('未选择赠品');
		return;
	}

	const formParmars = {
		id: props.currentRow.id,
		giftItems: selectedProductList
			.filter((item) => item.skuCode && item.mskuCode)
			.map(({ skuCode, mskuCode, orderQuantity }) => ({
				skuCode,
				mskuCode,
				orderQuantity,
			})),
		itemRemark: productRemark.value,
	};

	// 掉接口
	try {
		const res = await postAddGift(formParmars);
		if (res.code == 0) {
			ElMessage.success('添加赠品成功');
			reflashDataList?.();
		} else {
			useMessage().error(res.msg ?? t('操作失败'));
		}
	} catch (error: any) {
		useMessage().error(error?.msg || error?.message || t('网络错误'));
	} finally {
		clearSelectedProducts();
		handleClose();
	}

	// console.log('参数列表', formParmars);
};

defineExpose({
	handleOpen,
});
</script>

<style scoped>
:deep(.el-table--default .cell) {
	text-align: left;
}
</style>
