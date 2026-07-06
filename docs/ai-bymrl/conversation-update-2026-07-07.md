# Ai-byMrL Conversation Update — 2026-07-07

## 목적

이 문서는 ChatGPT 대화에서 정리된 Ai-byMrL 프로젝트 방향을 GitHub 저장소에 기록하기 위한 업데이트 문서이다.

## 프로젝트명 정정

- 올바른 프로젝트명: `Ai-byMrL`
- `Ai-byL`은 오타로 간주한다.
- 향후 문서, 코드, UI, 저장소, 작업 지시에서는 `Ai-byMrL` 명칭을 우선 사용한다.

## 핵심 구상

Ai-byMrL은 NotebookLM 스타일의 개인/사업 AI 작업공간을 목표로 한다.

구성 개념:

```text
Ai-byMrL
= Obsidian/GitHub 기반 자료 저장소
+ 로컬 AI agent
+ ChatGPT / 로컬 Gemma / 기타 모델 라우터
+ NotebookLM 스타일 UI
+ 단기기억 / 장기기억 / 소스 기반 답변
+ 필요 시 Bluehost 기반 웹 UI 또는 외부 접속 서버
```

## 자료 저장소 방향

### Obsidian

Obsidian은 사람이 직접 읽고 쓰는 지식 저장소로 사용한다.

주요 용도:

- 사업 아이디어 정리
- 회의록 저장
- 제안서 초안 관리
- 자뎅/Jardin 수출 자료 정리
- 식용 아이싱 시트 자료 정리
- 사용자 장기기억 후보 저장
- AI가 생성한 요약/보고서 저장

### GitHub

GitHub는 코드와 시스템 문서, 작업 이력 저장소로 사용한다.

주요 용도:

- Ai-byMrL 코드 관리
- 설계 문서 버전 관리
- Codex 작업 로그 저장
- 프롬프트 및 시스템 정책 관리
- 변경 이력 추적
- 롤백 및 브랜치 관리

권장 구분:

```text
Obsidian = 사람이 보는 지식 노트
GitHub = 코드와 시스템 이력 저장소
Vector DB = AI가 검색하는 색인 저장소
```

## NotebookLM 스타일 UI 방향

Ai-byMrL UI는 소스 중심 작업공간으로 설계한다.

권장 화면 구조:

```text
왼쪽: Sources
- Obsidian 노트
- GitHub 문서
- PDF
- 회의록
- 웹 링크
- 사업자료

가운데: Chat / Ask
- 선택한 소스 기반 질문
- 전체 Vault 기반 질문
- 현재 프로젝트 기반 질문

오른쪽: Memory / Output
- 단기기억
- 장기기억 후보
- 요약 노트
- 작업지시
- 보고서 초안
```

추가 기능:

- 이 소스만 사용 모드
- 전체 장기기억 사용 모드
- 민감자료 로컬만 사용 모드
- ChatGPT 보강 허용 모드
- Codex 작업지시 생성 버튼
- Obsidian 노트로 저장 버튼

## 단기기억 / 장기기억 설계

### 단기기억

현재 작업 흐름에 필요한 임시 맥락을 담는다.

예시:

- 현재 대화
- 현재 선택한 소스
- 최근 열어본 노트
- 현재 작업 목표
- 현재 생성 중인 문서

### 장기기억

장기간 유효한 승인된 정보를 담는다.

예시:

- 회사 정보
- Ai-byMrL 설계 방향
- 자뎅/Jardin 수출 전략
- 식용 아이싱 시트 제조·마케팅 자료
- 스마트스토어 상품 정보
- 반복되는 사용자 선호
- 승인된 프로젝트 결정사항

운영 원칙:

```text
AI가 장기기억 후보 제안
→ 사용자가 승인
→ Memory DB 저장
```

## AI 역할 분담

Ai-byMrL은 단일 모델 의존형이 아니라 역할별 모델 라우터 구조가 적합하다.

| 역할 | 추천 모델/도구 | 담당 |
|---|---|---|
| 민감자료 분석 | 로컬 Gemma / Qwen / llama.cpp | 회사자료, 내부문서, 회의록 |
| 빠른 검색·요약 | 로컬 소형 모델 | Obsidian 노트 요약, 태그 추천 |
| 고급 기획 | ChatGPT 앱/웹 또는 OpenAI API | 사업전략, 제안서, 복잡한 판단 |
| 최신 정보 | ChatGPT 웹/Deep Research | 시장조사, 수출 규정, 경쟁사 분석 |
| 코드 개발 | Codex 또는 ChatGPT 코드 생성 | Ai-byMrL 기능 구현 |
| 자료 저장 | Obsidian / GitHub | 장기 자료 보관 및 버전 관리 |

## ChatGPT API 과금 관련 결정

- ChatGPT 앱/웹 구독과 OpenAI API 과금은 별도이다.
- Ai-byMrL 내부에서 ChatGPT를 자동 호출하려면 API가 필요하며, 이 경우 별도 과금이 발생한다.
- 따라서 초기 구조는 API 의존형이 아니라 로컬 AI 기본 구조가 적합하다.

권장 사용 비율:

```text
로컬 AI 80%
ChatGPT 앱/웹 직접 사용 15%
ChatGPT API 선택 호출 5%
```

## ChatGPT 앱/웹 구독 활용 방식

ChatGPT 앱/웹 구독을 Ai-byMrL 내부 자동 엔진처럼 쓰는 공식 방식은 없다.

대신 다음 방식으로 활용한다.

```text
ChatGPT = 외부 고급 분석실
Ai-byMrL = 로컬 운영 AI
Obsidian/GitHub = 기억 저장소
```

운영 흐름:

```text
1. Obsidian / GitHub에 원본 자료 저장
2. ChatGPT Project에서 고급 분석, 보고서, 전략 검토 수행
3. 결과를 Obsidian 또는 GitHub에 저장
4. Ai-byMrL이 다시 읽어 색인화
5. 장기기억 후보로 제안
```

피해야 할 방식:

- Ai-byMrL이 ChatGPT 웹을 자동 로그인해서 긁어오기
- ChatGPT 웹 화면을 비공식 자동화로 조작하기
- 세션 쿠키나 로그인 토큰을 앱에 저장하기
- ChatGPT 구독을 API처럼 우회 사용하기

## Intel Mac Pro 기준 로컬 AI 전략

사용자 환경은 Mac Pro Intel 버전이다.

권장 방향:

```text
1순위: llama.cpp GGUF 모델
2순위: Ollama가 정상 작동하면 Ollama
3순위: Docker 기반 로컬 API
4순위: 무거운 모델은 외부 API 또는 ChatGPT 앱/웹으로 분리
```

작업 분배:

```text
가벼운 작업:
- 문서 분류
- 태그 추천
- 간단 요약
- 소스 검색
→ 로컬 4B~8B 모델

중간 작업:
- 회의록 정리
- Obsidian 노트 연결
- Codex 작업지시 생성
→ 로컬 7B~12B Q4 모델

무거운 작업:
- 사업 제안서 완성
- 수출 전략 분석
- 긴 보고서 작성
- 복잡한 코드 설계
→ ChatGPT 앱/웹 또는 OpenAI API 선택 사용
```

## Bluehost 활용 방향

Bluehost는 대형 AI 모델 추론 서버보다는 웹 UI/관리 서버에 적합하다.

적합한 용도:

- Ai-byMrL 웹 대시보드
- 로그인 페이지
- 관리자 페이지
- API Gateway
- 문서 공유 포털
- 외부 접속용 간단 서버
- 고객용 데모 사이트

부적합한 용도:

- 대형 로컬 AI 모델 추론
- GPU 필요한 LLM 서버
- 민감자료 전체 저장
- 무거운 벡터 검색 서버

권장 배치:

```text
Mac Pro Intel
- 로컬 AI
- Obsidian Vault
- 민감자료
- Vector DB
- Agent 실행

Bluehost
- 웹 UI 호스팅
- 로그인/외부 접속
- 동기화 API
- 공개용 데모
- 사업용 랜딩페이지

ChatGPT / OpenAI API
- 고급 추론
- 긴 보고서
- 최신 정보 보강
- 복잡한 문서화
```

## 권장 시스템 구조

```text
Ai-byMrL Core

1. Source Layer
- Obsidian Vault
- GitHub repo
- PDF / 이미지 / 웹링크
- 사업자료 폴더

2. Index Layer
- Markdown parser
- PDF parser
- GitHub sync
- metadata extractor
- chunker

3. Memory Layer
- short_term_memory.sqlite
- long_term_memory.sqlite
- vector_store
- source_map

4. Model Router
- local_gemma
- local_qwen
- openai_api optional
- gemini_api optional
- fallback rules

5. Agent Layer
- research_agent
- business_agent
- document_agent
- coding_agent
- commerce_agent
- memory_agent

6. UI Layer
- source panel
- chat panel
- memory panel
- graph view
- task board
- report writer
```

## 모델 라우팅 규칙 예시

```text
사용자 질문이 내부자료 기반이면:
→ Obsidian/GitHub 검색
→ 로컬 AI 답변

질문이 최신 시장정보이면:
→ 웹 검색 또는 ChatGPT 앱/웹
→ 결과 저장 후 재색인

질문이 제안서/보고서 작성이면:
→ 로컬 검색
→ ChatGPT 문서화 선택
→ Obsidian 저장 후보 생성

질문이 코드 구현이면:
→ ChatGPT가 설계
→ Codex 또는 수동으로 코드 반영

질문이 민감자료이면:
→ 외부 API 차단
→ 로컬 AI만 사용
```

## 개발 순서

### 1단계: 로컬 우선 MVP

- Obsidian Vault 경로 설정
- Markdown 읽기
- SQLite 저장
- 검색창
- 로컬 AI 요약
- 단기기억 패널

### 2단계: NotebookLM 스타일 UI

- 소스 추가 버튼
- 선택 소스 기반 질문
- 답변 근거 표시
- 요약 노트 생성
- 장기기억 후보 제안

### 3단계: 모델 라우터

- 로컬 모델 선택
- ChatGPT API 선택 옵션
- 민감자료 외부 전송 차단
- 작업별 모델 자동 선택

### 4단계: GitHub 연동

- GitHub repo 읽기
- README/코드 문서 인덱싱
- Codex 로그 저장
- 변경 이력 요약

### 5단계: Bluehost 연동

- 웹 대시보드 배포
- 외부 접속용 로그인
- 공개 자료만 동기화
- 민감자료는 Mac Pro에 유지

## 다음 작업 후보

- `Ai-byMrL` 저장소 또는 폴더 구조 확정
- Obsidian Vault 경로 정책 확정
- Local-only MVP 요구사항 문서 작성
- SQLite 스키마 설계
- 모델 라우터 정책 파일 작성
- NotebookLM 스타일 UI 와이어프레임 작성
- Bluehost 배포 범위 결정
