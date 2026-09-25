export interface Event {
  id: string
  title: string
  description: string
  imageUrl: string
  date: string
}

export interface Afterwork {
  id: string
  title: string
  date: string
  images: string[]
}

export interface Article {
  id: string
  title: string
  content: string
  date: string
}

export interface UseCase {
  id: string
  clientName: string
  description: string
}

export interface JobOffer {
  id: string
  title: string
  description: string
  isActive: boolean
}
