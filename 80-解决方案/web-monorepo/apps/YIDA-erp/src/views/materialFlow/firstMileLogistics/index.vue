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
					<AdvancedSearchStyle ref="AdvancedSearchStyleRef">
						<template #default>
							<el-form-item>
								<div class="flex item-center">
									<SelectInput
										v-model:queryForm="state.queryForm"
										:searchTypes="[
											{
												label: '调拨单号',
												value: 'firstMileNoList',
											},
											{
												label: 'SKU',
												value: 'skuCodeList',
											},
											{
												label: '订柜号',
												value: 'orderContainerNoList',
											},
											{
												label: '柜号',
												value: 'containerNoList',
											},
											{
												label: '平台入库单',
												value: 'shipmentIdList',
											},
											{
												label: '三方仓入库单号',
												value: 'intoNoList',
											},
										]"
										:settings="{
											selectStyle: {
												width: '170px',
											},
										}"
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
										getTreeDataParams: 'first_mile_status',
										code: 'statusList',
										searchFn: getDataList,
										width: '200px',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="country"
									multiple
									:settings="{
										text: '目的国',
										code: 'destCountryCodeList',
										searchFn: getDataList,
										width: '200px',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<!-- 自营仓+三方仓+平台仓 -->
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="warehouseQianyi"
									multiple
									:settings="{
										text: '目的仓',
										getTreeDataParams: { warehouseTypes: [0, 1, 2] },
										code: 'destWarehouseCodeList',
										searchFn: getDataList,
										width: '220px',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<el-select
									@change="getDataList"
									clearable
									v-model="state.queryForm.transshipmentFlag"
									placeholder="中转拆柜"
									style="width: 220px"
								>
									<el-option
										v-for="item in [
											{
												id: 0,
												label: '否',
												value: 0,
											},
											{
												id: 1,
												label: '是',
												value: 1,
											},
										]"
										:key="item.id"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
							<el-form-item>
								<!-- 三方仓 -->
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="warehouseQianyi"
									multiple
									:settings="{
										text: '中转仓',
										getTreeDataParams: { status: 1 },
										code: 'transshipmentWarehouseCodeList',
										searchFn: getDataList,
										width: '200px',
									}"
								/>
							</el-form-item>
							<el-form-item>
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
											label: '实际装柜时间',
											value: 'actualOutStockDate',
											isAddHMS: true,
											dateStart: 'actualLoadingTimeStart',
											dateEnd: 'actualLoadingTimeEnd',
										},
									]"
									:getDataList="getDataList"
								/>
							</el-form-item>
							<el-form-item>
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
											isAddHMS: true,
											dateStart: 'createTimeStart',
											dateEnd: 'createTimeEnd',
										},
									]"
									:getDataList="getDataList"
								/>
							</el-form-item>
							<el-form-item>
								<SelectDate
									v-model:queryForm="state.queryForm"
									:settings="{
										selectStyle: {
											width: '160px',
										},
										dateStyle: {
											width: '130px',
										},
									}"
									:searchTypes="dateSearchConfig"
									:getDataList="getDataList"
								/>
							</el-form-item>
						</template>
						<template #second>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="dicts"
									multiple
									:settings="{
										text: '柜型',
										getTreeDataParams: 'container_type',
										code: 'containerTypeList',
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
										code: 'transportMethodList',
										searchFn: getDataList,
										width: '200px',
									}"
								/>
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
						</template>
						<template #right>
							<el-form-item>
								<div class="flex item-center">
									<el-button @click="getDataList" type="primary"
										>{{ $t('搜索') }}
									</el-button>
									<el-button @click="resetQuery" type="info" plain
										>{{ $t('common.resetBtn') }}
									</el-button>
									<el-button
										type="info"
										plain
										@click="
											() => {
												AdvancedSearchStyleRef.changeSecondToggle();
											}
										"
										>{{
											$t(
												`${
													AdvancedSearchStyleRef?.showSecond ? '收起' : '展开'
												}`
											)
										}}
									</el-button>
								</div>
							</el-form-item></template
						>
					</AdvancedSearchStyle>
				</el-form>
			</el-row>
			<el-row>
				<ToolBar @handleRefresh="getDataList" :is-show-export="false">
					<template #left-tool>
						<el-dropdown>
							<el-button
								class="ml10"
								v-if="
									auths([
										'firstMileLogistics_list',
										'firstMileLogistics_detail',
									])
								"
							>
								{{ $t('导出') }}
								<el-icon class="el-icon--right"><arrow-down /> </el-icon>
							</el-button>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item
										@click="handleExport('list')"
										v-if="auth('firstMileLogistics_list')"
									>
										{{ $t('导出列表数据') }}
									</el-dropdown-item>
									<el-dropdown-item
										@click="handleExport('detail')"
										v-if="auth('firstMileLogistics_detail')"
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
							@click="openDialog('secondMile')"
							v-auth="'firstMileLogistics_secondMile'"
						>
							{{ $t('二程调拨') }}</el-button
						>
						<el-button
							class="ml10"
							@click="openDialog('forecast')"
							v-auth="'firstMileLogistics_forecast'"
						>
							{{ $t('入库预报') }}</el-button
						>
						<!-- 先隐藏 -->
						<!-- <el-button
							class="ml10"
							@click="openDialog('importFeeEstimated')"
							v-auth="'firstMileLogistics_importFeeEstimated'"
						>
							{{ $t('导入预估费用') }}</el-button
						>
						<el-button
							class="ml10"
							@click="openDialog('importFeeActual')"
							v-auth="'firstMileLogistics_importFeeActual'"
						>
							{{ $t('导入实际费用') }}</el-button
						> -->
						<el-button
							class="ml10"
							@click="openDialog('importFeeTemplate')"
							v-auth="'firstMileLogistics_importFeeTemplate'"
						>
							{{ $t('导入物流费用') }}</el-button
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
				row-key="id"
				ref="tableRef"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
				@selection-change="(val:any) => (selectedRows = val)"
				native-scrollbar
			>
				<el-table-column
					align="center"
					type="selection"
					width="40"
					reserve-selection
					fixed="left"
				/>

				<el-table-column
					prop="firstMileNo"
					:label="t('调拨单号')"
					show-overflow-tooltip
					width="180"
					fixed="left"
				>
					<template #default="{ row }"
						>{{ row.firstMileNo ?? '---' }}
					</template>
				</el-table-column>

				<el-table-column
					prop="status"
					:label="t('状态')"
					show-overflow-tooltip
					width="120"
					fixed="left"
				>
					<template #default="{ row }">{{
						(row.statusText || row.status) ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="destWarehouse"
					:label="t('目的仓')"
					width="220"
					show-overflow-tooltip
				>
					<template #default="{ row }">
						<!-- 现在产品不要这个效果，直接显示目的仓名称并且拼接 -->
						<!-- <div
							:style="{
								display: 'flex',
								'flex-direction': 'column',
								'align-items': 'center',
							}"
						>
							<div
								:style="{
									display: 'flex',
									flexDirection: 'row',
								}"
							>
								<el-tooltip
									:content="row.destWarehouseNameList?.[0] || '--'"
									placement="top"
									:disabled="
										!(row.destWarehouseNameList?.[0] || '').length ||
										(row.destWarehouseNameList?.[0] || '').length <= 5
									"
								>
									<div class="spanLabel">
										{{ row.destWarehouseNameList?.[0] || '--' }}
									</div>
								</el-tooltip>
								<div
									v-if="
										[...new Set(row?.destWarehouseNameList || [])].length > 1
									"
								>
									<el-popover placement="right" :width="300" trigger="click">
										<template #reference>
											<span
												style="
													color: #2e5cf6;
													margin-left: 5px;
													cursor: pointer;
												"
												>+{{
													[...new Set(row?.destWarehouseNameList || [])]
														.length - 1
												}}</span
											>
										</template>
										<div>
											<span
												v-for="(value, index) in [
													...new Set(row?.destWarehouseNameList || []),
												]"
												:key="index"
												>{{ value }}<br
											/></span>
										</div>
									</el-popover>
								</div>
							</div>
						</div> -->
						{{
							[...new Set(row?.destWarehouseNameList || [])].join(', ') || '--'
						}}
					</template>
				</el-table-column>
				<el-table-column
					:label="t('三方仓入库单单号')"
					show-overflow-tooltip
					width="160"
				>
					<template #default="{ row }">{{ row.intoNo ?? '-' }}</template>
				</el-table-column>
				<el-table-column :label="t('订柜号')" show-overflow-tooltip width="160">
					<template #default="{ row }">{{
						row.orderContainerNo ?? '-'
					}}</template>
				</el-table-column>
				<el-table-column :label="t('柜型')" show-overflow-tooltip width="120">
					<template #default="{ row }">{{
						row.containerTypeText ?? '-'
					}}</template>
				</el-table-column>

				<el-table-column :label="t('柜号')" show-overflow-tooltip width="160">
					<template #default="{ row }">{{ row.containerNo ?? '-' }}</template>
				</el-table-column>

				<el-table-column
					:label="t('实际装柜时间')"
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">{{
						row.actualLoadingTime ?? '-'
					}}</template>
				</el-table-column>

				<el-table-column
					:label="t('是否中转拆柜')"
					show-overflow-tooltip
					width="140"
				>
					<template #default="{ row }">{{
						row.transshipmentFlag === 1
							? '是'
							: row.transshipmentFlag === 0
							? '否'
							: '-'
					}}</template>
				</el-table-column>

				<el-table-column :label="t('中转仓')" show-overflow-tooltip width="160">
					<template #default="{ row }">{{
						row.transWarehouseName ?? '-'
					}}</template>
				</el-table-column>

				<el-table-column
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
				</el-table-column>

				<el-table-column
					:label="t('总体积(m³)')"
					show-overflow-tooltip
					width="140"
				>
					<template #default="{ row }">{{
						row.containerTotalVolume ?? '-'
					}}</template>
				</el-table-column>

				<el-table-column
					:label="t('总净重(KG)')"
					show-overflow-tooltip
					width="140"
				>
					<template #default="{ row }">{{
						row.containerTotalNetWeight ?? '-'
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

				<!-- <el-table-column :label="t('发货方式')" show-overflow-tooltip width="140">
					<template #default="{ row }">{{ (row.shippingMethodText || row.shippingMethod) ?? '-' }}</template>
				</el-table-column> -->

				<el-table-column :label="t('起运国')" show-overflow-tooltip width="140">
					<template #default="{ row }"
						>{{ row.startCountryCode ?? '-' }}-{{
							row.startCountryText ?? '-'
						}}</template
					>
				</el-table-column>

				<el-table-column :label="t('起始港')" show-overflow-tooltip width="140">
					<template #default="{ row }">{{ row.startPortText ?? '-' }}</template>
				</el-table-column>

				<el-table-column :label="t('目的国')" show-overflow-tooltip width="140">
					<template #default="{ row }"
						>{{ row.destCountryCode ?? '-' }}-{{
							row.destCountryText ?? '-'
						}}</template
					>
				</el-table-column>

				<el-table-column :label="t('目的港')" show-overflow-tooltip width="140">
					<template #default="{ row }">{{ row.destPortText ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					:label="t('货代信息')"
					show-overflow-tooltip
					width="320"
				>
					<template #default="{ row }">
						{{
							[
								row.domesticForwarderName &&
									`国内拖车：${row.domesticForwarderName}`,
								row.mainForwarderName && `主运：${row.mainForwarderName}`,
								row.customsForwarderName && `清关：${row.customsForwarderName}`,
								row.deliveryForwarderName &&
									`国外派送：${row.deliveryForwarderName}`,
							]
								.filter(Boolean)
								.join(' ｜ ') || '-'
						}}
					</template>
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
					show-overflow-tooltip
					width="180"
				>
					<template #default="{ row }">{{ row.createTime ?? '-' }}</template>
				</el-table-column>
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
					prop="etaTime"
					:label="t('预计到港时间')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }">{{ row.etaTime ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="etaYdTime"
					:label="t('预计到港时间（云当）')"
					show-overflow-tooltip
					width="170"
				>
					<template #default="{ row }">{{ row.etaYdTime ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="ataTime"
					:label="t('实际到港时间')"
					show-overflow-tooltip
					width="170"
				>
					<template #default="{ row }">{{ row.ataTime ?? '-' }}</template>
				</el-table-column>
				<el-table-column
					prop="inStockTime"
					:label="t('入库时间')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }">{{ row.inStockTime ?? '-' }}</template>
				</el-table-column>
				<el-table-column :label="$t('common.action')" fixed="right" width="80">
					<template #default="{ row }">
						<div class="flex items-center">
							<el-button
								text
								type="primary"
								class="mr5"
								v-auth="'firstMileLogistics_showInfo'"
								@click="
									() => {
										openDialog('showInfo', row);
									}
								"
							>
								{{ $t('详情') }}</el-button
							>
							<el-dropdown placement="bottom-end">
								<el-button text>
									<el-icon class="el-icon--right">
										<arrow-down
											v-if="
												auths([
													'firstMileLogistics_confirmWarehous',
													'firstMileLogistics_changeToWarehousOne',
													'firstMileLogistics_changeToWarehousTwo',
													'firstMileLogistics_changeToWarehousThree',
													'firstMileLogistics_log',
													'firstMileLogistics_forecast',
												])
											"
										/>
									</el-icon>
								</el-button>
								<template #dropdown>
									<el-dropdown-menu>
										<el-dropdown-item
											@click="openDialog('forecast', row)"
											v-if="
												auth('firstMileLogistics_forecast') &&
												row.needPredictionFlag
											"
										>
											{{ $t('入库预报') }}
										</el-dropdown-item>
										<!-- 只有【已出库、入库中、已预报-4】 -->
										<el-dropdown-item
											@click="openDialog('confirmWarehous', row)"
											v-if="
												auth('firstMileLogistics_confirmWarehous') &&
												(row.status === 1 ||
													row.status === 2 ||
													row.status === 4)
											"
										>
											{{ $t('确认入库') }}
										</el-dropdown-item>
										<!-- 只有【已出库】状态且需中转拆箱 -->
										<el-dropdown-item
											@click="openDialog('changeToWarehousOne', row)"
											v-if="
												auth('firstMileLogistics_changeToWarehousOne') &&
												(row.status === 1 || row.status === 4) &&
												row.transshipmentFlag === 1
											"
										>
											{{ $t('变更中转仓') }}
										</el-dropdown-item>
										<!-- 只有【已出库】状态且直发一件代发仓的（同一个目的仓并且发货方式为一件代发）并且不能是中转拆柜 -->
										<el-dropdown-item
											@click="openDialog('changeToWarehousTwo', row)"
											v-if="
												auth('firstMileLogistics_changeToWarehousTwo') &&
												canChangeDestWarehouse(row)
											"
										>
											{{ $t('变更目的仓') }}
										</el-dropdown-item>
										<!-- 只有【已出库】状态且是非中转拆柜的 -->
										<el-dropdown-item
											@click="openDialog('changeToWarehousThree', row)"
											v-if="
												auth('firstMileLogistics_changeToWarehousThree') &&
												row.status === 1 &&
												row.transshipmentFlag === 0
											"
										>
											{{ $t('变更至中转仓拆柜') }}
										</el-dropdown-item>
										<el-dropdown-item
											@click="openDialog('log', row)"
											v-if="auth('firstMileLogistics_log')"
										>
											{{ $t('日志') }}
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
			:biz-type="['LOGISTICS_FIRST_MILE']"
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
			:tabeleRow="tabeleRow"
			@confirm="
				(e) => {
					confirmWarehousConfirm(e);
				}
			"
			@cancel="cancelConfirmWarehous"
		/>
		<!-- 变更目的仓 变更中转仓 变更至中转仓拆柜 -->
		<ChangeToWarehous
			ref="changeToWarehousRef"
			:currentRow="currentRow"
			:type="changeToWarehousType"
			@confirm="
				(e) => {
					handleChangeToWarehousSuccess(e);
				}
			"
			@cancel="
				() => {
					changeToWarehousRef.hide();
				}
			"
		/>
		<!-- 二程调拨 -->
		<SecondMile
			ref="secondMileRef"
			:currentRow="currentRow"
			:selectedRows="selectedData"
			:dictMap="dictMap"
			@confirm="
				(e:any) => {
					secondMileConfirm(e);
				}
			"
			@cancel="
				() => {
					secondMileRef.hide();
				}
			"
		/>
		<!-- 入库预报 -->
		<Forecast
			ref="forecastRef"
			:currentRow="currentRow"
			:selectedRows="selectedData"
			:dialogArray="dialogArray"
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
					? '/mcp/transfer-fee/import/first/forecast'
					: '/mcp/transfer-fee/import/first/actual'
			"
			@refreshDataList="getDataList"
			@downloadTemplate="downloadNeedTemplate"
			:uploadTips="uploadTips"
		/>
		<ImportDialog
			ref="importFeeTemplateDialogRef"
			title="导入费用分摊数据"
			templateUrl="/files/import-template/头程调拨费用导入模板.xlsx"
			excelUploadApi="/mcp/first/transfer-fee/import"
			@refreshDataList="getDataList"
		/>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { dateSearchConfig } from './confige/index';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive, onMounted } from 'vue';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { postDeleteDeliveryPlan } from '/@/api/materialFlow/deliveryPlan/index';
import {
	getFirstMilePage,
	getExportFirstMileDetail,
	getExportFirstMileList,
	getFirstMileDetail,
	postConfirmInto,
	postChangeTransshipmentWarehouse,
	postAddTransshipmentWarehouse,
	postChangeDestWarehouse,
	getFreightForwarderListByCondition,
	postInsertSecondMile,
	predictionBatch,
	predictionPre,
	transferFeeExportFirstTemplate,
	getExportFirstMileFeeTemplate,
} from '/@/api/materialFlow/firstMileLogistics/index';
import { getWareHouseList } from '/@/api/materialFlow/track/index';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { ElMessageBox } from 'element-plus';
import { auth, auths } from '/@/utils/authFunction';
import { useResultDialog } from '/@/hooks/useResultDialog';
import router from '/@/router';
const ToolBar = defineAsyncComponent(
	() => import('/@/components/ToolBar/tool-bar.vue')
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
const AdvancedSearchStyle = defineAsyncComponent(
	() => import('/@/components/TableFormModule/advanced-search-style.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
const ConfirmWarehous = defineAsyncComponent(
	() => import('./components/confirmWarehous.vue')
);
const ChangeToWarehous = defineAsyncComponent(
	() => import('./components/changeToWarehous.vue')
);
const SecondMile = defineAsyncComponent(
	() => import('./components/secondMile.vue')
);
const Forecast = defineAsyncComponent(
	() => import('./components/forecast.vue')
);

const { open } = useResultDialog();
// table的引用
const tableRef = ref();
const { dictMap } = useMultipleDicts(
	[
		{
			key: 'freightForwarderListByCondition',
			fetchFn: getFreightForwarderListByCondition,
			params: { forwarderTypes: [6] },
		}, // 货代管理查询
		{
			key: 'warehouseListByType',
			fetchFn: getWareHouseList,
			params: { excludeCountryTwoCodeList: ['CN'] }, // 排除国家二字码集合
		}, // 仓库列表
	],
	{
		isAuto: true,
		tableRef,
	}
);
const { t } = useI18n();

// 搜索变量
const queryRef = ref();
// 是否显示搜索
const showSearch = ref(true);
// 高级搜索布局的引用
const AdvancedSearchStyleRef = ref();
// 查看详情的引用
// const showInfoRef = ref();
// 确认入库的引用
const confirmWarehousRef = ref();
// 变更目的仓 变更中转仓 变更至中转仓拆柜 的引用
const changeToWarehousRef = ref();
// 变更目的仓 变更中转仓 变更至中转仓拆柜 类型 1变更中转仓 2变更目的仓 3变更至中转仓拆柜
const changeToWarehousType = ref('1');
// 二程调拨 的引用
const secondMileRef = ref();
// 当前选中的行
const selectedRows = ref<Array<any>>([]);
// 选中的行的数据
const selectedData = ref<Array<any>>([]);
// 当前点击的行
const currentRow = ref({
	id: '',
	shipmentQuantity: 0,
});
// 当前点击的行的数据
let tabeleRow = ref({});
// 日志对话框是否可见
const logDialogVisible = ref(false);
// 入库预报
const forecastRef = ref();
// 已选中的id是新欧达或者谷仓系统的数组集合
const dialogArray = ref<Array<any>>([]);
// 导入费用弹窗
const importDialogRef = ref();
// 导入费用分摊数据弹窗
const importFeeTemplateDialogRef = ref();
const uploadTips = ref<string[]>([
	'建议每次导入都使用最新的导入模板，避免出现不必要的错误',
	'仅支持xls/xlsx格式',
	'行数不超过5000条，文件大小不超过5M',
	'按调拨单维度导入最新费用（覆盖历史数据），一行生成一条费用明细',
]);
const importTitle = ref('导入预估费用');
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getFirstMilePage,
	loading: false,
	dataList: [],
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

/**
 * 判断是否可以显示"变更目的仓"选项
 * 条件：已出库状态且直发一件代发仓的（同一个目的仓并且发货方式为一件代发）并且不能是中转拆柜
 */
const canChangeDestWarehouse = (row: any): boolean => {
	if (!row.deliveryVOList?.length) {
		return false;
	}
	// 判断是否为同一目的仓 且发货方式为一件代发
	const isSameDestWarehouseAndDropshipping = row.deliveryVOList.every(
		(item: { shippingMethod: string; destWarehouseCode: string }) => {
			return (
				item.shippingMethod === 'dropshipping' &&
				item.destWarehouseCode === row.deliveryVOList[0]?.destWarehouseCode
			);
		}
	);
	return (
		isSameDestWarehouseAndDropshipping &&
		(row.status === 1 || row.status === 4) &&
		row.transshipmentFlag !== 1
	);
};

// 打开对话框
const openDialog = async (type: string, row?: any) => {
	try {
		selectedData.value = [];
		if (type === 'del') {
			//
			const ids = selectedRows.value.map((item: any) => item.id);
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			await useMessageBox()
				.confirm(t('是否确认删除选中数据？'))
				.then(async () => {
					const res = await postDeleteDeliveryPlan({ ids });
					if (res.code === 0) {
						useMessage().success(t('删除成功'));
					}
					tableRef.value.clearSelection();
					getDataList();
				})
				.catch(() => {});
		} else if (type === 'log') {
			logDialogVisible.value = true;
			currentRow.value = row;
		} else if (type === 'showInfo') {
			router.push({
				path: '/materialFlow/firstMileLogistics/showInfo/index',
				query: { id: row.id, transferNo: row.firstMileNo },
			});
			// 获取详情展示
			// const res = await getFirstMileDetail({
			// 	id: row.id,
			// });
			// if (res.code === 0) {
			// 	currentRow.value = res.data;
			// 	showInfoRef.value?.show();
			// }
		} else if (type === 'confirmWarehous') {
			// 获取详情展示
			const res = await getFirstMileDetail({
				id: row.id,
			});
			if (res.code === 0) {
				currentRow.value = res.data;
				tabeleRow.value = row;
				confirmWarehousRef.value?.show();
			}
		} else if (type === 'changeToWarehousOne') {
			// 变更中转仓
			changeToWarehousType.value = '1';
			currentRow.value = row;
			changeToWarehousRef.value?.show();
		} else if (type === 'changeToWarehousTwo') {
			// 变更目的仓
			changeToWarehousType.value = '2';
			currentRow.value = row;
			changeToWarehousRef.value?.show();
		} else if (type === 'changeToWarehousThree') {
			// 变更至中转仓拆柜
			changeToWarehousType.value = '3';
			currentRow.value = row;
			changeToWarehousRef.value?.show();
		} else if (type === 'secondMile') {
			const ids = selectedRows.value.map((item: any) => item.id);
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			// 判断是否都是中转仓
			const isAllTransshipment = selectedRows.value.every(
				(item: any) => item.transshipmentFlag === 1
			);
			if (!isAllTransshipment) {
				ElMessageBox({
					title: '错误提示', // 标题文字
					message: `
						<p>必须都为中转拆柜才能发起，请重新勾选！</p>
						<p style="color: #d9001b;">
						或在产品库存发起二程调拨。
						</p>
					`,
					type: 'error', // 匹配错误提示样式
					showCancelButton: true, // 显示取消按钮
					showConfirmButton: false, // 隐藏确认按钮
					cancelButtonText: '关闭', // 取消按钮文字
					dangerouslyUseHTMLString: true, // 允许渲染 HTML（必填，否则无法解析标签）
				});
				return;
			}
			// 中转仓必须有值，并且一致
			const hasTransshipmentWarehouseCode = selectedRows.value.every(
				(item: any) => item.transshipmentWarehouseCode
			);
			if (!hasTransshipmentWarehouseCode) {
				useMessageBox().error(t('中转仓必须有值，并且一致'));
				return;
			}
			// 必须有入库数量，不能为空
			const hasIntoTotalQuantity = selectedRows.value.some(
				(item: any) => item.intoTotalQuantity > 0
			);
			if (!hasIntoTotalQuantity) {
				useMessageBox().error(t('必须有入库数量，不能为空'));
				return;
			}
			// //  入库数量不能等于调拨数量
			// const hasNotEqualQuantity = selectedRows.value.some((item: any) => item.intoTotalQuantity === item.containerTotalQuantity);
			// if (hasNotEqualQuantity) {
			// 	useMessageBox().error(t('入库数量不能等于调拨数量'));
			// 	return;
			// }
			// 处理里面的数据
			const setDeliveryVOList = JSON.parse(JSON.stringify(selectedRows.value));
			setDeliveryVOList.forEach((item: any) => {
				if (item.deliveryVOList && item.deliveryVOList.length > 0) {
					item.deliveryVOList = item.deliveryVOList.map(
						(deliveryItem: any) => ({
							...deliveryItem,
							firstMileNo: item.firstMileNo, // 头程单号
							orderContainerNo: item.orderContainerNo, // 订柜号
						})
					);
				}
			}) as any;
			// 赋值
			selectedData.value = setDeliveryVOList;
			// 二程调拨
			secondMileRef.value?.show();
			// 取消选中
			tableRef.value.clearSelection();
		} else if (type === 'forecast') {
			if (row?.id) {
				if (row.status === 4) {
					useMessage().warning(t('已入库预报，不允许重复操作'));
					return;
				}
				selectedData.value = [
					{
						id: row.id,
						firstMileNo: row.firstMileNo,
						destWarehouseName: row.transshipmentFlag
							? row.transWarehouseName
							: row.destWarehouseNameList[0],
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
						firstMileNo: item.firstMileNo,
						destWarehouseName: item.transshipmentFlag
							? item.transWarehouseName
							: item.destWarehouseNameList[0],
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
		}
	} catch (error: any) {
		// useMessage().error(error?.msg || t('错误'));
	}
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
	}
	// 清空选中行
	tableRef.value.clearSelection();
	// 刷新数据
	getDataList();
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
	state.loading = true;
	if (e.data && e.data.length > 0) {
		const res = await postConfirmInto({
			id: currentRow.value.id,
			intoDataDTOS: e.data
				.filter((item) => {
					// 过滤条件：只保留 intoQuantity 非 0 的项（根据业务需求调整）
					// 注意：如果 intoQuantity 可能为 0.0 等数值，需严格判断
					return item.intoQuantity !== 0 && item.intoQuantity != null;
				})
				.map((item) => {
					// 这里只需要返回需要转换的对象（无需再判断，因为 filter 已经过滤了无效项）
					return {
						id: item.id,
						intoQuantity: item.intoQuantity,
						mskuCode: item.mskuCode,
					};
				}),
		});
		if (res.code === 0) {
			useMessage().success(t('操作成功'));
			getDataList();
			confirmWarehousRef.value?.hide();
		}
	}
	state.loading = false;
};
/**
 * 变更中转仓 变更目的仓 变更至中转仓拆柜 成功后回调
 */
const handleChangeToWarehousSuccess = async (e: any) => {
	if (changeToWarehousType.value === '1') {
		const res = await postChangeTransshipmentWarehouse({
			id: currentRow.value.id,
			warehouseCode: e.warehouseCode,
		});
		if (res.code === 0) {
			if (res.data && typeof res.data === 'string') {
				useMessage().error(res.data);
			}
			useMessage().success(t('变更中转仓成功'));
			changeToWarehousRef.value?.hide();
			await getDataList();
		}
	} else if (changeToWarehousType.value === '2') {
		const res = await postChangeDestWarehouse({
			id: currentRow.value.id,
			warehouseCode: e.warehouseCode,
		});
		if (res.code === 0) {
			if (res.data && typeof res.data === 'string') {
				useMessage().error(res.data);
			}
			useMessage().success(t('变更目的仓成功'));
			changeToWarehousRef.value?.hide();
			await getDataList();
		}
	} else if (changeToWarehousType.value === '3') {
		const res = await postAddTransshipmentWarehouse({
			id: currentRow.value.id,
			warehouseCode: e.warehouseCode,
		});
		if (res.code === 0) {
			useMessage().success(t('变更至中转仓拆柜成功'));
			changeToWarehousRef.value?.hide();
			await getDataList();
		}
	}
};
/***
 * 二程调拨确认
 */
const secondMileConfirm = async (e: any) => {
	const params: any = {};
	// 调入仓
	params.takeInWarehouse = e.takeInWarehouse;
	// 调出仓
	params.takeOutWarehouse = e.takeOutWarehouse;
	// 运输方式
	params.transportMethod = e.transportMethod;
	// 货代方式
	params.freightForwarderListByCondition = e.freightForwarderListByCondition;
	// 预计发货日期
	params.planShipmentDate = e.planShipmentDate;
	// 备注
	params.remark = e.remark;
	// 类型：SECOND_MILE_DELIVERY 头程入二程
	params.type = 'SECOND_MILE_DELIVERY';
	const secondMileDeliveryMessageList = e.tableConfirmData.map((item: any) => {
		return {
			...item,
			// 运营人员是必填的
			operationId: item.operationUserId,
		};
	});
	params.deliveryList = secondMileDeliveryMessageList;
	const res = await postInsertSecondMile(params);
	if (res.code === 0) {
		useMessage().success(t('操作成功'));
		secondMileRef.value?.hide();
		getDataList();
	}
};
/***
 * 导出
 */
const handleExport = async (type: 'list' | 'detail' | 'feeTemplate') => {
	try {
		const ids = selectedRows.value.map((item: any) => item.id);
		// transferNo 就是 firstMileNo 后台的不一致
		const transferNos = tableRef.value
			.getSelectionRows()
			.map((item: any) => item.firstMileNo);
		// 显示加载状态
		state.loading = true;
		const api =
			type === 'list'
				? getExportFirstMileList
				: type === 'detail'
				? getExportFirstMileDetail
				: type === 'feeTemplate'
				? getExportFirstMileFeeTemplate
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
		await transferFeeExportFirstTemplate({
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
		// 隐藏加载状态
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
.spanLabel {
	max-width: 100px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
