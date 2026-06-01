import { httpService } from '/@/utils/request';
import { createRateLimitQueue } from '/@/utils/rateLimitQueue';

// 文件元数据查询接口限流器：所有请求都会执行，但会按最小间隔串行发送。
const fileListRateLimitQueue = createRateLimitQueue(120);

/**
 * 根据加密文件名数组查询文件信息。
 * - 入参：后端约定为 POST 纯数组（string[]）。
 * - 策略：通过队列限流，避免短时间高并发请求。
 */
export function getSysFileList(data: any) {
	return fileListRateLimitQueue.enqueue(() =>
		httpService.post('/admin/sys-file/getSysFileList', data)
	);
}
