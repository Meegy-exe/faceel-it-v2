<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import ProfileCard from '@/components/ui/ProfileCard.vue'
import AnimatedBackground from '@/components/ui/AnimatedBackground.vue'
import HighlightCard from '@/components/ui/HighlightCard.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import { useSeo } from '@/composables/useSeo'

/**
 * Page « Notre collectif » : les rôles du collectif (hero disruptif), puis
 * l'annuaire filtrable des membres (carrousel de cartes dépliables).
 *
 * ⚠️ CONTENU DE DÉMONSTRATION À REMPLACER AVANT MISE EN LIGNE
 * Les membres ci-dessous (noms, postes, textes « Mission » et « Profil ») sont
 * des DONNÉES FICTIVES de maquette, explicitement demandées pour valider
 * l'interaction. Aucune ne provient du client. Rien ici ne doit partir en
 * production tel quel : ni les noms, ni les intitulés de poste, ni les
 * effectifs par catégorie. Les portraits sont volontairement absents (la carte
 * retombe sur un monogramme, cf. `ProfileCard.vue`) plutôt que remplis par des
 * visages de banque d'images.
 *
 * TODO  à la livraison des vraies données : déplacer `PROFILES` dans
 * `features/collectif/` (une donnée métier n'a pas vocation à rester dans une
 * vue, cf. règle de dépendance `views/ → features/ → components/ui/`), ou le
 * brancher sur l'API si les membres deviennent une ressource du back.
 */
useSeo({
  title: 'Notre collectif',
  description:
    'Les femmes et les hommes de Faceel-IT, ESN à Wasquehal près de Lille : Staff, BU Digital, Data & IA, Cyber. Des rôles, des missions, un collectif au service des entreprises des Hauts-de-France.',
})

/* -------------------------------------------------------------------------- */
/* Nos valeurs                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Les trois valeurs (contenu de l'ancien site, repris tel que transmis), en
 * données plutôt qu'en balisage répété : les cartes sont strictement
 * identiques à l'habillage près, les écrire à la main trois fois ferait
 * diverger l'une d'elles au premier ajustement.
 */
const VALUES = [
  {
    title: 'Code and Play',
    text: "Nous plaçons les valeurs du sport au cœur de notre collectif : esprit d'équipe, dépassement de soi et respect. Elles guident nos missions IT, renforcent notre cohésion et nourrissent l'excellence que nous visons pour nos clients.",
  },
  {
    title: 'Explore and grow',
    text: 'À travers nos référencements clients et la diversité des projets que nous proposons, nous offrons à nos collaborateurs un véritable parcours de carrière : découvrir de nouveaux environnements, se challenger à travers des évolutions de poste et, pourquoi pas, envisager un changement de métier.',
  },
  {
    title: 'Learn and progress',
    text: "La formation est un levier essentiel de progression. Curiosité, partage et évolution guident nos parcours professionnels. Former, c'est développer les talents, anticiper les transformations du monde IT et construire des équipes prêtes à relever les défis technologiques de demain.",
  },
]

/* -------------------------------------------------------------------------- */
/* Annuaire  catégories et membres                                           */
/* -------------------------------------------------------------------------- */

type CategoryId = 'staff' | 'digital' | 'data-ia' | 'cyber'

const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'staff', label: 'Staff' },
  { id: 'digital', label: 'BU Digital' },
  { id: 'data-ia', label: 'Data & IA' },
  { id: 'cyber', label: 'Cyber' },
]

interface Profile {
  id: string
  name: string
  role: string
  category: CategoryId
  mission: string
  profile: string
  /** Portrait vide tant que le client n'a pas fourni les photos. */
  photo?: string
}

/** ⚠️ Fictif cf. l'avertissement en tête de fichier. */
const PROFILES: Profile[] = [
  {
    id: 'staff-1',
    name: 'Prénom Nom',
    role: 'Direction des opérations',
    category: 'staff',
    mission:
      "Texte de démonstration. Décrit en trois lignes le périmètre du poste : ce dont la personne a la charge au quotidien, et ce que l'interlocuteur peut attendre d'elle.",
    profile:
      "Texte de démonstration. Résume le parcours : formation, années d'expérience, terrains de jeu favoris, et ce qui fait la différence dans sa manière de travailler.",
  },
  {
    id: 'digital-1',
    name: 'Prénom Nom',
    role: 'Lead développeur',
    category: 'digital',
    mission:
      'Texte de démonstration. Décrit le rôle sur les projets applicatifs : architecture, revue de code, accompagnement des équipes côté client.',
    profile:
      'Texte de démonstration. Résume le parcours technique et les technologies de prédilection, ainsi que le rapport à la transmission.',
  },
  {
    id: 'data-ia-1',
    name: 'Prénom Nom',
    role: 'Data scientist',
    category: 'data-ia',
    mission:
      "Texte de démonstration. Décrit le rôle sur les sujets de donnée : cadrage du besoin, mise en production des modèles, mesure de l'impact réel.",
    profile:
      "Texte de démonstration. Résume le parcours et l'appétence pour les sujets d'industrialisation plutôt que de démonstration.",
  },
  {
    id: 'cyber-1',
    name: 'Prénom Nom',
    role: 'Consultant cybersécurité',
    category: 'cyber',
    mission:
      'Texte de démonstration. Décrit le rôle sur les missions de sécurité : audit, remédiation, sensibilisation des équipes internes.',
    profile:
      'Texte de démonstration. Résume le parcours, les certifications et la posture face au risque.',
  },
  {
    id: 'digital-2',
    name: 'Prénom Nom',
    role: 'Développeur front-end',
    category: 'digital',
    mission:
      "Texte de démonstration. Décrit le rôle sur l'interface : accessibilité, performance perçue, cohérence du design system.",
    profile:
      'Texte de démonstration. Résume le parcours et le goût pour le détail qui se voit à un pixel près.',
  },
  {
    id: 'staff-2',
    name: 'Prénom Nom',
    role: 'Talent acquisition',
    category: 'staff',
    mission:
      'Texte de démonstration. Décrit le rôle sur le recrutement : sourcing, entretiens, intégration des nouveaux arrivants.',
    profile:
      "Texte de démonstration. Résume le parcours et la conviction qu'un recrutement réussi se juge au bout d'un an, pas d'une semaine.",
  },
]

const activeCategory = ref<CategoryId>('staff')
const activeProfileId = ref<string | null>(null)

const visibleProfiles = computed(() => PROFILES.filter((p) => p.category === activeCategory.value))

const trackRef = useTemplateRef<HTMLElement>('track')

function selectCategory(id: CategoryId) {
  activeCategory.value = id
  // Une carte ouverte n'a plus de sens dans un jeu de profils qu'on remplace :
  // sans ce reset, la première carte de la nouvelle catégorie hériterait de
  // l'état déplié de la précédente (même position, autre personne).
  activeProfileId.value = null
  // La piste garde sa position de défilement au changement d'onglet : on la
  // ramène au début, sinon la nouvelle catégorie s'ouvre « au milieu ».
  trackRef.value?.scrollTo({ left: 0, behavior: 'smooth' })
}

function toggleProfile(id: string) {
  activeProfileId.value = activeProfileId.value === id ? null : id
}
</script>

<template>
  <!-- Pas de `<main>` ici : la coquille (`App.vue`) le fournit déjà. -->

  <!-- CONTENEUR SNAP OPT-IN : isole le scroll magnétique de cette vue sans
       dépendre de la hauteur flexée de <main> (cf. HomeView.vue). -->
  <div class="h-dvh w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory">
    <!-- ================================================================== -->
    <!-- 1. HERO  titre et description, cartes de rôles retirées (rendu    -->
    <!-- minimaliste).                                                      -->
    <!-- ================================================================== -->
    <section
      data-theme="dark"
      class="relative isolate overflow-hidden bg-primary-900 h-dvh w-full shrink-0 snap-start snap-always flex flex-col justify-center px-6 py-16"
    >
      <AnimatedBackground variant="grid" tone="dark" />

      <div class="mx-auto max-w-6xl">
        <p class="text-eyebrow uppercase text-accent-500">Notre collectif</p>
        <h1 class="mt-4 max-w-3xl font-display text-mega text-balance text-white">
          Un poste ne dit rien.
          <span class="text-accent-500">Un rôle, si.</span>
        </h1>
        <p class="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
          Chez Faceel-IT, chacun porte plusieurs casquettes selon le moment du projet. Voici celles
          qui circulent le plus.
        </p>
      </div>
    </section>

    <!-- ================================================================== -->
    <!-- 2. PRINCIPES « trois principes qui tiennent le collectif ».      -->
    <!-- ================================================================== -->
    <section
      data-theme="light"
      class="bg-white h-dvh w-full shrink-0 snap-start snap-always flex flex-col justify-center px-6 py-16"
    >
      <div class="mx-auto max-w-6xl">
        <p class="text-eyebrow uppercase text-accent-700">Nos valeurs</p>
        <h2 class="mt-4 max-w-2xl font-display text-display text-balance text-primary-900">
          Trois principes qui tiennent le collectif
        </h2>

        <!-- `items-stretch` implicite de `grid` : les trois cartes partagent la
             hauteur de la plus haute, sans hauteur en dur les textes sont de
             longueurs inégales, une hauteur fixe couperait le troisième. -->
        <div class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <HighlightCard
            v-for="(value, index) in VALUES"
            :key="value.title"
            :title="value.title"
            :index="index + 1"
            :heading-level="3"
            tone="light"
            size="md"
          >
            {{ value.text }}
          </HighlightCard>
        </div>
      </div>
    </section>

    <!-- ================================================================== -->
    <!-- 3. ÉQUIPES  « le collectif par équipe ». `min-h-dvh` : tabs +      -->
    <!-- piste de cartes peuvent déborder sur mobile.                       -->
    <!-- ================================================================== -->
    <section
      data-theme="light"
      class="bg-light min-h-dvh w-full shrink-0 snap-start snap-always flex flex-col justify-center px-6 py-16"
    >
      <div class="mx-auto max-w-6xl">
        <h2 class="font-display text-display text-balance text-primary-900">
          Le collectif, par équipe
        </h2>
        <p class="mt-4 max-w-xl text-lg leading-relaxed text-primary-900/65">
          Cliquez sur une carte pour découvrir la mission et le profil de chaque membre.
        </p>

        <!-- Onglets. `role="tablist"` + `aria-selected` plutôt qu'une liste de
             boutons anonymes : un lecteur d'écran annonce alors « onglet 2 sur
             4, sélectionné », ce qui est exactement ce que l'œil perçoit. -->
        <div
          role="tablist"
          aria-label="Filtrer par équipe"
          class="mt-10 inline-flex flex-wrap gap-1 rounded-full bg-white p-1.5 shadow-soft ring-1 ring-primary-900/8"
        >
          <button
            v-for="category in CATEGORIES"
            :key="category.id"
            type="button"
            role="tab"
            :aria-selected="activeCategory === category.id"
            class="cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ease-snap focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary-900 motion-reduce:transition-none"
            :class="
              activeCategory === category.id
                ? 'bg-primary-900 text-white shadow-soft'
                : 'text-primary-900/60 hover:bg-primary-900/5 hover:text-primary-900'
            "
            @click="selectCategory(category.id)"
          >
            {{ category.label }}
          </button>
        </div>

        <!-- `mode="out-in"` : les deux jeux de cartes ne doivent jamais
             coexister dans la piste, sinon celle-ci double de largeur le temps
             du fondu et la barre de défilement saute. La `key` sur la
             catégorie est ce qui déclenche la transition. -->
        <Transition
          enter-active-class="transition-[opacity,transform] duration-400 ease-premium motion-reduce:transition-none"
          leave-active-class="transition-[opacity,transform] duration-200 ease-premium motion-reduce:transition-none"
          enter-from-class="translate-y-4 opacity-0"
          leave-to-class="-translate-y-2 opacity-0"
          mode="out-in"
        >
          <!-- Débordement volontaire de la grille de page (`-mx-6 px-6`) : les
               cartes doivent pouvoir défiler jusqu'au bord de l'écran, sinon
               la piste semble coupée net au milieu du contenu. `py-4` laisse
               respirer les ombres portées, que `overflow-x-auto` rognerait. -->
          <div
            :key="activeCategory"
            ref="track"
            class="hide-scrollbar -mx-6 mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 py-4"
          >
            <ProfileCard
              v-for="profile in visibleProfiles"
              :id="profile.id"
              :key="profile.id"
              :name="profile.name"
              :role="profile.role"
              :mission="profile.mission"
              :profile="profile.profile"
              :photo="profile.photo"
              :expanded="activeProfileId === profile.id"
              @toggle="toggleProfile"
            />
          </div>
        </Transition>
      </div>
    </section>

    <!-- ================================================================== -->
    <!-- 4. FOOTER  repris dans le flux snap local (cf. HomeView.vue) ;     -->
    <!-- App.vue masque son footer global pour cette route pour éviter le   -->
    <!-- doublon.                                                           -->
    <!-- ================================================================== -->
    <section
      data-theme="dark"
      class="h-dvh w-full shrink-0 snap-start snap-always flex flex-col justify-end bg-[#000066]"
    >
      <TheFooter />
    </section>
  </div>
  <!-- /conteneur snap -->
</template>
