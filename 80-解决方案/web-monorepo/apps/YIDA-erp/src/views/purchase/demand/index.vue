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
												label: '需求单号',
												value: 'demandNos',
											},
										]"
										:settings="{
											selectStyle: {
												width: '130px',
											},
											inputStyle: {
												width: '260px',
											},
										}"
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
												label: '采购订单',
												value: 'purchaseNos',
											},
										]"
										:getDataList="getDataList"
									/>
								</div>
							</el-form-item>
							<el-form-item>
								<SelectInputApi
									v-model="state.queryForm.statusList"
									componentType="dicts"
									placeholder="状态"
									:settings="{
										text: '状态',
										getTreeDataParams: 'purchase_demand_status',
									}"
									@change="getDataList"
								/>
							</el-form-item>
							<el-form-item>
								<el-select
									v-model="state.queryForm.purchaseOrderFlag"
									placeholder="是否生成采购单"
									clearable
									style="width: 150px"
									@change="getDataList"
								>
									<el-option
										v-for="item in [
											{
												label: '是',
												value: 1,
											},
											{
												label: '否',
												value: 0,
											},
										]"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
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
												label: '期望提货时间',
												value: 'expectedPickupDate',
												isAddHMS: false,
												dateStart: 'expectedPickupDateStart',
												dateEnd: 'expectedPickupDateEnd',
											},
										]"
										:getDataList="getDataList"
									/>
								</div>
							</el-form-item>
						</template>
						<template #second>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="country"
									:settings="{
										text: '国家',
										code: 'countryCodes',
										searchFn: getDataList,
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="dicts"
									:settings="{
										text: '平台渠道',
										code: 'platformChannelCodes',
										searchFn: getDataList,
										getTreeDataParams: 'platform_channel',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="dicts"
									:settings="{
										text: '发货方式',
										code: 'shippingMethods',
										searchFn: getDataList,
										getTreeDataParams: 'shipping_method',
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="dicts"
									:settings="{
										text: '订单类型',
										code: 'orderTypes',
										searchFn: getDataList,
										getTreeDataParams: 'purchase_demand_order_type',
									}"
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
										text: '运营人',
										code: 'operationIds',
										searchFn: getDataList,
										getTreeDataParams: { lockFlag: 0 },
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="materialControl"
									:settings="{
										text: '物控负责人',
										code: 'mcpIds',
										searchFn: getDataList,
									}"
								/>
							</el-form-item>
							<el-form-item>
								<TreeSelectInputApi
									v-model:queryForm="state.queryForm"
									componentType="userList"
									:settings="{
										text: '创建人',
										code: 'createIds',
										searchFn: getDataList,
										getTreeDataParams: { lockFlag: 0 },
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
												isAddHMS: true,
												dateStart: 'createTimeStart',
												dateEnd: 'createTimeEnd',
											},
										]"
										:getDataList="getDataList"
									/>
								</div>
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
							</el-form-item>
						</template>
					</AdvancedSearchStyle>
				</el-form>
			</el-row>
			<BaseTable :register="register" ref="baseTableRef">
				<template #left-tool>
					<el-button
						class="ml10"
						type="primary"
						@click="openDialog('add')"
						v-auth="'demand_add'"
					>
						{{ $t('新增需求') }}</el-button
					>
					<el-button
						class="ml10"
						@click="
							() => {
								importDialogRef.show();
							}
						"
						v-auth="'demand_import'"
					>
						{{ $t('导入') }}</el-button
					>
					<el-button
						color="#d9001b"
						class="ml10"
						@click="openDialog('del')"
						v-auth="'demand_del'"
					>
						{{ $t('批量删除') }}</el-button
					>
					<el-button
						class="ml10"
						@click="openDialog('batchSubmit')"
						v-auth="'demand_batchSubmit'"
					>
						{{ $t('批量提交') }}</el-button
					>
					<el-button
						class="ml10"
						@click="openReview('operations')"
						v-auth="'demand_operations'"
					>
						{{ $t('运营主管审核') }}</el-button
					>
					<el-button
						class="ml10"
						@click="openReview('director')"
						v-auth="'demand_director'"
					>
						{{ $t('运营总监审核') }}</el-button
					>
					<el-button
						class="ml10"
						@click="openReview('material')"
						v-auth="'demand_material'"
					>
						{{ $t('物控审核') }}</el-button
					>
					<el-button
						class="ml10"
						@click="openReview('materialSupervisor')"
						v-auth="'demand_materialSupervisor'"
					>
						{{ $t('物控主管审核') }}</el-button
					>
					<el-button
						class="ml10"
						@click="openReview('materialMaster')"
						v-auth="'demand_materialMaster'"
					>
						{{ $t('物控负责人') }}</el-button
					>
					<!-- 先隐藏财务审核 -->
					<el-button
						class="ml10"
						@click="openReview('financial')"
						v-auth="'demand_financial'"
						v-if="false"
					>
						{{ $t('财务审核') }}</el-button
					>
					<el-button
						class="ml10"
						@click="openDialog('createOrder')"
						v-auth="'demand_createOrder'"
					>
						{{ $t('生成采购单') }}</el-button
					>
					<el-button
						class="ml10"
						@click="openReview('rejected')"
						v-auth="'demand_rejected'"
					>
						{{ $t('已审核驳回') }}</el-button
					>
				</template>
				<template #firstFlag="{ row }">
					{{ row.firstFlag === 1 ? '是' : '否' }}
				</template>
				<template #action="{ row }">
					<div class="flex items-center table-action">
						<el-button
							text
							type="primary"
							class="mr20"
							@click="openDialog('edit', row)"
							v-if="row.status === 1"
							v-auth="'demand_edit'"
							>{{ $t('编辑') }}
						</el-button>
						<el-button
							text
							type="primary"
							class="mr20"
							@click="openDialog('log', row)"
							>{{ $t('日志') }}
						</el-button>
					</div>
				</template>
			</BaseTable>
		</div>
		<!-- 编辑、新增  -->
		<FormDialog
			v-model="visible"
			:currentRow="currentRow"
			:visibleType="visibleType"
			:title="title"
			@closeDialog="closeDialog"
			:dictMap="dictMap"
		></FormDialog>
		<!-- 新增采购计划 -->
		<OrderAdd
			v-model="orderAddVisible"
			:currentRow="currentRow"
			:visibleType="visibleType"
			:title="title"
			@closeDialog="
				() => {
					orderAddVisible = false;
					getDataList();
					tableRef.value?.clearCheckboxRow();
				}
			"
			:dictMap="dictMap"
		></OrderAdd>

		<!-- 日志 -->
		<LogDialog
			v-model="logDialogVisible"
			:id="currentRow.id"
			:biz-type="['PURCHASE_DEMAND']"
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
			title="导入需求计划"
			templateUrl="/files/import-template/导入需求模版.xlsx"
			excelUploadApi="/purchase/demand/import"
			:accept="'.xlsx,.xls'"
			@refreshDataList="getDataList"
		/>
		<!-- 运营主管审核 -->
		<InputDialog
			ref="operationsDialogRef"
			title="运营主管审核"
			message=""
			:show-icon="true"
			icon-type="info"
			input-prop="remark"
			confirm-button-text="确认"
			confirm-button-type="primary"
			cancelButtonText="驳回"
			input-placeholder="驳回,必填"
			inputType="textarea"
			:inputMaxlength="200"
			@cancel="(e:any) => {
				handleCancel('operations', e);
			}"
			@confirm="
				(e:any) => {
					handleConfirm('operations', e);
				}
			"
		/>
		<!-- 运营总监审核 -->
		<InputDialog
			ref="directorDialogRef"
			title="运营总监审核"
			message=""
			:show-icon="true"
			icon-type="info"
			input-prop="remark"
			:inputMaxlength="200"
			confirm-button-text="确认"
			confirm-button-type="primary"
			cancelButtonText="驳回"
			input-placeholder="驳回,必填"
			inputType="textarea"
			@cancel="(e:any) => {
				handleCancel('director', e);
			}"
			@confirm="
				(e:any) => {
					handleConfirm('director', e);
				}
			"
		/>
		<!-- 物控审核 -->
		<ConfirmDialog
			title="物控审核"
			ref="materialDialogRef"
			message=""
			:show-icon="true"
			icon-type="info"
			input-prop="remark"
			confirm-button-text="确认"
			confirm-button-type="primary"
			cancelButtonText="驳回"
			input-placeholder="驳回,必填"
			inputType="textarea"
			:inputMaxlength="200"
			width="1000px"
			@cancel="
				() => {
					handleCancel('material');
				}
			"
			@confirm="
				() => {
					handleConfirm('material');
				}
			"
		>
			<el-Table :data="selectedRows" height="450">
				<el-table-column :label="t('需求单号')" prop="demandNo">
					<template #default="{ row }">
						{{ row.demandNo ? row.demandNo : '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="skuCode"
					:label="t('SKU/产品名称')"
					show-overflow-tooltip
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
					prop="planNum"
					:label="t('计划数量')"
					show-overflow-tooltip
					width="100"
				>
					<template #default="{ row }"> {{ row.planNum || '--' }} </template>
				</el-table-column>
				<el-table-column
					prop="orderTypeText"
					:label="t('订单类型')"
					show-overflow-tooltip
					width="100"
				>
					<template #default="{ row }">
						{{ row.orderTypeText }}
					</template>
				</el-table-column>
				<el-table-column
					prop="unitPriceIncludingTax"
					:label="t('含税单价')"
					show-overflow-tooltip
					width="100"
				>
					<template #default="{ row }">
						{{ row.unitPriceIncludingTax || '--' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="purchaseAmount"
					:label="t('采购总价CNY')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }">
						{{ row.purchaseAmount || '--' }}
					</template>
				</el-table-column>
			</el-Table>
			<el-input
				v-model="remark"
				placeholder="审核备注,驳回必填"
				maxlength="200"
				type="textarea"
			></el-input>
		</ConfirmDialog>
		<!-- 物控主管审核 -->
		<ConfirmDialog
			title="物控主管审核"
			ref="materialSupervisorDialogRef"
			message=""
			:show-icon="true"
			icon-type="info"
			input-prop="remark"
			confirm-button-text="确认"
			confirm-button-type="primary"
			cancelButtonText="驳回"
			input-placeholder="驳回,必填"
			inputType="textarea"
			width="1000px"
			@cancel="
				() => {
					handleCancel('materialSupervisor');
				}
			"
			@confirm="
				() => {
					handleConfirm('materialSupervisor');
				}
			"
		>
			<el-Table :data="selectedRows" height="450">
				<el-table-column :label="t('需求单号')" prop="demandNo">
					<template #default="{ row }">
						{{ row.demandNo ? row.demandNo : '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="skuCode"
					:label="t('SKU/产品名称')"
					show-overflow-tooltip
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
					prop="planNum"
					:label="t('计划数量')"
					show-overflow-tooltip
					width="100"
				>
					<template #default="{ row }"> {{ row.planNum || '--' }} </template>
				</el-table-column>
				<el-table-column
					prop="orderTypeText"
					:label="t('订单类型')"
					show-overflow-tooltip
					width="100"
				>
					<template #default="{ row }">
						{{ row.orderTypeText }}
					</template>
				</el-table-column>
				<el-table-column
					prop="unitPriceIncludingTax"
					:label="t('含税单价')"
					show-overflow-tooltip
					width="100"
				>
					<template #default="{ row }">
						{{ row.unitPriceIncludingTax || '--' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="purchaseAmount"
					:label="t('采购总价CNY')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }">
						{{ row.purchaseAmount || '--' }}
					</template>
				</el-table-column>
			</el-Table>
			<el-input
				v-model="remark"
				placeholder="审核备注,驳回必填"
				maxlength="200"
				type="textarea"
			></el-input>
		</ConfirmDialog>
		<!-- 物控负责人审核 -->
		<ConfirmDialog
			title="物控负责人审核"
			ref="materialMasterDialogRef"
			message=""
			:show-icon="true"
			icon-type="info"
			input-prop="remark"
			confirm-button-text="确认"
			confirm-button-type="primary"
			cancelButtonText="驳回"
			input-placeholder="驳回,必填"
			inputType="textarea"
			width="1000px"
			@cancel="
				() => {
					handleCancel('materialMaster');
				}
			"
			@confirm="
				() => {
					handleConfirm('materialMaster');
				}
			"
		>
			<el-Table :data="selectedRows" height="450">
				<el-table-column :label="t('需求单号')" prop="demandNo">
					<template #default="{ row }">
						{{ row.demandNo ? row.demandNo : '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="skuCode"
					:label="t('SKU/产品名称')"
					show-overflow-tooltip
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
					prop="planNum"
					:label="t('计划数量')"
					show-overflow-tooltip
					width="100"
				>
					<template #default="{ row }"> {{ row.planNum || '--' }} </template>
				</el-table-column>
				<el-table-column
					prop="orderTypeText"
					:label="t('订单类型')"
					show-overflow-tooltip
					width="100"
				>
					<template #default="{ row }">
						{{ row.orderTypeText }}
					</template>
				</el-table-column>
				<el-table-column
					prop="unitPriceIncludingTax"
					:label="t('含税单价')"
					show-overflow-tooltip
					width="100"
				>
					<template #default="{ row }">
						{{ row.unitPriceIncludingTax || '--' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="purchaseAmount"
					:label="t('采购总价CNY')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }">
						{{ row.purchaseAmount || '--' }}
					</template>
				</el-table-column>
			</el-Table>
			<el-input
				v-model="remark"
				placeholder="审核备注,驳回必填"
				maxlength="200"
				type="textarea"
			></el-input>
		</ConfirmDialog>

		<!-- 财务审核 -->
		<ConfirmDialog
			title="财务审核"
			ref="financialDialogRef"
			message=""
			:show-icon="true"
			icon-type="info"
			input-prop="remark"
			confirm-button-text="确认"
			confirm-button-type="primary"
			cancelButtonText="驳回"
			input-placeholder="驳回,必填"
			inputType="textarea"
			width="1000px"
			@cancel="
				() => {
					handleCancel('financial');
				}
			"
			@confirm="
				() => {
					handleConfirm('financial');
				}
			"
		>
			<el-Table :data="selectedRows" height="450">
				<el-table-column :label="t('需求单号')" prop="demandNo">
					<template #default="{ row }">
						{{ row.demandNo ? row.demandNo : '---' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="skuCode"
					:label="t('SKU/产品名称')"
					show-overflow-tooltip
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
					prop="planNum"
					:label="t('计划数量')"
					show-overflow-tooltip
					width="100"
				>
					<template #default="{ row }"> {{ row.planNum || '--' }} </template>
				</el-table-column>
				<el-table-column
					prop="orderTypeText"
					:label="t('订单类型')"
					show-overflow-tooltip
					width="100"
				>
					<template #default="{ row }">
						{{ row.orderTypeText }}
					</template>
				</el-table-column>
				<el-table-column
					prop="unitPriceIncludingTax"
					:label="t('含税单价')"
					show-overflow-tooltip
					width="100"
				>
					<template #default="{ row }">
						{{ row.unitPriceIncludingTax || '--' }}
					</template>
				</el-table-column>
				<el-table-column
					prop="purchaseAmount"
					:label="t('采购总价CNY')"
					show-overflow-tooltip
					width="150"
				>
					<template #default="{ row }">
						{{ row.purchaseAmount || '--' }}
					</template>
				</el-table-column>
			</el-Table>
			<el-input
				v-model="remark"
				placeholder="审核备注,驳回必填"
				maxlength="200"
				type="textarea"
			></el-input>
		</ConfirmDialog>
		<!-- 已审核驳回 -->
		<ConfirmDialog
			title="已审核驳回"
			ref="rejectedDialogRef"
			message=""
			:show-icon="true"
			icon-type="error"
			input-prop="remark"
			confirm-button-text="确认"
			confirm-button-type="primary"
			cancelButtonText="取消"
			input-placeholder="驳回,必填"
			inputType="textarea"
			@cancel="
				() => {
					tableRef.clearCheckboxRow();
					rejectedDialogRef.hide();
				}
			"
			@confirm="
				() => {
					handleConfirm('rejected');
				}
			"
		>
			{{ t('确定驳回勾选的需求计划吗') }}
		</ConfirmDialog>
	</div>
</template>

<script setup lang="ts">
import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useMessage } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';
import { getDicts } from '/@/api/admin/dict';
import { sysCountryList } from '/@/api/materialFlow/track';
import {
	getDemandPage,
	getDemandDetailInfo,
	postDemandDelete,
	postDirectorReview,
	postDemandReviewDetail,
	postMaterialReview,
	postFinancialReview,
	postDemandRejected,
	getExportDemand,
	postDemandToCreateOrder,
	postDemandSubmit,
	postOperationSupervisorReview,
	postCollectionSupervisorReview,
	postReviewedMaterialsSupervisorReview,
} from '/@/api/purchase/demand/index';
import { getUsersByDepartment } from '/@/api/product/category';
import { getLegalEntitySelect } from '/@/api/admin/legalEntity/index';
import { getSupplierInfoList } from '/@/api/purchase/supplierSku/index';
import { getUserListByCondition } from '/@/api/admin/user';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { deptTree } from '/@/api/admin/dept';
import { useResultDialog } from '/@/hooks/useResultDialog';
import { columns } from './config/index';

const FormDialog = defineAsyncComponent(
	() => import('./components/form-dialog.vue')
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
const LogDialog = defineAsyncComponent(
	() => import('/@/components/log/log-dialog.vue')
);
const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);
const ConfirmDialog = defineAsyncComponent(
	() => import('/@/components/ConfirmDialog/index.vue')
);
const InputDialog = defineAsyncComponent(
	() => import('/@/components/ConfirmDialog/InputDialog.vue')
);
const OrderAdd = defineAsyncComponent(
	() => import('./components/order-add.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);
// table的引用
const baseTableRef = ref();
// 是否显示搜索

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getDemandPage as any,
	pagination: {
		pageSizes: [10, 20, 50, 100, 200, 500, 1000],
	},
	columns,
	toolBarConfig: {
		handleRefresh: () => {
			register?.getDataList();
		},
		handleExport: () => {
			handleExport();
		},
		settingKey: 'purchaseDemand-index',
	},
	descs: ['create_time', 'demand_no'],
});
const { register, getDataList, tableRef } = useTable(state, baseTableRef);
// 表格列配置
//   初始化数据
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
			params: {
				filterArea: 1,
			},
		}, // 国家列表
		{
			key: 'platformChannel',
			fetchFn: getDicts,
			params: 'platform_channel',
		}, // 平台 渠道
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
			key: 'planUserId',
			fetchFn: getUserListByCondition,
			params: {
				postCodeList: ['PURCHASING_PLAN'],
			},
		}, // 主计划人员列表
		{
			key: 'spInfoList',
			fetchFn: getSupplierInfoList,
		}, //供应商列表
		{
			key: 'entityList',
			fetchFn: getLegalEntitySelect,
		}, // 法人主体
		{
			key: 'materialControlList',
			fetchFn: getUsersByDepartment,
			params: {},
		}, // 物控人员列表
	],
	{
		isAuto: true,
		tableRef,
	}
);
const { t } = useI18n();
const route = useRoute();
// 运营主管审核对话框的引用
const operationsDialogRef = ref();

// 运营总监审核对话框的引用
const directorDialogRef = ref();

//  物控审核对话框的引用
const materialDialogRef = ref();

// 物控主管审核对话框的引用
const materialSupervisorDialogRef = ref();
// 物控负责人审核对话框的引用
const materialMasterDialogRef = ref();

// 财务审核对话框的引用
const financialDialogRef = ref();

// 已审核驳回对话框的引用
const rejectedDialogRef = ref();

// 高级搜索布局的引用
const AdvancedSearchStyleRef = ref();

// 搜索变量
const queryRef = ref();
// 导入弹窗的引用
const importDialogRef = ref();
// 是否显示搜索
const showSearch = ref(true);
// 当前点击的行
const currentRow = ref({
	id: '',
});
// 当前选中的行数据
const selectedRows = ref([]);
// 弹窗标题
const title = ref('');
// 弹窗类型
const visibleType = ref('');
// 弹窗是否可见
const visible = ref(false);
// 新增采购计划弹窗是否可见
const orderAddVisible = ref(false);
// 日志对话框是否可见
const logDialogVisible = ref(false);
// 审核备注
const remark = ref('');
const { open } = useResultDialog();

// 重置
const resetQuery = async () => {
	// 重置时间组件的查询条件
	state.queryForm = {
		current: 1,
		size: 10,
		descs: ['create_time', 'demand_no'],
	};
	getDataList();
};

// 打开对话框
const openDialog = async (type: string, row?: any) => {
	try {
		if (type === 'add') {
			title.value = t('新增需求');
			visibleType.value = 'add';
			currentRow.value = {
				id: '',
			};
			visible.value = true;
		} else if (type === 'edit') {
			// 如果状态不是待提交就不能修改
			if (row.status !== 1) {
				useMessage().error(t('只有待提交状态的需求才能编辑'));
				return;
			}

			const res = await getDemandDetailInfo({ id: row.id });
			if (res.code === 0) {
				title.value = t('编辑需求');
				visibleType.value = 'edit';
				currentRow.value = res.data;
				visible.value = true;
			}
		} else if (type === 'del') {
			const ids = tableRef.value
				?.getCheckboxRecords()
				?.map((item: any) => item.id);
			if (!ids || ids.length === 0) {
				useMessage().error(t('请至少选择一条数据'));
				return;
			}

			ElMessageBox.confirm(t('是否确认删除选中数据？'), t('提示'), {
				confirmButtonText: t('确定'),
				cancelButtonText: t('取消'),
				type: 'warning',
			}).then(async () => {
				try {
					const res = await postDemandDelete({ ids });
					if (res.code === 0) {
						// 判断是否有失败的记录
						if (res?.data?.failCount > 0) {
							// 展示错误提示
							open({
								title: t('删除失败'),
								data: res.data,
							});
						} else if (res?.data?.failCount === 0) {
							useMessage().success('删除成功');
						}
					}
					// 清空选中行
					tableRef.value?.clearCheckboxRow();
					// 刷新数据
					getDataList();
				} catch (error: any) {
					ElMessageBox.confirm(error?.msg || t('操作失败'), t('提示'), {
						type: 'error',
					});
				}
			});
		} else if (type === 'log') {
			logDialogVisible.value = true;
			currentRow.value = row;
		} else if (type === 'createOrder') {
			const ids = tableRef.value
				?.getCheckboxRecords()
				?.map((item: any) => item.id);
			const allStatusOne = tableRef.value
				?.getCheckboxRecords()
				?.every((item: any) => item.status === 16);
			if (!allStatusOne) {
				useMessage().error(t('只有已审核的需求才能生成采购单'));
				return;
			}
			if (!ids || ids.length === 0) {
				useMessage().error(t('请至少选择一条数据'));
				return;
			}
			try {
				const res = await postDemandToCreateOrder({ ids });
				// const res = await postDemandReviewDetail({ ids });
				if (res.code === 0) {
					currentRow.value = res.data;
					title.value = t('生成采购单');
					visibleType.value = 'add';
					orderAddVisible.value = true;
				}
			} catch (error: any) {
				useMessage().error(error?.msg || t('获取生成采购单数据失败'));
			}
		} else if (type === 'batchSubmit') {
			const ids = tableRef.value
				?.getCheckboxRecords()
				?.map((item: any) => item.id);
			const allStatusOne = tableRef.value
				?.getCheckboxRecords()
				?.every((item: any) => item.status === 1);
			if (!allStatusOne) {
				useMessage().error(t('只有待提交状态的需求才能进行提交操作'));
				return;
			}
			if (!ids || ids.length === 0) {
				useMessage().error(t('请至少选择一条数据'));
				return;
			}
			ElMessageBox.confirm(
				t(`已选中${ids?.length}个需求单，确认提交审核？`),
				t('提示'),
				{
					confirmButtonText: t('确定'),
					cancelButtonText: t('取消'),
					type: 'warning',
				}
			).then(async () => {
				try {
					const res = await postDemandSubmit({ ids });
					if (res.code === 0) {
						useMessage().success(t('提交成功'));
						// 刷新数据
						getDataList();
						// 清空选中行
						tableRef.value?.clearCheckboxRow();
					}
				} catch (error: any) {
					ElMessageBox.confirm(error?.msg || t('操作失败'), t('提示'), {
						type: 'error',
					});
				}
			});
		}
	} catch (error: any) {
		useMessage().error(error?.msg || t('错误'));
	}
};

// 打开审核对话框
const openReview = async (type: string) => {
	// 清空备注
	remark.value = '';
	// 获取到所有选中的行
	selectedRows.value = [];
	const ids = tableRef.value?.getCheckboxRecords()?.map((item: any) => item.id);
	if (!ids || ids.length === 0) {
		useMessage().error(t('请至少选择一条数据'));
		return;
	}
	try {
		if (type === 'operations') {
			// 检查所有选中项的状态是否都是10 (待运营主管审核)
			const allStatusOne = tableRef.value
				?.getCheckboxRecords()
				?.every((item: any) => item.status === 10);
			if (!allStatusOne) {
				useMessage().error(t('只有待运营主管审核状态的需求才能进行运营审核'));
				return;
			}
			operationsDialogRef.value.show();
		} else if (type === 'director') {
			// 检查所有选中项的状态是否都是11 (待运营总监审核)
			const allStatusOne = tableRef.value
				?.getCheckboxRecords()
				?.every((item: any) => item.status === 11);
			if (!allStatusOne) {
				useMessage().error(
					t('只有待运营总监审核状态的需求才能进行运营总监审核')
				);
				return;
			}
			directorDialogRef.value.show();
		} else if (type === 'material') {
			// 检查所有选中项的状态是否都是12 (待物控审核)
			const allStatusOne = tableRef.value
				?.getCheckboxRecords()
				?.every((item: any) => item.status === 12);
			if (!allStatusOne) {
				useMessage().error(t('只有待物控审核的需求才能进行物控审核'));
				return;
			}
			const res = await postDemandReviewDetail({ ids });
			if (res.code === 0) {
				materialDialogRef.value.show();
				selectedRows.value = res.data;
			} else {
				return;
			}
		} else if (type === 'materialSupervisor') {
			// 检查所有选中项的状态是否都是13 (待物控主管审核)
			const allStatusOne = tableRef.value
				?.getCheckboxRecords()
				?.every((item: any) => item.status === 13);
			if (!allStatusOne) {
				useMessage().error(t('只有待物控主管审核的需求才能进行物控主管审核'));
				return;
			}
			const res = await postDemandReviewDetail({ ids });
			if (res.code === 0) {
				materialSupervisorDialogRef.value.show();
				selectedRows.value = res.data;
			} else {
				return;
			}
		} else if (type === 'materialMaster') {
			// 检查所有选中项的状态是否都是14 (待物控负责人审核)
			const allStatusOne = tableRef.value
				?.getCheckboxRecords()
				?.every((item: any) => item.status === 14);
			if (!allStatusOne) {
				useMessage().error(
					t('只有待物控负责人审核的需求才能进行物控负责人审核')
				);
				return;
			}
			const res = await postDemandReviewDetail({ ids });
			if (res.code === 0) {
				materialMasterDialogRef.value.show();
				selectedRows.value = res.data;
			} else {
				return;
			}
		} else if (type === 'financial') {
			// 检查所有选中项的状态是否都是15 (待财务审核)
			const allStatusOne = tableRef.value
				?.getCheckboxRecords()
				?.every((item: any) => item.status === 15);
			if (!allStatusOne) {
				useMessage().error(t('只有待财务审核的需求才能进行财务审核'));
				return;
			}
			const res = await postDemandReviewDetail({ ids });
			if (res.code === 0) {
				financialDialogRef.value.show();
				selectedRows.value = res.data;
			} else {
				return;
			}
		} else if (type === 'rejected') {
			// 检查所有选中项的状态是否都是16 (已审核)
			const allStatusOne = tableRef.value
				?.getCheckboxRecords()
				?.every((item: any) => item.status === 16);
			if (!allStatusOne) {
				useMessage().error(t('只有已审核需求才能进行驳回操作'));
				return;
			}
			rejectedDialogRef.value.show();
		}
	} catch (error: any) {
		if (error?.msg) {
			// useMessage().error(error.msg);
			useMessage().error(error);
		}
	}
};
// 导出
const handleExport = async () => {
	try {
		const ids = register?.getSelectedIds();
		// 显示加载状态
		state.loading = true;
		// 发送请求，设置 responseType 为 'blob' 以接收二进制流
		await getExportDemand({
			...state.queryForm,
			ascs: state?.ascs,
			descs: state?.descs,
			ids: ids || [],
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

// 确认操作
const handleConfirm = async (type: string, e?: any) => {
	// 获取到所有选中的行
	const ids = tableRef.value?.getCheckboxRecords()?.map((item: any) => item.id);
	try {
		if (type === 'operations') {
			const res = await postOperationSupervisorReview({
				ids,
				type: '10', // 10 运营主管审核
				passFlag: 1, //  是否审核通过 0否，1是
				checkRemark: e.remark,
			});
			if (res.code === 0) {
				// 判断是否有失败的记录
				if (res?.data?.failCount > 0) {
					// 展示错误提示
					open({
						title: t('运营主管审核失败'),
						data: res.data,
					});
				} else if (res?.data?.failCount === 0) {
					useMessage().success('审核成功');
				}
			}
			// 关闭对话框
			operationsDialogRef.value.hide();
		} else if (type === 'director') {
			const res = await postDirectorReview({
				ids,
				type: '11', // 11 运营总监审核
				passFlag: 1, //  是否审核通过 0否，1是
				checkRemark: e.remark,
			});
			if (res.code === 0) {
				// 判断是否有失败的记录
				if (res?.data?.failCount > 0) {
					// 展示错误提示
					open({
						title: t('运营总监审核失败'),
						data: res.data,
					});
				} else if (res?.data?.failCount === 0) {
					useMessage().success('审核成功');
				}
			}
			// 关闭对话框
			directorDialogRef.value.hide();
		} else if (type === 'material') {
			const res = await postMaterialReview({
				ids,
				type: '12', // 12 物控审核
				passFlag: 1, //  是否审核通过 0否，1是
				checkRemark: remark.value,
			});
			if (res.code === 0) {
				// 判断是否有失败的记录
				if (res?.data?.failCount > 0) {
					// 展示错误提示
					open({
						title: t('物控审核失败'),
						data: res.data,
					});
				} else if (res?.data?.failCount === 0) {
					useMessage().success('审核成功');
				}
			}
			// 关闭对话框
			materialDialogRef.value.hide();
		} else if (type === 'materialSupervisor') {
			const res = await postCollectionSupervisorReview({
				ids,
				type: '13', // 13 物控主管审核
				passFlag: 1, //  是否审核通过 0否，1是
				checkRemark: remark.value,
			});
			if (res.code === 0) {
				// 判断是否有失败的记录
				if (res?.data?.failCount > 0) {
					// 展示错误提示
					open({
						title: t('物控主管审核失败'),
						data: res.data,
					});
				} else if (res?.data?.failCount === 0) {
					useMessage().success('审核成功');
				}
			}
			// 关闭对话框
			materialSupervisorDialogRef.value.hide();
		} else if (type === 'materialMaster') {
			const res = await postReviewedMaterialsSupervisorReview({
				ids,
				type: '14', // 14 物控负责人审核
				passFlag: 1, //  是否审核通过 0否，1是
				checkRemark: remark.value,
			});
			if (res.code === 0) {
				// 判断是否有失败的记录
				if (res?.data?.failCount > 0) {
					// 展示错误提示
					open({
						title: t('物控负责人审核失败'),
						data: res.data,
					});
				} else if (res?.data?.failCount === 0) {
					useMessage().success('审核成功');
				}
			}
			// 关闭对话框
			materialMasterDialogRef.value.hide();
		} else if (type === 'financial') {
			const res = await postFinancialReview({
				ids,
				type: '15', // 15 财务审核
				passFlag: 1, //  是否审核通过 0否，1是
				checkRemark: remark.value,
			});
			if (res.code === 0) {
				// 判断是否有失败的记录
				if (res?.data?.failCount > 0) {
					// 展示错误提示
					open({
						title: t('财务审核失败'),
						data: res.data,
					});
				} else if (res?.data?.failCount === 0) {
					useMessage().success('审核成功');
				}
			}
			// 关闭对话框
			financialDialogRef.value.hide();
		} else if (type === 'rejected') {
			const res = await postDemandRejected({
				ids,
				type: '16', // 16 已审核驳回
				passFlag: 0, //  是否审核通过 0否，1是
			});
			if (res.code === 0) {
				// 判断是否有失败的记录
				if (res?.data?.failCount > 0) {
					// 展示错误提示
					open({
						title: t('已审核驳回失败'),
						data: res.data,
					});
				} else if (res?.data?.failCount === 0) {
					useMessage().success('驳回成功');
				}
			}
			// 关闭对话框
			rejectedDialogRef.value.hide();
		}
		// 清空选中行
		tableRef.value?.clearCheckboxRow();
		getDataList();
	} catch (error: any) {
		// if (error?.msg) {
		// 	useMessage().error(error.msg);
		// }
	}
};

// 取消操作
const handleCancel = async (type: string, e?: any) => {
	// 获取到所有选中的行
	const ids = tableRef.value?.getCheckboxRecords()?.map((item: any) => item.id);
	try {
		if (type === 'operations') {
			if (!e.remark) {
				ElMessageBox.alert('驳回理由不能为空', '提示', {
					type: 'warning',
				});
				return;
			}
			const res = await postOperationSupervisorReview({
				ids,
				type: '10', // 10 运营主管审核
				passFlag: 0, //  是否审核通过 0否，1是
				checkRemark: e.remark,
			});
			if (res.code === 0) {
				// 判断是否有失败的记录
				if (res?.data?.failCount > 0) {
					// 展示错误提示
					open({
						title: t('运营主管审核驳回失败'),
						data: res.data,
					});
				} else if (res?.data?.failCount === 0) {
					useMessage().success('驳回成功');
				}
			}
			// 关闭对话框
			operationsDialogRef.value.hide();
		} else if (type === 'director') {
			if (!e.remark) {
				ElMessageBox.alert('驳回理由不能为空', '提示', {
					type: 'warning',
				});
				return;
			}
			const res = await postDirectorReview({
				ids,
				type: '11', // 11 运营总监审核
				passFlag: 0, //  是否审核通过 0否，1是
				checkRemark: e.remark,
			});
			if (res.code === 0) {
				// 判断是否有失败的记录
				if (res?.data?.failCount > 0) {
					// 展示错误提示
					open({
						title: t('运营总监审核驳回失败'),
						data: res.data,
					});
				} else if (res?.data?.failCount === 0) {
					useMessage().success('驳回成功');
				}
			}
			// 关闭对话框
			directorDialogRef.value.hide();
		} else if (type === 'material') {
			if (!remark.value) {
				ElMessageBox.alert('驳回理由不能为空', '提示', {
					type: 'warning',
				});
				return;
			}
			const res = await postMaterialReview({
				ids,
				type: '12', // 12 物控审核
				passFlag: 0, //  是否审核通过 0否，1是
				checkRemark: remark.value,
			});
			if (res.code === 0) {
				// 判断是否有失败的记录
				if (res?.data?.failCount > 0) {
					// 展示错误提示
					open({
						title: t('物控审核驳回失败'),
						data: res.data,
					});
				} else if (res?.data?.failCount === 0) {
					useMessage().success('驳回成功');
				}
			}
			// 关闭对话框
			materialDialogRef.value.hide();
		} else if (type === 'materialSupervisor') {
			if (!remark.value) {
				ElMessageBox.alert('驳回理由不能为空', '提示', {
					type: 'warning',
				});
				return;
			}
			const res = await postCollectionSupervisorReview({
				ids,
				type: '13', // 13 物控主管审核
				passFlag: 0, //  是否审核通过 0否，1是
				checkRemark: remark.value,
			});
			if (res.code === 0) {
				// 判断是否有失败的记录
				if (res?.data?.failCount > 0) {
					// 展示错误提示
					open({
						title: t('物控主管审核驳回失败'),
						data: res.data,
					});
				} else if (res?.data?.failCount === 0) {
					useMessage().success('驳回成功');
				}
			}
			// 关闭对话框
			materialSupervisorDialogRef.value.hide();
		} else if (type === 'materialMaster') {
			if (!remark.value) {
				ElMessageBox.alert('驳回理由不能为空', '提示', {
					type: 'warning',
				});
				return;
			}
			const res = await postReviewedMaterialsSupervisorReview({
				ids,
				type: '14', // 14 物控负责人审核
				passFlag: 0, //  是否审核通过 0否，1是
				checkRemark: remark.value,
			});
			if (res.code === 0) {
				// 判断是否有失败的记录
				if (res?.data?.failCount > 0) {
					// 展示错误提示
					open({
						title: t('物控负责人审核驳回失败'),
						data: res.data,
					});
				} else if (res?.data?.failCount === 0) {
					useMessage().success('驳回成功');
				}
			}
			// 关闭对话框
			materialMasterDialogRef.value.hide();
		} else if (type === 'financial') {
			if (!remark.value) {
				ElMessageBox.alert('驳回理由不能为空', '提示', {
					type: 'warning',
				});
				return;
			}
			const res = await postFinancialReview({
				ids,
				type: '15', // 15 财务审核
				passFlag: 0, //  是否审核通过 0否，1是
				checkRemark: remark.value,
			});
			if (res.code === 0) {
				// 判断是否有失败的记录
				if (res?.data?.failCount > 0) {
					// 展示错误提示
					open({
						title: t('财务审核驳回失败'),
						data: res.data,
					});
				} else if (res?.data?.failCount === 0) {
					useMessage().success('驳回成功');
				}
			}
			// 关闭对话框
			financialDialogRef.value.hide();
		}
		// 清空选中行
		tableRef.value?.clearCheckboxRow();
		getDataList();
	} catch (error: any) {
		if (error?.msg) {
			useMessage().error(error.msg);
		}
	}
};

// 关闭对话框
const closeDialog = () => {
	visible.value = false;
	tableRef.value?.clearCheckboxRow();
	getDataList();
};

// 页面初始化时处理URL参数
onMounted(() => {
	const demandNos = route.query.demandNos as string;
	if (demandNos) {
		if (demandNos.includes(',')) {
			// 逗号分隔的字符串，转换为数组
			state.queryForm.demandNos = demandNos
				.split(',')
				.map((item) => item.trim())
				.filter((item) => item);
		} else {
			// 单个值，包装成数组
			state.queryForm.demandNos = [demandNos];
		}
		getDataList();
	}
});
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
:deep(.cell) {
	text-align: center;
}
.table-action {
	.el-button {
		padding: 5px 5px;
	}
}
</style>
