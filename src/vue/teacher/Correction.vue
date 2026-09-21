<template>
  <div class="page-container">
    <div class="page-header">
      <button class="back-btn" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        返回
      </button>
      <h2 class="page-title">批改作业</h2>
      <div class="header-right">
        <label class="switch-container">
          <span class="switch-label">检查0分</span>
          <label class="switch">
            <input type="checkbox" v-model="checkZeroScore" />
            <span class="slider round"></span>
          </label>
        </label>
      </div>
    </div>

    <div v-if="homework" class="homework-info">
      <div class="info-row">
        <span class="info-label">作业标题:</span>
        <span class="info-value">{{ homework.homeworkTitle }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">作业要求:</span>
        <span class="info-value">{{ homework.homeworkContent }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">课程:</span>
        <span class="info-value">{{ homework.courseName }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">班级:</span>
        <span class="info-value">{{ homework.clazzName }}</span>
      </div>
    </div>

    <div class="student-list">
      <div class="list-header">
        <span>待批改学生列表</span>
        <span class="count">共 {{ studentList.length }} 人待批改</span>
      </div>
      <div class="student-items">
        <div
          v-for="student in studentList"
          :key="student.studentId"
          class="student-item"
          :class="{ active: currentStudent?.studentId === student.studentId }"
          @click="selectStudent(student)"
        >
          <div class="student-info">
            <span class="student-name">{{ student.studentName }}</span>
            <span class="student-id">学号: {{ student.studentId }}</span>
          </div>
          <div class="student-status">
            <span class="status submitted">待批改</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="currentStudent" class="correction-area">
      <div class="correction-header">
        <h3>批改: {{ currentStudent.studentName }}</h3>
        <div class="score-info">
          <span>总分:</span>
          <span class="total-score">{{ computedTotalScore }}</span>
          <span>/ {{ totalFullScore }}</span>
        </div>
      </div>

      <div class="questions-list">
        <div v-for="(question, index) in currentStudent.questions" :key="question.questionId" class="question-item">
          <div class="question-header">
            <span class="question-number">第 {{ index + 1 }} 题</span>
            <span class="question-type">{{ question.type }}</span>
            <span class="question-score">分值: {{ question.fullScore }}分</span>
            <div class="score-input-wrapper">
              <input
                type="number"
                v-model.number="question.studentScore"
                class="mini-score-input"
                :max="question.fullScore"
                :min="0"
                @input="validateScore(question)"
                placeholder="得分"
              />
              <span class="score-range">/ {{ question.fullScore }}</span>
            </div>
          </div>
          <div class="question-content">
            <p>{{ question.title }}</p>
          </div>
          <div v-if="question.options" class="options">
            <div v-for="(option, key) in parseOptions(question.options)" :key="key" class="option">
              <span class="option-key">{{ key }}</span>
              <span class="option-value">{{ option }}</span>
            </div>
          </div>
          <div class="answer-section">
            <div class="answer-row">
              <span class="answer-label">学生答案:</span>
              <span class="answer-content student">{{ question.studentAnswer || '未作答' }}</span>
            </div>
            <div v-if="question.correctAnswer" class="answer-row">
              <span class="answer-label">正确答案:</span>
              <span class="answer-content correct">{{ question.correctAnswer }}</span>
            </div>
          </div>
          <div class="comment-toggle-wrapper">
            <button 
              type="button"
              class="comment-toggle-btn"
              @click="toggleComment(question)"
            >
              <svg 
                v-if="!question.showComment" 
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <svg 
                v-else 
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              {{ question.showComment ? '收起评语' : (question.comment ? '编辑评语' : '添加评语') }}
            </button>
          </div>
          <div v-if="question.showComment" class="comment-section">
            <div class="comment-label">批改评语：</div>
            <textarea
              v-model="question.comment"
              class="comment-input"
              placeholder="请输入批改评语（可选）"
              rows="2"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="correction-footer">
        <button class="btn btn-secondary" @click="clearSelection">取消</button>
        <button class="btn btn-primary" @click="submitCorrection">提交批改</button>
      </div>
    </div>

    <div v-if="!currentStudent && homework" class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
      <p>请从左侧选择一个学生开始批改</p>
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
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { homeworkApi } from '../../api/api';

const route = useRoute();
const router = useRouter();

const homework = ref(null);
const studentList = ref([]);
const currentStudent = ref(null);
const totalFullScore = ref(0);
const checkZeroScore = ref(true);

const homeworkId = computed(() => route.params.id);

const computedTotalScore = computed(() => {
  if (!currentStudent.value) return 0;
  return currentStudent.value.questions.reduce((sum, q) => sum + (q.studentScore || 0), 0);
});

const goBack = () => {
  router.push('/teacher/homework');
};

const parseOptions = (options) => {
  if (!options) return {};
  try {
    return JSON.parse(options);
  } catch {
    return {};
  }
};

const validateScore = (question) => {
  if (question.studentScore > question.fullScore) {
    question.studentScore = question.fullScore;
  }
  if (question.studentScore < 0 || isNaN(question.studentScore)) {
    question.studentScore = 0;
  }
};

const toggleComment = (question) => {
  question.showComment = !question.showComment;
};

const loadCorrectionData = async () => {
  try {
    const response = await homeworkApi.getStudentListForCorrection(homeworkId.value);
    if (response.code === 1) {
      const data = response.data;
      homework.value = {
        homeworkId: data.homeworkId,
        homeworkTitle: data.homeworkTitle,
        homeworkContent: data.homeworkContent,
        courseName: data.courseName,
        clazzName: data.clazzName
      };
      
      // 为每个题目添加 showComment 状态
      studentList.value = (data.studentList || []).map(student => ({
        ...student,
        questions: (student.questions || []).map(q => ({
          ...q,
          showComment: false, // 默认隐藏评语
          comment: q.comment || ''
        }))
      }));

      if (studentList.value.length > 0) {
        totalFullScore.value = studentList.value[0].questions.reduce((sum, q) => sum + (q.fullScore || 0), 0);
      }
    }
  } catch (error) {
    console.error('获取批改数据失败:', error);
    alert('网络错误');
  }
};

const selectStudent = (student) => {
  currentStudent.value = student;
};

const clearSelection = () => {
  currentStudent.value = null;
};

const submitCorrection = async () => {
  if (!currentStudent.value) {
    alert('请选择要批改的学生');
    return;
  }

  const corrections = currentStudent.value.questions.map(q => ({
    questionId: q.questionId,
    score: parseInt(q.studentScore) || 0,
    comment: q.comment || ''
  }));

  if (checkZeroScore.value) {
    const zeroScoreCount = corrections.filter(c => c.score === 0).length;
    if (zeroScoreCount > 1) {
      const confirmSubmit = confirm(`检测到有 ${zeroScoreCount} 道题目得分为0分，确定要提交批改吗？`);
      if (!confirmSubmit) {
        return;
      }
    }
  }

  try {
    const response = await homeworkApi.submitCorrection({
      homeworkId: homeworkId.value,
      submitId: currentStudent.value.submitId,
      totalScore: computedTotalScore.value,
      corrections: corrections
    });

    if (response.code === 1) {
      alert('批改成功');
      const index = studentList.value.findIndex(s => s.studentId === currentStudent.value.studentId);
      if (index > -1) {
        studentList.value.splice(index, 1);
      }
      clearSelection();

      if (studentList.value.length === 0) {
        alert('所有作业已批改完成');
        goBack();
      }
    } else {
      alert(response.msg || '批改失败');
    }
  } catch (error) {
    console.error('提交批改失败:', error);
    alert('网络错误');
  }
};

onMounted(() => {
  loadCorrectionData();
});
</script>

<style scoped>
.page-container {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.header-right {
  display: flex;
  align-items: center;
}

.switch-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.switch-label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
}

.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input:checked + .slider {
  background-color: #50C9C3;
}

input:checked + .slider:before {
  transform: translateX(20px);
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
  width: 100%;
  box-sizing: border-box;
}

.info-row {
  display: flex;
  margin-bottom: 12px;
  justify-content: flex-start;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  flex: 0 0 100px;
  font-weight: 600;
  color: #666;
  text-align: left;
}

.info-value {
  flex: 1;
  color: #333;
  text-align: left;
}

.student-list {
  background-color: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-weight: 600;
  color: #333;
}

.count {
  font-weight: normal;
  color: #50C9C3;
}

.student-items {
  max-height: 300px;
  overflow-y: auto;
}

.student-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.student-item:hover {
  background-color: #f0fdf9;
}

.student-item.active {
  border-color: #50C9C3;
  background-color: #f0fdf9;
}

.student-item:last-child {
  margin-bottom: 0;
}

.student-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.student-name {
  font-weight: 600;
  color: #333;
}

.student-id {
  font-size: 0.85rem;
  color: #999;
}

.status {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status.submitted {
  background-color: #fff3cd;
  color: #856404;
}

.correction-area {
  background-color: #f8fafc;
  border-radius: 12px;
  padding: 20px;
}

.correction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.correction-header h3 {
  font-size: 1.2rem;
  color: #333;
}

.score-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.total-score {
  color: #50C9C3;
  min-width: 40px;
  text-align: center;
  font-size: 1.3rem;
}

.questions-list {
  margin-bottom: 24px;
}

.question-item {
  background-color: #fff;
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

.score-input-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
}

.mini-score-input {
  width: 60px;
  padding: 6px 10px;
  border: 2px solid #50C9C3;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  text-align: center;
  color: #50C9C3;
}

.mini-score-input:focus {
  outline: none;
  border-color: #45B8B2;
  box-shadow: 0 0 0 3px rgba(80, 201, 195, 0.2);
}

.score-range {
  font-size: 0.85rem;
  color: #999;
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
  background-color: #f8fafc;
  border-radius: 8px;
}

.option-key {
  font-weight: 600;
  color: #50C9C3;
  min-width: 24px;
}

.option-value {
  color: #333;
}

.answer-section {
  background-color: #f8fafc;
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
}

.answer-content.student {
  color: #333;
}

.answer-content.correct {
  color: #16a34a;
}

.comment-toggle-wrapper {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 12px;
}

.comment-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background-color: #f0fdf9;
  border: 1px solid #a7f3d0;
  border-radius: 8px;
  color: #50C9C3;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.comment-toggle-btn:hover {
  background-color: #ccfbf1;
  border-color: #50C9C3;
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

.comment-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 0.9rem;
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box;
}

.comment-input:focus {
  outline: none;
  border-color: #50C9C3;
  box-shadow: 0 0 0 3px rgba(80, 201, 195, 0.1);
}

.correction-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #50C9C3 0%, #45B8B2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(80, 201, 195, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(80, 201, 195, 0.4);
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #666;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
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
