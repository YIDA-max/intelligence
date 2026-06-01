---
title: API文件模式
type: pattern
tags: [qianyi, api, axios, integrations]
---

# API 文件模式（`src/api/.../index.ts`）

每个集成模块的 API 文件包含：分页查询、导出、生成金蝶单据（可选）、获取失败数量（可选）。

## 完整示例

```typescript
import request from '/@/utils/request';

// ===== 未生成 =====

// 未生成列表分页
export const getXxxNotGeneratedPage = (params?: object) => {
	return request({
		url: '/integrations/xxx/moduleName/notGenerated/page',
		method: 'get',
		params,
	});
};

// 未生成导出
export const getXxxNotGeneratedExport = (params?: object) => {
	return request({
		url: '/integrations/xxx/moduleName/notGenerated/export',
		method: 'get',
		params,
		responseType: 'blob',
	});
};

// 生成金蝶单据（未生成Tab操作）
export const postXxxPushKingdee = (data?: object) => {
	return request({
		url: '/integrations/xxx/moduleName/pushKingdee',
		method: 'post',
		data,
	});
};

// ===== 已生成 =====

// 已生成列表分页
export const getXxxGeneratedPage = (params?: object) => {
	return request({
		url: '/integrations/xxx/moduleName/generated/page',
		method: 'get',
		params,
	});
};

// 已生成导出
export const getXxxGeneratedExport = (params?: object) => {
	return request({
		url: '/integrations/xxx/moduleName/generated/export',
		method: 'get',
		params,
		responseType: 'blob',
	});
};

// ===== 生成失败 =====

// 生成失败列表分页（同时用于获取数量）
export const getXxxGeneratedFailedPage = (params?: object) => {
	return request({
		url: '/integrations/xxx/moduleName/generatedFailed/page',
		method: 'get',
		params,
	});
};

// 生成失败导出
export const getXxxGeneratedFailedExport = (params?: object) => {
	return request({
		url: '/integrations/xxx/moduleName/generatedFailed/export',
		method: 'get',
		params,
		responseType: 'blob',
	});
};
```

## 注意事项

- 导出接口必须加 `responseType: 'blob'`
- 生成失败数量通过失败列表接口的 `data.total` 获取，无需单独接口
- 生成金蝶单据接口用 `post` 方法，传 `data`
- URL 路径与后端约定一致，不要自行猜测
