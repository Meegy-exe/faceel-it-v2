<template>
  <section
    id="localisation"
    data-theme="dark"
    class="h-full w-full snap-start snap-always flex flex-col justify-center bg-[#000066] px-4 py-16 sm:px-6 lg:px-8 xl:px-12"
  >
    <div class="mx-auto w-full max-w-6xl">
      <div class="mb-12 text-center">
        <p class="text-eyebrow uppercase text-accent-500">Présence locale</p>
        <h2 class="mt-4 font-display text-display text-balance text-white">Où nous trouver</h2>
      </div>

      <div class="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:gap-16">

        <!-- SVG carte stylisée Hauts-de-France -->
        <div class="relative flex shrink-0 items-center justify-center">
          <svg
            viewBox="0 0 320 280"
            class="h-64 w-auto lg:h-80"
            aria-hidden="true"
          >
            <!-- Fond de région simplifié -->
            <path
              d="M60 20 L80 15 L120 10 L160 18 L200 12 L240 20 L270 35 L280 60 L275 90 L260 120 L270 150 L265 180 L250 210 L230 240 L200 260 L170 265 L140 260 L110 250 L85 235 L70 210 L55 185 L45 160 L40 130 L38 100 L45 70 L55 45 Z"
              fill="#000080"
              stroke="#0000aa"
              stroke-width="1.5"
            />
            <!-- Routes stylisées -->
            <line x1="155" y1="40" x2="155" y2="240" stroke="#0000cc" stroke-width="1" opacity="0.4" />
            <line x1="60" y1="135" x2="260" y2="135" stroke="#0000cc" stroke-width="1" opacity="0.4" />
            <line x1="90" y1="60" x2="230" y2="210" stroke="#0000cc" stroke-width="0.8" opacity="0.3" />
            <!-- Label région -->
            <text x="155" y="85" text-anchor="middle" fill="white" fill-opacity="0.25" font-size="11" font-family="sans-serif" font-weight="bold" letter-spacing="2">HAUTS-DE-FRANCE</text>

            <!-- Marqueur Lille -->
            <!-- Cercle externe pulsé (animation CSS) -->
            <circle cx="148" cy="115" r="14" fill="#12D80A" fill-opacity="0.15" class="ping-ring" />
            <!-- Cercle intermédiaire -->
            <circle cx="148" cy="115" r="9" fill="#12D80A" fill-opacity="0.25" />
            <!-- Point central -->
            <circle cx="148" cy="115" r="5" fill="#12D80A" />
            <!-- Label Lille -->
            <text x="162" y="119" fill="white" font-size="11" font-family="sans-serif" font-weight="bold">Lille</text>
          </svg>
        </div>

        <!-- Informations d'adresse -->
        <div class="flex flex-col gap-6">
          <div>
            <h3 class="font-display text-xl font-bold text-white">Faceel IT — Siège social</h3>
            <p class="mt-1 text-sm text-white/50">Hauts-de-France · Métropole Lilloise</p>
          </div>

          <div class="flex flex-col gap-4">
            <div class="flex items-start gap-3">
              <svg viewBox="0 0 20 20" fill="none" class="mt-0.5 size-5 shrink-0 text-[#12D80A]" aria-hidden="true">
                <path d="M10 2a6 6 0 016 6c0 4-6 10-6 10S4 12 4 8a6 6 0 016-6z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <circle cx="10" cy="8" r="2" stroke="currentColor" stroke-width="1.5" />
              </svg>
              <div>
                <p class="text-sm font-semibold text-white">Adresse</p>
                <p class="text-sm text-white/60">Métropole Lilloise, 59000 Lille</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <svg viewBox="0 0 20 20" fill="none" class="mt-0.5 size-5 shrink-0 text-[#12D80A]" aria-hidden="true">
                <path d="M2 5a2 2 0 012-2h4l2 4-2.5 1.5a11 11 0 005 5L14 11l4 2v4a2 2 0 01-2 2A16 16 0 012 5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div>
                <p class="text-sm font-semibold text-white">Contact</p>
                <p class="text-sm text-white/60">contact@faceel-it.com</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <svg viewBox="0 0 20 20" fill="none" class="mt-0.5 size-5 shrink-0 text-[#12D80A]" aria-hidden="true">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-12v4l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div>
                <p class="text-sm font-semibold text-white">Horaires</p>
                <p class="text-sm text-white/60">Lun–Ven, 9h–18h</p>
              </div>
            </div>
          </div>

          <!-- Pastille statut -->
          <div class="flex items-center gap-2 pt-2">
            <span class="relative flex size-2.5">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#12D80A] opacity-75 motion-reduce:animate-none" />
              <span class="relative inline-flex size-2.5 rounded-full bg-[#12D80A]" />
            </span>
            <span class="text-xs text-white/50">Équipe disponible en régie ou au bureau</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .ping-ring {
    animation: map-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
    transform-origin: 148px 115px;
  }
  @keyframes map-ping {
    0%, 100% { transform: scale(1); opacity: 0.15; }
    50% { transform: scale(1.8); opacity: 0; }
  }
}
</style>
