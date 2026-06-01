export const FRONTEND_RULES = [
	{ rule_id: 'FE_LOOP_RENDER_HEAVY', desc: '循环渲染中执行重计算或重复创建对象/函数' },
	{ rule_id: 'FE_LIST_KEY_UNSTABLE', desc: '列表渲染 key 不稳定导致重复渲染/状态错乱' },
	{ rule_id: 'FE_WATCHER_LEAK', desc: 'watch/event/timer 未清理导致内存泄漏' },
	{ rule_id: 'FE_REQUEST_RACE', desc: '请求竞态（后返回覆盖先返回）或重复请求无取消' },
	{ rule_id: 'FE_STATE_MUTATION_RISK', desc: '响应式状态误用导致视图不同步或死循环更新' },
	{ rule_id: 'FE_BIG_COMPONENT_PERF', desc: '大组件未拆分、计算属性/侦听器过重' },
	{ rule_id: 'FE_TABLE_VIRTUALIZATION_MISSING', desc: '大列表/大表格缺少虚拟滚动或分页策略' },
	{ rule_id: 'FE_IMAGE_ASSET_PERF', desc: '图片/资源加载策略不当（无懒加载/无压缩）' },
	{ rule_id: 'FE_SECURITY_XSS_RISK', desc: 'v-html/dangerouslySetInnerHTML 等注入风险' },
	{ rule_id: 'FE_LOGIC_COMPLEXITY_HIGH', desc: '可维护性差，分支/嵌套复杂度过高' },
];

export function buildFrontendPrompt({ files, diffText, trimmed }) {
	const rules = FRONTEND_RULES.map((r) => `- ${r.rule_id}: ${r.desc}`).join('\n');
	return `你是资深前端性能与工程质量代码审查专家。请仅审查前端代码（Vue/TS/JS/CSS等），使用中文输出。

你要优先发现：性能问题、稳定性问题、可维护性问题、安全风险（如 XSS）。
若证据不足，不要臆断，请标记 need_manual_check=true。

【硬规则清单（必须逐项检查）】
${rules}

【输出必须是纯 JSON（不要 markdown）】
JSON Schema:
{
  "summary": "1-3句中文结论",
  "findings": [
    {
      "rule_id": "FE_REQUEST_RACE",
      "severity": "critical|high|medium|low",
      "file": "src/views/xxx.vue",
      "line": "120 或 115-130",
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
- 没有明显问题时 findings 返回空数组。
- 每条问题尽可能给出 file + line。
- 优先输出高风险问题，避免泛泛而谈。

已暂存文件：
${files.map((f) => `- ${f}`).join('\n')}

以下是 git diff --cached 内容：
${diffText}
`;
}
