<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-24 14:28:53
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-08-06 16:53:57
 * @FilePath: \qianyi-ui\src\views\warehouse\warehouseInfo\thirdWarehouse\components\sp-info\components\auth-edit-sp.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { useMessage } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import {
	getSpDockConfigGetSpConfigList,
	postSpInfoUpdate,
} from '/@/api/warehouse/spInfo/index';
import { ref } from 'vue';

const emit = defineEmits(['closeDialog']);

const props = defineProps({
	currentSpInfo: {
		type: Object,
		default: () => ({}),
	},
});
const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const loading = ref(false);

// 提交表单数据
const form = ref({
	spName: '',
	dockCode: '',
	customerCode: '',
	authCode: '',
	appKey: '',
	appToken: '',
	appSecret: '',
});

// 当前可对接的服务商列表
const spConnectList = ref([]);

// 当前选中的授权服务商的信息
const authConfig = ref();

// 仓库列表信息
const warehouseInfoArr = ref([]);

// 定义校验规则
const dataRules = ref({
	spName: [
		{
			required: true,
			message: '服务商名称不能为空',
			trigger: 'blur',
		},
	],
});

// 弹窗初始化
const initDialog = async () => {
	// 清空校验
	dataFormRef.value.clearValidate();
	// 回显授权服务商信息
	authConfig.value = props.currentSpInfo;
	// 回显用户仓库列表
	warehouseInfoArr.value = props.currentSpInfo.warehouseInfoList || [];
	// 回显用户信息
	form.value = {
		spName: props.currentSpInfo.spName || '',
		dockCode: props.currentSpInfo.dockCode,
		customerCode: props.currentSpInfo.authInfo.customerCode || '',
		authCode: props.currentSpInfo.authInfo.authCode || '',
		appKey: props.currentSpInfo.authInfo.appKey || '',
		appToken: props.currentSpInfo.authInfo.appToken || '',
		appSecret: props.currentSpInfo.authInfo.appSecret || '',
	};
	try {
		// 查询线上可对接的服务商
		const res = await getSpDockConfigGetSpConfigList();
		if (res.code === 0) {
			spConnectList.value = res.data || [];
		}
	} catch (error: any) {
		useMessage().error(error.msg || '获取可对接服务商列表失败');
	}
};

// 提交授权
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		loading.value = true;
		// 开始确定提交数据
		try {
			const res = await postSpInfoUpdate({
				id: props.currentSpInfo.id,
				spName: form.value.spName,
			});
			if (res.code === 0) {
				useMessage().success('成功');
				emit('closeDialog');
			}
		} catch (error: any) {
			useMessage().error(error.msg || '授权失败，请稍后重试');
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

const closeDialog = () => {
	emit('closeDialog');
};
</script>
<template>
	<el-dialog
		width="60%"
		:close-on-click-modal="false"
		draggable
		@open="initDialog"
		:title="$t('编辑服务商')"
	>
		<el-form
			ref="dataFormRef"
			:model="form"
			:rules="dataRules"
			label-width="100px"
			v-loading="loading"
		>
			<el-form-item :label="t('服务商名称')" prop="spName">
				<el-input
					v-model="form.spName"
					:placeholder="t('请输入')"
					maxlength="30"
				/>
			</el-form-item>
			<el-form-item :label="t('对接服务商')" prop="dockCode">
				<el-select
					v-model="form.dockCode"
					placeholder="请选择对接服务商"
					:disabled="true"
				>
					<el-option
						v-for="item in spConnectList"
						:key="item.id"
						:label="item.dockName"
						:value="item.dockCode"
					/>
				</el-select>
			</el-form-item>
			<el-form-item
				v-for="(config, key) in authConfig?.authConfig"
				:key="key"
				:label="config?.label"
				:prop="key"
			>
				<el-input
					v-model="form[key]"
					:placeholder="t('请输入')"
					:disabled="true"
					:value="form[key] || '***************'"
				/>
			</el-form-item>
			<!-- 本地服务商查的仓库列表 -->
			<el-form-item
				:label="t('仓库配对')"
				v-if="warehouseInfoArr.length && warehouseInfoArr.length > 0"
			>
				<el-table
					:data="warehouseInfoArr"
					style="width: 100%"
					border
					row-key="id"
					native-scrollbar
				>
					<el-table-column prop="warehouseName" :label="t('仓库名称')" />
					<el-table-column prop="warehouseCode" :label="t('仓库代码')" />
					<el-table-column prop="spWhCode" :label="t('服务商仓库')">
						<template #default="scope">
							{{ scope.row.spWhCode || '---' }}
						</template>
					</el-table-column>
				</el-table>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="closeDialog">{{
					$t('common.cancelButtonText')
				}}</el-button>
				<el-button type="primary" @click="onSubmit">{{ $t('确定') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>
