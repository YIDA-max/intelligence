<script setup lang="ts">
import { ref } from 'vue';

import { useI18n } from 'vue-i18n';
import { useMessage } from '/@/hooks/message';

import { getFeeComparisonResult } from '/@/api/fbm/selfOrder/index';

const { t } = useI18n();
const props = defineProps({
	// 当前行数据
	currentRow: {
		type: Object,
		default: () => ({}),
	},
});
const dialogRef = ref<any | null>(null);
// 弹窗显示与否
const dialogVisible = ref(false);
// 描述信息
const descriptionsVO = ref({
	platformName: '', // 平台名称
	storeName: '', // 店铺名称
	platformOrderNo: '', // 平台单号
	systemOrderNo: '', // 系统订单号
	calDate: '', // 完成比价时间
	packageWeight: 0, // 包裹重量
	packageSize: '', // 包裹尺寸
	packageVolume: 0, // 包裹体积
	country: '', // 目的国家
	postCode: '', // 目的邮编
});
// 商品信息
const skuInfoList = ref<Array<any>>([]);
// 试算结果
const feeResultList = ref<Array<any>>([]);
/**
 * 初始化
 */
const init = async () => {
	// 重置数据
};
/**
 * 打开弹窗方法
 * 供父组件调用
 */
const show = async () => {
	const res = await getFeeComparisonResult(props.currentRow.selfOrderNo);
	if (res.data && res.code === 0) {
		descriptionsVO.value = {
			...res.data,
		};
		skuInfoList.value = res.data?.skuInfoList || [];
		feeResultList.value = res.data?.feeResultList || [];
		dialogVisible.value = true;
	} else {
		// 处理错误
		useMessage().error(res.msg || '无费用试算结果');
		// 关闭弹窗
		dialogVisible.value = false;
	}
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
		width="80%"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:append-to-body="true"
		@open="init"
		@close="hide"
		:title="t('试算结果')"
	>
		<div class="dialog-container">
			<div class="section-title">
				<span class="section-bar"></span>
				<span class="mr-2"> 基础信息</span>
			</div>
			<el-row>
				<el-col :span="24">
					<el-descriptions :column="5" border class="w-full">
						<el-descriptions-item>
							<template #label>{{ t('平台名称') }}</template>
							<template #default>
								<div class="w-full truncate">
									{{ descriptionsVO.platformName }}
								</div>
							</template>
						</el-descriptions-item>
						<el-descriptions-item>
							<template #label>{{ t('店铺名称') }}</template>
							<template #default>
								<div class="w-full truncate">
									{{ descriptionsVO.storeName }}
								</div>
							</template>
						</el-descriptions-item>
						<el-descriptions-item>
							<template #label>{{ t('平台单号') }}</template>
							<template #default>
								<el-popover placement="top" width="200" trigger="hover">
									<div class="">{{ descriptionsVO.platformOrderNo }}</div>
									<template #reference>
										<div class="truncate max-w-40">
											{{ descriptionsVO.platformOrderNo }}
										</div>
									</template>
								</el-popover>
							</template>
						</el-descriptions-item>
						<el-descriptions-item>
							<template #label>{{ t('系统订单号') }}</template>
							<template #default>
								<div class="w-full truncate">
									{{ descriptionsVO.systemOrderNo }}
								</div>
							</template>
						</el-descriptions-item>
						<el-descriptions-item>
							<template #label>{{ t('完成比价时间') }}</template>
							<template #default>
								<div class="w-full truncate">
									{{ descriptionsVO.calDate }}
								</div>
							</template>
						</el-descriptions-item>
						<el-descriptions-item>
							<template #label>{{ t('包裹重量') }}</template>
							<template #default>
								<div class="w-full truncate">
									{{ descriptionsVO.packageWeight }}kg
								</div>
							</template>
						</el-descriptions-item>
						<el-descriptions-item>
							<template #label>{{ t('包裹尺寸') }}</template>
							<template #default>
								<div class="w-full truncate">
									{{ descriptionsVO.packageSize }} cm
								</div>
							</template>
						</el-descriptions-item>
						<el-descriptions-item>
							<template #label>{{ t('包裹体积') }}</template>
							<template #default>
								<div class="w-full truncate">
									{{ descriptionsVO.packageVolume }} cm³
								</div>
							</template>
						</el-descriptions-item>
						<el-descriptions-item>
							<template #label>{{ t('目的国家') }}</template>
							<template #default>
								<div class="w-full truncate">
									{{ descriptionsVO.country }}
								</div>
							</template>
						</el-descriptions-item>
						<el-descriptions-item>
							<template #label>{{ t('目的邮编') }}</template>
							<template #default>
								<div class="w-full truncate">
									{{ descriptionsVO.postCode }}
								</div>
							</template>
						</el-descriptions-item>
					</el-descriptions>
				</el-col>
			</el-row>
			<div class="section-title">
				<span class="section-bar"></span>
				<span class="mr-2"> 商品信息</span>
			</div>
			<el-row>
				<el-table
					:data="skuInfoList"
					style="width: 100%"
					stripe
					border
					row-key="id"
					native-scrollbar
				>
					<el-table-column type="index" :label="t('序号')" width="80" />
					<el-table-column
						prop="skuCode"
						:label="t('SKU')"
						min-width="200"
						show-overflow-tooltip
					>
					</el-table-column>
					<el-table-column
						prop="skuName"
						:label="t('商品名称')"
						min-width="300"
						show-overflow-tooltip
					>
					</el-table-column>
					<el-table-column prop="quantity" :label="t('数量')" min-width="100">
					</el-table-column>
					<el-table-column
						prop="skuWeight"
						:label="t('商品重量kg')"
						min-width="200"
						show-overflow-tooltip
					/>
					<el-table-column
						prop="skuSize"
						:label="t('商品尺寸(cm)')"
						min-width="200"
						show-overflow-tooltip
					/>
				</el-table>
			</el-row>
			<div class="section-title">
				<span class="section-bar"></span>
				<span class="mr-2"> 试算结果</span>
			</div>
			<el-row>
				<el-table
					class="table-box"
					:data="feeResultList"
					style="width: 100%"
					stripe
					border
					row-key="id"
					native-scrollbar
				>
					<el-table-column type="index" :label="t('序号')" width="80" />
					<el-table-column
						prop="warehouseName"
						:label="t('发货仓库名称')"
						min-width="150"
						show-overflow-tooltip
					>
					</el-table-column>
					<el-table-column prop="logisticsServiceProvider" min-width="250">
						<template #header>{{ t('物流商名称') }}</template>
					</el-table-column>
					<el-table-column
						prop="logisticsChannelName"
						:label="t('渠道名称')"
						min-width="150"
						show-overflow-tooltip
					/>
					<el-table-column
						prop="logisticsChannelCode"
						:label="t('渠道代码')"
						min-width="150"
						show-overflow-tooltip
					/>
					<el-table-column
						prop="totalFee"
						:label="t('试算总费用')"
						min-width="100"
						show-overflow-tooltip
					>
					</el-table-column>
					<el-table-column
						prop="warehouseFee"
						:label="t('仓库费用')"
						min-width="100"
						show-overflow-tooltip
					>
					</el-table-column>
					<el-table-column
						prop="logisticsFee"
						:label="t('物流费用')"
						min-width="100"
						show-overflow-tooltip
					>
					</el-table-column>
					<el-table-column
						prop="currencyCode"
						:label="t('币种代码')"
						min-width="150"
						show-overflow-tooltip
					>
					</el-table-column>
					<el-table-column
						prop="baseZoneName"
						:label="t('基础分区')"
						min-width="150"
						show-overflow-tooltip
					>
					</el-table-column>
					<el-table-column
						prop="farawayZoneName"
						:label="t('偏远分区')"
						min-width="150"
						show-overflow-tooltip
					>
					</el-table-column>
					<el-table-column
						prop="farawayZoneName2"
						:label="t('超偏远分区')"
						min-width="150"
						show-overflow-tooltip
					>
					</el-table-column>
					<el-table-column
						prop="calDate"
						:label="t('计算时间')"
						min-width="150"
						show-overflow-tooltip
					>
					</el-table-column>
					<el-table-column
						prop="feeWarehouseName"
						:label="t('费用系统仓库')"
						min-width="150"
						show-overflow-tooltip
					/>
					<el-table-column
						prop="feeLogisticsChannelName"
						:label="t('费用系统渠道')"
						min-width="150"
						show-overflow-tooltip
					/>
					<el-table-column
						prop="errorMsgLogisticsFee"
						:label="t('物流费用计算错误信息')"
						min-width="200"
						show-overflow-tooltip
					/>
				</el-table>
			</el-row>
		</div>

		<template #footer>
			<div style="text-align: right">
				<el-button @click="hide">{{ t('关闭') }}</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<style lang="scss" scoped>
.dialog-container {
	padding: 0 20px;
	height: 70vh;
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
	.mb18 {
		margin-bottom: 18px;
	}
	.table-box {
		height: calc(60vh - 35px);
	}
}
</style>
