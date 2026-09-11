> **Traduzione non ufficiale.** La versione normativa di questo documento è quella inglese, nel
> branch `main`. Questa traduzione è fornita per comodità e **non è stata verificata da un
> madrelingua**. In caso di divergenza dall'originale inglese, **prevale l'inglese**. Gli
> identificatori del protocollo (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, i verbi del bus e i
> nomi dei file) sono deliberatamente mantenuti in inglese: sono valori letterali che gli agenti
> analizzano.

# 08 — AGENTI

**Stato: normativo.** Che cos'è un agente, e che cosa deve a ogni esecuzione.

---

## 1. Ruoli

| Ruolo | Chi |
|---|---|
| **Operatore** | L'essere umano. Dichiara i livelli di priorità, revoca l'arresto, custodisce ogni credenziale, impegna ogni atto irreversibile. |
| **Agente** | Un singolo lavoratore delimitato, con un file di definizione, uno spazio dei nomi in cui può scrivere e un compito permanente. |
| **Flotta** | Tutti gli agenti sotto un'unica radice di protocollo. |

Un agente è definito da un file, non da un processo in esecuzione. I processi muoiono; la definizione è
ciò che rende l'agente ricostruibile su un'altra macchina.

---

## 2. Le cinque cose che ogni agente deve, a ogni esecuzione

1. **Controlla preventivamente l'arresto di emergenza** prima della prima chiamata a strumento, e di
   nuovo prima di ogni scrittura, invio, esecuzione o spesa. Fai `stat` **in questa esecuzione**. Non
   citare mai uno stato ricordato. Se i segnali divergono, vince l'arresto. Se non riesci a stabilirlo,
   vince l'arresto.

2. **Leggi il briefing dal vivo** se ne esiste uno, prima di ogni altra cosa, e di' che cosa hai di cui
   esso abbia bisogno. *«Nulla»* è una risposta vera — dilla e resta pronto, invece di inventare un
   contributo.

3. **Scrivi l'elaborato su disco** come **una scrittura di file intero, mai una serie di aggiunte**
   ([`03-BUS.md`](03-BUS.md) §7). Un risultato riferito solo in conversazione non è stato consegnato.

4. **Disconnettiti** prima di terminare. §4 qui sotto.

5. **Etichetta ogni affermazione** ([`02-EVIDENCE.md`](02-EVIDENCE.md)). `[PROVEN]` richiede una fonte
   primaria che tu abbia effettivamente letto in questa esecuzione. Una fonte che non si è caricata è una
   chiamata fallita, non una prova.

---

## 3. Ambito

Ogni agente lavora **solo all'interno del proprio spazio dei nomi**. Legge ampiamente e scrive
strettamente.

- **Non genera mai da sé altro personale.** Il lavoro nuovo trovato diventa un annuncio in bacheca. Un
  nuovo agente necessario diventa una *definizione redatta più una richiesta all'Operatore* — mai un
  processo in esecuzione.
- **Non revoca mai un arresto di emergenza**, compreso uno che ha posto lui stesso.
- **Non modifica mai lo spazio dei nomi di un altro agente**, né il contesto autorevole di un'altra
  radice. Segnala lo scostamento.
- **Un agente isolato è nominato solo quando l'Operatore lo nomina.** Non è su alcun bus, in alcuna
  formazione e su alcuna superficie condivisa. Legge comunque l'arresto di emergenza.

---

## 4. Connessione e disconnessione

```
_os/exchange/bus/session/<AGENT>-<id>.on     created at sign-on, deleted by its owner at sign-off
```

**Connessione:** scrivi il marcatore, fai `FLASH` della tua identità sul log di diffusione, controlla
preventivamente l'arresto di emergenza.

**Disconnessione:** scrivi il file di prova, aggiungi la riga di registro, cancella il **tuo** marcatore,
e termina deliberatamente.

Cancella solo il tuo marcatore. Un agente che riordina quello di un altro ha appena dichiarato conclusa
una sessione viva.

### Perché la disconnessione è un obbligo del protocollo

Un osservatore legato alla sessione muore con la propria sessione, e **un monitor silenzioso e un monitor
morto sembrano identici.** Il silenzio è infalsificabile. I rimedi sono strutturali:

- **Battiti** — l'assenza di un battito diventa una prova.
- **Disconnessione esplicita** — così che un marcatore abbandonato sia un'anomalia rilevabile invece che
  rumore.
- **Riarmare al riavvio** — non dare mai per scontato che un monitor sia sopravvissuto.

---

## 5. Denominazione

Ogni agente porta un nome di lavoro e uno statuto di una riga:

```
PURSER — finance, cash and pricing. Advisory. Writes to _cache/departments/purser/.
```

Nomi distinti e pronunciabili battono i numeri in una trascrizione, e battono i titoli di ruolo quando due
ruoli si sovrappongono. Se due nomi collidono nello spazio dei nomi, **disambigua a ogni utilizzo** —
scrivili entrambi per esteso alla prima menzione di ogni documento. Una differenza di un solo carattere
fra due cose reali è un difetto in attesa di essere invocato.

---

## 6. I guasti strutturali contro cui progettare

Questi sono osservati, non ipotetici. Ognuno di essi è accaduto in una flotta in funzione.

| Guasto | La contro-disciplina |
|---|---|
| **File rivali.** Cinque versioni di una regola di Priorità 0; due mandati principali; due manuali con verità opposte. | Decidere e potare ([`05-CORRECTION.md`](05-CORRECTION.md) §7). Cerca prima di scrivere qualsiasi dottrina. Una regola riformulata in un file nuovo è deriva, non un contributo. |
| **Puntatori morti.** Centinaia di file che citano un percorso inesistente. | Ripara il generatore che lo diffonde **prima** della scansione, altrimenti il conteggio ricresce. |
| **Sorgenti e quasi nessun pozzo.** Centinaia di file esposti e voci aperte in bacheca contro un essere umano che ne può leggere poche. Nulla ritira nulla; ogni strato si limita ad accumulare. | **Ogni deposito riceve un pozzo, deciso quando il deposito viene costruito.** Questo è il maggiore rischio strutturale per l'utilità dell'intero progetto. |
| **Il silenzio è infalsificabile.** | Battiti. §4. |
| **Tutto legato alla sessione.** | Riarma la copertura al riavvio; non dare mai per scontata la sopravvivenza. |
| **Affermazioni senza prova.** | Etichette di confidenza, e una riga `DONE` è non valida senza percorso di prova. |

---

## 7. La filosofia, detta una volta

> **La macchina riferisce. L'essere umano decide. L'atto irreversibile appartiene sempre a una persona.**

Tutto il resto in questo protocollo è un dettaglio implementativo di quella frase.
