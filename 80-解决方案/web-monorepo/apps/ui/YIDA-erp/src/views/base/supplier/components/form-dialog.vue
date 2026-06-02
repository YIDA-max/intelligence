<template>
	<el-dialog
		v-bind="$attrs"
		:close-on-click-modal="false"
		:title="props.title"
		width="80%"
		@open="handleOpen"
		draggable
	>
		<div class="dialog-container">
			<el-form
				:model="formData"
				:rules="rules"
				ref="formRef"
				label-width="110px"
			>
				<div class="section-title">
					<span class="section-bar"></span>基本信息
				</div>
				<el-row class="mb18">
					<el-col :span="8">
						<el-form-item label="供应商编号：" prop="supplierNo">
							<el-input
								v-model="formData.supplierNo"
								maxlength="20"
								show-word-limit
								placeholder="不填写保存自动生成"
								:disabled="props.visibleType === 'edit'"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="供应商名称：" prop="name">
							<el-input
								v-model="formData.name"
								maxlength="90"
								show-word-limit
								placeholder="请输入供应商名称"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="状态：" prop="status">
							<el-select v-model="formData.status" placeholder="请选择">
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
					<el-col :span="8">
						<el-form-item label="采购员：" prop="purchaseUserId">
							<SelectInputApi
								componentType="userList"
								v-model="formData.purchaseUserId"
								placeholder="请选择我方采购员"
								:settings="{
									text: '请选择我方采购员',
									getTreeDataParams: {
										postCodeList: [
											'PURCHASING_DIRECTOR',
											'PURCHASING_MANAGER',
											'PROCUREMENT_MANAGER',
											'PURCHASING_OFFICER',
										],
									},
								}"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="供应商传真：" prop="fax">
							<el-input
								v-model="formData.fax"
								maxlength="45"
								show-word-limit
								placeholder="请输入供应商传真"
								:autosize="{ minRows: 2, maxRows: 2 }"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="邮箱：" prop="email">
							<el-input
								v-model="formData.email"
								show-word-limit
								placeholder="请输入邮箱"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="8">
						<el-form-item label="QQ：" prop="qq">
							<el-input
								v-model="formData.qq"
								show-word-limit
								placeholder="请输入QQ"
								:autosize="{ minRows: 2, maxRows: 2 }"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="开发员：" prop="developerId">
							<SelectInputApi
								componentType="userList"
								v-model="formData.developerId"
								placeholder="请选择"
								:settings="{
									text: '请选择',
									getTreeDataParams: { lockFlag: 0 },
								}"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item label="备注：" prop="remark">
							<el-input
								v-model="formData.remark"
								maxlength="1000"
								show-word-limit
								placeholder="请输入备注"
								type="textarea"
								:autosize="{ minRows: 2, maxRows: 2 }"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item label="上传附件" prop="file">
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
								v-model="formData.file"
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
							/> </el-form-item></el-col
				></el-row>
				<div class="section-title">
					<span class="section-bar"></span>供应商地址
				</div>
				<el-row class="mb18">
					<el-col :span="24">
						<el-table
							:data="tableData"
							style="width: 100%"
							v-loading="loading"
							border
							ref="tableRef"
							row-key="id"
							native-scrollbar
						>
							<el-table-column
								label="序号"
								align="center"
								type="index"
								width="60"
								reserve-selection
							/>
							<el-table-column prop="factoryAbbreviation" width="150">
								<template #header>
									<span
										:style="{
											color: '#f78c8c',
											marginRight: '3px',
										}"
										>*
									</span>
									{{ $t('工厂简称') }}
								</template>
								<template #default="{ row }">
									<el-input
										v-model="row.factoryAbbreviation"
										placeholder="请输入"
										style="width: 100%"
									/>
								</template>
							</el-table-column>
							<el-table-column
								prop="countryCode"
								width="300"
								show-overflow-tooltip
							>
								<template #header>
									<span
										:style="{
											color: '#f78c8c',
											marginRight: '3px',
										}"
										>*
									</span>
									{{ $t('国家-省-市-区-街道') }}
								</template>
								<template #default="{ row }">
									<el-cascader
										v-model="row.countryCode"
										style="width: 100%"
										:options="areaOptions"
										:props="optionProps"
										clearable
										filterable
									></el-cascader>
								</template>
							</el-table-column>
							<el-table-column prop="address" min-width="240">
								<template #header>
									<span
										:style="{
											color: '#f78c8c',
											marginRight: '3px',
										}"
										>*
									</span>
									{{ $t('详细地址') }}
								</template>
								<template #default="{ row }">
									<el-input
										v-model="row.address"
										placeholder="请输入"
										style="width: 100%"
									/>
								</template>
							</el-table-column>
							<el-table-column prop="contact" width="120">
								<template #header>
									<span
										:style="{
											color: '#f78c8c',
											marginRight: '3px',
										}"
										>*
									</span>
									{{ $t('联系人') }}
								</template>
								<template #default="{ row }">
									<el-input
										v-model="row.contact"
										placeholder="请输入"
										style="width: 100%"
									/>
								</template>
							</el-table-column>
							<el-table-column prop="phone" width="120">
								<template #header>
									<span
										:style="{
											color: '#f78c8c',
											marginRight: '3px',
										}"
										>*
									</span>
									{{ $t('联系电话') }}
								</template>
								<template #default="{ row }">
									<el-input
										v-model="row.phone"
										placeholder="请输入"
										style="width: 100%"
									/>
								</template>
							</el-table-column>
							<el-table-column prop="email" width="150">
								<template #header>
									<span
										:style="{
											color: '#f78c8c',
											marginRight: '3px',
										}"
										>*
									</span>
									{{ $t('联系邮箱 多邮箱“;”隔开') }}
								</template>
								<template #default="{ row }">
									<el-input
										v-model="row.email"
										maxlength="500"
										show-word-limit
										placeholder="请输入"
										style="width: 100%"
										@blur="handleAddressEmailBlur(row)"
									/>
								</template>
							</el-table-column>
							<el-table-column
								:label="$t('默认联系人')"
								prop="defaultFlag"
								width="120"
							>
								<template #header>
									<span
										:style="{
											color: '#f78c8c',
											marginRight: '3px',
										}"
										>*
									</span>
									{{ $t('默认联系人') }}
								</template>
								<template #default="{ row }">
									<el-switch
										:modelValue="row.defaultFlag"
										size="small"
										@change="
								(e: any) => {
									statusChange(e, row);
								}
							"
									></el-switch>
								</template>
							</el-table-column>
							<el-table-column prop="factoryNearestPortCode" width="200">
								<template #header>
									{{ $t('工厂就近港口') }}
								</template>
								<template #default="{ row }">
									<SelectInputApi
										componentType="basePort"
										v-model="row.factoryNearestPortCode"
										placeholder="工厂就近港口"
										:settings="{
											text: '工厂就近港口',
										}"
									/>
								</template>
							</el-table-column>
							<el-table-column :label="$t('备注')" prop="remark" width="150">
								<template #default="{ row }">
									<el-input
										v-model="row.remark"
										placeholder="请输入"
										style="width: 100%"
										maxlength="1000"
									/>
								</template>
							</el-table-column>
							<el-table-column
								:label="$t('common.action')"
								width="120"
								fixed="right"
							>
								<template #default="{ row, $index: rowIndex }">
									<el-button
										:icon="Minus"
										@click="handleDelete(row, rowIndex)"
									/>
								</template>
							</el-table-column>
						</el-table>
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
import { useMessage } from '/@/hooks/message';
import { addInit, editInit, addFormInit } from './utils';
import { getRegExp, rule } from '/@/utils/validate';
import { Minus, Plus } from '@element-plus/icons-vue';
import { fetchTree } from '/@/api/admin/sysArea';
const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);
const props = defineProps({
	title: { type: String, default: '添加仓库' },
	currentRow: { type: Object, default: () => ({}) }, // 当前编辑的数据
	visibleType: { type: String, default: '' }, // 弹窗类型
	dictMap: { type: Object, default: () => ({}) }, // 字典数据
});
const emit = defineEmits(['closeDialog', 'save']);

// 加载
const loading = ref(false);

// form表单
const formRef = ref();
const formData = ref<any>({});

// table 行类型
interface SupplierAddressRow {
	countryCode: string[]; // 省市区代码数组
	countryNames: string[]; // 省市区名称数组
	address: string; // 详细地址
	contact: string; // 联系人
	phone: string; // 联系电话
	defaultFlag: boolean; // 是否默认联系人
	remark: string; // 备注
	factoryNearestPortCode?: string; // 工厂就近港口
	factoryAbbreviation?: string; // 供应商简称
	email?: string; // 供应商邮箱
	id?: number; // id
}

// table
const tableData = ref<SupplierAddressRow[]>([]);

const areaOptions = ref([]);
const optionProps = {
	checkStrictly: false,
	label: 'name',
	value: 'id',
};

// 改变当前是否联系人状态
const statusChange = (e: boolean, row: any) => {
	row.defaultFlag = e;
};

/** 联系邮箱：支持英文分号分隔多邮箱（每段 trim，空段忽略；至少一段合法） */
const isSemicolonSeparatedEmailsValid = (value: string) => {
	const str = String(value ?? '').trim();
	if (!str) {
		return true;
	}
	const parts = str
		.split(';')
		.map((s) => s.trim())
		.filter(Boolean);
	if (parts.length === 0) {
		return false;
	}
	const reg = new RegExp(getRegExp('email'));
	return parts.every((p) => reg.test(p));
};

/** 地址行联系邮箱：非空时按与表单邮箱同一规则校验 */
const handleAddressEmailBlur = (row: SupplierAddressRow) => {
	const v = String(row.email ?? '').trim();
	if (!v) {
		return;
	}
	if (!isSemicolonSeparatedEmailsValid(v)) {
		useMessage().error('联系邮箱格式有误');
	}
};

// 校验规则
const rules = ref({
	supplierNo: [
		{ required: false, message: '供应商编码不能为空', trigger: 'blur' },
		{ validator: rule.validatorCode, trigger: 'blur' },
	],
	name: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
	status: [{ required: true, message: '请选择状态', trigger: 'change' }],
	purchaseUserId: [{ required: true, message: '请选择', trigger: 'change' }],
	email: [{ validator: rule.email, trigger: 'blur' }],
});
// 打开弹窗
const handleOpen = async () => {
	if (props.visibleType === 'edit') {
		editInit(formData, props.currentRow);
		// 把后端的各级 code 组装成 cascader 的路径数组
		tableData.value = (props.currentRow.addressList || []).map((it: any) => ({
			countryCode: [
				it.countryCode,
				it.provinceCode,
				it.cityCode,
				it.districtCode,
				it.streetCode,
			].filter(Boolean),
			countryNames: [
				it.countryCodeText,
				it.provinceText,
				it.cityText,
				it.districtText,
				it.streetText,
			].filter(Boolean),
			address: it.address || '',
			contact: it.contact || '',
			phone: it.phone || '',
			defaultFlag: !!it.defaultFlag,
			remark: it.remark ?? '',
			factoryNearestPortCode: it.factoryNearestPortCode || '', // 工厂就近港口
			factoryAbbreviation: it.factoryAbbreviation || '', // 供应商简称
			email: it.email || '', // 供应商邮箱
			id: it.id, //id
		}));
	} else if (props.visibleType === 'add') {
		// 重置表单
		addInit(formData, formRef);
		tableData.value = [];
	}
	const { data } = await fetchTree();
	areaOptions.value = data;
};

// 关闭弹窗
const handleClose = () => {
	emit('closeDialog');
};

// 提交
const onSubmit = async () => {
	loading.value = true;
	try {
		if (!formRef.value) return;
		// 校验表单
		const valid = await formRef.value.validate();
		if (!valid) return;
		// 校验表格数据
		if (!tableData.value.length) {
			useMessage().error(`供应商地址至少有一条数据`);
			return false;
		}
		for (let i = 0; i < tableData.value.length; i++) {
			const row = tableData.value[i];
			if (!row.countryCode || !row.countryCode.length) {
				useMessage().error(`第 ${i + 1} 项缺少完整地址（请选择到末级）`);
				return false;
			}
			if (!row.address) {
				useMessage().error(`第 ${i + 1} 项缺少详细地址`);
				return false;
			}
			if (!row.contact) {
				useMessage().error(`第 ${i + 1} 项缺少联系人`);
				return false;
			}
			if (!row.phone) {
				useMessage().error(`第 ${i + 1} 项缺少联系电话`);
				return false;
			}
			const rowEmail = String(row.email ?? '').trim();
			if (!rowEmail) {
				useMessage().error(`第 ${i + 1} 项缺少联系邮箱`);
				return false;
			}
			if (!isSemicolonSeparatedEmailsValid(rowEmail)) {
				useMessage().error(`第 ${i + 1} 项联系邮箱格式不正确`);
				return false;
			}
			row.email = rowEmail;
		}
		// 映射为后端需要的字段
		const addressList = tableData.value.map((row) => {
			const codes = row.countryCode || [];
			return {
				countryCode: codes[0] || '',
				provinceCode: codes[1] || '',
				cityCode: codes[2] || '',
				districtCode: codes[3] || '',
				streetCode: codes[4] || '',
				address: row.address,
				contact: row.contact,
				phone: row.phone,
				remark: row.remark,
				defaultFlag: row.defaultFlag ? 1 : 0,
				factoryNearestPortCode: row.factoryNearestPortCode || '', // 工厂就近港口
				factoryAbbreviation: row.factoryAbbreviation || '', // 供应商简称
				email: row.email || '', // 供应商邮箱
				id: row.id || undefined, // id
			};
		});
		formData.value.addressList = addressList;
		await addFormInit(
			formData.value,
			props.visibleType,
			props.currentRow,
			handleClose
		);
	} catch (error: any) {
		loading.value = false;
		useMessage().error(error.msg || '操作失败，请稍后重试');
		return;
	} finally {
		loading.value = false;
	}
};

// 添加地址行
const handleAdd = () => {
	tableData.value.push({
		countryCode: [],
		countryNames: [],
		address: '',
		contact: '',
		phone: '',
		email: '',
		defaultFlag: tableData.value?.length === 0, // 第一行默认选中
		remark: '',
	});
};

// 删除地址行
const handleDelete = (row: any, index: number) => {
	tableData.value.splice(index, 1);
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
