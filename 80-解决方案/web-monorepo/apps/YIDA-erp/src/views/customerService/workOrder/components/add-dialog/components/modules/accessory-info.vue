<script setup lang="ts">
import { ref, watch } from 'vue';
import type { FormInstance } from 'element-plus';
import { Plus, Close } from '@element-plus/icons-vue';

/**
 * 接收父组件传递的属性
 * @property {string} dialogType - 弹窗类型：add | edit | copy | detail
 * @property {Array} data - 初始化数据
 */
const props = defineProps({
	dialogType: {
		type: String,
		default: 'add',
	},
	data: {
		type: Array,
		default: () => [],
	},
});

const formRef = ref<FormInstance>();
const formData = ref({
	list: [
		{
			time: '',
			orderNo: '',
			reason: '',
			detail: '',
			number: null,
			file: [],
			trackingNo: '',
			supplier: '',
			remark: '',
		},
	] as any[],
});

const itemRules = {
	orderNo: [{ required: true, message: '请输入补发配件单号', trigger: 'blur' }],
	// time: [{ required: true, message: '请选择补发配件时间', trigger: 'change' }],
	// reason: [{ required: true, message: '请输入补发配件原因', trigger: 'blur' }],
	// detail: [{ required: true, message: '请输入补发配件明细', trigger: 'blur' }],
	// number: [{ required: true, message: '请输入数量', trigger: 'blur' }],
};

/**
 * 设置表单数据
 * @param {Array} data - 包含补发配件信息的数组
 */
const setData = (data: any) => {
	// data is already mapped
	formData.value.list = data;
};

// 监听 props.data 变化，自动设置数据
watch(
	() => props.data,
	(val) => {
		if (val && val.length > 0) {
			setData(val);
		}
	},
	{ immediate: true, deep: true }
);

const uploadRefs = ref<any[]>([]);

/**
 * 获取表单数据并进行验证
 * @returns {Promise<Array>} 返回验证通过后的补发配件数据数组
 */
const getData = async () => {
	if (!formRef.value) return Promise.reject('Form not initialized');
	await formRef.value.validate();
	return formData.value.list.map((item, index) => {
		const uploadRef = uploadRefs.value[index];
		let fileList: any[] = [];
		if (uploadRef && uploadRef.getFileList) {
			fileList = uploadRef.getFileList();
		} else {
			fileList = item.file || [];
		}
		return {
			reshipPartDate: item.time,
			reshipPartNo: item.orderNo,
			reshipPartReason: item.reason,
			partProductName: item.detail,
			partQuantity: Number(item.number),
			partAttachments: fileList.map((file: any) => ({
				businessType: 2, // 补发配件附件
				fileName: file.name,
				ossFileName: file.code || file.url || '',
			})),
			partDepartTrackingNo: item.trackingNo,
			supplier: item.supplier,
			reshipRemark: item.remark,
		};
	});
};

/**
 * 添加一条补发配件记录
 */
const add = () => {
	formData.value.list.push({
		time: '',
		orderNo: '',
		reason: '',
		detail: '',
		number: null,
		file: [],
		trackingNo: '',
		supplier: '',
		remark: '',
	});
};

/**
 * 删除一条补发配件记录
 * @param {number} index - 要删除的记录索引
 */
const remove = (index: number) => {
	formData.value.list.splice(index, 1);
};

defineExpose({ setData, getData });
</script>

<template>
	<div class="mb-4">
		<div class="border-l-4 border-blue-500 pl-2 font-bold mb-4 text-base">
			补发配件记录
		</div>
		<el-form ref="formRef" :model="formData" label-width="120px">
			<div
				v-for="(item, index) in formData.list"
				:key="index"
				class="flex items-start mb-4 border-b pb-4 border-gray-100"
			>
				<div class="flex-1">
					<!-- Line 1 -->
					<el-row class="mb15" :gutter="8">
						<el-col :span="8">
							<el-form-item
								label="补发配件单号"
								:prop="`list.${index}.orderNo`"
								:rules="itemRules.orderNo"
							>
								<el-input
									v-model="item.orderNo"
									maxlength="50"
									show-word-limit
									placeholder="请输入"
									:disabled="props.dialogType === 'detail'"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="补发配件时间" :prop="`list.${index}.time`">
								<el-date-picker
									v-model="item.time"
									type="datetime"
									value-format="YYYY-MM-DD HH:mm:ss"
									placeholder="请选择日期"
									class="w-full"
									:disabled="props.dialogType === 'detail'"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item
								label="配件发出跟踪号"
								:prop="`list.${index}.trackingNo`"
							>
								<el-input
									v-model="item.trackingNo"
									maxlength="50"
									show-word-limit
									placeholder="请输入"
									:disabled="props.dialogType === 'detail'"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<!-- Line 2 -->
					<el-row :gutter="8" class="mb15">
						<el-col :span="8">
							<el-form-item label="供应商" :prop="`list.${index}.supplier`">
								<el-input
									v-model="item.supplier"
									maxlength="50"
									show-word-limit
									placeholder="请输入"
									:disabled="props.dialogType === 'detail'"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="16">
							<el-form-item label="补发配件明细">
								<div class="flex items-center w-full space-x-1">
									<el-form-item
										:prop="`list.${index}.detail`"
										class="flex-1 !mb-0"
									>
										<el-input
											v-model="item.detail"
											placeholder="明细"
											:disabled="props.dialogType === 'detail'"
										/>
									</el-form-item>
									<span>x</span>
									<el-form-item
										:prop="`list.${index}.number`"
										class="!mb-0 w-[100px]"
									>
										<el-input-number
											v-model="item.number"
											placeholder="数量"
											:min="0"
											:disabled="props.dialogType === 'detail'"
											controls-position="right"
											class="!w-full"
										/>
									</el-form-item>
								</div>
							</el-form-item>
						</el-col>
					</el-row>
					<!-- Line 3 -->
					<el-row class="mb15" :gutter="8">
						<el-col :span="24">
							<el-form-item label="补发配件原因" :prop="`list.${index}.reason`">
								<el-input
									v-model="item.reason"
									maxlength="500"
									show-word-limit
									placeholder="请输入"
									:disabled="props.dialogType === 'detail'"
									type="textarea"
									:rows="2"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<!-- Line 4 -->
					<el-row class="mb15" :gutter="8">
						<el-col :span="24">
							<el-form-item label="补发备注" :prop="`list.${index}.remark`">
								<el-input
									v-model="item.remark"
									placeholder="请输入"
									maxlength="500"
									show-word-limit
									:disabled="props.dialogType === 'detail'"
									type="textarea"
									:rows="2"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<!-- Line 5 -->
					<el-row class="mb15" :gutter="8">
						<el-col :span="6">
							<el-form-item label="图片上传(配件)" :prop="`list.${index}.file`">
								<upload-file
									:ref="(el: any) => (uploadRefs[index] = el)"
									:limit="1"
									:fileSize="20"
									@change="() => {}"
									:fileType="['pdf', 'jpeg', 'jpg', 'png']"
									v-model="item.file"
									:isShowTip="false"
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
				</div>
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
		</el-form>
	</div>
</template>
