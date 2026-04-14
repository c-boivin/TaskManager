# TaskManager

Application web de gestion de tâches (exercice / démo), construite avec **Next.js** et **React**. Interface en français, thème clair / sombre (Tailwind CSS).

## Fonctionnalités

- Ajouter des tâches (titre, description optionnelle, priorité)
- Marquer une tâche comme complétée ou la supprimer
- Rechercher par titre, filtrer (toutes / actives / complétées), trier par priorité ou par date
- Tableau de bord : statistiques et barre de progression

Les données restent **en mémoire côté client** (rechargement = retour aux données de départ), sauf évolution ultérieure. Pour une analyse détaillée (composants, production), voir **[BILAN.md](./BILAN.md)**.

## Prérequis

- [Node.js](https://nodejs.org/) (version compatible avec Next.js 16)

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

## Structure utile

- `src/app/page.js` — page d’accueil et logique principale (liste, filtres, tri)
- `src/app/layout.js` — layout racine, métadonnées, en-tête
- `src/components/` — composants UI (formulaire, liste, filtres, tableau de bord, etc.)

## Stack

- Next.js 16, React 19
- Tailwind CSS 4
- Export statique (`output: "export"` dans `next.config.mjs`) : déploiement type hébergement de fichiers statiques

## Déploiement

Tout site compatible avec un **export statique** (Vercel, Netlify, GitHub Pages avec config adaptée, etc.). Consulter la [documentation de déploiement Next.js](https://nextjs.org/docs/app/building-your-application/deploying).

## Ressources Next.js

- [Documentation Next.js](https://nextjs.org/docs)
- [Tutoriel interactif](https://nextjs.org/learn)
