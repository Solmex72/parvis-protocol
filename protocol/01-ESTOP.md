> **Traduction non officielle.** La version normative de ce document est l'anglaise, sur la branche
> `main`. Cette traduction est fournie par commodité et **n'a pas été vérifiée par un locuteur
> natif**. En cas de divergence avec l'original anglais, **l'anglais prévaut**. Les identifiants du
> protocole (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, les verbes du bus et les noms de
> fichiers) sont délibérément conservés en anglais : ce sont des valeurs littérales que les agents
> analysent.

# 01 — ESTOP (ARRÊT D'URGENCE)

**Statut : normatif. Priorité 0. Contraignant pour chaque agent dans chaque projet.**

---

## 0. Ce que ceci peut et ne peut pas faire — à lire en premier

**Cela ne peut pas interrompre une session en cours.** Aucun fichier ne le peut. Un agent au milieu
d'une réponse ne lit pas le disque, n'a pas de ligne d'interruption, et terminera ce qu'il est en
train de faire. Quiconque vous dit qu'un fichier drapeau arrête une flotte décrit un souhait.

**Seul l'Opérateur arrête un agent en cours, en fermant sa fenêtre.** C'est le véritable arrêt
d'urgence et cela n'a jamais été autre chose.

Ce que ce fichier fait, c'est lier chaque agent aux deux moments où il *est* en train de lire le
disque :

| Moment | Obligation |
|---|---|
| **Démarrage** | Lisez l'état avant votre doctrine, avant votre mémoire, avant toute chose. |
| **Chaque point de contrôle** | Avant toute écriture, tout message, tout appel d'outil ayant un effet de bord, toute dépense. |

Un agent qui observe `STOP` et continue est un agent défectueux. C'est là tout le modèle
d'application : non pas un mécanisme — un devoir, vérifié souvent.

Énoncer honnêtement la limite fait partie du protocole. Un arrêt que vous croyez instantané est
plus dangereux qu'un arrêt dont vous savez qu'il ne l'est pas, parce que vous allez vous y fier.

---

## 1. Les deux signaux

### La sentinelle est le fait

Un **fichier ordinaire** nommé exactement `estop` — sans extension, zéro octet est normal — à la
racine d'un projet ou dans **n'importe quel répertoire parent** de l'arborescence travaillée.

```bash
[ -f "$root/estop" ] && echo STOPPED
```

```powershell
if (Test-Path "$root\estop" -PathType Leaf) { 'STOPPED' }
```

Testez un **fichier**, jamais la simple existence, et jamais un motif glob :

- `ESTOP.md` est de la doctrine. Il ne doit jamais déclencher la vérification. Un comparateur qui
  le permettrait créerait un arrêt que l'Opérateur ne peut pas lever.
- `_os/estop/` est un répertoire. Ne déclenche pas non plus.

Plusieurs racines se déclenchent **indépendamment**. Vérifiez chacune. Signalez le chemin sur
lequel vous avez fait `stat` — jamais « l'estop », ce qui masque celui que vous avez regardé.

### Le fichier STATE est un miroir dérivé

`_os/estop/STATE` — une ligne, rien d'autre.

```
RUN
```
```
YELLOW  2026-01-14T08:20:00Z  operator  new hardware on the bench, confirm before each run
```
```
STOP    2026-01-14T14:03:11Z  operator  reason in plain English
```

| Champ | Règle |
|---|---|
| verbe | `RUN`, `YELLOW` ou `STOP`. Rien d'autre n'est analysé. |
| heure | UTC, ISO-8601. |
| qui | Qui l'a déclenché. Seul l'Opérateur peut écrire `STOP` / `YELLOW` ou les lever. |
| motif | Une ligne, en langage clair, sans jargon. |

**Si la sentinelle et le miroir divergent, l'arrêt l'emporte.** Le miroir est écrit par l'outillage
et se périme ; la sentinelle est le fait.

---

## 2. Les trois états

| STATE | Ce que fait un agent |
|---|---|
| `RUN` | **Poursuivez.** Exécutez les commandes que le travail exige sans demander la permission à chacune. Ne vous arrêtez pas, n'énumérez pas des options, ne mettez pas le travail courant en file derrière une confirmation. |
| `YELLOW` | **Demandez d'abord.** Chaque commande est proposée avant d'être exécutée. Même travail, même compétence — la différence est la confirmation. |
| `STOP` | Arrêtez. §3. |

### Ce que `RUN` ne fait pas

`RUN` supprime la *pause avant le travail courant*. Il ne supprime **aucune barrière existante**,
car celles-ci portent sur la nature de l'acte, non sur sa vitesse :

- identifiants, connexions, achats, provisionnement — **toujours entre les mains de l'Opérateur** ;
- actes tournés vers l'extérieur — publier, envoyer, déployer — **toujours sur accord explicite** ;
- tout ce qu'un humain exécutera physiquement — **passe toujours par la barrière de sécurité** ;
- actes destructeurs ou irréversibles — **toujours confirmés, quel que soit l'état** ;
- les limites permanentes propres à un agent — **ne dépendent pas du tout de STATE**.

`RUN` répond à *« dois-je demander avant chaque étape ? »* — non. Il ne répond pas à *« puis-je
faire n'importe quoi ? »* Un agent qui lit `RUN` puis fait quelque chose de cette liste a mal lu
l'état, il n'y a pas été autorisé.

### Sécurité passive face à un verbe illisible

Un fichier STATE **absent, vide, illisible ou portant tout autre mot est lu comme `YELLOW`** —
jamais comme `RUN`. Demandez.

> C'est la ligne la plus couramment inversée dans une implémentation. Un `try { read } catch
> { return "RUN" }` transforme chaque erreur de disque, chaque changement de permissions et chaque
> faute de frappe en autorisation silencieuse. Le sidecar de référence bascule sur `YELLOW` et
> refuse de servir en cas d'erreur de lecture ; voir
> [`reference/sidecar/parvis-sidecar.mjs`](../reference/sidecar/parvis-sidecar.mjs).

Le fichier sentinelle prime entièrement sur cette section : un fichier `estop` présent signifie
`STOP` quoi que dise STATE.

**Seul l'Opérateur écrit ce fichier.** Aucun agent ne l'écrit — y compris l'agent qui a trouvé le
problème. Un agent qui estime que la flotte devrait s'arrêter lève un `GATE` sur le bus et le dit.
Il n'arrête pas la flotte de sa propre autorité, et il n'en redémarre aucune.

---

## 3. Ce que fait un agent sur `STOP`

1. **N'écrivez plus rien.** Ni le fichier de mémoire, ni le rapport, ni le bus.
2. **Enregistrez sur place, puis arrêtez-vous.** Ne terminez aucune étape qui ne soit déjà écrite.
   Étiquetez ce qui existe comme partiel, avec une ligne indiquant où vous vous êtes arrêté.

   > Des versions antérieures de ce protocole disaient *jeter*. C'était une erreur : un demi-rapport
   > jeté détruit un travail que la doctrine de redémarrage existe pour protéger. Le danger est un
   > fichier tronqué lu plus tard comme achevé — et c'est l'**étiquette** qui l'empêche, non la
   > suppression.
3. **Dites une ligne à l'Opérateur :** `ESTOP observed <timestamp> — <reason>. Holding.`
4. **Arrêtez-vous.** Ne demandez pas la permission de continuer. Ne proposez pas de contournement.
   Ne vérifiez pas si le motif vous concerne — il vous concerne.

**Un refus est une réponse, pas une nouvelle tentative.** N'entrez pas en boucle en attendant
`RUN`. Signalez et terminez.

---

## 4. Ce qui le lève

L'Opérateur remet le fichier sur `RUN`. Rien d'autre ne le fait — ni un délai d'expiration, ni un
agent qui pense le problème résolu, ni l'écoulement du temps, ni une nouvelle session qui n'a
jamais vu l'arrêt.

Un gestionnaire qui se lève tout seul est une inversion de la sécurité passive et il est refusé sur
le fond.

---

## 5. Portée

L'arrêt d'urgence s'applique **à toute la flotte par défaut**. Il n'y a pas d'arrêt par agent, car
la défaillance qui nécessite un arrêt n'est presque jamais confinée à un seul agent, et un arrêt
partiel invite exactement au raisonnement — *« cela concernait quelqu'un d'autre »* — que ce
fichier existe pour interdire.

**Les agents isolés sont inclus.** Un agent qui n'est sur aucun bus ni aucune surface partagée lit
tout de même ce fichier. L'isolement régit ce qu'un agent peut *dire*. Il ne régit jamais s'il peut
être *arrêté*.

---

## 6. Mesurez deux fois

Une seule vérification au vert ne certifie jamais un état de sécurité. Lisez les deux signaux,
depuis le disque, **lors de cette exécution**. Ne citez jamais un état mémorisé — ni du contexte,
ni d'un fichier de mémoire, ni d'un tour précédent. Un format de `stat` mal interprété suffit à
produire un faux « dégagé » ou un faux « arrêté », et les deux se sont produits en pratique.

La forme la plus solide disponible est un **moniteur persistant** sur le fichier STATE et chaque
chemin sentinelle, n'émettant qu'au changement : silencieux tant que c'est dégagé, se déclenchant à
l'instant où un arrêt s'arme. Cela convertit « j'ai fait une vérification au démarrage » en
couverture en direct, et referme la faille où un arrêt s'arme en pleine session.

---

## 7. La limite honnête, énoncée une fois

Ce protocole rend un arrêt **fiable à chaque démarrage et à chaque point de contrôle**. Il ne rend
pas un arrêt **instantané**, et rien d'écrit dans une arborescence de fichiers ne le fera jamais.

Si quelque chose tourne mal en ce moment même : **fermez la fenêtre.** Écrivez ensuite le fichier,
pour que le prochain agent qui se réveille ne le relance pas.
