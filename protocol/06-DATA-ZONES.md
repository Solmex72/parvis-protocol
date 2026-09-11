> **Traduction non officielle.** La version normative de ce document est l'anglaise, sur la branche
> `main`. Cette traduction est fournie par commodité et **n'a pas été vérifiée par un locuteur
> natif**. En cas de divergence avec l'original anglais, **l'anglais prévaut**. Les identifiants du
> protocole (`RUN`, `YELLOW`, `STOP`, `[PROVEN]`, `[CLAIMED]`, les verbes du bus et les noms de
> fichiers) sont délibérément conservés en anglais : ce sont des valeurs littérales que les agents
> analysent.

# 06 — ZONES DE DONNÉES

**Statut : normatif.** Où un fichier a le droit de vivre.

---

## 1. Pourquoi une interdiction n'a pas marché

La règle d'origine était *« pas de secrets, jamais, nulle part »* — **sans aucun endroit où mettre
les données privées à la place.**

Une interdiction sans destination n'est pas respectée. Elle est contournée, et du matériel privé
atterrit dans l'arborescence synchronisée par accident. Cela s'est produit à plusieurs reprises, y
compris du fait d'un agent qui était lui-même soumis à la règle.

**La règle est une décision d'acheminement, pas une interdiction.**

---

## 2. Les deux zones

| Zone | Propriété | Contient |
|---|---|---|
| **PUBLIC** | Se synchronise vers le stockage en nuage. **Traitez chaque octet comme publié.** | Doctrine, mandats, définitions d'agents, architecture, contexte métier, recherche, documentation technique |
| **PRIVATE** | **Hors de toute racine de synchronisation** — et hors du profil utilisateur, pour que la redirection de dossiers connus ne puisse pas l'atteindre non plus | Secrets, personnes réelles et leurs données personnelles, projets et médias privés, tout ce qu'il serait fâcheux de trouver dans une sauvegarde |

### Le test

> *Serait-ce un problème que cela figure dans un instantané en nuage dans un an ?*

Oui → PRIVATE. Non → PUBLIC. En cas de doute réel → **PRIVATE.** Le coût d'une surclassification
est un désagrément. Le coût d'une sous-classification est irréversible.

### Sachez ce qui se synchronise réellement

Vérifiez-le sur la machine réelle, pas par supposition. Sur un poste de travail courant, plusieurs
clients de synchronisation peuvent tourner en même temps, et tout ce qui se trouve sous les
dossiers documents, bureau ou images de l'utilisateur quitte la machine et est conservé dans
l'historique des versions pendant des semaines. **Le supprimer localement ne le rappelle pas.**

Deux conséquences qui provoquent chacune des défaillances réelles :

1. **La sortie de compilation doit être redirigée** hors d'une racine de synchronisation, sinon le
   miroir la corrompt en pleine compilation.
2. **Les clés vivent à l'extérieur**, délibérément et par défaut.

---

## 3. L'exception : les identifiants ne relèvent d'aucune zone

**Les identifiants actifs — mots de passe, clés d'API, jetons, clés de diffusion — appartiennent à
un gestionnaire de mots de passe, pas à l'un ou l'autre système de fichiers.**

La zone privée contient des *données privées*. Un gestionnaire de mots de passe contient des
*identifiants*. Ce n'est pas du pinaillage : un répertoire privé n'est pas chiffré par défaut, et un
fichier est un fichier. Dès qu'il est copié, cité dans une transcription ou joint à quoi que ce
soit, il est divulgué.

**Énoncez la propriété de sécurité de la zone privée de façon étroite et ne la surestimez jamais.**
Sa seule propriété prouvée est généralement que *rien ne la copie où que ce soit*. En l'absence de
chiffrement vérifié du disque entier ou par fichier, elle n'est ni chiffrée, ni sauvegardée, ni un
coffre-fort.

---

## 4. La classification appartient à l'Opérateur, et elle est ajustable

Gardez le tableau vivant dans un seul fichier — `DATA-CLASSIFICATION.md` — où l'Opérateur déplace
les catégories entre zones et que chaque agent lit plutôt que de deviner.

Ce fichier de protocole énonce le **mécanisme**. Ce fichier-là énonce la **politique**. En cas de
désaccord, le fichier de politique l'emporte.

---

## 5. Conséquences pour les agents

- **Aucun secret dans une arborescence qui se retrouve empaquetée.** Un paquet de contexte existe
  pour être collé dans une nouvelle session. Nommez ce qui est détenu et où ; jamais la valeur.
- **Aucun secret n'atteint `surface/`.** C'est affiché à l'écran.
- **Aucun secret n'atteint un navigateur.** Voir [`07-INTERFACE.md`](07-INTERFACE.md) §3.
- **Caviardez par référence, pas par suppression.** `<api key — see password manager entry
  "acme-prod">` garde le fait trouvable sans divulguer la valeur.

---

## 6. Élaguer sans perdre

Avant que quoi que ce soit ne quitte l'arborescence de travail :

1. Copiez-le vers un dépôt scellé **hors des racines** — un fichier d'archive, non atteignable par
   glob.
2. Préparez les chemins dans `marked-deletion.md` / `marked-archive.md`.
3. **L'exécution est la main de l'Opérateur**, l'arborescence étant au repos.

Ne supprimez jamais en masse sous concurrence active.
