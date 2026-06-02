<template>
	<div>
		<el-tabs v-model="activeName" type="border-card">
			<el-tab-pane label="物流" name="logistics">
				<Logistics v-if="activeName === 'logistics'" />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';

const Logistics = defineAsyncComponent(() => import('./logistics/index.vue'));

const activeName = ref('logistics');
</script>

<style scoped lang="scss"></style>
