<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus';
import { getRuleActionControl, postRuleActionControlSaveOrUpdate } from '/@/api/fbm/orderRule/orderMergeRule';
import { useIntersectionObserver } from '@vueuse/core';
const ShowTiem = defineAsyncComponent(() => import('./show-tiem.vue'));
const showTiemRef = ref<InstanceType<typeof ShowTiem> | null>(null);
const formRef = ref();
const formData = ref({
	id: 0,
	openMerge: 0, // 合单总开关是否开启，0否，1开
	platform: true, // 订单平台
	orderFrom: true, // 订单接入方式
	store: true, // 订单店铺
	recipientFlag: true, // 收件人信息
	recipientAddress: true, // 收件地址信息
	siteCode: false, // 订单站点
	buyerId: false, // 买家编码
	buyerName: false, // 买家名称
	buyerEmail: false, // 买家邮箱
});
const releaseTime = ref('[{}]'); // 放单时间
const rules = ref({});
onMounted(() => {
	// 监听是否进入可视区域，进入则触发加载数据
	useIntersectionObserver(formRef.value, async ([entry]) => {
		if (entry.isIntersecting) {
			const res = await getRuleActionControl({});
			if (res && res.code === 0) {
				formData.value = {
					...formData.value,
					...JSON.parse(res.data?.actionRule || '{}'),
					id: res.data?.id || 0,
					openMerge: res.data?.openMerge || 0,
				};
				releaseTime.value = res.data.releaseTime || '[]';
			}
		}
	});
});
// 处理提交
const handleSubmit = async (times: string) => {
	const payload = {
		actionRule: JSON.stringify({
			...formData.value,
		}),
		openMerge: formData.value.openMerge,
		id: formData.value.id,
		releaseTime: times,
	};
	// 更新本地放单时间
	releaseTime.value = times;
	const res = await postRuleActionControlSaveOrUpdate(payload);
	if (res && res.code === 0) {
		ElMessage.success('保存成功');
	}
};
// 处理可选维度变化
const handleChange = async () => {
	// 处理可选维度变化
	const payload = {
		actionRule: JSON.stringify({
			...formData.value,
		}),
		openMerge: formData.value.openMerge,
		id: formData.value.id,
		releaseTime: releaseTime.value,
	};
	const res = await postRuleActionControlSaveOrUpdate(payload);
	if (res && res.code === 0) {
		// eslint-disable-next-line no-console
		console.log('保存成功');
	}
};
// 处理合单开关变化
const changeOpenMerge = async () => {
	if (formData.value.openMerge === 0) {
		ElMessageBox.confirm('禁用后，符合要求等待合单的订单，将移出待合单状态，请确认！', '提示', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
		})
			.then(async () => {
				await handleChange();
			})
			.catch(() => {
				// 取消关闭，恢复开关状态
				formData.value.openMerge = 1;
			});
	} else {
		await handleChange();
	}
};
</script>
<template>
	<div>
		<el-form :model="formData" ref="formRef" label-width="110px" :rules="rules" label-position="left">
			<el-row class="mt-1 mb-1">
				<div class="section-title">
					<span class="section-bar"></span>
					<span class="mr-2"> 是否启用合单</span>
					<el-switch
						v-model="formData.openMerge"
						:active-value="1"
						:inactive-value="0"
						inline-prompt
						@change="
							() => {
								changeOpenMerge();
							}
						"
					/>
				</div>
			</el-row>
			<el-row class="mt-1 mb-4 card" v-if="formData.openMerge === 1">
				<el-row>
					<el-form-item label="合单维度设置" prop="">
						<span class="text-gray">（系统自动筛选合单维度完全相同的订单为“可合单”的单据）</span>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="默认维度" prop="">
						<el-checkbox label="订单平台" v-model="formData.platform" disabled />
						<el-checkbox label="订单接入方式" v-model="formData.orderFrom" disabled />
						<el-checkbox label="订单店铺" v-model="formData.store" disabled />
						<el-checkbox label="收件人信息(姓名、电话、mos.邮箱)" v-model="formData.recipientFlag" disabled />
						<el-checkbox label="收件地址信息(国家、省/州、市、区/县、详细地址)" v-model="formData.recipientAddress" disabled />
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="可选维度" prop="">
						<el-checkbox v-model="formData.siteCode" label="订单站点" @change="handleChange" />
						<el-checkbox v-model="formData.buyerId" label="买家编码" @change="handleChange" />
						<el-checkbox v-model="formData.buyerName" label="买家名称" @change="handleChange" />
						<el-checkbox v-model="formData.buyerEmail" label="买家邮箱" @change="handleChange" />
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="放单时间设置" prop="">
						<span class="text-gray">（到放单时间时，系统会将不能合单的订单流转到正常流程中）</span>
					</el-form-item>
				</el-row>
				<el-row>
					<el-link
						type="primary"
						underline="never"
						@click="
							() => {
								showTiemRef?.show();
							}
						"
						>设置放单时间(北京)</el-link
					>
					<el-tag style="margin-left: 8px" v-if="releaseTime && releaseTime !== '[]'" type="info">
						已设置 {{ JSON.parse(releaseTime).length }} 个时间
					</el-tag>
				</el-row>
				<ShowTiem ref="showTiemRef" :releaseTime="releaseTime" @onSubmit="handleSubmit" />
			</el-row>
		</el-form>
	</div>
</template>

<style scoped lang="scss">
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
.card {
	border: 1px solid #e1e6eb;
	border-radius: 4px;
	height: 100%;
	padding: 8px;
	.text-gray {
		color: #909399;
		font-weight: normal;
	}
}
</style>
