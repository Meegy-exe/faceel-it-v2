<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const auth = useAuthStore()
const router = useRouter()

const navItems = [
  { label: 'Dashboard', to: { name: 'admin-dashboard' } },
  { label: 'Événements', to: { name: 'admin-events' } },
  { label: 'Afterworks', to: { name: 'admin-afterworks' } },
  { label: 'Blog', to: { name: 'admin-blog' } },
  { label: "Cas d'usage", to: { name: 'admin-cas-usage' } },
  { label: "Offres d'emploi", to: { name: 'admin-offres' } },
]

function handleLogout() {
  auth.logout()
  router.push({ name: 'admin-login' })
}
</script>

<template>
  <div data-theme="dark" class="flex min-h-dvh bg-primary-900 text-white">
    <aside class="flex w-64 shrink-0 flex-col border-r border-white/10 bg-primary-950 p-6">
      <p class="font-display text-lg font-bold text-white">Faceel-IT Admin</p>

      <nav class="mt-8 flex flex-1 flex-col gap-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.label"
          :to="item.to"
          class="rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
          active-class="bg-white/10 text-white"
        >
          {{ item.label }}
        </RouterLink>

        <div v-if="auth.isSuperAdmin" class="mt-4 border-t border-white/10 pt-4">
          <p class="mb-1 px-3 text-xs font-semibold uppercase tracking-widest text-white/30">
            Super-Admin
          </p>
          <RouterLink
            :to="{ name: 'admin-dashboard' }"
            class="rounded-lg px-3 py-2 text-sm text-accent-500/80 transition hover:bg-white/5 hover:text-accent-500"
            active-class="bg-white/10 text-accent-500"
          >
            Gestion de l'équipe
          </RouterLink>
        </div>
      </nav>
    </aside>

    <div class="flex flex-1 flex-col">
      <header class="flex h-16 items-center justify-between border-b border-white/10 px-6">
        <p class="text-sm text-white/60">Back-office</p>
        <button
          type="button"
          class="text-sm text-white/60 transition hover:text-white"
          @click="handleLogout"
        >
          Se déconnecter
        </button>
      </header>

      <main class="flex-1 p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
