# Estado da tradução — Português (`lang/pt`)

> **English summary:** this branch is the Parvis Protocol with `protocol/` translated into
> Portuguese. The English text on `main` is normative. Files not listed as translated below are
> still English — this branch is a complete, working copy of the repository, not a partial one.

---

## O que é este ramo

Este ramo é o repositório **completo** do Parvis Protocol, com os ficheiros indicados abaixo
traduzidos para português. Nada foi removido. Se um ficheiro ainda não estiver traduzido, aparece
aqui na sua língua original e continua plenamente utilizável.

**O inglês do ramo `main` é a versão normativa.** Onde esta tradução e o original divergirem,
prevalece o inglês. Esta tradução é assistida por máquina e **não foi verificada por um falante
nativo**.

## Convenção sobre os identificadores do protocolo

Os seguintes são **deliberadamente mantidos em inglês**, porque são valores literais que os agentes
analisam e comparam, e não texto corrido:

- os verbos de estado `RUN`, `YELLOW`, `STOP`;
- as etiquetas de confiança `[PROVEN]`, `[CLAIMED]`, `[ASSUMED]`, `[PROPOSED]`;
- os seis verbos do barramento `FLASH`, `ASK`, `ANS`, `TELL`, `GATE`, `ACK`;
- as linhas do livro de registo `REQ`, `DONE`, `BLOCKED`, `REFUSED`;
- todos os nomes de ficheiros e caminhos (`_os/`, `estop`, `protocol/00-PRECEDENCE.md`, …).

Traduzi-los quebraria qualquer implementação que os leia.

---

## Cobertura

| Ficheiro | Estado |
|---|---|
| `protocol/00-PRECEDENCE.md` | ✅ Traduzido |
| `protocol/01-ESTOP.md` | ✅ Traduzido |
| `protocol/02-EVIDENCE.md` | ✅ Traduzido |
| `protocol/03-BUS.md` | ✅ Traduzido |
| `protocol/04-OUTPUT-CONTRACT.md` | ✅ Traduzido |
| `protocol/05-CORRECTION.md` | ✅ Traduzido |
| `protocol/06-DATA-ZONES.md` | ✅ Traduzido |
| `protocol/07-INTERFACE.md` | ✅ Traduzido |
| `protocol/08-AGENTS.md` | ✅ Traduzido |
| `protocol/09-FLOOR.md` | ✅ Traduzido |
| `protocol/10-AIRLOCK.md` | ✅ Traduzido |
| `README.md` | ⬜ Inglês |
| `CHANGELOG.md`, `DECISIONS.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` | ⬜ Inglês |
| `examples/`, `reference/`, `templates/` | ⬜ Inglês |
| Código e configuração (`.mjs`, `.json`, `.html`, `.yml`) | ⬜ Não traduzidos, por desenho |

---

## Disposições de teclado

Este ramo abrange quem escreve com as seguintes disposições de teclado do Windows:

`Portuguese`, `Portuguese (Brazilian ABNT)`, `Portuguese (Brazilian ABNT2)`

---

## Comunicar um erro de tradução

Abra um issue no repositório indicando o ficheiro, a secção e a redação proposta. Uma correção de
tradução **nunca** altera o sentido normativo: se acha que o inglês está errado, isso é um issue
distinto e dirige-se ao `main`.
