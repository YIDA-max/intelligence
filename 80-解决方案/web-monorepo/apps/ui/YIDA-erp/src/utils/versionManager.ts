/**
 * 版本更新管理工具
 * 使用定时器轮询检测版本更新
 */
import { ElMessageBox } from 'element-plus';
import { errorLogger } from './errorLogger';
/* eslint-disable no-console */
// 版本信息接口
interface VersionInfo {
	version: string;
	buildTime: number;
	buildDate: string;
}

// 配置常量
const VERSION_KEY = 'app_version_info'; // localStorage 存储键
const PENDING_UPDATE_KEY = 'app_pending_update'; // 待更新状态存储键
const CHECK_INTERVAL = 60 * 60 * 1000; // 检测间隔：10分钟
const VERSION_FILE_URL = '/version.json'; // 版本文件路径
const REFRESH_TIME_KEY = 'version_refresh_time'; // sessionStorage 刷新时间戳键
const REFRESH_FLAG_KEY = 'version_refreshing'; // sessionStorage 刷新标记键
const FIRST_CHECK_DONE_KEY = 'version_first_check_done'; // sessionStorage 首次检测完成标记键

// 状态管理
let checkTimer: number | null = null; // 定时器ID
let isShowingDialog = false; // 是否正在显示弹窗
let currentVersion: VersionInfo | null = null; // 当前版本信息

// 请求控制
let lastFetchTime = 0; // 上次请求时间
const MIN_FETCH_INTERVAL = 10000; // 最小请求间隔：10秒
let pendingFetch: Promise<VersionInfo | null> | null = null; // 正在进行的请求
let abortController: AbortController | null = null; // 请求取消控制器

// 错误处理相关状态
let errorHandlerDebounceTimer: number | null = null; // 错误处理防抖定时器
let isProcessingError = false; // 是否正在处理错误
const ERROR_DEBOUNCE_DELAY = 3000; // 错误处理防抖延迟：3秒
let lastErrorTime = 0; // 上次错误处理时间
const MIN_ERROR_INTERVAL = 5000; // 最小错误处理间隔：5秒

// 倒计时定时器（提升到模块级别，便于页面卸载时清理）
let countdownTimer: number | null = null; // 版本更新弹窗倒计时定时器

/**
 * 重置所有状态（用于浏览器刷新时）
 */
function resetAllStatesAfterRefresh(): void {
	// 清除错误处理相关状态
	if (errorHandlerDebounceTimer) {
		clearTimeout(errorHandlerDebounceTimer);
		errorHandlerDebounceTimer = null;
	}
	isProcessingError = false;
	lastErrorTime = 0;

	// 清除倒计时定时器（防止内存泄漏）
	if (countdownTimer) {
		clearInterval(countdownTimer);
		countdownTimer = null;
	}

	// 取消正在进行的请求
	if (abortController) {
		abortController.abort();
		abortController = null;
	}

	// 清除请求相关状态
	pendingFetch = null;

	// 检查刷新时间间隔，决定是否重置版本获取时间戳
	try {
		const refreshTimeStr = sessionStorage.getItem(REFRESH_TIME_KEY);
		if (refreshTimeStr) {
			const refreshTime = parseInt(refreshTimeStr, 10);
			const now = Date.now();
			const timeSinceRefresh = now - refreshTime;

			// 如果距离上次刷新时间超过最小请求间隔，重置时间戳，允许立即获取版本信息
			if (timeSinceRefresh >= MIN_FETCH_INTERVAL) {
				lastFetchTime = 0; // 重置为0，允许立即重新获取版本信息
			}
			// 如果还在时间限制内，保留 lastFetchTime，避免频繁刷新时频繁获取
		} else {
			// 没有刷新时间记录，说明可能是首次访问或清理了，允许立即获取
			lastFetchTime = 0;
		}
	} catch (error) {
		// sessionStorage 访问失败，重置为0，允许获取
		lastFetchTime = 0;
	}
}

/**
 * 保存刷新时间戳（在 beforeunload 时调用）
 */
function saveRefreshTime(): void {
	try {
		const now = Date.now();
		sessionStorage.setItem(REFRESH_TIME_KEY, now.toString());
		sessionStorage.setItem(REFRESH_FLAG_KEY, 'true');
	} catch (error) {
		// 忽略错误
	}
}

/**
 * 处理浏览器刷新后的初始化
 */
function handleBrowserRefresh(): void {
	try {
		// 检查是否有刷新标记
		const isRefreshing = sessionStorage.getItem(REFRESH_FLAG_KEY);
		if (isRefreshing === 'true') {
			// 清除刷新标记
			sessionStorage.removeItem(REFRESH_FLAG_KEY);

			// 刷新后清除待更新状态（因为刷新后本地版本应该已经是最新的）
			clearPendingUpdate();

			// 重置所有状态（会根据时间间隔判断是否允许立即获取版本信息）
			resetAllStatesAfterRefresh();

			// 刷新后清除首次检测标记，刷新后的首次检测不弹窗
			sessionStorage.removeItem(FIRST_CHECK_DONE_KEY);
		}
		// 注意：如果 sessionStorage 中没有刷新标记，说明是首次访问或重新打开页面
		// 此时 sessionStorage 是空的（首次访问）或已被清除（重新打开），
		// FIRST_CHECK_DONE_KEY 自然不存在，会被视为首次检测，不会弹窗
	} catch (error) {
		// 忽略错误
	}
}

/**
 * 获取服务器版本信息（带防抖、取消和重试机制）
 */
async function fetchServerVersion(retryCount = 0): Promise<VersionInfo | null> {
	const MAX_RETRIES = 2; // 最大重试次数
	const RETRY_DELAY = 2000; // 重试延迟：2秒
	const now = Date.now();

	// 如果有正在进行的请求，直接返回该 Promise（防止重复请求）
	if (pendingFetch) {
		// console.log('[版本检测] 已有请求进行中，复用该请求');
		return pendingFetch;
	}

	// 如果距离上次请求时间太短，跳过本次检测（防抖）
	if (now - lastFetchTime < MIN_FETCH_INTERVAL) {
		// const waitTime = Math.ceil((MIN_FETCH_INTERVAL - (now - lastFetchTime)) / 1000);
		// console.log(`[版本检测] 请求过于频繁，跳过本次检测（需等待 ${waitTime} 秒）`);
		return null;
	}

	// 取消之前未完成的请求
	if (abortController) {
		abortController.abort();
		abortController = null;
	}

	// 更新最后请求时间
	lastFetchTime = now;

	// 创建新的取消控制器
	abortController = new AbortController();
	const currentController = abortController;

	// 创建请求 Promise
	pendingFetch = (async () => {
		try {
			// 添加时间戳防止缓存
			const timestamp = new Date().getTime();
			const response = await fetch(`${VERSION_FILE_URL}?t=${timestamp}`, {
				method: 'GET',
				headers: {
					'Cache-Control': 'no-cache',
					Pragma: 'no-cache',
				},
				signal: currentController.signal,
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}`);
			}

			const versionInfo: VersionInfo = await response.json();
			// console.log('[版本检测] 服务器版本:', versionInfo);
			return versionInfo;
		} catch (error: any) {
			// 请求被取消
			if (error.name === 'AbortError') {
				// console.log('[版本检测] 请求已取消');
				return null;
			}

			// 网络错误或其他错误
			// console.warn(`[版本检测] 请求失败 (尝试 ${retryCount + 1}/${MAX_RETRIES + 1}):`, error.message || error);

			// 如果还有重试次数，等待后重试
			if (retryCount < MAX_RETRIES) {
				const delay = RETRY_DELAY * Math.pow(2, retryCount); // 指数退避
				// console.log(`[版本检测] ${delay / 1000} 秒后进行第 ${retryCount + 2} 次尝试...`);

				// 等待指定时间
				await new Promise((resolve) => setTimeout(resolve, delay));

				// 清理状态，准备重试
				pendingFetch = null;
				abortController = null;
				lastFetchTime = 0; // 重置时间，允许立即重试

				// 递归重试
				return fetchServerVersion(retryCount + 1);
			}

			return null;
		} finally {
			// 清理状态
			if (currentController === abortController) {
				abortController = null;
			}
			pendingFetch = null;
		}
	})();

	return pendingFetch;
}

/**
 * 获取本地缓存的版本信息
 */
function getLocalVersion(): VersionInfo | null {
	try {
		const versionStr = localStorage.getItem(VERSION_KEY);
		if (!versionStr) return null;
		return JSON.parse(versionStr);
	} catch (error) {
		// console.warn('[版本检测] 读取本地版本失败:', error);
		return null;
	}
}

/**
 * 保存版本信息到本地
 */
function saveLocalVersion(versionInfo: VersionInfo): void {
	try {
		localStorage.setItem(VERSION_KEY, JSON.stringify(versionInfo));
		currentVersion = versionInfo;
	} catch (error) {
		// console.warn('[版本检测] 保存版本信息失败:', error);
	}
}

/**
 * 获取待更新状态
 */
function getPendingUpdate(): VersionInfo | null {
	try {
		const pendingStr = localStorage.getItem(PENDING_UPDATE_KEY);
		if (!pendingStr) return null;
		return JSON.parse(pendingStr);
	} catch (error) {
		// console.warn('[版本检测] 读取待更新状态失败:', error);
		return null;
	}
}

/**
 * 设置待更新状态
 */
function setPendingUpdate(versionInfo: VersionInfo): void {
	try {
		localStorage.setItem(PENDING_UPDATE_KEY, JSON.stringify(versionInfo));
		// console.log('[版本检测] 已记录待更新状态:', versionInfo.version);
	} catch (error) {
		// console.warn('[版本检测] 保存待更新状态失败:', error);
	}
}

/**
 * 清除待更新状态
 */
function clearPendingUpdate(): void {
	try {
		localStorage.removeItem(PENDING_UPDATE_KEY);
		// console.log('[版本检测] 已清除待更新状态');
	} catch (error) {
		// console.warn('[版本检测] 清除待更新状态失败:', error);
	}
}

/**
 * 比较版本是否有更新
 */
function hasVersionUpdate(
	localVersion: VersionInfo | null,
	serverVersion: VersionInfo
): boolean {
	if (!localVersion) return false;

	// 比较构建时间
	const isUpdated = serverVersion.buildTime > localVersion.buildTime;

	if (isUpdated) {
		// console.log('[版本检测] 检测到新版本');
		// console.log('  本地版本:', localVersion.version, '构建时间:', new Date(localVersion.buildTime).toLocaleString());
		// console.log('  服务器版本:', serverVersion.version, '构建时间:', new Date(serverVersion.buildTime).toLocaleString());
	}

	return isUpdated;
}

/**
 * 执行刷新操作（提取为公共函数）
 */
function executeRefresh(serverVersion: VersionInfo): void {
	// console.log('[版本检测] 执行刷新操作');
	// 停止所有检测，防止刷新前再次触发
	stopVersionCheck();
	// 取消正在进行的请求
	if (abortController) {
		abortController.abort();
		abortController = null;
	}
	// 清除待更新状态
	clearPendingUpdate();
	// 保存版本信息
	saveLocalVersion(serverVersion);
	// 保存刷新时间戳
	saveRefreshTime();
	setTimeout(() => {
		window.location.reload();
	}, 300);
}

/**
 * 显示版本更新提示弹窗
 */
async function showUpdateDialog(serverVersion: VersionInfo): Promise<void> {
	// 防止重复弹窗
	if (isShowingDialog) {
		// console.log('[版本检测] 已有弹窗显示中，跳过');
		return;
	}

	isShowingDialog = true;

	const localVersion = getLocalVersion();

	// 检查当前时间是否 >= 20:00（晚上8点）
	const now = new Date();
	const currentHour = now.getHours();
	const shouldAutoRefresh = currentHour >= 19;

	// 倒计时相关变量
	let countdown = 10; // 10秒倒计时
	// 注意：countdownTimer 已在模块级别声明，这里直接使用
	// 如果已经有倒计时定时器在运行，先清理（防止重复启动）
	if (countdownTimer) {
		clearInterval(countdownTimer);
		countdownTimer = null;
	}

	// 生成消息内容
	const generateMessage = (remainingSeconds?: number) => {
		const countdownHtml =
			shouldAutoRefresh && remainingSeconds !== undefined
				? `<p style="color: #F56C6C; margin-bottom: 8px; font-size: 13px; font-weight: 500;">⏰ ${remainingSeconds} 秒后自动刷新页面...</p>`
				: '';

		return `
			<div style="line-height: 1.8; text-align: left;">
				<p style="margin-bottom: 12px; font-weight: 500; font-size: 14px;">检测到系统已更新到最新版本</p>
				<p style="color: #E6A23C; margin-bottom: 8px; font-size: 13px;">⚠️ 不刷新页面可能出现加载错误、功能使用异常等问题</p>
				<p style="color: #909399; font-size: 12px; margin-bottom: 8px;">刷新后页面输入的数据将会被清空</p>
				${countdownHtml}
				<div style="background: #f5f7fa; padding: 8px 12px; border-radius: 4px; font-size: 12px; color: #606266;">
					<div>当前版本: ${
						localVersion
							? new Date(localVersion.buildTime).toLocaleString()
							: '未知'
					}</div>
				</div>
				<p style="margin-top: 12px; font-size: 13px; color: #606266;">是否立即刷新页面？</p>
			</div>
		`;
	};
	// ${localVersion?.version || '未知'}

	const message = generateMessage(shouldAutoRefresh ? countdown : undefined);

	ElMessageBox.confirm(message, '版本更新提示', {
		confirmButtonText: '立即刷新',
		cancelButtonText: '稍后刷新',
		type: 'warning',
		dangerouslyUseHTMLString: true,
		closeOnClickModal: false,
		closeOnPressEscape: false,
		showClose: true,
		distinguishCancelAndClose: true,
	})
		.then(() => {
			// 用户点击"立即刷新"或倒计时结束自动刷新
			// console.log('[版本检测] 用户选择立即刷新');
			// 清除倒计时定时器
			if (countdownTimer) {
				clearInterval(countdownTimer);
				countdownTimer = null;
			}
			executeRefresh(serverVersion);
		})
		.catch((action) => {
			// 用户点击"稍后刷新"或关闭弹窗
			// console.log('[版本检测] 用户选择稍后刷新或关闭弹窗:', action);
			// 清除倒计时定时器
			if (countdownTimer) {
				clearInterval(countdownTimer);
				countdownTimer = null;
			}
			if (action === 'cancel') {
				// 用户点击"稍后刷新"，记录待更新状态，不更新本地版本信息
				setPendingUpdate(serverVersion);
			}
		})
		.finally(() => {
			isShowingDialog = false;
		});

	// 如果需要自动刷新，启动倒计时
	if (shouldAutoRefresh) {
		// 等待弹窗渲染完成后再查找倒计时元素
		setTimeout(() => {
			// 查找弹窗中的倒计时元素并更新
			const updateCountdown = () => {
				// 更新倒计时显示
				const messageBox = document.querySelector('.el-message-box__message');
				if (messageBox) {
					const newMessage = generateMessage(countdown);
					messageBox.innerHTML = newMessage;
				}

				if (countdown <= 0) {
					// 倒计时结束，自动触发刷新
					if (countdownTimer) {
						clearInterval(countdownTimer);
						countdownTimer = null;
					}
					// 自动点击确认按钮
					const confirmButton = document.querySelector(
						'.el-message-box__btns .el-button--primary'
					) as HTMLButtonElement;
					if (confirmButton) {
						confirmButton.click();
					}
					return;
				}

				countdown--;
			};

			// 立即更新一次（显示初始倒计时10秒）
			updateCountdown();

			// 每秒更新一次倒计时
			countdownTimer = window.setInterval(() => {
				updateCountdown();
			}, 1000);
		}, 100);
	}
}

/**
 * 检查是否是首次检测（首次访问或重新打开后的第一次检测）
 */
function isFirstCheck(): boolean {
	try {
		const firstCheckDone = sessionStorage.getItem(FIRST_CHECK_DONE_KEY);
		return firstCheckDone !== 'true';
	} catch (error) {
		// 如果无法访问 sessionStorage，视为首次检测
		return true;
	}
}

/**
 * 标记首次检测已完成
 */
function markFirstCheckDone(): void {
	try {
		sessionStorage.setItem(FIRST_CHECK_DONE_KEY, 'true');
	} catch (error) {
		// 忽略错误
	}
}

/**
 * 执行版本检测
 */
async function checkVersion(): Promise<void> {
	// console.log('[版本检测] 开始检测版本更新...');

	// 检查是否刚刷新过（刷新后短时间内跳过检测，避免误判）
	try {
		const refreshTimeStr = sessionStorage.getItem(REFRESH_TIME_KEY);
		if (refreshTimeStr) {
			const refreshTime = parseInt(refreshTimeStr, 10);
			const now = Date.now();
			const timeSinceRefresh = now - refreshTime;
			// 如果距离刷新时间小于 5 秒，说明刚刷新过，跳过检测
			if (timeSinceRefresh < 5000) {
				// console.log('[版本检测] 刚刷新过，跳过本次检测');
				return;
			}
		}
	} catch (error) {
		// 忽略错误，继续检测
	}

	// 判断是否是首次检测（首次访问或重新打开后的第一次检测）
	const isFirst = isFirstCheck();

	// 先检查是否有待更新状态（仅在非首次检测时处理）
	if (!isFirst) {
		const pendingUpdate = getPendingUpdate();
		if (pendingUpdate) {
			// 检查待更新状态的版本是否真的比本地版本新
			const localVersion = getLocalVersion();
			if (localVersion && hasVersionUpdate(localVersion, pendingUpdate)) {
				// console.log('[版本检测] 检测到待更新状态，直接显示更新提示');
				showUpdateDialog(pendingUpdate);
			} else {
				// 如果待更新状态的版本不比本地版本新，清除待更新状态
				clearPendingUpdate();
			}
			return;
		}
	}

	const serverVersion = await fetchServerVersion();
	if (!serverVersion) {
		// console.warn('[版本检测] 无法获取服务器版本信息');
		return;
	}

	const localVersion = getLocalVersion();
	// console.log('  本地版本:', localVersion?.version);
	// 首次访问，保存版本信息
	if (!localVersion) {
		// console.log('[版本检测] 首次访问，保存版本信息');
		saveLocalVersion(serverVersion);
		// 标记首次检测已完成
		markFirstCheckDone();
		return;
	}

	// 检测是否有更新
	if (hasVersionUpdate(localVersion, serverVersion)) {
		// 如果是首次检测（重新打开页面后的第一次），只同步版本信息，不弹窗
		if (isFirst) {
			// console.log('[版本检测] 首次检测发现版本更新，仅同步版本信息，不弹窗');
			saveLocalVersion(serverVersion);
			// 标记首次检测已完成
			markFirstCheckDone();
		} else {
			// 后续检测发现版本更新，显示更新提示
			showUpdateDialog(serverVersion);
		}
	} else {
		// console.log('[版本检测] 当前已是最新版本');
		// 确保本地版本信息是最新的（防止版本信息不一致）
		saveLocalVersion(serverVersion);
		// 标记首次检测已完成
		if (isFirst) {
			markFirstCheckDone();
		}
	}
}

/**
 * 启动定时检测
 */
function startVersionCheck(): void {
	// 清除已存在的定时器
	if (checkTimer) {
		clearInterval(checkTimer);
		checkTimer = null;
	}

	// console.log(`[版本检测] 启动定时检测，间隔: ${CHECK_INTERVAL / 1000 / 60} 分钟`);

	// 延迟执行首次检测（避免刷新后立即检测导致误判）
	// 如果刚刷新过，会在 checkVersion 中跳过
	setTimeout(() => {
		checkVersion();
	}, 2000); // 延迟 2 秒执行首次检测

	// 启动定时器
	checkTimer = window.setInterval(() => {
		checkVersion();
	}, CHECK_INTERVAL);
}

/**
 * 停止定时检测
 */
function stopVersionCheck(): void {
	if (checkTimer) {
		clearInterval(checkTimer);
		checkTimer = null;
		// console.log('[版本检测] 已停止定时检测');
	}
}

/**
 * 初始化版本管理
 * 在应用启动时调用
 */
export function initVersionManager(): void {
	// 	console.log('[版本管理] 初始化版本管理系统');

	// 处理浏览器刷新后的初始化（重置状态，检查时间间隔）
	handleBrowserRefresh();

	// 启动定时检测
	startVersionCheck();

	// 页面可见性变化时的处理
	// document.addEventListener('visibilitychange', () => {
	// 	if (document.visibilityState === 'visible') {
	// 		console.log('[版本检测] 页面变为可见，执行版本检测');
	// 		checkVersion();
	// 	}
	// });

	// 页面卸载时保存刷新时间戳并清理所有定时器（防止内存泄漏）
	window.addEventListener('beforeunload', () => {
		stopVersionCheck();
		// 清理倒计时定时器（防止刷新时内存泄漏）
		if (countdownTimer) {
			clearInterval(countdownTimer);
			countdownTimer = null;
		}
		// 清理错误处理防抖定时器
		if (errorHandlerDebounceTimer) {
			clearTimeout(errorHandlerDebounceTimer);
			errorHandlerDebounceTimer = null;
		}
		saveRefreshTime();
	});
}

/**
 * 手动触发版本检测
 * 可在需要时手动调用
 */
export function manualCheckVersion(): void {
	checkVersion();
}

/**
 * 获取当前版本信息
 */
export function getCurrentVersion(): VersionInfo | null {
	return currentVersion || getLocalVersion();
}

/**
 * 清除版本信息
 * 用于测试或重置
 */
export function clearVersionInfo(): void {
	localStorage.removeItem(VERSION_KEY);
	localStorage.removeItem(PENDING_UPDATE_KEY);
	currentVersion = null;
	// console.log('[版本管理] 已清除版本信息');
}

/**
 * 检测版本并显示更新提示（用于路由错误等场景）
 * @param scene 场景描述（如：路由切换、按钮操作等）
 * @returns 返回是否检测到版本更新
 */
export async function checkVersionAndShowDialog(
	scene: string = '操作'
): Promise<boolean> {
	// 场景参数保留用于未来日志记录
	// console.log(`[版本检测] ${scene}时检测版本更新...`);
	void scene; // 标记为已使用，避免 lint 错误

	// 检查是否刚刷新过（刷新后短时间内跳过检测，避免误判）
	try {
		const refreshTimeStr = sessionStorage.getItem(REFRESH_TIME_KEY);
		if (refreshTimeStr) {
			const refreshTime = parseInt(refreshTimeStr, 10);
			const now = Date.now();
			const timeSinceRefresh = now - refreshTime;
			// 如果距离刷新时间小于 5 秒，说明刚刷新过，跳过检测
			if (timeSinceRefresh < 5000) {
				// console.log('[版本检测] 刚刷新过，跳过本次检测');
				return false;
			}
		}
	} catch (error) {
		// 忽略错误，继续检测
	}

	// 先检查是否有待更新状态
	const pendingUpdate = getPendingUpdate();
	if (pendingUpdate) {
		// 检查待更新状态的版本是否真的比本地版本新
		const localVersion = getLocalVersion();
		if (localVersion && hasVersionUpdate(localVersion, pendingUpdate)) {
			// console.log(`[版本检测] ${scene}时检测到待更新状态，直接显示更新提示`);
			showUpdateDialog(pendingUpdate);
			return true;
		} else {
			// 如果待更新状态的版本不比本地版本新，清除待更新状态
			clearPendingUpdate();
		}
	}

	const serverVersion = await fetchServerVersion();
	// console.log(`[版本检测] 服务器版本:`, serverVersion);
	if (!serverVersion) {
		// console.warn('[版本检测] 无法获取服务器版本信息');
		return false;
	}

	const localVersion = getLocalVersion();
	if (!localVersion) {
		// 首次访问，保存版本信息
		saveLocalVersion(serverVersion);
		return false;
	}

	// 检测是否有更新
	if (hasVersionUpdate(localVersion, serverVersion)) {
		showUpdateDialog(serverVersion);
		return true;
	}

	// 确保本地版本信息是最新的（防止版本信息不一致）
	saveLocalVersion(serverVersion);
	return false;
}

/**
 * 判断是否为资源加载错误
 * @param error 错误对象或错误消息
 * @returns 是否为资源加载错误
 */
function isResourceLoadError(error: Error | string): boolean {
	const errorMessage =
		typeof error === 'string' ? error : error.message || error.toString();

	// 基础错误类型检测
	const isModuleLoadError = errorMessage.includes(
		'Failed to fetch dynamically imported module'
	);
	const isCssError = errorMessage.includes('Unable to preload CSS');
	const isHtmlError = errorMessage.includes('Expected a JavaScript');
	const isChunkLoadError = errorMessage.includes('Loading chunk');

	// 分包相关错误类型检测（发版后常见错误）
	const isChunkNotFoundError =
		errorMessage.includes('chunk') || errorMessage.includes('ChunkLoadError');
	const isNetworkError =
		errorMessage.includes('Failed to fetch') ||
		errorMessage.includes('NetworkError');
	const isTimeoutError =
		errorMessage.includes('timeout') || errorMessage.includes('Timeout');
	const isResourceError =
		errorMessage.includes('404') || errorMessage.includes('Not Found');
	const isCorsError =
		errorMessage.includes('CORS') || errorMessage.includes('Cross-Origin');
	const isModuleParseError =
		errorMessage.includes('Unexpected token') ||
		errorMessage.includes('SyntaxError');
	const isVersionMismatchError =
		errorMessage.includes('version') || errorMessage.includes('mismatch');

	// 判断是否为需要处理的资源加载错误
	return (
		isModuleLoadError ||
		isCssError ||
		isHtmlError ||
		isChunkLoadError ||
		isChunkNotFoundError ||
		isNetworkError ||
		isTimeoutError ||
		isResourceError ||
		isCorsError ||
		isModuleParseError ||
		isVersionMismatchError
	);
}

/**
 * 显示资源加载失败提示
 */
// function showResourceLoadErrorDialog(): void {
// 	// 如果正在显示版本更新弹窗，不再显示错误提示
// 	if (isShowingDialog) {
// 		return;
// 	}

// 	ElMessageBox({
// 		title: '资源加载失败',
// 		message: '当前页面资源加载失败，可能是网络问题，请尝试重新刷新页面',
// 		type: 'warning',
// 		showCancelButton: true,
// 		confirmButtonText: '重新刷新',
// 		cancelButtonText: '取消',
// 		beforeClose: (action, instance, done) => {
// 			if (action === 'confirm') {
// 				setTimeout(() => {
// 					window.location.reload();
// 					done();
// 				}, 300);
// 			} else {
// 				done();
// 			}
// 		},
// 	});
// }

/**
 * 处理资源加载错误（带防抖和版本检测）
 * @param error 错误对象或错误消息
 * @param scene 场景描述（如：路由切换、全局错误等）
 */
export async function handleResourceLoadError(
	error: Error | string,
	scene: string = '错误捕获'
): Promise<void> {
	// 如果不是资源加载错误，直接返回
	if (!isResourceLoadError(error)) {
		return;
	}

	const now = Date.now();

	// 防抖处理：如果距离上次错误处理时间太短，跳过
	if (now - lastErrorTime < MIN_ERROR_INTERVAL) {
		return;
	}

	// 如果正在处理错误，跳过
	if (isProcessingError) {
		return;
	}

	// 清除之前的防抖定时器
	if (errorHandlerDebounceTimer) {
		clearTimeout(errorHandlerDebounceTimer);
		errorHandlerDebounceTimer = null;
	}

	// 设置处理状态
	isProcessingError = true;
	lastErrorTime = now;

	// 使用防抖，避免频繁触发
	errorHandlerDebounceTimer = window.setTimeout(async () => {
		try {
			// 先检测版本是否有更新（针对发版后的分包内容错误，优先检查版本更新）
			const hasUpdate = await checkVersionAndShowDialog(scene);

			// 如果没有版本更新，记录错误日志
			if (!hasUpdate) {
				// 记录错误日志到 IndexedDB（异步，不影响主流程）
				errorLogger
					.log('资源加载失败', '检测到资源加载错误但未发现版本更新1', {
						error,
						scene,
						hasUpdate,
						additionalData: {
							suggestion:
								'建议：1. 检查网络连接 2. 清除浏览器缓存 3. 检查CDN状态 4. 尝试刷新页面',
							errorType:
								typeof error === 'string' ? 'string' : error?.name || 'Unknown',
						},
					})
					.catch((logErr) => {
						// 日志记录失败不影响主流程
						// eslint-disable-next-line no-console
						console.error('[ErrorLogger] 日志记录失败:', logErr);
					});

				//允许通过eslink校验
				// eslint-disable-next-line no-console
				console.error(
					'非版本更新errorHandlerDebounceTimer-hasUpdate',
					hasUpdate
				);
				// showResourceLoadErrorDialog(); // 已移除弹窗
			}
		} catch (err) {
			// 错误处理失败，记录日志
			errorLogger
				.log('版本检测异常', '版本检测过程中发生错误', {
					error: err,
					scene,
					additionalData: {
						originalError: error,
						suggestion:
							'建议：1. 检查版本检查接口是否正常 2. 查看网络请求日志 3. 检查服务器状态',
					},
				})
				.catch((logErr) => {
					console.error('[ErrorLogger] 日志记录失败:', logErr);
				});

			// eslint-disable-next-line no-console
			console.error('非版本更新errorHandlerDebounceTimer-err', err);
		} finally {
			// 重置处理状态（延迟重置，防止短时间内重复处理）
			setTimeout(() => {
				isProcessingError = false;
			}, ERROR_DEBOUNCE_DELAY);
			errorHandlerDebounceTimer = null;
		}
	}, ERROR_DEBOUNCE_DELAY);
}

/**
 * 初始化全局错误捕获机制
 * 在应用启动时调用
 */
export function initGlobalErrorHandler(): void {
	// 捕获 JavaScript 运行时错误
	window.addEventListener('error', (event) => {
		const error = event.error || new Error(event.message || '未知错误');
		if (error) {
			handleResourceLoadError(error, '全局错误捕获');
		}
	});

	// 捕获未处理的 Promise 拒绝
	window.addEventListener('unhandledrejection', (event) => {
		const error = event.reason || new Error('Promise 被拒绝');
		if (error) {
			handleResourceLoadError(error, 'Promise 拒绝捕获');
		}
	});
}
