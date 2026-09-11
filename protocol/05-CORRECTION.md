> **Resmî olmayan çeviri.** Bu belgenin normatif sürümü `main` dalındaki İngilizce sürümdür. Bu çeviri
> kolaylık olsun diye sunulmuştur ve **ana dili bu dil olan biri tarafından gözden geçirilmemiştir**.
> İngilizce özgün metinden ayrıldığı yerde **İngilizce geçerlidir**. Protokol tanımlayıcıları (`RUN`,
> `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, veri yolu fiilleri ve dosya adları) bilinçli olarak İngilizce
> bırakılmıştır: bunlar aracıların ayrıştırdığı sabit değerlerdir.

# 05 — DÜZELTME

**Durum: normatif.** Kayıtlı bir olgunun yanlış çıkması durumunda ne olacağı.

---

## 1. Sorun

> Altı dosyada ileri sürülen bir olgu, bunların beşinde yanlış olacaktır.

O sırada bakmakta olduğunuz dosyayı düzeltmek bir düzeltme değildir. Bu, hem doğrunun hem de hatanın
atıflara sahip olduğu bir ağaç yaratır ve bir sonraki oturum hangisini önce açarsa onu seçer. Belge
ağırlıklı bir aracı filosunun tanımlayıcı arıza biçimi budur ve sessizce birikir.

**Bir düzeltme ya yayılır ya da hiç gerçekleşmemiştir.**

---

## 2. Okumak bedelsiz değildir — yükümlülük doğurur

Yönetici bir dosyayı okumak sizi onun altına sokar. Bundan iki şey çıkar:

1. İçindeki **kalıcı, apaçık olmayan ve ağaçtan türetilemeyen** her şey, oturum bitmeden kalıcı
   belleğinize gider.
2. **Bağlamınız dosyayla çelişiyorsa, dosya kazanır.** Etrafından dolaşmayın. Kaydı düzeltin.

---

## 3. Anlık Rota Düzeltmesi (ICC)

Tek komut, tek tur, öneri adımı yok.

```
/icc the planner meal times are placeholders, not the Operator's actual times
```

### Sıra

**1 · Tarama.** Düzeltmeden 2–5 arama terimi türetin: **eski** ifade, onun bariz türevleri ve işin
içindeki özel adlar. Yeni ifade değil. Herhangi bir şey okumadan önce terim başına bir dizinli tarama
çalıştırın. İsabetleri bulmak için ağaçta asla dosya dosya dolaşmayın — dizin bunun içindir.

**2 · Her isabeti sınıflandırın.**

| İsabet | Eylem |
|---|---|
| **Eski olguyu ileri sürüyor** | Yeniden yazın. |
| **Geçerken anıyor**, her iki durumda da doğru | Bırakın. Metni boş yere çalkalamayın. |
| **Yeni olguyla dolaylı olarak çelişiyor** — akışın aşağısındaki bir sonuç, bir tablo satırı, eski değer üzerine kurulmuş zamanlanmış bir iş | **Onu da yeniden yazın.** En sık atlanan budur. |
| **Sınır dışı** (§5) | Asla düzenlemeyin. *Dokunulmayanlar* altında not edin. |

**3 · Hepsini bir kerede yeniden yazın.** Her dosyanın mevcut üslubuna ve güven etiketi geleneğine uyun.
Düzeltilmiş bir olgu hak ettiği etiketi korur — **artık güncel diye bir iddiayı `[PROVEN]`'a
yükseltmeyin.** Eski metin bir tarih taşıyorsa, bugünün tarihini basın.

Bir olgu üçten fazla dosyada ileri sürülüyorsa, bu **yinelemedir, artıklık değil**: sahibi olan dosyada
bir kez belirtin ve diğerlerinin oraya işaret etmesini sağlayın.

**4 · Defter ve bellek.** İkisi de olmalı, yoksa çalıştırma bitmemiştir. Düzeltme defterinin başına bir
kayıt ekleyin:

```
## 2026-01-14 — meal times are placeholders

Was      planner asserts 07:30 / 12:00 / 18:30 as the Operator's actual times
Now      those are defaults shipped with the template; real times are unknown
Why      Operator correction, 2026-01-14
Files    personal/planner/NOW.md:14, personal/planner/README.md:31, _os/tasks/INDEX.md:88
Memory   planner-meal-times.md (updated)
Left     backups/ (history), CONTEXT-BUNDLE.md (generated)
```

Ardından olguyu kalıcı belleğe yazın — **önce konuyla ilgili mevcut bir bellek olup olmadığını
denetleyip onu güncelleyerek**; az önce bir komut harcayarak birleştirdiğiniz bir olgunun iki sürümünü
bırakmak yerine.

**5 · Düzenleme sonrası yükümlülükler.** Düzenlemelerin gerektirdiği üretici ya da yedekleme neyse onu
yeniden çalıştırın. Dosya oluşturulduysa veya silindiyse dizini yeniden kurun.

---

## 4. Sürekli bir karar açıkta tersine çevrilir

Bir düzeltme sürekli bir kararı geçersiz kılıyorsa — bir "yeniden tartışma" satırını, bir `[PROVEN]`
maddesini, bir politika kuralını — **sessizce ters çevirmeyin.** Tarihi ve gerekçesiyle birlikte
*tersine çevrildi* olarak yeniden yazın ki bir sonraki oturum onun unutulmadığını, bozulduğunu bilsin.

İz bırakmadan değişen bir karar, hiç verilmemiş bir karardan ayırt edilemez.

---

## 5. Asla yeniden yazılmayanlar

| Asla dokunulmaz | Neden |
|---|---|
| `backups/`, `archive/` | Tarih. Tarih düzeltilmez; yerine yenisi geçer. |
| Üretilmiş dosyalar | Kaynağı düzenleyin ve üreticiyi yeniden çalıştırın. |
| Yalıtılmış bir aracının ağacı | Yalnızca adla erişim. |
| Başka bir kökün yetkili ana bağlamı | Sapmayı bildirin. Bir sahiplik sınırının ötesine geçerek düzenleme yapmayın. |
| Sır barındıran her şey | Bir metin taraması için tümüyle kapsam dışı. |

**Metni yeniden yazan bir tarama ikili dosyaları mahveder.** Her taramayı, dışlama yoluyla değil, izin
listesiyle metin uzantılarıyla sınırlayın.

---

## 6. ICC'nin yapmadığı şey

`/icc` kaydı düzeltir. **Ardından düzeltmenin gerektirdiği işi yapmaya gitmez.** Bunlar ayrı
yetkilendirmelere sahip ayrı edimlerdir ve ikisini birbirine karıştırmak, tek satırlık bir düzeltmenin
gözden geçirilmemiş bir yeniden yapılandırmaya dönüşme yoludur.

---

## 7. Rakip olgular çözülür ve budanır — kataloglanmaz

İki dosya birbiriyle çelişen olgular ileri sürdüğünde, **hangisinin doğru olduğuna karar verin, onu
koruyun ve yanlış olan iddiaları aynı geçişte kaldırın.**

Her iki rakibi de diskte bırakan bir çatışma raporu hiçbir şeyi çözmemiştir. Bir sonraki oturum yine
hangi dosyayı önce açarsa onu seçer ve dolaşımda beş sürümü olan bir güvenlik kuralı, tek sürümü olandan
daha *az* güvenilirdir, daha çok değil.

**Esasa göre karar verin, asla zaman damgasına göre değil.** Kazanan, olgunun sahibi olan dosyadır; bir
ölçümle desteklenen sürümdür; incelemeden sağ çıkandır. **En yeni, en doğru değildir** — buradaki
örnek arıza, birbirinden doksan saniye arayla yazılmış dört yinelenen bellek dosyasıdır; en yenisi
yanlış iddiayı ileri sürüyordu, dolayısıyla "en yeni kazanır" kuralı hatayı devralırdı.

**Çözümü kaydedin.** Hangi olgunun kazandığını, neyin budandığını ve nedenini — deftere, ki budama
sessiz değil okunabilir olsun. İz bırakmadan yok olan bir rakip, hiç var olmamış bir rakiple birebir
aynı görünür ve bir sonraki oturum onu yeniden yaratır.

### Çözülmek yerine yine yukarı taşınanlar

Üç durum. Bunları yüzeye çıkarın; karara bağlamayın:

- Çelişki, aracının sahip olmadığı bir bilgiye dayanıyor.
- Yanılmak **güvensiz veya geri alınamaz** olurdu — basamak 0–2'deki her şey.
- Kaybeden iddia **aracının sahiplik sınırının dışında** duruyor — başka bir kökün yetkili ana bağlamı.
  Sapmayı bildirin; sınırın ötesine geçerek düzenleme yapmayın.

Olağan olan her şey karara bağlanır ve temizlenir.
