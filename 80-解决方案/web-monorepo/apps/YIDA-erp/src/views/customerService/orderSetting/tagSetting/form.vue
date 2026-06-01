<template>
	<el-dialog
		:title="state.ruleForm.id ? $t('common.editBtn') : $t('common.addBtn')"
		v-model="visible"
		width="600"
		:close-on-click-modal="false"
		draggable
	>
		<el-form
			ref="menuDialogFormRef"
			:model="state.ruleForm"
			:rules="dataRules"
			label-width="100px"
			v-loading="loading"
		>
			<el-form-item :label="$t('标签类型')" prop="tagLevel">
				<el-radio-group
					v-model="state.ruleForm.tagLevel"
					:disabled="!!state.ruleForm.id"
				>
					<el-radio :label="1">一级标签</el-radio>
					<el-radio :label="2">二级标签</el-radio>
					<el-radio :label="3">三级标签</el-radio>
					<el-radio :label="4">四级标签</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item
				:label="$t('上级标签')"
				prop="parentId"
				v-if="state.ruleForm.tagLevel !== 1"
			>
				<el-select
					v-model="state.ruleForm.parentId"
					class="w100"
					clearable
					:placeholder="$t('请选择')"
					filterable
				>
					<el-option
						v-for="item in state.parentData"
						:key="item.id"
						:label="item.tagName"
						:value="item.id"
					/>
				</el-select>
			</el-form-item>
			<el-form-item :label="$t('标签名称')" prop="tagName">
				<el-input
					v-model="state.ruleForm.tagName"
					clearable
					maxlength="100"
					show-word-limit
					:placeholder="$t('请输入标签名称')"
				></el-input>
			</el-form-item>
			<el-form-item :label="$t('排序')" prop="sort">
				<el-input-number
					v-model="state.ruleForm.sort"
					:min="0"
					controls-position="right"
				/>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{
					$t('common.cancelButtonText')
				}}</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">{{
					$t('common.confirmButtonText')
				}}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="systemMenuDialog">
import { useI18n } from 'vue-i18n';
import { useMessage } from '/@/hooks/message';
import {
	getAllTag,
	postTagSave,
	postOrderUpdate,
	tagDetail,
} from '/@/api/customerService/orderSetting/index';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const { t } = useI18n();

// 定义变量内容
const visible = ref(false);
const loading = ref(false);
const menuDialogFormRef = ref();
// 定义需要的数据
const state = reactive({
	ruleForm: {
		id: '',
		tagLevel: 1,
		tagName: '',
		parentId: null,
		sort: 0,
	},
	parentData: [] as any[], // 上级菜单数据
});

// 表单校验规则
const dataRules = reactive({
	tagLevel: [{ required: true, message: '标签类型不能为空', trigger: 'blur' }],
	parentId: [{ required: true, message: '上级标签不能为空', trigger: 'blur' }],
	tagName: [
		{
			required: true,
			message: '标签名称不能为空',
			trigger: 'blur',
		},
	],
	sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
});

// 监听 tagLevel 变化，获取对应的上级标签数据
watch(
	() => state.ruleForm.tagLevel,
	(val) => {
		// 一级标签不需要上级标签
		if (val === 1) {
			state.ruleForm.parentId = null;
			state.parentData = [];
			return;
		}

		// 如果是新增或编辑且已经有 parentId (防止初始化时被清空)，先不重置
		// 但如果是手动切换 tagLevel，应该重置 parentId
		if (visible.value && !state.ruleForm.id) {
			state.ruleForm.parentId = null;
		}

		// 获取上级标签列表 (当前层级 - 1)
		getParentTags(val - 1);
	}
);

// 获取上级标签数据
const getParentTags = async (level: number) => {
	try {
		const res = await getAllTag({
			tagLevel: level,
			status: 1, // 1 启用 0禁用
		});
		if (res.code === 200 || res.code === 0) {
			state.parentData = res.data || [];
		}
	} catch (error) {
		useMessage().error('获取上级标签失败，请稍后重试');
	}
};

// 打开弹窗
const openDialog = (type: string, row?: any) => {
	state.ruleForm.id = '';
	visible.value = true;
	state.parentData = [];

	nextTick(async () => {
		menuDialogFormRef.value?.resetFields();
		if (type === 'edit' && row) {
			const res = await tagDetail({
				id: row.id,
			});
			state.ruleForm.id = res.data.id;
			state.ruleForm.tagLevel = res.data.tagLevel;
			state.ruleForm.tagName = res.data.tagName;
			state.ruleForm.sort = res.data.sort;
			state.ruleForm.parentId = res.data.parentId;

			// 如果不是一级标签，需要获取上级标签列表以供回显
			if (res.data.tagLevel > 1) {
				getParentTags(res.data.tagLevel - 1);
			}
		} else {
			// 新增模式
			state.ruleForm.tagLevel = 1;
			state.ruleForm.parentId = null;
		}
	});
};

// 保存数据
const onSubmit = async () => {
	const valid = await menuDialogFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	// 一级标签的 parentId 设为 -1
	if (state.ruleForm.tagLevel === 1) {
		state.ruleForm.parentId = null;
	}
	let api = state.ruleForm.id ? postOrderUpdate : postTagSave;

	try {
		loading.value = true;
		const res = await api(state.ruleForm);
		if (res.code === 200 || res.code === 0) {
			useMessage().success(
				t(
					state.ruleForm.id ? 'common.editSuccessText' : 'common.addSuccessText'
				)
			);
			visible.value = false;
			emit('refresh');
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

// 暴露变量 只有暴漏出来的变量 父组件才能使用
defineExpose({
	openDialog,
});
</script>
