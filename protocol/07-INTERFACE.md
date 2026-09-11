> **Traduzione non ufficiale.** La versione normativa di questo documento è quella inglese, nel
> branch `main`. Questa traduzione è fornita per comodità e **non è stata verificata da un
> madrelingua**. In caso di divergenza dall'originale inglese, **prevale l'inglese**. Gli
> identificatori del protocollo (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, i verbi del bus e i
> nomi dei file) sono deliberatamente mantenuti in inglese: sono valori letterali che gli agenti
> analizzano.

# 07 — LO STRATO DI INTERFACCIA

**Stato: normativo.** Questo è il file da cui il progetto prende il nome.

Ogni superficie che un essere umano tocca è **Parvis**. La vista di reparto in sola lettura è il *Parvis
HMI*; il menu a riquadri da cui guidi la flotta è la *Parvis Console*.

---

## 1. La regola che fa funzionare l'HTML

> Una pagina di browser è uno **schermo e una tastiera**, non un programma con accesso al disco.

Quell'unico fatto governa l'intero strato:

- **La pagina mostra e raccoglie.** Rappresenta lo stato e accetta input. Aperta da un percorso di file,
  da sola, **non può leggere l'albero né scrivere un ordine.** La sandbox del browser vieta entrambe le
  cose, e questo è un pregio.
- **Il sidecar fa da ponte.** Un piccolo servizio in loopback — associato a `127.0.0.1`, nient'altro — è
  l'unica cosa che legge l'albero per la pagina e scrive ciò che la pagina invia. La pagina fa `GET`
  dello stato; la pagina fa `POST` di un prompt; il sidecar fa il lavoro su disco. **Nessun sidecar,
  nessun Parvis dal vivo — solo un'istantanea.**
- **Nulla aggira la revisione.** Un prompt inviato da Parvis è un'**immissione, non un'esecuzione**. Il
  sidecar scrive una riga `REQ` nell'indice delle attività e si ferma. Non avvia mai un agente, non
  esegue mai un comando, non invia mai. Impegnare lavoro nuovo resta la battitura dell'Operatore.

Ecco perché la pagina «funziona»: la pagina è onesta sull'essere una finestra, il sidecar fa il piccolo
lavoro reale al confine, e **la revisione resta fra un prompt e una macchina in movimento.**

---

## 2. Requisiti ferrei — ogni superficie Parvis

1. **Autosufficiente.** Un solo file HTML: CSS e JS incorporati, nessuno script esterno, nessuna CDN.
   Font web soltanto, con una vera catena di ripiego. Deve visualizzarsi offline da un percorso di file.

2. **I colori sono lo stato, letti dal vivo, mai simulati.** Verde = in funzione, ambra = chiedi prima,
   rosso = fermo — derivati dal file STATE e dal registro dal vivo. **Un valore senza fonte dal vivo
   mostra `—`, mai un numero dall'aspetto plausibile.** Il rosso prevale su ogni altro colore e
   sull'intera interfaccia.

3. **Il sidecar è solo in loopback e non custodisce alcun segreto che la pagina possa vedere.** Nessuna
   chiave API, nessuna credenziale, nessun token di valore raggiunge il browser. Il sidecar autentica la
   pagina con un token di sessione locale e svolge da sé il lavoro privilegiato. **La pagina non
   custodisce mai nulla che valga la pena rubare.**

4. **Un'istantanea è etichettata come istantanea,** con la sua ora di lettura. Solo una pagina che parla
   con un sidecar vivo può presentarsi come dal vivo. Una pagina obsoleta che sembra dal vivo è peggio di
   nessuna pagina.

5. **L'arresto di emergenza prevale sull'interfaccia.** Sotto `STOP`, Parvis non immette nulla e il
   sidecar non scrive nulla se non la riga di disconnessione. **Un reparto rosso non accetta ordini.**

6. **Marchio Parvis, e nessun nome di azienda terza.** Qualunque siano i sistemi reali da cui lo schema è
   stato appreso, lo schema è tuo e si chiama Parvis. Una superficie che distribuisce il nome commerciale
   altrui è sbagliata e va corretta.

---

## 3. Requisiti di sicurezza del sidecar

Un servizio HTTP in loopback su una postazione di sviluppo è una vera superficie di attacco. Questi punti
non sono facoltativi.

| Requisito | Perché |
|---|---|
| **Associa `127.0.0.1` esplicitamente**, mai `0.0.0.0` | Associare tutte le interfacce pubblica la console della tua flotta sulla rete locale. |
| **Convalida l'intestazione `Host`** contro un elenco di ammessi di `127.0.0.1:<port>` / `localhost:<port>` | Sconfigge il DNS rebinding, con cui una pagina web che visiti raggiunge un servizio in loopback. |
| **Rifiuta le richieste che portano una `Origin` che non hai emesso** | Stessa classe di attacco, vettore diverso. |
| **Richiedi un token di sessione** su ogni rotta che modifica, emesso al caricamento della pagina, mai registrato | La pagina dimostra di essere la tua pagina. |
| **Metti in elenco di ammessi ogni percorso** che il servizio leggerà o scriverà, poi risolvi di nuovo e conferma il contenimento | Sconfigge l'attraversamento. Un elenco di ammessi da solo non basta se esistono collegamenti simbolici. |
| **Fallisci in sicurezza su un estop illeggibile** — rifiuta, non ripiegare su `RUN` | Vedi [`01-ESTOP.md`](01-ESTOP.md) §2. |
| **Nessun `eval`, nessuna chiamata a shell, nessuna interpolazione di modelli con input utente** | La barra dei prompt è un ingresso di immissione, non una riga di comando. |

L'implementazione di riferimento in [`reference/sidecar/`](../reference/sidecar/) realizza tutti questi
punti ed è commentata nel punto di ciascuno.

---

## 4. Quali sono le superfici

| Superficie | Che cosa | Stato |
|---|---|---|
| **Parvis Console** | Pannelli a schede — stato, documenti, registro, bus, superficie, impostazioni | Distribuita. |
| **Parvis Floor** | La scheda Magazzino: reparto 3D, orbita e discesa, comandi delle attrezzature | Distribuita. Vedi [`09-FLOOR.md`](09-FLOOR.md). |
| **Barra dei prompt** | L'ingresso di immissione, sulla console e su ogni attrezzatura del reparto | Distribuita. |
| **Il sidecar** | Ponte in loopback: legge l'albero, scrive righe `REQ`, non custodisce segreti | Distribuito. |

**Distribuisci prima i pannelli.** Il reparto 3D è la parte che tutti vogliono costruire e la parte che
non vale nulla senza il registro sotto di essa — rappresenta lo stato che il resto del protocollo
produce, e su un albero vuoto mostra correttamente nulla.

---

## 5. Posizione

- **La pagina legge. Il sidecar scrive. L'Operatore impegna.**
- Nessuna superficie avvia, invia, distribuisce o revoca un arresto di emergenza.
- Nessun segreto raggiunge il browser, mai.
- L'output va nei file e alla console, non in una finestra di chat
  ([`04-OUTPUT-CONTRACT.md`](04-OUTPUT-CONTRACT.md)).
