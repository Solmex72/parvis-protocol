> **Traduction non officielle.** La version normative de ce document est l'anglaise, sur la branche
> `main`. Cette traduction est fournie par commodité et **n'a pas été vérifiée par un locuteur
> natif**. En cas de divergence avec l'original anglais, **l'anglais prévaut**. Les identifiants du
> protocole (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, les verbes du bus et les noms de
> fichiers) sont délibérément conservés en anglais : ce sont des valeurs littérales que les agents
> analysent.

# 04 — LE CONTRAT DE SORTIE

**Statut : normatif.** Où va le travail une fois terminé.

---

## 1. La règle

**Ne rendez pas compte au chat. Travaillez dans l'arborescence de fichiers, écrivez la sortie sur
disque, et exposez un pointeur.**

Un agent qui termine en écrivant une longue réponse dans une fenêtre de chat a placé sa sortie là
où rien d'autre dans la flotte ne peut la lire — aucun autre agent, aucun moniteur, aucune console,
aucune session suivante. Le fichier est le registre durable ; le chat est une transcription que
personne en aval ne voit.

---

## 2. Où va la sortie

| Type de sortie | Atterrit à |
|---|---|
| Produit de travail, constats, un rapport | le fichier propriétaire, ou `outbox/YYYYMMDD-HHMMSS-<slug>.md` |
| Tout ce que l'Opérateur doit voir maintenant | un court fichier pointeur dans `_os/events/surface/` |
| Une demande qui nécessite l'Opérateur | `_os/exchange/requests/REQ-<slug>.md` |
| La ligne du registre | `_os/tasks/INDEX.md` |

**Le répertoire `surface/` est la notification. Le fichier est la substance.** Écrivez la substance
à sa place propre, puis déposez un pointeur d'une ligne dans `surface/` pour que la console montre
à l'Opérateur où elle a atterri.

---

## 3. L'index des tâches

Une ligne par ordre. Ajoutez une ligne `REQ` **avant** de commencer, pour qu'une tâche interrompue
reste visible.

```
REQ     | 2026-01-14 | SCOUT | <the order, in the Operator's words where possible> | <status note>
DONE    | 2026-01-14 | SCOUT | <the order> | evidence: outbox/20260114-090312-lease-rates.md
BLOCKED | 2026-01-14 | SCOUT | <the order> | <what is blocking, one line>
REFUSED | 2026-01-14 | SCOUT | <the order> | <why, one line + where the reasoning lives>
```

**Une ligne `DONE` sans chemin de preuve est invalide.** S'il n'y a pas de fichier, le travail n'a
atterri nulle part où l'Opérateur puisse le voir. L'auto-rapport est `[CLAIMED]` ; le fichier est
ce qui le rend `[PROVEN]`.

**Un refus a sa place ici de façon permanente.** C'est ainsi que la flotte cesse de remettre en
cause des questions tranchées. Ne le supprimez pas plus tard.

**La limite honnête :** cet index n'observe rien. Il est exactement aussi complet que les agents qui
y écrivent. Une tâche absente n'est pas la preuve que la tâche n'a jamais eu lieu — seulement que
personne ne l'a consignée. Traitez une ligne comme *une affirmation accompagnée d'un chemin de
preuve*, jamais comme une preuve. Vérifiez que le fichier de preuve existe avant de vous fier à un
`DONE`.

---

## 4. L'achèvement, c'est que l'Opérateur le voie

Pas qu'un agent le déclare. Une réponse n'est pas un point d'arrêt : les moniteurs restent armés au
travers, le travail continue, puis vient une clôture délibérée.

---

## 5. La contre-règle qui prime sur l'acheminement

**L'arrêt d'urgence et la franchise vont toujours à l'humain, immédiatement et en évidence.**

Un échec est exposé avec la même évidence qu'un succès. Acheminer la sortie vers des fichiers ne
doit jamais devenir un endroit où enterrer un mauvais résultat. Si les bonnes nouvelles de la
flotte arrivent par chat et ses mauvaises nouvelles dans un fichier que personne n'ouvre, le
contrat a été inversé et la flotte ment désormais par acheminement.

---

## 6. La limite honnête du contrat lui-même

Un agent s'exécutant dans un harnais de chat rend tout de même du texte d'assistant dans ce chat —
ce contrat ne peut pas rediriger le harnais. Ce qu'il lie, c'est **ce qu'un agent choisit
d'écrire** : la substance dans des fichiers, et le texte du chat réduit à un court pointeur —
*« écrit dans `<path>`, exposé à la console »* — jamais le rapport complet.

---

## 7. Aucun secret n'atteint la surface

`surface/` est lu par une console et peut être affiché à l'écran, dans une capture ou sur une
fenêtre partagée. Les règles de zones de données ([`06-DATA-ZONES.md`](06-DATA-ZONES.md))
s'appliquent ici de plein droit.
