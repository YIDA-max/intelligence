<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-26 18:51:17
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-23 12:20:31
 * @FilePath: \qianyi-ui\src\views\fbm\selfOrder\components\info\components\productList\index.vue
 * @Description: 商品信息列表
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
-->
<script setup lang="ts">
import { inject } from 'vue';
// import { postUpdateOrderTag } from '/@/api/fbm/selfOrder/index';
import {
	postUpdateSkuRemark,
	postUpdateCsNote,
} from '/@/api/fbm/selfOrder/index';
import { postSymbol } from '/@/utils/rateUtils';
// 编辑标签组件
// const EditTag = defineAsyncComponent(() => import('/@/components/EditTag/index.vue'));
const Message = defineAsyncComponent(
	() => import('/@/views/fbm/selfOrder/components/message/index.vue')
);
const getDataList = inject('getDataList') as () => void;
const currentRow = inject<any>('currentRow');
// 编辑标签
// const handleEditTag = async (tag: any) => {
// 	currentRow.value.orderTag = tag;
// 	const res = await postUpdateOrderTag({
// 		id: currentRow.value.id,
// 		tagIds: tag?.map((item: any) => item.id),
// 	});
// 	if (res.code === 0) {
// 		// 更新当前行数据
// 		getDataList();
// 	}
// };
</script>
<template>
	<div class="productList">
		<el-card shadow="never">
			<template #header>
				<el-row>
					<el-col :span="1" class="borderRight font-color">
						({{ currentRow.orderItemVOList?.length }}种商品)
					</el-col>
					<el-col :span="3" class="borderRight font-color">
						预估计重量: {{ currentRow.weight }} kg
					</el-col>
					<el-col :span="3" class="borderRight font-color">
						预估计重体积: {{ currentRow.volume }} m³
					</el-col>
				</el-row>
			</template>
			<template #default>
				<el-row
					class="listItem"
					v-for="item in currentRow.orderItemVOList"
					:key="item.id"
				>
					<el-col :span="8">
						<el-row>
							<el-col :span="3" class="items-center-image">
								<el-image
									style="width: 50px; height: 50px; border-radius: 4px"
									:src="item.imgUrl"
									:preview-src-list="[item.imgUrl]"
									:preview-teleported="true"
									fit="cover"
								/>
							</el-col>
							<el-col :span="16">
								<el-row>
									<el-col :span="24" class="fontWeight">
										<div
											v-if="item.bundleFlag === 1"
											style="
												display: inline-flex;
												align-items: center;
												justify-content: center;
												height: 19px;
												min-width: 19px;
												color: #67c23a;
												border: 1px solid #67c23a;
												margin-right: 4px;
												padding: 0 4px;
												border-radius: 2px;
												font-size: 12px;
												line-height: 1;
											"
										>
											含
										</div>
										<span>{{ item.skuName || '---' }}</span>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="24" class="flex">
										<div>
											<span class="font-color">SKU:</span>
										</div>
										<div>
											<span class="fontWeight">
												{{ item.skuCode || '---' }}</span
											>
										</div>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="24" class="flex">
										<div>
											<span class="font-color">三方仓SKU:</span>
										</div>
										<div>
											<span class="fontWeight">
												{{ item.warehouseSkuCode || '---' }}
											</span>
										</div>
									</el-col>
								</el-row>
								<el-row>
									<el-popover placement="top" trigger="hover" width="200">
										<template #reference>
											<el-col :span="24" class="flex w-full truncate">
												<div>
													<span class="font-color">特殊属性:</span>
												</div>
												<div>
													<span class="fontWeight">
														{{ item.specialAttribute || '---' }}
													</span>
												</div>
											</el-col>
										</template>
										<div>
											<span> {{ item.specialAttribute || '---' }}</span>
										</div>
									</el-popover>
								</el-row>
								<el-row>
									<el-col :span="24" class="flex w-full truncate">
										<div>
											<span class="font-color">产品备注:</span>
										</div>
										<div>
											<span class="w-full mr-1 fontWeight">
												<MrTextEllipsis
													:text="item.itemRemark || '---'"
													:max-length="50"
												/>
											</span>
											<span v-auth="'selfOrder-editItemRemark'">
												<Message
													:params="item"
													:title="'产品备注'"
													type="1"
													:api="postUpdateSkuRemark"
													@submit="
														(e) => {
															item.itemRemark = e;
															getDataList();
														}
													"
												/>
											</span>
										</div>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</el-col>
					<el-col
						:span="8"
						:style="{
							paddingRight: '16px',
						}"
					>
						<el-row>
							<el-col :span="24" class="line-clamp-2 fontWeight">
								<span>{{ item.productTitle || '---' }}</span>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="24" class="flex">
								<div>
									<span class="font-color">MSKU:</span>
								</div>
								<div>
									<span class="fontWeight"> {{ item.mskuCode || '---' }} </span>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="24" class="flex">
								<div>
									<span class="font-color">itemID:</span>
								</div>
								<div>
									<span class="fontWeight"> {{ item.itemId || '---' }}</span>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="24" class="flex">
								<div>
									<span class="font-color">运营:</span>
								</div>
								<div>
									<span class="fontWeight">
										{{ item.operationUser || '---' }}
									</span>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="24" class="flex">
								<div>
									<span class="font-color">运营小组:</span>
								</div>
								<div>
									<span class="fontWeight"> {{ item.deptName || '---' }} </span>
								</div>
							</el-col>
						</el-row>
					</el-col>
					<el-col :span="4">
						<el-row>
							<el-col :span="24" class="flex">
								<div>
									<span>订购:</span>
								</div>
								<div>
									<span class="fontWeight">
										{{ item.orderQuantity || '0' }}
									</span>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="24" class="flex">
								<div>
									<span>已作废:</span>
								</div>
								<div>
									<span class="fontWeight">
										{{ item.nullifyQuantity || '0' }}
									</span>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="24" class="flex">
								<div>
									<!-- 订购-已作废=应发 -->
									<span>应发:</span>
								</div>
								<div>
									<span class="fontWeight">
										{{
											Number(item.orderQuantity ? item.orderQuantity : 0) -
												Number(
													item.nullifyQuantity ? item.nullifyQuantity : 0
												) || '0'
										}}
									</span>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="24" class="flex">
								<div>
									<span>已发:</span>
								</div>
								<div>
									<span class="fontWeight">
										{{ item.shippedQuantity || '0' }}
									</span>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="24" class="flex">
								<div>
									<!-- 应发-已发=未发 -->
									<span>未发:</span>
								</div>
								<div>
									<span class="fontWeight orangeColor">
										{{
											(Number(item.orderQuantity ? item.orderQuantity : 0) -
												Number(
													item.nullifyQuantity ? item.nullifyQuantity : 0
												) || 0) -
											(Number(
												item.shippedQuantity ? item.shippedQuantity : 0
											) || 0)
										}}
									</span>
								</div>
							</el-col>
						</el-row>
					</el-col>
					<el-col :span="4">
						<el-row>
							<el-col :span="24" class="flex">
								<div>
									<span>商品单价(不含税):</span>
								</div>
								<div>
									<span>
										{{ postSymbol(currentRow.currencyCode, item.unitPrice) }}
									</span>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="24" class="flex">
								<div>
									<span>商品售价(不含税):</span>
								</div>
								<div>
									<span>
										{{ postSymbol(currentRow.currencyCode, item.sellingPrice) }}
									</span>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="24" class="flex">
								<div>
									<span>商品折扣:</span>
								</div>
								<div>
									<span>
										{{ postSymbol(currentRow.currencyCode, item.discount) }}
									</span>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="24" class="flex">
								<div>
									<span>商品积分:</span>
								</div>
								<div>
									<span> {{ item.points || '---' }} </span>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="24" class="flex">
								<div>
									<span>商品税金:</span>
								</div>
								<div>
									<span>
										{{ postSymbol(currentRow.currencyCode, item.tax) }}</span
									>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="24" class="flex">
								<div>
									<span>商品买家支付运费:</span>
								</div>
								<div>
									<span
										>{{
											postSymbol(
												currentRow.currencyCode,
												item.customerPaidShipping
											)
										}}
									</span>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="24" class="flex">
								<div>
									<span>商品其他费用:</span>
								</div>
								<div>
									<span>
										{{ postSymbol(currentRow.currencyCode, item.otherFee) }}
									</span>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="24" class="flex">
								<div>
									<span>利润:</span>
								</div>
								<div>
									<span>
										{{ postSymbol(currentRow.currencyCode, item.profit) }}
									</span>
								</div>
							</el-col>
						</el-row>
					</el-col>
				</el-row>
			</template>
			<template #footer>
				<el-row class="mt-2 mb-2 button" :gutter="20">
					<el-col :span="12">
						<div class="flex items-center justify-start">
							<div>标签</div>
							<div>
								<el-tag
									:style="{
										marginLeft: '8px',
										color: '#fff',
									}"
									v-for="item in (currentRow?.orderTag
										? currentRow?.orderTag
										: []
									).slice(0, 1)"
									:key="item.id"
									:color="item.color"
									>{{ item.name }}
								</el-tag>
								<el-popover
									v-if="
										(currentRow?.orderTag ? currentRow?.orderTag : []).length >
										1
									"
									placement="top"
									width="200"
									trigger="hover"
								>
									<el-tag
										v-for="item in currentRow?.orderTag
											? currentRow?.orderTag
											: []"
										:key="item.id"
										:style="{
											margin: '4px 4px 0 0',
											color: '#fff',
										}"
										:color="item.color"
										>{{ item.name }}</el-tag
									>
									<template #reference>
										<el-tag
											:style="{
												marginLeft: '8px',
												background: '#f0f0f0',
												color: '#000',
												cursor: 'pointer',
											}"
											>...</el-tag
										>
									</template>
								</el-popover>
							</div>
							<!-- <div class="w-9">
								<EditTag
									@submit="handleEditTag"
									:value="((currentRow?.orderTag ? currentRow?.orderTag : []) ).map((item :any) => item.id)"
									:style="{
										marginLeft: '8px',
									}"
								/>
							</div> -->
						</div>
					</el-col>
					<el-col :span="12">
						<span class="mr-1"
							>客服备注: {{ currentRow.orderExtensionVO.csNote || '---' }}</span
						>
						<span v-auth="'selfOrder-editcsNote'">
							<Message
								:params="currentRow"
								:title="'客服备注'"
								type="2"
								:api="postUpdateCsNote"
								@submit="
									(e) => {
										getDataList();
										currentRow.orderExtensionVO.csNote = e;
									}
								"
							/>
						</span>
					</el-col>
				</el-row>
			</template>
		</el-card>
	</div>
</template>

<style scoped lang="scss">
.productList {
	font-size: 12px;
	.font-color {
		color: #939da8;
	}
	.borderRight {
		border-right: 1px solid #e8e8e8;
		padding-right: 8px;
		margin-right: 8px;
	}
	.listItem {
		margin-bottom: 8px;
		padding-bottom: 8px;
		border-bottom: 1px solid #ccc;
		.items-center-image {
			display: flex;
			justify-content: flex-start;
			align-items: center;
		}
		.fontWeight {
			font-weight: 500;
			color: #000;
		}
	}
	.button {
		padding: 0px 16px;
	}
	.orangeColor {
		color: orange !important;
	}
}
</style>
