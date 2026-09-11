# 翻译状态 — 简体中文（`lang/zh-Hans`）

> **English summary:** this branch is the Parvis Protocol with `protocol/` translated into Simplified
> Chinese. The English text on `main` is normative. Files not listed as translated below are still
> English — this branch is a complete, working copy of the repository, not a partial one.

---

## 这个分支是什么

本分支是**完整的** Parvis Protocol 仓库，其中下列文件已译为简体中文。没有删除任何内容。若某个文件尚未翻译，它会
以原文出现在这里，并且依然完全可用。

**`main` 分支中的英文是规范版本。** 本翻译与原文有出入之处，以英文为准。本翻译由机器辅助完成，**未经母语者校订**。

## 关于协议标识符的约定

以下内容**刻意保留英文**，因为它们是代理程序解析与比对的字面值，而不是行文：

- 状态动词 `RUN`、`YELLOW`、`STOP`；
- 置信标注 `[PROVEN]`、`[CLAIMED]`、`[ASSUMED]`、`[PROPOSED]`；
- 总线的六个动词 `FLASH`、`ASK`、`ANS`、`TELL`、`GATE`、`ACK`；
- 台账行 `REQ`、`DONE`、`BLOCKED`、`REFUSED`；
- 所有文件名与路径（`_os/`、`estop`、`protocol/00-PRECEDENCE.md` 等）。

翻译它们会破坏任何读取它们的实现。

---

## 覆盖范围

| 文件 | 状态 |
|---|---|
| `protocol/00-PRECEDENCE.md` | ✅ 已翻译 |
| `protocol/01-ESTOP.md` | ✅ 已翻译 |
| `protocol/02-EVIDENCE.md` | ✅ 已翻译 |
| `protocol/03-BUS.md` | ✅ 已翻译 |
| `protocol/04-OUTPUT-CONTRACT.md` | ✅ 已翻译 |
| `protocol/05-CORRECTION.md` | ✅ 已翻译 |
| `protocol/06-DATA-ZONES.md` | ✅ 已翻译 |
| `protocol/07-INTERFACE.md` | ✅ 已翻译 |
| `protocol/08-AGENTS.md` | ✅ 已翻译 |
| `protocol/09-FLOOR.md` | ✅ 已翻译 |
| `protocol/10-AIRLOCK.md` | ✅ 已翻译 |
| `README.md` | ⬜ 英文 |
| `CHANGELOG.md`、`DECISIONS.md`、`CONTRIBUTING.md`、`SECURITY.md`、`CODE_OF_CONDUCT.md` | ⬜ 英文 |
| `examples/`、`reference/`、`templates/` | ⬜ 英文 |
| 代码与配置（`.mjs`、`.json`、`.html`、`.yml`） | ⬜ 按设计不翻译 |

---

## 键盘布局

本分支面向使用以下 Windows 键盘布局输入的用户：

`Chinese (Simplified) - US Keyboard`、`Chinese (Simplified, Singapore) - US Keyboard`

---

## 报告翻译问题

请在仓库中开一个 issue，注明文件、章节与建议措辞。翻译更正**绝不**改变规范含义：若你认为英文本身有误，那是另一个
issue，并且应针对 `main`。
