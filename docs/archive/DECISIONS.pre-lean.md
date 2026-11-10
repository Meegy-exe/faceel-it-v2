# Architecture Decision Records (ADRs)

## ADR 01 : Utilisation de Vite-SSG pour le rendu
- **Contexte :** SPA Vue.js 3 avec un besoin critique de SEO pour une vitrine B2B.
- **Décision :** Adoption de `vite-ssg` pour pré-rendre les pages statiques au build.
- **Conséquence :** Interdiction absolue d'utiliser `Math.random()` ou des accès `document` globaux non protégés par `import.meta.env.SSR`.

## ADR 02 : Absence d'authentification en V1
- **Contexte :** Le site est une vitrine corporate avec un unique point d'écriture (formulaire de contact).
- **Décision :** Pas de back-office ni d'auth en V1. La couche service backend doit tout de même rester découplée pour l'accueillir en V2.

## ADR 03 : Règle stricte du Design System (Couleur d'accent)
- **Contexte :** Contraste WCAG et accessibilité (daltonisme).
- **Décision :** Le vert fluo (`#12D80A`) ne doit **jamais** être utilisé en aplat de fond de carte (`CardTone`), mais uniquement par touches (bordures, icônes, textes).

## ADR 04 : Carrousel partenaires animé (remplacement du bandeau statique)
- **Contexte :** Demande client explicite de remplacer le bandeau statique
  « partenaires » (`LogoWall`) par un défilement horizontal infini animé, avec
  logos cliquables vers le site de chaque partenaire.
- **Décision :** Nouveau composant `components/ui/PartnerCarousel.vue`,
  distinct de `LogoWall` (qui reste disponible pour un usage non animé). La
  boucle infinie est obtenue en dupliquant la piste de logos (`<ul>` rendu
  deux fois) et en translatant l'ensemble de 0 à -50 % via le jeton
  `--animate-marquee` déclaré dans `main.css` - pas de calcul de largeur en
  JS, donc compatible avec le pré-rendu `vite-ssg` (ADR 01). La durée de
  cycle est une constante fixe du jeton, jamais dérivée du nombre de
  partenaires, pour rester déterministe au rendu.
- **Conséquences :**
  - La copie dupliquée est retirée de l'arbre d'accessibilité
    (`aria-hidden="true"` + `tabindex="-1"`) pour éviter les doublons au
    clavier et au lecteur d'écran.
  - L'animation se met en pause à la fois au survol souris
    (`group-hover/marquee`) et au focus clavier (`group-focus-within/marquee`)
    - l'un sans l'autre laisserait un utilisateur clavier lire un logo qui
    continue de défiler sous lui.
  - Sous `prefers-reduced-motion`, la piste repasse en disposition statique
    qui s'enroule (`flex-wrap`) plutôt que de simplement geler la
    translation, pour ne pas laisser la moitié du contenu hors champ dans un
    conteneur `overflow-hidden`.
  - Les 8 logos partenaires (Auchan, Boulanger, Verspieren, Decathlon, Midas,
    Kiabi, Mondial Relay, Leroy Merlin) existaient déjà réellement en SVG dans
    `client/src/assets/images/partners/` : aucun logo n'a été fabriqué ni
    remplacé par un placeholder.

## ADR 05 : Hero V0.1 - machine à écrire, retrait de la vague, ruban paramétrique
- **Contexte :** Le client a validé la structure globale de `HomeView` mais
  demande 3 ajustements précis sur la section Hero : (1) un effet machine à
  écrire sur « votre passion », (2) le retrait de la vague SVG qui terminait
  le bas du Hero, (3) un nouveau décor canvas de « vagues paramétriques » en
  arrière-plan.
- **Décision :**
  1. **Machine à écrire SSR-safe.** L'état réactif qui pilote le texte
     affiché (`typedText`) démarre à la valeur complète (`HERO_TYPED_TEXT`),
     identique à ce que `vite-ssg` pré-rend et à ce que Vue hydrate côté
     client - la boucle d'effacement/frappe ne démarre que dans `onMounted`,
     jamais dans le calcul de rendu, pour ne jamais créer d'écart
     d'hydratation (ADR 01). Le cycle (efface puis retape) se rejoue toutes
     les 15 s via `setInterval`, pas en s'enchaînant lui-même récursivement,
     pour que la cadence ne dérive jamais si un cycle prenait
     anormalement de temps. Le `<h1>` porte un second span, `sr-only` et
     stable, qui ne change jamais : sans lui, un lecteur d'écran
     réannoncerait le titre à chaque cycle de 15 s pendant que le span animé
     (`aria-hidden="true"`) se vide puis se retape.
  2. **Vague SVG retirée.** Le Hero (`bg-primary-900`) s'arrête désormais sur
     une arête droite ; aucun padding ne recrée un espace ou un décalage
     avec la section Confiance (`bg-light`) qui suit.
  3. **Nouveau composant `components/ui/WaveRibbon.vue`**, plutôt qu'une
     variante supplémentaire d'`AnimatedBackground` : le rendu demandé (un
     ruban de ~50 lignes fines qui se resserrent et s'écartent façon
     Lissajous) est un algorithme entièrement différent des couches
     existantes d'`AnimatedBackground` (grille, aurora, graphe de points) -
     l'y ajouter aurait mélangé deux logiques de dessin sans rien
     mutualiser. `WaveRibbon` reprend la même discipline d'ingénierie que
     `DataCore` (garde SSR, `ResizeObserver`, figure statique + listener
     `change` sous `prefers-reduced-motion`, pause sur `visibilitychange`,
     cleanup complet), et la phase de l'animation est une fonction continue
     du temps écoulé (`requestAnimationFrame`), jamais un tirage aléatoire.
  4. **Remplacement d'`AnimatedBackground` (variante `pixels`) par
     `WaveRibbon` dans le Hero, pas addition des deux.** Le Hero porte déjà
     `DataCore` à côté du titre ; superposer un nuage de points
     (`AnimatedBackground`) ET un ruban de lignes (`WaveRibbon`) sur la même
     surface aurait fait se disputer l'attention à deux motifs distincts -
     exactement l'écueil déjà corrigé une fois sur ce Hero (le collage photo
     retiré au profit de `DataCore` seul, cf. commentaire de script de
     `HomeView.vue`). `AnimatedBackground` reste utilisé ailleurs sur la page
     (variante `aurora`, section Contact) : ce n'est un retrait que de cet
     usage précis dans le Hero, pas du composant lui-même.
- **Conséquences :**
  - `HomeView.spec.ts` (nouveau) prouve par un test, pas par une relecture,
    que le `<h1>` garde un nom accessible stable pendant l'effacement et
    qu'aucune frappe n'est jamais simulée sous `prefers-reduced-motion` -
    deux comportements non visuels qu'une capture d'écran ne peut pas
    couvrir.
  - Le vert d'accent du ruban (`rgba(18, 216, 10, …)`) reste une touche : les
    lignes sont fines (1 px), jamais un aplat, et leur opacité varie déjà
    selon la position (plus lumineux au centre du ruban qu'à ses bords) -
    un second signal non chromatique, cohérent avec ADR 03.

## ADR 06 : Hero V0.1.1 - correctif de layout du typewriter, retrait de `DataCore`, vagues seules
- **Contexte :** passe de correction demandée par le client sur le Hero
  livré en V0.1 (ADR 05), sur trois points précis :
  1. un bug de layout disgracieux sur l'effet machine à écrire : le texte
     animé démarrait à droite du mot fixe « Faceelitez » puis sautait à la
     ligne en cours d'animation dès qu'il dépassait la largeur restante ;
  2. un rythme jugé trop lent (délai de lancement nul, cycle à 15 s) ;
  3. le canvas `DataCore` (globe de points façon « cœur de données ») posé à
     côté du titre est jugé de trop - le client ne veut garder que le décor
     de vagues (`WaveRibbon`) en fond de Hero.
- **Décision :**
  1. **Structure du `<h1>` verrouillée en colonne (`flex-col`), pas en ligne
     (`flex-wrap`).** « Faceelitez » et le bloc animé (span `sr-only` +
     texte tapé + curseur) occupent chacun leur propre ligne en permanence,
     y compris quand le texte animé est vide en fin d'effacement. Le bloc
     animé porte `min-h-[0.95em]` (0,95 = même ratio que
     `--text-mega--line-height`) pour réserver la hauteur d'une ligne même
     à vide - sans ce plancher, la ligne s'affaisserait puis remonterait à
     chaque cycle d'effacement (CLS). C'est un changement de structure DOM,
     pas seulement de classes : la cause du bug V0.1 était le flux en ligne
     lui-même (le texte animé partageait la même ligne que le mot fixe tant
     qu'il tenait dans la largeur restante), pas une valeur de espacement
     mal réglée.
  2. **Timing resserré.** Le premier lancement est retardé de 2 s après le
     montage (`HERO_TYPEWRITER_START_DELAY_MS`), porté par un `setTimeout`
     dédié et distinct du minuteur de cycle - le temps que les animations
     d'entrée du Hero (`animate-fade-up` sur l'eyebrow, le titre, le
     paragraphe) se terminent, pour ne pas superposer deux mouvements
     distincts dès le chargement. Le cycle se relance ensuite toutes les 5 s
     (`HERO_TYPEWRITER_CYCLE_MS`, au lieu de 15 s) via `setInterval` - jamais
     un `setTimeout` récursif, pour que la cadence ne dérive jamais si un
     cycle prenait anormalement de temps (même raisonnement qu'en V0.1).
  3. **Retrait complet de `DataCore`, fichier compris.** Le composant
     `components/ui/DataCore.vue` est supprimé : il n'avait plus aucun
     consommateur après son retrait de `HomeView.vue`, et le garder aurait
     laissé une primitive morte dans le Design System (principe de
     réutilisation avant création - un composant qui ne sert plus nulle
     part n'est pas une réutilisation future, c'est de la dette). La grille
     à deux colonnes du Hero, qui réservait une colonne au globe, redevient
     une colonne unique : le bloc de texte reprend toute la largeur
     disponible. `WaveRibbon` reste seul décor et voit son amplitude, ses
     fréquences et l'opacité de ses lignes relevées (coefficients
     `0,08→0,16`, `0,4→0,62`, `0,05→0,09` ; opacité `0,12-0,62→0,26-0,86`)
     pour occuper une part beaucoup plus large du Hero - un décor pensé pour
     partager la section avec `DataCore` paraissait sous-dimensionné une
     fois seul sur la surface bleu nuit.
- **Conséquences :**
  - `docs/CODEMAP.md` régénéré (`scripts/generate-codemap.py`) : la
    dépendance `HomeView.vue → components/ui/DataCore.vue` disparaît de la
    cartographie automatique.
  - `HomeView.spec.ts` mis à jour pour refléter les nouveaux délais (2 s /
    5 s au lieu de 0 s / 15 s) - les deux garanties d'accessibilité déjà
    couvertes (nom accessible stable, aucune frappe simulée sous mouvement
    réduit) restent prouvées par test, pas par relecture.
  - Aucun écart d'hydratation introduit : le HTML pré-rendu (`vite-ssg`) du
    `<h1>` porte toujours le texte complet dès le premier rendu, la nouvelle
    structure `flex-col` ne change que la disposition, pas la valeur
    initiale de `typedText` (vérifié par inspection du `dist/index.html`
    généré au build).

## ADR 07 : Hero V0.1.2 - recalibrage du ruban `WaveRibbon`, correctif du pincement, élargissement horizontal de la page
- **Contexte :** le client a testé la V0.1.1 (ADR 06) et remonte deux
  retours précis sur le Hero, plus une demande générale sur le reste de la
  page :
  1. le ruban `WaveRibbon` est devenu trop massif verticalement (il envahit
     toute la hauteur du Hero, sans espace vide en haut ni en bas de la
     section) ;
  2. une anomalie mathématique fait converger/pincer les lignes de façon
     anormale sur un bord du canvas ;
  3. demande générale d'exploiter davantage l'espace horizontal disponible
     sur toute la page, plutôt que d'allonger les sections verticalement.
- **Décision :**
  1. **Recalibrage de l'amplitude.** Les coefficients d'amplitude
     `wave`/`envelope`/`twist`, doublés en V0.1.1 (`0,08→0,16`,
     `0,4→0,62`, `0,05→0,09`) pour compenser le retrait de `DataCore`,
     repassent à la valeur intermédiaire entre V0.1 et V0.1.1 - la moyenne
     arithmétique des deux bornes : `0,12`, `0,51`, `0,07`. Choix motivé par
     un examen visuel du rendu réel (smoke test), pas seulement par le
     calcul : l'objectif du retour client est un ruban élégant et centré
     verticalement, jamais une écharpe qui touche les bords de la section.
     Les fréquences de `wave` (0,9) et `twist` (1,4) fixées en V0.1.1 ne
     sont pas concernées (seule leur amplitude bouge) ; l'opacité
     (0,26-0,86) reste également inchangée - le retour client porte sur
     l'ampleur géométrique, pas sur la visibilité de la couleur.
  2. **Correctif de l'anomalie de pincement.** Diagnostic : le terme
     `envelope` calculait `Math.abs(Math.sin(xt * Math.PI * 2 * 0.5 +
     phase * 0.6))`, où `xt ∈ [0,1]` balaie la largeur du canvas. Avec un
     coefficient de fréquence de `0.5`, l'argument du sinus parcourt
     exactement une demi-période (`π`) sur toute la largeur. Or les zéros
     de `sin` sont espacés d'exactement `π` - la largeur exacte de cette
     fenêtre - ce qui garantit mathématiquement l'existence d'un unique
     zéro quelque part dans `[0,1]` à chaque instant (sauf à l'instant exact
     où les deux zéros voisins tombent simultanément sur les deux bords).
     Ce zéro produit un repli en pointe de l'enveloppe (l'usage de
     `Math.abs` crée un point anguleux, pas un creux arrondi) qui dérive
     continûment avec `phase`, mais dont la vitesse de dérive et la
     fréquence choisies le font stationner visuellement près d'un bord du
     canvas une bonne partie du cycle - perçu comme un pincement anormal
     localisé, plutôt que comme une texture de vague répartie sur toute la
     largeur. Correctif retenu : la fréquence de ce terme passe de `0.5` à
     `2` (deux cycles complets sur la largeur au lieu d'un demi-cycle,
     option proposée par le client plutôt que le changement de fonction ou
     le simple relèvement du plancher, jugée la plus propre car elle ne
     change ni la forme ni l'amplitude de l'enveloppe, seulement sa
     répartition). Conséquences : plusieurs zéros désormais répartis sur
     toute la largeur au lieu d'un seul, aucun n'étant plus mathématiquement
     singulier ; et comme la fréquence est un nombre entier de cycles, les
     deux extrémités du canvas retombent toujours exactement sur la même
     valeur d'enveloppe, ce qui élimine toute asymétrie gauche/droite. Le
     plancher multiplicatif (`0.35 + 0.65 * …`) n'a pas été modifié : il
     limitait déjà la profondeur du repli (jamais un aplatissement total à
     zéro), mais ne pouvait pas corriger sa forme en pointe ni sa position -
     il n'était pas la cause du défaut, une vérification du code l'a
     confirmé avant toute modification.
  3. **Élargissement horizontal de la page.** Les deux conteneurs qui
     dérogeaient au standard `max-w-7xl` déjà en usage sur cinq sections
     de la page (Services, Secteurs, Valeur ajoutée, RSE, Interviews) sont
     harmonisés : Confiance (`max-w-6xl`) et Équipe (`max-w-5xl`) passent à
     `max-w-7xl`. Les grilles de cartes à 4 colonnes de ces cinq sections
     étaient déjà à `max-w-7xl` avant cette passe - vérifié par lecture du
     code, aucune largeur de conteneur n'y a donc été modifiée, et leur
     `gap`/padding (`HighlightCard`, `gap-6`, `p-6 sm:p-8`) restent adaptés
     à cette largeur inchangée, sans déséquilibre visuel à corriger. Le
     bloc de texte du Hero s'élargit légèrement (`<h1>` : `max-w-4xl` →
     `max-w-5xl` ; paragraphe : `max-w-2xl` → `max-w-3xl`), en restant dans
     une largeur de ligne lisible (le texte du `<h1>` est composé de mots
     courts en très grande typographie, la largeur y importe surtout pour
     le retour à la ligne ; le paragraphe reste sous la fourchette de 75-90
     caractères par ligne recommandée en lecture). Les deux boutons de la
     section Contact (`flex-col sm:flex-row`) passaient déjà en disposition
     ligne dès le breakpoint `sm:` (640px) : vérifié par lecture du code
     avant toute modification, aucun changement n'y était nécessaire - le
     seul autre bloc `flex-col` de la page est le `<h1>` du Hero, qui reste
     verrouillé en colonne à dessein (c'est la structure qui corrige le bug
     de layout V0.1, cf. ADR 06), donc jamais converti en ligne.
- **Conséquences :**
  - Aucun nouveau breakpoint ni nouvelle classe arbitraire Tailwind
    introduits : uniquement des paliers `max-w-*` déjà présents dans
    l'échelle standard de Tailwind (`5xl`, `7xl`), tous sans préfixe
    responsive (`lg:`/`xl:`) - ils s'appliquent donc uniformément à toutes
    les tailles d'écran, sans régression mobile/tablette (confirmé par
    grep du CSS généré au build et inspection du HTML pré-rendu).
  - Aucun écart d'hydratation introduit par ces changements : le canvas
    `WaveRibbon` est déjà post-hydratation (garde SSR existante, cf. ADR 05)
    et les classes Tailwind modifiées ne touchent aucune valeur d'état
    réactif pré-rendue par `vite-ssg`.
  - Pipeline `verify-frontend-change` exécuté dans son intégralité (build,
    lint, format, tests unitaires, grep des classes Tailwind générées, fumée
    sur serveur de développement) : tout passe. Aucun accès réseau
    disponible dans cet environnement pour une capture d'écran automatisée
    (Playwright sans navigateur mis en cache) - la vérification visuelle
    finale du rendu du ruban reste à confirmer par un humain ou un agent
    disposant d'un navigateur, limite documentée plutôt que passée sous
    silence.

## ADR 08 : V0.1.3 - élargissement `max-w-[100rem]`, full bleed Confiance, monochromie des logos, suppression de `Math.abs()` dans `WaveRibbon`
- **Contexte :** nouvelle passe de retours clients sur la V0.1.2 (ADR 07),
  portant sur quatre points indépendants : (1) le standard `max-w-7xl` déjà
  harmonisé en V0.1.2 reste jugé trop étroit sur les très grands écrans ;
  (2) le bandeau de logos partenaires doit défiler bord à bord de la fenêtre,
  pas seulement occuper une largeur élargie ; (3) le logo Verspieren (SVG
  blanc) reste illisible sur fond clair même en `grayscale` ; (4) le
  pincement du ruban `WaveRibbon`, réparti mais pas supprimé par le correctif
  de fréquence V0.1.2, reste un défaut géométrique visible.
- **Décision :**
  1. **`max-w-7xl` (80rem) → `max-w-[100rem]`, valeur arbitraire plutôt que
     nouveau jeton `@theme`.** Deux options existaient : déclarer un palier
     nommé dans `main.css` (ex. `--container-8xl`) ou utiliser directement une
     valeur arbitraire Tailwind v4. La valeur arbitraire est retenue : un
     jeton nommé n'a de sens que s'il est réutilisé à plusieurs endroits avec
     une intention distincte (ex. `--text-mega` sert la typographie fluide
     dans plusieurs contextes) - ici, un seul palier remplace mécaniquement
     un autre sur l'ensemble de la page, sans variation entre sections.
     Ajouter un jeton aurait introduit de l'indirection sans bénéfice de
     réutilisation future. Appliqué uniformément à `HomeView.vue` (8
     sections), `TheFooter.vue` et `MegaMenu.vue` (nav + panneau) ;
     `StyleguideView.vue` suit la même règle pour rester cohérente avec le
     reste du site qu'elle documente.
  2. **Confiance en full bleed : repositionnement du padding, pas nouveau
     composant.** Plutôt que de faire déborder `PartnerCarousel` de son
     conteneur via une astuce de marge négative (`-mx-4 sm:-mx-6 lg:-mx-8`,
     qui aurait fonctionné mais couplé la largeur du composant à la valeur
     exacte du padding parent), le padding horizontal de la `<section>` est
     simplement retiré et reporté sur le seul titre. Le carrousel se retrouve
     dans un conteneur `w-full` sans aucune contrainte de largeur : la piste
     anime bord à bord sans dépendre d'un calcul de compensation.
  3. **`brightness-0` structuré en `Record<BackgroundTone, string>`
     (`MONOCHROME_FILTER`), pas un ternaire inline.** `PartnerCarousel`
     n'a qu'un usage réel (`tone="light"`, section Confiance) : un ternaire
     `tone === 'light' ? '...' : ''` aurait été suffisant fonctionnellement,
     mais le fichier documente déjà un patron équivalent pour un problème
     structurellement identique (`FOCUS_RING`, deux couleurs d'anneau de
     focus selon le tone). Reproduire ce patron plutôt qu'improviser une
     forme différente rend explicite, pour un futur usage `tone="dark"`, qu'un
     choix reste à faire pour ce tone (clé `dark: ''`) plutôt que de le
     laisser deviner depuis un test inversé. `brightness-0` s'ajoute à
     `grayscale` (déjà en place) au lieu de le remplacer : les logos
     colorés (tous sauf Verspieren) restent lisibles en `grayscale` seul,
     mais assombrir uniformément jusqu'au noir plein règle aussi le cas du
     SVG blanc sans traitement spécifique à un seul logo - une règle générale
     qui corrige un cas particulier, pas un correctif ciblé sur un fichier.
  4. **`envelope` réécrit sans `Math.abs()`, combinaison de deux sinusoïdes à
     fréquences entières.** Alternatives écartées : (a) garder `Math.abs`
     mais lisser algorithmiquement l'angle (ex. interpolation locale autour
     des zéros) - solution plus complexe, avec un rayon de lissage arbitraire
     à calibrer, pour un problème que la formule elle-même peut éliminer
     structurellement ; (b) une seule sinusoïde `0.5 + 0.5*sin(...)` sans
     terme correctif - plus simple, mais retrouve une forme de vague pure
     plutôt que l'aspect « ruban qui respire » actuel (le second terme à
     fréquence différente casse la symétrie parfaite d'un sinus unique).
     La combinaison à deux termes (fréquences entières `2` et `3`, poids
     `0,6`/`0,4` sommant à `1`) est retenue : chaque terme est indéfiniment
     dérivable (aucune discontinuité de dérivée possible, contrairement à
     `Math.abs`), la somme pondérée reste bornée dans `[-1,1]` par inégalité
     triangulaire (donc `0,5 + 0,5 * …` reste dans `[0,1]` sans valeur
     absolue), et les fréquences entières préservent la synchronisation des
     deux bords du canvas héritée du correctif V0.1.2 (`envelope` identique
     en `xt=0` et `xt=1`).
- **Conséquences :**
  - Aucune classe Tailwind orpheline : la recherche de `100rem` et de
    `brightness-100` dans le CSS généré par `npm run build` confirme la
    présence des utilitaires (`max-w-[100rem]`, `brightness-0`,
    `group-hover:brightness-100`, `group-focus-visible:brightness-100`) dans
    le bundle de production - vérifié par exécution, pas par relecture seule.
  - Vérification visuelle (Playwright/Chromium, viewport 1920×1080) : les
    sections s'élargissent bien sur grand écran, le carrousel défile bord à
    bord (logos tronqués aux deux bords de la fenêtre), Verspieren est noir
    et lisible au repos, et le ruban du Hero reste fluide sans angle ni
    pincement sur plusieurs instants du cycle d'animation échantillonnés.
  - Pipeline `verify-frontend-change` exécuté dans son intégralité (build,
    type-check, lint, format, `vitest run` - 6 tests passants) : tout passe,
    aucune régression introduite par ces quatre changements indépendants.

## ADR 09 : V0.1.4 - layout 100 % fluide (`max-w-[100rem]` → `w-full` + padding fluide)
- **Contexte :** nouveau retour client sur la V0.1.3 (ADR 08) : `max-w-[100rem]`
  (1600px) reste une largeur maximale figée, et même généreuse elle laisse de
  grandes marges vides sur écrans 1920px et ultrawide (2560px et plus) - le
  contenu forme toujours une colonne centrale sur un moniteur suffisamment
  large, seulement plus large qu'avant. Le client demande cette fois un
  layout entièrement fluide, sans aucun plafond de largeur.
- **Décision :**
  1. **`max-w-[100rem]` → `w-full`, pas un nouveau palier arbitraire plus
     grand.** ADR 08 avait déjà tranché qu'un jeton `@theme` dédié n'avait pas
     de sens pour un seul palier ponctuel ; la même logique s'applique a
     fortiori ici - augmenter la valeur arbitraire (`max-w-[120rem]`,
     `[140rem]`...) n'aurait fait que déplacer le problème sur un écran
     encore plus large, potentiellement à l'infini avec l'apparition de
     moniteurs toujours plus grands. Seul `w-full` répond structurellement à
     une demande de fluidité totale, sans paramètre à recalibrer à la
     prochaine génération d'écran. Appliqué aux mêmes conteneurs qu'en ADR 08
     (huit sections de `HomeView.vue`, `TheFooter.vue`, `MegaMenu.vue` - nav
     et panneau -, `StyleguideView.vue`), par cohérence avec le périmètre déjà
     validé.
  2. **Échelle de padding fluide `px-6 md:px-12 lg:px-24 xl:px-32 2xl:px-40`,
     en remplacement de l'ancien padding, jamais en cumul.** Un conteneur
     `w-full` nu collerait son contenu aux bords de la fenêtre sur un grand
     écran - inacceptable pour la lisibilité et l'esthétique. Cette échelle
     croît avec le viewport (six paliers Tailwind standards, aucune valeur
     arbitraire nouvelle) : l'espace de respiration latérale augmente avec la
     largeur disponible, exactement l'inverse d'un `max-w` figé qui bloque le
     contenu à une largeur fixe passé un certain seuil. Elle remplace
     l'ancien `px-4 sm:px-6 lg:px-8` là où il vivait déjà (Hero, `MegaMenu`),
     et migre sur le `<section>` parent pour les six sections à grille qui
     portaient un `<div class="mx-auto max-w-[100rem]">` nu sans padding
     propre (Services, Secteurs, Valeur ajoutée, RSE, Équipe, Interviews) -
     c'est déjà là que vivait le padding horizontal existant de ces sections,
     le faire migrer sur le `<div>` interne aurait été un déplacement sans
     bénéfice.
  3. **Section Confiance : aucun changement de fond, seul le titre suit
     l'échelle.** `PartnerCarousel` est en full bleed depuis V0.1.3 (ADR 08) -
     sans padding ni `max-w`, par construction déjà « 100 % fluide ». Cette
     itération ne le touche pas : seul le padding horizontal du titre («
     Ils accélèrent avec nous ») suit la nouvelle échelle, pour rester
     cohérent avec les autres en-têtes de section.
  4. **Aucune largeur de lecture de texte modifiée.** `max-w-2xl`,
     `max-w-3xl` (paragraphes, `<header>` de section) et `max-w-5xl` (`<h1>`
     du Hero) restent inchangés : la demande client porte sur les conteneurs
     structurants qui bornaient la largeur totale d'une section, jamais sur
     la largeur de ligne d'un bloc de texte - un paragraphe étiré sur toute
     la largeur d'un écran 2560px deviendrait illisible (largeur de ligne
     très supérieure aux 75-90 caractères recommandés).
- **Conséquences :**
  - ADR 08 n'est pas supprimé ni réécrit : il reste l'historique valide de la
    décision V0.1.3 (le choix d'une valeur arbitraire plutôt qu'un jeton
    nommé, toujours pertinent pour comprendre pourquoi `max-w-[100rem]` a
    existé) - ADR 09 en est la suite, pas un remplacement silencieux.
  - Classes Tailwind générées vérifiées par grep du CSS de production
    (`npm run build`) : `w-full`, `px-6`, `md:px-12`, `lg:px-24`, `xl:px-32`
    et `2xl:px-40` (échappé `.\32 xl\:px-40` dans le CSS, Tailwind v4 échappe
    les sélecteurs commençant par un chiffre) sont bien présentes dans le
    bundle - aucune classe orpheline.
  - Vérification visuelle (Chromium headless, captures d'écran à 1920×1080 et
    2560×1080) : le contenu s'étire sur toute la largeur sans marge vide
    résiduelle, les grilles de cartes à 4 colonnes (Services, Secteurs,
    Valeur ajoutée, RSE) et à 3 colonnes (Interviews) restent proportionnées
    sans carte démesurément large ni déformée, les blocs de texte contraints
    restent à largeur de lecture raisonnable, le carrousel Confiance reste en
    full bleed edge-to-edge, et la nav/le footer suivent la même respiration
    fluide.
  - Pipeline `verify-frontend-change` exécuté dans son intégralité (build,
    type-check, lint, format, `vitest run` - 6 tests passants) : tout passe,
    aucune régression introduite.

## ADR 10 : V0.1.6 - filtre monochrome du carrousel (`mix-blend-multiply`) et adoucissement du tapering `WaveRibbon`

- **Contexte :** deux correctifs indépendants signalés après la V0.1.5.
  1. le filtre `brightness-0` du carrousel partenaires (ADR 08) crée un
     « gros bloc noir » sur les logos Kiabi et Mondial Relay ;
  2. le tapering du ruban `WaveRibbon` (V0.1.5) est jugé trop dur (convergence
     à un pixel unique, fondu trop abrupt, seuil de départ trop tardif).

- **Décision - carrousel partenaires :**
  1. **Diagnostic vérifié par lecture directe des SVG.** `kiabi.svg` et
     `mondial_relay.svg` contiennent chacun un vrai fond opaque
     (`fill="#040037"`, `fill="#96154a"`) SOUS un détail au tracé blanc plein
     (`fill="#fff"`, le motif intérieur de l'icône). `brightness-0` (ajouté en
     V0.1.3 pour sauver Verspieren, cf. ADR 08) assombrit tout pixel opaque au
     noir plein SANS distinction entre le tracé et un fond : les deux
     devenaient un noir strictement identique, effaçant le motif intérieur.
     `verspieren.svg`, à l'inverse, n'a aucun fond opaque (tracé blanc plein
     seul) - c'est justement ce cas qui avait motivé `brightness-0` en V0.1.3.
  2. **Piste testée puis explicitement écartée : corriger uniquement Kiabi et
     Mondial Relay à la source, garder `brightness-0`.** Un détail blanc
     peut être découpé en trou réellement transparent dans le fond (chemin
     unique `fill-rule="evenodd"`, ou `<mask>`) plutôt que peint en blanc
     opaque par-dessus. Cette technique fonctionne parfaitement SANS filtre
     CSS, et fonctionne aussi avec `grayscale` seul (vérifié par rendu réel,
     capture d'écran et échantillonnage de pixels). Mais dès qu'un filtre CSS
     `brightness()` - à n'importe quelle valeur, y compris `brightness-0` -
     s'ajoute à la chaîne sur un `<img>` chargeant ce SVG, la zone transparente
     redevient opaque dans le moteur de rendu utilisé pour cette vérification :
     reproduit sur un cas de test minimal (un simple carré SVG avec un trou
     rond, sans aucun rapport avec Kiabi) qui casse de façon identique dès
     qu'un `brightness()` entre dans la chaîne de filtres, y compris à des
     valeurs non nulles (`brightness(0.5)`). `contrast()` seul a été vérifié
     inoffensif pour la transparence, mais son point de bascule fixe
     (128/255) aurait pu pousser une couleur de logo dont la luminance
     perceptuelle dépasse ce seuil (le vert de Leroy Merlin, ≈ 62 %) vers le
     blanc au lieu du noir - aucune combinaison de filtres sans `brightness()`
     ne permet donc de forcer un noir uniforme sur des couleurs de logo
     variées tout en préservant une zone transparente. Cette piste est donc
     rejetée pour une raison technique vérifiée par l'observation, pas par
     préférence stylistique - recorriger `kiabi.svg`/`mondial_relay.svg` vers
     cette approche à l'avenir réintroduirait silencieusement le même risque
     si un filtre `brightness()` était réintroduit dans la chaîne.
  3. **Solution retenue : `grayscale` + `mix-blend-mode: multiply`, sans
     aucun `brightness()`.** `mix-blend-mode` est une opération de
     composition (comment les pixels déjà rendus de l'`<img>` se mélangent
     avec ce qu'il y a derrière), pas un filtre par pixel appliqué pendant le
     rendu interne du SVG - elle n'est donc pas concernée par le bug de
     transparence de `brightness()` ci-dessus. En mode `multiply`, un pixel
     blanc (`multiply(blanc, x) = x`) devient optiquement transparent : il
     laisse voir le fond de la section Confiance (`bg-light`) au travers,
     corrigeant Kiabi et Mondial Relay sans toucher à leurs fichiers source.
     `verspieren.svg` est corrigé à la source (`fill="#fff"` →
     `fill="#000066"`, exactement `--color-primary-900` du design system,
     ratio de contraste ≈ 16,3:1 sur `#f4f6ff`) : c'est un logo monochrome
     blanc conçu pour un fond sombre, utilisé ici uniquement sur fond clair
     (`tone="light"`, seul usage réel du composant) - le nom, la forme, le
     contenu du tracé restent identiques, seule la couleur de fill change
     pour son contexte d'usage réel (cf. CLAUDE.md : ce n'est pas une donnée
     métier inventée). `MONOCHROME_FILTER.dark` reste une chaîne vide : la
     formule `multiply(source, fond) = source × fond` tend vers 0 dès que le
     fond est sombre, quelle que soit la source - un futur usage `tone="dark"`
     devra choisir une stratégie dédiée, pas hériter de celle-ci.
  4. **Effet de bord assumé et documenté.** Les 5 logos qui n'avaient pas ce
     bug (Auchan, Boulanger, Decathlon, Leroy Merlin, Midas) ne restent pas
     pixel-identiques : `brightness-0` les forçait tous au noir pur (`#000`,
     un artifice indépendant de leur teinte réelle) ; sans lui, `grayscale`
     seul les convertit vers leur propre niveau de gris perceptuel (Midas
     reste inchangé, son tracé est noir par défaut du SVG sans attribut
     `fill`). Comme démontré au point 2, aucune combinaison de filtres CSS
     fiable (sans `brightness()`) ne permet de forcer ces 4 logos vers un noir
     pur uniforme tout en préservant la transparence nécessaire à la
     correction de Kiabi/Mondial Relay ; recolorer leurs SVG sources vers un
     gris/noir figé aurait été hors périmètre (ils ne présentent aucun bug) et
     une charge de maintenance à chaque futur partenaire. À l'échelle
     d'affichage réelle (32-36px de hauteur), ces 4 logos restent des
     silhouettes sombres et parfaitement lisibles.

- **Décision - tapering `WaveRibbon` :** trois réglages indépendants dans
  `taper()`/le dégradé de `drawFrame`, aucun changement à `wave`/`envelope`/
  `twist` :
  1. **Plancher d'amplitude `TAPER_FLOOR = 0,12`** (choisi par observation
     entre 0,1 et 0,15) : `taper` interpole désormais entre `TAPER_FLOOR` et
     `1` au lieu de `0` et `1`, pour ne plus jamais faire converger les 50
     lignes en une unique ligne d'un pixel (jugé trop dur/mécanique). La
     smoothstep quintique garde sa dérivée nulle aux deux bornes du plateau
     par simple rescale affine ;
  2. **`TAPER_START` de `0,55` à `0,62`**, mesuré par `getBoundingClientRect`
     sur le bloc de texte du Hero à 1440px et 1920px : le texte (contraint en
     `max-w-5xl`/`max-w-3xl`, des largeurs fixes en pixels) occupe une
     fraction DÉCROISSANTE de la largeur totale à mesure que le viewport
     grandit (jusqu'à 62 % à 1440px, seulement 48 % à 1920px). La piste de
     départ (`0,3`-`0,35`) a été testée réellement puis rejetée : à 1440px,
     l'évasement chevauchait visiblement la deuxième ligne du paragraphe
     (constaté par capture d'écran, pas supposé). `0,62` retient la fraction
     la plus contraignante des deux viewports vérifiés, acceptant un léger
     espace mort à 1920px plutôt qu'un chevauchement à 1440px ;
  3. **Fenêtre de fondu élargie à `TAPER_START + 0,35`** (au lieu de `+0,15`),
     avec un stop de dégradé supplémentaire, les deux suivant la même
     smoothstep quintique que `taper` (cohérence visuelle entre l'écartement
     géométrique et le fondu d'opacité) plutôt qu'une interpolation linéaire
     par défaut qui remontait plus vite que la forme géométrique.

- **Conséquences :**
  - Aucun nouveau `Math.abs()` introduit (contrainte de gouvernance V0.1.3
    toujours en vigueur, vérifiée par relecture du diff).
  - `kiabi.svg` n'est pas modifié (piste évaluée puis explicitement écartée,
    cf. point 2 ci-dessus) ; seul `verspieren.svg` est retouché parmi les
    fichiers SVG partenaires.
  - Classes Tailwind générées vérifiées par grep du CSS de production
    (`npm run build`) : `mix-blend-multiply` et les deux variantes
    `mix-blend-normal` (`:hover`, `:focus-visible`, sélecteurs `:is(:where(...))`
    générés par Tailwind v4 pour les modificateurs `group-*`) sont bien
    présentes dans le bundle.
  - Vérification visuelle réelle (Chromium/Playwright) : les 8 logos du
    carrousel au repos (Kiabi et Mondial Relay lisibles sans bloc noir,
    Verspieren toujours lisible et sombre, les 5 autres en silhouette sombre
    cohérente), le survol et le focus clavier restaurent la couleur d'origine
    et l'anneau de focus reste visible ; le ruban du Hero à 1440px et 1920px
    ne converge plus à un pixel, le fondu est continu sans bord perceptible,
    et aucun angle ne réapparaît sur les échantillons d'animation observés
    (0/1/3/6/10 s) ni sur la figure statique sous `prefers-reduced-motion`.
  - Pipeline `verify-frontend-change` exécuté dans son intégralité (build,
    type-check, lint, format, `vitest run` - 6 tests passants) : tout passe.

## ADR 11 : V0.1.7 - pivot architectural `WaveRibbon` : canvas algorithmique → image statique + CSS pur

- **Contexte :** de V0.1.2 à V0.1.6 (ADR 07 à ADR 10), `WaveRibbon` a fait
  l'objet de cinq passes de réglage indépendantes du canvas paramétrique
  (recalibrage d'amplitude, correctif de pincement mathématique, effilage
  horizontal, adoucissement du tapering) - un coût cumulé de réglage jugé
  trop élevé par le client, pour un résultat encore insatisfaisant, et un
  canvas jamais spécifiquement optimisé pour mobile (aucune réduction de
  densité de calcul selon la taille d'écran, contrairement à d'autres
  décors du projet). Le client tranche pour un pivot radical : abandon
  complet du canvas paramétrique au profit d'une image statique qu'il
  fournit lui-même (`client/src/assets/images/vague.svg`), avec une simple
  respiration en CSS pur.
- **Correction préalable :** le brief client désignait un fichier
  `vagues.svg` (pluriel) qui n'existe pas dans le dépôt ; le fichier réel,
  vérifié par `ls`, est `vague.svg` (singulier). Utilisé tel quel - aucun
  fichier supplémentaire créé, aucun asset inventé (cf. CLAUDE.md,
  intégrité du contenu).
- **Décision :**
  1. **Suppression totale du canvas et de sa logique.** `<canvas>`,
     `drawFrame`, `taper`, `renderFrame`, `startLoop`/`stopLoop`, `resize`,
     `ResizeObserver`, les gestionnaires `visibilitychange`/
     `prefers-reduced-motion` et toutes les constantes qui paramétraient le
     dessin (`LINE_COUNT`, `SEGMENTS`, `PHASE_SPEED`, `TAPER_START`,
     `TAPER_FLOOR`, `STATIC_PHASE`) sont retirés de `WaveRibbon.vue`.
     L'historique mathématique complet (V0.1 à V0.1.6) n'est plus recopié
     dans le composant : il reste tracé dans ce fichier (ADR 05 à ADR 10) et
     dans l'historique git du composant, pas dupliqué à deux endroits. Le
     composant final n'a plus besoin d'aucune logique de cycle de vie
     (`onMounted`/`onBeforeUnmount`/garde SSR) : un `<img>` se pré-rend
     nativement, sans écart d'hydratation possible puisqu'il n'a aucun état
     réactif calculé côté client - un import d'asset est le seul contenu du
     bloc `<script setup>` restant.
  2. **Recoloration du SVG à la source, pas de blend mode CSS sur le fichier
     fourni.** Diagnostic par lecture directe de `vague.svg` : le groupe
     racine porte `fill="#000000"` et le canevas ne contient aucun élément
     de fond (`<rect>`, `<path>` de contour plein cadre) - la zone
     hors-tracé est donc nativement transparente, pas un aplat blanc opaque
     (contrairement au risque identifié en ADR 10 pour `brightness()`/
     `invert()` sur une zone transparente creusée par `fill-rule="evenodd"`
     ou `<mask>` ; ici il n'y a ni l'un ni l'autre, juste une absence
     d'élément peint). Deux options étaient sur la table :
     - **Blend mode CSS (`mix-blend-screen`/`mix-blend-lighten`) sur le SVG
       tel que fourni (fill noir).** Écartée par calcul, pas par test
       visuel : les deux formules de composition valent, par définition,
       `screen(src, dst) = 1 − (1 − src)(1 − dst)` et
       `lighten(src, dst) = max(src, dst)`. Pour `src = 0` (noir), les deux
       se réduisent algébriquement à `dst` - le résultat est *exactement*
       la couleur du fond, quel que soit ce fond. Appliquer l'un de ces deux
       modes directement sur le SVG noir rendrait donc l'image
       structurellement invisible, pas simplement discrète : le même type
       de piège que le logo Verspieren en blanc plein sur fond clair
       (ADR 08/ADR 10), ici avec les rôles clair/sombre inversés.
     - **Recoloration à la source (retenue), sans blend mode ensuite.**
       `fill="#000000"` → `fill="#12d80a"`, exactement `--color-accent-500`
       du design system (`main.css`), dont le contraste contre
       `primary-900` (fond du Hero) est déjà documenté et calculé dans
       l'en-tête de `main.css` : 9,1:1, AAA. Une fois cette recoloration
       faite, un blend mode reste néanmoins écarté (contrairement à la
       suggestion du brief de « screen/lighten si nécessaire ») : ces deux
       modes fonctionnent parfaitement pour du blanc pur (`screen(1, dst) =
       lighten(1, dst) = 1` pour tout `dst`, la formule se réduit à la
       source), mais pas pour une couleur de marque saturée comme
       `#12d80a` (18, 216, 10). Calcul détaillé sur le seul canal qui
       diverge (`dst_bleu = 102/255 = 0,4` pour `primary-900`,
       `src_bleu = 10/255 ≈ 0,039` pour l'accent) :
       `screen_bleu = 1 − (1 − 0,039)(1 − 0,4) = 1 − 0,961 × 0,6 ≈ 0,424` et
       `lighten_bleu = max(0,039 ; 0,4) = 0,4` - les deux modes remontent le
       canal bleu du résultat d'environ `0,039` à `0,40`-`0,42`, un vert
       nettement moins pur que le jeton exact (canal bleu quasi nul dans
       `#12d80a`). La simple superposition alpha par défaut
       (`mix-blend-normal`, valeur initiale, aucune classe Tailwind
       nécessaire) est donc l'option retenue : elle seule restitue la
       couleur exacte et déjà vérifiée AAA du design system, sans la
       décaler vers le fond.
  3. **Intégration Tailwind.** `<img>` en `absolute inset-y-0 right-0 -z-10`
     (le `<section>` Hero de `HomeView.vue` reste `relative isolate
     overflow-hidden`, déjà en place, inchangé). `h-full w-auto
     object-contain` : `h-full` fixe une hauteur utilisée explicite (plutôt
     que de dépendre de la résolution `top`/`bottom` seule pour un élément
     remplacé), la largeur `auto` s'en déduit via le ratio intrinsèque du
     SVG (2000×1414, ≈1,41:1, proche de `√2`) ; `object-contain` préserve
     l'intégralité du tracé sans le rogner ni le déformer si une contrainte
     de largeur venait à s'ajouter plus tard - `object-cover` aurait pu
     rogner une partie du dessin selon la largeur réelle du conteneur, un
     risque non justifié pour un visuel décoratif dont la forme importe.
     `hidden lg:block` plutôt qu'une opacité réduite : un décor de fond
     n'apporte rien sur mobile où l'espace est dominé par le texte, et
     masquer complètement évite le coût de mise en page/rendu de l'image
     (pas seulement son poids visuel) - ce choix dispense aussi de
     `loading="lazy"` (qui n'aurait été nécessaire que pour une variante
     visible à opacité réduite sous `lg`).
  4. **Animation CSS, réutilisation d'un jeton existant.** Nouvelle entrée
     `--animate-pulse-soft-slow: pulse-soft 9s ease-in-out infinite;` dans
     `main.css`, à côté de `--animate-pulse-soft` (4s) - même `@keyframes
     pulse-soft`, seule la durée change, exactement la convention déjà en
     place pour `--animate-float`/`--animate-float-slow`. Aucun nouveau
     `@keyframes` créé. `motion-reduce:animate-none` neutralise cette
     animation décorative sans qu'aucune garde JS (`matchMedia`, listener)
     ne soit nécessaire : contrairement au canvas qu'elle remplace, une
     animation CSS neutralisée par ce sélecteur média laisse l'image
     statique et visible par construction.
- **Conséquences :**
  - `WaveRibbon.vue` perd toute sa complexité algorithmique : plus de
    `<script setup>` avec logique de cycle de vie, uniquement un import
    d'asset et un `<template>` à une seule balise `<img>`.
  - L'historique du canvas (ADR 05 à ADR 10, ainsi que l'historique git du
    fichier) reste la seule source de vérité pour un futur retour éventuel
    à un canvas algorithmique - cette décision documente explicitement
    pourquoi il ne faut pas y revenir sans en avoir mesuré à nouveau le
    coût/bénéfice.
  - Aucune vérification visuelle par capture d'écran ou navigateur piloté
    n'a été utilisée pour cette itération (contrainte client explicite,
    coût token jugé trop élevé lors des itérations précédentes) : la
    vérification s'appuie sur le calcul (blend modes), la lecture directe
    du SVG (absence de fond opaque, absence de `fill-rule="evenodd"`/
    `<mask>`), le grep du CSS de production, et la lecture du HTML pré-rendu
    (`dist/index.html`, SVG inliné en data URI par Vite sous le seuil
    `assetsInlineLimit`, fill `#12d80a` confirmé, classes attendues toutes
    présentes, aucun `<canvas>` résiduel).
  - Pipeline `verify-frontend-change` exécuté dans son intégralité (build,
    type-check, lint, format, `vitest run` - 6 tests passants, fumée HTTP
    200 sur `/` et sur le module `WaveRibbon.vue`) : tout passe.

## ADR 12 : V0.1.8 - correction d'urgence du positionnement `WaveRibbon`, renoncement définitif à l'animation de ce décor

- **Contexte :** retour visuel négatif du client sur le rendu livré en
  V0.1.7 (ADR 11) : l'image SVG du Hero se retrouvait minuscule, collée à
  l'extrême droite, quasiment invisible. Contrainte explicite de cette
  itération : aucune vérification par capture d'écran ni navigateur piloté
  (Playwright ou équivalent) - le diagnostic et le correctif reposent
  entièrement sur la lecture du code, le calcul de ratios et la lecture du
  CSS/HTML généré.
- **Décision - cette itération corrige des paramètres d'une décision déjà
  actée (ADR 11), elle ne rouvre pas l'arbitrage canvas → image statique
  lui-même.** Un ADR dédié est néanmoins justifié plutôt qu'une simple ligne
  dans `CURRENT_STATE.md`, pour deux raisons structurantes :
  1. **Diagnostic géométrique du bug, pas un simple ajustement de valeur.**
     `h-full w-auto object-contain` calait la largeur de l'image sur son
     ratio intrinsèque (2000×1414, ≈1,41:1) appliqué à la hauteur du Hero -
     sur un Hero desktop bien plus large que haut, la largeur résultante
     restait mécaniquement étroite et collée à `right-0`, sans jamais
     s'étendre vers le centre. Ce diagnostic (une contrainte de dimension
     intrinsèque mal choisie, pas une classe manquante) doit rester tracé
     pour qu'un futur agent ne retombe pas dans le même piège avec un autre
     asset au ratio différent ;
  2. **Renoncement définitif à l'animation de ce décor, pas un réglage.** Le
     brief client demande explicitement d'abandonner toute idée d'animation
     pour `WaveRibbon` - un arbitrage de portée différente d'un simple
     changement de durée ou d'easing (comme les passes V0.1.5/V0.1.6 sur le
     canvas). Le jeton `--animate-pulse-soft-slow` est retiré de `main.css`
     (vérifié par recherche globale : plus aucun consommateur après ce
     retrait) - une décision qui ferme une piste plutôt que de la régler,
     à distinguer des correctifs paramétriques de l'historique canvas
     (ADR 07 à ADR 10).
- **Décision - correctifs appliqués :**
  1. **Repositionnement `object-cover`.** `absolute inset-y-0 right-0 h-full
     w-auto object-contain` devient `absolute inset-0 h-full w-full
     object-cover object-right`. `object-contain`, qui préservait
     l'intégralité du tracé sans le rogner (raisonnement explicite d'ADR
     11), est délibérément abandonné : une fois l'objectif redéfini comme
     une couverture généreuse de la section plutôt qu'une fidélité totale au
     dessin, `object-cover` répond structurellement au symptôme (image
     visible sur toute la surface) sans dépendre du ratio intrinsèque de
     l'asset ;
  2. **Opacité `opacity-40`, pas `opacity-100`.** Le SVG reste recoloré en
     `#12d80a` (`--color-accent-500`, 9,1:1 AAA contre `primary-900`,
     ADR 11). Une fois l'image étendue par `object-cover` sur une large
     portion du Hero, la garder à pleine opacité transformerait une couleur
     d'accent saturée en aplat de grande surface - exactement ce que la
     règle transversale du Design System interdit (ADR 03 : l'accent est une
     couleur de touche, jamais un fond). `opacity-40` retient un point
     médian de la fourchette 30-50 % suggérée par le brief : le motif reste
     clairement identifiable sans dominer la surface comme un second fond
     saturé. Cette image reste décorative et hors de l'arbre d'accessibilité
     (`alt=""` + `aria-hidden="true"`) : la règle de contraste de texte
     (AA 4,5:1) ne s'y applique pas, seule la règle « touche, jamais aplat »
     motive ce choix ;
  3. **Aucun `mix-blend-mode` réintroduit**, conformément à la demande
     explicite du brief - vérifié qu'aucun n'était déjà présent dans le code
     V0.1.7 avant cette passe ;
  4. **`relative z-10` explicite sur le conteneur de texte du Hero
     (`HomeView.vue`), en paire avec `-z-10` explicite sur `WaveRibbon`.**
     Avant cette itération, le conteneur de texte ne portait ni `relative`
     ni `z-*` : il se retrouvait au-dessus du décor uniquement par un
     empilement implicite (`-z-10` sur l'image + `isolate` sur la
     `<section>` parente) - correct par construction aujourd'hui, mais
     fragile pour un futur ajout de contenu au Hero. Défense en profondeur
     demandée par le client, avec la paire de valeurs déjà suggérée par le
     brief (cohérente avec l'existant), pas une troisième valeur inventée ;
  5. **`hidden lg:block` non modifié.** La justification V0.1.7 (aucun coût
     de rendu sur mobile où l'espace est dominé par le texte, ADR 11) reste
     valide et n'entre en contradiction avec aucun aspect de la nouvelle
     stratégie `object-cover`.
- **Conséquences :**
  - `--animate-pulse-soft-slow` disparaît de `main.css` ; `--animate-pulse-soft`
    (4s), utilisée par `AnimatedBackground.vue`, n'est pas concernée.
  - `WaveRibbon.vue` perd toute logique liée à l'animation (plus de classe
    `animate-*` ni de garde `motion-reduce:animate-none` à neutraliser,
    puisqu'il n'y a plus rien à neutraliser) : le composant reste un unique
    `<img>` statique, sans aucun changement de structure par rapport à
    V0.1.7 (toujours un simple import d'asset en `<script setup>`).
  - Aucune vérification visuelle par capture d'écran ou navigateur piloté
    n'a été utilisée pour cette itération (contrainte client explicite) : le
    diagnostic (calcul de ratio 2000×1414 contre les proportions attendues
    du Hero) et la vérification s'appuient sur la lecture du code, le grep
    du CSS de production et la lecture du HTML pré-rendu (`dist/index.html`)
    - classes attendues présentes sur l'`<img>` et le `<div>` de texte, fill
    `#12d80a` confirmé, aucune classe orpheline propre à `WaveRibbon`.
  - Pipeline `verify-frontend-change` exécuté dans son intégralité
    (type-check, lint, format, `vitest run` - 6 tests passants, build de
    production, fumée HTTP 200 sur `/` et sur le module `WaveRibbon.vue`) :
    tout passe.

## ADR 13 : V0.1.9 - ticket #13, simplification du Hero et optimisation des largeurs

- **Contexte :** ticket client (« #13 ») demandant trois choses sur le Hero et
  la page entière : (1) un décor de Hero totalement statique, sans aucune
  animation ; (2) une réduction du padding horizontal des conteneurs
  principaux, jugé trop généreux sur grand écran ; (3) un élargissement des
  blocs de texte, pour réduire le nombre de lignes plutôt que d'allonger les
  sections verticalement. Le ticket désignait cette itération « V0.1.7 », un
  numéro déjà dépassé par le dépôt (en V0.1.8 au moment de la demande, cf.
  `docs/CURRENT_STATE.md`) : elle devient V0.1.9, à la suite de la précédente
  sans en rouvrir le contenu - même type d'écart de nommage que le fichier
  `vagues.svg`/`vague.svg` corrigé en ADR 11.
- **Décision - point 1, décor du Hero (aucun changement de code) :** lecture
  directe de `WaveRibbon.vue` avant toute modification : le retrait total des
  animations liées aux vagues du Hero est déjà acté depuis V0.1.8 (ADR 12).
  Le pivot canvas → image statique date de V0.1.7 (ADR 11) ; la dernière
  animation restante sur ce décor, une respiration CSS
  (`--animate-pulse-soft-slow`), a été retirée avec son jeton en V0.1.8, sur
  demande client déjà explicite à l'époque (« renoncement définitif », ADR
  12 - pas un simple réglage). Le composant est donc déjà, avant cette
  itération, un unique `<img>` sans `<canvas>`, sans `@keyframes`, sans classe
  `animate-*` ni transition. Documenter cette vérification négative dans un
  ADR plutôt que de la passer sous silence évite qu'un futur agent, lisant
  seulement le ticket, ne cherche à « corriger » un problème qui n'existe
  plus, ou pire, n'introduise une régression en croyant partir d'un état
  encore animé.
- **Décision - point 2, réduction du padding horizontal :**
  1. **`px-6 md:px-12 lg:px-24 xl:px-32 2xl:px-40` (V0.1.4, ADR 09) →
     `px-4 sm:px-6 lg:px-8 xl:px-12`.** L'échelle fluide de V0.1.4 répondait à
     une demande différente (occuper toute la largeur sans plafond de
     conteneur, `w-full`) : elle croissait donc délibérément avec le
     viewport, jusqu'à `10rem` de marge par bord sur très grand écran
     (`2xl:px-40`). Le retour client de cette itération porte sur l'excès de
     cette croissance : à `2xl`, la marge cumulée des deux bords (20rem)
     grignotait une part significative de la largeur utile, perçue comme un
     contenu « écrasé au centre » malgré l'absence de tout `max-w`. L'échelle
     de remplacement retient des paliers Tailwind standards sans valeur
     arbitraire (cohérent avec le choix déjà fait en ADR 08/09 de préférer la
     palette native), plafonnés à `xl:px-12` (3rem) au lieu de croître encore
     à `2xl` - au-delà de `xl`, l'espace gagné doit revenir au contenu, pas au
     padding ;
  2. **Périmètre identique à ADR 09, plus `StyleguideView.vue`.** Les huit
     conteneurs de section de `HomeView.vue`, `TheFooter.vue` et les deux
     conteneurs de `MegaMenu.vue` (nav + panneau) reçoivent la nouvelle
     échelle - même liste de fichiers que la précédente passe de padding,
     par construction puisqu'il s'agit du même mécanisme qu'on resserre, pas
     d'un nouveau périmètre à redécouvrir. `StyleguideView.vue`, qui suivait
     déjà la règle « même échelle que le reste du site » depuis ADR 09, la
     suit encore ici ;
  3. **Section Contact : alignement, pas de changement d'échelle.** Ce bloc
     n'avait jamais migré vers l'échelle fluide de V0.1.4 (il était resté sur
     `px-4 py-24 sm:px-6 lg:px-8`, un standard proche de la cible de cette
     itération) - il reçoit uniquement le dernier palier manquant
     (`xl:px-12`) pour rester cohérent avec le nouveau standard commun,
     aucune régression à corriger ;
  4. **`PartnerCarousel` (section Confiance) non concerné.** Le carrousel
     reste en full bleed depuis V0.1.3 (ADR 08), sans padding ni `max-w` par
     construction - seul le titre au-dessus (« Ils accélèrent avec nous »)
     suit la nouvelle échelle, comme il suivait déjà l'ancienne.
- **Décision - point 3, élargissement des blocs de texte :**
  1. **Renversement délibéré de la règle posée en V0.1.4 (ADR 09).** ADR 09
     avait tranché que les largeurs de lecture de texte (`max-w-2xl`,
     `max-w-3xl`, `max-w-5xl` sur les `<header>`, le `<h1>` et les
     paragraphes) ne devaient jamais suivre l'élargissement des conteneurs
     structurants, au nom de la lisibilité (75-90 caractères par ligne). Le
     ticket #13 demande explicitement l'inverse pour cette itération :
     privilégier la largeur du contenu à son allongement vertical, y compris
     au prix de lignes plus longues que la fourchette de lecture
     recommandée - un arbitrage produit assumé par le client, pas une
     lecture différente de la même contrainte technique ;
  2. **Hero.** `<h1>` : `max-w-5xl` → `max-w-7xl` (le texte lui-même reste
     verrouillé en deux lignes `flex-col` depuis ADR 06 - le correctif du bug
     de saut de ligne du machine à écrire - cette largeur ne joue donc que
     sur la limite de retour à la ligne de chaque span, jamais sur leur
     nombre). Paragraphe : `max-w-3xl` → `max-w-5xl` ;
  3. **En-têtes de section.** `max-w-2xl` → `max-w-4xl` pour les titres courts
     à une seule ligne (Services, Secteurs, RSE, Interviews) : l'élargissement
     ne change rien à leur rendu visuel actuel (ils tenaient déjà sur une
     ligne), mais laisse de la marge avant un futur titre plus long. Le bloc
     Valeur ajoutée (titre + paragraphe de trois phrases) passe de
     `max-w-3xl` à `max-w-5xl`, où le gain de largeur réduit effectivement le
     nombre de lignes du paragraphe. Paragraphe Équipe : `max-w-2xl` →
     `max-w-4xl`, même logique ;
  4. **Contact.** Conteneur englobant : `max-w-4xl` → `max-w-6xl` ;
     paragraphe : `max-w-2xl` → `max-w-4xl` ;
  5. **Grilles de cartes non concernées.** `grid-cols-*` (Services, Secteurs,
     Valeur ajoutée, RSE, Interviews) exploitaient déjà toute la largeur de
     leur conteneur `w-full` depuis ADR 09 - la demande du ticket
     (« continuer d'exploiter toute la largeur disponible ») était donc déjà
     satisfaite, vérifiée par relecture avant de conclure qu'aucun changement
     n'y était nécessaire.
- **Conséquences :**
  - ADR 09 n'est pas réécrit ni supprimé : il reste l'historique valide de la
    décision V0.1.4 (pourquoi l'échelle fluide et la préservation stricte des
    largeurs de lecture avaient alors été choisies) - ADR 13 documente un
    changement de décision ultérieur sur les deux points, pas une correction
    d'erreur.
  - Aucune classe Tailwind arbitraire nouvelle : uniquement des paliers
    standards déjà présents dans la palette native (`px-4`, `sm:px-6`,
    `lg:px-8`, `xl:px-12`, `max-w-4xl`, `max-w-5xl`, `max-w-6xl`,
    `max-w-7xl`). Vérifié par grep du CSS de production
    (`npm run build`) : toutes les classes attendues sont présentes dans le
    bundle. Les tokens de l'ancienne échelle (`md:px-12`, `2xl:px-40`, etc.)
    ne survivent que comme valeurs textuelles dans des commentaires
    d'historique (jamais dans un attribut `class`) - un résidu de
    documentation déjà présent avant cette itération pour l'historique des
    passes précédentes (ADR 08/09), pas une classe orpheline nouvelle.
  - Lecture directe du HTML pré-rendu (`dist/index.html`) : le `<h1>` du Hero
    porte `max-w-7xl`, son paragraphe `max-w-5xl`, et l'`<img>` de
    `WaveRibbon` ne porte aucune classe `animate-*` ni de balise `<canvas>`
    résiduelle.
  - Pipeline exécuté sans Playwright ni capture d'écran, contrainte client
    explicite pour cette itération : `npm run type-check`, `npm run lint` et
    `npm run build` passent tous les trois ; la vérification visuelle finale
    du rendu (équilibre des marges, nombre de lignes réellement obtenu sur
    chaque bloc de texte élargi) reste à confirmer par un humain ou un agent
    disposant d'un navigateur, limite documentée plutôt que passée sous
    silence - même réserve méthodologique que celle déjà posée en ADR 07 et
    ADR 11.

## ADR 14 : V0.1.10 - retrait total du décor du Hero (`WaveRibbon`), verrouillage de la police Poppins

- **Contexte :** le message client identifiait cette itération « V0.1.9 », un
  numéro déjà attribué au ticket #13 (padding/largeurs, cf. ADR 13) traité
  juste avant - elle devient V0.1.10, à la suite de la précédente sans en
  rouvrir le contenu, même écart de nommage que celui déjà rencontré et
  documenté en ADR 11/ADR 13. Deux demandes indépendantes :
  1. le client signale une « trace fantôme » persistante sur le fond du
     Hero - l'inspecteur HTML montre toujours une balise `<img>` avec un SVG
     encodé en data URI et une opacité réduite, et il exige un fond bleu nuit
     100 % uni, sans aucune image ni opacité résiduelle ;
  2. verrouillage de la typographie du site entier sur une unique police,
     « Poppins », avec vérification qu'aucune autre police ne s'y glisse.
- **Décision - point 1, retrait du décor :**
  1. **La « trace fantôme » n'est pas un bug - c'est `WaveRibbon` qui
     fonctionnait exactement comme conçu.** Lecture du composant avant toute
     modification : l'`<img>` décrite par le client (`pointer-events-none
     absolute inset-0 ... opacity-40 ...`, source `data:image/svg+xml...`)
     correspond trait pour trait au rendu attendu du composant depuis
     V0.1.8 (ADR 12) - un décor décoratif volontairement atténué
     (`opacity-40`), pas un artefact ni une régression technique. Le
     désaccord est donc purement produit : le client ne veut plus de ce
     décor du tout, sous aucune forme, pas seulement le corriger. Documenter
     cette distinction évite qu'un futur agent, lisant seulement « trace
     fantôme », ne cherche un bug de positionnement ou d'opacité mal
     calculée là où il n'y en a pas ;
  2. **Suppression complète, pas seulement désactivation.** `<WaveRibbon />`
     est retiré du template de `HomeView.vue` (et son import), puis le
     fichier `components/ui/WaveRibbon.vue` lui-même est supprimé, ainsi que
     l'asset qu'il consommait en exclusivité,
     `assets/images/vague.svg` - vérifié par recherche globale (`grep -rl`)
     avant suppression qu'aucun autre composant, vue ou test ne les
     référençait. Même principe que le retrait de `DataCore` en ADR 06 :
     « un composant qui ne sert plus nulle part n'est pas une réutilisation
     future, c'est de la dette » - recréer un décor de Hero dans le futur
     partira d'une page blanche plutôt que de ressusciter un fichier
     inerte ;
  3. **Nettoyage des classes de stacking devenues inutiles.** `relative
     isolate overflow-hidden` sur la `<section>` Hero et `relative z-10`
     explicite sur le conteneur de texte (ajoutés en défense en profondeur
     par ADR 12, justement pour empiler ce décor sous le texte) n'ont plus
     aucune raison d'être une fois le décor supprimé : aucun enfant de la
     section n'est plus positionné en absolu, il n'y a donc plus rien à
     isoler ni à empiler. Les conserver aurait laissé des classes mortes,
     contraire au principe de ne pas garder de code sans fonction.
- **Décision - point 2, police unique Poppins :**
  1. **Diagnostic préalable : `'Inter'` n'était jamais réellement chargée.**
     Avant cette itération, `--font-display`/`--font-body` valaient déjà
     `'Inter', ui-sans-serif, system-ui, sans-serif` dans `main.css`, mais
     aucun mécanisme de chargement n'existait nulle part dans le projet -
     ni `<link>` vers Google Fonts dans `index.html`, ni `@font-face`
     déclarée à la main, ni package `@fontsource`. Le navigateur retombait
     donc silencieusement sur `ui-sans-serif`/`system-ui` (la police système
     du visiteur), jamais sur Inter. Ce diagnostic change la nature du
     correctif : renommer la seule chaîne `'Inter'` en `'Poppins'` sans rien
     d'autre aurait reproduit exactement le même problème - le site continue
     d'afficher la police système, pas Poppins, et l'exigence client
     (« le site entier doit être exclusivement en Poppins ») resterait
     non satisfaite malgré un code qui semble correct en lecture rapide ;
  2. **Police auto-hébergée (`@fontsource/poppins`), pas un lien
     `fonts.googleapis.com`.** Deux options existaient pour charger
     réellement Poppins : un lien CDN Google Fonts (solution la plus rapide
     à écrire), ou un package npm auto-hébergé qui embarque les fichiers
     `.woff2`/`.woff` dans le build. Le CDN est écarté pour deux raisons
     propres à ce projet : (a) ce site collecte des candidatures et des
     demandes de contact (RGPD, cf. CLAUDE.md) - un CDN de police tiers
     envoie l'adresse IP de chaque visiteur à Google à chaque chargement de
     page, un point régulièrement contesté par les autorités de protection
     des données européennes pour des sites qui n'ont pas explicitement
     consenti l'utilisateur à ce transfert ; (b) le déploiement Nginx du
     projet porte des en-têtes de sécurité stricts dont une CSP (cf.
     `docs/CURRENT_STATE.md`) - un CDN externe y ajoute un domaine à
     autoriser, une surface de confiance supplémentaire pour un gain
     (latence de mise en cache partagée) minime face à des polices qui
     pèsent de toute façon quelques dizaines de kilo-octets. `@fontsource/
     poppins` (ajouté aux dépendances, pas aux dev-dépendances : la police
     fait partie du rendu de production, pas seulement de l'outillage) sert
     les fichiers depuis le même domaine que le reste du site, sans requête
     tierce ;
  3. **Seuls les poids réellement utilisés sont importés.** `grep` des
     classes `font-(bold|extrabold|semibold)` sur `client/src/**/*.vue`
     avant de choisir quoi importer : le site n'utilise que le texte
     normal (400, implicite), semi-gras (600), gras (700) et extra-gras
     (800) - aucun usage de 100/200/300/500/900 ni d'italique. `main.css`
     importe donc exactement `@fontsource/poppins/{400,600,700,800}.css`,
     pas le paquet complet ni un poids non consommé ;
  4. **Fichiers « toutes écritures », pas les variantes `latin-only`.**
     `@fontsource/poppins` propose deux formes d'import par poids : un
     fichier combiné couvrant plusieurs écritures avec `unicode-range` par
     bloc (latin, latin étendu, cyrillique, devanagari…), et des fichiers
     mono-écriture sans `unicode-range` (`latin-400.css`,
     `latin-ext-400.css`…). Le français utilise la ligature `œ` (« cœur »,
     présent tel quel dans le contenu réel de `HomeView.vue`, section
     Équipe) qui appartient au bloc Latin Étendu-A (U+0152-0153), pas au
     Latin de base - vérifié par calcul de point de code
     (`U+0153`, dans l'intervalle `U+0100-02BA` du bloc `latin-ext` déclaré
     avec son `unicode-range` dans le fichier combiné). Importer uniquement
     les fichiers `latin-*.css` mono-écriture, sans `unicode-range`, aurait
     fait dépendre le rendu de « cœur » de l'ordre de déclaration CSS entre
     deux `@font-face` identiques (même famille, même poids, glyphes
     différents) - un comportement non garanti par la spécification CSS.
     Le fichier combiné est donc retenu malgré son coût : il déclare aussi
     des `@font-face` pour des écritures jamais utilisées sur ce site
     (cyrillique, devanagari, vietnamien…), dont les fichiers `.woff2`
     finissent copiés dans `dist/assets/` au build sans jamais être
     réclamés par un navigateur réel (le `unicode-range` empêche tout
     téléchargement pour des caractères absents de la page - coût nul en
     bande passante, seulement quelques fichiers supplémentaires sur le
     disque de déploiement) ;
  5. **`--font-mono` non concernée, à dessein.** `'JetBrains Mono'` reste la
     valeur de ce jeton : il sert exclusivement les extraits de code et
     raccourcis clavier de `StyleguideView.vue` (page de documentation
     interne du Design System, jamais de contenu public), un rôle
     sémantique distinct de la typographie de marque que le ticket vise
     explicitement (« des titres aux boutons »). Le fondre dans Poppins
     aurait cassé la convention (déjà en place ailleurs dans ce fichier,
     jetons `font-mono` pour tout extrait de code) qui rend un identifiant
     de code visuellement distinct du texte courant ;
  6. **Recherche de classes de police parasites : aucune trouvée.** `grep`
     de `font-sans`, `font-serif`, `font-inter`, `font-roboto` (et
     variantes) sur `client/src/**/*.vue` : zéro occurrence utilisant un
     utilitaire Tailwind de police brut - tout le design system passe déjà
     par les jetons sémantiques `font-display`/`font-mono` déclarés dans
     `@theme`. Le seul `font-sans` présent dans le CSS de production
     provient du thème par défaut de Tailwind v4 lui-même (variable interne
     `--font-sans`, jamais consommée par une classe utilisée dans le
     projet) - vérifié par grep du code source avant de conclure qu'il n'y
     avait rien à corriger sur ce point.
- **Conséquences :**
  - `docs/CODEMAP.md` régénéré (`scripts/generate-codemap.py`) : la
    dépendance `HomeView.vue → components/ui/WaveRibbon.vue` disparaît de la
    cartographie automatique, comme `DataCore` en ADR 06.
  - `client/package.json` gagne une dépendance de production,
    `@fontsource/poppins` - la première police auto-hébergée du projet,
    précédent à suivre pour toute police future plutôt que d'introduire un
    lien CDN au coup par coup.
  - Aucun écart d'hydratation introduit : le retrait de `WaveRibbon` et le
    changement de police sont tous deux purement structurels/CSS, sans
    toucher à un état réactif calculé côté client (ADR 01).
  - Vérifié par exécution (`npm run type-check`, `npm run lint`,
    `vitest run` - 6 tests passants, `npm run build`), par grep du CSS de
    production (présence de `@font-face` pour `Poppins` aux poids
    400/600/700/800, absence totale de `Inter`) et par lecture directe du
    HTML pré-rendu (`dist/index.html`) : aucune balise `<img>` ni `<canvas>`
    dans la `<section>` Hero, aucun résidu `data:image/svg+xml` lié à
    l'ancien décor. **Aucune vérification par capture d'écran ni navigateur
    piloté (Playwright ou équivalent) n'a été utilisée pour cette
    itération, contrainte client explicite** - même réserve méthodologique
    que celle déjà posée en ADR 07, ADR 11 et ADR 13.

## ADR 16 : V0.1.12 - ticket #14, refonte de la Navbar et du Footer autour de deux CTA de conversion

- **Contexte :** le client demande d'épurer la Navbar et le Footer et de
  concentrer l'attention sur deux actions de conversion principales,
  identiques dans les deux zones : « Nous contacter » et « Nous rejoindre ».
  Concrètement : (1) retirer les icônes de réseaux sociaux et les anciennes
  icônes de contact du Header ; (2) les remplacer par ces deux CTA, côte à
  côte en desktop, empilés pleine largeur en mobile ; (3) raccourcir les
  intitulés de navigation pour les aligner sur les sections qu'ils ciblent ;
  (4) reprendre les réseaux sociaux dans le Footer et y rendre les deux mêmes
  CTA visibles. Contrainte explicite de cette itération : aucune vérification
  par Playwright ou navigateur piloté - la vérification s'appuie sur le
  pipeline `type-check`/`lint`/`vitest`/`build` et sur la lecture du HTML
  pré-rendu, même réserve méthodologique que les itérations du Hero (ADR 07,
  11, 12, 13, 14).
- **Décision - Header, deux CTA au lieu de trois éléments concurrents :**
  1. **Retrait complet, pas seulement déplacement, de la pilule « Discutons
     IA » (créneau `#leading` de `MegaMenu`).** Le brief demande de
     « concentrer l'attention sur deux actions de conversion principales » -
     une troisième pilule à gauche du logo, même de variante différente,
     resterait une troisième action concurrente dans le même Header. Le
     créneau `#leading` de `MegaMenu.vue` n'est pas supprimé du composant
     (il reste un point d'extension générique du Design System) : seul son
     usage dans `App.vue` disparaît, la donnée `mainNav.ts` ne le
     mentionne plus dans sa documentation ;
  2. **Icônes LinkedIn et mail retirées du créneau `#actions`, pas
     seulement cachées.** Même logique que le retrait de `DataCore`
     (ADR 06) ou de `WaveRibbon` (ADR 14) : un élément qui ne doit plus
     apparaître dans le Header n'y reste pas en `hidden`, il est retiré du
     template. L'icône LinkedIn n'est pas supprimée du projet : son
     `href` placeholder (`LINKEDIN_HREF`, jamais résolu - cf. commentaire
     existant, aucune URL officielle fournie) et son tracé SVG sont
     déplacés tels quels dans `TheFooter.vue`, sans modification ;
  3. **Deux `BaseButton` remplacent l'ancien trio « Consulter nos offres »
     (desktop) / « Consulter nos offres » + « Discutons IA » + téléphone
     (mobile).** Gabarit demandé par le client (image de référence) : un
     bouton à bordure vide suivi d'un bouton plein. Traduit dans le Design
     System existant sans nouvelle variante : `variant="outline"` (bordure
     navy, sobre) pour « Nous contacter », `variant="accent"` (aplat vert,
     couleur de plus haute intention selon la doc de `ButtonVariant` dans
     `types.ts`) pour « Nous rejoindre », avec une flèche en `iconRight`
     pour renforcer le sens directionnel demandé par le brief. Aucune
     nouvelle variante de `BaseButton` n'a été nécessaire : les deux
     habillages demandés existaient déjà et sont déjà vérifiés AAA/AA
     (cf. commentaires de contraste dans `BaseButton.vue`) ;
  4. **Cible commune `{ path: '/', hash: '#contact' }` pour les deux CTA,
     dans les trois emplacements (Header desktop, menu mobile, Footer).**
     Aucune page dédiée « contact » ou « recrutement » n'existe (site limité
     à `/`, cf. `mainNav.ts`) : inventer une ancre ou une route pour
     distinguer les deux intentions aurait été un lien mort ou une donnée de
     navigation fabriquée (cf. CLAUDE.md, intégrité du contenu). La section
     Contact (`#contact`) reste la seule destination de conversion réelle de
     la page ; le Footer utilisait déjà cette même cible pour son propre lien
     « Nous rejoindre » (`footerNav.ts`, antérieur à cette itération) - cette
     décision généralise un choix déjà pris, elle n'en invente pas un
     nouveau ;
  5. **Flèche du CTA « Nous rejoindre » dupliquée en composant fonctionnel
     local (`ArrowRightIcon`, `App.vue`), pas importée depuis `HomeView.vue`.**
     `HomeView.vue` porte déjà un pictogramme fonctionnel équivalent (`Icon`
     + constante `ARROW`, section Contact) - l'importer depuis la coquille
     aurait fait remonter une donnée de vue vers `App.vue`, sens inverse de
     la règle de dépendance du README (`views/` → `features/` →
     `components/ui/`, jamais l'inverse). Le tracé SVG (`M4 12h16m-6-6 6
     6-6 6`) est le même, dupliqué une fois plutôt que remonté.
- **Décision - intitulés de navigation raccourcis et alignés sur les ID de
  section (`mainNav.ts`) :**
  | Ancien intitulé | Nouvel intitulé | Section ciblée |
  |---|---|---|
  | « Notre collectif » | « L'Équipe » | `#equipe` |
  | « Je suis une entreprise » | « Expertises » | `#services` |
  | « Je suis candidat » | « Témoignages » | `#interviews` |
  | « Références » | « Secteurs » | `#secteurs` (colonnes inchangées) |

  « Expertises » est retenu plutôt que « Nos Offres » (alternative suggérée
  par le brief) : une fois les deux CTA « Nous contacter »/« Nous rejoindre »
  en place, « Offres » entrerait en concurrence sémantique avec « Nous
  rejoindre » (offres d'emploi) alors que cette entrée cible `#services`
  (offre de prestations, pas de recrutement) - « Expertises » lève
  l'ambiguïté sans changer la cible. « Je suis candidat », qui pointait déjà
  vers `#interviews` (témoignages de collaborateurs, pas une liste d'offres),
  devient « Témoignages » plutôt que « Carrières » pour la même raison :
  nommer la section pour ce qu'elle contient réellement, pas pour une
  destination de recrutement qu'elle ne porte pas.
- **Décision - Footer (`TheFooter.vue`), deux nouveaux créneaux nommés :**
  1. **`#social`**, rendu sous la baseline de marque (colonne de gauche) -
     emplacement conventionnel pour des réseaux sociaux, qui ne concurrencent
     plus les CTA du Header une fois déplacés ici ;
  2. **`#ctas`**, rendu en pleine largeur entre la grille de colonnes et la
     barre basse (mentions légales) - emplacement choisi pour rester visible
     sans dépendre de la largeur d'une seule colonne sur desktop (`lg:grid-
     cols-[2fr_1fr_1fr_1.4fr]`, la colonne de marque n'occupe qu'une fraction
     de la largeur totale). Les deux `BaseButton` y sont rendus à la taille
     `lg`, `surface="dark"` (fond `bg-primary-950`), avec la même disposition
     `flex-col`/`sm:flex-row` + `block`/`sm:w-auto` que l'unique autre duo de
     CTA « pleine taille » déjà en place sur le site (section Contact
     d'`HomeView.vue`) - cohérence de gabarit plutôt qu'une troisième
     disposition inventée pour ce cas ;
  3. **Bouton « Nous écrire » (mailto) retiré du bloc Contact du Footer.**
     Il faisait doublon avec le nouveau « Nous contacter », rendu juste
     au-dessus de la barre basse - le garder aurait réintroduit un troisième
     CTA dans le Footer, contraire à l'objectif du ticket. L'adresse, le
     téléphone et le courriel restent affichés en texte/liens simples dans ce
     bloc, sans bouton.
- **Conséquences :**
  - `MegaMenu.vue` n'est pas modifié : les créneaux `#leading`/`#actions`/
    `#mobileActions` restent des points d'extension génériques du composant,
    seul leur usage dans `App.vue` change. Le composant reste réutilisable
    pour un futur consommateur qui aurait besoin d'une pilule `#leading`.
  - Aucune classe Tailwind orpheline : vérifié par grep du CSS de production
    (`npm run build`) - les classes du gabarit CTA (`gap-3`, `size-9`,
    `sm:w-auto`, etc.) sont présentes dans le bundle.
  - Lecture directe du HTML pré-rendu (`dist/index.html`) : les anciens
    libellés du Header (« Discutons IA », « Consulter nos offres », « Je
    suis une entreprise », « Je suis candidat ») n'apparaissent plus dans la
    navigation ; « Nous contacter » et « Nous rejoindre » apparaissent bien
    dans le Header ET dans le Footer ; l'icône LinkedIn n'apparaît plus
    qu'une fois (Footer). Le menu mobile (`#mobileActions`), derrière un
    `v-if` fermé par défaut, n'est pas présent dans le HTML pré-rendu - sa
    mise à jour est vérifiée par lecture directe du template, pas par le
    rendu SSR (même limite que toute portion de `MegaMenu` conditionnée par
    un état d'interaction, non spécifique à cette itération).
  - Pipeline exécuté dans son intégralité (`npm run type-check`, `npm run
    lint`, `npm run format` - vérifié, aucune correction nécessaire après un
    premier passage, `vitest run` - 6 tests passants, `npm run build`) : tout
    passe. **Aucune vérification par capture d'écran ni navigateur piloté
    (Playwright ou équivalent) n'a été utilisée pour cette itération,
    contrainte client explicite** - la vérification finale du rendu réel
    (alignement des deux boutons, proportions sur mobile) reste à confirmer
    par un humain ou un agent disposant d'un navigateur, limite documentée
    plutôt que passée sous silence, même réserve méthodologique que celle
    posée en ADR 07/11/13/14.

## ADR 17 : V0.1.13 - ticket #15, retrait de la section « Gardons contact » (`HomeView`), coordonnées réelles et réseaux sociaux du Footer

- **Contexte :** le client fournit une capture de la section de pré-footer
  « Gardons contact » (titre, texte, bouton « Nous écrire ») et la signale
  comme un doublon - la V0.1.12 (ADR 16) vient d'installer deux CTA globaux
  « Nous contacter »/« Nous rejoindre » dans le Header et le Footer, rendant
  cette troisième zone de conversion, propre à `HomeView.vue`, redondante.
  Le ticket demande également le remplacement des coordonnées de
  remplissage du Footer par les vraies coordonnées du client, et
  l'élargissement du bloc réseaux sociaux (1 → 4 icônes).
- **Décision - retrait de la section Contact, pas seulement de son
  contenu textuel :**
  1. **Suppression complète de la `<section id="contact">` de
     `HomeView.vue`**, y compris son usage d'`AnimatedBackground` (variante
     `aurora`, tone `dark`) et des deux `BaseButton` qu'elle contenait
     (« Nous écrire » mailto, téléphone `ghost`). Le composant
     `AnimatedBackground` n'est pas retiré du Design System : il reste
     utilisé par `TheFooter.vue` avec la même variante - seul son usage
     dans `HomeView.vue` disparaît, jugé décoratif redondant une fois la
     section qui le portait supprimée (même logique que le retrait de
     `DataCore` en ADR 06 : un import sans consommateur restant est de la
     dette, pas une réutilisation future) ;
  2. **Nettoyage en cascade des dépendances devenues orphelines.** Le
     pictogramme fonctionnel `Icon` et la constante `ARROW` (flèche du
     bouton « Nous écrire ») n'avaient aucun autre consommateur dans
     `HomeView.vue` : supprimés avec leurs imports (`h`, `type
     FunctionalComponent` de `vue`, `BaseButton` de
     `components/ui/BaseButton.vue`). `OUTLINE_WHITE`/`OUTLINE_NAVY`,
     utilisées par d'autres sections (Confiance, Secteurs, Valeur ajoutée,
     RSE), ne sont pas concernées - vérifié par grep de chaque identifiant
     avant suppression, pas par supposition ;
  3. **Le commentaire d'ADR 14 (V0.1.10) affirmant qu'`AnimatedBackground`
     « reste utilisé ailleurs sur la page (section Contact) » devient
     inexact avec ce retrait.** Le commentaire correspondant dans
     `HomeView.vue` est corrigé pour refléter l'état actuel (plus aucun
     usage dans ce fichier, usage restant dans `TheFooter.vue`) plutôt que
     laissé à décrire un état révolu comme s'il était toujours vrai -
     principe déjà appliqué à chaque retrait de décor (ADR 06, ADR 14) : ne
     jamais laisser un commentaire affirmer une fausseté vérifiable par
     lecture du code.
- **Décision - ancres `#contact` mortes, mesure temporaire vers un
  `mailto` direct :** la suppression de la section prive tout lien
  `{ path: '/', hash: '#contact' }` de sa cible. Un tel lien ne provoque
  aucune erreur visible (la navigation reste sur place, sans faute JS ni
  404) - un silence plus trompeur qu'un lien mort explicite, puisque rien
  ne signale à l'utilisateur que le clic n'a rien fait. Recherche exhaustive
  de toute occurrence de `#contact` dans `client/src` avant correction
  (`grep -rn`), trois emplacements trouvés en plus des deux CTA globaux déjà
  connus :
  1. **`App.vue`** : les deux CTA globaux (Header desktop, menu mobile,
     Footer) - la constante partagée `CONTACT_TARGET` devient `CONTACT_HREF
     = mailto:${EMAIL}`, et les trois paires de boutons passent de `:to` à
     `:href` ;
  2. **`footerNav.ts`** : le lien « Nous rejoindre » de la colonne
     « L'agence » (antérieur à V0.1.12, c'est lui qui avait fixé le
     précédent « `#contact` = destination de conversion » suivi par l'ADR
     16) - passe de `to: { path: '/', hash: '#contact' }` à `href:
     'mailto:contact@faceel-it.com'` ;
  3. **`NotFoundView.vue`** : le bouton « Nous signaler le problème » de la
     page 404, jusqu'ici hors du radar des deux itérations précédentes sur
     la navigation - même correctif.

  Un mailto n'est pas la destination finale visée (le ticket parle d'« en
  attendant une page dédiée ») : c'est documenté comme mesure temporaire à
  chaque emplacement modifié, pas comme une décision d'architecture
  définitive - à remplacer par une vraie route dès qu'une page contact/
  recrutement existera. Aucune ancre ni route n'est inventée pour combler
  ce vide (cf. CLAUDE.md, intégrité du contenu) : un mailto direct reste,
  après le retrait de la section, la seule destination de conversion
  réellement existante sur le site.
- **Décision - coordonnées officielles du Footer (`App.vue`) :** les
  valeurs de remplissage (« Wasquehal / Hauts-de-France », `+33 3 59 61 71 88RÔLE : FRONTEND-UI-ENGINEER
  Ceci est une nouvelle session de travail (V0.1.14). Initialise ton contexte en lisant CLAUDE.md, docs/CURRENT_STATE.md et docs/DECISIONS.md.
  RAPPEL STRICT : INTERDICTION ABSOLUE de lancer Playwright ou des scripts de tests visuels automatisés. Base-toi uniquement sur le code et ton expertise Vue 3.

ACTION REQUISE : ITÉRATION V0.1.14 - REFONTE SECTION SERVICES (CARROUSEL)
Le client souhaite réduire la charge textuelle de la section "La tech au service des métiers" (probablement #services).

1. Refonte structurelle (De Grille à Carrousel) :

Diagnostic : Actuellement, les 4 cartes sont affichées en même temps dans une grille.

Action : Supprime la grille. À la place, affiche le grand titre de section en haut ("La tech au service des métiers"). En dessous, crée un affichage type Carrousel/Slider qui ne montre qu'une seule grande carte à la fois.

Contrôles : Ajoute des flèches de navigation (gauche/droite) de part et d'autre de la carte centrale (ou intégrées élégamment en bas de la carte) pour permettre à l'utilisateur de passer manuellement à la slide suivante/précédente. Utilise des icônes SVG simples et claires.

2. Design de la Carte Active (Nouvelle DA) :

La carte affichée doit être large et aérée (max-w-3xl ou max-w-4xl centré au milieu de la section).

Applique le nouveau système de surlignage marqueur (défini en V0.1.11, ex: bg-gradient-to-t from-accent-500/30 to-transparent bg-[length:100%_40%] bg-bottom bg-no-repeat) sur le titre de la carte affichée (ex: sur "Accélération", "Performance", etc.).

Le texte descriptif s'affiche en dessous, de manière lisible.

3. Logique d'Animation et SSG (Vue 3) :

Autoplay : La carte doit changer automatiquement toutes les 5 secondes (5000ms).

Attention Vite-SSG : La gestion du temps (setInterval) doit impérativement être instanciée dans onMounted et nettoyée dans onBeforeUnmount pour ne pas bloquer le pré-rendu statique côté serveur.

A11y (Accessibilité) :

Le timer automatique doit se mettre en pause si la souris survole le composant (@mouseenter) ou s'il reçoit le focus (@focusin).

Si prefers-reduced-motion est actif (via window.matchMedia), désactive complètement l'autoplay.

Transition : Utilise <Transition mode="out-in" name="fade"> de Vue avec des classes CSS simples (opacité et légère translation) pour un passage en douceur entre deux cartes.

4. Gouvernance :

Mets à jour le docs/CURRENT_STATE.md (Refonte section services en carrousel interactif).

Documente ce choix d'UX dans docs/DECISIONS.md (Réduction de la charge cognitive en passant d'une grille à un focus par slide).

Fournis le code Vue modifié pour cette section et confirme la gestion sécurisée du SSR/SSG pour le timer.`) sont remplacées par les coordonnées transmises par le client
  (adresse : 10 allée du Château Blanc, 59290 Wasquehal ; téléphone : `03
  59 61 71 88` / `tel:+33359617188`) - reprises telles que fournies, orthographe
  du nom de voie normalisée en casse française standard (« Château Blanc »)
  sans changer l'adresse elle-même. Le courriel (`contact@faceel-it.com`)
  était déjà correct depuis l'origine, inchangé. La signature de la barre
  basse du Footer (« Faceel-IT - ESN, Wasquehal, Hauts-de-France. ») n'est
  pas touchée : c'est une mention distincte du bloc adresse, toujours
  exacte, hors périmètre de ce ticket.
- **Décision - quatre réseaux sociaux dans le Footer, icônes générées :**
  1. **LinkedIn, YouTube, Instagram, Glassdoor**, URLs fournies par le
     client. Le lien LinkedIn cesse d'être un placeholder `#` (cf. ADR 16 :
     « aucune URL officielle fournie ») - la vraie URL est maintenant
     connue, le commentaire de réserve qui l'accompagnait est retiré avec
     elle ;
  2. **Icônes SVG minimalistes générées pour cette itération, pas des
     logos de marque reproduits à l'identique.** Le brief demande des
     tracés « minimalistes, couleur unie » plutôt que les logos officiels
     pixel-exacts (des marques déposées) : LinkedIn reprend le tracé déjà
     en place depuis V0.1.12 (fill, `currentColor`) ; YouTube est un
     rectangle plein avec un triangle en évidement (`fill-rule="evenodd"`,
     une seule couleur) ; Instagram est un pictogramme à trois primitives
     SVG natives (`rect` à coins arrondis, deux `circle`, tracé au trait
     plutôt qu'au remplissage - plus fidèle à la silhouette réellement
     reconnaissable de ce réseau) ; Glassdoor réutilise l'étoile déjà
     dessinée et vérifiée dans `RatingBadge.vue` (`components/ui/`), déjà
     utilisée sur cette page pour afficher la note Glassdoor - cohérence
     visuelle avec un tracé déjà existant plutôt qu'un nouveau logo
     approximatif inventé pour l'occasion ;
  3. **`target="_blank"` + `rel="noopener noreferrer"` sur les 4 liens**,
     exigence explicite du brief : `noopener` empêche la page ouverte de
     piloter l'onglet d'origine via `window.opener` (référence Tabnabbing),
     `noreferrer` empêche l'envoi de l'en-tête `Referer` (ce site) vers un
     domaine tiers - même paire déjà utilisée sur ce site pour les liens
     sortants de `PartnerCarousel.vue` (logos partenaires), pas une
     pratique inventée pour l'occasion ;
  4. **Pas d'abstraction en `v-for` sur un tableau de données.** Les 4
     icônes n'ont pas la même structure SVG interne (certaines en simple
     `fill`, Instagram à trois primitives distinctes) : les factoriser en
     boucle aurait exigé de stocker du SVG sous forme de chaîne (`v-html`,
     déconseillé même pour du contenu statique et fiable) ou une
     ramification par réseau dans le template - aucune des deux options
     n'aurait simplifié quoi que ce soit à seulement 4 éléments. Quatre
     blocs `<a>` explicites, cohérents avec la façon dont LinkedIn était
     déjà écrit avant cette itération.
- **Conséquences :**
  - Aucune classe Tailwind orpheline : vérifié par grep du CSS de
    production (`npm run build`) après le retrait de la section Contact et
    l'ajout des icônes sociales.
  - Lecture directe du HTML pré-rendu (`dist/index.html`) : « Gardons
    contact » n'apparaît plus, aucune `href` ne contient plus `#contact`,
    la nouvelle adresse/le nouveau téléphone sont présents une fois chacun,
    les 4 URLs de réseaux sociaux sont présentes une fois chacune avec
    `target="_blank" rel="noopener noreferrer"` - vérifié qu'elles
    s'ajoutent aux 8 liens sortants déjà existants de `PartnerCarousel`
    (même attribut), pas qu'elles les dupliquent.
  - Pipeline exécuté dans son intégralité (`npm run type-check`, `npm run
    lint`, `npm run format`, `vitest run` - 6 tests passants, `npm run
    build`) : tout passe. **Aucune vérification par capture d'écran ni
    navigateur piloté (Playwright ou équivalent) n'a été utilisée pour
    cette itération, contrainte client explicite** - la vérification finale
    du rendu réel (alignement des 4 icônes, lisibilité de l'adresse sur
    mobile) reste à confirmer par un humain ou un agent disposant d'un
    navigateur, limite documentée plutôt que passée sous silence, même
    réserve méthodologique que celle posée en ADR 07/11/13/14/16.

## ADR 18 : V0.1.14 - ticket #16, section Services en carrousel interactif (réduction de la charge cognitive)

- **Contexte :** le client juge la section « La tech au service des
  métiers » trop chargée textuellement - 4 `HighlightCard` affichées
  simultanément en grille, chacune avec un titre et une description. La
  demande n'est pas de raccourcir le texte, mais de changer la STRUCTURE de
  présentation : ne montrer qu'un contenu à la fois (une grande carte
  centrée), avec une navigation manuelle (flèches) et automatique
  (autoplay 5 s). C'est un choix d'UX - réduire la charge cognitive
  instantanée en séquençant l'information plutôt qu'en l'exposant toute
  d'un coup - pas une réduction du contenu lui-même : les 4 services
  restent intégralement présents et accessibles, seul l'ordre de
  découverte change (séquentiel plutôt que simultané).
- **Décision - nouveau composant générique `components/ui/CardCarousel.vue`,
  pas une logique ad hoc dans `HomeView.vue` :**
  1. **Composant du Design System, purement mécanique.** Suit le même
     principe que `PartnerCarousel`/`HighlightCard`/`RatingBadge` : aucune
     donnée métier, seulement `count` (nombre de diapositives) et `label`
     (nom de région pour les technologies d'assistance) en props, un
     créneau scopé `#slide="{ index }"` pour le contenu réel. Le composant
     n'affiche jamais les `count` diapositives à la fois (contrairement à
     un `v-for` de grille) : une seule invocation du créneau, à l'indice
     actif, à chaque instant - c'est cette différence mécanique avec
     `PartnerCarousel` (défilement continu de TOUS les logos) qui justifie
     un second composant plutôt qu'une variante du premier ;
  2. **Pas de générique TypeScript (`<script setup generic="T">`).** Une
     alternative aurait été de typer `CardCarousel<T>` avec `items: T[]` en
     prop et de laisser le composant itérer lui-même. Écartée : la
     diapositive affichée dépend de la mise en forme voulue par l'appelant
     (ici, `HighlightCard` avec un créneau `title` enrichi) - le composant
     n'a besoin de connaître que le NOMBRE de diapositives, jamais leur
     contenu ; lui faire porter un tableau générique aurait ajouté une
     couche d'indirection sans bénéfice, l'appelant devant de toute façon
     tout restituer via le créneau scopé.
- **Décision - minuteur SSR-safe, même patron que le typewriter du Hero
  (ADR 05/06) :** `setInterval` instancié exclusivement dans `onMounted`
  (jamais au niveau racine du `<script setup>` ni dans un calcul de rendu),
  nettoyé dans `onBeforeUnmount`. `onMounted` ne s'exécute jamais pendant le
  pré-rendu `vite-ssg` (ADR 01) : aucun minuteur ne peut donc jamais
  s'amorcer côté serveur, ce qui bloquerait ou retarderait indéfiniment le
  processus de build. Preuve par l'exécution, pas seulement par lecture du
  code : `npm run build` inclut la phase `[vite-ssg] Rendering Pages...` et
  se termine sans jamais rester bloqué - un `setInterval` mal placé (au
  niveau racine du script, par exemple) aurait empêché le processus Node de
  se terminer normalement après le rendu.
- **Décision - accessibilité, trois mécanismes indépendants :**
  1. **Pause au survol ET au focus, jamais un arrêt définitif.**
     `@mouseenter`/`@focusin` positionnent un drapeau `paused`,
     `@mouseleave` le lève immédiatement, `@focusout` ne le lève que si le
     focus quitte réellement le composant - même garde `relatedTarget` que
     `MegaMenu.onFocusOut` (un `relatedTarget` nul lors d'un clic sur une
     zone non focusable ne doit pas lever la pause). Un utilisateur clavier
     qui tabule jusqu'à un bouton de la carte doit pouvoir la lire sans
     qu'elle change sous lui, mais l'autoplay doit reprendre normalement
     une fois qu'il s'éloigne - un arrêt permanent après la première
     interaction aurait été une régression fonctionnelle non demandée ;
  2. **`prefers-reduced-motion` désactive l'autoplay, pas la navigation.**
     Sous cette préférence, `startAutoplay()` n'est jamais appelé (ni au
     montage, ni après un changement de préférence en cours de session via
     l'écouteur `change`, même patron que le Hero) - mais les flèches
     restent pleinement fonctionnelles : la préférence porte sur les
     changements DÉCLENCHÉS PAR LE SYSTÈME, pas sur la possibilité pour
     l'utilisateur de naviguer lui-même. La transition elle-même
     (`enter-active-class`/`leave-active-class`) porte aussi
     `motion-reduce:transition-none` : même un changement manuel devient
     instantané sous cette préférence, cohérent avec la règle transversale
     du Design System (CLAUDE.md : toute animation décorative neutralisée
     sous `prefers-reduced-motion`) ;
  3. **Pas d'`aria-live` sur la région.** Le motif ARIA « Carousel » des
     Authoring Practices déconseille explicitement d'annoncer chaque
     changement automatique de diapositive : un lecteur d'écran serait
     interrompu toutes les 5 s sans que l'utilisateur l'ait demandé. La
     mise en pause au focus (point 1) est le mécanisme qui protège un
     utilisateur clavier/lecteur d'écran - un `aria-live="polite"`
     supplémentaire aurait été une fausse sécurité en plus d'être bruyant.
     Le compteur « X / N » reste visible pour les utilisateurs voyants,
     `aria-hidden="true"` (redondant avec les `aria-label` des boutons de
     navigation, qui suffisent à orienter un utilisateur non-voyant).
- **Décision - `<Transition mode="out-in">` sans classes CSS nommées, en
  écart délibéré avec la formulation littérale du ticket (`name="fade"`) :**
  le ticket demande explicitement `<Transition mode="out-in" name="fade">`
  avec des classes CSS - ce qui suppose un bloc `<style>` déclarant
  `.fade-enter-from`/`.fade-enter-active`/etc. Or aucun composant de ce
  dépôt ne contient de bloc `<style>` (vérifié par recherche globale avant
  d'écrire le composant) : les deux usages existants de `<Transition>`
  (`MegaMenu.vue`, panneaux desktop et mobile) utilisent systématiquement
  les props `enter-active-class`/`enter-from-class`/`leave-active-class`/
  `leave-to-class` avec des utilitaires Tailwind, jamais `name` +
  CSS séparé. `mode="out-in"` est conservé tel que demandé (compatible à
  l'identique avec les deux approches) ; seul le mécanisme de classes change,
  pour le même résultat visuel exact demandé par le brief (fondu + léger
  décalage vertical) sans introduire la première feuille de style `<style>`
  du projet pour un seul composant. Choix documenté ici plutôt que silencieux
  : un futur agent qui relirait le ticket sans ce contexte pourrait croire à
  un oubli.
- **Décision - surlignage marqueur appliqué à un titre de carte, première
  fois pour ce cas d'usage :** le style `bg-linear-to-t from-accent-500/30
  to-transparent bg-[length:100%_40%] bg-bottom bg-no-repeat` (introduit en
  V0.1.11/ADR 15 pour des fragments de paragraphe) est repris à l'identique,
  sans nouvelle variante, appliqué au premier mot de chaque titre de service
  via le nouveau créneau `#title` de `HighlightCard`. Contraste inchangé par
  rapport à l'usage déjà vérifié en ADR 15 (texte `text-primary-900` sur le
  lavis composite, 13,1:1 AAA) : même combinaison de couleurs, seul le
  conteneur (un titre `text-title` en gras plutôt qu'un paragraphe) change,
  ce qui ne dégrade jamais un contraste déjà mesuré sur la même paire de
  couleurs.
- **Décision - `HighlightCard.vue` gagne un créneau `title` optionnel,
  rétrocompatible :** `<slot name="title">{{ title }}</slot>` remplace
  `{{ title }}` - la prop `title` reste obligatoire (fallback par défaut du
  créneau, et seule valeur affichée par tous les appels existants qui ne
  fournissent pas ce créneau). Alternative écartée : dupliquer toute la
  structure de `HighlightCard` (ombre, tonalité, trait d'accent, transition
  de survol) dans `HomeView.vue` pour ce seul cas - la carte du carrousel a
  besoin exactement du même habillage que les cartes de grille existantes,
  seul le contenu du titre change. Réutiliser le composant existant en
  l'étendant d'un créneau additif est cohérent avec le principe déjà en
  place dans ce dépôt (cf. `defineSlots` de `MegaMenu`/`TheFooter` :
  plusieurs créneaux nommés optionnels plutôt qu'un composant figé).
- **Conséquences :**
  - Aucune classe Tailwind orpheline : vérifié par grep du CSS de production
    (`npm run build`) - la classe de grille à 4 colonnes reste présente
    (utilisée par Secteurs/Valeur ajoutée/RSE, non concernées par ce
    ticket), aucune classe propre à l'ancien rendu de Services ne subsiste.
  - `noUncheckedIndexedAccess` (actif dans `tsconfig.app.json`) empêchait
    d'indexer `SERVICES[index]` directement dans le template (l'indice
    provient d'un créneau scopé, typé `number` sans lien statique avec la
    longueur du tableau) : une fonction `activeService(index)` documente
    l'invariant réel (`CardCarousel` garantit `0 <= index < count`) avec une
    assertion non-nulle explicite, plutôt qu'une garde défensive pour un cas
    qui ne peut pas se produire (cf. CLAUDE.md, ne pas valider l'invalidable).
  - Pipeline exécuté dans son intégralité (`npm run type-check`, `npm run
    lint`, `npm run format`, `vitest run` - 6 tests passants, `npm run
    build`, y compris la phase de rendu SSG) : tout passe, le build ne reste
    jamais bloqué - preuve directe que le minuteur est bien scellé dans le
    cycle de vie client. **Aucune vérification par capture d'écran ni
    navigateur piloté (Playwright ou équivalent) n'a été utilisée pour
    cette itération, contrainte client explicite** - la vérification finale
    du rendu réel (fluidité de la transition, proportions de la carte sur
    mobile) reste à confirmer par un humain ou un agent disposant d'un
    navigateur, limite documentée plutôt que passée sous silence, même
    réserve méthodologique que les itérations précédentes.

## ADR 19 : V0.1.15 - ticket #17, agrandissement du carrousel, retrait du surlignage de titre, généralisation à Secteurs

- **Contexte :** deux retours indépendants sur le carrousel Services livré
  en V0.1.14 (ADR 18), plus une demande d'extension :
  1. la carte centrale est jugée trop petite par rapport à l'espace
     disponible (conteneur, marges internes, typographie) ;
  2. le surlignage marqueur posé sur le titre (ADR 18) fait doublon avec le
     trait d'accent déjà affiché sous le titre - arbitrage client tranché :
     « le trait suffit », le surlignage est retiré ;
  3. la section Secteurs (grille de 4 `HighlightCard` sombres) doit
     recevoir la même mécanique de carrousel, avec une demande explicite de
     factorisation (« composant réutilisable ») pour ne pas dupliquer la
     logique complexe (autoplay, pause, SSR, `prefers-reduced-motion`,
     flèches) entre les deux sections.
- **Constat préalable - le ticket demande une factorisation déjà faite en
  V0.1.14, vérifié par lecture du code avant toute modification.**
  `components/ui/CardCarousel.vue` (ADR 18) a été conçu dès sa création
  comme un composant générique et réutilisable : il ne connaît que `count`
  (nombre de diapositives) et `label`, aucune donnée métier, le contenu
  réel passant par un créneau scopé `#slide`. Il n'y avait donc RIEN à
  extraire - le composant existant couvre déjà exactement le besoin de
  Secteurs, il suffit de l'utiliser une seconde fois avec ses propres
  données. Documenter cette vérification négative évite qu'un futur agent,
  lisant seulement le ticket, ne crée un second composant dupliqué
  (`ContentSlider.vue` ou autre) redondant avec `CardCarousel` - même
  principe que la vérification négative posée en ADR 13 (point 1, décor du
  Hero déjà statique) : constater qu'un travail est déjà fait est en soi une
  part du travail de ce ticket, pas un non-résultat à passer sous silence.
- **Décision - agrandissement, nouveau gabarit `size` sur `HighlightCard`
  plutôt qu'un override de classes Tailwind depuis l'appelant :**
  1. **Piste écartée : passer `class="p-12 lg:p-16"` depuis `HomeView.vue`
     en plus des classes déjà portées par le composant.** Le padding de
     `HighlightCard` (`p-6 sm:p-8`) est déjà présent dans sa propre classe
     statique - Vue fusionne le `class` d'un appelant en l'ajoutant à la
     suite de la classe du composant dans l'attribut HTML final, mais deux
     utilitaires Tailwind de même spécificité (`.p-6` et `.p-12`, par
     exemple) ne se départagent pas selon leur ORDRE dans cet attribut : le
     gagnant dépend de l'ordre où Tailwind a généré les deux règles dans la
     feuille de style compilée, un détail d'implémentation du bundler, pas
     du DOM. Fiabiliser un override de padding par ce mécanisme serait
     fragile et non garanti dans le temps (un futur changement de contenu
     de `main.css` pourrait réordonner silencieusement les deux classes) ;
  2. **Solution retenue : prop `size` (`CardSize`, `'md' | 'lg'`, cf.
     `types.ts`), même patron que `tone`/`CardTone` déjà en place.** Une
     table `SIZES: Record<CardSize, { root; title; body }>` regroupe les
     trois classes qui varient par gabarit (marges du conteneur, palier de
     titre, taille du corps de texte) - même structure que `TONES`,
     cohérente avec la convention déjà documentée dans ce fichier
     (`FOCUS_RING`/`MONOCHROME_FILTER` de `PartnerCarousel`, ADR 08 : une
     table explicite plutôt qu'un ternaire, pour qu'un futur gabarit reste
     un choix visible à faire). `md` (défaut) reproduit exactement
     l'habillage d'origine - zéro régression sur les grilles encore en
     place (Valeur ajoutée, RSE) qui ne passent pas cette prop ;
  3. **Palier de titre : `text-title` → `text-display`, pas une valeur
     arbitraire.** `text-display` est le palier immédiatement supérieur
     dans l'échelle fluide de `main.css`, déjà utilisé pour les `<h2>` de
     section - la carte devient le second niveau de lecture le plus
     imposant de la page (jamais aussi massive que `text-mega`, réservé au
     Hero), sans introduire de nouveau jeton typographique pour un seul
     usage ;
  4. **Marges `p-8 sm:p-12 lg:p-16`, pas `p-12 lg:p-16` tel que suggéré
     littéralement par le ticket.** Un plancher mobile à `p-8` (plutôt que
     de démarrer directement à `p-12`) est conservé : sur un écran à
     320-375px de large, `p-12` (3rem, soit 6rem cumulées sur les deux
     bords) réduirait sensiblement la largeur de ligne utile du texte,
     contraire à l'esprit mobile-first déjà appliqué à chaque section de ce
     projet (cf. ADR 04, 09, 13). L'intention du ticket (marges nettement
     plus généreuses qu'avant) est respectée dès `sm:` et pleinement à
     `lg:`, sans sacrifier le petit écran ;
  5. **Conteneur de carte `max-w-3xl` → `max-w-5xl`.** Le client proposait
     `5xl` ou `6xl` ; `5xl` est retenu - c'est déjà la largeur du paragraphe
     du Hero et de l'en-tête Valeur ajoutée (ADR 13), pas une nouvelle
     valeur d'échelle à mémoriser pour ce seul usage.
- **Décision - retrait du surlignage, créneau `#title` non supprimé du
  composant :** la carte Services revient à passer `title` en prop simple
  (plus de créneau `#title` ni de `<span>` de surlignage). Le créneau
  `#title` de `HighlightCard` (ajouté en V0.1.14 précisément pour ce
  surlignage) reste néanmoins dans le composant, sans consommateur après ce
  retrait - même principe déjà posé en ADR 15 pour le créneau `icon` de ce
  même composant (« reste disponible pour un futur usage réellement
  porteur de sens ») : un créneau optionnel générique, contrairement à un
  composant ou une constante entière sans consommateur (`DataCore`,
  `WaveRibbon`, `Icon`/`ARROW`), n'est pas assimilable à de la dette - c'est
  une capacité du composant, pas du code mort. `splitTitle` (`HomeView.vue`,
  fonction spécifique à cette page, pas une primitive du Design System) est
  en revanche supprimée avec son seul appelant : elle n'a plus aucune
  raison d'exister une fois le surlignage retiré, ce cas correspond
  exactement au principe qui a justifié le retrait d'`Icon`/`ARROW` en
  ADR 17.
- **Décision - Secteurs : réutilisation directe de `CardCarousel`, aucune
  variante créée.** `<CardCarousel :count="SECTORS.length" label="Nos
  secteurs d’activités">`, structurellement identique à l'usage Services
  (seule la tonalité `dark` de `HighlightCard` change, déjà le fond de
  cette section depuis l'origine). Une fonction `activeSector(index)` est
  ajoutée, miroir exact d'`activeService` (même garantie d'indice valide
  fournie par `CardCarousel`, même assertion documentée plutôt qu'une garde
  pour un cas impossible sous `noUncheckedIndexedAccess`) - dupliquer cette
  fonction à deux lignes plutôt que d'abstraire un helper générique
  `activeItem<T>(list, index)` : les deux tableaux (`SERVICES`, `SECTORS`)
  restent des données de page distinctes, la fonction n'a de sens que liée
  à son propre tableau, une factorisation supplémentaire n'aurait
  rien simplifié à ce volume (deux fonctions de deux lignes chacune).
- **Conséquences :**
  - Aucun second composant carrousel créé : le dépôt garde un seul
    `CardCarousel.vue`, désormais consommé deux fois sur la même page - la
    preuve par l'usage que la conception V0.1.14 était bien généraliste dès
    l'origine, pas seulement en théorie.
  - Deux instances indépendantes de `CardCarousel` sur `HomeView` : chaque
    instance porte son propre état (`activeIndex`, `paused`,
    `autoplayInterval`, `reduceMotionQuery`) déclaré dans `<script setup>`
    (donc par instance de composant, jamais au niveau module) - aucun
    risque de partage d'état ou de conflit de minuteur entre les deux
    carrousels, vérifié par la réussite du build SSG (`npm run build`) qui
    monte, exécute et démonte silencieusement les deux instances côté
    serveur sans jamais rester bloqué.
  - `HighlightCard.vue` reste rétrocompatible : tout appelant existant qui
    ne passe pas `size` continue de recevoir l'habillage `md` identique à
    avant cette itération (vérifié par grep du CSS de production - `p-6`,
    `sm:p-8`, `text-title` toujours présents pour les grilles Valeur
    ajoutée/RSE, inchangées).
  - Pipeline exécuté dans son intégralité (`npm run type-check`, `npm run
    lint`, `npm run format`, `vitest run` - 6 tests passants, `npm run
    build`, y compris la phase de rendu SSG) : tout passe, aucun blocage.
    **Aucune vérification par capture d'écran ni navigateur piloté
    (Playwright ou équivalent) n'a été utilisée pour cette itération,
    contrainte client explicite** - la vérification finale du rendu réel
    (équilibre visuel de la carte agrandie, lisibilité du corps de texte en
    `text-lg`) reste à confirmer par un humain ou un agent disposant d'un
    navigateur, limite documentée plutôt que passée sous silence, même
    réserve méthodologique que les itérations précédentes.

## ADR 20 : V0.1.16 - ticket #18, flèches latérales du carrousel dès `md:`, généralisation à RSE

- **Contexte :** deux demandes indépendantes sur `CardCarousel` après la
  V0.1.15 (ADR 19) :
  1. la disposition empilée (flèches + compteur sous la carte, seule
     disposition existante depuis V0.1.14) laisse un vide immense de chaque
     côté de la carte centrale sur grand écran - retour client explicite ;
  2. la section Politique RSE (grille de 4 `HighlightCard` sombres,
     inchangée depuis V0.1.11/ADR 15) doit recevoir la même mécanique de
     carrousel que Services et Secteurs, pour un rendu homogène sur les
     trois blocs.
- **Constat préalable, même principe qu'ADR 19 (point Secteurs) : rien à
  extraire pour RSE.** `CardCarousel` reste un composant générique sans
  donnée métier (`count` + `label`, contenu via le créneau `#slide`) - la
  généralisation à RSE est une troisième invocation du même composant,
  jamais une variante ni un fork. Vérifié par lecture du code avant toute
  modification.
- **Décision - repositionnement des flèches, duplication des boutons plutôt
  que réordonnancement CSS :**
  1. **Piste écartée : réordonner un jeu unique de boutons avec `order` et
     `flex-wrap` (élément `basis-full` pour forcer le compteur sur sa propre
     ligne en desktop).** Techniquement faisable, mais plus fragile qu'il n'y
     paraît : le point de rupture de ligne dépendrait alors de la largeur
     réelle de la carte fournie par l'appelant (`HighlightCard` avec
     `class="mx-auto max-w-5xl"`) combinée à celle du conteneur - un
     comportement à revalider à chaque futur changement de gabarit de carte,
     pour un gain (un seul jeu de boutons dans le DOM) qui n'a pas de valeur
     pratique ici ;
  2. **Solution retenue : deux paires de boutons prev/next, une paire de
     compteurs, chaque élément visible dans une seule disposition à la
     fois via `hidden`/`md:*`.** `hidden` (Tailwind : `display: none`)
     retire l'élément masqué de l'arbre d'accessibilité ET de l'ordre de
     tabulation - à n'importe quel viewport, exactement une paire de
     boutons prev/next et un compteur sont focusables/annoncés, jamais deux.
     Un `<button>` sans contenu de créneau (juste un `aria-label` et une
     icône SVG `aria-hidden`) est bon marché à dupliquer, contrairement à la
     carte elle-même (`<slot name="slide">`) qui ne doit jamais être rendue
     deux fois - dupliquer son contenu doublerait tout élément interactif
     qu'elle contient (ex. un futur lien de pied de carte) avec le même
     `aria-label`, deux cibles concurrentes pour un lecteur d'écran. Seuls
     les contrôles mécaniques du carrousel (boutons, compteur décoratif
     `aria-hidden`) sont dupliqués, jamais le contenu métier ;
  3. **Structure retenue.** `<div class="flex flex-col items-center gap-6
     md:flex-row md:justify-center md:gap-8">` regroupe la paire desktop
     (`hidden md:inline-flex`) et la carte ; un second bloc `md:hidden`
     reprend la disposition d'origine (flèches + compteur en ligne, sous la
     carte) pour le mobile ; un troisième élément, un `<p aria-hidden>`
     `hidden md:block`, affiche le compteur seul sous la carte en desktop
     (les flèches n'y sont plus dans cette ligne). `justify-center gap-8`
     plutôt que `justify-between` : la carte porte déjà son propre
     `max-w-5xl mx-auto`, `justify-between` aurait poussé les flèches
     jusqu'aux bords du conteneur `CardCarousel` (potentiellement très loin
     de la carte sur un très grand écran, la page étant en layout fluide
     `w-full` depuis ADR 09) - `justify-center` garde le trio flèche/carte/
     flèche visuellement groupé, quelle que soit la largeur disponible.
- **Décision - section RSE : réutilisation directe de `CardCarousel`, aucune
  variante créée.** `<CardCarousel :count="RSE_CARDS.length" label="Politique
  RSE">`, structurellement identique aux usages Services/Secteurs (`size="lg"`,
  `class="mx-auto max-w-5xl"` sur la carte, tonalité `dark` déjà le fond de
  cette section). `activeRse(index)`, ajoutée sur le même patron
  qu'`activeService`/`activeSector` (ADR 18/19) - même garantie d'indice
  valide fournie par `CardCarousel`, même choix de ne pas factoriser un
  helper générique `activeItem<T>` pour trois fonctions de deux lignes
  chacune, raisonnement déjà posé en ADR 19. Seule différence avec les deux
  autres usages : `RseCard` porte un champ `badge?` optionnel (déjà présent
  avant cette itération, pour la carte Ecovadis) - transmis à `HighlightCard`
  via `activeRse(index).badge ?? ''`, exactement le même patron `?? ''` déjà
  utilisé pour `InterviewCard.role` (ADR 12, `exactOptionalPropertyTypes`
  interdit de passer `undefined` explicitement à un prop optionnel).
- **Conséquences :**
  - Aucun second composant carrousel créé, aucune variante de `CardCarousel`
    introduite : le dépôt garde un seul fichier, désormais consommé trois
    fois sur `HomeView` (Services, Secteurs, RSE) - preuve par l'usage,
    répétée une troisième fois, que la conception V0.1.14 était généraliste
    dès l'origine.
  - `CardCarousel.vue` gagne deux paires de boutons et un compteur
    dupliqué : documenté dans le commentaire d'en-tête du composant et
    au-dessus du template, pour qu'un futur agent ne les prenne pas pour un
    doublon accidentel à nettoyer.
  - Grille RSE (`sm:grid-cols-2 lg:grid-cols-4`) disparaît de `HomeView.vue` :
    les trois grilles à 4 colonnes restantes sur la page (Valeur ajoutée
    uniquement, après ce retrait - Interviews reste à 3 colonnes, structure
    différente) ne sont pas concernées par ce ticket, aucune donnée
    supplémentaire n'a été retirée du composant `HighlightCard` lui-même.
  - Vérifié par exécution (`npm run build` - type-check + build de
    production + rendu SSG, `npm run lint`, `npm run format`, `vitest run`
    - 6 tests passants) et par grep du CSS de production (présence des six
    classes responsives `md:inline-flex`, `md:hidden`, `md:flex-row`,
    `md:justify-center`, `md:gap-8`, `md:block`) et du HTML pré-rendu
    (`dist/index.html`) : les trois régions `aria-roledescription=
    "carrousel"` portent des `aria-label` distincts (« Nos expertises »,
    « Nos secteurs d'activités », « Politique RSE »), la première
    diapositive RSE (« Mobilité urbaine ») est pré-rendue, et les boutons
    prev/next apparaissent en 2 paires par carrousel (6 occurrences de
    chaque `aria-label` au total sur la page, 3 carrousels × 2 paires).
    **Aucune vérification par capture d'écran ni navigateur piloté
    (Playwright ou équivalent) n'a été utilisée pour cette itération,
    contrainte client explicite** - l'équilibre visuel réel du trio flèche/
    carte/flèche sur grand écran reste à confirmer par un humain ou un agent
    disposant d'un navigateur, limite documentée plutôt que passée sous
    silence, même réserve méthodologique que les itérations précédentes.

## ADR 21 : V0.1.17 - ticket #19, second type de carrousel « cover flow » pour la section Valeur ajoutée

- **Contexte :** le client veut un affichage « dynamique et différencié »
  pour la section Valeur ajoutée, distinct des trois carrousels déjà en
  place (Services, Secteurs, RSE - tous `CardCarousel`, une seule
  diapositive visible à la fois, cf. ADR 18/19/20). La demande précise un
  effet « 3D / center mode » : 3 cartes visibles simultanément, la carte
  active au centre en pleine mise en avant, les cartes voisines
  partiellement visibles de part et d'autre - une hiérarchie visuelle que
  `CardCarousel` ne peut pas produire par construction (il n'affiche jamais
  qu'une seule diapositive).
- **Décision - nouveau composant `CoverCarousel.vue`, pas une variante de
  `CardCarousel`.** Deux options étaient sur la table :
  1. **Étendre `CardCarousel` avec un mode d'affichage (`mode="cover"`
     optionnel).** Écartée : la mise en page « cover flow » a des besoins
     structurels que `CardCarousel` n'a pas - jusqu'à 3 appels du créneau
     `#slide` par rendu au lieu d'un seul, une navigation par clic direct
     sur une carte latérale (absente de `CardCarousel`, dont les seules
     interactions sont les flèches), et un jeu de classes de mise en page
     entièrement différent (échelle/opacité/z-index par position plutôt
     qu'une transition d'entrée/sortie unique). Un paramètre de mode aurait
     fait porter à un seul composant deux logiques de rendu presque
     disjointes, avec un risque réel de régression sur les trois usages
     `CardCarousel` déjà en production (Services, Secteurs, RSE) à chaque
     modification future de l'une des deux branches ;
  2. **Nouveau composant dédié (retenu), même API de surface que
     `CardCarousel`.** `count` + `label` + `autoplayMs`, contenu via `#slide`
     - la même signature que `CardCarousel` côté `count`/`label` pour que
     l'appelant n'ait pas deux conventions à apprendre, mais un fichier
     séparé pour que chaque composant reste simple à lire et à faire évoluer
     indépendamment. `defineSlots` expose en plus `active: boolean` sur
     chaque appel de `#slide` - signal purement structurel (quel appel
     correspond à la carte centrale), pas une donnée métier : il permet à
     l'appelant de mettre en avant la carte active (`elevated`) sans que
     `CoverCarousel` ait besoin de connaître le contenu réel de la carte,
     cohérent avec le principe déjà posé pour `CardCarousel` (ADR 18,
     « purement mécanique, aucune donnée métier »).
- **Décision - logique SSR/autoplay/`prefers-reduced-motion`/pause dupliquée
  depuis `CardCarousel`, pas partagée via une composable commune.** Les deux
  composants partagent un noyau réel (`goTo`/wrap modulo, `startAutoplay`/
  `stopAutoplay`, garde SSR dans `onMounted`, écouteur `prefers-reduced-
  motion`, pause sur survol/focus avec la garde `relatedTarget`) - une
  douzaine de lignes identiques. Une composable `useCarouselAutoplay`
  aurait factorisé exactement cette douzaine de lignes, au prix d'une
  indirection à traverser pour comprendre le comportement de CHAQUE
  composant (un futur agent lisant `CoverCarousel.vue` devrait sauter dans
  un second fichier pour reconstituer le cycle de vie complet). Ce projet a
  déjà tranché ce type d'arbitrage dans le même sens à plusieurs reprises
  (`activeService`/`activeSector`/`activeRse`, ADR 19 : dupliquer une
  poignée de lignes plutôt qu'abstraire un cas d'usage à deux ou trois
  consommateurs) - deux composants, le seuil retenu jusqu'ici pour ne pas
  factoriser reste valable ici. Si un troisième type de carrousel apparaît
  avec le même noyau, ce jugement sera à reconsidérer : la duplication à 3
  n'a pas le même coût qu'à 2.
- **Décision - mise en avant de la carte active : prop `elevated` sur
  `HighlightCard`, pas de classe `shadow-lg` ajoutée depuis l'appelant.**
  Le brief suggérait littéralement `shadow-lg` (utilitaire Tailwind brut).
  Deux raisons l'écartent :
  1. **Cohérence avec les jetons du Design System.** `main.css` déclare déjà
     `--shadow-lift` (0 8px 12px -4px / 0 28px 52px -12px, rgb(0 0 102 / …)),
     utilisée depuis l'origine pour l'élévation des cartes interactives au
     survol (`hover:shadow-lift` dans `HighlightCard.vue`). Une carte
     « mise en avant en permanence » est visuellement la même intention
     qu'une carte survolée - réutiliser ce jeton exprime cette parenté
     plutôt que d'introduire une seconde échelle d'ombre (`shadow-lg`) sans
     lien déclaré avec la première ;
  2. **Fiabilité du mécanisme d'override.** Passer `class="shadow-lg"` en
     plus de la classe déjà portée par `HighlightCard` (`shadow-soft`)
     aurait reproduit exactement le piège déjà écarté en ADR 19 (point
     agrandissement) : deux utilitaires Tailwind de même spécificité ne se
     départagent pas selon leur ordre dans l'attribut `class` final, mais
     selon l'ordre où Tailwind les a générés dans la feuille compilée - un
     détail d'implémentation du bundler, pas du DOM, donc non garanti dans
     le temps. Un prop `elevated?: boolean` (même patron que `size`/`tone`,
     table `SIZES`/`TONES` déjà en place) tranche ce choix à l'intérieur du
     composant lui-même, où une seule classe de la paire est jamais émise à
     la fois - aucune ambiguïté d'ordre possible. Rétrocompatible : défaut
     `false`, aucun appelant existant (Services/Secteurs/RSE/Valeur ajoutée
     hors carte active) n'est concerné.
- **Décision - contenu des 4 cartes : texte du brief utilisé mot pour mot,
  ancien contenu (validé à l'origine mais jamais repris dans ce ticket)
  remplacé intégralement.** Le brief fournissait les 4 paires titre/texte de
  façon exhaustive et non tronquée pour les cartes elles-mêmes - utilisées
  telles quelles, aucune reformulation. **Le paragraphe d'introduction de la
  section, en revanche, N'EST PAS remplacé** : le brief le citait tronqué
  (« Chez Faceel, nos collaborateurs possèdent une double culture… »,
  suspension de points explicite dans la demande) - compléter cette phrase
  aurait exigé d'inventer la suite, contraire au principe d'intégrité du
  contenu (CLAUDE.md : « un contenu manquant se signale explicitement, il
  ne se remplace jamais par une valeur plausible »). Le paragraphe existant
  (« Notre différence tient à un équilibre… », validé en V0.1 et toujours
  present) reste donc affiché tel quel au-dessus du nouveau carrousel - la
  restructuration de la section (titre + description en tête, carrousel en
  dessous) ne dépendait pas de changer ce texte, seule la présentation des 4
  cartes en dessous était concernée par ce ticket.
- **Décision - responsive : une seule carte visible sous `sm:`.** Les deux
  cartes latérales (`hidden sm:block`) disparaissent complètement du DOM
  rendu en dessous de ce palier (`display: none`, pas une opacité réduite) -
  même principe que le retrait des flèches latérales de `CardCarousel` sous
  `md:` (ADR 20) : sur un très petit écran, l'espace ne permet pas
  d'afficher 3 cartes, même partielles, sans écraser le contenu. La rangée
  de cartes reçoit un padding horizontal croissant (`px-14 sm:px-16
  lg:px-20`) pour que les flèches, positionnées en absolu aux extrémités du
  conteneur, ne recouvrent jamais le bord de la carte active - y compris à
  `sm:`, où elle est seule et en pleine largeur.
- **Conséquences :**
  - Le Design System compte désormais deux types de carrousel
    (`CardCarousel`, `CoverCarousel`), chacun avec sa mise en page propre et
    sa raison d'être documentée - pas une redondance : un futur besoin doit
    choisir explicitement entre les deux plutôt que d'en créer un troisième
    sans vérifier que l'un des deux existants ne convient déjà.
  - `HighlightCard.vue` gagne un prop `elevated` documenté (commentaire
    d'en-tête du prop, même style que `size`) - rétrocompatible, vérifié par
    grep du CSS de production : `shadow-soft` reste bien présent pour les 5
    cartes non actives (Services, Secteurs, RSE, cartes latérales de Valeur
    ajoutée), `shadow-lift` n'apparaît que pour la carte active du nouveau
    carrousel.
  - Vérifié par exécution (`npm run build` - type-check + build de
    production + rendu SSG, `npm run lint`, `npm run format`, `vitest run`
    - 6 tests passants) et par grep du CSS de production (`scale-75`,
    `scale-100`, `opacity-50`, `opacity-100`, `sm:block`, `sm:z-10`,
    `sm:w-1/2`, `lg:w-1/4`, `lg:w-2/5`, `px-14`, `sm:px-16`, `lg:px-20`,
    `shadow-lift`) et du HTML pré-rendu (`dist/index.html`) : une 4ᵉ région
    `aria-roledescription="carrousel"` apparaît (« Notre valeur ajoutée »),
    le nouveau contenu des 4 cartes remplace l'ancien, et sur les 6 cartes
    `HighlightCard` rendues au total sur la page, exactement une porte
    `shadow-lift`. **Aucune vérification par capture d'écran ni navigateur
    piloté (Playwright ou équivalent) n'a été utilisée pour cette itération,
    contrainte client explicite** - l'équilibre visuel réel du cover flow
    (chevauchement des cartes latérales, lisibilité à `opacity-50`, absence
    de collision entre les flèches et la carte active à `sm:`) reste à
    confirmer par un humain ou un agent disposant d'un navigateur, limite
    documentée plutôt que passée sous silence, même réserve méthodologique
    que les itérations précédentes.

## ADR 22 : V0.1.18 - design « Naked Slider », flèches aux extrémités absolues, standard commun aux deux carrousels

- **Contexte :** le client rejette l'effet « bloc/carte » (encart à fond
  blanc/navy et ombre) qui habille chaque diapositive des 4 sections
  carrousel de `HomeView` (Services, Secteurs, RSE via `CardCarousel` -
  ADR 18/19/20 ; Valeur ajoutée via `CoverCarousel` - ADR 21). Il demande un
  texte libre, directement posé sur le fond de la section, et des flèches de
  navigation repoussées aux extrémités du viewport plutôt que collées au
  contenu - un standard visuel à appliquer identiquement aux 4 sections, pas
  une variante par section.
- **Décision - retrait de l'encart, nouveau composant plutôt que
  modification de `HighlightCard` :**
  1. **Nouveau composant `components/ui/CarouselSlideContent.vue`, pas un
     mode « nu » ajouté à `HighlightCard`.** Deux options étaient sur la
     table : (a) ajouter une variante de `tone`/un prop `naked` à
     `HighlightCard` qui viderait `root.class` de tout fond/ombre/bordure/
     arrondi ; (b) un composant dédié, purement présentationnel. (a) est
     écartée : `HighlightCard` reste le composant « carte » validé et
     démontré du Design System (`StyleguideView`, section 3) - un mode qui
     désactive la quasi-totalité de son habillage (fond, ombre, `ring`,
     `rounded-card`, `cursor-pointer`/`hover:-translate-y-2` de
     l'interactivité) n'aurait laissé qu'un sous-ensemble résiduel du
     composant (titre + trait + corps), au prix d'un prop supplémentaire à
     documenter et d'un risque de régression sur les usages « carte » réels
     (`StyleguideView`) à chaque futur changement de `HighlightCard`. (b) est
     retenue : un composant à surface minimale (titre, trait d'accent,
     paragraphe, badge optionnel - aucune notion de fond, d'ombre,
     d'interactivité ni de filigrane numéroté), qui ne peut pas dériver vers
     l'effet carte par accident. `HighlightCard` n'est pas modifié par cette
     itération (seuls ses commentaires de doc sont mis à jour pour ne plus
     prétendre à un consommateur en production qui n'existe plus, cf.
     Conséquences) ;
  2. **Suppression totale des classes d'encart dans les 4 usages.** Plus de
     `bg-white`/`bg-primary-900` (fond), `shadow-soft`/`shadow-lift` (ombre),
     `ring-1 ring-primary-900/8`/`ring-white/10` (bordure), `rounded-card`
     (coin arrondi) - `CarouselSlideContent` ne pose aucune de ces classes :
     le titre (avec son trait d'accent centré en dessous, repris identique à
     celui de `HighlightCard` mais sans l'animation `group-hover` puisque la
     diapositive n'est pas interactive), le badge optionnel (RSE/Ecovadis) et
     le paragraphe flottent directement sur le fond de la section parente ;
  3. **`min-h-[200px]` sur le conteneur de texte, valeur arbitraire demandée
     explicitement par le brief plutôt qu'un nouveau jeton `@theme`.** Même
     raisonnement qu'ADR 08 pour `max-w-[100rem]` en son temps : un seul
     palier, utilisé à un seul endroit (un composant, quatre appels), sans
     variation entre sections - un jeton nommé n'aurait ajouté de
     l'indirection sans bénéfice de réutilisation. Empêche le saut de layout
     (CLS) que la `<Transition>` du carrousel englobant (`CardCarousel`,
     `CoverCarousel`, toutes deux déjà en place depuis ADR 18/21) provoquerait
     en bissant d'un texte court (ex. « Vision métier ») à un texte long (ex.
     le paragraphe RSE « Mobilité urbaine », plusieurs lignes) sans plancher
     de hauteur.
- **Décision - flèches en position absolue aux extrémités :**
  1. **`CardCarousel` : une seule paire de boutons, plus de duplication
     mobile/desktop.** La disposition V0.1.16 (ADR 20) dupliquait les
     boutons prev/next (une paire flanquant la carte dès `md:`, une seconde
     paire groupée avec le compteur sous la carte en mobile) parce que
     l'ancienne mise en page dépendait de la largeur de la carte encartée -
     sans encart à flanquer, cette raison d'être disparaît. Le conteneur
     racine devient `relative`, les deux boutons `absolute top-1/2
     -translate-y-1/2`, ancrés `left-4 md:left-8 lg:left-12` /
     `right-4 md:right-8 lg:right-12` à **toutes** les tailles d'écran (pas
     seulement `md:` et au-delà, contrairement à ADR 20) - le brief ne
     prévoit pas de repli mobile spécifique, la disposition est le nouveau
     standard absolu à toute largeur ;
  2. **`CoverCarousel` : `left-0`/`right-0` → `left-4 md:left-8 lg:left-12` /
     `right-4 md:right-8 lg:right-12`, même échelle que `CardCarousel`.**
     V0.1.17 (ADR 21) ancrait déjà les flèches en absolu, mais au bord du
     conteneur du carrousel lui-même (`left-0`/`right-0`), pas au bord de la
     section - un choix cohérent avec l'esthétique « encart » de l'époque
     (les cartes latérales partiellement visibles suffisaient à créer le
     décalage voulu) mais plus assez éloigné du bord une fois le texte libre
     adopté. Retenir la même échelle numérique que `CardCarousel` plutôt
     qu'une valeur propre à `CoverCarousel` : les deux carrousels du Design
     System partagent désormais un seul standard de positionnement de
     flèches, pas deux arbitraires distincts à maintenir en parallèle ;
  3. **Padding horizontal du texte élargi en conséquence (`px-20 md:px-24
     lg:px-28` sur les deux composants), remplace les deux échelles
     distinctes de V0.1.16/V0.1.17 (implicite via la mise en page flex de
     `CardCarousel`, `px-14 sm:px-16 lg:px-20` pour `CoverCarousel`).**
     Calculé pour qu'aucune diapositive, même en pleine largeur sous le plus
     petit breakpoint, ne passe sous une flèche (bouton de 44px de diamètre +
     décalage `left-*`/`right-*` + marge de respiration) - un standard commun
     aux deux composants, cohérent avec le point précédent.
- **Décision - correctif de contraste incidental sur le compteur de
  `CardCarousel` :** en réécrivant la ligne du compteur décoratif
  (« 1 / 4 ») pour retirer la duplication mobile/desktop, un défaut de
  contraste préexistant est mis en évidence : `text-primary-900/50`, seule
  classe utilisée jusqu'ici quelle que soit la section, donnait (calculé via
  le skill `a11y-color-check`) **1,05:1 sur `bg-primary-950`** (fond
  Secteurs) et **1:1 sur `bg-primary-900`** (fond RSE - la même couleur
  exacte que le fond, texte strictement invisible). `CardCarousel` gagne un
  prop `tone` (`CardTone`, défaut `light`) qui bascule le compteur vers
  `text-white/50` sur les sections sombres - **5,12:1 sur `bg-primary-950`,
  4,71:1 sur `bg-primary-900`, AA**, même opacité (50 %) que la variante
  claire pour rester le même geste discret des deux côtés. Ce correctif
  n'était pas demandé par le brief V0.1.18, mais la ligne concernée était
  déjà celle réécrite pour ce ticket (retrait de la duplication) : corriger
  un défaut de contraste directement visible dans le diff plutôt que le
  reconduire à l'identique relève de la même discipline d'accessibilité déjà
  posée dans `CLAUDE.md` pour tout agent qui touche à une couleur de texte,
  pas un élargissement de périmètre.
- **Conséquences :**
  - `HighlightCard` n'a plus aucun consommateur en production après cette
    itération (`elevated` et le gabarit `size="lg"` en particulier n'ont plus
    d'appelant réel) - conservé dans le Design System comme composant
    « carte » démontré par `StyleguideView`, même principe que les créneaux
    `icon`/`title` déjà sans consommateur depuis ADR 15/19 : un composant ou
    un prop générique documenté n'est pas de la dette au même titre qu'une
    primitive entièrement orpheline (contrairement à `DataCore`/`WaveRibbon`,
    ADR 06/ADR 14, retirés fichier compris faute de toute vocation générique
    restante). `types.ts` (`CardSize`) et les commentaires d'en-tête de
    `HighlightCard.vue`/`CoverCarousel.vue` sont mis à jour pour ne plus
    prétendre à un usage carrousel qui n'existe plus, plutôt que de laisser
    la documentation dériver du code ;
  - `CoverCarousel` conserve son prop `active` transmis au créneau `#slide`
    (signal structurel réutilisable par un futur consommateur), mais
    `CarouselSlideContent` ne s'en sert pas : la hiérarchie visuelle entre
    diapositive active et diapositives latérales tient à l'échelle/opacité
    déjà posées par `CoverCarousel` lui-même (`scale-100 opacity-100` contre
    `scale-75 opacity-50`, inchangées depuis ADR 21) ;
  - Le Design System compte désormais deux composants de carrousel
    (`CardCarousel`, `CoverCarousel`) et deux habillages de diapositive
    (`HighlightCard` pour un usage « carte » hors carrousel,
    `CarouselSlideContent` pour le texte libre en carrousel) - la séparation
    est volontaire : un futur besoin de diapositive doit choisir entre les
    deux plutôt que de réintroduire l'encart dans `CarouselSlideContent` ou
    de retirer l'habillage carte de `HighlightCard`, ce qui casserait l'un
    des deux usages actuels ;
  - Vérifié par exécution (`npm run build` - type-check + build de
    production + rendu SSG, `npm run lint`, `npm run format`, `vitest run` -
    6 tests passants) et par grep du CSS de production (`dist/assets/`) :
    présence de `min-h-[200px]`, `left-4`, `md:left-8`, `lg:left-12`,
    `right-4`, `md:right-8`, `lg:right-12`, `px-20`, `md:px-24`, `lg:px-28`,
    `top-1/2`, `-translate-y-1/2`, `max-w-prose`, `text-white\/50` (utilisé
    pour la première fois par le compteur `dark` de `CardCarousel`), aucune
    classe orpheline. **Aucune vérification par capture d'écran ni
    navigateur piloté (Playwright ou équivalent) n'a été utilisée pour cette
    itération, contrainte explicite du rôle pour ce ticket** - l'équilibre
    visuel réel du texte libre sans encart (lisibilité du texte directement
    sur le fond de section, absence de recouvrement entre le texte et les
    flèches sur petit mobile) reste à confirmer par un humain ou un agent
    disposant d'un navigateur, limite documentée plutôt que passée sous
    silence, même réserve méthodologique que plusieurs itérations
    précédentes (V0.1.7 à V0.1.17 par intermittence).

## ADR 23 : V0.1.19 - alignement à gauche des carrousels (ligne de force verticale), retrait de la section Notations

- **Contexte :** le client relève, après la refonte « naked slider » de
  V0.1.18 (ADR 22), une incohérence de ligne éditoriale : les titres de
  section (`<h2>`) sont alignés à gauche, mais le texte des diapositives
  (`CarouselSlideContent`, introduit en V0.1.18) est centré - deux systèmes
  d'alignement concurrents sur la même page cassent la ligne de force
  verticale attendue d'une page éditoriale. Demande distincte et
  indépendante dans le même ticket : retrait de la section affichant les
  notes Glassdoor/Google (« Notations »), en section Équipe.
- **Décision - alignement à gauche :**
  1. **`CarouselSlideContent.vue` : `items-center`/`text-center` →
     `items-start`/`text-left`, `justify-center` (axe vertical, plancher
     `min-h-[200px]`) inchangé.** Un seul point de bascule suffit : le
     `flex-col` existant aligne automatiquement tous ses enfants (badge,
     titre, trait d'accent, paragraphe) sur le nouveau bord de départ, sans
     toucher à leurs classes individuelles - aucune classe `mx-auto`
     n'existait sur ces enfants (le centrage venait uniquement du parent),
     rien à retirer à ce niveau ;
  2. **`HomeView.vue` : `<header>` des 4 sections gagne `px-20 md:px-24
     lg:px-28`, valeur reprise telle quelle du conteneur de diapositive de
     `CardCarousel`/`CoverCarousel` (déjà présente depuis V0.1.18), pas une
     nouvelle valeur calculée.** Diagnostic du décalage : le `<h2>` vit
     directement dans la `<section>` (bord gauche = padding de la section,
     `px-4 sm:px-6 lg:px-8 xl:px-12`), tandis que le texte de diapositive vit
     un niveau plus bas, à l'intérieur du conteneur `px-20 md:px-24 lg:px-28`
     de `CardCarousel`/`CoverCarousel` - un padding qui S'AJOUTE à celui de
     la section (jamais remplacé), introduit en V0.1.18 pour que les
     diapositives ne passent jamais sous les flèches (ADR 22). Deux
     résolutions étaient possibles : réduire le padding du conteneur de
     diapositive au niveau du `<header>` (rejetée : casserait la garantie
     V0.1.18 « aucune diapositive sous une flèche », une contrainte
     fonctionnelle, pas seulement esthétique), ou élargir le padding du
     `<header>` pour rejoindre celui du conteneur de diapositive (retenue) -
     la valeur n'est pas recalculée mais réutilisée telle quelle, pour que
     les deux paddings ne puissent plus diverger silencieusement à l'avenir ;
  3. **`mx-auto` retiré des 3 appels `CarouselSlideContent` de
     `CardCarousel`** (Services, Secteurs, RSE ; `class="mx-auto max-w-5xl"`
     → `class="max-w-5xl"`). En V0.1.18, `mx-auto` centrait la CARTE
     elle-même (un bloc de largeur `max-w-5xl`) au milieu de son conteneur
     padded - un texte interne aligné à gauche dans un bloc lui-même centré
     n'aurait pas rejoint le bord gauche réel de la zone de contenu, juste
     celui, arbitraire, du bloc recentré. Le retrait de `mx-auto` laisse le
     bloc démarrer au bord gauche de son conteneur (comportement par défaut
     d'un élément non flex), `max-w-5xl` continuant à borner la largeur
     maximale du titre/paragraphe pour la lisibilité ;
  4. **Limite assumée sur `CoverCarousel` (Valeur ajoutée), documentée plutôt
     que forcée.** Contrairement à `CardCarousel`, la rangée de
     `CoverCarousel` reste `justify-center` : la diapositive active est
     délibérément centrée entre ses deux voisines partielles, c'est l'essence
     du « cover flow » actée en ADR 21 et non remise en cause par ce ticket.
     Deux options : (a) forcer `justify-start` pour un alignement
     glyphe-à-glyphe parfait avec le `<h2>`, au prix de dénaturer le cover
     flow (les cartes latérales perdraient leur rôle d'équilibre visuel
     autour du centre) ; (b) accepter que l'alignement soit exact sur
     `CardCarousel` mais seulement approximatif sur `CoverCarousel` (le texte
     de la carte active est aligné à gauche DANS sa propre carte, mais cette
     carte n'est pas elle-même collée au bord gauche de la rangée). (b) est
     retenue et documentée explicitement dans le commentaire d'en-tête de
     `CoverCarousel.vue` et dans `HomeView.vue` : une esthétique de type
     « cover flow » à 3 panneaux centrés est structurellement incompatible
     avec un alignement de bord gauche parfait de son panneau central, sans
     que ce ticket ait mandat pour redessiner le composant lui-même.
- **Décision - retrait de la section Notations :**
  1. **Retrait du bloc `<RatingBadge>` uniquement, pas de toute la section
     Équipe.** Le brief cible « la section affichant les notes Glassdoor et
     Google » - un sous-bloc de la section `id="equipe"` (« Preuve sociale &
     équipe »), distinct de `AvatarStack` (effectif « +60 ») et du paragraphe
     « redéfinir l'image des ESN » qui restent en place : ce sont des
     éléments de preuve sociale propres à Faceel-IT, pas des notations
     tierces, le client ne les a pas visés ;
  2. **`RatingBadge.vue` supprimé, fichier compris, après vérification par
     recherche globale qu'il n'avait plus aucun consommateur** (`HomeView`
     était son seul appelant ; `StyleguideView.vue` ne le démontrait pas) -
     même principe que `DataCore`/`WaveRibbon` (ADR 06/ADR 14) : un composant
     entièrement orphelin après un retrait de contenu n'est pas conservé
     « au cas où », contrairement à un prop/créneau générique resté sans
     consommateur sur un composant par ailleurs toujours utilisé (ex.
     `elevated`/`size` sur `HighlightCard`, cf. ADR 22) ;
  3. **Le lien social Glassdoor du footer (`TheFooter.vue`, V0.1.13/ADR 17)
     n'est pas concerné.** Vérifié explicitement pour éviter toute confusion
     entre les deux fonctionnalités homonymes : le brief vise l'affichage
     d'une note chiffrée (« 4,8/5 »), pas le lien vers la page Glassdoor de
     l'entreprise dans les réseaux sociaux du pied de page - deux features
     distinctes introduites à des itérations différentes, pour des raisons
     différentes.
- **Conséquences :**
  - Le Design System perd un composant (`RatingBadge`) mais n'introduit
    aucune nouvelle primitive - cette itération est une simplification nette,
    cohérente avec la trajectoire d'épuration engagée depuis V0.1.11 (ADR 15)
    et poursuivie en V0.1.18 (ADR 22) ;
  - `docs/CODEMAP.md` régénéré (`scripts/generate-codemap.py`) : confirme
    l'absence de toute référence à `RatingBadge.vue` dans le graphe de
    dépendances ;
  - Vérifié par exécution (`npm run build` - type-check + build de
    production + rendu SSG, `npm run lint`, `npm run format`, `vitest run` -
    6 tests passants) et par grep du CSS/HTML de production (`dist/`) :
    présence de `items-start`/`text-left` sur les 6 diapositives rendues au
    premier rendu, des 4 `<header ... px-20 md:px-24 lg:px-28>`, absence
    totale de « Google » et de toute trace de `RatingBadge` dans le bundle ;
    le seul « Glassdoor » restant dans le HTML pré-rendu pointe vers le lien
    social du footer, vérifié distinct du bloc retiré. **Aucune vérification
    par capture d'écran ni navigateur piloté (Playwright ou équivalent) n'a
    été utilisée pour cette itération, contrainte explicite du rôle pour ce
    ticket** - l'équilibre visuel réel de l'alignement (absence de
    chevauchement entre les éléments et le bord de la fenêtre sur petit
    mobile) reste à confirmer par un humain ou un agent disposant d'un
    navigateur, limite documentée plutôt que passée sous silence, même
    réserve méthodologique que plusieurs itérations précédentes.

## ADR 24 : V0.1.20 - pivot structurel « scroll snapping » pleine page, retrait des sections Interviews et Notations

- **Contexte :** le client veut transformer `HomeView` en expérience « slide
  par slide » : chaque section occupe 100 % du viewport et s'enclenche au
  scroll (CSS Scroll Snapping), plutôt que le long défilement continu actuel.
  Brief détaillé et prescriptif : classes Tailwind exactes pour le conteneur
  (`h-dvh overflow-y-auto snap-y snap-mandatory`) et pour chaque diapositive
  (`h-dvh w-full snap-start flex flex-col justify-center`), liste stricte de
  6 diapositives (Navbar+Hero, groupe Logo Wall+Services, Secteurs, Valeur
  ajoutée, RSE, Footer), plus deux suppressions de contenu (Notations
  Glassdoor/Google, témoignages vidéo Interviews) et une consigne de sécurité
  (`overflow-y-auto` interne si le contenu déborde d'un petit écran mobile).
- **Décision - conflit architectural identifié et arbitré AVANT toute
  implémentation, pas découvert en cours de route :** la liste stricte du
  brief inclut « Navbar + Hero » et « Footer » comme diapositives à part
  entière, physiquement enclenchées dans le même flux de scroll que les
  sections de contenu. Or `MegaMenu` (Navbar) et `TheFooter` sont montés une
  seule fois par `App.vue`, PARTAGÉS par toutes les routes (`/`, `/styleguide`,
  404) - une règle d'architecture explicitement documentée dans `App.vue`
  (« l'en-tête et le pied de page sont montés ICI, une seule fois, et non
  dans chaque vue »), motivée par l'accessibilité (un seul lien d'évitement,
  jamais deux `<main>` imbriqués) autant que par la non-duplication. Pour que
  Navbar et Footer participent LITTÉRALEMENT au même conteneur de scroll-snap
  que les sections de `HomeView`, ils devraient être des enfants DOM directs
  de ce même conteneur - ce qui exigerait soit de dupliquer leur montage par
  route (rompant l'invariant documenté), soit de rendre toute la coquille de
  `App.vue` dépendante de la route courante (un chantier de refonte de
  l'architecture du shell, hors du périmètre « HomeView.vue » que le brief
  cible explicitement à 5 reprises, jamais `App.vue`/`MegaMenu.vue`/
  `TheFooter.vue` par leur nom).
  1. **Piste écartée : déplacer physiquement `MegaMenu`/`TheFooter` dans
     `HomeView.vue`, conditionnellement à la route.** Techniquement
     faisable (méta de route + rendu conditionnel dans `App.vue`), mais un
     changement de grande ampleur, à fort rayon d'action (les deux autres
     routes existantes, `/styleguide` et 404, n'ont pas été conçues pour un
     défilement en diapositives et auraient dû être auditées pour ne pas
     régresser), non vérifiable visuellement dans cette session (Playwright
     explicitement interdit) et non demandé nommément par le brief. Rejetée
     au nom du principe « faire correspondre l'ampleur de l'action à ce qui
     est réellement demandé » - un chantier de cette taille mérite d'être
     initié par une décision explicite du client, pas déduit d'une lecture
     stricte d'une liste de diapositives ;
  2. **Retenue : implémenter le scroll snapping intégralement à l'intérieur
     de `HomeView.vue` (le seul fichier explicitement ciblé), Navbar et
     Footer non déplacés - limite documentée plutôt que passée sous
     silence.** `#page-scroll` (nouveau conteneur, racine du template de
     `HomeView.vue`) englobe les 5 diapositives qui vivent réellement dans
     ce fichier (Hero, groupe Confiance+Services, Secteurs, Valeur ajoutée,
     RSE) - Navbar reste au-dessus (via `App.vue`, `sticky top-0`, inchangée),
     Footer reste en dessous (via `App.vue`, inchangé). Conséquences
     pratiques assumées :
     - Le Hero (`h-dvh` plein) ne peut pas connaître par avance la hauteur
       réellement disponible sous la Navbar (`sticky`, ~4rem/5rem selon
       breakpoint) - sur le tout premier écran, son bas peut être masqué de
       quelques dizaines de pixels tant que l'utilisateur n'a pas fait
       défiler une première fois. La consigne de sécurité du brief
       (`overflow-y-auto` sur chaque diapositive) sert précisément de filet
       ici, pas seulement pour un contenu « trop grand » au sens littéral ;
     - Le Footer n'est pas un point d'ancrage `snap-start` au sens strict
       (il n'appartient pas au conteneur de scroll-snap), mais reste
       atteignable par CHAÎNAGE DE DÉFILEMENT NATIF du navigateur : une fois
       que `#page-scroll` (hauteur fixe `h-dvh`, `overflow-y-auto`) a atteint
       la fin de son propre défilement interne (après la diapositive RSE),
       la molette/le geste de défilement continue naturellement à faire
       défiler le document englobant (`<main>` dans `App.vue`), révélant la
       section Équipe puis le Footer - un comportement de scroll chaining
       standard des navigateurs, pas une bascule programmée ;
     - Alternative envisagée et écartée pour le Footer : `position:
       sticky`/`fixed` ou un second conteneur de snap dédié au Footer seul -
       rejetée, ajoutait de la complexité pour un gain marginal (le chaînage
       natif suffit à rendre le Footer atteignable, seule la sémantique
       stricte « point d'ancrage snap » n'est pas honorée à 100 %) ;
  3. **`#page-scroll` place le conteneur de scroll DANS `HomeView.vue`, pas
     sur `<main>` (`App.vue`).** Le brief proposait explicitement les deux
     options (« le main ou un div englobant toutes ces sections dans
     HomeView.vue ») - `<main>` est partagé par toutes les routes
     (`App.vue`), y appliquer `h-dvh overflow-y-auto snap-y snap-mandatory`
     aurait cassé `/styleguide` (page de documentation à défilement continu,
     jamais conçue pour des diapositives `h-dvh`) et la page 404. Un `<div>`
     propre à `HomeView.vue` isole strictement l'effet à la page d'accueil,
     seule page concernée par le brief.
- **Décision - regroupement Confiance + Services :** un seul
  `<section id="services-group">`, demande client explicite pour que la
  logique une-diapositive-par-écran fonctionne. Les anciens
  `<section id="confiance">`/`<section id="services">` deviennent des
  `<div>` internes (même `id`, `scroll-mt-24` conservé) - un `<section>`
  imbriqué sans titre propre dans une autre `<section>` aurait été un
  landmark ARIA redondant. Le groupe lui-même ne porte aucun padding
  horizontal propre (contrairement aux 4 autres diapositives) : c'est ce qui
  préserve le bandeau de logos en full bleed, bord à bord (ADR 08, V0.1.3,
  non remis en cause) - le bloc Services interne porte sa propre échelle de
  padding, reprise à l'identique de l'ancienne `<section id="services">`.
- **Décision - padding vertical des diapositives, réduit uniformément.**
  L'ancienne échelle croissante (`py-20 sm:py-28 lg:py-32`, posée en V0.1.9/
  ADR 13 pour une section à hauteur automatique) devient un `py-12` plat (ou
  `py-8` pour le groupe Confiance+Services, plus dense en contenu) : une fois
  la diapositive contrainte à `h-dvh` avec `justify-center` pour centrer
  verticalement, un padding vertical qui grandit avec le viewport est
  redondant avec ce centrage et augmente le risque de dépassement sur petit
  mobile - l'inverse de l'objectif de la consigne de sécurité du brief.
- **Décision - retrait intégral de la section Interviews :** demande client
  explicite, absente aussi de la « liste stricte des diapositives ».
  `<section id="interviews">`, le composant `InterviewCard`, les données
  `INTERVIEWS`/l'interface `Interview` sont retirés. `InterviewCard.vue`
  n'avait plus aucun consommateur après ce retrait (vérifié par recherche
  globale avant suppression) : supprimé du Design System, fichier compris -
  même principe que `RatingBadge` en V0.1.19 (ADR 23), `DataCore`/
  `WaveRibbon` en ADR 06/ADR 14. Deux liens de navigation ciblaient
  `#interviews` (« Témoignages », `mainNav.ts` ; « Interviews
  collaborateurs », `footerNav.ts`) : retirés plutôt que repointés vers une
  autre section - aucune section restante n'offre un contenu équivalent
  (témoignages vidéo), repointer aurait été trompeur pour l'utilisateur
  (même raisonnement que le nettoyage des ancres mortes en ADR 17).
- **Décision - section Notations : déjà retirée (V0.1.19, ADR 23), pas de
  nouvelle action.** Le brief V0.1.20 redemande ce retrait ; vérifié par
  lecture directe de `HomeView.vue` avant toute modification que
  `RatingBadge.vue` et le bloc de notation étaient déjà absents - traité
  comme une re-confirmation, pas comme un travail à refaire.
- **Décision - section Équipe : conservée, sortie du conteneur de
  scroll-snap.** Absente de la liste stricte des diapositives du brief, mais
  son contenu (`AvatarStack`, effectif réel « +60 » ; paragraphe de
  positionnement « redéfinir l'image des ESN ») n'est ni une notation
  tierce ni un témoignage vidéo - les deux seuls types de contenu que le
  brief demande explicitement de retirer. Supprimer ce contenu sans consigne
  explicite aurait contredit la règle d'intégrité du contenu de `CLAUDE.md`
  (« un contenu manquant se signale explicitement, il ne se remplace/retire
  jamais sans source ») - la section reste donc en place, positionnée après
  `#page-scroll` (hors du flux de diapositives strict, atteignable par
  chaînage de défilement natif, cf. ci-dessus).
- **Conséquences :**
  - Le Design System perd un second composant en deux itérations
    (`InterviewCard`, après `RatingBadge` en V0.1.19) sans qu'aucun ne soit
    remplacé - trajectoire de simplification assumée du site, cohérente avec
    ADR 15/ADR 22/ADR 23 ;
  - `docs/CODEMAP.md` régénéré (`scripts/generate-codemap.py`) : confirme
    l'absence de `InterviewCard.vue` dans le graphe de dépendances ;
  - La limite Navbar/Footer (point 2 ci-dessus) reste la seule divergence
    connue entre le brief et l'implémentation livrée - documentée ici
    explicitement pour qu'un futur agent ne la corrige pas silencieusement
    sans en mesurer le coût (restructuration de `App.vue`), et pour que le
    client puisse trancher en connaissance de cause si un alignement parfait
    reste souhaité ;
  - Vérifié par exécution (`npm run build` - type-check + build de
    production + rendu SSG, `npm run lint`, `npm run format`, `vitest run` -
    6 tests passants) et par grep du CSS/HTML de production (`dist/`) :
    présence de `h-dvh`, `overflow-y-auto`, `snap-y`, `snap-mandatory`, 5
    occurrences de `snap-start` (une par diapositive), structure DOM
    confirmée (`#services-group` englobe bien `#confiance` puis `#services`,
    `#page-scroll` se referme avant `#equipe`), absence totale de toute trace
    d'Interviews/`InterviewCard`/notations dans le bundle. **Aucune
    vérification par capture d'écran ni navigateur piloté (Playwright ou
    équivalent) n'a été utilisée pour cette itération, contrainte explicite
    du rôle pour ce ticket** - le comportement réel du scroll snapping
    (fluidité, ampleur exacte du recouvrement Navbar/Hero, chaînage vers
    Équipe/Footer) reste à confirmer par un humain ou un agent disposant d'un
    navigateur, limite documentée plutôt que passée sous silence.

## ADR 25 : V0.1.21 - extension du scroll snapping à la section Équipe, arbitrage réaffirmé sur le Footer

- **Contexte :** nouveau brief qui redemande le pivot « scroll snapping »
  d'ADR 24, cette fois avec une liste stricte de **6** diapositives (Hero,
  groupe Confiance+Services, Secteurs, Valeur ajoutée, RSE, Footer) - une de
  plus qu'ADR 24, le Footer y figurant nommément cette fois, avec la
  suggestion explicite de modifier `TheFooter.vue` et/ou de l'envelopper
  dans une `<div>` côté `HomeView.vue`. Le brief redemande aussi les deux
  suppressions déjà traitées en ADR 23/ADR 24 (Notations Glassdoor/Google,
  témoignages vidéo Interviews) : vérifié par lecture de `HomeView.vue`
  avant toute modification que les deux étaient toujours absentes - aucune
  régression entre-temps, traité comme une re-confirmation.
- **Décision - section Équipe : rejoint `#page-scroll` comme 6ᵉ
  diapositive.** Contrairement au Footer (ci-dessous), rien n'empêchait
  ce changement : la section vit déjà entièrement dans `HomeView.vue`,
  aucune dépendance à `App.vue`. `<section id="equipe">` gagne les mêmes
  classes que les 4 autres diapositives à contenu simple
  (`h-dvh w-full snap-start flex flex-col justify-center overflow-y-auto`),
  perd son `scroll-mt-24` (qui ne servait qu'à l'ancien positionnement en
  flux normal sous la Navbar sticky - devenue une diapositive `h-dvh`, elle
  n'en a pas plus besoin que `#secteurs`/`#valeurs`/`#rse`, qui n'en
  portaient déjà pas). Absente de la liste stricte du brief (qui ne nomme
  que Hero/Confiance+Services/Secteurs/Valeur ajoutée/RSE/Footer), mais son
  contenu (`AvatarStack`, effectif réel « +60 » ; paragraphe « redéfinir
  l'image des ESN ») n'est ni une notation tierce ni un témoignage vidéo,
  les deux seuls types de contenu que le brief demande de retirer - la
  retirer sans consigne explicite aurait contredit la règle d'intégrité du
  contenu de `CLAUDE.md`, exactement le raisonnement déjà tenu en ADR 24
  pour la garder hors suppression. Ce ticket clarifie seulement sa
  *position* (dans `#page-scroll` plutôt qu'après), pas son existence.
- **Décision - Footer : NON intégré au conteneur de scroll-snap, arbitrage
  d'ADR 24 réaffirmé, pas rouvert silencieusement.** Le brief suggère deux
  pistes (« modifier `TheFooter.vue` » ou « l'envelopper dans une div dans
  `HomeView.vue` ») - aucune des deux ne suffit techniquement à faire de
  `TheFooter` un point d'ancrage `snap-start` du même conteneur de scroll
  que les diapositives de `HomeView` :
  1. **Envelopper `<TheFooter>` dans une `<div snap-start>` côté
     `HomeView.vue` - impossible tel quel : `HomeView.vue` ne monte pas
     `<TheFooter>`.** Le composant est instancié une seule fois, dans
     `App.vue` (`app.vue:131`), en dehors de `<main>`, avec ses créneaux
     (`#social`, `#contact`, `#ctas`) remplis par des données locales à
     `App.vue` (téléphone, adresse, réseaux sociaux) non exportées
     ailleurs. `HomeView.vue` n'a physiquement rien à envelopper ;
  2. **Styler `TheFooter.vue` en `min-h-dvh flex flex-col justify-end` -
     insuffisant seul, et à risque pour les autres routes.** Ça peut faire
     *ressembler* le Footer à une diapositive plein écran, mais ne le rend
     PAS `snap-start` : sans appartenir au même conteneur `overflow-y-auto
     snap-y` que les 6 diapositives, il n'y a aucun point d'ancrage à
     enclencher, l'effet resterait un simple habillage visuel. Pire : comme
     `TheFooter` est monté une seule fois par `App.vue` et PARTAGÉ par
     `/styleguide` et la 404, lui imposer `min-h-dvh` changerait sa hauteur
     minimale sur CES pages aussi, alors que rien dans leur conception
     n'anticipe un pied de page pleine hauteur - régression potentielle hors
     du périmètre du brief (qui ne cible que la page d'accueil) ;
  3. **Seule voie qui rendrait le Footer littéralement `snap-start` dans le
     même flux que `HomeView` : restructurer `App.vue`.** Rendre `<main>` +
     `<TheFooter>` conditionnellement enveloppés dans un conteneur
     `snap-y snap-mandatory` selon la route (méta de route `fullPageScroll`
     ou équivalent), pour que les diapositives de `HomeView.vue` et le
     Footer partagé deviennent des enfants du MÊME conteneur de scroll.
     C'est très exactement la « piste écartée » d'ADR 24 (point 1) -
     rejetée alors pour les mêmes raisons qui tiennent encore ici :
     `App.vue` est un fichier hors du périmètre nommé du ticket (qui cible
     `HomeView.vue`/`TheFooter.vue`, jamais `App.vue` par son nom), la
     restructuration a un rayon d'action qui dépasse la page d'accueil
     (`/styleguide`, 404), et son impact réel ne peut pas être vérifié
     visuellement dans cette session - **contrainte explicite du rôle,
     rappelée en tête de ce ticket : interdiction absolue de lancer
     Playwright ou tout script de test automatisé.** Un changement
     structurel non vérifiable sur des pages qui n'ont pas été auditées
     n'est pas une action à taille proportionnée à ce qui est explicitement
     demandé (règle générale : faire correspondre l'ampleur de l'action à
     la demande) ;
  4. **Décision retenue : ne pas toucher `App.vue`, documenter la limite
     une seconde fois plutôt que la lever silencieusement à moitié.** Le
     Footer reste monté par `App.vue`, hors de `#page-scroll`, atteignable
     par chaînage de défilement natif après la diapositive Équipe (6ᵉ,
     nouvelle depuis ce ticket) - comportement inchangé dans son principe
     par rapport à ADR 24, seul le point de chaînage se déplace (après
     Équipe plutôt qu'après RSE, puisqu'Équipe est désormais dans
     `#page-scroll`). Si un alignement strict à 100 % avec le brief reste
     souhaité, la restructuration d'`App.vue` décrite au point 3 est la
     voie technique à suivre - mais elle mérite d'être déclenchée par une
     décision explicite du client sur `App.vue` nommément, pas déduite
     d'une liste de diapositives qui ne le nomme pas non plus.
- **Conséquences :**
  - `HomeView.vue` : `#page-scroll` passe de 5 à 6 diapositives
    (`snap-start` × 6, vérifié par grep du HTML pré-rendu de production -
    `dist/index.html`, une occurrence par diapositive, IDs
    `services-group`/`secteurs`/`valeurs`/`rse`/`equipe` confirmés, plus le
    Hero sans `id`). Le bloc de commentaires en tête de template et le
    grand commentaire de tête du `<script>` sont mis à jour pour refléter
    les 6 diapositives et réaffirmer explicitement la limite Footer ;
  - `TheFooter.vue` : **inchangé** dans ce ticket - aucune modification
    n'était sûre à apporter sans toucher `App.vue` en même temps (cf. point
    2 ci-dessus) ;
  - Notations Glassdoor/Google et Interviews : confirmées absentes
    (re-vérification, aucune action requise, même conclusion qu'ADR 24 pour
    les Notations) ;
  - Vérifié par exécution : `npm run build` (type-check + build client/SSR +
    rendu SSG), `npm run lint` (aucune correction nécessaire), `npm run
    format` (`HomeView.vue` déjà conforme), `vitest run` (6 tests passants).
    Grep du CSS de production (`app-*.css`) : présence de `h-dvh` (×2),
    `overflow-y-auto`, `snap-y`, `snap-mandatory`, `snap-start`. Grep du
    HTML pré-rendu (`dist/index.html`) : exactement 6 occurrences de
    `snap-start`, 0 occurrence d'« interview », 1 seule occurrence de
    « glassdoor » (le lien social du Footer vers la page Glassdoor de
    l'entreprise, distinct de l'ancien badge de notation retiré en ADR 23 -
    non concerné par la demande de retrait). **Aucune vérification par
    capture d'écran ni navigateur piloté (Playwright ou équivalent) n'a été
    utilisée, contrainte explicite du rôle pour ce ticket** - le rendu
    visuel réel de la diapositive Équipe repositionnée, et la question de
    l'alignement complet du Footer sur le modèle de scroll snapping,
    restent à trancher par le client et/ou à vérifier par un agent
    disposant d'un navigateur.

## ADR 26 : V0.1.22 - override client explicite : Footer intégré au scroll snapping (restructuration d'`App.vue`), suppression radicale de la section Équipe

- **Contexte :** le client fournit une capture d'écran et lève explicitement,
  par écrit, les deux réserves qu'ADR 24/ADR 25 avaient documentées et
  laissées ouvertes :
  1. il qualifie le bloc Équipe (`AvatarStack` « +60 » + paragraphe
     « redéfinir l'image des ESN ») de « notations » et demande sa
     suppression **intégrale**, pas un déplacement - dépasse la garantie
     d'intégrité du contenu de `CLAUDE.md` en la matière : cette règle
     protège un contenu manquant qu'on remplacerait par une valeur inventée,
     pas un contenu réel et exact dont le client ne veut plus. Rien à
     arbitrer ici, la demande est sans ambiguïté ;
  2. il autorise EXPLICITEMENT la modification d'`App.vue` et de
     `TheFooter.vue`, nommément, pour que le Footer devienne un vrai point
     d'ancrage `snap-start` - la seule chose qu'ADR 24 (point 1, « piste
     écartée ») et ADR 25 (points 1 à 4) avaient identifiée comme
     techniquement nécessaire mais hors périmètre nommé et non vérifiable
     sans navigateur piloté. Le second point ne change pas : **aucune
     vérification par Playwright ou script de test automatisé n'a été
     utilisée pour ce ticket non plus**, contrainte reconduite explicitement
     par le brief lui-même - l'autorisation porte sur les FICHIERS à
     modifier, pas sur la méthode de vérification.
- **Décision - section Équipe : SUPPRESSION INTÉGRALE, pas un déplacement.**
  `<section id="equipe">` retirée de `HomeView.vue` avec tout son contenu
  (`AvatarStack`, paragraphe de positionnement). `AvatarStack.vue` n'avait
  plus aucun consommateur nulle part sur le site après ce retrait (vérifié
  par recherche globale avant suppression, y compris dans
  `StyleguideView.vue` - il n'y était pas non plus démontré, contrairement à
  `HighlightCard` en ADR 22) : supprimé du Design System, fichier compris,
  même principe que `DataCore`/`WaveRibbon`/`RatingBadge`/`InterviewCard`.
  Deux entrées de navigation ciblaient `#equipe` (« L'Équipe » dans
  `mainNav.ts`, « Notre collectif » dans `footerNav.ts`) : retirées plutôt
  que repointées, même raisonnement que le retrait des entrées
  « Témoignages »/« Interviews collaborateurs » en ADR 24 - aucune section
  restante n'offre un contenu équivalent, repointer aurait été trompeur.
- **Décision - Footer intégré au conteneur de scroll-snap, via
  restructuration route-scopée d'`App.vue` (pas globale).** Le brief demande
  de remonter le conteneur `h-dvh overflow-y-auto snap-y snap-mandatory`
  d'un niveau pour englober `<main>` ET `<TheFooter>` directement dans
  `App.vue`. Implémenté avec UNE précision non explicitée par le brief mais
  nécessaire pour ne pas régresser silencieusement les deux autres routes :
  1. **`route.meta.fullPageScroll` (nouveau, `routes.ts`), lu par `App.vue`
     via `isFullPageScroll = computed(() => route.meta.fullPageScroll ===
     true)`.** Seule la route `/` porte ce méta. `RouteMeta` (vue-router)
     étend déjà `Record<PropertyKey, unknown>` en amont - aucune
     augmentation de module nécessaire, même mécanisme que le `meta:
     { throwaway: true }` déjà présent sur `/styleguide` ;
  2. **`App.vue` : le `<div class="flex-1">` qui portait autrefois `<main>`
     directement est remplacé par un conteneur conditionnel** -
     `isFullPageScroll ? 'h-dvh overflow-y-auto snap-y snap-mandatory' :
     'flex flex-1 flex-col'` - qui englobe désormais `<main>` ET
     `<TheFooter>` comme enfants directs. `<main>` perd son `flex-1` fixe
     (devient conditionnel : `undefined` en mode plein écran, où sa hauteur
     doit rester `auto` - la somme des `h-dvh` de ses diapositives -, sinon
     `flex-1` le compresserait à la hauteur disponible et casserait le
     scroll-snap ; `flex-1` conservé sinon, pour garder le pied de page
     « collé en bas » sur les pages courtes) ;
  3. **`TheFooter.vue` gagne un prop `fullPageScroll?: boolean` (défaut
     `false`), PAS une classe figée.** Quand `true` : `w-full min-h-dvh
     snap-start flex flex-col justify-end` (`min-h-dvh` plutôt que `h-dvh`
     strict - fallback explicitement permis par le brief pour un contenu
     dense sur petit mobile, le pied de page a 4 colonnes + CTA + barre
     basse, plus dense qu'une diapositive de `HomeView.vue`). Quand `false`
     (défaut) : comportement strictement inchangé (`pt-20 sm:pt-24`, pas de
     `snap-start`/`min-h-dvh`). Un prop plutôt qu'une classe systématique :
     `TheFooter` est un composant PARTAGÉ, monté une seule fois par
     `App.vue` mais consommé par 3 routes (`/`, `/styleguide`, 404) - le
     rendre systématiquement `min-h-dvh` aurait donné un pied de page
     pleine hauteur, quasi vide, sur la page de documentation du Design
     System et sur la 404, un effet secondaire que ni le brief ni le client
     ne demandent (le brief cible « la page d'accueil », jamais les deux
     autres routes par leur nom) ;
  4. **`HomeView.vue` perd son wrapper `#page-scroll`.** Les 5 `<section>`
     restantes (Hero, groupe Confiance+Services, Secteurs, Valeur ajoutée,
     RSE) redeviennent des racines de template directes (Vue 3 accepte un
     template multi-racines), chacune gardant ses propres classes `h-dvh
     w-full snap-start flex flex-col justify-center` - le conteneur
     scrollable qui les enclenche vit désormais dans `App.vue`, un niveau
     au-dessus. Le CSS `scroll-snap-align` d'un enfant profond fonctionne
     à travers `<main>` tant qu'aucun ancêtre intermédiaire n'établit sa
     propre boîte de défilement (`<main>` n'a ni `overflow` ni hauteur
     fixe propres) : les 5 diapositives de `HomeView.vue` s'enclenchent donc
     bien dans le même conteneur de scroll qu'`App.vue`, malgré la
     profondeur DOM supplémentaire (`<main><RouterView>…</RouterView></main>`).
  5. **Pourquoi route-scopé plutôt qu'appliqué sans condition à `App.vue`
     comme le brief semble le suggérer littéralement :** le brief autorise
     explicitement à MODIFIER `App.vue`/`TheFooter.vue`, mais rien n'indique
     qu'il souhaite casser `/styleguide` (contenu long, pensé pour un
     défilement continu) ou la 404 (page courte, pied de page « collé en
     bas », comportement `flex-1` existant) - cette précision reste une
     mesure de prudence proportionnée, pas une réouverture des limites
     d'ADR 24/25 sur le fond (celles-ci portaient sur REFUSER de toucher
     `App.vue` du tout, ce qui n'est plus le sujet ici).
- **Conséquences :**
  - `docs/CODEMAP.md` régénéré : confirme l'absence d'`AvatarStack.vue` dans
    le graphe de dépendances, et les nouvelles arêtes `App.vue` →
    `TheFooter.vue` (prop `fullPageScroll`) ;
  - Vérifié par exécution : `npm run build` (type-check + build client/SSR +
    rendu SSG), `npm run lint` (1 correction manuelle requise - variable
    `props` assignée mais jamais lue dans `TheFooter.vue`, `defineProps`
    n'a pas besoin d'être capturé dans une variable quand le template
    accède aux props par leur nom directement, cf. `columns`/`description`
    déjà non capturés avant ce ticket), `npm run format`, `vitest run` (6
    tests passants). Grep du HTML pré-rendu de production
    (`dist/index.html`) : exactement 6 occurrences de `snap-start`
    (`Hero`/`services-group`/`secteurs`/`valeurs`/`rse`/`<footer>` - le
    Footer remplace l'ancienne diapositive Équipe comme 6ᵉ point d'ancrage),
    0 occurrence d'`id="equipe"`, 0 occurrence de la phrase « redéfinir
    l'image des ESN » (confirmant la suppression complète, pas un résidu de
    texte), 0 occurrence d'« interview », 1 seule occurrence de « glassdoor »
    (lien social légitime, inchangé). Classe exacte du `<footer>` de
    production confirmée par grep : `w-full min-h-dvh snap-start flex
    flex-col justify-end pt-12` (plus les classes décoratives inchangées).
    Fumée sur serveur de développement (`vite`, PAS Playwright) : `App.vue`,
    `HomeView.vue`, `TheFooter.vue` répondent `HTTP 200` sans erreur de
    transformation. **Aucune vérification par capture d'écran ni navigateur
    piloté n'a été utilisée, contrainte explicite du rôle reconduite pour ce
    ticket malgré l'autorisation de modifier `App.vue`/`TheFooter.vue`** -
    le rendu visuel réel (fluidité de l'enclenchement du Footer, répartition
    du contenu du pied de page sur `min-h-dvh` selon la densité des colonnes
    sur petit mobile, absence de régression sur `/styleguide` et la 404)
    reste à confirmer par un humain ou un agent disposant d'un navigateur -
    limite documentée plutôt que passée sous silence, même réserve
    méthodologique que toutes les itérations précédentes du pivot « scroll
    snapping ».

## ADR 27 : V0.1.23 - chorégraphie CSS native pour `CoverCarousel` (« effet wow »), pas de dépendance externe ; piège SSR de `<TransitionGroup>` identifié et contourné

- **Contexte :** le client fournit une nouvelle maquette pour la section
  Valeur ajoutée : le titre doit garder son effet typographique « évidé »
  (contour coloré, intérieur transparent), et la transition entre les
  cartes du `CoverCarousel` doit devenir « premium » - un glissement ample,
  départ rapide/atterrissage en douceur - sans aucune bibliothèque
  d'animation externe.
- **Décision - titre « Notre valeur ajoutée » : déjà conforme, aucune
  modification.** Vérifié par lecture de `HomeView.vue` avant toute
  modification (`docs/CURRENT_STATE.md`/`docs/DECISIONS.md` obligent) :
  `OUTLINE_NAVY` (`text-primary-900 supports-[-webkit-text-stroke:1px]:
  text-transparent supports-[-webkit-text-stroke:1px]:[-webkit-text-stroke:
  2px_var(--color-primary-900)]`) est déjà appliqué à ce `<h2>` depuis les
  révisions Hero de V0.1 (cf. commentaire « Typographie contournée » en
  tête de `HomeView.vue`) - exactement l'effet demandé (contour navy,
  intérieur transparent). Traité comme une re-confirmation, pas comme un
  travail à refaire, même posture qu'ADR 24 pour les Notations déjà
  retirées. **Volontairement PAS alignée sur la formulation littérale du
  brief** (`text-transparent` + `-webkit-text-stroke` inconditionnels) :
  l'implémentation existante enveloppe la propriété dans un garde
  `@supports` - sans lui, un navigateur qui ne supporte pas
  `-webkit-text-stroke` (propriété non standard, support large mais non
  garanti) recevrait un titre à la fois `text-transparent` ET sans contour
  peint, donc INVISIBLE ; la classe de base pose une couleur pleine de
  repli, seule la variante `supports-[...]` bascule vers le rendu évidé
  quand le navigateur sait le faire. Remplacer ce garde par la version
  inconditionnelle du brief aurait été une RÉGRESSION d'accessibilité,
  pas un alignement - non fait.
- **Décision - chorégraphie de `CoverCarousel` : CSS natif (Tailwind +
  `<TransitionGroup>` du cœur de Vue), aucune dépendance ajoutée.** Options
  considérées :
  1. **Bibliothèque de gestes/physique (ex. Framer Motion, GSAP,
     `@vueuse/motion`).** Rejetée d'emblée, conforme au brief (« sans
     aucune bibliothèque externe ») et à la ligne du projet (aucune
     dépendance d'animation dans `package.json` à ce jour, cf.
     `CODEMAP.md`) : un poids de bundle et une surface de maintenance
     ajoutés pour un besoin entièrement couvert par les transitions CSS
     natives + le mécanisme d'entrée/sortie déjà intégré à Vue
     (`<TransitionGroup>`), qu'aucun autre carrousel du Design System
     n'utilisait encore mais qui fait partie du cœur du framework, pas
     d'une dépendance tierce ;
  2. **Retenue : empilement CSS Grid + `<TransitionGroup>` clé sur
     l'indice réel de chaque diapositive.** Le layout flex à 3 emplacements
     FIXES d'avant ce ticket (précédente/active/suivante) affichait un
     contenu DIFFÉRENT à chaque emplacement selon le rôle - naviguer ne
     faisait que changer CE contenu sur place (crossfade d'échelle/opacité,
     jamais de translation réelle). Depuis ce ticket, les 3 diapositives
     visibles sont empilées dans la même cellule CSS Grid
     (`col-start-1 row-start-1` sur chaque carte) et gardent leur identité
     (leur indice réel comme `:key` Vue, pas leur rôle) d'une navigation à
     l'autre : une diapositive donnée glisse donc PHYSIQUEMENT de `next` à
     `active`, ou d'`active` à `prev` (translation ±110 % + échelle +
     opacité, cf. `ROLE_CLASSES` dans `CoverCarousel.vue`), plutôt que de
     changer de contenu à un emplacement figé - c'est ce changement de rôle
     réel, combiné à `transition-all duration-700 ease-premium` sur chaque
     carte, qui produit l'« effet wow » demandé. Seules les diapositives
     qui ENTRENT/SORTENT du trio visible (la nouvelle `next`/`prev` la plus
     éloignée, l'ancienne qui vient de quitter le trio) déclenchent les
     transitions d'entrée/sortie propres à `<TransitionGroup>` ;
  3. **Grille plutôt que positionnement `absolute` manuel (les deux étaient
     suggérés par le brief) :** un empilement CSS Grid se dimensionne
     automatiquement sur la plus haute des 3 cartes empilées ; un
     positionnement `absolute` pur aurait exigé de fixer une hauteur à la
     main sur le conteneur, avec un risque réel de rognage - les 4 cartes
     de la section Valeur ajoutée n'ont pas toutes la même longueur de
     texte, et `CarouselSlideContent` ne pose qu'un PLANCHER
     (`min-h-[200px]`), jamais un plafond.
- **Décision - courbe d'animation : nouveau jeton `--ease-premium:
  cubic-bezier(0.25, 1, 0.5, 1)` dans `main.css`, pas une valeur arbitraire
  posée dans le composant.** Le brief proposait `ease-[cubic-bezier(0.25,1,
  0.5,1)]` (valeur arbitraire Tailwind) directement dans `CoverCarousel.vue`
  - écarté : `CLAUDE.md` classe les courbes d'animation parmi les tokens de
  design (couleurs, ombres…) déclarés dans le bloc `@theme` de `main.css`,
  pas des valeurs locales à un composant. `--ease-premium` rejoint
  `--ease-snap` (micro-interactions courtes, ~200-300ms) et `--ease-out-back`
  (non consommé à ce jour) dans la section « Courbes » - Tailwind v4 génère
  automatiquement l'utilitaire `ease-premium` depuis ce jeton, même
  mécanisme déjà éprouvé pour `ease-snap`/`ease-out-back`, aucune
  configuration supplémentaire requise.
- **Piège identifié et contourné - `<TransitionGroup tag="...">` fuit ses
  props de configuration comme attributs HTML bruts en SSR.** Découvert en
  inspectant `dist/index.html` après la première implémentation (qui posait
  `tag="div"` directement sur `<TransitionGroup>`, avec `enter-active-class`/
  `enter-from-class`/`leave-active-class`/`leave-to-class` en props) :
  ces quatre props apparaissaient LITTÉRALEMENT comme attributs HTML sur le
  `<div>` rendu (`<div ... enter-active-class="..." enter-from-class="..."
  ...>`), invisibles à l'utilisateur mais bien présents dans le HTML
  pré-rendu de production. Root cause tracée jusqu'au compilateur : quand
  `@vue/compiler-sfc` compile un `<TransitionGroup>` pour le SSR
  (`compileTemplate({ ssr: true })`, exactement le mode utilisé par
  `vite-ssg` pour le pré-rendu) ET qu'un `tag` STATIQUE est présent,
  `ssrTransformTransitionGroup` (`@vue/compiler-ssr`) prend un raccourci de
  compilation : il « aplatit » le composant en un élément HTML brut et
  recopie TOUTES ses autres props comme attributs, sans distinguer les
  vraies props de configuration de transition (`name`, `enter-active-class`,
  etc. - pourtant bien déclarées dans `TransitionPropsValidators`, cf.
  `@vue/runtime-dom`) des attributs HTML légitimes (`class`) - vérifié par
  compilation directe du template en isolation (`compileTemplate` appelé à
  la main sur un composant de reproduction minimal) et confirmé absent
  quand `tag` n'est PAS fourni (le composant se comporte alors comme un
  `Fragment` au runtime, `rawProps.tag || Fragment`, cf.
  `@vue/runtime-dom` - comportement documenté, pas une supposition).
  **Correction :** `tag` retiré de `<TransitionGroup>` ; les classes de
  pile CSS Grid (`relative grid w-full sm:w-1/2 lg:w-2/5`) migrent sur un
  `<div>` englobant écrit explicitement dans le template, dont
  `<TransitionGroup>` (sans `tag`, donc un `Fragment` invisible dans le
  DOM) restitue les cartes comme enfants DIRECTS - exactement la structure
  dont la pile Grid a besoin (`col-start-1 row-start-1` exige des enfants
  directs du conteneur `grid`). Commentaire dédié laissé dans
  `CoverCarousel.vue` juste au-dessus du `<TransitionGroup>` pour qu'un
  futur agent n'ajoute pas `tag="div"` « pour plus de clarté » et ne
  réintroduise pas ce défaut silencieusement.
- **Décision - `enter-from-class`/`leave-to-class` : uniquement
  `!opacity-0` (avec l'important Tailwind), aucune classe de
  translation/échelle.** Chaque carte porte en permanence sa classe de
  rôle (`ROLE_CLASSES`), qui fixe déjà `opacity-40`/`scale-75` sur les
  cartes latérales ; Vue ne retire PAS cette classe pendant l'entrée/la
  sortie, il ajoute seulement les classes de transition par-dessus. Sans
  l'important Tailwind, `opacity-40` (classe de rôle, permanente) et
  `opacity-0` (classe d'entrée/sortie, temporaire) auraient la MÊME
  spécificité CSS - deux classes distinctes fixant la même propriété sur le
  même élément au même instant : lequel l'emporterait dépendrait alors de
  l'ordre de génération du CSS par Tailwind, un détail d'implémentation non
  garanti d'une build à l'autre (cf. discussion Tailwind sur l'ordre des
  classes utilitaires générées) - fragile, écarté au profit de `!` (force
  la priorité indépendamment de l'ordre, mécanisme Tailwind documenté pour
  ce cas précis). Translation/échelle ne sont volontairement PAS
  redéfinies à l'entrée/la sortie - la carte entrante/sortante est déjà à
  sa position de repos (portée par sa classe de rôle), elle se contente
  d'apparaître/disparaître en fondu à cette position : la même prudence
  anti-conflit s'appliquerait à `scale`/`translate-x`, mais laisser ces
  deux propriétés inchangées les évite entièrement plutôt que d'empiler un
  second `!important`.
- **Décision - `prefers-reduced-motion` : `motion-reduce:transition-none`
  sur la classe permanente de chaque carte ET sur `enter-active-class`/
  `leave-active-class`.** Sous préférence réduite, aucune transition ne
  s'exécute nulle part dans ce composant - les cartes changent de rôle
  instantanément (le end-state, correct, s'applique sans étape intermédiaire
  animée), même garantie que `CardCarousel`/le Hero de `HomeView` déjà en
  place avant ce ticket, aucune régression.
- **Interactivité : clic sur une carte latérale inchangé.** `handleCardClick`
  reprend exactement le même `navigateTo(card.key)` qu'avant ce ticket
  (`@click="navigateTo(prevIndex)"`/`navigateTo(nextIndex)"`), simplement
  reformulé pour s'appliquer à la carte de rôle courant plutôt qu'à un
  gestionnaire dupliqué par emplacement fixe.
- **Conséquences :**
  - `main.css` gagne un jeton `--ease-premium`, documenté dans son
    commentaire d'en-tête (pourquoi il diffère d'`--ease-snap`) ;
  - `CoverCarousel.vue` : layout flex à 3 emplacements fixes remplacé par
    empilement CSS Grid + `<TransitionGroup>` (cf. détail ci-dessus) -
    interface publique du composant INCHANGÉE (`count`/`autoplayMs`/`label`
    en props, créneau `#slide` avec `index`/`active`) : `HomeView.vue` n'a
    besoin d'AUCUNE modification pour consommer la nouvelle version, la
    section Valeur ajoutée reste `<CoverCarousel :count="VALUE_CARDS.length"
    label="Notre valeur ajoutée" class="mt-14">` à l'identique ;
  - Vérifié par exécution (`npm run build` - type-check + build client/SSR
    + rendu SSG, `npm run lint`, `npm run format`, `vitest run` - 6 tests
    passants) et par grep du CSS/HTML de production : présence de
    `ease-premium` (résolu en `cubic-bezier(.25, 1, .5, 1)` dans le CSS
    généré), `duration-700`, `col-start-1`/`row-start-1`, `110%`,
    `.\!opacity-0`, `webkit-text-stroke` (titre, re-confirmé) ; **0**
    occurrence de `enter-active-class`/`enter-from-class`/
    `leave-active-class`/`leave-to-class` dans `dist/index.html` (piège SSR
    ci-dessus confirmé corrigé, pas seulement supposé). Fumée sur serveur
    de développement (`vite`, PAS Playwright) : `CoverCarousel.vue` et
    `HomeView.vue` répondent `HTTP 200` sans erreur de transformation.
    **Aucune vérification par capture d'écran ni navigateur piloté
    (Playwright ou équivalent) n'a été utilisée, contrainte explicite du
    rôle pour ce ticket** - le rendu visuel réel de la chorégraphie
    (fluidité perçue, ampleur exacte du chevauchement entre carte active et
    cartes latérales, confort de la courbe `ease-premium` en usage réel)
    reste à confirmer par un humain ou un agent disposant d'un navigateur,
    limite documentée plutôt que passée sous silence, même réserve
    méthodologique que toutes les itérations précédentes.

## ADR 28 : V0.1.24 - menu latéral (Sidebar), contrôles de carrousel asymétriques floutés, animations d'apparition au défilement

- **Contexte :** trois évolutions UX/UI indépendantes, validées sur maquettes
  client, regroupées dans un seul ticket : (1) remplacer la barre de
  navigation en texte brut par un menu latéral déclenché par un bouton
  burger ; (2) retirer la flèche « précédent » des deux carrousels du Design
  System et donner à la flèche « suivant » restante un traitement flouté au
  repos, net au survol/focus ; (3) ajouter des animations d'apparition
  (fondu + léger `translate-y`) sur le contenu des diapositives de
  `HomeView.vue` lorsqu'elles entrent dans le viewport, en scroll snapping
  pleine page depuis ADR 24/26. **Contrainte de rôle explicite reconduite
  pour ce ticket : interdiction absolue de Playwright ou de tout script de
  test automatisé** - même réserve méthodologique que toutes les itérations
  précédentes depuis V0.1.7.

- **Décision - menu latéral (`MegaMenu.vue`, `App.vue` non touché) :**
  1. **Pivot de patron d'interaction, pas de renommage de composant.**
     `MegaMenu.vue` gardait jusqu'ici un patron *disclosure* desktop (liens en
     clair + panneaux déroulants au survol/clavier, cf. commentaire d'origine
     du fichier) et un tiroir accordéon réservé à `lg:hidden`. Le client
     demande une barre épurée (logo + burger) à TOUTES les tailles d'écran, et
     un tiroir qui glisse depuis la gauche pour porter la liste complète. Le
     nom du fichier et du composant reste `MegaMenu` (interface publique
     inchangée : prop `entries`, slots `logo`/`leading`/`actions`/
     `mobileActions`) - `App.vue` ne nécessite donc AUCUNE modification pour
     consommer la nouvelle version, exactement le même principe de
     non-régression déjà appliqué à la refonte de `CoverCarousel` en ADR 27 ;
  2. **Retrait complet du panneau déroulant desktop et de la logique de
     survol.** `scheduleOpen`/`scheduleClose`/`hoverTimer`/`hoverDelay`,
     `onFocusOut` sur les `<li>` de la barre, `openAndEnter`, `closeAndRefocus`,
     la Map `triggers`/`registerTrigger`, et le rendu du panneau à 2-3
     colonnes + encart (`MegaMenuFeature`) disparaissent intégralement : plus
     aucun consommateur une fois la barre réduite à logo + burger. `feature`/
     `MegaMenuFeature` sont retirés de `components/ui/types.ts` (vérifié par
     recherche globale avant suppression : `mainNav.ts` n'a jamais posé ce
     champ, aucun autre fichier n'y fait référence) - même principe que le
     retrait d'un composant entièrement orphelin (`DataCore`/`WaveRibbon`…),
     appliqué ici à un champ de type plutôt qu'à un composant entier ;
  3. **Le tiroir devient le SEUL mode d'affichage de la navigation, à toutes
     les tailles d'écran.** Le bouton burger perd son `lg:hidden` : il est
     désormais le seul déclencheur, mobile comme desktop. La liste
     `mainNavEntries` (avec ses `columns` pour « Secteurs ») migre dans le
     tiroir sous forme d'accordéon - même mécanique `grid-template-rows`
     animée que l'ex-tiroir mobile (motif déjà validé, pas une nouvelle
     technique), pas de sous-menu `role="menu"` (le motif *disclosure*
     documenté à l'origine du fichier reste valide : une vraie liste de
     liens, atteignable au Tab dans l'ordre du document) ;
  4. **Icônes minimalistes par entrée, codées en dur par `id` connu.**
     Demande client : « icônes SVG correspondantes » (brief cite Équipe/
     Expertises/Secteurs - Équipe n'existe plus comme entrée de nav depuis
     ADR 26, seules Expertises/Secteurs sont réellement présentes dans
     `mainNav.ts` aujourd'hui). Une table `entryIconKind(id)` mappe
     `'entreprise'` → mallette, `'references'` → bâtiment, tout autre `id` →
     chevron générique - jamais une icône dédiée inventée pour une entrée qui
     n'existe pas (`CLAUDE.md`, intégrité du contenu, appliquée ici à une
     icône plutôt qu'à un chiffre/nom) ; un futur ajout d'entrée retombe
     silencieusement sur l'icône par défaut plutôt que de casser ;
  5. **Fermeture : croix dédiée + clic sur le fond assombri + Échap, PAS
     `onClickOutside` (VueUse), retiré du fichier.** Le tiroir est désormais
     accompagné d'un fond `fixed inset-0` assombri/flouté (`bg-primary-900/50
     backdrop-blur-sm`) qui bloque visuellement le reste de la page - cet
     élément est un DESCENDANT DOM du `<header>` (comme le tiroir lui-même,
     aucun `Teleport` utilisé, cf. point 8), donc un clic dessus serait resté
     « à l'intérieur » d'un `onClickOutside(rootEl, …)` calqué sur l'ancien
     mécanisme et n'aurait jamais fermé le tiroir : un gestionnaire `@click`
     explicite sur le fond est la seule solution correcte, plus simple et
     sans risque de course avec le clic sur le bouton burger lui-même
     (contrairement à `onClickOutside`, qui aurait dû ignorer spécifiquement
     ce bouton) ;
  6. **Piège de focus clavier maison (`trapFocus`), sans `role="dialog"`/
     `aria-modal`.** Le tiroir se comporte visuellement comme une
     superposition modale (fond assombri bloquant tout le reste), mais rien
     dans le DOM n'est réellement neutralisé (`inert`) - sans piège de focus,
     `Tab` depuis le dernier élément focusable du tiroir atteindrait le
     contenu de `<main>`, masqué à l'écran mais toujours présent, désorientant
     un utilisateur clavier. `trapFocus` (Tab/Maj+Tab bouclent entre le
     premier et le dernier élément focusable du tiroir, cf. commentaire
     d'en-tête de `MegaMenu.vue`) referme ce trou sans élargir le ticket à
     `App.vue`/un attribut `inert` sur `<main>` - un choix proportionné à ce
     qui est réellement demandé (même principe de proportionnalité qu'ADR 24
     point 1). Focus posé sur le premier élément focusable à l'ouverture,
     rendu au bouton burger à la fermeture EXPLICITE (croix, fond, Échap)
     uniquement - la fermeture IMPLICITE au changement de route (l'utilisateur
     vient de cliquer un lien) ne vole pas le focus ;
  7. **Landmark « Navigation principale » déplacé du `<nav>` de la barre vers
     le `<nav>` du tiroir.** La barre ne porte plus de liste de liens : le
     landmark nommé doit vivre là où vivent réellement les liens
     désormais, pas être dupliqué ni laissé à un endroit qui n'en contient
     plus. Un seul `<nav aria-label="Navigation principale">` sur toute la
     page, comme avant ce ticket ;
  8. **Aucun `Teleport`.** Le fond assombri et le tiroir restent des
     descendants DOM du `<header ref="root">` existant (`position: fixed`,
     `z-90`/`z-95`) : `<header>` porte déjà `sticky` + un `z-index` explicite
     (`z-50`), ce qui établit une boîte de stacking locale - vérifié qu'aucun
     autre contenu de page (flèches de carrousel `z-20`, cartes actives de
     `CoverCarousel` `z-20`) ne dépasse la position de `<header>` dans le
     contexte d'empilement racine, donc le fond/tiroir restent visuellement
     au-dessus de tout sans avoir besoin d'être déplacés hors de leur parent
     naturel. Une solution plus simple que `Teleport to="body"`, sans
     compromis constaté sur ce site précis.

- **Décision - contrôles de carrousel asymétriques (`CardCarousel.vue`,
  `CoverCarousel.vue`) :**
  1. **Retrait total du bouton « précédent ».** Demande client explicite :
     l'utilisateur n'avance qu'avec la flèche « suivant » ou l'autoplay.
     `CardCarousel` : `goPrev` et la branche `'prev'` de l'ex-`handleManualNav`
     sont du code mort une fois le bouton retiré - supprimés plutôt que
     laissés orphelins (`handleManualNav` renommé `handleManualNext`, un seul
     sens désormais). `CoverCarousel` : SEUL le bouton fléché disparaît -
     `prevIndex` et la carte latérale gauche partiellement visible
     (`ROLE_CLASSES.prev`) restent en place et restent cliquables
     (`handleCardClick` → `navigateTo(prevIndex)`), l'esthétique « cover
     flow » (ADR 21) n'a pas de sens sans sa carte latérale gauche ;
  2. **Réversibilité totale préservée malgré l'asymétrie.** Aucune
     diapositive ne devient inatteignable : la navigation boucle
     (`goTo`/`wrap`, modulo `count`, inchangé), donc `count - 1` pressions
     sur « suivant » suffisent toujours à atteindre n'importe quelle
     diapositive depuis n'importe quelle position, y compris sous
     `prefers-reduced-motion` (où l'autoplay ne démarre jamais, cf. discipline
     déjà en place) - moins directe qu'un aller-retour, jamais bloquante ;
  3. **Traitement flouté, hover/focus symétriques.** `blur-[2px] opacity-50`
     au repos sur la flèche « suivant » restante des deux composants,
     `hover:blur-none hover:opacity-100` ET `focus-visible:blur-none
     focus-visible:opacity-100` (parité clavier/souris volontaire - un
     utilisateur qui tabule jusqu'au bouton doit aussi le voir redevenir net,
     pas seulement au survol souris, sans quoi un utilisateur clavier
     perdrait un repère visuel qu'un utilisateur souris obtient
     gratuitement), `transition-all duration-300` (remplace le `transition
     duration-200` par défaut d'avant ce ticket - couvre explicitement
     `blur`/`opacity` en plus des propriétés déjà animées). Le bouton reste
     focusable, son `aria-label` (« Diapositive suivante ») et sa cible
     cliquable sont inchangés : seul le rendu visuel AU REPOS s'atténue, la
     fonctionnalité et l'accessibilité au clavier/lecteur d'écran ne sont pas
     dégradées par ce choix de direction artistique ;
  4. **Pas de neutralisation sous `prefers-reduced-motion` pour ce
     traitement.** Contrairement à une animation décorative en boucle
     (`CLAUDE.md`), le flou/l'opacité au repos sont un état visuel STATIQUE
     (pas une animation qui se rejoue), et leur transition au survol suit la
     même convention déjà en place sur CE bouton (`motion-reduce:
     transition-none`, préexistant) : sous préférence réduite, le survol/focus
     bascule instantanément net plutôt que sur 300 ms, jamais neutralisé au
     point de rester flou en permanence quel que soit l'état d'interaction.

- **Décision - animations d'apparition au défilement (`HomeView.vue`,
  nouveau composable `composables/useScrollReveal.ts`) :**
  1. **API native `IntersectionObserver`, via `useIntersectionObserver`
     (VueUse) - déjà une dépendance du projet (`onClickOutside`, consommé par
     `MegaMenu.vue` avant ce ticket).** Aucune bibliothèque d'animation
     externe ajoutée (GSAP explicitement écarté par le brief) : exactement le
     même principe que le refus d'une dépendance d'animation pour
     `CoverCarousel` en ADR 27, reconduit ici ;
  2. **Trois états (`'idle' | 'hidden' | 'visible'`), jamais un booléen.**
     `idle` (valeur initiale, y compris pendant le pré-rendu `vite-ssg` ET
     pour un visiteur/robot sans JavaScript) ne porte AUCUNE classe
     d'animation côté appelant - le contenu reste pleinement visible par
     défaut, condition nécessaire pour le SEO (ADR 01) et pour ne jamais
     cacher du contenu réel à un utilisateur dont l'observateur ne se
     déclenche jamais. Un booléen `revealed` initialisé à `false` aurait
     obligé soit à cacher le contenu par défaut (régression SEO/no-JS), soit
     à l'initialiser à `true` uniquement côté client (écart d'hydratation :
     le HTML pré-rendu montrerait un état différent de l'état initial du
     composant une fois hydraté côté navigateur, cf. la règle de déterminisme
     de `CLAUDE.md`/ADR 01) ;
  3. **Le PREMIER rapport de l'observateur décide de l'état de départ,
     jamais présumé « hors champ ».** Un `IntersectionObserver` fraîchement
     attaché rapporte toujours l'état courant dès `observe()` - si cet état
     initial montre déjà l'élément intersectant (ex. navigation directe vers
     une ancre de la page, `mainNav.ts` cible des `hash` sur `/#services`/
     `/#secteurs`, la diapositive visée peut donc déjà être à l'écran dès le
     montage), l'état reste `idle` pour toujours plutôt que de faire
     disparaître puis réapparaître un contenu que l'utilisateur regarde déjà.
     Seul un élément RÉELLEMENT hors champ au premier rapport passe par
     `hidden` puis `visible` au gré d'un défilement ultérieur - sans cette
     précaution, une simple présomption « toujours hors champ au montage »
     (valable pour un premier chargement classique) aurait cassé ce cas de
     navigation directe ;
  4. **Hero explicitement exclu de ce composable.** Le Hero a déjà sa propre
     chorégraphie d'entrée dédiée (`animate-fade-up` à délais échelonnés sur
     l'eyebrow/le `<h1>`/le paragraphe, posée depuis ADR 05/06) et il est
     toujours visible au premier chargement (`isIntersecting: true` dès le
     premier rapport) : l'y appliquer n'aurait de toute façon jamais déclenché
     l'effet (cf. point 3), tout en risquant de faire interférer deux
     chorégraphies distinctes sur la même section - même principe déjà posé
     en ADR 05 (« pas de superposition de deux décors qui se disputent
     l'attention ») transposé d'un décor visuel à une animation d'entrée ;
  5. **Réutilisation du jeton `animate-fade-up` existant, pas une nouvelle
     valeur.** `main.css` porte déjà ce jeton (fondu + `translate3d(0, 14px,
     0)` → `(0,0,0)`, 0,45 s, `--ease-snap`), utilisé par le Hero : le
     réappliquer pour cet effet (au lieu d'un nouveau jeton `--animate-*` ou
     d'une transition Tailwind ad hoc) suit la même discipline de réemploi de
     token déjà posée pour `--ease-premium` (ADR 27) - un fondu + léger
     `translate-y` est exactement ce que ce jeton produit déjà ;
  6. **`useTemplateRef` + `ref="nomStable"`, jamais une fonction `:ref="(el)
     => …"` inline.** `HomeView.vue` re-rend son template plusieurs fois par
     seconde pendant le cycle du typewriter du Hero (toutes les 5 s, sur
     quelques centaines de ms) : une fonction de binding fraîche à chaque
     rendu aurait fait rejouer inutilement chaque binding de `ref` à cette
     cadence (Vue détecterait un changement de référence de fonction à
     chaque rendu). Le composable prend directement en paramètre une `Ref`
     déclarée par l'appelant via `useTemplateRef` (même idiome que
     `MegaMenu.vue`, `panelEl`/`burgerTrigger`) plutôt que d'en créer une en
     interne ;
  7. **5 instances, pas une boucle générique sur un tableau de sections.**
     Confiance, Services, Secteurs, Valeur ajoutée, RSE - chacune a son
     propre contexte de rendu (JSX/template différent, pas une liste
     homogène de props), une abstraction en boucle aurait exigé de
     restructurer le template en `v-for` sur une configuration, un chantier
     plus large que ce que demande le ticket pour un gain de lignes modeste
     (5 appels d'une ligne chacun) ;
  8. **`threshold: 0.3`, pas `0`/`1`.** Un seuil de 30 % déclenche l'apparition
     un peu après le début de l'enclenchement du `snap-start` de la
     diapositive plutôt qu'au premier pixel visible (`0`, jugé trop précoce,
     l'effet se jouerait avant que l'utilisateur n'ait fini de faire défiler)
     ou seulement une fois entièrement visible (`1`, trop tardif sur une
     diapositive `h-dvh` dont le haut peut rester masqué par la Navbar
     `sticky`, cf. limite déjà documentée en ADR 24).

- **Conséquences :**
  - Le Design System perd un mécanisme (panneau déroulant desktop de
    `MegaMenu`, `MegaMenuFeature`) sans qu'aucun ne soit remplacé par un
    équivalent plus complexe - trajectoire d'épuration cohérente avec ADR 15/
    22/23 ; il en gagne un autre à vocation générale (`useScrollReveal`,
    `composables/`) réutilisable par une future page qui adopterait le même
    modèle de scroll snapping ;
  - `docs/CODEMAP.md` régénéré (`scripts/generate-codemap.py`) : confirme la
    nouvelle arête `HomeView.vue` → `composables/useScrollReveal.ts`, la
    disparition de `MegaMenuFeature` du graphe de types, et l'absence de
    toute nouvelle dépendance externe dans `package.json` ;
  - Vérifié par exécution : `npm run type-check`, `npm run lint` (aucune
    correction manuelle nécessaire au-delà du reformatage automatique),
    `npm run format`, `vitest run` (6 tests passants), `npm run build`
    (type-check + build client + build SSR + rendu SSG des pages statiques,
    sans erreur). Grep du CSS de production (`dist/assets/app-*.css`) :
    présence de `.z-90`/`.z-95` (fond/tiroir du menu latéral), `.blur-\[2px\]`,
    `.opacity-50`, `.hover\:blur-none`, `.focus-visible\:blur-none`,
    `.transition-all`, `.duration-300`. Grep/comptage Python du HTML pré-rendu
    (`dist/index.html`) : exactement 4 occurrences d'`aria-label="Diapositive
    suivante"` (3× `CardCarousel` - Services/Secteurs/RSE - + 1×
    `CoverCarousel` - Valeur ajoutée), **0** occurrence d'`aria-label=
    "Diapositive précédente"`, 1 occurrence de `mega-menu-sidebar` (le tiroir
    n'est PAS rendu dans le HTML pré-rendu tant que `sidebarOpen` est `false`
    - seul le bouton burger et son `aria-controls` y figurent, comportement
    attendu d'un `v-if`), **0** occurrence de `role="menu"`/« Discutons IA »/
    « Notre collectif » (nettoyage confirmé), 3 occurrences d'`animate-fade-up`
    (les 3 éléments du Hero, INCHANGÉES - confirme que le nouveau composable
    n'ajoute aucune classe en SSR, cf. décision 2 ci-dessus), 0 occurrence
    résiduelle d'`opacity-0` imputable au scroll reveal (les 4 occurrences
    trouvées appartiennent à l'effet de brillance déjà existant de
    `BaseButton`, vérifiées sans rapport). **Aucune vérification par capture
    d'écran ni navigateur piloté (Playwright ou équivalent) n'a été utilisée
    pour cette itération, contrainte explicite du rôle pour ce ticket** - le
    rendu visuel réel (fluidité du slide-in du tiroir, lisibilité du flou de
    la flèche au repos sur les différents fonds de section, calibrage du
    `threshold` de l'apparition au défilement en usage réel) reste à
    confirmer par un humain ou un agent disposant d'un navigateur, limite
    documentée plutôt que passée sous silence, même réserve méthodologique
    que toutes les itérations précédentes.

## ADR 29 : V0.1.25 - flèche de carrousel plate à couleurs conditionnelles, balayage horizontal, pagination pleine opacité

- **Contexte :** retour client sur les carrousels (`CardCarousel.vue`,
  `CoverCarousel.vue`) livrés en V0.1.24 (ADR 28), avec des règles très
  précises : (1) retirer tout contour de la flèche « suivant » (ring, bordure,
  ombre) et la peindre en couleur pleine conditionnelle selon `tone`, icône
  plus grasse ; (2) remplacer le fondu/décalage vertical du changement de
  diapositive par un balayage horizontal droite → gauche ; (3) retirer la
  réduction d'opacité du compteur décoratif. **Contrainte de rôle explicite
  reconduite : interdiction absolue de Playwright ou de tout script de test
  automatisé.**

- **Décision - flèche plate, couleurs conditionnelles (`CardCarousel.vue`,
  `CoverCarousel.vue`) :**
  1. **Retrait total du contour, y compris la bascule de couleur au survol.**
     `ring-1 ring-primary-900/10`, `shadow-soft`, `hover:bg-primary-900
     hover:text-white hover:ring-accent-500/60` disparaissent des deux
     composants. Conséquence assumée : le fond et le texte/l'icône
     (`currentColor`) restent RIGOUREUSEMENT IDENTIQUES entre le repos et le
     survol - plus aucune propriété de couleur à transitionner, seuls le flou
     et l'opacité (posés en V0.1.24, ADR 28) continuent de varier entre ces
     deux états. Le brief ne demandait pas explicitement de renoncer à une
     couleur de survol distincte, mais en spécifiant exactement DEUX états de
     couleur (un par `tone`, sans état de survol dédié), il ne laisse pas de
     place pour en inventer un troisième non demandé ;
  2. **`CardCarousel` : couleurs pilotées par le prop `tone` déjà existant
     (`ARROW_TONE`, même patron que `COUNTER_TONE`).** `bg-white
     text-primary-950` sur `tone="light"` (19,7:1, AAA, skill
     `a11y-color-check`) - `text-primary-950` plutôt que l'ancien
     `text-primary-900` du bouton, demande client explicite (« bleu très
     foncé ») ; `bg-primary-900 text-white` sur `tone="dark"` (17,6:1, AAA) -
     exactement la paire qui servait jusqu'ici de couleur de SURVOL sur fond
     clair, désormais l'état de REPOS sur fond sombre ;
  3. **`CoverCarousel` : couleurs codées en dur, PAS de nouveau prop `tone`.**
     Ce composant n'a jamais eu qu'un seul usage réel (section Valeur ajoutée,
     fond clair) - introduire un prop `tone` pour une seule valeur jamais
     variée aurait été une abstraction sans consommateur, contraire au
     principe déjà appliqué à son compteur décoratif (`text-primary-900`,
     jamais paramétré non plus avant ce ticket). `bg-white text-primary-950`
     appliqué directement, `focus-visible:outline-primary-900` déjà correct
     sur ce fond clair (pas de correctif à y apporter, contrairement à
     `CardCarousel`) ;
  4. **Correctif de contraste incidental sur l'anneau de focus clavier de
     `CardCarousel`.** En réécrivant la classe de couleur de la flèche, un
     défaut préexistant apparaît dans le diff : `focus-visible:outline-
     primary-900` restait posé sans varier selon `tone` depuis sa création
     (V0.1.18, ADR 22) - calculé (skill `a11y-color-check`, formule de
     luminance relative WCAG) : **≈1,1:1 sur `bg-primary-950`** (fond
     Secteurs) et **1:1 (couleur RIGOUREUSEMENT IDENTIQUE à l'anneau) sur
     `bg-primary-900`** (fond RSE) - un anneau de focus clavier invisible ou
     quasi invisible sur ces deux sections depuis l'origine, jamais corrigé
     faute d'avoir retouché cette ligne depuis. `ARROW_TONE` bascule
     désormais l'anneau vers `outline-accent-500` sur `tone="dark"` - 9,1:1
     sur `bg-primary-900` (valeur déjà documentée dans l'en-tête de
     `main.css`), 10,2:1 sur `bg-primary-950` (calculé pour ce ticket) - même
     convention déjà en place ailleurs sur fond sombre (encart de
     `MegaMenu.vue`, lien d'évitement d'`App.vue`, tous deux `outline-
     accent-500` sur `bg-primary-900`). Non demandé par le brief, mais la
     classe concernée était déjà celle réécrite pour ce ticket : corriger un
     défaut de contraste visible dans le diff plutôt que le reconduire à
     l'identique suit la même discipline déjà posée en ADR 22 (compteur du
     même composant) et rappelée dans `CLAUDE.md` ;
  5. **Icône plus grasse : `stroke-width` de `2` à `3` sur les deux
     composants** - valeur haute de la fourchette suggérée par le brief
     (« 2,5 ou 3 »), pour un contraste net avec l'ancien tracé, cohérent avec
     un bouton désormais sans aucun autre repère visuel (contour) pour
     signaler son caractère interactif.

- **Décision - balayage horizontal (`CardCarousel.vue` uniquement) :**
  1. **`<Transition mode="out-in">` de `CardCarousel` : fondu + décalage
     vertical → balayage horizontal, classes reprises telles que fournies par
     le brief.** Entrante : `enter-from-class="translate-x-8 opacity-0"` →
     `enter-to-class="translate-x-0 opacity-100"`, `enter-active-class=
     "transition-all duration-500 ease-out"`. Sortante :
     `leave-from-class="translate-x-0 opacity-100"` →
     `leave-to-class="-translate-x-8 opacity-0"`,
     `leave-active-class="transition-all duration-500 ease-in"`. `mode=
     "out-in"` conservé (déjà en place) : la sortante termine avant que
     l'entrante ne commence, jamais de superposition qui brouillerait le sens
     du balayage. `motion-reduce:transition-none` ajouté aux deux classes
     actives (non fourni littéralement par le brief, mais requis par
     `CLAUDE.md` - toute animation décorative neutralisée sous préférence
     réduite - même garantie que partout ailleurs dans ce composant) ;
  2. **`translate-x-8` (2 rem), pas une valeur plus ample.** Le brief
     autorisait explicitement à ajuster l'ampleur (« tu peux ajuster
     l'ampleur du `translate-x` »). `8` (2 rem) reste un balayage lisible sans
     faire sortir visuellement le texte de la zone de padding déjà réservée à
     la flèche (`px-20`+, ADR 18/23) sur les diapositives les plus courtes ;
  3. **Aucun nouveau jeton `--ease-*` dans `main.css`.** `ease-out`/`ease-in`
     sont des courbes standard Tailwind (pas des valeurs arbitraires), déjà
     distinctes des jetons `--ease-snap` (micro-interactions courtes) et
     `--ease-premium` (glissement ample de `CoverCarousel`, ADR 27) - un
     balayage de texte à 500 ms ne correspond à aucun des deux usages déjà
     couverts par un jeton nommé, et le brief fournit lui-même la paire
     `ease-out`/`ease-in` littéralement, sans qu'un nom de token dédié
     n'apporte de réutilisation future identifiée ;
  4. **`CoverCarousel` : AUCUN changement pour ce point, limite documentée
     dans le composant.** Le `<Transition mode="out-in">` ciblé par le brief
     n'existe pas dans ce composant : ses 3 cartes visibles glissent déjà
     PHYSIQUEMENT de rôle en rôle via `<TransitionGroup>` + translations
     ±110 % (`ROLE_CLASSES`), une chorégraphie « effet wow » bespoke tout
     juste validée par le client en V0.1.23 (ADR 27, une seule itération plus
     tôt). Deux lectures étaient possibles : (a) interpréter le brief au pied
     de la lettre et remplacer cette chorégraphie par un simple crossfade de
     texte pour respecter littéralement « balayage droite → gauche sur les
     deux composants » ; (b) constater que `CoverCarousel` produit déjà un
     mouvement horizontal net au changement de diapositive (l'essence même du
     balayage demandé), et qu'aucune section du brief ne nomme explicitement
     ni ne décrit la mécanique interne de `CoverCarousel` (le texte cite
     littéralement « la `<Transition>` qui englobe le contenu du texte »,
     absente ici). (b) est retenue : défaire une chorégraphie récente et
     explicitement validée par le client, sur la foi d'une généralisation
     implicite du brief à un composant dont il ne décrit pas la mécanique
     réelle, aurait été une action disproportionnée par rapport à ce qui est
     réellement demandé - même principe de proportionnalité qu'ADR 24 (point
     1) et ADR 25 (point 3). Documenté explicitement dans le composant pour
     qu'un futur agent ne le lise pas comme un oubli.

- **Décision - pagination à pleine opacité (`CardCarousel.vue`,
  `CoverCarousel.vue`) :**
  1. **Retrait du suffixe `/50` sur les deux compteurs.** `CardCarousel`
     (`COUNTER_TONE`) : `text-primary-900/50` → `text-primary-950` (fond
     clair, 18,2:1 AAA sur `bg-light` - la couleur pleine change aussi, pas
     seulement l'opacité, pour rester cohérente avec la nouvelle couleur de
     flèche du même fond) ; `text-white/50` → `text-white` (fond sombre,
     19,7:1 sur `bg-primary-950`, 17,6:1 sur `bg-primary-900`, AAA).
     `CoverCarousel` : `text-primary-900` → `text-primary-950` (même
     cohérence avec sa flèche, seul usage réel restant en fond clair) ;
  2. **Aucune régression de contraste possible par construction.** Les
     ratios `/50` d'ADR 22 (5,12:1 sur `bg-primary-950`, 4,71:1 sur
     `bg-primary-900`, tous deux déjà AA) documentaient la version à opacité
     réduite : retirer l'opacité ne peut que les faire progresser vers un
     ratio supérieur (texte 100 % opaque sur le même fond), jamais les
     dégrader - vérifié par calcul plutôt que supposé (skill
     `a11y-color-check`).

- **Conséquences :**
  - Le Design System ne gagne aucune nouvelle primitive ni aucun nouveau
    jeton `@theme` : uniquement des classes Tailwind déjà standard
    (`ease-out`, `ease-in`, `translate-x-8`) et un correctif de contraste sur
    une classe déjà existante - itération de perfectionnement visuel pure ;
  - `CardCarousel.vue` et `CoverCarousel.vue` documentent chacun, dans leur
    commentaire d'en-tête, l'asymétrie introduite par ce ticket (prop `tone`
    sur l'un, couleurs codées en dur sur l'autre ; balayage horizontal sur
    l'un, chorégorie `<TransitionGroup>` inchangée sur l'autre) - pour qu'un
    futur agent ne cherche pas à les unifier de force sans relire d'abord
    pourquoi elles divergent ;
  - Vérifié par exécution (`npm run build` - type-check + build client/SSR +
    rendu SSG, `npm run lint`, `npm run format`, `vitest run` - 6 tests
    passants) et par grep/comptage Python du CSS/HTML de production
    (`dist/`) : présence de `.translate-x-8`, `.-translate-x-8`, `.ease-out`,
    `.ease-in`, `.duration-500`, `.focus-visible\:outline-accent-500` (2
    occurrences supplémentaires, exactement les flèches `tone="dark"` de
    Secteurs et RSE) ; **0** occurrence résiduelle de `ring-primary-900/10`,
    `text-primary-900/50`, `text-white/50` ou `hover:ring-accent-500` sur les
    boutons de carrousel ; 4 occurrences de `stroke-width="3"` (une par
    flèche « suivante » du site) contre 3 occurrences résiduelles de
    `stroke-width="2"` sans rapport (icônes d'autres composants, vérifiées
    distinctes). **Aucune vérification par capture d'écran ni navigateur
    piloté (Playwright ou équivalent) n'a été utilisée pour cette itération,
    contrainte explicite du rôle pour ce ticket** - le rendu visuel réel
    (élégance perçue du balayage à 500 ms, lisibilité du disque blanc sans
    contour sur le fond `bg-light` très proche en luminosité, cf. ADR 28)
    reste à confirmer par un humain ou un agent disposant d'un navigateur,
    limite documentée plutôt que passée sous silence, même réserve
    méthodologique que toutes les itérations précédentes.