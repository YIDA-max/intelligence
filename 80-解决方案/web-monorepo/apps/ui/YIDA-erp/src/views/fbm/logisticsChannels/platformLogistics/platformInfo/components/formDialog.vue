<script setup lang="ts">
import { ref } from 'vue';
import { useMessage } from '/@/hooks/message';
import { BasicTableProps, useTable } from '/@/hooks/table';
import {
	postPlatformLogisticsSave,
	PlatformLogisticsSaveDTO,
	postPlatformLogisticsUpdate,
} from '/@/api/fbm/logisticsChannel/platformLogistics/index';
const props = defineProps({
	title: { type: String, default: '标发映射关系' },
	currentRow: { type: Object, default: () => ({}) }, // 当前编辑的数据
	formDialogType: { type: String, default: '' }, // 弹窗类型
	dictMap: { type: Object, default: () => ({}) }, // 字典数据
	currentSpInfo: { type: Object, default: () => ({}) }, // 当前选择的服务商信息
});
const emit = defineEmits(['getDataList']);
// 加载
const loading = ref(false);
// 弹窗显示控制
const dialogVisible = ref(false);
// form表单
const formData = ref<PlatformLogisticsSaveDTO>({
	// 物流渠道代码
	logisticsChannelCode: '',
	// 物流渠道名称
	logisticsChannelName: '',
	// 备注
	remark: '',
	// 状态
	status: 1,
	// 标发设置
	mappingSaveList: [],
	// 物流商ID
	providerId: undefined,
});
// form ref
const formRef = ref<any>(null);
// 表单校验规则
const rules = ref<any>({
	logisticsChannelName: [
		{ required: true, message: '请输入物流渠道名称', trigger: 'blur' },
	],
	logisticsChannelCode: [
		{ required: true, message: '请输入物流渠道代码', trigger: 'blur' },
	],
});

// 表格数据
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	// pageList: getMaterialList,
	descs: [''],
	isPage: false,
});
// tableRef
const tableRef = ref<any>(null);
//  table hook
const { tableStyle, setTableData, getTableData } = useTable(state, tableRef);
// 打开弹窗
const init = async () => {
	// 初始化部门数据
	loadDeptData();
	// 编辑时填充数据
	if (props.formDialogType === 'edit') {
		formData.value = {
			...props.currentRow,
		};
		// 填充表格数据
		const mappingSaveList = props.currentRow.mappingSaveList || [];
		const tableData = getTableData() || [];
		tableData.forEach((item: any) => {
			const matchItem = mappingSaveList.find(
				(mapItem: any) =>
					mapItem.correspondingPlatform === item.correspondingPlatform
			);
			if (matchItem) {
				item.standardShippingCarrier = matchItem.standardShippingCarrier;
				item.trackingNoUploadMethod = matchItem.trackingNoUploadMethod;
				item.actualCarrie = matchItem.actualCarrie;
			}
		});
	} else if (props.formDialogType === 'add') {
		// 新增时重置表单
		formData.value = {
			// 物流渠道代码
			logisticsChannelCode: '',
			// 物流渠道名称
			logisticsChannelName: '',
			// 备注
			remark: '',
			// 状态
			status: 1,
			// 标发设置
			mappingSaveList: [],
			// 物流商ID
			providerId: undefined,
		};
	}
};
/**
 * 初始化部门数据
 */
const loadDeptData = async () => {
	const arr: {}[] = [];
	props.dictMap.platformChannel?.forEach((platform: any) => {
		// 数据填充
		arr.push({
			correspondingPlatform: platform.label,
		});
	});
	setTableData(arr);
};

// 提交
const onSubmit = async () => {
	loading.value = true;
	try {
		// 先校验表格数据
		const tableData = getTableData() || [];
		for (let index = 0; index < tableData.length; index++) {
			const item = tableData[index];
			const hasAnyField =
				item.standardShippingCarrier ||
				item.trackingNoUploadMethod ||
				item.actualCarrie;

			// 如果三个字段都没填，跳过（不报错）
			if (!hasAnyField) {
				continue;
			}

			// 平台标发承运商 和 跟踪号上传方式 只要有一个填写了，另外一个就必填
			// 实际承运商可以不填，但不能单独填写
			const hasStandardShippingCarrier = !!item.standardShippingCarrier;
			const hasTrackingNoUploadMethod = !!item.trackingNoUploadMethod;
			const hasActualCarrie = !!item.actualCarrie;

			// 仅填写实际承运商不允许
			if (
				hasActualCarrie &&
				!hasStandardShippingCarrier &&
				!hasTrackingNoUploadMethod
			) {
				const errorMsg = `第 ${index + 1} 行（平台：${
					item.correspondingPlatform
				}）仅填写了：实际承运商`;
				useMessage().error(`请完善以下信息后再提交：${errorMsg}`);
				loading.value = false;
				return;
			}

			// 如果平台标发承运商或跟踪号上传方式任意一个填写了，另一个必须填写
			if (hasStandardShippingCarrier && !hasTrackingNoUploadMethod) {
				const errorMsg = `第 ${index + 1} 行（平台：${
					item.correspondingPlatform
				}）缺少：跟踪号上传方式`;
				useMessage().error(`请完善以下信息后再提交：${errorMsg}`);
				loading.value = false;
				return;
			}
			if (hasTrackingNoUploadMethod && !hasStandardShippingCarrier) {
				const errorMsg = `第 ${index + 1} 行（平台：${
					item.correspondingPlatform
				}）缺少：平台标发承运商`;
				useMessage().error(`请完善以下信息后再提交：${errorMsg}`);
				loading.value = false;
				return;
			}
		}

		// 过滤掉三个字段都没填的行，只保留至少填写了一个字段的行
		// 实际承运商可以不填
		const mappingSaveList = tableData
			.filter((item: any) => {
				return item.standardShippingCarrier || item.trackingNoUploadMethod;
			})
			.map((item: any) => ({
				// 手动添加物流渠道代码
				logisticsChannelCode: formData.value.logisticsChannelCode || '',
				correspondingPlatform: item.correspondingPlatform,
				standardShippingCarrier: item.standardShippingCarrier,
				trackingNoUploadMethod: item.trackingNoUploadMethod,
				actualCarrie: item.actualCarrie,
			}));

		const params: PlatformLogisticsSaveDTO = {
			...formData.value,
			// 编辑时传ID，新增不传
			id: props.formDialogType === 'edit' ? props.currentRow.id : undefined,
			// 物流商ID
			providerId: props.currentSpInfo.id,
			mappingSaveList,
		};
		const api =
			props.formDialogType === 'edit'
				? postPlatformLogisticsUpdate
				: postPlatformLogisticsSave;
		//
		const res = await api(params);
		if (res.code === 0) {
			useMessage().success('操作成功');
			emit('getDataList');
			hide();
		}
	} catch (error: any) {
		useMessage().error(error.msg || '操作失败，请稍后重试');
	} finally {
		loading.value = false;
	}
};
/**
 * 打开弹窗方法
 * 供父组件调用
 */
const show = async () => {
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
});
</script>
<template>
	<el-dialog
		draggable
		ref="dialogRef"
		v-model="dialogVisible"
		:width="1000"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:append-to-body="true"
		@open="init"
		@close="hide"
	>
		<div class="dialog-container">
			<div class="section-title">
				<span class="section-bar"></span>
				<span class="mr-2"> 基础信息</span>
			</div>
			<el-form
				:model="formData"
				ref="formRef"
				label-width="120px"
				:rules="rules"
			>
				<el-row class="mb-4">
					<el-col :span="12">
						<el-form-item label="物流商" prop="recipientName">
							{{ currentSpInfo.name }}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="物流渠道名称" prop="logisticsChannelName">
							<el-input
								:disabled="formDialogType === 'edit'"
								v-model="formData.logisticsChannelName"
								placeholder="请输入物流渠道名称"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb-4">
					<el-col :span="12">
						<el-form-item label="物流渠道代码" prop="logisticsChannelCode">
							<el-input
								:disabled="formDialogType === 'edit'"
								v-model="formData.logisticsChannelCode"
								placeholder="请输入物流渠道代码"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="状态" prop="status">
							<el-switch
								v-model="formData.status"
								:active-value="1"
								:inactive-value="0"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb-4">
					<el-col :span="24">
						<el-form-item label="备注" prop="remark">
							<el-input
								v-model="formData.remark"
								placeholder="请输入备注"
								type="textarea"
							/>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div class="section-title">
				<span class="section-bar"></span>
				<span class="mr-2"> 标发设置</span>
			</div>
			<el-table
				ref="tableRef"
				:data="state.dataList"
				v-loading="state.loading"
				border
				height="300"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
				native-scrollbar
			>
				<el-table-column
					:label="$t('平台')"
					prop="correspondingPlatform"
					show-overflow-tooltip
				></el-table-column>
				<el-table-column
					:label="$t('平台标发承运商')"
					prop="opsType"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						<el-select
							v-model="row.standardShippingCarrier"
							placeholder="请选择平台标发承运商"
							style="width: 100%"
							filterable
						>
							<el-option
								v-for="item in props.dictMap.carrieList[
									`${row.correspondingPlatform}`
								] || []"
								:key="item.name"
								:label="item.name"
								:value="item.name"
							/>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column
					:label="$t('跟踪号上传方式')"
					prop="logContent"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						<el-select
							v-model="row.trackingNoUploadMethod"
							placeholder="请选择平台标发承运商"
							style="width: 100%"
						>
							<el-option
								v-for="item in [
									{
										label: '跟踪号上传',
										value: 1,
									},
									{
										label: '运单号上传',
										value: 2,
									},
								]"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column
					:label="$t('实际承运商')"
					prop="actualCarrie"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						<el-input
							v-model="row.actualCarrie"
							placeholder="请输入实际承运商"
							style="width: 100%"
						/>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="hide">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">{{
					$t('保存')
				}}</el-button>
			</span>
		</template>
		<!-- 选择产品弹窗 -->
	</el-dialog>
</template>

<style lang="scss" scoped>
.dialog-container {
	padding: 0 20px;
	height: 60vh;
	overflow: auto;
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
}
</style>
