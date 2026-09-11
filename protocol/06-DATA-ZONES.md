> **Tradução não oficial.** A versão normativa deste documento é a inglesa, no ramo `main`. Esta
> tradução é fornecida por conveniência e **não foi verificada por um falante nativo**. Em caso de
> divergência com o original em inglês, **prevalece o inglês**. Os identificadores do protocolo
> (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, os verbos do barramento e os nomes de ficheiros)
> são deliberadamente mantidos em inglês: são valores literais que os agentes analisam.

# 06 — ZONAS DE DADOS

**Estado: normativo.** Onde um ficheiro tem permissão para viver.

---

## 1. Porque é que uma proibição não resultou

A regra original era *"sem segredos, nunca, em lado nenhum"* — **sem nenhum sítio onde pôr os dados
privados em alternativa.**

Uma proibição sem destino não é cumprida. É contornada, e material privado acaba na árvore
sincronizada por acidente. Isso aconteceu repetidamente, inclusive por um agente que estava ele
próprio sujeito à regra.

**A regra é uma decisão de encaminhamento, não uma proibição.**

---

## 2. As duas zonas

| Zona | Propriedade | Contém |
|---|---|---|
| **PUBLIC** | Sincroniza para armazenamento na nuvem. **Trate cada byte como publicado.** | Doutrina, mandatos, definições de agentes, arquitetura, contexto de negócio, investigação, documentação técnica |
| **PRIVATE** | **Fora de todas as raízes de sincronização** — e fora do perfil de utilizador, para que o redirecionamento de pastas conhecidas também não lhe chegue | Segredos, pessoas reais e os seus dados pessoais, projetos e média privados, tudo o que seria errado encontrar numa cópia de segurança |

### O teste

> *Seria um problema que isto estivesse num instantâneo na nuvem daqui a um ano?*

Sim → PRIVATE. Não → PUBLIC. Em caso de dúvida genuína → **PRIVATE.** O custo de sobreclassificar é
inconveniência. O custo de subclassificar não se pode desfazer.

### Saiba o que sincroniza de facto

Verifique isto na máquina real, não por suposição. Numa estação de trabalho típica podem estar vários
clientes de sincronização a correr ao mesmo tempo, e tudo o que esteja nas pastas de documentos,
ambiente de trabalho ou imagens do utilizador sai da máquina e é retido no histórico de versões
durante semanas. **Eliminá-lo localmente não o recolhe.**

Duas consequências que causam falhas reais, cada uma por si:

1. **A saída de compilação tem de ser redirecionada** para fora de uma raiz de sincronização, ou o
   espelho corrompe-a a meio da compilação.
2. **As chaves vivem fora**, deliberadamente e por omissão.

---

## 3. A exceção: as credenciais não são de nenhuma zona

**As credenciais ativas — palavras-passe, chaves de API, tokens, chaves de emissão — pertencem a um
gestor de palavras-passe, não a nenhum dos sistemas de ficheiros.**

A zona privada contém *dados privados*. Um gestor de palavras-passe contém *credenciais*. Isto não é
picuinhice: um diretório privado não está cifrado por omissão, e um ficheiro é um ficheiro. No
momento em que um é copiado, citado numa transcrição ou anexado a seja o que for, está divulgado.

**Enuncie a propriedade de segurança da zona privada de forma estreita e nunca a exagere.** A sua
única propriedade provada costuma ser que *nada a copia para lado nenhum*. Sem cifra verificada de
disco completo ou por ficheiro, não está cifrada, não tem cópia de segurança e não é um cofre.

---

## 4. A classificação é do Operador, e é ajustável

Mantenha a tabela viva num único ficheiro — `DATA-CLASSIFICATION.md` — onde o Operador move categorias
entre zonas e que cada agente lê em vez de adivinhar.

Este ficheiro de protocolo enuncia o **mecanismo**. Aquele ficheiro enuncia a **política**. Onde os
dois discordarem, ganha o ficheiro de política.

---

## 5. Consequências para os agentes

- **Nenhum segredo em nenhuma árvore que seja empacotada.** Um pacote de contexto existe para ser
  colado numa sessão nova. Nomeie o que é detido e onde; nunca o valor.
- **Nenhum segredo chega a `surface/`.** É mostrado no ecrã.
- **Nenhum segredo chega a um navegador.** Ver [`07-INTERFACE.md`](07-INTERFACE.md) §3.
- **Oculte por referência, não por eliminação.** `<api key — see password manager entry "acme-prod">`
  mantém o facto localizável sem divulgar o valor.

---

## 6. Podar sem perder

Antes de algo sair da árvore de trabalho:

1. Copie-o para um depósito selado **fora das raízes** — um ficheiro de arquivo, não alcançável por
   glob.
2. Prepare os caminhos em `marked-deletion.md` / `marked-archive.md`.
3. **A execução é a mão do Operador**, com a árvore aquietada.

Nunca elimine em massa sob concorrência ativa.
