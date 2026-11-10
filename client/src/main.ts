import { createApp } from './app'

// Désactive la restauration native du scroll - ViteSSG/Vue Router reprend
// la main via scrollBehavior, sinon le navigateur force le snap sur la
// deuxième section après un rechargement (F5).
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

async function bootstrap() {
  // Les mocks MSW permettent au front d'avancer sans backend disponible.
  // Le code est éliminé du bundle de production par tree-shaking, et
  // `import.meta.env.SSR` exclut cette branche du rendu statique côté Node
  // (aucun `navigator`/`ServiceWorker` là-bas).
  if (!import.meta.env.SSR && import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS === 'true') {
    const { worker } = await import('./mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }

  // `createApp()` (fabriqué par `ViteSSG` dans `app.ts`) monte lui-même
  // l'application dans le navigateur une fois prête - aucun `app.mount()`
  // à rappeler ici, à la différence de l'ancien bootstrap manuel.
  await createApp()
}

void bootstrap()
