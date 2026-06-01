<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<!-- search选择参数选择行 -->
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
												label: '发货单号',
												value: 'deliveryNos',
											},
											{
												label: '提货单号',
												value: 'pickupNos',
											},
											{
												label: '需求单号',
												value: 'demandNos',
											},
											{
												label: '采购订单',
												value: 'purchaseNos',
											},
											{
												label: '订柜号',
												value: 'orderContainerNos',
											},
											{
												label: '平台入库单',
												value: 'shipmentIds',
											},
											{
												label: '送仓码/关联单号',
												value: 'referenceIds',
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
												label: 'SKU',
												value: 'skuCodes',
											},
											{
												label: 'MSKU',
												value: 'mskuCodes',
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
									:settings="{
										width: '200px',
										code: 'statusList',
										text: '状态',
										getTreeDataParams: 'delivery_plan_status',
										searchFn: getDataList,
									}"
									@change="getDataList"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="country"
									:settings="{
										width: '200px',
										code: 'countryCodes',
										text: '国家',
										searchFn: getDataList,
									}"
									@change="getDataList"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="dicts"
									:settings="{
										width: '220px',
										code: 'platformChannelCodes',
										text: '平台渠道',
										getTreeDataParams: 'platform_channel',
										searchFn: getDataList,
									}"
									@change="getDataList"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="dicts"
									:settings="{
										width: '220px',
										code: 'shippingMethods',
										text: '发货方式',
										getTreeDataParams: 'shipping_method',
										searchFn: getDataList,
									}"
									@change="getDataList"
								/>
							</el-form-item>
							<el-form-item>
								<el-select
									collapse-tags
									:max-collapse-tags="1"
									clearable
									filterable
									multiple
									@change="getDataList"
									v-model="state.queryForm.platformWarehouseCodes"
									placeholder="平台仓库"
								>
									<el-option
										v-for="item in dictMap.platformList"
										:key="item.warehouseCode"
										:label="item.warehouseName"
										:value="item.warehouseCode"
									/>
								</el-select>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="basePort"
									:settings="{
										code: 'startPortCodes',
										text: '起始港口',
										searchFn: getDataList,
									}"
									@change="getDataList"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="basePort"
									:settings="{
										code: 'destPortCodes',
										text: '目的港口',
										searchFn: getDataList,
									}"
									@change="getDataList"
								/>
							</el-form-item>
							<el-form-item>
								<el-select
									collapse-tags
									:max-collapse-tags="1"
									clearable
									filterable
									multiple
									@change="getDataList"
									v-model="state.queryForm.tags"
									placeholder="异常风险标签"
								>
									<el-option
										v-for="item in dictMap.tagList"
										:key="item.id"
										:label="`${item.name}`"
										:value="item.id"
									/>
								</el-select>
							</el-form-item>
						</template>

						<!-- 展开项 -->
						<template #second>
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
												label: '预计装柜时间',
												value: 'estimatedLoadingTime',
												isAddHMS: true,
												dateStart: 'estimatedLoadingTimeStart',
												dateEnd: 'estimatedLoadingTimeEnd',
											},
											{
												label: '实际装柜时间',
												value: 'actualOutStockDate',
												isAddHMS: true,
												dateStart: 'actualLoadingTimeStart',
												dateEnd: 'actualLoadingTimeEnd',
											},
											{
												label: '工厂回复交期',
												value: 'factoryDeliveryDate',
												isAddHMS: false,
												dateStart: 'factoryDeliveryDateStart',
												dateEnd: 'factoryDeliveryDateEnd',
											},
											{
												label: '计划发货时间',
												value: 'planShipmentDate',
												isAddHMS: false,
												dateStart: 'planShipmentDateStart',
												dateEnd: 'planShipmentDateEnd',
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
									:settings="{
										width: '220px',
										code: 'purchaseUserIds',
										text: '采购员',
										getTreeDataParams: {
											postCodeList: [
												'PURCHASING_DIRECTOR',
												'PURCHASING_MANAGER',
												'PROCUREMENT_MANAGER',
												'PURCHASING_OFFICER',
											],
										},
										searchFn: getDataList,
									}"
									@change="getDataList"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="dicts"
									:settings="{
										width: '220px',
										code: 'orderTypes',
										text: '订单类型',
										getTreeDataParams: 'purchase_demand_order_type',
										searchFn: getDataList,
									}"
									@change="getDataList"
								/>
							</el-form-item>

							<el-form-item>
								<el-tree-select
									@change="getDataList"
									v-model="state.queryForm.deptIds"
									placeholder="部门和小组"
									show-checkbox
									fit-input-width
									clearable
									multiple
									collapse-tags
									:max-collapse-tags="1"
									style="width: 220px"
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
										width: '220px',
										code: 'operationUserIds',
										text: '运营人',
										getTreeDataParams: {
											lockFlag: 0,
										},
										searchFn: getDataList,
									}"
									@change="getDataList"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="userList"
									:settings="{
										width: '220px',
										code: 'createIds',
										text: '创建人',
										getTreeDataParams: {
											lockFlag: 0,
										},
										searchFn: getDataList,
									}"
									@change="getDataList"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="dicts"
									:settings="{
										width: '220px',
										code: 'specialAttributeList',
										text: '产品特殊属性',
										getTreeDataParams: 'special_attribute',
										searchFn: getDataList,
									}"
									@change="getDataList"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="dicts"
									:settings="{
										width: '220px',
										code: 'cargoTypeList',
										text: '货型',
										getTreeDataParams: 'cargo_type',
										searchFn: getDataList,
									}"
									@change="getDataList"
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
												isAddHMS: true,
												dateStart: 'createTimeStart',
												dateEnd: 'createTimeEnd',
												defaultMonthsAgo: 12,
											},
										]"
										:getDataList="getDataList"
									/>
								</div>
							</el-form-item>
						</template>

						<!-- 右侧操作项 -->
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
							</el-form-item>
						</template>
					</AdvancedSearchStyle>
				</el-form>
			</el-row>

			<!-- 数据展示表格 -->
			<BaseTable
				:register="register"
				ref="baseTableRef"
				@checkbox-change="handleCheckboxChange"
				@checkbox-all="handleCheckboxChange"
			>
				<template #left-tool>
					<el-button
						class="ml10"
						color="#d9001b"
						@click="openDialog('del')"
						v-auth="'deliveryPlan_del'"
					>
						{{ $t('删除') }}</el-button
					>
					<el-button
						class="ml10"
						@click="openDialog('create')"
						v-auth="'deliveryPlan_create'"
					>
						{{ $t('创建货柜') }}</el-button
					>
					<el-button
						class="ml10"
						@click="openDialog('join')"
						v-auth="'deliveryPlan_join'"
					>
						{{ $t('加入货柜') }}</el-button
					>
					<el-button
						class="ml10"
						@click="openDialog('shift')"
						v-auth="'deliveryPlan_shift'"
					>
						{{ $t('移出货柜') }}</el-button
					>
					<el-button
						class="ml10"
						v-auth="'deliveryPlan_modifytime'"
						@click="openDialog('modifyDeliveryTime')"
					>
						{{ $t('修改计划发货时间') }}</el-button
					>
					<el-button
						class="ml10"
						v-auth="'deliveryPlan_remark'"
						@click="openDialog('modifyRemark')"
					>
						{{ $t('物流备注') }}</el-button
					>
					<el-button
						class="ml10"
						v-auth="'deliveryPlan_maintainContainerTime'"
						@click="openDialog('maintainContainerTime')"
					>
						{{ $t('维护初始预计装柜时间') }}</el-button
					>
					<el-button
						class="ml10"
						v-auth="'deliveryPlan_maintainChangedContainerTime'"
						@click="openDialog('maintainChangedContainerTime')"
					>
						{{ $t('维护变更后预计装柜时间') }}</el-button
					>
					<el-button
						class="ml10"
						v-auth="'deliveryPlan_maintainLogisticsStaff'"
						@click="openDialog('maintainLogisticsStaff')"
					>
						{{ $t('维护物流人员') }}</el-button
					>
					<el-button
						class="ml10"
						v-auth="'deliveryPlan_batchPreservePackageInfo'"
						@click="openDialog('batchPreservePackageInfo')"
					>
						批量维护货件
					</el-button>
					<el-button
						class="ml10"
						v-auth="'deliveryPlan_batchUploadShipmentLabels'"
						@click="openDialog('batchUploadShipmentLabels')"
					>
						上传货件标签
					</el-button>
					<el-button
						class="ml10"
						v-auth="'deliveryPlan_remindOperationCreateShipment'"
						@click="openDialog('remindOperationCreateShipment')"
					>
						提醒运营创建货件
					</el-button>
				</template>
				<template #anomalyRiskLabel="{ row }">
					<div
						class="tag-item"
						v-for="item in row.tagList"
						:key="item.id"
						:style="{ color: item.color }"
					>
						<span v-if="item.name">
							{{ item.name }}
						</span>
					</div>
				</template>
				<template #storeName="{ row }">
					{{
						row?.storeName
							? `${row.storeName}:${row.countryCode || '---'}`
							: '---'
					}}
				</template>
				<template #status="{ row }">
					{{ row.statusText || '---' }}
				</template>
				<template #countryCode="{ row }">
					{{ row.countryCode || '---' }}-{{ row.countryName || '---' }}
				</template>
				<template #firstOrderFlag="{ row }">
					{{ row.firstOrderFlag === 1 ? '是' : '否' }}
				</template>
				<template #platformShipmentId="{ row }">
					{{ row?.channelShipmentInfo?.shipmentId || '---' }}
				</template>
				<template #barcode="{ row }">
					{{ row?.channelShipmentInfo?.barcode || '---' }}
				</template>
				<template #referenceId="{ row }">
					{{ row?.channelShipmentInfo?.referenceId || '---' }}
				</template>
				<template #specialAttributeTextList="{ row }">
					{{ row?.specialAttributeTextList?.join(',') || '---' }}
				</template>
				<template #shippingMarkAttachmentUrl="{ row }">
					<el-link
						@click="openPreviewDialog(row.shippingMarkAttachmentUrl)"
						type="primary"
						:style="{
							width: '150px',
							display: 'inline-block',
							overflow: 'hidden',
							whiteSpace: 'nowrap',
							textOverflow: 'ellipsis',
						}"
						v-if="row.shippingMarkAttachmentUrl"
						>{{
							row.shippingMarkAttachmentOriginalName
								? row.shippingMarkAttachmentOriginalName
								: '---'
						}}</el-link
					>
					<template v-else>---</template>
				</template>
				<template #barcodeAttachmentUrl="{ row }">
					<el-link
						type="primary"
						:style="{
							width: '150px',
							display: 'inline-block',
							overflow: 'hidden',
							whiteSpace: 'nowrap',
							textOverflow: 'ellipsis',
						}"
						@click="openPreviewDialog(row.barcodeAttachmentUrl)"
						v-if="row.barcodeAttachmentUrl"
						>{{
							row.barcodeAttachmentOriginalName
								? row.barcodeAttachmentOriginalName
								: '---'
						}}</el-link
					>
					<template v-else>---</template>
				</template>
				<template #transparencyAttachmentUrl="{ row }">
					<el-link
						@click="openPreviewDialog(row.transparencyAttachmentUrl)"
						type="primary"
						:style="{
							width: '150px',
							display: 'inline-block',
							overflow: 'hidden',
							whiteSpace: 'nowrap',
							textOverflow: 'ellipsis',
						}"
						v-if="row.transparencyAttachmentUrl"
						>{{
							row.transparencyAttachmentOriginalName
								? row.transparencyAttachmentOriginalName
								: '---'
						}}</el-link
					>
					<template v-else>---</template>
				</template>
				<template #action="{ row }">
					<div class="flex items-center table-action">
						<!--
							维护货件信息：待拼柜/已拼柜/已订舱 + 入平台仓；
							是否「货件维护国家已配置」仅看列表行字段 shipmentCountryConfigFlag（后端计算，勿前端推断）。
						-->
						<el-dropdown
							placement="bottom-end"
							trigger="click"
							v-if="
								canShowPreservePackageInfo(row) ||
								row.status === OrderStatus.WAIT_LCL
							"
						>
							<span class="el-dropdown-link">
								{{ $t('操作') }}
								<el-icon class="el-icon--right"><arrow-down /></el-icon>
							</span>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item
										v-if="
											canShowPreservePackageInfo(row) &&
											auth('deliveryPlan_preservePackageInfo')
										"
										@click="
											() => {
												currentRow = row;
												preservePackageInfoDialogVisible = true;
											}
										"
									>
										{{ $t('维护货件信息') }}
									</el-dropdown-item>
									<!-- 状态待拼柜/已拼柜/已订舱 + 入平台仓 + 货件维护国家未命中（与 canShowPreservePackageInfo 一致） -->
									<el-dropdown-item
										v-if="
											canShowPreservePackageInfo(row) && auth('deliveryPlan_up')
										"
										v-auth="'deliveryPlan_up'"
										@click="
											() => {
												currentRow = row;
												upFileRef.show();
											}
										"
									>
										{{ $t('上传标签') }}
									</el-dropdown-item>
									<!-- 状态为【待拼柜】的发货计划可以展示及操作 -->
									<el-dropdown-item
										v-if="row.status === OrderStatus.WAIT_LCL"
										v-auth="'deliveryPlan_split'"
										@click="
											() => {
												currentRow = row;
												splitPlanRef.show();
											}
										"
									>
										{{ $t('拆分') }}
									</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
						<el-button
							text
							type="primary"
							@click="openDialog('log', row)"
							v-auth="'deliveryPlan_log'"
							>{{ $t('日志') }}
						</el-button>
					</div>
				</template>
			</BaseTable>
		</div>
		<!-- 维护货件信息：关闭后刷新列表以便查看日志与列表字段回显 -->
		<PreservePackageInfoDialog
			v-model="preservePackageInfoDialogVisible"
			:current-row="currentRow"
			:title="t('维护货件信息')"
			@close-dialog="onPreservePackageInfoDialogClose"
		/>
		<!-- 日志对话框 -->
		<LogDialog
			v-model="logDialogVisible"
			:id="currentRow.id"
			:biz-type="['LOGISTICS_DELIVERY_PLAN']"
			:showSearchForm="false"
			:showToolBar="false"
			@closeDialog="
				() => {
					logDialogVisible = false;
				}
			"
		/>
		<!-- 附件上传 -->
		<UpFile
			ref="upFileRef"
			:currentRow="currentRow"
			:show-icon="true"
			:icon-type="'info'"
			:cancel-button-text="$t('取消')"
			:confirm-button-text="$t('确认')"
			:confirm-button-type="'primary'"
			:width="'500px'"
			@confirm="
				(e) => {
					confirmUpFile(e);
				}
			"
			@cancel="
				() => {
					upFileRef.hide();
				}
			"
		/>
		<!-- 拆分计划 -->
		<SplitPlan
			ref="splitPlanRef"
			:currentRow="currentRow"
			:show-icon="true"
			:icon-type="'info'"
			:cancel-button-text="$t('取消')"
			:confirm-button-text="$t('确认')"
			:confirm-button-type="'primary'"
			:width="'600px'"
			@confirm="
				(e) => {
					confirmSplitPlan(e);
				}
			"
			@cancel="
				() => {
					splitPlanRef.hide();
				}
			"
		/>
		<!-- 创建货柜 -->
		<CreateContainer
			ref="createContainerRef"
			:selectedRows="selectedRows"
			:show-icon="false"
			:icon-type="'info'"
			:cancel-button-text="$t('取消')"
			:confirm-button-text="$t('确认')"
			:confirm-button-type="'primary'"
			width="'80%'"
			:dictMap="dictMap"
			@confirm="
				(e) => {
					confirmCreateContainer(e);
				}
			"
			@cancel="
				() => {
					createContainerRef.hide();
				}
			"
		/>
		<!-- 加入货柜 -->
		<JoinContainer
			ref="joinContainerRef"
			:selectedRows="selectedRows"
			:show-icon="false"
			:icon-type="'info'"
			:cancel-button-text="$t('取消')"
			:confirm-button-text="$t('确认')"
			:confirm-button-type="'primary'"
			width="80%"
			:dictMap="dictMap"
			@confirm="
				(e) => {
					confirmJoinContainer(e);
				}
			"
			@cancel="
				() => {
					joinContainerRef.hide();
				}
			"
		/>
		<!-- 批量备注 -->
		<AddRemark
			ref="addRemarkRef"
			:selectedRows="selectedRows"
			:show-icon="false"
			:icon-type="'info'"
			:cancel-button-text="$t('取消')"
			:confirm-button-text="$t('确认')"
			:confirm-button-type="'primary'"
			:width="'500px'"
			@confirm="
				() => {
					addRemarkRef.hide();
					getDataList();
				}
			"
			@cancel="
				() => {
					addRemarkRef.hide();
				}
			"
		/>
		<ModifyDeliveryTime @save="refreshTable" ref="modifyDeliveryTimeRef" />

		<maintainContainerTime
			ref="maintainContainerTimeRef"
			:selectedRows="selectedRows"
			:show-icon="false"
			:icon-type="'info'"
			:cancel-button-text="$t('取消')"
			:confirm-button-text="$t('确认')"
			:confirm-button-type="'primary'"
			:width="'600px'"
			@confirm="
				() => {
					maintainContainerTimeRef.hide();
					getDataList();
				}
			"
			@cancel="
				() => {
					maintainContainerTimeRef.hide();
				}
			"
		/>

		<maintainChangedContainerTime
			ref="maintainChangedContainerTimeRef"
			:selectedRows="selectedRows"
			:show-icon="false"
			:icon-type="'info'"
			:cancel-button-text="$t('取消')"
			:confirm-button-text="$t('确认')"
			:confirm-button-type="'primary'"
			:width="'600px'"
			@confirm="
				() => {
					maintainChangedContainerTimeRef.hide();
					getDataList();
				}
			"
			@cancel="
				() => {
					maintainChangedContainerTimeRef.hide();
				}
			"
		/>
		<maintainLogisticsStaff
			ref="maintainLogisticsStaffRef"
			:selectedRows="selectedRows"
			:show-icon="false"
			:icon-type="'info'"
			:cancel-button-text="$t('取消')"
			:confirm-button-text="$t('确认')"
			:confirm-button-type="'primary'"
			:width="'600px'"
			@confirm="
				() => {
					maintainLogisticsStaffRef.hide();
					getDataList();
				}
			"
			@cancel="
				() => {
					maintainLogisticsStaffRef.hide();
				}
			"
		/>
		<!-- 批量维护货件（模板按筛选/勾选导出，导入同提货计划批量维护货件） -->
		<ImportDialog
			ref="batchPreservePackageInfoRef"
			title="批量维护货件"
			:showExpandTip="`PS:下载模板时,会根据筛选条件带出发货计划默认数据（发货单号、MSKU、计划发货日期、运输方式等）；勾选记录时仅导出勾选范围内的数据`"
			excelUploadApi="/mcp/deliveryPlan/preservePackageInfoBatch"
			:accept="'.xlsx,.xls'"
			@refreshDataList="onBatchPreserveOrLabelRefresh"
			@downloadTemplate="downloadBatchPreserveTemplate"
		/>
		<!-- 批量上传货件标签（交互与命名规则同提货计划上传货件标签） -->
		<UploadShipmentLabelDialog
			ref="batchUploadShipmentLabelRef"
			title="上传货件标签"
			:cancel-button-text="t('取消')"
			:confirm-button-text="t('确认')"
			:current-row="{}"
			:width="'1000px'"
			:upload-tips="batchUploadShipmentLabelTips"
			@confirm="confirmBatchUploadShipmentLabels"
			@cancel="() => batchUploadShipmentLabelRef?.hide()"
		/>
	</div>
</template>

<script setup lang="ts">
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive, computed } from 'vue';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { deptTree } from '/@/api/admin/dept';
import { getDicts } from '/@/api/admin/dict';
import {
	getDeliveryPlanPage,
	postDeleteDeliveryPlan,
	getExportDeliveryPlan,
	getExportDeliveryPlanPreservePackageInfo,
	getListByCondition,
	getTagList,
	postUploadLabel,
	postSplitDeliveryPlan,
	postOrderContainerCheckOrderContainer,
	postOrderContainerAddOrderContainer,
	postOrderContainerCheckOrderContainerState,
	postOrderContainerOutOrderContainer,
	postOrderContainerInsertOrderContainer,
	postImportDeliveryPlanPackageAttachments,
	postRemindCreateShipment,
} from '/@/api/materialFlow/deliveryPlan/index';
import { getUserListByCondition } from '/@/api/admin/user';
import { sysCountryList } from '/@/api/materialFlow/track';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { getSupplierInfoList } from '/@/api/purchase/supplierSku/index';
import { getPlatformList } from '/@/api/mcp/collectionPlan/index';
import { useResultDialog } from '/@/hooks/useResultDialog';
import { usePreviewDialog } from '/@/components/FilePreviewDialog/usePreviewDialog/index';
import { columns } from './config/index';
import { OrderStatus } from './config/enmue';
import { auth } from '/@/utils/authFunction';
const BaseTable = defineAsyncComponent(
	() => import('/@/components/BaseTable/index.vue')
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
const UpFile = defineAsyncComponent(() => import('./components/upFile.vue'));
const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);
/** 批量上传货件标签（与提货计划 uploadLabel 交互、命名规则一致） */
const UploadShipmentLabelDialog = defineAsyncComponent(
	() => import('/@/views/mcp/collectionPlan/components/uploadLabel.vue')
);
/** 维护货件信息弹窗（与提货计划组件同名 preservePackageInfo-dialog） */
const PreservePackageInfoDialog = defineAsyncComponent(
	() => import('./components/preservePackageInfo-dialog.vue')
);
const SplitPlan = defineAsyncComponent(
	() => import('./components/splitPlan.vue')
);
const CreateContainer = defineAsyncComponent(
	() => import('./components/createContainer.vue')
);
const JoinContainer = defineAsyncComponent(
	() => import('./components/joinContainer.vue')
);
const AddRemark = defineAsyncComponent(
	() => import('./components/addRemark.vue')
);
import ModifyDeliveryTime from './components/modifyDeliveryTime.vue';
import maintainContainerTime from './components/maintainContainerTime.vue';
import maintainChangedContainerTime from './components/maintainChangedContainerTime.vue';
import maintainLogisticsStaff from './components/maintainLogisticsStaff.vue';

const { open } = useResultDialog();
const { open: openPreviewDialog } = usePreviewDialog();
// table的引用
const baseTableRef = ref();
const { t } = useI18n();

// 搜索变量
const queryRef = ref();
// 是否显示搜索
const showSearch = ref(true);
// 高级搜索布局的引用
const AdvancedSearchStyleRef = ref();
// 上传组件的引用
const upFileRef = ref();
/** 批量维护货件 — 导入弹窗 */
const batchPreservePackageInfoRef = ref();
/** 批量上传货件标签弹窗 */
const batchUploadShipmentLabelRef = ref();

/** 与提货计划「上传货件标签」一致的附件命名与格式说明 */
const batchUploadShipmentLabelTips = [
	'附件命名必须为【发货单号-箱唛附件，发货单号-条码附件，发货单号-透明标签】格式,如：SP202604280001-箱唛附件',
	'必须一次性上传完成，箱唛、条码必传,透明标签非必传',
	'仅支持PDF、PNG、JPG格式附件',
];
// 拆分计划的引用
const splitPlanRef = ref();
// 创建货柜的引用
const createContainerRef = ref();
// 加入货柜的引用
const joinContainerRef = ref();
// 当前点击的行
const currentRow = ref({
	id: '',
	shipmentQuantity: 0,
});

/** 维护货件信息弹窗显隐（与 el-dialog v-model 绑定） */
const preservePackageInfoDialogVisible = ref(false);

/**
 * 是否满足「入平台仓 + 待拼柜/已拼柜/已订舱 + 货件维护国家未命中」。
 * 用于「上传标签」展示；其取反用于「维护货件信息」展示（见模板）。
 * 列表行 `shipmentCountryConfigFlag` 由后端计算，见 `CollectionPlanVo`。
 */
const canShowPreservePackageInfo = (row: Record<string, unknown>) => {
	const st = row.status as number;
	if (
		st !== OrderStatus.WAIT_LCL &&
		st !== OrderStatus.ALREADY_LCL &&
		st !== OrderStatus.ALREADY_BOOKING
	) {
		return false;
	}
	if (row.shippingMethod !== 'enter_platform_warehouse') {
		return false;
	}
	return row.shipmentCountryConfigFlag === false;
};

/** 弹窗关闭：收起弹窗并刷新列表 */
const onPreservePackageInfoDialogClose = () => {
	preservePackageInfoDialogVisible.value = false;
	getDataList();
};

/**
 * 发货计划列表需要展示合计的字段。
 * 当前需求仅统计以下 4 列，其他列在 footer 中保持空白。
 */
const summaryFields = [
	'cartons',
	'totalVolume',
	'totalNetWeight',
	'totalGrossWeight',
];

/**
 * 将任意值安全转换为数字，避免 NaN 影响合计结果。
 */
const toNumber = (value: unknown) => {
	const num = Number(value);
	return Number.isFinite(num) ? num : 0;
};

/**
 * 获取当前勾选数据（仅当前页勾选，不含跨页保留）。
 */
const getSelectedRowsForSummary = () => {
	return register?.safeCallTableMethod('getCheckboxRecords') || [];
};

/**
 * 页面级合计方法（覆盖 BaseTable 默认 sumList 合计）：
 * 1) 有勾选：按“当前勾选项”合计；
 * 2) 无勾选：按“当前页数据”合计。
 */
function deliverySummaryMethod(param: { columns: any[]; data: any[] }) {
	const { columns = [], data = [] } = param || {};
	const selectedRows = getSelectedRowsForSummary();
	// 有勾选时优先按勾选数据统计，否则按当前页数据统计
	const sourceRows = selectedRows.length > 0 ? selectedRows : data;
	const sums: (string | number)[] = [];

	columns.forEach((column: any, index: number) => {
		if (index === 0) {
			sums[index] = '合计';
			return;
		}
		const field = column?.field || column?.property;
		if (!field || !summaryFields.includes(field)) {
			sums[index] = '';
			return;
		}
		const total = sourceRows.reduce((sum: number, row: any) => {
			return sum + toNumber(row?.[field]);
		}, 0);
		// 展示规则：总箱数按整数，其余三个指标按 2 位小数
		sums[index] = field === 'cartons' ? String(total) : total.toFixed(2);
	});

	return [sums];
}

/**
 * 勾选变化后手动刷新 footer，保证合计值实时更新。
 */
const refreshFooterSummary = () => {
	register?.safeCallTableMethod('updateFooter');
};

/**
 * 勾选/全选变化统一入口。
 */
const handleCheckboxChange = () => {
	refreshFooterSummary();
};
// 日志对话框是否可见
const logDialogVisible = ref(false);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getDeliveryPlanPage as any,
	columns,
	toolBarConfig: {
		handleRefresh: () => {
			// 在 useTable 之后会重新赋值
		},
		handleExport: () => {
			handleExport();
		},
		settingKey: 'deliveryPlan-index',
	},
	descs: ['update_time', 'delivery_no'],
	// 页面级自定义合计方法：覆盖 BaseTable 默认 sumList 合计逻辑
	summaryMethod: deliverySummaryMethod,
});
//  table hook
const { register, getDataList, tableRef } = useTable(state, baseTableRef);

// 更新 toolBarConfig 中的 handleRefresh
if (state.toolBarConfig) {
	state.toolBarConfig.handleRefresh = () => {
		register?.getDataList();
	};
}

// 计算属性：获取选中的行数据
const selectedRows = computed(() => {
	return register?.safeCallTableMethod('getCheckboxRecords') || [];
});

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
			key: 'platformChannel',
			fetchFn: getDicts,
			params: 'platform_channel',
		}, // 平台 渠道
		{
			key: 'specialAttribute',
			fetchFn: getDicts,
			params: 'special_attribute',
		}, // 产品特殊属性
		{
			key: 'cargoType',
			fetchFn: getDicts,
			params: 'cargo_type',
		}, // 货型
		{
			key: 'deliveryPlanStatus',
			fetchFn: getDicts,
			params: 'delivery_plan_status',
		}, // 发货计划状态
		{
			key: 'shippingMethod',
			fetchFn: getDicts,
			params: 'shipping_method',
		}, // 发货方式
		{
			key: 'purchaseDemandOrderType',
			fetchFn: getDicts,
			params: 'purchase_demand_order_type',
		}, // 订单类型
		{
			key: 'productManageId',
			fetchFn: getUserListByCondition,
			params: { lockFlag: 0 },
		}, // 人员列表
		{
			key: 'purchaseDemandStatus',
			fetchFn: getDicts,
			params: 'purchase_demand_status',
		}, // 需求计划的审批状态
		{
			key: 'purchaseUserId',
			fetchFn: getUserListByCondition,
			params: {
				postCodeList: [
					'PURCHASING_DIRECTOR',
					'PURCHASING_MANAGER',
					'PROCUREMENT_MANAGER',
					'PURCHASING_OFFICER',
				],
			},
		}, // 采购人员列表
		{
			key: 'spInfoList',
			fetchFn: getSupplierInfoList,
		}, //供应商列表
		{
			key: 'platformList',
			fetchFn: getPlatformList,
		}, // 查询平台仓库列表
		{
			key: 'listByCondition',
			fetchFn: getListByCondition,
		}, // 国家港口列表
		{
			key: 'transportMethod',
			fetchFn: getDicts,
			params: 'transport_method',
		}, // 运输方式
		{
			key: 'tagList',
			fetchFn: getTagList,
			params: {
				billType: 'LOGISTICS_DELIVERY_PLAN',
			},
		},
	],
	{
		isAuto: true,
		tableRef,
	}
);

// 重置
const resetQuery = () => {
	state.queryForm = {
		current: 1,
		size: 10,
		status: 1, // 默认启用
	};
	getDataList();
};
const modifyDeliveryTimeRef = ref();
const maintainContainerTimeRef = ref();
const maintainChangedContainerTimeRef = ref();
const maintainLogisticsStaffRef = ref();

const addRemarkRef = ref();
// 打开对话框
const openDialog = async (type: string, row?: any) => {
	try {
		if (type === 'del') {
			//
			const ids = register?.getSelectedIds() || [];
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			const selectedRowsData =
				register?.safeCallTableMethod('getCheckboxRecords') || [];
			if (
				selectedRowsData.some(
					(row: any) => row.status === OrderStatus.ALREADY_OUT_STORAGE
				)
			) {
				useMessage().warning('不能勾选状态为【已出库】的发货单');
				return;
			}
			await useMessageBox()
				.confirm(t('是否确认删除选中数据？'))
				.then(async () => {
					const res = await postDeleteDeliveryPlan({ ids });
					if (res?.data?.failCount > 0) {
						// 打开提示框
						open({
							title: t('错误提示'),
							data: res.data,
						});
						return;
					}
					if (res.code === 0) {
						useMessage().success(t('删除成功'));
					}
					register?.safeCallTableMethod('clearCheckboxRow');
					refreshFooterSummary();
					getDataList();
				})
				.catch(() => {});
		} else if (type === 'log') {
			logDialogVisible.value = true;
			currentRow.value = row;
		} else if (type === 'create') {
			//
			const ids = register?.getSelectedIds() || [];
			// 创建货柜
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			const selectedRowsData =
				register?.safeCallTableMethod('getCheckboxRecords') || [];
			if (
				selectedRowsData.some(
					(row: any) => row.status === OrderStatus.ALREADY_OUT_STORAGE
				)
			) {
				useMessage().warning('不能勾选状态为【已出库】的发货单');
				return;
			}
			// 校验是否可以创建货柜
			const res = await postOrderContainerCheckOrderContainer({
				ids,
			});
			if (res?.data?.failCount > 0) {
				// 打开提示框
				open({
					title: t('错误提示'),
					data: res.data,
				});
				return;
			}
			createContainerRef.value?.show();
		} else if (type === 'join') {
			// 加入货柜
			const ids = register?.getSelectedIds() || [];
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			const forbiddenStatuses = [
				OrderStatus.ALREADY_SEND_MAIL,
				OrderStatus.ALREADY_ARRANGE_LOADING,
				OrderStatus.ALREADY_PICKUP,
				OrderStatus.ALREADY_SHIPPED,
				OrderStatus.ALREADY_OUT_STORAGE,
			];

			const invalid = selectedRows.value.some((item: any) =>
				forbiddenStatuses.includes(item.status)
			);

			if (invalid) {
				useMessage().warning(
					'发货计划【已发送工厂邮件、已安排装柜、已提货、已发货、已出库】不可操作加入货柜'
				);
				return;
			}

			// 校验是否可以加入货柜
			const res = await postOrderContainerCheckOrderContainerState({
				ids,
			});
			if (res?.data?.failCount > 0) {
				// 打开提示框
				open({
					title: t('错误提示'),
					data: res.data,
				});
				return;
			}
			joinContainerRef.value?.show();
		} else if (type === 'shift') {
			// 移出货柜
			const ids = register?.getSelectedIds() || [];
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			const res = await postOrderContainerOutOrderContainer({ ids });
			if (res?.data?.failCount > 0) {
				// 打开提示框
				open({
					title: t('错误提示'),
					data: res.data,
				});
				register?.safeCallTableMethod('clearCheckboxRow');
				refreshFooterSummary();
				getDataList();
				return;
			}
			if (res.code === 0) {
				useMessage().success(t('移出成功'));
			}
			register?.safeCallTableMethod('clearCheckboxRow');
			refreshFooterSummary();
			getDataList();
		} else if (type == 'modifyDeliveryTime') {
			const ids = selectedRows.value.map((item: any) => item.id);
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			//检查是否都符合状态(待拼柜1)
			const invalid = selectedRows.value.some(
				(item: any) => item.status !== OrderStatus.WAIT_LCL
			);
			if (invalid) {
				const missingMskuPlans = tableRef.value
					?.getCheckboxRecords()
					?.filter((item: any) => item.status !== OrderStatus.WAIT_LCL)
					.map((item: any) => item.deliveryNo);
				const missingPlans = missingMskuPlans.join('、');

				useMessage().warning(
					`发货计划[${missingPlans}]状态不是待拼柜，请重新确认后再操作！`
				);
				return;
			}
			modifyDeliveryTimeRef.value?.handleOpen(ids);
		} else if (type === 'modifyRemark') {
			if (selectedRows.value.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			addRemarkRef.value?.show();
		} else if (type === 'maintainContainerTime') {
			//维护初始预计装柜时间
			const ids = selectedRows.value.map((item: any) => item.id);
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			//检查是否都符合状态(已拼柜)
			const invalid = selectedRows.value.some(
				(item: any) => item.status !== OrderStatus.ALREADY_LCL
			);
			if (invalid) {
				const missingMskuPlans = tableRef.value
					?.getCheckboxRecords()
					?.filter((item: any) => item.status !== OrderStatus.ALREADY_LCL)
					.map((item: any) => item.deliveryNo);
				const missingPlans = missingMskuPlans.join('、');

				useMessage().warning(
					`发货计划[${missingPlans}]状态不是已拼柜，请重新确认后再操作！`
				);
				return;
			}
			maintainContainerTimeRef.value?.show();
		} else if (type === 'maintainChangedContainerTime') {
			//维护变更后预计装柜时间
			const ids = selectedRows.value.map((item: any) => item.id);
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			//检查是否都符合状态(是已订舱并且发送工厂邮件)
			const invalid = selectedRows.value.some(
				(item: any) =>
					item.status !== OrderStatus.ALREADY_SEND_MAIL &&
					item.status !== OrderStatus.ALREADY_BOOKING
			);
			if (invalid) {
				const missingMskuPlans = tableRef.value
					?.getCheckboxRecords()
					?.filter(
						(item: any) =>
							item.status !== OrderStatus.ALREADY_SEND_MAIL &&
							item.status !== OrderStatus.ALREADY_BOOKING
					)
					.map((item: any) => item.deliveryNo);
				const missingPlans = missingMskuPlans.join('、');

				useMessage().warning(
					`发货计划[${missingPlans}]状态不是已订舱或已发送工厂邮件，请重新确认后再操作！`
				);
				return;
			}
			maintainChangedContainerTimeRef.value?.show();
		} else if (type === 'maintainLogisticsStaff') {
			//维护物流人员
			const ids = selectedRows.value.map((item: any) => item.id);
			if (ids.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			maintainLogisticsStaffRef.value?.show();
		} else if (type === 'batchPreservePackageInfo') {
			batchPreservePackageInfoRef.value?.show();
		} else if (type === 'batchUploadShipmentLabels') {
			const rows = selectedRows.value;
			if (rows.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			const invalid = rows.filter(
				(row: Record<string, unknown>) => !canShowPreservePackageInfo(row)
			);
			if (invalid.length > 0) {
				useMessage().warning(
					`以下发货计划不满足上传货件标签条件（入平台仓、待拼柜/已拼柜/已订舱且货件维护国家未命中）：${invalid
						.map((r: any) => r.deliveryNo)
						.join('、')}`
				);
				return;
			}
			batchUploadShipmentLabelRef.value?.show();
		} else if (type === 'remindOperationCreateShipment') {
			const rows = selectedRows.value;
			if (rows.length === 0) {
				useMessage().warning(t('请至少选择一条数据'));
				return;
			}
			const invalid = rows.filter(
				(row: Record<string, unknown>) => !canShowPreservePackageInfo(row)
			);
			if (invalid.length > 0) {
				useMessage().warning(
					`以下发货计划不满足提醒条件（入平台仓、待拼柜/已拼柜/已订舱且货件维护国家未配置）：${invalid
						.map((r: any) => r.deliveryNo)
						.join('、')}`
				);
				return;
			}
			const ids = register?.getSelectedIds() || [];
			await useMessageBox()
				.confirm(
					t(
						'确认向所选发货计划对应运营发送飞书提醒创建货件？（将记录操作日志）'
					)
				)
				.then(async () => {
					try {
						const res = await postRemindCreateShipment({ ids });
						if (res.code === 0) {
							if (res?.data?.failCount > 0) {
								// 打开提示框
								open({
									title: t('错误提示'),
									data: res.data,
								});
								return;
							} else {
								useMessage().success(t('提醒已发送'));
							}
							register?.safeCallTableMethod('clearCheckboxRow');
							refreshFooterSummary();
							getDataList();
						} else {
							useMessage().error(res.msg || t('操作失败'));
						}
					} catch (error: any) {
						useMessage().error(error?.msg || t('操作失败'));
					}
				})
				.catch(() => {});
		}
	} catch (error: any) {
		useMessage().error(error?.msg || t('错误'));
	}
};

//刷新表格
const refreshTable = () => {
	tableRef?.value.clearCheckboxRow();
	refreshFooterSummary();
	register?.getDataList();
};

/** 批量导入/上传成功后刷新列表与勾选态 */
const onBatchPreserveOrLabelRefresh = () => {
	register?.safeCallTableMethod('clearCheckboxRow');
	refreshFooterSummary();
	getDataList();
};

/** 按筛选与可选勾选导出「批量维护货件信息」 */
const downloadBatchPreserveTemplate = async () => {
	try {
		const records = register?.safeCallTableMethod('getCheckboxRecords') || [];
		const ids = records.map((item: { id: string }) => item.id);
		register.state.loading = true;
		await getExportDeliveryPlanPreservePackageInfo({
			ids,
			...register.state.queryForm,
			ascs: register.state?.ascs,
			descs: register.state?.descs,
			current: 1,
			size: 999999,
		});
	} catch (error) {
		useMessage().error(t(error as string));
	} finally {
		register.state.loading = false;
	}
};

/** 批量上传货件标签确认（多文件加密名提交后端） */
const confirmBatchUploadShipmentLabels = async (e: {
	shipmentLabelFileUrl?: string[];
}) => {
	try {
		const res = await postImportDeliveryPlanPackageAttachments({
			filesUrl: e.shipmentLabelFileUrl || [],
			fileType: 'file',
		});
		if (res.code === 0) {
			useMessage().success(t('上传成功'));
			batchUploadShipmentLabelRef.value?.hide();
			onBatchPreserveOrLabelRefresh();
		}
	} catch (error: any) {
		useMessage().error(error?.msg || t('上传失败'));
	}
};

// 导出
const handleExport = async () => {
	try {
		const ids = register?.getSelectedIds() || [];
		// 显示加载状态
		register.state.loading = true;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await getExportDeliveryPlan({
			...register.state.queryForm,
			ids: ids.length > 0 ? ids : undefined,
			ascs: register.state?.ascs,
			descs: register.state?.descs,
			current: 1,
			size: 1000,
		});
	} catch (error) {
		useMessage().error(t(error as string));
	} finally {
		// 隐藏加载状态
		register.state.loading = false;
	}
};

// 确定上传附件的回调
const confirmUpFile = async (e: any) => {
	const res = await postUploadLabel({
		id: currentRow.value.id,
		shippingMarkAttachments: e.shippingMarkAttachments,
		barcodeAttachments: e.barcodeAttachments,
		transparencyAttachments: e.transparencyAttachments,
	});
	if (res.code === 0) {
		useMessage().success(t('上传成功'));
		// 关闭弹窗
		upFileRef.value?.hide();
		getDataList();
	}
};

//  确定拆分计划的回调
const confirmSplitPlan = async (e: any) => {
	const res = await postSplitDeliveryPlan({
		id: currentRow.value.id,
		currentShipmentQuantity: currentRow.value.shipmentQuantity,
		splitQuantity: e.splitQuantity,
	});
	if (res.code === 0) {
		useMessage().success(t('拆分成功'));
		// 关闭弹窗
		splitPlanRef.value?.hide();
		getDataList();
	}
};

// 确定创建货柜的回调
const confirmCreateContainer = async (e: any) => {
	const ids = register?.getSelectedIds() || [];
	const res = await postOrderContainerInsertOrderContainer({
		ids,
		...e,
	});
	if (res.code === 0) {
		useMessage().success(t('创建成功'));
		// 关闭弹窗
		createContainerRef.value?.hide();
		// 清空选中
		register?.safeCallTableMethod('clearCheckboxRow');
		refreshFooterSummary();
		getDataList();
	}
};

// 确定加入货柜的回调
const confirmJoinContainer = async (e: any) => {
	const ids = register?.getSelectedIds() || [];
	const res = await postOrderContainerAddOrderContainer({
		ids,
		...e,
	});
	if (res.code === 0) {
		useMessage().success(t('加入成功'));
		// 关闭弹窗
		joinContainerRef.value?.hide();
		// 清空选中
		register?.safeCallTableMethod('clearCheckboxRow');
		refreshFooterSummary();
		getDataList();
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
.table-action {
	.el-button,
	.el-dropdown-link {
		padding: 5px 5px;
	}
}
</style>
