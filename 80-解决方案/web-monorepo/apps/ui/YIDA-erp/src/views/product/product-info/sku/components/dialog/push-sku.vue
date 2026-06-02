<template>
	<el-dialog
		:model-value="modelValue"
		@update:model-value="emit('update:modelValue', $event)"
		width="30%"
		:close-on-click-modal="false"
		draggable
		:destroy-on-close="false"
		@close="closePushSkuDialog()"
		:title="dialogTitle"
	>
		<div
			:style="{
				height: '40vh',
			}"
		>
			<el-row v-if="showSelectStock">
				<el-col :span="4">
					<div class="left-con">
						<div
							class="flex items-center"
							:style="{
								width: '500px',
							}"
						>
							<span class="mr-2.5">选择服务商</span>
							<TreeSelectInput
								v-model:queryForm="skuCodeAndSpList"
								:style="{ width: '220px' }"
								:settings="{
								getTreeData: getSpInfoList,
								text: '选择服务商',
								width: '220px',
								code: 'spIds',
								selectTreeProps: {
									value: 'id',
									label: 'spName'
								},
								getIdsCode: 'id',
								renderData: (data: any) => {
									return data.filter((item: any) => {
										return item.spDockConfigId && item.status === 1;
									}).map((item: any) => {
										return {
											...item,
											spName: item.spName,
										};
									});
								},
							}"
							/>
						</div>
					</div>
				</el-col>
			</el-row>

			<el-progress
				v-if="showProgress"
				:percentage="progressPercentage"
				:status="progressStatus"
				:text-inside="true"
				:stroke-width="15"
				style="margin: 20px 0"
			/>

			<div v-if="showPushSkuResult">
				<div class="errorTotal">
					<div class="items-total">
						<div class="fail-circle"></div>
						总数{{ result?.totalCount }}
					</div>
					<div class="items-total">
						<div class="fail-circle green"></div>
						成功{{ result?.successCount }}
					</div>
					<div class="items-total">
						<div class="fail-circle red"></div>
						失败{{ result?.failCount }}
					</div>
				</div>
				<div class="error-reason">
					<el-icon class="error-icon" style="color: #eb4d65; margin-right: 4px">
						<Warning />
					</el-icon>
					<div>{{ $t('失败原因') }}</div>
				</div>
				<el-table
					:data="result?.failInfos?.map((item) => ({ info: item }))"
					style="width: 100%"
					native-scrollbar
				>
					<el-table-column prop="info" show-overflow-tooltip></el-table-column>
				</el-table>
			</div>
		</div>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleCancel">{{
					$t('common.cancelButtonText')
				}}</el-button>
				<el-button type="primary" @click="doPushSku()" class="ml-2.5"
					>推送</el-button
				>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, defineAsyncComponent, watch } from 'vue';
import { getSpInfoList } from '/@/api/warehouse/spInfo/index';
import { postPushSpSku } from '/@/api/warehouse/spSku/index';
import { ElMessage } from 'element-plus';
import { Warning } from '@element-plus/icons-vue';
const showPushSkuResult = ref(false);
const showSelectStock = ref(true);
const isLoading = ref(false);
const showProgress = ref(false);
const progressPercentage = ref(0);
const progressStatus = ref(''); // '' | 'success' | 'exception'

const TreeSelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/tree-select-input.vue')
);

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	pushSkuCodeList: {
		type: Array,
		default: () => [],
	},
	title: {
		type: String,
		default: '',
	},
});

const skuCodeAndSpList = ref({
	spIds: [] as number[],
	skuCodes: [] as string[],
});

watch(
	() => props.pushSkuCodeList,
	(newVal) => {
		if (newVal && Array.isArray(newVal)) {
			skuCodeAndSpList.value.skuCodes = [...(newVal as string[])];
		}
	},
	{ immediate: true, deep: true }
);

const dialogTitle = ref(props.title);

const result = reactive({
	totalCount: 0,
	successCount: 0,
	failCount: 0,
	failInfos: [] as string[],
});

const resetPushResult = () => {
	Object.assign(result, {
		totalCount: 0,
		successCount: 0,
		failCount: 0,
		failInfos: [],
	});
};

const setInitialShowState = () => {
	showPushSkuResult.value = false;
	showSelectStock.value = true;
	showProgress.value = false;
	isLoading.value = false;
};

// 清除选择仓库下拉框的值
const clearSpIdList = () => {
	skuCodeAndSpList.value.spIds = [];
};

// 清理对话框状态（点击 x 号时自动关闭，只需要清理状态）
const closePushSkuDialog = () => {
	setInitialShowState();
	clearSpIdList();
};

// 关闭对话框（点击取消按钮时调用）
const handleCancel = () => {
	setInitialShowState();
	clearSpIdList();
	emit('update:modelValue', false);
};

const doPushSku = async () => {
	// 判断是否有选中三方仓服务商
	if (skuCodeAndSpList.value.spIds.length === 0) {
		ElMessage.warning('未选择任何仓库');
		return;
	}

	showSelectStock.value = false;
	dialogTitle.value = '推送结果';

	resetPushResult();
	showPushSkuResult.value = false;

	isLoading.value = true;
	showProgress.value = true;
	progressPercentage.value = 0;
	progressStatus.value = '';

	try {
		const progressTimer = setInterval(() => {
			if (progressPercentage.value < 90) {
				progressPercentage.value += 5;
			}
		}, 200);

		// 发送异步请求
		const res = await postPushSpSku({ ...skuCodeAndSpList.value });
		if (res.code === 0) {
			Object.assign(result, res.data);
		}

		// 清除定时器
		clearInterval(progressTimer);

		// 完成进度
		progressPercentage.value = 100;
		progressStatus.value = 'success';
		isLoading.value = false;

		let tipMessage = result.failCount > 0 ? '推送完成！' : '推送成功！';
		ElMessage.success(tipMessage);

		// 显示统计结果
		showPushSkuResult.value = true;
	} catch (error) {
		progressPercentage.value = 100;
		progressStatus.value = 'exception';
		isLoading.value = false;
		const errorMsg = 'sku推送三方仓失败：' + error;
		ElMessage.error(errorMsg);

		result.failInfos = [errorMsg];
		showPushSkuResult.value = true;
	}
};
</script>

<style lang="scss" scoped>
.errorTotal {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin: 20px 5px;
	font-size: 16px;
	border-top: 1px solid #f0f0f0;
	border-bottom: 1px solid #f0f0f0;
	padding: 10px;
}
.fail-circle {
	width: 5px;
	height: 5px;
	border-radius: 50%;
	background-color: #000;
	margin-right: 10px;
}
.items-total {
	display: flex;
	flex-direction: row;
	align-items: center;
}
.green {
	background-color: #94d394;
}
.green {
	background-color: #94d394;
}
.red {
	background-color: #eb4d65;
}
.error-reason {
	display: flex;
	flex-direction: row;
	align-items: center;
}
</style>
