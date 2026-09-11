> **Traduzione non ufficiale.** La versione normativa di questo documento è quella inglese, nel
> branch `main`. Questa traduzione è fornita per comodità e **non è stata verificata da un
> madrelingua**. In caso di divergenza dall'originale inglese, **prevale l'inglese**. Gli
> identificatori del protocollo (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, i verbi del bus e i
> nomi dei file) sono deliberatamente mantenuti in inglese: sono valori letterali che gli agenti
> analizzano.

# 01 — ESTOP (ARRESTO DI EMERGENZA)

**Stato: normativo. Priorità 0. Vincolante per ogni agente in ogni iniziativa.**

---

## 0. Che cosa può e non può fare — leggi prima questo

**Non può fermare una sessione in corso.** Nessun file può. Un agente a metà di una risposta non sta
leggendo il disco, non ha una linea di interruzione, e porterà a termine ciò che sta facendo. Chi ti
dice che un file bandiera ferma una flotta sta descrivendo un desiderio.

**Solo l'Operatore ferma un agente in corso, chiudendone la finestra.** Quello è il vero arresto di
emergenza e non è mai stato altro.

Ciò che questo file fa è vincolare ogni agente nei due momenti in cui *sta* effettivamente leggendo
il disco:

| Momento | Obbligo |
|---|---|
| **Avvio** | Leggi lo stato prima della tua dottrina, prima della tua memoria, prima di ogni cosa. |
| **Ogni punto di controllo** | Prima di qualsiasi scrittura, qualsiasi messaggio, qualsiasi chiamata a strumento con effetto collaterale, qualsiasi spesa. |

Un agente che osserva `STOP` e prosegue è un agente difettoso. Questo è l'intero modello di
applicazione: non un meccanismo — un dovere, controllato spesso.

Dichiarare onestamente il limite fa parte del protocollo. Un arresto che credi istantaneo è più
pericoloso di uno che sai non esserlo, perché ci farai affidamento.

---

## 1. I due segnali

### La sentinella è il fatto

Un **file regolare** chiamato esattamente `estop` — senza estensione, zero byte è normale — nella
radice di un'iniziativa o in **qualsiasi directory superiore** dell'albero su cui si lavora.

```bash
[ -f "$root/estop" ] && echo STOPPED
```

```powershell
if (Test-Path "$root\estop" -PathType Leaf) { 'STOPPED' }
```

Verifica un **file**, mai la semplice esistenza, e mai un glob:

- `ESTOP.md` è dottrina. Non deve mai far scattare il controllo. Un confronto che lo permettesse
  creerebbe un arresto che l'Operatore non può revocare.
- `_os/estop/` è una directory. Neanche questa fa scattare.

Radici multiple scattano in modo **indipendente**. Controlla ciascuna. Segnala il percorso su cui hai
fatto `stat` — mai «l'estop», che nasconde quale hai guardato.

### Il file STATE è uno specchio derivato

`_os/estop/STATE` — una riga, nient'altro.

```
RUN
```
```
YELLOW  2026-01-14T08:20:00Z  operator  new hardware on the bench, confirm before each run
```
```
STOP    2026-01-14T14:03:11Z  operator  reason in plain English
```

| Campo | Regola |
|---|---|
| verbo | `RUN`, `YELLOW` o `STOP`. Nient'altro viene analizzato. |
| ora | UTC, ISO-8601. |
| chi | Chi l'ha attivato. Solo l'Operatore può scrivere `STOP` / `YELLOW` o revocarli. |
| motivo | Una riga, in linguaggio semplice, senza gergo. |

**Se la sentinella e lo specchio divergono, vince l'arresto.** Lo specchio è scritto dagli strumenti e
si fa obsoleto; la sentinella è il fatto.

---

## 2. I tre stati

| STATE | Che cosa fa un agente |
|---|---|
| `RUN` | **Procedi.** Esegui i comandi che il lavoro richiede senza chiedere il permesso per ciascuno. Non fermarti, non elencare opzioni, non mettere il lavoro ordinario in coda dietro una conferma. |
| `YELLOW` | **Chiedi prima.** Ogni comando viene proposto prima di essere eseguito. Stesso lavoro, stessa competenza — la differenza è la conferma. |
| `STOP` | Fermati. §3. |

### Che cosa `RUN` non fa

`RUN` elimina la *pausa prima del lavoro ordinario*. Non elimina **alcuna barriera esistente**, perché
quelle riguardano la natura dell'atto, non la sua velocità:

- credenziali, accessi, acquisti, provisioning — **sempre nelle mani dell'Operatore**;
- atti rivolti all'esterno — pubblicare, inviare, distribuire — **sempre con un via libera esplicito**;
- tutto ciò che un essere umano eseguirà fisicamente — **passa ancora dalla barriera di sicurezza**;
- atti distruttivi o irreversibili — **sempre confermati, in qualunque stato**;
- i limiti permanenti propri di un agente — **non dipendono affatto da STATE**.

`RUN` risponde a *«devo chiedere prima di ogni passo?»* — no. Non risponde a *«posso fare qualsiasi
cosa?»* Un agente che legge `RUN` e poi fa qualcosa di questo elenco ha frainteso lo stato, non ne è
stato autorizzato.

### Sicurezza intrinseca davanti a un verbo illeggibile

Un file STATE **mancante, vuoto, illeggibile o che riporti qualsiasi altra parola viene letto come
`YELLOW`** — mai come `RUN`. Chiedi.

> Questa è la riga più comunemente invertita in un'implementazione. Un `try { read } catch
> { return "RUN" }` trasforma ogni errore di disco, ogni cambio di permessi e ogni refuso in
> un'autorizzazione silenziosa. Il sidecar di riferimento ripiega su `YELLOW` e rifiuta di servire in
> caso di errore di lettura; vedi
> [`reference/sidecar/parvis-sidecar.mjs`](../reference/sidecar/parvis-sidecar.mjs).

Il file sentinella prevale interamente su questa sezione: un file `estop` presente significa `STOP`
qualunque cosa dica STATE.

**Solo l'Operatore scrive questo file.** Nessun agente lo scrive — compreso l'agente che ha trovato il
problema. Un agente che ritiene che la flotta debba fermarsi solleva un `GATE` sul bus e lo dice. Non
ferma la flotta di propria autorità, e non ne riavvia alcuna.

---

## 3. Che cosa fa un agente su `STOP`

1. **Non scrivere altro.** Né il file di memoria, né il rapporto, né il bus.
2. **Salva sul posto, poi fermati.** Non completare alcun passo che non sia già scritto. Etichetta ciò
   che esiste come parziale, con una riga che indichi dove ti sei fermato.

   > Bozze precedenti di questo protocollo dicevano *scartare*. Era sbagliato: mezzo rapporto scartato
   > distrugge un lavoro che la dottrina di riavvio esiste per proteggere. Il pericolo è un file
   > troncato letto più tardi come finito — ed è l'**etichetta** a impedirlo, non la cancellazione.
3. **Dì una riga all'Operatore:** `ESTOP observed <timestamp> — <reason>. Holding.`
4. **Fermati.** Non chiedere il permesso di proseguire. Non proporre un aggiramento. Non verificare se
   il motivo ti riguarda — ti riguarda.

**Un rifiuto è una risposta, non un nuovo tentativo.** Non entrare in ciclo aspettando `RUN`. Segnala
e termina.

---

## 4. Che cosa lo revoca

L'Operatore riporta il file su `RUN`. Nient'altro lo fa — non un timeout, non un agente che ritiene il
problema risolto, non il trascorrere del tempo, non una nuova sessione che non ha mai visto
l'arresto.

Un gestore che si revoca da solo è un'inversione della sicurezza intrinseca ed è respinto nel merito.

---

## 5. Ambito

L'arresto di emergenza è **dell'intera flotta per impostazione predefinita**. Non esiste un arresto per
singolo agente, perché il guasto che richiede un arresto non è quasi mai confinato a un agente, e un
arresto parziale invita esattamente al ragionamento — *«quello riguardava qualcun altro»* — che questo
file esiste per vietare.

**Gli agenti isolati sono inclusi.** Un agente che non è su alcun bus né su alcuna superficie condivisa
legge comunque questo file. L'isolamento governa ciò che un agente può *dire*. Non governa mai se
possa essere *fermato*.

---

## 6. Misura due volte

Un solo controllo verde non certifica mai uno stato di sicurezza. Leggi entrambi i segnali, dal disco,
**in questa esecuzione**. Non citare mai uno stato ricordato — né dal contesto, né da un file di
memoria, né da un turno precedente. Un formato di `stat` frainteso basta a produrre un falso «libero»
o un falso «fermo», ed entrambi sono accaduti nella pratica.

La forma più solida disponibile è un **monitor persistente** sul file STATE e su ogni percorso
sentinella, che emette solo al cambiamento: silenzioso finché è libero, che scatta nell'istante in cui
un arresto si arma. Questo converte «ho fatto un controllo preliminare all'avvio» in copertura dal
vivo, e chiude la falla in cui un arresto si arma a metà sessione.

---

## 7. Il limite onesto, detto una volta

Questo protocollo rende un arresto **affidabile a ogni avvio e a ogni punto di controllo**. Non rende
un arresto **istantaneo**, e nulla di scritto in un albero di file lo farà mai.

Se qualcosa sta andando storto proprio ora: **chiudi la finestra.** Poi scrivi il file, così che il
prossimo agente che si sveglia non lo riavvii.
