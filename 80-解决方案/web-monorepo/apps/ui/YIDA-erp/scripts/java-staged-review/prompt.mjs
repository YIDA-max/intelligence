export const JAVA_PERF_RULES = [
	{
		rule_id: 'PERF_LOOP_NEW_OBJECT',
		desc: '循环内重复创建高开销对象（ObjectMapper/Pattern/BigDecimal 等）',
	},
	{
		rule_id: 'PERF_LOOP_IO_DB_RPC',
		desc: '循环内执行 DB/RPC/HTTP，存在 N+1 或高延迟放大风险',
	},
	{
		rule_id: 'PERF_STRING_CONCAT_IN_LOOP',
		desc: '循环中使用字符串 + 拼接，建议 StringBuilder',
	},
	{
		rule_id: 'PERF_UNBOUNDED_COLLECTION',
		desc: '无上限集合增长或全量加载，存在 OOM 风险',
	},
	{
		rule_id: 'CONCURRENCY_LOCK_SCOPE',
		desc: '锁粒度过大或锁内执行 I/O',
	},
	{
		rule_id: 'CONCURRENCY_THREAD_POOL_MISUSE',
		desc: '线程池配置不合理（无界队列/拒绝策略缺失等）',
	},
	{
		rule_id: 'CONCURRENCY_NON_ATOMIC_COMPOSITE',
		desc: '并发容器复合操作非原子，存在竞态',
	},
	{
		rule_id: 'RESOURCE_NOT_CLOSED',
		desc: 'IO/连接资源未正确关闭（未使用 try-with-resources）',
	},
	{
		rule_id: 'RESILIENCE_TIMEOUT_MISSING',
		desc: 'HTTP/RPC/DB 超时配置缺失',
	},
	{
		rule_id: 'SQL_OR_ORM_PERF_RISK',
		desc: 'select *、索引失效条件、批量低效写入等 SQL/ORM 风险',
	},
	{
		rule_id: 'TXN_LONG_TRANSACTION',
		desc: '长事务/大事务，事务内远程调用或循环写',
	},
	{
		rule_id: 'LOGGING_HOTPATH_OVERHEAD',
		desc: '热路径日志拼接/大对象序列化输出',
	},
	{
		rule_id: 'CACHE_MISUSE',
		desc: '缓存无 TTL、无容量控制、无穿透/击穿保护',
	},
	{
		rule_id: 'ALGO_COMPLEXITY_HIGH',
		desc: '疑似 O(n^2)+ 复杂度热点，嵌套循环 + 线性查找',
	},
];

export function buildJavaPerfPrompt({ files, diffText, trimmed }) {
	const rules = JAVA_PERF_RULES.map((r) => `- ${r.rule_id}: ${r.desc}`).join('\n');
	return `你是资深 Java 性能与稳定性代码审查专家。请只审查 Java 后端相关性能与稳定性风险，不考虑前端问题。

审查输入是 git 暂存区 diff，请基于证据输出，不要臆断。

【硬规则清单（必须逐项检查）】
${rules}

【审查目标优先级】
1) critical/high：可能导致线上故障、性能雪崩、数据错误、资源耗尽
2) medium：存在明确性能/并发/维护风险但短期可运行
3) low：优化建议与可读性改善

【输出必须是纯 JSON（不要 markdown、不要解释文字）】
JSON Schema:
{
  "summary": "1-3句中文结论",
  "findings": [
    {
      "rule_id": "PERF_LOOP_IO_DB_RPC",
      "severity": "critical|high|medium|low",
      "file": "src/main/java/xxx.java",
      "line": "123 或 120-130",
      "title": "一句话问题标题",
      "evidence": "关键证据代码片段（1-3行）",
      "impact": "影响说明",
      "fix": "可执行修复建议",
      "confidence": "high|medium|low",
      "need_manual_check": false
    }
  ],
  "coverage": {
    "trimmed": ${trimmed ? 'true' : 'false'},
    "note": "若 diff 被截断，明确说明审查可能不完整"
  }
}

要求：
- 若未发现明显问题，findings 返回空数组。
- 每条问题必须尽可能给出 file + line。
- 如果证据不足，设置 need_manual_check=true 且 confidence=low/medium。

已暂存文件：
${files.map((f) => `- ${f}`).join('\n')}

以下是 git diff --cached 内容：
${diffText}
`;
}
