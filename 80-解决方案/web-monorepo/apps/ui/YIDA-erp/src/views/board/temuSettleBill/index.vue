<!--
 * @Description: 
-->
<!--
 * @Description: 
-->
<!--
 * @Description: 
-->
<template>
	<div class="layout-padding">
		<el-tabs v-model="activeName" type="border-card">
			<el-tab-pane
				:label="$t('财务明细')"
				name="accountingDetail"
				:style="{ height: '100%' }"
				v-if="auth('temuSettleBillAccountingDetail_view')"
			>
				<AccountingDetail v-if="activeName === 'accountingDetail'" />
			</el-tab-pane>
			<el-tab-pane
				:label="$t('结算账单')"
				name="settleBill"
				:style="{ height: '100%' }"
				v-if="auth('temuSettleBillSettleBill_view')"
			>
				<SettleBill v-if="activeName === 'settleBill'" />
			</el-tab-pane>

			<el-tab-pane
				:label="$t('支出明细')"
				name="disbursementDetail"
				:style="{ height: '100%' }"
				v-if="auth('temuSettleBillDisbursementDetail_view')"
			>
				<DisbursementDetail v-if="activeName === 'disbursementDetail'" />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';

import { auth } from '/@/utils/authFunction';

// 导入三个组件
const AccountingDetail = defineAsyncComponent(
	() => import('./accountingDetail/index.vue')
);
const SettleBill = defineAsyncComponent(() => import('./settleBill/index.vue'));
const DisbursementDetail = defineAsyncComponent(
	() => import('./disbursementDetail/index.vue')
);

const activeName = ref('accountingDetail');
</script>

<style lang="scss" scoped></style>
