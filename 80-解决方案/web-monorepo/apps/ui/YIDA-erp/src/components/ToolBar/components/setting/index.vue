<!--
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2026-01-19 10:56:54
 * @LastEditors: wuyueqin wuyueqin@merach.com
 * @LastEditTime: 2026-02-05 21:17:03
 * @FilePath: \qianyi-ui\src\components\ToolBar\components\setting\index.vue
 * @Description: 
 * 
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved. 
-->

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import Sortable from 'sortablejs';
import { Rank, Close, Search, Lock, Unlock } from '@element-plus/icons-vue';
import { useMessage } from '/@/hooks/message';
import { postSaveUserConfig, getUserConfigByMenu } from '/@/api/admin/menu';

defineOptions({ name: 'ToolBarSetting' });

// 列字段接口定义
interface IColumnField {
	title: string;
	field: string;
	checked: boolean;
	/**
	 * 是否固定列
	 * Element Plus 支持：true / 'left' / 'right' / false
	 */
	fixed: boolean | 'left' | 'right' | false | null;
	prop?: string;
	width?: number;
	[key: string]: unknown;
}

interface ColumnSettingProps {
	register?: any;
	setColumns?: (cols: IColumnField[]) => void;
	columns?: any;
}

const props = withDefaults(defineProps<ColumnSettingProps>(), {
	register: {},
	columns: {},
});
const emit = defineEmits(['setColumns']);
const visible = ref(false);
const activeTab = ref('main'); // 当前激活的标签页
const searchKeyword = ref('');
// 初始化的全部的字段
const allFields = ref<IColumnField[]>([]);
// 左侧的列表字段
const leftFields = ref<IColumnField[]>([]);
// 右侧的列表字段
const rightFields = ref<IColumnField[]>([]);

// 计算是否是全选状态（排除固定和禁用字段）
const isAllSelected = computed(() => {
	// 获取所有可操作的字段（非固定、非禁用）
	const availableLeftFields = leftFields.value.filter(
		(f: any) => !f.fixed && !f.disabled
	);
	// 如果没有可操作字段，返回 false
	if (availableLeftFields.length === 0) return false;
	// 判断所有可操作字段是否都已选中
	return availableLeftFields.every((f: any) => f.checked);
});

// 拖拽排序相关
let sortableInstance: Sortable | null = null;
const selectedFieldsListRef = ref<HTMLElement>();

const destroySortable = () => {
	if (sortableInstance) {
		sortableInstance.destroy();
		sortableInstance = null;
	}
};

const initSortable = () => {
	if (!selectedFieldsListRef.value) return;
	destroySortable();
	sortableInstance = Sortable.create(selectedFieldsListRef.value, {
		handle: '.drag-handle',
		animation: 150,
		ghostClass: 'sortable-ghost',
		chosenClass: 'sortable-chosen',
		dragClass: 'sortable-drag',
		// 限制拖拽范围：固定列只能在固定列之间拖拽，非固定列只能在非固定列之间拖拽
		onMove: (evt) => {
			const draggedElement = evt.dragged;
			const relatedElement = evt.related;
			const isDraggedFixed = draggedElement.classList.contains('is-fixed');
			const isRelatedFixed = relatedElement.classList.contains('is-fixed');
			// 如果拖拽的是固定列，只能移动到固定列的位置
			// 如果拖拽的是非固定列，只能移动到非固定列的位置
			return isDraggedFixed === isRelatedFixed;
		},
		onEnd: (evt) => {
			const { oldIndex, newIndex } = evt;
			if (
				oldIndex !== undefined &&
				newIndex !== undefined &&
				oldIndex !== newIndex
			) {
				// DOM 渲染的是 rightFields.filter(f => !f.disabled) 的子集
				// oldIndex/newIndex 是子集索引，需要映射回完整数组的真实索引
				const visibleIndices: number[] = [];
				rightFields.value.forEach((f: any, i: number) => {
					if (!f.disabled) visibleIndices.push(i);
				});

				const realOldIndex = visibleIndices[oldIndex];
				const realNewIndex = visibleIndices[newIndex];

				if (realOldIndex !== undefined && realNewIndex !== undefined) {
					const movedItem = rightFields.value.splice(realOldIndex, 1)[0];
					rightFields.value.splice(realNewIndex, 0, movedItem);
				}
			}
		},
	});
};

/**
 * 获取标准的列配置数据
 * @returns 标准列配置数组
 */
const getStandardColumns = () => {
	// 深拷贝获取标准的列配置数据
	allFields.value = JSON.parse(JSON.stringify(props?.columns || []));
};

/**
 * 组装最终列配置：typeColumns 永远最前（fixed: 'left'），
 * 然后用户左固定列 → 普通列 → 用户右固定列
 */
const buildSetColumns = (userFields: any[]) => {
	const typeColumns = allFields.value
		.filter((f: any) => f.type)
		.map((f: any) => ({ ...f, fixed: 'left' }));
	const userLeftFixed = userFields.filter(
		(f: any) => f.fixed === 'left' || f.fixed === true
	);
	const userNormal = userFields.filter((f: any) => !f.fixed);
	const userRightFixed = userFields.filter((f: any) => f.fixed === 'right');
	return [...typeColumns, ...userLeftFixed, ...userNormal, ...userRightFixed];
};

/**
 * 初始化字段列表
 */
const init = async () => {
	// 获取标准的列配置数据
	getStandardColumns();
	leftFields.value = Array.from(allFields.value || []).filter((field: any) => {
		return field.type === undefined;
	});

	// 第二步确定好是否有传入settingKey，如果存在就说明有后台配置
	const settingKey = props?.register?.state?.toolBarConfig?.settingKey;
	if (settingKey) {
		// 第三步，如果有后台配置，就先获取后台配置
		const res = await getUserConfigByMenu({ menu: settingKey });
		if (res?.data?.showField) {
			// 第四步，如果有后台配置，就先获取后台配置
			const savedFields = JSON.parse(res.data.showField);
			// 创建一个 Map，以 field 为 key，快速查找 allFields 中的完整字段对象
			const allFieldsMap = new Map(
				allFields.value.map((field: any) => [field.field, field])
			);
			// 按照 savedFields 的顺序，从 allFieldsMap 中取出对应的字段，并合并 savedFields 中的配置
			const savedFieldsList = savedFields
				.map((savedField: any) => {
					const baseField = allFieldsMap.get(savedField.field);
					if (!baseField) return undefined;
					// 合并基础字段和保存的配置，保存的配置优先级更高
					return {
						...baseField,
						...savedField,
					};
				})
				.filter((field: any) => field !== undefined); // 过滤掉不存在的字段和禁用字段
			rightFields.value = savedFieldsList;
		} else {
			rightFields.value = Array.from(allFields.value).filter((field: any) => {
				return field.type === undefined;
			});
		}
	} else {
		rightFields.value = Array.from(allFields.value).filter((field: any) => {
			return field.type === undefined;
		});
	}
	// 基于右侧字段，设置好leftFields的checked属性 如果右侧字段中存在这个字段，则设置为true，否则设置为false
	leftFields.value.forEach((field: any) => {
		field.checked = rightFields.value.find((f: any) => f.field === field.field)
			? true
			: false;
	});

	// typeColumns（checkbox/expand 等）强制 fixed: 'left'，永远排在最前，通过 buildSetColumns 统一处理
	// 最后更新
	emit(
		'setColumns',
		JSON.parse(JSON.stringify(buildSetColumns(rightFields.value)))
	);
};
/**
 * 选中字段函数
 * @param field 字段对象
 * */
const handleChecked = (field: any) => {
	// 如果这个字段是选中状态，则将这个字段添加到右侧字段中，否则将这个字段从右侧字段中删除
	if (field.checked) {
		rightFields.value.push(field);
	} else {
		rightFields.value = rightFields.value.filter(
			(f: any) => f.field !== field.field
		);
	}
};
/**
 * 置顶并且锁住
 * @param field 字段对象
 * */
const handleTop = (field: any) => {
	// 如果这个字段是固定列就取消固定
	if (field.fixed) {
		// 找到第一个非固定列的位置
		const firstNonFixedIndex = rightFields.value.findIndex(
			(f: any) => !f.fixed
		);
		// 从当前位置移除该字段
		const currentIndex = rightFields.value.findIndex(
			(f: any) => f.field === field.field
		);
		if (currentIndex !== -1) {
			rightFields.value.splice(currentIndex, 1);
			// 如果找到了非固定列的位置，插入到该位置；否则追加到末尾
			if (firstNonFixedIndex !== -1) {
				// 如果当前字段在第一个非固定列之前，移除后插入位置需要减1
				const insertIndex =
					currentIndex < firstNonFixedIndex
						? firstNonFixedIndex - 1
						: firstNonFixedIndex;
				rightFields.value.splice(insertIndex, 0, field);
			} else {
				rightFields.value.push(field);
			}
		}
		field.fixed = null;
	} else {
		// 从当前位置移除该字段
		const currentIndex = rightFields.value.findIndex(
			(f: any) => f.field === field.field
		);
		if (currentIndex !== -1) {
			rightFields.value.splice(currentIndex, 1);
		}
		// 找到最后一个固定列的位置
		let lastFixedIndex = -1;
		for (let i = rightFields.value.length - 1; i >= 0; i--) {
			// 如果这个字段是固定列，并且不是禁用字段，并且固定列是左固定，则找到最后一个固定列的位置
			if (
				rightFields.value[i].fixed &&
				!rightFields.value[i].disabled &&
				rightFields.value[i].fixed === 'left'
			) {
				lastFixedIndex = i;
				break;
			}
		}
		// 如果找到了固定列，插入到最后一个固定列的后面；否则放到最前面
		if (lastFixedIndex !== -1) {
			rightFields.value.splice(lastFixedIndex + 1, 0, field);
		} else {
			rightFields.value.unshift(field);
		}
		field.fixed = 'left';
	}
};
/**
 * 删除字段
 */
const handleRemove = (field: any) => {
	// 如果这个字段是禁用字段就不在删除
	if (field.disabled) {
		return;
	}
	// 如果是固定列就先取消固定，然后再进行删除
	if (field.fixed) {
		field.fixed = null;
	}
	// 将这个字段从右侧字段中删除
	rightFields.value = rightFields.value.filter(
		(f: any) => f.field !== field.field
	);
	// 在左侧字段中取消选中
	leftFields.value.forEach((f: any) => {
		if (f.field === field.field) {
			f.checked = false;
		}
	});
};
/**
 * 搜索字段
 * @param keyword 搜索关键词
 */
const handleSearch = (keyword: string) => {
	if (keyword) {
		leftFields.value = leftFields.value.filter((f: any) => {
			return f.title.includes(keyword);
		});
	} else {
		leftFields.value = Array.from(allFields.value).filter((field: any) => {
			return field.type === undefined;
		});
	}
};

/**
 * 全选和取消全选
 */
const handleSelectAll = () => {
	// 判断当前是否是全选状态（所有非锁定字段都已选中）
	const unlockedLeftFields = leftFields.value.filter((f: any) => !f.fixed);
	const isAllSelected = unlockedLeftFields.every((f: any) => f.checked);
	if (isAllSelected) {
		// 取消全选：只保留禁用字段
		rightFields.value = rightFields.value.filter((f: any) => f.disabled);
		// 将左侧非锁定和禁用字段全部取消选中
		leftFields.value.forEach((f: any) => {
			if (!f.disabled) {
				f.checked = false;
			}
		});
	} else {
		// 全选：只添加未选中的非锁定和禁用字段
		const fieldsToAdd = leftFields.value.filter((f: any) => {
			// 跳过锁定字段
			if (f.fixed) return false;
			// 跳过禁用字段
			if (f.disabled) return false;
			// 跳过已经在右侧的字段
			if (rightFields.value.find((rf: any) => rf.field === f.field)) {
				return false;
			}
			return true;
		});
		// 将未选中的非锁定和禁用字段添加到右侧
		rightFields.value = rightFields.value.concat(fieldsToAdd);
		// 将左侧非锁定字段全部设为选中
		leftFields.value.forEach((f: any) => {
			if (!f.fixed && !f.disabled) {
				f.checked = true;
			}
		});
	}
};
// 确认保存
const confirm = async () => {
	// 保证有至少一个值(不包含禁用字段)
	if (rightFields.value.filter((f: any) => !f.disabled).length === 0) {
		useMessage().warning('请至少选择一个字段');
		return;
	}

	const setColumns = buildSetColumns(rightFields.value);
	const settingKey = props?.register?.state?.toolBarConfig?.settingKey;
	if (settingKey) {
		// 保存到后台
		const res = await postSaveUserConfig({
			menu: settingKey,
			showField: JSON.stringify(rightFields.value),
		});
		if (res.code === 0) {
			useMessage().success('保存成功');
			// 更新列配置
			emit('setColumns', JSON.parse(JSON.stringify(setColumns)));
			close();
		}
	} else {
		// 更新列配置
		emit('setColumns', JSON.parse(JSON.stringify(setColumns)));
		close();
	}
};
/**
 * 重置
 * 重置为默认配置和数据重置
 */
const reset = async () => {
	// 获取标准的列配置数据
	getStandardColumns();
	leftFields.value = Array.from(allFields.value).filter((field: any) => {
		return !field.type;
	});
	// 重置右侧字段
	rightFields.value = Array.from(allFields.value).filter((field: any) => {
		return !field.type;
	});
	// 取消所有字段的固定状态（跳过禁用的字段）
	leftFields.value.forEach((field: any) => {
		if (!field.disabled) {
			field.fixed = null;
		}
	});
	rightFields.value.forEach((field: any) => {
		if (!field.disabled) {
			field.fixed = null;
		}
	});
	// 重置左侧字段选中状态
	leftFields.value.forEach((field: any) => {
		field.checked = rightFields.value.find((f: any) => f.field === field.field)
			? true
			: false;
	});
};

// 打开弹窗
const open = async () => {
	visible.value = true;
	await init();
	nextTick(() => {
		initSortable();
	});
};

// 关闭弹窗
const close = () => {
	visible.value = false;
	destroySortable();
	searchKeyword.value = '';
};

onMounted(() => {
	init();
});

onUnmounted(() => {
	destroySortable();
});

defineExpose({ open, close });
</script>
<template>
	<el-dialog
		v-model="visible"
		:close-on-click-modal="false"
		title="自定义列配置"
		width="75%"
		@close="close"
		draggable
	>
		<div class="dialog-container">
			<!-- 标签页 -->
			<el-tabs v-model="activeTab" class="config-tabs">
				<el-tab-pane label="主列表配置" name="main" />
			</el-tabs>
			<!-- 主要内容区域 -->
			<div class="content-wrapper">
				<!-- 左侧：字段选择区域 -->
				<div class="fields-selection">
					<!-- 左侧标题 -->
					<div class="section-header">
						<span class="section-title">可选字段</span>
						<span class="field-count"
							>({{
								leftFields.filter((f: any) => !f.disabled).length
							}}
							个)</span
						>
					</div>
					<!-- 搜索框 -->
					<div class="search-box">
						<el-input
							v-model="searchKeyword"
							placeholder="搜索字段名称"
							clearable
							:prefix-icon="Search"
							@change="handleSearch"
						/>
					</div>
					<!-- 字段网格 -->
					<div class="fields-grid">
						<div
							v-for="field in leftFields"
							:key="field.field"
							class="field-item"
						>
							<el-checkbox
								v-model="field.checked"
								:label="field.title"
								:disabled="field.disabled"
								@change="handleChecked(field)"
							/>
						</div>
					</div>
				</div>

				<!-- 右侧：已选字段及排序区域 -->
				<div class="selected-fields">
					<!-- 右侧标题 -->
					<div class="section-header">
						<span class="section-title">已选字段及展示顺序</span>
						<span class="field-count"
							>({{
								rightFields.filter((f: any) => !f.disabled).length
							}}
							个)</span
						>
					</div>

					<!-- 固定列提示 -->
					<div class="fixed-tip">
						<span class="tip-text"
							>带*号为固定列字段，固定列只能在固定列之间调整顺序，不可删除</span
						>
					</div>

					<!-- 已选字段列表（可拖拽排序） -->
					<div ref="selectedFieldsListRef" class="selected-list">
						<div
							v-for="field in rightFields.filter((f: any) => !f.disabled)"
							:key="field.field"
							class="selected-item"
							:class="{
								'is-fixed': Boolean(field.fixed),
							}"
						>
							<!-- 拖拽手柄（非禁用字段显示） -->
							<div v-if="!field.disabled" class="drag-handle">
								<el-icon><Rank /></el-icon>
							</div>

							<!-- 字段名称 -->
							<span class="field-title">
								{{ field.fixed ? '*' : '' }}{{ field.title }}
							</span>

							<!-- 操作按钮 -->
							<div class="field-actions">
								<!-- 固定按钮 -->
								<el-tooltip
									:content="field.fixed ? '取消固定' : '固定'"
									placement="top"
									:disabled="field.disabled"
								>
									<el-button
										link
										size="small"
										class="action-btn fixed-btn"
										:type="field.fixed ? 'primary' : 'default'"
										:disabled="field.disabled"
										@click="handleTop(field)"
									>
										<el-icon v-if="field.fixed">
											<Unlock />
										</el-icon>
										<el-icon v-else>
											<Lock />
										</el-icon>
									</el-button>
								</el-tooltip>

								<!-- 删除按钮 -->
								<el-button
									link
									size="small"
									class="action-btn remove-btn"
									:disabled="field.disabled"
									@click="handleRemove(field)"
								>
									<el-icon><Close /></el-icon>
								</el-button>
							</div>
						</div>
					</div>

					<!-- 空状态提示 -->
					<div v-if="rightFields.length === 0" class="empty-tip">
						<span>请从左侧选择需要显示的字段</span>
					</div>
				</div>
			</div>
		</div>

		<!-- 底部按钮区域 -->
		<template #footer>
			<div class="dialog-footer">
				<div class="footer-left">
					<span class="tip-text">提示：拖拽右侧字段可调整顺序</span>
				</div>
				<div class="footer-right">
					<el-button @click="reset">初始化</el-button>
					<el-button @click="handleSelectAll">
						{{ isAllSelected ? '取消全选' : '全选' }}
					</el-button>
					<el-button @click="close">取消</el-button>
					<el-button type="primary" @click="confirm">确认保存</el-button>
				</div>
			</div>
		</template>
	</el-dialog>
</template>
<style lang="scss" scoped>
// ========== 对话框容器 ==========
.dialog-container {
	padding: 0;
	height: 550px;
	display: flex;
	flex-direction: column;
}

// ========== 标签页样式 ==========
.config-tabs {
	:deep(.el-tabs__header) {
		margin: 0 0 20px 0;
	}

	:deep(.el-tabs__item) {
		padding: 0 20px;
		font-size: 15px;
	}
}

// ========== 主内容区域 ==========
.content-wrapper {
	flex: 1;
	display: flex;
	gap: 24px;
	overflow: hidden;
}

// ========== 左侧：字段选择区域 ==========
.fields-selection {
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	padding-right: 12px;
}

.section-header {
	display: flex;
	align-items: center;
	margin-bottom: 16px;

	.section-title {
		font-size: 15px;
		font-weight: 600;
		color: #303133;
	}

	.field-count {
		margin-left: 8px;
		font-size: 13px;
		color: #909399;
	}
}

.search-box {
	margin-bottom: 16px;

	:deep(.el-input__wrapper) {
		box-shadow: 0 0 0 1px #dcdfe6 inset;
	}
}

.fields-grid {
	flex: 1;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 14px 20px;
	overflow-y: auto;
	padding-right: 8px;
	align-content: start;
}

.field-item {
	:deep(.el-checkbox) {
		width: 100%;
		height: 100%;

		.el-checkbox__label {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			font-size: 14px;
			color: #606266;
		}

		&:hover .el-checkbox__label {
			color: #409eff;
		}
	}
}

// ========== 右侧：已选字段区域 ==========
.selected-fields {
	width: 340px;
	display: flex;
	flex-direction: column;
	border-left: 2px solid #e4e7ed;
	padding-left: 24px;
	overflow: hidden;
}

.fixed-tip {
	display: flex;
	align-items: center;
	gap: 6px;
	padding: 10px 12px;
	margin-bottom: 12px;
	background-color: #f4f4f5;
	border-radius: 4px;

	.el-icon {
		font-size: 14px;
		color: #409eff;
	}

	.tip-text {
		font-size: 12px;
		color: #606266;
		line-height: 1.5;
	}
}

.selected-list {
	flex: 1;
	overflow-y: auto;
	padding-right: 8px;
}

.selected-item {
	display: flex;
	align-items: center;
	padding: 10px 12px;
	margin-bottom: 8px;
	background-color: #fff;
	border: 1px solid #e4e7ed;
	border-radius: 6px;
	transition: all 0.2s;

	&:hover {
		background-color: #f5f7fa;
		border-color: #c0c4cc;
		transform: translateX(2px);
	}

	.drag-handle {
		margin-right: 10px;
		color: #909399;
		cursor: move;
		display: flex;
		align-items: center;
		font-size: 16px;

		&:hover {
			color: #606266;
		}
	}

	.field-title {
		flex: 1;
		color: #303133;
		font-size: 14px;
		font-weight: 500;
	}

	.field-actions {
		display: flex;
		align-items: center;
		gap: 4px;

		.action-btn {
			padding: 4px;
			font-size: 16px;

			&.fixed-btn {
				color: #909399;

				&:hover {
					color: #409eff;
				}

				&.el-button--primary {
					color: #409eff;
				}
			}

			&.remove-btn {
				color: #909399;

				&:hover:not(:disabled) {
					color: #f56c6c;
				}

				&:disabled {
					cursor: not-allowed;
					opacity: 0.3;
				}
			}
		}
	}

	&.is-fixed {
		background-color: #ecf5ff;
		border-color: #d9ecff;

		.field-title {
			color: #409eff;
		}

		.drag-handle {
			color: #409eff;

			&:hover {
				color: #66b1ff;
			}
		}
	}
}

// 空状态提示
.empty-tip {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 200px;
	color: #909399;
	font-size: 14px;
}

// ========== 拖拽排序样式 ==========
.sortable-ghost {
	opacity: 0.4;
	background-color: #f5f7fa;
}

.sortable-chosen {
	background-color: #ecf5ff;
	border-color: #409eff;
}

.sortable-drag {
	opacity: 0.8;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

// ========== 底部按钮区域 ==========
.dialog-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-top: 8px;

	.footer-left {
		.tip-text {
			font-size: 13px;
			color: #909399;
		}
	}

	.footer-right {
		display: flex;
		gap: 12px;
	}
}

// ========== 滚动条美化 ==========
.fields-grid,
.selected-list {
	&::-webkit-scrollbar {
		width: 6px;
		height: 6px;
	}

	&::-webkit-scrollbar-thumb {
		background-color: #dcdfe6;
		border-radius: 3px;

		&:hover {
			background-color: #c0c4cc;
		}
	}

	&::-webkit-scrollbar-track {
		background-color: #f5f7fa;
		border-radius: 3px;
	}
}
</style>
