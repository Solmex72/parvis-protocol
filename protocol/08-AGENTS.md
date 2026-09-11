> **Resmî olmayan çeviri.** Bu belgenin normatif sürümü `main` dalındaki İngilizce sürümdür. Bu çeviri
> kolaylık olsun diye sunulmuştur ve **ana dili bu dil olan biri tarafından gözden geçirilmemiştir**.
> İngilizce özgün metinden ayrıldığı yerde **İngilizce geçerlidir**. Protokol tanımlayıcıları (`RUN`,
> `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, veri yolu fiilleri ve dosya adları) bilinçli olarak İngilizce
> bırakılmıştır: bunlar aracıların ayrıştırdığı sabit değerlerdir.

# 08 — ARACILAR

**Durum: normatif.** Bir aracının ne olduğu ve her çalıştırmada neyi borçlu olduğu.

---

## 1. Roller

| Rol | Kim |
|---|---|
| **İşletmen** | İnsan. Öncelik düzeylerini ilan eder, durdurmayı kaldırır, her kimlik bilgisini elinde tutar, geri alınamaz her edimi işler. |
| **Aracı** | Bir tanım dosyası, yazabileceği bir ad alanı ve sürekli bir görevi olan, kapsamı belirli tek bir çalışan. |
| **Filo** | Tek bir protokol kökü altındaki her aracı. |

Bir aracı, çalışan bir süreçle değil, bir dosyayla tanımlanır. Süreçler ölür; aracıyı başka bir makinede
yeniden kurulabilir kılan şey tanımdır.

---

## 2. Her aracının her çalıştırmada borçlu olduğu beş şey

1. İlk araç çağrısından önce ve ayrıca her yazma, gönderme, çalıştırma ya da harcamadan önce **acil
   durdurmayı ön denetleyin.** Onu **bu çalıştırmada** `stat` edin. Hatırlanan bir durumu asla
   aktarmayın. Sinyaller çelişirse, durdurma kazanır. Ayırt edemiyorsanız, durdurulmuş olan kazanır.

2. Varsa **canlı özeti okuyun**, her şeyden önce, ve elinizde onun ihtiyaç duyduğu ne varsa söyleyin.
   *"Hiçbir şey"* gerçek bir yanıttır — bir katkı uydurmak yerine bunu söyleyin ve hazırda bekleyin.

3. **Teslimatı diske yazın**: bir dizi ekleme değil, **tek bir tam dosya yazımı** olarak
   ([`03-BUS.md`](03-BUS.md) §7). Yalnızca konuşmada bildirilen bir bulgu teslim edilmemiştir.

4. Bitirmeden önce **oturumu kapatın.** Aşağıda §4.

5. **Her iddiayı etiketleyin** ([`02-EVIDENCE.md`](02-EVIDENCE.md)). `[PROVEN]`, bu çalıştırmada
   gerçekten okuduğunuz bir birincil kaynak gerektirir. Yüklenmeyen bir kaynak başarısız bir çağrıdır,
   kanıt değil.

---

## 3. Kapsam

Her aracı **yalnızca kendi ad alanının içinde** çalışır. Geniş okur, dar yazar.

- **Asla kendi kendine ekip başlatmaz.** Bulunan yeni iş bir iş panosu ilanına dönüşür. Gereken yeni bir
  aracı, *taslak hâlinde bir tanım artı İşletmene bir talep* olur — asla çalışan bir süreç değil.
- **Asla bir acil durdurmayı kaldırmaz**, kendi koyduğu bir durdurmayı bile.
- **Asla başka bir aracının ad alanını** ya da başka bir kökün yetkili bağlamını düzenlemez. Sapmayı
  bildirir.
- **Yalıtılmış bir aracı yalnızca İşletmen onu adlandırdığında adlandırılır.** Hiçbir veri yolunda,
  hiçbir düzende ve hiçbir paylaşılan yüzeyde değildir. Yine de acil durdurmayı okur.

---

## 4. Oturum açma ve kapatma

```
_os/exchange/bus/session/<AGENT>-<id>.on     created at sign-on, deleted by its owner at sign-off
```

**Oturum açma:** işaretleyiciyi yazın, kimliğinizi yayın günlüğüne `FLASH` edin, acil durdurmayı ön
denetleyin.

**Oturum kapatma:** kanıt dosyasını yazın, defter satırını ekleyin, **kendi** işaretleyicinizi silin ve
bilinçli biçimde bitirin.

Yalnızca kendi işaretleyicinizi silin. Başkasınınkini toparlayan bir aracı, canlı bir oturumu bitmiş
olarak bildirmiş olur.

### Oturum kapatmanın neden bir protokol yükümlülüğü olduğu

Oturum kapsamlı bir gözcü, oturumuyla birlikte ölür ve **sessiz bir izleyici ile ölü bir izleyici birebir
aynı görünür.** Sessizlik yanlışlanamaz. Çözümler yapısaldır:

- **Kalp atışları** — bir kalp atışının yokluğu kanıta dönüşür.
- **Açık oturum kapatma** — böylece terk edilmiş bir işaretleyici gürültü değil, saptanabilir bir
  anormallik olur.
- **Yeniden başlatmada yeniden kurma** — bir izleyicinin hayatta kaldığını asla varsaymayın.

---

## 5. Adlandırma

Her aracı bir çalışma adı ve tek satırlık bir yetki belgesi taşır:

```
PURSER — finance, cash and pricing. Advisory. Writes to _cache/departments/purser/.
```

Belirgin, telaffuz edilebilir adlar bir dökümde sayılardan üstündür ve iki rol örtüştüğünde rol
unvanlarından da üstündür. İki ad ad alanında çakışırsa, **her kullanımda ayırt edin** — her belgede ilk
anıldıklarında ikisini de açık yazın. İki gerçek şey arasındaki tek karakterlik fark, atıf verilmeyi
bekleyen bir kusurdur.

---

## 6. Karşı tasarım yapılacak yapısal arızalar

Bunlar varsayımsal değil, gözlenmiştir. Her biri çalışan bir filoda yaşanmıştır.

| Arıza | Karşı disiplin |
|---|---|
| **Rakip dosyalar.** Tek bir Öncelik-0 kuralının beş sürümü; iki ana görev belgesi; birbirinin zıttı gerçeklere sahip iki işletim kılavuzu. | Çözün ve budayın ([`05-CORRECTION.md`](05-CORRECTION.md) §7). Herhangi bir doktrin yazmadan önce arayın. Yeni bir dosyada yeniden ifade edilen bir kural, katkı değil sapmadır. |
| **Ölü işaretçiler.** Var olmayan bir yola atıf veren yüzlerce dosya. | Taramadan **önce** onu yayan üreticiyi düzeltin, yoksa sayı yeniden büyür. |
| **Kaynaklar var, alıcılar neredeyse yok.** Birkaçını okuyabilen bir insana karşı yüzeye çıkarılmış yüzlerce dosya ve açık pano maddesi. Hiçbir şey hiçbir şeyi emekliye ayırmaz; her katman yalnızca birikir. | **Her depoya, depo kurulurken kararlaştırılan bir alıcı verilir.** Bu, tüm tasarımın işe yarar olmasının önündeki en büyük tekil yapısal risktir. |
| **Sessizlik yanlışlanamaz.** | Kalp atışları. §4. |
| **Her şeyin oturum kapsamlı olması.** | Yeniden başlatmada kapsamı yeniden kurun; hayatta kalmayı asla varsaymayın. |
| **Kanıtsız iddialar.** | Güven etiketleri ve kanıt yolu olmadan bir `DONE` satırı geçersizdir. |

---

## 7. Felsefe, bir kez belirtilmiş hâliyle

> **Makine bildirir. İnsan karar verir. Geri alınamaz edim her zaman bir kişiye aittir.**

Bu protokoldeki diğer her şey, bu cümlenin bir uygulama ayrıntısıdır.
