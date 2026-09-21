<template>
  <div class="teacher-container">
    <aside class="sidebar" :class="{ collapsed: isCollapsed }">
      <div class="sidebar-header">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#50C9C3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <polyline points="9 12 12 9 15 12"></polyline>
          <polyline points="9 18 12 15 15 18"></polyline>
        </svg>
        <span class="logo-text">HomeworkPro</span>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/teacher/statistics" class="nav-item" :class="{ active: activeMenu === '/teacher/statistics' }">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          <span>作业统计</span>
        </router-link>
        <router-link to="/teacher/questions" class="nav-item" :class="{ active: activeMenu === '/teacher/questions' }">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          <span>题目管理</span>
        </router-link>
        <router-link to="/teacher/homework" class="nav-item" :class="{ active: activeMenu === '/teacher/homework' }">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span>作业管理</span>
        </router-link>
      </nav>
    </aside>

    <div class="main-wrapper">
      <header class="top-header">
        <button class="collapse-btn" @click="toggleSidebar">
          <svg v-if="!isCollapsed" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
        <h1 class="page-title">{{ activeMenuText }}</h1>
        <button class="logout-btn" style="margin-left: auto" @click="logout">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>退出登录</span>
        </button>
      </header>

      <main class="main-content">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const isCollapsed = ref(false);

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

const activeMenu = computed(() => route.path);

const activeMenuText = computed(() => {
  const path = route.path;
  if (path.includes('/statistics')) {
    return '作业统计';
  } else if (path.includes('/questions')) {
    return '题目管理';
  } else if (path.includes('/homework')) {
    return '作业管理';
  } else {
    return '作业统计';
  }
});

const logout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('userInfo');
    router.push('/');
  }
};

onMounted(() => {
  const userInfo = localStorage.getItem('userInfo');
  if (!userInfo) {
    router.push('/login');
    return;
  }
  if (route.path === '/teacher') {
    router.push('/teacher/statistics');
  }
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.teacher-container {
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.sidebar {
  width: 260px;
  background-color: #ffffff;
  box-shadow: 2px 0 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  z-index: 10;
  transition: width 0.3s ease;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar.collapsed .logo-text,
.sidebar.collapsed .nav-item span {
  display: none;
}

.sidebar.collapsed .sidebar-header {
  justify-content: center;
}

.sidebar-header {
  padding: 24px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #f0f0f0;
  transition: justify-content 0.3s ease;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a2e;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  text-decoration: none;
  color: #666;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background-color: rgba(80, 201, 195, 0.08);
  color: #50C9C3;
}

.nav-item.active {
  background: linear-gradient(135deg, #50C9C3 0%, #45B8B2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(80, 201, 195, 0.3);
}

.sidebar.collapsed .nav-item {
  justify-content: center;
}

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
}

.top-header {
  height: 70px;
  background-color: #ffffff;
  padding: 0 30px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
  gap: 16px;
}

.collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #f8fafc;
  border: none;
  border-radius: 10px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.collapse-btn:hover {
  background-color: #e8f4f3;
  color: #50C9C3;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a2e;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #f8fafc;
  border: none;
  border-radius: 10px;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: #fff0f0;
  color: #ff6b6b;
}

.main-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}
</style>