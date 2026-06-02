<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-24 15:55:59
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-17 11:26:11
 * @FilePath: \qianyi-ui\src\views\fbm\selfOrder\components\tableColumnHeader\header-order-states\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { DocumentCopy, ArrowDown } from '@element-plus/icons-vue';
import commonFunction from '/@/utils/commonFunction';
const { copyText } = commonFunction();
const props = defineProps({
	currentRow: {
		type: Object,
		default: () => ({}),
	},
});
</script>
<template>
	<div class="component">
		<el-row class="row">
			<el-col :span="24" class="flex">
				<el-row>
					<el-col :span="24" class="flex">
						<span class="font-color"> 买家信息: </span>
						<span class="mr-1">{{
							props.currentRow?.buyerInfoVO?.buyerName
						}}</span>
						<el-popover placement="left" trigger="hover" width="400">
							<template #default>
								<el-row>
									<el-col :span="24" class="flex">
										<span class="font-color"> 买家姓名: </span>
										<span class="mr-1">
											{{ props.currentRow?.buyerInfoVO?.buyerName || '---' }}
										</span>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="24" class="flex">
										<span class="font-color"> 买家邮箱: </span>
										<span class="mr-1">
											<MrTextEllipsis
												:text="
													props?.currentRow?.buyerInfoVO?.buyerEmail || '---'
												"
												:max-width="10"
											/>
										</span>
										<el-link
											:icon="DocumentCopy"
											@click="
												copyText(
													'买家邮箱: ' +
														(props.currentRow?.buyerInfoVO?.buyerEmail || '---')
												)
											"
											underline="never"
										></el-link>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="24" class="flex">
										<span class="font-color"> 买家备注: </span>
										<span class="mr-1">
											<MrTextEllipsis
												:text="
													props?.currentRow?.buyerInfoVO?.buyerMessage || '---'
												"
												:max-width="10"
											/>
										</span>
										<el-link
											v-if="props.currentRow?.buyerInfoVO?.buyerMessage"
											:icon="DocumentCopy"
											@click="
												copyText(
													'买家备注: ' +
														(props.currentRow?.buyerInfoVO?.buyerMessage ||
															'---')
												)
											"
											underline="never"
										></el-link>
									</el-col>
								</el-row>
							</template>
							<template #reference>
								<div>
									<el-link :icon="ArrowDown" underline="never"></el-link>
								</div>
							</template>
						</el-popover>
					</el-col>
				</el-row>
			</el-col>
		</el-row>
	</div>
</template>

<style scoped lang="scss">
.component {
	display: flex;
	gap: 8px;
	width: 100%;
	height: 100%;
	font-size: 12px;
	.row {
		width: 100%;
	}
	.font-weight {
		font-weight: 900;
	}
	.font-color {
		color: #939da8;
	}
}
</style>
