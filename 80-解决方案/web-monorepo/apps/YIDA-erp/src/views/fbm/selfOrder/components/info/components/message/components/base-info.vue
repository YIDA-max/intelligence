<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-28 20:37:09
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-20 17:36:14
 * @FilePath: \qianyi-ui\src\views\fbm\selfOrder\components\info\components\message\components\base-info.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import commonFunction from '/@/utils/commonFunction';
import { DocumentCopy } from '@element-plus/icons-vue';
// import { getImageUrl } from '/@/utils/getImageUrl';
const { copyText } = commonFunction();
import { inject } from 'vue';
const currentRow = inject<any>('currentRow');
</script>
<template>
	<div class="info">
		<el-row>
			<el-col :span="24" class="items-center fontWeight"> 基础信息 </el-col>
		</el-row>
		<el-row>
			<el-col :span="24" class="items-center">
				<span class="font-color">所属订单:</span>
				{{ currentRow?.selfOrderNo || '暂无' }}
				<el-link
					:icon="DocumentCopy"
					@click="copyText(currentRow?.selfOrderNo || '暂无')"
					underline="never"
				></el-link>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24" class="items-center">
				<span class="font-color"> 订购时间(北京):</span>
				{{ currentRow?.orderTime }}
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24" class="items-center">
				<span class="font-color"> 付款时间(北京):</span>
				{{ currentRow?.paymentTime }}
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24" class="items-center">
				<span class="font-color"> 发货截止(北京):</span>
				{{ currentRow?.latestShippingTime }}
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24" class="items-center">
				<span class="font-color"> 送达截止(北京):</span>
				{{ currentRow?.latestDeliveryTime }}
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24" class="items-center">
				<span class="font-color"> 是否补发:</span>
				{{
					currentRow?.resendOrder === 1
						? '是'
						: currentRow?.resendOrder === 0
						? '否'
						: '暂无'
				}}
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="18" class="items-center-icon">
				<el-icon><Goods /></el-icon>
				<span>{{ currentRow?.storeName }}:{{ currentRow?.siteCode }}</span>
				<el-link
					:icon="DocumentCopy"
					@click="copyText(`${currentRow?.siteCode}:${currentRow?.storeName}`)"
					underline="never"
				></el-link>
			</el-col>
		</el-row>
	</div>
</template>

<style scoped lang="scss">
.info {
	width: 24%;
	height: 220px;
	border: 1px solid #e4e7ed;
	border-radius: 5px;
	padding: 12px 16px;
	font-size: 12px;
	.font-color {
		color: #939da8;
	}
	.items-center {
		height: 20px;
		line-height: 20px;
		margin-bottom: 3px;
	}
	.items-center-image {
		display: flex;
		align-items: center;
	}
	.items-center-icon {
		display: flex;
		align-items: center;
		span {
			margin-left: 8px;
			margin-right: 8px;
		}
	}
	.fontWeight {
		font-weight: 900;
		color: #000;
	}
}
</style>
