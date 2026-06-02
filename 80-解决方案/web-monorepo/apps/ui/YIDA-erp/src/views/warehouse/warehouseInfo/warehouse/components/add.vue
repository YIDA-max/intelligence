<template>
	<el-dialog
		v-bind="$attrs"
		:close-on-click-modal="false"
		:title="props.title"
		width="800px"
		@close="handleClose"
		@open="handleOpen"
		draggable
	>
		<div class="dialog-container">
			<el-form
				:model="formData"
				:rules="rules"
				ref="formRef"
				label-width="100px"
			>
				<div class="section-title">
					<span class="section-bar"></span>基本信息
				</div>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="仓库代码" prop="warehouseCode">
							<el-input
								v-model="formData.warehouseCode"
								maxlength="30"
								show-word-limit
								placeholder="请输入仓库代码"
								:disabled="!!props.editData?.id"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="仓库名称" prop="warehouseName">
							<el-input
								v-model="formData.warehouseName"
								maxlength="30"
								show-word-limit
								placeholder="请输入仓库名称"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="仓库类型" prop="wareHouseType">
							<el-select
								v-model="formData.wareHouseType"
								placeholder="请选择仓库类型"
								:disabled="!!props.editData?.id"
							>
								<el-option
									v-for="item in [{ value: '0', label: '国内自营仓' }]"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="法人主体" prop="legalPersonId">
							<SelectInputApi
								v-model="formData.legalPersonId"
								componentType="legalEntity"
								placeholder="法人主体"
								:disabled="!!props.editData?.id"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<div class="section-title">
					<span class="section-bar"></span>仓库信息
				</div>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="公司名称" prop="companyName">
							<el-input
								v-model="formData.companyName"
								maxlength="30"
								show-word-limit
								placeholder="请输入公司名称"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="联系人" prop="contact">
							<el-input
								v-model="formData.contact"
								maxlength="20"
								show-word-limit
								placeholder="请输入联系人"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="联系电话" prop="phone">
							<el-input
								v-model="formData.phone"
								maxlength="11"
								show-word-limit
								placeholder="请输入联系电话"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="国家" prop="countryCode">
							<el-select
								v-model="formData.countryCode"
								placeholder="请选择国家"
								@change="changeCountry"
								filterable
							>
								<el-option
									v-for="item in props.dictMap.countryList"
									:key="item.code"
									:label="item.name"
									:value="item.code"
								/>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="省/州" prop="provinceCode">
							<el-select
								v-model="formData.provinceCode"
								placeholder="请选择省/州"
								@change="changeProvince"
								filterable
							>
								<el-option
									v-for="item in provinceList"
									:key="item.code"
									:label="item.name"
									:value="item.code"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="市/府" prop="cityCode">
							<el-select
								v-model="formData.cityCode"
								placeholder="请选择市/府"
								@change="changeCity"
								filterable
							>
								<el-option
									v-for="item in cityList"
									:key="item.code"
									:label="item.name"
									:value="item.code"
								/>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="区/县" prop="districtCode">
							<el-select
								v-model="formData.districtCode"
								placeholder="请选择区/县"
								filterable
							>
								<el-option
									v-for="item in districtList"
									:key="item.code"
									:label="item.name"
									:value="item.code"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="邮编" prop="postCode">
							<el-input
								v-model="formData.postCode"
								maxlength="20"
								show-word-limit
								placeholder="请输入邮编"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item label="地址1" prop="address1">
							<el-input
								v-model="formData.address1"
								maxlength="200"
								show-word-limit
								type="textarea"
								placeholder="请输入地址1"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item label="地址2" prop="address2">
							<el-input
								v-model="formData.address2"
								maxlength="200"
								show-word-limit
								type="textarea"
								placeholder="请输入地址2"
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
import { ref, defineAsyncComponent } from 'vue';
import {
	addWarehouse,
	updateWarehouse,
	getCountryList,
} from '/@/api/warehouse/warehouse/index';
import { useMessage } from '/@/hooks/message';
import { rule } from '/@/utils/validate';

const props = defineProps({
	title: { type: String, default: '添加仓库' },
	editData: { type: Object, default: () => ({}) },
	dictMap: { type: Object, default: () => ({}) }, // 字典数据
});
const emit = defineEmits(['closeDialog', 'save']);

const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);

// 加载
const loading = ref(false);

// form表单
const formRef = ref();
const formData = ref<{ [key: string]: string }>({
	warehouseCode: '', // 仓库代码
	warehouseName: '', // 仓库名称
	wareHouseType: '0', // 仓库类型
	companyName: '', // 公司名称
	contact: '', // 联系人
	phone: '', // 联系电话
	countryCode: '', // 国家
	provinceCode: '', // 省/州
	cityCode: '', // 市/府
	districtCode: '', // 区/县
	postCode: '', // 邮编
	address1: '', // 地址1
	address2: '', // 地址2
});

// 国家 省市区数据接口
interface ArrayType {
	code: string;
	name: string;
}
// option-省
const provinceList = ref<ArrayType[]>([]);
// option-市
const cityList = ref<ArrayType[]>([]);
// option-县
const districtList = ref<ArrayType[]>([]);

// 校验规则
const rules = {
	warehouseCode: [
		{ required: true, message: '仓库代码不能为空', trigger: 'blur' },
		{ validator: rule.validatorCode, trigger: 'blur' },
	],
	warehouseName: [
		{ required: true, message: '仓库名称不能为空', trigger: 'blur' },
		{ validator: rule.validateLength, trigger: 'blur' },
	],
	legalPersonId: [
		{ required: true, message: '法人主体不能为空', trigger: 'change' },
	],
	wareHouseType: [
		{ required: true, message: '仓库类型不能为空', trigger: 'change' },
	],
	countryCode: [{ required: true, message: '国家不能为空', trigger: 'change' }],
	provinceCode: [
		{ required: false, message: '省/州不能为空', trigger: 'change' },
	],
};

// 打开弹窗
const handleOpen = async () => {
	if (props.editData && Object.keys(props.editData).length) {
		Object.assign(formData.value, props.editData);
	} else {
		resetForm();
	}
	formData.value.wareHouseType = '0';
	if (!formData.value.countryCode) {
		formData.value.countryCode = 'CN'; // 默认国家为中国
	}
	// 加载省份下拉选项
	if (formData.value.countryCode) {
		const provinceData = await getCountryList({
			parentCode: formData.value.countryCode,
		});
		provinceList.value = provinceData.data;

		// 加载城市下拉选项
		if (formData.value.provinceCode) {
			const cityData = await getCountryList({
				parentCode: formData.value.provinceCode,
			});
			cityList.value = cityData.data;

			// 加载区县下拉选项
			if (formData.value.cityCode) {
				const districtData = await getCountryList({
					parentCode: formData.value.cityCode,
				});
				districtList.value = districtData.data;
			}
		}
	}
};

// 关闭弹窗
const handleClose = () => {
	emit('closeDialog');
	resetForm();
};

// 重置表单
function resetForm() {
	formRef.value?.resetFields();
	Object.keys(formData.value).forEach((key) => (formData.value[key] = ''));
	provinceList.value = [];
	cityList.value = [];
	districtList.value = [];
}

// 获取省数据
const changeCountry = async () => {
	provinceList.value = [];
	formData.value.provinceCode = '';
	formData.value.cityCode = '';
	formData.value.districtCode = '';
	const data = await getCountryList({
		parentCode: formData.value.countryCode,
	});
	provinceList.value = data.data;
};

// 获取市数据
const changeProvince = async () => {
	cityList.value = [];
	formData.value.cityCode = '';
	formData.value.districtCode = '';
	const data = await getCountryList({
		parentCode: formData.value.provinceCode,
	});
	cityList.value = data.data;
};

// 获取区数据
const changeCity = async () => {
	formData.value.districtCode = '';
	districtList.value = [];
	const data = await getCountryList({
		parentCode: formData.value.cityCode,
	});
	districtList.value = data.data;
};

// 提交
const onSubmit = () => {
	formRef.value.validate(async (valid: boolean) => {
		if (valid) {
			let api =
				props.editData && Object.keys(props.editData).length
					? updateWarehouse
					: addWarehouse;
			try {
				const res = await api(formData.value);
				if (res.code === 0) {
					useMessage().success('成功');
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
