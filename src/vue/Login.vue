<template>
  <div class="login-container">
    <div class="login-left">
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

    <div class="login-right">
      <div class="login-card">
        <button class="back-btn" @click="goBack">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>返回首页</span>
        </button>

        <div class="login-header">
          <h2>欢迎回来</h2>
          <p>请登录您的账号继续使用</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label>用户名</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input
                v-model="loginForm.username"
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
                v-model="loginForm.password"
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
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>
          </div>

          <div class="form-options">
            <label class="checkbox-wrapper">
              <input type="checkbox" v-model="loginForm.remember" />
              <span class="checkmark"></span>
              <span class="checkbox-label">记住密码</span>
            </label>
            <a href="#" class="forgot-link">忘记密码？</a>
          </div>

          <button type="submit" class="login-btn" :class="{ loading: isLoading }">
            <span v-if="!isLoading">登 录</span>
            <span v-else class="loading-text">登录中...</span>
          </button>
        </form>

        <div class="login-footer">
          <span>还没有账号？</span>
          <a href="/register" class="register-link">立即注册</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import request from '../api/request';

const router = useRouter();

const loginForm = ref({
  username: '',
  password: '',
  remember: false
});

const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

onMounted(() => {
  const savedUsername = localStorage.getItem('savedUsername');
  const savedPassword = localStorage.getItem('savedPassword');
  const savedRemember = localStorage.getItem('savedRemember');

  if (savedRemember === 'true') {
    loginForm.value.username = savedUsername || '';
    loginForm.value.password = savedPassword || '';
    loginForm.value.remember = true;
  }
});

const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    alert('请输入用户名和密码');
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await request.post('/user/login', loginForm.value);
    if (response.code === 1) {
      localStorage.setItem('userInfo', JSON.stringify(response.data));

      if (loginForm.value.remember) {
        localStorage.setItem('savedUsername', loginForm.value.username);
        localStorage.setItem('savedPassword', loginForm.value.password);
        localStorage.setItem('savedRemember', 'true');
      } else {
        localStorage.removeItem('savedUsername');
        localStorage.removeItem('savedPassword');
        localStorage.removeItem('savedRemember');
      }

      const roleId = response.data.roleId;
      switch (roleId) {
        case 1:
          router.push('/admin');
          break;
        case 2:
          router.push('/teacher');
          break;
        case 3:
          router.push('/student');
          break;
        default:
          router.push('/');
      }
    } else {
      alert('登录失败：' + (response.msg || '请检查用户名和密码'));
    }
  } catch (error) {
    console.error('登录错误:', error);
    alert('登录失败：网络错误');
  } finally {
    isLoading.value = false;
  }
};

const goBack = () => {
  router.push('/');
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-container {
  display: flex;
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.login-left {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;
  background: linear-gradient(135deg, #f8fafc 0%, #e8f4f3 100%);
  position: relative;
  overflow: hidden;
}

.login-left::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(80, 201, 195, 0.05) 0%, transparent 70%);
  animation: pulse 8s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.8; }
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

.login-right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;
  background-color: #ffffff;
}

.login-card {
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

.login-header {
  margin-bottom: 40px;
}

.login-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 10px;
}

.login-header p {
  font-size: 1rem;
  color: #999;
}

.login-form {
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -8px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  position: relative;
}

.checkbox-wrapper input {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.checkbox-wrapper input:checked + .checkmark {
  background-color: #50C9C3;
  border-color: #50C9C3;
}

.checkbox-wrapper input:checked + .checkmark::after {
  content: '';
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  margin-bottom: 2px;
}

.checkbox-label {
  font-size: 0.9rem;
  color: #666;
}

.forgot-link {
  font-size: 0.9rem;
  color: #50C9C3;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #45B8B2;
}

.login-btn {
  width: 100%;
  height: 52px;
  background: linear-gradient(135deg, #50C9C3 0%, #45B8B2 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(80, 201, 195, 0.3);
  transition: all 0.3s ease;
  margin-top: 8px;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(80, 201, 195, 0.4);
}

.login-btn:active {
  transform: translateY(0);
}

.login-btn.loading {
  opacity: 0.8;
  cursor: not-allowed;
}

.loading-text {
  display: inline-block;
}

.login-footer {
  text-align: center;
  margin-top: 30px;
  font-size: 0.95rem;
  color: #666;
}

.register-link {
  color: #50C9C3;
  text-decoration: none;
  font-weight: 500;
  margin-left: 6px;
  transition: color 0.3s ease;
}

.register-link:hover {
  color: #45B8B2;
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }

  .login-left {
    padding: 40px 20px;
    min-height: auto;
  }

  .brand-content {
    max-width: 100%;
  }

  .brand-title {
    font-size: 2rem;
  }

  .brand-features {
    display: none;
  }

  .login-right {
    padding: 40px 20px;
  }
}
</style>