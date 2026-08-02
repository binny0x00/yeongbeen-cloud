<template>
  <div
    class="min-h-screen bg-canvas px-[var(--layout-page-gutter)] pt-5 pb-12 desktop:pt-8 desktop:pb-[6.5rem]"
  >
    <div
      class="mx-auto flex w-full max-w-[var(--layout-content-max)] flex-col gap-12 desktop:gap-16"
    >
      <AppHeader />
      <main id="main-content">
        <slot />
      </main>
    </div>
  </div>
</template>
