# 翻訳状況 — 日本語（`lang/ja`）

> **English summary:** this branch is the Parvis Protocol with `protocol/` translated into Japanese. The
> English text on `main` is normative. Files not listed as translated below are still English — this
> branch is a complete, working copy of the repository, not a partial one.

---

## このブランチについて

このブランチは Parvis Protocol リポジトリの**完全な**写しで、下に挙げたファイルを日本語に訳したものです。削除した
ものはありません。まだ訳されていないファイルは原語のままここにあり、変わらずそのまま使えます。

**`main` ブランチの英語が規範版です。** この翻訳と原文が食い違う場合は英語が優先します。本翻訳は機械の助けを借りて
作成しており、**母語話者による確認は受けていません**。

## プロトコル識別子の扱い

以下は**意図的に英語のまま**にしてあります。これらはエージェントが解析し照合するリテラル値であって、文章ではない
からです。

- 状態の動詞 `RUN`、`YELLOW`、`STOP`；
- 確信度の印 `[PROVEN]`、`[CLAIMED]`、`[ASSUMED]`、`[PROPOSED]`；
- バスの六つの動詞 `FLASH`、`ASK`、`ANS`、`TELL`、`GATE`、`ACK`；
- 台帳の行 `REQ`、`DONE`、`BLOCKED`、`REFUSED`；
- すべてのファイル名とパス（`_os/`、`estop`、`protocol/00-PRECEDENCE.md` など）。

これらを訳すと、それらを読むあらゆる実装が壊れます。

---

## 範囲

| ファイル | 状況 |
|---|---|
| `protocol/00-PRECEDENCE.md` | ✅ 翻訳済み |
| `protocol/01-ESTOP.md` | ✅ 翻訳済み |
| `protocol/02-EVIDENCE.md` | ✅ 翻訳済み |
| `protocol/03-BUS.md` | ✅ 翻訳済み |
| `protocol/04-OUTPUT-CONTRACT.md` | ✅ 翻訳済み |
| `protocol/05-CORRECTION.md` | ✅ 翻訳済み |
| `protocol/06-DATA-ZONES.md` | ✅ 翻訳済み |
| `protocol/07-INTERFACE.md` | ✅ 翻訳済み |
| `protocol/08-AGENTS.md` | ✅ 翻訳済み |
| `protocol/09-FLOOR.md` | ✅ 翻訳済み |
| `protocol/10-AIRLOCK.md` | ✅ 翻訳済み |
| `README.md` | ⬜ 英語 |
| `CHANGELOG.md`、`DECISIONS.md`、`CONTRIBUTING.md`、`SECURITY.md`、`CODE_OF_CONDUCT.md` | ⬜ 英語 |
| `examples/`、`reference/`、`templates/` | ⬜ 英語 |
| コードと設定（`.mjs`、`.json`、`.html`、`.yml`） | ⬜ 設計上、翻訳しません |

---

## キーボード配列

このブランチは、次の Windows キーボード配列で入力する方を対象としています。

`Japanese`

---

## 翻訳の誤りを報告する

リポジトリに issue を立て、ファイル名・節・提案する表現を書いてください。翻訳の訂正が規範的な意味を変えることは
**決してありません**。英語のほうが誤っているとお考えの場合は、それは別の issue であり、`main` に対するものです。
