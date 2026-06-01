<!--
 * @Author: wuyueqin wuyueqin@merach.com
 * @Date: 2026-02-03 15:34:26
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2026-02-10 10:42:10
 * @FilePath: \qianyi-ui\src\components\ActionDropdown\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<el-dropdown placement="bottom-end">
		<span class="el-dropdown-link">
			{{ $t('操作') }}
			<el-icon class="el-icon--right">
				<arrow-down />
			</el-icon>
		</span>
		<template #dropdown>
			<el-dropdown-menu>
				<template v-for="(item, index) in menuList">
					<!-- 插槽类型 -->
					<slot v-if="item.type === 'slot'" :name="item.key" :item="item" />

					<!-- log 类型 -->
					<LogBtn
						v-else-if="item.type === 'log' && auth(item.auth ? item.auth : '')"
						:row="row"
						v-bind="item.itemArgs"
						showType="dropdown"
						:key="item.key"
					/>

					<!-- 删除类型 -->
					<el-dropdown-item
						v-else-if="item.type === 'del' && auth(item.auth ? item.auth : '')"
						:key="item.key + index"
						@click="handleDelete(item)"
					>
						{{ item.label }}
					</el-dropdown-item>

					<!-- 普通类型 -->
					<el-dropdown-item
						v-else-if="auth(item.auth ? item.auth : '')"
						:key="index"
						@click="handleClick(item)"
					>
						{{ item.label }}
					</el-dropdown-item>
				</template>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { useMessageBox } from '/@/hooks/message';
import { auth } from '/@/utils/authFunction';
const LogBtn = defineAsyncComponent(
	() => import('/@/components/log/log-btn.vue')
);

interface MenuItem {
	key: string;
	label?: string;
	type?: 'del' | 'log' | 'slot' | 'default';
	itemArgs?: Record<string, any>;
	onClick?: (row: any) => void;
	auth?: string;
}

interface Props {
	menuList: MenuItem[];
	row: any;
	confirmText?: string;
}

const props = withDefaults(defineProps<Props>(), {
	confirmText: '确定要删除吗？',
});

const emit = defineEmits<{
	delete: [item: MenuItem, row: any];
	click: [item: MenuItem, row: any];
}>();

// 处理删除操作
const handleDelete = async (item: MenuItem) => {
	try {
		await useMessageBox().confirm(props.confirmText);
		emit('delete', item, props.row);
		emit('click', item, props.row);
		item.onClick?.(props.row);
	} catch {
		// 用户取消删除
	}
};

// 处理普通点击
const handleClick = (item: MenuItem) => {
	emit('click', item, props.row);
	item.onClick?.(props.row);
};
</script>

<style lang="scss" scoped>
.el-dropdown-link {
	cursor: pointer;
	color: var(--el-color-primary);
	display: flex;
	align-items: center;
}
</style>
