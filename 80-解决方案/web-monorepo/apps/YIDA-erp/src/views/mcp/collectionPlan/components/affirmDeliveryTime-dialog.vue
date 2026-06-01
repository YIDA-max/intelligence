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
				label-width="130px"
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
						<el-form-item label="提货单号" prop="pickupOrderNo">
							{{ props.currentRow.pickupOrderNo || '无' }}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="SKU" prop="skuCode">
							<MrTextEllipsis :text="props?.currentRow?.skuCode" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="本次提货数量" prop="pickupQuantity">
							{{ props.currentRow.pickupQuantity || '无' }}
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="8">
						<el-form-item label="计划提货日期" prop="plannedPickupDate">
							{{ props.currentRow.plannedPickupDate || '无' }}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="采购单号" prop="purchaseOrderNo">
							{{ props.currentRow.purchaseOrderNo || '无' }}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="采购数量" prop="purchaseNum">
							{{ props.currentRow.purchaseNum || '无' }}
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="8">
						<el-form-item label="PO单期望提货时间" prop="expectedPickupDate">
							{{ props.currentRow.expectedPickupDate || '无' }}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item
							label="PO单工厂标准交期"
							prop="factoryStandardDeliveryDate"
						>
							{{ props.currentRow.factoryStandardDeliveryDate || '无' }}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item
							label="PO单工厂回复交期"
							prop="factoryReplyDeliveryDate"
						>
							{{ props.currentRow.factoryReplyDeliveryDate || '无' }}
						</el-form-item>
					</el-col>
				</el-row>
				<div class="section-title">
					<span class="section-bar"></span>工厂信息
				</div>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="工厂回复交期" prop="deliveryTime">
							<el-date-picker
								v-model="formData.deliveryTime"
								type="date"
								placeholder="请选择日期"
								format="YYYY-MM-DD"
								value-format="YYYY-MM-DD"
								style="width: 100%"
								clearable
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item
							label="工厂简称"
							prop="factoryId"
							v-if="props.visibleType !== 'updateDeliveryTime'"
						>
							<el-select
								v-model="formData.factoryId"
								placeholder="请选择工厂简称"
								:disabled="props.visibleType === 'updateDeliveryTime'"
							>
								<el-option
									v-for="item in factoryList"
									:key="item.id"
									:label="item.factoryAbbreviation"
									:value="item.id"
								/>
							</el-select>
						</el-form-item>
						<el-form-item label="备注" prop="remark" v-else>
							<el-input v-model="formData.remark" placeholder="请输入备注" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item
							label="备注"
							prop="remark"
							v-if="props.visibleType !== 'updateDeliveryTime'"
						>
							<el-input
								v-model="formData.remark"
								type="textarea"
								placeholder="请输入备注"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row
					class="mb18"
					v-show="props.visibleType !== 'updateDeliveryTime'"
				>
					<el-col :span="12">
						<el-form-item label="国家-省-市-街道" prop="countryName">
							{{
								factoryList.find((item: any) => item.id === formData.factoryId)
									?.countryName
							}}
							{{
								factoryList.find((item: any) => item.id === formData.factoryId)
									?.provinceName
							}}
							{{
								factoryList.find((item: any) => item.id === formData.factoryId)
									?.cityName
							}}
							{{
								factoryList.find((item: any) => item.id === formData.factoryId)
									?.districtName
							}}
							{{
								factoryList.find((item: any) => item.id === formData.factoryId)
									?.streetName
							}}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="详细地址" prop="address">
							{{
								factoryList.find((item: any) => item.id === formData.factoryId)
									?.address
							}}
						</el-form-item>
					</el-col>
				</el-row>
				<el-row
					class="mb18"
					v-show="props.visibleType !== 'updateDeliveryTime'"
				>
					<el-col :span="12">
						<el-form-item label="联系人" prop="contact">
							{{
								factoryList.find((item: any) => item.id === formData.factoryId)
									?.contact
							}}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="联系电话" prop="phone">
							{{
								factoryList.find((item: any) => item.id === formData.factoryId)
									?.phone
							}}
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
import { ref, onMounted } from 'vue';
import { useMessage } from '/@/hooks/message';
import {
	postCollectionPlanAffirmDeliveryTime,
	postCollectionPlanUpdateDeliveryTime,
	getFactoryList,
} from '/@/api/mcp/collectionPlan';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props = defineProps({
	title: { type: String, default: '添加仓库' },
	currentRow: { type: Object, default: () => ({}) }, // 当前编辑的数据
	visibleType: { type: String, default: '' }, // 弹窗类型
});
const emit = defineEmits(['closeDialog', 'save']);

// 加载
const loading = ref(false);

// form表单
const formRef = ref();
const formData = ref<any>({
	remark: '', // 备注
	skuCode: '', // SKU
});

const rules = {
	deliveryTime: [
		{ required: true, message: '请选择回复交期', trigger: 'change' },
	],
	factoryId: [{ required: true, message: '请选择工厂简称', trigger: 'change' }],
};

// 工厂下拉数据
const factoryList = ref<any[]>([]);

onMounted(() => {});

// 打开弹窗
const handleOpen = async () => {
	// 获取工厂列表
	const res = await getFactoryList({
		// 查询条件
		purchaseNo: props.currentRow.purchaseOrderNo || '',
	});
	if (res.code === 0) {
		factoryList.value = res.data || [];
	}
	if (props.visibleType === 'updateDeliveryTime') {
		// 编辑的时候
		formData.value = {
			deliveryTime: props.currentRow.factoryDeliveryDate || '',
			factoryId: props.currentRow.factoryId || '',
			remark: props.currentRow.deliveryDateRemark || '',
		};
	} else if (props.visibleType === 'affirmDeliveryTime') {
		// 确认交期的时候
		formRef.value.resetFields();
		// 手动选中第一个工厂
		formData.value.factoryId = factoryList.value[0]?.id || '';
		// 手动设置工厂回复交期
		formData.value.deliveryTime = props.currentRow.factoryDeliveryDate || '';
	}
	//
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
		const api =
			props.visibleType === 'updateDeliveryTime'
				? postCollectionPlanUpdateDeliveryTime
				: postCollectionPlanAffirmDeliveryTime;
		const res = await api({
			...formData.value,
			id: props.currentRow.id || '',
		});
		if (res.code === 0) {
			useMessage().success('操作成功');

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
