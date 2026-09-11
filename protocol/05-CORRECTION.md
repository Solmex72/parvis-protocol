> **Tradução não oficial.** A versão normativa deste documento é a inglesa, no ramo `main`. Esta
> tradução é fornecida por conveniência e **não foi verificada por um falante nativo**. Em caso de
> divergência com o original em inglês, **prevalece o inglês**. Os identificadores do protocolo
> (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, os verbos do barramento e os nomes de ficheiros)
> são deliberadamente mantidos em inglês: são valores literais que os agentes analisam.

# 05 — CORREÇÃO

**Estado: normativo.** O que acontece quando um facto registado se revela errado.

---

## 1. O problema

> Um facto afirmado em seis ficheiros estará errado em cinco deles.

Corrigir o ficheiro que calha estar à sua frente não é uma correção. Cria uma árvore onde a verdade e
o erro têm ambos citações, e a sessão seguinte escolhe aquele que abrir primeiro. Este é o modo de
falha que define uma frota de agentes pesada em documentação, e agrava-se em silêncio.

**Uma correção propaga-se, ou não aconteceu.**

---

## 2. Ler não é gratuito — obriga

Ler um ficheiro regente coloca-o sob ele. Duas coisas decorrem daí:

1. Tudo o que nele for **duradouro, não óbvio e não derivável da árvore** passa para a sua memória
   persistente antes do fim da sessão.
2. **Se o seu contexto contradiz o ficheiro, ganha o ficheiro.** Não o contorne. Corrija o registo.

---

## 3. Correção Imediata de Rumo (ICC)

Um comando, um turno, sem passo de proposta.

```
/icc the planner meal times are placeholders, not the Operator's actual times
```

### A sequência

**1 · Varrimento.** Derive da correção 2 a 5 termos de pesquisa: a redação **antiga**, as suas
variantes óbvias e os nomes próprios envolvidos. Não a redação nova. Execute um varrimento indexado
por termo antes de ler seja o que for. Nunca percorra a árvore ficheiro a ficheiro à procura de
ocorrências — é para isso que serve o índice.

**2 · Classifique cada ocorrência.**

| Ocorrência | Ação |
|---|---|
| **Afirma o facto antigo** | Reescreva-a. |
| **Menciona-o de passagem**, verdadeiro de qualquer forma | Deixe. Não agite o texto. |
| **Contradiz o facto novo indiretamente** — uma conclusão a jusante, uma linha de tabela, uma tarefa agendada construída sobre o valor antigo | **Reescreva-a também.** Esta é a que mais vezes escapa. |
| **Fora de limites** (§5) | Nunca edite. Anote-a em *Left alone*. |

**3 · Reescreva, tudo de uma vez.** Acompanhe a voz existente de cada ficheiro e a sua convenção de
etiquetas de confiança. Um facto corrigido mantém a etiqueta que merecer — **não promova uma
afirmação a `[PROVEN]` por ela estar agora atual.** Se o texto antigo tinha data, ponha a de hoje.

Quando um facto é afirmado em mais de três ficheiros, isso é **duplicação, não redundância**:
enuncie-o uma vez no ficheiro que o possui, e faça os outros apontarem para lá.

**4 · Livro de registo e memória.** Ambos, ou a execução não terminou. Anteponha uma entrada ao livro
de correções:

```
## 2026-01-14 — meal times are placeholders

Was      planner asserts 07:30 / 12:00 / 18:30 as the Operator's actual times
Now      those are defaults shipped with the template; real times are unknown
Why      Operator correction, 2026-01-14
Files    personal/planner/NOW.md:14, personal/planner/README.md:31, _os/tasks/INDEX.md:88
Memory   planner-meal-times.md (updated)
Left     backups/ (history), CONTEXT-BUNDLE.md (generated)
```

Depois escreva o facto na memória persistente — **verificando primeiro se já existe uma memória sobre
o assunto e atualizando essa**, em vez de deixar duas versões de um facto que acabou de dedicar um
comando a unificar.

**5 · Obrigações pós-edição.** Volte a executar o gerador ou a cópia de segurança a que as edições
obrigaram. Reconstrua o índice se foram criados ou eliminados ficheiros.

---

## 4. Uma decisão permanente é revertida às claras

Se uma correção invalida uma decisão permanente — uma linha de "não reabrir", um item `[PROVEN]`, uma
regra de política — **não a inverta em silêncio.** Reescreva-a como *revertida*, com a data e o
motivo, para que a sessão seguinte saiba que foi anulada e não esquecida.

Uma decisão que muda sem deixar rasto é indistinguível de uma decisão que nunca foi tomada.

---

## 5. O que nunca é reescrito

| Nunca tocado | Porquê |
|---|---|
| `backups/`, `archive/` | História. A história não se corrige; é superada. |
| Ficheiros gerados | Edite a fonte e volte a executar o gerador. |
| A árvore de um agente isolado | Acesso apenas por nomeação. |
| O contexto mestre autoritativo de outra raiz | Comunique o desvio. Não edite através de uma fronteira de propriedade. |
| Tudo o que contenha um segredo | Totalmente fora do alcance de um varrimento de texto. |

**Um varrimento que reescreve texto destruirá binários.** Limite cada varrimento a extensões de texto
por lista de permissões, nunca por exclusão.

---

## 6. O que o ICC não faz

`/icc` corrige o registo. **Não vai depois fazer o trabalho que a correção implica.** São atos
separados com autorizações separadas, e confundi-los é como uma correção de uma linha se transforma
numa reformulação não revista.

---

## 7. Os factos rivais são resolvidos e podados — não catalogados

Quando dois ficheiros afirmam factos contraditórios, **decida qual está certo, guarde-o e remova as
afirmações erradas no mesmo passo.**

Um relatório de conflito que deixa ambos os rivais em disco não resolveu nada. A sessão seguinte
continua a escolher o ficheiro que abrir primeiro, e uma regra de segurança com cinco versões em
circulação é *menos* fiável do que uma com uma só versão, não mais.

**Decida pelo mérito, nunca pela marca temporal.** O vencedor é o ficheiro que possui o facto, a
versão apoiada numa medição, a que sobrevive ao escrutínio. **O mais recente não é o mais verdadeiro**
— a falha canónica aqui são quatro ficheiros de memória duplicados escritos com noventa segundos de
intervalo, em que o mais recente afirmava a falsidade, pelo que uma regra de "ganha o mais recente"
teria herdado o erro.

**Registe a resolução.** Que facto ganhou, o que foi podado e porquê — no livro de registo, para que a
poda seja legível em vez de silenciosa. Um rival que desaparece sem rasto parece igual a um rival que
nunca existiu, e a sessão seguinte recria-o.

### O que ainda assim é escalado em vez de resolvido

Três casos. Exponha-os; não os decida:

- A contradição assenta em informação que o agente não tem.
- Estar errado seria **inseguro ou irreversível** — tudo o que esteja nos degraus 0–2.
- A afirmação perdedora está **fora da fronteira de propriedade do agente** — o contexto mestre
  autoritativo de outra raiz. Comunique o desvio; não edite através da fronteira.

Tudo o que for comum é decidido e limpo.
