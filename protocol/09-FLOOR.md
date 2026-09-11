> **Traduzione non ufficiale.** La versione normativa di questo documento è quella inglese, nel
> branch `main`. Questa traduzione è fornita per comodità e **non è stata verificata da un
> madrelingua**. In caso di divergenza dall'originale inglese, **prevale l'inglese**. Gli
> identificatori del protocollo (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, i verbi del bus e i
> nomi dei file) sono deliberatamente mantenuti in inglese: sono valori letterali che gli agenti
> analizzano.

# 09 — IL REPARTO

**Stato: normativo per il visualizzatore; informativo come modello.**
Implementato da [`reference/sidecar/hmi.html`](../reference/sidecar/hmi.html).

---

## 1. L'affermazione

Una flotta di agenti è difficile da vedere. Un albero di file è un elenco, una tabella dei processi è un
elenco, e un log è un elenco — cosicché l'unica immagine che si ha di una flotta in funzione sono più
elenchi che non combaciano.

**Un magazzino automatizzato è la stessa macchina, ed è leggibile da quarant'anni.** I carroponte
spostano carichi fra le scaffalature sotto un sistema di controllo, e la persona che lo sorveglia legge
un reparto di centinaia di movimenti simultanei con un'occhiata, dal colore, senza leggere una sola riga
di testo.

Parvis prende in prestito quello. Non come decorazione — come una *mappatura*, in cui ogni oggetto del
magazzino corrisponde esattamente a una cosa nell'albero, e in cui le regole di sicurezza proprie del
magazzino risultano essere le regole di sicurezza del protocollo, già disegnate nel posto giusto.

---

## 2. La mappatura

| Nel reparto | Nella flotta | Letto da |
|---|---|---|
| **Carroponte** | un agente, o una sessione viva | i marcatori di sessione in `_os/exchange/bus/session/` |
| **Pallet** | una directory | l'albero stesso; l'etichetta del pallet è il suo percorso |
| **Postazione a scaffale** | dove risiede quella directory | il suo elemento superiore |
| **Aprire un pallet** | scendere nella directory | **un altro magazzino intero** — §4 |
| **Induct** (banchina d'ingresso) | lavoro in arrivo | una riga `REQ` in `_os/tasks/INDEX.md` |
| **Spur** (banchina d'uscita) | un elaborato in uscita | un file in `_os/events/surface/`, un'esportazione |
| **Nastro** | il bus a file | `_os/exchange/bus/` — come il lavoro si sposta senza che un carroponte lo trasporti |
| **Camion** | un servizio esterno o un'altra IA | il confine. §5 |

Il punto non è l'immagine. Il punto è che **sai già leggere questo schermo** se ti sei mai trovato davanti
a un sistema di controllo di magazzino — e se non ti è mai capitato, il modello è comunque concreto in un
modo in cui un elenco di directory non lo è.

---

## 3. I colori

Un'occhiata, prima di qualsiasi navigazione:

| Colore | Nel reparto | Nella flotta |
|---|---|---|
| **VERDE** | in movimento — un carroponte trasporta un carico | un agente sta lavorando; una sessione viva a metà attività |
| **BLU** | pianificato — in coda, non ancora avviato | un annuncio in bacheca: ordinato, in attesa di un agente |
| **AMBRA** | attenzione — una postazione richiede una decisione | `YELLOW`: chiedi prima di ogni azione |
| **ROSSO** | arresto di emergenza — quella zona è ferma | `STOP`: l'arresto è armato e questa radice è congelata |
| **GRIGIO** | vuoto, o nessuna fonte dal vivo | nessun dato. Mai una supposizione. |

Non è uno schema nuovo. È lo stato che l'albero già contiene, rappresentato.

**Il rosso vince sempre l'occhiata.** Una sola zona rossa ferma l'occhio prima di qualsiasi verde,
esattamente come l'arresto prevale su ogni altro segnale ([`01`](01-ESTOP.md)). **Un reparto che mostra
verde sopra una zona rossa sta mentendo** — ed è questo il guasto preciso che questa regola esiste per
vietare.

**Il grigio è obbligatorio dove non c'è fonte dal vivo.** Una postazione senza dati è rappresentata in
grigio e legge `—`. Non è mai rappresentata in verde, perché il verde è il valore predefinito gradevole
([`07`](07-INTERFACE.md) §2.2).

---

## 4. Il magazzino annidato

**Apri un pallet e non stai guardando una cassa. Stai guardando un altro magazzino intero** — con i suoi
carroponte, i suoi pallet, le sue banchine.

Questo è esattamente l'albero dei file. Un'iniziativa è un magazzino; i suoi reparti sono corsie; i loro
file sono pallet; e un pallet che è a sua volta una directory è un altro reparto. Quindi il
visualizzatore è **un'unica vista che scende**, con gli stessi comandi a ogni profondità, perché ogni
livello *è* un magazzino. Non c'è nulla di nuovo da imparare scendendo.

La ricorsione è l'intera ragione per cui la metafora regge invece di essere un rivestimento. Un cruscotto
che rappresenta solo il livello superiore è una fotografia di una flotta; uno che scende ne è una vista.

---

## 5. I camion attraccano al confine — non entrano mai nel reparto

È qui che il modello smette di essere una visualizzazione e comincia a imporre qualcosa.

Un servizio esterno — un'altra IA, un'API, un fornitore — è un **camion**. E in un magazzino reale un
camion fa manovra fino a una banchina. Non entra nel reparto, non muove un carroponte, non entra in uno
scaffale e non apre un magazzino annidato. Lascia un carico a un induct o ne ritira uno da uno spur, e
questo è l'intero suo accesso.

**Quella banchina è la camera stagna.** Ogni scambio esterno avviene al confine, filtrato, e nulla di
esterno resta libero dentro l'albero.

**I documenti di un camion non sono affidabili finché non vengono controllati.** Un carico che arriva su
un camion è *dati* in ingresso, non un ordine al reparto. Viene immesso e revisionato come ogni altra
cosa, mai obbedito all'arrivo. Quello è il confine della fonte d'istruzione di [`03`](03-BUS.md) §5,
disegnato come una banchina di carico — e disegnato nell'unico posto in cui qualcuno che guarda lo
schermo può vederlo rispettato.

Se la tua rappresentazione mette un camion nel reparto, la rappresentazione è sbagliata e lo è anche
l'architettura che disegna.

---

## 6. Due superfici, due mestieri

| | **Il reparto** (questo file) | **La console** ([`07`](07-INTERFACE.md)) |
|---|---|---|
| Che cos'è | un reparto 3D, visto dal vivo | un menu a riquadri, scaglionato per accesso |
| Che cosa mostra | **com'è il sistema** — ogni agente, directory e stato tutti insieme | **che cosa puoi fare** — scegli lo strumento, fai il lavoro |
| Il verbo | guardare, capire, decidere | eseguire, usare, produrre |

**Il reparto mostra come pensa la macchina; la console serve ad agire su ciò che concludi.** Uno è una
mappa, l'altra un banco di lavoro. Una superficie di gestione ha bisogno di entrambi, e l'errore è
costruire solo quella bella.

---

## 7. Comandi

La navigazione è ciò che rendeva usabile l'originale, non il colore da solo:

| Comando | Fa |
|---|---|
| **Trascinare** | orbitare attorno al reparto — ruotare, inclinare, guardare lungo una corsia |
| **Dall'alto** | passare a una pianta dall'alto. Orbita per la profondità, pianta per la disposizione |
| **Clic su un pallet** | scendervi — un altro magazzino, gli stessi comandi |
| **Rotella** | zoom |

Gli stessi comandi a ogni profondità. Non negoziabile: una vista la cui interazione cambia man mano che si
scende ha infranto la promessa che ogni livello è un magazzino.

### La camera è ortografica, di proposito

Non c'è **divisione prospettica**. Le linee parallele non convergono mai, e una postazione in fondo a una
corsia è rappresentata esattamente della stessa dimensione di una ai tuoi piedi.

Sembra sbagliato per un momento — l'occhio si aspetta la convergenza e ne legge l'assenza come se fosse
in piedi dentro le casse a guardare fuori. È comunque il compromesso giusto, ed è ciò che usano gli
schermi di controllo dei reparti automatizzati reali: **l'intero scopo è confrontare postazioni lungo il
reparto con un'occhiata**, e una camera prospettica rende il fondo di una corsia più piccolo, più
smorzato e più difficile da valutare rispetto all'estremità vicina. In prospettiva, «quello scaffale è
più pieno» e «quello scaffale è più vicino» sembrano la stessa cosa. Con una camera ortografica, no.

L'occlusione resta reale — le facce che si allontanano vengono scartate e la geometria più vicina dipinge
sopra quella più lontana. È una camera piatta, non una scena piatta.

Le attrezzature sono raggiungibili anche da un **menu laterale**, raggruppate per tipo — carroponte,
pallet, le due banchine, il nastro, i camion. Selezionare dal menu o dal reparto apre gli stessi comandi,
perché un reparto che si può percorrere solo cliccando piccole casse in una scena 3D è una dimostrazione
e non uno strumento.

---

## 8. Che cosa il reparto può e non può fare

Ogni vincolo di [`07`](07-INTERFACE.md) §5 si applica. La linea è tracciata in un punto preciso:

**Il reparto può immettere. Non può mai eseguire.**

È la stessa linea che [`07`](07-INTERFACE.md) §1 traccia già per la console, ed è ciò che permette alle
attrezzature di avere comandi. Selezionare un carroponte e indirizzargli lavoro scrive una riga `REQ` che
nomina quell'agente e deposita un `TELL` nella sua casella. **Non avvia nulla.** Nessun processo viene
lanciato, nessun comando viene eseguito, e l'agente prende in carico il lavoro alla propria esecuzione
successiva — oppure no.

Due conseguenze facili da sbagliare:

- **Il lavoro indirizzato non è comunque un ordine.** La riga `REQ` è il registro canonico; la riga nella
  casella si limita a puntarvi. Un file che *comandasse* a un agente — o che rivendicasse l'autorità
  dell'Operatore dall'interno dell'albero — sarebbe l'evento di sicurezza che [`03`](03-BUS.md) §5
  definisce, e costruirlo dentro la superficie sarebbe peggio che farlo a mano. L'autorità è l'Operatore
  in conversazione. Il reparto scrive il registro, non l'istruzione.
- **Alcune attrezzature non ricevono comandi, deliberatamente.** Il nastro è in sola lettura: una console
  che potesse scrivere righe sul bus starebbe fabbricando un'autorità che il protocollo le nega. I camion
  non hanno comandi affatto — §5.

**Sotto `STOP`, il reparto è rappresentato in rosso e non immette nulla.** Un reparto rosso non accetta
ordini.

Il limite onesto, detto una volta: **questa è una fotografia dell'albero in un istante, non un flusso di
telemetria dal vivo.** Interroga a intervalli. Fra un'interrogazione e l'altra è obsoleta, mostra quando
ha letto l'ultima volta, e diventa grigia invece di fingere il contrario quando il sidecar smette di
rispondere.
