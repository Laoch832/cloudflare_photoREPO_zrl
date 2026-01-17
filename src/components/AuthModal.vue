<template>
  <transition name="auth-fade">
    <div v-if="isOpen" class="auth-overlay">
      <div class="auth-card google-style">
        <!-- Account Chooser State -->
        <div v-if="showAccountChooser" class="account-chooser">
          <div class="auth-header">
             <div class="google-logo">
              <span class="g-blue">G</span><span class="g-red">o</span><span class="g-yellow">o</span><span class="g-blue">g</span><span class="g-green">l</span><span class="g-red">e</span>
            </div>
            <h2>选择账号</h2>
          </div>
          
          <div class="account-list">
            <div 
              v-for="acc in savedAccounts" 
              :key="acc.email" 
              class="account-item"
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
            
            <div class="account-item add-account" @click="useAnotherAccount">
              <div class="acc-avatar icon">
                <span class="material-icons">person_add</span>
              </div>
              <div class="acc-info">
                <span class="acc-name">使用其他账号</span>
              </div>
            </div>
            
            <div class="account-item sso-login" @click="handleSSOLogin">
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
            <div class="google-logo">
              <span class="g-blue">G</span><span class="g-red">o</span><span class="g-yellow">o</span><span class="g-blue">g</span><span class="g-green">l</span><span class="g-red">e</span>
            </div>
            <h2>{{ isRegister ? '创建您的账号' : '登录' }}</h2>
            <p class="subtext">继续访问 暗恋日记</p>
          </div>

          <div class="auth-form">
            <div class="sso-section">
              <button class="sso-btn" @click="handleSSOLogin">
                <span class="material-icons">fingerprint</span>
                <span>通过 angzhic 一键登录</span>
              </button>
              <div class="divider">
                <span>或使用邮箱</span>
              </div>
            </div>
            
            <div class="input-group">
              <input 
                type="email" 
                v-model="email" 
                required 
                placeholder=" "
                id="email"
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
              >
              <label for="password">密码</label>
            </div>

            <div v-if="errorMsg" class="error-msg">
              <span class="material-icons error-icon">error</span>
              {{ errorMsg }}
            </div>

            <div class="auth-actions">
              <button class="text-btn" @click="toggleMode">
                {{ isRegister ? '已有账号？登录' : '创建账号' }}
              </button>
              <button class="next-btn" @click="handleSubmit" :disabled="loading">
                {{ loading ? '请稍候...' : (isRegister ? '注册' : '下一步') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'
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

const toggleMode = () => {
  isRegister.value = !isRegister.value
  errorMsg.value = ''
}

const savedAccounts = ref([])
const showAccountChooser = ref(false)

// Check for saved accounts on mount
import { onMounted } from 'vue'

onMounted(() => {
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
  // Focus password input automatically would be nice
  setTimeout(() => document.getElementById('password')?.focus(), 100)
}

const useAnotherAccount = () => {
  showAccountChooser.value = false
  email.value = ''
  password.value = ''
}

const handleSSOLogin = () => {
  const authCenterUrl = 'https://angzhic.pages.dev/login'
  const callbackUrl = `${window.location.origin}/auth/callback`
  window.location.href = `${authCenterUrl}?redirect=${encodeURIComponent(callbackUrl)}`
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
  background: white;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

[data-theme="dark"] .auth-overlay {
  background: #202124;
  color: white;
}

.auth-card {
  width: 100%;
  max-width: 450px;
  padding: 48px 40px 36px;
  border: 1px solid #dadce0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
}

[data-theme="dark"] .auth-card {
  border-color: #5f6368;
}

@media (max-width: 600px) {
  .auth-card {
    border: none;
    padding: 24px;
    height: 100%;
    justify-content: center;
  }
}

.google-logo {
  font-family: 'Product Sans', Arial, sans-serif;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  letter-spacing: -0.5px;
}

.g-blue { color: #4285f4; }
.g-red { color: #ea4335; }
.g-yellow { color: #fbbc05; }
.g-green { color: #34a853; }

.auth-header {
  text-align: center;
  width: 100%;
  margin-bottom: 40px;
}

.auth-header h2 {
  font-weight: 400;
  font-size: 24px;
  margin: 0 0 8px;
  font-family: 'Google Sans', 'Roboto', sans-serif;
}

.subtext {
  font-size: 16px;
  color: #202124;
}

[data-theme="dark"] .subtext {
  color: #e8eaed;
}

.auth-form {
  width: 100%;
}

.input-group {
  position: relative;
  margin-bottom: 24px;
}

input {
  width: 100%;
  padding: 13px 15px;
  font-size: 16px;
  border: 1px solid #dadce0;
  border-radius: 4px;
  outline: none;
  background: transparent;
  color: inherit;
  transition: border-color 0.2s;
}

[data-theme="dark"] input {
  border-color: #5f6368;
}

input:focus {
  border-color: #1a73e8;
  border-width: 2px;
  padding: 12px 14px; /* Adjust for border width */
}

[data-theme="dark"] input:focus {
  border-color: #8ab4f8;
}

label {
  position: absolute;
  left: 12px;
  top: 14px;
  padding: 0 4px;
  background: white;
  color: #5f6368;
  font-size: 16px;
  pointer-events: none;
  transition: 0.2s ease all;
}

[data-theme="dark"] label {
  background: #202124;
  color: #9aa0a6;
}

/* Float label when input has value or focus */
input:focus ~ label,
input:not(:placeholder-shown) ~ label {
  top: -10px;
  font-size: 12px;
  color: #1a73e8;
}

[data-theme="dark"] input:focus ~ label,
[data-theme="dark"] input:not(:placeholder-shown) ~ label {
  color: #8ab4f8;
}

.error-msg {
  display: flex;
  align-items: center;
  color: #d93025;
  font-size: 12px;
  margin-bottom: 20px;
  gap: 8px;
}

.error-icon {
  font-size: 16px;
}

.auth-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
}

.text-btn {
  background: none;
  border: none;
  color: #1a73e8;
  font-weight: 500;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  font-size: 14px;
}

[data-theme="dark"] .text-btn {
  color: #8ab4f8;
}

.text-btn:hover {
  background: rgba(26, 115, 232, 0.04);
}

.next-btn {
  background: #1a73e8;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

[data-theme="dark"] .next-btn {
  background: #8ab4f8;
  color: #202124;
}

.next-btn:hover:not(:disabled) {
  background: #1557b0;
  box-shadow: 0 1px 2px rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15);
}

.next-btn:disabled {
  opacity: 0.6;
  cursor: default;
}

/* Animations */
.auth-fade-enter-active,
.auth-fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0.0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.auth-fade-enter-from,
.auth-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
/* SSO Button Styles */
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
  border-radius: 4px;
  font-weight: 500;
  color: #3c4043;
  cursor: pointer;
  transition: background 0.2s;
  font-family: 'Google Sans', 'Roboto', sans-serif;
}

[data-theme="dark"] .sso-btn {
  background: #303134;
  border-color: #5f6368;
  color: #e8eaed;
}

.sso-btn:hover {
  background: #f8f9fa;
  box-shadow: 0 1px 1px rgba(0,0,0,0.1);
}

[data-theme="dark"] .sso-btn:hover {
  background: #3c4043;
}

.divider {
  display: flex;
  align-items: center;
  margin-top: 20px;
  color: #5f6368;
  font-size: 14px;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  border-top: 1px solid #dadce0;
}

[data-theme="dark"] .divider::before,
[data-theme="dark"] .divider::after {
  border-color: #5f6368;
}

.divider span {
  padding: 0 10px;
}

.sso-login {
  border-top: 1px solid rgba(0,0,0,0.05);
  margin-top: 10px;
  padding-top: 16px;
}

[data-theme="dark"] .sso-login {
  border-top-color: rgba(255,255,255,0.05);
}

/* Account Chooser Styles */
.account-list {
  width: 100%;
  margin-top: 20px;
}

.account-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  cursor: pointer;
  transition: background 0.2s;
  border-radius: 8px;
  padding: 10px 16px;
}

[data-theme="dark"] .account-item {
  border-bottom-color: rgba(255,255,255,0.05);
}

.account-item:hover {
  background: rgba(0,0,0,0.04);
}

[data-theme="dark"] .account-item:hover {
  background: rgba(255,255,255,0.04);
}

.acc-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
  margin-right: 16px;
  overflow: hidden;
}

.acc-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.acc-avatar.icon {
  background: transparent;
  color: #5f6368;
}

[data-theme="dark"] .acc-avatar.icon {
  color: #bdc1c6;
}

.acc-info {
  display: flex;
  flex-direction: column;
}

.acc-name {
  font-weight: 500;
  font-size: 15px;
  color: #202124;
}

[data-theme="dark"] .acc-name {
  color: #e8eaed;
}

.acc-email {
  font-size: 13px;
  color: #5f6368;
}

[data-theme="dark"] .acc-email {
  color: #9aa0a6;
}

.login-form-content {
    width: 100%;
}
</style>