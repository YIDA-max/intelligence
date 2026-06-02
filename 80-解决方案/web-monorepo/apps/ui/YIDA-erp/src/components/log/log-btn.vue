<!--
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-02-02 09:38:19
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-03-31 10:11:39
 * @FilePath: \qianyi-ui\src\components\log\log-btn.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<el-dropdown-item
		v-if="showType === 'dropdown'"
		@click="logDialogVisible = true"
	>
		{{ $t('日志') }}
	</el-dropdown-item>
	<el-link
		v-else
		underline="never"
		type="primary"
		class="mr10"
		@click="logDialogVisible = true"
		>{{ $t('日志') }}
	</el-link>

	<LogDialog
		v-model="logDialogVisible"
		:id="row?.id"
		:biz-type="bizType"
		:showSearchForm="false"
		:showToolBar="false"
		@closeDialog="logDialogVisible = false"
	/>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LogDialog from '/@/components/log/log-dialog.vue';

defineProps<{
	row?: any;
	bizType?: string[];
	showType?: 'dropdown' | 'btn' | '';
}>();

const logDialogVisible = ref(false);
</script>
