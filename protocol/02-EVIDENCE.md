> **Resmî olmayan çeviri.** Bu belgenin normatif sürümü `main` dalındaki İngilizce sürümdür. Bu çeviri
> kolaylık olsun diye sunulmuştur ve **ana dili bu dil olan biri tarafından gözden geçirilmemiştir**.
> İngilizce özgün metinden ayrıldığı yerde **İngilizce geçerlidir**. Protokol tanımlayıcıları (`RUN`,
> `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, veri yolu fiilleri ve dosya adları) bilinçli olarak İngilizce
> bırakılmıştır: bunlar aracıların ayrıştırdığı sabit değerlerdir.

# 02 — KANIT

**Durum: normatif.** Bir gözlemin kayıtlı bir olguya nasıl dönüştüğü.

Bu dosyanın tarif ettiği disiplin genellikle *önerilere* uygulanır — insan karar vermeden önce aracı,
planının işe yarama olasılığını belirtir. Bu disiplin *iddialara* neredeyse hiç uygulanmaz. Böylece bir
filo, izin isteyerek **yapmak** istediği şey üzerine özenle akıl yürütür; **doğru** diye yazdığı şey
üzerine ise özensizce.

Oysa bunlar aynı edimdir. Kayda giren bir iddia, kaydın değişmesi gerektiğine dair bir öneridir. Parvis
her ikisine tek bir disiplin uygular.

---

## 1. Her iddia bir etiket taşır

| Etiket | Anlamı | Nerede kabul edilir |
|---|---|---|
| `[PROVEN]` | **Bu çalıştırmada okuduğunuz**, atıf verilmiş bir birincil kaynağa karşı doğrulanmış. Komutu, okumayı, ölçümü adlandırın. | Ana dosyalar dâhil her yerde. |
| `[CLAIMED]` | Başka bir şey tarafından bildirilmiş. Doğrulanmamış. | Çalışma dosyalarında. Ana dosyada asla. |
| `[ASSUMED]` | Kimsenin denetlemediği bir çalışma varsayımı. | Çalışma dosyalarında, açıkça belirtilerek. |
| `[PROPOSED]` | Bir kestirim, bir tavsiye, bir plan. | Önerilerde. Kayıtta asla. |

**Etiket iddiayla birlikte yolculuk eder.** Bir `[PROPOSED]`, daha önemli bir dosyaya kopyalanmakla
`[PROVEN]` hâline gelmez. Terfi, yeni bir konum değil, yeni bir ölçüm gerektirir.

**Bir ana dosyayı yalnızca `[PROVEN]` değiştirebilir.**

---

## 2. Atıf verin ya da işaretleyin — asla aklamayın

Bir sayı kaynağını belirtir, yoksa o bir sayı değildir; ondalık ayraç takmış bir sezgidir.

Kaynağa sahip değilseniz, **bunu söyleyin ve onun yerine akıl yürütmenizi verin.** Bu işe yarar bir
yanıttır. Olgu diye sunulan kaynaksız bir sayı ise değildir.

**Bir başarısızlığı asla bir bulguya dönüştürerek aklamayın.** Hata veren bir arama, başarısız bir
çağrıdır; boş bir sonuç kümesi değil. Yüklenmeyen bir sayfa, yokluğun kanıtı değildir. Ne olduysa onu
yazın.

---

## 3. Kendini betimleme `[CLAIMED]`'dir

Bir aracının kendi durumu, kendi kapsamı ya da kendi tamamladığı iş hakkındaki anlatısı — ne kadar emin
olursa olsun — `[CLAIMED]`'dir. Onu `[PROVEN]` yapan yalnızca dışarıdaki bir kayıttır: diskteki bir
dosya, bir komutun çıkış kodu, siz olmayan bir şeyin yazdığı bir günlük satırı.

Kanıt yolu olmayan bir `DONE` satırının geçersiz olmasının nedeni budur (bkz.
[`04-OUTPUT-CONTRACT.md`](04-OUTPUT-CONTRACT.md)). "Yaptım" bir iddiadır. Dosya ise kanıttır.

---

## 4. Basamak 0–2'deki her şey için iki kez ölçün

Tek bir denetim hiçbir zaman bir güvenlik durumunu belgelemez. Her Öncelik-0 iddiasından önce, her
zaman iki bağımsız ölçüm.

**Yeniden ölçün, asla hatırlamayın.** Bir ağaç eşzamanlı oturumlar altında çalkalanır — bir turun
başında okunan bir yol, sonunda yok olmuş olabilir. Durum yalnızca *bu* çalıştırmada diskten bilinebilir.
"Temizlendi" ya da "güncel" bilgisini önceki bir turdan, bir bellek dosyasından veya bir özetten asla
taşımayın.

**Bir sayım bir ölçümdür, bir olgu değil.** Kullanım anında yeniden sayın. Bir dosya sayısını, bir aracı
sayısını ya da bir sürümü asla bellekten aktarmayın.

---

## 5. Düşen bir çağrı bir bulgu değildir

**Taşıma kaybında** — DNS hatası, bağlantı sıfırlanması, reddedilme, yanıtsız zaman aşımı — aynı çağrıyı
hemen ve tekrar tekrar yineleyin. Hiç ulaşmamış bir çağrı için asla "sonuç yok" yazmayın ve boşluğu asla
bellekten doldurmayın.

**Ulaşmış olan bir yanıt bir cevaptır, bir yeniden deneme değil.** Bir 403, bir 404, boş bir sonuç
kümesi, açık bir ret — bunlar veridir. Farklı bir cevap almak için bir reddin üzerine yinelemek, tespit
kaçırmadır ve kimin hesabında veya kimin ağında çalıştığına bakılmaksızın basamak 2'de yasaktır.

Ayrım tek satırda: *hiç ulaşmamış çağrıyı yineleyin; beğenmediğiniz cevabı asla yinelemeyin.*

---

## 6. Olumsuz bulgular da sayılır

"X denetlendi, tehlike değil" ifadesi, sonraki üç oturumun X'i yeniden denetlemesini engelleyen şeydir.
Kaydedin.

**Öğrendikçe kaydedin, sonunda değil.** Yalnızca çalışma belleğinde tutulup sonra yitirilen bir bulgu,
hiç yapılmamış işten ayırt edilemez.

---

## 7. Silinmeler bütünlük sinyalidir

Bir ağacı bir taban çizgisine karşı doğrularken raporun üç sınıfı vardır — eklenen, değiştirilen,
silinen. Büyüme ve düzenlemeler beklenen çalkantıdır. **Alarm verilmeye değer satır silinmedir.**

Denetlenmemiş eşzamanlı işin üzerine yeni taban çizgisi çekmeyin. Önce denetleyin, sonra damgalayın.

---

## 8. Denetim bir roldür, bir ruh hâli değil

Bir denetçi her aracıyı, komutu ve görevi **diskten** sayar ve her birini sabit sınıflara karşı denetler
— kusurlar kadar temiz denetimleri de sayarak. Hiçbir şeyi aklamayan bir çalıştırma hiçbir şeyi
denetlememiştir; yalnızca şikâyet toplamıştır.

**Denetçi asla onarmaz.** Bulgular düzeltme sürecine ([`05-CORRECTION.md`](05-CORRECTION.md)) ya da
sahibi olan aracıya yönlendirilir. Bulduğunu onaran bir denetçi kendi kanıtını yok etmiştir ve artık
temiz bir çalıştırma bildirmesine güvenilemez.

---

## 9. Bunların tümünün hizmet ettiği kural

> Altı dosyada ileri sürülen bir olgu, bunların beşinde yanlış olacaktır.

Kanıt disiplini, altıncısını bulunabilir kılan şeydir.
