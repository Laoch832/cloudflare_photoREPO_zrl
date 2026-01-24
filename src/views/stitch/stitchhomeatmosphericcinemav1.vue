<template>
  <div class="bg-black font-sans text-white/90 antialiased overflow-hidden">
    <div class="fixed inset-0 z-0 overflow-hidden">
      <div
        class="absolute inset-0 bg-cover bg-center scale-105 blur-[100px] opacity-70"
        style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCXW2-dWMIb9nb69pFxqgWF7OjEVTqxBGud9l62LjCGje6QYLW0TpLpG3jOFlHv-z5CZD60v2dvnQA8g4NcGVXQm7Ka1ZGcr_c-npxxgI4vNovr6ZqcA-z7Jc5rqgHm42d0lIEpIKHeKL6MQsJFMafHXWiOjAxvw4Be6V-G5y61K5Pk6YQPA_M4ntbSc6J2j3J_rHlx_KFT1MoLg3izPeQz_LrngZ8IAbAZzPjEDzWhGFrvUaREvZ7mbwYC0o9q1n3bvITB34XG2Ic");'
      ></div>
      <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
      <div class="absolute inset-0 grain-texture"></div>
    </div>
    <header class="fixed top-0 left-0 right-0 z-50 ios-glass-nav h-16 flex items-center px-8">
      <div class="flex items-center gap-3 w-1/4">
        <div class="size-8 rounded-full ring-1 ring-white/20 p-0.5 overflow-hidden shadow-sm">
          <div
            class="w-full h-full bg-cover bg-center rounded-full"
            style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDgYG5fbrfAWYAbyZ7RmKq8IBLBAj6bbuVhR-COKsvf9zLkn7UK8IhEy7zQsn2FWb3n-Wf9-xvQX-ne5hKssruYZaOcM116VJWjTzmLyIO-LLLKLcBVtMQ_uL1ThysECYUBVxleFZSt_ZmhN-3s-mZrxirArEP9nN5vjZID5NmDaMMGXvXCEd8zsguRkntLDinf0r1jSD3Qf40ltscmLWb-HGfwakonh3J6UljgYOf7RI0eq2x4WHW49pdKb__McD7PxADWZ-jYgeY");'
          ></div>
        </div>
        <span class="text-xs font-semibold tracking-widest uppercase opacity-70">Sanctum</span>
      </div>
      <nav class="flex-1 flex justify-center items-center gap-1">
        <router-link
          to="/stitch/home-1"
          class="px-5 py-1.5 rounded-full text-sm font-medium bg-white/10 text-white transition-all"
        >
          Journal
        </router-link>
        <router-link
          to="/stitch/home-3"
          class="px-5 py-1.5 rounded-full text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all"
        >
          Gallery
        </router-link>
        <router-link
          to="/stitch/home-2"
          class="px-5 py-1.5 rounded-full text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all"
        >
          Crush List
        </router-link>
        <router-link
          to="/stitch/home-4"
          class="px-5 py-1.5 rounded-full text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all"
        >
          Playlist
        </router-link>
      </nav>
      <div class="w-1/4 flex justify-end gap-5">
        <button class="text-white/40 hover:text-white transition-colors">
          <span class="material-symbols-outlined text-[20px]">search</span>
        </button>
        <router-link to="/profile" class="text-white/40 hover:text-white transition-colors">
          <span class="material-symbols-outlined text-[20px]">settings</span>
        </router-link>
      </div>
    </header>
    <main class="relative z-10 h-screen w-full flex items-center justify-center pt-16 pb-32">
      <div class="max-w-7xl w-full px-12 grid grid-cols-12 gap-12 items-center">
        <div class="col-span-7 space-y-10">
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <span class="h-[1px] w-8 bg-primary/60"></span>
              <span class="text-white/40 text-[10px] font-bold tracking-[0.4em] uppercase">Thursday, October 24</span>
            </div>
            <h1 class="font-serif italic text-7xl md:text-9xl text-white tracking-tighter leading-none opacity-95">Quietude</h1>
          </div>
          <p class="font-serif text-3xl md:text-4xl text-white/80 leading-[1.4] max-w-2xl">
            "A quiet afternoon, thinking of you. The light hits the floor just right today."
          </p>
          <div class="flex gap-4">
            <button
              class="ios-glass-card px-8 py-4 rounded-ios-full flex items-center gap-3 hover:bg-white/10 active:scale-95 transition-all group"
            >
              <span class="material-symbols-outlined text-primary text-[22px] fill-current">edit_note</span>
              <span class="text-sm font-semibold tracking-wide">Write a Memory</span>
            </button>
          </div>
        </div>
        <div class="col-span-5 flex justify-end">
          <div class="relative group">
            <div
              class="relative w-80 h-[480px] rounded-[2.5rem] overflow-hidden photo-frame transform rotate-1 group-hover:rotate-0 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
            >
              <div
                class="absolute inset-0 bg-cover bg-center"
                style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDgYG5fbrfAWYAbyZ7RmKq8IBLBAj6bbuVhR-COKsvf9zLkn7UK8IhEy7zQsn2FWb3n-Wf9-xvQX-ne5hKssruYZaOcM116VJWjTzmLyIO-LLLKLcBVtMQ_uL1ThysECYUBVxleFZSt_ZmhN-3s-mZrxirArEP9nN5vjZID5NmDaMMGXvXCEd8zsguRkntLDinf0r1jSD3Qf40ltscmLWb-HGfwakonh3J6UljgYOf7RI0eq2x4WHW49pdKb__McD7PxADWZ-jYgeY");'
              ></div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
              <div class="absolute inset-0 border border-white/10 rounded-[2.5rem]"></div>
              <div class="absolute bottom-6 left-6 right-6">
                <div class="ios-glass-card px-4 py-3 rounded-2xl flex items-center justify-between">
                  <div>
                    <p class="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-0.5">Captivation</p>
                    <p class="text-xs font-medium">Summer Afternoon</p>
                  </div>
                  <span class="material-symbols-outlined text-primary text-[18px] fill-current">favorite</span>
                </div>
              </div>
            </div>
            <div class="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/10 blur-[80px] rounded-full -z-10 animate-pulse"></div>
            <div class="absolute -top-10 -left-10 w-48 h-48 bg-white/5 blur-[80px] rounded-full -z-10"></div>
          </div>
        </div>
      </div>
    </main>
    <div class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div class="ios-glass-player px-4 py-3 rounded-[2rem] flex items-center gap-5 min-w-[420px]">
        <div class="size-14 rounded-2xl overflow-hidden shrink-0 shadow-lg border border-white/10">
          <div
            class="w-full h-full bg-cover bg-center"
            style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuB1cTdNnDkx3cYGJAHYTwAZoD6JhryILuFN_j4GKPjANEXVMKQvEhNYlZsu_JcCyyLQnv5cac1Iz2eCtzPjYX7fxR6FgwSVcu6cfSQWzwsJ3Ye1rn1M5D5ojJ82-aV66nQBluCjDbfo2_Z0CPFkbnFvWox16b6Xzt-5uBf6jjSyr4Dg5ZsdmD2c_QHHXjyVX67m3pNFwaPGpmqaql_mPcqi1lz54MUQER8XTuw_oNLXlbkckHhurry86KxqC8ciQxnm01X8CHnXoVc");'
          ></div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-2">
            <div class="truncate">
              <p class="text-[14px] font-semibold truncate leading-tight tracking-tight">Rainy Day Melody</p>
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
  </div>
</template>
