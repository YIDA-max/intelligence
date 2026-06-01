<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-09 15:18:34
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-09-11 09:59:22
 * @FilePath: \qianyi-ui\src\views\product\product-info\spu\components\form-dialog\components\base-info.vue
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
			v-if="props.visibleType !== 'view' && props.visibleType !== 'skuView'"
		>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item :label="$t('SPU')" prop="spuCode">
						<el-input
							v-model="localFormData.spuCode"
							:placeholder="$t('保存后不可修改')"
							maxlength="25"
							show-word-limit
							:disabled="props.visibleType === 'edit' || !auth('spu_edit_info')"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="16">
					<el-form-item :label="$t('父产品名称')" prop="spuName">
						<el-input
							v-model="localFormData.spuName"
							:placeholder="$t('请输入')"
							maxlength="100"
							show-word-limit
							:disabled="!auth('spu_edit_info')"
						/>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item :label="$t('类目')">
						<el-tree-select
							:show-all-levels="false"
							v-model="localFormData.categoryCode"
							:disabled="!auth('spu_edit_info')"
							:check-strictly="true"
							filterable
							clearable
							placeholder="请选择"
							:data="props.dictMap.categoryCode"
							:props="{ value: 'id', label: 'name', children: 'children', emitPath: false, checkStrictly: true }"
							:style="{ width: '100%' }"
						>
						</el-tree-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item :label="$t('品牌')">
						<el-select v-model="localFormData.brandCode" :disabled="!auth('spu_edit_info')" filterable clearable placeholder="请选择">
							<el-option
								v-for="item in props.dictMap.brandCode"
								:key="item.value"
								:label="`${item.brandCode}-${item.brandName}`"
								:value="item.brandCode"
							/>
						</el-select>
					</el-form-item>
				</el-col>
				<!-- <el-col :span="8">
					<el-form-item :label="$t('产品类型')" prop="productType">
						<el-select v-model="localFormData.productType" :disabled="!auth('spu_edit_info')" filterable placeholder="请选择">
							<el-option v-for="item in props.dictMap.productType" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-form-item>
				</el-col> -->
				<el-col :span="8">
					<el-form-item :label="$t('产品负责人')" prop="productManageId">
						<el-select v-model="localFormData.productManageId" :disabled="!auth('spu_edit_info')" filterable placeholder="请选择">
							<el-option v-for="item in props.dictMap.productManageId" :key="item.userId" :label="item.name" :value="item.userId" />
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<!-- <el-row class="mb18"> </el-row> -->
			<el-row class="mb18">
				<el-col :span="24"
					><el-form-item :label="$t('产品描述')">
						<el-input
							v-model="localFormData.productDesc"
							:disabled="!auth('spu_edit_info')"
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
							:fileType="['zip', 'pdf', 'xlsx', 'xls', 'doc', 'docx', 'jpg', 'png']"
							v-model="localFormData.attachmentFileName"
							:isShowTip="true"
							:uploadFileUrl="'/admin/sys-file/upload'"
							type="simple"
							:data="{}"
							:dir="''"
							:autoUpload="true"
							:disabled="!auth('spu_edit_info')"
							@error="() => {}"
							@remove="() => {}"
							@preview="() => {}"
							@exceed="() => {}"
							@success="() => {}"
						/> </el-form-item></el-col
			></el-row>
		</el-form>
		<el-form ref="dataFormRef" :model="localFormData" label-width="100px" v-else>
			<el-text class="mx-1 ml-10 mr-5" :style="{ fontWeight: 'bold', fontSize: '20px' }">{{ localFormData.spuCode }}</el-text>
			<el-tag :type="props.currentRow.status === 1 ? 'success' : 'danger'">{{ props.currentRow.status === 1 ? '启用' : '禁用' }}</el-tag>
			<el-row class="mb18">
				<el-col :span="16">
					<el-form-item :label="$t('父产品名称')" prop="spuName">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">{{ localFormData.spuName }}</el-text>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item :label="$t('类目')">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">{{ showText('categoryCode', localFormData.categoryCode).name }}</el-text>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item :label="$t('品牌')">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">{{ showText('brandCode', localFormData.brandCode).brandName }}</el-text>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<!-- <el-form-item :label="$t('产品类型')" prop="productType">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">{{ showText('productType', localFormData.productType).label }}</el-text>
					</el-form-item> -->
					<el-form-item :label="$t('产品负责人')" prop="productManageId">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">{{ showText('productManageId', localFormData.productManageId).name }}</el-text>
					</el-form-item>
				</el-col>
			</el-row>
			<!-- <el-row class="mb18">
				<el-col :span="8">
					<el-form-item :label="$t('产品负责人')" prop="productManageId">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">{{ showText('productManageId', localFormData.productManageId).name }}</el-text>
					</el-form-item>
				</el-col>
			</el-row> -->
			<el-row class="mb18">
				<el-col :span="24"
					><el-form-item :label="$t('产品描述')">
						<el-text class="mx-1" :style="{ fontWeight: 'bold' }">{{ localFormData.productDesc }}</el-text>
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
							:fileType="['zip', 'pdf', 'xlsx', 'xls', 'doc', 'docx', 'jpg', 'png']"
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
import { ref, defineExpose } from 'vue';
import { baseInfoRule } from './rules/base-info';
import { findNode } from '/@/utils/arrayTree';
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
const dataFormRef = ref();
// 当前form的数据
const localFormData = ref({
	spuCode: '',
	spuName: '',
	categoryCode: '',
	brandCode: '',
	productType: '',
	productManageId: '',
	productDesc: '',
	attachmentFileName: [],
});
const setData = (data: any) => {
	localFormData.value = data;
};
// 回显函数
const showText = (type: string, value: any[]) => {
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
		const labels = props.dictMap.specialAttribute.filter((item: any) => valueSet.has(item.value)).map((item: any) => item.label);
		const label = labels.join(', ');
		return { label };
	} else if (type === 'platform') {
		const valueSet = new Set(value);
		const labels = props.dictMap.platform.filter((item: any) => valueSet.has(item.value)).map((item: any) => item.label);
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
