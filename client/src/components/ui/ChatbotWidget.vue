<script setup lang="ts">
import { ref, computed, nextTick } from "vue"
import { chatFlow } from "@/data/chatbotFlow"
import type { ChatOption } from "@/data/chatbotFlow"

interface Message {
  sender: "bot" | "user"
  text: string
}

const isOpen = ref(false)
const isTyping = ref(false)
const currentStepId = ref("start")
const stepHistory = ref<string[]>([])
const chatHistory = ref<Message[]>([])
const messagesContainer = ref<HTMLElement | null>(null)

const currentStep = computed(() => chatFlow[currentStepId.value])

async function scrollToBottom() {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

async function simulateBotTyping(messages: string[]) {
  for (const text of messages) {
    isTyping.value = true
    await scrollToBottom()
    await new Promise((r) => setTimeout(r, 800))
    isTyping.value = false
    chatHistory.value.push({ sender: "bot", text })
    await scrollToBottom()
  }
}

async function openChat() {
  isOpen.value = true
  await scrollToBottom()
  if (chatHistory.value.length === 0) {
    await simulateBotTyping(chatFlow["start"].messages)
  }
}

async function handleOptionClick(option: ChatOption) {
  stepHistory.value.push(currentStepId.value)
  chatHistory.value.push({ sender: "user", text: option.label })
  currentStepId.value = option.next
  await scrollToBottom()
  await simulateBotTyping(chatFlow[option.next].messages)
}

async function goBack() {
  if (stepHistory.value.length === 0) return
  chatHistory.value.push({ sender: "user", text: "⬅ Retour" })
  const previousStep = stepHistory.value.pop()!
  currentStepId.value = previousStep
  await scrollToBottom()
  await simulateBotTyping(chatFlow[previousStep].messages)
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
    <!-- Fenêtre de chat -->
    <div
      v-if="isOpen"
      class="flex h-[500px] w-80 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl sm:w-96"
    >
      <!-- Header -->
      <div class="flex items-center justify-between bg-blue-950 px-4 py-3">
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-green-400"></span>
          <span class="font-semibold text-white">Faceel-IT</span>
        </div>
        <button
          class="text-white/70 transition hover:text-white"
          aria-label="Fermer le chat"
          @click="isOpen = false"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- Zone messages -->
      <div ref="messagesContainer" class="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">
        <div
          v-for="(msg, index) in chatHistory"
          :key="index"
          :class="msg.sender === 'user' ? 'flex justify-end' : 'flex justify-start'"
        >
          <span
            :class="[
              'max-w-[75%] rounded-2xl px-4 py-2 text-sm',
              msg.sender === 'user'
                ? 'rounded-br-sm bg-green-500 text-white'
                : 'rounded-bl-sm border border-gray-200 bg-white text-gray-800',
            ]"
          >
            {{ msg.text }}
          </span>
        </div>

        <!-- Bulle typing indicator -->
        <div v-if="isTyping" class="flex justify-start">
          <span class="rounded-2xl rounded-bl-sm border border-gray-200 bg-white px-4 py-3 text-sm">
            <span class="flex gap-1">
              <span class="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]"></span>
              <span class="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]"></span>
              <span class="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]"></span>
            </span>
          </span>
        </div>
      </div>

      <!-- Zone interactions -->
      <div class="border-t bg-white p-4">
        <div v-if="!isTyping">
          <!-- Options -->
          <div v-if="currentStep.options" class="flex flex-col gap-2">
            <button
              v-for="option in currentStep.options"
              :key="option.next"
              class="rounded-xl border border-gray-200 px-4 py-2 text-left text-sm text-gray-700 transition hover:border-green-500 hover:bg-green-50 hover:text-green-700"
              @click="handleOptionClick(option)"
            >
              {{ option.label }}
            </button>
          </div>

          <!-- Action finale -->
          <div v-else-if="currentStep.action">
            <router-link
              :to="currentStep.action.url"
              class="block w-full rounded-xl bg-blue-950 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-900"
              @click="isOpen = false"
            >
              {{ currentStep.action.label }}
            </router-link>
          </div>
          <button
            v-if="currentStepId !== 'start' && !isTyping"
            class="mt-3 w-full text-sm text-gray-500 transition-colors underline underline-offset-2 hover:text-blue-950"
            @click="goBack"
          >
            ⬅ Retour à l'étape précédente
          </button>
        </div>
      </div>
    </div>

    <!-- Bouton flottant -->
    <button
      v-if="!isOpen"
      class="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg transition hover:scale-105 hover:bg-green-600"
      aria-label="Ouvrir le chat"
      @click="openChat"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
      </svg>
    </button>
  </div>
</template>
