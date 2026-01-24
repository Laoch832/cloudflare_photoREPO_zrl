<template>
  <div id="app" class="antialiased">
    <!-- Global Music Widget (Hidden on Music Page) -->
    <MusicPlayer v-if="!isMusicPage" />

    <!-- Main Content -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MusicPlayer from './components/MusicPlayer.vue'

const route = useRoute()

const isMusicPage = computed(() => route.path === '/music')
</script>

<style>
/* Global Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
