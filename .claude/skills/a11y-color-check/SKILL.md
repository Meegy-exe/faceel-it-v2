---
name: a11y-color-check
description: >
  Calcule le ratio de contraste WCAG d'une paire de couleurs et applique la
  règle « une couleur de marque vive est une touche, jamais un aplat de
  grande surface ». À utiliser avant d'assigner une couleur de fond, de
  texte ou de bordure à un composant, en particulier quand une couleur
  d'accent saturée est en jeu.
---

# Pourquoi ce skill existe

Une couleur qui « a l'air » lisible à l'écran peut échouer objectivement le
seuil WCAG, et une couleur de marque saturée qui fonctionne très bien en
texte sur fond sombre peut devenir illisible - ou indiscernable en
daltonisme - dès qu'elle devient l'aplat de fond d'une grande surface. La
décision ne doit pas se prendre à l'œil : elle se calcule.

# Règle de décision

1. **Calculer le ratio de contraste** entre le texte (ou l'élément
   non-textuel) et son fond, via la formule de luminance relative WCAG :

   ```
   L = 0.2126·R + 0.7152·G + 0.0722·B   (R,G,B linéarisés depuis sRGB)
   ratio = (L_clair + 0.05) / (L_sombre + 0.05)
   ```

   Seuils : **4.5:1** minimum pour du texte normal (AA), **3:1** pour du
   texte large (≥ 24px gras) ou un élément non-textuel porteur de sens
   (bordure de focus, icône seule), **7:1** pour l'AAA.

2. **Ne jamais poser une couleur d'accent saturée en aplat de fond de grande
   surface** (carte, bandeau, section entière). Deux raisons cumulées :
   - Aucune couleur de texte ne reste confortable dessus (le texte sombre
     vibre visuellement, le texte clair échoue souvent le ratio) ;
   - Une couleur saturée unique devient indiscernable d'un fond neutre en
     deutéranopie/protanopie - les daltoniens perdent le signal entièrement,
     pas partiellement.

   Réserver les couleurs de marque vives à des éléments de petite taille :
   icône, bordure au survol, texte court déjà accompagné d'un intitulé,
   puce, trait de séparation. Les surfaces de grande taille restent sur les
   couleurs neutres/sombres/claires du projet.

3. **Doubler chaque signal de couleur d'un signal non chromatique.** Un état
   (survol, sélection, erreur) qui ne se distingue QUE par la teinte est
   invisible en daltonisme. Ajouter systématiquement un second signal :
   changement de taille, de position, d'épaisseur de trait, apparition d'une
   icône ou d'un soulignement.

4. **Réutiliser la palette et les ratios déjà validés dans le projet** avant
   de recalculer à l'aveugle : si un fichier de tokens de design documente
   déjà des couples couleur/fond avec leurs ratios (souvent en commentaire
   au-dessus de la déclaration des couleurs), c'est la source de vérité -
   citer le ratio existant plutôt que de le renégocier.

# Utilisation

- Avant d'ajouter une nouvelle tonalité de surface à un composant existant.
- Avant de choisir la couleur d'un indicateur de focus sur une nouvelle
  surface d'accueil (une couleur de focus qui fonctionne sur fond clair peut
  échouer le 3:1 non-textuel sur fond sombre, et inversement).
- Avant de valider qu'un état interactif (survol, désactivé, actif) reste
  perceptible sans la couleur.

# Sortie attendue

Toujours citer le ratio calculé et le seuil visé dans le commentaire ou la
réponse (« blanc sur navy 15,9:1 AAA », « navy sur accent 9,1:1 AAA - décor
uniquement, jamais de texte accent sur fond clair sous 4,9:1 »), pas une
affirmation de lisibilité sans le chiffre.
