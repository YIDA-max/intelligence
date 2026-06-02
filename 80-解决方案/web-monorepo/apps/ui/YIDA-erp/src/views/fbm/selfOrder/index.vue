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
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="dicts"
									:settings="{
										text: '平台渠道',
										code: 'platformChannelCodes',
										searchFn: changePlatformChannelCodes,
										getTreeDataParams: 'platform_channel',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="country"
									:settings="{
										text: '站点/国家',
										code: 'siteCodes',
										searchFn: changeSiteCodes,
									}"
								/>
							</el-form-item>
							<el-form-item>
								<el-select
									collapse-tags
									:max-collapse-tags="1"
									clearable
									filterable
									multiple
									v-model="state.queryForm.storeIds"
									@change="getDataList"
									placeholder="店铺"
									style="width: 200px"
								>
									<el-option
										v-for="item in storeOptionsForQuery"
										:key="item.id"
										:label="`[${item.platformChannelCode}]${item.storeName}:${item.siteCode}`"
										:value="item.id"
									/>
								</el-select>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="dicts"
									:settings="{
										text: '状态',
										code: 'orderStatusList',
										searchFn: getDataList,
										getTreeDataParams: 'self_order_states',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<!-- 自营仓+三方仓+平台仓 -->
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="warehouseQianyi"
									:settings="{
										text: '发货仓',
										code: 'designatedWarehouses',
										searchFn: getDataList,
										getTreeDataParams: {
											warehouseTypes: [1, 3],
											status: 1,
										},
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="logisticsChannel"
									:settings="{
										text: '物流渠道',
										code: 'logisticsCodes',
										searchFn: getDataList,
										getTreeDataParams: {
											current: 1,
											size: 1000000000000,
											statuses: [1],
										},
									}"
								/>
							</el-form-item>
							<el-form-item>
								<div class="flex item-center">
									<SelectInput
										v-model:queryForm="state.queryForm"
										:searchTypes="[
											{
												label: '平台订单号',
												value: 'platformOrderNos',
											},
											{
												label: '系统订单号',
												value: 'selfOrderNos',
											},
											{
												label: '跟踪号',
												value: 'logisticsTrackingNos',
											},
											{
												label: '运单号',
												value: 'waybillNos',
											},
											{
												label: '仓库单号',
												value: 'warehouseOrderNos',
											},
										]"
										isInputCangeSearch
										:settings="{ selectStyle: { width: '150px' } }"
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
												label: 'SKU',
												value: 'skuList',
											},
											{
												label: 'MSKU',
												value: 'mskuList',
											},
										]"
										isInputCangeSearch
										:getDataList="getDataList"
									/>
								</div>
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
												isAddHMS: true,
												dateStart: 'createTimeStart',
												dateEnd: 'createTimeEnd',
												defaultMonthsAgo: 1,
											},
											{
												label: '最晚发货时间',
												value: 'latestShippingTime',
												isAddHMS: true,
												dateStart: 'latestShippingTimeStart',
												dateEnd: 'latestShippingTimeEnd',
											},
											{
												label: '发货时间',
												value: 'shippingTime',
												isAddHMS: true,
												dateStart: 'shippingTimeStart',
												dateEnd: 'shippingTimeEnd',
											},
										]"
										:getDataList="getDataList"
									/>
								</div>
							</el-form-item>
							<el-form-item>
								<div>
									<el-select
										v-model="state.queryForm.calStatus"
										placeholder="物流费试算状态"
										style="width: 150px"
										multiple
										collapse-tags
										:max-collapse-tags="1"
										filterable
										@change="getDataList"
										clearable
									>
										<el-option
											v-for="value in [
												{
													label: '未试算',
													value: 0,
												},
												{
													label: '成功',
													value: 1,
												},
												{
													label: '失败',
													value: 2,
												},
											]"
											:label="value.label"
											:value="value.value"
											:key="value.value"
										/>
									</el-select>
								</div>
							</el-form-item>
						</template>
						<template #second>
							<el-form-item>
								<div class="flex item-center">
									<el-select
										v-model="state.queryForm.tagType"
										filterable
										placeholder="是否包含"
										style="width: 100px"
									>
										<el-option
											v-for="item in [
												{
													id: '1',
													name: '包含',
												},
												{
													id: '0',
													name: '不包含',
												},
											]"
											:key="item.id"
											:label="item.name"
											:value="item.id"
										/>
									</el-select>
									<TreeSelectInputApi
										v-model:queryForm="state.queryForm"
										componentType="orderTag"
										:settings="{
											text: '订单标签',
											code: 'tags',
											searchFn: getDataList,
										}"
									/>
								</div>
							</el-form-item>
							<el-form-item>
								<!-- // 订单来源枚举映射 -->
								<el-select
									v-model="state.queryForm.orderFroms"
									clearable
									filterable
									multiple
									collapse-tags
									:max-collapse-tags="1"
									placeholder="订单来源"
									style="width: 200px"
									@change="getDataList"
								>
									<el-option
										v-for="item in [
											{
												label: '手工',
												value: 1,
											},
											{
												label: '接口',
												value: 2,
											},
											{
												label: '开放接口',
												value: 3,
											},
											{
												label: '导入',
												value: 4,
											},
											{
												label: '积加同步',
												value: 5,
											},
										]"
										:key="item.value"
										:label="item.label"
										:value="Number(item.value)"
									/>
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-input
									v-model="state.queryForm.platformOrderTag"
									placeholder="平台订单标签"
									@blur="getDataList"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="country"
									:settings="{
										text: '收件人国家',
										code: 'countryCodeList',
										searchFn: getDataList,
									}"
								/>
							</el-form-item>
							<el-form-item>
								<el-tree-select
									@blur="getDataList"
									v-model="state.queryForm.deptIdList"
									placeholder="运营小组"
									show-checkbox
									fit-input-width
									clearable
									multiple
									collapse-tags
									:max-collapse-tags="1"
									style="width: 200px"
									filterable
									:props="{
										children: 'children',
										label: 'name',
										value: 'id',
									}"
									:node-key="'id'"
									:data="dictMap.deptTree"
								>
								</el-tree-select>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="userList"
									:settings="{
										text: '运营人员',
										code: 'operationIds',
										searchFn: getDataList,
										getTreeDataParams: { lockFlag: 0 },
									}"
								/>
							</el-form-item>
							<el-form-item>
								<el-select
									v-model="state.queryForm.deliveryMethod"
									clearable
									filterable
									placeholder="订单配送方式"
									style="width: 150px"
									@change="getDataList"
								>
									<!-- 订单配送方式,1:自配送 2：转FBA配送 -->
									<el-option
										v-for="item in [
											{
												id: '1',
												name: '自配送',
											},
											{
												id: '2',
												name: '转FBA配送',
											},
										]"
										:key="item.id"
										:label="item.name"
										:value="item.id"
									/>
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-select
									v-model="state.queryForm.resendOrder"
									clearable
									filterable
									placeholder="是否补发"
									style="width: 150px"
									@change="getDataList"
								>
									<!-- 是否补发,1:是 0：否 -->
									<el-option
										v-for="item in [
											{
												id: '1',
												name: '是',
												value: 1,
											},
											{
												id: '0',
												name: '否',
												value: 0,
											},
										]"
										:key="item.id"
										:label="item.name"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-select
									v-model="state.queryForm.stopHandlerFlag"
									clearable
									filterable
									placeholder="是否禁止"
									style="width: 150px"
									@change="getDataList"
								>
									<el-option
										v-for="item in [
											{ id: '1', name: '是', value: 1 },
											{ id: '0', name: '否', value: 0 },
										]"
										:key="item.id"
										:label="item.name"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-select
									v-model="state.queryForm.abnormalOrderFlag"
									clearable
									filterable
									placeholder="是否异常订单"
									style="width: 150px"
									@change="getDataList"
								>
									<el-option
										v-for="item in [
											{ id: '1', name: '是', value: 1 },
											{ id: '0', name: '否', value: 0 },
										]"
										:key="item.id"
										:label="item.name"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-select
									v-model="state.queryForm.markStatusList"
									clearable
									filterable
									multiple
									collapse-tags
									:max-collapse-tags="1"
									placeholder="标发状态"
									style="width: 150px"
									@change="getDataList"
								>
									<el-option
										v-for="item in dictMap.selfMarkStatus"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
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
				<ToolBar
					@handleRefresh="getDataList"
					@handle-export="handleExport"
					:is-show-export="auth('selfOrder-export')"
				>
					<template #left-tool>
						<el-dropdown
							class="ml10"
							split-button
							v-if="auths(['selfOrder-addItem', 'selfOrder-import'])"
						>
							<span>{{ $t('新增订单') }}</span>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item
										@click="
											() => {
												openDialog('addItem');
											}
										"
										v-if="auth('selfOrder-addItem')"
									>
										{{ $t('新增自发货') }}
									</el-dropdown-item>
									<el-dropdown-item
										@click="
											() => {
												importDialogRef.show();
											}
										"
										v-if="auth('selfOrder-import')"
									>
										{{ $t('导入自发货') }}
									</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
						<el-dropdown
							class="ml10"
							split-button
							v-if="
								auths([
									'selfOrder-orderConfirm',
									'selfOrder-shippingReview',
									'selfOrder-orderShipped',
									'selfOrder-pushThirdWarehouses',
									'selfOrder-combineOrder',
									'selfOrder-cutoffOrder',
									'selfOrder-invalidOrder',
									'selfOrder-dischargeProhibition',
								])
							"
						>
							<span>{{ $t('订单处理') }}</span>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item
										@click="
											() => {
												openDialog('orderConfirm');
											}
										"
										v-if="auth('selfOrder-orderConfirm')"
									>
										{{ $t('接单确认') }}
									</el-dropdown-item>
									<el-dropdown-item
										@click="
											() => {
												openDialog('shippingReview');
											}
										"
										v-if="auth('selfOrder-shippingReview')"
									>
										{{ $t('发货审核') }}
									</el-dropdown-item>
									<el-dropdown-item
										@click="
											() => {
												openDialog('orderShipped');
											}
										"
										v-if="auth('selfOrder-orderShipped')"
									>
										{{ $t('确认发货') }}
									</el-dropdown-item>
									<el-dropdown-item
										@click="
											() => {
												openDialog('pushThirdWarehouses');
											}
										"
										v-if="auth('selfOrder-pushThirdWarehouses')"
									>
										{{ $t('推单至三方仓') }}
									</el-dropdown-item>
									<el-dropdown-item
										@click="
											() => {
												openDialog('combineOrder');
											}
										"
										v-if="auth('selfOrder-combineOrder')"
									>
										{{ $t('合并订单') }}
									</el-dropdown-item>
									<el-dropdown-item
										@click="
											() => {
												openDialog('cutoffOrder');
											}
										"
										v-if="auth('selfOrder-cutoffOrder')"
									>
										{{ $t('截单') }}
									</el-dropdown-item>
									<el-dropdown-item
										@click="
											() => {
												openDialog('dischargeProhibition');
											}
										"
										v-if="auth('selfOrder-dischargeProhibition')"
									>
										{{ $t('解除禁止') }}
									</el-dropdown-item>
									<el-dropdown-item
										@click="
											() => {
												openDialog('invalidOrder');
											}
										"
										v-if="auth('selfOrder-invalidOrder')"
									>
										{{ $t('作废') }}
									</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
						<el-dropdown
							class="ml10"
							split-button
							v-if="
								auths([
									'selfOrder-markShipment',
									'selfOrder-addItem',
									'selfOrder-setTag',
									'selfOrder-stopProcess',
									'selfOrder-updateMskuMatch',
									'selfOrder-executebyWarehouseRule',
									'selfOrder-logisticsInformation',
									'selfOrder-shipToFBA',
									'selfOrder-recalculation',
									'selfOrder-exportSelfOrderFee',
									'selfOrder-setWareAndLogistics',
									'selfOrder-setWareAndLogisticsToSku',
									'selfOrder-fixInfo',
								])
							"
						>
							<span>{{ $t('更多操作') }}</span>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item
										@click="
											() => {
												openDialog('markTag');
											}
										"
										v-if="auth('selfOrder-setTag')"
									>
										{{ $t('标记标签(批量)') }}
									</el-dropdown-item>
									<el-dropdown-item
										@click="
											() => {
												openDialog('batchDisable');
											}
										"
										v-if="auth('selfOrder-stopProcess')"
									>
										{{ $t('批量禁止处理') }}
									</el-dropdown-item>
									<el-dropdown-item
										@click="
											() => {
												openDialog('updateMskuMatch');
											}
										"
										v-if="auth('selfOrder-updateMskuMatch')"
									>
										{{ $t('更新MSKU配对') }}
									</el-dropdown-item>
									<el-dropdown-item
										@click="
											() => {
												openDialog('executebyWarehouseRule');
											}
										"
										v-if="auth('selfOrder-executebyWarehouseRule')"
									>
										{{ $t('按仓库规则执行') }}
									</el-dropdown-item>
									<!-- <el-dropdown-item
										@click="
											() => {
												openDialog('updateThirdWarehouseMskuMatch');
											}
										"
									>
										{{ $t('更新三方仓SKU配对') }}
									</el-dropdown-item> -->
									<el-dropdown-item
										@click="
											() => {
												openDialog('logisticsInformation');
											}
										"
										v-if="auth('selfOrder-logisticsInformation')"
									>
										{{ $t('上传物流信息') }}
									</el-dropdown-item>
									<el-dropdown-item
										@click="
											() => {
												openDialog('markShipment');
											}
										"
										v-if="auth('selfOrder-markShipment')"
									>
										{{ $t('标记发货(批量)') }}
									</el-dropdown-item>
									<el-dropdown-item
										@click="
											() => {
												openDialog('allShipToFBA');
											}
										"
										v-if="auth('selfOrder-shipToFBA')"
									>
										{{ $t('批量转FBA发货') }}
									</el-dropdown-item>
									<el-dropdown-item
										@click="
											() => {
												openDialog('recalculation');
											}
										"
										v-if="auth('selfOrder-recalculation')"
									>
										{{ $t('重新计算费用') }}
									</el-dropdown-item>
									<el-dropdown-item
										@click="
											() => {
												openDialog('recalculationRetry');
											}
										"
										v-if="auth('selfOrder-recalculationRetry')"
									>
										{{ $t('物流下单重试') }}
									</el-dropdown-item>
									<el-dropdown-item
										@click="handleExportDetail"
										v-if="auth('selfOrder-exportSelfOrderFee')"
									>
										{{ $t('导出费用明细') }}
									</el-dropdown-item>
									<el-dropdown-item
										@click="
											() => {
												openDialog('batchSetWareAndLogistics');
											}
										"
										v-if="auth('selfOrder-setWareAndLogistics')"
									>
										{{ $t('批量设定仓库物流') }}
									</el-dropdown-item>
									<el-dropdown-item
										@click="
											() => {
												openDialog('setWareAndLogisticsToSku');
											}
										"
										v-if="auth('selfOrder-setWareAndLogisticsToSku')"
									>
										{{ $t('批量设置仓库物流（只按SKU）') }}
									</el-dropdown-item>
									<el-dropdown-item
										@click="
											() => {
												openDialog('setOperation');
											}
										"
										v-if="auth('selfOrder-setOperation')"
									>
										{{ $t('设置运营人和运营小组') }}
									</el-dropdown-item>
									<el-dropdown-item
										@click="
											() => {
												openDialog('fixSelfOrderInfo');
											}
										"
										v-if="auth('selfOrder-fixInfo')"
									>
										{{ $t('更新SKU尺寸重量') }}
									</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</template>
				</ToolBar>
			</el-row>
			<!-- 状态列表 -->
			<div>
				<StatusList ref="statusListRef" />
				<div ref="tableContainerRef">
					<vxe-table
						:data="state.dataList"
						style="width: 100%"
						ref="tableRef"
						:cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle"
						:row-config="{
							keyField: 'id',
							isHover: true,
						}"
						:cell-config="{
							height: 48,
						}"
						:checkbox-config="{
							reserve: true,
							highlight: true,
						}"
						:virtual-y-config="{
							enabled: true,
						}"
						:height="tableHeight"
						:span-method="arraySpanMethod"
						@sort-change="handleVxeSortChange"
						@checkbox-change="handleCheckboxChange"
						@checkbox-all="handleCheckboxChange"
						@toggle-row-expand="handleToggleRowExpand"
						@row-click="({ row }: any) => {
						currentRow = row;
					}"
						native-scrollbar
					>
						<vxe-column type="checkbox" width="40" fixed="left" />
						<vxe-column :title="t('订单明细')" min-width="700">
							<template #default="{ row }">
								<div class="min-w-0 w-full">
									<TableHeaderOrderInfo :currentRow="row" />
								</div>
							</template>
						</vxe-column>
						<vxe-column :title="t('订单金额')" min-width="250">
							<template #default="{ row }">
								<TableHeaderOrderMoney :currentRow="row" />
							</template>
						</vxe-column>
						<vxe-column :title="t('时间')" min-width="200">
							<template #default="{ row }">
								<TableHeaderOrderTime :currentRow="row" />
							</template>
						</vxe-column>
						<vxe-column :title="t('发货信息')" min-width="50">
							<template #default="{ row }">
								<el-row>
									<el-col :span="0">
										<TableHeaderOrderDeliveryInformation :currentRow="row" />
									</el-col>
									<el-col :span="18">
										<TableHeaderOrderStatus :currentRow="row" />
									</el-col>
									<el-col :span="6">
										<TableHeaderAction :currentRow="row" />
									</el-col>
								</el-row>
							</template>
						</vxe-column>
						<!-- 下面两列保留：用于 span-method 合并显示（逻辑保持不变） -->
						<vxe-column :title="t('状态')" min-width="130" />
						<vxe-column :title="$t('common.action')" min-width="60" />
						<vxe-column type="expand" width="50" class-name="expand-column">
							<template #content="{ row }">
								<div
									v-if="expandedRowIds.has(row.id)"
									class="expand-wrapper"
									@click="updateCurrentRow(row)"
								>
									<ExpandLazy :row-key="row.id">
										<div class="expand-table">
											<div class="expand-table-row">
												<div
													class="expand-table-cell"
													style="flex: 750 1 0; min-width: 0"
												>
													<ExpandOrderInfo :currentRow="row" />
												</div>
												<div
													class="expand-table-cell"
													style="flex: 150 1 0; min-width: 0"
												>
													<ExpandOrderMoney :currentRow="row" />
												</div>
												<div
													class="expand-table-cell"
													style="flex: 150 1 0; min-width: 0"
												>
													<ExpandOrderTime :currentRow="row" />
												</div>
												<div
													class="expand-table-cell"
													style="flex: 200 1 0; min-width: 0"
												>
													<ExpandOrderDeliveryInformation :currentRow="row" />
												</div>
												<div
													class="expand-table-cell"
													style="flex: 50 1 0; min-width: 0"
												>
													<ExpandOrderStatus :currentRow="row" />
												</div>
												<div
													class="expand-table-cell"
													style="flex: 50 1 0; min-width: 0"
												>
													<ExpandOrderAction :currentRow="row" />
												</div>
											</div>
										</div>
									</ExpandLazy>
								</div>
							</template>
						</vxe-column>
					</vxe-table>
				</div>
				<pagination
					@current-change="currentChangeHandle"
					@size-change="sizeChangeHandle"
					v-bind="state.pagination"
					ref="paginationRef"
				/>
			</div>
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
		<!-- 合单弹窗 -->
		<CombineOrder ref="combineOrderRef" />
		<!-- 截单弹窗 -->
		<CutoffOrder ref="cutoffOrderRef" />
		<!-- 新增自发货订单 -->
		<AddItem ref="addItemRef" />
		<!-- 导入新增自发货订单 -->
		<ImportDialog
			ref="importDialogRef"
			title="导入新增自发货订单"
			templateUrl="/files/import-template/批量新增自发货订单.xlsx"
			excelUploadApi="/fbm/selfOrder/importSelfOrder"
			@refreshDataList="getDataList"
		/>
		<!-- 批量转FBA发货 -->
		<AllShipToFBA ref="allShipToFBARef" />
		<!-- 批量设定仓库物流 -->
		<SetWareAndLogistics
			ref="setWareAndLogisticsRef"
			isBatch
			:selectedRows="selectedRows"
		/>
		<!-- 批量设定仓库物流（只按SKU） -->
		<SetWareAndLogisticsToSku
			ref="setWareAndLogisticsToSkuRef"
			:selectedRows="selectedRows"
		/>
		<!-- 设置运营人和运营小组 -->
		<SetOperation ref="setOperationRef" />
		<!-- 上传物流信息  -->
		<ImportDialog
			ref="logisticsInformationRef"
			title="导入物流信息"
			templateUrl="/files/import-template/导入物流信息.xlsx"
			excelUploadApi="/fbm/selfOrder/importLogisticsInfo"
			@refreshDataList="getDataList"
		/>
		<EditTag
			ref="batchEditTagRef"
			:value="batchTagIds"
			@submit="handleBatchEditTag"
			style="display: none"
		/>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from './hooks/table';
import { useI18n } from 'vue-i18n';
import {
	defineAsyncComponent,
	ref,
	reactive,
	computed,
	watch,
	nextTick,
	onMounted,
	onUnmounted,
} from 'vue';
import { useMessage } from '/@/hooks/message';
import { getDicts } from '/@/api/admin/dict';
import { deptTree } from '/@/api/admin/dept';
import { getTagAllList } from '/@/api/components/editTag';
import { getListByCondition as getListByConditionStore } from '/@/api/mcp/collectionPlan/index';
import { getListByCondition as baseCurrency } from '/@/api/purchase/supplierSku/index';
import { getListByCondition } from '/@/api/materialFlow/deliveryPlan/index';
import {
	getSelfOrderPage,
	getLogisticsChannelList,
} from '/@/api/fbm/selfOrder/index';
import { getWareHouseList } from '/@/api/materialFlow/track/index';
import { getUserListByCondition } from '/@/api/admin/user';
import { sysCountryList } from '/@/api/materialFlow/track';
import { getCountryList } from '/@/api/warehouse/warehouse/index';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { getWarehouseListByCondition } from '/@/api/mcp/collectionPlan/index';
import { getWarehouseInfoList } from '/@/api/warehouse/third-warehouse/index';
import {
	postOrderShipped,
	postOrderConfirm,
	postShippingReview,
	postOrderInvalid,
	postPushWms,
	markShipped,
	postBatchUpdateOrderTag,
	postBatchStopHandlerOrder,
	releaseStopHandlerOrder,
	getExportSelfOrder,
	getExportSelfOrderFee,
	updateMskuPairing,
	executeWarehouseRules,
	updateThirdPartySkuPairing,
	putRecalculation,
	postRecalculationRetry,
	postFixSelfOrderInfo,
} from '/@/api/fbm/selfOrder/index';
import { useResultDialog } from '/@/hooks/useResultDialog';
import { ElMessageBox } from 'element-plus';
import { useRoute } from 'vue-router';
import { auth, auths } from '/@/utils/authFunction';
import ExpandLazy from '/@/components/ExpandLazy/index.vue';

const { open } = useResultDialog();
const { t } = useI18n();
const route = useRoute();
// import { ElMessageBox } from 'element-plus';
// import { useResultDialog } from '/@/hooks/useResultDialog';
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
// TreeSelectInputApi 组件
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
// 展开行的的操作组件
const ExpandOrderAction = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/tableColumnExpand/expand-order-action/index.vue'
		)
);
// 展开行的订单信息组件
const ExpandOrderDeliveryInformation = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/tableColumnExpand/expand-order-delivery-information/index.vue'
		)
);
// 展开行的订单金额组件
const ExpandOrderMoney = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/tableColumnExpand/expand-order-money/index.vue'
		)
);
// 展开行的订单信息组件
const ExpandOrderInfo = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/tableColumnExpand/expand-order-info/index.vue'
		)
);
// 展开行的订单状态组件
const ExpandOrderStatus = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/tableColumnExpand/expand-order-states/index.vue'
		)
);
// 展开行的时间组件
const ExpandOrderTime = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/tableColumnExpand/expand-order-time/index.vue'
		)
);
// tabele头部的操作组件s
const TableHeaderAction = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/tableColumnHeader/header-order-action/index.vue'
		)
);
// tabele头部的订单信息组件
const TableHeaderOrderInfo = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/tableColumnHeader/header-order-info/index.vue'
		)
);
// tabele头部的订单金额组件
const TableHeaderOrderMoney = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/tableColumnHeader/header-order-money/index.vue'
		)
);
// tabele头部的订单时间组件
const TableHeaderOrderTime = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/tableColumnHeader/header-order-time/index.vue'
		)
);
// tabele头部的订单状态组件
const TableHeaderOrderStatus = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/tableColumnHeader/header-order-states/index.vue'
		)
);
// tabele头部的发货信息组件
const TableHeaderOrderDeliveryInformation = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/tableColumnHeader/header-order-delivery-information/index.vue'
		)
);
//合单弹窗
const CombineOrder = defineAsyncComponent(
	() =>
		import('/@/views/fbm/selfOrder/components/toolBar/combineOrder/index.vue')
);
//截单弹窗
const CutoffOrder = defineAsyncComponent(
	() =>
		import('/@/views/fbm/selfOrder/components/toolBar/cutoffOrder/index.vue')
);
// 状态列表
const StatusList = defineAsyncComponent(
	() => import('/@/views/fbm/selfOrder/components/statesList/index.vue')
);
// 新增自发货订单
const AddItem = defineAsyncComponent(
	() => import('/@/views/fbm/selfOrder/components/toolBar/addItem/index.vue')
);
// 导入新增自发货订单
const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);
// 批量转FBA发货
const AllShipToFBA = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/toolBar/all-ship-to-FBA/index.vue'
		)
);
// 设定仓库物流
const SetWareAndLogistics = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/tableColumnExpand/expand-order-action/setWareAndLogistics/index.vue'
		)
);
// 批量设定仓库物流（只按SKU）
const SetWareAndLogisticsToSku = defineAsyncComponent(
	() =>
		import(
			'/@/views/fbm/selfOrder/components/toolBar/setWareAndLogisticsToSku/index.vue'
		)
);
// 设置运营人和运营小组
const SetOperation = defineAsyncComponent(
	() =>
		import('/@/views/fbm/selfOrder/components/toolBar/setOperation/index.vue')
);
const EditTag = defineAsyncComponent(
	() => import('/@/components/EditTag/index.vue')
);

//合单弹窗引用
const combineOrderRef = ref();
//截单弹窗引用
const cutoffOrderRef = ref();
// 新增自发货订单引用
const addItemRef = ref();
// 导入新增自发货订单引用
const importDialogRef = ref();
// 批量转FBA发货引用
const allShipToFBARef = ref();
// 设定仓库物流的引用
const setWareAndLogisticsRef = ref();
// 批量设定仓库物流（只按SKU）的引用
const setWareAndLogisticsToSkuRef = ref();
// 设置运营人和运营小组引用
const setOperationRef = ref();
// 上传物流信息引用
const logisticsInformationRef = ref();
// 批量标记标签引用
const batchEditTagRef = ref();
// 批量标记标签默认值
const batchTagIds = ref<Array<any>>([]);
// const { open } = useResultDialog();
// table的引用;
const tableRef = ref();
// table 容器引用
const tableContainerRef = ref();
// 分页组件引用
const paginationRef = ref();
// 表格高度
const tableHeight = ref<number | string>(500);
const { dictMap } = useMultipleDicts(
	[
		{
			key: 'deptTree',
			fetchFn: deptTree,
			params: {
				deptName: '运营中心',
				showRootFlag: 0, // 是否显示根节点 1是展示 0不展示
			},
		}, // 部门树
		{
			key: 'countryList',
			fetchFn: sysCountryList,
		}, // 国家列表

		{
			key: 'selfOrderStates',
			fetchFn: getDicts,
			params: 'self_order_states',
		}, // 头程状态
		{
			key: 'storeList',
			fetchFn: getListByConditionStore,
		}, // 店铺
		{
			key: 'getTagAllList',
			fetchFn: getTagAllList,
		}, // 订单标签
		{
			key: 'shippingMethod',
			fetchFn: getDicts,
			params: 'shipping_method',
		}, // 发货方式
		{
			key: 'containerType',
			fetchFn: getDicts,
			params: 'container_type',
		}, // 柜型类型
		{
			key: 'transportMethod',
			fetchFn: getDicts,
			params: 'transport_method',
		}, // 运输方式
		{
			key: 'productManageId',
			fetchFn: getUserListByCondition,
			params: { lockFlag: 0 },
		}, // 人员列表
		{
			key: 'warehouseListType',
			fetchFn: getWarehouseListByCondition,
			params: {
				warehouseTypes: [1, 3], // 1自营仓 2平台仓 3三方仓 4虚拟仓
				status: 1,
			},
		}, // 查询自营仓+三方仓+平台仓库
		{
			key: 'listByCondition',
			fetchFn: getListByCondition,
		}, // 国家港口列表
		{
			key: 'warehouseList',
			fetchFn: getWarehouseInfoList,
		}, // 三方仓仓库列表
		{
			key: 'logisticsChannelList',
			fetchFn: getLogisticsChannelList,
			params: { current: 1, size: 1000000000000, statuses: [1] },
		}, // 物流渠道列表

		{
			key: 'warehouseListByType',
			fetchFn: getWareHouseList,
			params: { excludeCountryTwoCodeList: ['CN'] }, // 排除国家二字码集合
		}, // 仓库列表
		{
			key: 'platformChannel',
			fetchFn: getDicts,
			params: 'platform_channel',
		}, // 平台 渠道
		{
			key: 'sysAreaCountryList',
			fetchFn: getCountryList,
			params: {
				parentCode: '0',
			},
		}, // 国家列表有省市区的
		{
			key: 'baseCurrency',
			fetchFn: baseCurrency,
		}, // 基础币种
		{
			key: 'selfMarkStatus',
			fetchFn: getDicts,
			params: 'self_mark_status',
		}, // 自发货标发状态
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
const AdvancedSearchStyleRef = ref();
// 状态列表引用
const statusListRef = ref();
// 当前选中的行
const selectedRows = ref<Array<any>>([]);

// 已展开的行 ID 集合（用于条件渲染优化性能）
const expandedRowIds = ref<Set<string | number>>(new Set());

// 计算表格可用高度
const calculateTableHeight = () => {
	nextTick(() => {
		try {
			// 获取窗口高度
			const windowHeight = window.innerHeight;

			// 获取 table 容器距离页面顶部的距离
			const tableContainerRect =
				tableContainerRef.value?.getBoundingClientRect();
			if (!tableContainerRect) {
				tableHeight.value = 500;
				return;
			}

			// 计算其他元素的高度
			let otherHeight = 0;

			// 分页组件高度
			if (paginationRef.value?.$el) {
				otherHeight += (paginationRef.value.$el.offsetHeight || 0) + 20;
			}

			// 计算可用高度 = 窗口高度 - table 容器距离顶部距离 - 其他元素高度 - 底部边距
			const padding = 20; // 底部边距
			const availableHeight =
				windowHeight - tableContainerRect.top - otherHeight - padding;

			// 设置最小高度，避免表格太小
			if (availableHeight > 300) {
				tableHeight.value = availableHeight;
			} else {
				tableHeight.value = 300; // 最小高度
			}
		} catch (error) {
			// 计算表格高度失败时，使用默认值
			tableHeight.value = 500;
		}
	});
};

// 监听窗口大小变化
let resizeObserver: ResizeObserver | null = null;
const handleResize = () => {
	calculateTableHeight();
};

// 当前点击的行
const currentRow = ref({
	id: '',
	shipmentQuantity: 10,
});
// 传递当前行
provide('currentRow', currentRow);
// 可选：如果你想更可控，也可以提供一个修改方法
const updateCurrentRow = (row: any) => {
	currentRow.value = row;
};
// 日志对话框是否可见
const logDialogVisible = ref(false);
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		tagType: '1', // 是否包含 0不包含 1包含
		/** 禁止处理标识 1-是，0-否 */
		stopHandlerFlag: null,
		/** 异常订单标识 1-是，0-否 */
		abnormalOrderFlag: null,
	},
	pagination: {
		current: 1,
		size: 10,
		total: 0,
		pageSizes: [10, 20, 50, 100, 200, 500, 1000],
		layout: 'total, sizes, prev, pager, next, jumper',
	},
	pageList: getSelfOrderPage,
	loading: false,
	createdIsNeed: false,
	defaultExpandAll: true,
	dataList: [],
	ascs: [],
	descs: ['create_time', 'self_order_no'],
});

//  table hook
const {
	getDataList: getData,
	query,
	currentChangeHandle,
	sizeChangeHandle,
	sortChangeHandle,
	tableStyle,
} = useTable(state, tableRef);

// vxe-table 默认展开：每次数据变化后，自动展开所有行
watch(
	() => state.dataList,
	async (list) => {
		if (!state.defaultExpandAll) return;
		if (!list || list.length === 0) {
			expandedRowIds.value = new Set();
			return;
		}
		await nextTick();
		// vxe-table 展开行 API
		tableRef.value?.setAllRowExpand?.(true);
		// 同步展开状态（整体替换 Set，保证模板依赖更新）
		expandedRowIds.value = new Set(
			list.map((row: { id: string | number }) => row.id)
		);
	},
	{ deep: false }
);
// 修改当前行的方法
provide('updateCurrentRow', updateCurrentRow);
// 传递字典
provide('dictMap', dictMap);
// 刷新数据的方法
provide('getDataList', async (isQueryStatusCount: boolean = true) => {
	await query();
	if (isQueryStatusCount) {
		statusListRef.value.changeGetSelfOrderStatusCount(state.queryForm);
	}
});

// 传递表格引用
provide('tableRef', tableRef);

// 传递截单组件引用
provide('cutoffOrderRef', cutoffOrderRef);
// 传递合单组件引用
provide('combineOrderRef', combineOrderRef);
// 传递筛选条件
provide('queryForm', state.queryForm);

// 监听 AdvancedSearchStyle 的展开/收起状态
watch(
	() => AdvancedSearchStyleRef.value?.showSecond,
	() => {
		// 高级搜索展开/收起时，重新计算高度
		calculateTableHeight();
	}
);

// 监听数据加载完成，重新计算高度
watch(
	() => state.loading,
	(newVal, oldVal) => {
		// 从加载中变为加载完成时，重新计算高度
		if (oldVal === true && newVal === false) {
			nextTick(() => {
				calculateTableHeight();
			});
		}
	}
);

/**
 * 刷新数据的方法
 */
const getDataList = async () => {
	// 在查询之前，先清空选中数据 产品要求的，就这个页面这样做！
	tableRef.value?.clearCheckboxRow();
	// 重新获取状态数量
	statusListRef.value.watchGetSelfOrderStatusCount(state.queryForm);
	await getData();
};

// 页面初始化时处理URL参数
onMounted(async () => {
	const platformOrderNos = route.query.platformOrderNos as string | undefined;
	if (platformOrderNos) {
		if (platformOrderNos.includes(',')) {
			// 逗号分隔的字符串，转换为数组
			state.queryForm.platformOrderNos = platformOrderNos
				.split(',')
				.map((item) => item.trim())
				.filter((item) => item);
		} else {
			// 单个值，包装成数组
			state.queryForm.platformOrderNos = [platformOrderNos];
		}
		getDataList();
	}

	// 初始化表格高度
	calculateTableHeight();

	// 监听窗口大小变化
	window.addEventListener('resize', handleResize);

	// 使用 ResizeObserver 监听容器大小变化
	if (tableContainerRef.value) {
		resizeObserver = new ResizeObserver(() => {
			calculateTableHeight();
		});
		resizeObserver.observe(tableContainerRef.value);
	}
});

// 页面卸载时清理监听器
onUnmounted(() => {
	window.removeEventListener('resize', handleResize);
	if (resizeObserver) {
		resizeObserver.disconnect();
		resizeObserver = null;
	}
});

// 重置
const resetQuery = async () => {
	// 清空查询条件
	Object.keys(state.queryForm).forEach((key) => {
		// 时间不重置 是否包含标签不重置
		if (
			key === 'createTimeStart' ||
			key === 'createTimeEnd' ||
			key === 'tagType'
		) {
			return;
		}
		if (Array.isArray(state.queryForm[key])) {
			state.queryForm[key] = [];
		} else {
			state.queryForm[key] = undefined;
		}
	});
	// 重置状态列表
	statusListRef.value.resetCurrentStatus();
	// 重新获取数据
	getDataList();
};

/** 店铺下拉：平台渠道、站点均为空时不筛对应维度；有值则按 platformChannelCode、siteCode 过滤 */
const storeOptionsForQuery = computed(() => {
	// 深拷贝
	const list = JSON.parse(JSON.stringify(dictMap.value.storeList));
	// 如果list为空，则返回空数组
	if (!Array.isArray(list) || list.length === 0) return [];
	// 平台渠道和站点都要用同一份数据
	let result = list;
	// 如果存在平台渠道，就按照平台渠道过滤
	const channelCodes = state.queryForm.platformChannelCodes;
	if (Array.isArray(channelCodes) && channelCodes.length > 0) {
		result = result.filter(
			(item: { platformChannelCode?: string }) =>
				item?.platformChannelCode &&
				channelCodes.includes(item.platformChannelCode)
		);
	}

	// 如果存在站点，就再按照站点过滤
	const siteCodes = state.queryForm.siteCodes;
	if (Array.isArray(siteCodes) && siteCodes.length > 0) {
		const siteSet = new Set(siteCodes);
		result = result.filter(
			(item: { siteCode?: string }) =>
				item?.siteCode && siteSet.has(item.siteCode)
		);
	}

	return result;
});

// 改变平台渠道代码
const changePlatformChannelCodes = async () => {
	state.queryForm.storeIds = [];
	await getDataList();
};

// 改变站点/国家
const changeSiteCodes = async () => {
	state.queryForm.storeIds = [];
	await getDataList();
};

// 定义 SpanMethodProps 类型
interface SpanMethodProps {
	rowIndex: number;
	columnIndex: number;
}
// 合并单元格方法
const arraySpanMethod = ({ columnIndex }: SpanMethodProps) => {
	// 判断是否是第 2、3、4 列
	if (columnIndex === 1) {
		// 第二列
		return { rowspan: 1, colspan: 3 }; // 合并三列
	} else if (columnIndex === 2 || columnIndex === 3) {
		// 隐藏 第2列和第3列
		return { rowspan: 0, colspan: 0 }; //
	} else if (columnIndex === 4) {
		// 第4列
		return { rowspan: 1, colspan: 3 }; // 合并三列（与原行为一致：吞掉“状态/操作”两列）
	} else if (columnIndex === 5 || columnIndex === 6) {
		// 第5列
		return { rowspan: 0, colspan: 0 }; // 隐藏
	}
	// 默认返回
	return { rowspan: 1, colspan: 1 };
};

// vxe-table 排序事件适配到 useTable.sortChangeHandle
const handleVxeSortChange = (params: any) => {
	const order =
		params?.order === 'desc'
			? 'descending'
			: params?.order === 'asc'
			? 'ascending'
			: undefined;
	sortChangeHandle({
		prop: params?.field,
		order,
	});
};

// vxe-table 多选变化：同步 selectedRows（用于导出等逻辑）
const handleCheckboxChange = () => {
	selectedRows.value = tableRef.value?.getCheckboxRecords?.() || [];
};

// vxe-table 展开/收起行事件：跟踪展开状态，用于条件渲染
const handleToggleRowExpand = ({ row, expanded }: any) => {
	const next = new Set(expandedRowIds.value);
	if (expanded) {
		next.add(row.id);
	} else {
		next.delete(row.id);
	}
	expandedRowIds.value = next;
};

/**
 * 批量标记标签
 */
const handleBatchEditTag = async (tag: any) => {
	const rows = tableRef.value?.getCheckboxRecords() || [];
	const ids = rows.map((item: any) => item.id);
	if (ids.length === 0) {
		useMessage().warning(t('请至少选择一条数据'));
		return;
	}
	const tagIds = tag?.map((item: any) => item.id) || [];
	if (tagIds.length === 0) {
		useMessage().warning(t('请至少选择一个标签'));
		return;
	}
	state.loading = true;
	try {
		const res = await postBatchUpdateOrderTag({
			ids,
			tagIds,
		});
		if (res.code === 0) {
			useMessage().success('批量标记标签成功');
		}
		await getDataList();
		tableRef.value?.clearCheckboxRow();
	} finally {
		state.loading = false;
	}
};

// 当前状态

// 打开对话框
const openDialog = async (type: string, row?: any) => {
	try {
		// 只有非禁止状态才能操作
		const isDisabled = tableRef.value
			?.getCheckboxRecords()
			.some((item: any) => item.subOrderStatus === 47);

		if (type === 'log') {
			logDialogVisible.value = true;
			currentRow.value = row;
		} else if (type === 'addItem') {
			// 新增自发货订单
			addItemRef.value?.show();
		} else if (
			isDisabled &&
			type !== 'dischargeProhibition' &&
			type !== 'executebyWarehouseRule' &&
			type !== 'markTag' &&
			type !== 'batchDisable'
		) {
			// 按仓库规则执行哪怕是禁止也可以执行 产品要求的
			ElMessageBox.alert(
				'只能勾选状态为【非禁止】的自发货订单，请确认！',
				'错误提醒'
			);
			return;
		} else if (type === 'orderConfirm') {
			// 接单确认
			const ids =
				tableRef.value?.getCheckboxRecords().map((item: any) => item.id) || [];
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			ElMessageBox({
				title: '确认接单',
				message: '确认可接单?订单可流转至后续环节',
				type: 'warning', // 警告样式
				confirmButtonText: '确认', // 确认按钮文本
				cancelButtonText: '取消', // 取消按钮文本（可选）
			}).then(async () => {
				const res = await postOrderConfirm({ ids });
				if (res.code === 0) {
					// 判断是否有失败的记录
					if (res.data?.failCount > 0) {
						// 展示错误提示
						open({
							title: t('接单确认失败'),
							data: res.data,
						});
					} else if (res.data?.failCount === 0) {
						useMessage().success('操作成功');
					}
					getDataList();
					tableRef.value?.clearCheckboxRow();
				}
			});
		} else if (type === 'shippingReview') {
			// 发货审核
			const ids =
				tableRef.value?.getCheckboxRecords().map((item: any) => item.id) || [];
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			ElMessageBox({
				title: '发货审核',
				message: '确认审核?订单可流转至后续环节',
				type: 'warning', // 警告样式
				confirmButtonText: '确认', // 确认按钮文本
				cancelButtonText: '取消', // 取消按钮文本（可选）
			}).then(async () => {
				const res = await postShippingReview({ ids });
				if (res.code === 0) {
					// 判断是否有失败的记录
					if (res.data?.failCount > 0) {
						// 展示错误提示
						open({
							title: t('发货审核失败'),
							data: res.data,
						});
					} else if (res.data?.failCount === 0) {
						useMessage().success('操作成功');
					}
					getDataList();
					tableRef.value?.clearCheckboxRow();
				}
			});
		} else if (type === 'orderShipped') {
			// 确认发货
			const ids =
				tableRef.value?.getCheckboxRecords().map((item: any) => item.id) || [];
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			ElMessageBox({
				title: '确定发货',
				message: '确定订单已发货?',
				type: 'warning', // 警告样式
				confirmButtonText: '确认', // 确认按钮文本
				cancelButtonText: '取消', // 取消按钮文本（可选）
			}).then(async () => {
				const res = await postOrderShipped({ ids });
				if (res.code === 0) {
					// 判断是否有失败的记录
					if (res.data?.failCount > 0) {
						// 展示错误提示
						open({
							title: t('确认发货失败'),
							data: res.data,
						});
					} else if (res.data?.failCount === 0) {
						useMessage().success('操作成功');
					}
					getDataList();
					tableRef.value?.clearCheckboxRow();
				}
			});
		} else if (type === 'invalidOrder') {
			const rows = tableRef.value?.getCheckboxRecords() || [];
			const ids = rows.map((item: any) => item.id);
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			//检查是否都符合状态(待接单2，待审核3)
			const invalid = rows.some(
				(item: any) => item.orderStatus !== 2 && item.orderStatus !== 3
			);
			if (invalid) {
				ElMessageBox.alert(
					'只能勾选状态为【待接单,待审核】的自发货订单，请确认！',
					'错误提醒',
					{
						type: 'warning',
						confirmButtonText: '关闭',
						customClass: 'custom-invalid-dialog',
					}
				);
				return;
			}
			ElMessageBox.confirm(
				`已选中${ids.length}个订单，确认作废勾选的自发货订单吗`,
				'作废',
				{
					type: 'warning', // 警告样式
					confirmButtonText: '确认', // 确认按钮文本
					cancelButtonText: '取消',
				}
			).then(async () => {
				const res = await postOrderInvalid({ ids });
				if (res.code === 0) {
					// 判断是否有失败的记录
					if (res.data?.failCount > 0) {
						// 展示错误提示
						open({
							title: t('作废失败'),
							data: res.data,
						});
					} else if (res.data?.failCount === 0) {
						useMessage().success('操作成功');
					}
					getDataList();
					tableRef.value?.clearCheckboxRow();
				}
			});
		} else if (type === 'pushThirdWarehouses') {
			const rows = tableRef.value?.getCheckboxRecords() || [];
			const ids = rows.map((item: any) => item.id);
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			//检查是否都符合状态(待发货4 以及 未推送warehouseOrderNo 为空)
			const invalid = rows.some(
				(item: any) => item.orderStatus !== 4 || item.warehouseOrderNo
			);
			if (invalid) {
				ElMessageBox.alert(
					'只能勾选状态为【待发货】且未推送三方仓自发货订单，请确认！',
					'错误提醒',
					{
						type: 'warning',
						confirmButtonText: '关闭',
						customClass: 'custom-invalid-dialog',
					}
				);
				return;
			}
			ElMessageBox.confirm(
				`已选中${ids.length}个订单，确认推送勾选自发货订单至三方仓?`,
				'推送订单至三方仓',
				{
					type: 'warning',
					confirmButtonText: '确认',
					cancelButtonText: '取消',
				}
			).then(async () => {
				try {
					state.loading = true; // ⬅️ 打开 loading
					const res = await postPushWms({ ids });
					if (res.code === 0) {
						if (res.data?.failCount > 0) {
							open({
								title: t('推送失败'),
								data: res.data,
							});
						} else {
							useMessage().success('操作成功');
						}
						// 刷新表格
						getDataList();
						tableRef.value?.clearCheckboxRow();
					}
				} catch (error) {
					useMessage().error('请求失败');
				} finally {
					state.loading = false;
				}
			});
		} else if (type === 'combineOrder') {
			const rows = tableRef.value?.getCheckboxRecords() || [];
			const ids = rows.map((item: any) => item.id);
			if (ids.length < 2) {
				useMessage().warning(t('请至少选择两条数据'));
				return;
			}
			//检查是否都符合状态(待审核3)
			const invalid = rows.some(
				(item: any) => item.orderStatus !== 3 && item.orderStatus !== 1
			);
			if (invalid) {
				ElMessageBox.alert('只能勾选状态为【待审核】', '错误提醒', {
					type: 'warning',
					confirmButtonText: '关闭',
					customClass: 'custom-invalid-dialog',
				});
				return;
			}
			combineOrderRef.value.handleOpen(rows, 0);
		} else if (type == 'cutoffOrder') {
			const rows = tableRef.value?.getCheckboxRecords() || [];
			const ids = rows.map((item: any) => item.id);
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			// 检查是否都符合状态:(待发货状态可操作)
			const invalid = rows.some((item: any) => item.orderStatus !== 4);
			if (invalid) {
				ElMessageBox.alert('只能勾选状态为【待发货】，请确认！', '错误提醒', {
					type: 'warning',
					confirmButtonText: '关闭',
					customClass: 'custom-invalid-dialog',
				});
				return;
			}
			cutoffOrderRef.value.handleOpen(ids);
		} else if (type == 'markShipment') {
			const rows = tableRef.value?.getCheckboxRecords() || [];
			const ids = rows.map((item: any) => item.id);
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			//检查是否都符合状态(已发货状态5且标发状态为【待标发1、标发失败4】可操作)
			// const invalid = rows.some(
			// 	(item: any) =>
			// 		item.orderStatus !== 5 ||
			// 		(item.markStatus !== 1 && item.markStatus !== 4)
			// );
			// if (invalid) {
			// 	ElMessageBox.alert(
			// 		'只能勾选状态为【已发货】，且标发状态为【待标发和标发失败】的自发货订单，请确认！',
			// 		'错误提醒',
			// 		{
			// 			type: 'warning',
			// 			confirmButtonText: '关闭',
			// 			customClass: 'custom-invalid-dialog',
			// 		}
			// 	);
			// 	return;
			// }
			ElMessageBox.confirm(
				`已选中${ids.length}个订单，确认标发勾选的自发货订单吗?`,
				'标发',
				{
					type: 'warning', // 警告样式
					confirmButtonText: '确认', // 确认按钮文本
					cancelButtonText: '取消',
				}
			).then(async () => {
				const res = await markShipped({ ids });
				if (res.code === 0) {
					// 判断是否有失败的记录
					if (res.data?.failCount > 0) {
						// 展示错误提示
						open({
							title: t('标发失败'),
							data: res.data,
						});
					} else if (res.data?.failCount === 0) {
						useMessage().success('操作成功');
					}
					getDataList();
					tableRef.value?.clearCheckboxRow();
				}
			});
		} else if (type === 'allShipToFBA') {
			const rows = tableRef.value?.getCheckboxRecords() || [];
			const ids = rows.map((item: any) => item.id);
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			// 批量转FBA发货
			allShipToFBARef.value?.show(rows);
		} else if (type === 'batchSetWareAndLogistics') {
			const rows = tableRef.value?.getCheckboxRecords() || [];
			const ids = rows.map((item: any) => item.id);
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			const invalid = rows.some(
				(item: any) => item.orderStatus !== 3 && item.subOrderStatus !== 47
			);
			if (invalid) {
				ElMessageBox.alert(
					'只能勾选状态为【待审核】的自发货订单，请确认！',
					'错误提醒',
					{
						type: 'warning',
						confirmButtonText: '关闭',
						customClass: 'custom-invalid-dialog',
					}
				);
				return;
			}

			selectedRows.value = rows;
			setWareAndLogisticsRef.value?.show();
		} else if (type === 'setWareAndLogisticsToSku') {
			const rows = tableRef.value?.getCheckboxRecords() || [];
			const ids = rows.map((item: any) => item.id);
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			const invalid = rows.some(
				(item: any) => item.orderStatus !== 3 && item.subOrderStatus !== 47
			);
			if (invalid) {
				ElMessageBox.alert(
					'只能勾选状态为【待审核】的自发货订单，请确认！',
					'错误提醒',
					{
						type: 'warning',
						confirmButtonText: '关闭',
						customClass: 'custom-invalid-dialog',
					}
				);
				return;
			}
			selectedRows.value = rows;
			setWareAndLogisticsToSkuRef.value?.show();
		} else if (type === 'setOperation') {
			const rows = tableRef.value?.getCheckboxRecords() || [];
			const ids = rows.map((item: any) => item.id);
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			// 待审核(orderStatus=3) 且 没有发货仓库(designatedWarehouse 为空)
			const invalid = rows.some(
				(item: any) => item.orderStatus !== 3 || item.designatedWarehouse
			);
			if (invalid) {
				ElMessageBox.alert(
					'只能勾选状态为【待审核】且没有发货仓库的自发货订单，请确认！',
					'错误提醒',
					{
						type: 'warning',
						confirmButtonText: '关闭',
						customClass: 'custom-invalid-dialog',
					}
				);
				return;
			}
			setOperationRef.value?.show(ids);
		} else if (type === 'fixSelfOrderInfo') {
			const selfOrderNos =
				tableRef.value
					?.getCheckboxRecords()
					.map((item: any) => item.selfOrderNo)
					.filter(Boolean) || [];
			if (selfOrderNos.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			ElMessageBox.confirm(
				`已选中${selfOrderNos.length}个订单，确认修复勾选订单的数据吗？`,
				'修复数据',
				{
					type: 'warning',
					confirmButtonText: '确认',
					cancelButtonText: '取消',
				}
			).then(async () => {
				const res = await postFixSelfOrderInfo(selfOrderNos);
				if (res.code === 0) {
					useMessage().success('操作成功');
					getDataList();
					tableRef.value?.clearCheckboxRow();
				}
			});
		} else if (type == 'dischargeProhibition') {
			// 解除禁止
			const rows = tableRef.value?.getCheckboxRecords() || [];
			const ids = rows.map((item: any) => item.id);
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			//检查是否都是禁止状态
			const invalid = rows.some((item: any) => item.subOrderStatus !== 47);
			if (invalid) {
				ElMessageBox.alert(
					'只能勾选状态为【禁止】的自发货订单，请确认！',
					'错误提醒',
					{
						type: 'warning',
						confirmButtonText: '关闭',
						customClass: 'custom-invalid-dialog',
					}
				);
				return;
			}
			ElMessageBox.confirm(
				`已选中${ids.length}个订单，解除禁止后，订单将继续按规则执行`,
				'确认解除禁止吗？',
				{
					type: 'warning', // 警告样式
					confirmButtonText: '确认', // 确认按钮文本
					cancelButtonText: '取消',
				}
			).then(async () => {
				const res = await releaseStopHandlerOrder({ ids });
				if (res.code === 0) {
					// 判断是否有失败的记录
					if (res.data?.failCount > 0) {
						// 展示错误提示
						open({
							title: t('解除禁止失败'),
							data: res.data,
						});
					} else if (res.data?.failCount === 0) {
						useMessage().success('操作成功');
					}
					getDataList();
					tableRef.value?.clearCheckboxRow();
					// 刷新状态
					statusListRef.value.changeGetSelfOrderStatusCount();
				}
			});
		} else if (type === 'logisticsInformation') {
			// 上传物流信息
			// const rows = tableRef.value?.getCheckboxRecords() || [];
			// const ids = rows.map((item: any) => item.id);
			// if (ids.length === 0) {
			// 	useMessage().warning(t('请至少选择一条数据'));
			// 	return;
			// }
			// //检查是否待发货4和已发货5
			// const invalid = rows.some((item: any) => item.orderStatus !== 4 && item.orderStatus !== 5);
			// if (invalid) {
			// 	ElMessageBox.alert('只能更新状态为【待发货和已发货】的自发货订单，请确认！', '错误提醒', {
			// 		type: 'warning',
			// 		confirmButtonText: '关闭',
			// 		customClass: 'custom-invalid-dialog',
			// 	});
			// 	return;
			// }
			logisticsInformationRef.value.show();
		} else if (type === 'updateMskuMatch') {
			// 更新MSKU匹配
			const rows = tableRef.value?.getCheckboxRecords() || [];
			const ids = rows.map((item: any) => item.id);
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}

			// 检查标签：只有标签为【MSKU匹配失败】的数据才能操作
			const invalid = rows.some((item: any) => item.subOrderStatus !== 42);
			if (invalid) {
				ElMessageBox.alert(
					'只能勾选标签为【MSKU匹配失败】的自发货订单，请确认！',
					'错误提醒',
					{
						type: 'warning',
						confirmButtonText: '关闭',
						customClass: 'custom-invalid-dialog',
					}
				);
				return;
			}
			ElMessageBox.confirm(
				`已选中${ids.length}个订单更新MSKU与SKU关系，是否提交`,
				'更新MSKU与SKU关系',
				{
					type: 'warning', // 警告样式
					confirmButtonText: '确认', // 确认按钮文本
					cancelButtonText: '取消',
				}
			).then(async () => {
				const res = await updateMskuPairing({ ids });
				if (res.code === 0) {
					// 判断是否有失败的记录
					if (res.data?.failCount > 0) {
						// 展示错误提示
						open({
							title: t('更新MSKU与SKU关系失败'),
							data: res.data,
						});
					} else if (res.data?.failCount === 0) {
						useMessage().success('更新MSKU与SKU关系成功');
					}
					getDataList();
					tableRef.value?.clearCheckboxRow();
				}
			});
		} else if (type === 'executebyWarehouseRule') {
			// 执行仓库规则
			const rows = tableRef.value?.getCheckboxRecords() || [];
			const ids = rows.map((item: any) => item.id);
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			// 注释 不再是只有仓库物流分配失败才能操作 产品和后台说的 2026年3月26日15:29:40
			// 检查标签：只有标签为【仓库物流分配失败】的数据才能操作
			// const invalid = rows.some((item: any) => item.subOrderStatus !== 43);
			// if (invalid) {
			// 	ElMessageBox.alert(
			// 		'只能勾选标签为【仓库物流分配失败】的自发货订单，请确认！',
			// 		'错误提醒',
			// 		{
			// 			type: 'warning',
			// 			confirmButtonText: '关闭',
			// 			customClass: 'custom-invalid-dialog',
			// 		}
			// 	);
			// 	return;
			// }
			ElMessageBox.confirm(
				`已选中${ids.length}个订单按仓库规则执行，是否提交`,
				'按仓库规则执行',
				{
					type: 'warning', // 警告样式
					confirmButtonText: '确认', // 确认按钮文本
					cancelButtonText: '取消',
				}
			).then(async () => {
				const res = await executeWarehouseRules({ ids });
				if (res.code === 0) {
					// 判断是否有失败的记录
					if (res.data?.failCount > 0) {
						// 展示错误提示
						open({
							title: t('按仓库规则执行失败'),
							data: res.data,
						});
					} else if (res.data?.failCount === 0) {
						useMessage().success('按仓库规则执行成功');
					}
					getDataList();
					tableRef.value?.clearCheckboxRow();
				}
			});
		} else if (type === 'updateThirdWarehouseMskuMatch') {
			// 更新三方仓SKU配对
			const rows = tableRef.value?.getCheckboxRecords() || [];
			const ids = rows.map((item: any) => item.id);
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}

			// 检查标签：只有标签为【三方仓SKU配对失败】的数据才能操作
			const invalid = rows.some((item: any) => item.subOrderStatus !== 44);
			if (invalid) {
				ElMessageBox.alert(
					'只能勾选标签为【三方仓SKU配对失败】的自发货订单，请确认！',
					'错误提醒',
					{
						type: 'warning',
						confirmButtonText: '关闭',
						customClass: 'custom-invalid-dialog',
					}
				);
				return;
			}
			ElMessageBox.confirm(
				`已选中${ids.length}个订单更新三方仓SKU配对，是否提交`,
				'更新三方仓SKU配对',
				{
					type: 'warning', // 警告样式
					confirmButtonText: '确认', // 确认按钮文本
					cancelButtonText: '取消',
				}
			).then(async () => {
				const res = await updateThirdPartySkuPairing({ ids });
				if (res.code === 0) {
					// 判断是否有失败的记录
					if (res.data?.failCount > 0) {
						// 展示错误提示
						open({
							title: t('更新三方仓SKU配对失败'),
							data: res.data,
						});
					} else if (res.data?.failCount === 0) {
						useMessage().success('更新三方仓SKU配对成功');
					}
					getDataList();
					tableRef.value?.clearCheckboxRow();
				}
			});
		} else if (type === 'recalculation') {
			const orderNos =
				tableRef.value
					?.getCheckboxRecords()
					.map((item: any) => item.selfOrderNo) || [];
			if (orderNos.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			ElMessageBox.confirm(
				`已选中${orderNos.length}个订单，确认重新计算运费吗？`,
				'重新计算运费',
				{
					type: 'warning', // 警告样式
					confirmButtonText: '确认', // 确认按钮文本
					cancelButtonText: '取消',
				}
			).then(async () => {
				// 一般情况下是要加一个对象的，但是这里后台偷懒，直接传数组（后来者千万不要学哦！）
				const res = await putRecalculation(orderNos);
				if (res.code === 0) {
					useMessage().success('重新计算运费成功');
					getDataList();
				}
			});
		} else if (type === 'recalculationRetry') {
			const ids =
				tableRef.value?.getCheckboxRecords().map((item: any) => item.id) || [];
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			// 必须状态都是物流下单失败
			const invalid = tableRef.value
				?.getCheckboxRecords()
				.some((item: any) => item.subOrderStatus !== 51);
			if (invalid) {
				ElMessageBox.alert(
					'只能勾选状态为【物流下单失败】的自发货订单，请确认！',
					'错误提醒',
					{
						type: 'warning',
						confirmButtonText: '关闭',
						customClass: 'custom-invalid-dialog',
					}
				);
				return;
			}
			ElMessageBox.confirm(
				`已选中${ids.length}个订单，确认重试吗？`,
				'物流下单重试',
				{
					type: 'warning', // 警告样式
					confirmButtonText: '确认', // 确认按钮文本
					cancelButtonText: '取消',
				}
			).then(async () => {
				const res = await postRecalculationRetry({
					ids,
				});
				if (res.code === 0) {
					// 判断是否有失败的记录
					if (res.data?.failCount > 0) {
						// 展示错误提示
						open({
							title: t('物流下单重试失败'),
							data: res.data,
						});
					} else if (res.data?.failCount === 0) {
						useMessage().success('物流下单重试成功');
					}
					getDataList();
					tableRef.value?.clearCheckboxRow();
				}
			});
		} else if (type === 'markTag') {
			// 批量标记标签
			const rows = tableRef.value?.getCheckboxRecords() || [];
			const ids = rows.map((item: any) => item.id);
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			batchTagIds.value = [];
			batchEditTagRef.value?.show?.();
		} else if (type === 'batchDisable') {
			//批量禁用
			const rows = tableRef.value?.getCheckboxRecords() || [];
			const ids = rows.map((item: any) => item.id);
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			const invalid = rows.some((item: any) => item.subOrderStatus === 47);
			if (invalid) {
				ElMessageBox.alert(
					'只能勾选状态为【非禁止】的自发货订单，请确认！',
					'错误提醒',
					{
						type: 'warning',
						confirmButtonText: '关闭',
						customClass: 'custom-invalid-dialog',
					}
				);
				return;
			}
			ElMessageBox.confirm(
				`已选中${ids.length}个订单，确认批量禁用吗？`,
				'批量禁用',
				{
					type: 'warning',
					confirmButtonText: '确认',
					cancelButtonText: '取消',
				}
			).then(async () => {
				state.loading = true;
				try {
					const res = await postBatchStopHandlerOrder({ ids });
					if (res.code === 0) {
						// 判断是否有失败的记录
						if (res.data?.failCount > 0) {
							// 展示错误提示
							open({
								title: t('批量禁用失败'),
								data: res.data,
							});
						} else if (res.data?.failCount === 0) {
							useMessage().success('批量禁用成功');
						}
						getDataList();
						tableRef.value?.clearCheckboxRow();
						statusListRef.value.changeGetSelfOrderStatusCount();
					}
				} finally {
					state.loading = false;
				}
			});
		}
	} catch (error: any) {
		useMessage().error(error?.msg || t('错误'));
	}
};

// 导出
const handleExport = async () => {
	try {
		const ids =
			tableRef.value?.getCheckboxRecords().map((item: any) => item.id) || [];
		// 显示加载状态
		state.loading = true;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await getExportSelfOrder({
			ids: ids || [],
			...state.queryForm,
			ascs: state?.ascs,
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
// 导出详情
const handleExportDetail = async () => {
	try {
		const ids =
			tableRef.value?.getCheckboxRecords().map((item: any) => item.id) || [];
		// 显示加载状态
		state.loading = true;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await getExportSelfOrderFee({
			ids: ids || [],
			...state.queryForm,
			ascs: state?.ascs,
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
</script>

<style lang="scss" scoped>
/* vxe-table 展开列样式 */
:deep(.expand-column) {
	.vxe-cell {
		display: none !important;
		border: none !important;
	}
}

/* vxe-table 展开行内容样式 */
:deep(.vxe-table__body-wrapper .vxe-table--expanded) {
	background: #fff !important;
}

:deep(.vxe-table__expanded-cell) {
	min-height: 250px;
}

/* 滚动条层级 */
:deep(.vxe-table__body-wrapper .vxe-scrollbar__bar) {
	z-index: 6;
}
:deep(.vxe-table__expanded-cell) {
	z-index: 5;
}

// /* 表格行渲染动画 - 只在初始加载时执行，展开时不重新触发 */
// :deep(.vxe-table__body-wrapper) {
// 	.vxe-body--row:not(.vxe-table--expanded) {
// 		animation: tableRowFadeIn 0.4s ease-out;
// 		animation-fill-mode: both;
// 	}

// 	// 为每一行添加延迟，形成依次出现的效果（排除已展开的行）
// 	@for $i from 1 through 50 {
// 		.vxe-body--row:nth-child(#{$i}):not(.vxe-table--expanded) {
// 			animation-delay: #{$i * 0.03}s;
// 		}
// 	}

// 	// 已展开的行不应用动画，避免抖动
// 	.vxe-table--expanded {
// 		animation: none !important;
// 	}
// }

/* 表格行淡入动画 */
@keyframes tableRowFadeIn {
	0% {
		opacity: 0;
		transform: translateY(10px);
	}
	100% {
		opacity: 1;
		transform: translateY(0);
	}
}

/* 展开行内容动画 - 移除位移效果，只保留淡入 */
:deep(.expand-wrapper) {
	padding: 10px;
	background-color: #fafafa;
	border: 1px solid #ebeef5;
	border-radius: 4px;
	cursor: pointer;
	transition: background-color 0.2s;

	&:hover {
		background-color: #f5f7fa;
	}

	.expand-table {
		width: 100%;
		/* 页面变窄时优先按比例缩小各列；内容太长时由单元格内部处理溢出 */
		overflow-x: hidden;

		.expand-table-row {
			display: flex;
			align-items: flex-start;
			border-bottom: 1px solid #ebeef5;
			width: 100%;

			&:last-child {
				border-bottom: none;
			}
		}

		.expand-table-cell {
			padding: 12px;
			border-right: 1px solid #ebeef5;
			box-sizing: border-box;
			/* 允许 flex 子项收缩（否则会被内容撑开导致横向滚动） */
			min-width: 0;
			overflow: hidden;

			&:last-child {
				border-right: none;
			}
		}
	}

	animation: expandContentFadeIn 0.2s ease-out;
}

@keyframes expandContentFadeIn {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}

.layout-padding {
	.expand-table:hover {
		background-color: #ffebbc3d;
	}
}
</style>
<style>
.custom-invalid-dialog {
	width: 520px !important;
	max-width: none;
}
</style>
