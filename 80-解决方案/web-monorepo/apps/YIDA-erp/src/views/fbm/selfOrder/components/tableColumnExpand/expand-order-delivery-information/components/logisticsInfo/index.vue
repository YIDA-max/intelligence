<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-11-17 17:16:32
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-11-17 20:03:33
 * @FilePath: \qianyi-ui\src\views\fbm\selfOrder\components\tableColumnExpand\expand-order-delivery-information\components\logisticsInfo\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { ref, Ref } from 'vue';
import commonFunction from '/@/utils/commonFunction';
import { DocumentCopy } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import { ArrowDown } from '@element-plus/icons-vue';
import { postGetLogisticsInfo } from '/@/api/fbm/selfOrder/index';
import { ElPopover } from 'element-plus';
const { copyText } = commonFunction();
const { t } = useI18n();
const showInfo = ref({
	logisticsProvider: '', // 物流商
	logisticsTrackingNo: '', // 物流跟踪号
	waybillNo: '', // 运单号
	carrierName: '', // 承运人
	standardShippingCarrier: '', // 标发承运人
});
const popoverRef = ref<InstanceType<typeof ElPopover> | null>(null);
const currentRow = inject('currentRow') as Ref<any>;
/**
 * 初始化
 */
const init = async () => {
	showInfo.value = {
		logisticsProvider: '', // 物流商
		logisticsTrackingNo: '', // 物流跟踪号
		waybillNo: '', // 运单号
		carrierName: '', // 承运人
		standardShippingCarrier: '', // 标发承运人
	};
	const res = await postGetLogisticsInfo({
		id: currentRow.value.id,
	});
	if (res && res.code === 0 && res.data) {
		Object.assign(showInfo.value, res.data);
	}
};
</script>

<template>
	<div>
		<el-popover
			placement="top"
			trigger="click"
			width="350"
			ref="popoverRef"
			@show="init"
		>
			<template #default>
				<el-row>
					<div>{{ t('物流商') }}:</div>
					<div>
						{{ showInfo.logisticsProvider }}
					</div>
				</el-row>
				<el-row>
					<div class="flex">
						标发承运人
						<el-popover placement="top" width="230" trigger="hover">
							<template #default>
								<div class="">
									<div>订单平台上的承运人</div>
								</div>
							</template>
							<template #reference>
								<div class="mr-2">
									<el-icon><QuestionFilled /></el-icon>
								</div>
							</template>
						</el-popover>
						:
					</div>
					<div>
						{{ showInfo.standardShippingCarrier }}
					</div>
				</el-row>
				<el-row>
					<div class="flex">
						实际承运人
						<el-popover placement="top" width="230" trigger="hover">
							<template #default>
								<div class="">
									<div>三方仓/平台仓实际配送的承运人</div>
								</div>
							</template>
							<template #reference>
								<div class="mr-2">
									<el-icon><QuestionFilled /></el-icon>
								</div>
							</template>
						</el-popover>
						:
					</div>
					<div>
						{{ showInfo.carrierName }}
					</div>
				</el-row>
				<el-row>
					<div>运单号:</div>
					<div>
						{{ showInfo.waybillNo }}
					</div>
				</el-row>
				<el-row>
					<div>跟踪号:</div>
					<div>
						{{ showInfo.logisticsTrackingNo }}
						<el-link
							:icon="DocumentCopy"
							@click="copyText(showInfo.logisticsTrackingNo)"
							underline="never"
						></el-link>
					</div>
				</el-row>
			</template>
			<template #reference>
				<el-link
					underline="never"
					type="primary"
					@click="() => {}"
					:icon="ArrowDown"
				>
				</el-link>
			</template>
		</el-popover>
	</div>
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
	.mb18 {
		margin-bottom: 18px;
	}
}
</style>
