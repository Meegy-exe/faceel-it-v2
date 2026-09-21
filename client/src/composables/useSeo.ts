import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { SITE_URL } from '@/config/site'

/**
 * Balises de référencement d'une page.
 *
 * S'appuie sur `@unhead/vue`, que `vite-ssg` installe déjà lui-même dans
 * `app.ts` (aucun `createHead()` manuel à poser ici : `ViteSSG()` s'en
 * charge et sérialise le résultat dans le HTML pré-rendu). `useHead` collecte
 * les balises pendant le rendu, ce qui les rend disponibles au pré-rendu au
 * build (arbitrage n°5). Toucher au `document` depuis un `onMounted`
 * produirait des pages statiques sans aucune meta — l'inverse du but
 * recherché.
 *
 * Les valeurs sont acceptées en getters : une page dont le titre dépend d'une
 * ressource chargée (offre, membre) met à jour ses balises sans rappeler le
 * composable.
 */

const SITE_NAME = 'Faceel-IT'

/** Ajouté après chaque titre de page, sauf sur l'accueil qui se suffit. */
const TITLE_SUFFIX = ` | ${SITE_NAME}`

export interface SeoInput {
  /** Titre de la page, sans le nom du site. */
  title: MaybeRefOrGetter<string>
  description: MaybeRefOrGetter<string>
  /**
   * Chemin de l'image de partage, relatif à la racine du site. Absolutisé
   * automatiquement : les crawlers refusent les URL relatives en `og:image`.
   */
  image?: MaybeRefOrGetter<string | undefined>
  /**
   * `false` sur les pages qui ne doivent pas être indexées (styleguide,
   * résultats de recherche, pages techniques).
   */
  indexable?: boolean
  /** `website` pour les pages de rubrique, `article` pour un contenu daté. */
  type?: 'website' | 'article'
  /**
   * Titre complet, si la page veut maîtriser le suffixe elle-même
   * (typiquement l'accueil, qui porte déjà la marque).
   */
  fullTitle?: MaybeRefOrGetter<string>
}

export function useSeo(input: SeoInput) {
  const route = useRoute()

  const title = computed(() => toValue(input.fullTitle) ?? `${toValue(input.title)}${TITLE_SUFFIX}`)
  const description = computed(() => toValue(input.description))

  // `route.path` et non `fullPath` : les ancres et les paramètres de suivi ne
  // doivent jamais entrer dans une URL canonique, sous peine de déclarer
  // autant de pages canoniques que de liens entrants.
  const canonical = computed(() => `${SITE_URL}${route.path}`)

  const image = computed(() => {
    const raw = toValue(input.image)
    if (raw === undefined) return undefined
    return raw.startsWith('http') ? raw : `${SITE_URL}${raw}`
  })

  const indexable = input.indexable ?? true

  useHead({
    title,
    link: [{ rel: 'canonical', href: canonical }],
    meta: [
      { name: 'description', content: description },
      { name: 'robots', content: indexable ? 'index, follow' : 'noindex, nofollow' },

      // Open Graph — Facebook, LinkedIn, Slack, iMessage…
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:type', content: input.type ?? 'website' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: canonical },
      { property: 'og:locale', content: 'fr_FR' },
      { property: 'og:image', content: image },

      // Twitter/X reprend Open Graph, sauf le type de carte.
      {
        name: 'twitter:card',
        content: computed(() => (image.value ? 'summary_large_image' : 'summary')),
      },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
  })
}
