# Architecture Decision Records

*Mode Lean (cf. `CLAUDE.md`) : seuls les choix d'architecture lourds sont
conservés ici — plus d'ADR pour l'UI/CSS/composants. Historique complet
(ADR 01-29) archivé dans `docs/archive/DECISIONS.pre-lean.md`.*

## Vite-SSG
Pré-rendu statique au build pour le SEO d'une vitrine B2B. Conséquence :
aucun `Math.random()`/`Date.now()` dans un calcul de rendu (casse
l'hydratation).

## Police Poppins auto-hébergée
`@fontsource/poppins` plutôt qu'un CDN Google Fonts : le site collecte des
contacts/candidatures (RGPD), un CDN tiers enverrait l'IP des visiteurs et
ouvrirait la CSP stricte à un domaine externe.

## Full Page Scroll Snapping (CSS natif)
`HomeView.vue` : 5 diapositives `h-dvh snap-start`. Le conteneur de scroll
(`h-dvh overflow-y-auto snap-y snap-mandatory`) vit dans `App.vue`, autour de
`<main>` + `TheFooter`, activé uniquement sur `/` (`route.meta.fullPageScroll`)
pour ne pas casser `/styleguide`/404.

## Interdiction stricte de Playwright / tests automatisés
Aucun script de test automatisé (Playwright ou équivalent) ne doit être
lancé sur ce projet, sauf demande explicite contraire de l'utilisateur dans
le message courant.
