export interface ChatStep {
  messages: string[]
  options?: { label: string; next: string }[]
  inputType?: 'text' | 'email' | 'tel'
  inputPlaceholder?: string
  nextStep?: string
  action?: { label: string; url: string }
}

export interface KeywordEntry {
  keys: string[]
  answer: string
  link: { label: string; url: string }
}

// {{name}} is interpolated by the consuming component from collected state

export const chatFlow: Record<string, ChatStep> = {
  // ─── ENTRÉE ────────────────────────────────────────────────────────────────

  start: {
    messages: [
      "Salut 👋 Moi c'est Faceelbot. Avant de vous raconter ma vie : on vous appelle comment ?",
    ],
    inputType: 'text',
    inputPlaceholder: 'Votre prénom…',
    nextStep: 'welcome',
  },

  welcome: {
    messages: [
      'Enchanté {{name}} 🤝 Cliquez une piste, ou balancez votre question : je réponds ce que je sais, et je passe la main quand je ne sais pas.',
    ],
    options: [
      { label: "J'ai un projet à faire tourner", next: 'client' },
      { label: 'Je cherche un job', next: 'candidat' },
      { label: 'Je veux parler Data & IA', next: 'ia' },
      { label: "Je fouine, c'est tout 👀", next: 'curieux' },
    ],
  },

  // ─── CLIENT ────────────────────────────────────────────────────────────────

  client: {
    messages: ['Ok, on parle boulot. Ça se joue sur quel terrain ?'],
    options: [
      { label: 'Développement & cloud', next: 'client_dev' },
      { label: 'Fiabiliser mes données', next: 'client_data' },
      { label: 'Sécurité & conformité', next: 'client_secu' },
      { label: 'Rappelez-moi', next: 'collect_email_projet' },
      { label: '↩ On change de sujet', next: 'welcome' },
    ],
  },

  client_dev: {
    messages: [
      "Web, mobile, applis métier, infra, run : on prend le sujet au cadrage et on reste après la mise en prod. Le genre d'équipe qui ne disparaît pas au moment du premier bug.",
    ],
    action: { label: 'Voir nos expertises', url: 'Accueil.dc.html#expertises' },
    options: [{ label: '↩ On change de sujet', next: 'welcome' }],
  },

  client_data: {
    messages: [
      "On répare la plomberie avant de vendre du modèle : collecte, qualité, modélisation, restitution. Ensuite seulement, on s'amuse.",
    ],
    action: { label: 'Lire les cas Boulanger & Adeo', url: 'Realisations.dc.html' },
    options: [{ label: '↩ On change de sujet', next: 'welcome' }],
  },

  client_secu: {
    messages: [
      "Sécu SI, RGPD, gestion des accès, gouvernance : en continu. Un audit qui prend la poussière, ça n'a jamais protégé personne.",
    ],
    action: { label: 'Voir nos expertises', url: 'Accueil.dc.html#expertises' },
    options: [{ label: '↩ On change de sujet', next: 'welcome' }],
  },

  // ─── CANDIDAT ──────────────────────────────────────────────────────────────

  candidat: {
    messages: ['Bonne pioche : on recrute. Vous voulez savoir quoi en premier ?'],
    options: [
      { label: 'Les postes ouverts', next: 'candidat_postes' },
      { label: 'Ça se passe comment ?', next: 'candidat_process' },
      { label: "La vie d'équipe", next: 'candidat_vie' },
      { label: "Comment gérez-vous l'intercontrat ?", next: 'faq_intercontrat' },
      { label: "C'est quoi l'embauche profil ?", next: 'faq_embauche' },
      { label: 'Go, je candidate', next: 'collect_email_candidature' },
      { label: 'Je viens boire le café ☕', next: 'collect_email_cafe' },
      { label: '↩ On change de sujet', next: 'welcome' },
    ],
  },

  candidat_postes: {
    messages: [
      'Six postes ouverts : full-stack, data engineering, DevOps/cloud, product, cyber, et une alternance data analyst. Et si rien ne colle, on crée parfois le poste autour de la personne.',
    ],
    action: { label: 'Voir les offres', url: 'Recrutement.dc.html#offres' },
    options: [{ label: '↩ On change de sujet', next: 'welcome' }],
  },

  candidat_process: {
    messages: [
      "Une à deux semaines, une seule personne en face de vous : appel RH, passage à l'agence, et souvent une partie de padel. Votre score, on s'en fiche. Votre façon de jouer avec les autres, beaucoup moins.",
    ],
    action: { label: 'Détail du process', url: 'Recrutement.dc.html' },
    options: [{ label: '↩ On change de sujet', next: 'welcome' }],
  },

  candidat_vie: {
    messages: [
      'Un rendez-vous sportif par mois, un séminaire par an, des clubs partenaires, et des sessions techniques entre collègues. Oui, il y a aussi des afterworks.',
    ],
    action: { label: 'Sport & sponsoring', url: 'Sport.dc.html' },
    options: [{ label: '↩ On change de sujet', next: 'welcome' }],
  },

  // ─── IA ────────────────────────────────────────────────────────────────────

  ia: {
    messages: ["Mon sujet préféré, forcément. Qu'est-ce qu'on vérifie ?"],
    options: [
      { label: "Quels cas d'usage ?", next: 'ia_cas' },
      { label: 'Combien de temps ?', next: 'ia_temps' },
      { label: "Et si l'IA ne sert à rien chez moi ?", next: 'ia_doute' },
      { label: "Cadrer un cas d'usage", next: 'collect_email_ia' },
      { label: '↩ On change de sujet', next: 'welcome' },
    ],
  },

  ia_cas: {
    messages: [
      "Assistants branchés sur vos référentiels, automatisation des tâches pénibles, prévision, détection d'anomalies. Testés sur vos données, pas sur un benchmark qui brille.",
    ],
    action: { label: 'Discutons IA', url: 'Accueil.dc.html#ia' },
    options: [{ label: '↩ On change de sujet', next: 'welcome' }],
  },

  ia_temps: {
    messages: [
      "La démo, quelques semaines. La version à laquelle vos équipes font confiance, c'est une autre histoire : sources maîtrisées, droits respectés, réponses évaluées en continu.",
    ],
    action: { label: 'Discutons IA', url: 'Accueil.dc.html#ia' },
    options: [{ label: '↩ On change de sujet', next: 'welcome' }],
  },

  ia_doute: {
    messages: [
      "On vous le dira franchement. Souvent, une donnée propre et un bon produit suffisent — et ça coûte moins cher qu'un modèle.",
    ],
    action: { label: 'Voir nos expertises', url: 'Accueil.dc.html#expertises' },
    options: [{ label: '↩ On change de sujet', next: 'welcome' }],
  },

  // ─── CURIEUX ───────────────────────────────────────────────────────────────

  curieux: {
    messages: ['Les curieux, on les aime bien ici. On commence par quoi ?'],
    options: [
      { label: 'Vous êtes qui, au fond ?', next: 'curieux_qui' },
      { label: 'Ce que vous écrivez', next: 'curieux_blog' },
      { label: "C'est quoi cette histoire de padel ?", next: 'curieux_padel' },
      { label: '↩ On change de sujet', next: 'welcome' },
    ],
  },

  curieux_qui: {
    messages: [
      "ESN indépendante née en 2021 à Wasquehal : une soixantaine de personnes, quatre expertises, zéro fonds d'investissement dans le capital. On avance à notre rythme.",
    ],
    action: { label: "L'agence", url: 'Contact.dc.html' },
    options: [{ label: '↩ On change de sujet', next: 'welcome' }],
  },

  curieux_blog: {
    messages: [
      "Nos ingénieurs racontent ce qui marche et ce qui a cassé : data, IA, cloud, mobile, et le métier d'ESN vu de l'intérieur.",
    ],
    action: { label: 'Lire les insights', url: 'Insights.dc.html' },
    options: [{ label: '↩ On change de sujet', next: 'welcome' }],
  },

  curieux_padel: {
    messages: [
      "Parce qu'un terrain montre en dix minutes ce qu'un entretien met six mois à révéler. Et parce que c'est plus sympa qu'un test technique.",
    ],
    action: { label: 'Sport & sponsoring', url: 'Sport.dc.html' },
    options: [{ label: '↩ On change de sujet', next: 'welcome' }],
  },

  // ─── FAQ CANDIDAT ──────────────────────────────────────────────────────────

  faq_intercontrat: {
    messages: [
      "L'intercontrat n'est pas un tabou. Depuis 2024, 100 % de nos collaborateurs ont été replacés. La durée moyenne est de 1,5 mois, pendant laquelle vous restez en CDI, payé à 100 %, et profitez de notre serveur IA interne ou de mécénat de compétences.",
    ],
    options: [
      { label: '↩ Retour candidat', next: 'candidat' },
      { label: 'Go, je candidate', next: 'collect_email_candidature' },
      { label: '↩ On change de sujet', next: 'welcome' },
    ],
  },

  faq_embauche: {
    messages: [
      "Chez nous, le modèle majoritaire est l'embauche profil. On vous recrute en CDI avant même de vous avoir trouvé une mission, parce qu'on parie d'abord sur vous.",
    ],
    options: [
      { label: '↩ Retour candidat', next: 'candidat' },
      { label: 'Go, je candidate', next: 'collect_email_candidature' },
      { label: '↩ On change de sujet', next: 'welcome' },
    ],
  },

  // ─── TUNNEL COLLECTE ───────────────────────────────────────────────────────
  // Quatre entrées distinctes → le sujet est inféré par l'app depuis la clé d'entrée

  collect_email_projet: {
    messages: [
      "Ça marche {{name}} ! Deux infos et un humain vous rappelle : d'abord votre e-mail.",
    ],
    inputType: 'email',
    inputPlaceholder: 'vous@entreprise.fr',
    nextStep: 'collect_phone',
  },

  collect_email_candidature: {
    messages: [
      "Ça marche {{name}} ! Deux infos et un humain vous rappelle : d'abord votre e-mail.",
    ],
    inputType: 'email',
    inputPlaceholder: 'vous@entreprise.fr',
    nextStep: 'collect_phone',
  },

  collect_email_cafe: {
    messages: [
      "Ça marche {{name}} ! Deux infos et un humain vous rappelle : d'abord votre e-mail.",
    ],
    inputType: 'email',
    inputPlaceholder: 'vous@entreprise.fr',
    nextStep: 'collect_phone',
  },

  collect_email_ia: {
    messages: [
      "Ça marche {{name}} ! Deux infos et un humain vous rappelle : d'abord votre e-mail.",
    ],
    inputType: 'email',
    inputPlaceholder: 'vous@entreprise.fr',
    nextStep: 'collect_phone',
  },

  collect_email_fallback: {
    messages: [
      'Là, je sèche — et je préfère ça à une réponse inventée. Laissez-moi un e-mail, un humain reprend la main sous 48h.',
    ],
    inputType: 'email',
    inputPlaceholder: 'vous@entreprise.fr',
    nextStep: 'collect_phone',
  },

  collect_phone: {
    messages: [
      'Nickel. Un numéro pour un rappel rapide ? (facultatif — le bouton « Sans téléphone » existe pour ça.)',
    ],
    inputType: 'tel',
    inputPlaceholder: '06 12 34 56 78',
    nextStep: 'collect_details',
    options: [{ label: "Sans téléphone, l'e-mail suffit", next: 'collect_details' }],
  },

  collect_details: {
    messages: [
      'Parfait. En deux phrases max : votre contexte, le poste visé ou le besoin. Pas besoin de rédiger un roman.',
    ],
    inputType: 'text',
    inputPlaceholder: 'Votre contexte en deux phrases…',
    nextStep: 'collect_review',
  },

  collect_review: {
    messages: [
      "C'est dans la boîte, {{name}} — enfin presque. Vérifiez le récap et envoyez : réponse sous 48h, par un humain.",
    ],
    // action.url : le composant construit le mailto complet depuis l'état collecté
    // subject=[Faceelbot] {subject} — {name}  body=Nom/E-mail/Téléphone/Sujet/Message
    action: {
      label: '✓ Envoyer à recrutement@faceel-it.com',
      url: 'mailto:recrutement@faceel-it.com',
    },
    options: [
      { label: 'Oups, corriger mon e-mail', next: 'collect_email_fallback' },
      { label: 'Changer mon numéro', next: 'collect_phone' },
      { label: 'Laisse tomber', next: 'start' },
    ],
  },
}

export const chatKeywords: KeywordEntry[] = [
  {
    keys: ['offre', 'poste', 'recrut', 'candidat', 'emploi', 'alternance', 'stage', 'cv'],
    answer:
      'Six postes sont ouverts, et les candidatures spontanées comptent pour la majorité de nos recrutements.',
    link: { label: 'Voir les offres', url: 'Recrutement.dc.html#offres' },
  },
  {
    keys: ['process', 'entretien', 'padel', 'sport'],
    answer:
      'Le process tient en une à deux semaines, avec un seul interlocuteur — et souvent une partie de padel.',
    link: { label: 'Détail du process', url: 'Recrutement.dc.html' },
  },
  {
    keys: ['ia', 'intelligence', 'llm', 'agent', 'gpt'],
    answer:
      'Nous construisons des agents connectés aux données internes : assistants, automatisation, aide à la décision.',
    link: { label: 'Discutons IA', url: 'Accueil.dc.html#ia' },
  },
  {
    keys: ['data', 'donnée', 'donnee', 'snowflake', 'dbt', 'analytics'],
    answer: 'Côté data : pipelines, qualité, modélisation, restitution, puis machine learning.',
    link: { label: 'Voir un projet data', url: 'Realisations.dc.html' },
  },
  {
    keys: ['cyber', 'rgpd', 'sécurit', 'securit', 'conformit'],
    answer: 'Sécurité SI, RGPD, gestion des accès et gouvernance de la donnée, traités en continu.',
    link: { label: 'Nos expertises', url: 'Accueil.dc.html#expertises' },
  },
  {
    keys: ['client', 'référence', 'reference', 'boulanger', 'adeo', 'decathlon', 'auchan', 'ovh'],
    answer:
      'Decathlon, Auchan, Boulanger, Crédit Agricole, OVHcloud, Adeo — deux cas sont détaillés.',
    link: { label: 'Voir les réalisations', url: 'Realisations.dc.html' },
  },
  {
    keys: ['adresse', 'agence', 'wasquehal', 'venir', 'lille'],
    answer: "L'agence est au 10 allée du château blanc, 59290 Wasquehal, à deux pas de Lille.",
    link: { label: "L'agence", url: 'Contact.dc.html' },
  },
  {
    keys: [
      'télétravail',
      'teletravail',
      'avantage',
      'formation',
      'salaire',
      'rémunération',
      'remuneration',
    ],
    answer:
      'Deux jours de télétravail, horaires souples, budget de formation individuel, crèche financée, part variable sans plafond.',
    link: { label: 'Nous rejoindre', url: 'Recrutement.dc.html' },
  },
  {
    keys: ['qui', 'esn', 'entreprise', 'équipe', 'equipe', 'histoire'],
    answer:
      'ESN indépendante créée en 2021 à Wasquehal, une soixantaine de personnes, quatre expertises.',
    link: { label: "L'agence", url: 'Contact.dc.html' },
  },
]
