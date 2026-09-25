export interface ChatOption {
  label: string
  next: string
}

export interface ChatAction {
  label: string
  url: string
}

export interface ChatStep {
  messages: string[]
  options?: ChatOption[]
  action?: ChatAction
  /** Étape de saisie libre : affiche un champ texte au lieu d'options. */
  inputType?: 'text' | 'email'
  inputPlaceholder?: string
  /** Étape suivante une fois la saisie validée. */
  nextStep?: string
}

export const chatFlow: Record<string, ChatStep> = {
  start: {
    messages: ["Bonjour ! 👋"],
    inputType: 'text',
    inputPlaceholder: 'Votre prénom...',
    nextStep: 'greeting',
  },

  greeting: {
    messages: [
      'Enchanté {name} ! 🙂',
      "Bienvenue chez Faceel IT. Pour vous guider au mieux, dites-nous ce qui vous amène aujourd'hui :",
    ],
    options: [
      { label: "J'ai un projet / Je suis une entreprise", next: "entreprise" },
      { label: "Je cherche un emploi", next: "candidat" },
      { label: "Autre demande", next: "autre" },
    ],
  },

  entreprise: {
    messages: [
      "Super.",
      "Dans quel domaine d'expertise s'inscrit votre besoin ?",
    ],
    options: [
      { label: "Data & IA", next: "contact_data" },
      { label: "Transformation Digitale & Web", next: "contact_web" },
      { label: "Conseil / Agilité", next: "contact_agile" },
    ],
  },

  contact_data: {
    messages: [
      "Excellent choix !",
      "Notre pôle Data/IA est à votre disposition.",
      "Laissez-nous vos coordonnées, notre expert vous recontactera sous 48h.",
    ],
    action: { label: "Aller au formulaire", url: "/contact?bu=data" },
  },

  contact_web: {
    messages: [
      "Très bien.",
      "Notre pôle Développement & Transformation Digitale peut vous accompagner.",
      "Parlons de votre projet en détail.",
    ],
    action: { label: "Aller au formulaire", url: "/contact?bu=web" },
  },

  contact_agile: {
    messages: [
      "C'est noté !",
      "Nos profils agiles et métiers sont prêts à intervenir.",
      "Dites-nous en plus sur votre contexte.",
    ],
    action: { label: "Aller au formulaire", url: "/contact?bu=agile" },
  },

  candidat: {
    messages: [
      "Génial ! On cherche toujours de nouveaux talents.",
      "Quel est votre profil ?",
    ],
    options: [
      { label: "Data Engineer / Data Scientist", next: "offres" },
      { label: "Développeur / Tech Lead", next: "offres" },
      { label: "Alternance / Stage", next: "offres" },
    ],
  },

  offres: {
    messages: [
      "C'est noté !",
      "Le meilleur moyen de nous rejoindre est de consulter nos offres actuelles ou de nous envoyer une candidature spontanée.",
    ],
    action: { label: "Voir nos offres d'emploi", url: "/nous-rejoindre" },
  },

  autre: {
    messages: [
      "Pas de problème.",
      "Que ce soit pour une question administrative, un partenariat ou juste pour discuter tech, notre équipe est là.",
    ],
    action: { label: "Nous contacter", url: "/contact?sujet=autre" },
  },
}
