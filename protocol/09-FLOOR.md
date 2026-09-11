> **Resmî olmayan çeviri.** Bu belgenin normatif sürümü `main` dalındaki İngilizce sürümdür. Bu çeviri
> kolaylık olsun diye sunulmuştur ve **ana dili bu dil olan biri tarafından gözden geçirilmemiştir**.
> İngilizce özgün metinden ayrıldığı yerde **İngilizce geçerlidir**. Protokol tanımlayıcıları (`RUN`,
> `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, veri yolu fiilleri ve dosya adları) bilinçli olarak İngilizce
> bırakılmıştır: bunlar aracıların ayrıştırdığı sabit değerlerdir.

# 09 — ZEMİN

**Durum: görselleştirici için normatif; bir model olarak bilgilendirici.**
[`reference/sidecar/hmi.html`](../reference/sidecar/hmi.html) tarafından gerçeklenir.

---

## 1. İddia

Bir aracı filosunu görmek zordur. Bir dosya ağacı bir listedir, bir süreç tablosu bir listedir ve bir
günlük bir listedir — dolayısıyla çalışan bir filo hakkında herkesin sahip olduğu tek resim, birbirine
oturmayan birkaç listedir.

**Otomatikleştirilmiş bir depo aynı makinedir ve kırk yıldır okunabilir durumdadır.** Vinçler bir kontrol
sistemi altında yükleri raflar arasında taşır ve onu denetleyen kişi, tek bir satır metin okumadan,
renkten, yüzlerce eşzamanlı hareketin olduğu bir zemini bir bakışta okur.

Parvis bunu ödünç alır. Süs olarak değil — bir *eşleme* olarak; burada her depo nesnesi ağaçtaki tam
olarak bir şeye karşılık gelir ve deponun kendi güvenlik kurallarının, protokolün güvenlik kuralları
olarak zaten doğru yere çizilmiş olduğu ortaya çıkar.

---

## 2. Eşleme

| Zeminde | Filoda | Nereden okunur |
|---|---|---|
| **Vinç** | bir aracı ya da canlı bir oturum | `_os/exchange/bus/session/` içindeki oturum işaretleyicileri |
| **Palet** | bir dizin | ağacın kendisi; paletin etiketi onun yoludur |
| **Raf konumu** | o dizinin bulunduğu yer | üst dizini |
| **Bir paleti açmak** | dizine inmek | **bambaşka, eksiksiz bir depo** — §4 |
| **İş açma** (giriş rampası) | gelen iş | `_os/tasks/INDEX.md` içindeki bir `REQ` satırı |
| **Sevk hattı** (çıkış rampası) | ayrılan bir teslimat | `_os/events/surface/` içindeki bir dosya, bir dışa aktarım |
| **Konveyör** | dosya veri yolu | `_os/exchange/bus/` — işin bir vinç taşımadan nasıl hareket ettiği |
| **Kamyon** | bir dış hizmet ya da başka bir yapay zekâ | sınır. §5 |

Mesele resim değildir. Mesele şudur: bir depo kontrol sisteminin karşısında hiç durduysanız **bu ekranı
okumayı zaten biliyorsunuzdur** — durmadıysanız da model, bir dizin listesinin olmadığı bir biçimde
somuttur.

---

## 3. Renkler

Herhangi bir gezinmeden önce, tek bakışta:

| Renk | Zeminde | Filoda |
|---|---|---|
| **YEŞİL** | hareket hâlinde — bir vinç yük taşıyor | bir aracı çalışıyor; görev ortasında canlı bir oturum |
| **MAVİ** | zamanlanmış — sıraya alınmış, henüz başlamamış | bir iş panosu ilanı: emredilmiş, bir aracı bekliyor |
| **KEHRİBAR** | dikkat — bir konum bir karar gerektiriyor | `YELLOW`: her eylemden önce sor |
| **KIRMIZI** | acil durduruldu — o bölge durdurulmuş | `STOP`: acil durdurma kurulu ve bu kök dondurulmuş |
| **GRİ** | boş ya da canlı kaynak yok | veri yok. Asla bir tahmin değil. |

Bu yeni bir şema değildir. Ağacın zaten barındırdığı durumun işlenmiş hâlidir.

**Kırmızı bakışı her zaman kazanır.** Tek bir kırmızı bölge, gözü herhangi bir yeşilden önce durdurur;
tıpkı durdurmanın diğer her sinyalin üzerinde olması gibi ([`01`](01-ESTOP.md)). **Kırmızı bir bölgenin
üzerinde yeşil gösteren bir zemin yalan söylüyordur** — ve bu kuralın yasaklamak için var olduğu belirli
arıza budur.

**Canlı kaynağın olmadığı yerde gri zorunludur.** Verisi olmayan bir konum gri işlenir ve `—` okunur.
Asla yeşil işlenmez; çünkü yeşil, hoşa giden öntanımlıdır ([`07`](07-INTERFACE.md) §2.2).

---

## 4. İç içe depo

**Bir paleti açtığınızda bir kutuya bakmıyorsunuzdur. Bambaşka, eksiksiz bir depoya bakıyorsunuzdur** —
kendi vinçleri, kendi paletleri, kendi rampalarıyla.

Bu, tam olarak dosya ağacıdır. Bir girişim bir depodur; bölümleri koridorlardır; dosyaları paletlerdir;
ve kendisi bir dizin olan bir palet başka bir zemindir. Dolayısıyla görselleştirici, her derinlikte aynı
denetimlere sahip, **inen tek bir görünümdür**; çünkü her düzey bir depo *dur*. Aşağı inerken öğrenilecek
yeni bir şey yoktur.

Özyineleme, mecazın bir kaplama olmak yerine tutmasının bütün nedenidir. Yalnızca en üst düzeyi işleyen
bir gösterge paneli bir filonun resmidir; inen bir gösterge paneli ise onun görünümüdür.

---

## 5. Kamyonlar sınırda yanaşır — asla zemine çıkmaz

Modelin bir görselleştirme olmaktan çıkıp bir şeyi uygulamaya başladığı yer burasıdır.

Bir dış hizmet — başka bir yapay zekâ, bir API, bir sağlayıcı — bir **kamyondur**. Ve gerçek bir depoda
kamyon bir rampaya geri geri yanaşır. Zemine çıkmaz, bir vinci hareket ettirmez, bir rafa girmez ya da
iç içe bir depoyu açmaz. Bir giriş rampasına yük bırakır ya da bir sevk hattından yük alır; erişiminin
tamamı bundan ibarettir.

**O rampa hava kilididir.** Her dış alışveriş kenarda, elenerek gerçekleşir ve dışarıdan hiçbir şey
ağacın içinde başıboş kalmaz.

**Bir kamyonun evrakı, denetlenene dek güvenilmezdir.** Kamyonla gelen bir yük, zemine verilmiş bir emir
değil, gelen *veridir*. Her şey gibi iş olarak açılır ve gözden geçirilir; varışında asla itaat edilmez.
Bu, [`03`](03-BUS.md) §5'teki talimat kaynağı sınırının bir yükleme rampası olarak çizilmiş hâlidir — ve
ekrana bakan birinin ona uyulduğunu görebileceği tek yerde çizilmiştir.

İşlemeniz zemine bir kamyon koyuyorsa, işleme yanlıştır ve çizdiği mimari de yanlıştır.

---

## 6. İki yüzey, iki iş

| | **Zemin** (bu dosya) | **Konsol** ([`07`](07-INTERFACE.md)) |
|---|---|---|
| Nedir | canlı izlenen 3B bir zemin | erişime göre katmanlanmış döşeme bir menü |
| Ne gösterir | **sistemin nasıl olduğunu** — her aracı, dizin ve durum aynı anda | **ne yapabileceğinizi** — aracı seçin, işi yapın |
| Fiil | izle, anla, karar ver | çalıştır, kullan, üret |

**Zemin makinenin nasıl düşündüğünü gösterir; konsol ise vardığınız sonuca göre eyleme geçmek içindir.**
Biri bir harita, diğeri bir tezgâhtır. Bir yönetim yüzeyinin ikisine de ihtiyacı vardır ve hata, yalnızca
güzel olanı inşa etmektir.

---

## 7. Denetimler

Özgün sistemi kullanılabilir kılan şey yalnızca renk değil, gezinmeydi:

| Denetim | Yaptığı |
|---|---|
| **Sürükle** | zeminin çevresinde dön — döndür, eğ, bir koridor boyunca bak |
| **Yukarıdan** | tepeden bir plana geç. Derinlik için yörünge, yerleşim için plan |
| **Bir palete tıkla** | içine in — başka bir depo, aynı denetimler |
| **Kaydır** | yakınlaştır |

Her derinlikte aynı denetimler. Pazarlığa kapalı: indikçe etkileşimi değişen bir görünüm, her düzeyin bir
depo olduğu sözünü çiğnemiştir.

### Kamera bilinçli olarak ortografiktir

**Perspektif ayrımı yoktur.** Paralel çizgiler asla birleşmez ve bir koridorun ta öbür ucundaki bir
konum, ayağınızın dibindekiyle tam olarak aynı boyutta işlenir.

Bu bir an için yanlış görünür — göz birleşme bekler ve yokluğunu, sanki kutuların içinde durup dışarı
bakıyormuş gibi okur. Yine de doğru takastır ve gerçek otomatik zeminlerin kontrol ekranlarının
kullandığı şeydir: **bütün mesele, zemin boyunca konumları bir bakışta karşılaştırmaktır** ve bir
perspektif kamerası, bir koridorun uzak ucunu yakın ucundan daha küçük, daha sönük ve değerlendirmesi
daha zor kılar. Perspektif altında "o raf daha dolu" ile "o raf daha yakın" aynı görünür. Ortografik bir
kamerada görünmezler.

Örtüşme yine de gerçektir — arkaya dönen yüzeyler ayıklanır ve yakın geometri uzak olanın üzerine boyar.
Bu düz bir kameradır, düz bir sahne değil.

Ekipmana ayrıca türe göre gruplanmış bir **yan menüden** de ulaşılabilir — vinçler, paletler, iki rampa,
konveyör, kamyonlar. İster menüden ister zeminden seçin, aynı denetimler açılır; çünkü yalnızca 3B bir
sahnedeki küçük kutulara tıklayarak gezinebildiğiniz bir zemin, bir araç değil bir tanıtımdır.

---

## 8. Zeminin yapabildikleri ve yapamadıkları

[`07`](07-INTERFACE.md) §5'teki her kısıt geçerlidir. Çizgi tek bir belirli yerde çizilir:

**Zemin iş açabilir. Asla yürütemez.**

Bu, [`07`](07-INTERFACE.md) §1'in konsol için zaten çizdiği çizgidir ve ekipmanın denetimlere sahip
olabilmesini sağlayan şeydir. Bir vinci seçip ona iş yöneltmek, o aracıyı adlandıran bir `REQ` satırı
yazar ve gelen kutusuna bir `TELL` bırakır. **Hiçbir şey başlatmaz.** Hiçbir süreç doğmaz, hiçbir komut
çalışmaz ve aracı işi kendi bir sonraki çalıştırmasında alır — ya da almaz.

Yanlış anlaşılması kolay iki sonuç:

- **Yöneltilmiş iş yine de bir emir değildir.** `REQ` satırı kanonik kayıttır; gelen kutusu satırı
  yalnızca ona işaret eder. Bir aracıya *emir veren* — ya da ağacın içinden İşletmenin yetkisini ileri
  süren — bir dosya, [`03`](03-BUS.md) §5'in tanımladığı güvenlik olayı olurdu ve bunu yüzeye inşa
  etmek, elle inşa etmekten daha kötü olurdu. Yetki, konuşmadaki İşletmendir. Zemin kaydı yazar,
  talimatı değil.
- **Bazı ekipman bilinçli olarak denetim almaz.** Konveyör salt okunurdur: veri yoluna satır yazabilen
  bir konsol, protokolün ona tanımadığı bir yetkiyi imal ediyor olurdu. Kamyonların ise hiç denetimi
  yoktur — §5.

**`STOP` altında zemin kırmızı işlenir ve hiçbir iş açmaz.** Kırmızı bir zemin emir almaz.

Dürüst sınır, bir kez belirtilmiş hâliyle: **bu, ağacın bir andaki resmidir, canlı bir telemetri akışı
değil.** Yoklama yapar. Yoklamalar arasında bayattır, en son ne zaman okuduğunu gösterir ve yardımcı
bileşen yanıt vermeyi bıraktığında aksini varsaymak yerine griye döner.
