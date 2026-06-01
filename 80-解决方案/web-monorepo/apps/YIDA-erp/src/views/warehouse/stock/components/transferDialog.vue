<template>
	<!-- <el-dialog
		v-model="visible"
		width="80%"
		:close-on-click-modal="false"
		draggable
		:destroy-on-close="false"
		title="转库存申请"
	> -->
	<div class="dialog-container">
		<div class="section-title"><span class="section-bar"></span>原库存信息</div>
		<el-table
			:data="originList"
			border
			size="small"
			v-loading="loading.origin"
			native-scrollbar
		>
			<el-table-column prop="warehouseCode" label="仓库" width="120">
				<template #default="{ row }"
					>{{ row.warehouseName ?? '---' }}
				</template>
			</el-table-column>
			<el-table-column prop="legalPersonId" label="法人主体" width="120">
				<template #default="{ row }"
					>{{ row.legalPersonName ?? '---' }}
				</template>
			</el-table-column>
			<el-table-column prop="skuCode" label="SKU/产品名称" width="120">
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
			<el-table-column prop="countryCode" label="国家" width="100">
				<template #default="{ row }"
					>{{ row.countryCode ?? '---' }} -
					{{ row.countryName ?? '---' }}</template
				>
			</el-table-column>
			<el-table-column prop="platformChannelCode" label="平台渠道" width="120">
				<template #default="{ row }"
					>{{ row.platformChannelText ?? '---' }}
				</template>
			</el-table-column>
			<el-table-column prop="mskuCode" label="MSKU" width="140" />
			<el-table-column prop="availableQty" label="可用库存" width="120">
				<template #default="{ row }">{{ row.availableQty ?? '---' }} </template>
			</el-table-column>
			<el-table-column prop="deptId" label="部门" width="120">
				<template #default="{ row }"
					>{{ row.parentDeptName ?? '---' }}
				</template>
			</el-table-column>
			<el-table-column prop="deptName" label="运营小组" min-width="140">
				<template #default="{ row }">{{ row.deptName ?? '---' }} </template>
			</el-table-column>
		</el-table>

		<div class="section-title" style="margin-top: 16px">
			<span class="section-bar"></span>新库存信息
		</div>

		<el-table
			:data="newRows"
			ref="tableConfirmRef"
			border
			size="small"
			class="new-table"
			native-scrollbar
		>
			<el-table-column prop="deptId" :label="t('部门&运营小组')" width="220">
				<template #default="{ row }">
					<el-cascader
						v-model="row.deptId"
						placeholder="请选择"
						clearable
						:options="props.dictMap.deptTree"
						filterable
						:props="{
							label: 'name',
							value: 'id',
							emitPath: false, // ✅ 只返回最后一个 id
							checkStrictly: false, // 默认即可，确保联动
							leafOnly: true, // ✅ 只允许选最后一级
						}"
					>
					</el-cascader>
				</template>
			</el-table-column>
			<el-table-column
				prop="platformChannelCode"
				:label="t('平台渠道')"
				width="240"
			>
				<template #default="{ row }">
					<SelectInputApi
						v-model="row.platformChannelCode"
						placeholder="平台渠道"
						@change="() => changePlatformChannel(row)"
						:settings="{
              text: '平台渠道',
              getTreeData: () => ({
                code: 0,
                data: (props.dictMap.platformChannel || []).map((item: any) => ({
                  label: item.label,
                  value: item.value,
                })),
              }),
              getIdsCode: 'id',
              width: '220px',
            }"
					/>
				</template>
			</el-table-column>
			<el-table-column prop="mskuCode" :label="t('MSKU')" width="220">
				<template #default="{ row }">
					<el-select
						clearable
						filterable
						v-model="row.mskuCode"
						placeholder="msku"
					>
						<el-option
							v-for="item in mskuOption"
							:key="item.mskuCode"
							:label="item.platform"
							:value="item.mskuCode"
						/>
					</el-select>
				</template>
			</el-table-column>
			<el-table-column
				prop="skuCartonCode"
				:label="t('箱规编码')"
				show-overflow-tooltip
				width="280"
			>
				<template #default="{ row }">
					<div
						v-if="
							row.stockCartonVOList &&
							row.stockCartonVOList.length &&
							row.stockCartonVOList.length >= 0
						"
					></div>
					<el-row
						v-for="(item, index) in row.stockCartonList"
						:key="index"
						class="mb8"
						:gutter="8"
						style="width: 100%"
					>
						<el-col :span="20">
							<el-select
								collapse-tags
								:max-collapse-tags="1"
								clearable
								filterable
								v-model="item.skuCartonCodes"
								placeholder="请选择"
							>
								<el-option
									v-for="opt in row.stockCartonVOList || []"
									:key="opt.skuCartonCode"
									:label="opt.skuCartonCode"
									:value="opt.skuCartonCode"
								/>
							</el-select>
						</el-col>
						<el-col :span="4">
							<div
								style="
									display: flex;
									justify-content: center;
									align-items: center;
									gap: 4px;
									height: 100%;
								"
							>
								<el-button
									type="primary"
									size="small"
									:icon="Plus"
									v-if="index === 0"
									@click="addStockCartonList(row)"
								/>
								<el-button
									type="primary"
									size="small"
									:icon="Minus"
									v-else
									@click="removeStockCartonList(row, index)"
								/>
							</div>
						</el-col>
					</el-row>
				</template>
			</el-table-column>
			<!-- 可用数量 -->
			<el-table-column label="可用数量" prop="" width="100">
				<template #default="{ row }">
					<el-row
						v-for="(item, index) in row.stockCartonList"
						:key="index"
						class="mb8"
						:gutter="8"
						style="width: 100%"
					>
						{{
							item.skuCartonCodes
								? row.stockCartonVOList.find(
										(carton: any) =>
											carton.skuCartonCode === item.skuCartonCodes
								  )?.availableQuantity || 0
								: '0'
						}}
					</el-row>
				</template>
			</el-table-column>
			<el-table-column prop="convertQty" label="转换数量" min-width="120">
				<template #default="{ row }">
					<el-row
						v-for="(item, index) in row.stockCartonList"
						:key="index"
						class="mb8"
						:gutter="8"
						style="width: 100%"
					>
						{{ item.convertQty ? item.convertQty || 0 : '0' }}
					</el-row>
				</template>
			</el-table-column>
			<el-table-column
				:label="stockAndCartonType === 1 ? '转换箱数' : '转换数量'"
				width="100"
			>
				<template #default="{ row }">
					<el-row
						v-for="(item, index) in row.stockCartonList"
						:key="index"
						class="mb8"
						:gutter="8"
						style="width: 100%"
					>
						<el-input
							v-model="item.transferCartons"
							placeholder="请输入"
							@blur="() => onQtyBlur(row, item)"
							:disabled="!item.skuCartonCodes"
						/>
					</el-row>
				</template>
			</el-table-column>
			<el-table-column
				:label="stockAndCartonType === 1 ? '可用箱数' : '可用数量'"
				width="100"
			>
				<template #default="{ row }">
					<el-row
						v-for="(item, index) in row.stockCartonList"
						:key="index"
						class="mb8"
						:gutter="8"
						style="width: 100%"
					>
						{{
							item.skuCartonCodes
								? row.stockCartonVOList.find(
										(carton: any) =>
											carton.skuCartonCode === item.skuCartonCodes
								  )?.availableQty
								: '0'
						}}
					</el-row>
				</template>
			</el-table-column>
			<!-- 只有整箱时，显示单箱数量 -->
			<el-table-column
				label="单箱数量"
				width="100"
				v-if="stockAndCartonType === 1"
			>
				<template #default="{ row }">
					<el-row
						v-for="(item, index) in row.stockCartonList"
						:key="index"
						class="mb8"
						:gutter="8"
						style="width: 100%"
					>
						{{
							item.skuCartonCodes
								? row.stockCartonVOList.find(
										(carton: any) =>
											carton.skuCartonCode === item.skuCartonCodes
								  )?.singleCartonQuantity || 0
								: '0'
						}}
					</el-row>
				</template>
			</el-table-column>
			<el-table-column
				prop="outCartonSpecLength"
				:label="t('外箱长宽高(CM)')"
				show-overflow-tooltip
				width="200"
			>
				<template #default="{ row }">
					<el-row
						v-for="(item, index) in row.stockCartonList"
						:key="index"
						class="mb8"
						:gutter="8"
						style="width: 100%"
					>
						<div class="customClass">
							{{
								item.skuCartonCodes
									? (row.stockCartonVOList.find(
											(carton: any) =>
												carton.skuCartonCode === item.skuCartonCodes
									  )?.outCartonLength || 0) +
									  '*' +
									  (row.stockCartonVOList.find(
											(carton: any) =>
												carton.skuCartonCode === item.skuCartonCodes
									  )?.outCartonWidth || 0) +
									  '*' +
									  (row.stockCartonVOList.find(
											(carton: any) =>
												carton.skuCartonCode === item.skuCartonCodes
									  )?.outCartonHeight || 0)
									: '0*0*0'
							}}
						</div>
					</el-row>
				</template>
			</el-table-column>

			<el-table-column
				prop="outCartonGrossWeight"
				:label="t('外箱毛重(KG)')"
				show-overflow-tooltip
				width="180"
			>
				<template #default="{ row }">
					<el-row
						v-for="(item, index) in row.stockCartonList"
						:key="index"
						class="mb8"
						:gutter="8"
						style="width: 100%"
					>
						<div class="customClass">
							{{
								item.skuCartonCodes
									? row.stockCartonVOList.find(
											(carton: any) =>
												carton.skuCartonCode === item.skuCartonCodes
									  )?.outCartonGrossWeight || 0
									: '0'
							}}
						</div>
					</el-row>
				</template>
			</el-table-column>
		</el-table>
	</div>
	<!-- <template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">取消</el-button>
				<el-button type="primary" @click="handleConfirm">确认提交</el-button>
			</span>
		</template>
	</el-dialog> -->
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { Plus, Minus } from '@element-plus/icons-vue';
import { useMessage } from '/@/hooks/message';
import {
	getStockAndCarton,
	saveTransferInventoryReview,
} from '/@/api/warehouse/stock';
import { useI18n } from 'vue-i18n';
import { getSkuQueryMsku } from '/@/api/purchase/demand';
const { t } = useI18n();
const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);
const props = defineProps({
	dictMap: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['closed', 'submitted']);

const visible = ref(false);
const loading = reactive({ origin: false });

// 原信息data
const originList = ref<any[]>([]);
// 保存后端返回原始对象，用于提交 oldDTO
const baseDetail = ref<any>({});

const tableConfirmRef = ref<any>(null);
// table的data（用于承载新库存编辑区的每一行）
const newRows = ref<Array<any>>([]);
// 整箱还是散货
const stockAndCartonType = ref<number>(1);

// 打开弹窗：入参为选中的原库存记录（至少包含唯一标识）
const open = async (row: any, _stockAndCartonType = 1) => {
	resetAll();
	visible.value = true;
	const param = {
		legalPersonId: row.legalPersonId,
		skuCode: row.skuCode,
		countryCode: row.countryCode,
		platformChannelCode: row.platformChannelCode,
		deptId: row.deptId,
		warehouseCode: row.warehouseCode,
		mskuCode: row.mskuCode,
	};
	// 记录整箱还是散货
	stockAndCartonType.value = _stockAndCartonType;
	await fetchOrigin(param, _stockAndCartonType);
	await getMSKUList(row);
};

// 重置弹窗
const resetAll = () => {
	originList.value = [];
	baseDetail.value = {};
	newRows.value = [];
};

interface mskuArr {
	mskuCode: string;
	platform: string;
}
// msku下拉框
const mskuOption = ref<mskuArr[]>([]);
const getMSKUList = async (row: any) => {
	try {
		const res = await getSkuQueryMsku({
			skuCode:
				row.skuCode || (originList.value.length && originList.value[0].skuCode),
			countryCode:
				row.countryCode ||
				(originList.value.length && originList.value[0].countryCode),
			platformChannelCode: row.platformChannelCode,
		});
		if (res.code === 0) {
			mskuOption.value = res.data || [];
		}
	} catch (error: any) {
		useMessage().error(error.msg || '加载失败，请稍后重试');
	}
};

const changePlatformChannel = (row: any) => {
	row.mskuCode = '';
	getMSKUList(row);
};
/**
 * 增加箱规编码行
 */
const addStockCartonList = (row: any) => {
	// 添加的行不能超过箱规编码的总数
	if (row.stockCartonList.length >= row.stockCartonVOList.length) {
		useMessage().warning('箱规编码已全部添加完毕');
		return;
	}
	row.stockCartonList.push({ skuCartonCodes: '', convertQty: 0 });
};
/**
 * 删除箱规编码行
 */
const removeStockCartonList = (row: any, index: number) => {
	if (row.stockCartonList.length > 1) {
		row.stockCartonList.splice(index, 1);
	} else {
		useMessage().warning('至少保留一行箱规编码');
	}
};

// 获取详情数据回显
const fetchOrigin = async (query: any, stockAndCartonType: number) => {
	loading.origin = true;
	try {
		const res = await getStockAndCarton({
			...query,
			type: stockAndCartonType, // 类型；1-整箱，2-散货  转1
		});
		const base = res.data || {};
		baseDetail.value = base;
		// 原库存表
		originList.value = [
			{
				warehouseCode: base.warehouseCode,
				warehouseName: base.warehouseName,
				legalPersonId: base.legalPersonId,
				legalPersonName: base.legalPersonName,
				skuCode: base.skuCode,
				skuName: base.skuName,
				countryCode: base.countryCode,
				countryName: base.countryName,
				platformChannelCode: base.platformChannelCode,
				platformChannelText: base.platformChannelText,
				deptId: base.deptId,
				parentDeptName: base.parentDeptName,
				deptName: base.deptName,
				mskuCode: base.mskuCode,
				onwayQty: base.onwayQty,
				availableQty: base.availableQty,
				lockQty: base.lockQty,
				totalQty: base.totalQty,
			},
		];

		// 转为前端使用的箱规清单字段
		const mappedList = (base.stockCartonVOS || []).map((c: any) => ({
			id: c.id,
			skuCartonCode: c.skuCartonCode,
			availableQty: c.availableQty, // 可用箱数
			availableQuantity:
				// 如果整箱，则计算可用箱数；如果散货，则直接使用可用数量
				stockAndCartonType === 1
					? c.availableQty * c.singleCartonQuantity // 整箱：可用箱数 = 可用数量 * 单箱数量
					: c.availableQty, // 散货：可用箱数 = 可用数量
			outCartonLength: c.outCartonSpecLength,
			outCartonWidth: c.outCartonSpecWidth,
			outCartonHeight: c.outCartonSpecHeight,
			outCartonGrossWeight: c.cartonGrossWeight, // 单箱毛重
			singleCartonQuantity: c.singleCartonQuantity, // 单箱数量
		}));

		// 新库存编辑区（仅一行，内含可选择的箱规列表与用户操作的行）
		const editRow: any = {
			deptId: '',
			platformChannelCode: '',
			mskuCode: '',
			stockCartonVOList: mappedList,
			stockCartonList: [],
		};
		if (mappedList.length === 1) {
			// 只有一条，默认选中并带出
			editRow.stockCartonList = [
				{ skuCartonCodes: mappedList[0].skuCartonCode, convertQty: '' },
			];
		} else {
			// 多条，给一行空选择
			editRow.stockCartonList = [{ skuCartonCodes: '', convertQty: '' }];
		}
		newRows.value = [editRow];
	} finally {
		loading.origin = false;
	}
};

const onQtyBlur = (row: any, item: any) => {
	const code = item.skuCartonCodes;
	if (!code) return;
	const carton =
		(row.stockCartonVOList || []).find((c: any) => c.skuCartonCode === code) ||
		{};
	// 校验正整数
	const raw = String(item.transferCartons || '').trim();
	if (!raw) {
		item.convertQty = 0;
		return;
	}
	if (!/^(?:[1-9]\d*)$/.test(raw)) {
		useMessage().error('转换箱数只能输入正整数');
		item.transferCartons = '';
		item.convertQty = 0;
		return;
	}
	const n = Number(raw);
	const max = Number(carton.availableQty || carton.availableQty || 0);
	if (n > max) {
		useMessage().warning(
			stockAndCartonType.value === 1
				? '转换箱数不可大于可用箱数'
				: '转换数量不可大于可用数量'
		);
		item.convertQty = String(max);
		// 为1的时候走整箱逻辑，否则走散货逻辑，转换数量为可用数量
		item.convertQty =
			stockAndCartonType.value === 1
				? computeCartons(max, Number(carton.singleCartonQuantity || 0))
				: Number(carton.availableQuantity || 0);
		// 转换箱数最大值为可用数量
		item.transferCartons = String(max);
		return;
	}
	// 为1的时候走整箱逻辑，否则走散货逻辑，整箱转换数量为转换箱数 * 单箱数量；散货转换数量为转换箱数
	item.convertQty =
		stockAndCartonType.value === 1
			? computeCartons(n, Number(carton.singleCartonQuantity || 0))
			: Number(item.transferCartons || 0);
};

const computeCartons = (qty: number, single: number) => {
	if (!qty || !single) return 0;
	return Math.ceil(qty * single);
};

const handleClose = () => {
	visible.value = false;
	emit('closed');
};

const handleConfirm = async () => {
	// 校验
	const row = newRows.value[0] || {};
	if (!row.stockCartonList || row.stockCartonList.length === 0)
		return useMessage().error('请至少选择一条箱规');
	for (let i = 0; i < row.stockCartonList.length; i++) {
		const it = row.stockCartonList[i];
		if (!it.skuCartonCodes)
			return useMessage().error(`第${i + 1}行：请选择箱规编码`);
		if (!/^(?:[1-9]\d*)$/.test(String(it.transferCartons || '')))
			return useMessage().error(`第${i + 1}行：请输入有效转换箱数`);
	}

	// oldDTO
	const oldDTO = {
		legalPersonId: baseDetail.value.legalPersonId,
		skuCode: baseDetail.value.skuCode,
		countryCode: baseDetail.value.countryCode,
		platformChannelCode: baseDetail.value.platformChannelCode,
		deptId: baseDetail.value.deptId,
		warehouseCode: baseDetail.value.warehouseCode,
		mskuCode: baseDetail.value.mskuCode,
	};

	// newDTOList
	const newDTOList = (row.stockCartonList || []).map((it: any) => {
		const warehouseSku = baseDetail.value.stockCartonVOS?.filter(
			(item: any) => item.skuCartonCode === it.skuCartonCodes
		);
		return {
			legalPersonId: baseDetail.value.legalPersonId,
			skuCode: baseDetail.value.skuCode,
			countryCode: baseDetail.value.countryCode,
			platformChannelCode:
				row.platformChannelCode || baseDetail.value.platformChannelCode,
			deptId: row.deptId || baseDetail.value.deptId,
			warehouseCode: baseDetail.value.warehouseCode,
			mskuCode: row.mskuCode || baseDetail.value.mskuCode,
			skuCartonCode: it.skuCartonCodes,
			transferCartons: Number(it.transferCartons || 0),
			transferQuantity: Number(it.convertQty || 0),
			warehouseSku: warehouseSku?.[0].warehouseSku || '',
		};
	});
	const payload = {
		oldDTO,
		newDTOList,
		transferType: 2,
		// 传入整箱还是散货
		type: stockAndCartonType.value,
	};
	const res = await saveTransferInventoryReview(payload);
	if (res.code === 0) {
		emit('submitted');
		handleClose();
		useMessage().success('提交成功');
	}
};

defineExpose({ open, handleClose, handleConfirm });
</script>

<style lang="scss" scoped>
.dialog-container {
	padding: 0 10px;
	max-height: 70vh;
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
.mb12 {
	margin-bottom: 12px;
}
.new-table :deep(.el-input__wrapper) {
	padding: 0 8px;
}
.customClass {
	color: #333333;
	margin-top: 4px;
}
</style>
