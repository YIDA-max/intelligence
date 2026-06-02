<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-24 15:55:59
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-05-19 18:21:14
 * @FilePath: \qianyi-ui\src\views\fbm\selfOrder\components\tableColumnExpand\expand-order-delivery-information\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import {
	postUpdateFile,
	deleteFile as deleteOrderFileApi,
} from '/@/api/fbm/selfOrder/index';
import { useMessage } from '/@/hooks/message';
import other from '/@/utils/other';
import { getFullFileUrl } from '/@/utils/fileUrl';
import { DocumentCopy } from '@element-plus/icons-vue';
import commonFunction from '/@/utils/commonFunction';
const Charges = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/tableColumnExpand/expand-order-delivery-information/components/charges/charges.vue'
		)
);
const LogisticsInfo = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/tableColumnExpand/expand-order-delivery-information/components/logisticsInfo/index.vue'
		)
);
const props = defineProps({
	currentRow: {
		type: Object,
		default: () => ({}),
	},
});
const orderExtensionVO = ref<any>({});
const chargesRef = ref<any>(null);
const { copyText } = commonFunction();
// 显示费用详情弹窗
const showCharges = () => {
	chargesRef.value?.show();
};

// 监听currentRow变化
watch(
	() => props.currentRow,
	(val) => {
		// 进行反序列化
		for (const item in val?.orderExtensionVO) {
			if (
				item === 'bolFile' ||
				item === 'packingListFile' ||
				item === 'otherFile' ||
				item === 'fbaLabel' ||
				item === 'shippingLabel'
			) {
				orderExtensionVO.value[item] = JSON.parse(
					val?.orderExtensionVO[item] || '[]'
				);
			}
		}
	},
	{ immediate: true, deep: true }
);
// 上传成功回调
const successUpload = async (res: any, row: any) => {
	await postUpdateFile({
		id: props.currentRow.id,
		file: [res?.data?.fileName],
		type: row.id,
	});
};
// 删除附件（入参与更新接口一致，走独立 deleteFile 接口）
const deleteFile = async (res: any, row: any) => {
	await deleteOrderFileApi({
		id: props.currentRow.id,
		file: [res?.fileName],
		type: row.id,
	});
	orderExtensionVO.value[row.value] = [];
};
// 全部下载
const handleAllDownload = () => {
	// 如果没有附件则不执行下载
	const hasFiles = Object.values(orderExtensionVO.value).some((files: any) =>
		Array.isArray(files) ? files.length > 0 : !!files
	);
	if (!hasFiles) {
		useMessage().warning('没有可下载的附件');
		return;
	}
	// 定义需要下载的文件类型
	const fileTypes = [
		'shippingLabel',
		'bolFile',
		'packingListFile',
		'fbaLabel',
		'otherFile',
	];
	fileTypes.forEach((type) => {
		const rawFiles = orderExtensionVO.value?.[type];
		// 兼容：可能是 string[] / string / undefined
		const files = Array.isArray(rawFiles)
			? rawFiles
			: rawFiles
			? [rawFiles]
			: [];
		if (!files.length) return;
		files.forEach((fileName: string) => {
			if (!fileName) return;
			other.downBlobFile(getFullFileUrl(fileName), {}, fileName);
		});
	});
};
/**
 * 计算订单扩展信息中附件的数量
 * @param orderExtensionVO 订单扩展信息
 */
const showLength = (orderExtensionVO: any) => {
	// 计算订单扩展信息中附件的数量
	const count = Object.values(orderExtensionVO || {}).filter(
		(item: any) => item?.length > 0
	)?.length;
	// 返回附件数量
	return count > 0 ? `(${count})` : '';
};
</script>
<template>
	<div class="component">
		<el-row :justify="'space-between'">
			<el-col :span="24">
				<el-row>
					<el-col :span="24" class="flex items-center">
						<div>
							<span class="mr-1 fontColor">国家/地区:</span>
						</div>
						<div>
							<span>{{
								props.currentRow.buyerInfoVO?.recipientCountry || '---' || '---'
							}}</span>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" class="flex items-center">
						<div>
							<span class="mr-1 fontColor">发货时间:</span>
						</div>
						<div>
							<span> {{ props.currentRow.shippingTime || '---' }} </span>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" class="flex items-center">
						<div>
							<span class="mr-1 fontColor">发货仓:</span>
						</div>
						<div>
							<span>
								<!-- 服务商 -->
								{{
									props.currentRow.spName ? `[${props.currentRow.spName}]` : ''
								}}
								<!-- 仓库 -->
								{{ props.currentRow.designatedWarehouse || '---' }}
							</span>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" class="flex items-center">
						<div class="w-20 fontColor">物流渠道:</div>
						<div class="flex items-baseline w-full">
							<MrTextEllipsis
								:text="props.currentRow.logisticsName || '---'"
								:max-length="20"
							/>
							<!-- logisticsStatus 物流状态 0:未选择物流 1:三方仓物流 2:转FBA成功  3:转FBA失败  4:发平台物流成功  5:发平台物流失败 -->
							<div
								v-show="
									props.currentRow.logisticsStatus === 2 ||
									props.currentRow.logisticsStatus === 3
								"
							>
								<LogisticsInfo />
							</div>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" class="flex">
						<div>
							<span class="mr-1 fontColor">比价结果:</span>
						</div>
						<div>
							<el-link
								underline="never"
								@click="showCharges"
								type="primary"
								size="small"
							>
								{{
									props.currentRow.totalFee ? props.currentRow.totalFee : '查看'
								}}
							</el-link>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" class="flex items-center">
						<div class="fontColor mr-1">运单号:</div>
						<MrTextEllipsis
							:text="props.currentRow.waybillNo || '---'"
							:max-length="15"
						/>
						<el-link
							v-if="props.currentRow.waybillNo"
							class="ml-1"
							:icon="DocumentCopy"
							@click="copyText(props.currentRow?.waybillNo)"
							underline="never"
						></el-link>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" class="flex items-center">
						<div class="fontColor mr-1">跟踪号:</div>
						<MrTextEllipsis
							:text="props.currentRow.logisticsTrackingNo || '---'"
							:max-length="15"
						/>
						<el-link
							v-if="props.currentRow.logisticsTrackingNo"
							class="ml-1"
							:icon="DocumentCopy"
							@click="copyText(props.currentRow?.logisticsTrackingNo)"
							underline="never"
						></el-link>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" class="flex items-center">
						<div class="fontColor mr-1">仓库单号:</div>
						<MrTextEllipsis
							:text="props.currentRow.warehouseOrderNo || '---'"
							:max-length="15"
						/>
						<el-link
							v-if="props.currentRow.warehouseOrderNo"
							class="ml-1"
							:icon="DocumentCopy"
							@click="copyText(props.currentRow?.warehouseOrderNo)"
							underline="never"
						></el-link>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" class="flex items-center">
						<div>
							<span class="mr-1 fontColor">标发状态:</span>
						</div>
						<div>
							<span> {{ props.currentRow.markStatusText || '---' }} </span>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" class="flex">
						<el-popover placement="top" trigger="click" width="400">
							<template #default>
								<el-row>
									<el-col :span="24" class="flex">
										<span> 姓名: </span>
										<span class="mr-1 fontColor">{{
											props.currentRow?.buyerInfoVO?.recipientName || '---'
										}}</span>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="24" class="flex">
										<span> 邮箱: </span>
										<span class="mr-1 fontColor">{{
											props.currentRow?.buyerInfoVO?.recipientEmail || '---'
										}}</span>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="24" class="flex">
										<span> 电话: </span>
										<span class="mr-1 fontColor">{{
											props.currentRow?.buyerInfoVO?.recipientPhone || '---'
										}}</span>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="24" class="flex">
										<span> 手机号: </span>
										<span class="mr-1 fontColor">{{
											props.currentRow?.buyerInfoVO?.recipientMobile || '---'
										}}</span>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="24" class="flex">
										<span> 税号: </span>
										<span class="mr-1 fontColor">{{
											props.currentRow?.buyerInfoVO?.recipientTaxNo || '---'
										}}</span>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="24" class="flex">
										<span class="flex-shrink-0"> 国家/地区: </span>
										<span class="mr-1 break-all whitespace-normal">{{
											props.currentRow?.buyerInfoVO?.recipientCountry || '---'
										}}</span>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="24" class="flex">
										<span> 省/州: </span>
										<span class="mr-1 fontColor">{{
											props.currentRow?.buyerInfoVO?.recipientState || '---'
										}}</span>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="24" class="flex">
										<span> 邮编: </span>
										<span class="mr-1 fontColor">{{
											props.currentRow?.buyerInfoVO?.recipientPostcode || '---'
										}}</span>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="24" class="flex">
										<span> 城市: </span>
										<span class="mr-1 fontColor">{{
											props.currentRow?.buyerInfoVO?.recipientCity || '---'
										}}</span>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="24" class="flex">
										<span> 区县: </span>
										<span class="mr-1 fontColor">{{
											props.currentRow?.buyerInfoVO?.recipientDistrict || '---'
										}}</span>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="24" class="flex">
										<span> 街道: </span>
										<span class="mr-1 fontColor">{{
											props.currentRow?.buyerInfoVO?.recipientStreet || '---'
										}}</span>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="24" class="flex">
										<span> 门牌号: </span>
										<span class="mr-1 fontColor">{{
											props.currentRow?.buyerInfoVO?.recipientHouseNo || '---'
										}}</span>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="24" class="flex">
										<span> 详细地址: </span>
										<span class="mr-1 fontColor">{{
											props.currentRow?.buyerInfoVO?.recipientDetailAddress ||
											'---'
										}}</span>
									</el-col>
								</el-row>
							</template>
							<template #reference>
								<el-link
									class="mr-2"
									underline="never"
									@click="$emit('viewDetail')"
									type="primary"
									>{{ $t('查看地址') }}</el-link
								>
							</template>
						</el-popover>
						<el-popover placement="top" trigger="click" width="400">
							<template #default>
								<el-row>
									<el-button class="ml10" @click="handleAllDownload">
										{{ $t('全部下载') }}</el-button
									>
								</el-row>
								<el-row>
									<el-table
										:data="[
											{
												id: 1,
												type: '面单',
												value: 'shippingLabel',
											},
											{
												id: 2,
												type: 'BOL提单',
												value: 'bolFile',
											},
											{
												id: 3,
												type: 'PackingList',
												value: 'packingListFile',
											},
											{
												id: 4,
												type: 'FBA Label',
												value: 'fbaLabel',
											},
											{
												id: 5,
												type: '其他文件',
												value: 'otherFile',
											},
										]"
										style="width: 100%"
										row-key="id"
										native-scrollbar
									>
										<el-table-column
											prop="type"
											:label="$t('附件类型')"
											width="100"
										/>
										<el-table-column prop="action" :label="$t('附件')">
											<template #default="{ row }">
												<upload-file
													:limit="1"
													:fileSize="20"
													v-model="orderExtensionVO[row.value]"
													@change="() => {}"
													:fileType="[
														'zip',
														'pdf',
														'xlsx',
														'xls',
														'doc',
														'docx',
														'jpg',
														'png',
													]"
													:isShowTip="false"
													:uploadFileUrl="'/admin/sys-file/upload'"
													type="simple"
													:data="{}"
													:dir="''"
													:autoUpload="true"
													:disabled="false"
													@error="() => {}"
													@remove="
														(res: any) => {
															deleteFile(res, row);
														}
													"
													@preview="() => {}"
													@exceed="() => {}"
													@success="
														(res: any, ) => {
															successUpload(res,row);
														}
													"
												/>
											</template>
										</el-table-column>
									</el-table>
								</el-row>
							</template>
							<template #reference>
								<el-link
									underline="never"
									@click="$emit('viewLog')"
									type="primary"
									>{{ $t('查看附件') }}
									{{ showLength(orderExtensionVO) }}
								</el-link>
							</template>
						</el-popover>
					</el-col>
				</el-row>
			</el-col>
		</el-row>
		<Charges ref="chargesRef" :currentRow="props.currentRow" />
	</div>
</template>

<style scoped lang="scss">
.component {
	width: 100%;
	height: 100%;
	gap: 8px;
	font-size: 12px;
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
	.font-weight {
		font-weight: 900;
	}
	.fontColor {
		color: #939da8;
	}
}
</style>
