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
					<el-form-item>
						<el-select
							v-model="state.queryForm.status"
							placeholder="SKU状态"
							clearable
							class="w-55"
							@change="getDataList"
						>
							<el-option
								v-for="item in [
									{
										value: 1,
										label: '启用',
									},
									{
										value: 0,
										label: '停用',
									},
								]"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
					<el-form-item>
						<div class="flex items-center w-55">
							<TreeSelectInput
								v-model:queryForm="state.queryForm"
								class="w-55"
								:settings="{
									getTreeData: getCategoryTree,
									text: '类目',
									width: '220px',
									searchFn: getDataList,
									code: 'categoryCodes',
									selectTreeProps: {
										value: 'id',
										label: 'name',
										children: 'children',
									},
									getIdsCode: 'id',
								}"
							/>
						</div>
					</el-form-item>
					<el-form-item>
						<div class="flex items-center w-55">
							<TreeSelectInputApi
								v-model:queryForm="state.queryForm"
								componentType="brand"
								:settings="{
									code: 'brandCodes',
									text: '品牌',
									searchFn: getDataList,
								}"
							></TreeSelectInputApi>
							<!-- <TreeSelectInput
								v-model:queryForm="state.queryForm"
								class="w-55"
								:settings="{
									getTreeData: getBrandAllList,
									text: '品牌',
									width: '220px',
									searchFn: getDataList,
									code: 'brandCodes',
									selectTreeProps: {
										value: 'brandCode',
										label: 'brandName',
										children: 'children',
									},
									getIdsCode: 'brandCode',
	                                renderData: (data: any) => {
										return data.map((item: any) => {
											return {
												...item,
												brandName: `${item.brandCode} - ${item.brandName}`,
											};
										});
									},
								}"
							/> -->
						</div>
					</el-form-item>
					<el-form-item>
						<el-select
							v-model="state.queryForm.productType"
							placeholder="产品类型"
							clearable
							class="w-[150px]"
							@change="getDataList"
						>
							<el-option
								v-for="item in productTypeOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
					<el-form-item prop="productManageIds">
						<TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="userList"
							:settings="{
								code: 'productManageIds',
								text: '产品负责人',
								searchFn: getDataList,
							}"
						></TreeSelectInputApi>
						<!-- <TreeSelectInput
							v-model:queryForm="state.queryForm"
							:style="{ width: '220px' }"
							:settings="{
								getTreeData: getUserListByCondition,
								searchFn: getDataList,
								text: '产品负责人',
								width: '100%',
								code: 'productManageIds',
								selectTreeProps: {
									value: 'userId',
									label: 'name',
									children: 'children',
								},
								getIdsCode: 'userId',
							}"
						/> -->
					</el-form-item>
					<el-form-item>
						<div class="flex items-center w-55">
							<TreeSelectInputApi
								v-model:queryForm="state.queryForm"
								componentType="dicts"
								:settings="{
									code: 'grades',
									text: '产品等级',
									getTreeDataParams: 'product_grade',
									searchFn: getDataList,
								}"
							></TreeSelectInputApi>
							<!-- <TreeSelectInput
								v-model:queryForm="state.queryForm"
								class="w-55"
								:settings="{
									getTreeData: getDicts,
									getTreeDataParams: 'product_grade',
									text: '产品等级',
									width: '220px',
									searchFn: getDataList,
									code: 'grades',
									selectTreeProps: {
										value: 'value',
										label: 'label',
										children: 'children',
									},
									getIdsCode: 'value',
								}"
							/> -->
						</div>
					</el-form-item>
					<el-form-item prop="operationGroups">
						<!-- <TreeSelectInputApi
							v-model:queryForm="state.queryForm"
							componentType="deptLast"
							:settings="{
								code: 'operationGroups',
								text: '运营中心',
								searchFn: getDataList,
							}"
						></TreeSelectInputApi> -->
						<el-tree-select
							@blur="getDataList"
							v-model="state.queryForm.operationGroups"
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
						<!-- <TreeSelectInput
							v-model:queryForm="state.queryForm"
							:style="{ width: '220px' }"
							:settings="{
								getTreeData: getDeptLastDeptByCondition,
								getTreeDataParams: {
									deptName: '运营中心',
								},
								searchFn: getDataList,
								text: '运营组',
								width: '100%',
								code: 'operationGroups',
								selectTreeProps: {
									value: 'deptId',
									label: 'name',
									children: 'children',
								},
								getIdsCode: 'deptId',
							}"
						/> -->
					</el-form-item>
					<el-form-item>
						<div class="flex items-center w-55">
							<TreeSelectInputApi
								v-model:queryForm="state.queryForm"
								componentType="country"
								:settings="{
									code: 'countryCodes',
									text: '销售国家',
									searchFn: getDataList,
								}"
							></TreeSelectInputApi>
							<!-- <TreeSelectInput
								v-model:queryForm="state.queryForm"
								class="w-55"
								:settings="{
									getTreeData: sysCountryList,
									getTreeDataParams: 'country',
									text: '销售国家',
									width: '220px',
									searchFn: getDataList,
									code: 'countryCodes',
									selectTreeProps: {
										value: 'abbTwoCode',
										label: 'chineseName',
									},
									getIdsCode: 'abbTwoCode',
									renderData: (data: any) => {
										return data.map((item: any) => {
											return {
												...item,
												chineseName: `${item.abbTwoCode}-${item.chineseName}`,
											};
										});
									},
								}"
							/> -->
						</div>
					</el-form-item>
					<el-form-item>
						<div class="flex items-center w-55">
							<TreeSelectInputApi
								v-model:queryForm="state.queryForm"
								componentType="dicts"
								:settings="{
									code: 'platforms',
									text: '销售渠道',
									getTreeDataParams: 'platform_channel',
									searchFn: getDataList,
								}"
							></TreeSelectInputApi>
							<!-- <TreeSelectInput
								v-model:queryForm="state.queryForm"
								class="w-55"
								:settings="{
									getTreeData: getDicts,
									getTreeDataParams: 'platform_channel',
									text: '销售渠道',
									width: '220px',
									searchFn: getDataList,
									code: 'platforms',
									selectTreeProps: {
										value: 'value',
										label: 'label',
										children: 'children',
									},
									getIdsCode: 'value',
								}"
							/> -->
						</div>
					</el-form-item>
					<el-form-item>
						<div class="flex items-center">
							<SelectDate
								v-model:queryForm="state.queryForm"
								:settings="{
									selectStyle: { width: '130px' },
									dateStyle: { width: '130px' },
								}"
								:searchTypes="[
									{
										label: '创建时间',
										value: 'createdTime',
										isAddHMS: false,
										dateStart: 'createTimeStart',
										dateEnd: 'createTimeEnd',
									},
									{
										label: '更新时间',
										value: 'updateTime',
										isAddHMS: false,
										dateStart: 'updateTimeStart',
										dateEnd: 'updateTimeEnd',
									},
								]"
								:getDataList="getDataList"
							/>
						</div>
					</el-form-item>

					<el-form-item>
						<div class="flex items-center">
							<SelectInput
								v-model:queryForm="state.queryForm"
								:searchTypes="[
									{
										label: 'SKU',
										value: 'skuCodes',
									},
									{
										label: '产品名称',
										value: 'skuNames',
									},
									{
										label: 'SPU',
										value: 'spuCodes',
									},
									{
										label: '父产品名称',
										value: 'spuNames',
									},
									{
										label: 'MSKU',
										value: 'mskuCodes',
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
						<el-button @click="getDataList" type="primary"
							>{{ $t('搜索') }}
						</el-button>
						<el-button @click="resetQuery" type="info" plain
							>{{ $t('common.resetBtn') }}
						</el-button>
					</el-form-item>
				</el-form>
			</el-row>

			<BaseTable
				ref="baseTableRef"
				:register="register"
				:rowConfig="{ keyField: 'id', height: 100 }"
			>
				<template #left-tool>
					<el-button
						class="ml10"
						type="primary"
						@click="openDialog('add')"
						v-auth="'sku_add'"
					>
						{{ $t('添加SKU') }}
					</el-button>
					<el-button
						class="ml10"
						@click="importDialogRef.show()"
						v-auth="'sku_import'"
					>
						{{ $t('导入SKU') }}
					</el-button>
					<el-button
						class="ml10"
						@click="openAssociateSkuDepts"
						v-auth="'sku_dept'"
					>
						{{ $t('分配运营组') }}
					</el-button>
					<el-button
						class="ml10"
						@click="importDialogMskuRef.show()"
						v-auth="'sku_msku_import'"
					>
						{{ $t('导入MSKU') }}
					</el-button>
					<el-button
						class="ml10"
						@click="openPushSkuDialog()"
						v-auth="'sku_push_warehouse'"
					>
						{{ $t('推送至三方仓') }}
					</el-button>
					<el-dropdown
						class="ml10"
						v-if="auths(['sku_productInfo', 'sku_editImage'])"
					>
						<el-button class="ml10" type="primary">
							{{ $t('批量操作') }}
							<el-icon class="el-icon--right">
								<arrow-down />
							</el-icon>
						</el-button>
						<template #dropdown>
							<el-dropdown-item
								@click="
									() => {
										batchUpdate('productInfo');
									}
								"
								v-auth="'sku_productInfo'"
								>编辑产品信息</el-dropdown-item
							>
							<el-dropdown-item
								@click="
									() => {
										batchUpdate('image');
									}
								"
								v-auth="'sku_editImage'"
								>更新产品图片</el-dropdown-item
							>
						</template>
					</el-dropdown>
				</template>

				<!-- 图片列 -->
				<template #imgUrl="{ row }">
					<MrImg :src="row.imgUrl" />
				</template>

				<!-- SKU/产品名称列 -->
				<template #skuCodeCustom="{ row }">
					<div class="col-flex-start">
						<div class="flex ellipsis-text">
							<span class="mr-1 font-color ellipsis-text">{{
								row.skuCode
							}}</span>
							<el-link
								v-if="row.skuCode"
								class="block ml-2 copy-icon"
								:icon="DocumentCopy"
								@click="copyText(row.skuCode)"
								underline="never"
							></el-link>
						</div>
						<div class="flex ellipsis-text">
							<span class="mr-1 font-color ellipsis-text">{{
								row.skuName
							}}</span>
							<el-link
								v-if="row.skuName"
								class="block ml-2 copy-icon"
								:icon="DocumentCopy"
								@click="copyText(row.skuName)"
								underline="never"
							></el-link>
						</div>
					</div>
				</template>

				<!-- SPU/父产品名称列 -->
				<template #spuCodeCustom="{ row }">
					<div class="col-flex-start">
						<div class="flex ellipsis-text">
							<el-link type="primary" @click="openDialog('spuView', row)">{{
								row.spuCode
							}}</el-link>
							<el-link
								v-if="row.spuCode"
								class="block ml-2 copy-icon"
								:icon="DocumentCopy"
								@click="copyText(row.spuCode)"
								underline="never"
							></el-link>
						</div>
						<div class="flex ellipsis-text">
							<span class="mr-1 font-color ellipsis-text">{{
								row.spuName
							}}</span>
							<el-link
								v-if="row.spuName"
								class="block ml-2 copy-icon"
								:icon="DocumentCopy"
								@click="copyText(row.spuName)"
								underline="never"
							></el-link>
						</div>
					</div>
				</template>

				<!-- 关联MSKU列 -->
				<template #mskusCustom="{ row }">
					<div v-if="!row.mskus?.length">---</div>
					<div v-else @click.stop="clickedMskuRowId = row.id">
						<div
							v-for="(sku, index) in (row.mskus ?? []).slice(0, 2)"
							:key="sku?.id ?? index"
							class="relative flex items-center h-6"
						>
							<div
								class="flex-1 pr-8 overflow-hidden whitespace-nowrap text-ellipsis"
							>
								{{ sku?.mskuCode ?? '--' }}
							</div>
							<div
								v-if="index === Math.min(row.mskus.length, 2) - 1"
								class="absolute right-0 transform -translate-y-1/2 top-1/2"
							>
								<MskuPopover :tableData="row.mskus ?? []" :dictMap="dictMap" />
							</div>
						</div>
					</div>
				</template>

				<!-- 类目列 -->
				<template #categoryCode="{ row }">
					<div class="col-flex-start">
						<div>{{ row.categoryCode }}</div>
						<div>{{ row.categoryName }}</div>
					</div>
				</template>

				<!-- 品牌列 -->
				<template #brandCode="{ row }">
					<div class="col-flex-start">
						<div>{{ row.brandCode }}</div>
						<div>{{ row.brandName }}</div>
					</div>
				</template>

				<!-- 平台列 -->
				<template #platforms="{ row }">
					<el-tooltip
						:content="formatPlatformTooltip(row.platforms)"
						placement="top"
						effect="dark"
					>
						<span>{{ formatPlatformText(row.platforms) }}</span>
					</el-tooltip>
				</template>

				<!-- 状态列 -->
				<template #status="{ row }">
					<el-switch
						:modelValue="!!row.status"
						size="small"
						:disabled="
							row.status === 1 || row.status === '1'
								? !auth('sku_stop')
								: !auth('sku_start')
						"
						@change="(e: any) => { statusChange(e, row); }"
					></el-switch>
				</template>

				<!-- 关联产品/配件列 -->
				<template #materials="{ row }">
					<div class="flex flex-col items-center">
						<div class="flex flex-row items-center gap-1">
							<el-tooltip
								v-if="
									row.materials.length &&
									row.materials[0] &&
									getMaterialText(row.materials).length > 25
								"
								:content="getMaterialText(row.materials)"
								placement="top"
							>
								<div class="ellipsis-text">
									{{ truncateText(getMaterialText(row.materials), 10) }}
								</div>
							</el-tooltip>
							<div v-else class="ellipsis-text">
								{{
									row.materials.length && row.materials[0]
										? getMaterialText(row.materials)
										: '--'
								}}
							</div>
							<div v-if="row.materials.length > 0">
								<MaterialsPopover :tableData="row.materials" :row="row" />
							</div>
						</div>
					</div>
				</template>

				<!-- 运营组列 -->
				<template #skuDepts="{ row }">
					<el-tooltip
						:content="formatSkuDeptsTooltip(row.skuDepts)"
						placement="top"
						effect="dark"
					>
						<span>{{ formatSkuDeptsText(row.skuDepts) }}</span>
					</el-tooltip>
				</template>

				<!-- 操作列 -->
				<template #action="{ row }">
					<div class="flex items-center">
						<el-button
							text
							type="primary"
							class="mr20"
							@click="openDialog('view', row)"
							>{{ $t('详情') }}
						</el-button>
						<el-dropdown @command="(type: any) => handleCommand(type, row)">
							<span class="el-dropdown-link">
								操作
								<el-icon class="el-icon--right"><arrow-down /></el-icon>
							</span>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item command="edit">编辑</el-dropdown-item>
									<el-dropdown-item command="copy">复制</el-dropdown-item>
									<el-dropdown-item
										command="contact"
										v-if="auth('sku_edit_msku')"
										>关联MSKU</el-dropdown-item
									>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</div>
				</template>
			</BaseTable>
		</div>
		<el-dialog
			v-model="statusVisible"
			:show-close="false"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			width="25%"
			class="status-header"
		>
			<div>
				<div class="flex items-center mb10">
					<el-icon size="22px" :color="status ? '#2E5CF6' : '#f56c6c'"
						><Warning
					/></el-icon>
					<span class="text-lg ml8">
						{{ status ? '启用' : '停用' }}
					</span>
				</div>
				<div class="text-lg ml30">
					<div>
						{{ status ? '' : '停用后SKU将无法采购' }}
					</div>
					<div>
						确定{{ status ? '启用' : '停用' }}{{ currentRow?.skuCode }}[{{
							currentRow?.skuName
						}}]吗?
					</div>
				</div>
			</div>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="statusVisible = false">取消</el-button>
					<el-button v-if="status" type="primary" @click="changeStatus">
						启用
					</el-button>
					<el-button v-else type="danger" plain @click="changeStatus"
						>停用</el-button
					>
				</div>
			</template>
		</el-dialog>
		<!-- 编辑、新增  -->
		<FormDialog
			v-model="visible"
			:currentRow="currentRow"
			:visibleType="visibleType"
			:title="title"
			:dictMap="dictMap"
			@closeDialog="closeDialog"
			@changeCopy="changeCopy"
			@changeEdit="changeEdit"
		></FormDialog>
		<!-- 展示spu -->
		<FormDialogSpu
			v-model="visibleSpu"
			:currentRow="currentRow"
			:dictMap="dictMap"
			:visibleType="'skuView'"
			:title="'查看SPU'"
			@closeDialog="
				() => {
					visibleSpu = false;
				}
			"
		/>
		<!-- 关联MSKU -->
		<AssociateMsku
			v-model="visibleAssociateMsku"
			@closeDialog="
				() => {
					visibleAssociateMsku = false;
					selectedRows = [];
					getDataList();
				}
			"
			:dictMap="dictMap"
			:currentRow="currentRow"
		/>
		<!-- 分配运营组 -->
		<AssociateSkuDepts
			v-model="visibleAssociateSkuDepts"
			@closeDialog="
				() => {
					register.safeCallTableMethod('clearCheckboxRow');
					visibleAssociateSkuDepts = false;
					getDataList();
				}
			"
			:selectedRows="selectedRows"
		/>
		<ImportDialog
			ref="importDialogRef"
			title="导入SKU"
			templateUrl="/files/import-template/导入SKU模版.xlsx"
			archiveUploadApi="/product/sku/import"
			@refreshDataList="getDataList"
			:accept="'.zip'"
			:uploadTips="[
				'建议每次导入都使用最新的导入模板，避免出现不必要的错误',
				'仅支持zip格式',
				'行数不超过5000条，文件大小不超过5M',
				'同一个记录代码存在多条记录时，以第一条为准',
			]"
		/>
		<ImportDialog
			ref="importDialogMskuRef"
			title="导入MSKU"
			templateUrl="/files/import-template/导入MSKU模版.xlsx"
			excelUploadApi="/product/sku/importMsku"
			@refreshDataList="getDataList"
		/>
		<PushSkuDialog
			v-model="visiblePushSku"
			:pushSkuCodeList="pushSkuCodeList"
			ref="pushSkuDialogRef"
			title="推送至三方仓"
		/>
		<!-- 展示图片 -->
		<Preview v-model="showPreview" :url="currentRow?.imgUrl" type="image" />
		<BatchUpdateImg
			ref="batchUpdateImg"
			:selectedRows="selectedRows"
			@closeDialog="getDataList"
		/>
		<!-- 批量编辑 -->
		<AllEditSku ref="allEditSkuRef" @getDataList="getDataList" />
	</div>
</template>
<script lang="ts" name="systemDatasourceConf" setup>
// import { BasicTableProps, useTable } from '/@/hooks/table';
import {
	getSkuList,
	enableSku,
	disableSku,
	getListByCondition,
	getCurrencyOption,
	postFetchProductSkus,
} from '/@/api/product/sku';
import { deptTree } from '/@/api/admin/dept';
import { DocumentCopy } from '@element-plus/icons-vue';
import { useMultipleDicts } from '/@/hooks/multipleDicts';
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, reactive, computed } from 'vue';
import { useMessage } from '/@/hooks/message';
import { getDicts } from '/@/api/admin/dict';
import { getSpuDetailsById } from '/@/api/product/spu';
import { sysCountryList } from '/@/api/materialFlow/track';
import { getCategoryTree } from '/@/api/product/category';
import { getBrandAllList } from '/@/api/product/brand';
import { getDeptLastDeptByCondition } from '/@/api/admin/dept';
import { getAllSpu } from '/@/api/admin/legalEntity/product';
import { auth, auths } from '/@/utils/authFunction';
import { getSkuDetailInfo, getExportSku } from '/@/api/product/sku';
import { getUserListByCondition } from '/@/api/admin/user';
import commonFunction from '/@/utils/commonFunction';

import {
	BasicTableProps,
	useTable,
} from '/@/components/BaseTable/hooks/BaseTable';
import { columns } from './config/index';
// 引入组件
const FormDialog = defineAsyncComponent(
	() => import('./components/form-dialog/form-dialog.vue')
);
const MskuPopover = defineAsyncComponent(
	() => import('./components/msku-popover.vue')
);
const TreeSelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/tree-select-input.vue')
);
const MaterialsPopover = defineAsyncComponent(
	() => import('./components/materials-popover.vue')
);
const AssociateMsku = defineAsyncComponent(
	() => import('./components/associate-msku.vue')
);
const AssociateSkuDepts = defineAsyncComponent(
	() => import('./components/associate-skuDepts.vue')
);
const ImportDialog = defineAsyncComponent(
	() => import('/@/components/fileUpload/importDialog.vue')
);
const Preview = defineAsyncComponent(
	() => import('/@/components/Material/preview.vue')
);
const PushSkuDialog = defineAsyncComponent(
	() => import('./components/dialog/push-sku.vue')
);
const AllEditSku = defineAsyncComponent(
	() => import('./components/all-edit-sku/index.vue')
);
// spu的状态弹窗
const FormDialogSpu = defineAsyncComponent(
	() => import('../spu/components/form-dialog/form-dialog.vue')
);
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
// 批量上传图片弹窗
const BatchUpdateImg = defineAsyncComponent(
	() => import('./components/batchUpdateImg.vue')
);
const { t } = useI18n();

// 获取材料文本
const getMaterialText = (materials: any[]) => {
	if (!materials.length || !materials[0]) return '--';
	return `${materials[0]?.materialCode} * ${materials.length}`;
};

// 截断文本，超过指定长度时显示省略号
const truncateText = (text: string, maxLength: number = 25) => {
	if (!text || text.length <= maxLength) return text;
	return text.substring(0, maxLength) + '...';
};

// 格式化平台展示文本（最多显示2个，超出显示省略号）
const formatPlatformText = (platforms: any[]): string => {
	if (!platforms?.length) return '';
	const texts = platforms.map((p) => p.platformText);
	return texts.length <= 2
		? texts.join(', ')
		: texts.slice(0, 2).join(', ') + '...';
};

// 格式化平台 tooltip 文本（全量）
const formatPlatformTooltip = (platforms: any[]): string => {
	return platforms?.map((p) => p.platformText).join(', ') ?? '';
};

// 格式化运营组展示文本（最多显示2个，超出显示省略号）
const formatSkuDeptsText = (skuDepts: any[]): string => {
	if (!skuDepts?.length) return '';
	const texts = skuDepts.map((p) => p?.deptName);
	return texts.length <= 2
		? texts.join(', ')
		: texts.slice(0, 2).join(', ') + '...';
};

// 格式化运营组 tooltip 文本（全量）
const formatSkuDeptsTooltip = (skuDepts: any[]): string => {
	return skuDepts?.map((p) => p?.deptName).join(', ') ?? '';
};

// table ref
const baseTableRef = ref();
//   初始化数据
const { dictMap } = useMultipleDicts(
	[
		{
			key: 'platform',
			fetchFn: getDicts,
			params: 'platform_channel',
		}, // 平台
		{
			key: 'productType',
			fetchFn: getDicts,
			params: 'product_type',
		}, // 产品类型
		{
			key: 'shopOption',
			fetchFn: getListByCondition,
			params: '',
		}, // 店铺站点
		{
			key: 'currencyOption',
			fetchFn: getCurrencyOption,
			params: {},
		}, // 币种字典
		{
			key: 'productManageId',
			fetchFn: getUserListByCondition,
			params: { lockFlag: 0 },
		}, // 人员列表 / 负责人（去重合并）
		{
			key: 'saleArea',
			fetchFn: getDicts,
			params: 'sale_area',
		}, // 销售地区
		{
			key: 'countryList',
			fetchFn: sysCountryList,
		}, // 国家列表
		{
			key: 'categoryCode',
			fetchFn: getCategoryTree,
			params: {
				status: 1,
			},
		}, // 类目
		{
			key: 'brandCode',
			fetchFn: getBrandAllList,
			params: '',
		}, // 品牌
		{
			key: 'color',
			fetchFn: getDicts,
			params: 'product_color',
		}, // 颜色
		{
			key: 'grade',
			fetchFn: getDicts,
			params: 'product_grade',
		}, // 产品等级
		{
			key: 'specialAttribute',
			fetchFn: getDicts,
			params: 'special_attribute',
		}, // 特殊属性
		{
			key: 'purchaseLeadTimeUnit',
			fetchFn: getDicts,
			params: 'purchase_lead_time_unit',
		}, // 采购交期单位
		{
			key: 'referenceCostUnit',
			fetchFn: getDicts,
			params: 'reference_cost_unit',
		}, // 参考成本单位
		{
			key: 'itemSpecUnit',
			fetchFn: getDicts,
			params: 'item_spec_unit',
		}, // 单品规格单位
		{
			key: 'itemNetWeightUnit',
			fetchFn: getDicts,
			params: 'item_net_weight_unit',
		}, // 单品净重单位
		{
			key: 'skuDepts',
			fetchFn: getDeptLastDeptByCondition,
			params: {
				deptName: '运营中心',
			},
		}, // 运营部门
		{
			key: 'deptTree',
			fetchFn: deptTree,
			params: {
				deptName: '运营中心',
				showRootFlag: 0, // 是否显示根节点 1是展示 0不展示
			},
		}, // 部门树
		{
			key: 'spuInfo',
			fetchFn: getAllSpu,
			params: { lockFlag: 0 },
		}, // SPU信息
	],
	{
		isAuto: true,
		tableRef: baseTableRef,
	}
);
// 传递字典
provide('dictMap', dictMap);
// 搜索变量
const queryRef = ref();
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);
// 定义变量内容
const importDialogRef = ref();
const importDialogMskuRef = ref();
const pushSkuDialogRef = ref();

// 时间存储
const timeRange = ref([null, null]);

// 需要推送的skuCode列表
const pushSkuCodeList = ref<String[]>([]);
// 当前点击的行
const currentRow = ref<any>({
	id: '',
});
// 弹窗是否显示
const visible = ref(false);
// 弹窗类型
const visibleType = ref('');
// spu弹窗是否显示
const visibleSpu = ref(false);
// 弹窗标题
const title = ref('添加SKU');

// 推送SKU弹窗是否显示
const visiblePushSku = ref(false);

// 分配运营组是否显示
const visibleAssociateSkuDepts = ref(false);
// 是否显示预览
const showPreview = ref(false);
// 当前table多选的数据
const selectedRows = ref([]);
// 当前点击的 msku 行 id，用于懒渲染 MskuPopover
const clickedMskuRowId = ref<string | null>(null);

// 关联SKU部门是否显示
const visibleAssociateMsku = ref(false);
// spu批量编辑ref
const allEditSkuRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		status: 1, // 默认启用
		categoryCodes: [],
	},
	pageList: getSkuList,
	columns,
	descs: ['create_time'],
	ascs: [],
	toolBarConfig: {
		handleRefresh: () => register?.getDataList(),
		handleExport: () => exportPartFn(),
		// isShowExport: auth('sku_export'),
		settingKey: 'sku_index',
	},
});

// 产品类型选项直接复用 dictMap，避免重复请求
const productTypeOptions = computed<Array<{ value: string; label: string }>>(
	() => dictMap.value?.productType ?? []
);

//  table hook
const { register, getDataList, resetTableQuery } = useTable(
	state,
	baseTableRef
);

// 复制
const { copyText } = commonFunction();

// 清空搜索条件
const resetQuery = () => {
	resetTableQuery(() => {
		// 重置时间范围
		timeRange.value = [null, null];
		return {
			queryForm: {
				current: 1,
				size: 10,
				status: 1, // 默认启用
			},
			descs: ['create_time'],
			ascs: [],
		};
	});
};

// 多选事件（VxeTable 通过 register.safeCallTableMethod 获取选中行）
const syncSelectedRows = () => {
	const rows = register.safeCallTableMethod('getCheckboxRecords') || [];
	selectObjs.value = rows.map(({ id }: { id: string }) => id);
	multiple.value = !rows.length;
	pushSkuCodeList.value = rows.map((item: any) => item.skuCode);
	selectedRows.value = rows;
};

// 打开推送sku弹窗
const openPushSkuDialog = () => {
	// 先同步当前选中行
	syncSelectedRows();
	// 如果未选中任何sku，则提示用户
	if (selectObjs.value.length === 0) {
		useMessage().warning('请至少选择一条sku数据');
		return;
	}

	visiblePushSku.value = true;
};

// 导出sku
const exportPartFn = async () => {
	try {
		const ids = register.getSelectedIds();
		// 显示加载状态
		state.loading = true;
		await getExportSku({
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
		state.loading = false;
	}
};

// 打开类别弹窗
const openDialog = async (type: string, row?: any) => {
	if (type === 'add') {
		// 添加操作
		title.value = '添加SKU';
	} else if (type === 'edit' && row) {
		// 编辑操作
		// 查看操作
		const res = await getSkuDetailInfo({
			id: row.id,
		});
		if (res.code === 0) {
			currentRow.value = res.data;
		}
		title.value = '编辑SKU';
	} else if (type === 'view' && row) {
		// 查看操作
		const res = await getSkuDetailInfo({
			id: row.id,
		});
		if (res.code === 0) {
			currentRow.value = res.data;
		}
		title.value = 'SKU详情';
	} else if (type === 'copy' && row) {
		// 复制操作
		const res = await getSkuDetailInfo({
			id: row.id,
		});
		if (res.code === 0) {
			currentRow.value = res.data;
		}
		title.value = '复制SKU';
	} else if (type === 'spuView' && row) {
		// 查看SPU操作
		const res = await getSpuDetailsById({
			id: row.spuId,
		});
		if (res.code === 0) {
			currentRow.value = res.data;
		}
		visibleSpu.value = true;
		return;
	}
	visible.value = true;
	// 设置弹窗类型
	visibleType.value = type;
};
// 关闭品牌弹窗
const closeDialog = () => {
	visible.value = false;
	// 刷新数据列表
	getDataList();
};
// 打开分配运营组弹窗
const openAssociateSkuDepts = () => {
	syncSelectedRows();
	if (selectedRows.value.length === 0) {
		useMessage().warning('请至少选择一条数据');
		return;
	}
	visibleAssociateSkuDepts.value = true;
};
// 打开关联MSKU弹窗
const openAssociateMsku = async (row: { id: string }) => {
	// 复制操作
	const res = await getSkuDetailInfo({
		id: row.id,
	});
	// 获取当前选中的行
	currentRow.value = res.data;
	// 打开关联MSKU弹窗
	visibleAssociateMsku.value = true;
};
// 辅料状态修改 -- 二次确认
const status = ref<Boolean>(false);
const statusVisible = ref(false);

const statusChange = (type: Boolean, row: any) => {
	status.value = type;
	statusVisible.value = true;
	// 设置当前行
	currentRow.value = row;
};

// 修改辅料状态
const changeStatus = async () => {
	// 关闭弹窗
	statusVisible.value = false;
	// 调用接口修改状态
	if (status.value) {
		// 启用操作
		await enableSku({ id: currentRow.value?.id });
		getDataList();
	} else {
		// 停用操作
		await disableSku({ id: currentRow.value?.id });
		getDataList();
	}
};

// 操作
const handleCommand = (type: any, row: any) => {
	switch (type) {
		case 'edit':
			openDialog('edit', row);
			break;
		case 'copy':
			openDialog('copy', row);
			break;
		case 'contact':
			openAssociateMsku(row);
			break;
	}
};
// 复制操作
const changeCopy = async (row: { id: string }) => {
	visible.value = false;
	await new Promise((resolve) => setTimeout(resolve, 100)); // 确保关闭后再打开
	openDialog('copy', row);
};
// 切换到编辑模式
const changeEdit = async (row: { id: string }) => {
	visible.value = false;
	await new Promise((resolve) => setTimeout(resolve, 100)); // 确保关闭后再打开
	openDialog('edit', row);
};

// 更新图片弹窗ref
const batchUpdateImg = ref();
// 批量操作
const batchUpdate = async (type: string) => {
	syncSelectedRows();
	if (selectedRows.value.length === 0) {
		useMessage().warning('请至少选择一条数据');
		return;
	}
	if (type === 'image') {
		batchUpdateImg.value.handleOpen();
	} else if (type === 'productInfo') {
		const skuCodes = (
			register.safeCallTableMethod('getCheckboxRecords') || []
		).map((item: any) => item.skuCode);
		if (skuCodes.length === 0) {
			useMessage().warning('请至少选择一条数据');
			return;
		}
		const res = await postFetchProductSkus({ skuCodes });
		if (res.code !== 0) {
			useMessage().error(res.msg || '请求失败');
			return;
		}
		allEditSkuRef.value.show(res.data);
	}
};
</script>

<style lang="scss" scoped>
.el-dropdown-link {
	cursor: pointer;
	color: var(--el-color-primary);
	display: flex;
	align-items: center;
}
.ellipsis-text {
	max-width: 100%;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
/* 表格列内容：纵向排列，左对齐，撑满宽度 */
.col-flex-start {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	width: 100%;
}
.copy-icon {
	display: none;
}
.col-flex-start {
	.copy-icon {
		display: block;
	}
}
</style>
