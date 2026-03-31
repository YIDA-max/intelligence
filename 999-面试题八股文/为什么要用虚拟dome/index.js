// 为什么要用虚拟dome 虚拟dom的性能一定比操控真实的dom的性能好吗
// 比如说我一千条数据,我只改动了一个,他要经过diff,对比归纳,定点更新,这一连串下来,难道他的效率一定比直接找到这个dome,然后直接inserthtml要高吗
// 1.虚拟dome的核心设计思路并不是说一定的比直接操作对应的dome更快更好
// 1.1 虚拟dome他抽象为了一个对象,对象是ECMAScrip的设计规范,只要实现了这个规范,那就一定会有对象,然后不同环境他有自己的实现,浏览器会有domo,但是小程序是没有的,他只有视图层,以后有可能有各种各样的说法,在框架的设计之初,他就不是说我就是给浏览器去用的,因为这个核心的思想是一套解决方案,所以这个时候一个抽象并且基于ECMAScrip的虚拟dome就完美的符合了这个需求,框架的数据是自己解决的,然后不同的平台,只需要去适配不同的render方面的问题即可
// 1.2 虚拟dome他的作用也有说降低开发者的心智负担的情况,并且他提供了一个比较保底的优化,当然,定点更新对应的真实dome绝对是最优解,因为这个就是最原始,最简单的方式,但是我们不可以说去绝对的写出对应的顶点更新,所以,这个时候虚拟dome可以保证下限,再怎么样,也不会性能太差,同时进行了抽象,可以让开发者的心智负担降低
// 1.3 更专业地聊 Diff 与“1000 改 1”的优化路径（下面是可运行的示例日志）
// ------------------------------
// 交互式讲解（prompts）
// - 先提问 (1-2)
// - 等待回答
// - 输出 (3-5) 的讲解
// - 再提问 1.3（Diff）
// - 等待回答
// - 输出 1.3 的讲解
// ------------------------------

const isNode =
  typeof process !== "undefined" &&
  !!process.versions &&
  !!process.versions.node;

const ansi = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  cyan: "\x1b[36m",
  purple: "\x1b[35m",
  green: "\x1b[32m",
  gray: "\x1b[90m",
  yellow: "\x1b[33m",
};

const icon = {
  q: "❓",
  idea: "💡",
  ok: "✅",
  warn: "⚠️",
  tool: "🧰",
  dart: "🎯",
  bolt: "⚡",
  tree: "🌳",
  list: "🧾",
  vue: "🟩",
  react: "⚛️",
};

const styles = {
  h: "color:#0ea5e9;font-weight:700;",
  k: "color:#a78bfa;font-weight:700;",
  ok: "color:#22c55e;",
  note: "color:#94a3b8;",
  warn: "color:#f59e0b;font-weight:700;",
};

function logH(title) {
  if (isNode) console.log(`${ansi.cyan}${ansi.bold}${title}${ansi.reset}`);
  else console.log(`%c${title}`, styles.h);
}
function logNote(msg) {
  if (isNode) console.log(`${ansi.gray}${msg}${ansi.reset}`);
  else console.log(`%c${msg}`, styles.note);
}
function logOk(msg) {
  if (isNode) console.log(`${ansi.green}${msg}${ansi.reset}`);
  else console.log(`%c${msg}`, styles.ok);
}
function logWarn(msg) {
  if (isNode) console.log(`${ansi.yellow}${ansi.bold}${msg}${ansi.reset}`);
  else console.log(`%c${msg}`, styles.warn);
}

async function getPrompts() {
  try {
    const mod = await import("prompts");
    return mod.default ?? mod;
  } catch {
    console.log(`${icon.warn} 未安装 prompts，先执行：npm i prompts`);
    process.exit(1);
  }
}

function groupCollapsed(title, css) {
  // 仅用于“讲解输出阶段”。
  // prompts 的交互输入会频繁重绘同一行，包在 group 里时，
  // 终端日志采集/回放更容易看起来像重复打印。
  if (isNode) console.group(title);
  else console.groupCollapsed(`%c${title}`, css);
}

function printSection_3_to_5() {
  logH(`${icon.tool} 讲解：虚拟DOM的价值（不等于“必然更快”）`);
  logNote(
    `${icon.idea} 先把话说死：虚拟 DOM 不是“性能银弹”。它的核心价值是把 UI 更新抽象成统一模型，让框架有空间做工程化优化。`,
  );

  logOk(
    `${icon.bolt} 价值 1：声明式 + 可预测更新。你描述“状态是什么”，框架负责把状态差异映射到最小的宿主更新指令（DOM/原生/小程序）。`,
  );
  logOk(
    `${icon.bolt} 价值 2：批处理与合并写入。框架可以把多次状态变更合并成一次提交（减少 layout / paint / style recalculation 的抖动）。`,
  );
  logOk(
    `${icon.bolt} 价值 3：跨平台与可移植性。用 JS 对象描述 UI，renderer 负责落地；同一套组件模型可适配不同宿主。`,
  );
  logOk(
    `${icon.bolt} 价值 4：可维护性与下限保障。业务代码很难长期保持“手写定点更新”既正确又最优，框架抽象能保证整体可控。`,
  );

  logWarn(`${icon.warn} 什么时候虚拟 DOM 可能更慢：`);
  logNote(
    `- ${icon.dart} 你能直接定位并执行一次最小 DOM 操作时（极小改动、极高确定性），通常会赢过通用 diff。`,
  );
  logNote(
    `- 数据/节点规模很大但更新频率极高：diff 成本 + 生成中间表示成本可能成为瓶颈（需要列表虚拟化/分片/降频）。`,
  );
  logNote(
    `- 不合理的 key / 频繁创建新对象导致“看起来全变了”，会把可复用的节点变成不可复用，造成额外开销。`,
  );

  logNote(
    `${icon.idea} 面试落点：虚拟 DOM 解决的是“通用更新模型 + 可优化空间 + 工程可维护性”，不是保证每次都比手写 DOM 更快。`,
  );
}

function printSection_1_3() {
  groupCollapsed("1.3 Diff 与更新策略（面试版要点）", styles.h);

  groupCollapsed("🌳 策略一：分层对比（Tree Diff / 同层比较）", styles.k);
  logNote(
    "核心假设：同一时间 UI 的跨层级结构大改很少见，允许用启发式规则把“通用树编辑距离”问题简化。",
  );
  logWarn(
    "为什么要简化：通用树编辑距离（Tree Edit Distance）最坏可达 O(n^3) 级别，工程上不可接受。",
  );
  logOk(
    "工程做法：只在同一父节点下对比子节点；父节点类型不同通常直接替换整棵子树（卸载+重建）。",
  );
  console.groupEnd();

  groupCollapsed("🧾 策略二：Keyed List Diff（列表 diff 的关键）", styles.k);
  logNote(
    "没有 key：只能按位置对齐，前面插入/删除会让后续大量节点被误判为“变了”（产生多余更新）。",
  );
  logOk(
    "有 key：按 key 建立对应关系，能精准复用同 key 的节点，只对真正变化的节点做最小更新。",
  );
  logNote(
    "补充：现代实现常用“最长递增子序列（LIS）”等方法，减少 DOM 移动次数，提高列表重排效率。",
  );
  console.groupEnd();

  groupCollapsed("🟩 Vue 3：编译期优化（静态提升 + Patch Flags）", styles.k);
  logOk(
    "静态提升（Hoisting）：把永远不变的节点/属性提升为常量，运行时 diff 直接跳过这些静态部分。",
  );
  logOk(
    "Patch Flags：编译器标注“只更新文本/只更新 class/只更新 props”等，运行时走更窄的更新路径。",
  );
  console.groupEnd();

  groupCollapsed("⚛️ React：Fiber 调度（可中断 + 优先级）", styles.k);
  logNote(
    "重点不是让 diff 变成 0 成本，而是把渲染工作拆分为可中断的小任务，避免长任务阻塞主线程。",
  );
  logOk(
    "可中断与优先级：交互（输入/点击）优先，低优先级更新可延后或被打断，从而降低卡顿体感。",
  );
  console.groupEnd();

  console.groupEnd();
}

async function main() {
  const prompts = await getPrompts();

  // 提问阶段：prompts 会重绘同一行；为了避免终端日志里反复出现“长问题文本”，
  // 这里把“长问题”先用 console.log 打一次，prompts 只显示短提示语。
  console.log(`\n${icon.q} 提问（对应注释 1-2）：`);
  console.log(
    "你觉得：虚拟 DOM 一定比直接操作真实 DOM 更快吗？你会怎么反驳“1000改1还要diff很慢”？",
  );
  await prompts({
    type: "text",
    name: "answer1",
    message: "请输入你的回答",
  });

  groupCollapsed(`${icon.ok} 讲解开始`, styles.k);
  printSection_3_to_5();
  console.groupEnd();

  console.log(`\n${icon.q} 提问（关于 1.3 Diff）：`);
  console.log(
    "你知道哪些 Diff 优化策略？说说 Tree diff、keyed list diff、编译期优化、可中断调度各自解决什么问题。",
  );
  await prompts({
    type: "text",
    name: "answer2",
    message: "请输入你的回答",
  });

  printSection_1_3();
}

main();
