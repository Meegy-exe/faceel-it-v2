# Current State — Faceel-IT V2
*Dernière mise à jour : 2026-08-28 (V0.1.25)*

## Fonctionnalités Actives & Validées
- **Infrastructure & Build :** Docker, Nginx (avec en-têtes de sécurité stricts & CSP), Vite-SSG (Pré-rendu statique actif).
- **Design System :** Composants de base validés (`BaseButton`, `HighlightCard`, `CarouselSlideContent`, `AnimatedBackground`, `LogoWall`, `PartnerCarousel`, `CardCarousel`, `MegaMenu`). `DataCore` a été retiré du Design System en V0.1.1 (cf. ADR 06) : il n'a plus aucun consommateur sur le site. `WaveRibbon` a subi le même sort en V0.1.10 (cf. ADR 14) : le Hero revient à un fond bleu nuit uni, plus aucun décor. `RatingBadge` a subi le même sort en V0.1.19 (cf. ADR 23) : la section « Notations » (Glassdoor/Google) qui l'utilisait est retirée sur demande client, plus aucun consommateur sur le site. `InterviewCard` a subi le même sort en V0.1.20 (cf. ADR 24) : la section Interviews (témoignages vidéo) qui l'utilisait est retirée sur demande client, dans le cadre du pivot « scroll snapping » — plus aucun consommateur sur le site. `AvatarStack` a subi le même sort en V0.1.22 (cf. ADR 26) : la section Équipe qui l'utilisait est retirée intégralement sur demande client explicite (override architectural du pivot « scroll snapping ») — plus aucun consommateur sur le site, ni même démontré dans `StyleguideView`. `CardCarousel` (V0.1.14, cf. ADR 18) est un carrousel générique à une diapositive visible à la fois (autoplay + flèches manuelles), sans donnée métier — le contenu de chaque diapositive vient d'un créneau `#slide`. Ses flèches se sont d'abord placées de part et d'autre de la carte dès `md:` (V0.1.16, cf. ADR 20), puis en position absolue aux extrémités de la région dès V0.1.18 (cf. ADR 22, détail plus bas) ; trois sections de `HomeView` le consomment depuis V0.1.16 (Services, Secteurs, RSE — cf. ADR 19/ADR 20). `CoverCarousel` (V0.1.17, cf. ADR 21) est un second type de carrousel, générique lui aussi, qui affiche 3 diapositives à la fois (précédente/active/suivante, effet « cover flow ») — la section Valeur ajoutée de `HomeView` l'utilise depuis V0.1.17 ; ses flèches passent du bord du conteneur du carrousel au bord de la section en V0.1.18 (même ADR 22). `HighlightCard` gagne un prop `elevated` (V0.1.17) qui bascule sa `shadow-soft` par défaut vers le jeton `shadow-lift` déjà utilisé au survol des cartes interactives — sert à mettre en avant la carte active de `CoverCarousel` sans dépendre d'un ordre de classes Tailwind fragile. `HighlightCard` gagne un second gabarit (`size="lg"`, V0.1.15) pour une carte seule au lieu d'une grille. Depuis V0.1.18 (cf. ADR 22), `HighlightCard` n'a plus aucun consommateur en production (`CardCarousel`/`CoverCarousel` utilisent désormais `CarouselSlideContent`, un nouveau composant « texte libre » sans encart) — il reste démontré dans `StyleguideView` comme composant « carte » du Design System pour un usage hors carrousel. `CarouselSlideContent` passe d'un texte centré (`items-center`/`text-center`, V0.1.18) à un texte aligné à gauche (`items-start`/`text-left`, V0.1.19, cf. ADR 23) — retour client : créer une ligne de force verticale forte avec les titres de section, eux-mêmes alignés à gauche. `HomeView.vue` complète cet alignement en donnant à chaque `<header>` de section le même padding horizontal que le conteneur de diapositive de `CardCarousel`/`CoverCarousel` (`px-20 md:px-24 lg:px-28`) — exact glyphe à glyphe sur les 3 sections `CardCarousel` (Services, Secteurs, RSE), approximatif sur `CoverCarousel` (Valeur ajoutée) dont la carte active reste délibérément centrée dans sa rangée « cover flow » (limite assumée, cf. ADR 23).
- **Hero (`HomeView`) — V0.1.1, passe de correction sur les 3 ajustements V0.1 (cf. ADR 06) :**
  - effet machine à écrire sur « votre passion » : structure du `<h1>`
    verrouillée en colonne (`flex-col`, deux lignes distinctes — « Faceelitez »
    puis le bloc animé) avec un plancher de hauteur (`min-h-[0.95em]`) sur la
    ligne animée pour qu'elle reste toujours sur sa propre ligne, y compris
    vide en fin d'effacement (aucun saut de layout). L'ancienne disposition en
    ligne (`flex-wrap`) faisait démarrer le texte animé à droite du mot fixe
    puis sauter à la ligne dès qu'il dépassait la largeur restante — un bug de
    layout corrigé en V0.1.1. La boucle démarre désormais 2 s après le montage
    (laisse les animations d'entrée du Hero se terminer) puis se relance
    toutes les 5 s (efface, retape) au lieu de 15 s. Le HTML pré-rendu
    (`vite-ssg`) porte le texte complet dès le premier rendu — la boucle ne
    démarre que dans `onMounted`, jamais dans le calcul de rendu, pour ne
    créer aucun écart d'hydratation. Le `<h1>` garde un nom accessible stable
    en permanence via un span `sr-only` distinct du span animé
    (`aria-hidden="true"`), pour qu'un lecteur d'écran n'annonce pas le titre
    à chaque cycle. Sous `prefers-reduced-motion`, le texte reste intégral et
    la boucle ne se lance jamais (avec un listener `change` pour réagir à une
    bascule de préférence en cours de session) ;
  - la vague SVG (shape divider) qui terminait le bas du Hero reste retirée :
    `bg-primary-900` touche directement `bg-light` (section Confiance) sur une
    arête droite ;
  - le canvas `DataCore` (globe de points à côté du titre) a été entièrement
    retiré en V0.1.1, fichier compris — demande client explicite de ne garder
    que le décor de vagues. La grille à deux colonnes du Hero redevient une
    colonne unique. `components/ui/WaveRibbon.vue` (canvas, une cinquantaine
    de lignes fines vert d'accent en ruban paramétrique façon Lissajous) est
    donc désormais seul décor du Hero — amplitude, fréquences et opacité des
    lignes relevées en conséquence pour occuper une part beaucoup plus large
    de la section (voir ADR 05 pour l'arbitrage initial, ADR 06 pour la
    révision V0.1.1). Couleur des lignes : `rgba(18, 216, 10, α)`, soit
    exactement `--color-accent-500` (`#12D80A`) du design system recopiée en
    rgba (un canvas 2D a besoin d'un canal alpha par ligne, non exprimable via
    la classe Tailwind). Même discipline d'ingénierie que les autres canvas du
    projet (garde SSR, `ResizeObserver`, `prefers-reduced-motion` avec repli
    statique + listener `change`, pause sur `visibilitychange`, cleanup
    complet). Un test dédié (`src/views/HomeView.spec.ts`) couvre la
    stabilité du nom accessible du `<h1>` et l'absence de frappe simulée sous
    mouvement réduit, avec les nouveaux délais (2 s / 5 s) — un comportement
    non visuel qu'aucune relecture ne peut prouver.
- **Hero (`HomeView`) — V0.1.2, correctif du ruban `WaveRibbon` + élargissement
  horizontal de la page (cf. ADR 07) :**
  - **Vagues recalibrées.** Le doublement des coefficients d'amplitude
    opéré en V0.1.1 (`wave` 0,08→0,16 ; `envelope` 0,4→0,62 ; `twist`
    0,05→0,09) s'est révélé trop massif à l'usage : le ruban envahissait
    toute la hauteur du Hero sans espace vide en haut ni en bas de la
    section. Les trois coefficients repassent à la valeur intermédiaire
    entre V0.1 et V0.1.1 (`0,12` / `0,51` / `0,07`, moyenne arithmétique des
    deux bornes) — un ruban élégant, centré verticalement. Les fréquences de
    `wave` et `twist` (0,9 et 1,4) restent celles de V0.1.1, seule leur
    amplitude change. L'opacité (0,26–0,86) reste inchangée : le retour
    client portait sur l'ampleur géométrique, pas sur la visibilité de la
    couleur ;
  - **Anomalie de pincement corrigée.** La fréquence du terme `envelope`
    (0,5, soit un demi-cycle de sinus sur toute la largeur du canvas)
    garantissait mathématiquement un unique zéro de `sin` quelque part dans
    `[0,1]` à chaque instant (les zéros de `sin` sont espacés d'exactement
    `π`, la largeur exacte de la fenêtre) — ce repli en pointe (`Math.abs`)
    dérivait avec la phase mais stationnait visuellement près d'un bord du
    canvas, perçu comme un pincement anormal. La fréquence passe à `2` (deux
    cycles complets sur la largeur) : plusieurs zéros désormais répartis sur
    toute la largeur, aucun n'étant plus singulier, et les deux bords du
    canvas retombent toujours sur la même valeur (cycles entiers), ce qui
    élimine l'asymétrie gauche/droite. Le plancher multiplicatif
    (`0,35 + 0,65 * …`) n'a pas changé : il limitait déjà la profondeur du
    repli, pas sa forme en pointe ni sa position — il n'était pas la cause
    du défaut ;
  - **Élargissement horizontal (demande client générale).** Conteneurs
    `max-w-6xl` (Confiance) et `max-w-5xl` (Équipe) portés à `max-w-7xl`
    pour s'aligner sur le standard déjà en usage ailleurs sur la page
    (Services, Secteurs, Valeur ajoutée, RSE, Interviews étaient déjà à
    cette largeur — vérifiés, non modifiés). Bloc de texte du Hero élargi
    (`<h1>` : `max-w-4xl` → `max-w-5xl` ; paragraphe : `max-w-2xl` →
    `max-w-3xl`), tout en restant dans une largeur de ligne lisible. Les
    boutons de la section Contact (`flex-col sm:flex-row`) passaient déjà en
    ligne dès `sm:` (640px) — vérifié, aucun changement nécessaire ; le seul
    autre `flex-col` de la page (le `<h1>` du Hero) reste verrouillé en
    colonne, c'est la structure qui corrige le bug de layout V0.1 (cf. ADR
    06), pas un point à convertir en ligne.
- **Hero (`HomeView`) / page entière — V0.1.3, retours clients (cf. ADR 08) :**
  - **Élargissement de tous les conteneurs de section.** Les huit conteneurs
    `mx-auto max-w-7xl` de `HomeView.vue` (Hero, Confiance, Services, Secteurs,
    Valeur ajoutée, RSE, Équipe, Interviews), ainsi que ceux de
    `TheFooter.vue` et `MegaMenu.vue` (nav principale + panneau mega-menu),
    passent à `max-w-[100rem]` — la palette `max-w-*` standard de Tailwind
    plafonnait le contenu à 80rem même sur les très grands écrans (1920px et
    plus), ce que le client jugeait trop étroit. Valeur arbitraire Tailwind v4
    (pas de nouveau jeton `@theme` pour un seul palier ponctuel). Le padding
    latéral existant (`px-4 sm:px-6 lg:px-8`) n'a pas changé. Les largeurs de
    lecture de texte (`max-w-2xl`, `max-w-3xl`, `max-w-5xl`…) ne sont pas
    concernées ;
  - **Section Confiance en full bleed.** `PartnerCarousel` défile désormais
    bord à bord de la fenêtre : le padding horizontal de la `<section>` a été
    déplacé sur le seul titre (« Ils accélèrent avec nous »), la piste du
    carrousel est rendue dans un conteneur `w-full` sans `max-w` ni padding
    latéral ;
  - **Filtre `brightness-0` sur les logos du carrousel.** Le logo Verspieren
    (SVG blanc plein) restait invisible sur le fond clair de la section
    Confiance même converti en `grayscale`. `PartnerCarousel.vue` assombrit
    désormais tous les logos jusqu'au noir plein au repos
    (`brightness-0`, en plus de `grayscale`), puis restaure couleur et
    luminosité au survol/focus (`group-hover:brightness-100
    group-focus-visible:brightness-100`) — même mécanique que
    `grayscale`/`grayscale-0` déjà en place. Le filtre est structuré dans une
    table `MONOCHROME_FILTER: Record<BackgroundTone, string>` (même patron que
    `FOCUS_RING`), n'existe qu'en tone `light` (seul usage réel du composant
    à ce jour) et s'applique identiquement à la copie dupliquée
    (`aria-hidden`) pour rester visuellement cohérent ;
  - **Ruban `WaveRibbon` : suppression de `Math.abs()` dans `envelope`.** Le
    correctif de fréquence V0.1.2 avait réparti les zéros de
    `Math.abs(Math.sin(...))` sur toute la largeur du canvas, mais chaque zéro
    restait individuellement un point anguleux (`Math.abs` d'un sinus n'est
    jamais dérivable à ses zéros). `envelope` est réécrit en combinaison
    linéaire de deux sinusoïdes à fréquences entières (`0,6·sin(2 cycles) +
    0,4·cos(3 cycles)`, poids `0,6+0,4=1`), bornée dans `[-1,1]` par
    inégalité triangulaire — donc sans besoin de valeur absolue pour rester
    positive une fois recentrée (`0,5 + 0,5 * …`). Les fréquences entières
    préservent la synchronisation des deux bords du canvas héritée de V0.1.2.
    Amplitude et fréquences de `wave`/`twist` inchangées ; vérifié
    visuellement (captures d'écran Playwright/Chromium sur plusieurs
    instants du cycle d'animation) : le ruban reste fluide, sans angle ni
    pincement, sur toute la largeur.
- **Page entière — V0.1.4, layout 100 % fluide (cf. ADR 09) :**
  - **`max-w-[100rem]` → `w-full`.** Retour client : même à 1600px
    (`100rem`), la largeur maximale figée introduite en V0.1.3 laissait de
    grandes marges vides sur écrans 1920px et ultrawide (2560px et plus) — une
    colonne centrale, seulement plus large qu'avant. Les huit conteneurs de
    section de `HomeView.vue` (Hero, Confiance, Services, Secteurs, Valeur
    ajoutée, RSE, Équipe, Interviews), ainsi que ceux de `TheFooter.vue` et
    `MegaMenu.vue` (nav principale + panneau mega-menu déroulant), perdent
    tout plafond de largeur (`w-full`) ; `StyleguideView.vue` suit la même
    règle pour rester cohérente avec le reste du site qu'elle documente ;
  - **Échelle de padding fluide `px-6 md:px-12 lg:px-24 xl:px-32 2xl:px-40`.**
    Un `w-full` nu toucherait les bords de la fenêtre à l'infini sur un très
    grand moniteur : chaque conteneur reçoit cette échelle en remplacement de
    l'ancien `px-4 sm:px-6 lg:px-8` (jamais en cumul des deux). Sur les six
    sections à grille de cartes (Services, Secteurs, Valeur ajoutée, RSE,
    Équipe, Interviews), l'échelle vit sur le `<section>` parent — c'est déjà
    là que vivait le padding horizontal existant, cohérent avec les autres
    sections du même type. Sur le Hero et les deux conteneurs de `MegaMenu`,
    elle remplace le padding qui vivait déjà au même endroit que l'ex-`max-w`.
    Le titre de la section Confiance (« Ils accélèrent avec nous ») suit la
    même échelle ; le `PartnerCarousel` lui-même reste strictement inchangé,
    toujours sans padding ni `max-w`, en full bleed edge-to-edge depuis
    V0.1.3 ;
  - **Largeurs de lecture de texte préservées.** Aucun `max-w-2xl`/`max-w-3xl`
    (paragraphes, `<header>` de section) ni `max-w-5xl` (`<h1>` du Hero) n'est
    modifié : seuls les conteneurs structurants qui bornaient la largeur
    totale d'une section perdent leur plafond, jamais un bloc de texte pensé
    pour rester lisible sur grand écran ;
  - Vérifié par exécution (`verify-frontend-change` : build, type-check,
    lint, format, `vitest run` — 6 tests passants) et par capture d'écran
    Chromium headless à 1920×1080 et 2560×1080 : le contenu s'étire sur toute
    la largeur sans marge vide résiduelle, les grilles de cartes (4 et 3
    colonnes) restent proportionnées, le carrousel Confiance reste bord à
    bord, et la nav/le footer respirent avec le même padding fluide que le
    reste de la page.
- **Ruban `WaveRibbon` — V0.1.5, trois finitions esthétiques indépendantes
  demandées par le client :**
  - **Ralentissement.** `PHASE_SPEED` passe de `0,35` à `0,06` rad/s (~6×
    plus lent) : le mouvement était jugé trop nerveux pour un décor de fond.
    Valeur choisie par observation réelle dans le navigateur (Chromium
    headless, captures d'écran échelonnées sur 0 à 30 s), pas fixée a
    priori — `envelope` et `twist` ont leurs propres multiplicateurs de
    phase (`0,6`/`0,35` et `1,3`), leur vitesse effective est donc un
    multiple de `PHASE_SPEED` et devait rester lisible en combinaison,
    pas seulement isolément. Le résultat observé sur plusieurs dizaines de
    secondes est un mouvement lisible comme un souffle régulier, jamais
    figé ni saccadé ;
  - **Effilage horizontal (`taper`).** Nouvelle fonction `taper(xt)`, une
    smoothstep quintique de Perlin (dérivée et dérivée seconde nulles aux
    deux bornes) appliquée après un seuil `TAPER_START = 0,55` : sous ce
    seuil, `taper` vaut exactement 0 (plateau), au-delà il remonte
    lissement jusqu'à 1 au bord droit. Le facteur ne s'applique qu'aux
    termes qui créent l'écartement entre les lignes (`envelope`, `twist`),
    jamais à `wave` (dérive verticale commune à tout le ruban). Résultat :
    le ruban converge en un trait fin unique sous/juste après le bloc de
    texte du Hero à gauche, et garde son amplitude complète à droite.
    Purement géométrique sur `x`, indépendant de `phase` — ne perturbe ni
    la synchronisation des bords ni la continuité de dérivée acquises en
    V0.1.2/V0.1.3. Aucun `Math.abs()` introduit par ce calcul (`taper` est
    strictement croissante) ;
  - **Fondu par dégradé de canvas.** Le calcul d'`alpha` existant ne dépend
    que de `signed` (position verticale d'une ligne, constant le long de
    son tracé) : il ne pouvait donc pas produire un fondu horizontal sur
    une seule ligne. Chaque ligne reçoit désormais un
    `ctx.createLinearGradient` dédié (transparent de `0` à `TAPER_START`,
    remontée douce via un stop intermédiaire à `TAPER_START + 0,15`,
    `alpha` plein au bord droit) posé en `strokeStyle` avant l'unique
    `ctx.stroke()` de la ligne — toujours un seul `stroke()` par ligne (50
    par frame), pas un `stroke()` par segment, pour ne pas dégrader les
    performances ;
  - Vérifié par exécution (`verify-frontend-change` : build, type-check,
    lint, format, `vitest run` — 6 tests passants) et par observation
    visuelle réelle (Chromium headless, captures d'écran à 1600×900 et
    1920×1000, à 0/1/2/4/8/12/20/30 s d'animation, plus la figure statique
    sous `prefers-reduced-motion` émulé) : le ruban reste évasé à droite et
    effilé/convergent à gauche sans jamais dégénérer en position plate, le
    fondu est progressif (aucune coupure nette visible à l'œil), et aucun
    angle ni pincement ne réapparaît sur les échantillons observés.
- **Carrousel partenaires (`PartnerCarousel.vue`) — V0.1.6, correctif du bug
  des blocs noirs (cf. ADR 10) :**
  - **Diagnostic.** `brightness-0` (ajouté en V0.1.3 pour Verspieren)
    assombrit tout pixel opaque au noir plein, qu'il s'agisse du tracé d'un
    logo ou d'un fond. Or Kiabi et Mondial Relay ont un vrai fond opaque
    (`#040037`, `#96154a`) SOUS un détail au tracé blanc plein (`fill="#fff"`,
    le motif intérieur de l'icône) : fond et détail devenaient un noir
    strictement identique, effaçant le motif et laissant un aplat noir plein
    cadre perçu comme un « gros bloc noir » ;
  - **Solution retenue.** `MONOCHROME_FILTER.light` passe de `brightness-0` à
    `mix-blend-multiply` (+ `mix-blend-normal` au survol/focus, en plus de
    `grayscale`/`grayscale-0` déjà en place). En mode `multiply`, un pixel
    blanc devient optiquement transparent (laisse voir le fond de section au
    travers, corrigeant Kiabi/Mondial Relay), tandis qu'un pixel sombre reste
    visible. `verspieren.svg` (tracé intégralement blanc, sans fond) est
    corrigé à la source (`fill="#fff"` → `fill="#000066"`, soit
    `--color-primary-900`) : `multiply` seul ne le sauve pas (blanc sur blanc
    resterait transparent = invisible) ;
  - **Piste explicitement écartée après test réel.** Corriger uniquement les
    SVG Kiabi/Mondial Relay (trou réellement transparent, via `evenodd` ou
    `<mask>`) tout en gardant `brightness-0` a été testée dans un navigateur
    réel puis rejetée : tout filtre CSS `brightness()` (y compris
    `brightness-0`), appliqué à un `<img>` chargeant un SVG avec zone
    transparente, casse cette transparence dans le moteur de rendu utilisé
    ici (reproduit sur un cas de test minimal sans rapport avec Kiabi) — donc
    incompatible par construction avec toute correction basée sur un trou
    SVG ou sur le mécanisme `multiply` ;
  - **Effet de bord assumé.** Les 5 logos qui n'avaient pas ce bug (Auchan,
    Boulanger, Decathlon, Leroy Merlin, Midas) ne restent pas pixel-identiques
    : sans `brightness-0` pour les forcer au noir pur, `grayscale` seul les
    convertit vers leur propre niveau de gris perceptuel (Midas inchangé, son
    tracé est noir par défaut sans attribut `fill`). Vérifié qu'aucune
    combinaison de filtres sans `brightness()` ne permet de forcer un noir pur
    uniforme sans casser la transparence nécessaire à la correction — un
    compromis documenté, pas un oubli (cf. commentaire `MONOCHROME_FILTER`
    dans `PartnerCarousel.vue` pour le détail des essais).
- **Ruban `WaveRibbon` — V0.1.6, adoucissement du tapering (cf. ADR 10) :**
  - **Plancher d'amplitude.** `taper(xt)` interpole désormais entre
    `TAPER_FLOOR = 0,12` et `1` (au lieu de `0` et `1`) : le plateau à 0 strict
    de V0.1.5 faisait converger les 50 lignes vers une unique ligne d'un
    pixel, jugé trop dur/mécanique. La smoothstep quintique garde sa dérivée
    nulle aux deux bornes du plateau (rescale affine d'une fonction déjà à
    dérivée nulle) ;
  - **`TAPER_START` déplacé de `0,55` à `0,62`.** Mesuré par observation
    réelle (`getBoundingClientRect`) à 1440px et 1920px : le bloc de texte du
    Hero occupe jusqu'à ~62 % de la largeur à 1440px (le paragraphe,
    `max-w-3xl`, largeur fixe en pixels) mais seulement ~48 % à 1920px — une
    fraction décroissante à mesure que le viewport grandit. `0,3`-`0,35`
    (piste de départ) a été testé puis rejeté : à 1440px, l'évasement
    chevauchait alors visiblement la deuxième ligne du paragraphe (constaté
    par capture d'écran). `0,62` retient la fraction la plus contraignante des
    deux viewports testés, au prix d'un léger espace mort à 1920px plutôt
    qu'un chevauchement à 1440px ;
  - **Fenêtre de fondu élargie.** Le dégradé remonte désormais sur
    `TAPER_START + 0,35` (au lieu de `+0,15`), avec deux stops intermédiaires
    suivant la même smoothstep quintique que `taper` (cohérence visuelle),
    au lieu d'une interpolation linéaire par défaut qui « rattrapait » son
    opacité avant la largeur pleine ;
  - Vérifié par observation réelle (Chromium/Playwright, captures à 1440px et
    1920px, figure statique sous `prefers-reduced-motion` et échantillons
    d'animation à 0/1/3/6/10 s) : le trait effilé de gauche garde toujours un
    faisceau de largeur non nulle (jamais une convergence à 1 pixel), le
    fondu vers le bleu nuit est continu sans bord perceptible même en zoomant
    sur la capture, l'évasement démarre juste après la fin du texte aux deux
    largeurs testées, et aucun angle ne réapparaît sur les échantillons
    observés.
- **Ruban `WaveRibbon` — V0.1.7, pivot architectural : canvas algorithmique →
  image statique + CSS pur (cf. ADR 11) :**
  - **Décision client.** De V0.1.2 à V0.1.6, `WaveRibbon` a fait l'objet de
    cinq passes de réglage successives du canvas paramétrique (recalibrage
    d'amplitude, correctif de pincement, effilage, adoucissement du
    tapering — cf. ADR 07 à ADR 10) : un coût cumulé jugé trop élevé par le
    client pour un résultat encore insatisfaisant, et un canvas jamais
    spécifiquement optimisé pour mobile (aucune variante de densité/poids de
    calcul selon la taille d'écran). Le client tranche pour un pivot
    radical : abandon complet du canvas au profit d'une image statique
    qu'il fournit lui-même (`vague.svg`), animée uniquement en CSS pur ;
  - **Suppression totale du canvas.** `WaveRibbon.vue` perd sa balise
    `<canvas>`, toute sa logique de dessin (`drawFrame`, `taper`,
    `renderFrame`, boucle `requestAnimationFrame`, `ResizeObserver`, gardes
    SSR/`visibilitychange`) et les constantes qui la paramétraient
    (`LINE_COUNT`, `SEGMENTS`, `PHASE_SPEED`, `TAPER_START`, `TAPER_FLOOR`,
    `STATIC_PHASE`). Le composant devient un simple `<img>` statique : plus
    aucune logique de cycle de vie n'est nécessaire (un `<img>` se pré-rend
    nativement en SSR), le seul script restant est l'import de l'asset ;
  - **Nom de fichier corrigé.** Le brief client mentionnait
    `vagues.svg` (inexistant) ; le fichier réel est
    `client/src/assets/images/vague.svg` (singulier) — utilisé tel quel,
    aucun fichier supplémentaire créé ;
  - **Recoloration du SVG à la source.** `vague.svg` était en `fill="#000000"`
    sur un canevas sans fond (aucun `<rect>`, vérifié par lecture directe) —
    invisible sur `bg-primary-900`. Le fill passe à `#12d80a`
    (`--color-accent-500`), sans aucun blend mode CSS (cf. ADR 11 pour le
    calcul détaillé : `mix-blend-screen`/`lighten` d'un noir plein
    rendraient l'image strictement invisible, et une fois recolorée en vert
    d'accent, ces mêmes modes décaleraient sa teinte exacte via le canal
    bleu du fond `#000066`) ;
  - **Intégration.** `<img>` en `absolute inset-y-0 right-0 -z-10`, derrière
    le texte du Hero (le `<section>` parent reste `relative isolate`,
    inchangé). `h-full w-auto object-contain` préserve intégralement le
    ratio du SVG (2000×1414, ≈1,41:1) sans le rogner. `hidden lg:block` :
    masqué sur mobile (aucun coût de rendu, pas seulement une opacité
    réduite) ;
  - **Animation.** Nouveau jeton `--animate-pulse-soft-slow` (`main.css`,
    même `@keyframes pulse-soft` que `--animate-pulse-soft`, seule la durée
    change à `9s` — même convention que `--animate-float`/
    `--animate-float-slow`), appliqué via `animate-pulse-soft-slow`.
    `motion-reduce:animate-none` neutralise cette animation décorative sans
    garde JS ;
  - Vérifié par exécution (`verify-frontend-change` : build, type-check,
    lint, format, `vitest run` — 6 tests passants, fumée HTTP 200 sur `/` et
    sur le module du composant), par grep du CSS de production (présence de
    `animate-pulse-soft-slow`, `motion-reduce:animate-none`,
    `object-contain`, `.hidden`, `.lg\:block`, `-z-10`, aucune classe
    orpheline) et par lecture directe du HTML pré-rendu (`dist/index.html`) :
    la balise `<img>` (SVG inliné en data URI par Vite, sous le seuil
    `assetsInlineLimit`) porte bien toutes les classes attendues et le fill
    recoloré `#12d80a`, aucun `<canvas>` résiduel. Aucune vérification
    visuelle par capture d'écran ou navigateur piloté n'a été utilisée pour
    cette itération (contrainte client explicite) — le raisonnement
    (calculs de blend mode, lecture du SVG) en tient lieu.
- **Ruban `WaveRibbon` — V0.1.8, correction d'urgence du rendu V0.1.7
  (cf. ADR 12) :**
  - **Diagnostic.** Le rendu livré en V0.1.7 était un échec visuel signalé
    par le client : l'image se retrouvait minuscule, collée à l'extrême
    droite du Hero, quasiment invisible. Cause vérifiée par lecture du code
    (pas d'observation empirique, contrainte client explicite pour cette
    itération) : `h-full w-auto object-contain` calait la largeur de l'image
    sur son ratio intrinsèque (2000×1414, ≈1,41:1) appliqué à la HAUTEUR du
    Hero, pas à sa largeur — sur un Hero bien plus large que haut (desktop),
    la largeur résultante restait étroite et ne s'étendait jamais vers le
    centre ;
  - **Suppression totale de l'animation.** `animate-pulse-soft-slow` et sa
    garde `motion-reduce:animate-none` sont retirées de l'`<img>` — plus
    aucune animation pour ce décor, un renoncement définitif demandé par le
    client, pas un simple réglage d'amplitude/durée. Le jeton
    `--animate-pulse-soft-slow` (`main.css`) est supprimé : vérifié par
    `grep -rn` qu'il n'avait plus aucun consommateur après ce retrait.
    `--animate-pulse-soft` (4s, sans le suffixe `-slow`), toujours utilisée
    par `AnimatedBackground.vue`, n'est pas concernée ;
  - **Positionnement en couverture généreuse.** `absolute inset-y-0 right-0
    h-full w-auto object-contain` devient `absolute inset-0 h-full w-full
    object-cover object-right` : l'image remplit désormais toute la surface
    du Hero (rognée par `object-cover` plutôt que contrainte par son ratio
    intrinsèque), ancrée sur son bord droit (`object-right`, cohérent avec
    « décor à droite, texte à gauche ») ;
  - **Opacité réduite à `opacity-40`.** Le SVG reste recoloré en
    `#12d80a` (`--color-accent-500`, V0.1.7), 9,1:1 AAA contre
    `primary-900` (`main.css`). À pleine opacité, un `object-cover` qui
    couvre une large portion du Hero transformerait cette couleur d'accent
    saturée en aplat de grande surface, contraire à la règle du Design
    System (ADR 03/`CLAUDE.md` : l'accent reste une touche, jamais un fond).
    `opacity-40` (fourchette 30-50 % suggérée par le brief) garde le motif
    clairement identifiable tout en le faisant se comporter comme un
    filigrane décoratif plutôt qu'un second fond saturé. Choix documenté
    dans le commentaire d'en-tête de `WaveRibbon.vue`, pas une valeur
    arbitraire ;
  - **Aucun `mix-blend-mode`.** Vérifié qu'aucun n'était présent dans le code
    V0.1.7 final, conformément à la demande explicite du brief ;
  - **Renforcement explicite du z-index.** Le conteneur de texte du Hero
    (`HomeView.vue`) ne portait ni `relative` ni `z-*` explicite — il se
    retrouvait au-dessus du décor uniquement par empilement implicite
    (`WaveRibbon` en `-z-10` + `isolate` sur la `<section>` parente). Il
    porte désormais `relative z-10` explicitement : défense en profondeur,
    le texte ne doit plus jamais dépendre implicitement du seul `-z-10` de
    l'image. `WaveRibbon.vue` garde `-z-10` explicite (paire déjà
    fonctionnelle, aucune troisième valeur introduite) ;
  - **`hidden lg:block` inchangé.** Choix V0.1.7 (masqué sur mobile pour des
    raisons de performance/pertinence) non remis en cause par cette
    itération, aucune contradiction identifiée avec la nouvelle stratégie
    `object-cover` ;
  - Vérifié par exécution (`verify-frontend-change` : type-check, lint,
    format, `vitest run` — 6 tests passants, build de production, fumée HTTP
    200 sur `/` et sur le module `WaveRibbon.vue`), par grep du CSS de
    production (présence de `.inset-0`, `.object-cover`, `.object-right`,
    `.opacity-40`, `.z-10`, `.-z-10` ; absence totale de
    `pulse-soft-slow` ; `.object-contain`/`.w-auto` toujours présents dans le
    bundle mais provenant d'autres consommateurs vérifiés — `LogoWall.vue`,
    `PartnerCarousel.vue`, `HomeView.vue`, `NotFoundView.vue` — pas d'une
    classe orpheline de `WaveRibbon`), et par lecture directe du HTML
    pré-rendu (`dist/index.html`) : l'`<img>` porte la classe attendue, le
    fill `#12d80a` (pas `#000000`), et le `<div>` de texte porte
    `relative z-10`. **Aucune vérification par capture d'écran ou navigateur
    piloté (Playwright ou autre) n'a été utilisée pour cette itération**
    (contrainte client explicite) — le raisonnement sur les ratios,
    dimensions intrinsèques et classes Tailwind en tient lieu.
- **Hero (`HomeView`) / page entière — V0.1.9, ticket #13 : simplification du
  Hero et optimisation des largeurs (cf. ADR 13) :**
  - **Décor du Hero déjà 100 % statique — aucun changement de code.** Le
    ticket demandait de retirer « toutes les animations (Canvas, CSS,
    keyframes, transitions) » liées aux vagues du Hero. Vérifié par relecture
    directe de `WaveRibbon.vue` avant toute modification : ce retrait a déjà
    été fait intégralement en V0.1.8 (cf. ADR 12) — le canvas paramétrique a
    disparu en V0.1.7 (ADR 11), et sa dernière animation CSS
    (`--animate-pulse-soft-slow`) a été retirée en V0.1.8, jeton compris. Le
    composant reste un unique `<img>` statique (`alt=""`, `aria-hidden`,
    `pointer-events-none`), sans classe `animate-*` ni `@keyframes` résiduel
    (confirmé par grep du composant et lecture du HTML pré-rendu généré au
    build). Le ticket faisait référence à une itération « V0.1.7 » déjà
    dépassée par le dépôt (qui en était à V0.1.8) — cette passe devient donc
    V0.1.9, à la suite de la précédente ;
  - **Padding horizontal des conteneurs structurants, réduit.** L'échelle
    fluide `px-6 md:px-12 lg:px-24 xl:px-32 2xl:px-40` introduite en V0.1.4
    (ADR 09) écrasait le contenu au centre sur grand écran — retour client
    explicite. Remplacée par une échelle resserrée `px-4 sm:px-6 lg:px-8
    xl:px-12` sur les huit conteneurs de section de `HomeView.vue` (Hero,
    Confiance, Services, Secteurs, Valeur ajoutée, RSE, Équipe, Interviews),
    `TheFooter.vue`, `MegaMenu.vue` (nav principale + panneau mega-menu) et
    `StyleguideView.vue` (même périmètre qu'ADR 09, pour rester cohérente
    avec le reste du site qu'elle documente). Le padding de la section
    Contact (déjà sur cette échelle standard depuis l'origine, jamais migré
    vers l'échelle fluide de V0.1.4) reçoit en plus le palier `xl:px-12`
    pour rester alignée sur le nouveau standard commun. `PartnerCarousel`
    (section Confiance) reste en full bleed, strictement inchangé — seul le
    titre au-dessus suit la nouvelle échelle, comme il suivait déjà l'ancienne ;
  - **Largeurs de lecture de texte, élargies — à l'inverse de la règle posée
    en V0.1.4.** Demande client explicite : privilégier l'élargissement des
    contenus à leur allongement vertical, pour réduire le nombre de lignes
    sur desktop. `<h1>` du Hero : `max-w-5xl` → `max-w-7xl` ; paragraphe du
    Hero : `max-w-3xl` → `max-w-5xl` ; en-têtes de section courts (Services,
    Secteurs, RSE, Interviews) : `max-w-2xl` → `max-w-4xl` ; en-tête Valeur
    ajoutée : `max-w-3xl` → `max-w-5xl` ; paragraphe Équipe : `max-w-2xl` →
    `max-w-4xl` ; section Contact : conteneur `max-w-4xl` → `max-w-6xl`,
    paragraphe `max-w-2xl` → `max-w-4xl`. La structure `flex-col` verrouillée
    du `<h1>` (correctif de layout V0.1.1, ADR 06) n'est pas remise en
    cause : elle reste la structure qui empêche le bug de saut de ligne de
    l'effet machine à écrire, la largeur n'y change que la limite de
    retour à la ligne, jamais la disposition en deux lignes distinctes.
    Les grilles de cartes (`grid-cols-*`, Services/Secteurs/Valeur
    ajoutée/RSE/Interviews) ne sont pas concernées : elles exploitaient déjà
    toute la largeur de leur conteneur `w-full` (ADR 09), aucun changement
    n'y était nécessaire ;
  - Vérifié par exécution (build, type-check, lint — tout passe), par grep du
    CSS de production (présence des nouvelles classes `max-w-7xl`,
    `max-w-6xl`, `max-w-5xl`, `max-w-4xl`, `.px-4`, `.sm\:px-6`, `.lg\:px-8`,
    `.xl\:px-12` ; absence de toute classe de l'ancienne échelle dans un
    attribut `class` du code source — les seules occurrences résiduelles de
    `md:px-12`/`2xl:px-40` sont des valeurs textuelles citées dans des
    commentaires d'historique, jamais appliquées à un élément) et par lecture
    directe du HTML pré-rendu (`dist/index.html`) : le `<h1>` porte
    `max-w-7xl`, le paragraphe du Hero `max-w-5xl`, l'`<img>` de `WaveRibbon`
    ne porte aucune classe `animate-*`. **Aucune vérification par capture
    d'écran ni navigateur piloté (Playwright ou équivalent) n'a été utilisée
    pour cette itération, contrainte client explicite** — la vérification
    s'appuie sur la lecture du code, le grep du CSS/HTML de production et
    l'exécution du pipeline `build`/`type-check`/`lint`.
- **Hero (`HomeView`) / typographie globale — V0.1.10, nettoyage du Hero et
  verrouillage de la police Poppins (cf. ADR 14) :**
  - **Le message identifiait cette passe comme « V0.1.9 », déjà pris par le
    ticket #13 précédent (padding et largeurs de texte) — elle devient
    V0.1.10, à la suite de la précédente sans en rouvrir le contenu ;**
  - **Retrait total du décor du Hero.** Le client a signalé une « trace
    fantôme » persistante sur le fond du Hero : la balise `<img>` de
    `WaveRibbon` (SVG statique, `opacity-40`, cf. ADR 11/ADR 12), correcte
    par construction mais que le client ne souhaite plus voir du tout, même
    sous cette forme atténuée. `<WaveRibbon />` est retiré de `HomeView.vue`
    et le composant est supprimé du Design System, fichier compris
    (`components/ui/WaveRibbon.vue`), ainsi que l'asset qu'il consommait en
    exclusivité (`assets/images/vague.svg`) — vérifié par recherche globale
    avant suppression, aucun autre fichier n'y faisait référence (même
    principe que le retrait de `DataCore` en ADR 06). Le Hero
    (`bg-primary-900`) est désormais un fond bleu nuit uni sans aucun
    élément superposé ; `relative isolate overflow-hidden` (sur la
    `<section>`) et `relative z-10` (sur le conteneur de texte), qui
    n'existaient que pour empiler ce décor par-dessous le texte (ADR 12),
    disparaissent avec lui — plus rien à isoler ni à empiler ;
  - **Police unique : Poppins, auto-hébergée.** Le design system utilisait
    `'Inter'` comme valeur de `--font-display`/`--font-body`
    (`main.css`), mais AUCUN mécanisme ne chargeait réellement cette police
    (pas de `<link>` Google Fonts, pas de `@font-face`, pas de package
    `@fontsource` avant cette itération) — le site s'affichait donc déjà en
    police système de repli (`ui-sans-serif, system-ui`), jamais en Inter.
    Renommer la variable en `'Poppins'` sans rien d'autre aurait reproduit
    exactement le même problème (aucune police réellement chargée). Le
    paquet `@fontsource/poppins` est ajouté aux dépendances et importé dans
    `main.css` (poids 400/600/700/800, les seuls réellement utilisés par le
    site — vérifié par grep des classes `font-*`) : une police auto-hébergée
    plutôt qu'un CDN Google Fonts, pour ne pas envoyer l'IP de chaque
    visiteur à un tiers sur un site qui collecte des candidatures/contacts
    (RGPD) et pour éviter d'ouvrir un domaine externe dans la CSP stricte
    déjà en place (Nginx). `--font-mono` (`'JetBrains Mono'`) n'est pas
    concernée : rôle sémantique distinct, réservé aux extraits de code et
    raccourcis clavier de `StyleguideView.vue`, jamais utilisée pour du
    texte de site réel — le client demande une police unique pour « le
    texte entier du site, des titres aux boutons », pas pour un rôle
    typographique délibérément différent qui n'apparaît sur aucune page
    publique ;
  - **Recherche de classes de police parasites : aucune trouvée.** `grep`
    de `font-sans`, `font-serif`, `font-inter`, `font-roboto` et
    équivalents sur l'ensemble de `client/src/**/*.vue` : zéro occurrence.
    Le design system n'utilisait déjà que les jetons sémantiques
    `font-display`/`font-mono` (jamais l'utilitaire brut `font-sans` de
    Tailwind) — rien à nettoyer sur ce point, vérifié plutôt que supposé ;
  - Vérifié par exécution (`npm run type-check`, `npm run lint`,
    `vitest run` — 6 tests passants, `npm run build`) : tout passe. Grep du
    CSS de production : présence de `@font-face` pour `Poppins` (poids
    400/600/700/800), absence totale de `Inter`. Lecture directe du HTML
    pré-rendu (`dist/index.html`) : aucune balise `<img>` ni `<canvas>`
    dans la `<section>` Hero, aucune donnée `data:image/svg+xml` liée à
    l'ancien décor (le seul `data:image/svg+xml` restant sur la page est un
    logo partenaire, sans rapport). **Aucune vérification par capture
    d'écran ni navigateur piloté (Playwright ou équivalent) n'a été
    utilisée pour cette itération, contrainte client explicite** — la
    vérification s'appuie sur la lecture du code, le grep du CSS/HTML de
    production et l'exécution du pipeline `type-check`/`lint`/`build`/
    `vitest`.
- **`HomeView` / `HighlightCard` — V0.1.11, design épuré : réduction des
  icônes, surlignage typographique (cf. ADR 15) :**
  - **Icônes décoratives retirées des 4 grilles de cartes.** Les pictogrammes
    SVG génériques (`Icon` fonctionnel + champ `icon` de chaque carte) sont
    supprimés des sections Services, Secteurs, Valeur ajoutée et RSE
    (16 pictogrammes au total, un par carte) — demande client de « monter en
    gamme » sur la direction artistique en misant sur la typographie plutôt
    que sur des pictogrammes abstraits sans forte valeur sémantique. Les
    icônes à VALEUR SÉMANTIQUE FORTE ne sont PAS concernées et restent en
    place : l'étoile de `RatingBadge` (convention universelle de notation),
    le chevron et le hamburger de `MegaMenu` (affordances fonctionnelles
    d'ouverture/fermeture), la flèche de `BaseButton`/du pied de carte
    `HighlightCard` (signale une action/un lien), le bouton play
    d'`InterviewCard` (représente un contenu vidéo, même en attente du
    fichier réel). Le composant fonctionnel `Icon` et la constante `ARROW`
    restent dans `HomeView.vue` : toujours utilisés par la flèche du bouton
    « Nous écrire » (section Contact), donc pas du code mort ;
  - **`HighlightCard.vue` : le bandeau icône/badge devient conditionnel.**
    `v-if="$slots.icon || badge"` sur le conteneur qui portait la vignette
    de pictogramme et le badge : la plupart des cartes n'ont désormais ni
    l'un ni l'autre (seule la carte Ecovadis garde son badge « Silver »),
    ce conteneur ne doit donc plus être rendu vide par défaut. Aucun autre
    changement au composant : le slot `icon` reste disponible pour un futur
    usage réellement porteur de sens, la grille `sm:grid-cols-2
    lg:grid-cols-4` des quatre sections n'est pas touchée — les cartes
    s'alignent toujours normalement (CSS Grid dimensionne chaque ligne sur
    son élément le plus haut, qu'il y ait une vignette d'icône ou non) ;
  - **Surlignage marqueur, en remplacement du soulignement d'accent.** Les
    5 emphases de mots-clés du texte courant (3 dans « Notre valeur
    ajoutée », 2 dans « Preuve sociale & équipe » — dont « redéfinir l'image
    des ESN » et « l'esprit d'équipe… » citées par le brief) passent de
    `underline decoration-accent-500 decoration-2 underline-offset-2` à
    `bg-linear-to-t from-accent-500/30 to-transparent bg-[length:100%_40%]
    bg-bottom bg-no-repeat` — un effet de surligneur pastel sur la moitié
    basse du texte, recette fournie par le client (substitution de
    `bg-gradient-to-t`, alias historique, par `bg-linear-to-t`, le nom
    d'utilitaire non déprécié de Tailwind v4 — les deux compilent
    identiquement, vérifié par grep du CSS de production). Contraste
    calculé (méthode WCAG, cf. skill `a11y-color-check`) : texte
    `text-primary-900` (#000066) sur le lavis composite (accent-500 à 30 %
    par-dessus `bg-light`, soit ≈ rgb(176,237,182)) → **13,1:1, AAA** (contre
    16,4:1 sans lavis sur `bg-light` nu — l'écart est négligeable, la
    lisibilité n'est pas dégradée) ;
  - Vérifié par exécution (`npm run type-check`, `npm run lint`,
    `vitest run` — 6 tests passants, `npm run build`) : tout passe. Grep du
    CSS de production : présence de `.bg-linear-to-t`, `.from-accent-500\/30`
    et `.bg-bottom`/`.bg-no-repeat`, grille `sm:grid-cols-2 lg:grid-cols-4`
    inchangée sur les 4 sections. Lecture directe du HTML pré-rendu
    (`dist/index.html`) : les nœuds de commentaire Vue (`<!---->`) confirment
    que le bandeau icône/badge ne rend plus rien pour les cartes sans icône
    ni badge (pas de `<div>` vide résiduel), et les 5 `<span>` de surlignage
    portent la classe attendue avec leur texte intact (accents, `œ`).
    **Aucune vérification par capture d'écran ni navigateur piloté
    (Playwright ou équivalent) n'a été utilisée pour cette itération,
    contrainte client explicite** — la vérification s'appuie sur la lecture
    du code, le calcul de contraste WCAG et le grep du CSS/HTML de
    production.
- **Navbar & Footer — V0.1.12, ticket #14 : refonte autour de deux CTA de
  conversion (cf. ADR 16) :**
  - **Header (`App.vue` + `MegaMenu.vue`) épuré à deux CTA.** La pilule
    « Discutons IA » (créneau `#leading`), l'icône LinkedIn, l'icône mail et
    le bouton « Consulter nos offres » (créneau `#actions`) sont retirés ;
    de même pour leurs équivalents mobiles dans `#mobileActions`
    (« Consulter nos offres », « Discutons IA », le bouton téléphone). Le
    Header ne porte plus que deux `BaseButton`, côte à côte à droite en
    desktop (`#actions`) et empilés pleine largeur en mobile
    (`#mobileActions`, `flex-col`) : « Nous contacter »
    (`variant="outline"`, sobre) et « Nous rejoindre »
    (`variant="accent"`, aplat vert, flèche `iconRight`). Les deux ciblent
    `{ path: '/', hash: '#contact' }` — aucune page dédiée contact/carrière
    n'existe, même cible déjà utilisée par le lien « Nous rejoindre » du
    footer avant cette itération ;
  - **Intitulés de `mainNav.ts` raccourcis et alignés sur les ID de
    section.** « Notre collectif » → « L'Équipe » (`#equipe`), « Je suis une
    entreprise » → « Expertises » (`#services`), « Je suis candidat » →
    « Témoignages » (`#interviews`), « Références » → « Secteurs »
    (`#secteurs`, colonnes de sous-liens inchangées) ;
  - **Footer (`TheFooter.vue`) : deux nouveaux créneaux nommés.** `#social`
    (icônes de réseaux sociaux, reprend l'icône LinkedIn déplacée du Header,
    rendue sous la baseline de marque) et `#ctas` (les deux mêmes
    `BaseButton` que le Header, taille `lg`, `surface="dark"`, même
    disposition `flex-col`/`sm:flex-row` que le duo de CTA de la section
    Contact d'`HomeView`). Le bouton « Nous écrire » (mailto, isolé dans le
    bloc Contact du footer) est retiré : redondant avec le nouveau
    « Nous contacter » désormais visible juste au-dessus de la barre basse.
  - Vérifié par exécution (`npm run type-check`, `npm run lint`,
    `vitest run` — 6 tests passants, `npm run build`) et par grep du HTML
    pré-rendu (`dist/index.html`) : les anciens libellés (« Discutons IA »,
    « Consulter nos offres », « Je suis une entreprise », « Je suis
    candidat », « Notre collectif » en tant qu'intitulé de nav) n'apparaissent
    plus dans le Header, les nouveaux libellés et les deux CTA sont présents,
    et l'icône LinkedIn n'apparaît plus qu'une fois (footer). **Aucune
    vérification par capture d'écran ni navigateur piloté (Playwright ou
    équivalent) n'a été utilisée pour cette itération, contrainte client
    explicite** — même réserve méthodologique que les itérations précédentes
    du Hero.
- **`HomeView` / Footer — V0.1.13, ticket #15 : retrait de la section « Gardons
  contact », coordonnées réelles, quatre réseaux sociaux (cf. ADR 17) :**
  - **Section Contact (`#contact`) supprimée de `HomeView.vue`, fichier
    compris pour ses dépendances exclusives.** Le titre « Gardons contact »,
    le texte « Parlez-nous de vos enjeux… » et le bouton « Nous écrire »
    faisaient doublon avec les CTA globaux « Nous contacter »/« Nous
    rejoindre » du Header/Footer (V0.1.12). L'usage d'`AnimatedBackground`
    dans cette section disparaît avec elle (le composant reste vivant,
    toujours consommé par `TheFooter.vue`) ; le pictogramme fonctionnel
    `Icon` et la constante `ARROW`, qui n'avaient plus d'autre consommateur
    dans `HomeView.vue`, sont retirés avec leurs imports (`h`,
    `FunctionalComponent`, `BaseButton`, `AnimatedBackground`) ;
  - **Ancres `#contact` mortes corrigées partout où elles subsistaient.** Les
    deux CTA globaux (`App.vue`), le lien « Nous rejoindre » du Footer
    (`footerNav.ts`) et le bouton « Nous signaler le problème » de la page
    404 (`NotFoundView.vue`) pointaient tous vers `{ path: '/', hash:
    '#contact' }` : mesure temporaire, ils pointent désormais vers
    `mailto:contact@faceel-it.com`, en l'absence de toute page dédiée
    contact/recrutement — à remplacer par une vraie route dès qu'une telle
    page existera ;
  - **Coordonnées officielles du Footer (`App.vue`).** L'adresse générique
    « Wasquehal / Hauts-de-France » du bloc `#contact` devient « 10 allée du
    Château Blanc / 59290 Wasquehal » ; le téléphone passe de l'ancien
    numéro de remplissage (`03 20 00 00 00`) à `03 59 61 71 88`
    (`tel:+33359617188`) ; le courriel (`contact@faceel-it.com`) était déjà
    correct, inchangé. La signature « Faceel-IT — ESN, Wasquehal,
    Hauts-de-France. » de la barre basse du Footer n'est pas concernée :
    c'est une mention distincte de l'adresse postale, toujours exacte ;
  - **Quatre réseaux sociaux dans le Footer (`#social`), au lieu d'un seul
    LinkedIn.** LinkedIn (URL officielle désormais connue, le lien n'est
    plus un placeholder `#`), YouTube, Instagram et Glassdoor — icônes SVG
    générées pour cette itération (`currentColor`, `size-5`, minimalistes,
    pas des logos de marque pixel-exacts), chacune `target="_blank"
    rel="noopener noreferrer"` ;
  - Vérifié par exécution (`npm run type-check`, `npm run lint`, `npm run
    format`, `vitest run` — 6 tests passants, `npm run build`) et par grep du
    HTML pré-rendu (`dist/index.html`) : « Gardons contact » n'apparaît
    plus, la nouvelle adresse et le nouveau téléphone sont présents, aucune
    `href` ne contient plus `#contact`, les 4 URLs des réseaux sociaux sont
    présentes une fois chacune. **Aucune vérification par capture d'écran ni
    navigateur piloté (Playwright ou équivalent) n'a été utilisée pour cette
    itération, contrainte client explicite** — même réserve méthodologique
    que les itérations précédentes.
- **Section Services (`HomeView`) — V0.1.14, ticket #16 : grille → carrousel
  interactif (cf. ADR 18) :**
  - **Nouveau composant générique `components/ui/CardCarousel.vue`.** Une
    seule diapositive visible à la fois, invoquée via un créneau `#slide`
    (`{ index }`) — le composant ne connaît que `count` (nombre de
    diapositives) et `label` (nom de région), aucune donnée métier. Flèches
    précédent/suivant (boucle, jamais désactivées), compteur « X / N »
    décoratif (`aria-hidden`), transition `<Transition mode="out-in">`
    (fondu + léger décalage vertical, classes Tailwind `enter-*-class`/
    `leave-*-class` plutôt qu'un bloc `<style>` avec des classes nommées —
    seul patron de transition déjà en place dans ce dépôt, cf. `MegaMenu`,
    aucun `<style>` n'existe ailleurs dans `client/src`) ;
  - **Autoplay 5 s, minuteur SSR-safe.** `setInterval` instancié dans
    `onMounted` (jamais au niveau racine du script ni dans un calcul de
    rendu), nettoyé dans `onBeforeUnmount` — même discipline que le
    typewriter du Hero (ADR 05/06). Pause temporaire au survol
    (`@mouseenter`/`@mouseleave`) et au focus clavier (`@focusin`/
    `@focusout`, avec la même garde `relatedTarget` que
    `MegaMenu.onFocusOut` pour ne lever la pause que si le focus quitte
    réellement le composant) — jamais un arrêt définitif. Sous
    `prefers-reduced-motion: reduce`, l'autoplay ne démarre jamais (écouteur
    `change` pour réagir à une bascule en cours de session) ; la navigation
    manuelle aux flèches reste toujours possible ;
  - **Section Services (`HomeView.vue`).** La grille `sm:grid-cols-2
    lg:grid-cols-4` des 4 `HighlightCard` est remplacée par
    `<CardCarousel :count="SERVICES.length" label="Nos expertises">`, une
    seule carte large et centrée (`max-w-3xl`) par diapositive. Le premier
    mot de chaque titre (« Accélération », « Performance »,
    « Valorisation », « Maîtrise ») porte le surlignage marqueur introduit
    en V0.1.11 pour les paragraphes (`bg-linear-to-t from-accent-500/30
    to-transparent bg-[length:100%_40%] bg-bottom bg-no-repeat`), appliqué
    ici pour la première fois à un titre de carte plutôt qu'à un fragment de
    paragraphe ;
  - **`HighlightCard.vue` gagne un créneau `title` optionnel**, rétrocompatible
    (`<slot name="title">{{ title }}</slot>` — sans ce créneau, le rendu est
    strictement identique à avant) : c'est ce qui permet d'injecter le
    `<span>` de surlignage à l'intérieur du titre sans dupliquer toute la
    structure de la carte (ombre, tonalité, trait d'accent…) pour ce seul
    usage ;
  - Vérifié par exécution (`npm run type-check`, `npm run lint`, `npm run
    format`, `vitest run` — 6 tests passants, `npm run build`) — le build
    de production inclut le pré-rendu SSG (`vite-ssg`) : son succès sans
    blocage ni minuteur qui traîne est la preuve directe que le garde SSR
    (`import.meta.env.SSR`) fonctionne, pas seulement une affirmation. Grep
    du HTML pré-rendu (`dist/index.html`) : la région `role="region"
    aria-roledescription="carrousel" aria-label="Nos expertises"` est
    présente, la première diapositive (« Accélération digitale ») est
    rendue avec le `<span>` de surlignage et un seul espace entre les deux
    fragments du titre, le compteur affiche « 1 / 4 », les deux boutons de
    navigation portent leur `aria-label`, aucune trace de l'ancienne grille
    à 4 colonnes dans la section Services (les 3 occurrences restantes de
    cette classe de grille appartiennent aux sections Secteurs/Valeur
    ajoutée/RSE, non concernées par ce ticket). **Aucune vérification par
    capture d'écran ni navigateur piloté (Playwright ou équivalent) n'a été
    utilisée pour cette itération, contrainte client explicite** — même
    réserve méthodologique que les itérations précédentes.
- **Sections Services & Secteurs (`HomeView`) — V0.1.15, ticket #17 :
  agrandissement du carrousel, retrait du surlignage de titre, généralisation
  à Secteurs (cf. ADR 19) :**
  - **`HighlightCard.vue` gagne un second gabarit, `size` (`'md' | 'lg'`,
    cf. `CardSize` dans `types.ts`).** `md` (défaut) reprend l'habillage
    d'origine (`p-6 sm:p-8`, titre `text-title`, corps `text-base`) —
    aucune régression sur les cartes de grille encore en place (Valeur
    ajoutée, RSE). `lg` (marges `p-8 sm:p-12 lg:p-16`, titre `text-display`
    — le palier juste au-dessus dans l'échelle fluide de `main.css`, déjà
    utilisé par les `<h2>` de section —, corps `text-lg`) habille une carte
    seule qui occupe toute l'attention, sans dupliquer la structure du
    composant (ombre, tonalité, survol, trait d'accent identiques quel que
    soit le gabarit) ;
  - **Surlignage marqueur retiré du titre des cartes Services.** Introduit
    en V0.1.14 (ADR 18) pour surligner le premier mot du titre
    (« Accélération », « Performance »…), jugé redondant avec le trait
    d'accent déjà affiché sous le titre — retour client : « le trait
    suffit ». Le créneau `#title` de `HighlightCard` (ajouté pour ce
    surlignage) n'est plus utilisé sur cette page, mais reste dans le
    composant (même principe que le créneau `icon`, conservé sans
    consommateur depuis ADR 15 : un créneau optionnel générique n'est pas
    de la dette au même titre qu'un composant entier sans consommateur).
    La fonction `splitTitle` (`HomeView.vue`), qui n'avait plus d'autre
    usage, est supprimée avec son seul appelant ;
  - **Carte du carrousel agrandie : `max-w-3xl` → `max-w-5xl`, `size="lg"`.**
    Choix du client entre `5xl` et `6xl` — `5xl` retenu, déjà la largeur du
    paragraphe du Hero et de l'en-tête Valeur ajoutée (ADR 13), pas une
    nouvelle valeur d'échelle ;
  - **Section Secteurs : même mécanique de carrousel que Services.** La
    grille `sm:grid-cols-2 lg:grid-cols-4` de 4 `HighlightCard` (`tone="dark"`)
    est remplacée par `<CardCarousel :count="SECTORS.length" label="Nos
    secteurs d'activités">` — composant réutilisé tel quel, aucune variante
    ni fork créé pour cette section (cf. ADR 19 : le composant générique
    créé en V0.1.14 pour Services couvrait déjà ce besoin, la demande de
    factorisation du ticket #17 était donc déjà satisfaite par
    l'architecture existante) ;
  - Vérifié par exécution (`npm run type-check`, `npm run lint`, `npm run
    format`, `vitest run` — 6 tests passants, `npm run build`, y compris le
    rendu SSG — deux instances indépendantes de `CardCarousel` montées sur
    la même page sans blocage ni conflit, chaque `setInterval` étant un état
    local au composant, jamais partagé au niveau module) et par grep du HTML
    pré-rendu (`dist/index.html`) : les deux régions `aria-roledescription=
    "carrousel"` sont présentes avec des `aria-label` distincts (« Nos
    expertises », « Nos secteurs d'activités »), le titre du premier
    service (« Accélération digitale ») et celui du premier secteur
    (« Ecommerce ») portent la classe `text-display` sans aucun `<span>` de
    surlignage, `max-w-5xl` apparaît 4 fois (2 usages déjà existants —
    Hero, Valeur ajoutée — plus les 2 nouveaux), et les 5 surlignages de
    paragraphe posés en V0.1.11 (Valeur ajoutée ×3, Équipe ×2) sont
    toujours présents, intacts. **Aucune vérification par capture d'écran
    ni navigateur piloté (Playwright ou équivalent) n'a été utilisée pour
    cette itération, contrainte client explicite** — même réserve
    méthodologique que les itérations précédentes.
- **`CardCarousel` & sections Services/Secteurs/RSE (`HomeView`) — V0.1.16,
  ticket #18 : flèches latérales sur desktop, généralisation du carrousel à
  RSE (cf. ADR 20) :**
  - **Flèches repositionnées de part et d'autre de la carte dès `md:`.**
    Diagnostic client : la disposition empilée (flèches + compteur sous la
    carte, seule disposition existante depuis V0.1.14) laissait un vide
    immense de chaque côté de la carte centrale sur grand écran. `CardCarousel`
    porte désormais deux paires de boutons prev/next — une flanquant la carte
    (`hidden md:inline-flex`, conteneur `flex flex-col items-center gap-6
    md:flex-row md:justify-center md:gap-8`), une sous la carte avec le
    compteur (`md:hidden`, disposition d'origine inchangée sur mobile). Un
    troisième bloc, le compteur seul (`hidden md:block`), s'affiche sous la
    carte en desktop puisque les flèches n'y sont plus dans cette ligne.
    Duplication délibérée des `<button>` (pas de réordonnancement CSS
    `order`/`flex-wrap`) : `hidden`/`md:inline-flex` garantit qu'une seule
    paire est présente dans l'arbre d'accessibilité et la tabulation à la
    fois, et un bouton sans contenu de créneau est bon marché à dupliquer
    contrairement à un réordonnancement qui aurait couplé la mise en page à
    la largeur exacte de la carte fournie par l'appelant ;
  - **Section RSE : même mécanique de carrousel que Services/Secteurs.** La
    grille `sm:grid-cols-2 lg:grid-cols-4` des 4 `HighlightCard` (`tone="dark"`)
    est remplacée par `<CardCarousel :count="RSE_CARDS.length" label="Politique
    RSE">` — composant réutilisé tel quel, `activeRse(index)` ajouté sur le
    même patron que `activeService`/`activeSector`. Le `badge` (« Silver »,
    seule carte concernée — Ecovadis) suit la diapositive active via
    `activeRse(index).badge ?? ''`, `HighlightCard` ne rendant son bandeau
    que si `badge` est une chaîne non vide ;
  - **Rendu homogène sur les 3 blocs.** Services, Secteurs et RSE utilisent
    désormais tous `CardCarousel` avec `size="lg"` et `class="mx-auto
    max-w-5xl"` sur la carte — seules la tonalité (`light`/`dark`) et les
    données changent d'une section à l'autre, aucune variante ni fork du
    composant créé pour RSE ;
  - Vérifié par exécution (`npm run build` — type-check + build de
    production + rendu SSG, `npm run lint`, `npm run format`, `vitest run` —
    6 tests passants) et par grep du CSS/HTML de production (`dist/`) :
    les six classes responsives (`md:inline-flex`, `md:hidden`,
    `md:flex-row`, `md:justify-center`, `md:gap-8`, `md:block`) sont bien
    dans le bundle, les trois régions `aria-roledescription="carrousel"`
    sont présentes avec leurs `aria-label` distincts (« Nos expertises »,
    « Nos secteurs d'activités », « Politique RSE »), la première
    diapositive RSE (« Mobilité urbaine ») est pré-rendue, et les boutons
    prev/next apparaissent bien en 2 paires par carrousel (6 au total pour
    chaque sens). **Aucune vérification par capture d'écran ni navigateur
    piloté (Playwright ou équivalent) n'a été utilisée pour cette itération,
    contrainte client explicite** — même réserve méthodologique que les
    itérations précédentes.
- **`CoverCarousel` & section Valeur ajoutée (`HomeView`) — V0.1.17, ticket
  #19 : nouveau carrousel « cover flow » à 3 cartes (cf. ADR 21) :**
  - **Nouveau composant générique `components/ui/CoverCarousel.vue`, second
    type de carrousel du Design System.** Distinct de `CardCarousel`
    (1 diapositive visible) : affiche jusqu'à 3 diapositives à la fois
    (précédente/active/suivante) via 3 appels du créneau `#slide`, chacun
    reçoit `{ index, active }` — `active` (booléen structurel, pas une
    donnée métier) indique à l'appelant quel appel correspond à la carte
    centrale. Même discipline SSR/`prefers-reduced-motion`/pause au survol
    et au focus que `CardCarousel`, dupliquée plutôt que partagée via une
    composable commune (les deux mises en page divergent trop pour qu'une
    factorisation vaille l'indirection, cf. ADR 21) ;
  - **Disposition.** Carte active : `scale-100 opacity-100`, `z-10` dès
    `sm:`, ombre renforcée (`elevated` sur `HighlightCard`, nouveau prop qui
    bascule `shadow-soft` → `shadow-lift`, jeton déjà utilisé au survol des
    cartes interactives — pas de `shadow-lg` brut introduit). Cartes
    latérales : `scale-75 opacity-50`, chacune un `<button>` cliquable qui
    ramène la diapositive correspondante au centre (`navigateTo`, même
    relance d'autoplay qu'un clic sur une flèche). Cartes latérales masquées
    sous `sm:` (une seule carte visible sur très petit mobile, pour ne pas
    écraser le contenu horizontalement) ;
  - **Flèches aux extrémités du conteneur global**, `absolute
    left-0`/`right-0`, pas de part et d'autre de la seule carte active
    (le décalage visuel est déjà assuré par les cartes latérales
    partiellement visibles) ;
  - **Section Valeur ajoutée (`HomeView.vue`).** La grille
    `sm:grid-cols-2 lg:grid-cols-4` des 4 `HighlightCard` est remplacée par
    `<CoverCarousel :count="VALUE_CARDS.length" label="Notre valeur
    ajoutée">` ; le titre et le paragraphe de la section (`<header>`) restent
    en tête, inchangés. `VALUE_CARDS` reçoit le contenu exact transmis par
    le client pour ce ticket (4 titres/textes, aucun mot ajouté) ; le titre
    de chaque carte reste souligné par le seul trait d'accent déjà intégré à
    `HighlightCard`, pas de surlignage en dégradé (retour client déjà
    tranché pour Services en V0.1.15, ADR 19 — « le trait suffit ») ;
  - Vérifié par exécution (`npm run build` — type-check + build de
    production + rendu SSG, `npm run lint`, `npm run format`, `vitest run` —
    6 tests passants) et par grep du CSS de production (présence de
    `scale-75`, `scale-100`, `opacity-50`, `opacity-100`, `sm:block`,
    `sm:z-10`, `sm:w-1/2`, `lg:w-1/4`, `lg:w-2/5`, `px-14`, `sm:px-16`,
    `lg:px-20`, `shadow-lift`) et du HTML pré-rendu (`dist/index.html`) :
    une 4ᵉ région `aria-roledescription="carrousel"` apparaît (« Notre valeur
    ajoutée »), le nouveau contenu des 4 cartes est présent (l'ancien a
    disparu), et sur les 6 cartes `HighlightCard` rendues au total sur la
    page, exactement une porte `shadow-lift` (la carte active du nouveau
    carrousel) — les 5 autres restent en `shadow-soft`. **Aucune
    vérification par capture d'écran ni navigateur piloté (Playwright ou
    équivalent) n'a été utilisée pour cette itération, contrainte client
    explicite** — l'équilibre visuel réel du cover flow (chevauchement des
    cartes latérales, lisibilité à `opacity-50`) reste à confirmer par un
    humain ou un agent disposant d'un navigateur, limite documentée plutôt
    que passée sous silence, même réserve méthodologique que les itérations
    précédentes.
- **`CardCarousel`/`CoverCarousel` & sections Services/Secteurs/RSE/Valeur
  ajoutée (`HomeView`) — V0.1.18, design « Naked Slider » et flèches aux
  extrémités absolues (cf. ADR 22) :**
  - **Nouveau composant générique `components/ui/CarouselSlideContent.vue`,
    remplace `HighlightCard` comme habillage de diapositive dans les 4
    sections carrousel.** Retrait total de l'effet « bloc/carte » demandé
    par le client : plus de fond (`bg-white`/`bg-primary-900`), plus
    d'ombre (`shadow-soft`/`shadow-lift`), plus de bordure (`ring-*`), plus
    de coin arrondi (`rounded-card`) — le titre (avec son trait d'accent
    centré en dessous), le badge optionnel (RSE/Ecovadis) et le paragraphe
    flottent directement sur le fond de la section parente (`bg-light`,
    `bg-primary-950`, `bg-primary-900` selon la section). `HighlightCard`
    n'est pas modifié ni retiré : il reste le composant « carte » du Design
    System pour un usage hors carrousel (démontré dans `StyleguideView`),
    seul son usage dans les 4 sections carrousel de `HomeView` s'arrête ;
  - **`min-h-[200px]` sur le conteneur de texte**, pour absorber l'écart de
    hauteur entre une diapositive courte et une diapositive longue sans
    saut de layout (CLS) au moment où la `<Transition>` du carrousel
    englobant bascule d'une diapositive à l'autre ;
  - **Flèches repositionnées en position absolue aux extrémités de la
    région du carrousel** (`left-4 md:left-8 lg:left-12` /
    `right-4 md:right-8 lg:right-12`, `top-1/2 -translate-y-1/2`), à la
    place de l'ancienne disposition qui les collait au contenu — même
    échelle sur `CardCarousel` (jusque-là flanquant la carte dès `md:`,
    V0.1.16/ADR 20, désormais une seule paire de boutons, plus de
    duplication mobile/desktop) et `CoverCarousel` (jusque-là au bord du
    conteneur du carrousel, `left-0`/`right-0`, V0.1.17/ADR 21, désormais
    au bord de la section). Le padding horizontal du texte est élargi en
    conséquence (`px-20 md:px-24 lg:px-28` sur les deux composants, un
    standard commun plutôt que deux échelles distinctes) pour qu'aucune
    diapositive ne passe sous une flèche ;
  - **`CardCarousel` gagne un prop `tone` (`CardTone`, défaut `light`).**
    Corrige au passage un défaut de contraste préexistant sur son compteur
    décoratif (« 1 / 4 ») : la classe `text-primary-900/50`, pensée pour un
    fond clair, était déjà utilisée telle quelle sur les sections à fond
    navy (Secteurs, RSE) avant cette itération — ratio calculé (skill
    `a11y-color-check`) : **1,05:1 sur `bg-primary-950`, 1:1 sur
    `bg-primary-900`** (texte quasiment ou totalement invisible). `tone`
    bascule désormais le compteur vers `text-white/50` sur ces deux fonds
    — **5,12:1 sur `bg-primary-950`, 4,71:1 sur `bg-primary-900`, AA**.
    `HomeView.vue` passe `tone="dark"` aux carrousels Secteurs et RSE ;
  - **`CoverCarousel` conserve son prop `active` sur le créneau `#slide`,
    mais `CarouselSlideContent` ne s'en sert pas** : la hiérarchie visuelle
    entre diapositive active et diapositives latérales (échelle/opacité,
    inchangées depuis V0.1.17) suffit sans ombre renforcée — `elevated`
    (`HighlightCard`) n'a donc plus de consommateur en production ;
  - Vérifié par exécution (`npm run build` — type-check + build de
    production + rendu SSG, `npm run lint`, `npm run format`, `vitest run` —
    6 tests passants) et par grep du CSS de production (`dist/assets/`) :
    présence de `min-h-[200px]`, `left-4`, `md:left-8`, `lg:left-12`,
    `right-4`, `md:right-8`, `lg:right-12`, `px-20`, `md:px-24`, `lg:px-28`,
    `top-1/2`, `-translate-y-1/2`, `max-w-prose`, aucune classe orpheline.
    **Aucune vérification par capture d'écran ni navigateur piloté
    (Playwright ou équivalent) n'a été utilisée pour cette itération,
    contrainte explicite du rôle pour ce ticket** — l'équilibre visuel réel
    du texte libre (lisibilité sans encart, absence de recouvrement entre
    le texte et les flèches sur petit mobile) reste à confirmer par un
    humain ou un agent disposant d'un navigateur, limite documentée plutôt
    que passée sous silence, même réserve méthodologique que plusieurs
    itérations précédentes (V0.1.7 à V0.1.17 par intermittence).
- **`CarouselSlideContent`/`HomeView` — V0.1.19, alignement à gauche des
  carrousels et retrait de la section Notations (cf. ADR 23) :**
  - **`CarouselSlideContent.vue` : centré → aligné à gauche.** `items-center
    justify-center text-center` (V0.1.18) devient `items-start justify-center
    text-left` — `justify-center` reste sur l'axe vertical (plancher
    `min-h-[200px]`, inchangé), seul l'axe horizontal change. Badge, titre,
    trait d'accent et paragraphe démarrent désormais tous au même bord
    gauche, sans changement de classe individuel nécessaire sur eux (le
    flux `flex-col` sous `items-start` les aligne automatiquement) ;
  - **`HomeView.vue` : `<header>` des 4 sections carrousel reçoit
    `px-20 md:px-24 lg:px-28`**, exactement le padding déjà appliqué au
    conteneur de diapositive dans `CardCarousel`/`CoverCarousel` depuis
    V0.1.18 — sans quoi le `<h2>` (bord gauche = padding de la `<section>`
    seul) et le texte de diapositive (bord gauche = padding de la section +
    ce padding supplémentaire) ne tombaient pas sur le même bord gauche.
    Exact glyphe à glyphe sur Services/Secteurs/RSE (`CardCarousel`, une
    diapositive flush à gauche) ; approximatif sur Valeur ajoutée
    (`CoverCarousel`) dont la carte active reste délibérément centrée entre
    ses deux voisines partielles (« cover flow », ADR 21, non remis en
    cause) — limite assumée et documentée, pas un oubli ;
  - **`mx-auto` retiré des 3 instances `CarouselSlideContent` de
    `CardCarousel`** (Services, Secteurs, RSE — `class="mx-auto max-w-5xl"`
    → `class="max-w-5xl"`) : V0.1.18 centrait la carte elle-même comme un
    bloc dans son conteneur padded, ce qui aurait laissé le texte gauche-
    aligné démarrer au milieu de l'écran plutôt qu'au bord gauche réel —
    `max-w-5xl` seul reste pour borner la largeur de lecture du paragraphe ;
  - **Section « Notations » (Glassdoor/Google) retirée intégralement de la
    section Équipe (`HomeView.vue`)**, demande client explicite — le bloc
    `<div class="flex flex-wrap items-center justify-center gap-4">` portant
    les deux `<RatingBadge>` est supprimé, avec son import. `AvatarStack`
    (effectif « +60 ») et le paragraphe « redéfinir l'image des ESN » ne
    sont pas concernés : preuve sociale distincte des notations tierces, non
    visée par la demande. `RatingBadge.vue` n'avait plus aucun consommateur
    après ce retrait (vérifié par recherche globale avant suppression, même
    principe que `DataCore`/`WaveRibbon`, ADR 06/ADR 14) : supprimé du
    Design System, fichier compris ;
  - Vérifié par exécution (`npm run build` — type-check + build de
    production + rendu SSG, `npm run lint`, `npm run format`, `vitest run` —
    6 tests passants) et par grep du CSS/HTML de production (`dist/`) :
    présence de `items-start`, `text-left` sur les 6 instances de
    `CarouselSlideContent` rendues au premier rendu, des 4 `<header
    class="max-w-* px-20 md:px-24 lg:px-28">`, absence totale de « Google »
    et de `RatingBadge` dans le bundle (le seul « Glassdoor » restant est le
    lien réseau social du footer, `TheFooter.vue`, une fonctionnalité
    distincte introduite en V0.1.13/ADR 17, non concernée par ce ticket).
    `docs/CODEMAP.md` régénéré (`scripts/generate-codemap.py`) : confirme
    l'absence de `RatingBadge.vue` et que `HighlightCard.vue` ne reste
    référencé que par `StyleguideView.vue`. **Aucune vérification par
    capture d'écran ni navigateur piloté (Playwright ou équivalent) n'a été
    utilisée pour cette itération, contrainte explicite du rôle pour ce
    ticket** — l'équilibre visuel réel de l'alignement (absence de
    chevauchement entre le badge RSE et le bord gauche sur petit mobile,
    lisibilité du paragraphe en `max-w-prose` désormais non centré) reste à
    confirmer par un humain ou un agent disposant d'un navigateur, limite
    documentée plutôt que passée sous silence, même réserve méthodologique
    que plusieurs itérations précédentes.
- **`HomeView` — V0.1.20, pivot structurel : CSS Scroll Snapping pleine page
  et suppressions (cf. ADR 24) :**
  - **Conteneur `#page-scroll` (`h-dvh overflow-y-auto snap-y
    snap-mandatory`)** englobe désormais 5 diapositives, chacune `h-dvh
    w-full snap-start flex flex-col justify-center overflow-y-auto` : Hero,
    groupe Confiance+Services (`id="services-group"`, nouveau), Secteurs,
    Valeur ajoutée, RSE. `h-dvh` plutôt que `h-screen`/`vh` : gère
    correctement l'escamotage de la barre d'adresse mobile (dynamic viewport
    height, recalculé par le navigateur). Padding vertical de chaque
    diapositive réduit (`py-20 sm:py-28 lg:py-32` → `py-12` uniforme, `py-8`
    pour le groupe Confiance+Services) : `justify-center` centre déjà
    verticalement le contenu dans la boîte `h-dvh`, un padding fixe aussi
    généreux qu'avant serait redondant et risquerait un dépassement sur
    petit mobile ;
  - **Regroupement Confiance (Logo Wall) + Services dans
    `<section id="services-group">`**, une seule diapositive — demande
    client explicite pour que la logique une-diapositive-par-écran
    fonctionne. Les deux anciens `<section id="confiance">`/
    `<section id="services">` deviennent des `<div>` internes (mêmes `id`,
    ancres conservées) : le groupe lui-même ne porte aucun padding
    horizontal propre pour que le bandeau de logos reste en full bleed
    (ADR 08, inchangé) — c'est le bloc Services interne qui porte sa propre
    échelle de padding, reprise telle quelle de l'ancienne `<section
    id="services">` ;
  - **Section Interviews retirée intégralement** (`<section
    id="interviews">`, `InterviewCard`, `INTERVIEWS`, l'interface
    `Interview`) — demande client explicite. `InterviewCard.vue` n'avait
    plus aucun consommateur après ce retrait (vérifié par recherche globale) :
    supprimé du Design System, fichier compris, même principe que
    `RatingBadge` en V0.1.19. Les deux liens de navigation qui ciblaient
    `#interviews` (« Témoignages » dans `mainNav.ts`, « Interviews
    collaborateurs » dans `footerNav.ts`) sont retirés — repointer vers une
    autre section aurait été trompeur, aucun contenu équivalent n'existe ;
  - **Section Notations (Glassdoor/Google) : déjà retirée en V0.1.19
    (ADR 23), re-vérifiée pour ce ticket.** Le brief V0.1.20 redemandait ce
    retrait ; vérifié avant toute modification qu'il était déjà effectif
    (`RatingBadge.vue` déjà supprimé, aucune trace dans `HomeView.vue`) —
    rien à refaire, juste confirmé ;
  - **Section Équipe (`AvatarStack` « +60 » + paragraphe de positionnement) :
    conservée, mais placée HORS du conteneur `#page-scroll`.** Absente de la
    « liste stricte des diapositives » du brief, mais son contenu n'est ni
    une notation tierce ni un témoignage vidéo — les deux seuls types de
    contenu que le brief demande de retirer — donc pas supprimée sans
    consigne explicite (cf. CLAUDE.md, intégrité du contenu). Reste
    atteignable après la dernière diapositive (RSE) par chaînage de
    défilement natif du navigateur, avant `TheFooter` ;
  - **LIMITE ASSUMÉE ET DOCUMENTÉE — Navbar (`MegaMenu`) et `TheFooter` non
    déplacés dans `#page-scroll`.** Les deux sont des éléments de coquille
    montés une seule fois par `App.vue` pour toutes les pages (Styleguide,
    404 comprises) — les y forcer aurait cassé ces pages, qui n'ont pas été
    conçues pour un défilement en diapositives, ou aurait exigé de dupliquer
    le montage du header/footer par route (rupture d'une invariante
    d'architecture documentée dans `App.vue` : « l'en-tête et le pied de
    page sont montés ICI, une seule fois »). Conséquence pratique : sur le
    tout premier écran, la Navbar (`sticky top-0`, hauteur réelle ~4rem/5rem)
    occupe une part de la hauteur de viewport que le Hero (`h-dvh` plein) ne
    peut pas connaître à l'avance — son bas peut donc être masqué de
    quelques dizaines de pixels tant que l'utilisateur n'a pas fait défiler
    une première fois ; l'`overflow-y-auto` imposé par le brief sur chaque
    diapositive absorbe ce débordement sans jamais casser l'ancrage. Le
    Footer n'est pas littéralement un point d'ancrage `snap-start` (limite
    explicite par rapport au brief) : il reste atteignable par chaînage de
    défilement natif dès que `#page-scroll` a atteint la fin de son propre
    scroll interne ;
  - Vérifié par exécution (`npm run build` — type-check + build de
    production + rendu SSG, `npm run lint`, `npm run format`, `vitest run` —
    6 tests passants) et par grep du CSS/HTML de production (`dist/`) :
    présence de `h-dvh`, `overflow-y-auto`, `snap-y`, `snap-mandatory`,
    `snap-start` (5 occurrences, une par diapositive), absence totale
    d'« interviews »/« Interview collaborateurs » et de toute référence à
    `RatingBadge`/« Glassdoor sur Faceel » (badge de notation, distinct du
    lien social du footer). `docs/CODEMAP.md` régénéré : confirme l'absence
    de `InterviewCard.vue` et `RatingBadge.vue` dans le graphe de
    dépendances. **Aucune vérification par capture d'écran ni navigateur
    piloté (Playwright ou équivalent) n'a été utilisée pour cette itération,
    contrainte explicite du rôle pour ce ticket** — le comportement réel du
    scroll snapping (fluidité de l'enclenchement, ampleur exacte du
    recouvrement Navbar/Hero sur mobile, chaînage de défilement vers
    Équipe/Footer) reste à confirmer par un humain ou un agent disposant
    d'un navigateur, limite documentée plutôt que passée sous silence.
- **`HomeView` — V0.1.21, la section Équipe rejoint `#page-scroll` comme 6ᵉ
  diapositive ; le Footer reste hors du modèle de scroll snapping, ce n'est
  PAS un alignement à 100 % (cf. ADR 25, suite d'ADR 24) :**
  - **`#page-scroll` compte désormais 6 diapositives** (au lieu de 5) : Hero,
    groupe Confiance+Services, Secteurs, Valeur ajoutée, RSE, **Équipe**
    (nouveau). `<section id="equipe">` a les mêmes classes que les
    diapositives à contenu simple (`h-dvh w-full snap-start flex flex-col
    justify-center overflow-y-auto`), perd son ancien `scroll-mt-24`
    (inutile pour une diapositive `h-dvh`, aucune des 4 autres diapositives
    à contenu simple n'en porte). Notations Glassdoor/Google et témoignages
    Interviews : re-vérifiés absents (déjà retirés en ADR 23/ADR 24), rien
    à refaire ;
  - **Le Footer N'EST PAS devenu un point d'ancrage `snap-start` — le brief
    de ce ticket le nommait pourtant comme 6ᵉ diapositive.** Décision
    documentée en détail dans ADR 25 : `TheFooter` est monté une seule fois
    par `App.vue`, PARTAGÉ par `/styleguide` et la 404 — l'intégrer
    littéralement au même conteneur de scroll-snap que `HomeView.vue` exige
    de restructurer `App.vue` (rendu conditionnel à la route), un fichier
    hors du périmètre nommé du ticket (« HomeView.vue »/« TheFooter.vue »
    uniquement) et dont l'impact sur les deux autres routes ne peut pas
    être vérifié visuellement cette session (Playwright explicitement
    interdit). `TheFooter.vue` reste donc **inchangé** dans ce ticket : lui
    donner une hauteur minimale pleine page (`min-h-dvh`) sans le rendre
    réellement `snap-start` n'aurait été qu'un habillage visuel trompeur, en
    plus d'affecter `/styleguide`/404 qui partagent le même composant monté.
    Le Footer reste atteignable par chaînage de défilement natif, désormais
    après la diapositive Équipe (au lieu d'après RSE) ;
  - **Conclusion explicite : la page d'accueil n'est PAS à 100 % sous un
    modèle de full-page-scroll strict** — 6 des 7 sections de contenu de
    `HomeView.vue` le sont (toutes sauf aucune, en fait — Équipe inclus),
    mais le Footer partagé (`App.vue`) reste hors de ce modèle, limite
    assumée et documentée plutôt que revendiquée à tort. Un alignement
    complet nécessite une décision explicite du client sur la
    restructuration d'`App.vue` (cf. ADR 25, point 3, pour la voie technique
    déjà identifiée) ;
  - Vérifié par exécution (`npm run build`, `npm run lint`, `npm run
    format`, `vitest run` — 6 tests passants) et par grep du HTML pré-rendu
    de production (`dist/index.html`) : exactement 6 occurrences de
    `snap-start` (Hero, services-group, secteurs, valeurs, rse, equipe), 0
    occurrence d'« interview », 1 seule occurrence de « glassdoor » (lien
    social légitime du Footer, pas un badge de notation). **Aucune
    vérification par navigateur piloté (Playwright) n'a été utilisée,
    contrainte explicite du rôle pour ce ticket** — même réserve
    méthodologique qu'ADR 24.
- **`HomeView`/`App.vue`/`TheFooter.vue` — V0.1.22, OVERRIDE CLIENT EXPLICITE :
  la page d'accueil est désormais à 100 % sous un modèle de full-page-scroll,
  section Équipe supprimée intégralement (cf. ADR 26, décision client qui
  outrepasse ADR 24/ADR 25 — celles-ci restent lisibles pour l'historique de
  l'arbitrage, mais leur conclusion « Footer hors du modèle » ne tient plus) :**
  - **Section Équipe (`AvatarStack` « +60 », paragraphe « redéfinir l'image
    des ESN ») : SUPPRIMÉE INTÉGRALEMENT, pas déplacée cette fois.** Le
    client qualifie ce bloc de « notations » dans son brief et en demande le
    retrait total. `<section id="equipe">` retirée de `HomeView.vue`.
    `AvatarStack.vue` n'avait plus aucun consommateur nulle part sur le site
    (ni en production, ni démontré dans `StyleguideView.vue`) : supprimé du
    Design System, fichier compris. Deux entrées de navigation ciblant
    `#equipe` retirées (« L'Équipe » dans `mainNav.ts`, « Notre collectif »
    dans `footerNav.ts`), même raisonnement que le retrait des entrées
    Interviews en ADR 24 ;
  - **Le Footer est désormais un vrai point d'ancrage `snap-start` — la
    limite d'ADR 24/25 est levée, sur autorisation client explicite de
    modifier `App.vue`/`TheFooter.vue` nommément.** Le conteneur de
    scroll-snap (`h-dvh overflow-y-auto snap-y snap-mandatory`) remonte de
    `HomeView.vue` vers `App.vue`, où il enveloppe désormais `<main>` ET
    `<TheFooter>` — mais UNIQUEMENT sur les routes qui le déclarent via le
    nouveau `route.meta.fullPageScroll` (`routes.ts`), pour l'instant la
    seule route `/`. `/styleguide` et la 404 gardent leur flux document
    normal inchangé (`flex-1`, pied de page compact « collé en bas ») — une
    précaution ajoutée par prudence, non explicitée par le brief mais
    nécessaire pour ne pas régresser silencieusement deux routes que le
    brief ne nomme jamais. `TheFooter.vue` gagne un prop `fullPageScroll`
    (défaut `false`, comportement inchangé) qui bascule ses classes vers
    `w-full min-h-dvh snap-start flex flex-col justify-end` uniquement quand
    `App.vue` le lui demande. `HomeView.vue` perd son wrapper
    `#page-scroll` : ses 5 `<section>` redeviennent des racines de template
    directes, chacune garde ses propres classes `h-dvh w-full snap-start
    flex flex-col justify-center` — c'est le conteneur d'`App.vue`, un
    niveau au-dessus, qui les enclenche désormais (le CSS
    `scroll-snap-align` traverse `<main>` sans encombre, cet élément
    n'établissant pas sa propre boîte de défilement) ;
  - **Conclusion : la page d'accueil est maintenant sous un modèle de
    full-page-scroll intégral, du Hero jusqu'au Footer inclus** — 6 points
    d'ancrage `snap-start` en tout (5 `<section>` de `HomeView.vue` + le
    Footer), 0 section hors du conteneur de scroll-snap. Les notations
    Glassdoor/Google, les témoignages Interviews et la section Équipe sont
    tous les trois retirés intégralement du site ;
  - Vérifié par exécution (`npm run build` — type-check + build client/SSR +
    rendu SSG, `npm run lint`, `npm run format`, `vitest run` — 6 tests
    passants) et par grep du HTML pré-rendu de production (`dist/index.html`) :
    exactement 6 occurrences de `snap-start` (Hero, services-group,
    secteurs, valeurs, rse, `<footer>`), 0 occurrence d'`id="equipe"`, 0
    occurrence de « redéfinir l'image des ESN », 0 occurrence d'« interview »,
    1 seule occurrence de « glassdoor » (lien social légitime, inchangé).
    Classe exacte du `<footer>` de production confirmée par grep : `w-full
    min-h-dvh snap-start flex flex-col justify-end pt-12`. Fumée sur serveur
    de développement (`vite`, PAS Playwright) : `App.vue`, `HomeView.vue`,
    `TheFooter.vue` répondent `HTTP 200` sans erreur de transformation.
    **Aucune vérification par capture d'écran ni navigateur piloté n'a été
    utilisée, contrainte explicite du rôle reconduite pour ce ticket malgré
    l'autorisation de modifier `App.vue`/`TheFooter.vue`** — le rendu visuel
    réel (fluidité de l'enclenchement du Footer, absence de régression sur
    `/styleguide` et la 404) reste à confirmer par un humain ou un agent
    disposant d'un navigateur, limite documentée plutôt que passée sous
    silence, cf. ADR 26 pour le détail complet.
- **`CoverCarousel`/`HomeView` — V0.1.23, « effet wow » : chorégraphie CSS
  native (Grid + `<TransitionGroup>`), titre Valeur ajoutée déjà conforme
  (cf. ADR 27) :**
  - **Titre « Notre valeur ajoutée » : AUCUN changement — l'effet évidé
    (contour navy, intérieur transparent, `text-transparent` +
    `-webkit-text-stroke` sous garde `@supports`) était déjà en place**
    depuis les révisions Hero de V0.1 (`OUTLINE_NAVY`, `HomeView.vue`),
    vérifié par lecture avant toute modification. Le garde `@supports` est
    délibérément conservé plutôt qu'aligné sur la formulation littérale du
    brief (stroke inconditionnel) : sans lui, un navigateur sans support de
    `-webkit-text-stroke` afficherait un titre invisible
    (`text-transparent` sans aucun contour peint) — une régression, pas un
    alignement ;
  - **`CoverCarousel.vue` : glissement réel des cartes, plus un simple
    crossfade d'échelle/opacité à emplacement fixe.** Les 3 diapositives
    visibles (précédente/active/suivante) sont désormais empilées dans la
    même cellule CSS Grid (`col-start-1 row-start-1`) et gardent leur
    identité (indice réel comme `:key` Vue, pas leur rôle) d'une navigation
    à l'autre — une diapositive glisse donc PHYSIQUEMENT entre rôles
    (`translate-x-[±110%]` ↔ `translate-x-0`, `scale-75` ↔ `scale-100`,
    `opacity-40` ↔ `opacity-100`, `z-10` ↔ `z-20`), combiné à
    `transition-all duration-700 ease-premium` (nouveau jeton `main.css`,
    `cubic-bezier(0.25, 1, 0.5, 1)` — départ rapide, atterrissage en
    douceur, distinct d'`--ease-snap` réservé aux micro-interactions
    courtes). `<TransitionGroup>` (cœur de Vue, aucune dépendance ajoutée)
    gère l'entrée/la sortie des diapositives qui rejoignent/quittent le
    trio visible. Interface publique du composant INCHANGÉE — `HomeView.vue`
    ne nécessite AUCUNE modification pour en bénéficier ;
  - **PIÈGE SSR IDENTIFIÉ ET CORRIGÉ EN COURS DE TICKET — `<TransitionGroup
    tag="...">` fuyait ses props de configuration (`enter-active-class`
    etc.) comme attributs HTML bruts dans `dist/index.html`.** Root cause :
    raccourci de compilation SSR de `@vue/compiler-sfc`
    (`ssrTransformTransitionGroup`), activé uniquement quand un `tag`
    statique est fourni — confirmé par compilation directe du template en
    isolation, absent dès que `tag` est retiré (le composant devient alors
    un `Fragment` invisible dans le DOM, comportement runtime documenté).
    Corrigé : `tag` retiré de `<TransitionGroup>`, les classes de pile Grid
    migrent sur un `<div>` englobant écrit explicitement dans le template.
    Détail complet, reproduction et raisonnement dans ADR 27 — un futur
    agent qui réintroduirait `tag="div"` « pour plus de clarté »
    romprait cette correction silencieusement, d'où le commentaire dédié
    laissé directement dans `CoverCarousel.vue` ;
  - **`prefers-reduced-motion` : respect maintenu**, `motion-reduce:
    transition-none` sur la classe permanente de chaque carte et sur les
    classes d'entrée/sortie de `<TransitionGroup>` — sous préférence
    réduite, aucune animation ne s'exécute, les cartes changent de rôle
    instantanément ;
  - **Clic sur une carte latérale = navigation vers elle : inchangé** —
    `handleCardClick` reprend le même `navigateTo(...)` qu'avant ce
    ticket ;
  - Vérifié par exécution (`npm run build` — type-check + build client/SSR
    + rendu SSG, `npm run lint`, `npm run format`, `vitest run` — 6 tests
    passants) et par grep du CSS/HTML de production : présence d'`ease-
    premium` (résolu en `cubic-bezier(.25, 1, .5, 1)` dans le CSS généré),
    `duration-700`, `col-start-1`/`row-start-1`, `110%`, `.\!opacity-0`,
    `webkit-text-stroke` (titre, re-confirmé) ; **0** occurrence de
    `enter-active-class`/`enter-from-class`/`leave-active-class`/
    `leave-to-class` dans `dist/index.html` (piège SSR ci-dessus confirmé
    corrigé). Fumée sur serveur de développement (`vite`, PAS Playwright) :
    `CoverCarousel.vue`/`HomeView.vue` répondent `HTTP 200` sans erreur de
    transformation. **Aucune vérification par capture d'écran ni navigateur
    piloté (Playwright ou équivalent) n'a été utilisée, contrainte
    explicite du rôle pour ce ticket** — le rendu visuel réel de la
    chorégraphie (fluidité perçue, ampleur du chevauchement carte active/
    cartes latérales) reste à confirmer par un humain ou un agent disposant
    d'un navigateur, limite documentée plutôt que passée sous silence.
- **SEO & Accessibilité :** `@unhead/vue` configuré, `robots.txt` en place, `sitemap.xml` généré au build.
- **Pages :** `HomeView` (assemblée avec les données legacy) et `StyleguideView` (accessible en prod pour test).
- **Bandeau partenaires (section Confiance) :** terminé — `PartnerCarousel.vue`
  remplace le bandeau statique `LogoWall` sur `HomeView` pour cette section
  précise (demande client explicite). Défilement horizontal infini (technique
  marquee, piste dupliquée), grayscale → couleur au survol, pause au
  hover **et** au focus clavier (`focus-within`), neutralisé sous
  `prefers-reduced-motion`. Les 8 logos (Auchan, Boulanger, Verspieren,
  Decathlon, Midas, Kiabi, Mondial Relay, Leroy Merlin) sont déjà de vrais
  fichiers SVG présents dans `client/src/assets/images/partners/` — aucun
  fichier logo ne reste à fournir pour cette liste. `LogoWall` reste
  disponible dans le Design System pour un futur bandeau non animé.
- **`MegaMenu` (menu latéral), carrousels asymétriques floutés, animations
  d'apparition au défilement — V0.1.24 (cf. ADR 28) :**
  - **Navbar réduite à logo + bouton burger, à toutes les tailles d'écran.**
    Plus aucun lien de navigation en texte brut dans la barre (desktop comme
    mobile) — le bouton burger (icône ↔ croix, motif inchangé) n'est plus
    `lg:hidden`, il devient l'unique déclencheur de la navigation. Les CTA de
    conversion (« Nous contacter » / « Nous rejoindre ») restent visibles à
    droite dès `lg:` (créneau `#actions`), repris au pied du tiroir sous `lg:`
    (créneau `#mobileActions`, inchangé côté `App.vue`) ;
  - **Tiroir latéral (Sidebar) glissant depuis la gauche.** `<Transition>`
    natif de Vue (pas de bibliothèque tierce), fond assombri/flouté
    (`bg-primary-900/50 backdrop-blur-sm`) fermé au clic, croix de fermeture
    dédiée en tête du tiroir, fermeture au clavier (Échap) avec retour de
    focus au bouton burger, piège de focus maison (Tab/Maj+Tab bouclent dans
    le tiroir tant qu'il est ouvert). La liste `mainNavEntries` (Expertises,
    Secteurs) y est reprise avec une icône minimaliste par entrée (mallette,
    bâtiment, chevron par défaut) ; « Secteurs » (à sous-liens) devient une
    section accordéon, même mécanique que l'ex-tiroir mobile qu'il remplace ;
  - **Panneau déroulant desktop et encart (`MegaMenuFeature`) retirés.** Plus
    de survol/temporisation, plus de panneau à colonnes + encart — `feature`
    est retiré de `MegaMenuEntry` (`components/ui/types.ts`), sans
    consommateur. `App.vue` n'a nécessité aucune modification (interface
    publique de `MegaMenu` inchangée) ;
  - **Carrousels (`CardCarousel`, `CoverCarousel`) : contrôle asymétrique.**
    La flèche « précédent » est retirée des deux composants (navigation
    manuelle uniquement vers l'avant, ou attente de l'autoplay — la
    navigation boucle, aucune diapositive n'est rendue inatteignable).
    `CoverCarousel` garde sa carte latérale gauche cliquable (`prevIndex`),
    seul le bouton fléché disparaît. La flèche « suivant » restante porte un
    traitement flouté au repos (`blur-[2px] opacity-50`), net au survol
    ET au focus clavier (`hover:`/`focus-visible:blur-none opacity-100`,
    `transition-all duration-300`) — direction artistique validée sur
    maquette, sans régression d'accessibilité (bouton toujours focusable,
    `aria-label` inchangé) ;
  - **Animations d'apparition au défilement (`HomeView.vue`).** Nouveau
    composable `composables/useScrollReveal.ts` (API `IntersectionObserver`
    native, via `useIntersectionObserver` de VueUse — déjà une dépendance du
    projet, aucune bibliothèque d'animation ajoutée) : le contenu des 5 blocs
    hors Hero (Confiance, Services, Secteurs, Valeur ajoutée, RSE) apparaît
    en fondu + léger `translate-y` (jeton `animate-fade-up` déjà utilisé par
    le Hero) la première fois qu'il croise le viewport, jamais rejoué
    ensuite. Le Hero n'est pas concerné (chorégraphie d'entrée déjà dédiée
    depuis ADR 05/06). SSR-safe et no-JS-safe : le contenu reste visible par
    défaut dans le HTML pré-rendu et pour un visiteur sans JavaScript ;
    intégralement désactivé sous `prefers-reduced-motion` (l'observateur
    n'est même pas instancié) ;
  - Vérifié par exécution (`npm run build` — type-check + build client/SSR +
    rendu SSG, `npm run lint`, `npm run format`, `vitest run` — 6 tests
    passants) et par grep/comptage du CSS et du HTML de production
    (`dist/`) : présence de `.z-90`/`.z-95` (fond/tiroir), `.blur-\[2px\]`,
    `.hover\:blur-none`, `.focus-visible\:blur-none`, `.transition-all`,
    `.duration-300` ; exactement 4 flèches « suivante » et 0 flèche
    « précédente » dans le HTML pré-rendu ; 3 occurrences d'`animate-fade-up`
    (Hero, inchangées — confirme qu'aucune classe du nouveau composable ne
    fuit en SSR) ; 0 occurrence de `role="menu"`/« Discutons IA »/« Notre
    collectif ». **Aucune vérification par capture d'écran ni navigateur
    piloté (Playwright ou équivalent) n'a été utilisée pour cette itération,
    contrainte explicite du rôle pour ce ticket** — le rendu visuel réel
    (fluidité du slide-in, lisibilité du flou selon les fonds de section,
    calibrage du seuil de déclenchement de l'apparition au défilement) reste
    à confirmer par un humain ou un agent disposant d'un navigateur, même
    réserve méthodologique que toutes les itérations précédentes (cf. ADR 28
    pour le détail complet).
- **`CardCarousel`/`CoverCarousel` — V0.1.25, stylisation des flèches,
  balayage horizontal et pagination pleine opacité (cf. ADR 29) :**
  - **Flèche « suivant » : design plat, sans contour, couleurs conditionnelles.**
    `ring-1 ring-primary-900/10`, `shadow-soft` et la bascule de couleur au
    survol (`hover:bg-primary-900 hover:text-white hover:ring-accent-500/60`)
    sont retirés des deux composants — la flèche est désormais un simple
    disque de couleur pleine, identique au repos et au survol (seuls le flou
    et l'opacité, posés en V0.1.24, changent encore entre ces deux états).
    `CardCarousel` pilote la couleur via son prop `tone` existant
    (`ARROW_TONE`) : `bg-white text-primary-950` sur `tone="light"` (19,7:1,
    AAA), `bg-primary-900 text-white` sur `tone="dark"` (17,6:1, AAA).
    `CoverCarousel` (pas de prop `tone`, un seul usage réel — section Valeur
    ajoutée, fond clair) reprend la même palette claire codée en dur. Icône
    plus grasse sur les deux composants : `stroke-width` du SVG de `2` à `3` ;
  - **Correctif de contraste incidental sur l'anneau de focus clavier de
    `CardCarousel`.** En réécrivant la classe de couleur de la flèche, un
    défaut préexistant est mis en évidence : `focus-visible:outline-
    primary-900`, jamais varié selon `tone`, donnait (skill
    `a11y-color-check`) **≈1,1:1 sur `bg-primary-950`** (fond Secteurs) et
    **1:1 (couleur identique) sur `bg-primary-900`** (fond RSE) — un anneau de
    focus clavier quasiment invisible sur ces deux sections. `ARROW_TONE`
    bascule désormais l'anneau vers `outline-accent-500` sur `tone="dark"`
    (9,1:1 sur `bg-primary-900`, valeur déjà documentée dans `main.css` ;
    10,2:1 sur `bg-primary-950`), même convention déjà en place ailleurs sur
    fond sombre (`MegaMenu.vue`, lien d'évitement d'`App.vue`). `CoverCarousel`
    n'a pas ce défaut (seul fond clair, `outline-primary-900` déjà correct) ;
  - **Balayage horizontal droite → gauche sur `CardCarousel`.** La
    `<Transition mode="out-in">` qui enveloppe le texte de diapositive
    (`CarouselSlideContent`) passe d'un fondu + léger décalage VERTICAL à un
    balayage HORIZONTAL : la diapositive entrante vient de la droite
    (`translate-x-8 opacity-0` → `translate-x-0 opacity-100`, `duration-500
    ease-out`), la sortante part vers la gauche (`translate-x-0 opacity-100`
    → `-translate-x-8 opacity-0`, `duration-500 ease-in`) — `mode="out-in"`
    conservé, jamais de superposition. `CoverCarousel` n'est **pas concerné** :
    il n'a pas de `<Transition>` de ce type, ses 3 cartes visibles glissent
    déjà physiquement de rôle en rôle via `<TransitionGroup>` depuis l'« effet
    wow » de V0.1.23 (ADR 27) — chorégraphie récente et bespoke, non remise en
    cause par ce ticket (limite documentée dans le composant, pas un oubli) ;
  - **Pagination à pleine opacité.** Les deux composants retirent le suffixe
    `/50` de leur compteur décoratif (« 1 / 4 ») : `text-primary-950` (au lieu
    de `text-primary-900`) sur fond clair — 18,2:1 sur `bg-light` (AAA) —,
    `text-white` (inchangé, désormais sans `/50`) sur fond sombre — 19,7:1 sur
    `bg-primary-950`, 17,6:1 sur `bg-primary-900` (AAA) ;
  - Vérifié par exécution (`npm run build` — type-check + build client/SSR +
    rendu SSG, `npm run lint`, `npm run format`, `vitest run` — 6 tests
    passants) et par grep/comptage Python du CSS/HTML de production
    (`dist/`) : présence de `.translate-x-8`, `.-translate-x-8`, `.ease-out`,
    `.ease-in`, `.duration-500`, `.focus-visible\:outline-accent-500` (2
    occurrences supplémentaires sur les flèches `tone="dark"`, en plus des
    usages déjà existants ailleurs) ; **0** occurrence résiduelle de
    `ring-primary-900/10`, `text-primary-900/50` ou `text-white/50` ; 4
    occurrences de `stroke-width="3"` (les 4 flèches « suivante », 3 icônes
    `stroke-width="2"` restantes sans rapport, hors carrousel). **Aucune
    vérification par capture d'écran ni navigateur piloté (Playwright ou
    équivalent) n'a été utilisée pour cette itération, contrainte explicite
    du rôle pour ce ticket** — le rendu visuel réel (élégance du balayage à
    500 ms, lisibilité du disque blanc sur fond `bg-light` sans aucun contour)
    reste à confirmer par un humain ou un agent disposant d'un navigateur,
    limite documentée plutôt que passée sous silence, cf. ADR 29 pour le
    détail complet.

## ⚠️ Dettes Techniques & Manques Connus
- Pages légales obligatoires absentes (Mentions légales, RGPD).
- Le sitemap ne couvre pour l'instant que la racine `/` (pas de routes dynamiques d'API).
- Base de données Spring Boot / Flyway initialisée mais pas encore connectée au front (utilisation de mocks).
- Un fichier `majorel.svg` existe dans `client/src/assets/images/partners/`
  mais n'est utilisé par aucune section : Majorel ne fait pas partie de la
  liste des 8 partenaires fournie pour ce carrousel — à clarifier avec le
  client (partenaire à ajouter plus tard, ou fichier obsolète à retirer) avant
  de le réutiliser ou de le supprimer.

## Prochaine Étape Immédiate
- Implémentation des pages légales et raccordement du formulaire de contact au backend Spring Boot.