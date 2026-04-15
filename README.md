# TaskManager

Application web de gestion de tâches collaborative (exercice / démo), construite avec **Next.js**, **React** et **Firebase**. Interface en français, thème sombre, design responsive (Tailwind CSS).

## Fonctionnalités

### Authentification

- Inscription / connexion par **email et mot de passe**
- Connexion via **Google** (popup)
- Déconnexion, protection des pages privées (`AuthGuard`)

### Tâches personnelles (`/tasks`)

- Ajouter une tâche (titre, description optionnelle, priorité haute / moyenne / basse)
- Marquer une tâche comme complétée ou la supprimer
- Rechercher par **titre et description** (insensible à la casse)
- Filtrer par statut (toutes / actives / complétées)
- Trier par priorité ou par date de création
- Tableau de bord : statistiques et barre de progression

### Listes partagées (`/shared`)

- Créer une liste partagée
- Inviter des membres **par email** ; le propriétaire peut retirer un membre ou supprimer la liste
- Chaque liste dispose de ses propres tâches, avec les mêmes fonctions de recherche, filtre, tri et tableau de bord que les tâches personnelles
- Synchronisation en temps réel entre tous les membres (Firestore realtime)

### Persistance

Les données sont stockées dans **Cloud Firestore** (Firebase) avec cache local persistant et support multi-onglets. La sécurité est gérée côté serveur par les `firestore.rules`.

Pour une analyse détaillée (composants, production), voir **[BILAN.md](./BILAN.md)**.

## Prérequis

- [Node.js](https://nodejs.org/) (version compatible avec Next.js 16)
- Un projet **Firebase** avec Authentication (email/password + Google) et Firestore activés
- Variables d'environnement `NEXT_PUBLIC_FIREBASE_*` configurées (voir `src/lib/firebase.js`)

## Démarrage

Installation des dépendances :

```bash
npm install
```

Serveur de développement :

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Mode développement |
| `npm run build` | Build de production (export statique, voir `next.config.mjs`) |
| `npm run start` | Sert le build (après `npm run build`) |
| `npm run lint` | ESLint |

## Structure du projet

```
src/
├── app/
│   ├── layout.js          # Layout racine, métadonnées, Navigation
│   ├── page.js            # Landing marketing (hero, grille de fonctionnalités)
│   ├── providers.js       # AuthProvider wrapper
│   ├── globals.css        # Tailwind + tokens du thème + animations
│   ├── error.js           # Page d'erreur (App Router)
│   ├── not-found.js       # Page 404
│   ├── login/page.js      # Page de connexion
│   ├── signup/page.js     # Page d'inscription
│   ├── tasks/page.js      # Tâches personnelles (protégé)
│   └── shared/page.js     # Listes partagées (protégé)
├── components/
│   ├── Navigation.js      # Barre de navigation (top + bottom mobile)
│   ├── AuthGuard.js       # Redirection si non authentifié
│   ├── LoginForm.js       # Formulaire de connexion
│   ├── SignupForm.js      # Formulaire d'inscription
│   ├── AddTaskForm.js     # Ajout de tâche
│   ├── TaskList.js        # Liste de tâches
│   ├── TaskItem.js        # Ligne de tâche individuelle
│   ├── Dashboard.js       # Tableau de bord (stats + progression)
│   ├── ProgressBar.js     # Barre de progression accessible
│   ├── TaskStats.js       # Statistiques des tâches
│   ├── SearchBar.js       # Champ de recherche
│   ├── FilterBar.js       # Boutons de filtre par statut + tri
│   ├── CreateListForm.js  # Création de liste partagée
│   ├── SharedListCard.js  # Carte d'une liste partagée
│   ├── SharedListView.js  # Vue complète d'une liste partagée
│   └── Toast.js           # Notifications toast (hook + conteneur)
├── contexts/
│   └── AuthContext.js     # État d'authentification Firebase
├── lib/
│   └── firebase.js        # Initialisation Firebase (App, Auth, Firestore)
└── services/
    ├── taskService.js         # CRUD + abonnement temps réel (tâches perso)
    └── sharedListService.js   # CRUD listes partagées, membres, tâches
```

## Routes

| Route | Accès | Description |
|-------|-------|-------------|
| `/` | Public | Landing page avec présentation des fonctionnalités |
| `/login` | Public | Connexion (email/password, Google) |
| `/signup` | Public | Inscription |
| `/tasks` | Authentifié | Gestion des tâches personnelles |
| `/shared` | Authentifié | Gestion des listes partagées |

## Stack

- **Next.js 16** / **React 19** (App Router)
- **Tailwind CSS 4** (configuration via CSS, pas de `tailwind.config`)
- **Firebase 12** — Authentication + Cloud Firestore
- Export statique (`output: "export"` dans `next.config.mjs`)

## Déploiement

L'application est configurée pour **Firebase Hosting** (voir `firebase.json` : site statique depuis `out/`, réécriture SPA vers `index.html`).

Compatible avec tout hébergement de fichiers statiques (Vercel, Netlify, GitHub Pages…). Consulter la [documentation de déploiement Next.js](https://nextjs.org/docs/app/building-your-application/deploying).

## Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Firebase](https://firebase.google.com/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
