<template>
	<el-dialog
		title="公式编辑"
		v-model="visible"
		width="800px"
		:close-on-click-modal="false"
		:before-close="dialogBeforeClose"
		append-to-body
		@open="init"
	>
		<div class="x-formula-editor">
			<div class="formula-head">
				<span class="formula-name">辅助字段（不可见）</span>
			</div>
			<div id="divFormula" contenteditable="true" @blur="setLastCursor"></div>
		</div>

		<div class="x-layout-table-row">
			<div class="x-layout-table-item">
				<div class="field-label">可用变量</div>
				<div class="field-main">
					<div class="field-title">当前可用字段</div>
					<ul class="menu-list">
						<li class="field-item" @click.stop="insertField(field)" v-for="(field, i) in fieldList" :key="i">
							<span :title="field.fieldTitle">{{ field.fieldName }}</span>
							<el-tag size="small" type="success">{{ enumType(field.fieldType) }}</el-tag>
						</li>
					</ul>
				</div>
			</div>

			<div class="x-layout-table-item fx_formula_info">
				<div class="field-label">条件 / 函数</div>
				<div class="formula-menu">
					<div class="field-title">
						<el-input placeholder="搜索条件 / 函数" size="small" v-model="filterText" @blur="treeRef.filter(filterText?.toUpperCase())">
							<template #prefix>
								<el-icon><Search /></el-icon>
							</template>
						</el-input>
					</div>

					<el-tree
						:data="methodsOptions"
						icon-class="el-icon-arrow-right"
						:filter-node-method="filterNode"
						@node-click="insertMethods"
						ref="treeRef"
					/>
				</div>
			</div>
		</div>

		<template #footer>
			<el-button size="small" @click="dialogBeforeClose">取 消</el-button>
			<el-button size="small" type="primary" @click="calculate">确 定</el-button>
		</template>
	</el-dialog>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { Parser as FormulaParser } from 'hot-formula-parser';
import { methodsOptionsFn, fieldList } from '/@/components/BaseFormulaEditor/constant';
import { ElMessage } from 'element-plus';

// 定义最后光标对象
let lastEditRange = null;

const props = defineProps({
	defaultValue: {
		type: String,
	},
});
const emit = defineEmits(['submit']);
// 树组件引用
const treeRef = ref(null);
// 控制弹窗显示隐藏
const visible = ref(false);
// 显示弹窗
const show = () => {
	visible.value = true;
};
// 隐藏弹窗
const hide = () => {
	visible.value = false;
};
// 暴露方法给父组件
defineExpose({
	show,
	hide,
});
const filterText = ref('');
// 获取到常用条件
const methodsOptions = ref(methodsOptionsFn());

// 映射文字
const enumType = (type) => {
	const TYPE_ENUM = {
		number: '数值',
	};
	return TYPE_ENUM[type];
};

// 过滤树组件
const filterNode = (value, data) => {
	if (!value) return true;
	return data.label.indexOf(value) !== -1;
};

/**
 * 保存当前的光标/文本选区位置
 * @description 将当前选区范围保存到lastEditRange变量中
 */
const setLastCursor = () => {
	// 1. 获取当前的选区对象
	// 兼容不同浏览器的获取方式
	const selection = window.getSelection() || document.getSelection();
	// 2. 检查是否存在有效的选区范围
	if (selection && selection.rangeCount > 0) {
		// 3. 获取第一个选区范围并保存到lastEditRange变量
		lastEditRange = selection.getRangeAt(0);
	} else {
		// 可选：如果没有选区，可以重置为null或做其他处理
		lastEditRange = null;
	}
};

/**
 * 获取公式编辑区域DOM元素并自动聚焦
 * @returns {HTMLElement|null} 返回获取到的DOM元素，如果不存在则返回null
 */
const getMain = () => {
	// 1. 通过ID获取公式编辑区域的DOM元素
	const main = document.getElementById('divFormula');
	// 2. 如果元素存在（main不为null/undefined），则使其获得焦点
	// 使用逻辑与短路运算：只有main存在时才会执行focus()
	main?.focus();
	// 3. 返回获取到的元素（可能为null）
	return main;
};
/**
 * 获取当前文本选区/光标位置
 * @description 此函数会恢复上次保存的光标位置（如果有的话）
 * @returns {Selection} 返回当前文本选区对象
 */
const getCursor = () => {
	// 1. 获取当前窗口的文本选择对象
	// 兼容不同浏览器的获取方式
	const selection = window.getSelection() || document.getSelection();

	// 2. 如果存在上次保存的选区范围（lastEditRange）
	if (lastEditRange) {
		// 先清除当前的所有选区
		selection.removeAllRanges();
		// 将上次保存的选区范围添加到当前选区
		selection.addRange(lastEditRange);
	}

	// 3. 返回处理后的选区对象
	return selection;
};

/**
 * 创建一个带有特定属性和样式的span元素
 * @param {Object} params - 配置对象
 * @param {string} params._class - 要添加的CSS类名
 * @param {string} params.style - 内联样式字符串
 * @param {string} params.code - 存储在元素上的自定义数据标识
 * @param {string} params.text - 元素显示的文本内容
 * @param {boolean} [params.canEdit] - 是否设置为可编辑(contentEditable)
 * @returns {HTMLSpanElement} 创建好的span元素
 */
const createSpan = ({ _class, style, code, text, canEdit }) => {
	// 1. 创建一个新的span元素
	const fieldNode = document.createElement('span');
	// 2. 添加CSS类名
	fieldNode.classList.add(_class);
	// 3. 设置内联样式
	fieldNode.setAttribute('style', style);
	// 4. 设置可编辑属性（如果canEdit为true）
	fieldNode.contentEditable = !!canEdit; // 双感叹号确保转换为布尔值
	// 5. 设置自定义数据属性（code）
	fieldNode.setAttribute('code', code);
	// 6. 设置文本内容
	fieldNode.innerText = text;
	// 7. 返回创建好的元素
	return fieldNode;
};

/**
 * 将指定DOM节点插入到当前文本选区位置
 * @param {Selection} selection - 当前文本选区对象（来自window.getSelection()）
 * @param {Node} fieldNode - 要插入的DOM节点（通常是span元素）
 */
const insertToParent = (selection, fieldNode) => {
	// 1. 获取当前选区中的第一个范围（Range）
	// 通常一个选区只有一个范围，参数0表示第一个范围
	const range = selection.getRangeAt(0);
	// 2. 删除当前选区范围内的所有内容
	// 如果是光标位置（非选中文本），则不会有内容被删除
	range.deleteContents();
	// 3. 将新节点插入到选区范围
	range.insertNode(fieldNode);
	// 4. 将光标位置设置到新插入节点的后面
	range.setStartAfter(fieldNode);
	// 5. 清除当前所有选区范围
	selection.removeAllRanges();
	// 6. 将修改后的范围重新添加到选区
	selection.addRange(range);
};

/**
 * ul组件在可编辑区域插入字段节点
 * @param {Object} field - 要插入的字段对象
 * @param {string} field.fieldCode - 字段的唯一代码标识符
 * @param {string} field.fieldName - 字段的显示名称
 */
const insertField = (field) => {
	// 1. 获取可编辑区域DOM元素并使其获得焦点
	getMain();
	// 2. 获取当前文本选择/光标位置
	const selection = getCursor();
	// 3. 创建一个新的span元素来表示字段
	const fieldNode = createSpan({
		_class: 'cm-var', // 应用的CSS类名
		style: 'margin: 0 2px; background: #EBF5FF;color: #008DCD;', // 内联样式
		code: field.fieldCode, // 将字段代码存储在DOM元素的属性中
		text: field.fieldName, // 字段的显示文本
	});

	// 4. 将创建的字段节点插入到当前光标位置
	insertToParent(selection, fieldNode);
};

/**
 * 树组件在可编辑区域插入方法或条件字段
 * @param {Object} field - 要插入的字段对象
 * @param {string} field.type - 字段类型 ('condition'表示条件，其他表示方法)
 * @param {string} field.label - 字段显示文本
 * @param {string} field.id - 字段唯一标识（条件类型使用）
 * @param {Array} [field.children] - 子节点（如果有则表示是分组，不插入）
 */
const insertMethods = (field) => {
	// 如果字段有children属性，说明是分组节点，直接返回不处理
	if (field.children) return;
	// 获取可编辑的DOM元素并聚焦
	getMain();
	// 获取当前光标位置
	const selection = getCursor();
	let fieldNode;
	// 根据字段类型创建不同的DOM节点
	if (field.type === 'condition') {
		// 创建条件类型的span节点
		fieldNode = createSpan({
			_class: 'cm-var', // CSS类名
			style: 'margin: 0 2px; color: #ED7115;', // 内联样式
			code: field.id, // 数据标识（存储在DOM的code属性）
			text: field.label, // 显示文本
		});
	} else {
		// 创建方法类型的span节点（带可编辑的括号）
		fieldNode = createSpan({
			_class: 'cm-keyword', // CSS类名
			style: 'margin: 0 2px; color: #781287;', // 内联样式
			code: field.label, // 数据标识
			text: field.label + '()', // 显示文本（自动添加括号）
			canEdit: true, // 标记为可编辑
		});
	}

	// 将创建的节点插入到光标位置
	insertToParent(selection, fieldNode);
};
/**
 * 计算公式并提交结果
 * @description 从编辑区域获取公式，解析并计算结果
 */
const calculate = () => {
	// 1. 获取公式编辑区域的DOM元素
	const divFormula = document.getElementById('divFormula');

	// 2. 获取公式文本并移除所有空白字符
	let formulaStr = divFormula.innerText.replace(/\s/g, '');

	// 3. 检查公式是否为空
	if (!formulaStr) {
		ElMessage.warning('请输入公式');
		return;
	}
	/**
	 * 转换公式中的变量显示名为实际变量名
	 * @param {Object} params - 参数对象
	 * @param {HTMLElement} params.target - 公式DOM元素
	 * @returns {string} 转换后的公式字符串
	 */
	const switchFormula = ({ target }) => {
		// 克隆DOM节点以避免修改原始节点
		const cloneVNode = target.cloneNode(true);
		// 获取所有变量节点
		const vars = cloneVNode.getElementsByClassName('cm-var');

		// 将所有变量节点的显示文本替换为实际变量名
		for (let i = 0; i < vars.length; i++) {
			const ele = vars[i];
			ele.innerHTML = ele.getAttribute('code');
		}

		// 获取转换后的文本内容并移除空白字符
		const switchContent = cloneVNode.textContent;
		return switchContent.replace(/\s/g, '');
	};

	// 4. 转换公式中的变量名
	formulaStr = switchFormula({ target: divFormula });
	// 5. 创建公式解析器
	const parser = new FormulaParser();
	// 6. 设置变量值（使用fieldList中的字段）
	fieldList.forEach((val) => {
		// 根据字段类型设置默认值：数字类型为5，其他为true
		const value = val.fieldType === 'number' ? 5 : true;
		parser.setVariable(val.fieldCode, value);
	});
	// 7. 解析并计算公式
	const { result, error } = parser.parse(formulaStr);
	// 8. 检查公式错误
	if (error && result === null) {
		ElMessage.warning('公式错误，请仔细检查');
		return;
	}
	// 9. 准备提交的数据
	const value = {
		html: divFormula.innerHTML.replace(/div|br/g, 'span'), // 清理HTML标签
		formula: formulaStr, // 处理后的公式字符串
		testResult: result, // 计算结果
	};
	// 10. 提交结果并关闭对话框
	emit('submit', value);
	dialogBeforeClose();
};

/**
 * 对话框关闭前的清理操作
 * @description 清空公式编辑区域内容并重置相关状态
 */
const dialogBeforeClose = () => {
	// 1. 清空公式编辑区域的HTML内容
	// 注意：更安全的做法是检查元素是否存在
	const formulaEditor = document.getElementById('divFormula');
	if (formulaEditor) {
		formulaEditor.innerHTML = ''; // 使用空字符串比null更规范
	}
	// 2. 在下一个DOM更新周期执行状态重置
	nextTick(() => {
		// 3. 清除最后的光标选区记录
		lastEditRange = null;
		// 4. 更新对话框可见状态
		visible.value = false;
	});
};

// 初始化如果有默认值则设置
const init = () => {
	nextTick(() => {
		// 获取可编辑的DOM元素
		const dom = getMain();

		// 如果有默认值且DOM元素存在
		if (props.defaultValue && dom) {
			// 设置编辑区域的内容为默认值
			dom.innerHTML = props.defaultValue;

			// 聚焦到内容尾部（现代浏览器API）
			if (window.getSelection) {
				const range = getCursor(); // 获取选区对象
				range.selectAllChildren(dom); // 选中所有子元素
				range.collapseToEnd(); // 将光标折叠到选区末尾
			}
			// IE浏览器兼容处理
			else if (document.selection) {
				const range = document.selection.createRange();
				range.moveToElementText(dom); // 选中元素内容
				range.collapse(false); // 折叠到末尾
				range.select(); // 应用选区
			}
		}
	});
};
</script>

<style lang="scss" scoped>
.formula-menu {
	:deep(.el-input__inner) {
		border: none;
		border-radius: 0;
	}

	:deep(.el-tree) {
		height: 210px;
		overflow-y: auto;
	}
}

.field-item {
	width: 100%;
	overflow: hidden;
	padding: 5px 10px;
	cursor: pointer;
	box-sizing: border-box;

	&:hover {
		background: #f5f7fa;
	}

	.el-tag {
		float: right;
	}
}

.x-layout-table-row {
	overflow: hidden;
	margin-top: 10px;

	:deep(*) {
		font-size: 13px !important;
	}
}

.x-layout-table-item {
	float: left;

	:deep(.el-tabs__item) {
		color: #000;
		padding: 0 8px !important;
		height: 36px;
	}

	:deep(.el-tabs__nav-wrap::after) {
		height: 1px;
	}
}

#divFormula {
	height: 100px;
	padding: 10px;
}

.formula-head {
	padding: 6px 10px;
	background: #f3f8fb;
}

.x-formula-editor {
	border-radius: 4px;
	border: 1px solid #d3d3d3;
	overflow: hidden;
}

.field-label {
	margin-bottom: 5px;
}

.field-main,
.formula-menu {
	border-radius: 4px;
	border: 1px solid #d3d3d3;
	margin-right: 10px;
	height: 250px;
	width: 170px;
	.field-title {
		padding: 1px 10px;
		height: 30px;
		border-bottom: 1px solid #dcdfe6;
		font-weight: 500;
		display: flex;
		align-items: center;
	}
}

.formula-search {
	padding: 3px 0 0px 20px;
	border-bottom: 1px solid #dcdfe6;
	position: relative;

	> i {
		position: absolute;
		left: 8px;
		top: 12px;
	}
}
:deep(.el-input__wrapper) {
	border: 0px !important;
}
</style>
