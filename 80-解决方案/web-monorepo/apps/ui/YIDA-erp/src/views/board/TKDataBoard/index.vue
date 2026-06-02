<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-12-30 10:13:57
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-01-20 17:58:06
 * @FilePath: \qianyi-ui\src\views\board\TKDataBoard\index.vue
 * @Description: TK 数据看板 - 阿里云 BI 看板集合
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { ref, computed } from 'vue';
import { auth } from '/@/utils/authFunction';

// 所有看板配置
const allDashboards = [
	{
		name: 'shop-order',
		label: 'TK店铺订单维度看板',
		url: 'https://bi.aliyuncs.com/token3rd/dashboard/view/pc.htm?pageId=3516be8c-abfb-4b71-b525-bf6e403ac2fc&accessTicket=6dd569db-871c-4a30-bb8b-00e22ece1a8e&dd_orientation=auto',
		auth: 'tk-shop-order-board', // 权限标识
	},
	{
		name: 'talent-commission',
		label: 'TK达人服务商佣金看板',
		url: 'https://bi.aliyuncs.com/token3rd/dashboard/view/pc.htm?pageId=0cd54ade-45fe-4a4a-8706-4b45d76f5398&accessTicket=36f3fe7e-1a73-4837-943c-e2863148e331&dd_orientation=auto',
		auth: 'tk-talent-commission-board', // 权限标识
	},
	{
		name: 'performance-summary',
		label: 'TK表现看板汇总',
		url: 'https://bi.aliyuncs.com/token3rd/dashboard/view/pc.htm?pageId=311144be-6812-401f-9c0b-eba6df5bda68&accessTicket=b850d963-4e3c-437b-a95c-a575cab00372&dd_orientation=auto',
		auth: 'tk-performance-summary-board', // 权限标识
	},
	{
		name: 'ad-summary',
		label: 'TK广告看板汇总',
		url: 'https://bi.aliyuncs.com/token3rd/dashboard/view/pc.htm?pageId=cbe74b97-4ee9-4ba6-9e94-60929120416f&accessTicket=671ff44a-6246-49c0-bc3c-225476fa6199&dd_orientation=auto',
		auth: 'tk-ad-summary-board', // 权限标识
	},
];

// 根据权限过滤看板，只显示有权限的看板
const dashboards = computed(() => {
	return allDashboards.filter((dashboard) => auth(dashboard.auth));
});

// 默认激活第一个有权限的 tab
const activeTab = ref(dashboards.value[0]?.name || '');
</script>

<template>
	<div class="layout-padding">
		<!-- 无权限提示 -->
		<el-empty
			v-if="dashboards.length === 0"
			description="暂无可查看的看板权限"
		/>

		<!-- 有权限则显示看板 -->
		<el-tabs v-else v-model="activeTab" type="border-card">
			<!-- 动态生成 Tab，已通过权限过滤 -->
			<el-tab-pane
				v-for="dashboard in dashboards"
				:key="dashboard.name"
				:label="dashboard.label"
				:name="dashboard.name"
			>
				<iframe
					:src="dashboard.url"
					class="w-full h-[82vh] border-0"
					:title="dashboard.label"
					frameborder="0"
					allowfullscreen
				></iframe>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<style scoped>
/* 可选：添加 iframe 加载动画 */
iframe {
	background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
	background-size: 200% 100%;
	animation: loading 1.5s ease-in-out infinite;
}

@keyframes loading {
	0% {
		background-position: 200% 0;
	}
	100% {
		background-position: -200% 0;
	}
}

/* iframe 加载完成后取消动画 */
iframe:not([src='']) {
	animation: none;
	background: #fff;
}
</style>
