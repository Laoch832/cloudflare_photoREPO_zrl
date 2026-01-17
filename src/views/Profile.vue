<template>
  <div class="profile-page">
    <div class="profile-card">
      <div class="header">
        <h2>个人资料</h2>
        <p>管理您的个人信息和隐私设置</p>
      </div>

      <div class="avatar-section">
        <div class="avatar-wrapper">
          <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="avatar-img">
          <div v-else class="avatar-placeholder">
            {{ (name || email || '?')[0].toUpperCase() }}
          </div>
          <label class="edit-avatar">
            <span class="material-icons">edit</span>
            <input type="file" accept="image/*" @change="uploadAvatar" :disabled="uploading">
          </label>
        </div>
        <p class="email-display">{{ email }}</p>
      </div>

      <div class="form-section">
        <div class="input-group">
          <label>昵称</label>
          <input type="text" v-model="name" placeholder="设置一个昵称">
        </div>
        
        <button class="save-btn" @click="updateProfile" :disabled="loading">
          {{ loading ? '保存中...' : '保存更改' }}
        </button>
      </div>

      <div class="divider"></div>

      <div class="actions">
        <button class="logout-btn" @click="handleLogout">
          <span class="material-icons">logout</span>
          退出登录
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const uploading = ref(false)
const email = ref('')
const name = ref('')
const avatarUrl = ref('')

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    router.push('/')
    return
  }
  
  email.value = user.email
  name.value = user.user_metadata.full_name || ''
  avatarUrl.value = user.user_metadata.avatar_url || ''
})

const updateProfile = async () => {
  try {
    loading.value = true
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name.value }
    })
    if (error) throw error
    alert('资料已更新')
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

const uploadAvatar = async (event) => {
  try {
    uploading.value = true
    const file = event.target.files[0]
    if (!file) return

    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    // Upload to 'avatars' bucket (Assuming it exists, if not need to create or handle error)
    // For now, let's assume we might not have storage bucket set up yet or permissions.
    // Ideally user needs to create a bucket named 'avatars' in Supabase dashboard.
    // If we fail, we'll alert user.
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: publicUrl }
    })

    if (updateError) throw updateError
    
    avatarUrl.value = publicUrl
  } catch (error) {
    console.error(error)
    alert('上传头像失败: 请确保在Supabase中创建了名为"avatars"的公开存储桶')
  } finally {
    uploading.value = false
  }
}

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/')
  // Force reload to update App state or rely on App.vue listener
}
</script>

<style scoped>
.profile-page {
  padding: 40px 20px;
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.profile-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  width: 100%;
  max-width: 600px;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  border: 1px solid rgba(255,255,255,0.5);
}

[data-theme="dark"] .profile-card {
  background: rgba(30, 30, 30, 0.9);
  border-color: rgba(255,255,255,0.1);
  color: white;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h2 {
  font-size: 28px;
  margin-bottom: 8px;
}

.header p {
  color: var(--text-light);
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
}

.avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
}

.avatar-img, .avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.avatar-placeholder {
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: bold;
}

.edit-avatar {
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--text-main);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  transition: transform 0.2s;
}

[data-theme="dark"] .edit-avatar {
  background: white;
  color: black;
}

.edit-avatar:hover {
  transform: scale(1.1);
}

.edit-avatar input {
  display: none;
}

.email-display {
  font-size: 18px;
  font-weight: 500;
  opacity: 0.8;
}

.form-section {
  max-width: 400px;
  margin: 0 auto;
}

.input-group {
  margin-bottom: 24px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 14px;
}

.input-group input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.1);
  background: rgba(255,255,255,0.5);
  font-size: 16px;
  transition: all 0.3s;
}

[data-theme="dark"] .input-group input {
  background: rgba(0,0,0,0.2);
  border-color: rgba(255,255,255,0.1);
  color: white;
}

.input-group input:focus {
  background: white;
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 77, 109, 0.1);
}

.save-btn {
  width: 100%;
  padding: 14px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.save-btn:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-1px);
}

.divider {
  height: 1px;
  background: rgba(0,0,0,0.05);
  margin: 32px 0;
}

[data-theme="dark"] .divider {
  background: rgba(255,255,255,0.05);
}

.actions {
  display: flex;
  justify-content: center;
}

.logout-btn {
  background: transparent;
  border: 1px solid rgba(0,0,0,0.1);
  padding: 10px 24px;
  border-radius: 50px;
  color: #ff4d4d;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

[data-theme="dark"] .logout-btn {
  border-color: rgba(255,255,255,0.1);
}

.logout-btn:hover {
  background: #fff5f5;
  border-color: #ff4d4d;
}

[data-theme="dark"] .logout-btn:hover {
  background: rgba(255, 77, 77, 0.1);
}
</style>