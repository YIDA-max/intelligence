<script setup lang="ts">
import { ref, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { batchUpdateOperation } from '/@/api/fbm/selfOrder/index';
import { getUserListByCondition } from '/@/api/admin/user';
import { useMessage } from '/@/hooks/message';
import { useResultDialog } from '/@/hooks/useResultDialog';

const { t } = useI18n();
const { open } = useResultDialog();
const dictMap = inject<any>('dictMap');
const getDataList = inject<() => void>('getDataList');
// 弹窗显示与否
const dialogVisible = ref(false);
// 打开页面传入的ids
const idsList = ref<string[]>([]);
// 表单引用
const formRef = ref();

// 表单数据
const formData = ref({
	deptId: '' as string | number,
	operationUserId: '' as string | number,
});
// 运营人员下拉列表（全量，不按运营小组过滤）
const operationUserOptions = ref<
	Array<{ userId: string | number; name: string }>
>([]);
const rules = ref({
	deptId: [{ required: false, message: '请选择运营小组', trigger: 'change' }],
	operationUserId: [
		{ required: false, message: '请选择运营', trigger: 'change' },
	],
});

const init = async () => {
	formData.value = {
		deptId: '',
		operationUserId: '',
	};
	formRef.value?.resetFields();
	// 弹窗打开时拉取全部运营人员，运营下拉不随运营小组联动
	await loadAllOperationUsers();
};

/**
 * 加载全部运营人员列表
 * 与列表页运营人员筛选项一致，仅传 lockFlag 不按 deptId 过滤
 */
const loadAllOperationUsers = async () => {
	const res = await getUserListByCondition({ lockFlag: 0 });
	if (res.code === 0) {
		operationUserOptions.value = res.data || [];
	}
};

// 先注释：按运营小组联动过滤人员，当前改为使用全量人员列表
// /**
//  * 运营小组改变事件
//  */
// const handleDeptChange = async (deptId: string | number) => {
// 	formData.value.operationUserId = '';
// 	operationUserOptions.value = [];
// 	if (!deptId) return;
// 	const res = await getUserListByCondition({ deptId });
// 	if (res.code === 0) {
// 		operationUserOptions.value = res.data || [];
// 	}
// };

/**
 * 确定
 * 调用接口设置运营人和运营小组
 */
const onSubmit = async () => {
	const valid = await formRef.value?.validate();
	if (!valid) return;
	const res = await batchUpdateOperation({
		ids: idsList.value,
		operationUserId: formData.value.operationUserId,
		deptId: formData.value.deptId,
	});
	if (res.code === 0) {
		if (res.data?.failCount > 0) {
			open({
				title: t('设置运营人和运营小组失败'),
				data: res.data,
			});
		} else {
			useMessage().success('操作成功');
		}
		getDataList?.();
		hide();
	}
};

/**
 * 打开页面传入的ids
 * @param ids
 */
const show = (ids: string[]) => {
	idsList.value = ids;
	dialogVisible.value = true;
};
/**
 * 关闭弹窗
 */
const hide = () => {
	dialogVisible.value = false;
};

defineExpose({
	show,
	hide,
});
</script>

<template>
	<el-dialog
		draggable
		ref="dialogRef"
		v-model="dialogVisible"
		:width="600"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:append-to-body="true"
		:title="t('设置运营人和运营小组')"
		@open="init"
		@close="hide"
	>
		<el-form
			ref="formRef"
			label-position="left"
			:model="formData"
			:rules="rules"
			label-width="90px"
		>
			<el-form-item label="运营小组" prop="deptId">
				<el-cascader
					v-model="formData.deptId"
					placeholder="部门&运营小组"
					style="width: 100%"
					clearable
					:options="dictMap.deptTree"
					filterable
					:props="{
						label: 'name',
						value: 'id',
						emitPath: false,
						checkStrictly: false,
						leafOnly: true,
					}"
				/>
			</el-form-item>
			<el-form-item label="运营" prop="operationUserId">
				<el-select
					v-model="formData.operationUserId"
					clearable
					filterable
					placeholder="请选择运营"
					style="width: 100%"
				>
					<el-option
						v-for="item in operationUserOptions"
						:key="item.userId"
						:label="item.name"
						:value="item.userId"
					/>
				</el-select>
			</el-form-item>
		</el-form>
		<template #footer>
			<div style="text-align: right">
				<el-button @click="hide">{{ t('取消') }}</el-button>
				<el-button type="primary" @click="onSubmit">{{ t('确定') }}</el-button>
			</div>
		</template>
	</el-dialog>
</template>
