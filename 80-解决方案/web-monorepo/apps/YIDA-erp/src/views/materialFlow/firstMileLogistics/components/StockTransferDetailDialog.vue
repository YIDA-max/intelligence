<template>
	<confirm-dialog
		ref="dialogRef"
		:title="title"
		:cancel-button-text="$t('上一步')"
		:confirm-button-text="$t('确认提交')"
		:confirm-button-type="'primary'"
		:show-confirm-button="true"
		:width="'90%'"
		@cancel="handlePrevious"
		@confirm="handleConfirm"
		@closed="handleClosed"
		@opened="handleOpened"
	>
		<div class="dialog-container">
			<!-- 循环渲染每一条选中的发货明细 -->
			<div
				v-for="(item, index) in detailList"
				:key="index"
				class="detail-group"
			>
				<!-- 原库存信息 -->
				<div class="section-title">
					<span class="section-bar"></span>原库存信息
				</div>
				<el-table
					:data="[item.originData]"
					border
					size="small"
					native-scrollbar
				>
					<el-table-column
						v-for="column in originStockColumns"
						:key="column.prop"
						:prop="column.prop"
						:label="column.label"
						:width="column.width"
						:min-width="column.minWidth"
						:show-overflow-tooltip="column.showOverflowTooltip"
					>
						<template #default="{ row }">
							<!-- SKU特殊展示 -->
							<sku-table-column v-if="column.type === 'sku'" :row="row" />
							<!-- 常规文本显示 -->
							<span v-else>{{
								column.formatter
									? column.formatter(row)
									: row[column.prop] ?? '---'
							}}</span>
						</template>
					</el-table-column>
				</el-table>

				<!-- 新库存信息 -->
				<div class="section-title" style="margin-top: 16px">
					<span class="section-bar"></span>新库存信息
				</div>
				<el-table
					:data="[item.newData]"
					border
					size="small"
					class="new-table"
					native-scrollbar
				>
					<el-table-column
						v-for="column in newStockColumns"
						:key="column.prop"
						:prop="column.prop"
						:label="column.isRequired ? `*${column.label}` : column.label"
						:width="column.width"
						:min-width="column.minWidth"
					>
						<template #default="{ row }">
							<!-- SKU特殊展示 -->
							<sku-table-column v-if="column.prop === 'skuCode'" :row="row" />
							<!-- 输入框 -->
							<el-input
								v-else-if="column.type === 'input'"
								v-model="row[column.prop]"
								:placeholder="column.placeholder || '请输入'"
								:type="column.inputType || 'text'"
								clearable
								@blur="column.onBlur ? column.onBlur(row, item) : null"
							/>
							<!-- 选择器 -->
							<el-select
								v-else-if="column.type === 'select'"
								v-model="row[column.prop]"
								:placeholder="column.placeholder || '请选择'"
								clearable
								filterable
								style="width: 100%"
								@change="column.onChange ? column.onChange(row, item) : null"
							>
								<el-option
									v-for="option in column.options ? column.options(item) : []"
									:key="option.value"
									:label="option.label"
									:value="option.value"
								/>
							</el-select>
							<!-- 级联选择器 -->
							<el-cascader
								v-else-if="column.type === 'cascader'"
								v-model="row[column.prop]"
								:placeholder="column.placeholder || '请选择'"
								clearable
								:options="column.options ? column.options() : []"
								filterable
								style="width: 100%"
								:props="{
									label: 'name',
									value: 'id',
									emitPath: false,
									checkStrictly: false,
									leafOnly: true,
								}"
							/>

							<!-- 只读显示 -->
							<span v-else-if="column.type === 'display'">
								{{
									column.formatter
										? column.formatter(item, row)
										: row[column.prop] ?? '---'
								}}
							</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
	</confirm-dialog>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMessage } from '/@/hooks/message';
// import { getSkuQueryMsku } from '/@/api/purchase/demand';

const ConfirmDialog = defineAsyncComponent(
	() => import('/@/components/ConfirmDialog/index.vue')
);
const SkuTableColumn = defineAsyncComponent(
	() => import('/@/components/SkuTableColumn/index.vue')
);

const { t } = useI18n();

// Props
const props = defineProps({
	dictMap: { type: Object, default: () => ({}) },
});

// Emits
const emit = defineEmits(['previous', 'confirm']);

// 弹窗引用
const dialogRef = ref();

// 标题
const title = computed(() => t('转库存申请—头程在途转换'));

// 基础信息（来自第一步）
const baseInfo = ref<any>({});

// 选中的发货明细列表（已转换为详情格式）
interface DetailItem {
	originData: any; // 原库存信息
	newData: any; // 新库存信息（可编辑）
	mskuOptions: any[]; // MSKU选项
}

const detailList = ref<DetailItem[]>([]);

// 计算可提数量 = 发货数量 - 在途占用（模拟数据，实际应从接口获取）
const computeAvailableQty = (item: DetailItem) => {
	const deliveryQty = item.originData?.deliveryQty || 0;
	const onwayOccupiedQty = 0; // TODO: 从接口获取在途占用数量
	return deliveryQty - onwayOccupiedQty;
};

// 计算可提箱数 = 发货箱数 - 在途占用箱数
const computeAvailableCartons = (item: DetailItem) => {
	const deliveryBoxQty = item.originData?.deliveryBoxQty || 0;
	const onwayOccupiedBoxQty = 0; // TODO: 从接口获取在途占用箱数
	return deliveryBoxQty - onwayOccupiedBoxQty;
};

// 转换箱数失焦校验
const onTransferCartonsBlur = (row: any, item: DetailItem) => {
	const raw = String(row.transferCartons || '').trim();
	if (!raw) {
		return;
	}
	if (!/^(?:[1-9]\d*)$/.test(raw)) {
		useMessage().error(t('转换箱数只能输入正整数'));
		row.transferCartons = '';
		return;
	}
	const n = Number(raw);
	const maxCartons = computeAvailableCartons(item);
	if (n > maxCartons) {
		useMessage().warning(t('转换箱数不可大于可提箱数'));
		row.transferCartons = String(maxCartons);
		return;
	}

	// 自动计算转换数量
	const boxQty = item.originData?.boxQty || 0;
	row.transferQuantity = n * boxQty;
};

// 国家改变
const changeCountry = (row: any, item: DetailItem) => {
	row.platformChannelCode = '';
	row.mskuCode = '';
	item.mskuOptions = [];
};

// 平台渠道改变
const changePlatformChannel = (row: any, item: DetailItem) => {
	row.mskuCode = '';
	// 获取MSKU列表
	getMSKUList(item, {
		skuCode: item.originData?.skuCode,
		countryCode: row.countryCode || item.originData?.countryCode,
		platformChannelCode: row.platformChannelCode,
	});
};

// 获取MSKU列表
const getMSKUList = async (item: DetailItem, params: any) => {
	try {
		// TODO: 接口对接
		// const res = await getSkuQueryMsku({
		// 	skuCode: params.skuCode,
		// 	countryCode: params.countryCode,
		// 	platformChannelCode: params.platformChannelCode,
		// });
		// if (res.code === 0) {
		// 	item.mskuOptions = res.data || [];
		// }

		// 模拟数据
		void params;
		item.mskuOptions = [
			{ mskuCode: 'MR-2494P1-US', label: 'MR-2494P1-US' },
			{ mskuCode: 'MR-2494P1-US-NEW', label: 'MR-2494P1-US-NEW' },
		];
	} catch (error: any) {
		useMessage().error(error?.msg || t('加载MSKU失败'));
	}
};

// 原库存信息字段配置
const originStockColumns = [
	{
		prop: 'deliveryNo',
		label: '发货单号',
		width: 150,
		showOverflowTooltip: true,
	},
	{
		prop: 'skuCode',
		label: 'SKU/产品名称',
		width: 200,
		type: 'sku',
	},
	{
		prop: 'destWarehouseName',
		label: '仓库',
		width: 120,
		showOverflowTooltip: true,
	},
	{
		prop: 'legalPersonName',
		label: '法人主体',
		width: 120,
		showOverflowTooltip: true,
		formatter: (row: any) => row.legalPersonName || '', // 模拟数据
	},
	{
		prop: 'countryCode',
		label: '国家',
		width: 100,
		showOverflowTooltip: true,
		formatter: (row: any) => row.countryCode || '',
	},
	{
		prop: 'platformChannelCodeText',
		label: '平台渠道',
		width: 120,
		showOverflowTooltip: true,
		formatter: (row: any) => row.platformChannelCodeText || '',
	},
	{
		prop: 'mskuCode',
		label: 'MSKU',
		width: 140,
		showOverflowTooltip: true,
		formatter: (row: any) => row.skuCode || row.mskuCode,
	},
	{
		prop: 'shippingMethodText',
		label: '发货方式',
		width: 100,
		showOverflowTooltip: true,
	},
	{
		prop: 'shipmentQuantity',
		label: '发货数量',
		width: 100,
	},
	{
		prop: 'deliveryCartonQuantity',
		label: '发货箱数',
		width: 100,
	},
	{
		prop: 'singleCartonQuantity',
		label: '单箱数量',
		width: 100,
	},
	{
		prop: 'deptName',
		label: '部门&小组',
		minWidth: 150,
		showOverflowTooltip: true,
		formatter: (row: any) => row.deptName || '',
	},
	{
		prop: 'skuCartonCode',
		label: '箱规编码',
		width: 120,
		showOverflowTooltip: true,
	},
	{
		prop: 'boxSize',
		label: '外箱长宽高(CM)',
		width: 150,
		showOverflowTooltip: true,
		formatter: (row: any) =>
			row.outCartonLength
				? `${row.outCartonLength}*${row.outCartonWidth}*${row.outCartonHeight}`
				: '-',
	},
];

// 新库存信息字段配置
const newStockColumns = [
	{
		prop: 'deliveryNo',
		label: '发货单号',
		type: 'display',
		width: 150,
		isRequired: false,
		formatter: (item: DetailItem) => item.originData?.deliveryNo || '---',
	},
	{
		prop: 'skuCode',
		label: 'SKU/产品名称',
		type: 'display',
		width: 200,
		isRequired: false,
		formatter: (item: DetailItem) => {
			const sku = item.newData?.skuCode || '';
			const name = item.newData?.skuName || '';
			return `${sku} ${name}`;
		},
	},
	{
		prop: 'countryCode',
		label: '国家',
		type: 'select',
		width: 120,
		isRequired: true,
		placeholder: '请选择',
		options: () => {
			return (props.dictMap.countryList || []).map((item: any) => ({
				label: `${item.abbTwoCode}-${item.chineseName}`,
				value: item.abbTwoCode,
			}));
		},
		onChange: changeCountry,
	},
	{
		prop: 'platformChannelCode',
		label: '平台渠道',
		type: 'select',
		width: 150,
		isRequired: true,
		placeholder: '请选择',
		options: () => {
			return (props.dictMap.platformChannel || []).map((item: any) => ({
				label: item.label,
				value: item.value,
			}));
		},
		onChange: changePlatformChannel,
	},
	{
		prop: 'mskuCode',
		label: 'MSKU',
		type: 'select',
		width: 150,
		isRequired: true,
		placeholder: '请选择',
		options: (item: DetailItem) => {
			return (item.mskuOptions || []).map((option: any) => ({
				label: option.mskuCode || option.label,
				value: option.mskuCode || option.value,
			}));
		},
	},
	{
		prop: 'deptId',
		label: '部门&小组',
		type: 'cascader',
		width: 200,
		isRequired: true,
		placeholder: '请选择',
		options: () => props.dictMap.deptTree || [],
	},
	{
		prop: 'availableQty',
		label: '可提数量',
		type: 'display',
		width: 100,
		isRequired: false,
		formatter: (item: DetailItem) => computeAvailableQty(item),
	},
	{
		prop: 'availableCartons',
		label: '可提箱数',
		type: 'display',
		width: 100,
		isRequired: false,
		formatter: (item: DetailItem) => computeAvailableCartons(item),
	},
	{
		prop: 'transferCartons',
		label: '转换箱数',
		type: 'input',
		inputType: 'number',
		width: 120,
		isRequired: true,
		placeholder: '请输入',
		onBlur: onTransferCartonsBlur,
	},
	{
		prop: 'transferQuantity',
		label: '转换数量',
		type: 'display',
		width: 100,
		isRequired: false,
		formatter: (_item: DetailItem, row: any) => row.transferQuantity || 0,
	},
	{
		prop: 'singleCartonQuantity',
		label: '单箱数量',
		type: 'display',
		width: 100,
		isRequired: false,
		formatter: (item: DetailItem) => item.originData?.singleCartonQuantity || 0,
	},
	{
		prop: 'skuCartonCode',
		label: '箱规编码',
		type: 'display',
		width: 120,
		isRequired: false,
		formatter: (item: DetailItem) => item.originData?.skuCartonCode || '---',
	},
	{
		prop: 'boxSize',
		label: '外箱长宽高(CM)',
		type: 'display',
		width: 140,
		isRequired: false,
		formatter: (item: DetailItem) =>
			item.originData?.outCartonLength
				? `${item.originData?.outCartonLength}*${item.originData?.outCartonWidth}*${item.originData?.outCartonHeight}`
				: '-',
	},
	{
		prop: 'outCartonGrossWeight',
		label: '外箱毛重(KG)',
		type: 'display',
		minWidth: 120,
		isRequired: false,
		formatter: (item: DetailItem) =>
			item.originData?.outCartonGrossWeight || '---',
	},
];

// 打开弹窗
const show = (base: any, selectedList: any[], cachedData: any = null) => {
	baseInfo.value = base;

	// 如果有缓存数据，需要智能合并
	if (cachedData && cachedData.length > 0) {
		// 合并缓存数据和新数据
		detailList.value = selectedList.map((delivery, index) => {
			const cached = cachedData[index];

			// 如果该位置有缓存数据（不是 null），使用缓存数据
			if (cached && cached.originData && cached.newData) {
				return cached;
			}

			// 如果该位置是 null 或无效数据，初始化新数据
			return {
				originData: {
					...delivery,
					// 补充基础信息中的字段
				},
				newData: {
					// 初始化新库存信息，默认值与原库存一致
					...delivery,
				},
				mskuOptions: [],
			};
		});
	} else {
		// 没有缓存数据，全部初始化新数据
		// 将选中的发货明细转换为详情格式
		detailList.value = selectedList.map((delivery) => ({
			originData: {
				...delivery,
				// 补充基础信息中的字段
			},
			newData: {
				// 初始化新库存信息，默认值与原库存一致
				...delivery,
			},
			mskuOptions: [],
		}));
	}

	dialogRef.value?.show();
};

// 隐藏弹窗
const hide = () => {
	dialogRef.value?.hide();
};

// 上一步
const handlePrevious = () => {
	// 返回上一步，保持当前数据
	emit('previous', { detailList: detailList.value });
	hide();
};

// 确认提交
const handleConfirm = () => {
	// 验证必填项
	for (let i = 0; i < detailList.value.length; i++) {
		const item = detailList.value[i];
		const { newData } = item;

		if (!newData.countryCode) {
			useMessage().warning(t(`第${i + 1}条数据：请选择国家`));
			return;
		}
		if (!newData.platformChannelCode) {
			useMessage().warning(t(`第${i + 1}条数据：请选择平台渠道`));
			return;
		}
		if (!newData.mskuCode) {
			useMessage().warning(t(`第${i + 1}条数据：请选择MSKU`));
			return;
		}
		if (!newData.deptId) {
			useMessage().warning(t(`第${i + 1}条数据：请选择部门&小组`));
			return;
		}
		if (!newData.transferCartons || Number(newData.transferCartons) <= 0) {
			useMessage().warning(t(`第${i + 1}条数据：请输入转换箱数`));
			return;
		}
	}

	// TODO: 调用提交接口
	useMessage().success(t('提交成功'));
	emit('confirm', { baseInfo: baseInfo.value, detailList: detailList.value });
	hide();
};

// 弹窗关闭
const handleClosed = () => {
	baseInfo.value = {};
	detailList.value = [];
};

// 弹窗打开
const handleOpened = () => {
	// 弹窗打开后的操作
};

// 暴露方法
defineExpose({
	show,
	hide,
});
</script>

<style scoped lang="scss">
.dialog-container {
	max-height: 600px;
	overflow-y: auto;
}

.detail-group {
	margin-bottom: 24px;
	padding-bottom: 24px;
	border-bottom: 1px solid #e4e7ed;

	&:last-child {
		border-bottom: none;
		margin-bottom: 0;
		padding-bottom: 0;
	}
}

.section-title {
	display: flex;
	align-items: center;
	margin-bottom: 16px;
	font-size: 14px;
	font-weight: bold;
	color: #303133;

	.section-bar {
		display: inline-block;
		width: 3px;
		height: 14px;
		margin-right: 8px;
		background-color: #409eff;
	}
}
.new-table {
	:deep(.el-table__header) {
		.el-table__cell {
			background-color: #f5f7fa;
		}
	}
}
</style>
