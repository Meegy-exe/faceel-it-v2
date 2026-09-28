import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type UserRole = 'candidat' | 'admin' | 'super-admin'

/**
 * Authentification simulée (pas de backend d'auth pour l'instant, cf.
 * `docs/DECISIONS.md`) : état en mémoire uniquement, réinitialisé à chaque
 * rechargement de page.
 *
 * Le rôle est déduit de l'email saisi (mock RBAC) :
 *   superadmin@faceel-it.com → super-admin
 *   admin@faceel-it.com      → admin
 *   tout autre email / appel sans email (back-office mock) → admin
 *   email quelconque front-office → candidat
 */
export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const role = ref<UserRole>('candidat')

  function login(email = '') {
    isAuthenticated.value = true
    if (email === 'superadmin@faceel-it.com') {
      role.value = 'super-admin'
    } else if (email === 'admin@faceel-it.com' || email === '') {
      role.value = 'admin'
    } else {
      role.value = 'candidat'
    }
  }

  function logout() {
    isAuthenticated.value = false
    role.value = 'candidat'
  }

  const isCandidate = computed(() => isAuthenticated.value && role.value === 'candidat')
  const isAdmin = computed(
    () => isAuthenticated.value && (role.value === 'admin' || role.value === 'super-admin'),
  )
  const isSuperAdmin = computed(() => isAuthenticated.value && role.value === 'super-admin')

  return { isAuthenticated, role, isCandidate, isAdmin, isSuperAdmin, login, logout }
})
