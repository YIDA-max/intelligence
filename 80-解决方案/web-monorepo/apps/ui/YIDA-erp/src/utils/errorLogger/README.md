# 错误日志系统

基于 IndexedDB 的本地错误日志记录系统，自动记录资源加载错误和版本检测异常。

## 功能特性

- 使用 IndexedDB 存储日志，容量大且性能好
- 自动保留最新 20 条日志记录
- 异步记录，不影响主业务逻辑
- 记录完整的错误信息、堆栈、URL、时间戳等

## 日志字段

每条日志包含以下信息：

- `id`: 时间戳（唯一标识）
- `timestamp`: ISO 格式时间字符串
- `message`: 错误描述信息
- `stack`: 错误堆栈（如果有）
- `url`: 发生错误的页面 URL
- `operationType`: 操作类型（如：资源加载失败、版本检测异常）
- `scene`: 场景参数（如：路由切换、全局错误捕获）
- `errorData`: 完整的错误数据对象
- `userAgent`: 浏览器信息
- `hasUpdate`: 是否检测到版本更新

## 使用方法

### 1. 记录日志

```typescript
import { errorLogger } from '@/utils/errorLogger';

// 记录错误日志
await errorLogger.log('操作类型', '错误描述', {
	error: errorObject, // 错误对象
	scene: '场景描述', // 可选
	hasUpdate: false, // 可选
	additionalData: {
		// 可选的额外数据
		suggestion: '建议信息',
	},
});
```

### 2. 查看日志（浏览器控制台）

在浏览器控制台中执行以下命令查看日志：

```javascript
// 获取最近的日志（默认20条）
const logs = await errorLogger.getRecentLogs();
console.table(logs);

// 获取最近5条日志
const recentLogs = await errorLogger.getRecentLogs(5);
console.table(recentLogs);

// 清空所有日志
await errorLogger.clearAllLogs();
```

### 3. 在开发者工具中查看 IndexedDB

1. 打开浏览器开发者工具（F12）
2. 切换到 "Application" 或 "存储" 标签
3. 展开 "IndexedDB" → "ErrorLogDB" → "errorLogs"
4. 可以直接查看所有日志记录

## 集成位置

当前已集成到 `versionManager.ts` 中：

- 资源加载失败但未检测到版本更新时记录日志
- 版本检测过程中发生异常时记录日志
- 所有日志记录都是异步的，不会阻塞主流程

## 注意事项

- 日志记录失败不会影响主业务逻辑
- 自动清理机制确保只保留最新 20 条记录
- IndexedDB 存储在浏览器本地，清除浏览器数据会删除日志
- 日志记录是异步的，使用 `.catch()` 捕获错误避免影响主流程
