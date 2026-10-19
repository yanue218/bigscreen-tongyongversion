#!/data/storage/el1/bundle/libs/arm64/bash/bin/bash
# 蛇口市场大屏 · 本地一键启动
# 用法：/data/storage/el1/bundle/libs/arm64/bash/bin/bash run-local.sh
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

SIGN_TOOL=/data/storage/el1/bundle/libs/arm64/binary-sign-tool
NATIVE="$ROOT/node_modules/@rollup/rollup-openharmony-arm64/rollup.openharmony-arm64.node"
CACHE="$ROOT/node_modules/.ohos-rollup-signed.node"
API_PORT=18089
DEV_PORT=5188

# 鸿蒙下 rollup 原生 .node 需要自签名，否则 vite 启动报 Permission denied。
# 每次 npm ci 后文件会被覆盖，这里用缓存副本自动修复。
ensure_native() {
  if [ ! -f "$NATIVE" ]; then
    echo "[!] 找不到 rollup 原生模块，请先执行 npm ci"
    exit 1
  fi
  if [ ! -f "$CACHE" ]; then
    echo "[*] 首次运行：为 rollup 原生模块自签名…"
    "$SIGN_TOOL" sign -inFile "$NATIVE" -outFile "$CACHE" -selfSign "1" >/dev/null
  fi
  cp "$CACHE" "$NATIVE"
  echo "[*] rollup 原生模块已就绪"
}

ensure_native

echo "[*] 启动只读测试数据接口 http://127.0.0.1:$API_PORT"
node scripts/qa-api.mjs &
API_PID=$!
trap 'kill $API_PID 2>/dev/null' EXIT INT TERM

echo "[*] 启动开发服务器 http://127.0.0.1:$DEV_PORT"
MARKET_API_PROXY="http://127.0.0.1:$API_PORT" npm run dev
