# Çeviri Durumu — Türkçe (`lang/tr`)

> **English summary:** this branch is the Parvis Protocol with `protocol/` translated into Turkish.
> The English text on `main` is normative. Files not listed as translated below are still English —
> this branch is a complete, working copy of the repository, not a partial one.

---

## Bu dal nedir

Bu dal, aşağıda listelenen dosyaları Türkçeye çevrilmiş hâliyle **eksiksiz** Parvis Protocol
deposudur. Hiçbir şey kaldırılmamıştır. Bir dosya henüz çevrilmemişse burada özgün dilinde görünür ve
tümüyle kullanılabilir kalır.

**`main` dalındaki İngilizce metin normatif sürümdür.** Bu çeviri ile özgün metnin ayrıldığı yerde
İngilizce geçerlidir. Bu çeviri makine destekli olarak hazırlanmıştır ve **ana dili Türkçe olan biri
tarafından gözden geçirilmemiştir**.

## Protokol tanımlayıcılarına ilişkin kural

Aşağıdakiler **bilinçli olarak İngilizce** bırakılmıştır; çünkü bunlar akıcı metin değil, aracıların
ayrıştırıp karşılaştırdığı sabit değerlerdir:

- durum fiilleri `RUN`, `YELLOW`, `STOP`;
- güven etiketleri `[PROVEN]`, `[CLAIMED]`, `[ASSUMED]`, `[PROPOSED]`;
- altı veri yolu fiili `FLASH`, `ASK`, `ANS`, `TELL`, `GATE`, `ACK`;
- defter satırları `REQ`, `DONE`, `BLOCKED`, `REFUSED`;
- bütün dosya adları ve yollar (`_os/`, `estop`, `protocol/00-PRECEDENCE.md`, …).

Bunları çevirmek, onları okuyan her uygulamayı bozardı.

---

## Kapsam

| Dosya | Durum |
|---|---|
| `protocol/00-PRECEDENCE.md` | ✅ Çevrildi |
| `protocol/01-ESTOP.md` | ✅ Çevrildi |
| `protocol/02-EVIDENCE.md` | ✅ Çevrildi |
| `protocol/03-BUS.md` | ✅ Çevrildi |
| `protocol/04-OUTPUT-CONTRACT.md` | ✅ Çevrildi |
| `protocol/05-CORRECTION.md` | ✅ Çevrildi |
| `protocol/06-DATA-ZONES.md` | ✅ Çevrildi |
| `protocol/07-INTERFACE.md` | ✅ Çevrildi |
| `protocol/08-AGENTS.md` | ✅ Çevrildi |
| `protocol/09-FLOOR.md` | ✅ Çevrildi |
| `protocol/10-AIRLOCK.md` | ✅ Çevrildi |
| `README.md` | ⬜ İngilizce |
| `CHANGELOG.md`, `DECISIONS.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` | ⬜ İngilizce |
| `examples/`, `reference/`, `templates/` | ⬜ İngilizce |
| Kod ve yapılandırma (`.mjs`, `.json`, `.html`, `.yml`) | ⬜ Tasarım gereği çevrilmez |

---

## Klavye düzenleri

Bu dal, aşağıdaki Windows klavye düzenleriyle yazanları kapsar:

`Turkish Q`, `Turkish F`

---

## Bir çeviri hatası bildirmek

Depoda bir issue açın; dosyayı, bölümü ve önerdiğiniz ifadeyi belirtin. Bir çeviri düzeltmesi normatif
anlamı **asla** değiştirmez: İngilizce metnin yanlış olduğunu düşünüyorsanız bu ayrı bir issue'dur ve
`main` dalına yöneltilir.
