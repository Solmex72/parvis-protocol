# 번역 현황 — 한국어 (`lang/ko`)

> **English summary:** this branch is the Parvis Protocol with `protocol/` translated into Korean. The
> English text on `main` is normative. Files not listed as translated below are still English — this
> branch is a complete, working copy of the repository, not a partial one.

---

## 이 브랜치가 무엇인가

이 브랜치는 Parvis Protocol 저장소의 **완전한** 사본이며, 아래에 적힌 파일을 한국어로 옮긴 것입니다. 삭제한 것은
없습니다. 아직 번역되지 않은 파일은 원문 그대로 여기에 있으며, 변함없이 그대로 쓸 수 있습니다.

**`main` 브랜치의 영문이 규범 판본입니다.** 이 번역과 원문이 어긋나는 곳에서는 영문이 우선합니다. 이 번역은 기계의
도움을 받아 만들었으며, **원어민의 검수를 거치지 않았습니다**.

## 프로토콜 식별자에 대한 약속

아래는 **의도적으로 영문 그대로** 두었습니다. 이것들은 에이전트가 해석하고 견주는 리터럴 값이지 문장이 아니기
때문입니다.

- 상태 동사 `RUN`, `YELLOW`, `STOP`;
- 확신 표시 `[PROVEN]`, `[CLAIMED]`, `[ASSUMED]`, `[PROPOSED]`;
- 버스의 여섯 동사 `FLASH`, `ASK`, `ANS`, `TELL`, `GATE`, `ACK`;
- 대장 줄 `REQ`, `DONE`, `BLOCKED`, `REFUSED`;
- 모든 파일명과 경로(`_os/`, `estop`, `protocol/00-PRECEDENCE.md` 등).

이것들을 옮기면 그것들을 읽는 모든 구현이 깨집니다.

---

## 범위

| 파일 | 상태 |
|---|---|
| `protocol/00-PRECEDENCE.md` | ✅ 번역됨 |
| `protocol/01-ESTOP.md` | ✅ 번역됨 |
| `protocol/02-EVIDENCE.md` | ✅ 번역됨 |
| `protocol/03-BUS.md` | ✅ 번역됨 |
| `protocol/04-OUTPUT-CONTRACT.md` | ✅ 번역됨 |
| `protocol/05-CORRECTION.md` | ✅ 번역됨 |
| `protocol/06-DATA-ZONES.md` | ✅ 번역됨 |
| `protocol/07-INTERFACE.md` | ✅ 번역됨 |
| `protocol/08-AGENTS.md` | ✅ 번역됨 |
| `protocol/09-FLOOR.md` | ✅ 번역됨 |
| `protocol/10-AIRLOCK.md` | ✅ 번역됨 |
| `README.md` | ⬜ 영문 |
| `CHANGELOG.md`, `DECISIONS.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` | ⬜ 영문 |
| `examples/`, `reference/`, `templates/` | ⬜ 영문 |
| 코드와 설정(`.mjs`, `.json`, `.html`, `.yml`) | ⬜ 설계상 번역하지 않음 |

---

## 키보드 배열

이 브랜치는 다음 Windows 키보드 배열로 입력하는 분들을 위한 것입니다.

`Korean`

---

## 번역 오류 신고

저장소에 이슈를 열고 파일, 절, 제안하는 표현을 적어 주십시오. 번역 정정이 규범적 의미를 바꾸는 일은 **결코**
없습니다. 영문 쪽이 잘못되었다고 보신다면 그것은 별개의 이슈이며 `main`을 대상으로 합니다.
