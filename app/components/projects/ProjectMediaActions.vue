<script setup lang="ts">
import { getYouTubeEmbedUrl } from '~~/shared/utils/youtube'

const props = defineProps<{
  repository?: string
  title: string
  website?: string
  youtube?: string
}>()

const youtubeEmbedUrl = computed(() => (props.youtube ? getYouTubeEmbedUrl(props.youtube) : null))

const hasExternalLinks = computed(() => Boolean(props.repository || props.website))
</script>

<template>
  <div v-if="hasExternalLinks || youtubeEmbedUrl" class="flex flex-col gap-8">
    <nav v-if="hasExternalLinks" aria-label="프로젝트 외부 링크" class="flex items-center gap-3">
      <a
        v-if="repository"
        :href="repository"
        target="_blank"
        rel="noreferrer"
        :aria-label="`${title} GitHub 저장소 새 창에서 열기`"
        class="group inline-flex size-11 items-center justify-center rounded-full border border-border bg-transparent text-ink-muted transition-[color,border-color,transform] duration-200 hover:border-stroke-strong hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent motion-safe:hover:-translate-y-1 motion-safe:focus-visible:-translate-y-1"
        title="GitHub 저장소"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          class="size-5 fill-current transition-transform duration-200 motion-safe:group-hover:scale-110 motion-safe:group-focus-visible:scale-110"
        >
          <path
            d="M12 2C6.48 2 2 6.59 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.91-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05A9.36 9.36 0 0 1 12 6.99a9.3 9.3 0 0 1 2.5.35c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.27 10.27 0 0 0 22 12.25C22 6.59 17.52 2 12 2Z"
          />
        </svg>
      </a>

      <a
        v-if="website"
        :href="website"
        target="_blank"
        rel="noreferrer"
        :aria-label="`${title} 배포 사이트 새 창에서 열기`"
        class="group inline-flex size-11 items-center justify-center rounded-full border border-border bg-transparent text-ink-muted transition-[color,border-color,transform] duration-200 hover:border-stroke-strong hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent motion-safe:hover:-translate-y-1 motion-safe:focus-visible:-translate-y-1"
        title="배포 사이트"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          class="size-5 fill-none stroke-current transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-focus-visible:translate-x-0.5 motion-safe:group-focus-visible:-translate-y-0.5"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M14 5h5v5" />
          <path d="m10 14 9-9" />
          <path d="M19 13v6H5V5h6" />
        </svg>
      </a>
    </nav>

    <section v-if="youtubeEmbedUrl" :aria-label="`${title} 영상`">
      <div
        class="aspect-video overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface"
      >
        <iframe
          :src="youtubeEmbedUrl"
          :title="`${title} YouTube 영상`"
          class="size-full"
          loading="lazy"
          referrerpolicy="strict-origin-when-cross-origin"
          allow="
            accelerometer;
            autoplay;
            clipboard-write;
            encrypted-media;
            gyroscope;
            picture-in-picture;
            web-share;
          "
          allowfullscreen
        />
      </div>
    </section>
  </div>
</template>
