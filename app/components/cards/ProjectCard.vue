<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    category: string
    description: string
    external?: boolean
    index: number
    outcome: string
    outcomeLabel: string
    tags: string[]
    title: string
    titleLines?: string[]
    to: string
  }>(),
  {
    external: false,
    titleLines: undefined,
  },
)

const NuxtLink = resolveComponent('NuxtLink')
const linkComponent = computed(() => (props.external ? 'a' : NuxtLink))

const formattedIndex = computed(() => String(props.index).padStart(2, '0'))
const displayedTitleLines = computed(() => props.titleLines ?? [props.title])
</script>

<template>
  <article class="w-full">
    <component
      :is="linkComponent"
      :aria-label="`${title} 프로젝트 보기${external ? ', 새 창' : ''}`"
      class="group relative grid w-full grid-cols-1 gap-4 overflow-hidden border-t-2 border-stroke-strong py-7 no-underline transition-[background-color,transform] duration-300 ease-out hover:bg-surface/60 focus-visible:bg-surface/60 motion-safe:hover:-translate-y-0.5 motion-safe:focus-visible:-translate-y-0.5 tablet:grid-cols-[4rem_minmax(12rem,18.75rem)_1fr] tablet:gap-6"
      :href="external ? to : undefined"
      :rel="external ? 'noreferrer' : undefined"
      :target="external ? '_blank' : undefined"
      :to="external ? undefined : to"
    >
      <span
        aria-hidden="true"
        class="absolute top-0 bottom-0 left-0 w-1 origin-bottom scale-y-0 bg-accent transition-transform duration-300 ease-out motion-safe:group-hover:scale-y-100 motion-safe:group-focus-visible:scale-y-100"
      />

      <p class="type-heading-sm text-ink-accent-primary" aria-hidden="true">
        {{ formattedIndex }}
      </p>

      <div class="min-w-0" data-project-media-slot>
        <h3
          class="type-display-identity transition-transform duration-300 ease-out motion-safe:group-hover:translate-x-2 motion-safe:group-focus-visible:translate-x-2"
        >
          <span v-for="line in displayedTitleLines" :key="line" class="block">{{ line }}</span>
        </h3>
      </div>

      <div class="flex min-w-0 flex-col gap-3">
        <p class="type-mono-sm text-ink-muted">{{ category }}</p>
        <p class="type-body-md text-ink-muted">{{ description }}</p>

        <div class="flex items-start gap-3 border-l-2 border-accent pl-3" data-project-outcome>
          <p class="type-label shrink-0 text-ink-accent-primary">{{ outcomeLabel }}</p>
          <p class="type-body-sm font-semibold text-ink">{{ outcome }}</p>
        </div>

        <div class="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 pt-1">
          <p class="type-label max-w-[34rem] text-ink-accent">{{ tags.join(' · ') }}</p>
          <p
            class="type-label whitespace-nowrap text-ink transition-[color,transform] duration-300 ease-out group-hover:text-ink-accent-primary group-focus-visible:text-ink-accent-primary motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1"
          >
            CASE STUDY&nbsp; ↗
          </p>
        </div>
      </div>
    </component>
  </article>
</template>
