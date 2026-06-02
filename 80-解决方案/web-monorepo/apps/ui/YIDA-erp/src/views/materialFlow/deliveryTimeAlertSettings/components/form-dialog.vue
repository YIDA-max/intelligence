<template>
	<el-dialog
		v-model="visible"
		:close-on-click-modal="false"
		:title="props.title"
		width="50%"
		@close="handleClose"
		draggable
	>
		<div class="dialog-container">
			<el-form
				:model="formData"
				ref="formRef"
				label-width="100px"
				:rules="rules"
			>
				<el-row class="mb18" :gutter="20">
					<el-col>
						<el-form-item label="平台渠道" prop="platformChannelCode">
							<template v-if="mode === 'edit'">
								<el-input v-model="formData.platformChannelCode" disabled />
							</template>
							<template v-else>
								<SelectInputApi
									componentType="dicts"
									v-model="formData.platformChannelCode"
									:settings="{
										text: '平台',
										getTreeDataParams: 'platform_channel',
										getIdsCode: 'id',
									}"
								/>
							</template>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18" :gutter="20">
					<el-col>
						<el-form-item label="国家" prop="countryCode">
							<template v-if="mode === 'edit'">
								<el-input v-model="formattedCountryCode" disabled />
							</template>
							<template v-else>
								<SelectInputApi
									componentType="country"
									v-model="formData.countryCode"
									:settings="{
										text: '国家',
									}"
								/>
							</template>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18" :gutter="20">
					<el-col>
						<el-form-item label="港口" prop="portCode">
							<template v-if="mode === 'edit'">
								<el-input v-model="formattedPortCode" disabled />
							</template>
							<template v-else>
								<el-select
									collapse-tags
									:max-collapse-tags="1"
									clearable
									filterable
									v-model="formData.portCode"
									placeholder="港口"
								>
									<el-option
										v-for="item in portByCountry"
										:key="item.id"
										:label="`${item.portCode}-${item.portName}`"
										:value="item.portCode"
									/>
								</el-select>
							</template>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18" :gutter="20">
					<el-col>
						<el-form-item label="货件有效期" prop="expirationDate">
							<el-input
								v-model.number="formData.expirationDate"
								placeholder="请输入"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18" :gutter="20">
					<el-col>
						<el-form-item label="预警天数" prop="warningDays">
							<el-input
								v-model.number="formData.warningDays"
								placeholder="请输入"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18" :gutter="20">
					<el-col>
						<el-form-item label="备注" prop="remark">
							<el-input v-model="formData.remark" type="textarea" />
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
import { ref, watch } from 'vue';
import {
	updateShipmentDelayAlert,
	addShipmentDelayAlert,
} from '/@/api/materialFlow/deliveryTimeAlertSettings/index';
import { useMessage } from '/@/hooks/message';

const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);
interface HeaderSettingForm {
	id: string;
	platformChannelCode: string; // 平台渠道
	countryCode: string; // 国家
	countryCodeText: string;
	portCode: string; // 港口
	portText: string;
	expirationDate: number | '';
	warningDays: number | '';
	remark: string;
}
const defaultForm: HeaderSettingForm = {
	id: '',
	platformChannelCode: '',
	countryCode: '',
	countryCodeText: '',
	portCode: '',
	portText: '',
	expirationDate: '',
	warningDays: '',
	remark: '',
};
const mode = ref<'add' | 'edit'>('add');

const props = defineProps({
	title: { type: String, default: '编辑头程单' },
	dictMap: { type: Object, default: () => ({}) }, // 字典数据
});
const emit = defineEmits(['closeDialog', 'save']);

// 加载
const loading = ref(false);

const visible = ref(false);
const formattedCountryCode = computed({
	get() {
		const countryCode = formData.value.countryCode || '';
		const countryCodeText = formData.value.countryCodeText || '';
		// 如果两个字段都为空，返回空字符串
		if (!countryCode && !countryCodeText) {
			return '';
		}

		// 如果一个字段有值，返回该字段的值
		if (countryCode && !countryCodeText) {
			return countryCode;
		}
		if (!countryCode && countryCodeText) {
			return countryCodeText;
		}

		// 如果两个字段都有值，拼接它们并返回
		return `${countryCode}-${countryCodeText}`;
	},
	set(value) {
		if (!value) {
			formData.value.countryCode = '';
			return;
		}

		const [countryCode] = value.split('-');
		formData.value.countryCode = countryCode || '';
	},
});

const formattedPortCode = computed({
	get() {
		const portCode = formData.value.portCode || '';
		const portText = formData.value.portText || '';
		// 如果两个字段都为空，返回空字符串
		if (!portCode && !portText) {
			return '';
		}

		// 如果一个字段有值，返回该字段的值
		if (portCode && !portText) {
			return portCode;
		}
		if (!portCode && portText) {
			return portText;
		}

		// 如果两个字段都有值，拼接它们并返回
		return `${portCode}-${portText}`;
	},
	set(value) {
		if (!value) {
			formData.value.portCode = '';
			return;
		}

		const [portCode] = value.split('-');
		formData.value.portCode = portCode || '';
	},
});

// form表单
const formRef = ref();
const formData = ref<HeaderSettingForm>({ ...defaultForm });

// 校验规则
const rules = ref({
	platformChannelCode: [
		{ required: true, message: '请选择平台渠道', trigger: 'change' },
	],
	countryCode: [{ required: true, message: '请选择国家', trigger: 'change' }],
	expirationDate: [
		{ required: true, message: '请输入货件有效期', trigger: 'blur' },
		{
			type: 'number',
			min: 1,
			message: '货件有效期必须大于 0',
			trigger: 'blur',
		},
	],
	warningDays: [
		{ required: true, message: '请输入预警天数', trigger: 'blur' },
		{
			type: 'number',
			min: 1,
			message: '预警天数必须大于 0',
			trigger: 'blur',
		},
		{
			// 不能大于货件有效期
			validator: (rule: any, value: any, callback: any) => {
				const expiration = formData.value.expirationDate;

				if (!expiration || !value) {
					callback();
					return;
				}

				if (value > expiration) {
					callback(new Error('预警天数不能大于货件有效期'));
				} else {
					callback();
				}
			},
			trigger: 'blur',
		},
	],
	remark: [{ required: false }],
});

watch(
	() => formData.value.expirationDate,
	() => {
		formRef.value?.validateField('warningDays');
	}
);
watch(
	() => formData.value.countryCode,
	(newVal, oldVal) => {
		if (newVal !== oldVal) {
			formData.value.portCode = '';
			formData.value.portText = '';
		}
	}
);
const portByCountry = computed(() => {
	return props.dictMap.basePortListByCondition.filter((item: any) => {
		return item.countryCode === formData.value.countryCode;
	});
});

// 打开弹窗
const handleOpen = (row: any = {}, openMode: 'add' | 'edit' = 'add') => {
	mode.value = openMode;
	resetForm();
	formData.value = {
		...defaultForm,
		...row,
	};
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
const onSubmit = async () => {
	try {
		await formRef.value.validateField([
			'platformChannelCode',
			'countryCode',
			'expirationDate',
			'warningDays',
		]);
	} catch (e) {
		// 这 4 个里只要有一个不通过就会进这里
		return;
	}

	loading.value = true;
	try {
		const api =
			mode.value === 'edit' ? updateShipmentDelayAlert : addShipmentDelayAlert;

		const res = await api({ ...formData.value });

		if (res.code === 0) {
			useMessage().success('保存成功');
			emit('save');
			handleClose();
		} else {
			// useMessage().error('保存失败sss');
		}
	} catch (error: any) {
		// useMessage().error(error.msg || '接口异常');
	} finally {
		loading.value = false;
	}
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
	height: 500px;
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
