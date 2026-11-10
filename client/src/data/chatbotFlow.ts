/**
 * Dictionnaire de données du Faceelbot - seule source de vérité pour le
 * contenu conversationnel. `ChatbotView.vue` n'est qu'un moteur : il lit cet
 * objet, ne contient aucun texte métier en dur.
 *
 * Une étape peut combiner `inputType` ET `options` (ex. `collect_details` :
 * champ de saisie libre + bouton « Passer cette étape ») : les deux widgets
 * s'affichent côte à côte dans le composant, ce n'est pas un choix exclusif.
 */
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

// {{name}} est interpolé par le composant appelant depuis l'état collecté.

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
      { label: 'Votre marque employeur, concrètement', next: 'marque_employeur' },
      { label: "Je fouine, c'est tout 👀", next: 'curieux' },
    ],
  },

  // ─── CLIENT ────────────────────────────────────────────────────────────────

  client: {
    messages: ['Ok, on parle boulot. Ça se joue sur quel terrain ?'],
    // lien page client
    action: { label: "L'approche client Faceel-IT", url: '/client-chez-faceel-it' },
    options: [
      { label: 'Développement & cloud', next: 'client_dev' },
      { label: 'Fiabiliser mes données', next: 'client_data' },
      { label: 'Conception & produit', next: 'client_product' },
      { label: "J'ai un projet", next: 'collect_email_projet' },
      { label: '↩ On change de sujet', next: 'welcome' },
    ],
  },

  client_dev: {
    messages: [
      "Web, mobile, applis métier, infra, run : on prend le sujet au cadrage et on reste après la mise en prod. Le genre d'équipe qui ne disparaît pas au moment du premier bug.",
    ],
    // lien vers bu digital
    action: { label: 'Voir notre expertise Digital', url: '/nos-bus/digital' },
    options: [{ label: '↩ On change de sujet', next: 'welcome' }],
  },

  client_data: {
    messages: [
      "On répare la plomberie avant de vendre du modèle : collecte, qualité, modélisation, restitution. Ensuite seulement, on s'amuse.",
    ],
    // lien vers bu data ia
    action: { label: 'Voir notre expertise Data & IA', url: '/nos-bus/data-ia' },
    options: [{ label: '↩ On change de sujet', next: 'welcome' }],
  },

  client_product: {
    messages: [
      "Cadrage, design produit, UX, conception et delivery : on construit le produit avec vous, pas pour vous.",
    ],
    // lien vers bu product
    action: { label: 'Voir notre expertise Product', url: '/nos-bus/product' },
    options: [{ label: '↩ On change de sujet', next: 'welcome' }],
  },

  // ─── CANDIDAT ──────────────────────────────────────────────────────────────

  candidat: {
    messages: ['Bonne pioche : on recrute. Vous voulez savoir quoi en premier ?'],
    // lien page consultant
    action: { label: 'Être consultant chez nous', url: '/consultant-chez-faceel-it' },
    options: [
      { label: 'Les postes ouverts', next: 'candidat_postes' },
      { label: 'Ça se passe comment ?', next: 'candidat_process' },
      { label: "La vie d'équipe", next: 'candidat_vie' },
      { label: 'Notre marque employeur', next: 'marque_employeur' },
      { label: 'Go, je candidate', next: 'collect_email_candidature' },
      { label: '↩ On change de sujet', next: 'welcome' },
    ],
  },

  candidat_postes: {
    // reponse offres generique
    messages: [
      "Nos besoins évoluent régulièrement ! Le mieux est de consulter nos opportunités du moment. Et si rien ne colle parfaitement, n'hésitez pas à nous écrire : il nous arrive parfois de créer le poste autour de la bonne personne.",
    ],
    action: { label: 'Consulter nos offres', url: '/consulter-nos-offres' },
    options: [{ label: '↩ On change de sujet', next: 'welcome' }],
  },

  candidat_process: {
    messages: [
      "Une à deux semaines, une seule personne en face de vous : appel RH, passage à l'agence, et souvent une partie de padel. Votre score, on s'en fiche. Votre façon de jouer avec les autres, beaucoup moins.",
    ],
    // supprime btn process
    options: [{ label: '↩ On change de sujet', next: 'welcome' }],
  },

  candidat_vie: {
    messages: [
      'Un rendez-vous sportif par mois, un séminaire par an, des clubs partenaires, et des sessions techniques entre collègues. Oui, il y a aussi des afterworks.',
    ],
    // lien sponso
    action: { label: 'Sport & sponsoring', url: '/sport-sponsoring' },
    options: [{ label: '↩ On change de sujet', next: 'welcome' }],
  },

  // ─── MARQUE EMPLOYEUR ──────────────────────────────────────────────────────
  // Deux piliers de la promesse RH : l'embauche se fait sur le profil (pas sur
  // une mission à pourvoir), et l'intercontrat est traité comme du temps de
  // CDI normal, pas comme une zone grise.

  marque_employeur: {
    messages: [
      "Avant de parler poste : voici comment on traite les gens une fois recrutés, parce que c'est souvent plus parlant qu'une fiche de poste.",
    ],
    options: [
      { label: 'Le modèle « profil avant mission »', next: 'marque_employeur_profil' },
      { label: "Et l'intercontrat, concrètement ?", next: 'marque_employeur_intercontrat' },
      { label: '↩ Retour candidat', next: 'candidat' },
      { label: '↩ On change de sujet', next: 'welcome' },
    ],
  },

  marque_employeur_profil: {
    messages: [
      "On recrute en CDI avant même d'avoir la mission en face : on parie sur le profil, pas sur un poste à pourvoir dans l'urgence.",
      "Concrètement : votre contrat ne dépend pas du calendrier d'un client. Pas de date de fin de mission qui dicte votre embauche.",
    ],
    options: [
      { label: 'Et si je suis sans mission ?', next: 'marque_employeur_intercontrat' },
      { label: '↩ Retour', next: 'marque_employeur' },
      { label: '↩ On change de sujet', next: 'welcome' },
    ],
  },

  marque_employeur_intercontrat: {
    messages: [
      "L'intercontrat n'est pas un tabou chez nous, ni un trou dans le CV. Depuis 2024 : 100 % des collaborateurs replacés, durée moyenne 1,5 mois.",
      'Pendant cette période : maintien de salaire à 100 % (vous restez en CDI, pas de chômage partiel déguisé), accès à notre serveur IA interne, et mécénat de compétences pour des associations si vous le souhaitez.',
    ],
    options: [
      { label: "C'est quoi l'embauche profil déjà ?", next: 'marque_employeur_profil' },
      { label: 'Go, je candidate', next: 'collect_email_candidature' },
      { label: '↩ On change de sujet', next: 'welcome' },
    ],
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
    // options menu ia
    options: [
      { label: 'Combien de temps ?', next: 'ia_temps' },
      { label: "Et si l'IA ne sert à rien chez moi ?", next: 'ia_doute' },
      { label: "Cadrer un cas d'usage", next: 'collect_email_ia' },
      { label: '↩ On change de sujet', next: 'welcome' },
    ],
  },

  ia_temps: {
    messages: [
      "La démo, quelques semaines. La version à laquelle vos équipes font confiance, c'est une autre histoire : sources maîtrisées, droits respectés, réponses évaluées en continu.",
    ],
    // options menu ia
    options: [
      { label: "Quels cas d'usage ?", next: 'ia_cas' },
      { label: "Et si l'IA ne sert à rien chez moi ?", next: 'ia_doute' },
      { label: "Cadrer un cas d'usage", next: 'collect_email_ia' },
      { label: '↩ On change de sujet', next: 'welcome' },
    ],
  },

  ia_doute: {
    messages: [
      "On vous le dira franchement. Souvent, une donnée propre et un bon produit suffisent - et ça coûte moins cher qu'un modèle.",
    ],
    // options menu ia
    options: [
      { label: "Quels cas d'usage ?", next: 'ia_cas' },
      { label: 'Combien de temps ?', next: 'ia_temps' },
      { label: "Cadrer un cas d'usage", next: 'collect_email_ia' },
      { label: '↩ On change de sujet', next: 'welcome' },
    ],
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
    // lien histoire
    action: { label: 'Notre histoire', url: '/qui-sommes-nous/notre-histoire' },
    options: [
      { label: 'Ce que vous écrivez', next: 'curieux_blog' },
      { label: "C'est quoi cette histoire de padel ?", next: 'curieux_padel' },
      { label: '↩ On change de sujet', next: 'welcome' },
    ],
  },

  curieux_blog: {
    messages: [
      "Nos ingénieurs racontent ce qui marche et ce qui a cassé : data, IA, cloud, mobile, et le métier d'ESN vu de l'intérieur.",
    ],
    options: [
      { label: 'Vous êtes qui, au fond ?', next: 'curieux_qui' },
      { label: "C'est quoi cette histoire de padel ?", next: 'curieux_padel' },
      { label: '↩ On change de sujet', next: 'welcome' },
    ],
  },

  curieux_padel: {
    messages: [
      "Parce qu'un terrain montre en dix minutes ce qu'un entretien met six mois à révéler. Et parce que c'est plus sympa qu'un test technique.",
    ],
    // btn padel
    action: { label: 'Sport & sponsoring', url: '/sport-sponsoring' },
    options: [
      { label: 'Vous êtes qui, au fond ?', next: 'curieux_qui' },
      { label: 'Ce que vous écrivez', next: 'curieux_blog' },
      { label: '↩ On change de sujet', next: 'welcome' },
    ],
  },

  // ─── TUNNEL COLLECTE ───────────────────────────────────────────────────────
  // Quatre entrées distinctes → le sujet est inféré par l'app depuis la clé
  // d'entrée. Le contexte mémorisé au fil du tunnel : Nom (`start`), Email
  // (`collect_email_*`), Téléphone (`collect_phone`), Projet
  // (`collect_details`).

  collect_email_projet: {
    messages: [
      'Très bien ! Le plus simple est de nous décrire votre besoin via notre formulaire.',
    ],
    // lien formulaire b2b
    action: { label: 'Contact entreprise', url: '/contact-entreprise' },
    options: [{ label: '↩ On change de sujet', next: 'welcome' }],
  },

  collect_email_candidature: {
    messages: [
      "Excellent choix ! Le plus simple est de passer par notre formulaire de candidature spontanée. On a hâte d'en savoir plus sur vous.",
    ],
    // cta candidature
    action: { label: 'Candidature spontanée', url: '/candidature-spontanee' },
    options: [{ label: '↩ On change de sujet', next: 'welcome' }],
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
      "Bonne initiative. Le plus simple est de nous en dire quelques mots via notre formulaire de contact. Nos experts Data & IA reviendront très vite vers vous.",
    ],
    // lien contact entreprise
    action: { label: 'Contact entreprise', url: '/contact-entreprise' },
    // options menu ia
    options: [
      { label: "Quels cas d'usage ?", next: 'ia_cas' },
      { label: 'Combien de temps ?', next: 'ia_temps' },
      { label: "Et si l'IA ne sert à rien chez moi ?", next: 'ia_doute' },
      { label: '↩ On change de sujet', next: 'welcome' },
    ],
  },

  collect_email_fallback: {
    messages: [
      'Là, je sèche - et je préfère ça à une réponse inventée. Laissez-moi un e-mail, un humain reprend la main sous 48h.',
    ],
    inputType: 'email',
    inputPlaceholder: 'vous@entreprise.fr',
    nextStep: 'collect_phone',
  },

  collect_phone: {
    messages: [
      'Nickel. Un numéro pour un rappel rapide ? (facultatif - le bouton « Sans téléphone » existe pour ça.)',
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
    options: [{ label: 'Passer cette étape', next: 'collect_review' }],
  },

  collect_review: {
    messages: [
      "C'est dans la boîte, {{name}} - enfin presque. Vérifiez le récap et envoyez : réponse sous 48h, par un humain.",
    ],
    // action.url : le composant construit le mailto complet depuis l'état collecté
    // subject=[Faceelbot] {subject} - {name}  body=Nom/E-mail/Téléphone/Projet/Sujet
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
      'Le process tient en une à deux semaines, avec un seul interlocuteur - et souvent une partie de padel.',
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
      'Decathlon, Auchan, Boulanger, Crédit Agricole, OVHcloud, Adeo - deux cas sont détaillés.',
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
