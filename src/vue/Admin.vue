<template>
  <div class="admin-container">
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
        <router-link to="/admin/users" class="nav-item" :class="{ active: activeMenu === '/admin/users' }">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <span>用户管理</span>
        </router-link>
        <router-link to="/admin/classes" class="nav-item" :class="{ active: activeMenu === '/admin/classes' }">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span>班级管理</span>
        </router-link>
        <router-link to="/admin/courses" class="nav-item" :class="{ active: activeMenu === '/admin/courses' }">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <span>课表管理</span>
        </router-link>
        <router-link to="/admin/course-manager" class="nav-item" :class="{ active: activeMenu === '/admin/course-manager' }">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span>课程管理</span>
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
  if (path.includes('/users')) {
    return '用户管理';
  } else if (path.includes('/classes')) {
    return '班级管理';
  } else if (path.includes('/course-manager')) {
    return '课程管理';
  } else if (path.includes('/courses')) {
    return '课表管理';
  } else {
    return '用户管理';
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
  if (route.path === '/admin') {
    router.push('/admin/users');
  }
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.admin-container {
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