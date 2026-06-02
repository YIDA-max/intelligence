import { createVNode, render, ref, reactive, watch, VNode, Component, VNodeProps, getCurrentInstance } from 'vue';

// 定义返回对象的类型
interface MountResult<Exposed = any, Props = any> {
	props: Props;
	exposed: Exposed;
	mount: () => void;
	unmount: () => void;
	updateProps: (newProps: Partial<Props>) => void;
}

// 定义支持closed回调的Props类型
interface WithClosedCallback {
	closed?: (...args: any[]) => void;
}

/**
 * 组合式函数：动态挂载组件到body，支持响应式props和自动销毁
 * @param {Component} component - 要挂载的Vue3组件
 * @param {Object} initialProps - 初始props，可包含closed回调，支持响应式
 * @returns {Object} 包含props、暴露方法和操作函数的对象
 */
export function useMountComponent<Exposed = {}, Props extends object = {}>(
	component: Component & { __vccOpts?: { expose?: string[] } },
	initialProps: Props & WithClosedCallback = {} as Props & WithClosedCallback
): MountResult<Exposed, Props & WithClosedCallback> {
	const inst = getCurrentInstance();
	if (!inst) throw new Error('useMountComponent() 必须在组件 setup 中调用');

	// 保存原始closed回调
	const originalClosed = initialProps.closed;

	// 创建响应式容器存储props
	const props = reactive<Props & WithClosedCallback>({
		...initialProps,
		// 重写closed回调，先执行原始回调再销毁组件
		closed: (...args: any[]) => {
			if (typeof originalClosed === 'function') {
				originalClosed(...args);
			}
			unmount();
		},
	});

	// 存储组件相关实例
	const instance = ref<VNode['component'] | null>(null);
	const container = ref<HTMLDivElement | null>(null);
	const exposed = ref<Exposed>({} as Exposed);
	const vnode = ref<VNode | null>(null);

	// 监听props变化并更新到组件
	watch(
		() => props,
		async () => {
			if (vnode.value) {
				const newVNode = createVNode(component, { ...props } as VNodeProps);
				newVNode.appContext = inst.appContext;
				render(newVNode, container.value!);
				vnode.value = newVNode;
			}
		},
		{ deep: true }
	);
	// 挂载组件
	const mount = () => {
		// 如果已经挂载则先销毁
		if (instance.value) {
			unmount();
		}

		// 创建容器
		container.value = document.createElement('div');
		document.body.appendChild(container.value);

		// 创建虚拟节点，使用响应式props
		vnode.value = createVNode(component, props as VNodeProps);
		vnode.value.appContext = inst.appContext;
		// 渲染组件
		render(vnode.value, container.value);

		// 存储实例和暴露的方法
		instance.value = vnode.value.component as any;
		if (instance.value?.exposed) {
			exposed.value = instance.value.exposed as any;
		}
	};

	// 卸载组件
	const unmount = () => {
		if (container.value && vnode.value) {
			render(null, container.value);
			document.body.removeChild(container.value);
			instance.value = null;
			container.value = null;
			vnode.value = null;
			exposed.value = {} as any;
		}
	};

	// 手动更新props的方法
	const updateProps = (newProps: Partial<Props>) => {
		Object.assign(props, newProps);
	};

	// 自动挂载
	mount();

	return {
		props: props as Props & WithClosedCallback,
		exposed: exposed.value as Exposed,
		mount,
		unmount,
		updateProps,
	};
}
