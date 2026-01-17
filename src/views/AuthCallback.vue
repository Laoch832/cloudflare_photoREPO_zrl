<template>
  <div class="callback-page">
    <div class="spinner"></div>
    <p>正在验证登录...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'

const router = useRouter()

onMounted(async () => {
  const hash = window.location.hash
  
  if (hash) {
    // 解析 Hash 中的 access_token 和 refresh_token
    const params = new URLSearchParams(hash.substring(1)) // 去掉 #
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')

    if (accessToken && refreshToken) {
      try {
        // 设置会话，实现“一键登录”
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })
        
        if (!error) {
          // 登录成功，跳转到首页
          router.push('/')
        } else {
          console.error('Session set error:', error)
          alert('登录验证失败，请重试')
          router.push('/')
        }
      } catch (e) {
        console.error('Login exception:', e)
        router.push('/')
      }
    } else {
      // 如果没有 token，可能是其他类型的 hash，或者错误跳转
      router.push('/')
    }
  } else {
    router.push('/')
  }
})
</script>

<style scoped>
.callback-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0,0,0,0.1);
  border-left-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>