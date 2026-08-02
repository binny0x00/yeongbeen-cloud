<script setup lang="ts">
type CompanionState = 'hidden' | 'idle' | 'run' | 'walk'

const sections = ['about', 'experience', 'projects', 'writing', 'contact'] as const
type SectionId = (typeof sections)[number]

const labels: Record<SectionId, string> = {
  about: 'OVERVIEW',
  contact: 'CONTACT',
  experience: 'EXPERIENCE',
  projects: 'PROJECTS',
  writing: 'NOTES',
}

const activeSection = ref<SectionId>('about')
const state = ref<CompanionState>('hidden')
const isVisible = ref(false)

let observer: IntersectionObserver | undefined
let settleTimer: ReturnType<typeof setTimeout> | undefined

function settleAfterMotion() {
  if (settleTimer) clearTimeout(settleTimer)
  settleTimer = setTimeout(() => {
    state.value = 'idle'
  }, 360)
}

function showWithState(nextState: Exclude<CompanionState, 'hidden'>) {
  isVisible.value = true
  state.value = nextState
  settleAfterMotion()
}

function revealAfterFirstScroll() {
  if (isVisible.value || window.scrollY < 48) return
  showWithState('walk')
  window.removeEventListener('scroll', revealAfterFirstScroll)
}

function reactToProject() {
  if (isVisible.value) showWithState('run')
}

onMounted(() => {
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    isVisible.value = true
    state.value = 'idle'
  } else {
    window.addEventListener('scroll', revealAfterFirstScroll, { passive: true })
    revealAfterFirstScroll()
  }

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      entries => {
        const visibleEntry = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (!visibleEntry?.target.id || !sections.includes(visibleEntry.target.id as SectionId)) {
          return
        }

        const nextSection = visibleEntry.target.id as SectionId
        if (nextSection === activeSection.value) return

        activeSection.value = nextSection
        if (isVisible.value && !prefersReducedMotion) showWithState('walk')
      },
      { rootMargin: '-18% 0px -62% 0px', threshold: [0, 0.15, 0.4] },
    )

    sections.forEach(sectionId => {
      const section = document.getElementById(sectionId)
      if (section) observer?.observe(section)
    })
  }

  document
    .querySelectorAll<HTMLElement>('[data-project-media-slot]')
    .forEach(project => project.addEventListener('mouseenter', reactToProject))
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', revealAfterFirstScroll)
  observer?.disconnect()
  if (settleTimer) clearTimeout(settleTimer)
  document
    .querySelectorAll<HTMLElement>('[data-project-media-slot]')
    .forEach(project => project.removeEventListener('mouseenter', reactToProject))
})
</script>

<template>
  <div
    class="pet-companion"
    :class="`pet-companion--${state}`"
    :data-state="state"
    :aria-hidden="!isVisible"
  >
    <div class="pet-companion__stage" aria-hidden="true">
      <!-- prettier-ignore -->
      <img src="/pet-companion.png" alt="" width="104" height="104" class="pet-companion__image">
      <span class="pet-companion__dot" />
    </div>

    <div class="flex flex-col gap-1" aria-live="polite">
      <p class="type-label text-ink-muted">CLOUD COMPANION</p>
      <p class="type-body-sm text-ink-muted">
        현재 {{ labels[activeSection] }} 기록을 함께 보고 있어요.
      </p>
    </div>
  </div>
</template>

<style scoped>
.pet-companion {
  display: flex;
  width: 300px;
  flex-direction: column;
  gap: 8px;
  margin-top: 14px;
  transition:
    opacity 240ms ease,
    visibility 240ms ease;
}

.pet-companion--hidden {
  visibility: hidden;
  opacity: 0;
}

.pet-companion__stage {
  position: relative;
  width: 136px;
  height: 108px;
  overflow: hidden;
}

.pet-companion__image {
  position: absolute;
  right: 8px;
  bottom: 0;
  width: 104px;
  height: 104px;
  object-fit: contain;
  transform-origin: 50% 100%;
  transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
}

.pet-companion__dot {
  position: absolute;
  top: 8px;
  right: 4px;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--color-bg-accent);
}

.pet-companion--hidden .pet-companion__image {
  transform: translateY(100%);
}

.pet-companion--walk .pet-companion__image {
  transform: translateX(6px);
}

.pet-companion--run .pet-companion__image {
  transform: translateX(8px) rotate(1deg);
}

.pet-companion--idle .pet-companion__image {
  transform: translate(0);
}

@media (prefers-reduced-motion: reduce) {
  .pet-companion,
  .pet-companion__image {
    transition: none;
  }
}
</style>
