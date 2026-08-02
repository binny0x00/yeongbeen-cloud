import type { Ref } from 'vue'

export function useRevealMotion(root: Ref<HTMLElement | null>) {
  let animationFrame: number | undefined
  let observer: IntersectionObserver | undefined

  onMounted(() => {
    const rootElement = root.value
    if (!rootElement) return

    const targets = Array.from(rootElement.querySelectorAll<HTMLElement>('[data-reveal]'))
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      rootElement.dataset.motion = prefersReducedMotion ? 'reduced' : 'static'
      targets.forEach(target => target.classList.add('is-visible'))
      return
    }

    rootElement.dataset.motion = 'enabled'
    observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return

          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
    )

    targets.forEach(target => observer?.observe(target))
    animationFrame = window.requestAnimationFrame(() => targets[0]?.classList.add('is-visible'))
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame)
  })
}
