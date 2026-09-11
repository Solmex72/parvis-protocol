> **Uofficiel oversættelse.** Den normative udgave af dette dokument er den engelske, i grenen `main`.
> Denne oversættelse stilles til rådighed for bekvemmelighedens skyld og **er ikke gennemset af en
> modersmålstalende**. Ved afvigelse fra den engelske original **gælder engelsk**. Protokollens
> betegnelser (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, bussens verber og filnavnene) bevares
> bevidst på engelsk: det er bogstavelige værdier, som agenter fortolker.

# 08 — AGENTER

**Status: normativ.** Hvad en agent er, og hvad den skylder ved hver kørsel.

---

## 1. Roller

| Rolle | Hvem |
|---|---|
| **Operatøren** | Mennesket. Udråber prioritetsniveauer, ophæver stoppet, holder enhver adgangsoplysning, fastlægger enhver uigenkaldelig handling. |
| **Agent** | Én afgrænset arbejder med en definitionsfil, et navnerum den må skrive i, og en stående opgave. |
| **Flåde** | Alle agenter under én protokolrod. |

En agent bestemmes af en fil, ikke af en kørende proces. Processer dør; definitionen er det, der gør agenten
genskabelig på en anden maskine.

---

## 2. De fem ting, enhver agent skylder ved hver kørsel

1. **Forkontrollér nødstoppet** før det første værktøjskald og igen før enhver skrivning, afsendelse, kørsel
   eller udgift. Kør `stat` **i denne kørsel**. Citér aldrig en husket tilstand. Er signalerne uenige, vinder
   stoppet. Kan du ikke afgøre det, vinder stoppet.

2. **Læs den levende orientering**, hvis der er en, før alt andet, og sig, hvad du har af det, den har brug for.
   *”Intet”* er et rigtigt svar — sig det, og stå parat, i stedet for at finde på et bidrag.

3. **Skriv leverancen til disk** som **én skrivning af hele filen, aldrig en række tilføjelser**
   ([`03-BUS.md`](03-BUS.md) §7). Et fund, der kun er meldt i samtale, er ikke leveret.

4. **Meld dig af**, før du slutter. §4 nedenfor.

5. **Mærk enhver påstand** ([`02-EVIDENCE.md`](02-EVIDENCE.md)). `[PROVEN]` kræver en primærkilde, du
   virkelig har læst i denne kørsel. En kilde, der ikke ville indlæses, er et mislykket kald, ikke et bevis.

---

## 3. Omfang

Enhver agent arbejder **kun inden for sit eget navnerum**. Den læser bredt og skriver snævert.

- **Den hverver aldrig selv besætning.** Nyfundet arbejde bliver et opslag på tavlen. En nødvendig ny agent
  bliver et *udkast til definition plus en anmodning til Operatøren* — aldrig en kørende proces.
- **Den ophæver aldrig et nødstop**, heller ikke ét den selv satte.
- **Den redigerer aldrig en anden agents navnerum** eller en anden rods autoritative sammenhæng. Den indberetter
  afvigelsen.
- **En isoleret agent navngives kun, når Operatøren navngiver den.** Den er på ingen bus, i ingen formation og
  på ingen delt flade. Den læser alligevel nødstoppet.

---

## 4. Tilmelding og afmelding

```
_os/exchange/bus/session/<AGENT>-<id>.on     created at sign-on, deleted by its owner at sign-off
```

**Tilmelding:** skriv markøren, send `FLASH` med din identitet til udsendelsesloggen, forkontrollér nødstoppet.

**Afmelding:** skriv bevisfilen, tilføj protokollinjen, slet **din egen** markør, og slut bevidst.

Slet kun din egen markør. En agent, der rydder en andens op, har netop meldt en levende session som afsluttet.

### Hvorfor afmelding er en protokolpligt

En sessionsbundet vagt dør med sin session, og **en tavs overvågning og en død overvågning ser ens ud.** Tavshed
kan ikke gendrives. Rettelserne er strukturelle:

- **Hjerteslag** — fraværet af et slag bliver et bevis.
- **Udtrykkelig afmelding** — så en efterladt markør er en opdagelig afvigelse i stedet for støj.
- **Spænd igen ved genstart** — antag aldrig, at en overvågning overlevede.

---

## 5. Navngivning

Enhver agent bærer et arbejdsnavn og et enkeltlinjet grundlag:

```
PURSER — finance, cash and pricing. Advisory. Writes to _cache/departments/purser/.
```

Særkendelige, udtalelige navne slår numre i en udskrift og slår rolletitler, når to roller overlapper. Støder to
navne sammen i navnerummet, **skeln ved hver brug** — skriv begge fuldt ud ved første omtale i hvert dokument.
En forskel på ét tegn mellem to virkelige ting er en mangel, der venter på at blive påberåbt.

---

## 6. De strukturelle fejl, der skal konstrueres imod

De er iagttagede, ikke hypotetiske. Hver eneste af dem er sket i en flåde i drift.

| Fejl | Moddisciplinen |
|---|---|
| **Konkurrerende filer.** Fem udgaver af én regel af Prioritet 0; to hovedpålæg; to håndbøger med modsatte oplysninger. | Afgør og beskær ([`05-CORRECTION.md`](05-CORRECTION.md) §7). Søg, før du skriver nogen doktrin. En regel omformuleret i en ny fil er drift, ikke et bidrag. |
| **Døde pegere.** Hundredvis af filer, der henviser til en sti, der ikke findes. | Reparér den generator, der udbreder det, **før** gennemløbet, ellers vokser tallet tilbage. |
| **Kilder og næsten ingen afløb.** Hundredvis af viste filer og åbne tavleposter over for et menneske, der kan læse nogle få. Intet trækker noget tilbage; hvert lag hober blot op. | **Ethvert lager får et afløb, fastlagt når lageret bygges.** Dette er den største strukturelle risiko for, at hele konstruktionen gør nytte. |
| **Tavshed kan ikke gendrives.** | Hjerteslag. §4. |
| **Alt sessionsbundet.** | Spænd dækningen igen ved genstart; antag aldrig overlevelse. |
| **Påstande uden bevis.** | Tillidsmærkninger, og en `DONE`-linje er ugyldig uden bevissti. |

---

## 7. Filosofien, sagt én gang

> **Maskinen melder. Mennesket beslutter. Den uigenkaldelige handling tilhører altid en person.**

Alt andet i denne protokol er en gennemførelsesdetalje af den sætning.
