<template>
  <transition name="auth-fade">
    <div v-if="isOpen" class="auth-overlay">
      <div class="auth-card google-style">
        <div class="auth-header">
          <div class="google-logo">
            <span class="g-blue">G</span>
            <span class="g-red">o</span>
            <span class="g-yellow">o</span>
            <span class="g-blue">g</span>
            <span class="g-green">l</span>
            <span class="g-red">e</span>
          </div>
          <h2>{{ isRegister ? '创建您的账号' : '登录' }}</h2>
          <p class="subtext">继续访问 暗恋日记</p>
        </div>

        <div class="auth-form">
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
</style>