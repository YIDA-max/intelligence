/**
 * 错误日志记录工具
 * 使用 IndexedDB 存储错误日志，只保留最新 20 条记录
 */

// 日志记录接口
export interface ErrorLog {
	id: number; // 时间戳作为唯一ID
	timestamp: string; // ISO 格式时间字符串
	message: string; // 错误信息
	stack?: string; // 错误堆栈
	url: string; // 错误页面URL
	operationType: string; // 操作类型（如：版本检测、路由切换等）
	scene?: string; // 场景参数
	errorData?: any; // 完整的错误数据
	userAgent: string; // 浏览器信息
	hasUpdate?: boolean; // 是否检测到版本更新
}

// 配置常量
const DB_NAME = 'ErrorLogDB';
const STORE_NAME = 'errorLogs';
const DB_VERSION = 1;
const MAX_LOGS = 20; // 最多保留20条日志

class ErrorLogger {
	private db: IDBDatabase | null = null;
	private initPromise: Promise<void> | null = null;

	/**
	 * 初始化 IndexedDB
	 */
	private async init(): Promise<void> {
		// 如果已经在初始化中，返回现有的 Promise
		if (this.initPromise) {
			return this.initPromise;
		}

		// 如果已经初始化完成，直接返回
		if (this.db) {
			return Promise.resolve();
		}

		this.initPromise = new Promise((resolve, reject) => {
			const request = indexedDB.open(DB_NAME, DB_VERSION);
			request.onerror = () => {
				// console.error('[ErrorLogger] 打开数据库失败:', request.error);
				this.initPromise = null;
				reject(request.error);
			};

			request.onsuccess = () => {
				this.db = request.result;
				this.initPromise = null;
				resolve();
			};

			request.onupgradeneeded = (event) => {
				const db = (event.target as IDBOpenDBRequest).result;

				// 创建对象存储（如果不存在）
				if (!db.objectStoreNames.contains(STORE_NAME)) {
					const objectStore = db.createObjectStore(STORE_NAME, {
						keyPath: 'id',
					});
					// 创建索引，方便按时间戳查询
					objectStore.createIndex('timestamp', 'timestamp', { unique: false });
				}
			};
		});

		return this.initPromise;
	}

	/**
	 * 记录错误日志
	 */
	async log(
		operationType: string,
		message: string,
		options?: {
			error?: Error | any;
			scene?: string;
			hasUpdate?: boolean;
			additionalData?: any;
		}
	): Promise<void> {
		try {
			// 确保数据库已初始化
			await this.init();

			if (!this.db) {
				// console.error('[ErrorLogger] 数据库未初始化');
				return;
			}

			// 构建日志对象
			const log: ErrorLog = {
				id: Date.now(), // 使用时间戳作为ID
				timestamp: new Date().toISOString(),
				message,
				url: window.location.href,
				operationType,
				scene: options?.scene,
				userAgent: navigator.userAgent,
				hasUpdate: options?.hasUpdate,
			};

			// 提取错误堆栈和完整错误数据
			if (options?.error) {
				if (options.error instanceof Error) {
					log.stack = options.error.stack;
					log.errorData = {
						name: options.error.name,
						message: options.error.message,
						stack: options.error.stack,
					};
				} else {
					log.errorData = options.error;
				}
			}

			// 添加额外数据
			if (options?.additionalData) {
				log.errorData = {
					...log.errorData,
					...options.additionalData,
				};
			}

			// 开启事务并添加日志
			const transaction = this.db.transaction([STORE_NAME], 'readwrite');
			const objectStore = transaction.objectStore(STORE_NAME);

			// 添加新日志
			objectStore.add(log);

			// 等待事务完成
			await new Promise<void>((resolve, reject) => {
				transaction.oncomplete = () => resolve();
				transaction.onerror = () => reject(transaction.error);
			});

			// 清理旧日志（保留最新20条）
			await this.cleanOldLogs();

			// 输出到控制台（便于开发调试）
			// console.log('[ErrorLogger] 日志已记录:', log);
		} catch (err) {
			// 日志记录失败不应影响主流程
			// console.error('[ErrorLogger] 记录日志失败:', err);
		}
	}

	/**
	 * 清理旧日志，只保留最新的 MAX_LOGS 条
	 */
	private async cleanOldLogs(): Promise<void> {
		try {
			if (!this.db) return;

			const transaction = this.db.transaction([STORE_NAME], 'readwrite');
			const objectStore = transaction.objectStore(STORE_NAME);

			// 获取所有日志的ID（按时间戳降序）
			const getAllRequest = objectStore.getAll();

			await new Promise<void>((resolve, reject) => {
				getAllRequest.onsuccess = async () => {
					const logs = getAllRequest.result as ErrorLog[];

					// 如果日志数量超过限制，删除最旧的
					if (logs.length > MAX_LOGS) {
						// 按时间戳降序排序
						logs.sort((a, b) => b.id - a.id);

						// 获取需要删除的日志ID
						const logsToDelete = logs.slice(MAX_LOGS);

						// 删除旧日志
						const deleteTransaction = this.db!.transaction(
							[STORE_NAME],
							'readwrite'
						);
						const deleteStore = deleteTransaction.objectStore(STORE_NAME);

						for (const log of logsToDelete) {
							deleteStore.delete(log.id);
						}

						await new Promise<void>((resolveDelete, rejectDelete) => {
							deleteTransaction.oncomplete = () => resolveDelete();
							deleteTransaction.onerror = () =>
								rejectDelete(deleteTransaction.error);
						});

						// console.log(
						// 	`[ErrorLogger] 已清理 ${logsToDelete.length} 条旧日志`
						// );
					}

					resolve();
				};

				getAllRequest.onerror = () => reject(getAllRequest.error);
			});
		} catch (err) {
			// console.error('[ErrorLogger] 清理旧日志失败:', err);
		}
	}

	/**
	 * 获取最近的日志记录
	 */
	async getRecentLogs(limit: number = 20): Promise<ErrorLog[]> {
		try {
			await this.init();

			if (!this.db) {
				// console.error('[ErrorLogger] 数据库未初始化');
				return [];
			}

			const transaction = this.db.transaction([STORE_NAME], 'readonly');
			const objectStore = transaction.objectStore(STORE_NAME);
			const getAllRequest = objectStore.getAll();

			return new Promise((resolve, reject) => {
				getAllRequest.onsuccess = () => {
					const logs = getAllRequest.result as ErrorLog[];
					// 按时间戳降序排序，返回最新的 limit 条
					logs.sort((a, b) => b.id - a.id);
					resolve(logs.slice(0, limit));
				};

				getAllRequest.onerror = () => reject(getAllRequest.error);
			});
		} catch (err) {
			// console.error('[ErrorLogger] 获取日志失败:', err);
			return [];
		}
	}

	/**
	 * 清空所有日志
	 */
	async clearAllLogs(): Promise<void> {
		try {
			await this.init();

			if (!this.db) {
				// console.error('[ErrorLogger] 数据库未初始化');
				return;
			}

			const transaction = this.db.transaction([STORE_NAME], 'readwrite');
			const objectStore = transaction.objectStore(STORE_NAME);
			objectStore.clear();

			await new Promise<void>((resolve, reject) => {
				transaction.oncomplete = () => resolve();
				transaction.onerror = () => reject(transaction.error);
			});

			// console.log('[ErrorLogger] 已清空所有日志');
		} catch (err) {
			// console.error('[ErrorLogger] 清空日志失败:', err);
		}
	}
}

// 导出单例
export const errorLogger = new ErrorLogger();
