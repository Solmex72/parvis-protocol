# État de la traduction — Français (`lang/fr`)

> **English summary:** this branch is the Parvis Protocol with `protocol/` translated into French.
> The English text on `main` is normative. Files not listed as translated below are still English —
> this branch is a complete, working copy of the repository, not a partial one.

---

## Ce qu'est cette branche

Cette branche est le dépôt **complet** de Parvis Protocol, avec les fichiers indiqués ci-dessous
traduits en français. Rien n'a été retiré. Si un fichier n'est pas encore traduit, il figure ici
dans sa langue d'origine et reste pleinement utilisable.

**L'anglais de la branche `main` est la version normative.** Lorsque cette traduction et l'original
divergent, l'anglais prévaut. Cette traduction est assistée par machine et **n'a pas été vérifiée
par un locuteur natif**.

## Convention sur les identifiants du protocole

Les éléments suivants sont **délibérément conservés en anglais**, parce que ce sont des valeurs
littérales que les agents analysent et comparent, et non de la prose :

- les verbes d'état `RUN`, `YELLOW`, `STOP` ;
- les étiquettes de confiance `[PROVEN]`, `[CLAIMED]`, `[ASSUMED]`, `[PROPOSED]` ;
- les six verbes du bus `FLASH`, `ASK`, `ANS`, `TELL`, `GATE`, `ACK` ;
- les lignes de registre `REQ`, `DONE`, `BLOCKED`, `REFUSED` ;
- tous les noms de fichiers et chemins (`_os/`, `estop`, `protocol/00-PRECEDENCE.md`, …).

Les traduire casserait toute implémentation qui les lit.

---

## Couverture

| Fichier | État |
|---|---|
| `protocol/00-PRECEDENCE.md` | ✅ Traduit |
| `protocol/01-ESTOP.md` | ✅ Traduit |
| `protocol/02-EVIDENCE.md` | ✅ Traduit |
| `protocol/03-BUS.md` | ✅ Traduit |
| `protocol/04-OUTPUT-CONTRACT.md` | ✅ Traduit |
| `protocol/05-CORRECTION.md` | ✅ Traduit |
| `protocol/06-DATA-ZONES.md` | ✅ Traduit |
| `protocol/07-INTERFACE.md` | ✅ Traduit |
| `protocol/08-AGENTS.md` | ✅ Traduit |
| `protocol/09-FLOOR.md` | ✅ Traduit |
| `protocol/10-AIRLOCK.md` | ✅ Traduit |
| `README.md` | ⬜ Anglais |
| `CHANGELOG.md`, `DECISIONS.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` | ⬜ Anglais |
| `examples/`, `reference/`, `templates/` | ⬜ Anglais |
| Code et configuration (`.mjs`, `.json`, `.html`, `.yml`) | ⬜ Non traduits, par conception |

---

## Dispositions de clavier

Cette branche couvre celles et ceux qui écrivent avec les dispositions de clavier Windows
suivantes :

`French (Standard, AZERTY)`, `French (Legacy, AZERTY)`, `French (Standard, BÉPO)`,
`Belgian French`, `Belgian (Comma)`, `Belgian (Period)`, `Canadian French`,
`Canadian French (Legacy)`, `Canadian Multilingual Standard`, `Swiss French`

---

## Signaler une erreur de traduction

Ouvrez un ticket sur le dépôt en indiquant le fichier, la section et la formulation proposée. Une
correction de traduction ne change **jamais** le sens normatif : si vous pensez que l'anglais est
erroné, c'est un ticket distinct et il vise `main`.
