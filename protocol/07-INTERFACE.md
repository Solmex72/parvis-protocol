> **Tradução não oficial.** A versão normativa deste documento é a inglesa, no ramo `main`. Esta
> tradução é fornecida por conveniência e **não foi verificada por um falante nativo**. Em caso de
> divergência com o original em inglês, **prevalece o inglês**. Os identificadores do protocolo
> (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, os verbos do barramento e os nomes de ficheiros)
> são deliberadamente mantidos em inglês: são valores literais que os agentes analisam.

# 07 — A CAMADA DE INTERFACE

**Estado: normativo.** Este é o ficheiro que dá o nome ao projeto.

Todas as superfícies que um humano toca são **Parvis**. A vista de chão só de leitura é o *Parvis
HMI*; o menu de mosaicos a partir do qual conduz a frota é a *Parvis Console*.

---

## 1. A regra que faz o HTML funcionar

> Uma página de navegador é um **ecrã e um teclado**, não um programa com acesso ao disco.

Esse único facto rege toda a camada:

- **A página mostra e recolhe.** Apresenta estado e aceita entrada. Aberta a partir de um caminho de
  ficheiro, por si só, **não consegue ler a árvore nem escrever uma ordem.** A caixa de areia do
  navegador proíbe ambas, e isso é uma virtude.
- **O sidecar faz a ponte.** Um pequeno serviço de retorno local — ligado a `127.0.0.1`, mais nada —
  é a única coisa que lê a árvore pela página e escreve o que a página submete. A página faz `GET` do
  estado; a página faz `POST` de um prompt; o sidecar faz o trabalho de disco. **Sem sidecar, não há
  Parvis ao vivo — apenas um instantâneo.**
- **Nada contorna a revisão.** Um prompt submetido a partir do Parvis é uma **indução, não uma
  execução**. O sidecar escreve uma linha `REQ` no índice de tarefas e para. Nunca lança um agente,
  nunca corre um comando, nunca envia. Comprometer trabalho novo continua a ser a tecla do Operador.

É por isso que a página "funciona": a página é honesta quanto a ser uma janela, o sidecar faz o
pequeno trabalho real na fronteira, e **a revisão continua entre um prompt e uma máquina em
movimento.**

---

## 2. Requisitos duros — todas as superfícies Parvis

1. **Autocontida.** Um ficheiro HTML: CSS e JS embutidos, sem scripts externos, sem CDN. Tipos de
   letra web apenas, com uma pilha de recurso real. Tem de apresentar-se offline a partir de um
   caminho de ficheiro.

2. **As cores são o estado, lidas ao vivo, nunca fingidas.** Verde = a correr, âmbar = perguntar
   primeiro, vermelho = parado — derivados do ficheiro STATE e do livro de registo ao vivo. **Um valor
   sem fonte ao vivo mostra `—`, nunca um número de aspeto plausível.** O vermelho prevalece sobre
   todas as outras cores e sobre toda a interface.

3. **O sidecar é só de retorno local e não guarda nenhum segredo que a página possa ver.** Nenhuma
   chave de API, nenhuma credencial, nenhum token de valor chega ao navegador. O sidecar autentica a
   página com um token de sessão local e faz ele próprio o trabalho privilegiado. **A página nunca
   guarda nada que valha a pena roubar.**

4. **Um instantâneo é rotulado como instantâneo,** com a sua hora de leitura. Só uma página a falar
   com um sidecar vivo se pode apresentar como ao vivo. Uma página desatualizada com aspeto de estar
   ao vivo é pior do que nenhuma página.

5. **A paragem de emergência prevalece sobre a interface.** Sob `STOP`, o Parvis não induz nada e o
   sidecar não escreve nada a não ser a linha de fim de sessão. **Um chão vermelho não aceita
   ordens.**

6. **Marca Parvis, e nenhum nome de empresa terceira.** Sejam quais forem os sistemas reais de que o
   padrão foi aprendido, o padrão é seu e chama-se Parvis. Uma superfície que distribui o nome
   comercial de outrem está errada e é corrigida.

---

## 3. Requisitos de segurança do sidecar

Um serviço HTTP de retorno local numa estação de trabalho de programação é uma verdadeira superfície
de ataque. Estes pontos não são opcionais.

| Requisito | Porquê |
|---|---|
| **Ligue `127.0.0.1` explicitamente**, nunca `0.0.0.0` | Ligar todas as interfaces publica a consola da sua frota na rede local. |
| **Valide o cabeçalho `Host`** contra uma lista de permissões de `127.0.0.1:<port>` / `localhost:<port>` | Derrota o DNS rebinding, que é como uma página web que visita alcança um serviço de retorno local. |
| **Rejeite pedidos que tragam uma `Origin` que não emitiu** | Mesma classe de ataque, vetor diferente. |
| **Exija um token de sessão** em todas as rotas que alterem algo, emitido ao carregar a página, nunca registado | A página prova que é a sua página. |
| **Ponha em lista de permissões cada caminho** que o serviço vá ler ou escrever, depois volte a resolver e confirme a contenção | Derrota o atravessamento. Uma lista de permissões só por si não basta se existirem ligações simbólicas. |
| **Falhe em segurança perante um estop ilegível** — recuse, não recaia em `RUN` | Ver [`01-ESTOP.md`](01-ESTOP.md) §2. |
| **Sem `eval`, sem saída para shell, sem interpolação de modelos com entrada do utilizador** | A barra de prompt é uma entrada de indução, não uma linha de comandos. |

A implementação de referência em [`reference/sidecar/`](../reference/sidecar/) implementa todos estes
pontos e está comentada no local de cada um.

---

## 4. Quais são as superfícies

| Superfície | O quê | Estado |
|---|---|---|
| **Parvis Console** | Painéis com separadores — estado, documentos, livro de registo, barramento, superfície, definições | Distribuída. |
| **Parvis Floor** | O separador Armazém: chão 3D, órbita e descida, controlos de equipamento | Distribuída. Ver [`09-FLOOR.md`](09-FLOOR.md). |
| **Barra de prompt** | A entrada de indução, na consola e em cada equipamento do chão | Distribuída. |
| **O sidecar** | Ponte de retorno local: lê a árvore, escreve linhas `REQ`, não guarda segredos | Distribuído. |

**Distribua primeiro os painéis.** O chão 3D é a parte que toda a gente quer construir e a parte que
não vale nada sem o livro de registo por baixo — apresenta estado que o resto do protocolo produz, e
numa árvore vazia mostra corretamente nada.

---

## 5. Posição

- **A página lê. O sidecar escreve. O Operador compromete.**
- Nenhuma superfície lança, envia, implanta ou levanta uma paragem de emergência.
- Nenhum segredo chega ao navegador, nunca.
- A saída vai para ficheiros e para a consola, não para uma janela de chat
  ([`04-OUTPUT-CONTRACT.md`](04-OUTPUT-CONTRACT.md)).
