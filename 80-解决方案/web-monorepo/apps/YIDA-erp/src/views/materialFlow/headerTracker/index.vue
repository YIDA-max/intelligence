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
								<div class="flex item-center">
									<TreeSelectInputApi
										componentType="country"
										text="国家"
										code="countries"
										v-model:queryForm="state.queryForm"
										:searchFn="getDataList"
										:settings="{
											text: '选择国家',
											width: '220px',
										}"
									/>
								</div>
							</el-form-item>

							<!-- 起运港 -->
							<el-form-item>
								<div class="flex item-center">
									<TreeSelectInputApi
										componentType="basePort"
										text="起运港"
										code="originPorts"
										v-model:queryForm="state.queryForm"
										:searchFn="getDataList"
										:settings="{
											text: '选择起运港',
											width: '220px',
										}"
									/>
								</div>
							</el-form-item>

							<!-- 目的港 -->
							<el-form-item>
								<div class="flex item-center">
									<TreeSelectInputApi
										componentType="basePort"
										text="目的港"
										code="destPorts"
										v-model:queryForm="state.queryForm"
										:searchFn="getDataList"
										:settings="{
											text: '选择目的港',
											width: '220px',
										}"
									/>
								</div>
							</el-form-item>

							<!-- 发货方式 -->
							<el-form-item>
								<div class="flex item-center">
									<TreeSelectInputApi
										componentType="dicts"
										text="发货方式"
										code="deliveryMethods"
										v-model:queryForm="state.queryForm"
										:searchFn="getDataList"
										:settings="{
											text: '选择发货方式',
											width: '220px',
											getTreeDataParams: 'shipping_method',
										}"
									/>
								</div>
							</el-form-item>

							<!-- 第一目的仓 -->
							<el-form-item>
								<div class="flex item-center">
									<TreeSelectInputApi
										text="第一目的仓"
										code="firstWarehouses"
										v-model:queryForm="state.queryForm"
										:searchFn="getDataList"
										:settings="{
											text: '选择第一目的仓',
											width: '220px',
											getTreeData: getCombinedWarehouseList,
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
										text="第二目的仓"
										code="secondWarehouses"
										v-model:queryForm="state.queryForm"
										:searchFn="getDataList"
										:settings="{
											text: '选择第二目的仓',
											width: '220px',
											getTreeData: getCombinedWarehouseList,
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
								<div class="flex item-center">
									<TreeSelectInputApi
										componentType="dicts"
										text="平台"
										code="platforms"
										v-model:queryForm="state.queryForm"
										:searchFn="getDataList"
										:settings="{
											text: '选择平台',
											width: '220px',
											getTreeDataParams: 'platform_channel',
										}"
									/>
								</div>
							</el-form-item>

							<!-- 国际运输 -->

							<el-form-item>
								<div class="flex item-center">
									<TreeSelectInputApi
										componentType="freightForwarder"
										text="国际运输"
										code="intlCarriers"
										v-model:queryForm="state.queryForm"
										:searchFn="getDataList"
										:settings="{
											text: '选择国际运输',
											width: '220px',
											getTreeDataParams: { forwarderTypes: [5] },
										}"
									/>
								</div>
							</el-form-item>
							<!-- 清关 -->
							<el-form-item>
								<div class="flex item-center">
									<TreeSelectInputApi
										componentType="freightForwarder"
										text="清关"
										code="customsClearances"
										v-model:queryForm="state.queryForm"
										:searchFn="getDataList"
										:settings="{
											text: '选择清关',
											width: '220px',
											getTreeDataParams: { forwarderTypes: [3] },
										}"
									/>
								</div>
							</el-form-item>
							<!-- 海外派送 -->
							<el-form-item>
								<div class="flex item-center">
									<TreeSelectInputApi
										componentType="freightForwarder"
										text="海外派送"
										code="lastMileDeliveries"
										v-model:queryForm="state.queryForm"
										:searchFn="getDataList"
										:settings="{
											text: '选择海外派送',
											width: '220px',
											getTreeDataParams: { forwarderTypes: [4] },
										}"
									/>
								</div>
							</el-form-item>
							<el-form-item>
								<el-select
									collapse-tags
									:max-collapse-tags="1"
									clearable
									filterable
									multiple
									@change="getDataList"
									v-model="state.queryForm.cargoStatus"
									placeholder="货物状态"
									style="width: 140px"
								>
									<el-option
										v-for="item in [
											{
												id: 1,
												label: '已出货',
												value: '1',
											},
											{
												id: 2,
												label: '已开船',
												value: '2',
											},
											{
												id: 3,
												label: '已到港',
												value: '3',
											},
											{
												id: 4,
												label: '海关查验中',
												value: '4',
											},
											{
												id: 5,
												label: '退运中',
												value: '5',
											},
											{
												id: 6,
												label: '已提柜',
												value: '6',
											},
											{
												id: 7,
												label: '已入海外仓',
												value: '7',
											},
											{
												id: 8,
												label: '已入中转仓',
												value: '8',
											},
											{
												id: 9,
												label: '已入平台仓',
												value: '9',
											},
										]"
										:key="item.id"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</el-form-item>

							<!-- 开船是否准时 -->
							<el-form-item>
								<div class="flex items-center">
									<el-select
										collapse-tags
										:max-collapse-tags="1"
										clearable
										filterable
										multiple
										@change="getDataList"
										v-model="state.queryForm.departureOntimes"
										placeholder="开船是否准时"
										style="width: 140px"
									>
										<el-option
											v-for="item in [
												{ id: 1, label: '提前', value: '1' },
												{ id: 2, label: '准时', value: '2' },
												{ id: 3, label: '延期', value: '3' },
											]"
											:key="item.id"
											:label="item.label"
											:value="item.value"
										/>
									</el-select>
								</div>
							</el-form-item>
							<!-- 到港是否准时 -->
							<el-form-item>
								<div class="flex items-center">
									<el-select
										collapse-tags
										:max-collapse-tags="1"
										clearable
										filterable
										multiple
										@change="getDataList"
										v-model="state.queryForm.arrivalOntimes"
										placeholder="到港是否准时"
										style="width: 140px"
									>
										<el-option
											v-for="item in [
												{ id: 1, label: '提前', value: '1' },
												{ id: 2, label: '准时', value: '2' },
												{ id: 3, label: '延期', value: '3' },
											]"
											:key="item.id"
											:label="item.label"
											:value="item.value"
										/>
									</el-select>
								</div>
							</el-form-item>

							<!-- 提柜是否准时 -->
							<el-form-item>
								<div class="flex items-center">
									<el-select
										collapse-tags
										:max-collapse-tags="1"
										clearable
										multiple
										filterable
										@change="getDataList"
										v-model="state.queryForm.pickupOntimes"
										placeholder="提柜是否准时"
										style="width: 140px"
									>
										<el-option
											v-for="item in [
												{ id: 1, label: '准时', value: '2' },
												{ id: 2, label: '不准时', value: '4' },
											]"
											:key="item.id"
											:label="item.label"
											:value="item.value"
										/>
									</el-select>
								</div>
							</el-form-item>

							<!-- 还空是否准时 -->
							<el-form-item>
								<div class="flex items-center">
									<el-select
										collapse-tags
										:max-collapse-tags="1"
										clearable
										multiple
										filterable
										@change="getDataList"
										v-model="state.queryForm.returnEmptyOntimes"
										placeholder="还空是否准时"
										style="width: 140px"
									>
										<el-option
											v-for="item in [
												{ id: 1, label: '提前', value: '1' },
												{ id: 2, label: '准时', value: '2' },
												{ id: 3, label: '延期', value: '3' },
											]"
											:key="item.id"
											:label="item.label"
											:value="item.value"
										/>
									</el-select>
								</div>
							</el-form-item>
							<!-- 云当订阅状态 -->
							<el-form-item>
								<div class="flex items-center">
									<el-select
										collapse-tags
										:max-collapse-tags="1"
										clearable
										filterable
										@change="getDataList"
										v-model="state.queryForm.ydSubscribeStatus"
										placeholder="云当订阅状态"
										style="width: 140px"
									>
										<el-option
											v-for="item in [
												{ id: 1, label: '失败', value: '1' },
												{ id: 2, label: '成功', value: '2' },
											]"
											:key="item.id"
											:label="item.label"
											:value="item.value"
										/>
									</el-select>
								</div>
							</el-form-item>
							<!-- 云当码头订阅状态 -->
							<el-form-item>
								<div class="flex items-center">
									<el-select
										collapse-tags
										:max-collapse-tags="1"
										clearable
										filterable
										@change="getDataList"
										v-model="state.queryForm.ydPierSubscribeStatus"
										placeholder="云当码头订阅状态"
										style="width: 160px"
									>
										<el-option
											v-for="item in [
												{ id: 1, label: '失败', value: '1' },
												{ id: 2, label: '成功', value: '2' },
											]"
											:key="item.id"
											:label="item.label"
											:value="item.value"
										/>
									</el-select>
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
												label: '货好时间',
												value: 'cargoReadyTime',
												isAddHMS: true,
												dateStart: 'cargoReadyTimeStart',
												dateEnd: 'cargoReadyTimeEnd',
											},
											// kk
											{
												label: '物流实际装柜时间',
												value: 'loadingTime',
												isAddHMS: true,
												dateStart: 'loadingTimeStart',
												dateEnd: 'loadingTimeEnd',
											},
											{
												label: '提空柜时间',
												value: 'emptyContainerPickupTime',
												isAddHMS: true,
												dateStart: 'emptyContainerPickupTimeStart',
												dateEnd: 'emptyContainerPickupTimeEnd',
											},
											{
												label: '截单时间',
												value: 'cutoffTime',
												isAddHMS: true,
												dateStart: 'cutoffTimeStart',
												dateEnd: 'cutoffTimeEnd',
											},
											{
												label: '截关时间',
												value: 'customCutoffTime',
												isAddHMS: true,
												dateStart: 'customCutoffTimeStart',
												dateEnd: 'customCutoffTimeEnd',
											},
											{
												label: '预计开船',
												value: 'scheduledDepartureTime',
												isAddHMS: true,
												dateStart: 'scheduledDepartureTimeStart',
												dateEnd: 'scheduledDepartureTimeEnd',
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
												label: '预计到港',
												value: 'scheduledArrivalPortTime',
												isAddHMS: true,
												dateStart: 'scheduledArrivalPortTimeStart',
												dateEnd: 'scheduledArrivalPortTimeEnd',
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
												label: 'Last free day',
												value: 'lastFreeDay',
												isAddHMS: true,
												dateStart: 'lastFreeDayStart',
												dateEnd: 'lastFreeDayEnd',
											},
											{
												label: '还空箱时间',
												value: 'emptyContainerReturnTime',
												isAddHMS: true,
												dateStart: 'emptyContainerReturnTimeStart',
												dateEnd: 'emptyContainerReturnTimeEnd',
											},

											{
												label: '到仓时间',
												value: 'warehouseArrivalTime',
												isAddHMS: true,
												dateStart: 'warehouseArrivalTimeStart',
												dateEnd: 'warehouseArrivalTimeEnd',
											},
											{
												label: '入库时间',
												value: 'inboundTime',
												isAddHMS: true,
												dateStart: 'inboundTimeStart',
												dateEnd: 'inboundTimeEnd',
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
												width: '130px',
											},
											inputStyle: {
												width: '300px',
											},
										}"
										:searchTypes="[
											{
												label: '柜号',
												value: 'containerNos',
											},
											{
												label: 'SO',
												value: 'soNos',
											},
											{
												label: 'ShipmentID',
												value: 'shipmentIds',
											},
											{
												label: 'MSKU',
												value: 'mskus',
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
											{
												label: '船名',
												value: 'vessels',
											},
											{
												label: '航次',
												value: 'voyages',
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

			<BaseTable
				:register="register"
				ref="baseTableRef"
				:rowConfig="{ keyField: 'id' }"
				:tableAttrs="tableAttrs"
				@toggle-row-expand="handleToggleRowExpand"
			>
				<template #left-tool>
					<el-dropdown
						v-if="
							auth('tracker_input_head') ||
							auth('tracker_input_update') ||
							auth('tracker_historyData_update')
						"
						@command="(type: string) => handleCommand(type)"
					>
						<el-button class="ml10" type="primary">
							{{ $t('导入') }}
							<el-icon class="el-icon--right">
								<arrow-down />
							</el-icon>
						</el-button>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item
									v-if="auth('tracker_input_head')"
									command="FirstLegWaybill"
									>{{ $t('导入头程单') }}</el-dropdown-item
								>
								<el-dropdown-item
									v-if="auth('tracker_input_update')"
									command="FirstLegWaybillUpdate"
								>
									{{ $t('导入更新信息') }}
								</el-dropdown-item>
								<el-dropdown-item
									v-if="auth('tracker_historyData_update')"
									command="FirstLegHistoryData"
								>
									{{ $t('导入历史数据') }}
								</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>

					<el-dropdown
						v-if="auth('tracker_export')"
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
									v-if="auth('tracker_export_cabinet')"
									command="exportCabinet"
									>{{ $t('导出柜子信息') }}</el-dropdown-item
								>
								<el-dropdown-item
									v-if="auth('tracker_export_detail')"
									command="exportDetail"
								>
									{{ $t('导出明细信息') }}
								</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>

					<el-button
						v-if="auth('tracker_resubscribe')"
						class="ml10"
						@click="openDialog('reSubscribe')"
					>
						{{ $t('重新订阅') }}</el-button
					>
				</template>
				<template #expand-expand="{ row }">
					<ExpandTable v-if="row.isExpand" :products="row.products" />
				</template>

				<template #secondWarehouse="{ row }">
					<div
						:style="{
							display: 'flex',
							'flex-direction': 'column',
							'align-items': 'center',
						}"
					>
						<div :style="{ display: 'flex', flexDirection: 'row' }">
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
									[...new Set(row.secondWarehouse?.split(';') || [])].length > 1
								"
							>
								<el-popover placement="right" :width="300" trigger="click">
									<template #reference>
										<span
											style="color: #2e5cf6; margin-left: 5px; cursor: pointer"
										>
											+{{
												[...new Set(row.secondWarehouse?.split(';') || [])]
													.length - 1
											}}
										</span>
									</template>
									<div>
										<span
											v-for="(value, index) in [
												...new Set(row.secondWarehouse?.split(';') || []),
											]"
											:key="index"
										>
											{{ value }}<br />
										</span>
									</div>
								</el-popover>
							</div>
						</div>
					</div>
				</template>

				<template #totalVolume="{ row }"
					>{{ row.totalVolume || '---' }}(m³)</template
				>
				<template #totalGrossWeight="{ row }"
					>{{ row.totalGrossWeight || '---' }}(kg)</template
				>
				<template #totalNetWeight="{ row }"
					>{{ row.totalNetWeight || '---' }}(kg)</template
				>

				<template #actualDepartureTime="{ row }">
					<div style="text-align: left">
						预计开船:{{ row.scheduledDepartureTime || '---' }}
					</div>
					<div style="text-align: left">
						云当开船(预计):{{ row.estimatedDepartureTime || '---' }}
					</div>
					<div style="text-align: left">
						实际开船:{{ row.actualDepartureTime || '---' }}
					</div>
				</template>

				<template #actualArrivalTime="{ row }">
					<div style="text-align: left">
						预计到港:{{ row.scheduledArrivalPortTime || '---' }}
					</div>
					<div style="text-align: left">
						云当到港(预计):{{ row.estimatedArrivalTime || '---' }}
					</div>
					<div style="text-align: left">
						实际到港:{{ row.actualArrivalTime || '---' }}
					</div>
				</template>

				<template #actualInboundTimeFirst="{ row }">
					<div style="text-align: left">
						预计入库(第一目的仓)时间:{{
							row.scheduledInboundTimeFirst || '---'
						}}
					</div>
					<div style="text-align: left">
						实际入库(第一目的仓)时间:{{ row.actualInboundTimeFirst || '---' }}
					</div>
				</template>

				<template #tsLoadingTime="{ row }">
					<div style="text-align: left">
						中转装船TSLB:{{ row.tsLoadingTime || '---' }}
					</div>
					<div style="text-align: left">
						中转开船TSDP:{{ row.tsDepartureTime || '---' }}
					</div>
					<div style="text-align: left">
						中转抵港TSBA:{{ row.tsArrivalTime || '---' }}
					</div>
					<div style="text-align: left">
						中转卸船TSDC:{{ row.tsDischargingTime || '---' }}
					</div>
				</template>

				<template #action="{ row }">
					<div class="flex items-center">
						<el-button
							text
							type="primary"
							class="mr20"
							@click="openDialog('edit', row)"
							v-auth="'tracker_edit'"
						>
							{{ $t('编辑') }}
						</el-button>
						<el-button
							text
							type="primary"
							class="mr20"
							@click="openDialog('log', row)"
						>
							{{ $t('日志') }}
						</el-button>
					</div>
				</template>
			</BaseTable>
		</div>
		<FormDialog
			ref="formDialog"
			:rowData="currentRow"
			:title="addDialogTitle"
			:dictMap="dictMap"
			@save="getDataList"
		/>
		<!-- 日志对话框 -->
		<LogDialog
			v-model="logDialogVisible"
			:id="currentRow.id"
			:biz-type="['FIRST_MILE_LOGISTICS']"
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
			:title="importDialogTitle"
			:templateUrl="templateUrl"
			:excelUploadApi="excelUploadApi"
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
// 3.导入接口以及表单hook
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { getColumns } from './config/index';
import ExpandTable from './components/ExpandTable.vue';
import { reactive, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

// 组件引入
const AdvancedSearchStyle = defineAsyncComponent(
	() => import('/@/components/TableFormModule/advanced-search-style.vue')
);
const FormDialog = defineAsyncComponent(
	() => import('./components/form-dialog.vue')
);
const SelectDate = defineAsyncComponent(
	() => import('/@/components/TableFormModule/select-date.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
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

import { useI18n } from 'vue-i18n';

import { auth } from '/@/utils/authFunction';

// 字典处理函数
import { useMultipleDicts } from '/@/hooks/multipleDicts';

// 字典钩子
import {
	getPlatformList,
	getThirdformList,
	getPlatThirdformList,
	getHeaderTrackPage,
	freightForwarDerdetails,
	getFirstMileLogistics,
	getExportDetail,
	getExportCabinet,
	reSubscribe,
} from '/@/api/materialFlow/headerTracker/index';

import { useMessage } from '/@/hooks/message';

const { t } = useI18n();
const route = useRoute();

const showSearch = ref(true);
const logDialogVisible = ref(false);

const getCombinedWarehouseList = async () => {
	const [res1, res2] = await getPlatThirdformList();
	const list1 = res1.code === 0 ? res1.data || [] : [];
	const list2 = res2.code === 0 ? res2.data || [] : [];
	return {
		code: 0,
		data: [...list1, ...list2],
	};
};

// 初始化表单state，包括查询表单、分页、loading、数据列表、排序等、
// state.queryForm是获取数据的最重要的参数，实例中所有的表单数据都绑定到state.queryForm上，通过state.queryForm获取数据，然后获取新数据也是通过state.queryForm获取数据，
// state.dataList是获取的数据列表，初始化调用
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getHeaderTrackPage as any,
	columns: getColumns(),
	loading: false,
	ascs: [],
	createdIsNeed: true,
	descs: ['create_time'],
	toolBarConfig: {
		handleRefresh: () => {
			getDataList();
		},
		isShowExport: false,
	},
});

// 4.初始化查询表单，包括查询表单的label、placeholder、type、options等
state.queryForm = {
	current: 1,
	size: 10,
	status: 1, // 默认启用
};

const resetQuery = () => {
	state.queryForm = {
		current: 1,
		size: 10,
		status: 1, // 默认启用
	};
	if (state.pagination) {
		state.pagination.current = 1;
		state.pagination.size = 10;
	}
	getDataList();
};

// 获取筛选条件字典
const baseTableRef = ref();
const tableAttrs = {
	rowConfig: { keyField: 'id', isHover: true },
	cellConfig: { height: 120 },
	checkboxConfig: {
		reserve: true,
		highlight: true,
		trigger: 'checkbox',
	},
	scrollY: {
		enabled: true,
		gt: 20,
		oSize: 6,
	},
};
// 5.把创建的state传入hook的useTable方法，hook会自动处理hook内部逻辑（初始化state.dataList），并返回对应的一些例如获取新数据方法(getDataList)
const { register, getDataList, tableRef } = useTable(state, baseTableRef);
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
		isAuto: true,
		tableRef,
	}
);

const handleToggleRowExpand = async (params: any) => {
	const { row, expanded } = params;
	if (expanded) {
		row.isExpand = true;
	} else {
		row.isExpand = false;
	}
};

// 多选事件
// const handleSelectionChange = (selection: any[]) => {
// 	// 保存选中的行数据
// 	selectedRows.value = selection;
// };

// 选中的行数据

// 导入弹窗标题
const importDialogTitle = ref('');
// 导入模板地址
const templateUrl = ref('');
// 导入接口
const excelUploadApi = ref('');
const importDialogRef = ref();
const handleCommand = (type: string) => {
	switch (type) {
		case 'FirstLegWaybillUpdate':
			importDialogTitle.value = '导入更新信息';
			templateUrl.value = '/files/import-template/头程物流更新单导入模板.xlsx';
			excelUploadApi.value = '/tracking/firstMileLogistics/importUpdateList';
			break;
		case 'FirstLegWaybill':
			importDialogTitle.value = '导入头程单';
			templateUrl.value = '/files/import-template/头程物流单导入模板.xlsx';
			excelUploadApi.value = '/tracking/firstMileLogistics/importList';
			break;
		case 'FirstLegHistoryData':
			importDialogTitle.value = '导入历史数据';
			templateUrl.value = '/files/import-template/头程历史数据导入模板.xlsx';
			excelUploadApi.value = '/tracking/firstMileLogistics/importHistoryList';
			break;
	}
	importDialogRef.value.show();
};

// 点击行展开
const exportApiMap: Record<string, Function> = {
	export: getFirstMileLogistics,
	exportCabinet: getExportCabinet,
	exportDetail: getExportDetail,
};
// 导出
const handleExport = async (type: string = 'export') => {
	try {
		const ids =
			tableRef.value?.getCheckboxRecords(true)?.map((item: any) => item.id) ||
			[];

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
		addDialogTitle.value = '添加头程单';
		formDialog.value.handleOpen(currentRow.value);
	} else if (type === 'edit') {
		const res = await freightForwarDerdetails({ id: row.id });
		if (res.code !== 0) {
			useMessage().error(res.msg || '获取数据失败');
			return;
		}
		currentRow.value = { ...res.data };
		addDialogTitle.value = '编辑头程单';
		formDialog.value.handleOpen(currentRow.value);
	} else if (type === 'log') {
		logDialogVisible.value = true;
		currentRow.value = row;
	} else if (type === 'reSubscribe') {
		//
		const ids =
			tableRef.value?.getCheckboxRecords(true)?.map((item: any) => item.id) ||
			[];
		// 创建货柜
		if (ids.length === 0) {
			useMessage().warning(t('请至少选择一条数据'));
			return;
		}
		// 调用重新订阅接口
		const res = await reSubscribe({ ids: ids });
		if (res.code !== 0) {
			useMessage().error(res.data || '获取数据失败');
			return;
		}
		useMessage().success(res.data);
		getDataList();
	}
};

// 页面初始化时处理URL参数
onMounted(() => {
	const notifyType = route.query.notify_type as string;

	if (notifyType) {
		// 所有非退运中的货物状态：已出货、已开船、已到港、海关查验中、已提柜、已入海外仓、已入中转仓、已入平台仓
		const nonReturnCargoStatus = ['1', '2', '3', '4', '6', '7', '8', '9'];

		switch (notifyType) {
			case '开船延期':
				// 将【开船是否准时】状态为【延期】，且货物状态不为【退运中】
				state.queryForm.departureOntimes = ['3']; // 3表示延期
				state.queryForm.cargoStatus = nonReturnCargoStatus;
				break;
			case '到港延期':
				// 将【到港是否准时】状态为【延期】，且货物状态不为【退运中】
				state.queryForm.arrivalOntimes = ['3']; // 3表示延期
				state.queryForm.cargoStatus = nonReturnCargoStatus;
				break;
			case '提柜送仓不准时':
				// 将【提柜是否准时】状态为【不准时】，且货物状态不为【退运中】
				state.queryForm.pickupOntimes = ['4']; // 4表示不准时
				state.queryForm.cargoStatus = nonReturnCargoStatus;
				break;
			case '还空柜延期':
				// 将【还空是否准时】状态为【延期】，且货物状态不为【退运中】
				state.queryForm.returnEmptyOntimes = ['3']; // 3表示延期
				state.queryForm.cargoStatus = nonReturnCargoStatus;
				break;
		}

		// 如果设置了筛选条件，则重新获取数据
		if (
			state.queryForm.departureOntimes ||
			state.queryForm.arrivalOntimes ||
			state.queryForm.pickupOntimes ||
			state.queryForm.returnEmptyOntimes
		) {
			getDataList();
		}
	}
});
</script>
