---
name: iMacAi
description: 통합 AI 에이전트 스킬. 업무 유형, 자료 민감도, 대상 AI에 따라 자동으로 워크플로우를 실행합니다.
metadata:
  version: "0.1"
  since: "2026-06-21"
---

# iMacAi Skill

## 목적
업무 유형, 자료 민감도, 대상 AI를 기준으로 자동화 워크플로우를 실행합니다.

## 실행 사전 조건
- Hermes Agent가 현재 켜져 있어야 합니다.
- 작업 유형과 민감도를 확인한 뒤 가장 적절한 Tool을 선택합니다.

## 기본 규칙
1. Depth 1~2 일반 작업은 Codex/OpenAI를 기본으로 사용합니다.
2. Depth 3 이상 민감 업무 자료는 외부 AI 전송 전에 마스킹하고, 가능하면 로컬 모델 경로를 우선 검토합니다.
3. 현재 로컬 Ollama와 MacAi/Hermes는 삭제된 상태이므로 `ollama` 또는 `hermes-agent` 의존 명령은 제안하지 않습니다.
4. 남은 로컬 AI 프로젝트는 `/Users/imac/AI/llama.cpp`이며, 로컬 모델 운영은 GGUF 모델과 `llama-server` 준비 후 진행합니다.
5. 오픈소스 프로젝트 기여 시 프로젝트의 `AGENTS.md`, `CONTRIBUTING.md`, PR 규칙을 먼저 따릅니다.
6. 열린 Terminal 호출이 필요하면 `/Users/imac/AI/imacai_terminal_call.sh -- <command>`를 사용합니다.

## 주의 사항
Depth 4 인증/비밀자료는 저장하지 않거나 강제 마스킹합니다. 판단 결과는 항상 문제점, 근거, 권장 행동, 다음 자동화 후보로 출력합니다. 사용자가 바로 실행할 수 있도록 명령어는 복사 가능한 형태로 제공합니다.
