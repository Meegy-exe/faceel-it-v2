<script setup lang="ts">
import { useTemplateRef } from 'vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import { scrollRevealClass, useScrollReveal } from '@/composables/useScrollReveal'
import { useSeo } from '@/composables/useSeo'
import photoPaintball from '@/assets/images/photos/paintball.jpg'
import photoAfterwork from '@/assets/images/photos/afterwork.jpg'
import photoLille from '@/assets/images/photos/lille.jpg'

/**
 * Page « Notre histoire » (rubrique « Qui sommes-nous ») - V0.7.
 *
 * DÉFILEMENT PLEIN ÉCRAN, COMME `HomeView.vue` : `meta.fullPageScroll` a été
 * ajouté à cette route dans `router/routes.ts` (sinon les classes `snap-*`
 * ci-dessous n'ont aucun conteneur de scroll-snap parent pour s'y accrocher,
 * cf. `App.vue`). Reprend le mécanisme d'ADR 26/`docs/DECISIONS.md`, ne
 * l'étend pas : rien de nouveau dans `App.vue` lui-même.
 *
 * INVERSE UNE DÉCISION PRÉCÉDENTE  les trois sections « Code and Play »,
 * « Explore and grow » et « Learn and progress » avaient été déplacées vers
 * `/qui-sommes-nous/notre-collectif` (qui les porte toujours, cf.
 * `CollectifView.vue`, tableau `VALUES`) au motif qu'elles décrivent le
 * collectif, pas la chronologie de la société. Cette page les réintègre à la
 * demande explicite du brief V0.7 : le contenu est donc désormais DUPLIQUÉ
 * entre les deux pages  reprise à l'identique du texte déjà validé plutôt
 * que reformulé, mais dupliqué tout de même. À arbitrer avec le client si ce
 * n'est pas l'intention (retirer le doublon de l'une des deux pages).
 *
 * IMAGES `picsum.photos` explicitement demandé par le brief, mais exclu
 * comme pour la galerie « Nos événements » de l'accueil : le CSP de
 * production (`client/security-headers.conf`) déclare `img-src 'self'` sans
 * exception, une image hotlinkée y serait bloquée par le navigateur après
 * déploiement. Cinq photos déjà présentes dans `assets/images/photos/`
 * (dépôt client) servent de substitut  décoratives (`alt=""`), le texte
 * adjacent porte déjà tout le sens.
 *
 * Tout le texte des sections 1 et 2 provient de l'ancien site, repris tel
 * que transmis (cf. règle d'intégrité du contenu, CLAUDE.md). Le texte des
 * sections 3-5 provient de `CollectifView.vue`, où il est déjà validé.
 */
useSeo({
  title: 'Notre histoire',
  description:
    'Née en 2020 à Lille, Faceel-IT accompagne les entreprises de la région dans leurs projets informatiques. Une ESN 100 % indépendante, en croissance organique.',
})

const originesEl = useTemplateRef<HTMLElement>('originesEl')
const originesReveal = useScrollReveal(originesEl)
const independanceEl = useTemplateRef<HTMLElement>('independanceEl')
const independanceReveal = useScrollReveal(independanceEl)
const codePlayEl = useTemplateRef<HTMLElement>('codePlayEl')
const codePlayReveal = useScrollReveal(codePlayEl)
const exploreGrowEl = useTemplateRef<HTMLElement>('exploreGrowEl')
const exploreGrowReveal = useScrollReveal(exploreGrowEl)
const learnProgressEl = useTemplateRef<HTMLElement>('learnProgressEl')
const learnProgressReveal = useScrollReveal(learnProgressEl)
// section rse integree
const rseEl = useTemplateRef<HTMLElement>('rseEl')
const rseReveal = useScrollReveal(rseEl)

// cartes rse
interface RseCard {
  title: string
  boldIntro?: string
  description: string
}

const RSE_CARDS: RseCard[] = [
  {
    title: 'Mobilité urbaine',
    boldIntro: 'Notre engagement pour une ville plus fluide et durable. ',
    description:
      "Nous soutenons activement les initiatives de mobilité urbaine visant à réduire l'empreinte carbone et à faciliter les déplacements doux.",
  },
  {
    title: 'Ecovadis',
    description:
      'Classée dans le top 15 % des entreprises évaluées par EcoVadis, notre entreprise est fière de contribuer à une économie plus responsable.',
  },
  {
    title: 'Charte de la diversité',
    description:
      "Nous mettons en œuvre une politique RH inclusive, favorisant l'égalité des chances et le respect de chacun dans toutes nos missions et recrutements.",
  },
  {
    title: 'Numeum',
    description:
      "Nous participons activement à la structuration de la filière numérique française. Ce partenariat nous permet d'être au cœur des enjeux du secteur.",
  },
]
</script>

<template>
  <!-- Pas de `<main>` ici : la coquille (`App.vue`) le fournit déjà. -->

  <!-- CONTENEUR SNAP OPT-IN : isole le scroll magnétique de cette vue sans
       dépendre de la hauteur flexée de <main> (cf. HomeView.vue) le
       `meta.fullPageScroll` évoqué plus haut n'existe nulle part ailleurs
       dans le dépôt (routes.ts / App.vue), ce conteneur local est donc le
       seul mécanisme réel de snap sur cette page. -->
  <div class="h-dvh w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory">
    <!-- ==================================================================
       1. HERO (ORIGINES) clair, fond uni, texte centré.
       Ancienne photo (fondateurs) retirée : obsolète, en attente d'un
       nouvel asset. Fond uni `bg-light` déjà en place, pas de remplacement
       nécessaire.
       ================================================================== -->
    <section
      id="origines"
      data-theme="light"
      class="min-h-dvh shrink-0 w-full snap-start snap-always flex flex-col items-center justify-center bg-light px-4 py-16 text-center sm:px-6 lg:px-8 xl:px-12"
    >
      <!-- `<h1>` visuellement masqué : le brief fait de « Il était une fois »
         un simple surtitre (pas de grand titre distinct pour cette
         section), mais la page a besoin d'un `<h1>` réel qui en résume le
         sujet pour l'a11y/le SEO  il reprend le titre déjà déclaré à
         `useSeo` ci-dessus, sans dupliquer visuellement du texte. -->
      <h1 class="sr-only">Notre histoire</h1>

      <div
        ref="originesEl"
        class="mx-auto max-w-3xl transition-all duration-700 ease-out motion-reduce:transition-none"
        :class="scrollRevealClass(originesReveal)"
      >
        <p class="text-eyebrow uppercase text-accent-700">Il était une fois</p>
        <p class="mt-6 text-lg leading-relaxed text-primary-900/80 sm:text-xl">
          Notre histoire débute en 2020 avec une ambition commune&nbsp;: accompagner les entreprises
          de la région lilloise dans la réussite de leurs projets informatiques, en garantissant un
          haut niveau d’exigence. Nous avons combiné nos expériences entrepreneuriales, techniques
          et managériales pour créer une ESN qui nous ressemble.
        </p>
      </div>
    </section>

    <!-- ==================================================================
       2. INDÉPENDANCE sombre, texte centré, police géante.
       ================================================================== -->
    <section
      id="independance"
      data-theme="dark"
      class="h-dvh shrink-0 w-full snap-start snap-always flex flex-col items-center justify-center bg-[#000066] px-4 py-16 text-center text-white sm:px-6 lg:px-8 xl:px-12"
    >
      <div
        ref="independanceEl"
        class="mx-auto max-w-4xl transition-all duration-700 ease-out motion-reduce:transition-none"
        :class="scrollRevealClass(independanceReveal)"
      >
        <p class="text-eyebrow uppercase text-accent-500">Nous sommes une société</p>
        <h2 class="mt-6 font-display text-mega text-balance">
          <span class="text-accent-500">100&nbsp;%</span> indépendante
          <br />
          <span class="text-accent-500">100&nbsp;%</span> de croissance organique
        </h2>
      </div>
    </section>

    <!-- ==================================================================
       3. CODE AND PLAY  clair, texte gauche / image droite.
       ================================================================== -->
    <section
      id="code-and-play"
      data-theme="light"
      class="min-h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center bg-light px-4 py-16 sm:px-6 lg:px-8 xl:px-12"
    >
      <div
        ref="codePlayEl"
        class="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16"
      >
        <div
          class="order-2 lg:order-1 transition-all duration-700 ease-out motion-reduce:transition-none"
          :class="scrollRevealClass(codePlayReveal, 'left')"
        >
          <h2 class="font-display text-display text-balance text-accent-500">Code and Play</h2>
          <p class="mt-6 text-lg leading-relaxed text-primary-900/80 sm:text-xl">
            Nous plaçons les valeurs du sport au cœur de notre collectif&nbsp;: esprit d’équipe,
            dépassement de soi et respect. Elles guident nos missions IT, renforcent notre cohésion
            et nourrissent l’excellence que nous visons pour nos clients.
          </p>
        </div>

        <div
          class="order-1 lg:order-2 transition-all duration-700 ease-out motion-reduce:transition-none"
          :class="scrollRevealClass(codePlayReveal, 'right')"
        >
          <img
            :src="photoPaintball"
            alt=""
            loading="lazy"
            decoding="async"
            class="aspect-[4/5] w-full rounded-3xl object-cover shadow-lift"
          />
        </div>
      </div>
    </section>

    <!-- ==================================================================
       4. EXPLORE AND GROW sombre, image gauche / texte droite.
       ================================================================== -->
    <section
      id="explore-and-grow"
      data-theme="dark"
      class="min-h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center bg-[#000066] px-4 py-16 text-white sm:px-6 lg:px-8 xl:px-12"
    >
      <div
        ref="exploreGrowEl"
        class="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16"
      >
        <div
          class="transition-all duration-700 ease-out motion-reduce:transition-none"
          :class="scrollRevealClass(exploreGrowReveal, 'left')"
        >
          <img
            :src="photoAfterwork"
            alt=""
            loading="lazy"
            decoding="async"
            class="aspect-[4/5] w-full rounded-3xl object-cover shadow-lift"
          />
        </div>

        <div
          class="transition-all duration-700 ease-out motion-reduce:transition-none"
          :class="scrollRevealClass(exploreGrowReveal, 'right')"
        >
          <h2 class="font-display text-display text-balance text-accent-500">Explore and grow</h2>
          <p class="mt-6 text-lg leading-relaxed text-white/75 sm:text-xl">
            À travers nos référencements clients et la diversité des projets que nous proposons,
            nous offrons à nos collaborateurs un véritable parcours de carrière&nbsp;: découvrir de
            nouveaux environnements, se challenger à travers des évolutions de poste et, pourquoi
            pas, envisager un changement de métier.
          </p>
        </div>
      </div>
    </section>

    <!-- ==================================================================
       5. LEARN AND PROGRESS clair, texte gauche / image droite.
       ================================================================== -->
    <section
      id="learn-and-progress"
      data-theme="light"
      class="min-h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center bg-light px-4 py-16 sm:px-6 lg:px-8 xl:px-12"
    >
      <div
        ref="learnProgressEl"
        class="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16"
      >
        <div
          class="order-2 lg:order-1 transition-all duration-700 ease-out motion-reduce:transition-none"
          :class="scrollRevealClass(learnProgressReveal, 'left')"
        >
          <h2 class="font-display text-display text-balance text-accent-500">Learn and progress</h2>
          <p class="mt-6 text-lg leading-relaxed text-primary-900/80 sm:text-xl">
            La formation est un levier essentiel de progression. Curiosité, partage et évolution
            guident nos parcours professionnels. Former, c’est développer les talents, anticiper les
            transformations du monde IT et construire des équipes prêtes à relever les défis
            technologiques de demain.
          </p>
        </div>

        <div
          class="order-1 lg:order-2 transition-all duration-700 ease-out motion-reduce:transition-none"
          :class="scrollRevealClass(learnProgressReveal, 'right')"
        >
          <img
            :src="photoLille"
            alt=""
            loading="lazy"
            decoding="async"
            class="aspect-[4/5] w-full rounded-3xl object-cover shadow-lift"
          />
        </div>
      </div>
    </section>

    <!-- ==================================================================
       6. POLITIQUE RSE — section rse integree, fusionnee depuis l'ancienne
       page dediee /politique-rse (retiree du menu et du routeur en v1).
       ================================================================== -->
    <section
      id="rse"
      data-theme="dark"
      class="min-h-dvh shrink-0 w-full snap-start snap-always flex flex-col items-center justify-center bg-[#000066] px-4 py-16 text-center text-white sm:px-6 lg:px-8 xl:px-12"
    >
      <div
        ref="rseEl"
        class="mx-auto max-w-3xl transition-all duration-700 ease-out motion-reduce:transition-none"
        :class="scrollRevealClass(rseReveal)"
      >
        <p class="text-eyebrow uppercase text-accent-500">Engagement</p>
        <!-- police titre rse : plus de font-display, poppins global suffit -->
        <h2 class="mt-6 text-display text-balance text-accent-500">Politique RSE</h2>
      </div>

      <!-- centrage carrousel : plus de full bleed, bloc centre sous le titre -->
      <div
        class="mt-10 flex w-full snap-x snap-mandatory gap-6 overflow-x-auto pb-8 hide-scrollbar md:justify-center"
      >
        <article
          v-for="card in RSE_CARDS"
          :key="card.title"
          class="flex w-[85vw] shrink-0 snap-center flex-col justify-between rounded-2xl bg-white p-8 text-left md:w-80"
        >
          <div>
            <p class="font-display text-lg font-bold text-primary-900">{{ card.title }}</p>
            <p class="mt-3 text-sm leading-relaxed text-primary-900/70">
              <strong v-if="card.boldIntro" class="font-bold text-primary-900"
                >{{ card.boldIntro }} </strong
              >{{ card.description }}
            </p>
          </div>
        </article>
      </div>
    </section>

    <!-- ==================================================================
       7. FOOTER repris dans le flux snap local (cf. HomeView.vue) ;
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
