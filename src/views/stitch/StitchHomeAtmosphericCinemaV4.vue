<template>
  <div class="stitch-music-v4 bg-black font-sans overflow-hidden text-white selection:bg-music-accent/30 selection:text-white">
    <div class="fixed inset-0 z-0 overflow-hidden">
      <div
        class="absolute inset-0 bg-cover bg-center scale-125 blur-[120px] opacity-60 saturate-150 transition-all duration-1000"
        style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuB1cTdNnDkx3cYGJAHYTwAZoD6JhryILuFN_j4GKPjANEXVMKQvEhNYlZsu_JcCyyLQnv5cac1Iz2eCtzPjYX7fxR6FgwSVcu6cfSQWzwsJ3Ye1rn1M5D5ojJ82-aV66nQBluCjDbfo2_Z0CPFkbnFvWox16b6Xzt-5uBf6jjSyr4Dg5ZsdmD2c_QHHXjyVX67m3pNFwaPGpmqaql_mPcqi1lz54MUQER8XTuw_oNLXlbkckHhurry86KxqC8ciQxnm01X8CHnXoVc");'
      ></div>
      <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/90"></div>
      <div class="absolute inset-0 grain"></div>
    </div>
    <div class="relative z-10 flex flex-col h-screen w-full">
      <header class="w-full px-12 py-8 flex items-center justify-between border-b border-white/5 bg-white/5 backdrop-blur-md">
        <div class="flex items-center gap-8">
          <div class="flex items-center gap-3">
            <div
              class="size-10 rounded-xl bg-cover bg-center shadow-lg ring-1 ring-white/20"
              style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDgYG5fbrfAWYAbyZ7RmKq8IBLBAj6bbuVhR-COKsvf9zLkn7UK8IhEy7zQsn2FWb3n-Wf9-xvQX-ne5hKssruYZaOcM116VJWjTzmLyIO-LLLKLcBVtMQ_uL1ThysECYUBVxleFZSt_ZmhN-3s-mZrxirArEP9nN5vjZID5NmDaMMGXvXCEd8zsguRkntLDinf0r1jSD3Qf40ltscmLWb-HGfwakonh3J6UljgYOf7RI0eq2x4WHW49pdKb__McD7PxADWZ-jYgeY");'
            ></div>
            <div class="flex flex-col">
              <span class="text-sm font-semibold tracking-tight">Journal</span>
              <span class="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold">iOS Premium</span>
            </div>
          </div>
          <nav class="hidden md:flex items-center gap-1">
            <router-link to="/" class="px-4 py-2 text-sm font-medium text-white/50 hover:text-white transition-colors">Stories</router-link>
            <router-link to="/notes" class="px-4 py-2 text-sm font-medium text-white/50 hover:text-white transition-colors">Crush</router-link>
            <router-link to="/stitch/home-4" class="px-4 py-2 text-sm font-medium text-white">Player</router-link>
            <router-link to="/gallery" class="px-4 py-2 text-sm font-medium text-white/50 hover:text-white transition-colors">Archive</router-link>
          </nav>
        </div>
        <div class="flex items-center gap-3">
          <button class="size-10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <span class="material-symbols-outlined text-[20px] font-light">search</span>
          </button>
          <button class="size-10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <span class="material-symbols-outlined text-[20px] font-light">notifications</span>
          </button>
          <div class="w-[1px] h-6 bg-white/10 mx-2"></div>
          <div class="size-9 rounded-full bg-white/10 border border-white/20 overflow-hidden">
            <img
              alt="Profile"
              class="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbS-xcEzO5VVAh6yJDwgpDpGqVWfyJlRYpOtCiTkeSAFlSxnkQG7kUfO4QNAPGM8aylQNLGU5ncVU9v1Pm1t-7QgSVz0WkNxQQGfGXxB3UUeFUDJh03GU5GMVv4m3F_8swPBZ3rzCDuyh9AN0Wf2bQyyONMJrsAcSEZN8wka6UCBphiVfIWS32XW9HDbN1o-4lq3_3IuVk5QEx-ZklsB-RfkMwqY4zOT1Df1ijY570ehJVcbrptx7_3hYOnSxJg5b6Nt8Z0_FrKfs"
            />
          </div>
        </div>
      </header>
      <div class="sidebar-trigger group fixed left-0 top-1/2 -translate-y-1/2 h-40 w-12 flex items-center justify-center z-50">
        <div class="sidebar-content glass-morphism h-[70vh] w-64 rounded-3xl ml-6 flex flex-col justify-between p-8 shadow-2xl">
          <div class="flex flex-col gap-8">
            <div class="flex flex-col gap-2">
              <a class="nav-link hover:bg-white/5 text-white/50 hover:text-white" href="#">
                <span class="material-symbols-outlined text-[22px]">book_2</span>
                <p class="text-sm font-medium">Stories</p>
              </a>
              <a class="nav-link hover:bg-white/5 text-white/50 hover:text-white" href="#">
                <span class="material-symbols-outlined text-[22px]">favorite</span>
                <p class="text-sm font-medium">Crush</p>
              </a>
              <a class="nav-link bg-white/10 text-white" href="#">
                <span class="material-symbols-outlined text-[22px]">music_note</span>
                <p class="text-sm font-medium">Player</p>
              </a>
            </div>
          </div>
          <router-link to="/profile" class="nav-link hover:bg-white/5 text-white/50">
            <span class="material-symbols-outlined text-[22px]">settings</span>
            <p class="text-sm font-medium">Settings</p>
          </router-link>
        </div>
        <div class="absolute left-3 group-hover:opacity-0 transition-opacity">
          <div class="w-1 h-12 bg-white/20 rounded-full"></div>
        </div>
      </div>
      <main class="flex-1 flex flex-col md:flex-row items-center justify-center px-12 lg:px-24 gap-16 lg:gap-32 max-w-[1600px] mx-auto w-full">
        <div class="flex flex-col items-center md:items-start gap-12 w-full max-w-lg">
          <div class="relative group">
            <div class="absolute -inset-16 bg-white/5 rounded-full blur-3xl opacity-20 transition-opacity duration-1000 group-hover:opacity-40"></div>
            <div class="relative size-72 md:size-[440px] flex items-center justify-center">
              <div class="absolute inset-0 concentric-circles rounded-full border border-white/5"></div>
              <div class="absolute inset-[10%] rounded-full border border-white/10 opacity-30"></div>
              <div class="absolute inset-[25%] rounded-full border border-white/5 opacity-20"></div>
              <div
                class="relative size-56 md:size-80 rounded-full overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/20 transition-all duration-700 group-hover:scale-[1.03]"
              >
                <img
                  alt="Album Art"
                  class="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1cTdNnDkx3cYGJAHYTwAZoD6JhryILuFN_j4GKPjANEXVMKQvEhNYlZsu_JcCyyLQnv5cac1Iz2eCtzPjYX7fxR6FgwSVcu6cfSQWzwsJ3Ye1rn1M5D5ojJ82-aV66nQBluCjDbfo2_Z0CPFkbnFvWox16b6Xzt-5uBf6jjSyr4Dg5ZsdmD2c_QHHXjyVX67m3pNFwaPGpmqaql_mPcqi1lz54MUQER8XTuw_oNLXlbkckHhurry86KxqC8ciQxnm01X8CHnXoVc"
                />
                <div class="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-white/10"></div>
                <div
                  class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-4 md:size-6 rounded-full bg-black/90 shadow-inner flex items-center justify-center"
                >
                  <div class="size-1 bg-white/20 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="w-full flex flex-col gap-8">
            <div class="space-y-2 text-center md:text-left">
              <h1 class="text-5xl md:text-6xl font-display font-medium tracking-tight text-white leading-tight">Ocean Eyes</h1>
              <p class="text-white/50 text-xl font-light tracking-wide italic">Midsummer Dreams — Billie Eilish</p>
            </div>
            <div class="space-y-4">
              <div class="relative h-1.5 w-full bg-white/10 rounded-full cursor-pointer group/seek">
                <div class="absolute h-full w-[42%] bg-white rounded-full"></div>
                <div class="absolute left-[42%] top-1/2 -translate-y-1/2 size-4 bg-white rounded-full shadow-2xl scale-0 group-hover/seek:scale-100 transition-transform"></div>
              </div>
              <div class="flex justify-between text-[11px] font-bold tracking-[0.2em] text-white/40 uppercase">
                <span>1:42</span>
                <span>3:15</span>
              </div>
            </div>
            <div class="flex items-center justify-center md:justify-start gap-12">
              <button class="text-white/30 hover:text-white transition-colors">
                <span class="material-symbols-outlined text-[24px]">shuffle</span>
              </button>
              <div class="flex items-center gap-10">
                <button class="text-white hover:text-white/60 transition-all active:scale-90">
                  <span class="material-symbols-outlined text-[42px] font-light">skip_previous</span>
                </button>
                <button class="size-20 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl">
                  <span class="material-symbols-outlined text-[44px] fill-current">pause</span>
                </button>
                <button class="text-white hover:text-white/60 transition-all active:scale-90">
                  <span class="material-symbols-outlined text-[42px] font-light">skip_next</span>
                </button>
              </div>
              <button class="text-white/30 hover:text-white transition-colors">
                <span class="material-symbols-outlined text-[24px]">repeat</span>
              </button>
            </div>
          </div>
        </div>
        <div class="w-full md:w-[480px] flex flex-col h-[650px] justify-center relative">
          <div class="lyrics-scroll flex-1 overflow-y-auto space-y-12 py-32 mask-linear-fade">
            <p class="lyric-line text-2xl md:text-3xl font-display leading-snug">The city lights are glowing low</p>
            <p class="lyric-line text-2xl md:text-3xl font-display leading-snug">I'm watching where the shadows go</p>
            <p class="lyric-line active text-4xl md:text-5xl font-display font-medium leading-tight">Looking in your ocean eyes</p>
            <p class="lyric-line text-2xl md:text-3xl font-display leading-snug">Underneath the velvet skies</p>
            <p class="lyric-line text-2xl md:text-3xl font-display leading-snug">Every breath a secret told</p>
            <p class="lyric-line text-2xl md:text-3xl font-display leading-snug">In stories that were never old</p>
            <p class="lyric-line text-2xl md:text-3xl font-display leading-snug">Wait for me where lilies grow</p>
            <p class="lyric-line text-2xl md:text-3xl font-display leading-snug">In the morning's golden glow</p>
          </div>
          <div class="absolute bottom-4 right-0 flex items-center gap-6 text-white/40">
            <div class="flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
              <span class="material-symbols-outlined text-[20px] font-light">volume_up</span>
              <div class="w-24 h-1 bg-white/10 rounded-full relative">
                <div class="absolute inset-y-0 left-0 w-3/4 bg-white/60 rounded-full"></div>
              </div>
            </div>
            <button class="hover:text-white transition-colors">
              <span class="material-symbols-outlined text-[24px] font-light">lyrics</span>
            </button>
            <button class="hover:text-white transition-colors">
              <span class="material-symbols-outlined text-[24px] font-light">more_horiz</span>
            </button>
          </div>
        </div>
      </main>
      <footer class="w-full py-8 flex items-center justify-center">
        <div class="flex flex-col items-center gap-2">
          <div class="text-white/20 text-[10px] tracking-[0.5em] uppercase font-bold">Intimate Listening Mode • Phase IV</div>
          <div class="w-16 h-0.5 bg-white/5 rounded-full"></div>
        </div>
      </footer>
    </div>
  </div>
</template>

<style>
.stitch-music-v4 .glass-morphism {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(50px) saturate(200%);
  -webkit-backdrop-filter: blur(50px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stitch-music-v4 .sidebar-trigger:hover .sidebar-content {
  transform: translateX(0);
  opacity: 1;
}

.stitch-music-v4 .sidebar-content {
  transform: translateX(-20px);
  opacity: 0;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.stitch-music-v4 .concentric-circles {
  background: repeating-radial-gradient(
    circle at center,
    transparent 0,
    transparent 1.5px,
    rgba(255, 255, 255, 0.02) 2px,
    rgba(255, 255, 255, 0.02) 2.5px
  );
}

.stitch-music-v4 .lyrics-scroll::-webkit-scrollbar {
  width: 0px;
}

.stitch-music-v4 .lyric-line {
  transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  filter: blur(4px);
  opacity: 0.15;
}

.stitch-music-v4 .lyric-line.active {
  filter: blur(0);
  opacity: 1;
  transform: scale(1.02);
}

.stitch-music-v4 .grain {
  background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAhnN-c6-tvXKaxxtWEFk8ZQ6RmbkLBI9Tu3bsqNWc-EIPrnIwFFRSj6SdSMguirLBW_gm94P5Y2OfA3J2XQBfkhZgrYcHhvUEpBxEQiVEbD7hj4QtmWuNnHY71OiDBpv1kJQ9AmYeBR77LP1veXhxeixWY7W6W4nW_ZrfbKE-_2uQwCxxENnLox1oSeRRNOAl-gY0dU6I5uAL8epYCXkjqJrdRJdCMhSB6D7EsGHgN5HbhfD6GgiDGaqZyRtPPTn9ey14wZWXrObY');
  opacity: 0.04;
  pointer-events: none;
}

.stitch-music-v4 .mask-linear-fade {
  mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
}

.stitch-music-v4 .nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.25rem;
  border-radius: 1.5rem;
  transition: all 0.3s;
}
</style>
