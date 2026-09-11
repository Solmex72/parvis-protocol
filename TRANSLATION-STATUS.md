# حالة الترجمة — العربية (`lang/ar`)

> **English summary:** this branch is the Parvis Protocol with `protocol/` translated into Arabic. The
> English text on `main` is normative. Files not listed as translated below are still English — this
> branch is a complete, working copy of the repository, not a partial one. Arabic is right-to-left while
> the protocol identifiers and code blocks remain left-to-right; renderers vary in how they lay out
> mixed-direction tables, so if a table looks reordered, that is the renderer, not the content.

---

## ما هذا الفرع

هذا الفرع هو مستودع Parvis Protocol **كاملًا**، وقد تُرجمت فيه الملفات المذكورة أدناه إلى العربية. ولم يُحذف
شيء. وإن كان ملف لم يُترجم بعد، فهو هنا بلغته الأصلية ويبقى صالحًا للاستعمال تمامًا.

**والإنجليزية في الفرع `main` هي النسخة المعيارية.** وحيث تختلف هذه الترجمة عن الأصل، تُقدَّم الإنجليزية. وهذه
الترجمة أُنجزت بمعونة الآلة و**لم يراجعها ناطق أصلي**.

## العُرف في معرّفات البروتوكول

ما يلي أُبقي **بالإنجليزية عمدًا**، لأنه قيم حرفية تحلّلها الوكلاء وتقارنها، لا نصٌّ متّصل:

- أفعال الحالة `RUN` و`YELLOW` و`STOP`؛
- أوسمة الثقة `[PROVEN]` و`[CLAIMED]` و`[ASSUMED]` و`[PROPOSED]`؛
- أفعال الناقل الستة `FLASH` و`ASK` و`ANS` و`TELL` و`GATE` و`ACK`؛
- أسطر الدفتر `REQ` و`DONE` و`BLOCKED` و`REFUSED`؛
- وكل أسماء الملفات والمسارات (`_os/` و`estop` و`protocol/00-PRECEDENCE.md` …).

وترجمتها ستكسر أي تطبيق يقرؤها.

## ملاحظة عن اتجاه النص

العربية تُكتب من اليمين إلى اليسار، بينما تبقى معرّفات البروتوكول وكتل الشيفرة من اليسار إلى اليمين. وتختلف
برامج العرض في كيفية ترتيب الجداول المختلطة الاتجاه. فإن بدا جدول مُعادَ الترتيب، فذلك من برنامج العرض لا من
المحتوى، والنصّ الإنجليزي في `main` هو المرجع عند الشك.

---

## التغطية

| الملف | الحالة |
|---|---|
| `protocol/00-PRECEDENCE.md` | ✅ مُترجَم |
| `protocol/01-ESTOP.md` | ✅ مُترجَم |
| `protocol/02-EVIDENCE.md` | ✅ مُترجَم |
| `protocol/03-BUS.md` | ✅ مُترجَم |
| `protocol/04-OUTPUT-CONTRACT.md` | ✅ مُترجَم |
| `protocol/05-CORRECTION.md` | ✅ مُترجَم |
| `protocol/06-DATA-ZONES.md` | ✅ مُترجَم |
| `protocol/07-INTERFACE.md` | ✅ مُترجَم |
| `protocol/08-AGENTS.md` | ✅ مُترجَم |
| `protocol/09-FLOOR.md` | ✅ مُترجَم |
| `protocol/10-AIRLOCK.md` | ✅ مُترجَم |
| `README.md` | ⬜ إنجليزي |
| `CHANGELOG.md` و`DECISIONS.md` و`CONTRIBUTING.md` و`SECURITY.md` و`CODE_OF_CONDUCT.md` | ⬜ إنجليزي |
| `examples/` و`reference/` و`templates/` | ⬜ إنجليزي |
| الشيفرة والإعدادات (`.mjs` و`.json` و`.html` و`.yml`) | ⬜ لا تُترجم، بحكم التصميم |

---

## تخطيطات لوحة المفاتيح

يغطّي هذا الفرع من يكتبون بتخطيطات لوحة المفاتيح التالية في ويندوز:

`Arabic (101)` و`Arabic (102)` و`Arabic (102) AZERTY`

---

## الإبلاغ عن خطأ في الترجمة

افتح مسألة في المستودع تذكر فيها الملف والقسم والصياغة المقترحة. وتصحيح الترجمة **لا يغيّر** المعنى المعياري
أبدًا: فإن رأيت أن الإنجليزية نفسها خاطئة، فتلك مسألة مستقلة وتخصّ `main`.
