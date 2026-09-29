<script setup lang="ts">
const BUS = [
  {
    slug: 'web-mobile',
    label: 'Web & Mobile',
    bg: 'from-blue-900 to-blue-700',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    slug: 'data-ia',
    label: 'Data & IA',
    bg: 'from-indigo-900 to-indigo-700',
    icon: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18',
  },
  {
    slug: 'devops-cloud',
    label: 'DevOps & Cloud',
    bg: 'from-sky-900 to-sky-700',
    icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
  },
  {
    slug: 'conseil',
    label: 'Conseil & Management',
    bg: 'from-violet-900 to-violet-700',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  },
]
</script>

<template>
  <section
    id="business-units"
    data-theme="light"
    class="h-full w-full snap-start snap-always flex flex-col justify-center bg-light px-4 py-16 sm:px-6 lg:px-8 xl:px-12"
  >
    <div class="mx-auto w-full max-w-6xl">
      <div class="mb-12 text-center">
        <p class="text-eyebrow uppercase text-accent-700">Notre organisation</p>
        <h2 class="mt-4 font-display text-display text-balance text-primary-900">
          Nos Business Units
        </h2>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="bu in BUS"
          :key="bu.slug"
          class="group relative overflow-hidden rounded-2xl shadow-soft"
        >
          <!-- Fond dégradé simulant l'image -->
          <div
            class="h-48 w-full bg-gradient-to-br transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none"
            :class="bu.bg"
            aria-hidden="true"
          >
            <div class="flex h-full items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                class="size-16 text-white/20"
                stroke="currentColor"
                stroke-width="1"
                aria-hidden="true"
              >
                <path :d="bu.icon" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>

          <div class="bg-white p-5">
            <h3 class="font-display text-base font-bold text-primary-900">{{ bu.label }}</h3>
            <div class="mt-2 h-0.5 w-8 rounded-full bg-[#12D80A] transition-all duration-300 group-hover:w-16 motion-reduce:transition-none" />
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
