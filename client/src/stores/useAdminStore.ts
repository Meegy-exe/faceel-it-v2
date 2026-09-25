import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Afterwork, Article, Event, JobOffer, UseCase } from '@/types/admin'

// Données mockées (Étape 2, back-office) : aucun backend de contenu pour
// l'instant, cf. `docs/DECISIONS.md` (arbitrage n°3 révoqué).
export const useAdminStore = defineStore('admin', () => {
  const events = ref<Event[]>([
    {
      id: '1',
      title: 'DevFest Lille',
      description: "Faceel-IT tient un stand sur l'IA appliquée à la data.",
      imageUrl: '/images/events/devfest-lille.jpg',
      date: '2026-10-15',
    },
  ])

  const afterworks = ref<Afterwork[]>([
    {
      id: '1',
      title: 'Tournoi de padel',
      date: '2026-06-20',
      images: ['/images/afterworks/padel-1.jpg', '/images/afterworks/padel-2.jpg'],
    },
  ])

  const articles = ref<Article[]>([
    {
      id: '1',
      title: 'Certification Anthropic validée',
      content:
        "Notre pôle Data & IA a obtenu la certification Anthropic sur l'intégration de Claude en entreprise.",
      date: '2026-09-01',
    },
  ])

  const useCases = ref<UseCase[]>([
    {
      id: '1',
      clientName: 'Client Retail X',
      description: 'Fiabilisation du pipeline data et modélisation de la demande.',
    },
  ])

  const jobOffers = ref<JobOffer[]>([
    {
      id: '1',
      title: 'Data Engineer',
      description: 'Conception et maintenance des pipelines de données clients.',
      isActive: true,
    },
  ])

  function addEvent(event: Omit<Event, 'id'>) {
    events.value.push({ ...event, id: crypto.randomUUID() })
  }

  function deleteEvent(id: string) {
    events.value = events.value.filter((event) => event.id !== id)
  }

  function addAfterwork(afterwork: Omit<Afterwork, 'id'>) {
    afterworks.value.push({ ...afterwork, id: crypto.randomUUID() })
  }

  function deleteAfterwork(id: string) {
    afterworks.value = afterworks.value.filter((afterwork) => afterwork.id !== id)
  }

  function addArticle(article: Omit<Article, 'id'>) {
    articles.value.push({ ...article, id: crypto.randomUUID() })
  }

  function deleteArticle(id: string) {
    articles.value = articles.value.filter((article) => article.id !== id)
  }

  function addUseCase(useCase: Omit<UseCase, 'id'>) {
    useCases.value.push({ ...useCase, id: crypto.randomUUID() })
  }

  function deleteUseCase(id: string) {
    useCases.value = useCases.value.filter((useCase) => useCase.id !== id)
  }

  function addJobOffer(jobOffer: Omit<JobOffer, 'id'>) {
    jobOffers.value.push({ ...jobOffer, id: crypto.randomUUID() })
  }

  function deleteJobOffer(id: string) {
    jobOffers.value = jobOffers.value.filter((jobOffer) => jobOffer.id !== id)
  }

  return {
    events,
    afterworks,
    articles,
    useCases,
    jobOffers,
    addEvent,
    deleteEvent,
    addAfterwork,
    deleteAfterwork,
    addArticle,
    deleteArticle,
    addUseCase,
    deleteUseCase,
    addJobOffer,
    deleteJobOffer,
  }
})
