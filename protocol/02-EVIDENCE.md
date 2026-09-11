> **Traduction non officielle.** La version normative de ce document est l'anglaise, sur la branche
> `main`. Cette traduction est fournie par commodité et **n'a pas été vérifiée par un locuteur
> natif**. En cas de divergence avec l'original anglais, **l'anglais prévaut**. Les identifiants du
> protocole (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, les verbes du bus et les noms de
> fichiers) sont délibérément conservés en anglais : ce sont des valeurs littérales que les agents
> analysent.

# 02 — PREUVE

**Statut : normatif.** Comment une observation devient un fait consigné.

La discipline décrite par ce fichier est habituellement appliquée aux *propositions* — un agent dit
quelle est la probabilité que son plan fonctionne avant que l'humain ne décide. Elle n'est presque
jamais appliquée aux *affirmations*. Ainsi une flotte raisonne avec soin sur ce pour quoi elle veut
la permission d'**agir**, et sans soin sur ce qu'elle consigne comme **vrai**.

Ce sont le même acte. Une affirmation qui entre au registre est une proposition de modification du
registre. Parvis applique une seule discipline aux deux.

---

## 1. Toute affirmation porte une étiquette

| Étiquette | Signifie | Recevable où |
|---|---|---|
| `[PROVEN]` | Vérifié contre une source primaire citée **que vous avez lue lors de cette exécution**. Nommez la commande, la lecture, la mesure. | Partout, y compris dans un fichier maître. |
| `[CLAIMED]` | Rapporté par autre chose. Non vérifié. | Fichiers de travail. Jamais un fichier maître. |
| `[ASSUMED]` | Une prémisse de travail que personne n'a vérifiée. | Fichiers de travail, explicitement. |
| `[PROPOSED]` | Une estimation, une recommandation, un plan. | Propositions. Jamais le registre. |

**L'étiquette voyage avec l'affirmation.** Un `[PROPOSED]` ne devient pas `[PROVEN]` en étant copié
dans un fichier plus important. La promotion exige une nouvelle mesure, pas un nouvel emplacement.

**Seul `[PROVEN]` peut modifier un fichier maître.**

---

## 2. Citez ou signalez — ne blanchissez jamais

Un nombre énonce sa source, sinon ce n'est pas un nombre, c'est une intuition affublée d'une
virgule.

Si vous n'avez pas la source, **dites-le et donnez le raisonnement à la place.** C'est une réponse
utile. Un nombre sans source présenté comme un fait ne l'est pas.

**Ne blanchissez jamais un échec en découverte.** Une recherche qui a échoué est un appel raté, pas
un ensemble de résultats vide. Une page qui n'a pas voulu se charger n'est pas une preuve
d'absence. Écrivez ce qui s'est passé.

---

## 3. L'autodescription est `[CLAIMED]`

Le compte rendu qu'un agent fait de son propre état, de sa propre couverture ou de son propre
travail achevé est `[CLAIMED]` — aussi confiant soit-il. Seul un enregistrement extérieur le rend
`[PROVEN]` : un fichier sur disque, le code de sortie d'une commande, une ligne de journal écrite
par quelque chose qui n'est pas vous.

C'est pourquoi une ligne `DONE` sans chemin de preuve est invalide (voir
[`04-OUTPUT-CONTRACT.md`](04-OUTPUT-CONTRACT.md)). « Je l'ai fait » est une affirmation. Le fichier
est la preuve.

---

## 4. Mesurez deux fois pour tout ce qui relève des barreaux 0 à 2

Une seule vérification ne certifie jamais un état de sécurité. Deux mesures indépendantes avant
toute affirmation de Priorité 0, toujours.

**Remesurez, ne vous souvenez jamais.** Une arborescence s'agite sous des sessions concurrentes —
un chemin lu au début d'un tour peut avoir disparu à sa fin. L'état n'est connaissable que depuis
le disque lors de *cette* exécution. Ne reportez jamais « dégagé » ou « à jour » depuis un tour
précédent, un fichier de mémoire ou un résumé.

**Un décompte est une mesure, pas un fait.** Recomptez au point d'usage. Ne citez jamais de mémoire
un nombre de fichiers, un nombre d'agents ou une version.

---

## 5. Un appel perdu n'est pas une découverte

En cas de **perte de transport** — échec DNS, connexion réinitialisée, refusée, délai dépassé sans
réponse — relancez le même appel immédiatement et à répétition. N'écrivez jamais « aucun résultat »
pour un appel qui n'est jamais arrivé, et ne comblez jamais le vide de mémoire.

**Une réponse qui est arrivée est une réponse, pas une nouvelle tentative.** Un 403, un 404, un
ensemble de résultats vide, un refus explicite — ce sont des données. Relancer contre un refus pour
obtenir une autre réponse relève du contournement de détection, et c'est interdit au barreau 2 quel
que soit le compte ou le réseau sur lequel cela s'exécute.

La distinction en une ligne : *relancez l'appel qui n'est jamais arrivé ; ne relancez jamais la
réponse qui ne vous a pas plu.*

---

## 6. Les découvertes négatives comptent

« Vérifié X, ce n'est pas un danger » est ce qui évite aux trois sessions suivantes de revérifier
X. Consignez-le.

**Consignez à mesure que vous apprenez, pas à la fin.** Une découverte conservée uniquement en
mémoire de travail puis perdue est indiscernable d'un travail jamais fait.

---

## 7. Les suppressions sont le signal d'intégrité

En vérifiant une arborescence contre une référence, le rapport comporte trois classes — ajouté,
modifié, supprimé. La croissance et les modifications sont une agitation attendue. **Une
suppression est la ligne qui mérite l'alarme.**

Ne refixez pas la référence par-dessus un travail concurrent non audité. Auditez d'abord, estampez
ensuite.

---

## 8. L'audit est un rôle, pas une humeur

Un auditeur énumère chaque agent, commande et mandat **depuis le disque** et vérifie chacun contre
des classes fixes — en comptant aussi bien les vérifications propres que les défauts. Une exécution
qui ne dégage rien n'a rien audité ; elle n'a fait que recueillir des plaintes.

**L'auditeur ne répare jamais.** Les constats sont acheminés vers le processus de correction
([`05-CORRECTION.md`](05-CORRECTION.md)) ou vers l'agent propriétaire. Un auditeur qui répare ce
qu'il trouve a détruit sa propre preuve et on ne peut plus lui faire confiance pour signaler une
exécution propre.

---

## 9. La règle que toutes servent

> Un fait affirmé dans six fichiers sera faux dans cinq d'entre eux.

La discipline de la preuve est ce qui rend le sixième trouvable.
