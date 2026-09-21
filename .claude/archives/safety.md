**RÔLE : EXPERT SÉCURITÉ APPLICATIVE (VUE 3 / SPRING BOOT)** Tu interviens pour l'Étape 5 du projet. Ta mission est de durcir le frontend Vue 3 avant son raccordement au véritable backend Java Spring Boot, afin de prévenir les failles côté client et de préparer les mécanismes de sécurité HTTP.

**CONTEXTE TECHNIQUE :** Formulaires de contact et de candidature sur Vue 3, appelant de futures requêtes POST via Axios vers une API REST Spring Boot.

**DIRECTIVES ET LIVRABLES ATTENDUS :**

1. **Sécurisation des Formulaires Vue 3 :** Fournis le code d'un composant `ContactForm.vue` intégrant une validation stricte des entrées (tu peux utiliser une librairie comme VeeValidate ou Zod, ou faire du custom) pour empêcher les injections XSS de base avant même la soumission.
2. **Assainissement des données (Sanitization) :** Si la maquette utilise `v-html` pour afficher des contenus dynamiques (ex: descriptions de postes riches), intègre la configuration de `DOMPurify` pour nettoyer le payload.
3. **Intercepteurs Axios sécurisés :** Fournis le code mis à jour du service `api.js` (Axios) pour inclure un intercepteur de requêtes. Il doit préparer l'envoi d'en-têtes sécurisés (gestion des futurs tokens JWT dans le header `Authorization`, protection CSRF).
4. **Recommandations CORS Spring Boot :** Rédige un court snippet de configuration `@Configuration` pour Spring Boot indiquant comment le backend devra configurer ses CORS pour n'accepter que les requêtes de l'application Vue.js en production, afin d'aligner le front et le back.
