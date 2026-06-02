<script setup lang="ts">
import { ref } from 'vue';
import type { FormInstance } from 'element-plus';
import { Close, Plus } from '@element-plus/icons-vue';
// import UploadFile from '/@/views/materialFlow/orderContainer/components/uploadFile.vue';
import UploadFile from './uploadFile.vue';

/**
 * 接收父组件传递的属性
 * @property {string} dialogType - 弹窗类型：add | edit | copy | detail
 */
const props = defineProps({
	dialogType: {
		type: String,
		default: 'add',
	},
});

const formRef = ref<FormInstance>();
const formData = ref({
	fileImg: [],
	fileVedio: [],
	remarkList: [{ remark: '' }],
});

const uploadImgRef = ref();
const uploadVedioRef = ref();

/**
 * 添加一条备注
 */
const add = () => {
	formData.value.remarkList.push({ remark: '' });
};

/**
 * 删除一条备注
 * @param {number} index - 要删除的备注索引
 */
const remove = (index: number) => {
	formData.value.remarkList.splice(index, 1);
};

/**
 * 设置表单数据
 * @param {object} data - 包含附件和备注信息的数据对象
 */
const setData = (data: any) => {
	formData.value.remarkList = data.remarkList;
	formData.value.fileImg = data.fileImg;
	formData.value.fileVedio = data.fileVedio;
};

/**
 * 获取表单数据并进行验证
 * @returns {Promise<object>} 返回验证通过后的附件和备注数据对象
 */
const getData = async () => {
	if (!formRef.value) return Promise.reject('Form not initialized');
	await formRef.value.validate();
	const imgList = uploadImgRef.value.getFileList();
	const vedioList = uploadVedioRef.value.getFileList();
	const baseAttachments = [...imgList, ...vedioList].map((file: any) => ({
		businessType: 1,
		fileName: file.name,
		ossFileName: file.code || '',
	}));
	const remark = formData.value.remarkList.map((item) => item.remark).join(';');

	return {
		baseAttachments,
		remark,
	};
};

defineExpose({ setData, getData });
</script>
<template>
	<div class="mb-4">
		<div class="border-l-4 border-blue-500 pl-2 font-bold mb-4 text-base">
			附件/备注
		</div>
		<el-form ref="formRef" :model="formData" label-width="100px">
			<el-row :gutter="20">
				<el-col :span="5">
					<el-form-item label="图片上传" prop="file" label-position="top">
						<UploadFile
							:limit="9"
							ref="uploadImgRef"
							:fileSize="10"
							@change="() => {}"
							:fileType="['jpeg', 'jpg', 'png', 'webp']"
							v-model="formData.fileImg"
							:isShowTip="true"
							:uploadFileUrl="'/admin/sys-file/upload'"
							type="drag"
							:data="{}"
							:dir="''"
							:autoUpload="true"
							@error="() => {}"
							@remove="() => {}"
							@preview="() => {}"
							@exceed="() => {}"
							@success="() => {}"
							:disabled="props.dialogType === 'detail'"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="5">
					<el-form-item label="视频上传" prop="fileVedio" label-position="top">
						<UploadFile
							:limit="5"
							ref="uploadVedioRef"
							:fileSize="50"
							@change="() => {}"
							:fileType="['mp4', 'avi', 'mov']"
							v-model="formData.fileVedio"
							:isShowTip="true"
							:uploadFileUrl="'/admin/sys-file/upload'"
							type="drag"
							:data="{}"
							:dir="''"
							:autoUpload="true"
							@error="() => {}"
							@remove="() => {}"
							@preview="() => {}"
							@exceed="() => {}"
							@success="() => {}"
							:disabled="props.dialogType === 'detail'"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<div
						v-for="(item, index) in formData.remarkList"
						:key="index"
						class="flex items-start"
					>
						<el-form-item label="内部备注" prop="remark">
							<el-input
								v-model="item.remark"
								placeholder="请输入"
								maxlength="500"
								show-word-limit
								:disabled="props.dialogType === 'detail'"
							/>
						</el-form-item>
						<div class="ml-2 mt-1 w-[80px]">
							<el-icon
								v-if="index === 0 && props.dialogType !== 'detail'"
								@click="add"
								><Plus
							/></el-icon>
							<el-icon
								v-else-if="index !== 0 && props.dialogType !== 'detail'"
								@click="remove(index)"
								><Close
							/></el-icon>
						</div>
					</div>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>
