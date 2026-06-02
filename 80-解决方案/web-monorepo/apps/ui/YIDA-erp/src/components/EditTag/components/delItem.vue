<script setup lang="ts">
import { PropType } from 'vue';
import { postTagDelete } from '/@/api/components/editTag';
import { useMessageBox } from '/@/hooks/message';
const props = defineProps({
	item: {
		type: Object as PropType<{
			id: number;
			name: string;
			color: string;
		}>,
		default: () => ({}),
	},
});

const emit = defineEmits(['submit']);

/**
 * 删除标签
 */
const delItem = async () => {
	useMessageBox()
		.confirm('是否删除该标签？')
		.then(async () => {
			await postTagDelete({
				ids: [props.item.id],
			});
			emit('submit');
		})
		.catch(() => {});
};
</script>
<template>
	<div>
		<el-link
			underline="never"
			type="primary"
			@click="
				() => {
					delItem();
				}
			"
		>
			<el-icon><Delete /></el-icon>
		</el-link>
	</div>
</template>

<style scoped></style>
