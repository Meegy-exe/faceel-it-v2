import type { AxiosError } from 'axios'
import axios from 'axios'
import type { ApiProblem } from '@/types/api'

/**
 * Instance Axios unique. Aucun composant ne doit importer `axios`
 * directement : tout passe par ici, puis par services/api/*.
 */
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
  headers: { Accept: 'application/json' },
})

/** Erreur applicative normalisée, quelle que soit la cause (réseau, HTTP, CORS). */
export class ApiError extends Error {
  constructor(
    override readonly message: string,
    readonly status: number,
    readonly problem: ApiProblem | null,
  ) {
    super(message)
    this.name = 'ApiError'
  }

  /** Erreurs de validation indexées par champ, pour vee-validate. */
  get fieldErrors(): Record<string, string> {
    return Object.fromEntries((this.problem?.errors ?? []).map((e) => [e.field, e.message]))
  }
}

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiProblem>) => {
    const problem = error.response?.data ?? null
    const status = error.response?.status ?? 0
    const message =
      problem?.detail ??
      (status === 0 ? 'Service indisponible. Réessayez dans un instant.' : error.message)

    return Promise.reject(new ApiError(message, status, problem))
  },
)
