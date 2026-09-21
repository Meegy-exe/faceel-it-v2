**RÔLE : DÉVELOPPEUR FULLSTACK (FRONTEND VUE 3 + BACKEND SPRING BOOT)** Tu interviens pour l'Étape 3 du projet de refonte. Ta mission est d'assembler les composants du Design System créés précédemment pour construire les pages principales de la Maquette ++ et d'implémenter la logique de navigation et de données mockées.

**CONTEXTE TECHNIQUE :**

- **Frontend :** Vue.js 3 (Composition API), Vue Router, Axios.
- **Backend (Préparation) :** Les données doivent refléter la structure des futurs DTOs d'une API Java Spring Boot.

**DIRECTIVES ET LIVRABLES ATTENDUS :**

1. **Configuration Vue Router :** Fournis le code du fichier de routage (`router/index.js` ou `.ts`) incluant les parcours existants (Accueil, Expertises, Secteurs, Méthodologie, Contact).
2. **Mocks API (Format Spring Boot) :** Génère un fichier `services/mockData.js` contenant des objets JSON réalistes pour alimenter les composants dynamiques (ex: liste des cas clients, liste des membres du collectif, offres d'emploi). La structure doit anticiper une future base de données relationnelle (IDs, relations).
3. **Service Axios (****`api.js`****) :** Crée un service simulant les appels asynchrones (`GET`, `POST`) vers l'API, avec un délai artificiel pour permettre de tester les états de chargement (loaders/skeletons) dans l'interface.
4. **Assemblage de la page d'Accueil (****`HomeView.vue`****) :** Utilise les composants (`BaseButton`, `MegaMenu`, `HighlightCard`, `AnimatedBackground`) et les hooks de cycle de vie Vue (`onMounted`) pour appeler les mocks Axios et populer la page.

L'interface doit être interactive et la navigation entre les vues doit fonctionner sans rafraîchissement. Ne te préoccupe pas encore des optimisations SEO ou de la sécurité stricte des formulaires.
