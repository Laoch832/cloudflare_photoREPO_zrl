<template>
  <div id="app" class="antialiased">
    <MusicPlayer v-if="!hidePlayer" />
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
const hidePlayer = computed(() => Boolean(route.meta?.hidePlayer) || Boolean(route.meta?.hideChrome))
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
