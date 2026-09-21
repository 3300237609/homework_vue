<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isNavFixed = ref(false)
const activeNav = ref('Home')

const navItems = ['Home', 'Works', 'About', 'News', 'Contact']

const handleScroll = () => {
  isNavFixed.value = window.scrollY > 50
}

const scrollToSection = (sectionId) => {
  activeNav.value = sectionId
  const element = document.getElementById(sectionId.toLowerCase())
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const stats = [
  { value: '50K+', label: '活跃用户', color: '#FFB6C1' },
  { value: '1M+', label: '作业提交', color: '#FFE4B5' },
  { value: '99.9%', label: '系统稳定性', color: '#B0E0E6' },
  { value: '24/7', label: '全天候服务', color: '#98FB98' }
]

const features = [
  {
    icon: '📊',
    title: '智能分析',
    description: '强大的数据可视化分析，实时掌握学习进度'
  },
  {
    icon: '✏️',
    title: '在线批改',
    description: '高效的在线批改系统，节省教师时间成本'
  },
  {
    icon: '🔔',
    title: '即时通知',
    description: '作业状态实时通知，不错过任何重要信息'
  },
  {
    icon: '🔒',
    title: '安全可靠',
    description: '多重数据加密保护，确保信息安全'
  }
]

const latestNews = [
  { title: '新版本发布：支持批量作业管理', date: '2026-04-28' },
  { title: 'AI智能批改功能上线', date: '2026-04-25' },
  { title: '新增数据统计仪表盘', date: '2026-04-20' }
]
</script>

<template>
  <div class="dashboard">
    <nav 
      class="navbar" 
      :class="{ 'navbar-fixed': isNavFixed }"
    >
      <div class="nav-container">
        <div class="logo">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#50C9C3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <polyline points="9 12 12 9 15 12"></polyline>
            <polyline points="9 18 12 15 15 18"></polyline>
          </svg>
          <span>HomeworkPro</span>
        </div>
        <div class="nav-menu">
          <button 
            v-for="item in navItems" 
            :key="item"
            class="nav-item"
            :class="{ active: activeNav === item }"
            @click="scrollToSection(item)"
          >
            {{ item }}
          </button>
          <button class="nav-btn" @click="scrollToSection('Contact')">
            开始使用
          </button>
        </div>
      </div>
    </nav>

    <section id="home" class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">
            让作业管理
            <span class="highlight">更简单</span>
          </h1>
          <p class="hero-description">
            智能作业管理系统，帮助教师高效批改，助力学生提升成绩。简洁、高效、智能，让学习更轻松。
          </p>
          <div class="hero-buttons">
            <button class="btn-primary" @click="scrollToSection('Works')">
              了解更多
            </button>
            <button class="btn-secondary" @click="scrollToSection('Contact')">
              免费试用
            </button>
          </div>
        </div>
        <div class="hero-visual">
          <div class="chart-container">
            <div class="chart-card">
              <div class="chart-header">
                <span class="chart-title">作业完成率</span>
                <svg class="trend-icon" width="16" height="16" viewBox="0 0 24 24" fill="#50C9C3">
                  <path d="M18 20V10M12 20V4M6 20v-6"></path>
                </svg>
              </div>
              <div class="bar-chart">
                <div class="bar" style="height: 60%; background: linear-gradient(180deg, #50C9C3 0%, #88D4D0 100%);"></div>
                <div class="bar" style="height: 80%; background: linear-gradient(180deg, #FFB6C1 0%, #FFC8D4 100%);"></div>
                <div class="bar" style="height: 70%; background: linear-gradient(180deg, #FFE4B5 0%, #FFF0C9 100%);"></div>
                <div class="bar" style="height: 90%; background: linear-gradient(180deg, #B0E0E6 0%, #C8EBE6 100%);"></div>
                <div class="bar" style="height: 75%; background: linear-gradient(180deg, #50C9C3 0%, #88D4D0 100%);"></div>
              </div>
            </div>
            <div class="pie-card">
              <div class="pie-chart">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#50C9C3" stroke-width="20" stroke-dasharray="200 251.2"></circle>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#FFB6C1" stroke-width="20" stroke-dasharray="80 251.2" stroke-dashoffset="-200"></circle>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#FFE4B5" stroke-width="20" stroke-dasharray="71.2 251.2" stroke-dashoffset="-280"></circle>
                  <text x="50" y="55" text-anchor="middle" font-size="14" fill="#333">78%</text>
                </svg>
              </div>
              <div class="pie-label">完成率</div>
            </div>
            <div class="stats-card">
              <div class="stat-item">
                <span class="stat-value">12,580</span>
                <span class="stat-label">本周提交</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">98%</span>
                <span class="stat-label">准时率</span>
              </div>
            </div>
          </div>
          <div class="floating-icons">
            <div class="float-icon icon1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#50C9C3">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <div class="float-icon icon2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFB6C1">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="12 6 16 12 12 18 8 12"></polygon>
              </svg>
            </div>
            <div class="float-icon icon3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFE4B5">
                <rect x="3" y="3" width="7" height="18" rx="1"></rect>
                <rect x="14" y="3" width="7" height="18" rx="1"></rect>
              </svg>
            </div>
            <div class="float-icon icon4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#B0E0E6">
                <path d="M12 2v20M2 12h20"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="works" class="stats-section">
      <div class="stats-container">
        <div 
          v-for="stat in stats" 
          :key="stat.label"
          class="stat-card"
        >
          <div class="stat-number" :style="{ color: stat.color }">{{ stat.value }}</div>
          <div class="stat-text">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <section id="about" class="features-section">
      <div class="features-container">
        <div class="section-header">
          <h2>核心功能</h2>
          <p>为您提供全方位的作业管理解决方案</p>
        </div>
        <div class="features-grid">
          <div 
            v-for="feature in features" 
            :key="feature.title"
            class="feature-card"
          >
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="news" class="news-section">
      <div class="news-container">
        <div class="section-header">
          <h2>最新动态</h2>
          <p>了解我们的最新产品更新和功能发布</p>
        </div>
        <div class="news-list">
          <div 
            v-for="(news, index) in latestNews" 
            :key="index"
            class="news-item"
          >
            <span class="news-date">{{ news.date }}</span>
            <span class="news-title">{{ news.title }}</span>
          </div>
        </div>
      </div>
    </section>

    <section id="contact" class="contact-section">
      <div class="contact-container">
        <div class="contact-content">
          <h2>准备好开始了吗？</h2>
          <p>立即注册，免费体验全部功能</p>
          <div class="contact-buttons">
            <button class="btn-primary" @click="goToRegister">免费注册</button>
            <button class="btn-secondary" @click="goToLogin">登录</button>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#50C9C3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <polyline points="9 12 12 9 15 12"></polyline>
              <polyline points="9 18 12 15 15 18"></polyline>
            </svg>
            <span>HomeworkPro</span>
          </div>
          <div class="footer-links">
            <a href="#home">首页</a>
            <a href="#works">功能</a>
            <a href="#about">关于</a>
            <a href="#news">动态</a>
          </div>
          <div class="footer-copyright">
            © 2026 HomeworkPro. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.dashboard {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #ffffff;
  min-height: 100vh;
}

.navbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 1rem 2rem;
  transition: all 0.3s ease;
  z-index: 100;
  background-color: #ffffff;
}

.navbar-fixed {
  position: fixed;
  top: 0;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-item {
  background: none;
  border: none;
  font-size: 1rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-item:hover {
  color: #50C9C3;
  background-color: rgba(80, 201, 195, 0.1);
}

.nav-item.active {
  color: #50C9C3;
  font-weight: 600;
}

.nav-btn {
  background: linear-gradient(135deg, #50C9C3 0%, #45B8B2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(80, 201, 195, 0.3);
  transition: all 0.3s ease;
}

.nav-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(80, 201, 195, 0.4);
}

.hero-section {
  padding: 10rem 2rem 6rem;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-content {
  max-width: 500px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: #1a1a2e;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.highlight {
  color: #50C9C3;
  position: relative;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: 0.25rem;
  left: 0;
  right: 0;
  height: 0.5rem;
  background-color: rgba(80, 201, 195, 0.2);
  z-index: -1;
  border-radius: 4px;
}

.hero-description {
  font-size: 1.125rem;
  color: #666;
  line-height: 1.8;
  margin-bottom: 2rem;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #50C9C3 0%, #45B8B2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(80, 201, 195, 0.3);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(80, 201, 195, 0.4);
}

.btn-secondary {
  background: white;
  color: #50C9C3;
  border: 2px solid #50C9C3;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background-color: rgba(80, 201, 195, 0.05);
}

.hero-visual {
  position: relative;
  height: 400px;
}

.chart-container {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.chart-card {
  background: white;
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  width: 200px;
  transition: all 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.chart-title {
  font-size: 0.875rem;
  color: #666;
}

.trend-icon {
  color: #50C9C3;
}

.bar-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 80px;
  gap: 8px;
}

.bar {
  width: 12px;
  border-radius: 6px;
  transition: height 0.5s ease;
}

.pie-card {
  background: white;
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  width: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
}

.pie-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}

.pie-chart {
  width: 100px;
  height: 100px;
}

.pie-label {
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.5rem;
}

.stats-card {
  background: white;
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  width: 160px;
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 0;
}

.stat-item:first-child {
  border-bottom: 1px solid #eee;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #50C9C3;
}

.stat-label {
  font-size: 0.75rem;
  color: #999;
  margin-top: 0.25rem;
}

.floating-icons {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.float-icon {
  position: absolute;
  opacity: 0.6;
  animation: float 3s ease-in-out infinite;
}

.icon1 {
  top: 20%;
  right: 10%;
  animation-delay: 0s;
}

.icon2 {
  top: 60%;
  left: 5%;
  animation-delay: 0.5s;
}

.icon3 {
  bottom: 20%;
  right: 20%;
  animation-delay: 1s;
}

.icon4 {
  top: 40%;
  left: -5%;
  animation-delay: 1.5s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.stats-section {
  padding: 6rem 2rem;
  background: white;
}

.stats-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-text {
  font-size: 0.9rem;
  color: #666;
}

.features-section {
  padding: 6rem 2rem;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

.features-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 1rem;
}

.section-header p {
  font-size: 1.125rem;
  color: #666;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.75rem;
}

.feature-card p {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.6;
}

.news-section {
  padding: 6rem 2rem;
  background: white;
}

.news-container {
  max-width: 800px;
  margin: 0 auto;
}

.news-list {
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.news-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #eee;
  transition: background-color 0.3s ease;
}

.news-item:last-child {
  border-bottom: none;
}

.news-item:hover {
  background-color: #f8fafc;
}

.news-date {
  font-size: 0.875rem;
  color: #999;
}

.news-title {
  font-size: 1rem;
  color: #333;
  font-weight: 500;
}

.contact-section {
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #50C9C3 0%, #45B8B2 100%);
  text-align: center;
}

.contact-container {
  max-width: 600px;
  margin: 0 auto;
}

.contact-content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
}

.contact-content p {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
}

.contact-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.contact-buttons .btn-primary {
  background: white;
  color: #50C9C3;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.contact-buttons .btn-primary:hover {
  transform: translateY(-2px);
}

.contact-buttons .btn-secondary {
  background: transparent;
  color: white;
  border-color: white;
}

.contact-buttons .btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}

.footer {
  padding: 3rem 2rem;
  background: #1a1a2e;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-weight: 600;
}

.footer-links {
  display: flex;
  gap: 2rem;
}

.footer-links a {
  color: #999;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #50C9C3;
}

.footer-copyright {
  color: #666;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-buttons {
    justify-content: center;
  }
  
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .nav-menu {
    gap: 1rem;
  }
  
  .nav-item {
    display: none;
  }
}
</style>