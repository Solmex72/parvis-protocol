# Стан перекладу — Українська (`lang/uk`)

> **English summary:** this branch is the Parvis Protocol with `protocol/` translated into Ukrainian.
> The English text on `main` is normative. Files not listed as translated below are still English —
> this branch is a complete, working copy of the repository, not a partial one.

---

## Що це за гілка

Ця гілка — **повний** репозиторій Parvis Protocol, у якому перелічені нижче файли перекладено українською.
Нічого не вилучено. Якщо файл ще не перекладено, він присутній тут мовою оригіналу й лишається цілком
придатним до використання.

**Англійська версія у гілці `main` є нормативною.** Там, де цей переклад і оригінал розходяться, переважає
англійська. Переклад виконано за участі машини, і **його не перевіряв носій мови**.

## Домовленість про ідентифікатори протоколу

Наведене нижче **навмисно залишено англійською**, бо це буквальні значення, які агенти розбирають і
порівнюють, а не зв'язний текст:

- дієслова стану `RUN`, `YELLOW`, `STOP`;
- позначки впевненості `[PROVEN]`, `[CLAIMED]`, `[ASSUMED]`, `[PROPOSED]`;
- шість дієслів шини `FLASH`, `ASK`, `ANS`, `TELL`, `GATE`, `ACK`;
- рядки реєстру `REQ`, `DONE`, `BLOCKED`, `REFUSED`;
- усі імена файлів і шляхи (`_os/`, `estop`, `protocol/00-PRECEDENCE.md`, …).

Їхній переклад зламав би будь-яку реалізацію, що їх читає.

---

## Покриття

| Файл | Стан |
|---|---|
| `protocol/00-PRECEDENCE.md` | ✅ Перекладено |
| `protocol/01-ESTOP.md` | ✅ Перекладено |
| `protocol/02-EVIDENCE.md` | ✅ Перекладено |
| `protocol/03-BUS.md` | ✅ Перекладено |
| `protocol/04-OUTPUT-CONTRACT.md` | ✅ Перекладено |
| `protocol/05-CORRECTION.md` | ✅ Перекладено |
| `protocol/06-DATA-ZONES.md` | ✅ Перекладено |
| `protocol/07-INTERFACE.md` | ✅ Перекладено |
| `protocol/08-AGENTS.md` | ✅ Перекладено |
| `protocol/09-FLOOR.md` | ✅ Перекладено |
| `protocol/10-AIRLOCK.md` | ✅ Перекладено |
| `README.md` | ⬜ Англійська |
| `CHANGELOG.md`, `DECISIONS.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` | ⬜ Англійська |
| `examples/`, `reference/`, `templates/` | ⬜ Англійська |
| Код і конфігурація (`.mjs`, `.json`, `.html`, `.yml`) | ⬜ Не перекладаються, за задумом |

---

## Розкладки клавіатури

Ця гілка охоплює тих, хто друкує такими розкладками клавіатури Windows:

`Ukrainian`, `Ukrainian (Enhanced)`

---

## Повідомити про помилку перекладу

Відкрийте issue в репозиторії, зазначивши файл, розділ і запропоноване формулювання. Правка перекладу
**ніколи** не змінює нормативного змісту: якщо ви вважаєте хибною англійську версію, це окремий issue, і він
стосується `main`.
