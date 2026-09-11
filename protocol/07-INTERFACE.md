> **Resmî olmayan çeviri.** Bu belgenin normatif sürümü `main` dalındaki İngilizce sürümdür. Bu çeviri
> kolaylık olsun diye sunulmuştur ve **ana dili bu dil olan biri tarafından gözden geçirilmemiştir**.
> İngilizce özgün metinden ayrıldığı yerde **İngilizce geçerlidir**. Protokol tanımlayıcıları (`RUN`,
> `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, veri yolu fiilleri ve dosya adları) bilinçli olarak İngilizce
> bırakılmıştır: bunlar aracıların ayrıştırdığı sabit değerlerdir.

# 07 — ARAYÜZ KATMANI

**Durum: normatif.** Projenin adını aldığı dosya budur.

Bir insanın dokunduğu her yüzey **Parvis**'tir. Salt okunur zemin görünümü *Parvis HMI*'dir; filoyu
sürdüğünüz döşeme menüsü ise *Parvis Console*'dur.

---

## 1. HTML'i çalışır kılan kural

> Bir tarayıcı sayfası bir **ekran ve bir klavyedir**, disk erişimi olan bir program değil.

Bu tek olgu bütün katmanı yönetir:

- **Sayfa gösterir ve toplar.** Durumu işler ve girdi alır. Bir dosya yolundan açıldığında, kendi
  başına, **ağacı okuyamaz ve bir emir yazamaz.** Tarayıcı kum havuzu her ikisini de yasaklar ve bu bir
  özelliktir.
- **Yardımcı bileşen köprü kurar.** Küçük bir geri döngü hizmeti — yalnızca `127.0.0.1`'e bağlı, başka
  hiçbir şeye değil — sayfa adına ağacı okuyan ve sayfanın gönderdiğini yazan tek şeydir. Sayfa ondan
  durumu `GET` eder; sayfa ona bir istem `POST` eder; disk işini yardımcı bileşen yapar. **Yardımcı
  bileşen yoksa canlı Parvis de yoktur — yalnızca bir anlık görüntü vardır.**
- **Hiçbir şey incelemeyi atlamaz.** Parvis'ten gönderilen bir istem bir **iş açmadır, bir yürütme
  değil**. Yardımcı bileşen görev dizinine bir `REQ` satırı yazar ve durur. Asla bir aracı başlatmaz,
  asla bir komut çalıştırmaz, asla bir şey göndermez. Yeni işi işlemek İşletmenin tuş vuruşu olarak
  kalır.

Sayfanın "çalışmasının" nedeni budur: sayfa bir pencere olduğu konusunda dürüsttür, yardımcı bileşen
küçük gerçek işi kenarda yapar ve **inceleme hâlâ bir istem ile hareket eden bir makine arasında
durur.**

---

## 2. Katı gereksinimler — her Parvis yüzeyi

1. **Kendi kendine yeterli.** Tek bir HTML dosyası: satır içi CSS ve JS, dış betik yok, CDN yok. Yalnızca
   gerçek bir yedek yığınıyla birlikte web yazı tipleri. Bir dosya yolundan çevrimdışı işlenebilmelidir.

2. **Renkler durumdur; canlı okunur, asla uydurulmaz.** Yeşil = çalışıyor, kehribar = önce sor,
   kırmızı = durduruldu — STATE dosyasından ve canlı defterden türetilir. **Canlı kaynağı olmayan bir
   değer `—` gösterir, asla makul görünen bir sayı değil.** Kırmızı, diğer her rengin ve tüm arayüzün
   üzerindedir.

3. **Yardımcı bileşen yalnızca geri döngüdedir ve sayfanın görebileceği hiçbir sır tutmaz.** Hiçbir API
   anahtarı, hiçbir kimlik bilgisi, değeri olan hiçbir jeton tarayıcıya ulaşmaz. Yardımcı bileşen
   sayfayı yerel bir oturum jetonuyla doğrular ve ayrıcalıklı işi kendisi yapar. **Sayfa hiçbir zaman
   çalınmaya değer bir şey tutmaz.**

4. **Bir anlık görüntü, okunma zamanıyla birlikte anlık görüntü olarak etiketlenir.** Yalnızca canlı bir
   yardımcı bileşenle konuşan bir sayfa kendini canlı olarak sunabilir. Canlı görünen bayat bir sayfa,
   hiç sayfa olmamasından kötüdür.

5. **Acil durdurma arayüzün üzerindedir.** `STOP` altında Parvis hiçbir iş açmaz ve yardımcı bileşen
   oturum kapatma satırından başka hiçbir şey yazmaz. **Kırmızı bir zemin emir almaz.**

6. **Parvis markası ve üçüncü taraf şirket adı yok.** Kalıp hangi gerçek sistemlerden öğrenilmiş olursa
   olsun, kalıp sizindir ve adı Parvis'tir. Başkasının ticari adını taşıyan bir yüzey yanlıştır ve
   düzeltilir.

---

## 3. Yardımcı bileşen için güvenlik gereksinimleri

Bir geliştirici iş istasyonundaki geri döngü HTTP hizmeti gerçek bir saldırı yüzeyidir. Bunlar isteğe
bağlı değildir.

| Gereksinim | Neden |
|---|---|
| **Açıkça `127.0.0.1`'e bağlanın**, asla `0.0.0.0`'a değil | Tüm arayüzlere bağlanmak filo konsolunuzu yerel ağda yayımlar. |
| `127.0.0.1:<port>` / `localhost:<port>` izin listesine karşı **`Host` başlığını doğrulayın** | Ziyaret ettiğiniz bir web sayfasının geri döngü hizmetine ulaşma yolu olan DNS yeniden bağlamayı boşa çıkarır. |
| **Sizin vermediğiniz bir `Origin` taşıyan istekleri reddedin** | Aynı saldırı sınıfı, farklı vektör. |
| Her değiştirici yolda, sayfa yüklenirken verilen ve asla günlüğe yazılmayan bir **oturum jetonu isteyin** | Sayfa, sizin sayfanız olduğunu kanıtlar. |
| Hizmetin okuyacağı ya da yazacağı **her yolu izin listesine alın**, sonra yeniden çözümleyip kapsanmayı doğrulayın | Dizin aşımını boşa çıkarır. Sembolik bağlar varsa tek başına izin listesi yetmez. |
| **Okunamayan bir acil durdurmada güvenli tarafa düşün** — reddedin, `RUN`'a varsaymayın | Bkz. [`01-ESTOP.md`](01-ESTOP.md) §2. |
| **`eval` yok, kabuğa çıkış yok, kullanıcı girdisinin şablona gömülmesi yok** | İstem çubuğu bir iş açma girdisidir, bir komut satırı değil. |

[`reference/sidecar/`](../reference/sidecar/) içindeki referans uygulaması bunların hepsini gerçekler ve
her birinin bulunduğu noktada açıklama taşır.

---

## 4. Yüzeyler nelerdir

| Yüzey | Ne | Durum |
|---|---|---|
| **Parvis Console** | Sekmeli paneller — durum, belgeler, defter, veri yolu, yüzey, ayarlar | Yayında. |
| **Parvis Floor** | Depo sekmesi: 3B zemin, yörünge ve içeri dalma, ekipman denetimleri | Yayında. Bkz. [`09-FLOOR.md`](09-FLOOR.md). |
| **İstem çubuğu** | İş açma girdisi; konsolda ve her zemin ekipmanı üzerinde | Yayında. |
| **Yardımcı bileşen** | Geri döngü köprüsü: ağacı okur, `REQ` satırları yazar, hiçbir sır tutmaz | Yayında. |

**Önce panelleri yayına alın.** 3B zemin, herkesin inşa etmek istediği ve altındaki defter olmadan
değersiz olan parçadır — protokolün geri kalanının ürettiği durumu işler ve boş bir ağaçta doğru biçimde
hiçbir şey göstermez.

---

## 5. Sürekli hükümler

- **Sayfa okur. Yardımcı bileşen yazar. İşletmen işler.**
- Hiçbir yüzey aracı başlatmaz, göndermez, dağıtmaz ya da bir acil durdurmayı kaldırmaz.
- Hiçbir sır tarayıcıya ulaşmaz, asla.
- Çıktı bir sohbet penceresine değil, dosyalara ve konsola gider
  ([`04-OUTPUT-CONTRACT.md`](04-OUTPUT-CONTRACT.md)).
