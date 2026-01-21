<template>
  <transition name="auth-fade">
    <div v-if="isOpen" class="auth-overlay" @click.self="$emit('close')">
      <div class="auth-card x-style">
        <!-- Close Button -->
        <button class="close-btn" @click="$emit('close')">
          <span class="material-icons">close</span>
        </button>

        <!-- Account Chooser State -->
        <div v-if="showAccountChooser" class="account-chooser">
          <div class="auth-header">
             <h2 class="quote-title">{{ hitokoto }}</h2>
             <p class="subtext">选择账号以继续</p>
          </div>
          
          <div class="account-list">
            <div 
              v-for="acc in savedAccounts" 
              :key="acc.email" 
              class="account-item anim-hover-lift anim-squash"
              @click="selectAccount(acc)"
            >
              <div class="acc-avatar">
                <img v-if="acc.avatar_url" :src="acc.avatar_url">
                <span v-else>{{ acc.email[0].toUpperCase() }}</span>
              </div>
              <div class="acc-info">
                <span class="acc-name">{{ acc.full_name || acc.email.split('@')[0] }}</span>
                <span class="acc-email">{{ acc.email }}</span>
              </div>
            </div>
            
            <div class="account-item add-account anim-hover-lift anim-squash" @click="useAnotherAccount">
              <div class="acc-avatar icon">
                <span class="material-icons">person_add</span>
              </div>
              <div class="acc-info">
                <span class="acc-name">使用其他账号</span>
              </div>
            </div>
            
            <div class="account-item sso-login anim-hover-lift anim-squash" @click="handleSSOLogin">
              <div class="acc-avatar icon">
                <span class="material-icons">fingerprint</span>
              </div>
              <div class="acc-info">
                <span class="acc-name">一键登录 (SSO)</span>
                <span class="acc-email">angzhic 认证中心</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Login/Register Form State -->
        <div v-else class="login-form-content">
          <div class="auth-header">
            <h2 class="quote-title">{{ hitokoto }}</h2>
            <p class="subtext" v-if="!hitokoto.includes('Login')">{{ isRegister ? '创建您的账号' : '登录以继续' }}</p>
          </div>

          <div class="auth-form">
            <div class="sso-section">
              <button class="sso-btn anim-squash" @click="handleSSOLogin">
                <span class="material-icons">fingerprint</span>
                <span>通过 angzhic 一键登录</span>
              </button>
              <div class="divider">
                <span>或</span>
              </div>
            </div>
            
            <div class="input-group">
              <input 
                type="email" 
                v-model="email" 
                required 
                placeholder=" "
                id="email"
                class="smooth-transition"
              >
              <label for="email">邮箱</label>
            </div>

            <div class="input-group">
              <input 
                type="password" 
                v-model="password" 
                required 
                placeholder=" "
                id="password"
                @keyup.enter="handleSubmit"
                class="smooth-transition"
              >
              <label for="password">密码</label>
            </div>

            <div v-if="errorMsg" class="error-msg">
              <span class="material-icons error-icon">error</span>
              {{ errorMsg }}
            </div>

            <div class="auth-actions">
              <button class="next-btn anim-squash" @click="handleSubmit" :disabled="loading">
                {{ loading ? '请稍候...' : (isRegister ? '注册' : '下一步') }}
              </button>
              <button class="text-btn anim-squash" @click="toggleMode">
                {{ isRegister ? '已有账号？登录' : '没有账号？注册' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'success'])

const isRegister = ref(false)
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')
const hitokoto = ref('Login from here')

const toggleMode = () => {
  isRegister.value = !isRegister.value
  errorMsg.value = ''
}

const savedAccounts = ref([])
const showAccountChooser = ref(false)

const fetchHitokoto = async () => {
  try {
    // Fetch English quote
    const res = await fetch('https://api.quotable.io/random?maxLength=60')
    if (!res.ok) throw new Error('Network response was not ok')
    const data = await res.json()
    hitokoto.value = data.content
  } catch (e) {
    console.log('Quote fetch failed, using fallback')
    hitokoto.value = 'Login from here'
  }
}

onMounted(() => {
  fetchHitokoto()
  const saved = localStorage.getItem('saved_accounts')
  if (saved) {
    savedAccounts.value = JSON.parse(saved)
    if (savedAccounts.value.length > 0) {
      showAccountChooser.value = true
    }
  }
})

const selectAccount = (account) => {
  email.value = account.email
  showAccountChooser.value = false
  setTimeout(() => document.getElementById('password')?.focus(), 100)
}

const useAnotherAccount = () => {
  showAccountChooser.value = false
  email.value = ''
  password.value = ''
}

const handleSSOLogin = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const date = new Date()
  const domain = `${months[date.getMonth()]}.${date.getDate()}.auth.canz-monkey.cn`
  const authBaseUrl = `https://${domain}`
  
  const callbackUrl = `${window.location.origin}/auth/callback`
  window.location.href = `${authBaseUrl}/login?redirect=${encodeURIComponent(callbackUrl)}`
}

const handleSubmit = async () => {
  loading.value = true
  errorMsg.value = ''
  
  try {
    if (isRegister.value) {
      const { error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value
      })
      if (error) throw error
      alert('注册确认邮件已发送，请检查您的邮箱！')
      isRegister.value = false
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
      })
      if (error) throw error
      emit('success', data.user)
      emit('close')
    }
  } catch (e) {
    errorMsg.value = e.message === 'Invalid login credentials' 
      ? '账号或密码错误' 
      : e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4); /* Dimmed background */
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

[data-theme="dark"] .auth-overlay {
  background: rgba(91, 112, 131, 0.4);
}

.auth-card {
  position: relative;
  width: 100%;
  max-width: 600px;
  min-height: 400px; /* Minimal height for elegance */
  padding: 40px 80px; /* Wider padding like X */
  background: white;
  border-radius: 16px;
  box-shadow: 0 16px 32px rgba(0,0,0,0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
}

[data-theme="dark"] .auth-card {
  background: #000000;
  border: 1px solid #2f3336;
}

@media (max-width: 600px) {
  .auth-card {
    padding: 24px;
    height: 100%;
    max-width: 100%;
    border-radius: 0;
    justify-content: center;
  }
}

.close-btn {
  position: absolute;
  top: 16px;
  left: 16px; /* X usually has close on top-left for modals, but request said top-right */
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f1419;
  transition: background 0.2s;
}

/* User requested Top Right */
.close-btn {
  left: auto;
  right: 16px;
}

[data-theme="dark"] .close-btn {
  color: #eff3f4;
}

.close-btn:hover {
  background: rgba(15, 20, 25, 0.1);
}

[data-theme="dark"] .close-btn:hover {
  background: rgba(239, 243, 244, 0.1);
}

.auth-header {
  text-align: left; /* X style is often left or center. Let's stick to center for now as it looks better for quotes */
  width: 100%;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Align left looks more like X's "Happening now" */
}

.quote-title {
  font-family: 'TwitterChirp', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-weight: 700;
  font-size: 26px; /* Large, bold */
  margin: 0 0 12px;
  color: #0f1419;
  line-height: 1.3;
}

[data-theme="dark"] .quote-title {
  color: #eff3f4;
}

.subtext {
  font-size: 17px;
  color: #536471;
}

[data-theme="dark"] .subtext {
  color: #71767b;
}

.auth-form {
  width: 100%;
}

/* Inputs */
.input-group {
  position: relative;
  margin-bottom: 24px;
}

input {
  width: 100%;
  padding: 16px 12px;
  font-size: 17px;
  border: 1px solid #cfd9de;
  border-radius: 4px;
  outline: none;
  background: transparent;
  color: inherit;
  transition: all 0.2s;
}

[data-theme="dark"] input {
  border-color: #333639;
  color: #eff3f4;
}

input:focus {
  border-color: #1d9bf0;
  box-shadow: 0 0 0 1px #1d9bf0;
}

[data-theme="dark"] input:focus {
  border-color: #1d9bf0;
}

label {
  position: absolute;
  left: 8px;
  top: 18px;
  padding: 0 4px;
  background: white;
  color: #536471;
  font-size: 17px;
  pointer-events: none;
  transition: 0.2s ease all;
}

[data-theme="dark"] label {
  background: #000000;
  color: #71767b;
}

input:focus ~ label,
input:not(:placeholder-shown) ~ label {
  top: -8px;
  font-size: 13px;
  color: #1d9bf0;
}

/* Buttons */
.auth-actions {
  display: flex;
  flex-direction: column; /* X style stacks buttons */
  gap: 20px;
  margin-top: 40px;
}

.next-btn {
  width: 100%;
  background: #0f1419; /* Black button */
  color: white;
  border: none;
  padding: 14px;
  border-radius: 9999px; /* Pill shape */
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;
}

[data-theme="dark"] .next-btn {
  background: #eff3f4; /* White button in dark mode */
  color: #0f1419;
}

.next-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.next-btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.text-btn {
  background: none;
  border: 1px solid #cfd9de;
  color: #0f1419;
  font-weight: 700;
  cursor: pointer;
  padding: 14px;
  border-radius: 9999px;
  font-size: 15px;
  width: 100%;
}

[data-theme="dark"] .text-btn {
  border-color: #536471;
  color: #1d9bf0; /* Or standard text color */
}

.text-btn:hover {
  background: rgba(15, 20, 25, 0.1);
}

[data-theme="dark"] .text-btn:hover {
  background: rgba(239, 243, 244, 0.1);
}

/* SSO Button */
.sso-section {
  margin-bottom: 24px;
}

.sso-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  background: white;
  border: 1px solid #dadce0;
  border-radius: 9999px; /* Pill */
  font-weight: 500;
  color: #0f1419;
  cursor: pointer;
  transition: background 0.2s;
}

[data-theme="dark"] .sso-btn {
  background: transparent;
  border-color: #536471;
  color: #eff3f4;
}

.sso-btn:hover {
  background: #f7f9f9;
}

[data-theme="dark"] .sso-btn:hover {
  background: rgba(239, 243, 244, 0.1);
}

.divider {
  display: flex;
  align-items: center;
  margin: 20px 0;
  color: #536471;
  font-size: 15px;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  border-top: 1px solid #cfd9de;
}

[data-theme="dark"] .divider::before,
[data-theme="dark"] .divider::after {
  border-color: #2f3336;
}

.divider span {
  padding: 0 10px;
}

/* Error */
.error-msg {
  display: flex;
  align-items: center;
  color: #f4212e;
  font-size: 13px;
  margin-bottom: 20px;
  gap: 8px;
}

/* Animations */
.auth-fade-enter-active,
.auth-fade-leave-active {
  transition: opacity 0.2s ease;
}

.auth-fade-enter-from,
.auth-fade-leave-to {
  opacity: 0;
}

/* Account Chooser */
.account-list {
  width: 100%;
}

.account-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.account-item:hover {
  background: #eff3f4;
}

[data-theme="dark"] .account-item:hover {
  background: #16181c;
}

.acc-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #cfd9de;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
  margin-right: 12px;
  overflow: hidden;
}

[data-theme="dark"] .acc-avatar {
  background: #333639;
}

.acc-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.acc-info {
  display: flex;
  flex-direction: column;
}

.acc-name {
  font-weight: 700;
  font-size: 15px;
  color: #0f1419;
}

[data-theme="dark"] .acc-name {
  color: #eff3f4;
}

.acc-email {
  font-size: 14px;
  color: #536471;
}

[data-theme="dark"] .acc-email {
  color: #71767b;
}
</style>
