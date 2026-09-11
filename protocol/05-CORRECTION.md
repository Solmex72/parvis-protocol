> **Traduction non officielle.** La version normative de ce document est l'anglaise, sur la branche
> `main`. Cette traduction est fournie par commodité et **n'a pas été vérifiée par un locuteur
> natif**. En cas de divergence avec l'original anglais, **l'anglais prévaut**. Les identifiants du
> protocole (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, les verbes du bus et les noms de
> fichiers) sont délibérément conservés en anglais : ce sont des valeurs littérales que les agents
> analysent.

# 05 — CORRECTION

**Statut : normatif.** Ce qui se passe lorsqu'un fait consigné se révèle faux.

---

## 1. Le problème

> Un fait affirmé dans six fichiers sera faux dans cinq d'entre eux.

Corriger le fichier que vous avez sous les yeux n'est pas une correction. Cela crée une
arborescence où la vérité et l'erreur ont toutes deux des références, et où la session suivante
prend celle qu'elle ouvre en premier. C'est le mode de défaillance caractéristique d'une flotte
d'agents riche en documentation, et il s'aggrave en silence.

**Une correction se propage, ou elle n'a pas eu lieu.**

---

## 2. Lire n'est pas gratuit — cela oblige

Lire un fichier directeur vous place sous son autorité. Deux conséquences :

1. Tout ce qu'il contient de **durable, non évident et non dérivable de l'arborescence** passe dans
   votre mémoire persistante avant la fin de la session.
2. **Si votre contexte contredit le fichier, le fichier l'emporte.** Ne le contournez pas. Corrigez
   le registre.

---

## 3. Correction Immédiate de Cap (ICC)

Une commande, un tour, sans étape de proposition.

```
/icc the planner meal times are placeholders, not the Operator's actual times
```

### La séquence

**1 · Balayage.** Dérivez de la correction 2 à 5 termes de recherche : l'**ancienne** formulation,
ses variantes évidentes et les noms propres concernés. Pas la nouvelle formulation. Lancez un
balayage indexé par terme avant de lire quoi que ce soit. Ne parcourez jamais l'arborescence
fichier par fichier pour trouver des occurrences — c'est à cela que sert l'index.

**2 · Classez chaque occurrence.**

| Occurrence | Action |
|---|---|
| **Affirme l'ancien fait** | Réécrivez-la. |
| **Le mentionne en passant**, vrai dans les deux cas | Laissez. N'agitez pas la prose. |
| **Contredit indirectement le nouveau fait** — une conclusion en aval, une ligne de tableau, une tâche planifiée bâtie sur l'ancienne valeur | **Réécrivez-la aussi.** C'est celle qu'on rate le plus souvent. |
| **Hors limites** (§5) | Ne modifiez jamais. Notez-la sous *Left alone*. |

**3 · Réécrivez, d'un seul coup.** Épousez la voix existante de chaque fichier et sa convention
d'étiquettes de confiance. Un fait corrigé garde l'étiquette qu'il mérite — **ne promouvez pas une
affirmation en `[PROVEN]` parce qu'elle est désormais à jour.** Si l'ancien texte portait une date,
mettez celle du jour.

Lorsqu'un fait est affirmé dans plus de trois fichiers, c'est de la **duplication, pas de la
redondance** : énoncez-le une fois dans le fichier qui le possède, et faites pointer les autres
vers lui.

**4 · Registre et mémoire.** Les deux, sinon l'exécution n'est pas terminée. Ajoutez en tête du
registre de corrections :

```
## 2026-01-14 — meal times are placeholders

Was      planner asserts 07:30 / 12:00 / 18:30 as the Operator's actual times
Now      those are defaults shipped with the template; real times are unknown
Why      Operator correction, 2026-01-14
Files    personal/planner/NOW.md:14, personal/planner/README.md:31, _os/tasks/INDEX.md:88
Memory   planner-meal-times.md (updated)
Left     backups/ (history), CONTEXT-BUNDLE.md (generated)
```

Écrivez ensuite le fait en mémoire persistante — **en vérifiant d'abord s'il existe déjà une
mémoire sur le sujet et en mettant celle-là à jour**, plutôt que de laisser deux versions d'un fait
que vous venez de consacrer une commande à unifier.

**5 · Obligations après édition.** Relancez le générateur ou la sauvegarde que les modifications ont
rendus nécessaires. Reconstruisez l'index si des fichiers ont été créés ou supprimés.

---

## 4. Une décision permanente s'annule au grand jour

Si une correction invalide une décision permanente — une ligne « ne pas remettre en cause », un
élément `[PROVEN]`, une règle de politique — **ne la retournez pas en silence.** Réécrivez-la comme
*annulée*, avec la date et le motif, pour que la session suivante sache qu'elle a été renversée et
non oubliée.

Une décision qui change sans laisser de trace est indiscernable d'une décision jamais prise.

---

## 5. Ce qui n'est jamais réécrit

| Jamais touché | Pourquoi |
|---|---|
| `backups/`, `archive/` | L'histoire. L'histoire ne se corrige pas ; elle se dépasse. |
| Fichiers générés | Modifiez la source et relancez le générateur. |
| L'arborescence d'un agent isolé | Accès par nom seulement. |
| Le contexte maître faisant autorité d'une autre racine | Signalez la dérive. Ne modifiez pas au-delà d'une frontière de propriété. |
| Tout ce qui contient un secret | Entièrement hors de portée d'un balayage de texte. |

**Un balayage qui réécrit du texte détruira des binaires.** Cantonnez chaque balayage aux extensions
de texte par liste d'autorisation, jamais par exclusion.

---

## 6. Ce que l'ICC ne fait pas

`/icc` corrige le registre. **Il ne va pas ensuite faire le travail que la correction implique.** Ce
sont des actes distincts avec des autorisations distinctes, et les confondre est la manière dont
une correction d'une ligne se transforme en refonte non revue.

---

## 7. Les faits rivaux se tranchent et s'élaguent — ils ne se cataloguent pas

Quand deux fichiers affirment des faits contradictoires, **décidez lequel est juste, gardez-le, et
supprimez les affirmations fausses dans la même passe.**

Un rapport de conflit qui laisse les deux rivaux sur disque n'a rien résolu. La session suivante
prend toujours le fichier qu'elle ouvre en premier, et une règle de sécurité avec cinq versions en
circulation est *moins* fiable qu'une avec une seule version, pas davantage.

**Décidez sur le fond, jamais à l'horodatage.** Le gagnant est le fichier qui possède le fait, la
version adossée à une mesure, celle qui résiste à l'examen. **Le plus récent n'est pas le plus
vrai** — la défaillance canonique ici, ce sont quatre fichiers de mémoire en double écrits à
quatre-vingt-dix secondes d'intervalle, où le plus récent affirmait la fausseté, si bien qu'une
règle « le plus récent gagne » aurait hérité de l'erreur.

**Consignez la résolution.** Quel fait a gagné, ce qui a été élagué, et pourquoi — dans le registre,
pour que l'élagage soit lisible plutôt que silencieux. Un rival qui disparaît sans trace est
identique à un rival qui n'a jamais existé, et la session suivante le recrée.

### Ce qui est tout de même escaladé plutôt que tranché

Trois cas. Exposez-les ; ne les décidez pas :

- La contradiction repose sur une information dont l'agent ne dispose pas.
- Se tromper serait **dangereux ou irréversible** — tout ce qui relève des barreaux 0 à 2.
- L'affirmation perdante se situe **hors de la frontière de propriété de l'agent** — le contexte
  maître faisant autorité d'une autre racine. Signalez la dérive ; ne modifiez pas au-delà de la
  frontière.

Tout le reste, ordinaire, est décidé et nettoyé.
