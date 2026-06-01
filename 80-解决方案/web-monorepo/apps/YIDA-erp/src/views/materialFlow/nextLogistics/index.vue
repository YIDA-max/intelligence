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
							<!-- 国家 -->
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="country"
									multiple
									:settings="{
										text: '国家',
										code: 'countries',
										searchFn: getDataList,
										width: '200px',
									}"
								/>
							</el-form-item>

							<!-- 起运港 -->
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="basePort"
									multiple
									:settings="{
										text: '起运港',
										code: 'originPorts',
										searchFn: getDataList,
										width: '200px',
									}"
								/>
							</el-form-item>

							<!-- 目的港 -->
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="basePort"
									multiple
									:settings="{
										text: '目的港',
										code: 'destPorts',
										searchFn: getDataList,
										width: '200px',
									}"
								/>
							</el-form-item>

							<!-- 发货方式 -->
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="dicts"
									multiple
									:settings="{
										text: '发货方式',
										getTreeDataParams: 'shipping_method',
										code: 'deliveryMethods',
										searchFn: getDataList,
										width: '200px',
									}"
								/>
							</el-form-item>

							<!-- 第一目的仓 -->
							<el-form-item>
								<div class="flex item-center">
									<TreeSelectInputApi
										v-model:queryForm="state.queryForm"
										placeholder="第一目的仓"
										:settings="{
											text: '第一目的仓',
											getTreeData: getThirdformList,
											code: 'firstWarehouses',
											searchFn: getDataList,
											width: '200px',
											selectTreeProps: {
												value: 'id',
												label: 'warehouseName',
											},
											getIdsCode: 'warehouseCode',
										}"
									/>
								</div>
							</el-form-item>

							<!-- 第二目的仓 -->
							<el-form-item>
								<div class="flex item-center">
									<TreeSelectInputApi
										v-model:queryForm="state.queryForm"
										placeholder="第二目的仓"
										:settings="{
											text: '第二目的仓',
											getTreeData: () => {
												return {
													code: 0,
													data: [
														...dictMap.platformList,
														...dictMap.thidformList,
													],
												};
											},
											code: 'secondWarehouses',
											searchFn: getDataList,
											width: '200px',
											selectTreeProps: {
												value: 'id',
												label: 'warehouseName',
											},
											getIdsCode: 'warehouseCode',
										}"
									/>
								</div>
							</el-form-item>

							<!-- 平台 -->
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="dicts"
									multiple
									:settings="{
										text: '平台',
										getTreeDataParams: 'platform_channel',
										code: 'platforms',
										searchFn: getDataList,
										width: '200px',
									}"
								/>
							</el-form-item>

							<!-- 国际运输 -->
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="freightForwarder"
									multiple
									:settings="{
										text: '国际运输',
										code: 'intlCarriers',
										getTreeDataParams: { forwarderTypes: [5] },
										searchFn: getDataList,
										width: '200px',
									}"
								/>
							</el-form-item>
							<!-- 清关 -->
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="freightForwarder"
									multiple
									:settings="{
										text: '清关服务商',
										code: 'customsClearances',
										getTreeDataParams: { forwarderTypes: [3] },
										searchFn: getDataList,
										width: '200px',
									}"
								/>
							</el-form-item>
							<!-- 海外派送 -->
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="freightForwarder"
									multiple
									:settings="{
										text: '海外派送',
										code: 'lastMileDeliveries',
										getTreeDataParams: { forwarderTypes: [4] },
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
												width: '150px',
											},
											dateStyle: {
												width: '200px',
											},
										}"
										:searchTypes="[
											{
												label: '货好时间',
												value: 'cargoReadyTime',
												isAddHMS: true,
												dateStart: 'cargoReadyTimeStart',
												dateEnd: 'cargoReadyTimeEnd',
											},
											// kk
											{
												label: '物流实际装柜时',
												value: 'loadingTime',
												isAddHMS: true,
												dateStart: 'loadingTimeStart',
												dateEnd: 'loadingTimeEnd',
											},
											{
												label: '预计开船(云当)',
												value: 'estimatedDepartureTime',
												isAddHMS: true,
												dateStart: 'estimatedDepartureTimeStart',
												dateEnd: 'estimatedDepartureTimeEnd',
											},
											{
												label: '实际开船',
												value: 'actualDepartureTime',
												isAddHMS: true,
												dateStart: 'actualDepartureTimeStart',
												dateEnd: 'actualDepartureTimeEnd',
											},

											{
												label: '预计到港(云当)',
												value: 'estimatedArrivalTime',
												isAddHMS: true,
												dateStart: 'estimatedArrivalTimeStart',
												dateEnd: 'estimatedArrivalTimeEnd',
											},
											{
												label: '实际到港',
												value: 'actualArrivalTime',
												isAddHMS: true,
												dateStart: 'actualArrivalTimeStart',
												dateEnd: 'actualArrivalTimeTimeEnd',
											},
											{
												label: '可提柜时间',
												value: 'availableDate',
												isAddHMS: true,
												dateStart: 'availableDateStart',
												dateEnd: 'availableDateEnd',
											},
											{
												label: '提柜时间',
												value: 'containerPickupTime',
												isAddHMS: true,
												dateStart: 'containerPickupTimeStart',
												dateEnd: 'containerPickupTimeEnd',
											},
											{
												label: '预计入库(第一目的仓)',
												value: 'scheduledInboundTime',
												isAddHMS: true,
												dateStart: 'scheduledInboundTimeFirstStart',
												dateEnd: 'scheduledInboundTimeFirstEnd',
											},
											{
												label: '实际入库(第一目的仓)',
												value: 'actualInboundTime',
												isAddHMS: true,
												dateStart: 'actualInboundTimeFirstStart',
												dateEnd: 'actualInboundTimeFirstEnd',
											},
											{
												label: '预约送平台仓时间',
												value: 'scheduledDeliveryTimeToPlatformWarehouse',
												isAddHMS: true,
												dateStart:
													'scheduledDeliveryTimeToPlatformWarehouseStart',
												dateEnd: 'scheduledDeliveryTimeToPlatformWarehouseEnd',
											},
											{
												label: '实际送平台仓时间',
												value: 'actualDeliveryTimeToPlatformWarehouse',
												isAddHMS: true,
												dateStart: 'actualDeliveryTimeToPlatformWarehouseStart',
												dateEnd: 'actualDeliveryTimeToPlatformWarehouseEnd',
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
										:settings="{
											selectStyle: {
												width: '150px',
											},
											inputStyle: {
												width: '300px',
											},
										}"
										:searchTypes="[
											{
												label: 'ShipmentID',
												value: 'shipmentIds',
											},
											{
												label: '柜号',
												value: 'containerNos',
											},

											{
												label: 'MSKU',
												value: 'mskus',
											},
											{
												label: '三方仓入库单号',
												value: 'thirdWarehouseInboundNos',
											},
											{
												label: 'Plan ID(TK)',
												value: 'planIdTks',
											},
											{
												label: 'SKU',
												value: 'skus',
											},
											{
												label: '产品名称',
												value: 'productNames',
											},
											{
												label: '订柜号',
												value: 'bookingNos',
											},
										]"
										:getDataList="getDataList"
									/>
								</div>
							</el-form-item>
						</template>
						<!-- 未来展开项内容 -->
						<template #second> </template>
						<!-- 右侧操作内容 -->
						<template #right>
							<el-form-item>
								<div class="flex item-center">
									<el-button @click="getDataList" type="primary"
										>{{ $t('搜索') }}
									</el-button>
									<el-button @click="resetQuery" type="info" plain
										>{{ $t('common.resetBtn') }}
									</el-button>
								</div>
							</el-form-item>
						</template>
					</AdvancedSearchStyle>
				</el-form>
			</el-row>

			<!-- 操作行 -->
			<el-row>
				<ToolBar
					@handleRefresh="getDataList"
					:is-show-export="false"
					:loading="state.loading"
				>
					<template #left-tool>
						<el-button
							class="ml10"
							type="primary"
							v-auth="'nextLogistics_import'"
							@click="openDialog('upData')"
						>
							{{ $t('导入更新信息') }}</el-button
						>
						<el-dropdown
							v-if="auth('nextLogistics_export')"
							@command="(type: string) => handleExport(type)"
						>
							<el-button class="ml10" type="primary">
								{{ $t('导出') }}
								<el-icon class="el-icon--right">
									<arrow-down />
								</el-icon>
							</el-button>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item
										v-if="auth('nextLogistics_cabinet')"
										command="exportCabinet"
										>{{ $t('导出柜子信息') }}</el-dropdown-item
									>
									<el-dropdown-item
										v-if="auth('nextLogistics_detail')"
										command="exportDetail"
									>
										{{ $t('导出明细信息') }}
									</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
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
				@expand-change="clickRowHandle"
				native-scrollbar
			>
				<el-table-column width="60" type="expand" fixed="left">
					<template #default="{ row }">
						<el-table
							:data="row.products"
							:header-cell-style="{
								textAlign: 'center',
								background: 'white',
								color: 'black',
								padding: '15px 0',
							}"
							:cell-style="{
								textAlign: 'center',
								padding: '20px 0',
							}"
							class="expand-table"
							native-scrollbar
						>
							<el-table-column align="center" width="60" />
							<!-- <el-table-column type="selection" width="40" align="center" /> -->
							<el-table-column label="SKU" width="220" show-overflow-tooltip>
								<template #default="{ row: skuRow }">
									<span>{{ skuRow.sku || '---' }}</span>
								</template>
							</el-table-column>
							<el-table-column
								prop="productName"
								label="产品名称"
								width="150"
								align="left"
							>
								<template #default="{ row: skuRow }">
									<span>{{ skuRow.productName || '---' }}</span>
								</template>
							</el-table-column>
							<el-table-column
								prop="platform"
								label="平台"
								width="150"
								align="left"
							>
								<template #default="{ row: skuRow }">
									<span>{{ getUniquePlatforms(skuRow.platform) }}</span>
								</template>
							</el-table-column>
							<el-table-column
								prop="msku"
								label="MSKU"
								width="150"
								align="left"
							>
								<template #default="{ row: skuRow }">
									<span>{{ skuRow.msku || '---' }}</span>
								</template>
							</el-table-column>
							<el-table-column
								prop="fnskuEanGtin"
								label="FNSKU/EAN/GTIN"
								width="150"
								align="left"
							>
								<template #default="{ row: skuRow }">
									{{ skuRow.fnskuEanGtin || '---' }}
								</template>
							</el-table-column>
							<el-table-column
								prop="shipmentId"
								label="Shipment ID"
								width="150"
								align="left"
							>
								<template #default="{ row: skuRow }">
									{{ skuRow.shipmentId || '---' }}
								</template>
							</el-table-column>
							<el-table-column
								prop="referenceId"
								label="Reference ID"
								width="150"
								align="left"
							>
								<template #default="{ row: skuRow }">
									{{ skuRow.referenceId || '---' }}
								</template>
							</el-table-column>
							<el-table-column
								prop="cargoReadyTime"
								label="货好时间"
								width="120"
								align="left"
							>
								<template #default="{ row: skuRow }">
									{{ skuRow.cargoReadyTime || '---' }}
								</template>
							</el-table-column>
							<el-table-column
								prop="actualQty"
								label="实际发货数量"
								width="150"
								align="left"
							>
								<template #default="{ row: skuRow }">
									{{ skuRow.actualQty || '---' }}
								</template>
							</el-table-column>
							<el-table-column
								prop="actualCases"
								label="实际发货箱数"
								width="150"
								align="left"
							>
								<template #default="{ row: skuRow }">
									{{ skuRow.actualCases || '---' }}
								</template>
							</el-table-column>
							<el-table-column
								prop="totalVolume"
								label="总体积"
								width="150"
								align="left"
							>
								<template #default="{ row: skuRow }">
									{{ skuRow.totalVolume || '---' }}(m³)
								</template>
							</el-table-column>
							<el-table-column
								prop="totalGrossWeight"
								label="总毛重"
								width="150"
								align="left"
							>
								<template #default="{ row: skuRow }">
									{{ skuRow.totalGrossWeight || '---' }}(kg)
								</template>
							</el-table-column>
							<el-table-column
								prop="totalNetWeight"
								label="总净重"
								width="150"
								align="left"
							>
								<template #default="{ row: skuRow }">
									{{ skuRow.totalNetWeight || '---' }}(kg)
								</template>
							</el-table-column>
							<el-table-column
								prop="createTime"
								label="创建时间"
								width="300"
								align="left"
							>
								<template #default="{ row: skuRow }">
									{{ skuRow.createTime || '---' }}
								</template>
							</el-table-column>
							<el-table-column
								prop="updateTime"
								label="修改时间"
								width="300"
								align="left"
							>
								<template #default="{ row: skuRow }">
									{{ skuRow.updateTime || '---' }}
								</template>
							</el-table-column>
						</el-table>
					</template>
				</el-table-column>
				<el-table-column
					type="selection"
					width="40"
					align="center"
					fixed="left"
				/>
				<el-table-column
					prop="bookingNo"
					label="订柜号"
					min-width="160"
					fixed="left"
				>
					<template #default="{ row }">{{ row.bookingNo || '---' }}</template>
				</el-table-column>
				<el-table-column
					prop="containerType"
					label="柜型"
					min-width="80"
					fixed="left"
				>
					<template #default="{ row }">{{
						row.containerType || '---'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="route"
					label="运输路径"
					min-width="150"
					fixed="left"
				>
					<template #default="{ row }">{{ row.route || '---' }}</template>
				</el-table-column>
				<el-table-column prop="soNo" label="so" min-width="150" fixed="left">
					<template #default="{ row }">{{ row.soNo || '---' }}</template>
				</el-table-column>
				<el-table-column
					prop="containerNo"
					label="柜号"
					min-width="150"
					fixed="left"
				>
					<template #default="{ row }">{{ row.containerNo || '---' }}</template>
				</el-table-column>
				<el-table-column
					prop="customsClearance"
					label="清关服务商"
					min-width="180"
				>
					<template #default="{ row }">{{
						row.customsClearance || '---'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="lastMileDelivery"
					label="提货派送服务商"
					min-width="180"
				>
					<template #default="{ row }">{{
						row.lastMileDelivery || '---'
					}}</template>
				</el-table-column>
				<el-table-column prop="originPort" label="起始港" min-width="180">
					<template #default="{ row }">{{ row.originPort || '---' }}</template>
				</el-table-column>
				<el-table-column prop="destPort" label="目的港" min-width="180">
					<template #default="{ row }">{{ row.destPort || '---' }}</template>
				</el-table-column>
				<el-table-column prop="country" label="国家" min-width="180">
					<template #default="{ row }">{{ row.country || '---' }}</template>
				</el-table-column>
				<el-table-column
					prop="deliveryMethod"
					label="发货方式-末端"
					min-width="180"
				>
					<template #default="{ row }">{{
						row.deliveryMethod || '---'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="firstWarehouse"
					label="第一目的仓"
					min-width="180"
				>
					<template #default="{ row }">{{
						row.firstWarehouse || '---'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="secondWarehouse"
					:label="t('第二目的仓')"
					show-overflow-tooltip
					width="220"
				>
					<template #default="{ row }">
						<div
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
								<div class="spanLabel">
									{{
										row.secondWarehouse?.split(';').length &&
										row.secondWarehouse?.split(';')[0]
											? row.secondWarehouse?.split(';')[0].length > 12
												? row.secondWarehouse
														?.split(';')[0]
														.substring(0, 12)
														.concat('...')
												: row.secondWarehouse?.split(';')[0]
											: '--'
									}}
								</div>
								<div
									v-if="
										[...new Set(row.secondWarehouse?.split(';') || [])].length >
										1
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
													[...new Set(row.secondWarehouse?.split(';') || [])]
														.length - 1
												}}</span
											>
										</template>
										<div>
											<span
												v-for="(value, index) in [
													...new Set(row.secondWarehouse?.split(';') || []),
												]"
												:key="index"
												>{{ value }}<br
											/></span>
										</div>
									</el-popover>
								</div>
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="totalVolume" label="总体积" min-width="180">
					<template #default="{ row }"
						>{{ row.totalVolume || '---' }}(m³)</template
					>
				</el-table-column>
				<el-table-column prop="totalGrossWeight" label="总毛重" min-width="180">
					<template #default="{ row }"
						>{{ row.totalGrossWeight || '---' }}(kg)</template
					>
				</el-table-column>
				<el-table-column prop="totalNetWeight" label="总净重" min-width="180">
					<template #default="{ row }"
						>{{ row.totalNetWeight || '---' }}(kg)</template
					>
				</el-table-column>
				<el-table-column
					prop="loadingTime"
					label="物流实际装柜时间"
					width="180"
				>
					<template #default="{ row }">{{ row.loadingTime || '---' }}</template>
				</el-table-column>
				<el-table-column
					prop="estimatedDepartureTime"
					label="预计开船(云当)"
					width="180"
				>
					<template #default="{ row }">{{
						row.estimatedDepartureTime || '---'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="actualDepartureTime"
					label="实际开船"
					width="180"
				>
					<template #default="{ row }">{{
						row.actualDepartureTime || '---'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="estimatedArrivalTime"
					label="预计到港(云当)"
					width="180"
				>
					<template #default="{ row }">{{
						row.estimatedArrivalTime || '---'
					}}</template>
				</el-table-column>
				<el-table-column prop="actualArrivalTime" label="实际到港" width="180">
					<template #default="{ row }">{{
						row.actualArrivalTime || '---'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="containerPickupTime"
					label="提柜时间"
					width="180"
				>
					<template #default="{ row }">{{
						row.containerPickupTime || '---'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="totalGrossWeight"
					label="入库(第一目的仓)"
					min-width="300"
				>
					<template #default="{ row }">
						<el-row>
							<el-col :span="6">预计入库:</el-col>
							<el-col
								:span="18"
								:style="{
									textAlign: 'left',
								}"
								>{{ row.scheduledInboundTimeFirst || '---' }}</el-col
							>
						</el-row>
						<el-row>
							<el-col :span="6">实际入库:</el-col>
							<el-col
								:span="18"
								:style="{
									textAlign: 'left',
								}"
								>{{ row.actualInboundTimeFirst || '---' }}</el-col
							>
						</el-row>
					</template>
				</el-table-column>
				<el-table-column prop="transferOrderNo" label="调拨单号" width="180">
					<template #default="{ row }">{{
						row.transferOrderNo || '---'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="thirdWarehouseInboundNo"
					:label="t('三方仓入库单号')"
					width="180"
				>
					<template #default="{ row }">{{
						row.thirdWarehouseInboundNo || '---'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="lastMileAllocationNo"
					:label="t('尾程调拨单号')"
					width="180"
				>
					<template #default="{ row }">{{
						row.lastMileAllocationNo || '---'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="thirdWarehouseInboundNo"
					:label="t('平台填写预计送达时间')"
					width="180"
				>
					<template #default="{ row }">{{
						row.thirdWarehouseInboundNo || '---'
					}}</template>
				</el-table-column>
				<el-table-column prop="planIdTk" label="Plan ID(TK)" width="200">
					<template #default="{ row }">{{ row.planIdTk || '---' }}</template>
				</el-table-column>
				<el-table-column
					prop="scheduledDeliveryTimeToPlatformWarehouse"
					label="预约送平台仓时间"
					width="200"
				>
					<template #default="{ row }">{{
						row.scheduledDeliveryTimeToPlatformWarehouse || '---'
					}}</template>
				</el-table-column>
				<el-table-column
					prop="scheduledDeliveryTimeToPlatformWarehouse"
					label="实际送仓时间"
					width="200"
				>
					<template #default="{ row }">{{
						row.scheduledDeliveryTimeToPlatformWarehouse || '---'
					}}</template>
				</el-table-column>
				<el-table-column prop="isaNo" label="ISA NO" width="100">
					<template #default="{ row }">{{ row.isaNo || '---' }}</template>
				</el-table-column>
				<el-table-column :label="$t('common.action')" width="150" fixed="right">
					<template #default="{ row }">
						<div class="flex items-center">
							<el-button
								text
								type="primary"
								class="mr20"
								@click="openDialog('edit', row)"
								v-auth="'nextLogistics_edit'"
								>{{ $t('编辑') }}
							</el-button>
							<el-button
								text
								type="primary"
								class="mr20"
								@click="openDialog('log', row)"
								v-auth="'nextLogistics_log'"
								>{{ $t('日志') }}
							</el-button>
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
		<FormDialog
			ref="formDialog"
			:rowData="currentRow"
			:title="addDialogTitle"
			@save="getDataList"
		/>
		<!-- 日志对话框 -->
		<LogDialog
			v-model="logDialogVisible"
			:id="currentRow.id"
			:biz-type="['SECOND_MILE_LOGISTICS']"
			:showSearchForm="false"
			:showToolBar="false"
			@closeDialog="
				() => {
					logDialogVisible = false;
				}
			"
		/>
		<ImportDialog
			ref="importDialogRef"
			title="导入更新信息"
			templateUrl="/files/import-template/二程物流更新单导入模板.xlsx"
			excelUploadApi="/tracking/SecondMileLogistics/import"
			@refreshDataList="getDataList"
		/>
	</div>
</template>

<style scoped>
.el-table--default .el-table__cell {
	height: 60px;
}
.el-form-item--default .el-form-item__label {
	line-height: 18px;
	display: flex;
	justify-content: flex-end;
	align-items: center;
}
.expand-table {
	width: 85vw;
	margin: 10px;
	border-top: 1px solid #ebeef5;
	border-left: 1px solid #ebeef5;
	border-right: 1px solid #ebeef5;
	position: sticky;
	left: 0;
}
</style>
<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { reactive, ref, defineAsyncComponent } from 'vue';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { useI18n } from 'vue-i18n';
import {
	getSecondMileLogisticsPage,
	getSecondMileLogisticsExport,
	getSecondMileLogisticsExportContainer,
	getSecondMileLogisticsExportDetail,
	getSecondMileLogisticsById,
} from '/@/api/materialFlow/nextLogistics/index';
// 字典钩子
import {
	getPlatformList,
	getThirdformList,
} from '/@/api/materialFlow/headerTracker/index';
import { auth } from '/@/utils/authFunction';
import { useMessage } from '/@/hooks/message';
// 组件引入
const AdvancedSearchStyle = defineAsyncComponent(
	() => import('/@/components/TableFormModule/advanced-search-style.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
const FormDialog = defineAsyncComponent(
	() => import('./components/form-dialog.vue')
);
const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const ToolBar = defineAsyncComponent(
	() => import('/@/components/ToolBar/tool-bar.vue')
);
const LogDialog = defineAsyncComponent(
	() => import('/@/components/log/log-dialog.vue')
);
const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);
const SelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-input.vue')
);
const { t } = useI18n();

const showSearch = ref(true);
const logDialogVisible = ref(false);

// 初始化表单state，包括查询表单、分页、loading、数据列表、排序等、
// state.queryForm是获取数据的最重要的参数，实例中所有的表单数据都绑定到state.queryForm上，通过state.queryForm获取数据，然后获取新数据也是通过state.queryForm获取数据，
// state.dataList是获取的数据列表，初始化调用
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getSecondMileLogisticsPage,
	loading: false,
	dataList: [],
	ascs: [],
	descs: ['create_time'],
});
// 计算去重的平台列表
const getUniquePlatforms = (platformString: any) => {
	if (!platformString) return '---';
	//  Set 去重
	const uniquePlatforms = [...new Set(platformString?.split(';'))];
	return uniquePlatforms.join(', ');
};
// 4.初始化查询表单，包括查询表单的label、placeholder、type、options等
state.queryForm = {
	current: 1,
	size: 10,
	status: 1, // 默认启用
};
const tableRef = ref();
const resetQuery = () => {
	state.queryForm = {
		current: 1,
		size: 10,
		status: 1, // 默认启用
	};
	getDataList();
};

// 点击行展开
const clickRowHandle = async (row: any) => {
	if (row.isExpand) {
		row.isExpand = !row.isExpand;
	} else {
		// 初次展开设为true
		row.isExpand = true;
	}
	if (!row.isExpand) return;
};
// 获取筛选条件字典

const { dictMap } = useMultipleDicts(
	[
		{
			key: 'platformList',
			fetchFn: getPlatformList,
		}, // 查询平台仓库列表
		{
			key: 'thidformList',
			fetchFn: getThirdformList,
		}, // 查询三方平台仓库列表
	],
	{
		isAuto: true, // 是否自动获取字典
		tableRef, // 传入tableRef以便在表格加载完成后获取字典
	}
);

// 5.把创建的state传入hook的useTable方法，hook会自动处理hook内部逻辑（初始化state.dataList），并返回对应的一些例如获取新数据方法(getDataList)
const {
	getDataList,
	sortChangeHandle,
	sizeChangeHandle,
	tableStyle,
	currentChangeHandle,
} = useTable(state, tableRef);

// 选中的行数据
const selectedRows = ref<any[]>([]);
// 导入的引用
const importDialogRef = ref();
const exportApiMap: Record<string, Function> = {
	export: getSecondMileLogisticsExport,
	exportCabinet: getSecondMileLogisticsExportContainer,
	exportDetail: getSecondMileLogisticsExportDetail,
};
// 导出
const handleExport = async (type: string = 'export') => {
	try {
		const ids = selectedRows.value.map((item: any) => item.id);

		// 显示加载状态
		state.loading = true;
		// debugger
		const api = exportApiMap[type];
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await api({
			...state.queryForm,
			ids: ids.length > 0 ? ids : undefined,
			// ascs: state?.ascs,
			// descs: state?.descs,
			// pageNum: 1,
			// pagesize: 10000,
		});
	} catch (error) {
		useMessage().error(error as string);
	} finally {
		// 隐藏加载状态
		state.loading = false;
	}
};

// 弹窗方法
const currentRow = ref({
	id: '',
});
const formDialog = ref();
const addDialogTitle = ref('');
const openDialog = async (type: string, row?: any) => {
	if (type === 'add') {
		currentRow.value = {
			id: '',
		};
		addDialogTitle.value = '添加二程单';
		formDialog.value.handleOpen(currentRow.value);
	} else if (type === 'edit') {
		const res = await getSecondMileLogisticsById({ id: row.id });
		if (res.code !== 0) {
			useMessage().error(res.msg || '获取数据失败');
			return;
		}
		currentRow.value = { ...res.data };
		addDialogTitle.value = '编辑二程单';
		formDialog.value.handleOpen(currentRow.value);
	} else if (type === 'log') {
		logDialogVisible.value = true;
		currentRow.value = row;
	} else if (type === 'upData') {
		importDialogRef.value.show();
	}
};
</script>
