<template>
  <div class="homework-detail-container">
    <div class="homework-header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <div class="header-left">
        <h1 class="homework-title">{{ homeworkData.title }}</h1>
        <p class="homework-requirement">{{ homeworkData.requirement }}</p>
      </div>
      <div class="header-right">
        <div class="info-item">
          <span class="info-label">科目</span>
          <span class="info-value">{{ homeworkData.subject }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">总分</span>
          <span class="info-value score">{{ homeworkData.fullScore }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">状态</span>
          <span class="info-value status">{{ homeworkData.homeworkStatus }}</span>
        </div>
      </div>
    </div>

    <div class="homework-body">
      <div class="question-nav">
        <div class="nav-header">
          <span>题目导航</span>
          <span class="question-count">{{ answeredCount }}/{{ questionList.length }}</span>
        </div>
        <div class="nav-list">
          <button
            v-for="index in questionList.length"
            :key="index"
            :class="['nav-item', {
              answered: questionList[index-1] && isAnswered(questionList[index-1]),
              active: activeIndex === index - 1,
              correct: questionList[index-1] && isCorrect(questionList[index-1]),
              wrong: questionList[index-1] && isWrong(questionList[index-1])
            }]"
            @click="questionList[index-1] && scrollToQuestion(index - 1)"
          >
            <span class="question-num">{{ index }}</span>
            <span class="answered-mark" v-if="questionList[index-1] && isAnswered(questionList[index-1]) && homeworkData.homeworkStatus !== '已批改'">✓</span>
            <span class="correct-mark" v-if="questionList[index-1] && isCorrect(questionList[index-1])">✓</span>
            <span class="wrong-mark" v-if="questionList[index-1] && isWrong(questionList[index-1])">✗</span>
          </button>
        </div>
        <div class="nav-progress" v-if="homeworkData.homeworkStatus !== '已批改'">
          <div class="progress-text">已完成 {{ answeredCount }}/{{ questionList.length }}</div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
        </div>
        <div class="nav-progress" v-else>
          <div class="progress-text">正确 {{ correctCount }}/{{ questionList.length }}</div>
          <div class="progress-bar">
            <div class="progress-fill correct" :style="{ width: (correctCount / questionList.length * 100) + '%' }"></div>
          </div>
        </div>
      </div>

      <div class="question-content" ref="questionContentRef">
        <div
          v-for="(question, index) in questionList"
          :key="question.questionId"
          :id="'question-' + index"
          :class="['question-card', { active: activeIndex === index }]"
        >
          <div class="question-header">
            <div class="question-info">
              <span class="question-number">第 {{ index + 1 }} 题</span>
              <span class="question-type">{{ question.questionType }}</span>
              <span class="question-score">（{{ question.questionScore }}分）</span>
            </div>
            <button 
              v-if="homeworkData.homeworkStatus === '已批改'" 
              class="question-btn" 
              @click="goToChat(question, index + 1)"
              title="对此题有疑问"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </button>
          </div>

          <div class="question-body">
            <div class="question-title" v-if="question.title">
              {{ question.title }}
            </div>

            <div class="question-options" v-if="question.questionType === '单选'">
              <label
                v-for="(option, key) in parseOptions(question.options, question.questionType)"
                :key="key"
                :class="[
                  'option-item', 
                  { selected: question.studentAnswer === key },
                  { correct: homeworkData.homeworkStatus === '已批改' && question.correctAnswer === key },
                  { wrong: homeworkData.homeworkStatus === '已批改' && question.studentAnswer === key && question.correctAnswer !== key }
                ]"
              >
                <input
                  type="radio"
                  :name="'question_radio_' + index"
                  :value="key"
                  :checked="question.studentAnswer === key"
                  @change="handleSelectAnswer(question.questionId, key)"
                  :disabled="homeworkData.homeworkStatus === '已批改' || isExpired(homeworkData.deadline)"
                />
                <span class="option-label">{{ key }}</span>
                <span class="option-text">{{ option }}</span>
                <span v-if="homeworkData.homeworkStatus === '已批改' && question.correctAnswer === key" class="option-tag correct-tag">✓ 正确答案</span>
                <span v-if="homeworkData.homeworkStatus === '已批改' && question.studentAnswer === key && question.correctAnswer !== key" class="option-tag wrong-tag">✗ 你的答案</span>
              </label>
            </div>

            <div class="question-options" v-else-if="question.questionType === '判断'">
              <label
                v-for="(option, key) in parseOptions(question.options, question.questionType)"
                :key="key"
                :class="[
                  'option-item', 
                  { selected: question.studentAnswer === key },
                  { correct: homeworkData.homeworkStatus === '已批改' && question.correctAnswer === key },
                  { wrong: homeworkData.homeworkStatus === '已批改' && question.studentAnswer === key && question.correctAnswer !== key }
                ]"
              >
                <input
                  type="radio"
                  :name="'question_radio_' + index"
                  :value="key"
                  :checked="question.studentAnswer === key"
                  @change="handleSelectAnswer(question.questionId, key)"
                  :disabled="homeworkData.homeworkStatus === '已批改' || isExpired(homeworkData.deadline)"
                />
                <span class="option-label">{{ key }}</span>
                <span class="option-text">{{ option }}</span>
                <span v-if="homeworkData.homeworkStatus === '已批改' && question.correctAnswer === key" class="option-tag correct-tag">✓ 正确答案</span>
                <span v-if="homeworkData.homeworkStatus === '已批改' && question.studentAnswer === key && question.correctAnswer !== key" class="option-tag wrong-tag">✗ 你的答案</span>
              </label>
            </div>

            <div class="question-textarea" v-else-if="question.questionType === '简答'">
              <textarea
                v-model="question.studentAnswer"
                placeholder="请输入你的答案..."
                @blur="handleTextAnswer(question.questionId)"
                :disabled="homeworkData.homeworkStatus === '已批改' || isExpired(homeworkData.deadline)"
              ></textarea>
            </div>
          </div>

          <div class="question-footer">
            <div class="answer-info" v-if="question.correctAnswer !== null && question.correctAnswer !== '' && question.studentAnswer !== null && question.studentAnswer !== ''">
              <span class="answer-label">你的答案：</span>
              <span class="answer-value">{{ question.studentAnswer }}</span>
            </div>
            <div class="correct-answer" v-if="question.correctAnswer !== null && question.correctAnswer !== ''">
              <span class="correct-label">正确答案：</span>
              <span class="correct-value">{{ question.correctAnswer }}</span>
            </div>
            <div class="score-info" v-if="question.questionScoreGot !== null">
              <span class="score-label">得分：</span>
              <span class="score-value">{{ question.questionScoreGot }}/{{ question.questionScore }}</span>
            </div>
            <div class="teacher-comment" v-if="question.teacherComment !== null && question.teacherComment !== ''">
              <span class="comment-label">教师评语：</span>
              <span class="comment-value">{{ question.teacherComment }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="homework-footer" v-if="homeworkData.homeworkStatus !== '已批改' && !isExpired(homeworkData.deadline)">
      <button class="submit-btn" @click="showSubmitConfirm">
        提交作业
      </button>
    </div>

    <div class="confirm-modal" v-if="showModal" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>确认提交</h3>
        </div>
        <div class="modal-body">
          <p>确定要提交这份作业吗？</p>
          <p class="warning">提交后将无法修改答案！</p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeModal">取消</button>
          <button class="btn-confirm" @click="submitHomework">确认提交</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { homeworkApi } from '../../api/api';

const route = useRoute();
const router = useRouter();
const homeworkId = ref(route.params.id || 2);

const goBack = () => {
  router.push('/student/homework');
};

const goToChat = (question, questionNumber) => {
  const questionData = {
    questionId: question.questionId,
    questionNumber: questionNumber,
    questionType: question.questionType,
    questionTitle: question.title,
    questionOptions: question.options,
    correctAnswer: question.correctAnswer,
    studentAnswer: question.studentAnswer,
    score: question.questionScoreGot !== null ? question.questionScoreGot : 0,
    fullScore: question.questionScore
  };
  router.push({
    path: '/student/ai-chat',
    query: { question: JSON.stringify(questionData) }
  });
};

const homeworkData = ref({
  homeworkId: 2,
  title: 'Java基础第一章作业',
  requirement: '做完就行了！',
  fullScore: 100,
  subject: '语文',
  homeworkStatus: '已提交（待批改）',
  deadline: ''
});

const questionList = ref([]);
const activeIndex = ref(0);
const showModal = ref(false);
const isSubmitting = ref(false);
const questionContentRef = ref(null);

const answeredCount = computed(() => {
  return questionList.value.filter(q => isAnswered(q)).length;
});

const correctCount = computed(() => {
  return questionList.value.filter(q => isCorrect(q)).length;
});

const progressPercent = computed(() => {
  if (questionList.value.length === 0) return 0;
  return Math.round((answeredCount.value / questionList.value.length) * 100);
});

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

// 去掉选项文本开头重复的 "A." / "A、" / "A）" 等前缀
const stripOptionPrefix = (text) => {
  if (typeof text !== 'string') return text;
  return text.replace(/^\s*[A-Ja-j]\s*[.、．\)）:：]\s*/, '').trim();
};

// 把数字 / 数字字符串索引转成字母（兼容历史答案）
const indexToLetter = (key) => {
  if (typeof key === 'number') return OPTION_LETTERS[key] || String(key);
  if (typeof key === 'string' && /^\d+$/.test(key)) return OPTION_LETTERS[Number(key)] || key;
  return key;
};

// 识别判断题选项文本：正确类 → T，错误类 → F
const judgeKeyByText = (text) => {
  const t = String(text).trim();
  if (/正确|^(T|True|对|√|是)/i.test(t)) return 'T';
  if (/错误|^(F|False|错|×|否)/i.test(t)) return 'F';
  return null;
};

const parseOptions = (optionsStr, type) => {
  if (!optionsStr) return {};
  const isJudge = type === '判断';
  try {
    const parsed = JSON.parse(optionsStr);

    // 判断题：key 统一为 T / F
    if (isJudge) {
      const result = {};
      if (Array.isArray(parsed)) {
        // 先按文本语义分配
        parsed.forEach(item => {
          const k = judgeKeyByText(item);
          if (k && !result[k]) result[k] = stripOptionPrefix(item);
        });
        // 语义没覆盖全的，按顺序补 T、F
        parsed.forEach((item, i) => {
          const fallbackKey = i === 0 ? 'T' : 'F';
          if (!result[fallbackKey] && Object.keys(result).length < parsed.length) {
            result[fallbackKey] = stripOptionPrefix(item);
          }
        });
        return result;
      }
      // 对象：把 true/false、对/错、数字 key 等统一成 T、F
      Object.keys(parsed).forEach(k => {
        const normalized = judgeKeyByText(k) || judgeKeyByText(parsed[k]);
        const finalKey = normalized || (k === '0' ? 'T' : 'F');
        if (!result[finalKey]) result[finalKey] = stripOptionPrefix(parsed[k]);
      });
      return result;
    }

    // 选择题：数组 → A/B/C/D
    if (Array.isArray(parsed)) {
      const result = {};
      parsed.forEach((item, i) => {
        result[OPTION_LETTERS[i] || i] = stripOptionPrefix(item);
      });
      return result;
    }
    // 选择题：数字 key 对象 → A/B/C/D
    const keys = Object.keys(parsed);
    if (keys.length > 0 && keys.every(k => /^\d+$/.test(k))) {
      const sorted = keys.sort((a, b) => Number(a) - Number(b));
      const result = {};
      sorted.forEach((k, i) => {
        result[OPTION_LETTERS[i] || k] = stripOptionPrefix(parsed[k]);
      });
      return result;
    }
    // 普通对象，仅清理文本前缀
    const result = {};
    Object.keys(parsed).forEach(k => {
      result[k] = stripOptionPrefix(parsed[k]);
    });
    return result;
  } catch {
    return {};
  }
};

const isAnswered = (question) => {
  if (!question.studentAnswer) return false;
  if (question.questionType === '简答') {
    return question.studentAnswer.trim().length > 0;
  }
  return question.studentAnswer !== '';
};

const isCorrect = (question) => {
  if (!question.correctAnswer) return false;
  return question.studentAnswer === question.correctAnswer;
};

const isExpired = (deadline) => {
  if (!deadline) return false;
  const deadlineDate = new Date(deadline);
  return deadlineDate < new Date();
};

const isWrong = (question) => {
  if (!question.correctAnswer) return false;
  return question.studentAnswer && question.studentAnswer !== question.correctAnswer;
};

const checkAllAnswered = () => {
  return questionList.value.every(q => isAnswered(q));
};

const scrollToQuestion = (index) => {
  activeIndex.value = index;
  const element = document.getElementById('question-' + index);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const handleSelectAnswer = async (questionId, answer) => {
  if (homeworkData.value.homeworkStatus === '已批改' || isExpired(homeworkData.value.deadline)) {
    return;
  }
  const question = questionList.value.find(q => q.questionId === questionId);
  if (question) {
    question.studentAnswer = answer;
    await saveAnswer(homeworkData.value.homeworkId, questionId, answer);
  }
};

const handleTextAnswer = async (questionId) => {
  if (homeworkData.value.homeworkStatus === '已批改' || isExpired(homeworkData.value.deadline)) {
    return;
  }
  const question = questionList.value.find(q => q.questionId === questionId);
  if (question && question.studentAnswer.trim()) {
    await saveAnswer(homeworkData.value.homeworkId, questionId, question.studentAnswer);
  }
};

const saveAnswer = async (homeworkId, questionId, studentAnswer) => {
  try {
    await homeworkApi.saveAnswer({
      homeworkId,
      questionId,
      studentAnswer
    });
  } catch (error) {
    console.error('保存答案失败:', error);
  }
};

const showSubmitConfirm = () => {
  if (!checkAllAnswered()) {
    alert('请先完成所有题目后再提交！');
    return;
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const submitHomework = async () => {
  isSubmitting.value = true;
  try {
    await homeworkApi.submitWork({
      homeworkId: homeworkData.value.homeworkId
    });
    alert('作业提交成功！');
    closeModal();
    router.push('/student/homework');
  } catch (error) {
    console.error('提交作业失败:', error);
    alert('提交失败，请重试');
  } finally {
    isSubmitting.value = false;
  }
};

const handleScroll = () => {
  const content = questionContentRef.value;
  if (!content) return;

  const scrollTop = content.scrollTop;
  const cards = content.querySelectorAll('.question-card');
  let currentIndex = 0;

  cards.forEach((card, index) => {
    const rect = card.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    if (rect.top - contentRect.top <= 100) {
      currentIndex = index;
    }
  });

  activeIndex.value = currentIndex;
};

const loadHomeworkDetail = async () => {
  try {
    const response = await homeworkApi.getStudentHomeworkDetail(homeworkId.value);
    if (response.code === 1) {
      const data = response.data;
      
      homeworkData.value = {
        homeworkId: data.homeworkId,
        title: data.title,
        requirement: data.requirement,
        fullScore: data.fullScore,
        subject: data.subject || '课程',
        homeworkStatus: data.homeworkStatus || '未提交',
        deadline: data.deadline || route.query.deadline
      };
      questionList.value = (data.questionList || []).map(item => {
        // 判断题：布尔值 / true、false 字符串统一成 T、F
        const normalizeJudge = (v) => {
          if (v === true || v === 'true' || v === 'True') return 'T';
          if (v === false || v === 'false' || v === 'False') return 'F';
          return v;
        };
        const rawAnswer = item.studentAnswer != null && item.studentAnswer !== ''
          ? (item.questionType === '判断' ? normalizeJudge(item.studentAnswer) : indexToLetter(item.studentAnswer))
          : '';
        const rawCorrect = item.correctAnswer != null
          ? (item.questionType === '判断' ? normalizeJudge(item.correctAnswer) : indexToLetter(item.correctAnswer))
          : item.correctAnswer;
        return {
          questionId: item.questionId,
          homeworkId: item.homeworkId,
          questionScore: item.questionScore,
          questionScoreGot: item.questionScoreGot,
          questionType: item.questionType,
          title: item.title,
          options: item.options,
          studentAnswer: rawAnswer,
          correctAnswer: rawCorrect,
          questionSubmitStatus: item.questionSubmitStatus,
          teacherComment: item.teacherComment
        };
      });
    }
  } catch (error) {
    console.error('加载作业详情失败:', error);
    questionList.value = [
      {
        questionId: 1,
        homeworkId: 2,
        questionScore: 5,
        questionScoreGot: null,
        questionType: '单选',
        title: 'Java中int是引用数据类型，是否正确？',
        options: '{"A": "String", "B": "int", "C": "Object", "D": "ArrayList"}',
        studentAnswer: 'B',
        correctAnswer: null,
        questionSubmitStatus: null
      },
      {
        questionId: 2,
        homeworkId: 2,
        questionScore: 2,
        questionScoreGot: null,
        questionType: '判断',
        title: 'Java中所有的类都是Object类的子类',
        options: '{"F": "错误", "T": "正确"}',
        studentAnswer: 'F',
        correctAnswer: null,
        questionSubmitStatus: null
      },
      {
        questionId: 3,
        homeworkId: 2,
        questionScore: 10,
        questionScoreGot: null,
        questionType: '简答',
        title: '请简述SpringBoot的自动配置原理',
        options: null,
        studentAnswer: 'SpringBoot的自动配置原理是依靠@EnableAutoConfiguration注解，根据项目中依赖的jar包自动配置bean，简化开发。',
        correctAnswer: null,
        questionSubmitStatus: null
      }
    ];
  }
};

onMounted(() => {
  loadHomeworkDetail();
  if (questionContentRef.value) {
    questionContentRef.value.addEventListener('scroll', handleScroll);
  }
});

onUnmounted(() => {
  if (questionContentRef.value) {
    questionContentRef.value.removeEventListener('scroll', handleScroll);
  }
});
</script>

<style scoped>
.homework-detail-container {
  height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.homework-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: linear-gradient(135deg, #50C9C3 0%, #45B8B2 100%);
  padding: 24px 32px;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(80, 201, 195, 0.2);
  flex-shrink: 0;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 20px;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.header-left {
  flex: 1;
}

.homework-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 10px 0;
}

.homework-requirement {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
}

.header-right {
  display: flex;
  gap: 24px;
}

.info-item {
  text-align: center;
}

.info-label {
  display: block;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4px;
}

.info-value {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
}

.info-value.score {
  font-size: 1.5rem;
}

.info-value.status {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.homework-body {
  display: flex;
  gap: 24px;
  flex: 1;
  overflow: hidden;
}

.question-nav {
  width: 200px;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  flex-shrink: 0;
  max-height: 100%;
  overflow-y: auto;
}

.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.nav-header span {
  font-weight: 600;
  color: #333;
}

.question-count {
  font-size: 0.9rem;
  color: #666;
}

.nav-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.nav-item {
  width: 36px;
  height: 36px;
  border: none;
  background: #f5f7fa;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  position: relative;
  text-align: left;
  padding-left: 8px;
}

.nav-item:hover {
  background: #e6f7f6;
  color: #50C9C3;
}

.nav-item.active {
  background: #50C9C3;
  color: #fff;
}

.nav-item.answered:not(.active) {
  background: #e6f7f6;
  border: 2px solid #50C9C3;
  color: #50C9C3;
}

.nav-item.correct:not(.active) {
  background: #f6fffe;
  border: 2px solid #52c41a;
  color: #52c41a;
}

.nav-item.wrong:not(.active) {
  background: #fff2f0;
  border: 2px solid #ff4d4f;
  color: #ff4d4f;
}

.question-num {
  font-size: 0.95rem;
  font-weight: 500;
}

.answered-mark {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 16px;
  height: 16px;
  background: #52c41a;
  color: #fff;
  border-radius: 50%;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.correct-mark,
.wrong-mark {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.correct-mark {
  background: #52c41a;
  color: #fff;
}

.wrong-mark {
  background: #ff4d4f;
  color: #fff;
}

.nav-progress {
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.progress-text {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 8px;
}

.progress-bar {
  height: 6px;
  background: #e6f7f6;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #50C9C3, #45B8B2);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-fill.correct {
  background: linear-gradient(90deg, #52c41a, #73d13d);
}

.question-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
  padding-bottom: 80px;
}

.question-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  margin-bottom: 20px;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.question-card:last-child {
  margin-bottom: 0;
}

.question-card.active {
  border-color: #50C9C3;
  box-shadow: 0 4px 20px rgba(80, 201, 195, 0.2);
}

.question-header {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.question-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.question-btn {
  background: #fff3e0;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff9800;
  transition: all 0.2s ease;
}

.question-btn:hover {
  background: #ffe0b2;
  transform: scale(1.1);
}

.question-number {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.question-type {
  display: inline-block;
  background: #e6f7f6;
  color: #50C9C3;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  margin-left: 12px;
}

.question-score {
  color: #666;
  font-size: 0.95rem;
  margin-left: 8px;
}

.question-body {
  min-height: 100px;
}

.question-title {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 20px;
  line-height: 1.8;
  font-weight: 500;
  text-align: left;
}

.question-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: #fafafa;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.option-item:hover {
  background: #f6fffe;
}

.option-item.selected {
  background: #e6f7f6;
  border-color: #50C9C3;
}

.option-item.correct {
  background: #e8f5e9;
  border-color: #4caf50;
}

.option-item.correct .option-label {
  background: #4caf50;
  color: #fff;
  border-color: #4caf50;
}

.option-item.wrong {
  background: #ffebee;
  border-color: #f44336;
}

.option-item.wrong .option-label {
  background: #f44336;
  color: #fff;
  border-color: #f44336;
}

.option-tag {
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 4px;
  font-weight: 500;
  margin-left: auto;
}

.correct-tag {
  background: #4caf50;
  color: #fff;
}

.wrong-tag {
  background: #f44336;
  color: #fff;
}

.option-item input[type="radio"] {
  width: 18px;
  height: 18px;
  margin-right: 12px;
  accent-color: #50C9C3;
}

.option-label {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 50%;
  font-weight: 600;
  color: #666;
  margin-right: 14px;
  border: 2px solid #ddd;
  transition: all 0.2s ease;
}

.option-item.selected .option-label {
  background: #50C9C3;
  color: #fff;
  border-color: #50C9C3;
}

.option-text {
  flex: 1;
  font-size: 1rem;
  color: #333;
  text-align: left;
}

.question-textarea textarea {
  width: 100%;
  min-height: 120px;
  padding: 16px;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  resize: vertical;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.question-textarea textarea:focus {
  outline: none;
  border-color: #50C9C3;
  box-shadow: 0 0 0 3px rgba(80, 201, 195, 0.1);
}

.question-footer {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 20px;
}

.answer-info,
.correct-answer,
.score-info,
.teacher-comment {
  display: flex;
  align-items: center;
}

.answer-label,
.correct-label,
.score-label,
.comment-label {
  font-size: 0.9rem;
  color: #666;
}

.answer-value,
.correct-value,
.score-value,
.comment-value {
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  margin-left: 6px;
}

.correct-value {
  color: #52c41a;
}

.score-value {
  color: #50C9C3;
}

.teacher-comment {
  margin-top: 8px;
  padding: 12px;
  background: #fffbe6;
  border-radius: 8px;
  border-left: 4px solid #faad14;
}

.comment-value {
  color: #d48806;
}

.homework-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 16px 24px;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: center;
  z-index: 200;
}

.submit-btn {
  padding: 14px 48px;
  background: linear-gradient(135deg, #50C9C3 0%, #45B8B2 100%);
  color: #fff;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(80, 201, 195, 0.3);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(80, 201, 195, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.confirm-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 16px;
  width: 90%;
  max-width: 420px;
  overflow: hidden;
  animation: modalFadeIn 0.2s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.modal-body {
  padding: 24px;
}

.modal-body p {
  margin: 0 0 10px 0;
  color: #666;
}

.modal-body .warning {
  color: #f57c00;
  font-size: 0.9rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #eee;
}

.btn-cancel {
  padding: 10px 24px;
  background: #f5f7fa;
  color: #666;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-cancel:hover {
  background: #eee;
}

.btn-confirm {
  padding: 10px 24px;
  background: #50C9C3;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-confirm:hover {
  background: #45B8B2;
}

@media (max-width: 768px) {
  .homework-header {
    flex-direction: column;
    gap: 20px;
  }

  .header-right {
    flex-wrap: wrap;
    gap: 16px;
  }

  .homework-body {
    flex-direction: column;
  }

  .question-nav {
    width: 100%;
    position: static;
    max-height: none;
  }

  .nav-list {
    grid-template-columns: repeat(10, 1fr);
  }

  .question-content {
    max-height: none;
  }
}
</style>