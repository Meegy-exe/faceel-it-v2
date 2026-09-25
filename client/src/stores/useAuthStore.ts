import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Authentification simulée (pas de backend d'auth pour l'instant, cf.
 * `docs/DECISIONS.md`) : état en mémoire uniquement, réinitialisé à chaque
 * rechargement de page.
 */
export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)

  function login() {
    isAuthenticated.value = true
  }

  function logout() {
    isAuthenticated.value = false
  }

  return { isAuthenticated, login, logout }
})
