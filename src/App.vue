<template>
  <div class="pt-4 mb-4 sm:pt-0 sm:mb-0 sm:absolute sm:top-3 sm:right-3 z-10">
    <label class="grid cursor-pointer place-items-center">
      <input
        type="checkbox"
        class="toggle theme-controller bg-base-content col-span-2 col-start-1 row-start-1"
        v-model="isDarkMode"
        @change="toggleTheme"
        :class="{
          'bg-sky-600': !isDarkMode,  /* สีฟ้าสำหรับธีมสว่าง */
          'bg-indigo-800': isDarkMode, /* สีม่วงดำสำหรับธีมมืด */
          'transition-all': true, /* ให้การเปลี่ยนแปลงเนียนขึ้น */
        }"
      />
      <svg
        class="stroke-yellow-400 fill-yellow-400 col-start-1 row-start-1"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="5" />
        <path
          d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
        />
      </svg>
      <svg
        class="stroke-white fill-white col-start-2 row-start-1"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </label>
  </div>

  <div class="relative max-w-3xl mx-auto my-2 z-0">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'

const isDarkMode = ref(false)

const toggleTheme = () => {
  const theme = isDarkMode.value ? 'night' : 'cupcake'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

onMounted(() => {
  const saved = localStorage.getItem('theme') || 'cupcake'
  isDarkMode.value = saved === 'night'
  document.documentElement.setAttribute('data-theme', saved)
})
</script>
