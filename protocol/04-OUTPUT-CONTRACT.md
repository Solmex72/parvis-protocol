> **Resmî olmayan çeviri.** Bu belgenin normatif sürümü `main` dalındaki İngilizce sürümdür. Bu çeviri
> kolaylık olsun diye sunulmuştur ve **ana dili bu dil olan biri tarafından gözden geçirilmemiştir**.
> İngilizce özgün metinden ayrıldığı yerde **İngilizce geçerlidir**. Protokol tanımlayıcıları (`RUN`,
> `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, veri yolu fiilleri ve dosya adları) bilinçli olarak İngilizce
> bırakılmıştır: bunlar aracıların ayrıştırdığı sabit değerlerdir.

# 04 — ÇIKTI SÖZLEŞMESİ

**Durum: normatif.** İş bittiğinde nereye gittiği.

---

## 1. Kural

**Sohbete rapor vermeyin. Dosya ağacında çalışın, çıktıyı diske yazın ve bir işaretçi yüzeye çıkarın.**

Uzun bir yanıtı bir sohbet penceresine yazarak işini bitiren bir aracı, çıktısını filodaki başka hiçbir
şeyin okuyamayacağı bir yere koymuştur — başka bir aracı, bir izleyici, bir konsol, bir sonraki oturum
okuyamaz. Kalıcı kayıt dosyadır; sohbet ise akışın aşağısındaki kimsenin görmediği bir döküm.

---

## 2. Çıktı nereye gider

| Çıktı türü | Konduğu yer |
|---|---|
| İş ürünü, bulgular, bir rapor | sahibi olan dosya ya da `outbox/YYYYMMDD-HHMMSS-<slug>.md` |
| İşletmenin şimdi görmesi gereken her şey | `_os/events/surface/` içinde kısa bir işaretçi dosyası |
| İşletmeni gerektiren bir talep | `_os/exchange/requests/REQ-<slug>.md` |
| Defter satırı | `_os/tasks/INDEX.md` |

**Yüzey dizini bildirimdir. Dosya ise özdür.** Özü kendi asıl yerine yazın, ardından `surface/` içine
tek satırlık bir işaretçi bırakın ki konsol İşletmene işin nereye indiğini göstersin.

---

## 3. Görev dizini

Emir başına bir satır. Kesintiye uğrayan bir görevin yine de görünür olması için başlamadan **önce** bir
`REQ` satırı ekleyin.

```
REQ     | 2026-01-14 | SCOUT | <the order, in the Operator's words where possible> | <status note>
DONE    | 2026-01-14 | SCOUT | <the order> | evidence: outbox/20260114-090312-lease-rates.md
BLOCKED | 2026-01-14 | SCOUT | <the order> | <what is blocking, one line>
REFUSED | 2026-01-14 | SCOUT | <the order> | <why, one line + where the reasoning lives>
```

**Kanıt yolu olmayan bir `DONE` satırı geçersizdir.** Dosya yoksa, iş İşletmenin görebileceği hiçbir
yere inmemiştir. Kendi bildirimi `[CLAIMED]`'dir; onu `[PROVEN]` yapan şey dosyadır.

**Bir ret buraya kalıcı olarak aittir.** Filonun kapanmış soruları yeniden tartışmasını bu durdurur.
Sonradan silmeyin.

**Dürüst sınır:** bu dizin hiçbir şeyi gözlemlemez. Tam olarak, kendisine yazan aracılar kadar
eksiksizdir. Dizinde bulunmayan bir görev, o görevin hiç gerçekleşmediğinin kanıtı değildir — yalnızca
kimsenin kaydetmediğinin kanıtıdır. Bir satırı her zaman *kanıt yolu iliştirilmiş bir iddia* olarak
görün, asla kanıt olarak değil. Herhangi bir `DONE`'a güvenmeden önce kanıt dosyasının var olduğunu
doğrulayın.

---

## 4. Tamamlanma, İşletmenin onu görmesidir

Bir aracının öyle ilan etmesi değil. Bir yanıt bir duruş noktası değildir: izleyiciler bunun ötesinde de
kurulu kalır, iş sürer ve ardından bilinçli bir kapanış onayı gelir.

---

## 5. Yönlendirmenin üzerinde olan karşı kural

**Acil durdurma ve açık sözlülük yine insana, derhâl ve göze çarpar biçimde gider.**

Bir başarısızlık, bir başarıyla aynı belirginlikte yüzeye çıkarılır. Çıktıyı dosyalara yönlendirmek,
asla kötü bir sonucu gömmenin yolu hâline gelmemelidir. Filonun iyi haberi sohbette, kötü haberi ise
kimsenin açmadığı bir dosyada geliyorsa, sözleşme tersine çevrilmiştir ve filo artık yönlendirme
yoluyla yalan söylüyordur.

---

## 6. Sözleşmenin kendisine dair dürüst sınır

Bir sohbet kılıfı içinde çalışan bir aracı, o sohbette yine de asistan metni üretir — bu sözleşme kılıfı
yeniden yönlendiremez. Bağladığı şey, **bir aracının ne yazmayı seçtiğidir**: öz dosyalarda, sohbet
metni ise kısa bir işaretçiyle sınırlı — *"`<path>` içine yazıldı, konsola yüzeye çıkarıldı"* — asla
raporun tamamı değil.

---

## 7. Hiçbir sır yüzeye ulaşmaz

`surface/` bir konsol tarafından okunur ve bir ekranda, bir ekran görüntüsünde ya da paylaşılan bir
pencerede görüntülenebilir. Veri bölgesi kuralları ([`06-DATA-ZONES.md`](06-DATA-ZONES.md)) burada tüm
gücüyle geçerlidir.
