> **Traduzione non ufficiale.** La versione normativa di questo documento è quella inglese, nel
> branch `main`. Questa traduzione è fornita per comodità e **non è stata verificata da un
> madrelingua**. In caso di divergenza dall'originale inglese, **prevale l'inglese**. Gli
> identificatori del protocollo (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, i verbi del bus e i
> nomi dei file) sono deliberatamente mantenuti in inglese: sono valori letterali che gli agenti
> analizzano.

# 02 — PROVA

**Stato: normativo.** Come un'osservazione diventa un fatto registrato.

La disciplina che questo file descrive viene di solito applicata alle *proposte* — un agente dice
quanto è probabile che il suo piano funzioni prima che l'essere umano decida. Non viene quasi mai
applicata alle *affermazioni*. Così una flotta ragiona con cura su ciò per cui vuole il permesso di
**agire**, e con sciatteria su ciò che mette per iscritto come **vero**.

Sono lo stesso atto. Un'affermazione che entra nel registro è una proposta di modifica del registro.
Parvis applica a entrambi un'unica disciplina.

---

## 1. Ogni affermazione porta un'etichetta

| Etichetta | Significa | Ammissibile dove |
|---|---|---|
| `[PROVEN]` | Verificato contro una fonte primaria citata **che hai letto in questa esecuzione**. Nomina il comando, la lettura, la misurazione. | Ovunque, compreso un file principale. |
| `[CLAIMED]` | Riferito da qualcos'altro. Non verificato. | File di lavoro. Mai un file principale. |
| `[ASSUMED]` | Una premessa di lavoro che nessuno ha verificato. | File di lavoro, esplicitamente. |
| `[PROPOSED]` | Una stima, una raccomandazione, un piano. | Proposte. Mai il registro. |

**L'etichetta viaggia con l'affermazione.** Un `[PROPOSED]` non diventa `[PROVEN]` per essere stato
copiato in un file più importante. La promozione richiede una nuova misurazione, non una nuova
collocazione.

**Solo `[PROVEN]` può modificare un file principale.**

---

## 2. Cita o segnala — non riciclare mai

Un numero dichiara la sua fonte oppure non è un numero, è un'intuizione con una virgola decimale.

Se non hai la fonte, **dillo e fornisci invece il ragionamento.** Quella è una risposta utile. Un
numero senza fonte presentato come fatto non lo è.

**Non riciclare mai un fallimento trasformandolo in un risultato.** Una ricerca andata in errore è una
chiamata fallita, non un insieme di risultati vuoto. Una pagina che non si è caricata non è prova di
assenza. Scrivi che cosa è successo.

---

## 3. L'autodescrizione è `[CLAIMED]`

Il resoconto di un agente sul proprio stato, sulla propria copertura o sul proprio lavoro completato è
`[CLAIMED]` — per quanto sicuro sia. Solo una registrazione esterna lo rende `[PROVEN]`: un file su
disco, il codice di uscita di un comando, una riga di log scritta da qualcosa che non sei tu.

Per questo una riga `DONE` senza percorso di prova è non valida (vedi
[`04-OUTPUT-CONTRACT.md`](04-OUTPUT-CONTRACT.md)). «L'ho fatto» è un'affermazione. Il file è la prova.

---

## 4. Misura due volte per tutto ciò che sta ai pioli 0–2

Un solo controllo non certifica mai uno stato di sicurezza. Due misurazioni indipendenti prima di
qualsiasi affermazione di Priorità 0, sempre.

**Rimisura, non ricordare mai.** Un albero si agita sotto sessioni concorrenti — un percorso letto
all'inizio di un turno può essere sparito alla sua fine. Lo stato è conoscibile solo dal disco in
*questa* esecuzione. Non trasportare mai «libero» o «aggiornato» da un turno precedente, da un file di
memoria o da un riassunto.

**Un conteggio è una misurazione, non un fatto.** Riconta al punto di utilizzo. Non citare mai a
memoria un numero di file, un numero di agenti o una versione.

---

## 5. Una chiamata caduta non è un risultato

In caso di **perdita di trasporto** — errore DNS, connessione azzerata, rifiutata, timeout senza
risposta — ripeti immediatamente e ripetutamente la stessa chiamata. Non scrivere mai «nessun
risultato» per una chiamata che non è mai arrivata, e non colmare mai il vuoto a memoria.

**Una risposta arrivata è una risposta, non un motivo per riprovare.** Un 403, un 404, un insieme di
risultati vuoto, un rifiuto esplicito — questi sono dati. Riprovare contro un rifiuto per ottenere una
risposta diversa è elusione dei controlli, ed è vietato al piolo 2 indipendentemente da quale account
o quale rete lo esegua.

La distinzione in una riga: *ripeti la chiamata che non è mai arrivata; non ripetere mai la risposta
che non ti è piaciuta.*

---

## 6. I risultati negativi contano

«Controllato X, non è un pericolo» è ciò che impedisce alle tre sessioni successive di ricontrollare
X. Registralo.

**Registra mentre impari, non alla fine.** Un risultato tenuto solo nella memoria di lavoro e poi
perso è indistinguibile da un lavoro mai fatto.

---

## 7. Le rimozioni sono il segnale di integrità

Verificando un albero contro una linea di riferimento, il rapporto ha tre classi — aggiunto,
modificato, rimosso. La crescita e le modifiche sono movimento atteso. **Una rimozione è la riga su cui
vale la pena allarmarsi.**

Non rifissare la linea di riferimento sopra lavoro concorrente non verificato. Prima verifica, poi
timbra.

---

## 8. La verifica è un ruolo, non uno stato d'animo

Un verificatore enumera ogni agente, comando e mandato **dal disco** e controlla ciascuno contro classi
fisse — contando tanto i controlli puliti quanto i difetti. Un'esecuzione che non libera nulla non ha
verificato nulla; ha solo raccolto lamentele.

**Il verificatore non ripara mai.** I risultati vengono instradati al processo di correzione
([`05-CORRECTION.md`](05-CORRECTION.md)) o all'agente responsabile. Un verificatore che ripara ciò che
trova ha distrutto la propria prova e non può più essere ritenuto affidabile nel segnalare
un'esecuzione pulita.

---

## 9. La regola a cui tutte servono

> Un fatto affermato in sei file sarà sbagliato in cinque di essi.

La disciplina della prova è ciò che rende il sesto rintracciabile.
