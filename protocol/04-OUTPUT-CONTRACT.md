> **Traduzione non ufficiale.** La versione normativa di questo documento è quella inglese, nel
> branch `main`. Questa traduzione è fornita per comodità e **non è stata verificata da un
> madrelingua**. In caso di divergenza dall'originale inglese, **prevale l'inglese**. Gli
> identificatori del protocollo (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, i verbi del bus e i
> nomi dei file) sono deliberatamente mantenuti in inglese: sono valori letterali che gli agenti
> analizzano.

# 04 — IL CONTRATTO DI USCITA

**Stato: normativo.** Dove va il lavoro quando è finito.

---

## 1. La regola

**Non riferire alla chat. Lavora nell'albero dei file, scrivi l'output su disco ed esponi un
puntatore.**

Un agente che termina scrivendo una lunga risposta in una finestra di chat ha messo il proprio output
dove nient'altro nella flotta può leggerlo — nessun altro agente, nessun monitor, nessuna console,
nessuna sessione successiva. Il file è il registro durevole; la chat è una trascrizione che nessuno a
valle vede.

---

## 2. Dove va l'output

| Tipo di output | Atterra in |
|---|---|
| Prodotto di lavoro, risultati, un rapporto | il file responsabile, oppure `outbox/YYYYMMDD-HHMMSS-<slug>.md` |
| Qualunque cosa l'Operatore debba vedere ora | un breve file puntatore in `_os/events/surface/` |
| Una richiesta che necessita dell'Operatore | `_os/exchange/requests/REQ-<slug>.md` |
| La riga di registro | `_os/tasks/INDEX.md` |

**La directory `surface/` è la notifica. Il file è la sostanza.** Scrivi la sostanza nella sua sede
propria, poi lascia un puntatore di una riga in `surface/` così che la console mostri all'Operatore
dove è atterrata.

---

## 3. L'indice delle attività

Una riga per ordine. Aggiungi una riga `REQ` **prima** di iniziare, così che un'attività interrotta
resti visibile.

```
REQ     | 2026-01-14 | SCOUT | <the order, in the Operator's words where possible> | <status note>
DONE    | 2026-01-14 | SCOUT | <the order> | evidence: outbox/20260114-090312-lease-rates.md
BLOCKED | 2026-01-14 | SCOUT | <the order> | <what is blocking, one line>
REFUSED | 2026-01-14 | SCOUT | <the order> | <why, one line + where the reasoning lives>
```

**Una riga `DONE` senza percorso di prova è non valida.** Se non c'è un file, il lavoro non è atterrato
da nessuna parte dove l'Operatore possa vederlo. L'autodichiarazione è `[CLAIMED]`; il file è ciò che
la rende `[PROVEN]`.

**Un rifiuto appartiene qui in modo permanente.** È così che la flotta smette di rimettere in
discussione questioni già decise. Non cancellarlo più tardi.

**Il limite onesto:** questo indice non osserva nulla. È esattamente completo quanto gli agenti che vi
scrivono. Un'attività assente non è prova che l'attività non sia mai avvenuta — solo che nessuno l'ha
registrata. Tratta una riga come *un'affermazione con allegato un percorso di prova*, mai come una
prova. Verifica che il file di prova esista prima di fidarti di qualsiasi `DONE`.

---

## 4. Il completamento è che l'Operatore lo veda

Non che un agente lo dichiari. Una risposta non è un punto d'arresto: i monitor restano armati
attraverso di essa, il lavoro continua, e poi c'è un congedo deliberato.

---

## 5. La controregola che prevale sull'instradamento

**L'arresto di emergenza e la franchezza vanno comunque all'essere umano, subito e in evidenza.**

Un fallimento viene esposto con la stessa evidenza di un successo. Instradare l'output verso i file non
deve mai diventare un posto dove seppellire un cattivo risultato. Se le buone notizie della flotta
arrivano in chat e le cattive arrivano in un file che nessuno apre, il contratto è stato rovesciato e
la flotta ora mente per instradamento.

---

## 6. Il limite onesto del contratto stesso

Un agente che gira dentro un'imbracatura di chat produce comunque testo da assistente in quella chat —
questo contratto non può reindirizzare l'imbracatura. Ciò che vincola è **ciò che un agente sceglie di
scrivere**: la sostanza nei file, e il testo di chat ridotto a un breve puntatore — *«scritto in
`<path>`, esposto alla console»* — mai il rapporto completo.

---

## 7. Nessun segreto raggiunge la superficie

`surface/` viene letta da una console e può essere mostrata su uno schermo, in una schermata o in una
finestra condivisa. Le regole delle zone di dati ([`06-DATA-ZONES.md`](06-DATA-ZONES.md)) si applicano
qui in tutta la loro forza.
