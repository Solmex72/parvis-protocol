# 翻譯狀態 — 繁體中文 (`lang/zh-Hant`)

> **English summary:** this branch is the Parvis Protocol with `protocol/` translated into
> Traditional Chinese. The English text on `main` is normative. Files not listed as translated
> below are still English — this branch is a complete, working copy of the repository, not a
> partial one.

---

## 這個分支是什麼

這個分支是**完整的** Parvis Protocol 儲存庫，其中下列檔案已翻譯為繁體中文。沒有任何東西被移除。若某個檔
案尚未翻譯，它會以原文出現在這裡，並且完全可用。

**`main` 分支上的英文是規範版本。** 若本翻譯與原文有出入，以英文為準。本翻譯由機器輔助產生，且**未經母語
人士審閱**。

## 協定識別符的慣例

下列內容**刻意保留英文**，因為它們是代理程式解析與比對的字面值，而不是行文：

- 狀態動詞 `RUN`、`YELLOW`、`STOP`；
- 信心標記 `[PROVEN]`、`[CLAIMED]`、`[ASSUMED]`、`[PROPOSED]`；
- 六個匯流排動詞 `FLASH`、`ASK`、`ANS`、`TELL`、`GATE`、`ACK`；
- 帳冊列 `REQ`、`DONE`、`BLOCKED`、`REFUSED`；
- 所有檔案名稱與路徑（`_os/`、`estop`、`protocol/00-PRECEDENCE.md`、…）。

翻譯它們會破壞每一個讀取它們的實作。

---

## 涵蓋範圍

| 檔案 | 狀態 |
|---|---|
| `protocol/00-PRECEDENCE.md` | ✅ 已翻譯 |
| `protocol/01-ESTOP.md` | ✅ 已翻譯 |
| `protocol/02-EVIDENCE.md` | ✅ 已翻譯 |
| `protocol/03-BUS.md` | ✅ 已翻譯 |
| `protocol/04-OUTPUT-CONTRACT.md` | ✅ 已翻譯 |
| `protocol/05-CORRECTION.md` | ✅ 已翻譯 |
| `protocol/06-DATA-ZONES.md` | ✅ 已翻譯 |
| `protocol/07-INTERFACE.md` | ✅ 已翻譯 |
| `protocol/08-AGENTS.md` | ✅ 已翻譯 |
| `protocol/09-FLOOR.md` | ✅ 已翻譯 |
| `protocol/10-AIRLOCK.md` | ✅ 已翻譯 |
| `README.md` | ⬜ 英文 |
| `CHANGELOG.md`、`DECISIONS.md`、`CONTRIBUTING.md`、`SECURITY.md`、`CODE_OF_CONDUCT.md` | ⬜ 英文 |
| `examples/`、`reference/`、`templates/` | ⬜ 英文 |
| 程式碼與設定（`.mjs`、`.json`、`.html`、`.yml`） | ⬜ 依設計不翻譯 |

---

## 鍵盤配置

這個分支涵蓋使用下列 Windows 鍵盤配置輸入的使用者：

`Chinese (Traditional) - US Keyboard`、`Chinese (Traditional) - Phonetic`、
`Chinese (Traditional) - ChangJie`、`Chinese (Traditional) - Quick`、
`Chinese (Traditional) - DaYi`

---

## 回報翻譯錯誤

在儲存庫開一個 issue，指出檔案、章節與建議用語。翻譯修正**絕不**改變規範性的含義：如果你認為英文有誤，
那是另一個 issue，並且是針對 `main`。
