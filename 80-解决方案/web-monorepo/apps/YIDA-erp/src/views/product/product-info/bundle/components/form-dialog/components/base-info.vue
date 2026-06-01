<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-09 15:18:34
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-11-20 14:04:43
 * @FilePath: \qianyi-ui\src\views\product\product-info\bundle\components\form-dialog\components\base-info.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template>
	<div>
		<el-form
			ref="dataFormRef"
			:model="localFormData"
			label-width="100px"
			:rules="baseInfoRule"
			v-if="props.visibleType !== 'view'"
		>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item :label="$t('捆绑编码')" prop="bundleCode">
						<el-input
							v-model="localFormData.bundleCode"
							:placeholder="$t('保存后不可修改')"
							maxlength="50"
							show-word-limit
							:disabled="
								props.visibleType === 'edit' || !auth('bundle_edit_info')
							"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="16">
					<el-form-item :label="$t('捆绑品名')" prop="bundleName">
						<el-input
							v-model="localFormData.bundleName"
							:placeholder="$t('请输入')"
							maxlength="100"
							show-word-limit
							:disabled="!auth('bundle_edit_info')"
						/>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item :label="$t('捆绑类型')" prop="bundleType">
						<!-- <el-select
							v-model="localFormData.bundleType"
							filterable
							placeholder="请选择"
							:disabled="!auth('bundle_edit_info')"
						>
							<el-option
								v-for="item in props.dictMap.bundleType"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select> -->
						<SelectInputApi
							v-model="localFormData.bundleType"
							componentType="dicts"
							placeholder="请选择"
							:disabled="!auth('bundle_edit_info')"
							:settings="{
								getTreeDataParams: 'bundle_type',
							}"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<!-- <el-form-item :label="$t('销售地区')" prop="saleArea">
						<el-select v-model="localFormData.saleArea" filterable placeholder="请选择">
							<el-option v-for="item in props.dictMap.saleArea" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-form-item> -->
					<el-form-item :label="$t('销售国家')" prop="productBundleCountryList">
						<!-- <el-select
							collapse-tags
							:max-collapse-tags="1"
							clearable
							filterable
							multiple
							v-model="localFormData.productBundleCountryList"
							:disabled="!auth('bundle_edit_info')"
							placeholder="国家"
							style="width: 310px"
						>
							<el-option
								v-for="item in dictMap.countryList"
								:key="item.abbTwoCode"
								:label="`${item.abbTwoCode}-${item.chineseName}`"
								:value="item.abbTwoCode"
							/>
						</el-select> -->
						<TreeSelectInputApi
							v-model:queryForm="localFormData"
							componentType="country"
							placeholder="国家"
							code="productBundleCountryList"
							:disabled="!auth('bundle_edit_info')"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item :label="$t('销售渠道')" prop="platform">
						<!-- <el-select
							v-model="localFormData.platform"
							:disabled="!auth('bundle_edit_info')"
							filterable
							collapse-tags
							:max-collapse-tags="1"
							placeholder="请选择"
							multiple
						>
							<el-option
								v-for="item in props.dictMap.platform"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select> -->
						<SelectInputApi
							v-model="localFormData.platform"
							componentType="dicts"
							placeholder="请选择"
							multiple
							:disabled="!auth('bundle_edit_info')"
							:settings="{
								getTreeDataParams: 'platform_channel',
							}"
						/>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item :label="$t('产品负责人')" prop="productManageId">
						<!-- <el-select
							v-model="localFormData.productManageId"
							:disabled="!auth('bundle_edit_info')"
							filterable
							placeholder="请选择"
						>
							<el-option
								v-for="item in props.dictMap.productManageId"
								:key="item.userId"
								:label="item.name"
								:value="item.userId"
							/>
						</el-select> -->
						<SelectInputApi
							v-model="localFormData.productManageId"
							componentType="userList"
							placeholder="请选择"
							:disabled="!auth('bundle_edit_info')"
							:settings="{
								getTreeDataParams: {
									lockFlag: 0,
								},
							}"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item :label="$t('运营组')" prop="deptIds">
						<TreeSelectInputApi
							v-model:queryForm="localFormData"
							:disabled="!auth('bundle_edit_info')"
							:style="{ width: '100%' }"
							:settings="{
								getTreeData: getDeptLastDeptByCondition,
								getTreeDataParams: {
									deptName: '运营中心',
								},
								text: '运营组',
								width: '100%',
								code: 'deptIds',
								selectTreeProps: {
									value: 'deptId',
									label: 'name',
									children: 'children',
								},
								getIdsCode: 'deptId',
							}"
						/>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="24"
					><el-form-item :label="$t('产品描述')">
						<el-input
							:disabled="!auth('bundle_edit_info')"
							v-model="localFormData.productDesc"
							:rows="3"
							maxlength="500"
							show-word-limit
							type="textarea"
							placeholder="产品描述"
						/> </el-form-item></el-col
			></el-row>
			<el-row class="mb18">
				<el-col :span="24">
					<el-form-item label="附件" prop="attachmentFileName">
						<upload-file
							:limit="10"
							:fileSize="20"
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
							v-model="localFormData.attachmentFileName"
							:isShowTip="true"
							:uploadFileUrl="'/admin/sys-file/upload'"
							type="simple"
							:data="{}"
							:dir="''"
							:autoUpload="true"
							:disabled="!auth('bundle_edit_info')"
							@error="() => {}"
							@remove="() => {}"
							@preview="() => {}"
							@exceed="() => {}"
							@success="() => {}"
						/> </el-form-item></el-col
			></el-row>
		</el-form>
		<el-form
			ref="dataFormRef"
			:model="localFormData"
			label-width="100px"
			v-else
		>
			<el-text
				class="mx-1 ml-10 mr-5"
				:style="{ fontWeight: 'bold', fontSize: '20px' }"
				>{{ localFormData.bundleCode }}</el-text
			>
			<el-tag :type="props.currentRow.status === 1 ? 'success' : 'danger'">{{
				props.currentRow.status === 1 ? '启用' : '禁用'
			}}</el-tag>
			<el-row class="mb18">
				<el-col :span="16">
					<el-form-item :label="$t('捆绑品名')" prop="bundleName">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">{{
							localFormData.bundleName
						}}</el-text>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item :label="$t('捆绑类型')" prop="bundleType">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">{{
							showText('bundleType', localFormData.bundleType).label
						}}</el-text>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<!-- <el-form-item :label="$t('销售地区')" prop="saleArea">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">{{ showText('saleArea', localFormData.saleArea).label }}</el-text>
					</el-form-item>
					-->
					<el-form-item :label="$t('销售国家')" prop="productBundleCountryList">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">{{
							localFormData.countryCodeText?.split(',')?.join(', ')
						}}</el-text>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item :label="$t('平台')" prop="platform">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">{{
							showText('platform', localFormData.platform).label
						}}</el-text>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item :label="$t('产品负责人')" prop="productManageId">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">{{
							showText('productManageId', localFormData.productManageId).name
						}}</el-text>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item :label="$t('运营组')" prop="deptIds">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">
							{{ showText('skuDepts', localFormData.skuDepts).name }}
							<el-tooltip
								:content="localFormData.deptIds
													?.map((p: any) => {
														return findNode(dictMap.skuDepts, 'deptId', p)?.name || p;
													})
													.join(', ')"
								placement="top"
								effect="dark"
							>
								<span>
									{{
										localFormData.deptIds.length <= 2
											? localFormData.deptIds
													?.map((p: any) => {
														return (
															findNode(dictMap.skuDepts, 'deptId', p)?.name || p
														);
													})
													.join(', ')
											: localFormData.deptIds
													?.slice(0, 2)
													.map((p: any) => {
														return (
															findNode(dictMap.skuDepts, 'deptId', p)?.name || p
														);
													})
													.join(', ') + '...'
									}}
								</span>
							</el-tooltip>
						</el-text>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="24"
					><el-form-item :label="$t('产品描述')">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">{{
							localFormData.productDesc
						}}</el-text>
					</el-form-item>
				</el-col></el-row
			>
			<el-row class="mb18">
				<el-col :span="24">
					<el-form-item label="附件" prop="attachmentFileName">
						<upload-file
							:limit="10"
							:fileSize="20"
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
							v-model="localFormData.attachmentFileName"
							:isShowTip="true"
							:uploadFileUrl="'/admin/sys-file/upload'"
							type="simple"
							:data="{}"
							:dir="''"
							:autoUpload="true"
							:disabled="true"
							@error="() => {}"
							@remove="() => {}"
							@preview="() => {}"
							@exceed="() => {}"
							@success="() => {}"
						/> </el-form-item></el-col
			></el-row>
		</el-form>
	</div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';
import { baseInfoRule } from './rules/base-info';
import { findNode } from '/@/utils/arrayTree';
import { getDeptLastDeptByCondition } from '/@/api/admin/dept';
import { auth } from '/@/utils/authFunction';
const props = defineProps({
	dictMap: {
		type: Object,
		default: () => ({}),
	},
	visibleType: {
		type: String,
		default: '', // edit, view
	},
	currentRow: {
		type: Object,
		default: () => ({}),
	},
});
const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);

const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);

//  当前form的ref
const dataFormRef = ref();
// 当前form的数据
const localFormData = ref<any>({
	bundleCode: '',
	bundleName: '',
	bundleType: '',
	// saleArea: '',
	deptIds: [],
	platform: [],
	productManageId: '',
	skuDepts: [],
	productDesc: '',
	attachmentFileName: [],
	productBundleCountryList: [],
});
const setData = (data: any) => {
	localFormData.value = data;
};
// 回显函数
const showText = (type: string, value: any[]): any => {
	if (type === 'categoryCode') {
		return findNode(props.dictMap.categoryCode, 'id', value) || {};
	} else if (type === 'brandCode') {
		return findNode(props.dictMap.brandCode, 'brandCode', value) || {};
	} else if (type === 'productType') {
		return findNode(props.dictMap.productType, 'value', value) || {};
	} else if (type === 'grade') {
		return findNode(props.dictMap.grade, 'value', value) || {};
	} else if (type === 'bundleType') {
		return findNode(props.dictMap.bundleType, 'value', value) || {};
	} else if (type === 'saleArea') {
		return findNode(props.dictMap.saleArea, 'value', value) || {};
	} else if (type === 'productManageId') {
		return findNode(props.dictMap.productManageId, 'userId', value) || {};
	} else if (type === 'skuDepts') {
		return findNode(props.dictMap.skuDepts, 'deptId', value) || {};
	} else if (type === 'specialAttribute') {
		const valueSet = new Set(value);
		const labels = props.dictMap.specialAttribute
			.filter((item: any) => valueSet.has(item.value))
			.map((item: any) => item.label);
		const label = labels.join(', ');
		return { label };
	} else if (type === 'platform') {
		const valueSet = new Set(value);
		const labels = props.dictMap.platform
			.filter((item: any) => valueSet.has(item.value))
			.map((item: any) => item.label);
		const label = labels.join(', ');
		return { label };
	}
	return value;
};
defineExpose({
	dataFormRef,
	localFormData,
	setData,
});
</script>

<style lang="less" scoped></style>
