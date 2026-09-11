> **Traduction non officielle.** La version normative de ce document est l'anglaise, sur la branche
> `main`. Cette traduction est fournie par commodité et **n'a pas été vérifiée par un locuteur
> natif**. En cas de divergence avec l'original anglais, **l'anglais prévaut**. Les identifiants du
> protocole (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, les verbes du bus et les noms de
> fichiers) sont délibérément conservés en anglais : ce sont des valeurs littérales que les agents
> analysent.

# 09 — LE PLANCHER

**Statut : normatif pour le visualiseur ; informatif en tant que modèle.**
Implémenté par [`reference/sidecar/hmi.html`](../reference/sidecar/hmi.html).

---

## 1. L'affirmation

Une flotte d'agents est difficile à voir. Une arborescence de fichiers est une liste, une table de
processus est une liste, et un journal est une liste — de sorte que la seule image que l'on ait
d'une flotte en marche, ce sont plusieurs listes qui ne s'alignent pas.

**Un entrepôt automatisé est la même machine, et il est lisible depuis quarante ans.** Les ponts
roulants déplacent des charges entre les racks sous un système de contrôle, et la personne qui
supervise lit d'un coup d'œil un plancher de centaines de mouvements simultanés, par la couleur,
sans lire une seule ligne de texte.

Parvis emprunte cela. Non comme décoration — comme une *correspondance*, où chaque objet de
l'entrepôt correspond exactement à une chose de l'arborescence, et où les règles de sécurité propres
à l'entrepôt se révèlent être celles du protocole, déjà dessinées au bon endroit.

---

## 2. La correspondance

| Sur le plancher | Dans la flotte | Lu depuis |
|---|---|---|
| **Pont roulant** | un agent, ou une session vivante | les marqueurs de session dans `_os/exchange/bus/session/` |
| **Palette** | un répertoire | l'arborescence elle-même ; l'étiquette de la palette est son chemin |
| **Emplacement en rack** | où vit ce répertoire | son parent |
| **Ouvrir une palette** | descendre dans le répertoire | **un autre entrepôt entier** — §4 |
| **Induct** (quai d'entrée) | le travail qui arrive | une ligne `REQ` dans `_os/tasks/INDEX.md` |
| **Spur** (quai de sortie) | un livrable qui part | un fichier dans `_os/events/surface/`, un export |
| **Convoyeur** | le bus de fichiers | `_os/exchange/bus/` — comment le travail se déplace sans qu'un pont le porte |
| **Camion** | un service externe ou une autre IA | la frontière. §5 |

L'essentiel n'est pas l'image. L'essentiel est que **vous savez déjà lire cet écran** si vous vous
êtes un jour tenu devant un système de contrôle d'entrepôt — et sinon, le modèle reste concret
d'une manière qu'un listage de répertoire n'est pas.

---

## 3. Les couleurs

Un coup d'œil, avant toute navigation :

| Couleur | Sur le plancher | Dans la flotte |
|---|---|---|
| **VERT** | en mouvement — un pont porte une charge | un agent travaille ; une session vivante en pleine tâche |
| **BLEU** | planifié — en file, pas encore commencé | une annonce au tableau : commandée, en attente d'un agent |
| **AMBRE** | attention — un emplacement demande une décision | `YELLOW` : demander avant chaque action |
| **ROUGE** | arrêt d'urgence — cette zone est stoppée | `STOP` : l'arrêt est armé et cette racine est gelée |
| **GRIS** | vide, ou aucune source en direct | aucune donnée. Jamais une supposition. |

Ce n'est pas un nouveau schéma. C'est l'état que l'arborescence contient déjà, rendu visible.

**Le rouge gagne toujours le coup d'œil.** Une seule zone rouge arrête l'œil avant tout vert,
exactement comme l'arrêt prime sur tout autre signal ([`01`](01-ESTOP.md)). **Un plancher qui
affiche du vert par-dessus une zone rouge ment** — et c'est la défaillance précise que cette règle
existe pour interdire.

**Le gris est obligatoire là où il n'y a pas de source en direct.** Un emplacement sans données est
rendu en gris et affiche `—`. Il n'est jamais rendu en vert, car le vert est la valeur par défaut
agréable ([`07`](07-INTERFACE.md) §2.2).

---

## 4. L'entrepôt imbriqué

**Ouvrez une palette et vous ne regardez pas une boîte. Vous regardez un autre entrepôt entier** —
avec ses propres ponts, ses propres palettes, ses propres quais.

C'est exactement l'arborescence de fichiers. Un projet est un entrepôt ; ses départements sont des
allées ; leurs fichiers sont des palettes ; et une palette qui est elle-même un répertoire est un
autre plancher. Le visualiseur est donc **une seule vue qui descend**, avec les mêmes commandes à
chaque profondeur, parce que chaque niveau *est* un entrepôt. Il n'y a rien de nouveau à apprendre
en descendant.

La récursion est toute la raison pour laquelle la métaphore tient au lieu d'être un habillage. Un
tableau de bord qui ne rend que le niveau supérieur est une photo d'une flotte ; un qui descend en
est une vue.

---

## 5. Les camions accostent à la frontière — ils n'entrent jamais sur le plancher

C'est ici que le modèle cesse d'être une visualisation et se met à imposer quelque chose.

Un service externe — une autre IA, une API, un fournisseur — est un **camion**. Et dans un entrepôt
réel, un camion recule jusqu'à un quai. Il n'entre pas sur le plancher, ne déplace pas de pont,
n'entre pas dans un rack et n'ouvre pas d'entrepôt imbriqué. Il dépose une charge à un induct ou en
récupère une à un spur, et c'est là l'intégralité de son accès.

**Ce quai est le sas.** Tout échange externe a lieu en bordure, filtré, et rien d'externe ne se
retrouve en liberté dans l'arborescence.

**Les papiers d'un camion ne sont pas fiables tant qu'ils ne sont pas vérifiés.** Une charge arrivant
sur un camion est une *donnée* entrante, pas un ordre au plancher. Elle est induite et revue comme
n'importe quoi d'autre, jamais obéie à l'arrivée. C'est la frontière de source d'instruction de
[`03`](03-BUS.md) §5, dessinée comme un quai de chargement — et dessinée au seul endroit où
quelqu'un regardant l'écran peut la voir respectée.

Si votre rendu place un camion sur le plancher, le rendu est faux et l'architecture qu'il dessine
aussi.

---

## 6. Deux surfaces, deux métiers

| | **Le plancher** (ce fichier) | **La console** ([`07`](07-INTERFACE.md)) |
|---|---|---|
| Ce que c'est | un plancher 3D, vu en direct | un menu en tuiles, étagé par accès |
| Ce que ça montre | **comment le système est** — chaque agent, répertoire et état à la fois | **ce que vous pouvez faire** — choisir l'outil, faire le travail |
| Le verbe | regarder, comprendre, décider | exécuter, utiliser, produire |

**Le plancher montre comment la machine pense ; la console sert à agir sur ce que vous en
concluez.** L'un est une carte, l'autre un établi. Une surface de pilotage a besoin des deux, et
l'erreur est de ne construire que la jolie.

---

## 7. Commandes

La navigation est ce qui rendait l'original utilisable, pas la couleur seule :

| Commande | Fait |
|---|---|
| **Glisser** | orbiter autour du plancher — pivoter, incliner, regarder le long d'une allée |
| **Vue de dessus** | passer à un plan en surplomb. L'orbite pour la profondeur, le plan pour l'agencement |
| **Clic sur une palette** | y descendre — un autre entrepôt, mêmes commandes |
| **Molette** | zoom |

Les mêmes commandes à chaque profondeur. Non négociable : une vue dont l'interaction change à mesure
que l'on descend a rompu la promesse que chaque niveau est un entrepôt.

### La caméra est orthographique, à dessein

Il n'y a **aucune division perspective**. Les lignes parallèles ne convergent jamais, et un
emplacement au bout d'une allée est rendu exactement à la même taille qu'un emplacement à vos pieds.

Cela paraît faux un instant — l'œil attend la convergence et lit son absence comme s'il se tenait à
l'intérieur des caisses à regarder dehors. C'est malgré tout le bon compromis, et c'est ce
qu'utilisent les écrans de contrôle des planchers automatisés réels : **tout l'intérêt est de
comparer des emplacements d'un bout à l'autre du plancher d'un coup d'œil**, et une caméra
perspective rend le fond d'une allée plus petit, plus terne et plus difficile à juger que
l'extrémité proche. En perspective, « ce rack est plus plein » et « ce rack est plus proche » se
ressemblent. En caméra orthographique, non.

L'occlusion reste réelle — les faces qui se détournent sont éliminées et la géométrie la plus proche
peint par-dessus la plus lointaine. C'est une caméra plate, pas une scène plate.

L'équipement est également atteignable depuis un **menu latéral**, groupé par type — ponts, palettes,
les deux quais, le convoyeur, les camions. Sélectionner depuis le menu ou depuis le plancher ouvre
les mêmes commandes, car un plancher que l'on ne peut parcourir qu'en cliquant de petites boîtes
dans une scène 3D est une démonstration plutôt qu'un instrument.

---

## 8. Ce que le plancher peut et ne peut pas faire

Chaque contrainte de [`07`](07-INTERFACE.md) §5 s'applique. La ligne est tracée à un endroit précis :

**Le plancher peut induire. Il ne peut jamais exécuter.**

C'est la même ligne que [`07`](07-INTERFACE.md) §1 trace déjà pour la console, et c'est ce qui
permet à l'équipement d'avoir des commandes. Sélectionner un pont et lui adresser du travail écrit
une ligne `REQ` nommant cet agent et dépose un `TELL` dans sa boîte de réception. **Cela ne démarre
rien.** Aucun processus n'est lancé, aucune commande ne s'exécute, et l'agent prend le travail à sa
propre exécution suivante — ou non.

Deux conséquences faciles à manquer :

- **Un travail adressé n'est toujours pas un ordre.** La ligne `REQ` est le registre canonique ; la
  ligne de boîte de réception ne fait qu'y pointer. Un fichier qui *commanderait* un agent — ou qui
  revendiquerait l'autorité de l'Opérateur depuis l'intérieur de l'arborescence — serait l'incident
  de sécurité que définit [`03`](03-BUS.md) §5, et l'intégrer à la surface serait pire que de le
  faire à la main. L'autorité, c'est l'Opérateur en conversation. Le plancher écrit le registre, pas
  l'instruction.
- **Certains équipements n'ont délibérément aucune commande.** Le convoyeur est en lecture seule :
  une console capable d'écrire des lignes sur le bus fabriquerait une autorité que le protocole lui
  refuse. Les camions n'ont aucune commande du tout — §5.

**Sous `STOP`, le plancher est rendu en rouge et n'induit rien.** Un plancher rouge ne prend aucun
ordre.

La limite honnête, énoncée une fois : **ceci est une photo de l'arborescence à un instant, pas un
flux de télémétrie en direct.** Il interroge par intervalles. Entre deux interrogations il est
périmé, il indique quand il a lu pour la dernière fois, et il passe au gris plutôt que de prétendre
le contraire quand le sidecar cesse de répondre.
