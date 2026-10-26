<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import { useSeo } from '@/composables/useSeo'

/**
 * Page modèle (template) pour une Business Unit — textes volontairement
 * génériques : sert de base que les RH dupliquent et complètent pour chaque
 * BU, pas un contenu final à publier tel quel.
 */
useSeo({
  title: 'Digital — Modèle de page BU',
  description: 'Page modèle pour la Business Unit Digital.',
})

/** Retournement au clic des deux grandes cartes de la Section 2 (« Équipe »). */
const isSDFlipped = ref(false)
const isNVFlipped = ref(false)
</script>

<template>
  <div class="h-dvh w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory">
    <!-- SECTION 1 (Wireframe 3) — deux colonnes : textes + CTA à gauche, encart image placeholder à droite. -->
    <section
      id="hero"
      data-theme="dark"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-[#000066] grid grid-cols-1 lg:grid-cols-2"
    >
      <!-- Colonne gauche : textes + CTA, centrés -->
      <div class="flex flex-col items-center justify-center px-8 py-12 text-center lg:px-24">
        <p
          class="animate-fade-up text-sm font-bold uppercase tracking-widest text-accent-500 motion-reduce:animate-none"
        >
          Surtitre Digital
        </p>
        <h1
          class="mt-2 animate-fade-up font-display text-4xl font-extrabold text-white motion-reduce:animate-none sm:text-5xl [animation-delay:80ms]"
        >
          Titre Principal
        </h1>
        <p
          class="mt-4 max-w-lg animate-fade-up text-lg leading-relaxed text-white motion-reduce:animate-none [animation-delay:160ms]"
        >
          Description générique sur deux à trois lignes présentant la Business Unit, ses missions et
          ce qui la distingue au sein de Faceel-IT.
        </p>

        <div class="mt-8 animate-fade-up motion-reduce:animate-none [animation-delay:240ms]">
          <BaseButton variant="accent" surface="dark" size="lg" to="/consulter-nos-offres">
            Découvrir nos offres
          </BaseButton>
        </div>
      </div>

      <!-- Colonne droite : encart image — structure préparée pour un futur effet de
           carte retournable au clic (le déclenchement au clic n'est pas encore
           câblé, seule la structure flip 3D est posée). -->
      <div class="flex items-center justify-center px-8 py-12 lg:px-24">
        <div class="aspect-[4/3] w-full max-w-lg [perspective:1000px]">
          <div class="relative h-full w-full [transform-style:preserve-3d]">
            <!-- Face avant -->
            <div
              class="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-2 rounded-3xl border border-white/20 p-8 text-center backface-hidden"
            >
              <p class="text-lg font-semibold text-white">Image</p>
              <p class="text-sm text-white/70">Description</p>
            </div>
            <!-- Face arrière (masquée tant que la rotation n'est pas déclenchée) -->
            <div
              class="absolute inset-0 flex h-full w-full [transform:rotateY(180deg)] flex-col items-center justify-center gap-2 rounded-3xl border border-white/20 p-8 text-center backface-hidden"
            >
              <p class="text-lg font-semibold text-white">Sous-titre</p>
              <p class="text-sm text-white/70">Description</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 2 (Wireframe 10) — présentation statique des BU, deux profils
         de la BU Digital (pas de carrousel : juste un en-tête + un indicateur
         de position parmi les BU, et deux portraits avec un léger effet 3D
         statique, sans interaction). -->
    <section
      id="equipe"
      data-theme="light"
      class="relative h-dvh w-full shrink-0 snap-start snap-always flex flex-col bg-light px-4 pt-36 [@media(max-height:850px)]:pt-16 pb-8 sm:px-6 lg:px-8 xl:px-12"
    >
      <header class="max-w-5xl px-4 md:px-24 2xl:px-28">
        <h2 class="mt-4 [@media(max-height:850px)]:mt-2 font-display text-display min-[1030px]:whitespace-nowrap text-primary-900">
          Nos BUs, Expertes de vos besoins.
        </h2>
        <p class="mt-4 min-[1030px]:whitespace-nowrap text-sm md:text-base min-[1030px]:text-lg leading-relaxed text-primary-900/60">
          Une organisation interne adaptée au marché pour une réponse sur-mesure à nos clients
        </p>
      </header>

      <!-- Rangée statique : une seule BU sur cette page, « Digital » occupe
           désormais seule cette rangée, centrée sous la description. -->
      <div class="flex w-full justify-center items-end mt-8 mb-8 px-4 md:px-24 2xl:px-28 max-[459px]:hidden">
        <h3 class="font-display font-bold text-3xl md:text-4xl text-accent-700 text-center">Digital</h3>
      </div>

      <!-- Arène « Street Fighter », figée sur l'unique BU de la page : plus de
           flip au clic/survol (rien à révéler au dos, aucune autre BU à
           montrer), plus de minuteur. Tailles, marges et décalage conservés
           à l'identique de `BuSection.vue` — le seul « décalage » réel du
           composant source est horizontal (`-translate-x-16`/`translate-x-16`,
           uniquement entre 630px et 984px), pas vertical : pas de stagger
           vertical entre les deux cartes dans le composant d'origine. -->
      <div class="relative flex w-full flex-1 items-stretch max-[984px]:justify-center min-[985px]:justify-between gap-4 min-[985px]:gap-8 px-4 md:px-24 2xl:px-28 max-[459px]:hidden">
        <!-- Combattant gauche : Stéphanie Demarez -->
        <div class="flex w-auto shrink-0 flex-col items-center justify-center min-[630px]:max-[984px]:-translate-x-16">
          <div class="mb-4 max-w-32 text-center min-[985px]:hidden">
            <p class="text-sm font-bold text-primary-950">Stéphanie Demarez</p>
            <p class="text-[11px] font-medium text-primary-900/50">Directrice BU Digital</p>
            <p class="mt-1 min-h-[72px] text-xs italic leading-snug text-primary-900/80">
              <span class="block">« Je ne cherche pas seulement un business</span>
              <span class="block">mais avant tout à créer une relation durable. »</span>
            </p>
          </div>
          <div class="flex flex-col items-center">
            <div
              class="w-32 h-48 min-[985px]:w-48 min-[985px]:h-72 2xl:w-[320px] 2xl:h-[480px] [perspective:1000px] transform-gpu border-0 ring-0 outline-none cursor-pointer"
              role="button"
              tabindex="0"
              aria-label="Retourner la carte de Stéphanie Demarez"
              @click="isSDFlipped = !isSDFlipped"
              @keydown.enter="isSDFlipped = !isSDFlipped"
              @keydown.space.prevent="isSDFlipped = !isSDFlipped"
            >
              <div
                class="relative w-full h-full [transform-style:preserve-3d] rounded-2xl shadow-[-40px_20px_50px_-15px_rgba(0,0,50,0.4)] will-change-transform transition-transform duration-700 ease-in-out border-0 ring-0 outline-none"
                :class="isSDFlipped ? '[transform:rotateY(195deg)]' : '[transform:rotateY(15deg)]'"
              >
                <!-- Face avant -->
                <div class="absolute inset-0 h-full w-full backface-hidden antialiased translate-z-[1px] bg-primary-950 rounded-2xl flex items-center justify-center overflow-hidden border-0 border-transparent">
                  <span class="font-display text-3xl min-[985px]:text-5xl 2xl:text-7xl font-extrabold text-white/10 border-0 border-transparent">SD</span>
                </div>
                <!-- Face arrière — basique, prête à accueillir du contenu plus tard. -->
                <div class="absolute inset-0 h-full w-full [transform:rotateY(180deg)] backface-hidden antialiased bg-white border border-gray-200 rounded-2xl overflow-hidden" />
              </div>
            </div>
          </div>
        </div>

        <!-- Citations centrales — permanentes, en diagonale franche. Masquées
             sous 985px : le texte y est remplacé par les copies compactes
             attachées à chaque carte (cf. ci-dessus/dessous). -->
        <div class="hidden min-[985px]:flex flex-1 items-center px-4">
          <div class="relative w-full h-48 min-[985px]:h-72 2xl:h-[480px]">
            <div class="-mt-2 absolute inset-x-0 top-0 w-full px-4 text-left">
              <p class="text-base 2xl:text-2xl font-bold text-primary-950 mb-1">Stéphanie Demarez</p>
              <p class="text-sm font-medium text-primary-900/50 mb-2">Directrice BU Digital</p>
              <p class="min-h-[100px] 2xl:min-h-[120px] w-full max-w-full overflow-hidden text-xs 2xl:text-lg italic text-primary-900/80 leading-relaxed">
                <span class="block whitespace-normal break-words">« Je ne cherche pas seulement un business</span>
                <span class="block whitespace-normal break-words">mais avant tout à créer une relation durable. »</span>
              </p>
            </div>
            <div class="-mb-2 absolute inset-x-0 bottom-0 w-full px-4 text-right">
              <p class="text-base 2xl:text-2xl font-bold text-primary-950 mb-1">Noémie Vannoye</p>
              <p class="text-sm font-medium text-primary-900/50 mb-2">Responsable RH</p>
              <p class="min-h-[100px] 2xl:min-h-[120px] w-full max-w-full overflow-hidden text-xs 2xl:text-lg italic text-primary-900/80 leading-relaxed">
                <span class="block whitespace-normal break-words">« Écouter pour mieux suivre et accompagner</span>
                <span class="block whitespace-normal break-words">mes collaborateurs dans leur montée en compétences. »</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Combattant droit : Noémie Vannoye -->
        <div class="flex w-auto shrink-0 flex-col items-center justify-center min-[630px]:max-[984px]:translate-x-16">
          <div class="flex flex-col items-center">
            <div
              class="w-32 h-48 min-[985px]:w-48 min-[985px]:h-72 2xl:w-[320px] 2xl:h-[480px] [perspective:1000px] transform-gpu border-0 ring-0 outline-none cursor-pointer"
              role="button"
              tabindex="0"
              aria-label="Retourner la carte de Noémie Vannoye"
              @click="isNVFlipped = !isNVFlipped"
              @keydown.enter="isNVFlipped = !isNVFlipped"
              @keydown.space.prevent="isNVFlipped = !isNVFlipped"
            >
              <div
                class="relative w-full h-full [transform-style:preserve-3d] rounded-2xl shadow-[40px_20px_50px_-15px_rgba(0,0,50,0.4)] will-change-transform transition-transform duration-700 ease-in-out border-0 ring-0 outline-none"
                :class="isNVFlipped ? '[transform:rotateY(-195deg)]' : '[transform:rotateY(-15deg)]'"
              >
                <!-- Face avant -->
                <div class="absolute inset-0 h-full w-full backface-hidden antialiased translate-z-[1px] bg-primary-950 rounded-2xl flex items-center justify-center overflow-hidden border-0 border-transparent">
                  <span class="font-display text-3xl min-[985px]:text-5xl 2xl:text-7xl font-extrabold text-white/10 border-0 border-transparent">NV</span>
                </div>
                <!-- Face arrière — basique, prête à accueillir du contenu plus tard. -->
                <div class="absolute inset-0 h-full w-full [transform:rotateY(180deg)] backface-hidden antialiased bg-white border border-gray-200 rounded-2xl overflow-hidden" />
              </div>
            </div>
          </div>
          <div class="mt-4 max-w-32 text-center min-[985px]:hidden">
            <p class="text-sm font-bold text-primary-950">Noémie Vannoye</p>
            <p class="text-[11px] font-medium text-primary-900/50">Responsable RH</p>
            <p class="mt-1 min-h-[72px] text-xs italic leading-snug text-primary-900/80">
              <span class="block">« Écouter pour mieux suivre et accompagner</span>
              <span class="block">mes collaborateurs dans leur montée en compétences. »</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Sous 460px, l'arène à deux cartes ne tient plus : les deux profils
           sont empilés statiquement (pas de carrousel à une seule BU). -->
      <div class="hidden max-[459px]:flex w-full flex-1 flex-col items-center justify-center gap-10 px-4">
        <div class="flex flex-col items-center">
          <div class="flex h-[clamp(200px,40dvh,350px)] w-52 shrink min-h-0 items-center justify-center overflow-hidden rounded-2xl bg-primary-950 [@media(max-height:690px)]:max-h-[25dvh]">
            <span class="font-display text-6xl font-extrabold text-white/10">SD</span>
          </div>
          <div class="mt-4 [@media(max-height:690px)]:mt-2 min-h-[160px] w-full max-w-[18rem] flex flex-col justify-start text-center">
            <p class="text-xl font-bold text-primary-950">Stéphanie Demarez</p>
            <p class="text-sm font-medium text-primary-900/50">Directrice BU Digital</p>
            <p class="mt-1 text-base italic leading-snug text-primary-900/80 [@media(max-height:690px)]:text-sm [@media(max-height:690px)]:leading-tight">
              <span class="block">« Je ne cherche pas seulement un business</span>
              <span class="block">mais avant tout à créer une relation durable. »</span>
            </p>
          </div>
        </div>
        <div class="flex flex-col items-center">
          <div class="flex h-[clamp(200px,40dvh,350px)] w-52 shrink min-h-0 items-center justify-center overflow-hidden rounded-2xl bg-primary-950 [@media(max-height:690px)]:max-h-[25dvh]">
            <span class="font-display text-6xl font-extrabold text-white/10">NV</span>
          </div>
          <div class="mt-4 [@media(max-height:690px)]:mt-2 min-h-[160px] w-full max-w-[18rem] flex flex-col justify-start text-center">
            <p class="text-xl font-bold text-primary-950">Noémie Vannoye</p>
            <p class="text-sm font-medium text-primary-900/50">Responsable RH</p>
            <p class="mt-1 text-base italic leading-snug text-primary-900/80 [@media(max-height:690px)]:text-sm [@media(max-height:690px)]:leading-tight">
              <span class="block">« Écouter pour mieux suivre et accompagner</span>
              <span class="block">mes collaborateurs dans leur montée en compétences. »</span>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 3 (Wireframe 7) — photo empilée à gauche, témoignage à droite. -->
    <section
      id="temoignage"
      data-theme="dark"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-[#000066] grid grid-cols-1 lg:grid-cols-2"
    >
      <!-- Colonne gauche : photo (effet d'empilement) -->
      <div class="flex items-center justify-center px-8 py-12 lg:px-24">
        <div class="relative aspect-square w-full max-w-md">
          <div
            class="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl bg-gray-100"
            aria-hidden="true"
          />
          <div
            class="relative flex h-full w-full items-center justify-center rounded-3xl border border-gray-300 bg-white"
          >
            <p class="text-lg font-semibold text-gray-800">Photo</p>
          </div>
        </div>
      </div>

      <!-- Colonne droite : témoignage -->
      <div class="flex flex-col justify-center px-8 py-12 lg:px-24">
        <p class="text-sm font-bold uppercase tracking-widest text-accent-500">Surtitre</p>

        <div class="mt-6 flex flex-col">
          <span
            class="self-start font-display text-6xl font-black leading-none text-white"
            aria-hidden="true"
          >
            &ldquo;
          </span>
          <p class="mx-auto max-w-md text-center text-xl leading-relaxed text-white">
            Témoignage générique illustrant l'expérience d'un collaborateur ou d'un client de cette
            Business Unit.
          </p>
          <span
            class="self-end font-display text-6xl font-black leading-none text-white"
            aria-hidden="true"
          >
            &rdquo;
          </span>
        </div>

        <div class="mt-6">
          <p class="font-semibold text-white">Nom Prénom</p>
          <p class="text-sm text-blue-200">Poste</p>
        </div>

        <!-- Navigation visuelle : trait plein, deux segments pointillés, flèche -->
        <div class="mt-8 flex items-center gap-2">
          <span class="h-0.5 w-10 bg-accent-500" aria-hidden="true" />
          <span class="h-0 w-6 border-t-2 border-dashed border-accent-500" aria-hidden="true" />
          <span class="h-0 w-6 border-t-2 border-dashed border-accent-500" aria-hidden="true" />
          <svg class="size-5 text-accent-500" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>

    <!-- SECTION 4 (Wireframe 5) — en-tête centré + grille de 3 cartes. -->
    <section
      id="expertises"
      data-theme="light"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-white flex flex-col justify-center px-8 py-12 lg:px-24"
    >
      <div class="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p class="text-sm font-bold uppercase tracking-widest text-accent-500">Surtitre</p>
        <h2 class="mt-2 font-display text-4xl font-extrabold text-[#000066] sm:text-5xl">Titre</h2>
      </div>

      <div class="mx-auto mt-10 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
        <!-- Carte 1 -->
        <div class="flex flex-col items-center rounded-3xl bg-gray-100 p-8 text-center">
          <div class="size-12 rounded-2xl bg-[#000066]" aria-hidden="true" />
          <p class="mt-4 font-bold text-[#000066]">Sous-titre</p>
          <p class="mt-2 text-sm text-gray-700">Description</p>
        </div>

        <!-- Carte 2 (centre) -->
        <div
          class="flex flex-col items-center rounded-3xl border border-accent-500 bg-white p-8 text-center"
        >
          <div class="size-12 rounded-2xl bg-accent-500" aria-hidden="true" />
          <p class="mt-4 font-bold text-[#000066]">Sous-titre</p>
          <p class="mt-2 text-sm text-gray-700">Description</p>
        </div>

        <!-- Carte 3 -->
        <div class="flex flex-col items-center rounded-3xl bg-gray-100 p-8 text-center">
          <div class="size-12 rounded-2xl bg-[#000066]" aria-hidden="true" />
          <p class="mt-4 font-bold text-[#000066]">Sous-titre</p>
          <p class="mt-2 text-sm text-gray-700">Description</p>
        </div>
      </div>
    </section>

    <!-- SECTION 5 (Wireframe 8) — grille de 10 cartes "stack technique", la 3e mise en avant. -->
    <section
      id="stack"
      data-theme="dark"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-[#000066] flex flex-col justify-center px-8 py-12 text-center lg:px-24"
    >
      <div>
        <p class="text-sm font-bold uppercase tracking-widest text-accent-500">Surtitre</p>
        <h2 class="mt-2 font-display text-4xl font-extrabold text-white sm:text-5xl">Titre</h2>
      </div>

      <div class="mx-auto mt-12 grid w-full max-w-5xl grid-cols-2 gap-4 md:grid-cols-5">
        <div
          v-for="index in 10"
          :key="index"
          class="flex flex-col items-center justify-center gap-3 rounded-3xl bg-white/10 p-6"
          :class="index === 3 ? 'border border-accent-500' : ''"
        >
          <svg
            class="size-10"
            :class="index === 3 ? 'text-accent-500' : 'text-white/70'"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="2" fill="currentColor" />
            <ellipse cx="12" cy="12" rx="10" ry="4.5" stroke="currentColor" stroke-width="1.2" />
            <ellipse
              cx="12"
              cy="12"
              rx="10"
              ry="4.5"
              stroke="currentColor"
              stroke-width="1.2"
              transform="rotate(60 12 12)"
            />
            <ellipse
              cx="12"
              cy="12"
              rx="10"
              ry="4.5"
              stroke="currentColor"
              stroke-width="1.2"
              transform="rotate(120 12 12)"
            />
          </svg>
          <p class="text-sm" :class="index === 3 ? 'font-semibold text-white' : 'text-white/70'">
            Nom stack
          </p>
        </div>
      </div>
    </section>

    <!-- SECTION 6 (Wireframe 12) — en-tête centré + grille de 3 cartes « Offre », CTA final en dessous. -->
    <section
      id="offres"
      data-theme="light"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-white flex flex-col justify-center px-8 py-12 text-center lg:px-24"
    >
      <div>
        <p class="text-sm font-bold uppercase tracking-widest text-accent-700">Surtitre</p>
        <h2 class="mt-2 font-display text-4xl font-extrabold text-[#000066] sm:text-5xl">Titre</h2>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-gray-700">
          Description générique présentant les offres portées par cette Business Unit.
        </p>
      </div>

      <div class="mx-auto mt-10 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
        <div
          v-for="index in 3"
          :key="index"
          class="flex flex-col rounded-3xl border border-gray-100 bg-white p-8 text-left shadow-lg"
        >
          <p class="font-bold text-[#000066]">Titre Offre</p>
          <p class="mt-2 text-sm text-gray-700">Description</p>

          <div class="mt-6 flex flex-row flex-wrap gap-2">
            <span
              v-for="tech in 3"
              :key="tech"
              class="rounded-full bg-accent-500 px-3 py-1 text-xs font-semibold text-white"
            >
              Stack Tech
            </span>
          </div>
        </div>
      </div>

      <div class="mt-10">
        <BaseButton variant="accent" surface="light" size="lg" to="/consulter-nos-offres">
          Découvrez plus d'offres
          <template #iconRight>
            <svg class="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </template>
        </BaseButton>
      </div>
    </section>

    <TheFooter full-page-scroll />
  </div>
</template>
