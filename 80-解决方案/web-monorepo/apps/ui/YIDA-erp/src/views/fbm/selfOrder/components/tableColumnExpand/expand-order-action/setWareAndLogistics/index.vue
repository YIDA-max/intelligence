<script setup lang="ts">
import { ref } from 'vue';
import {
	postSetWareAndLogistics,
	batchSetWareAndLogistics,
} from '/@/api/fbm/selfOrder/index';
import { getWarehouseLogisticsChannelTree } from '/@/api/fbm/logisticsChannel/platformLogistics/index';
import { useI18n } from 'vue-i18n';
import { useMessage } from '/@/hooks/message';
const { t } = useI18n();
const props = defineProps({
	// 当前行数据
	currentRow: {
		type: Object,
		default: () => ({}),
	},
	// 批量模式时选中的多行数据
	selectedRows: {
		type: Array,
		default: () => [],
	},
	// 是否为批量模式
	isBatch: {
		type: Boolean,
		default: false,
	},
});
const dictMap = inject<any>('dictMap');
const getDataList = inject<any>('getDataList');
// 表单数据
const formData = ref<Record<string, any>>({
	warehouseCode: '',
	logisticsCode: '',
	inventoryUsageType: 1,
});
const rules = ref<Record<string, any>>({
	warehouseCode: [
		{ required: true, message: '请选择发货仓库', trigger: 'blur' },
	],
	logisticsCode: [
		{ required: true, message: '请选择物流渠道', trigger: 'blur' },
	],
	inventoryUsageType: [
		{ required: true, message: '请选择使用规格', trigger: 'blur' },
	],
});
const formRef = ref<any>(null);
const dialogRef = ref<any | null>(null);
// 弹窗显示与否
const dialogVisible = ref(false);
// 物流渠道列表
const logisticsChannelList = ref<Array<any>>([]);
/**
 * 初始化
 */
const init = () => {
	// 重置数据
	formData.value = {
		warehouseCode: '',
		logisticsCode: '',
		inventoryUsageType: 1,
	};
	logisticsChannelList.value = [];
};
/**
 * 处理仓库改变
 */
const handleWarehouseChange = async (value: string) => {
	// 根据仓库获取对应的物流渠道列表
	const res = await getWarehouseLogisticsChannelTree({
		warehouseCodes: [value],
		status: 1,
	});
	if (res.code === 0 && res.data) {
		logisticsChannelList.value = (res.data as unknown as any[]) || [];
	} else {
		logisticsChannelList.value = [];
	}
	// 清空物流渠道
	formData.value.logisticsCode = '';
};
/**
 * 确定
 */
const onSubmit = async (type: string) => {
	// 进行设置仓库和物流渠道的提交
	const valid = await formRef.value?.validate();
	if (!valid) return;
	const ids = props.selectedRows.map((item: any) => item.id);

	const postApi = props.isBatch
		? batchSetWareAndLogistics
		: postSetWareAndLogistics;
	const params = {
		id: props.isBatch ? undefined : props.currentRow.id,
		ids: props.isBatch ? ids : undefined,
		warehouseCode: formData.value.warehouseCode,
		warehouseName:
			dictMap.value.warehouseListType?.find(
				(item: any) => item.warehouseCode === formData.value.warehouseCode
			)?.warehouseName || '',
		logisticsCode: formData.value.logisticsCode,
		shippingReview: type === 'shippingReview' ? 1 : 0,
		inventoryUsageType: formData.value.inventoryUsageType,
	};
	const res = await postApi(params);
	// 当设置成功之后，触发订单物流费用试算
	if (res.code === 0) {
		useMessage().success('操作成功');
		hide();
		// 	// 当设置成功之后，触发订单物流费用试算 现在是后台自动异步 当时就应该自动触发试算 而不是前端调！
		// 	const resPutCalculateFeen = await putCalculateFeen({
		// 		orderNo: props.currentRow.selfOrderNo,
		// 		warehouseCode: formData.value.warehouseCode,
		// 		logisticsChannelCode: formData.value.logisticsCode,
		// 	});
		// 	if (resPutCalculateFeen.code !== 0) return;
		// 	useMessage().success('操作成功');
		// 	getDataList();
		// 	dialogVisible.value = false;
	}
};
/**
 * 打开弹窗方法
 * 供父组件调用
 */
const show = () => {
	dialogVisible.value = true;
};

/**
 * 关闭弹窗方法
 * 供父组件调用
 */
const hide = () => {
	// 触发数据列表刷新
	getDataList();
	dialogVisible.value = false;
};

// 暴露方法给父组件
defineExpose({
	show,
	hide,
});
</script>

<template>
	<el-dialog
		draggable
		ref="dialogRef"
		v-model="dialogVisible"
		:width="600"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:append-to-body="true"
		@open="init"
		@close="hide"
		:title="t('设置仓库物流')"
		:style="{
			height: '500px',
		}"
	>
		<div
			:style="{
				height: '300px',
				overflow: 'auto',
			}"
		>
			<el-form
				ref="formRef"
				:inline="false"
				label-position="left"
				:model="formData"
				:rules="rules"
				label-width="80px"
			>
				<!-- <div class="section-title"><span class="section-bar"></span>仓库</div> -->
				<el-row class="mb18">
					<el-col :span="24">
						<!-- 自营仓+三方仓+平台仓 -->
						<el-form-item label="发货仓库" prop="warehouseCode">
							<el-select
								clearable
								filterable
								v-model="formData.warehouseCode"
								@change="handleWarehouseChange"
								placeholder="请选择发货仓"
								style="width: 100%; padding-right: 16px"
							>
								<el-option
									v-for="item in dictMap.warehouseListType"
									:key="item.warehouseCode"
									:label="item.warehouseName"
									:value="item.warehouseCode"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<!-- <el-col :span="4">
						<el-link type="primary" underline="never">{{ t('查看库存') }}</el-link>
					</el-col> -->
				</el-row>
				<!-- <div class="section-title"><span class="section-bar"></span>{{ t('物流') }}</div> -->
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item label="物流渠道" prop="logisticsCode">
							<el-tree-select
								clearable
								filterable
								v-model="formData.logisticsCode"
								placeholder="物流渠道"
								style="width: 100%; padding-right: 16px"
								:data="logisticsChannelList"
								:props="{
									label: 'name',
									value: 'id',
									children: 'children',
								}"
							>
							</el-tree-select>
						</el-form-item>
					</el-col>
				</el-row>
				<!-- <div class="section-title"><span class="section-bar"></span>{{ t('使用规格') }}</div> -->
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item label="使用规格" prop="inventoryUsageType">
							<el-select
								v-model="formData.inventoryUsageType"
								placeholder="使用规格"
								style="width: 100%; padding-right: 16px"
							>
								<el-option :label="t('优先使用旧箱规')" :value="1" />
								<el-option :label="t('优先使用新箱规')" :value="2" />
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<template #footer>
			<div style="text-align: right">
				<el-button @click="hide">{{ t('取消') }}</el-button>
				<el-button @click="onSubmit('shippingReview')">{{
					t('确定并且发货审核')
				}}</el-button>
				<el-button type="primary" @click="onSubmit('submit')">{{
					t('确定')
				}}</el-button>
			</div>
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
.mb18 {
	margin-bottom: 18px;
}
</style>
