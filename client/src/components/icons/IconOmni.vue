<script setup lang="ts">
/**
 * Logo Omni Analytics — PLACEHOLDER en attendant le vrai tracé SVG.
 *
 * La capture d'écran de l'inspecteur fournie pour extraire ce logo contient
 * un `d` de plusieurs dizaines de coordonnées décimales denses, illisibles
 * de façon fiable à cette résolution (ex. confusion possible `1`/`7`,
 * `0`/`8`, bornes de nombres ambiguës). Une erreur de chiffre ne casse pas
 * la syntaxe SVG — elle déforme silencieusement le logo, sans moyen de le
 * vérifier sans rendu. Reproduire un tracé de marque officiel au pif serait
 * justement le genre de "fait produit" inventé à éviter (cf. CLAUDE.md).
 *
 * À remplacer par les vrais <path fill="currentColor" d="..." /> dès que le
 * SVG est fourni en texte (outerHTML copié depuis l'inspecteur, ou fichier
 * .svg) plutôt qu'en image.
 */
</script>

<template>
  <svg viewBox="0 0 88 36" fill="currentColor" role="img" aria-label="Omni Analytics">
    <text x="0" y="26" font-family="inherit" font-size="20" font-weight="700" fill="currentColor">
      Omni
    </text>
  </svg>
</template>
