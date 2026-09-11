# अनुवाद की स्थिति — हिन्दी (`lang/hi`)

> **English summary:** this branch is the Parvis Protocol with `protocol/` translated into Hindi.
> The English text on `main` is normative. Files not listed as translated below are still English —
> this branch is a complete, working copy of the repository, not a partial one.

---

## यह शाखा क्या है

यह शाखा **संपूर्ण** Parvis Protocol रिपॉज़िटरी है, जिसमें नीचे सूचीबद्ध फ़ाइलें हिन्दी में अनूदित हैं।
कुछ भी हटाया नहीं गया है। यदि कोई फ़ाइल अभी अनूदित नहीं है, तो वह यहाँ अपनी मूल भाषा में दिखती है और पूरी
तरह उपयोग-योग्य बनी रहती है।

**`main` शाखा पर मौजूद अंग्रेज़ी ही normative संस्करण है।** जहाँ यह अनुवाद और मूल एक-दूसरे से भिन्न हों,
वहाँ अंग्रेज़ी मान्य है। यह अनुवाद मशीन-सहायता से तैयार किया गया है और **किसी मूल वक्ता द्वारा इसकी समीक्षा
नहीं की गई है**।

## प्रोटोकॉल पहचानकर्ताओं की परिपाटी

निम्नलिखित **जानबूझकर अंग्रेज़ी में** रखे गए हैं, क्योंकि ये प्रवाही गद्य नहीं, बल्कि वे शाब्दिक मान हैं
जिन्हें एजेंट पार्स और तुलना करते हैं:

- स्थिति-क्रियाएँ `RUN`, `YELLOW`, `STOP`;
- विश्वास-चिह्न `[PROVEN]`, `[CLAIMED]`, `[ASSUMED]`, `[PROPOSED]`;
- छह बस-क्रियाएँ `FLASH`, `ASK`, `ANS`, `TELL`, `GATE`, `ACK`;
- बही-पंक्तियाँ `REQ`, `DONE`, `BLOCKED`, `REFUSED`;
- सभी फ़ाइल-नाम और पथ (`_os/`, `estop`, `protocol/00-PRECEDENCE.md`, …)।

इनका अनुवाद करने से हर वह कार्यान्वयन टूट जाएगा जो इन्हें पढ़ता है।

---

## आवरण

| फ़ाइल | स्थिति |
|---|---|
| `protocol/00-PRECEDENCE.md` | ✅ अनूदित |
| `protocol/01-ESTOP.md` | ✅ अनूदित |
| `protocol/02-EVIDENCE.md` | ✅ अनूदित |
| `protocol/03-BUS.md` | ✅ अनूदित |
| `protocol/04-OUTPUT-CONTRACT.md` | ✅ अनूदित |
| `protocol/05-CORRECTION.md` | ✅ अनूदित |
| `protocol/06-DATA-ZONES.md` | ✅ अनूदित |
| `protocol/07-INTERFACE.md` | ✅ अनूदित |
| `protocol/08-AGENTS.md` | ✅ अनूदित |
| `protocol/09-FLOOR.md` | ✅ अनूदित |
| `protocol/10-AIRLOCK.md` | ✅ अनूदित |
| `README.md` | ⬜ अंग्रेज़ी |
| `CHANGELOG.md`, `DECISIONS.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` | ⬜ अंग्रेज़ी |
| `examples/`, `reference/`, `templates/` | ⬜ अंग्रेज़ी |
| कोड और कॉन्फ़िगरेशन (`.mjs`, `.json`, `.html`, `.yml`) | ⬜ डिज़ाइन के अनुसार अनूदित नहीं |

---

## कुंजीपटल विन्यास

यह शाखा उन लोगों को कवर करती है जो निम्नलिखित Windows कुंजीपटल विन्यासों से लिखते हैं:

`Devanagari - INSCRIPT`, `Hindi Traditional`

---

## अनुवाद की त्रुटि की सूचना देना

रिपॉज़िटरी में एक issue खोलें और फ़ाइल, खंड तथा प्रस्तावित शब्दावली बताएँ। अनुवाद-सुधार normative अर्थ
**कभी** नहीं बदलता: यदि आपको लगता है कि अंग्रेज़ी ग़लत है, तो वह एक अलग issue है और वह `main` के विरुद्ध
है।
