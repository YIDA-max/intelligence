// 待办事项应用 - 传统 JavaScript 实现（无构建工具）

// 状态管理
let todos = [];
let currentFilter = 'all';

// DOM 元素
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter-btn');
const todoCount = document.getElementById('todoCount');
const clearCompletedBtn = document.getElementById('clearCompleted');

// 从 localStorage 加载数据
function loadTodos() {
	const savedTodos = localStorage.getItem('todos');
	if (savedTodos) {
		todos = JSON.parse(savedTodos);
	}
	renderTodos();
}

// 保存数据到 localStorage
function saveTodos() {
	localStorage.setItem('todos', JSON.stringify(todos));
}

// 添加待办事项
function addTodo(text) {
	if (!text.trim()) {
		alert('请输入待办事项内容！');
		return;
	}

	const newTodo = {
		id: Date.now(),
		text: text.trim(),
		completed: false,
		createdAt: new Date().toISOString(),
	};

	todos.push(newTodo);
	saveTodos();
	renderTodos();
	todoInput.value = '';
}

// 删除待办事项
function deleteTodo(id) {
	todos = todos.filter((todo) => todo.id !== id);
	saveTodos();
	renderTodos();
}

// 切换完成状态
function toggleTodo(id) {
	todos = todos.map((todo) => {
		if (todo.id === id) {
			return { ...todo, completed: !todo.completed };
		}
		return todo;
	});
	saveTodos();
	renderTodos();
}

// 清除已完成
function clearCompleted() {
	todos = todos.filter((todo) => !todo.completed);
	saveTodos();
	renderTodos();
}

// 过滤待办事项
function getFilteredTodos() {
	switch (currentFilter) {
		case 'active':
			return todos.filter((todo) => !todo.completed);
		case 'completed':
			return todos.filter((todo) => todo.completed);
		default:
			return todos;
	}
}

// 渲染待办事项列表
function renderTodos() {
	const filteredTodos = getFilteredTodos();

	if (filteredTodos.length === 0) {
		todoList.innerHTML = `
      <li class="empty-state">
        <div class="empty-state-icon">📭</div>
        <div class="empty-state-text">
          ${
						currentFilter === 'all'
							? '还没有待办事项，添加一个吧！'
							: currentFilter === 'active'
							? '太棒了！所有任务都完成了！'
							: '还没有完成的任务'
					}
        </div>
      </li>
    `;
	} else {
		todoList.innerHTML = filteredTodos
			.map(
				(todo) => `
      <li class="todo-item ${todo.completed ? 'completed' : ''}">
        <input 
          type="checkbox" 
          class="todo-checkbox" 
          ${todo.completed ? 'checked' : ''}
          onchange="toggleTodo(${todo.id})"
        >
        <span class="todo-text">${escapeHtml(todo.text)}</span>
        <button class="delete-btn" onclick="deleteTodo(${
					todo.id
				})">删除</button>
      </li>
    `
			)
			.join('');
	}

	// 更新计数
	const activeCount = todos.filter((todo) => !todo.completed).length;
	todoCount.textContent = `${activeCount} 项待办`;

	// 更新清除按钮显示
	const hasCompleted = todos.some((todo) => todo.completed);
	clearCompletedBtn.style.display = hasCompleted ? 'block' : 'none';
}

// HTML 转义（防止 XSS）
function escapeHtml(text) {
	const div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}

// 更新过滤器
function updateFilter(filter) {
	currentFilter = filter;
	filterBtns.forEach((btn) => {
		if (btn.dataset.filter === filter) {
			btn.classList.add('active');
		} else {
			btn.classList.remove('active');
		}
	});
	renderTodos();
}

// 事件监听
addBtn.addEventListener('click', () => {
	addTodo(todoInput.value);
});

todoInput.addEventListener('keypress', (e) => {
	if (e.key === 'Enter') {
		addTodo(todoInput.value);
	}
});

filterBtns.forEach((btn) => {
	btn.addEventListener('click', () => {
		updateFilter(btn.dataset.filter);
	});
});

clearCompletedBtn.addEventListener('click', clearCompleted);

// 将函数暴露到全局作用域（供内联事件使用）
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;

// 初始化应用
loadTodos();
