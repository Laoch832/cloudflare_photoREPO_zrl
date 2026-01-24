<template>
  <div class="deep-artistic-bg min-h-screen selection:bg-profile-primary/30 text-white font-sans">
    <nav class="nav-glass fixed top-0 w-full z-50 h-16 flex items-center px-8 justify-between">
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-profile-primary text-[24px]">auto_awesome</span>
        <span class="font-serif italic text-xl tracking-tight text-white/90">Secret Crush</span>
      </div>
      <div class="flex items-center gap-8">
        <router-link class="text-sm font-medium text-white/60 hover:text-white transition-colors" to="/">Journal</router-link>
        <a class="text-sm font-medium text-white/60 hover:text-white transition-colors" href="#">Reflections</a>
        <a class="text-sm font-medium text-white border-b-2 border-profile-primary/50 pb-1" href="#">Profile</a>
      </div>
      <div class="flex items-center gap-4">
        <button class="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all">
          <span class="material-symbols-outlined text-[18px]">notifications</span>
        </button>
        <div class="w-9 h-9 rounded-full overflow-hidden border border-white/20">
          <img alt="User" class="w-full h-full object-cover bg-profile-primary/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7bDLIyNfmqHABErN7cGeymNaIsKpZMstW7aKCS1Fge5-aVQvi7LKG3zSJm6MXfAXwzATmBgUekrdJ63ka5W9d5NpIJ6j4Du_HSrubt9Tm7JHYcUSDxPgVqCUCUmKQFZThJV2vEfmk6sEjL_uppBG-OvY9bOrL_moQWdbvg55iYHFfL9HKF_OQnN6ju32_qDLfSlJ842b8XE5-Mgz5bUk5JWS8a_PPGB7nQAAaTm9nzuiQx6Z7aGOQxxZlzaB9KakBvMV-Mxbqcyw"/>
        </div>
      </div>
    </nav>
    <main class="pt-32 pb-48 flex items-center justify-center px-6">
      <div class="w-full max-w-[840px] flex flex-col items-center">
        <div class="text-center mb-12">
          <h2 class="font-serif text-4xl text-white font-light mb-4">Account Settings</h2>
          <p class="text-white/40 text-[13px] uppercase tracking-[0.2em] font-light">Manage your private digital world</p>
        </div>
        <div class="w-full glass-card rounded-ios overflow-hidden">
          <div class="flex flex-col md:flex-row min-h-[500px]">
            <div class="w-full md:w-64 border-r border-white/5 bg-black/10 p-6 space-y-1">
              <button class="w-full flex items-center gap-3 px-4 py-3 rounded-ios-inner bg-white/10 text-white text-sm font-medium transition-all">
                <span class="material-symbols-outlined text-[20px]">person</span>
                Personal Info
              </button>
              <button class="w-full flex items-center gap-3 px-4 py-3 rounded-ios-inner text-white/40 hover:bg-white/5 hover:text-white/60 text-sm font-medium transition-all">
                <span class="material-symbols-outlined text-[20px]">lock</span>
                Security
              </button>
              <button class="w-full flex items-center gap-3 px-4 py-3 rounded-ios-inner text-white/40 hover:bg-white/5 hover:text-white/60 text-sm font-medium transition-all">
                <span class="material-symbols-outlined text-[20px]">palette</span>
                Appearance
              </button>
              <button class="w-full flex items-center gap-3 px-4 py-3 rounded-ios-inner text-white/40 hover:bg-white/5 hover:text-white/60 text-sm font-medium transition-all">
                <span class="material-symbols-outlined text-[20px]">notifications_active</span>
                Privacy
              </button>
            </div>
            <div class="flex-1 p-12 lg:p-16">
              <div class="max-w-[480px]">
                <div class="mb-10 flex items-center gap-6">
                  <div class="relative group">
                    <div class="w-24 h-24 rounded-full overflow-hidden border-2 border-profile-primary/30 ring-4 ring-black/10">
                      <img alt="Profile" class="w-full h-full object-cover bg-profile-primary/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWMOcUiTuViLNumx_9ozWWXt5jH4k3M0TLCitW6P8E7etiFCWLL-o4R-AgQLIlL7mjc8t_gDC23aMIrBPxLwkqLP_puWEaReI6eT71tNIR3A7ihmbm563d3y8zOe8kAonk4hnnUzurcE6CiFEmauhQapwm5wQr_kvbbCHtLPO7buQpL79zcLHX4-mCAl1vCcpLHPADrkTh3zVgeAgMWRe7qSQTwa1r_aCvlVW43J7_C_y3qOl1tkCE8DjhcEZqpDjwQ0d3LTe_9SM"/>
                    </div>
                    <button class="absolute bottom-0 right-0 bg-profile-primary w-8 h-8 rounded-full flex items-center justify-center border-2 border-[#0c0a0f] text-white shadow-lg transform group-hover:scale-110 transition-transform">
                      <span class="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                  </div>
                  <div class="space-y-1">
                    <h3 class="text-xl font-medium text-white">Felix Harrington</h3>
                    <p class="text-white/30 text-sm italic">"Keep it secret, keep it safe."</p>
                  </div>
                </div>
                <div class="space-y-8">
                  <div class="space-y-2">
                    <label class="block text-white/40 text-[11px] font-semibold uppercase tracking-widest px-1">Display Name</label>
                    <input class="w-full ios-input rounded-ios-inner h-[52px] px-5 text-white focus:outline-none text-[15px]" type="text" value="Felix Harrington"/>
                  </div>
                  <div class="space-y-2">
                    <label class="block text-white/40 text-[11px] font-semibold uppercase tracking-widest px-1">Email Address</label>
                    <input class="w-full ios-input rounded-ios-inner h-[52px] px-5 text-white/50 focus:outline-none text-[15px] cursor-not-allowed" readonly="" type="email" value="felix.h@example.com"/>
                    <p class="text-white/20 text-[10px] px-1 italic">Verified via Magic Login</p>
                  </div>
                  <div class="space-y-2">
                    <label class="block text-white/40 text-[11px] font-semibold uppercase tracking-widest px-1">Secret Note Signature</label>
                    <input class="w-full ios-input rounded-ios-inner h-[52px] px-5 text-white focus:outline-none text-[15px]" placeholder="Anonymous admirer..." type="text"/>
                  </div>
                  <div class="pt-6 border-t border-white/5 flex gap-4">
                    <button class="magic-gradient px-8 h-[48px] rounded-ios-inner text-white font-semibold text-[14px] transition-all active:scale-[0.98] shadow-lg shadow-profile-primary/20">
                      Save Changes
                    </button>
                    <button class="px-8 h-[48px] rounded-ios-inner border border-white/10 text-white/40 hover:text-white/80 hover:bg-white/5 text-[14px] transition-all">
                      Discard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <div class="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-full max-w-[400px] px-4">
      <div class="music-widget-glass rounded-ios p-4 flex items-center gap-4">
        <div class="w-12 h-12 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
          <img alt="Album Art" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIDjkxUqMEwvwFZILX0XTI5dbUc_ZIgfAzydAZiBjQnEDzFQlvu45Vo21PynS64a7mX6N2QdamwyY0WBe8Rth-bjdAx2L2v68NoOq9Sb_sLVMweTwEMBbLXFK3OsSt_ak8Ew9pJmBd0vpfAnRpTBXEC5aYvIKQ2WPgf6eCBMUYB9AXVmFSjd9M2ChUHeDTwMqLYmLPNT_vi4Y9F1FXiEtN9qi-ryPb7tX0elh50PnQwHAV5gerjTDkjzsEMF5ezHM3EPEubVUaoHQ"/>
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="text-white text-[13px] font-medium truncate">Enchanted (Taylor's Version)</h4>
          <p class="text-white/40 text-[11px] truncate">Now playing your crush anthem</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="text-white/80 hover:text-white">
            <span class="material-symbols-outlined text-[24px]">skip_previous</span>
          </button>
          <button class="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center">
            <span class="material-symbols-outlined text-[20px] fill-1">pause</span>
          </button>
          <button class="text-white/80 hover:text-white">
            <span class="material-symbols-outlined text-[24px]">skip_next</span>
          </button>
        </div>
      </div>
    </div>
    <div class="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-profile-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
    <div class="fixed bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.deep-artistic-bg {
  background-image: linear-gradient(135deg, rgba(12, 10, 15, 0.7), rgba(46, 16, 101, 0.4)), url(https://lh3.googleusercontent.com/aida-public/AB6AXuAxJXM0jdq9tuvBmGHxC-096qKAalgA3eM0vNwsdgQlteghFSC2NNW6IiHhUYuHW9i4dK0tri_7ZB__iCHgcIHsXMXOmJcW-nq4XbsCRALQ5IHemvFjfrcbE0QMkFFv-8jr5stpwdwk6vRtFo8PJZfADQEldgq9tg_kI1qe92kr3FgQ7IPiZrjZm6_dZBwQTx7XYOnBwkhMk7eSHbnqSurEg15QMi24OymzLpaqWFbIthCnMrmGVvr3QWrd3_J6zDWobXl7voouzEY);
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-color: #0c0a0f;
}
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
.nav-glass {
  background: rgba(12, 10, 15, 0.5);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.ios-input {
  background: rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
}
.ios-input:focus {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(139, 92, 246, 0.4);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(139, 92, 246, 0.1);
}
.premium-list-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  transition: background 0.2s ease;
}
.premium-list-item:last-child {
  border-bottom: none;
}
.premium-list-item:hover {
  background: rgba(255, 255, 255, 0.02);
}
.magic-gradient {
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  position: relative;
  overflow: hidden;
}
.music-widget-glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(25px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
