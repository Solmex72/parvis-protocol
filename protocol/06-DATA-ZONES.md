> **Traduzione non ufficiale.** La versione normativa di questo documento è quella inglese, nel
> branch `main`. Questa traduzione è fornita per comodità e **non è stata verificata da un
> madrelingua**. In caso di divergenza dall'originale inglese, **prevale l'inglese**. Gli
> identificatori del protocollo (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, i verbi del bus e i
> nomi dei file) sono deliberatamente mantenuti in inglese: sono valori letterali che gli agenti
> analizzano.

# 06 — ZONE DI DATI

**Stato: normativo.** Dove a un file è permesso vivere.

---

## 1. Perché un divieto non ha funzionato

La regola originale era *«nessun segreto, mai, da nessuna parte»* — **senza alcun posto dove mettere
invece i dati privati.**

Un divieto senza destinazione non viene rispettato. Viene aggirato, e il materiale privato finisce
nell'albero sincronizzato per sbaglio. È accaduto ripetutamente, anche a opera di un agente che era
esso stesso soggetto alla regola.

**La regola è una decisione di instradamento, non un divieto.**

---

## 2. Le due zone

| Zona | Proprietà | Contiene |
|---|---|---|
| **PUBLIC** | Si sincronizza con l'archiviazione in cloud. **Tratta ogni byte come pubblicato.** | Dottrina, mandati, definizioni di agenti, architettura, contesto aziendale, ricerca, documentazione tecnica |
| **PRIVATE** | **Fuori da ogni radice di sincronizzazione** — e fuori dal profilo utente, così che nemmeno il reindirizzamento delle cartelle note possa raggiungerla | Segreti, persone reali e i loro dati personali, progetti e contenuti privati, tutto ciò che sarebbe sbagliato trovare in un backup |

### Il test

> *Sarebbe un problema se questo si trovasse in un'istantanea cloud fra un anno?*

Sì → PRIVATE. No → PUBLIC. In caso di dubbio reale → **PRIVATE.** Il costo di sovraclassificare è il
disagio. Il costo di sottoclassificare non si può annullare.

### Sappi che cosa si sincronizza davvero

Verificalo sulla macchina reale, non per supposizione. Su una postazione tipica possono girare più
client di sincronizzazione contemporaneamente, e tutto ciò che sta nelle cartelle documenti, desktop o
immagini dell'utente lascia la macchina ed è conservato nella cronologia delle versioni per settimane.
**Cancellarlo localmente non lo richiama indietro.**

Due conseguenze che causano ciascuna guasti reali:

1. **L'output di compilazione deve essere reindirizzato** fuori da una radice di sincronizzazione,
   altrimenti il mirror lo corrompe a metà compilazione.
2. **Le chiavi vivono all'esterno**, deliberatamente e per impostazione predefinita.

---

## 3. L'eccezione: le credenziali non appartengono a nessuna zona

**Le credenziali attive — password, chiavi API, token, chiavi di trasmissione — appartengono a un
gestore di password, non a nessuno dei due filesystem.**

La zona privata contiene *dati privati*. Un gestore di password contiene *credenziali*. Non è pedanteria:
una directory privata non è cifrata per impostazione predefinita, e un file è un file. Nel momento in cui
uno viene copiato, citato in una trascrizione o allegato a qualcosa, è divulgato.

**Enuncia la proprietà di sicurezza della zona privata in modo stretto e non sopravvalutarla mai.** La
sua unica proprietà dimostrata è di solito che *nulla la copia da nessuna parte*. In assenza di cifratura
verificata dell'intero disco o per file, non è cifrata, non è salvata e non è una cassaforte.

---

## 4. La classificazione è dell'Operatore, ed è modificabile

Tieni la tabella viva in un unico file — `DATA-CLASSIFICATION.md` — dove l'Operatore sposta le categorie
fra le zone e che ogni agente legge invece di tirare a indovinare.

Questo file di protocollo enuncia il **meccanismo**. Quel file enuncia la **politica**. Dove i due
divergono, vince il file di politica.

---

## 5. Conseguenze per gli agenti

- **Nessun segreto in alcun albero che venga impacchettato.** Un pacchetto di contesto esiste per essere
  incollato in una sessione nuova. Nomina che cosa è custodito e dove; mai il valore.
- **Nessun segreto raggiunge `surface/`.** Viene mostrata sullo schermo.
- **Nessun segreto raggiunge un browser.** Vedi [`07-INTERFACE.md`](07-INTERFACE.md) §3.
- **Oscura per riferimento, non per cancellazione.** `<api key — see password manager entry "acme-prod">`
  mantiene il fatto rintracciabile senza divulgare il valore.

---

## 6. Potare senza perdere

Prima che qualcosa lasci l'albero di lavoro:

1. Copialo in un deposito sigillato **fuori dalle radici** — un file di archivio, non raggiungibile con
   glob.
2. Predisponi i percorsi in `marked-deletion.md` / `marked-archive.md`.
3. **L'esecuzione è la mano dell'Operatore**, con l'albero portato alla quiete.

Non cancellare mai in massa sotto concorrenza attiva.
