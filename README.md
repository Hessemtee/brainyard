## Project Graveyard — MVP

**Project Graveyard** : un cimetière d’idées pour éviter qu’elles ne hantent ton cerveau.

Objectif unique du MVP : **transformer une idée floue en objet statué**.

### Ce que c’est

Une seule page :
- un formulaire
- une liste d’idées
- pour chaque idée : titre, statut, 2 phrases max visibles, changement de statut, suppression

Stockage : **localStorage** (le plus honteux, donc parfait).

### Lancer

Option A (le plus simple) : ouvre `index.html` dans ton navigateur.

Option B (évite certains soucis CORS selon navigateur) :

```bash
cd /Users/mopi/GraveYard
python3 -m http.server 5173
```

Puis ouvre `http://localhost:5173`.

### Phrase de clôture

> Toutes les idées ne méritent pas d’être réalisées.
> Certaines méritent juste d’être enterrées proprement.
