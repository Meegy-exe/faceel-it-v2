<script setup lang="ts">
import { useTemplateRef } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import CoverCarousel from '@/components/ui/CoverCarousel.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import { scrollRevealClass, useScrollReveal } from '@/composables/useScrollReveal'
import { useSeo } from '@/composables/useSeo'
import photoVeloEquipe from '@/assets/images/photos/velo-equipe.jpg'
import photoCourseGroupe from '@/assets/images/photos/course-groupe.jpg'
import photoAfterwork from '@/assets/images/photos/afterwork.jpg'
import photoPaintball from '@/assets/images/photos/paintball.jpg'
import photoCourseSolo from '@/assets/images/photos/course-solo.jpg'
import photoFondateurs from '@/assets/images/photos/fondateurs.jpg'

/**
 * Page « Je suis candidat » — V0.9.
 *
 * ROUTE DÉDIÉE — `router/routes.ts`/`staticPrerenderRoutes.ts` mis à jour
 * dans le même mouvement (même mécanisme `meta.fullPageScroll` qu'ADR 26,
 * déjà réutilisé pour `/notre-histoire` et `/je-suis-une-entreprise`, rien de
 * nouveau dans `App.vue`). CONTRAIREMENT À `EnterpriseView.vue`, `mainNav.ts`
 * ne porte AUCUNE entrée « candidat » préexistante à repointer (seule
 * « entreprise » avait été anticipée comme cible provisoire) : ajouter un
 * nouveau lien de menu visible est une décision de contenu plus engageante
 * qu'un repointage discret, hors du périmètre demandé ici (« uniquement le
 * template et le script »). La page est fonctionnelle et indexable
 * (pré-rendue) mais n'apparaît pour l'instant dans aucun menu.
 *
 * IMAGES — `picsum.photos` explicitement demandé par le brief pour la
 * galerie, exclu comme pour les autres pages : le CSP de production
 * (`client/security-headers.conf`) déclare `img-src 'self'` sans exception.
 * Six photos déjà présentes ou ajoutées dans `assets/images/photos/`
 * (dépôt client) servent de substitut, décoratives (`alt=""`).
 *
 * CTA FINAL — « Voir nos offres » pointe vers le `mailto` de contact, pas
 * vers une page d'offres : aucune route de recrutement n'existe encore dans
 * `routes.ts`, exactement la même mesure temporaire déjà en place pour
 * « Nous rejoindre » dans `App.vue` (cf. son commentaire « MESURE
 * TEMPORAIRE »). Un lien vers une route inexistante serait un lien mort.
 *
 * ACTIVE = FOND ACCENT, MAIS TEXTE NAVY, PAS BLANC — le brief demande
 * `bg-accent-500` + « texte blanc » pour la carte active du carrousel de
 * témoignages. Blanc sur `accent-500` ne tient que 1,9:1 (cf. l'en-tête de
 * `main.css`), un échec WCAG net sur un paragraphe entier de citation — pas
 * une nuance de goût, un texte réellement illisible pour une partie des
 * visiteurs. `text-primary-900` (navy) à la place : c'est exactement la
 * paire déjà validée par `BaseButton.vue` (variante `accent`, 9,1:1) pour
 * tout texte porté par un aplat `accent-500` du design system.
 */
useSeo({
  title: 'Je suis candidat',
  description:
    'Rejoignez Faceel-IT : savoir-être, savoir-faire, formation, coaching et mentorat au sein ' +
    'd’un collectif de passionnés. Découvrez notre process de recrutement et nos offres.',
})

const savoirEtreEl = useTemplateRef<HTMLElement>('savoirEtreEl')
const savoirEtreReveal = useScrollReveal(savoirEtreEl)
const savoirFaireEl = useTemplateRef<HTMLElement>('savoirFaireEl')
const savoirFaireReveal = useScrollReveal(savoirFaireEl)
const collectifEl = useTemplateRef<HTMLElement>('collectifEl')
const collectifReveal = useScrollReveal(collectifEl)
const processEl = useTemplateRef<HTMLElement>('processEl')
const processReveal = useScrollReveal(processEl)
const eventsEl = useTemplateRef<HTMLElement>('eventsEl')
const eventsReveal = useScrollReveal(eventsEl)
const temoignagesEl = useTemplateRef<HTMLElement>('temoignagesEl')
const temoignagesReveal = useScrollReveal(temoignagesEl)
const ctaEl = useTemplateRef<HTMLElement>('ctaEl')
const ctaReveal = useScrollReveal(ctaEl)

const CONTACT_HREF = 'mailto:contact@faceel-it.com'

/* -------------------------------------------------------------------------- */
/* Le Collectif — 3 avantages                                                 */
/* -------------------------------------------------------------------------- */

interface Advantage {
  number: string
  title: string
  description: string
}

const ADVANTAGES: Advantage[] = [
  {
    number: '01',
    title: 'Formation',
    description: 'Rester en veille technologique permanente grâce à nos nombreuses formations.',
  },
  {
    number: '02',
    title: 'Coaching',
    description:
      'Notre programme de coaching est spécialement conçu pour vous faire atteindre vos objectifs de carrière.',
  },
  {
    number: '03',
    title: 'Mentorat',
    description: 'Notre communauté vous accompagnera dans votre montée en compétences.',
  },
]

/* -------------------------------------------------------------------------- */
/* Processus de recrutement — timeline                                       */
/* -------------------------------------------------------------------------- */

interface ProcessStep {
  number: string
  title: string
}

const PROCESS_STEPS: ProcessStep[] = [
  { number: '01', title: 'Entretien téléphonique avec notre RH' },
  {
    number: '02',
    title: 'Rencontre avec nos managers dans nos bureaux (autour d’un café et d’un thé)',
  },
  { number: '03', title: 'Proposition d’embauche' },
  { number: '04', title: 'Intégration' },
]

/* -------------------------------------------------------------------------- */
/* Faceel-event — galerie marquee                                            */
/* -------------------------------------------------------------------------- */

interface EventPhoto {
  src: string
}

/** Repris des photos déjà importées ailleurs sur le site (cf. commentaire
 *  d'en-tête) — le doublon d'usage entre pages est préférable à des fichiers
 *  de plusieurs Mo non optimisés (cf. `HistoireView.vue`, même arbitrage). */
const EVENT_PHOTOS: EventPhoto[] = [
  { src: photoVeloEquipe },
  { src: photoAfterwork },
  { src: photoPaintball },
  { src: photoCourseGroupe },
  { src: photoCourseSolo },
  { src: photoFondateurs },
]

/* -------------------------------------------------------------------------- */
/* Paroles de collaborateurs — témoignages                                   */
/* -------------------------------------------------------------------------- */

interface Testimonial {
  quote: string
  author: string
  role: string
}

/** Témoignages fournis tels quels par le brief — aucun n'est inventé
 *  (cf. CLAUDE.md, intégrité du contenu). */
const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Arrivé depuis maintenant plus de 2 ans, la vraie force de Faceel-It est sa proximité avec ses collaborateurs. Travailler directement à l’agence favorise l’échange et la cohésion d’équipe. Les nombreux afterworks et activités sportives renforcent la convivialité et le bien-être au travail.',
    author: 'Clément',
    role: 'Dev. fullstack',
  },
  {
    quote:
      'Super ambiance, processus de recrutement efficace, de bon lien avec les managers, j’apprécie grandement cette ESN !!',
    author: 'Mohamed',
    role: 'Dev. fullstack',
  },
  {
    quote:
      'Super ambiance, une équipe au top ! L’intégration s’est très bien passée, tout le monde est souriant. Très heureux d’avoir rejoint Faceel-it !',
    author: 'Quentin',
    role: 'Dev Fullstack',
  },
  {
    quote:
      'Mon arrivée chez Faceel-it s’est bien déroulée. L’équipe m’a soutenu tout au long de mon projet et m’a aidé à bien m’intégrer. Grâce à eux, j’ai pu progresser dans un cadre de travail agréable et dynamique. De plus, j’ai un excellent relationnel avec mon manager, ce qui rend mon quotidien encore plus agréable.',
    author: 'Allan',
    role: 'Dev. fullstack',
  },
]
</script>

<template>
  <!-- Pas de `<main>` ici : la coquille (`App.vue`) le fournit déjà. -->

  <!-- CONTENEUR SNAP OPT-IN : isole le scroll magnétique de cette vue sans
       dépendre de la hauteur flexée de <main> (cf. HomeView.vue) — le
       `meta.fullPageScroll` évoqué plus haut n'existe nulle part ailleurs
       dans le dépôt (routes.ts / App.vue), ce conteneur local est donc le
       seul mécanisme réel de snap sur cette page. -->
  <div class="h-dvh w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory">
  <!-- ==================================================================
       1. SAVOIR-ÊTRE — sombre, image « mask » à gauche / texte à droite.

       « Mask » plutôt que « parallax » (le brief laisse le choix) : un
       parallaxe lié au scroll exige un écouteur JS mesuré en continu, plus
       coûteux et plus risqué à valider sans navigateur réel sous la main
       (Playwright est interdit sur ce projet, cf. CLAUDE.md) qu'un simple
       dévoilement en `clip-path`, rejoué une seule fois via le même
       `useScrollReveal` que tout le reste de la page. -->
  <section
    id="savoir-etre"
    data-theme="dark"
    class="min-h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center px-4 py-16 text-white sm:px-6 lg:px-8 xl:px-12 bg-[#000066]"
  >
    <!-- `<h1>` de la page : premier titre significatif rencontré, résume le
         sujet pour l'a11y/le SEO (même parti que `HistoireView.vue`). -->
    <div
      ref="savoirEtreEl"
      class="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16"
    >
      <div
        aria-hidden="true"
        class="overflow-hidden rounded-3xl shadow-lift transition-all duration-700 ease-out motion-reduce:transition-none"
        :class="scrollRevealClass(savoirEtreReveal, 'left')"
      >
        <img
          :src="photoVeloEquipe"
          alt=""
          loading="eager"
          fetchpriority="high"
          decoding="async"
          class="aspect-[4/5] w-full object-cover transition-[clip-path] duration-1000 ease-out motion-reduce:transition-none"
          :style="{
            clipPath: savoirEtreReveal !== 'hidden' ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
          }"
        />
      </div>

      <div
        class="transition-all duration-700 ease-out motion-reduce:transition-none [animation-delay:120ms]"
        :class="scrollRevealClass(savoirEtreReveal, 'right')"
      >
        <h1 class="font-display text-display text-balance">
          D’abord un
          <!-- Effet outline demandé par le brief : bordure blanche, repli
               (`supports-[...]`) — sans support, le mot reste en plein blanc,
               jamais invisible. -->
          <span
            class="text-white supports-[-webkit-text-stroke:1px]:text-transparent supports-[-webkit-text-stroke:1px]:[-webkit-text-stroke:2px_white]"
          >
            savoir être
          </span>
        </h1>
        <p class="mt-6 text-lg leading-relaxed text-white/75 sm:text-xl">
          Chez Faceel-it nous cherchons avant tout des collaborateurs passionnés par leur métier et
          capables de s’ouvrir à de nouveaux projets.
        </p>
        <p class="mt-4 text-lg leading-relaxed text-white/75 sm:text-xl">
          Sortir de sa zone de confort et se challenger sont deux qualités essentielles si vous
          voulez nous rejoindre.
        </p>
        <p class="mt-4 text-lg leading-relaxed text-white/75 sm:text-xl">
          C’est pour cette raison que nous serons toujours à votre écoute et privilégierons vos
          souhaits d’évolution.
        </p>
      </div>
    </div>
  </section>

  <!-- ==================================================================
       2. SAVOIR-FAIRE — clair, texte à gauche / image à droite (hover scale).
       ================================================================== -->
  <section
    id="savoir-faire"
    data-theme="light"
    class="min-h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center px-4 py-16 sm:px-6 lg:px-8 xl:px-12 bg-light"
  >
    <div
      ref="savoirFaireEl"
      class="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16"
    >
      <div
        class="order-2 lg:order-1 transition-all duration-700 ease-out motion-reduce:transition-none"
        :class="scrollRevealClass(savoirFaireReveal, 'left')"
      >
        <h2 class="font-display text-display text-balance">
          Ensuite un
          <span
            class="text-primary-900 supports-[-webkit-text-stroke:1px]:text-transparent supports-[-webkit-text-stroke:1px]:[-webkit-text-stroke:2px_var(--color-primary-900)]"
          >
            savoir faire
          </span>
        </h2>
        <p class="mt-6 text-lg leading-relaxed text-primary-900/80 sm:text-xl">
          Nous vous accompagnons tout au long de votre carrière au sein de Faceel-it sur le
          développement de vos compétences.
        </p>
        <p class="mt-4 text-lg leading-relaxed text-primary-900/80 sm:text-xl">
          Diversité des missions, programmes de formation, meetups sont autant de leviers qui nous
          permettrons de vous faire progresser pour atteindre vos ambitions.
        </p>
      </div>

      <div
        class="group order-1 lg:order-2 overflow-hidden rounded-3xl shadow-lift transition-all duration-700 ease-out motion-reduce:transition-none [animation-delay:120ms]"
        :class="scrollRevealClass(savoirFaireReveal, 'right')"
      >
        <img
          :src="photoCourseGroupe"
          alt=""
          loading="lazy"
          decoding="async"
          class="aspect-[4/5] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 motion-reduce:transition-none"
        />
      </div>
    </div>
  </section>

  <!-- ==================================================================
       3. LE COLLECTIF — sombre, texte décoratif géant + 3 avantages.
       ================================================================== -->
  <section
    id="collectif"
    data-theme="dark"
    class="h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center px-4 py-16 text-white sm:px-6 lg:px-8 xl:px-12 bg-[#000066]"
  >
    <div ref="collectifEl" class="mx-auto w-full max-w-6xl">
      <h2
        class="text-center font-display text-display text-balance transition-all duration-700 ease-out motion-reduce:transition-none"
        :class="scrollRevealClass(collectifReveal)"
      >
        Rejoindre un collectif créé par et pour des passionnés
      </h2>

      <div class="mt-12 grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <!-- Texte décoratif géant, purement atmosphérique : le vrai titre de
             section est le `<h2>` ci-dessus, celui-ci n'apporte aucune
             information supplémentaire — `aria-hidden` évite le bruit pour
             un lecteur d'écran. -->
        <p
          aria-hidden="true"
          class="hidden select-none font-display text-[clamp(3rem,10vw,9rem)] leading-[0.85] text-transparent [-webkit-text-stroke:2px_white] opacity-40 lg:block"
        >
          Juste
          <br />
          pour
          <br />
          vous
        </p>

        <ul class="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-1">
          <li
            v-for="(advantage, index) in ADVANTAGES"
            :key="advantage.number"
            class="transition-all duration-700 ease-out motion-reduce:transition-none"
            :style="{ transitionDelay: `${index * 140}ms` }"
            :class="scrollRevealClass(collectifReveal, 'right')"
          >
            <p class="font-display text-3xl font-extrabold text-accent-500">
              {{ advantage.number }}
            </p>
            <p class="mt-1 font-display text-lg font-bold text-white">{{ advantage.title }}</p>
            <p class="mt-2 text-sm leading-relaxed text-white/70">{{ advantage.description }}</p>
          </li>
        </ul>
      </div>
    </div>
  </section>

  <!-- ==================================================================
       4. PROCESSUS DE RECRUTEMENT — clair, timeline verticale.
       ================================================================== -->
  <section
    id="process"
    data-theme="light"
    class="min-h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center px-4 py-16 sm:px-6 lg:px-8 xl:px-12 bg-light"
  >
    <div ref="processEl" class="mx-auto w-full max-w-4xl">
      <h2
        class="font-display text-display text-balance text-primary-900 transition-all duration-700 ease-out motion-reduce:transition-none"
        :class="scrollRevealClass(processReveal)"
      >
        Notre process d’entrée
      </h2>

      <!-- `<ol>`, pas `<ul>` : c'est un ORDRE, une entrée n'a de sens qu'après
           la précédente — un lecteur d'écran doit l'entendre comme tel. -->
      <ol class="mt-12 space-y-8">
        <li
          v-for="(step, index) in PROCESS_STEPS"
          :key="step.number"
          class="flex items-start gap-6 border-l-2 border-primary-900/10 pl-6 transition-all duration-700 ease-out motion-reduce:transition-none sm:gap-8 sm:pl-8"
          :style="{ transitionDelay: `${index * 120}ms` }"
          :class="scrollRevealClass(processReveal, 'left')"
        >
          <span
            class="shrink-0 font-display text-5xl font-extrabold tracking-tight text-accent-500 sm:text-6xl"
          >
            {{ step.number }}
          </span>
          <p class="mt-2 text-lg leading-relaxed text-primary-900 sm:mt-3 sm:text-xl">
            {{ step.title }}
          </p>
        </li>
      </ol>
    </div>
  </section>

  <!-- ==================================================================
       5. FACEEL-EVENT — sombre, galerie marquee.
       ================================================================== -->
  <section
    id="events"
    data-theme="dark"
    class="h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center py-16 text-white bg-[#000066]"
  >
    <div ref="eventsEl" class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12">
      <h2
        class="text-center font-display text-display text-balance transition-all duration-700 ease-out motion-reduce:transition-none"
        :class="scrollRevealClass(eventsReveal)"
      >
        Faceel-event
      </h2>
    </div>

    <!-- Défilement infini : même mécanique que `PartnerCarousel.vue` (piste
         dupliquée, `--animate-marquee`, pause au survol/focus,
         `motion-reduce` replié en grille statique) — reconduite ici pour des
         photos plutôt que des logos, pas réinventée. -->
    <div class="group/marquee mt-12 overflow-hidden motion-reduce:overflow-visible">
      <div
        class="flex w-max shrink-0 items-center gap-6 animate-marquee will-change-transform group-hover/marquee:[animation-play-state:paused] group-focus-within/marquee:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:px-4"
      >
        <div
          v-for="(photo, index) in EVENT_PHOTOS"
          :key="`${index}-${photo.src}`"
          class="group h-56 w-72 shrink-0 overflow-hidden rounded-3xl shadow-lift sm:h-64 sm:w-80"
        >
          <img
            :src="photo.src"
            alt=""
            loading="lazy"
            decoding="async"
            class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 motion-reduce:transition-none"
          />
        </div>

        <!-- Copie dupliquée, purement visuelle (boucle sans saut) — retirée
             de l'accessibilité comme dans `PartnerCarousel.vue`. -->
        <div
          v-for="(photo, index) in EVENT_PHOTOS"
          :key="`clone-${index}-${photo.src}`"
          aria-hidden="true"
          class="h-56 w-72 shrink-0 overflow-hidden rounded-3xl shadow-lift motion-reduce:hidden sm:h-64 sm:w-80"
        >
          <img :src="photo.src" alt="" class="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  </section>

  <!-- ==================================================================
       6. PAROLES DE COLLABORATEURS — clair, carrousel de témoignages.
       ================================================================== -->
  <section
    id="temoignages"
    data-theme="light"
    class="h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center px-4 py-16 sm:px-6 lg:px-8 xl:px-12 bg-light"
  >
    <div
      ref="temoignagesEl"
      class="mx-auto w-full max-w-6xl transition-all duration-700 ease-out motion-reduce:transition-none"
      :class="scrollRevealClass(temoignagesReveal)"
    >
      <h2 class="text-center font-display text-display text-balance text-primary-900">
        Paroles de collaborateurs
      </h2>

      <CoverCarousel
        :count="TESTIMONIALS.length"
        label="Paroles de collaborateurs"
        class="mt-8 h-[380px] sm:h-[340px]"
      >
        <template #slide="{ index, active }">
          <!-- `active` → fond accent, texte NAVY (pas blanc, cf. commentaire
               d'en-tête du script) ; sinon fond blanc « estompé » demandé par
               le brief (`ring` léger, pas de couleur vive). -->
          <blockquote
            class="flex h-full flex-col justify-center rounded-3xl p-8 text-center shadow-lift transition-colors duration-500 sm:p-10"
            :class="
              active
                ? 'bg-accent-500 text-primary-900'
                : 'bg-white text-primary-900/60 ring-1 ring-primary-900/8'
            "
          >
            <p class="text-base leading-relaxed sm:text-lg">« {{ TESTIMONIALS[index]!.quote }} »</p>
            <footer class="mt-6 text-sm font-bold uppercase tracking-wide">
              {{ TESTIMONIALS[index]!.author }} — {{ TESTIMONIALS[index]!.role }}
            </footer>
          </blockquote>
        </template>
      </CoverCarousel>
    </div>
  </section>

  <!-- ==================================================================
       7. CALL TO ACTION — sombre, encart final impactant.
       ================================================================== -->
  <section
    id="cta"
    data-theme="dark"
    class="h-dvh shrink-0 w-full snap-start snap-always flex flex-col items-center justify-center px-4 py-16 text-center text-white sm:px-6 lg:px-8 xl:px-12 bg-[#000066]"
  >
    <div
      ref="ctaEl"
      class="mx-auto max-w-2xl transition-all duration-700 ease-out motion-reduce:transition-none"
      :class="scrollRevealClass(ctaReveal)"
    >
      <h2 class="font-display text-display text-balance">
        Prêt à écrire la suite
        <span class="text-accent-500">avec nous</span>
        ?
      </h2>
      <div class="mt-10">
        <BaseButton variant="accent" size="lg" surface="dark" :href="CONTACT_HREF">
          Voir nos offres
        </BaseButton>
      </div>
    </div>
  </section>

  <!-- ==================================================================
       8. FOOTER — repris dans le flux snap local (cf. HomeView.vue) ;
       App.vue masque son footer global pour cette route pour éviter le
       doublon.
       ================================================================== -->
  <section
    data-theme="dark"
    class="h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-end bg-[#000066]"
  >
    <TheFooter />
  </section>
  </div>
  <!-- /conteneur snap -->
</template>
