<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue';
import { ref, onMounted, defineAsyncComponent } from 'vue';
import {
	getSpInfoList,
	postSpInfoEnable,
	postSpInfoDisable,
} from '/@/api/warehouse/spInfo/index';
import { useMessage } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';
import { auth } from '/@/utils/authFunction';
const AddSp = defineAsyncComponent(() => import('./components/add-sp.vue'));
const AuthSp = defineAsyncComponent(() => import('./components/auth-sp.vue'));
const AuthEditSp = defineAsyncComponent(
	() => import('./components/auth-edit-sp.vue')
);

const props = defineProps({
	setSpInfoValue: {
		type: Function,
		default: () => {},
	},
	refreshData: {
		type: Function,
		default: () => {},
	},
});

// 初始化
onMounted(async () => {
	reloadSpInfo();
});
// 当前服务商的信息
const spInfoArr = ref<any>([]);
// 当前选中的值
const currentSpInfo = ref<any>({});
// 打开添加服务商的弹窗
const addSpDialogVisible = ref(false);
// 添加服务商的状态
const addSpVisibleType = ref('add');

// 打开授权服务商的弹窗
const authSpDialogVisible = ref(false);
// 授权编辑服务商的弹窗
const authEditSpDialogVisible = ref(false);

// 服务商的弹窗
const addSpDialogFn = (type: any, row?: any) => {
	switch (type) {
		case 'add':
			addSpVisibleType.value = 'add';
			addSpDialogVisible.value = true;
			break;
		case 'edit':
			// 编辑服务商，授权和未授权是不一样的
			// 未授权的服务商的编辑页面
			if (row.authStatus === 0) {
				addSpVisibleType.value = 'edit';
				currentSpInfo.value = row;
				addSpDialogVisible.value = true;
			} else if (row.authStatus === 1) {
				// 授权的服务商的编辑页面
				authSpDialogFn('edit', row);
			}
			break;
		case 'close':
			addSpDialogVisible.value = false;
			reloadSpInfo();
			break;
		default:
			break;
	}
};
// 授权服务商的弹窗
const authSpDialogFn = async (type: any, row?: any) => {
	switch (type) {
		case 'add':
			authSpDialogVisible.value = true;
			currentSpInfo.value = row;
			break;
		case 'edit':
			authEditSpDialogVisible.value = true;
			currentSpInfo.value = row;
			// 查询编辑对应的服务商信息
			break;
		case 'close':
			authSpDialogVisible.value = false;
			reloadSpInfo();
			break;
		default:
			break;
	}
};
// 启用停用服务商
const toggleSpStatus = async (spInfo: any) => {
	const action = spInfo.status === 0 ? '启用' : '停用';
	await ElMessageBox.confirm(
		`确定要${action}服务商 ${spInfo.spName} 吗？`,
		'提示',
		{
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: spInfo.status === 0 ? 'success' : 'warning',
		}
	);
	// 调用API进行启用或停用操作
	try {
		if (spInfo.status === 0) {
			await postSpInfoEnable({
				id: spInfo.id,
			});
			useMessage().success('服务商已启用');
		} else {
			await postSpInfoDisable({
				id: spInfo.id,
			});
			useMessage().success('服务商已停用');
		}
	} catch (error: any) {
		useMessage().error(error.msg || '操作失败，请稍后重试');
	} finally {
		reloadSpInfo();
	}
};
// 重新加载服务商信息
const reloadSpInfo = async () => {
	try {
		const res = await getSpInfoList();
		if (res.code === 0) {
			spInfoArr.value = res.data;
			// 刷新父组件的服务商信息
			props.refreshData();
		}
	} catch (error: any) {
		if (error.msg) useMessage().error(error.msg);
	}
};
// 点击设置服务商信息的值
const clickSetSpInfoValue = (value: any) => {
	// 设置当前选中的服务商信息
	currentSpInfo.value = value;
	// 调用父组件的方法设置服务商信息的值
	props.setSpInfoValue(value);
};
// 父组件设置服务商信息的值
const tosSetSpInfoValue = (value: any) => {
	currentSpInfo.value = value;
};
defineExpose({
	tosSetSpInfoValue,
});
</script>
<template>
	<div class="sp-info">
		<div class="sp-info-title">
			{{ $t('服务商信息') }}
			<el-button
				:icon="Plus"
				text
				type="primary"
				style="float: right; margin-right: 10px"
				@click="
					() => {
						addSpDialogFn('add');
					}
				"
				v-auth="'thirdWarehouse_addSp'"
			>
				{{ $t('新增服务商') }}
			</el-button>
		</div>
		<div class="sp-info-content">
			<div
				class="sp-info-item"
				v-for="(item, index) in spInfoArr"
				:key="index"
				:class="{ currentSpInfo: currentSpInfo.id === item.id }"
			>
				<div class="sp-info-item-name" @click="clickSetSpInfoValue(item)">
					<span
						:style="{
							marginRight: '10px',
						}"
						>{{ item.spName }}</span
					>
					<el-tag type="danger" v-if="item.status === 0">{{
						$t('停用')
					}}</el-tag>
				</div>
				<div class="sp-info-item-info">
					<!-- 编辑 -->
					<div class="sp-info-item-info-edit" v-if="item.status !== 0">
						<el-link
							@click="
								() => {
									addSpDialogFn('edit', item);
								}
							"
							type="primary"
							v-if="auth('thirdWarehouse_editSp')"
						>
							{{ $t('编辑') }}
						</el-link>
					</div>
					<!-- 授权 -->
					<div class="sp-info-item-info-auth" v-if="item.authStatus === 0">
						<el-link
							@click="
								() => {
									authSpDialogFn('add', item);
								}
							"
							type="primary"
							v-if="auth('thirdWarehouse_authSp')"
						>
							{{ $t('授权') }}
						</el-link>
					</div>
					<!-- 停用 -->
					<div class="sp-info-item-info-disable">
						<el-link
							@click="toggleSpStatus(item)"
							type="primary"
							v-if="
								(item.status === 0 && auth('thirdWarehouse_startSp')) ||
								(item.status !== 0 && auth('thirdWarehouse_stopSp'))
							"
						>
							{{ item.status === 0 ? $t('启用') : $t('停用') }}
						</el-link>
					</div>
				</div>
			</div>
		</div>
		<AddSp
			v-model="addSpDialogVisible"
			:visibleType="addSpVisibleType"
			:currentSpInfo="currentSpInfo"
			@closeDialog="addSpDialogFn('close')"
		/>
		<AuthSp
			v-model="authSpDialogVisible"
			:currentSpInfo="currentSpInfo"
			@closeDialog="authSpDialogFn('close')"
		/>
		<AuthEditSp
			v-model="authEditSpDialogVisible"
			:currentSpInfo="currentSpInfo"
			@closeDialog="
				() => {
					authEditSpDialogVisible = false;
					reloadSpInfo();
				}
			"
		/>
	</div>
</template>
<style scoped lang="scss">
.sp-info {
	width: 350px;
	height: 100%;
	background: #fff;

	&-title {
		font-size: 16px;
		font-weight: bold;
		height: 50px;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20px;
		border-bottom: 1px solid #e4e7ed;
	}
	&-content {
		height: 72vh;
		overflow-y: auto;
		.sp-info-item {
			width: 100%;
			height: 30px;
			padding: 0px 20px;
			margin: 10px 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			&-name {
				width: 50%;
			}
			&-info {
				width: 50%;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				opacity: 0;
				transition: opacity 0.2s;
				&-edit,
				&-auth,
				&-disable {
					width: 30%;
					text-align: center;
				}
			}
			&:hover {
				background: darken(#f5f7fa, 5%);
				.sp-info-item-info {
					opacity: 1;
				}
			}
		}
	}
}
.currentSpInfo {
	background: darken(#f5f7fa, 5%);
	.sp-info-item-info {
		opacity: 1;
	}
}
</style>
