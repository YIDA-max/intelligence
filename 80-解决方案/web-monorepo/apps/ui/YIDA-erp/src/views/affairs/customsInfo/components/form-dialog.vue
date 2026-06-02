<template>
	<el-dialog v-model="visible" :title="title" width="90%" destroy-on-close>
		<!-- SKU信息（包含三个子Tab） -->
		<div class="section">
			<div class="section-title">SKU信息</div>
			<el-tabs v-model="skuTabs" class="mb-4">
				<!-- 基本信息 -->
				<el-tab-pane label="基本信息" name="base">
					<el-table
						:data="baseInfoList"
						border
						style="width: 100%"
						:cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle"
					>
						<el-table-column prop="skuCode" label="sku">
							<template #default="{ row }">{{ row.skuCode || '--' }}</template>
						</el-table-column>
						<el-table-column prop="skuName" label="产品名称">
							<template #default="{ row }">{{ row.skuName || '--' }}</template>
						</el-table-column>
						<el-table-column prop="imgUrl" label="图片">
							<template #default="{ row }">
								<MrImg :src="row.imgUrl" />
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<!-- 箱规信息（展示） -->
				<el-tab-pane label="箱规信息" name="carton">
					<el-table
						:data="productSkuCartonList"
						border
						style="width: 100%"
						:cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle"
					>
						<el-table-column label="箱规编码" width="320" align="center">
							<template #default="{ row }">{{
								row.skuCartonCode || '--'
							}}</template>
						</el-table-column>
						<el-table-column label="外箱规格" width="330" align="center">
							<template #default="{ row }">
								<span class="font-bold"
									>{{ row.outCartonSpecLength || '--' }} ×
									{{ row.outCartonSpecWidth || '--' }} ×
									{{ row.outCartonSpecHeight || '--' }}
									{{ row.outCartonSpecUnit }}</span
								>
							</template>
						</el-table-column>
						<el-table-column label="单箱数量" width="250" align="center">
							<template #default="{ row }">
								<span class="font-bold">{{ row.cartonQty || '--' }}</span>
							</template>
						</el-table-column>
						<el-table-column label="单箱毛重" width="250" align="center">
							<template #default="{ row }">
								<span class="font-bold"
									>{{ row.cartonGrossWeight || '--' }}
									{{ row.cartonGrossWeightUnit }}</span
								>
							</template>
						</el-table-column>
						<el-table-column label="单箱净重" width="250" align="center">
							<template #default="{ row }">
								<span class="font-bold"
									>{{ row.cartonNetWeight || '--' }}
									{{ row.cartonNetWeightUnit }}</span
								>
							</template>
						</el-table-column>
						<el-table-column label="单柜装箱数量" width="250" align="center">
							<template #default="{ row }">
								<span class="font-bold">{{
									row.containerCartonQty || '--'
								}}</span>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<!-- 关联MSKU（展示） -->
				<el-tab-pane label="关联MSKU" name="msku">
					<el-table
						:data="mskus"
						border
						style="width: 100%"
						:cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle"
					>
						<el-table-column label="MSKU编码" width="220">
							<template #default="{ row }">{{ row.mskuCode || '--' }}</template>
						</el-table-column>
						<el-table-column label="店铺/站点" width="220">
							<template #default="{ row }">{{
								row.storeAndSiteText || '--'
							}}</template>
						</el-table-column>
						<el-table-column label="销售价" width="220">
							<template #default="{ row }"
								>{{ row.salePrice || '--'
								}}{{ row.currency || '---' }}</template
							>
						</el-table-column>
						<el-table-column label="销售链接" min-width="260" prop="saleUrl" />
						<el-table-column
							label="竞品链接"
							min-width="260"
							prop="competitorUrl"
						/>
						<el-table-column label="定价截图" width="140" align="center">
							<template #default="{ row }">
								<MrImg :src="row.imgUrl" />
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</div>

		<!-- 报关信息（表单区域） -->
		<div class="section">
			<div class="section-title">报关信息</div>
			<el-form
				:model="declareForm"
				label-width="120px"
				class="declare-form"
				:rules="formRules"
				ref="declareFormRef"
			>
				<el-row class="mb18" :gutter="20">
					<el-col :span="8">
						<el-form-item label="中文品名" prop="chineseName">
							<el-input
								v-model="declareForm.chineseName"
								maxlength="50"
								show-word-limit
								placeholder="请输入"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="16">
						<el-form-item label="英文品名" prop="enName">
							<el-input
								v-model="declareForm.enName"
								maxlength="100"
								show-word-limit
								placeholder="请输入"
							/>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row class="mb18" :gutter="30">
					<el-col :span="8">
						<el-form-item label="报关编码" prop="customsCode">
							<el-input
								v-model="declareForm.customsCode"
								maxlength="50"
								show-word-limit
								placeholder="请输入"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="报关单价" prop="customsPrice">
							<el-input
								v-model="declareForm.customsPrice"
								:placeholder="$t('请输入')"
							>
								<template #append>
									<el-form-item prop="customsPriceCurrency">
										<SelectInputApi
											componentType="currency"
											v-model="declareForm.customsPriceCurrency"
											placeholder="请选择"
											:settings="{
												text: '请选择',
											}"
											:style="{
												width: '100px',
											}"
										/>
									</el-form-item>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="法定第一单位" prop="legalUnit">
							<SelectInputApi
								componentType="dicts"
								v-model="declareForm.legalUnit"
								placeholder="请选择"
								:settings="{
									text: '请选择',
									getTreeDataParams: 'primary_unit',
								}"
							/>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row class="mb18" :gutter="30">
					<el-col :span="8">
						<el-form-item label="最惠国进口税率" prop="mfnRate">
							<el-input
								v-model="declareForm.mfnRate"
								:placeholder="$t('请输入')"
							>
								<template #append>
									<el-form-item prop="mfnRateUnit">
										<el-select
											v-model="declareForm.mfnRateUnit"
											filterable
											placeholder="请选择"
											:style="{
												width: '75px',
											}"
											class="el-select-background"
										>
											<el-option
												v-for="item in percentUnits"
												:key="item.value"
												:label="item.label"
												:value="item.value"
											/>
										</el-select>
									</el-form-item> </template
							></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="出口退税率" prop="exportRebateRate">
							<el-input
								v-model="declareForm.exportRebateRate"
								:placeholder="$t('请输入')"
							>
								<template #append>
									<el-form-item prop="mfnRateUnit">
										<el-select
											v-model="declareForm.mfnRateUnit"
											filterable
											placeholder="请选择"
											:style="{
												width: '75px',
											}"
											class="el-select-background"
										>
											<el-option
												v-for="item in percentUnits"
												:key="item.value"
												:label="item.label"
												:value="item.value"
											/>
										</el-select>
									</el-form-item> </template
							></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item
							label="海关监管条件"
							prop="customsSupervisionCondition"
						>
							<el-input
								v-model="declareForm.customsSupervisionCondition"
								placeholder="请输入"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item label="申报要素" prop="decItems">
							<el-input
								v-model="declareForm.decItems"
								type="textarea"
								:rows="3"
								maxlength="500"
								show-word-limit
								placeholder="请输入"
							/>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>

		<!-- 清关信息（可编辑表格） -->
		<div class="section">
			<div class="section-title">清关信息</div>
			<el-table :data="clearanceInfos" border style="width: 100%" class="mb-2">
				<el-table-column label="适用国家">
					<template #header>
						<span
							:style="{
								color: '#f78c8c',
								marginRight: '3px',
							}"
							>*
						</span>
						{{ $t('适用国家') }}
					</template>
					<template #default="{ row }">
						<SelectInputApi
							componentType="country"
							v-model="row.countryCode"
							placeholder="请选择"
							class="el-select-background"
							:settings="{
								text: '请选择',
								getTreeDataOptions: { enable: false, delay: 0 },
							}"
						/>
					</template>
				</el-table-column>
				<el-table-column label="清关编码">
					<template #header>
						<span
							:style="{
								color: '#f78c8c',
								marginRight: '3px',
							}"
							>*
						</span>
						{{ $t('清关编码') }}
					</template>
					<template #default="{ row }">
						<el-input v-model="row.clearanceCode" placeholder="请输入" />
					</template>
				</el-table-column>
				<el-table-column label="税率">
					<template #header>
						<span
							:style="{
								color: '#f78c8c',
								marginRight: '3px',
							}"
							>*
						</span>
						{{ $t('税率') }}
					</template>
					<template #default="{ row }">
						<el-input v-model="row.clearanceRate" :placeholder="$t('请输入')">
							<template #append>
								<el-select
									v-model="row.percent"
									filterable
									placeholder="请选择"
									:style="{
										width: '75px',
									}"
									class="el-select-background"
								>
									<el-option
										v-for="item in percentUnits"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</template>
						</el-input>
					</template>
				</el-table-column>
				<el-table-column label="清关单价">
					<template #default="{ row }">
						<div class="flex items-center">
							<el-input v-model="row.clearancePrice" placeholder="请输入">
								<template #append>
									<SelectInputApi
										componentType="currency"
										v-model="row.clearancePriceCurrency"
										placeholder="请选择"
										class="el-select-background"
										:settings="{
											text: '请选择',
											getTreeDataOptions: { enable: false, delay: 0 },
										}"
										:style="{
											width: '100px',
										}"
									/>
								</template>
							</el-input>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template #default="{ $index }">
						<el-button
							type="danger"
							size="small"
							@click="removeClearanceRow($index)"
							:disabled="clearanceInfos.length <= 1"
							>删除</el-button
						>
					</template>
				</el-table-column>
			</el-table>
			<el-button type="primary" @click="addClearanceRow">新增</el-button>
		</div>

		<template #footer>
			<el-button @click="handleCancel">取消</el-button>
			<el-button type="primary" @click="handleOk">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage } from '/@/hooks/message';
const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);
const props = defineProps({
	visibleType: { type: String, default: 'edit' },
	title: { type: String, default: '编辑关务信息' },
	rowData: { type: Object, default: () => ({}) },
	dictMap: { type: Object, default: () => ({}) },
});
const emit = defineEmits(['submit']);

const visible = ref(false);
const title = computed(() => props.title);

// SKU信息 tabs
const skuTabs = ref('base');

const percentUnits = [{ label: '%', value: '%' }];

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
});

// SKU 基本信息
const baseInfoList = ref<Array<any>>([
	{
		platform: 'Amazon',
		msku: '',
		storeSite: '',
		saleUrl: '',
		competitorUrl: '',
		backPriceRange: '',
	},
]);
const { tableStyle } = useTable(state, undefined);

// 箱规展示数据
const productSkuCartonList = ref<Array<any>>([
	{
		skuCartonCode: '',
		outCartonSpecLength: '',
		outCartonSpecWidth: '',
		outCartonSpecHeight: '',
		outCartonSpecUnit: 'cm',
		cartonQty: '',
		cartonGrossWeight: '',
		cartonGrossWeightUnit: 'kg',
		cartonNetWeight: '',
		cartonNetWeightUnit: 'kg',
		containerCartonQty: '',
	},
]);

// 关联MSKU数据
const mskus = ref<Array<any>>([{ skuCode: '', skuName: '', imgUrl: '' }]);

// 报关信息
const declareForm = ref<any>({
	cnName: '', // 中文名称
	enName: '', // 英文名称
	customsCode: '', // 报关编码
	declarePrice: '', // 报关单价
	declarePriceUnit: 'kg', // 报关单价单位
	customsPriceCurrency: 'USD', // 报关单价币种
	legalUnit: '', // 法定第一单位
	mfnRate: '', // 最惠国进口税率
	mfnRateUnit: '%', // 最惠国进口税率 出口退税率单位
	exportRebateRate: '', // 出口退税率
	exportRebateRateUnit: '%', // 出口退税率单位
	customsSupervisionCondition: '', // 海关监管条件
	decItems: '', // 申报要素
});

// 报关信息表单
const declareFormRef = ref();

const formRules = ref({
	chineseName: [{ required: true, message: '请输入中文品名', trigger: 'blur' }],
	enName: [{ required: true, message: '请输入英文品名', trigger: 'blur' }],
	customsCode: [{ required: true, message: '请输入报关编码', trigger: 'blur' }],
	legalUnit: [
		{ required: true, message: '请选择法定第一单位', trigger: 'change' },
	],
	mfnRate: [
		{ required: true, message: '请输入最惠国进口税率', trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				if (value < 0 || value > 99.99) {
					callback(new Error('最惠国进口税率必须在0-99.99之间'));
				} else if (isNaN(value)) {
					declareForm.value.mfnRate = '';
					callback(new Error('最惠国进口税率必须是数字'));
				} else {
					callback();
				}
			},
		},
	],
	exportRebateRate: [
		{ required: true, message: '请输入出口退税率', trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				if (value < 0 || value > 99.99) {
					callback(new Error('出口退税率必须在0-99.99之间'));
				} else if (isNaN(value)) {
					declareForm.value.exportRebateRate = '';
					callback(new Error('出口退税率税率必须是数字'));
				} else {
					callback();
				}
			},
		},
	],
	customsSupervisionCondition: [
		{ required: true, message: '请输入海关监管条件', trigger: 'blur' },
	],
	decItems: [{ required: true, message: '请输入申报要素', trigger: 'blur' }],
});

// 清关信息
const clearanceInfos = ref<Array<any>>([
	{
		country: '',
		clearanceCode: '',
		clearanceRate: '',
		clearancePrice: '',
		clearancePriceCurrency: 'USD',
	},
]);
// 新增清关数据
const addClearanceRow = () => {
	clearanceInfos.value.push({
		country: '',
		clearanceCode: '',
		clearanceRate: '',
		clearancePrice: '',
		percent: '%',
		clearancePriceCurrency: 'USD',
	});
};
// 删除清关数据
const removeClearanceRow = (i: number) => {
	if (clearanceInfos.value.length > 1) clearanceInfos.value.splice(i, 1);
};
// 打开弹窗
const handleOpen = (row: any) => {
	mskus.value = row?.mskus || [];
	baseInfoList.value = [
		{
			skuCode: row.skuCode || '',
			skuName: row.skuName || '',
			imgUrl: row.imgUrl || '',
		},
	];
	productSkuCartonList.value = row.productSkuCartonList;
	clearanceInfos.value =
		row.clearanceInfos?.map((item: any) => {
			return {
				countryCode: item.countryCode || '',
				clearanceCode: item.clearanceCode || '',
				clearanceRate: item.clearanceRate || '',
				percent: item.percent || '%',
				clearancePrice: item.clearancePrice || '',
				clearancePriceCurrency: item.clearancePriceCurrency || 'USD',
			};
		}) || [];
	declareForm.value = {
		id: row.id || '',
		chineseName: row.chineseName || '',
		enName: row.enName || '',
		customsCode: row.customsCode || '',
		customsPrice: row.customsPrice || '',
		customsPriceCurrency: row.customsPriceCurrency || 'USD',
		legalUnit: row.legalUnit || '',
		mfnRate: row.mfnRate || '',
		mfnRateUnit: row.mfnRateUnit || '%',
		exportRebateRate: row.exportRebateRate || '',
		exportRebateRateUnit: row.exportRebateRateUnit || '%',
		customsSupervisionCondition: row.customsSupervisionCondition || '',
		decItems: row.decItems || '',
	};
	visible.value = true;
	skuTabs.value = 'base';
};

// 关闭弹窗;
const handleCancel = () => {
	visible.value = false;
};
// 提交
const handleOk = async () => {
	// 验证报关信息
	const isValid = await declareFormRef.value.validate();
	if (!isValid) return;

	// 验证清关信息
	// 1. 必填项
	for (let i = 0; i < clearanceInfos.value.length; i++) {
		const item = clearanceInfos.value[i];
		if (!item.countryCode || item.countryCode.trim() === '') {
			useMessage().error(`第 ${i + 1} 行的适用国家必填`);
			return false;
		}
		if (!item.clearanceCode || item.clearanceCode.trim() === '') {
			useMessage().error(`第 ${i + 1} 行的清关编码必填`);
			return false;
		}
		if (!item.clearanceRate || item.clearanceRate.toString().trim() === '') {
			useMessage().error(`第 ${i + 1} 行的税率必填`);
			return false;
		}
		// 2. 数值合法性
		if (
			isNaN(Number(item.clearanceRate)) ||
			Number(item.clearanceRate) < 0 ||
			Number(item.clearanceRate) > 100
		) {
			useMessage().error(`第 ${i + 1} 行的税率必须为数字且在0-100之间`);
			return false;
		}
		if (item.clearancePrice && item.clearancePrice.toString().trim() !== '') {
			if (isNaN(Number(item.clearancePrice))) {
				useMessage().error(`第 ${i + 1} 行的清关单价必须为数字`);
				return false;
			}
			if (Number(item.clearancePrice) < 0) {
				useMessage().error(`第 ${i + 1} 行的清关单价不能小于0`);
				return false;
			}
		}
	}
	const params = {
		...declareForm.value,
		skuCode: baseInfoList.value[0]?.skuCode || '',
		items: clearanceInfos.value.map((item) => ({
			...item,
			countryCode: item.countryCode || '',
			clearanceRate: item.clearanceRate || '',
			percent: item.percent || '%',
			clearancePrice: item.clearancePrice || '',
			clearancePriceCurrency: item.clearancePriceCurrency || 'USD',
		})),
	};
	emit('submit', params);
};

defineExpose({
	handleOpen,
	handleCancel,
});
</script>

<style lang="scss" scoped>
.section {
	margin-bottom: 24px;
}
.section-title {
	font-weight: 600;
	margin-bottom: 10px;
}
.ml-2 {
	margin-left: 8px;
}
.mb-2 {
	margin-bottom: 8px;
}
.font-bold {
	font-weight: bold;
}
</style>
