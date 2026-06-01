<template>
	<el-dialog
		v-model="visible"
		:close-on-click-modal="false"
		:title="props.title"
		width="50%"
		@close="handleClose"
		:append-to-body="true"
	>
		<template #header>
			<div class="flex border-b pb-3 border-gray-200">
				<div class="header-title font-semibold">{{ props.title }}</div>
				<span style="color: #666666"
					>（手动修改收件人信息后，系统将以手动修改的数据为准，不再执行【收件信息规则】）</span
				>
			</div>
		</template>

		<div class="dialog-container" style="padding: 0">
			<el-form
				:model="formData"
				:rules="rules"
				ref="formRef"
				label-width="120px"
			>
				<el-row class="mb18" :gutter="20">
					<el-col :span="12">
						<el-form-item label="收件人姓名：" prop="recipientName">
							<el-input
								v-model="formData.recipientName"
								maxlength="100"
								placeholder="请输入"
								show-word-limit
								type="text"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="邮箱：" prop="recipientEmail">
							<el-input
								v-model="formData.recipientEmail"
								maxlength="50"
								placeholder="请输入"
								show-word-limit
								type="text"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18" :gutter="20">
					<el-col :span="12">
						<el-form-item label="邮编：" prop="recipientPostcode">
							<el-input
								v-model="formData.recipientPostcode"
								maxlength="50"
								show-word-limit
								placeholder="请输入"
								type="text"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="收件人电话：" prop="recipientPhone">
							<el-input
								v-model="formData.recipientPhone"
								maxlength="50"
								show-word-limit
								placeholder="请输入"
								type="text"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18" :gutter="20">
					<el-col :span="12">
						<el-form-item label="收件人手机" prop="recipientMobile">
							<el-input
								v-model="formData.recipientMobile"
								maxlength="50"
								show-word-limit
								placeholder="请输入"
								type="text"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="国家/地区" prop="recipientCountry">
							<el-select
								v-model="formData.recipientCountry"
								filterable
								placeholder="请选择国家/地区"
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
				</el-row>
				<el-row class="mb18" :gutter="20">
					<el-col :span="12">
						<el-form-item label="省/州" prop="recipientState">
							<el-input
								v-model="formData.recipientState"
								maxlength="50"
								show-word-limit
								placeholder="请输入"
								type="text"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="城市" prop="recipientCity">
							<el-input
								v-model="formData.recipientCity"
								maxlength="50"
								show-word-limit
								placeholder="请输入"
								type="text"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18" :gutter="20">
					<el-col :span="12">
						<el-form-item label="区/县" prop="recipientDistrict">
							<el-input
								v-model="formData.recipientDistrict"
								maxlength="50"
								show-word-limit
								placeholder="请输入"
								type="text"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="街道" prop="recipientStreet">
							<el-input
								v-model="formData.recipientStreet"
								maxlength="50"
								show-word-limit
								placeholder="请输入"
								type="text"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18" :gutter="20">
					<el-col :span="12">
						<el-form-item label="门牌号" prop="recipientHouseNo">
							<el-input
								v-model="formData.recipientHouseNo"
								maxlength="30"
								show-word-limit
								placeholder="请输入"
								type="text"
							/>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row class="mb18" :gutter="20">
					<el-col :span="24">
						<el-form-item label="详细地址：" prop="recipientDetailAddress">
							<el-input
								v-model="formData.recipientDetailAddress"
								maxlength="500"
								show-word-limit
								placeholder="请输入"
								type="text"
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
import { ref, inject, Ref } from 'vue';
import { postupdateRecipientInfo } from '/@/api/fbm/selfOrder/index';
import { useMessage } from '/@/hooks/message';

const props = defineProps({
	title: { type: String, default: '修改收件人信息' },
});

// 加载
const loading = ref(false);

const visible = ref(false);

const current_status = ref('');

// form表单
const formRef = ref();

//父组件刷新数据方法
const getDataList = inject<() => void>('getDataList');

//接收字典
const dictMap = inject<Ref<any>>('dictMap');
//参数列表
// const { dictMap } = useMultipleDicts(
// 	[
// 		{
// 			key: 'countryList',
// 			fetchFn: sysCountryList,
// 		}, // 国家列表
// 	],
// 	{
// 		isAuto: true,
// 	}
// );

const formData = ref({
	id: '',
	recipientName: '',
	recipientEmail: '',
	recipientPostcode: '',
	recipientMobile: '',
	recipientPhone: '',
	recipientCountry: '',
	recipientState: '',
	recipientCity: '',
	recipientDistrict: '',
	recipientStreet: '',
	recipientHouseNo: '',
	recipientDetailAddress: '',
});

// 校验规则
const rules = {
	recipientName: [
		{ required: true, message: '收件人不能为空', trigger: 'blur' },
	],
	recipientCountry: [
		{ required: true, message: '国家不能为空', trigger: 'blur' },
	],
	recipientCity: [{ required: true, message: '城市不能为空', trigger: 'blur' }],
	recipientDetailAddress: [
		{ required: true, message: '地址不能为空', trigger: 'blur' },
	],
};

// 打开弹窗
const handleOpen = async (row: any) => {
	resetForm();
	if (!row.id) {
		formData.value = {
			id: '',
			recipientName: '',
			recipientEmail: '',
			recipientPostcode: '',
			recipientMobile: '',
			recipientPhone: '',
			recipientCountry: '',
			recipientState: '',
			recipientCity: '',
			recipientDistrict: '',
			recipientStreet: '',
			recipientHouseNo: '',
			recipientDetailAddress: '',
		};
	} else {
		formData.value = {
			id: row.id || '------',
			recipientName: row.buyerInfoVO.recipientName,
			recipientEmail: row.buyerInfoVO.recipientEmail,
			recipientPostcode: row.buyerInfoVO.recipientPostcode,
			recipientMobile: row.buyerInfoVO.recipientMobile,
			recipientPhone: row.buyerInfoVO.recipientPhone,
			recipientCountry: row.buyerInfoVO.recipientCountry,
			recipientState: row.buyerInfoVO.recipientState,
			recipientCity: row.buyerInfoVO.recipientCity,
			recipientDistrict: row.buyerInfoVO.recipientDistrict,
			recipientStreet: row.buyerInfoVO.recipientStreet,
			recipientHouseNo: row.buyerInfoVO.recipientHouseNo,
			recipientDetailAddress: row.buyerInfoVO.recipientDetailAddress,
		};
	}
	visible.value = true;

	current_status.value = row.cargoStatus;
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
			let api = postupdateRecipientInfo;
			try {
				const res = await api({
					id: props.title === '修改收件人信息' ? formData.value.id : '',
					recipientName: formData.value.recipientName,
					recipientEmail: formData.value.recipientEmail,
					recipientPostcode: formData.value.recipientPostcode,
					recipientMobile: formData.value.recipientMobile,
					recipientPhone: formData.value.recipientPhone,
					recipientCountry: formData.value.recipientCountry,
					recipientState: formData.value.recipientState,
					recipientCity: formData.value.recipientCity,
					recipientDistrict: formData.value.recipientDistrict,
					recipientStreet: formData.value.recipientStreet,
					recipientHouseNo: formData.value.recipientHouseNo,
					recipientDetailAddress: formData.value.recipientDetailAddress,
				});
				if (res.code === 0) {
					getDataList?.();
					useMessage().success('更新成功');
					// emit('save');
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
.el-form-item--label-right .el-form-item__label {
	white-space: nowrap;
}
.dialog-container {
	padding: 0 20px;
	overflow: hidden;
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
