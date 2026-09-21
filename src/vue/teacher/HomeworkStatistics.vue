<template>
  <div class="homework-stats">
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-label">总作业数</div>
          <div class="stat-value">{{ stats.totalHomework }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-label">学生总数</div>
          <div class="stat-value">{{ stats.totalStudent }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-label">提交率</div>
          <div class="stat-value">{{ stats.submitRate }}%</div>
        </div>
        <div class="stat-ring" v-if="stats.submitRate !== null">
          <svg viewBox="0 0 100 100" class="ring-svg">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#e8e8e8" stroke-width="8"></circle>
            <circle 
              cx="50" cy="50" r="45" fill="none" stroke="#50C9C3" stroke-width="8" 
              stroke-linecap="round" 
              :stroke-dasharray="getRingDashArray(stats.submitRate) + ' 282.7'"
            ></circle>
            <line x1="50" y1="12" x2="50" y2="22" stroke="#50C9C3" stroke-width="2"></line>
            <text x="50" y="80" text-anchor="middle" fill="#666" font-size="14">{{ stats.submitRate }}%</text>
          </svg>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-label">平均分</div>
          <div class="stat-value">{{ stats.avgScore !== null ? stats.avgScore : '-' }}</div>
        </div>
        <div class="stat-ring" v-if="stats.avgScore !== null">
          <svg viewBox="0 0 100 100" class="ring-svg">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#e8e8e8" stroke-width="8"></circle>
            <circle 
              cx="50" cy="50" r="45" fill="none" stroke="#4facfe" stroke-width="8" 
              stroke-linecap="round" 
              :stroke-dasharray="getRingDashArray(stats.avgScore) + ' 282.7'"
            ></circle>
            <line x1="50" y1="12" x2="50" y2="22" stroke="#4facfe" stroke-width="2"></line>
            <text x="50" y="80" text-anchor="middle" fill="#666" font-size="14">{{ stats.avgScore }}</text>
          </svg>
        </div>
      </div>
    </div>

    <div class="charts-section">
      <div class="chart-card">
        <div class="chart-title-container">
          <h3 class="chart-title">作业提交情况</h3>
          <span class="chart-hint">仅统计最近五次作业</span>
        </div>
        <div class="chart-container">
          <div class="chart-placeholder">
            <svg width="100%" height="350" viewBox="0 0 400 350">
              <defs>
                <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#50C9C3" stop-opacity="0.8"></stop>
                  <stop offset="100%" stop-color="#50C9C3" stop-opacity="0.3"></stop>
                </linearGradient>
              </defs>
              <text x="20" y="30" fill="#666" font-size="12">学生数</text>
              <line x1="50" y1="35" x2="50" y2="310" stroke="#e0e0e0" stroke-width="1"></line>
              <line x1="50" y1="310" x2="380" y2="310" stroke="#e0e0e0" stroke-width="1"></line>
              <text x="45" y="50" fill="#999" font-size="11" text-anchor="end">10</text>
              <text x="45" y="100" fill="#999" font-size="11" text-anchor="end">8</text>
              <text x="45" y="150" fill="#999" font-size="11" text-anchor="end">6</text>
              <text x="45" y="200" fill="#999" font-size="11" text-anchor="end">4</text>
              <text x="45" y="250" fill="#999" font-size="11" text-anchor="end">2</text>
              <text x="45" y="310" fill="#999" font-size="11" text-anchor="end">0</text>
              
              <g v-for="(item, index) in validBarList" :key="index">
                <rect 
                  :x="70 + index * 80" 
                  :y="310 - getBarHeightLarge(item.submitNum)" 
                  width="55" 
                  :height="getBarHeightLarge(item.submitNum) || 3" 
                  rx="4" 
                  fill="url(#barGradient)"
                ></rect>
                <text 
                  :x="97 + index * 80" 
                  y="335" 
                  fill="#666" 
                  font-size="12" 
                  text-anchor="middle"
                >{{ truncateText(item.homeworkName, 6) }}</text>
                <text 
                  :x="97 + index * 80" 
                  :y="310 - Math.max(getBarHeightLarge(item.submitNum), 8) - 10" 
                  fill="#50C9C3" 
                  font-size="12" 
                  font-weight="600" 
                  text-anchor="middle"
                >{{ item.submitNum }}</text>
              </g>
            </svg>
          </div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-title-container">
          <h3 class="chart-title">成绩分布</h3>
          <span class="chart-hint">仅统计最近五次作业</span>
        </div>
        <div class="chart-container">
          <div class="chart-placeholder">
            <svg width="100%" height="350" viewBox="0 0 400 350">
              <text x="20" y="30" fill="#666" font-size="12">分数</text>
              <line x1="50" y1="35" x2="50" y2="310" stroke="#e0e0e0" stroke-width="1"></line>
              <line x1="50" y1="310" x2="380" y2="310" stroke="#e0e0e0" stroke-width="1"></line>
              <text x="45" y="50" fill="#999" font-size="11" text-anchor="end">10</text>
              <text x="45" y="100" fill="#999" font-size="11" text-anchor="end">8</text>
              <text x="45" y="150" fill="#999" font-size="11" text-anchor="end">6</text>
              <text x="45" y="200" fill="#999" font-size="11" text-anchor="end">4</text>
              <text x="45" y="250" fill="#999" font-size="11" text-anchor="end">2</text>
              <text x="45" y="310" fill="#999" font-size="11" text-anchor="end">0</text>
              
              <polyline 
                v-if="getLinePointsLarge()"
                :points="getLinePointsLarge()" 
                fill="none" 
                stroke="#4facfe" 
                stroke-width="4"
              ></polyline>
              
              <g v-for="(item, index) in validLineList" :key="index">
                <circle 
                  :cx="70 + index * 80" 
                  :cy="310 - getBarHeightLarge(item.avgScore)" 
                  r="7" 
                  fill="#4facfe"
                ></circle>
                <text 
                  :x="70 + index * 80" 
                  y="335" 
                  fill="#666" 
                  font-size="12" 
                  text-anchor="middle"
                >{{ truncateText(item.homeworkName, 6) }}</text>
                <text 
                  :x="70 + index * 80" 
                  :y="310 - Math.max(getBarHeightLarge(item.avgScore), 8) - 10" 
                  fill="#4facfe" 
                  font-size="12" 
                  font-weight="600" 
                  text-anchor="middle"
                >{{ item.avgScore }}</text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="recent-homework">
      <h3 class="section-title">最近作业</h3>
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>作业标题</th>
              <th>班级</th>
              <th>科目</th>
              <th>截止时间</th>
              <th>提交人数</th>
              <th>平均分</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="homework in recentHomeworkList" :key="homework.title">
              <td>{{ homework.title }}</td>
              <td>{{ homework.className }}</td>
              <td>{{ homework.subject }}</td>
              <td>{{ homework.deadline }}</td>
              <td><span class="submission-count">{{ homework.submitInfo }}</span></td>
              <td><span class="score">{{ homework.avgScore !== null ? homework.avgScore : '-' }}</span></td>
              <td>
                <span :class="['status-badge', getStatusClass(homework.status)]">
                  {{ homework.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { homeworkApi } from '../../api/api';

const stats = ref({
  totalHomework: 0,
  totalStudent: 0,
  submitRate: 0,
  avgScore: 0
});

const barList = ref([]);
const lineList = ref([]);
const recentHomeworkList = ref([]);

const validBarList = computed(() => {
  return barList.value.filter(item => item);
});

const validLineList = computed(() => {
  return lineList.value.filter(item => item && item.avgScore !== null);
});

const getRingDashArray = (value) => {
  if (value === null || value === undefined) {
    return 0;
  }
  return (value / 100) * 251.2;
};

const getBarHeight = (value) => {
  if (value === null || value === undefined) {
    return 0;
  }
  const maxValue = 10;
  const maxHeight = 160;
  return Math.min((value / maxValue) * maxHeight, maxHeight);
};

const getBarHeightLarge = (value) => {
  if (value === null || value === undefined) {
    return 0;
  }
  const maxValue = 10;
  const maxHeight = 260;
  return Math.min((value / maxValue) * maxHeight, maxHeight);
};

const getLinePoints = () => {
  if (!validLineList.value || validLineList.value.length === 0) {
    return '';
  }
  const points = validLineList.value
    .map((item, index) => {
      const x = 70 + index * 80;
      const y = 210 - getBarHeight(item.avgScore);
      return `${x},${y}`;
    })
    .join(' ');
  return points;
};

const getLinePointsLarge = () => {
  if (!validLineList.value || validLineList.value.length === 0) {
    return '';
  }
  const points = validLineList.value
    .map((item, index) => {
      const x = 70 + index * 80;
      const y = 310 - getBarHeightLarge(item.avgScore);
      return `${x},${y}`;
    })
    .join(' ');
  return points;
};

const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const getStatusClass = (status) => {
  const statusMap = {
    '已结束': 'completed',
    '进行中': 'in-progress',
    '已批改': 'completed'
  };
  return statusMap[status] || 'in-progress';
};

const loadStats = async () => {
  try {
    const res = await homeworkApi.getDashboard();
    if (res.code === 1 && res.data) {
      const data = res.data;
      stats.value = {
        totalHomework: data.totalHomework || 0,
        totalStudent: data.totalStudent || 0,
        submitRate: data.submitRate !== null ? data.submitRate : 0,
        avgScore: data.avgScore !== null ? data.avgScore : null
      };
      
      barList.value = data.barList || [];
      lineList.value = data.lineList || [];
      recentHomeworkList.value = data.recentHomeworkList || [];
    }
  } catch (error) {
    console.error('加载统计数据失败:', error);
  }
};

onMounted(() => {
  loadStats();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.homework-stats {
  width: 100%;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.stat-content {
  flex: 1;
}

.stat-ring {
  width: 100px;
  height: 100px;
}

.ring-svg {
  width: 100%;
  height: 100%;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a2e;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.9rem;
  color: #999;
  margin-top: 4px;
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 30px;
}

.chart-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.chart-title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0;
}

.chart-hint {
  font-size: 0.85rem;
  color: #999;
  background: #f5f5f5;
  padding: 4px 12px;
  border-radius: 12px;
}

.chart-container {
  width: 100%;
}

.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.recent-homework {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 20px;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 14px 16px;
  text-align: left;
}

.data-table th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
  border-bottom: 2px solid #f0f0f0;
}

.data-table td {
  border-bottom: 1px solid #f5f5f5;
  color: #555;
  font-size: 0.9rem;
}

.data-table tbody tr:hover {
  background-color: #fafafa;
}

.submission-count {
  color: #50C9C3;
  font-weight: 600;
}

.score {
  color: #667eea;
  font-weight: 600;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.in-progress {
  background-color: #e3f2fd;
  color: #1976d2;
}

.status-badge.completed {
  background-color: #e8f5e9;
  color: #388e3c;
}

@media (max-width: 1200px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .data-table th,
  .data-table td {
    padding: 10px 12px;
    font-size: 0.85rem;
  }
}
</style>
