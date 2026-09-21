import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

/** Activé uniquement si VITE_USE_MOCKS=true en développement (cf. main.ts). */
export const worker = setupWorker(...handlers)
