<template>
  <div class="antialiased text-white">
    <!-- Global Navigation -->
    <AppNavigation v-if="!hideChrome" />

    <!-- Main Content -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <!-- Global Music Player -->
    <AppPlayer v-if="!hidePlayer" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppNavigation from './components/AppNavigation.vue'
import AppPlayer from './components/AppPlayer.vue'

const route = useRoute()
const hideChrome = computed(() => Boolean(route.meta?.hideChrome))
const hidePlayer = computed(() => Boolean(route.meta?.hidePlayer))
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
}

.fade-leave-to {
  opacity: 0;
}
</style>
