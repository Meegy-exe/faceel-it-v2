// @vitest-environment jsdom
// Déclaré ici plutôt qu'en configuration : c'est le seul test qui a besoin
// d'un DOM, inutile d'imposer jsdom à toute la suite.

import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
// Sous-chemin `/client`, pas la racine du paquet : `@unhead/vue@2` n'expose
// `createHead` que par environnement (`/client` en navigateur, `/server` en
// SSR — c'est ce que `vite-ssg` utilise lui-même en interne). La racine du
// paquet n'exporte que le noyau agnostique (`createUnhead`/`createHeadCore`).
import { createHead } from '@unhead/vue/client'
import { createRouter, createWebHistory } from 'vue-router'
import { useSeo } from './useSeo'

/**
 * Les balises de tête sont le seul livrable du site qu'aucune relecture
 * visuelle ne peut valider : elles ne s'affichent nulle part. D'où ce test.
 */
describe('useSeo', () => {
  async function renderWith(seo: Parameters<typeof useSeo>[0], path = '/') {
    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }],
    })
    await router.push(path)
    await router.isReady()

    const Probe = defineComponent({
      setup() {
        useSeo(seo)
        return () => h('div')
      },
    })

    mount(Probe, { global: { plugins: [router, createHead()] } })

    // unhead écrit dans le DOM de façon différée, pas au tick de Vue.
    await new Promise((resolve) => setTimeout(resolve, 50))
    await nextTick()
  }

  const content = (selector: string) =>
    document.querySelector(selector)?.getAttribute('content') ?? null

  it('pose titre, description, canonique et indexation', async () => {
    await renderWith({
      title: 'Accueil',
      fullTitle: 'Faceel-IT — ESN experte en Data',
      description: 'Description de test.',
      image: '/og.png',
    })

    expect(document.title).toBe('Faceel-IT — ESN experte en Data')
    expect(content('meta[name="description"]')).toBe('Description de test.')
    expect(content('meta[name="robots"]')).toBe('index, follow')
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://www.faceel-it.com/',
    )

    // Les crawlers rejettent une og:image relative : elle doit être absolue.
    expect(content('meta[property="og:image"]')).toBe('https://www.faceel-it.com/og.png')
    expect(content('meta[name="twitter:card"]')).toBe('summary_large_image')
  })

  it('ajoute le suffixe de marque quand `fullTitle` est absent', async () => {
    await renderWith({ title: 'Styleguide', description: 'Banc d’essai.' })

    expect(document.title).toBe('Styleguide | Faceel-IT')
  })

  it('refuse l’indexation quand `indexable` est faux', async () => {
    await renderWith({ title: 'Styleguide', description: 'Banc d’essai.', indexable: false })

    expect(content('meta[name="robots"]')).toBe('noindex, nofollow')
    // Sans image, la carte Twitter reste au format compact.
    expect(content('meta[name="twitter:card"]')).toBe('summary')
  })

  it('exclut l’ancre de l’URL canonique', async () => {
    await renderWith({ title: 'Accueil', description: 'Test.' }, '/?utm=x#expertises')

    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://www.faceel-it.com/',
    )
  })
})
