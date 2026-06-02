<script setup lang="ts">
import { ref } from 'vue';

import { useI18n } from 'vue-i18n';
import {
	getUsersByDepartment,
	postUpdateControlPerson,
} from '/@/api/product/category';
import { useMessage } from '/@/hooks/message';
const { t } = useI18n();
const emit = defineEmits(['getDataList']);
//   初始化数据

const SelectInputApi = defineAsyncComponent(
	() => import('/@/componentsApi/SelectInputApi/index.vue')
);
const dialogRef = ref<any | null>(null);
// 弹窗显示与否
const dialogVisible = ref(false);
const ids = ref<string[]>([]);
const formData = ref<Record<string, any>>({ userId: '' });
const formRef = ref<any>(null);
const rules = ref({
	userId: [{ required: true, message: '请选择物控负责人', trigger: 'blur' }],
});

/**
 * 初始化
 */
const init = () => {
	// 清空表单
	formData.value = { userId: '' };
};
/**
 * 确定
 */
const onSubmit = async () => {
	const valid = await formRef.value.validate();
	if (!valid) return;
	const res = await postUpdateControlPerson({
		ids: ids.value,
		userId: formData.value.userId,
	});
	if (res.code === 0) {
		useMessage().success(t('更新物控成功'));
		hide();
		emit('getDataList');
	}
};
/**
 * 打开弹窗方法
 * 供父组件调用
 */
const show = (e: string[] = []) => {
	ids.value = e;
	dialogVisible.value = true;
};

/**
 * 关闭弹窗方法
 * 供父组件调用
 */
const hide = () => {
	dialogVisible.value = false;
};

// 暴露方法给父组件
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
		@open="init"
		@close="hide"
		:title="t('更新物控负责人')"
		:style="{
			height: '200px',
		}"
	>
		<div>
			<el-form :model="formData" :rules="rules" ref="formRef">
				<el-form-item :label="t('物控负责人')" prop="userId">
					<!-- <el-select v-model="formData.userId" placeholder="请选择物控负责人">
						<el-option
							v-for="item in dictMap.materialControlList"
							:key="item.userId"
							:label="item.name"
							:value="item.userId"
						/>
					</el-select> -->

					<SelectInputApi
						v-model="formData.userId"
						:showInputSearch="false"
						placeholder="请选择物控负责人物控负责人"
						:settings="{
							getTreeData: getUsersByDepartment,
							text: '物控负责人',
							selectTreeProps: {
								value: 'userId',
								label: 'name',
							},
							getIdsCode: 'userId',
						}"
					/>
				</el-form-item>
			</el-form>
		</div>
		<template #footer>
			<div style="text-align: right">
				<el-button @click="hide">{{ t('取消') }}</el-button>
				<el-button type="primary" @click="onSubmit">{{ t('确定') }}</el-button>
			</div>
		</template>
	</el-dialog>
</template>

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
