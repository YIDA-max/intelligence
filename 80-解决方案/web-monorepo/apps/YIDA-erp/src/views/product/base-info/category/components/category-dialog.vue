<template>
	<el-dialog
		@open="initDialog"
		:title="props.title"
		width="30%"
		:close-on-click-modal="false"
		draggable
	>
		<el-form
			ref="dataFormRef"
			:model="form"
			:rules="dataRules"
			label-width="100px"
			v-loading="loading"
		>
			<el-form-item>
				<template #label>
					<div class="flex items-center">
						<span>上级类目</span>
						<el-tooltip
							class="box-item"
							effect="dark"
							content="此项不选表示一级"
							placement="top"
						>
							<el-icon size="16"><QuestionFilled /></el-icon>
						</el-tooltip>
					</div>
				</template>
				<el-select
					v-model="form.id"
					filterable
					placeholder="请选择"
					style="width: 100%"
				>
					<el-option
						v-for="item in options"
						:key="item.id"
						:label="item.name"
						:value="item.id"
					></el-option>
					<el-option
						v-if="options.length === 0"
						:label="t('暂无数据')"
						:value="-1"
						disabled
					/>
				</el-select>
			</el-form-item>
			<el-form-item :label="t('类目代码')" prop="categoryCode">
				<el-input
					v-model="form.categoryCode"
					:placeholder="t('请输入类目代码')"
					:disabled="
						props.visibleType === 'view' || props.visibleType === 'edit'
					"
				/>
			</el-form-item>
			<el-form-item :label="t('类目名称')" prop="categoryName">
				<el-input
					v-model="form.categoryName"
					:placeholder="t('请输入类目名称')"
				/>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="closeDialog">{{
					$t('common.cancelButtonText')
				}}</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">{{
					props.visibleType === 'view'
						? $t('common.viewButtonText')
						: props.visibleType === 'edit'
						? $t('保存')
						: props.visibleType === 'add'
						? $t('添加')
						: ''
				}}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { useMessage } from '/@/hooks/message';
// import {getObj, addObj, putObj} from '/@/api/gen/create-table'
import { useI18n } from 'vue-i18n';
import { rule } from '/@/utils/validate';
// import {useDict} from "/@/hooks/dict";
import { postCategorySave, postCategoryUpdate } from '/@/api/product/category';
const emit = defineEmits(['refresh', 'closeDialog']);

const { t } = useI18n();
const props = defineProps({
	treeData: {
		type: Array<any>,
		default: () => [],
	},
	title: {
		type: String,
		default: () => '',
	},
	visibleType: {
		type: String,
		default: () => '',
	},
	currentRow: {
		type: Object,
		default: () => {},
	},
});

const options = ref<Array<any>>([]);
// 定义变量内容
// form的ref
const dataFormRef = ref();
const loading = ref(false);
// 提交表单数据
const form = ref({
	id: '',
	categoryCode: '',
	categoryName: '',
});

// 定义校验规则
const dataRules = ref({
	categoryCode: [
		{ required: true, message: '类目代码不能为空', trigger: 'blur' },
		{ max: 10, message: '长度在 10 个字符', trigger: 'blur' },
		{ validator: rule.validatorCode, trigger: 'blur' },
	],
	categoryName: [
		{ validator: rule.overLength, trigger: 'blur' },
		{ max: 25, message: '长度在 25 个字符', trigger: 'blur' },
		{
			required: true,
			message: '类目名称不能为空',
			trigger: 'blur',
		},
	],
});
// 初始化
// 弹窗初始化
const initDialog = () => {
	// 赋值上级目录
	options.value = props.treeData;
	if (props.visibleType === 'add') {
		form.value = {
			categoryCode: '',
			categoryName: '',
			id: '',
		};
	} else if (props.visibleType === 'edit') {
		// 判断是否是一级目录,如果是就必须要把上级目录给清空
		if (!props.currentRow.parentCategoryCode) {
			options.value = [];
		}
		form.value = {
			categoryCode: props.currentRow.categoryCode,
			categoryName: props.currentRow.categoryName,
			id: props.currentRow.parentCategoryCode,
		};
	}
};

// 提交
const onSubmit = async () => {
	// 提交数据
	try {
		// 打开加载动画
		loading.value = true;
		const valid = await dataFormRef.value.validate().catch(() => {});
		if (!valid) return false;
		const res =
			props.visibleType == 'add'
				? await postCategorySave({
						// 上级类目
						parentCategoryCode: form.value.id,
						// 类目代码
						categoryCode: form.value.categoryCode,
						// 类目名称
						categoryName: form.value.categoryName,
				  })
				: props.visibleType == 'edit'
				? await postCategoryUpdate({
						// id
						id: props.currentRow.id,
						// 上级类目
						parentCategoryCode: form.value.id,
						// 类目代码
						categoryCode: form.value.categoryCode,
						// 类目名称
						categoryName: form.value.categoryName,
				  })
				: {
						code: 1,
						msg: '',
				  };
		if (res.code === 0) {
			useMessage().success('操作成功');
			// 关闭弹窗
			emit('closeDialog', 'form');
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

const closeDialog = () => {
	// 重置表单
	form.value = {
		id: '',
		categoryCode: '',
		categoryName: '',
	};
	dataFormRef.value?.resetFields();
	emit('closeDialog');
};
</script>
