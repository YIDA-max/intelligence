<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMessage } from '/@/hooks/message';
import {
	diffWarehouseList,
	confirmDiffAndGenerateOther,
} from '/@/api/materialFlow/secondMileLogistics';

const { t } = useI18n();

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	queryParams: {
		type: Object as () => Record<string, any>,
		default: () => ({}),
	},
});

const emit = defineEmits(['update:modelValue', 'cancel', 'success']);

const dialogVisible = computed({
	get: () => props.modelValue,
	set: (val) => emit('update:modelValue', val),
});
const activeTab = ref('enter');
const loading = ref(false);
const formRef = ref();
const inboundList = ref<any[]>([]);
const outboundList = ref<any[]>([]);

const formData = ref({
	inboundInfo: {
		warehouseName: '',
		warehouseCode: '',
		inboundTime: '',
		remark: '',
	},
	outboundInfo: {
		warehouseName: '',
		warehouseCode: '',
		outboundTime: '',
		remark: '',
	},
});

const dynamicRules = computed(() => {
	const rules: Record<string, any> = {};
	if (inboundList.value.length > 0) {
		rules['inboundInfo.inboundTime'] = [
			{ required: true, message: t('请选择入库时间'), trigger: 'change' },
		];
		rules['inboundInfo.remark'] = [
			{ required: true, message: t('请输入备注'), trigger: 'blur' },
		];
	}
	if (outboundList.value.length > 0) {
		rules['outboundInfo.outboundTime'] = [
			{ required: true, message: t('请选择出库时间'), trigger: 'change' },
		];
		rules['outboundInfo.remark'] = [
			{ required: true, message: t('请输入备注'), trigger: 'blur' },
		];
	}
	return rules;
});

const resetState = () => {
	formData.value = {
		inboundInfo: {
			warehouseName: '',
			warehouseCode: '',
			inboundTime: '',
			remark: '',
		},
		outboundInfo: {
			warehouseName: '',
			warehouseCode: '',
			outboundTime: '',
			remark: '',
		},
	};
	inboundList.value = [];
	outboundList.value = [];
	activeTab.value = 'enter';
};
const fetchDiffData = async () => {
	loading.value = false;
	try {
		let data: any = {};
		const paramsArr = props.queryParams?.deliveryVOList?.map((item: any) => ({
			secondMileDeliveryId: item.id,
			takeNum: item.intoTotalQuantity,
			takeCarton: Math.ceil(
				(item.intoTotalQuantity || 0) / (item.singleCartonQuantity || 1)
			),
		}));
		const res = await diffWarehouseList({
			id: props.queryParams?.mainId,
			diffConfirmMode: true,
			secondMileDeliveryMessageList: paramsArr,
		});
		if (res.code === 0) {
			data = res?.data || {};
		}

		inboundList.value = data.moreGoodsList || [];
		outboundList.value = data.lessGoodsList || [];
		if (!inboundList.value.length && !outboundList.value.length) {
			useMessage().warning('入库数量不存在差异，请通过【确认入库】完成入库！');
			emit('cancel');
			dialogVisible.value = false;
			return;
		}
		activeTab.value = inboundList.value.length ? 'enter' : 'out';
		formData.value.inboundInfo.warehouseName =
			inboundList.value?.[0]?.takeInWarehouse || '';
		formData.value.outboundInfo.warehouseName =
			outboundList.value?.[0]?.takeInWarehouse || '';
		// 设置当前时间 YYYY-MM-DD
		const now = new Date().toISOString().slice(0, 10);
		formData.value.inboundInfo.inboundTime = now;
		formData.value.outboundInfo.outboundTime = now;
	} finally {
		loading.value = false;
	}
};

const handleConfirm = async () => {
	formRef.value?.validate();
	// 校验失败，根据错误字段切换到对应tab
	const hasInboundError =
		!formData.value.inboundInfo.inboundTime ||
		!formData.value.inboundInfo.remark;
	const hasOutboundError =
		!formData.value.outboundInfo.outboundTime ||
		!formData.value.outboundInfo.remark;
	if (outboundList.value.length > 0 && hasOutboundError) {
		activeTab.value = 'out';
		return;
	} else if (inboundList.value.length > 0 && hasInboundError) {
		activeTab.value = 'enter';
		return;
	}
	const intoDataDTOS = [...inboundList.value, ...outboundList.value];
	const secondMileDeliveryMessageList = props.queryParams?.deliveryVOList.map(
		(item: any) => ({
			secondMileDeliveryId: item.id,
			takeNum: item.intoTotalQuantity,
			takeCarton: Math.ceil(
				(item.intoTotalQuantity || 0) / (item.singleCartonQuantity || 1)
			),
		})
	);
	const intoDataDTOSPost = intoDataDTOS.map((item: any) => ({
		diffQuantity: item.diffQuantity,
		secondMileDeliveryId: item.secondMileDeliveryId || item.deliveryId,
	}));
	const res = await confirmDiffAndGenerateOther({
		id: props.queryParams?.mainId,
		inboundTime: formData.value.inboundInfo.inboundTime,
		inboundRemark: formData.value.inboundInfo.remark,
		outboundTime: formData.value.outboundInfo.outboundTime,
		outboundRemark: formData.value.outboundInfo.remark,
		diffItems: intoDataDTOSPost,
		secondMileWarehouseDTO: {
			id: props.queryParams?.mainId,
			diffConfirmMode: true,
			secondMileDeliveryMessageList: secondMileDeliveryMessageList,
		},
	});
	if (res?.code === 0) {
		useMessage().success(t('操作成功'));
		emit('success');
		emit('update:modelValue', false);
	}
};

const handleCancel = () => {
	emit('update:modelValue', false);
	emit('cancel');
};

// 监听弹窗打开，加载数据
import { watch } from 'vue';
watch(
	() => props.modelValue,
	async (val) => {
		if (val) {
			resetState();
			await fetchDiffData();
		}
	}
);

defineExpose({
	resetState,
});
</script>

<template>
	<el-dialog
		v-model="dialogVisible"
		title="差异入库确认"
		width="80%"
		:close-on-click-modal="false"
		@close="handleCancel"
		draggable
	>
		<div v-loading="loading" class="dialog-container">
			<el-form
				ref="formRef"
				:model="formData"
				:rules="dynamicRules"
				label-width="120px"
			>
				<template v-if="inboundList.length > 0 || outboundList.length > 0">
					<el-tabs v-model="activeTab" type="border-card">
						<el-tab-pane
							label="入库"
							name="enter"
							:disabled="inboundList.length === 0"
						>
							<template #label>
								<span> 入库 ({{ inboundList.length }}) </span>
							</template>
							<el-row class="mb-4">
								<el-col :span="12">
									<el-form-item prop="warehouseName" label="仓库">
										{{ formData.inboundInfo.warehouseName || '-' }}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item prop="inboundInfo.inboundType" label="入库类型">
										调整入库
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item prop="inboundInfo.inboundTime" label="入库时间">
										<el-date-picker
											v-model="formData.inboundInfo.inboundTime"
											type="date"
											placeholder="选择入库时间"
											class="full-width"
											value-format="YYYY-MM-DD"
										/>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row class="mb-4">
								<el-col :span="24">
									<el-form-item prop="inboundInfo.remark" label="备注">
										<el-input
											v-model="formData.inboundInfo.remark"
											type="textarea"
											placeholder="请输入备注"
											maxlength="500"
											:autosize="{ minRows: 2, maxRows: 4 }"
										/>
									</el-form-item>
								</el-col>
							</el-row>
							<el-table :data="inboundList" border height="300">
								<el-table-column
									label="SKU"
									prop="skuCode"
									width="120"
									show-overflow-tooltip
								/>
								<el-table-column label="国家" prop="countryCode" width="80" />
								<el-table-column
									label="平台渠道"
									prop="platformChannelText"
									width="100"
								/>
								<el-table-column
									label="箱规编码"
									prop="cartonCode"
									width="130"
									show-overflow-tooltip
								/>
								<el-table-column
									label="MSKU"
									prop="mskuCode"
									width="130"
									show-overflow-tooltip
								/>
								<el-table-column
									label="部门&小组"
									prop="departmentName"
									min-width="150"
									show-overflow-tooltip
								>
									<template #default="{ row }">
										{{ row.departmentName }} & {{ row.deptName }}
									</template>
								</el-table-column>
								<el-table-column
									label="入库数量"
									prop="diffQuantity"
									width="100"
								/>
								<el-table-column
									label="公司库龄入库时间"
									prop="stockStartTime"
									width="140"
									show-overflow-tooltip
								/>
							</el-table>
						</el-tab-pane>
						<el-tab-pane
							label="出库"
							name="out"
							:disabled="outboundList.length === 0"
						>
							<template #label>
								<span> 出库 ({{ outboundList.length }}) </span>
							</template>
							<el-row class="mb-4">
								<el-col :span="12">
									<el-form-item prop="warehouseCode" label="仓库">
										{{ formData.outboundInfo.warehouseName || '-' }}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="出库类型"> 调整出库 </el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item
										prop="outboundInfo.outboundTime"
										label="出库时间"
									>
										<el-date-picker
											v-model="formData.outboundInfo.outboundTime"
											type="date"
											placeholder="选择出库时间"
											class="full-width"
											value-format="YYYY-MM-DD"
										></el-date-picker>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row class="mb-4">
								<el-col :span="24">
									<el-form-item
										prop="outboundInfo.remark"
										label="备注"
										required
									>
										<el-input
											v-model="formData.outboundInfo.remark"
											type="textarea"
											placeholder="请输入备注"
											maxlength="500"
											:autosize="{ minRows: 2, maxRows: 4 }"
										/>
									</el-form-item>
								</el-col>
							</el-row>
							<el-table :data="outboundList" border height="300">
								<el-table-column
									label="SKU"
									prop="skuCode"
									width="120"
									show-overflow-tooltip
								/>
								<el-table-column label="国家" prop="countryCode" width="80" />
								<el-table-column
									label="平台渠道"
									prop="platformChannelText"
									width="100"
								/>
								<el-table-column
									label="箱规编码"
									prop="cartonCode"
									width="130"
									show-overflow-tooltip
								/>
								<el-table-column
									label="MSKU"
									prop="mskuCode"
									width="130"
									show-overflow-tooltip
								/>
								<el-table-column
									label="部门&小组"
									prop="departmentName"
									min-width="150"
									show-overflow-tooltip
								>
									<template #default="{ row }">
										{{ row.departmentName }} & {{ row.deptName }}
									</template>
								</el-table-column>
								<el-table-column
									label="出库数量"
									prop="diffQuantity"
									width="100"
								/>
							</el-table>
						</el-tab-pane>
					</el-tabs>
				</template>

				<template v-else>
					<div>暂无数据</div>
				</template>
			</el-form>
		</div>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleCancel">取消</el-button>
				<el-button type="primary" @click="handleConfirm">确认</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<style lang="scss" scoped>
.full-width {
	width: 100%;
}

.empty-tip {
	padding: 40px 0;
	color: #999;
	font-size: 14px;
	text-align: center;
}

.diff-enter {
	color: #67c23a;
	font-weight: bold;
}

.diff-out {
	color: #f56c6c;
	font-weight: bold;
}
</style>
