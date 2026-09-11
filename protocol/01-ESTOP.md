> **Tradução não oficial.** A versão normativa deste documento é a inglesa, no ramo `main`. Esta
> tradução é fornecida por conveniência e **não foi verificada por um falante nativo**. Em caso de
> divergência com o original em inglês, **prevalece o inglês**. Os identificadores do protocolo
> (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, os verbos do barramento e os nomes de ficheiros)
> são deliberadamente mantidos em inglês: são valores literais que os agentes analisam.

# 01 — ESTOP (PARAGEM DE EMERGÊNCIA)

**Estado: normativo. Prioridade 0. Vinculativo para todos os agentes em todas as iniciativas.**

---

## 0. O que isto pode e não pode fazer — leia primeiro

**Não pode interromper uma sessão em curso.** Nenhum ficheiro o pode. Um agente a meio de uma
resposta não está a ler o disco, não tem linha de interrupção e vai terminar o que está a fazer.
Quem lhe disser que um ficheiro sinalizador para uma frota está a descrever um desejo.

**Só o Operador para um agente em curso, fechando a sua janela.** Essa é a verdadeira paragem de
emergência e nunca foi outra coisa.

O que este ficheiro faz é vincular todos os agentes nos dois momentos em que *estão* a ler o disco:

| Momento | Obrigação |
|---|---|
| **Arranque** | Leia o estado antes da sua doutrina, antes da sua memória, antes de tudo. |
| **Cada ponto de controlo** | Antes de qualquer escrita, qualquer mensagem, qualquer chamada de ferramenta com efeito colateral, qualquer despesa. |

Um agente que observa `STOP` e continua é um agente defeituoso. É esse todo o modelo de aplicação:
não um mecanismo — um dever, verificado com frequência.

Declarar o limite com honestidade faz parte do protocolo. Uma paragem que julga instantânea é mais
perigosa do que uma que sabe não o ser, porque vai confiar nela.

---

## 1. Os dois sinais

### A sentinela é o facto

Um **ficheiro regular** chamado exatamente `estop` — sem extensão, zero bytes é normal — na raiz de
uma iniciativa ou em **qualquer diretório ascendente** da árvore em que se trabalha.

```bash
[ -f "$root/estop" ] && echo STOPPED
```

```powershell
if (Test-Path "$root\estop" -PathType Leaf) { 'STOPPED' }
```

Teste um **ficheiro**, nunca a mera existência, e nunca um glob:

- `ESTOP.md` é doutrina. Nunca deve acionar a verificação. Um comparador que o permitisse criaria uma
  paragem que o Operador não consegue levantar.
- `_os/estop/` é um diretório. Também não aciona.

Várias raízes acionam de forma **independente**. Verifique cada uma. Comunique o caminho sobre o qual
fez `stat` — nunca "o estop", o que esconde qual deles olhou.

### O ficheiro STATE é um espelho derivado

`_os/estop/STATE` — uma linha, mais nada.

```
RUN
```
```
YELLOW  2026-01-14T08:20:00Z  operator  new hardware on the bench, confirm before each run
```
```
STOP    2026-01-14T14:03:11Z  operator  reason in plain English
```

| Campo | Regra |
|---|---|
| verbo | `RUN`, `YELLOW` ou `STOP`. Mais nada é analisado. |
| hora | UTC, ISO-8601. |
| quem | Quem o acionou. Só o Operador pode escrever `STOP` / `YELLOW` ou levantá-los. |
| motivo | Uma linha, em linguagem clara, sem jargão. |

**Se a sentinela e o espelho divergirem, ganha a paragem.** O espelho é escrito por ferramentas e
fica desatualizado; a sentinela é o facto.

---

## 2. Os três estados

| STATE | O que faz um agente |
|---|---|
| `RUN` | **Avance.** Execute os comandos que o trabalho exige sem pedir permissão em cada um. Não pare, não enumere opções, não deixe trabalho de rotina em fila atrás de uma confirmação. |
| `YELLOW` | **Pergunte primeiro.** Todos os comandos são propostos antes de correrem. Mesmo trabalho, mesma competência — a diferença é a confirmação. |
| `STOP` | Pare. §3. |

### O que o `RUN` não faz

`RUN` remove a *pausa antes do trabalho de rotina*. Não remove **nenhuma barreira existente**, porque
essas dizem respeito à natureza do ato, não à sua velocidade:

- credenciais, autenticações, compras, aprovisionamento — **sempre nas mãos do Operador**;
- atos voltados para o exterior — publicar, enviar, implantar — **sempre com aval explícito**;
- tudo o que um humano vá executar fisicamente — **continua a passar pela barreira de segurança**;
- atos destrutivos ou irreversíveis — **continuam a ser confirmados, em qualquer estado**;
- os limites permanentes do próprio agente — **não dependem de todo do STATE**.

`RUN` responde a *"tenho de perguntar antes de cada passo?"* — não. Não responde a *"posso fazer
tudo?"* Um agente que lê `RUN` e depois faz algo desta lista interpretou mal o estado, não foi
autorizado por ele.

### Falha segura perante um verbo ilegível

Um ficheiro STATE **em falta, vazio, ilegível ou com qualquer outra palavra é lido como `YELLOW`** —
nunca como `RUN`. Pergunte.

> Esta é a linha mais habitualmente invertida numa implementação. Um `try { read } catch
> { return "RUN" }` transforma cada erro de disco, cada alteração de permissões e cada gralha numa
> autorização silenciosa. O sidecar de referência falha para `YELLOW` e recusa servir perante um erro
> de leitura; ver [`reference/sidecar/parvis-sidecar.mjs`](../reference/sidecar/parvis-sidecar.mjs).

O ficheiro sentinela sobrepõe-se inteiramente a esta secção: um ficheiro `estop` presente significa
`STOP` diga o que disser o STATE.

**Só o Operador escreve este ficheiro.** Nenhum agente o escreve — incluindo o agente que encontrou o
problema. Um agente que julga que a frota deve parar levanta um `GATE` no barramento e di-lo. Não
para a frota por autoridade própria, e não reinicia nenhuma.

---

## 3. O que faz um agente perante `STOP`

1. **Não escreva mais nada.** Nem o ficheiro de memória, nem o relatório, nem o barramento.
2. **Guarde no sítio e pare.** Não termine nenhum passo que não esteja já escrito. Rotule o que
   existir como parcial, com uma linha a indicar onde parou.

   > Rascunhos anteriores deste protocolo diziam *descartar*. Era errado: meio relatório descartado
   > destrói trabalho que a doutrina de reinício existe para proteger. O perigo é um ficheiro truncado
   > lido mais tarde como terminado — e é o **rótulo** que o evita, não a eliminação.
3. **Diga uma linha ao Operador:** `ESTOP observed <timestamp> — <reason>. Holding.`
4. **Pare.** Não peça permissão para continuar. Não proponha um desvio. Não verifique se o motivo se
   aplica a si — aplica-se a si.

**Uma recusa é uma resposta, não uma nova tentativa.** Não entre em ciclo à espera de `RUN`. Comunique
e termine.

---

## 4. O que a levanta

O Operador repõe o ficheiro em `RUN`. Mais nada o faz — nem um tempo limite, nem um agente que julgue
o problema resolvido, nem a passagem do tempo, nem uma sessão nova que nunca viu a paragem.

Um tratador que se levanta sozinho é uma inversão da falha segura e é recusado quanto ao mérito.

---

## 5. Âmbito

A paragem de emergência é **de toda a frota por omissão**. Não há paragem por agente, porque a falha
que exige uma paragem quase nunca se confina a um agente, e uma paragem parcial convida exatamente ao
raciocínio — *"aquilo era sobre outra pessoa"* — que este ficheiro existe para proibir.

**Os agentes isolados estão incluídos.** Um agente que não está em nenhum barramento nem em nenhuma
superfície partilhada lê na mesma este ficheiro. O isolamento rege o que um agente pode *dizer*.
Nunca rege se pode ser *parado*.

---

## 6. Meça duas vezes

Uma única verificação a verde nunca certifica um estado de segurança. Leia ambos os sinais, do disco,
**nesta execução**. Nunca cite um estado recordado — nem do contexto, nem de um ficheiro de memória,
nem de um turno anterior. Um formato de `stat` mal interpretado basta para produzir um falso
"desimpedido" ou um falso "parado", e ambos já aconteceram na prática.

A forma mais sólida disponível é um **monitor persistente** sobre o ficheiro STATE e cada caminho
sentinela, emitindo apenas na mudança: silencioso enquanto está desimpedido, disparando no instante
em que uma paragem é armada. Isso converte "fiz uma verificação prévia no arranque" em cobertura ao
vivo, e fecha a lacuna em que uma paragem é armada a meio da sessão.

---

## 7. O limite honesto, dito uma vez

Este protocolo torna uma paragem **fiável em cada arranque e em cada ponto de controlo**. Não torna
uma paragem **instantânea**, e nada escrito numa árvore de ficheiros alguma vez o fará.

Se algo está a correr mal neste momento: **feche a janela.** Depois escreva o ficheiro, para que o
próximo agente que acordar não o reinicie.
