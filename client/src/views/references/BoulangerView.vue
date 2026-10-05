<script setup lang="ts">
import TheFooter from '@/components/layout/TheFooter.vue'
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: 'Boulanger',
  description:
    "Refonte complète de l'application Boulanger pour moderniser l'interface et accompagner le lancement des projets stratégiques.",
})

interface TechItem {
  name: string
  description: string
}

const TECHS: TechItem[] = [
  {
    name: 'Kotlin Multiplatform',
    description:
      'Permet de mutualiser la logique métier entre iOS et Android tout en conservant des performances et des interfaces natives.',
  },
  {
    name: 'Swift UI',
    description:
      "L'outil d'Apple pour concevoir des interfaces iOS modernes, déclaratives et parfaitement intégrées à l'écosystème.",
  },
  {
    name: 'Jetpack Compose',
    description:
      'Le framework moderne de Google pour créer des interfaces Android fluides et réactives avec moins de code.',
  },
  {
    name: 'Java SpringBoot',
    description:
      'La solution de référence pour bâtir des architectures backend puissantes, sécurisées et évolutives.',
  },
  {
    name: 'Jira',
    description: 'Outil de pilotage de projet transparent et réactif pour un suivi agile.',
  },
  {
    name: 'GraphQL',
    description:
      "Langage de requête qui permet aux applications de demander les données dont elles ont besoin, améliorant ainsi l'efficacité.",
  },
]
</script>

<template>
  <div class="h-screen w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth bg-white">
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
        <div class="w-full lg:w-3/5 flex flex-col items-start text-left pt-20 lg:pt-0 shrink-0">
          <h1 class="font-display text-6xl lg:text-7xl font-medium text-white mb-6">
            Boulanger
          </h1>
          <!-- Utilisation de whitespace-nowrap sur desktop pour interdire le retour à la ligne automatique -->
          <p class="text-xl lg:text-[22px] text-white font-light leading-relaxed lg:whitespace-nowrap">
            Refonte complète de l'application pour moderniser l'interface et accompagner
            le<br class="hidden lg:block" />lancement des projets stratégiques.
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
          <div class="max-w-[560px]">
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

            <h2 class="font-display text-4xl lg:text-[44px] xl:text-[50px] font-medium text-[#d14600] mb-8 leading-[1.2]">
              Réussir la refonte de l'application mobile afin d'élever l'expérience client
            </h2>

            <p class="text-[17px] lg:text-[19px] text-primary-950/80 mb-6 leading-relaxed">
              Pour y parvenir, l'enseigne avait besoin de renforcer son équipe mobile, et plus
              particulièrement le pôle Android et IOS tout en structurant le projet avec
              l'intervention d'un Business Analyst.
            </p>
            <p class="text-[17px] lg:text-[19px] text-primary-950/80 leading-relaxed">
              L'objectif était clair : améliorer la qualité globale de l'application, moderniser
              l'interface, fluidifier les parcours utilisateurs et intégrer de nouvelles
              fonctionnalités à forte valeur ajoutée, comme l'<strong>IA conversationnelle</strong>,
              au cœur de l'expérience client.
            </p>
          </div>
        </div>

        <!-- Colonne droite : Prend ses 50% complets et s'aligne à fond à droite -->
        <div class="w-full lg:w-1/2 flex justify-end mt-24 lg:mt-0 relative h-[400px] lg:h-[500px] xl:h-[600px]">
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
      class="relative min-h-screen w-full snap-start snap-always flex items-center justify-center bg-primary-50 px-4 py-20"
    >
      <div class="max-w-5xl mx-auto">
        <h2 class="text-4xl font-bold text-primary-950 mb-8 text-center">
          Un projet à forte valeur ajoutée
        </h2>
        <p class="text-lg text-primary-900/80 mb-10 text-center max-w-3xl mx-auto">
          Pour ce projet, chaque rôle est essentiel. <strong>Thibaut L.</strong> a assuré le lien
          entre les équipe métiers et les équipes developpeurs. Côté technique,
          <strong>Ali</strong> a porté la double casquette de Tech Lead/Architect et de
          développeur IOS. Il a collaboré étroitement avec <strong>Aurélien</strong> sur cette
          partie, pendant que <strong>Quentin C. et Quentin D.</strong> étaient sur le
          développement Android.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-primary-100">
            <h3 class="text-xl font-bold text-[#d14600] mb-4">Architecture KMM &amp; Scalabilité</h3>
            <p class="text-primary-900/70">
              Création d'un SDK en utilisant <strong>Kotlin Multiplatform</strong> pour une
              structure technique robuste, évolutive et une maintenance optimisée de vos apps
              mobiles.
            </p>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-primary-100">
            <h3 class="text-xl font-bold text-[#d14600] mb-4">Performance Native</h3>
            <p class="text-primary-900/70">
              Développement intégral du <strong>front-end mobile</strong> natif (Jetpack &amp;
              SwiftUI) pour garantir une navigation fluide, une interface moderne et une
              expérience (UX) haut de gamme.
            </p>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-primary-100">
            <h3 class="text-xl font-bold text-[#d14600] mb-4">Innovation IA &amp; Agilité</h3>
            <p class="text-primary-900/70">
              Intégration d'une <strong>IA conversationnelle</strong> personnalisée pour booster
              l'engagement, avec un pilotage de projet transparent et réactif via
              <strong>Jira</strong>.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Section Contenu : Résultats -->
    <section
      data-theme="light"
      class="relative min-h-screen w-full snap-start snap-always flex items-center justify-center bg-white px-4 py-20"
    >
      <div class="max-w-4xl mx-auto">
        <h2 class="text-4xl font-bold text-[#d14600] mb-8 text-center">
          Des résultats plus que satisfaisants
        </h2>
        <p class="text-lg text-primary-900/80 mb-8 text-center">
          Dans un contexte de haute intensité marqué par le <strong>Black Friday</strong>, nos
          équipes ont relevé le défi de la refonte globale de l'application Boulanger. Ce projet
          a abouti à une solution performante, qui s'illustre par des résultats marquants :
        </p>
        <ul class="space-y-4 text-lg text-primary-900/80 list-disc list-inside bg-primary-50 p-8 rounded-2xl">
          <li>
            L'application s'est hissée, pour la première fois, dans le
            <strong>TOP 7 de l'App Store</strong>.
          </li>
          <li>Un parcours plus fluide et intuitif, largement plébiscité par les retours clients.</li>
          <li>Une stabilité et des performances solides, même durant les pics d'activité majeurs.</li>
        </ul>
      </div>
    </section>

    <!-- 5. Section Technologies -->
    <section
      data-theme="light"
      class="relative min-h-screen w-full snap-start snap-always flex items-center justify-center bg-primary-950 px-4 py-20 text-white"
    >
      <div class="max-w-7xl mx-auto w-full">
        <h2 class="text-4xl font-bold text-center mb-16">Les technos que nous avons utilisées</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-12 text-center">
          <div v-for="tech in TECHS" :key="tech.name" class="flex flex-col items-center">
            <span
              aria-hidden="true"
              class="flex size-24 items-center justify-center mb-6 rounded-2xl bg-white font-display text-3xl font-black text-primary-950"
            >
              {{ tech.name.charAt(0) }}
            </span>
            <h4 class="text-2xl font-bold mb-4 text-accent-500">{{ tech.name }}</h4>
            <p class="text-white/70">{{ tech.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. Section Témoignage -->
    <section
      data-theme="light"
      class="relative min-h-screen w-full snap-start snap-always flex items-center justify-center bg-[#ff6200] px-4 py-20"
    >
      <div class="max-w-4xl mx-auto text-center">
        <blockquote class="text-3xl md:text-4xl font-bold text-white leading-tight mb-8">
          "Travailler sur ce projet a été une belle expérience, aussi challengeante que
          valorisante. Cela m'a permis une réelle montée en compétences dans un environnement
          bienveillant et stimulant."
        </blockquote>
        <div class="flex flex-col items-center">
          <span
            aria-hidden="true"
            class="flex size-20 items-center justify-center rounded-full bg-white/20 mb-4 font-display text-2xl font-bold text-white"
          >
            QC
          </span>
          <cite class="text-xl font-bold text-white not-italic">Quentin C.</cite>
          <span class="text-white/80">Développeur Android</span>
        </div>
      </div>
    </section>

    <!-- 7. Section CTA -->
    <section
      data-theme="light"
      class="relative min-h-screen w-full snap-start snap-always flex flex-col items-center justify-center bg-primary-950 px-4 py-20 text-center"
    >
      <h2 class="text-5xl font-bold text-white mb-8">Besoin d'un accompagnement ?</h2>
      <a
        href="https://13hmfhd3s9d.typeform.com/to/Zt4txO6V"
        target="_blank"
        rel="noopener noreferrer"
        class="rounded-full bg-accent-500 px-8 py-4 text-lg font-bold text-primary-950 transition hover:bg-accent-400"
      >
        Contactez-nous
      </a>
    </section>

    <!-- 8. Footer -->
    <section data-theme="dark" class="w-full snap-start snap-always">
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
