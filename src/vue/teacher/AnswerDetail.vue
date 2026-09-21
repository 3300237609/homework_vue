<template>
  <div class="page-container">
    <div class="page-header">
      <button class="back-btn" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        返回
      </button>
      <h2 class="page-title">作答详情</h2>
    </div>

    <div v-if="detail" class="homework-info">
      <div class="info-row">
        <span class="info-label">作业标题：</span>
        <span class="info-value">{{ detail.homeworkTitle || '-' }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">学生姓名：</span>
        <span class="info-value">{{ detail.studentName || '-' }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">学号：</span>
        <span class="info-value">{{ detail.studentNumber || route.params.studentId }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">提交时间：</span>
        <span class="info-value">{{ detail.submitTime || '-' }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">得分：</span>
        <span class="info-value">
          <span class="score-value">{{ detail.totalScore }}</span>
          <span class="score-divider">/</span>
          <span class="score-full">{{ detail.fullScore }}</span>
        </span>
      </div>
    </div>

    <div v-if="detail && detail.questions && detail.questions.length > 0" class="questions-list">
      <div v-for="(question, index) in questions" :key="question.questionId" class="question-item">
        <div class="question-header">
          <span class="question-number">第 {{ index + 1 }} 题</span>
          <span class="question-type">{{ question.type }}</span>
          <span class="question-score">分值：{{ question.fullScore }} 分</span>
          <span class="question-student-score">得分：<span class="score-num" :class="{ zero: !question.studentScore }">{{ question.studentScore ?? 0 }}</span></span>
        </div>

        <div class="question-content">
          <p>{{ question.title }}</p>
        </div>

          <div v-if="question.options" class="options">
          <div
            v-for="(option, key) in parseOptions(question.options)"
            :key="key"
            class="option"
            :class="{
              'is-correct': question.correctAnswer === key,
              'is-wrong': question.studentAnswer === key && question.correctAnswer !== key && question.type !== '简答'
            }"
          >
            <span class="option-key">{{ key }}</span>
            <span class="option-value">{{ option }}</span>
          </div>
        </div>

        <div class="answer-section">
          <div class="answer-row">
            <span class="answer-label">学生答案：</span>
            <span :class="['answer-content', 'student', { wrong: question.correctAnswer && question.studentAnswer !== question.correctAnswer }]">{{ question.studentAnswer || '未作答' }}</span>
          </div>
          <div v-if="question.correctAnswer" class="answer-row">
            <span class="answer-label">正确答案：</span>
            <span class="answer-content correct">{{ question.correctAnswer }}</span>
          </div>
        </div>

        <div v-if="question.comment" class="comment-section">
          <div class="comment-label">批改评语：</div>
          <div class="comment-text">{{ question.comment }}</div>
        </div>
      </div>
    </div>

    <div v-if="loaded && (!detail || !detail.questions || detail.questions.length === 0)" class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
      </svg>
      <p>暂无题目数据</p>
    </div>

    <div v-if="!loaded" class="empty-state">
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
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { homeworkApi } from '../../api/api';

const route = useRoute();
const router = useRouter();

const detail = ref(null);
const loaded = ref(false);

const questions = computed(() => detail.value?.questions || []);

const parseOptions = (options) => {
  if (!options) return {};
  try {
    return JSON.parse(options);
  } catch {
    return {};
  }
};

const goBack = () => {
  router.push(`/teacher/detail/${route.params.homeworkId}`);
};

const loadDetail = async () => {
  const homeworkId = route.params.homeworkId;
  const studentId = route.params.studentId;
  try {
    const response = await homeworkApi.queryStudentAnswerDetail({ homeworkId, studentId });
    if (response.code === 1) {
      detail.value = response.data;
    } else {
      alert(response.msg || '获取作答详情失败');
    }
  } catch (error) {
    console.error('获取作答详情失败:', error);
    alert('网络错误');
  } finally {
    loaded.value = true;
  }
};

onMounted(() => {
  loadDetail();
});
</script>

<style scoped>
.page-container {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  text-align: left;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
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
  font-size: 1.5rem;
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
}

.info-value {
  flex: 1;
  color: #333;
  display: flex;
  align-items: center;
  gap: 4px;
}

.score-value {
  font-weight: 700;
  color: #50C9C3;
  font-size: 1.1rem;
}

.score-divider {
  color: #999;
  margin: 0 2px;
}

.score-full {
  color: #666;
}

.questions-list {
  margin-bottom: 24px;
}

.question-item {
  background-color: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}

.question-item:last-child {
  margin-bottom: 0;
}

.question-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.question-number {
  font-weight: 600;
  color: #333;
}

.question-type {
  padding: 4px 10px;
  background-color: #e0f2fe;
  color: #0284c7;
  border-radius: 6px;
  font-size: 0.85rem;
}

.question-score {
  font-size: 0.9rem;
  color: #666;
}

.question-student-score {
  margin-left: auto;
  font-size: 0.9rem;
  color: #333;
}

.question-student-score .score-num {
  font-weight: 700;
  color: #50C9C3;
  font-size: 1.05rem;
}

.question-student-score .score-num.zero {
  color: #ff6b6b;
}

.question-content {
  margin-bottom: 16px;
}

.question-content p {
  margin: 0;
  line-height: 1.6;
  color: #333;
}

.options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background-color: #fff;
  border-radius: 8px;
  border: 2px solid transparent;
}

.option.is-correct {
  border-color: #16a34a;
  background-color: #f0fdf4;
}

.option.is-wrong {
  border-color: #e53935;
  background-color: #fef2f2;
}

.option-key {
  font-weight: 600;
  color: #50C9C3;
  min-width: 24px;
}

.option.is-wrong .option-key {
  color: #e53935;
}

.option.is-correct .option-key {
  color: #16a34a;
}

.option-value {
  color: #333;
}

.answer-section {
  background-color: #fff;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 12px;
}

.answer-row {
  display: flex;
  margin-bottom: 10px;
}

.answer-row:last-child {
  margin-bottom: 0;
}

.answer-label {
  flex: 0 0 100px;
  font-weight: 600;
  color: #666;
}

.answer-content {
  flex: 1;
  font-weight: 500;
  white-space: pre-wrap;
  word-break: break-all;
}

.answer-content.student {
  color: #333;
}

.answer-content.student.wrong {
  color: #e53935;
  font-weight: 600;
}

.answer-content.correct {
  color: #16a34a;
}

.comment-section {
  padding-top: 12px;
  border-top: 1px dashed #e0e0e0;
}

.comment-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
  margin-bottom: 8px;
}

.comment-text {
  background-color: #fffbe6;
  border-radius: 8px;
  padding: 12px;
  color: #856404;
  line-height: 1.6;
  font-size: 0.9rem;
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
</style>
