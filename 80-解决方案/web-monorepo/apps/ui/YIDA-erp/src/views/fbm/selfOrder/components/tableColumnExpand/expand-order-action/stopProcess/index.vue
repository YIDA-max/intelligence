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
		@close="closeDialog"
	>
		<template #header>
			<el-row class="flex" style="align-items: center; gap: 8px">
				<el-col :span="7">批量选择禁止处理原因</el-col>
				<el-col :span="4">
					<AddItem ref="addItemRef" @submit="init" :dictId="dictId" />
				</el-col>
			</el-row>
		</template>
		<div class="dialog-body">
			<div class="statusTip">
				若该单已推送至三方仓则无法对三方仓单据状态造成影响，请检查三方仓单据状态！
			</div>
			<div class="selectTip">共选中1条数据，在下方选择禁止处理原因！</div>
			<div class="select-box mt10">
				<el-radio-group v-model="errorReason">
					<el-row :gutter="20">
						<el-col
							:span="24"
							v-for="(item, index) in tagList"
							:key="index"
							class="mb-2"
						>
							<el-radio :value="item.value">{{ item.label }}</el-radio>
						</el-col>
					</el-row>
				</el-radio-group>
			</div>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="hide">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</span>
		</template>
	</el-dialog>
</template>
<script setup lang="ts">
import { fetchItemList } from '/@/api/admin/dict';
import { useMessage } from '/@/hooks/message';
import { stopHanderOrder } from '/@/api/fbm/selfOrder';

const props = defineProps({
	// 当前行数据
	currentRow: {
		type: Object,
		default: () => ({}),
	},
	type: {
		type: String as () => 'icon' | 'text',
		default: 'icon', // order订单标签 product商品标签 user用户标签
	},
});
const getDataList = inject<any>('getDataList');
// 引入新增标签组件
const AddItem = defineAsyncComponent(() => import('./components/addItem.vue'));
// 是否展示
const dialogVisible = ref(false);
// 对话框的引用
const dialogRef = ref<null | any>(null);
// 选中的标签列表
const errorReason = ref<string>();
// 当前标签列表
const tagList = ref<Array<any>>([]);

// 当前选中的订单ID
const currentId = ref();

// 禁止处理原因字典id
const dictId = ref();

// 添加原因ref
const addItemRef = ref<null | any>(null);
/**
 * 初始化
 */
const init = async () => {
	currentId.value = props.currentRow.id;
	const res = await fetchItemList({
		dictType: 'self_order_stop',
	});
	if (res.code === 0) {
		tagList.value = res.data?.records || [];
		dictId.value =
			tagList.value && tagList.value.length > 0
				? tagList.value[0].dictId
				: undefined;
	}
};

/**
 * 提交
 */
const submit = async () => {
	if (!errorReason.value) {
		useMessage().warning('请选择禁止处理原因');
		return;
	}
	const params = {
		id: currentId.value,
		errorReason: errorReason.value,
	};
	const res = await stopHanderOrder(params);
	if (res && res.code === 0) {
		useMessage().success('操作成功');
		getDataList();
		closeDialog();
	}
};

/**
 * 弹窗关闭后的回调
 */
const closeDialog = () => {
	dialogVisible.value = false;
	addItemRef.value.close();
};

/**
 * 显示弹窗
 */
const show = () => {
	dialogVisible.value = true;
};
/**
 * 隐藏弹窗
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

<style scoped lang="scss">
.el-overlay-dialog {
	max-height: 700px;
	overflow: auto;
}
.statusTip {
	color: #ff9e3e;
}

.select-box {
	border: 1px solid #ebeef5;
	border-radius: 4px;
	padding: 5px 18px;
	max-height: 400px;
	overflow: auto;
}
</style>
