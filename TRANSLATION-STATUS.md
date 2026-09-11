# Состояние перевода — Русский (`lang/ru`)

> **English summary:** this branch is the Parvis Protocol with `protocol/` translated into Russian. The
> English text on `main` is normative. Files not listed as translated below are still English — this
> branch is a complete, working copy of the repository, not a partial one.

---

## Что это за ветка

Эта ветка — **полный** репозиторий Parvis Protocol, в котором перечисленные ниже файлы переведены на
русский язык. Ничего не удалено. Если файл ещё не переведён, он присутствует здесь на языке оригинала и
остаётся полностью пригодным к использованию.

**Английская версия в ветке `main` является нормативной.** Там, где этот перевод и оригинал расходятся,
преимущество имеет английский. Перевод выполнен с участием машины и **не проверялся носителем языка**.

## Соглашение об идентификаторах протокола

Следующее **намеренно оставлено на английском**, поскольку это буквальные значения, которые агенты
разбирают и сравнивают, а не связный текст:

- глаголы состояния `RUN`, `YELLOW`, `STOP`;
- пометки уверенности `[PROVEN]`, `[CLAIMED]`, `[ASSUMED]`, `[PROPOSED]`;
- шесть глаголов шины `FLASH`, `ASK`, `ANS`, `TELL`, `GATE`, `ACK`;
- строки реестра `REQ`, `DONE`, `BLOCKED`, `REFUSED`;
- все имена файлов и пути (`_os/`, `estop`, `protocol/00-PRECEDENCE.md`, …).

Их перевод сломал бы любую реализацию, которая их читает.

---

## Покрытие

| Файл | Состояние |
|---|---|
| `protocol/00-PRECEDENCE.md` | ✅ Переведён |
| `protocol/01-ESTOP.md` | ✅ Переведён |
| `protocol/02-EVIDENCE.md` | ✅ Переведён |
| `protocol/03-BUS.md` | ✅ Переведён |
| `protocol/04-OUTPUT-CONTRACT.md` | ✅ Переведён |
| `protocol/05-CORRECTION.md` | ✅ Переведён |
| `protocol/06-DATA-ZONES.md` | ✅ Переведён |
| `protocol/07-INTERFACE.md` | ✅ Переведён |
| `protocol/08-AGENTS.md` | ✅ Переведён |
| `protocol/09-FLOOR.md` | ✅ Переведён |
| `protocol/10-AIRLOCK.md` | ✅ Переведён |
| `README.md` | ⬜ Английский |
| `CHANGELOG.md`, `DECISIONS.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` | ⬜ Английский |
| `examples/`, `reference/`, `templates/` | ⬜ Английский |
| Код и конфигурация (`.mjs`, `.json`, `.html`, `.yml`) | ⬜ Не переводятся, по замыслу |

---

## Раскладки клавиатуры

Эта ветка охватывает тех, кто печатает следующими раскладками клавиатуры Windows:

`Russian`, `Russian - Mnemonic`, `Russian (Typewriter)`

---

## Сообщить об ошибке перевода

Откройте issue в репозитории, указав файл, раздел и предлагаемую формулировку. Правка перевода **никогда**
не меняет нормативного смысла: если вы считаете ошибочной английскую версию, это отдельный issue, и он
относится к `main`.
