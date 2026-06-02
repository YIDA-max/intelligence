<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-28 20:37:09
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-20 17:28:09
 * @FilePath: \qianyi-ui\src\views\fbm\selfOrder\components\info\components\message\components\recipient-info.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { inject } from 'vue';
const currentRow = inject<any>('currentRow');
</script>
<template>
	<div class="info">
		<el-row>
			<el-col
				:span="24"
				:style="{
					fontWeight: '600',
				}"
				class="items-center"
			>
				收件人信息
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24" class="items-center-icon">
				<el-icon class="mr-1"><UserFilled /></el-icon>
				<MrTextEllipsis
					:text="currentRow?.buyerInfoVO?.recipientName"
					:max-length="20"
				/>
			</el-col>
			<el-col :span="24" class="items-center-icon">
				<el-icon class="mr-1"><Message /></el-icon>

				<MrTextEllipsis
					:text="currentRow?.buyerInfoVO?.recipientEmail"
					:max-length="20"
				/>
			</el-col>
			<el-col :span="24" class="items-center-icon">
				<el-icon class="mr-1"><PhoneFilled /></el-icon>
				<MrTextEllipsis
					:text="currentRow?.buyerInfoVO?.recipientPhone"
					:max-length="20"
				/>
			</el-col>
			<el-col :span="24" class="items-center-icon mt-1 border-t">
				<el-icon class="mr-1"><Place /></el-icon>
				<div :style="{ marginLeft: '8px' }">
					地址:{{ currentRow?.buyerInfoVO?.recipientDetailAddress }}
					<div>
						{{ currentRow?.buyerInfoVO?.recipientStreet }}
						{{ currentRow?.buyerInfoVO?.recipientDistrict }}
						{{ currentRow?.buyerInfoVO?.recipientCity }}
						{{ currentRow?.buyerInfoVO?.recipientState }}
					</div>
					<div>
						{{ currentRow?.buyerInfoVO?.recipientPostcode }}
						{{ currentRow?.buyerInfoVO?.recipientCountry }}
					</div>
				</div>
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
	.items-center {
		height: 20px;
		line-height: 20px;
		margin-bottom: 3px;
		color: #000;
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
}
</style>
