import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      'vue/html-self-closing': 'off',
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    files: ['layers/**/domain/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '#app',
                '#imports',
                'nuxt',
                'vue',
                'vue-router',
                'drizzle-orm',
                'better-auth',
                'redis',
                '@aws-sdk/*',
                'openai',
                '**/infrastructure/**',
                '**/presentation/**',
              ],
              message:
                'Domain은 프레임워크와 Infrastructure에 의존할 수 없습니다. Port 또는 Application 경계를 사용하세요.',
            },
          ],
        },
      ],
    },
  },
)
