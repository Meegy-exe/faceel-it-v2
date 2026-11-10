# Current State - Faceel-IT V2

*Photographie à l'instant T - pas d'historique (cf. `CLAUDE.md`, mode Lean).
Archive de l'ancien historique détaillé : `docs/archive/*.pre-lean.md`.*

## Stack
Vue 3 (Composition API) + TypeScript + Vite (`vite-ssg`, pré-rendu statique) +
Tailwind v4 (tokens dans `client/src/assets/styles/main.css`) + Axios.
Backend Java 21 / Spring Boot / PostgreSQL (Flyway), non connecté au front
(mocks MSW). Police Poppins auto-hébergée.

## Design System (`client/src/components/ui/`)
- `AnimatedBackground.vue` - décor animé (variantes pixels/grid/aurora)
- `BaseButton.vue` - bouton (variantes primary/outline/ghost/accent)
- `CardCarousel.vue` - carrousel 1 diapositive, flèche « suivant » seule
- `CoverCarousel.vue` - carrousel « cover flow » 3 cartes
- `CarouselSlideContent.vue` - habillage texte libre des diapositives
- `HighlightCard.vue` - carte (usage hors carrousel, démo `StyleguideView`)
- `LogoWall.vue` / `PartnerCarousel.vue` - bandeaux logos partenaires
- `MegaMenu.vue` - nav : logo + burger + tiroir latéral (Sidebar)
- `types.ts` - types partagés du Design System

`components/layout/TheFooter.vue` - pied de page, partagé par `App.vue`.

## `HomeView.vue` - full page scroll snapping (5 diapositives `h-dvh snap-start`)
1. **Hero** - fond navy uni, machine à écrire sur « votre passion »
2. **`#services-group`** - bandeau partenaires (`PartnerCarousel`) + `CardCarousel` Services
3. **`#secteurs`** - `CardCarousel` (tone dark)
4. **`#valeurs`** - `CoverCarousel`
5. **`#rse`** - `CardCarousel` (tone dark)

Le conteneur de scroll-snap vit dans `App.vue` (englobe `<main>` + `TheFooter`,
route `/` uniquement via `meta.fullPageScroll`).

## Dettes connues
- Pages légales absentes (mentions légales, RGPD).
- Backend non branché (mocks uniquement).
