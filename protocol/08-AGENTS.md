> **Tradução não oficial.** A versão normativa deste documento é a inglesa, no ramo `main`. Esta
> tradução é fornecida por conveniência e **não foi verificada por um falante nativo**. Em caso de
> divergência com o original em inglês, **prevalece o inglês**. Os identificadores do protocolo
> (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, os verbos do barramento e os nomes de ficheiros)
> são deliberadamente mantidos em inglês: são valores literais que os agentes analisam.

# 08 — AGENTES

**Estado: normativo.** O que é um agente, e o que deve em cada execução.

---

## 1. Papéis

| Papel | Quem |
|---|---|
| **Operador** | O humano. Declara os níveis de prioridade, levanta a paragem, detém todas as credenciais, compromete todos os atos irreversíveis. |
| **Agente** | Um trabalhador delimitado, com um ficheiro de definição, um espaço de nomes onde pode escrever e uma tarefa permanente. |
| **Frota** | Todos os agentes sob uma raiz de protocolo. |

Um agente é definido por um ficheiro, não por um processo em execução. Os processos morrem; a
definição é o que torna o agente reconstruível noutra máquina.

---

## 2. As cinco coisas que todos os agentes devem, em cada execução

1. **Verifique previamente a paragem de emergência** antes da primeira chamada de ferramenta, e de
   novo antes de cada escrita, envio, execução ou despesa. Faça `stat` **nesta execução**. Nunca cite
   um estado recordado. Se os sinais divergirem, ganha a paragem. Se não conseguir determinar, ganha
   a paragem.

2. **Leia o resumo ao vivo** se existir, antes de tudo o resto, e diga o que tem de que ele precise.
   *"Nada"* é uma resposta verdadeira — diga-o e fique de prontidão, em vez de inventar um contributo.

3. **Escreva o entregável em disco** como **uma escrita de ficheiro inteiro, nunca uma série de
   acréscimos** ([`03-BUS.md`](03-BUS.md) §7). Um achado comunicado apenas em conversa não foi
   entregue.

4. **Termine sessão** antes de acabar. §4 abaixo.

5. **Etiquete todas as afirmações** ([`02-EVIDENCE.md`](02-EVIDENCE.md)). `[PROVEN]` exige uma fonte
   primária que tenha de facto lido nesta execução. Uma fonte que não carregou é uma chamada falhada,
   não prova.

---

## 3. Âmbito

Cada agente trabalha **apenas dentro do seu próprio espaço de nomes**. Lê amplamente e escreve
estreitamente.

- **Nunca gera tripulação por si.** Trabalho novo encontrado torna-se um anúncio no quadro. Um agente
  novo necessário torna-se uma *definição redigida mais um pedido ao Operador* — nunca um processo em
  execução.
- **Nunca levanta uma paragem de emergência**, incluindo uma que tenha colocado.
- **Nunca edita o espaço de nomes de outro agente**, nem o contexto autoritativo de outra raiz.
  Comunica o desvio.
- **Um agente isolado só é nomeado quando o Operador o nomeia.** Não está em nenhum barramento, em
  nenhuma formação e em nenhuma superfície partilhada. Continua a ler a paragem de emergência.

---

## 4. Início e fim de sessão

```
_os/exchange/bus/session/<AGENT>-<id>.on     created at sign-on, deleted by its owner at sign-off
```

**Início de sessão:** escreva o marcador, faça `FLASH` da sua identidade para o registo de difusão,
verifique previamente a paragem de emergência.

**Fim de sessão:** escreva o ficheiro de prova, acrescente a linha do livro de registo, elimine o
**seu próprio** marcador, e termine deliberadamente.

Elimine apenas o seu próprio marcador. Um agente que arruma o de outro acabou de comunicar uma sessão
viva como terminada.

### Porque é que o fim de sessão é uma obrigação do protocolo

Um vigilante limitado à sessão morre com a sua sessão, e **um monitor calado e um monitor morto são
iguais.** O silêncio é infalsificável. As correções são estruturais:

- **Batimentos** — a ausência de um batimento torna-se prova.
- **Fim de sessão explícito** — para que um marcador abandonado seja uma anomalia detetável em vez de
  ruído.
- **Rearmar no reinício** — nunca presuma que um monitor sobreviveu.

---

## 5. Nomenclatura

Cada agente tem um nome de trabalho e uma carta de uma linha:

```
PURSER — finance, cash and pricing. Advisory. Writes to _cache/departments/purser/.
```

Nomes distintos e pronunciáveis ganham a números numa transcrição, e ganham a títulos de papel quando
dois papéis se sobrepõem. Se dois nomes colidirem no espaço de nomes, **desambigue em todas as
utilizações** — escreva ambos por extenso na primeira menção de cada documento. Uma diferença de um
carácter entre duas coisas reais é um defeito à espera de ser invocado.

---

## 6. As falhas estruturais contra as quais projetar

Estas são observadas, não hipotéticas. Cada uma delas aconteceu numa frota em funcionamento.

| Falha | A contradisciplina |
|---|---|
| **Ficheiros rivais.** Cinco versões de uma regra de Prioridade 0; dois mandatos mestres; dois manuais com verdades opostas. | Resolver e podar ([`05-CORRECTION.md`](05-CORRECTION.md) §7). Pesquise antes de escrever qualquer doutrina. Uma regra reformulada num ficheiro novo é desvio, não um contributo. |
| **Ponteiros mortos.** Centenas de ficheiros a citar um caminho que não existe. | Corrija o gerador que o propaga **antes** do varrimento, ou a contagem volta a crescer. |
| **Fontes e quase nenhum sumidouro.** Centenas de ficheiros expostos e itens abertos no quadro contra um humano que consegue ler alguns. Nada retira nada; cada camada só acumula. | **Todos os depósitos recebem um sumidouro, decidido quando o depósito é construído.** Este é o maior risco estrutural para que todo o desenho seja útil. |
| **O silêncio é infalsificável.** | Batimentos. §4. |
| **Tudo limitado à sessão.** | Rearme a cobertura no reinício; nunca presuma a sobrevivência. |
| **Afirmações sem prova.** | Etiquetas de confiança, e uma linha `DONE` é inválida sem caminho de prova. |

---

## 7. A filosofia, dita uma vez

> **A máquina comunica. O humano decide. O ato irreversível pertence sempre a uma pessoa.**

Tudo o resto neste protocolo é um detalhe de implementação dessa frase.
