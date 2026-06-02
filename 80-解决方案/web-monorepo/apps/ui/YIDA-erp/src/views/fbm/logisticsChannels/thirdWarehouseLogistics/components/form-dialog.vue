<template>
	<el-dialog
		v-bind="$attrs"
		:close-on-click-modal="false"
		:title="props.title"
		width="50%"
		@open="handleOpen"
		draggable
	>
		<div class="dialog-container">
			<el-form
				:model="formData"
				:rules="rules"
				ref="formRef"
				label-width="140px"
				:validate-on-rule-change="false"
			>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="三方仓" prop="warehouseCodes">
							<el-select
								v-model="formData.warehouseCodes"
								clearable
								filterable
								placeholder="三方仓"
								:disabled="
									props.visibleType === 'edit' || props.visibleType === 'detail'
								"
								@change="handleWarehouseChange"
							>
								<el-option
									v-for="item in props.dictMap.thirdWarehouseList"
									:key="item.warehouseCode"
									:label="`${item.spName}-${item.warehouseName}`"
									:value="item.warehouseCode"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="物流渠道名称" prop="logisticsChannelName">
							<el-input
								v-model="formData.logisticsChannelName"
								maxlength="50"
								show-word-limit
								placeholder="请输入"
								:disabled="
									props.visibleType === 'edit' || props.visibleType === 'detail'
								"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="物流渠道代码" prop="logisticsChannelCode">
							<el-input
								v-model="formData.logisticsChannelCode"
								maxlength="50"
								show-word-limit
								placeholder="请输入"
								:disabled="
									props.visibleType === 'edit' || props.visibleType === 'detail'
								"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="状态" prop="status">
							<el-select
								v-model="formData.status"
								placeholder="请选择"
								:disabled="props.visibleType === 'detail'"
							>
								<el-option
									v-for="item in [
										{
											label: '启用',
											value: 1,
										},
										{
											label: '禁用',
											value: 0,
										},
									]"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="是否自提物流" prop="selfPickupFlag">
							<el-select
								v-model="formData.selfPickupFlag"
								placeholder="请选择"
								:disabled="props.visibleType === 'detail'"
								@change="handleChangeSelfPickupFlag"
							>
								<el-option
									v-for="item in [
										{
											label: '是',
											value: 1,
										},
										{
											label: '否',
											value: 0,
										},
									]"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="自提物流渠道配置" prop="selfPickupConfig">
							<el-tree-select
								filterable
								v-model="formData.selfPickupConfig"
								placeholder="请选择"
								:disabled="props.visibleType === 'detail'"
								:data="
									handlePlatformLogisticsTree(
										props.dictMap.platformLogisticsTree || []
									)
								"
								multiple
								:check-strictly="true"
								:props="{
									children: 'children',
									label: 'name',
									value: 'id',
									disabled: 'disabled',
								}"
							>
							</el-tree-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="费用渠道" prop="feeLogisticsChannelIds">
							<el-select
								v-model="formData.feeLogisticsChannelIds"
								placeholder="请选择"
								@change="handleChangeFeeLogisticsChannelId"
								:disabled="props.visibleType === 'detail'"
								multiple
								filterable
							>
								<el-option
									v-for="item in feeLogisticsList"
									:key="item.logisticsProductId"
									:label="item.logisticsProductName"
									:value="item.logisticsProductId"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="渠道类型" prop="logisticsProviderName">
							<el-input
								v-model="formData.logisticsProviderName"
								placeholder="渠道类型"
								:disabled="true"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item label="备注" prop="remark">
							<el-input
								v-model="formData.remark"
								type="textarea"
								show-word-limit
								placeholder="请输入店铺别名"
								:disabled="props.visibleType === 'detail'"
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
							:disabled="props.visibleType === 'detail'"
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
							:disabled="props.visibleType === 'detail'"
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
							:disabled="props.visibleType === 'detail'"
							placeholder="请输入实际承运商"
							style="width: 100%"
						/>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">{{
					$t('common.cancelButtonText')
				}}</el-button>
				<el-button
					v-if="visibleType !== 'detail'"
					type="primary"
					@click="onSubmit"
					:disabled="loading"
					>{{ $t('保存') }}</el-button
				>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage } from '/@/hooks/message';
import { addInit, editInit, addFormInit } from './utils';
import {
	getChargesLogisticsChannelType,
	getChargesByWarehouseList,
} from '/@/api/charges/index';

const props = defineProps({
	title: { type: String, default: '新增店铺' },
	currentRow: { type: Object, default: () => ({}) }, // 当前编辑的数据
	visibleType: { type: String, default: '' }, // 弹窗类型
	dictMap: { type: Object, default: () => ({}) }, // 字典数据
});
const emit = defineEmits(['closeDialog', 'save']);

// 加载
const loading = ref(false);

// form表单
const formRef = ref();
const formData = ref<any>({});

const feeLogisticsList = ref<Array<any>>([]);

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
// 校验规则
const rules = ref({
	logisticsChannelCode: [
		{ required: true, message: '请输入物流渠道代码', trigger: 'blur' },
	],
	logisticsChannelName: [
		{ required: true, message: '请输入物流渠道中文名称', trigger: 'blur' },
	],
	selfPickupFlag: [
		{ required: true, message: '请选择是否自提物流', trigger: 'change' },
	],
	feeLogisticsChannelIds: [
		{ required: true, message: '请选择费用渠道', trigger: 'blur' },
	],
	warehouseCodes: [
		{ required: true, message: '请选择仓库', trigger: 'change' },
	],
	status: [{ required: true, message: '请选择状态', trigger: 'change' }],
	selfPickupConfig: [
		{
			required: false,
			message: '请选择自提物流渠道配置',
			trigger: 'change',
		},
	],
});
// 打开弹窗
const handleOpen = async () => {
	// 初始化部门数据
	loadDeptData();
	if (props.visibleType === 'edit' || props.visibleType === 'detail') {
		editInit(formData, props.currentRow);
		// 填充表格数据
		const mappingSaveList =
			props.currentRow.logisticsChannelMappingVOList || [];
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
		// 编辑时，根据三方仓获取费用渠道列表
		if (formData.value.warehouseCodes) {
			await handleWarehouseChange(formData.value.warehouseCodes);
		}
		// 费用渠道改变时联动渠道类型
		if (
			formData.value.feeLogisticsChannelIds?.length > 0 &&
			feeLogisticsList.value.length
		) {
			await handleChangeFeeLogisticsChannelId();
		}
		// 初始化的时候,自定义判断费用渠道是否必填,根据自提物流渠道配置是否必填
		handleChangeSelfPickupFlag();
	} else if (props.visibleType === 'add') {
		// 重置表单
		addInit(formData, formRef);
		// 清空费用渠道列表
		feeLogisticsList.value = [];
	}
};

// 关闭弹窗
const handleClose = () => {
	emit('closeDialog');
	formRef.value.clearValidate();
};

// 费用渠道改变时，联动渠道类型
const handleChangeFeeLogisticsChannelId = async () => {
	if (!formData.value.feeLogisticsChannelIds?.length) {
		formData.value.logisticsProviderName = '';
		return;
	}
	const res = await getChargesLogisticsChannelType({
		logisticsChannelIds: formData.value.feeLogisticsChannelIds,
	});
	if (res && res.code === 0) {
		formData.value.logisticsProviderName = formatType(res.data);
		formData.value.logisticsProductName = formData.value.logisticsProviderName;
	} else {
		formData.value.logisticsProviderName = '';
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

const formatType = (value: any) => {
	switch (value) {
		case 0:
			return '仓库渠道';
		case 1:
			return '自有渠道';
		case 2:
			return '平台渠道';
		case 3:
			return '其他渠道';
		default:
			return value;
	}
};
/**
 * 处理平台物流树数据
 * 只视为两层，只有一层children，父节点不能选中
 */
const handlePlatformLogisticsTree = (
	data: Array<{
		id: number;
		name: string;
		children: Array<{
			id: number;
			name: string;
		}>;
	}>
) => {
	if (!data || !Array.isArray(data) || data.length === 0) {
		return [];
	}
	const dataCopy = JSON.parse(JSON.stringify(data));
	// 目前先这样做，后续有问题再合后台一起改，要拉着后台一起做，不是前端自己搞的！
	// 只视为两层，只有一层children 然后父节点不能选中也不要有
	dataCopy.forEach((item: any) => {
		// 保留父节点的 id，但设置为不可选中
		// 注意：不要删除 id，因为 el-tree-select 需要 id 来维持树结构
		item.disabled = true;
		if (item.children && item.children.length > 0) {
			// 只保留一层 children，如果子节点还有 children，需要展开
			const flatChildren: any[] = [];
			item.children.forEach((child: any) => {
				// 如果子节点还有 children，展开它们
				if (
					child.children &&
					Array.isArray(child.children) &&
					child.children.length > 0
				) {
					flatChildren.push(...child.children);
				} else {
					flatChildren.push(child);
				}
			});
			item.children = flatChildren.map((child: any) => {
				return {
					...child,
					disabled: false, // 子节点可选中
				};
			});
		} else {
			item.children = [];
		}
	});

	return dataCopy;
};

// 三方仓改变时，获取费用渠道列表
const handleWarehouseChange = async (warehouseCode: string) => {
	if (!warehouseCode) {
		feeLogisticsList.value = [];
		formData.value.feeLogisticsChannelIds = [];
		formData.value.logisticsProviderName = '';
		return;
	}

	// 找到选中的三方仓信息
	const selectedWarehouse = props.dictMap.thirdWarehouseList.find(
		(item: any) => item.warehouseCode === warehouseCode
	);

	if (selectedWarehouse && selectedWarehouse.feeWarehouseId) {
		try {
			// 需要根据 feeWarehouseId 获取费用渠道列表
			const res = await getChargesByWarehouseList(
				selectedWarehouse.feeWarehouseId
			);
			if (res && res.data.length > 0) {
				feeLogisticsList.value = res.data;
			} else {
				feeLogisticsList.value = [];
				useMessage().error('当前仓库在费用系统中未配置物流渠道');
			}
		} catch (error) {
			feeLogisticsList.value = [];
		}
	} else {
		feeLogisticsList.value = [];
		useMessage().error('当前仓库未配置费用系统仓库');
	}
};

// 自提物流改变时，联动自提物流渠道配置
const handleChangeSelfPickupFlag = async () => {
	// 如果是是 自提物流渠道配置 就必填
	if (formData.value.selfPickupFlag === 1) {
		rules.value.selfPickupConfig = [
			{ required: true, message: '请选择自提物流渠道配置', trigger: 'change' },
		];
		// 费用渠道就是非必填了
		rules.value.feeLogisticsChannelIds = [
			{ required: false, message: '请选择费用渠道', trigger: 'blur' },
		];
	} else {
		rules.value.selfPickupConfig = [];
		formData.value.selfPickupConfig = [];
		// 费用渠道就是必填了
		rules.value.feeLogisticsChannelIds = [
			{ required: true, message: '请选择费用渠道', trigger: 'blur' },
		];
		// 自提物流渠道 就是非必填
		rules.value.selfPickupConfig = [
			{ required: false, message: '请选择自提物流渠道配置', trigger: 'change' },
		];
	}
};

// 提交
const onSubmit = async () => {
	loading.value = true;
	try {
		if (!formRef.value) return;

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

		// 校验表单
		const valid = await formRef.value.validate();
		if (!valid) return;
		await addFormInit(
			formData.value,
			{
				mappingSaveList,
				// // 物流商ID
				// providerId: props.currentSpInfo.id,
			},
			props.visibleType,
			props.currentRow,
			handleClose
		);
	} catch (error: any) {
		loading.value = false;
		useMessage().error(error.msg || '操作失败，请稍后重试');
		return;
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
	height: 40vh;
	overflow: auto;
}
.mb18 {
	margin-bottom: 18px;
}
/* 目标：与其它表单项一致，默认 32px；*/
:deep(.cascader-eq .el-input__wrapper) {
	min-height: 32px;
	height: 32px;
	padding-top: 2px; /* 让内容垂直居中 */
	padding-bottom: 2px;
}

/* multiple 模式的标签容器，避免把输入框“压矮” */
:deep(.cascader-eq .el-cascader__tags) {
	display: flex;
	align-items: center;
	margin-top: 15px; /* 去掉多余顶边距 */
	line-height: 20px;
}

/* 标签本身稍微压缩，防止撑高 */
:deep(.cascader-eq .el-tag) {
	height: 20px;
	line-height: 20px;
	padding: 0 6px;
	font-size: 12px;
}

/* 输入文字的行高 */
:deep(.cascader-eq .el-input__inner) {
	line-height: 28px;
}
</style>
