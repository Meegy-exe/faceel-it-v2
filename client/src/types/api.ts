/**
 * Traduction TypeScript du contrat d'API validé.
 *
 * Ce fichier est le pendant front des DTO Spring Boot. Toute divergence avec
 * docs/api/openapi.yaml est un bug. À terme, ce fichier doit être GÉNÉRÉ
 * depuis l'OpenAPI (openapi-typescript) plutôt que maintenu à la main.
 */

/* ---------------------------------------------------------------- Communs */

export interface PageMeta {
  number: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

export interface Page<T> {
  content: T[]
  page: PageMeta
}

export interface ApiFieldError {
  field: string
  code: string
  message: string
}

/** RFC 9457 Problem Details */
export interface ApiProblem {
  type: string
  title: string
  status: number
  detail: string
  instance: string
  timestamp: string
  errors?: ApiFieldError[]
}

export interface Image {
  url: string
  thumbnailUrl: string | null
  alt: string
  width: number
  height: number
  dominantColor: string | null
}

export interface Seo {
  metaTitle: string
  metaDescription: string
  ogImageUrl: string | null
}

/* ------------------------------------------------------ Offres d'emploi */

export type ContractType = 'CDI' | 'CDD' | 'FREELANCE' | 'INTERNSHIP' | 'APPRENTICESHIP'
export type WorkMode = 'ONSITE' | 'HYBRID' | 'REMOTE'
export type ExperienceLevel = 'JUNIOR' | 'CONFIRMED' | 'SENIOR' | 'EXPERT'
export type SalaryPeriod = 'YEAR' | 'MONTH' | 'DAY'
export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'

export interface JobLocation {
  city: string
  postalCode: string | null
  region: string
  country: string
  remoteDaysPerWeek: number | null
}

/** `null` lorsque `displayed` est faux : le backend ne transmet jamais
 *  une fourchette confidentielle au navigateur. */
export interface Salary {
  min: number
  max: number
  currency: string
  period: SalaryPeriod
  displayed: boolean
}

export interface Skill {
  label: string
  level: SkillLevel
}

export interface Benefit {
  icon: string
  label: string
}

export interface HiringStep {
  step: number
  label: string
  durationMinutes: number
}

export interface JobOfferSummary {
  id: string
  slug: string
  reference: string
  title: string
  shortDescription: string
  contractType: ContractType
  workMode: WorkMode
  experienceLevel: ExperienceLevel
  department: string
  location: Pick<JobLocation, 'city' | 'region' | 'country'>
  salary: Salary | null
  tags: string[]
  isUrgent: boolean
  isNew: boolean
  publishedAt: string
}

export interface JobOfferDetail extends Omit<JobOfferSummary, 'location'> {
  description: string
  minYearsExperience: number | null
  startDate: string | null
  location: JobLocation
  missions: string[]
  requiredSkills: Skill[]
  niceToHaveSkills: Skill[]
  profile: string
  benefits: Benefit[]
  hiringProcess: HiringStep[]
  recruiter: MemberRef | null
  applicationEmail: string | null
  applicationUrl: string | null
  updatedAt: string
  expiresAt: string | null
  seo: Seo
}

/* ---------------------------------------------------------- Le Collectif */

export type Team = 'LEADERSHIP' | 'ENGINEERING' | 'TALENT' | 'SALES' | 'OPERATIONS'
export type LanguageLevel = 'NATIVE' | 'FLUENT' | 'PROFESSIONAL' | 'NOTIONS'

export interface MemberRef {
  id: string
  slug: string
  displayName: string
  role: string
  photoUrl: string
}

export interface SpokenLanguage {
  code: string
  label: string
  level: LanguageLevel
}

/** Nullable : tous les membres n'ont pas de fiche « esprit sportif ». */
export interface SportSpirit {
  discipline: string
  quote: string
  achievement: string | null
}

export interface MemberSocials {
  linkedin: string | null
  github: string | null
  website: string | null
}

export interface MemberSummary {
  id: string
  slug: string
  displayName: string
  role: string
  team: Team
  tagline: string | null
  photo: Image
  displayOrder: number
  hasDetailPage: boolean
}

export interface MemberDetail extends MemberSummary {
  firstName: string
  lastName: string
  pronouns: string | null
  seniorityLabel: string | null
  joinedAt: string
  bio: string
  expertise: string[]
  languages: SpokenLanguage[]
  sportSpirit: SportSpirit | null
  socials: MemberSocials
  contactEmail: string | null
  relatedJobSlugs: string[]
  visible: boolean
  updatedAt: string
  seo: Seo
}
