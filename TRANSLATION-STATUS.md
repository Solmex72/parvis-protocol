# অনুবাদের অবস্থা — বাংলা (`lang/bn`)

> **English summary:** this branch is the Parvis Protocol with `protocol/` translated into Bengali.
> The English text on `main` is normative. Files not listed as translated below are still English —
> this branch is a complete, working copy of the repository, not a partial one.

---

## এই শাখাটি কী

এই শাখাটি **সম্পূর্ণ** Parvis Protocol রিপোজিটরি, যেখানে নিচে তালিকাভুক্ত ফাইলগুলো বাংলায় অনূদিত।
কিছুই সরানো হয়নি। কোনো ফাইল এখনো অনূদিত না হলে সেটি এখানে তার মূল ভাষায় থাকে এবং পুরোপুরি ব্যবহারযোগ্য
থাকে।

**`main` শাখার ইংরেজিই normative সংস্করণ।** এই অনুবাদ ও মূল লেখা ভিন্ন হলে ইংরেজিই প্রযোজ্য। এই অনুবাদ
যন্ত্র-সহায়তায় তৈরি এবং **কোনো স্থানীয় ভাষাভাষী এটি পর্যালোচনা করেননি**।

## প্রোটোকল শনাক্তকারী সম্পর্কিত রীতি

নিচেরগুলো **ইচ্ছাকৃতভাবে ইংরেজিতে** রাখা হয়েছে, কারণ এগুলো প্রবহমান লেখা নয়, বরং সেই আক্ষরিক মান যা
এজেন্টরা পার্স ও তুলনা করে:

- অবস্থা-ক্রিয়া `RUN`, `YELLOW`, `STOP`;
- আস্থা-চিহ্ন `[PROVEN]`, `[CLAIMED]`, `[ASSUMED]`, `[PROPOSED]`;
- ছয়টি বাস-ক্রিয়া `FLASH`, `ASK`, `ANS`, `TELL`, `GATE`, `ACK`;
- খতিয়ানের সারি `REQ`, `DONE`, `BLOCKED`, `REFUSED`;
- সমস্ত ফাইলের নাম ও পথ (`_os/`, `estop`, `protocol/00-PRECEDENCE.md`, …)।

এগুলো অনুবাদ করলে যে বাস্তবায়নই এগুলো পড়ে, তা ভেঙে যাবে।

---

## আচ্ছাদন

| ফাইল | অবস্থা |
|---|---|
| `protocol/00-PRECEDENCE.md` | ✅ অনূদিত |
| `protocol/01-ESTOP.md` | ✅ অনূদিত |
| `protocol/02-EVIDENCE.md` | ✅ অনূদিত |
| `protocol/03-BUS.md` | ✅ অনূদিত |
| `protocol/04-OUTPUT-CONTRACT.md` | ✅ অনূদিত |
| `protocol/05-CORRECTION.md` | ✅ অনূদিত |
| `protocol/06-DATA-ZONES.md` | ✅ অনূদিত |
| `protocol/07-INTERFACE.md` | ✅ অনূদিত |
| `protocol/08-AGENTS.md` | ✅ অনূদিত |
| `protocol/09-FLOOR.md` | ✅ অনূদিত |
| `protocol/10-AIRLOCK.md` | ✅ অনূদিত |
| `README.md` | ⬜ ইংরেজি |
| `CHANGELOG.md`, `DECISIONS.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` | ⬜ ইংরেজি |
| `examples/`, `reference/`, `templates/` | ⬜ ইংরেজি |
| কোড ও কনফিগারেশন (`.mjs`, `.json`, `.html`, `.yml`) | ⬜ নকশা অনুযায়ী অনূদিত নয় |

---

## কীবোর্ড বিন্যাস

এই শাখাটি তাঁদের জন্য যাঁরা নিচের Windows কীবোর্ড বিন্যাস দিয়ে লেখেন:

`Bangla`, `Bangla - INSCRIPT`

---

## অনুবাদের ত্রুটি জানানো

রিপোজিটরিতে একটি issue খুলুন এবং ফাইল, অনুচ্ছেদ ও প্রস্তাবিত শব্দবন্ধ উল্লেখ করুন। অনুবাদ-সংশোধন
normative অর্থ **কখনো** বদলায় না: আপনি যদি মনে করেন ইংরেজিটিই ভুল, সেটি একটি পৃথক issue এবং তা
`main`-এর বিরুদ্ধে।
