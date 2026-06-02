<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-12-30 10:13:57
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-12-30 16:17:06
 * @FilePath: \qianyi-ui\src\views\toolView\logisticsError\index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { ref } from 'vue';

// 默认激活第一个 tab
const activeTab = ref('upload');
</script>

<template>
	<div class="layout-padding">
		<el-tabs v-model="activeTab" type="border-card">
			<!-- Tab 1: 积加异常订单处理 -->
			<el-tab-pane label="积加异常订单处理" name="upload">
				<iframe
					src="/deepseek/uploadIndex.html"
					class="w-full h-[90vh] border-0"
					title="logisticsError Creator Board"
				></iframe>
			</el-tab-pane>
			<!-- Tab 2: iframe 其他服务商异常订单处理 -->
			<el-tab-pane label="其他服务商异常订单处理" name="board">
				<iframe
					src="/deepseek/shipping-issue.html"
					class="w-full h-[90vh] border-0"
					title="logisticsError Creator Board"
				></iframe>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<style scoped></style>
