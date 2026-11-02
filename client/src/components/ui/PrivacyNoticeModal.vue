<script setup lang="ts">
defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        @click.self="emit('close')"
      >
        <div class="flex w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl">
          <div
            class="flex items-center justify-between gap-4 rounded-t-2xl border-b border-gray-100 px-6 py-4"
          >
            <h2 class="font-display text-lg font-bold text-primary-900">Avis de confidentialité</h2>
            <button
              type="button"
              class="shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label="Fermer"
              @click="emit('close')"
            >
              <svg class="size-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
                />
              </svg>
            </button>
          </div>
          <!-- Contenu repris de PrivacyPolicyView.vue (texte brut, sans navbar/footer). -->
          <div class="overflow-y-auto p-6 max-h-[70vh] text-slate-700 text-sm">
            <p>
              Vous trouverez ici les informations relatives aux traitements de vos données
              personnelles : où, quand, comment, pourquoi nous les traitons, et quels sont vos
              droits.
            </p>

            <h3 class="mt-6 font-bold text-primary-900">
              1. Qui est le responsable de traitement ?
            </h3>
            <p class="mt-2">Les données que vous nous confiez sont traitées par :</p>
            <p class="mt-2 font-medium text-primary-900">
              Faceel-IT, Entreprise de Services Numériques (ESN)<br />
              Siège social : 10 allée du Château Blanc, 59290 Wasquehal<br />
              SIRET : [À VENIR]
            </p>
            <p class="mt-2">Faceel-IT agit en tant que responsable de traitement.</p>

            <h3 class="mt-6 font-bold text-primary-900">
              2. Pourquoi collectons-nous vos données ?
            </h3>
            <p class="mt-2">
              Vos données personnelles sont collectées pour différents usages (les finalités de
              traitement). Ces traitements s'appuient systématiquement sur un fondement juridique
              valable (la base légale) :
            </p>
            <ul class="mt-2 list-disc space-y-1 pl-5">
              <li>
                <strong>Une obligation légale :</strong> pour nous conformer à nos obligations
                légales et réglementaires.
              </li>
              <li>
                <strong>Un contrat :</strong> pour exécuter un contrat conclu avec vous ou vous
                fournir des informations précontractuelles.
              </li>
              <li>
                <strong>Nos intérêts légitimes :</strong> pour répondre à nos besoins
                organisationnels et de sécurité.
              </li>
              <li>
                <strong>Votre consentement :</strong> lorsque vous avez explicitement accepté un
                traitement spécifique.
              </li>
            </ul>

            <h3 class="mt-6 font-bold text-primary-900">3. Transfert et sécurité des données</h3>
            <p class="mt-2">
              Les data centers sur lesquels sont hébergées vos données sont localisés exclusivement
              en France ou en Europe. Faceel-IT prend toutes les précautions d'usage pour préserver
              la sécurité de vos données contre toute perte, accès, modification, ou divulgation non
              autorisée.
            </p>

            <h3 class="mt-6 font-bold text-primary-900">4. Vos droits</h3>
            <p class="mt-2">
              Selon la base légale du traitement, vous disposez des droits suivants : accès,
              rectification, retrait du consentement, limitation, portabilité, opposition,
              effacement, et droit post-mortem.
            </p>

            <h3 class="mt-6 font-bold text-primary-900">5. Exercer vos droits</h3>
            <p class="mt-2">
              Pour toute question ou demande d'exercice de vos droits :
              <a
                href="mailto:contact@faceel-it.com"
                class="font-medium text-[#000066] underline underline-offset-2 hover:opacity-80"
                >contact@faceel-it.com</a
              >
              — ou par courrier : Faceel-IT, 10 allée du Château Blanc, 59290 Wasquehal.
            </p>
            <p class="mt-2">
              Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une
              réclamation à la CNIL.
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
