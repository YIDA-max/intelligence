/*
 * @Author: YIDA 3136271519@qq.com
 * @Date: 2025-08-08 10:40:08
 * @LastEditors: YIDA 3136271519@qq.com
 * @LastEditTime: 2025-08-12 10:00:02
 * @FilePath: \qianyi-ui\commitlint.config.cjs
 * @Description: commitlint + cz-git 配置文件
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

/** monorepo：优先 apps/qianyi-erp/src，兼容根目录 src */
function resolveSrcDir() {
  const candidates = [
    path.resolve(__dirname, "apps/qianyi-erp/src"),
    path.resolve(__dirname, "src"),
  ];
  return candidates.find((dir) => fs.existsSync(dir)) ?? null;
}

/**
 * 自动读取 src 目录下的一级文件夹作为可选 scope
 * - 去掉末尾的 s（复数转单数）
 * - 用于 cz-git 提示 scope 列表
 */
const srcDir = resolveSrcDir();
const scopes = srcDir
  ? fs
      .readdirSync(srcDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name.replace(/s$/, ""))
  : [];

/**
 * 自动推断当前 git 修改的 scope
 * - 如果 git status 中存在 src/xxx 或 apps/qianyi-erp/src/xxx 的改动，则提取 xxx 作为默认 scope
 */
const scopeComplete = execSync("git status --porcelain || true", {
  encoding: "utf8",
})
  .trim()
  .split("\n")
  .map((line) => {
    const match = line.match(/(?:apps\/qianyi-erp\/)?src\/([\w-]+)/);
    return match?.[1]?.replace(/s$/, "");
  })
  .find(Boolean);

/** @type {import('cz-git').UserConfig} */
module.exports = {
  /**
   * 忽略规则：
   * - 如果 commit message 中包含 `init`，则跳过 commitlint 检查
   */
  ignores: [(commit) => commit.includes("init")],

  /**
   * 继承 commitlint 约定式提交规则
   */
  extends: ["@commitlint/config-conventional"],

  /**
   * 自定义解析器：
   * - 解析 commit message 中 type、scope、subject
   * - 格式必须是：
   *   [任意作者][任意分支][任意时间] type(scope?): subject
   */
  parserPreset: {
    parserOpts: {
      // 匹配头部信息
      headerPattern: /^\[.*\]\[.*\]\[.*\]\s*(\w*)(?:\((.*)\))?: (.*)$/,
      // 对应的捕获分组
      headerCorrespondence: ["type", "scope", "subject"],
    },
  },

  /**
   * commitlint 校验规则
   */
  rules: {
    // body 前必须空一行
    "body-leading-blank": [2, "always"],
    // footer 前建议空一行
    "footer-leading-blank": [1, "always"],
    // header 最长 108 个字符
    "header-max-length": [2, "always", 108],
    // subject 不能为空
    "subject-empty": [2, "never"],
    // type 不能为空
    "type-empty": [2, "never"],
    // 不限制 subject 大小写
    "subject-case": [0],
    // 允许的 type 列表（需严格匹配）
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "perf",
        "style",
        "docs",
        "test",
        "refactor",
        "build",
        "ci",
        "chore",
        "revert",
        "wip",
        "workflow",
        "types",
        "release",
      ],
    ],
  },

  /**
   * cz-git 提交交互配置
   */
  prompt: {
    // 使用中文提示
    language: "zh",

    // 自定义 alias 快捷命令
    /** @use `pnpm commit :f` */
    alias: {
      f: "docs: fix typos",
      r: "docs: update README",
      s: "style: update code format",
      b: "build: bump dependencies",
      c: "chore: update config",
    },

    // scope 对齐方式
    customScopesAlign: !scopeComplete ? "top" : "bottom",
    // 默认 scope（根据当前改动自动推断）
    defaultScope: scopeComplete,
    // scope 列表（从 src 目录自动读取 + mock）
    scopes: [...scopes, "mock"],

    // 是否允许为空 issue 前缀
    allowEmptyIssuePrefixs: false,
    // 是否允许自定义 issue 前缀
    allowCustomIssuePrefixs: false,

    // 英文追加类型（可选）
    typesAppend: [
      { value: "wip", name: "wip:      work in process" },
      { value: "workflow", name: "workflow: workflow improvements" },
      { value: "types", name: "types:    type definition file changes" },
    ],

    // 中英文对照版的提示信息
    messages: {
      type: "选择你要提交的类型 :",
      scope: "选择一个提交范围 (可选):",
      customScope: "请输入自定义的提交范围 :",
      subject: "填写简短精炼的变更描述 :\n",
      body: '填写更加详细的变更描述 (可选)。使用 "|" 换行 :\n',
      breaking: '列举非兼容性重大的变更 (可选)。使用 "|" 换行 :\n',
      footerPrefixsSelect: "选择关联issue前缀 (可选):",
      customFooterPrefixs: "输入自定义issue前缀 :",
      footer: "列举关联issue (可选) 例如: #31, #I3244 :\n",
      confirmCommit: "是否提交或修改commit ?",
    },

    // 类型选项（带 emoji 展示）
    types: [
      { value: "feat", name: "特性:   🚀  新增功能", emoji: "🚀" },
      { value: "fix", name: "修复:   🧩  修复缺陷", emoji: "🧩" },
      { value: "docs", name: "文档:   📚  文档变更", emoji: "📚" },
      {
        value: "style",
        name: "格式:   🎨  代码格式（不影响功能，例如空格、分号等格式修正）",
        emoji: "🎨",
      },
      {
        value: "refactor",
        name: "重构:   ♻️  代码重构（不包括 bug 修复、功能新增）",
        emoji: "♻️",
      },
      { value: "perf", name: "性能:    ⚡️  性能优化", emoji: "⚡️" },
      {
        value: "test",
        name: "测试:   ✅  添加疏漏测试或已有测试改动",
        emoji: "✅",
      },
      {
        value: "build",
        name: "构建:   📦️  构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）",
        emoji: "📦️",
      },
      { value: "ci", name: "集成:   🎡  修改 CI 配置、脚本", emoji: "🎡" },
      { value: "chore", name: "回退:   ⏪️  回滚 commit", emoji: "⏪️" },
      {
        value: "revert",
        name: "其他:   🔨  对构建过程或辅助工具和库的更改（不影响源文件、测试用例）",
        emoji: "🔨",
      },
      { value: "wip", name: "开发:   🕔  正在开发中", emoji: "🕔" },
      { value: "workflow", name: "工作流:   📋  工作流程改进", emoji: "📋" },
      { value: "types", name: "类型:   🔰  类型定义文件修改", emoji: "🔰" },
    ],

    // 空 scope 和自定义 scope 的别名
    emptyScopesAlias: "empty:      不填写",
    customScopesAlias: "custom:     自定义",
  },
};
