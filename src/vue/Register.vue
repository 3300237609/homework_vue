<template>
  <div class="register-container">
    <div class="register-left">
      <div class="register-card">
        <button class="back-btn" @click="goBack">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>返回首页</span>
        </button>

        <div class="register-header">
          <h2>创建账号</h2>
          <p>注册新账号开始使用系统</p>
        </div>

        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-group">
            <label>用户名</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input
                v-model="registerForm.username"
                type="text"
                placeholder="请输入用户名"
                class="form-input"
              />
            </div>
          </div>

          <div class="form-group">
            <label>密码</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                v-model="registerForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码"
                class="form-input"
              />
              <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 17h2a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2V9a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v1H3a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v1a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-1"></path>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                </svg>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>确认密码</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                v-model="registerForm.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="请再次输入密码"
                class="form-input"
              />
              <button type="button" class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
                <svg v-if="!showConfirmPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 17h2a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2V9a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v1H3a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v1a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-1"></path>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                </svg>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>姓名</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input
                v-model="registerForm.name"
                type="text"
                placeholder="请输入真实姓名"
                class="form-input"
              />
            </div>
          </div>

          <div class="form-group">
            <label>角色</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <select v-model="registerForm.roleId" class="form-input">
                <option value="3">学生</option>
                <option value="2">教师</option>
                <option value="1">管理员</option>
              </select>
            </div>
          </div>

          <button type="submit" class="register-btn" :disabled="isLoading">
            <svg v-if="isLoading" width="20" height="20" viewBox="0 0 24 24" fill="none" class="loading-icon">
              <circle class="spin" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            </svg>
            {{ isLoading ? '注册中...' : '注册' }}
          </button>
        </form>

        <p class="register-footer">
          已有账号？<a href="/login">立即登录</a>
        </p>
      </div>
    </div>

    <div class="register-right">
      <div class="brand-content">
        <div class="logo-wrapper">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#50C9C3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <polyline points="9 12 12 9 15 12"></polyline>
            <polyline points="9 18 12 15 15 18"></polyline>
          </svg>
        </div>
        <h1 class="brand-title">HomeworkPro</h1>
        <p class="brand-subtitle">智能作业管理系统</p>
        <div class="brand-divider"></div>
        <p class="brand-description">
          高效管理作业，提升学习效率<br>
          专为教师和学生设计的现代化作业管理平台
        </p>
        <div class="brand-features">
          <div class="feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#50C9C3">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>作业发布与管理</span>
          </div>
          <div class="feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#50C9C3">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>在线提交与批改</span>
          </div>
          <div class="feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#50C9C3">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>智能数据分析</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { userApi } from '../api/api';

const router = useRouter();
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isLoading = ref(false);

const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: '',
  name: '',
  roleId: '3'
});

const goBack = () => {
  router.push('/');
};

const handleRegister = async () => {
  if (!registerForm.value.username) {
    alert('请输入用户名');
    return;
  }
  if (!registerForm.value.password) {
    alert('请输入密码');
    return;
  }
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    alert('两次输入的密码不一致');
    return;
  }
  if (!registerForm.value.name) {
    alert('请输入姓名');
    return;
  }

  isLoading.value = true;

  try {
    const response = await userApi.register({
      username: registerForm.value.username,
      password: registerForm.value.password,
      name: registerForm.value.name,
      roleId: parseInt(registerForm.value.roleId)
    });

    if (response.code === 1) {
      alert('注册成功，请登录');
      router.push('/login');
    } else {
      alert(response.msg || '注册失败');
    }
  } catch (error) {
    console.error('注册错误:', error);
    alert('网络错误，请稍后重试');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.register-left {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;
  background-color: #ffffff;
}

.register-right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;
  background: linear-gradient(135deg, #f8fafc 0%, #e8f4f3 100%);
  position: relative;
  overflow: hidden;
}

.register-right::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(80, 201, 195, 0.05) 0%, transparent 70%);
  animation: pulse 8s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.register-card {
  width: 100%;
  max-width: 420px;
  position: relative;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #666;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 8px 0;
  margin-bottom: 40px;
  transition: color 0.3s ease;
}

.back-btn:hover {
  color: #50C9C3;
}

.register-header {
  margin-bottom: 40px;
}

.register-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 10px;
}

.register-header p {
  font-size: 1rem;
  color: #999;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.95rem;
  font-weight: 500;
  color: #333;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: #999;
  pointer-events: none;
}

.form-input {
  width: 100%;
  height: 52px;
  padding: 0 50px;
  border: 2px solid #eee;
  border-radius: 14px;
  font-size: 1rem;
  color: #333;
  background-color: #f8fafc;
  transition: all 0.3s ease;
  appearance: none;
}

.form-input:focus {
  outline: none;
  border-color: #50C9C3;
  background-color: #fff;
  box-shadow: 0 0 0 4px rgba(80, 201, 195, 0.1);
}

.form-input::placeholder {
  color: #bbb;
}

.toggle-password {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-password:hover {
  color: #50C9C3;
}

.register-btn {
  width: 100%;
  height: 52px;
  margin-top: 8px;
  background: linear-gradient(135deg, #50C9C3 0%, #45B8B2 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(80, 201, 195, 0.3);
}

.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(80, 201, 195, 0.4);
}

.register-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.register-footer {
  text-align: center;
  margin-top: 30px;
  color: #666;
  font-size: 0.95rem;
}

.register-footer a {
  color: #50C9C3;
  text-decoration: none;
  font-weight: 500;
}

.register-footer a:hover {
  text-decoration: underline;
}

.brand-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 400px;
}

.logo-wrapper {
  width: 120px;
  height: 120px;
  background: white;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 30px;
  box-shadow: 0 10px 40px rgba(80, 201, 195, 0.15);
}

.brand-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 10px;
}

.brand-subtitle {
  font-size: 1.25rem;
  color: #50C9C3;
  margin-bottom: 30px;
  font-weight: 500;
}

.brand-divider {
  width: 60px;
  height: 4px;
  background: linear-gradient(135deg, #50C9C3 0%, #45B8B2 100%);
  border-radius: 2px;
  margin: 0 auto 30px;
}

.brand-description {
  font-size: 1rem;
  color: #666;
  line-height: 1.8;
  margin-bottom: 40px;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #666;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .register-container {
    flex-direction: column;
  }

  .register-left,
  .register-right {
    width: 100%;
    padding: 40px 20px;
  }
}
</style>