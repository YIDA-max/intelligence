<script setup lang="ts">
import { postTagSave } from '/@/api/components/editTag';
import { useMessage } from '/@/hooks/message';
const name = ref('');
const color = ref('');
const popoverRef = ref<null | any>(null);
const visible = ref(false);
const emit = defineEmits(['submit']);
/**
 * 初始化
 */
const init = () => {
	visible.value = true;
	name.value = '';
	color.value = '';
};
/**
 * 提交新增
 */
const submit = async () => {
	if (!name.value || !color.value) {
		useMessage().warning('请填写完整信息');
		return;
	}
	const res = await postTagSave({
		name: name.value,
		color: color.value,
	});
	if (res.code === 0) {
		// 提交成功
		useMessage().success('创建成功');
		// 这里可以添加提交逻辑
		emit('submit');
		visible.value = false;
	}
};
</script>
<template>
	<div>
		<el-popover placement="top" trigger="click" :visible="visible" width="350" ref="popoverRef">
			<template #default>
				<el-row class="mb-2">
					<el-col :span="6" class="flex">
						<span
							:style="{
								color: '#f78c8c',
								marginRight: '3px',
							}"
						>
							*
						</span>
						标签颜色
					</el-col>
					<el-col :span="16" class="flex">
						<span
							:style="{
								color: '#f78c8c',
								marginRight: '3px',
							}"
						>
							*
						</span>
						标签名称
					</el-col>
				</el-row>
				<el-row class="mb-2">
					<el-col :span="6" class="flex">
						<el-select v-model="color" placeholder="" style="width: 70px">
							<el-option
								v-for="item in [
									{ value: '#f1403e', label: '红色' },
									{ value: '#f79c3a', label: '橙色' },
									{ value: '#03b02c', label: '绿色' },
								]"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
								<div class="flex items-center">
									<span
										:style="{
											backgroundColor: item.value,
											width: '10px',
											height: '10px',
											borderRadius: '50%',
											display: 'inline-block',
										}"
									>
									</span>
									<span style="margin-left: 8px">
										{{
											item.label === '红色'
												? '表示问题很严重,需高度关注'
												: item.label === '橙色'
												? '表示问题较严重,需关注'
												: item.label === '绿色'
												? '表示问题不严重,可适当关注'
												: ''
										}}
									</span>
								</div>
							</el-option>
							<template #label="{ value }">
								<span
									:style="{
										backgroundColor: value,
										width: '10px',
										height: '10px',
										borderRadius: '50%',
										display: 'inline-block',
									}"
								></span>
							</template>
						</el-select>
					</el-col>
					<el-col :span="16" class="flex">
						<el-input placeholder="请输入标签名称" v-model="name" maxlength="10"></el-input>
					</el-col>
				</el-row>
				<el-row class="flex" style="justify-content: flex-end; gap: 8px">
					<el-button
						@click="
							() => {
								visible = false;
							}
						"
						>取消</el-button
					>
					<el-button
						type="primary"
						@click="
							() => {
								submit();
							}
						"
					>
						确定
					</el-button>
				</el-row>
			</template>
			<template #reference>
				<el-link underline="never" type="primary" @click="init"> 创建</el-link>
			</template>
		</el-popover>
	</div>
</template>

<style scoped></style>
