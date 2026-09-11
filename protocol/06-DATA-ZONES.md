> **Resmî olmayan çeviri.** Bu belgenin normatif sürümü `main` dalındaki İngilizce sürümdür. Bu çeviri
> kolaylık olsun diye sunulmuştur ve **ana dili bu dil olan biri tarafından gözden geçirilmemiştir**.
> İngilizce özgün metinden ayrıldığı yerde **İngilizce geçerlidir**. Protokol tanımlayıcıları (`RUN`,
> `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, veri yolu fiilleri ve dosya adları) bilinçli olarak İngilizce
> bırakılmıştır: bunlar aracıların ayrıştırdığı sabit değerlerdir.

# 06 — VERİ BÖLGELERİ

**Durum: normatif.** Bir dosyanın nerede bulunmasına izin verildiği.

---

## 1. Yasak neden işe yaramadı

Özgün kural *"asla, hiçbir yerde sır olmaz"* idi — ve **özel verinin konulacağı bir yer yoktu.**

Varış yeri olmayan bir yasak uygulanmaz. Etrafından dolaşılır ve özel malzeme kazara eşitlenen ağaca
iner. Bu defalarca yaşandı; kuralın kendisine tabi olan bir aracı da buna dâhil.

**Kural bir yönlendirme kararıdır, bir yasak değil.**

---

## 2. İki bölge

| Bölge | Özellik | Neyi barındırır |
|---|---|---|
| **PUBLIC** | Bulut depolamayla eşitlenir. **Her baytı yayımlanmış sayın.** | Doktrin, görevler, aracı tanımları, mimari, iş bağlamı, araştırma, teknik belgeler |
| **PRIVATE** | **Her eşitleme kökünün dışında** — ve kullanıcı profilinin de dışında, böylece bilinen klasör yönlendirmesi de oraya ulaşamaz | Sırlar, gerçek kişiler ve kişisel verileri, özel projeler ve medya, bir yedekte bulunması yanlış olacak her şey |

### Sınama

> *Bu, bir yıl sonra bir bulut anlık görüntüsünde bulunsaydı sorun olur muydu?*

Evet → PRIVATE. Hayır → PUBLIC. Gerçekten emin değilseniz → **PRIVATE.** Fazla sınıflandırmanın bedeli
zahmettir. Eksik sınıflandırmanın bedeli ise geri alınamaz.

### Neyin gerçekten eşitlendiğini bilin

Bunu varsayımla değil, gerçek makinede denetleyin. Tipik bir iş istasyonunda aynı anda birkaç eşitleme
istemcisi çalışıyor olabilir ve kullanıcının belgeler, masaüstü ya da resimler klasörleri altındaki her
şey makineyi terk eder ve haftalarca sürüm geçmişinde tutulur. **Yerelde silmek onu geri çağırmaz.**

Her biri gerçek arızalara yol açan iki sonuç:

1. **Derleme çıktısı** bir eşitleme kökünün dışına yönlendirilmelidir, yoksa ayna onu derleme sırasında
   bozar.
2. **Anahtarlar dışarıda durur**, bilinçli olarak ve öntanımlı biçimde.

---

## 3. İstisna: kimlik bilgileri hiçbir bölgeye ait değildir

**Canlı kimlik bilgileri — parolalar, API anahtarları, jetonlar, yayın anahtarları — her iki dosya
sisteminde değil, bir parola yöneticisinde bulunur.**

Özel bölge *özel veri* barındırır. Bir parola yöneticisi *kimlik bilgileri* barındırır. Bu bir kılı kırk
yarma değildir: özel bir dizin öntanımlı olarak şifreli değildir ve bir dosya dosyadır. Biri kopyalandığı,
bir döküme aktarıldığı ya da bir şeye iliştirildiği anda ifşa olmuştur.

**Özel bölgenin güvenlik özelliğini dar biçimde belirtin ve asla abartmayın.** Kanıtlanmış tek özelliği
genellikle *hiçbir şeyin onu bir yere kopyalamamasıdır*. Doğrulanmış tam disk ya da dosya başına
şifreleme yoksa; o bölge şifreli değildir, yedeklenmemiştir ve bir kasa değildir.

---

## 4. Sınıflandırma İşletmenindir ve ayarlanabilir

Canlı tabloyu tek bir dosyada tutun — `DATA-CLASSIFICATION.md` — İşletmenin kategorileri bölgeler
arasında taşıdığı ve her aracının tahmin yürütmek yerine okuduğu yer.

Bu protokol dosyası **mekanizmayı** belirtir. O dosya ise **politikayı** belirtir. İkisi çeliştiğinde
politika dosyası kazanır.

---

## 5. Aracılar için sonuçlar

- **Paketlenen hiçbir ağaçta sır bulunmaz.** Bir bağlam paketi, yeni bir oturuma yapıştırılmak için
  vardır. Neyin tutulduğunu ve nerede tutulduğunu adlandırın; değerini asla.
- **Hiçbir sır `surface/`'a ulaşmaz.** Orası ekranda görüntülenir.
- **Hiçbir sır bir tarayıcıya ulaşmaz.** Bkz. [`07-INTERFACE.md`](07-INTERFACE.md) §3.
- **Silerek değil, atıfla gizleyin.** `<api key — see password manager entry "acme-prod">` ifadesi,
  değeri ifşa etmeden olguyu bulunabilir tutar.

---

## 6. Kayıpsız budama

Çalışma ağacından herhangi bir şey ayrılmadan önce:

1. Onu **köklerin dışındaki** mühürlü bir depoya kopyalayın — joker kalıplarla erişilemeyen bir arşiv
   dosyasına.
2. Yolları `marked-deletion.md` / `marked-archive.md` içinde hazırlayın.
3. **Yürütme İşletmenin elidir**, ağaç durulmuşken.

Canlı eşzamanlılık altında asla toplu silme yapmayın.
