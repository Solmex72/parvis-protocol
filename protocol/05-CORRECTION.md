> **Traduzione non ufficiale.** La versione normativa di questo documento è quella inglese, nel
> branch `main`. Questa traduzione è fornita per comodità e **non è stata verificata da un
> madrelingua**. In caso di divergenza dall'originale inglese, **prevale l'inglese**. Gli
> identificatori del protocollo (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, i verbi del bus e i
> nomi dei file) sono deliberatamente mantenuti in inglese: sono valori letterali che gli agenti
> analizzano.

# 05 — CORREZIONE

**Stato: normativo.** Che cosa accade quando un fatto registrato si rivela sbagliato.

---

## 1. Il problema

> Un fatto affermato in sei file sarà sbagliato in cinque di essi.

Correggere il file che ti capita di avere davanti non è una correzione. Crea un albero in cui la verità
e l'errore hanno entrambi citazioni, e la sessione successiva prende quello che apre per primo. Questo
è il modo di guasto caratteristico di una flotta di agenti ricca di documentazione, e peggiora in
silenzio.

**Una correzione si propaga, oppure non è avvenuta.**

---

## 2. Leggere non è gratis — obbliga

Leggere un file che governa ti pone sotto di esso. Ne discendono due cose:

1. Tutto ciò che vi è di **durevole, non ovvio e non derivabile dall'albero** passa nella tua memoria
   persistente prima della fine della sessione.
2. **Se il tuo contesto contraddice il file, vince il file.** Non aggirarlo. Correggi il registro.

---

## 3. Correzione Immediata di Rotta (ICC)

Un comando, un turno, senza passaggio di proposta.

```
/icc the planner meal times are placeholders, not the Operator's actual times
```

### La sequenza

**1 · Scansione.** Ricava dalla correzione da 2 a 5 termini di ricerca: la formulazione **vecchia**, le
sue varianti ovvie e i nomi propri coinvolti. Non la formulazione nuova. Esegui una scansione indicizzata
per termine prima di leggere qualsiasi cosa. Non percorrere mai l'albero file per file per trovare le
occorrenze — l'indice serve a questo.

**2 · Classifica ogni occorrenza.**

| Occorrenza | Azione |
|---|---|
| **Afferma il vecchio fatto** | Riscrivila. |
| **Lo menziona di sfuggita**, vero in entrambi i casi | Lasciala. Non agitare il testo. |
| **Contraddice il nuovo fatto in modo indiretto** — una conclusione a valle, una riga di tabella, un'attività pianificata costruita sul vecchio valore | **Riscrivi anche quella.** È quella che più spesso sfugge. |
| **Fuori limite** (§5) | Non modificare mai. Annotala sotto *Left alone*. |

**3 · Riscrivi, tutto in una volta.** Adeguati alla voce esistente di ciascun file e alla sua convenzione
di etichette di confidenza. Un fatto corretto mantiene l'etichetta che si merita — **non promuovere
un'affermazione a `[PROVEN]` perché ora è attuale.** Se il vecchio testo portava una data, metti quella
di oggi.

Dove un fatto è affermato in più di tre file, questa è **duplicazione, non ridondanza**: enuncialo una
volta nel file che lo possiede, e fa' che gli altri puntino lì.

**4 · Registro e memoria.** Entrambi, altrimenti l'esecuzione non è finita. Anteponi una voce al registro
delle correzioni:

```
## 2026-01-14 — meal times are placeholders

Was      planner asserts 07:30 / 12:00 / 18:30 as the Operator's actual times
Now      those are defaults shipped with the template; real times are unknown
Why      Operator correction, 2026-01-14
Files    personal/planner/NOW.md:14, personal/planner/README.md:31, _os/tasks/INDEX.md:88
Memory   planner-meal-times.md (updated)
Left     backups/ (history), CONTEXT-BUNDLE.md (generated)
```

Poi scrivi il fatto nella memoria persistente — **verificando prima se esiste già una memoria
sull'argomento e aggiornando quella**, invece di lasciare due versioni di un fatto che hai appena
dedicato un comando a unificare.

**5 · Obblighi post-modifica.** Riesegui il generatore o il backup a cui le modifiche obbligano.
Ricostruisci l'indice se sono stati creati o cancellati file.

---

## 4. Una decisione permanente si ribalta allo scoperto

Se una correzione invalida una decisione permanente — una riga «non rimettere in discussione», una voce
`[PROVEN]`, una regola di politica — **non ribaltarla in silenzio.** Riscrivila come *ribaltata*, con la
data e il motivo, così che la sessione successiva sappia che è stata annullata e non dimenticata.

Una decisione che cambia senza lasciare traccia è indistinguibile da una decisione mai presa.

---

## 5. Che cosa non viene mai riscritto

| Mai toccato | Perché |
|---|---|
| `backups/`, `archive/` | Storia. La storia non si corregge; viene superata. |
| File generati | Modifica la sorgente e riesegui il generatore. |
| L'albero di un agente isolato | Accesso solo su nomina. |
| Il contesto principale autorevole di un'altra radice | Segnala lo scostamento. Non modificare oltre un confine di proprietà. |
| Tutto ciò che contiene un segreto | Del tutto fuori dalla portata di una scansione testuale. |

**Una scansione che riscrive testo distruggerà i binari.** Limita ogni scansione alle estensioni di testo
tramite elenco di ammessi, mai per esclusione.

---

## 6. Che cosa ICC non fa

`/icc` corregge il registro. **Non va poi a fare il lavoro che la correzione implica.** Sono atti
distinti con autorizzazioni distinte, e confonderli è il modo in cui una correzione di una riga diventa
una rielaborazione non revisionata.

---

## 7. I fatti rivali si decidono e si potano — non si catalogano

Quando due file affermano fatti contraddittori, **decidi quale è giusto, tienilo, e rimuovi le
affermazioni sbagliate nello stesso passaggio.**

Un rapporto di conflitto che lascia entrambi i rivali su disco non ha risolto nulla. La sessione
successiva prende comunque il file che apre per primo, e una regola di sicurezza con cinque versioni in
circolazione è *meno* affidabile di una con una sola versione, non di più.

**Decidi nel merito, mai per marca temporale.** Il vincitore è il file che possiede il fatto, la versione
sostenuta da una misurazione, quella che regge all'esame. **Il più recente non è il più vero** — il
fallimento canonico qui sono quattro file di memoria duplicati scritti a novanta secondi l'uno
dall'altro, in cui il più recente affermava il falso, cosicché una regola «vince il più recente» avrebbe
ereditato l'errore.

**Registra la risoluzione.** Quale fatto ha vinto, che cosa è stato potato e perché — nel registro, così
che la potatura sia leggibile invece che silenziosa. Un rivale che sparisce senza traccia è identico a un
rivale che non c'è mai stato, e la sessione successiva lo ricrea.

### Che cosa viene comunque scalato invece che deciso

Tre casi. Esponili; non deciderli:

- La contraddizione dipende da informazioni che l'agente non ha.
- Sbagliare sarebbe **non sicuro o irreversibile** — qualsiasi cosa ai pioli 0–2.
- L'affermazione perdente si trova **fuori dal confine di proprietà dell'agente** — il contesto
  principale autorevole di un'altra radice. Segnala lo scostamento; non modificare oltre il confine.

Tutto ciò che è ordinario viene deciso e ripulito.
