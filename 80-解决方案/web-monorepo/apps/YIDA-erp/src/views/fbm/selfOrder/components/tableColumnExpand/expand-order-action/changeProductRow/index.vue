<template>
	<div class="flex row-item">
		<div class="product-info flex flex-[3_0_0%] items-start">
			<div
				style="width: fit-content"
				:class="[
					'info-item',
					'flex-[4_0_0%]',
					'flex',
					{ 'product-line': selectedProductList.length > 0 },
				]"
				ref="productInfoRef"
			>
				<img
					:src="props.productOrder.imgUrl"
					alt=""
					class="w-[70px] h-[70px] mr10"
				/>
				<div class="flex flex-col mr-2 info-content">
					<el-popover placement="top" trigger="hover">
						<template #reference>
							<div :span="24" class="fontWeight">
								<span>
									{{
										props.productOrder.skuName.length > 20
											? props.productOrder.skuName.slice(0, 20) + '...'
											: props.productOrder.skuName || '---'
									}}
								</span>
							</div>
						</template>
						<div>
							<span> {{ props.productOrder.skuName || '---' }}</span>
						</div>
					</el-popover>
					<!-- <span class="text-[#333]">{{ props.productList.productTitle }}</span> -->
					<span class="text-[#999]">SKU:{{ props.productOrder.skuCode }}</span>
					<div class="text-[#999] flex">
						MSKU:
						<el-popover placement="top" trigger="hover">
							<template #reference>
								<div class="">
									<span>
										{{
											props.productOrder.mskuCode.length > 20
												? props.productOrder.mskuCode.slice(0, 20) + '...'
												: props.productOrder.mskuCode || '---'
										}}
									</span>
								</div>
							</template>
							<div>
								<span> {{ props.productOrder.mskuCode || '---' }}</span>
							</div>
						</el-popover>
						<!-- {{ props.productOrder.mskuCode }} -->
					</div>
				</div>
				<div class="flex justify-end pr-10 number">
					<span class="text-[#999]"
						>订购数量:{{ props.productOrder.orderQuantity || 1 }}</span
					>
				</div>
			</div>
			<div
				style="height: 100%"
				class="flex items-start justify-center change-line pt-[10px] flex-[3_0_0%]"
				v-if="selectedProductList.length > 0"
			>
				<span
					class="z-[1] rounded-full bg-white border-2 border-sky-300 p-2 px-3 text-[#999] text-sm"
				>
					换
				</span>
			</div>
		</div>

		<div class="change-info flex flex-col flex-[2_0_0%]">
			<div class="pb-2 selected-list">
				<div
					:class="[
						'selected-item',
						'flex',
						'mb-4',
						{ 'sku-line': selectedProductList.length > 0 },
					]"
					v-for="item in selectedProductList"
					:key="item.id"
				>
					<div class="info-item flex flex-[4_0_0%]">
						<img :src="item.imgUrl" alt="" class="w-[70px] h-[70px] mr10" />
						<div class="flex flex-col mr-2 info-content">
							<el-popover placement="top" trigger="hover">
								<template #reference>
									<div :span="24" class="fontWeight">
										<span>
											{{
												item.skuName.length > 20
													? item.skuName.slice(0, 20) + '...'
													: item.skuName || '---'
											}}
										</span>
									</div>
								</template>
								<div>
									<span> {{ item.skuName || '---' }}</span>
								</div>
							</el-popover>
							<!-- <span class="text-[#333]">{{ props.productList.productTitle }}</span> -->
							<span class="text-[#999]">SKU:{{ item.skuCode }}</span>
							<div class="text-[#999] flex">
								MSKU:
								<el-popover placement="top" trigger="hover">
									<template #reference>
										<div class="">
											<span>
												{{
													item.mskuCode.length > 15
														? item.mskuCode.slice(0, 15) + '...'
														: item.mskuCode || '---'
												}}
											</span>
										</div>
									</template>
									<div>
										<span> {{ item.mskuCode || '---' }}</span>
									</div>
								</el-popover>
							</div>
						</div>
					</div>
					<div class="item-control flex-[2_0_0%]">
						<el-input-number
							style="width: 120px"
							controls-position="right"
							@change="handleCountChange"
							v-model="item.count"
							:min="1"
						/>
					</div>
					<div class="ml-2 flex-[1_0_0%]">
						<el-button
							type="danger"
							size="small"
							@click="removeChangeProduct(item.mskuId)"
							text
						>
							删除
						</el-button>
					</div>
				</div>
			</div>

			<div
				:class="[
					'relative',
					'inline-block',
					{ 'btn-line': selectedProductList.length > 0 },
				]"
				style="width: fit-content"
			>
				<!-- 触发按钮 -->
				<el-button
					type="primary"
					ref="skuChooseRef"
					text
					@click="togglePopover"
				>
					选择SKU
				</el-button>
			</div>
		</div>
		<!-- 普通弹窗 -->
		<el-dialog
			v-model="popVisible"
			append-to-body
			width="50%"
			destroy-on-close
			:close-on-click-modal="false"
			:show-close="true"
			title="选择SKU"
			@closed="handleDialogClosed"
		>
			<div class="flex flex-col justify-between">
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
								@keyup.enter="handleEnter"
								@blur="handleBlur"
							/>
						</el-form-item>
					</el-form>
					<el-table
						:data="state.dataList"
						v-loading="state.loading"
						ref="tableRef"
						row-key="mskuId"
						:cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle"
						class="w-full pop-table"
						style="min-height: 400px; max-height: 400px; overflow: auto"
						@selection-change="handleSelectionChange"
						native-scrollbar
					>
						<el-table-column
							align="center"
							type="selection"
							width="40"
							:reserve-selection="true"
						/>
						<el-table-column prop="deptId" label="ID" width="80" v-if="false" />
						<el-table-column width="80" label="图片">
							<template #default="{ row }">
								<MrImg :src="row.imgUrl" />
							</template>
						</el-table-column>
						<el-table-column
							prop="skuCode"
							label="SKU/产品名称"
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
							prop="countryCode"
							label="国家"
							show-overflow-tooltip
						>
							<template #default="{ row }">
								<div
									style="
										max-width: 100%;
										overflow: hidden;
										white-space: nowrap;
										text-overflow: ellipsis;
									"
								>
									{{ row.countryCode || '---' }}
								</div>
							</template>
						</el-table-column>
						<el-table-column
							prop="platformChannel"
							label="平台渠道"
							show-overflow-tooltip
						>
							<template #default="{ row }">
								<div
									style="
										max-width: 100%;
										overflow: hidden;
										white-space: nowrap;
										text-overflow: ellipsis;
									"
								>
									{{ row.platformChannel || '---' }}
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="makuCode" label="MSKU" show-overflow-tooltip>
							<template #default="{ row }">
								<div
									style="
										max-width: 100%;
										overflow: hidden;
										white-space: nowrap;
										text-overflow: ellipsis;
									"
								>
									{{ row.mskuCode || '---' }}
								</div>
							</template>
						</el-table-column>
						<el-table-column
							prop="deptName"
							label="部门&小组"
							show-overflow-tooltip
						>
							<template #default="{ row }">
								<div
									style="
										max-width: 100%;
										overflow: hidden;
										white-space: nowrap;
										text-overflow: ellipsis;
									"
								>
									{{ row.parentDeptName || '---' }}&
									{{ row.deptName || '---' }}
								</div>
							</template>
						</el-table-column>
					</el-table>
					<pagination
						@current-change="currentChangeHandle"
						@size-change="sizeChangeHandle"
						v-bind="state.pagination"
					></pagination>
				</div>
			</div>
			<template #footer>
				<div class="flex justify-end">
					<el-button size="small" @click="handleCancel">取消</el-button>
					<el-button size="small" type="primary" @click="handleConfirm"
						>确定</el-button
					>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { BasicTableProps, useTable } from '/@/hooks/table';

import { ElMessage } from 'element-plus';
import { Search } from '@element-plus/icons-vue';

//获取换货列表
import { getSelectMskuPage } from '/@/api/fbm/selfOrder';

onMounted(() => {
	notifyParentComponent();
});

const emit = defineEmits(['change-data-update']);

const props = defineProps({
	// 当前行数据
	productOrder: {
		type: Object,
		default: () => ({}),
	},
	order: {
		type: Object,
		default: () => ({}),
	},
	//根据id获取当前产品可换货列表
	changeId: {
		type: Number,
		default: () => {
			return 38;
		},
	},
});

const inputRef = ref();
const isEnterTrigger = ref(false);

const handleEnter = () => {
	isEnterTrigger.value = true;

	getDataList(); // 搜索
	inputRef.value?.input?.blur();
};

const handleBlur = () => {
	if (isEnterTrigger.value) {
		isEnterTrigger.value = false;
		return; // 👈 阻止重复触发
	}
	if (!state.queryForm.keyword || state.queryForm.keyword.trim() === '') return;
	getDataList();
};
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
	sizeChangeHandle,
	currentChangeHandle,
	setTableData,
} = useTable(state, tableRef);

// 控制选择换货产品弹窗的显示
const popVisible = ref(false);

// 已选换货产品列表
const selectedProductList = reactive<any[]>([]);

// 监听选中产品列表变化，实时通知父组件
watch(
	selectedProductList,
	() => {
		notifyParentComponent();
	},
	{ deep: true }
);

// 通知父组件数据更新
const notifyParentComponent = () => {
	emit('change-data-update', {
		originalProductId: props.productOrder.id,

		//父组件需要的
		changeProducts: selectedProductList.map((item) => ({
			id: item.id,
			imgUrl: item.imgUrl,
			count: item.count || 1,
			skuCode: item.skuCode,
			skuName: item.skuCode,
			mskuCode: item.mskuCode,
		})),
	});
};

//打开弹窗获取,初始化数据
const togglePopover = () => {
	popVisible.value = true;
	state.queryForm.platformChannel = props.order.platformChannelCode;
	state.queryForm.deptId = props.order.deptId;
	state.queryForm.siteCode = props.order.siteCode;
	state.queryForm.storeId = props.order.storeId;
	// 获取数据
	// getDataList();
};

const handleCancel = () => {
	popVisible.value = false;
};

const handleDialogClosed = () => {
	state.queryForm = {};
	currentSelectedRows.value = [];
	setTableData([]);
	if (tableRef.value?.clearSelection) {
		tableRef.value.clearSelection();
	}
};

const currentSelectedRows = ref<any[]>([]);

const handleSelectionChange = (selection: any[]) => {
	currentSelectedRows.value = selection;
};
// 弹窗确认
const handleConfirm = async () => {
	try {
		// 弹窗所选行数据
		const selectedRows = currentSelectedRows.value;
		// const selectedRows = tableRef.value.getSelectionRows();
		if (selectedRows.length === 0) {
			ElMessage.warning('请至少选择一条数据');
			return;
		}
		// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
		// 初始化选中行列表以及添加数量字段
		const selectList = selectedRows.map(({ ...row }: any) => ({
			...row,
			count: 1,
		}));
		//拿到选取数据
		setRows(selectList);
		// 清空选中
		tableRef.value.clearSelection();
		// 关闭弹窗
		popVisible.value = false;
	} catch {
		ElMessage.error('提交失败');
	} finally {
		popVisible.value = false;
	}
};

// 数量变化处理
const handleCountChange = () => {
	notifyParentComponent();
};

// 删除换货产品
const removeChangeProduct = (mskuId: string) => {
	const index = selectedProductList.findIndex((item) => item.mskuId === mskuId);
	if (index !== -1) {
		selectedProductList.splice(index, 1);
		notifyParentComponent();
	}
};

// 弹窗设置行,处理重复选择之类的问题
const setRows = (rows: any[]) => {
	rows.forEach((row: any) => {
		const existingIndex = selectedProductList.findIndex(
			(item: any) => item.mskuId === row.mskuId
		);
		if (existingIndex === -1) {
			selectedProductList.push({
				id: row.id,
				imgUrl: row.imgUrl,
				count: row.count || 1,
				skuCode: row.skuCode,
				skuName: row.skuName,
				mskuCode: row.mskuCode,
				deptId: row.deptId,
				siteCode: row.siteCode,
				platformChannel: row.platformChannel,
			});
		}
	});
};

//重置数据
const clearSelectedProducts = () => {
	selectedProductList.length = 0;
	notifyParentComponent();
};

defineExpose({
	clearSelectedProducts,
	handleCancel,
});
</script>

<style lang="scss" scoped>
.product-line {
	position: relative;
}
.product-line::after {
	content: '';
	width: 167px;
	height: 1px;
	border: 1px dashed #5ed8ff;
	position: absolute;
	top: 50%;
	right: 0;
	transform: translate(100%, -50%);
}
.sku-line {
	position: relative;
}
.sku-line::after {
	content: '';
	width: 155px;
	height: 1px;
	border: 1px dashed #5ed8ff;
	position: absolute;
	top: 50%;
	left: -2%;
	transform: translate(-100%, -50%);
}
.btn-line {
	position: relative;
}
.btn-line::after {
	content: '';
	width: 155px;
	height: 1px;
	border: 1px dashed #5ed8ff;
	position: absolute;
	top: 50%;
	left: -8%;
	transform: translate(-100%, -50%);
}
.change-line {
	position: relative;
}
.change-line::before {
	content: '';
	position: absolute;
	left: 50%;
	width: 1px;
	transform: translateX(-50%);
	z-index: 1;
	height: calc(100% - 45px);
	bottom: 15px;
	border: 1px dashed #5ed8ff;
}
</style>
