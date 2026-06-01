<!--
 * @Author: 朱寒松 3136271519@qq.com
 * @Date: 2025-07-24 14:28:53
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-04-22 17:44:21
 * @FilePath: \qianyi-ui\src\views\warehouse\warehouseInfo\thirdWarehouse\components\sp-info\components\auth-sp.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { useMessage } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import {
	getSpDockConfigGetSpConfigList,
	getWarehouseListBySpId,
	getSpWarehouseSyncWarehouse,
	postSpInfoAuth,
	postSpInfoFastMapping,
} from '/@/api/warehouse/spInfo/index';
import other from '/@/utils/other';
import { ref } from 'vue';

const emit = defineEmits(['closeDialog']);

interface ISpConnectItem {
	id: string;
	dockName: string;
	authConfig?: Record<
		string,
		{
			label?: string;
			url?: string;
			encryptFlag?: string;
		}
	>;
}

interface IDockWarehouseItem {
	id: string | number;
	spWhName: string;
	spWhCode: string;
}

interface IWarehouseInfoItem {
	id?: string | number;
	warehouseName?: string;
	warehouseCode?: string;
	dockCode?: string;
}

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
const form = ref<{ [key: string]: string }>({
	spName: '',
	dockCode: '',
	customerCode: '',
	authCode: '',
	appKey: '',
	appToken: '',
	appSecret: '',
});
// 当前的客户代码等配对是否禁用
const isDisabled = ref(false);
// 当前可对接的服务商列表
const spConnectList = ref<ISpConnectItem[]>([]);

// 当前选中的授权服务商的信息
const authConfig = ref<ISpConnectItem | Record<string, any>>({});

// 当前服务商是否有仓库的信息
const warehouseInfoArr = ref<IWarehouseInfoItem[]>([]);

// 对接服务商的代码的arr
const dockCodeArr = ref<IDockWarehouseItem[]>([]);

// 动态生成验证规则
const rules = ref({
	spName: [{ required: true, message: '服务商名称不能为空', trigger: 'blur' }],
	dockCode: [
		{ required: true, message: '对接服务商不能为空', trigger: 'change' },
	],
});

// 弹窗初始化
const initDialog = async () => {
	// 清空当前的服务商信息
	// 清空禁用
	isDisabled.value = false;
	form.value = {
		spName: props.currentSpInfo.spName || '',
		dockCode: '',
		customerCode: '',
		authCode: '',
		appKey: '',
		appToken: '',
		appSecret: '',
	};
	// 清空当前的授权配置
	authConfig.value = {};
	// 清空当前的仓库信息
	warehouseInfoArr.value = [];
	// 清空对接服务商的代码
	dockCodeArr.value = [];
	// 清空当前的可对接服务商列表
	spConnectList.value = [];
	// 等待10毫秒，确保UI更新
	await new Promise((resolve) => setTimeout(resolve, 10));
	// 清空所有的校验
	dataFormRef.value.clearValidate();
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
// 加密函数
const encrypt = (value: string) => {
	if (!value) return '';
	return other.encryption(value, import.meta.env.VITE_PWD_ENC_KEY);
};

// 服务商修改的函数
const onSpChange = async (value: string) => {
	// 根据服务商的代码去查询对应的授权配置
	authConfig.value =
		spConnectList.value.find((item: any) => item.id === value) || {};
	// 动态生成验证规则
	rules.value = {
		spName: [
			{ required: true, message: '服务商名称不能为空', trigger: 'blur' },
		],
		dockCode: [
			{ required: true, message: '对接服务商不能为空', trigger: 'change' },
		],
		...Object.keys(authConfig.value?.authConfig || {}).reduce(
			(acc: any, key) => {
				acc[key] = [
					{ required: true, message: '该字段为必填', trigger: 'blur' },
				];
				return acc;
			},
			{}
		),
	};
	// 等待10毫秒，确保UI更新
	await new Promise((resolve) => setTimeout(resolve, 10));
	// 清空所有的校验
	dataFormRef.value.clearValidate();
	// 清空所有的值
	authConfig.value?.authConfig &&
		Object.keys(authConfig.value.authConfig).forEach((key) => {
			form.value[key] = '';
		});
};
// 提交授权
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		loading.value = true;
		const params: { [key: string]: string } = {};

		// 遍历所有表单字段并将其添加到 params 中
		Object.keys(form.value).forEach((key) => {
			// 根据 authConfig 配置决定是否加密
			const fieldConfig = authConfig.value?.authConfig?.[key];
			if (fieldConfig) {
				params[key] = form.value[key];
				// 如果需要加密，则进行加密
				if (fieldConfig.encryptFlag === 'true') {
					params[key] = encrypt(params[key]);
				}
			}
		});

		// 去除空值
		Object.keys(params).forEach((key) => {
			if (params[key] === '') {
				delete params[key];
			}
		});

		// 开始提交授权
		try {
			const res = await postSpInfoAuth({
				id: props.currentSpInfo.id,
				spDockConfigId: authConfig.value.id,
				authInfo: params,
			});
			if (res.code === 0) {
				useMessage().success('授权成功');
				// 禁用输入框
				isDisabled.value = true;
			} else {
				// 授权失败，不要去查询仓库信息了，因为可能没有仓库信息
				return;
			}
		} catch (error: any) {
			useMessage().error(error.msg || '授权失败，请稍后重试');
			// 不要去查询仓库信息了，因为可能没有仓库信息
			return;
		}
		// 根据自己的服务商的id去查询自己的仓库信息;
		try {
			const warehouseList = await getWarehouseListBySpId({
				spId: props.currentSpInfo.id,
			});
			if (warehouseList.code === 0) {
				warehouseInfoArr.value = warehouseList.data || [];
			}
			// 如果是0就直接关闭
			if (warehouseList.data.length === 0) {
				closeDialog();
			}
		} catch (error: any) {
			useMessage().error(error.msg || '获取仓库列表失败');
		}
		// 查询可对接的仓库代码
		try {
			const res = await getSpWarehouseSyncWarehouse({
				spId: props.currentSpInfo.id,
			});
			if (res.code === 0) {
				dockCodeArr.value = res.data || [];
			}
		} catch (error: any) {
			useMessage().error(error.msg || '获取对接服务商列表失败');
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

// 绑定仓库
const onBind = async () => {
	// 开始绑定仓库
	const params: any = {
		spId: props.currentSpInfo.id,
		// key为系统仓库代码，value为服务商仓库代码
		mappingMap: {},
	};
	warehouseInfoArr.value.forEach((item: any) => {
		if (item.dockCode) {
			params.mappingMap[item.warehouseCode] = item.dockCode;
		}
	});
	// 去除空值
	Object.keys(params.mappingMap).forEach((key) => {
		if (params.mappingMap[key] === '') {
			delete params.mappingMap[key];
		}
	});
	// 如果没有映射关系，就不需要提交
	if (Object.keys(params.mappingMap).length === 0) {
		closeDialog();
		return;
	}
	try {
		const res = await postSpInfoFastMapping(params);
		if (res.code === 0) {
			useMessage().success('绑定成功');
			closeDialog();
		}
	} catch (error: any) {
		useMessage().error(error.msg || '绑定失败，请稍后重试');
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
		:title="$t('授权服务商')"
		@close="closeDialog"
	>
		<el-form
			ref="dataFormRef"
			:model="form"
			:rules="rules"
			label-width="100px"
			v-loading="loading"
		>
			<el-form-item :label="t('服务商名称')" prop="spName">
				<el-input
					v-model="form.spName"
					:placeholder="t('请输入')"
					maxlength="30"
					:disabled="true"
				/>
			</el-form-item>
			<el-form-item :label="t('对接服务商')" prop="dockCode">
				<el-select
					v-model="form.dockCode"
					placeholder="请选择对接服务商"
					@change="
						(e:any) => {
							onSpChange(e)
						}
					"
					:disabled="isDisabled"
				>
					<el-option
						v-for="item in spConnectList"
						:key="item.id"
						:label="item.dockName"
						:value="item.id"
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
					type="password"
					show-password
					:disabled="isDisabled"
				/>
				<!-- 处理具有url的字段 -->
				<el-link
					v-if="config?.url"
					type="primary"
					:href="config?.url"
					target="_blank"
				>
					{{ $t('点击跳转') }}
				</el-link>
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
					<el-table-column prop="dockCode" :label="t('服务商仓库')">
						<template #default="scope">
							<el-select
								v-model="scope.row.dockCode"
								placeholder="请选择服务商仓库"
							>
								<el-option
									v-for="item in dockCodeArr"
									:key="item.id"
									:label="item.spWhName"
									:value="item.spWhCode"
								/>
							</el-select>
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
				<el-button
					type="primary"
					@click="onSubmit"
					:disabled="loading"
					v-if="!isDisabled"
					>{{ $t('授权') }}</el-button
				>
				<el-button type="primary" @click="onBind" v-else>{{
					$t('确定')
				}}</el-button>
			</span>
		</template>
	</el-dialog>
</template>
