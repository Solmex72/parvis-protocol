> **Resmî olmayan çeviri.** Bu belgenin normatif sürümü `main` dalındaki İngilizce sürümdür. Bu çeviri
> kolaylık olsun diye sunulmuştur ve **ana dili bu dil olan biri tarafından gözden geçirilmemiştir**.
> İngilizce özgün metinden ayrıldığı yerde **İngilizce geçerlidir**. Protokol tanımlayıcıları (`RUN`,
> `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, veri yolu fiilleri ve dosya adları) bilinçli olarak İngilizce
> bırakılmıştır: bunlar aracıların ayrıştırdığı sabit değerlerdir.

# 01 — ESTOP

**Durum: normatif. Öncelik 0. Her girişimdeki her aracı için bağlayıcıdır.**

---

## 0. Bunun yapabildiği ve yapamadığı — önce burayı okuyun

**Çalışan bir oturumu durduramaz.** Hiçbir dosya durduramaz. Yanıtının ortasındaki bir aracı diski
okumuyordur, bir kesme hattı yoktur ve yapmakta olduğu şeyi bitirecektir. Size bir bayrak dosyasının bir
filoyu durdurduğunu söyleyen kişi, bir dileği tarif ediyordur.

**Çalışan bir aracıyı yalnızca İşletmen, penceresini kapatarak durdurur.** Gerçek acil durdurma budur ve
hiçbir zaman başka bir şey olmamıştır.

Bu dosyanın yaptığı şey, her aracıyı diski *gerçekten* okuduğu iki anda bağlamaktır:

| An | Yükümlülük |
|---|---|
| **Başlangıç** | Durumu, doktrininizden önce, belleğinizden önce, her şeyden önce okuyun. |
| **Her kontrol noktası** | Herhangi bir yazma, herhangi bir mesaj, yan etkisi olan herhangi bir araç çağrısı, herhangi bir harcama öncesinde. |

`STOP` gördüğü hâlde devam eden bir aracı kusurlu bir aracıdır. Bütün uygulama modeli budur: bir
mekanizma değil — sık sık denetlenen bir görev.

Sınırı dürüstçe belirtmek protokolün bir parçasıdır. Anlık olduğuna inandığınız bir durdurma, öyle
olmadığını bildiğiniz bir durdurmadan daha tehlikelidir; çünkü ona güvenirsiniz.

---

## 1. İki sinyal

### Nöbetçi dosya olgunun kendisidir

Tam olarak `estop` adını taşıyan bir **normal dosya** — uzantısız, sıfır bayt olması normaldir — bir
girişim kökünde **veya üzerinde çalışılan ağacın herhangi bir üst dizininde**.

```bash
[ -f "$root/estop" ] && echo STOPPED
```

```powershell
if (Test-Path "$root\estop" -PathType Leaf) { 'STOPPED' }
```

Bir **dosya** olup olmadığını sınayın; yalnızca varlığı asla sınamayın ve asla bir joker kalıp
kullanmayın:

- `ESTOP.md` doktrindir. Denetimi asla tetiklememelidir. Buna izin veren bir eşleştirici, İşletmenin
  kaldıramayacağı bir durdurma yaratır.
- `_os/estop/` bir dizindir. O da tetiklemez.

Birden çok kök **birbirinden bağımsız** olarak tetiklenir. Her birini denetleyin. `stat` ettiğiniz yolu
bildirin — hangisine baktığınızı gizleyen "acil durdurma" ifadesini asla kullanmayın.

### STATE dosyası türetilmiş bir aynadır

`_os/estop/STATE` — tek satır, başka hiçbir şey yok.

```
RUN
```
```
YELLOW  2026-01-14T08:20:00Z  operator  new hardware on the bench, confirm before each run
```
```
STOP    2026-01-14T14:03:11Z  operator  reason in plain English
```

| Alan | Kural |
|---|---|
| fiil | `RUN`, `YELLOW` veya `STOP`. Başka hiçbir şey ayrıştırılmaz. |
| zaman | UTC, ISO-8601. |
| kim | Kimin çağırdığı. `STOP` / `YELLOW` yazma ya da bunları kaldırma yetkisi yalnızca İşletmendedir. |
| gerekçe | Tek satır, sade dille, jargonsuz. |

**Nöbetçi dosya ile ayna birbiriyle çelişirse, durdurulmuş olan kazanır.** Ayna araçlar tarafından
yazılır ve bayatlar; nöbetçi dosya ise olgunun kendisidir.

---

## 2. Üç durum

| STATE | Aracının yaptığı |
|---|---|
| `RUN` | **Devam edin.** İşin gerektirdiği komutları, her biri için izin beklemeden çalıştırın. Duraksamayın, seçenekleri anlatmayın, rutin işi bir onayın arkasında sıraya koymayın. |
| `YELLOW` | **Önce sorun.** Her komut, çalıştırılmadan önce önerilir. Aynı iş, aynı yetkinlik — fark, onaydır. |
| `STOP` | Durun. §3. |

### `RUN`'ın yapmadığı şey

`RUN`, *rutin işten önceki duraklamayı* kaldırır. **Mevcut hiçbir kapıyı kaldırmaz**, çünkü bunlar
eylemin hızıyla değil niteliğiyle ilgilidir:

- kimlik bilgileri, oturum açmalar, satın almalar, tedarik — **her zaman İşletmenin elleriyle**;
- dışa dönük eylemler — yayımlama, gönderme, dağıtma — **her zaman açık bir onayla**;
- bir insanın fiziksel olarak gerçekleştireceği her şey — **yine güvenlik kapısından geçirilir**;
- yıkıcı veya geri alınamaz eylemler — **her durumda yine onaylanır**;
- bir aracının kendi sürekli sınırları — **STATE'in bir işlevi değildir**.

`RUN`, *"her adımdan önce sormak zorunda mıyım?"* sorusunu yanıtlar — hayır. *"Her şeyi yapabilir
miyim?"* sorusunu yanıtlamaz. `RUN` okuyup ardından bu listedeki bir şeyi yapan aracı, durumu yanlış
okumuştur; o durum tarafından yetkilendirilmemiştir.

### Okunamayan bir fiilde güvenli tarafa düşme

**Eksik, boş, okunamaz olan ya da başka herhangi bir sözcük taşıyan bir STATE dosyası `YELLOW` olarak
okunur** — asla `RUN` olarak değil. Sorun.

> Bu, bir uygulamada en sık ters çevrilen satırdır. `try { read } catch { return "RUN" }` kalıbı, her
> disk hatasını, izin değişikliğini ve yazım yanlışını sessiz bir yetkilendirmeye dönüştürür. Referans
> yardımcı bileşen `YELLOW`'a düşer ve okuma hatasında hizmet vermeyi reddeder; bkz.
> [`reference/sidecar/parvis-sidecar.mjs`](../reference/sidecar/parvis-sidecar.mjs).

Nöbetçi dosya bu bölümün tamamının üzerindedir: bir `estop` dosyasının varlığı, STATE ne derse desin
`STOP` anlamına gelir.

**Bu dosyayı yalnızca İşletmen yazar.** Hiçbir aracı yazmaz — sorunu bulan aracı da dâhil. Filonun
durması gerektiğine inanan bir aracı, veri yolunda bir `GATE` açar ve bunu söyler. Kendi yetkisiyle
filoyu durdurmaz ve yeniden başlatmaz.

---

## 3. `STOP` durumunda aracının yaptığı

1. **Başka hiçbir şey yazmayın.** Bellek dosyasını da, raporu da, veri yolunu da.
2. **Olduğu yerde kaydedin, sonra durun.** Henüz yazılmamış hiçbir adımı tamamlamayın. Var olanı,
   nerede durduğunuzu belirten tek bir satırla birlikte kısmi olarak etiketleyin.

   > Bu protokolün daha önceki taslakları *at* diyordu. Bu yanlıştı: atılan yarım bir rapor, yeniden
   > başlatma doktrininin korumak için var olduğu işi yok eder. Tehlike, sonradan tamamlanmış diye
   > okunan kesik bir dosyadır — ve bunu önleyen şey silme değil, **etikettir**.
3. **İşletmene tek satır söyleyin:** `ESTOP observed <timestamp> — <reason>. Holding.`
4. **Durun.** Devam etmek için izin istemeyin. Bir geçici çözüm önermeyin. Gerekçenin size uygulanıp
   uygulanmadığını denetlemeyin — size uygulanır.

**Ret bir yanıttır, bir yeniden deneme değil.** `RUN` beklerken döngüye girmeyin. Bildirin ve bitirin.

---

## 4. Bunu ne kaldırır

İşletmen dosyayı yeniden `RUN` yapar. Başka hiçbir şey kaldırmaz — bir zaman aşımı değil, sorunun
çözüldüğünü düşünen bir aracı değil, zamanın geçmesi değil, durdurmayı hiç görmemiş yeni bir oturum
değil.

Kendiliğinden temizlenen bir işleyici, güvenli tarafa düşme ilkesinin tersine çevrilmesidir ve esastan
reddedilir.

---

## 5. Kapsam

Acil durdurma **öntanımlı olarak filo genelindedir**. Aracı başına acil durdurma yoktur; çünkü durdurma
gerektiren arıza neredeyse hiçbir zaman tek bir aracıyla sınırlı değildir ve kısmi bir durdurma, tam da
bu dosyanın yasaklamak için var olduğu akıl yürütmeyi davet eder: *"o başkasıyla ilgiliydi."*

**Yalıtılmış aracılar da kapsamdadır.** Hiçbir veri yolunda ve hiçbir paylaşılan yüzeyde bulunmayan bir
aracı bile bu dosyayı okur. Yalıtım, bir aracının ne *söyleyebileceğini* düzenler. Hiçbir zaman
*durdurulup* durdurulamayacağını düzenlemez.

---

## 6. İki kez ölçün

Tek bir yeşil onay hiçbir zaman bir güvenlik durumunu belgelemez. Her iki sinyali de diskten, **bu
çalıştırmada** okuyun. Hatırlanan bir durumu asla aktarmayın — bağlamdan değil, bir bellek dosyasından
değil, önceki bir turdan değil. Bozuk bir `stat` biçimi, yanlış bir "temiz" ya da yanlış bir
"durduruldu" üretmeye yeter ve ikisi de uygulamada yaşanmıştır.

Mevcut en güçlü biçim, STATE dosyası ile her nöbetçi dosya yolu üzerinde yalnızca değişimde yayın yapan
**kalıcı bir izleyicidir**: temizken sessiz, bir durdurma kurulduğu anda tetiklenir. Bu, "başlangıçta bir
kez ön denetim yaptım" durumunu canlı kapsamaya dönüştürür ve bir durdurmanın oturum ortasında kurulduğu
boşluğu kapatır.

---

## 7. Dürüst sınır, bir kez belirtilmiş hâliyle

Bu protokol bir durdurmayı **her başlangıçta ve her kontrol noktasında güvenilir** kılar. Bir durdurmayı
**anlık** kılmaz ve bir dosya ağacına yazılan hiçbir şey bunu asla yapmayacaktır.

Şu anda etkin biçimde ters giden bir şey varsa: **pencereyi kapatın.** Sonra dosyayı yazın ki uyanan bir
sonraki aracı onu yeniden başlatmasın.
