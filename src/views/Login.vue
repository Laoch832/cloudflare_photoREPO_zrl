<template>
  <div class="login-page">
    <div class="login-container">
      <h2>欢迎回来</h2>
      <p class="subtitle">登录以管理您的珍藏</p>

      <div class="form-group">
        <label>邮箱</label>
        <input 
          v-model="email" 
          type="email" 
          placeholder="your@email.com"
          @keyup.enter="handleLogin"
        >
      </div>

      <div class="form-group">
        <label>密码</label>
        <input 
          v-model="password" 
          type="password" 
          placeholder="您的密码"
          @keyup.enter="handleLogin"
        >
      </div>

      <div v-if="errorMsg" class="error-msg">
        {{ errorMsg }}
      </div>

      <div class="actions">
        <button 
          class="btn-primary" 
          :disabled="loading" 
          @click="handleLogin"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>
        <button 
          class="btn-secondary" 
          :disabled="loading" 
          @click="handleSignUp"
        >
          注册
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    errorMsg.value = ''
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (error) throw error
    
    router.push('/')
  } catch (error) {
    errorMsg.value = error.message
  } finally {
    loading.value = false
  }
}

const handleSignUp = async () => {
  try {
    loading.value = true
    errorMsg.value = ''
    
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    })

    if (error) throw error
    
    alert('注册确认邮件已发送，请检查您的邮箱！')
  } catch (error) {
    errorMsg.value = error.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

[data-theme="dark"] .login-container {
  background: rgba(30, 30, 30, 0.85);
  border-color: rgba(255, 255, 255, 0.1);
  color: white;
}

h2 {
  margin: 0 0 8px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
}

.subtitle {
  margin: 0 0 32px;
  color: var(--text-light);
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.5);
  transition: all 0.3s;
}

[data-theme="dark"] input {
  background: rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.1);
  color: white;
}

input:focus {
  outline: none;
  border-color: var(--primary-color);
  background: white;
  box-shadow: 0 0 0 3px rgba(255, 77, 109, 0.1);
}

[data-theme="dark"] input:focus {
  background: rgba(0, 0, 0, 0.4);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 32px;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-1px);
}

.btn-secondary {
  width: 100%;
  padding: 12px;
  background: transparent;
  color: var(--text-color);
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

[data-theme="dark"] .btn-secondary {
  color: white;
  border-color: rgba(255,255,255,0.1);
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(0,0,0,0.05);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-msg {
  color: #ff4d4d;
  font-size: 0.85rem;
  margin-top: 10px;
}
</style>
