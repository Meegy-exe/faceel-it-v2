import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/coverage/**', '**/node_modules/**'],
  },

  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  skipFormatting,

  {
    name: 'app/rules',
    rules: {
      // Force la convention MultiWord sauf pour les vues routées.
      'vue/multi-word-component-names': 'error',
      // Un import de type doit être explicite : requis par verbatimModuleSyntax.
      '@typescript-eslint/consistent-type-imports': 'error',
      /* Incompatible avec `exactOptionalPropertyTypes` (arbitrage n°2) : la
         règle exige un défaut sur chaque prop optionnelle, or TypeScript
         refuse `prop: undefined` dans `withDefaults` sous cette option. Le
         typage `prop?: T` documente déjà l'absence, et la règle n'apporte rien
         hors API Options. */
      'vue/require-default-prop': 'off',
    },
  },
)
