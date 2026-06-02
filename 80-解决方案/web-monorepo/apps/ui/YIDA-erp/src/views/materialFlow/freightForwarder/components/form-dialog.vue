<template>
	<el-dialog
		v-model="visible"
		:close-on-click-modal="false"
		:title="props.title"
		width="80%"
		@close="handleClose"
		draggable
	>
		<div class="dialog-container">
			<el-form
				:model="formData"
				:rules="rules"
				ref="formRef"
				label-width="100px"
			>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="货代名称：" prop="forwarderName">
							<el-input
								v-model="formData.forwarderName"
								maxlength="20"
								show-word-limit
								placeholder="请输入货代名称"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="货代编号：" prop="forwarderCode">
							<el-input
								v-model="formData.forwarderCode"
								maxlength="500"
								show-word-limit
								placeholder="请输入货代编号"
								:disabled="props.title === '编辑货代'"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="货代类型：" prop="forwarderType">
							<TreeSelectInputApi
								componentType="dicts"
								text="货代类型"
								code="forwarderType"
								v-model:queryForm="formData"
								:settings="{
									text: '货代类型',
									width: '100%',
									getTreeDataParams: 'forwarder_type',
								}"
							/>
							<!-- <el-select
								v-model="formData.forwarderType"
								placeholder="请选择货代类型"
								collapse-tags
								:max-collapse-tags="1"
								clearable
								filterable
								multiple
							>
								<el-option
									v-for="item in props.dictMap.forwarderTypesOptions"
									:key="item.id"
									:label="item.label"
									:value="item.value"
								/>
							</el-select> -->
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="状态：" prop="status">
							<el-select v-model="formData.status" placeholder="状态" clearable>
								<el-option
									v-for="item in [
										{ label: '启用', value: 1 },
										{ label: '禁用', value: 0 },
									]"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="我司对接人：" prop="selfPersonId">
							<SelectInputApi
								componentType="userList"
								v-model="formData.selfPersonId"
								placeholder="请选择"
								style="width: 100%"
								:settings="{
									text: '请选择',
									getTreeDataParams: { lockFlag: 0 },
								}"
							/>
							<!-- <el-select
								v-model="formData.selfPersonId"
								filterable
								placeholder="请选择我司对接人"
								clearable
							>
								<el-option
									v-for="item in props.dictMap.productManageId"
									:key="item.userId"
									:label="item.name"
									:value="item.userId"
								/>
							</el-select> -->
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="联系人：" prop="contactPerson">
							<el-input
								v-model="formData.contactPerson"
								maxlength="50"
								show-word-limit
								placeholder="请输入联系人"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="联系电话：" prop="contactInfo">
							<el-input
								v-model="formData.contactInfo"
								maxlength="100"
								show-word-limit
								placeholder="请输入联系电话"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item label="备注：" prop="remark">
							<el-input
								v-model="formData.remark"
								maxlength="500"
								show-word-limit
								type="textarea"
								placeholder="备注"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item label="附件：" prop="attachmentUrls">
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
								v-model="formData.attachmentUrls"
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
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">{{
					$t('common.cancelButtonText')
				}}</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">{{
					$t('保存')
				}}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
	saveFreightForwarder,
	updateFreightForwarder,
} from '/@/api/materialFlow/freightForwarder/index';
import { useMessage } from '/@/hooks/message';
import { rule } from '/@/utils/validate';

const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);

const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);

const props = defineProps({
	title: { type: String, default: '添加货代' },
	dictMap: { type: Object, default: () => ({}) }, // 字典数据
});
const emit = defineEmits(['closeDialog', 'save']);

// 加载
const loading = ref(false);

const visible = ref(false);

// form表单
const formRef = ref();
const formData = ref({
	id: '',
	forwarderName: '',
	forwarderCode: '',
	forwarderType: '',
	status: 1,
	selfPersonId: '',
	contactPerson: '',
	contactInfo: '',
	attachmentUrls: [],
	remark: '',
});

// 校验规则
const rules = {
	forwarderCode: [
		{ required: true, message: '货代编号不能为空', trigger: 'blur' },
		{ validator: rule.validatorCode, trigger: 'blur' },
	],
	forwarderName: [
		{ required: true, message: '货代名称不能为空', trigger: 'blur' },
	],
	forwarderType: [
		{ required: true, message: '货代类型不能为空', trigger: 'change' },
	],
	status: [{ required: true, message: '状态不能为空', trigger: 'change' }],
};

// 打开弹窗
const handleOpen = async (row: any) => {
	resetForm();
	if (!row.id) {
		formData.value = {
			id: '',
			forwarderName: '',
			forwarderCode: '',
			forwarderType: '',
			status: 1,
			selfPersonId: '',
			contactPerson: '',
			contactInfo: '',
			attachmentUrls: [],
			remark: '',
		};
	} else {
		formData.value = {
			id: row.id,
			forwarderName: row.forwarderName,
			forwarderCode: row.forwarderCode,
			forwarderType: row.forwarderType,
			status: row.status,
			selfPersonId: row.selfPersonId,
			contactPerson: row.contactPerson,
			contactInfo: row.contactInfo,
			attachmentUrls: row.attachmentUrls,
			remark: row.remark,
		};
	}
	visible.value = true;
};

// 关闭弹窗
const handleClose = () => {
	visible.value = false;
};

// 重置表单
function resetForm() {
	formRef.value?.resetFields();
}
// 提交
const onSubmit = () => {
	formRef.value.validate(async (valid: boolean) => {
		if (valid) {
			let api =
				props.title === '编辑货代'
					? updateFreightForwarder
					: saveFreightForwarder;
			try {
				const res = await api({
					id: props.title === '编辑货代' ? formData.value.id : '',
					forwarderName: formData.value.forwarderName,
					forwarderCode: formData.value.forwarderCode,
					forwarderType: formData.value.forwarderType,
					status: formData.value.status,
					selfPersonId: formData.value.selfPersonId,
					contactPerson: formData.value.contactPerson,
					contactInfo: formData.value.contactInfo,
					attachmentFileName: formData.value.attachmentUrls?.map(
						(item: string) =>
							typeof item === 'string' && item.includes('fileName=')
								? item.split('fileName=')[1]
								: item
					),
					remark: formData.value.remark,
				});
				if (res.code === 0) {
					useMessage().success('添加成功');
					emit('save');
				}
			} catch (error: any) {
				useMessage().error(error.msg);
			}
			handleClose();
		}
	});
};

defineExpose({
	handleOpen,
	handleClose,
});
</script>

<style lang="scss" scoped>
.dialog-container {
	padding: 0 20px;
	overflow: auto;
}
.section-title {
	font-weight: bold;
	margin: 10px 0 10px 0;
	display: flex;
	align-items: center;
}
.section-bar {
	display: inline-block;
	width: 4px;
	height: 18px;
	background: #2e5cf6;
	border-radius: 2px;
	margin-right: 8px;
}
.mb18 {
	margin-bottom: 18px;
}
</style>
