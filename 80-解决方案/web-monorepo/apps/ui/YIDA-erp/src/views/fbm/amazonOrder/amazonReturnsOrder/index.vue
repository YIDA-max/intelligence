<!--
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-02-11 15:13:18
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-02-11 15:50:00
 * @FilePath: \qianyi-ui\src\views\integrations\billDataSync\deliverGoodsOrderSync\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<div class="layout-padding">
		<el-tabs v-model="activeName" type="border-card">
			<el-tab-pane
				:label="$t('FBA退货')"
				name="fbaReturn"
				:style="{ height: '100%' }"
				v-if="auth('fbaReturnsOrder_view')"
			>
				<FbaReturn v-if="activeName === 'fbaReturn'" />
			</el-tab-pane>
			<el-tab-pane
				:label="$t('FBM退货')"
				name="fbmReturn"
				:style="{ height: '100%' }"
				v-if="auth('fbmReturnsOrder_view')"
			>
				<FbmReturn v-if="activeName === 'fbmReturn'" />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';

import { auth } from '/@/utils/authFunction';

const FbmReturn = defineAsyncComponent(() => import('./fbmReturn/index.vue'));
const FbaReturn = defineAsyncComponent(() => import('./fbaReturn/index.vue'));

onMounted(() => {
	//todo 待对接接口
});
const activeName = ref('fbaReturn');
</script>

<style lang="scss" scoped></style>
