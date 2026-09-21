<template>
  <div class="page-container">
    <div class="page-header">
      <button class="back-btn" @click="goBack">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        返回
      </button>
      <h2 class="page-title">作业详情</h2>
    </div>

    <div v-if="homework" class="homework-info">
      <div class="info-row">
        <span class="info-label">作业ID：</span>
        <span class="info-value">{{ homework.homeworkId }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">作业标题：</span>
        <span class="info-value">{{ homework.homeworkTitle }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">总分：</span>
        <span class="info-value">{{ homework.totalScore }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">提交情况：</span>
        <span class="info-value">
          <span class="stat-tag submitted">{{ submittedCount }} 已提交</span>
          <span class="stat-tag unsubmitted">{{ unsubmittedCount }} 未提交</span>
        </span>
      </div>
    </div>

    <div v-if="homework" class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>学生ID</th>
            <th>学生姓名</th>
            <th>提交状态</th>
            <th>得分</th>
            <th>提交时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in homework.studentList" :key="student.studentId">
            <td>{{ student.studentId }}</td>
            <td>{{ student.studentName }}</td>
            <td>
              <span class="status-tag" :class="student.isSubmit ? 'submitted' : 'unsubmitted'">
                {{ student.submitStatus }}
              </span>
            </td>
            <td>
              <span :class="['score-cell', { zero: student.totalScore === 0 }]">
                {{ student.totalScore }}
              </span>
            </td>
            <td>{{ student.submitTime || '-' }}</td>
            <td>
              <button
                class="action-btn view-answer"
                :class="{ disabled: !student.isSubmit }"
                :disabled="!student.isSubmit"
                @click="viewAnswer(student)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                作答详情
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="homework && (!aiReport || reportCollapsed)" class="action-bar">
      <button class="ai-btn" :class="{ loading: analyzing }" @click="aiReport ? (reportCollapsed = false) : analyzeHomework()">
        <svg v-if="!analyzing" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>
        <svg v-else class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-dasharray="30 60"></circle>
        </svg>
        {{ analyzing ? 'AI 分析中，可能需要十几秒...' : (aiReport ? '📄 展开报告' : '🤖 AI 分析') }}
      </button>
    </div>

    <div v-if="analyzing || (aiReport && !reportCollapsed)" class="ai-section">
      <div v-if="analyzing" class="ai-loading">
        <svg class="spinner large" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#50C9C3" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-dasharray="30 60"></circle>
        </svg>
        <p>AI 正在分析，请耐心等待（约 10~30 秒）...</p>
        <p class="ai-hint">模型需要多轮调用工具查询数据库，可能需要较长时间</p>
      </div>
      <div v-else class="ai-report-wrap">
        <div class="ai-report-header">
          <div class="ai-report-title-area">
            <span class="ai-report-title">🤖 AI 作业分析报告</span>
            <span v-if="reportUpdateTime" class="ai-report-time">{{ relativeTime }}</span>
          </div>
          <div class="ai-report-actions">
            <button class="ai-btn small" :class="{ loading: analyzing }" @click="analyzeHomework">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M23 4v6h-6"></path>
                <path d="M1 20v-6h6"></path>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
              重新分析
            </button>
            <button class="collapse-btn" @click="reportCollapsed = true">收起</button>
          </div>
        </div>
        <div class="ai-report markdown-body" v-html="renderedReport"></div>
      </div>
    </div>

    <div v-if="!homework" class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p>加载中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { marked } from 'marked';
import { homeworkApi } from '../../api/api';

const route = useRoute();
const router = useRouter();

const homework = ref(null);
const analyzing = ref(false);
const aiReport = ref('');
const reportUpdateTime = ref('');
const reportCollapsed = ref(false);
const timeTick = ref(0);
let timeTimer = null;

const renderedReport = computed(() => {
  if (!aiReport.value) return '';
  return marked.parse(aiReport.value);
});

const parseTime = (str) => {
  if (!str) return null;
  // 兼容 ISO 格式（含 T）和普通格式
  const normalized = str.replace(/-/g, '/').replace('T', ' ');
  const d = new Date(normalized);
  return isNaN(d.getTime()) ? null : d;
};

const relativeTime = computed(() => {
  void timeTick.value;
  if (!reportUpdateTime.value) return '';
  const target = parseTime(reportUpdateTime.value);
  if (!target) return reportUpdateTime.value;
  const diff = Date.now() - target.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (minutes < 1) return '刚刚';
  if (minutes < 10) return '1分钟前';
  if (minutes < 30) return '10分钟前';
  if (minutes < 60) return '30分钟前';
  if (hours < 1) return '30分钟前';
  if (isToday(target)) return `1小时前 · 今天 ${formatTime(target)}`;
  return `${formatDate(target)} 更新`;
});

const isToday = (d) => {
  const now = new Date();
  return d.getFullYear() === now.getFullYear()
    && d.getMonth() === now.getMonth()
    && d.getDate() === now.getDate();
};

const formatTime = (d) => {
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const formatDate = (d) => {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const submittedCount = computed(() => {
  if (!homework.value) return 0;
  return homework.value.studentList.filter(s => s.isSubmit).length;
});

const unsubmittedCount = computed(() => {
  if (!homework.value) return 0;
  return homework.value.studentList.filter(s => !s.isSubmit).length;
});

const goBack = () => {
  router.push('/teacher/homework');
};

const viewAnswer = (student) => {
  router.push(`/teacher/answer-detail/${homework.value.homeworkId}/${student.studentId}`);
};

const analyzeHomework = async () => {
  if (!homework.value) return;
  analyzing.value = true;
  aiReport.value = '';
  reportUpdateTime.value = '';
  reportCollapsed.value = false;
  try {
    const response = await homeworkApi.analyze(homework.value.homeworkId);
    if (response.code === 1) {
      aiReport.value = response.data?.report || response.data || '';
      reportUpdateTime.value = response.data?.updateTime || formatNow();
    } else {
      ElMessage.error(response.msg || 'AI 分析失败');
    }
  } catch (error) {
    console.error('AI 分析失败:', error);
    ElMessage.error('网络错误，请重试');
  } finally {
    analyzing.value = false;
  }
};

const loadReport = async () => {
  if (!homework.value) return;
  try {
    const response = await homeworkApi.queryHomeworkReport(homework.value.homeworkId);
    if (response.code === 1 && response.data) {
      aiReport.value = response.data.report || response.data.content || response.data || '';
      reportUpdateTime.value = response.data.updateTime || response.data.createTime || '';
    }
  } catch (error) {
    console.error('查询历史报告失败:', error);
  }
};

const formatNow = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const loadDetail = async () => {
  const homeworkId = route.params.id;
  try {
    const response = await homeworkApi.queryStudentAnswer(homeworkId);
    if (response.code === 1) {
      homework.value = response.data;
    } else {
      alert(response.msg || '获取作业详情失败');
    }
  } catch (error) {
    console.error('获取作业详情失败:', error);
    alert('网络错误');
  }
};

onMounted(async () => {
  await loadDetail();
  loadReport();
  timeTimer = setInterval(() => {
    timeTick.value++;
  }, 30000);
});

onUnmounted(() => {
  if (timeTimer) {
    clearInterval(timeTimer);
    timeTimer = null;
  }
});
</script>

<style scoped>
.page-container {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 0 24px 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  margin: 0 -24px 24px;
  padding: 16px 24px;
  border-radius: 16px 16px 0 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
}

/* 向上延伸覆盖滚动容器顶部 24px 内边距，消除吸顶后上方缝隙（宽度与卡片一致） */
.page-header::before {
  content: '';
  position: absolute;
  top: -24px;
  left: 0;
  right: 0;
  height: 24px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  background-color: #f8fafc;
  border: none;
  border-radius: 10px;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background-color: #e8f4f3;
  color: #50C9C3;
}

.page-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #1a1a2e;
}

.homework-info {
  background-color: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  flex: 0 0 110px;
  font-weight: 600;
  color: #666;
  text-align: left;
}

.info-value {
  flex: 1;
  color: #333;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-tag {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.stat-tag.submitted {
  background-color: #d4edda;
  color: #155724;
}

.stat-tag.unsubmitted {
  background-color: #f8d7da;
  color: #721c24;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
  border-radius: 12px;
  border: 1px solid #eee;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 14px 16px;
  text-align: left;
  font-size: 0.9rem;
  white-space: nowrap;
}

.data-table th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #666;
  border-bottom: 2px solid #eee;
}

.data-table td {
  color: #333;
  border-bottom: 1px solid #f0f0f0;
}

.data-table tr:hover {
  background-color: #f8fafc;
}

.status-tag {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-tag.submitted {
  background-color: #d4edda;
  color: #155724;
}

.status-tag.unsubmitted {
  background-color: #f8d7da;
  color: #721c24;
}

.score-cell {
  font-weight: 600;
  color: #333;
}

.score-cell.zero {
  color: #ff6b6b;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: #999;
}

.empty-state svg {
  margin-bottom: 16px;
}

.empty-state p {
  margin: 0;
  font-size: 1rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn.view-answer {
  background-color: #e4f0ff;
  color: #4a90e2;
}

.action-btn.view-answer:hover:not(.disabled) {
  background-color: #4a90e2;
  color: white;
}

.action-btn.view-answer.disabled {
  background-color: #f0f0f0;
  color: #bbb;
  cursor: not-allowed;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  padding: 24px 0 8px;
}

.ai-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: linear-gradient(135deg, #50C9C3 0%, #36D1DC 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(80, 201, 195, 0.4);
}

.ai-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(80, 201, 195, 0.5);
}

.ai-btn:active {
  transform: translateY(0);
}

.ai-btn.loading {
  pointer-events: none;
  opacity: 0.8;
}

.spinner {
  animation: spin 1s linear infinite;
}

.spinner.large {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.ai-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 12px;
  color: #50C9C3;
  font-size: 0.95rem;
}

.ai-loading .ai-hint {
  font-size: 0.82rem;
  color: #999;
  margin: 0;
}

.ai-section {
  margin-top: 16px;
  background-color: #f8fafc;
  border-radius: 12px;
  border: 1px solid #eee;
  overflow: hidden;
  text-align: left;
}

.ai-report-wrap {
  padding: 20px 24px;
}

.ai-report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
  flex-wrap: wrap;
  gap: 12px;
}

.ai-report-title-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-report-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: #1a1a2e;
}

.ai-report-time {
  font-size: 0.85rem;
  color: #999;
}

.ai-report-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.ai-btn.small {
  padding: 6px 14px;
  font-size: 0.85rem;
  border-radius: 8px;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(80, 201, 195, 0.3);
}

.collapse-btn {
  padding: 6px 16px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  color: #666;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.collapse-btn:hover {
  background-color: #f0f0f0;
  color: #50C9C3;
  border-color: #50C9C3;
}

.ai-report {
  max-height: none;
  padding: 0;
}

.close-btn {
  display: none;
}

/* Markdown 渲染样式 */
.markdown-body {
  line-height: 1.8;
  color: #333;
  font-size: 0.95rem;
  text-align: left;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3 {
  margin: 24px 0 12px;
  font-weight: 600;
  color: #1a1a2e;
}

.markdown-body h1 { font-size: 1.5rem; }
.markdown-body h2 { font-size: 1.25rem; }
.markdown-body h3 { font-size: 1.1rem; }

.markdown-body p {
  margin: 10px 0;
}

.markdown-body ul,
.markdown-body ol {
  margin: 10px 0;
  padding-left: 24px;
}

.markdown-body li {
  margin: 4px 0;
}

.markdown-body strong {
  color: #50C9C3;
  font-weight: 600;
}

.markdown-body hr {
  border: none;
  border-top: 1px dashed #ddd;
  margin: 20px 0;
}

.markdown-body blockquote {
  border-left: 4px solid #50C9C3;
  background-color: #f0fdfb;
  margin: 12px 0;
  padding: 12px 16px;
  border-radius: 4px;
  color: #555;
}

.markdown-body code {
  background-color: #f4f4f4;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Consolas', monospace;
  font-size: 0.9em;
}
</style>
