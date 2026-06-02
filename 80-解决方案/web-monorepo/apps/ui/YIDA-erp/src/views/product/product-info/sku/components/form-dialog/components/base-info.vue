<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-09 15:18:34
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-01-28 18:23:10
 * @FilePath: \qianyi-ui\src\views\product\product-info\sku\components\form-dialog\components\base-info.vue
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
			v-if="props.visibleType !== 'view' && props.visibleType !== 'spuView'"
		>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item :label="$t('SKU')" prop="skuCode">
						<el-input
							v-model="localFormData.skuCode"
							:placeholder="$t('保存后不可修改')"
							maxlength="50"
							show-word-limit
							:disabled="props.visibleType === 'edit' || !auth('sku_edit_info')"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="16">
					<el-form-item :label="$t('产品名称')" prop="skuName">
						<el-input
							v-model="localFormData.skuName"
							:placeholder="$t('请输入')"
							maxlength="100"
							show-word-limit
							:disabled="!auth('sku_edit_info')"
						/>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item :label="$t('类目')" prop="categoryCode">
						<el-tree-select
							:show-all-levels="false"
							v-model="localFormData.categoryCode"
							filterable
							:checkStrictly="true"
							placeholder="请选择"
							:data="props.dictMap.categoryCode"
							:props="{
								value: 'id',
								label: 'name',
								children: 'children',
								emitPath: false,
								checkStrictly: true,
							}"
							:style="{ width: '100%' }"
							:disabled="!auth('sku_edit_info')"
							@change="
								() => {
									dataFormRef?.validateField('categoryCode');
								}
							"
						>
						</el-tree-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item :label="$t('品牌')" prop="brandCode">
						<el-select
							v-model="localFormData.brandCode"
							filterable
							placeholder="请选择"
							:disabled="!auth('sku_edit_info')"
						>
							<el-option
								v-for="item in props.dictMap.brandCode"
								:key="item.value"
								:label="`${item.brandCode}-${item.brandName}`"
								:value="item.brandCode"
							/>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item :label="$t('产品类型')" prop="productType">
						<el-select
							v-model="localFormData.productType"
							:disabled="!auth('sku_edit_info')"
							filterable
							placeholder="请选择"
							@change="
								(e:string) => {
									handleChangeProductType(e);
								}
							"
						>
							<el-option
								v-for="item in props.dictMap.productType"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item :label="$t('产品等级')" prop="grade">
						<el-select
							v-model="localFormData.grade"
							filterable
							placeholder="请选择"
							:disabled="!auth('sku_edit_info')"
						>
							<el-option
								v-for="item in props.dictMap.grade"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item :label="$t('颜色')">
						<el-select
							v-model="localFormData.color"
							filterable
							clearable
							placeholder="请选择"
							:disabled="!auth('sku_edit_info')"
						>
							<el-option
								v-for="item in props.dictMap.color"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item :label="$t('SPU')">
						<el-select
							v-model="localFormData.spuCode"
							filterable
							clearable
							placeholder="请选择"
							:disabled="!auth('sku_edit_info')"
						>
							<el-option
								v-for="item in props.dictMap.spuInfo"
								:key="item.spuName"
								:label="`${item.spuCode} - ${item.spuName}`"
								:value="item.spuCode"
							/>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item :label="$t('销售国家')">
						<el-select
							collapse-tags
							:max-collapse-tags="1"
							clearable
							filterable
							multiple
							v-model="localFormData.productSkuCountryList"
							placeholder="国家"
							style="width: 310px"
							:disabled="!auth('sku_edit_info')"
						>
							<el-option
								v-for="item in dictMap.countryList"
								:key="item.abbTwoCode"
								:label="`${item.abbTwoCode}-${item.chineseName}`"
								:value="item.abbTwoCode"
							/>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item :label="$t('销售渠道')">
						<el-select
							v-model="localFormData.platform"
							placeholder="请选择"
							clearable
							multiple
							collapse-tags
							:max-collapse-tags="1"
							filterable
							:disabled="!auth('sku_edit_info')"
						>
							<el-option
								v-for="item in props.dictMap.platform"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item :label="$t('产品负责人')" prop="productManageId">
						<el-select
							v-model="localFormData.productManageId"
							filterable
							placeholder="请选择"
							:disabled="!auth('sku_edit_info')"
						>
							<el-option
								v-for="item in props.dictMap.productManageId"
								:key="item.userId"
								:label="item.name"
								:value="item.userId"
							/>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item :label="$t('运营组')" prop="skuDepts">
						<TreeSelectInput
							v-model:queryForm="localFormData"
							:disabled="!auth('sku_edit_info')"
							:style="{ width: '100%' }"
							:settings="{
								getTreeData: getDeptLastDeptByCondition,
								getTreeDataParams: {
									deptName: '运营中心',
								},
								text: '运营组',
								width: '100%',
								code: 'skuDepts',
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
				<el-col :span="24">
					<el-form-item :label="$t('特殊属性')" prop="specialAttribute">
						<el-checkbox-group
							v-model="localFormData.specialAttribute"
							@change="() => {}"
							:disabled="!auth('sku_edit_info')"
						>
							<el-checkbox
								v-for="item in props.dictMap.specialAttribute"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-checkbox-group> </el-form-item></el-col
			></el-row>
			<el-row
				class="mb18"
				v-show="
					localFormData.specialAttribute?.length
						? localFormData.specialAttribute?.length !== 0
							? true
							: false
						: false
				"
			>
				<el-col :span="24">
					<el-form-item :label="$t('属性说明')">
						<el-input
							v-model="localFormData.attributeDesc"
							:disabled="!auth('sku_edit_info')"
							:rows="3"
							maxlength="500"
							show-word-limit
							type="textarea"
							placeholder="属性说明"
						/> </el-form-item></el-col
			></el-row>
			<el-row class="mb18">
				<el-col :span="24"
					><el-form-item :label="$t('产品描述')">
						<el-input
							v-model="localFormData.productDesc"
							:disabled="!auth('sku_edit_info')"
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
							:disabled="!auth('sku_edit_info')"
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
				>{{ localFormData.skuCode }}</el-text
			>
			<el-tag :type="props.currentRow.status === 1 ? 'success' : 'danger'">{{
				props.currentRow.status === 1 ? '启用' : '禁用'
			}}</el-tag>
			<el-row class="mb18">
				<el-col :span="16">
					<el-form-item :label="$t('产品名称')" prop="skuName">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">{{
							localFormData.skuName
						}}</el-text>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item :label="$t('类目')" prop="categoryCode">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">{{
							showText('categoryCode', localFormData.categoryCode).name
						}}</el-text>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item :label="$t('品牌')" prop="brandCode">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">{{
							brandViewDisplayText
						}}</el-text>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item :label="$t('产品类型')" prop="productType">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">{{
							showText('productType', localFormData.productType).label
						}}</el-text>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item :label="$t('产品等级')" prop="grade">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">{{
							showText('grade', localFormData.grade).label
						}}</el-text>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item :label="$t('颜色')">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">{{
							showText('color', localFormData.color).label
						}}</el-text>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item :label="$t('SPU')">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }"
							>{{ localFormData.spuCode }}-{{ localFormData.spuName }}</el-text
						>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item :label="$t('销售国家')">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">{{
							localFormData.countryCodeText?.split(',')?.join(', ')
						}}</el-text>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item :label="$t('平台')">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">{{
							showText('platform', localFormData.platform).label
						}}</el-text>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item :label="$t('产品负责人')" prop="productManageId">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">{{
							showText('productManageId', localFormData.productManageId).name
						}}</el-text>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item :label="$t('运营组')" prop="skuDepts">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">
							{{
								localFormData?.skuDeptsText
									?.map((item: any) => {
										return item.deptName;
									})
									.join(', ') || ''
							}}
						</el-text>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="24">
					<el-form-item :label="$t('特殊属性')" prop="specialAttribute">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">{{
							showText('specialAttribute', localFormData.specialAttribute).label
						}}</el-text>
					</el-form-item></el-col
				></el-row
			>
			<el-row class="mb18">
				<el-col :span="24">
					<el-form-item :label="$t('特殊说明')">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">{{
							localFormData.attributeDesc
						}}</el-text>
					</el-form-item>
				</el-col></el-row
			>
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
import { ref, computed, defineAsyncComponent } from 'vue';
import { findNode } from '/@/utils/arrayTree';
import { rule } from '/@/utils/validate';
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
	changeProductType: {
		type: Function,
		default: () => {},
	},
});
const TreeSelectInput = defineAsyncComponent(
	() => import('/@/components/TableFormModule/tree-select-input.vue')
);
//  当前form的ref
const dataFormRef = ref();
// 当前form的数据
const localFormData = ref<any>({
	spuCode: '',
	skuCode: '',
	skuName: '',
	categoryCode: [],
	brandCode: '',
	productType: '',
	grade: '',
	color: '',
	platform: '',
	productManageId: '',
	skuDepts: [],
	specialAttribute: [],
	attributeDesc: '',
	productDesc: '',
	attachmentFileName: [],
	productSkuCountryList: [],
});

/** 查看态品牌：与编辑态选项一致，展示「代码-名称」 */
const brandViewDisplayText = computed(() => {
	const value = localFormData.value.brandCode;
	const item = findNode(props.dictMap.brandCode, 'brandCode', value) || {};
	const code = item.brandCode ?? value ?? '';
	const name = item.brandName ?? '';
	const parts = [code, name].filter((p) => p !== '' && p != null);
	return parts.join('-');
});

const baseInfoRule = ref({
	// SKU编码
	skuCode: [
		{
			required: true,
			message: '请输入SKU编码',
			trigger: 'blur',
		},
		{ validator: rule.validatorCode, trigger: 'blur' },
	],
	// 产品名称
	skuName: [
		{
			required: true,
			message: '请输入产品名称',
			trigger: 'blur',
		},
		{
			validator: rule.validateLength,
			trigger: 'blur',
		},
	],
	// 类目
	categoryCode: [
		{
			required: true,
			message: '请选择类目',
			trigger: 'blur',
		},
	],
	// 品牌
	brandCode: [
		{
			required: true,
			message: '请选择品牌',
			trigger: 'blur',
		},
	],
	// 产品类型
	productType: [
		{
			required: true,
			message: '请选择产品类型',
			trigger: 'blur',
		},
	],
	// 产品等级
	grade: [
		{
			required: true,
			message: '请选择产品等级',
			trigger: 'blur',
		},
	],
	// 产品负责人
	productManageId: [
		{
			required: true,
			message: '请选择产品负责人',
			trigger: 'blur',
		},
	],
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
	} else if (type === 'color') {
		return findNode(props.dictMap.color, 'value', value) || {};
	} else if (type === 'saleArea') {
		return findNode(props.dictMap.saleArea, 'value', value) || {};
	} else if (type === 'productManageId') {
		return findNode(props.dictMap.productManageId, 'userId', value) || {};
	} else if (type === 'skuDepts') {
		return findNode(props.dictMap.skuDepts, 'value', value) || {};
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
	} else if (type === 'spu') {
		const valueSet = new Set(value);
		const labels = props.dictMap.spuInfo
			.filter((item: any) => valueSet.has(item.value))
			.map((item: any) => item.label);
		const label = labels.join(', ');
		return { label };
	}
	return value;
};
// 处理产品类型变化
const handleChangeProductType = async (e: string) => {
	// 产品等级 颜色 型号 销售地区 平台 当产品类型选择“成品”时，必填  当产品类型选择“配件”时，选填
	// 1是成品 2是配件
	if (e === '1') {
		baseInfoRule.value.grade[0].required = true;
		//baseInfoRule.value.color[0].required = true;
		// baseInfoRule.value.model[0].required = true;
		// baseInfoRule.value.productSkuCountryList[0].required = true;
		// baseInfoRule.value.platform[0].required = true;
	} else if (e === '2') {
		baseInfoRule.value.grade[0].required = false;
		//baseInfoRule.value.color[0].required = false;
		//baseInfoRule.value.model[0].required = false;
		//baseInfoRule.value.productSkuCountryList[0].required = false;
		//baseInfoRule.value.platform[0].required = false;
	}
	// 等待10毫秒，确保UI更新
	await new Promise((resolve) => setTimeout(resolve, 10));
	// 清空所有的校验
	dataFormRef.value.clearValidate();
	// 调用父组件的changeProductType方法
	props.changeProductType(e);
};
// 初始化处理产品类型变化
const initHandleProductType = async (e: string) => {
	// 产品等级 颜色 型号 销售地区 平台 当产品类型选择“成品”时，必填  当产品类型选择“配件”时，选填
	// 1是成品 2是配件
	if (e === '1') {
		baseInfoRule.value.grade[0].required = true;
		// baseInfoRule.value.color[0].required = true;
		// baseInfoRule.value.model[0].required = true;
		// baseInfoRule.value.productSkuCountryList[0].required = true;
		// baseInfoRule.value.platform[0].required = true;
	} else if (e === '2') {
		baseInfoRule.value.grade[0].required = false;
		// baseInfoRule.value.color[0].required = false;
		// baseInfoRule.value.model[0].required = false;
		// baseInfoRule.value.productSkuCountryList[0].required = false;
		// baseInfoRule.value.platform[0].required = false;
	}
	// 等待10毫秒，确保UI更新
	await new Promise((resolve) => setTimeout(resolve, 10));
	// 清空所有的校验
	dataFormRef.value.clearValidate();
};

defineExpose({
	dataFormRef,
	localFormData,
	initHandleProductType,
	setData,
});
</script>

<style lang="less" scoped></style>
