<template>
  <div class="page-container">
    <div class="page-header">
      <div class="welcome-section">
        <h1 class="page-title">我的作业</h1>
        <p class="page-subtitle">完成作业，收获成长</p>
      </div>
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #50C9C3, #45B8B2);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ homeworkList.length }}</div>
            <div class="stat-label">全部作业</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #FF9800, #F57C00);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ pendingCount }}</div>
            <div class="stat-label">待完成</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #4CAF50, #388E3C);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ completedCount }}</div>
            <div class="stat-label">已完成</div>
          </div>
        </div>
      </div>
    </div>

    <div class="filter-section">
      <div class="search-box">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input v-model="searchForm.courseId" type="text" placeholder="搜索课程" class="search-input" />
      </div>
      <div class="filter-tabs">
        <button 
          :class="['filter-tab', { active: searchForm.status === '' }]" 
          @click="searchForm.status = ''; loadHomeworkList()"
        >
          全部
        </button>
        <button 
          :class="['filter-tab', { active: searchForm.status === '未提交' }]" 
          @click="searchForm.status = '未提交'; loadHomeworkList()"
        >
          待完成
        </button>
        <button 
          :class="['filter-tab', { active: searchForm.status === '已提交（待批改）' }]" 
          @click="searchForm.status = '已提交（待批改）'; loadHomeworkList()"
        >
          已提交
        </button>
        <button 
          :class="['filter-tab', { active: searchForm.status === '已批改' }]" 
          @click="searchForm.status = '已批改'; loadHomeworkList()"
        >
          已批改
        </button>
      </div>
    </div>

    <div class="homework-grid" v-if="homeworkList.length > 0">
      <div v-for="hw in homeworkList" :key="hw.id" class="homework-card" :class="{ urgent: isUrgent(hw.deadline) }">
        <div class="card-header">
          <div class="course-badge">
            <span class="course-name">{{ hw.courseName || '课程' }}</span>
          </div>
          <span class="status-badge" :class="'status-' + getStatusClass(hw.status)">
            {{ hw.status }}
          </span>
        </div>
        
        <div class="card-body">
          <h3 class="homework-title">{{ hw.title }}</h3>
          <p class="homework-content">{{ hw.content }}</p>
          
          <div class="card-meta">
            <div class="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <span>{{ hw.clazzName || '-' }}</span>
            </div>
            <div class="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span :class="{ expired: isExpired(hw.deadline) }">
                {{ getCountdown(hw.deadline) }}
              </span>
            </div>
            <div class="meta-item" v-if="hw.totalScore !== null && hw.totalScore !== undefined">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2"><polyline points="18 2 22 6 12 16 2 6 6 2 12 12"></polyline></svg>
              <span class="score">{{ hw.totalScore }}分</span>
            </div>
          </div>
        </div>
        
        <div class="card-footer">
          <div class="deadline-display">
            <span class="deadline-label">截止时间：</span>
            <span class="deadline-value">{{ hw.deadline }}</span>
          </div>
          <button
            :class="['action-button', {
              primary: hw.status === '未提交' && !isExpired(hw.deadline),
              secondary: hw.status === '已批改' || (hw.status === '未提交' && isExpired(hw.deadline))
            }]"
            @click="submitHomework(hw.id)"
          >
            <svg v-if="hw.status === '未提交' && !isExpired(hw.deadline)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            {{ hw.status === '已批改' ? '查看详情' : (isExpired(hw.deadline) ? '查看详情' : '去完成') }}
          </button>
        </div>
      </div>
    </div>

    <div class="empty-state" v-else>
      <div class="empty-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ddd" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
      </div>
      <h3>暂无作业</h3>
      <p>当前筛选条件下没有找到作业</p>
      <button class="refresh-btn" @click="loadHomeworkList">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
        刷新
      </button>
    </div>

    <div class="pagination-container" v-if="totalPages > 1">
      <div class="pagination-info">共 {{ pagination.total }} 条记录</div>
      <div class="pagination-controls">
        <button class="page-btn" :disabled="pagination.pageNum <= 1" @click="handleCurrentChange(pagination.pageNum - 1)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
          上一页
        </button>
        <span class="page-indicator">第 {{ pagination.pageNum }} / {{ totalPages }} 页</span>
        <button class="page-btn" :disabled="pagination.pageNum >= totalPages" @click="handleCurrentChange(pagination.pageNum + 1)">
          下一页
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { homeworkApi } from '../../api/api';

const router = useRouter();
const searchForm = ref({ courseId: '', status: '' });
const homeworkList = ref([]);
const pagination = ref({ total: 0, pages: 1, pageSize: 10, pageNum: 1 });

const totalPages = computed(() => Math.ceil(pagination.value.total / pagination.value.pageSize) || 1);

const pendingCount = computed(() => {
  return homeworkList.value.filter(hw => hw.status === '未提交' && !isExpired(hw.deadline)).length;
});

const completedCount = computed(() => {
  return homeworkList.value.filter(hw => hw.status === '已完成' || hw.status === '已批改').length;
});

const getStatusClass = (status) => {
  if (status === '未提交') return 'pending';
  if (status === '已提交（待批改）') return 'submitted';
  if (status === '已完成') return 'completed';
  if (status === '已批改') return 'corrected';
  return '';
};

const isExpired = (deadline) => {
  if (!deadline) return true;
  const deadlineDate = new Date(deadline);
  return deadlineDate < new Date();
};

const isUrgent = (deadline) => {
  if (!deadline) return false;
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate - now;
  const hours = diff / (1000 * 60 * 60);
  return hours > 0 && hours <= 24;
};

const getCountdown = (deadline) => {
  if (!deadline) return '暂无截止';
  
  const now = new Date();
  const deadlineDate = new Date(deadline);
  
  if (deadlineDate <= now) {
    return '已截止';
  }
  
  const diff = deadlineDate - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `还剩 ${days}天 ${hours}时`;
  } else if (hours > 0) {
    return `还剩 ${hours}时 ${minutes}分`;
  } else {
    return `还剩 ${minutes}分`;
  }
};

const loadHomeworkList = async () => {
  try {
    const params = { ...searchForm.value, pageNum: pagination.value.pageNum, pageSize: pagination.value.pageSize };
    const response = await homeworkApi.getStudentHomeworkList(params);
    if (response.code === 1) {
      homeworkList.value = response.data || [];
      if (response.map) {
        pagination.value.total = response.map.total || 0;
        pagination.value.pages = response.map.pages || 1;
        pagination.value.pageSize = response.map.pageSize || 10;
        pagination.value.pageNum = response.map.pageNum || 1;
      }
    }
  } catch (error) {
    console.error('获取作业列表错误:', error);
  }
};

const handleCurrentChange = (current) => {
  pagination.value.pageNum = current;
  loadHomeworkList();
};

const submitHomework = (homeworkId) => {
  const homework = homeworkList.value.find(hw => hw.id === homeworkId);
  router.push({
    path: `/homework/student/detail/${homeworkId}`,
    query: {
      deadline: homework?.deadline || ''
    }
  });
};

onMounted(() => {
  loadHomeworkList();
});
</script>

<style scoped>
.page-container {
  background: linear-gradient(180deg, #f7f9fc 0%, #f0f4f8 100%);
  min-height: 100vh;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 24px;
}

.welcome-section {
  flex: 1;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #50C9C3, #45B8B2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 1rem;
  color: #888;
  margin: 0;
}

.stats-cards {
  display: flex;
  gap: 16px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a2e;
  line-height: 1;
}

.stat-label {
  font-size: 0.85rem;
  color: #999;
}

.filter-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  padding: 12px 16px;
  border-radius: 12px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.search-box:focus-within {
  border-color: #50C9C3;
  background: white;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  outline: none;
  color: #333;
}

.search-input::placeholder {
  color: #aaa;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-tab {
  padding: 10px 20px;
  border: none;
  background: #f8fafc;
  color: #666;
  border-radius: 10px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.filter-tab:hover {
  background: #e8f5f5;
  color: #50C9C3;
}

.filter-tab.active {
  background: linear-gradient(135deg, #50C9C3, #45B8B2);
  color: white;
  box-shadow: 0 4px 12px rgba(80, 201, 195, 0.3);
}

.homework-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.homework-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.homework-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
}

.homework-card.urgent {
  border: 2px solid #FF9800;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 4px 20px rgba(255, 152, 0, 0.1);
  }
  50% {
    box-shadow: 0 4px 30px rgba(255, 152, 0, 0.2);
  }
}

.card-header {
  padding: 16px 20px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.course-badge {
  display: flex;
  align-items: center;
  gap: 8px;
}

.course-name {
  background: linear-gradient(135deg, #f0f4f8, #e8f0f8);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #555;
}

.status-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-pending {
  background: #fff4e4;
  color: #FF9800;
}

.status-submitted {
  background: #e4f0ff;
  color: #4a90e2;
}

.status-completed {
  background: #e4ffe4;
  color: #4CAF50;
}

.status-corrected {
  background: #e6f7f6;
  color: #50C9C3;
}

.card-body {
  padding: 20px;
  flex: 1;
}

.homework-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 8px;
  line-height: 1.4;
}

.homework-content {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 16px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #888;
}

.meta-item .score {
  color: #50C9C3;
  font-weight: 600;
}

.meta-item .expired {
  color: #999;
}

.card-footer {
  padding: 16px 20px;
  background: #fafafa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.deadline-display {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
}

.deadline-label {
  color: #999;
}

.deadline-value {
  color: #666;
  font-weight: 500;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button.primary {
  background: linear-gradient(135deg, #50C9C3, #45B8B2);
  color: white;
  box-shadow: 0 4px 12px rgba(80, 201, 195, 0.3);
}

.action-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(80, 201, 195, 0.4);
}

.action-button.secondary {
  background: white;
  color: #666;
  border: 2px solid #eee;
}

.action-button.secondary:hover {
  border-color: #50C9C3;
  color: #50C9C3;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.empty-icon {
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 1.3rem;
  color: #333;
  margin: 0 0 8px;
}

.empty-state p {
  color: #999;
  margin: 0 0 24px;
}

.refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #50C9C3, #45B8B2);
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(80, 201, 195, 0.4);
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.pagination-info {
  color: #999;
  font-size: 0.9rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border: 2px solid #eee;
  border-radius: 10px;
  background: white;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: #50C9C3;
  color: #50C9C3;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-indicator {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

@media (max-width: 900px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .stats-cards {
    width: 100%;
  }
  
  .stat-card {
    flex: 1;
  }
  
  .homework-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .page-container {
    padding: 16px;
  }
  
  .stats-cards {
    flex-direction: column;
  }
  
  .stat-card {
    width: 100%;
  }
  
  .card-meta {
    flex-direction: column;
    gap: 8px;
  }
  
  .card-footer {
    flex-direction: column;
    align-items: stretch;
  }
  
  .action-button {
    justify-content: center;
  }
}
</style>
