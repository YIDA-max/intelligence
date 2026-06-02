# MCP 配置参考（MySQL + browser-tools）

本目录用于存放 Cursor MCP 的**参考配置**，便于团队快速复用。

## 1. MySQL MCP（远程 MySQL）

参考文件：`docs/mcp/mcp.example.json`

你需要把配置写入本机的：

- `C:\\Users\\Administrator\\.cursor\\mcp.json`

然后重启 Cursor 或在 MCP 面板里重连。

### 关键点

- `MYSQL_DB` / `MYSQL_DATABASE`：建议都写一份，避免不同实现读取的变量名不一致
- `MYSQL_PASS` / `MYSQL_PASSWORD`：同理，建议双写
- 写操作开关建议默认关闭，需要时再按需打开

## 2. browser-tools（本机浏览器自动化）

只在 Cursor 里启用 MCP Server 还不够，你还需要：

- 在 Chrome/Edge 安装 browser-tools 对应的扩展（Connector）
- 在扩展里点击 Connect，确保状态为 Connected

之后在 Cursor 里即可调用工具（如 `takeScreenshot`、`getConsoleErrors` 等）。
