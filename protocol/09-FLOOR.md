> **Tradução não oficial.** A versão normativa deste documento é a inglesa, no ramo `main`. Esta
> tradução é fornecida por conveniência e **não foi verificada por um falante nativo**. Em caso de
> divergência com o original em inglês, **prevalece o inglês**. Os identificadores do protocolo
> (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, os verbos do barramento e os nomes de ficheiros)
> são deliberadamente mantidos em inglês: são valores literais que os agentes analisam.

# 09 — O CHÃO

**Estado: normativo para o visualizador; informativo enquanto modelo.**
Implementado por [`reference/sidecar/hmi.html`](../reference/sidecar/hmi.html).

---

## 1. A afirmação

Uma frota de agentes é difícil de ver. Uma árvore de ficheiros é uma lista, uma tabela de processos é
uma lista, e um registo é uma lista — pelo que a única imagem que alguém tem de uma frota em
funcionamento são várias listas que não encaixam.

**Um armazém automatizado é a mesma máquina, e é legível há quarenta anos.** As gruas movem cargas
entre estantes sob um sistema de controlo, e a pessoa que supervisiona lê um chão de centenas de
movimentos simultâneos num relance, pela cor, sem ler uma única linha de texto.

O Parvis pede isso emprestado. Não como decoração — como um *mapeamento*, em que cada objeto do
armazém corresponde exatamente a uma coisa na árvore, e em que as próprias regras de segurança do
armazém se revelam ser as regras de segurança do protocolo, já desenhadas no sítio certo.

---

## 2. O mapeamento

| No chão | Na frota | Lido de |
|---|---|---|
| **Grua** | um agente, ou uma sessão viva | os marcadores de sessão em `_os/exchange/bus/session/` |
| **Palete** | um diretório | a própria árvore; o rótulo da palete é o seu caminho |
| **Posição na estante** | onde esse diretório vive | o seu ascendente |
| **Abrir uma palete** | descer ao diretório | **outro armazém inteiro** — §4 |
| **Induct** (cais de entrada) | trabalho a chegar | uma linha `REQ` em `_os/tasks/INDEX.md` |
| **Spur** (cais de saída) | um entregável a sair | um ficheiro em `_os/events/surface/`, uma exportação |
| **Tapete** | o barramento de ficheiros | `_os/exchange/bus/` — como o trabalho se move sem uma grua o transportar |
| **Camião** | um serviço externo ou outra IA | a fronteira. §5 |

O ponto não é a imagem. O ponto é que **já sabe ler este ecrã** se alguma vez esteve diante de um
sistema de controlo de armazém — e, se não esteve, o modelo continua a ser concreto de uma forma que
uma listagem de diretório não é.

---

## 3. As cores

Um relance, antes de qualquer navegação:

| Cor | No chão | Na frota |
|---|---|---|
| **VERDE** | em movimento — uma grua transporta uma carga | um agente está a trabalhar; uma sessão viva a meio de uma tarefa |
| **AZUL** | agendado — em fila, ainda não iniciado | um anúncio no quadro: encomendado, à espera de um agente |
| **ÂMBAR** | atenção — uma posição precisa de uma decisão | `YELLOW`: perguntar antes de cada ação |
| **VERMELHO** | paragem de emergência — essa zona está parada | `STOP`: a paragem está armada e esta raiz está congelada |
| **CINZENTO** | vazio, ou sem fonte ao vivo | sem dados. Nunca um palpite. |

Este não é um esquema novo. É o estado que a árvore já contém, apresentado.

**O vermelho ganha sempre o relance.** Uma única zona vermelha detém o olhar antes de qualquer verde,
tal como a paragem prevalece sobre todos os outros sinais ([`01`](01-ESTOP.md)). **Um chão que mostra
verde por cima de uma zona vermelha está a mentir** — e essa é a falha concreta que esta regra existe
para proibir.

**O cinzento é obrigatório onde não há fonte ao vivo.** Uma posição sem dados é apresentada a
cinzento e lê `—`. Nunca é apresentada a verde, porque o verde é o valor agradável por omissão
([`07`](07-INTERFACE.md) §2.2).

---

## 4. O armazém aninhado

**Abra uma palete e não está a olhar para uma caixa. Está a olhar para outro armazém inteiro** — com
as suas próprias gruas, as suas próprias paletes, os seus próprios cais.

Isto é exatamente a árvore de ficheiros. Uma iniciativa é um armazém; os seus departamentos são
corredores; os seus ficheiros são paletes; e uma palete que é ela própria um diretório é outro chão.
Assim, o visualizador é **uma só vista que desce**, com os mesmos controlos a cada profundidade,
porque cada nível *é* um armazém. Não há nada de novo a aprender à medida que se desce.

A recursão é toda a razão pela qual a metáfora se aguenta em vez de ser um revestimento. Um painel
que só apresenta o nível de topo é uma fotografia de uma frota; um que desce é uma vista dela.

---

## 5. Os camiões atracam na fronteira — nunca entram no chão

É aqui que o modelo deixa de ser uma visualização e passa a impor algo.

Um serviço externo — outra IA, uma API, um fornecedor — é um **camião**. E num armazém real um camião
encosta a um cais. Não entra no chão, não move uma grua, não entra numa estante nem abre um armazém
aninhado. Deixa uma carga num induct ou recolhe uma de um spur, e essa é a totalidade do seu acesso.

**Esse cais é a câmara estanque.** Todas as trocas externas acontecem na fronteira, filtradas, e nada
externo fica solto dentro da árvore.

**A documentação de um camião não é de confiança até ser verificada.** Uma carga que chega num camião
são *dados* de entrada, não uma ordem ao chão. É induzida e revista como tudo o resto, nunca obedecida
à chegada. Essa é a fronteira de origem de instruções de [`03`](03-BUS.md) §5, desenhada como um cais
de carga — e desenhada no único sítio onde alguém a olhar para o ecrã pode vê-la a ser respeitada.

Se a sua apresentação puser um camião no chão, a apresentação está errada e a arquitetura que desenha
também.

---

## 6. Duas superfícies, dois trabalhos

| | **O chão** (este ficheiro) | **A consola** ([`07`](07-INTERFACE.md)) |
|---|---|---|
| O que é | um chão 3D, visto ao vivo | um menu de mosaicos, escalonado por acesso |
| O que mostra | **como o sistema está** — cada agente, diretório e estado ao mesmo tempo | **o que pode fazer** — escolher a ferramenta, fazer o trabalho |
| O verbo | observar, compreender, decidir | executar, usar, produzir |

**O chão mostra como a máquina pensa; a consola serve para agir sobre o que conclui.** Um é um mapa, o
outro uma bancada. Uma superfície de gestão precisa de ambos, e o erro é construir só a bonita.

---

## 7. Controlos

A navegação foi o que tornou o original utilizável, não a cor por si só:

| Controlo | Faz |
|---|---|
| **Arrastar** | orbitar o chão — rodar, inclinar, olhar ao longo de um corredor |
| **Vista de topo** | passar a uma planta vista de cima. Órbita para profundidade, planta para disposição |
| **Clique numa palete** | descer a ela — outro armazém, os mesmos controlos |
| **Roda** | zoom |

Os mesmos controlos a cada profundidade. Não negociável: uma vista cuja interação muda à medida que se
desce quebrou a promessa de que cada nível é um armazém.

### A câmara é ortográfica, de propósito

Não há **divisão em perspetiva**. As linhas paralelas nunca convergem, e uma posição ao fundo de um
corredor é apresentada exatamente do mesmo tamanho que uma aos seus pés.

Isto parece errado por um momento — o olho espera convergência e lê a sua ausência como se estivesse
dentro das caixas a olhar para fora. Ainda assim é a troca certa, e é o que os ecrãs de controlo de
chãos automatizados reais usam: **todo o objetivo é comparar posições ao longo do chão num relance**,
e uma câmara em perspetiva torna o fundo de um corredor mais pequeno, mais esbatido e mais difícil de
avaliar do que a extremidade próxima. Em perspetiva, "aquela estante está mais cheia" e "aquela
estante está mais perto" parecem o mesmo. Com câmara ortográfica, não.

A oclusão continua a ser real — as faces que se afastam são descartadas e a geometria mais próxima
pinta por cima da mais distante. É uma câmara plana, não uma cena plana.

O equipamento também é alcançável a partir de um **menu lateral**, agrupado por tipo — gruas, paletes,
os dois cais, o tapete, os camiões. Selecionar a partir do menu ou do chão abre os mesmos controlos,
porque um chão que só se pode percorrer clicando em caixinhas numa cena 3D é uma demonstração e não um
instrumento.

---

## 8. O que o chão pode e não pode fazer

Todas as restrições de [`07`](07-INTERFACE.md) §5 aplicam-se. A linha é traçada num sítio concreto:

**O chão pode induzir. Nunca pode executar.**

Essa é a mesma linha que [`07`](07-INTERFACE.md) §1 já traça para a consola, e é o que permite que o
equipamento tenha controlos de todo. Selecionar uma grua e dirigir-lhe trabalho escreve uma linha
`REQ` que nomeia esse agente e deixa um `TELL` na sua caixa de entrada. **Não inicia nada.** Nenhum
processo é lançado, nenhum comando corre, e o agente pega no trabalho na sua própria execução seguinte
— ou não.

Duas consequências fáceis de errar:

- **Trabalho dirigido continua a não ser uma ordem.** A linha `REQ` é o registo canónico; a linha da
  caixa de entrada apenas aponta para ela. Um ficheiro que *ordenasse* a um agente — ou que
  reivindicasse a autoridade do Operador a partir de dentro da árvore — seria o incidente de
  segurança que [`03`](03-BUS.md) §5 define, e construir isso na superfície seria pior do que fazê-lo
  à mão. A autoridade é o Operador em conversa. O chão escreve o registo, não a instrução.
- **Algum equipamento não recebe controlos, deliberadamente.** O tapete é só de leitura: uma consola
  que pudesse escrever linhas no barramento estaria a fabricar uma autoridade que o protocolo lhe
  nega. Os camiões não têm controlos de todo — §5.

**Sob `STOP`, o chão é apresentado a vermelho e não induz nada.** Um chão vermelho não aceita ordens.

O limite honesto, dito uma vez: **isto é uma fotografia da árvore num instante, não um fluxo de
telemetria ao vivo.** Faz sondagens. Entre sondagens está desatualizado, mostra quando leu pela última
vez, e fica cinzento em vez de fingir o contrário quando o sidecar deixa de responder.
