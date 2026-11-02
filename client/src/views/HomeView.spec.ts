// @vitest-environment jsdom
// Comportement non visuel : un lecteur d'écran ou une préférence système ne
// se relit pas dans le code, ils se prouvent par un test (cf. méthode de
// travail du rôle).

import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
// Sous-chemin `/client`, pas la racine du paquet : voir la même remarque
// dans `useSeo.spec.ts`, `HomeView` appelle `useSeo` en profondeur et a donc
// besoin d'une instance `unhead` réelle, pas d'un simple stub.
import { createHead } from '@unhead/vue/client'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './HomeView.vue'

/**
 * Le Hero simule une frappe sur la DERNIÈRE ligne du titre — « On rejoint une
 * équipe. » depuis la refonte V0.3 (auparavant « votre passion »). L'effet
 * homonyme de la Navbar est couvert séparément par `MegaMenu.spec.ts` : ce
 * sont deux animations indépendantes, chacune avec ses propres minuteurs.
 *
 * Deux garanties d'accessibilité ne peuvent pas se vérifier à la relecture :
 *   — le `<h1>` ne perd jamais son nom accessible pendant la phase
 *     d'effacement : un span `sr-only` stable porte la phrase complète en
 *     permanence, à côté du span animé (`aria-hidden="true"`) qui, lui,
 *     se vide puis se retape ;
 *   — sous `prefers-reduced-motion: reduce`, aucune frappe n'est jamais
 *     simulée (pas seulement raccourcie) : le texte reste affiché
 *     intégralement, bien au-delà du délai de premier lancement.
 */
describe('HomeView — Hero, effet machine à écrire', () => {
  const PHRASE = 'On rejoint une équipe.'
  /** Le span animé est le seul `aria-hidden` PORTEUR DE TEXTE du titre — le
   *  curseur, lui, est vide. `:not(:empty)` évite de le confondre avec lui. */
  const TYPED_SELECTOR = 'h1 span[aria-hidden="true"]:not(:empty)'

  async function mountHome(prefersReducedMotion: boolean) {
    const mediaQueryList = {
      matches: prefersReducedMotion,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mediaQueryList))

    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }],
    })
    await router.push('/')
    await router.isReady()

    return mount(HomeView, { global: { plugins: [router, createHead(), createPinia()] } })
  }

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('garde un nom accessible stable pendant que le span animé s’efface', async () => {
    vi.useFakeTimers()
    const wrapper = await mountHome(false)

    // Le nom accessible ne dépend que du span `sr-only`, jamais du span
    // animé — vrai dès le montage, avant même le délai de 2 s qui précède
    // le tout premier lancement.
    expect(wrapper.find('h1 .sr-only').text()).toBe(PHRASE)

    // Avant l'écoulement du délai de premier lancement, le span animé ne
    // doit pas encore avoir bougé : le délai de 2 s n'est pas un détail
    // d'implémentation, c'est la garantie que le titre reste stable pendant
    // les animations d'entrée du Hero.
    await vi.advanceTimersByTimeAsync(1_900)
    await nextTick()
    expect(wrapper.find(TYPED_SELECTOR).text()).toBe(PHRASE)

    // Une fois le délai de 2 s dépassé, le premier cycle (effacement) a
    // commencé.
    await vi.advanceTimersByTimeAsync(200)
    await nextTick()

    expect(wrapper.find('h1 .sr-only').text()).toBe(PHRASE)
    expect(wrapper.find(TYPED_SELECTOR).text()).not.toBe(PHRASE)
  })

  it('ne lance jamais la frappe simulée sous préférence de mouvement réduite', async () => {
    vi.useFakeTimers()
    const wrapper = await mountHome(true)
    await nextTick()

    // Plusieurs cycles complets plus tard (30 s, très au-delà du délai de
    // premier lancement de 2 s et de la pause de 5 s entre deux cycles), le
    // texte visible n'a jamais bougé : sous préférence réduite, la boucle ne
    // démarre jamais.
    await vi.advanceTimersByTimeAsync(30_000)
    await nextTick()

    expect(wrapper.find(TYPED_SELECTOR).text()).toBe(PHRASE)
  })
})
