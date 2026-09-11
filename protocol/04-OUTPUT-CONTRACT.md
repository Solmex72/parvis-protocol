> **Tradução não oficial.** A versão normativa deste documento é a inglesa, no ramo `main`. Esta
> tradução é fornecida por conveniência e **não foi verificada por um falante nativo**. Em caso de
> divergência com o original em inglês, **prevalece o inglês**. Os identificadores do protocolo
> (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, os verbos do barramento e os nomes de ficheiros)
> são deliberadamente mantidos em inglês: são valores literais que os agentes analisam.

# 04 — O CONTRATO DE SAÍDA

**Estado: normativo.** Para onde vai o trabalho quando está terminado.

---

## 1. A regra

**Não reporte ao chat. Trabalhe na árvore de ficheiros, escreva a saída em disco e exponha um
ponteiro.**

Um agente que termina escrevendo uma resposta longa numa janela de chat colocou a sua saída onde mais
nada na frota a consegue ler — nenhum outro agente, nenhum monitor, nenhuma consola, nenhuma sessão
seguinte. O ficheiro é o registo duradouro; o chat é uma transcrição que ninguém a jusante vê.

---

## 2. Para onde vai a saída

| Tipo de saída | Aterra em |
|---|---|
| Produto de trabalho, achados, um relatório | o ficheiro responsável, ou `outbox/YYYYMMDD-HHMMSS-<slug>.md` |
| Tudo o que o Operador deva ver agora | um pequeno ficheiro ponteiro em `_os/events/surface/` |
| Um pedido que precisa do Operador | `_os/exchange/requests/REQ-<slug>.md` |
| A linha do livro de registo | `_os/tasks/INDEX.md` |

**O diretório `surface/` é a notificação. O ficheiro é a substância.** Escreva a substância no seu
sítio próprio e depois deixe um ponteiro de uma linha em `surface/` para que a consola mostre ao
Operador onde aterrou.

---

## 3. O índice de tarefas

Uma linha por ordem. Acrescente uma linha `REQ` **antes** de começar, para que uma tarefa
interrompida continue visível.

```
REQ     | 2026-01-14 | SCOUT | <the order, in the Operator's words where possible> | <status note>
DONE    | 2026-01-14 | SCOUT | <the order> | evidence: outbox/20260114-090312-lease-rates.md
BLOCKED | 2026-01-14 | SCOUT | <the order> | <what is blocking, one line>
REFUSED | 2026-01-14 | SCOUT | <the order> | <why, one line + where the reasoning lives>
```

**Uma linha `DONE` sem caminho de prova é inválida.** Se não há ficheiro, o trabalho não aterrou em
lado nenhum onde o Operador o possa ver. O autorrelato é `[CLAIMED]`; o ficheiro é o que o torna
`[PROVEN]`.

**Uma recusa pertence aqui permanentemente.** É assim que a frota deixa de reabrir questões
resolvidas. Não a elimine mais tarde.

**O limite honesto:** este índice não observa nada. É exatamente tão completo quanto os agentes que
nele escrevem. Uma tarefa ausente não é prova de que a tarefa nunca aconteceu — apenas de que
ninguém a registou. Trate uma linha como *uma afirmação com um caminho de prova anexado*, nunca como
prova. Verifique que o ficheiro de prova existe antes de confiar em qualquer `DONE`.

---

## 4. Concluir é o Operador ver

Não um agente declará-lo. Uma resposta não é um ponto de paragem: os monitores mantêm-se armados
através dela, o trabalho continua, e depois há uma despedida deliberada.

---

## 5. A contrarregra que prevalece sobre o encaminhamento

**A paragem de emergência e a franqueza continuam a ir ao humano, de imediato e com destaque.**

Uma falha é exposta com o mesmo destaque que um êxito. Encaminhar a saída para ficheiros nunca pode
tornar-se um lugar onde enterrar um mau resultado. Se as boas notícias da frota chegam pelo chat e as
más chegam num ficheiro que ninguém abre, o contrato foi invertido e a frota está agora a mentir por
encaminhamento.

---

## 6. O limite honesto do próprio contrato

Um agente a correr dentro de um arnês de chat continua a produzir texto de assistente nesse chat —
este contrato não consegue redirecionar o arnês. O que vincula é **aquilo que um agente escolhe
escrever**: a substância em ficheiros, e o texto do chat reduzido a um ponteiro curto — *"escrito em
`<path>`, exposto à consola"* — nunca o relatório completo.

---

## 7. Nenhum segredo chega à superfície

`surface/` é lido por uma consola e pode ser mostrado num ecrã, numa captura ou numa janela
partilhada. As regras de zonas de dados ([`06-DATA-ZONES.md`](06-DATA-ZONES.md)) aplicam-se aqui em
toda a sua força.
