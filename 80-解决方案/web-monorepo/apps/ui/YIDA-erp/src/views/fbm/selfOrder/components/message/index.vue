<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-10-23 19:54:24
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-10-24 13:45:03
 * @FilePath: \qianyi-ui\src\views\fbm\selfOrder\components\message\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { Edit } from '@element-plus/icons-vue';
import { useMessage } from '/@/hooks/message';
const props = defineProps({
	params: {
		type: Object,
		default: () => ({}),
	},
	title: {
		type: String,
		default: '创建标签',
	},
	api: {
		type: Function,
		required: true,
	},
	type: {
		type: String,
		default: '1', // 1产品备注 2客服备注
	},
});
const inputValue = ref('');
const popoverRef = ref<null | any>(null);
const visible = ref(false);
const emit = defineEmits(['submit']);
/**
 * 初始化
 */
const init = () => {
	visible.value = true;
	inputValue.value = '';
};
/**
 * 提交新增
 */
const submit = async () => {
	const res = await props.api(
		props.type === '1'
			? {
					selfOrderNo: props.params.selfOrderNo,
					mskuCode: props.params.mskuCode,
					orderSkuId: props.params.id,
					remark: inputValue.value,
			  }
			: props.type === '2'
			? {
					selfOrderNo: props.params.selfOrderNo,
					csNote: inputValue.value,
			  }
			: {}
	);
	if (res.code === 0) {
		useMessage().success('操作成功');
		visible.value = false;
		emit('submit', inputValue.value);
	}
};
</script>
<template>
	<el-popover placement="right" trigger="click" :visible="visible" width="350" ref="popoverRef">
		<template #default>
			<el-row class="mb-2">
				<div>
					<strong>{{ props.title }}</strong>
				</div>
			</el-row>
			<el-row class="mb-2">
				<el-input type="textarea" :rows="4" v-model="inputValue" placeholder="请输入内容" maxlength="1000"></el-input>
			</el-row>
			<el-row class="flex" style="justify-content: flex-end; gap: 8px">
				<el-button
					@click="
						() => {
							visible = false;
						}
					"
					>取消</el-button
				>
				<el-button
					type="primary"
					@click="
						() => {
							submit();
						}
					"
				>
					确定
				</el-button>
			</el-row>
		</template>
		<template #reference>
			<span>
				<el-link underline="never" type="primary" @click="init" :icon="Edit"> </el-link>
			</span>
		</template>
	</el-popover>
</template>

<style scoped></style>
