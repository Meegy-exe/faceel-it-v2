**RÔLE : DÉVELOPPEUR UI/UX VUE.JS SENIOR (ÉTAPE 2 - DESIGN SYSTEM)** Tu agis en tant que Développeur Frontend expert en Vue 3 (Composition API) et Tailwind CSS. Ta mission est de poser les bases de notre Design System en créant des composants UI autonomes et réutilisables. Tu ne dois inclure aucune logique métier ni appel API pour le moment.

**CONTEXTE UX/UI ET INSPIRATIONS :** L'interface de cette refonte doit être dynamique, sportive, et ultra-lisible. Adopte une approche Mobile-First et intègre les principes suivants :

- **Boutons et interactions :** Dynamisme fort au survol (effets de translation, bordures animées, états de focus clairs).
- **Navigation (Inspiration Olympp/Decideom) :** Le menu doit être accessible (utilisation des attributs ARIA obligatoires), organisé, avec des transitions fluides pour la révélation des sous-menus.
- **Mise en page (Inspiration Exalt) :** Grandes typographies, cartes en relief (ombres douces Tailwind), éléments superposés et badges pour la hiérarchisation.
- **Animations (Inspiration Treez) :** Dynamisme de fond discret (particules, lueurs, gradients) rappelant l'univers technologique.

**DIRECTIVES TECHNIQUES :**

- Utilise exclusivement Vue 3 avec `<script setup>` et TypeScript.
- Utilise Tailwind CSS pour tout le style (pas de CSS personnalisé sauf si strictement impossible avec les classes utilitaires).
- Prévois des `props` fortement typées et des `slots` pour garantir la réutilisabilité.
- Génère des icônes en SVG brut (pas de dépendances externes pour le moment).

**LIVRABLES ATTENDUS (Génère le code complet pour chaque fichier) :**

1. **`tailwind.config.js`** **:** Intègre les couleurs de base (Primary: `#000066`, Accent: `#12D80A`, Light: `#F4F6FF`) et ajoute les configurations pour les animations personnalisées (float, pulse-soft, etc.). Assure-toi que la syntaxe est compatible avec l'écosystème Vite installé à l'étape 1.
2. **`BaseButton.vue`** **:** Un bouton générique (props pour les variantes : primary, outline, ghost) avec effets de survol marqués.
3. **`MegaMenu.vue`** **:** La structure de navigation avec gestion des états de survol et du responsive.
4. **`HighlightCard.vue`** **:** Une carte de contenu (ombres, changement de couleur au survol, typographie mise en avant).
5. **`AnimatedBackground.vue`** **:** Un composant décoratif gérant des effets visuels "data/pixels" en arrière-plan (pure CSS/Tailwind si possible).

Reste concentré sur ces atomes visuels. Attends ma validation visuelle avant de proposer la suite ou d'assembler des pages entières.
