<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import photoLille from '@/assets/images/photos/lille.jpg'
import IconGcp from '@/components/icons/IconGcp.vue'
import IconOmni from '@/components/icons/IconOmni.vue'
import IconPowerBi from '@/components/icons/IconPowerBi.vue'
import IconSnowflake from '@/components/icons/IconSnowflake.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import { useSeo } from '@/composables/useSeo'

/**
 * Page modèle (template) pour une Business Unit — textes volontairement
 * génériques : sert de base que les RH dupliquent et complètent pour chaque
 * BU, pas un contenu final à publier tel quel.
 */
useSeo({
  title: 'Data & IA — Modèle de page BU',
  description: 'Page modèle pour la Business Unit Data & IA.',
})

/** Retournement au clic des deux grandes cartes 3D de la section Leadership
 *  (même mécanique que DigitalView.vue, cf. commentaire sur cette section). */
const isRRFlipped = ref(false)
const isLLFlipped = ref(false)

/** Carrousel des deux photos de gauche du Hero, actif uniquement entre `md`
 *  et `xl` (cf. template : au-delà de `xl`, les deux cartes s'affichent côte
 *  à côte et ce carrousel n'a plus d'effet visuel). Réutilisé tel quel pour
 *  alterner les paires de logos partenaires (Snowflake/Omni ↔ GCP/Power BI) :
 *  un seul minuteur pilote les deux carrousels, qui restent synchronisés. */
const activeSlide = ref(0)
let carouselInterval: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  carouselInterval = setInterval(() => {
    activeSlide.value = activeSlide.value === 0 ? 1 : 0
  }, 4000)
})

onUnmounted(() => {
  clearInterval(carouselInterval)
})

interface CaseStudy {
  name: string
  description: string
  /** Graine picsum.photos — déterministe (même visuel à chaque rendu/build),
   *  pas d'image aléatoire. */
  seed: string
}

const CASE_STUDIES: CaseStudy[] = [
  {
    name: 'Retail / Mode',
    description: 'Description courte du projet mené pour ce secteur, sur deux lignes maximum.',
    seed: 'faceel-retail-mode',
  },
  {
    name: 'Brevo',
    description: 'Description courte du projet mené pour ce client, sur deux lignes maximum.',
    seed: 'faceel-brevo',
  },
  {
    name: 'Télécom',
    description: 'Description courte du projet mené pour ce secteur, sur deux lignes maximum.',
    seed: 'faceel-telecom',
  },
  {
    name: 'EDF',
    description: 'Description courte du projet mené pour ce client, sur deux lignes maximum.',
    seed: 'faceel-edf',
  },
]
</script>

<template>
  <div class="h-dvh w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory">
    <!-- SECTION 1 (Hero) — en-tête centré + mosaïque « bento grid » sur fond
         bleu Faceel-IT. `text-[#12D80A]` (accent-500 brut) pour la
         description : CORRECT ici, contrairement à la version précédente sur
         fond clair — sur ce fond sombre, le ratio est de 9,1:1 (cf. main.css). -->
    <section
      id="hero"
      data-theme="dark"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden flex flex-col gap-8 bg-gradient-to-b from-[#000066] from-60% to-[#00001a] px-4 pt-24 pb-12 text-center sm:px-6 lg:px-8 xl:px-12"
    >
      <!-- En-tête textuel -->
      <div class="mx-auto max-w-7xl shrink-0 px-4">
        <h1 class="animate-fade-up font-display text-4xl font-extrabold tracking-tight text-white motion-reduce:animate-none sm:text-6xl xl:text-7xl">
          BU Data & IA
        </h1>
        <p class="hero-lede mx-auto mt-6 max-w-3xl animate-fade-up text-base font-semibold leading-relaxed text-[#12D80A] motion-reduce:animate-none sm:text-xl xl:text-2xl [animation-delay:200ms]">
          Plus qu'une ESN, nous sommes un collectif de haut niveau. Transparence totale, chiffres
          assumés, et une force de frappe technologique pour déployer vos solutions Data & IA.
        </p>
      </div>

      <!-- Mosaïque « bento grid » — encarts photo en placeholders neutres (pas
           de vraies photos disponibles) plutôt que des images picsum.photos
           externes. Hauteurs : colonnes 1 et 2 et le conteneur de la colonne 3
           partagent explicitement le même `h-[480px]`, et les deux blocs
           empilés de la colonne 3 sont `flex-1` pour se répartir cette
           hauteur à parts égales — alignement garanti, pas approximatif. -->
      <div class="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:gap-6 xl:gap-8 xl:grid-cols-3">
        <!-- Carrousel (photos « meetup » / « Sarah ») : une seule colonne de
             md à xl, cartes superposées en `absolute` et basculées par
             `activeSlide` (cf. script) — le `xl:!flex` force leur affichage
             simultané à partir de `xl`, où `v-show` perd (volontairement) la
             main au profit de la grille à 2 colonnes ci-dessous. -->
        <div class="carousel-wrapper relative h-[240px] sm:h-[480px] xl:col-span-2 xl:grid xl:h-auto xl:grid-cols-2 xl:gap-8">
          <div
            v-show="activeSlide === 0"
            class="bento-photo-card absolute inset-0 flex h-[240px] sm:h-[480px] items-center justify-center rounded-3xl border border-white/10 bg-white/10 backdrop-blur-sm p-4 xl:relative xl:inset-auto xl:!flex"
          >
            <p class="text-sm text-white/50">Photo — conférence / meetup</p>
          </div>

          <div
            v-show="activeSlide === 1"
            class="bento-photo-card absolute inset-0 flex h-[240px] sm:h-[480px] items-center justify-center rounded-3xl border border-white/10 bg-white/10 backdrop-blur-sm p-4 xl:relative xl:inset-auto xl:!flex"
          >
            <p class="text-sm text-white/50">Photo — Sarah</p>
          </div>
        </div>

        <!-- Colonne 3 : photo de Lille masquée en dessous de `xl` (pile
             mobile/tablette simplifiée : seule la carte partenaires reste
             visible, cf. tour précédent), réintroduite à partir de `xl` pour
             ne pas laisser un grand vide au-dessus des partenaires sur
             desktop. -->
        <div class="col3-stack bento-photo-card h-auto xl:flex xl:h-[480px] xl:flex-col xl:gap-8">
          <div class="lille-photo-card relative hidden flex-1 min-h-0 overflow-hidden rounded-3xl border border-white/10 bg-white/10 backdrop-blur-sm xl:block">
            <img :src="photoLille" alt="" class="absolute inset-0 h-full w-full object-cover" />
          </div>

          <!-- Carte partenaires — l'accent saturé reste une touche (bordure),
               jamais un aplat de grande surface sur toute la carte (cf.
               main.css, règle de contraste du projet). Logos en slots de
               taille uniforme (h-6) : Omni est le premier à passer en
               composant SVG réel, les trois autres restent des slots neutres
               en attendant leurs propres composants (cf. IconOmni.vue pour le
               pourquoi de la démarche). -->
          <div class="partners-card flex h-full flex-col justify-center rounded-3xl border-l-4 border-accent-500 bg-white/10 backdrop-blur-sm p-4 sm:p-8 text-left xl:flex-1">
          <p class="font-display font-bold text-white mb-4 sm:mb-6">Partenaires stratégiques</p>
          <!-- Les 4 logos en `currentColor` pour l'icône qui peut se le
               permettre (Snowflake, mono-couleur) et pour le TEXTE
               seulement des deux logos multicolores (GCP, Power BI) — leurs
               formes/dégradés d'icône gardent leurs couleurs de marque
               d'origine (cf. IconGcp.vue/IconPowerBi.vue pour le détail).
               Plus de chip blanche : passer currentColor uniquement sur le
               texte évite d'avoir à recolorer toute l'icône en blanc, ce
               qui l'aurait rendue illisible (cf. tours précédents).

               Paires alternées (même `activeSlide` que le carrousel photo,
               cf. script) plutôt que la grille statique à 4 logos : sur les
               hauteurs mobiles compactes (568–630px), 4 logos + le titre ne
               tenaient plus dans une carte à hauteur fixe/symétrique du
               carrousel photo sans déborder. 2 logos à la fois réduit assez
               le contenu réel de la carte pour que cette symétrie redevienne
               possible sans artifice de plafonnement (`max-height` sur les
               `<svg>`, retiré). `.partner-pair` est neutralisé (affiché en
               permanence, les 2 paires ensemble) en dehors de cette plage
               précise par la règle `@media not (...)` du bloc <style>
               ci-dessous — ailleurs, rien ne change par rapport à l'ancienne
               grille statique. -->
          <div class="partners-logo-carousel mt-8 w-full">
            <div v-show="activeSlide === 0" class="partner-pair flex w-full items-center justify-around gap-8">
              <IconSnowflake class="h-10 md:h-12 w-auto max-w-[45%] object-contain text-white" />
              <IconOmni class="h-10 md:h-12 w-auto max-w-[45%] object-contain text-white" />
            </div>
            <div v-show="activeSlide === 1" class="partner-pair flex w-full items-center justify-around gap-8">
              <IconGcp class="h-16 md:h-20 w-auto max-w-[45%] object-contain text-white -translate-x-4 md:-translate-x-6" />
              <IconPowerBi class="h-28 md:h-32 w-auto max-w-[45%] object-contain text-white" />
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 2 (Expertise) — en-tête centré + grille de 3 cartes (offre de
         services), carte centrale (Assistance tech) mise en avant par une
         bordure verte, cf. maquette. -->
    <section
      id="expertise-offre"
      data-theme="light"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-white flex flex-col justify-center px-4 py-20 sm:px-6 lg:px-8 xl:px-12"
    >
      <div class="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p class="text-sm font-bold uppercase tracking-widest text-accent-500">Notre offre</p>
        <h2 class="mt-2 font-display text-4xl font-extrabold text-[#000066] sm:text-5xl">
          Expertise
        </h2>
      </div>

      <div class="mx-auto mt-10 grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
        <!-- Carte 1 — Centre de formation -->
        <div class="flex flex-col items-center rounded-3xl bg-gray-50 p-8 text-center">
          <div class="flex size-14 items-center justify-center rounded-2xl bg-[#000066]" aria-hidden="true">
            <svg class="size-7 text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <p class="mt-5 font-display font-bold text-[#000066]">Centre de formation</p>
          <ul class="mt-4 w-full space-y-2 text-left text-sm text-gray-700">
            <li v-for="n in 3" :key="n" class="flex items-center gap-3">
              <span class="size-1.5 shrink-0 rounded-full bg-gray-900" aria-hidden="true" />
              Sous-titre
            </li>
          </ul>
        </div>

        <!-- Carte 2 — Assistance tech (mise en avant) -->
        <div class="flex flex-col items-center rounded-3xl border-2 border-accent-500 bg-white p-8 text-center">
          <div class="flex size-14 items-center justify-center rounded-2xl bg-accent-500" aria-hidden="true">
            <svg class="size-7 text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <p class="mt-5 font-display font-bold text-[#000066]">Assistance tech</p>
          <ul class="mt-4 w-full space-y-2 text-left text-sm text-gray-700">
            <li v-for="n in 3" :key="n" class="flex items-center gap-3">
              <span class="size-1.5 shrink-0 rounded-full bg-gray-900" aria-hidden="true" />
              Sous-titre
            </li>
          </ul>
        </div>

        <!-- Carte 3 — Centre de service (identique à la carte 1) -->
        <div class="flex flex-col items-center rounded-3xl bg-gray-50 p-8 text-center">
          <div class="flex size-14 items-center justify-center rounded-2xl bg-[#000066]" aria-hidden="true">
            <svg class="size-7 text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <p class="mt-5 font-display font-bold text-[#000066]">Centre de service</p>
          <ul class="mt-4 w-full space-y-2 text-left text-sm text-gray-700">
            <li v-for="n in 3" :key="n" class="flex items-center gap-3">
              <span class="size-1.5 shrink-0 rounded-full bg-gray-900" aria-hidden="true" />
              Sous-titre
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- SECTION 3 (Force d'exécution) — contenu mixte (image + texte) puis bannière de chiffres clés. -->
    <section
      id="execution"
      data-theme="light"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-white flex flex-col justify-center px-4 py-20 sm:px-6 lg:px-8 xl:px-12"
    >
      <div class="mx-auto grid w-full max-w-5xl grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
        <!-- Colonne gauche : image (placeholder neutre, cohérent avec le reste du gabarit). -->
        <div class="flex aspect-[4/3] w-full items-center justify-center rounded-3xl bg-gray-100 p-8 text-center">
          <p class="text-sm text-gray-500">Photo — équipe en situation</p>
        </div>

        <!-- Colonne droite : texte -->
        <div>
          <h2 class="font-display text-2xl font-bold text-[#000066] sm:text-3xl">
            Au-delà du conseil, une force d'exécution.
          </h2>
          <div class="mt-4 space-y-4 text-sm leading-relaxed text-gray-600">
            <p>
              Expertise technique de pointe, consultants certifiés sur les outils de référence,
              pragmatisme assumé : nous testons et choisissons le bon outil pour chaque cas
              d'usage.
            </p>
            <p>
              Tout le potentiel de nos outils partenaires réside dans leur paramétrage spécifique
              et leur interconnexion avec vos outils existants. Au plus près de vos équipes, nos
              ingénieurs calibrent la solution à votre métier, vos données et votre environnement.
            </p>
            <p>
              Grâce à nos partenariats officiels, vous bénéficiez en continu des dernières
              innovations et d'un accès premium aux éditeurs.
            </p>
          </div>
        </div>
      </div>

      <!-- Bannière de chiffres clés -->
      <div class="mx-auto mt-16 w-full max-w-5xl rounded-3xl bg-gray-50 px-8 py-10">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div
            v-for="stat in [
              { value: '5', label: 'partenaires off.' },
              { value: '15', label: 'experts' },
              { value: '50', label: 'clients accompagnés' },
            ]"
            :key="stat.label"
            class="text-center"
          >
            <p class="font-display text-4xl font-bold text-[#000066] sm:text-5xl">
              {{ stat.value }}
            </p>
            <p class="mt-1 text-sm text-gray-500">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 4 (Cas d'usage) — galerie (portfolio immersif, image + overlay). -->
    <section
      id="realisations"
      data-theme="dark"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-[#000066] flex flex-col justify-center py-20"
    >
      <div class="mx-auto max-w-3xl px-4 text-center">
        <h2 class="font-display text-4xl font-extrabold text-white sm:text-5xl">Cas d'usage</h2>
        <p class="mx-auto mt-4 max-w-2xl text-white/80">
          Un aperçu des projets menés aux côtés de nos clients, tous secteurs confondus.
        </p>
      </div>

      <div class="mx-auto mt-10 grid w-full max-w-6xl grid-cols-1 gap-6 px-4 md:grid-cols-2 lg:gap-8">
        <div
          v-for="study in CASE_STUDIES"
          :key="study.name"
          class="relative aspect-video overflow-hidden rounded-3xl"
        >
          <img
            :src="`https://picsum.photos/seed/${study.seed}/800/600`"
            :alt="study.name"
            loading="lazy"
            decoding="async"
            class="absolute inset-0 h-full w-full object-cover"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-[#000066]/90 via-[#000066]/40 to-transparent"
            aria-hidden="true"
          />
          <div class="absolute bottom-0 left-0 p-6">
            <p class="font-display font-bold text-white">{{ study.name }}</p>
            <p class="mt-1 line-clamp-2 text-sm text-white/80">{{ study.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 5 (Leadership) — présentation équipe, cartes 3D massives reprises
         à l'identique de DigitalView.vue (section « equipe ») : mêmes classes
         de perspective/transform/transition, mêmes paliers responsive. -->
    <section
      id="leadership"
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

      <div class="flex w-full justify-center items-end mt-8 mb-8 px-4 md:px-24 2xl:px-28 max-[459px]:hidden">
        <h3 class="font-display font-bold text-3xl md:text-4xl text-accent-700 text-center">Data & IA</h3>
      </div>

      <div class="relative flex w-full flex-1 items-stretch max-[984px]:justify-center min-[985px]:justify-between gap-4 min-[985px]:gap-8 px-4 md:px-24 2xl:px-28 max-[459px]:hidden">
        <!-- Combattant gauche : Robin Rins -->
        <div class="flex w-auto shrink-0 flex-col items-center justify-center min-[630px]:max-[984px]:-translate-x-16">
          <div class="mb-4 max-w-32 text-center min-[985px]:hidden">
            <p class="text-sm font-bold text-primary-950">Robin Rins</p>
            <p class="text-[11px] font-medium text-primary-900/50">Directeur BU Data & IA</p>
            <p class="mt-1 min-h-[72px] text-xs italic leading-snug text-primary-900/80">
              <span class="block">[Citation à venir]</span>
            </p>
          </div>
          <div class="flex flex-col items-center">
            <div
              class="w-32 h-48 min-[985px]:w-48 min-[985px]:h-72 2xl:w-[320px] 2xl:h-[480px] [perspective:1000px] transform-gpu border-0 ring-0 outline-none cursor-pointer"
              role="button"
              tabindex="0"
              aria-label="Retourner la carte de Robin Rins"
              @click="isRRFlipped = !isRRFlipped"
              @keydown.enter="isRRFlipped = !isRRFlipped"
              @keydown.space.prevent="isRRFlipped = !isRRFlipped"
            >
              <div
                class="relative w-full h-full [transform-style:preserve-3d] rounded-2xl shadow-[-40px_20px_50px_-15px_rgba(0,0,50,0.4)] will-change-transform transition-transform duration-700 ease-in-out border-0 ring-0 outline-none"
                :class="isRRFlipped ? '[transform:rotateY(195deg)]' : '[transform:rotateY(15deg)]'"
              >
                <!-- Face avant -->
                <div class="absolute inset-0 h-full w-full backface-hidden antialiased translate-z-[1px] bg-primary-950 rounded-2xl flex items-center justify-center overflow-hidden border-0 border-transparent">
                  <span class="font-display text-3xl min-[985px]:text-5xl 2xl:text-7xl font-extrabold text-white/10 border-0 border-transparent">RR</span>
                </div>
                <!-- Face arrière — basique, prête à accueillir du contenu plus tard. -->
                <div class="absolute inset-0 h-full w-full [transform:rotateY(180deg)] backface-hidden antialiased bg-white border border-gray-200 rounded-2xl overflow-hidden" />
              </div>
            </div>
          </div>
        </div>

        <!-- Citations centrales — permanentes, en diagonale franche. -->
        <div class="hidden min-[985px]:flex flex-1 items-center px-4">
          <div class="relative w-full h-48 min-[985px]:h-72 2xl:h-[480px]">
            <div class="-mt-2 absolute inset-x-0 top-0 w-full px-4 text-left">
              <p class="text-base 2xl:text-2xl font-bold text-primary-950 mb-1">Robin Rins</p>
              <p class="text-sm font-medium text-primary-900/50 mb-2">Directeur BU Data & IA</p>
              <p class="min-h-[100px] 2xl:min-h-[120px] w-full max-w-full overflow-hidden text-xs 2xl:text-lg italic text-primary-900/80 leading-relaxed">
                <span class="block whitespace-normal break-words">[Citation à venir]</span>
              </p>
            </div>
            <div class="-mb-2 absolute inset-x-0 bottom-0 w-full px-4 text-right">
              <p class="text-base 2xl:text-2xl font-bold text-primary-950 mb-1">Lena Lebecq</p>
              <p class="text-sm font-medium text-primary-900/50 mb-2">Responsable RH</p>
              <p class="min-h-[100px] 2xl:min-h-[120px] w-full max-w-full overflow-hidden text-xs 2xl:text-lg italic text-primary-900/80 leading-relaxed">
                <span class="block whitespace-normal break-words">[Citation à venir]</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Combattant droit : Lena Lebecq -->
        <div class="flex w-auto shrink-0 flex-col items-center justify-center min-[630px]:max-[984px]:translate-x-16">
          <div class="flex flex-col items-center">
            <div
              class="w-32 h-48 min-[985px]:w-48 min-[985px]:h-72 2xl:w-[320px] 2xl:h-[480px] [perspective:1000px] transform-gpu border-0 ring-0 outline-none cursor-pointer"
              role="button"
              tabindex="0"
              aria-label="Retourner la carte de Lena Lebecq"
              @click="isLLFlipped = !isLLFlipped"
              @keydown.enter="isLLFlipped = !isLLFlipped"
              @keydown.space.prevent="isLLFlipped = !isLLFlipped"
            >
              <div
                class="relative w-full h-full [transform-style:preserve-3d] rounded-2xl shadow-[40px_20px_50px_-15px_rgba(0,0,50,0.4)] will-change-transform transition-transform duration-700 ease-in-out border-0 ring-0 outline-none"
                :class="isLLFlipped ? '[transform:rotateY(-195deg)]' : '[transform:rotateY(-15deg)]'"
              >
                <!-- Face avant -->
                <div class="absolute inset-0 h-full w-full backface-hidden antialiased translate-z-[1px] bg-primary-950 rounded-2xl flex items-center justify-center overflow-hidden border-0 border-transparent">
                  <span class="font-display text-3xl min-[985px]:text-5xl 2xl:text-7xl font-extrabold text-white/10 border-0 border-transparent">LL</span>
                </div>
                <!-- Face arrière — basique, prête à accueillir du contenu plus tard. -->
                <div class="absolute inset-0 h-full w-full [transform:rotateY(180deg)] backface-hidden antialiased bg-white border border-gray-200 rounded-2xl overflow-hidden" />
              </div>
            </div>
          </div>
          <div class="mt-4 max-w-32 text-center min-[985px]:hidden">
            <p class="text-sm font-bold text-primary-950">Lena Lebecq</p>
            <p class="text-[11px] font-medium text-primary-900/50">Responsable RH</p>
            <p class="mt-1 min-h-[72px] text-xs italic leading-snug text-primary-900/80">
              <span class="block">[Citation à venir]</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Sous 460px, l'arène à deux cartes ne tient plus : les deux profils
           sont empilés statiquement. -->
      <div class="hidden max-[459px]:flex w-full flex-1 flex-col items-center justify-center gap-10 px-4">
        <div class="flex flex-col items-center">
          <div class="flex h-[clamp(200px,40dvh,350px)] w-52 shrink min-h-0 items-center justify-center overflow-hidden rounded-2xl bg-primary-950 [@media(max-height:690px)]:max-h-[25dvh]">
            <span class="font-display text-6xl font-extrabold text-white/10">RR</span>
          </div>
          <div class="mt-4 [@media(max-height:690px)]:mt-2 min-h-[160px] w-full max-w-[18rem] flex flex-col justify-start text-center">
            <p class="text-xl font-bold text-primary-950">Robin Rins</p>
            <p class="text-sm font-medium text-primary-900/50">Directeur BU Data & IA</p>
            <p class="mt-1 text-base italic leading-snug text-primary-900/80 [@media(max-height:690px)]:text-sm [@media(max-height:690px)]:leading-tight">
              <span class="block">[Citation à venir]</span>
            </p>
          </div>
        </div>
        <div class="flex flex-col items-center">
          <div class="flex h-[clamp(200px,40dvh,350px)] w-52 shrink min-h-0 items-center justify-center overflow-hidden rounded-2xl bg-primary-950 [@media(max-height:690px)]:max-h-[25dvh]">
            <span class="font-display text-6xl font-extrabold text-white/10">LL</span>
          </div>
          <div class="mt-4 [@media(max-height:690px)]:mt-2 min-h-[160px] w-full max-w-[18rem] flex flex-col justify-start text-center">
            <p class="text-xl font-bold text-primary-950">Lena Lebecq</p>
            <p class="text-sm font-medium text-primary-900/50">Responsable RH</p>
            <p class="mt-1 text-base italic leading-snug text-primary-900/80 [@media(max-height:690px)]:text-sm [@media(max-height:690px)]:leading-tight">
              <span class="block">[Citation à venir]</span>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 6 (Parlons IA) — en-tête centré + grille de cartes bleu foncé,
         façon « Notre mode d'intervention ». -->
    <section
      id="parlons-ia"
      data-theme="light"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-gray-50 flex flex-col justify-center px-4 py-20 sm:px-6 lg:px-8 xl:px-12"
    >
      <div class="mx-auto max-w-3xl text-center">
        <h2 class="font-display text-4xl font-extrabold text-[#000066] sm:text-5xl">
          Parlons IA
        </h2>
        <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600">
          Des agents conversationnels à l'automatisation des tâches répétitives, les
          possibilités qu'ouvre l'IA pour transformer vos processus sont quasi infinies — à
          condition de les cadrer avec les bons experts.
        </p>
      </div>

      <div class="mx-auto mt-12 grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        <div class="rounded-3xl bg-[#000066] p-8">
          <div class="flex size-12 items-center justify-center rounded-xl bg-white" aria-hidden="true">
            <svg class="size-6 text-[#000066]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 3v2m0 14v2m9-9h-2M5 12H3m14.95-6.95-1.414 1.414M7.464 16.536l-1.414 1.414m0-11.314 1.414 1.414m9.072 9.072 1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8Z"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <p class="mt-5 font-display font-bold text-white">Création d'agents</p>
          <p class="mt-2 text-sm leading-relaxed text-white/80">
            Conception d'assistants sur mesure, connectés à vos données et à vos outils métier,
            pour automatiser les tâches à faible valeur ajoutée.
          </p>
        </div>

        <div class="rounded-3xl bg-[#000066] p-8">
          <div class="flex size-12 items-center justify-center rounded-xl bg-white" aria-hidden="true">
            <svg class="size-6 text-[#000066]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M17 2.1l4 4-4 4M3 12.6v-2a4 4 0 014-4h14M7 21.9l-4-4 4-4M21 11.4v2a4 4 0 01-4 4H3"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <p class="mt-5 font-display font-bold text-white">Amélioration continue</p>
          <p class="mt-2 text-sm leading-relaxed text-white/80">
            Suivi, évaluation et optimisation des solutions déployées pour qu'elles gagnent en
            pertinence au fil des usages réels.
          </p>
        </div>
      </div>

      <div class="mt-12 flex justify-center">
        <RouterLink
          to="/contact-entreprise"
          class="rounded-full bg-[#12D80A] px-8 py-4 font-bold text-white transition-colors hover:bg-accent-400"
        >
          Contacter nos experts
        </RouterLink>
      </div>
    </section>

    <!-- SECTION 7 (Offres) — en-tête centré + grille de 3 cartes « Offre », CTA
         final en dessous. Structure reprise de DigitalView.vue (section
         « offres ») ; fond passé en bleu Faceel-IT comme demandé pour cette
         page (la section source sur Digital est en fond blanc — surtitre en
         accent-500, pas accent-700, et textes en blanc plutôt que gris pour
         rester lisibles sur ce fond sombre). -->
    <section
      id="offres"
      data-theme="dark"
      class="relative h-dvh w-full shrink-0 snap-start snap-always overflow-hidden bg-[#000066] flex flex-col justify-center px-8 py-12 text-center lg:px-24"
    >
      <div>
        <p class="text-sm font-bold uppercase tracking-widest text-accent-500">Surtitre</p>
        <h2 class="mt-2 font-display text-4xl font-extrabold text-white sm:text-5xl">Titre</h2>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-white/80">
          Description générique présentant les offres portées par cette Business Unit.
        </p>
      </div>

      <div class="mx-auto mt-10 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
        <div
          v-for="index in 3"
          :key="index"
          class="flex flex-col rounded-3xl border border-white/10 bg-white p-8 text-left shadow-lg"
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

      <div class="mt-12 flex w-full justify-center">
        <RouterLink
          to="/consulter-nos-offres"
          class="inline-flex items-center gap-2 rounded-full bg-[#12D80A] px-8 py-3 text-lg font-bold text-[#000066] shadow-[0_10px_30px_rgba(18,216,10,0.3)] transition-transform hover:scale-105"
        >
          Découvrez plus d'offres
          <span aria-hidden="true">&rarr;</span>
        </RouterLink>
      </div>
    </section>

    <TheFooter full-page-scroll />
  </div>
</template>

<style scoped>
/* Les 2 paires de logos partenaires (`.partner-pair`) sont toujours dans le
   DOM, basculées par `v-show`/`activeSlide` comme le carrousel photo — mais
   l'alternance ne doit être visible QUE sur la plage mobile compacte ciblée
   plus bas (568–630px de hauteur, en dessous de 767px de largeur). Partout
   ailleurs, on neutralise `v-show` et on force l'affichage simultané des 2
   paires (4 logos ensemble, comportement identique à l'ancienne grille
   statique) via `@media not` — l'exact inverse de la plage compacte. */
@media not all and (max-width: 767px) and (max-height: 630px) {
  #hero .partner-pair {
    display: flex !important;
  }
}

/* Desktop compact (grand écran mais fenêtre basse, ex. 838px de hauteur) :
   les cartes photo du Hero gardent leur `h-[480px]` Tailwind quelle que soit
   la hauteur de la fenêtre dès `xl`, ce qui fait déborder la section sur un
   écran large mais court. `!important` nécessaire pour gagner face aux
   utilitaires Tailwind `h-[480px]`/`xl:h-[480px]`, de même spécificité. */
@media (min-width: 1280px) and (max-height: 900px) {
  .bento-photo-card {
    height: 360px !important;
  }

  /* Le `padding-top` n'est volontairement PAS réduit ici : `#hero` garde son
     `pt-24` Tailwind de base, seul rempart contre le chevauchement avec la
     navbar fixe (`h-16 lg:h-20`, cf. TheMegaMenu/TickerBand) quelle que soit
     la hauteur de la fenêtre. Seul le bas est compacté ; `justify-content`
     recentre le contenu restant dans l'espace disponible sous la navbar. */
  #hero {
    padding-bottom: 1.5rem !important;
    justify-content: center;
  }

  #hero h1 {
    font-size: 2.75rem !important;
    line-height: 1.1 !important;
  }

  /* `.hero-lede`, pas `#hero p` : #hero contient aussi les légendes photo
     et le titre "Partenaires stratégiques" (des <p> eux aussi) — un
     sélecteur générique les aurait décalés/recompactés sans raison. */
  #hero .hero-lede {
    margin-top: 0.75rem !important;
    font-size: 1rem !important;
    line-height: 1.4 !important;
  }

  /* La photo de Lille masquée + `gap: 0` évitent qu'un `gap-8` hérité de
     `xl:gap-8` ne laisse un espace vide / un trait de bordure résiduel
     au-dessus de la carte partenaires une fois la photo retirée — la carte
     partenaires (seule enfant flex visible, déjà `xl:flex-1`) récupère alors
     naturellement toute la hauteur de `.bento-photo-card`. */
  #hero .lille-photo-card {
    display: none !important;
  }

  #hero .col3-stack {
    gap: 0 !important;
  }
}

/* Très faible hauteur (ex. 568px) : la marche précédente (900px) ne suffit
   plus, le contenu déborde encore par le bas. `padding-top: 5rem` reste
   volontairement non réduit à moins que `pt-24` de base — c'est l'exacte
   hauteur de la navbar fixe (`lg:h-20`), le minimum en dessous duquel le
   titre toucherait la navbar. */
@media (min-width: 1280px) and (max-height: 650px) {
  .bento-photo-card {
    height: 260px !important;
  }

  #hero {
    padding-top: 5rem !important;
    padding-bottom: 0.75rem !important;
  }

  #hero h1 {
    font-size: 2.25rem !important;
  }

  #hero .hero-lede {
    font-size: 0.9rem !important;
    margin-top: 0.4rem !important;
  }

  #hero .lille-photo-card {
    display: none !important;
  }

  #hero .col3-stack {
    gap: 0 !important;
  }
}

/* En dessous de `xl` (1280px), les cartes photo ne portent que `.bento-photo-card`
   (pas de variante `xl:h-[...]`) et la photo de Lille est déjà masquée en
   permanence par `hidden xl:block` — donc `.bento-photo-card` suffit seule à
   couvrir le carrousel ET le conteneur colonne 3, sans qu'un sélecteur
   d'attribut sur le nom de classe Tailwind (fragile : il casserait
   silencieusement à la prochaine valeur `h-[...]` changée, comme `h-[300px]`
   déjà obsolète depuis un tour précédent) soit nécessaire. */
@media (max-width: 1279px) and (max-height: 800px) {
  /* Bascule du carrousel hors du positionnement absolu strict sur ce
     format : `.carousel-wrapper` (son conteneur) passe d'une hauteur fixe
     à `auto` + un plancher, et les 2 cartes-slide (`.bento-photo-card`)
     repassent en flux normal (`position:relative`) pour que leur contenu
     participe réellement au calcul de cette hauteur `auto` — ce qu'un
     `absolute inset-0` empêchait. Comme `v-show` ne laisse jamais plus
     d'une slide visible à la fois, repasser en flux normal ne crée aucun
     chevauchement entre les deux. */
  #hero .carousel-wrapper {
    height: 100% !important;
    min-height: 280px !important;
  }

  .bento-photo-card {
    position: relative !important;
    inset: auto !important;
    height: 100% !important;
    min-height: 280px !important;
    padding: 1.5rem !important;
  }

  /* `justify-content: center` centrait le bloc de contenu sur toute la
     hauteur de l'écran, y compris la zone masquée par la navbar fixe, et
     faisait donc remonter le titre derrière elle. `flex-start` + un
     `padding-top` à lui seul suffisamment grand (6rem couvre `lg:h-20`,
     80px, avec marge) garantit que le contenu démarre toujours en aval de
     la navbar et s'empile ensuite naturellement de haut en bas. */
  #hero {
    padding-top: 6rem !important;
    padding-bottom: 1rem !important;
    justify-content: flex-start !important;
  }

  #hero h1 {
    font-size: 2.25rem !important;
  }

  #hero .hero-lede {
    font-size: 0.85rem !important;
    margin-top: 0.25rem !important;
    line-height: 1.3 !important;
  }

  /* `.col3-stack` (parent direct de `.partners-card`) porte aussi la classe
     `.bento-photo-card` : il hérite donc déjà de `height: 100%` (règle
     ci-dessus) et, comme grid-item, s'étire via le comportement par défaut
     de CSS Grid (`align-items: stretch`) pour matcher la hauteur de
     `.carousel-wrapper` sur la même ligne — les deux colonnes ont donc déjà
     la même hauteur de ligne. Ce qui manquait : `.partners-card` elle-même
     (un niveau plus bas) restait en `height: auto`, ne remplissant que son
     propre contenu et laissant un vide sous sa carte jusqu'au bas de
     `.col3-stack`. `height: 100%` la fait remplir cette hauteur déjà
     commune aux deux colonnes — les deux cartes se terminent maintenant au
     même niveau. */
  #hero .partners-card {
    height: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    padding: 1.25rem !important;
  }

  #hero .partners-card p.font-display {
    margin-bottom: 0.75rem !important;
  }
}

/* Mobile / écrans étroits en hauteur réduite : en dessous de `md` (768px),
   `.carousel-wrapper` et `.col3-stack` ne sont plus côte à côte dans la même
   ligne de grille (1 colonne sous `sm`, 2 colonnes entre `sm` et `md`), donc
   empilés verticalement — une hauteur fixe (200px) sur le carrousel pendant
   que la carte partenaires restait en `height: auto` créait un déséquilibre
   visuel entre les deux blocs. Les deux passent maintenant en `height: auto`
   avec le même plancher (`min-height: 210px`), chacun se dimensionnant sur
   son propre contenu tout en partageant un gabarit minimal cohérent.
   `position: relative`/`inset: auto` sur `.bento-photo-card` : nécessaire ici
   aussi (pas seulement dans la media query `max-height: 800px` au-dessus,
   dont la plage ne couvre pas entièrement 568–830px) pour que `height: auto`
   ait un effet réel sur les cartes-slide du carrousel, normalement
   `absolute inset-0`. */
@media (max-width: 767px) and (max-height: 830px) {
  #hero .carousel-wrapper,
  #hero .bento-photo-card {
    position: relative !important;
    inset: auto !important;
    height: auto !important;
    min-height: 210px !important;
  }

  #hero {
    padding-top: 4.5rem !important;
    padding-bottom: 0.75rem !important;
  }

  #hero .mx-auto.grid {
    gap: 1rem !important;
  }

  #hero .partners-card {
    height: auto !important;
    min-height: 210px !important;
    padding: 1.25rem !important;
  }

  #hero .partners-card p.font-display {
    margin-bottom: 0.75rem !important;
  }
}

/* Palier supplémentaire, plus serré, pour les hauteurs mobiles entre 568px
   et 744px : le plancher de 210px de la règle `max-height: 830px`
   ci-dessus reste trop grand sur ce segment. Ce bloc est ajouté APRÈS
   (et non à la place de) celui du dessus — même logique de paliers
   progressifs que côté desktop (`max-height: 900px` puis `max-height:
   650px`) : 745–830px garde le plancher 210px, 568–744px descend à 180px
   via celui-ci, qui l'emporte en cascade (même `!important`, déclaré plus
   loin dans la feuille de style). */
@media (max-width: 767px) and (max-height: 744px) {
  #hero .carousel-wrapper,
  #hero .bento-photo-card {
    position: relative !important;
    inset: auto !important;
    height: 180px !important;
    min-height: 180px !important;
  }

  #hero .partners-card {
    height: auto !important;
    min-height: unset !important;
    padding: 1rem !important;
  }

  #hero {
    padding-top: 4rem !important;
    padding-bottom: 0.5rem !important;
  }

  #hero .mx-auto.grid {
    gap: 0.75rem !important;
  }
}

/* Palier dédié à la symétrie carrousel photo / carte partenaires (568–630px) :
   avec seulement 2 logos affichés à la fois (`.partner-pair`, cf. template
   et règle `@media not` plus haut), le contenu de `.partners-card` est enfin
   assez compact pour lui donner, comme au carrousel, une hauteur FIXE
   identique (plutôt que `height: auto`) sans risque de débordement. */
@media (max-width: 767px) and (max-height: 630px) {
  #hero .carousel-wrapper,
  #hero .bento-photo-card {
    position: relative !important;
    inset: auto !important;
    height: 130px !important;
    min-height: 130px !important;
  }

  #hero .partners-card {
    height: 130px !important;
    min-height: 130px !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
  }
}

/* Dernier palier, pour les hauteurs mobiles extrêmes (ex. 568px) : les
   168–210px de plancher des paliers précédents restent trop grands une
   fois cumulés avec le padding et la typographie de base. */
@media (max-width: 767px) and (max-height: 580px) {
  #hero .carousel-wrapper,
  #hero .bento-photo-card {
    height: 120px !important;
    min-height: 120px !important;
  }

  /* 4.75rem (76px) : au-delà des 64px de la navbar mobile (`h-16`, seul
     palier applicable sous `max-width: 767px`), avec une marge de
     respiration volontaire sous la barre. */
  #hero {
    padding-top: 4.75rem !important;
    padding-bottom: 0.25rem !important;
  }

  #hero .mx-auto.grid {
    gap: 0.5rem !important;
  }

  #hero h1 {
    font-size: 1.75rem !important;
  }

  #hero .hero-lede {
    font-size: 0.75rem !important;
    margin-top: 0.2rem !important;
  }

  #hero .partners-card {
    padding: 0.5rem 0.75rem !important;
  }

  #hero .partners-card p.font-display {
    margin-bottom: 0.25rem !important;
    font-size: 0.85rem !important;
  }
}
</style>
