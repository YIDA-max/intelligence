<template>
	<confirm-dialog
		ref="dialogRef"
		:title="props.title"
		:message="props.message"
		:show-icon="props.showIcon"
		:icon-type="props.iconType"
		:cancel-button-text="props.cancelButtonText"
		:confirm-button-text="props.confirmButtonText"
		:confirm-button-type="props.confirmButtonType"
		:show-cancel-button="false"
		:show-confirm-button="false"
		:width="props.width"
		@cancel="handleCancel"
		@confirm="handleConfirm"
		@closed="handleClosed"
		@opened="handleOpened"
	>
		<div
			:style="{
				height: '70vh',
			}"
		>
			<el-row class="mb18">
				<el-col :span="24">
					<div class="section-title">
						<span class="section-bar"></span>调拨确认
					</div>
					<el-form
						ref="formRef"
						:inline="false"
						label-position="right"
						:model="formData"
						label-width="140px"
						style="width: 100%"
						:rules="rules"
					>
						<el-row class="mb18">
							<el-col :span="12">
								<el-form-item label="调出仓">
									<span>{{ formData.warehouseName || '--' }}</span>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="调入仓" prop="takeInWarehouse">
									<el-cascader
										v-model="formData.takeInWarehouse"
										placeholder="请选择"
										clearable
										:options="
											props.dictMap.warehouseListByType?.map((item: any) => {
												return {
													...item,
													warehouseName: item.warehouseTypeText,
													warehouseCode: item.warehouseType,
												};
											}) || []
										"
										@change="(value: any) => handleWarehouseChange(value)"
										filterable
										:props="{
											label: 'warehouseName',
											value: 'warehouseCode',
											children: 'warehouses',
											emitPath: false, // ✅ 只返回最后一个 id
											checkStrictly: false, // 默认即可，确保联动
											leafOnly: true, // ✅ 只允许选最后一级
										}"
										style="width: 100%"
									>
									</el-cascader>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row class="mb18">
							<el-col :span="12">
								<el-form-item
									label="货代方式"
									prop="freightForwarderListByCondition"
								>
									<SelectInputApi
										v-model="formData.freightForwarderListByCondition"
										placeholder="请选择"
										clearable
										filterable
										:settings="{
                      text: '请选择',
                      getTreeData: async () => ({
                        code: 0,
                        data: (props.dictMap.freightForwarderListByCondition || []).map((item: any) => ({
                          label: `${item.forwarderName}`,
                          value: item.forwarderCode,
                        })),
                      }),
                      getIdsCode: 'forwarderCode',
                      width: '100%',
                    }"
									/>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="运输方式" prop="transportMethod">
									<SelectInputApi
										v-model="formData.transportMethod"
										placeholder="请选择"
										clearable
										filterable
										:settings="{
                      text: '请选择',
                      getTreeData: async () => ({
                        code: 0,
                        data: (props.dictMap.transportMethod || []).map((item: any) => ({
                          label: item.label,
                          value: item.value,
                        })),
                      }),
                      getIdsCode: 'value',
                      width: '100%',
                    }"
									/>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row class="mb18">
							<el-col :span="12">
								<el-form-item label="预计发货日期" prop="planShipmentDate">
									<el-date-picker
										v-model="formData.planShipmentDate"
										type="date"
										placeholder="请选择日期"
										format="YYYY-MM-DD"
										value-format="YYYY-MM-DD"
										style="width: 100%"
										clearable
									/>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row class="mb18">
							<el-col :span="12">
								<el-form-item label="调拨备注" prop="remark">
									<el-input
										v-model="formData.remark"
										placeholder="请输入"
										style="width: 100%"
										type="textarea"
									/>
								</el-form-item>
							</el-col>
						</el-row>

						<el-row class="mb18">
							<el-col :span="24">
								<el-table
									:data="tableConfirmData"
									border
									ref="tableConfirmRef"
									height="300"
									style="width: 100%"
									native-scrollbar
								>
									<el-table-column
										prop="skuCode"
										label="SKU/产品名称"
										width="250"
									>
										<template #default="{ row }">
											<div
												style="
													display: flex;
													flex-direction: column;
													justify-content: center;
													align-items: flex-start;
													width: 100%;
												"
											>
												<div
													style="
														max-width: 100%;
														overflow: hidden;
														white-space: nowrap;
														text-overflow: ellipsis;
													"
												>
													{{ row.skuCode }}
												</div>
												<div
													style="
														max-width: 100%;
														overflow: hidden;
														white-space: nowrap;
														text-overflow: ellipsis;
													"
												>
													{{ row.skuName }}
												</div>
											</div>
										</template>
									</el-table-column>
									<el-table-column
										prop="platformChannelCode"
										:label="t('平台渠道')"
										show-overflow-tooltip
										width="180"
									>
										<template #default="{ row }">
											{{ row.platformChannelCode || '---' }}
										</template>
									</el-table-column>
									<el-table-column
										prop="mskuCode"
										:label="t('MSKU')"
										show-overflow-tooltip
										width="180"
									>
										<template #default="{ row }">
											{{ row.mskuCode || '---' }}
										</template>
									</el-table-column>
									<el-table-column
										prop="skuCartonCode"
										:label="t('箱规编码')"
										show-overflow-tooltip
										width="280"
									>
										<template #default="{ row }">
											<div
												v-if="
													row.stockCartonVOList &&
													row.stockCartonVOList.length &&
													row.stockCartonVOList.length >= 0
												"
											></div>
											<el-row
												v-for="(item, index) in row.stockCartonList"
												:key="index"
												class="mb8"
												:gutter="8"
												style="width: 100%"
											>
												<el-col :span="20">
													<SelectInputApi
														v-model="item.skuCartonCodes"
														placeholder="请选择"
														clearable
														filterable
														:settings="{
                              text: '请选择',
                              getTreeData: async () => ({
                                code: 0,
                                data: ( row.stockCartonVOList || []).map((item: any) => ({
                                  label: item.skuCartonCode,
                                  value: item.skuCartonCode,
                                })),
                              }),
                              getIdsCode: 'skuCartonCode',
                              width: '100%',
                            }"
														@change="(val: any) => syncCartonInfo(row, item, val)"
													/>
												</el-col>
												<el-col :span="4">
													<div
														style="
															display: flex;
															justify-content: center;
															align-items: center;
															gap: 4px;
															height: 100%;
														"
													>
														<el-button
															type="primary"
															size="small"
															:icon="Plus"
															v-if="index === 0"
															@click="addStockCartonList(row)"
														/>
														<el-button
															type="primary"
															size="small"
															:icon="Minus"
															v-else
															@click="removeStockCartonList(row, index)"
														/>
													</div>
												</el-col>
											</el-row>
										</template>
									</el-table-column>
									<!-- 就是提货数量 -->
									<el-table-column label="可用数量" width="100">
										<template #default="{ row }">
											<el-row
												v-for="(item, index) in row.stockCartonList"
												:key="index"
												class="mb8"
												:gutter="8"
												style="width: 100%"
											>
												{{
													item.skuCartonCodes
														? row.stockCartonVOList.find(
																(carton: any) =>
																	carton.skuCartonCode === item.skuCartonCodes
														  )?.availableQuantity || 0
														: '0'
												}}
											</el-row>
										</template>
									</el-table-column>
									<el-table-column label="本次调拨箱数" width="150">
										<template #default="{ row }">
											<el-row
												v-for="(item, index) in row.stockCartonList"
												:key="index"
												class="mb8"
												:gutter="8"
												style="width: 100%"
											>
												<el-input
													type="number"
													v-model.number="item.takeCarton"
													placeholder="请输入"
													style="width: 100%"
													:max="row.stockCartonVOList?.find((carton: any) => carton?.skuCartonCode === item?.skuCartonCodes)?.availableQuantity || 0"
													:min="0"
													:step="1"
													@change="
													(value: number) => {
														// 限制输入范围,不能超过可用箱数
														if (Number(value) > Number(item.skuCartonCodes
														? row.stockCartonVOList.find((carton: any) => carton.skuCartonCode === item.skuCartonCodes)?.availableQty
														: '0')) {
															item.takeCarton = item.skuCartonCodes
														? row.stockCartonVOList.find((carton: any) => carton.skuCartonCode === item.skuCartonCodes)?.availableQty
																: '0';
															useMessage().warning('调拨箱数不能大于可用箱数');
														} else if (value < 0) {
															item.takeCarton = 0;
															useMessage().warning('调拨箱数不能小于0');
														}  else if (value % 1 !== 0) {
															useMessage().warning('调拨箱数只能是正整数');
															item.takeCarton = Math.floor(value);
														} 
														changeTakeNum(row,item);
													}
												"
												/>
											</el-row>
										</template>
									</el-table-column>
									<el-table-column
										prop="takeNum"
										label="本次调拨数量"
										width="150"
									>
										<template #default="{ row }">
											<el-row
												v-for="(item, index) in row.stockCartonList"
												:key="index"
												class="mb8"
												:gutter="8"
												style="width: 100%"
											>
												{{ item.takeNum ? item.takeNum : '0' }}
											</el-row>
										</template>
									</el-table-column>
									<el-table-column label="可用箱数" width="100">
										<template #default="{ row }">
											<el-row
												v-for="(item, index) in row.stockCartonList"
												:key="index"
												class="mb8"
												:gutter="8"
												style="width: 100%"
											>
												{{
													item.skuCartonCodes
														? row.stockCartonVOList.find(
																(carton: any) =>
																	carton.skuCartonCode === item.skuCartonCodes
														  )?.availableQty
														: '0'
												}}
											</el-row>
										</template>
									</el-table-column>
									<el-table-column label="单箱数量" width="100">
										<template #default="{ row }">
											<el-row
												v-for="(item, index) in row.stockCartonList"
												:key="index"
												class="mb8"
												:gutter="8"
												style="width: 100%"
											>
												{{
													item.skuCartonCodes
														? row.stockCartonVOList.find(
																(carton: any) =>
																	carton.skuCartonCode === item.skuCartonCodes
														  )?.singleCartonQuantity || 0
														: '0'
												}}
											</el-row>
										</template>
									</el-table-column>
									<el-table-column
										prop="outCartonLength"
										:label="t('外箱长宽高(CM)')"
										show-overflow-tooltip
										width="200"
									>
										<template #default="{ row }">
											<el-row
												v-for="(item, index) in row.stockCartonList"
												:key="index"
												class="mb8"
												:gutter="8"
												style="width: 100%"
											>
												<div style="margin-top: 4px; color: #999">
													{{
														item.skuCartonCodes
															? (row.stockCartonVOList.find(
																	(carton: any) =>
																		carton.skuCartonCode === item.skuCartonCodes
															  )?.outCartonLength || 0) +
															  '*' +
															  (row.stockCartonVOList.find(
																	(carton: any) =>
																		carton.skuCartonCode === item.skuCartonCodes
															  )?.outCartonWidth || 0) +
															  '*' +
															  (row.stockCartonVOList.find(
																	(carton: any) =>
																		carton.skuCartonCode === item.skuCartonCodes
															  )?.outCartonHeight || 0)
															: '0*0*0'
													}}
												</div>
											</el-row>
										</template>
									</el-table-column>

									<el-table-column
										prop="outCartonGrossWeight"
										:label="t('外箱毛重(KG)')"
										show-overflow-tooltip
										width="180"
									>
										<template #default="{ row }">
											<el-row
												v-for="(item, index) in row.stockCartonList"
												:key="index"
												class="mb8"
												:gutter="8"
												style="width: 100%"
											>
												<div style="margin-top: 4px; color: #999">
													{{
														item.skuCartonCodes
															? row.stockCartonVOList.find(
																	(carton: any) =>
																		carton.skuCartonCode === item.skuCartonCodes
															  )?.outCartonGrossWeight || 0
															: '0'
													}}
												</div>
											</el-row>
										</template>
									</el-table-column>
									<el-table-column
										prop="outCartonGrossWeight"
										:label="t('增值服务')"
										show-overflow-tooltip
										width="220"
									>
										<template #header>
											<span
												:style="{
													color: '#f78c8c',
													marginRight: '3px',
												}"
												>*
											</span>
											{{ $t('增值服务') }}
										</template>
										<template #default="{ row }">
											<SelectInputApi
												v-model="row.addedService"
												placeholder="增值服务"
												multiple
												:settings="{
													text: '增值服务',
													getTreeData: () => ({
														code: 0,
														data: (currentInType === 'enter_platform_warehouse'
															? [
																	{
																		value: 'shipping_mark_label',
																		label: '贴箱唛',
																	},
																	{ value: 'barcode_label', label: '贴条码' },
																	{
																		value: 'transparency_label',
																		label: '贴透明码',
																	},
															  ]
															: [
																	{ value: 'direct_label', label: '直接发货' },
																	{
																		value: 'shipping_mark_label',
																		label: '贴箱唛',
																	},
																	{ value: 'barcode_label', label: '贴条码' },
																	{
																		value: 'transparency_label',
																		label: '贴透明码',
																	},
															  ]
														).map((item) => ({
															label: item.label,
															value: item.value,
															disabled: isDisabled(
																item.value,
																row.addedService
															), // ✅ 关键点
														})),
													}),
													getIdsCode: 'value',
													width: '100%',
												}"
											/>
										</template>
									</el-table-column>
									<el-table-column
										prop="storeId"
										:label="t('平台店铺')"
										show-overflow-tooltip
										width="220"
										v-if="currentInType === 'enter_platform_warehouse'"
									>
										<template #header>
											<span
												:style="{
													color: '#f78c8c',
													marginRight: '3px',
												}"
												>*
											</span>
											{{ $t('平台店铺') }}
										</template>
										<template #default="{ row }">
											<SelectInputApi
												v-model="row.storeId"
												placeholder="平台渠道"
												@focus="() => matchStoreInfo(row)"
												:settings="{
                          text: '平台渠道',
                          getTreeData: async () => ({
                            code: 0,
                            data: ( row.listByCondition || []).map((item: any) => ({
                              label: `[${item.platformChannelCode}]${item.storeName}:${item.siteCode}`,
                              value: item.id,
                            })),
                          }),
                          getIdsCode: 'id',
                          width: '220px',
                        }"
											/>
										</template>
									</el-table-column>
									<el-table-column
										prop=""
										:label="t('平台入库单')"
										show-overflow-tooltip
										width="180"
										v-if="currentInType === 'enter_platform_warehouse'"
									>
										<template #header>
											<span
												:style="{
													color: '#f78c8c',
													marginRight: '3px',
												}"
												>*
											</span>
											{{ $t('平台入库单') }}
										</template>
										<template #default="{ row }">
											<el-input
												v-model="row.shipmentId"
												placeholder="请输入"
												style="width: 100%"
											/>
										</template>
									</el-table-column>
									<el-table-column
										prop=""
										:label="t('条码')"
										show-overflow-tooltip
										width="180"
										v-if="currentInType === 'enter_platform_warehouse'"
									>
										<template #header>
											<span
												:style="{
													color: '#f78c8c',
													marginRight: '3px',
												}"
												>*
											</span>
											{{ $t('条码') }} </template
										><template #default="{ row }">
											<el-input
												v-model="row.barcode"
												placeholder="请输入"
												style="width: 100%"
											/>
										</template>
									</el-table-column>
									<el-table-column
										prop=""
										:label="t('送仓码/关联单号')"
										show-overflow-tooltip
										width="180"
										v-if="currentInType === 'enter_platform_warehouse'"
										><template #header>
											<span
												:style="{
													color: '#f78c8c',
													marginRight: '3px',
												}"
												>*
											</span>
											{{ $t('送仓码/关联单号') }}
										</template>
										<template #default="{ row }">
											<el-input
												v-model="row.referenceId"
												placeholder="请输入"
												style="width: 100%"
											/>
										</template>
									</el-table-column>
									<el-table-column
										prop=""
										:label="t('附件')"
										show-overflow-tooltip
										width="180"
									>
										<template #default="{ row, $index }">
											<div
												v-if="
													row.shippingMarkAttachments ||
													row.barcodeAttachments ||
													row.transparencyAttachments ||
													row.otherAttachments
												"
											>
												<div v-if="row.shippingMarkAttachments?.length">
													{{
														row.shippingMarkAttachments?.length
															? '箱唛:' + row.shippingMarkAttachments + ' '
															: ''
													}}
												</div>
												<div v-if="row.barcodeAttachments?.length">
													{{
														row.barcodeAttachments?.length
															? '条码:' + row.barcodeAttachments + ' '
															: ''
													}}
												</div>
												<div v-if="row.transparencyAttachments?.length">
													{{
														row.transparencyAttachments?.length
															? '透明码:' + row.transparencyAttachments + ' '
															: ''
													}}
												</div>
												<div v-if="row.otherAttachments?.length">
													{{
														row.otherAttachments?.length
															? '其他:' + row.otherAttachments + ' '
															: ''
													}}
												</div>
											</div>
											<el-button
												text
												type="primary"
												@click="
													() => {
														showUpFile($index);
													}
												"
											>
												<!-- 发货类型为【入平台仓】且状态为【待拼柜】的发货计划可以展示及操作 -->
												{{ $t('上传标签') }}</el-button
											>
										</template>
									</el-table-column>
									<el-table-column
										prop="deptName"
										:label="t('部门&小组')"
										show-overflow-tooltip
										width="180"
									>
										<template #default="{ row }">
											{{ row.deptName || '---' }}
										</template>
									</el-table-column>
									<el-table-column
										prop="operationUserName"
										:label="t('运营人')"
										show-overflow-tooltip
										width="180"
									/>
									<el-table-column
										label="备注"
										min-width="200"
										show-overflow-tooltip
									>
										<template #default="{ row }">
											{{ row.remark || '-' }}
										</template>
									</el-table-column>
								</el-table>
							</el-col>
						</el-row>
					</el-form>
				</el-col>
			</el-row>
			<el-row class="text-center mb18">
				<el-col :span="24">
					<el-button @click="handleCancel">取消</el-button>
					<el-button type="primary" @click="handleConfirm">确认申请</el-button>
				</el-col>
			</el-row>
			<!-- 附件上传 -->
			<UpFile
				ref="upFileRef"
				:show-icon="true"
				:icon-type="'info'"
				:currentInType="currentInType"
				:currentRow="currentRow"
				:cancel-button-text="$t('取消')"
				:confirm-button-text="$t('确认')"
				:confirm-button-type="'primary'"
				:width="'800px'"
				@confirm="
					(e:any) => {
						confirmUpFile(e);
					}
				"
				@cancel="
					() => {
						upFileRef.hide();
					}
				"
			/>
		</div>
	</confirm-dialog>
</template>

<script setup lang="ts">
import { Plus, Minus } from '@element-plus/icons-vue';
import { ref, reactive, nextTick } from 'vue';
import ConfirmDialog, { IconType } from '/@/components/ConfirmDialog/index.vue';
import { getListByCondition } from '/@/api/mcp/collectionPlan';
import { useI18n } from 'vue-i18n';
import { useMessage } from '/@/hooks/message';
import { ElForm } from 'element-plus';
const UpFile = defineAsyncComponent(() => import('./components/upFile.vue'));
const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);
const { t } = useI18n();
const props = defineProps({
	// 基础配置
	title: {
		type: String,
		default: '二程调拨申请',
	},
	message: {
		type: String,
		default: '',
	},
	width: {
		type: String,
		default: '80%',
	},
	// 图标配置
	showIcon: {
		type: Boolean,
		default: true,
	},
	iconType: {
		type: String as () => IconType,
		default: 'info',
	},
	// 按钮配置
	cancelButtonText: {
		type: String,
		default: '取消',
	},
	confirmButtonText: {
		type: String,
		default: '确认',
	},
	confirmButtonType: {
		type: String,
		default: 'primary',
	},
	// 输入框配置
	inputLabel: {
		type: String,
		default: '',
	},
	inputPlaceholder: {
		type: String,
		default: '请输入',
	},
	inputType: {
		type: String,
		default: 'text', // text, textarea
	},
	inputRows: {
		type: Number,
		default: 4,
	},
	// 初始值
	modelValue: {
		type: [String, Number],
		default: '',
	},
	// 选中行的数据
	selectedRows: {
		type: Array<any>,
		default: () => [],
	},
	// 字典数据
	dictMap: {
		type: Object,
		default: () => ({}),
	},
});

const emit = defineEmits(['cancel', 'confirm', 'closed', 'update:modelValue']);

// 表单数据
const formData = reactive<Record<string, any>>({});
// 表单ref
const formRef = ref<InstanceType<typeof ElForm> | null>(null);
// 表单校验规则
const rules = ref({
	takeInWarehouse: [
		{ required: true, message: '请选择调入仓', trigger: 'change' },
	],
	transportMethod: [
		{ required: true, message: '请选择运输方式', trigger: 'change' },
	],
	planShipmentDate: [
		{ required: true, message: '请选择预计发货日期', trigger: 'change' },
	],
	freightForwarderListByCondition: [
		{ required: true, message: '请选择货代方式', trigger: 'change' },
	],
});
const dialogRef = ref<InstanceType<typeof ConfirmDialog> | null>(null);
// 当前的是入平台仓还是入一件代发仓
const currentInType = ref<'dropshipping' | 'enter_platform_warehouse'>(
	'enter_platform_warehouse'
);
// 下一步的table的ref
const tableConfirmRef = ref<any>(null);
// 下一步的table的data
const tableConfirmData = ref<any[]>([]);
// 上传组件的引用
const upFileRef = ref();
// 当前选择上传附件的行的下标
const currentRowIndex = ref<number | null>(null);
// 当前选择上传附件的行的数据
const currentRow = ref<any>({});
// 调拨确认的详细
// 初始化表单数据
const initFormData = () => {
	// 清空之前的数据
	Object.keys(formData).forEach((key) => {
		delete formData[key];
	});
};

/**
 * 根据根据渠道+国家+部门+小组，匹配后台配置店铺信息
 * */
const matchStoreInfo = async (row: any) => {
	try {
		const res = await getListByCondition({
			platformChannelCode: row?.platformChannelCode,
			siteCode: row?.countryCode,
			deptId: row?.deptId,
		});
		if (res.code === 0) {
			row.listByCondition = res.data || [];
		}
	} catch (error: any) {
		useMessage().error(error.msg || '加载失败，请稍后重试');
	}
};
/**
 * 弹窗打开时的处理函数
 * 确保数据被正确初始化
 */
const handleOpened = () => {
	// 弹窗完全打开后，确保数据初始化
	nextTick(() => {
		formattedData();
		// 初始化table数据
		tableConfirmData.value = props.selectedRows.map((item: any) => ({
			...item,
		}));
		// 因为仓库是一样的，所以调出仓就取第一条数据的仓库名称
		if (props.selectedRows.length > 0) {
			formData.warehouseName = props.selectedRows[0].warehouseName;
			formData.takeOutWarehouse = props.selectedRows[0].warehouseCode;
		}
		// 初始化table展示的数据
		tableConfirmData.value.forEach((item) => {
			// 设置table的箱规编码操作数据
			item.stockCartonList = [];
			// 格式化箱规编码数据
			item.stockCartonVOList?.forEach((carton: any) => {
				// 新增可用数量字段
				carton.availableQuantity = carton.qty || 0;
				// 长
				carton.outCartonLength = carton.outCartonSpecLength || 0;
				// 宽
				carton.outCartonWidth = carton.outCartonSpecWidth || 0;
				// 高
				carton.outCartonHeight = carton.outCartonSpecHeight || 0;
				// 毛重
				carton.outCartonGrossWeight = carton.cartonGrossWeight || 0;
				// 单箱数量
				carton.singleCartonQuantity = carton.singleCartonQuantity || 0;
			});
		});
		// 为每一行的箱规编码新增操作数组
		tableConfirmData.value.forEach((item) => {
			if (item.stockCartonVOList && item.stockCartonVOList.length) {
				item.stockCartonList = item.stockCartonVOList[0]
					? [{ ...item.stockCartonVOList[0] }] // 浅拷贝，避免污染 stockCartonVOList
					: [];
			} else {
				item.stockCartonList = [];
			}
		});
		// 如果箱规只有一条数据，就默认选中
		tableConfirmData.value.forEach((item) => {
			if (item.stockCartonVOList && item.stockCartonVOList.length === 1) {
				item.stockCartonList = item.stockCartonVOList[0]
					? [{ ...item.stockCartonVOList[0] }] // 浅拷贝
					: [];
				// 初始化调拨箱数
				item.stockCartonList[0].takeCarton = 0;
				// 初始化调拨数量
				item.stockCartonList[0].takeNum = 0;
				// 新增箱规编码
				item.stockCartonList[0].skuCartonCodes =
					item.stockCartonVOList[0].skuCartonCode;
			}
		});
	});
};

/**
 * 处理仓库选择变化
 * @param selectedCode 选中的仓库编码
 * @returns 返回父级对象和选中的仓库对象，或者 null 如果未找到
 */
const handleWarehouseChange = (selectedCode: string) => {
	if (!selectedCode) {
		// console.log('未选择仓库');
		return null;
	}
	// 清空table的所有的增值服务的数据
	tableConfirmData.value.forEach((item) => {
		item.addedService = [];
	});
	// 遍历顶层仓库类型数组，查找包含选中 warehouseCode 的父级 item
	const targetParentItem = props.dictMap.warehouseListByType.find(
		(parentItem: any) => {
			// 检查当前父级的 warehouses 数组中是否有匹配的仓库编码
			return parentItem.warehouses.some(
				(warehouse: any) => warehouse.warehouseCode === selectedCode
			);
		}
	);

	if (targetParentItem) {
		if (targetParentItem.warehouseType === '0') {
			// 自营仓，默认平台仓
			currentInType.value = 'enter_platform_warehouse';
		} else if (targetParentItem.warehouseType === '1') {
			// 一件代发仓,也就三方仓
			currentInType.value = 'dropshipping';
		} else if (targetParentItem.warehouseType === '2') {
			// 平台仓
			currentInType.value = 'enter_platform_warehouse';
		}
		// console.log('找到对应的父级仓库类型：', targetParentItem);
		// 可以进一步获取选中的仓库对象（可选）
		// const selectedWarehouse = targetParentItem.warehouses.find((w: any) => w.warehouseCode === selectedCode);
		// console.log('选中的仓库详情：', selectedWarehouse);
		return targetParentItem; // 或根据需求返回 selectedWarehouse
	} else {
		// console.log('未找到匹配的仓库类型');
		return null;
	}
};
/**
 * 判断选项是否需要禁用（互斥逻辑）
 * @param currentItemValue 当前选项的 value（如 '1'/'2'/'3'/'4'）
 * @param selectedValues 当前已选中的值数组（如 ['1'] 或 ['2','3']）
 * @returns {boolean} 是否禁用（true：禁用，false：可用）
 */
const isDisabled = (
	currentItemValue: string,
	selectedValues: string[]
): boolean => {
	// 情况1：已选中「直接发货」（selectedValues 包含 'direct_label'）
	if (
		selectedValues &&
		selectedValues.length &&
		selectedValues.includes('direct_label')
	) {
		// 当前选项不是「直接发货」→ 禁用；是「直接发货」→ 可用
		return currentItemValue !== 'direct_label';
	}

	// 情况2：未选中「直接发货」，但已选中其他选项（selectedValues 非空）
	if (selectedValues && selectedValues.length && selectedValues.length > 0) {
		// 当前选项是「直接发货」→ 禁用；不是「直接发货」→ 可用
		return currentItemValue === 'direct_label';
	}

	// 情况3：未选中任何选项 → 所有选项可用
	return false;
};
/**
 * 确定上传附件的回调
 * */
const confirmUpFile = async (e: any) => {
	// 先判断是否存在选择上传附件的行的下标
	// if (!currentRowIndex.value) {
	// 	useMessage().error('未知错误,请联系管理员');
	// }
	// 给对应下标的数据赋值
	if (typeof currentRowIndex.value === 'number') {
		tableConfirmData.value[currentRowIndex.value].shippingMarkAttachments =
			e.shippingMarkAttachments;
		tableConfirmData.value[currentRowIndex.value].barcodeAttachments =
			e.barcodeAttachments;
		tableConfirmData.value[currentRowIndex.value].transparencyAttachments =
			e.transparencyAttachments;
		tableConfirmData.value[currentRowIndex.value].otherAttachments =
			e.otherAttachments;
	}
	// 关闭弹窗
	upFileRef.value?.hide();
	currentRowIndex.value = null;
};
/**
 * 处理调拨数量变化
 * @param row 当前行数据
 */
const changeTakeNum = (row: any, item: any) => {
	const stockCartonVOList = row.stockCartonVOList || [];
	// 通过箱规编码找到对应的箱规对象
	const carton = stockCartonVOList.find(
		(carton: any) => carton.skuCartonCode === item.skuCartonCodes
	);
	if (!carton) {
		item.takeCarton = '-';
		return;
	}
	// 这里可以添加你需要的逻辑，比如更新其他相关字段
	// 例如，计算调拨箱数
	item.takeNum = item.takeCarton * (carton.singleCartonQuantity || 0);
};
/**
 * 处理箱规编码变化
 * @param row 当前行数据
 */
// const changeSkuCartonCodes = (row: any, e: any) => {
// 	// tableConfirmData.value.forEach((item) => {
// 	// 	if (item.id === row.id) {
// 	// 		item.stockCartonList.forEach((subItem: any) => {
// 	// 			if (subItem.skuCartonCodes === e && !subItem.singleCartonQuantity) {
// 	// 				// console.log(subItem, item.stockCartonVOList?.find((carton: any) => carton.skuCartonCode === subItem.skuCartonCodes)?.singleCartonQuantity);
// 	// 				// debugger;
// 	// 				// 设置单箱数量
// 	// 				item.singleCartonQuantity =
// 	// 					item.stockCartonVOList?.find((carton: any) => carton.skuCartonCode === subItem.skuCartonCodes)?.singleCartonQuantity || 0;
// 	// 				console.log(item.singleCartonQuantity);
// 	// 				debugger;
// 	// 			}
// 	// 		});
// 	// 	}
// 	// });
// };

/**
 * 选择箱规编码后，同步对应的箱规信息到 stockCartonList 条目
 * 确保 emit 传出的数据包含正确的单箱数量等字段
 */
const syncCartonInfo = (row: any, item: any, val: string) => {
	if (!val) return;
	const carton = (row.stockCartonVOList || []).find(
		(c: any) => c.skuCartonCode === val
	);
	if (carton) {
		item.singleCartonQuantity = carton.singleCartonQuantity || 0;
		item.outCartonLength =
			carton.outCartonSpecLength || carton.outCartonLength || 0;
		item.outCartonWidth =
			carton.outCartonSpecWidth || carton.outCartonWidth || 0;
		item.outCartonHeight =
			carton.outCartonSpecHeight || carton.outCartonHeight || 0;
		item.outCartonGrossWeight =
			carton.cartonGrossWeight || carton.outCartonGrossWeight || 0;
		item.availableQty = carton.availableQty || 0;
		item.availableQuantity = carton.qty || carton.availableQuantity || 0;
	}
	// 箱规变化后重置调拨箱数和数量
	item.takeCarton = 0;
	item.takeNum = 0;
};
/**
 * 清空格式化数据
 */
const formattedData = () => {
	// 清空下一步的数据
	tableConfirmData.value = [];
	// 重新初始化表单数据
	initFormData();
};
/**
 * 显示上传附件的弹窗
 * @param index 当前行的下标
 */
const showUpFile = (index: number) => {
	currentRow.value = tableConfirmData.value[index];
	currentRowIndex.value = index;
	upFileRef.value?.show();
};
/**
 * 增加箱规编码行
 */
const addStockCartonList = (row: any) => {
	// 添加的行不能超过箱规编码的总数
	if (row.stockCartonList.length >= row.stockCartonVOList.length) {
		useMessage().warning('箱规编码已全部添加完毕');
		return;
	}
	// 添加新的行（空对象，用户手动选择箱规编码）
	row.stockCartonList.push({ takeCarton: 0, takeNum: 0 });
};
/**
 * 删除箱规编码行
 */
const removeStockCartonList = (row: any, index: number) => {
	// 删除指定索引的行
	if (row.stockCartonList.length > 1) {
		row.stockCartonList.splice(index, 1);
	} else {
		useMessage().warning('至少保留一行箱规编码');
	}
};

/**
 * 取消操作处理函数
 */
const handleCancel = () => {
	emit('cancel', { ...formData });
};

/**
 * 确认操作处理函数
 */
const handleConfirm = async () => {
	const valid = await formRef.value?.validate();
	if (!valid) {
		useMessage().warning('请上传必须项');
		return;
	}
	// 调出仓和调入仓不能一致
	if (
		formData.takeOutWarehouse &&
		formData.takeInWarehouse &&
		formData.takeOutWarehouse === formData.takeInWarehouse
	) {
		useMessage().warning('调出仓和调入仓不能一样');
		return;
	}
	// // 如果一个本次调拨数量都没有填写，就提示用户
	const totalTakeNum = tableConfirmData.value.reduce((sum, item) => {
		const itemTotal = item.stockCartonList.reduce(
			(subSum: number, subItem: any) => subSum + (subItem.takeNum || 0),
			0
		);
		return sum + itemTotal;
	}, 0);
	if (totalTakeNum === 0) {
		useMessage().warning('请至少填写一条本次调拨数量');
		return;
	}
	// // 如果本次调拨数量大于可用数量，就提示用户
	const invalidItem = tableConfirmData.value.find((item) =>
		item.stockCartonList.some(
			(subItem: any) => subItem.takeNum > item.intoTotalQuantity
		)
	);
	if (invalidItem) {
		useMessage().warning(
			`发货单号 ${invalidItem.deliveryNo} 的本次调拨数量不能大于可用数量`
		);
		return;
	}
	// // 如果本次调拨数量小于等于0，就提示用户
	const invalidItem2 = tableConfirmData.value.find((item) =>
		item.stockCartonList.some(
			(subItem: any) => subItem.takeNum <= 0 || !subItem.takeNum
		)
	);
	if (invalidItem2) {
		useMessage().warning(
			`发货单号 ${invalidItem2.deliveryNo} 的本次调拨数量必须大于0`
		);
		return;
	}
	// // 如果是入平台仓，那么就要必填箱唛和条码
	// // 不再这样了，后面产品取消的
	// if (currentInType.value === 'enter_platform_warehouse') {
	// 	const invalidItem3 = tableConfirmData.value.find(
	// 		(item) => !item.shippingMarkAttachments || !item.barcodeAttachments
	// 	);
	// 	if (invalidItem3) {
	// 		useMessage().warning(
	// 			`当前选择的是入平台仓,发货单号 ${invalidItem3.deliveryNo} 的箱唛附件和条码附件为必填项`
	// 		);
	// 		return;
	// 	}
	// }
	// 按增值服务动态校验附件：
	// 1) 选择「直接发货」不校验附件
	// 2) 选择含「贴箱唛」必须上传箱唛附件
	// 3) 选择含「贴条码」必须上传条码附件
	// 4) 选择含「贴透明码」必须上传透明码附件
	const hasAttachment = (value: any) =>
		Array.isArray(value) ? value.length > 0 : !!value;
	let missingAttachmentType = '';
	const invalidItemByAddedService = tableConfirmData.value.find((item) => {
		const addedService = Array.isArray(item.addedService)
			? item.addedService
			: [];
		// 直接发货不校验附件
		if (addedService.includes('direct_label')) {
			return false;
		}
		if (
			addedService.includes('shipping_mark_label') &&
			!hasAttachment(item.shippingMarkAttachments)
		) {
			missingAttachmentType = '箱唛';
			return true;
		}
		if (
			addedService.includes('barcode_label') &&
			!hasAttachment(item.barcodeAttachments)
		) {
			missingAttachmentType = '条码';
			return true;
		}
		if (
			addedService.includes('transparency_label') &&
			!hasAttachment(item.transparencyAttachments)
		) {
			missingAttachmentType = '透明码';
			return true;
		}
		return false;
	});
	if (invalidItemByAddedService) {
		useMessage().warning(
			`发货单号 ${invalidItemByAddedService.deliveryNo} 选择了贴${missingAttachmentType}，请先上传对应附件`
		);
		return;
	}
	// 增值服务必填
	const invalidItem4 = tableConfirmData.value.find(
		(item) => !item.addedService || item.addedService.length === 0
	);
	if (invalidItem4) {
		useMessage().warning(`sku ${invalidItem4.skuCode} 的增值服务为必填项`);
		return;
	}
	// 店铺必填
	if (currentInType.value === 'enter_platform_warehouse') {
		const invalidItem5 = tableConfirmData.value.find((item) => !item.storeId);
		if (invalidItem5) {
			useMessage().warning(`sku ${invalidItem5.skuCode} 的平台店铺为必填项`);
			return;
		}
	}
	// 平台入库单必填
	if (currentInType.value === 'enter_platform_warehouse') {
		const invalidItem6 = tableConfirmData.value.find(
			(item) => !item.shipmentId
		);
		if (invalidItem6) {
			useMessage().warning(`sku ${invalidItem6.skuCode} 的平台入库单为必填项`);
			return;
		}
	}
	// 条码必填
	if (currentInType.value === 'enter_platform_warehouse') {
		const invalidItem7 = tableConfirmData.value.find((item) => !item.barcode);
		if (invalidItem7) {
			useMessage().warning(`sku ${invalidItem7.skuCode} 的条码为必填项`);
			return;
		}
	}
	// 送仓码/关联单号必填
	if (currentInType.value === 'enter_platform_warehouse') {
		const invalidItem8 = tableConfirmData.value.find(
			(item) => !item.referenceId
		);
		if (invalidItem8) {
			useMessage().warning(
				`sku ${invalidItem8.skuCode} 的送仓码/关联单号为必填项`
			);
			return;
		}
	}
	// 校验通过，执行确认逻辑
	emit('confirm', {
		...formData,
		tableConfirmData: JSON.parse(JSON.stringify(tableConfirmData.value)),
		shippingMethod: currentInType.value,
	});
};

/**
 * 弹窗关闭后的回调
 */
const handleClosed = () => {
	emit('closed');
};

/**
 * 打开弹窗方法
 * 供父组件调用
 */
const show = () => {
	if (dialogRef.value) {
		dialogRef.value.show();
	}
};

/**
 * 关闭弹窗方法
 * 供父组件调用
 */
const hide = () => {
	if (dialogRef.value) {
		dialogRef.value.hide();
	}
};

// 暴露方法给父组件
defineExpose({
	show,
	hide,
	initFormData,
});
</script>
<style lang="scss" scoped>
.dialog-container {
	padding: 0 20px;
	height: 60vh;
	overflow: auto;
}
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
</style>
