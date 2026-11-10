# Faceel IT - Refonte de la vitrine web (V1)

Refonte globale du site vitrine de Faceel IT : modernisation de l'identité visuelle
(direction artistique) et amélioration de l'expérience utilisateur. Le site présente
l'entreprise, ses expertises (Data & IA, Digital, Product), ses références, ses offres
d'emploi et permet de candidater ou de contacter l'équipe.

Les pages publiques sont **pré-rendues** (SSG) pour le référencement et la performance,
et servies comme fichiers statiques.

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | Vue 3 (Composition API), TypeScript, Vite, Tailwind CSS v4, Pinia, Vue Router |
| Rendu | `vite-ssg` (pré-rendu statique), `@unhead/vue` (balises SEO) |
| Formulaires | VeeValidate + Zod, Axios |
| Tests | Vitest, Vue Test Utils, MSW (mocks d'API) |
| Backend | Java 21, Spring Boot 3.5, API REST |
| Base de données | PostgreSQL 16, migrations Flyway |
| Conteneurs | Docker (multi-stage), Nginx en frontal |

## Architecture

```
faceel-it-v2/
├── client/                 Application web (Vue 3 + TypeScript)
│   ├── src/views/          Pages (une par route)
│   ├── src/features/       Blocs fonctionnels réutilisables
│   ├── src/components/     Composants (dont components/ui/ : design system)
│   ├── src/router/         Routes et liste des pages pré-rendues
│   ├── src/assets/         Images, logos, styles (tokens Tailwind dans styles/main.css)
│   ├── src/mocks/          Mocks MSW (front sans backend)
│   ├── nginx.conf          Configuration Nginx de production
│   └── security-headers.conf   En-têtes de sécurité (CSP...)
├── server/                 API REST Spring Boot (Flyway, Testcontainers)
├── docs/                   Documentation : contrat OpenAPI, architecture, codemap
├── scripts/                Utilitaires (génération de la codemap)
├── .github/workflows/      CI/CD GitHub Actions (build et publication de l'image Docker)
├── Dockerfile              Image du site (build Vue puis Nginx)
├── docker-compose.yml      Base PostgreSQL, Mailpit, et profil `full` (site + API)
└── CLAUDE.md               Consignes communes pour les agents IA
```

Règle de dépendance côté front : `views/` → `features/` → `components/ui/`, jamais
l'inverse.

## Installation et lancement

### Prérequis

- Node.js ≥ 22
- Docker (base de données locale, build des images)
- JDK 21 : uniquement pour développer le backend en local

### Frontend seul (cas le plus courant)

Toutes les commandes se lancent **depuis le dossier `client/`** :

```bash
cd client
npm install
npm run dev            # http://localhost:5173
```

Par défaut, `VITE_USE_MOCKS=true` dans `client/.env.development` : le front fonctionne
avec des mocks MSW, **sans backend**. Passer cette variable à `false` pour utiliser la
vraie API.

### Avec le backend

```bash
docker compose up -d db mail      # PostgreSQL :5432, Mailpit http://localhost:8025

cd server
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

- API : http://localhost:8080/api/v1
- Swagger UI : http://localhost:8080/swagger-ui.html
- Health : http://localhost:8080/actuator/health

### Commandes utiles (`client/`)

| Commande | Effet |
|---|---|
| `npm run dev` | Serveur de développement (proxy `/api` vers `:8080`) |
| `npm run build` | Type-check + build de production pré-rendu dans `dist/` |
| `npm run preview` | Prévisualise le build |
| `npm run type-check` | Vérification TypeScript |
| `npm run lint` | ESLint avec correction automatique |
| `npm run format` | Prettier sur `src/` |
| `npm run test:unit` | Tests unitaires Vitest |

Côté backend (`server/`) : `mvn test` (Docker requis pour Testcontainers) et
`mvn clean package`.

## Déploiement

- **Image Docker** : le `Dockerfile` racine compile le client (`npm run build`) puis
  sert `dist/` avec Nginx. Le workflow `.github/workflows/deploy.yml` construit cette
  image et la publie sur **GitHub Container Registry** (`ghcr.io/<organisation>/<dépôt>`)
  à chaque push sur la branche `deploy/staging`.
- **Test local de l'image** : `docker compose --profile full up --build` (site sur
  http://localhost:8081).
- **GitHub Pages** : la V1 est prévue pour y être publiée, mais **aucune configuration
  Pages n'existe encore dans le dépôt** (pas de workflow dédié, pas de `base` Vite).
  TODO : ajouter un workflow de déploiement Pages et, si le site est servi sous un
  sous-chemin, régler `base` dans `client/vite.config.ts`.

## Conventions

- **Contrat d'API** : `docs/api/openapi.yaml` fait foi. Toute modification de champ
  passe par une PR touchant l'OpenAPI **et** `client/src/types/api.ts`.
- **Schéma de base** : Flyway seul maître (`ddl-auto: validate`, jamais `update`).
- **Dates** : ISO-8601 UTC partout, jamais d'epoch.
- **Énumérations** : le backend renvoie le code technique (`CDI`), le libellé français
  est côté front.
- **Rendu déterministe** : pas de `Math.random()` ni `Date.now()` dans un calcul de
  rendu, sous peine de casser l'hydratation du pré-rendu.
- **Typographie** : tiret court (-) uniquement, jamais de tiret cadratin.

## Dossiers locaux non versionnés

`legacy/` (ancien scaffold React) et `Animate the header/` (export de maquettes) sont
ignorés par Git et ne servent que de référence locale.
