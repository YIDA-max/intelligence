<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { FormInstance } from 'element-plus';
import { Plus, Close, QuestionFilled } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getAllTag } from '/@/api/customerService/orderSetting/index';

const router = useRouter();

/**
 * 接收父组件传递的属性
 * @property {object} dictMap - 字典映射表
 * @property {string} dialogType - 弹窗类型：add | edit | copy | detail
 */
const props = defineProps({
	dictMap: {
		type: Object,
		default: () => ({}),
	},
	dialogType: {
		type: String,
		default: 'add', // add | edit | copy
	},
});

// 表单引用
const formRef = ref<FormInstance>();

// 表单数据
const formData = ref({
	descList: [{ chineseDescription: '', foreignDescription: '' }], // 描述列表，包含中文和英文
	tagLines: [
		{
			firstTag: '' as string | number,
			seTag: '' as string | number,
			thTag: '' as string | number,
			forTag: '' as string | number,
		},
	], // 标签行列表
	files: [] as any[], // 附件列表
	remark: '', // 备注
});

// 表单校验规则
const rules = {
	chineseDescription: [
		{ required: true, message: '请输入中文描述', trigger: ['blur', 'change'] },
	],
	foreignDescription: [
		{ required: true, message: '请输入外语描述', trigger: ['blur', 'change'] },
	],
	tagLines: [
		{
			validator: (rule: any, value: any, callback: any) => {
				if (formData.value.tagLines.some((item) => !item.firstTag)) {
					callback(new Error('请至少选择一级标签'));
				} else {
					callback();
				}
			},
			trigger: ['blur', 'change'],
		},
	],
};

// 标签树数据
const tagTree = ref<any[]>([]);

// 初始化加载标签数据
onMounted(async () => {
	try {
		const res = await getAllTag({
			status: 1,
		});
		if (res.code === 0) {
			tagTree.value = res.data;
		}
	} catch (error) {
		ElMessage.error('加载标签数据失败');
	}
});

/**
 * 获取指定层级的标签选项
 * @param lineIndex - 行索引
 * @param level - 标签层级 (1-4)
 */
const getTagOptions = (lineIndex: number, level: number) => {
	const line = formData.value.tagLines[lineIndex];

	if (tagTree.value.length === 0) return [];

	// 一级标签：直接返回根节点列表
	if (level === 1) return tagTree.value;

	// 二级及以下：根据上一级选中值找到对应节点的 children
	let parentId: string | number | null = null;
	if (level === 2) parentId = line.firstTag;
	else if (level === 3) parentId = line.seTag;
	else if (level === 4) parentId = line.thTag;

	if (!parentId) return [];

	// 递归在树中查找目标节点
	const findNode = (nodes: any[], id: string | number): any => {
		for (const node of nodes) {
			if (node.id === id) return node;
			if (node.children?.length) {
				const found = findNode(node.children, id);
				if (found) return found;
			}
		}
		return null;
	};

	const parentNode = findNode(tagTree.value, parentId);
	return parentNode?.children || [];
};

/**
 * 处理标签变更，重置下级标签
 * @param {number} lineIndex - 行索引
 * @param {number} level - 变更的层级
 */
const handleTagChange = (lineIndex: number, level: number) => {
	const line = formData.value.tagLines[lineIndex];
	if (level === 1) {
		line.seTag = '';
		line.thTag = '';
		line.forTag = '';
	} else if (level === 2) {
		line.thTag = '';
		line.forTag = '';
	} else if (level === 3) {
		line.forTag = '';
	}
	validateTagDeduplication(lineIndex);
};

/**
 * 校验标签去重
 * @param {number} [currentIndex] - 当前操作的行索引
 */
const validateTagDeduplication = (currentIndex?: number) => {
	if (currentIndex === undefined) return;

	const lines = formData.value.tagLines;
	const currentLine = lines[currentIndex];

	// 如果当前行没有选任何标签，跳过
	if (!currentLine.firstTag) return;

	const currentKey = [
		currentLine.firstTag,
		currentLine.seTag,
		currentLine.thTag,
		currentLine.forTag,
	]
		.filter(Boolean)
		.join('-');

	// 检查是否有其他行与当前行重复
	const isDuplicate = lines.some((line, index) => {
		if (index === currentIndex) return false;
		const key = [line.firstTag, line.seTag, line.thTag, line.forTag]
			.filter(Boolean)
			.join('-');
		return key === currentKey;
	});

	if (isDuplicate) {
		ElMessage.error(
			`第 ${currentIndex + 1} 行标签组合与已有数据重复，请重新选择`
		);

		// 清空导致重复的最后一级选择
		if (currentLine.forTag) currentLine.forTag = '';
		else if (currentLine.thTag) currentLine.thTag = '';
		else if (currentLine.seTag) currentLine.seTag = '';
		else if (currentLine.firstTag) currentLine.firstTag = '';
	}
};

/**
 * 设置组件数据（回显）
 * @param data 外部传入的数据
 */
const setData = (data: any) => {
	// data is already mapped in utils/index.ts
	formData.value.descList = data.descList;
	formData.value.tagLines = data.tagLines;
	formData.value.files = data.files;
	formData.value.remark = data.remark;
};

/**
 * 获取组件数据
 */
const getData = async () => {
	if (!formRef.value) return Promise.reject('Form not initialized');
	await formRef.value.validate();

	const descriptions = formData.value.descList.map((item, index) => ({
		chineseDescription: item.chineseDescription,
		foreignDescription: item.foreignDescription,
		descriptionType: 'PROBLEM', // 默认类型
		sortOrder: index + 1,
	}));

	// 提取所有选中的标签 ID 组合
	const tagIds: string[] = [];
	formData.value.tagLines.forEach((line) => {
		const ids = [line.firstTag, line.seTag, line.thTag, line.forTag]
			.filter(Boolean)
			.join(',');
		if (ids) {
			tagIds.push(ids);
		}
	});

	return {
		descriptions,
		tagIds, // ["1,2,3,4", "1,2"]
	};
};

// 添加描述行
const handleAddDesc = () => {
	formData.value.descList.push({
		chineseDescription: '',
		foreignDescription: '',
	});
};

// 删除描述行
const handleRemoveDesc = (index: number) => {
	if (formData.value.descList.length > 1) {
		formData.value.descList.splice(index, 1);
	}
};

// 添加标签行
const handleAddTagLine = () => {
	formData.value.tagLines.push({
		firstTag: '',
		seTag: '',
		thTag: '',
		forTag: '',
	});
};

// 删除标签行
const handleRemoveTagLine = (index: number) => {
	if (formData.value.tagLines.length > 1) {
		formData.value.tagLines.splice(index, 1);
		validateTagDeduplication();
	}
};

defineExpose({
	setData,
	getData,
});
</script>

<template>
	<div class="mb-4">
		<div class="border-l-4 border-blue-500 pl-2 font-bold mb-4 text-base">
			原因/描述
		</div>
		<el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
			<el-row
				v-for="(item, index) in formData.descList"
				:key="index"
				class="flex items-start mb-4"
			>
				<el-col :span="11">
					<el-form-item
						label="外语描述"
						:prop="`descList.${index}.foreignDescription`"
						:rules="rules.foreignDescription"
					>
						<div class="w-full">
							<div class="flex-1 flex space-x-2">
								<el-input
									v-model="item.foreignDescription"
									type="textarea"
									:rows="2"
									maxlength="500"
									show-word-limit
									placeholder="请输入外语描述"
									:disabled="props.dialogType === 'detail'"
									class="flex-1"
								/>
							</div>
						</div>
					</el-form-item>
				</el-col>
				<el-col :span="11">
					<el-form-item
						label="中文描述"
						:prop="`descList.${index}.chineseDescription`"
						:rules="rules.chineseDescription"
					>
						<div class="w-full">
							<div class="flex-1 flex space-x-2">
								<el-input
									v-model="item.chineseDescription"
									type="textarea"
									:rows="2"
									maxlength="500"
									show-word-limit
									placeholder="请输入中文描述"
									:disabled="props.dialogType === 'detail'"
									class="flex-1"
								/>
							</div>
						</div>
					</el-form-item>
				</el-col>
				<span class="mt-1 ml-2">
					<el-icon
						v-if="index === 0 && props.dialogType !== 'detail'"
						@click="handleAddDesc"
						class="cursor-pointer"
						><Plus
					/></el-icon>
					<el-icon
						v-else-if="index !== 0 && props.dialogType !== 'detail'"
						@click="handleRemoveDesc(index)"
						class="cursor-pointer"
						><Close
					/></el-icon>
				</span>
			</el-row>
			<!-- 标签 -->
			<el-row
				v-for="(line, index) in formData.tagLines"
				:key="index"
				class="mb-4 mt-2 w-full"
			>
				<el-form-item
					:prop="`tagLines.${index}.firstTag`"
					:rules="[{ required: true, message: '请选择', trigger: 'change' }]"
					class="w-full"
				>
					<div class="tag-box-row">
						<div class="tag-item">
							<span><span class="text-red-500 mr-1">*</span>一级标签</span>
							<el-tooltip popper-class="failedPopper" placement="top">
								<el-icon class="question-icon"><QuestionFilled /></el-icon>
								<template #content>
									<span
										class="text-blue-500"
										style="cursor: pointer"
										@click="
											router.push(
												'/customerService/orderSetting/tagSetting/index'
											)
										"
										>可前往工单设置>标签设置中维护</span
									>
								</template>
							</el-tooltip>
							<el-select
								v-model="line.firstTag"
								style="min-width: 170px; max-width: 250px"
								filterable
								clearable
								placeholder="一级标签"
								:disabled="props.dialogType === 'detail'"
								@change="handleTagChange(index, 1)"
							>
								<el-option
									v-for="item in getTagOptions(index, 1)"
									:key="item.id"
									:label="item.tagName"
									:value="item.id"
								/>
							</el-select>
						</div>

						<div class="tag-item">
							<span>二级标签</span>
							<el-select
								v-model="line.seTag"
								filterable
								style="min-width: 170px; max-width: 250px"
								clearable
								placeholder="二级标签"
								:disabled="props.dialogType === 'detail'"
								@change="handleTagChange(index, 2)"
							>
								<el-option
									v-for="item in getTagOptions(index, 2)"
									:key="item.id"
									:label="item.tagName"
									:value="item.id"
								/>
							</el-select>
						</div>

						<div class="tag-item">
							<span>三级标签</span>
							<el-select
								v-model="line.thTag"
								filterable
								clearable
								style="min-width: 170px; max-width: 250px"
								placeholder="三级标签"
								:disabled="props.dialogType === 'detail'"
								@change="handleTagChange(index, 3)"
							>
								<el-option
									v-for="item in getTagOptions(index, 3)"
									:key="item.id"
									:label="item.tagName"
									:value="item.id"
								/>
							</el-select>
						</div>

						<div class="tag-item">
							<span>四级标签</span>
							<el-select
								v-model="line.forTag"
								filterable
								clearable
								style="min-width: 170px; max-width: 250px"
								placeholder="四级标签"
								:disabled="props.dialogType === 'detail'"
								@change="validateTagDeduplication(index)"
							>
								<el-option
									v-for="item in getTagOptions(index, 4)"
									:key="item.id"
									:label="item.tagName"
									:value="item.id"
								/>
							</el-select>
						</div>

						<div class="tag-action">
							<el-icon
								v-if="index === 0 && props.dialogType !== 'detail'"
								@click="handleAddTagLine"
								class="cursor-pointer text-lg"
							>
								<Plus />
							</el-icon>
							<el-icon
								v-else-if="index !== 0 && props.dialogType !== 'detail'"
								@click="handleRemoveTagLine(index)"
								class="cursor-pointer text-lg"
							>
								<Close />
							</el-icon>
						</div>
					</div>
				</el-form-item>
			</el-row>
		</el-form>
	</div>
</template>

<style lang="scss" scoped>
.tag-box-row {
	width: 100%;
	display: flex;
	align-items: center;
	gap: 20px; /* 控制每个标签间距，按需调整 */
	flex-wrap: nowrap;
}
.tag-item {
	display: flex;
	align-items: center;
	gap: 8px;
	width: 25%;
}
.tag-action {
	margin-left: 8px;
}
.question-icon {
	margin-right: 4px;
	font-size: 14px;
	color: #3b455a;
	cursor: help;
}
</style>
