<!--
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2025-11-21 18:26:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2026-02-04 10:11:57
 * @FilePath: \qianyi-ui\src\components\SkuTableColumn\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<div class="sku-info">
		<div v-if="props.row[props.codeKey] || props.row[props.nameKey]">
			<p v-if="props.row[props.codeKey]">{{ props.row[props.codeKey] }}</p>
			<p v-if="props.row[props.nameKey]">{{ props.row[props.nameKey] }}</p>
		</div>
		<div
			v-else
			@click="
				() => {
					router.push({ path: toPath });
				}
			"
			class="text-blue"
		>
			<span> {{ infoTips }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
/**
 * SKU信息展示组件
 * 用于在表格中显示SKU编码和名称
 */
import { useRouter } from 'vue-router';
const router = useRouter();

interface Props {
	/** 数据行对象 */
	row: Record<string, any>;
	/** SKU编码字段名，默认为 'skuCode' */
	codeKey?: string;
	/** SKU名称字段名，默认为 'skuName' */
	nameKey?: string;
	/** 是否显示没有sku信息时链接，默认为 false */
	isShowLink?: boolean;
	/** 没有sku信息时的提示信息，默认为 'SKU信息没有维护关联的MSKU,请前往SKU列表维护>>' */
	infoTips?: string;
	/** 没有sku信息时的跳转路径，默认为 '/product/product-info/sku/index' */
	toPath?: string;
}

const props = withDefaults(defineProps<Props>(), {
	codeKey: 'skuCode',
	nameKey: 'skuName',
	isShowLink: false,
	infoTips: 'SKU信息没有维护关联的MSKU,请前往SKU列表维护>>',
	toPath: '/product/product-info/sku/index',
});
</script>

<style scoped lang="scss">
.sku-info {
	p {
		margin: 0;
		line-height: 1.5;
		word-break: break-all;
	}
	.text-blue {
		color: #0089ef;
		word-break: break-all;
		white-space: pre-line;
		cursor: pointer;
		text-align: left;
	}
}
</style>
