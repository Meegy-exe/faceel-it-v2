# faceel-it-v2

Refonte globale de la vitrine web de Faceel-IT : moderniser l'identité visuelle (DA) et optimiser l'expérience utilisateur.

## Stack

| Couche | Technologie |
|---|---|
| Frontend | Vue 3 (Composition API) + TypeScript + Vite + Tailwind v4 + Axios |
| Backend | Java 21 + Spring Boot 3.5 + API REST |
| Base de données | PostgreSQL 16 + Flyway |
| Déploiement | Docker (multi-stage), Nginx en frontal |

## Arborescence

```
faceel-it-v2/
├── client/     SPA Vue 3 + TypeScript
├── server/     API REST Spring Boot
├── docs/       architecture + contrat OpenAPI
└── legacy/     ancien scaffold React + actifs de référence (non versionné)
```

## Prérequis

- Node.js ≥ 22
- Docker
- JDK 21 - **uniquement** pour développer le backend en local depuis IntelliJ.
  Le backend se build et tourne sans JDK local via Docker.

## Démarrage

### 1. Infrastructure locale

```bash
docker compose up -d db mail
```

- PostgreSQL → `localhost:5432` (`faceelit` / `faceelit`)
- Mailpit (capture des mails) → http://localhost:8025

### 2. Frontend

```bash
cd client
npm install
npm run dev            # http://localhost:5173
```

Par défaut `VITE_USE_MOCKS=true` : le front tourne sur les mocks MSW, **sans backend**.
Passer à `false` dans `client/.env.development` pour taper sur la vraie API.

### 3. Backend

Depuis IntelliJ : ouvrir la racine du projet, ajouter `server/pom.xml` comme module Maven,
puis lancer `FaceelItApplication` avec le profil `dev`.

En ligne de commande (JDK 21 requis) :

```bash
cd server
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

- API → http://localhost:8080/api/v1
- Swagger UI → http://localhost:8080/swagger-ui.html
- Health → http://localhost:8080/actuator/health

### 4. Valider les images Docker

```bash
docker compose --profile full up --build
```

- Site → http://localhost:8081
- API → http://localhost:8080

## Commandes utiles

### Frontend (`client/`)

| Commande | Effet |
|---|---|
| `npm run dev` | Serveur de développement + proxy `/api` vers `:8080` |
| `npm run build` | Type-check + build de production dans `dist/` |
| `npm run type-check` | Vérification TypeScript seule |
| `npm run lint` | ESLint avec correction automatique |
| `npm run format` | Prettier sur `src/` |
| `npm run test:unit` | Vitest |

### Backend (`server/`)

| Commande | Effet |
|---|---|
| `mvn spring-boot:run` | Démarre l'API |
| `mvn test` | Tests d'intégration (Testcontainers → Docker requis) |
| `mvn clean package` | Produit le JAR |

## Conventions

- **Contrat d'API** : `docs/api/openapi.yaml` fait foi. Toute modification de champ
  passe par une PR touchant l'OpenAPI **et** `client/src/types/api.ts`.
- **Schéma de base** : Flyway seul maître. `ddl-auto` est à `validate`, jamais `update`.
- **Dates** : ISO-8601 UTC partout, jamais d'epoch.
- **Énumérations** : le backend renvoie le code technique (`CDI`), le libellé français
  est côté front.
- **Dépendances front** : `views/` → `features/` → `components/ui/`. Jamais l'inverse.

## À traiter

- `legacy/` contient l'ancien scaffold React, l'ancien `site.css`/`site.js` et les
  maquettes `test_refonte/`. À trier puis **supprimer** - le dossier n'est pas versionné.
