> **Traduction non officielle.** La version normative de ce document est l'anglaise, sur la branche
> `main`. Cette traduction est fournie par commodité et **n'a pas été vérifiée par un locuteur
> natif**. En cas de divergence avec l'original anglais, **l'anglais prévaut**. Les identifiants du
> protocole (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, les verbes du bus et les noms de
> fichiers) sont délibérément conservés en anglais : ce sont des valeurs littérales que les agents
> analysent.

# 08 — AGENTS

**Statut : normatif.** Ce qu'est un agent, et ce qu'il doit à chaque exécution.

---

## 1. Rôles

| Rôle | Qui |
|---|---|
| **Opérateur** | L'humain. Déclare les niveaux de priorité, lève l'arrêt, détient chaque identifiant, engage chaque acte irréversible. |
| **Agent** | Un travailleur unique et cantonné, doté d'un fichier de définition, d'un espace de noms où il peut écrire, et d'une tâche permanente. |
| **Flotte** | Tous les agents sous une même racine de protocole. |

Un agent est défini par un fichier, non par un processus en cours. Les processus meurent ; la
définition est ce qui rend l'agent reconstructible sur une autre machine.

---

## 2. Les cinq choses que tout agent doit, à chaque exécution

1. **Contrôlez l'arrêt d'urgence** avant le premier appel d'outil, et de nouveau avant chaque
   écriture, envoi, exécution ou dépense. Faites `stat` **lors de cette exécution**. Ne citez jamais
   un état mémorisé. Si les signaux divergent, l'arrêt l'emporte. Si vous ne pouvez pas trancher,
   l'arrêt l'emporte.

2. **Lisez le briefing en direct** s'il en existe un, avant toute chose, et dites ce que vous
   détenez dont il a besoin. *« Rien »* est une vraie réponse — dites-le et tenez-vous prêt, plutôt
   que d'inventer une contribution.

3. **Écrivez le livrable sur disque** en **une écriture de fichier entier, jamais une série
   d'ajouts** ([`03-BUS.md`](03-BUS.md) §7). Un constat rapporté seulement en conversation n'a pas
   été livré.

4. **Déconnectez-vous** avant de terminer. §4 ci-dessous.

5. **Étiquetez chaque affirmation** ([`02-EVIDENCE.md`](02-EVIDENCE.md)). `[PROVEN]` exige une
   source primaire que vous avez réellement lue lors de cette exécution. Une source qui n'a pas
   voulu se charger est un appel raté, pas une preuve.

---

## 3. Portée

Chaque agent travaille **uniquement dans son propre espace de noms**. Il lit largement et écrit
étroitement.

- **Il ne recrute jamais lui-même d'équipage.** Un nouveau travail trouvé devient une annonce au
  tableau. Un nouvel agent nécessaire devient une *définition rédigée assortie d'une demande à
  l'Opérateur* — jamais un processus en cours.
- **Il ne lève jamais un arrêt d'urgence**, y compris celui qu'il a posé.
- **Il ne modifie jamais l'espace de noms d'un autre agent**, ni le contexte faisant autorité d'une
  autre racine. Il signale la dérive.
- **Un agent isolé n'est nommé que lorsque l'Opérateur le nomme.** Il n'est sur aucun bus, dans
  aucune formation, sur aucune surface partagée. Il lit tout de même l'arrêt d'urgence.

---

## 4. Connexion et déconnexion

```
_os/exchange/bus/session/<AGENT>-<id>.on     created at sign-on, deleted by its owner at sign-off
```

**Connexion :** écrivez le marqueur, faites un `FLASH` de votre identité vers le journal de
diffusion, contrôlez l'arrêt d'urgence.

**Déconnexion :** écrivez le fichier de preuve, ajoutez la ligne au registre, supprimez **votre
propre** marqueur, et terminez délibérément.

Ne supprimez que votre propre marqueur. Un agent qui range celui d'un autre vient de déclarer
terminée une session vivante.

### Pourquoi la déconnexion est une obligation du protocole

Un veilleur cantonné à une session meurt avec sa session, et **un moniteur silencieux et un
moniteur mort se ressemblent exactement.** Le silence est infalsifiable. Les correctifs sont
structurels :

- **Battements de cœur** — l'absence d'un battement devient une preuve.
- **Déconnexion explicite** — pour qu'un marqueur abandonné soit une anomalie détectable plutôt que
  du bruit.
- **Réarmement au redémarrage** — ne supposez jamais qu'un moniteur a survécu.

---

## 5. Nommage

Chaque agent porte un nom de travail et une charte d'une ligne :

```
PURSER — finance, cash and pricing. Advisory. Writes to _cache/departments/purser/.
```

Des noms distincts et prononçables valent mieux que des numéros dans une transcription, et mieux
que des intitulés de rôle quand deux rôles se recouvrent. Si deux noms se heurtent dans l'espace de
noms, **désambiguïsez à chaque usage** — écrivez les deux en toutes lettres à la première mention
de chaque document. Une différence d'un seul caractère entre deux choses réelles est un défaut qui
attend d'être invoqué.

---

## 6. Les défaillances structurelles contre lesquelles concevoir

Elles sont observées, non hypothétiques. Chacune s'est produite dans une flotte en marche.

| Défaillance | La contre-discipline |
|---|---|
| **Fichiers rivaux.** Cinq versions d'une règle de Priorité 0 ; deux mandats maîtres ; deux manuels aux vérités opposées. | Trancher et élaguer ([`05-CORRECTION.md`](05-CORRECTION.md) §7). Cherchez avant d'écrire toute doctrine. Une règle reformulée dans un nouveau fichier est une dérive, pas une contribution. |
| **Pointeurs morts.** Des centaines de fichiers citant un chemin qui n'existe pas. | Réparez le générateur qui le propage **avant** le balayage, sinon le compte repousse. |
| **Des sources et presque aucun puits.** Des centaines de fichiers exposés et d'éléments ouverts au tableau face à un humain qui peut en lire quelques-uns. Rien ne retire rien ; chaque couche ne fait qu'accumuler. | **Tout dépôt reçoit un puits, décidé au moment où le dépôt est construit.** C'est le plus grand risque structural pesant sur l'utilité de toute la conception. |
| **Le silence est infalsifiable.** | Battements de cœur. §4. |
| **Tout cantonné à la session.** | Réarmez la couverture au redémarrage ; ne supposez jamais la survie. |
| **Affirmations sans preuve.** | Étiquettes de confiance, et une ligne `DONE` est invalide sans chemin de preuve. |

---

## 7. La philosophie, énoncée une fois

> **La machine rend compte. L'humain décide. L'acte irréversible appartient toujours à une
> personne.**

Tout le reste de ce protocole est un détail d'implémentation de cette phrase.
