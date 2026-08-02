<template>
  <section
    id="about"
    aria-labelledby="about-title"
    class="flex w-full scroll-mt-8 flex-col items-start gap-6"
  >
    <SectionLabel :index="1" label="ABOUT" />

    <h2 id="about-title" class="type-heading-md text-ink">
      <span class="desktop:hidden">화면과 그 뒤의 구조를 함께 설계합니다.</span>
      <span class="hidden desktop:inline">
        사용자에게 보이는 화면과 그 뒤의 구조를 함께 설계합니다.
      </span>
    </h2>

    <p
      class="font-sans text-[16px] leading-[26px] text-ink-muted desktop:text-[18px] desktop:leading-[30px]"
    >
      <span class="desktop:hidden">
        Android와 Flutter를 거쳐 웹 프론트엔드로 확장했습니다. 현재는 컴포넌트 설계, API 상태 관리,
        성능·접근성, 배포 흐름을 하나의 제품 경험으로 연결하는 데 집중합니다.
      </span>
      <span class="hidden desktop:inline">
        의공학을 전공하며 기술이 사람의 행동과 경험을 바꾸는 방식에 관심을 가졌습니다. Android와
        Flutter를 거쳐 웹 프론트엔드로 영역을 확장했고, 현재는 컴포넌트 설계와 API 상태 관리,
        성능·접근성, 배포 흐름을 하나의 제품 경험으로 연결하는 데 집중하고 있습니다.
      </span>
    </p>

    <aside
      aria-label="AI 활용 원칙"
      class="w-full rounded-md bg-accent p-4 text-[var(--color-text-on-accent)] desktop:p-6"
    >
      <p class="type-heading-sm">
        <span class="desktop:hidden"> AI로 속도를 높이되 품질과 검증은 개발자가 책임집니다. </span>
        <span class="hidden desktop:inline">
          AI로 속도를 높이되, 구조·품질·검증·배포에 대한 판단은 개발자가 책임집니다.
        </span>
      </p>
    </aside>
  </section>
</template>
