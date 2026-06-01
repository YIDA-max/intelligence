<template>
	<el-dialog
		v-bind="$attrs"
		:close-on-click-modal="false"
		:title="props.title"
		width="70%"
		@close="handleClose"
		@open="handleOpen"
		draggable
	>
		<div class="dialog-container">
			<el-form
				:model="formData"
				:rules="rules"
				ref="formRef"
				label-width="70px"
			>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="名称" prop="name">
							<el-input
								v-model="formData.name"
								maxlength="255"
								show-word-limit
								placeholder="名称"
								:disabled="props.visibleType === 'edit'"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="简称" prop="shortName">
							<el-input
								v-model="formData.shortName"
								maxlength="255"
								show-word-limit
								placeholder="简称"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="联系人" prop="contact">
							<el-input
								v-model="formData.contact"
								maxlength="45"
								show-word-limit
								placeholder="联系人"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="邮箱" prop="email">
							<el-input
								v-model="formData.email"
								maxlength="45"
								show-word-limit
								placeholder="邮箱"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="电话" prop="phone">
							<el-input
								v-model="formData.phone"
								maxlength="11"
								show-word-limit
								placeholder="电话"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="开户行" prop="bank">
							<el-input
								v-model="formData.bank"
								maxlength="45"
								show-word-limit
								placeholder="开户行"
							/>
						</el-form-item>
					</el-col>
					<!-- <el-col :span="12">
						<el-form-item label="税号" prop="taxIdNumber">
							<el-input v-model="formData.taxIdNumber" maxlength="45" show-word-limit placeholder="税号" />
						</el-form-item>
					</el-col> -->
				</el-row>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="银行账号" prop="bankAccountNumber">
							<el-input
								v-model="formData.bankAccountNumber"
								maxlength="45"
								show-word-limit
								placeholder="银行账号"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item label="地址" prop="address">
							<el-input
								v-model="formData.address"
								maxlength="255"
								show-word-limit
								placeholder="地址"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item label="公章图片" prop="officialSealUrl">
							<ImageUpload v-model:imageUrl="formData.officialSealUrl">
							</ImageUpload>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item label="税号信息">
							<el-table
								:data="tableData"
								style="width: 100%"
								v-loading="loading"
								border
								ref="tableRef"
								row-key="id"
								native-scrollbar
							>
								<el-table-column label="国家" width="240">
									<template #default="{ row }">
										<el-select
											v-model="row.destCountryCode"
											filterable
											placeholder="请选择"
										>
											<el-option
												v-for="c in props.dictMap.countryList"
												:key="c.abbTwoCode"
												:label="`${c.abbTwoCode}-${c.chineseName}`"
												:value="c.abbTwoCode"
											/>
										</el-select>
									</template>
								</el-table-column>
								<el-table-column label="VAT税号" width="240">
									<template #default="{ row }">
										<el-input
											v-model="row.taxIdNumber"
											placeholder="请输入"
											style="width: 100%"
										/>
									</template>
								</el-table-column>
								<el-table-column label="EORI Number" width="240">
									<template #default="{ row }">
										<el-input
											v-model="row.eoriNumber"
											placeholder="请输入"
											style="width: 100%"
										/>
									</template>
								</el-table-column>
								<el-table-column label="本土税号" width="240">
									<template #default="{ row }">
										<el-input
											v-model="row.localTaxIdNumber"
											placeholder="请输入"
											style="width: 100%"
										/>
									</template>
								</el-table-column>
								<el-table-column label="操作" align="center">
									<template #default="{ $index }">
										<el-button
											type="danger"
											size="small"
											@click="removeRow($index)"
											>删除</el-button
										>
									</template>
								</el-table-column>
							</el-table>
						</el-form-item>
					</el-col>
				</el-row>
				<el-button :icon="Plus" @click="handleAdd" />
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
	postLegalEntitySave,
	postLegalEntityUpdate,
} from '/@/api/admin/legalEntity/index';
import { useMessage } from '/@/hooks/message';
import { addInit, editInit } from './utils';
import { Plus } from '@element-plus/icons-vue';
const props = defineProps({
	title: { type: String, default: '添加仓库' },
	currentRow: { type: Object, default: () => ({}) }, // 当前编辑的数据
	visibleType: { type: String, default: '' }, // 弹窗类型
	dictMap: { type: Object, default: () => ({}) }, // 字典数据
});
const ImageUpload = defineAsyncComponent(
	() => import('/@/components/Upload/Image.vue')
);
const emit = defineEmits(['closeDialog', 'save']);

// 加载
const loading = ref(false);

// form表单
const formRef = ref();
const formData = ref<{ [key: string]: string }>({
	name: '', //法人主体名称
	shortName: '', //法人主体简称
	contact: '', //联系人
	email: '', //邮箱
	phone: '', //联系电话
	address: '', //地址
	taxIdNumber: '', //税号
	bank: '', //开户行
	bankAccountNumber: '', //银行账号
	officialSealUrl: '', //公章url
});

// 校验规则
const rules = ref({
	name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
	email: [
		{
			validator: (
				rule: any,
				value: string,
				callback: (arg0?: Error | undefined) => void
			) => {
				if (value) {
					// 有值时验证邮箱格式
					const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
					if (!emailPattern.test(value)) {
						return callback(new Error('邮箱格式不正确'));
					}
				}
				callback();
			},
			trigger: 'blur',
		},
	],
	phone: [
		{
			validator: (
				rule: any,
				value: string,
				callback: (arg0?: Error | undefined) => void
			) => {
				if (value) {
					// 有值时验证手机号（简单规则）
					const phonePattern = /^1[3-9]\d{9}$/;
					if (!phonePattern.test(value)) {
						return callback(new Error('手机号格式不正确'));
					}
				}
				callback();
			},
			trigger: 'blur',
		},
	],
	// taxIdNumber: [
	// 	{
	// 		validator: (rule: any, value: string, callback: (arg0?: Error | undefined) => void) => {
	// 			if (value) {
	// 				// 假设税号至少 15 位
	// 				if (!/^\w{15,}$/.test(value)) {
	// 					return callback(new Error('税号格式不正确'));
	// 				}
	// 			}
	// 			callback();
	// 		},
	// 		trigger: 'blur',
	// 	},
	// ],
	bankAccountNumber: [
		// {
		// 	validator: (rule: any, value: string, callback: (arg0?: Error | undefined) => void) => {
		// 		if (value) {
		// 			// 简单判断全是数字且至少 8 位
		// 			if (!/^\d{8,}$/.test(value)) {
		// 				return callback(new Error('银行账号格式不正确'));
		// 			}
		// 		}
		// 		callback();
		// 	},
		// 	trigger: 'blur',
		// },
	],
});
// 打开弹窗
const handleOpen = async () => {
	if (props.visibleType === 'edit') {
		editInit(formData, props.currentRow);
		tableData.value = props.currentRow.legalTaxInfoList || [];
	} else if (props.visibleType === 'add') {
		// 重置表单
		addInit(formData, formRef);
		tableData.value = [];
	}
};

interface entityRow {
	destCountryCode: string;
	localTaxIdNumber: string;
	eoriNumber: string;
	taxIdNumber: string;
}

const tableData = ref<entityRow[]>([]);

// 添加地址行
const handleAdd = () => {
	tableData.value.push({
		destCountryCode: '',
		localTaxIdNumber: '',
		eoriNumber: '',
		taxIdNumber: '',
	});
};

// 删除数据
const removeRow = (i: number) => {
	tableData.value.splice(i, 1);
};

// 关闭弹窗
const handleClose = () => {
	emit('closeDialog');
};

// 提交
const onSubmit = () => {
	formRef.value.validate(async (valid: boolean) => {
		if (valid) {
			let api =
				props.visibleType === 'edit'
					? postLegalEntityUpdate
					: postLegalEntitySave;
			try {
				const res = await api({
					name: formData.value.name, // 法人主体名称
					shortName: formData.value.shortName, // 法人主体简称
					contact: formData.value.contact, // 联系人
					email: formData.value.email, // 邮箱
					phone: formData.value.phone, // 联系电话
					address: formData.value.address, // 地址
					taxIdNumber: formData.value.taxIdNumber, // 税号
					bank: formData.value.bank, // 开户行
					bankAccountNumber: formData.value.bankAccountNumber, // 银行账号
					officialSealUrl: formData.value.officialSealUrl
						? formData.value.officialSealUrl?.split('?fileName=')[1]
						: '', // 公章url,需要处理
					id: props.visibleType === 'edit' ? props.currentRow.id : '', // 编辑时传入ID
					legalTaxCountryInfoList: tableData.value,
				});
				if (res.code === 0) {
					useMessage().success(
						props.visibleType === 'edit' ? '编辑成功' : '添加成功'
					);
					handleClose();
				}
			} catch (error: any) {
				useMessage().error(error.msg);
			}
		}
	});
};

defineExpose({
	handleOpen,
});
</script>

<style lang="scss" scoped>
.dialog-container {
	padding: 0 20px;
	height: 60vh;
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
