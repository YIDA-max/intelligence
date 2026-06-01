<template>
	<el-popover
		v-model:visible="visible"
		width="800"
		placement="left"
		trigger="click"
		:style="{
			height: '400px',
		}"
	>
		<template #default>
			<el-tabs v-if="visible" v-model="activeTab" class="demo-tabs" width="800">
				<!-- 提货占用 -->
				<el-tab-pane label="提货占用" name="1">
					<el-table
						:data="pickupOccupancyList"
						border
						width="800"
						:style="{
							height: '400px',
						}"
					>
						<el-table-column
							v-for="column in columnsList"
							:key="column.prop"
							:prop="column.prop"
							:label="t(column.label)"
							:show-overflow-tooltip="column.showOverflowTooltip"
						/>
					</el-table>
				</el-tab-pane>

				<!-- 转库存占用 -->
				<el-tab-pane label="转库存占用" name="2">
					<el-table
						:data="transferOccupancyList"
						border
						width="800"
						:style="{
							height: '400px',
						}"
					>
						<el-table-column
							v-for="column in columnsList"
							:key="column.prop"
							:prop="column.prop"
							:label="t(column.label)"
							:show-overflow-tooltip="column.showOverflowTooltip"
						/>
					</el-table>
				</el-tab-pane>

				<!-- 采购退货 -->
				<el-tab-pane label="采购退货" name="3">
					<el-table
						:data="purchaseReturnList"
						border
						width="800"
						:style="{
							height: '400px',
						}"
					>
						<el-table-column
							v-for="column in columnsList"
							:key="column.prop"
							:prop="column.prop"
							:label="t(column.label)"
							:show-overflow-tooltip="column.showOverflowTooltip"
						/>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</template>
		<template #reference>
			<div @mousemove="handleMouseMove">
				<el-link class="text-blue" :underline="'hover'" @click="handleClick">{{
					displayValue || '---'
				}}</el-link>
			</div>
		</template>
	</el-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 定义组件的props
interface Props {
	// 显示的值
	displayValue?: number | string;
	// 提货占用列表数据
	pickupOccupancyList?: Array<any>;
	// 转库存占用列表数据
	transferOccupancyList?: Array<any>;
	// 采购退货列表数据
	purchaseReturnList?: Array<any>;
}

withDefaults(defineProps<Props>(), {
	displayValue: 0,
	pickupOccupancyList: () => [],
	transferOccupancyList: () => [],
	purchaseReturnList: () => [],
});

// 定义组件的emits
const emit = defineEmits<{
	(e: 'click', value: any): void;
}>();

// 弹窗显示状态
const visible = ref(false);
// 当前激活的tab
const activeTab = ref('1');

// 提货占用表头配置
const columnsList = ref<Array<any>>([
	{
		prop: 'sourceOrderNo',
		label: '单据编号',
		showOverflowTooltip: true,
	},
	{
		prop: 'qty',
		label: '数量',
		showOverflowTooltip: true,
	},
	{
		prop: 'createName',
		label: '操作人',
		showOverflowTooltip: true,
	},
	{
		prop: 'createTime',
		label: '操作时间',
		showOverflowTooltip: true,
	},
]);

// 处理鼠标移动事件
const handleMouseMove = () => {
	activeTab.value = '1';
};

// 处理点击事件
const handleClick = () => {
	emit('click', {});
};
</script>

<style lang="scss" scoped>
.text-blue {
	color: #0089ef;
}
</style>
