<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-09-28 19:24:32
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-09 16:33:49
 * @FilePath: \qianyi-ui\src\components\EditTag\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue';
import { getTagList } from '/@/api/components/editTag';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const emit = defineEmits(['submit']);
const props = defineProps({
	// 选中的标签列表
	value: {
		type: Array as () => Array<string>,
		default: () => [],
	},
	type: {
		type: String as () => 'icon' | 'text',
		default: 'icon', // order订单标签 product商品标签 user用户标签
	},
});
// 引入新增标签组件
const AddItem = defineAsyncComponent(() => import('./components/addItem.vue'));
// 引入编辑标签组件
const EditItem = defineAsyncComponent(() => import('./components/editItem.vue'));
// 引入删除标签组件
const DelItem = defineAsyncComponent(() => import('./components/delItem.vue'));
// 是否展示
const dialogVisible = ref(false);
// 对话框的引用
const dialogRef = ref<null | any>(null);
// 选中的标签列表
const checkList = ref<Array<string>>([]);
// 当前标签列表
const tagList = ref<Array<any>>([]);

/**
 * 初始化
 */
const init = async () => {
	const res = await getTagList({});
	if (res.code === 0) {
		tagList.value = res.data;
	}
	// 清空选中的标签
	checkList.value = [];
	if (props.value && props.value.length > 0) {
		// 设置选中的标签
		checkList.value = props.value.map((item) => item);
	}
};

/**
 * 提交
 */
const submit = () => {
	// 查询选中的标签
	const setData = tagList.value.filter((item) => checkList.value.includes(item.id));
	// 通过事件将选中的标签传递给父组件
	emit('submit', setData);
	// 关闭弹窗
	dialogVisible.value = false;
};

/**
 * 弹窗关闭后的回调
 */
const closeDialog = () => {
	dialogVisible.value = false;
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
<template>
	<div>
		<el-link :icon="ArrowDown" underline="never" @click="show" v-if="type === 'icon'"></el-link>
		<el-link size="mini" type="primary" underline="never" @click="show" v-if="type === 'text'">{{ t('选择标签') }}</el-link>
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
			:style="{
				height: '600px',
			}"
		>
			<template #header>
				<el-row class="flex" style="align-items: center; gap: 8px">
					<el-col :span="3">标记标签</el-col>
					<el-col :span="4">
						<AddItem @submit="init" />
					</el-col>
				</el-row>
			</template>
			<div class="dialog-body">
				<el-checkbox-group v-model="checkList">
					<el-row :gutter="20">
						<el-col :span="12" v-for="(item, index) in tagList" :key="index" class="mb-2">
							<el-row>
								<el-col :span="18" class="flex items-center justify-center">
									<el-checkbox :value="item.id" />
									<span
										:style="{
											backgroundColor: item.color,
											width: '15px',
											height: '12px',
											lineHeight: '10px',
											borderRadius: '50%',
											display: 'inline-block',
											margin: '0 8px',
										}"
									></span>
									<span style="height: 20px; line-height: 20px; width: 100%; font-size: 14px">
										{{ item.name }}
									</span>
								</el-col>
								<el-col :span="3" class="flex items-center justify-center">
									<EditItem :item="item" @submit="init" />
								</el-col>
								<el-col :span="3" class="flex items-center justify-center">
									<DelItem :item="item" @submit="init" />
								</el-col>
							</el-row>
						</el-col>
					</el-row>
				</el-checkbox-group>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="hide">取 消</el-button>
					<el-button type="primary" @click="submit">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<style scoped lang="scss">
.dialog-body {
	height: 400px;
	overflow: auto;
	border: 1px solid #ebeef5;
	border-radius: 4px;
	padding: 18px;
}
</style>
