import { defineStore } from 'pinia'
import { ref } from 'vue'

export type UserProfileType = 'candidat' | 'entreprise' | 'curieux'

const PROFILE_STORAGE_KEY = 'faceel_user_profile'

/**
 * Profil utilisateur (onboarding) — extrait de `App.vue` pour que d'autres
 * vues/composants (ex. `HomeView.vue`, la navigation) puissent y réagir sans
 * dépendre d'un state local à la coquille. `localStorage` n'est lu/écrit que
 * depuis `hydrate()`/`setProfile()`/`resetProfile()`, jamais à la création du
 * store : celle-ci peut survenir côté serveur (vite-ssg), où `localStorage`
 * n'existe pas.
 */
export const useProfileStore = defineStore('profile', () => {
  const showSelector = ref(false)
  const animatingSelection = ref<UserProfileType | null>(null)
  /** Pilote l'affichage conditionnel des CTA de la navbar et, désormais, de
   *  la navigation et des sections de l'accueil propres au profil. */
  const profile = ref<UserProfileType | null>(null)

  /** À appeler depuis `onMounted` (cf. `App.vue`) : lecture `localStorage`
   *  différée au montage client, jamais à l'exécution du store. */
  function hydrate() {
    if (!localStorage.getItem(PROFILE_STORAGE_KEY)) showSelector.value = true
    profile.value = (localStorage.getItem(PROFILE_STORAGE_KEY) as UserProfileType | null) || 'curieux'
  }

  function setProfile(profileType: UserProfileType) {
    animatingSelection.value = profileType
    setTimeout(() => {
      localStorage.setItem(PROFILE_STORAGE_KEY, profileType)
      showSelector.value = false
      profile.value = profileType
    }, 800)
  }

  /** État possédé localement (pas de backend) : on le remet à zéro
   *  directement plutôt que de recharger la page. */
  function resetProfile() {
    localStorage.removeItem(PROFILE_STORAGE_KEY)
    animatingSelection.value = null
    showSelector.value = true
    profile.value = null
  }

  return { profile, showSelector, animatingSelection, hydrate, setProfile, resetProfile }
})
