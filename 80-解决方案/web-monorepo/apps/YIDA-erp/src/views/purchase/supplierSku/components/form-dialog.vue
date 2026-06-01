<template>
	<el-dialog
		v-bind="$attrs"
		:close-on-click-modal="false"
		:title="props.title"
		width="80%"
		@close="handleClose"
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
						<el-form-item label="供应商" prop="supplierNo">
							<el-select
								v-model="formData.supplierNo"
								filterable
								placeholder="请选择供应商"
							>
								<el-option
									v-for="item in props.dictMap.spInfoList"
									:key="item.supplierNo"
									:label="item.name"
									:value="item.supplierNo"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="采购员" prop="purchaseUserId">
							<el-select
								v-model="formData.purchaseUserId"
								filterable
								placeholder="请选择采购员"
							>
								<el-option
									v-for="item in props.dictMap.purchaseUserId"
									:key="item.userId"
									:label="item.name"
									:value="item.userId"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="主计划" prop="planUserId">
							<el-select
								v-model="formData.planUserId"
								placeholder="请选择主计划"
								filterable
								clearable
							>
								<el-option
									v-for="item in props.dictMap.planUserId"
									:key="item.userId"
									:label="item.name"
									:value="item.userId"
								/>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="8">
						<el-form-item label="sku/产品名称" prop="skuCode">
							<el-select
								v-model="formData.skuCode"
								placeholder="请选择sku/产品名称"
								filterable
								remote
								reserve-keyword
								remote-show-suffix
								:remote-method="
									async (e:string) => {
										const res = await getAllSkuList({
											keyword: e,
											page: 1,
											size: 99999,
										});
										skuOptions =
											res.data?.records?.map((item:any) => {
												return {
													...item,
													value: item.skuCode,
													label: `${item.skuCode} - ${item.skuName}`,
												};
											}) || [];
									}
								"
							>
								<el-option
									v-for="item in skuOptions"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="采购交期" prop="purchaseDeliveryDays">
							<el-input
								v-model="formData.purchaseDeliveryDays"
								placeholder="请输入采购交期"
								type="number"
								:min="1"
								:step="1"
							>
								<template #suffix>天</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="最小起订量" prop="minimumOrder">
							<el-input
								type="number"
								v-model="formData.minimumOrder"
								:min="1"
								:step="1"
								placeholder="请输入最小起订量"
							>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item label="供应商产品备注" prop="supplierProductRemark">
							<el-input
								v-model="formData.supplierProductRemark"
								maxlength="255"
								show-word-limit
								placeholder="供应商产品备注"
								type="textarea"
								:autosize="{ minRows: 2, maxRows: 2 }"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<div class="section-title">
					<span class="section-bar"></span>报价信息
				</div>
				<el-row class="mb18">
					<el-col :span="8">
						<el-form-item label="是否含包材" prop="wrapperFlag">
							<el-select v-model="formData.wrapperFlag" placeholder="请选择">
								<el-option
									v-for="item in [
										{ label: '是', value: 1 },
										{ label: '否', value: 0 },
									]"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="币种" prop="currency">
							<el-select
								v-model="formData.currency"
								filterable
								placeholder="请选择币种"
							>
								<el-option
									v-for="item in props.dictMap.currency"
									:key="item.currencyCode"
									:label="item.currencyCode"
									:value="item.currencyCode"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="实际税率" prop="effectiveTaxRate">
							<el-input
								v-model="formData.effectiveTaxRate"
								placeholder="请输入实际税率"
								@change="handleTaxRateChange"
							>
								<template #suffix>%</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="8">
						<el-form-item label="发票类型" prop="invoiceType">
							<el-select
								v-model="formData.invoiceType"
								placeholder="请选择发票类型"
								@change="(val: string) => { 
									changeInvoiceType(val);
								}"
								><el-option
									v-for="item in props.dictMap.invoiceType"
									:key="item.value"
									:label="item.label"
									:value="item.value"
							/></el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="票面税率" prop="couponRate">
							<el-input
								v-model="formData.couponRate"
								placeholder="请输入票面税率"
							>
								<template #suffix>%</template>
							</el-input>
						</el-form-item>
					</el-col>
					<!-- 只发票类型为专票时必填，只能填写0-99.99的数值 -->
					<el-col :span="8">
						<el-form-item label="退税率" prop="taxRefundRate">
							<el-input
								v-model="formData.taxRefundRate"
								placeholder="请输入退税率"
								@change="handleTaxRateChange"
							>
								<template #suffix>%</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item label="是否梯度报价" prop="ladderFlag">
							<el-radio-group
								v-model="formData.ladderFlag"
								@change="
									(val: number) => {
										if (val === 1) {
											formData.ladderList = [{
												id: Date.now(),
												minNum: 1,
												maxNum: '',
												unitPriceWithoutTax: '',
												taxRate: '',
												unitPriceIncludingTax: '',
												returnUnitPriceTax: '',
											}];
										} else {
											formData.ladderList = [];
											formData.unitPriceWithoutTax = '';
											formData.unitPriceIncludingTax = '';
											formData.tax = '';
											formData.returnUnitPriceTax = '';
										}
									}
								"
							>
								<el-radio :value="1">是</el-radio>
								<el-radio :value="0">否</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18" v-if="formData.ladderFlag === 0">
					<el-col :span="8">
						<el-form-item label="不含税单价" prop="unitPriceWithoutTax">
							<el-input
								v-model="formData.unitPriceWithoutTax"
								placeholder="请输入不含税单价"
								@change="
									() => {
										handleChangePrice(formData, 'unitPriceWithoutTax', 'form');
									}
								"
							>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="税额" prop="tax">
							<el-input
								v-model="formData.tax"
								placeholder="请输入税额"
								disabled
							>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18" v-if="formData.ladderFlag === 0">
					<el-col :span="8">
						<el-form-item label="含税单价" prop="unitPriceIncludingTax">
							<el-input
								v-model="formData.unitPriceIncludingTax"
								placeholder="请输入含税单价"
								@change="
									() => {
										handleChangePrice(
											formData,
											'unitPriceIncludingTax',
											'form'
										);
									}
								"
							>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="单品可退税额" prop="returnUnitPriceTax">
							<el-input
								v-model="formData.returnUnitPriceTax"
								placeholder="单品可退税额"
								disabled
							>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18" v-if="formData.ladderFlag === 1">
					<el-col :span="24">
						<el-form-item label=" " prop="">
							<el-table
								:data="formData.ladderList"
								style="width: 100%"
								row-key="id"
								native-scrollbar
							>
								<el-table-column prop="minNum">
									<template #header>
										<span
											:style="{
												color: '#f78c8c',
												marginRight: '3px',
											}"
											>*
										</span>
										{{ $t('起始数量') }}
									</template>
									<template #default="{ row, $index: rowIndex }">
										<el-input
											v-model="row.minNum"
											:placeholder="`请输入数量`"
											:disabled="rowIndex !== 0"
											type="number"
										/>
									</template>
								</el-table-column>
								<el-table-column prop="maxNum">
									<template #header>
										<span
											:style="{
												color: '#f78c8c',
												marginRight: '3px',
											}"
											>*
										</span>
										{{ $t('结束数量') }}
									</template>
									<template #default="{ row, $index: rowIndex }">
										<el-input
											v-model="row.maxNum"
											:placeholder="`${
												rowIndex === formData.ladderList.length - 1
													? '∞'
													: '请输入数量'
											}`"
											type="number"
											@change="
												() => {
													handelChangeMaxNum(row, rowIndex);
												}
											"
										/>
									</template>
								</el-table-column>
								<el-table-column
									prop="unitPriceWithoutTax"
									:label="$t('不含税单价')"
								>
									<template #header>
										{{ $t('不含税单价') }}
									</template>
									<template #default="{ row }">
										<el-input
											v-model="row.unitPriceWithoutTax"
											placeholder="请输入不含税单价"
											@change="
												() => {
													handleChangePrice(
														row,
														'unitPriceWithoutTax',
														'ladder'
													);
												}
											"
										>
											<template #suffix> </template>
										</el-input>
									</template>
								</el-table-column>
								<el-table-column prop="taxRate" :label="$t('税额:')">
									<template #default="{ row }">
										<el-input
											v-model="row.taxRate"
											placeholder="请输入税额"
											disabled
										>
											<template #suffix></template>
										</el-input>
									</template>
								</el-table-column>
								<el-table-column
									prop="unitPriceIncludingTax"
									:label="$t('含税单价')"
								>
									<template #header>
										{{ $t('含税单价') }}
									</template>
									<template #default="{ row }">
										<el-input
											v-model="row.unitPriceIncludingTax"
											placeholder="请输入含税单价"
											@change="
												() => {
													handleChangePrice(
														row,
														'unitPriceIncludingTax',
														'ladder'
													);
												}
											"
										>
											<template #suffix></template>
										</el-input>
									</template>
								</el-table-column>
								<el-table-column
									prop="returnUnitPriceTax"
									:label="$t('单品可退税金额')"
								>
									<template #default="{ row }">
										<el-input
											v-model="row.returnUnitPriceTax"
											placeholder="请输入单品可退税金额"
											disabled
										>
											<template #suffix></template>
										</el-input>
									</template>
								</el-table-column>
								<el-table-column :label="$t('操作')">
									<template #default="{ row, $index: rowIndex }">
										<el-button
											:icon="Plus"
											@click="handleAddOrDelete(row, rowIndex, 'add')"
										/>
										<el-button
											:icon="Minus"
											@click="handleAddOrDelete(row, rowIndex, 'delete')"
										/>
									</template>
								</el-table-column>
							</el-table>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item label="报价备注" prop="quoteRemark">
							<el-input
								v-model="formData.quoteRemark"
								maxlength="1024"
								show-word-limit
								placeholder="报价备注"
								type="textarea"
								:autosize="{ minRows: 2, maxRows: 2 }"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item label="附件" prop="file">
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
import { Minus, Plus } from '@element-plus/icons-vue';
import { getAllSkuList } from '/@/api/product/sku';
// import { t } from '@wangeditor/editor';
const props = defineProps({
	title: { type: String, default: '添加仓库' },
	currentRow: { type: Object, default: () => ({}) }, // 当前编辑的数据
	visibleType: { type: String, default: '' }, // 弹窗类型
	dictMap: { type: Object, default: () => ({}) }, // 字典数据
});
const emit = defineEmits(['closeDialog', 'save']);

// 加载
const loading = ref(false);
// 当前sku的下拉框选项
const skuOptions = ref<any[]>([]);

// form表单
const formRef = ref();
const formData = ref<any>({
	ladderFlag: 0, // 是否梯度报价
	ladderList: [], // 梯度报价列表
});
// 校验规则
const rules = ref({
	supplierNo: [{ required: true, message: '供应商不能为空', trigger: 'blur' }],
	purchaseUserId: [
		{ required: true, message: '采购员不能为空', trigger: 'blur' },
	],
	planUserId: [{ required: true, message: '主计划不能为空', trigger: 'blur' }],
	minimumOrder: [
		{ required: true, message: '最小起订量不能为空', trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				// 不能有分数：这里的 value 可能是 string / number，需要做数值化再判断
				const num = Number(value);
				if (!Number.isFinite(num) || num < 1) {
					callback(new Error('最小起订量必须是数字且大于等于1'));
					return;
				}
				if (!Number.isInteger(num)) {
					callback(new Error('最小起订量不能有分数'));
					return;
				}
				callback();
			},
		},
	],
	purchaseDeliveryDays: [
		{ required: true, message: '采购交期不能为空', trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				// 不能有分数：这里的 value 可能是 string / number，需要做数值化再判断
				const num = Number(value);
				if (!Number.isFinite(num) || num < 1) {
					callback(new Error('采购交期必须是数字且大于等于1'));
					return;
				}
				if (!Number.isInteger(num)) {
					callback(new Error('采购交期不能有分数'));
					return;
				}
				callback();
			},
		},
	],
	skuCode: [
		{ required: true, message: 'sku/产品名称不能为空', trigger: 'blur' },
	],
	wrapperFlag: [
		{ required: false, message: '是否含包材不能为空', trigger: 'blur' },
	],
	currency: [{ required: false, message: '币种不能为空', trigger: 'blur' }],
	effectiveTaxRate: [
		{ required: false, message: '实际税率不能为空', trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				if (value < 0 || value > 99.99) {
					callback(new Error('实际税率必须在0-99.99之间'));
				} else if (isNaN(value)) {
					formData.value.effectiveTaxRate = '';
				} else {
					callback();
				}
			},
		},
	],
	invoiceType: [
		{ required: false, message: '发票类型不能为空', trigger: 'blur' },
	],
	couponRate: [
		{ required: false, message: '票面税率不能为空', trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				if (value < 0 || value > 99.99) {
					callback(new Error('票面税率必须在0-99.99之间'));
				} else if (isNaN(value)) {
					formData.value.couponRate = '';
				} else {
					callback();
				}
			},
		},
	],
	taxRefundRate: [
		{ required: false, message: '退税率不能为空', trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				if (value < 0 || value > 99.99) {
					callback(new Error('退税率必须在0-99.99之间'));
				} else if (isNaN(value)) {
					formData.value.taxRefundRate = '';
					callback(new Error('退税率必须是数字'));
				} else {
					callback();
				}
			},
		},
	],
	ladderFlag: [
		{ required: false, message: '是否梯度报价不能为空', trigger: 'blur' },
	],
	unitPriceWithoutTax: [
		{ required: false, message: '不含税单价不能为空', trigger: 'blur' },
	],
	unitPriceIncludingTax: [
		{ required: false, message: '含税单价不能为空', trigger: 'blur' },
	],
});
// 打开弹窗
const handleOpen = async () => {
	if (props.visibleType === 'edit') {
		editInit(formData, props.currentRow);
		// 修正退税率是否必填
		changeInvoiceType(formData.value.invoiceType);
		// 回显退税率
		formData.value.taxRefundRate = props.currentRow.taxRefundRate;
		// 回显票面税率
		formData.value.returnUnitPriceTax = props.currentRow.returnUnitPriceTax;
		handleChangePrice(formData.value, 'unitPriceWithoutTax', 'form');
		handleChangePrice(formData.value, 'unitPriceIncludingTax', 'form');
	} else if (props.visibleType === 'add') {
		// 重置表单
		addInit(formData, formRef);
	}
};

// 关闭弹窗
const handleClose = () => {
	emit('closeDialog');
};

// 提交
const onSubmit = async () => {
	if (!formRef.value) return;
	// 校验表单
	const valid = await formRef.value.validate();
	if (!valid) return;

	loading.value = true;
	try {
		await addFormInit(
			formData,
			props.visibleType,
			props.currentRow,
			handleClose
		);
	} catch (error: any) {
		useMessage().error(error.msg || '操作失败，请稍后重试');
	} finally {
		loading.value = false;
	}
};

// 添加或删除梯度报价行
const handleAddOrDelete = (
	row: any,
	rowIndex: number,
	action: 'add' | 'delete'
) => {
	if (action === 'add') {
		// 保持原有添加逻辑（已正确）
		const lastRow =
			formData.value.ladderList[formData.value.ladderList.length - 1];
		if (!lastRow || !lastRow.maxNum) {
			useMessage().warning('请先填写最后一行的结束数量');
			return;
		}
		// 判断最后行的结束数量必须大于等于起始数量
		if (
			isNaN(Number(lastRow.maxNum)) ||
			Number(lastRow.maxNum) < Number(lastRow.minNum)
		) {
			useMessage().warning('结束数量必须大于等于起始数量');
			return;
		}
		if (formData.value.ladderList.length) {
			formData.value.ladderList.push({
				id: Date.now(),
				minNum: Number(lastRow.maxNum) + 1, // 简化逻辑（原逻辑已处理空值）
				maxNum: '',
				unitPriceWithoutTax: '',
				taxRate: '',
				unitPriceIncludingTax: '',
				returnUnitPriceTax: '',
			});
		}
	} else if (action === 'delete') {
		// 核心修复：删除逻辑优化
		const currentList = formData.value.ladderList;

		// 校验1：至少保留一行
		if (currentList.length <= 1) {
			useMessage().warning('至少保留一行梯度报价');
			return;
		}

		// 记录被删除行的关键信息（删除前获取）
		// const deletedRow = currentList[rowIndex];
		const isDeleteFirstRow = rowIndex === 0; // 是否删除首行
		const hasNextRow = rowIndex < currentList.length - 1; // 是否有下一行

		// 执行删除操作
		currentList.splice(rowIndex, 1);

		// 修复点1：处理删除后剩余行的起始数量（minNum）连续性
		if (hasNextRow) {
			const nextRowIndex = rowIndex; // 删除后下一行的索引（原rowIndex+1的行前移到rowIndex位置）
			const nextRow = currentList[nextRowIndex];

			if (isDeleteFirstRow) {
				// 场景：删除首行 → 新首行的minNum重置为1
				nextRow.minNum = 1;
			} else {
				// 场景：删除中间行 → 下一行的minNum = 前一行的maxNum + 1
				const prevRow = currentList[nextRowIndex - 1]; // 前一行（删除后索引不变）

				// 校验2：前一行必须有有效maxNum才能自动填充
				if (
					prevRow.maxNum === undefined ||
					prevRow.maxNum === null ||
					prevRow.maxNum === '' ||
					isNaN(Number(prevRow.maxNum)) ||
					!Number.isInteger(Number(prevRow.maxNum))
				) {
					// useMessage().warning('请先填写前一行的结束数量');
					return; // 阻止删除（或根据业务需求决定是否继续）
				}

				nextRow.minNum = Number(prevRow.maxNum) + 1;
			}
		}

		// 修复点2：可选（根据业务需求）→ 清除被删除行的关联数据（如无强依赖可省略）
		// deletedRow.id = null;
	}
};
// 修改结束数量时
const handelChangeMaxNum = (row: any, rowIndex: number) => {
	// 确保输入的值都是正数
	if (isNaN(row.maxNum) || row.maxNum < 0) {
		useMessage().warning(`结束数量必须是数字且大于等于0`);
		// 如果输入的值不合法，直接返回
		row.maxNum = '';
		return;
	}
	if (!row.maxNum) {
		// 如果输入的值为空清空
		row.maxNum = '';
		// 清空其他相关字段
		if (rowIndex < formData.value.ladderList.length - 1) {
			formData.value.ladderList[rowIndex + 1].minNum = '';
		}
		return;
	}
	// 判断结束数量必须大于等于起始数量
	if (Number(row.maxNum) < Number(row.minNum)) {
		useMessage().warning('结束数量必须大于等于起始数量');
		row.maxNum = '';
		return;
	}
	// 如果不是最后一行，更新下一行的起始数量
	if (rowIndex < formData.value.ladderList.length - 1) {
		formData.value.ladderList[rowIndex + 1].minNum = Number(row.maxNum) + 1;
	}
	// 不能大于999999999
	if (Number(row.maxNum) > 999999999) {
		useMessage().warning('结束数量不能大于999999999');
		row.maxNum = '';
		return;
	}
	// 确保是整数
	if (!Number.isInteger(Number(row.maxNum))) {
		useMessage().warning('结束数量必须是整数');
		row.maxNum = '';
		return;
	}
	// 最后确保是数字类型
	row.maxNum = Number(row.maxNum);
};

// 当选择发票类型时
const changeInvoiceType = async (val: string) => {
	if (val === 'special') {
		formData.value.taxRefundRate = 0;
		formData.value.returnUnitPriceTax = 0;
		// 如果是专票就必填退税率
		rules.value.taxRefundRate = [
			{ required: false, message: '退税率不能为空', trigger: 'blur' },
			{
				validator: (rule: any, value: any, callback: any) => {
					if (value < 0 || value > 99.99) {
						callback(new Error('退税率必须在0-99.99之间'));
					} else if (isNaN(value)) {
						formData.value.taxRefundRate = '';
						callback(new Error('退税率必须是数字'));
					} else {
						callback();
					}
				},
			},
		];
	} else {
		formData.value.taxRefundRate = 0;
		formData.value.returnUnitPriceTax = 0;
		// 如果不是专票就不必填退税率
		rules.value.taxRefundRate = [];
	}
	if (val === 'other') {
		// 发票类型为其他的时候非必填，专票和普票必填
		rules.value.couponRate = [];
	} else {
		rules.value.couponRate = [
			{ required: false, message: '票面税率不能为空', trigger: 'blur' },
			{
				validator: (rule: any, value: any, callback: any) => {
					if (value < 0 || value > 99.99) {
						callback(new Error('票面税率必须在0-99.99之间'));
					} else if (isNaN(value)) {
						formData.value.couponRate = '';
					} else {
						callback();
					}
				},
			},
		];
	}
	// 等待100毫秒，确保UI更新
	await new Promise((resolve) => setTimeout(resolve, 10));
	// 清空所有的校验
	formRef.value.clearValidate();
};

// 当价格出现变化的时候
const handleChangePrice = (row: any, field: string, type: string) => {
	// 确保输入的值都是正数
	if (isNaN(row[field]) || row[field] < 0) {
		useMessage().warning(`必须是数字且大于等于0`);
		// 如果输入的值不合法，直接返回
		row[field] = '';
		return;
	}
	if (!row[field]) {
		// 如果输入的值为空清空
		row[field] = '';
		// 清空其他相关字段
		if (field === 'unitPriceWithoutTax') {
			row.unitPriceIncludingTax = '';
			row.tax = '';
			row.returnUnitPriceTax = '';
		} else if (field === 'unitPriceIncludingTax') {
			row.unitPriceWithoutTax = '';
			row.tax = '';
			row.returnUnitPriceTax = '';
		}
		return;
	}
	if (type === 'form') {
		// 表单内变化
		// 不含税单价计算 更新规则：含税单价=不含税单价*（1+实际税率）
		if (field === 'unitPriceWithoutTax') {
			// 确保 已经存在税率和输入的是数字
			if (!formData.value.effectiveTaxRate) {
				useMessage().error('请先填写实际税率');
				return;
			}
			if (isNaN(row.unitPriceWithoutTax)) {
				useMessage().error('不含税单价必须是数字');
				return;
			}
			// 如果是专票就必填退税率
			if (formData.value.invoiceType === 'special') {
				if (!formData.value.taxRefundRate) {
					useMessage().error('退税率不能为空');
					return;
				}
			}
			// 先给不含税单价赋值
			row.unitPriceWithoutTax = parseFloat(row.unitPriceWithoutTax).toFixed(2);
			// 计算含税单价和税额 含税单价=不含税单价*（1+实际税率）
			row.unitPriceIncludingTax = (
				row.unitPriceWithoutTax *
				(1 + formData.value.effectiveTaxRate / 100)
			).toFixed(2);
			// 税额计算 更新规则：税额=不含税单价*实际税率
			row.tax = (
				(row.unitPriceWithoutTax * formData.value.effectiveTaxRate) /
				100
			).toFixed(2);
			// 单品可退税额=不含税单价*退税率
			if (formData.value.invoiceType === 'special') {
				row.returnUnitPriceTax = (
					(row.unitPriceWithoutTax * formData.value.taxRefundRate) /
					100
				).toFixed(2);
			}
		} else if (field === 'unitPriceIncludingTax') {
			if (!formData.value.effectiveTaxRate) {
				useMessage().error('请先填写实际税率');
				return;
			}
			if (isNaN(row.unitPriceIncludingTax)) {
				useMessage().error('含税单价必须是数字');
				return;
			}
			// 如果是专票就必填退税率
			if (formData.value.invoiceType === 'special') {
				if (!formData.value.taxRefundRate) {
					useMessage().error('退税率不能为空');
					return;
				}
			}
			// 先给含税单价赋值
			row.unitPriceIncludingTax = parseFloat(row.unitPriceIncludingTax).toFixed(
				2
			);
			// 含税单价计算 更新规则：不含税单价=含税单价/(1+实际税率)
			row.unitPriceWithoutTax = (
				row.unitPriceIncludingTax /
				(1 + formData.value.effectiveTaxRate / 100)
			).toFixed(2);
			// 税额计算 更新规则：税额=不含税单价*实际税率
			row.tax = (
				(row.unitPriceWithoutTax * formData.value.effectiveTaxRate) /
				100
			).toFixed(2);
			// 单品可退税额=不含税单价*退税率
			if (formData.value.invoiceType === 'special') {
				row.returnUnitPriceTax = (
					(row.unitPriceWithoutTax * formData.value.taxRefundRate) /
					100
				).toFixed(2);
			}
		}
	} else if (type === 'ladder') {
		// 梯度报价内变化
		// 不含税单价计算 更新规则：含税单价=不含税单价*（1+实际税率）
		if (field === 'unitPriceWithoutTax') {
			// 确保 已经存在税率和输入的是数字
			if (!formData.value.effectiveTaxRate) {
				useMessage().error('请先填写实际税率');
				return;
			}
			if (isNaN(row.unitPriceWithoutTax)) {
				useMessage().error('不含税单价必须是数字');
				return;
			}
			// 如果是专票就必填退税率
			if (formData.value.invoiceType === 'special') {
				if (!formData.value.taxRefundRate) {
					useMessage().error('退税率不能为空');
					return;
				}
			}
			// 先给不含税单价赋值
			row.unitPriceWithoutTax = parseFloat(row.unitPriceWithoutTax).toFixed(2);
			// 计算含税单价和税额  含税单价=不含税单价*（1+实际税率）
			row.unitPriceIncludingTax = (
				row.unitPriceWithoutTax *
				(1 + formData.value.effectiveTaxRate / 100)
			).toFixed(2);
			// 税额计算 更新规则：税额=不含税单价*实际税率
			row.taxRate = (
				(row.unitPriceWithoutTax * formData.value.effectiveTaxRate) /
				100
			).toFixed(2);
			// 单品可退税额=不含税单价*退税率
			if (formData.value.invoiceType === 'special') {
				row.returnUnitPriceTax = (
					(row.unitPriceWithoutTax * formData.value.taxRefundRate) /
					100
				).toFixed(2);
			}
		} else if (field === 'unitPriceIncludingTax') {
			if (!formData.value.effectiveTaxRate) {
				useMessage().error('请先填写实际税率');
				return;
			}
			if (isNaN(row.unitPriceIncludingTax)) {
				useMessage().error('含税单价必须是数字');
				return;
			}
			// 如果是专票就必填退税率
			if (formData.value.invoiceType === 'special') {
				if (!formData.value.taxRefundRate) {
					useMessage().error('退税率不能为空');
					return;
				}
			}
			// 先给含税单价赋值
			row.unitPriceIncludingTax = parseFloat(row.unitPriceIncludingTax).toFixed(
				2
			);
			// 含税单价计算 更新规则：不含税单价=含税单价/(1+实际税率)
			row.unitPriceWithoutTax = (
				row.unitPriceIncludingTax /
				(1 + formData.value.effectiveTaxRate / 100)
			).toFixed(2);
			// 税额计算 更新规则：税额=不含税单价*实际税率
			row.taxRate = (
				(row.unitPriceWithoutTax * formData.value.effectiveTaxRate) /
				100
			).toFixed(2);
			// 单品可退税额=不含税单价*退税率
			if (formData.value.invoiceType === 'special') {
				row.returnUnitPriceTax = (
					(row.unitPriceWithoutTax * formData.value.taxRefundRate) /
					100
				).toFixed(2);
			}
		}
	}
};

// 当退税率和税率变化时，确保实际税率大于等于退税率
const handleTaxRateChange = () => {
	if (
		Number(formData.value.effectiveTaxRate) <
		Number(formData.value.taxRefundRate)
	) {
		useMessage().error('实际税率必须大于等于退税率');
		formData.value.taxRefundRate = formData.value.effectiveTaxRate;
	}
	// 当税率变化时，清空梯度报价列表中的税额和单品可退税额
	if (formData.value.ladderFlag === 0) {
		// 清空梯度报价列表中的税额和单品可退税额
		formData.value.unitPriceWithoutTax = null;
		formData.value.tax = null;
		formData.value.unitPriceIncludingTax = null;
		formData.value.returnUnitPriceTax = null;
	} else if (formData.value.ladderFlag === 1) {
		formData.value.ladderList?.forEach((item: any) => {
			item.unitPriceWithoutTax = null;
			item.taxRate = null;
			item.unitPriceIncludingTax = null;
			item.returnUnitPriceTax = null;
		});
	}
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
