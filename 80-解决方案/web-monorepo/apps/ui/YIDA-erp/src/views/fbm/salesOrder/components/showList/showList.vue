<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-12-29 09:58:47
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-12-29 10:13:44
 * @FilePath: \qianyi-ui\src\views\fbm\salesOrder\components\showList\showList.vue
 * @Description: 下箭头悬浮展示组件
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->

<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue';

const props = defineProps({
	list: {
		type: Array as () => string[],
		default: () => [],
	},
});
</script>

<template>
	<div class="w-5">
		<el-popover placement="right" trigger="hover">
			<template #reference>
				<div>
					<el-icon>
						<ArrowDown />
					</el-icon>
				</div>
			</template>
			<div>
				<div v-for="(item, index) in props.list" :key="index">
					{{ item }}
				</div>
			</div>
		</el-popover>
	</div>
</template>

<style scoped></style>
