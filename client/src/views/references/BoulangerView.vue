<script setup lang="ts">
import { useTemplateRef } from 'vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import { useSeo } from '@/composables/useSeo'
import { scrollRevealClass, useScrollReveal } from '@/composables/useScrollReveal'

useSeo({
  title: 'Boulanger',
  description:
    "Refonte complète de l'application Boulanger pour moderniser l'interface et accompagner le lancement des projets stratégiques.",
})

/** Un reveal par bloc de texte principal (même convention que HomeView) —
 *  chaque conteneur entre en fondu + translate-y au moment où il entre dans
 *  le viewport, pas tous en même temps au montage. */
const heroTextEl = useTemplateRef<HTMLElement>('heroTextEl')
const heroTextReveal = useScrollReveal(heroTextEl)

const s2TextEl = useTemplateRef<HTMLElement>('s2TextEl')
const s2TextReveal = useScrollReveal(s2TextEl)

const s3TextEl = useTemplateRef<HTMLElement>('s3TextEl')
const s3TextReveal = useScrollReveal(s3TextEl)

const s4TextEl = useTemplateRef<HTMLElement>('s4TextEl')
const s4TextReveal = useScrollReveal(s4TextEl)

const s5HeaderEl = useTemplateRef<HTMLElement>('s5HeaderEl')
const s5HeaderReveal = useScrollReveal(s5HeaderEl)

const s6HeaderEl = useTemplateRef<HTMLElement>('s6HeaderEl')
const s6HeaderReveal = useScrollReveal(s6HeaderEl)

const testimonialEl = useTemplateRef<HTMLElement>('testimonialEl')
const testimonialReveal = useScrollReveal(testimonialEl)
</script>

<template>
  <div
    class="h-screen w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth bg-white"
  >
    <!-- 1. Section Hero -->
    <section
      data-theme="light"
      class="relative min-h-screen w-full snap-start snap-always flex items-center bg-[#ff6200] overflow-hidden"
    >
      <!-- Wrapper pleine largeur avec padding gauche minimal (calqué sur l'accueil) -->
      <div
        class="relative z-10 w-full pl-6 md:pl-12 lg:pl-20 pr-4 sm:pr-6 lg:pr-8 flex flex-col lg:flex-row items-center justify-between gap-12"
      >
        <!-- Colonne gauche : Texte forcé à gauche -->
        <div
          ref="heroTextEl"
          class="w-full lg:w-3/5 flex flex-col items-start text-left pt-20 lg:pt-0 shrink-0"
        >
          <h1
            class="font-display text-6xl lg:text-7xl font-medium text-white mb-6"
            :class="scrollRevealClass(heroTextReveal)"
          >
            Boulanger
          </h1>
          <!-- Utilisation de whitespace-nowrap sur desktop pour interdire le retour à la ligne automatique -->
          <p
            class="text-xl lg:text-[22px] text-white font-light leading-relaxed lg:whitespace-nowrap"
            :class="scrollRevealClass(heroTextReveal, 'up', { delayClass: 'delay-150' })"
          >
            Refonte complète de l'application pour moderniser l'interface et accompagner le<br
              class="hidden lg:block"
            />lancement des projets stratégiques.
          </p>
        </div>

        <!-- Colonne droite : Logo Officiel -->
        <div class="w-full lg:w-2/5 flex justify-center lg:justify-end mt-12 lg:mt-0">
          <img
            src="/images/partners/boulanger-white.svg"
            alt="Logo Boulanger"
            class="w-full max-w-[300px] lg:max-w-[450px] xl:max-w-[500px] object-contain drop-shadow-xl"
          />
        </div>
      </div>
    </section>

    <!-- 2. Section Contenu : Réussir la refonte -->
    <section
      data-theme="light"
      class="relative min-h-screen w-full snap-start snap-always flex items-center bg-white overflow-visible"
    >
      <!-- Wrapper pleine largeur avec paddings latéraux proportionnels pour repousser au maximum vers les bords -->
      <div
        class="relative z-10 w-full px-6 md:px-16 lg:px-24 xl:px-32 flex flex-col lg:flex-row items-center justify-between gap-12 xl:gap-20"
      >
        <!-- Colonne gauche : Prend ses 50% complets et aligne son contenu à gauche -->
        <div class="w-full lg:w-1/2 flex flex-col items-start text-left shrink-0">
          <!-- Conteneur interne pour limiter la largeur du texte SANS rétrécir la colonne Flex -->
          <div ref="s2TextEl" class="max-w-[560px]">
            <!-- Mini Logo brut -->
            <a
              href="https://www.boulanger.com"
              target="_blank"
              rel="noopener noreferrer"
              class="mb-8 inline-block transition hover:scale-105"
            >
              <img
                src="/images/partners/boulanger-b.svg"
                alt="Boulanger"
                class="w-12 h-12 lg:w-16 lg:h-16 object-contain"
              />
            </a>

            <h2
              class="font-display text-4xl lg:text-[44px] xl:text-[50px] font-medium text-[#d14600] mb-8 leading-[1.2]"
              :class="scrollRevealClass(s2TextReveal)"
            >
              Réussir la refonte de l'application mobile afin d'élever l'expérience client
            </h2>

            <p
              class="text-[17px] lg:text-[19px] text-primary-950/80 mb-6 leading-relaxed"
              :class="scrollRevealClass(s2TextReveal, 'up', { delayClass: 'delay-150' })"
            >
              Pour y parvenir, l'enseigne avait besoin de renforcer son équipe mobile, et plus
              particulièrement le pôle Android et IOS tout en structurant le projet avec
              l'intervention d'un Business Analyst.
            </p>
            <p
              class="text-[17px] lg:text-[19px] text-primary-950/80 leading-relaxed"
              :class="scrollRevealClass(s2TextReveal, 'up', { delayClass: 'delay-300' })"
            >
              L'objectif était clair : améliorer la qualité globale de l'application, moderniser
              l'interface, fluidifier les parcours utilisateurs et intégrer de nouvelles
              fonctionnalités à forte valeur ajoutée, comme l'<strong>IA conversationnelle</strong>,
              au cœur de l'expérience client.
            </p>
          </div>
        </div>

        <!-- Colonne droite : Prend ses 50% complets et s'aligne à fond à droite -->
        <div
          class="w-full lg:w-1/2 flex justify-end mt-24 lg:mt-0 relative h-[400px] lg:h-[500px] xl:h-[600px]"
        >
          <!-- Fond Orange collé à l'extrémité droite (right-0) -->
          <div
            class="absolute top-1/2 right-0 -translate-y-1/2 w-[320px] h-[260px] sm:w-[400px] sm:h-[300px] lg:w-[480px] lg:h-[380px] xl:w-[550px] xl:h-[440px] bg-[#ff6200] rounded-2xl shadow-lg"
          ></div>

          <!-- Téléphone massif dépassant largement -->
          <img
            src="/images/partners/boulanger/tel.png"
            alt="Application Boulanger"
            class="absolute top-1/2 right-4 lg:right-12 xl:right-16 -translate-y-1/2 z-10 w-[90%] max-w-[260px] sm:max-w-[340px] lg:max-w-[420px] xl:max-w-[500px] object-contain drop-shadow-2xl animate-float motion-reduce:animate-none scale-[1.2] xl:scale-[1.3]"
          />
        </div>
      </div>
    </section>

    <!-- 3. Section Contenu : Valeur ajoutée -->
    <section
      data-theme="light"
      class="relative min-h-screen w-full snap-start snap-always flex items-center bg-[#ff6200] overflow-visible"
    >
      <!-- Wrapper pleine largeur avec paddings latéraux -->
      <div
        class="relative z-10 w-full px-6 md:px-16 lg:px-24 xl:px-32 flex flex-col-reverse lg:flex-row items-center justify-between gap-12 xl:gap-20"
      >
        <!-- Colonne gauche : Visuel parfaitement centré -->
        <div
          class="w-full lg:w-1/2 flex justify-center items-center relative h-[450px] sm:h-[550px] lg:h-[650px] mt-16 lg:mt-0 shrink-0"
        >
          <!-- Fond blanc (Plus large, moins haut pour un effet paysage/carré) -->
          <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[280px] sm:w-[400px] sm:h-[340px] lg:w-[480px] lg:h-[400px] xl:w-[560px] xl:h-[460px] bg-white rounded-2xl shadow-xl"
          ></div>

          <!-- Téléphone beaucoup plus grand pour un dépassement massif -->
          <img
            src="/images/partners/boulanger/tel-front.png"
            alt="Application Boulanger Assistant IA"
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-[260px] sm:max-w-[320px] lg:max-w-[380px] xl:max-w-[460px] object-contain drop-shadow-2xl animate-float motion-reduce:animate-none scale-[1.25] lg:scale-[1.3] xl:scale-[1.35]"
          />
        </div>

        <!-- Colonne droite : Texte contraint en largeur et sans icône -->
        <div
          ref="s3TextEl"
          class="w-full lg:w-1/2 max-w-[680px] flex flex-col items-start text-left text-white shrink-0 lg:-translate-x-24"
        >
          <h2
            class="font-display text-4xl lg:text-[44px] xl:text-[50px] font-medium mb-8 leading-[1.2]"
            :class="scrollRevealClass(s3TextReveal)"
          >
            Un projet à forte valeur ajoutée
          </h2>

          <p
            class="text-[17px] lg:text-[19px] text-white/90 mb-8 leading-relaxed"
            :class="scrollRevealClass(s3TextReveal, 'up', { delayClass: 'delay-150' })"
          >
            Pour ce projet, chaque rôle est essentiel. <strong>Thibaut L.</strong> a assuré le lien
            entre les équipe métiers et les équipes developpeurs. Côté technique,
            <strong>Ali</strong> a porté la double casquette de Tech Lead/Architect et de
            développeur IOS. Il a collaboré étroitement avec <strong>Aurélien</strong> sur cette
            partie, pendant que <strong>Quentin C.</strong> et <strong>Quentin D.</strong> étaient
            sur le développement Android.
          </p>

          <ul
            class="space-y-6 text-[17px] lg:text-[19px] text-white/90 list-disc list-inside marker:text-white"
            :class="scrollRevealClass(s3TextReveal, 'up', { delayClass: 'delay-300' })"
          >
            <li class="leading-relaxed">
              <strong>Architecture KMM &amp; Scalabilité :</strong> Création d'un SDK en utilisant
              Kotlin Multiplatform pour une structure technique robuste, évolutive et une
              maintenance optimisée de vos apps mobiles.
            </li>
            <li class="leading-relaxed">
              <strong>Performance Native (Jetpack &amp; SwiftUI) :</strong> Développement intégral
              du front-end mobile natif pour garantir une navigation fluide, une interface moderne
              et une expérience utilisateur (UX) haut de gamme.
            </li>
            <li class="leading-relaxed">
              <strong>Innovation IA &amp; Agilité :</strong> Intégration d'une IA conversationnelle
              personnalisée pour booster l'engagement, avec un pilotage de projet transparent et
              réactif via Jira.
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 4. Section Contenu : Résultats -->
    <section
      data-theme="light"
      class="relative min-h-screen w-full snap-start snap-always flex items-center bg-white overflow-visible"
    >
      <!-- Wrapper panoramique (strictement identique à la Section 2) -->
      <div
        class="relative z-10 w-full px-6 md:px-16 lg:px-24 xl:px-32 flex flex-col lg:flex-row items-center justify-between gap-12 xl:gap-20"
      >
        <!-- Colonne gauche : Texte contraint -->
        <div class="w-full lg:w-1/2 flex flex-col items-start text-left shrink-0">
          <div ref="s4TextEl" class="max-w-[560px]">
            <!-- Icône circulaire (Graphique) -->
            <div
              class="mb-6 flex items-center justify-center w-12 h-12 bg-[#ff6200] rounded-full shadow-md"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                ></path>
              </svg>
            </div>

            <h2
              class="font-display text-4xl lg:text-[44px] xl:text-[50px] font-medium text-[#d14600] mb-8 leading-[1.2]"
              :class="scrollRevealClass(s4TextReveal)"
            >
              Des résultats plus que satisfaisants
            </h2>

            <p
              class="text-[17px] lg:text-[19px] text-primary-950/80 mb-6 leading-relaxed"
              :class="scrollRevealClass(s4TextReveal, 'up', { delayClass: 'delay-150' })"
            >
              Dans un contexte de haute intensité marqué par le <strong>Black Friday</strong>, nos
              équipes ont relevé le défi de la refonte globale de l'application Boulanger. Ce
              projet, a abouti à une solution performante, qui s'illustre par des résultats
              marquants :
            </p>

            <ul
              class="space-y-4 text-[17px] lg:text-[19px] text-primary-950/80 list-square list-inside marker:text-primary-950"
              :class="scrollRevealClass(s4TextReveal, 'up', { delayClass: 'delay-300' })"
            >
              <li class="leading-relaxed flex items-start">
                <span class="mr-3 mt-2 block w-1.5 h-1.5 bg-primary-950 shrink-0"></span>
                <span>
                  L'application s'est hissée, pour la première fois, dans le
                  <strong>TOP 7 de l'App Store</strong>.
                </span>
              </li>
              <li class="leading-relaxed flex items-start">
                <span class="mr-3 mt-2 block w-1.5 h-1.5 bg-primary-950 shrink-0"></span>
                <span
                  >Un parcours plus fluide et intuitif, largement plébiscité par les retours
                  clients.</span
                >
              </li>
              <li class="leading-relaxed flex items-start">
                <span class="mr-3 mt-2 block w-1.5 h-1.5 bg-primary-950 shrink-0"></span>
                <span
                  >Une stabilité et des performances solides, même durant les pics d'activité
                  majeurs.</span
                >
              </li>
            </ul>
          </div>
        </div>

        <!-- Colonne droite : Forcée à droite pour coller au bord -->
        <div class="w-full lg:w-1/2 flex justify-end mt-16 lg:mt-0">
          <!-- Conteneur de la composition décalée -->
          <div
            class="relative w-[300px] h-[300px] sm:w-[450px] sm:h-[400px] lg:w-[500px] lg:h-[450px] xl:w-[560px] xl:h-[500px]"
          >
            <!-- Fond orange (Ancré en haut à droite) -->
            <div class="absolute top-0 right-0 w-[80%] h-[80%] bg-[#ff6200] shadow-lg"></div>

            <!-- Image (Ancrée en bas à gauche, superposée) -->
            <img
              src="/images/partners/boulanger/people-b.jpg"
              alt="Équipe travaillant sur le projet Boulanger"
              class="absolute bottom-0 left-0 z-10 w-[85%] h-[85%] object-cover shadow-2xl transition-transform hover:scale-[1.02] duration-500"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- 5. Section Contenu : Technologies (Partie 1) -->
    <section
      data-theme="light"
      class="relative min-h-screen w-full flex flex-col justify-center py-24 lg:py-32 bg-[#faf9f6] snap-start snap-always"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <!-- En-tête de section -->
        <div
          ref="s5HeaderEl"
          class="flex flex-col items-center mb-16 lg:mb-24"
          :class="scrollRevealClass(s5HeaderReveal)"
        >
          <h2 class="font-display text-4xl lg:text-5xl font-medium text-[#0b0c10] mb-4 text-center">
            Les technos que nous avons utilisées
          </h2>
          <!-- Ligne verte de soulignement du titre -->
          <div class="w-48 h-1 bg-green-500"></div>
        </div>

        <!-- Grille des technologies (Ligne 1) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
          <!-- Item 1 : Kotlin -->
          <div class="flex flex-col items-center text-center">
            <img
              src="/images/partners/boulanger/techs/kotlin.png"
              alt="Kotlin Multiplatform"
              class="h-32 lg:h-44 object-contain mb-8 drop-shadow-sm"
            />
            <h3 class="text-xl lg:text-2xl font-bold text-[#0b0c10] mb-2">Kotlin Multiplatform</h3>
            <div class="w-12 h-[3px] bg-green-500 mb-4"></div>
            <p class="text-[16px] lg:text-[17px] text-primary-950/80 leading-relaxed">
              Permet de mutualiser la logique métier entre iOS et Android tout en conservant des
              performances et des interfaces natives.
            </p>
          </div>

          <!-- Item 2 : Swift UI -->
          <div class="flex flex-col items-center text-center">
            <img
              src="/images/partners/boulanger/techs/swift.png"
              alt="Swift UI"
              class="h-32 lg:h-44 object-contain mb-8 drop-shadow-sm"
            />
            <h3 class="text-xl lg:text-2xl font-bold text-[#0b0c10] mb-2">Swift UI</h3>
            <div class="w-12 h-[3px] bg-green-500 mb-4"></div>
            <p class="text-[16px] lg:text-[17px] text-primary-950/80 leading-relaxed">
              L'outil d'Apple pour concevoir des interfaces iOS modernes, déclaratives et
              parfaitement intégrées à l'écosystème.
            </p>
          </div>

          <!-- Item 3 : Jetpack Compose -->
          <div class="flex flex-col items-center text-center">
            <img
              src="/images/partners/boulanger/techs/jetpack.png"
              alt="Jetpack Compose"
              class="h-32 lg:h-44 object-contain mb-8 drop-shadow-sm"
            />
            <h3 class="text-xl lg:text-2xl font-bold text-[#0b0c10] mb-2">Jetpack compose</h3>
            <div class="w-12 h-[3px] bg-green-500 mb-4"></div>
            <p class="text-[16px] lg:text-[17px] text-primary-950/80 leading-relaxed">
              Le framework moderne de Google pour créer des interfaces Android fluides et réactives
              avec moins de code.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. Section Contenu : Technologies (Partie 2) -->
    <section
      data-theme="light"
      class="relative min-h-screen w-full flex flex-col justify-center py-24 lg:py-32 bg-[#faf9f6] snap-start snap-always"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <!-- En-tête de section (répété) -->
        <div
          ref="s6HeaderEl"
          class="flex flex-col items-center mb-16 lg:mb-24"
          :class="scrollRevealClass(s6HeaderReveal)"
        >
          <h2 class="font-display text-4xl lg:text-5xl font-medium text-[#0b0c10] mb-4 text-center">
            Les technos que nous avons utilisées
          </h2>
          <div class="w-48 h-1 bg-green-500"></div>
        </div>

        <!-- Grille des technologies (Ligne 2) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
          <!-- Item 4 : SpringBoot -->
          <div class="flex flex-col items-center text-center">
            <img
              src="/images/partners/boulanger/techs/spring.png"
              alt="Java SpringBoot"
              class="h-32 lg:h-44 object-contain mb-8 drop-shadow-sm"
            />
            <h3 class="text-xl lg:text-2xl font-bold text-[#0b0c10] mb-2">Java SpringBoot</h3>
            <div class="w-12 h-[3px] bg-green-500 mb-4"></div>
            <p class="text-[16px] lg:text-[17px] text-primary-950/80 leading-relaxed">
              La solution de référence pour bâtir des architectures backend puissantes, sécurisées
              et évolutives.
            </p>
          </div>

          <!-- Item 5 : Jira -->
          <div class="flex flex-col items-center text-center">
            <img
              src="/images/partners/boulanger/techs/jira.png"
              alt="Jira"
              class="h-32 lg:h-44 object-contain mb-8 drop-shadow-sm"
            />
            <h3 class="text-xl lg:text-2xl font-bold text-[#0b0c10] mb-2">Jira</h3>
            <div class="w-12 h-[3px] bg-green-500 mb-4"></div>
            <p class="text-[16px] lg:text-[17px] text-primary-950/80 leading-relaxed">
              L'outil incontournable pour le pilotage de projet agile, garantissant un suivi
              transparent et une collaboration efficace de l'équipe.
            </p>
          </div>

          <!-- Item 6 : GraphQL -->
          <div class="flex flex-col items-center text-center">
            <img
              src="/images/partners/boulanger/techs/graphql.png"
              alt="GraphQL"
              class="h-32 lg:h-44 object-contain mb-8 drop-shadow-sm"
            />
            <h3 class="text-xl lg:text-2xl font-bold text-[#0b0c10] mb-2">GraphQL</h3>
            <div class="w-12 h-[3px] bg-green-500 mb-4"></div>
            <p class="text-[16px] lg:text-[17px] text-primary-950/80 leading-relaxed">
              Langage de requête qui permet aux applications de demander les données dont elles ont
              besoin, améliorant ainsi l'efficacité et la rapidité des échanges.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. Section Témoignage -->
    <section
      data-theme="light"
      class="relative min-h-screen w-full snap-start snap-always flex flex-col items-center justify-center bg-[#ff6200] px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <h2
        class="font-display text-3xl md:text-4xl font-bold text-white text-center mb-8 md:mb-12"
        :class="scrollRevealClass(testimonialReveal)"
      >
        Le retour de l’équipe
      </h2>

      <!-- Carte blanche centrale -->
      <div
        ref="testimonialEl"
        class="relative z-10 w-full max-w-3xl bg-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl flex flex-col items-start"
        :class="scrollRevealClass(testimonialReveal, 'up', { delayClass: 'delay-150' })"
      >
        <!-- En-tête de la carte : Avatar + Nom / Rôle -->
        <div class="flex items-center gap-4 mb-8">
          <img
            src="/images/partners/boulanger/quentin.jpeg"
            alt="Quentin C."
            class="w-16 h-16 rounded-full object-cover shadow-md"
          />
          <div class="flex flex-col text-left">
            <h3 class="text-xl font-bold text-primary-950">Quentin C.</h3>
            <p class="text-sm lg:text-base text-primary-950/60 font-medium">Développeur Android</p>
          </div>
        </div>

        <!-- Citation -->
        <blockquote
          class="text-lg sm:text-xl lg:text-2xl text-primary-950/90 font-normal leading-relaxed text-left"
        >
          "Travailler sur ce projet a été une belle expérience, aussi challengeante que valorisante.
          Cela m'a permis une réelle montée en compétences dans un environnement bienveillant et
          stimulant."
        </blockquote>
      </div>
    </section>

    <!-- 7. Footer, conteneur final verrouille en hauteur ecran -->
    <!-- bloc bleu en flex-1 pousse deja le footer en bas -->
    <section
      data-theme="dark"
      class="relative h-dvh w-full shrink-0 snap-start snap-always flex flex-col bg-white"
    >
      <TheFooter />
    </section>
  </div>
</template>

<style scoped>
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
  100% {
    transform: translateY(0px);
  }
}
.animate-float {
  animation: float 4s ease-in-out infinite;
}
</style>
