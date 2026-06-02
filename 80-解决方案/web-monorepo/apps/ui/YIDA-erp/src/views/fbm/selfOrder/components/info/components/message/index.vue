<script setup lang="ts">
const BaseInfo = defineAsyncComponent(() => import('/@/views/fbm/selfOrder/components/info/components/message/components/base-info.vue'));
const BuyerInfo = defineAsyncComponent(() => import('/@/views/fbm/selfOrder/components/info/components/message/components/buyer-info.vue'));
const RecipientInfo = defineAsyncComponent(() => import('/@/views/fbm/selfOrder/components/info/components/message/components/recipient-info.vue'));
const FeeInfo = defineAsyncComponent(() => import('/@/views/fbm/selfOrder/components/info/components/message/components/fee-info.vue'));
</script>
<template>
	<div class="message-content">
		<BaseInfo />
		<BuyerInfo />
		<RecipientInfo />
		<FeeInfo />
	</div>
</template>

<style scoped lang="scss">
.message-content {
	display: flex;
	justify-content: space-between;
	height: 240px;
	padding: 10px 0;
}
</style>
