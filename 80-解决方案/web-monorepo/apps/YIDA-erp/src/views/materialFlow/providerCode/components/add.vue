<template>
	<el-dialog
		v-bind="$attrs"
		:close-on-click-modal="false"
		width="700px"
		:title="props.title"
		@close="handleClose"
		@open="handleOpen"
		draggable
	>
		<div class="dialog-container">
			<el-form
				:model="formData"
				:rules="rules"
				ref="formRef"
				label-width="120px"
			>
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item label="发货仓库" prop="warehouseCode">
							<el-select-v2
								v-model="formData.warehouseCode"
								:disabled="!!props.editData?.id"
								:options="warehouseOption"
								placeholder="请选择发货仓库"
								clearable
								filterable
								:props="{
									value: 'warehouseCode',
									label: 'warehouseName',
									children: 'children',
									emitPath: false,
								}"
								@change="handleWarehouseChange"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item label="物流渠道" prop="courierCode">
							<el-select-v2
								v-model="formData.courierCode"
								:disabled="!!props.editData?.id || !formData.warehouseCode"
								:options="channelTreeData"
								placeholder="物流渠道"
								clearable
								filterable
								@change="handleCourierChange"
								:props="{
									value: 'logisticsChannelCode',
									label: 'logisticsChannelName',
									children: 'children',
									emitPath: false,
								}"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item label="服务商代码" prop="platformCourierId">
							<el-select
								v-model="formData.platformCourierId"
								remote-show-suffix
								placeholder="请选择"
								filterable
								remote
								:remote-method="remoteMethod"
							>
								<el-option
									v-for="item in platformCourierOption"
									:key="item.id"
									:label="item.courierName"
									:value="item.id"
								/>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item label="对接平台" prop="platformId">
							<!-- 当前硬编码 -->
							51Tracking
						</el-form-item>
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
import { getWarehouseInfoList } from '/@/api/warehouse/third-warehouse/index';
import {
	platformCourierList,
	addLogisticsCourier,
	editLogisticsCourier,
} from '/@/api/materialFlow/providerCode';
import { getLogisticsChannelList } from '/@/api/fbm/selfOrder/index';

const props = defineProps({
	title: { type: String, default: '添加仓库' },
	editData: { type: Object, default: () => ({}) },
});
const emit = defineEmits(['closeDialog', 'save']);

// 加载
const loading = ref(false);
//   初始化数据
const warehouseOption = ref<
	Array<{ warehouseCode: string; warehouseName: string }>
>([]);
const loadWarehouseOption = async () => {
	const res = await getWarehouseInfoList({ status: 1 });
	warehouseOption.value = res?.data || [];
};
// ==================== 初始化和数据加载 ====================
// 数据源
const channelTreeData = ref<Array<Record<string, any>>>([]); // 指定模式：渠道树
const getChannelDataByWarehouseCodes = async (warehouseCode?: string) => {
	//接口要保存
	const channelRes = await getLogisticsChannelList({
		warehouseCodes: warehouseCode ? [warehouseCode] : [],
		status: 1,
		current: 1,
		size: 1000000000000,
	});
	if (channelRes.code === 0) {
		channelTreeData.value = channelRes?.data?.records || [];
	}
};

const handleWarehouseChange = (value: string) => {
	getChannelDataByWarehouseCodes(value);
};
const handleCourierChange = (value: string) => {
	if (!value) {
		formData.value.logisticsChannelName = '';
		return;
	}
	const selectedChannel = channelTreeData.value.find(
		(item) => item.logisticsChannelCode === value
	);
	if (selectedChannel) {
		formData.value.logisticsName = selectedChannel.logisticsChannelName;
		formData.value.logisticsChannelCode = selectedChannel.logisticsChannelCode;
		formData.value.courierName = selectedChannel.logisticsChannelName;
	}
};

onMounted(() => {
	getPlatformCourierOption();
	loadWarehouseOption();
});

interface CourierCodeType {
	courierName: string;
	id: number;
}
// 服务商代码列表
const platformCourierOption = ref<CourierCodeType[]>([]);
// 获取服务商列表
const getPlatformCourierOption = async (query: string = '') => {
	const res = await platformCourierList({
		courierCode: query,
	});
	platformCourierOption.value = res.data;
};
// 服务商远程搜索
const remoteMethod = (query: string) => {
	getPlatformCourierOption(query);
};

// form表单
const formRef = ref();
const formData = ref<{ [key: string]: string | number }>({ platformId: 1 });

// 校验规则
const rules = {
	courierCode: [
		{ required: true, message: '物流渠道不能为空', trigger: 'blur' },
	],
	warehouseCode: [
		{ required: true, message: '仓库名称不能为空', trigger: 'blur' },
	],
	platformCourierId: [
		{ required: true, message: '服务商代码不能为空', trigger: 'change' },
	],
};

// 打开弹窗
const handleOpen = async () => {
	if (props.editData && Object.keys(props.editData).length) {
		formData.value.courierCode = props.editData.courierCode;
		formData.value.warehouseCode = props.editData.warehouseCode;
		formData.value.platformCourierId = props.editData.platformCourierId;
		formData.value.id = props.editData.id;
		// 回显时加载对应仓库的渠道数据
		if (props.editData.warehouseCode) {
			await getChannelDataByWarehouseCodes(props.editData.warehouseCode);
		}
	} else {
		resetForm();
	}
};

// 关闭弹窗
const handleClose = () => {
	emit('closeDialog');
	resetForm();
};

// 重置表单
function resetForm() {
	formRef.value?.resetFields();
	Object.keys(formData.value).forEach((key) => (formData.value[key] = ''));
	channelTreeData.value = [];
}

// 提交
const onSubmit = () => {
	formRef.value.validate(async (valid: boolean) => {
		if (valid) {
			let api =
				props.editData && Object.keys(props.editData).length
					? editLogisticsCourier
					: addLogisticsCourier;
			try {
				const res = await api(formData.value);
				if (res.code === 0) {
					useMessage().success('添加成功');
					emit('save');
					handleClose();
				}
			} catch (error: any) {
				useMessage().error(error.msg);
			}
		}
	});
};

defineExpose({
	handleOpen,
});
</script>

<style lang="scss" scoped>
.dialog-container {
	padding: 0 20px;
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
:deep(.el-cascader) {
	width: 100%;
}
</style>
