<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { chatFlow } from '@/data/chatbotFlow'
import { useSeo } from '@/composables/useSeo'
import TheFooter from '@/components/layout/TheFooter.vue'
import teamPhoto from '@/assets/images/padel-equipe.jpg'

useSeo({
  title: 'Discutons',
  description:
    "Deux minutes de questions valent mieux qu'un formulaire de contact. Discutez avec Faceelbot.",
})

interface Message {
  sender: 'bot' | 'user'
  text: string
}

const isTyping = ref(false)
const currentStepId = ref('start')
const stepHistory = ref<string[]>([])
const chatHistory = ref<Message[]>([])
const chatContainer = ref<HTMLElement | null>(null)
/** Contexte utilisateur mémorisé tout au long du tunnel (cf. `chatbotFlow.ts`) :
 *  Nom, Email, Téléphone, Projet — réutilisé pour personnaliser les messages
 *  et pour construire le `mailto:` final. */
const userName = ref('')
const userEmail = ref('')
const userPhone = ref('')
const userProjet = ref('')
const currentSubject = ref('')
const userInput = ref('')

const SUBJECT_LABELS: Record<string, string> = {
  collect_email_projet: 'Projet client',
  collect_email_candidature: 'Candidature',
  collect_email_cafe: 'Café',
  collect_email_ia: 'Data & IA',
  collect_email_fallback: 'Question',
}

const currentStep = computed(() => chatFlow[currentStepId.value])

function personalize(text: string) {
  return text.replace(/\{\{name\}\}/g, userName.value)
}

async function scrollToBottom() {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

watch(chatHistory, scrollToBottom, { deep: true })

async function simulateBotTyping(messages: string[]) {
  for (const raw of messages) {
    isTyping.value = true
    await scrollToBottom()
    await new Promise((r) => setTimeout(r, 800))
    isTyping.value = false
    chatHistory.value.push({ sender: 'bot', text: personalize(raw) })
    await scrollToBottom()
  }
}

watch(
  () => chatHistory.value.length === 0,
  (empty) => {
    if (empty) simulateBotTyping(chatFlow['start']?.messages ?? [])
  },
  { immediate: true },
)

const dynamicAction = computed(() => {
  const action = currentStep.value?.action
  if (!action) return undefined
  if (!action.url.startsWith('mailto:')) return action
  const subject = encodeURIComponent(`[Faceelbot] ${currentSubject.value} — ${userName.value}`)
  const body = encodeURIComponent(
    `Nom : ${userName.value}\nE-mail : ${userEmail.value}\nTéléphone : ${userPhone.value || 'non renseigné'}\nSujet : ${currentSubject.value}\nProjet : ${userProjet.value || 'non renseigné'}`,
  )
  return { label: action.label, url: `${action.url}?subject=${subject}&body=${body}` }
})

async function handleOptionClick(option: { label: string; next: string }) {
  stepHistory.value.push(currentStepId.value)
  chatHistory.value.push({ sender: 'user', text: option.label })
  if (option.next.startsWith('collect_email')) {
    currentSubject.value = SUBJECT_LABELS[option.next] ?? option.next
  }
  currentStepId.value = option.next
  await scrollToBottom()
  await simulateBotTyping(chatFlow[option.next]?.messages ?? [])
}

async function goBack() {
  if (stepHistory.value.length === 0) return
  chatHistory.value.push({ sender: 'user', text: '⬅ Retour' })
  const previousStep = stepHistory.value.pop()!
  currentStepId.value = previousStep
  await scrollToBottom()
  await simulateBotTyping(chatFlow[previousStep]?.messages ?? [])
}

async function handleTextSubmit() {
  const step = currentStep.value
  const value = userInput.value.trim()
  if (!step?.inputType || !value) return

  if (currentStepId.value === 'start') {
    userName.value = value
  } else if (currentStepId.value.startsWith('collect_email')) {
    userEmail.value = value
  } else if (currentStepId.value === 'collect_phone') {
    userPhone.value = value
  } else if (currentStepId.value === 'collect_details') {
    userProjet.value = value
  }

  chatHistory.value.push({ sender: 'user', text: value })
  userInput.value = ''
  await scrollToBottom()

  if (!step.nextStep) return
  stepHistory.value.push(currentStepId.value)
  currentStepId.value = step.nextStep
  await simulateBotTyping(chatFlow[step.nextStep]?.messages ?? [])
}

function resetConversation() {
  chatHistory.value = []
  stepHistory.value = []
  currentStepId.value = 'start'
  userName.value = ''
  userEmail.value = ''
  userPhone.value = ''
  userProjet.value = ''
  currentSubject.value = ''
  userInput.value = ''
  simulateBotTyping(chatFlow['start']?.messages ?? [])
}
</script>

<template>
  <!-- CONTENEUR SNAP OPT-IN : isole le scroll magnétique de cette vue sans
       dépendre de la hauteur flexée de <main> (cf. HomeView.vue). -->
  <div class="h-dvh w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory">
    <!-- Section split-screen : presentation + chatbot, un seul ecran -->
    <!-- espace navbar -->
    <section
      class="h-[100dvh] w-full shrink-0 snap-start snap-always overflow-hidden pt-[var(--navbar-height)] flex flex-col lg:flex-row"
    >
      <!-- Colonne gauche : zone institutionnelle (image & branding) -->
      <section
        data-theme="dark"
        class="relative flex h-1/3 w-full flex-col justify-end overflow-hidden bg-primary-950 bg-cover bg-center p-8 md:p-16 lg:h-full lg:w-1/2"
        :style="{ backgroundImage: `url(${teamPhoto})` }"
      >
        <div class="absolute inset-0 bg-blue-950/70" aria-hidden="true" />

        <div class="relative z-10">
          <p
            class="inline-block rounded-full bg-accent-500 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-950"
          >
            TRAVAILLER CHEZ FACEEL-IT
          </p>
          <h1 class="mt-4 font-display text-4xl font-bold text-white">
            On recrute d'abord le profil. La mission vient après.
          </h1>
          <p class="mt-4 text-lg font-medium text-gray-100 drop-shadow-md">
            Près de 70 % de CDI, 100 % de replacés en intercontrat. Discutez avec Faceelbot pour
            comprendre pourquoi on ne gère pas nos équipes comme une variable d'ajustement.
          </p>
        </div>
      </section>

      <!-- Colonne droite : chat, prend l'espace restant -->
      <section class="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-blue-950 lg:w-1/2">
        <div class="p-8 pb-0 md:p-16 md:pb-0">
          <div class="flex items-center gap-3">
            <span
              class="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-500 font-bold text-black"
              aria-hidden="true"
            >
              F
            </span>
            <span class="text-sm font-semibold uppercase tracking-widest text-white/60">
              FACEELBOT
            </span>
          </div>

          <h2 class="mt-6 font-display text-2xl font-bold text-white">Bonjour, on discute ?</h2>
        </div>

        <div class="mt-6 flex flex-1 flex-col overflow-hidden">
          <!-- Historique — seule zone scrollable -->
          <div
            ref="chatContainer"
            class="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 md:p-8"
          >
            <div
              v-for="(msg, index) in chatHistory"
              :key="index"
              :class="msg.sender === 'user' ? 'flex justify-end' : 'flex items-end gap-2'"
            >
              <span
                v-if="msg.sender === 'bot'"
                class="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-black"
                aria-hidden="true"
              >
                F
              </span>
              <span
                :class="[
                  'max-w-[75%] rounded-2xl px-4 py-2 text-sm text-white',
                  msg.sender === 'user'
                    ? 'rounded-br-sm border border-green-500/40 bg-accent-500/20'
                    : 'rounded-bl-sm border border-white/10 bg-white/5',
                ]"
              >
                {{ msg.text }}
              </span>
            </div>

            <!-- Bulle typing indicator -->
            <div v-if="isTyping" class="flex items-end gap-2">
              <span
                class="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-black"
                aria-hidden="true"
              >
                F
              </span>
              <span class="rounded-2xl rounded-bl-sm border border-white/10 bg-white/5 px-4 py-3">
                <span class="flex gap-1">
                  <span
                    class="h-2 w-2 animate-bounce rounded-full bg-white/40 [animation-delay:0ms] motion-reduce:animate-none"
                  />
                  <span
                    class="h-2 w-2 animate-bounce rounded-full bg-white/40 [animation-delay:150ms] motion-reduce:animate-none"
                  />
                  <span
                    class="h-2 w-2 animate-bounce rounded-full bg-white/40 [animation-delay:300ms] motion-reduce:animate-none"
                  />
                </span>
              </span>
            </div>
          </div>

          <!-- Interactions : saisie, action et options peuvent coexister selon l'étape -->
          <div v-if="!isTyping" class="px-4 pb-4 md:px-8 md:pb-8">
            <div class="flex flex-col gap-2">
              <!-- Saisie libre (text / email / tel) -->
              <form
                v-if="currentStep?.inputType"
                class="flex items-center gap-2"
                @submit.prevent="handleTextSubmit"
              >
                <input
                  v-model="userInput"
                  :type="currentStep.inputType"
                  :placeholder="currentStep.inputPlaceholder"
                  class="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
                />
                <button
                  type="submit"
                  class="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-500 text-primary-900 transition hover:bg-accent-400"
                  aria-label="Envoyer"
                >
                  <svg class="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path
                      d="M4 10h12m-5-5 5 5-5 5"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </form>

              <!-- Action finale (mailto construit dynamiquement, ou lien externe) -->
              <a
                v-if="dynamicAction"
                :href="dynamicAction.url"
                class="flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-4 py-3 text-center text-sm font-semibold text-primary-900 transition hover:bg-accent-400"
              >
                {{ dynamicAction.label }}
                <svg class="size-4 shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="M4 10h12m-5-5 5 5-5 5"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </a>

              <!-- Options (peuvent coexister avec saisie ou action) -->
              <template v-if="currentStep?.options">
                <button
                  v-for="option in currentStep.options"
                  :key="option.next"
                  type="button"
                  class="rounded-xl border border-white/20 px-4 py-2 text-left text-sm text-white transition hover:border-accent-500 hover:bg-white/5"
                  @click="handleOptionClick(option)"
                >
                  {{ option.label }}
                </button>
              </template>
            </div>

            <button
              v-if="currentStepId !== 'start'"
              type="button"
              class="mt-3 text-sm text-white/50 underline underline-offset-2 transition-colors hover:text-white"
              @click="goBack"
            >
              ⬅ Retour à l'étape précédente
            </button>
          </div>

          <!-- Footer du bot -->
          <div
            class="flex items-center justify-between gap-4 border-t border-white/10 px-4 py-4 md:px-8"
          >
            <a
              href="mailto:contact@faceel-it.com"
              class="text-xs text-gray-400 transition-colors hover:text-white"
            >
              Parler à un humain
            </a>
            <button
              type="button"
              class="text-xs text-gray-400 transition-colors hover:text-white"
              @click="resetConversation"
            >
              Recommencer la conversation
            </button>
          </div>
        </div>
      </section>
    </section>

    <!-- Footer repris dans le flux snap local (cf. HomeView.vue) ; App.vue
       masque son footer global pour cette route pour éviter le doublon. -->
    <section
      data-theme="dark"
      class="h-dvh w-full shrink-0 snap-start snap-always flex flex-col justify-end bg-[#000066]"
    >
      <TheFooter />
    </section>
  </div>
  <!-- /conteneur snap -->
</template>
