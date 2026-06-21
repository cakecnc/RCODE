#!/usr/bin/env bash
set -euo pipefail
BOT_DIR="/Users/imac/AI/kakao-bot"
LOG="/Users/imac/AI/kakao-bot/bot.log"

if [[ ! -d "$BOT_DIR" ]]; then
  echo "[MISSING] $BOT_DIR 없음"
  exit 1
fi

if [[ ! -f "$BOT_DIR/.env" ]]; then
  echo "[MISSING] $BOT_DIR/.env 없음"
  exit 1
fi

cd "$BOT_DIR"
mkdir -p "$(dirname "$LOG")"

if [[ ! -d node_modules ]]; then
  echo "[INIT] npm install 실행"
  npm install
fi

echo "[START] 카카오톡 봇 서버 실행"
nohup npm start >> "$LOG" 2>&1 &
echo "$!" > "$BOT_DIR/bot.pid"
echo "[OK] 봇 PID 저장 완료: $BOT_DIR/bot.pid, 로그: $LOG"
