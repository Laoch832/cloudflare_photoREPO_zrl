<template>
  <div class="stitch-diary-v2 font-sans text-gray-900 antialiased selection:bg-diary-accent/20 bg-[#F2F2F7] overflow-x-hidden">
    <div class="fixed inset-0 z-0">
      <div
        class="absolute inset-0 bg-cover bg-center"
        style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCXW2-dWMIb9nb69pFxqgWF7OjEVTqxBGud9l62LjCGje6QYLW0TpLpG3jOFlHv-z5CZD60v2dvnQA8g4NcGVXQm7Ka1ZGcr_c-npxxgI4vNovr6ZqcA-z7Jc5rqgHm42d0lIEpIKHeKL6MQsJFMafHXWiOjAxvw4Be6V-G5y61K5Pk6YQPA_M4ntbSc6J2j3J_rHlx_KFT1MoLg3izPeQz_LrngZ8IAbAZzPjEDzWhGFrvUaREvZ7mbwYC0o9q1n3bvITB34XG2Ic"); filter: blur(80px) brightness(1.05); transform: scale(1.1);'
      ></div>
      <div class="absolute inset-0 bg-white/30"></div>
    </div>
    <header class="fixed top-0 left-0 right-0 h-20 z-50 flex items-center justify-center px-8">
      <div class="w-full max-w-6xl flex items-center justify-between ios-blur ios-card px-8 py-3 rounded-full border-white/40">
        <div class="flex items-center gap-3">
          <div
            class="size-8 rounded-full bg-cover bg-center border border-white/50 shadow-sm"
            style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDgYG5fbrfAWYAbyZ7RmKq8IBLBAj6bbuVhR-COKsvf9zLkn7UK8IhEy7zQsn2FWb3n-Wf9-xvQX-ne5hKssruYZaOcM116VJWjTzmLyIO-LLLKLcBVtMQ_uL1ThysECYUBVxleFZSt_ZmhN-3s-mZrxirArEP9nN5vjZID5NmDaMMGXvXCEd8zsguRkntLDinf0r1jSD3Qf40ltscmLWb-HGfwakonh3J6UljgYOf7RI0eq2x4WHW49pdKb__McD7PxADWZ-jYgeY");'
          ></div>
          <h2 class="text-lg font-display font-semibold tracking-tight">Sanctuary</h2>
        </div>
        <nav class="flex items-center gap-10">
          <router-link to="/stitch/home-1" class="text-sm font-medium text-black/40 hover:text-black transition-colors">Thoughts</router-link>
          <router-link to="/stitch/home-3" class="text-sm font-medium text-black/40 hover:text-black transition-colors">Gallery</router-link>
          <router-link to="/stitch/home-2" class="nav-item-active text-sm font-semibold">Diary</router-link>
          <router-link to="/stitch/home-4" class="text-sm font-medium text-black/40 hover:text-black transition-colors">Music</router-link>
        </nav>
        <div class="flex items-center gap-4">
          <button class="size-9 rounded-full flex items-center justify-center text-black/40 hover:bg-black/5 transition-all">
            <span class="material-symbols-outlined text-[20px]">search</span>
          </button>
          <button
            class="bg-diary-accent text-white px-5 py-2 rounded-full text-xs font-bold tracking-wide shadow-md shadow-diary-accent/20 hover:opacity-90 transition-all flex items-center gap-2"
          >
            <span class="material-symbols-outlined text-[16px]">add</span>
            <span>NEW ENTRY</span>
          </button>
        </div>
      </div>
    </header>
    <main class="relative z-10 pt-32 pb-48 h-screen overflow-y-auto custom-scrollbar">
      <div class="max-w-3xl mx-auto px-6">
        <div class="text-center mb-16">
          <h1 class="text-5xl font-display italic text-gray-900 mb-2">Cinematic Diary</h1>
          <p class="text-sm text-black/40 tracking-[0.2em] uppercase font-medium">Capturing whispers of the heart</p>
        </div>
        <div class="relative">
          <div class="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[0.5px] timeline-line"></div>
          <div class="space-y-24 relative">
            <div class="relative">
              <div
                class="absolute left-1/2 -translate-x-1/2 top-0 size-2.5 rounded-full bg-white border border-diary-accent/40 shadow-sm z-10"
              ></div>
              <div class="pt-8 flex flex-col items-center">
                <div class="text-center mb-6">
                  <span class="block text-2xl font-display font-medium text-gray-900">October 24</span>
                  <span class="text-[10px] uppercase tracking-widest text-black/30 font-bold">Thursday</span>
                </div>
                <div class="w-full ios-card rounded-ios-lg p-10 bg-white/60 backdrop-blur-md">
                  <div class="flex justify-between items-start mb-6">
                    <h3 class="text-xl font-medium text-gray-800 tracking-tight">The Golden Hour Reflection</h3>
                    <span class="material-symbols-outlined text-diary-accent text-[22px] fill-current">favorite</span>
                  </div>
                  <p class="text-gray-600 leading-relaxed font-light text-[17px] mb-8">
                    Today the light hit the floor just right. I couldn't help but think about that afternoon at the cafe when we
                    didn't say anything but everything felt understood...
                  </p>
                  <div class="flex items-center justify-between border-t border-black/5 pt-6">
                    <div class="flex gap-4 items-center">
                      <span class="text-[11px] font-semibold text-black/30 bg-black/5 px-2.5 py-1 rounded-full uppercase"
                        >1,420 words</span
                      >
                      <span class="text-[11px] text-black/30 font-medium">4:30 PM</span>
                    </div>
                    <button class="text-diary-accent text-xs font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity">
                      Read More <span class="material-symbols-outlined text-[14px]">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="relative">
              <div class="absolute left-1/2 -translate-x-1/2 top-0 size-2.5 rounded-full bg-white border border-black/10 shadow-sm z-10"></div>
              <div class="pt-8 flex flex-col items-center">
                <div class="text-center mb-6">
                  <span class="block text-2xl font-display font-medium text-gray-400">October 21</span>
                  <span class="text-[10px] uppercase tracking-widest text-black/20 font-bold">Monday</span>
                </div>
                <div class="w-full ios-card rounded-ios-lg p-10 bg-white/60 backdrop-blur-md">
                  <div class="flex justify-between items-start mb-6">
                    <h3 class="text-xl font-medium text-gray-800 tracking-tight">Midnight Echoes</h3>
                    <span class="material-symbols-outlined text-black/10 text-[22px]">visibility_off</span>
                  </div>
                  <p class="text-gray-600 leading-relaxed font-light text-[17px]">
                    Listening to that one song on repeat. It feels like a secret soundtrack to everything I want to tell you but
                    can't find the courage to speak...
                  </p>
                  <div class="mt-8 flex gap-4 text-[11px] text-black/30 font-medium border-t border-black/5 pt-6">
                    <span>850 words</span>
                    <span>•</span>
                    <span>11:15 PM</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="relative">
              <div class="absolute left-1/2 -translate-x-1/2 top-0 size-2.5 rounded-full bg-white border border-black/10 shadow-sm z-10"></div>
              <div class="pt-8 flex flex-col items-center">
                <div class="text-center mb-6">
                  <span class="block text-2xl font-display font-medium text-gray-400">October 18</span>
                  <span class="text-[10px] uppercase tracking-widest text-black/20 font-bold">Friday</span>
                </div>
                <div class="w-full ios-card rounded-ios-lg p-10 bg-white/60 backdrop-blur-md">
                  <div class="flex justify-between items-start mb-6">
                    <h3 class="text-xl font-medium text-gray-800 tracking-tight">Rain on the Window</h3>
                    <span class="material-symbols-outlined text-black/10 text-[22px]">bookmark</span>
                  </div>
                  <div class="flex flex-col md:flex-row gap-8 mb-8">
                    <div
                      class="w-full md:w-56 h-36 shrink-0 rounded-ios bg-cover bg-center shadow-sm"
                      style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuB1cTdNnDkx3cYGJAHYTwAZoD6JhryILuFN_j4GKPjANEXVMKQvEhNYlZsu_JcCyyLQnv5cac1Iz2eCtzPjYX7fxR6FgwSVcu6cfSQWzwsJ3Ye1rn1M5D5ojJ82-aV66nQBluCjDbfo2_Z0CPFkbnFvWox16b6Xzt-5uBf6jjSyr4Dg5ZsdmD2c_QHHXjyVX67m3pNFwaPGpmqaql_mPcqi1lz54MUQER8XTuw_oNLXlbkckHhurry86KxqC8ciQxnm01X8CHnXoVc')"
                    ></div>
                    <p class="text-gray-600 leading-relaxed font-light text-[17px]">
                      The rhythm of the rain is soothing today. I found that old polaroid in between the pages of my favorite
                      book. It's funny how things find you when you're not looking.
                    </p>
                  </div>
                  <div class="flex gap-4 text-[11px] text-black/30 font-medium border-t border-black/5 pt-6">
                    <span>2,100 words</span>
                    <span>•</span>
                    <span>09:20 AM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <div class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div class="ios-card rounded-full p-2.5 pr-6 flex items-center gap-4 ios-blur border-white/50 w-[420px]">
        <div
          class="size-12 rounded-full bg-cover bg-center shadow-md border border-white/20 shrink-0"
          style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuB1cTdNnDkx3cYGJAHYTwAZoD6JhryILuFN_j4GKPjANEXVMKQvEhNYlZsu_JcCyyLQnv5cac1Iz2eCtzPjYX7fxR6FgwSVcu6cfSQWzwsJ3Ye1rn1M5D5ojJ82-aV66nQBluCjDbfo2_Z0CPFkbnFvWox16b6Xzt-5uBf6jjSyr4Dg5ZsdmD2c_QHHXjyVX67m3pNFwaPGpmqaql_mPcqi1lz54MUQER8XTuw_oNLXlbkckHhurry86KxqC8ciQxnm01X8CHnXoVc");'
        ></div>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-baseline mb-1">
            <p class="text-gray-900 text-[13px] font-semibold truncate leading-none">Rainy Day Melody</p>
            <span class="text-black/30 text-[10px] font-medium">1:42 / 3:50</span>
          </div>
          <div class="h-[3px] w-full bg-black/5 rounded-full overflow-hidden">
            <div class="h-full w-[45%] bg-diary-accent rounded-full"></div>
          </div>
        </div>
        <div class="flex gap-3 items-center shrink-0 ml-2">
          <button class="text-black/30 hover:text-black transition-colors">
            <span class="material-symbols-outlined text-[20px]">skip_previous</span>
          </button>
          <button class="size-9 rounded-full flex items-center justify-center text-white bg-diary-accent shadow-sm hover:scale-105 transition-transform">
            <span class="material-symbols-outlined text-[24px] fill-current">play_arrow</span>
          </button>
          <button class="text-black/30 hover:text-black transition-colors">
            <span class="material-symbols-outlined text-[20px]">skip_next</span>
          </button>
        </div>
      </div>
    </div>
    <div class="fixed bottom-10 right-10 flex flex-col gap-3 z-50">
      <button class="size-12 rounded-full ios-card ios-blur flex items-center justify-center text-black/40 hover:text-diary-accent transition-all">
        <span class="material-symbols-outlined text-[22px]">filter_vintage</span>
      </button>
      <button class="size-12 rounded-full ios-card ios-blur flex items-center justify-center text-black/40 hover:text-diary-accent transition-all">
        <span class="material-symbols-outlined text-[22px]">settings</span>
      </button>
    </div>
  </div>
</template>

<style>
:root {
  --stitch-v2-ios-glass: rgba(255, 255, 255, 0.7);
  --stitch-v2-ios-border: rgba(0, 0, 0, 0.06);
  --stitch-v2-ios-shadow: 0 8px 32px -4px rgba(0, 0, 0, 0.04);
}

.stitch-diary-v2 .ios-blur {
  backdrop-filter: blur(30px) saturate(190%);
  -webkit-backdrop-filter: blur(30px) saturate(190%);
}

.stitch-diary-v2 .ios-card {
  background: var(--stitch-v2-ios-glass);
  border: 0.5px solid var(--stitch-v2-ios-border);
  box-shadow: var(--stitch-v2-ios-shadow);
}

.stitch-diary-v2 .nav-item-active {
  color: #e88d7d;
  position: relative;
}

.stitch-diary-v2 .nav-item-active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #e88d7d;
}

.stitch-diary-v2 .timeline-line {
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.05) 15%,
    rgba(0, 0, 0, 0.05) 85%,
    rgba(0, 0, 0, 0) 100%
  );
}

.stitch-diary-v2 .custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}

.stitch-diary-v2 .custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.stitch-diary-v2 .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.08);
  border-radius: 10px;
}
</style>
