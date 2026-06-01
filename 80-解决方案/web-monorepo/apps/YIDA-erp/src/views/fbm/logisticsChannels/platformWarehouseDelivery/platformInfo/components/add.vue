<template>
	<el-dialog
		v-model="visible"
		:close-on-click-modal="false"
		:title="props.title"
		width="80%"
		@close="handleClose"
		@open="handleOpen"
		draggable
	>
		<div class="dialog-container">
			<el-row class="mb18">
				<el-col :span="20">
					<el-text class="batch-add-title"
						>物流渠道：{{
							props.currentRow.logisticsChannelCode ?? '-'
						}}</el-text
					>
					<el-text class="batch-add-title ml30"
						>映射关系：{{ state.dataList?.length || 0 }}条</el-text
					>
				</el-col>
				<el-col :span="3" v-if="props.visibleType !== 'detail'">
					<BatchAddPopover
						ref="batchAddPopoverRef"
						:dictMap="props.dictMap"
						@confirm="handleBatchAddConfirm"
						@cancel="handleBatchAddCancel"
					/>
					<Copy
						:currentRow="props.currentRow"
						ref="copyRef"
						@confirm="confirmCopy"
					/>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="24">
					<el-table
						:data="state.dataList"
						style="width: 100%"
						v-loading="state.loading"
						border
						ref="tableRef"
						row-key="id"
						:cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle"
						native-scrollbar
					>
						<el-table-column type="index" :label="$t('序号')" width="80" />
						<el-table-column prop="platformWareActualCarrie">
							<template #header>
								<span
									:style="{
										color: '#f78c8c',
										marginRight: '3px',
									}"
									>*
								</span>
								{{ $t('平台仓实际承运商') }}
							</template>
							<template #default="{ row }">
								<el-select
									clearable
									filterable
									v-model="row.platformWareActualCarrie"
									placeholder="平台仓实际承运商"
									:disabled="props.visibleType === 'detail'"
								>
									<el-option
										v-for="item in props.dictMap.carrieList['Amazon']"
										:key="item.name"
										:label="item.name"
										:value="item.name"
									/>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column prop="correspondingPlatform">
							<template #header>
								<span
									:style="{
										color: '#f78c8c',
										marginRight: '3px',
									}"
									>*
								</span>
								{{ $t('对应平台') }}
							</template>
							<template #default="{ row }">
								<el-select
									clearable
									filterable
									v-model="row.correspondingPlatform"
									placeholder="对应平台"
									:disabled="props.visibleType === 'detail'"
								>
									<el-option
										v-for="item in props.dictMap.platform"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column prop="standardShippingCarrier">
							<template #header>
								<span
									:style="{
										color: '#f78c8c',
										marginRight: '3px',
									}"
									>*
								</span>
								{{ $t('标发承运商') }}
							</template>
							<template #default="{ row }">
								<el-select
									clearable
									filterable
									v-model="row.standardShippingCarrier"
									placeholder="标发承运商"
									:disabled="props.visibleType === 'detail'"
								>
									<el-option
										v-for="item in props.dictMap.carrieList[
											row.correspondingPlatform
										]"
										:key="item.name"
										:label="item.name"
										:value="item.name"
									/>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column
							prop="mappingService"
							v-if="props.visibleType !== 'detail'"
						>
							<template #header>
								{{ $t('Shipping Service') }}
							</template>
							<template #default="{ row }">
								<el-input
									v-model="row.mappingService"
									placeholder="请输入"
									style="width: 100%"
								/>
							</template>
						</el-table-column>
						<el-table-column
							:label="$t('common.action')"
							width="150"
							fixed="right"
							v-if="props.visibleType !== 'detail'"
						>
							<template #default="{ row, $index: index }">
								<el-button :icon="Minus" @click="handleDelete(row, index)" />
							</template>
						</el-table-column>
					</el-table>
				</el-col>
			</el-row>
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
import { ref } from 'vue';
import { useMessage } from '/@/hooks/message';
import { Minus } from '@element-plus/icons-vue';
import { BasicTableProps, useTable } from '/@/hooks/table';

const BatchAddPopover = defineAsyncComponent(
	() => import('./BatchAddPopover.vue')
);
const Copy = defineAsyncComponent(() => import('./copy.vue'));
import { batchSave } from '/@/api/fbm/logisticsChannel/platformWarehouseDelivery';
const props = defineProps({
	title: { type: String, default: '标发映射关系' },
	currentRow: { type: Object, default: () => ({}) }, // 当前编辑的数据
	visibleType: { type: String, default: '' }, // 弹窗类型
	dictMap: { type: Object, default: () => ({}) }, // 字典数据
});
const emit = defineEmits(['closeDialog', 'save']);
// 加载
const loading = ref(false);

// form表单

// 批量添加组件引用
const batchAddPopoverRef = ref<any>(null);

const visible = ref(false);

// 表格数据
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	descs: [''],
	isPage: false,
});
// tableRef
const tableRef = ref<any>(null);
//  table hook
const { tableStyle, setTableData } = useTable(state, tableRef);

// 打开弹窗
const handleOpen = async () => {
	const currentRow = JSON.parse(JSON.stringify(props.currentRow));
	// 根据部门ID查询人员
	// 编辑时初始化数据
	setTableData(currentRow.mappings || []);
	visible.value = true;
};

// 批量添加取消
const handleBatchAddCancel = () => {
	// 组件内部已处理关闭和重置逻辑
};

// 批量添加确认
const handleBatchAddConfirm = (formData: {
	carriers: string[];
	platforms: string[];
}) => {
	const { carriers, platforms } = formData;

	// 校验是否选择了数据
	if (!carriers || carriers.length === 0) {
		useMessage().warning('请选择平台仓实际承运商');
		return;
	}
	if (!platforms || platforms.length === 0) {
		useMessage().warning('请选择对应平台');
		return;
	}
	// 批量新增的数据
	const newItems: any[] = [];
	carriers.forEach((carrier) => {
		platforms.forEach((platform) => {
			newItems.push({
				platformWareActualCarrie: carrier,
				correspondingPlatform: platform,
				standardShippingCarrier: '',
			});
		});
	});

	// 过滤重复数据
	const filterResult = filterArrData(newItems);
	if (!filterResult) {
		return;
	}
	const {
		currentData: existingData,
		filteredNewItems,
		duplicateCount,
	} = filterResult;
	const mergedData = [...existingData, ...filteredNewItems];
	setTableData(mergedData);
	useMessage().success(
		duplicateCount > 0
			? `已过滤 ${duplicateCount} 条数据，成功添加 ${filteredNewItems.length} 条数据`
			: `成功添加 ${filteredNewItems.length} 条映射关系`
	);

	// 关闭弹窗并重置表单
	batchAddPopoverRef.value?.close();
	batchAddPopoverRef.value?.reset();
};

// 复制弹窗ref
const copyRef = ref();
// 复制
const confirmCopy = (selectArr: Array<any>) => {
	if (!selectArr.length) {
		useMessage().warning('暂无可复制的数据');
		return;
	}
	const filterResult = filterArrData(selectArr);
	if (!filterResult) {
		return;
	}
	const {
		currentData: existingData,
		filteredNewItems,
		duplicateCount,
	} = filterResult;
	const mergedData = [...existingData, ...filteredNewItems];
	setTableData(mergedData);
	useMessage().success(
		duplicateCount > 0
			? `已过滤 ${duplicateCount} 条数据，成功复制 ${filteredNewItems.length} 条数据`
			: `成功复制 ${filteredNewItems.length} 条映射关系`
	);
	copyRef.value?.handleCancel();
};

/**
 * 过滤重复数据的通用函数
 * @param newArr 待添加的数据数组
 */
const filterArrData = (newArr: Array<any>) => {
	const currentData = [...(state.dataList || [])];

	let duplicateCount = 0;
	const filteredNewItems = newArr.filter((newItem) => {
		// 是否有重复的映射关系
		const exists = currentData.some(
			(existingItem) =>
				existingItem.platformWareActualCarrie ===
					newItem.platformWareActualCarrie &&
				existingItem.correspondingPlatform === newItem.correspondingPlatform
		);
		// 判断重复的次数
		if (exists) {
			duplicateCount += 1;
		}
		return !exists;
	});

	return {
		currentData,
		filteredNewItems,
		duplicateCount,
	};
};
// 删除行
const handleDelete = (row: any, index: number) => {
	const dataList = [...(state.dataList ? state.dataList : [])];
	// 最少保留一行
	// if (dataList.length <= 1) {
	// 	useMessage().warning('请至少保留一条映射关系');
	// 	return;
	// }
	dataList.splice(index, 1);
	setTableData(dataList);
};

// 关闭弹窗
const handleClose = () => {
	batchAddPopoverRef.value?.close();
	visible.value = false;
	emit('closeDialog');
};

// 提交
const onSubmit = async () => {
	loading.value = true;
	try {
		const dataList = state.dataList ? [...state.dataList] : [];
		// 判断是否有数据
		// if (dataList.length === 0) {
		// 	useMessage().warning('请添加标发映射关系');
		// 	return;
		// }

		// 检查映射关系是否重复
		const seen = new Set();
		const duplicates = [];
		for (let i = 0; i < dataList.length; i++) {
			const item = dataList[i];
			const key = `${item.platformWareActualCarrie}-${item.correspondingPlatform}`;
			if (seen.has(key)) {
				duplicates.push(key);
			} else {
				seen.add(key);
			}
		}
		if (duplicates.length > 0) {
			const duplicateKeys = [...new Set(duplicates)];
			useMessage().warning(
				`存在重复的映射关系：${duplicateKeys.join(
					'、'
				)}。一个平台仓实际承运商在同一个对应平台只能有一条映射关系`
			);
			return;
		}

		// 判断平台仓实际承运商是否选择
		for (const item of dataList) {
			if (!item.platformWareActualCarrie) {
				useMessage().warning('请选择平台仓实际承运商');
				return;
			}
		}
		// 判断对应平台是否选择
		for (const item of dataList) {
			if (!item.correspondingPlatform) {
				useMessage().warning('请选择对应平台');
				return;
			}
		}

		// 判断标发承运商
		for (const item of dataList) {
			if (!item.standardShippingCarrier) {
				useMessage().warning(`请选择标发承运商`);
				return;
			}
		}

		const api = batchSave;
		const parasm = {
			id: props.currentRow.id,
			mappings: dataList,
		};
		const res = await api(parasm);
		if (res.code === 0) {
			useMessage().success('操作成功');
			// 清空表格数据
			setTableData([]);
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
	handleClose,
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
