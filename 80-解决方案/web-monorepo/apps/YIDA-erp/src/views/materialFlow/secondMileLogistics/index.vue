<!--
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2025-10-22 11:40:09
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-05-26 15:55:19
 * @FilePath: \qianyi-ui\src\views\materialFlow\secondMileLogistics\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form
					:inline="true"
					:model="state.queryForm"
					@keyup.enter="getDataList"
					ref="queryRef"
				>
					<!-- <AdvancedSearchStyle ref="AdvancedSearchStyleRef">
						<template #default> -->
					<el-form-item>
						<div class="flex item-center">
							<SelectInput
								v-model:queryForm="state.queryForm"
								:searchTypes="[
									{
										label: '调拨单号',
										value: 'secondMileNos',
									},
									{
										label: '头程调拨单',
										value: 'firstMileNos',
									},
									{
										label: 'SKU',
										value: 'skuCodes',
									},
									{
										label: '平台入库单',
										value: 'shipmentIds',
									},
									{
										label: '三方仓入库单单号',
										value: 'intoNoList',
									},
								]"
								:getDataList="getDataList"
							/>
						</div>
					</el-form-item>

					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="dicts"
							multiple
							:settings="{
								text: '状态',
								getTreeDataParams: 'second_mile_status',
								code: 'statusList',
								searchFn: getDataList,
								width: '200px',
							}"
						/>
					</el-form-item>
					<el-form-item>
						<!-- 调出仓 -->
						<el-cascader
							v-model="state.queryForm.takeOutWarehouses"
							placeholder="调出仓"
							filterable
							collapse-tags
							:max-collapse-tags="1"
							clearable
							:options="
											dictMap.warehouseListByType?.map((item: any) => {
												return {
													...item,
													warehouseName: item.warehouseTypeText,
													warehouseCode: item.warehouseType,
												};
											}) || []
										"
							:props="{
								label: 'warehouseName',
								value: 'warehouseCode',
								multiple: true,
								children: 'warehouses',
								emitPath: false, // ✅ 只返回最后一个 id
								checkStrictly: false, // 默认即可，确保联动
								leafOnly: true, // ✅ 只允许选最后一级
							}"
							style="width: 300px"
						>
						</el-cascader>
					</el-form-item>
					<el-form-item>
						<!-- 自营仓+三方仓+平台仓 -->
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="warehouseQianyi"
							multiple
							:settings="{
								text: '调入仓',
								getTreeDataParams: { warehouseTypes: [0, 1, 2] },
								code: 'takeInWarehouses',
								searchFn: getDataList,
								width: '220px',
							}"
						/>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="country"
							multiple
							:settings="{
								text: '调入仓国家',
								code: 'takeInWarehouseCountries',
								searchFn: getDataList,
								width: '200px',
							}"
						/>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="dicts"
							multiple
							:settings="{
								text: '运输方式',
								getTreeDataParams: 'transport_method',
								code: 'transportMethods',
								searchFn: getDataList,
								width: '200px',
							}"
						/>
					</el-form-item>
					<el-form-item>
						<div>
							<SelectDate
								v-model:queryForm="state.queryForm"
								:settings="{
									selectStyle: {
										width: '130px',
									},
									dateStyle: {
										width: '130px',
									},
								}"
								:searchTypes="[
									{
										label: '预计发货时间',
										value: 'planShipmentDate',
										isAddHMS: false,
										dateStart: 'planShipmentDateStart',
										dateEnd: 'planShipmentDateEnd',
									},
									{
										label: '实际发货时间',
										value: 'actualDeliveryTime',
										isAddHMS: false,
										dateStart: 'actualDeliveryTimeStart',
										dateEnd: 'actualDeliveryTimeEnd',
									},
								]"
								:getDataList="getDataList"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="userList"
							multiple
							:settings="{
								text: '创建人',
								getTreeDataParams: { lockFlag: 0 },
								code: 'createIds',
								searchFn: getDataList,
								width: '220px',
							}"
						/>
					</el-form-item>
					<el-form-item>
						<div>
							<SelectDate
								v-model:queryForm="state.queryForm"
								:settings="{
									selectStyle: {
										width: '130px',
									},
									dateStyle: {
										width: '130px',
									},
								}"
								:searchTypes="[
									{
										label: '创建时间',
										value: 'createdTime',
										isAddHMS: false,
										dateStart: 'createTimeStart',
										dateEnd: 'createTimeEnd',
									},
								]"
								:getDataList="getDataList"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<div class="flex item-center">
							<SelectInput
								v-model:queryForm="state.queryForm"
								:searchTypes="[
									{
										label: '备注',
										value: 'remarks',
									},
								]"
								:getDataList="getDataList"
							/>
						</div>
					</el-form-item>
					<!-- </template> -->
					<!-- <template #second> </template> -->
					<!-- <template #right> -->
					<el-form-item>
						<div class="flex item-center">
							<el-button @click="getDataList" type="primary"
								>{{ $t('搜索') }}
							</el-button>
							<el-button @click="resetQuery" type="info" plain
								>{{ $t('common.resetBtn') }}
							</el-button>
							<!-- <el-button
								type="info"
								plain
								@click="
									() => {
										AdvancedSearchStyleRef.changeSecondToggle();
									}
								"
								>{{
									$t(`${AdvancedSearchStyleRef?.showSecond ? '收起' : '展开'}`)
								}}
							</el-button> -->
						</div>
					</el-form-item>
					<!-- </template>
					</AdvancedSearchStyle> -->
				</el-form>
			</el-row>
			<el-row>
				<ToolBar @handleRefresh="getDataList" :is-show-export="false">
					<template #left-tool>
						<el-dropdown>
							<el-button
								class="ml10"
								v-if="
									auths(['secondMile_exportList', 'secondMile_exportDetail'])
								"
							>
								{{ $t('导出') }}
								<el-icon class="el-icon--right"><arrow-down /> </el-icon>
							</el-button>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item
										@click="handleExport('list')"
										v-if="auth('secondMile_exportList')"
									>
										{{ $t('导出列表数据') }}
									</el-dropdown-item>
									<el-dropdown-item
										@click="handleExport('detail')"
										v-if="auth('secondMile_exportDetail')"
									>
										{{ $t('导出详情数据') }}
									</el-dropdown-item>
									<el-dropdown-item
										@click="handleExport('feeTemplate')"
										v-if="auth('firstMileLogistics_detail')"
									>
										{{ $t('导出费用分摊数据') }}
									</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
						<el-button
							class="ml10"
							@click="openDialog('confirmDeal')"
							v-auth="'secondMile_handleDeal'"
						>
							{{ $t('确认处理') }}</el-button
						>
						<el-button
							class="ml10"
							@click="openDialog('confirmShip')"
							v-auth="'secondMile_handleShip'"
						>
							{{ $t('确认发货') }}</el-button
						>
						<el-button
							class="ml10"
							@click="openDialog('forecast')"
							v-auth="'secondMile_forecast'"
						>
							{{ $t('入库预报') }}</el-button
						>
						<!-- 先隐藏 -->
						<!-- <el-button
							class="ml10"
							@click="openDialog('importFeeEstimated')"
							v-auth="'secondMile_importFeeEstimated'"
						>
							{{ $t('导入预估费用') }}</el-button
						>
						<el-button
							class="ml10"
							@click="openDialog('importFeeActual')"
							v-auth="'secondMile_importFeeActual'"
						>
							{{ $t('导入实际费用') }}</el-button
						> -->
						<el-button
							class="ml10"
							@click="openDialog('importFeeTemplate')"
							v-auth="'secondMile_importFeeTemplate'"
						>
							{{ $t('导入物流费用') }}</el-button
						>
						<el-button
							class="ml10"
							@click="openDialog('createBatchTransfer')"
							v-auth="'secondMile_createBatchTransfer'"
						>
							{{ $t('批量创建二程调拨单') }}</el-button
						>
					</template>
				</ToolBar>
			</el-row>
			<el-table
				:data="state.dataList"
				@sort-change="sortChangeHandle"
				style="width: 100%"
				v-loading="state.loading"
				border
				row-key="uniqueKey"
				ref="tableRef"
				:span-method="tableSpanMethod"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
				@selection-change="selectionChangeHandle"
				native-scrollbar
			>
				<el-table-column
					align="center"
					type="selection"
					width="40"
					reserve-selection
				/>

				<el-table-column
					prop="secondMileNo"
					:label="t('调拨单号')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }"
						>{{ row.secondMileNo ?? '---' }}
					</template>
				</el-table-column>

				<el-table-column
					prop="status"
					:label="t('状态')"
					show-overflow-tooltip
					width="120"
				>
					<template #default="{ row }">{{
						(row.statusText || row.status) ?? '-'
					}}</template>
				</el-table-column>

				<el-table-column
					prop="planShipmentDate"
					:label="t('预计发货时间')"
					show-overflow-tooltip
					width="120"
				>
					<template #default="{ row }">{{
						(row.planShipmentDate || row.status) ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="remark"
					:label="t('备注')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }">{{ row.remark ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="takeWarehouseTime"
					:label="t('提交调出仓时间')"
					show-overflow-tooltip
					width="140"
				>
					<template #default="{ row }">{{
						row.takeWarehouseTime ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="actualDeliveryTime"
					:label="t('实际发货时间')"
					show-overflow-tooltip
					width="120"
				>
					<template #default="{ row }">{{
						row.actualDeliveryTime ?? '-'
					}}</template>
				</el-table-column>

				<el-table-column
					prop="takeOutWarehouse"
					:label="t('调出仓')"
					show-overflow-tooltip
					width="220"
				>
					<template #default="{ row }">
						{{ row.takeOutWarehouseText ?? '-' }}
					</template>
				</el-table-column>

				<el-table-column
					prop="takeInWarehouse"
					:label="t('调入仓')"
					show-overflow-tooltip
					width="220"
				>
					<template #default="{ row }">
						{{ row.takeInWarehouseText ?? '-' }}
					</template>
				</el-table-column>

				<el-table-column
					prop="takeInWarehouseCountry"
					:label="t('调入仓国家')"
					show-overflow-tooltip
					width="140"
				>
					<template #default="{ row }">
						{{ row.takeInWarehouseCountry ?? '-' }}
					</template>
				</el-table-column>

				<el-table-column
					:label="t('运输方式')"
					show-overflow-tooltip
					width="140"
				>
					<template #default="{ row }">{{
						(row.transportMethodText || row.transportMethod) ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="deliveryNo"
					:label="t('发货单号')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">{{ row.deliveryNo ?? '-' }}</template>
				</el-table-column>

				<el-table-column
					prop="skuCode"
					:label="t('SKU')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">{{ row.skuCode ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="platformChannelText"
					:label="t('平台渠道')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">{{
						row.platformChannelText ?? '-'
					}}</template>
				</el-table-column>

				<el-table-column
					prop="storeSite"
					:label="t('平台店铺')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">
						{{
							row.storeName || row.storeSite
								? `${row.storeName ?? '---'}：${row.storeSite ?? '---'}`
								: '---'
						}}
					</template>
				</el-table-column>
				<el-table-column
					prop="mskuCode"
					:label="t('MSKU')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">{{ row.mskuCode ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="shipmentId"
					:label="t('平台入库单')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">{{ row.shipmentId ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="barcode"
					:label="t('条码')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">{{ row.barcode ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="referenceId"
					:label="t('送仓码/关联单号')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">{{ row.referenceId ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="takeSecondContainerQuantity"
					:label="t('调拨数量')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">{{
						row.takeSecondContainerQuantity ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="takeSecondCartonQuantity"
					:label="t('调拨箱数')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">{{
						row.takeSecondCartonQuantity ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="stockQuantity"
					:label="t('入库数量')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">{{ row.stockQuantity ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="inboundQuantity"
					:label="t('入库箱数')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">{{
						row.inboundQuantity ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="outCartonSize"
					:label="t('外箱尺寸(CM)')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">{{ row.outCartonSize ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="outCartonGrossWeight"
					:label="t('外箱毛重(KG)')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">{{
						row.outCartonGrossWeight ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="totalVolume"
					:label="t('总体积(m³)')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">{{ row.totalVolume ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="totalWeight"
					:label="t('总毛重(KG)')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">{{ row.totalWeight ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="departmentName"
					:label="t('部门&小组')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }"
						>{{ row.departmentName ?? '-' }}&{{ row.deptName ?? '-' }}</template
					>
				</el-table-column>
				<!-- <el-table-column
					:label="t('调拨数量')"
					show-overflow-tooltip
					width="120"
				>
					<template #default="{ row }">{{
						row.containerTotalQuantity ?? '-'
					}}</template>
				</el-table-column>

				<el-table-column
					:label="t('调拨箱数')"
					show-overflow-tooltip
					width="120"
				>
					<template #default="{ row }">{{
						row.containerTotalCartonQuantity ?? '-'
					}}</template>
				</el-table-column>

				<el-table-column
					prop="intoTotalQuantity"
					:label="t('入库数量')"
					show-overflow-tooltip
					width="120"
				>
					<template #default="{ row }">{{
						row.intoTotalQuantity ?? '-'
					}}</template>
				</el-table-column>

				<el-table-column
					prop="intoTotalCartonQuantity"
					:label="t('入库箱数')"
					show-overflow-tooltip
					width="120"
				>
					<template #default="{ row }">{{
						row.intoTotalCartonQuantity ?? '-'
					}}</template>
				</el-table-column> -->

				<el-table-column
					prop="intoTotalCartonQuantity"
					:label="t('头程调拨单')"
					show-overflow-tooltip
					width="120"
				>
					<template #default="{ row }">{{ row.firstMileNos ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					:label="t('三方仓入库单单号')"
					show-overflow-tooltip
					width="160"
				>
					<template #default="{ row }">{{ row.intoNo ?? '-' }}</template>
				</el-table-column>
				<!-- <el-table-column
					:label="t('总体积(m³)')"
					show-overflow-tooltip
					width="140"
				>
					<template #default="{ row }">{{
						row.containerTotalVolume ?? '-'
					}}</template>
				</el-table-column>

				<el-table-column
					:label="t('总毛重(KG)')"
					show-overflow-tooltip
					width="140"
				>
					<template #default="{ row }">{{
						row.containerTotalGrossWeight ?? '-'
					}}</template>
				</el-table-column> -->

				<el-table-column
					prop="estimatedFeeSummary"
					:label="t('预估费用汇总CNY')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">{{
						row.estimatedFeeSummary ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="actualFeeSummary"
					:label="t('实际费用汇总CNY')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">{{
						row.actualFeeSummary ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="createName"
					:label="t('创建人')"
					show-overflow-tooltip
					width="140"
				>
					<template #default="{ row }">{{ row.createName ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="createTime"
					:label="t('创建时间')"
					sortable="custom"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">{{ row.createTime ?? '-' }}</template>
				</el-table-column>

				<el-table-column
					prop="operation"
					:label="$t('common.action')"
					fixed="right"
					width="80"
				>
					<template #default="{ row }">
						<div class="flex items-center">
							<el-button
								text
								type="primary"
								class="mr5"
								v-auth="'secondMile_detail'"
								@click="
									() => {
										openDialog('showInfo', row);
									}
								"
							>
								{{ $t('详情') }}</el-button
							>
							<el-dropdown placement="bottom-end">
								<el-button
									text
									v-if="
										auths([
											'secondMile_confirmWarehous',
											'secondMile_cancel',
											'secondMile_log',
											'secondMile_forecast',
											'secondMile_uploadAttachment',
										])
									"
								>
									<el-icon class="el-icon--right">
										<arrow-down />
									</el-icon>
								</el-button>
								<template #dropdown>
									<el-dropdown-menu>
										<el-dropdown-item
											@click="openDialog('forecast', row)"
											v-if="
												auth('secondMile_forecast') && row.needPredictionFlag
											"
										>
											{{ $t('入库预报') }}
										</el-dropdown-item>
										<!-- 只有【已发货、入库中、已预报-7】 -->
										<el-dropdown-item
											@click="openDialog('confirmWarehous', row)"
											v-if="
												auth('secondMile_confirmWarehous') &&
												(row.status === 3 ||
													row.status === 4 ||
													row.status === 7)
											"
										>
											{{ $t('确认入库') }}
										</el-dropdown-item>
										<!-- 只有【待处理，处理中】状态 -->
										<el-dropdown-item
											@click="openDialog('cancel', row)"
											v-if="
												auth('secondMile_cancel') &&
												(row.status === 1 || row.status === 2)
											"
										>
											{{ $t('废弃') }}
										</el-dropdown-item>
										<el-dropdown-item
											@click="openDialog('log', row)"
											v-if="auth('secondMile_log')"
										>
											{{ $t('日志') }}
										</el-dropdown-item>
										<!-- 只有【待处理】状态 -->
										<el-dropdown-item
											@click="handleUploadAttachment(row)"
											v-if="
												auth('secondMile_uploadAttachment') && row.status === 1
											"
										>
											{{ $t('上传附件') }}
										</el-dropdown-item>
									</el-dropdown-menu>
								</template>
							</el-dropdown>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<pagination
				@current-change="currentChangeHandle"
				@size-change="sizeChangeHandle"
				v-bind="state.pagination"
			/>
		</div>
		<!-- 日志对话框 -->
		<LogDialog
			v-model="logDialogVisible"
			:id="currentRow.id"
			:biz-type="['LOGISTICS_SECOND_MILE']"
			:showSearchForm="false"
			:showToolBar="false"
			@closeDialog="
				() => {
					logDialogVisible = false;
				}
			"
		/>
		<!-- 查看详情 -->
		<!-- <ShowInfo
			ref="showInfoRef"
			:currentRow="currentRow"
			:cancel-button-text="$t('关闭')"
			:confirm-button-text="$t('确认')"
			:confirm-button-type="'primary'"
			@confirm="
				() => {
					showInfoRef.hide();
				}
			"
			@cancel="
				() => {
					showInfoRef.hide();
				}
			"
		/> -->
		<!-- 确定入库 -->
		<ConfirmWarehous
			ref="confirmWarehousRef"
			:currentRow="currentRow"
			:cancel-button-text="$t('关闭')"
			:confirm-button-text="$t('确认')"
			:confirm-button-type="'primary'"
			@confirm="
				(e) => {
					confirmWarehousConfirm(e);
				}
			"
			@cancel="cancelConfirmWarehous"
		/>
		<!-- 确认处理 确认发货弹窗 -->
		<confirmDialog
			ref="confirmDialogRef"
			:currentRow="currentRow"
			:type="confirmType"
			:cancel-button-text="$t('关闭')"
			:confirm-button-text="$t('确认')"
			:confirm-button-type="'primary'"
			@confirm="
				(e) => {
					submitConfirmDialogData(e);
				}
			"
			@cancel="
				() => {
					confirmDialogRef.hide();
				}
			"
		/>
		<!-- 作废弹窗 -->
		<input-dialog
			ref="cancelDialogRef"
			title="作废"
			message="确认作废调拨单吗?"
			:show-icon="true"
			icon-type="warn"
			confirm-button-text="确认"
			confirm-button-type="danger"
			input-prop="abandonReason"
			input-placeholder="作废原因,必填"
			@cancel="cancelDialogRef.hide()"
			@confirm="handleCancel"
		/>
		<!-- 入库预报 -->
		<Forecast
			ref="forecastRef"
			:currentRow="currentRow"
			:selectedRows="selectedData"
			:dialogArray="dialogArray"
			:cancel-button-text="$t('关闭')"
			:confirm-button-text="$t('确认')"
			:confirm-button-type="'primary'"
			@confirm="
				(e:any) => {
					forecastConfirm(e);
				}
			"
			@closed="forecastRef.hide()"
		/>
		<ImportDialog
			ref="importDialogRef"
			:title="importTitle"
			:excelUploadApi="
				importTitle === '导入预估费用'
					? '/mcp/transfer-fee/import/second/forecast'
					: '/mcp/transfer-fee/import/second/actual'
			"
			@refreshDataList="getDataList"
			@downloadTemplate="downloadNeedTemplate"
			:uploadTips="uploadTips"
		/>
		<ImportDialog
			ref="importFeeTemplateDialogRef"
			title="导入费用分摊数据"
			templateUrl="/files/import-template/二程调拨费用导入模板.xlsx"
			excelUploadApi="/mcp/second/transfer-fee/import"
			@refreshDataList="getDataList"
		/>
		<ImportDialog
			ref="createBatchTransferDialogRef"
			title="批量创建二程调拨单"
			templateUrl="/files/import-template/批量创建二程调拨单.xlsx"
			excelUploadApi="/mcp/secondMile/import"
			@refreshDataList="getDataList"
		/>
		<!-- 上传附件弹窗 -->
		<UploadAttachment
			ref="uploadAttachmentRef"
			:currentRow="uploadAttachmentRow"
			@confirm="getDataList"
		/>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive, onMounted, nextTick } from 'vue';
import { useMessage } from '/@/hooks/message';
import {
	getSecondMilePage,
	getExportSecondMileList,
	getExportSecondMileDetail,
	confirmSecondMile,
	processSecondMile,
	confirmProcessShipment,
	processShipment,
	getSecondWarehouseDetail,
	confirmWarehouseStatus,
	processWarehouse,
	checkAbandon,
	abandon,
	predictionBatch,
	predictionPre,
	transferFeeExportSecondTemplate,
	getExportSecondMileFeeTemplate,
} from '/@/api/materialFlow/secondMileLogistics/index';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { getWareHouseList } from '/@/api/materialFlow/track/index';
import { useResultDialog } from '/@/hooks/useResultDialog';
import { auth, auths } from '/@/utils/authFunction';
import router from '/@/router';
import UploadAttachment from './components/uploadAttachment.vue';
const ToolBar = defineAsyncComponent(
	() => import('/@/components/ToolBar/tool-bar.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
const LogDialog = defineAsyncComponent(
	() => import('/@/components/log/log-dialog.vue')
);
const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
// const AdvancedSearchStyle = defineAsyncComponent(
// 	() => import('/@/components/TableFormModule/advanced-search-style.vue')
// );
// const ShowInfo = defineAsyncComponent(
// 	() => import('./components/showInfo.vue')
// );
const ConfirmWarehous = defineAsyncComponent(
	() => import('./components/confirmWarehous.vue')
);
const confirmDialog = defineAsyncComponent(
	() => import('./components/confirmDialog.vue')
);
const InputDialog = defineAsyncComponent(
	() => import('/@/components/ConfirmDialog/InputDialog.vue')
);
const { t } = useI18n();
const Forecast = defineAsyncComponent(
	() => import('./components/forecast.vue')
);

// table的引用
const tableRef = ref();
const { open } = useResultDialog();
const { dictMap } = useMultipleDicts(
	[
		{
			key: 'warehouseListByType',
			fetchFn: getWareHouseList,
		}, // 调出仓列表
	],
	{
		isAuto: true,
		tableRef,
	}
);

// 搜索变量
const queryRef = ref();
// 是否显示搜索
const showSearch = ref(true);
// 高级搜索布局的引用
// const AdvancedSearchStyleRef = ref();
// 查看详情的引用
// const showInfoRef = ref();
// 确认入库的引用
const confirmWarehousRef = ref();
// 变更目的仓 变更中转仓 变更至中转仓拆柜 的引用
const confirmDialogRef = ref();
// 变更目的仓 变更中转仓 变更至中转仓拆柜 类型 1变更中转仓 2变更目的仓 3变更至中转仓拆柜
const confirmType = ref('1');
// 当前选中的行
const selectedRows = ref<Array<any>>([]);

interface ISecondMileDetailRow {
	id?: string | number;
	[key: string]: unknown;
}

interface ISecondMileTableRow {
	id?: string | number;
	details?: ISecondMileDetailRow[];
	detail?: ISecondMileDetailRow;
	detailIndex?: number;
	rowspan?: number;
	[key: string]: unknown;
}

const handleTableData = (data: ISecondMileTableRow[]) => {
	return data.flatMap((row) => {
		const details = Array.isArray(row.details) ? row.details : [];

		if (details.length === 0) {
			return [
				{
					...row,
					rowspan: 1,
					uniqueKey: `${row.id}_0`,
				},
			];
		}

		return details.map((detail, detailIndex) => ({
			...detail,
			...row,
			id: row.id, // 保留主行 id，以便选择等操作能映射到主行
			detailId: detail.id, // 如果 detail 中有 id，则保留在 detailId
			detail,
			detailIndex,
			rowspan: detailIndex === 0 ? details.length : 0,
			uniqueKey: `${row.id}_${detail.id || detailIndex}`,
		}));
	});
};

const tableSpanMethod = ({ row, column }: any) => {
	const detailProps = [
		'deliveryNo',
		'skuCode',
		'platformChannelText',
		'storeSite',
		'mskuCode',
		'shipmentId',
		'barcode',
		'referenceId',
		'takeSecondContainerQuantity',
		'takeSecondCartonQuantity',
		'stockQuantity',
		'inboundQuantity',
		'outCartonSize',
		'outCartonGrossWeight',
		'totalVolume',
		'totalWeight',
		'departmentName',
	];

	if (detailProps.includes(column.property)) {
		return {
			rowspan: 1,
			colspan: 1,
		};
	}

	return {
		rowspan: row.rowspan,
		colspan: row.rowspan === 0 ? 0 : 1,
	};
};

const selectionChangeHandle = (rows: ISecondMileTableRow[]) => {
	const selectedRowMap = new Map<string | number, ISecondMileTableRow>();

	rows.forEach((row) => {
		if (row.id !== undefined && !selectedRowMap.has(row.id)) {
			selectedRowMap.set(row.id, row);
		}
	});

	selectedRows.value = Array.from(selectedRowMap.values());
};
// 选中的行的数据
const selectedData = ref<Array<any>>([]);
// 当前点击的行
const currentRow = ref<any>({
	id: '',
	shipmentQuantity: 0,
});
// 作废弹窗
const cancelDialogRef = ref();
// 日志对话框是否可见
const logDialogVisible = ref(false);
// 入库预报
const forecastRef = ref();
// 已选中的id是新欧达或者谷仓系统的数组集合
const dialogArray = ref<Array<any>>([]);
// 导入费用分摊数据弹窗
const importFeeTemplateDialogRef = ref();
// 批量创建二程调拨单弹窗
const createBatchTransferDialogRef = ref();
const importDialogRef = ref();
// 上传附件弹窗
const uploadAttachmentRef = ref();
const uploadAttachmentRow = ref({});
const uploadTips = ref<string[]>([
	'建议每次导入都使用最新的导入模板，避免出现不必要的错误',
	'仅支持xls/xlsx格式',
	'行数不超过5000条，文件大小不超过5M',
	'按调拨单维度导入最新费用（覆盖历史数据），一行生成一条费用明细',
]);
const importTitle = ref('导入预估费用');
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getSecondMilePage,
	loading: false,
	dataList: [],
	handleTableData,
	ascs: [],
	descs: ['create_time'],
});
//  table hook
const {
	getDataList,
	currentChangeHandle,
	sizeChangeHandle,
	sortChangeHandle,
	tableStyle,
} = useTable(state, tableRef);
onMounted(() => {});
// 重置
const resetQuery = () => {
	state.queryForm = {
		current: 1,
		size: 10,
		status: 1, // 默认启用
	};
	getDataList();
};

// 打开对话框
const openDialog = async (type: string, row?: any) => {
	try {
		selectedData.value = [];
		if (type === 'cancel') {
			//
			if (row.status !== 1 && row.status !== 2) {
				useMessage().warning(t('只能作废【待处理、处理中】状态的调拨单'));
				return;
			}
			currentRow.value = row;
			const res = await checkAbandon({
				ids: [row.id],
			});
			if (res?.data?.failCount > 0) {
				open({
					title: t('错误提示'),
					data: res.data,
				});
				return;
			}
			cancelDialogRef.value.show();
		} else if (type === 'log') {
			logDialogVisible.value = true;
			currentRow.value = row;
		} else if (type === 'showInfo') {
			// 获取详情展示
			router.push({
				path: '/materialFlow/secondMileLogistics/showInfo/index',
				query: { id: row.id, transferNo: row.secondMileNo },
			});
			// const res = await getSecondMileDetail(row.secondMileNo);
			// if (res.code === 0) {
			// 	currentRow.value = res.data;
			// 	showInfoRef.value?.show();
			// }
		} else if (type === 'confirmWarehous') {
			// 确认入库
			// 获取详情展示
			if (row.status !== 3 && row.status !== 4 && row.status !== 7) {
				useMessage().warning(
					t('只能操作【已发货、入库中、已预报】状态的调拨单')
				);
				return;
			}
			const res = await confirmWarehouseStatus(row.secondMileNo);
			if (res?.data?.failCount > 0) {
				open({
					title: t('错误提示'),
					data: res.data,
				});
				return;
			}
			const detailRes = await getSecondWarehouseDetail(row.secondMileNo);
			if (detailRes.code === 0) {
				const obj: any = {
					deliveryVOList: detailRes.data,
					mainId: row.id,
				};
				currentRow.value = obj;
				confirmWarehousRef.value?.show();
			}
		} else if (type === 'confirmDeal') {
			// 确认处理
			const ids = selectedRows.value.map((item: any) => item.id);
			const secondMileNos = selectedRows.value.map(
				(item: any) => item.secondMileNo
			);
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			if (!selectedRows.value.every((row: any) => row.status === 1)) {
				useMessage().warning('只能勾选状态为【待处理】的调拨单');
				return;
			}
			const res = await confirmSecondMile({
				secondMileNos: secondMileNos,
			});
			if (res?.data?.failCount > 0) {
				// 打开提示框
				open({
					title: t('错误提示'),
					data: res.data,
				});
				return;
			}
			confirmType.value = '1';
			confirmDialogRef.value?.show();
		} else if (type === 'confirmShip') {
			// 确认发货
			const ids = selectedRows.value.map((item: any) => item.id);
			const secondMileNos = selectedRows.value.map(
				(item: any) => item.secondMileNo
			);
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			if (!selectedRows.value.every((row: any) => row.status === 2)) {
				useMessage().warning('只能勾选状态为【处理中】的调拨单');
				return;
			}
			const res = await confirmProcessShipment({
				secondMileNos: secondMileNos,
			});
			if (res?.data?.failCount > 0) {
				// 打开提示框
				open({
					title: t('错误提示'),
					data: res.data,
				});
				return;
			}
			confirmType.value = '2';
			confirmDialogRef.value?.show();
		} else if (type === 'forecast') {
			if (row?.id) {
				if (row.status === 7) {
					useMessage().warning(t('已入库预报，不允许重复操作'));
					return;
				}
				selectedData.value = [
					{
						id: row.id,
						secondMileNo: row.secondMileNo,
						destWarehouseName: row.takeInWarehouseText,
						containerType: row.containerType,
						containerTypeText: row.containerTypeText,
					},
				];
			} else {
				const ids = selectedRows.value.map((item: any) => item.id);
				if (ids.length === 0) {
					useMessage().warning(t('请至少选择一条数据'));
					return;
				}
				selectedData.value = selectedRows.value.map((item: any) => {
					return {
						id: item.id,
						secondMileNo: item.secondMileNo,
						destWarehouseName: item.takeInWarehouseText,
						containerType: item.containerType,
						containerTypeText: item.containerTypeText,
					};
				});
			}
			const preRes = await predictionPre({
				ids: selectedData.value.map((item) => item.id),
			});
			dialogArray.value = preRes.data;
			const isDialog = preRes.data.length > 0;
			if (isDialog) {
				forecastRef.value.show();
			} else {
				const ids = selectedData.value.map((item) => {
					return {
						id: item.id,
					};
				});
				const res = await predictionBatch(ids);
				if (res?.data?.failCount > 0) {
					// 打开提示框
					open({
						title: t('错误提示'),
						data: res.data,
					});
					getDataList();
					return;
				}
				if (res.code === 0) {
					useMessage().success(t('入库预报成功'));
					getDataList();
				} else {
					useMessage().error(res.msg || t('入库预报失败'));
				}
			}
		} else if (type === 'importFeeEstimated') {
			importTitle.value = '导入预估费用';
			importDialogRef.value?.show();
		} else if (type === 'importFeeActual') {
			importTitle.value = '导入实际费用';
			importDialogRef.value?.show();
		} else if (type === 'importFeeTemplate') {
			importFeeTemplateDialogRef.value?.show();
		} else if (type === 'createBatchTransfer') {
			createBatchTransferDialogRef.value?.show();
		}
	} catch (error: any) {
		useMessage().error(error?.msg || t('错误'));
	}
};

// 打开上传附件弹窗
const handleUploadAttachment = async (row: any) => {
	uploadAttachmentRow.value = row;
	await nextTick();
	uploadAttachmentRef.value?.show();
};

// 确认入库预报
const forecastConfirm = async (e: any) => {
	const res = await predictionBatch(e);
	if (res?.data?.failCount > 0) {
		// 打开提示框
		open({
			title: t('错误提示'),
			data: res.data,
		});
		getDataList();
		return;
	}
	if (res.code === 0) {
		useMessage().success(t('入库预报成功'));
		forecastRef.value.hide();
	} else {
		useMessage().error(res.msg || t('入库预报失败'));
	}
	// 清空选中行
	tableRef.value.clearSelection();
	// 刷新数据
	getDataList();
};

// 处理删除
const handleCancel = async (formData: any) => {
	try {
		// if (!formData.abandonReason) {
		// 	useMessage().warning('请输入删除备注');
		// 	return;
		// }
		// 这里添加删除的API调用
		const res = await abandon({
			ids: [currentRow.value.id],
			abandonReason: formData.abandonReason,
		});

		if (res.code === 0) {
			useMessage().success(t('作废成功'));
			cancelDialogRef.value.hide();
		}
		tableRef.value.clearSelection();
		getDataList();
	} catch (error: any) {
		useMessage().error(error?.msg || '作废失败');
	}
};
/**
 * 确认入库
 */
const cancelConfirmWarehous = (isUpdate: boolean) => {
	confirmWarehousRef.value?.hide();
	if (isUpdate) {
		getDataList();
	}
};
const confirmWarehousConfirm = async (e: { data: Array<any> }) => {
	if (e.data && e.data.length > 0) {
		const paramsArr = e.data
			.filter((item) => {
				// 过滤条件：只保留 intoTotalQuantity 非 0 的项（根据业务需求调整）
				// 注意：如果 intoTotalQuantity 可能为 0.0 等数值，需严格判断
				return item.intoTotalQuantity !== 0 && item.intoTotalQuantity != null;
			})
			.map((item) => {
				// 这里只需要返回需要转换的对象（无需再判断，因为 filter 已经过滤了无效项）
				return {
					secondMileDeliveryId: item.id,
					takeNum: item.intoTotalQuantity,
					takeCarton: Math.ceil(
						(item.intoTotalQuantity || 0) / (item.singleCartonQuantity || 1)
					),
				};
			});

		const res = await processWarehouse({
			id: currentRow.value.mainId,
			secondMileDeliveryMessageList: paramsArr,
		});
		if (res.code === 0) {
			useMessage().success(t('操作成功'));
			confirmWarehousRef.value?.hide();
			getDataList();
		}
	}
};
/**
 * 确认处理 确认发货
 */
const submitConfirmDialogData = async (e: any) => {
	if (!e.handledTime) {
		useMessage().warning(
			`请选择${confirmType.value === '1' ? '提交' : '发货'}时间`
		);
		return;
	}
	const secondMileNos = selectedRows.value.map(
		(item: any) => item.secondMileNo
	);
	if (confirmType.value === '1') {
		const res = await processSecondMile({
			secondMileNos: secondMileNos,
			handledTime: e.handledTime,
		});
		if (res.code === 0) {
			useMessage().success(t('确认处理成功'));
			confirmDialogRef.value?.hide();
			await getDataList();
		}
	} else if (confirmType.value === '2') {
		const res = await processShipment({
			secondMileNos: secondMileNos,
			handledTime: e.handledTime,
		});
		if (res.code === 0) {
			useMessage().success(t('确认发货成功'));
			confirmDialogRef.value?.hide();
			await getDataList();
		}
	}
};
/***
 * 导出
 */
const handleExport = async (type: 'list' | 'detail' | 'feeTemplate') => {
	try {
		const ids = selectedRows.value.map((item: any) => item.id);
		// transferNo 就是 secondMileNo 后台的不一致
		const transferNos = tableRef.value
			.getSelectionRows()
			.map((item: any) => item.secondMileNo);
		// 显示加载状态
		state.loading = true;
		const api =
			type === 'list'
				? getExportSecondMileList
				: type === 'detail'
				? getExportSecondMileDetail
				: type === 'feeTemplate'
				? getExportSecondMileFeeTemplate
				: () => {};
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await api({
			...state.queryForm,
			ascs: state?.ascs,
			ids: ids.length > 0 ? ids : undefined,
			transferNos: transferNos.length > 0 ? transferNos : null,
			descs: state?.descs,
			current: 1,
			size: 10000,
		});
	} catch (error) {
		useMessage().error(t(error as string));
	} finally {
		// 隐藏加载状态
		state.loading = false;
	}
};
// 下载导入费用模板
const downloadNeedTemplate = async () => {
	try {
		// 显示加载状态
		state.loading = true;
		await transferFeeExportSecondTemplate({
			feeType: importTitle.value === '导入预估费用' ? 1 : 2,
			ids: selectedRows.value.map((item: any) => item.id),
			...state.queryForm,
			pageNum: 1,
			pageSize: 999999,
		});
	} catch (error) {
		state.loading = false;
		useMessage().error(t(error as string));
	} finally {
		state.loading = false;
	}
};
</script>

<style lang="scss" scoped>
.text-blue {
	color: #0089ef;
}
.el-dropdown-link {
	cursor: pointer;
	color: var(--el-color-primary);
	display: flex;
	align-items: center;
}
</style>
