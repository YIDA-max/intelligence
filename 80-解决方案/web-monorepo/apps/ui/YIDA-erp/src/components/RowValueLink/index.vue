<template>
	<template v-if="props.row[props.valueKey]">{{
		props.row[props.valueKey]
	}}</template>
	<template v-else>
		<span
			@click="
				() => {
					router.push({ path: toPath });
				}
			"
			class="text-blue"
		>
			{{ infoTips }}
		</span>
	</template>
</template>

<script setup lang="ts" name="RowValueLink">
/**
 * SKU信息展示组件
 * 用于在表格中显示SKU编码和名称
 */
import { useRouter } from 'vue-router';
const router = useRouter();

interface Props {
	/** 数据行对象 */
	row: Record<string, any>;
	valueKey?: string;
	/** 是否显示没有信息时链接，默认为 false */
	isShowLink?: boolean;
	/** 没有sku信息时的提示信息，默认为 'SKU信息没有维护关联的MSKU,请前往SKU列表维护>>' */
	infoTips?: string;
	/** 没有sku信息时的跳转路径，默认为 '/product/product-info/sku/index' */
	toPath?: string;
}

const props = withDefaults(defineProps<Props>(), {
	valueKey: 'skuName',
	isShowLink: true,
	infoTips: 'SKU信息没有维护关联的MSKU,请前往SKU列表维护>>',
});
</script>

<style scoped lang="scss">
.text-blue {
	color: #0089ef;
	word-break: break-all;
	white-space: pre-line;
	cursor: pointer;
	text-align: left;
}
</style>
