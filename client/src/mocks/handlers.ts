import { http, HttpResponse } from 'msw'

/**
 * Handlers de mock — permettent au front d'avancer sans backend
 * (cf. protocole de travail en parallèle).
 *
 * Les fixtures doivent être conformes à src/types/api.ts. Elles sont ajoutées
 * à l'étape suivante, en même temps que les vues qui les consomment.
 */
export const handlers = [http.get('/api/v1/health', () => HttpResponse.json({ status: 'UP' }))]
