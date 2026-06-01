<template>
	<el-dialog v-bind="$attrs" :close-on-click-modal="false" :title="props.title" width="1000px" @close="handleClose" @open="handleOpen" draggable>
		<div class="dialog-container">
			<el-form :model="formData" :rules="rules" ref="formRef" label-width="80px">
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="达人名称" prop="influencerName">
							<el-input v-model="formData.influencerName" show-word-limit placeholder="达人名称" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="SPU" prop="spu">
							<el-input v-model="formData.spu" show-word-limit placeholder="SPU" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="合作日期" prop="cooperationDate">
							<el-date-picker
								v-model="formData.cooperationDate"
								type="date"
								placeholder="选择日期"
								style="width: 100%"
								value-format="YYYY-MM-DD"
								format="YYYY-MM-DD"
								clearable
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="合作费用" prop="cooperationFee">
							<el-input v-model="formData.cooperationFee" type="number" show-word-limit placeholder="合作费用">
								<template #append>$</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="佣金比例" prop="commissionRate">
							<el-input v-model="formData.commissionRate" type="number" show-word-limit placeholder="佣金比例">
								<template #append>%</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="跟进人" prop="approver">
							<el-input v-model="formData.approver" show-word-limit placeholder="跟进人" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="12">
						<el-form-item label="进度" prop="progress">
							<el-select v-model="formData.progress" placeholder="进度" clearable>
								<el-option v-for="item in props.dictMap.tiktok.slice(1)" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="店铺" prop="store">
							<el-input v-model="formData.store" show-word-limit placeholder="店铺名称" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row class="mb18">
					<el-col :span="24">
						<el-form-item label="备注" prop="remark">
							<el-input v-model="formData.remark" maxlength="1024" show-word-limit placeholder="备注" type="textarea" />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">{{ $t('保存') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { postAddTikTok, postUpdateTikTok } from '/@/api/tiktok/cooperation/index';
import { useMessage } from '/@/hooks/message';
import { addInit, editInit } from './utils';
const props = defineProps({
	title: { type: String, default: '添加达人' },
	currentRow: { type: Object, default: () => ({}) }, // 当前编辑的数据
	visibleType: { type: String, default: '' }, // 弹窗类型
	dictMap: { type: Object, default: () => ({}) }, // 字典数据
});

const emit = defineEmits(['closeDialog', 'save']);

// 加载
const loading = ref(false);

// form表单
const formRef = ref();
const formData = ref<{ [key: string]: string }>({
	influencerName: '', // 达人名称
	spu: '', // SPU
	cooperationDate: '', // 合作日期
	cooperationFee: '', // 合作费用
	commissionRate: '', // 佣金比例
	approver: '', // 跟进人
	progress: '', // 进度
	store: '', // 店铺
	remark: '', // 备注
});

// 校验规则
const rules = ref({
	influencerName: [{ required: true, message: '达人名称不能为空', trigger: 'blur' }],
	spu: [{ required: true, message: 'SPU不能为空', trigger: 'blur' }],
	cooperationDate: [{ required: true, message: '合作日期不能为空', trigger: 'blur' }],
	approver: [{ required: true, message: '跟进人不能为空', trigger: 'blur' }],
	progress: [{ required: true, message: '进度不能为空', trigger: 'blur' }],
});
// 打开弹窗
const handleOpen = async () => {
	if (props.visibleType === 'edit') {
		editInit(formData, props.currentRow);
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
const onSubmit = () => {
	formRef.value.validate(async (valid: boolean) => {
		if (valid) {
			let api = props.visibleType === 'edit' ? postUpdateTikTok : postAddTikTok;
			try {
				const res = await api({
					influencerName: formData.value.influencerName, // 达人名称
					spu: formData.value.spu, // SPU
					cooperationDate: formData.value.cooperationDate, // 合作日期
					cooperationFee: formData.value.cooperationFee, // 合作费用
					commissionRate: formData.value.commissionRate, // 佣金比例
					approver: formData.value.approver, // 跟进人
					progress: formData.value.progress, // 进度
					store: formData.value.store, // 店铺
					remark: formData.value.remark, // 备注
					id: props.visibleType === 'edit' ? props.currentRow.id : '', // 编辑时传入ID
				});
				if (res.code === 0) {
					useMessage().success(props.visibleType === 'edit' ? '编辑成功' : '添加成功');
					handleClose();
				}
			} catch (error: any) {
				useMessage().error(error.msg);
			}
		}
	});
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
