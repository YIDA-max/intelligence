<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMessage } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useResultDialog } from '/@/hooks/useResultDialog';
import {
	CollectionPlanVo,
	postBatchCancelCollectionPlan,
} from '/@/api/mcp/collectionPlan/index';

const Message = defineAsyncComponent(
	() => import('/@/components/BatchMessage/index.vue')
);
const emits = defineEmits(['getDataList']);
const { open } = useResultDialog();

const { t } = useI18n();
const dialogVisible = ref(false);
// 加载
const loading = ref(false);
const title = ref('取消申请');

// 表格数据
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	descs: [''],
	isPage: false,
});

const tableRef = ref<any>(null);
const { tableStyle, setTableData, getTableData } = useTable(state, tableRef);
onMounted(() => {});

// 打开弹窗初始化
const handleOpen = async () => {};

// 批量填写取消原因
const BatchRemark = (e: string | number | null) => {
	const list = getTableData() || [];
	list.forEach((item: any) => {
		item.remark = String(e ?? '');
	});
	setTableData(list);
};

/**
 * 提交表单
 */
const onSubmit = async () => {
	const list = getTableData() || [];
	// 后台不想多写一个对象来接收，所以直接传数组，要规范不要这样野路子
	const res = await postBatchCancelCollectionPlan(
		list.map((item: any) => ({
			id: item.id,
			num: item.num,
			reason: item.remark,
		}))
	);
	if (res.code !== 0) return;
	// 判断是否有失败的记录
	if (res.data?.failCount > 0) {
		// 展示错误提示
		open({
			title: t('操作结果'),
			data: res.data,
		});
		return;
	} else if (res.data?.failCount === 0) {
		useMessage().success('操作成功');
	}
	dialogVisible.value = false;
	emits('getDataList');
};
/**
 * 打开弹窗方法
 * 供父组件调用
 */
const show = (e: CollectionPlanVo[]) => {
	if (e && Array.isArray(e)) {
		setTableData(e);
	} else {
		state.dataList = [];
	}
	dialogVisible.value = true;
};

/**
 * 关闭弹窗方法
 * 供父组件调用
 */
const hide = () => {
	dialogVisible.value = false;
};
defineExpose({
	handleOpen,
	show,
	hide,
});
</script>
<template>
	<el-dialog
		v-model="dialogVisible"
		:close-on-click-modal="false"
		:title="title"
		width="1200px"
		@close="hide"
		@open="handleOpen"
		draggable
	>
		<div class="dialog-container">
			<el-row class="mb-2">
				<el-table
					:data="state.dataList"
					style="width: 100%"
					v-loading="state.loading"
					border
					row-key="skuCode"
					ref="tableRef"
					height="320"
					:cell-style="tableStyle.cellStyle"
					:header-cell-style="tableStyle.headerCellStyle"
					native-scrollbar
				>
					<el-table-column
						:label="t('序号')"
						type="index"
						width="60"
						align="center"
					>
					</el-table-column>
					<el-table-column
						:label="t('提货单号')"
						min-width="150"
						show-overflow-tooltip
					>
						<template #default="{ row }">
							{{ row.pickupOrderNo || '---' }}
						</template>
					</el-table-column>
					<el-table-column
						:label="t('状态')"
						min-width="100"
						show-overflow-tooltip
					>
						<template #default="{ row }">
							{{ row.statusText || '---' }}
						</template>
					</el-table-column>
					<el-table-column
						:label="t('提货数量')"
						min-width="100"
						show-overflow-tooltip
					>
						<template #default="{ row }">
							{{ row.pickupQuantity || '---' }}
						</template>
					</el-table-column>
					<el-table-column
						:label="t('计划提货日期')"
						min-width="130"
						show-overflow-tooltip
					>
						<template #default="{ row }">
							{{ row.plannedPickupDate || '---' }}
						</template>
					</el-table-column>
					<el-table-column
						:label="t('已推发货数量')"
						min-width="130"
						show-overflow-tooltip
					>
						<template #default="{ row }">
							{{ row.pushedShippingQuantity || '0' }}
						</template>
					</el-table-column>
					<el-table-column
						:label="t('取消数量')"
						min-width="150"
						show-overflow-tooltip
					>
						<template #header>
							<span
								:style="{
									color: '#f78c8c',
									marginRight: '3px',
								}"
								>*
							</span>
							{{ $t('取消数量') }}
						</template>
						<template #default="{ row }">
							<el-input-number
								v-model="row.num"
								type="number"
								placeholder="请输入取消数量"
								:min="1"
								:max="
									Number(row.pickupQuantity) -
									Number(row.pushedShippingQuantity)
								"
							/>
						</template>
					</el-table-column>
					<el-table-column
						:label="t('取消原因')"
						min-width="200"
						show-overflow-tooltip
					>
						<template #header>
							<span
								:style="{
									color: '#f78c8c',
									marginRight: '3px',
								}"
								>*
							</span>
							{{ $t('取消原因') }}
							<Message title="填写取消原因" @submit="BatchRemark" />
						</template>
						<template #default="{ row }">
							<el-input
								v-model="row.remark"
								type="text"
								placeholder="请输入备注"
							/>
						</template>
					</el-table-column>
					<el-table-column
						prop="skuCode"
						:label="$t('SKU/产品名称')"
						show-overflow-tooltip
						min-width="150"
					>
						<template #default="{ row }">
							<div class="flex flex-col items-start justify-center w-full">
								<MrTextEllipsis :text="row.skuCode" empty-text="---" />
								<MrTextEllipsis :text="row.skuName" empty-text="---" />
							</div>
						</template>
					</el-table-column>
					<el-table-column
						:label="t('国家')"
						min-width="100"
						show-overflow-tooltip
					>
						<template #default="{ row }">
							{{ row.countryCode || '---' }}
						</template>
					</el-table-column>
					<el-table-column
						:label="t('平台渠道')"
						min-width="100"
						show-overflow-tooltip
					>
						<template #default="{ row }">
							{{ row.platformChannelCode || '---' }}
						</template>
					</el-table-column>

					<el-table-column
						:label="t('MSKU')"
						min-width="100"
						show-overflow-tooltip
					>
						<template #default="{ row }">
							{{ row.mskuCode || '---' }}
						</template>
					</el-table-column>
					<el-table-column
						:label="t('部门')"
						min-width="100"
						show-overflow-tooltip
					>
						<template #default="{ row }">
							{{ row.departmentText || '---' }}
						</template>
					</el-table-column>
					<el-table-column
						:label="t('运营小组')"
						min-width="100"
						show-overflow-tooltip
					>
						<template #default="{ row }">
							{{ row.deptText || '---' }}
						</template>
					</el-table-column>
					<el-table-column
						:label="t('采购单')"
						min-width="100"
						show-overflow-tooltip
					>
						<template #default="{ row }">
							{{ row.purchaseOrderNo || '---' }}
						</template>
					</el-table-column>
					<el-table-column
						:label="t('采购员')"
						min-width="100"
						show-overflow-tooltip
					>
						<template #default="{ row }">
							{{ row.purchaseUserName || '---' }}
						</template>
					</el-table-column>
					<el-table-column
						:label="t('创建人')"
						min-width="100"
						show-overflow-tooltip
					>
						<template #default="{ row }">
							{{ row.createName || '---' }}
						</template>
					</el-table-column>
					<el-table-column
						:label="t('创建时间')"
						min-width="100"
						show-overflow-tooltip
					>
						<template #default="{ row }">
							{{ row.createTime || '---' }}
						</template>
					</el-table-column>
				</el-table>
			</el-row>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="hide">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">{{
					$t('确认提交')
				}}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

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
</style>
