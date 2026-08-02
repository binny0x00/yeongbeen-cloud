<template>
  <div class="min-h-screen bg-canvas">
    <a
      href="#main-content"
      class="type-label fixed top-3 left-3 z-50 -translate-y-24 bg-inverse px-4 py-2 text-ink-inverse focus:translate-y-0"
    >
      본문으로 이동
    </a>

    <div class="px-[var(--layout-page-gutter)] pt-5 desktop:hidden">
      <AppHeader />
    </div>

    <div
      class="mx-auto w-full max-w-[1440px] desktop:grid desktop:grid-cols-[440px_minmax(0,1000px)] desktop:items-start"
    >
      <IdentitySidebar />
      <main
        id="main-content"
        class="min-w-0 px-[var(--layout-page-gutter)] pt-12 pb-12 desktop:px-[72px] desktop:py-[72px]"
      >
        <slot />
      </main>
    </div>
  </div>
</template>
