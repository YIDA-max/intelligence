<template>
	<div>
		<el-form v-if="props.visibleType !== 'view'" ref="dataFormRef" :rules="dataRules" :model="localFormData" label-width="100px" v-loading="loading">
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item :label="$t('辅料编码')" prop="materialCode">
						<el-input
							v-model="localFormData.materialCode"
							:placeholder="$t('保存后不可修改')"
							maxlength="25"
							show-word-limit
							:disabled="props.visibleType === 'edit'"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="16">
					<el-form-item :label="$t('辅料名称')" prop="materialName">
						<el-input v-model="localFormData.materialName" :placeholder="$t('请输入')" maxlength="100" show-word-limit />
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item :label="$t('辅料类型')" prop="materialType">
						<el-select v-model="localFormData.materialType" filterable placeholder="请选择">
							<el-option v-for="item in props.dictMap.materialType" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="16">
					<el-form-item :label="$t('产品负责人')" prop="productManageId">
						<el-select v-model="localFormData.productManageId" filterable placeholder="请选择">
							<el-option v-for="item in props.dictMap.productManageId" :key="item.userId" :label="item.name" :value="item.userId" />
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="8">
					<el-form-item :label="$t('辅料描述')" prop="materialDesc">
						<el-input v-model="localFormData.materialDesc" type="textarea" :placeholder="$t('请输入')" maxlength="100" show-word-limit />
					</el-form-item>
				</el-col>
			</el-row>
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
							:disabled="false"
							@error="() => {}"
							@remove="() => {}"
							@preview="() => {}"
							@exceed="() => {}"
							@success="() => {}"
						/>
					</el-form-item> </el-col
			></el-row>
		</el-form>
		<div class="p-[20px]" v-else>
			<el-row class="mb20">
				<el-col :span="24">
					<span class="mr10 font-semibold text-[#333333]">{{ localFormData.materialCode }}</span>
					<el-tag :type="localFormData.status ? 'success' : 'danger'" effect="light">
						{{ localFormData.status ? '启用' : '停用' }}
					</el-tag>
				</el-col>
			</el-row>
			<el-row class="mb20">
				<el-col :span="24">
					<span class="mr10">辅料名称：</span>
					<span class="font-semibold text-[#333333]">{{ localFormData.materialName }}</span>
				</el-col>
			</el-row>
			<el-row class="mb20">
				<el-col :span="8">
					<span class="mr10">辅料类型：</span>
					<span class="font-semibold text-[#333333]">{{ localFormData.materialType }}</span>
				</el-col>
				<el-col :span="8">
					<span class="mr10">产品负责人：</span>
					<span class="font-semibold text-[#333333]">{{ localFormData.productManageId }}</span>
				</el-col>
			</el-row>
			<el-row class="mb20">
				<el-col :span="24">
					<span class="mr10">辅料描述：</span>
					<span class="font-semibold text-[#333333]">{{ localFormData.materialDesc }}</span>
				</el-col>
			</el-row>
			<el-row class="mb20">
				<el-col :span="24">
					<span class="mr10">附件：</span>
					<span class="font-semibold text-[#333333]"
						><upload-file
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
					/></span>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps({
	visibleType: {
		type: String,
		default: '', // edit, view
	},
	dictMap: {
		type: Object,
		default: () => ({}),
	},
	currentRow: {
		type: Object,
		default: () => ({}),
	},
});

// 定义校验规则
const dataRules = ref({
	materialCode: [{ required: true, message: '请输入辅料编码', trigger: 'blur' }],
	materialName: [
		{
			required: true,
			message: '请输入辅料名称',
			trigger: 'blur',
		},
	],
	materialType: [{ required: true, message: '请选择辅料类型', trigger: 'blur' }],
	productManageId: [{ required: true, message: '请选择产品负责人', trigger: 'blur' }],
});

// 当前form的数据
const localFormData = ref({
	materialCode: '',
	materialName: '',
	materialType: '',
	productManageId: '',
	materialDesc: '',
	attachmentFileName: [],
});
//  当前form的ref
const dataFormRef = ref();
const loading = ref(false);

const setData = (data: any) => {
	localFormData.value = data;
};

defineExpose({
	dataFormRef,
	localFormData,
	setData,
});
</script>

<style lang="less" scoped></style>
