<template>
  <div class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
    <div class="ios-glass-player px-4 py-3 rounded-[2rem] flex items-center gap-5 min-w-[420px]">
      <div class="size-14 rounded-2xl overflow-hidden shrink-0 shadow-lg border border-white/10">
        <div class="w-full h-full bg-cover bg-center" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuB1cTdNnDkx3cYGJAHYTwAZoD6JhryILuFN_j4GKPjANEXVMKQvEhNYlZsu_JcCyyLQnv5cac1Iz2eCtzPjYX7fxR6FgwSVcu6cfSQWzwsJ3Ye1rn1M5D5ojJ82-aV66nQBluCjDbfo2_Z0CPFkbnFvWox16b6Xzt-5uBf6jjSyr4Dg5ZsdmD2c_QHHXjyVX67m3pNFwaPGpmqaql_mPcqi1lz54MUQER8XTuw_oNLXlbkckHhurry86KxqC8ciQxnm01X8CHnXoVc");'></div>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-2">
          <div class="truncate">
            <p class="text-[14px] font-semibold truncate leading-tight tracking-tight text-white">Rainy Day Melody</p>
            <p class="text-[12px] text-white/40 truncate tracking-tight">Atmosphere Artist</p>
          </div>
          <div class="flex items-center gap-5 ml-6">
            <button class="text-white/60 hover:text-white transition-colors">
              <span class="material-symbols-outlined text-[20px]">skip_previous</span>
            </button>
            <button class="size-9 rounded-full bg-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
              <span class="material-symbols-outlined text-black text-[24px] fill-current">play_arrow</span>
            </button>
            <button class="text-white/60 hover:text-white transition-colors">
              <span class="material-symbols-outlined text-[20px]">skip_next</span>
            </button>
          </div>
        </div>
        <div class="relative w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div class="absolute top-0 left-0 h-full w-[35%] bg-white/60 rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.ios-glass-player {
  background: rgba(15, 15, 15, 0.4);
  backdrop-filter: blur(32px) saturate(200%);
  -webkit-backdrop-filter: blur(32px) saturate(200%);
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}
</style>
