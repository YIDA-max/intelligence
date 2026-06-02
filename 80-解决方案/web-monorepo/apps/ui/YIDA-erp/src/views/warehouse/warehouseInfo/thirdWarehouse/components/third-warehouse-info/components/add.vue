<template>
	<el-dialog
		v-bind="$attrs"
		:close-on-click-modal="false"
		:title="props.title"
		width="1000px"
		@close="handleClose"
		@open="handleOpen"
		draggable
	>
		<div class="dialog-container">
			<el-form
				:model="formData"
				:rules="rules"
				ref="formRef"
				label-width="120px"
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
								:disabled="props.visibleType === 'edit'"
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
						<el-form-item label="仓库类型" prop="warehouseType">
							<el-select
								v-model="formData.warehouseType"
								placeholder="请选择仓库类型"
								filterable
								:disabled="props.visibleType === 'edit'"
							>
								<el-option
									v-for="item in [{ value: '1', label: '三方仓' }]"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="仓库业务" prop="warehouseBizList">
							<TreeSelectInputApi
								v-model:queryForm="formData"
								componentType="dicts"
								multiple
								placeholder="请选择仓库业务"
								:settings="{
									width: '100%',
									getTreeDataParams: 'warehouse_biz',
									code: 'warehouseBizList',
								}"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="法人主体" prop="legalPersonId">
							<SelectInputApi
								v-model="formData.legalPersonId"
								componentType="legalEntity"
								placeholder="法人主体"
								:disabled="props.visibleType === 'edit'"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="费用系统仓库" prop="feeWarehouseId">
							<SelectInputApi
								v-model="formData.feeWarehouseId"
								componentType="feeWarehouse"
								placeholder="费用系统仓库"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<div class="section-title">
					<span class="section-bar"></span>服务商信息
				</div>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="服务商名称" prop="spId">
							<el-select
								v-model="formData.spId"
								placeholder="请选择服务商"
								filterable
								@change="handleSpNameChange()"
								:disabled="props.visibleType === 'edit'"
							>
								<el-option
									v-for="item in spInfoList"
									:key="item.id"
									:label="item.spName"
									:value="item.id"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-row class="mb18">
							<el-col :span="21"
								><el-form-item label="服务商仓库" prop="spWhCode"
									><el-select
										v-model="formData.spWhCode"
										placeholder="请选择服务商仓库"
										filterable
									>
										<el-option
											v-for="item in spWhCodeList"
											:key="item.value"
											:label="item.spWhName"
											:value="item.spWhCode"
										/>
									</el-select> </el-form-item
							></el-col>
							<el-col
								:span="2"
								:style="{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									marginLeft: '15px',
									color: '#2e5cf6',
								}"
								@click="refreshSpWhCodeList"
								><el-icon><Refresh /></el-icon
							></el-col>
						</el-row>
					</el-col>
				</el-row>
				<div class="section-title" v-if="formData.spWhCode">
					<span class="section-bar"></span>库存同步设置
				</div>
				<el-row class="mb18" v-if="formData.spWhCode">
					<el-col :span="24">
						<el-form-item label="同步时间" prop="spWhSyncTime">
							<el-checkbox-group v-model="formData.spWhSyncTime">
								<el-checkbox
									v-for="item in spWhSyncTimeArr"
									:key="item.value"
									:value="item.value"
									name="spWhSyncTime"
									>{{ item.label }}</el-checkbox
								>
							</el-checkbox-group>
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
								@change="changeLocation('country')"
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
								@change="changeLocation('province')"
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
								@change="changeLocation('city')"
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
								style="min-width: 550px"
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
								style="min-width: 550px"
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
	postSaveThirdWarehouse,
	postUpdateThirdWarehouse,
} from '/@/api/warehouse/third-warehouse/index';
import { getCountryList } from '/@/api/warehouse/warehouse/index';
import {
	getSpWarehouseListBySpId,
	getSpWarehouseSyncWarehouse,
} from '/@/api/warehouse/spInfo/index';
import { useMessage } from '/@/hooks/message';
import { getSpInfoList } from '/@/api/warehouse/spInfo/index';
import { rule } from '/@/utils/validate';
import { spWhSyncTimeArr, addInit, editInit } from './utils';

const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);

const TreeSelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/TreeSelectInputApi/index.vue')
);
const props = defineProps({
	title: { type: String, default: '添加仓库' },
	currentData: { type: Object, default: () => ({}) }, // 当前编辑的数据
	visibleType: { type: String, default: '' }, // 弹窗类型
	dictMap: { type: Object, default: () => ({}) }, // 字典数据
});
const emit = defineEmits(['closeDialog', 'save']);
//   初始化服务商列表数据
const spInfoList = ref<any[]>([]);
// 加载
const loading = ref(false);

// form表单
const formRef = ref();
const formData = ref<
	| {
			warehouseCode: string;
			warehouseName: string;
			warehouseType: string;
			companyName: string;
			legalPersonId: string | number | null;
			feeWarehouseId: string | number | null;
			warehouseBizList: string[];
			spId: string;
			spWhCode: string;
			contact: string;
			phone: string;
			countryCode: string;
			provinceCode: string;
			cityCode: string;
			districtCode: string;
			postCode: string;
			address1: string;
			address2: string;
	  }
	| any
>({
	warehouseCode: '', // 仓库代码
	warehouseName: '', // 仓库名称
	warehouseType: '1', // 仓库类型
	companyName: '', // 公司名称.
	legalPersonId: null, // 法人主体
	feeWarehouseId: null, // 费用系统仓库
	warehouseBizList: [], // 仓库业务
	spId: '', // 服务商ID
	spWhCode: '', // 对接仓库代码
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

// 当前对接仓库的服务商代码
const spWhCodeList = ref<any[]>([]);
// 当前选中的服务商
const currentSpInfo = ref();
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
const rules = ref({
	warehouseCode: [
		{ required: true, message: '仓库代码不能为空', trigger: 'blur' },
		{ validator: rule.validatorCode, trigger: 'blur' },
	],
	warehouseBizList: [
		{ required: true, message: '仓库业务不能为空', trigger: 'change' },
	],
	legalPersonId: [
		{ required: true, message: '法人主体不能为空', trigger: 'change' },
	],
	spId: [{ required: true, message: '服务商名称不能为空', trigger: 'blur' }],
	spWhCode: [
		{ required: true, message: '服务商仓库不能为空', trigger: 'blur' },
	],
	spWhSyncTime: [
		{ required: true, message: '同步时间不能为空', trigger: 'change' },
	],
	warehouseName: [
		{ required: true, message: '仓库名称不能为空', trigger: 'blur' },
	],
	warehouseType: [
		{ required: true, message: '仓库类型不能为空', trigger: 'change' },
	],
	countryCode: [{ required: true, message: '国家不能为空', trigger: 'change' }],
	provinceCode: [
		{ required: false, message: '省/州不能为空', trigger: 'change' },
	],
	// 联系电话 非必填，若填写，支持11位数字
	// phone: [
	// 	{
	// 		validator: rule.validatePhone,
	// 		trigger: 'blur',
	// 	},
	// ],
	// // 邮编
	// postCode: [
	// 	{
	// 		validator: rule.validatePostalCode,
	// 		trigger: 'blur',
	// 	},
	// ],
});
// 打开弹窗
const handleOpen = async () => {
	if (props.visibleType === 'edit') {
		// 需要根据当时的服务商代码去查询对应的对接仓库代码列表
		getSpWarehouseList(props.currentData.spId, 'locality');
		editInit(formData, props.currentData);
		// 设置当前选中的服务商
		handleSpNameChange();
		// 设置当前选中的服务商信息
		formData.value.spWhCode = props.currentData.spWhCode;
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
	} else if (props.visibleType === 'add') {
		// 重置表单
		addInit(formRef, formData, spWhCodeList, currentSpInfo);
		// 清空省市区数据
		provinceList.value = [];
		cityList.value = [];
		districtList.value = [];
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
	}
	// 设置默认仓库类型为海外仓
	formData.value.warehouseType = '1';
	// 获取服务商列表
	try {
		const res = await getSpInfoList({ status: 1 });
		if (res.code === 0) {
			spInfoList.value = res.data;
		}
	} catch (error: any) {
		useMessage().error(error.msg || '获取服务商列表失败');
	}
};

// 处理服务商名称变化获取对应的对接仓库代码列表
const handleSpNameChange = async () => {
	// 设置当前选中的服务商
	currentSpInfo.value =
		props.dictMap.spInfoList.find(
			(item: any) => item.id === formData.value.spId
		) || {};
	// 清空对接仓库代码列表
	spWhCodeList.value = [];
	// 清空对接仓库代码
	formData.value.spWhCode = '';
	// 如果服务商名称为空则不进行查询
	if (!formData.value.spId) return;
	// 获取对应的对接仓库代码列表

	if (formData.value.spId) {
		getSpWarehouseList(formData.value.spId, 'locality');
	}
	// 开始判断选中的服务商是不是已经授权的
	isSpAuthorized();
};

// 刷新对接仓库代码列表
const refreshSpWhCodeList = () => {
	// 设置当前选中的服务商
	currentSpInfo.value =
		props.dictMap.spInfoList.find(
			(item: any) => item.id === formData.value.spId
		) || {};
	// 清空对接仓库代码列表
	spWhCodeList.value = [];
	// 清空对接仓库代码
	formData.value.spWhCode = '';
	// 如果服务商名称为空则不进行查询
	if (!formData.value.spId) {
		useMessage().warning('请先选择服务商名称');
		return;
	}
	// 获取对应的对接仓库代码列表

	if (formData.value.spId) {
		getSpWarehouseList(formData.value.spId, 'sys');
	}
	// 开始判断选中的服务商是不是已经授权的
	isSpAuthorized();
};

// 判断服务商是否已授权
const isSpAuthorized = async () => {
	// 开始判断选中的服务商是不是已经授权的
	if (currentSpInfo.value.authStatus === 0) {
		// 如果未授权则spWhCode非必填
		rules.value.spWhCode = [];
		// 等待100毫秒，确保UI更新
		await new Promise((resolve) => setTimeout(resolve, 100));
		// 清空所有的校验
		formRef.value.clearValidate();
		return;
	} else if (currentSpInfo.value.authStatus === 1) {
		// 如果已授权则spWhCode必填
		rules.value.spWhCode = [
			{ required: true, message: '对接仓库代码不能为空', trigger: 'blur' },
		];
		// 等待100毫秒，确保UI更新
		await new Promise((resolve) => setTimeout(resolve, 100));
		// 清空所有的校验
		formRef.value.clearValidate();
	}
};

// 根据服务商ID获取对应的对接仓库代码列表
const getSpWarehouseList = async (spId: string, type: string) => {
	try {
		if (!spId) {
			return;
		}
		const api =
			type === 'sys' ? getSpWarehouseSyncWarehouse : getSpWarehouseListBySpId;
		const res = await api({ spId });
		if (res.code === 0) {
			spWhCodeList.value = res.data;
		}
	} catch (error: any) {
		if (!error.msg) return;
		useMessage().error(error.msg || '获取对接仓库代码列表失败');
	}
};

/**
 * 通用函数，用于根据传入的 type 获取省、市、区的数据
 *
 * @param type - 要获取的数据类型：'country' 获取省数据，'province' 获取市数据，'city' 获取区数据
 */
const changeLocation = async (type: 'country' | 'province' | 'city') => {
	// 如果是获取省数据
	if (type === 'country') {
		// 清空市和区的数据
		provinceList.value = [];
		formData.value.provinceCode = ''; // 重置省编码
		formData.value.cityCode = ''; // 重置市编码
		formData.value.districtCode = ''; // 重置区编码

		// 请求省数据
		const data = await getCountryList({
			parentCode: formData.value.countryCode, // 以国家编码作为父级代码
		});

		// 将获取到的省数据存入 provinceList
		provinceList.value = data.data;
	}
	// 如果是获取市数据
	else if (type === 'province') {
		// 清空区的数据
		cityList.value = [];
		formData.value.cityCode = ''; // 重置市编码
		formData.value.districtCode = ''; // 重置区编码

		// 请求市数据
		const data = await getCountryList({
			parentCode: formData.value.provinceCode, // 以省编码作为父级代码
		});

		// 将获取到的市数据存入 cityList
		cityList.value = data.data;
	}
	// 如果是获取区数据
	else if (type === 'city') {
		// 清空区的数据
		districtList.value = [];
		formData.value.districtCode = ''; // 重置区编码

		// 请求区数据
		const data = await getCountryList({
			parentCode: formData.value.cityCode, // 以市编码作为父级代码
		});

		// 将获取到的区数据存入 districtList
		districtList.value = data.data;
	}
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
					? postUpdateThirdWarehouse
					: postSaveThirdWarehouse;
			try {
				const res = await api({
					...formData.value,
					warehouseBizList: formData.value.warehouseBizList?.sort(
						(a: any, b: any) => a - b
					), // 仓库业务进行增序排序
				});
				if (res.code === 0) {
					useMessage().success('成功');
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
