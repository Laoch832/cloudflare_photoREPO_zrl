<template>
  <div class="stitch-gallery-v3 font-display overflow-hidden text-white antialiased bg-[#0a0a0a]">
    <div class="fixed inset-0 z-0">
      <div class="absolute inset-0 environment-bg"></div>
      <div class="absolute inset-0 bg-black/40"></div>
      <div class="absolute inset-0 grain-layer"></div>
    </div>
    <header class="fixed top-6 left-0 right-0 z-50 flex justify-center px-6">
      <nav class="nav-glass h-14 w-full max-w-4xl rounded-2xl flex items-center justify-between px-2">
        <div class="flex items-center gap-3 pl-3">
          <div
            class="size-8 rounded-full bg-cover bg-center ring-1 ring-white/30"
            style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDgYG5fbrfAWYAbyZ7RmKq8IBLBAj6bbuVhR-COKsvf9zLkn7UK8IhEy7zQsn2FWb3n-Wf9-xvQX-ne5hKssruYZaOcM116VJWjTzmLyIO-LLLKLcBVtMQ_uL1ThysECYUBVxleFZSt_ZmhN-3s-mZrxirArEP9nN5vjZID5NmDaMMGXvXCEd8zsguRkntLDinf0r1jSD3Qf40ltscmLWb-HGfwakonh3J6UljgYOf7RI0eq2x4WHW49pdKb__McD7PxADWZ-jYgeY");'
          ></div>
          <span class="font-semibold tracking-tight text-white/90 text-sm">Sanctuary</span>
        </div>
        <div class="flex items-center bg-white/5 rounded-xl p-1">
          <router-link to="/stitch/home-2" class="px-5 py-1.5 rounded-lg text-sm font-medium text-white/50 hover:text-white transition-all"
            >Diary</router-link
          >
          <router-link to="/stitch/home-3" class="px-5 py-1.5 rounded-lg bg-white/10 text-white text-sm font-medium shadow-sm transition-all"
            >Gallery</router-link
          >
          <router-link to="/stitch/home-1" class="px-5 py-1.5 rounded-lg text-sm font-medium text-white/50 hover:text-white transition-all"
            >Notes</router-link
          >
        </div>
        <div class="flex items-center pr-1 gap-1">
          <button class="size-9 rounded-xl hover:bg-white/10 flex items-center justify-center transition-colors">
            <span class="material-symbols-outlined text-[20px] text-white/70">search</span>
          </button>
          <router-link to="/stitch/account-settings" class="size-9 rounded-xl hover:bg-white/10 flex items-center justify-center transition-colors">
            <span class="material-symbols-outlined text-[20px] text-white/70">settings</span>
          </router-link>
        </div>
      </nav>
    </header>
    <main class="relative z-10 h-screen w-full pt-32 pb-32 flex flex-col items-center">
      <div class="w-full max-w-6xl h-full flex flex-col px-6">
        <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div class="max-w-xl">
            <h1 class="text-6xl font-bold tracking-tight mb-4 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              Visual Echoes
            </h1>
            <p class="text-white/40 text-xl font-light italic leading-relaxed">Capturing the silence between our shared glances.</p>
          </div>
          <div class="flex gap-3">
            <button class="ios-glass px-6 py-2.5 rounded-full text-sm font-medium hover:bg-white/20 transition-colors">Collections</button>
            <button
              class="bg-white text-black px-7 py-3 rounded-full text-sm font-bold hover:bg-gray-100 transition-all flex items-center gap-2 shadow-2xl active:scale-95"
            >
              <span class="material-symbols-outlined text-[20px]">photo_camera</span>
              Add Memory
            </button>
          </div>
        </div>
        <div class="flex-1 overflow-y-auto custom-scrollbar px-2">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-20 pb-20 justify-items-center">
            <div class="polaroid-frame -rotate-2">
              <div
                class="aspect-[1/1] w-full bg-cover bg-center grayscale-[0.2] contrast-[1.1]"
                style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCXW2-dWMIb9nb69pFxqgWF7OjEVTqxBGud9l62LjCGje6QYLW0TpLpG3jOFlHv-z5CZD60v2dvnQA8g4NcGVXQm7Ka1ZGcr_c-npxxgI4vNovr6ZqcA-z7Jc5rqgHm42d0lIEpIKHeKL6MQsJFMafHXWiOjAxvw4Be6V-G5y61K5Pk6YQPA_M4ntbSc6J2j3J_rHlx_KFT1MoLg3izPeQz_LrngZ8IAbAZzPjEDzWhGFrvUaREvZ7mbwYC0o9q1n3bvITB34XG2Ic");'
              ></div>
              <div class="pt-6 text-center">
                <p class="font-handwritten text-zinc-800 text-2xl leading-tight">Rainy afternoon tea.</p>
                <p class="text-[9px] uppercase tracking-[0.2em] text-zinc-400 mt-3 font-sans">Oct 12, 2023</p>
              </div>
            </div>
            <div class="polaroid-frame rotate-2">
              <div
                class="aspect-[1/1] w-full bg-cover bg-center grayscale-[0.1]"
                style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDgYG5fbrfAWYAbyZ7RmKq8IBLBAj6bbuVhR-COKsvf9zLkn7UK8IhEy7zQsn2FWb3n-Wf9-xvQX-ne5hKssruYZaOcM116VJWjTzmLyIO-LLLKLcBVtMQ_uL1ThysECYUBVxleFZSt_ZmhN-3s-mZrxirArEP9nN5vjZID5NmDaMMGXvXCEd8zsguRkntLDinf0r1jSD3Qf40ltscmLWb-HGfwakonh3J6UljgYOf7RI0eq2x4WHW49pdKb__McD7PxADWZ-jYgeY");'
              ></div>
              <div class="pt-6 text-center">
                <p class="font-handwritten text-zinc-800 text-2xl leading-tight">That secret smile.</p>
                <p class="text-[9px] uppercase tracking-[0.2em] text-zinc-400 mt-3 font-sans">Sep 28, 2023</p>
              </div>
            </div>
            <div class="polaroid-frame -rotate-1">
              <div
                class="aspect-[1/1] w-full bg-cover bg-center contrast-[1.05]"
                style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuB1cTdNnDkx3cYGJAHYTwAZoD6JhryILuFN_j4GKPjANEXVMKQvEhNYlZsu_JcCyyLQnv5cac1Iz2eCtzPjYX7fxR6FgwSVcu6cfSQWzwsJ3Ye1rn1M5D5ojJ82-aV66nQBluCjDbfo2_Z0CPFkbnFvWox16b6Xzt-5uBf6jjSyr4Dg5ZsdmD2c_QHHXjyVX67m3pNFwaPGpmqaql_mPcqi1lz54MUQER8XTuw_oNLXlbkckHhurry86KxqC8ciQxnm01X8CHnXoVc");'
              ></div>
              <div class="pt-6 text-center">
                <p class="font-handwritten text-zinc-800 text-2xl leading-tight">City lights at midnight.</p>
                <p class="text-[9px] uppercase tracking-[0.2em] text-zinc-400 mt-3 font-sans">Nov 04, 2023</p>
              </div>
            </div>
            <div class="polaroid-frame rotate-3">
              <div
                class="aspect-[1/1] w-full bg-cover bg-center brightness-105"
                style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAhnN-c6-tvXKaxxtWEFk8ZQ6RmbkLBI9Tu3bsqNWc-EIPrnIwFFRSj6SdSMguirLBW_gm94P5Y2OfA3J2XQBfkhZgrYcHhvUEpBxEQiVEbD7hj4QtmWuNnHY71OiDBpv1kJQ9AmYeBR77LP1veXhxeixWY7W6W4nW_ZrfbKE-_2uQwCxxENnLox1oSeRRNOAl-gY0dU6I5uAL8epYCXkjqJrdRJdCMhSB6D7EsGHgN5HbhfD6GgiDGaqZyRtPPTn9ey14wZWXrObY");'
              ></div>
              <div class="pt-6 text-center">
                <p class="font-handwritten text-zinc-800 text-2xl leading-tight">Static in the air.</p>
                <p class="text-[9px] uppercase tracking-[0.2em] text-zinc-400 mt-3 font-sans">Aug 15, 2023</p>
              </div>
            </div>
            <div class="polaroid-frame rotate-1">
              <div
                class="aspect-[1/1] w-full bg-cover bg-center"
                style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCXW2-dWMIb9nb69pFxqgWF7OjEVTqxBGud9l62LjCGje6QYLW0TpLpG3jOFlHv-z5CZD60v2dvnQA8g4NcGVXQm7Ka1ZGcr_c-npxxgI4vNovr6ZqcA-z7Jc5rqgHm42d0lIEpIKHeKL6MQsJFMafHXWiOjAxvw4Be6V-G5y61K5Pk6YQPA_M4ntbSc6J2j3J_rHlx_KFT1MoLg3izPeQz_LrngZ8IAbAZzPjEDzWhGFrvUaREvZ7mbwYC0o9q1n3bvITB34XG2Ic");'
              ></div>
              <div class="pt-6 text-center">
                <p class="font-handwritten text-zinc-800 text-2xl leading-tight">Morning coffee rituals.</p>
                <p class="text-[9px] uppercase tracking-[0.2em] text-zinc-400 mt-3 font-sans">Oct 30, 2023</p>
              </div>
            </div>
            <div class="polaroid-frame -rotate-3">
              <div
                class="aspect-[1/1] w-full bg-cover bg-center grayscale-[0.3]"
                style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDgYG5fbrfAWYAbyZ7RmKq8IBLBAj6bbuVhR-COKsvf9zLkn7UK8IhEy7zQsn2FWb3n-Wf9-xvQX-ne5hKssruYZaOcM116VJWjTzmLyIO-LLLKLcBVtMQ_uL1ThysECYUBVxleFZSt_ZmhN-3s-mZrxirArEP9nN5vjZID5NmDaMMGXvXCEd8zsguRkntLDinf0r1jSD3Qf40ltscmLWb-HGfwakonh3J6UljgYOf7RI0eq2x4WHW49pdKb__McD7PxADWZ-jYgeY");'
              ></div>
              <div class="pt-6 text-center">
                <p class="font-handwritten text-zinc-800 text-2xl leading-tight">The dusty corner shelf.</p>
                <p class="text-[9px] uppercase tracking-[0.2em] text-zinc-400 mt-3 font-sans">Dec 01, 2023</p>
              </div>
            </div>
            <div class="polaroid-frame rotate-2">
              <div
                class="aspect-[1/1] w-full bg-cover bg-center"
                style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuB1cTdNnDkx3cYGJAHYTwAZoD6JhryILuFN_j4GKPjANEXVMKQvEhNYlZsu_JcCyyLQnv5cac1Iz2eCtzPjYX7fxR6FgwSVcu6cfSQWzwsJ3Ye1rn1M5D5ojJ82-aV66nQBluCjDbfo2_Z0CPFkbnFvWox16b6Xzt-5uBf6jjSyr4Dg5ZsdmD2c_QHHXjyVX67m3pNFwaPGpmqaql_mPcqi1lz54MUQER8XTuw_oNLXlbkckHhurry86KxqC8ciQxnm01X8CHnXoVc");'
              ></div>
              <div class="pt-6 text-center">
                <p class="font-handwritten text-zinc-800 text-2xl leading-tight">Raindrops on glass.</p>
                <p class="text-[9px] uppercase tracking-[0.2em] text-zinc-400 mt-3 font-sans">Jan 14, 2024</p>
              </div>
            </div>
            <div class="polaroid-frame -rotate-2">
              <div
                class="aspect-[1/1] w-full bg-cover bg-center brightness-90 contrast-110"
                style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuB1cTdNnDkx3cYGJAHYTwAZoD6JhryILuFN_j4GKPjANEXVMKQvEhNYlZsu_JcCyyLQnv5cac1Iz2eCtzPjYX7fxR6FgwSVcu6cfSQWzwsJ3Ye1rn1M5D5ojJ82-aV66nQBluCjDbfo2_Z0CPFkbnFvWox16b6Xzt-5uBf6jjSyr4Dg5ZsdmD2c_QHHXjyVX67m3pNFwaPGpmqaql_mPcqi1lz54MUQER8XTuw_oNLXlbkckHhurry86KxqC8ciQxnm01X8CHnXoVc");'
              ></div>
              <div class="pt-6 text-center">
                <p class="font-handwritten text-zinc-800 text-2xl leading-tight">Summer's last breath.</p>
                <p class="text-[9px] uppercase tracking-[0.2em] text-zinc-400 mt-3 font-sans">Aug 31, 2023</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <div class="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
      <div class="music-player-pill h-16 rounded-3xl flex items-center px-4 gap-4 shadow-2xl min-w-[320px]">
        <div class="relative group cursor-pointer">
          <div
            class="size-11 rounded-xl bg-cover bg-center ring-1 ring-white/20 shadow-lg"
            style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuB1cTdNnDkx3cYGJAHYTwAZoD6JhryILuFN_j4GKPjANEXVMKQvEhNYlZsu_JcCyyLQnv5cac1Iz2eCtzPjYX7fxR6FgwSVcu6cfSQWzwsJ3Ye1rn1M5D5ojJ82-aV66nQBluCjDbfo2_Z0CPFkbnFvWox16b6Xzt-5uBf6jjSyr4Dg5ZsdmD2c_QHHXjyVX67m3pNFwaPGpmqaql_mPcqi1lz54MUQER8XTuw_oNLXlbkckHhurry86KxqC8ciQxnm01X8CHnXoVc");'
          ></div>
          <div class="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span class="material-symbols-outlined text-white text-lg">play_arrow</span>
          </div>
        </div>
        <div class="flex-1">
          <p class="text-sm font-semibold text-white/90 leading-tight">Rainy Day Melody</p>
          <div class="flex items-center gap-2 mt-1">
            <div class="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <div class="h-full bg-white/60 w-1/3"></div>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <button class="size-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
            <span class="material-symbols-outlined text-[18px] text-white/80">skip_previous</span>
          </button>
          <button class="size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <span class="material-symbols-outlined text-[18px] text-white">pause</span>
          </button>
          <button class="size-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
            <span class="material-symbols-outlined text-[18px] text-white/80">skip_next</span>
          </button>
        </div>
      </div>
    </div>
    <div class="fixed bottom-10 right-10 flex gap-4 z-50">
      <button class="ios-glass size-14 rounded-2xl flex items-center justify-center hover:bg-white/20 hover:scale-105 transition-all shadow-xl group">
        <span class="material-symbols-outlined text-white/70 group-hover:text-white group-hover:fill-1">favorite</span>
      </button>
      <button class="ios-glass size-14 rounded-2xl flex items-center justify-center hover:bg-white/20 hover:scale-105 transition-all shadow-xl group">
        <span class="material-symbols-outlined text-white/70 group-hover:text-white">ios_share</span>
      </button>
    </div>
  </div>
</template>

<style>
.stitch-gallery-v3 {
  --stitch-v3-glass-blur: 40px;
  --stitch-v3-polaroid-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.3), 0 10px 15px -5px rgba(0, 0, 0, 0.2),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  --stitch-v3-depth-highlight: inset 0 2px 2px rgba(255, 255, 255, 0.9);
}

.stitch-gallery-v3 .ios-glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(var(--stitch-v3-glass-blur));
  -webkit-backdrop-filter: blur(var(--stitch-v3-glass-blur));
  border: 0.5px solid rgba(255, 255, 255, 0.15);
}

.stitch-gallery-v3 .nav-glass {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.stitch-gallery-v3 .polaroid-frame {
  background: #fdfdfd;
  padding: 14px 14px 48px 14px;
  box-shadow: var(--stitch-v3-polaroid-shadow);
  position: relative;
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  transform-style: preserve-3d;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.stitch-gallery-v3 .polaroid-frame::before {
  content: '';
  position: absolute;
  inset: 0;
  box-shadow: var(--stitch-v3-depth-highlight);
  pointer-events: none;
  z-index: 2;
}

.stitch-gallery-v3 .polaroid-frame:hover {
  transform: translateY(-12px) scale(1.03) rotate(0deg) !important;
  box-shadow: 0 40px 60px -15px rgba(0, 0, 0, 0.5);
  z-index: 30;
}

.stitch-gallery-v3 .custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.stitch-gallery-v3 .custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.stitch-gallery-v3 .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
}

.stitch-gallery-v3 .environment-bg {
  background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCXW2-dWMIb9nb69pFxqgWF7OjEVTqxBGud9l62LjCGje6QYLW0TpLpG3jOFlHv-z5CZD60v2dvnQA8g4NcGVXQm7Ka1ZGcr_c-npxxgI4vNovr6ZqcA-z7Jc5rqgHm42d0lIEpIKHeKL6MQsJFMafHXWiOjAxvw4Be6V-G5y61K5Pk6YQPA_M4ntbSc6J2j3J_rHlx_KFT1MoLg3izPeQz_LrngZ8IAbAZzPjEDzWhGFrvUaREvZ7mbwYC0o9q1n3bvITB34XG2Ic');
  background-size: cover;
  background-position: center;
  filter: blur(50px) brightness(0.5);
  transform: scale(1.15);
}

.stitch-gallery-v3 .grain-layer {
  background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAhnN-c6-tvXKaxxtWEFk8ZQ6RmbkLBI9Tu3bsqNWc-EIPrnIwFFRSj6SdSMguirLBW_gm94P5Y2OfA3J2XQBfkhZgrYcHhvUEpBxEQiVEbD7hj4QtmWuNnHY71OiDBpv1kJQ9AmYeBR77LP1veXhxeixWY7W6W4nW_ZrfbKE-_2uQwCxxENnLox1oSeRRNOAl-gY0dU6I5uAL8epYCXkjqJrdRJdCMhSB6D7EsGHgN5HbhfD6GgiDGaqZyRtPPTn9ey14wZWXrObY');
  opacity: 0.04;
  pointer-events: none;
}

.stitch-gallery-v3 .music-player-pill {
  background: rgba(20, 20, 20, 0.6);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
