#!/bin/bash
# 测试自动部署的快捷脚本

echo "🧪 测试自动部署功能"
echo ""
echo "选择测试方式："
echo "1. 创建空提交触发部署"
echo "2. 直接执行 post-commit hook"
echo "3. 手动执行部署脚本"
echo ""
read -p "请选择 (1/2/3): " choice

case $choice in
  1)
    echo "📝 创建空提交..."
    git commit --allow-empty -m "test: 测试自动部署 [$(date '+%Y-%m-%d %H:%M:%S')]"
    ;;
  2)
    echo "🔧 直接执行 post-commit hook..."
    bash .husky/post-commit
    ;;
  3)
    echo "🚀 手动执行部署脚本..."
    read -p "选择环境 (dev/preprod/prod) [默认: preprod]: " env
    env=${env:-preprod}
    bash scripts/deploy.sh -e "$env"
    ;;
  *)
    echo "❌ 无效选择"
    exit 1
    ;;
esac

echo ""
echo "✅ 测试完成！"
