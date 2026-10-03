<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import { scrollRevealClass, useScrollReveal } from '@/composables/useScrollReveal'
import { useSeo } from '@/composables/useSeo'

/**
 * Page « Discutons IA » — V1.1.
 *
 * ROUTE DÉDIÉE — `router/routes.ts`/`staticPrerenderRoutes.ts` et
 * `mainNav.ts` mis à jour dans le même mouvement (même mécanisme
 * `meta.fullPageScroll` qu'ADR 26, déjà réutilisé pour `/notre-histoire`,
 * `/je-suis-une-entreprise` et `/je-suis-candidat` — rien de nouveau dans
 * `App.vue`).
 *
 * CTA « Vous souhaitez en discuter… » ET « Discutons-en » → `mailto` de
 * contact, même mesure temporaire que partout ailleurs sur le site (cf.
 * `App.vue`, commentaire « MESURE TEMPORAIRE ») : aucune page de prise de
 * rendez-vous n'existe encore dans `routes.ts`.
 *
 * LOGOS TECHNO EN TEXTE, PAS EN SVG — le brief propose explicitement
 * « Textes/Icônes » pour LangGraph, LangChain, FastAPI, OpenAI, TensorFlow.
 * Aucun fichier de marque officiel de ces outils n'existe dans ce dépôt ;
 * en reconstituer un à la main serait à la fois un risque de marque déposée
 * mal reproduite et un contenu visuel inventé (cf. CLAUDE.md, intégrité du
 * contenu) — le texte seul, en typographie du design system, est la lecture
 * la plus sûre de « Textes/Icônes ».
 *
 * SCHÉMAS RAG/MCP — de VRAIS PLACEHOLDERS, pas des diagrammes inventés : le
 * brief demande explicitement un « placeholder », jamais un schéma réel non
 * fourni. Un encart annoté comme tel remplit la demande sans fabriquer un
 * contenu qui n'existe pas encore.
 */
useSeo({
  title: 'Discutons IA',
  description:
    'Donnez à votre agent IA la mémoire (RAG) et les outils (MCP) dont il a besoin. ' +
    'POC en 30 jours, gouvernance et sécurité intégrées, architecture composable.',
})

const heroEl = useTemplateRef<HTMLElement>('heroEl')
const heroReveal = useScrollReveal(heroEl)
const offresEl = useTemplateRef<HTMLElement>('offresEl')
const offresReveal = useScrollReveal(offresEl)
const atoutsEl = useTemplateRef<HTMLElement>('atoutsEl')
const atoutsReveal = useScrollReveal(atoutsEl)
const methodeEl = useTemplateRef<HTMLElement>('methodeEl')
const methodeReveal = useScrollReveal(methodeEl)
const techEl = useTemplateRef<HTMLElement>('techEl')
const techReveal = useScrollReveal(techEl)
const ctaEl = useTemplateRef<HTMLElement>('ctaEl')
const ctaReveal = useScrollReveal(ctaEl)

const CONTACT_HREF = 'mailto:contact@faceel-it.com'

/* -------------------------------------------------------------------------- */
/* Offres — deux cartes                                                       */
/* -------------------------------------------------------------------------- */

interface Offer {
  title: string
  description: string
  processes: string[]
}

const OFFERS: Offer[] = [
  {
    title: 'L’IA dans le métier',
    description:
      'En devenant un véritable assistant métier, l’agent IA garantit la conformité à vos règles, ' +
      'facilite la formation et l’accompagnement RH/Finance, et optimise vos outils comme le CRM ' +
      'grâce à l’automatisation des tâches répétitives.',
    processes: [
      'Procédures internes (qualité, conformité)',
      'Ressources humaines (FAQ, politiques, onboarding)',
      'Finance (règles internes, contrôles, notes)',
      'Support client (base de connaissances, SLA)',
      'CRM (qualification, mise à jour, relances)',
      'Achats & logistique (catalogues, fournisseurs)',
    ],
  },
  {
    title: 'L’IA dans l’IT',
    description:
      'L’IA s’intègre naturellement à vos processus IT, de l’observabilité au DevOps, en passant ' +
      'par le monitoring, la gestion de tickets et l’automatisation d’infrastructures.',
    processes: [
      'Observabilité (dashboard, alertes, runbooks)',
      'Devops (CI/CD, déploiements guidés, rollback)',
      'Monitoring (lecture de logs, pré-diagnostic)',
      'Automatisation d’infra (scripts, tickets, IaC)',
      'Sécurité & accès (permissions via MCP)',
      'API & intégrations (outils, webhooks)',
    ],
  },
]

/* -------------------------------------------------------------------------- */
/* Atouts — 3 cartes + tech stack                                             */
/* -------------------------------------------------------------------------- */

interface StrengthCard {
  badge: string
  title: string
  description: string
}

const STRENGTHS: StrengthCard[] = [
  {
    badge: 'Traçabilité, audit, périmètres',
    title: 'Gouvernance & Sécurité',
    description:
      'Journalisation des sources (RAG), contrôle des accès aux collections, scopes d’outils (MCP). ' +
      'Déploiement on-prem / cloud selon vos contraintes.',
  },
  {
    badge: 'Interopérable par design',
    title: 'Architecture composable',
    description:
      'Standards émergents (MCP), connecteurs réutilisables, isolation par service. Swap de modèles, ' +
      'd’outils et de données sans recoder.',
  },
  {
    badge: 'POC en 30 jours',
    title: 'Engagement ROI',
    description:
      'Hypothèses chiffrées, métriques d’adoption, pilotage par la valeur. Itération courte → ' +
      'industrialisation.',
  },
]

/** Cf. commentaire d'en-tête « LOGOS TECHNO EN TEXTE ». */
const TECH_STACK = ['LangGraph', 'LangChain', 'FastAPI', 'OpenAI', 'TensorFlow']

/* -------------------------------------------------------------------------- */
/* Méthode — timeline 4 étapes                                                */
/* -------------------------------------------------------------------------- */

interface MethodStep {
  title: string
  description: string
}

const METHOD_STEPS: MethodStep[] = [
  {
    title: 'Cartographie',
    description:
      'Un expert dédié identifie avec vous les cas d’usage à fort ROI&nbsp;: en quelques ateliers, ' +
      'nous repérons les tâches les plus chronophages et les automatisations les plus rentables, ' +
      'afin de délivrer un impact concret dès le POC.',
  },
  {
    title: 'Données & RAG',
    description:
      'Une fois les cas d’usage identifiés, nous construisons avec vous une base de connaissances ' +
      'dynamique (collections, mises à jour, gouvernance des données) qui garantit des réponses ' +
      'toujours fiables et traçables.',
  },
  {
    title: 'Outils MCP',
    description:
      'Nos experts développent des connecteurs MCP pour vos systèmes (DB, CRM, APIs, workflows IT). ' +
      'Chaque outil devient une brique modulaire que l’agent IA peut réutiliser et combiner dans vos ' +
      'processus.',
  },
  {
    title: 'POC & Industrialisation',
    description:
      'Nous vous accompagnons sur la mise en production avec un suivi des KPI (productivité, ' +
      'conformité, qualité des réponses), des tests de scalabilité et la mise en place d’une ' +
      'gouvernance robuste de vos agents IA.',
  },
]

/* -------------------------------------------------------------------------- */
/* RAG vs MCP — onglets                                                       */
/* -------------------------------------------------------------------------- */

type TechTab = 'rag' | 'mcp'

/** État local simple : deux onglets, pas de route ni d'ancre à synchroniser
 *  (rien en dehors de cette section ne dépend de l'onglet actif). */
const activeTab = ref<TechTab>('rag')

const TABS: Record<TechTab, { label: string; title: string; description: string }> = {
  rag: {
    label: 'RAG',
    title: 'Pourquoi l’IA a besoin de mémoire (RAG)',
    description:
      'Une IA sans mémoire se limite à générer des réponses approximatives. Avec un système RAG ' +
      '(Retrieval-Augmented Generation), l’agent IA commence par retrouver l’information pertinente ' +
      'dans vos documents, bases métiers et contenus internes, puis construit une réponse ' +
      'contextualisée. Le résultat&nbsp;: des réponses fiables, traçables et conformes à vos règles ' +
      'd’entreprise, bien plus précises que de simples formulations génériques. Grâce au RAG, l’IA ' +
      'devient un véritable assistant métier intelligent.',
  },
  mcp: {
    label: 'MCP',
    title: 'Comment fonctionne l’agent IA métier (MCP, workflows, action)',
    description:
      'Donner une mémoire à l’IA n’est qu’une première étape. Pour qu’elle devienne réellement ' +
      'utile, il faut aussi lui donner la capacité d’agir sur vos outils et vos processus métier. ' +
      'Les protocoles MCP (Model Context Protocol) offrent un langage standardisé qui définit les ' +
      'actions qu’un agent IA peut exécuter&nbsp;: interroger une base de données, mettre à jour un ' +
      'CRM, appeler une API ou encore déclencher un workflow métier. Avec MCP, chaque action devient ' +
      'une brique modulaire et réutilisable, simple à connecter et à partager entre vos systèmes.',
  },
}
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
       1. HERO — sombre.
       ================================================================== -->
  <section
    id="hero"
    data-theme="dark"
    class="h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center px-4 py-16 text-white sm:px-6 lg:px-8 xl:px-12 bg-[#000066]"
  >
    <div
      ref="heroEl"
      class="mx-auto flex w-full max-w-4xl flex-col transition-all duration-700 ease-out motion-reduce:transition-none"
      :class="scrollRevealClass(heroReveal)"
    >
      <h1 class="font-display text-mega text-balance">
        Donnez à votre agent IA la mémoire et les outils dont il a besoin
      </h1>
      <p class="mt-6 max-w-2xl text-xl leading-relaxed text-white/75">
        Grâce aux systèmes RAG et aux protocoles MCP, transformez vos IA en véritables assistants
        métiers.
      </p>
      <div class="mt-10">
        <BaseButton variant="accent" size="lg" surface="dark" :href="CONTACT_HREF">
          Réalisez votre POC en 30 jours
        </BaseButton>
      </div>

      <blockquote
        class="mt-16 border-t border-white/10 pt-8 text-lg leading-relaxed text-balance text-white/60"
      >
        « Une IA sans capacité d’action reste confinée à la théorie. Créez une solution
        personnalisée, parfaitement intégrée à vos outils métiers et alignée sur vos besoins. »
      </blockquote>
    </div>
  </section>

  <!-- ==================================================================
       2. OFFRES — clair, deux cartes.
       ================================================================== -->
  <section
    id="offres"
    data-theme="light"
    class="h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center px-4 py-16 sm:px-6 lg:px-8 xl:px-12 bg-light"
  >
    <div ref="offresEl" class="mx-auto w-full max-w-6xl">
      <h2
        class="font-display text-display text-balance text-primary-900 transition-all duration-700 ease-out motion-reduce:transition-none"
        :class="scrollRevealClass(offresReveal)"
      >
        Ce que nous vous proposons
      </h2>

      <div class="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
        <article
          v-for="(offer, index) in OFFERS"
          :key="offer.title"
          class="rounded-card bg-white p-8 ring-1 ring-primary-900/8 shadow-soft transition-all duration-700 ease-out motion-reduce:transition-none"
          :style="{ transitionDelay: `${index * 140}ms` }"
          :class="scrollRevealClass(offresReveal, index === 0 ? 'left' : 'right')"
        >
          <h3 class="font-display text-title text-balance text-primary-900">{{ offer.title }}</h3>
          <p class="mt-4 text-base leading-relaxed text-primary-900/70">{{ offer.description }}</p>
          <p class="mt-6 text-sm font-bold text-primary-900">
            Nous pouvons intervenir sur vos différents processus&nbsp;:
          </p>
          <ul class="mt-3 space-y-2">
            <li
              v-for="process in offer.processes"
              :key="process"
              class="flex items-start gap-2 text-sm leading-relaxed text-primary-900/70"
            >
              <span aria-hidden="true" class="mt-2 size-1.5 shrink-0 rounded-full bg-accent-500" />
              {{ process }}
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>

  <!-- ==================================================================
       3. ATOUTS & TECH STACK — sombre.
       ================================================================== -->
  <section
    id="atouts"
    data-theme="dark"
    class="h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center px-4 py-16 text-white sm:px-6 lg:px-8 xl:px-12 bg-[#000066]"
  >
    <div ref="atoutsEl" class="mx-auto w-full max-w-6xl">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
        <article
          v-for="(strength, index) in STRENGTHS"
          :key="strength.title"
          class="rounded-card bg-white/5 p-6 ring-1 ring-white/10 transition-all duration-700 ease-out motion-reduce:transition-none sm:p-8"
          :style="{ transitionDelay: `${index * 140}ms` }"
          :class="scrollRevealClass(atoutsReveal, 'up')"
        >
          <span
            class="inline-flex items-center rounded-full bg-accent-500/15 px-3 py-1 text-eyebrow uppercase text-accent-500"
          >
            {{ strength.badge }}
          </span>
          <h3 class="mt-4 font-display text-lg font-bold text-white">{{ strength.title }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-white/70">{{ strength.description }}</p>
        </article>
      </div>

      <!-- Bandeau techno — texte seul, cf. commentaire d'en-tête « LOGOS
           TECHNO EN TEXTE ». -->
      <ul
        class="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 border-t border-white/10 pt-10"
      >
        <li
          v-for="tech in TECH_STACK"
          :key="tech"
          class="font-display text-lg font-bold tracking-tight text-white/50"
        >
          {{ tech }}
        </li>
      </ul>
    </div>
  </section>

  <!-- ==================================================================
       4. MÉTHODOLOGIE — clair, titre + timeline verticale.
       ================================================================== -->
  <section
    id="methode"
    data-theme="light"
    class="min-h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 xl:px-12 bg-light"
  >
    <div
      ref="methodeEl"
      class="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16"
    >
      <div
        class="transition-all duration-700 ease-out motion-reduce:transition-none lg:sticky lg:top-24 lg:self-start"
        :class="scrollRevealClass(methodeReveal, 'left')"
      >
        <h2 class="font-display text-display text-balance text-primary-900">
          Notre méthode en 4 étapes
        </h2>
        <div class="mt-8">
          <BaseButton variant="outline" size="lg" surface="light" :href="CONTACT_HREF">
            Vous souhaitez en discuter avec notre expert&nbsp;?
          </BaseButton>
        </div>
      </div>

      <ol class="space-y-10">
        <li
          v-for="(step, index) in METHOD_STEPS"
          :key="step.title"
          class="flex gap-5 transition-all duration-700 ease-out motion-reduce:transition-none"
          :style="{ transitionDelay: `${index * 140}ms` }"
          :class="scrollRevealClass(methodeReveal, 'right')"
        >
          <div class="flex shrink-0 flex-col items-center">
            <span
              class="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent-500 font-display text-lg font-extrabold text-primary-900"
            >
              {{ index + 1 }}
            </span>
            <!-- Trait de liaison — absent après la dernière étape. -->
            <span
              v-if="index < METHOD_STEPS.length - 1"
              aria-hidden="true"
              class="mt-2 w-px flex-1 bg-primary-900/10"
            />
          </div>
          <div class="pb-2">
            <p class="font-display text-lg font-bold text-primary-900">{{ step.title }}</p>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <p
              class="mt-2 text-base leading-relaxed text-primary-900/70"
              v-html="step.description"
            />
          </div>
        </li>
      </ol>
    </div>
  </section>

  <!-- ==================================================================
       5. PRÉSENTATION TECHNIQUE — sombre, onglets RAG / MCP.
       ================================================================== -->
  <section
    id="rag-mcp"
    data-theme="dark"
    class="min-h-dvh shrink-0 w-full snap-start snap-always flex flex-col justify-center px-4 py-12 text-white sm:px-6 lg:px-8 xl:px-12 bg-[#000066]"
  >
    <div
      ref="techEl"
      class="mx-auto w-full max-w-5xl transition-all duration-700 ease-out motion-reduce:transition-none"
      :class="scrollRevealClass(techReveal)"
    >
      <h2 class="text-center font-display text-display text-balance">Présentation RAG + MCP</h2>

      <!-- Onglets accessibles : `role="tablist"`, `aria-selected`,
           `aria-controls`/`aria-labelledby` en va-et-vient. `v-show` (pas
           `v-if`) sur les deux panneaux : le contenu des DEUX onglets reste
           dans le HTML pré-rendu (SEO, lecture sans JS), seul l'affichage
           bascule côté client. -->
      <div role="tablist" aria-label="RAG ou MCP" class="mt-10 flex justify-center gap-2">
        <button
          v-for="key in ['rag', 'mcp'] as const"
          :id="`tab-${key}`"
          :key="key"
          type="button"
          role="tab"
          :aria-selected="activeTab === key"
          :aria-controls="`panel-${key}`"
          class="rounded-full px-6 py-2 font-display text-sm font-bold uppercase tracking-wide transition-colors duration-300 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
          :class="
            activeTab === key
              ? 'bg-accent-500 text-primary-900'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          "
          @click="activeTab = key"
        >
          {{ TABS[key].label }}
        </button>
      </div>

      <div
        v-for="key in ['rag', 'mcp'] as const"
        v-show="activeTab === key"
        :id="`panel-${key}`"
        :key="key"
        role="tabpanel"
        :aria-labelledby="`tab-${key}`"
        class="mt-12 grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16"
      >
        <div>
          <h3 class="font-display text-title text-balance text-accent-500">
            {{ TABS[key].title }}
          </h3>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p class="mt-4 text-base leading-relaxed text-white/75" v-html="TABS[key].description" />
        </div>

        <!-- Placeholder de schéma — cf. commentaire d'en-tête « SCHÉMAS
             RAG/MCP » : annoncé comme tel, pas un diagramme inventé. -->
        <div
          aria-hidden="true"
          class="flex aspect-video items-center justify-center rounded-card border-2 border-dashed border-white/15 bg-white/5"
        >
          <p class="text-eyebrow uppercase text-white/35">Schéma {{ TABS[key].label }} à venir</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ==================================================================
       6. CALL TO ACTION — clair, encart doux.
       ================================================================== -->
  <section
    id="cta"
    data-theme="light"
    class="h-dvh shrink-0 w-full snap-start snap-always flex flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8 xl:px-12 bg-light-100"
  >
    <div
      ref="ctaEl"
      class="mx-auto max-w-2xl transition-all duration-700 ease-out motion-reduce:transition-none"
      :class="scrollRevealClass(ctaReveal)"
    >
      <h2 class="font-display text-mega text-balance text-primary-900">Votre POC IA en 30 jours</h2>
      <div class="mt-10">
        <BaseButton variant="accent" size="lg" surface="light" :href="CONTACT_HREF">
          Discutons-en
        </BaseButton>
      </div>
    </div>
  </section>

  <!-- ==================================================================
       7. FOOTER — repris dans le flux snap local (cf. HomeView.vue) ;
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
