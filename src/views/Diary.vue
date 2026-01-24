<template>
  <div class="font-sans text-white antialiased min-h-screen relative overflow-hidden bg-black">
    <div class="fixed inset-0 z-0">
      <div class="absolute inset-0 bg-cover bg-center" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCXW2-dWMIb9nb69pFxqgWF7OjEVTqxBGud9l62LjCGje6QYLW0TpLpG3jOFlHv-z5CZD60v2dvnQA8g4NcGVXQm7Ka1ZGcr_c-npxxgI4vNovr6ZqcA-z7Jc5rqgHm42d0lIEpIKHeKL6MQsJFMafHXWiOjAxvw4Be6V-G5y61K5Pk6YQPA_M4ntbSc6J2j3J_rHlx_KFT1MoLg3izPeQz_LrngZ8IAbAZzPjEDzWhGFrvUaREvZ7mbwYC0o9q1n3bvITB34XG2Ic"); filter: blur(80px) brightness(0.6); transform: scale(1.1);'></div>
      <div class="absolute inset-0 bg-black/40"></div>
    </div>
    
    <main class="relative z-10 pt-32 pb-48 h-screen overflow-y-auto custom-scrollbar">
      <div class="max-w-3xl mx-auto px-6">
        <div class="text-center mb-16">
          <h1 class="text-5xl font-display italic text-white mb-2">Cinematic Diary</h1>
          <p class="text-sm text-white/40 tracking-[0.2em] uppercase font-medium">Capturing whispers of the heart</p>
        </div>
        <div class="relative">
          <div class="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[0.5px] timeline-line bg-white/10"></div>
          <div class="space-y-24 relative">
            <div class="relative">
              <div class="absolute left-1/2 -translate-x-1/2 top-0 size-2.5 rounded-full bg-white border border-accent/40 shadow-sm z-10"></div>
              <div class="pt-8 flex flex-col items-center">
                <div class="text-center mb-6">
                  <span class="block text-2xl font-display font-medium text-white">October 24</span>
                  <span class="text-[10px] uppercase tracking-widest text-white/30 font-bold">Thursday</span>
                </div>
                <div class="w-full ios-card rounded-ios-lg p-10 bg-white/5 backdrop-blur-md border border-white/10">
                  <div class="flex justify-between items-start mb-6">
                    <h3 class="text-xl font-medium text-white tracking-tight">The Golden Hour Reflection</h3>
                    <span class="material-symbols-outlined text-diary-accent text-[22px] fill-current">favorite</span>
                  </div>
                  <p class="text-white/70 leading-relaxed font-light text-[17px] mb-8">
                    Today the light hit the floor just right. I couldn't help but think about that afternoon at the cafe when we didn't say anything but everything felt understood...
                  </p>
                  <div class="flex items-center justify-between border-t border-white/5 pt-6">
                    <div class="flex gap-4 items-center">
                      <span class="text-[11px] font-semibold text-white/30 bg-white/5 px-2.5 py-1 rounded-full uppercase">1,420 words</span>
                      <span class="text-[11px] text-white/30 font-medium">4:30 PM</span>
                    </div>
                    <button class="text-diary-accent text-xs font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity">
                      Read More <span class="material-symbols-outlined text-[14px]">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="relative">
              <div class="absolute left-1/2 -translate-x-1/2 top-0 size-2.5 rounded-full bg-white border border-white/10 shadow-sm z-10"></div>
              <div class="pt-8 flex flex-col items-center">
                <div class="text-center mb-6">
                  <span class="block text-2xl font-display font-medium text-white/60">October 21</span>
                  <span class="text-[10px] uppercase tracking-widest text-white/20 font-bold">Monday</span>
                </div>
                <div class="w-full ios-card rounded-ios-lg p-10 bg-white/5 backdrop-blur-md border border-white/10">
                  <div class="flex justify-between items-start mb-6">
                    <h3 class="text-xl font-medium text-white tracking-tight">Midnight Echoes</h3>
                    <span class="material-symbols-outlined text-white/10 text-[22px]">visibility_off</span>
                  </div>
                  <p class="text-white/70 leading-relaxed font-light text-[17px]">
                    Listening to that one song on repeat. It feels like a secret soundtrack to everything I want to tell you but can't find the courage to speak...
                  </p>
                  <div class="mt-8 flex gap-4 text-[11px] text-white/30 font-medium border-t border-white/5 pt-6">
                    <span>850 words</span>
                    <span>•</span>
                    <span>11:15 PM</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="relative">
              <div class="absolute left-1/2 -translate-x-1/2 top-0 size-2.5 rounded-full bg-white border border-white/10 shadow-sm z-10"></div>
              <div class="pt-8 flex flex-col items-center">
                <div class="text-center mb-6">
                  <span class="block text-2xl font-display font-medium text-white/60">October 18</span>
                  <span class="text-[10px] uppercase tracking-widest text-white/20 font-bold">Friday</span>
                </div>
                <div class="w-full ios-card rounded-ios-lg p-10 bg-white/5 backdrop-blur-md border border-white/10">
                  <div class="flex justify-between items-start mb-6">
                    <h3 class="text-xl font-medium text-white tracking-tight">Rain on the Window</h3>
                    <span class="material-symbols-outlined text-white/10 text-[22px]">bookmark</span>
                  </div>
                  <div class="flex flex-col md:flex-row gap-8 mb-8">
                    <div class="w-full md:w-56 h-36 shrink-0 rounded-ios bg-cover bg-center shadow-sm" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuB1cTdNnDkx3cYGJAHYTwAZoD6JhryILuFN_j4GKPjANEXVMKQvEhNYlZsu_JcCyyLQnv5cac1Iz2eCtzPjYX7fxR6FgwSVcu6cfSQWzwsJ3Ye1rn1M5D5ojJ82-aV66nQBluCjDbfo2_Z0CPFkbnFvWox16b6Xzt-5uBf6jjSyr4Dg5ZsdmD2c_QHHXjyVX67m3pNFwaPGpmqaql_mPcqi1lz54MUQER8XTuw_oNLXlbkckHhurry86KxqC8ciQxnm01X8CHnXoVc')"></div>
                    <p class="text-white/70 leading-relaxed font-light text-[17px]">
                      The rhythm of the rain is soothing today. I found that old polaroid in between the pages of my favorite book. It's funny how things find you when you're not looking.
                    </p>
                  </div>
                  <div class="flex gap-4 text-[11px] text-white/30 font-medium border-t border-white/5 pt-6">
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
  </div>
</template>

<script setup>
</script>

<style scoped>
.ios-blur {
  backdrop-filter: blur(30px) saturate(190%);
  -webkit-backdrop-filter: blur(30px) saturate(190%);
}
.ios-card {
  box-shadow: 0 8px 32px -4px rgba(0, 0, 0, 0.04);
}
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
}
</style>
