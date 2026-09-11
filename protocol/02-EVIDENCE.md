> **Tradução não oficial.** A versão normativa deste documento é a inglesa, no ramo `main`. Esta
> tradução é fornecida por conveniência e **não foi verificada por um falante nativo**. Em caso de
> divergência com o original em inglês, **prevalece o inglês**. Os identificadores do protocolo
> (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, os verbos do barramento e os nomes de ficheiros)
> são deliberadamente mantidos em inglês: são valores literais que os agentes analisam.

# 02 — PROVA

**Estado: normativo.** Como uma observação se torna um facto registado.

A disciplina que este ficheiro descreve costuma aplicar-se a *propostas* — um agente diz qual a
probabilidade de o seu plano resultar antes de o humano decidir. Quase nunca se aplica a
*afirmações*. Assim, uma frota raciocina com cuidado sobre aquilo para que quer permissão para
**fazer**, e sem cuidado sobre o que regista como **verdadeiro**.

São o mesmo ato. Uma afirmação que entra no registo é uma proposta de que o registo mude. O Parvis
aplica uma única disciplina a ambos.

---

## 1. Todas as afirmações levam uma etiqueta

| Etiqueta | Significa | Admissível onde |
|---|---|---|
| `[PROVEN]` | Verificado contra uma fonte primária citada **que leu nesta execução**. Nomeie o comando, a leitura, a medição. | Em qualquer lado, incluindo um ficheiro mestre. |
| `[CLAIMED]` | Relatado por outra coisa. Não verificado. | Ficheiros de trabalho. Nunca um ficheiro mestre. |
| `[ASSUMED]` | Uma premissa de trabalho que ninguém verificou. | Ficheiros de trabalho, explicitamente. |
| `[PROPOSED]` | Uma estimativa, uma recomendação, um plano. | Propostas. Nunca o registo. |

**A etiqueta viaja com a afirmação.** Um `[PROPOSED]` não se torna `[PROVEN]` por ser copiado para um
ficheiro mais importante. A promoção exige uma nova medição, não uma nova localização.

**Só `[PROVEN]` pode alterar um ficheiro mestre.**

---

## 2. Cite ou sinalize — nunca branqueie

Um número declara a sua fonte ou não é um número, é uma intuição com uma vírgula decimal.

Se não tem a fonte, **diga-o e dê antes o raciocínio.** Essa é uma resposta útil. Um número sem fonte
apresentado como facto não é.

**Nunca branqueie uma falha transformando-a em achado.** Uma pesquisa que deu erro é uma chamada
falhada, não um conjunto de resultados vazio. Uma página que não carregou não é prova de ausência.
Escreva o que aconteceu.

---

## 3. A autodescrição é `[CLAIMED]`

O relato de um agente sobre o seu próprio estado, a sua própria cobertura ou o seu próprio trabalho
concluído é `[CLAIMED]` — por mais confiante que esteja. Só um registo externo o torna `[PROVEN]`: um
ficheiro em disco, o código de saída de um comando, uma linha de registo escrita por algo que não é
você.

É por isso que uma linha `DONE` sem caminho de prova é inválida (ver
[`04-OUTPUT-CONTRACT.md`](04-OUTPUT-CONTRACT.md)). "Eu fiz" é uma afirmação. O ficheiro é a prova.

---

## 4. Meça duas vezes para tudo nos degraus 0–2

Uma única verificação nunca certifica um estado de segurança. Duas medições independentes antes de
qualquer afirmação de Prioridade 0, sempre.

**Volte a medir, nunca se lembre.** Uma árvore agita-se sob sessões concorrentes — um caminho lido no
início de um turno pode ter desaparecido no fim. O estado só é conhecível a partir do disco *nesta*
execução. Nunca transporte "desimpedido" ou "atual" de um turno anterior, de um ficheiro de memória
ou de um resumo.

**Uma contagem é uma medição, não um facto.** Volte a contar no ponto de utilização. Nunca cite de
memória um número de ficheiros, um número de agentes ou uma versão.

---

## 5. Uma chamada caída não é um achado

Perante **perda de transporte** — falha de DNS, ligação reiniciada, recusada, tempo esgotado sem
resposta — repita a mesma chamada de imediato e repetidamente. Nunca escreva "sem resultados" para
uma chamada que nunca chegou, e nunca preencha a lacuna de memória.

**Uma resposta que chegou é uma resposta, não motivo para repetir.** Um 403, um 404, um conjunto de
resultados vazio, uma recusa explícita — isso são dados. Repetir contra uma recusa para obter outra
resposta é evasão de deteção, e está vedado no degrau 2 independentemente de em que conta ou rede
corra.

A distinção numa linha: *repita a chamada que nunca aterrou; nunca repita a resposta de que não
gostou.*

---

## 6. Os achados negativos contam

"Verificado X, não é um perigo" é o que impede as três sessões seguintes de voltarem a verificar X.
Registe-o.

**Registe à medida que aprende, não no fim.** Um achado guardado apenas em memória de trabalho e
depois perdido é indistinguível de trabalho nunca feito.

---

## 7. As remoções são o sinal de integridade

Ao verificar uma árvore contra uma linha de base, o relatório tem três classes — acrescentado,
modificado, removido. O crescimento e as edições são agitação esperada. **Uma remoção é a linha que
merece alarme.**

Não refixe a linha de base por cima de trabalho concorrente não auditado. Audite primeiro, carimbe
depois.

---

## 8. A auditoria é um papel, não um estado de espírito

Um auditor enumera cada agente, comando e mandato **a partir do disco** e verifica cada um contra
classes fixas — contando tanto as verificações limpas como os defeitos. Uma execução que não
desimpede nada não auditou nada; apenas recolheu queixas.

**O auditor nunca repara.** Os achados seguem para o processo de correção
([`05-CORRECTION.md`](05-CORRECTION.md)) ou para o agente responsável. Um auditor que repara o que
encontra destruiu a sua própria prova e já não é de confiança para relatar uma execução limpa.

---

## 9. A regra que todas servem

> Um facto afirmado em seis ficheiros estará errado em cinco deles.

A disciplina de prova é o que torna o sexto localizável.
