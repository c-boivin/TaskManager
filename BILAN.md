# Bilan du projet TaskManager

Document de synthèse : composants, fonctionnalités, et écart par rapport à une application de production.

## Stack

- **Next.js 16** avec **`output: "export"`** (site statique exportable, pas de serveur Next dédié aux données).
- **React 19**, **Tailwind CSS 4**, **ESLint** (aucun test automatisé dans le dépôt au moment de la rédaction).

---

## Composants (`src/components/`)

| Composant | Rôle |
|-----------|------|
| **Header** | En-tête sticky, logo + liens Accueil / ancre `#tasks`. |
| **AddTaskForm** | Formulaire : titre, description, priorité, soumission. |
| **Dashboard** | Zone « Tableau de bord » : message vide ou **ProgressBar** + **TaskStats**. |
| **ProgressBar** | Barre de progression accessible (`role="progressbar"`). |
| **TaskStats** | Compteurs total / complétées / actives (+ option barre de progression). |
| **SearchBar** | Champ recherche avec icône et bouton effacer. |
| **FilterBar** | Filtres Toutes / Actives / Complétées ; export **`TASK_STATUS`** et **`compareTasksByPriorityHighFirst`**. |
| **TaskList** | Liste `<ul>` ou état vide. |
| **TaskItem** | Carte tâche : bascule complété, badge priorité, suppression. |

**App** : `src/app/layout.js` (métadonnées, polices Geist, `Header`), `src/app/page.js` (logique métier et UI principale), `globals.css`.

---

## Fonctionnalités actuelles

- Liste de tâches avec **données initiales** en dur (exemples).
- **Ajout** de tâche (titre obligatoire, description optionnelle, priorité haute / moyenne / basse).
- **Compléter / décompléter** une tâche.
- **Supprimer** une tâche.
- **Recherche** sur le **titre** uniquement (insensible à la casse, trim).
- **Filtre** par statut : toutes, actives, terminées.
- **Tri** : priorité (haute → basse) ou date de création (plus anciennes d’abord).
- **Indicateurs** : texte « X tâches actives sur Y », tableau de bord avec **pourcentage de progression** et **statistiques**.
- **UI** : thème clair/sombre (`dark:`), mise en page centrée.
- **Accessibilité** partielle : labels, `aria-*` sur recherche, filtres, cases, barre de progression.

---

## Vers une application de production

### Données et backend

- **Persistance** : état uniquement en **`useState`** → rechargement = perte des modifications. Prévoir au minimum **localStorage** / IndexedDB, ou une **API + base de données**.
- **Modèle serveur** : validation, contraintes, horodatage côté serveur, idempotence, gestion des conflits en cas de synchronisation multi-appareils.
- Avec **`output: "export"`**, pas d’API Routes Next « classiques » sur le même déploiement : **backend externe** (BaaS, serverless) ou **changer le mode de déploiement** si tout doit vivre sur Next.

### Produit / UX

- **Édition** d’une tâche après création (titre, description, priorité).
- Recherche sur la **description**, éventuellement tags / listes / projets.
- **Confirmation** avant suppression, **annuler** (undo) après suppression.
- Le bouton **« Commencer »** sur la page d’accueil n’a **pas d’action** : à brancher (scroll, onboarding) ou à retirer.

### Qualité et exploitation

- **Tests** automatisés (unitaires sur filtres/tri et composants ; e2e sur le flux critique).
- **CI** (lint + tests + build), politique de versions et revue des dépendances.
- **Observabilité** : logs structurés, erreurs front (ex. Sentry), métriques.
- **Sécurité** (si comptes) : authentification, RBAC, protection CSRF sur les formulaires serveur, CSP selon l’hébergeur.
- **Accessibilité** : audit (WCAG), navigation clavier complète, annonces live pour ajouts/suppressions, gestion du focus après actions destructives.
- **i18n / SEO** : textes en français dans le code ; pour plusieurs langues ou pages marketing, prévoir un vrai système i18n et des pages dédiées si besoin.
- **Performance** : lazy loading si la liste grossit, virtualisation des longues listes.
- **Conformité** : mentions légales, confidentialité, droit à l’effacement si données personnelles.

---

## Synthèse

Le projet est une **démo / prototype front** solide (liste, filtres, tri, stats, UI cohérente), mais pas encore une **application de production** tant qu’il manque une **persistance fiable**, une **couche serveur** lorsque multi-utilisateurs ou données sensibles, des **tests et un pipeline**, et les **fonctions produit** habituelles (édition, sauvegarde, gestion d’erreurs, monitoring).
