<template>
	<div class="base-info">
		<el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
			<div class="section-title"><span class="section-bar"></span>港口信息</div>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item label="起运国" prop="startCountryCode">
						<SelectInputApi
							v-model="formData.startCountryCode"
							componentType="country"
							placeholder="请选择"
							:disabled="true"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="目的国" prop="destCountryCode">
						<SelectInputApi
							v-model="formData.destCountryCode"
							componentType="country"
							placeholder="请选择"
							:disabled="true"
						/>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item label="起运港" prop="startPortCode">
						<SelectInputApi
							v-model="formData.startPortCode"
							componentType="basePort"
							placeholder="请选择"
							:disabled="props.visiableType === 'view'"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="目的港" prop="destPortCode">
						<SelectInputApi
							v-model="formData.destPortCode"
							componentType="basePort"
							placeholder="请选择"
							:disabled="props.visiableType === 'view'"
						/>
					</el-form-item>
				</el-col>
			</el-row>
			<div class="section-title"><span class="section-bar"></span>货代信息</div>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item label="运输方式" prop="transportMethod">
						<SelectInputApi
							v-model="formData.transportMethod"
							componentType="dicts"
							placeholder="请选择"
							:disabled="props.visiableType === 'view'"
							@change="changeTransportMethod"
							:settings="{
								getTreeDataParams: 'transport_method',
							}"
						/>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item label="国内拖车报关" prop="domesticForwarderNo">
						<SelectInputApi
							v-model="formData.domesticForwarderNo"
							componentType="freightForwarder"
							placeholder="请选择"
							:disabled="props.visiableType === 'view'"
							:settings="{
								getTreeDataParams: {
									forwarderTypes: [1],
								},
								selectTreeProps: {
									value: 'forwarderCode',
								},
							}"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="海运/空运/铁路" prop="mainForwarderNo">
						<SelectInputApi
							v-model="formData.mainForwarderNo"
							componentType="freightForwarder"
							placeholder="请选择"
							:disabled="props.visiableType === 'view'"
							:settings="{
								getTreeDataParams: {
									forwarderTypes: [2],
								},
								selectTreeProps: {
									value: 'forwarderCode',
								},
							}"
						/>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item label="清关" prop="customsForwarderNo">
						<SelectInputApi
							v-model="formData.customsForwarderNo"
							componentType="freightForwarder"
							placeholder="请选择"
							:disabled="props.visiableType === 'view'"
							:settings="{
								getTreeDataParams: {
									forwarderTypes: [3],
								},
								selectTreeProps: {
									value: 'forwarderCode',
								},
							}"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="国外拖车" prop="deliveryForwarderNo">
						<SelectInputApi
							v-model="formData.deliveryForwarderNo"
							componentType="freightForwarder"
							placeholder="请选择"
							:disabled="props.visiableType === 'view'"
							:settings="{
								getTreeDataParams: {
									forwarderTypes: [4],
								},
								selectTreeProps: {
									value: 'forwarderCode',
								},
							}"
						/>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item label="是否中转拆柜" prop="transshipmentFlag">
						<el-select
							v-model="formData.transshipmentFlag"
							clearable
							placeholder="请选择"
							:disabled="props.visiableType === 'view'"
							@change="changeTransshipmentFlag"
						>
							<el-option
								v-for="item in [
									{ value: 1, label: '是' },
									{ value: 0, label: '否' },
								]"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8" v-if="formData.transshipmentFlag">
					<el-form-item label="中转仓" prop="transshipmentWarehouseCode">
						<SelectInputApi
							v-model="formData.transshipmentWarehouseCode"
							placeholder="请选择"
							:disabled="props.visiableType === 'view'"
							:settings="{
								getTreeData: getWarehouseInfoList,
								getTreeDataParams: {
									status: 1,
								},
								prefixKey: 'spName',
								separator: '-',
								selectTreeProps: {
									value: 'warehouseCode',
									label: 'warehouseName',
								},
								getIdsCode: 'warehouseCode',
							}"
						/>
					</el-form-item>
				</el-col>
			</el-row>
			<div class="section-title"><span class="section-bar"></span>订柜信息</div>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item label="柜型" prop="containerType">
						<SelectInputApi
							v-model="formData.containerType"
							componentType="dicts"
							placeholder="请选择"
							:disabled="props.visiableType === 'view'"
							@change="changeContainerType"
							:settings="{
								getTreeDataParams: 'container_type',
							}"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="SO" prop="soNo">
						<el-input
							v-model="formData.soNo"
							maxlength="500"
							show-word-limit
							placeholder="请输入SO"
							:disabled="props.visiableType === 'view'"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="柜号" prop="containerNo">
						<el-input
							v-model="formData.containerNo"
							maxlength="500"
							show-word-limit
							placeholder="请输入柜号"
							:disabled="props.visiableType === 'view'"
						/>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item label="封条号" prop="sealNo">
						<el-input
							v-model="formData.sealNo"
							maxlength="500"
							show-word-limit
							placeholder="请输入封条号"
							:disabled="props.visiableType === 'view'"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="提单号" prop="ladingNo">
						<el-input
							v-model="formData.ladingNo"
							maxlength="500"
							show-word-limit
							placeholder="请输入提单号"
							:disabled="props.visiableType === 'view'"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="船公司" prop="shippingLine">
						<el-input
							v-model="formData.shippingLine"
							maxlength="500"
							show-word-limit
							placeholder="请输入船公司"
							:disabled="props.visiableType === 'view'"
						/>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item label="船名" prop="vessel">
						<el-input
							v-model="formData.vessel"
							maxlength="500"
							show-word-limit
							placeholder="请输入船名"
							:disabled="props.visiableType === 'view'"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="船次" prop="voyage">
						<el-input
							v-model="formData.voyage"
							maxlength="500"
							show-word-limit
							placeholder="请输入船次"
							:disabled="props.visiableType === 'view'"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="截单时间" prop="docCutoffTime">
						<el-date-picker
							v-model="formData.docCutoffTime"
							type="datetime"
							clearable
							value-format="YYYY-MM-DD HH:mm:ss"
							placeholder="年/月/日"
							:disabled="props.visiableType === 'view'"
						/>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item label="截关时间" prop="customsCutoffTime">
						<el-date-picker
							v-model="formData.customsCutoffTime"
							type="datetime"
							clearable
							value-format="YYYY-MM-DD HH:mm:ss"
							placeholder="年/月/日"
							:disabled="props.visiableType === 'view'"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<!-- <el-form-item label="预计装柜时间" prop="estimatedLoadingTime">
						<el-date-picker
							v-model="formData.estimatedLoadingTime"
							type="datetime"
							clearable
							value-format="YYYY-MM-DD HH:mm:ss"
							placeholder="年/月/日"
							:disabled="props.visiableType === 'view'"
						/>
					</el-form-item> -->
				</el-col>
				<el-col :span="8">
					<el-form-item label="截SI时间" prop="siCutoffTime">
						<el-date-picker
							v-model="formData.siCutoffTime"
							type="datetime"
							clearable
							value-format="YYYY-MM-DD HH:mm:ss"
							placeholder="年/月/日"
							:disabled="props.visiableType === 'view'"
						/>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item label="预计开船时间" prop="departureDate">
						<el-date-picker
							v-model="formData.departureDate"
							type="date"
							clearable
							value-format="YYYY-MM-DD"
							placeholder="年/月/日"
							:disabled="props.visiableType === 'view'"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="预计到港时间" prop="estimatedArrivalDate">
						<el-date-picker
							v-model="formData.estimatedArrivalDate"
							type="date"
							clearable
							value-format="YYYY-MM-DD"
							placeholder="年/月/日"
							:disabled="props.visiableType === 'view'"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="空柜重(kg)" prop="emptyContainerWeight">
						<el-input
							v-model="formData.emptyContainerWeight"
							maxlength="6"
							show-word-limit
							placeholder="请输入空柜重"
							:disabled="props.visiableType === 'view'"
						/>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="24">
					<el-form-item label="订柜备注" prop="remark">
						<el-input
							v-model="formData.remark"
							maxlength="500"
							type="textarea"
							show-word-limit
							placeholder="备注"
							:disabled="props.visiableType === 'view'"
						/>
					</el-form-item>
				</el-col>
			</el-row>
			<div class="section-title"><span class="section-bar"></span>拖车安排</div>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item label="拖车安排时间" prop="trailerArrangeTime">
						<el-date-picker
							v-model="formData.trailerArrangeTime"
							type="datetime"
							clearable
							value-format="YYYY-MM-DD HH:mm:ss"
							placeholder="年/月/日"
							:disabled="props.visiableType === 'view'"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="车牌号" prop="licensePlate">
						<el-input
							v-model="formData.licensePlate"
							maxlength="50"
							show-word-limit
							placeholder="请输入车牌号"
							:disabled="props.visiableType === 'view'"
						/>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="mb18">
				<el-col :span="8">
					<el-form-item label="司机姓名" prop="driverName">
						<el-input
							v-model="formData.driverName"
							maxlength="50"
							show-word-limit
							placeholder="请输入司机姓名"
							:disabled="props.visiableType === 'view'"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="司机电话" prop="driverPhone">
						<el-input
							v-model="formData.driverPhone"
							maxlength="50"
							show-word-limit
							placeholder="请输入司机电话"
							:disabled="props.visiableType === 'view'"
						/>
					</el-form-item>
				</el-col>
			</el-row>
			<!-- <el-row class="mb18">
				<el-col :span="24">
					<el-form-item label="附件" prop="attachment">
						<upload-file
							:limit="100"
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
							v-model="formData.attachment"
							:isShowTip="true"
							:uploadFileUrl="'/admin/sys-file/upload'"
							type="simple"
							:data="{}"
							:dir="''"
							:autoUpload="true"
							:disabled="props.visiableType === 'view'"
							@error="() => {}"
							@remove="() => {}"
							@preview="() => {}"
							@exceed="() => {}"
							@success="() => {}"
						/>
					</el-form-item>
				</el-col>
			</el-row> -->
			<div class="section-title"><span class="section-bar"></span>附件</div>
			<el-row class="mb18">
				<el-col :span="24">
					<el-form-item label="贴标照片" prop="labelingPhotoFileUrl">
						<upload-file
							:limit="100"
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
							v-model="formData.labelingPhotoFileUrl"
							:isShowTip="true"
							:uploadFileUrl="'/admin/sys-file/upload'"
							type="simple"
							:data="{}"
							:dir="''"
							:autoUpload="true"
							:disabled="props.visiableType === 'view'"
							@error="() => {}"
							@remove="() => {}"
							@preview="() => {}"
							@exceed="() => {}"
							@success="() => {}"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="装柜照片" prop="loadingPhotoFileUrl">
						<upload-file
							:limit="100"
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
							v-model="formData.loadingPhotoFileUrl"
							:isShowTip="true"
							:uploadFileUrl="'/admin/sys-file/upload'"
							type="simple"
							:data="{}"
							:dir="''"
							:autoUpload="true"
							:disabled="props.visiableType === 'view'"
							@error="() => {}"
							@remove="() => {}"
							@preview="() => {}"
							@exceed="() => {}"
							@success="() => {}"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="工厂出库单" prop="factoryDeliveryOrderFileUrl">
						<upload-file
							:limit="100"
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
							v-model="formData.factoryDeliveryOrderFileUrl"
							:isShowTip="true"
							:uploadFileUrl="'/admin/sys-file/upload'"
							type="simple"
							:data="{}"
							:dir="''"
							:autoUpload="true"
							:disabled="props.visiableType === 'view'"
							@error="() => {}"
							@remove="() => {}"
							@preview="() => {}"
							@exceed="() => {}"
							@success="() => {}"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="其他附件" prop="attachment">
						<upload-file
							:limit="100"
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
							v-model="formData.attachment"
							:isShowTip="true"
							:uploadFileUrl="'/admin/sys-file/upload'"
							type="simple"
							:data="{}"
							:dir="''"
							:autoUpload="true"
							:disabled="props.visiableType === 'view'"
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
</template>

<script lang="ts" setup>
import { ref, defineAsyncComponent } from 'vue';
const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);
import { getWarehouseInfoList } from '/@/api/warehouse/third-warehouse/index';

const props = defineProps({
	title: { type: String, default: '添加仓库' },
	editData: { type: Object, default: () => ({}) },
	dictMap: { type: Object, default: () => ({}) }, // 字典数据
	visiableType: {
		type: String,
		default: '',
	},
});

const formRef = ref();
const formData = ref({
	startCountryCode: '', // 起运国
	destCountryCode: '', // 目的国
	startPortCode: '', // 起运港
	destPortCode: '', // 目的港
	transportMethod: '', // 运输方式
	domesticForwarderNo: '', // 国内拖车报关
	mainForwarderNo: '', // 海运/空运/铁路
	customsForwarderNo: '', // 清关
	deliveryForwarderNo: '', // 国外拖车
	transshipmentFlag: null, // 是否中转拆柜
	transshipmentWarehouseCode: '', // 中转仓
	containerType: '', // 柜型
	soNo: '', // SO
	containerNo: '', // 柜号
	sealNo: '', // 封条号
	ladingNo: '', // 提单号
	shippingLine: '', // 船公司
	vessel: '', // 船名
	voyage: '', // 船次
	docCutoffTime: '', // 截单时间
	customsCutoffTime: '', // 截关时间
	estimatedLoadingTime: '', // 预计装柜时间
	siCutoffTime: '', // 截SI时间
	departureDate: '', // 开船时间
	estimatedArrivalDate: '', // 预计到港时间
	remark: '', // 订柜备注
	trailerArrangeTime: '', // 拖车安排时间
	licensePlate: '', // 车牌号
	driverName: '', // 司机姓名
	driverPhone: '', // 司机电话
	labelingPhotoFileUrl: [], // 贴标照片
	loadingPhotoFileUrl: [], // 装柜照片
	factoryDeliveryOrderFileUrl: [], // 工厂出库单
	attachment: [], // 其他附件
	emptyContainerWeight: '', // 空柜重
});
// 校验不超过6位数的正整数
const validateEmptyContainerWeight = (rule: any, value: any, callback: any) => {
	if (value === '' || value === null || value === undefined) {
		callback();
		return;
	}
	const reg = /^[1-9]\d{0,5}$/;
	if (!reg.test(String(value))) {
		callback(new Error('请输入不超过6位数的正整数'));
	} else {
		callback();
	}
};
const rules = ref({
	// 起运国
	startCountryCode: [
		{
			required: true,
			message: '请选择起运国',
			trigger: 'blur',
		},
	],
	// 目的国
	destCountryCode: [
		{
			required: true,
			message: '请选择目的国',
			trigger: 'blur',
		},
	],
	// 起运港
	startPortCode: [
		{
			required: true,
			message: '请选择起运港',
			trigger: 'blur',
		},
	],
	// 目的港
	destPortCode: [
		{
			required: true,
			message: '请选择目的港',
			trigger: 'blur',
		},
	],
	// 运输方式
	transportMethod: [
		{
			required: true,
			message: '请选择运输方式',
			trigger: 'blur',
		},
	],
	// 清关
	customsForwarderNo: [
		{
			required: false,
			message: '请选择清关',
			trigger: 'blur',
		},
	],
	// 国内拖车报关
	domesticForwarderNo: [
		{
			required: false,
			message: '请选择国内拖车报关',
			trigger: 'blur',
		},
	],
	// 海运/空运/铁路
	mainForwarderNo: [
		{
			required: true,
			message: '请选择海运/空运/铁路',
			trigger: 'blur',
		},
	],
	// 国外拖车
	deliveryForwarderNo: [
		{
			required: false,
			message: '请选择海运/空运/铁路',
			trigger: 'blur',
		},
	],
	// 是否中转拆柜
	transshipmentFlag: [
		{
			required: true,
			message: '请选择是否中转拆柜',
			trigger: 'blur',
		},
	],
	// 中转仓
	transshipmentWarehouseCode: [
		{
			required: false,
			message: '请选择中转仓',
			trigger: 'blur',
		},
	],
	// 柜型
	containerType: [
		{
			required: false,
			message: '请选择柜型',
			trigger: 'blur',
		},
	],
	soNo: [
		{
			required: false,
			message: '请输入SO',
			trigger: 'blur',
		},
	],
	containerNo: [
		{
			required: false,
			message: '请输入柜号',
			trigger: 'blur',
		},
	],
	// 封条号
	sealNo: [
		{
			required: false,
			message: '请输入封条号',
			trigger: 'blur',
		},
	],
	// 船公司
	shippingLine: [
		{
			required: false,
			message: '请输入船公司',
			trigger: 'blur',
		},
	],
	// 船名船次
	vessel: [
		{
			required: false,
			message: '请输入船名',
			trigger: 'blur',
		},
	],
	// 船名船次
	voyage: [
		{
			required: false,
			message: '请输入船次',
			trigger: 'blur',
		},
	],
	// 预计装柜时间
	// estimatedLoadingTime: [
	// 	{
	// 		required: true,
	// 		message: '请选择预计装柜时间',
	// 		trigger: 'blur',
	// 	},
	// ],
	// 预计开船时间
	departureDate: [
		{
			required: false,
			message: '请选择预计开船时间',
			trigger: 'blur',
		},
	],
	// 订柜备注
	remark: [
		{
			required: false,
			message: '请输入订柜备注',
			trigger: 'blur',
		},
	],
	// 空柜重
	emptyContainerWeight: [
		{
			required: false,
			message: '请输入空柜重',
			trigger: 'blur',
		},
		{
			validator: validateEmptyContainerWeight,
			trigger: 'blur',
		},
	],
});

// 处理中转拆柜变化
const changeTransshipmentFlag = async (e: number) => {
	// 是否中转拆柜选择【是】时必填，下拉单选三方仓
	// 1是  0否
	formData.value.transshipmentWarehouseCode = '';
	if (e === 1) {
		rules.value.transshipmentWarehouseCode[0].required = true;
	} else if (e === 0) {
		rules.value.transshipmentWarehouseCode[0].required = false;
	}
	// 等待10毫秒，确保UI更新
	await new Promise((resolve) => setTimeout(resolve, 10));
	// 清空所有的校验
	formRef.value.clearValidate();
};
// 处理运输方式变化
const changeTransportMethod = async (e: string) => {
	// 运输方式含【海运】必填，其他非必填
	if (['1', '2', '3'].indexOf(e) !== -1) {
		rules.value.containerType[0].required = true;
		rules.value.customsForwarderNo[0].required = true;
		rules.value.domesticForwarderNo[0].required = true;
		rules.value.deliveryForwarderNo[0].required = true;
		rules.value.soNo[0].required = true;
	} else {
		rules.value.containerType[0].required = false;
		rules.value.customsForwarderNo[0].required = false;
		rules.value.domesticForwarderNo[0].required = false;
		rules.value.deliveryForwarderNo[0].required = false;
		rules.value.soNo[0].required = false;
	}
	// 运输方式含【海运】且柜型不是散货必填
	if (
		['1', '2', '3'].indexOf(e) !== -1 &&
		formData.value.containerType !== 'bulk_cargo'
	) {
		rules.value.emptyContainerWeight[0].required = true;
	} else {
		rules.value.emptyContainerWeight[0].required = false;
	}
	// 等待10毫秒，确保UI更新
	await new Promise((resolve) => setTimeout(resolve, 10));
	// 清空所有的校验
	formRef.value.clearValidate();
};

// 柜型改变
const changeContainerType = async (e: string) => {
	// 柜型不是散货必填，其他非必填
	if (e !== 'bulk_cargo') {
		rules.value.containerNo[0].required = true;
		rules.value.sealNo[0].required = true;
		rules.value.shippingLine[0].required = true;
		rules.value.vessel[0].required = true;
		rules.value.voyage[0].required = true;
		rules.value.departureDate[0].required = true;
		rules.value.remark[0].required = true;
	} else {
		rules.value.containerNo[0].required = false;
		rules.value.sealNo[0].required = false;
		rules.value.shippingLine[0].required = false;
		rules.value.vessel[0].required = false;
		rules.value.voyage[0].required = false;
		rules.value.departureDate[0].required = false;
		rules.value.remark[0].required = false;
	}
	// 运输方式含【海运】且柜型不是散货必填
	if (
		['1', '2', '3'].indexOf(formData.value.transportMethod) !== -1 &&
		e !== 'bulk_cargo'
	) {
		rules.value.emptyContainerWeight[0].required = true;
	} else {
		rules.value.emptyContainerWeight[0].required = false;
	}
	// 等待10毫秒，确保UI更新
	await new Promise((resolve) => setTimeout(resolve, 10));
	// 清空所有的校验
	formRef.value.clearValidate();
};
const setData = (data: any) => {
	formData.value = data;
};

const initData = async () => {
	// 是否中转拆柜选择【是】时必填，下拉单选三方仓
	// 1是  0否
	if (formData.value.transshipmentFlag === 1) {
		rules.value.transshipmentWarehouseCode[0].required = true;
	} else if (formData.value.transshipmentFlag === 0) {
		rules.value.transshipmentWarehouseCode[0].required = false;
	}
	// 运输方式含【海运】必填，其他非必填
	if (['1', '2', '3'].indexOf(formData.value.transportMethod) !== -1) {
		rules.value.containerType[0].required = true;
		rules.value.customsForwarderNo[0].required = true;
		rules.value.domesticForwarderNo[0].required = true;
		rules.value.deliveryForwarderNo[0].required = true;
		rules.value.soNo[0].required = true;
	} else {
		rules.value.containerType[0].required = false;
		rules.value.customsForwarderNo[0].required = false;
		rules.value.domesticForwarderNo[0].required = false;
		rules.value.deliveryForwarderNo[0].required = false;
		rules.value.soNo[0].required = false;
	}
	// 柜型不是散货必填，其他非必填
	if (
		formData.value.containerType &&
		formData.value.containerType !== 'bulk_cargo'
	) {
		rules.value.containerNo[0].required = true;
		rules.value.sealNo[0].required = true;
		rules.value.shippingLine[0].required = true;
		rules.value.vessel[0].required = true;
		rules.value.voyage[0].required = true;
		rules.value.departureDate[0].required = true;
		rules.value.remark[0].required = true;
	} else {
		rules.value.containerNo[0].required = false;
		rules.value.sealNo[0].required = false;
		rules.value.shippingLine[0].required = false;
		rules.value.vessel[0].required = false;
		rules.value.voyage[0].required = false;
		rules.value.departureDate[0].required = false;
		rules.value.remark[0].required = false;
	}
	// 运输方式含【海运】且柜型不是散货必填
	if (
		['1', '2', '3'].indexOf(formData.value.transportMethod) !== -1 &&
		formData.value.containerType !== 'bulk_cargo'
	) {
		rules.value.emptyContainerWeight[0].required = true;
	} else {
		rules.value.emptyContainerWeight[0].required = false;
	}

	// 等待10毫秒，确保UI更新
	await new Promise((resolve) => setTimeout(resolve, 10));
	// 清空所有的校验
	formRef.value.clearValidate();
};
defineExpose({
	formRef,
	formData,
	setData,
	initData,
});
</script>

<style lang="scss" scoped>
.base-info {
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
