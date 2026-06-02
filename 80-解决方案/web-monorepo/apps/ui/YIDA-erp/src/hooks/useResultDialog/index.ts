/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-08-08 17:45:07
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-08-11 11:19:59
 * @FilePath: \qianyi-ui\src\hooks\useResultDialog\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
// src/hooks/useResultDialog/index.ts
import { createVNode, render, nextTick, getCurrentInstance } from 'vue';
import ShowResultDialog from '/@/components/fileUpload/showResult.vue';

// 组件通过 defineExpose 暴露的方法类型
type DialogExpose = {
	setData: (p: { data: any; title: string }) => void; // 设置弹窗数据
	show: () => void; // 显示弹窗
	close?: () => void; // 关闭弹窗（可选）
};

// ====== 模块级单例状态（保证一个页面只有一个该弹窗实例） ======
let container: HTMLElement | null = null; // 容器 DOM
let vnode: any = null; // createVNode 生成的虚拟节点
let exposed: DialogExpose | null = null; // 存放组件暴露出来的方法
let mounted = false; // 是否已经挂载过

/**
 * 等待组件渲染完成并获取 defineExpose 暴露的方法
 * @param max 最多等待的 nextTick 次数（防止死等）
 */
async function ensureExposeReady(max = 8) {
	for (let i = 0; i < max && !exposed; i++) {
		await nextTick(); // 等待下一个 DOM 更新周期
		// 从 vnode.component.exposed 拿到组件暴露的方法
		exposed = vnode?.component?.exposed as DialogExpose | null;
	}
}

export function useResultDialog() {
	// 必须在 setup 里调用，否则没有 appContext（无法继承 i18n/router/pinia 等）
	const inst = getCurrentInstance();
	if (!inst) throw new Error('useResultDialog() 必须在组件 setup 中调用');

	/**
	 * 销毁弹窗实例（释放 DOM 和内存）
	 */
	const destroy = () => {
		if (!mounted) return; // 没挂载过就不处理
		render(null, container!); // 卸载组件
		container?.remove(); // 移除容器 DOM
		container = null;
		vnode = null;
		exposed = null;
		mounted = false;
	};

	/**
	 * 确保弹窗实例存在（首次调用 open 时创建）
	 * @param onClosed 弹窗关闭后的回调（这里传 destroy，用于自动卸载）
	 */
	const ensureInstance = (onClosed: () => void) => {
		if (mounted) return; // 已经挂载过就直接返回（保持单例）

		// 每次挂载前清空旧引用，避免拿到上次的组件实例
		exposed = null;

		// 创建容器 DOM 并挂到 body
		container = document.createElement('div');
		document.body.appendChild(container);

		// 创建虚拟节点，并绑定关闭回调
		vnode = createVNode(ShowResultDialog, {
			onClosed, // ✅ 弹窗完全关闭时回调 -> destroy()
		});

		// 继承当前组件的 appContext（让弹窗也能用 i18n、router、pinia 等）
		vnode.appContext = inst.appContext;

		// 渲染到 container
		render(vnode, container);
		mounted = true;
	};

	/**
	 * 打开弹窗
	 * @param payload 弹窗需要显示的数据和标题
	 */
	const open = async (payload: { data: any; title: string }) => {
		// 确保实例已创建
		ensureInstance(destroy);

		// 等待组件暴露方法就绪
		await ensureExposeReady();
		if (!exposed) return;

		// 设置数据并显示弹窗
		exposed.setData(payload);
		exposed.show();
	};

	// 返回 open 方法：关闭由组件内部触发 @closed 自动销毁
	return { open };
}
