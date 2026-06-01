#!/usr/bin/env bash
# 用途：
#  1. 前端项目部署脚本（qianyi-ui）
#  2. 支持参数：环境(-e/--env)、服务器地址(-s/--server)、用户(-u/--user)、密钥(-k/--key)
#  3. 使用 pnpm 安装依赖并构建前端项目（固定构建 prod 环境，输出目录为 html）
#  4. 通过 SSH + SCP 上传到服务器，并在远程备份旧版本、部署新版本
#  5. 注意：-e 参数仅用于选择部署到不同环境的服务器，不影响构建环境
#
# 使用示例：
#  ./deploy.sh                          # 使用默认 dev 环境服务器及默认 IP、默认 root 用户
#  ./deploy.sh -e dev                   # 部署到 dev 环境服务器（默认 IP）
#  ./deploy.sh -e dev -s 192.168.200.100
#  ./deploy.sh -e dev -s 192.168.200.100 -u user1
#  ./deploy.sh -s 8.129.111.19 -k /path/to/key.pem

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

SERVER_NAME="qianyi-ui"
REMOTE_ROOT="/data/merach/qianyi/release/ui/${SERVER_NAME}"
REMOTE_BACKUP_DIR=""
HTML_DIR="html"
HTML_SOURCE="${PROJECT_ROOT}/${HTML_DIR}"
SSH_KEY_FILE=""

# Node.js 版本配置
DEFAULT_NODE_VERSION="20.19.5"
NODE_VERSION="${DEFAULT_NODE_VERSION}"

#######################################
# 记录开始时间（用于统计总耗时）
#######################################
START_TIME="$(date '+%Y-%m-%d %H:%M:%S')"
START_EPOCH="$(date +%s)"

# 步骤耗时统计（秒）
GIT_STEP_STATUS="完成"
GIT_DURATION_SEC=0
BUILD_DURATION_SEC=0
BACKUP_DURATION_SEC=0
SCP_DURATION_SEC=0
DEPLOY_DURATION_SEC=0
TAR_SIZE_MB=0

#######################################
# 路径格式化函数：在 Windows 系统上将 Unix 路径转换为 Windows 路径格式
#######################################
format_path_for_display() {
  local path="$1"
  local uname_s="$(uname -s 2>/dev/null || echo '')"

  # 检测是否在 Windows 系统（Git Bash 或 MSYS）
  if [[ -n "${MSYSTEM:-}" ]] || [[ "$uname_s" == *"MINGW"* ]] || [[ "$uname_s" == *"MSYS"* ]] || [[ "$uname_s" == *"CYGWIN"* ]]; then
    # Windows 系统：将 /e/... 转换为 E:\...
    if [[ "$path" =~ ^/([a-zA-Z])/ ]]; then
      local drive_letter="${BASH_REMATCH[1]}"
      drive_letter=$(echo "$drive_letter" | tr '[:lower:]' '[:upper:]')
      path="${drive_letter}:\\${path:3}"
      path=$(echo "$path" | sed 's|/|\\|g')
    else
      path=$(echo "$path" | sed 's|/|\\|g')
    fi
  else
    :
  fi
  echo "$path"
}

#######################################
# 打印帮助
#######################################
usage() {
  cat <<EOF
用法: $0 [选项]

选项:
  -e, --env <dev|preprod|prod>   指定部署环境（仅用于选择服务器），默认 dev
                                 dev     -> 192.168.200.88
                                 preprod -> 192.168.200.89
                                 prod    -> 39.108.78.150
                                 注意：构建始终使用 prod 环境，此参数不影响构建
  -s, --server <ip/host>         指定服务器地址，不传则按环境使用默认 IP
  -u, --user <username>          指定 SSH 用户，默认 root
  -k, --key <pem_path>           指定 SSH 私钥文件路径（可选）
  -n, --node <version>           指定 Node.js 版本，默认 20.19.5
  -h, --help                     显示本帮助

示例:
  $0
  $0 -e dev
  $0 -e dev -s 192.168.200.100
  $0 -e dev -s 192.168.200.100 -u deploy
  $0 -s 8.129.111.19 -k /path/to/key.pem
  $0 -e dev -n 20.19.5
EOF
}

#######################################
# 1. 解析参数
#######################################
parse_args() {
  ENV="dev"
  SERVER=""
  USER_NAME="root"
  SSH_KEY_FILE=""
  REMOTE_BACKUP_DIR=""
  NODE_VERSION="${DEFAULT_NODE_VERSION}"

  # 解析参数
  while [[ $# -gt 0 ]]; do
    case "$1" in
      -e|--env)
        if [[ $# -lt 2 ]]; then
          echo "错误：选项 $1 需要一个值" >&2
          usage
          exit 1
        fi
        ENV="$2"
        shift 2
        ;;
      -s|--server)
        if [[ $# -lt 2 ]]; then
          echo "错误：选项 $1 需要一个值" >&2
          usage
          exit 1
        fi
        SERVER="$2"
        shift 2
        ;;
      -u|--user)
        if [[ $# -lt 2 ]]; then
          echo "错误：选项 $1 需要一个值" >&2
          usage
          exit 1
        fi
        USER_NAME="$2"
        shift 2
        ;;
      -k|--key)
        if [[ $# -lt 2 ]]; then
          echo "错误：选项 $1 需要一个值" >&2
          usage
          exit 1
        fi
        SSH_KEY_FILE="$2"
        shift 2
        ;;
      --key=*)
        SSH_KEY_FILE="${1#*=}"
        shift
        ;;
      --key)
        if [[ -z "${2:-}" ]]; then
          echo "❌ 错误：--key 需要指定密钥路径，例如 --key /path/to/key.pem" >&2
          exit 1
        fi
        SSH_KEY_FILE="$2"
        shift 2
        ;;
      -n)
        if [[ -z "${2:-}" ]]; then
          echo "❌ 错误：-n 需要指定版本号，例如 -n 20.19.5" >&2
          exit 1
        fi
        NODE_VERSION="$2"
        shift 2
        ;;
      --node=*)
        NODE_VERSION="${1#*=}"
        shift
        ;;
      --node)
        if [[ -z "${2:-}" ]]; then
          echo "❌ 错误：--node 需要指定版本号，例如 --node 20.19.5" >&2
          exit 1
        fi
        NODE_VERSION="$2"
        shift 2
        ;;
      -h|--help)
        usage
        exit 0
        ;;
      *)
        echo "错误：未知参数 $1" >&2
        usage
        exit 1
        ;;
    esac
  done

  if [[ -z "$NODE_VERSION" ]]; then
    echo "❌ 错误：Node.js 版本不能为空" >&2
    exit 1
  fi

  # 校验环境变量
  case "$ENV" in
    dev|preprod|prod)
      ;;
    *)
      echo "错误：环境参数必须为 dev | preprod | prod (当前: $ENV)" >&2
      usage
      exit 1
      ;;
  esac

  # 如果未指定服务器地址，根据环境设置默认值
  if [[ -z "$SERVER" ]]; then
    case "$ENV" in
      dev)
        SERVER="192.168.200.88"
        ;;
      preprod)
        SERVER="192.168.200.89"
        ;;
      prod)
        SERVER="39.108.78.150"
        ;;
    esac
  fi

  # 指定测试服务器时，强制使用该服务器专属配置
  if [[ "$SERVER" == "8.129.111.19" ]]; then
    REMOTE_ROOT="/usr/local/merach/qianyi-ui-static-prod/${SERVER_NAME}"
    REMOTE_BACKUP_DIR="/data/static_bak/qianyi-ui/backup"
    USER_NAME="ecs-user"
    if [[ -z "${SSH_KEY_FILE}" ]]; then
      SSH_KEY_FILE='E:\01浙江麦瑞克科技有限公司\工作\服务器\8.129.111.19\merach-sz.pem'
    fi
  fi
}

#######################################
# 2. 拉取最新代码
#######################################
git_pull_latest() {
  echo "🏁 启动部署！"
  echo "📥 拉取最新代码..."
  GIT_STEP_START_EPOCH="$(date +%s)"
  if [[ -d ".git" ]]; then
    # 显示当前分支
    CURRENT_BRANCH="$(git branch --show-current 2>/dev/null || git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '未知')"
    echo "🌿 当前分支：${CURRENT_BRANCH}"
    # 拉取最新代码
    if git pull; then
      echo "✅ 代码拉取成功"
    else
      echo "❌ 代码拉取失败，请检查网络连接或 Git 配置" >&2
      exit 1
    fi
  else
    echo "⚠️  当前目录不是 Git 仓库，跳过代码拉取"
    GIT_STEP_STATUS="跳过"
  fi
  GIT_STEP_END_EPOCH="$(date +%s)"
  GIT_DURATION_SEC=$((GIT_STEP_END_EPOCH - GIT_STEP_START_EPOCH))
}

#######################################
# 3. 检查 Node.js 和 pnpm 环境
#######################################
check_node_env() {
  echo "✅ 检查 Node.js 版本（期望：${NODE_VERSION}）"

  if ! command -v node &>/dev/null; then
    echo "❌ Node.js 未安装！" >&2
    exit 1
  fi

  local current_version
  current_version=$(node --version | sed 's/v//')
  
  if [[ "$current_version" != "$NODE_VERSION" ]]; then
    echo "⚠️ Node.js 版本不匹配！"
    echo "  当前版本: v${current_version}"
    echo "  期望版本: v${NODE_VERSION}"
    echo "  尝试使用 nvm 切换版本..."
    
    # 尝试加载 nvm 并切换版本
    if [[ -f "/data/merach/nvm-0.40.3/nvm.sh" ]]; then
      source /data/merach/nvm-0.40.3/nvm.sh
      nvm use "$NODE_VERSION" || {
        echo "❌ nvm 切换版本失败，请确保已安装 Node.js ${NODE_VERSION}" >&2
        exit 1
      }
    elif [[ -f "$HOME/.nvm/nvm.sh" ]]; then
      source "$HOME/.nvm/nvm.sh"
      nvm use "$NODE_VERSION" || {
        echo "❌ nvm 切换版本失败，请确保已安装 Node.js ${NODE_VERSION}" >&2
        exit 1
      }
    else
      echo "❌ 未找到 nvm，无法自动切换版本" >&2
      echo "  请手动切换到 Node.js ${NODE_VERSION} 或安装 nvm" >&2
      exit 1
    fi

    # 再次检测版本
    current_version=$(node --version | sed 's/v//')
    if [[ "$current_version" != "$NODE_VERSION" ]]; then
      echo "❌ 切换 Node.js 版本失败，当前版本: v${current_version}" >&2
      exit 1
    else
      echo "🟢 Node.js 版本已切换: v${current_version}"
    fi
  else
    echo "🟢 Node.js 版本正确: v${current_version}"
  fi

  # 检查 pnpm
  if ! command -v pnpm &>/dev/null; then
    echo "❌ pnpm 未安装！请先安装 pnpm：npm install -g pnpm" >&2
    exit 1
  fi

  local pnpm_version
  pnpm_version=$(pnpm --version)
  echo "🟢 pnpm 版本：${pnpm_version}"
}

#######################################
# 4. 构建前端项目
#######################################
build_project() {
  echo "🎯 开始构建前端项目（固定构建 prod 环境）..."
  BUILD_STEP_START_EPOCH="$(date +%s)"

  if [[ ! -f "${PROJECT_ROOT}/package.json" ]]; then
    echo "❌ package.json 不存在！" >&2
    exit 1
  fi

  cd "$PROJECT_ROOT"

  echo "➡️ 安装依赖..."
  pnpm install || {
    echo "❌ 依赖安装失败！" >&2
    exit 1
  }

  echo "➡️ 构建项目..."
  npm run build prod || {
    echo "❌ 项目构建失败！" >&2
    exit 1
  }

  # 检查构建输出目录
  if [[ ! -d "$HTML_SOURCE" ]]; then
    HTML_SOURCE_DISPLAY=$(format_path_for_display "$HTML_SOURCE")
    echo "❌ 构建输出目录不存在：${HTML_SOURCE_DISPLAY}" >&2
    exit 1
  fi

  echo "✅ 构建成功"
  BUILD_STEP_END_EPOCH="$(date +%s)"
  BUILD_DURATION_SEC=$((BUILD_STEP_END_EPOCH - BUILD_STEP_START_EPOCH))
}

#######################################
# 5. 部署信息总览 & 远程目录初始化
#######################################
print_deploy_info_and_init_remote() {
  echo "🎯 开始部署流程..."
  echo "📋 部署信息："
  echo "   - 用户：$USER_NAME"
  echo "   - 服务器：$SERVER"
  echo "   - 服务名称：$SERVER_NAME"
  echo "   - 远程部署目录：$REMOTE_ROOT"
  if [[ -n "${REMOTE_BACKUP_DIR}" ]]; then
    echo "   - 远程备份目录：$REMOTE_BACKUP_DIR"
  else
    echo "   - 远程备份目录：$REMOTE_ROOT/backup"
  fi
  if [[ -n "${SSH_KEY_FILE}" ]]; then
    echo "   - SSH 密钥：$SSH_KEY_FILE"
  fi

  SSH_ARGS=(-o StrictHostKeyChecking=no -o ConnectTimeout=10)
  if [[ -n "${SSH_KEY_FILE}" ]]; then
    local ssh_key_path="${SSH_KEY_FILE}"
    # 兼容 Windows 反斜杠路径，统一转成正斜杠后再做 cygpath 转换
    ssh_key_path="${ssh_key_path//\\//}"
    if command -v cygpath >/dev/null 2>&1; then
      ssh_key_path="$(cygpath -u "${ssh_key_path}")"
    fi
    if [[ ! -f "${ssh_key_path}" ]]; then
      echo "❌ 错误：SSH 密钥文件不存在：${ssh_key_path}" >&2
      exit 1
    fi
    SSH_ARGS+=(-i "${ssh_key_path}")
  fi

  echo "📂 检查远程目录..."
  ssh "${SSH_ARGS[@]}" "${USER_NAME}@${SERVER}" bash <<EOF
set -euo pipefail

if [ ! -d '${REMOTE_ROOT}' ]; then
  echo '❌ 远程部署目录不存在：${REMOTE_ROOT}' >&2
  exit 1
fi

if [ ! -d '${REMOTE_BACKUP_DIR:-${REMOTE_ROOT}/backup}' ]; then
  echo '❌ 远程备份目录不存在：${REMOTE_BACKUP_DIR:-${REMOTE_ROOT}/backup}' >&2
  exit 1
fi

echo '✅ 远程目录就绪'
EOF
}

#######################################
# 6. 备份远程 html 目录（最多保留 10 个备份）
#######################################
backup_remote_html() {
  echo "🧺 开始备份远程 html 目录..."
  BACKUP_STEP_START_EPOCH="$(date +%s)"
  ssh "${SSH_ARGS[@]}" "${USER_NAME}@${SERVER}" bash <<EOF
set -euo pipefail

REMOTE_ROOT="${REMOTE_ROOT}"
BACKUP_DIR="${REMOTE_BACKUP_DIR:-${REMOTE_ROOT}/backup}"
TARGET_HTML="\${REMOTE_ROOT}/html"

if [[ -d "\${TARGET_HTML}" ]]; then
  echo "✅ 检测到现有 html 目录，准备备份"
  current_date=\$(date '+%Y%m%d')
  max_index=0

  # 遍历当天已有的备份，找出最大序号
  for dir in "\${BACKUP_DIR}/html.bak\${current_date}"*; do
    if [[ -d "\$dir" ]]; then
      dirname=\$(basename "\$dir")
      index_part="\${dirname#html.bak\${current_date}}"
      if [[ \$index_part =~ ^[0-9]{2}\$ ]]; then
        num=\$((10#\$index_part))
        if (( num > max_index )); then
          max_index=\$num
        fi
      fi
    fi
  done

  next_index=\$((max_index + 1))
  if (( next_index > 99 )); then
    echo "❌ 错误：当日备份序号超过 99，停止部署以避免过多备份文件" >&2
    exit 1
  fi

  index_str=\$(printf "%02d" "\$next_index")
  backup_name="html.bak\${current_date}\${index_str}"

  echo "➡️ 正在备份：html → \${backup_name}"
  if cp -r "\${TARGET_HTML}" "\${BACKUP_DIR}/\${backup_name}"; then
    echo "🟢 备份成功：\${BACKUP_DIR}/\${backup_name}"
  else
    echo "❌ 备份失败！磁盘空间状态：" >&2
    df -h "\${REMOTE_ROOT}" | tail -1 >&2
    exit 1
  fi

  # 只保留最新的 10 个备份，其余删除
  ls -1dt "\${BACKUP_DIR}/html.bak"* 2>/dev/null | tail -n +11 | xargs -r rm -rf -- 2>/dev/null || true
else
  echo "ℹ️ 首次部署，无需备份"
fi
EOF
  BACKUP_STEP_END_EPOCH="$(date +%s)"
  BACKUP_DURATION_SEC=$((BACKUP_STEP_END_EPOCH - BACKUP_STEP_START_EPOCH))
}

#######################################
# 7. 打包上传 html 到服务器
#######################################
upload_html() {
  echo "⬆️ 打包并上传 html 到服务器：${SERVER}:${REMOTE_ROOT}/"
  
  # 检查 tar 命令是否存在
  if ! command -v tar &>/dev/null; then
    echo "❌ tar 命令未找到，无法打包文件！" >&2
    echo "   请安装 tar 工具（Windows Git Bash 通常已包含）" >&2
    exit 1
  fi
  
  SCP_STEP_START_EPOCH="$(date +%s)"

  # 在本地打 tar 包
  TAR_FILE="html.tar.gz"
  cd "$PROJECT_ROOT"
  tar -czf "$TAR_FILE" "$HTML_DIR"

  # 计算 tar 包大小（MB），用于汇总展示
  TAR_SIZE_BYTES="$(wc -c < "$TAR_FILE" | tr -d ' ')"
  TAR_SIZE_MB=$(( (TAR_SIZE_BYTES + 1048575) / 1048576 ))

  # 上传到远程
  scp "${SSH_ARGS[@]}" "$TAR_FILE" "${USER_NAME}@${SERVER}:${REMOTE_ROOT}/"

  SCP_STEP_END_EPOCH="$(date +%s)"
  SCP_DURATION_SEC=$((SCP_STEP_END_EPOCH - SCP_STEP_START_EPOCH))

  # 清理本地 tar 包
  rm -f "${PROJECT_ROOT}/${TAR_FILE}"
}

#######################################
# 8. 远程解压部署 html
#######################################
deploy_remote_html() {
  echo "📦 在服务器上部署新版本..."
  DEPLOY_STEP_START_EPOCH="$(date +%s)"
  ssh "${SSH_ARGS[@]}" "${USER_NAME}@${SERVER}" bash <<EOF
set -euo pipefail

cd "${REMOTE_ROOT}"

# 删除旧 html 目录
if [ -d "html" ]; then
  echo "➡️ 删除旧部署文件..."
  rm -rf "html"
fi

# 解压新的 html
echo "➡️ 解压新部署文件..."
tar --no-same-owner -xzf "html.tar.gz"

# 设置权限
chmod -R 755 "html"

# 清理远程 tar 包
rm -f "html.tar.gz"

# 验证部署结果（至少包含一个文件）
any_file=\$(find "html" -type f -print -quit 2>/dev/null || true)
if [ -z "\$any_file" ]; then
  echo "❌ 错误：部署目录为空，请检查构建产物" >&2
  exit 1
fi

echo "✅ 部署成功"
EOF
  DEPLOY_STEP_END_EPOCH="$(date +%s)"
  DEPLOY_DURATION_SEC=$((DEPLOY_STEP_END_EPOCH - DEPLOY_STEP_START_EPOCH))
}

#######################################
# 9. 输出汇总信息
#######################################
print_summary() {
  echo "🚀 部署完成："
  echo "   - 服务器：${SERVER}"
  echo "   - 服务名称：${SERVER_NAME}"
  echo "   - 远程目录：${REMOTE_ROOT}/html"

  END_TIME="$(date '+%Y-%m-%d %H:%M:%S')"
  END_EPOCH="$(date +%s)"
  DURATION_SEC=$((END_EPOCH - START_EPOCH))

  echo "   - 开始时间：${START_TIME}"
  echo "   - 结束时间：${END_TIME}"
  echo "   - 总耗时：${DURATION_SEC} 秒"

  echo ""
  echo "⏱️ 步骤耗时清单："
  if [[ "${GIT_STEP_STATUS}" == "跳过" ]]; then
    echo "   - Git 拉取：跳过"
  else
    echo "   - Git 拉取：${GIT_DURATION_SEC} 秒"
  fi
  echo "   - 前端构建：${BUILD_DURATION_SEC} 秒"
  echo "   - 远程备份：${BACKUP_DURATION_SEC} 秒"
  echo "   - SCP 上传：${SCP_DURATION_SEC} 秒（tar.gz ${TAR_SIZE_MB}MB）"
  echo "   - 远程部署：${DEPLOY_DURATION_SEC} 秒"
}

#######################################
# 主执行流程
#######################################
main() {
  parse_args "$@"
  git_pull_latest
  check_node_env
  build_project
  print_deploy_info_and_init_remote
  backup_remote_html
  upload_html
  deploy_remote_html
  print_summary
}

main "$@"
