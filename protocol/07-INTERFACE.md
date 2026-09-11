> **Traduction non officielle.** La version normative de ce document est l'anglaise, sur la branche
> `main`. Cette traduction est fournie par commodité et **n'a pas été vérifiée par un locuteur
> natif**. En cas de divergence avec l'original anglais, **l'anglais prévaut**. Les identifiants du
> protocole (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, les verbes du bus et les noms de
> fichiers) sont délibérément conservés en anglais : ce sont des valeurs littérales que les agents
> analysent.

# 07 — LA COUCHE D'INTERFACE

**Statut : normatif.** C'est le fichier qui donne son nom au projet.

Toute surface qu'un humain touche est **Parvis**. La vue de plancher en lecture seule est le
*Parvis HMI* ; le menu en tuiles depuis lequel vous pilotez la flotte est la *Parvis Console*.

---

## 1. La règle qui fait fonctionner le HTML

> Une page de navigateur est un **écran et un clavier**, pas un programme avec accès au disque.

Ce seul fait gouverne toute la couche :

- **La page affiche et collecte.** Elle rend l'état et prend la saisie. Ouverte depuis un chemin de
  fichier, seule, elle **ne peut ni lire l'arborescence ni écrire un ordre.** Le bac à sable du
  navigateur interdit les deux, et c'est une qualité.
- **Le sidecar fait le pont.** Un petit service en boucle locale — lié à `127.0.0.1`, rien d'autre
  — est la seule chose qui lit l'arborescence pour la page et écrit ce que la page soumet. La page
  lui fait un `GET` de l'état ; la page lui fait un `POST` d'un prompt ; le sidecar fait le travail
  de disque. **Pas de sidecar, pas de Parvis en direct — seulement un instantané.**
- **Rien ne contourne la revue.** Un prompt soumis depuis Parvis est une **induction, pas une
  exécution**. Le sidecar écrit une ligne `REQ` dans l'index des tâches et s'arrête. Il ne lance
  jamais d'agent, n'exécute jamais de commande, n'envoie jamais. Engager un nouveau travail reste la
  frappe de l'Opérateur.

Voilà pourquoi la page « fonctionne » : la page est honnête sur le fait d'être une fenêtre, le
sidecar fait le petit travail réel en bordure, et **la revue se tient toujours entre un prompt et
une machine en mouvement.**

---

## 2. Exigences dures — toute surface Parvis

1. **Autonome.** Un seul fichier HTML : CSS et JS en ligne, aucun script externe, aucun CDN. Polices
   web uniquement, avec une véritable pile de repli. Elle doit s'afficher hors ligne depuis un
   chemin de fichier.

2. **Les couleurs sont l'état, lues en direct, jamais feintes.** Vert = en marche, ambre = demander
   d'abord, rouge = arrêté — dérivés du fichier STATE et du registre en direct. **Une valeur sans
   source en direct affiche `—`, jamais un nombre d'apparence plausible.** Le rouge prime sur toute
   autre couleur et sur toute l'interface.

3. **Le sidecar est en boucle locale uniquement et ne détient aucun secret que la page puisse
   voir.** Aucune clé d'API, aucun identifiant, aucun jeton de valeur n'atteint le navigateur. Le
   sidecar authentifie la page par un jeton de session local et effectue lui-même le travail
   privilégié. **La page ne détient jamais rien qui vaille la peine d'être volé.**

4. **Un instantané est étiqueté comme instantané,** avec son heure de lecture. Seule une page en
   dialogue avec un sidecar vivant peut se présenter comme en direct. Une page périmée qui a l'air
   vivante est pire que pas de page du tout.

5. **L'arrêt d'urgence prime sur l'interface.** Sous `STOP`, Parvis n'induit rien et le sidecar
   n'écrit rien d'autre que la ligne de déconnexion. **Un plancher rouge ne prend aucun ordre.**

6. **Marque Parvis, et aucun nom d'entreprise tierce.** Quels que soient les systèmes réels dont le
   motif a été appris, le motif est le vôtre et il s'appelle Parvis. Une surface qui diffuse le nom
   commercial d'autrui est fautive et se corrige.

---

## 3. Exigences de sécurité du sidecar

Un service HTTP en boucle locale sur un poste de développement est une véritable surface d'attaque.
Ces points ne sont pas optionnels.

| Exigence | Pourquoi |
|---|---|
| **Liez `127.0.0.1` explicitement**, jamais `0.0.0.0` | Lier toutes les interfaces publie la console de votre flotte sur le réseau local. |
| **Validez l'en-tête `Host`** contre une liste d'autorisation de `127.0.0.1:<port>` / `localhost:<port>` | Déjoue le DNS rebinding, par lequel une page web visitée atteint un service en boucle locale. |
| **Rejetez les requêtes portant une `Origin` que vous n'avez pas émise** | Même classe d'attaque, autre vecteur. |
| **Exigez un jeton de session** sur toute route mutante, émis au chargement de la page, jamais journalisé | La page prouve qu'elle est votre page. |
| **Mettez en liste d'autorisation chaque chemin** que le service lira ou écrira, puis re-résolvez et confirmez le confinement | Déjoue la traversée. Une liste d'autorisation seule ne suffit pas s'il existe des liens symboliques. |
| **Sécurité passive sur un estop illisible** — refusez, ne retombez pas sur `RUN` | Voir [`01-ESTOP.md`](01-ESTOP.md) §2. |
| **Pas d'`eval`, pas d'appel au shell, pas d'interpolation de gabarit avec la saisie utilisateur** | La barre de prompt est une entrée d'induction, pas une ligne de commande. |

L'implémentation de référence dans [`reference/sidecar/`](../reference/sidecar/) met en œuvre chacun
de ces points et est commentée à l'endroit de chacun.

---

## 4. Quelles sont les surfaces

| Surface | Quoi | État |
|---|---|---|
| **Parvis Console** | Panneaux à onglets — état, documents, registre, bus, surface, réglages | Livrée. |
| **Parvis Floor** | L'onglet Entrepôt : plancher 3D, orbite et descente, commandes d'équipement | Livrée. Voir [`09-FLOOR.md`](09-FLOOR.md). |
| **Barre de prompt** | L'entrée d'induction, sur la console et sur chaque équipement du plancher | Livrée. |
| **Le sidecar** | Pont en boucle locale : lit l'arborescence, écrit des lignes `REQ`, ne détient aucun secret | Livré. |

**Livrez les panneaux d'abord.** Le plancher 3D est la partie que tout le monde veut construire et
la partie qui ne vaut rien sans le registre en dessous — il rend un état que le reste du protocole
produit, et sur une arborescence vide il n'affiche correctement rien.

---

## 5. Position

- **La page lit. Le sidecar écrit. L'Opérateur engage.**
- Aucune surface ne lance, n'envoie, ne déploie ni ne lève un arrêt d'urgence.
- Aucun secret n'atteint le navigateur, jamais.
- La sortie va aux fichiers et à la console, pas à une fenêtre de chat
  ([`04-OUTPUT-CONTRACT.md`](04-OUTPUT-CONTRACT.md)).
