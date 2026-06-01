/**
 * 创建“顺序执行 + 最小间隔”的异步任务队列。
 *
 * 适用场景：
 * - 短时间内会触发大量请求，但不能并发过高；
 * - 每个任务都必须执行，不能丢弃；
 * - 需要控制任务启动频率（例如接口限流）。
 */
export const createRateLimitQueue = (minIntervalMs = 120) => {
	// 队列尾指针：后续任务总是挂到尾部，保证串行执行。
	let queueTail: Promise<unknown> = Promise.resolve();
	// 记录上一个任务的启动时间，用于计算最小间隔。
	let lastTaskStartAt = 0;

	const sleep = (ms: number) =>
		new Promise<void>((resolve) => {
			setTimeout(resolve, ms);
		});

	/**
	 * 入队执行一个异步任务。
	 * - 不丢任务：每个入队任务都会执行。
	 * - 限速：相邻任务启动时间至少间隔 minIntervalMs。
	 */
	const enqueue = async <T>(task: () => Promise<T>): Promise<T> => {
		const run = async () => {
			const now = Date.now();
			const elapsed = now - lastTaskStartAt;
			const waitMs = Math.max(0, minIntervalMs - elapsed);
			if (waitMs > 0) {
				await sleep(waitMs);
			}

			lastTaskStartAt = Date.now();
			return task();
		};

		const current = queueTail.then(run, run);
		// 无论当前任务成功还是失败，都要推进队列尾，避免队列中断。
		queueTail = current.then(
			() => undefined,
			() => undefined
		);
		return current;
	};

	return { enqueue };
};
