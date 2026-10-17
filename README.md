# Cosa Mangio?

App web (PWA) bilingue IT/FR : « Qu'est-ce que je mange ce soir ? ». Filtre par temps, budget, régime et nombre de personnes, swipe les recettes, et la liste de courses se remplit toute seule. Fonctionne hors-ligne et s'installe sur l'écran d'accueil.

Site statique, sans build ni dépendance. Données sauvegardées dans le navigateur (`localStorage`).

## Lancer en local

```bash
python -m http.server 8000
```

Puis ouvrir http://localhost:8000 (le service worker nécessite http, pas `file://`).

## Déployer sur GitHub Pages

1. Créer un dépôt GitHub et y pousser le dossier (branche `main`).
2. Settings → Pages → Source : **GitHub Actions**.
3. Chaque push sur `main` redéploie via `.github/workflows/pages.yml`.

## Mettre à jour

- Recettes et ingrédients : `recipes.js`.
- Après une modification, incrémenter `CACHE` dans `sw.js` pour que les utilisateurs récupèrent la nouvelle version.
